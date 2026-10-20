"""
test_live_sign.py — Live webcam sign test (OpenCV popup window).

AUTO mode (default):
  - Hands DOWN  -> idle, waiting.
  - Hands UP    -> recording starts (a short pre-roll is kept so the sign start isn't lost).
  - Hands DOWN again for a few frames -> recording stops, sign is predicted.
  - Result stays on screen; raise your hands to sign again.

MANUAL mode (press 'm' to toggle, or --manual):
  - SPACE starts (after countdown) / stops recording.

Keys: SPACE = manual start/stop (works in both modes), M = toggle auto/manual, Q/ESC = quit.
"""

import argparse
import json
import sys
import time
from collections import deque
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from backend.pose import POSE_DIM, pose_from_landmarks  # noqa: E402

DEFAULT_MODEL_DIR = ROOT / "models" / "onnx_models" / "3"
SEQ_T = 32
DIM = 126 + POSE_DIM  # 258

mp_holistic = mp.solutions.holistic
mp_draw = mp.solutions.drawing_utils


# --------------------------------------------------------------------------
# Feature extraction (identical math to test_video_sign.py)
# --------------------------------------------------------------------------
def extract_frame_features(hol, bgr, require_both_hands=True):
    res = hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    if res.pose_landmarks is None:
        return None

    has_lh = res.left_hand_landmarks is not None
    has_rh = res.right_hand_landmarks is not None

    if require_both_hands:
        if not has_lh or not has_rh:
            return None
    elif not has_lh and not has_rh:
        return None

    lh = (
        np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
        if has_lh else np.zeros((21, 3), np.float32)
    )
    rh = (
        np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
        if has_rh else np.zeros((21, 3), np.float32)
    )

    pose = pose_from_landmarks(res.pose_landmarks)

    ref_hand = rh if has_rh else lh
    ref = ref_hand[0]
    scale = np.linalg.norm(ref_hand[9] - ref_hand[0]) + 1e-6

    lh_norm = (lh - ref) / scale if has_lh else np.zeros((21, 3), np.float32)
    rh_norm = (rh - ref) / scale if has_rh else np.zeros((21, 3), np.float32)
    pose_norm = pose.copy()
    pose_norm[:, :3] = (pose_norm[:, :3] - ref) / scale

    return np.concatenate(
        [lh_norm.flatten(), rh_norm.flatten(), pose_norm.flatten()]
    ).astype(np.float32)


def _sample_and_extract(frames, idxs, require_both_hands):
    # Fresh Holistic per pass so tracking state never leaks between clips/passes.
    hol = mp_holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5)
    out_feat, last_feat, good = [], None, 0
    for ix in idxs:
        feat = extract_frame_features(hol, frames[int(ix)], require_both_hands)
        if feat is not None:
            last_feat = feat
            good += 1
        out_feat.append(feat if feat is not None else last_feat)
    hol.close()
    return out_feat, good


def process_frames(frames, start_frac=0.10, end_frac=0.90):
    """Same sampling/cleaning logic as process_video(), but on in-memory frames."""
    n = len(frames)
    if n < 8:
        print(f"Clip too short ({n} frames). Need at least 8.")
        return None

    start_idx = int(n * start_frac)
    end_idx = min(n - 1, max(start_idx + 1, int(n * end_frac) - 1))
    idxs = np.linspace(start_idx, end_idx, SEQ_T).astype(int)

    out_feat, good = _sample_and_extract(frames, idxs, require_both_hands=True)

    if good < SEQ_T // 2:
        out_feat_single, good_single = _sample_and_extract(frames, idxs, require_both_hands=False)
        if good_single > good:
            out_feat, good = out_feat_single, good_single

    if good == 0:
        print("No hand/pose landmarks detected in the clip.")
        return None
    if good < SEQ_T // 2:
        print(f"Warning: low detection quality ({good}/{SEQ_T} frames valid).")

    first_valid = next((f for f in out_feat if f is not None), np.zeros(DIM, np.float32))
    cleaned, curr = [], first_valid
    for o in out_feat:
        if o is not None:
            curr = o
        cleaned.append(curr)
    return np.array(cleaned, dtype=np.float32)


