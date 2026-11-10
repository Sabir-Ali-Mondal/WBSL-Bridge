#!/usr/bin/env python3
"""
non_dl_recognition/recognition.py — Production Live Non-DL Sign Recognition System.
Modes: AUTO (hand raise) | TIMED (continuous 5-sec auto-capture)
Capture fixes: adaptive lighting enhancement, ROI hand rescue, bounded gap filling
(visibility-aware, never fabricates data), and a printed reason for every rejection.
"""
from __future__ import annotations
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
RECORDINGS_DIR = ROOT / "non_dl_recognition" / "recordings"

N_FRAMES = 64
N_FEATURES = 98
DTW_N_CONTENT = 95

KNN_K = 3
KNN_EPS = 1e-3
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3

LIVE_WIDTH = 640
TOP_K = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30
TIMED_DURATION = 5.0  # Continuous 5-second chunks

# Gap filling limits
MAX_FILL = 6   # longest interior gap (frames) that will be interpolated
MAX_EDGE = 2   # longest start/end gap (frames) that will be held

REJECT = (json.loads(THRESHOLDS_JSON.read_text(encoding="utf-8"))
          if THRESHOLDS_JSON.exists() else None)

# --------------------------------------------------------------------------- #
# NUMBA DTW KERNELS
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
# RECOGNIZERS
# --------------------------------------------------------------------------- #
class KNNRecognizer:
    def __init__(self, k: int = KNN_K, eps: float = KNN_EPS):
        self.k = k
        self.eps = eps
        self._Tn = self._y = self._cls = self._starts = None

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
        self.top_m, self.top_k_avg, self.window = top_m, top_k_avg, window
        self.n_classes = 0
        self.X_train = self.y_train = None
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
        self.knn, self.dtw, self.top_m = knn, dtw, top_m

    def preview(self, clip: np.ndarray):
        cls, dist = self.knn.rank_classes(clip, self.top_m)
        return cls[0].tolist(), dist[0].tolist()

    def confirm(self, clip: np.ndarray, candidates: list[int]):
        return self.dtw.predict_detailed(clip[0], candidates=candidates)

