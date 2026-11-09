#!/usr/bin/env python3
"""
non_dl_recognition/recognition.py — Production Live Non-DL Sign Recognition System.
Includes AUTO, MANUAL, and TIMED (5-second) recording modes.
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

# Feature configuration
N_FRAMES = 64
N_FEATURES = 98
DTW_N_CONTENT = 95

# Production Algorithm Hyperparameters
KNN_K = 3
KNN_EPS = 1e-3
DTW_WINDOW = 10
DTW_TOP_M_CANDIDATES = 5
DTW_TOP_K_AVG = 3

# UI & Display
LIVE_WIDTH = 640
TOP_K = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S = 3.0
MAX_READ_FAILS = 30
TIMED_DURATION = 5.0  # Duration for TIMED mode in seconds

# Load calibrated rejection thresholds
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
# RECOGNIZERS
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


# --------------------------------------------------------------------------- #
# DATASET LOADING & FEATURE EXTRACTION
# --------------------------------------------------------------------------- #
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
        if hl: hands[h] = EX._lm(hl.landmark, range(21))
    face = np.full((len(EX.FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok: face = EX._lm(res.face_landmarks.landmark, EX.FACE_CACHE_IDX)
    return pose, hands, face, f_ok


def rescue_hands(rgb, pose, hands, in_use, hands_det):
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if not missing: return hands, hands_det
    if hands_det is None:
        hands_det = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)
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
        for h, (_, pts) in best.items(): hands[h] = pts
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
        if complete[i]: cur = i
        nxt[i] = cur
    pos = np.floor(np.arange(EX.N_FRAMES) * (F - 1) / (EX.N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0 or n - p > EX.MAX_GAP: return None
        chosen.append(n)
    duration = F / max(fps_est, 1.0)
    feats = np.stack([EX.frame_features(pose[i], hands[i], face[i], in_use[i], W, H, duration) for i in chosen])
    return feats.astype(np.float32)[None]


# --------------------------------------------------------------------------- #
# OVERLAY
# --------------------------------------------------------------------------- #
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)

def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until, msg, msg_until, now, engine_tag="HYBRID"):
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
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y), cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


# --------------------------------------------------------------------------- #
# MAIN EXECUTION (Straight Run)
# --------------------------------------------------------------------------- #
def main():
    # --- Hardcoded Configuration ---
    CAMERA_IDX = 0
    DETECTION_WIDTH = 640
    MODEL_COMPLEXITY = 1
    USE_DTW = True
    # -------------------------------

    print("=" * 70)
    print(" WBSL Sign Recognition — Production Non-DL Engine")
    print("=" * 70)
    print("Loading training dataset and compiling Numba DTW kernel...")
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

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=MODEL_COMPLEXITY,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.5, min_tracking_confidence=0.5)
    hands_det = None

    modes = ["auto", "manual", "timed"]
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
    timed_start = 0.0

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

    print("\nLive test running! Controls: SPACE=rec | M=cycle mode | Q/ESC=quit\n")

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
            if fw > DETECTION_WIDTH:
                small = cv2.resize(frame, (DETECTION_WIDTH, int(round(fh * DETECTION_WIDTH / fw))))
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

            # ── Sign-span state machine ──────────
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

            # ── Timed Mode Expiration Check ──────
            if mode == "timed" and state == "SIGN":
                elapsed = now - timed_start
                if elapsed >= TIMED_DURATION:
                    close_span(buf)
                    state, buf = "IDLE", []

            # ── Keys ─────────────────────────────
            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")):
                break
            if k in (ord("m"), ord("M")):
                mode = modes[(modes.index(mode) + 1) % len(modes)]
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
            elif k == 32:  # SPACE
                if mode == "manual":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                    else:
                        close_span(buf)
                        state, buf = "IDLE", []
                elif mode == "timed":
                    if state == "IDLE":
                        state = "SIGN"
                        timed_start = time.perf_counter()
                        buf = [fr]

            # ── Overlay ──────────────────────────
            rec_s = (now - buf[0].t) if buf else 0.0
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now, engine_tag=engine_tag)
            
            # Timed mode countdown overlay
            if mode == "timed" and state == "SIGN":
                remaining = max(0.0, TIMED_DURATION - (now - timed_start))
                put(frame, f"TIMED: {remaining:.1f}s remaining", (12, 106), 0.7, (0, 165, 255))

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