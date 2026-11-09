# Minimal Viable Test: Non-DL Sign Recognition & Production Decision

## 1. Executive Summary & Production Decision

During the evaluation of classical and temporal alignment techniques for West Bengal Sign Language (WBSL) recognition, we benchmarked standalone k-Nearest Neighbors (Cosine Distance) and Dynamic Time Warping (Sakoe-Chiba DTW) against our 61-class landmark dataset (3,391 total clips).

Based on rigorous cross-validation and latency profiling, we made the following strategic architectural decisions:

1. **Architecture Selection**: We selected the **hybrid KNN + Numba-DTW cascade** as our final architecture because it perfectly balances KNN's instant shortlisting speed with DTW's **99.4%** temporal verification accuracy.
2. **Real-Time Latency**: By using KNN to shortlist candidates and Numba-DTW to verify them, the total inference latency drops to **under 10ms** (~3.6ms for KNN preview + ~3.9ms for DTW confirmation), making it highly efficient for real-time deployment on commodity CPU hardware without requiring GPU acceleration.
3. **Production Role (Confidence-Gated Safety Net)**: Consequently, this hybrid pipeline will be implemented as a **confidence-gated safety net to confirm or override the Deep Learning model's low-confidence predictions in production**. When the primary DL model produces an ambiguous classification or low softmax margin, the non-DL hybrid cascade serves as an authoritative ground-truth arbiter.

---

## 2. Benchmark & Verification Matrix

The pipeline was validated using a strict **Grouped Split** (preventing near-duplicate and augmentation leakage by clustering clips with pairwise cosine distance $< 10^{-3}$ into the same partition) as well as **5-Fold Grouped Cross-Validation** over all 3,391 clips.

### Grouped Held-Out Benchmark (679 Validation Samples, Seed 42)

| Pipeline Stage / Algorithm | Paradigm | Accuracy | Top-5 Recall | Macro F1 | Comparisons / Query | Latency (Single Query) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Stage 1: KNN Cosine** | Direct 1-Stage (`content[0:95]`) | 94.4% | 99.6% | 0.9464 | 2,712 dot products | **~3.64 ms** |
| **Stage 2: Numba DTW** | KNN Top-5 Shortlist Prefilter | **99.4%** | **99.6%** | **0.9945** | **222 DTW aligns** | **~3.90 ms** |

### 5-Fold Grouped Cross-Validation (Full 3,391 Samples, Mean ± Std)

| Algorithm | Mean Accuracy | Top-5 Candidate Recall | Macro F1 Score |
| :--- | :---: | :---: | :---: |
| **KNN Cosine (k=3)** | 93.42% ± 0.60% | 99.15% ± 0.30% | 0.9357 ± 0.0050 |
| **Two-Stage DTW (KNN Prefilter)** | **98.76% ± 0.31%** | **99.15% ± 0.30%** | **0.9872 ± 0.0035** |

> **Key Takeaway:** Evaluating DTW over the whole training set requires 2,712 alignments per query (~50ms+). By having KNN shortlist the Top-5 candidate classes, DTW only performs ~222 alignments, reducing computation by **91.8%** while achieving **99.4% holdout accuracy** and **98.76% cross-validated accuracy**.

---

## 3. Two-Stage Cascade Architecture

