#!/usr/bin/env python3
"""
train.py - ISL sign recognition: train BiLSTM+attention, evaluate, export ONNX.

    py train.py

Reads  model_training_zone/dataset_train/features/<id>/<GLOSS>.npy  (N, 64, 98)
(newest numeric id, or pin FEATURES_ID below) and writes

    models/onnx_models/<model_id>/
        sign_daily_lstm.onnx        input "sequence" (batch, 64, 98) RAW -> logits
        sign_daily_classes.json     gloss names in output order
        daily_report.json           best val acc, top-3, per-class P/R/F1, ONNX diff
        confusion_matrix.json       validation confusion matrix
        avatar/                     (filled later by avatar_extract.py)

Compatible with extract.py conventions:
  * index 0 = person's LEFT hand, 1 = right
  * shoulder box: y-axis up, z towards camera, unit = shoulder width
  * feature layout imported from extract.layout_offsets() and asserted here

Feature standardisation (train mean/std) and the "hand not in use -> zeros"
gating are baked INTO the network as buffers, so live inference feeds raw 98s.

The model is exported to a staging folder and moved to its final id folder
only if PyTorch and ONNX Runtime agree (max |logit diff| < 1e-3).

Needs:  py -m pip install torch onnx onnxruntime numpy
"""
from __future__ import annotations

import json
import math
import os
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import DataLoader, Dataset
except ImportError:
    sys.exit("ERROR: PyTorch missing.  py -m pip install torch onnx onnxruntime")

from extract import FEATURES_ROOT, N_FEATURES, N_FRAMES, TRAIN_ZONE, layout_offsets

# --------------------------------------------------------------------------- #
# CONFIG
# --------------------------------------------------------------------------- #
FEATURES_ID = None            # e.g. 3 to pin a features id; None = newest

HIDDEN, LAYERS, DROPOUT = 128, 2, 0.3
LR, WEIGHT_DECAY = 2e-3, 1e-2
BATCH_SIZE, MAX_EPOCHS = 32, 15
LABEL_SMOOTHING, GRAD_CLIP = 0.1, 1.0
EARLY_STOP = 10               # epochs without validation improvement
VAL_FRACTION, VAL_MIN = 0.20, 2
SEED = 42

AUG_COPIES = 4                # fresh augmented copies per training video/epoch
AUG_NOISE_STD = 0.01
AUG_CROP_MAX = 0.10           # temporal crop: trim 0-10 % frames each end
AUG_ROT_DEG = 8.0             # in-plane rotation of shoulder-box x,y
AUG_SCALE = (0.95, 1.05)      # shoulder-width / camera-distance jitter

ONNX_OPSET, ONNX_TOL = 17, 1e-3

MODELS_ROOT = TRAIN_ZONE.parent / "models" / "onnx_models"

# --------------------------------------------------------------------------- #
# Feature layout (asserted against extract.py)
# --------------------------------------------------------------------------- #
COL_HS, COL_PD, COL_WP, COL_EL, COL_WF, COL_HEAD, COL_FLAG, COL_DUR = \
    0, 66, 78, 82, 86, 92, 95, 97
_LO = layout_offsets()
assert [_LO[k][0] for k in ("handshape", "palm_dir_normal", "wrist_pos", "elbows",
                            "wrist_face_dist", "head", "hand_flags", "duration")] == \
       [COL_HS, COL_PD, COL_WP, COL_EL, COL_WF, COL_HEAD, COL_FLAG, COL_DUR], \
       "feature layout mismatch with extract.py"

LEFT_COLS = list(range(0, 33)) + list(range(66, 72)) + [78, 79] + list(range(86, 89))
RIGHT_COLS = list(range(33, 66)) + list(range(72, 78)) + [80, 81] + list(range(89, 92))
POS_COLS = list(range(COL_WP, COL_WF + 6)) + [COL_HEAD, COL_HEAD + 1]
NOISE_COLS = list(range(COL_HS, COL_HS + 66)) + POS_COLS      # position numbers
FLAG_COLS = [COL_FLAG, COL_FLAG + 1]

