"""
train_holistic.py — 258-dim daily-conversation model with NONE class + BiLSTM attention.

What makes this run different from train_daily6.py:

  * a NONE class, harvested from the rest frames either side of every sign, so
    an idle hand is recognised as "nothing was signed" instead of being forced
    into the nearest gloss;
  * a BiLSTM with attention pooling, so a sign performed in the middle of a
    32-frame window is read from where it happened, not only from the final
    hidden state;
  * stronger augmentation (temporal crop, speed warp, rotation, scale,
    translation, jitter) because 6 classes over a few clips per class is a very
    small training set.

Saves to models/onnx_models/<next_id>/ (the registry auto-discovers it).
Run:  python train_holistic.py --force --epochs 60
Use --force to re-extract videos instead of reusing existing .npy files.
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

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

# The feature contract is imported, never re-typed: the pose block written here
# must be the same 132 columns backend/extract.py serves, or the graph is trained
# on a tensor it will never see. See backend/pose.py.
from backend.pose import POSE_DIM, pose_from_landmarks  # noqa: E402

DS = ROOT / "dataset" / "Indian Sign Language_Dataset"
if not (DS / "ISL_VIDEO").exists():
    sys.exit("Dataset not found (ISL_VIDEO missing)")

VD = DS / "ISL_VIDEO"
RAW = ROOT / "dataset_train" / "daily_video"          # shared with train_daily6 (skip-existing)
MODELS = ROOT / "models" / "onnx_models"
MODELS.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

TARGETS = ["Good Morning", "Good afternoon", "Hello", "Hug", "What is your Name", "Drink"]
CLASSES = [t.upper().replace(" ", "_") for t in TARGETS] + ["NONE"]
SEQ_T, DIM = 32, 126 + POSE_DIM
AUG_K, EPOCHS, BS, LR = 6, 60, 32, 2e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# static_image_mode=False + 0.5 detection confidence, identical to
# backend/extract._get_holistic(), so extraction and serving walk the same
# tracker state machine.
_hol = mp.solutions.holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5)


def frame_vec(bgr):
    """BYTE-IDENTICAL geometry to backend/extract.extract_holistic_frame."""
    res = _hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    if not res.left_hand_landmarks or not res.right_hand_landmarks or res.pose_landmarks is None:
        return None
    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    pose = pose_from_landmarks(res.pose_landmarks)
    ref, scale = rh[0], np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh = (lh - ref) / scale
    rh = (rh - ref) / scale
    pose[:, :3] = (pose[:, :3] - ref) / scale
    return np.concatenate([lh.flatten(), rh.flatten(), pose.flatten()]).astype(np.float32)


def seq_from_video(path, start_frac, end_frac):
    """Even-sample SEQ_T frames between two fractions of the clip.

    ``start_frac``/``end_frac`` are what separate a sign from the NONE class:
    the same clip yields a signing sequence at 0.10–0.90 and a rest sequence at
    its head/tail, where the hands are down and the signer is idle.
    """
    cap = cv2.VideoCapture(str(path))
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None
    idxs = np.linspace(int(F * start_frac),
                       max(int(F * start_frac) + 1, int(F * end_frac) - 1),
                       SEQ_T).astype(int)
    out, last, good = [], None, 0
    for ix in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            out.append(None)
            continue
        v = frame_vec(fr)
        if v is not None:
            last = v
            good += 1
        out.append(v if v is not None else last)
    cap.release()
    if good < SEQ_T // 2:
        return None
    return np.array([o if o is not None else np.zeros(DIM, np.float32) for o in out], np.float32)


def build(force=False):
    print("=" * 70)
    print(" EXTRACTING (258-DIM HOLISTIC) + REST CLASS".center(70))
    print("=" * 70)
    print(f"  DATASET : {VD}")
    t0 = time.time()

    for t in TARGETS:
        g = t.upper().replace(" ", "_")
        dest = RAW / f"{g}.npy"
        if not force and dest.exists():
            print(f"  SKIP {g}")
            continue
        vids = sorted((VD / t).glob("*.mp4")) if (VD / t).exists() else []
        seqs = [s for s in (seq_from_video(f, 0.10, 0.90) for f in vids) if s is not None]
        if seqs:
            np.save(dest, np.stack(seqs))
        print(f"  DONE {g}: {len(seqs)}/{len(vids)}")

    dest = RAW / "NONE.npy"
    if force or not dest.exists():
        idle = []
        for t in TARGETS:
            vids = sorted((VD / t).glob("*.mp4"))
            for f in vids[:4]:
                for a, b in ((0.0, 0.12), (0.88, 1.0)):     # pre/post-sign rest
                    s = seq_from_video(f, a, b)
                    if s is not None:
                        idle.append(s)
            # Frozen-hold negatives: one mid-sign frame repeated for SEQ_T
            # frames. This is exactly what live carry-forward produces after a
            # sign ends, and it is what run 7 kept reading as HUG.
            for f in vids[:6]:
                s = seq_from_video(f, 0.45, 0.55)
                if s is not None:
                    idle.append(np.repeat(s[16:17], SEQ_T, 0).astype(np.float32))
        # No-hands negative: the all-zero window the presence channels see
        # when the signer drops their hands out of frame.
        idle.append(np.zeros((SEQ_T, DIM), np.float32))
        if idle:
            np.save(dest, np.stack(idle))
            print(f"  DONE NONE: {len(idle)}")
    print(f"  extraction finished in {time.time() - t0:.1f}s")


# ─────────────────────────────────────────────
# AUGMENTATION
# ─────────────────────────────────────────────
def interp(s, ix):
    """Linear resample of a (T, D) sequence at fractional frame indices."""
    ix = np.clip(ix, 0, len(s) - 1)
    i0 = np.floor(ix).astype(int)
    i1 = np.minimum(i0 + 1, len(s) - 1)
    f = (ix - i0)[:, None]
    return (s[i0] * (1 - f) + s[i1] * f).astype(np.float32)


def aug(seq, rng):
    """Geometry-safe augmentation: no mirroring, pose sides stay fixed.

    A temporal crop is what teaches the network that a sign starting on frame 4
    or frame 9 is the same sign -- without it, the attention head learns the
    signing position rather than the signing movement.
    """
    s = seq.copy()

    if rng.random() < 0.5:
        a, b = int(rng.integers(0, 5)), SEQ_T - int(rng.integers(0, 5))
        s = interp(s[a:b], np.linspace(0, b - a - 1, SEQ_T))

    if rng.random() < 0.5:
        u = np.linspace(0, 1, SEQ_T) + rng.uniform(-0.2, 0.2) * np.sin(np.pi * np.linspace(0, 1, SEQ_T))
        s = interp(s, u * (SEQ_T - 1))

    h = s[:, :126].reshape(SEQ_T, 42, 3).copy()
    p = s[:, 126:].reshape(SEQ_T, 33, 4).copy()

    if rng.random() < 0.6:                                   # in-plane rotation
        th = rng.uniform(-0.3, 0.3)
        c, sn = np.cos(th), np.sin(th)
        R = np.array([[c, -sn], [sn, c]], np.float32).T
        h[:, :, :2] @= R
        p[:, :, :2] @= R

    if rng.random() < 0.6:                                   # scale (xyz only)
        f = rng.uniform(0.85, 1.15)
        h *= f
        p[:, :, :3] *= f

    if rng.random() < 0.5:                                   # translation (xy only)
        t = rng.uniform(-0.1, 0.1, 2).astype(np.float32)
        h[:, :, :2] += t
        p[:, :, :2] += t

    h += rng.normal(0, 0.01, h.shape).astype(np.float32)
    p[:, :, :3] += rng.normal(0, 0.01, p[:, :, :3].shape).astype(np.float32)

    return np.concatenate([h.reshape(SEQ_T, 126), p.reshape(SEQ_T, POSE_DIM)], 1).astype(np.float32)


class SeqDS(Dataset):
    """Class-pooled dataset: every real clip plus ``aug_k`` augmented copies."""

    def __init__(self, pools, aug_k, seed):
        self.pools = pools
        self.rng = np.random.default_rng(seed)
        self.items = []
        for ci, arr in enumerate(pools):
            for r in range(len(arr)):
                self.items.append((ci, r, 0))
                self.items += [(ci, r, k + 1) for k in range(aug_k)]

    def __len__(self):
        return len(self.items)

    def __getitem__(self, i):
        ci, r, k = self.items[i]
        s = self.pools[ci][r].copy()
        return torch.from_numpy(aug(s, self.rng) if k else s), ci


class DailyNet(nn.Module):
    """Velocity + hand-presence channels -> BiLSTM -> attention pool.

    Two extra channels are appended to every frame: the frame-to-frame delta
    (velocity) and a per-hand presence flag. The flag is what lets the network
    tell "hand at rest" from "hand not detected", which is the difference
    between NONE and a held sign; the delta is what makes the movement visible
    to a recurrent layer that would otherwise only see positions.

    Attention pooling replaces taking the last hidden state: a sign performed
    early in the window would be summarised by 30 frames of rest under the old
    head, and the whole point of the NONE class is that rest is not a sign.
    """

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


def train(epochs):
    print("=" * 70)
    print(" TRAINING DAILY LSTM (BiLSTM + ATTENTION, 258-DIM)".center(70))
    print("=" * 70)

    names, tr, va = [], [], []
    rng = np.random.default_rng(42)
    for c in CLASSES:
        p = RAW / f"{c}.npy"
        if not p.exists():
            print(f"  WARN {c}: no extracted data, class dropped")
            continue
        a = np.load(p)
        a = a[rng.permutation(len(a))]
        nv = max(2, int(0.2 * len(a)))
        va.append(a[:nv])
        tr.append(a[nv:])
        names.append(c)

    if len(names) < 2:
        print("  ERROR: fewer than two classes have data. Run extraction first.")
        return

    print(f"  CLASSES : {len(names)} ({', '.join(names)})")
    print(f"  FEATURE : {DIM}-dim | SEQ: {SEQ_T} frames | DEVICE: {DEVICE.upper()}")

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
            opt.zero_grad()
            loss = crit(model(xb), yb)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            sch.step()

        model.eval()
        c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                c += (model(xb.to(DEVICE)).argmax(1) == yb.to(DEVICE)).sum().item()
                t += len(yb)
        acc = c / t * 100 if t else 0.0
        print(f"  Epoch {e:2d}/{epochs} | val {acc:5.1f}% | best {best:5.1f}% | "
              f"{time.time() - t0:5.1f}s")

        if acc > best:
            best, bad = acc, 0
            best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
        else:
            bad += 1
            if bad >= 15:
                print("  early stop")
                break

    model.load_state_dict(best_state)
    model.eval().cpu()

    mid = next_model_id()
    out = MODELS / str(mid)
    out.mkdir(parents=True, exist_ok=True)
    torch.onnx.export(
        model, torch.randn(1, SEQ_T, DIM), str(out / "sign_daily_lstm.onnx"),
        opset_version=18, input_names=["sequence"], output_names=["logits"],
        dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}},
    )
    json.dump(names, open(out / "sign_daily_classes.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    json.dump({"classes": len(names), "type": "daily_bilstm_attn", "feat": DIM,
               "seq_len": SEQ_T, "best_val_acc": best, "glosses": names},
              open(out / "daily_report.json", "w", encoding="utf-8"), indent=1)

    print("-" * 70)
    print(f"  saved models/onnx_models/{mid}/  (best {best:.1f}%)")
    print(f"  next: Admin -> Models Registry -> RESCAN -> SET ACTIVE")
    print(f"        a {DIM}-dim graph makes the backend select the holistic extractor")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-extract even if .npy exists")
    ap.add_argument("--epochs", type=int, default=EPOCHS)
    a = ap.parse_args()
    build(a.force)
    train(a.epochs)
