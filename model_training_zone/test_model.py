#!/usr/bin/env python3
"""
test_model.py - live ISL sign detection on the webcam.

    py test_model.py [--model-id ID] [--width PX] [--complexity 0|1]

Loads the newest deployed model (models/onnx_models/<id>/sign_daily_lstm.onnx
+ sign_daily_classes.json) and runs the SAME pipeline as training:

  * MediaPipe Holistic per frame (frames NOT mirrored, left hand = index 0)
  * sign-span state machine (IDLE -> SIGN -> end) from extract.py constants
  * at span end: 64-frame selection with the MAX_GAP rule and the identical
    98-feature builder (extract.frame_features), fed RAW into the ONNX model
    (standardisation / hand-flag gating lives inside the network)
  * top-3 probabilities; "Not sure" when top < 0.5 or gap to 2nd < 0.15
  * "Hands not clear, try again" when a target position cannot be filled

Keys:  SPACE  start/stop manual recording
       M      toggle auto <-> manual
       Q/ESC  quit

On-screen: mode + state, recording timer + span frames, webcam FPS, inference
latency (ms), top-3 results, and the two status messages.

Speed choices (accuracy contract with extract.py untouched):
  * detection runs on a downscaled copy (default 640 px wide; landmarks are
    normalised, so the 98-feature math is unchanged)
  * the second Hands detector is created lazily and only runs on frames where
    an in-use hand was missed (same rescue rule + distance gate as extract)
  * ONNX session is warmed up and graph-optimised at startup; inference runs
    only once per completed sign, never per frame
  * overlay drawing is a handful of putText calls, no allocations in the loop

Robustness: camera open/read failures, missing model files, invalid class
metadata (logit count vs class count), incomplete clips and clean MediaPipe /
camera / window shutdown on every exit path.
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from collections import deque
from pathlib import Path

import cv2
import numpy as np
import mediapipe as mp
import onnxruntime as ort

import extract as EX

# --------------------------------------------------------------------------- #
# CONFIG
# --------------------------------------------------------------------------- #
MODELS_ROOT = EX.TRAIN_ZONE.parent / "models" / "onnx_models"

LIVE_WIDTH = 640          # detection resolution (display stays full size)
TOP_K = 3
MIN_TOP_PROB = 0.5        # below -> "Not sure"
MIN_PROB_GAP = 0.15       # top-1 vs top-2 gap below -> "Not sure"
RESULT_HOLD_S = 4.0       # seconds a result stays on screen
MSG_HOLD_S = 3.0          # seconds a warning stays on screen
MAX_READ_FAILS = 30       # consecutive camera read failures -> quit


# --------------------------------------------------------------------------- #
# model loading
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
    in_name = sess.get_inputs()[0].name          # works with any export name
    out_name = sess.get_outputs()[0].name

    # warm-up + metadata validation (also removes first-inference latency spike)
    warm = np.zeros((1, EX.N_FRAMES, EX.N_FEATURES), np.float32)
    logits = sess.run([out_name], {in_name: warm})[0]
    if logits.shape[-1] != len(classes):
        sys.exit(f"ERROR: model outputs {logits.shape[-1]} logits but "
                 f"{cls_path.name} lists {len(classes)} classes - stale metadata.")
    print(f"Model    : {model_dir.name}  ({len(classes)} classes, "
          f"input '{in_name}' -> '{out_name}')")
    return sess, in_name, out_name, classes


def softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - x.max())
    return e / e.sum()


# --------------------------------------------------------------------------- #
# per-frame landmark capture (same conventions as extract.detect_video)
# --------------------------------------------------------------------------- #
class Fr:
    __slots__ = ("pose", "hands", "face", "face_ok", "in_use", "t")

    def __init__(self, pose, hands, face, face_ok, in_use, t):
        self.pose, self.hands, self.face = pose, hands, face
        self.face_ok, self.in_use, self.t = face_ok, in_use, t


def read_landmarks(res, holistic_res_ok, W, H, hands_det):
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
    """Second detector for missed in-use hands (same gate as extract)."""
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
                dists.append(float(np.hypot(*(pts[0, :2] - w)))
                             if np.isfinite(w).all() else 9e9)
            h = int(np.argmin(dists))
            if h in missing and dists[h] < EX.RESCUE_MAX_DIST \
                    and (h not in best or dists[h] < best[h][0]):
                best[h] = (dists[h], pts)
        for h, (_, pts) in best.items():
            hands[h] = pts
    return hands, hands_det


# --------------------------------------------------------------------------- #
# span close: selection + features + inference (identical math to training)
# --------------------------------------------------------------------------- #
def build_clip(buf, W, H, fps_est):
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
    feats = np.stack([EX.frame_features(pose[i], hands[i], face[i], in_use[i],
                                        W, H, duration) for i in chosen])
    return feats.astype(np.float32)[None]


# --------------------------------------------------------------------------- #
# overlay
# --------------------------------------------------------------------------- #
def put(img, text, xy, scale=0.6, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, xy, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw(img, mode, state, fps, lat_ms, rec_s, rec_n, result, result_until,
         msg, msg_until, now):
    put(img, f"mode {mode.upper()}  state {state}", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat_ms:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(img, "SPACE rec  M mode  Q quit", (12, img.shape[0] - 14), 0.5, (140, 140, 130))
    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 80), 0.7, (90, 90, 255))
    if result and now < result_until:
        headline, tops, lat = result
        col = (110, 230, 140) if headline not in ("Not sure",) else (90, 190, 255)
        put(img, headline, (12, 116), 1.0, col, 2)
        for k, (name, p) in enumerate(tops):
            put(img, f"{k + 1}. {name}  {100 * p:4.1f}%", (12, 146 + 26 * k), 0.6,
                (230, 230, 225))
    return img


def draw_centred(img, text, y, scale, color, thick=2):
    w = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, scale, thick)[0][0]
    cv2.putText(img, text, ((img.shape[1] - w) // 2, y),
                cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Live ISL sign detection.")
    ap.add_argument("--model-id", default=None)
    ap.add_argument("--width", type=int, default=LIVE_WIDTH,
                    help="detection frame width in px (default 640)")
    ap.add_argument("--complexity", type=int, default=1, choices=(0, 1),
                    help="MediaPipe model complexity (0 = faster, 1 = default)")
    args = ap.parse_args()

    model_dir = find_model_dir(args.model_id)
    sess, in_name, out_name, classes = load_model(model_dir)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        sys.exit("ERROR: cannot open webcam 0. Check the camera and retry.")

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
        logits = sess.run([out_name], {in_name: feats})[0]
        lat_ms = (time.perf_counter() - t0) * 1000.0
        p = softmax(logits[0].astype(np.float64))
        order = np.argsort(-p)[:TOP_K]
        gap = (p[order[0]] - p[order[1]]) if len(p) > 1 else 1.0
        headline = classes[order[0]]
        if p[order[0]] < MIN_TOP_PROB or gap < MIN_PROB_GAP:
            headline = "Not sure"
        result = (headline, [(classes[i], float(p[i])) for i in order], lat_ms)
        result_until = time.perf_counter() + RESULT_HOLD_S

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
                small = cv2.resize(frame, (args.width,
                                           int(round(fh * args.width / fw))))
            else:
                small = frame
            H_cur, W_cur = small.shape[:2]
            rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose, hands, face, f_ok = read_landmarks(res, True, W_cur, H_cur, hands_det)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)
            hands, hands_det = rescue_hands(rgb, pose, hands, in_use, hands_det)
            fr = Fr(pose, hands, face, f_ok, in_use, now)
            raised = bool(in_use.any())

            # ---- sign-span state machine (same constants as extract) ---- #
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

            # ---- keys ---- #
            k = cv2.waitKey(1) & 0xFF
            if k in (27, ord("q"), ord("Q")):
                break
            if k in (ord("m"), ord("M")):
                mode = "manual" if mode == "auto" else "auto"
                state, buf, up, down = "IDLE", [], 0, 0
                pre.clear()
            elif k == 32:                                   # SPACE
                if mode == "manual":
                    if state == "IDLE":
                        state, buf = "SIGN", [fr]
                    else:
                        close_span(buf)
                        state, buf = "IDLE", []

            # ---- overlay ---- #
            rec_s = (now - buf[0].t) if buf else 0.0
            draw(frame, mode, state, fps, lat_ms, rec_s, len(buf),
                 result, result_until, msg, msg_until, now)
            if msg and now < msg_until:
                draw_centred(frame, msg, 60, 0.85, (80, 120, 255))
            cv2.imshow("ISL live detection", frame)
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