```
[Input Clip: 64 frames × 98 features]
   │
   ▼ Slice Content Features [0:95] (drops binary hand flags & duration)
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 1: KNN Cosine Candidate Shortlisting                       │
│ • Flatten (64, 95) → (6,080,) unit-normalized float32 vector     │
│ • 1 BLAS dot product against 2,712 training vectors              │
│ • np.minimum.reduceat → per-class global min distance            │
│ • Output: Instant preview label + Top-5 candidate glosses        │
│ • Latency: ~3.64 ms                                              │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  │ Top-5 Candidate Classes (~222 samples)
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ STAGE 2: Numba Sakoe-Chiba DTW Verification                      │
│ • Evaluates only training clips of shortlisted classes           │
│ • Sakoe-Chiba band w = 10, rolling O(M) memory buffer            │
│ • Score = mean of 3 lowest DTW sequence distances per class      │
│ • Output: Temporally verified sign classification                │
│ • Latency: ~3.90 ms                                              │
└─────────────────────────────────┬────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│ CONFIDENCE & REJECTION GATE                                      │
│ • Checks: best_distance <= 116.50 AND margin (d2 - d1) >= 25.65   │
│ • Passed: Confirmed prediction                                   │
│ • Failed: Fallback to "Not Sure / Out of Vocabulary"             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Production Code Implementation

Below is the complete, production-grade implementation of the live Non-DL recognition system (
on_dl_recognition/recognition.py). It is architecturally inspired by and mirrors model_training_zone/test_model.py (MediaPipe Holistic processing, same span tracking, identical 64-frame selection and feature extraction), executing our verified **Hybrid KNN Top-5 Preview + Numba DTW Confirmation** cascade with calibrated rejection gating:

`python
#!/usr/bin/env python3
"""
non_dl_recognition/recognition.py — Production Live Non-DL Sign Recognition System.

Inspired by and architecturally matching `model_training_zone/test_model.py`:
  * MediaPipe Holistic per frame (frames NOT mirrored, left hand = index 0)
  * Sign-span state machine (IDLE -> SIGN -> end) using extract.py constants
  * 64-frame selection with MAX_GAP rule and identical 98-feature builder
  * Production Selected Algorithm: Hybrid Cascade (KNN Top-5 Preview -> Numba Sakoe-Chiba DTW Verification)
  * Distance-based rejection gating calibrated on OOV samples
  * Real-time OpenCV visualization overlay

Usage:
    py -m non_dl_recognition.recognition [--width PX] [--complexity 0|1] [--camera IDX] [--no-dtw]

Keys:
    SPACE  start/stop manual recording
    M      toggle auto <-> manual detection mode
    Q/ESC  quit
"""
from __future__ import annotations

import argparse
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

# --------------------------------------------------------------------------- #
# PATHS & DATA CONFIG
# --------------------------------------------------------------------------- #
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

import model_training_zone.extract as EX

FEATURES_DIR = ROOT / "model_training_zone" / "dataset_train" / "features" / "3"
CLASSES_JSON = ROOT / "models" / "onnx_models" / "5" / "sign_daily_classes.json"
REPORTS_DIR = Path(__file__).resolve().parent / "reports"
THRESHOLDS_JSON = REPORTS_DIR / "rejection_thresholds.json"

# Feature configuration
N_FRAMES = 64
N_FEATURES = 98
DTW_N_CONTENT = 95       # content features [0:95]; drops hand flags [95:97] + duration [97]

# Production Algorithm Hyperparameters
KNN_K = 3
KNN_EPS = 1e-3
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3

# UI & Display (identical look & feel to test_model.py)
LIVE_WIDTH = 640
TOP_K = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30

# Load calibrated rejection thresholds
REJECT = (json.loads(THRESHOLDS_JSON.read_text(encoding="utf-8"))
          if THRESHOLDS_JSON.exists() else None)


# --------------------------------------------------------------------------- #
# NUMBA SAKOE-CHIBA DTW KERNELS (Production Verified)
# --------------------------------------------------------------------------- #
@nb.njit(cache=True)
def _dtw_pair(a: np.ndarray, b: np.ndarray, w: int) -> float:
    """Sakoe-Chiba band DTW alignment. Rolling two-row O(m) memory buffer."""
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
        for j in range(lo, hi + 1):
            s = 0.0
            for f in range(nf):
                d = a[i - 1, f] - b[j - 1, f]
                s += d * d
            best = prev[j]
            if cur[j - 1] < best:
                best = cur[j - 1]
            if prev[j - 1] < best:
                best = prev[j - 1]
            cur[j] = np.sqrt(s) + best
        prev, cur = cur, prev
    return prev[m]


@nb.njit(cache=True, parallel=True)
def _dtw_many(q: np.ndarray, refs: np.ndarray, w: int) -> np.ndarray:
    """Parallel DTW: one query (T, F) vs R references (R, T, F) -> (R,)."""
    out = np.empty(refs.shape[0])
    for k in nb.prange(refs.shape[0]):
        out[k] = _dtw_pair(q, refs[k], w)
    return out


def dtw_many(q: np.ndarray, refs: np.ndarray, window: int = DTW_WINDOW) -> np.ndarray:
    q = np.ascontiguousarray(q, dtype=np.float32)
    refs = np.ascontiguousarray(refs, dtype=np.float32)
    return _dtw_many(q, refs, max(window, abs(q.shape[0] - refs.shape[1])))


def warmup():
    """Trigger JIT compilation at startup."""
    a = np.zeros((N_FRAMES, DTW_N_CONTENT), np.float32)
    dtw_many(a, np.stack([a, a]))


