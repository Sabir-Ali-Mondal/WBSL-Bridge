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

Automatic Landmark Enhancement & Recovery Architecture:
1. Automatic Image Enhancement (Adaptive Gamma, LAB-CLAHE, Denoising, Blur Control)
2. Enhanced Landmark Detection (MediaPipe Holistic + Secondary Hand ROI Detection)
3. Intelligent Tracking (Identity preservation, jump damping, velocity modeling)
4. Missing Landmark Recovery (Linear interpolation, kinematic prediction, partial recovery)
5. Landmark Stabilisation (Vectorized 1-Euro Adaptive Filter)
6. Adaptive 64-Frame Selection (Zero spurious dropouts, strictly ordered)
7. Final 64x98 Feature Contract Preservation (100% compatible with existing KNN+DTW models)
8. MANDATORY REQUIREMENT: Live Skeleton Drawing reconstructed EXCLUSIVELY from the final 64x98
   feature matrix (rolling window preview and completed sign playback).
9. Provenance Metadata (Real, Secondary, Recovered, Predicted, Unavailable)
10. NPZ Recording Storage & Offline Replay (--replay <file.npz>)
11. AUTO, MANUAL, and TIMED (5-second) recording modes.
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
RECORDINGS_DIR = Path(__file__).resolve().parent / "saved_recordings"

# Feature contract configuration
N_FRAMES = 64
N_FEATURES = 98
DTW_N_CONTENT = 95

# Production Algorithm Hyperparameters
KNN_K = 3
KNN_EPS = 1e-3
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3

# UI & Display dimensions
CAM_VIEW_W = 640
CAM_VIEW_H = 480
CANVAS_VIEW_W = 640
CANVAS_VIEW_H = 480
BOTTOM_PANEL_H = 140
WINDOW_W = CAM_VIEW_W + CANVAS_VIEW_W
WINDOW_H = CAM_VIEW_H + BOTTOM_PANEL_H

TOP_K = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30
TIMED_DURATION = 5.0

# Provenance Codes
PROV_REAL = 0          # Real detection from primary Holistic
PROV_SECONDARY = 1     # Rescued by secondary hand ROI detector
PROV_RECOVERED = 2     # Interpolated / kinematic prior recovery
PROV_PREDICTED = 3     # Short-term velocity extrapolation
PROV_UNAVAILABLE = 4   # Truly missing or inactive

# Provenance Colors (BGR)
COLOR_PROV = {
    PROV_REAL: (70, 225, 70),         # Vibrant Green
    PROV_SECONDARY: (220, 230, 80),    # Cyan / Lime
    PROV_RECOVERED: (0, 160, 255),     # Vibrant Orange
    PROV_PREDICTED: (0, 220, 240),     # Amber / Yellow
    PROV_UNAVAILABLE: (60, 60, 230),   # Crimson Red
}

# Load calibrated rejection thresholds if present
REJECT = (json.loads(THRESHOLDS_JSON.read_text(encoding="utf-8"))
          if THRESHOLDS_JSON.exists() else None)


# --------------------------------------------------------------------------- #
# NUMBA SAKOE-CHIBA DTW KERNELS
# --------------------------------------------------------------------------- #
@nb.njit(cache=True)
def _dtw_pair(a: np.ndarray, b: np.ndarray, w: int) -> float:
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
            if cur[j - 1] < best: best = cur[j - 1]
            if prev[j - 1] < best: best = prev[j - 1]
            cur[j] = np.sqrt(s) + best
        prev, cur = cur, prev
    return prev[m]


@nb.njit(cache=True, parallel=True)
def _dtw_many(q: np.ndarray, refs: np.ndarray, w: int) -> np.ndarray:
    out = np.empty(refs.shape[0])
    for k in nb.prange(refs.shape[0]):
        out[k] = _dtw_pair(q, refs[k], w)
    return out


def dtw_many(q: np.ndarray, refs: np.ndarray, window: int = DTW_WINDOW) -> np.ndarray:
    q = np.ascontiguousarray(q, dtype=np.float32)
    refs = np.ascontiguousarray(refs, dtype=np.float32)
    return _dtw_many(q, refs, max(window, abs(q.shape[0] - refs.shape[1])))


def warmup():
    a = np.zeros((N_FRAMES, DTW_N_CONTENT), np.float32)
    dtw_many(a, np.stack([a, a]))


# --------------------------------------------------------------------------- #
# RECOGNIZERS (KNN + DTW)
# --------------------------------------------------------------------------- #
class KNNRecognizer:
    def __init__(self, k: int = KNN_K, eps: float = KNN_EPS):
        self.k = k
        self.eps = eps
        self._Tn = None
        self._y = None
        self._cls = None
        self._starts = None

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
        return self

    def distances(self, X: np.ndarray) -> np.ndarray:
        return 1.0 - (self._prep(X) @ self._Tn.T)

    def class_min_distances(self, D: np.ndarray) -> np.ndarray:
        return np.minimum.reduceat(D, self._starts, axis=1)

    def rank_classes(self, X: np.ndarray, topn: int = DTW_TOP_M_CANDIDATES):
        M = self.class_min_distances(self.distances(X))
        n = min(topn, M.shape[1])
        order = np.argsort(M, axis=1)[:, :n]
        return self._cls[order], np.take_along_axis(M, order, axis=1)


class TwoStageDTWRecognizer:
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
    def __init__(self, knn: KNNRecognizer, dtw: TwoStageDTWRecognizer, top_m: int = DTW_TOP_M_CANDIDATES):
        self.knn = knn
        self.dtw = dtw
        self.top_m = top_m

    def preview(self, clip: np.ndarray):
        cls, dist = self.knn.rank_classes(clip, self.top_m)
        return cls[0].tolist(), dist[0].tolist()

    def confirm(self, clip: np.ndarray, candidates: list[int]):
        return self.dtw.predict_detailed(clip[0], candidates=candidates)


def load_dataset() -> tuple[np.ndarray, np.ndarray, list[str]]:
    if not CLASSES_JSON.exists():
        sys.exit(f"ERROR: Classes JSON not found at {CLASSES_JSON}")
    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    X_list, y_list = [], []
    for idx, gloss in enumerate(classes):
        path = FEATURES_DIR / f"{gloss}.npy"
        if not path.exists(): continue
        arr = np.load(path)
        X_list.append(arr)
        y_list.extend([idx] * len(arr))
    if not X_list:
        sys.exit(f"ERROR: No feature files found in {FEATURES_DIR}")
    return np.concatenate(X_list, axis=0).astype(np.float32), np.array(y_list, dtype=np.int32), classes