def predict(session, input_name, classes, features, top_k=3):
    batch = features[np.newaxis].astype(np.float32)
    logits = session.run(None, {input_name: batch})[0][0]
    e = np.exp(logits - np.max(logits))
    probs = e / e.sum()
    order = np.argsort(probs)[::-1][:top_k]
    return [(classes[i], float(probs[i])) for i in order]


# --------------------------------------------------------------------------
# Hands up / down detection (auto trigger)
# --------------------------------------------------------------------------
def hands_up(res, margin=0.05, vis_thresh=0.5):
    """
    True when at least one wrist is clearly raised above the 'rest line'.

    Rest line = hip line if hips are visible; otherwise (typical desk webcam,
    upper body only) it is estimated below the shoulders from shoulder width.
    A wrist that is not visible (out of frame at the bottom) counts as down.
    """
    if res.pose_landmarks is None:
        return False
    lm = res.pose_landmarks.landmark

    hips_visible = lm[23].visibility > vis_thresh and lm[24].visibility > vis_thresh
    if hips_visible:
        rest_y = (lm[23].y + lm[24].y) / 2
    else:
        shoulder_y = (lm[11].y + lm[12].y) / 2
        shoulder_w = abs(lm[11].x - lm[12].x)
        rest_y = shoulder_y + 1.3 * shoulder_w  # roughly belly level

    for wrist in (lm[15], lm[16]):
        if wrist.visibility > vis_thresh and wrist.y < rest_y - margin:
            return True
    return False