# --------------------------------------------------------------------------- #
# DATASET & EXTRACTION
# --------------------------------------------------------------------------- #
def load_dataset() -> tuple[np.ndarray, np.ndarray, list[str]]:
    if not CLASSES_JSON.exists(): sys.exit(f"ERROR: Classes JSON not found")
    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    X_list, y_list = [], []
    for idx, gloss in enumerate(classes):
        path = FEATURES_DIR / f"{gloss}.npy"
        if not path.exists(): continue
        arr = np.load(path)
        X_list.append(arr)
        y_list.extend([idx] * len(arr))
    if not X_list: sys.exit(f"ERROR: No feature files found")
    return np.concatenate(X_list, axis=0).astype(np.float32), np.array(y_list, dtype=np.int32), classes

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
        for k, i in enumerate(EX.POSE_IDX): pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)
    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl: hands[h] = EX._lm(hl.landmark, range(21))
    face = np.full((len(EX.FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok: face = EX._lm(res.face_landmarks.landmark, EX.FACE_CACHE_IDX)
    return pose, hands, face, f_ok

def rescue_hands(rgb, pose, hands, in_use, hands_det):
    """Re-detect hands the main detector missed: enlarged crop around the pose wrist first,
    then the full frame (original logic) as fallback."""
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if not missing: return hands, hands_det
    if hands_det is None:
        hands_det = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.4)
    H, W = rgb.shape[:2]
    maxd = EX.RESCUE_MAX_DIST

    def roi(c, frac):
        s = int(min(max(frac * max(W, H), 64), min(W, H)))
        x0 = int(np.clip(c[0] * W - s / 2, 0, W - s)); y0 = int(np.clip(c[1] * H - s / 2, 0, H - s))
        crop = cv2.resize(np.ascontiguousarray(rgb[y0:y0 + s, x0:x0 + s]), (256, 256), interpolation=cv2.INTER_CUBIC)
        r, out = hands_det.process(crop), []
        for hl in (r.multi_hand_landmarks or []):
            p = np.array(EX._lm(hl.landmark, range(21)), np.float32)
            p[:, 0] = (x0 + p[:, 0] * s) / W; p[:, 1] = (y0 + p[:, 1] * s) / H; p[:, 2] *= s / W
            out.append(p)
        return out

    def taken(p):
        return any(np.isfinite(hands[o, 0, 0]) and np.hypot(*(hands[o, 0, :2] - p[0, :2])) < 0.03 for o in (0, 1))

    for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):          # 1) enlarged crop around the pose wrist
        c = pose[wi, :2]
        if h not in missing or not np.isfinite(c).all(): continue
        for frac in (0.30, 0.45):
            best = None
            for p in roi(c, frac):
                d = float(np.hypot(*(p[0, :2] - c)))
                if d < maxd and not taken(p) and (best is None or d < best[0]): best = (d, p)
            if best:
                hands[h] = best[1]; break
    still = [h for h in missing if np.isnan(hands[h, 0, 0])]
    if still:                                              # 2) full-frame fallback
        r2 = hands_det.process(rgb)
        if r2.multi_hand_landmarks:
            best = {}
            for hl in r2.multi_hand_landmarks:
                pts = EX._lm(hl.landmark, range(21))
                dists = [float(np.hypot(*(pts[0, :2] - pose[wi, :2]))) if np.isfinite(pose[wi, :2]).all() else 9e9
                         for wi in (EX.P_LWR, EX.P_RWR)]
                h = int(np.argmin(dists))
                if h in still and dists[h] < maxd and (h not in best or dists[h] < best[h][0]): best[h] = (dists[h], pts)
            for h, (_, pts) in best.items(): hands[h] = pts
    return hands, hands_det

def _why(pose, hands, face_ok, in_use, complete):
    """Human-readable reason a clip was rejected (printed to the console)."""
    bad = ~complete
    parts = [f"{int(bad.sum())}/{len(bad)} frames incomplete"]
    n = int((np.isnan(pose[:, :, 0]).any(1) & bad).sum())
    if n: parts.append(f"pose missing {n}")
    for h, name in enumerate("LR"):
        n = int((in_use[:, h].astype(bool) & np.isnan(hands[:, h, 0, 0]) & bad).sum())
        if n: parts.append(f"{name}-hand missing {n}")
    n = int((~face_ok & bad).sum())
    if n: parts.append(f"face missing {n}")
    if len(parts) == 1: parts.append("EX.complete_mask failed for another reason (e.g. low visibility)")
    return ", ".join(parts)

MIN_GOOD = 8   # fewest real frames we still try to match from

def _select(complete):
    """Training-style positions; nearest following complete frame within MAX_GAP. None if impossible."""
    F = len(complete)
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]: cur = i
        nxt[i] = cur
    pos = np.floor(np.arange(EX.N_FRAMES) * (F - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0 or n - p > EX.MAX_GAP: return None
        chosen.append(int(n))
    return chosen

def _stretch(complete):
    """Drop & stretch: use ONLY real complete frames, spread evenly over the 64 slots (nothing invented)."""
    good = np.flatnonzero(complete)
    if good.size < MIN_GOOD: return None
    k = np.floor(np.arange(EX.N_FRAMES) * (good.size - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    return [int(i) for i in good[k]]

def build_clip(buf, W: int, H: int, fps_est: float):
    """Returns (feats (1,64,98), note) or (None, reason). note == "ok" for a normal clip; otherwise it says
    which fallback was used so the result can be shown as LOW QUALITY instead of being thrown away."""
    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf])
    raw = dict(pose=pose, hands=hands, face=face, face_ok=face_ok, W=W, H=H)
    complete = np.asarray(EX.complete_mask(raw, in_use), bool)
    F = len(buf)
    note = "ok"
    chosen = _select(complete)
    if chosen is None:
        why = _why(pose, hands, face_ok, in_use, complete)
        miss = in_use[:, :2].astype(bool) & np.isnan(hands[:, :, 0, 0])

        def masked():   # undetected hand -> treated as "hand absent" for those frames (no invented geometry)
            if int(np.isfinite(hands[:, :, 0, 0]).any(1).sum()) < MIN_GOOD:
                return None, in_use, ""          # no real hand data at all: do not guess
            iu2 = in_use.copy()
            iu2[:, :2][miss] = False
            c2 = np.asarray(EX.complete_mask(raw, iu2), bool)
            ch = _select(c2) or _stretch(c2)
            return ch, iu2, f"hand undetected in {int(miss.any(1).sum())}/{F} frames, treated as absent"

        def stretched():
            return _stretch(complete), in_use, f"stretched from {int(complete.sum())}/{F} good frames"

        order = (stretched, masked) if complete.mean() >= 0.5 else (masked, stretched)
        for attempt in order:
            ch, iu, nt = attempt()
            if ch is not None:
                chosen, in_use, note = ch, iu, nt
                break
        if chosen is None:
            print("[reject]", why)
            return None, why
        print(f"[low-quality] {why}  ->  {note}")
    duration = F / max(fps_est, 1.0)
    feats = np.stack([EX.frame_features(pose[i], hands[i], face[i], in_use[i], W, H, duration) for i in chosen])
    return feats.astype(np.float32)[None], note

# --------------------------------------------------------------------------- #
# ENHANCEMENT & RECOVERY (Fixes Rejections)
# --------------------------------------------------------------------------- #
def enhance_image(frame):
    """Adaptive lighting fix: gamma for too dark/bright, LAB-CLAHE for low contrast.
    Does nothing when the frame is already well lit."""
    g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    m, s = float(g.mean()), float(g.std())
    if 90 < m < 170 and s > 50: return frame
    out = frame
    if m < 90 or m > 170:
        gamma = float(np.clip(math.log(115 / 255) / math.log(max(m, 1) / 255), 0.55, 1.8))
        out = cv2.LUT(out, (255 * (np.arange(256) / 255) ** gamma).astype(np.uint8))
    lab = cv2.cvtColor(out, cv2.COLOR_BGR2LAB)
    lab[..., 0] = cv2.createCLAHE(clipLimit=3.0 if s < 35 else 2.0, tileGridSize=(8, 8)).apply(lab[..., 0])
    return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

def _fill_gaps(arr):
    """arr (F, ...) with NaN gaps. Interpolate SHORT gaps only; long gaps stay NaN (no fabricated data)."""
    sh = arr.shape
    flat = arr.reshape(sh[0], -1).copy()
    x = np.arange(sh[0])
    for c in np.flatnonzero(np.isnan(flat).any(axis=0)):
        col = flat[:, c]
        good = np.flatnonzero(~np.isnan(col))
        if good.size == 0: continue
        for a, b in zip(good[:-1], good[1:]):
            if 1 < b - a <= MAX_FILL + 1:
                col[a + 1:b] = np.interp(x[a + 1:b], [a, b], [col[a], col[b]])
        if 0 < good[0] <= MAX_EDGE: col[:good[0]] = col[good[0]]
        t = sh[0] - 1 - good[-1]
        if 0 < t <= MAX_EDGE: col[good[-1] + 1:] = col[good[-1]]
    return flat.reshape(sh)

def interpolate_buffer(buf, W, H):
    """Fill short landmark gaps (incl. pose visibility) and refresh in_use for filled frames."""
    if len(buf) < 2: return buf
    pose = np.stack([f.pose for f in buf]).copy()
    pose[np.isnan(pose[:, :, 0]), 3] = np.nan          # visibility is 0.0 on missing frames: fill it too
    pose = _fill_gaps(pose)
    pose[:, :, 3] = np.nan_to_num(pose[:, :, 3], nan=0.0)
    hands = _fill_gaps(np.stack([f.hands for f in buf]))
    face = _fill_gaps(np.stack([f.face for f in buf]))
    out = []
    for i, f in enumerate(buf):
        in_use = f.in_use
        if np.isnan(f.pose[:, 0]).any():                # pose was filled -> refresh in_use
            try: in_use = np.logical_or(in_use, np.asarray(EX.frame_in_use(pose[i], W, H)))
            except Exception: pass
        out.append(Fr(pose[i], hands[i], face[i], bool(np.isfinite(face[i]).all()), in_use, f.t))
    return out

# --------------------------------------------------------------------------- #
# OVERLAY
# --------------------------------------------------------------------------- #
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)

def draw_skeleton(img, fr: Fr, W: int, H: int):
    def to_px(pt): return (int(pt[0] * W), int(pt[1] * H))
    for i in range(8):
        if np.isfinite(fr.pose[i, 0]):
            color = (0, 255, 0) if fr.pose[i, 3] >= 0.5 else (0, 165, 255)
            cv2.circle(img, to_px(fr.pose[i]), 4, color, -1)
    for h in (0, 1):
        color = (0, 255, 0) if not np.isnan(fr.hands[h, 0, 0]) else (0, 165, 255)
        for pt in fr.hands[h]:
            if np.isfinite(pt[0]): cv2.circle(img, to_px(pt), 3, color, -1)
    if fr.face_ok:
        for pt in fr.face:
            if np.isfinite(pt[0]): cv2.circle(img, to_px(pt), 2, (255, 0, 0), -1)

def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until, msg, msg_until, now, engine_tag="HYBRID", note=""):
    put(img, f"mode {mode.upper()}  state {state}  [{engine_tag}]", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(img, "M toggle mode  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 80), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, tops, _ = result
        col = (110, 230, 140) if "Not sure" not in headline else (90, 190, 255)
        put(img, headline, (12, 116), 1.0, col, 2)
        for k, (name, score_str) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {score_str}", (12, 146 + 26 * k), 0.6, (230, 230, 225))
        if note:
            put(img, f"LOW QUALITY: {note}", (12, 146 + 26 * len(tops) + 6), 0.5, (0, 165, 255), 1)
    return img

def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)

# --------------------------------------------------------------------------- #
# MAIN EXECUTION
# --------------------------------------------------------------------------- #
def main():
    CAMERA_IDX = 0
    DETECTION_WIDTH = 640
    MODEL_COMPLEXITY = 1
    USE_DTW = True

    print("=" * 70)
    print(" WBSL Sign Recognition — Production Non-DL Engine")
    print("=" * 70)
    print("Loading training dataset and compiling Numba DTW kernel...")
    X_train, y_train, classes = load_dataset()
    if USE_DTW: warmup()

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
    if not cap.isOpened(): sys.exit(f"ERROR: cannot open webcam {CAMERA_IDX}")

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=MODEL_COMPLEXITY,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.5, min_tracking_confidence=0.5)
    hands_det = None

    modes = ["auto", "timed"]
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
    timed_start = time.perf_counter()
    rec_count = 0
    result_note = ""

    RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)

    def close_span(frames):
        nonlocal result, result_until, msg, msg_until, lat_ms, rec_count, result_note
        feats, note = build_clip(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
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

        rejected = False
        reject_reason = ""
        if thr:
            if d1 > thr["max_dist"]:
                rejected = True
                reject_reason = "Low Confidence"
            elif margin < thr["min_margin"]:
                rejected = True
                reject_reason = "Ambiguous"

        headline = f"Not sure ({reject_reason})" if rejected else classes[ranked[0][0]]
        tops = [(classes[c], f"d={s:.1f}" if engine == "dtw" else f"d={s:.3f}") for c, s in ranked[:TOP_K]]
        result = (headline, tops, lat_ms)
        result_until = time.perf_counter() + RESULT_HOLD_S
        result_note = "" if note == "ok" else note

        rec_count += 1
        ts = int(time.time())
        save_path = RECORDINGS_DIR / f"rec_{ts}_{rec_count:04d}.npz"
        raw_hands = np.stack([f.hands for f in frames])
        raw_pose = np.stack([f.pose for f in frames])
        raw_in_use = np.stack([f.in_use for f in frames])
        np.savez(save_path, raw_hands=raw_hands, raw_pose=raw_pose, raw_in_use=raw_in_use,
                 final_features=feats[0], prediction=headline, engine=engine, quality=note)

    print("\nLive test running! Controls: M=toggle mode | Q/ESC=quit\n")

    try:
        W_cur = H_cur = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                read_fails += 1
                if read_fails >= MAX_READ_FAILS: break
                time.sleep(0.01)
                continue
            read_fails = 0
            now = time.perf_counter()
            dt = now - prev_t
            prev_t = now
            if 0.0 < dt < 1.0: ema_dt = 0.9 * ema_dt + 0.1 * dt
            fps = 1.0 / max(ema_dt, 1e-4)

            fh, fw = frame.shape[:2]
            if fw > DETECTION_WIDTH:
                small = cv2.resize(frame, (DETECTION_WIDTH, int(round(fh * DETECTION_WIDTH / fw))))
            else:
                small = frame

            # 1. Adaptive image enhancement (display frame `small` stays untouched)
            small_enhanced = enhance_image(small)
            H_cur, W_cur = small_enhanced.shape[:2]

            rgb = cv2.cvtColor(small_enhanced, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose, hands, face, f_ok = read_landmarks(res, W_cur, H_cur)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)
            hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
            fr = Fr(pose, hands, face, f_ok, in_use, now)
            raised = bool(in_use.any())

            draw_skeleton(small, fr, W_cur, H_cur)

            # 2. State Machine
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
                    if raised: last_up_rel, down = rel, 0
                    else:
                        down += 1
                        if down >= EX.END_FRAMES:
                            end_rel = min(last_up_rel + EX.KEEP_TAIL, rel)
                            interp_buf = interpolate_buffer(buf[:end_rel + 1], W_cur, H_cur)
                            close_span(interp_buf)
                            state, up, down, buf = "IDLE", 0, 0, []
                            pre.clear()

            elif mode == "timed":
                buf.append(fr)
                elapsed = now - timed_start
                if elapsed >= TIMED_DURATION:
                    if any(f.in_use.any() for f in buf):
                        close_span(interpolate_buffer(buf, W_cur, H_cur))
                    else:
                        msg, msg_until = "No hands seen in last 5s", time.perf_counter() + MSG_HOLD_S
                    buf = []
                    timed_start = now

            # Keys
            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")): break
            if k in (ord("m"), ord("M")):
                mode = modes[(modes.index(mode) + 1) % len(modes)]
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
                timed_start = time.perf_counter()  # Reset timer on mode switch

            rec_s = (now - buf[0].t) if buf else 0.0
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now, engine_tag=engine_tag, note=result_note)

            frame[:H_cur, :W_cur] = small

            if mode == "timed":
                remaining = max(0.0, TIMED_DURATION - (now - timed_start))
                put(frame, f"NEXT SCAN IN: {remaining:.1f}s", (12, 106), 0.7, (0, 165, 255))

            if msg and now < msg_until:
                draw_centred(frame, msg, 60, 0.85, (80, 120, 255))
            cv2.imshow("WBSL Non-DL Recognition (Production)", frame)

    except KeyboardInterrupt:
        print("\nInterrupted by user.")
    finally:
        print("Shutting down cleanly...")
        try: holistic.close()
        except Exception: pass
        if hands_det is not None:
            try: hands_det.close()
            except Exception: pass
        cap.release()
        cv2.destroyAllWindows()
    print("Bye.")

if __name__ == "__main__":
    main()