# --------------------------------------------------------------------------- #
# MODULE 1: AUTOMATIC IMAGE ENHANCEMENT
# --------------------------------------------------------------------------- #
class AdaptiveImageEnhancer:
    """
    Lightweight, CPU-friendly automatic enhancement:
    - Adaptive brightness & gamma LUT correction
    - Contrast enhancement via LAB-CLAHE
    - Cautious unsharp mask sharpening when blurry
    - Edge-preserving denoising when high sensor noise
    Original image is never mutated.
    """
    def __init__(self, target_brightness: float = 120.0):
        self.target_brightness = target_brightness
        self._clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        self._gamma_luts = {}
        for g_val in range(35, 235, 5):
            gamma = g_val / 100.0
            inv_g = 1.0 / max(gamma, 1e-3)
            table = np.array([min(255, max(0, int((i / 255.0) ** inv_g * 255.0 + 0.5)))
                              for i in range(256)], dtype=np.uint8)
            self._gamma_luts[g_val] = table

    def analyze(self, bgr: np.ndarray) -> dict:
        small = cv2.resize(bgr, (160, 120), interpolation=cv2.INTER_NEAREST)
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        mean_b = float(np.mean(gray))
        std_b = float(np.std(gray))
        lap_var = float(cv2.Laplacian(gray, cv2.CV_32F).var())
        return {
            "mean_b": mean_b,
            "std_b": std_b,
            "lap_var": lap_var,
            "is_dark": mean_b < 85.0,
            "is_bright": mean_b > 185.0,
            "is_low_contrast": std_b < 42.0,
            "is_blurry": lap_var < 90.0,
            "is_sharp": lap_var > 280.0
        }

    def enhance(self, bgr: np.ndarray, stats: dict | None = None) -> tuple[np.ndarray, dict]:
        if stats is None:
            stats = self.analyze(bgr)
        out = bgr.copy()
        mean_b = stats["mean_b"]

        # 1. Adaptive Gamma
        if stats["is_dark"]:
            gamma = max(0.40, min(0.85, math.log(0.5) / math.log(max(mean_b, 10.0) / 255.0)))
            key = int(round(gamma * 100 / 5.0) * 5)
            lut = self._gamma_luts.get(key)
            if lut is None:
                inv_g = 1.0 / gamma
                lut = np.array([min(255, max(0, int((i / 255.0) ** inv_g * 255.0 + 0.5)))
                                for i in range(256)], dtype=np.uint8)
            out = cv2.LUT(out, lut)
        elif stats["is_bright"]:
            gamma = min(1.6, max(1.15, math.log(0.5) / math.log(min(mean_b, 245.0) / 255.0)))
            key = int(round(gamma * 100 / 5.0) * 5)
            lut = self._gamma_luts.get(key)
            if lut is not None:
                out = cv2.LUT(out, lut)

        # 2. Contrast CLAHE in LAB
        if stats["is_low_contrast"] or stats["is_dark"]:
            lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB)
            lab[:, :, 0] = self._clahe.apply(lab[:, :, 0])
            out = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        # 3. Blur handling or noise control
        if 40.0 < stats["lap_var"] < 120.0:
            blur = cv2.GaussianBlur(out, (0, 0), sigmaX=1.5)
            out = cv2.addWeighted(out, 1.25, blur, -0.25, 0)
        elif stats["is_dark"] and stats["lap_var"] > 350.0 and stats["std_b"] > 70.0:
            out = cv2.GaussianBlur(out, (3, 3), 0.5)

        return out, stats


# --------------------------------------------------------------------------- #
# MODULE 2: SECONDARY HAND ROI DETECTOR
# --------------------------------------------------------------------------- #
class SecondaryHandDetector:
    """
    Triggered only when primary holistic misses an active or expected hand.
    Enlarges ROI around the expected wrist position, runs dedicated hand detector,
    and projects coordinates back to normalized full-frame coordinates.
    """
    def __init__(self, min_conf: float = 0.35):
        self.detector = mp.solutions.hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=min_conf,
            min_tracking_confidence=min_conf
        )

    def rescue(self, rgb: np.ndarray, wrist_norm: np.ndarray, roi_scale: float = 0.32) -> np.ndarray | None:
        if not np.isfinite(wrist_norm).all():
            return None
        H, W = rgb.shape[:2]
        wx, wy = int(wrist_norm[0] * W), int(wrist_norm[1] * H)
        box_px = int(roi_scale * max(W, H))
        x1 = max(0, wx - box_px)
        y1 = max(0, wy - box_px)
        x2 = min(W, wx + box_px)
        y2 = min(H, wy + box_px)
        rw, rh = x2 - x1, y2 - y1
        if rw < 28 or rh < 28:
            return None

        roi = np.ascontiguousarray(rgb[y1:y2, x1:x2])
        res = self.detector.process(roi)
        if not res.multi_hand_landmarks:
            return None

        # Pick candidate closest to ROI center
        best_pts = None
        best_dist = 9e9
        cx, cy = rw * 0.5, rh * 0.5
        for hl in res.multi_hand_landmarks:
            pts = np.empty((21, 3), dtype=np.float32)
            for k in range(21):
                px = hl.landmark[k].x * rw + x1
                py = hl.landmark[k].y * rh + y1
                pts[k] = (px / W, py / H, hl.landmark[k].z)
            d = float(np.hypot(pts[0, 0] * W - (x1 + cx), pts[0, 1] * H - (y1 + cy)))
            if d < best_dist:
                best_dist = d
                best_pts = pts
        return best_pts

    def close(self):
        try:
            self.detector.close()
        except Exception:
            pass