_ROT_PAIRS = ([(COL_PD + 6 * h + 3 * k, COL_PD + 6 * h + 3 * k + 1)
               for h in (0, 1) for k in (0, 1)]
              + [(COL_WP, COL_WP + 1), (COL_WP + 2, COL_WP + 3),
                 (COL_EL, COL_EL + 1), (COL_EL + 2, COL_EL + 3),
                 (COL_HEAD, COL_HEAD + 1)])


def gate_parts():
    """flags (..,2) @ M + base -> per-column multiplier (unused hand -> 0)."""
    M = np.zeros((2, N_FEATURES), np.float32)
    M[0, LEFT_COLS] = 1.0
    M[1, RIGHT_COLS] = 1.0
    base = np.ones(N_FEATURES, np.float32)
    base[LEFT_COLS + RIGHT_COLS] = 0.0
    return M, base


_GATE_M, _GATE_BASE = gate_parts()


# --------------------------------------------------------------------------- #
# Data
# --------------------------------------------------------------------------- #
def find_features_dir() -> Path:
    if not FEATURES_ROOT.is_dir():
        sys.exit(f"ERROR: features folder not found: {FEATURES_ROOT}\nRun  py extract.py  first.")
    if FEATURES_ID is not None:
        d = FEATURES_ROOT / str(FEATURES_ID)
        if not d.is_dir():
            sys.exit(f"ERROR: FEATURES_ID {FEATURES_ID} not found in {FEATURES_ROOT}")
        return d
    numeric = [p for p in FEATURES_ROOT.iterdir() if p.is_dir() and p.name.isdigit()]
    if numeric:
        return max(numeric, key=lambda p: int(p.name))
    anyd = [p for p in FEATURES_ROOT.iterdir() if p.is_dir()]
    if not anyd:
        sys.exit(f"ERROR: no feature runs in {FEATURES_ROOT}. Run  py extract.py  first.")
    return max(anyd, key=lambda p: p.stat().st_mtime)


def load_features(fdir: Path):
    classes, arrays = [], []
    for f in sorted(fdir.glob("*.npy"), key=lambda p: p.stem):
        a = np.load(f)
        if a.ndim != 3 or a.shape[1:] != (N_FRAMES, N_FEATURES):
            sys.exit(f"ERROR: {f.name} has shape {a.shape}, expected (N, {N_FRAMES}, {N_FEATURES})")
        if len(a) == 0:
            continue
        good = np.isfinite(a).all(axis=(1, 2))
        if not good.all():
            print(f"WARNING: {f.name}: dropped {int((~good).sum())} non-finite clip(s)")
            a = a[good]
            if len(a) == 0:
                continue
        classes.append(f.stem)
        arrays.append(a.astype(np.float32))
    if len(classes) < 2:
        sys.exit(f"ERROR: need at least 2 classes with data in {fdir}, found {len(classes)}")
    return classes, arrays


def split_by_video(classes, arrays, rng):
    """Per gloss: 20 % of videos (target min 2) held out. Split by video."""
    Xtr, ytr, Xva, yva = [], [], [], []
    val_rows, warns = {}, []
    for c, a in enumerate(arrays):
        n = len(a)
        order = rng.permutation(n)
        n_val = max(VAL_MIN, int(round(VAL_FRACTION * n)))
        n_val = min(n_val, n - 1) if n >= 2 else 0
        if n < VAL_MIN + 1:
            warns.append(f"{classes[c]}: only {n} video(s) - validation uses {n_val}")
        v, t = order[:n_val], order[n_val:]
        Xtr.append(a[t]); ytr += [c] * len(t)
        if len(v):
            Xva.append(a[v]); yva += [c] * len(v)
        val_rows[c] = sorted(int(i) for i in v)
    Xtr = np.concatenate(Xtr)
    Xva = (np.concatenate(Xva) if Xva else np.zeros((0, N_FRAMES, N_FEATURES), np.float32))
    return Xtr, np.array(ytr, np.int64), Xva, np.array(yva, np.int64), val_rows, warns


