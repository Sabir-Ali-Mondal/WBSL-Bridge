"""
backend/nmm.py
Geometry-based NMM detection from test_1_3_geometry_nmm.py.
5 markers: eyebrow raise, eyebrow furrow, head shake, head nod, mouth open.
All detection is pure geometry — no ML model, < 5ms latency.
"""

import numpy as np
import mediapipe as mp
from collections import deque

# Initialize ONCE at module load
_face_mesh = mp.solutions.face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Landmark indices
LEFT_EYEBROW = [70, 63, 105, 66, 107]
RIGHT_EYEBROW = [300, 293, 334, 296, 336]
LEFT_EYE_TOP = 159
LEFT_EYE_BOTTOM = 145
RIGHT_EYE_TOP = 386
RIGHT_EYE_BOTTOM = 374
UPPER_LIP = 13
LOWER_LIP = 14
NOSE_TIP = 1
FACE_LEFT = 234
FACE_RIGHT = 454

# Thresholds
BROW_RAISE_THRESHOLD = 0.060
BROW_FURROW_THRESHOLD = 0.040
MOUTH_THRESHOLD = 0.040
HEAD_SHAKE_VAR_THRESHOLD = 0.0008
HEAD_NOD_VAR_THRESHOLD = 0.0008
WINDOW = 15

# State for temporal markers
_nose_x_history = deque(maxlen=WINDOW)
_nose_y_history = deque(maxlen=WINDOW)


def _get_point(landmarks, idx, w, h):
    lm = landmarks.landmark[idx]
    return np.array([lm.x * w, lm.y * h])


def _dist(p1, p2):
    return np.linalg.norm(p1 - p2)


def detect_nmm(frame_bgr: np.ndarray) -> dict:
    """
    Detect 5 geometry-based NMMs from a single BGR frame.
    """
    import cv2

    h, w, _ = frame_bgr.shape
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _face_mesh.process(rgb)

    flags = {
        "question": False,
        "wh_question": False,
        "negation": False,
        "affirmation": False,
        "emphasis": False,
    }

    if not results.multi_face_landmarks:
        return flags

    lm = results.multi_face_landmarks[0]
    fw = _dist(_get_point(lm, FACE_LEFT, w, h), _get_point(lm, FACE_RIGHT, w, h))
    if fw == 0:
        fw = 1

    # Eyebrow Raise / Furrow
    lb = np.mean([_get_point(lm, i, w, h) for i in LEFT_EYEBROW], axis=0)
    rb = np.mean([_get_point(lm, i, w, h) for i in RIGHT_EYEBROW], axis=0)
    le = (_get_point(lm, LEFT_EYE_TOP, w, h) + _get_point(lm, LEFT_EYE_BOTTOM, w, h)) / 2
    re = (_get_point(lm, RIGHT_EYE_TOP, w, h) + _get_point(lm, RIGHT_EYE_BOTTOM, w, h)) / 2
    brow_ratio = (_dist(lb, le) + _dist(rb, re)) / 2 / fw

    if brow_ratio > BROW_RAISE_THRESHOLD:
        flags["question"] = True
    elif brow_ratio < BROW_FURROW_THRESHOLD:
        flags["wh_question"] = True

    # Head Shake / Nod
    nose = _get_point(lm, NOSE_TIP, w, h)
    _nose_x_history.append(nose[0] / fw)
    _nose_y_history.append(nose[1] / fw)

    if len(_nose_x_history) == WINDOW:
        x_var = np.var(list(_nose_x_history))
        if x_var > HEAD_SHAKE_VAR_THRESHOLD:
            flags["negation"] = True

    if len(_nose_y_history) == WINDOW:
        y_var = np.var(list(_nose_y_history))
        if y_var > HEAD_NOD_VAR_THRESHOLD:
            flags["affirmation"] = True

    # Mouth Open
    mouth_ratio = _dist(_get_point(lm, UPPER_LIP, w, h), _get_point(lm, LOWER_LIP, w, h)) / fw
    if mouth_ratio > MOUTH_THRESHOLD:
        flags["emphasis"] = True

    return flags


def reset_nmm_state():
    """Clear temporal history."""
    _nose_x_history.clear()
    _nose_y_history.clear()