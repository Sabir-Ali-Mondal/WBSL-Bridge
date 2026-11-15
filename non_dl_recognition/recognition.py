#!/usr/bin/env python3
"""
non_dl_recognition/clauder.py — Production Live Non-DL Sign Recognition System.
Modes: AUTO (hysteresis hand-raise, max 7 s span) | TIMED (continuous 7-s chunks)
Detection-first: never rejects incomplete recordings; nearest-valid-frame filling,
temporal hand hold, stretch/pose-only/single-frame fallbacks guarantee 64x98 input.
Display feed is mirrored (like a mirror); detection/features/recording stay unmirrored.
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

LIVE_WIDTH = 480
TOP_K = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30

# ── Hand-raise detection (hysteresis) & durations ────────────────────────────
RAISE_START_MARGIN = 0.10   # wrist height / shoulder width needed to START
RAISE_STOP_MARGIN  = 0.05   # wrist height / shoulder width below which hand is DOWN
RAISE_CONFIRM_FRAMES = 3    # consecutive raised frames to trigger
LOWER_CONFIRM_FRAMES = 6    # consecutive lowered frames to end
MAX_SPAN_S   = 7.0          # hard cap for one AUTO recording
TIMED_DURATION = 7.0        # continuous TIMED chunk length
HOLD_MAX_AGE = 4            # frames a missing hand is carried by wrist translation

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
# DATASET & LANDMARKS
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
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t", "held")
    def __init__(self, pose, hands, face, face_ok, in_use, t, held):
        self.pose, self.hands, self.face = pose, hands, face
        self.face_ok, self.in_use, self.t, self.held = face_ok, in_use, t, held

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

    for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):
        c = pose[wi, :2]
        if h not in missing or not np.isfinite(c).all(): continue
        for frac in (0.30, 0.45, 0.60):
            best = None
            for p in roi(c, frac):
                d = float(np.hypot(*(p[0, :2] - c)))
                if d < maxd and not taken(p) and (best is None or d < best[0]): best = (d, p)
            if best:
                hands[h] = best[1]; break
    still = [h for h in missing if np.isnan(hands[h, 0, 0])]
    if still:
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

def make_hand_holder(max_age: int = HOLD_MAX_AGE):
    """Temporal continuity: a hand missing for <= max_age frames is carried by
    translating its last real shape with the wrist movement. Never invents shape."""
    state = {0: None, 1: None}
    def apply(pose, hands):
        held = np.zeros(2, bool)
        for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):
            if np.isfinite(hands[h, 0, 0]):
                state[h] = (0, pose[wi, :2].copy(), hands[h].copy())
                continue
            st = state[h]
            if st is None: continue
            age, pw, ph = st
            age += 1
            if age <= max_age and np.isfinite(pose[wi, :2]).all() and np.isfinite(pw).all():
                d = pose[wi, :2] - pw
                nh = ph.copy(); nh[:, 0] += d[0]; nh[:, 1] += d[1]
                hands[h] = nh; held[h] = True
                state[h] = (age, pose[wi, :2].copy(), nh)
            else:
                state[h] = (age, pw, ph)
        return hands, held
    return apply

# --------------------------------------------------------------------------- #
# HAND-RAISE DETECTION (hysteresis, wrist vs shoulder/hip rest line)
# --------------------------------------------------------------------------- #
def raise_levels(pose, W: int, H: int):
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

def raise_state(pose, W: int, H: int):
    """Returns (raised_now, lowered_now). Missing wrists are NEUTRAL (not lowered)."""
    levels, fin, ok = raise_levels(pose, W, H)
    if not ok or not fin.any():
        return False, False
    vals = levels[fin]
    raised_now = bool((vals > RAISE_START_MARGIN).any())
    lowered_now = bool((vals < RAISE_STOP_MARGIN).all())
    return raised_now, lowered_now

# --------------------------------------------------------------------------- #
# CLIP BUILDING — detection first, never rejects
# --------------------------------------------------------------------------- #
def _hold_valid(arr):
    """Nearest-valid-frame hold along time for NaN blocks (safe filling)."""
    out = arr.copy()
    F = out.shape[0]
    flat = out.reshape(F, -1)
    valid = np.isfinite(flat).all(axis=1)
    if valid.all() or not valid.any():
        return out
    idx = np.flatnonzero(valid)
    for i in np.flatnonzero(~valid):
        j = int(idx[np.argmin(np.abs(idx - i))])
        flat[i] = flat[j]
    return out

def _select(complete):
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
    good = np.flatnonzero(complete)
    if good.size < 1: return None
    k = np.floor(np.arange(EX.N_FRAMES) * (good.size - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    return [int(i) for i in good[k]]

def build_clip(buf, W: int, H: int, fps_est: float):
    """Always returns (feats (1,64,98), note). note == 'ok' or a LOW QUALITY reason."""
    F = len(buf)
    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf]).copy()
    held = np.stack([f.held for f in buf])

    n_miss_raw = int((in_use[:, :2].astype(bool) & np.isnan(hands[:, :, 0, 0])).any(1).sum())
    n_held = int(held.any(1).sum())

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
        iu3 = in_use_eff.copy(); iu3[:, :2] = False
        c3 = np.asarray(EX.complete_mask(raw, iu3), bool)
        chosen = _select(c3) or _stretch(c3)
        if chosen is not None:
            in_use_eff, note = iu3, "hands absent; pose-only geometry"
    if chosen is None:
        score = np.isfinite(pose_f).sum(axis=(1, 2)) + np.isfinite(hands_f).sum(axis=(1, 2))
        b = int(np.argmax(score))
        chosen = [b] * EX.N_FRAMES
        note = f"single frame {b} held (very low quality)"
    if note == "ok" and (n_miss_raw or n_held):
        note = f"filled {n_miss_raw}/{F} missing-hand frames ({n_held} motion-held)"

    duration = F / max(fps_est, 1e-4)
    with np.errstate(all="ignore"):
        feats = np.stack([EX.frame_features(pose_f[i], hands_f[i], face_f[i],
                                            in_use_eff[i], W, H, duration) for i in chosen])
    feats = np.nan_to_num(feats.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0)
    return feats[None], note

# --------------------------------------------------------------------------- #
# ENHANCEMENT & OVERLAY
# --------------------------------------------------------------------------- #
def enhance_image(frame):
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

def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until,
         msg, msg_until, now, raised_now, engine_tag="HYBRID", note=""):
    put(img, f"mode {mode.upper()}  state {state}  [{engine_tag}]", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(img, f"hand raise: {'YES' if raised_now else 'no'}", (12, 76), 0.6,
        (90, 255, 120) if raised_now else (150, 150, 150))
    put(img, "M toggle mode  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 98), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, tops, _ = result
        col = (110, 230, 140) if "Not sure" not in headline else (90, 190, 255)
        put(img, headline, (12, 130), 1.0, col, 2)
        for k, (name, score_str) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {score_str}", (12, 160 + 26 * k), 0.6, (230, 230, 225))
        if note:
            put(img, f"LOW QUALITY: {note}", (12, 160 + 26 * len(tops) + 4), 0.5, (0, 165, 255), 1)
    return img

def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)

# --------------------------------------------------------------------------- #
# MAIN
# --------------------------------------------------------------------------- #
def main():
    CAMERA_IDX = 0
    DETECTION_WIDTH = LIVE_WIDTH
    MODEL_COMPLEXITY = 0
    USE_DTW = True

    print("=" * 70)
    print(" WBSL Sign Recognition — Production Non-DL Engine")
    print("=" * 70)
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
    hold = make_hand_holder()

    modes = ["auto", "timed"]
    mode, state = "auto", "IDLE"
    up = down = 0
    buf = []
    pre = deque(maxlen=EX.PRE_ROLL + RAISE_CONFIRM_FRAMES)
    result, result_until = None, 0.0
    result_note = ""
    msg, msg_until = None, 0.0
    lat_ms = 0.0
    ema_dt = 1.0 / 30.0
    prev_t = time.perf_counter()
    read_fails = 0
    span_t0 = 0.0
    timed_start = time.perf_counter()
    timed_raised = 0
    rec_count = 0
    raised_now = False

    RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)

    def close_span(frames):
        nonlocal result, result_until, msg, msg_until, lat_ms, rec_count, result_note
        if not frames:
            return
        feats, note = build_clip(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
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
                rejected, reject_reason = True, "Low Confidence"
            elif margin < thr["min_margin"]:
                rejected, reject_reason = True, "Ambiguous"

        headline = f"Not sure ({reject_reason})" if rejected else classes[ranked[0][0]]
        tops = [(classes[c], f"d={s:.1f}" if engine == "dtw" else f"d={s:.3f}") for c, s in ranked[:TOP_K]]
        result = (headline, tops, lat_ms)
        result_until = time.perf_counter() + RESULT_HOLD_S
        result_note = "" if note == "ok" else note

        rec_count += 1
        save_path = RECORDINGS_DIR / f"rec_{int(time.time())}_{rec_count:04d}.npz"
        np.savez(save_path,
                 raw_hands=np.stack([f.hands for f in frames]),
                 raw_pose=np.stack([f.pose for f in frames]),
                 raw_in_use=np.stack([f.in_use for f in frames]),
                 held=np.stack([f.held for f in frames]),
                 final_features=feats[0], prediction=headline, engine=engine, quality=note)

    print("\nLive running! Controls: M=toggle mode | Q/ESC=quit\n")

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
            small_enh = enhance_image(small)
            H_cur, W_cur = small_enh.shape[:2]

            rgb = cv2.cvtColor(small_enh, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose, hands, face, f_ok = read_landmarks(res, W_cur, H_cur)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)
            hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
            hands, held_flags = hold(pose, hands)
            fr = Fr(pose, hands, face, f_ok, in_use, now, held_flags)
            raised_now, lowered_now = raise_state(pose, W_cur, H_cur)

            draw_skeleton(small, fr, W_cur, H_cur)

            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    if raised_now: up += 1
                    elif lowered_now: up = 0
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
                if raised_now: timed_raised += 1
                if now - timed_start >= TIMED_DURATION:
                    if timed_raised >= RAISE_CONFIRM_FRAMES:
                        close_span(buf)
                    else:
                        msg, msg_until = "No raised hand in last 7s", time.perf_counter() + MSG_HOLD_S
                    buf, timed_raised = [], 0
                    timed_start = now

            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")): break
            if k in (ord("m"), ord("M")):
                mode = modes[(modes.index(mode) + 1) % len(modes)]
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
                timed_start = time.perf_counter()
                timed_raised = 0

            rec_s = (now - buf[0].t) if buf else 0.0
            # Mirror DISPLAY only: flip the video+skeleton, then draw readable text on top.
            # Detection, features and recordings above all used the unmirrored frame.
            frame[:H_cur, :W_cur] = cv2.flip(small, 1)
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now, raised_now,
                 engine_tag=engine_tag, note=result_note)

            if mode == "timed":
                remaining = max(0.0, TIMED_DURATION - (now - timed_start))
                put(frame, f"NEXT SCAN IN: {remaining:.1f}s", (12, 120), 0.7, (0, 165, 255))
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