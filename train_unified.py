"""
train_unified.py — VIDEO-ONLY model for dynamic signs.
Auto-saves to onnx_models/<next_id>/ (e.g., onnx_models/1/, onnx_models/2/)
Modes: 1=extract video sequences  2=train + export ONNX  3=ALL
Run:  & "tests\.venv\Scripts\python.exe" train_unified.py
"""
import json
import time
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

# ─────────────────────────────────────────────
# PATHS & CONFIG
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent
DS_CANDIDATES = [
    Path(r"D:\Download\Projects\Indian Sign Language_Dataset"),   # external location
    ROOT / "dataset" / "Indian Sign Language_Dataset",            # in-repo copy
]

# Robustly find the dataset path by checking for actual subdirectories
DS = None
for p in DS_CANDIDATES:
    if p.exists() and (p / "ISL_VIDEO").exists():
        DS = p
        break

if DS is None:
    print("=" * 70)
    print(" ERROR: DATASET NOT FOUND")
    print("=" * 70)
    print(" The script could not find the required dataset folders.")
    print(" Checked locations:")
    for p in DS_CANDIDATES:
        status = "EXISTS (but missing subfolders)" if p.exists() else "NOT FOUND"
        print(f"   - {p} [{status}]")
    print("\n Please ensure the dataset directory contains:")
    print("   - ISL_VIDEO/")
    sys.exit(1)

VD = DS / "ISL_VIDEO"
OUT = ROOT / "dataset_train"
RAW_V = OUT / "unified_video"

# Auto-versioning directory
ONNX_MODELS_DIR = ROOT / "onnx_models"
ONNX_MODELS_DIR.mkdir(parents=True, exist_ok=True)

for d in (OUT, RAW_V):
    d.mkdir(parents=True, exist_ok=True)

# Folder name -> official gloss token
GLOSS_OVERRIDE = {"Fedup": "FED_UP"}

def video_gloss(folder_name: str) -> str:
    return GLOSS_OVERRIDE.get(folder_name, folder_name.upper().replace(" ", "_"))

SEQ_T, DIM = 32, 126
AUG_VIDEO = 4
EPOCHS, BS, LR = 20, 64, 1e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize MediaPipe ONCE
_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)

# ─────────────────────────────────────────────
# AUTO-VERSIONING HELPER
# ─────────────────────────────────────────────
def get_next_model_id() -> int:
    """Scans onnx_models/ for existing integer folders and returns the next ID."""
    existing_ids = []
    for p in ONNX_MODELS_DIR.iterdir():
        if p.is_dir() and p.name.isdigit():
            existing_ids.append(int(p.name))
    return max(existing_ids, default=0) + 1

# ─────────────────────────────────────────────
# UI / LOGGING HELPERS
# ─────────────────────────────────────────────
def print_header(title: str):
    width = 70
    print("\n" + "=" * width)
    print(f" {title}".center(width))
    print("=" * width)

class ProgressTracker:
    """Lightweight progress tracker with ETA calculation."""
    def __init__(self, total: int, prefix: str = ""):
        self.total = total
        self.prefix = prefix
        self.start_time = time.time()
        self.count = 0
        self.skipped_count = 0

    def update(self, item_name: str, skipped: bool = False):
        self.count += 1
        if skipped:
            self.skipped_count += 1
            
        elapsed = time.time() - self.start_time
        
        if self.count > 0:
            avg_time = elapsed / self.count
            remaining_time = avg_time * (self.total - self.count)
        else:
            remaining_time = 0
            
        elapsed_str = f"{int(elapsed//60)}m {int(elapsed%60)}s"
        eta_str = f"{int(remaining_time//60)}m {int(remaining_time%60)}s" if remaining_time > 60 else f"{int(remaining_time)}s"
            
        status = "SKIP" if skipped else "DONE"
        pct = (self.count / self.total) * 100
        
        line = f"\r  {self.prefix} [{self.count:3d}/{self.total}] ({pct:5.1f}%) | {status:4} | {item_name:<25} | Elapsed: {elapsed_str:>7} | ETA: {eta_str:>7}"
        sys.stdout.write(line.ljust(130)) 
        sys.stdout.flush()
        
        if self.count == self.total:
            sys.stdout.write("\n")
            sys.stdout.flush()
            print(f"  -> Summary: {self.total - self.skipped_count} processed, {self.skipped_count} skipped.")

