"""
test_model.py — Step 3:  py test_model.py

Live webcam test of the newest trained model.

Sign boundary (AUTO, default):
  hands DOWN = no sign | raise hands = sign starts | both hands DOWN again = sign ends -> predict.
Recorded clips are sampled exactly like training videos: 32 frames over the full clip,
same extract_features() / fill_sequence() from extract.py.
Keys: SPACE = manual start/stop, M = toggle auto/manual, Q/ESC = quit.
"""

import json
import sys
import time
from collections import deque

import cv2
import mediapipe as mp
import numpy as np
import onnxruntime as ort

from extract import (DIM, MODELS, SEQ_T, SignBoundary, extract_features,
                     fill_sequence, frame_idxs, model_ids)

# ───────────── settings (edit here) ─────────────
MODEL_ID = None          # None = latest folder with a trained model
CAMERA = 0
START_IN_MANUAL = False
MAX_SECONDS = 6.0        # auto-stop a recording after this long
MIN_SECONDS = 0.6        # shorter raises are treated as false starts
COUNTDOWN = 2            # manual-mode countdown seconds
START_FRAMES = 3         # consecutive hands-up frames to start
END_FRAMES = 10          # consecutive both-hands-down frames to end
PREROLL = 8              # frames kept from before the trigger
MARGIN = 0.05            # how far above the rest line counts as "up"
COOLDOWN = 1.0           # seconds before auto can retrigger
TOP_K = 3
MIRROR = True
SHOW_LANDMARKS = True
# ────────────────────────────────────────────────

mp_holistic = mp.solutions.holistic
mp_draw = mp.solutions.drawing_utils


def find_model_dir():
    if MODEL_ID is not None:
        return MODELS / str(MODEL_ID)
    for i in reversed(model_ids()):
        d = MODELS / str(i)
        if (d / "sign_daily_lstm.onnx").exists():
            return d
    sys.exit("No trained model found. Run extract.py then train.py first.")


def _sample_and_extract(frames, idxs, require_both_hands):
    hol = mp_holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5,
                               min_tracking_confidence=0.5)
    out, last, good = [], None, 0
    for ix in idxs:
        res = hol.process(cv2.cvtColor(frames[int(ix)], cv2.COLOR_BGR2RGB))
        feat = extract_features(res, require_both_hands)
        if feat is not None:
            last, good = feat, good + 1
        out.append(feat if feat is not None else last)
    hol.close()
    return out, good


def process_frames(frames):
    """Recorded clip -> (32, 158), sampled over the full clip just like extract.py."""
    n = len(frames)
    if n < 8:
        print(f"Clip too short ({n} frames).")
        return None
    idxs = frame_idxs(n)

    out, good = _sample_and_extract(frames, idxs, True)
    if good < SEQ_T // 2:                      # rescue pass for low-quality clips
        out2, good2 = _sample_and_extract(frames, idxs, False)
        if good2 > good:
            out, good = out2, good2
    if good == 0:
        print("No hand/pose landmarks detected in the clip.")
        return None
    if good < SEQ_T // 2:
        print(f"Warning: low detection quality ({good}/{SEQ_T} frames valid).")
    return fill_sequence(out)


def predict(session, input_name, classes, features):
    logits = session.run(None, {input_name: features[np.newaxis].astype(np.float32)})[0][0]
    p = np.exp(logits - np.max(logits))
    p /= p.sum()
    order = np.argsort(p)[::-1][:TOP_K]
    return [(classes[i], float(p[i])) for i in order]


def put_text(img, text, org, scale=0.7, color=(255, 255, 255), thick=2):
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, scale, (0, 0, 0), thick + 3, cv2.LINE_AA)
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thick, cv2.LINE_AA)