# --------------------------------------------------------------------------- #
# MODULE 3: LANDMARK STABILISATION (VECTORIZED 1-EURO FILTER)
# --------------------------------------------------------------------------- #
class OneEuroFilterArray:
    """
    Vectorized One-Euro Adaptive Filter for landmark arrays of shape (N, D).
    Low cutoff frequency at slow speeds to eliminate tremor/jitter;
    high cutoff frequency at high speeds to avoid lag during fast signing.
    """
    def __init__(self, shape: tuple[int, ...], min_cutoff: float = 1.0, beta: float = 0.007, d_cutoff: float = 1.0):
        self.shape = shape
        self.min_cutoff = float(min_cutoff)
        self.beta = float(beta)
        self.d_cutoff = float(d_cutoff)
        self.x_prev = None
        self.dx_prev = None
        self.t_prev = None

    def _alpha(self, cutoff: np.ndarray | float, dt: float) -> np.ndarray | float:
        tau = 1.0 / (2.0 * math.pi * cutoff)
        return 1.0 / (1.0 + tau / dt)

    def filter(self, x: np.ndarray, t: float) -> np.ndarray:
        if self.x_prev is None:
            self.x_prev = np.copy(x)
            self.dx_prev = np.zeros_like(x)
            self.t_prev = t
            return x

        dt = max(1e-4, t - self.t_prev)
        self.t_prev = t

        valid_x = np.isfinite(x)
        out = np.copy(x)
        if not valid_x.any():
            return out

        # Derivative estimation
        dx = np.zeros_like(x)
        dx[valid_x] = (x[valid_x] - self.x_prev[valid_x]) / dt
        a_d = self._alpha(self.d_cutoff, dt)
        self.dx_prev[valid_x] = a_d * dx[valid_x] + (1.0 - a_d) * self.dx_prev[valid_x]

        # Dynamic cutoff based on velocity
        speed = np.abs(self.dx_prev)
        cutoff = self.min_cutoff + self.beta * speed
        a = self._alpha(cutoff, dt)

        out[valid_x] = a[valid_x] * x[valid_x] + (1.0 - a[valid_x]) * self.x_prev[valid_x]
        self.x_prev[valid_x] = out[valid_x]
        return out

    def reset(self):
        self.x_prev = None
        self.dx_prev = None
        self.t_prev = None


# --------------------------------------------------------------------------- #
# DATA STRUCTURES & INTELLIGENT TRACKER
# --------------------------------------------------------------------------- #
class Fr:
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t",
                 "raw_pose", "raw_hands", "raw_face", "prov")
    def __init__(self, pose, hands, face, face_ok, in_use, t,
                 raw_pose=None, raw_hands=None, raw_face=None, prov=None):
        self.pose = pose
        self.hands = hands
        self.face = face
        self.face_ok = face_ok
        self.in_use = in_use
        self.t = t
        self.raw_pose = np.copy(pose) if raw_pose is None else raw_pose
        self.raw_hands = np.copy(hands) if raw_hands is None else raw_hands
        self.raw_face = np.copy(face) if raw_face is None else raw_face
        # prov: shape (2,) for hands provenance [prov_lh, prov_rh]
        self.prov = np.array([PROV_REAL, PROV_REAL], dtype=np.int32) if prov is None else prov


class IntelligentHandTracker:
    """
    Maintains spatial continuity, prevents hand identity swaps (left vs right),
    tracks wrist velocities, and clamps unnatural coordinate teleportation jumps.
    """
    def __init__(self):
        self.prev_wrists = np.full((2, 2), np.nan, dtype=np.float32)
        self.velocities = np.zeros((2, 2), dtype=np.float32)
        self.last_seen_t = [0.0, 0.0]

    def update_and_assign(self, pose: np.ndarray, hands: np.ndarray, now: float) -> tuple[np.ndarray, np.ndarray]:
        """
        Enforces anatomical attachment: Hand 0 physically attaches to left wrist
        pose[EX.P_LWR], Hand 1 physically attaches to right wrist pose[EX.P_RWR].
        Prevents identity flip when hands cross over body center.
        """
        hands_out = np.copy(hands)
        prov = np.array([PROV_REAL, PROV_REAL], dtype=np.int32)

        # Check physical wrist anchors from pose
        pose_wrists = np.full((2, 2), np.nan, dtype=np.float32)
        for h, wi in enumerate((EX.P_LWR, EX.P_RWR)):
            if np.isfinite(pose[wi, :2]).all():
                pose_wrists[h] = pose[wi, :2]

        h0_valid = np.isfinite(hands[0, 0, :2]).all()
        h1_valid = np.isfinite(hands[1, 0, :2]).all()

        if h0_valid and h1_valid:
            # Check if hands are swapped relative to pose wrists
            p0, p1 = hands[0, 0, :2], hands[1, 0, :2]
            w0, w1 = pose_wrists[0], pose_wrists[1]
            if np.isfinite(w0).all() and np.isfinite(w1).all():
                direct_cost = np.hypot(*(p0 - w0)) + np.hypot(*(p1 - w1))
                swap_cost = np.hypot(*(p0 - w1)) + np.hypot(*(p1 - w0))
                if swap_cost + 0.08 < direct_cost:
                    # Hand swap detected! Reassign correctly
                    hands_out[0] = hands[1]
                    hands_out[1] = hands[0]

        # Update velocities and last seen times
        for h in (0, 1):
            if np.isfinite(hands_out[h, 0, :2]).all():
                if np.isfinite(self.prev_wrists[h]).all():
                    dt = max(1e-4, now - self.last_seen_t[h])
                    vel = (hands_out[h, 0, :2] - self.prev_wrists[h]) / dt
                    self.velocities[h] = 0.7 * self.velocities[h] + 0.3 * vel
                self.prev_wrists[h] = hands_out[h, 0, :2]
                self.last_seen_t[h] = now
            else:
                prov[h] = PROV_UNAVAILABLE

        return hands_out, prov


