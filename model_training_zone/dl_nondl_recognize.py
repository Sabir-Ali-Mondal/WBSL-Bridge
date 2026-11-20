#!/usr/bin/env python3
"""
dl_nondl_recognize.py - hybrid live sign recognition (DL top-N  ->  DTW rescoring).

Put this file beside test_model.py (it imports `extract` the same way).

    py dl_nondl_recognize.py [--model-id ID] [--features-id 3] [--top-n 5]
                             [--screen-refs 2] [--screen-top 8] [--mask]
                             [--fusion score|rank] [--w-dl 0.5] [--w-dtw 0.5]
                             [--dtw-pow 3] [--close-gap 0.08] [--rescue-skip 0]
                             [--width 480] [--complexity 0|1] [--camera 0]
                             [--lazy] [--no-save]

Pipeline
  1. UI / clipping = non-DL system (hand-raise AUTO / TIMED, enhance, hand hold, filling).
  2. 64x98 clip -> ONNX DL model -> DL top-5 (over all classes).
  3. DTW SCREEN over ALL classes using only a few refs per class (default 2) ->
     DTW's own shortlist, so a sign the DL missed can still be found.
  4. FULL DTW (all refs, per-class scaled) on the union  DL top-5 + DTW shortlist.
  5. Matching rule:
       * classes that are in BOTH the DL top-5 and the DTW top-5 are the candidates;
         the best fused score among them wins ("consensus").
       * no overlap -> the DL answer is kept unchanged and DTW is shown only as
         "DTW opinion".
  6. Close call between the top two -> deeper DTW pass (wider band, 5 refs) decides.
  7. Headline is always the best guess (never "Not sure"); "(low)" marks weak ones.
     Fusion score:  w_dl * (p / p_top) + w_dtw * (d_min / d)^dtw_pow   (or Borda rank).

Labelling for tuning: press L after a result, type the true sign (autocompletes),
ENTER saves one row to hybrid_eval.csv (DL / DTW / hybrid correctness + all
scores, so weights can be re-tuned offline). ESC cancels typing.

Keys: M toggle AUTO <-> TIMED   L label last result   Q / ESC quit
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import sys
import time
from collections import deque
from pathlib import Path

import cv2
import numba as nb
import numpy as np
import mediapipe as mp
import onnxruntime as ort

import extract as EX

# --------------------------------------------------------------------------- #
# CONFIG
# --------------------------------------------------------------------------- #
ROOT = EX.TRAIN_ZONE.parent
MODELS_ROOT = ROOT / "models" / "onnx_models"
HERE = Path(__file__).resolve().parent
RECORDINGS_DIR = HERE / "hybrid_recordings"
EVAL_CSV = HERE / "hybrid_eval.csv"

N_FRAMES = EX.N_FRAMES            # 64
N_FEATURES = EX.N_FEATURES        # 98
DTW_N_CONTENT = 95
DTW_WINDOW = 10
DTW_TOP_K_AVG = 3
DEEP_WINDOW = 16                  # second pass on close calls
DEEP_K_AVG = 5
MIN_REAL_FRAMES = 8               # below this the real-frame mask is ignored
SCALE_SAMPLES = 5                 # refs per class used to estimate its in-class scale
SCREEN_REFS = 2                   # refs per class for the all-class DTW screen
SCREEN_TOP = 8                    # screen classes kept (union with DL top-N)

TOP_N = 5
W_DL = 0.5
W_DTW = 0.5
DTW_POW = 3.0                     # sharpens the (usually narrow) DTW spread
CLOSE_GAP = 0.08                  # top-2 fused gap that triggers the deep pass
LOW_GAP = 0.08                    # "(low)" tag when methods disagree and gap this small
SHOW_K = 3

LIVE_WIDTH = 480
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30
RESCUE_SKIP = 0                   # 0 = rescue every frame (best hand recovery)

RAISE_START_MARGIN = 0.10
RAISE_STOP_MARGIN = 0.05
RAISE_CONFIRM_FRAMES = 3
LOWER_CONFIRM_FRAMES = 6
MAX_SPAN_S = 7.0
TIMED_DURATION = 7.0
HOLD_MAX_AGE = 4


# --------------------------------------------------------------------------- #
# NUMBA DTW  (qm = per-query-frame weight: 0 for filled frames, 1 for real)
# --------------------------------------------------------------------------- #
@nb.njit(cache=True)
def _dtw_pair(a, b, w, qm):
    n, m = a.shape[0], b.shape[0]
    nf = a.shape[1]
    INF = np.inf
    prev = np.full(m + 1, INF)
    cur = np.full(m + 1, INF)
    prev[0] = 0.0
    for i in range(1, n + 1):
        cur[:] = INF
        lo = max(1, i - w)
        hi = min(m, i + w)
        wt = qm[i - 1]
        for j in range(lo, hi + 1):
            if wt > 0.0:
                s = 0.0
                for f in range(nf):
                    d = a[i - 1, f] - b[j - 1, f]
                    s += d * d
                c = np.sqrt(s) * wt
            else:
                c = 0.0
            best = prev[j]
            if cur[j - 1] < best:
                best = cur[j - 1]
            if prev[j - 1] < best:
                best = prev[j - 1]
            cur[j] = c + best
        prev, cur = cur, prev
    return prev[m]


@nb.njit(cache=True, parallel=True)
def _dtw_many(q, refs, w, qm):
    out = np.empty(refs.shape[0])
    for k in nb.prange(refs.shape[0]):
        out[k] = _dtw_pair(q, refs[k], w, qm)
    return out


_ONES = np.ones(N_FRAMES, np.float32)


def dtw_warmup():
    a = np.zeros((N_FRAMES, DTW_N_CONTENT), np.float32)
    _dtw_many(a, np.stack([a, a]), DTW_WINDOW, _ONES)


class DTWBank:
    """Per-class references (lazy .npy), in-class scale, masked DTW class distances."""

    def __init__(self, features_dir: Path, classes: list[str], preload: bool,
                 screen_refs: int = SCREEN_REFS):
        self.dir, self.classes = features_dir, classes
        self.cache: dict[str, np.ndarray | None] = {}
        self.scales: dict[str, float] = {}
        self.scr_stack = None
        self.scr_owner = None
        if preload:
            for g in classes:
                self.refs(g)
            n = sum(len(v) for v in self.cache.values() if v is not None)
            print(f"DTW refs : {n} samples loaded")
            self.build_screen(screen_refs)
        else:
            print("DTW screen disabled (--lazy): only DL top-N is rescored")

    def refs(self, gloss: str):
        if gloss in self.cache:
            return self.cache[gloss]
        arr = None
        p = self.dir / f"{gloss}.npy"
        if p.exists():
            try:
                a = np.load(p)
                if a.ndim == 3 and a.shape[1] == N_FRAMES and a.shape[2] >= DTW_N_CONTENT and len(a):
                    arr = np.ascontiguousarray(a[:, :, :DTW_N_CONTENT], dtype=np.float32)
                else:
                    print(f"WARN: {p.name} has shape {a.shape}, skipped for DTW")
            except Exception as e:
                print(f"WARN: cannot load {p.name}: {e}")
        else:
            print(f"WARN: no DTW reference file for '{gloss}'")
        self.cache[gloss] = arr
        return arr

    def build_screen(self, k: int):
        stack, owner = [], []
        for ci, g in enumerate(self.classes):
            r = self.cache.get(g)
            if r is None:
                continue
            idx = np.unique(np.linspace(0, len(r) - 1, min(max(k, 1), len(r))).astype(int))
            stack.append(r[idx])
            owner.extend([ci] * len(idx))
        if stack:
            self.scr_stack = np.ascontiguousarray(np.concatenate(stack, 0), dtype=np.float32)
            self.scr_owner = np.asarray(owner, np.int64)
            print(f"DTW screen: {len(self.scr_stack)} refs over {len(set(owner))} classes")

    def screen(self, q, qmask):
        """Min DTW distance to the few screen refs of EVERY class (inf = no refs)."""
        out = np.full(len(self.classes), np.inf)
        if self.scr_stack is None:
            return out
        qm = np.ascontiguousarray(qmask, dtype=np.float32)
        fix = N_FRAMES / max(float(qm.sum()), 1.0)
        qq = np.ascontiguousarray(q[:, :DTW_N_CONTENT], dtype=np.float32)
        d = _dtw_many(qq, self.scr_stack, DTW_WINDOW, qm) * fix
        np.minimum.at(out, self.scr_owner, d)
        return out

    def scale(self, gloss: str) -> float:
        """Typical in-class DTW distance (leave-one-out, same window / k as pass 1)."""
        if gloss in self.scales:
            return self.scales[gloss]
        r = self.refs(gloss)
        val = float("nan")
        if r is not None and len(r) >= 2:
            idx = np.unique(np.linspace(0, len(r) - 1, min(SCALE_SAMPLES, len(r))).astype(int))
            vals = []
            for i in idx:
                d = _dtw_many(r[i], r, DTW_WINDOW, _ONES)
                d[i] = np.inf
                d = np.sort(d)
                kk = min(DTW_TOP_K_AVG, len(r) - 1)
                vals.append(float(d[:kk].mean()))
            val = float(np.median(vals))
        if not np.isfinite(val) or val <= 1e-6:
            known = [v for v in self.scales.values() if np.isfinite(v) and v > 1e-6]
            val = float(np.median(known)) if known else 1.0
        self.scales[gloss] = val
        return val

    def distances(self, q, glosses, qmask, window=DTW_WINDOW, k_avg=DTW_TOP_K_AVG):
        """Masked class distance rescaled to a full-length equivalent (nan = no refs)."""
        q = np.ascontiguousarray(q[:, :DTW_N_CONTENT], dtype=np.float32)
        qm = np.ascontiguousarray(qmask, dtype=np.float32)
        n_real = max(float(qm.sum()), 1.0)
        fix = N_FRAMES / n_real
        out = np.full(len(glosses), np.nan, np.float64)
        for i, g in enumerate(glosses):
            r = self.refs(g)
            if r is None:
                continue
            d = np.sort(_dtw_many(q, r, window, qm))
            out[i] = float(d[:min(k_avg, len(d))].mean()) * fix
        return out

    def normalise(self, d, glosses):
        return np.array([d[i] / self.scale(g) if np.isfinite(d[i]) else np.nan
                         for i, g in enumerate(glosses)], np.float64)


# --------------------------------------------------------------------------- #
# DL MODEL
# --------------------------------------------------------------------------- #
def find_model_dir(model_id: str | None) -> Path:
    if not MODELS_ROOT.is_dir():
        sys.exit(f"ERROR: no model folder at {MODELS_ROOT} - run  py train.py  first.")
    if model_id:
        d = MODELS_ROOT / model_id
        if not (d / "sign_daily_lstm.onnx").exists():
            sys.exit(f"ERROR: model id {model_id} has no sign_daily_lstm.onnx")
        return d
    deployed = [p for p in MODELS_ROOT.iterdir()
                if p.is_dir() and not p.name.startswith(".")
                and (p / "sign_daily_lstm.onnx").exists()]
    if not deployed:
        sys.exit(f"ERROR: no deployed model in {MODELS_ROOT} - run  py train.py  first.")
    return max(deployed, key=lambda p: p.stat().st_mtime_ns)


def load_model(model_dir: Path):
    onnx_path = model_dir / "sign_daily_lstm.onnx"
    cls_path = model_dir / "sign_daily_classes.json"
    missing = [str(p) for p in (onnx_path, cls_path) if not p.exists()]
    if missing:
        sys.exit("ERROR: missing model file(s):\n  " + "\n  ".join(missing))
    try:
        classes = json.loads(cls_path.read_text(encoding="utf-8"))
        if not isinstance(classes, list) or not classes or not all(isinstance(c, str) for c in classes):
            raise ValueError("not a list of gloss names")
    except Exception as e:
        sys.exit(f"ERROR: invalid class metadata {cls_path}: {e}")

    so = ort.SessionOptions()
    so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(str(onnx_path), so, providers=["CPUExecutionProvider"])
    in_name = sess.get_inputs()[0].name
    out_name = sess.get_outputs()[0].name
    warm = np.zeros((1, N_FRAMES, N_FEATURES), np.float32)
    logits = sess.run([out_name], {in_name: warm})[0]
    if logits.shape[-1] != len(classes):
        sys.exit(f"ERROR: model outputs {logits.shape[-1]} logits but "
                 f"{cls_path.name} lists {len(classes)} classes - stale metadata.")
    print(f"DL model : {model_dir.name}  ({len(classes)} classes)")
    return sess, in_name, out_name, classes


def find_features_dir(features_id: str) -> Path:
    cands = [EX.TRAIN_ZONE / "dataset_train" / "features" / features_id,
             ROOT / "model_training_zone" / "dataset_train" / "features" / features_id]
    for c in cands:
        if c.is_dir():
            return c
    sys.exit("ERROR: DTW feature folder not found, tried:\n  " + "\n  ".join(map(str, cands)))


def softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - x.max())
    return e / e.sum()


# --------------------------------------------------------------------------- #
# FUSION  (candidates are in DL order: index 0 = DL top-1)
# --------------------------------------------------------------------------- #
def dtw_relative(dn: np.ndarray, power: float) -> np.ndarray:
    n = len(dn)
    valid = np.isfinite(dn)
    rel = np.ones(n)
    if valid.any():
        dmin = max(float(dn[valid].min()), 1e-6)
        rel[valid] = (dmin / np.maximum(dn[valid], 1e-6)) ** power
        rel[~valid] = float(rel[valid].mean())      # neutral for classes without refs
    return rel


def _rank_points(order: np.ndarray, n: int) -> np.ndarray:
    pts = np.zeros(n)
    for r, i in enumerate(order):
        pts[i] = (n - 1 - r) / (n - 1) if n > 1 else 1.0
    return pts


def fuse(p_c, dn, w_dl, w_dtw, mode, power):
    """Returns (fused, dl_rel, dtw_rel). p_c = RAW DL probabilities of the candidates."""
    n = len(p_c)
    dl_rel = p_c / max(float(p_c.max()), 1e-9)      # raw magnitude kept: weak DL stays weak
    dtw_rel = dtw_relative(dn, power)
    score = w_dl * dl_rel + w_dtw * dtw_rel
    if mode == "rank":
        dl_pts = _rank_points(np.argsort(-p_c, kind="stable"), n)
        key = np.where(np.isfinite(dn), dn, np.inf)
        dtw_pts = _rank_points(np.argsort(key, kind="stable"), n)
        return w_dl * dl_pts + w_dtw * dtw_pts + 1e-3 * score, dl_rel, dtw_rel
    return score, dl_rel, dtw_rel


# --------------------------------------------------------------------------- #
# DATA CLASSES / LANDMARKS (from the non-DL system)
# --------------------------------------------------------------------------- #
class Fr:
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t", "held")

    def __init__(self, pose, hands, face, face_ok, in_use, t, held):
        self.pose, self.hands, self.face = pose, hands, face
        self.face_ok, self.in_use, self.t, self.held = face_ok, in_use, t, held


def read_landmarks(res):
    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    if res.pose_landmarks:
        lm = res.pose_landmarks.landmark
        for k, i in enumerate(EX.POSE_IDX):
            pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)
    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl:
            hands[h] = EX._lm(hl.landmark, range(21))
    face = np.full((len(EX.FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok:
        face = EX._lm(res.face_landmarks.landmark, EX.FACE_CACHE_IDX)
    return pose, hands, face, f_ok


def rescue_hands(rgb, pose, hands, in_use, hands_det):
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if not missing:
        return hands, hands_det
    if hands_det is None:
        hands_det = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2,
                                             min_detection_confidence=0.4)
    H, W = rgb.shape[:2]
    maxd = EX.RESCUE_MAX_DIST

    def roi(c, frac):
        s = int(min(max(frac * max(W, H), 64), min(W, H)))
        x0 = int(np.clip(c[0] * W - s / 2, 0, W - s))
        y0 = int(np.clip(c[1] * H - s / 2, 0, H - s))
        crop = cv2.resize(np.ascontiguousarray(rgb[y0:y0 + s, x0:x0 + s]), (256, 256),
                          interpolation=cv2.INTER_CUBIC)
        r, out = hands_det.process(crop), []
        for hl in (r.multi_hand_landmarks or []):
            p = np.array(EX._lm(hl.landmark, range(21)), np.float32)
            p[:, 0] = (x0 + p[:, 0] * s) / W
            p[:, 1] = (y0 + p[:, 1] * s) / H
            p[:, 2] *= s / W
            out.append(p)
        return out

    def taken(p):
        return any(np.isfinite(hands[o, 0, 0])
                   and np.hypot(*(hands[o, 0, :2] - p[0, :2])) < 0.03 for o in (0, 1))

    for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):
        c = pose[wi, :2]
        if h not in missing or not np.isfinite(c).all():
            continue
        for frac in (0.30, 0.45, 0.60):
            best = None
            for p in roi(c, frac):
                d = float(np.hypot(*(p[0, :2] - c)))
                if d < maxd and not taken(p) and (best is None or d < best[0]):
                    best = (d, p)
            if best:
                hands[h] = best[1]
                break
    still = [h for h in missing if np.isnan(hands[h, 0, 0])]
    if still:
        r2 = hands_det.process(rgb)
        if r2.multi_hand_landmarks:
            best = {}
            for hl in r2.multi_hand_landmarks:
                pts = EX._lm(hl.landmark, range(21))
                dists = [float(np.hypot(*(pts[0, :2] - pose[wi, :2])))
                         if np.isfinite(pose[wi, :2]).all() else 9e9
                         for wi in (EX.P_LWR, EX.P_RWR)]
                h = int(np.argmin(dists))
                if h in still and dists[h] < maxd and (h not in best or dists[h] < best[h][0]):
                    best[h] = (dists[h], pts)
            for h, (_, pts) in best.items():
                hands[h] = pts
    return hands, hands_det


def make_hand_holder(max_age: int = HOLD_MAX_AGE):
    """A hand missing for <= max_age frames is carried by wrist translation."""
    state = {0: None, 1: None}

    def apply(pose, hands):
        held = np.zeros(2, bool)
        for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):
            if np.isfinite(hands[h, 0, 0]):
                state[h] = (0, pose[wi, :2].copy(), hands[h].copy())
                continue
            st = state[h]
            if st is None:
                continue
            age, pw, ph = st
            age += 1
            if age <= max_age and np.isfinite(pose[wi, :2]).all() and np.isfinite(pw).all():
                d = pose[wi, :2] - pw
                nh = ph.copy()
                nh[:, 0] += d[0]
                nh[:, 1] += d[1]
                hands[h] = nh
                held[h] = True
                state[h] = (age, pose[wi, :2].copy(), nh)
            else:
                state[h] = (age, pw, ph)
        return hands, held
    return apply


# --------------------------------------------------------------------------- #
# HAND-RAISE DETECTION
# --------------------------------------------------------------------------- #
def raise_levels(pose, W, H):
    levels = np.zeros(2, np.float64)
    fin = np.array([np.isfinite(pose[EX.P_LWR, 1]), np.isfinite(pose[EX.P_RWR, 1])])
    sl = pose[EX.P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[EX.P_RSH, :2].astype(np.float64) * [W, H]
    if not (np.isfinite(sl).all() and np.isfinite(sr).all()):
        return levels, fin, False
    sw = float(np.linalg.norm(sl - sr))
    if sw < 1e-6:
        return levels, fin, False
    if pose[EX.P_LHIP, 3] >= 0.5 and pose[EX.P_RHIP, 3] >= 0.5:
        rest_y = (pose[EX.P_LHIP, 1] + pose[EX.P_RHIP, 1]) / 2.0 * H
    else:
        rest_y = (sl[1] + sr[1]) / 2.0 + 1.3 * sw
    for h, wi in enumerate((EX.P_LWR, EX.P_RWR)):
        if fin[h]:
            levels[h] = (rest_y - pose[wi, 1] * H) / sw
    return levels, fin, True


def raise_state(pose, W, H):
    levels, fin, ok = raise_levels(pose, W, H)
    if not ok or not fin.any():
        return False, False
    vals = levels[fin]
    return bool((vals > RAISE_START_MARGIN).any()), bool((vals < RAISE_STOP_MARGIN).all())


# --------------------------------------------------------------------------- #
# CLIP BUILDING - detection first, never rejects
# --------------------------------------------------------------------------- #
def _hold_valid(arr):
    out = arr.copy()
    F = out.shape[0]
    flat = out.reshape(F, -1)
    valid = np.isfinite(flat).all(axis=1)
    if valid.all() or not valid.any():
        return out
    idx = np.flatnonzero(valid)
    for i in np.flatnonzero(~valid):
        flat[i] = flat[int(idx[np.argmin(np.abs(idx - i))])]
    return out


def _select(complete):
    F = len(complete)
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur
    pos = np.floor(np.arange(N_FRAMES) * (F - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0 or n - p > EX.MAX_GAP:
            return None
        chosen.append(int(n))
    return chosen


def _stretch(complete):
    good = np.flatnonzero(complete)
    if good.size < 1:
        return None
    k = np.floor(np.arange(N_FRAMES) * (good.size - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    return [int(i) for i in good[k]]


def build_clip(buf, W, H, fps_est):
    """Always returns (feats (1,64,98), note, real_mask (64,) bool).
    real_mask[t] is False when the chosen frame t had a missing / motion-held hand."""
    F = len(buf)
    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf]).copy()
    held = np.stack([f.held for f in buf])

    miss_frame = (in_use[:, :2].astype(bool) & np.isnan(hands[:, :, 0, 0])).any(1)
    bad_frame = miss_frame | held.any(1)
    n_miss_raw, n_held = int(miss_frame.sum()), int(held.any(1).sum())

    pose_f = _hold_valid(pose)
    hands_f = _hold_valid(hands)
    face_f = _hold_valid(face)
    vis_nan = np.isnan(pose[:, :, 0])
    pose_f[:, :, 3] = np.where(vis_nan, 0.9, np.nan_to_num(pose_f[:, :, 3], nan=0.0))
    face_ok_f = face_ok | np.isfinite(face_f).all(axis=(1, 2))

    still_nan = np.isnan(hands_f[:, :, 0, 0])
    in_use_eff = in_use.copy()
    in_use_eff[:, :2] &= ~still_nan[:, :2]

    raw = dict(pose=pose_f, hands=hands_f, face=face_f, face_ok=face_ok_f, W=W, H=H)
    complete = np.asarray(EX.complete_mask(raw, in_use_eff), bool)

    note = "ok"
    chosen = _select(complete)
    if chosen is None:
        chosen = _stretch(complete)
        if chosen is not None:
            note = f"stretched from {int(complete.sum())}/{F} frames"
    if chosen is None:
        iu3 = in_use_eff.copy()
        iu3[:, :2] = False
        c3 = np.asarray(EX.complete_mask(raw, iu3), bool)
        chosen = _select(c3) or _stretch(c3)
        if chosen is not None:
            in_use_eff, note = iu3, "hands absent; pose-only geometry"
    if chosen is None:
        score = np.isfinite(pose_f).sum(axis=(1, 2)) + np.isfinite(hands_f).sum(axis=(1, 2))
        b = int(np.argmax(score))
        chosen = [b] * N_FRAMES
        note = f"single frame {b} held (very low quality)"
    if note == "ok" and (n_miss_raw or n_held):
        note = f"filled {n_miss_raw}/{F} missing-hand frames ({n_held} motion-held)"

    real = ~bad_frame[np.asarray(chosen)]
    if int(real.sum()) < MIN_REAL_FRAMES:
        real = np.ones(N_FRAMES, bool)              # not enough real data: use everything

    duration = F / max(fps_est, 1e-4)
    with np.errstate(all="ignore"):
        feats = np.stack([EX.frame_features(pose_f[i], hands_f[i], face_f[i],
                                            in_use_eff[i], W, H, duration) for i in chosen])
    feats = np.nan_to_num(feats.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0)
    return feats[None], note, real


# --------------------------------------------------------------------------- #
# ENHANCEMENT & OVERLAY
# --------------------------------------------------------------------------- #
def enhance_image(frame):
    g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    m, s = float(g.mean()), float(g.std())
    if 90 < m < 170 and s > 50:
        return frame
    out = frame
    if m < 90 or m > 170:
        gamma = float(np.clip(math.log(115 / 255) / math.log(max(m, 1) / 255), 0.55, 1.8))
        out = cv2.LUT(out, (255 * (np.arange(256) / 255) ** gamma).astype(np.uint8))
    lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB)
    lab[..., 0] = cv2.createCLAHE(clipLimit=3.0 if s < 35 else 2.0,
                                  tileGridSize=(8, 8)).apply(lab[..., 0])
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)


def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw_skeleton(img, fr: Fr, W, H):
    def to_px(pt):
        return (int(pt[0] * W), int(pt[1] * H))
    for i in range(8):
        if np.isfinite(fr.pose[i, 0]):
            cv2.circle(img, to_px(fr.pose[i]), 4,
                       (0, 255, 0) if fr.pose[i, 3] >= 0.5 else (0, 165, 255), -1)
    for h in (0, 1):
        color = (0, 255, 0) if not np.isnan(fr.hands[h, 0, 0]) else (0, 165, 255)
        for pt in fr.hands[h]:
            if np.isfinite(pt[0]):
                cv2.circle(img, to_px(pt), 3, color, -1)
    if fr.face_ok:
        for pt in fr.face:
            if np.isfinite(pt[0]):
                cv2.circle(img, to_px(pt), 2, (255, 0, 0), -1)


def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until, now,
         raised_now, note="", stats=""):
    put(img, f"mode {mode.upper()}  state {state}  [DL+DTW]", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(img, f"hand raise: {'YES' if raised_now else 'no'}", (12, 76), 0.6,
        (90, 255, 120) if raised_now else (150, 150, 150))
    put(img, "M mode  L label  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if stats:
        put(img, stats, (12, img.shape[0] - 36), 0.5, (170, 200, 170), 1)
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 98), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, lines, extras, low = result
        col = (90, 190, 255) if low else (110, 230, 140)
        put(img, headline, (12, 130), 1.0, col, 2)
        y = 160
        for k, line in enumerate(lines):
            put(img, f"{k + 1}. {line}", (12, y), 0.55, (230, 230, 225))
            y += 26
        for ei, e in enumerate(extras):
            put(img, e, (12, y + 2), 0.5 if ei == 0 else 0.45,
                (255, 220, 120) if ei == 0 else (190, 200, 210), 1)
            y += 22
        if note:
            put(img, f"LOW QUALITY: {note}", (12, y + 4), 0.5, (0, 165, 255), 1)


def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y), cv2.FONT_HERSHEY_SIMPLEX,
                scale, color, thick, cv2.LINE_AA)


# --------------------------------------------------------------------------- #
# LABEL LOGGING
# --------------------------------------------------------------------------- #
def match_class(text: str, classes: list[str]):
    t = text.strip().upper().replace(" ", "_")
    if not t:
        return None
    names = [(c, c.upper().replace(" ", "_")) for c in classes]
    for c, u in names:
        if u == t:
            return c
    for c, u in sorted(names, key=lambda x: x[1]):
        if u.startswith(t):
            return c
    for c, u in sorted(names, key=lambda x: x[1]):
        if t in u:
            return c
    return None


EVAL_FIELDS = ["time", "true", "dl_top1", "dtw_top1", "hybrid", "dl_ok", "dtw_ok", "hybrid_ok",
               "true_in_union", "consensus", "dl_top5", "dtw_top5", "candidates", "p_dl", "d_norm",
               "fused", "quality", "rec_file"]


def log_eval(ev: dict, true_cls: str):
    cands = ev["cands"]
    dl, dtw, hyb = cands[ev["dl_top"]], (cands[ev["dtw_top"]] if ev["dtw_top"] >= 0 else ""), cands[ev["win"]]
    row = dict(time=time.strftime("%Y-%m-%d %H:%M:%S"), true=true_cls, dl_top1=dl, dtw_top1=dtw,
               hybrid=hyb, dl_ok=int(dl == true_cls), dtw_ok=int(dtw == true_cls),
               hybrid_ok=int(hyb == true_cls), true_in_union=int(true_cls in cands),
               consensus=int(ev["consensus"]), dl_top5="|".join(ev["dl5"]),
               dtw_top5="|".join(ev["dtw5"]), candidates="|".join(cands), p_dl="|".join(f"{v:.4f}" for v in ev["p_c"]),
               d_norm="|".join(f"{v:.4f}" for v in ev["dn"]),
               fused="|".join(f"{v:.4f}" for v in ev["fused"]),
               quality=ev["note"], rec_file=ev["rec_file"])
    new = not EVAL_CSV.exists()
    try:
        with open(EVAL_CSV, "a", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=EVAL_FIELDS)
            if new:
                w.writeheader()
            w.writerow(row)
    except Exception as e:
        print(f"WARN: could not write {EVAL_CSV.name}: {e}")
    return row


# --------------------------------------------------------------------------- #
# MAIN
# --------------------------------------------------------------------------- #
def parse_args():
    ap = argparse.ArgumentParser(description="Hybrid DL + DTW live sign recognition.")
    ap.add_argument("--model-id", default=None)
    ap.add_argument("--features-id", default="3", help="DTW reference feature folder (default 3)")
    ap.add_argument("--top-n", type=int, default=TOP_N, help="DL candidates sent to DTW")
    ap.add_argument("--fusion", choices=("score", "rank"), default="score")
    ap.add_argument("--w-dl", type=float, default=W_DL)
    ap.add_argument("--w-dtw", type=float, default=W_DTW)
    ap.add_argument("--dtw-pow", type=float, default=DTW_POW)
    ap.add_argument("--close-gap", type=float, default=CLOSE_GAP)
    ap.add_argument("--rescue-skip", type=int, default=RESCUE_SKIP,
                    help="frames to skip hand rescue after it failed (higher = more fps)")
    ap.add_argument("--width", type=int, default=LIVE_WIDTH)
    ap.add_argument("--complexity", type=int, default=0, choices=(0, 1))
    ap.add_argument("--camera", type=int, default=0)
    ap.add_argument("--lazy", action="store_true",
                    help="load DTW refs on demand (disables the all-class DTW screen)")
    ap.add_argument("--screen-refs", type=int, default=SCREEN_REFS,
                    help="refs per class in the all-class DTW screen")
    ap.add_argument("--screen-top", type=int, default=SCREEN_TOP,
                    help="DTW-screen classes added to the DL top-N before full DTW")
    ap.add_argument("--mask", action="store_true",
                    help="DTW ignores filled frames (off = filled frames are used, as before)")
    ap.add_argument("--no-save", action="store_true", help="do not save recordings")
    return ap.parse_args()


def main():
    args = parse_args()
    ws = max(args.w_dl, 0.0) + max(args.w_dtw, 0.0)
    if ws <= 0:
        sys.exit("ERROR: --w-dl and --w-dtw cannot both be 0")
    w_dl, w_dtw = max(args.w_dl, 0.0) / ws, max(args.w_dtw, 0.0) / ws

    print("=" * 70)
    print(" WBSL Hybrid Recognition - DL top-N -> DTW rescoring (always answers)")
    print("=" * 70)
    model_dir = find_model_dir(args.model_id)
    sess, in_name, out_name, classes = load_model(model_dir)
    top_n = int(np.clip(args.top_n, 1, len(classes)))
    bank = DTWBank(find_features_dir(args.features_id), classes, not args.lazy, args.screen_refs)
    dtw_warmup()
    print(f"Hybrid   : DL top-{top_n} x DTW all-class screen, fusion {args.fusion}, weights DL {w_dl:.2f} / DTW {w_dtw:.2f}, "
          f"pow {args.dtw_pow}, close-gap {args.close_gap}")

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        sys.exit(f"ERROR: cannot open webcam {args.camera}")

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=args.complexity,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.5, min_tracking_confidence=0.5)
    hands_det = None
    hold = make_hand_holder()

    modes = ["auto", "timed"]
    mode, state = "auto", "IDLE"
    up = down = 0
    buf = []
    pre = deque(maxlen=EX.PRE_ROLL + RAISE_CONFIRM_FRAMES)
    result, result_until, result_note = None, 0.0, ""
    msg, msg_until = None, 0.0
    lat_ms = 0.0
    ema_dt = 1.0 / 30.0
    prev_t = time.perf_counter()
    read_fails = 0
    span_t0 = 0.0
    last_up_rel = 0
    timed_start = time.perf_counter()
    timed_raised = 0
    rec_count = 0
    raised_now = False
    W_cur = H_cur = 0
    rescue_wait = 0                       # frames left to skip rescue (fps saver)

    last_eval = None
    label_mode, label_text = False, ""
    ev_n = ev_dl = ev_dtw = ev_hyb = 0

    if not args.no_save:
        RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)

    def close_span(frames):
        nonlocal result, result_until, lat_ms, rec_count, result_note, last_eval
        if not frames:
            return
        feats, note, real = build_clip(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
        n_real = int(real.sum())
        qmask = real if args.mask else np.ones(N_FRAMES, bool)
        t0 = time.perf_counter()

        # 1) DL over all classes -> its top-N
        logits = sess.run([out_name], {in_name: feats})[0]
        p = softmax(logits[0].astype(np.float64))
        dl5 = [int(i) for i in np.argsort(-p)[:top_n]]

        # 2) DTW screen over ALL classes (few refs each) -> DTW's own shortlist
        scr = bank.screen(feats[0], qmask)
        scr_top = [int(i) for i in np.argsort(scr) if np.isfinite(scr[i])][:max(args.screen_top, 0)]

        # 3) full DTW (all refs, per-class scaled) on the union; U[0] = DL top-1
        U = dl5 + [i for i in scr_top if i not in dl5]
        cands = [classes[i] for i in U]
        p_c = p[U]
        n_dl = len(dl5)
        d_raw = bank.distances(feats[0], cands, qmask)
        dn = bank.normalise(d_raw, cands)
        valid = np.isfinite(dn)
        dtw_pos = [int(i) for i in np.argsort(np.where(valid, dn, np.inf)) if valid[i]][:top_n]
        dtw_top = dtw_pos[0] if dtw_pos else -1

        # 4) fuse over the union, then apply the matching rule
        fused, dl_rel, dtw_rel = fuse(p_c, dn, w_dl, w_dtw, args.fusion, args.dtw_pow)
        disp = fused.copy()
        by_fused = [int(i) for i in np.argsort(-fused)]
        inter = [i for i in by_fused if i < n_dl and i in dtw_pos]      # in BOTH top-5 lists
        consensus = bool(inter)
        deep = False
        gap = 1.0
        if consensus:
            ranking = inter + [i for i in by_fused if i not in inter]
            gap = float(fused[inter[0]] - fused[inter[1]]) if len(inter) > 1 else 1.0
            # close call between the top two -> deeper DTW pass decides
            if len(inter) > 1 and gap < args.close_gap:
                a, b = inter[0], inter[1]
                pair = [cands[a], cands[b]]
                d2 = bank.distances(feats[0], pair, qmask, DEEP_WINDOW, DEEP_K_AVG)
                if np.isfinite(d2).all():
                    n2 = np.array([d2[0] / bank.scale(pair[0]), d2[1] / bank.scale(pair[1])])
                    new, _, _ = fuse(p_c[[a, b]], n2, w_dl, w_dtw, args.fusion, args.dtw_pow)
                    disp[a], disp[b] = new[0], new[1]
                    gap = float(abs(new[0] - new[1]))
                    if new[1] > new[0]:
                        ranking[0], ranking[1] = b, a
                    deep = True
            win = ranking[0]
        else:
            win = 0                                           # DL answer kept; DTW = opinion only
            ranking = list(range(n_dl))
        lat_ms = (time.perf_counter() - t0) * 1000.0

        agree = (win == 0 == dtw_top)
        low = (not consensus) or ((not agree) and gap < LOW_GAP) or note.startswith("single frame")
        headline = cands[win] + (" (low)" if low else "")

        top_show = float(max(max(disp[i] for i in ranking[:SHOW_K]), 1e-9))
        lines = []
        for i in ranking[:SHOW_K]:
            d_txt = f"{dn[i]:.2f}x" if np.isfinite(dn[i]) else "--"
            lines.append(f"{cands[i]}  {100 * disp[i] / top_show:3.0f}   DL {100 * p_c[i]:3.0f}%  d={d_txt}")
        extras = []
        if not consensus:
            extras.append(f"no DL/DTW match -> DL kept | DTW opinion: "
                          f"{cands[dtw_top] if dtw_top >= 0 else '--'}")
        elif win != 0:
            extras.append(f"DL alone: {cands[0]} ({100 * p_c[0]:.0f}%) -> hybrid changed it"
                          + ("  [deep]" if deep else ""))
        elif deep:
            extras.append("[deep pass]")
        extras.append("DL5 : " + " ".join(cands[i] for i in range(n_dl)))
        extras.append("DTW5: " + " ".join(cands[i] for i in dtw_pos))
        note_show = "" if note == "ok" else note
        if args.mask and n_real < N_FRAMES:
            note_show = (note_show + f" | DTW real frames {n_real}/{N_FRAMES}").strip(" |")
        result = (headline, lines, extras, low)
        result_until = time.perf_counter() + RESULT_HOLD_S
        result_note = note_show

        rec_file = ""
        if not args.no_save:
            rec_count += 1
            rec_path = RECORDINGS_DIR / f"rec_{int(time.time())}_{rec_count:04d}.npz"
            try:
                np.savez(rec_path,
                         raw_hands=np.stack([f.hands for f in frames]),
                         raw_pose=np.stack([f.pose for f in frames]),
                         raw_in_use=np.stack([f.in_use for f in frames]),
                         held=np.stack([f.held for f in frames]),
                         final_features=feats[0], real_mask=real, prediction=headline,
                         candidates=np.array(cands), p_dl=p_c, d_norm=dn,
                         fused=disp, quality=note)
                rec_file = rec_path.name
            except Exception as e:
                print(f"WARN: could not save recording: {e}")

        last_eval = dict(cands=cands, p_c=p_c, dn=dn, fused=disp, win=win, dl_top=0,
                         dtw_top=dtw_top, note=note, rec_file=rec_file, done=False,
                         consensus=consensus, dl5=[cands[i] for i in range(n_dl)],
                         dtw5=[cands[i] for i in dtw_pos])
        print(f"[{time.strftime('%H:%M:%S')}] {headline} | {'MATCH' if consensus else 'NO-MATCH'} | "
              f"DL5: {' '.join(cands[i] for i in range(n_dl))} | "
              f"DTW5: {' '.join(cands[i] for i in dtw_pos)} | {lat_ms:.0f} ms | "
              f"real {n_real}/{N_FRAMES}{' | deep' if deep else ''} | {note}")

    print("\nLive running! Controls: M=toggle mode | L=label last result | Q/ESC=quit\n")

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                read_fails += 1
                if read_fails >= MAX_READ_FAILS:
                    print("ERROR: webcam stopped delivering frames.")
                    break
                time.sleep(0.01)
                continue
            read_fails = 0
            now = time.perf_counter()
            dt = now - prev_t
            prev_t = now
            if 0.0 < dt < 1.0:
                ema_dt = 0.9 * ema_dt + 0.1 * dt
            fps = 1.0 / max(ema_dt, 1e-4)

            fh, fw = frame.shape[:2]
            small = (cv2.resize(frame, (args.width, int(round(fh * args.width / fw))))
                     if fw > args.width else frame)
            small_enh = enhance_image(small)
            H_cur, W_cur = small_enh.shape[:2]

            rgb = cv2.cvtColor(small_enh, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose, hands, face, f_ok = read_landmarks(res)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)

            # hand rescue is the slow part: after a failed attempt, skip a few frames
            # (the hand holder bridges short gaps) instead of retrying every frame
            if rescue_wait > 0:
                rescue_wait -= 1
            else:
                hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
                if any(in_use[h] and np.isnan(hands[h, 0, 0]) for h in (0, 1)):
                    rescue_wait = max(args.rescue_skip, 0)
            hands, held_flags = hold(pose, hands)
            fr = Fr(pose, hands, face, f_ok, in_use, now, held_flags)
            raised_now, lowered_now = raise_state(pose, W_cur, H_cur)

            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    if raised_now:
                        up += 1
                    elif lowered_now:
                        up = 0
                    if up >= RAISE_CONFIRM_FRAMES:
                        state, down = "SIGN", 0
                        buf = list(pre)
                        span_t0 = now
                        last_up_rel = len(buf) - 1
                else:
                    buf.append(fr)
                    rel = len(buf) - 1
                    if raised_now:
                        last_up_rel, down = rel, 0
                    elif lowered_now:
                        down += 1
                    if down >= LOWER_CONFIRM_FRAMES or (now - span_t0) >= MAX_SPAN_S:
                        end_rel = min(last_up_rel + EX.KEEP_TAIL, rel)
                        close_span(buf[:end_rel + 1])
                        state, up, down, buf = "IDLE", 0, 0, []
                        pre.clear()
            elif mode == "timed":
                buf.append(fr)
                if raised_now:
                    timed_raised += 1
                if now - timed_start >= TIMED_DURATION:
                    if timed_raised >= RAISE_CONFIRM_FRAMES:
                        close_span(buf)
                    else:
                        msg, msg_until = "No raised hand in last 7s", time.perf_counter() + MSG_HOLD_S
                    buf, timed_raised = [], 0
                    timed_start = now

            # ---- keys ---- #
            k = cv2.waitKey(1) & 0xFF
            if label_mode:
                if k == 13:                                        # ENTER
                    true_cls = match_class(label_text, classes)
                    if true_cls and last_eval is not None:
                        row = log_eval(last_eval, true_cls)
                        last_eval["done"] = True
                        ev_n += 1
                        ev_dl += row["dl_ok"]
                        ev_dtw += row["dtw_ok"]
                        ev_hyb += row["hybrid_ok"]
                        msg, msg_until = (f"saved: {true_cls}  hybrid {'OK' if row['hybrid_ok'] else 'WRONG'}",
                                          time.perf_counter() + MSG_HOLD_S)
                        print(f"LABEL {true_cls}: DL {'ok' if row['dl_ok'] else 'x'} | "
                              f"DTW {'ok' if row['dtw_ok'] else 'x'} | "
                              f"HYBRID {'ok' if row['hybrid_ok'] else 'x'} | in union {row['true_in_union']}")
                    else:
                        msg, msg_until = "unknown sign name", time.perf_counter() + MSG_HOLD_S
                    label_mode, label_text = False, ""
                elif k == 27:
                    label_mode, label_text = False, ""
                elif k in (8, 127):
                    label_text = label_text[:-1]
                elif 32 <= k < 127:
                    label_text += chr(k).upper()
            else:
                if k in (27, ord("q"), ord("Q")):
                    break
                if k in (ord("m"), ord("M")):
                    mode = modes[(modes.index(mode) + 1) % len(modes)]
                    state, buf, up, down = "IDLE", [], 0, 0
                    pre.clear()
                    timed_start = time.perf_counter()
                    timed_raised = 0
                elif k in (ord("l"), ord("L")):
                    if last_eval is None:
                        msg, msg_until = "no result to label yet", time.perf_counter() + MSG_HOLD_S
                    elif last_eval["done"]:
                        msg, msg_until = "last result already labelled", time.perf_counter() + MSG_HOLD_S
                    else:
                        label_mode, label_text = True, ""

            # Display only is mirrored; detection / features / recordings are unmirrored.
            draw_skeleton(frame, fr, fw, fh)
            frame = cv2.flip(frame, 1)
            rec_s = (now - buf[0].t) if buf else 0.0
            stats = (f"eval n={ev_n}  DL {ev_dl}  DTW {ev_dtw}  HYBRID {ev_hyb}" if ev_n else "")
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf), result, result_until,
                 now, raised_now, note=result_note, stats=stats)
            if mode == "timed":
                remaining = max(0.0, TIMED_DURATION - (now - timed_start))
                put(frame, f"NEXT SCAN IN: {remaining:.1f}s", (12, 120), 0.7, (0, 165, 255))
            if msg and now < msg_until:
                draw_centred(frame, msg, 60, 0.85, (80, 120, 255))
            if label_mode:
                guess = match_class(label_text, classes) if label_text else None
                draw_centred(frame, f"TRUE SIGN: {label_text}_   ->  {guess or '?'}",
                             frame.shape[0] - 64, 0.7, (80, 255, 255))
                draw_centred(frame, "ENTER save   ESC cancel", frame.shape[0] - 90, 0.5,
                             (200, 200, 200), 1)
            cv2.imshow("WBSL Hybrid DL+DTW Recognition", frame)

    except KeyboardInterrupt:
        print("\nInterrupted by user.")
    finally:
        print("Shutting down cleanly...")
        try:
            holistic.close()
        except Exception:
            pass
        if hands_det is not None:
            try:
                hands_det.close()
            except Exception:
                pass
        cap.release()
        cv2.destroyAllWindows()
    print("Bye.")


if __name__ == "__main__":
    main()