# ─────────────────────────────────────────────
# EXTRACTION LOGIC
# ─────────────────────────────────────────────
def extract_two_hands(res):
    """IDENTICAL to backend/extract.py — do not change."""
    if not res.multi_hand_landmarks:
        return None
    left = right = None
    for hlm, hn in zip(res.multi_hand_landmarks, res.multi_handedness):
        lab = hn.classification[0].label
        pts = np.array([[p.x, p.y, p.z] for p in hlm.landmark], np.float32)
        if lab == "Left" and left is None: left = pts
        if lab == "Right" and right is None: right = pts
        
    ref = right if right is not None else left
    if ref is None: return None
    
    r0, scale = ref[0], np.linalg.norm(ref[9] - ref[0]) + 1e-6
    ol = (left - r0) / scale if left is not None else np.zeros((21, 3), np.float32)
    or_ = (right - r0) / scale if right is not None else np.zeros((21, 3), np.float32)
    return np.concatenate([ol.flatten(), or_.flatten()]).astype(np.float32)

def vec_from_bgr(frame):
    return extract_two_hands(_hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))

def resample(seq, t):
    if len(seq) == t: return seq.astype(np.float32)
    ix = np.linspace(0, len(seq) - 1, t)
    i0, i1 = ix.astype(int), np.minimum(ix.astype(int) + 1, len(seq) - 1)
    f = (ix - i0)[:, None]
    return (seq[i0] * (1 - f) + seq[i1] * f).astype(np.float32)

def extract_video_sequence(path):
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened(): 
        return None
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None
        
    frames, last, good = [], None, 0
    for ix in np.linspace(0, F - 1, SEQ_T).astype(int):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            frames.append(None)
            continue
        v = vec_from_bgr(fr)
        if v is not None:
            last = v
            good += 1
        frames.append(v if v is not None else last)
    cap.release()
    
    if good < SEQ_T // 2: return None
    return np.array([f if f is not None else np.zeros(DIM, np.float32) for f in frames], np.float32)

def build_video(force=False):
    print_header("EXTRACTING VIDEO SEQUENCES")
    dirs = sorted([d for d in VD.iterdir() if d.is_dir()])
    tracker = ProgressTracker(len(dirs), prefix="VIDEO ")
    
    for vd in dirs:
        gloss = video_gloss(vd.name)
        out_path = RAW_V / f"{gloss}.npy"
        
        if not force and out_path.exists():
            tracker.update(gloss, skipped=True)
            continue
            
        vids = sorted(vd.glob("*.mp4"))
        seqs = [s for s in (extract_video_sequence(f) for f in vids) if s is not None]
        
        if seqs: np.save(out_path, np.stack(seqs))
        tracker.update(gloss)

# ─────────────────────────────────────────────
# AUGMENTATION & DATASET
# ─────────────────────────────────────────────
def augment(seq, rng):
    s = seq.copy()
    if rng.random() < 0.5:
        L = s[:, :63].reshape(SEQ_T, 21, 3)
        R = s[:, 63:].reshape(SEQ_T, 21, 3)
        L[:, :, 0] *= -1; R[:, :, 0] *= -1
        s = np.concatenate([R.reshape(SEQ_T, 63), L.reshape(SEQ_T, 63)], axis=1)
    if rng.random() < 0.6:
        th = rng.uniform(-0.35, 0.35)
        c, sn = np.cos(th), np.sin(th)
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] = p[:, :, :2] @ np.array([[c, -sn], [sn, c]]).T
        s = p.reshape(SEQ_T, DIM)
        
    if rng.random() < 0.6: 
        s *= rng.uniform(0.85, 1.15)
        
    if rng.random() < 0.5:
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] += rng.uniform(-0.12, 0.12, 2)
        s = p.reshape(SEQ_T, DIM)
        
    s += rng.normal(0, 0.006, s.shape).astype(np.float32)
    
    if rng.random() < 0.6:
        s = resample(s, int(rng.integers(24, 41)))
        s = resample(s, SEQ_T)
        
    return s.astype(np.float32)

# ─────────────────────────────────────────────
# MODEL & TRAINING
# ─────────────────────────────────────────────
class UniLSTM(nn.Module):
    def __init__(self, din, hid, n):
        super().__init__()
        self.lstm = nn.LSTM(din, hid, 2, batch_first=True, dropout=0.3)
        self.fc = nn.Linear(hid, n)

    def forward(self, x):
        o, _ = self.lstm(x)
        return self.fc(o[:, -1])

