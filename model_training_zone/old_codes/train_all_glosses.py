"""
train_all_glosses.py — Full-vocabulary LSTM training + 3D Avatar .npy sidecars.

This dual-purpose pipeline bridges backend classification with frontend 3D rendering
within a single auto-discoverable registry bundle.

First, it dynamically discovers all available sign glosses to build a complete vocabulary.
Second, it extracts 258-dimensional normalized features to train a BiLSTM classifier
with attention pooling and a "NONE" idle class, optimized for a rapid 15-epoch bootstrap.
Third, it simultaneously captures raw MediaPipe Holistic landmarks per frame: 33 body
pose points, 42 hand joints (21 per hand), and the dense 468-point face mesh.
Finally, it exports both the 258-dim model data and the raw 3D landmark sequences 
directly into models/onnx_models/<next_id>/npy/. The registry auto-discovers this 
unified bundle, allowing the frontend to render high-fidelity 3D avatars directly 
from the sidecars without heavy browser-side MediaPipe processing.
"""

import argparse
import json
import sys
import time
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

ROOT = Path(__file__).resolve().parent.parent
TRAINING_ZONE = ROOT / "model_training_zone"
sys.path.insert(0, str(ROOT))

from backend.pose import POSE_DIM, pose_from_landmarks  # noqa: E402

DS = TRAINING_ZONE / "dataset" / "Indian Sign Language_Dataset"
if not (DS / "ISL_VIDEO").exists():
    sys.exit("Dataset not found (ISL_VIDEO missing)")

VD = DS / "ISL_VIDEO"
RAW = TRAINING_ZONE / "dataset_train" / "daily_video"
MODELS = ROOT / "models" / "onnx_models"

MODELS.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

TARGETS = sorted([p.name for p in VD.iterdir() if p.is_dir() and any(p.glob("*.mp4"))])
if not TARGETS:
    sys.exit("No video gloss folders found in ISL_VIDEO")

CLASSES = [t.upper().replace(" ", "_") for t in TARGETS] + ["NONE"]
SEQ_T, DIM = 32, 126 + POSE_DIM  # 126 (hands) + 132 (pose) = 258

AUG_K, EPOCHS, BS, LR = 4, 15, 32, 2e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

_hol = mp.solutions.holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5)


def extract_frame_data(bgr):
    """Extracts raw MediaPipe landmarks for both the 258-dim model and 3D viewer."""
    res = _hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    
    # 1. Face Mesh (468 x 3) for 3D Viewer
    face = None
    if res.face_landmarks:
        face = np.array([[p.x, p.y, p.z] for p in res.face_landmarks.landmark], np.float32)
        
    # 2. Pose, Hands for 258-dim Model & 3D Viewer
    if not res.left_hand_landmarks or not res.right_hand_landmarks or res.pose_landmarks is None:
        return None, face, None, None
        
    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    pose_raw = np.array([[p.x, p.y, p.z, p.visibility] for p in res.pose_landmarks.landmark], np.float32)
    
    # Use the backend function to get the full 132-dim pose features
    pose = pose_from_landmarks(res.pose_landmarks)
    
    # Normalize for the 258-dim LSTM (relative to right hand)
    ref, scale = rh[0], np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh_norm = (lh - ref) / scale
    rh_norm = (rh - ref) / scale
    pose_norm = pose.copy()
    pose_norm[:, :3] = (pose_norm[:, :3] - ref) / scale
    
    # Flatten correctly to 258 dims: 63 (lh) + 63 (rh) + 132 (pose)
    model_features = np.concatenate([lh_norm.flatten(), rh_norm.flatten(), pose_norm.flatten()]).astype(np.float32)
    
    return model_features, face, pose_raw, np.concatenate([lh, rh], axis=0)