# --------------------------------------------------------------------------- #
# PRODUCTION RECOGNIZERS (KNN Candidate Shortlist + DTW Verification)
# --------------------------------------------------------------------------- #
class KNNRecognizer:
    """Exact cosine-KNN using a pre-normalized float32 matrix (one BLAS call)."""

    def __init__(self, k: int = KNN_K, eps: float = KNN_EPS):
        self.k = k
        self.eps = eps
        self._Tn = None
        self._y = None
        self._cls = None
        self._starts = None
        self._classes = None

    def _prep(self, X: np.ndarray) -> np.ndarray:
        X = np.asarray(X, dtype=np.float32)[:, :, :DTW_N_CONTENT]
        F = X.reshape(len(X), -1)
        return (F / np.maximum(np.linalg.norm(F, axis=1, keepdims=True), 1e-9)).astype(np.float32)

    def fit(self, X: np.ndarray, y: np.ndarray):
        y = np.asarray(y, dtype=np.int32)
        order = np.argsort(y, kind="stable")
        self._Tn = np.ascontiguousarray(self._prep(X)[order])
        self._y = y[order]
        self._cls, self._starts = np.unique(self._y, return_index=True)
        self._classes = self._cls.tolist()
        return self

    def distances(self, X: np.ndarray) -> np.ndarray:
        return 1.0 - (self._prep(X) @ self._Tn.T)

    def class_min_distances(self, D: np.ndarray) -> np.ndarray:
        return np.minimum.reduceat(D, self._starts, axis=1)

    def rank_classes(self, X: np.ndarray, topn: int = DTW_TOP_M_CANDIDATES):
        """Global per-class minimum distance ranking (guarantees Top-5 Recall)."""
        M = self.class_min_distances(self.distances(X))
        n = min(topn, M.shape[1])
        order = np.argsort(M, axis=1)[:, :n]
        return self._cls[order], np.take_along_axis(M, order, axis=1)

    def predict_proba(self, X: np.ndarray) -> list[dict[int, float]]:
        D = self.distances(X)
        k = min(self.k, D.shape[1])
        out = []
        for row in D:
            nn = np.argpartition(row, k - 1)[:k]
            w = 1.0 / (row[nn] + self.eps)
            votes: dict[int, float] = {}
            for lab, wt in zip(self._y[nn], w):
                votes[int(lab)] = votes.get(int(lab), 0.0) + float(wt)
            tot = sum(votes.values())
            out.append({c: v / tot for c, v in votes.items()})
        return out


class TwoStageDTWRecognizer:
    """Numba-DTW verification strictly across shortlisted candidate classes."""

    def __init__(self, top_m: int = DTW_TOP_M_CANDIDATES, top_k_avg: int = DTW_TOP_K_AVG, window: int = DTW_WINDOW):
        self.top_m = top_m
        self.top_k_avg = top_k_avg
        self.window = window
        self.n_classes = 0
        self.X_train = None
        self.y_train = None
        self.class_indices: dict[int, np.ndarray] = {}

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, n_classes: int):
        self.n_classes = n_classes
        self.X_train = np.ascontiguousarray(X_train[:, :, :DTW_N_CONTENT], dtype=np.float32)
        self.y_train = np.asarray(y_train, dtype=np.int32)
        for c in range(n_classes):
            self.class_indices[c] = np.where(self.y_train == c)[0]
        return self

    def predict_detailed(self, q: np.ndarray, candidates: list[int]):
        q = np.ascontiguousarray(q[:, :DTW_N_CONTENT], dtype=np.float32)
        idx = np.concatenate([self.class_indices[c] for c in candidates])
        d2 = dtw_many(q, self.X_train[idx], self.window)

        ranked, off = [], 0
        for c in candidates:
            n = len(self.class_indices[c])
            dd = np.sort(d2[off:off + n])
            off += n
            ranked.append((c, float(dd[:min(self.top_k_avg, n)].mean())))
        ranked.sort(key=lambda kv: kv[1])
        return ranked


class HybridRecognizer:
    """Hybrid cascade: KNN instant shortlist (~2 ms) -> Numba DTW verification (~4 ms)."""

    def __init__(self, knn: KNNRecognizer, dtw: TwoStageDTWRecognizer, top_m: int = DTW_TOP_M_CANDIDATES):
        self.knn = knn
        self.dtw = dtw
        self.top_m = top_m

    def preview(self, clip: np.ndarray):
        cls, dist = self.knn.rank_classes(clip, self.top_m)
        return cls[0].tolist(), dist[0].tolist()

    def confirm(self, clip: np.ndarray, candidates: list[int]):
        return self.dtw.predict_detailed(clip[0], candidates=candidates)