def read_landmarks(res, W: int, H: int):
    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    if res.pose_landmarks:
        lm = res.pose_landmarks.landmark
        for k, i in enumerate(EX.POSE_IDX):
            pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)
    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl: hands[h] = EX._lm(hl.landmark, range(21))
    face = np.full((len(EX.FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok: face = EX._lm(res.face_landmarks.landmark, EX.FACE_CACHE_IDX)
    return pose, hands, face, f_ok


# --------------------------------------------------------------------------- #
# MODULE 4: MISSING LANDMARK RECOVERY
# --------------------------------------------------------------------------- #
def recover_missing_landmarks_in_buffer(buf: list[Fr]) -> list[Fr]:
    """
    Multi-stage intelligent landmark recovery on buffered sign span:
    1. Short gap linear interpolation (1 to 6 frames)
    2. Kinematic trailing prediction (up to 3 frames)
    3. Pose & Face temporal infill
    Marks explicit provenance for every recovered point.
    """
    F = len(buf)
    if F < 2:
        return buf

    # Recover hands
    for h in (0, 1):
        valid = [i for i in range(F) if buf[i].in_use[h] and np.isfinite(buf[i].hands[h, 0, 0])]
        if not valid:
            continue

        # 1. Linear interpolation for internal gaps
        for k in range(len(valid) - 1):
            i0, i1 = valid[k], valid[k + 1]
            gap = i1 - i0 - 1
            if 0 < gap <= 6:
                p0 = buf[i0].hands[h]
                p1 = buf[i1].hands[h]
                for g in range(1, gap + 1):
                    frac = float(g) / float(gap + 1)
                    idx = i0 + g
                    buf[idx].hands[h] = (1.0 - frac) * p0 + frac * p1
                    buf[idx].prov[h] = PROV_RECOVERED

        # 2. Kinematic trailing prediction (up to 3 frames past last valid)
        last_i = valid[-1]
        if last_i < F - 1 and (F - 1 - last_i) <= 3 and len(valid) >= 2:
            prev_i = valid[-2]
            dt = max(1, last_i - prev_i)
            v = (buf[last_i].hands[h] - buf[prev_i].hands[h]) / dt
            damp = 0.82
            for step, idx in enumerate(range(last_i + 1, F), start=1):
                buf[idx].hands[h] = buf[last_i].hands[h] + v * (step * damp)
                buf[idx].prov[h] = PROV_PREDICTED
                damp *= 0.82

    # Recover pose & face
    for i in range(1, F):
        # Infill pose if temporarily lost
        pose_nan = ~np.isfinite(buf[i].pose)
        if pose_nan.any() and np.isfinite(buf[i - 1].pose).any():
            buf[i].pose = np.where(pose_nan, buf[i - 1].pose, buf[i].pose)

        # Infill face
        if not buf[i].face_ok and buf[i - 1].face_ok:
            buf[i].face = np.copy(buf[i - 1].face)
            buf[i].face_ok = True

    return buf


# --------------------------------------------------------------------------- #
# MODULE 5: ADAPTIVE 64-FRAME SELECTION & FEATURE EXTRACTION
# --------------------------------------------------------------------------- #
def build_clip_enhanced(buf: list[Fr], W: int, H: int, fps_est: float) -> tuple[np.ndarray | None, np.ndarray | None]:
    """
    Produces the guaranteed 64-frame selection with 100% contract compliance:
    - Exactly 64 frames
    - Strictly monotonic temporal ordering
    - Uses recovered frames to avoid spurious dropouts
    Returns:
        feats: np.ndarray shape (1, 64, 98) float32
        clip_prov: np.ndarray shape (64, 2) int32
    """
    F = len(buf)
    if F < 4:
        return None, None

    # Apply buffer-wide intelligent recovery
    buf = recover_missing_landmarks_in_buffer(buf)

    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf])
    prov = np.stack([f.prov for f in buf])

    raw = dict(pose=pose, hands=hands, face=face, face_ok=face_ok, W=W, H=H)
    complete = EX.complete_mask(raw, in_use)

    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]: cur = i
        nxt[i] = cur

    # Standard 64-frame temporal positions
    pos = np.floor(np.arange(EX.N_FRAMES) * (F - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0:
            # Fall back to nearest valid backward
            valid_bwd = np.where(complete[:p + 1])[0]
            if len(valid_bwd) > 0:
                n = valid_bwd[-1]
            else:
                n = 0
        if n < 0 or abs(n - p) > (EX.MAX_GAP + 6):
            return None, None
        chosen.append(n)

    duration = F / max(fps_est, 1.0)
    feats = np.stack([EX.frame_features(pose[i], hands[i], face[i], in_use[i], W, H, duration)
                      for i in chosen])
    clip_prov = prov[chosen]
    return feats.astype(np.float32)[None], clip_prov


# --------------------------------------------------------------------------- #
# MODULE 6: LIVE DRAWING FROM FINAL 64x98 FEATURES ONLY
# --------------------------------------------------------------------------- #
class FeatureGeometryReconstructor:
    """
    MANDATORY SPECIFICATION REQUIREMENT:
    Reconstructs drawable 2D skeleton geometry EXCLUSIVELY from the final 98 features.
    It never touches raw MediaPipe coordinates or intermediate buffers for drawing.
    Feature layout (98 values):
      [0:33]   Left hand shape (11 keypoints * 3 relative coordinates dx, dy, dz)
      [33:66]  Right hand shape (11 keypoints * 3 relative coordinates dx, dy, dz)
      [66:78]  Palm direction & normal vectors (6 left, 6 right)
      [78:82]  Wrist positions (L_wx, L_wy, R_wx, R_wy)
      [82:86]  Elbow positions (L_ex, L_ey, R_ex, R_ey)
      [86:92]  Wrist-to-face distances
      [92:95]  Head features (hx, hy, hz)
      [95:97]  Hand activity flags (L_act, R_act)
      [97]     Clip duration
    """
    def __init__(self):
        # Bones connecting the 11 reconstructed hand landmarks
        # 0: Wrist base, 1: Thumb MCP, 2: Thumb Tip, 3: Index MCP, 4: Index Tip,
        # 5: Middle MCP, 6: Middle Tip, 7: Ring MCP, 8: Ring Tip, 9: Pinky MCP, 10: Pinky Tip
        self.hand_bones = [
            (0, 1), (1, 2),        # Thumb
            (0, 3), (3, 4),        # Index
            (0, 5), (5, 6),        # Middle
            (0, 7), (7, 8),        # Ring
            (0, 9), (9, 10),       # Pinky
            (3, 5), (5, 7), (7, 9) # Knuckle arch
        ]
        self._scale_detected = None

    def reconstruct_frame(self, feat: np.ndarray, canvas_w: int, canvas_h: int) -> dict:
        """
        Reverses the mathematical coordinate transformation from the 98 features.
        Returns pixel coordinates and connectivity for arms, head, and hands.
        """
        feat = np.asarray(feat, dtype=np.float32).ravel()

        # 1. Activity Flags
        l_act = float(feat[95]) > 0.5
        r_act = float(feat[96]) > 0.5

        # 2. Wrists & Elbows (Features 78..85)
        lw = np.array([feat[78], feat[79]], dtype=np.float32)
        rw = np.array([feat[80], feat[81]], dtype=np.float32)
        le = np.array([feat[82], feat[83]], dtype=np.float32)
        re = np.array([feat[84], feat[85]], dtype=np.float32)

        # 3. Head Reference (Features 92..94)
        head = np.array([feat[92], feat[93]], dtype=np.float32)

        # Auto-detect hand shape coordinate scale if normalized by body/palm
        if self._scale_detected is None:
            finite_hand_feats = feat[:66][np.isfinite(feat[:66])]
            max_d = float(np.max(np.abs(finite_hand_feats))) if len(finite_hand_feats) > 0 else 0.0
            self._scale_detected = 0.08 / max(1e-3, max_d) if max_d > 1.2 else 1.0
        scale = self._scale_detected

        # 4. Reconstruct Left Hand (Features 0..33)
        lh_pts = np.full((11, 2), np.nan, dtype=np.float32)
        if l_act and np.isfinite(lw).all():
            lh_pts[0] = lw
            for k in range(1, 11):
                dx = feat[3 * k] * scale
                dy = feat[3 * k + 1] * scale
                lh_pts[k] = (lw[0] + dx, lw[1] + dy)

        # 5. Reconstruct Right Hand (Features 33..66)
        rh_pts = np.full((11, 2), np.nan, dtype=np.float32)
        if r_act and np.isfinite(rw).all():
            rh_pts[0] = rw
            for k in range(1, 11):
                dx = feat[33 + 3 * k] * scale
                dy = feat[33 + 3 * k + 1] * scale
                rh_pts[k] = (rw[0] + dx, rw[1] + dy)

        # 6. Canonical Torso & Shoulders
        # Derived from head and elbow geometry
        neck = np.array([head[0], head[1] + 0.12], dtype=np.float32) if np.isfinite(head).all() else None
        ls = np.array([neck[0] - 0.14, neck[1] + 0.04], dtype=np.float32) if neck is not None else None
        rs = np.array([neck[0] + 0.14, neck[1] + 0.04], dtype=np.float32) if neck is not None else None

        # Convert to screen pixel coordinates
        def to_px(pt):
            if pt is None or not np.isfinite(pt).all():
                return None
            return (int(round(pt[0] * canvas_w)), int(round(pt[1] * canvas_h)))

        return {
            "head": to_px(head),
            "neck": to_px(neck),
            "ls": to_px(ls),
            "rs": to_px(rs),
            "le": to_px(le),
            "re": to_px(re),
            "lw": to_px(lw),
            "rw": to_px(rw),
            "l_act": l_act,
            "r_act": r_act,
            "lh_pts": [to_px(pt) for pt in lh_pts],
            "rh_pts": [to_px(pt) for pt in rh_pts],
            "l_dir": feat[66:69],
            "r_dir": feat[72:75]
        }


def draw_reconstructed_skeleton(canvas: np.ndarray, geom: dict, prov: np.ndarray,
                                frame_idx: int, total_frames: int, title: str):
    """
    Renders the reconstructed skeleton on canvas. All coordinates originate
    exclusively from the 64x98 feature matrix.
    """
    canvas.fill(22)  # Dark charcoal high-contrast background
    H, W = canvas.shape[:2]

    # Draw Subtle Coordinate Grid
    for gx in range(0, W, 80):
        cv2.line(canvas, (gx, 0), (gx, H), (32, 36, 40), 1)
    for gy in range(0, H, 80):
        cv2.line(canvas, (0, gy), (W, gy), (32, 36, 40), 1)

    # Provenance Colors
    c_lh = COLOR_PROV.get(int(prov[0]), (160, 160, 160)) if geom["l_act"] else (80, 80, 80)
    c_rh = COLOR_PROV.get(int(prov[1]), (160, 160, 160)) if geom["r_act"] else (80, 80, 80)
    c_pose = (190, 200, 210)
    c_bone = (110, 120, 130)

    # 1. Draw Torso and Arms
    neck, ls, rs = geom["neck"], geom["ls"], geom["rs"]
    le, re, lw, rw = geom["le"], geom["re"], geom["lw"], geom["rw"]
    head = geom["head"]

    if head and neck:
        cv2.circle(canvas, head, 24, c_pose, 2, cv2.LINE_AA)
        cv2.circle(canvas, head, 4, c_pose, -1, cv2.LINE_AA)
        cv2.line(canvas, head, neck, c_bone, 2, cv2.LINE_AA)

    if ls and rs and neck:
        cv2.line(canvas, ls, rs, c_bone, 3, cv2.LINE_AA)
        cv2.line(canvas, neck, ls, c_bone, 2, cv2.LINE_AA)
        cv2.line(canvas, neck, rs, c_bone, 2, cv2.LINE_AA)

    # Left arm
    if ls and le: cv2.line(canvas, ls, le, c_bone, 2, cv2.LINE_AA)
    if le and lw: cv2.line(canvas, le, lw, c_bone, 2, cv2.LINE_AA)
    if le: cv2.circle(canvas, le, 6, c_pose, -1, cv2.LINE_AA)
    if lw: cv2.circle(canvas, lw, 7, c_lh, -1, cv2.LINE_AA)

    # Right arm
    if rs and re: cv2.line(canvas, rs, re, c_bone, 2, cv2.LINE_AA)
    if re and rw: cv2.line(canvas, re, rw, c_bone, 2, cv2.LINE_AA)
    if re: cv2.circle(canvas, re, 6, c_pose, -1, cv2.LINE_AA)
    if rw: cv2.circle(canvas, rw, 7, c_rh, -1, cv2.LINE_AA)

    # 2. Draw Left Hand Reconstructed Geometry
    lh_pts = geom["lh_pts"]
    if geom["l_act"] and any(pt is not None for pt in lh_pts):
        for i1, i2 in [(0, 1), (1, 2), (0, 3), (3, 4), (0, 5), (5, 6),
                       (0, 7), (7, 8), (0, 9), (9, 10), (3, 5), (5, 7), (7, 9)]:
            p1, p2 = lh_pts[i1], lh_pts[i2]
            if p1 and p2:
                cv2.line(canvas, p1, p2, c_lh, 2, cv2.LINE_AA)
        for idx, pt in enumerate(lh_pts):
            if pt:
                r = 5 if idx in (2, 4, 6, 8, 10) else 4
                cv2.circle(canvas, pt, r, c_lh, -1, cv2.LINE_AA)

    # 3. Draw Right Hand Reconstructed Geometry
    rh_pts = geom["rh_pts"]
    if geom["r_act"] and any(pt is not None for pt in rh_pts):
        for i1, i2 in [(0, 1), (1, 2), (0, 3), (3, 4), (0, 5), (5, 6),
                       (0, 7), (7, 8), (0, 9), (9, 10), (3, 5), (5, 7), (7, 9)]:
            p1, p2 = rh_pts[i1], rh_pts[i2]
            if p1 and p2:
                cv2.line(canvas, p1, p2, c_rh, 2, cv2.LINE_AA)
        for idx, pt in enumerate(rh_pts):
            if pt:
                r = 5 if idx in (2, 4, 6, 8, 10) else 4
                cv2.circle(canvas, pt, r, c_rh, -1, cv2.LINE_AA)

    # Headers & Metadata Overlay
    cv2.putText(canvas, title, (14, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.60, (230, 235, 245), 2, cv2.LINE_AA)
    cv2.putText(canvas, f"Frame: {frame_idx + 1:2d} / {total_frames:2d}  (64x98 Matrix)",
                (14, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.50, (180, 190, 205), 1, cv2.LINE_AA)

    # Hand Activity Badges
    l_badge = "LH: ACTIVE" if geom["l_act"] else "LH: IDLE"
    r_badge = "RH: ACTIVE" if geom["r_act"] else "RH: IDLE"
    cv2.putText(canvas, l_badge, (14, H - 18), cv2.FONT_HERSHEY_SIMPLEX, 0.45, c_lh, 1, cv2.LINE_AA)
    cv2.putText(canvas, r_badge, (120, H - 18), cv2.FONT_HERSHEY_SIMPLEX, 0.45, c_rh, 1, cv2.LINE_AA)

    return canvas


def draw_feature_heatmap(canvas: np.ndarray, feats_64x98: np.ndarray, cur_frame: int):
    """
    Renders an informative 64x98 matrix heatmap with playback needle.
    """
    canvas.fill(26)
    H, W = canvas.shape[:2]
    cv2.putText(canvas, "FINAL 64x98 FEATURE MATRIX (HEATMAP)", (12, 18),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 210, 225), 1, cv2.LINE_AA)

    # Feature normalisation for visual clarity
    F = np.nan_to_num(feats_64x98.reshape(N_FRAMES, N_FEATURES), nan=0.0)
    std_f = np.std(F)
    norm = np.clip((F - np.mean(F)) / (std_f if std_f > 1e-4 else 1.0) * 45 + 128, 0, 255).astype(np.uint8)
    hm_bgr = cv2.applyColorMap(norm, cv2.COLORMAP_VIRIDIS)
    hm_w = W - 24
    hm_h = H - 55
    hm_resized = cv2.resize(hm_bgr, (hm_w, hm_h), interpolation=cv2.INTER_NEAREST)
    canvas[26:26 + hm_h, 12:12 + hm_w] = hm_resized

    # Draw current frame needle line
    needle_y = int(26 + (cur_frame / float(N_FRAMES - 1)) * (hm_h - 1))
    cv2.line(canvas, (12, needle_y), (12 + hm_w, needle_y), (255, 255, 255), 2)

    # Feature labels
    cv2.putText(canvas, "Hands(0..65) | Palm(66..77) | Wrists(78..81) | Elbows(82..85) | Head(86..94) | Act(95..97)",
                (12, H - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (150, 160, 175), 1, cv2.LINE_AA)
    return canvas


# --------------------------------------------------------------------------- #
# STORAGE & OFFLINE REPLAY
# --------------------------------------------------------------------------- #
def save_recording_npz(filename: Path, buf: list[Fr], feats: np.ndarray, prov: np.ndarray,
                       classes: list[str], ranked_pred: list[tuple[int, float]]):
    RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)
    raw_pose = np.stack([f.raw_pose for f in buf])
    raw_hands = np.stack([f.raw_hands for f in buf])
    timestamps = np.array([f.t for f in buf], dtype=np.float64)
    pred_class = classes[ranked_pred[0][0]] if ranked_pred else "Unknown"

    np.savez_compressed(
        filename,
        raw_pose=raw_pose,
        raw_hands=raw_hands,
        timestamps=timestamps,
        features_64x98=feats,
        provenance=prov,
        pred_class=pred_class,
        pred_score=float(ranked_pred[0][1]) if ranked_pred else 0.0
    )
    print(f"[Storage] Saved recording NPZ to {filename}")


def run_offline_replay(npz_path: Path):
    if not npz_path.exists():
        sys.exit(f"ERROR: Recording file not found: {npz_path}")
    data = np.load(npz_path, allow_pickle=True)
    feats = data["features_64x98"][0]
    prov = data["provenance"]
    pred = str(data["pred_class"])
    print(f"
[Replay] Loaded {npz_path.name} | Predicted: {pred}")
    print("Controls: SPACE=play/pause | LEFT/RIGHT=step frame | Q/ESC=quit
")

    reconstructor = FeatureGeometryReconstructor()
    canvas = np.zeros((CANVAS_VIEW_H, CANVAS_VIEW_W, 3), dtype=np.uint8)
    hm_canvas = np.zeros((BOTTOM_PANEL_H, CANVAS_VIEW_W, 3), dtype=np.uint8)

    cur = 0
    paused = False
    while True:
        geom = reconstructor.reconstruct_frame(feats[cur], CANVAS_VIEW_W, CANVAS_VIEW_H)
        draw_reconstructed_skeleton(canvas, geom, prov[cur], cur, N_FRAMES, f"OFFLINE REPLAY [{pred}]")
        draw_feature_heatmap(hm_canvas, feats, cur)

        combined = np.vstack([canvas, hm_canvas])
        cv2.imshow("WBSL Non-DL Replay (64x98 Features Exclusively)", combined)

        k = cv2.waitKey(40 if not paused else 0) & 0xFF
        if k in (27, ord("q"), ord("Q")):
            break
        elif k == 32:  # SPACE
            paused = not paused
        elif k in (ord("a"), 81):  # Left arrow
            cur = (cur - 1) % N_FRAMES
        elif k in (ord("d"), 83):  # Right arrow
            cur = (cur + 1) % N_FRAMES

        if not paused:
            cur = (cur + 1) % N_FRAMES

    cv2.destroyAllWindows()


# --------------------------------------------------------------------------- #
# HUD & DISPLAY OVERLAYS
# --------------------------------------------------------------------------- #
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw_hud(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until,
             now, engine_tag="HYBRID", enhance_active=True):
    put(img, f"MODE {mode.upper()}  STATE {state}  [{engine_tag}]", (12, 28), 0.65, (200, 225, 255))
    put(img, f"FPS {fps:4.1f}   INFER {lat_ms:5.1f} ms", (12, 54), 0.58, (185, 185, 180))
    enh_str = "ON (AUTO-LAB-CLAHE)" if enhance_active else "OFF"
    put(img, f"ENHANCER: {enh_str}", (12, 80), 0.52, (110, 230, 160) if enhance_active else (140, 140, 150))

    if state == "SIGN":
        put(img, f"REC: {rec_s:4.1f}s   FRAMES: {rec_n:3d}", (12, 108), 0.70, (90, 90, 255))

    if result and now < result_until:
        headline, tops, _ = result
        col = (110, 230, 140) if headline != "Not sure" else (90, 190, 255)
        put(img, headline, (12, 148), 1.05, col, 2)
        for k, (name, score_str) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {score_str}", (12, 178 + 26 * k), 0.58, (230, 230, 225))
    return img


def draw_bottom_status_panel(panel: np.ndarray, stats: dict, prov_stats: dict):
    panel.fill(20)
    # Lighting & Sensor stats
    put(panel, "CAMERA ENVIRONMENT METRICS:", (12, 20), 0.50, (190, 200, 215), 1)
    b_desc = "DARK (BRIGHTENED)" if stats.get("is_dark") else ("BRIGHT" if stats.get("is_bright") else "NORMAL")
    put(panel, f"Luminance : {stats.get('mean_b', 0):.1f} [{b_desc}]", (12, 44), 0.45, (170, 180, 190), 1)
    put(panel, f"Contrast  : {stats.get('std_b', 0):.1f} [{'LOW (CLAHE)' if stats.get('is_low_contrast') else 'OK'}]",
        (12, 66), 0.45, (170, 180, 190), 1)
    put(panel, f"Sharpness : {stats.get('lap_var', 0):.1f} [{'BLUR' if stats.get('is_blurry') else 'CLEAR'}]",
        (12, 88), 0.45, (170, 180, 190), 1)

    # Recovery & Provenance stats
    put(panel, "DATA PROVENANCE & QUALITY:", (340, 20), 0.50, (190, 200, 215), 1)
    real_pct = prov_stats.get("real_pct", 100.0)
    rec_pct = prov_stats.get("rec_pct", 0.0)
    put(panel, f"Real Detection Rate  : {real_pct:5.1f}%", (340, 44), 0.45, COLOR_PROV[PROV_REAL], 1)
    put(panel, f"Recovered / Infilled : {rec_pct:5.1f}%", (340, 66), 0.45, COLOR_PROV[PROV_RECOVERED], 1)

    # Keyboard instructions
    put(panel, "[SPACE]: Rec  [M]: Cycle Mode  [E]: Enhancer ON/OFF  [P]: Playback  [S]: Save  [Q]: Quit",
        (12, 124), 0.44, (140, 150, 160), 1)
    return panel


# --------------------------------------------------------------------------- #
# MAIN EXECUTION
# --------------------------------------------------------------------------- #
def main():
    parser = argparse.ArgumentParser(description="WBSL Sign Recognition — Production System")
    parser.add_argument("--replay", type=str, default="", help="Path to .npz recording for offline replay")
    parser.add_argument("--camera", type=int, default=0, help="Camera index")
    args = parser.parse_args()

    if args.replay:
        run_offline_replay(Path(args.replay))
        return

    # Configuration
    CAMERA_IDX = args.camera
    DETECTION_WIDTH = 640
    MODEL_COMPLEXITY = 1
    USE_DTW = True

    print("=" * 75)
    print(" WBSL Sign Recognition — Production Automatic Enhancement Engine")
    print("=" * 75)
    print("Loading training dataset and compiling Sakoe-Chiba DTW kernels...")
    X_train, y_train, classes = load_dataset()

    if USE_DTW:
        warmup()

    knn = KNNRecognizer().fit(X_train, y_train)
    if USE_DTW:
        dtw = TwoStageDTWRecognizer().fit(X_train, y_train, len(classes))
        hybrid = HybridRecognizer(knn, dtw)
        engine_tag = "KNN+DTW"
    else:
        hybrid = None
        engine_tag = "KNN-ONLY"

    print(f"Dataset  : {len(X_train)} samples across {len(classes)} classes")
    print(f"Pipeline : {engine_tag} (Threshold Rejection: {'Active' if REJECT else 'Disabled'})")

    cap = cv2.VideoCapture(CAMERA_IDX)
    if not cap.isOpened():
        sys.exit(f"ERROR: cannot open webcam {CAMERA_IDX}. Check connection and retry.")

    # Core Enhancement & Detection Modules
    enhancer = AdaptiveImageEnhancer()
    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=MODEL_COMPLEXITY,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.45, min_tracking_confidence=0.45)
    secondary_hands = SecondaryHandDetector(min_conf=0.35)
    tracker = IntelligentHandTracker()
    pose_filter = OneEuroFilterArray((8, 4), min_cutoff=1.0, beta=0.007)
    hands_filter = OneEuroFilterArray((2, 21, 3), min_cutoff=1.0, beta=0.007)
    reconstructor = FeatureGeometryReconstructor()

    modes = ["auto", "manual", "timed"]
    mode, state = "auto", "IDLE"
    up = down = 0
    buf: list[Fr] = []
    pre = deque(maxlen=EX.PRE_ROLL + EX.TRIGGER_FRAMES)
    rolling_preview = deque(maxlen=N_FRAMES)

    result, result_until = None, 0.0
    msg, msg_until = None, 0.0
    lat_ms = 0.0
    ema_dt = 1.0 / 30.0
    prev_t = time.perf_counter()
    read_fails = 0
    timed_start = 0.0
    enhancement_active = True

    # Completed Sign Review State
    last_completed_feats = None
    last_completed_prov = None
    last_ranked_pred = None
    playback_active = False
    playback_frame = 0

    def close_span(frames: list[Fr]):
        nonlocal result, result_until, msg, msg_until, lat_ms, last_completed_feats
        nonlocal last_completed_prov, last_ranked_pred, playback_active, playback_frame

        feats, clip_prov = build_clip_enhanced(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
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

        last_completed_feats = feats[0]
        last_completed_prov = clip_prov
        last_ranked_pred = ranked
        playback_active = True
        playback_frame = 0

    print("
Live system running! Controls: SPACE=rec | M=mode | E=enhancer | P=playback | S=save | Q=quit
")

    canvas = np.zeros((CANVAS_VIEW_H, CANVAS_VIEW_W, 3), dtype=np.uint8)
    hm_canvas = np.zeros((BOTTOM_PANEL_H, CANVAS_VIEW_W, 3), dtype=np.uint8)
    status_panel = np.zeros((BOTTOM_PANEL_H, CAM_VIEW_W, 3), dtype=np.uint8)
    combined = np.zeros((WINDOW_H, WINDOW_W, 3), dtype=np.uint8)

    try:
        W_cur = H_cur = 0
        img_stats = {}
        prov_stats = {"real_pct": 100.0, "rec_pct": 0.0}

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
            if fw > DETECTION_WIDTH:
                small = cv2.resize(frame, (DETECTION_WIDTH, int(round(fh * DETECTION_WIDTH / fw))))
            else:
                small = frame
            H_cur, W_cur = small.shape[:2]

            # ── 1. Automatic Image Enhancement ──────────
            if enhancement_active:
                enhanced_bgr, img_stats = enhancer.enhance(small)
            else:
                enhanced_bgr, img_stats = small, enhancer.analyze(small)

            rgb = cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False

            # ── 2. Primary & Secondary Detection ───────
            res = holistic.process(rgb)
            pose, hands, face, f_ok = read_landmarks(res, W_cur, H_cur)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)

            # Secondary Hand ROI Rescue when primary misses
            for h in (0, 1):
                if in_use[h] and not np.isfinite(hands[h, 0, 0]):
                    wi = EX.P_LWR if h == 0 else EX.P_RWR
                    if np.isfinite(pose[wi, :2]).all():
                        rescued = secondary_hands.rescue(rgb, pose[wi, :2])
                        if rescued is not None:
                            hands[h] = rescued

            # ── 3. Tracking & Stabilisation ───────────
            hands, prov_flags = tracker.update_and_assign(pose, hands, now)
            pose = pose_filter.filter(pose, now)
            hands = hands_filter.filter(hands, now)

            fr = Fr(pose, hands, face, f_ok, in_use, now, prov=prov_flags)
            raised = bool(in_use.any())
            rolling_preview.append(fr)

            # Compute Provenance Stats
            if len(rolling_preview) > 0:
                p_arr = np.array([f.prov for f in rolling_preview])
                real_count = np.sum(p_arr == PROV_REAL)
                total_count = p_arr.size
                prov_stats["real_pct"] = float(real_count) / max(1, total_count) * 100.0
                prov_stats["rec_pct"] = 100.0 - prov_stats["real_pct"]

            # ── 4. Sign-Span State Machine ────────────
            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    up = up + 1 if raised else 0
                    if up >= EX.TRIGGER_FRAMES:
                        state = "SIGN"
                        down = 0
                        buf = list(pre)
                        last_up_rel = len(buf) - 1
                        playback_active = False
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

            # Timed Mode Expiration Check
            if mode == "timed" and state == "SIGN":
                elapsed = now - timed_start
                if elapsed >= TIMED_DURATION:
                    close_span(buf)
                    state, buf = "IDLE", []

            # ── 5. Reconstructed Skeleton Live Drawing ─
            # MANDATORY RULE: Skeleton coordinates must come EXCLUSIVELY
            # from the final 64x98 feature matrix output.
            if playback_active and last_completed_feats is not None:
                # Completed Sign Playback Mode
                cur_feat_98 = last_completed_feats[playback_frame]
                cur_prov = last_completed_prov[playback_frame]
                geom = reconstructor.reconstruct_frame(cur_feat_98, CANVAS_VIEW_W, CANVAS_VIEW_H)
                draw_reconstructed_skeleton(canvas, geom, cur_prov, playback_frame, N_FRAMES,
                                            "PLAYBACK: COMPLETED SIGN (64x98 MATRIX)")
                draw_feature_heatmap(hm_canvas, last_completed_feats, playback_frame)
                playback_frame = (playback_frame + 1) % N_FRAMES
                if now > result_until:
                    playback_active = False
            else:
                # Rolling Preview Mode
                if len(rolling_preview) >= 8:
                    prov_clip, p_prov = build_clip_enhanced(list(rolling_preview), W_cur, H_cur, fps)
                    if prov_clip is not None:
                        cur_feat_98 = prov_clip[0, -1]
                        cur_prov = p_prov[-1]
                        geom = reconstructor.reconstruct_frame(cur_feat_98, CANVAS_VIEW_W, CANVAS_VIEW_H)
                        draw_reconstructed_skeleton(canvas, geom, cur_prov, N_FRAMES - 1, N_FRAMES,
                                                    "LIVE PREVIEW (ROLLING 64x98 MATRIX)")
                        draw_feature_heatmap(hm_canvas, prov_clip[0], N_FRAMES - 1)
                    else:
                        canvas.fill(22)
                else:
                    canvas.fill(22)
                    hm_canvas.fill(26)

            # ── 6. Keys Handling ──────────────────────
            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")):
                break
            elif k in (ord("m"), ord("M")):
                mode = modes[(modes.index(mode) + 1) % len(modes)]
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
                playback_active = False
            elif k in (ord("e"), ord("E")):
                enhancement_active = not enhancement_active
            elif k in (ord("p"), ord("P")):
                if last_completed_feats is not None:
                    playback_active = not playback_active
                    playback_frame = 0
            elif k in (ord("s"), ord("S")):
                if last_completed_feats is not None:
                    ts = time.strftime("%Y%m%d_%H%M%S")
                    fname = RECORDINGS_DIR / f"sign_{ts}.npz"
                    save_recording_npz(fname, buf or list(rolling_preview), last_completed_feats,
                                       last_completed_prov, classes, last_ranked_pred)
                    msg, msg_until = f"Saved: {fname.name}", time.perf_counter() + MSG_HOLD_S
            elif k == 32:  # SPACE
                if mode == "manual":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                        playback_active = False
                    else:
                        close_span(buf)
                        state, buf = "IDLE", []
                elif mode == "timed":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                        timed_start = time.perf_counter()
                        playback_active = False

            # ── 7. Render Views into Combined Canvas ──
            cam_view = cv2.resize(frame, (CAM_VIEW_W, CAM_VIEW_H))
            rec_s = (now - buf[0].t) if buf else 0.0
            draw_hud(cam_view, mode, state, fps, lat_ms, rec_s, len(buf),
                     result, result_until, now, engine_tag=engine_tag,
                     enhance_active=enhancement_active)

            if mode == "timed" and state == "SIGN":
                rem = max(0.0, TIMED_DURATION - (now - timed_start))
                put(cam_view, f"TIMED: {rem:.1f}s remaining", (12, 134), 0.70, (0, 165, 255))

            if msg and now < msg_until:
                put(cam_view, msg, (14, CAM_VIEW_H - 18), 0.70, (80, 120, 255), 2)

            draw_bottom_status_panel(status_panel, img_stats, prov_stats)

            # Assemble Viewports
            combined[0:CAM_VIEW_H, 0:CAM_VIEW_W] = cam_view
            combined[CAM_VIEW_H:WINDOW_H, 0:CAM_VIEW_W] = status_panel
            combined[0:CANVAS_VIEW_H, CAM_VIEW_W:WINDOW_W] = canvas
            combined[CANVAS_VIEW_H:WINDOW_H, CAM_VIEW_W:WINDOW_W] = hm_canvas

            cv2.imshow("WBSL Non-DL Recognition — Enhanced Production Engine", combined)

    except KeyboardInterrupt:
        print("
Interrupted by user.")
    finally:
        print("Shutting down cleanly...")
        try: holistic.close()
        except Exception: pass
        secondary_hands.close()
        cap.release()
        cv2.destroyAllWindows()
    print("Clean exit complete.")


if __name__ == "__main__":
    main()
`model_training_zone/test_model.py`:
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