def process_video(path, start_frac, end_frac):
    """Samples SEQ_T frames and extracts model features + 3D simulation arrays."""
    cap = cv2.VideoCapture(str(path))
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None, None, None, None
        
    idxs = np.linspace(int(F * start_frac), max(int(F * start_frac) + 1, int(F * end_frac) - 1), SEQ_T).astype(int)
    
    out_feat, out_face, out_pose, out_hands = [], [], [], []
    last_feat, good = None, 0
    
    for ix in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            out_feat.append(None); out_face.append(None); out_pose.append(None); out_hands.append(None)
            continue
            
        feat, face, pose_raw, hands_raw = extract_frame_data(fr)
        if feat is not None:
            last_feat = feat
            good += 1
            
        out_feat.append(feat if feat is not None else last_feat)
        out_face.append(face if face is not None else np.zeros((468, 3), np.float32))
        out_pose.append(pose_raw if pose_raw is not None else np.zeros((33, 4), np.float32))
        out_hands.append(hands_raw if hands_raw is not None else np.zeros((42, 3), np.float32))
        
    cap.release()
    
    if good < SEQ_T // 2:
        return None, None, None, None
        
    # Format for LSTM (258-dim)
    features = np.array([o if o is not None else np.zeros(DIM, np.float32) for o in out_feat], np.float32)
    
    # Format for React 3D Viewer (Raw 3D coordinates)
    face_mesh = np.stack(out_face).astype(np.float32)
    pose_3d = np.stack(out_pose).astype(np.float32)
    hands_3d = np.stack(out_hands).astype(np.float32)
    
    return features, face_mesh, pose_3d, hands_3d


def build(force, model_dir):
    print("=" * 70)
    print(f" EXTRACTING ALL GLOSSES ({len(TARGETS)} CLASSES) + 3D SIM NPY".center(70))
    print("=" * 70)
    
    # Everything goes into the registry bundle's npy folder
    sequence_dir = model_dir / "npy"
    sequence_dir.mkdir(parents=True, exist_ok=True)
    t0 = time.time()

    for t in TARGETS:
        g = t.upper().replace(" ", "_")
        dest = RAW / f"{g}.npy"
        vids = sorted((VD / t).glob("*.mp4"))
        
        stored_sequences = np.load(dest, mmap_mode="r", allow_pickle=False) if not force and dest.exists() else None

        if stored_sequences is not None and vids and len(stored_sequences) == len(vids):
            sequences = stored_sequences
            sequence_count = len(sequences)
            
            # Generate 3D Sim .npy sidecars if missing
            sim_pose_dest = sequence_dir / f"{g}_pose.npy"
            if force or not sim_pose_dest.exists():
                print(f"  Generating 3D Sim sidecars for {g}...")
                all_poses, all_hands, all_faces = [], [], []
                for video in vids:
                    _, face, pose, hands = process_video(video, 0.10, 0.90)
                    if pose is not None:
                        all_poses.append(pose)
                        all_hands.append(hands)
                        all_faces.append(face)
                if all_poses:
                    np.save(sequence_dir / f"{g}_pose.npy", np.stack(all_poses))
                    np.save(sequence_dir / f"{g}_hands.npy", np.stack(all_hands))
                    np.save(sequence_dir / f"{g}_face.npy", np.stack(all_faces))
        else:
            extracted = [process_video(video, 0.10, 0.90) for video in vids]
            valid = [(feat, face, pose, hands) for feat, face, pose, hands in extracted if feat is not None]
            
            sequences = [feat for feat, _, _, _ in valid]
            faces = [face for _, face, _, _ in valid]
            poses = [pose for _, _, pose, _ in valid]
            hands_list = [hands for _, _, _, hands in valid]
            
            if sequences and (force or stored_sequences is None):
                # Save 258-dim features to cache and bundle
                np.save(dest, np.stack(sequences))
                np.save(sequence_dir / f"{g}.npy", np.stack(sequences))
                
                # Export 3D Simulation sidecars directly to the bundle
                if poses:
                    np.save(sequence_dir / f"{g}_pose.npy", np.stack(poses))
                    np.save(sequence_dir / f"{g}_hands.npy", np.stack(hands_list))
                    np.save(sequence_dir / f"{g}_face.npy", np.stack(faces))
                    
            sequence_count = len(sequences)

        print(f"  DONE {g}: {sequence_count}/{len(vids)} (3D .npy sidecars exported)")

    # NONE class extraction (limited to 2 vids/class for speed)
    dest = RAW / "NONE.npy"
    if force or not dest.exists():
        idle = []
        for t in TARGETS:
            vids = sorted((VD / t).glob("*.mp4"))[:2]
            for f in vids:
                for a, b in ((0.0, 0.12), (0.88, 1.0)):
                    s = process_video(f, a, b)[0]
                    if s is not None: idle.append(s)
            for f in vids:
                s = process_video(f, 0.45, 0.55)[0]
                if s is not None: idle.append(np.repeat(s[16:17], SEQ_T, 0).astype(np.float32))
        idle.append(np.zeros((SEQ_T, DIM), np.float32))
        if idle:
            np.save(dest, np.stack(idle))
            np.save(sequence_dir / "NONE.npy", np.stack(idle))
    else:
        # Copy existing NONE to bundle if not re-extracting
        if dest.exists() and not (sequence_dir / "NONE.npy").exists():
            import shutil
            shutil.copyfile(dest, sequence_dir / "NONE.npy")
            
    print(f"  extraction finished in {time.time() - t0:.1f}s")