def train():
    print_header("TRAINING VIDEO-ONLY LSTM MODEL")
    video_names = sorted(p.stem for p in RAW_V.glob("*.npy"))
    
    classes = [c for c in video_names if (RAW_V / f"{c}.npy").exists()]
    total_classes = len(classes)
    
    if total_classes == 0:
        print("  ERROR: No extracted video data found. Run extraction first.")
        return

    # Auto-versioning logic
    model_id = get_next_model_id()
    model_dir = ONNX_MODELS_DIR / str(model_id)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"  VOCABULARY: {total_classes} video classes")
    print(f"  DEVICE: {DEVICE.upper()}")
    print(f"  EPOCHS: {EPOCHS} | BATCH SIZE: {BS} | LR: {LR}")
    print(f"  OUTPUT FOLDER: onnx_models/{model_id}/")
    print("-" * 70)
    
    rng = np.random.default_rng(42)
    train_pools, val_pools = [], []
    
    valid_class_indices = []
    for i, c in enumerate(classes):
        path = RAW_V / f"{c}.npy"
        try:
            arr = np.load(path)
            if arr.size == 0 or arr.ndim != 3:
                print(f"  WARNING: Skipping {c} due to invalid shape/size")
                continue
                
            arr = arr[rng.permutation(len(arr))]
            nv = max(1, int(0.15 * len(arr)))
            
            if len(arr) <= 1:
                 continue

            val_pools.append(arr[:nv])
            train_pools.append(arr[nv:])
            valid_class_indices.append(i)
            
        except Exception as e:
            print(f"  ERROR loading {c}: {e}")
            continue

    if not train_pools:
        print("  ERROR: No valid training data loaded.")
        return

    model_classes = len(train_pools)
    valid_classes_list = [classes[i] for i in valid_class_indices]
    
    class VideoDS(Dataset):
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

    tr_v = VideoDS(train_pools, AUG_VIDEO, 2)
    va_v = VideoDS(val_pools, 0, 4)
    
    dl_tr = DataLoader(tr_v, BS, shuffle=True, drop_last=True)
    dl_va = DataLoader(va_v, 128)
    
    model = UniLSTM(DIM, 128, model_classes).to(DEVICE)
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
    print(f"  TRAINING COMPLETE. Best Val Acc: {best:.1f}% over {model_classes} video classes")
    print(f"  Total Training Time: {(time.time() - train_start)/60:.1f} minutes")
    
    print(f"\n  Exporting to onnx_models/{model_id}/ ...")
    model.eval().cpu()
    
    # Define exact output paths inside the new numbered folder
    out_model = model_dir / "sign_video_lstm.onnx"
    out_classes = model_dir / "sign_video_classes.json"
    out_report = model_dir / "video_report.json"
    
    torch.onnx.export(model, torch.randn(1, SEQ_T, DIM), str(out_model),
                      opset_version=18, input_names=["sequence"], output_names=["logits"],
                      dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
                      
    json.dump(valid_classes_list, open(out_classes, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"classes": model_classes, "static": 0, "video": model_classes,
               "best_val_acc": best, "seq_len": SEQ_T, "feat": DIM},
              open(out_report, "w", encoding="utf-8"), indent=1)
              
    print(f"  Saved to onnx_models/{model_id}/:")
    print(f"    - sign_video_lstm.onnx")
    if (model_dir / "sign_video_lstm.onnx.data").exists():
        print(f"    - sign_video_lstm.onnx.data")
    print(f"    - sign_video_classes.json")

# ─────────────────────────────────────────────
# MAIN EXECUTION
# ────────────────────────────────────────────
if __name__ == "__main__":
    print_header("WBSL BRIDGE - VIDEO-ONLY MODEL PIPELINE")
    print("  1 = Extract video sequences (skip existing)")
    print("  2 = Train video-only model + export ONNX")
    print("  3 = Run ALL (Extract + Train)")
    print("  4 = Force re-extract ALL (ignore existing)")
    print("  0 = Exit")
    
    sys.stdout.flush()
    time.sleep(1.5)
    
    ch = input("\nChoose an option: ").strip()
    
    if ch == "0":
        print("Exiting.")
        sys.exit(0)
        
    force = (ch == "4")
    
    if ch in ("1", "3", "4"):
        build_video(force=force)
    if ch in ("2", "3"):
        train()
        
    print_header("PIPELINE FINISHED SUCCESSFULLY")