def compute_norm_stats(Xtr: np.ndarray):
    """Mean/std per column from training videos; hand columns use in-use frames only."""
    flat = Xtr.reshape(-1, N_FEATURES).astype(np.float64)
    use_l = flat[:, COL_FLAG] > 0.5
    use_r = flat[:, COL_FLAG + 1] > 0.5
    left, right = set(LEFT_COLS), set(RIGHT_COLS)
    mean, std = np.zeros(N_FEATURES), np.ones(N_FEATURES)
    for c in range(N_FEATURES):
        if c in FLAG_COLS:
            continue
        sel = use_l if c in left else use_r if c in right else slice(None)
        v = flat[sel, c]
        if v.size > 1:
            mean[c] = v.mean()
            s = v.std()
            std[c] = s if s > 1e-4 else 1.0
    return mean.astype(np.float32), std.astype(np.float32)


# --------------------------------------------------------------------------- #
# Augmentation (numeric groups only; flags and duration never touched)
# --------------------------------------------------------------------------- #
def augment(x: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    x = x.copy()
    flags = x[:, COL_FLAG:COL_FLAG + 2].copy()

    # 1. temporal crop / speed: trim 0-10 % frames each end, resample back to 64
    a = int(rng.uniform(0, AUG_CROP_MAX) * N_FRAMES)
    b = int(rng.uniform(0, AUG_CROP_MAX) * N_FRAMES)
    idx = np.rint(np.linspace(a, N_FRAMES - 1 - b, N_FRAMES)).astype(int)
    x, flags = x[idx], flags[idx]

    # 2. in-plane rotation of shoulder-box x,y vectors (y-up convention)
    th = math.radians(rng.uniform(-AUG_ROT_DEG, AUG_ROT_DEG))
    c, s = math.cos(th), math.sin(th)
    for i, j in _ROT_PAIRS:
        xi, yj = x[:, i].copy(), x[:, j].copy()
        x[:, i] = c * xi - s * yj
        x[:, j] = s * xi + c * yj
    x[:, COL_HEAD + 2] -= th                      # head angle from vertical

    # 3. scale jitter (camera distance) on width-normalised positions/distances
    x[:, POS_COLS] *= rng.uniform(*AUG_SCALE)

    # 4. gaussian noise on position numbers, never on an unused hand's zeros
    gate = flags @ _GATE_M + _GATE_BASE
    noise = rng.normal(0.0, AUG_NOISE_STD, (N_FRAMES, len(NOISE_COLS))).astype(np.float32)
    x[:, NOISE_COLS] += noise * gate[:, NOISE_COLS]
    return x


class SignDataset(Dataset):
    """Every training video once as-is + AUG_COPIES fresh augmented copies."""

    def __init__(self, X, y, copies=0, seed=0):
        self.X, self.y, self.copies = X, y, copies
        self.rng = np.random.default_rng(seed)

    def __len__(self):
        return len(self.X) * (1 + self.copies)

    def __getitem__(self, i):
        v, k = i % len(self.X), i // len(self.X)
        x = self.X[v] if k == 0 else augment(self.X[v], self.rng)
        return torch.from_numpy(np.ascontiguousarray(x, np.float32)), int(self.y[v])


# --------------------------------------------------------------------------- #
# Model: raw (B,64,98) -> standardise+gate -> BiLSTM -> LayerNorm -> attention
# --------------------------------------------------------------------------- #
class SignNet(nn.Module):
    def __init__(self, n_classes, mean, std):
        super().__init__()
        self.register_buffer("mean", torch.from_numpy(mean))
        self.register_buffer("std", torch.from_numpy(std))
        self.register_buffer("gate_m", torch.from_numpy(_GATE_M))
        self.register_buffer("gate_base", torch.from_numpy(_GATE_BASE))
        self.lstm = nn.LSTM(N_FEATURES, HIDDEN, num_layers=LAYERS, batch_first=True,
                            bidirectional=True, dropout=DROPOUT)
        self.norm = nn.LayerNorm(2 * HIDDEN)
        self.attn = nn.Sequential(nn.Linear(2 * HIDDEN, HIDDEN), nn.Tanh(),
                                  nn.Linear(HIDDEN, 1))
        self.drop = nn.Dropout(DROPOUT)
        self.fc = nn.Linear(2 * HIDDEN, n_classes)

    def forward(self, x):
        flags = x[:, :, COL_FLAG:COL_FLAG + 2]                 # raw 0/1 hand flags
        gate = flags @ self.gate_m + self.gate_base            # zero unused hands
        h = ((x - self.mean) / self.std) * gate
        out, _ = self.lstm(h)
        out = self.norm(out)
        valid = flags.sum(-1) > 0.5                            # attend active frames
        any_valid = valid.float().sum(1, keepdim=True) > 0.5
        mask = valid | ~any_valid
        scores = self.attn(out).squeeze(-1).masked_fill(~mask, -1e9)
        w = torch.softmax(scores, dim=1).unsqueeze(-1)
        ctx = (out * w).sum(1)
        return self.fc(self.drop(ctx))


# --------------------------------------------------------------------------- #
# Train / evaluate
# --------------------------------------------------------------------------- #
@torch.no_grad()
def predict_logits(model, X, device, bs=128):
    model.eval()
    outs = [model(torch.from_numpy(X[i:i + bs]).to(device)).cpu()
            for i in range(0, len(X), bs)]
    return torch.cat(outs).numpy() if outs else np.zeros((0, 0), np.float32)


def metrics_from_logits(logits, y, n_classes):
    pred = logits.argmax(1)
    loss = float(nn.functional.cross_entropy(torch.from_numpy(logits), torch.from_numpy(y)))
    return float((pred == y).mean()), loss, pred


def confusion(y, pred, n):
    cm = np.zeros((n, n), int)
    for t, p in zip(y, pred):
        cm[t, p] += 1
    return cm


def per_class_report(cm, classes):
    tp = np.diag(cm).astype(float)
    support, predicted = cm.sum(1), cm.sum(0)
    prec = np.divide(tp, predicted, out=np.zeros_like(tp), where=predicted > 0)
    rec = np.divide(tp, support, out=np.zeros_like(tp), where=support > 0)
    f1 = np.divide(2 * prec * rec, prec + rec, out=np.zeros_like(tp), where=(prec + rec) > 0)
    rows = {c: dict(precision=round(float(prec[i]), 4), recall=round(float(rec[i]), 4),
                    f1=round(float(f1[i]), 4), support=int(support[i]))
            for i, c in enumerate(classes)}
    has = support > 0
    macro = dict(precision=round(float(prec[has].mean()), 4),
                 recall=round(float(rec[has].mean()), 4),
                 f1=round(float(f1[has].mean()), 4), classes_averaged=int(has.sum()))
    return rows, macro


def train(model, Xtr, ytr, Xva, yva, device, n_classes):
    loader = DataLoader(SignDataset(Xtr, ytr, AUG_COPIES, SEED), batch_size=BATCH_SIZE,
                        shuffle=True, num_workers=0,
                        generator=torch.Generator().manual_seed(SEED))
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=LR, epochs=MAX_EPOCHS,
                                                steps_per_epoch=len(loader))
    crit = nn.CrossEntropyLoss(label_smoothing=LABEL_SMOOTHING)
    best = dict(acc=-1.0, loss=float("inf"), epoch=0, state=None)
    history, stale = [], 0

    for epoch in range(1, MAX_EPOCHS + 1):
        t0 = time.time()
        model.train()
        tl = tc = tn = 0
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)
            logits = model(xb)
            loss = crit(logits, yb)
            if not torch.isfinite(loss):
                sys.exit("ERROR: training loss diverged (NaN/inf).")
            opt.zero_grad(set_to_none=True)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), GRAD_CLIP)
            opt.step()
            sched.step()
            tl += float(loss) * len(yb)
            tc += int((logits.argmax(1) == yb).sum())
            tn += len(yb)
        va_acc, va_loss, _ = metrics_from_logits(predict_logits(model, Xva, device),
                                                 yva, n_classes)
        history.append(dict(epoch=epoch, train_loss=round(tl / tn, 4),
                            train_acc=round(tc / tn, 4), val_loss=round(va_loss, 4),
                            val_acc=round(va_acc, 4)))
        improved = va_acc > best["acc"] or (va_acc == best["acc"] and va_loss < best["loss"])
        if improved:
            best = dict(acc=va_acc, loss=va_loss, epoch=epoch,
                        state={k: v.detach().cpu().clone()
                               for k, v in model.state_dict().items()})
            stale = 0
        else:
            stale += 1
        print(f"epoch {epoch:2d}/{MAX_EPOCHS}  train loss {tl / tn:.4f} acc {tc / tn:.3f} | "
              f"val loss {va_loss:.4f} acc {va_acc:.3f}{'  *best*' if improved else ''}  "
              f"({time.time() - t0:.0f}s)", flush=True)
        if stale >= EARLY_STOP:
            print(f"Early stop: no improvement for {EARLY_STOP} epochs.")
            break
    return best, history