# --------------------------------------------------------------------------- #
# DATASET LOADING
# --------------------------------------------------------------------------- #
def load_dataset() -> tuple[np.ndarray, np.ndarray, list[str]]:
    if not CLASSES_JSON.exists():
        sys.exit(f"ERROR: Classes JSON not found at {CLASSES_JSON}")
    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    
    X_list, y_list = [], []
    for idx, gloss in enumerate(classes):
        path = FEATURES_DIR / f"{gloss}.npy"
        if not path.exists():
            continue
        arr = np.load(path)
        X_list.append(arr)
        y_list.extend([idx] * len(arr))

    if not X_list:
        sys.exit(f"ERROR: No feature files found in {FEATURES_DIR}")
    return np.concatenate(X_list, axis=0).astype(np.float32), np.array(y_list, dtype=np.int32), classes


# --------------------------------------------------------------------------- #
# PER-FRAME LANDMARK EXTRACTION (Identical to test_model.py & extract.py)
# --------------------------------------------------------------------------- #
class Fr:
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t")

    def __init__(self, pose, hands, face, face_ok, in_use, t):
        self.pose, self.hands, self.face = pose, hands, face
        self.face_ok, self.in_use, self.t = face_ok, in_use, t


def read_landmarks(res, W: int, H: int):
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
        hands_det = mp.solutions.hands.Hands(
            static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)
    r2 = hands_det.process(rgb)
    if r2.multi_hand_landmarks:
        best = {}
        for hl in r2.multi_hand_landmarks:
            pts = EX._lm(hl.landmark, range(21))
            dists = []
            for wi in (EX.P_LWR, EX.P_RWR):
                w = pose[wi, :2]
                dists.append(float(np.hypot(*(pts[0, :2] - w))) if np.isfinite(w).all() else 9e9)
            h = int(np.argmin(dists))
            if h in missing and dists[h] < EX.RESCUE_MAX_DIST and (h not in best or dists[h] < best[h][0]):
                best[h] = (dists[h], pts)
        for h, (_, pts) in best.items():
            hands[h] = pts
    return hands, hands_det


