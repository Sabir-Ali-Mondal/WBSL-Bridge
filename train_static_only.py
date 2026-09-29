"""
train_static_only.py — Trains an MLP model exclusively on static hold-sequences.
Saves output to models/onnx_models/<next_id>/
Run:  & "tests\.venv\Scripts\python.exe" train_static_only.py
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
RAW_S = ROOT / "dataset_train" / "unified_static"

# Correct output directory inside the models folder
ONNX_MODELS_DIR = ROOT / "models" / "onnx_models"
ONNX_MODELS_DIR.mkdir(parents=True, exist_ok=True)

SEQ_T, DIM = 32, 126
EPOCHS, BS, LR = 50, 64, 1e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ─────────────────────────────────────────────
# AUTO-VERSIONING HELPER
# ─────────────────────────────────────────────
def get_next_model_id() -> int:
    """Scans models/onnx_models/ for existing integer folders and returns the next ID."""
    existing_ids = []
    for p in ONNX_MODELS_DIR.iterdir():
        if p.is_dir() and p.name.isdigit():
            existing_ids.append(int(p.name))
    return max(existing_ids, default=0) + 1

# ─────────────────────────────────────────────
# DATASET & MODEL
# ─────────────────────────────────────────────
class StaticDS(Dataset):
    def __init__(self, pool_data):
        self.data = pool_data
        self.items = []
        for ci, arr in enumerate(self.data):
            for r in range(len(arr)):
                self.items.append((ci, r))
                
    def __len__(self):
        return len(self.items)
        
    def __getitem__(self, idx):
        ci, r = self.items[idx]
        # Take the mean of the 32-frame hold sequence to get a single 126-dim vector
        seq = self.data[ci][r].mean(axis=0).astype(np.float32)
        return torch.from_numpy(seq), ci

class StaticMLP(nn.Module):
    def __init__(self, din, hid, n):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(din, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, n)
        )

    def forward(self, x):
        return self.net(x)

# ─────────────────────────────────────────────
# TRAINING
# ─────────────────────────────────────────────
def train():
    print("=" * 70)
    print(" TRAINING STATIC-ONLY MLP MODEL ".center(70))
    print("=" * 70)
    
    # Load static classes (0-9, A-Z)
    npy_files = sorted(RAW_S.glob("*.npy"))
    classes = [p.stem for p in npy_files]
    total_classes = len(classes)
    
    if total_classes == 0:
        print(" ERROR: No extracted static data found in dataset_train/unified_static/")
        return

    print(f" TARGET CLASSES: {total_classes} ({', '.join(classes)})")
    print(f" DEVICE: {DEVICE.upper()}")
    print(f" EPOCHS: {EPOCHS} | BATCH SIZE: {BS} | LR: {LR}")
    print("-" * 70)
    
    rng = np.random.default_rng(42)
    train_pools, val_pools = [], []
    
    for c in classes:
        path = RAW_S / f"{c}.npy"
        arr = np.load(path)
        # arr shape: (N, 32, 126)
        arr = arr[rng.permutation(len(arr))]
        nv = max(2, int(0.15 * len(arr)))
        val_pools.append(arr[:nv])
        train_pools.append(arr[nv:])
        
    model_classes = len(classes)
    
    tr_ds = StaticDS(train_pools)
    va_ds = StaticDS(val_pools)
    
    dl_tr = DataLoader(tr_ds, BS, shuffle=True, drop_last=True)
    dl_va = DataLoader(va_ds, 128)
    
    model = StaticMLP(DIM, 128, model_classes).to(DEVICE)
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
    print(f" TRAINING COMPLETE. Best Val Acc: {best:.1f}% over {model_classes} classes")
    print(f" Total Training Time: {(time.time() - train_start)/60:.1f} minutes")
    
    # Auto-versioning save
    model_id = get_next_model_id()
    model_dir = ONNX_MODELS_DIR / str(model_id)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"\n Exporting to models/onnx_models/{model_id}/ ...")
    model.eval().cpu()
    
    out_model = model_dir / "sign_static_mlp.onnx"
    out_classes = model_dir / "sign_static_classes.json"
    out_report = model_dir / "static_report.json"
    
    # Export ONNX (Input is a single 126-dim vector)
    torch.onnx.export(model, torch.randn(1, DIM), str(out_model),
                      opset_version=18, input_names=["features"], output_names=["logits"],
                      dynamic_axes={"features": {0: "batch"}, "logits": {0: "batch"}})
                      
    json.dump(classes, open(out_classes, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"classes": model_classes, "type": "static_mlp",
               "best_val_acc": best, "feat": DIM},
              open(out_report, "w", encoding="utf-8"), indent=1)
              
    print(f" Saved to models/onnx_models/{model_id}/:")
    print(f"   - sign_static_mlp.onnx")
    print(f"   - sign_static_classes.json")
    print(f"   - static_report.json")

if __name__ == "__main__":
    train()