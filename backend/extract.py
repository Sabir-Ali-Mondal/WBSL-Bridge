"""
98-dim feature extraction for the temporal sign-recognition model.

The feature math mirrors model_training_zone/extract.py. The model accepts
raw (batch, 64, 98) float32 features; standardization is part of the ONNX graph.
"""

import contextlib
import ctypes
import logging
import math
import os
import sys
import time

os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
os.environ.setdefault("MEDIAPIPE_DISABLE_LOGGING", "1")
logging.getLogger("absl").setLevel(logging.ERROR)

import numpy as np
import mediapipe as mp

from backend.pose import (
    POSE_INDICES,
    P_LSH,
    P_RSH,
    P_LEL,
    P_REL,
    P_LWR,
    P_RWR,
    P_LHIP,
    P_RHIP,
    VIS_MIN,
)

N_FEATURES = 98
N_FRAMES = 64
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9
HAND_MARGIN_SW = 0.05
REST_SHOULDER_FACTOR = 1.3
RESCUE_MAX_DIST = 0.30

AVATAR_FACE = [
    10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
    159, 145, 386, 374, 1, 61, 291, 0, 17,
]
FACE_CACHE_IDX = AVATAR_FACE + [13, 14]
FI = {idx: k for k, idx in enumerate(FACE_CACHE_IDX)}

TRIGGER_FRAMES = 3
PRE_ROLL = 8
END_FRAMES = 10
KEEP_TAIL = 2
MAX_GAP = 5


@contextlib.contextmanager
def _suppress_c_stderr():
    old_fd = None
    stderr_file = None
    ucrt = None
    try:
        if sys.platform == "win32":
            ucrt = ctypes.CDLL("ucrtbase.dll")
            iob_func = getattr(ucrt, "__acrt_iob_func")
            iob_func.restype = ctypes.c_void_p
            iob_func.argtypes = [ctypes.c_uint]
            stderr_file = iob_func(2)
            old_fd = os.dup(2)
            ucrt.freopen.restype = ctypes.c_void_p
            ucrt.freopen.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_void_p]
            ucrt.freopen(b"NUL", b"w", stderr_file)
        else:
            old_fd = os.dup(2)
            devnull = os.open(os.devnull, os.O_WRONLY)
            os.dup2(devnull, 2)
            os.close(devnull)
    except Exception:
        pass
    try:
        yield
    finally:
        try:
            if sys.platform == "win32" and ucrt and stderr_file and old_fd is not None:
                ucrt.fflush.argtypes = [ctypes.c_void_p]
                ucrt.fflush(stderr_file)
                time.sleep(0.15)
                ucrt.fflush(stderr_file)
                os.dup2(old_fd, 2)
                os.close(old_fd)
            elif old_fd is not None:
                os.dup2(old_fd, 2)
                os.close(old_fd)
        except Exception:
            pass


with _suppress_c_stderr():
    _holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False,
        model_complexity=1,
        smooth_landmarks=True,
        refine_face_landmarks=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    _hands_det = mp.solutions.hands.Hands(
        static_image_mode=True,
        max_num_hands=2,
        min_detection_confidence=0.5,
    )