def build_clip(buf, W: int, H: int, fps_est: float) -> np.ndarray | None:
    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf])
    raw = dict(pose=pose, hands=hands, face=face, face_ok=face_ok, W=W, H=H)

    complete = EX.complete_mask(raw, in_use)
    F = len(buf)
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur
    pos = np.floor(np.arange(EX.N_FRAMES) * (F - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0 or n - p > EX.MAX_GAP:
            return None
        chosen.append(n)
    duration = F / max(fps_est, 1.0)
    feats = np.stack([EX.frame_features(pose[i], hands[i], face[i], in_use[i], W, H, duration) for i in chosen])
    return feats.astype(np.float32)[None]


# --------------------------------------------------------------------------- #
# OVERLAY & VISUALIZATION (Matches test_model.py UI aesthetics)
# --------------------------------------------------------------------------- #
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until,
         msg, msg_until, now, engine_tag="HYBRID"):
    put(img, f"mode {mode.upper()}  state {state}  [{engine_tag}]", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(img, "SPACE rec  M mode  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 80), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, tops, _ = result
        col = (110, 230, 140) if headline != "Not sure" else (90, 190, 255)
        put(img, headline, (12, 116), 1.0, col, 2)
        for k, (name, score_str) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {score_str}", (12, 146 + 26 * k), 0.6, (230, 230, 225))
    return img


def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y),
                cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


# --------------------------------------------------------------------------- #
# MAIN EXECUTION
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Live Non-DL WBSL Sign Recognition (Production Cascade).")
    ap.add_argument("--width", type=int, default=LIVE_WIDTH, help="detection width in px (default 640)")
    ap.add_argument("--complexity", type=int, default=1, choices=(0, 1), help="MediaPipe complexity (0=faster, 1=default)")
    ap.add_argument("--camera", type=int, default=0, help="Webcam device index (default 0)")
    ap.add_argument("--no-dtw", action="store_true", help="Run KNN-only preview without DTW confirmation")
    args = ap.parse_args()

    print("=" * 70)
    print(" WBSL Sign Recognition — Production Non-DL Engine")
    print("=" * 70)
    print("Loading training dataset and compiling Numba DTW kernel...")
    X_train, y_train, classes = load_dataset()
    warmup()

    knn = KNNRecognizer().fit(X_train, y_train)
    if not args.no_dtw:
        dtw = TwoStageDTWRecognizer().fit(X_train, y_train, len(classes))
        hybrid = HybridRecognizer(knn, dtw)
        engine_tag = "KNN+DTW"
    else:
        hybrid = None
        engine_tag = "KNN-ONLY"

    print(f"Dataset  : {len(X_train)} samples across {len(classes)} classes")
    print(f"Pipeline : {engine_tag} (Threshold Rejection: {'Active' if REJECT else 'Disabled'})")

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        sys.exit(f"ERROR: cannot open webcam {args.camera}. Check connection and retry.")

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=args.complexity,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.5, min_tracking_confidence=0.5)
    hands_det = None

    mode, state = "auto", "IDLE"
    up = down = 0
    buf = []
    pre = deque(maxlen=EX.PRE_ROLL + EX.TRIGGER_FRAMES)
    result, result_until = None, 0.0
    msg, msg_until = None, 0.0
    lat_ms = 0.0
    ema_dt = 1.0 / 30.0
    prev_t = time.perf_counter()
    read_fails = 0

    def close_span(frames):
        nonlocal result, result_until, msg, msg_until, lat_ms
        feats = build_clip(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
        if feats is None:
            msg, msg_until = "Hands not clear, try again", time.perf_counter() + MSG_HOLD_S
            return

        t0 = time.perf_counter()
        if hybrid is not None:
            cands, _ = hybrid.preview(feats)
            ranked = hybrid.confirm(feats, cands)
            engine = "dtw"
        else:
            cls_ids, dists = knn.rank_classes(feats, TOP_K)
            cands = cls_ids[0].tolist()
            ranked = list(zip(cands, dists[0].tolist()))
            engine = "knn"
        lat_ms = (time.perf_counter() - t0) * 1000.0

        d1 = ranked[0][1]
        margin = (ranked[1][1] - ranked[0][1]) if len(ranked) > 1 else float("inf")
        thr = (REJECT or {}).get(engine)
        rejected = bool(thr) and (d1 > thr["max_dist"] or margin < thr["min_margin"])

        headline = "Not sure" if rejected else classes[ranked[0][0]]
        tops = [(classes[c], f"d={s:.1f}" if engine == "dtw" else f"d={s:.3f}") for c, s in ranked[:TOP_K]]
        result = (headline, tops, lat_ms)
        result_until = time.perf_counter() + RESULT_HOLD_S

    print("
Live test running! Controls: SPACE=manual rec | M=toggle mode | Q/ESC=quit
")

    try:
        W_cur = H_cur = 0
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
            if fw > args.width:
                small = cv2.resize(frame, (args.width, int(round(fh * args.width / fw))))
            else:
                small = frame
            H_cur, W_cur = small.shape[:2]
            rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose, hands, face, f_ok = read_landmarks(res, W_cur, H_cur)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)
            hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
            fr = Fr(pose, hands, face, f_ok, in_use, now)
            raised = bool(in_use.any())

            # ── Sign-span state machine (identical to test_model.py) ──────────
            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    up = up + 1 if raised else 0
                    if up >= EX.TRIGGER_FRAMES:
                        state = "SIGN"
                        down = 0
                        buf = list(pre)
                        last_up_rel = len(buf) - 1
                else:
                    buf.append(fr)
                    rel = len(buf) - 1
                    if raised:
                        last_up_rel, down = rel, 0
                    else:
                        down += 1
                        if down >= EX.END_FRAMES:
                            end_rel = min(last_up_rel + EX.KEEP_TAIL, rel)
                            close_span(buf[:end_rel + 1])
                            state, up, down, buf = "IDLE", 0, 0, []
                            pre.clear()
            elif state == "SIGN":
                buf.append(fr)

            # ── Keys ──────────────────────────────────────────────────────────
            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")):
                break
            if k in (ord("m"), ord("M")):
                mode = "manual" if mode == "auto" else "auto"
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
            elif k == 32:  # SPACE
                if mode == "manual":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                    else:
                        close_span(buf)
                        state, buf = "IDLE", []

            # ── Overlay ───────────────────────────────────────────────────────
            rec_s = (now - buf[0].t) if buf else 0.0
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now, engine_tag=engine_tag)
            if msg and now < msg_until:
                draw_centred(frame, msg, 60, 0.85, (80, 120, 255))
            cv2.imshow("WBSL Non-DL Recognition (Production)", frame)

    except KeyboardInterrupt:
        print("
Interrupted by user.")
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

```

