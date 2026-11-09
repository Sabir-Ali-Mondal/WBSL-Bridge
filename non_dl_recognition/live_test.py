#!/usr/bin/env python3
"""
live_test.py — Real-time WBSL sign detection (Non-DL: KNN preview → DTW confirmation).

Pipeline:
  1. KNN cosine (content features [0:95]) → instant preview + Top-5 candidate list (~2 ms)
  2. Two-Stage DTW on the KNN Top-5 → verified prediction (~20-100 ms, numba)
  3. Distance-based rejection using calibrated thresholds from calibrate / evaluation --calibrate

Usage:
  python -m non_dl_recognition.live_test
  python -m non_dl_recognition.live_test --no-dtw          # KNN only
  python -m non_dl_recognition.live_test --eval-split      # fit on 80% only (honest eval)
  python -m non_dl_recognition.live_test --camera 1        # alternate webcam

Controls:  SPACE=manual rec  |  M=toggle auto/manual  |  Q/ESC=quit
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
import numpy as np
import mediapipe as mp

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from non_dl_recognition.recognition import (
    CLASSES_JSON, FEATURES_DIR, N_FEATURES, N_FRAMES, DTW_N_CONTENT,
    KNN_K, KNN_METRIC, KNN_WEIGHTS, DTW_TOP_M_CANDIDATES, REJECT,
    KNNRecognizer, TwoStageDTWRecognizer, HybridRecognizer, warmup,
)
from non_dl_recognition.evaluation import load_dataset, train_val_split

# ── UI constants ──────────────────────────────────────────────────────────────
LIVE_WIDTH    = 640
TOP_K         = 3
RESULT_HOLD_S = 4.0
MSG_HOLD_S    = 3.0
MAX_READ_FAILS = 30

# ── Sign-span state machine (identical to test_model.py & extract.py) ─────────
MAX_GAP              = 5
VIS_MIN              = 0.5
HAND_MARGIN_SW       = 0.05
REST_SHOULDER_FACTOR = 1.3
TRIGGER_FRAMES       = 3
PRE_ROLL             = 8
END_FRAMES           = 10
KEEP_TAIL            = 2
RESCUE_MAX_DIST      = 0.30

# ── MediaPipe indices ─────────────────────────────────────────────────────────
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]
POSE_IDX = [11, 12, 13, 14, 15, 16, 23, 24]
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9
AVATAR_FACE  = [10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
                159, 145, 386, 374, 1, 61, 291, 0, 17]
FACE_CACHE_IDX = AVATAR_FACE + [13, 14]
FI = {idx: k for k, idx in enumerate(FACE_CACHE_IDX)}


# ── Landmark extraction & completeness (identical to extract.py) ───────────────
def _lm(landmarks, idx_list):
    return np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in idx_list], np.float32)


def frame_in_use(pose: np.ndarray, W: int, H: int) -> np.ndarray:
    out = np.zeros(2, bool)
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    if not (np.isfinite(sl).all() and np.isfinite(sr).all()):
        return out
    sw = float(np.linalg.norm(sl - sr))
    if sw < 1e-6:
        return out
    if pose[P_LHIP, 3] >= VIS_MIN and pose[P_RHIP, 3] >= VIS_MIN:
        rest_y = (pose[P_LHIP, 1] + pose[P_RHIP, 1]) / 2.0 * H
    else:
        rest_y = (sl[1] + sr[1]) / 2.0 + REST_SHOULDER_FACTOR * sw
    for h, wi in enumerate((P_LWR, P_RWR)):
        y = pose[wi, 1]
        if np.isfinite(y):
            out[h] = (rest_y - y * H) > HAND_MARGIN_SW * sw
    return out


def read_landmarks(res, W, H):
    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    if res.pose_landmarks:
        lm = res.pose_landmarks.landmark
        for k, i in enumerate(POSE_IDX):
            pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)

    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl:
            hands[h] = _lm(hl.landmark, range(21))

    face = np.full((len(FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok:
        face = _lm(res.face_landmarks.landmark, FACE_CACHE_IDX)
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
            pts = _lm(hl.landmark, range(21))
            dists = []
            for wi in (P_LWR, P_RWR):
                w = pose[wi, :2]
                dists.append(float(np.hypot(*(pts[0, :2] - w)))
                             if np.isfinite(w).all() else 9e9)
            h = int(np.argmin(dists))
            if h in missing and dists[h] < RESCUE_MAX_DIST \
                    and (h not in best or dists[h] < best[h][0]):
                best[h] = (dists[h], pts)
        for h, (_, pts) in best.items():
            hands[h] = pts
    return hands, hands_det


class Fr:
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t")

    def __init__(self, pose, hands, face, face_ok, in_use, t):
        self.pose, self.hands, self.face = pose, hands, face
        self.face_ok, self.in_use, self.t = face_ok, in_use, t


def complete_mask(raw: dict, in_use: np.ndarray) -> np.ndarray:
    pose, hands = raw["pose"], raw["hands"]
    W, H = int(raw["W"]), int(raw["H"])
    ok = raw["face_ok"].copy()
    vis = pose[:, :4, 3]
    ok &= np.isfinite(vis).all(1) & (vis >= VIS_MIN).all(1)
    sw = np.linalg.norm((pose[:, P_LSH, :2] - pose[:, P_RSH, :2]) * [W, H], axis=1)
    ok &= np.isfinite(sw) & (sw > 1.0)
    for h in (0, 1):
        has_all21 = np.isfinite(hands[:, h]).all(axis=(1, 2))
        palm = np.linalg.norm((hands[:, h, 9, :2] - hands[:, h, 0, :2]) * [W, H], axis=1)
        good = has_all21 & np.isfinite(palm) & (palm > 1.0)
        ok &= ~in_use[:, h] | good
    return ok


def frame_features(pose, hands21, face, in_use, W, H, duration) -> np.ndarray:
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    origin = (sl + sr) / 2.0
    sw = float(np.linalg.norm(sl - sr))
    xax = (sl - sr) / sw
    yax = np.array([xax[1], -xax[0]])

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):
        d = pts[:, :2].astype(np.float64) * [W, H] - origin
        return np.stack([d @ xax / sw, d @ yax / sw, -pts[:, 2].astype(np.float64) * W / sw], 1)

    forehead = box_xy(face[FI[10], :2])
    mouth    = box_xy((face[FI[13], :2] + face[FI[14], :2]) / 2.0)
    chin     = box_xy(face[FI[152], :2])
    face_box = (forehead, mouth, chin)

    hs = np.zeros((2, 11, 3))
    pd = np.zeros((2, 6))
    wp = np.zeros((2, 2))
    wf = np.zeros((2, 3))
    flags = np.zeros(2)
    for h in (0, 1):
        if not in_use[h]:
            continue
        box = box_pts(hands21[h][HAND_IDX])
        rel = box - box[0]
        m = rel[H_MID_BASE]
        palm = float(np.linalg.norm(m)) + 1e-9
        phi = math.atan2(m[0], m[1])
        c, s = math.cos(phi), math.sin(phi)
        r = rel / palm
        hs[h] = np.stack([r[:, 0] * c - r[:, 1] * s, r[:, 0] * s + r[:, 1] * c, r[:, 2]], 1)
        pd[h, :3] = m / palm
        n = np.cross(rel[H_INDEX_BASE], rel[H_PINKY_BASE])
        if h == 0:
            n = -n
        pd[h, 3:] = n / (np.linalg.norm(n) + 1e-9)
        wp[h] = box[0, :2]
        for k in range(3):
            wf[h, k] = np.linalg.norm(box[0, :2] - face_box[k])
        flags[h] = 1.0

    elbows = np.concatenate([box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])])
    v = forehead - chin
    head = np.array([mouth[0], mouth[1], math.atan2(v[0], v[1])])

    f = np.concatenate([hs.ravel(), pd.ravel(), wp.ravel(), elbows, wf.ravel(), head, flags, [duration]])
    assert f.shape[0] == N_FEATURES
    return f.astype(np.float32)


def build_clip(buf, W, H, fps_est):
    pose    = np.stack([f.pose    for f in buf])
    hands   = np.stack([f.hands   for f in buf])
    face    = np.stack([f.face    for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use  = np.stack([f.in_use  for f in buf])
    raw = dict(pose=pose, hands=hands, face=face, face_ok=face_ok, W=W, H=H)

    complete = complete_mask(raw, in_use)
    F = len(buf)
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
        if n < 0 or n - p > MAX_GAP:
            return None
        chosen.append(n)
    duration = F / max(fps_est, 1.0)
    feats = np.stack([frame_features(pose[i], hands[i], face[i], in_use[i], W, H, duration)
                      for i in chosen])
    return feats.astype(np.float32)[None]   # (1, 64, 98)


# ── Overlay ───────────────────────────────────────────────────────────────────
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until,
         msg, msg_until, now):
    put(img, f"mode {mode.upper()}  state {state}", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms  [KNN→DTW]", (12, 54), 0.6, (180, 180, 170))
    put(img, "SPACE rec  M mode  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 80), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, tops, _ = result
        col = (110, 230, 140) if headline not in ("Not sure", "Unknown") else (90, 190, 255)
        put(img, headline, (12, 116), 1.0, col, 2)
        for k, (name, txt) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {txt}", (12, 146 + 26 * k), 0.6, (230, 230, 225))
    return img


def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y),
                cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="Live WBSL sign detection (KNN→DTW Non-DL pipeline).")
    ap.add_argument("--width",      type=int, default=LIVE_WIDTH,
                    help="Detection frame width in px (default 640)")
    ap.add_argument("--complexity", type=int, default=1, choices=(0, 1),
                    help="MediaPipe model complexity (0=faster, 1=default)")
    ap.add_argument("--k",          type=int, default=KNN_K,
                    help=f"K for KNN nearest-neighbor vote (default {KNN_K})")
    ap.add_argument("--camera",     type=int, default=0,
                    help="Webcam device index (default 0)")
    ap.add_argument("--eval-split", action="store_true",
                    help="Fit on the 80%% training split only (honest eval). "
                         "Default: fit on ALL data (deployment mode).")
    ap.add_argument("--no-dtw",     action="store_true",
                    help="KNN-only mode: skip DTW confirmation (fastest response)")
    args = ap.parse_args()

    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    print(f"Dataset  : {FEATURES_DIR}")
    print(f"Classes  : {len(classes)}")

    t0 = time.perf_counter()
    X_all, y_all = load_dataset(FEATURES_DIR, classes)
    if args.eval_split:
        X_fit, y_fit, _, _ = train_val_split(X_all, y_all, classes)
        print(f"Fit mode : 80% training split ({len(X_fit)} seqs) — honest evaluation mode")
    else:
        X_fit, y_fit = X_all, y_all
        print(f"Fit mode : ALL data ({len(X_fit)} seqs) — deployment mode")
    print(f"Loaded   : {(time.perf_counter()-t0)*1000:.0f} ms")

    # ── Build models ──────────────────────────────────────────────────────────
    knn = KNNRecognizer(k=args.k, content_only=True).fit(X_fit, y_fit)
    dtw, hybrid = None, None
    if not args.no_dtw:
        print("Compiling numba DTW kernel (first run may take 5–20 s)...")
        warmup()
        dtw = TwoStageDTWRecognizer().fit(
            X_fit[:, :, :DTW_N_CONTENT].astype(np.float32), y_fit, len(classes)
        )
        hybrid = HybridRecognizer(knn, dtw, DTW_TOP_M_CANDIDATES)
        print(f"DTW ready. Hybrid pipeline: KNN preview → DTW top-{DTW_TOP_M_CANDIDATES} confirmation")

    if REJECT is None:
        print("WARNING: no rejection_thresholds.json found.")
        print("         Run `python -m non_dl_recognition.evaluation --calibrate` to generate it.")
        print("         Rejection is DISABLED until then.")
    else:
        engine = "dtw" if hybrid else "knn"
        thr = REJECT.get(engine, {})
        print(f"Rejection thresholds ({engine}): max_dist={thr.get('max_dist', 'N/A'):.3f}  "
              f"min_margin={thr.get('min_margin', 'N/A'):.3f}")

    # ── Camera setup ──────────────────────────────────────────────────────────
    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        sys.exit(f"ERROR: cannot open webcam {args.camera}. Check the camera and retry.")

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=args.complexity,
        smooth_landmarks=True, refine_face_landmarks=False,
        min_detection_confidence=0.5, min_tracking_confidence=0.5)
    hands_det = None

    mode, state = "auto", "IDLE"
    up = down = 0
    buf = []
    pre = deque(maxlen=PRE_ROLL + TRIGGER_FRAMES)
    result, result_until = None, 0.0
    msg, msg_until       = None, 0.0
    lat_ms  = 0.0
    ema_dt  = 1.0 / 30.0
    prev_t  = time.perf_counter()
    read_fails = 0

    def close_span(frames):
        nonlocal result, result_until, msg, msg_until, lat_ms
        feats = build_clip(frames, W_cur, H_cur, 1.0 / max(ema_dt, 1e-4))
        if feats is None:
            msg, msg_until = "Hands not clear, try again", time.perf_counter() + MSG_HOLD_S
            return

        t0 = time.perf_counter()
        if hybrid is not None:
            cand, kdist = hybrid.preview(feats)
            ranked = hybrid.confirm(feats, cand)
            engine = "dtw"
        else:
            cls_ids, dists = knn.rank_classes(feats, TOP_K)
            cand = cls_ids[0].tolist()
            ranked = list(zip(cand, dists[0].tolist()))
            engine = "knn"
        lat_ms = (time.perf_counter() - t0) * 1000.0

        d1     = ranked[0][1]
        margin = (ranked[1][1] - ranked[0][1]) if len(ranked) > 1 else float("inf")
        thr    = (REJECT or {}).get(engine)
        rejected = bool(thr) and (d1 > thr["max_dist"] or margin < thr["min_margin"])

        headline = "Not sure" if rejected else classes[ranked[0][0]]
        tops = [(classes[c], f"d={s:.3f}" if engine == "knn" else f"d={s:.1f}")
                for c, s in ranked[:TOP_K]]
        result = (headline, tops, lat_ms)
        result_until = time.perf_counter() + RESULT_HOLD_S

    print(f"\nLive test running! Controls: SPACE=manual rec | M=toggle mode | Q/ESC=quit\n")

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
            dt  = now - prev_t
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
            in_use = frame_in_use(pose, W_cur, H_cur)
            hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
            fr = Fr(pose, hands, face, f_ok, in_use, now)
            raised = bool(in_use.any())

            # ── Sign-span state machine ───────────────────────────────────────
            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    up = up + 1 if raised else 0
                    if up >= TRIGGER_FRAMES:
                        state = "SIGN"
                        down  = 0
                        buf   = list(pre)
                        last_up_rel = len(buf) - 1
                else:
                    buf.append(fr)
                    rel = len(buf) - 1
                    if raised:
                        last_up_rel, down = rel, 0
                    else:
                        down += 1
                        if down >= END_FRAMES:
                            end_rel = min(last_up_rel + KEEP_TAIL, rel)
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
            elif k == 32:   # SPACE
                if mode == "manual":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                    else:
                        close_span(buf)
                        state, buf = "IDLE", []

            # ── Overlay ───────────────────────────────────────────────────────
            rec_s = (now - buf[0].t) if buf else 0.0
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now)
            if msg and now < msg_until:
                draw_centred(frame, msg, 60, 0.85, (80, 120, 255))
            cv2.imshow("WBSL live detection (Non-DL)", frame)

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
