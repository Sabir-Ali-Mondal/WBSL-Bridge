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

# ═════════════════════════════ CONSTANTS (was config.py) ═════════════════════════════
ROOT = Path(__file__).resolve().parent.parent

# Dataset
FEATURES_DIR = ROOT / "model_training_zone" / "dataset_train" / "features" / "3"
CLASSES_JSON = ROOT / "models" / "onnx_models" / "5" / "sign_daily_classes.json"
OOV_DIR = ROOT / "model_training_zone" / "dataset_train" / "features" / "non_sign"  # optional real non-sign clips

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

# DTW (tune window / top_m / top_k_avg with --sweep, then edit here)
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3
DTW_REPS_PER_GLOSS = 3        # only used by the medoid stage
DTW_REP_METHOD = "maxmin"     # only used by the medoid stage

# Reports (exactly two files are ever written here)
REPORTS_DIR = Path(__file__).resolve().parent / "reports"
THRESHOLDS_JSON = REPORTS_DIR / "rejection_thresholds.json"   # read at runtime by live_test.py
REPORT_JSON = REPORTS_DIR / "evaluation_report.json"          # everything else lands here

# Rejection thresholds written by `evaluation --calibrate`
# {"knn": {"max_dist", "min_margin"}, "dtw": {"max_dist", "min_margin"}}
REJECT = (json.loads(THRESHOLDS_JSON.read_text(encoding="utf-8"))
          if THRESHOLDS_JSON.exists() else None)
# ═════════════════════════════════════════════════════════════════════════════════════


# ══════════════════════════════════════════════════════════════════════════════
# Numba DTW kernel — Sakoe-Chiba band, rolling rows, sqrt per step
# ══════════════════════════════════════════════════════════════════════════════

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


# ══════════════════════════════════════════════════════════════════════════════
# Representative selection — medoid + max-min OR k-medoids
# ══════════════════════════════════════════════════════════════════════════════

def _kmedoids(dists: np.ndarray, k: int, iters: int = 20) -> List[int]:
    """k-medoids with farthest-first initialization and swap iterations."""
    n = len(dists)
    k = min(k, n)
    med = [int(np.argmin(dists.sum(axis=1)))]
    while len(med) < k:                                   # farthest-first init
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
    """Select k representative training samples per class.
    method: "maxmin" (medoid + max-min diversity) or "kmedoids".
    Zero data leakage: operates exclusively on training samples."""
    class_reps = {}
    for c in range(n_classes):
        idx = np.where(y_train == c)[0]
        if len(idx) == 0:
            continue
        means = X_train[idx].mean(axis=1)                              # (N, F) temporal means
        dists = np.linalg.norm(means[:, None, :] - means[None, :, :], axis=-1)
        if method == "kmedoids":
            chosen = _kmedoids(dists, k_reps)
        else:                                                           # maxmin (default)
            chosen = [int(np.argmin(dists.sum(axis=1)))]
            for _ in range(1, min(k_reps, len(idx))):
                chosen.append(int(np.argmax(np.min(dists[chosen], axis=0))))
        class_reps[c] = [int(idx[m]) for m in chosen]
    return class_reps


# ══════════════════════════════════════════════════════════════════════════════
# 1. KNNRecognizer — Direct 1-stage full-corpus cosine search
# ══════════════════════════════════════════════════════════════════════════════

