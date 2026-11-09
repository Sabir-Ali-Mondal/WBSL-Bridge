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

Below is the complete, self-contained implementation of the Non-DL recognition engine (`non_dl_recognition/recognition.py`), containing the JIT-compiled Sakoe-Chiba DTW kernel, `KNNRecognizer`, `TwoStageDTWRecognizer`, and `HybridRecognizer`.

```python
"""
recognition.py — Non-DL sign recognition algorithms & configuration constants.

Implements:
  1. KNNRecognizer          — Direct 1-stage full-corpus cosine distance search (content features [0:95])
  2. TwoStageDTWRecognizer  — DTW verification over a shortlist of candidate classes
  3. HybridRecognizer       — KNN instant preview + candidate list → DTW confirmation
  4. Representative selection — Medoid selection (MaxMin & kmedoids)
"""
from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numba as nb
import numpy as np

# ═════════════════════════════ CONSTANTS ═════════════════════════════
ROOT = Path(__file__).resolve().parent.parent

# Dataset
FEATURES_DIR = ROOT / "model_training_zone" / "dataset_train" / "features" / "3"
CLASSES_JSON = ROOT / "models" / "onnx_models" / "5" / "sign_daily_classes.json"
OOV_DIR = ROOT / "model_training_zone" / "dataset_train" / "features" / "non_sign"

# Feature layout
N_FRAMES = 64
N_FEATURES = 98
DTW_N_CONTENT = 95            # content features [0:95]; drops hand flags [95:97] + duration [97]

# Split / evaluation
VAL_FRACTION = 0.20
RANDOM_SEED = 42
GROUP_EPS = 1e-3              # same-class clips closer than this (cosine) count as near-duplicates
CV_FOLDS = 5

# KNN
KNN_K = 3
KNN_METRIC = "cosine"
KNN_WEIGHTS = "distance"
KNN_CONTENT_ONLY = True
KNN_EPS = 1e-3

# DTW
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3
DTW_REPS_PER_GLOSS = 3
DTW_REP_METHOD = "maxmin"

# Reports
REPORTS_DIR = Path(__file__).resolve().parent / "reports"
THRESHOLDS_JSON = REPORTS_DIR / "rejection_thresholds.json"
REPORT_JSON = REPORTS_DIR / "evaluation_report.json"

REJECT = (json.loads(THRESHOLDS_JSON.read_text(encoding="utf-8"))
          if THRESHOLDS_JSON.exists() else None)
# ══════════════════════════════════════════════════════════════════════


# ══════════════════════════════════════════════════════════════════════
# Numba DTW kernel — Sakoe-Chiba band, rolling rows, sqrt per step
# ══════════════════════════════════════════════════════════════════════

@nb.njit(cache=True)
def _dtw_pair(a, b, w):
    """Single DTW alignment (T×F, T×F) → scalar. Rolling-row, O(m) memory."""
    n, m = a.shape[0], b.shape[0]
    nf = a.shape[1]
    INF = np.inf
    prev = np.full(m + 1, INF)
    cur  = np.full(m + 1, INF)
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
def _dtw_many(q, refs, w):
    """Parallel DTW: one query (T,F) vs R references (R,T,F) → (R,)."""
    out = np.empty(refs.shape[0])
    for k in nb.prange(refs.shape[0]):
        out[k] = _dtw_pair(q, refs[k], w)
    return out


def dtw_distance(a: np.ndarray, b: np.ndarray, window: int = DTW_WINDOW) -> float:
    """Single DTW distance (JIT-compiled, Sakoe-Chiba band)."""
    a = np.ascontiguousarray(a, dtype=np.float32)
    b = np.ascontiguousarray(b, dtype=np.float32)
    return float(_dtw_pair(a, b, max(window, abs(len(a) - len(b)))))


def dtw_many(q: np.ndarray, refs: np.ndarray, window: int = DTW_WINDOW) -> np.ndarray:
    """DTW from one query (T,F) to many refs (R,T,F); parallel across refs."""
    q    = np.ascontiguousarray(q,    dtype=np.float32)
    refs = np.ascontiguousarray(refs, dtype=np.float32)
    return _dtw_many(q, refs, max(window, abs(q.shape[0] - refs.shape[1])))


def warmup():
    """Trigger JIT compile / cache load. Call once at startup and in each worker."""
    a = np.zeros((N_FRAMES, DTW_N_CONTENT), np.float32)
    dtw_many(a, np.stack([a, a]))


# ══════════════════════════════════════════════════════════════════════
# Representative selection — medoid + max-min OR k-medoids
# ══════════════════════════════════════════════════════════════════════

def _kmedoids(dists: np.ndarray, k: int, iters: int = 20) -> List[int]:
    """k-medoids with farthest-first initialization and swap iterations."""
    n = len(dists)
    k = min(k, n)
    med = [int(np.argmin(dists.sum(axis=1)))]
    while len(med) < k:
        med.append(int(np.argmax(np.min(dists[med], axis=0))))
    med = np.array(med)
    for _ in range(iters):
        assign = np.argmin(dists[:, med], axis=1)
        new = med.copy()
        for c in range(k):
            members = np.where(assign == c)[0]
            if len(members):
                sub = dists[np.ix_(members, members)]
                new[c] = members[int(np.argmin(sub.sum(axis=1)))]
        if np.array_equal(new, med):
            break
        med = new
    return med.tolist()


def select_representatives(
    X_train: np.ndarray, y_train: np.ndarray, n_classes: int,
    k_reps: int = DTW_REPS_PER_GLOSS,
    method: str = DTW_REP_METHOD,
) -> Dict[int, List[int]]:
    """Select k representative training samples per class."""
    class_reps = {}
    for c in range(n_classes):
        idx = np.where(y_train == c)[0]
        if len(idx) == 0:
            continue
        means = X_train[idx].mean(axis=1)
        dists = np.linalg.norm(means[:, None, :] - means[None, :, :], axis=-1)
        if method == "kmedoids":
            chosen = _kmedoids(dists, k_reps)
        else:
            chosen = [int(np.argmin(dists.sum(axis=1)))]
            for _ in range(1, min(k_reps, len(idx))):
                chosen.append(int(np.argmax(np.min(dists[chosen], axis=0))))
        class_reps[c] = [int(idx[m]) for m in chosen]
    return class_reps


# ══════════════════════════════════════════════════════════════════════
# 1. KNNRecognizer — Direct 1-stage full-corpus cosine search
# ══════════════════════════════════════════════════════════════════════

class KNNRecognizer:
    """Fast cosine-KNN using a pre-normalized float32 matrix (one BLAS call per batch)."""
    name = "KNN"

    def __init__(self, k: int = KNN_K, metric: str = KNN_METRIC, weights: str = KNN_WEIGHTS,
                 content_only: bool = KNN_CONTENT_ONLY, eps: float = KNN_EPS):
        self.k = k
        self.metric = metric
        self.weights = weights
        self.content_only = content_only
        self.eps = eps
        self._Tn = None
        self._y  = None
        self._cls    = None
        self._starts = None
        self._classes = None

    def _prep(self, X: np.ndarray) -> np.ndarray:
        """Flatten, strip metadata [95:98], unit-normalize → float32."""
        X = np.asarray(X, dtype=np.float32)
        if self.content_only:
            X = X[:, :, :DTW_N_CONTENT]
        F = X.reshape(len(X), -1)
        return (F / np.maximum(np.linalg.norm(F, axis=1, keepdims=True), 1e-9)).astype(np.float32)

    def fit(self, X: np.ndarray, y: np.ndarray):
        y = np.asarray(y, dtype=np.int32)
        order = np.argsort(y, kind="stable")
        self._Tn = np.ascontiguousarray(self._prep(X)[order])
        self._y  = y[order]
        self._cls, self._starts = np.unique(self._y, return_index=True)
        self._classes = self._cls.tolist()
        return self

    def distances(self, X: np.ndarray) -> np.ndarray:
        """(Q, N) cosine distances in one BLAS call."""
        return 1.0 - (self._prep(X) @ self._Tn.T)

    def class_min_distances(self, D: np.ndarray) -> np.ndarray:
        """(Q, C) minimum distance from each query to each class."""
        return np.minimum.reduceat(D, self._starts, axis=1)

    def rank_classes(self, X: np.ndarray, topn: int = 5):
        """True top-N classes by per-class minimum cosine distance."""
        M = self.class_min_distances(self.distances(X))
        n = min(topn, M.shape[1])
        order = np.argsort(M, axis=1)[:, :n]
        return self._cls[order], np.take_along_axis(M, order, axis=1)

    def predict_proba(self, X: np.ndarray) -> List[Dict[int, float]]:
        """Distance-weighted k-NN vote."""
        D = self.distances(X)
        k = min(self.k, D.shape[1])
        out = []
        for row in D:
            nn = np.argpartition(row, k - 1)[:k]
            w = 1.0 / (row[nn] + self.eps)
            votes: Dict[int, float] = {}
            for lab, wt in zip(self._y[nn], w):
                votes[int(lab)] = votes.get(int(lab), 0.0) + float(wt)
            tot = sum(votes.values())
            out.append({c: v / tot for c, v in votes.items()})
        return out

    def predict_with_rejection(self, X: np.ndarray, classes: List[str],
                               max_dist: float, min_margin: float):
        cls, dist = self.rank_classes(X, 2)
        probas = self.predict_proba(X)
        res = []
        for i in range(len(probas)):
            pred = max(probas[i].items(), key=lambda kv: kv[1])[0]
            d1 = float(dist[i, 0])
            margin = float(dist[i, 1] - dist[i, 0]) if dist.shape[1] > 1 else float("inf")
            if d1 > max_dist or margin < min_margin:
                res.append(("Unknown", d1, margin, pred))
            else:
                res.append((classes[pred], d1, margin, pred))
        return res


# ══════════════════════════════════════════════════════════════════════
# 2. TwoStageDTWRecognizer — numba DTW verification on candidates
# ══════════════════════════════════════════════════════════════════════

class TwoStageDTWRecognizer:
    """Two-stage DTW recognizer using numba for fast parallel alignment."""
    name = "TwoStageDTW"

    def __init__(self, k_reps: int = DTW_REPS_PER_GLOSS, top_m: int = DTW_TOP_M_CANDIDATES,
                 top_k_avg: int = DTW_TOP_K_AVG, window: int = DTW_WINDOW, rep_method: str = DTW_REP_METHOD):
        self.k_reps = k_reps
        self.top_m = top_m
        self.top_k_avg = top_k_avg
        self.window = window
        self.rep_method = rep_method
        self.n_classes = 0
        self.X_train: Optional[np.ndarray] = None
        self.y_train: Optional[np.ndarray] = None
        self.class_indices: Dict[int, np.ndarray] = {}
        self.reps: Optional[np.ndarray] = None
        self.rep_labels: Optional[np.ndarray] = None

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, n_classes: int):
        self.n_classes = n_classes
        self.X_train = np.ascontiguousarray(X_train, dtype=np.float32)
        self.y_train = np.asarray(y_train, dtype=np.int32)
        for c in range(n_classes):
            self.class_indices[c] = np.where(self.y_train == c)[0]
        reps_dict = select_representatives(self.X_train, self.y_train, n_classes,
                                           self.k_reps, self.rep_method)
        ids, labs = [], []
        for c, lst in reps_dict.items():
            ids.extend(lst)
            labs.extend([c] * len(lst))
        self.reps = np.ascontiguousarray(self.X_train[ids], dtype=np.float32)
        self.rep_labels = np.asarray(labs, dtype=np.int32)
        return self

    def predict_detailed(self, q: np.ndarray, candidates: Optional[List[int]] = None):
        """Returns (ranked [(class, score) ascending], candidates_used).
        If candidates is passed (e.g. from KNN), Stage 1 is bypassed."""
        q = np.ascontiguousarray(q, dtype=np.float32)
        if candidates is None:
            d1 = dtw_many(q, self.reps, self.window)
            cls_min = np.full(self.n_classes, np.inf)
            np.minimum.at(cls_min, self.rep_labels, d1)
            candidates = [int(c) for c in np.argsort(cls_min)[:self.top_m]]
        candidates = [int(c) for c in candidates]
        idx = np.concatenate([self.class_indices[c] for c in candidates])
        d2 = dtw_many(q, self.X_train[idx], self.window)
        ranked, off = [], 0
        for c in candidates:
            n = len(self.class_indices[c])
            dd = np.sort(d2[off:off + n])
            off += n
            ranked.append((c, float(dd[:min(self.top_k_avg, n)].mean())))
        ranked.sort(key=lambda kv: kv[1])
        return ranked, candidates

    def predict_sample(self, q: np.ndarray, candidates: Optional[List[int]] = None):
        ranked, cands = self.predict_detailed(q, candidates)
        return ranked[0][0], ranked[0][1], cands


# ══════════════════════════════════════════════════════════════════════
# 3. HybridRecognizer — KNN instant preview → DTW confirmation
# ══════════════════════════════════════════════════════════════════════

class HybridRecognizer:
    """KNN instant candidate shortlist (~2-3 ms) → DTW verification (~4 ms)."""

    def __init__(self, knn: KNNRecognizer, dtw: TwoStageDTWRecognizer,
                 top_m: int = DTW_TOP_M_CANDIDATES):
        self.knn = knn
        self.dtw = dtw
        self.top_m = top_m

    def preview(self, clip: np.ndarray):
        """Returns (candidate_class_ids, candidate_distances)."""
        cls, dist = self.knn.rank_classes(clip, self.top_m)
        return cls[0].tolist(), dist[0].tolist()

    def confirm(self, clip: np.ndarray, candidates: List[int]):
        """Full DTW verification on the candidate classes (skips medoid stage)."""
        q = np.ascontiguousarray(clip[0, :, :DTW_N_CONTENT], dtype=np.float32)
        ranked, _ = self.dtw.predict_detailed(q, candidates=candidates)
        return ranked
```