# ─────────────────────────────────────────────
# AUGMENTATION & DATASET
# ─────────────────────────────────────────────
def interp(s, ix):
    ix = np.clip(ix, 0, len(s) - 1)
    i0 = np.floor(ix).astype(int)
    i1 = np.minimum(i0 + 1, len(s) - 1)
    f = (ix - i0)[:, None]
    return (s[i0] * (1 - f) + s[i1] * f).astype(np.float32)

def aug(seq, rng):
    s = seq.copy()
    if rng.random() < 0.5:
        a, b = int(rng.integers(0, 5)), SEQ_T - int(rng.integers(0, 5))
        s = interp(s[a:b], np.linspace(0, b - a - 1, SEQ_T))
    if rng.random() < 0.5:
        u = np.linspace(0, 1, SEQ_T) + rng.uniform(-0.2, 0.2) * np.sin(np.pi * np.linspace(0, 1, SEQ_T))
        s = interp(s, u * (SEQ_T - 1))
    h = s[:, :126].reshape(SEQ_T, 42, 3).copy()
    p = s[:, 126:].reshape(SEQ_T, 33, 4).copy()
    if rng.random() < 0.6:
        th = rng.uniform(-0.3, 0.3)
        c, sn = np.cos(th), np.sin(th)
        R = np.array([[c, -sn], [sn, c]], np.float32).T
        h[:, :, :2] @= R; p[:, :, :2] @= R
    if rng.random() < 0.6:
        f = rng.uniform(0.85, 1.15); h *= f; p[:, :, :3] *= f
    if rng.random() < 0.5:
        t = rng.uniform(-0.1, 0.1, 2).astype(np.float32)
        h[:, :, :2] += t; p[:, :, :2] += t
    h += rng.normal(0, 0.01, h.shape).astype(np.float32)
    p[:, :, :3] += rng.normal(0, 0.01, p[:, :, :3].shape).astype(np.float32)
    return np.concatenate([h.reshape(SEQ_T, 126), p.reshape(SEQ_T, POSE_DIM)], 1).astype(np.float32)

class SeqDS(Dataset):
    def __init__(self, pools, aug_k, seed):
        self.pools = pools
        self.rng = np.random.default_rng(seed)
        self.items = []
        for ci, arr in enumerate(pools):
            for r in range(len(arr)):
                self.items.append((ci, r, 0))
                self.items += [(ci, r, k + 1) for k in range(aug_k)]
    def __len__(self): return len(self.items)
    def __getitem__(self, i):
        ci, r, k = self.items[i]
        s = self.pools[ci][r].copy()
        return torch.from_numpy(aug(s, self.rng) if k else s), ci

