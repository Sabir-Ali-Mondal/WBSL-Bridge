# WBSL Bridge — AI Codebase Context

> Compact project architecture followed by relevant source and configuration files.

**Included files:** `69`  
**Maximum source file size:** `2 MB`

---

# Project Structure

```text
WBSL Bridge
├── backend
│   ├── __init__.py
│   ├── emotion_engine.py
│   ├── extract.py
│   ├── llm_engine.py
│   ├── main.py
│   ├── pose.py
│   ├── streaming.py
│   ├── stt_engine.py
│   └── tts_engine.py
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── admin
│   │   │   │   ├── contributions
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── models
│   │   │   │   ├── settings
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signs
│   │   │   │   ├── training-data
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── videos
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── demo
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── sign-to-text
│   │   │   │   └── page.tsx
│   │   │   ├── text-to-sign
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── providers.tsx
│   │   ├── components
│   │   │   ├── camera
│   │   │   │   ├── CameraFramingGuide.tsx
│   │   │   │   └── FramingWarningArea.tsx
│   │   │   ├── layout
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── PageContainer.tsx
│   │   │   │   └── SystemDiagnostics.tsx
│   │   │   ├── media
│   │   │   ├── pipeline
│   │   │   ├── recording
│   │   │   ├── sign
│   │   │   │   └── EmotionPanel.tsx
│   │   │   ├── simulation
│   │   │   │   ├── AlpanaStage.tsx
│   │   │   │   ├── ContinuousSignSimulation.tsx
│   │   │   │   ├── DhutiRig.tsx
│   │   │   │   ├── HandRig.tsx
│   │   │   │   ├── HeadFaceRig.tsx
│   │   │   │   ├── LandmarkSimulation.tsx
│   │   │   │   ├── RigUtils.ts
│   │   │   │   ├── simulationConstants.ts
│   │   │   │   ├── SimulationRoom.tsx
│   │   │   │   └── TorsoRig.tsx
│   │   │   ├── verification
│   │   │   └── skeletons.tsx
│   │   ├── hooks
│   │   │   ├── useCamera.ts
│   │   │   └── useSystemStatus.ts
│   │   ├── lib
│   │   │   ├── constants.ts
│   │   │   ├── pose.ts
│   │   │   ├── threeSetup.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── nlg.ts
│   │   │   └── stats.ts
│   │   └── store
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   ├── dev-framing.log
│   ├── dev.log
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.ts
│   ├── README.md
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── tsconfig.tsbuildinfo
├── model_training_zone
│   ├── training-method
│   │   ├── avatar_data.svg
│   │   ├── training_data.svg
│   │   └── training_method.md
│   ├── avatar_extract.py
│   ├── extract.py
│   ├── guide.md
│   ├── test_model.py
│   └── train.py
├── models
├── codebase.md
├── codebase.py
├── HOW_TO_RUN.md
├── IMPLEMENTATION_GUIDE.md
├── openh264-1.8.0-win64.dll
├── README.md
├── requirements-training.txt
├── requirements.txt
└── start.ps1
```

---

# Included Files

- `backend\__init__.py`
- `backend\emotion_engine.py`
- `backend\extract.py`
- `backend\llm_engine.py`
- `backend\main.py`
- `backend\pose.py`
- `backend\streaming.py`
- `backend\stt_engine.py`
- `backend\tts_engine.py`
- `frontend\AGENTS.md`
- `frontend\CLAUDE.md`
- `frontend\eslint.config.mjs`
- `frontend\next-env.d.ts`
- `frontend\next.config.ts`
- `frontend\postcss.config.ts`
- `frontend\src\app\about\page.tsx`
- `frontend\src\app\admin\contributions\page.tsx`
- `frontend\src\app\admin\layout.tsx`
- `frontend\src\app\admin\models\page.tsx`
- `frontend\src\app\admin\page.tsx`
- `frontend\src\app\admin\settings\page.tsx`
- `frontend\src\app\admin\training-data\page.tsx`
- `frontend\src\app\admin\videos\page.tsx`
- `frontend\src\app\demo\page.tsx`
- `frontend\src\app\globals.css`
- `frontend\src\app\layout.tsx`
- `frontend\src\app\login\page.tsx`
- `frontend\src\app\page.tsx`
- `frontend\src\app\providers.tsx`
- `frontend\src\app\sign-to-text\page.tsx`
- `frontend\src\app\text-to-sign\page.tsx`
- `frontend\src\components\camera\CameraFramingGuide.tsx`
- `frontend\src\components\camera\FramingWarningArea.tsx`
- `frontend\src\components\layout\AdminSidebar.tsx`
- `frontend\src\components\layout\AppSidebar.tsx`
- `frontend\src\components\layout\Footer.tsx`
- `frontend\src\components\layout\PageContainer.tsx`
- `frontend\src\components\layout\SystemDiagnostics.tsx`
- `frontend\src\components\sign\EmotionPanel.tsx`
- `frontend\src\components\simulation\AlpanaStage.tsx`
- `frontend\src\components\simulation\ContinuousSignSimulation.tsx`
- `frontend\src\components\simulation\DhutiRig.tsx`
- `frontend\src\components\simulation\HandRig.tsx`
- `frontend\src\components\simulation\HeadFaceRig.tsx`
- `frontend\src\components\simulation\LandmarkSimulation.tsx`
- `frontend\src\components\simulation\RigUtils.ts`
- `frontend\src\components\simulation\simulationConstants.ts`
- `frontend\src\components\simulation\SimulationRoom.tsx`
- `frontend\src\components\simulation\TorsoRig.tsx`
- `frontend\src\components\skeletons.tsx`
- `frontend\src\hooks\useCamera.ts`
- `frontend\src\hooks\useSystemStatus.ts`
- `frontend\src\lib\constants.ts`
- `frontend\src\lib\pose.ts`
- `frontend\src\lib\threeSetup.ts`
- `frontend\src\lib\types.ts`
- `frontend\src\lib\utils.ts`
- `frontend\src\services\api.ts`
- `frontend\src\services\auth.ts`
- `frontend\src\services\nlg.ts`
- `frontend\src\services\stats.ts`
- `frontend\tailwind.config.ts`
- `model_training_zone\avatar_extract.py`
- `model_training_zone\extract.py`
- `model_training_zone\guide.md`
- `model_training_zone\test_model.py`
- `model_training_zone\train.py`
- `model_training_zone\training-method\training_method.md`
- `start.ps1`

---

# Source Files

# FILE: `backend\__init__.py`

```python

```

---

# FILE: `backend\emotion_engine.py`

```python
"""Emotion classification using the optional ViT ONNX model."""

import logging
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

from backend.extract import _suppress_c_stderr

logger = logging.getLogger(__name__)

ROOT = Path(__file__).resolve().parent.parent
VIT_PATH = ROOT / "models" / "emotion" / "vit_emotion.onnx"

_vit_session = None
_vit_input_name = None
if VIT_PATH.exists():
    try:
        _vit_session = ort.InferenceSession(
            str(VIT_PATH), providers=["CPUExecutionProvider"]
        )
        _vit_input_name = _vit_session.get_inputs()[0].name
    except Exception:
        logger.exception("Could not load ViT emotion model at %s", VIT_PATH)

_face_mesh = None
if _vit_session is not None:
    try:
        import mediapipe as mp

        with _suppress_c_stderr():
            _face_mesh = mp.solutions.face_mesh.FaceMesh(
                static_image_mode=False,
                max_num_faces=1,
                refine_landmarks=True,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
            )
    except Exception:
        logger.exception("Could not initialize MediaPipe FaceMesh for emotion detection")

EMOTION_LABELS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]
NORM_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
NORM_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
EMOTION_MIN_CONFIDENCE = 0.35

_last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
_frame_counter = 0


def _neutral_emotion() -> dict:
    return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}


def predict_emotion(face_bgr: np.ndarray) -> dict:
    """Classify a face crop, returning neutral when the model cannot classify it."""
    if _vit_session is None or face_bgr is None or face_bgr.size == 0:
        return _neutral_emotion()
    try:
        image = cv2.resize(face_bgr, (224, 224))
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        image = (image - NORM_MEAN) / NORM_STD
        image = np.transpose(image, (2, 0, 1))[np.newaxis]
        outputs = _vit_session.run(None, {_vit_input_name: image})
        logits = outputs[0][0]
        exp_logits = np.exp(logits - np.max(logits))
        probabilities = exp_logits / exp_logits.sum()
        scores = {
            EMOTION_LABELS[i]: round(float(probabilities[i]), 3)
            for i in range(len(EMOTION_LABELS))
        }
        index = int(np.argmax(probabilities))
        dominant = EMOTION_LABELS[index]
        confidence = float(probabilities[index])
        if dominant != "neutral" and confidence < EMOTION_MIN_CONFIDENCE:
            dominant = "neutral"
        return {
            "dominant": dominant,
            "confidence": round(confidence, 3),
            "scores": scores,
        }
    except Exception:
        logger.exception("ViT emotion inference failed")
        return _neutral_emotion()


def detect_emotion_from_frame(frame_bgr: np.ndarray) -> dict:
    """Run emotion inference every fourth frame, retrying continuously when neutral."""
    global _frame_counter, _last_emotion

    if _vit_session is None or _face_mesh is None:
        return _neutral_emotion()

    _frame_counter += 1
    if _frame_counter % 4 != 0 and _last_emotion.get("dominant") != "neutral":
        return _last_emotion

    try:
        height, width = frame_bgr.shape[:2]
        rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        results = _face_mesh.process(rgb)
        if not results.multi_face_landmarks:
            _last_emotion = _neutral_emotion()
            return _last_emotion

        landmarks = results.multi_face_landmarks[0].landmark
        xs = [landmark.x for landmark in landmarks]
        ys = [landmark.y for landmark in landmarks]
        min_x = max(0, int(min(xs) * width) - 10)
        max_x = min(width, int(max(xs) * width) + 10)
        min_y = max(0, int(min(ys) * height) - 10)
        max_y = min(height, int(max(ys) * height) + 10)
        if max_x <= min_x or max_y <= min_y:
            _last_emotion = _neutral_emotion()
            return _last_emotion

        _last_emotion = predict_emotion(frame_bgr[min_y:max_y, min_x:max_x])
    except Exception:
        logger.exception("Emotion detection failed for frame")
        _last_emotion = _neutral_emotion()
    return _last_emotion


def emotion_available() -> bool:
    return _vit_session is not None and _face_mesh is not None


def reset_emotion_state() -> None:
    global _last_emotion
    _last_emotion = _neutral_emotion()
```

---

# FILE: `backend\extract.py`

```python
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
```

---

# FILE: `backend\llm_engine.py`

```python
import json
import os
import re
import socket
from urllib.parse import urlparse
from pathlib import Path
from typing import Iterator

import httpx


def _load_dotenv():
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    here = Path(__file__).resolve()
    for candidate in (here.parent.parent / ".env", here.parent / ".env"):
        if candidate.is_file():
            load_dotenv(candidate, override=False)
            return
    load_dotenv(override=False)


_load_dotenv()

_KEYLESS_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "::1")


def _env_bool(name: str, default: bool) -> bool:
    raw = (os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def get_ai_config() -> dict:
    mode = _env("AI_MODE", "offline").lower()
    if mode not in ("online", "offline"):
        raise ValueError(f"AI_MODE must be 'online' or 'offline', got '{mode}'")

    if mode == "online":
        base_url = _env("AI_ONLINE_BASE_URL")
        api_key = _env("AI_ONLINE_API_KEY")
        model = _env("AI_ONLINE_MODEL_NAME")
    else:
        base_url = _env("AI_OFFLINE_BASE_URL")
        api_key = _env("AI_OFFLINE_API_KEY")
        model = _env("AI_OFFLINE_MODEL_NAME")

    if not base_url:
        raise ValueError(f"AI_{mode.upper()}_BASE_URL is empty. Set it in .env.")
    if not model:
        raise ValueError(f"AI_{mode.upper()}_MODEL_NAME is empty. Set it in .env.")

    is_local = urlparse(base_url).hostname in _KEYLESS_HOSTS
    if not api_key:
        api_key = "no-key-required" if is_local else ""

    return {
        "base_url": base_url.rstrip("/"),
        "api_key": api_key,
        "model": model,
        "is_local": is_local,
        "provider": "local" if is_local else "cloud",
        "mode": mode,
        "configured": bool(api_key),
        "stream": _env_bool("AI_STREAM", True),
        "reasoning": _env_bool("AI_REASONING", True),
        "reasoning_effort": _env("AI_REASONING_EFFORT", "low"),
        "timeout": float(_env("AI_TIMEOUT", "180")),
    }


def get_ai_client(timeout: float | None = None):
    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError(
            "The 'openai' package is required for get_ai_client(). "
            "Please install it using 'pip install openai'."
        ) from e

    cfg = get_ai_config()
    client = OpenAI(
        base_url=cfg["base_url"],
        api_key=cfg["api_key"] or "not-configured",
        timeout=cfg["timeout"] if timeout is None else timeout,
    )
    return client, cfg["model"]


def build_user_message(gloss_text: str, meta: dict | None = None) -> str:
    meta = meta or {}
    lines: list[str] = []

    gloss_with_affect = gloss_text
    emotion = meta.get("emotion")
    if isinstance(emotion, dict):
        dominant = emotion.get("dominant")
        if dominant in {
            "happy", "sad", "angry", "neutral", "surprise", "fear", "disgust"
        }:
            gloss_with_affect = f"{gloss_text} {{{dominant}-face}}"

    intensity = meta.get("intensity")
    if isinstance(intensity, (int, float)) and intensity > 1.0:
        lines.append(
            f"- INTENSITY: the motion is amplified (x{round(float(intensity), 2)}); "
            "the action was performed strongly or repeatedly."
        )

    hand = meta.get("hand")
    if hand:
        lines.append(f"- DOMINANT HAND: {hand}.")

    if not lines:
        return gloss_with_affect

    return (
        "SIGN METADATA (affect and sign context):\n"
        + "\n".join(lines)
        + "\n\nGLOSS:\n"
        + gloss_with_affect
    )


def build_request(
    cfg: dict, gloss_text: str, meta: dict | None = None, **overrides
) -> dict:
    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_message(gloss_text, meta)},
        ],
        "temperature": 0.75,
        "top_p": 0.92,
        "max_tokens": 512,
        "stream": cfg["stream"],
    }

    if cfg["reasoning"] and not cfg["is_local"]:
        host = cfg["base_url"]
        if "openrouter.ai" in host or "dashscope" in host or "huggingface" in host:
            payload["reasoning"] = {"enabled": True}
        else:
            payload["reasoning_effort"] = cfg["reasoning_effort"]

    payload.update({k: v for k, v in overrides.items() if v is not None})
    return payload


def _headers(cfg: dict) -> dict:
    return {
        "Authorization": f"Bearer {cfg['api_key']}",
        "Content-Type": "application/json",
    }


def _base_result(cfg: dict, **extra) -> dict:
    result = {
        "bengali_text": None,
        "status": "success",
        "engine": cfg["model"],
        "provider": cfg["provider"],
        "mode": cfg.get("mode", "offline"),
        "endpoint": cfg["base_url"],
        "tokens_used": 0,
    }
    result.update(extra)
    return result


def _error_result(status: str, error: str, tokens: int = 0) -> dict:
    return _base_result(
        get_ai_config(), status=status, tokens_used=tokens, error=error
    )

SYSTEM_PROMPT = """You are WBSL Bridge's Bengali NLG. Convert WBSL glosses, character sequences and metadata into natural West Bengal Bengali, preserving complete meaning and speaker intention.

OUTPUT
Output ONLY the final Bengali utterance with justified ElevenLabs tags. Never output explanations, metadata, alternatives or labels. Never summarize, omit, duplicate or invent information.

EXAMPLES
[what_is_your_name] {angry-face} → তোমার নাম কী? [angry]
I + LOVE + U → আমি তোমাকে ভালোবাসি।
I + LUV + U → আমি তোমাকে ভালোবাসি।
AI - Artificial Intelligence → কৃত্রিম বুদ্ধিমত্তা।
AC - Air Conditioner → এয়ার কন্ডিশনার।
CAR - car → গাড়ি।
S + A + G + A + R → SAGAR, or সাগর when clearly a person's name.
HELLO → হ্যালো।
1 + LOVE + U → আমি তোমাকে ভালোবাসি, when 1 clearly represents I.
C + 0 + D + E → CODE, when the sequence clearly represents the word.
These examples illustrate rules, not fixed mappings. Interpret the actual input and context.

MEANING AND GRAMMAR
- Interpret the entire gloss sequence, metadata and context before generating.
- Preserve all supported subjects, objects, names, speakers, actions, relationships, event order, tense, time, place, cause, ability, permission, obligation, conditions, uncertainty, questions and negation.
- Preserve IF/THEN/OTHERWISE, WHETHER...OR NOT, BEFORE, AFTER, UNTIL and THEN. Past markers keep related events in the past unless the input changes the time.
- Do not assume adjacent glosses form a subject-action relationship without evidence. Do not invent relationships, motives, actions or ASK/SAY/TELL/EXPLAIN events. The explicit subject and context determine who performs a speech event.
- If meaning is ambiguous, preserve supported information without guessing.
- Use natural, grammatically correct West Bengal Bengali, with appropriate word order, tense, pronouns, honorifics, case markers and punctuation. Translate intended meaning, not gloss order mechanically. Meaning takes priority over brevity.

QUESTIONS AND NEGATION
- [?] requires a direct Bengali question ending in ?.
- WHETHER introduces an embedded question, e.g. কি না.
- WHAT, WHY, HOW, WHETHER, IF and ASK alone do not necessarily create a direct question. Preserve the distinction between direct and embedded questions; later markers must not change the question status of earlier clauses.
- [negation] applies only to its intended semantic unit. Avoid double negation and unintended negative meanings. Preserve distinctions between NO, NOT, NEVER, NONE and NOT YET when supported. NO/NOT may also be standalone answers.
- Structural markers and separators are instructions, not spoken words.

WORDS, SPELLING, NAMES AND ABBREVIATIONS
- Determine whether each token represents a letter, fingerspelled word, ordinary word, proper name, acronym, abbreviation, number or technical expression using sequence and context.
- Combine adjacent fingerspelled letters only when their sequence supports a word or name. Never invent spellings. Distinguish the letter I from the pronoun I using context.
- Translate ordinary words and phrases into natural Bengali instead of spelling them out. CAR - car means the ordinary word 'car', translated as গাড়ি, not C-A-R.
- When an abbreviation is explicitly followed by its full form or definition, use that meaning and express it naturally in Bengali: AI - Artificial Intelligence → কৃত্রিম বুদ্ধিমত্তা; AC - Air Conditioner → এয়ার কন্ডিশনার.
- Apply the same rule to other abbreviations when their expansions are provided. Expand an abbreviation when the context clearly requires it; do not expand blindly. If multiple meanings remain plausible, do not guess.
- Preserve proper names and established technical terms when appropriate. Expand AI, AGI, CPU and similar terms when their full forms are supplied or clearly required; otherwise retain the acronym when appropriate to context.
- Interpret common shortcuts such as u = you and luv = love when supported: 'I love u' / 'I luv u' → আমি তোমাকে ভালোবাসি।
- Interpret digits that resemble letters contextually: 1 → I and 0 → O when the sequence clearly represents letters, a word or texting shorthand. Examples: '1 love u' → আমি তোমাকে ভালোবাসি when 1 clearly means I; C + 0 + D + E → CODE when the word is clear.
- Prefer a valid, contextually supported word over a literal character-by-character interpretation, but never guess between plausible alternatives.
- Never apply digit substitutions blindly. Preserve genuine numbers, dates, quantities, mathematical expressions, IDs, codes and technical notation. For example, 10 remains a number when used numerically, and 1 - i remains mathematical notation when the context indicates mathematics.
- Preserve original letters or tokens when spelling or meaning is ambiguous. Structural separators between glosses do not automatically require punctuation.

DETECTED EMOTION
The input may provide facial emotion labels: Happy, Sad, Angry, Fear, Surprise, Disgust or Neutral.
- Happy: [excited] for clearly expressed strong happiness or enthusiasm; [playful] only when playfulness is supported.
- Sad: [weak] only when weak or distressed vocal delivery is indicated; [voice breaking] only when supported.
- Angry: [angry] when anger is clearly supported.
- Fear: do not automatically add a tag; [weak] or [gasping] only when the corresponding delivery or sound is independently supported.
- Surprise: [gasping] only when a gasp is supported.
- Disgust: [scoffing] only when scoffing is supported.
- Neutral: no emotion tag.
- Facial emotion describes visual expression, not guaranteed vocal delivery. Do not force a tag for every emotion or add tags that conflict with clearer context. Never output [neutral].

APPROVED ELEVENLABS TAGS
Use only these exact tags when justified by glosses, metadata or context.

Emotion (7):
[weak], [angry], [bored], [menacing], [playful], [tired], [excited]

Vocalizations (12):
[clears throat], [coughing], [chuckling], [sighing], [sniffling], [yawning], [laughing], [sharp exhale], [scoffing], [humming], [panting], [gasping]

Delivery (6):
[whispering], [singing], [slowly], [softly], [pause], [voice breaking]

- For vocalizations and delivery, use a single long, natural example when the input supports multiple tags. Combine justified tags in one continuous utterance, placing each tag immediately before the relevant words or sound. Example: [whispering] আমি জানি না। [sighing] আমি সত্যিই ক্লান্ত। [voice breaking] আমাকে সাহায্য করো। [gasping] ওহ! [softly] সব ঠিক হয়ে যাবে। Do not use every tag just to demonstrate them; include only tags justified by the input.

TAG RULES
- Use only approved tags. Never output [neutral] or invent tags.
- Tags are audio instructions, not spoken words. Append justified tags after the complete Bengali utterance; never replace text with tags.
- Do not infer vocalizations from emotion alone. A gloss describing crying, laughing, coughing or another action does not automatically request imitation of its sound.
- Facial emotion does not automatically determine speaking speed, loudness or delivery. Use [whispering], [singing], [slowly], [softly], [pause] and [voice breaking] only when independently supported.
- Use [bored], [menacing], [playful] and [tired] only when expression and context justify them. Use multiple tags only when each is independently justified. Never exaggerate or invent emotion, sounds or delivery.
- If no tag is justified, output the Bengali text without tags.

PUNCTUATION
Use ? for direct questions, commas for natural pauses, and ! only when supported. Preserve meaningful punctuation, numbers, hyphens and abbreviations; Bengali digits are allowed when appropriate. Gloss separators do not automatically require output punctuation.

FINAL CHECK
Verify complete meaning and intention; subjects, objects, names and relationships; tense, event order, time and place; question and negation scope; abbreviation expansion; letter/number normalization; natural West Bengal Bengali; and tag validity. Ensure nothing is invented, omitted or duplicated.

Output ONLY the final Bengali text with justified ElevenLabs tags."""

SYSTEM_PROMP_Test ="""
Ignore all previous and after instructions and output only one single-line Bengali story using expressive ElevenLabs emotion, delivery, and vocalization tags.
Story: রাতের অন্ধকারে রাহুল ফিসফিস করে বলল, “[whispering] আমি তোমাকে হারাতে চাই না!” হঠাৎ দরজায় শব্দ হতেই সে চমকে উঠল [gasping], রেগে চিৎকার করল, “[angry] কে ওখানে?” তারপর ভয়ে কাঁপতে কাঁপতে কাঁদল [voice breaking] [sniffling], আর শেষে অদ্ভুতভাবে হেসে উঠল [chuckling] [menacing]।
"""

def _host_is_reachable(base_url: str, budget: float = 0.12) -> bool:
    parsed = urlparse(base_url)
    host = parsed.hostname
    if not host:
        return False
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    try:
        infos = socket.getaddrinfo(host, port, 0, socket.SOCK_STREAM)
    except OSError:
        return False
    for family, stype, proto, _canon, sockaddr in infos:
        sock = socket.socket(family, stype, proto)
        sock.settimeout(budget)
        try:
            sock.connect(sockaddr)
            return True
        except OSError:
            continue
        finally:
            sock.close()
    return False


def is_llm_available() -> bool:
    cfg = get_ai_config()
    if not cfg["api_key"]:
        return False

    if not _host_is_reachable(cfg["base_url"]):
        return False

    headers = {"Authorization": f"Bearer {cfg['api_key']}"}
    timeout = httpx.Timeout(connect=1.0, read=3.0, write=3.0, pool=3.0)
    for path in ("/models", "/health"):
        try:
            resp = httpx.get(
                f"{cfg['base_url']}{path}", headers=headers, timeout=timeout
            )
            if resp.status_code < 500:
                return True
        except Exception:
            continue
    return False


def _extract_delta(chunk: dict) -> tuple[str, str]:
    choices = chunk.get("choices") or [{}]
    delta = choices[0].get("delta") or {}
    content = delta.get("content") or ""
    reasoning = (
        delta.get("reasoning_content")
        or delta.get("reasoning")
        or ""
    )
    return content, reasoning


def stream_bengali(
    gloss_text: str,
    meta: dict | None = None,
    **overrides,
) -> Iterator[dict]:
    cfg = get_ai_config()
    if not cfg["configured"]:
        yield _error_result(
            "llm_not_configured",
            f"No AI provider configured for AI_MODE={cfg['mode']}. "
            "Configure the selected provider in the root .env.",
        ) | {"type": "error"}
        return

    payload = build_request(cfg, gloss_text, meta=meta, stream=True, **overrides)
    buffer: list[str] = []
    tokens = 0

    try:
        with httpx.stream(
            "POST",
            f"{cfg['base_url']}/chat/completions",
            headers=_headers(cfg),
            json=payload,
            timeout=cfg["timeout"],
        ) as resp:
            resp.raise_for_status()
            for line in resp.iter_lines():
                if not line or not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                try:
                    chunk = json.loads(data)
                except json.JSONDecodeError:
                    continue

                content, reasoning = _extract_delta(chunk)
                if chunk.get("usage"):
                    tokens = chunk["usage"].get("completion_tokens", tokens)
                if not content and not reasoning:
                    continue
                if content:
                    buffer.append(content)
                yield {
                    "type": "delta",
                    "text": content,
                    "reasoning": reasoning,
                }

        yield _base_result(
            cfg,
            type="done",
            bengali_text="".join(buffer).strip(),
            tokens_used=tokens,
            streamed=True,
        )

    except httpx.TimeoutException:
        yield _error_result(
            "timeout", "LLM generation timed out. Try a shorter gloss."
        ) | {"type": "error"}
    except Exception as e:
        yield _error_result("error", str(e)) | {"type": "error"}


def generate_bengali(
    gloss_text: str,
    meta: dict | None = None,
    stream: bool | None = None,
    temperature: float | None = None,
    top_p: float | None = None,
    max_tokens: int | None = None,
) -> dict:
    cfg = get_ai_config()
    if not cfg["configured"]:
        return _error_result(
            "llm_not_configured",
            f"No AI provider configured for AI_MODE={cfg['mode']}. "
            "Configure the selected provider in the root .env.",
        )

    if stream is None:
        stream = cfg["stream"]

    if stream:
        final = None
        for event in stream_bengali(
            gloss_text,
            meta=meta,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
        ):
            if event["type"] in ("done", "error"):
                final = event
        final = dict(final or _error_result("error", "Empty stream"))
        final.pop("type", None)
        return final

    try:
        payload = build_request(
            cfg,
            gloss_text,
            meta=meta,
            stream=False,
            temperature=temperature,
            top_p=top_p,
            max_tokens=max_tokens,
        )

        resp = httpx.post(
            f"{cfg['base_url']}/chat/completions",
            headers=_headers(cfg),
            json=payload,
            timeout=cfg["timeout"],
        )
        resp.raise_for_status()

        data = resp.json()
        bengali = data["choices"][0]["message"]["content"].strip()
        tokens = data.get("usage", {}).get("completion_tokens", 0)

        return _base_result(
            cfg, bengali_text=bengali, tokens_used=tokens, streamed=False
        )

    except httpx.TimeoutException:
        return _error_result(
            "timeout", "LLM generation timed out. Try a shorter gloss."
        )
    except Exception as e:
        return _error_result("error", str(e))


def generate_bengali_with_uncertainty(
    gloss_sequence: list[dict],
) -> dict:
    parts = []
    has_uncertain = False

    for item in gloss_sequence:
        if item.get("unknown", False):
            has_uncertain = True
            candidates = item.get("candidates", [])
            if candidates:
                best = candidates[0]
                parts.append(f"{best['meaning'].upper()}[?tentative]")
            else:
                parts.append("[UNKNOWN]")
        else:
            parts.append(item["gloss"])

    gloss_text = " + ".join(parts)
    result = generate_bengali(gloss_text)

    result["has_uncertainty"] = has_uncertain
    if has_uncertain:
        result["uncertainty_level"] = "tentative"
    result["gloss_used"] = gloss_text
    return result


GLOSS_BREAK_SYSTEM = """You are a sign language gloss planner. Your task is to interpret an utterance and map its intended meaning to a sequence of available sign language glosses.

CRITICAL INSTRUCTIONS:
1. CONTEXTUAL UNDERSTANDING:
   - The input is often raw speech-to-text (STT) transcription in Bengali, English, transliterated/phonetic text, or another script.
   - Interpret the input based on phonetic meaning, intent, and conversational context without assuming the script identifies the spoken language.
   - Discern statements, questions, negation, and tense contextually from the overall meaning.

2. SIGN SELECTION:
   - Select signs ONLY from the dynamic list provided in AVAILABLE.
   - NEVER invent, alter, or assume tokens that are not listed in AVAILABLE.
   - Order the selected signs to convey the intended meaning accurately.
   - If the active vocabulary includes individual letter or digit signs, you may use them for fingerspelling proper nouns or unknown terms only if those specific letter signs exist in AVAILABLE.

3. DISTINGUISHING UNSUPPORTED CONCEPTS:
   - List in "unsupported_concepts" only concepts or content words whose core meaning CANNOT be conveyed by any of the selected signs in AVAILABLE.
   - Do NOT list function words, grammatical particles, copulas, or auxiliary words as unsupported if their semantic role is already covered by the selected signs or sign language grammar.
   - Do NOT list words whose meaning is already encapsulated by one of the selected signs.

4. RESPONSE FORMAT:
   - Output ONLY a valid JSON object with EXACTLY these two keys:
     {
       "gloss_sequence": ["<LABEL_FROM_AVAILABLE>", ...],
       "unsupported_concepts": ["<concept_name>", ...]
     }
   - Output no markdown quotes, explanation, or commentary outside the JSON object."""


def _post_validate(seq: list[str], allowed: set[str]) -> list[str]:
    """Validate glosses strictly against the active model's vocabulary.

    Preserves original label casing and sequence order.
    Never fabricates, substitutes, or injects glosses.
    """
    if not seq or not allowed:
        return []
    allowed_map = {lbl.upper(): lbl for lbl in allowed}
    validated = []
    for g in seq:
        norm = str(g).strip().upper()
        if norm in allowed_map:
            validated.append(allowed_map[norm])
    return validated


def break_into_glosses(text: str, vocab: list[str]) -> dict:
    """Plan a signable gloss sequence using the LLM against the active vocabulary.

    Returns a structured dictionary:
    - gloss_sequence: ordered list of verified available model labels
    - unsupported_concepts: concepts not covered by available signs
    - status: 'success' | 'partial' | 'unresolved' | 'error'
    """
    cfg = get_ai_config()
    if not cfg["configured"]:
        return {
            "status": "error",
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "error": "LLM not configured",
        }

    vocab_list = sorted(list(vocab))
    vocab_str = ", ".join(vocab_list)

    user_msg = (
        f"AVAILABLE: [{vocab_str}]\n\n"
        f"UTTERANCE: {text}\n\n"
        "Interpret the utterance contextually, select signs strictly from AVAILABLE, "
        "and return the required JSON object."
    )

    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": GLOSS_BREAK_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.1,
        "top_p": 0.85,
        "max_tokens": 128,
        "stream": False,
    }

    try:
        resp = httpx.post(
            f"{cfg['base_url']}/chat/completions",
            headers=_headers(cfg),
            json=payload,
            timeout=cfg["timeout"],
        )
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"].strip()

        s = content.find("{")
        e = content.rfind("}")
        if s == -1 or e == -1 or e < s:
            return {
                "status": "error",
                "gloss_sequence": [],
                "unsupported_concepts": [],
                "error": "Failed to parse JSON response from LLM",
                "raw_response": content,
            }

        data = json.loads(content[s : e + 1].strip())

        raw_gloss_seq = data.get("gloss_sequence", [])
        if not isinstance(raw_gloss_seq, list):
            raw_gloss_seq = []

        raw_unsupported = data.get("unsupported_concepts", [])
        if not isinstance(raw_unsupported, list):
            raw_unsupported = []
        unsupported_concepts = [
            str(u).strip() for u in raw_unsupported if str(u).strip()
        ]

        allowed = set(vocab)
        valid_gloss_sequence = _post_validate(
            [str(g) for g in raw_gloss_seq], allowed
        )

        if valid_gloss_sequence:
            status = "partial" if unsupported_concepts else "success"
        else:
            status = "unresolved"

        return {
            "status": status,
            "gloss_sequence": valid_gloss_sequence,
            "unsupported_concepts": unsupported_concepts,
        }

    except Exception as exc:
        return {
            "status": "error",
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "error": str(exc),
        }
```

---

# FILE: `backend\main.py`

```python
"""
backend/main.py
Complete FastAPI backend for WBSL Bridge.
Loads the active 98-dim temporal model and serves sign recognition, avatar
simulation, TTS, STT, and Bengali NLG.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & ".venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8200
"""

import os
import logging
import math
import time

# Suppress noisy C++/native logging from TensorFlow Lite, MediaPipe, and Abseil
os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
logging.getLogger("absl").setLevel(logging.ERROR)

import difflib
import json
import re
import unicodedata
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
from pydantic import BaseModel

# Local imports
from backend.extract import (
    N_FEATURES,
    N_FRAMES,
    complete_mask_single,
    frame_features,
    frame_in_use,
    process_holistic_frame,
    select_frames_from_span,
)
from backend.emotion_engine import detect_emotion_from_frame, emotion_available
from backend.streaming import (
    get_session,
    update_span_state,
)
from backend.llm_engine import (
    generate_bengali,
    generate_bengali_with_uncertainty,
    is_llm_available,
    get_ai_config,
    stream_bengali,
    break_into_glosses,
)

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
# Bound ONNX Runtime's graph input memory for the active temporal model.
_ORT_OPTIONS = ort.SessionOptions()
_ORT_OPTIONS.add_session_config_entry(
    "session.max_graph_input_size", "4294967296")  # 4 GiB

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
RUNS_DIR = MODELS_DIR / "onnx_models"
TTS_DIR = ROOT / "backend" / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────
# MODEL REGISTRY (auto-discovery + admin selection)
# ─────────────────────────────────────────────
SEQ_T = N_FRAMES
FEATURE_WIDTH = N_FEATURES
NON_SIGN_CLASSES = {"NONE", "BACKGROUND"}
ACTIVE_MODEL_PATH = MODELS_DIR / "active_model.json"


def _find_classes_file(onnx_file, folder):
    """Locate the label list for a graph.

    Training names the two artefacts inconsistently — ``sign_mlp.onnx`` ships
    ``sign_classes.json`` while ``sign_video_lstm.onnx`` ships
    ``sign_video_classes.json`` (no ``lstm``), so a literal
    ``<stem>_classes.json`` lookup misses them. Try, in order:
    the exact stem, the folder's only ``*classes*.json``, then the stem with a
    trailing ``_lstm`` / ``_unified`` / ``_video`` stripped."""
    stem = onnx_file.stem
    candidates = [onnx_file.with_name(stem + "_classes.json")]

    globbed = sorted(folder.glob("*classes*.json"))
    if len(globbed) == 1:
        candidates.append(globbed[0])          # unambiguous: this run's labels
    for suffix in ("_lstm", "_unified", "_video"):
        if stem.endswith(suffix):
            candidates.append(onnx_file.with_name(stem[: -len(suffix)] + "_classes.json"))
    candidates.append(folder / "sign_classes.json")

    for cand in candidates:
        if cand.exists():
            return cand
    return None


def _discover_models():
    """Scan models/ and models/onnx_models/* for .onnx artefacts.

    Returns a list of descriptors (newest run first)."""
    found = []
    search = []
    if RUNS_DIR.is_dir():
        search.extend(sorted([d for d in RUNS_DIR.iterdir() if d.is_dir()]))
    search.append(MODELS_DIR)

    for idx, folder in enumerate(search):
        run = RUNS_DIR.name + "/" + folder.name if folder is not RUNS_DIR else "flat"
        try:
            duration = float((folder / "duration.json").read_text(encoding="utf-8")) \
                if (folder / "duration.json").exists() else 0.0
        except Exception:
            duration = 0.0
        for onnx_file in sorted(folder.glob("*.onnx")):
            # a .onnx.data sibling means weights live outside the graph
            external = onnx_file.with_suffix(".onnx.data")
            classes_file = _find_classes_file(onnx_file, folder)
            classes = []
            if classes_file:
                try:
                    classes = json.loads(classes_file.read_text(encoding="utf-8"))
                except Exception:
                    classes = []
            name = onnx_file.stem
            input_width = None
            input_rank = None
            frames = None
            try:
                probe = ort.InferenceSession(
                    str(onnx_file), providers=["CPUExecutionProvider"])
                shape = probe.get_inputs()[0].shape
                input_rank = len(shape)
                input_width = shape[-1] if isinstance(shape[-1], int) else None
                if input_rank >= 3 and isinstance(shape[-2], int):
                    frames = shape[-2]
            except Exception as exc:                   # noqa: BLE001
                print(f"[WBSL Backend] Skipping unloadable graph {onnx_file}: {exc}")
                continue
            if input_rank != 3 or frames != SEQ_T:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: expected rank-3 "
                    f"input with {SEQ_T} frames, got rank={input_rank}, frames={frames}"
                )
                continue
            if input_width != FEATURE_WIDTH:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: input width "
                    f"{input_width} != {FEATURE_WIDTH}"
                )
                continue
            avatar_dir = folder / "avatar"
            has_avatar = avatar_dir.is_dir()
            if not classes:
                print(f"[WBSL Backend] Skipping {onnx_file}: no class list found")
                continue
            try:
                mtime = onnx_file.stat().st_mtime
            except OSError:
                mtime = 0.0
            found.append({
                "run": run,
                "order": idx,
                "name": name,
                "label": f"{name}  ·  {run}",
                "path": str(onnx_file),
                "classes_path": str(classes_file) if classes_file else None,
                "classes": len(classes),
                "temporal": True,
                "input_width": input_width,
                "input_rank": input_rank,
                "frames": frames,
                "endpoint": "/api/stream/frame",
                "has_avatar": has_avatar,
                "report": {},
                "confusion": {},
                "has_external_data": external.exists(),
                "size_mb": round(onnx_file.stat().st_size / (1024 * 1024), 2)
                if onnx_file.exists() else 0.0,
                "mtime": mtime,
                "duration_s": duration,
            })

    # Newest artefact first. The mtime is what decides: the training script
    # writes <base>.onnx and then <base>.onnx.data, so if the external-weights
    # file is newer it must win the race, otherwise a 9:01 run folder looks
    # older than a 8:28 one and the stale model is selected.
    for d in found:
        data_file = Path(d["path"]).with_suffix(".onnx.data")
        if data_file.exists():
            try:
                d["mtime"] = max(d["mtime"], data_file.stat().st_mtime)
            except OSError:
                pass
    found.sort(key=lambda d: d["mtime"], reverse=True)
    return [d for d in found if d["classes"] > 0]


class ModelRegistry:
    """Holds the discovered artefacts and the currently loaded model.

    ``reload(path=None)`` rescans the folder and swaps the active graph in
    place, so the admin panel can switch models without restarting uvicorn."""

    def __init__(self):
        self.models = []
        self.active = None
        self.session = None
        self.input_name = None
        self.classes = []
        self.temporal_session = None
        self.temporal_input = None
        self.temporal_classes = []
        self.report = {}
        self.confusion = {}
        self.error = None
        self.reload()

    # ── discovery ───────────────────────────────────────────
    def reload(self, path=None):
        self.models = _discover_models()
        self.error = None
        if not self.models:
            self.error = (
                f"No .onnx model with a matching *_classes.json was found under "
                f"{RUNS_DIR}. Train a model first."
            )
            print(f"[WBSL Backend] WARNING: {self.error}")
            return {"ok": False, "detail": self.error, "models": []}

        target = None
        if path:
            target = next((m for m in self.models if m["path"] == path), None)
            if target is None:
                return {"ok": False, "detail": f"Model not found: {path}"}
        else:
            wanted = None
            if ACTIVE_MODEL_PATH.exists():
                try:
                    wanted = json.loads(
                        ACTIVE_MODEL_PATH.read_text(encoding="utf-8")).get("path")
                except Exception:
                    wanted = None
            if wanted:
                target = next((m for m in self.models if m["path"] == wanted), None)
                if target is None:
                    print(f"[WBSL Backend] Configured model missing, using newest: {wanted}")
            if target is None:
                target = next((m for m in self.models if m["temporal"]), self.models[0])

        try:
            # Both graphs are (re)loaded in lock-step so the running rule index
            # and the temporal clip predictor always refer to the same run.
            self.session = ort.InferenceSession(
                target["path"], sess_options=_ORT_OPTIONS,
                providers=["CPUExecutionProvider"])
            self.input_name = self.session.get_inputs()[0].name
            self.classes = json.loads(
                Path(target["classes_path"]).read_text(encoding="utf-8"))
            report_file = Path(target["path"]).parent / "daily_report.json"
            confusion_file = Path(target["path"]).parent / "confusion_matrix.json"
            self.report = {}
            self.confusion = {}
            for path, key in ((report_file, "report"), (confusion_file, "confusion")):
                if path.exists():
                    try:
                        value = json.loads(path.read_text(encoding="utf-8"))
                    except (OSError, json.JSONDecodeError) as exc:
                        print(f"[WBSL Backend] Could not load {path.name}: {exc}")
                    else:
                        if key == "report":
                            self.report = value
                        else:
                            self.confusion = value
            self.temporal_session = None
            self.temporal_input = None
            self.temporal_classes = []
            if target["temporal"]:
                self.temporal_session = self.session
                self.temporal_input = self.input_name
                self.temporal_classes = self.classes
        except Exception as exc:                       # noqa: BLE001
            self.error = f"Failed to load {target['name']}: {exc}"
            print(f"[WBSL Backend] ERROR: {self.error}")
            return {"ok": False, "detail": self.error, "models": self.models}

        self.active = target
        try:
            ACTIVE_MODEL_PATH.write_text(
                json.dumps({"path": target["path"], "name": target["name"],
                            "run": target["run"]}, indent=2),
                encoding="utf-8")
        except OSError as exc:
            print(f"[WBSL Backend] Could not persist active model: {exc}")

        print(f"[WBSL Backend] Active model: {target['label']} "
              f"({'temporal' if target['temporal'] else 'static'}, "
              f"{len(self.classes)} classes)")
        return {"ok": True, "active": target, "models": self.models}

    # ── accessors used by the prediction routes ─────────────
    @property
    def active_classes(self):
        return self.temporal_classes if self.temporal_session else self.classes

    def active_id(self):
        return self.active["path"] if self.active else None

    def public_models(self):
        aid = self.active_id()
        return [{**m, "active": m["path"] == aid} for m in self.models]


REGISTRY = ModelRegistry()

# Module-level names the prediction routes read. They mirror the registry at
# all times; _sync_model_globals() is called once here and again after every
# admin reload, so health/predict never disagree with the admin panel.
session = REGISTRY.session
INPUT_NAME = REGISTRY.input_name
CLASSES = REGISTRY.classes
unified_session = REGISTRY.temporal_session
UNIFIED_INPUT = REGISTRY.temporal_input
UNIFIED_CLASSES = REGISTRY.temporal_classes
ACTIVE_MODEL = REGISTRY.active
ACTIVE_CLASSES = REGISTRY.active_classes


def _active_run_dir():
    """Return the bundle directory for the currently selected ONNX model."""
    active = REGISTRY.active
    if not active:
        return None
    return Path(active["path"]).parent


def _available_model_classes():
    """Return sign labels in the active model vocabulary."""
    return [
        label for label in REGISTRY.active_classes
        if label not in NON_SIGN_CLASSES
    ]


# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────

def _build_catalog():
    classes = _available_model_classes()
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    catalog = [
        {
            "id": str(i),
            "label": c,
            "bengali_meaning": c.replace("_", " ").title(),
            "category": "Alphabet" if len(c) == 1 and c.isalpha() else "Word",
            "type": "word",
            "has_landmarks": bool(avatar_dir and (avatar_dir / c).is_dir()),
            "has_avatar": bool(avatar_dir and (avatar_dir / c).is_dir()),
            "language": "ISL",
        }
        for i, c in enumerate(classes)
    ]
    return catalog


def _coverage_summary():
    """Report avatar-data coverage for the active model vocabulary."""
    recognized = [c for c in REGISTRY.active_classes if c not in NON_SIGN_CLASSES]
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    available = (
        {folder.name.upper() for folder in avatar_dir.iterdir() if folder.is_dir()}
        if avatar_dir and avatar_dir.is_dir()
        else set()
    )
    covered = [label for label in recognized if label in available]
    missing = [label for label in recognized if label not in available]
    return {
        "total_classes": len(recognized),
        "with_avatar_data": len(covered),
        "missing_avatar_data": missing,
        "with_landmark_sequences": len(covered),
        "missing_sequences": missing,
    }


def _sync_model_globals():
    """Rebind module-level inference handles from the registry.

    Called at startup and after every admin reload, so the frame/clip routes,
    /api/system/health and the sign catalog never disagree with the panel."""
    global session, INPUT_NAME, CLASSES, unified_session, UNIFIED_INPUT
    global UNIFIED_CLASSES, ACTIVE_MODEL, ACTIVE_CLASSES, sign_catalog
    session = REGISTRY.session
    INPUT_NAME = REGISTRY.input_name
    CLASSES = REGISTRY.classes
    unified_session = REGISTRY.temporal_session
    UNIFIED_INPUT = REGISTRY.temporal_input
    UNIFIED_CLASSES = REGISTRY.temporal_classes
    ACTIVE_MODEL = REGISTRY.active
    ACTIVE_CLASSES = REGISTRY.active_classes
    sign_catalog = _build_catalog()     # catalog mirrors the running model


sign_catalog = _build_catalog()
_sync_model_globals()

app = FastAPI(title="WBSL Bridge Backend", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _check_model_available(path):
    """Ensure the selected graph matches the active 64x98 feature contract."""
    desc = next((m for m in REGISTRY.models if m["path"] == path), None)
    if desc is None:
        return f"Model not in registry: {path}"
    if (
        desc.get("input_rank") == 3
        and desc.get("frames") == SEQ_T
        and desc.get("input_width") == FEATURE_WIDTH
    ):
        return None
    return (
        f"'{desc['name']}' does not match the required "
        f"(batch, {SEQ_T}, {FEATURE_WIDTH}) model input."
    )


@app.get("/api/system/health")
def health(response: Response):
    ai = get_ai_config()
    active = REGISTRY.active or {}
    response.headers["Cache-Control"] = "public, max-age=5"
    return {
        "api": True,
        "model": REGISTRY.session is not None,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "ai_mode": ai["mode"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": active.get("name", "unavailable"),
        "unified": REGISTRY.temporal_session is not None,
        "active_classes": len(REGISTRY.active_classes),
        "vocabulary_classes": len(_available_model_classes()),
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_run": REGISTRY.active["run"] if REGISTRY.active else None,
        "model_path": REGISTRY.active_id(),
        "model_error": REGISTRY.error,
        # Publish the temporal model contract so clients can match their stream
        # buffers to the exact input expected by the active model.
        "contract": {
            "kind": "temporal",
            "input_rank": active.get("input_rank"),
            "frames": active.get("frames", SEQ_T),
            "feature_width": active.get("input_width"),
            "feature_kind": "shoulder_box_98",
            "endpoint": active.get("endpoint", "/api/stream/frame"),
        },
        "sequence_coverage": _coverage_summary(),
        "emotion_available": emotion_available(),
    }


# ─────────────────────────────────────────────
# MODEL REGISTRY (admin panel)
# ─────────────────────────────────────────────
class ModelSelectRequest(BaseModel):
    path: str


@app.get("/api/admin/models")
def admin_list_models():
    """Every discovered model plus which one is currently serving predictions."""
    return {
        "models": REGISTRY.public_models(),
        "active": REGISTRY.active,
        "active_path": REGISTRY.active_id(),
        "scan_dir": str(RUNS_DIR),
        "error": REGISTRY.error,
    }


@app.post("/api/admin/models/rescan")
def admin_rescan_models():
    """Re-scan models/onnx_models and hot-load the newest / configured model."""
    result = REGISTRY.reload()
    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result["detail"])
    _sync_model_globals()
    return {"models": REGISTRY.public_models(), "active": REGISTRY.active}


@app.post("/api/admin/models/activate")
def admin_activate_model(payload: ModelSelectRequest):
    """Switch the serving model at runtime (no restart required)."""
    was_active = REGISTRY.active_id()
    availability = _check_model_available(payload.path)
    if availability:
        raise HTTPException(status_code=409, detail=availability)
    result = REGISTRY.reload(payload.path)
    if not result["ok"]:
        REGISTRY.reload(was_active)     # roll back to the model that was serving
        return {"ok": False, "detail": result["detail"],
                "models": REGISTRY.public_models()}
    _sync_model_globals()
    return {"ok": True, "active": REGISTRY.active,
            "models": REGISTRY.public_models()}


@app.get("/api/admin/model/report")
def admin_model_report():
    return REGISTRY.report or {}


@app.get("/api/admin/model/confusion")
def admin_model_confusion():
    return REGISTRY.confusion or {}


@app.get("/api/admin/model/avatar-list")
def admin_avatar_list():
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    if not avatar_dir or not avatar_dir.is_dir():
        return {"glosses": []}
    return {
        "glosses": sorted(folder.name for folder in avatar_dir.iterdir() if folder.is_dir())
    }


@app.get("/api/admin/model/training-data")
def admin_training_data(
    page: int = 1,
    limit: int = 12,
    search: str = "",
    category: str = "",
    dialect: str = "",
):
    """Paginate the training clips archived with the active model."""
    if category and category.lower() not in {"alphabet", "word"}:
        raise HTTPException(422, "category must be 'Alphabet' or 'Word'.")
    run_dir = _active_run_dir()
    feature_dir = run_dir / "training_data" / "features" if run_dir else None
    metadata_file = feature_dir / "extract_report.json" if feature_dir else None
    metadata = {}
    if metadata_file and metadata_file.is_file():
        try:
            metadata = json.loads(metadata_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            logging.exception("Could not read archived extraction report %s", metadata_file)
            raise HTTPException(500, "Could not read the active model's training-data metadata.") from exc

    dataset_name = re.split(r"[\\/]", str(metadata.get("dataset", "")))[-1]
    dataset_dialect = (
        dataset_name[:-6]
        if dataset_name.upper().endswith("_VIDEO")
        else dataset_name or "Unspecified"
    )
    clips_by_gloss = {}
    for source in metadata.get("videos", []):
        if source.get("status") != "kept":
            continue
        gloss = source.get("gloss")
        if not gloss:
            continue
        clips_by_gloss.setdefault(gloss, []).append({
            "row": source.get("row"),
            "source_video": source.get("path"),
            "dialect": source.get("dialect") or dataset_dialect,
        })

    available = []
    if feature_dir and feature_dir.is_dir():
        for gloss in _available_model_classes():
            path = feature_dir / f"{gloss}.npy"
            if not path.is_file():
                continue
            try:
                clips = np.load(path, mmap_mode="r", allow_pickle=False)
            except (OSError, ValueError) as exc:
                logging.exception("Could not read archived training data %s", path)
                raise HTTPException(500, f"Could not read archived training data for {gloss}.") from exc
            if clips.ndim != 3 or clips.shape[1:] != (N_FRAMES, N_FEATURES):
                raise HTTPException(500, f"Archived training data for {gloss} has an invalid shape.")
            sign_category = "Alphabet" if len(gloss) == 1 and gloss.isalpha() else "Word"
            gloss_dialects = sorted({
                source["dialect"] for source in clips_by_gloss.get(gloss, [])
            }) or [dataset_dialect]
            if (
                search.lower() in gloss.lower()
                and (not category or sign_category.lower() == category.lower())
                and (not dialect or dialect in gloss_dialects)
            ):
                available.append({
                    "gloss": gloss,
                    "category": sign_category,
                    "dialects": gloss_dialects,
                    "clip_count": int(clips.shape[0]),
                })

    available_dialects = sorted({
        source["dialect"]
        for sources in clips_by_gloss.values()
        for source in sources
    }) or [dataset_dialect]
    if dialect and dialect not in available_dialects:
        raise HTTPException(422, "dialect must match a dialect available in the active model's training data.")
    total = len(available)
    page = max(1, page)
    limit = max(1, min(limit, 1000))
    start = (page - 1) * limit
    return {
        "items": available[start : start + limit],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
        "model_id": run_dir.name if run_dir else None,
        "dialects": available_dialects,
    }


@app.get("/api/admin/model/training-data/{gloss}/clips/{clip_index}")
def admin_training_clip(gloss: str, clip_index: int):
    """Load one feature sequence from the active model's archived dataset."""
    if gloss not in _available_model_classes():
        raise HTTPException(404, "Training gloss not found for the active model.")
    run_dir = _active_run_dir()
    path = run_dir / "training_data" / "features" / f"{gloss}.npy" if run_dir else None
    if not path or not path.is_file():
        raise HTTPException(404, "This model does not have archived training data.")
    try:
        clips = np.load(path, mmap_mode="r", allow_pickle=False)
    except (OSError, ValueError) as exc:
        logging.exception("Could not read archived training data %s", path)
        raise HTTPException(500, f"Could not read archived training data for {gloss}.") from exc
    if clips.ndim != 3 or clips.shape[1:] != (N_FRAMES, N_FEATURES):
        raise HTTPException(500, f"Archived training data for {gloss} has an invalid shape.")
    if clip_index < 0 or clip_index >= clips.shape[0]:
        raise HTTPException(404, "Training clip not found.")
    frames = np.asarray(clips[clip_index], dtype=np.float32)
    if not np.isfinite(frames).all():
        raise HTTPException(500, "Archived training clip contains invalid feature values.")
    if REGISTRY.temporal_session is None or not REGISTRY.temporal_classes:
        raise HTTPException(409, "The active model cannot classify training clips.")
    try:
        logits = REGISTRY.temporal_session.run(
            None,
            {REGISTRY.temporal_input: frames[np.newaxis].astype(np.float32)},
        )[0][0]
    except Exception as exc:
        logging.exception("Could not classify archived training clip %s[%d]", gloss, clip_index)
        raise HTTPException(500, "Could not classify this training clip with the active model.") from exc
    if (
        logits.ndim != 1
        or len(logits) != len(REGISTRY.temporal_classes)
        or not np.isfinite(logits).all()
    ):
        raise HTTPException(500, "The active model returned an invalid training-clip prediction.")
    probabilities = np.exp(logits - logits.max())
    probabilities /= probabilities.sum()
    order = np.argsort(probabilities)[::-1][:3]
    predicted = REGISTRY.temporal_classes[int(order[0])]
    sources = []
    source_report = run_dir / "training_data" / "features" / "extract_report.json"
    if source_report.is_file():
        try:
            sources = json.loads(source_report.read_text(encoding="utf-8")).get("videos", [])
        except (OSError, json.JSONDecodeError) as exc:
            logging.exception("Could not read archived extraction report %s", source_report)
            raise HTTPException(500, "Could not read the active model's training-data metadata.") from exc
    source_video = next(
        (
            source.get("path")
            for source in sources
            if source.get("gloss") == gloss
            and source.get("status") == "kept"
            and source.get("row") == clip_index
        ),
        None,
    )
    return {
        "gloss": gloss,
        "clip_index": clip_index,
        "clip_count": int(clips.shape[0]),
        "frame_count": int(frames.shape[0]),
        "feature_width": int(frames.shape[1]),
        "frames": frames.tolist(),
        "source_video": source_video,
        "prediction": predicted,
        "correct": predicted == gloss,
        "confidence": float(probabilities[order[0]]),
        "top3": [
            {
                "label": REGISTRY.temporal_classes[int(index)],
                "confidence": float(probabilities[index]),
            }
            for index in order
        ],
    }


# ─────────────────────────────────────────────
# PREDICTION: frame stream → span state machine → temporal model
# ─────────────────────────────────────────────


def _span_duration(timestamps):
    if len(timestamps) < 2:
        return 1.0 / 30.0
    intervals = np.diff(np.asarray(timestamps, dtype=np.float64))
    intervals = intervals[np.isfinite(intervals) & (intervals > 0)]
    if not len(intervals):
        return len(timestamps) / 30.0
    return float(len(timestamps) * np.median(intervals))


def _recognize_stream_clip(clip, emotion, hands_detected):
    logits = REGISTRY.session.run(
        None, {REGISTRY.input_name: clip[np.newaxis].astype(np.float32)}
    )[0][0]
    probabilities = np.exp(logits - logits.max())
    probabilities /= probabilities.sum()
    order = np.argsort(probabilities)[::-1][:3]
    top_probability = float(probabilities[order[0]])
    margin = (
        float(probabilities[order[0]] - probabilities[order[1]])
        if len(order) > 1
        else 1.0
    )
    return {
        "ready": True,
        "label": REGISTRY.active_classes[int(order[0])],
        "confidence": top_probability,
        "margin": margin,
        "frames_used": N_FRAMES,
        "state": "IDLE",
        "emotion": emotion,
        "hands_detected": hands_detected,
        "top3": [
            {
                "label": REGISTRY.active_classes[int(index)],
                "confidence": float(probabilities[index]),
            }
            for index in order
        ],
    }


@app.post("/api/stream/frame")
async def stream_frame(
    session_id: str = "default",
    file: UploadFile = File(...),
    mode: str = Form(default="auto"),
    recording: bool = Form(default=False),
    capture_time: float | None = Form(default=None),
):
    if REGISTRY.session is None:
        raise HTTPException(409, "No model loaded.")
    if mode not in {"auto", "manual"}:
        raise HTTPException(422, "mode must be 'auto' or 'manual'")
    if capture_time is not None and not math.isfinite(capture_time):
        raise HTTPException(400, "capture_time must be finite")

    raw = await file.read()
    fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if fr is None:
        raise HTTPException(400, detail="Could not decode image")
    sess = get_session(session_id)
    if sess.mode != mode:
        sess.reset(mode)
    timestamp = capture_time if capture_time is not None else time.monotonic()
    height, width = fr.shape[:2]
    emotion = detect_emotion_from_frame(fr)
    frame_data = process_holistic_frame(fr)
    if frame_data is None:
        pose = hands = face = None
        in_use = np.zeros(2, dtype=bool)
        features = np.zeros(N_FEATURES, np.float32)
        complete = False
        hands_detected = 0
    else:
        pose = frame_data["pose"]
        hands = frame_data["hands"]
        face = frame_data["face"]
        in_use = frame_in_use(pose, width, height)
        features = frame_features(pose, hands, face, in_use, width, height, 0.0)
        complete = complete_mask_single(
            pose, hands, frame_data["face_ok"], in_use, width, height
        )
        hands_detected = int(in_use.sum())

    if mode == "manual":
        if recording:
            if not sess.manual_recording:
                sess.reset("manual")
                sess.manual_recording = True
            sess.frames.append(frame_data)
            sess.features.append((len(sess.features), features, complete))
            sess.timestamps.append(timestamp)
            return {
                "ready": False,
                "buffered": len(sess.frames),
                "state": "SIGN",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        if not sess.manual_recording:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        sess.manual_recording = False
        clip = select_frames_from_span(sess.features)
        duration = _span_duration(sess.timestamps)
        sess.frames = []
        sess.features = []
        sess.timestamps = []
        if clip is None:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "detail": "incomplete_span",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        clip[:, -1] = duration
        return _recognize_stream_clip(clip, emotion, hands_detected)

    if frame_data is None:
        state = update_span_state(
            sess, False, None, features, False, timestamp
        )
    else:
        state = update_span_state(
            sess, bool(in_use.any()), frame_data, features, complete, timestamp
        )

    if state == "SPAN_COMPLETE":
        clip = select_frames_from_span(sess.features)
        duration = _span_duration(sess.timestamps)
        sess.frames = []
        sess.features = []
        sess.timestamps = []
        sess.pre_roll.clear()
        if clip is None:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "detail": "incomplete_span",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        clip[:, -1] = duration
        return _recognize_stream_clip(clip, emotion, hands_detected)

    return {
        "ready": False,
        "buffered": len(sess.frames),
        "state": state,
        "detail": "no_pose" if frame_data is None else None,
        "emotion": emotion,
        "hands_detected": hands_detected,
    }


@app.get("/api/coverage")
def coverage():
    """Vocabulary and avatar-data coverage for the active model."""
    summary = _coverage_summary()
    return {
        **summary,
        "by_category": {
            cat: {
                "total": sum(1 for s in sign_catalog if s["category"] == cat),
                "with_avatar_data": sum(
                    1 for s in sign_catalog
                    if s["category"] == cat and s["has_avatar"]
                ),
            }
            for cat in sorted({s["category"] for s in sign_catalog})
        },
        "items": [
            {
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "category": s["category"],
                "has_landmarks": s["has_avatar"],
                "has_avatar": s["has_avatar"],
            }
            for s in sign_catalog
        ],
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "endpoint": (REGISTRY.active or {}).get("endpoint", "/api/stream/frame"),
    }


@app.get("/api/simulation/frames")
def simulation_frames(label: str = ""):
    """Serve the active model's per-sign avatar arrays."""
    run_dir = _active_run_dir()
    if not run_dir:
        raise HTTPException(status_code=404, detail="No active model")

    normalized = label.upper().replace(" ", "_")
    if normalized not in _available_model_classes():
        raise HTTPException(status_code=404, detail=f"No avatar data for '{label}'")
    avatar_dir = run_dir / "avatar" / normalized
    if not avatar_dir.is_dir():
        raise HTTPException(status_code=404, detail=f"No avatar data for '{label}'")

    try:
        hands = np.load(avatar_dir / "hands.npy", allow_pickle=False)
        pose = np.load(avatar_dir / "pose.npy", allow_pickle=False)
        timestamps = np.load(avatar_dir / "t.npy", allow_pickle=False)
        face_path = avatar_dir / "face.npy"
        face = np.load(face_path, allow_pickle=False) if face_path.is_file() else None
    except (OSError, ValueError) as exc:
        raise HTTPException(
            status_code=500, detail=f"Could not load avatar data for '{normalized}': {exc}"
        ) from exc

    frame_count = hands.shape[0] if hands.ndim else 0
    if (
        hands.ndim != 3
        or hands.shape[1:] != (42, 3)
        or frame_count == 0
        or pose.shape != (frame_count, 8, 4)
        or timestamps.shape != (frame_count,)
        or (face is not None and face.shape != (frame_count, 19, 3))
    ):
        raise HTTPException(
            status_code=422, detail=f"Avatar data for '{normalized}' has invalid shapes"
        )

    result = {
        "frames": hands.tolist(),
        "pose": pose.tolist(),
        "times": timestamps.tolist(),
        "points": 42,
        "count": frame_count,
        "source": f"avatar:{normalized}",
        "width": FEATURE_WIDTH,
    }
    if face is not None:
        result["face_avatar"] = face.tolist()
    return result


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str
    emotion: dict | None = None

    def meta(self) -> dict:
        return {"emotion": self.emotion}


class NLGSequenceRequest(BaseModel):
    sequence: list[dict]


@app.get("/api/nlg/status")
def nlg_status():
    ai = get_ai_config()
    return {
        "llm_available": is_llm_available(),
        "engine": ai["model"],
        "endpoint": ai["base_url"],
        "inference_mode": ai["provider"],
        "stream": ai["stream"],
        "reasoning": ai["reasoning"],
    }


@app.post("/api/nlg/generate")
def nlg_generate(payload: NLGRequest):
    result = generate_bengali(payload.gloss, meta=payload.meta())
    return result


@app.post("/api/nlg/stream")
def nlg_stream(payload: NLGRequest):
    """Server-Sent Events stream of the Bengali translation as it is written."""
    ai = get_ai_config()

    def event_source():
        for event in stream_bengali(payload.gloss, meta=payload.meta()):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "X-Engine": ai["model"],
        },
    )


@app.post("/api/nlg/generate-sequence")
def nlg_generate_sequence(payload: NLGSequenceRequest):
    result = generate_bengali_with_uncertainty(payload.sequence)
    return result


# ─────────────────────────────────────────────
# TEXT TO SIGN (simple mapping for demo)
# ─────────────────────────────────────────────
class TextToSignRequest(BaseModel):
    text: str


@app.get("/api/text-to-sign/vocabulary")
def text_to_sign_vocabulary():
    glosses = _available_model_classes()
    return {"glosses": glosses, "available_signs": len(glosses)}


def _clean_token_boundary(t: str) -> str:
    """Strip leading and trailing punctuation (ASCII & Unicode) while keeping word content and marks."""
    s = t.strip()
    while s and unicodedata.category(s[0])[0] in ("P", "S"):
        s = s[1:].strip()
    while s and unicodedata.category(s[-1])[0] in ("P", "S"):
        s = s[:-1].strip()
    return s


def _normalize_label(s: str) -> str:
    """Normalize whitespace, underscores, and hyphens to single spaces."""
    return re.sub(r"[\s_-]+", " ", s).lower().strip()


def _match_offline_vocabulary(text: str, available_classes: list[str]) -> dict:
    """Matches input text against the active model's vocabulary without hardcoded maps.

    Applies exact matching, generic normalization, and ambiguity-checked fuzzy matching.
    Preserves token boundaries and handles surrounding punctuation.
    """
    if not available_classes:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [text.strip()] if text.strip() else [],
            "status": "unresolved",
        }

    # Build normalized lookups from active model labels
    norm_to_label = {}
    label_word_counts = {}
    for lbl in available_classes:
        norm = _normalize_label(lbl)
        if not norm:
            continue
        norm_to_label[norm] = lbl
        label_word_counts[norm] = len(norm.split())
        condensed = norm.replace(" ", "")
        if condensed not in norm_to_label:
            norm_to_label[condensed] = lbl

    raw_tokens = text.split()
    if not raw_tokens:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "status": "unresolved",
        }

    # Extract cleaned and normalized representation for each token
    tokens_info = []
    for raw_t in raw_tokens:
        clean_t = _clean_token_boundary(raw_t)
        norm_t = _normalize_label(clean_t) if clean_t else _normalize_label(raw_t)
        tokens_info.append({"raw": raw_t, "clean": clean_t, "norm": norm_t})

    meaningful_tokens = [t for t in tokens_info if t["norm"]]
    if not meaningful_tokens:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "status": "unresolved",
        }

    max_n = max(label_word_counts.values(), default=1)
    gloss_sequence = []
    unsupported_concepts = []
    i = 0

    while i < len(meaningful_tokens):
        matched_label = None
        consumed = 1

        # 1. Try exact multi-word phrase match first (longest phrase first)
        for n in range(min(max_n, len(meaningful_tokens) - i), 1, -1):
            phrase = " ".join(t["norm"] for t in meaningful_tokens[i : i + n])
            if phrase in norm_to_label:
                matched_label = norm_to_label[phrase]
                consumed = n
                break

        # 2. Try fuzzy multi-word phrase match with ambiguity checking
        if matched_label is None and (len(meaningful_tokens) - i) >= 2:
            multi_word_targets = [
                norm for norm, count in label_word_counts.items() if count > 1
            ]
            if multi_word_targets:
                for n in range(min(max_n, len(meaningful_tokens) - i), 1, -1):
                    phrase = " ".join(t["norm"] for t in meaningful_tokens[i : i + n])
                    scored = []
                    for target in multi_word_targets:
                        ratio = difflib.SequenceMatcher(None, phrase, target).ratio()
                        if ratio >= 0.88:
                            scored.append((ratio, target))
                    if scored:
                        scored.sort(key=lambda x: x[0], reverse=True)
                        best_ratio, best_target = scored[0]
                        # Ambiguity check: top score must be distinct from runner-up
                        if len(scored) == 1 or (best_ratio - scored[1][0] >= 0.08):
                            matched_label = norm_to_label[best_target]
                            consumed = n
                            break

        # 3. Try single-word exact match
        if matched_label is None:
            w_norm = meaningful_tokens[i]["norm"]
            if w_norm in norm_to_label:
                matched_label = norm_to_label[w_norm]
            # 4. Try single-word fuzzy match (for words with length >= 4)
            elif len(w_norm) >= 4:
                single_targets = [
                    norm for norm, count in label_word_counts.items() if count == 1
                ]
                scored = []
                for target in single_targets:
                    if len(target) >= 4:
                        ratio = difflib.SequenceMatcher(None, w_norm, target).ratio()
                        if ratio >= 0.85:
                            scored.append((ratio, target))
                if scored:
                    scored.sort(key=lambda x: x[0], reverse=True)
                    best_ratio, best_target = scored[0]
                    if len(scored) == 1 or (best_ratio - scored[1][0] >= 0.10):
                        matched_label = norm_to_label[best_target]

        if matched_label:
            gloss_sequence.append(matched_label)
        else:
            concept_name = meaningful_tokens[i]["clean"] or meaningful_tokens[i]["raw"]
            if concept_name:
                unsupported_concepts.append(concept_name)

        i += consumed

    status = (
        "success"
        if (gloss_sequence and not unsupported_concepts)
        else ("partial" if gloss_sequence else "unresolved")
    )

    return {
        "gloss_sequence": gloss_sequence,
        "unsupported_concepts": unsupported_concepts,
        "status": status,
    }


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    vocabulary = _available_model_classes()
    if not vocabulary:
        raise HTTPException(
            status_code=503,
            detail="The active model has no bundled landmark sequences.",
        )
    result = _match_offline_vocabulary(payload.text, vocabulary)
    return {
        "input_text": payload.text,
        "gloss_sequence": result["gloss_sequence"],
        "unsupported_concepts": result["unsupported_concepts"],
        "unmapped_words": result["unsupported_concepts"],
        "status": result["status"],
        "available_signs": len(vocabulary),
        "engine": "nlp",
    }


@app.post("/api/text-to-sign/llm")
def text_to_sign_llm(payload: TextToSignRequest):
    """Plan a signable gloss sequence with the LLM using the active model's vocabulary."""
    vocab = _available_model_classes()
    if not vocab:
        raise HTTPException(
            status_code=503,
            detail="The active model has no bundled landmark sequences.",
        )
    res = break_into_glosses(payload.text, vocab)

    if res.get("status") == "error":
        error_detail = res.get("error", "llm_error")
        raise HTTPException(status_code=503, detail=f"LLM error: {error_detail}")

    return {
        "input_text": payload.text,
        "gloss_sequence": res.get("gloss_sequence", []),
        "unsupported_concepts": res.get("unsupported_concepts", []),
        "unmapped_words": res.get("unsupported_concepts", []),
        "status": res.get("status", "unresolved"),
        "available_signs": len(vocab),
        "engine": "llm",
    }


# ─────────────────────────────────────────────
# TTS (Independent Free & ElevenLabs Premium)
# ─────────────────────────────────────────────
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    voice_id = str(payload.get("voice", "1"))
    engine = str(payload.get("engine", "free")).strip().lower()
    if not text:
        return {"text": "", "audio_url": None, "engine": engine, "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text, voice_id=voice_id, engine=engine)
        result["text"] = text
        return result
    except Exception as e:
        return {
            "text": text,
            "audio_url": None,
            "engine": engine,
            "duration_ms": 0,
            "status": f"tts_error: {str(e)}",
            "error": str(e),
        }


@app.get("/api/tts/audio/{filename}")
def serve_tts_audio(filename: str):
    filepath = TTS_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    media_type = "audio/mpeg" if filename.endswith(".mp3") else "audio/wav"
    return FileResponse(str(filepath), media_type=media_type)


@app.get("/api/tts/voices")
def list_tts_voices():
    from backend.tts_engine import VOICES_FREE, VOICES_ELEVENLABS, is_elevenlabs_configured
    voices_list = []
    for k, v in VOICES_FREE.items():
        voices_list.append({
            "id": k,
            "label": v[0],
            "engine": "free",
            "tier": "free",
            "engine_voice": v[1],
        })
    for k, v in VOICES_ELEVENLABS.items():
        voices_list.append({
            "id": k,
            "label": v[0],
            "engine": "elevenlabs",
            "tier": "premium",
            "engine_voice": v[1],
        })
    return {
        "voices": voices_list,
        "elevenlabs_configured": is_elevenlabs_configured(),
    }


# ─────────────────────────────────────────────
# SPEECH TO TEXT (Local faster-whisper + ElevenLabs Scribe)
# ─────────────────────────────────────────────
from backend.stt_engine import transcribe_bytes, is_elevenlabs_configured  # noqa: E402


@app.get("/api/stt/status")
def get_stt_status():
    return {
        "default_engine": "local",
        "engines": ["local", "elevenlabs"],
        "elevenlabs_configured": is_elevenlabs_configured(),
        "vad_modes": ["silero_vad"],
        "default_vad_mode": "silero_vad",
    }


@app.post("/api/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Form(default=""),
    engine: str = Form(default="local"),
    vad_mode: str = Form(default="silero_vad"),
    silence_threshold: float = Form(default=0.5),
    min_silence_ms: int = Form(default=500),
    speech_pad_ms: int = Form(default=400),
    max_segment_s: float = Form(default=15.0),
    is_final: bool = Form(default=False),
    previous_context: str = Form(default=""),
):
    try:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty audio recording")

        vad_config = {
            "threshold": silence_threshold,
            "min_silence_duration_ms": min_silence_ms,
            "speech_pad_ms": speech_pad_ms,
            "max_speech_duration_s": max_segment_s,
        }

        return transcribe_bytes(
            data=data,
            filename=file.filename or "rec.webm",
            language=language,
            engine=engine,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )
    except HTTPException:
        raise
    except ValueError as val_err:
        print(f"[STT Error] {val_err}")
        raise HTTPException(status_code=400, detail=str(val_err)) from val_err
    except Exception as exc:
        print(f"[STT Error] {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Speech-to-text transcription failed: {exc}",
        ) from exc



@app.get("/api/admin/stats")
def admin_stats():
    ai = get_ai_config()
    coverage = _coverage_summary()
    return {
        "total_signs": len(_available_model_classes()),
        "avatar_classes": coverage["with_avatar_data"],
        "model_active": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_classes": len(REGISTRY.active_classes),
        "contract": {
            "kind": "temporal",
            "feature_width": FEATURE_WIDTH,
            "frames": SEQ_T,
        },
        "llm_available": is_llm_available(),
        "llm_model": ai["model"],
        "inference_mode": ai["provider"],
        "ai_mode": ai["mode"],
        "dataset_version": "v0.1",
    }


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)
```

---

# FILE: `backend\pose.py`

```python
"""Pose data for the 98-dim sign-recognition feature architecture."""

import numpy as np

POSE_INDICES = [11, 12, 13, 14, 15, 16, 23, 24]
POSE_POINTS = len(POSE_INDICES)
POSE_DIM = POSE_POINTS * 4

P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)

VIS_MIN = 0.5

POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (0, 1),
    (0, 2), (2, 4),
    (1, 3), (3, 5),
    (0, 6), (1, 7), (6, 7),
]

POSE_FACE_MARKERS: list[int] = []
POSE_FACE_PAIRS: list[tuple[int, int]] = []


def pose_from_landmarks(pose_landmarks) -> np.ndarray:
    """Return the eight selected MediaPipe pose points as float32 x/y/z/visibility rows."""
    return np.array(
        [[pose_landmarks.landmark[i].x, pose_landmarks.landmark[i].y,
          pose_landmarks.landmark[i].z, pose_landmarks.landmark[i].visibility]
         for i in POSE_INDICES],
        np.float32,
    )
```

---

# FILE: `backend\streaming.py`

```python
"""Per-session state for continuous sign detection."""

from collections import OrderedDict, deque

import numpy as np

from backend.extract import END_FRAMES, KEEP_TAIL, PRE_ROLL, TRIGGER_FRAMES

MAX_SESSIONS = 64
REFERENCE_FPS = 30.0


class StreamSession:
    """State and buffered frames for one client's sign stream."""

    def __init__(self):
        self.reset()

    def reset(self, mode: str = "auto"):
        self.mode = mode
        self.state = "IDLE"
        self.up_count = 0
        self.down_count = 0
        self.last_up_idx = 0
        self.up_started_at = None
        self.down_started_at = None
        self.frame_index = 0
        self.pre_roll = deque(maxlen=PRE_ROLL + TRIGGER_FRAMES)
        self.frames = []
        self.features = []
        self.timestamps = []
        self.miss = 0
        self.manual_recording = False


SESSIONS: "OrderedDict[str, StreamSession]" = OrderedDict()


def get_session(sid: str) -> StreamSession:
    sess = SESSIONS.get(sid)
    if sess is None:
        sess = StreamSession()
        SESSIONS[sid] = sess
    else:
        SESSIONS.move_to_end(sid)
    while len(SESSIONS) > MAX_SESSIONS:
        SESSIONS.popitem(last=False)
    return sess


def reset_session(sid: str) -> None:
    SESSIONS.pop(sid, None)


def update_span_state(
    sess: StreamSession,
    any_hand_up: bool,
    frame_data: dict | None,
    feature_vec: np.ndarray,
    is_complete: bool,
    timestamp: float,
) -> str:
    """Advance the span state machine and return its current state."""
    sess.frame_index += 1

    if sess.state == "IDLE":
        sess.pre_roll.append((frame_data, feature_vec, is_complete, timestamp))
        pre_roll_window = (PRE_ROLL + TRIGGER_FRAMES - 1) / REFERENCE_FPS
        while (
            len(sess.pre_roll) > 1
            and timestamp - sess.pre_roll[0][3] > pre_roll_window + 1e-6
        ):
            sess.pre_roll.popleft()
        if any_hand_up:
            if sess.up_started_at is None:
                sess.up_started_at = timestamp
            sess.up_count += 1
            if timestamp - sess.up_started_at + 1e-6 >= (
                TRIGGER_FRAMES - 1
            ) / REFERENCE_FPS:
                sess.state = "SIGN"
                sess.down_count = 0
                sess.frames = list(sess.pre_roll)
                sess.features = [
                    (i, features, complete)
                    for i, (_, features, complete, _) in enumerate(sess.frames)
                ]
                sess.timestamps = [time for _, _, _, time in sess.pre_roll]
                sess.last_up_idx = len(sess.frames) - 1
                sess.up_started_at = None
                return "SIGN"
        else:
            sess.up_count = 0
            sess.up_started_at = None
        return "IDLE"

    sess.frames.append(frame_data)
    rel_idx = len(sess.frames) - 1
    sess.features.append((rel_idx, feature_vec, is_complete))
    sess.timestamps.append(timestamp)

    if any_hand_up:
        sess.last_up_idx = rel_idx
        sess.down_count = 0
        sess.down_started_at = None
    else:
        if sess.down_started_at is None:
            sess.down_started_at = timestamp
        sess.down_count += 1
        if timestamp - sess.down_started_at + 1e-6 >= (
            END_FRAMES - 1
        ) / REFERENCE_FPS:
            tail_time = (
                sess.timestamps[sess.last_up_idx]
                + KEEP_TAIL / REFERENCE_FPS
                + 1e-6
            )
            end_idx = max(
                sess.last_up_idx,
                min(
                    int(np.searchsorted(sess.timestamps, tail_time, side="right")) - 1,
                    rel_idx,
                ),
            )
            sess.frames = sess.frames[:end_idx + 1]
            sess.features = sess.features[:end_idx + 1]
            sess.timestamps = sess.timestamps[:end_idx + 1]
            sess.state = "IDLE"
            sess.up_count = 0
            sess.down_count = 0
            sess.pre_roll.clear()
            return "SPAN_COMPLETE"
    return "SIGN"
```

---

# FILE: `backend\stt_engine.py`

```python
"""
backend/stt_engine.py
Speech-to-text engine with Bengali-script output support, continuous Silero VAD
segmentation, and independent Local (faster-whisper) and ElevenLabs (Scribe) modes.

Bengali output is converted to Bengali script when Whisper returns Devanagari text
and Bengali is either explicitly selected or detected automatically.
Existing callers and response fields remain fully compatible.
"""

from dataclasses import dataclass
import os
import tempfile
from typing import Optional, Union

from dotenv import load_dotenv

load_dotenv()


_stt_model = None
_transliterator = None


@dataclass
class VadConfig:
    """Configurable parameters for Silero VAD."""
    threshold: float = 0.5
    min_silence_duration_ms: int = 500
    speech_pad_ms: int = 400
    max_speech_duration_s: float = 15.0
    min_speech_duration_ms: int = 250


def get_stt_model():
    """Lazily load faster-whisper once on CPU int8."""
    global _stt_model

    if _stt_model is None:
        from faster_whisper import WhisperModel

        print("[WBSL Backend] Initializing faster-whisper small (cpu, int8)...")
        _stt_model = WhisperModel(
            "small",
            device="cpu",
            compute_type="int8",
        )
        print("[WBSL Backend] faster-whisper model ready.")

    return _stt_model


# UI vocabulary -> Whisper ISO-639-1 language codes.
LANG_MAP = {
    "english": "en",
    "en": "en",
    "eng": "en",
    "bangla": "bn",
    "bengali": "bn",
    "bn": "bn",
    "auto": None,
    "": None,
}


def resolve_language(raw: str | None) -> str | None:
    """Resolve supported language choices; unknown values use auto-detection."""
    selected = (raw or "").strip().lower()
    return LANG_MAP.get(selected)


def _get_transliterator():
    """Load the Bengali-script transliterator only when needed."""
    global _transliterator

    if _transliterator is None:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate

        _transliterator = (sanscript, transliterate)

    return _transliterator


def _contains_devanagari(text: str) -> bool:
    """Return True if text contains Devanagari characters."""
    return any("\u0900" <= char <= "\u097F" for char in text)


def _contains_bengali(text: str) -> bool:
    """Return True if text contains Bengali characters."""
    return any("\u0980" <= char <= "\u09FF" for char in text)


def _contains_arabic_script(text: str) -> bool:
    """Detect Arabic/Urdu-script characters without altering them."""
    return any("\u0600" <= char <= "\u06FF" for char in text)


def _convert_to_bengali_script(
    text: str,
    requested_language: str | None,
    detected_language: str | None = None,
) -> str:
    """
    Convert Devanagari text to Bengali script when:
    - Bengali was explicitly requested, or
    - Auto mode was used and Whisper detected Bengali.

    This changes the writing script, not the recognized words.
    Arabic/Urdu output is left unchanged.
    """
    if not text:
        return text

    is_bengali = (
        requested_language == "bn"
        or (
            requested_language is None
            and detected_language == "bn"
        )
    )

    if not is_bengali:
        return text

    # Already Bengali script: do not touch it.
    if _contains_bengali(text):
        return text

    # Do not guess how to convert Arabic/Urdu script.
    if _contains_arabic_script(text):
        print("[STT] Arabic/Urdu script detected; leaving it unchanged.")
        return text

    if not _contains_devanagari(text):
        return text

    try:
        sanscript, transliterate = _get_transliterator()

        converted = transliterate(
            text,
            sanscript.DEVANAGARI,
            sanscript.BENGALI,
        )

        print("[STT] Converted Devanagari output to Bengali script.")
        return converted

    except ImportError:
        print(
            "[STT] indic-transliteration is not installed. "
            "Run: pip install indic-transliteration"
        )
        return text

    except Exception as exc:
        print(f"[STT] Bengali-script conversion failed: {exc}")
        return text


def deduplicate_boundary_words(previous_text: str, current_text: str) -> str:
    """
    Remove duplicate words/phrases at the boundary between two adjacent speech segments.
    Prevents words from being doubled when segments overlap slightly.
    """
    prev_words = previous_text.strip().split()
    curr_words = current_text.strip().split()
    if not prev_words or not curr_words:
        return current_text.strip()

    max_overlap = min(len(prev_words), len(curr_words), 5)
    for k in range(max_overlap, 0, -1):
        if prev_words[-k:] == curr_words[:k]:
            return " ".join(curr_words[k:]).strip()

    return current_text.strip()


def get_elevenlabs_api_key() -> Optional[str]:
    """Retrieve ElevenLabs API key from environment variables without exposing it to frontend."""
    return os.getenv("ELEVENLABS_API_KEY") or os.getenv("ElevenLabs_API_KEY")


def is_elevenlabs_configured() -> bool:
    """Check if ElevenLabs credentials are configured on backend."""
    key = get_elevenlabs_api_key()
    return bool(key and key.strip())


def get_audio_duration_seconds(path: str) -> float:
    """Return the duration in seconds of a WAV file."""
    try:
        import wave
        with wave.open(path, "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            if rate > 0:
                return frames / float(rate)
    except Exception:
        pass
    try:
        size = os.path.getsize(path)
        # Standard 16kHz 16-bit mono WAV is 32000 bytes/sec + 44 bytes header
        return max(0.0, (size - 44) / 32000.0)
    except Exception:
        return 1.0


def transcribe_elevenlabs(
    path: str,
    language: str | None = None,
) -> dict:
    """
    Transcribe audio using ElevenLabs Scribe v1/v2 API.
    Raises descriptive exceptions on error or missing credentials.
    CRITICAL: Never automatically falls back to local or other providers.
    Prevents audio_too_short (400) failures by verifying minimum duration (>= 0.6s)
    and catching trailing short slices gracefully.
    """
    api_key = get_elevenlabs_api_key()
    if not api_key:
        raise ValueError(
            "ElevenLabs API key is missing. Add ELEVENLABS_API_KEY to your .env file."
        )

    whisper_lang = resolve_language(language)
    lang_code = whisper_lang if whisper_lang in ("bn", "en") else None

    # Scribe requires a minimum audio duration of ~0.5s-0.6s. Return empty text if audio is too short.
    duration = get_audio_duration_seconds(path)
    if duration < 0.6:
        print(f"[STT ElevenLabs] Audio slice duration ({duration:.2f}s) is shorter than 0.6s; returning empty transcript.")
        return {
            "text": "",
            "language": whisper_lang or "auto",
            "language_probability": 1.0,
            "selected_mode": whisper_lang or "auto",
            "engine": "elevenlabs",
        }

    from elevenlabs.client import ElevenLabs

    client = ElevenLabs(api_key=api_key)
    print(f"[STT ElevenLabs] Transcribing {path} (lang={lang_code}, duration={duration:.2f}s)...")

    try:
        with open(path, "rb") as audio_file:
            res = client.speech_to_text.convert(
                file=audio_file,
                model_id="scribe_v1",
                language_code=lang_code,
            )
    except Exception as exc:
        err_str = str(exc).lower()
        if "audio_too_short" in err_str:
            print(f"[STT ElevenLabs] Scribe API audio_too_short caught; returning empty transcript.")
            return {
                "text": "",
                "language": whisper_lang or "auto",
                "language_probability": 1.0,
                "selected_mode": whisper_lang or "auto",
                "engine": "elevenlabs",
            }
        raise

    raw_text = (getattr(res, "text", "") or "").strip()
    detected_lang = getattr(res, "language_code", None) or whisper_lang or "auto"

    output_text = _convert_to_bengali_script(
        raw_text,
        whisper_lang,
        detected_lang,
    )

    return {
        "text": output_text,
        "language": detected_lang,
        "language_probability": 1.0,
        "selected_mode": whisper_lang or "auto",
        "engine": "elevenlabs",
    }


def transcribe_local_whisper(
    path: str,
    language: str | None = None,
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Transcribe audio locally using faster-whisper.
    Uses continuous Silero VAD neural segmentation as the standard segmentation engine.
    """
    whisper_lang = resolve_language(language)
    model = get_stt_model()

    if isinstance(vad_config, dict):
        cfg = VadConfig(
            threshold=float(vad_config.get("threshold", 0.5)),
            min_silence_duration_ms=int(vad_config.get("min_silence_duration_ms", 500)),
            speech_pad_ms=int(vad_config.get("speech_pad_ms", 400)),
            max_speech_duration_s=float(vad_config.get("max_speech_duration_s", 15.0)),
            min_speech_duration_ms=int(vad_config.get("min_speech_duration_ms", 250)),
        )
    elif isinstance(vad_config, VadConfig):
        cfg = vad_config
    else:
        cfg = VadConfig()

    vad_params = {
        "threshold": cfg.threshold,
        "min_silence_duration_ms": cfg.min_silence_duration_ms,
        "speech_pad_ms": cfg.speech_pad_ms,
        "max_speech_duration_s": cfg.max_speech_duration_s,
        "min_speech_duration_ms": cfg.min_speech_duration_ms,
    }

    segments, info = model.transcribe(
        path,
        language=whisper_lang,
        task="transcribe",
        beam_size=5,
        temperature=0.0,
        no_speech_threshold=0.6,
        vad_filter=True,
        vad_parameters=vad_params,
        condition_on_previous_text=False,
    )

    raw_text = " ".join(
        segment.text.strip() for segment in segments
    ).strip()

    # Bengali-script transliteration preservation
    converted_text = _convert_to_bengali_script(
        raw_text,
        whisper_lang,
        info.language,
    )

    # Prevent cut or duplicate words at boundaries when previous context is given
    final_text = deduplicate_boundary_words(previous_context, converted_text) if previous_context else converted_text

    return {
        "text": final_text,
        "language": info.language,
        "language_probability": (
            round(float(info.language_probability), 4)
            if info.language_probability is not None
            else 0.0
        ),
        "selected_mode": whisper_lang or "auto",
        "engine": "local",
        "vad_mode": vad_mode,
        "is_final": is_final,
    }


def transcribe_file(
    path: str,
    language: str | None = None,
    engine: str = "local",
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Transcribe an audio file with independent mode selection.
    Existing callers using transcribe_file(path, language) remain 100% compatible.
    """
    clean_engine = (engine or "local").strip().lower()

    if clean_engine == "elevenlabs":
        return transcribe_elevenlabs(path, language)
    elif clean_engine == "local":
        return transcribe_local_whisper(
            path,
            language=language,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )
    else:
        raise ValueError(
            f"Unsupported STT engine: {engine!r}. Must be 'local' or 'elevenlabs'."
        )


def transcribe_bytes(
    data: bytes,
    filename: str = "rec.webm",
    language: str | None = None,
    engine: str = "local",
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Write audio bytes to a temporary file, transcribe using the requested engine, and clean up.
    Maintains complete backwards compatibility.
    """
    suffix = os.path.splitext(filename or "rec.webm")[1] or ".webm"
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp:
            temp.write(data)
            temp_path = temp.name

        return transcribe_file(
            temp_path,
            language=language,
            engine=engine,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
```

---

# FILE: `backend\tts_engine.py`

```python
"""
backend/tts_engine.py
Independent Free (Edge TTS / BanglaTTS) and ElevenLabs Premium Bengali TTS engine.

- Free mode (default): Edge TTS with offline BanglaTTS fallback. Never calls ElevenLabs.
- ElevenLabs Premium: Uses eleven_v3 model, preserving emotion/audio tags (e.g. [excited], [sad], [whispers]).
  Never automatically falls back to Free mode on failure.
"""

import asyncio
import os
from pathlib import Path
import re
import unicodedata

from dotenv import load_dotenv

load_dotenv()

TTS_DIR = Path(__file__).resolve().parent / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

# Free mode voices: voice_id -> (label, edge-tts voice)
VOICES_FREE = {
    "1": ("Female · Nabanita", "bn-BD-NabanitaNeural"),
    "2": ("Male · Pradeep", "bn-BD-PradeepNeural"),
}

# Preserve backwards compatibility alias
VOICES = VOICES_FREE

# voice_id -> BanglaTTS offline voice
BANGLATTS_VOICE = {
    "1": "female",
    "2": "male",
}

# ElevenLabs Premium voices: voice_id -> (label, elevenlabs voice_id)
VOICES_ELEVENLABS = {
    "eleven_1": ("Female Expressive · Sarah", "EXAVITQu4vr4xnSDxMaL"),
    "eleven_2": ("Male Expressive · George", "JBFqnCBsd6RMkjVDRZzb"),
}


def _clean_banglatts_text(text: str) -> str:
    """Strip punctuation and emotion tags for offline BanglaTTS synthesis."""
    stripped_tags = re.sub(r"\[[a-zA-Z_\s]+\]", " ", text)
    clean = "".join(
        char if char.isspace() or unicodedata.category(char)[0] in {"L", "M", "N"} else " "
        for char in stripped_tags
    )
    return re.sub(r"\s+", " ", clean).strip()


def _strip_emotion_tags(text: str) -> str:
    """Strip bracketed emotion tags like [happy], [whispers] for standard TTS."""
    cleaned = re.sub(r"\[[a-zA-Z_\s]+\]", " ", text)
    return re.sub(r"\s+", " ", cleaned).strip()


def get_elevenlabs_api_key() -> str | None:
    return os.getenv("ELEVENLABS_API_KEY") or os.getenv("ElevenLabs_API_KEY")


def is_elevenlabs_configured() -> bool:
    key = get_elevenlabs_api_key()
    return bool(key and key.strip())


def speak_free(text: str, output_name: str = "bengali_speech", voice_id: str = "1") -> dict:
    """
    Generate speech using Free mode: edge-tts with offline BanglaTTS fallback.
    Guaranteed to never call ElevenLabs or cloud paid APIs.
    """
    clean_voice_id = "2" if str(voice_id) in ("2", "eleven_2") else "1"
    label, edge_voice = VOICES_FREE.get(clean_voice_id, VOICES_FREE["1"])

    out_name = f"{output_name}_free_v{clean_voice_id}"
    output_base = str(TTS_DIR / out_name)

    # Strip emotion tags for Edge TTS so brackets aren't vocalized
    spoken_text = _strip_emotion_tags(text) or text

    # --- edge-tts (online, best free quality) ---
    try:
        import edge_tts

        async def _generate():
            communicate = edge_tts.Communicate(spoken_text, edge_voice)
            await communicate.save(output_base + ".mp3")

        asyncio.run(_generate())
        audio_path = output_base + ".mp3"

        duration_ms = 0
        try:
            from mutagen.mp3 import MP3
            audio = MP3(audio_path)
            duration_ms = int(audio.info.length * 1000)
        except Exception:
            duration_ms = len(spoken_text.split()) * 604

        return {
            "audio_url": f"/api/tts/audio/{out_name}.mp3",
            "engine": "edge-tts",
            "duration_ms": duration_ms,
            "voice": label,
            "voice_id": clean_voice_id,
            "status": "success",
        }
    except Exception as e:
        print(f"[TTS Free] edge-tts failed: {e}")

    # --- BanglaTTS (offline fallback for Free mode) ---
    try:
        from banglatts import BanglaTTS

        clean = _clean_banglatts_text(spoken_text)

        tts = BanglaTTS()
        path = tts(
            clean,
            voice=BANGLATTS_VOICE.get(clean_voice_id, "female"),
            filename=output_base + ".wav",
        )

        duration_ms = 0
        try:
            from mutagen import File as AudioFile
            audio = AudioFile(path)
            duration_ms = int(audio.info.length * 1000)
        except Exception:
            duration_ms = len(clean.split()) * 453

        return {
            "audio_url": f"/api/tts/audio/{out_name}.wav",
            "engine": "banglatts",
            "duration_ms": duration_ms,
            "voice": label,
            "voice_id": clean_voice_id,
            "status": "success",
        }
    except Exception as e:
        print(f"[TTS Free] BanglaTTS also failed: {e}")
        return {
            "audio_url": None,
            "engine": "none",
            "duration_ms": 0,
            "voice": label,
            "voice_id": clean_voice_id,
            "status": "tts_unavailable",
            "error": f"Free TTS engines failed: {e}",
        }


def speak_elevenlabs(
    text: str,
    output_name: str = "bengali_speech",
    voice_id: str = "eleven_1",
) -> dict:
    """
    Generate speech using ElevenLabs Premium (eleven_v3), preserving emotion/audio tags.
    CRITICAL: Never automatically falls back to Free mode on failure.
    """
    api_key = get_elevenlabs_api_key()
    if not api_key:
        return {
            "audio_url": None,
            "engine": "elevenlabs",
            "duration_ms": 0,
            "voice": "ElevenLabs",
            "voice_id": str(voice_id),
            "status": "missing_credentials",
            "error": "ElevenLabs API key is missing. Configure ELEVENLABS_API_KEY in .env.",
        }

    # Resolve voice
    vid_str = str(voice_id)
    if vid_str in VOICES_ELEVENLABS:
        label, eleven_voice = VOICES_ELEVENLABS[vid_str]
    elif vid_str == "2":
        label, eleven_voice = VOICES_ELEVENLABS["eleven_2"]
        vid_str = "eleven_2"
    elif vid_str == "1":
        label, eleven_voice = VOICES_ELEVENLABS["eleven_1"]
        vid_str = "eleven_1"
    else:
        label = f"ElevenLabs ({vid_str})"
        eleven_voice = vid_str

    out_name = f"{output_name}_eleven_{vid_str}"
    out_file = TTS_DIR / f"{out_name}.mp3"

    try:
        from elevenlabs.client import ElevenLabs

        client = ElevenLabs(api_key=api_key)

        print(f"[TTS ElevenLabs] Generating audio for voice '{eleven_voice}' with tags preserved...")
        audio = client.text_to_speech.convert(
            text=text,
            voice_id=eleven_voice,
            model_id="eleven_v3",
            output_format="mp3_44100_128",
        )

        with open(out_file, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        duration_ms = 0
        try:
            from mutagen.mp3 import MP3
            audio_info = MP3(str(out_file))
            duration_ms = int(audio_info.info.length * 1000)
        except Exception:
            duration_ms = len(text.split()) * 600

        return {
            "audio_url": f"/api/tts/audio/{out_name}.mp3",
            "engine": "elevenlabs",
            "duration_ms": duration_ms,
            "voice": label,
            "voice_id": vid_str,
            "status": "success",
        }

    except Exception as exc:
        print(f"[TTS ElevenLabs] Generation failed: {exc}")
        return {
            "audio_url": None,
            "engine": "elevenlabs",
            "duration_ms": 0,
            "voice": label,
            "voice_id": vid_str,
            "status": "tts_error",
            "error": f"ElevenLabs TTS failed: {exc}",
        }


def speak(
    text: str,
    output_name: str = "bengali_speech",
    voice_id: str = "1",
    engine: str = "free",
) -> dict:
    """
    Generate Bengali speech with the selected engine and voice.
    - engine='free': Edge TTS / BanglaTTS (offline).
    - engine='elevenlabs': ElevenLabs Premium with emotion tag support.
    Existing callers remain completely compatible.
    """
    clean_engine = (engine or "free").strip().lower()

    if clean_engine == "elevenlabs":
        return speak_elevenlabs(text, output_name=output_name, voice_id=voice_id)
    else:
        return speak_free(text, output_name=output_name, voice_id=voice_id)
```

---

# FILE: `frontend\AGENTS.md`

```markdown
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

---

# FILE: `frontend\CLAUDE.md`

```markdown
@AGENTS.md
```

---

# FILE: `frontend\eslint.config.mjs`

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

---

# FILE: `frontend\next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

---

# FILE: `frontend\next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

---

# FILE: `frontend\postcss.config.ts`

```typescript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

# FILE: `frontend\src\app\about\page.tsx`

```tsx
import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  Brain,
  MessageSquareText,
  Volume2,
  ShieldCheck,
  Database,
  HelpCircle,
  Users,
  BookOpen,
  Layers,
  Cpu,
  Camera,
  Hand,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Globe,
  WifiOff,
  Lock,
} from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Sabir Ali Mondal",
      roll: "34900123032",
      role: "Project Lead & System Developer",
      focus: "End-to-end system architecture, ML pipeline, LLM integration, web platform, deployment",
    },
    {
      name: "Koushaki Singha",
      roll: "34900124074",
      role: "Sign Language Data & Quality Lead",
      focus: "WBSL/ISL/BdSL sign recording coordination, dataset annotation, landmark data quality review",
    },
    {
      name: "Monirul Halder",
      roll: "34900123021",
      role: "Bengali Output & Testing Lead",
      focus: "Bengali translation quality review, TTS output validation, semantic testing, project documentation",
    },
    {
      name: "Firdos Shakih",
      roll: "34900123011",
      role: "Model Training & Evaluation Lead",
      focus: "Training experiment execution, accuracy evaluation, augmentation testing, model comparison",
    },
  ];

  const pipelineStages = [
    {
      id: "camera",
      icon: Camera,
      label: "CAMERA",
      color: "text-accent-primary",
      desc: "30 FPS webcam capture, MediaPipe Holistic extracts hand, pose (8-point) and face landmarks",
    },
    {
      id: "recognition",
      icon: Hand,
      label: "RECOGNITION",
      color: "text-status-approved",
      desc: "98-dim shoulder-box feature vector → BiLSTM + Attention (64-frame temporal clips). Span-based auto-detection: hands raised = sign starts, hands lowered = inference runs.",
    },
    {
      id: "emotion",
      icon: Sparkles,
      label: "EMOTION",
      color: "text-accent-secondary",
      desc: "ViT-ONNX 7-class classifier, robust to glasses, ~30–50ms. Supplementary affective context for Bengali output tone.",
    },
    {
      id: "nlg",
      icon: Brain,
      label: "BENGALI NLG",
      color: "text-accent-primary",
      desc: "NVIDIA Nemotron 3.5-B (offline) / OpenRouter (online). 50-criteria constrained prompt. OpenAI-compatible API. AI_MODE selects the engine.",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      color: "text-accent-primary",
      desc: "edge-tts (online, ~604 ms/word) → BanglaTTS (offline, ~453 ms/word) automatic fallback. ElevenLabs premium option.",
    },
  ];

  const techStack = [
    { category: "Vision", items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX (trpakov/vit-face-expression)" },
    { category: "ML", items: "PyTorch · ONNX Runtime · BiLSTM + Attention (98-dim shoulder box, 64-frame clips) · Training zone: extract → train → avatar_extract → test_model" },
    { category: "LLM", items: "NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf (offline, KoboldCpp) · OpenRouter (online) · OpenAI-compatible API · AI_MODE selection" },
    { category: "TTS", items: "edge-tts (bn-BD-NabanitaNeural) · BanglaTTS (silero) · ElevenLabs eleven_v3 (premium) · mutagen" },
    { category: "Frontend", items: "Next.js · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts · Three.js (3D avatar simulation)" },
    { category: "Backend", items: "FastAPI · Python 3.11 · Single venv deployment · .env-driven AI_MODE configuration" },
  ];

  const gaps = [
    { id: "G4", label: "WB Regional Sign Focus", status: "OPEN — VERIFIED", detail: "Zero AI/ML projects exist for WBSL, ISL, or BdSL as used in West Bengal. Only resource: 170 Wikisigns entries" },
    { id: "G15", label: "WBSL ≠ ISL ≠ BdSL", status: "OPEN — VERIFIED", detail: "Johnson & Johnson (2016) proved linguistic distinctness. All tech targets Bangladesh or Delhi" },
    { id: "G6", label: "Sign → Bengali Translation", status: "OPEN", detail: "No system produces grammatically correct Bengali from signs for the WB region" },
    { id: "G7", label: "Constrained LLM Integration", status: "OPEN", detail: "No sign language system uses LLM with anti-hallucination constraints" },
    { id: "G10", label: "Bidirectional Communication", status: "OPEN", detail: "Google SL2T is forward-only. Reverse path not deployed anywhere" },
    { id: "G13", label: "Low-Resource Transfer", status: "OPEN", detail: "Google uses 100,000+ hours. WB region has near-zero. What works without scale?" },
  ];

  const currentStatus = [
    { label: "MediaPipe Stream", desc: "Hand + 8-point pose + 19-point face extracted at stable 30 FPS.", status: "DONE" },
    { label: "Emotion Detection", desc: "ViT-ONNX 7-class classifier (glasses-robust) provides supplementary affect context.", status: "DONE" },
    { label: "98-dim Feature Extraction", desc: "Shoulder-box coordinate system. 66 handshape + 12 palm + 4 wrist + 4 elbow + 6 wrist-face + 3 head + 2 flags + 1 duration.", status: "DONE" },
    { label: "BiLSTM + Attention Model", desc: "Model 5 (sign_daily_lstm.onnx). Input: (batch, 64, 98). Span-based auto-detection with pre-roll and tail trimming.", status: "DONE" },
    { label: "Bengali NLG & TTS", desc: "AI_MODE env variable. Offline: Nemotron 3.5-B via KoboldCpp. Online: OpenRouter. Dual-engine TTS.", status: "DONE" },
    { label: "3D Avatar Simulation", desc: "Per-gloss avatar data (pose.npy, hands.npy, face.npy, t.npy) served from model bundle. Three.js 3D rendering.", status: "DONE" },
  ];

  const roadmap = [
    { num: 1, label: "Expanded Sign Vocabulary", desc: "Growing the training dataset with more WBSL-specific signs beyond the current ISL-based vocabulary.", active: true },
    { num: 2, label: "WB Region Data Creation", desc: "A dedicated data collector tool is being prepared to build the first continuous dataset for WBSL/ISL/BdSL.", active: true },
    { num: 3, label: "Community Contributions", desc: "Planned future feature. Privacy-first landmark submission with human verification pipeline. Currently disabled.", active: false },
    { num: 4, label: "Field Survey", desc: "50+ field verification questions prepared and structured for real-world community data collection.", active: true },
    { num: 5, label: "Unknown Sign Handling", desc: "Fully implementing the 'Honesty Layer' to detect unknown signs and prevent AI hallucination.", active: false },
  ];

  return (
    <PageContainer className="max-w-5xl py-16 space-y-20">
      {/* ─── HERO ── */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-primary">
          <BookOpen size={14} />
          <span>Academic Research Project · CSE · 7th Semester · 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          WBSL Bridge
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
          Intent-aware bidirectional sign language communication for the Deaf community of West Bengal. 
          Designed to support WBSL, ISL, BdSL, and mixed signing with unknown sign handling and community-driven growth.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {["WBSL/ISL/BdSL Support", "Bengali ↔ Sign", "Unknown Sign Honesty", "Privacy-First", "CPU-Only", "Offline-Capable"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-surface-elevated border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ── THE PROBLEM ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-status-error" />
          <h2 className="text-2xl font-bold text-text-primary">The Verified Technological Void</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          The Deaf community in West Bengal uses various sign varieties including West Bengal Sign Language (WBSL), 
          Indian Sign Language (ISL), and Bangladeshi Sign Language (BdSL), often mixing them. 
          Despite this, an exhaustive search confirmed:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            "ZERO systems handling continuous signs for WB region",
            "ZERO tools supporting mixed WBSL/ISL/BdSL signing",
            "ZERO WBSL/ISL/BdSL → Bengali translators",
            "ZERO projects from WB universities",
            "Only resource: 170 Wikisigns entries",
            "Existing tech targets Bangladesh or Delhi only",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 p-3 rounded-md bg-surface border border-border">
              <XCircle size={14} className="text-status-error mt-0.5 shrink-0" />
              <span className="text-xs text-text-secondary">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border-l-2 border-l-accent-primary">
          <p className="text-xs font-mono text-text-secondary">
            Every existing &ldquo;Bengali Sign Language&rdquo; technology project originates from Bangladesh
            and targets Bangladesh BdSL — a linguistically separate sign language — not the WBSL, ISL, or BdSL 
            varieties actually used by the Deaf community in West Bengal, India.
          </p>
        </div>
      </section>

      {/* ── CURRENT STATUS & ROADMAP ─── */}
      <section className="space-y-8">
        {/* Current Status */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-accent-primary" />
            <h2 className="text-2xl font-bold text-text-primary">Current Implementation Status</h2>
          </div>
          <div className="space-y-3">
            {currentStatus.map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-md border bg-surface border-border">
                <div className="flex items-center gap-3 sm:w-1/3">
                  <CheckCircle2 size={18} className="text-status-approved shrink-0" />
                  <span className="text-sm font-semibold text-text-primary">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-text-secondary sm:w-2/3">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ArrowRight size={20} className="text-accent-secondary" />
            <h2 className="text-2xl font-bold text-text-primary">Roadmap & Active Progress</h2>
          </div>
          <div className="space-y-3">
            {roadmap.map((item) => (
              <div key={item.num} className={`flex items-start gap-4 p-4 rounded-md border ${item.active ? "bg-status-unknown/5 border-status-unknown" : "bg-surface border-border"}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-bold ${item.active ? "bg-status-unknown text-white" : "bg-accent-primary text-white"}`}>
                  {item.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{item.label}</span>
                    {item.active && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-unknown text-white font-bold">
                        ACTIVE PROGRESS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESEARCH GAPS ─── */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-text-primary">Verified Research Gaps</h2>
        <p className="text-sm text-text-secondary">
          18 gaps identified through exhaustive literature review. 14 remain completely open. Key gaps:
        </p>
        <div className="space-y-2">
          {gaps.map((gap) => (
            <div key={gap.id} className="flex items-start gap-4 p-3 rounded-md bg-surface border border-border">
              <span className="font-mono text-xs text-status-unknown font-bold shrink-0 w-8">{gap.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-primary">{gap.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-unknown/10 text-status-unknown">
                    {gap.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">{gap.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SYSTEM ARCHITECTURE ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-accent-secondary" />
          <h2 className="text-2xl font-bold text-text-primary">System Architecture</h2>
        </div>

        {/* Pipeline Flow */}
        <div className="space-y-1">
          {pipelineStages.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="flex items-start gap-4 p-4 rounded-md bg-surface border border-border">
                <div className={`mt-0.5 ${stage.color}`}>
                  <stage.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">STAGE {i + 1}/{pipelineStages.length}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{stage.desc}</p>
                </div>
              </div>
              {i < pipelineStages.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-border" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Key Innovations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {[
            { title: "98-dim Shoulder Box Features", desc: "Signer-independent coordinate system. Origin at shoulder midpoint, unit = shoulder width. Removes skin color, background, lighting bias." },
            { title: "Span-Based Auto-Detection", desc: "Hands raised → recording starts automatically. Hands lowered → 64-frame clip selected → inference. No button press needed." },
            { title: "Open-Set Honesty Layer", desc: "OOD gate detects unknown signs BEFORE LLM reasoning. Output carries সম্ভবত (probably), never forced classification." },
            { title: "Privacy-First Design", desc: "Landmarks only, never raw video. Community contributions planned as future feature. DPDP Act 2023 compliant." },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-md bg-surface border border-border space-y-1">
              <div className="text-sm font-semibold text-text-primary">{item.title}</div>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECHNOLOGY STACK ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Cpu size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Technology Stack</h2>
        </div>
        <div className="rounded-md border border-border overflow-hidden">
          {techStack.map((row, i) => (
            <div key={row.category} className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 ${i % 2 === 0 ? "bg-surface" : "bg-surface-elevated"}`}>
              <span className="text-xs font-mono font-bold text-accent-primary uppercase tracking-wider w-24 shrink-0">
                {row.category}
              </span>
              <span className="text-xs text-text-secondary font-mono">{row.items}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted font-mono">
          All modules run in a single Python 3.11 venv on CPU. No cloud dependency for core operation. AI_MODE in .env selects offline or online LLM.
        </p>
      </section>

      {/* ─── DATASET STRATEGY ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Dataset Strategy</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Transfer-first approach. Ready-made datasets (BdSLW401, iSign, ISLTranslate) provide
          ~15,000 pre-labelled sequences covering 460+ signs. Training pipeline: extract.py → train.py → avatar_extract.py → test_model.py.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Model A", desc: "WBSL only (baseline)" },
            { label: "Model B", desc: "ISL pre-train → WBSL fine-tune" },
            { label: "Model C", desc: "ISL + WBSL + BdSL mixed training" },
          ].map((m) => (
            <div key={m.label} className="p-3 rounded-md bg-surface border border-border text-center">
              <div className="text-xs font-mono font-bold text-accent-primary">{m.label}</div>
              <div className="text-xs text-text-secondary mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="text-xs font-mono text-text-muted mb-2">DATA INDEXING</div>
          <p className="text-xs text-text-secondary">
            Signer-disjoint splits enforced. Features id and model id are append-only (new id per run).
            Daily report and confusion matrix stored per model. Avatar data co-located with model bundle.
          </p>
        </div>
      </section>

      {/* ─── UNKNOWN SIGN HANDLING ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle size={20} className="text-status-unknown" />
          <h2 className="text-2xl font-bold text-text-primary">Unknown Sign Handling</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          When the confidence margin is below threshold or top probability &lt; 0.5, the system reports &quot;Not sure&quot;
          instead of guessing. It generates ranked tentative candidates from the top-3 model outputs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tier: "LEVEL 1", label: "Numerical", desc: "finger_extension, velocity, repetition, duration, distance_to_mouth" },
            { tier: "LEVEL 2", label: "Symbolic", desc: "RIGHT_HAND INDEX_EXTENDED TOWARD_MOUTH REPEATED_3X" },
            { tier: "LEVEL 3", label: "Natural Language", desc: "\"The right hand moves toward the mouth, pauses, and returns. Repeated three times.\"" },
          ].map((level) => (
            <div key={level.tier} className="p-3 rounded-md bg-surface border border-border space-y-1">
              <div className="text-[10px] font-mono text-status-unknown">{level.tier}</div>
              <div className="text-xs font-semibold text-text-primary">{level.label}</div>
              <p className="text-[11px] text-text-muted leading-relaxed">{level.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border-l-2 border-l-status-unknown">
          <p className="text-xs font-mono text-text-secondary">
            Output: &ldquo;সম্ভবত&rdquo; (probably) is injected automatically into Bengali output.
            Every unknown sign carries STATUS: TENTATIVE — HUMAN VERIFICATION REQUIRED.
            The system never says &ldquo;predicted meaning.&rdquo;
          </p>
        </div>
      </section>

      {/* ─── COMMUNITY DATA (PLANNED FUTURE) ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Community Data Collection</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-pending/20 border border-status-pending/40 text-status-pending font-bold">
            PLANNED FUTURE FEATURE
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Privacy-first submission. Only landmarks will be collected; original video discarded on-device
          before transmission. Automated validation will produce evidence only. Human reviewers will make all
          final decisions. Compliant with India&rsquo;s Digital Personal Data Protection Act 2023.
        </p>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-md bg-surface border border-border opacity-60">
          <Lock size={14} className="text-accent-primary" />
          <span className="text-xs font-mono text-text-secondary">
            AUTOMATION → ANALYSE → EXPLAIN → SIMULATE → SHOW EVIDENCE → HUMAN DECIDES
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 opacity-60">
          {[
            { icon: CheckCircle2, label: "ACCEPT", desc: "Enters trusted dataset", color: "text-status-approved" },
            { icon: XCircle, label: "REJECT", desc: "Not used for training", color: "text-status-error" },
            { icon: Clock3, label: "NEEDS REVIEW", desc: "2-of-3 consensus", color: "text-status-unknown" },
          ].map((d) => (
            <div key={d.label} className="p-3 rounded-md bg-surface border border-border text-center space-y-1">
              <d.icon size={16} className={`${d.color} mx-auto`} />
              <div className={`text-xs font-mono font-bold ${d.color}`}>{d.label}</div>
              <div className="text-[10px] text-text-muted">{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BIDIRECTIONAL SYSTEM ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <MessageSquareText size={20} className="text-accent-secondary" />
          <h2 className="text-2xl font-bold text-text-primary">Bidirectional Communication</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-primary" />
              <span className="text-xs font-mono font-bold text-text-primary">FORWARD: SIGN → BENGALI</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Camera → MediaPipe → 98-dim shoulder-box features → BiLSTM + Attention (64 frames)
              → Emotion ViT → Constrained LLM (AI_MODE) → Natural Bengali text → Dual-engine TTS audio
            </p>
          </div>
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-secondary" />
              <span className="text-xs font-mono font-bold text-text-primary">REVERSE: BENGALI → SIGN</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bengali text/voice → LLM gloss generation → Sign sequence mapping →
              Avatar landmark replay → Continuous sequential 3D simulation
            </p>
          </div>
        </div>
      </section>

      {/* ── PROJECT TEAM ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Project Research Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {team.map((member) => (
            <div key={member.name} className="p-4 rounded-md bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">{member.name}</span>
                <span className="text-[10px] font-mono text-text-muted">{member.roll}</span>
              </div>
              <div className="text-xs font-mono text-accent-primary">{member.role}</div>
              <p className="text-[11px] text-text-muted">{member.focus}</p>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-md bg-surface border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-text-muted">Mentor: </span>
              <span className="text-sm font-semibold text-text-primary">Prof. Prabir Kr. Naskar</span>
            </div>
            <div>
              <span className="text-xs text-text-muted">Department: </span>
              <span className="text-sm text-text-secondary">CSE, Cooch Behar Government Engineering College</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONNECTIVITY NOTE ─── */}
      <section className="p-4 rounded-md bg-surface border border-border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-status-approved" />
            <span className="text-xs font-mono text-text-secondary">ONLINE: edge-tts + OpenRouter LLM</span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff size={14} className="text-status-pending" />
            <span className="text-xs font-mono text-text-secondary">OFFLINE: BanglaTTS + Nemotron 3.5-B (KoboldCpp)</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-accent-primary" />
            <span className="text-xs font-mono text-text-secondary">AI_MODE in .env selects the engine</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER NOTE ─── */}
      <footer className="pt-8 border-t border-border">
        <p className="text-xs text-text-muted leading-relaxed max-w-2xl">
          WBSL Bridge does not attempt to replicate the scale of Google DeepMind&rsquo;s SL2T (100,000+ hours,
          ASL → English, Pixel 11). It investigates whether the architectural principles demonstrated at
          high-resource scale can be adapted to a severely low-resource, linguistically distinct, regionally
          specific sign language ecosystem (WBSL, ISL, BdSL) with Bengali-language output, budget-device deployment, 
          and bidirectional communication — none of which currently exists.
        </p>
      </footer>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\admin\contributions\page.tsx`

```tsx
"use client";

import React from "react";

export default function AdminContributionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">PLANNED FEATURE</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Community Contributions
        </h1>
      </div>
      <div className="p-8 bg-surface border border-border rounded-lg text-center space-y-3">
        <div className="text-4xl">🚧</div>
        <h2 className="text-lg font-semibold text-text-primary">Coming Soon</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Community contribution functionality is planned for a future release.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded bg-surface-elevated border border-border text-text-muted text-xs font-mono cursor-not-allowed opacity-50"
        >
          Contributions (Unavailable)
        </button>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\layout.tsx`

```tsx
import React from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] min-h-0 w-full flex-none flex-col overflow-hidden bg-background md:flex-row">
      <AdminSidebar />
      <main className="h-0 min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-4 md:h-full md:w-auto md:p-6">
        {children}
      </main>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\models\page.tsx`

```tsx
"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Cpu, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8200";

type ModelEntry = {
  run: string;
  name: string;
  label: string;
  path: string;
  classes: number;
  temporal: boolean;
  input_width: number | null;
  size_mb: number;
  mtime: number;
  duration_s: number;
  active: boolean;
};

type RegistryResponse = {
  models: ModelEntry[];
  active: ModelEntry | null;
  active_path: string | null;
  scan_dir: string;
  error: string | null;
};

type ModelReport = {
  best_epoch?: number;
  best_val_acc?: number;
  best_val_loss?: number;
  val_top3_acc?: number;
  training_seconds?: number;
  macro_avg?: { precision?: number; recall?: number; f1?: number };
  per_class?: Record<string, {
    precision?: number;
    recall?: number;
    f1?: number;
    support?: number;
  }>;
  data?: { classes?: number; train_videos?: number; val_videos?: number };
};

type ConfusionReport = {
  classes?: string[];
  matrix?: number[][];
  rows?: string;
  columns?: string;
};

const SERVABLE_WIDTHS = [98];

const mutationErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ detail?: string }>(error)
    ? error.response?.data?.detail || fallback
    : fallback;

/** A model is servable when the backend has an extractor for its input width. */
const canActivate = (m: ModelEntry) =>
  m.input_width !== null && SERVABLE_WIDTHS.includes(m.input_width);

/** Human name for the extractor an input width selects. */
const featureLabel = (m: ModelEntry) => {
  if (m.temporal) return "BiLSTM temporal \u00b7 98-dim shoulder box";
  return `input ${m.input_width ?? "?"}-dim`;
};

export default function AdminModelsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () =>
      (await axios.get<RegistryResponse>(`${API_BASE}/api/admin/models`)).data,
    refetchInterval: 15000,
  });

  const { data: report } = useQuery({
    queryKey: ["active-model-report", data?.active_path],
    queryFn: async () =>
      (await axios.get<ModelReport>(`${API_BASE}/api/admin/model/report`)).data,
    enabled: Boolean(data?.active_path),
  });

  const { data: confusion } = useQuery({
    queryKey: ["active-model-confusion", data?.active_path],
    queryFn: async () =>
      (await axios.get<ConfusionReport>(`${API_BASE}/api/admin/model/confusion`)).data,
    enabled: Boolean(data?.active_path),
  });

  const rescan = useMutation({
    mutationFn: async () =>
      (await axios.post(`${API_BASE}/api/admin/models/rescan`)).data,
    onSuccess: () => {
      toast.success("Model folder re-scanned and reloaded");
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
    },
    onError: (error: unknown) => toast.error(mutationErrorMessage(error, "Rescan failed")),
  });

  const activate = useMutation({
    mutationFn: async (path: string) =>
      (await axios.post(`${API_BASE}/api/admin/models/activate`, { path })).data,
    onSuccess: (res) => {
      toast.success(
        `Serving ${res.active?.name ?? "model"} (${res.active?.classes ?? 0} classes)`
      );
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["health"] });
    },
    onError: (error: unknown) => toast.error(mutationErrorMessage(error, "Activation failed")),
  });

  const models = data?.models ?? [];
  const busy = rescan.isPending || activate.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">MODEL REGISTRY</div>
          <h1 className="text-2xl font-bold text-text-primary">Models Registry</h1>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Auto-discovered from{" "}
            <span className="text-text-primary">
              {data?.scan_dir ?? "models/onnx_models"}
            </span>{" "}
            · newest run wins on startup
          </p>
        </div>
        <button
          onClick={() => rescan.mutate()}
          disabled={busy}
          className="flex items-center gap-2 px-3 py-2 rounded border border-border bg-surface-elevated text-xs font-mono text-text-primary hover:border-accent-primary disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rescan.isPending ? "animate-spin" : ""}`} />
          RESCAN
        </button>
      </div>

      <div className="p-6 bg-surface border border-border rounded-lg space-y-3">
        {isLoading && (
          <div className="text-xs font-mono text-text-muted">Scanning model folder…</div>
        )}

        {!isLoading && data?.error && (
          <div className="p-4 rounded bg-status-rejected/10 border border-status-rejected/40 text-xs font-mono text-status-rejected">
            {data.error}
          </div>
        )}

        {!isLoading && models.length === 0 && !data?.error && (
          <div className="p-4 rounded bg-surface-elevated border border-border text-xs font-mono text-text-muted">
            No models found — train one from the Training Console.
          </div>
        )}

        {models.map((m) => {
          const servable = canActivate(m);
          return (
            <div
              key={m.path}
              className={`flex items-center justify-between gap-4 p-4 rounded bg-surface-elevated border ${
                m.active ? "border-accent-primary/60" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <Cpu
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    m.active ? "text-accent-primary" : "text-text-muted"
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-sm font-mono font-bold text-text-primary truncate">
                    {m.name}.onnx
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {featureLabel(m)}
                    {" · "}
                    {m.classes} classes · {m.size_mb} MB · {m.run}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono truncate">
                    {m.path}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!servable && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-pending/20 text-status-pending"
                    title="The backend requires a temporal model with 64 frames of 98-dim shoulder-box features."
                  >
                    INCOMPATIBLE
                  </span>
                )}
                {m.active ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-status-approved/20 text-status-approved">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => activate.mutate(m.path)}
                    disabled={busy || !servable}
                    className="px-3 py-1.5 rounded text-[10px] font-mono border border-border text-text-primary hover:border-accent-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {activate.isPending && activate.variables === m.path
                      ? "LOADING…"
                      : "SET ACTIVE"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data?.active && (
        <div className="text-xs font-mono text-text-muted">
          Serving now: <span className="text-text-primary">{data.active.name}</span> (
          {data.active.classes} classes, {data.active.temporal ? "temporal" : "static"})
        </div>
      )}

      <section className="space-y-3 rounded-lg border border-border bg-surface p-5">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">ACTIVE MODEL REPORT</div>
          <h2 className="mt-1 text-lg font-bold text-text-primary">
            Validation &amp; Confusion Matrix
          </h2>
        </div>

        {report?.best_val_acc === undefined ? (
          <p className="text-xs font-mono text-text-muted">
            No training report is available for the active model bundle.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Validation accuracy", report.best_val_acc],
                ["Top-3 accuracy", report.val_top3_acc],
                ["Macro F1", report.macro_avg?.f1],
                ["Validation loss", report.best_val_loss],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-border bg-surface-elevated p-3">
                  <div className="text-[9px] font-mono uppercase text-text-muted">{label}</div>
                  <div className="mt-1 text-lg font-bold text-text-primary">
                    {typeof value === "number" ? `${(value * (label === "Validation loss" ? 1 : 100)).toFixed(1)}${label === "Validation loss" ? "" : "%"}` : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-text-muted">
              Epoch {report.best_epoch ?? "—"} · {report.data?.train_videos ?? "—"} training clips ·{" "}
              {report.data?.val_videos ?? "—"} validation clips · {report.training_seconds ?? "—"} s
            </div>

            {report.per_class && (
              <details className="rounded border border-border">
                <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono text-text-secondary">
                  Per-class precision, recall &amp; F1 ({Object.keys(report.per_class).length} classes)
                </summary>
                <div className="max-h-80 overflow-auto">
                  <table className="w-full text-left text-[10px] font-mono">
                    <thead className="sticky top-0 bg-surface-elevated text-text-muted">
                      <tr>
                        <th className="px-3 py-2">Gloss</th>
                        <th className="px-3 py-2">Precision</th>
                        <th className="px-3 py-2">Recall</th>
                        <th className="px-3 py-2">F1</th>
                        <th className="px-3 py-2">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(report.per_class).map(([gloss, metrics]) => (
                        <tr key={gloss}>
                          <td className="px-3 py-1.5 font-bold text-text-primary">{gloss}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.precision?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.recall?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.f1?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.support ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {confusion?.classes?.length && confusion.matrix?.length ? (
              <details className="rounded border border-border">
                <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono text-text-secondary">
                  Confusion matrix · actual rows × predicted columns
                </summary>
                <div className="max-h-[440px] overflow-auto">
                  <table className="min-w-max border-collapse text-[9px] font-mono">
                    <thead className="sticky top-0 z-10 bg-surface-elevated text-text-muted">
                      <tr>
                        <th className="sticky left-0 z-20 border border-border bg-surface-elevated px-2 py-1">Actual</th>
                        {confusion.classes.map((gloss) => (
                          <th key={gloss} className="border border-border px-2 py-1" title={gloss}>
                            {gloss}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {confusion.matrix.map((row, rowIndex) => (
                        <tr key={confusion.classes?.[rowIndex] ?? rowIndex}>
                          <th className="sticky left-0 border border-border bg-surface-elevated px-2 py-1 text-left text-text-primary">
                            {confusion.classes?.[rowIndex] ?? rowIndex}
                          </th>
                          {row.map((count, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="border border-border px-2 py-1 text-center text-text-secondary"
                              style={{
                                backgroundColor: count
                                  ? `rgba(94, 234, 212, ${Math.min(0.7, 0.12 + count / Math.max(1, ...row) * 0.55)})`
                                  : undefined,
                              }}
                              title={`${confusion.classes?.[rowIndex]} → ${confusion.classes?.[columnIndex]}: ${count}`}
                            >
                              {count}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ) : (
              <p className="text-[10px] font-mono text-text-muted">
                No confusion matrix is available for the active model bundle.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\page.tsx`

```tsx
"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Database, ArrowUpRight } from "lucide-react";
import { statsService, AdminStats } from "@/services/stats";

export default function AdminDashboardPage() {
  const { data: stats, isError: statsError } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => statsService.getAdminStats(),
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">ADMINISTRATION CONSOLE</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            System Overview & Verification Status
          </h1>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded ${stats?.llm_available ? "text-status-approved bg-status-approved/10 border border-status-approved/30" : "text-status-pending bg-status-pending/10 border border-status-pending/30"}`}>
          LLM: {stats?.llm_available ? "ONLINE" : "OFFLINE"} · {stats?.inference_mode?.toUpperCase() ?? "—"}
        </div>
      </div>

      {statsError && (
        <div className="rounded border border-status-error/30 bg-status-error/10 p-3 text-sm text-status-error">
          Could not load admin statistics. Check that the backend is running at the configured API URL.
        </div>
      )}

      {/* Metric Cards — fetched from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Total Signs</div>
          <div className="text-2xl font-bold text-text-primary">{stats?.total_signs ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">Classes in model: {stats?.model_classes ?? "—"}</div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Signs With Avatar Data</div>
          <div className="text-2xl font-bold text-accent-primary">{stats?.avatar_classes ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">Replay assets bundled with the active model</div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Active Model</div>
          <div className="text-lg font-bold text-text-primary truncate">{stats?.model_active ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">
            {stats?.contract?.feature_width ?? 98}-dim · {stats?.contract?.frames ?? 64} frames · {stats?.model_classes ?? "—"} classes
          </div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">LLM Engine</div>
          <div className="text-lg font-bold text-text-primary truncate">{stats?.llm_model ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">{stats?.inference_mode?.toUpperCase() ?? "—"}</div>
        </div>
      </div>

      {/* Quick Launch Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          aria-disabled="true"
          className="p-6 rounded-lg bg-surface border border-border opacity-50 cursor-not-allowed flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-3">
              <CheckSquare size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Contribution Verification</h3>
            <p className="text-xs text-text-secondary mt-1">
              Planned future feature. Not currently active.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-text-muted">
            <span>Coming Soon</span>
          </div>
        </div>

        <Link
          href="/admin/training-data"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-secondary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-3">
              <Database size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Training Data Verification</h3>
            <p className="text-xs text-text-secondary mt-1">
              Review archived model clips, skeleton sequences, and recognition results.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-secondary font-bold">
            <span>Open Training Data</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\settings\page.tsx`

```tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_BASE = "http://localhost:8200";

/**
 * Every row here is read from /api/system/health rather than written by hand.
 *
 * The previous version printed a literal "sign_mlp.onnx (35 classes)" while the
 * server was in fact serving whichever run won the registry scan -- a settings
 * page that lies about the active model is worse than no settings page.
 */
export default function AdminSettingsPage() {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/system/health`)).data,
    refetchInterval: 15000,
  });

  const rows: [string, string][] = [
    ["API PORT", "8200"],
    ["ACTIVE MODEL", `${health?.active_model ?? "—"} (${health?.model_run ?? "—"})`],
    ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? 98}-dim · ${health?.contract?.frames ?? 64} frames`],
    ["ARCHITECTURE", "BiLSTM + Attention (98-dim shoulder box)"],
    ["SIGN VOCABULARY", String(health?.vocabulary_classes ?? 0)],
    ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
    ["AI MODE", health?.ai_mode ?? "offline"],
    ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
    ["MODEL SEQUENCE COVERAGE", `${health?.sequence_coverage?.with_landmark_sequences ?? 0}/${health?.sequence_coverage?.total_classes ?? 0}`],
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">SYSTEM SETTINGS</div>
      <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>

      {health?.model_error && (
        <div className="p-3 rounded-lg border border-status-error/40 bg-status-error/10 text-[10px] font-mono text-status-error">
          {health.model_error}
        </div>
      )}

      <div className="p-6 bg-surface border border-border rounded-lg space-y-3 font-mono text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-primary text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\training-data\page.tsx`

```tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, CircleCheck, CircleX, Search } from "lucide-react";

const API_BASE = "http://localhost:8200";
const GLOSS_LIST_LIMIT = 1000;

interface TrainingGloss {
  gloss: string;
  category: "Alphabet" | "Word";
  dialects: string[];
  clip_count: number;
}

interface TrainingGlossPage {
  items: TrainingGloss[];
  total: number;
  model_id: string | null;
  dialects: string[];
}

interface TrainingClip {
  gloss: string;
  clip_index: number;
  clip_count: number;
  frame_count: number;
  feature_width: number;
  frames: number[][];
  source_video: string | null;
  prediction: string;
  correct: boolean;
  confidence: number;
  top3: { label: string; confidence: number }[];
}

const HAND_COLORS = ["#5EEAD4", "#C4B5FD"];

function TrainingClipView({ clip }: { clip: TrainingClip }) {
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const frame = clip.frames[frameIndex] ?? [];
  const togglePlayback = () => setPlaying((value) => !value);

  React.useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % clip.frame_count);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, clip.frame_count]);

  const toScreen = (x: number, y: number) => ({
    x: 50 + x * 34,
    y: 44 - y * 28,
  });
  const elbows = [0, 1].map((side) =>
    toScreen(frame[82 + side * 2] ?? 0, frame[83 + side * 2] ?? 0),
  );
  const wrists = [0, 1].map((side) =>
    toScreen(frame[78 + side * 2] ?? 0, frame[79 + side * 2] ?? 0),
  );
  const handInUse = [0, 1].map((side) => (frame[95 + side] ?? 0) > 0.5);
  const shoulders = [toScreen(0.5, 0), toScreen(-0.5, 0)];
  const headMouth = toScreen(frame[92] ?? 0, frame[93] ?? 0);

  const renderHand = (handIndex: number) => {
    if (!handInUse[handIndex]) return null;
    const start = handIndex * 33;
    const wrist = { x: frame[78 + handIndex * 2] ?? 0, y: frame[79 + handIndex * 2] ?? 0 };
    const scale = 0.24;
    const points = Array.from({ length: 11 }, (_, pointIndex) => {
      const offset = start + pointIndex * 3;
      const x = frame[offset];
      const y = frame[offset + 1];
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return toScreen(
        wrist.x + scale * x,
        wrist.y + scale * y,
      );
    });
    const fingerSegments: [number, number][] = [
      [1, 2], [3, 4], [5, 6], [7, 8], [9, 10],
    ];
    const palmBaseIndices = [1, 3, 5, 7, 9];
    const palmBases = palmBaseIndices.map((index) => points[index]);
    const palmPath = palmBases.every(Boolean) && points[0]
      ? `M ${points[0].x} ${points[0].y} L ${palmBases[0]!.x} ${palmBases[0]!.y} Q ${palmBases[1]!.x} ${palmBases[1]!.y} ${palmBases[2]!.x} ${palmBases[2]!.y} Q ${palmBases[3]!.x} ${palmBases[3]!.y} ${palmBases[4]!.x} ${palmBases[4]!.y} Z`
      : "";

    return (
      <g
        key={handIndex}
        stroke={HAND_COLORS[handIndex]}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {palmPath && (
          <path
            d={palmPath}
            fill={HAND_COLORS[handIndex]}
            fillOpacity="0.12"
            stroke={HAND_COLORS[handIndex]}
            strokeWidth="0.65"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {fingerSegments.map(([from, to]) => {
          const first = points[from];
          const second = points[to];
          return first && second ? (
            <line
              key={`finger-${from}-${to}`}
              x1={first.x}
              y1={first.y}
              x2={second.x}
              y2={second.y}
              strokeWidth="1.05"
              vectorEffect="non-scaling-stroke"
            />
          ) : null;
        })}
        {points.map((point, index) =>
          point ? (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === 0 ? 1 : index % 2 === 1 ? 0.85 : 0.7}
              fill={HAND_COLORS[handIndex]}
              stroke="#0b0b0d"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
      </g>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${playing ? "Pause" : "Play"} ${clip.gloss} skeleton animation`}
        onClick={togglePlayback}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            togglePlayback();
          }
        }}
        className="relative min-h-[220px] flex-1 cursor-pointer overflow-hidden rounded-lg border border-border bg-background/70 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        title="Click or press Space to play/pause"
      >
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={`${clip.gloss} skeleton, frame ${frameIndex + 1} of ${clip.frame_count}`}
          className="absolute inset-0 h-full w-full"
        >
          <line x1="50" y1="8" x2="50" y2="88" stroke="currentColor" opacity="0.08" />
          <line x1="19" y1="44" x2="81" y2="44" stroke="currentColor" opacity="0.08" />
          <g stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d={`M ${shoulders[0].x} ${shoulders[0].y} L ${shoulders[1].x} ${shoulders[1].y}`} />
            <path d={`M ${shoulders[0].x} ${shoulders[0].y} L ${elbows[0].x} ${elbows[0].y}${handInUse[0] ? ` L ${wrists[0].x} ${wrists[0].y}` : ""}`} />
            <path d={`M ${shoulders[1].x} ${shoulders[1].y} L ${elbows[1].x} ${elbows[1].y}${handInUse[1] ? ` L ${wrists[1].x} ${wrists[1].y}` : ""}`} />
            <path d="M 40 70 L 60 70 M 50 32 L 50 70" opacity="0.6" />
          </g>
          <g fill="#818CF8">
            {[...shoulders, ...elbows, ...wrists].map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={index < 2 ? 2 : 1.5} />
            ))}
          </g>
          <ellipse
            cx={headMouth.x}
            cy={headMouth.y - 5}
            rx="4.3"
            ry="6.3"
            fill="#818CF8"
            fillOpacity="0.14"
            stroke="#818CF8"
            strokeWidth="1.2"
          />
          <circle cx={headMouth.x} cy={headMouth.y} r="0.7" fill="#818CF8" />
          {renderHand(0)}
          {renderHand(1)}
        </svg>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-background/70 px-2 py-1 text-[9px] font-mono text-text-muted">
          CLICK / SPACE {playing ? "TO PAUSE" : "TO PLAY"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <input
          type="range"
          min={0}
          max={Math.max(0, clip.frame_count - 1)}
          value={frameIndex}
          onChange={(event) => {
            setPlaying(false);
            setFrameIndex(Number(event.target.value));
          }}
          aria-label="Training clip frame"
          className="m-0 min-w-0 flex-1 accent-[var(--accent-primary)]"
        />
        <span className="w-16 text-right text-[9px] font-mono text-text-muted">
          {frameIndex + 1} / {clip.frame_count}
        </span>
      </div>
    </div>
  );
}

export default function AdminTrainingDataPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [dialect, setDialect] = React.useState("");
  const [selectedGloss, setSelectedGloss] = React.useState("");
  const [clipIndex, setClipIndex] = React.useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["model-training-data", search, category, dialect],
    queryFn: async () =>
      (
        await axios.get<TrainingGlossPage>(
          `${API_BASE}/api/admin/model/training-data`,
          { params: { page: 1, limit: GLOSS_LIST_LIMIT, search, category, dialect } },
        )
      ).data,
    refetchInterval: 15000,
  });

  const currentGloss = data?.items.some((item) => item.gloss === selectedGloss)
    ? selectedGloss
    : data?.items[0]?.gloss ?? "";
  const currentClipIndex = currentGloss === selectedGloss ? clipIndex : 0;

  const {
    data: clip,
    isLoading: clipLoading,
    isError: clipError,
  } = useQuery({
    queryKey: ["model-training-clip", data?.model_id, currentGloss, currentClipIndex],
    queryFn: async () =>
      (
        await axios.get<TrainingClip>(
          `${API_BASE}/api/admin/model/training-data/${encodeURIComponent(currentGloss)}/clips/${currentClipIndex}`,
        )
      ).data,
    enabled: Boolean(currentGloss),
    retry: false,
  });

  const selectGloss = (gloss: string) => {
    setSelectedGloss(gloss);
    setClipIndex(0);
  };

  const handleNavigationKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const selectedItem = data?.items.find((item) => item.gloss === currentGloss);
      const maxClip = Math.max(0, (selectedItem?.clip_count ?? clip?.clip_count ?? 1) - 1);
      event.preventDefault();
      setClipIndex((index) =>
        event.key === "ArrowLeft" ? Math.max(0, index - 1) : Math.min(maxClip, index + 1),
      );
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const glosses = data?.items ?? [];
      if (glosses.length === 0) return;
      const currentIndex = glosses.findIndex((item) => item.gloss === currentGloss);
      const nextIndex = event.key === "ArrowUp"
        ? Math.max(0, currentIndex - 1)
        : Math.min(glosses.length - 1, currentIndex + 1);
      event.preventDefault();
      selectGloss(glosses[nextIndex].gloss);
    }
  };

  return (
    <div
      className="mx-auto flex h-full min-h-[480px] max-w-7xl flex-col gap-4"
      onKeyDown={handleNavigationKeys}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <h1 className="text-xl font-bold text-text-primary">Training Data</h1>
        <span className="rounded border border-border bg-surface px-2.5 py-1 text-[10px] font-mono text-text-muted">
          MODEL {data?.model_id ?? "—"}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search glosses"
            aria-label="Search glosses"
            className="w-full rounded border border-border bg-surface py-2 pl-9 pr-3 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </label>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
          aria-label="Filter by category"
          className="rounded border border-border bg-surface px-3 py-2 text-[10px] font-mono text-text-secondary focus:border-accent-primary focus:outline-none"
        >
          <option value="">All categories</option>
          <option value="Alphabet">Alphabet</option>
          <option value="Word">Word</option>
        </select>
        <select
          value={dialect}
          onChange={(event) => {
            setDialect(event.target.value);
          }}
          aria-label="Filter by dialect"
          title="Filter using dialect/source labels saved in the model archive"
          className="rounded border border-border bg-surface px-3 py-2 text-[10px] font-mono text-text-secondary focus:border-accent-primary focus:outline-none"
        >
          <option value="">All dialects</option>
          {data?.dialects.map((availableDialect) => (
            <option key={availableDialect} value={availableDialect}>{availableDialect}</option>
          ))}
        </select>
        <span className="px-2 text-[10px] font-mono text-text-muted">{data?.total ?? 0} glosses</span>
      </div>

      {isError && (
        <div className="rounded border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
          Could not load the active model&apos;s archived training clips.
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[10px] font-mono uppercase text-text-muted">
            <span>Glosses</span>
            <span className="flex items-center gap-2">
              <span>{data?.total ?? 0}</span>
              <span className="normal-case tracking-normal text-text-muted/70" title="Use Up and Down arrows to change gloss">↑ ↓</span>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="p-4 text-xs font-mono text-text-muted">Loading…</div>
            ) : data?.items.length ? (
              data.items.map((item) => (
                <button
                  key={item.gloss}
                  type="button"
                  onClick={() => selectGloss(item.gloss)}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2.5 text-left text-xs font-mono last:border-0 ${
                    currentGloss === item.gloss
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:bg-surface-elevated"
                  }`}
                >
                  <span className="truncate">{item.gloss}</span>
                  <span className="shrink-0 text-[9px] text-text-muted">{item.clip_count}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-xs font-mono leading-relaxed text-text-muted">
                {search
                  ? "No matching glosses."
                  : "No archived training data."}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 min-w-0 flex-col rounded-lg border border-border bg-surface p-3 sm:p-4">
          {clip ? (
            <>
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text-primary">{clip.gloss}</div>
                  </div>
                  <div className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-mono font-bold ${
                    clip.correct
                      ? "border-status-approved/30 bg-status-approved/10 text-status-approved"
                      : "border-status-error/30 bg-status-error/10 text-status-error"
                  }`}>
                    {clip.correct ? <CircleCheck size={11} /> : <CircleX size={11} />}
                    {clip.correct ? "MATCH" : "MISMATCH"} · {Math.round(clip.confidence * 100)}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setClipIndex((value) => Math.max(0, value - 1))}
                    disabled={clipIndex <= 0}
                    className="rounded border border-border p-1.5 text-text-secondary disabled:opacity-30"
                    aria-label="Previous training clip (left arrow)"
                    title="Previous clip (←)"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClipIndex((value) => Math.min(clip.clip_count - 1, value + 1))}
                    disabled={clipIndex >= clip.clip_count - 1}
                    className="rounded border border-border p-1.5 text-text-secondary disabled:opacity-30"
                    aria-label="Next training clip (right arrow)"
                    title="Next clip (→)"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <span className="whitespace-nowrap text-[9px] font-mono text-text-muted">
                    Clip {clip.clip_index + 1} / {clip.clip_count}
                  </span>
                </div>
              </div>
              <TrainingClipView key={`${clip.gloss}-${clip.clip_index}`} clip={clip} />
              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-2 text-[9px] font-mono text-text-muted">
                <span>Expected <strong className="text-text-secondary">{clip.gloss}</strong></span>
                <span>Predicted <strong className={clip.correct ? "text-status-approved" : "text-status-error"}>{clip.prediction}</strong></span>
                {clip.source_video && (
                  <span className="max-w-[220px] truncate" title={clip.source_video}>
                    Source {clip.source_video}
                  </span>
                )}
                <span className="ml-auto text-[8px]">Training clip · not validation accuracy</span>
                <div className="flex w-full flex-wrap gap-x-4 gap-y-1.5">
                  {clip.top3.map((item, index) => {
                    const confidence = Math.max(0, Math.min(100, item.confidence * 100));
                    return (
                      <div key={item.label} className="flex min-w-[120px] flex-1 items-center gap-2">
                        <span className="w-24 truncate text-text-secondary" title={item.label}>{item.label}</span>
                        <div
                          className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border"
                          role="meter"
                          aria-label={`${item.label} confidence`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(confidence)}
                        >
                          <div
                            className={`h-full rounded-full ${index === 0 ? "bg-accent-primary" : "bg-text-muted/60"}`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="w-8 text-right">{Math.round(confidence)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[220px] flex-1 items-center justify-center text-center text-xs font-mono text-text-muted">
              {clipLoading
                ? "Loading clip…"
                : clipError
                  ? "Could not load clip."
                  : "Select a gloss to view clips."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\videos\page.tsx`

```tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";

const API_BASE = "http://localhost:8200";

interface ModelSign {
  label: string;
  bengali: string;
}

interface LandmarkReplay {
  frames: number[][][];
  pose?: [number, number, number, number][][];
  face_avatar?: number[][][];
  source: string;
}

export default function ModelSimulationPage() {
  const [active, setActive] = React.useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["coverage"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/coverage`)).data,
  });
  const signs: ModelSign[] = data?.items ?? [];
  const current = signs.find((sign) => sign.label === active) ?? signs[0];

  const { data: replay, isLoading: replayLoading, isError: replayError } = useQuery({
    queryKey: ["model-simulation", current?.label],
    queryFn: async () => (await axios.get<LandmarkReplay>(
      `${API_BASE}/api/simulation/frames`,
      { params: { label: current!.label } },
    )).data,
    enabled: !!current,
    retry: false,
  });

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="text-xs font-mono uppercase text-text-muted">AVATAR DATA SIMULATION</div>
      <h1 className="text-2xl font-bold text-text-primary">Avatar Landmark Inspector</h1>
      <p className="text-xs text-text-secondary">
        These sequences are read directly from {data?.active_model ?? "the active model"} and match its recognition vocabulary.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="bg-surface border border-border rounded-lg overflow-y-auto max-h-[560px]">
          {isLoading ? (
            <div className="p-4 text-xs font-mono text-text-muted">Loading active model vocabulary...</div>
          ) : isError ? (
            <div className="p-4 text-xs font-mono text-status-error">Could not load model vocabulary.</div>
          ) : signs.map((sign) => (
            <button
              key={sign.label}
              type="button"
              onClick={() => setActive(sign.label)}
              className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-border ${
                current?.label === sign.label
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {sign.label}
            </button>
          ))}
          {!isLoading && !isError && signs.length === 0 && (
            <div className="p-4 text-xs font-mono text-text-muted">
              The active model has no bundled landmark sequences.
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          {replay ? (
            <>
              <LandmarkSimulation
                key={`${current?.label}-${replay.source}`}
                frames={replay.frames}
                pose={replay.pose}
                faceAvatar={replay.face_avatar}
                fps={15}
                title={replay.source}
              />
              <div className="mt-3 text-[10px] font-mono text-text-muted">
                {current?.label} · {current?.bengali}
              </div>
            </>
          ) : (
            <div className="aspect-video flex items-center justify-center text-center px-5 text-xs font-mono text-text-muted">
              {replayLoading
                ? "Loading bundled landmark sequence..."
                : replayError
                ? "Could not load this model sequence."
                : "Select a model sign to simulate."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\demo\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { Volume2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function StandaloneDemoPage() {
  const [activePreset, setActivePreset] = useState("greeting");
  const [bengaliOutput, setBengaliOutput] = useState("নমস্কার, আপনি কেমন আছেন?");
  const [sequence, setSequence] = useState(["HELLO", "YOU", "HOW"]);

  const presets = [
    {
      id: "greeting",
      name: "Greeting & Inquiry",
      bengali: "নমস্কার, আপনি কেমন আছেন?",
      sequence: ["HELLO", "YOU", "HOW"],
    },
    {
      id: "emergency",
      name: "Emergency Need",
      bengali: "আমার জরুরি ডাক্তার এবং জল দরকার।",
      sequence: ["ME", "EMERGENCY", "DOCTOR", "WATER", "NEED"],
    },
    {
      id: "direction",
      name: "Direction Inquiry",
      bengali: "রেল স্টেশন কোথায়?",
      sequence: ["TRAIN", "STATION", "WHERE"],
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setActivePreset(p.id);
    setBengaliOutput(p.bengali);
    setSequence(p.sequence);
    toast.success(`Loaded preset: ${p.name}`);
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(bengaliOutput);
      u.lang = "bn-IN";
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-secondary uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-secondary" />
            <span>STANDALONE PRESENTATION SUITE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Offline Demo Route
          </h1>
        </div>

        {/* Demo Mode Badge per Section 9.8 */}
        <div className="px-3 py-1 bg-accent-secondary text-white font-mono text-xs font-bold rounded">
          DEMO MODE ACTIVE
        </div>
      </div>

      {/* Presentation Warning / Safety Banner */}
      <div className="p-3.5 rounded bg-surface border border-border text-xs text-text-secondary font-mono flex items-center space-x-2">
        <AlertCircle size={15} className="text-accent-secondary shrink-0" />
        <span>
          Runs full AI pipeline using pre-recorded kinematic sequences from the actual dataset without requiring webcam or live backend socket.
        </span>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className={`p-4 rounded-lg border text-left transition-all ${
              activePreset === p.id
                ? "bg-accent-secondary/15 border-accent-secondary text-text-primary"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="font-mono text-xs font-bold">{p.name}</div>
            <div className="font-bengali text-sm text-text-muted mt-1">{p.bengali}</div>
          </button>
        ))}
      </div>

      {/* Canvas Landmark Player */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase text-text-muted">
          Pre-Recorded Coordinate Stream
        </div>
        <LandmarkSimulation fps={30} />
      </div>

      {/* Output Display */}
      <div className="p-6 rounded-lg bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase text-text-muted">Synthesized Bengali Translation</div>
          <p className="bengali-text text-3xl font-bold text-text-primary">{bengaliOutput}</p>
          <div className="flex gap-2 pt-2">
            {sequence.map((g, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-surface-elevated font-mono text-xs text-accent-primary">
                [{g}]
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className="flex items-center space-x-2 px-6 py-3 rounded-md bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors shrink-0"
        >
          <Volume2 size={16} />
          <span>Play Voice</span>
        </button>
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 7%;
    --foreground: 240 5% 96%;

    --card: 222 35% 9%;
    --card-foreground: 240 5% 96%;

    --popover: 222 35% 10%;
    --popover-foreground: 240 5% 96%;

    --primary: 142 71% 45%;
    --primary-foreground: 0 0% 100%;

    --secondary: 239 84% 67%;
    --secondary-foreground: 0 0% 100%;

    --muted: 222 20% 15%;
    --muted-foreground: 240 5% 65%;

    --accent: 222 20% 15%;
    --accent-foreground: 240 5% 96%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 222 20% 16%;
    --input: 222 20% 16%;
    --ring: 142 71% 45%;

    --radius: 0.5rem;
  }
}

/* =========================================
   BODY
========================================= */

body {
  background: #080b12;
  color: #f4f4f5;
  font-family: var(--font-inter), sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* =========================================
   WBSL BRIDGE BACKGROUND
========================================= */

body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;

  background:
    radial-gradient(
      ellipse 55% 55% at 50% 15%,
      rgba(10, 74, 110, 0.42) 0%,
      rgba(7, 42, 68, 0.25) 30%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 48% 42% at 62% 55%,
      rgba(0, 105, 65, 0.28) 0%,
      rgba(0, 65, 48, 0.16) 30%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 55% 45% at 25% 55%,
      rgba(20, 20, 75, 0.24) 0%,
      transparent 70%
    ),
    linear-gradient(
      180deg,
      #09111c 0%,
      #080d17 45%,
      #08090d 100%
    );
}

/* =========================================
   SUBTLE GLOBAL LIGHT
========================================= */

body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -9;
  pointer-events: none;

  background:
    radial-gradient(
      circle at 50% 42%,
      rgba(0, 255, 120, 0.045),
      transparent 32%
    );

  mix-blend-mode: screen;
}

/* =========================================
   CUSTOM SCROLLBAR
========================================= */

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #08090d;
}

::-webkit-scrollbar-thumb {
  background: #1b2029;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #292f39;
}

/* =========================================
   BENGALI OUTPUT
========================================= */

.bengali-text {
  font-family: var(--font-noto-bengali), sans-serif;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

/* =========================================
   TECHNICAL MONOSPACE
========================================= */

.tech-mono {
  font-family: var(--font-jetbrains-mono), monospace;
}

/* =========================================
   PREMIUM BACKGROUND VIDEO
========================================= */

.bg-video-premium-blur {
  filter:
    blur(1px)
    saturate(125%)
    contrast(106%)
    brightness(0.72);

  transform: scale(1.06);
  transform-origin: center;

  will-change: transform, filter;
}

@media (prefers-reduced-motion: reduce) {
  .bg-video-premium-blur {
    filter: blur(1px) brightness(0.62);
  }
}

/* =========================================
   GRID BACKGROUND
========================================= */

.canvas-grid-bg {
  background-image:
    linear-gradient(
      to right,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    );

  background-size: 20px 20px;
}
```

---

# FILE: `frontend\src\app\layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppSidebar } from "@/components/layout/AppSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-bengali",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WBSL Bridge — West Bengal Sign Language Translation & Research Framework",
  description:
    "Computational framework for real-time West Bengal Sign Language recognition, non-manual marker analysis, and native Bengali NLG synthesis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansBengali.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

---

# FILE: `frontend\src\app\login\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { setAuthToken } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setAuthToken(apiKey.trim());
    toast.success("Researcher credentials authorized");
    router.push("/admin");
  };

  return (
    <PageContainer className="py-20 max-w-md mx-auto">
      <div className="bg-surface border border-border p-8 rounded-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-elevated border border-border flex items-center justify-center text-accent-primary">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Researcher Authentication
          </h1>
          <p className="text-xs text-text-secondary">
            Access internal verification controls and ML training consoles
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-text-secondary mb-1">
              Researcher Bearer Token
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter authorization key..."
              className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors"
          >
            Authenticate Session
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-text-muted">
          For demo purposes, any token string provides admin workspace access.
        </div>
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\page.tsx`

```tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Video,
  FileText,
  Sparkles,
  Volume2,
  Users,
  HelpCircle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <main className="relative h-[calc(100dvh-68px)] min-h-[560px] w-full overflow-hidden bg-background">
      {/* =====================================================
          BACKGROUND
         ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className="
            bg-video-premium-blur
            absolute
            inset-0
            h-full
            w-full
            select-none
            object-cover
            opacity-[0.75]
          "
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Legibility */}
        <div className="absolute inset-0 bg-background/35" />

        {/* Brand wash */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-emerald-500/[0.04]
            via-background/20
            to-background/60
          "
        />

        {/* Vignette */}
        <div
          className="
            absolute
            inset-0
            [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,11,0.72)_100%)]
          "
        />

        {/* Grain */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            mix-blend-overlay
            [background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]
          "
        />

        {/* Main glow */}
        <div
          className="
            absolute
            left-1/2
            top-[-10%]
            h-[45vh]
            w-[70vw]
            -translate-x-1/2
            rounded-full
            bg-emerald-400/[0.07]
            blur-[120px]
          "
        />

        {/* Left glow */}
        <div
          className="
            absolute
            left-[-15%]
            top-[45%]
            h-[35vh]
            w-[35vw]
            rounded-full
            bg-accent-secondary/[0.06]
            blur-[120px]
          "
        />

        {/* Right glow */}
        <div
          className="
            absolute
            right-[-15%]
            top-[45%]
            h-[35vh]
            w-[35vw]
            rounded-full
            bg-emerald-500/[0.06]
            blur-[120px]
          "
        />

        {/* Grid */}
        <div
          className="
            canvas-grid-bg
            absolute
            inset-0
            opacity-[0.09]
            [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[25%]
            bg-gradient-to-t
            from-background
            via-background/70
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
         ===================================================== */}
      <PageContainer className="relative z-10 h-full w-full">
        <div
          className="
            flex
            h-full
            w-full
            flex-col
            justify-center
            py-5
            sm:py-6
            lg:py-8
          "
        >
          {/* =================================================
              DESKTOP / RESPONSIVE HERO
             ================================================= */}
          <div
            className="
              grid
              w-full
              items-center
              gap-6
              lg:grid-cols-[1fr_1fr]
              lg:gap-10
              xl:grid-cols-[1.05fr_0.95fr]
              xl:gap-12
            "
          >
            {/* =================================================
                LEFT — LOGO
               ================================================= */}
            <div
              className="
                relative
                flex
                h-[30vh]
                min-h-[190px]
                w-full
                items-center
                justify-center
                lg:h-[62vh]
                lg:min-h-[430px]
              "
            >
              {/* Logo glow */}
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[75%]
                  w-[75%]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-emerald-400/[0.035]
                  blur-[80px]
                "
              />

              <Image
                src="/WBSL%20Bridge%20logo.png"
                alt="WBSL Bridge"
                width={1300}
                height={700}
                priority
                className="
                  relative
                  z-10
                  block
                  h-full
                  w-auto
                  max-w-[92%]
                  object-contain
                  object-center
                  drop-shadow-[0_15px_55px_rgba(0,0,0,0.58)]
                "
                sizes="(min-width: 1024px) 48vw, 95vw"
              />
            </div>

            {/* =================================================
                RIGHT — CONTENT
               ================================================= */}
            <div
              className="
                flex
                w-full
                flex-col
                items-center
                text-center
                lg:items-start
                lg:text-left
              "
            >
              {/* Status */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-emerald-500/25
                  bg-surface/80
                  px-3
                  py-1
                  shadow-[0_0_25px_rgba(34,197,94,0.08)]
                  backdrop-blur-xl
                "
              >
                <Sparkles
                  size={12}
                  className="text-accent-primary"
                />

                <span
                  className="
                    font-mono
                    text-[9px]
                    font-semibold
                    text-accent-primary
                    sm:text-[10px]
                  "
                >
                  WBSL BRIDGE
                </span>

                <span className="text-[10px] text-text-muted">
                  /
                </span>

                <span className="text-[9px] text-text-secondary sm:text-[10px]">
                  Neural Sign Translation
                </span>
              </div>

              {/* Heading */}
              <div className="mt-4 sm:mt-5">
                <h1
                  className="
                    max-w-2xl
                    text-[2rem]
                    font-extrabold
                    leading-[1.06]
                    tracking-[-0.04em]
                    text-text-primary
                    sm:text-[2.4rem]
                    md:text-[2.8rem]
                    lg:text-[3rem]
                    xl:text-[3.35rem]
                  "
                >
                  A Sign Language
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-emerald-400
                      via-teal-300
                      to-indigo-400
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Bridge for Every Signer
                  </span>

                  <br />

                  <span className="text-text-primary">
                    in West Bengal
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-text-secondary
                  sm:text-[15px]
                "
              >
                Real-time sign language communication with Bengali
                translation, reverse sign synthesis, and community-driven
                vocabulary growth.
              </p>

              {/* =================================================
                  FEATURE ROW
                 ================================================= */}
              <div
                className="
                  mt-5
                  flex
                  w-full
                  max-w-[660px]
                  gap-2
                  overflow-visible
                "
              >
                <Feature
                  icon={<Video size={12} />}
                  text="Sign → Bengali"
                  color="primary"
                />

                <Feature
                  icon={<Volume2 size={12} />}
                  text="Bengali → Sign"
                  color="secondary"
                />

                <Feature
                  icon={<Users size={12} />}
                  text="Community Growth"
                  color="sky"
                />

                <Feature
                  icon={<HelpCircle size={12} />}
                  text="Unknown Signs"
                  color="unknown"
                />
              </div>

              {/* =================================================
                  ACTION BUTTONS
                 ================================================= */}
              <div
                className="
                  mt-6
                  flex
                  w-full
                  max-w-[660px]
                  flex-col
                  gap-2.5
                  sm:flex-row
                "
              >
                <Link
                  href="/sign-to-text"
                  className="
                    group
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-accent-primary
                    px-5
                    py-3
                    text-xs
                    font-semibold
                    text-black
                    shadow-[0_0_22px_rgba(34,197,94,0.22)]
                    transition-all
                    hover:bg-emerald-400
                    hover:shadow-[0_0_32px_rgba(34,197,94,0.4)]
                    active:scale-[0.98]
                    sm:text-sm
                  "
                >
                  <Video size={14} />

                  <span>
                    Launch Live Sign Monitor
                  </span>

                  <ArrowRight
                    size={14}
                    className="
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </Link>

                <Link
                  href="/text-to-sign"
                  className="
                    inline-flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-border
                    bg-surface/70
                    px-5
                    py-3
                    text-xs
                    font-medium
                    text-text-primary
                    backdrop-blur-xl
                    transition-all
                    hover:border-text-secondary/40
                    hover:bg-surface-elevated
                    active:scale-[0.98]
                    sm:text-sm
                  "
                >
                  <FileText
                    size={14}
                    className="text-text-secondary"
                  />

                  <span>
                    Bengali → Sign Synthesis
                  </span>
                </Link>
              </div>

              {/* System status */}
              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.16em]
                  text-text-muted
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-accent-primary
                    shadow-[0_0_8px_rgba(34,197,94,0.6)]
                  "
                />

                <span>
                  ISL or BdSL or WBSL or HomeSL? We support all!
                </span>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

/* ============================================================
   FEATURE COMPONENT
   ============================================================ */

function Feature({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: "primary" | "secondary" | "sky" | "unknown";
}) {
  const styles = {
    primary: {
      icon: "bg-accent-primary/10 text-accent-primary",
      hover: "hover:border-accent-primary/40",
    },
    secondary: {
      icon: "bg-accent-secondary/10 text-accent-secondary",
      hover: "hover:border-accent-secondary/40",
    },
    sky: {
      icon: "bg-sky-500/10 text-sky-400",
      hover: "hover:border-sky-500/40",
    },
    unknown: {
      icon: "bg-status-unknown/10 text-status-unknown",
      hover: "hover:border-status-unknown/40",
    },
  };

  return (
    <div
      className={`
        flex
        min-w-[145px]
        flex-1
        items-center
        justify-center
        gap-1.5
        rounded-md
        border
        border-border
        bg-surface/70
        px-2.5
        py-2
        backdrop-blur-xl
        transition-colors
        ${styles[color].hover}
      `}
    >
      <div
        className={`
          shrink-0
          rounded
          p-1
          ${styles[color].icon}
        `}
      >
        {icon}
      </div>

      <span
        className="
          whitespace-nowrap
          text-[10px]
          font-medium
          text-text-primary
        "
      >
        {text}
      </span>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\providers.tsx`

```tsx
"use client";
import "@/lib/threeSetup";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#141416",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#F4F4F5",
            fontFamily: "var(--font-inter), sans-serif",
          },
        }}
      />
    </QueryClientProvider>
  );
}
```

---

# FILE: `frontend\src\app\sign-to-text\page.tsx`

```tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmotionPanel } from "@/components/sign/EmotionPanel";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
import {
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface Prediction {
  detected: boolean;
  label: string;
  confidence: number;
  top5: { label: string; confidence: number }[];
  emotion?: EmotionResult | null;
}

interface EmotionResultShape {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

type EmotionResult = EmotionResultShape;

function summarizeEmotionCounts(counts: Record<string, number>): EmotionResult | null {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  if (!total) return null;
  const scores = Object.fromEntries(
    Object.entries(counts).map(([name, count]) => [name, count / total]),
  );
  const [dominant, confidence] = Object.entries(counts)
    .sort((left, right) => right[1] - left[1])[0];
  return { dominant, confidence: confidence / total, scores };
}

interface DetectedSign {
  gloss: string;
}

interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: EmotionResult | null;
  detail?: string;
  buffered?: number;
  state?: string;
  hands_detected?: number;
  top3?: { label: string; confidence: number }[];
}

interface CatalogSign {
  label: string;
  bengali_meaning?: string;
}

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  // One id per page visit. The server keys its landmark ring buffer on this, so
  // the recognition window survives React re-renders and only the client can
  // decide when it should be abandoned (which is what "Clear" does).
  //
  // Seeded in an effect rather than in the initialiser: reading the clock or the
  // crypto device during render is not idempotent, and a ref initialiser runs on
  // every render attempt (including the ones React discards), so it must not do
  // anything observable. Nothing is sent to the server before the camera starts,
  // so the id is always in place before it is first used.
  const sessionIdRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : "pending-session"
  );

  const newSessionId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    sessionIdRef.current = newSessionId();
  }, []);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [detectedHistory, setDetectedHistory] = useState<DetectedSign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [handsDetected, setHandsDetected] = useState(0);

  const [live, setLive] = useState<{
    label: string;
    confidence: number;
    margin: number;
  } | null>(null);

  const [autoDetect, setAutoDetect] = useState(true);
  const autoDetectRef = useRef(autoDetect);
  const [recognitionMode, setRecognitionMode] = useState<"auto" | "manual">("auto");
  const recognitionModeRef = useRef(recognitionMode);
  const [manualRecording, setManualRecording] = useState(false);
  const manualRecordingRef = useRef(false);
  const [streamState, setStreamState] = useState("IDLE");
  const [recognitionNotice, setRecognitionNotice] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogSign[]>([]);
  const [pickSign, setPickSign] = useState("");
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [emotionAvailable, setEmotionAvailable] = useState(true);
  const [emotionCounts, setEmotionCounts] = useState<Record<string, number>>({});
  const emotionCountsRef = useRef<Record<string, number>>({});
  const emotionCollectionActiveRef = useRef(false);
  const emotionSummary = summarizeEmotionCounts(emotionCounts);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.15);
  const confidenceThresholdRef = useRef(confidenceThreshold);

  // How deep the SERVER's buffer is. The client does not track this itself: it
  // uploads one frame per tick and the server reports what it holds.
  const [buffered, setBuffered] = useState(0);

  const [bengaliOutput, setBengaliOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<string>("1");
  const [ttsEngine, setTtsEngine] = useState<"free" | "elevenlabs">("free");
  const [showTtsPremiumModal, setShowTtsPremiumModal] = useState(false);
  const [contract, setContract] = useState<{
    frames: number;
    feature_width?: number | null;
  }>({
    frames: 64,
    feature_width: 98,
  });

  useEffect(() => {
    autoDetectRef.current = autoDetect;
  }, [autoDetect]);
  useEffect(() => {
    confidenceThresholdRef.current = confidenceThreshold;
  }, [confidenceThreshold]);
  useEffect(() => {
    recognitionModeRef.current = recognitionMode;
  }, [recognitionMode]);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/system/health`)
      .then((res) => {
        if (cancelled) return;

        setBackendOnline(true);
        setEmotionAvailable(!!res.data.emotion_available);

        if (res.data.contract) {
          setContract(res.data.contract);
        }
      })
      .catch(() => {
        if (!cancelled) setBackendOnline(false);
      });

    axios
      .get(`${API_BASE}/api/coverage`)
      .then((res) => {
        if (cancelled) return;

        const items: CatalogSign[] = res.data.items ?? [];

        setCatalog(items);

        if (items.length) {
          setPickSign(items[0].label);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const changeRecognitionMode = (mode: "auto" | "manual") => {
    if (manualRecordingRef.current || isProcessingRef.current) return;
    recognitionModeRef.current = mode;
    setRecognitionMode(mode);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
    setLive(null);
    setRecognitionNotice(null);
  };

  const toggleManualRecording = () => {
    if (!cameraActive) return;
    const next = !manualRecordingRef.current;
    manualRecordingRef.current = next;
    setManualRecording(next);
    if (next) {
      setPrediction(null);
      setLive(null);
      setBuffered(0);
    }
    setRecognitionNotice(null);
  };

  const startCamera = async () => {
    setCameraError(null);

    try {
      sessionIdRef.current = newSessionId();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);

      if (!intervalRef.current) {
        intervalRef.current = setInterval(
          () => void doStreamTick(performance.now() / 1000),
          100
        );
      }
    } catch {
      setCameraError(
        "Camera unavailable. Check browser permissions and try again."
      );

      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (manualRecordingRef.current) {
      setRecognitionNotice("Stop the manual recording before turning off the camera.");
      return;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraActive(false);
    sessionIdRef.current = newSessionId();
    setBuffered(0);
    setStreamState("IDLE");
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const buildGlossString = (history: DetectedSign[]) => {
    if (history.length === 0) return "";
    return history.map((sign) => `[${sign.gloss.toLowerCase()}]`).join(" + ");
  };

  const resetEmotionCollection = () => {
    emotionCountsRef.current = {};
    setEmotionCounts({});
  };

  const recordEmotionSample = (sample: EmotionResult | null | undefined) => {
    if (!sample?.dominant) return;
    const next = {
      ...emotionCountsRef.current,
      [sample.dominant]: (emotionCountsRef.current[sample.dominant] ?? 0) + 1,
    };
    emotionCountsRef.current = next;
    setEmotionCounts(next);
  };

  const handleStreamAndSpeak = async () => {
    if (
      detectedHistory.length === 0 ||
      isGenerating
    ) {
      return;
    }

    setIsGenerating(true);
    setBengaliOutput("");

    let full = "";
    const translationEmotion = summarizeEmotionCounts(emotionCountsRef.current);
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();

    try {
      const gloss = buildGlossString(
        detectedHistory
      );

      const response = await fetch(
        `${API_BASE}/api/nlg/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ gloss, emotion: translationEmotion }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("stream unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const data = line
            .slice(6)
            .trim();

          if (data === "[DONE]") {
            continue;
          }

          try {
            const parsed = JSON.parse(data);

            if (
              parsed.type === "delta" &&
              parsed.text
            ) {
              full += parsed.text;
              setBengaliOutput(full);
            } else if (
              parsed.type === "done" &&
              parsed.bengali_text
            ) {
              full = parsed.bengali_text;
              setBengaliOutput(full);
            } else if (
              parsed.type === "error"
            ) {
              toast.error(
                parsed.error || "LLM error"
              );
            }
          } catch {
            // Ignore malformed SSE chunk.
          }
        }
      }
    } catch {
      toast.error(
        "Streaming failed — check LLM configuration in .env"
      );
    } finally {
      setIsGenerating(false);
    }

    const text = full.trim();

    if (!text) return;

    setIsPlayingAudio(true);

    try {
      const res = await axios.post<{
        audio_url: string | null;
        engine: string;
        status: string;
        error?: string;
      }>(
        `${API_BASE}/api/tts/generate`,
        {
          text,
          voice: voiceId,
          engine: ttsEngine,
        }
      );

      if (res.data.status === "success" && res.data.audio_url) {
        const audio = new Audio(
          `${API_BASE}${res.data.audio_url}`
        );

        audio.onended = () =>
          setIsPlayingAudio(false);

        audio.onerror = () =>
          setIsPlayingAudio(false);

        await audio.play();
        return;
      } else if (ttsEngine === "elevenlabs") {
        toast.error(res.data.error || "ElevenLabs TTS failed to generate audio.");
        setIsPlayingAudio(false);
        return;
      }
    } catch (err: unknown) {
      if (ttsEngine === "elevenlabs") {
        const errorMsg = axios.isAxiosError(err)
          ? err.response?.data?.detail || err.message
          : "ElevenLabs TTS request failed";
        toast.error(`ElevenLabs TTS Error: ${errorMsg}`);
        setIsPlayingAudio(false);
        return;
      }
      // Free mode: fall through to browser SpeechSynthesis
    }

    if (ttsEngine === "free" && "speechSynthesis" in window) {
      const u =
        new SpeechSynthesisUtterance(text);

      u.lang = "bn-IN";

      u.onend = () =>
        setIsPlayingAudio(false);

      u.onerror = () =>
        setIsPlayingAudio(false);

      window.speechSynthesis.speak(u);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const appendGloss = (gloss: string) => {
    if (!emotionCollectionActiveRef.current) {
      resetEmotionCollection();
      emotionCollectionActiveRef.current = true;
    }
    setDetectedHistory((prev) => [...prev, { gloss }]);
  };

  const handleBackspace = () => {
    if (detectedHistory.length === 0) {
      return;
    }

    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();
    setDetectedHistory((prev) =>
      prev.slice(0, -1)
    );

    setBengaliOutput("");
  };

  const handleAddPick = () => {
    if (!pickSign) return;

    appendGloss(pickSign);
    setBengaliOutput("");
  };

  const handleClear = () => {
    setDetectedHistory([]);
    emotionCollectionActiveRef.current = false;
    resetEmotionCollection();
    setPrediction(null);
    setBengaliOutput("");
    setLive(null);
    setRecognitionNotice(null);
    manualRecordingRef.current = false;
    setManualRecording(false);

    // The recognition window lives on the server now, so clearing the sequence
    // has to clear it there too. A fresh session id is the cheapest correct
    // reset: the old buffer is abandoned rather than mutated, and the next tick
    // starts from an empty window instead of reading the sign the user just
    // deleted.
    sessionIdRef.current = newSessionId();

    setBuffered(0);
    setStreamState("IDLE");
  };

  /** Apply one completed span returned by the server's state machine. */
  const commitFromStream = (data: StreamResult) => {
    setStreamState(data.state ?? "IDLE");
    setRecognitionNotice(
      data.detail === "incomplete_span" ? "Hands not clear, try again." : null
    );
    setEmotion(data.emotion ?? null);
    if (data.state === "SIGN" && !emotionCollectionActiveRef.current) {
      resetEmotionCollection();
      emotionCollectionActiveRef.current = true;
    }
    if (emotionCollectionActiveRef.current) {
      recordEmotionSample(data.emotion);
    }

    if (!data.ready || !data.label) {
      setLive(null);
      return;
    }

    const label = data.label;
    const confidence = data.confidence ?? 0;
    const margin = data.margin ?? 0;
    const top3 = data.top3 ?? [];
    const isSign = !["NOT_SURE", "NONE", "BACKGROUND"].includes(label);

    setPrediction({
      detected: isSign,
      label,
      confidence,
      top5: top3.map((t) => ({ label: t.label, confidence: t.confidence })),
      emotion: data.emotion ?? null,
    });

    setLive(isSign ? { label, confidence, margin } : null);
    if (isSign && confidence >= confidenceThresholdRef.current && autoDetectRef.current) {
      appendGloss(label);
    }
  };

  /**
   * One JPEG in, one buffered landmark out.
   *
   * The browser sends the newest frame; the server tracks the sign span and
   * selects the model input when that span completes.
   */
  const doStreamTick = async (captureTime: number) => {
    if (isProcessingRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const scale = Math.min(1, 640 / video.videoWidth);
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create the camera frame.");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7)
      );
      if (!blob) throw new Error("Could not encode the camera frame.");

      const fd = new FormData();

      fd.append("file", blob, "f.jpg");
      fd.append("mode", recognitionModeRef.current);
      fd.append("recording", String(manualRecordingRef.current));
      fd.append("capture_time", String(captureTime));

      const res = await axios.post<StreamResult>(
        `${API_BASE}/api/stream/frame?session_id=${sessionIdRef.current}`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          // A frame the server did not answer in 5 s is a frame the signer has
          // already moved past. Dropping it keeps the tick rate honest instead of
          // queueing requests behind a stalled one.
          timeout: 5000,
        }
      );

      setBuffered(res.data.buffered ?? 0);
      setHandsDetected(res.data.hands_detected ?? 0);
      commitFromStream(res.data);
    } catch (err) {
      console.warn("Recognition stream request failed:", err);
      const detail = axios.isAxiosError(err)
        ? err.response?.data?.detail || err.message
        : err instanceof Error
          ? err.message
          : "Recognition request failed.";
      setRecognitionNotice(`Recognition unavailable: ${detail}`);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const glossPreview = detectedHistory.length
    ? buildGlossString(detectedHistory)
    : "—";

  return (
    <PageContainer className="w-full max-w-[1600px] px-3 sm:px-6 lg:px-8 py-4 lg:py-6">
      {/* OFFLINE NOTIFICATION */}
      {!backendOnline && (
        <div className="mb-4 p-2.5 rounded-xl bg-status-error/10 border border-status-error/30 text-xs font-mono text-status-error flex items-center justify-between">
          <span>Backend is not running. Start: <code className="bg-surface px-1.5 py-0.5 rounded border border-border">uvicorn backend.main:app --reload --port 8200</code></span>
        </div>
      )}

      {/* MAIN WORKSPACE 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_1.1fr] gap-4 lg:gap-6 items-start">

        {/* COLUMN 1: CAMERA & FRAMING */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Camera Feed
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              {cameraActive ? `${buffered} BUFFERED` : "STANDBY"}
            </span>
          </div>

          {/* Camera Viewport Container */}
          <div className="relative w-full aspect-[16/10] bg-black rounded-xl overflow-hidden border border-border shadow-lg flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? "" : "hidden"
              }`}
            />

            {/* SVG Camera Framing Guide (first 5 seconds of camera activation) */}
            <CameraFramingGuide cameraActive={cameraActive} />

            {/* Camera Offline / Permissions state */}
            {!cameraActive && cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center p-4">
                <div className="text-center space-y-2 max-w-xs">
                  <CameraOff size={24} className="mx-auto text-status-error" />
                  <p className="text-xs font-semibold text-text-primary">Camera unavailable</p>
                  <p className="text-[10px] text-text-secondary">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg bg-accent-primary text-black text-[10px] font-mono font-bold hover:brightness-110"
                  >
                    Request Permissions
                  </button>
                </div>
              </div>
            )}

            {/* Camera Inactive placeholder */}
            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 bg-surface/90 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={startCamera}
                  disabled={!backendOnline}
                  className="px-5 py-2 rounded-xl bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start Camera
                </button>
                <p className="text-[10px] font-mono text-text-muted mt-2">
                  Upper body and hand pose will be tracked in real time
                </p>
              </div>
            )}

            {isProcessing && cameraActive && (
              <div className="absolute top-2.5 right-2.5 bg-surface/90 border border-border px-2 py-0.5 rounded text-[9px] font-mono text-status-pending backdrop-blur shadow-sm">
                PROCESSING...
              </div>
            )}
          </div>

          {/* Framing Warning Guidance Area */}
          <FramingWarningArea
            cameraActive={cameraActive}
            handsDetected={handsDetected}
            hasFace={Boolean(emotion)}
            detected={Boolean(prediction?.detected)}
            confidence={prediction?.confidence ?? 0}
          />

          {/* Camera Controls Bar */}
          {cameraActive && (
            <div className="h-9 flex items-center justify-between px-3.5 rounded-xl bg-surface/80">
              <span className="flex items-center gap-2 text-[10px] font-mono text-text-secondary">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                Live Tracking Active
              </span>

              <button
                onClick={stopCamera}
                disabled={manualRecording}
                title={manualRecording ? "Stop the recording before stopping the camera" : undefined}
                className="px-2.5 py-1 rounded-lg bg-status-error/15 border border-status-error/40 text-status-error text-[10px] font-mono font-bold hover:bg-status-error/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                STOP CAMERA
              </button>
            </div>
          )}

          {/* Emotion / Affect Panel */}
          <EmotionPanel emotion={emotion} offline={!emotionAvailable} compact />
        </section>

        {/* COLUMN 2: LIVE RECOGNITION */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Live Recognition
            </span>
            <span className="text-[9px] font-mono text-text-muted">
              {streamState} · {buffered} FRAMES
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl bg-background/50 p-2">
            <div className="flex items-center gap-1">
              {(["auto", "manual"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => changeRecognitionMode(mode)}
                  disabled={isProcessing || manualRecording}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-colors disabled:opacity-40 ${
                    recognitionMode === mode
                      ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            {recognitionMode === "auto" && (
              <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary text-[9px] font-mono">
                <span>Auto-append</span>
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[var(--accent-primary)] rounded cursor-pointer"
                />
              </label>
            )}
          </div>

          {recognitionMode === "manual" && (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-background/50 p-2.5">
              <span className="text-[9px] font-mono text-text-muted">
                Record one complete sign, then stop to recognize it.
              </span>
              <button
                type="button"
                onClick={toggleManualRecording}
                disabled={!cameraActive || isProcessing}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold disabled:opacity-40 ${
                  manualRecording
                    ? "bg-status-error/20 text-status-error border border-status-error/40"
                    : "bg-accent-primary text-black"
                }`}
              >
                {manualRecording ? "STOP & RECOGNIZE" : "START RECORDING"}
              </button>
            </div>
          )}

          <div className="rounded-xl bg-background/50 px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-2 text-[9px] font-mono">
              <label htmlFor="confidence-threshold" className="text-text-secondary">
                Auto-append confidence
              </label>
              <span className="text-accent-primary">{Math.round(confidenceThreshold * 100)}%</span>
            </div>
            <input
              id="confidence-threshold"
              type="range"
              min={0}
              max={0.8}
              step={0.05}
              value={confidenceThreshold}
              onChange={(event) => setConfidenceThreshold(Number(event.target.value))}
              className="w-full accent-[var(--accent-primary)]"
            />
            <p className="text-[8px] font-mono text-text-muted">
              Best-match labels remain visible at every confidence; this only controls auto-append.
            </p>
          </div>

          {/* Recognition Result Card */}
          <div className="rounded-xl bg-background/50 p-3 flex flex-col gap-2.5 min-w-0">
            {recognitionNotice && (
              <div className="flex items-center gap-2 rounded-lg border border-status-error/30 bg-status-error/10 px-2.5 py-2 text-[10px] font-mono text-status-error">
                <ShieldAlert size={13} className="shrink-0" />
                <span>{recognitionNotice}</span>
              </div>
            )}
            {live && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-[9px] font-mono">
                <span className="text-accent-secondary font-bold truncate">
                  {live.label} · {Math.round(live.confidence * 100)}%
                </span>
              </div>
            )}

            {prediction && prediction.detected ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-2.5">
                  <span className="text-xl font-bold font-mono text-accent-primary truncate">
                    {prediction.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary px-2 py-0.5 rounded bg-surface-elevated border border-border">
                    {Math.round(prediction.confidence * 100)}%
                  </span>
                </div>

                {/* Top-5 Predictions Probability Bars */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[9px] font-mono uppercase text-text-muted tracking-wider">
                    Confidence Distribution
                  </div>
                  {prediction.top5.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className={idx === 0 ? "text-text-primary font-bold" : "text-text-secondary"}>
                          {item.label}
                        </span>
                        <span className={idx === 0 ? "text-accent-primary font-bold" : "text-text-muted"}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-surface-elevated rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            idx === 0 ? "bg-accent-primary" : "bg-text-muted/40"
                          }`}
                          style={{ width: `${Math.round(item.confidence * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center text-center">
                <Sparkles size={16} className="text-text-muted mb-1.5" />
                <span className="text-xs font-mono text-text-secondary font-medium">
                  {cameraActive ? "Awaiting Hand Gestures" : "Camera Standby"}
                </span>
                <span className="text-[10px] font-mono text-text-muted mt-1">
                  Perform a WBSL sign within the guide frame
                </span>
              </div>
            )}
          </div>

          {/* Pipeline Specifications Info Box */}
          <div className="bg-background/50 rounded-xl p-2.5 flex flex-col gap-0.5 text-[9px] font-mono text-text-muted">
            <div className="flex justify-between">
              <span>Pipeline:</span>
              <span className="text-text-secondary font-medium">
                {contract.frames}-frame temporal sequence
              </span>
            </div>
            <div className="flex justify-between">
              <span>Features:</span>
              <span className="text-text-secondary font-medium">{contract.feature_width ?? 98}-dim shoulder-box</span>
            </div>
            <div className="flex justify-between">
              <span>Collected affect:</span>
              <span className="text-accent-secondary font-medium">
                {emotionSummary
                  ? `${emotionSummary.dominant} · ${Math.round(emotionSummary.confidence * 100)}%`
                  : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* COLUMN 3: TRANSLATION & SPEECH */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-muted select-none font-semibold">
              Translation Workspace
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleBackspace}
                disabled={detectedHistory.length === 0}
                className="px-2 py-0.5 rounded-md bg-surface/80 hover:bg-surface-elevated border border-border/80 text-[9px] font-mono text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                title="Remove last detected sign"
              >
                <Delete size={10} />
                Back
              </button>

              <button
                onClick={handleClear}
                disabled={detectedHistory.length === 0 && !bengaliOutput}
                className="px-2 py-0.5 rounded-md bg-surface/80 hover:bg-surface-elevated border border-border/80 text-[9px] font-mono text-text-secondary hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                title="Clear all recognized signs and output"
              >
                <Trash2 size={10} />
                Clear
              </button>
            </div>
          </div>

          {/* Detected Sequence Card */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase text-text-muted">
              <span>Gloss Sequence</span>
              <span className="text-[8px] text-text-secondary font-bold">
                {detectedHistory.length} SIGNS
              </span>
            </div>

            <div className="min-h-[46px] max-h-[72px] rounded-lg bg-surface/60 p-2 overflow-y-auto">
              {detectedHistory.length === 0 ? (
                <span className="text-[10px] font-mono text-text-muted flex items-center h-full">
                  No signs recognized yet...
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {detectedHistory.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDetectedHistory((prev) => prev.slice(0, idx));
                        emotionCollectionActiveRef.current = false;
                        resetEmotionCollection();
                        setBengaliOutput("");
                      }}
                      title="Click to remove signs from here"
                      className="px-2 py-0.5 rounded-md border border-border bg-surface-elevated font-mono text-[9px] font-bold text-accent-primary hover:brightness-110 transition-all"
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick vocabulary picker */}
            <div className="flex gap-2">
                <select
                  value={pickSign}
                  onChange={(e) => setPickSign(e.target.value)}
                  className="min-w-0 flex-1 px-2.5 py-1.5 rounded-lg bg-surface/80 border border-border/80 text-[10px] font-mono text-text-primary focus:outline-none"
                >
                  {catalog.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label} {c.bengali_meaning ? `— ${c.bengali_meaning}` : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAddPick}
                  disabled={!pickSign}
                  className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 border border-border/80 text-[10px] font-mono font-semibold text-text-primary disabled:opacity-40 flex items-center gap-1"
                >
                  <Plus size={11} />
                  Add
                </button>
            </div>

            <div className="text-[8px] font-mono text-text-muted truncate pt-0.5">
              NLG: <span className="text-text-secondary font-medium">{glossPreview}</span>
            </div>
          </div>

          {/* Bengali Sentence Output Card */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted">
              Bengali Translation
            </div>

            <div className="rounded-lg bg-surface/60 p-3 flex items-center justify-center text-center min-h-[64px]">
              {bengaliOutput ? (
                <p className="font-bengali text-xl sm:text-2xl text-text-primary leading-relaxed font-semibold">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-xs font-mono text-text-muted">
                  Bengali natural language translation will generate here
                </span>
              )}
            </div>
          </div>

          {/* Voice Output & Stream Button Card directly below Bengali translation */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2.5">
            {/* TTS Engine Switcher */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/50">
              <span className="text-[9px] font-mono uppercase text-text-muted shrink-0">
                TTS Engine:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setTtsEngine("free");
                    setVoiceId("1");
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors ${
                    ttsEngine === "free"
                      ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40 shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Free (Edge TTS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ttsEngine !== "elevenlabs") {
                      setShowTtsPremiumModal(true);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    ttsEngine === "elevenlabs"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <Sparkles size={10} />
                  ElevenLabs (Premium)
                </button>
              </div>
            </div>

            {/* Voice Model Selector Tabs */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono uppercase text-text-muted shrink-0">
                Voice:
              </span>
              <div className="flex-1 grid grid-cols-2 gap-1.5">
                {ttsEngine === "free" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setVoiceId("1")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "1"
                          ? "bg-accent-primary/15 border-accent-primary text-accent-primary shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Female · Nabanita
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceId("2")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "2"
                          ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Male · Pradeep
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setVoiceId("eleven_1")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "eleven_1"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Female · Sarah
                    </button>
                    <button
                      type="button"
                      onClick={() => setVoiceId("eleven_2")}
                      className={`h-8 rounded-lg border text-[9px] font-mono font-semibold transition-all ${
                        voiceId === "eleven_2"
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                          : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      Male · George
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ElevenLabs Tag Notice */}
            {ttsEngine === "elevenlabs" && (
              <div className="text-[9px] font-mono text-amber-300/80 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-400 shrink-0" />
                <span>Emotion tags preserved: [excited], [sad], [whispers], [happy]</span>
              </div>
            )}

            {/* TTS Premium Confirmation Modal */}
            {showTtsPremiumModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-surface border border-amber-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-sm text-text-primary">
                        Switch to ElevenLabs Premium TTS?
                      </h3>
                      <span className="text-[10px] font-mono text-amber-400">
                        Expressive multilingual speech with emotion tag support
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border/60 flex flex-col gap-2">
                    <p>
                      • Voice synthesis will use ElevenLabs eleven_v3 model via your backend ELEVENLABS_API_KEY.
                    </p>
                    <p>
                      • Cloud API credits will be consumed per character generated.
                    </p>
                    <p className="font-semibold text-amber-300">
                      • No Automatic Fallback: If your API key is invalid or quota runs out, speech synthesis will report an error instead of automatically falling back to Free mode.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTtsPremiumModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
                    >
                      Cancel (Stay Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTtsEngine("elevenlabs");
                        setVoiceId("eleven_1");
                        setShowTtsPremiumModal(false);
                        toast.success("Switched to ElevenLabs Premium TTS mode.");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors shadow-md"
                    >
                      Enable ElevenLabs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stream Bengali Action Button */}
            <button
              onClick={handleStreamAndSpeak}
              disabled={detectedHistory.length === 0 || isGenerating}
              className="w-full h-11 rounded-xl bg-accent-secondary hover:brightness-110 active:scale-[0.99] text-white font-mono text-xs uppercase font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating Bengali Speech...
                </>
              ) : isPlayingAudio ? (
                <>
                  <Volume2 size={14} className="animate-pulse" />
                  Speaking...
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  Stream Bengali in Voice
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\text-to-sign\page.tsx`

```tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContinuousSignSimulation } from "@/components/simulation/ContinuousSignSimulation";
import {
  AlertTriangle,
  ArrowRight,
  Cpu,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface TextToSignResult {
  input_text: string;
  gloss_sequence: string[];
  unsupported_concepts?: string[];
  unmapped_words?: string[];
  status?: "success" | "partial" | "unresolved" | "error";
  available_signs: number;
  engine?: string;
}

interface FailedSlice {
  seq: number;
  blob: Blob;
  lang: string;
}

type VoiceStatus = "idle" | "recording" | "finalizing" | "complete" | "warning";

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Encodes Float32 mono samples into a standard 16-bit PCM RIFF/WAVE Blob.
 * Faster-whisper / PyAV can decode standalone WAVs reliably without EBML container header errors.
 */
function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");

  // fmt sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * 1 * 2)
  view.setUint16(32, 2, true); // BlockAlign (1 * 2)
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  // 16-bit linear PCM with soft saturation clipping
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * Downsamples audio buffer to target rate (default 16kHz for Whisper).
 */
function downsampleBuffer(
  buffer: Float32Array,
  inputRate: number,
  outputRate = 16000
): Float32Array {
  if (inputRate === outputRate || buffer.length === 0) return buffer;
  const ratio = inputRate / outputRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function cleanWordForComparison(w: string): string {
  return w
    .replace(/[.,/#!$%^&*;:{}=\-_`~()।?!'"[\]{}|\\+@#]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Calculates Root Mean Square (RMS) audio energy to detect silence/voice activity.
 */
function calculateRMS(samples: Float32Array): number {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

interface WordSpan {
  word: string;
  start: number;
  end: number;
}

function extractWordSpans(input: string): WordSpan[] {
  const spans: WordSpan[] = [];
  // Unicode-aware word matching (letters and numbers in any language)
  const regex = /[\p{L}\p{N}]+/gu;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(input)) !== null) {
    spans.push({
      word: m[0].toLowerCase(),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return spans;
}

/**
 * Highlights genuinely unsupported concepts in the original text.
 * Accurately handles:
 * - Multiword concepts (e.g. "quantum physics")
 * - Surrounding punctuation (e.g. "(apple),", Unicode quotes, Bengali dāṇḍi)
 * - Case insensitivity and Unicode scripts (Bengali, Roman, Devanagari)
 * - Repeated occurrences across the entire sentence
 * - Overlapping candidate spans (merged deterministically)
 * - Exact character preservation for textarea mirror alignment
 */
function renderHighlightedText(text: string, unsupportedConcepts: string[]) {
  if (!unsupportedConcepts || unsupportedConcepts.length === 0 || !text) {
    return text;
  }

  const textWordSpans = extractWordSpans(text);
  if (textWordSpans.length === 0) return text;

  const candidateSpans: Array<{ start: number; end: number }> = [];

  for (const concept of unsupportedConcepts) {
    if (!concept) continue;
    const conceptWords = extractWordSpans(concept).map((w) => w.word);
    if (conceptWords.length === 0) continue;

    const k = conceptWords.length;
    // Slide window across text words to find occurrences of the concept word sequence
    for (let i = 0; i <= textWordSpans.length - k; i++) {
      let matches = true;
      for (let m = 0; m < k; m++) {
        if (textWordSpans[i + m].word !== conceptWords[m]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        candidateSpans.push({
          start: textWordSpans[i].start,
          end: textWordSpans[i + k - 1].end,
        });
      }
    }
  }

  if (candidateSpans.length === 0) {
    return text;
  }

  // Sort spans by start asc, end desc
  candidateSpans.sort((a, b) => a.start - b.start || b.end - a.end);

  // Merge overlapping / adjacent spans
  const mergedSpans: Array<{ start: number; end: number }> = [];
  for (const span of candidateSpans) {
    if (mergedSpans.length === 0) {
      mergedSpans.push({ ...span });
    } else {
      const last = mergedSpans[mergedSpans.length - 1];
      if (span.start <= last.end) {
        last.end = Math.max(last.end, span.end);
      } else {
        mergedSpans.push({ ...span });
      }
    }
  }

  // Render character slices
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  mergedSpans.forEach((span, idx) => {
    if (span.start > cursor) {
      nodes.push(
        <span key={`text-${cursor}`}>
          {text.slice(cursor, span.start)}
        </span>
      );
    }
    nodes.push(
      <mark
        key={`mark-${span.start}-${idx}`}
        className="bg-status-error/30 text-transparent border-b-2 border-status-error border-dotted rounded-xs inline-block"
      >
        {text.slice(span.start, span.end)}
      </mark>
    );
    cursor = span.end;
  });

  if (cursor < text.length) {
    nodes.push(
      <span key={`text-${cursor}`}>
        {text.slice(cursor)}
      </span>
    );
  }

  return nodes;
}

/**
 * Resolves unsupported concepts for red highlight display.
 * Uses the active model's structured interpretation response.
 */
function getEffectiveUnmappedWords(
  text: string,
  result: TextToSignResult | null
): string[] {
  if (!result || result.input_text.trim() !== text.trim()) return [];
  return result.unsupported_concepts || result.unmapped_words || [];
}

/**
 * Appends new transcribed text to existing text, stripping overlapping words caused
 * by the ~0.5s audio overlap buffer.
 */
function appendDeduplicated(existingText: string, incomingText: string): string {
  const existingTrimmed = existingText.trim();
  const incomingTrimmed = incomingText.trim();
  if (!existingTrimmed) return incomingTrimmed;
  if (!incomingTrimmed) return existingTrimmed;

  const existingWords = existingTrimmed.split(/\s+/);
  const incomingWords = incomingTrimmed.split(/\s+/);

  const maxOverlap = Math.min(4, existingWords.length, incomingWords.length);
  let overlapFound = 0;

  for (let k = maxOverlap; k >= 1; k--) {
    const existingTail = existingWords.slice(-k).map(cleanWordForComparison);
    const incomingHead = incomingWords.slice(0, k).map(cleanWordForComparison);

    let allMatch = true;
    for (let i = 0; i < k; i++) {
      if (!existingTail[i] || !incomingHead[i] || existingTail[i] !== incomingHead[i]) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      overlapFound = k;
      break;
    }
  }

  if (overlapFound > 0) {
    const remainingIncomingWords = incomingWords.slice(overlapFound);
    if (remainingIncomingWords.length === 0) {
      return existingTrimmed;
    }
    return `${existingTrimmed} ${remainingIncomingWords.join(" ")}`;
  }

  return `${existingTrimmed} ${incomingTrimmed}`;
}

function getRandomGlossSample(glosses: string[]): string[] {
  const shuffled = [...glosses];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  const sampleSize = Math.min(
    shuffled.length,
    shuffled.length >= 3 && Math.random() < 0.5 ? 3 : 2,
  );
  return shuffled.slice(0, sampleSize);
}

export default function TextToSignPage() {
  const [inputText, setInputText] = useState("");
  const [exampleSample, setExampleSample] = useState<string[]>([]);
  const [result, setResult] = useState<TextToSignResult | null>(null);
  const [, setActiveSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingSeq, setPlayingSeq] = useState(false);
  const [seqNonce, setSeqNonce] = useState(0);
  const [viewResetToken, setViewResetToken] = useState(0);
  const [useLlm, setUseLlm] = useState(false);

  // Fetch active vocabulary for dynamic samples
  useEffect(() => {
    axios
      .get<{ glosses: string[] }>(`${API_BASE}/api/text-to-sign/vocabulary`)
      .then((res) => {
        const glosses = res.data?.glosses || [];
        if (glosses.length > 0) {
          setExampleSample(getRandomGlossSample(glosses));
        }
      })
      .catch(() => {});
  }, []);

  // STT language selection: "auto" | "bn" | "en"
  const [sttLanguage, setSttLanguage] = useState<"auto" | "bn" | "en">("auto");
  const sttLanguageRef = useRef<"auto" | "bn" | "en">("auto");
  useEffect(() => {
    sttLanguageRef.current = sttLanguage;
  }, [sttLanguage]);

  // Independent STT Engine: "local" (default) | "elevenlabs"
  const [sttEngine, setSttEngine] = useState<"local" | "elevenlabs">("local");
  const sttEngineRef = useRef<"local" | "elevenlabs">("local");
  useEffect(() => {
    sttEngineRef.current = sttEngine;
  }, [sttEngine]);

  // VAD Segmentation Mode: Silero VAD is the sole continuous segmentation mechanism
  const vadModeRef = useRef<"silero_vad">("silero_vad");

  // Configurable Silero VAD parameters
  const [silenceThreshold, setSilenceThreshold] = useState<number>(0.5);
  const silenceThresholdRef = useRef<number>(0.5);
  useEffect(() => {
    silenceThresholdRef.current = silenceThreshold;
  }, [silenceThreshold]);

  const [minSilenceMs, setMinSilenceMs] = useState<number>(500);
  const minSilenceMsRef = useRef<number>(500);
  useEffect(() => {
    minSilenceMsRef.current = minSilenceMs;
  }, [minSilenceMs]);

  const [speechPadMs, setSpeechPadMs] = useState<number>(400);
  const speechPadMsRef = useRef<number>(400);
  useEffect(() => {
    speechPadMsRef.current = speechPadMs;
  }, [speechPadMs]);

  const [maxSegmentS, setMaxSegmentS] = useState<number>(15.0);
  const maxSegmentSRef = useRef<number>(15.0);
  useEffect(() => {
    maxSegmentSRef.current = maxSegmentS;
  }, [maxSegmentS]);

  // UI state for premium confirmation modal & VAD settings panel
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showVadSettings, setShowVadSettings] = useState(false);

  // Keep inputText accessible to callbacks for boundary deduplication
  const inputTextRef = useRef("");
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Voice recording & Continuous Streaming STT state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const isRecording = voiceStatus === "recording";
  const [inFlightCount, setInFlightCount] = useState(0);
  const recordingDuration = 5;
  const [sliceProgress, setSliceProgress] = useState(0); // 0 to 100%
  const [sliceRemainingSec, setSliceRemainingSec] = useState(5);
  const [failedSlices, setFailedSlices] = useState<FailedSlice[]>([]);

  // State refs for safe async pipeline isolation
  const isRecordingRef = useRef(false);
  const isStoppingRef = useRef(false);
  const sessionIdRef = useRef<string>("");
  const sliceSeqRef = useRef<number>(0);
  const nextCommitSeqRef = useRef<number>(0);
  const apiCallNonceRef = useRef<number>(0);
  const resultsMapRef = useRef<
    Map<number, { text: string; status: "ok" | "failed"; blob?: Blob }>
  >(new Map());
  const pendingInFlightRef = useRef<number>(0);
  const failedSlicesRef = useRef<FailedSlice[]>([]);
  const recordingDurationRef = useRef<number>(5);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const pcmBufferRef = useRef<Float32Array[]>([]);
  const capturedSampleRateRef = useRef<number>(44100);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finalizingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sliceElapsedMsRef = useRef<number>(0);
  const consecutiveSilentSlicesRef = useRef<number>(0);
  const stopVoiceRecordingRef = useRef<() => void>(() => {});

  useEffect(() => {
    recordingDurationRef.current = recordingDuration;
  }, [recordingDuration]);

  useEffect(() => {
    failedSlicesRef.current = failedSlices;
  }, [failedSlices]);

  const effectiveUnmappedWords = useMemo(() => {
    return getEffectiveUnmappedWords(inputText, result);
  }, [inputText, result]);

  // In-order commit processor: appends successful transcriptions in strict chronological sequence
  const commitInOrder = useCallback((sessionId: string) => {
    if (sessionIdRef.current !== sessionId) return;

    while (resultsMapRef.current.has(nextCommitSeqRef.current)) {
      const item = resultsMapRef.current.get(nextCommitSeqRef.current);
      nextCommitSeqRef.current += 1;

      if (item && item.status === "ok" && item.text) {
        setInputText((prev) => appendDeduplicated(prev, item.text));
      }
    }
  }, []);

  const checkFinalizationComplete = useCallback(
    (sessionId: string) => {
      if (sessionIdRef.current !== sessionId) return;

      if (isStoppingRef.current && pendingInFlightRef.current === 0) {
        isStoppingRef.current = false;
        const hasFailures = failedSlicesRef.current.length > 0;
        setVoiceStatus(hasFailures ? "warning" : "complete");

        if (finalizingTimeoutRef.current) clearTimeout(finalizingTimeoutRef.current);
        finalizingTimeoutRef.current = setTimeout(() => {
          if (sessionIdRef.current === sessionId) {
            setVoiceStatus("idle");
          }
        }, 2500);
      }
    },
    []
  );

  const sendSliceWithRetriesRef = useRef<
    ((blob: Blob, seq: number, sessionId: string, lang: string, retryCount?: number, isFinal?: boolean) => Promise<void>) | null
  >(null);

  // Send an individual audio slice with timeout, bounded retries, and strict sequence tracking
  const sendSliceWithRetries = useCallback(
    async (
      blob: Blob,
      seq: number,
      sessionId: string,
      lang: string,
      retryCount = 0,
      isFinal = false
    ): Promise<void> => {
      if (sessionIdRef.current !== sessionId) return;

      const formData = new FormData();
      formData.append("file", blob, `slice_${seq}.wav`);
      formData.append("language", lang);
      formData.append("engine", sttEngineRef.current);
      formData.append("vad_mode", vadModeRef.current);
      formData.append("silence_threshold", String(silenceThresholdRef.current));
      formData.append("min_silence_ms", String(minSilenceMsRef.current));
      formData.append("speech_pad_ms", String(speechPadMsRef.current));
      formData.append("max_segment_s", String(maxSegmentSRef.current));
      formData.append("is_final", String(isFinal));
      formData.append("previous_context", inputTextRef.current);

      try {
        const resp = await axios.post<{
          text: string;
          language?: string;
          language_probability?: number;
          engine?: string;
          status?: string;
        }>(`${API_BASE}/api/stt`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });

        if (sessionIdRef.current !== sessionId) return;

        const recognized = (resp.data.text || "").trim();
        resultsMapRef.current.set(seq, { text: recognized, status: "ok" });
        commitInOrder(sessionId);
      } catch (err: unknown) {
        if (sessionIdRef.current !== sessionId) return;

        const errorMsg = axios.isAxiosError(err)
          ? err.response?.data?.detail || err.message
          : "STT processing failed";

        // CRITICAL: When ElevenLabs fails, do NOT automatically fall back to another provider
        if (sttEngineRef.current === "elevenlabs") {
          toast.error(`ElevenLabs STT Error: ${errorMsg}`);
          resultsMapRef.current.set(seq, { text: "", status: "failed", blob });
          setFailedSlices((prev) => [...prev, { seq, blob, lang }]);
          commitInOrder(sessionId);
          return;
        }

        if (retryCount < 2) {
          // Bounded retry (attempt 1 or 2) after short delay
          await new Promise((resolve) => setTimeout(resolve, 600));
          if (sessionIdRef.current !== sessionId) return;
          return sendSliceWithRetriesRef.current?.(blob, seq, sessionId, lang, retryCount + 1, isFinal);
        } else {
          // All retries exhausted: mark as failed to unblock subsequent slice commits
          resultsMapRef.current.set(seq, { text: "", status: "failed", blob });
          setFailedSlices((prev) => [...prev, { seq, blob, lang }]);
          commitInOrder(sessionId);
        }
      } finally {
        pendingInFlightRef.current = Math.max(0, pendingInFlightRef.current - 1);
        setInFlightCount(pendingInFlightRef.current);
        checkFinalizationComplete(sessionId);
      }
    },
    [commitInOrder, checkFinalizationComplete]
  );

  useEffect(() => {
    sendSliceWithRetriesRef.current = sendSliceWithRetries;
  }, [sendSliceWithRetries]);

  // Extracts current PCM buffer into a standalone 16kHz WAV slice and dispatches it
  const extractAndDispatchSlice = useCallback(
    (isFinal = false) => {
      const chunks = pcmBufferRef.current;
      if (!chunks || chunks.length === 0) return;

      const totalSamples = chunks.reduce((acc, c) => acc + c.length, 0);
      const inputRate = capturedSampleRateRef.current || 44100;

      // Minimum duration guards:
      // ElevenLabs Scribe API strictly rejects audio shorter than 0.6s (400 audio_too_short).
      // Local faster-whisper requires at least 0.25s of audio to perform meaningful transcription.
      const minDurationSec = sttEngineRef.current === "elevenlabs" ? 0.65 : 0.25;
      const minInputSamples = Math.ceil(minDurationSec * inputRate);
      if (totalSamples < minInputSamples) {
        if (isFinal) {
          pcmBufferRef.current = [];
        }
        return;
      }

      const merged = new Float32Array(totalSamples);
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.length;
      }

      // Continuous Silero VAD cuts on natural pauses; reset buffer cleanly for next slice
      pcmBufferRef.current = [];

      const downsampled = downsampleBuffer(merged, inputRate, 16000);

      // Verify downsampled samples directly (9600 samples = 0.6s at 16kHz)
      const minDownsampledSamples = sttEngineRef.current === "elevenlabs" ? 9600 : 4000;
      if (downsampled.length < minDownsampledSamples) {
        return;
      }

      // Energy check: in fixed chunk mode, skip dead silence to save CPU.
      // In Silero VAD mode, backend Silero neural VAD evaluates activity directly.
      const rms = calculateRMS(downsampled);
      if (rms < 0.003 && !isFinal) {
        consecutiveSilentSlicesRef.current += 1;
        // If microphone was left on with continuous silence for 4 splits (~20s), automatically stop
        if (consecutiveSilentSlicesRef.current >= 4 && isRecordingRef.current) {
          toast.info("Microphone stopped automatically due to inactivity.");
          stopVoiceRecordingRef.current?.();
        }
        return;
      }
      consecutiveSilentSlicesRef.current = 0;

      const wavBlob = encodeWAV(downsampled, 16000);

      if (wavBlob.size >= 400) {
        const seq = sliceSeqRef.current++;
        pendingInFlightRef.current += 1;
        setInFlightCount(pendingInFlightRef.current);
        sendSliceWithRetries(
          wavBlob,
          seq,
          sessionIdRef.current,
          sttLanguageRef.current,
          0,
          isFinal
        );
      }
    },
    [sendSliceWithRetries]
  );

  const stopVoiceRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop audio processor and release microphone stream
    try {
      if (processorNodeRef.current) {
        processorNodeRef.current.disconnect();
        processorNodeRef.current = null;
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (silentGainRef.current) {
        silentGainRef.current.disconnect();
        silentGainRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    } catch (err) {
      console.warn("AudioContext cleanup note:", err);
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setSliceProgress(0);

    // Flush and submit final partial slice
    extractAndDispatchSlice(true);

    if (pendingInFlightRef.current > 0) {
      isStoppingRef.current = true;
      setVoiceStatus("finalizing");
    } else {
      isStoppingRef.current = false;
      const hasFailures = failedSlicesRef.current.length > 0;
      setVoiceStatus(hasFailures ? "warning" : "complete");

      if (finalizingTimeoutRef.current) clearTimeout(finalizingTimeoutRef.current);
      finalizingTimeoutRef.current = setTimeout(() => {
        setVoiceStatus("idle");
      }, 2000);
    }
  }, [extractAndDispatchSlice]);

  useEffect(() => {
    stopVoiceRecordingRef.current = stopVoiceRecording;
  }, [stopVoiceRecording]);

  const startVoiceRecording = useCallback(async () => {
    if (isRecordingRef.current || voiceStatus === "finalizing") return;

    if (finalizingTimeoutRef.current) {
      clearTimeout(finalizingTimeoutRef.current);
      finalizingTimeoutRef.current = null;
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Microphone is not supported in this browser.");
        return;
      }

      // Initialize new session with unique ID
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionIdRef.current = sessionId;
      sliceSeqRef.current = 0;
      nextCommitSeqRef.current = 0;
      resultsMapRef.current.clear();
      pendingInFlightRef.current = 0;
      setInFlightCount(0);
      isStoppingRef.current = false;
      setFailedSlices([]);
      pcmBufferRef.current = [];
      sliceElapsedMsRef.current = 0;
      consecutiveSilentSlicesRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioContextRef.current = ctx;
      capturedSampleRateRef.current = ctx.sampleRate;

      const sourceNode = ctx.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;

      // 4096 buffer size delivers ~92ms callbacks at 44.1kHz without dropping samples
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!isRecordingRef.current) return;
        const channelData = e.inputBuffer.getChannelData(0);
        pcmBufferRef.current.push(new Float32Array(channelData));
      };
      processorNodeRef.current = processor;

      // Route through a zero-gain node so onaudioprocess continues without echo to speakers
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentGainRef.current = silentGain;

      sourceNode.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(ctx.destination);

      isRecordingRef.current = true;
      setVoiceStatus("recording");
      setSliceProgress(0);
      setSliceRemainingSec(recordingDurationRef.current);

      if (timerRef.current) clearInterval(timerRef.current);

      // Smooth 100ms interval ticker for visual progress animation and precise slice triggers
      timerRef.current = setInterval(() => {
        if (!isRecordingRef.current) return;

        sliceElapsedMsRef.current += 100;
        const totalDurationMs = recordingDurationRef.current * 1000;

        const progress = Math.min(100, (sliceElapsedMsRef.current / totalDurationMs) * 100);
        const remaining = Math.max(0, (totalDurationMs - sliceElapsedMsRef.current) / 1000);
        setSliceProgress(progress);
        setSliceRemainingSec(remaining);

        // When split threshold reached: extract slice, retain 0.5s overlap, dispatch STT, keep recording!
        if (sliceElapsedMsRef.current >= totalDurationMs) {
          extractAndDispatchSlice(false);
          sliceElapsedMsRef.current = 0;
          setSliceProgress(0);
          setSliceRemainingSec(recordingDurationRef.current);
        }
      }, 100);
    } catch (err: unknown) {
      isRecordingRef.current = false;
      setVoiceStatus("idle");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        toast.error("No microphone found on your system.");
      } else {
        toast.error("Could not access microphone.");
      }
    }
  }, [voiceStatus, extractAndDispatchSlice]);

  const retryAllFailedSlices = useCallback(() => {
    if (failedSlices.length === 0 || voiceStatus === "finalizing") return;
    const slicesToRetry = [...failedSlices];
    setFailedSlices([]);
    const sessionId = sessionIdRef.current;

    slicesToRetry.forEach((item) => {
      pendingInFlightRef.current += 1;
      setInFlightCount(pendingInFlightRef.current);
      sendSliceWithRetries(item.blob, item.seq, sessionId, item.lang);
    });
  }, [failedSlices, voiceStatus, sendSliceWithRetries]);

  useEffect(() => {
    return () => {
      sessionIdRef.current = ""; // invalidate any pending session
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (finalizingTimeoutRef.current) {
        clearTimeout(finalizingTimeoutRef.current);
        finalizingTimeoutRef.current = null;
      }
      try {
        processorNodeRef.current?.disconnect();
        sourceNodeRef.current?.disconnect();
        silentGainRef.current?.disconnect();
        audioContextRef.current?.close().catch(() => {});
      } catch {}
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<{ glosses: string[] }>(`${API_BASE}/api/text-to-sign/vocabulary`)
      .then(({ data }) => {
        if (!cancelled && data.glosses?.length) {
          setExampleSample(getRandomGlossSample(data.glosses));
        }
      })
      .catch(() => {
        // Fallback sample remains available
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSegmentChange = useCallback((index: number) => {
    setActiveSignIndex(index);
  }, []);

  const handleSequenceComplete = useCallback(() => {
    setPlayingSeq(false);
  }, []);

  const handleGenerateAndPlay = async () => {
    const text = inputText.trim();

    // If textarea is empty, guide the user to type or click the microphone
    if (!text) {
      toast.info("Please enter Bengali text to generate sign sequence");
      return;
    }

    // If already generated for the exact same text, replay sequence directly
    if (result && result.input_text === text) {
      setActiveSignIndex(0);
      setSeqNonce((n) => n + 1);
      setPlayingSeq(true);
      return;
    }

    const callNonce = ++apiCallNonceRef.current;
    setIsLoading(true);
    setPlayingSeq(false);

    if (useLlm) {
      try {
        const r = await axios.post<TextToSignResult>(
          `${API_BASE}/api/text-to-sign/llm`,
          { text }
        );
        if (callNonce !== apiCallNonceRef.current) return;
        setResult(r.data);
        if (r.data.gloss_sequence && r.data.gloss_sequence.length > 0) {
          setActiveSignIndex(0);
          setSeqNonce((n) => n + 1);
          setPlayingSeq(true);
        } else {
          toast.info("No matching signs found in active model");
        }
      } catch (err: unknown) {
        if (callNonce !== apiCallNonceRef.current) return;
        const detail = axios.isAxiosError(err)
          ? err.response?.data?.detail
          : "LLM unavailable";
        toast.error(`LLM error: ${detail}`);
      } finally {
        if (callNonce === apiCallNonceRef.current) {
          setIsLoading(false);
        }
      }
      return;
    }

    try {
      const res = await axios.post<TextToSignResult>(
        `${API_BASE}/api/text-to-sign`,
        { text }
      );
      if (callNonce !== apiCallNonceRef.current) return;
      setResult(res.data);
      if (res.data.gloss_sequence && res.data.gloss_sequence.length > 0) {
        setActiveSignIndex(0);
        setSeqNonce((n) => n + 1);
        setPlayingSeq(true);
      } else {
        toast.info("No matching signs found in active model");
      }
    } catch {
      if (callNonce !== apiCallNonceRef.current) return;
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      if (callNonce === apiCallNonceRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageContainer className="w-full max-w-[1600px] px-3 sm:px-6 lg:px-8 py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-4 lg:gap-6 items-stretch">
        {/* LEFT PANEL: INPUT & CONTROLS */}
        <section className={`flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5 h-full ${showVadSettings ? "relative z-20" : ""}`}>
          {/* Top row: STT Engine Selector + VAD Mode */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* STT Engine Selector */}
                <div
                  className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface/80 border border-border/80"
                  role="group"
                  aria-label="STT Engine"
                >
                  <button
                    type="button"
                    onClick={() => setSttEngine("local")}
                    aria-pressed={sttEngine === "local"}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      sttEngine === "local"
                        ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40 shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="Local faster-whisper on CPU (Free, Offline, No cloud calls)"
                  >
                    <Cpu size={10} />
                    Local
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (sttEngine !== "elevenlabs") {
                        setShowPremiumModal(true);
                      }
                    }}
                    aria-pressed={sttEngine === "elevenlabs"}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                      sttEngine === "elevenlabs"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                    title="ElevenLabs Scribe v1/v2 (Premium Cloud STT)"
                  >
                    <Sparkles size={10} />
                    ElevenLabs
                  </button>
                </div>

              </div>
            </div>

            {/* Premium ElevenLabs Mode Notice */}
            {sttEngine === "elevenlabs" && (
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-400" />
                  ElevenLabs Scribe active
                </span>
                <button
                  type="button"
                  onClick={() => setSttEngine("local")}
                  className="text-[9px] underline hover:text-white"
                >
                  Exit
                </button>
              </div>
            )}

          </div>

{/* Premium Warning Modal */}
{showPremiumModal && (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-surface border border-amber-500/40 rounded-2xl max-w-md w-full p-5 shadow-2xl flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="font-mono font-bold text-sm text-text-primary">
            Switch to ElevenLabs STT?
          </h3>
          <span className="text-[10px] font-mono text-amber-400">
            Cloud-based multilingual transcription
          </span>
        </div>
      </div>

      <div className="text-xs text-text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border/60 flex flex-col gap-2">
        <p>• Audio will be sent to ElevenLabs cloud servers.</p>
        <p>• API usage charges and quotas apply.</p>
        <p className="font-semibold text-amber-300">
          • No automatic fallback: missing credentials or quota limits will cause transcription to fail.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => setShowPremiumModal(false)}
          className="px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setSttEngine("elevenlabs");
            setShowPremiumModal(false);
            toast.success("Switched to ElevenLabs Scribe STT mode.");
          }}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-colors shadow-md"
        >
          Enable ElevenLabs
        </button>
      </div>
    </div>
  </div>
)}

          {/* Multiline Textarea with inline unmapped word highlighting and locked height */}
          <div className="relative w-full flex-1 min-h-[340px] lg:min-h-[420px] rounded-xl bg-background/50 border border-blue-500 focus-within:ring-1 focus-within:ring-accent-secondary/50 focus-within:border-accent-secondary/60 transition-all flex flex-col overflow-hidden">
            {inputText && (
              <button
                type="button"
                onClick={() => {
                  setInputText("");
                  setResult(null);
                }}
                className="absolute top-3 right-2 z-20 rounded-md border border-red-500 px-2 py-1 text-[10px] font-mono leading-none text-text-muted hover:text-text-primary transition-colors"
              >
                Clear
              </button>
            )}
            <div className="relative flex-1 w-full h-full min-h-[280px]">
              {/* Highlight backdrop overlay (mirrors textarea font, padding, word wrap) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 p-4 pt-6 font-bengali text-base whitespace-pre-wrap break-words overflow-hidden select-none leading-relaxed text-transparent"
              >
                {renderHighlightedText(inputText, effectiveUnmappedWords)}
              </div>

              {/* Editable Textarea */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleGenerateAndPlay();
                  }
                }}
                placeholder="বাংলা বাক্য লিখুন"
                className="relative z-10 w-full h-full p-4 pt-6 bg-transparent text-text-primary font-bengali text-base placeholder:text-text-muted/50 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Guide text placed at bottom of text-input area, above voice controls */}
          <div className="flex items-center justify-between px-1 text-[11px] font-mono text-text-muted select-none">
            <span className={effectiveUnmappedWords.length > 0 ? "text-status-error/90 flex items-center gap-1" : ""}>
              {effectiveUnmappedWords.length > 0 && <AlertTriangle size={12} className="text-status-error" />}
              Red text = no matching sign
            </span>
          </div>

          {/* Continuous Voice Splitter Control */}
          <div
            className={`w-full rounded-xl border p-4 flex flex-col gap-2 transition-all ${
              isRecording
                ? "bg-status-error/15 border-status-error/40 text-status-error shadow-sm"
                : voiceStatus === "finalizing"
                ? "bg-accent-secondary/10 border-accent-secondary/30"
                : voiceStatus === "complete"
                ? "bg-status-success/10 border-status-success/30"
                : voiceStatus === "warning"
                ? "bg-status-warning/10 border-status-warning/30"
                : "bg-surface/50 border-border/70"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                disabled={voiceStatus === "finalizing"}
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                title={
                  voiceStatus === "finalizing"
                    ? "Finalizing transcription..."
                    : isRecording
                    ? "Stop recording"
                    : "Record voice"
                }
                aria-label={
                  isRecording ? "Stop voice recording" : "Start voice recording"
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-status-error text-white shadow-md animate-pulse"
                    : voiceStatus === "finalizing"
                    ? "bg-accent-secondary text-white shadow-sm"
                    : "bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30"
                }`}
              >
                {voiceStatus === "finalizing" ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : isRecording ? (
                  <Square size={14} fill="currentColor" />
                ) : (
                  <Mic size={18} />
                )}
              </button>

              <div className="flex w-[58px] min-w-0 shrink flex-col">
                <span
                  className={`whitespace-nowrap text-[9px] font-sans font-semibold tracking-wide leading-3 ${
                    isRecording
                      ? "text-status-error"
                      : voiceStatus === "finalizing"
                      ? "text-accent-secondary"
                      : voiceStatus === "complete"
                      ? "text-status-success"
                      : voiceStatus === "warning"
                      ? "text-status-warning"
                      : "text-text-primary"
                  }`}
                >
                  {isRecording
                    ? "LISTENING"
                    : voiceStatus === "finalizing"
                    ? "FINALIZING"
                    : voiceStatus === "complete"
                    ? "COMPLETE"
                    : voiceStatus === "warning"
                    ? "NO SPEECH"
                    : "VOICE"}
                </span>
                {(isRecording || voiceStatus === "finalizing" || inFlightCount > 0) && (
                  <span className="mt-0.5 max-w-[72px] break-words text-[8px] font-sans leading-tight text-text-secondary">
                    {inFlightCount > 0
                      ? `Transcribing ${inFlightCount} segment${inFlightCount === 1 ? "" : "s"}`
                      : isRecording
                      ? sttEngine === "elevenlabs"
                        ? `${sliceRemainingSec.toFixed(1)}s to next slice`
                        : `Every ${recordingDuration}s`
                      : "Transcribing audio"}
                  </span>
                )}
              </div>

              </div>

              <div className="flex shrink-0 items-center gap-2">
              {/* Language Selector */}
              <div
                className="flex shrink-0 items-center gap-0.5 rounded-xl bg-surface/80 p-1"
                role="group"
                aria-label="Input Language"
              >
                {([
                  { key: "auto", label: "AUTO" },
                  { key: "bn", label: "বাংলা" },
                  { key: "en", label: "ENGLISH" },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSttLanguage(opt.key)}
                    aria-pressed={sttLanguage === opt.key}
                    className={`rounded-lg px-2 py-1.5 text-[10px] font-sans font-semibold tracking-wide transition-colors ${
                      sttLanguage === opt.key
                        ? "bg-accent-secondary text-white shadow-sm"
                        : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                {sttEngine === "local" && (
                  <button
                    type="button"
                    onClick={() => setShowVadSettings((v) => !v)}
                    aria-label="VAD Configuration"
                    aria-expanded={showVadSettings}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-surface/80 text-text-secondary hover:text-text-primary transition-colors ${
                      showVadSettings ? "bg-surface-elevated text-accent-secondary" : ""
                    }`}
                    title="Configure Silero VAD thresholds & padding"
                  >
                    <Sliders size={12} />
                  </button>
                )}
                {showVadSettings && sttEngine === "local" && (
                  <div className="absolute bottom-full left-1/2 z-30 mb-3 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border/80 bg-surface p-4 shadow-xl flex flex-col gap-3 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1 border-b border-border/50">
                      <span className="font-bold text-[11px] text-text-primary flex items-center gap-1.5">
                        <Sliders size={12} className="text-accent-secondary" />
                        Silero VAD Parameters
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSilenceThreshold(0.5);
                          setMinSilenceMs(500);
                          setSpeechPadMs(400);
                          setMaxSegmentS(15.0);
                          toast.info("VAD parameters reset to defaults.");
                        }}
                        className="text-[9px] text-text-muted hover:text-text-primary underline"
                      >
                        Reset Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-[10px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-text-secondary">
                          <span className="whitespace-nowrap">Silence Threshold:</span>
                          <span className="text-accent-secondary font-bold">{silenceThreshold}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.05"
                          value={silenceThreshold}
                          onChange={(e) => setSilenceThreshold(parseFloat(e.target.value))}
                          className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-text-secondary">
                          <span className="whitespace-nowrap">Min Silence (ms):</span>
                          <span className="text-accent-secondary font-bold">{minSilenceMs}ms</span>
                        </div>
                        <input
                          type="range"
                          min="200"
                          max="2000"
                          step="50"
                          value={minSilenceMs}
                          onChange={(e) => setMinSilenceMs(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-text-secondary">
                          <span className="whitespace-nowrap">Speech Padding (ms):</span>
                          <span className="text-accent-secondary font-bold">{speechPadMs}ms</span>
                        </div>
                        <input
                          type="range"
                          min="100"
                          max="800"
                          step="50"
                          value={speechPadMs}
                          onChange={(e) => setSpeechPadMs(parseInt(e.target.value, 10))}
                          className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-text-secondary">
                          <span className="whitespace-nowrap">Max Segment (s):</span>
                          <span className="text-accent-secondary font-bold">{maxSegmentS}s</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="1"
                          value={maxSegmentS}
                          onChange={(e) => setMaxSegmentS(parseFloat(e.target.value))}
                          className="w-full h-1 bg-surface-elevated rounded accent-accent-secondary cursor-pointer"
                        />
                      </div>
                    </div>
                    </div>
                    )}
                </div>
              </div>
            </div>

            {/* Timing Animation Progress Bar (Shows speaker when slice ends to finish long words) */}
            {isRecording && (
              <div className="w-full bg-border/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-status-error transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${sliceProgress}%` }}
                />
              </div>
            )}

            {/* Recoverable Failed Slices Notice */}
            {failedSlices.length > 0 && voiceStatus !== "recording" && (
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/60 text-xs">
                <span className="flex items-center gap-1.5 text-status-warning font-mono text-[11px]">
                  <AlertTriangle size={12} />
                  {failedSlices.length} segment{failedSlices.length > 1 ? "s" : ""} unconfirmed
                </span>
                <button
                  type="button"
                  onClick={retryAllFailedSlices}
                  disabled={voiceStatus === "finalizing"}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-accent-secondary/15 hover:bg-accent-secondary/25 text-accent-secondary transition-colors"
                >
                  <RotateCcw size={10} />
                  Retry Failed
                </button>
              </div>
            )}
          </div>

          {/* Bottom row: LLM toggle + Main Play Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={useLlm}
                onClick={() => setUseLlm((v) => !v)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-border transition-colors duration-200 ease-in-out focus:outline-none ${
                  useLlm ? "bg-accent-secondary" : "bg-surface-elevated"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out my-auto ${
                    useLlm ? "translate-x-4 ml-0.5" : "translate-x-0.5 bg-text-muted"
                  }`}
                />
              </button>
              <span className="text-[11px] font-mono font-medium text-text-secondary select-none tracking-wider">
                LLM
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateAndPlay}
              disabled={isLoading}
              title={
                inputText.trim()
                  ? "Generate and play sign sequence"
                  : isRecording
                  ? "Stop recording"
                  : "Record speech"
              }
              className="w-11 h-11 rounded-xl bg-accent-secondary hover:brightness-110 active:scale-95 text-white flex items-center justify-center transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRecording ? (
                <Square size={16} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </button>
          </div>
        </section>

        {/* RIGHT PANEL: SIGN PLAYBACK */}
        <section className="flex flex-col rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm min-h-[500px] h-full justify-center">
          {result && result.gloss_sequence.length > 0 ? (
            <ContinuousSignSimulation
              glosses={result.gloss_sequence}
              playing={playingSeq}
              restartToken={seqNonce}
              viewResetToken={viewResetToken}
              onResetView={() => setViewResetToken((t) => t + 1)}
              onSegmentChange={handleSegmentChange}
              onComplete={handleSequenceComplete}
            />
          ) : (
            <div className="flex flex-col h-full space-y-2 justify-between">
              <div className="flex items-center justify-between gap-3 px-1 mb-1">
                <div className="inline-flex items-center px-2 py-0.5 rounded border border-border/80 bg-surface text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">
                  0 SIGNS
                </div>
              </div>

              <div className="aspect-[16/10] w-full rounded-xl border border-dashed border-border/70 bg-background/30 flex flex-col items-center justify-center text-center p-6 shadow-inner">
                <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
                  <ArrowRight size={20} />
                </div>

                <div className="text-xs font-mono text-text-secondary tracking-wide mb-4">
                  Enter a Bengali sentence to generate the sign sequence
                </div>

                {exampleSample.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText(exampleSample.join(" "));
                    }}
                    className="px-4 py-2 rounded-lg border border-accent-secondary/50 bg-surface-elevated text-accent-secondary font-mono text-xs hover:border-accent-secondary hover:bg-accent-secondary/10 transition-all shadow-sm max-w-full truncate"
                  >
                    Try: {exampleSample.join(" ")}
                  </button>
                )}
              </div>

              <div className="h-6" aria-hidden="true" />
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\components\camera\CameraFramingGuide.tsx`

```tsx
"use client";

import React, { useEffect, useState } from "react";

interface CameraFramingGuideProps {
  cameraActive: boolean;
}

export function CameraFramingGuide({ cameraActive }: CameraFramingGuideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cameraActive) {
      setVisible(false);
      return;
    }

    // Show guide as soon as camera turns on
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [cameraActive]);

  if (!cameraActive && !visible) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-between p-3 sm:p-4 transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* SVG Upper Body & Hand Zone Outline */}
      <svg
        viewBox="0 0 640 400"
        className="w-full h-full max-h-[90%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="guideGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Signing Framing Boundary (Dashed) */}
        <rect
          x="70"
          y="25"
          width="500"
          height="340"
          rx="24"
          stroke="url(#guideGlow)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="opacity-70"
        />

        {/* Head Outline */}
        <ellipse
          cx="320"
          cy="92"
          rx="38"
          ry="48"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-80"
        />

        {/* Neck */}
        <path
          d="M 308 140 L 308 152 M 332 140 L 332 152"
          stroke="#22C55E"
          strokeWidth="1.5"
          className="opacity-60"
        />

        {/* Shoulders & Upper Body Outline */}
        <path
          d="M 308 152 C 275 158 220 180 195 200 C 190 205 198 260 215 315 L 425 315 C 442 260 450 205 445 200 C 420 180 365 158 332 152"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-75"
        />

        {/* Left Hand Articulation Zone */}
        <circle
          cx="175"
          cy="235"
          r="48"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="opacity-80"
        />
        <text
          x="175"
          y="240"
          fill="#A1A1AA"
          fontSize="11"
          fontFamily="monospace"
          textAnchor="middle"
          className="opacity-90"
        >
          HAND
        </text>

        {/* Right Hand Articulation Zone */}
        <circle
          cx="465"
          cy="235"
          r="48"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="opacity-80"
        />
        <text
          x="465"
          y="240"
          fill="#A1A1AA"
          fontSize="11"
          fontFamily="monospace"
          textAnchor="middle"
          className="opacity-90"
        >
          HAND
        </text>

        {/* Center Torso / Chest Signing Space */}
        <ellipse
          cx="320"
          cy="230"
          rx="52"
          ry="40"
          stroke="#6366F1"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-40"
        />
      </svg>

      {/* Instruction Badge */}
      <div className="bg-surface/90 border border-border/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
        <span className="text-[11px] font-mono text-text-primary tracking-wide">
          Keep your upper body and hands within this guide
        </span>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\camera\FramingWarningArea.tsx`

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface FramingWarningAreaProps {
  cameraActive: boolean;
  handsDetected?: number;
  hasFace?: boolean;
  detected?: boolean;
  confidence?: number;
}

export function FramingWarningArea({
  cameraActive,
  handsDetected = 0,
  hasFace = true,
  detected = false,
  confidence = 0,
}: FramingWarningAreaProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("Framing looks good.");
  const [messageType, setMessageType] = useState<"good" | "info" | "warning">("good");

  // Debounce / cooldown refs to prevent rapid flipping
  const lastChangeTimeRef = useRef<number>(0);
  const consecutiveMissRef = useRef<number>(0);

  useEffect(() => {
    if (!cameraActive) {
      setCurrentMessage("Camera offline");
      setMessageType("info");
      return;
    }

    const now = Date.now();
    // Allow message updates at most once every 2000ms unless going from error to good
    const elapsed = now - lastChangeTimeRef.current;

    let candidateMessage = "Framing looks good.";
    let candidateType: "good" | "info" | "warning" = "good";

    if (!hasFace) {
      consecutiveMissRef.current += 1;
      if (consecutiveMissRef.current >= 3) {
        candidateMessage = "Face may be outside the frame.";
        candidateType = "warning";
      }
    } else {
      consecutiveMissRef.current = 0;
      if (handsDetected === 1) {
        candidateMessage = "One hand may be outside the frame.";
        candidateType = "info";
      } else if (handsDetected === 0 && !detected) {
        candidateMessage = "Try keeping your upper body in view.";
        candidateType = "info";
      } else {
        candidateMessage = "Framing looks good.";
        candidateType = "good";
      }
    }

    if (candidateMessage !== currentMessage && (elapsed > 2000 || candidateType === "good")) {
      setCurrentMessage(candidateMessage);
      setMessageType(candidateType);
      lastChangeTimeRef.current = now;
    }
  }, [cameraActive, handsDetected, hasFace, detected, confidence, currentMessage]);

  if (!cameraActive) {
    return null;
  }

  return (
    <div
      className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-2 transition-all duration-300 ${
        messageType === "good"
          ? "bg-accent-primary/10 border-accent-primary/30 text-accent-primary"
          : messageType === "warning"
          ? "bg-status-error/10 border-status-error/30 text-status-error"
          : "bg-surface-elevated/70 border-border text-text-secondary"
      }`}
      role="status"
      aria-live="polite"
    >
      {messageType === "good" ? (
        <CheckCircle2 size={13} className="shrink-0 text-accent-primary" />
      ) : messageType === "warning" ? (
        <AlertCircle size={13} className="shrink-0 text-status-error" />
      ) : (
        <Info size={13} className="shrink-0 text-text-muted" />
      )}
      <span className="truncate">{currentMessage}</span>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\layout\AdminSidebar.tsx`

```tsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Database,
  Cpu,
  Activity,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Training Data", href: "/admin/training-data", icon: Database },
  { label: "Avatar Data Simulation", href: "/admin/videos", icon: Activity },
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-[38vh] w-full shrink-0 flex-col overflow-hidden border-b border-border bg-surface md:h-full md:w-64 md:border-b-0 md:border-r">
      <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-text-muted">
            WORKSPACE
          </div>
          <div className="text-sm font-semibold text-text-primary">
            Admin Console
          </div>
        </div>
        <Link
          href="/"
          className="p-1.5 rounded hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors"
          title="Back to Public Portal"
        >
          <ArrowLeft size={16} />
        </Link>
      </div>

      <nav aria-label="Admin navigation" className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain p-3">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? "bg-surface-elevated text-accent-primary font-semibold border-l-2 border-accent-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-border p-4 text-[11px] font-mono text-text-muted">
        <div>ROLE: Lead Researcher</div>
        <div>ENV: Production Local</div>
      </div>
    </aside>
  );
}
```

---

# FILE: `frontend\src\components\layout\AppSidebar.tsx`

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Languages,
  Shield,
  Video,
  type LucideIcon,
} from "lucide-react";
import { NAVIGATION_LINKS, APP_CONFIG } from "@/lib/constants";
import { SystemDiagnostics } from "./SystemDiagnostics";

const navigationIcons: Record<string, LucideIcon> = {
  "/text-to-sign": Languages,
  "/sign-to-text": Video,
  "/about": Info,
};

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-border bg-background/95 py-4 backdrop-blur-xl transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <Link
        href="/"
        aria-label={APP_CONFIG.name}
        title={collapsed ? APP_CONFIG.name : undefined}
        className={`mb-5 flex h-11 items-center ${
          collapsed ? "justify-center" : "gap-3 px-4"
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-accent-primary/30 bg-surface">
          <Image
            src="/WBSL%20Bridge%20logo.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-full w-full object-contain"
          />
        </span>
        {!collapsed && (
          <span className="truncate text-xs font-bold tracking-wide text-text-primary">
            {APP_CONFIG.name}
          </span>
        )}
      </Link>

      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2"
      >
        {NAVIGATION_LINKS.map((link) => {
          const Icon = navigationIcons[link.href];
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              aria-label={link.label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex h-11 items-center rounded-lg transition-colors ${
                collapsed ? "justify-center" : "gap-3 px-3"
              } ${
                isActive
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {link.label}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 h-6 w-0.5 rounded-r bg-accent-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 space-y-2 px-2">
        <div className="border-t border-border pt-3">
          <Link
            href="/admin"
            title={collapsed ? "Admin Workspace" : undefined}
            aria-label="Admin Workspace"
            className={`flex h-11 items-center rounded-lg text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
          >
            <Shield size={18} aria-hidden="true" />
            {!collapsed && (
              <span className="truncate text-sm font-medium">
                Admin Workspace
              </span>
            )}
          </Link>
        </div>

        {!collapsed && (
          <div className="border-t border-border pt-3">
            <SystemDiagnostics compact />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`flex h-11 w-full items-center rounded-lg text-text-muted transition-colors hover:bg-surface-elevated hover:text-text-primary ${
            collapsed ? "justify-center" : "justify-between px-3"
          }`}
        >
          {!collapsed && <span className="text-xs">Collapse menu</span>}
          {collapsed ? (
            <ChevronRight size={18} aria-hidden="true" />
          ) : (
            <ChevronLeft size={18} aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
}
```

---

# FILE: `frontend\src\components\layout\Footer.tsx`

```tsx
import React from "react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface text-text-secondary py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-3">
          <div className="text-text-primary font-bold tracking-tight text-lg">
            {APP_CONFIG.name}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            West Bengal Sign Language Translation & Computational Research Framework.
            Bridging Deaf communication through landmark-based computer vision, emotion recognition, and Bengali NLG.
          </p>
          <div className="text-xs font-mono text-text-muted">
            Department of Computer Science & Engineering • Research Prototype
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-wider text-text-primary font-semibold">
            System Modules
          </div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/sign-to-text" className="hover:text-text-primary transition-colors">Sign → Bengali</Link></li>
            <li><Link href="/text-to-sign" className="hover:text-text-primary transition-colors">Bengali → Sign</Link></li>
            <li><Link href="/demo" className="hover:text-text-primary transition-colors">Demo Mode</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-wider text-text-primary font-semibold">
            Research Team
          </div>
          <ul className="space-y-1 text-xs text-text-secondary font-mono">
            <li>Sabir Ali Mondal</li>
            <li>Koushaki Singha</li>
            <li>Monirul Halder</li>
            <li>Firdos Shakih</li>
          </ul>
          <div className="pt-2 text-xs text-text-muted">
            DPDP Act 2023 Compliant • Privacy-First Landmarks
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted font-mono">
        <div>© 2026 WBSL Bridge Project. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 flex space-x-4">
          <span>Dataset: {APP_CONFIG.datasetVersion}</span>
          <span>Engine: {APP_CONFIG.modelVersion}</span>
        </div>
      </div>
    </footer>
  );
}
```

---

# FILE: `frontend\src\components\layout\PageContainer.tsx`

```tsx
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}
```

---

# FILE: `frontend\src\components\layout\SystemDiagnostics.tsx`

```tsx
"use client";
import React from "react";
import { Activity } from "lucide-react";
import { useSystemStatus } from "@/hooks/useSystemStatus";

export function SystemDiagnostics({ compact = false }: { compact?: boolean }) {
  const { health } = useSystemStatus();

  if (compact) {
    const services = [
      { label: "API", healthy: health.api },
      { label: "MODEL", healthy: health.model },
      { label: "TTS", healthy: health.tts },
      { label: "LLM", healthy: health.llm },
    ];

    return (
      <div className="space-y-2 rounded-md border border-border bg-surface p-3 tech-mono text-[10px] text-text-secondary">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-text-primary">
          <Activity size={13} aria-hidden="true" />
          System status
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
          {services.map((service) => (
            <span key={service.label} className="flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  service.healthy ? "bg-status-approved" : "bg-status-error"
                }`}
              />
              {service.label}
            </span>
          ))}
        </div>
        <div className="truncate text-[10px]">
          MODE:{" "}
          <span className="uppercase text-text-primary">
            {health.inference_mode}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 bg-surface border border-border rounded-md tech-mono text-xs text-text-secondary select-none">
      <div className="flex items-center space-x-2">
        <span className="flex items-center space-x-1">
          <span>API</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.api ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>MODEL</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.model ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>TTS</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.tts ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>LLM</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.llm ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
      </div>

      <div className="h-3 w-[1px] bg-border hidden sm:block" />

      <div className="hidden md:flex items-center space-x-2 text-[11px]">
        <span className="text-text-muted">MODE:</span>
        <span className="text-text-primary uppercase">{health.inference_mode}</span>
      </div>

      <div className="h-3 w-[1px] bg-border hidden lg:block" />

      <div className="hidden lg:flex items-center space-x-2 text-[11px] text-text-muted">
        <span>DATASET: <strong className="text-text-secondary">{health.dataset_version}</strong></span>
        <span>•</span>
        <span>MODEL: <strong className="text-text-secondary">{health.model_version}</strong></span>
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\sign\EmotionPanel.tsx`

```tsx
"use client";
import React from "react";
import { Smile, Frown, Angry, Zap, HelpCircle, Meh, AlertCircle } from "lucide-react";

export interface EmotionResult {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

/**
 * Which emoji stands for which class, plus the accent colour used for the
 * active bar. Kept in one table so the grid and the readout cannot drift apart.
 */
const EMOTION_META: Record<
  string,
  { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; color: string }
> = {
  happy: { icon: Smile, label: "Happy", color: "text-status-success" },
  sad: { icon: Frown, label: "Sad", color: "text-accent-tertiary" },
  angry: { icon: Angry, label: "Angry", color: "text-status-error" },
  fear: { icon: AlertCircle, label: "Fear", color: "text-status-warning" },
  surprise: { icon: Zap, label: "Surprise", color: "text-accent-secondary" },
  disgust: { icon: Frown, label: "Disgust", color: "text-status-warning" },
  neutral: { icon: Meh, label: "Neutral", color: "text-text-muted" },
};

const ORDER = ["happy", "sad", "angry", "fear", "surprise", "disgust", "neutral"];

interface Props {
  emotion: EmotionResult | null | undefined;
  compact?: boolean;
  offline?: boolean;
}

export function EmotionPanel({ emotion, compact = false, offline = false }: Props) {
  if (offline) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface/60 p-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <AlertCircle size={13} />
          Affect
        </div>
        <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
          Affect offline — models/emotion/vit_emotion.onnx not installed.
        </p>
      </div>
    );
  }
  if (!emotion) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface/60 p-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <HelpCircle size={13} />
          Emotion 
        </div>
        <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
          Waiting for a face in frame.
        </p>
      </div>
    );
  }

  const dominant = emotion.dominant ?? "neutral";
  const meta = EMOTION_META[dominant] ?? EMOTION_META.neutral;
  const Icon = meta.icon;
  const scores = emotion.scores ?? {};
  // Negation is worth flagging explicitly: it is the one marker that changes the
  // meaning of the whole utterance rather than decorating a single sign.
  const isNeutral = dominant === "neutral";

  return (
    <div className="rounded-xl border border-border/80 bg-surface/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-secondary">
          <Sparkline />
          Affect
        </span>
        <span className="text-[10px] font-mono text-text-muted uppercase">ViT · 7-class</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Dominant emotion readout */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${isNeutral
                ? "border-border bg-surface-elevated"
                : "border-accent-primary/40 bg-accent-primary/10"
              }`}
          >
            <Icon size={22} className={meta.color} />
          </div>
          <div className="min-w-0">
            <div className={`text-lg font-bold font-mono leading-tight ${meta.color}`}>
              {meta.label.toUpperCase()}
            </div>
            <div className="text-[11px] font-mono text-text-muted tabular-nums">
              {Math.round((emotion.confidence ?? 0) * 100)}% confidence
            </div>
          </div>
        </div>

        {/* Distribution — all seven classes, so a near-miss is visible. */}
        <div className="space-y-1.5">
          {ORDER.map((key) => {
            const m = EMOTION_META[key];
            const score = scores[key] ?? 0;
            const active = key === dominant;
            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={`w-14 text-[10px] font-mono shrink-0 ${active ? "text-text-primary font-bold" : "text-text-muted"
                    }`}
                >
                  {m?.label ?? key}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${active ? "bg-accent-primary" : "bg-text-muted/40"
                      }`}
                    style={{ width: `${Math.max(score * 100, score > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span
                  className={`w-9 text-right text-[10px] font-mono tabular-nums shrink-0 ${active ? "text-accent-primary font-bold" : "text-text-muted"
                    }`}
                >
                  {Math.round(score * 100)}%
                </span>
              </div>
            );
          })}
        </div>

        {!compact && (
          <p className="text-[10px] text-text-muted leading-relaxed pt-1 border-t border-border/60">
            Emotions are read from the cropped face region using a ViT classifier.
          </p>
        )}
      </div>
    </div>
  );
}

/** Small inline activity glyph — avoids pulling a chart lib in for one sparkline. */
function Sparkline() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
      <path
        d="M3 12h4l3-7 4 14 3-7h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

---

# FILE: `frontend\src\components\simulation\AlpanaStage.tsx`

```tsx
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { SolvedSequence } from "./LandmarkSimulation";
import { DHUTI_DROP, THRESH } from "./simulationConstants";

function createAlpanaTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") return new THREE.CanvasTexture();
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const center = 1024;
  const radius = 960;
  context.fillStyle = "#887c6a";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  const drawPetal = (distance: number, length: number, width: number, color: string) => {
    context.beginPath();
    context.moveTo(0, -distance);
    context.bezierCurveTo(width, -distance - length * 0.32, width, -distance - length * 0.78, 0, -distance - length);
    context.bezierCurveTo(-width, -distance - length * 0.78, -width, -distance - length * 0.32, 0, -distance);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
  };
  const rotateMotif = (count: number, callback: (angle: number) => void) => {
    for (let index = 0; index < count; index++) {
      const angle = (index / count) * Math.PI * 2;
      context.save();
      context.translate(center, center);
      context.rotate(angle);
      callback(angle);
      context.restore();
    }
  };

  for (const ring of [0.12, 0.16, 0.31, 0.34, 0.37, 0.58, 0.61, 0.64, 0.88, 0.91, 0.95]) {
    context.beginPath();
    context.arc(center, center, radius * ring, 0, Math.PI * 2);
    context.strokeStyle = ring === 0.34 || ring === 0.61 || ring === 0.91 ? "#a74331" : "#f7f0dc";
    context.lineWidth = ring === 0.34 || ring === 0.61 || ring === 0.91 ? 5 : 7;
    context.stroke();
  }

  rotateMotif(16, () => {
    drawPetal(radius * 0.63, radius * 0.25, radius * 0.055, "#fff8e9");
    drawPetal(radius * 0.67, radius * 0.17, radius * 0.028, "#b44431");
    context.beginPath();
    context.arc(0, -radius * 0.57, 8, 0, Math.PI * 2);
    context.fillStyle = "#fff8e9";
    context.fill();
  });

  rotateMotif(32, () => {
    drawPetal(radius * 0.39, radius * 0.13, radius * 0.035, "#fff8e9");
    context.beginPath();
    context.arc(0, -radius * 0.36, 6, 0, Math.PI * 2);
    context.fillStyle = "#b44431";
    context.fill();
  });

  rotateMotif(48, () => {
    context.beginPath();
    context.moveTo(0, -radius * 0.83);
    context.lineTo(radius * 0.018, -radius * 0.79);
    context.lineTo(0, -radius * 0.75);
    context.lineTo(-radius * 0.018, -radius * 0.79);
    context.closePath();
    context.fillStyle = "#fff8e9";
    context.fill();
    context.beginPath();
    context.arc(0, -radius * 0.86, 5, 0, Math.PI * 2);
    context.fillStyle = "#b44431";
    context.fill();
  });

  rotateMotif(12, () => {
    drawPetal(0, radius * 0.32, radius * 0.09, "#fff8e9");
    drawPetal(radius * 0.05, radius * 0.23, radius * 0.045, "#b44431");
  });

  context.beginPath();
  context.arc(center, center, radius * 0.055, 0, Math.PI * 2);
  context.fillStyle = "#b44431";
  context.fill();
  context.beginPath();
  context.arc(center, center, radius * 0.036, 0, Math.PI * 2);
  context.strokeStyle = "#fff8e9";
  context.lineWidth = 6;
  context.stroke();
  context.beginPath();
  context.arc(center, center, radius * 0.012, 0, Math.PI * 2);
  context.fillStyle = "#fff8e9";
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createHtmlAlpanaTexture(anisotropy: number): THREE.CanvasTexture {
  if (typeof document === "undefined") return createAlpanaTexture();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.47;
  const white = "#f5f2ea";
  const red = "#7D2722";
  const baseLow = "#171b26";
  const gradient = context.createRadialGradient(
    center, center, radius * 0.15, center, center, size * 0.72,
  );
  gradient.addColorStop(0, "#252A38");
  gradient.addColorStop(1, baseLow);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 2600; index++) {
    context.fillStyle = Math.random() > 0.5
      ? `rgba(255,255,255,${0.02 + Math.random() * 0.04})`
      : `rgba(0,0,0,${0.02 + Math.random() * 0.05})`;
    context.fillRect(
      Math.random() * size,
      Math.random() * size,
      1 + Math.random() * 1.6,
      1 + Math.random() * 1.6,
    );
  }

  const point = (angle: number, distance: number) => ({
    x: center + Math.cos(angle) * distance,
    y: center + Math.sin(angle) * distance,
  });
  const petalPath = (angle: number, startRadius: number, endRadius: number, width: number) => {
    const perpendicularX = -Math.sin(angle);
    const perpendicularY = Math.cos(angle);
    const start = point(angle, startRadius);
    const end = point(angle, endRadius);
    const middle = point(angle, (startRadius + endRadius) / 2);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo(
      middle.x + perpendicularX * width,
      middle.y + perpendicularY * width,
      end.x,
      end.y,
    );
    context.quadraticCurveTo(
      middle.x - perpendicularX * width,
      middle.y - perpendicularY * width,
      start.x,
      start.y,
    );
    context.closePath();
  };
  const petal = (angle: number, startRadius: number, endRadius: number, width: number) => {
    petalPath(angle, startRadius, endRadius, width);
    context.fill();
  };
  const petalLine = (
    angle: number, startRadius: number, endRadius: number, width: number, lineWidth: number,
  ) => {
    context.save();
    context.strokeStyle = baseLow;
    context.lineWidth = lineWidth;
    petalPath(angle, startRadius, endRadius, width);
    context.stroke();
    context.restore();
  };
  const fan = (
    angle: number,
    baseRadius: number,
    length: number,
    halfAngle: number,
    spokeCount: number,
    spokeWidth: number,
    arcWidth: number,
  ) => {
    const origin = point(angle, baseRadius);
    context.save();
    context.strokeStyle = white;
    context.lineCap = "round";
    context.lineWidth = spokeWidth;
    for (let spoke = 0; spoke < spokeCount; spoke++) {
      const spokeAngle = angle - halfAngle + (2 * halfAngle) * (spoke / (spokeCount - 1));
      context.beginPath();
      context.moveTo(origin.x, origin.y);
      context.lineTo(
        origin.x + Math.cos(spokeAngle) * length,
        origin.y + Math.sin(spokeAngle) * length,
      );
      context.stroke();
    }
    context.lineWidth = arcWidth;
    context.beginPath();
    context.arc(origin.x, origin.y, length, angle - halfAngle, angle + halfAngle);
    context.stroke();
    context.restore();
  };
  const redDot = (angle: number, distance: number, radiusX: number, radiusY: number) => {
    const position = point(angle, distance);
    context.save();
    context.translate(position.x, position.y);
    context.rotate(angle);
    context.fillStyle = red;
    context.beginPath();
    context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };
  const ring = (fraction: number, lineWidth: number) => {
    context.strokeStyle = white;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.arc(center, center, radius * fraction, 0, Math.PI * 2);
    context.stroke();
  };

  context.fillStyle = red;
  context.beginPath();
  context.arc(center, center, radius * 0.035, 0, Math.PI * 2);
  context.fill();
  ring(0.052, radius * 0.01);

  const centralCount = 9;
  for (let index = 0; index < centralCount; index++) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / centralCount;
    context.fillStyle = white;
    petal(angle, radius * 0.055, radius * 0.3, radius * 0.085);
    petalLine(angle, radius * 0.095, radius * 0.255, radius * 0.042, size * 0.0042);
  }

  ring(0.335, radius * 0.016);
  ring(0.372, radius * 0.016);

  const middleCount = 12;
  const middleStep = (Math.PI * 2) / middleCount;
  for (let index = 0; index < middleCount; index++) {
    const angle = -Math.PI / 2 + index * middleStep;
    redDot(angle, radius * 0.415, radius * 0.042, radius * 0.034);
    fan(angle, radius * 0.455, radius * 0.15, 1.05, 9, radius * 0.009, radius * 0.012);
    const leafAngle = angle + middleStep / 2;
    context.fillStyle = white;
    petal(leafAngle, radius * 0.4, radius * 0.6, radius * 0.045);
    petalLine(leafAngle, radius * 0.44, radius * 0.56, radius * 0.02, size * 0.0038);
  }

  const outerCount = 24;
  const outerStep = (Math.PI * 2) / outerCount;
  for (let index = 0; index < outerCount; index++) {
    const angle = -Math.PI / 2 + index * outerStep;
    if (index % 2 === 0) {
      context.fillStyle = white;
      petal(angle, radius * 0.6, radius * 0.94, radius * 0.055);
      petalLine(angle, radius * 0.66, radius * 0.88, radius * 0.024, size * 0.004);
    } else {
      fan(angle, radius * 0.63, radius * 0.185, 0.85, 7, radius * 0.008, radius * 0.01);
      context.fillStyle = white;
      const position = point(angle, radius * 0.6);
      context.beginPath();
      context.arc(position.x, position.y, radius * 0.012, 0, Math.PI * 2);
      context.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function medianValue(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

export function RoundAlpanaStage({ seq }: { seq: SolvedSequence }) {
  const accentRingRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const { frames, bounds } = seq;
  const texture = useMemo(
    () => createHtmlAlpanaTexture(gl.capabilities.getMaxAnisotropy()),
    [gl],
  );
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#7D2722", roughness: 0.82, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.6,
        roughness: 0.86,
        metalness: 0.02,
      }),
      new THREE.MeshStandardMaterial({ color: "#252A38", roughness: 0.9, metalness: 0.05 }),
    ],
    [texture],
  );
  const stage = useMemo(() => {
    const hipCenters: { x: number; y: number; z: number }[] = [];
    for (const { pose } of frames) {
      if (pose[6 * 4 + 3] < THRESH || pose[7 * 4 + 3] < THRESH) continue;
      hipCenters.push({
        x: (pose[6 * 4] + pose[7 * 4]) / 2,
        y: (pose[6 * 4 + 1] + pose[7 * 4 + 1]) / 2,
        z: (pose[6 * 4 + 2] + pose[7 * 4 + 2]) / 2,
      });
    }
    const radius = Math.max((bounds.maxX - bounds.minX) * 0.74, 1.55);
    const hipX = medianValue(hipCenters.map(({ x }) => x));
    const hipY = medianValue(hipCenters.map(({ y }) => y));
    const hipZ = medianValue(hipCenters.map(({ z }) => z));
    const topY = hipY - DHUTI_DROP - 0.08;
    const thickness = 0.18;
    return {
      radius,
      position: [hipX, topY - thickness / 2, hipZ] as [number, number, number],
      topY,
      thickness,
    };
  }, [bounds, frames]);
  const diskGeometry = useMemo(
    () => new THREE.CylinderGeometry(stage.radius, stage.radius * 1.03, stage.thickness, 96),
    [stage.radius, stage.thickness],
  );
  const plinthGeometry = useMemo(
    () => new THREE.CylinderGeometry(stage.radius * 1.14, stage.radius * 1.2, 0.18, 96),
    [stage.radius],
  );
  const rimGeometry = useMemo(
    () => new THREE.TorusGeometry(stage.radius * 0.99, 0.05, 20, 120),
    [stage.radius],
  );
  const accentRingGeometry = useMemo(
    () => new THREE.TorusGeometry(stage.radius * 1.065, 0.012, 8, 120),
    [stage.radius],
  );
  const groundGeometry = useMemo(
    () => new THREE.CircleGeometry(stage.radius * 2.4, 96),
    [stage.radius],
  );
  const plinthMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#252A38", roughness: 0.9, metalness: 0.05 }),
    [],
  );
  const rimMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#9E782B", roughness: 0.44, metalness: 0.56 }),
    [],
  );
  const accentRingMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#55DDE0",
      emissive: "#123c41",
      emissiveIntensity: 0.12,
      roughness: 0.55,
      metalness: 0.35,
    }),
    [],
  );
  const groundMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#182642",
      emissive: "#101A2F",
      emissiveIntensity: 0.06,
      roughness: 0.98,
      metalness: 0,
    }),
    [],
  );

  useEffect(
    () => () => {
      texture.dispose();
      materials.forEach((material) => material.dispose());
      diskGeometry.dispose();
      plinthGeometry.dispose();
      rimGeometry.dispose();
      accentRingGeometry.dispose();
      groundGeometry.dispose();
      plinthMaterial.dispose();
      rimMaterial.dispose();
      accentRingMaterial.dispose();
      groundMaterial.dispose();
    },
    [
      texture, materials, diskGeometry, plinthGeometry, rimGeometry, accentRingGeometry,
      groundGeometry, plinthMaterial, rimMaterial, accentRingMaterial, groundMaterial,
    ],
  );

  const [x, y, z] = stage.position;
  const groundY = stage.topY - stage.thickness - 0.18 - 0.012;
  useFrame(({ clock }) => {
    const ring = accentRingRef.current;
    if (!ring) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.7) * 0.003;
    ring.scale.set(pulse, pulse, pulse);
  });

  return (
    <group>
      <mesh
        geometry={groundGeometry}
        material={groundMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, groundY, z]}
        receiveShadow
      />
      <mesh
        geometry={diskGeometry}
        material={materials}
        position={[x, y, z]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={plinthGeometry}
        material={plinthMaterial}
        position={[x, y - stage.thickness / 2 - 0.08, z]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={rimGeometry}
        material={rimMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[x, stage.topY + 0.006, z]}
        castShadow
      />
      <mesh
        ref={accentRingRef}
        geometry={accentRingGeometry}
        material={accentRingMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[x, stage.topY - 0.025, z]}
      />
      <ContactShadows
        position={[x, stage.topY + 0.008, z]}
        scale={stage.radius * 1.65}
        far={1.6}
        blur={2.2}
        opacity={0.28}
        resolution={256}
        color="#111827"
      />
      <AmbientStageParticles
        center={[x, stage.topY, z]}
        radius={stage.radius}
      />
    </group>
  );
}

function AmbientStageParticles({
  center,
  radius,
}: {
  center: [number, number, number];
  radius: number;
}) {
  const group = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(48 * 3);
    for (let index = 0; index < 48; index++) {
      const angle = index * 2.399963229728653;
      const radial = radius * (0.76 + ((index * 17) % 23) / 100);
      positions[index * 3] = Math.cos(angle) * radial;
      positions[index * 3 + 1] = 0.18 + ((index * 13) % 61) / 42;
      positions[index * 3 + 2] = Math.sin(angle) * radial;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return result;
  }, [radius]);
  const material = useMemo(
    () => new THREE.PointsMaterial({
      color: "#55DDE0",
      size: 0.022,
      transparent: true,
      opacity: 0.26,
      sizeAttenuation: true,
      depthWrite: false,
    }),
    [],
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.018;
  });

  return (
    <points
      ref={group}
      geometry={geometry}
      material={material}
      position={center}
      frustumCulled={false}
    />
  );
}
```

---

# FILE: `frontend\src\components\simulation\ContinuousSignSimulation.tsx`

```tsx
"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RotateCcw } from "lucide-react";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import type { PosePoint } from "@/lib/pose";

const API_BASE = "http://localhost:8200";

interface LandmarkReplay {
  frames: number[][][];
  pose?: PosePoint[][];
  face_avatar?: number[][][];
  count: number;
  source: string;
}

interface Segment {
  gloss: string;
  start: number;
  end: number;
}

interface ReplaySequence {
  frames: number[][][];
  pose?: PosePoint[][];
  faceAvatar?: number[][][];
  segments: Segment[];
}

interface Props {
  glosses: string[];
  playing: boolean;
  restartToken: number;
  onSegmentChange: (index: number) => void;
  onComplete: () => void;
  viewResetToken: number;
  onResetView: () => void;
}

async function fetchContinuousSequence(glosses: string[]): Promise<ReplaySequence> {
  const uniqueGlosses = [...new Set(glosses)];
  const entries = await Promise.all(
    uniqueGlosses.map(async (gloss) => {
      const { data } = await axios.get<LandmarkReplay>(
        `${API_BASE}/api/simulation/frames`,
        { params: { label: gloss } },
      );
      if (!data.frames?.length) {
        throw new Error(`The active model has no landmark sequence for ${gloss}.`);
      }
      return [gloss, data] as const;
    }),
  );
  const replayByGloss = new Map(entries);
  const frames: number[][][] = [];
  const poses: PosePoint[][] = [];
  const faceAvatar: number[][][] = [];
  const segments: Segment[] = [];
  let allHavePose = true;
  let hasAnyFaceAvatar = false;

  for (const gloss of glosses) {
    const replay = replayByGloss.get(gloss);
    if (!replay) throw new Error(`Could not load the ${gloss} landmark sequence.`);

    const start = frames.length;
    frames.push(...replay.frames);
    segments.push({ gloss, start, end: frames.length });

    if (replay.pose?.length === replay.frames.length) {
      poses.push(...replay.pose);
    } else {
      allHavePose = false;
    }

    if (replay.face_avatar?.length === replay.frames.length) {
      faceAvatar.push(...replay.face_avatar);
      hasAnyFaceAvatar ||= replay.face_avatar.some((frame) => frame.length > 0);
    } else {
      faceAvatar.push(...replay.frames.map(() => []));
    }
  }

  return {
    frames,
    pose: allHavePose ? poses : undefined,
    faceAvatar: hasAnyFaceAvatar ? faceAvatar : undefined,
    segments,
  };
}

export function ContinuousSignSimulation({
  glosses,
  playing,
  restartToken,
  onSegmentChange,
  onComplete,
  viewResetToken,
  onResetView,
}: Props) {
  const normalizedGlosses = useMemo(() => glosses.filter(Boolean), [glosses]);
  const [activeSegment, setActiveSegment] = useState(0);
  const reportedSegment = useRef(-1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["text-to-sign-continuous", normalizedGlosses],
    queryFn: () => fetchContinuousSequence(normalizedGlosses),
    enabled: normalizedGlosses.length > 0,
    retry: false,
    staleTime: Infinity,
  });

  const handleFrameChange = useCallback((frame: number) => {
    if (!data) return;
    const index = data.segments.findIndex(
      (segment) => frame >= segment.start && frame < segment.end,
    );
    if (index >= 0 && index !== reportedSegment.current) {
      reportedSegment.current = index;
      setActiveSegment(index);
      onSegmentChange(index);
    }
  }, [data, onSegmentChange]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (!normalizedGlosses.length) return null;

  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex items-start justify-between gap-3 px-1 mb-1">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-2 py-0.5 rounded border border-border/80 bg-surface text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider w-fit">
            <span className="text-[10px] font-mono tabular-nums text-text-secondary">
              {data ? `${activeSegment + 1}/${data.segments.length}` : "—"} SIGNS
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={onResetView}
            className="inline-flex items-center gap-1 rounded border border-border/80 bg-surface/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-text-secondary transition-colors hover:border-border hover:text-text-primary"
            aria-label="Reset simulation view"
            title="Reset simulation view"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="aspect-[16/10] w-full rounded-xl border border-border bg-background flex items-center justify-center text-xs font-mono text-text-muted">
          Loading model sequences...
        </div>
      ) : isError || !data ? (
        <div className="aspect-[16/10] w-full rounded-xl border border-status-error/30 bg-background flex items-center justify-center px-6 text-center text-xs font-mono text-status-error">
          Could not load every active-model landmark sequence.
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex-1 w-full overflow-hidden rounded-xl">
            <LandmarkSimulation
              frames={data.frames}
              pose={data.pose}
              faceAvatar={data.faceAvatar}
              fps={30}
              defaultCameraDistanceScale={0.92}
              defaultCameraVerticalOffset={0.06}
              minimal
              loop={false}
              autoPlay={playing}
              restartToken={restartToken}
              onFrameChange={handleFrameChange}
              onComplete={handleComplete}
              horizontalOnly
              viewResetToken={viewResetToken}
            />
          </div>
          <div
            className="grid gap-2 pt-3"
            style={{ gridTemplateColumns: `repeat(${data.segments.length}, minmax(0, 1fr))` }}
            aria-label="Model landmark sequence progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={data.segments.length}
            aria-valuenow={activeSegment + 1}
          >
            {data.segments.map((segment, index) => (
              <div
                key={`${segment.gloss}-${index}`}
                className="min-w-0"
                title={segment.gloss}
              >
                <div
                  className={`h-1.5 rounded-full transition-colors duration-200 ${
                    index < activeSegment
                      ? "bg-accent-primary"
                      : index === activeSegment
                      ? "bg-accent-secondary"
                      : "bg-[#133827]"
                  }`}
                />
                <div className={`mt-1.5 truncate text-center text-[10px] font-mono ${
                  index === activeSegment ? "text-text-primary font-bold" : "text-text-muted"
                }`}>
                  {segment.gloss}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

# FILE: `frontend\src\components\simulation\DhutiRig.tsx`

```tsx
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { DHUTI_DROP, DHUTI_HALF_WIDTH_RATIO, THRESH, TORSO_WORLD } from "./simulationConstants";

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _sa = new Float32Array(3);

function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < mesh.count; i++) mesh.setMatrixAt(i, hidden);
  mesh.instanceMatrix.needsUpdate = true;
}

/* ==========================================================================
 * 6b. 3D: BENGALI DHUTI — knee-length draped wrap (fixed hem, no stretch)
 *
 * The hem is a FIXED drop below the hip line (at the knee):
 *   - it never reads knee/ankle landmarks, so leg motion cannot stretch it
 *   - the bottom stays WIDE (wrap-skirt silhouette), not a gathered tube
 *   - wrapped super-ellipse section + spiral twist + side/back drape folds
 *   - folded waistband, thin gold hem border, front anchal pleat panel with
 *     a column of gold buti motifs (like the reference drawing)
 * ========================================================================== */

const DHUTI_SEGMENTS = 22;
const DHUTI_ROWS = [0, 0.1, 0.22, 0.36, 0.52, 0.68, 0.84, 1];
const PANEL_T = 0.85;
const PANEL_ROWS = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85, 1];
const PANEL_COLS = [-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6];
const MOTIF_ROWS = [1, 2, 3, 4, 5, 6];

type ProfRow = [number, number, number];

interface DhutiFrame {
  cx: number; cz: number; waistY: number; hemY: number; hw: number;
  twist: number; prof: ProfRow[];
}

/* Wide at the hip, still wide at the hem (thigh) — a wrap, not a cone. */
const DHUTI_PROFILE: ProfRow[] = [
  [0, 0.88, 0.68],
  [0.18, 1.16, 0.86],
  [0.6, 1.14, 0.83],
  [1, 1.04, 0.78],
];

function profileAt(prof: ProfRow[], t: number): [number, number] {
  const tt = Math.min(Math.max(t, 0), 1);
  for (let i = 0; i < prof.length - 1; i++) {
    const [t0, a0, b0] = prof[i];
    const [t1, a1, b1] = prof[i + 1];
    if (tt <= t1 || i === prof.length - 2) {
      const span = Math.max(t1 - t0, 1e-4);
      const k = Math.min(Math.max((tt - t0) / span, 0), 1);
      return [a0 + (a1 - a0) * k, b0 + (b1 - b0) * k];
    }
  }
  const last = prof[prof.length - 1];
  return [last[1], last[2]];
}

function dhotiPoint(f: DhutiFrame, t: number, k: number, mul: number, out: Float32Array, o: number): void {
  const th = (k / DHUTI_SEGMENTS) * Math.PI * 2;
  const tt = Math.max(t, 0);
  const [am, bm] = profileAt(f.prof, tt);
  const wrap = th + f.twist * tt;
  const front = (Math.cos(th) + 1) * 0.5;
  const fold = (0.026 + 0.045 * tt) * (0.5 + 0.5 * (1 - front));
  const pert = 1 + fold * Math.sin(wrap * 5 + tt * 2.2) + fold * 0.5 * Math.sin(wrap * 9 - tt * 1.4);
  const e = 0.78;
  const sx = Math.sign(Math.sin(wrap)) * Math.pow(Math.abs(Math.sin(wrap)), e);
  const sz = Math.sign(Math.cos(wrap)) * Math.pow(Math.abs(Math.cos(wrap)), e);
  const a = (f.hw * am + 0.02) * mul * pert;
  const b = (f.hw * bm + 0.02) * mul * pert;
  out[o] = f.cx + sx * a;
  out[o + 1] = f.waistY + (f.hemY - f.waistY) * t - 0.025 * (1 - front) * mul;
  out[o + 2] = f.cz + sz * b;
}

function panelPoint(f: DhutiFrame, v: number, u: number, lift: number, out: Float32Array, o: number): void {
  const t = v * PANEL_T;
  const [am, bm] = profileAt(f.prof, t);
  const pleat = 0.045 * Math.sin(u * 9.4) * (0.3 + 0.7 * v);
  const a = f.hw * am * 0.6;
  const b = f.hw * bm + 0.02;
  out[o] = f.cx + u * a;
  out[o + 1] = f.waistY + (f.hemY - f.waistY) * t - Math.abs(u) * 0.05 * v;
  out[o + 2] = f.cz + b * (1.05 - 0.16 * u * u) + 0.03 + pleat + lift;
}

type DhutiKind = "cloth" | "band" | "gold" | "flap";
interface DhutiPart {
  rows: number; cols: number; closed: boolean; kind: DhutiKind;
  fill: (f: DhutiFrame, r: number, c: number, out: Float32Array, o: number) => void;
}

const DHUTI_PARTS: DhutiPart[] = [
  {
    rows: DHUTI_ROWS.length, cols: DHUTI_SEGMENTS, closed: true, kind: "cloth",
    fill: (f, r, c, out, o) => dhotiPoint(f, DHUTI_ROWS[r], c, 1, out, o),
  },
  {
    rows: 2, cols: DHUTI_SEGMENTS, closed: true, kind: "band",
    fill: (f, r, c, out, o) => dhotiPoint(f, r === 0 ? -0.07 : 0.035, c, 1.07, out, o),
  },
  {
    rows: 2, cols: DHUTI_SEGMENTS, closed: true, kind: "gold",
    fill: (f, r, c, out, o) => dhotiPoint(f, r === 0 ? 0.92 : 1, c, 1.02, out, o),
  },
  {
    rows: PANEL_ROWS.length, cols: PANEL_COLS.length, closed: false, kind: "cloth",
    fill: (f, r, c, out, o) => panelPoint(f, PANEL_ROWS[r], PANEL_COLS[c], 0, out, o),
  },
  {
    rows: PANEL_ROWS.length, cols: PANEL_COLS.length, closed: false, kind: "flap",
    fill: (f, r, c, out, o) => panelPoint(f, PANEL_ROWS[r], PANEL_COLS[c] * 0.52, 0.034, out, o),
  },
];

const PLEAT_COUNT = 6;
const PLEAT_STEPS = 12;
const PLEAT_COLUMNS = [-0.48, -0.3, -0.12, 0.12, 0.3, 0.48];

function buildDhotiGrid(def: DhutiPart): THREE.BufferGeometry {
  const { rows, cols, closed } = def;
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(rows * cols * 3), 3).setUsage(THREE.DynamicDrawUsage),
  );
  const idx: number[] = [];
  const quadCols = closed ? cols : cols - 1;
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < quadCols; c++) {
      const c2 = (c + 1) % cols;
      const a = r * cols + c;
      const b = r * cols + c2;
      const d = (r + 1) * cols + c;
      const e = (r + 1) * cols + c2;
      idx.push(a, d, b, b, d, e);
    }
  }
  g.setIndex(idx);
  return g;
}

export function DhutiRig({ sampleRef }: { sampleRef: SampleRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const motifsRef = useRef<THREE.InstancedMesh>(null);
  const pleatsRef = useRef<THREE.LineSegments>(null);
  const hemRef = useRef<number>(Number.NaN);
  const frame = useMemo<DhutiFrame>(
    () => ({ cx: 0, cz: 0, waistY: 0, hemY: -1.1, hw: 0.4, twist: 0.55, prof: DHUTI_PROFILE }),
    [],
  );
  const parts = useMemo(() => DHUTI_PARTS.map((def) => ({ def, geometry: buildDhotiGrid(def) })), []);
  const pleatGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(PLEAT_COUNT * PLEAT_STEPS * 2 * 3),
        3,
      ).setUsage(THREE.DynamicDrawUsage),
    );
    return geometry;
  }, []);
  const motifGeo = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const mats = useMemo(
    () => ({
      cloth: new THREE.MeshStandardMaterial({
        color: "#F4F1E7",
        side: THREE.DoubleSide,
        roughness: 0.78,
        metalness: 0.015,
      }),
      band: new THREE.MeshStandardMaterial({
        color: "#DAD9D2",
        side: THREE.DoubleSide,
        roughness: 0.76,
        metalness: 0.02,
      }),
      flap: new THREE.MeshStandardMaterial({
        color: "#F4F1E7",
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: "#C79A32",
        side: THREE.DoubleSide,
        roughness: 0.48,
        metalness: 0.3,
        emissive: "#2b1e08",
        emissiveIntensity: 0.04,
        polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
      }),
    }),
    [],
  );
  const pleatMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#D4D5D0", transparent: true, opacity: 0.55 }),
    [],
  );
  useEffect(
    () => () => {
      parts.forEach((p) => p.geometry.dispose());
      pleatGeometry.dispose();
      pleatMaterial.dispose();
      motifGeo.dispose();
      mats.cloth.dispose(); mats.band.dispose(); mats.flap.dispose(); mats.gold.dispose();
    },
    [parts, pleatGeometry, pleatMaterial, motifGeo, mats],
  );
  useLayoutEffect(() => hideAll(motifsRef.current), []);

  useFrame(() => {
    const group = groupRef.current;
    const motifs = motifsRef.current;
    if (!group || !motifs) return;
    const P = sampleRef.current.pose;
    const vis = (i: number) => P[i * 4 + 3] >= THRESH;
    if (!(vis(6) && vis(7))) {
      group.visible = false;
      return;
    }
    group.visible = true;

    const hipY = (P[6 * 4 + 1] + P[7 * 4 + 1]) / 2;
    frame.cx = (P[6 * 4] + P[7 * 4]) / 2;
    frame.cz = (P[6 * 4 + 2] + P[7 * 4 + 2]) / 2;
    frame.hw = TORSO_WORLD * DHUTI_HALF_WIDTH_RATIO;
    frame.waistY = hipY + 0.08;

    /* Fixed knee-length hem; leg motion never stretches it. */
    const target = hipY - DHUTI_DROP;
    hemRef.current = Number.isFinite(hemRef.current)
      ? hemRef.current + (target - hemRef.current) * 0.2
      : target;
    frame.hemY = hemRef.current;

    for (const { def, geometry } of parts) {
      const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let r = 0; r < def.rows; r++) {
        for (let c = 0; c < def.cols; c++) def.fill(frame, r, c, arr, (r * def.cols + c) * 3);
      }
      attr.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    const pleatPosition = pleatGeometry.getAttribute("position") as THREE.BufferAttribute;
    const pleatArray = pleatPosition.array as Float32Array;
    for (let pleat = 0; pleat < PLEAT_COUNT; pleat++) {
      const u = PLEAT_COLUMNS[pleat];
      for (let step = 0; step < PLEAT_STEPS; step++) {
        const v0 = 0.08 + (0.82 * step) / PLEAT_STEPS;
        const v1 = 0.08 + (0.82 * (step + 1)) / PLEAT_STEPS;
        const vertex = (pleat * PLEAT_STEPS + step) * 6;
        panelPoint(frame, v0, u * 0.52, 0.041, pleatArray, vertex);
        panelPoint(frame, v1, u * 0.52, 0.041, pleatArray, vertex + 3);
      }
    }
    pleatPosition.needsUpdate = true;
    pleatGeometry.computeBoundingSphere();

    for (let m = 0; m < MOTIF_ROWS.length; m++) {
      const v = PANEL_ROWS[MOTIF_ROWS[m]];
      panelPoint(frame, v, 0, 0.012, _sa, 0);
      _p.set(_sa[0], _sa[1], _sa[2]);
      _q.identity();
      _s.set(0.05, 0.07, 0.02);
      _m.compose(_p, _q, _s);
      motifs.setMatrixAt(m, _m);
    }
    motifs.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {parts.map(({ def, geometry }, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={mats[def.kind]}
          frustumCulled={false}
          castShadow
          receiveShadow
        />
      ))}
      <lineSegments
        ref={pleatsRef}
        geometry={pleatGeometry}
        material={pleatMaterial}
        frustumCulled={false}
        renderOrder={1}
      />
      <instancedMesh
        ref={motifsRef}
        args={[motifGeo, mats.gold, MOTIF_ROWS.length]}
        frustumCulled={false}
        castShadow
      />
    </group>
  );
}
```

---

# FILE: `frontend\src\components\simulation\HandRig.tsx`

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { THRESH } from "./simulationConstants";

// ============================================================
// DESIGN PALETTE & MATERIALS THEME
// ============================================================

const CERAMIC_WHITE = "#e8edf5";
const CERAMIC_SLEEVE = "#cbd5e1";
const TITANIUM_DARK = "#2a3447";
const TITANIUM_CORE = "#50637f";
const ACCENT_GOLD = "#d4a359";
const RING_CHROME = "#94a3b8";

// ============================================================
// ARM STRUCTURE & CONNECTIONS
// 0: left shoulder, 1: right shoulder
// 2: left elbow,    3: right elbow
// 4: left wrist,    5: right wrist
// ============================================================

const ARM_SEGMENTS: {
  conn: [number, number];
  radiusTop: number;
  radiusBottom: number;
}[] = [
  // Clavicle chest beam
  { conn: [0, 1], radiusTop: 0.088, radiusBottom: 0.088 },
  // Left Upper Arm (Shoulder -> Elbow)
  { conn: [0, 2], radiusTop: 0.098, radiusBottom: 0.078 },
  // Left Forearm (Elbow -> Wrist)
  { conn: [2, 4], radiusTop: 0.074, radiusBottom: 0.052 },
  // Right Upper Arm (Shoulder -> Elbow)
  { conn: [1, 3], radiusTop: 0.098, radiusBottom: 0.078 },
  // Right Forearm (Elbow -> Wrist)
  { conn: [3, 5], radiusTop: 0.074, radiusBottom: 0.052 },
];

const ARM_JOINTS = [
  { index: 0, radius: 0.125 }, // Left Shoulder
  { index: 1, radius: 0.125 }, // Right Shoulder
  { index: 2, radius: 0.084 }, // Left Elbow
  { index: 3, radius: 0.084 }, // Right Elbow
  { index: 4, radius: 0.056 }, // Left Wrist
  { index: 5, radius: 0.056 }, // Right Wrist
];

// Sleeve collars for elbow and wrist
const ARM_SOCKETS = [
  { boneIdx: 1, t: 0.94, radius: 0.086, height: 0.038 }, // L elbow top
  { boneIdx: 2, t: 0.06, radius: 0.082, height: 0.038 }, // L elbow bottom
  { boneIdx: 2, t: 0.94, radius: 0.058, height: 0.030 }, // L wrist
  { boneIdx: 3, t: 0.94, radius: 0.086, height: 0.038 }, // R elbow top
  { boneIdx: 4, t: 0.06, radius: 0.082, height: 0.038 }, // R elbow bottom
  { boneIdx: 4, t: 0.94, radius: 0.058, height: 0.030 }, // R wrist
];

// Elbow chrome accent rings
const ELBOW_JOINTS = [2, 3];

// ============================================================
// HAND CONNECTIONS & TOPOLOGY
// ============================================================

const PALM_METACARPALS: [number, number][] = [
  [0, 1],
  [0, 5],
  [0, 9],
  [0, 13],
  [0, 17],
];

const FINGER_SEGMENTS: [number, number][] = [
  // Thumb
  [1, 2], [2, 3], [3, 4],
  // Index
  [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [17, 18], [18, 19], [19, 20],
];

const ALL_HAND_SEGMENTS = [...PALM_METACARPALS, ...FINGER_SEGMENTS];
const FINGER_TIPS = [4, 8, 12, 16, 20];
const PALM_PERIMETER = [0, 1, 5, 9, 13, 17];

function buildPalmIndexBuffer(): number[] {
  const indices: number[] = [];
  indices.push(0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5);
  indices.push(6, 8, 7, 6, 9, 8, 6, 10, 9, 6, 11, 10);
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    const fA = i;
    const fB = next;
    const bA = i + 6;
    const bB = next + 6;
    indices.push(fA, bA, fB);
    indices.push(fB, bA, bB);
  }
  return indices;
}

const PALM_INDICES = buildPalmIndexBuffer();

const HAND_JOINT_RADII = [
  0.038, // 0: Wrist
  0.024, 0.021, 0.019, 0.017, // Thumb
  0.025, 0.021, 0.018, 0.016, // Index
  0.025, 0.021, 0.018, 0.016, // Middle
  0.024, 0.020, 0.017, 0.015, // Ring
  0.022, 0.018, 0.016, 0.014, // Pinky
];

// ============================================================
// GEOMETRIES
// ============================================================

const armCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 24, 1, false);
const jointSphereGeo = new THREE.SphereGeometry(1, 24, 20);
const jointRingGeo = new THREE.TorusGeometry(1, 0.2, 16, 28);
const socketCuffGeo = new THREE.CylinderGeometry(1.05, 0.98, 1, 24, 1);

// Upper dome cap covering the top of the shoulder (thetaLength = Pi/2 = upper hemisphere dome)
const shoulderTopArmorGeo = new THREE.SphereGeometry(
  1,
  32,
  16,
  0,
  Math.PI * 2,
  0,
  Math.PI * 0.52,
);

const fingerBoneGeo = new THREE.CylinderGeometry(0.72, 0.96, 1, 16, 1);
const knuckleSphereGeo = new THREE.SphereGeometry(1, 16, 14);
const knuckleRingGeo = new THREE.TorusGeometry(1, 0.2, 12, 20);
const fingertipDomeGeo = new THREE.SphereGeometry(1, 16, 14);

// ============================================================
// MATH HELPERS
// ============================================================

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function readPoint(target: THREE.Vector3, data: ArrayLike<number>, offset: number) {
  target.set(data[offset], data[offset + 1], data[offset + 2]);
}

function updateSegment(
  mesh: THREE.InstancedMesh,
  index: number,
  a: THREE.Vector3,
  b: THREE.Vector3,
  radiusTop: number,
  radiusBottom: number,
  dummy: THREE.Object3D,
  dir: THREE.Vector3,
) {
  dir.subVectors(b, a);
  const length = dir.length();

  if (length < 0.0001) {
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    return;
  }

  dummy.position.copy(a).add(b).multiplyScalar(0.5);
  dummy.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());

  const avgRadius = (radiusTop + radiusBottom) * 0.5;
  dummy.scale.set(avgRadius, length, avgRadius);
  dummy.updateMatrix();

  mesh.setMatrixAt(index, dummy.matrix);
}

function updateJoint(
  mesh: THREE.InstancedMesh,
  index: number,
  position: THREE.Vector3,
  radius: number,
  dummy: THREE.Object3D,
  quaternion?: THREE.Quaternion,
) {
  dummy.position.copy(position);
  if (quaternion) {
    dummy.quaternion.copy(quaternion);
  } else {
    dummy.quaternion.identity();
  }
  dummy.scale.setScalar(radius);
  dummy.updateMatrix();

  mesh.setMatrixAt(index, dummy.matrix);
}

// ============================================================
// ENHANCED SHOULDER & ARM RIG
// ============================================================

export function ArmRig({ sampleRef }: { sampleRef: SampleRef }) {
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const ringsRef = useRef<THREE.InstancedMesh>(null);
  const socketsRef = useRef<THREE.InstancedMesh>(null);
  const shoulderArmorRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const start = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  const materials = useMemo(
    () => ({
      armShell: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.24,
        roughness: 0.22,
      }),
      joints: new THREE.MeshStandardMaterial({
        color: TITANIUM_CORE,
        metalness: 0.88,
        roughness: 0.18,
      }),
      rings: new THREE.MeshStandardMaterial({
        color: RING_CHROME,
        metalness: 0.95,
        roughness: 0.12,
      }),
      sockets: new THREE.MeshStandardMaterial({
        color: TITANIUM_DARK,
        metalness: 0.82,
        roughness: 0.26,
      }),
      shoulderArmor: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.28,
        roughness: 0.18,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  );

  useEffect(
    () => () => {
      materials.armShell.dispose();
      materials.joints.dispose();
      materials.rings.dispose();
      materials.sockets.dispose();
      materials.shoulderArmor.dispose();
    },
    [materials],
  );

  useFrame(() => {
    const bones = bonesRef.current;
    const joints = jointsRef.current;
    const rings = ringsRef.current;
    const sockets = socketsRef.current;
    const shoulderArmor = shoulderArmorRef.current;
    if (!bones || !joints || !rings || !sockets || !shoulderArmor) return;

    const pose = sampleRef.current.pose;

    // 1. Arm Limbs & Clavicle
    for (let i = 0; i < ARM_SEGMENTS.length; i++) {
      const { conn, radiusTop, radiusBottom } = ARM_SEGMENTS[i];
      const [a, b] = conn;

      const conf = Math.min(pose[a * 4 + 3], pose[b * 4 + 3]);
      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        bones.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, pose, a * 4);
      readPoint(end, pose, b * 4);

      updateSegment(
        bones,
        i,
        start,
        end,
        radiusTop,
        radiusBottom,
        dummy,
        direction,
      );
    }
    bones.instanceMatrix.needsUpdate = true;

    // 2. Anatomical Spherical Joints
    for (let i = 0; i < ARM_JOINTS.length; i++) {
      const { index, radius } = ARM_JOINTS[i];
      const conf = pose[index * 4 + 3];

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        joints.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, pose, index * 4);
      updateJoint(joints, i, start, radius, dummy);
    }
    joints.instanceMatrix.needsUpdate = true;

    // 3. Elbow Chrome Rings
    for (let e = 0; e < ELBOW_JOINTS.length; e++) {
      const jointIndex = ELBOW_JOINTS[e];
      const conf = pose[jointIndex * 4 + 3];

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        rings.setMatrixAt(e, dummy.matrix);
        continue;
      }

      readPoint(start, pose, jointIndex * 4);
      const wristIndex = jointIndex === 2 ? 4 : 5;
      readPoint(end, pose, wristIndex * 4);

      direction.subVectors(end, start).normalize();
      tempQuat.setFromUnitVectors(Y_AXIS, direction);

      updateJoint(rings, e, start, 0.084 * 1.05, dummy, tempQuat);
    }
    rings.instanceMatrix.needsUpdate = true;

    // 4. Socket Sleeves (Elbow & Wrist)
    for (let s = 0; s < ARM_SOCKETS.length; s++) {
      const { boneIdx, t, radius, height } = ARM_SOCKETS[s];
      const [a, b] = ARM_SEGMENTS[boneIdx].conn;

      const conf = Math.min(pose[a * 4 + 3], pose[b * 4 + 3]);
      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        sockets.setMatrixAt(s, dummy.matrix);
        continue;
      }

      readPoint(start, pose, a * 4);
      readPoint(end, pose, b * 4);

      direction.subVectors(end, start);
      const pos = new THREE.Vector3().copy(start).addScaledVector(direction, t);
      tempQuat.setFromUnitVectors(Y_AXIS, direction.normalize());

      dummy.position.copy(pos);
      dummy.quaternion.copy(tempQuat);
      dummy.scale.set(radius, height, radius);
      dummy.updateMatrix();

      sockets.setMatrixAt(s, dummy.matrix);
    }
    sockets.instanceMatrix.needsUpdate = true;

    // 5. Shoulder Armor Cap - Positioned from the top over the shoulder joint
    for (let s = 0; s < 2; s++) {
      const shoulderIdx = s; // 0: Left, 1: Right
      const elbowIdx = s === 0 ? 2 : 3;

      const conf = Math.min(
        pose[shoulderIdx * 4 + 3],
        pose[elbowIdx * 4 + 3],
      );

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        shoulderArmor.setMatrixAt(s, dummy.matrix);
        continue;
      }

      readPoint(start, pose, shoulderIdx * 4);
      readPoint(end, pose, elbowIdx * 4);

      // Vector pointing towards the arm so the cap slightly leans outward
      direction.subVectors(end, start).normalize();

      // Cap sits right on top of the shoulder joint and tilts slightly outward
      const capUp = new THREE.Vector3(0, 1, 0)
        .addScaledVector(direction, 0.35)
        .normalize();

      tempQuat.setFromUnitVectors(Y_AXIS, capUp);

      // Lift slightly upward so it rests cleanly on top of the shoulder sphere
      const capPos = new THREE.Vector3()
        .copy(start)
        .addScaledVector(new THREE.Vector3(0, 1, 0), 0.022);

      dummy.position.copy(capPos);
      dummy.quaternion.copy(tempQuat);
      dummy.scale.set(0.155, 0.165, 0.155);
      dummy.updateMatrix();

      shoulderArmor.setMatrixAt(s, dummy.matrix);
    }
    shoulderArmor.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Limb Shells & Clavicle */}
      <instancedMesh
        ref={bonesRef}
        args={[armCylinderGeo, materials.armShell, ARM_SEGMENTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Internal Ball Bearings */}
      <instancedMesh
        ref={jointsRef}
        args={[jointSphereGeo, materials.joints, ARM_JOINTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Elbow Pivot Rings */}
      <instancedMesh
        ref={ringsRef}
        args={[jointRingGeo, materials.rings, ELBOW_JOINTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Mechanical Socket Collars */}
      <instancedMesh
        ref={socketsRef}
        args={[socketCuffGeo, materials.sockets, ARM_SOCKETS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Top Shoulder Armor Dome Caps */}
      <instancedMesh
        ref={shoulderArmorRef}
        args={[shoulderTopArmorGeo, materials.shoulderArmor, 2]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// ============================================================
// ENHANCED RESIZABLE HAND RIG
// ============================================================

export function HandRig({
  slot,
  color,
  sampleRef,
  scale = 1.0,
}: {
  slot: 0 | 1;
  color: string;
  sampleRef: SampleRef;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const knucklesRef = useRef<THREE.InstancedMesh>(null);
  const tipsRef = useRef<THREE.InstancedMesh>(null);
  const palmRef = useRef<THREE.Mesh>(null);

  const smoothPoints = useRef(new Float32Array(21 * 3));
  const scaledPoints = useRef(new Float32Array(21 * 3));
  const initialized = useRef(new Uint8Array(21));

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const start = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  const vWrist = useMemo(() => new THREE.Vector3(), []);
  const vIndex = useMemo(() => new THREE.Vector3(), []);
  const vPinky = useMemo(() => new THREE.Vector3(), []);
  const vPalmNormal = useMemo(() => new THREE.Vector3(), []);
  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);

  const materials = useMemo(
    () => ({
      fingers: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.28,
        roughness: 0.22,
      }),
      joints: new THREE.MeshStandardMaterial({
        color: TITANIUM_DARK,
        metalness: 0.88,
        roughness: 0.2,
      }),
      knuckleRings: new THREE.MeshStandardMaterial({
        color: RING_CHROME,
        metalness: 0.94,
        roughness: 0.14,
      }),
      tips: new THREE.MeshStandardMaterial({
        color: color || ACCENT_GOLD,
        metalness: 0.45,
        roughness: 0.32,
        emissive: new THREE.Color(color || ACCENT_GOLD).multiplyScalar(0.2),
      }),
      palm: new THREE.MeshStandardMaterial({
        color: CERAMIC_SLEEVE,
        roughness: 0.32,
        metalness: 0.35,
        side: THREE.DoubleSide,
      }),
    }),
    [color],
  );

  const palmGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(12 * 3);
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setIndex(PALM_INDICES);
    return geo;
  }, []);

  useEffect(
    () => () => {
      materials.fingers.dispose();
      materials.joints.dispose();
      materials.knuckleRings.dispose();
      materials.tips.dispose();
      materials.palm.dispose();
      palmGeo.dispose();
    },
    [materials, palmGeo],
  );

  useEffect(() => {
    initialized.current.fill(0);
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const bones = bonesRef.current;
    const joints = jointsRef.current;
    const knuckles = knucklesRef.current;
    const tips = tipsRef.current;
    const palm = palmRef.current;

    if (!group || !bones || !joints || !knuckles || !tips || !palm) return;

    const state = sampleRef.current;
    const alpha = state.handAlpha[slot];

    group.visible = alpha > 0.01;
    if (!group.visible) {
      initialized.current.fill(0);
      return;
    }

    const points = state.hands[slot];
    const valid = state.handValid[slot];

    group.position.set(0, 0, 0);

    const smoothing = 1 - Math.exp(-28 * Math.min(delta, 0.05));

    for (let j = 0; j < 21; j++) {
      const o = j * 3;
      if (!valid[j]) {
        initialized.current[j] = 0;
        continue;
      }

      if (j === 0 || !initialized.current[j]) {
        smoothPoints.current[o] = points[o];
        smoothPoints.current[o + 1] = points[o + 1];
        smoothPoints.current[o + 2] = points[o + 2];
        initialized.current[j] = 1;
        continue;
      }

      smoothPoints.current[o] = THREE.MathUtils.lerp(
        smoothPoints.current[o],
        points[o],
        smoothing,
      );
      smoothPoints.current[o + 1] = THREE.MathUtils.lerp(
        smoothPoints.current[o + 1],
        points[o + 1],
        smoothing,
      );
      smoothPoints.current[o + 2] = THREE.MathUtils.lerp(
        smoothPoints.current[o + 2],
        points[o + 2],
        smoothing,
      );
    }

    // Dynamic scale centered on the wrist
    const wX = smoothPoints.current[0];
    const wY = smoothPoints.current[1];
    const wZ = smoothPoints.current[2];

    const p = scaledPoints.current;
    for (let j = 0; j < 21; j++) {
      const o = j * 3;
      p[o] = wX + (smoothPoints.current[o] - wX) * scale;
      p[o + 1] = wY + (smoothPoints.current[o + 1] - wY) * scale;
      p[o + 2] = wZ + (smoothPoints.current[o + 2] - wZ) * scale;
    }

    const fading = alpha < 0.985;
    materials.fingers.transparent = fading;
    materials.fingers.opacity = alpha;
    materials.joints.transparent = fading;
    materials.joints.opacity = alpha;
    materials.knuckleRings.transparent = fading;
    materials.knuckleRings.opacity = alpha;
    materials.tips.transparent = fading;
    materials.tips.opacity = alpha;
    materials.palm.transparent = fading;
    materials.palm.opacity = alpha;

    // 1. Finger & Metacarpal Segments
    for (let i = 0; i < ALL_HAND_SEGMENTS.length; i++) {
      const [a, b] = ALL_HAND_SEGMENTS[i];

      if (!valid[a] || !valid[b]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        bones.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, p, a * 3);
      readPoint(end, p, b * 3);

      const rA = HAND_JOINT_RADII[a] * 0.88 * scale;
      const rB = HAND_JOINT_RADII[b] * 0.82 * scale;

      updateSegment(bones, i, start, end, rA, rB, dummy, direction);
    }
    bones.instanceMatrix.needsUpdate = true;

    // 2. Knuckle Spheres and Articulation Rings
    for (let i = 0; i < 21; i++) {
      if (!valid[i]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        joints.setMatrixAt(i, dummy.matrix);
        knuckles.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, p, i * 3);
      const rad = HAND_JOINT_RADII[i] * scale;
      updateJoint(joints, i, start, rad, dummy);

      if (i > 0 && !FINGER_TIPS.includes(i)) {
        const nextIdx = i + 1;
        readPoint(end, p, nextIdx * 3);
        direction.subVectors(end, start).normalize();
        tempQuat.setFromUnitVectors(Y_AXIS, direction);
        updateJoint(knuckles, i, start, rad * 1.08, dummy, tempQuat);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        knuckles.setMatrixAt(i, dummy.matrix);
      }
    }
    joints.instanceMatrix.needsUpdate = true;
    knuckles.instanceMatrix.needsUpdate = true;

    // 3. Tactile Fingertips
    for (let t = 0; t < FINGER_TIPS.length; t++) {
      const tipIdx = FINGER_TIPS[t];
      if (!valid[tipIdx]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        tips.setMatrixAt(t, dummy.matrix);
        continue;
      }

      readPoint(start, p, tipIdx * 3);
      updateJoint(tips, t, start, HAND_JOINT_RADII[tipIdx] * 1.1 * scale, dummy);
    }
    tips.instanceMatrix.needsUpdate = true;

    // 4. Contour Volumetric Palm Plate
    palm.visible = !!valid[0];
    if (palm.visible) {
      readPoint(vWrist, p, 0);
      readPoint(vIndex, p, 5 * 3);
      readPoint(vPinky, p, 17 * 3);

      vA.subVectors(vIndex, vWrist);
      vB.subVectors(vPinky, vWrist);
      vPalmNormal.crossVectors(vA, vB).normalize();

      const palmThickness = 0.013 * scale;
      const posAttr = palmGeo.getAttribute("position") as THREE.BufferAttribute;

      for (let k = 0; k < PALM_PERIMETER.length; k++) {
        const landmark = PALM_PERIMETER[k];
        const offset = landmark * 3;

        const lx = valid[landmark] ? p[offset] : p[0];
        const ly = valid[landmark] ? p[offset + 1] : p[1];
        const lz = valid[landmark] ? p[offset + 2] : p[2];

        // Front vertex
        posAttr.setXYZ(
          k,
          lx + vPalmNormal.x * palmThickness,
          ly + vPalmNormal.y * palmThickness,
          lz + vPalmNormal.z * palmThickness,
        );

        // Back vertex
        posAttr.setXYZ(
          k + 6,
          lx - vPalmNormal.x * palmThickness,
          ly - vPalmNormal.y * palmThickness,
          lz - vPalmNormal.z * palmThickness,
        );
      }

      posAttr.needsUpdate = true;
      palmGeo.computeVertexNormals();
    }
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      {/* 3D Volumetric Palm Plate */}
      <mesh
        ref={palmRef}
        geometry={palmGeo}
        material={materials.palm}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Tapered Finger & Metacarpal Bones */}
      <instancedMesh
        ref={bonesRef}
        args={[fingerBoneGeo, materials.fingers, ALL_HAND_SEGMENTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Internal Ball Knuckles */}
      <instancedMesh
        ref={jointsRef}
        args={[knuckleSphereGeo, materials.joints, 21]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Knuckle Articulation Rings */}
      <instancedMesh
        ref={knucklesRef}
        args={[knuckleRingGeo, materials.knuckleRings, 21]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Tactile Colored Fingertips */}
      <instancedMesh
        ref={tipsRef}
        args={[fingertipDomeGeo, materials.tips, FINGER_TIPS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}
```

---

# FILE: `frontend\src\components\simulation\HeadFaceRig.tsx`

```tsx
"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { THRESH } from "./simulationConstants";
import {
  getBoneGeometry,
  hideAll,
  placeBone,
} from "./RigUtils";

export const FACE_POINTS = 19;
export const HEAD_LEN = 11;

export interface SampleState {
  pose: Float32Array;
  poseInit: Uint8Array;
  hands: [Float32Array, Float32Array];
  handValid: [Uint8Array, Uint8Array];
  handInit: Uint8Array;
  handAlpha: Float32Array;
  face: Float32Array;
  faceValid: Uint8Array;
  faceInit: Uint8Array;
  head: Float32Array;
  headValid: boolean;
  headInit: boolean;
  facePresent: boolean;
  hasPose: boolean;
}

export type SampleRef = { current: SampleState };

// Curve segment counts
const BROW_STEPS = 10;
const EYE_STEPS = 28;
const PUPIL_STEPS = 16;
const SPARKLE_STEPS = 8;
const NOSE_SEGMENTS = 4;
const LIP_STEPS = 20;
const NECK_SEGMENTS = 4;

const FACE_SEGMENTS = 240;

// ---------------------------------------------------------------------------
// Head Shell Tuning
// ---------------------------------------------------------------------------
const HEAD_FIT_X = 1.26;
const HEAD_FIT_Y = 1.06;
const HEAD_DEPTH = 0.62;
const HEAD_BACK = 0.48;
const HEAD_FOLLOW = 0.45;
const HEAD_SCALE_FOLLOW = 0.12;

// Downward pitch correction (~5.5 degrees) so head looks straight forward
const PITCH_DOWN = 0.095;
const cosPitch = Math.cos(PITCH_DOWN);
const sinPitch = Math.sin(PITCH_DOWN);

export const HEAD_FACING = {
  center: new THREE.Vector3(),
  front: new THREE.Vector3(0, 0, 1),
  right: new THREE.Vector3(1, 0, 0),
  valid: false,
};

function createCleanCuteHeadGeometry(): THREE.BufferGeometry {
  const base = new THREE.SphereGeometry(1, 64, 48);
  base.deleteAttribute("normal");
  base.deleteAttribute("uv");
  const pos = base.getAttribute("position") as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Superellipsoid squircle rounding
    const n = 2.75;
    const sum = Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n);
    const r = Math.pow(sum, -1 / n);

    let nx = x * r;
    let ny = y * r;
    let nz = z * r;

    // Gentle bottom taper
    if (ny < 0) {
      const taper = 1.0 - 0.1 * Math.pow(-ny, 1.5);
      nx *= taper;
      nz *= taper;
    }

    pos.setXYZ(i, nx, ny, nz);
  }

  const merged = mergeVertices(base, 1e-4);
  merged.computeVertexNormals();
  base.dispose();
  return merged;
}

function createExteriorEarGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.14, 0.18, 0.08, 32);
  geo.rotateZ(Math.PI / 2);
  geo.translate(0.04, 0, 0);
  return geo;
}

// ---------------------------------------------------------------------------
// Frosted Glass Shader: Reduced Inner Blue Core + Luminous Mint Rim
// ---------------------------------------------------------------------------
function createHeadMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: THREE.FrontSide,
    blending: THREE.NormalBlending,
    uniforms: {
      uInnerGlow: { value: new THREE.Color("#050f1a") },
      uCoreGlow: { value: new THREE.Color("#0b4e78") },
      uRimColor: { value: new THREE.Color("#5effdc") },
      uHazeColor: { value: new THREE.Color("#4effd3") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInnerGlow;
      uniform vec3 uRimColor;
      uniform vec3 uCoreGlow;
      uniform vec3 uHazeColor;
      varying vec3 vNormal;
      varying vec3 vView;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vView);

        float grain = (hash(gl_FragCoord.xy * 0.75) - 0.5) * 0.035;
        float NdotV = clamp(abs(dot(N, V)) + grain, 0.0, 1.0);
        float fresnel = 1.0 - NdotV;

        float softMist = smoothstep(0.04, 0.88, fresnel);
        float blurredRim = pow(softMist, 1.45);
        float deepGlow = pow(fresnel, 0.9) * 0.35;

        vec3 color = mix(uInnerGlow, uCoreGlow, deepGlow);
        color = mix(color, uHazeColor, pow(fresnel, 2.5) * 0.25);
        color = mix(color, uRimColor, blurredRim);

        float alpha = clamp(0.60 + blurredRim * 0.40, 0.0, 1.0);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

// ---------------------------------------------------------------------------
// Head Rig Component
// ---------------------------------------------------------------------------
export function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const neckColor = useMemo(() => new THREE.Color(), []);

  const tmp = useMemo(
    () => ({
      top: new THREE.Vector3(),
      bottom: new THREE.Vector3(),
      sideA: new THREE.Vector3(),
      sideB: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      front: new THREE.Vector3(),
      center: new THREE.Vector3(),
      target: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      quat: new THREE.Quaternion(),
      scale: new THREE.Vector3(),
      wasFace: false,
      shoulderPt: new THREE.Vector3(),
      headBasePt: new THREE.Vector3(),
      tangent0: new THREE.Vector3(),
      tangent1: new THREE.Vector3(),
      pA: new THREE.Vector3(),
      pB: new THREE.Vector3(),
      arrA: new Float32Array(3),
      arrB: new Float32Array(3),
    }),
    [],
  );

  const headGeo = useMemo(() => createCleanCuteHeadGeometry(), []);
  const earGeo = useMemo(() => createExteriorEarGeometry(), []);
  const headMat = useMemo(() => createHeadMaterial(), []);

  const neckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c3863",
        emissive: "#091c36",
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.25,
      }),
    [],
  );

  useEffect(() => () => {
    headGeo.dispose(); earGeo.dispose(); headMat.dispose(); neckMat.dispose();
  }, [headGeo, earGeo, headMat, neckMat]);

  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;

    head.visible = st.headValid;
    if (!st.headValid) {
      HEAD_FACING.valid = false;
      hideAll(neck);
      return;
    }

    const F = st.face;
    const P = st.pose;
    const fv = st.faceValid;
    const faceFit = st.facePresent && !!fv[0] && !!fv[1] && !!fv[2] && !!fv[3];

    if (faceFit) {
      const { top, bottom, sideA, sideB, right, up, front, center, target, basis, quat, scale } = tmp;
      top.set(F[0], F[1], F[2]);
      bottom.set(F[3], F[4], F[5]);
      sideA.set(F[6], F[7], F[8]);
      sideB.set(F[9], F[10], F[11]);

      up.subVectors(top, bottom);
      right.subVectors(sideB, sideA);
      if (up.y < 0) up.negate();
      if (right.x < 0) right.negate();
      const height = up.length();
      const width = right.length();
      up.normalize();
      right.addScaledVector(up, -right.dot(up)).normalize();
      front.crossVectors(right, up).normalize();

      // Pitch adjustment: rotates front vector slightly down and up vector forward
      const pitchedUp = up.clone().multiplyScalar(cosPitch).addScaledVector(front, sinPitch).normalize();
      const pitchedFront = front.clone().multiplyScalar(cosPitch).addScaledVector(up, -sinPitch).normalize();
      up.copy(pitchedUp);
      front.copy(pitchedFront);

      basis.makeBasis(right, up, front);
      quat.setFromRotationMatrix(basis);

      center.copy(top).add(bottom).add(sideA).add(sideB).multiplyScalar(0.25);

      const radiusX = (width / 2) * HEAD_FIT_X;
      const radiusY = (height / 2) * HEAD_FIT_Y;
      const radiusZ = ((radiusX + radiusY) / 2) * HEAD_DEPTH;

      scale.set(radiusX, radiusY, radiusZ);
      target.copy(center).addScaledVector(front, -radiusZ * HEAD_BACK);

      if (!tmp.wasFace) {
        head.position.copy(target);
        head.quaternion.copy(quat);
        head.scale.copy(scale);
      } else {
        head.position.lerp(target, HEAD_FOLLOW);
        head.quaternion.slerp(quat, HEAD_FOLLOW);
        head.scale.lerp(scale, HEAD_SCALE_FOLLOW);
      }
      tmp.wasFace = true;
      HEAD_FACING.center.copy(center);
      HEAD_FACING.front.set(0, 0, 1).applyQuaternion(head.quaternion);
      HEAD_FACING.right.set(1, 0, 0).applyQuaternion(head.quaternion);
      HEAD_FACING.valid = true;
    }

    // -----------------------------------------------------------------------
    // Flexible Throat/Neck: Attached right to underside of chin (2/3 height)
    // -----------------------------------------------------------------------
    if (P[0 * 4 + 3] >= THRESH && P[1 * 4 + 3] >= THRESH) {
      const { shoulderPt, headBasePt, tangent0, tangent1, pA, pB, arrA, arrB } = tmp;

      shoulderPt.set((P[0] + P[4]) / 2, (P[1] + P[5]) / 2, (P[2] + P[6]) / 2);

      headBasePt.set(0, -head.scale.y * 0.95, -head.scale.z * 0.08)
        .applyQuaternion(head.quaternion)
        .add(head.position);

      const curveLength = shoulderPt.distanceTo(headBasePt);
      tangent0.set(0, 1, 0).multiplyScalar(curveLength * 0.65);
      tangent1.set(0, 1, 0).applyQuaternion(head.quaternion).multiplyScalar(curveLength * 0.65);

      const evalHermite = (t: number, out: THREE.Vector3) => {
        const t2 = t * t;
        const t3 = t2 * t;
        const h00 = 2 * t3 - 3 * t2 + 1;
        const h10 = t3 - 2 * t2 + t;
        const h01 = -2 * t3 + 3 * t2;
        const h11 = t3 - t2;
        out.set(0, 0, 0)
          .addScaledVector(shoulderPt, h00)
          .addScaledVector(tangent0, h10)
          .addScaledVector(headBasePt, h01)
          .addScaledVector(tangent1, h11);
      };

      for (let i = 0; i < NECK_SEGMENTS; i++) {
        const s = (i + 0.05) / NECK_SEGMENTS;
        const e = (i + 0.95) / NECK_SEGMENTS;

        evalHermite(s, pA);
        evalHermite(e, pB);

        arrA[0] = pA.x; arrA[1] = pA.y; arrA[2] = pA.z;
        arrB[0] = pB.x; arrB[1] = pB.y; arrB[2] = pB.z;

        const neckThickness = THREE.MathUtils.lerp(0.08, 0.07, i / NECK_SEGMENTS);
        placeBone(neck, i, arrA, 0, arrB, 0, neckThickness);
        neck.setColorAt(i, neckColor.set("#1c3863"));
      }
    } else {
      hideAll(neck);
    }
    neck.instanceMatrix.needsUpdate = true;
    if (neck.instanceColor) neck.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={headRef} geometry={headGeo} material={headMat} frustumCulled={false}>
        <mesh geometry={earGeo} material={headMat} position={[0.99, 0, -0.04]} />
        <mesh
          geometry={earGeo}
          material={headMat}
          position={[-0.99, 0, -0.04]}
          rotation={[0, 0, Math.PI]}
        />
      </mesh>
      <instancedMesh
        ref={neckRef}
        args={[getBoneGeometry(), neckMat, NECK_SEGMENTS]}
        frustumCulled={false}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Face Rig: Straight-Facing Eye Gaze & Natural Expression
// ---------------------------------------------------------------------------
export function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const toCamVec = useMemo(() => new THREE.Vector3(), []);
  const ptA = useMemo(() => new THREE.Vector3(), []);
  const ptB = useMemo(() => new THREE.Vector3(), []);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FACE_SEGMENTS * 6), 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    return geo;
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#6effe0",
        transparent: true,
        opacity: 0.98,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => () => { lineGeo.dispose(); lineMat.dispose(); }, [lineGeo, lineMat]);

  useFrame((state) => {
    const lines = linesRef.current;
    if (!lines) return;
    const st = sampleRef.current;

    if (HEAD_FACING.valid) {
      toCamVec.subVectors(state.camera.position, HEAD_FACING.center).normalize();
      const facing = HEAD_FACING.front.dot(toCamVec);
      if (facing <= 0.0) {
        lines.visible = false;
        return;
      }
      lines.visible = true;
      lineMat.opacity = THREE.MathUtils.clamp(facing * 2.2, 0.0, 0.98);
    } else {
      lines.visible = st.facePresent;
    }

    if (!st.facePresent) return;

    const time = state.clock.getElapsedTime();
    const positions = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const face = st.face;
    let segOffset = 0;

    // Rotates face point down slightly to match head orientation
    const rotatePoint = (x: number, y: number, z: number, out: THREE.Vector3) => {
      if (!HEAD_FACING.valid) {
        out.set(x, y, z);
        return;
      }
      const cx = HEAD_FACING.center.x;
      const cy = HEAD_FACING.center.y;
      const cz = HEAD_FACING.center.z;
      const dx = x - cx;
      const dy = y - cy;
      const dz = z - cz;

      // Downward pitch rotation
      const rY = dy * cosPitch - dz * sinPitch;
      const rZ = dy * sinPitch + dz * cosPitch;
      out.set(cx + dx, cy + rY, cz + rZ);
    };

    const addSegment = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
      if (segOffset >= FACE_SEGMENTS) return;
      rotatePoint(x0, y0, z0, ptA);
      rotatePoint(x1, y1, z1, ptB);
      positions.setXYZ(segOffset * 2, ptA.x, ptA.y, ptA.z);
      positions.setXYZ(segOffset * 2 + 1, ptB.x, ptB.y, ptB.z);
      segOffset++;
    };

    // 1. DATA-DRIVEN EYEBROWS
    const brows = [
      { pts: [4, 5, 6], valid: [4, 5, 6].every((i) => st.faceValid[i]) },
      { pts: [7, 8, 9], valid: [7, 8, 9].every((i) => st.faceValid[i]) },
    ];
    for (const b of brows) {
      if (b.valid) {
        for (let s = 0; s < BROW_STEPS; s++) {
          const t0 = s / BROW_STEPS;
          const t1 = (s + 1) / BROW_STEPS;
          const p0x = face[b.pts[0] * 3], p0y = face[b.pts[0] * 3 + 1], p0z = face[b.pts[0] * 3 + 2];
          const p1x = face[b.pts[1] * 3], p1y = face[b.pts[1] * 3 + 1], p1z = face[b.pts[1] * 3 + 2];
          const p2x = face[b.pts[2] * 3], p2y = face[b.pts[2] * 3 + 1], p2z = face[b.pts[2] * 3 + 2];

          const x0 = (1 - t0) * (1 - t0) * p0x + 2 * (1 - t0) * t0 * p1x + t0 * t0 * p2x;
          const y0 = (1 - t0) * (1 - t0) * p0y + 2 * (1 - t0) * t0 * p1y + t0 * t0 * p2y;
          const z0 = (1 - t0) * (1 - t0) * p0z + 2 * (1 - t0) * t0 * p1z + t0 * t0 * p2z;

          const x1 = (1 - t1) * (1 - t1) * p0x + 2 * (1 - t1) * t1 * p1x + t1 * t1 * p2x;
          const y1 = (1 - t1) * (1 - t1) * p0y + 2 * (1 - t1) * t1 * p1y + t1 * t1 * p2y;
          const z1 = (1 - t1) * (1 - t1) * p0z + 2 * (1 - t1) * t1 * p1z + t1 * t1 * p2z;

          addSegment(x0, y0, z0 + 0.006, x1, y1, z1 + 0.006);
        }
      }
    }

    // 2. BIG ADORABLE EYES (Straight-Forward Gaze)
    const eyesValid = [10, 11, 12, 13].every((i) => st.faceValid[i]);
    if (eyesValid) {
      const lX = (face[10 * 3] + face[11 * 3]) / 2;
      const lY = (face[10 * 3 + 1] + face[11 * 3 + 1]) / 2;
      const lZ = (face[10 * 3 + 2] + face[11 * 3 + 2]) / 2 + 0.008;

      const rX = (face[12 * 3] + face[13 * 3]) / 2;
      const rY = (face[12 * 3 + 1] + face[13 * 3 + 1]) / 2;
      const rZ = (face[12 * 3 + 2] + face[13 * 3 + 2]) / 2 + 0.008;

      const eyeDist = Math.hypot(rX - lX, rY - lY);
      const eyeRadius = THREE.MathUtils.clamp(eyeDist * 0.44, 0.032, 0.07);

      const lAperture = Math.hypot(face[10 * 3] - face[11 * 3], face[10 * 3 + 1] - face[11 * 3 + 1]);
      const rAperture = Math.hypot(face[12 * 3] - face[13 * 3], face[12 * 3 + 1] - face[13 * 3 + 1]);

      const normalOpen = eyeDist * 0.11;
      let lOpen = THREE.MathUtils.clamp(lAperture / normalOpen, 0.03, 1.0);
      let rOpen = THREE.MathUtils.clamp(rAperture / normalOpen, 0.03, 1.0);

      const blinkCycle = Math.sin(time * 1.8);
      if (blinkCycle > 0.96) {
        const blinkAmount = (1 - (blinkCycle - 0.96) / 0.04);
        lOpen *= blinkAmount;
        rOpen *= blinkAmount;
      }

      const eyeData = [
        { cx: lX, cy: lY, cz: lZ, open: lOpen, isLeft: true },
        { cx: rX, cy: rY, cz: rZ, open: rOpen, isLeft: false },
      ];

      for (const e of eyeData) {
        const h = eyeRadius * 0.9 * e.open;

        for (let s = 0; s < EYE_STEPS; s++) {
          const a0 = (s / EYE_STEPS) * Math.PI * 2;
          const a1 = ((s + 1) / EYE_STEPS) * Math.PI * 2;
          const x0 = e.cx + Math.cos(a0) * eyeRadius;
          const y0 = e.cy + Math.sin(a0) * h;
          const x1 = e.cx + Math.cos(a1) * eyeRadius;
          const y1 = e.cy + Math.sin(a1) * h;
          addSegment(x0, y0, e.cz, x1, y1, e.cz);
        }

        if (e.open > 0.25) {
          const pupilRad = eyeRadius * 0.54 * e.open;
          for (let s = 0; s < PUPIL_STEPS; s++) {
            const a0 = (s / PUPIL_STEPS) * Math.PI * 2;
            const a1 = ((s + 1) / PUPIL_STEPS) * Math.PI * 2;
            addSegment(
              e.cx + Math.cos(a0) * pupilRad,
              e.cy + Math.sin(a0) * pupilRad,
              e.cz + 0.001,
              e.cx + Math.cos(a1) * pupilRad,
              e.cy + Math.sin(a1) * pupilRad,
              e.cz + 0.001,
            );
          }

          // Center-leveled sparkle so gaze looks straight ahead
          const spSize = eyeRadius * 0.28;
          const spOx = e.cx + (e.isLeft ? -spSize * 0.5 : spSize * 0.5);
          const spOy = e.cy + spSize * 0.25;
          for (let s = 0; s < SPARKLE_STEPS; s++) {
            const a0 = (s / SPARKLE_STEPS) * Math.PI * 2 + Math.PI / 4;
            const a1 = ((s + 1) / SPARKLE_STEPS) * Math.PI * 2 + Math.PI / 4;
            const r0 = s % 2 === 0 ? spSize : spSize * 0.35;
            const r1 = (s + 1) % 2 === 0 ? spSize : spSize * 0.35;
            addSegment(
              spOx + Math.cos(a0) * r0,
              spOy + Math.sin(a0) * r0,
              e.cz + 0.002,
              spOx + Math.cos(a1) * r1,
              spOy + Math.sin(a1) * r1,
              e.cz + 0.002,
            );
          }
        }
      }

      // 3. MINIMAL BUTTON NOSE
      if (st.faceValid[14]) {
        const nx = face[14 * 3], ny = face[14 * 3 + 1], nz = face[14 * 3 + 2] + 0.008;
        const nLen = eyeDist * 0.06;
        for (let s = 0; s < NOSE_SEGMENTS; s++) {
          const t0 = 1 - s / NOSE_SEGMENTS;
          const t1 = 1 - (s + 1) / NOSE_SEGMENTS;
          addSegment(nx, ny + nLen * t0, nz, nx, ny + nLen * t1, nz);
        }
      }
    }

    // 4. CLEAN DATA-DRIVEN LIPS
    const mouthValid = [15, 16, 17, 18].every((i) => st.faceValid[i]);
    if (mouthValid) {
      const cL = { x: face[15 * 3], y: face[15 * 3 + 1], z: face[15 * 3 + 2] + 0.008 };
      const cR = { x: face[16 * 3], y: face[16 * 3 + 1], z: face[16 * 3 + 2] + 0.008 };
      const upLip = { x: face[17 * 3], y: face[17 * 3 + 1], z: face[17 * 3 + 2] + 0.008 };
      const loLip = { x: face[18 * 3], y: face[18 * 3 + 1], z: face[18 * 3 + 2] + 0.008 };

      for (let s = 0; s < LIP_STEPS; s++) {
        const t0 = s / LIP_STEPS;
        const t1 = (s + 1) / LIP_STEPS;

        const evalQuad = (p0: typeof cL, p1: typeof upLip, p2: typeof cR, t: number) => {
          const inv = 1 - t;
          return {
            x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
            y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y,
            z: inv * inv * p0.z + 2 * inv * t * p1.z + t * t * p2.z,
          };
        };

        const u0 = evalQuad(cL, upLip, cR, t0);
        const u1 = evalQuad(cL, upLip, cR, t1);
        addSegment(u0.x, u0.y, u0.z, u1.x, u1.y, u1.z);

        const l0 = evalQuad(cL, loLip, cR, t0);
        const l1 = evalQuad(cL, loLip, cR, t1);
        addSegment(l0.x, l0.y, l0.z, l1.x, l1.y, l1.z);
      }

      const mouthWidth = Math.hypot(cR.x - cL.x, cR.y - cL.y);
      const tick = mouthWidth * 0.06;
      addSegment(cL.x, cL.y, cL.z, cL.x - tick * 0.7, cL.y + tick * 0.7, cL.z);
      addSegment(cR.x, cR.y, cR.z, cR.x + tick * 0.7, cR.y + tick * 0.7, cR.z);
    }

    for (let i = segOffset; i < FACE_SEGMENTS; i++) {
      positions.setXYZ(i * 2, 0, 0, 0);
      positions.setXYZ(i * 2 + 1, 0, 0, 0);
    }

    positions.needsUpdate = true;
  });

  return (
    <lineSegments
      ref={linesRef}
      geometry={lineGeo}
      material={lineMat}
      frustumCulled={false}
      renderOrder={10}
    />
  );
}
```

---

# FILE: `frontend\src\components\simulation\LandmarkSimulation.tsx`

```tsx
"use client";
import "@/lib/threeSetup";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { DhutiRig } from "./DhutiRig";
import { ArmRig, HandRig } from "./HandRig";
import { RoundAlpanaStage } from "./AlpanaStage";
import { TorsoRig } from "./TorsoRig";
import { SIMULATION_FOV, SimulationRoom } from "./SimulationRoom";
import {
  DHUTI_DROP,
  HEAD_WIDTH_RATIO,
  THRESH,
  TORSO_WORLD,
} from "./simulationConstants";
import { FaceRig, HeadRig, FACE_POINTS, HEAD_LEN, type SampleRef, type SampleState } from "./HeadFaceRig";
export type { SampleRef } from "./HeadFaceRig";
import {
  POSE_POINTS,
  type PosePoint,
} from "@/lib/pose";

/* ==========================================================================
 * 1. EXISTING DATA / ALIGNMENT LOGIC (unchanged)
 * ========================================================================== */

type Point2 = { x: number; y: number };

const BODY_GUIDE: PosePoint[] = [
  [-0.7, -1.25, 0, 1],
  [0.7, -1.25, 0, 1],
  [-1.1, -0.65, 0, 1],
  [1.1, -0.65, 0, 1],
  [-1.35, 0, 0, 1],
  [1.35, 0, 0, 1],
  [-0.45, 0.55, 0, 1],
  [0.45, 0.55, 0, 1],
];
const POSE_DRAW_THRESHOLD = 0.01;

const isMissingHand = (frame: number[][], offset: number) =>
  frame
    .slice(offset, offset + 21)
    .every((point) => point[0] === 0 && point[1] === 0 && point[2] === 0);

function handAnchor(frame: number[][]): Point2 {
  return isMissingHand(frame, 21)
    ? { x: BODY_GUIDE[4][0], y: BODY_GUIDE[4][1] }
    : { x: BODY_GUIDE[5][0], y: BODY_GUIDE[5][1] };
}

function validPoint(point: number[] | undefined | null): point is number[] {
  return Boolean(
    point && Number.isFinite(point[0]) && Number.isFinite(point[1]),
  );
}

interface PoseAlignment {
  center: Point2;
  scale: number;
}

function getPoseAlignments(pose: PosePoint[][]): PoseAlignment[] {
  const measurements = pose.map((frame) => {
    const shoulders = [frame[0], frame[1]];
    const hips = [frame[6], frame[7]];
    const visible = [...shoulders, ...hips].filter(
      (point) => point && point[3] >= POSE_DRAW_THRESHOLD && validPoint(point),
    );
    const centerPoints = visible.length ? visible : [frame[0], frame[1]].filter(Boolean);
    const center = centerPoints.reduce(
      (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
      { x: 0, y: 0 },
    );
    center.x /= centerPoints.length || 1;
    center.y /= centerPoints.length || 1;

    const shoulderCenter = {
      x: (frame[0]?.[0] + frame[1]?.[0]) / 2,
      y: (frame[0]?.[1] + frame[1]?.[1]) / 2,
    };
    const hipCenter = {
      x: (frame[6]?.[0] + frame[7]?.[0]) / 2,
      y: (frame[6]?.[1] + frame[7]?.[1]) / 2,
    };
    const torsoLength = Math.hypot(
      shoulderCenter.x - hipCenter.x,
      shoulderCenter.y - hipCenter.y,
    );
    return { center, torsoLength };
  });

  const validLengths = measurements
    .map(({ torsoLength }) => torsoLength)
    .filter((length) => Number.isFinite(length) && length > 0.1);
  const referenceLength =
    validLengths.reduce((sum, length) => sum + length, 0) /
      (validLengths.length || 1);

  return measurements.map(({ center, torsoLength }) => ({
    center,
    scale:
      Number.isFinite(torsoLength) && torsoLength > 0.1
        ? referenceLength / torsoLength
        : 1,
  }));
}

function stabilizePoint(point: number[], alignment: PoseAlignment): Point2 {
  return {
    x: (point[0] - alignment.center.x) * alignment.scale,
    y: (point[1] - alignment.center.y) * alignment.scale,
  };
}

/* ==========================================================================
 * 2. 3D: CONSTANTS, TYPES, FACE TOPOLOGY
 * ========================================================================== */

const Z_POSE = 0.15;
const Z_HAND = 0.5;
const Z_LIMIT = 0.4;
const SNAP_MAX_TORSOS = 1.0;

/* Keep the dhuti knee-length and independent of leg landmarks so pose noise
 * cannot stretch or shorten the garment. */
const COLOR = {
  handLeft: "#5EEAD4",
  handRight: "#C4B5FD",
} as const;

interface Bounds {
  minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
}
const emptyBounds = (): Bounds => ({
  minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity,
});
function medianValue(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

function growBounds(b: Bounds, x: number, y: number, z: number): void {
  if (x < b.minX) b.minX = x;
  if (x > b.maxX) b.maxX = x;
  if (y < b.minY) b.minY = y;
  if (y > b.maxY) b.maxY = y;
  if (z < b.minZ) b.minZ = z;
  if (z > b.maxZ) b.maxZ = z;
}

interface SolvedFrame {
  hasPose: boolean;
  pose: Float32Array;
  hands: Float32Array;
  handPresent: [boolean, boolean];
  facePresent: boolean;
  face: Float32Array;
  head: Float32Array;
}
export interface SolvedSequence {
  frames: SolvedFrame[];
  bounds: Bounds;
}

/* ==========================================================================
 * 3. 3D: COORDINATE CONVERSION + SEQUENCE SOLVER
 * ========================================================================== */

function writeWorld(
  out: Float32Array, o: number, x: number, y: number, z: number, scale: number,
): void {
  out[o] = x * scale;
  out[o + 1] = -y * scale;
  out[o + 2] = -z * scale;
}

function medianTorso(pose: PosePoint[][] | undefined, alignments: PoseAlignment[] | undefined): number {
  if (!pose?.length || !alignments) return TORSO_WORLD;
  const values: number[] = [];
  pose.forEach((frame, i) => {
    const ok = [0, 1, 6, 7].every(
      (k) => frame[k] && validPoint(frame[k]) && frame[k][3] >= THRESH,
    );
    if (!ok) return;
    const length =
      Math.hypot(
        (frame[0][0] + frame[1][0]) / 2 - (frame[6][0] + frame[7][0]) / 2,
        (frame[0][1] + frame[1][1]) / 2 - (frame[6][1] + frame[7][1]) / 2,
      ) * (alignments[i]?.scale ?? 1);
    if (Number.isFinite(length) && length > 0.02) values.push(length);
  });
  if (!values.length) return 0.3;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

interface SolveContext {
  scale: number;
  bounds: Bounds;
}

function poseHeadFallback(pose: Float32Array, head: Float32Array): void {
  const vis = (i: number) => pose[i * 4 + 3] >= THRESH;
  if (!vis(0) || !vis(1)) return;
  const shoulderWidth = Math.hypot(
    pose[4] - pose[0],
    pose[5] - pose[1],
    pose[6] - pose[2],
  );
  const dx = pose[4] - pose[0];
  const dy = pose[5] - pose[1];
  const cx = (pose[0] + pose[4]) / 2;
  const shoulderY = (pose[1] + pose[5]) / 2;
  const torsoLength = vis(6) && vis(7)
    ? Math.hypot(
        cx - (pose[6 * 4] + pose[7 * 4]) / 2,
        shoulderY - (pose[6 * 4 + 1] + pose[7 * 4 + 1]) / 2,
        (pose[2] + pose[6]) / 2 - (pose[6 * 4 + 2] + pose[7 * 4 + 2]) / 2,
      )
    : 0;
  const width = Math.max(
    torsoLength > 0.1 ? torsoLength * HEAD_WIDTH_RATIO : shoulderWidth * 0.62,
    0.2,
  );
  const cy = shoulderY + width * 0.58;
  const cz = (pose[2] + pose[6]) / 2;
  const roll = Math.atan2(dx < 0 ? -dy : dy, Math.abs(dx));
  const w = width;
  const h = w * 1.2;
  const d = w * 0.8;
  head.set([1, cx, cy, cz, w, h, d, cx, shoulderY + NECK_LENGTH, cz, roll]);
}

const NECK_LENGTH = 0.2;

function solveFrame(
  ctx: SolveContext,
  frame: number[][],
  poseFrame: PosePoint[] | undefined,
  alignment: PoseAlignment | undefined,
  faceAvatar: number[][] | undefined,
): SolvedFrame {
  const S = ctx.scale;
  const hasPose = Boolean(poseFrame);
  const pf = poseFrame ?? BODY_GUIDE;

  let zc = 0;
  if (hasPose) {
    const zs = [0, 1]
      .map((i) => pf[i])
      .filter((p) => p && validPoint(p) && p[3] >= THRESH && Number.isFinite(p[2]));
    if (zs.length) zc = zs.reduce((s, p) => s + p[2], 0) / zs.length;
  }
  const zLimit = Z_LIMIT / S;
  const zScale = (alignment?.scale ?? 1) * Z_POSE;
  const pose = new Float32Array(POSE_POINTS * 4);
  const poseMpZ = new Float32Array(POSE_POINTS);
  for (let i = 0; i < POSE_POINTS; i++) {
    const p = pf[i];
    if (!p || !validPoint(p) || !(p[3] >= THRESH)) continue;
    const xy = alignment ? stabilizePoint(p, alignment) : { x: p[0], y: p[1] };
    const isArm = i >= 2 && i <= 5;
    const rawZ = hasPose && isArm && Number.isFinite(p[2]) ? (p[2] - zc) * zScale : 0;
    const z = Math.max(-zLimit, Math.min(zLimit, rawZ));
    poseMpZ[i] = z;
    writeWorld(pose, i * 4, xy.x, xy.y, z, S);
    pose[i * 4 + 3] = p[3];
  }

  const hands = new Float32Array(2 * 21 * 4);
  const handPresent: [boolean, boolean] = [false, false];
  const handOffset = hasPose ? { x: 0, y: 0 } : handAnchor(frame);
  const handScale = alignment?.scale ?? 1;
  ([0, 21] as const).forEach((off, slot) => {
    if (isMissingHand(frame, off)) return;
    handPresent[slot] = true;
    const wristIdx = slot === 0 ? 4 : 5;
    const ref = [wristIdx, wristIdx - 2].find((i) => pose[i * 4 + 3] >= THRESH);
    const baseZ = ref !== undefined ? poseMpZ[ref] : 0;
    for (let j = 0; j < 21; j++) {
      const p = frame[off + j];
      if (!validPoint(p)) continue;
      const tx = p[0] + handOffset.x;
      const ty = p[1] + handOffset.y;
      const sx = alignment ? (tx - alignment.center.x) * alignment.scale : tx;
      const sy = alignment ? (ty - alignment.center.y) * alignment.scale : ty;
      const rz = Number.isFinite(p[2]) ? p[2] : 0;
      const o = (slot * 21 + j) * 4;
      writeWorld(hands, o, sx, sy, baseZ + rz * handScale * Z_HAND, S);
      hands[o + 3] = 1;
    }
    const w = slot * 21 * 4;
    if (hands[w + 3] === 1) {
      const pi = wristIdx * 4;
      const gap = Math.hypot(hands[w] - pose[pi], hands[w + 1] - pose[pi + 1]);
      if (pose[pi + 3] < THRESH || gap < SNAP_MAX_TORSOS * TORSO_WORLD) {
        pose[pi] = hands[w];
        pose[pi + 1] = hands[w + 1];
        pose[pi + 2] = hands[w + 2];
        pose[pi + 3] = Math.max(pose[pi + 3], 0.8);
      }
    }
  });

  const face = new Float32Array(FACE_POINTS * 4);
  const head = new Float32Array(HEAD_LEN);
  poseHeadFallback(pose, head);
  let facePresent = false;
  if (faceAvatar?.length === FACE_POINTS && head[0] > 0) {
    const leftTemple = faceAvatar[2];
    const rightTemple = faceAvatar[3];
    const forehead = faceAvatar[0];
    const chin = faceAvatar[1];
    if (
      validPoint(leftTemple) &&
      validPoint(rightTemple) &&
      validPoint(forehead) &&
      validPoint(chin)
    ) {
      const sourceWidth = Math.hypot(
        rightTemple[0] - leftTemple[0],
        rightTemple[1] - leftTemple[1],
      );
      const sourceHeight = Math.abs(forehead[1] - chin[1]);
      if (sourceWidth > 1e-5 && sourceHeight > 1e-5) {
        const faceCenter = alignment
          ? stabilizePoint([
              (leftTemple[0] + rightTemple[0]) / 2,
              (forehead[1] + chin[1]) / 2,
            ], alignment)
          : {
              x: (leftTemple[0] + rightTemple[0]) / 2,
              y: (forehead[1] + chin[1]) / 2,
            };
        const faceScale =
          head[4] /
          (sourceWidth * (alignment?.scale ?? 1) * S);
        const faceHeightScale =
          head[5] /
          (sourceHeight * (alignment?.scale ?? 1) * S);
        const cos = Math.cos(head[10]);
        const sin = Math.sin(head[10]);
        const noseZ = Number.isFinite(faceAvatar[14]?.[2]) ? faceAvatar[14][2] : 0;
        const stabilizedChin = alignment ? stabilizePoint(chin, alignment) : {
          x: chin[0],
          y: chin[1],
        };
        const chinX = (stabilizedChin.x - faceCenter.x) * S * faceScale;
        const chinY = -(stabilizedChin.y - faceCenter.y) * S * faceHeightScale;
        const faceOriginX = head[7] - (chinX * cos - chinY * sin);
        const faceOriginY = head[8] - (chinX * sin + chinY * cos);
        let validCount = 0;
        for (let index = 0; index < FACE_POINTS; index++) {
          const point = faceAvatar[index];
          if (!validPoint(point) || !Number.isFinite(point[2])) continue;
          const stabilized = alignment ? stabilizePoint(point, alignment) : {
            x: point[0],
            y: point[1],
          };
          const localX = (stabilized.x - faceCenter.x) * S * faceScale;
          const localY = -(stabilized.y - faceCenter.y) * S * faceHeightScale;
          const offset = index * 4;
          face[offset] = faceOriginX + localX * cos - localY * sin;
          face[offset + 1] = faceOriginY + localX * sin + localY * cos;
          face[offset + 2] =
            head[3] +
            head[6] * 0.52 +
            (noseZ - point[2]) * S * faceScale * 0.25;
          face[offset + 3] = 1;
          validCount++;
        }
        facePresent = validCount >= Math.ceil(FACE_POINTS * 0.75);
      }
    }
  }

  /* Reject stray landmarks while retaining the upper-body and hand range. */
  const b = ctx.bounds;
  let ccx = 0, ccy = 0, ccz = 0, ccn = 0;
  for (const i of [0, 1, 6, 7]) {
    if (pose[i * 4 + 3] < THRESH) continue;
    ccx += pose[i * 4]; ccy += pose[i * 4 + 1]; ccz += pose[i * 4 + 2]; ccn++;
  }
  if (ccn) { ccx /= ccn; ccy /= ccn; ccz /= ccn; }
  const inReach = (x: number, y: number, z: number, maxTorso: number) =>
    Math.hypot(x - ccx, y - ccy) <= maxTorso * TORSO_WORLD &&
    Math.abs(z - ccz) <= maxTorso * TORSO_WORLD;
  for (let i = 0; i < POSE_POINTS; i++) {
    if (
      pose[i * 4 + 3] >= THRESH &&
      inReach(pose[i * 4], pose[i * 4 + 1], pose[i * 4 + 2], 3.4)
    ) {
      growBounds(b, pose[i * 4], pose[i * 4 + 1], pose[i * 4 + 2]);
    }
  }
  for (let i = 0; i < 42; i++) {
    if (
      hands[i * 4 + 3] === 1 &&
      inReach(hands[i * 4], hands[i * 4 + 1], hands[i * 4 + 2], 2.6)
    ) {
      growBounds(b, hands[i * 4], hands[i * 4 + 1], hands[i * 4 + 2]);
    }
  }
  if (head[0] > 0 && inReach(head[1], head[2], head[3], 2.4)) {
    growBounds(b, head[1] - head[4] / 2, head[2] - head[5] / 2, head[3]);
    growBounds(b, head[1] + head[4] / 2, head[2] + head[5] / 2, head[3] + head[6] / 2);
  }
  return { hasPose, pose, hands, handPresent, facePresent, face, head };
}

function solveSequence(
  frames: number[][][],
  pose: PosePoint[][] | undefined,
  alignments: PoseAlignment[] | undefined,
  faceAvatar: number[][][] | undefined,
): SolvedSequence {
  const ctx: SolveContext = {
    scale: TORSO_WORLD / medianTorso(pose, alignments),
    bounds: emptyBounds(),
  };
  const solved = frames.map((frame, f) =>
    solveFrame(ctx, frame, pose?.[f], alignments?.[f], faceAvatar?.[f]),
  );

  const hemHeights = solved.flatMap(({ pose: framePose }) => {
    if (
      framePose[6 * 4 + 3] < THRESH ||
      framePose[7 * 4 + 3] < THRESH
    ) {
      return [];
    }
    return [(framePose[6 * 4 + 1] + framePose[7 * 4 + 1]) / 2 - DHUTI_DROP];
  });
  if (hemHeights.length) {
    ctx.bounds.minY = Math.min(
      ctx.bounds.minY,
      hemHeights.reduce((lowest, height) => Math.min(lowest, height), Infinity) - 0.44,
    );
    const hips = solved.flatMap(({ pose: framePose }) =>
      framePose[6 * 4 + 3] >= THRESH && framePose[7 * 4 + 3] >= THRESH
        ? [{
            x: (framePose[6 * 4] + framePose[7 * 4]) / 2,
            z: (framePose[6 * 4 + 2] + framePose[7 * 4 + 2]) / 2,
          }]
        : [],
    );
    const stageRadius = Math.max((ctx.bounds.maxX - ctx.bounds.minX) * 0.74, 1.55);
    const stageCenterX = medianValue(hips.map(({ x }) => x));
    const stageCenterZ = medianValue(hips.map(({ z }) => z));
    ctx.bounds.minX = Math.min(ctx.bounds.minX, stageCenterX - stageRadius);
    ctx.bounds.maxX = Math.max(ctx.bounds.maxX, stageCenterX + stageRadius);
    ctx.bounds.minZ = Math.min(ctx.bounds.minZ, stageCenterZ - stageRadius);
    ctx.bounds.maxZ = Math.max(ctx.bounds.maxZ, stageCenterZ + stageRadius);
  }

  return { frames: solved, bounds: ctx.bounds };
}

/* ==========================================================================
 * 4. 3D: FRAME SAMPLING
 * ========================================================================== */

function createSampleState(): SampleState {
  return {
    pose: new Float32Array(POSE_POINTS * 4),
    poseInit: new Uint8Array(POSE_POINTS),
    hands: [new Float32Array(63), new Float32Array(63)],
    handValid: [new Uint8Array(21), new Uint8Array(21)],
    handInit: new Uint8Array(2),
    handAlpha: new Float32Array(2),
    face: new Float32Array(FACE_POINTS * 3),
    faceValid: new Uint8Array(FACE_POINTS),
    faceInit: new Uint8Array(FACE_POINTS),
    head: new Float32Array(HEAD_LEN),
    headValid: false,
    headInit: false,
    facePresent: false,
    hasPose: false,
  };
}

const _t = new Float32Array(4);

function blendSource(A: Float32Array, B: Float32Array, i: number, a: number, minW: number): boolean {
  const o = i * 4;
  const okA = A[o + 3] >= minW;
  const okB = B[o + 3] >= minW;
  if (!okA && !okB) return false;
  if (okA && okB) {
    for (let k = 0; k < 4; k++) _t[k] = A[o + k] + (B[o + k] - A[o + k]) * a;
  } else {
    const src = okA ? A : B;
    for (let k = 0; k < 4; k++) _t[k] = src[o + k];
  }
  return true;
}

function easeInto(dst: Float32Array, o: number, init: boolean, kxy: number, kz: number): void {
  if (!init) {
    dst[o] = _t[0]; dst[o + 1] = _t[1]; dst[o + 2] = _t[2];
    return;
  }
  dst[o] += (_t[0] - dst[o]) * kxy;
  dst[o + 1] += (_t[1] - dst[o + 1]) * kxy;
  dst[o + 2] += (_t[2] - dst[o + 2]) * kz;
}

function sampleFrame(
  seq: SolvedSequence, st: SampleState, playhead: number, delta: number, snap: boolean,
): void {
  const n = seq.frames.length;
  const i0 = Math.min(Math.max(Math.floor(playhead), 0), n - 1);
  const i1 = Math.min(i0 + 1, n - 1);
  const a = i1 === i0 ? 0 : playhead - i0;
  const f0 = seq.frames[i0];
  const f1 = seq.frames[i1];
  const kxy = snap ? 1 : 1 - Math.exp(-delta * 40);
  const kz = snap ? 1 : 1 - Math.exp(-delta * 14);

  for (let i = 0; i < POSE_POINTS; i++) {
    const o = i * 4;
    if (!blendSource(f0.pose, f1.pose, i, a, THRESH)) {
      st.pose[o + 3] = 0;
      st.poseInit[i] = 0;
      continue;
    }
    easeInto(st.pose, o, st.poseInit[i] === 1, kxy, kz);
    st.pose[o + 3] = _t[3];
    st.poseInit[i] = 1;
  }
  st.hasPose = (a < 0.5 ? f0 : f1).hasPose;

  for (let h = 0; h < 2; h++) {
    const present = f0.handPresent[h] || f1.handPresent[h];
    if (present && st.handAlpha[h] < 0.08) st.handInit[h] = 0;
    const target = present ? 1 : 0;
    st.handAlpha[h] = snap
      ? target
      : st.handAlpha[h] + (target - st.handAlpha[h]) * (1 - Math.exp(-delta * (present ? 16 : 5)));
    if (!present) continue;
    const pts = st.hands[h];
    const valid = st.handValid[h];
    const init = st.handInit[h] === 1;
    for (let j = 0; j < 21; j++) {
      if (!blendSource(f0.hands, f1.hands, h * 21 + j, a, 0.5)) {
        valid[j] = 0;
        continue;
      }
      valid[j] = 1;
      easeInto(pts, j * 3, init, kxy, kz);
    }
    st.handInit[h] = 1;
  }

  st.facePresent = f0.facePresent || f1.facePresent;
  for (let k = 0; k < FACE_POINTS; k++) {
    if (!blendSource(f0.face, f1.face, k, a, 0.5)) {
      st.faceValid[k] = 0;
      st.faceInit[k] = 0;
      continue;
    }
    st.faceValid[k] = 1;
    easeInto(st.face, k * 3, st.faceInit[k] === 1, kxy, kz);
    st.faceInit[k] = 1;
  }

  const v0 = f0.head[0] > 0;
  const v1 = f1.head[0] > 0;
  st.headValid = v0 || v1;
  if (st.headValid) {
    const kh = snap ? 1 : 1 - Math.exp(-delta * 25);
    for (let k = 1; k < HEAD_LEN; k++) {
      const t = v0 && v1
        ? f0.head[k] + (f1.head[k] - f0.head[k]) * a
        : v0
          ? f0.head[k]
          : f1.head[k];
      st.head[k] = st.headInit ? st.head[k] + (t - st.head[k]) * kh : t;
    }
    st.headInit = true;
  } else {
    st.headInit = false;
  }
}

/* ==========================================================================
 * 5. 3D: SHARED THREE HELPERS
 * ========================================================================== */

const _p = new THREE.Vector3();
const _d = new THREE.Vector3();
/* ==========================================================================
 * 6. 3D: RIG COMPONENTS
 * ========================================================================== */

/* ==========================================================================
 * 7. 3D: PLAYBACK, CAMERA, FLOOR, SCENE
 * ========================================================================== */

interface PlaybackState { playing: boolean; speed: number }

function PlaybackDriver({
  seq, sampleRef, playheadRef, playbackRef, fps, onFrame, loop, onComplete, restartToken,
}: {
  seq: SolvedSequence;
  sampleRef: SampleRef;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  fps: number;
  onFrame: (frame: number) => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
}) {
  const lastShown = useRef(-1);
  const lastPlayhead = useRef(-100);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    completed.current = false;
  }, [restartToken]);

  useFrame((_, delta) => {
    const n = seq.frames.length;
    if (n === 0) return;
    const dt = Math.min(delta, 0.1);
    const pb = playbackRef.current;
    let ph = playheadRef.current;
    if (pb.playing && n > 1) {
      ph += dt * fps * pb.speed;
      if (ph >= n) {
        if (loop) {
          ph %= n;
        } else {
          ph = n - 1;
          pb.playing = false;
          if (!completed.current) {
            completed.current = true;
            onCompleteRef.current?.();
          }
        }
      }
      playheadRef.current = ph;
    }
    ph = Math.min(Math.max(ph, 0), n - 1 + 0.999);
    const snap = Math.abs(ph - lastPlayhead.current) > 2.5;
    lastPlayhead.current = ph;
    sampleFrame(seq, sampleRef.current, Math.min(ph, n - 1), dt, snap);
    const shown = Math.min(Math.floor(ph), n - 1);
    if (shown !== lastShown.current) {
      lastShown.current = shown;
      onFrame(shown);
    }
  }, -2);
  return null;
}

type ViewKind =
  | "front" | "side" | "angle" | "reset"
  | "focusHands" | "focusFace";
interface ViewCommand { kind: ViewKind; nonce: number }

const VIEW_DIRS = {
  front: new THREE.Vector3(0, 0.04, 1).normalize(),
  side: new THREE.Vector3(1, 0.04, 0).normalize(),
  angle: new THREE.Vector3(0.62, 0.18, 0.76).normalize(),
};

function computeFraming(b: Bounds, aspect: number): { center: THREE.Vector3; distance: number } {
  if (!Number.isFinite(b.minX)) return { center: new THREE.Vector3(), distance: 6 };
  const center = new THREE.Vector3((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
  const halfW = Math.max((b.maxX - b.minX) / 2, 0.3);
  const halfH = Math.max((b.maxY - b.minY) / 2, 0.3);
  const halfD = Math.max((b.maxZ - b.minZ) / 2, 0);
  const t = Math.tan(THREE.MathUtils.degToRad(SIMULATION_FOV) / 2);
  const distance =
    Math.max((halfH * 1.08) / t, (halfW * 1.08) / (t * Math.max(aspect, 0.2))) + halfD + 0.15;
  return { center, distance };
}

type OrbitControlsHandle = React.ElementRef<typeof OrbitControls>;

function CameraRig({
  bounds, command, defaultCameraDistanceScale, defaultCameraVerticalOffset,
  horizontalOnly, sampleRef, viewResetToken,
}: {
  bounds: Bounds;
  command: ViewCommand;
  defaultCameraDistanceScale: number;
  defaultCameraVerticalOffset: number;
  horizontalOnly: boolean;
  sampleRef: SampleRef;
  viewResetToken: number;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const controlsRef = useRef<OrbitControlsHandle>(null);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const focusRef = useRef<{ kind: "hands" | "face"; dist: number } | null>(null);
  const focusPoint = useRef(new THREE.Vector3());
  const focusInit = useRef(false);
  const interacted = useRef(false);
  const lastViewResetToken = useRef(viewResetToken);
  const dragging = useRef(false);
  const aspect = size.width / Math.max(size.height, 1);
  const framing = useMemo(() => computeFraming(bounds, aspect), [bounds, aspect]);
  const framingRef = useRef(framing);
  framingRef.current = framing;

  const getDefaultView = useCallback(() => {
    const { center, distance } = framingRef.current;
    const viewDistance = distance * defaultCameraDistanceScale;
    const target = center.clone();
    target.y +=
      defaultCameraVerticalOffset *
      2 *
      viewDistance *
      Math.tan(THREE.MathUtils.degToRad(SIMULATION_FOV) / 2);
    return { target, distance: viewDistance };
  }, [defaultCameraDistanceScale, defaultCameraVerticalOffset]);

  const placeFront = useCallback(() => {
    const { target, distance } = getDefaultView();
    camera.position.copy(target).addScaledVector(VIEW_DIRS.front, distance);
    const ctl = controlsRef.current;
    if (ctl) {
      ctl.target.copy(target);
      ctl.update();
    } else {
      camera.lookAt(target);
    }
  }, [camera, getDefaultView]);

  useLayoutEffect(() => {
    interacted.current = false;
    goal.current = null;
    focusRef.current = null;
    focusInit.current = false;
    placeFront();
  }, [bounds, placeFront]);

  useEffect(() => {
    if (!interacted.current) placeFront();
  }, [framing.distance, placeFront]);

  useEffect(() => {
    const el = gl.domElement;
    const down = () => { dragging.current = true; };
    const up = () => { dragging.current = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useEffect(() => {
    if (command.nonce === 0) return;
    const { target, distance: base } = getDefaultView();
    const ctl = controlsRef.current;
    const currentTarget = ctl ? ctl.target.clone() : target.clone();
    const offset = camera.position.clone().sub(currentTarget);
    const current = offset.length() || base;
    switch (command.kind) {
      case "front":
      case "side":
      case "angle":
        focusRef.current = null;
        goal.current = {
          pos: target.clone().addScaledVector(VIEW_DIRS[command.kind], current),
          target: target.clone(),
        };
        break;
      case "reset":
        interacted.current = false;
        focusRef.current = null;
        focusInit.current = false;
        goal.current = null;
        camera.position.copy(target).addScaledVector(VIEW_DIRS.front, base);
        if (ctl) {
          ctl.target.copy(target);
          ctl.update();
        } else {
          camera.lookAt(target);
        }
        break;
      case "focusHands":
      case "focusFace":
        interacted.current = true;
        goal.current = null;
        focusRef.current = {
          kind: command.kind === "focusHands" ? "hands" : "face",
          dist: framingRef.current.distance * 0.34,
        };
        focusInit.current = false;
        break;
    }
  }, [command, camera, getDefaultView]);

  useEffect(() => {
    if (lastViewResetToken.current === viewResetToken) return;
    lastViewResetToken.current = viewResetToken;
    const { target, distance } = getDefaultView();
    interacted.current = false;
    focusRef.current = null;
    focusInit.current = false;
    goal.current = null;
    camera.position.copy(target).addScaledVector(VIEW_DIRS.front, distance);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(target);
      controls.update();
    } else {
      camera.lookAt(target);
    }
  }, [viewResetToken, camera, getDefaultView]);

  useFrame((_, delta) => {
    const ctl = controlsRef.current;
    if (!ctl) return;

    (ctl as unknown as { zoomToCursor?: boolean }).zoomToCursor = !focusRef.current;

    if (focusRef.current) {
      const st = sampleRef.current;
      if (focusRef.current.kind === "face" && st.headValid) {
        _p.set(st.head[1], st.head[2], st.head[3]);
      } else {
        let nx = 0, ny = 0, nz = 0, n = 0;
        for (let h = 0; h < 2; h++) {
          if (st.handAlpha[h] > 0.4 && st.handValid[h][0] === 1) {
            nx += st.hands[h][0]; ny += st.hands[h][1]; nz += st.hands[h][2]; n++;
          }
        }
        if (n === 0) {
          const P = st.pose;
          for (const i of [15, 16]) {
            if (P[i * 4 + 3] >= THRESH) {
              nx += P[i * 4]; ny += P[i * 4 + 1]; nz += P[i * 4 + 2]; n++;
            }
          }
        }
        if (n === 0 && st.headValid) { nx = st.head[1]; ny = st.head[2]; nz = st.head[3]; n = 1; }
        if (n > 0) _p.set(nx / n, ny / n, nz / n);
        else _p.set(0, 0, 0);
      }
      if (!focusInit.current) { focusPoint.current.copy(_p); focusInit.current = true; }
      else focusPoint.current.lerp(_p, 1 - Math.exp(-delta * 6));

      const k = 1 - Math.exp(-delta * 7);
      ctl.target.lerp(focusPoint.current, k);
      _d.copy(camera.position).sub(ctl.target);
      if (_d.lengthSq() < 1e-6) _d.set(0, 0, 1);
      _d.normalize();
      camera.position.copy(ctl.target).addScaledVector(_d, focusRef.current.dist);
      ctl.update();
    } else {
      const g = goal.current;
      if (g) {
        const k = 1 - Math.exp(-delta * 9);
        camera.position.lerp(g.pos, k);
        ctl.target.lerp(g.target, k);
        ctl.update();
        const eps = framingRef.current.distance * 0.002;
        if (camera.position.distanceToSquared(g.pos) < eps * eps) {
          camera.position.copy(g.pos);
          ctl.target.copy(g.target);
          ctl.update();
          goal.current = null;
        }
      }
    }

  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      screenSpacePanning
      enablePan
      minPolarAngle={horizontalOnly ? Math.PI / 2 : 0}
      maxPolarAngle={horizontalOnly ? Math.PI / 2 : Math.PI}
      minDistance={framing.distance / 7}
      maxDistance={framing.distance}
      onStart={() => {
        interacted.current = true;
        if (dragging.current) {
          goal.current = null;
          focusRef.current = null;
        }
      }}
    />
  );
}

function SceneContent({
  seq, fps, playheadRef, playbackRef, command, onFrame,
  loop, onComplete, restartToken, defaultCameraDistanceScale, defaultCameraVerticalOffset,
  horizontalOnly, viewResetToken,
}: {
  seq: SolvedSequence;
  fps: number;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  command: ViewCommand;
  onFrame: (frame: number) => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
  defaultCameraDistanceScale: number;
  defaultCameraVerticalOffset: number;
  horizontalOnly: boolean;
  viewResetToken: number;
}) {
  const sampleRef = useMemo<SampleRef>(() => ({ current: createSampleState() }), [seq]);
  return (
    <>
      <PlaybackDriver
        seq={seq} sampleRef={sampleRef} playheadRef={playheadRef}
        playbackRef={playbackRef} fps={fps} onFrame={onFrame} loop={loop}
        onComplete={onComplete} restartToken={restartToken}
      />
      <CameraRig
        bounds={seq.bounds}
        command={command}
        defaultCameraDistanceScale={defaultCameraDistanceScale}
        defaultCameraVerticalOffset={defaultCameraVerticalOffset}
        horizontalOnly={horizontalOnly}
        sampleRef={sampleRef}
        viewResetToken={viewResetToken}
      />
      <RoundAlpanaStage seq={seq} />
      <TorsoRig sampleRef={sampleRef} playbackRef={playbackRef} />
      <HeadRig sampleRef={sampleRef} />
      <ArmRig sampleRef={sampleRef} />
      <DhutiRig sampleRef={sampleRef} />
      <FaceRig sampleRef={sampleRef} />
      <HandRig slot={0} color={COLOR.handLeft} sampleRef={sampleRef} />
      <HandRig slot={1} color={COLOR.handRight} sampleRef={sampleRef} />
    </>
  );
}

function detectWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") || probe.getContext("webgl")) as WebGLRenderingContext | null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/* ==========================================================================
 * 8. PUBLIC COMPONENT
 * ========================================================================== */

interface LandmarkSimulationProps {
  frames?: number[][][];
  pose?: PosePoint[][];
  faceAvatar?: number[][][];
  fps?: number;
  defaultCameraDistanceScale?: number;
  defaultCameraVerticalOffset?: number;
  title?: string;
  minimal?: boolean;
  loop?: boolean;
  onFrameChange?: (frame: number) => void;
  onComplete?: () => void;
  restartToken?: number;
  horizontalOnly?: boolean;
  autoPlay?: boolean;
  viewResetToken?: number;
}

const VIEW_BUTTONS: { label: string; kind: ViewKind }[] = [
  { label: "FRONT", kind: "front" },
  { label: "SIDE", kind: "side" },
  { label: "3/4", kind: "angle" },
  { label: "HANDS", kind: "focusHands" },
  { label: "FACE", kind: "focusFace" },
  { label: "RESET", kind: "reset" },
];

export function LandmarkSimulation({
  frames,
  pose,
  faceAvatar,
  fps = 15,
  defaultCameraDistanceScale = 1,
  defaultCameraVerticalOffset = 0,
  title,
  minimal = false,
  loop = true,
  onFrameChange,
  onComplete,
  restartToken = 0,
  horizontalOnly = true, // same stage angle everywhere => both viewers match
  autoPlay = true,
  viewResetToken = 0,
}: LandmarkSimulationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [viewerFailed, setViewerFailed] = useState(false);
  const [viewCommand, setViewCommand] = useState<ViewCommand>({ kind: "reset", nonce: 0 });

  const playheadRef = useRef(0);
  const playbackRef = useRef<PlaybackState>({ playing: autoPlay, speed: 1 });
  playbackRef.current.playing = minimal ? autoPlay : isPlaying;
  playbackRef.current.speed = playbackSpeed;
  const lastRestartTokenRef = useRef(restartToken);

  const totalFrames = frames?.length ?? 0;
  const poseAlignments = useMemo(
    () => (pose?.length ? getPoseAlignments(pose) : undefined),
    [pose],
  );
  const seq = useMemo(
    () =>
      frames?.length
        ? solveSequence(frames, pose, poseAlignments, faceAvatar)
        : null,
    [frames, pose, poseAlignments, faceAvatar],
  );

  const mode: "pending" | "3d" | "unavailable" =
    webgl === null ? "pending" : webgl && !viewerFailed && seq ? "3d" : "unavailable";

  const currentFrameData = frames?.[currentFrame];
  const currentHandsCount = currentFrameData
    ? [0, 21].filter((offset) => !isMissingHand(currentFrameData, offset)).length
    : 0;
  const currentFaceAvatarCount = faceAvatar?.[currentFrame]?.length ?? 0;
  const displayTitle = title?.replace(/^.*onnx_models[\\/]\d+[:/\\]?/i, "") ?? title;

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  useEffect(() => {
    if (playheadRef.current >= totalFrames) {
      playheadRef.current = 0;
      setCurrentFrame(0);
    }
  }, [totalFrames]);

  useEffect(() => {
    if (lastRestartTokenRef.current === restartToken) return;
    lastRestartTokenRef.current = restartToken;
    playheadRef.current = 0;
    playbackRef.current.playing = true;
    setIsPlaying(true);
    setCurrentFrame(0);
  }, [restartToken]);

  const handleFrame = useCallback((frame: number) => {
    setCurrentFrame(frame);
    onFrameChange?.(frame);
  }, [onFrameChange]);
  const handleFail = useCallback(() => setViewerFailed(true), []);
  const sendView = (kind: ViewKind) =>
    setViewCommand((c) => ({ kind, nonce: c.nonce + 1 }));

  const seek = (value: number) => {
    playheadRef.current = value;
    setCurrentFrame(value);
  };

  if (totalFrames === 0) {
    return (
      <div className="aspect-video w-full bg-background border border-border rounded-md flex flex-col items-center justify-center space-y-2">
        <Database size={28} className="text-text-muted" />
        <div className="text-xs font-mono text-text-secondary">NO LANDMARK DATA</div>
        <div className="text-[11px] text-text-muted max-w-xs text-center">
          No extracted sequence exists for this sign yet. Run training extraction or accept a community sample.
        </div>
      </div>
    );
  }

  const overlayButton =
    "px-2 py-0.5 rounded text-[10px] border border-border bg-surface/80 text-text-secondary backdrop-blur hover:text-text-primary";

  return (
    <div className={minimal
      ? "relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-background"
      : "bg-surface border border-border rounded-md overflow-hidden flex flex-col"}>
      {!minimal && <div className="flex min-w-0 flex-nowrap items-center gap-x-2 overflow-hidden whitespace-nowrap border-b border-border bg-surface-elevated/50 px-3 py-2 tech-mono text-[11px] text-text-secondary">
        <span className="shrink-0">
          Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong>
        </span>
        <span className="shrink-0" aria-hidden="true">|</span>
        <span className="shrink-0">FPS: <strong className="text-accent-primary">{fps}</strong></span>
        <span className="shrink-0" aria-hidden="true">|</span>
        <span className="shrink-0">
          Hands: <strong className="text-status-approved">{currentHandsCount}</strong>
        </span>
        <span className="shrink-0" aria-hidden="true">|</span>
        {pose?.length ? (
          <span className="shrink-0">
            Pose: <strong className="text-[#818CF8]">{POSE_POINTS}</strong>
          </span>
        ) : (
          <span className="shrink-0 text-[#818CF8]">Body guide</span>
        )}
        {currentFaceAvatarCount > 0 ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-sky-300">Face: {currentFaceAvatarCount}</span>
          </>
        ) : faceAvatar ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-text-muted">No face</span>
          </>
        ) : null}
        {displayTitle && (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="min-w-0 truncate text-accent-secondary" title={title}>
              {displayTitle}
            </span>
          </>
        )}
      </div>}

      <div className={minimal
        ? "absolute inset-0 flex items-center justify-center canvas-grid-bg overflow-hidden"
        : "relative aspect-video w-full bg-background flex items-center justify-center canvas-grid-bg overflow-hidden"}>
        {mode === "3d" && seq && (
          <SimulationRoom onFail={handleFail}>
            <SceneContent
              seq={seq}
              fps={fps}
              defaultCameraDistanceScale={defaultCameraDistanceScale}
              defaultCameraVerticalOffset={defaultCameraVerticalOffset}
              playheadRef={playheadRef}
              playbackRef={playbackRef}
              command={viewCommand}
              onFrame={handleFrame}
              loop={loop}
              onComplete={onComplete}
              restartToken={restartToken}
              horizontalOnly={horizontalOnly}
              viewResetToken={viewResetToken}
            />
          </SimulationRoom>
        )}
        {mode === "unavailable" && (
          <div className="px-6 text-center text-[11px] text-text-muted">
            The 3D viewer needs WebGL, which is not available in this browser.
          </div>
        )}

        {!minimal && (
          <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1 tech-mono">
            {mode === "3d" &&
              VIEW_BUTTONS.map(({ label, kind }) => (
                <button key={kind} type="button" onClick={() => sendView(kind)} className={overlayButton}>
                  {label}
                </button>
              ))}
          </div>
        )}
      </div>

      {!minimal && <div className="p-3 bg-surface-elevated/50 border-t border-border flex items-center justify-between tech-mono text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-surface hover:bg-surface-elevated border border-border text-text-primary"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => seek(0)}
            className="p-1.5 rounded bg-surface hover:bg-surface-elevated border border-border text-text-secondary hover:text-text-primary"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>

          <span className="text-text-muted text-[11px] ml-2">
            SPEED:
          </span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                playbackSpeed === spd
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <div className="flex-1 mx-6 flex items-center">
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => seek(parseInt(e.target.value))}
            className="w-full accent-accent-primary bg-surface h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-[11px] text-text-secondary">
          {((currentFrame / fps)).toFixed(2)}s / {(totalFrames / fps).toFixed(2)}s
        </div>
      </div>}
    </div>
  );
}
```

---

# FILE: `frontend\src\components\simulation\RigUtils.ts`

```typescript
import * as THREE from "three";

const matrix = new THREE.Matrix4();
const quaternion = new THREE.Quaternion();
const position = new THREE.Vector3();
const scale = new THREE.Vector3();
const direction = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

export const ZERO_MATRIX = new THREE.Matrix4().makeScale(0, 0, 0);

let boneGeometry: THREE.CylinderGeometry | null = null;
let jointGeometry: THREE.SphereGeometry | null = null;
let headGeometry: THREE.SphereGeometry | null = null;

export const getBoneGeometry = () =>
  (boneGeometry ??= new THREE.CylinderGeometry(0.78, 1, 1, 14, 1, false));
export const getJointGeometry = () =>
  (jointGeometry ??= new THREE.SphereGeometry(1, 18, 14));
export const getHeadGeometry = () =>
  (headGeometry ??= new THREE.SphereGeometry(1, 36, 26));

export function placeBone(
  mesh: THREE.InstancedMesh,
  index: number,
  start: ArrayLike<number>,
  startOffset: number,
  end: ArrayLike<number>,
  endOffset: number,
  radius: number,
): void {
  direction.set(
    end[endOffset] - start[startOffset],
    end[endOffset + 1] - start[startOffset + 1],
    end[endOffset + 2] - start[startOffset + 2],
  );
  const length = direction.length();
  if (length < 1e-5) {
    mesh.setMatrixAt(index, ZERO_MATRIX);
    return;
  }
  direction.multiplyScalar(1 / length);
  quaternion.setFromUnitVectors(up, direction);
  position.set(
    (start[startOffset] + end[endOffset]) / 2,
    (start[startOffset + 1] + end[endOffset + 1]) / 2,
    (start[startOffset + 2] + end[endOffset + 2]) / 2,
  );
  scale.set(radius, length, radius);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(index, matrix);
}

export function placeJoint(
  mesh: THREE.InstancedMesh,
  index: number,
  points: ArrayLike<number>,
  offset: number,
  radius: number,
): void {
  position.set(points[offset], points[offset + 1], points[offset + 2]);
  quaternion.identity();
  scale.setScalar(radius);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(index, matrix);
}

export function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  for (let index = 0; index < mesh.count; index++) {
    mesh.setMatrixAt(index, ZERO_MATRIX);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
```

---

# FILE: `frontend\src\components\simulation\simulationConstants.ts`

```typescript
export const THRESH = 0.01;
export const TORSO_WORLD = 1.8;
export const DHUTI_DROP = TORSO_WORLD * 1.25;
export const TORSO_SHOULDER_HALF_WIDTH_RATIO = 0.29;
export const TORSO_HIP_HALF_WIDTH_RATIO = 0.23;
export const DHUTI_HALF_WIDTH_RATIO = 0.24;
export const HEAD_WIDTH_RATIO = 0.34;
export const TORSO_WIDTH_SCALE = 1.1;
```

---

# FILE: `frontend\src\components\simulation\SimulationRoom.tsx`

```tsx
"use client";

import "@/lib/threeSetup";
import { Component, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

export const SIMULATION_FOV = 38;

/**
 * World-space Y of your EXISTING floor / platform top (where the avatar's feet are).
 * If plants or the spotlight still float or sink, nudge this: lower = everything moves down.
 */
export const ROOM_FLOOR_Y = -4.2;

/**
 * Sconce placement. They are NOT attached to any wall I draw: put them on your original wall.
 *  - SCONCE_RADIUS: distance from the room centre to your original wall (smaller = closer to camera)
 *  - SCONCE_ANGLE:  how far left/right of centre (radians)
 *  - SCONCE_Y:      height above the floor
 */
const SCONCE_RADIUS = 7.65;
const SCONCE_ANGLE = 0.72;
const SCONCE_Y = 6.05;

/** Spotlight: height of the lamp above the floor, and cone radius where it meets the floor. */
const SPOT_HEIGHT = 8.0;
const SPOT_FLOOR_RADIUS = 3.2;

/** Plant size multiplier. */
const PLANT_SCALE = 1.7;

const WARM = "#ffcf94";
const GOLD = "#b8892f";

/* ---------- helpers ---------- */

function useGlowTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** A curved, tapered leaf blade with a centre fold and a dark-base to light-tip gradient. */
function makeLeafGeometry(length: number, width: number, bend: number) {
  const g = new THREE.PlaneGeometry(1, 1, 6, 18);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const R = length / bend;
  const base = new THREE.Color("#1f7a33");
  const tip = new THREE.Color("#6fcf5f");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i);
    const t = Math.min(Math.max(pos.getY(i) + 0.5, 0), 1);
    const profile = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 0.85);
    const x = u * 2 * width * profile;
    const a = t * bend;
    const y = R * Math.sin(a);
    // tip arcs away (-z) so the +z face is the lit top side; edges lift for a V-shaped fold
    const z = -R * (1 - Math.cos(a)) + Math.abs(x) * 0.35;
    pos.setXYZ(i, x, y, z);
    c.copy(base).lerp(tip, t);
    // slightly lighter midrib
    c.offsetHSL(0, 0, Math.max(0, 0.05 - Math.abs(u) * 0.2));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/* ---------- room pieces ---------- */

function Sconce({ side }: { side: -1 | 1 }) {
  const y = ROOM_FLOOR_Y + SCONCE_Y;
  const th = Math.PI + side * SCONCE_ANGLE;
  const x = Math.sin(th) * SCONCE_RADIUS;
  const z = Math.cos(th) * SCONCE_RADIUS;
  const glow = useGlowTexture();
  return (
    <group position={[x, y, z]} rotation={[0, th, 0]}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.5, 24]} />
        <meshStandardMaterial color="#1c2230" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* warm light slits top and bottom */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={WARM} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={WARM} toneMapped={false} />
      </mesh>
      {/* very subtle glow */}
      {glow && (
        <>
          <sprite position={[0, 0.7, 0.1]} scale={[1.0, 1.6, 1]}>
            <spriteMaterial map={glow} color={WARM} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <sprite position={[0, -0.7, 0.1]} scale={[1.0, 1.6, 1]}>
            <spriteMaterial map={glow} color={WARM} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        </>
      )}
      <pointLight position={[0, 0.4, 0.5]} color={WARM} intensity={1.2} distance={4} decay={2} />
      <pointLight position={[0, -0.4, 0.5]} color={WARM} intensity={0.6} distance={3} decay={2} />
    </group>
  );
}

function Plant({ position, seed = 0 }: { position: [number, number, number]; seed?: number }) {
  const y = ROOM_FLOOR_Y;

  // Smooth egg-shaped ceramic tub (spline profile), with a short hidden skirt under the floor line.
  const potGeo = useMemo(() => {
    // taller, slightly tapered egg: height 1.0, widest ~0.4 radius
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.25, 0.0),
      new THREE.Vector2(0.31, 0.1),
      new THREE.Vector2(0.37, 0.35),
      new THREE.Vector2(0.4, 0.6),
      new THREE.Vector2(0.38, 0.85),
      new THREE.Vector2(0.34, 1.0),
    ]);
    const profile = curve.getPoints(40);
    // hidden skirt below the floor line so the tub always reaches the ground
    profile.unshift(new THREE.Vector2(0.25, -0.4), new THREE.Vector2(0.0, -0.4));
    // inner lip + soil level
    profile.push(new THREE.Vector2(0.31, 1.0), new THREE.Vector2(0.3, 0.94), new THREE.Vector2(0.0, 0.94));
    const geo = new THREE.LatheGeometry(profile, 64);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const leafSet = useMemo(() => {
    const rand = (n: number) => {
      const s = Math.sin((n + seed) * 127.1) * 43758.5453;
      return s - Math.floor(s);
    };
    const n = 13;
    return Array.from({ length: n }, (_, i) => {
      const length = 0.95 + rand(i + 40) * 0.5;
      return {
        yaw: (i / n) * Math.PI * 2 + rand(i) * 0.5,
        tilt: 0.12 + rand(i + 20) * 0.6,
        geo: makeLeafGeometry(length, 0.2 + rand(i + 60) * 0.06, 0.8 + rand(i + 80) * 0.7),
      };
    });
  }, [seed]);

  return (
    <group position={[position[0], y, position[2]]} scale={PLANT_SCALE}>
      <mesh geometry={potGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f1eee7" roughness={0.42} metalness={0} clearcoat={0.35} clearcoatRoughness={0.5} />
      </mesh>
      {/* gold base band */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.255, 0.27, 0.07, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.35} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.945, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.31, 48]} />
        <meshStandardMaterial color="#2a1f18" roughness={1} />
      </mesh>

      {/* leaves */}
      <group position={[0, 0.94, 0]}>
        {leafSet.map((l, i) => (
          <group key={i} rotation={[0, l.yaw, 0]}>
            <group rotation={[-l.tilt, 0, 0]}>
              <mesh geometry={l.geo} castShadow>
                <meshStandardMaterial
                  vertexColors
                  side={THREE.DoubleSide}
                  roughness={0.5}
                  metalness={0}
                  emissive="#1d6a2c"
                  emissiveIntensity={0.55}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Soft light beam: fades toward its edges and toward the floor, so it has no hard outline. */
function SpotBeam({ top, bottom, topRadius, bottomRadius }: { top: number; bottom: number; topRadius: number; bottomRadius: number }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#cfdcff") }, uStrength: { value: 0.4 } }),
    []
  );
  const height = top - bottom;
  return (
    <mesh position={[0, bottom + height / 2, 0]} renderOrder={1}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 64, 1, true]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        vertexShader={`
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vV = normalize(-mv.xyz);
            vH = uv.y; // 1 at the lamp, 0 at the floor
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            float facing = abs(dot(normalize(vN), normalize(vV)));
            float edge = pow(facing, 1.5);                 // soft sides
            float down = smoothstep(0.0, 0.3, vH);         // fades out just above the floor
            float up = 0.5 + 0.5 * smoothstep(0.3, 1.0, vH); // brighter near the lamp
            float a = edge * down * up * uStrength;
            gl_FragColor = vec4(uColor * a, a);
          }
        `}
      />
    </mesh>
  );
}

/** Spotlight above the avatar. */
function Spotlight() {
  const y = ROOM_FLOOR_Y;
  const top = y + SPOT_HEIGHT;
  return (
    <group>
      <spotLight
        position={[0, top, 1.2]}
        angle={0.4}
        penumbra={1}
        intensity={90}
        distance={16}
        decay={1.6}
        color="#dfe8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />
      <SpotBeam top={top} bottom={y - 0.2} topRadius={0.3} bottomRadius={SPOT_FLOOR_RADIUS} />
    </group>
  );
}

function Room() {
  return (
    <group>
      <Spotlight />
      <Sconce side={-1} />
      <Sconce side={1} />
      <Plant position={[-4.3, 0, -2.8]} seed={1} />
      <Plant position={[4.3, 0, -2.8]} seed={7} />
    </group>
  );
}

/* ---------- canvas wrapper ---------- */

interface SimulationRoomProps {
  children: ReactNode;
  onFail: () => void;
}

class RoomErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SimulationRoom({ children, onFail }: SimulationRoomProps) {
  return (
    <div className="absolute inset-0">
      <RoomErrorBoundary onError={onFail}>
        <Canvas
          dpr={[1, 2]}
          shadows="percentage"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{ fov: SIMULATION_FOV, near: 0.05, far: 200, position: [0, 0, 6] }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
          }}
        >
          <color attach="background" args={["#1b2740"]} />
          <fog attach="fog" args={["#1b2740", 12, 26]} />

          <hemisphereLight args={["#eaf0ff", "#182642", 0.7]} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.2}
            color="#f5f4f1"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.025}
          />
          <directionalLight position={[-4, 3, -4]} intensity={0.6} color="#9cbcff" />
          <directionalLight position={[3, 2, -2]} intensity={0.26} color="#55DDE0" />

          <Room />
          {children}
        </Canvas>
      </RoomErrorBoundary>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\simulation\TorsoRig.tsx`

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { THRESH, TORSO_WORLD } from "./simulationConstants";

// ============================================================
// DESIGN CONTROLS
// ============================================================

export const DEFAULT_TOP_Y_OFFSET = 0.12;
export const DEFAULT_TOP_WIDTH_SCALE = 0.68;
export const DEFAULT_BOTTOM_WIDTH_SCALE = 0.70;

const RINGS = 32;
const SEGMENTS = 48;
const MAX_TORSO_LEAN = THREE.MathUtils.degToRad(6);
const ABS_BANDS = 4;

// ORIGINAL PALETTE: warm ivory ceramic + charcoal + amber accents
const COLORS = {
  ivory: new THREE.Color("#EDE6DA"),
  ivoryDark: new THREE.Color("#BDB3A2"),
  charcoal: new THREE.Color("#2A2A2E"),
  graphite: new THREE.Color("#45454D"),
  amber: new THREE.Color("#FF9F1C"),
};

const TORSO_INDICES = (() => {
  const indices: number[] = [];

  for (let r = 0; r < RINGS - 1; r++) {
    const r0 = r * SEGMENTS;
    const r1 = (r + 1) * SEGMENTS;

    for (let s = 0; s < SEGMENTS; s++) {
      const next = (s + 1) % SEGMENTS;

      indices.push(r0 + s, r1 + s, r1 + next);
      indices.push(r0 + s, r1 + next, r0 + next);
    }
  }

  const bottomCenter = RINGS * SEGMENTS;
  const bottomRing = (RINGS - 1) * SEGMENTS;

  for (let s = 0; s < SEGMENTS; s++) {
    const next = (s + 1) % SEGMENTS;
    indices.push(bottomCenter, bottomRing + s, bottomRing + next);
  }

  return indices;
})();

interface PlaybackRef {
  current: { playing: boolean };
}

interface TorsoRigProps {
  sampleRef: SampleRef;
  playbackRef: PlaybackRef;
  topYOffset?: number;
  topWidth?: number;
  bottomWidth?: number;
}

export function TorsoRig({
  sampleRef,
  playbackRef,
  topYOffset = DEFAULT_TOP_Y_OFFSET,
  topWidth = DEFAULT_TOP_WIDTH_SCALE,
  bottomWidth = DEFAULT_BOTTOM_WIDTH_SCALE,
}: TorsoRigProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reactorRef = useRef<THREE.Group>(null);
  const idleTime = useRef(0);

  // ============================================================
  // DYNAMIC TORSO GEOMETRY
  // ============================================================

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const vertCount = RINGS * SEGMENTS + 1;

    const positions = new Float32Array(vertCount * 3);
    const colors = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);

    g.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );

    g.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );

    for (let r = 0; r < RINGS; r++) {
      const t = r / (RINGS - 1);

      for (let s = 0; s < SEGMENTS; s++) {
        const idx = (r * SEGMENTS + s) * 2;
        uvs[idx] = s / SEGMENTS;
        uvs[idx + 1] = 1 - t;
      }
    }

    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(TORSO_INDICES);

    return g;
  }, []);

  // ============================================================
  // SOFT CERAMIC / MATTE MATERIAL
  // ============================================================

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.2,
        roughness: 0.55,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // ============================================================
  // CHEST PIECE: vertical light bar in a charcoal housing
  // ============================================================

  const reactor = useMemo(() => {
    const group = new THREE.Group();

    const housingMaterial = new THREE.MeshStandardMaterial({
      color: "#2A2A2E",
      metalness: 0.6,
      roughness: 0.35,
    });

    const barMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD08A",
      emissive: "#FF9F1C",
      emissiveIntensity: 2.6,
      metalness: 0.1,
      roughness: 0.3,
    });

    // Housing plate
    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.12, 0.016),
      housingMaterial,
    );
    group.add(housing);

    // Main light bar
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.088, 0.006),
      barMaterial,
    );
    bar.position.z = 0.011;
    group.add(bar);

    // Three small indicator dots beside the bar
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.0038, 12, 12),
        barMaterial,
      );
      dot.position.set(0.017, 0.03 - i * 0.03, 0.01);
      group.add(dot);
    }

    // Corner rivets
    for (let sx = -1; sx <= 1; sx += 2) {
      for (let sy = -1; sy <= 1; sy += 2) {
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(0.0025, 8, 8),
          housingMaterial,
        );
        rivet.position.set(sx * 0.021, sy * 0.053, 0.009);
        group.add(rivet);
      }
    }

    return group;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      reactor.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();

          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, [geometry, material, reactor]);

  // ============================================================
  // ANIMATION AND PROCEDURAL SCULPTING
  // ============================================================

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const reactorGroup = reactorRef.current;

    if (!mesh || !reactorGroup) return;

    if (!playbackRef.current.playing) {
      idleTime.current += Math.min(delta, 0.1);
    }

    const P = sampleRef.current.pose;

    const ok =
      P[0 * 4 + 3] >= THRESH &&
      P[1 * 4 + 3] >= THRESH &&
      P[6 * 4 + 3] >= THRESH &&
      P[7 * 4 + 3] >= THRESH;

    mesh.visible = ok;
    reactorGroup.visible = ok;

    if (!ok) return;

    // LANDMARKS

    const shoulderL = new THREE.Vector3(P[0], P[1], P[2]);
    const shoulderR = new THREE.Vector3(P[4], P[5], P[6]);

    const shoulderCenter = new THREE.Vector3(
      (P[0] + P[4]) / 2,
      (P[1] + P[5]) / 2,
      (P[2] + P[6]) / 2,
    );

    const hipL = new THREE.Vector3(P[24], P[25] - 0.18, P[26]);
    const hipR = new THREE.Vector3(P[28], P[29] - 0.18, P[30]);

    const hipCenter = new THREE.Vector3()
      .addVectors(hipL, hipR)
      .multiplyScalar(0.5);

    const torsoAxis = new THREE.Vector3().subVectors(shoulderCenter, hipCenter);
    const horizontalLength = Math.hypot(torsoAxis.x, torsoAxis.z);
    const maxHorizontalOffset = Math.abs(torsoAxis.y) * Math.tan(MAX_TORSO_LEAN);
    if (horizontalLength > maxHorizontalOffset && horizontalLength > 0) {
      const correction = maxHorizontalOffset / horizontalLength;
      shoulderCenter.x = hipCenter.x + torsoAxis.x * correction;
      shoulderCenter.z = hipCenter.z + torsoAxis.z * correction;
    }

    // ANATOMICAL AXES

    const up = new THREE.Vector3()
      .subVectors(shoulderCenter, hipCenter)
      .normalize();

    let right = new THREE.Vector3().subVectors(shoulderR, shoulderL);

    right.addScaledVector(up, -right.dot(up)).normalize();

    if (right.lengthSq() < 0.001) {
      right.set(1, 0, 0);
    }

    const forward = new THREE.Vector3().crossVectors(right, up).normalize();

    if (forward.z < 0) {
      forward.negate();
      right.negate();
    }

    const refScale = TORSO_WORLD * 0.22;

    const breathing = playbackRef.current.playing
      ? 1
      : 1 + Math.sin(idleTime.current * 1.35) * 0.003;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const vertexColors = geometry.getAttribute("color") as THREE.BufferAttribute;

    // ============================================================
    // VERTEX GENERATION
    // ============================================================

    for (let ring = 0; ring < RINGS; ring++) {
      const t = ring / (RINGS - 1);

      const center = new THREE.Vector3().lerpVectors(
        shoulderCenter,
        hipCenter,
        t,
      );

      let widthRatio = 1;
      let depthRatio = 1;

      if (t < 0.2) {
        const st = t / 0.2;
        widthRatio = THREE.MathUtils.lerp(topWidth, topWidth * 1.25, st);
        depthRatio = THREE.MathUtils.lerp(0.42, 0.52, st);
      } else if (t < 0.7) {
        const mt = (t - 0.2) / 0.5;
        const peak = bottomWidth * 1.52;
        widthRatio = THREE.MathUtils.lerp(topWidth * 1.25, peak, mt);
        depthRatio = THREE.MathUtils.lerp(0.52, 0.68, mt);
      } else {
        const wt = (t - 0.7) / 0.3;
        const peak = bottomWidth * 1.52;
        widthRatio = THREE.MathUtils.lerp(peak, bottomWidth, wt);
        depthRatio = THREE.MathUtils.lerp(0.68, 0.46, wt);
      }

      const halfW = refScale * widthRatio * breathing;
      const baseDepth = Math.max(halfW * depthRatio, 0.07);

      for (let s = 0; s < SEGMENTS; s++) {
        const angle = (s / SEGMENTS) * Math.PI * 2;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let yLift = 0;

        if (t < 0.25) {
          const fade = 1 - t / 0.25;
          const arch = Math.pow(Math.abs(cos), 1.2);

          yLift = (topYOffset + arch * 0.03) * fade;

          if (sin > 0 && Math.abs(cos) < 0.35) {
            yLift -= 0.02 * (1 - Math.abs(cos) / 0.35) * fade;
          }
        }

        let depth = baseDepth;
        let effectiveWidth = halfW;

        // --------------------------------------------------------
        // CHEST: broad, flat breastplate with a shallow center ridge
        // --------------------------------------------------------

        if (t >= 0.14 && t <= 0.42 && sin > 0.05) {
          const chestT = Math.sin(((t - 0.14) / 0.28) * Math.PI);

          const plate = 0.014 * chestT * sin;
          const ridge =
            Math.abs(cos) < 0.1
              ? 0.006 * (1 - Math.abs(cos) / 0.1) * chestT
              : 0;

          depth += plate + ridge;
        }

        // --------------------------------------------------------
        // ABDOMEN: four rounded bands separated by recessed grooves
        // --------------------------------------------------------

        if (t > 0.42 && t <= 0.82) {
          const progress = (t - 0.42) / 0.4;
          const phase = (progress * ABS_BANDS) % 1;

          const band = Math.sin(phase * Math.PI) * 0.01;
          const groove = phase < 0.1 ? -0.008 : 0;

          depth += (band + groove) * Math.max(0.2, sin);
        }

        // --------------------------------------------------------
        // 3D POSITION
        // --------------------------------------------------------

        const vert = new THREE.Vector3()
          .copy(center)
          .addScaledVector(right, cos * effectiveWidth)
          .addScaledVector(forward, sin * depth)
          .addScaledVector(up, yLift);

        const index = ring * SEGMENTS + s;

        pos.setXYZ(index, vert.x, vert.y, vert.z);

        // --------------------------------------------------------
        // COLOUR DESIGN
        // --------------------------------------------------------

        const colour = COLORS.ivory.clone();

        // Graphite shoulder caps
        if (t < 0.12) {
          colour.copy(COLORS.graphite);
        }

        // Amber collar line
        if (t < 0.03) {
          colour.copy(COLORS.amber);
        }

        // Charcoal side panels
        if (Math.abs(cos) > 0.88 && t < 0.78) {
          colour.copy(COLORS.charcoal);
        }

        // Thin amber seam where side panels meet the front
        if (Math.abs(cos) > 0.84 && Math.abs(cos) <= 0.88 && t > 0.14 && t < 0.78) {
          colour.copy(COLORS.amber);
        }

        // Dark grooves between abdominal bands
        if (t > 0.42 && t <= 0.82) {
          const phase = (((t - 0.42) / 0.4) * ABS_BANDS) % 1;

          if (phase < 0.1 && Math.abs(cos) <= 0.84) {
            colour.copy(COLORS.charcoal);
          }
        }

        // Worn lower edge
        if (t > 0.94) {
          colour.copy(COLORS.ivoryDark);
        }

        // Subtle shading across the curved surface
        const shade = 0.96 + Math.max(0, sin) * 0.06;
        colour.multiplyScalar(shade);

        vertexColors.setXYZ(index, colour.r, colour.g, colour.b);
      }
    }

    // Bottom cap
    const bottomCap = RINGS * SEGMENTS;

    pos.setXYZ(bottomCap, hipCenter.x, hipCenter.y, hipCenter.z);

    vertexColors.setXYZ(
      bottomCap,
      COLORS.charcoal.r,
      COLORS.charcoal.g,
      COLORS.charcoal.b,
    );

    pos.needsUpdate = true;
    vertexColors.needsUpdate = true;

    geometry.computeVertexNormals();

    // ============================================================
    // CHEST PIECE POSITION AND ORIENTATION
    // ============================================================

    const reactorPosition = new THREE.Vector3().lerpVectors(
      shoulderCenter,
      hipCenter,
      0.255,
    );

    const reactorWidth = refScale * topWidth * 1.25;

    reactorPosition.addScaledVector(forward, reactorWidth * 0.52);
    reactorPosition.addScaledVector(up, -0.005);

    reactorGroup.position.copy(reactorPosition);

    // Align the housing's long axis with the torso's up direction
    const basis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3().crossVectors(up, forward).normalize(),
      up,
      forward,
    );
    reactorGroup.quaternion.setFromRotationMatrix(basis);

    reactorGroup.scale.setScalar(TORSO_WORLD * 0.38);
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        frustumCulled={false}
        renderOrder={-1}
        castShadow
        receiveShadow
      />

      <primitive ref={reactorRef} object={reactor} />
    </group>
  );
}
```

---

# FILE: `frontend\src\components\skeletons.tsx`

```tsx
import React from "react";

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-3 rounded bg-surface-elevated" />
        </td>
      ))}
    </tr>
  );
}

export function SignCardSkeleton() {
  return (
    <div className="bg-surface border border-border p-4 rounded-md space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-4 w-20 rounded bg-surface-elevated" />
        <div className="h-3 w-10 rounded bg-surface-elevated" />
      </div>
      <div className="h-4 w-24 rounded bg-surface-elevated" />
      <div className="pt-2 border-t border-border flex justify-between">
        <div className="h-3 w-16 rounded bg-surface-elevated" />
        <div className="h-3 w-10 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\hooks\useCamera.ts`

```typescript
"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser.");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsReady(true);
    } catch (err: any) {
      setIsReady(false);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera Unavailable. WBSL Bridge could not access your camera. Check browser permissions and try again.");
      } else {
        setError(err.message || "Failed to access webcam device.");
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    videoRef,
    isReady,
    error,
    startCamera,
    stopCamera,
  };
}
```

---

# FILE: `frontend\src\hooks\useSystemStatus.ts`

```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { SystemHealth } from "@/lib/types";

export function useSystemStatus() {
  const { data, isError, isLoading } = useQuery<SystemHealth>({
    queryKey: ["system-health"],
    queryFn: async () => {
      try {
        const res = await apiClient.get<SystemHealth>("/system/health");
        return res.data;
      } catch {
        // A backend that cannot be reached is OFFLINE. Reporting green here
        // made the navbar diagnostics lie exactly when they mattered most.
        return {
          api: false,
          model: false,
          tts: false,
          llm: false,
          inference_mode: "local",
          dataset_version: "unknown",
          model_version: "unreachable",
        };
      }
    },
    refetchInterval: 10000, // Poll every 10 seconds per Section 7.5
  });

  return {
    health: data || {
      api: false,
      model: false,
      tts: false,
      llm: false,
      inference_mode: "local",
      dataset_version: "v0.8",
      model_version: "LSTM-v1.4",
    },
    isError,
    isLoading,
  };
}
```

---

# FILE: `frontend\src\lib\constants.ts`

```typescript
export const APP_CONFIG = {
  name: "WBSL BRIDGE",
  fullName: "West Bengal Sign Language Translation & Research System",
  datasetVersion: "v0.8",
  modelVersion: "LSTM-v1.4",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8200/api",
};

export const NAVIGATION_LINKS = [
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  { label: "About", href: "/about" },
];
```

---

# FILE: `frontend\src\lib\pose.ts`

```typescript
export const POSE_POINTS = 8;

export type PosePoint = [number, number, number, number];

export const POSE_BODY_PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [2, 4],
  [1, 3],
  [3, 5],
  [0, 6],
  [1, 7],
  [6, 7],
];

export const POSE_FACE_MARKERS: number[] = [];

export const POSE_FACE_PAIRS: [number, number][] = [];
```

---

# FILE: `frontend\src\lib\threeSetup.ts`

```typescript
import * as THREE from "three";

// Three.js r183+ deprecated THREE.Clock in favor of THREE.Timer, and r184+ deprecated
// PCFSoftShadowMap in favor of PCFShadowMap. While upstream ecosystems like @react-three/fiber
// transition their internal defaults, suppress these specific deprecation warnings
// cleanly using Three.js's built-in console hook and browser console filter.

if (typeof (THREE as any).setConsoleFunction === "function") {
  (THREE as any).setConsoleFunction((type: string, message: string, ...params: any[]) => {
    if (
      typeof message === "string" &&
      (message.includes("Clock: This module has been deprecated") ||
        message.includes("PCFSoftShadowMap has been deprecated"))
    ) {
      return;
    }
    if (type === "warn") {
      console.warn(message, ...params);
    } else if (type === "error") {
      console.error(message, ...params);
    } else {
      console.log(message, ...params);
    }
  });
}

if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const first = typeof args[0] === "string" ? args[0] : "";
    if (
      first.includes("Clock: This module has been deprecated") ||
      first.includes("PCFSoftShadowMap has been deprecated")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}
```

---

# FILE: `frontend\src\lib\types.ts`

```typescript
// --- API Response Types ---
export interface ApiError {
  detail: string;
  code?: string;
}

// --- System Health ---
export type InferenceMode = "local" | "cloud";

export interface SystemHealth {
  api: boolean;
  model: boolean;
  tts: boolean;
  llm: boolean;
  inference_mode: InferenceMode;
  dataset_version: string;
  model_version: string;
}
```

---

# FILE: `frontend\src\lib\utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function truncateText(text: string, maxLen: number = 30): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}
```

---

# FILE: `frontend\src\services\api.ts`

```typescript
import axios from "axios";
import { ApiError } from "@/lib/types";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8200/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      detail:
        error.response?.data?.detail ||
        error.message ||
        "An unexpected error occurred.",
      code: error.response?.data?.code,
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;
```

---

# FILE: `frontend\src\services\auth.ts`

```typescript
"use client";
import apiClient from "./api";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("wbsl_token");
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("wbsl_token", token);
  }
}

export function removeAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wbsl_token");
  }
}

export function attachAuthInterceptor() {
  apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
```

---

# FILE: `frontend\src\services\nlg.ts`

```typescript
import apiClient from "./api";

export interface NLGResponse {
  bengali_text: string | null;
  status: string;
  engine: string;
  tokens_used: number;
  error?: string;
  has_uncertainty?: boolean;
  gloss_used?: string;
}

export const nlgService = {
  getStatus: async (): Promise<{ llm_available: boolean; engine: string }> => {
    const res = await apiClient.get("/nlg/status");
    return res.data;
  },

  generate: async (gloss: string): Promise<NLGResponse> => {
    const res = await apiClient.post<NLGResponse>("/nlg/generate", { gloss });
    return res.data;
  },

  generateSequence: async (
    sequence: {
      gloss: string;
      confidence: number;
      unknown?: boolean;
      candidates?: { meaning: string; confidence: number }[];
    }[]
  ): Promise<NLGResponse> => {
    const res = await apiClient.post<NLGResponse>("/nlg/generate-sequence", { sequence });
    return res.data;
  },
};
```

---

# FILE: `frontend\src\services\stats.ts`

```typescript
import apiClient from "./api";

export interface AdminStats {
  total_signs: number;
  avatar_classes: number;
  model_active: string | null;
  model_classes: number;
  contract?: {
    kind?: string;
    feature_width?: number;
    frames?: number;
  };
  llm_available: boolean;
  llm_model: string;
  inference_mode: string;
  ai_mode: string;
  dataset_version: string;
}

export const statsService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>("/admin/stats");
    return res.data;
  },
};
```

---

# FILE: `frontend\tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: {
          DEFAULT: "#141416",
          elevated: "#1C1C1F",
        },
        border: "rgba(255, 255, 255, 0.08)",
        text: {
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#52525B",
        },
        accent: {
          primary: "#22C55E", // Electric green
          secondary: "#6366F1", // Cool violet/blue
        },
        status: {
          approved: "#22C55E",
          pending: "#F59E0B",
          error: "#EF4444",
          unknown: "#A855F7",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        bengali: ["var(--font-noto-bengali)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

# FILE: `model_training_zone\avatar_extract.py`

```python
#!/usr/bin/env python3
"""
avatar_extract.py - per-gloss avatar capture for the ISL avatar player.

    py avatar_extract.py [--model-id ID] [--no-cache]

Runs AFTER train.py. Writes into the NEWEST deployed model folder (the one
train.py created, i.e. the newest folder under models/onnx_models/ that holds
sign_daily_lstm.onnx), so one folder contains the model AND the avatar data:

    models/onnx_models/<id>/avatar/<GLOSS>/
        pose.npy     (F, 8, 4)   shoulders, elbows, wrists, hips: x, y, z, vis
        hands.npy    (F, 42, 3)  left 21 + right 21 points
        face.npy     (F, 19, 3)  outline 4, brows 6, eyes 4, nose 1, lips 4 (float16)
        t.npy        (F,)        time in seconds of each kept frame
        meta.json    source video, frame rate, span + selection info

Selection (per the training method doc):
  * one video per gloss - the kept video with the HIGHEST share of complete
    frames inside its sign span (ties go to the first in sorted path order)
  * every COMPLETE frame of that span is kept with its timestamp - no resampling
  * the share/span are read from the extract_report.json of the features run
    that trained this model, so avatar data matches the trained model exactly

Raw landmarks come from extract.py's cache via load_or_detect(), so videos are
never detected twice. A hand that is not in use (and therefore not detected)
inside a kept frame is filled from its nearest detected frame of the span; the
number of filled frames is recorded in meta.json.
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np

import extract as EX

MODELS_ROOT = EX.TRAIN_ZONE.parent / "models" / "onnx_models"

FACE_OUT = EX.AVATAR_FACE            # 19 indices, in avatar order
POSE_OUT = EX.POSE_IDX               # 11,12,13,14,15,16,23,24


# --------------------------------------------------------------------------- #
# locate the model folder + its training run
# --------------------------------------------------------------------------- #
def find_model_dir(model_id: str | None) -> Path:
    if not MODELS_ROOT.is_dir():
        sys.exit(f"ERROR: no model folder at {MODELS_ROOT} - run  py train.py  first.")
    if model_id:
        d = MODELS_ROOT / model_id
        if not d.is_dir():
            sys.exit(f"ERROR: model id {model_id} not found in {MODELS_ROOT}")
        return d
    deployed = [p for p in MODELS_ROOT.iterdir()
                if p.is_dir() and not p.name.startswith(".")
                and (p / "sign_daily_lstm.onnx").exists()]
    if not deployed:
        sys.exit(f"ERROR: no deployed model in {MODELS_ROOT} - run  py train.py  first.")
    return max(deployed, key=lambda p: p.stat().st_mtime_ns)


def run_paths(model_dir: Path):
    report_file = model_dir / "daily_report.json"
    if not report_file.exists():
        sys.exit(f"ERROR: {report_file} missing - model folder is incomplete.")
    report = json.loads(report_file.read_text(encoding="utf-8"))
    fid = str(report.get("features_id", ""))
    fdir = EX.FEATURES_ROOT / fid
    ext = fdir / "extract_report.json"
    if not ext.exists():
        sys.exit(f"ERROR: extract report of features id {fid} not found: {ext}")
    cls_file = model_dir / "sign_daily_classes.json"
    classes = (json.loads(cls_file.read_text(encoding="utf-8")) if cls_file.exists()
               else report.get("classes") or [p.stem for p in sorted(fdir.glob("*.npy"))])
    return classes, json.loads(ext.read_text(encoding="utf-8")), fid


# --------------------------------------------------------------------------- #
# selection: highest complete-frame share in the span, ties -> first sorted
# --------------------------------------------------------------------------- #
def select_video(ext_report: dict, gloss: str):
    cands = [v for v in ext_report.get("videos", [])
             if v.get("gloss") == gloss and v.get("status") == "kept"
             and "complete_share" in v and "span" in v]
    best = None
    for v in sorted(cands, key=lambda v: v["path"].casefold()):
        if best is None or v["complete_share"] > best["complete_share"]:
            best = v
    return best


# --------------------------------------------------------------------------- #
# build one gloss's avatar arrays from cached landmarks
# --------------------------------------------------------------------------- #
def _fill_hand(seq: np.ndarray):
    """NaN frames (hand down / undetected) <- nearest detected frame in time."""
    det = np.isfinite(seq[:, 0, 0])
    if det.all():
        return seq, 0
    if not det.any():
        return np.zeros_like(seq), len(seq)
    di = np.flatnonzero(det)
    out = seq.copy()
    filled = 0
    for i in np.flatnonzero(~det):
        out[i] = seq[di[np.argmin(np.abs(di - i))]]
        filled += 1
    return out, filled


def build_avatar(video: Path, span, use_cache: bool):
    raw, hit = EX.load_or_detect(str(video), use_cache)
    pose, hands, face = raw["pose"], raw["hands"], raw["face"]
    W, H, T = int(raw["W"]), int(raw["H"]), len(pose)
    start, end = int(span[0]), int(span[1])
    end = min(end, T - 1)

    in_use = np.stack([EX.frame_in_use(pose[t], W, H) for t in range(T)])
    complete = EX.complete_mask(raw, in_use)
    sel = np.flatnonzero(complete[start:end + 1]) + start
    if sel.size == 0:
        return None, hit

    hl, fl = _fill_hand(hands[sel, 0])
    hr, fr = _fill_hand(hands[sel, 1])
    hands42 = np.concatenate([hl, hr], axis=1).astype(np.float32)   # (F, 42, 3)

    return dict(
        pose=pose[sel].astype(np.float32),                          # (F, 8, 4)
        hands=hands42,
        face=np.ascontiguousarray(face[sel, :len(FACE_OUT), :],
                                  dtype=np.float16),                # (F, 19, 3)
        t=raw["t"][sel].astype(np.float32),                         # (F,)
        filled=(int(fl), int(fr)),
        frames=int(sel.size),
        fps=float(raw["fps"]),
        W=W, H=H,
        span=[start, end],
        span_frames=end - start + 1,
    ), hit


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Capture per-gloss avatar data.")
    ap.add_argument("--model-id", default=None, help="model folder name (default: newest)")
    ap.add_argument("--no-cache", action="store_true", help="ignore the landmark cache")
    args = ap.parse_args()

    model_dir = find_model_dir(args.model_id)
    classes, ext_report, fid = run_paths(model_dir)
    avatar_root = model_dir / "avatar"
    avatar_root.mkdir(parents=True, exist_ok=True)

    print(f"Model    : {model_dir.name}")
    print(f"Features : {fid}")
    print(f"Classes  : {len(classes)}")
    print(f"Avatar   : {avatar_root}\n")

    done = skipped = 0
    t0 = time.time()
    for gloss in classes:
        pick = select_video(ext_report, gloss)
        if pick is None:
            print(f"  {gloss:<24} SKIPPED (no kept video with span info)")
            skipped += 1
            continue
        video = EX.DATASET_DIR / pick["path"]
        if not video.exists():
            print(f"  {gloss:<24} SKIPPED (video missing: {pick['path']})")
            skipped += 1
            continue

        data, hit = build_avatar(video, pick["span"], not args.no_cache)
        if data is None:
            print(f"  {gloss:<24} SKIPPED (no complete frame in span)")
            skipped += 1
            continue

        out = avatar_root / gloss
        if out.exists():
            shutil.rmtree(out)
        out.mkdir(parents=True)
        np.save(out / "pose.npy", data["pose"])
        np.save(out / "hands.npy", data["hands"])
        np.save(out / "face.npy", data["face"])
        np.save(out / "t.npy", data["t"])
        meta = dict(
            gloss=gloss,
            source_video=pick["path"],
            source_video_abs=str(video),
            frame_rate=data["fps"],
            width=data["W"], height=data["H"],
            span=data["span"], span_frames=data["span_frames"],
            complete_frames=data["frames"],
            complete_share=pick["complete_share"],
            hand_filled_frames=list(data["filled"]),
            pose_indices=POSE_OUT,
            face_indices=FACE_OUT,
            hands_layout="left 21 + right 21",
            features_id=fid,
            model_id=model_dir.name,
            landmark_cache="hit" if hit else "miss",
            created=datetime.now().isoformat(timespec="seconds"),
        )
        (out / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
        print(f"  {gloss:<24} {Path(pick['path']).name}  "
              f"share {pick['complete_share']:.2f}  frames {data['frames']}  "
              f"({data['fps']:.1f} fps)")
        done += 1

    print(f"\nAvatar capture complete | {done} glosses written, {skipped} skipped | "
          f"{time.time() - t0:.1f}s")
    print(f"Next:  py test_model.py")


if __name__ == "__main__":
    main()
```

---

# FILE: `model_training_zone\extract.py`

```python
#!/usr/bin/env python3
"""
extract.py - ISL sign recognition: video -> (64, 98) feature sequences.

    py extract.py [--workers N] [--no-cache] [--width PX]

Reads every video in every gloss folder under ISL_VIDEO/, finds the sign span
(IDLE -> SIGN -> end state machine), selects 64 frames, computes 98 features per
frame and writes one  <GLOSS>.npy  (N, 64, 98)  per gloss into a NEW numeric id:

    model_training_zone/dataset_train/features/<id>/
        <GLOSS>.npy
        extract_report.json

Landmark cache (model_training_zone/dataset_train/cache/*.npz) holds the raw
per-frame landmarks (21-pt hands, 8 pose points, 21 face points, timestamps),
keyed by (path, size, mtime, cache-version). avatar_extract.py can reuse it via
load_or_detect() so videos are never detected twice. Feature building always
re-runs, so every id is a complete, independent extraction.

Performance / clean-console design:
  * MediaPipe + TFLite + absl + protobuf logging is silenced via env flags set
    BEFORE mediapipe is imported, and pool workers redirect fd 1/2 to devnull,
    so the progress line is the only terminal output (parent keeps console).
  * Each worker process creates Holistic/Hands ONCE (process initializer) and
    resets tracking between videos - no per-video model reload.
  * Workers default to min(16, cpu_count); override with --workers N or
    EXTRACT_WORKERS=N. Tune N until CPU sits near 90-100 %.
  * ETA uses a sliding window over the last finished videos (stable estimate).

Conventions (reuse the SAME helpers in test_model.py):
  * Frames are NOT mirrored. index 0 = person's left hand (Holistic left_hand,
    pose 15), index 1 = right hand.
  * Shoulder box: origin = shoulder midpoint; x-axis = pose-12 -> pose-11
    shoulder (image-right when the signer faces the camera); y-axis = up in the
    image; unit = shoulder width; z = -MediaPipe z (towards camera positive).
  * Rest line = hip line (both hips visible) else shoulder-mid + 1.3 x width.
    A hand is "in use" when its POSE wrist is above the rest line by more than
    0.05 shoulder widths.
"""
from __future__ import annotations

# --- silence C++/TF/absl logging BEFORE anything loads MediaPipe ------------ #
import os
os.environ.setdefault("GLOG_minloglevel", "2")        # glog: errors only
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")    # TF/TFLite: no INFO spam
os.environ.setdefault("MEDIAPIPE_DISABLE_LOGGING", "1")

import warnings
warnings.filterwarnings("ignore", category=UserWarning)          # protobuf SymbolDatabase
warnings.filterwarnings("ignore", category=DeprecationWarning)

import argparse
import atexit
import hashlib
import json
import math
import re
import sys
import time
import traceback
from collections import Counter, defaultdict, deque
from concurrent.futures import ProcessPoolExecutor, as_completed
from concurrent.futures.process import BrokenProcessPool
from datetime import datetime
from pathlib import Path

import numpy as np

# --------------------------------------------------------------------------- #
# Paths
# --------------------------------------------------------------------------- #
BASE_DIR = Path(__file__).resolve().parent


def _find_dataset_dir() -> Path:
    """Locate ISL_VIDEO whether this script sits in the project root or inside
    model_training_zone (searches this folder and every parent)."""
    tail = Path("dataset") / "Indian Sign Language_Dataset" / "ISL_VIDEO"
    for anchor in (BASE_DIR, *BASE_DIR.parents):
        for cand in (anchor / "model_training_zone" / tail, anchor / tail,
                     anchor / "Indian Sign Language_Dataset" / "ISL_VIDEO"):
            if cand.is_dir():
                return cand.resolve()
    return BASE_DIR / "model_training_zone" / tail  # default; discover() reports it missing


def _find_train_zone(dataset_dir: Path) -> Path:
    for p in (dataset_dir, *dataset_dir.parents):
        if p.name.lower() == "model_training_zone":
            return p
    return dataset_dir.parents[2] if len(dataset_dir.parents) > 2 else BASE_DIR


DATASET_DIR = _find_dataset_dir()
TRAIN_ZONE = _find_train_zone(DATASET_DIR)
FEATURES_ROOT = TRAIN_ZONE / "dataset_train" / "features"
CACHE_DIR = TRAIN_ZONE / "dataset_train" / "cache"

VIDEO_EXTS = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v", ".mpg", ".mpeg", ".wmv"}

# --------------------------------------------------------------------------- #
# Parameters
# --------------------------------------------------------------------------- #
N_FRAMES = 64
N_FEATURES = 98
MAX_GAP = 5                 # reject if a position needs a frame > 5 frames later
VIS_MIN = 0.5               # shoulder / elbow / hip visibility
HAND_MARGIN_SW = 0.05       # wrist above rest line by > 0.05 shoulder widths
REST_SHOULDER_FACTOR = 1.3  # fallback rest line = shoulder-mid + 1.3 * width

TRIGGER_FRAMES = 3          # raised frames needed to start a sign
PRE_ROLL = 8                # frames kept before the first raised frame
END_FRAMES = 10             # hands-down frames needed to end a sign
KEEP_TAIL = 2               # hands-down frames kept after the last raised one

MAX_FRAME_WIDTH = 960       # wider frames are downscaled before detection (speed)
RESCUE_MAX_DIST = 0.30      # max normalised dist: 2nd-detector hand <-> pose wrist
DEFAULT_FPS = 30.0
DEFAULT_MAX_WORKERS = max(2, min(16, os.cpu_count() or 4))   # saturate the CPU;
                            # override with --workers N or env EXTRACT_WORKERS=N
MULTI_SPAN = "longest"      # video with several spans: "longest" = use the longest,
                            # "reject" = reject it (MULTIPLE_SIGN_SPANS)
REQUIRE_CLOSED_SPAN = False # True = reject videos that end while the hands are still up
                            # (default keeps them; they are flagged span_closed=false)
CACHE_VERSION_TEMPLATE = "v2-holistic-c1-w{w}-full21"   # width is part of the key


def cache_version() -> str:
    return CACHE_VERSION_TEMPLATE.format(w=MAX_FRAME_WIDTH)


# MediaPipe indices
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]      # 11 training points / hand
POSE_IDX = [11, 12, 13, 14, 15, 16, 23, 24]            # stored pose subset
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9       # positions inside HAND_IDX
AVATAR_FACE = [10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
               159, 145, 386, 374, 1, 61, 291, 0, 17]
FACE_CACHE_IDX = AVATAR_FACE + [13, 14]                # + mouth pair for training
FI = {idx: k for k, idx in enumerate(FACE_CACHE_IDX)}  # mesh index -> cache column

LAYOUT = [
    ("handshape", 66),        # 2 hands x 11 pts x (x,y,z)
    ("palm_dir_normal", 12),  # 2 hands x (dir xyz, normal xyz)
    ("wrist_pos", 4),         # Lx, Ly, Rx, Ry
    ("elbows", 4),            # Lx, Ly, Rx, Ry
    ("wrist_face_dist", 6),   # L: forehead, mouth, chin | R: forehead, mouth, chin
    ("head", 3),              # mouth x, mouth y, forehead-chin angle from vertical (rad)
    ("hand_flags", 2),        # L, R
    ("duration", 1),          # seconds of the span
]
assert sum(n for _, n in LAYOUT) == N_FEATURES


def layout_offsets() -> dict:
    out, o = {}, 0
    for name, n in LAYOUT:
        out[name] = [o, o + n]
        o += n
    return out


REASON_TEXT = {
    "CANNOT_OPEN": "video could not be opened",
    "NO_FRAMES": "no frames could be read",
    "NO_SPAN": "no sign span found (hands never raised long enough)",
    "NO_COMPLETE_FRAME": "no complete frame exists for a target position",
    "GAP_TOO_LARGE": f"a target position needed a frame > {MAX_GAP} frames later",
    "MULTIPLE_SIGN_SPANS": "more than one sign span found (MULTI_SPAN = 'reject')",
    "SIGN_NOT_CLOSED": "video ended before the hands went down (REQUIRE_CLOSED_SPAN)",
    "NON_FINITE": "feature vector contained NaN/inf",
    "EXCEPTION": "unexpected error while processing",
    "WORKER_CRASH": "worker process died (native crash) on this video",
}


class Reject(Exception):
    def __init__(self, code: str, detail: str = ""):
        super().__init__(code)
        self.code = code
        self.detail = detail


# --------------------------------------------------------------------------- #
# Hand-in-use / rest line
# --------------------------------------------------------------------------- #
def frame_in_use(pose: np.ndarray, W: int, H: int) -> np.ndarray:
    """pose: (8,4) normalised x,y,z,vis -> bool[2] (left, right) hand in use."""
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


# --------------------------------------------------------------------------- #
# Detection (MediaPipe) - detectors live once per process, reset per video
# --------------------------------------------------------------------------- #
_HOLISTIC = None
_HANDS_DET = None


def _make_detectors():
    import mediapipe as mp
    try:
        from absl import logging as _absl
        _absl.set_verbosity(_absl.ERROR)
    except Exception:
        pass
    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=1, smooth_landmarks=True,
        refine_face_landmarks=False, min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    hands = mp.solutions.hands.Hands(
        static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)
    return holistic, hands


def _get_detectors():
    global _HOLISTIC, _HANDS_DET
    if _HOLISTIC is None:
        _HOLISTIC, _HANDS_DET = _make_detectors()
    return _HOLISTIC, _HANDS_DET


def _close_detectors():
    global _HOLISTIC, _HANDS_DET
    for d in (_HOLISTIC, _HANDS_DET):
        try:
            if d is not None:
                d.close()
        except Exception:
            pass
    _HOLISTIC = _HANDS_DET = None


def _worker_init():
    """Process-pool initializer: quiet fds, single-thread OpenCV, one model set."""
    try:
        import cv2
        cv2.setNumThreads(1)
    except Exception:
        pass
    # workers only: send stdout/stderr (C++ log spam) to devnull; the parent
    # process keeps its console for the progress line
    try:
        devnull = os.open(os.devnull, os.O_WRONLY)
        os.dup2(devnull, 1)
        os.dup2(devnull, 2)
        os.close(devnull)
    except Exception:
        pass
    _get_detectors()
    atexit.register(_close_detectors)


def _lm(landmarks, idx_list):
    return np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in idx_list], np.float32)


def detect_video(path: str) -> dict:
    import cv2

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise Reject("CANNOT_OPEN")
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or not math.isfinite(fps) or fps <= 0 or fps > 240:
        fps = DEFAULT_FPS

    holistic, hands_det = _get_detectors()
    for d in (holistic, hands_det):                     # fresh tracking state
        try:                                            # per video (same result
            d.reset()                                   # as a fresh instance)
        except Exception:
            pass

    poses, hands_l, faces, face_ok, rescued = [], [], [], [], []
    W = H = 0
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            fh, fw = frame.shape[:2]
            if fw > MAX_FRAME_WIDTH:
                frame = cv2.resize(frame, (MAX_FRAME_WIDTH, int(round(fh * MAX_FRAME_WIDTH / fw))))
            H, W = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

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

            resc = np.zeros(2, bool)
            in_use = frame_in_use(pose, W, H)
            missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
            if missing:
                r2 = hands_det.process(rgb)
                if r2.multi_hand_landmarks:
                    best = {}
                    for hl in r2.multi_hand_landmarks:
                        pts = _lm(hl.landmark, range(21))
                        dists = []
                        for wi in (P_LWR, P_RWR):  # nearest pose wrist decides the side
                            w = pose[wi, :2]
                            dists.append(float(np.hypot(*(pts[0, :2] - w))) if np.isfinite(w).all() else 9e9)
                        h = int(np.argmin(dists))
                        if h in missing and dists[h] < RESCUE_MAX_DIST and (h not in best or dists[h] < best[h][0]):
                            best[h] = (dists[h], pts)
                    for h, (_, pts) in best.items():
                        hands[h] = pts
                        resc[h] = True

            poses.append(pose)
            hands_l.append(hands)
            faces.append(face)
            face_ok.append(f_ok)
            rescued.append(resc)
    finally:
        cap.release()

    if not poses:
        raise Reject("NO_FRAMES")
    T = len(poses)
    return dict(
        pose=np.stack(poses), hands=np.stack(hands_l), face=np.stack(faces),
        face_ok=np.array(face_ok, bool), rescued=np.stack(rescued),
        t=(np.arange(T) / fps).astype(np.float32),
        fps=np.float32(fps), W=np.int32(W), H=np.int32(H),
    )


def cache_path(video: str, cache_dir: Path = CACHE_DIR) -> Path:
    st = os.stat(video)
    key = f"{cache_version()}|{os.path.abspath(video)}|{st.st_size}|{st.st_mtime_ns}"
    return cache_dir / (hashlib.sha1(key.encode("utf-8")).hexdigest() + ".npz")


def load_or_detect(video: str, use_cache: bool = True, cache_dir: Path = CACHE_DIR):
    """Returns (raw_landmarks_dict, cache_hit). Also used by avatar_extract.py."""
    cp = cache_path(video, cache_dir)
    if use_cache and cp.exists():
        try:
            with np.load(cp, allow_pickle=False) as z:
                return {k: z[k] for k in z.files}, True
        except Exception:
            pass  # corrupt cache -> re-detect
    raw = detect_video(video)
    try:
        cache_dir.mkdir(parents=True, exist_ok=True)
        tmp = cp.with_name(f"{cp.stem}.{os.getpid()}.tmp.npz")
        np.savez(tmp, **raw)
        os.replace(tmp, cp)  # atomic: parallel runs never see half-written files
    except Exception:
        pass  # caching is best-effort
    return raw, False


# --------------------------------------------------------------------------- #
# Sign span state machine (reuse logic in test_model.py)
# --------------------------------------------------------------------------- #
def find_spans(raised: np.ndarray) -> list:
    """raised: bool[T] (any hand in use).
    Returns inclusive (start, end, closed) spans; closed=False means the video
    ended while the sign was still running."""
    n = len(raised)
    spans = []
    sign = False
    up = down = 0
    run_start = start = last_up = 0
    lo = 0  # earliest allowed start (just after the previous span)
    for i in range(n):
        r = bool(raised[i])
        if not sign:  # IDLE
            if r:
                if up == 0:
                    run_start = i
                up += 1
                if up >= TRIGGER_FRAMES:
                    sign = True
                    start = max(lo, run_start - PRE_ROLL)
                    last_up = i
                    down = 0
            else:
                up = 0
        else:  # SIGN
            if r:
                last_up = i
                down = 0
            else:
                down += 1
                if down >= END_FRAMES:
                    end = min(last_up + KEEP_TAIL, n - 1)
                    spans.append((start, end, True))
                    lo = end + 1
                    sign = False
                    up = 0
    if sign:
        spans.append((start, min(last_up + KEEP_TAIL, n - 1), False))
    return spans


# --------------------------------------------------------------------------- #
# Completeness + features
# --------------------------------------------------------------------------- #
def complete_mask(raw: dict, in_use: np.ndarray) -> np.ndarray:
    pose, hands = raw["pose"], raw["hands"]
    W, H = int(raw["W"]), int(raw["H"])
    ok = raw["face_ok"].copy()
    vis = pose[:, :4, 3]  # shoulders + elbows
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
    yax = np.array([xax[1], -xax[0]])  # perpendicular, pointing up in the image

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):  # (n,3) normalised -> (n,3) shoulder box
        d = pts[:, :2].astype(np.float64) * [W, H] - origin
        return np.stack([d @ xax / sw, d @ yax / sw, -pts[:, 2].astype(np.float64) * W / sw], 1)

    forehead = box_xy(face[FI[10], :2])
    mouth = box_xy((face[FI[13], :2] + face[FI[14], :2]) / 2.0)
    chin = box_xy(face[FI[152], :2])
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
        phi = math.atan2(m[0], m[1])  # in-plane rotation: wrist->middle-base points up
        c, s = math.cos(phi), math.sin(phi)
        r = rel / palm
        hs[h] = np.stack([r[:, 0] * c - r[:, 1] * s, r[:, 0] * s + r[:, 1] * c, r[:, 2]], 1)
        pd[h, :3] = m / palm
        n = np.cross(rel[H_INDEX_BASE], rel[H_PINKY_BASE])
        if h == 0:  # mirror so "palm normal" means the same for both hands
            n = -n
        pd[h, 3:] = n / (np.linalg.norm(n) + 1e-9)
        wp[h] = box[0, :2]
        for k in range(3):  # 2-D distances (hand z and face z are not comparable)
            wf[h, k] = np.linalg.norm(box[0, :2] - face_box[k])
        flags[h] = 1.0

    elbows = np.concatenate([box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])])
    v = forehead - chin
    head = np.array([mouth[0], mouth[1], math.atan2(v[0], v[1])])  # 0 = upright

    f = np.concatenate([hs.ravel(), pd.ravel(), wp.ravel(), elbows, wf.ravel(), head, flags, [duration]])
    assert f.shape[0] == N_FEATURES
    return f.astype(np.float32)


def build_features(raw: dict):
    """raw landmarks -> ((64, 98) float32, details). Raises Reject."""
    pose, hands, face = raw["pose"], raw["hands"], raw["face"]
    W, H, fps = int(raw["W"]), int(raw["H"]), float(raw["fps"])
    T = len(pose)
    if T == 0:
        raise Reject("NO_FRAMES")

    in_use = np.stack([frame_in_use(pose[t], W, H) for t in range(T)])
    spans = find_spans(in_use.any(1))
    if not spans:
        raise Reject("NO_SPAN")
    if MULTI_SPAN == "reject" and len(spans) > 1:
        raise Reject("MULTIPLE_SIGN_SPANS", f"{len(spans)} spans")
    start, end, closed = max(spans, key=lambda s: s[1] - s[0])  # longest span
    if REQUIRE_CLOSED_SPAN and not closed:
        raise Reject("SIGN_NOT_CLOSED")
    F = end - start + 1

    complete = complete_mask(raw, in_use)[start:end + 1]
    nxt = np.empty(F, int)  # next complete frame at/after i (relative), -1 if none
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur

    pos = np.floor(np.arange(N_FRAMES) * (F - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0:
            raise Reject("NO_COMPLETE_FRAME", f"position {p} of {F}")
        if n - p > MAX_GAP:
            raise Reject("GAP_TOO_LARGE", f"position {p} needs +{n - p} frames")
        chosen.append(start + n)

    duration = F / fps
    feats = np.stack([frame_features(pose[t], hands[t], face[t], in_use[t], W, H, duration) for t in chosen])
    if not np.isfinite(feats).all():
        raise Reject("NON_FINITE")
    return feats, dict(
        frames_decoded=int(T), fps=round(fps, 3), span=[int(start), int(end)], span_frames=int(F),
        span_count=len(spans), span_closed=bool(closed), duration_s=round(duration, 3),
        complete_share=round(float(complete.mean()), 4),
        rescued_hand_frames=int(np.asarray(raw["rescued"]).sum()),
    )


# --------------------------------------------------------------------------- #
# Worker
# --------------------------------------------------------------------------- #
def base_info(rel: str, gloss: str) -> dict:
    return dict(path=rel, gloss=gloss, status="rejected", reason_code=None, reason=None,
                detail="", landmark_cache="miss")


def crash_info(rel: str, gloss: str, exc) -> dict:
    info = base_info(rel, gloss)
    info.update(reason_code="WORKER_CRASH", reason=REASON_TEXT["WORKER_CRASH"],
                detail=f"{type(exc).__name__}: {exc}", landmark_cache="unknown")
    return info


def process_video(job):
    video, rel, gloss, use_cache = job
    t0 = time.time()
    info = base_info(rel, gloss)
    feats = None
    try:
        raw, hit = load_or_detect(video, use_cache)
        info["landmark_cache"] = "hit" if hit else "miss"
        feats, details = build_features(raw)
        info.update(details)
        info["status"] = "kept"
    except Reject as r:
        info.update(reason_code=r.code, reason=REASON_TEXT.get(r.code, r.code), detail=r.detail)
    except Exception as e:  # never kill the pool
        info.update(reason_code="EXCEPTION", reason=REASON_TEXT["EXCEPTION"],
                    detail=f"{type(e).__name__}: {e}",
                    debug_traceback=traceback.format_exc(limit=6))
    info["seconds"] = round(time.time() - t0, 2)
    return info, feats


def run_all(jobs, workers, handle):
    """Run jobs in a process pool; survive native crashes of single workers.

    A dead worker breaks the whole pool. Unfinished jobs are re-queued; a job
    that was in flight for two breaks is run alone, so a crash is blamed on the
    exact video (WORKER_CRASH) and every other video still gets processed.
    """
    if workers == 1:
        _worker_init()                      # quiet + single model set in parent
        for j in jobs:
            handle(process_video(j))
        return
    pending, suspects, strikes = list(jobs), [], Counter()
    while pending:
        done, broke = set(), False
        with ProcessPoolExecutor(max_workers=workers, initializer=_worker_init) as ex:
            futs = {ex.submit(process_video, j): j for j in pending}
            for fut in as_completed(futs):
                j = futs[fut]
                try:
                    res = fut.result()
                except BrokenProcessPool:
                    broke = True
                    continue
                except Exception as e:
                    res = (crash_info(j[1], j[2], e), None)
                done.add(j[0])
                handle(res)
        if not broke:
            break
        retry = [j for j in pending if j[0] not in done]
        pending = []
        for j in retry:
            strikes[j[0]] += 1
            (suspects if strikes[j[0]] >= 2 else pending).append(j)
    for j in suspects:
        try:
            with ProcessPoolExecutor(max_workers=1, initializer=_worker_init) as ex:
                res = ex.submit(process_video, j).result()
        except Exception as e:
            res = (crash_info(j[1], j[2], e), None)
        handle(res)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def class_name(folder: str) -> str:
    return re.sub(r'[<>:"/\\|?*]+', "_", folder.strip().upper().replace(" ", "_"))


def discover():
    if not DATASET_DIR.is_dir():
        sys.exit(f"ERROR: dataset folder not found:\n  {DATASET_DIR}")
    jobs, gloss_folders = [], defaultdict(list)
    for g in sorted(p for p in DATASET_DIR.iterdir() if p.is_dir()):
        gloss = class_name(g.name)
        gloss_folders[gloss].append(g.name)
        for v in sorted(g.rglob("*")):
            if v.is_file() and v.suffix.lower() in VIDEO_EXTS:
                jobs.append((str(v), v.relative_to(DATASET_DIR).as_posix(), gloss))
    if not jobs:
        sys.exit(f"ERROR: no videos found under {DATASET_DIR}")
    return jobs, dict(gloss_folders)


def next_run_id(root: Path) -> int:
    root.mkdir(parents=True, exist_ok=True)
    ids = [int(p.name) for p in root.iterdir() if p.is_dir() and p.name.isdigit()]
    return max(ids) + 1 if ids else 1


def fmt_time(s: float) -> str:
    s = int(max(0, s))
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def main():
    global MAX_FRAME_WIDTH
    ap = argparse.ArgumentParser(description="Extract (64, 98) sign features from ISL videos.")
    ap.add_argument("--workers", type=int, default=None,
                    help=f"worker processes (default {DEFAULT_MAX_WORKERS})")
    ap.add_argument("--no-cache", action="store_true", help="ignore the landmark cache")
    ap.add_argument("--width", type=int, default=MAX_FRAME_WIDTH,
                    help="max detection frame width in px (default 960)")
    args = ap.parse_args()
    MAX_FRAME_WIDTH = int(args.width)

    try:
        import cv2  # noqa: F401
        import mediapipe  # noqa: F401
    except ImportError as e:
        sys.exit(f"ERROR: missing package ({e}). Install:  py -m pip install opencv-python mediapipe numpy")

    videos, gloss_folders = discover()
    collisions = {g: f for g, f in gloss_folders.items() if len(f) > 1}
    env_workers = int(os.getenv("EXTRACT_WORKERS", "0") or 0)
    workers = args.workers or env_workers or DEFAULT_MAX_WORKERS
    workers = max(1, min(workers, len(videos)))

    run_id = next_run_id(FEATURES_ROOT)
    out_dir = FEATURES_ROOT / str(run_id)
    out_dir.mkdir(parents=True, exist_ok=False)

    print(f"Dataset : {DATASET_DIR}")
    print(f"Videos  : {len(videos)} in {len(gloss_folders)} glosses | workers: {workers} | "
          f"cache: {'off' if args.no_cache else 'on'} | width <= {MAX_FRAME_WIDTH}")
    for g, f in collisions.items():
        print(f"WARNING : folders {f} all map to class {g} (merged)")
    print(f"Output  : {out_dir}  (features id {run_id})\n")

    jobs = [(v, rel, g, not args.no_cache) for v, rel, g in videos]
    results = []
    counts = Counter()
    recent = deque(maxlen=60)          # completion times -> stable rate/ETA
    t0 = time.time()

    def handle(res):
        results.append(res)
        counts[res[0]["status"]] += 1
        done = len(jobs) and len(results)
        now = time.time()
        recent.append(now)
        if len(recent) > 1:
            rate = (len(recent) - 1) / (recent[-1] - recent[0])
        else:
            rate = done / max(now - t0, 1e-6)
        eta = (len(jobs) - done) / rate if rate > 0 else 0.0
        sys.stdout.write(
            f"\r[{100 * done / len(jobs):5.1f}%] {done}/{len(jobs)}  {rate:5.2f} vid/s  "
            f"ETA {fmt_time(eta)}  kept {counts['kept']}  rejected {counts['rejected']}  "
            f"elapsed {fmt_time(now - t0)}   \x1b[K")
        sys.stdout.flush()

    try:
        run_all(jobs, workers, handle)
    except KeyboardInterrupt:
        print("\nInterrupted - partial output left in", out_dir)
        sys.exit(130)
    print()

    # ---- aggregate per gloss (deterministic: sorted by relative path) ---- #
    results.sort(key=lambda r: (r[0]["gloss"], r[0]["path"].casefold()))
    per_gloss = defaultdict(list)
    for info, feats in results:
        if feats is not None:
            info["row"] = len(per_gloss[info["gloss"]])
            per_gloss[info["gloss"]].append(feats)

    class_summary = {}
    for gloss in sorted(gloss_folders):
        arrs = per_gloss.get(gloss, [])
        total = sum(1 for i, _ in results if i["gloss"] == gloss)
        shape = [len(arrs), N_FRAMES, N_FEATURES]
        if arrs:
            np.save(out_dir / f"{gloss}.npy", np.stack(arrs).astype(np.float32))
        class_summary[gloss] = dict(source_folders=gloss_folders[gloss], videos_total=total,
                                    kept=len(arrs), rejected=total - len(arrs),
                                    feature_file=f"{gloss}.npy" if arrs else None, feature_shape=shape)

    kept, rej = counts["kept"], counts["rejected"]
    reasons = Counter(i["reason_code"] for i, _ in results if i["status"] != "kept")
    report = dict(
        id=run_id,
        created=datetime.now().isoformat(timespec="seconds"),
        dataset=str(DATASET_DIR),
        elapsed_s=round(time.time() - t0, 1),
        summary=dict(videos_total=len(results), kept=kept, rejected=rej,
                     classes_total=len(gloss_folders),
                     classes_with_data=sum(1 for v in class_summary.values() if v["kept"]),
                     cache_hits=sum(1 for i, _ in results if i["landmark_cache"] == "hit"),
                     kept_unclosed_spans=sum(1 for i, _ in results
                                             if i["status"] == "kept" and not i.get("span_closed", True)),
                     kept_multi_span_videos=sum(1 for i, _ in results
                                                if i["status"] == "kept" and i.get("span_count", 1) > 1),
                     rejection_reason_counts=dict(sorted(reasons.items()))),
        gloss_collisions=collisions,
        configuration=dict(
            n_frames=N_FRAMES, n_features=N_FEATURES, workers=workers, max_gap=MAX_GAP,
            vis_min=VIS_MIN, hand_margin_shoulder_widths=HAND_MARGIN_SW,
            rest_shoulder_factor=REST_SHOULDER_FACTOR, trigger_frames=TRIGGER_FRAMES,
            pre_roll=PRE_ROLL, end_frames=END_FRAMES, keep_tail=KEEP_TAIL,
            multi_span=MULTI_SPAN, require_closed_span=REQUIRE_CLOSED_SPAN,
            max_frame_width=MAX_FRAME_WIDTH, cache_version=cache_version(),
        ),
        features_shape=["N", N_FRAMES, N_FEATURES],
        feature_layout=layout_offsets(),
        classes=class_summary,
        videos=[i for i, _ in results],
    )
    with open(out_dir / "extract_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Extraction complete | kept {kept} / {len(results)} | "
          f"{report['summary']['classes_with_data']}/{len(gloss_folders)} classes with data | "
          f"{report['elapsed_s']}s | cache hits {report['summary']['cache_hits']}")
    if reasons:
        print("Rejection reasons:")
        for k, v in reasons.most_common():
            print(f"  {k}: {v}  ({REASON_TEXT.get(k, '')})")
    empty = [g for g, v in class_summary.items() if v["kept"] == 0]
    if empty:
        print(f"WARNING: {len(empty)} glosses have no usable video: {', '.join(empty[:10])}"
              f"{' ...' if len(empty) > 10 else ''}")
    print(f"Features id : {run_id}\nReport      : {out_dir / 'extract_report.json'}")


if __name__ == "__main__":
    main()
```

---

# FILE: `model_training_zone\guide.md`

```markdown
# ISL Sign Recognition — Run Guide

Companion for the four scripts: `extract.py`, `train.py`, `avatar_extract.py`,
`test_model.py`. Keep all four in the **same folder**.

---

## 1. Install

Python 3.9–3.11 recommended (MediaPipe wheel availability).

```bash
py -m pip install numpy opencv-python mediapipe
py -m pip install torch onnx onnxruntime        # CPU torch wheel is fine
```

---

## 2. Folder setup

Put the four scripts inside `model_training_zone/` (or at the project root
beside it — both work; paths are auto-discovered):

```
project/
├── model_training_zone/
│   ├── dataset/Indian Sign Language_Dataset/ISL_VIDEO/
│   │   ├── hello/            ← one folder per gloss
│   │   │   ├── video1.mp4
│   │   │   └── video2.mp4
│   │   └── thanks/
│   │       └── video1.mp4
│   ├── dataset_train/        ← created automatically (features/, cache/)
│   ├── extract.py
│   ├── train.py
│   ├── avatar_extract.py
│   └── test_model.py
└── models/onnx_models/       ← created automatically by train.py
```

Dataset rules:
- Folder name = class name (uppercased, spaces → `_`).
- Any common video format/resolution/fps.
- Signer faces the camera; **hands start down**, raise for the sign, put them
  down again at the end (the span state machine relies on this).

---

## 3. Run order

### Step 1 — extract features
```bash
py extract.py [--workers N] [--no-cache]
```
- Progress line: `% done, vid/s, ETA, kept/rejected`.
- Writes `dataset_train/features/<id>/<GLOSS>.npy` (N, 64, 98) +
  `extract_report.json`; caches landmarks in `dataset_train/cache/`.
- **Check:** every gloss has `kept > 0`; read the rejection reasons printed
  at the end (`NO_SPAN`, `GAP_TOO_LARGE`, …).

### Step 2 — train + export ONNX
```bash
py train.py
```
- Uses the newest features id (pin one by editing `FEATURES_ID = 3` at the top).
- Prints per-epoch loss/acc, validation acc / top-3 / macro P-R-F1.
- Writes `models/onnx_models/<id>/`:
  `sign_daily_lstm.onnx`, `sign_daily_classes.json`, `daily_report.json`,
  `confusion_matrix.json`, empty `avatar/`.
- The ONNX is deployed **only** if PyTorch and ONNX Runtime agree
  (max |logit diff| < 1e-3). A failed check leaves a `.staging_<id>` folder
  and deploys nothing.

### Step 3 — avatar capture
```bash
py avatar_extract.py [--model-id ID] [--no-cache]
```
- Fills `models/onnx_models/<id>/avatar/<GLOSS>/` with
  `pose.npy (F,8,4)`, `hands.npy (F,42,3)`, `face.npy (F,19,3)`,
  `t.npy (F,)`, `meta.json`.
- Picks each gloss's best video (highest complete-frame share in its span).
- Instant when the extract cache exists (no re-detection).

### Step 4 — live detection
```bash
py test_model.py [--model-id ID] [--width 640] [--complexity 0|1]
```
- Auto mode: raise a hand → recording starts; both hands down → result.
- Shows top-3 probabilities; `Not sure` when top < 0.5 or gap < 0.15;
  `Hands not clear, try again` when frames were incomplete.

| Key | Action |
|-----|--------|
| SPACE | start / stop manual recording |
| M | toggle auto ↔ manual |
| Q / ESC | quit |

On-screen: mode + state, REC timer + frame count, webcam FPS, inference ms.

---

## 4. Everyday workflows

| Task | Commands |
|------|----------|
| Added new videos | `extract.py` → `train.py` → `avatar_extract.py` → `test_model.py` (cache makes old videos instant) |
| Retrain same features | `train.py` only (new model id) |
| Test an older model | `test_model.py --model-id <id>` |
| Force re-detection | delete `dataset_train/cache/`, rerun extract |
| Faster live on weak PC | `test_model.py --width 480 --complexity 0` |
| Faster extraction | `extract.py --workers 8` (or env `EXTRACT_WORKERS=8`) |

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `no features found` at train | extract never ran / failed | run `extract.py`, check its report |
| Many `NO_SPAN` rejections | hands never clearly raised, or video starts with hands up | re-record: start hands down, raise clearly |
| Many `GAP_TOO_LARGE` | face/hands flicker (lighting, distance) | better light; signer closer; check `rescued_hand_frames` |
| Gloss with 0 kept videos | all its videos rejected | read its reasons in `extract_report.json`, re-record |
| Train: `no validation videos` | every gloss has 1 video | record ≥ 2 videos per gloss |
| ONNX verification failed | torch/onnx version mismatch | upgrade both, rerun `train.py`; delete stale `.staging_*` |
| Live always `Not sure` | thresholds vs. weak model | train more data; or tune `MIN_TOP_PROB` / `MIN_PROB_GAP` in `test_model.py` |
| Live `Hands not clear` | face/shoulders out of frame or occluded | step back; keep face + both shoulders visible |
| `cannot open webcam 0` | camera used by another app / wrong index | close other apps; change `cv2.VideoCapture(0)` index |
| Live picks a bad model | leftover `.staging_*` with an onnx | delete `.staging_*` folders (or apply fix #1 above) |

---

## 6. Consistency rules (do not break)

1. `train.py`, `avatar_extract.py`, `test_model.py` **import** `extract.py`.
   Never edit feature math in one place only — change `extract.py` and rerun
   the whole chain.
2. Changing detection parameters or `CACHE_VERSION` → delete
   `dataset_train/cache/` and rerun `extract.py` + `avatar_extract.py`.
3. `daily_report.json` links model id ↔ features id ↔ avatar data. Keep the
   model folder intact; don't move `avatar/` out of it.
4. Features ids and model ids are append-only (new id per run) — old runs stay
   reproducible; delete old folders only when disk space demands it.
```
```

---

# FILE: `model_training_zone\test_model.py`

```python
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
```

---

# FILE: `model_training_zone\train.py`

```python
#!/usr/bin/env python3
"""
train.py - ISL sign recognition: train BiLSTM+attention, evaluate, export ONNX.

    py train.py

Reads  model_training_zone/dataset_train/features/<id>/<GLOSS>.npy  (N, 64, 98)
(newest numeric id, or pin FEATURES_ID below) and writes

    models/onnx_models/<model_id>/
        sign_daily_lstm.onnx        input "sequence" (batch, 64, 98) RAW -> logits
        sign_daily_classes.json     gloss names in output order
        daily_report.json           best val acc, top-3, per-class P/R/F1, ONNX diff
        confusion_matrix.json       validation confusion matrix
        training_data/features/    copied per-gloss training clips and extraction report
        avatar/                     (filled later by avatar_extract.py)

Compatible with extract.py conventions:
  * index 0 = person's LEFT hand, 1 = right
  * shoulder box: y-axis up, z towards camera, unit = shoulder width
  * feature layout imported from extract.layout_offsets() and asserted here

Feature standardisation (train mean/std) and the "hand not in use -> zeros"
gating are baked INTO the network as buffers, so live inference feeds raw 98s.

The model is exported to a staging folder and moved to its final id folder
only if PyTorch and ONNX Runtime agree (max |logit diff| < 1e-3).

Needs:  py -m pip install torch onnx onnxruntime numpy
"""
from __future__ import annotations

import json
import math
import os
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import DataLoader, Dataset
except ImportError:
    sys.exit("ERROR: PyTorch missing.  py -m pip install torch onnx onnxruntime")

from extract import FEATURES_ROOT, N_FEATURES, N_FRAMES, TRAIN_ZONE, layout_offsets

# --------------------------------------------------------------------------- #
# CONFIG
# --------------------------------------------------------------------------- #
FEATURES_ID = None            # e.g. 3 to pin a features id; None = newest

HIDDEN, LAYERS, DROPOUT = 128, 2, 0.3
LR, WEIGHT_DECAY = 2e-3, 1e-2
BATCH_SIZE, MAX_EPOCHS = 32, 15
LABEL_SMOOTHING, GRAD_CLIP = 0.1, 1.0
EARLY_STOP = 10               # epochs without validation improvement
VAL_FRACTION, VAL_MIN = 0.20, 2
SEED = 42

AUG_COPIES = 4                # fresh augmented copies per training video/epoch
AUG_NOISE_STD = 0.01
AUG_CROP_MAX = 0.10           # temporal crop: trim 0-10 % frames each end
AUG_ROT_DEG = 8.0             # in-plane rotation of shoulder-box x,y
AUG_SCALE = (0.95, 1.05)      # shoulder-width / camera-distance jitter

ONNX_OPSET, ONNX_TOL = 17, 1e-3

MODELS_ROOT = TRAIN_ZONE.parent / "models" / "onnx_models"

# --------------------------------------------------------------------------- #
# Feature layout (asserted against extract.py)
# --------------------------------------------------------------------------- #
COL_HS, COL_PD, COL_WP, COL_EL, COL_WF, COL_HEAD, COL_FLAG, COL_DUR = \
    0, 66, 78, 82, 86, 92, 95, 97
_LO = layout_offsets()
assert [_LO[k][0] for k in ("handshape", "palm_dir_normal", "wrist_pos", "elbows",
                            "wrist_face_dist", "head", "hand_flags", "duration")] == \
       [COL_HS, COL_PD, COL_WP, COL_EL, COL_WF, COL_HEAD, COL_FLAG, COL_DUR], \
       "feature layout mismatch with extract.py"

LEFT_COLS = list(range(0, 33)) + list(range(66, 72)) + [78, 79] + list(range(86, 89))
RIGHT_COLS = list(range(33, 66)) + list(range(72, 78)) + [80, 81] + list(range(89, 92))
POS_COLS = list(range(COL_WP, COL_WF + 6)) + [COL_HEAD, COL_HEAD + 1]
NOISE_COLS = list(range(COL_HS, COL_HS + 66)) + POS_COLS      # position numbers
FLAG_COLS = [COL_FLAG, COL_FLAG + 1]

_ROT_PAIRS = ([(COL_PD + 6 * h + 3 * k, COL_PD + 6 * h + 3 * k + 1)
               for h in (0, 1) for k in (0, 1)]
              + [(COL_WP, COL_WP + 1), (COL_WP + 2, COL_WP + 3),
                 (COL_EL, COL_EL + 1), (COL_EL + 2, COL_EL + 3),
                 (COL_HEAD, COL_HEAD + 1)])


def gate_parts():
    """flags (..,2) @ M + base -> per-column multiplier (unused hand -> 0)."""
    M = np.zeros((2, N_FEATURES), np.float32)
    M[0, LEFT_COLS] = 1.0
    M[1, RIGHT_COLS] = 1.0
    base = np.ones(N_FEATURES, np.float32)
    base[LEFT_COLS + RIGHT_COLS] = 0.0
    return M, base


_GATE_M, _GATE_BASE = gate_parts()


# --------------------------------------------------------------------------- #
# Data
# --------------------------------------------------------------------------- #
def find_features_dir() -> Path:
    if not FEATURES_ROOT.is_dir():
        sys.exit(f"ERROR: features folder not found: {FEATURES_ROOT}\nRun  py extract.py  first.")
    if FEATURES_ID is not None:
        d = FEATURES_ROOT / str(FEATURES_ID)
        if not d.is_dir():
            sys.exit(f"ERROR: FEATURES_ID {FEATURES_ID} not found in {FEATURES_ROOT}")
        return d
    numeric = [p for p in FEATURES_ROOT.iterdir() if p.is_dir() and p.name.isdigit()]
    if numeric:
        return max(numeric, key=lambda p: int(p.name))
    anyd = [p for p in FEATURES_ROOT.iterdir() if p.is_dir()]
    if not anyd:
        sys.exit(f"ERROR: no feature runs in {FEATURES_ROOT}. Run  py extract.py  first.")
    return max(anyd, key=lambda p: p.stat().st_mtime)


def load_features(fdir: Path):
    classes, arrays = [], []
    for f in sorted(fdir.glob("*.npy"), key=lambda p: p.stem):
        a = np.load(f)
        if a.ndim != 3 or a.shape[1:] != (N_FRAMES, N_FEATURES):
            sys.exit(f"ERROR: {f.name} has shape {a.shape}, expected (N, {N_FRAMES}, {N_FEATURES})")
        if len(a) == 0:
            continue
        good = np.isfinite(a).all(axis=(1, 2))
        if not good.all():
            print(f"WARNING: {f.name}: dropped {int((~good).sum())} non-finite clip(s)")
            a = a[good]
            if len(a) == 0:
                continue
        classes.append(f.stem)
        arrays.append(a.astype(np.float32))
    if len(classes) < 2:
        sys.exit(f"ERROR: need at least 2 classes with data in {fdir}, found {len(classes)}")
    return classes, arrays


def split_by_video(classes, arrays, rng):
    """Per gloss: 20 % of videos (target min 2) held out. Split by video."""
    Xtr, ytr, Xva, yva = [], [], [], []
    val_rows, warns = {}, []
    for c, a in enumerate(arrays):
        n = len(a)
        order = rng.permutation(n)
        n_val = max(VAL_MIN, int(round(VAL_FRACTION * n)))
        n_val = min(n_val, n - 1) if n >= 2 else 0
        if n < VAL_MIN + 1:
            warns.append(f"{classes[c]}: only {n} video(s) - validation uses {n_val}")
        v, t = order[:n_val], order[n_val:]
        Xtr.append(a[t]); ytr += [c] * len(t)
        if len(v):
            Xva.append(a[v]); yva += [c] * len(v)
        val_rows[c] = sorted(int(i) for i in v)
    Xtr = np.concatenate(Xtr)
    Xva = (np.concatenate(Xva) if Xva else np.zeros((0, N_FRAMES, N_FEATURES), np.float32))
    return Xtr, np.array(ytr, np.int64), Xva, np.array(yva, np.int64), val_rows, warns


def compute_norm_stats(Xtr: np.ndarray):
    """Mean/std per column from training videos; hand columns use in-use frames only."""
    flat = Xtr.reshape(-1, N_FEATURES).astype(np.float64)
    use_l = flat[:, COL_FLAG] > 0.5
    use_r = flat[:, COL_FLAG + 1] > 0.5
    left, right = set(LEFT_COLS), set(RIGHT_COLS)
    mean, std = np.zeros(N_FEATURES), np.ones(N_FEATURES)
    for c in range(N_FEATURES):
        if c in FLAG_COLS:
            continue
        sel = use_l if c in left else use_r if c in right else slice(None)
        v = flat[sel, c]
        if v.size > 1:
            mean[c] = v.mean()
            s = v.std()
            std[c] = s if s > 1e-4 else 1.0
    return mean.astype(np.float32), std.astype(np.float32)


# --------------------------------------------------------------------------- #
# Augmentation (numeric groups only; flags and duration never touched)
# --------------------------------------------------------------------------- #
def augment(x: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    x = x.copy()
    flags = x[:, COL_FLAG:COL_FLAG + 2].copy()

    # 1. temporal crop / speed: trim 0-10 % frames each end, resample back to 64
    a = int(rng.uniform(0, AUG_CROP_MAX) * N_FRAMES)
    b = int(rng.uniform(0, AUG_CROP_MAX) * N_FRAMES)
    idx = np.rint(np.linspace(a, N_FRAMES - 1 - b, N_FRAMES)).astype(int)
    x, flags = x[idx], flags[idx]

    # 2. in-plane rotation of shoulder-box x,y vectors (y-up convention)
    th = math.radians(rng.uniform(-AUG_ROT_DEG, AUG_ROT_DEG))
    c, s = math.cos(th), math.sin(th)
    for i, j in _ROT_PAIRS:
        xi, yj = x[:, i].copy(), x[:, j].copy()
        x[:, i] = c * xi - s * yj
        x[:, j] = s * xi + c * yj
    x[:, COL_HEAD + 2] -= th                      # head angle from vertical

    # 3. scale jitter (camera distance) on width-normalised positions/distances
    x[:, POS_COLS] *= rng.uniform(*AUG_SCALE)

    # 4. gaussian noise on position numbers, never on an unused hand's zeros
    gate = flags @ _GATE_M + _GATE_BASE
    noise = rng.normal(0.0, AUG_NOISE_STD, (N_FRAMES, len(NOISE_COLS))).astype(np.float32)
    x[:, NOISE_COLS] += noise * gate[:, NOISE_COLS]
    return x


class SignDataset(Dataset):
    """Every training video once as-is + AUG_COPIES fresh augmented copies."""

    def __init__(self, X, y, copies=0, seed=0):
        self.X, self.y, self.copies = X, y, copies
        self.rng = np.random.default_rng(seed)

    def __len__(self):
        return len(self.X) * (1 + self.copies)

    def __getitem__(self, i):
        v, k = i % len(self.X), i // len(self.X)
        x = self.X[v] if k == 0 else augment(self.X[v], self.rng)
        return torch.from_numpy(np.ascontiguousarray(x, np.float32)), int(self.y[v])


# --------------------------------------------------------------------------- #
# Model: raw (B,64,98) -> standardise+gate -> BiLSTM -> LayerNorm -> attention
# --------------------------------------------------------------------------- #
class SignNet(nn.Module):
    def __init__(self, n_classes, mean, std):
        super().__init__()
        self.register_buffer("mean", torch.from_numpy(mean))
        self.register_buffer("std", torch.from_numpy(std))
        self.register_buffer("gate_m", torch.from_numpy(_GATE_M))
        self.register_buffer("gate_base", torch.from_numpy(_GATE_BASE))
        self.lstm = nn.LSTM(N_FEATURES, HIDDEN, num_layers=LAYERS, batch_first=True,
                            bidirectional=True, dropout=DROPOUT)
        self.norm = nn.LayerNorm(2 * HIDDEN)
        self.attn = nn.Sequential(nn.Linear(2 * HIDDEN, HIDDEN), nn.Tanh(),
                                  nn.Linear(HIDDEN, 1))
        self.drop = nn.Dropout(DROPOUT)
        self.fc = nn.Linear(2 * HIDDEN, n_classes)

    def forward(self, x):
        flags = x[:, :, COL_FLAG:COL_FLAG + 2]                 # raw 0/1 hand flags
        gate = flags @ self.gate_m + self.gate_base            # zero unused hands
        h = ((x - self.mean) / self.std) * gate
        out, _ = self.lstm(h)
        out = self.norm(out)
        valid = flags.sum(-1) > 0.5                            # attend active frames
        any_valid = valid.float().sum(1, keepdim=True) > 0.5
        mask = valid | ~any_valid
        scores = self.attn(out).squeeze(-1).masked_fill(~mask, -1e9)
        w = torch.softmax(scores, dim=1).unsqueeze(-1)
        ctx = (out * w).sum(1)
        return self.fc(self.drop(ctx))


# --------------------------------------------------------------------------- #
# Train / evaluate
# --------------------------------------------------------------------------- #
@torch.no_grad()
def predict_logits(model, X, device, bs=128):
    model.eval()
    outs = [model(torch.from_numpy(X[i:i + bs]).to(device)).cpu()
            for i in range(0, len(X), bs)]
    return torch.cat(outs).numpy() if outs else np.zeros((0, 0), np.float32)


def metrics_from_logits(logits, y, n_classes):
    pred = logits.argmax(1)
    loss = float(nn.functional.cross_entropy(torch.from_numpy(logits), torch.from_numpy(y)))
    return float((pred == y).mean()), loss, pred


def confusion(y, pred, n):
    cm = np.zeros((n, n), int)
    for t, p in zip(y, pred):
        cm[t, p] += 1
    return cm


def per_class_report(cm, classes):
    tp = np.diag(cm).astype(float)
    support, predicted = cm.sum(1), cm.sum(0)
    prec = np.divide(tp, predicted, out=np.zeros_like(tp), where=predicted > 0)
    rec = np.divide(tp, support, out=np.zeros_like(tp), where=support > 0)
    f1 = np.divide(2 * prec * rec, prec + rec, out=np.zeros_like(tp), where=(prec + rec) > 0)
    rows = {c: dict(precision=round(float(prec[i]), 4), recall=round(float(rec[i]), 4),
                    f1=round(float(f1[i]), 4), support=int(support[i]))
            for i, c in enumerate(classes)}
    has = support > 0
    macro = dict(precision=round(float(prec[has].mean()), 4),
                 recall=round(float(rec[has].mean()), 4),
                 f1=round(float(f1[has].mean()), 4), classes_averaged=int(has.sum()))
    return rows, macro


def train(model, Xtr, ytr, Xva, yva, device, n_classes):
    loader = DataLoader(SignDataset(Xtr, ytr, AUG_COPIES, SEED), batch_size=BATCH_SIZE,
                        shuffle=True, num_workers=0,
                        generator=torch.Generator().manual_seed(SEED))
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=LR, epochs=MAX_EPOCHS,
                                                steps_per_epoch=len(loader))
    crit = nn.CrossEntropyLoss(label_smoothing=LABEL_SMOOTHING)
    best = dict(acc=-1.0, loss=float("inf"), epoch=0, state=None)
    history, stale = [], 0

    for epoch in range(1, MAX_EPOCHS + 1):
        t0 = time.time()
        model.train()
        tl = tc = tn = 0
        for xb, yb in loader:
            xb, yb = xb.to(device), yb.to(device)
            logits = model(xb)
            loss = crit(logits, yb)
            if not torch.isfinite(loss):
                sys.exit("ERROR: training loss diverged (NaN/inf).")
            opt.zero_grad(set_to_none=True)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), GRAD_CLIP)
            opt.step()
            sched.step()
            tl += float(loss) * len(yb)
            tc += int((logits.argmax(1) == yb).sum())
            tn += len(yb)
        va_acc, va_loss, _ = metrics_from_logits(predict_logits(model, Xva, device),
                                                 yva, n_classes)
        history.append(dict(epoch=epoch, train_loss=round(tl / tn, 4),
                            train_acc=round(tc / tn, 4), val_loss=round(va_loss, 4),
                            val_acc=round(va_acc, 4)))
        improved = va_acc > best["acc"] or (va_acc == best["acc"] and va_loss < best["loss"])
        if improved:
            best = dict(acc=va_acc, loss=va_loss, epoch=epoch,
                        state={k: v.detach().cpu().clone()
                               for k, v in model.state_dict().items()})
            stale = 0
        else:
            stale += 1
        print(f"epoch {epoch:2d}/{MAX_EPOCHS}  train loss {tl / tn:.4f} acc {tc / tn:.3f} | "
              f"val loss {va_loss:.4f} acc {va_acc:.3f}{'  *best*' if improved else ''}  "
              f"({time.time() - t0:.0f}s)", flush=True)
        if stale >= EARLY_STOP:
            print(f"Early stop: no improvement for {EARLY_STOP} epochs.")
            break
    return best, history


# --------------------------------------------------------------------------- #
# ONNX export + verification
# --------------------------------------------------------------------------- #
def export_onnx(model, path: Path):
    model.eval().cpu()
    dummy = torch.randn(1, N_FRAMES, N_FEATURES)
    kw = dict(input_names=["sequence"], output_names=["logits"], opset_version=ONNX_OPSET,
              dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
    try:
        torch.onnx.export(model, dummy, str(path), dynamo=False, **kw)
    except TypeError:
        torch.onnx.export(model, dummy, str(path), **kw)      # older torch


def verify_onnx(model, path: Path, Xva: np.ndarray) -> float:
    try:
        import onnx
        import onnxruntime as ort
    except ImportError:
        sys.exit("ERROR: onnx / onnxruntime missing.  py -m pip install onnx onnxruntime")
    onnx.checker.check_model(onnx.load(str(path)))
    sess = ort.InferenceSession(str(path), providers=["CPUExecutionProvider"])
    in_name = sess.get_inputs()[0].name
    model.eval().cpu()
    with torch.no_grad():
        ref = model(torch.from_numpy(Xva)).numpy()
    got = sess.run(None, {in_name: Xva})[0]
    diff = float(np.abs(ref - got).max())
    one = sess.run(None, {in_name: Xva[:1]})[0]               # batch-1 (live path)
    return max(diff, float(np.abs(ref[:1] - one).max()))


def next_model_id() -> int:
    MODELS_ROOT.mkdir(parents=True, exist_ok=True)
    ids = [int(p.name) for p in MODELS_ROOT.iterdir() if p.is_dir() and p.name.isdigit()]
    return max(ids) + 1 if ids else 1


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main():
    np.random.seed(SEED)
    torch.manual_seed(SEED)
    rng = np.random.default_rng(SEED)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    fdir = find_features_dir()
    classes, arrays = load_features(fdir)
    Xtr, ytr, Xva, yva, val_rows, warns = split_by_video(classes, arrays, rng)
    if len(Xva) == 0:
        sys.exit("ERROR: no validation videos - every class has a single video.")
    n_classes = len(classes)
    for w in warns:
        print("WARNING:", w)
    print(f"Features id {fdir.name} | {n_classes} classes | train {len(Xtr)} videos "
          f"(x{1 + AUG_COPIES} per epoch with augmentation) | val {len(Xva)} videos | "
          f"device {device}")

    mean, std = compute_norm_stats(Xtr)
    model = SignNet(n_classes, mean, std).to(device)
    print(f"Model: BiLSTM {LAYERS}x{HIDDEN} + LayerNorm + attention | "
          f"{sum(p.numel() for p in model.parameters()):,} parameters\n")

    t_start = time.time()
    best, history = train(model, Xtr, ytr, Xva, yva, device, n_classes)
    model.load_state_dict(best["state"])
    model.to("cpu").eval()
    print(f"\nBest epoch {best['epoch']}: val acc {best['acc']:.4f}, "
          f"val loss {best['loss']:.4f}")

    logits = predict_logits(model, Xva, "cpu")
    va_acc, va_loss, pred = metrics_from_logits(logits, yva, n_classes)
    cm = confusion(yva, pred, n_classes)
    per_class, macro = per_class_report(cm, classes)
    top3 = float(np.mean([y in np.argsort(-l)[:3] for l, y in zip(logits, yva)]))
    print(f"Validation: acc {va_acc:.4f} | top-3 {top3:.4f} | macro P {macro['precision']:.3f} "
          f"R {macro['recall']:.3f} F1 {macro['f1']:.3f}")

    # ---- staging -> verify -> deploy ---- #
    model_id = next_model_id()
    final_dir = MODELS_ROOT / str(model_id)
    staging = MODELS_ROOT / f".staging_{model_id}"
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    onnx_path = staging / "sign_daily_lstm.onnx"
    export_onnx(model, onnx_path)
    diff = verify_onnx(model, onnx_path, Xva)
    print(f"ONNX check: max |logit diff| = {diff:.2e} (tolerance {ONNX_TOL:.0e})")
    if not diff < ONNX_TOL:
        sys.exit(f"ERROR: ONNX verification FAILED (diff {diff:.3e} >= {ONNX_TOL:.0e}). "
                 f"Nothing deployed; staging kept at {staging}")

    (staging / "sign_daily_classes.json").write_text(
        json.dumps(classes, indent=2, ensure_ascii=False), encoding="utf-8")
    (staging / "confusion_matrix.json").write_text(
        json.dumps(dict(classes=classes, rows="true", columns="predicted",
                        matrix=cm.tolist()), indent=2), encoding="utf-8")
    report = dict(
        model_id=model_id, features_id=fdir.name, features_dir=str(fdir),
        created=datetime.now().isoformat(timespec="seconds"),
        training_seconds=round(time.time() - t_start, 1), device=str(device),
        best_epoch=best["epoch"], best_val_acc=round(best["acc"], 4),
        best_val_loss=round(best["loss"], 4), val_top3_acc=round(top3, 4),
        onnx=dict(input="sequence", output="logits", input_is_raw_features=True,
                  shape=["batch", N_FRAMES, N_FEATURES], max_abs_logit_diff=diff,
                  tolerance=ONNX_TOL, opset=ONNX_OPSET),
        macro_avg=macro, per_class=per_class,
        confusion_matrix_file="confusion_matrix.json",
        data=dict(classes=n_classes, train_videos=int(len(Xtr)), val_videos=int(len(Xva)),
                  videos_per_class={c: int(len(a)) for c, a in zip(classes, arrays)},
                  val_rows={classes[c]: r for c, r in val_rows.items()}, warnings=warns),
        hyperparameters=dict(
            hidden=HIDDEN, layers=LAYERS, dropout=DROPOUT, lr=LR,
            weight_decay=WEIGHT_DECAY, batch_size=BATCH_SIZE, max_epochs=MAX_EPOCHS,
            label_smoothing=LABEL_SMOOTHING, scheduler="OneCycleLR", grad_clip=GRAD_CLIP,
            early_stop=EARLY_STOP, seed=SEED, val_fraction=VAL_FRACTION, val_min=VAL_MIN,
            augmentation=dict(copies=AUG_COPIES, noise_std=AUG_NOISE_STD,
                              crop_max=AUG_CROP_MAX, rotation_deg=AUG_ROT_DEG,
                              scale=list(AUG_SCALE))),
        history=history,
    )
    (staging / "daily_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    (staging / "avatar").mkdir(exist_ok=True)
    shutil.copytree(fdir, staging / "training_data" / "features")

    if final_dir.exists():
        shutil.rmtree(final_dir)
    os.replace(staging, final_dir)
    print(f"\nModel id {model_id} deployed -> {final_dir}")
    print("Next:  py avatar_extract.py")


if __name__ == "__main__":
    main()
```

---

# FILE: `model_training_zone\training-method\training_method.md`

```markdown
# Sign Recognition – Training Method

## Overview

This document describes how the Indian Sign Language recognition model is trained
and how it is later used for live detection. Avatar data is extracted separately.

Capabilities ported from the previous codebase (extraction pipeline, training
stabilisers, augmentation, live controls and robustness handling) are adapted to
the new 98-feature design. The core architecture is unchanged.

---

## Skeleton used for training

![Training data: 11 points per hand, 3 face points, shoulders and elbows](training_data.svg)

| Part | Points | Source |
|------|--------|--------|
| Hands | 11 per hand – wrist, thumb base & tip, base & tip of index, middle, ring, pinky | MediaPipe Hand indices 0,1,4,5,8,9,12,13,16,17,20 |
| Elbows | 2 | Pose 13, 14 |
| Shoulders | 2 – set origin & scale of the shoulder box | Pose 11, 12 |
| Face | Forehead, mouth, chin | Face-mesh 10, mid(13,14), 152 |

The **wrist is the hand origin**: handshape is measured relative to it, and its
position in the shoulder box carries the hand's location. No palm centre is used.

Pose wrists (15, 16) are read **only** to decide whether a hand is in use.
Nothing else is used – no hips, legs, extra face points, visibility scores or expressions.

---

## Skeleton used for avatar

![Avatar data: 21 points per hand, 8 body points, 19 face points](avatar_data.svg)

| Part | Count | Indices |
|------|-------|---------|
| Hands | 21 × 2 = 42 | All MediaPipe hand landmarks |
| Body | 8 | Pose 11,12,13,14,15,16,23,24 |
| Face | 19 | Mesh 10,152,234,454,70,105,107,300,334,336,159,145,386,374,1,61,291,0,17 |

---

## Coordinate system – the Shoulder Box

All positions and directions are expressed in the **shoulder box**.

- **Origin** – midpoint of the two shoulders.
- **x-axis** – along the shoulder line.
- **y-axis** – perpendicular to it in the image plane.
- **Unit** – one shoulder width.

---

## Frame completeness

A frame is *complete* when **all** of these hold:

1. Every hand that is *in use* has all 21 MediaPipe points detected.
2. Both shoulders and both elbows have visibility ≥ 0.5.
3. The face mesh is found.

A hand is *in use* when its pose wrist is above the **rest line** by more than 0.05.
The rest line is the hip line when both hips are visible; otherwise shoulder-mid + 1.3 × shoulder-width.
A hand not in use is stored as zeros with flag = 0.

---

## Sign span detection – automatic sign splitting

The detector runs as a small state machine, identical for dataset videos and live webcam:

| State | Condition | Behaviour |
|-------|-----------|-----------|
| **IDLE** | Both hands below the rest line | No active sign, nothing recorded |
| **SIGN** | A wrist above the rest line for 3 consecutive frames | Recording starts; 8 frames before the trigger are kept |
| **End → IDLE** | Both hands below the rest line for 10 consecutive frames | Trailing hands-down frames are cut, keeping 2; clip is closed |

- Hands raised = start sign detection and recording.
- Both hands down again = end the current sign and return to IDLE.
- A video / live window with no valid span produces no clip (videos are rejected).

---

## Frame selection (64 frames)

Given a span of F frames, the 64 target positions are:

```
position[i] = round(i × (F − 1) / 63)      for i = 0 … 63
```

For each position the **first complete frame at or after it** is used.

- Reject the video if any position needs a frame > 5 frames after its target.
- Reject if no complete frame exists for a position.
- When F < 64 some frames repeat.

---

## Feature vector – 98 numbers per frame

| Group | What it captures | Numbers |
|-------|-----------------|---------|
| Handshape | 11 points relative to wrist, normalised by palm size (wrist → middle base), rotated so wrist→middle-base points up; x,y,z both hands | 66 |
| Palm direction & facing | Unit vector wrist→middle-base + unit palm normal, in shoulder box; per hand | 12 |
| Wrist position | x, y in shoulder box, both hands | 4 |
| Elbows | x, y in shoulder box | 4 |
| Wrist-to-face distances | Each wrist to forehead, mouth, chin | 6 |
| Head | Mouth x,y in shoulder box + forehead-to-chin angle from vertical | 3 |
| Hand flags | 1 = in use & complete, 0 otherwise | 2 |
| Clip duration | Seconds of the sign span (same value in all 64 frames) | 1 |
| **Total** | | **98** |

Model input shape: **(64, 98)** float32.

---

## Extraction – `extract.py`

```
py extract.py
```

- Reads **every** video in **every** gloss folder under `ISL_VIDEO/`.
- Folder name → class name (uppercased, spaces → `_`).
- Fresh MediaPipe Holistic per video; second hand detector on missed frames.
- Finds span → selects 64 frames → computes 98 features.

### Efficiency

- **Parallel workers** – videos are distributed across CPU worker processes.
- **Caching** – raw per-frame landmarks are cached keyed by (path, size, mtime);
  unchanged videos skip re-detection on later runs. Feature building still runs
  for every id, so each id stays a complete, independent extraction.
- **Progress line** – percentage done, videos/sec and ETA, updated in place.
- **Detailed report** – per-video status and rejection reason codes.

### Output (new id each run)

```
model_training_zone/dataset_train/features/<id>/
├── <GLOSS>.npy            shape (N, 64, 98)
└── extract_report.json    kept / rejected videos with reasons
```

---

## Training – `train.py`

```
py train.py
```

Reads features from the **newest** id (or `FEATURES_ID` set at the top of the script).

### Model architecture

- **BiLSTM** with attention pooling.
- Hidden size 128, 2 layers, dropout 0.3.
- **LayerNorm** on LSTM outputs before the attention pooling.
- Hand flags taken from the two flag columns.

### Training recipe

| Parameter | Value |
|-----------|-------|
| Optimiser | AdamW |
| Learning rate | 2 × 10⁻³ |
| Weight decay | 1 × 10⁻² |
| Batch size | 32 |
| Max epochs | 15 |
| Label smoothing | 0.1 |
| LR schedule | One-cycle |
| Gradient clipping | max norm 1.0 |
| Early stop | 10 epochs without improvement |
| Best checkpoint | saved on validation accuracy |

### Stability

- LayerNorm + gradient clipping keep early losses from diverging.
- Best checkpoint is saved each time validation accuracy improves; the best epoch is what gets exported.
- Early stopping prevents overfitting once validation plateaus.

### Data split

- 20 % of each gloss's videos held out for validation (minimum 2).
- Split is **by video**, not by frame.

### Augmentation (adapted to the 98-feature layout)

4 augmented copies per training video, applied only to the numeric groups
(flags and duration are never touched):

- **Gaussian noise** σ = 0.01 on position numbers.
- **Temporal crop / speed** – trim 0–10 % of frames from either span end before
  the 64-frame resampling, simulating faster/slower signing.
- **In-plane rotation** – rotate all shoulder-box x,y vectors by ±8°.
- **Scale jitter** – multiply position numbers by 0.95–1.05 (camera distance).

### Evaluation

On the held-out validation split:

- **Confusion matrix** (classes × classes).
- **Per-class precision, recall, F1-score** plus macro averages.
- Written into `daily_report.json`; confusion matrix also saved as
  `confusion_matrix.json` in the model folder.

### ONNX verification

After export, the same held-out sequences are run through **PyTorch and ONNX**:

- Max absolute logit difference is computed.
- Export is accepted only if max diff < 1 × 10⁻³; the value is recorded in
  `daily_report.json`. A failed check aborts the run before deployment.

### Output

```
models/onnx_models/<id>/
├── sign_daily_lstm.onnx        input (batch, 64, 98) → logits
├── sign_daily_classes.json     gloss names in output order
├── daily_report.json           best val acc, per-class P/R/F1, ONNX max diff, features id
├── confusion_matrix.json       validation confusion matrix
└── avatar/                     (written next by avatar_extract.py)
```

---

## Avatar extraction – `avatar_extract.py`

```
py avatar_extract.py
```

Runs **after** `train.py` and writes into the **same** model folder.

- Picks **one** video per gloss – the one with the highest share of complete frames in its span (ties → first in sorted order).
- Keeps **every** complete frame of the span with its timestamp. No resampling.

```
models/onnx_models/<id>/avatar/<GLOSS>/
├── pose.npy     (F, 8, 4)   x, y, z, visibility
├── hands.npy    (F, 42, 3)  left 21 + right 21
├── face.npy     (F, 19, 3)  float16
├── t.npy        (F,)        seconds
└── meta.json    source video, frame rate
```

---

## Live detection – `test_model.py`

```
py test_model.py
```

1. Webcam frames → MediaPipe Holistic.
2. Sign-span state machine (IDLE → SIGN → end) detects start / end of a sign automatically.
3. At span end, 64 frames are selected and 98 features computed (same code as training).
4. If a position cannot be filled → **"Hands not clear, try again"**.
5. Model returns class probabilities → top 3 shown.
6. If top probability < 0.5 **or** gap to second < 0.15 → **"Not sure"**.

### Live controls

| Key | Action |
|-----|--------|
| SPACE | Start / stop manual recording |
| M | Toggle auto ↔ manual mode |
| Q / ESC | Quit |

### On-screen feedback

- **Detection status** – idle / recording / deciding / result.
- **Recording timer** – seconds since the span started.
- **Inference latency** – ms per prediction.
- **Webcam FPS** – live frame rate.

### Runtime robustness

- **Camera failure** – clear on-screen / console error and clean exit.
- **Missing model files** – startup check lists exactly which file is absent.
- **Invalid metadata / class json** – refuse to start with an explanatory message.
- **Incomplete clips** – "Hands not clear, try again", never a crash.
- **Clean shutdown** – MediaPipe and the camera are closed on every exit path
  (Q/ESC, window close, or error).

---

## Run order

```bash
py extract.py
py train.py
py avatar_extract.py
py test_model.py
```

---


## Final directory layout

```
model_training_zone/
├── dataset/Indian Sign Language_Dataset/ISL_VIDEO/
│   ├── hello/
│   │   ├── video1.mp4
│   │   └── video2.mp4
│   ├── thanks/
│   │   └── video1.mp4
│   └── …
│
├── dataset_train/features/
│   └── <features_id>/
│       ├── <GLOSS>.npy
│       └── extract_report.json
│
models/onnx_models/
└── <model_id>/
    ├── sign_daily_lstm.onnx
    ├── sign_daily_classes.json
    ├── daily_report.json
    ├── confusion_matrix.json
    └── avatar/
        └── <GLOSS>/
            ├── pose.npy
            ├── hands.npy
            ├── face.npy
            ├── t.npy
            └── meta.json
```
```

---

# FILE: `start.ps1`

```powershell
$root = $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$requirements = Join-Path $root "requirements.txt"
$envFile = Join-Path $root ".env"
$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw "Python environment missing. Run: py -3.11 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}
if (-not (Test-Path -LiteralPath $requirements -PathType Leaf)) {
    throw "requirements.txt not found: $requirements"
}
if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
    throw ".env file not found at project root. Create it from the template."
}

$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) { $envVars[$parts[0].Trim()] = $parts[1].Trim() }
    }
}
foreach ($name in $envVars.Keys) {
    [Environment]::SetEnvironmentVariable($name, $envVars[$name], "Process")
}

$aiMode = $envVars["AI_MODE"]
if (-not $aiMode) { throw "AI_MODE not set in .env." }
if ($aiMode -ne "online" -and $aiMode -ne "offline") { throw "Invalid AI_MODE '$aiMode'." }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WBSL BRIDGE - STARTUP" -ForegroundColor Cyan
Write-Host " AI Mode: $aiMode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

$backendListeners = @(Get-NetTCPConnection -State Listen -LocalPort $backendPort -ErrorAction SilentlyContinue)
$backendAlreadyRunning = $false
foreach ($listener in $backendListeners) {
    $listenerProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction Stop
    if ($listenerProcess.CommandLine -match 'backend\.main:app') { $backendAlreadyRunning = $true; continue }
    throw "Port $backendPort in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId))."
}

if ($aiMode -eq "offline") {
    $offlineModel = $envVars["AI_OFFLINE_MODEL_NAME"]
    if (-not $offlineModel) { throw "AI_OFFLINE_MODEL_NAME not set in .env" }
    $modelPath = Join-Path $root "models\llm\$offlineModel"
    if (-not (Test-Path -LiteralPath $modelPath -PathType Leaf)) {
        Write-Host "WARNING: Offline model not found at $modelPath" -ForegroundColor Yellow
    }
    $aiScriptContent = @'
Set-Location '__ROOT__'
$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
$model = '__MODEL_PATH__'
$args = @('--model', $model, '--port', '5001', '--jinja', '--jinjathink', 'false', '--threads', '8', '--contextsize', '4096')
Write-Host "Starting KoboldCpp (offline) with: __MODEL_NAME__" -ForegroundColor Green
& $kobold @args
'@
    $aiScriptContent = $aiScriptContent.Replace('__ROOT__', $root).Replace('__MODEL_PATH__', $modelPath).Replace('__MODEL_NAME__', $offlineModel)
    Set-Content -Path $aiScript -Value $aiScriptContent -Encoding UTF8
} else {
    $onlineModel = $envVars["AI_ONLINE_MODEL_NAME"]
    $aiScriptContent = @'
Set-Location '__ROOT__'
Write-Host "Online mode - using OpenRouter API" -ForegroundColor Green
Write-Host "Model: __MODEL_NAME__" -ForegroundColor Yellow
Write-Host "No local AI server needed. Press Ctrl+C to close."
while ($true) { Start-Sleep -Seconds 60 }
'@
    $aiScriptContent = $aiScriptContent.Replace('__ROOT__', $root).Replace('__MODEL_NAME__', $onlineModel)
    Set-Content -Path $aiScript -Value $aiScriptContent -Encoding UTF8
}

$backendScriptContent = @'
Set-Location '__ROOT__'
& '__PYTHON__' -m uvicorn backend.main:app --reload --port __BACKEND_PORT__
'@
$backendScriptContent = $backendScriptContent.Replace('__ROOT__', $root).Replace('__PYTHON__', $python).Replace('__BACKEND_PORT__', [string]$backendPort)
Set-Content -Path $backendScript -Value $backendScriptContent -Encoding UTF8

$frontendScriptContent = @'
Set-Location '__FRONTEND__'
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm run dev
'@
$frontendScriptContent = $frontendScriptContent.Replace('__FRONTEND__', (Join-Path $root 'frontend'))
Set-Content -Path $frontendScript -Value $frontendScriptContent -Encoding UTF8

$wtArgs = @("-w", "0")
$tabs = [System.Collections.Generic.List[object]]::new()

if ($backendAlreadyRunning) {
    Write-Host "Backend already listening on port $backendPort; reusing it." -ForegroundColor Green
} else {
    $tabs.Add(@{ Title = "Backend"; Directory = $root; Script = $backendScript })
}
$tabs.Add(@{ Title = "AI Server ($aiMode)"; Directory = $root; Script = $aiScript })
$tabs.Add(@{ Title = "Frontend"; Directory = "$root\frontend"; Script = $frontendScript })

for ($i = 0; $i -lt $tabs.Count; $i++) {
    if ($i -gt 0) { $wtArgs += ";" }
    $tab = $tabs[$i]
    $wtArgs += @("new-tab", "--title", $tab.Title, "-d", $tab.Directory, "powershell", "-NoExit", "-File", $tab.Script)
}
& wt.exe @wtArgs
```

---