def _lm(landmarks, idx_list):
    return np.array(
        [(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in idx_list],
        np.float32,
    )


def frame_in_use(pose: np.ndarray, W: int, H: int) -> np.ndarray:
    """Return whether each wrist is raised above the signer's rest line."""
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


def process_holistic_frame(frame_bgr: np.ndarray) -> dict | None:
    """Run Holistic once and return the frame's raw pose, hand, and face landmarks."""
    import cv2

    H_img, W_img = frame_bgr.shape[:2]
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    rgb.flags.writeable = False
    res = _holistic.process(rgb)
    if not res.pose_landmarks:
        return None

    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    landmarks = res.pose_landmarks.landmark
    for k, i in enumerate(POSE_INDICES):
        pose[k] = (
            landmarks[i].x,
            landmarks[i].y,
            landmarks[i].z,
            landmarks[i].visibility,
        )

    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hand_landmarks in enumerate(
        (res.left_hand_landmarks, res.right_hand_landmarks)
    ):
        if hand_landmarks:
            hands[h] = _lm(hand_landmarks.landmark, range(21))

    in_use = frame_in_use(pose, W_img, H_img)
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if missing:
        rescued = _hands_det.process(rgb)
        if rescued.multi_hand_landmarks:
            best = {}
            for hand_landmarks in rescued.multi_hand_landmarks:
                points = _lm(hand_landmarks.landmark, range(21))
                for wrist_index in (P_LWR, P_RWR):
                    wrist = pose[wrist_index, :2]
                    if np.isfinite(wrist).all():
                        distance = float(
                            np.hypot(
                                points[0, 0] - wrist[0],
                                points[0, 1] - wrist[1],
                            )
                        )
                        hand_index = 0 if wrist_index == P_LWR else 1
                        if hand_index in missing and distance < RESCUE_MAX_DIST:
                            if hand_index not in best or distance < best[hand_index][0]:
                                best[hand_index] = (distance, points)
            for hand_index, (_, points) in best.items():
                hands[hand_index] = points

    face = np.full((len(FACE_CACHE_IDX), 3), np.nan, np.float32)
    face_ok = bool(res.face_landmarks)
    if face_ok:
        face = _lm(res.face_landmarks.landmark, FACE_CACHE_IDX)

    return {
        "pose": pose,
        "hands": hands,
        "face": face,
        "face_ok": face_ok,
        "W": W_img,
        "H": H_img,
    }


def frame_features(pose, hands21, face, in_use, W, H, duration) -> np.ndarray:
    """Build the training-compatible 98-value feature vector for one frame."""
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    origin = (sl + sr) / 2.0
    sw = float(np.linalg.norm(sl - sr))
    if not np.isfinite(sw) or sw < 1.0:
        return np.zeros(N_FEATURES, np.float32)
    xax = (sl - sr) / sw
    yax = np.array([xax[1], -xax[0]])

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):
        d = pts[:, :2].astype(np.float64) * [W, H] - origin
        return np.stack(
            [
                d @ xax / sw,
                d @ yax / sw,
                -pts[:, 2].astype(np.float64) * W / sw,
            ],
            1,
        )

    forehead = box_xy(face[FI[10], :2])
    mouth = box_xy((face[FI[13], :2] + face[FI[14], :2]) / 2.0)
    chin = box_xy(face[FI[152], :2])
    face_box = (forehead, mouth, chin)

    handshape = np.zeros((2, 11, 3))
    palm_direction = np.zeros((2, 6))
    wrist_position = np.zeros((2, 2))
    wrist_face_distance = np.zeros((2, 3))
    hand_flags = np.zeros(2)

    for h in (0, 1):
        if not in_use[h]:
            continue
        points = hands21[h][HAND_IDX]
        if np.isnan(points).any():
            continue
        box = box_pts(points)
        relative = box - box[0]
        middle_base = relative[H_MID_BASE]
        palm = float(np.linalg.norm(middle_base)) + 1e-9
        phi = math.atan2(middle_base[0], middle_base[1])
        c, s = math.cos(phi), math.sin(phi)
        rotated = relative / palm
        handshape[h] = np.stack(
            [
                rotated[:, 0] * c - rotated[:, 1] * s,
                rotated[:, 0] * s + rotated[:, 1] * c,
                rotated[:, 2],
            ],
            1,
        )
        palm_direction[h, :3] = middle_base / palm
        normal = np.cross(relative[H_INDEX_BASE], relative[H_PINKY_BASE])
        if h == 0:
            normal = -normal
        palm_direction[h, 3:] = normal / (np.linalg.norm(normal) + 1e-9)
        wrist_position[h] = box[0, :2]
        for k in range(3):
            wrist_face_distance[h, k] = np.linalg.norm(
                box[0, :2] - face_box[k]
            )
        hand_flags[h] = 1.0

    elbows = np.concatenate(
        [box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])]
    )
    head_vector = forehead - chin
    head = np.array(
        [
            mouth[0],
            mouth[1],
            math.atan2(head_vector[0], head_vector[1])
            if np.linalg.norm(head_vector) > 1e-6
            else 0.0,
        ]
    )
    features = np.concatenate(
        [
            handshape.ravel(),
            palm_direction.ravel(),
            wrist_position.ravel(),
            elbows,
            wrist_face_distance.ravel(),
            head,
            hand_flags,
            [duration],
        ]
    )
    assert features.shape[0] == N_FEATURES
    return features.astype(np.float32)


def complete_mask_single(pose, hands, face_ok, in_use, W, H) -> bool:
    """Return whether all landmarks needed for this frame were detected."""
    if not face_ok:
        return False
    visibility = pose[:4, 3]
    if not (np.isfinite(visibility).all() and (visibility >= VIS_MIN).all()):
        return False
    left_shoulder = pose[P_LSH, :2].astype(np.float64) * [W, H]
    right_shoulder = pose[P_RSH, :2].astype(np.float64) * [W, H]
    shoulder_width = float(np.linalg.norm(left_shoulder - right_shoulder))
    if not np.isfinite(shoulder_width) or shoulder_width <= 1.0:
        return False
    for h in (0, 1):
        if in_use[h]:
            if not np.isfinite(hands[h]).all():
                return False
            palm = np.linalg.norm(
                (hands[h, 9, :2] - hands[h, 0, :2]) * [W, H]
            )
            if not np.isfinite(palm) or palm <= 1.0:
                return False
    return True


def select_frames_from_span(features_with_idx: list) -> np.ndarray | None:
    """Select 64 evenly spaced complete frames from one sign span."""
    frame_count = len(features_with_idx)
    if frame_count == 0:
        return None

    complete = np.array([frame[2] for frame in features_with_idx], dtype=bool)
    next_complete = np.empty(frame_count, int)
    current = -1
    for i in range(frame_count - 1, -1, -1):
        if complete[i]:
            current = i
        next_complete[i] = current

    positions = np.floor(
        np.arange(N_FRAMES) * (frame_count - 1) / (N_FRAMES - 1) + 0.5
    ).astype(int)
    chosen = []
    for position in positions:
        complete_index = next_complete[position]
        if complete_index < 0 or complete_index - position > MAX_GAP:
            return None
        chosen.append(complete_index)

    return np.stack([features_with_idx[i][1] for i in chosen])