# --------------------------------------------------------------------------- #
# ONNX export + verification
# --------------------------------------------------------------------------- #
def export_onnx(model, path: Path):
    model.eval().cpu()
    dummy = torch.randn(1, N_FRAMES, N_FEATURES)
    kw = dict(input_names=["sequence"], output_names=["logits"], opset_version=ONNX_OPSET,
              dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
    try:
        torch.onnx.export(model, dummy, str(path), dynamo=False, **kw)
    except TypeError:
        torch.onnx.export(model, dummy, str(path), **kw)      # older torch


def verify_onnx(model, path: Path, Xva: np.ndarray) -> float:
    try:
        import onnx
        import onnxruntime as ort
    except ImportError:
        sys.exit("ERROR: onnx / onnxruntime missing.  py -m pip install onnx onnxruntime")
    onnx.checker.check_model(onnx.load(str(path)))
    sess = ort.InferenceSession(str(path), providers=["CPUExecutionProvider"])
    in_name = sess.get_inputs()[0].name
    model.eval().cpu()
    with torch.no_grad():
        ref = model(torch.from_numpy(Xva)).numpy()
    got = sess.run(None, {in_name: Xva})[0]
    diff = float(np.abs(ref - got).max())
    one = sess.run(None, {in_name: Xva[:1]})[0]               # batch-1 (live path)
    return max(diff, float(np.abs(ref[:1] - one).max()))


def next_model_id() -> int:
    MODELS_ROOT.mkdir(parents=True, exist_ok=True)
    ids = [int(p.name) for p in MODELS_ROOT.iterdir() if p.is_dir() and p.name.isdigit()]
    return max(ids) + 1 if ids else 1


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    np.random.seed(SEED)
    torch.manual_seed(SEED)
    rng = np.random.default_rng(SEED)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    fdir = find_features_dir()
    classes, arrays = load_features(fdir)
    Xtr, ytr, Xva, yva, val_rows, warns = split_by_video(classes, arrays, rng)
    if len(Xva) == 0:
        sys.exit("ERROR: no validation videos - every class has a single video.")
    n_classes = len(classes)
    for w in warns:
        print("WARNING:", w)
    print(f"Features id {fdir.name} | {n_classes} classes | train {len(Xtr)} videos "
          f"(x{1 + AUG_COPIES} per epoch with augmentation) | val {len(Xva)} videos | "
          f"device {device}")

    mean, std = compute_norm_stats(Xtr)
    model = SignNet(n_classes, mean, std).to(device)
    print(f"Model: BiLSTM {LAYERS}x{HIDDEN} + LayerNorm + attention | "
          f"{sum(p.numel() for p in model.parameters()):,} parameters\n")

    t_start = time.time()
    best, history = train(model, Xtr, ytr, Xva, yva, device, n_classes)
    model.load_state_dict(best["state"])
    model.to("cpu").eval()
    print(f"\nBest epoch {best['epoch']}: val acc {best['acc']:.4f}, "
          f"val loss {best['loss']:.4f}")

    logits = predict_logits(model, Xva, "cpu")
    va_acc, va_loss, pred = metrics_from_logits(logits, yva, n_classes)
    cm = confusion(yva, pred, n_classes)
    per_class, macro = per_class_report(cm, classes)
    top3 = float(np.mean([y in np.argsort(-l)[:3] for l, y in zip(logits, yva)]))
    print(f"Validation: acc {va_acc:.4f} | top-3 {top3:.4f} | macro P {macro['precision']:.3f} "
          f"R {macro['recall']:.3f} F1 {macro['f1']:.3f}")

    # ---- staging -> verify -> deploy ---- #
    model_id = next_model_id()
    final_dir = MODELS_ROOT / str(model_id)
    staging = MODELS_ROOT / f".staging_{model_id}"
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    onnx_path = staging / "sign_daily_lstm.onnx"
    export_onnx(model, onnx_path)
    diff = verify_onnx(model, onnx_path, Xva)
    print(f"ONNX check: max |logit diff| = {diff:.2e} (tolerance {ONNX_TOL:.0e})")
    if not diff < ONNX_TOL:
        sys.exit(f"ERROR: ONNX verification FAILED (diff {diff:.3e} >= {ONNX_TOL:.0e}). "
                 f"Nothing deployed; staging kept at {staging}")

    (staging / "sign_daily_classes.json").write_text(
        json.dumps(classes, indent=2, ensure_ascii=False), encoding="utf-8")
    (staging / "confusion_matrix.json").write_text(
        json.dumps(dict(classes=classes, rows="true", columns="predicted",
                        matrix=cm.tolist()), indent=2), encoding="utf-8")
    report = dict(
        model_id=model_id, features_id=fdir.name, features_dir=str(fdir),
        created=datetime.now().isoformat(timespec="seconds"),
        training_seconds=round(time.time() - t_start, 1), device=str(device),
        best_epoch=best["epoch"], best_val_acc=round(best["acc"], 4),
        best_val_loss=round(best["loss"], 4), val_top3_acc=round(top3, 4),
        onnx=dict(input="sequence", output="logits", input_is_raw_features=True,
                  shape=["batch", N_FRAMES, N_FEATURES], max_abs_logit_diff=diff,
                  tolerance=ONNX_TOL, opset=ONNX_OPSET),
        macro_avg=macro, per_class=per_class,
        confusion_matrix_file="confusion_matrix.json",
        data=dict(classes=n_classes, train_videos=int(len(Xtr)), val_videos=int(len(Xva)),
                  videos_per_class={c: int(len(a)) for c, a in zip(classes, arrays)},
                  val_rows={classes[c]: r for c, r in val_rows.items()}, warnings=warns),
        hyperparameters=dict(
            hidden=HIDDEN, layers=LAYERS, dropout=DROPOUT, lr=LR,
            weight_decay=WEIGHT_DECAY, batch_size=BATCH_SIZE, max_epochs=MAX_EPOCHS,
            label_smoothing=LABEL_SMOOTHING, scheduler="OneCycleLR", grad_clip=GRAD_CLIP,
            early_stop=EARLY_STOP, seed=SEED, val_fraction=VAL_FRACTION, val_min=VAL_MIN,
            augmentation=dict(copies=AUG_COPIES, noise_std=AUG_NOISE_STD,
                              crop_max=AUG_CROP_MAX, rotation_deg=AUG_ROT_DEG,
                              scale=list(AUG_SCALE))),
        history=history,
    )
    (staging / "daily_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    (staging / "avatar").mkdir(exist_ok=True)

    if final_dir.exists():
        shutil.rmtree(final_dir)
    os.replace(staging, final_dir)
    print(f"\nModel id {model_id} deployed -> {final_dir}")
    print("Next:  py avatar_extract.py")


if __name__ == "__main__":
    main()