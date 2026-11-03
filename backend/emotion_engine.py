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