class KNNRecognizer:
    """Fast cosine-KNN using a pre-normalized float32 matrix (one BLAS call per batch).

    Key design choices:
    - Training rows sorted by label → class-minimum distances via np.minimum.reduceat.
    - content_only=True (default): uses features [0:95] only, dropping binary
      hand-presence flags and duration to avoid live/offline mismatch.
    - eps-based vote weight: 1/(d + eps) prevents blow-up on near-duplicates.
    """
    name = "KNN"

    def __init__(self, k: int = KNN_K, metric: str = KNN_METRIC, weights: str = KNN_WEIGHTS,
                 content_only: bool = KNN_CONTENT_ONLY, eps: float = KNN_EPS):
        self.k = k
        self.metric = metric
        self.weights = weights
        self.content_only = content_only
        self.eps = eps
        self._Tn = None        # (N, D) float32, unit-norm, sorted by label
        self._y  = None        # (N,)   int32, sorted
        self._cls    = None    # unique class ids present
        self._starts = None    # start row of each class block
        self._classes = None

    def _prep(self, X: np.ndarray) -> np.ndarray:
        """Flatten, optionally strip flags+duration, unit-normalize → float32."""
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
        """True top-N classes by per-class minimum cosine distance.
        Returns (class_ids (Q, n), distances (Q, n))."""
        M = self.class_min_distances(self.distances(X))
        n = min(topn, M.shape[1])
        order = np.argsort(M, axis=1)[:, :n]
        return self._cls[order], np.take_along_axis(M, order, axis=1)

    def predict_proba(self, X: np.ndarray) -> List[Dict[int, float]]:
        """Distance-weighted k-NN vote, one dict per query."""
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
        """Distance-based rejection. Returns [(name|'Unknown', d1, margin, top_class_id)]."""
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

    def predict_with_confidence(self, X: np.ndarray, classes: Optional[List[str]] = None,
                                threshold: float = 0.40,
                                margin: float = 0.10):
        label_names = classes or [str(c) for c in range(max(self._classes or [0]) + 1)]
        results = []
        for scores in self.predict_proba(X):
            if not scores:
                results.append(("Unknown", 0.0, 0.0))
                continue
            ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
            top_cls, top_score = ranked[0]
            sec_score = ranked[1][1] if len(ranked) > 1 else 0.0
            conf_margin = top_score - sec_score
            if top_score < threshold or conf_margin < margin:
                results.append(("Unknown", top_score, conf_margin))
            else:
                name = label_names[top_cls] if top_cls < len(label_names) else str(top_cls)
                results.append((name, top_score, conf_margin))
        return results


# ══════════════════════════════════════════════════════════════════════════════
# 2. TwoStageDTWRecognizer — numba DTW, medoid stage-1 OR external candidates
# ══════════════════════════════════════════════════════════════════════════════

class TwoStageDTWRecognizer:
    """Two-stage DTW recognizer using numba for fast parallel alignment.

    Stage 1: DTW against `k_reps` medoid representatives per class → top-M candidates.
             Can be skipped by passing `candidates` externally (e.g. from KNN prefilter).
    Stage 2: DTW against ALL training samples of the top-M candidates.
             Final score = mean of `top_k_avg` lowest distances per class.
    """
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
        """X_train must be CONTENT features only: (N, 64, 95)."""
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
        If `candidates` is given, stage 1 (medoid DTW) is skipped entirely."""
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
        """Convenience wrapper: returns (pred_cls, best_score, candidates_used)."""
        ranked, cands = self.predict_detailed(q, candidates)
        return ranked[0][0], ranked[0][1], cands


# ══════════════════════════════════════════════════════════════════════════════
# 3. HybridRecognizer — KNN instant preview → DTW confirmation on shortlist
# ══════════════════════════════════════════════════════════════════════════════

class HybridRecognizer:
    """KNN (fast preview + candidate shortlist) → DTW (verification on the shortlist).

    KNN gives an instant top-M candidate list (~2 ms).
    DTW then verifies only those classes (~222 DTW calls, no medoid stage overhead).
    """

    def __init__(self, knn: KNNRecognizer, dtw: TwoStageDTWRecognizer,
                 top_m: int = DTW_TOP_M_CANDIDATES):
        self.knn = knn
        self.dtw = dtw
        self.top_m = top_m

    def preview(self, clip: np.ndarray):
        """clip: (1, 64, 98). Returns (candidate class ids list, their KNN distances list)."""
        cls, dist = self.knn.rank_classes(clip, self.top_m)
        return cls[0].tolist(), dist[0].tolist()

    def confirm(self, clip: np.ndarray, candidates: List[int]):
        """Full DTW verification on the given candidate classes (skips medoid stage).
        Returns [(class, score)] ascending."""
        q = np.ascontiguousarray(clip[0, :, :DTW_N_CONTENT], dtype=np.float32)
        ranked, _ = self.dtw.predict_detailed(q, candidates=candidates)
        return ranked
