"""
train_daily_10.py — Trains a focused 10-class model for daily conversation.
Uses existing extracted video data from dataset_train/unified_video/.
Saves output to onnx_models/<next_id>/
"""
import json
import time
import sys
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

# ─────────────────────────────────────────────
# PATHS & CONFIG
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent
RAW_V = ROOT / "dataset_train" / "unified_video"
ONNX_MODELS_DIR = ROOT / "onnx_models"
ONNX_MODELS_DIR.mkdir(parents=True, exist_ok=True)

# The 10 best glosses for day-to-day conversation
TARGET_CLASSES = [
    "HELLO",
    "THANK_YOU",
    "COME",
    "DRINK",
    "GIVE",
    "GOOD_MORNING",
    "TEA",
    "MAN",
    "WIFE",
    "WHAT_IS_YOUR_NAME"
]

SEQ_T, DIM = 32, 126
AUG_K = 4  # Augmentation factor
EPOCHS, BS, LR = 30, 32, 1e-3  # Slightly more epochs for small dataset
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ─────────────────────────────────────────────
# AUTO-VERSIONING HELPER
# ─────────────────────────────────────────────
def get_next_model_id() -> int:
    existing_ids = []
    for p in ONNX_MODELS_DIR.iterdir():
        if p.is_dir() and p.name.isdigit():
            existing_ids.append(int(p.name))
    return max(existing_ids, default=0) + 1

# ─────────────────────────────────────────────
# AUGMENTATION
# ─────────────────────────────────────────────
def resample(seq, t):
    if len(seq) == t: return seq.astype(np.float32)
    ix = np.linspace(0, len(seq) - 1, t)
    i0, i1 = ix.astype(int), np.minimum(ix.astype(int) + 1, len(seq) - 1)
    f = (ix - i0)[:, None]
    return (seq[i0] * (1 - f) + seq[i1] * f).astype(np.float32)

def augment(seq, rng):
    s = seq.copy()
    # Mirror
    if rng.random() < 0.5:
        L = s[:, :63].reshape(SEQ_T, 21, 3)
        R = s[:, 63:].reshape(SEQ_T, 21, 3)
        L[:, :, 0] *= -1; R[:, :, 0] *= -1
        s = np.concatenate([R.reshape(SEQ_T, 63), L.reshape(SEQ_T, 63)], axis=1)
    # Rotation
    if rng.random() < 0.6:
        th = rng.uniform(-0.35, 0.35)
        c, sn = np.cos(th), np.sin(th)
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] = p[:, :, :2] @ np.array([[c, -sn], [sn, c]]).T
        s = p.reshape(SEQ_T, DIM)
    # Scale
    if rng.random() < 0.6: 
        s *= rng.uniform(0.85, 1.15)
    # Translation
    if rng.random() < 0.5:
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] += rng.uniform(-0.12, 0.12, 2)
        s = p.reshape(SEQ_T, DIM)
    # Noise
    s += rng.normal(0, 0.006, s.shape).astype(np.float32)
    # Temporal resampling
    if rng.random() < 0.6:
        s = resample(s, int(rng.integers(24, 41)))
        s = resample(s, SEQ_T)
    return s.astype(np.float32)

# ─────────────────────────────────────────────
# DATASET & MODEL
# ─────────────────────────────────────────────
class DailyDS(Dataset):
    def __init__(self, pool_data, aug_k, rng_seed):
        self.data = pool_data
        self.aug_k = aug_k
        self.rng = np.random.default_rng(rng_seed)
        self.items = []
        for ci, arr in enumerate(self.data):
            for r in range(len(arr)):
                self.items.append((ci, r, 0))
                for k in range(aug_k):
                    self.items.append((ci, r, k+1))
                    
    def __len__(self):
        return len(self.items)
        
    def __getitem__(self, idx):
        ci, r, copy = self.items[idx]
        seq = self.data[ci][r].copy()
        if copy > 0:
            seq = augment(seq, self.rng)
        return torch.from_numpy(seq), ci

class DailyLSTM(nn.Module):
    def __init__(self, din, hid, n):
        super().__init__()
        self.lstm = nn.LSTM(din, hid, 2, batch_first=True, dropout=0.3)
        self.fc = nn.Linear(hid, n)

    def forward(self, x):
        o, _ = self.lstm(x)
        return self.fc(o[:, -1])

