"""
train.py — Step 2:  py train.py

Trains the BiLSTM on the 158-dim features produced by extract.py and exports ONNX
into the same models/onnx_models/<id>/ folder (the newest one with npy/ and no model yet).

Input contract: (batch, SEQ_T=32, DIM=158) float32 — exactly what extract.py writes
(32 frames spaced evenly over each video's full length). No extraction math lives here;
test_model.py builds live rows with the same extract_features() from extract.py.
"""

import json
import sys
import time

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

from extract import (BODY_DIM, BODY_N, DIM, HAND_DIM, MODELS, SEQ_T,
                     class_names, dataset_paths, model_ids)

# ───────────── settings (edit here) ─────────────
EPOCHS, BS, LR, AUG_K = 15, 32, 2e-3, 4
MODEL_ID = None      # None = latest folder that has npy/ but no trained model
# ────────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


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
    h = s[:, :HAND_DIM].reshape(SEQ_T, 42, 3).copy()
    p = s[:, HAND_DIM:].reshape(SEQ_T, BODY_N, 4).copy()
    if rng.random() < 0.6:
        th = rng.uniform(-0.3, 0.3)
        c, sn = np.cos(th), np.sin(th)
        R = np.array([[c, -sn], [sn, c]], np.float32).T
        h[:, :, :2] = h[:, :, :2] @ R
        p[:, :, :2] = p[:, :, :2] @ R
    if rng.random() < 0.6:
        f = rng.uniform(0.85, 1.15)
        h *= f
        p[:, :, :3] *= f
    h += rng.normal(0, 0.01, h.shape).astype(np.float32)
    p[:, :, :3] += rng.normal(0, 0.01, p[:, :, :3].shape).astype(np.float32)
    return np.concatenate([h.reshape(SEQ_T, HAND_DIM), p.reshape(SEQ_T, BODY_DIM)], 1).astype(np.float32)


class SeqDS(Dataset):
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


def pick_model_dir():
    if MODEL_ID is not None:
        return MODELS / str(MODEL_ID)
    for i in reversed(model_ids()):
        d = MODELS / str(i)
        if (d / "npy").exists() and not (d / "sign_daily_lstm.onnx").exists():
            return d
    sys.exit("No extracted, untrained model folder found. Run `py extract.py` first "
             "(or set MODEL_ID at the top of train.py).")


def main():
    out = pick_model_dir()
    _, targets = dataset_paths()
    print("=" * 70)
    print(f" TRAINING BiLSTM ({DIM}-dim) ->{out.name}".center(70))
    print("=" * 70)

    names, tr, va = [], [], []
    rng = np.random.default_rng(42)
    for c in class_names(targets):
        p = out / "npy" / c / "features.npy"
        if not p.exists():
            continue
        a = np.load(p, allow_pickle=False)
        if a.shape[-1] != DIM:
            sys.exit(f"{c}/features.npy has dim {a.shape[-1]}, expected {DIM}. Run extract.py with FORCE = True.")
        a = a[rng.permutation(len(a))]
        nv = max(2, int(0.2 * len(a)))
        va.append(a[:nv]); tr.append(a[nv:]); names.append(c)
    if len(names) < 2:
        sys.exit("Not enough extracted classes. Run `py extract.py` first.")
    print(f"  CLASSES : {len(names)} | DEVICE: {DEVICE.upper()}")

    dl_tr = DataLoader(SeqDS(tr, AUG_K, 1), BS, shuffle=True)
    dl_va = DataLoader(SeqDS(va, 0, 2), 64)
    model = DailyNet(DIM, 128, len(names)).to(DEVICE)
    crit = nn.CrossEntropyLoss(label_smoothing=0.1)
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-2)
    sch = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=LR, total_steps=EPOCHS * len(dl_tr))
    best, best_state, bad = -1.0, None, 0
    t0 = time.time()
    for e in range(1, EPOCHS + 1):
        model.train()
        for xb, yb in dl_tr:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            loss = crit(model(xb), yb)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step(); sch.step()
        model.eval()
        c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                c += (model(xb.to(DEVICE)).argmax(1) == yb.to(DEVICE)).sum().item()
                t += len(yb)
        acc = c / t * 100 if t else 0.0
        print(f"  Epoch {e:2d}/{EPOCHS} | val {acc:5.1f}% | best {max(best, acc):5.1f}% | {time.time() - t0:5.1f}s")
        if acc > best:
            best, bad = acc, 0
            best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
        else:
            bad += 1
            if bad >= 10:
                print("  early stop")
                break

    model.load_state_dict(best_state)
    model.eval().cpu()
    torch.onnx.export(
        model, torch.randn(1, SEQ_T, DIM), str(out / "sign_daily_lstm.onnx"), opset_version=18,
        input_names=["sequence"], output_names=["logits"],
        dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}},
    )
    with open(out / "sign_daily_classes.json", "w", encoding="utf-8") as f:
        json.dump(names, f, ensure_ascii=False, indent=1)
    with open(out / "daily_report.json", "w", encoding="utf-8") as f:
        json.dump({"classes": len(names), "type": "all_glosses_bilstm_attn", "feat": DIM,
                   "seq_len": SEQ_T, "best_val_acc": best, "glosses": names}, f, indent=1)
    print(f"  saved models/onnx_models/{out.name}/  (best {best:.1f}%)")
    print("  next: py test_model.py")


if __name__ == "__main__":
    main()