def draw_landmarks(img, res):
    if res.pose_landmarks:
        mp_draw.draw_landmarks(img, res.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
    for h in (res.left_hand_landmarks, res.right_hand_landmarks):
        if h:
            mp_draw.draw_landmarks(img, h, mp_holistic.HAND_CONNECTIONS)


def main():
    model_dir = find_model_dir()
    with open(model_dir / "sign_daily_classes.json", "r", encoding="utf-8") as f:
        classes = json.load(f)
    session = ort.InferenceSession(str(model_dir / "sign_daily_lstm.onnx"), providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name
    md = session.get_inputs()[0].shape[-1]
    if isinstance(md, int) and md != DIM:
        sys.exit(f"Model expects {md}-dim input but the extractor gives {DIM}. Train a model with train.py.")
    print(f"Using model {model_dir.name} ({len(classes)} classes)")

    cap = cv2.VideoCapture(CAMERA)
    if not cap.isOpened():
        sys.exit(f"Could not open camera {CAMERA}")

    live_hol = mp_holistic.Holistic(static_image_mode=False, model_complexity=0,
                                    min_detection_confidence=0.5, min_tracking_confidence=0.5)
    boundary = SignBoundary(START_FRAMES, END_FRAMES, MARGIN)

    win = "Sign Test (SPACE=manual, M=auto/manual, Q=quit)"
    cv2.namedWindow(win, cv2.WINDOW_NORMAL)

    auto = not START_IN_MANUAL
    state = "idle"  # idle | countdown | recording | processing | result
    frames, prebuf = [], deque(maxlen=max(0, PREROLL))
    t_state = cooldown_until = 0.0
    result_lines = []

    while True:
        ok, raw = cap.read()
        if not ok:
            print("Camera read failed.")
            break

        disp = cv2.flip(raw, 1) if MIRROR else raw.copy()   # inference uses the RAW frame
        now = time.time()
        res = live_hol.process(cv2.cvtColor(disp, cv2.COLOR_BGR2RGB))
        if SHOW_LANDMARKS:
            draw_landmarks(disp, res)

        event = boundary.update(res) if ((auto and now >= cooldown_until) or state == "recording") else None
        up = boundary.up

        if state in ("idle", "result"):
            prebuf.append(raw.copy())
            if auto and event == "start":
                frames, state, t_state = list(prebuf), "recording", now

        elif state == "countdown":
            left = COUNTDOWN - (now - t_state)
            if left <= 0:
                state, frames, t_state = "recording", [], now
                boundary.reset()
            else:
                put_text(disp, f"Get ready... {int(np.ceil(left))}", (20, 40), 1.0, (0, 255, 255))

        elif state == "recording":
            frames.append(raw.copy())
            elapsed = now - t_state
            if auto and event == "end":
                if elapsed < MIN_SECONDS:
                    frames, state = [], "idle"          # false start
                else:
                    cut = max(0, END_FRAMES - 2)         # drop trailing hands-down frames, keep 2
                    if cut:
                        frames = frames[:-cut]
                    state = "processing"
            if elapsed >= MAX_SECONDS:
                state = "processing"

        put_text(disp, f"[{'AUTO' if auto else 'MANUAL'}] hands: {'UP' if up else 'down'}",
                 (20, disp.shape[0] - 20), 0.55, (0, 255, 0) if up else (200, 200, 200))

        if state == "idle":
            put_text(disp, "Raise your hands to start signing" if auto else "Press SPACE to record one sign", (20, 40))
        elif state == "recording":
            cv2.circle(disp, (30, 35), 12, (0, 0, 255), -1)
            hint = "lower both hands to finish" if auto else "SPACE to stop"
            put_text(disp, f"REC {now - t_state:4.1f}s  ({hint})", (55, 42), 0.8, (0, 0, 255))
        elif state == "result":
            for i, line in enumerate(result_lines):
                put_text(disp, line, (20, 40 + 32 * i), 0.9 if i == 0 else 0.65,
                         (0, 255, 0) if i == 0 else (255, 255, 255))
            put_text(disp, "raise hands to sign again" if auto else "SPACE = record again",
                     (20, disp.shape[0] - 50), 0.6)

        if state == "processing":
            put_text(disp, "Processing...", (20, 40), 1.0, (0, 255, 255))
            cv2.imshow(win, disp)
            cv2.waitKey(1)

            feats = process_frames(frames)
            if feats is None:
                result_lines = ["No sign detected - try again", "(keep hands & upper body in view)"]
            else:
                preds = predict(session, input_name, classes, feats)
                result_lines = [f"{preds[0][0]}  ({preds[0][1] * 100:.1f}%)"] + [
                    f"{i}. {l} - {c * 100:.1f}%" for i, (l, c) in enumerate(preds[1:], start=2)
                ]
                print("Prediction:", preds)

            frames = []
            prebuf.clear()
            boundary.reset()
            cooldown_until = time.time() + COOLDOWN
            state = "result"
            continue

        cv2.imshow(win, disp)
        key = cv2.waitKey(1) & 0xFF
        if key in (ord("q"), 27):
            break
        elif key == ord("m"):
            auto = not auto
            boundary.reset()
        elif key == 32:
            if state in ("idle", "result"):
                if COUNTDOWN > 0 and not auto:
                    state, t_state = "countdown", now
                else:
                    state, frames, t_state = "recording", list(prebuf), now
                    boundary.reset()
            elif state == "recording":
                state = "processing"

    cap.release()
    live_hol.close()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()