# ─────────────────────────────────────────────
# TRAINING
# ─────────────────────────────────────────────
def train():
    print("=" * 70)
    print(" TRAINING DAILY 10-CLASS LSTM MODEL ".center(70))
    print("=" * 70)
    
    # Check files exist
    missing = [c for c in TARGET_CLASSES if not (RAW_V / f"{c}.npy").exists()]
    if missing:
        print(f" ERROR: Missing extracted data for: {missing}")
        print(" Please run extraction first.")
        return
        
    print(f" TARGET CLASSES: {len(TARGET_CLASSES)}")
    print(f" DEVICE: {DEVICE.upper()}")
    print(f" EPOCHS: {EPOCHS} | BATCH SIZE: {BS} | LR: {LR}")
    print("-" * 70)
    
    rng = np.random.default_rng(42)
    train_pools, val_pools = [], []
    
    for c in TARGET_CLASSES:
        path = RAW_V / f"{c}.npy"
        arr = np.load(path)
        # arr shape: (60, 32, 126)
        arr = arr[rng.permutation(len(arr))]
        nv = max(1, int(0.20 * len(arr))) # 20% for validation since dataset is small
        val_pools.append(arr[:nv])
        train_pools.append(arr[nv:])
        
    model_classes = len(TARGET_CLASSES)
    
    tr_ds = DailyDS(train_pools, AUG_K, 1)
    va_ds = DailyDS(val_pools, 0, 2)
    
    dl_tr = DataLoader(tr_ds, BS, shuffle=True, drop_last=True)
    dl_va = DataLoader(va_ds, 64)
    
    model = DailyLSTM(DIM, 128, model_classes).to(DEVICE)
    crit, opt = nn.CrossEntropyLoss(), torch.optim.Adam(model.parameters(), LR)
    best = 0.0
    train_start = time.time()
    
    for e in range(EPOCHS):
        epoch_start = time.time()
        model.train()
        for xb, yb in dl_tr:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            loss = crit(model(xb), yb)
            loss.backward()
            opt.step()
            
        model.eval()
        c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                pr = model(xb.to(DEVICE)).argmax(1)
                yb = yb.to(DEVICE)
                c += (pr == yb).sum().item()
                t += len(yb)
                
        acc = c / t * 100 if t > 0 else 0
        best = max(best, acc)
        
        epoch_time = time.time() - epoch_start
        total_elapsed = time.time() - train_start
        avg_epoch_time = total_elapsed / (e + 1)
        eta = avg_epoch_time * (EPOCHS - (e + 1))
        
        print(f"  Epoch {e+1:2d}/{EPOCHS} | Val: {acc:5.1f}% (Best: {best:5.1f}%) | "
              f"Time: {epoch_time:5.1f}s | ETA: {eta/60:5.1f}m")
              
    print("-" * 70)
    print(f"  TRAINING COMPLETE. Best Val Acc: {best:.1f}% over {model_classes} classes")
    print(f"  Total Training Time: {(time.time() - train_start)/60:.1f} minutes")
    
    # Auto-versioning save
    model_id = get_next_model_id()
    model_dir = ONNX_MODELS_DIR / str(model_id)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n  Exporting to onnx_models/{model_id}/ ...")
    model.eval().cpu()
    
    out_model = model_dir / "sign_daily_lstm.onnx"
    out_classes = model_dir / "sign_daily_classes.json"
    out_report = model_dir / "daily_report.json"
    
    torch.onnx.export(model, torch.randn(1, SEQ_T, DIM), str(out_model),
                      opset_version=18, input_names=["sequence"], output_names=["logits"],
                      dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
                      
    json.dump(TARGET_CLASSES, open(out_classes, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"classes": model_classes, "static": 0, "video": model_classes,
               "best_val_acc": best, "seq_len": SEQ_T, "feat": DIM, "target_glosses": TARGET_CLASSES},
              open(out_report, "w", encoding="utf-8"), indent=1)
              
    print(f"  Saved to onnx_models/{model_id}/:")
    print(f"    - sign_daily_lstm.onnx")
    print(f"    - sign_daily_classes.json")

if __name__ == "__main__":
    train()