# --------------------------------------------------------------------------
# UI helpers
# --------------------------------------------------------------------------
def put_text(img, text, org, scale=0.7, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, scale, (0, 0, 0), thick + 3, cv2.LINE_AA)
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw_landmarks(img, res):
    if res.pose_landmarks:
        mp_draw.draw_landmarks(img, res.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
    if res.left_hand_landmarks:
        mp_draw.draw_landmarks(img, res.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
    if res.right_hand_landmarks:
        mp_draw.draw_landmarks(img, res.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)


def main():
    ap = argparse.ArgumentParser(description="Live webcam sign test (auto hands-up/down trigger).")
    ap.add_argument("--camera", type=int, default=0)
    ap.add_argument("--model-dir", type=str, default=str(DEFAULT_MODEL_DIR))
    ap.add_argument("--manual", action="store_true", help="Start in manual (SPACE) mode")
    ap.add_argument("--max-seconds", type=float, default=6.0, help="Auto-stop recording after N seconds")
    ap.add_argument("--min-seconds", type=float, default=0.6, help="Ignore clips shorter than this")
    ap.add_argument("--countdown", type=int, default=2, help="Manual-mode countdown seconds")
    ap.add_argument("--start-frames", type=int, default=3, help="Consecutive hands-up frames to start")
    ap.add_argument("--end-frames", type=int, default=10, help="Consecutive hands-down frames to stop")
    ap.add_argument("--preroll", type=int, default=8, help="Frames kept from before the trigger")
    ap.add_argument("--margin", type=float, default=0.05, help="How far above the rest line counts as 'up'")
    ap.add_argument("--cooldown", type=float, default=1.0, help="Seconds before auto can retrigger")
    ap.add_argument("--top-k", type=int, default=3)
    ap.add_argument("--no-mirror", action="store_true", help="Don't mirror the preview")
    ap.add_argument("--no-preview-landmarks", action="store_true", help="Hide skeleton overlay")
    args = ap.parse_args()

    model_dir = Path(args.model_dir)
    onnx_path = model_dir / "sign_daily_lstm.onnx"
    classes_path = model_dir / "sign_daily_classes.json"
    if not onnx_path.exists() or not classes_path.exists():
        print(f"Model files not found in {model_dir}")
        return

    with open(classes_path, "r", encoding="utf-8") as f:
        classes = json.load(f)
    session = ort.InferenceSession(str(onnx_path), providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        print(f"Could not open camera {args.camera}")
        return

    # Lightweight Holistic for the live overlay + hands up/down detection
    # (separate from the inference instance created per prediction).
    live_hol = mp_holistic.Holistic(
        static_image_mode=False, model_complexity=0, min_detection_confidence=0.5
    )

    win = "Sign Test (SPACE=manual, M=auto/manual, Q=quit)"
    cv2.namedWindow(win, cv2.WINDOW_NORMAL)

    auto = not args.manual
    state = "idle"  # idle | countdown | recording | processing | result
    frames = []
    prebuf = deque(maxlen=max(0, args.preroll))
    t_state = 0.0
    cooldown_until = 0.0
    up_count = down_count = 0
    result_lines = []

    while True:
        ok, raw = cap.read()
        if not ok:
            print("Camera read failed.")
            break

        # Inference always uses the RAW (unmirrored) frame, matching training videos.
        disp = raw.copy() if args.no_mirror else cv2.flip(raw, 1)
        now = time.time()

        res = live_hol.process(cv2.cvtColor(disp, cv2.COLOR_BGR2RGB))
        up = hands_up(res, margin=args.margin)
        if not args.no_preview_landmarks:
            draw_landmarks(disp, res)

        # ---- state machine ------------------------------------------------
        if state in ("idle", "result"):
            prebuf.append(raw.copy())
            if auto and now >= cooldown_until:
                up_count = up_count + 1 if up else 0
                if up_count >= args.start_frames:
                    frames = list(prebuf)
                    state, t_state, down_count, up_count = "recording", now, 0, 0

        elif state == "countdown":
            left = args.countdown - (now - t_state)
            if left <= 0:
                state, frames, t_state, down_count = "recording", [], now, 0
            else:
                put_text(disp, f"Get ready... {int(np.ceil(left))}", (20, 40), 1.0, (0, 255, 255))

        elif state == "recording":
            frames.append(raw.copy())
            elapsed = now - t_state
            down_count = 0 if up else down_count + 1

            if auto:
                if down_count >= args.end_frames and elapsed >= args.min_seconds:
                    # Drop most of the trailing hands-down frames (keep 2 as padding).
                    cut = max(0, down_count - 2)
                    if cut:
                        frames = frames[:-cut]
                    state = "processing"
            if elapsed >= args.max_seconds:
                state = "processing"

        # ---- overlays -----------------------------------------------------
        mode_txt = "AUTO" if auto else "MANUAL"
        put_text(disp, f"[{mode_txt}] hands: {'UP' if up else 'down'}",
                 (20, disp.shape[0] - 20), 0.55, (0, 255, 0) if up else (200, 200, 200))

        if state == "idle":
            msg = "Raise your hands to start signing" if auto else "Press SPACE to record one sign"
            put_text(disp, msg, (20, 40))
        elif state == "recording":
            cv2.circle(disp, (30, 35), 12, (0, 0, 255), -1)
            hint = "lower hands to finish" if auto else "SPACE to stop"
            put_text(disp, f"REC {now - t_state:4.1f}s  ({hint})", (55, 42), 0.8, (0, 0, 255))
        elif state == "result":
            for i, line in enumerate(result_lines):
                color = (0, 255, 0) if i == 0 else (255, 255, 255)
                put_text(disp, line, (20, 40 + 32 * i), 0.9 if i == 0 else 0.65, color)
            hint = "raise hands to sign again" if auto else "SPACE = record again"
            put_text(disp, hint, (20, disp.shape[0] - 50), 0.6)

        if state == "processing":
            put_text(disp, "Processing...", (20, 40), 1.0, (0, 255, 255))
            cv2.imshow(win, disp)
            cv2.waitKey(1)

            feats = process_frames(frames)
            if feats is None:
                result_lines = ["No sign detected - try again", "(keep hands & upper body in view)"]
            else:
                preds = predict(session, input_name, classes, feats, args.top_k)
                result_lines = [f"{preds[0][0]}  ({preds[0][1] * 100:.1f}%)"] + [
                    f"{i}. {l} - {c * 100:.1f}%" for i, (l, c) in enumerate(preds[1:], start=2)
                ]
                print("Prediction:", preds)

            frames = []
            prebuf.clear()
            up_count = down_count = 0
            cooldown_until = time.time() + args.cooldown
            state = "result"
            continue

        cv2.imshow(win, disp)
        key = cv2.waitKey(1) & 0xFF

        if key in (ord("q"), 27):
            break
        elif key == ord("m"):
            auto = not auto
            up_count = down_count = 0
        elif key == 32:  # SPACE (manual start/stop; works in both modes)
            if state in ("idle", "result"):
                if args.countdown > 0 and not auto:
                    state, t_state = "countdown", now
                else:
                    state, frames, t_state, down_count = "recording", list(prebuf), now, 0
            elif state == "recording":
                state = "processing"

    cap.release()
    live_hol.close()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()