class DailyNet(nn.Module):
    def __init__(self, din, hid, n, drop=0.3):
        super().__init__()
        d = din * 2 + 2
        self.norm = nn.LayerNorm(d)
        self.proj = nn.Sequential(nn.Linear(d, hid), nn.GELU(), nn.Dropout(drop))
        self.lstm = nn.LSTM(hid, hid, 2, batch_first=True, bidirectional=True, dropout=drop)
        self.attn = nn.Linear(2 * hid, 1)
        self.head = nn.Sequential(nn.Dropout(drop), nn.Linear(2 * hid, n))
    def forward(self, x):
        delta = torch.cat([torch.zeros_like(x[:, :1]), x[:, 1:] - x[:, :-1]], 1)
        lm = (x[:, :, :63].abs().sum(-1, keepdim=True) > 0).to(x.dtype)
        rm = (x[:, :, 63:126].abs().sum(-1, keepdim=True) > 0).to(x.dtype)
        o, _ = self.lstm(self.proj(self.norm(torch.cat([x, delta, lm, rm], -1))))
        w = torch.softmax(self.attn(o), 1)
        return self.head((w * o).sum(1))

def next_model_id():
    return max([int(p.name) for p in MODELS.iterdir() if p.name.isdigit()], default=0) + 1

def train(epochs, out):
    print("=" * 70)
    print(f" TRAINING ALL-GLOSSES LSTM ({len(CLASSES)} CLASSES)".center(70))
    print("=" * 70)
    names, tr, va = [], [], []
    rng = np.random.default_rng(42)
    for c in CLASSES:
        p = out / "npy" / f"{c}.npy"
        if not p.exists(): continue
        a = np.load(p, allow_pickle=False)
        a = a[rng.permutation(len(a))]
        nv = max(2, int(0.2 * len(a)))
        va.append(a[:nv]); tr.append(a[nv:]); names.append(c)
    if len(names) < 2: return
    print(f"  CLASSES : {len(names)} | DEVICE: {DEVICE.upper()}")
    dl_tr = DataLoader(SeqDS(tr, AUG_K, 1), BS, shuffle=True)
    dl_va = DataLoader(SeqDS(va, 0, 2), 64)
    model = DailyNet(DIM, 128, len(names)).to(DEVICE)
    crit = nn.CrossEntropyLoss(label_smoothing=0.1)
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-2)
    sch = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=LR, total_steps=epochs * len(dl_tr))
    best, best_state, bad = -1.0, None, 0
    t0 = time.time()
    for e in range(1, epochs + 1):
        model.train()
        for xb, yb in dl_tr:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad(); loss = crit(model(xb), yb); loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0); opt.step(); sch.step()
        model.eval(); c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                c += (model(xb.to(DEVICE)).argmax(1) == yb.to(DEVICE)).sum().item(); t += len(yb)
        acc = c / t * 100 if t else 0.0
        print(f"  Epoch {e:2d}/{epochs} | val {acc:5.1f}% | best {best:5.1f}% | {time.time() - t0:5.1f}s")
        if acc > best: best, bad = acc, 0; best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
        else:
            bad += 1
            if bad >= 10: print("  early stop"); break
    model.load_state_dict(best_state); model.eval().cpu()
    torch.onnx.export(model, torch.randn(1, SEQ_T, DIM), str(out / "sign_daily_lstm.onnx"), opset_version=18, input_names=["sequence"], output_names=["logits"], dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
    json.dump(names, open(out / "sign_daily_classes.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"classes": len(names), "type": "all_glosses_bilstm_attn", "feat": DIM, "seq_len": SEQ_T, "best_val_acc": best, "glosses": names}, open(out / "daily_report.json", "w", encoding="utf-8"), indent=1)
    print(f"  saved models/onnx_models/{out.name}/  (best {best:.1f}%)")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--epochs", type=int, default=EPOCHS)
    a = ap.parse_args()
    model_dir = MODELS / str(next_model_id())
    model_dir.mkdir(parents=True, exist_ok=False)
    build(a.force, model_dir)
    train(a.epochs, model_dir)