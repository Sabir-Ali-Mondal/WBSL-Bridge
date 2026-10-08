"""
backend/nmm.py
Enhanced Non-Manual Markers (NMM) and Affect/Emotion Detection.
- 5 geometry markers: eyebrow raise (question), eyebrow furrow (wh_question),
  head shake (negation), head nod (affirmation), mouth open (emphasis).
- Facial Affect / Emotion recognition using ViT (Vision Transformer) ONNX model:
  happy, sad, angry, fear, surprise, disgust, neutral.
- Real-time configurable sensitivity thresholds with defaults calibrated to eliminate false triggers.
- Per-marker ENABLE gates: a marker can be switched off entirely, which is not
  the same as pushing its threshold out of reach. See NMM_MARKER_GATES below.
"""

from collections import deque
from pathlib import Path
import cv2
import mediapipe as mp
import numpy as np
import onnxruntime as ort

# Initialize MediaPipe FaceMesh ONCE
_face_mesh = mp.solutions.face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

# Initialize ViT Emotion Model ONCE
ROOT = Path(__file__).resolve().parent.parent
VIT_PATH = ROOT / "models" / "emotion" / "vit_emotion.onnx"
_vit_session = None
_vit_input_name = None

if VIT_PATH.exists():
    try:
        _vit_session = ort.InferenceSession(str(VIT_PATH), providers=["CPUExecutionProvider"])
        _vit_input_name = _vit_session.get_inputs()[0].name
    except Exception as exc:
        print(f"[NMM] Notice: Could not load ViT emotion model: {exc}")

EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
NORM_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
NORM_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

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
FACE_TOP = 10
FACE_BOTTOM = 152

# Default calibrated thresholds (raised to prevent wild false positives)
DEFAULT_CONFIG = {
    "brow_raise_thresh": 0.082,      # Raised from 0.060 (stops false questions during natural speech/expression)
    "brow_furrow_thresh": 0.032,     # Lowered from 0.040 (requires genuine furrow for WH-question)
    "mouth_thresh": 0.055,           # Raised from 0.040 (stops casual talking triggering emphasis)
    "head_shake_var_thresh": 0.0018, # Raised from 0.0008 (requires deliberate head shake for negation)
    "head_nod_var_thresh": 0.0018,   # Raised from 0.0008 (requires deliberate nod for affirmation)
    "emotion_min_confidence": 0.35,  # Minimum confidence to accept a non-neutral emotion
    "emotion_sensitivity": 1.0,      # Multiplier on emotion logits
}

# Per-marker master switches.
#
# The threshold sliders are a *sensitivity* control -- they decide how much of an
# expression counts as a marker. That is the wrong tool for turning a marker off.
# Pushing brow_raise_thresh to its maximum does not disable the question marker;
# it only raises the bar until it fires rarely, and it silently also changes the
# value an operator would return to when they want the marker back.
#
# These gates are the on/off switch. Negation and the two question markers ship
# OFF because a head shake and a brow raise are things every speaker does while
# thinking or mid-sentence, so leaving them on fills the gloss string with
# [negation] and [?] that the signer never intended. Affirmation and emphasis
# are deliberately cheap to re-enable and are on by default.
DEFAULT_MARKER_GATES = {
    "negation": False,
    "question": False,
    "wh_question": False,
    "affirmation": True,
    "emphasis": True,
}

# Runtime active gates, keyed by marker flag name in detect_nmm()'s output.
MARKER_GATES = dict(DEFAULT_MARKER_GATES)

# The five flags a gate can act on. "emotion" and "metrics" are outputs of
# detection, not markers, and must never be gated -- the UI reads metrics to draw
# its live readout even when the corresponding marker is switched off.
GATEABLE_MARKERS = tuple(DEFAULT_MARKER_GATES.keys())

# Runtime active config
CONFIG = dict(DEFAULT_CONFIG)

WINDOW = 15
_nose_x_history = deque(maxlen=WINDOW)
_nose_y_history = deque(maxlen=WINDOW)
_last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
_frame_counter = 0


def update_nmm_thresholds(new_thresholds: dict):
    """Allows UI threshold controller to update sensitivity on the fly."""
    for k, v in new_thresholds.items():
        if k in CONFIG and isinstance(v, (int, float)):
            CONFIG[k] = float(v)
    return CONFIG


def update_marker_gates(new_gates: dict):
    """Enable or disable individual markers.

    Only the five gateable marker names are accepted, and only real booleans.
    A string like ``"false"`` is rejected rather than coerced: truthy coercion
    would read it as ON, which is the opposite of what was asked for and would
    look like the switch was broken.
    """
    for k, v in new_gates.items():
        if k in MARKER_GATES and isinstance(v, bool):
            MARKER_GATES[k] = v
    return dict(MARKER_GATES)


def get_nmm_config() -> dict:
    """Thresholds plus gates.

    Returned together because the UI edits them in one panel and posts them to
    one endpoint; splitting them across two endpoints would let the panel and the
    detector disagree about which marker is on.
    """
    return {**CONFIG, "marker_gates": dict(MARKER_GATES),
            "default_marker_gates": dict(DEFAULT_MARKER_GATES)}


def _get_point(landmarks, idx, w, h):
    lm = landmarks.landmark[idx]
    return np.array([lm.x * w, lm.y * h])


def _dist(p1, p2):
    return np.linalg.norm(p1 - p2)


def predict_emotion(face_bgr: np.ndarray) -> dict:
    """Predict emotion from face crop using ViT. Returns dict with dominant, confidence, scores."""
    if _vit_session is None or face_bgr is None or face_bgr.size == 0:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}

    try:
        img = cv2.resize(face_bgr, (224, 224))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0
        img = (img - NORM_MEAN) / NORM_STD
        img = np.transpose(img, (2, 0, 1))
        img = np.expand_dims(img, axis=0)

        outputs = _vit_session.run(None, {_vit_input_name: img})
        logits = outputs[0][0] * CONFIG.get("emotion_sensitivity", 1.0)
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / exp_logits.sum()

        scores = {EMOTION_LABELS[i]: round(float(probs[i]), 3) for i in range(len(EMOTION_LABELS))}
        idx = int(np.argmax(probs))
        dom = EMOTION_LABELS[idx]
        conf = float(probs[idx])

        # If highest confidence is below minimum, fall back to neutral
        min_conf = CONFIG.get("emotion_min_confidence", 0.35)
        if dom != "neutral" and conf < min_conf:
            dom = "neutral"

        return {"dominant": dom, "confidence": round(conf, 3), "scores": scores}
    except Exception:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}


def detect_nmm(frame_bgr: np.ndarray, custom_thresholds: dict | None = None) -> dict:
    """
    Detect geometry-based NMMs and affect/emotions from a single BGR frame.
    """
    global _frame_counter, _last_emotion

    cfg = dict(CONFIG)
    if custom_thresholds:
        cfg.update(custom_thresholds)

    h, w, _ = frame_bgr.shape
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _face_mesh.process(rgb)

    flags = {
        "question": False,
        "wh_question": False,
        "negation": False,
        "affirmation": False,
        "emphasis": False,
        "emotion": _last_emotion,
        "metrics": {
            "brow_ratio": 0.0,
            "mouth_ratio": 0.0,
            "shake_var": 0.0,
            "nod_var": 0.0,
        }
    }

    if not results.multi_face_landmarks:
        _last_emotion = {
            "dominant": "neutral",
            "confidence": 1.0,
            "scores": {"neutral": 1.0},
        }
        flags["emotion"] = _last_emotion
        return flags

    lm = results.multi_face_landmarks[0]
    p_left = _get_point(lm, FACE_LEFT, w, h)
    p_right = _get_point(lm, FACE_RIGHT, w, h)
    fw = _dist(p_left, p_right)
    if fw <= 0:
        fw = 1.0

    # Eyebrow Raise / Furrow
    lb = np.mean([_get_point(lm, i, w, h) for i in LEFT_EYEBROW], axis=0)
    rb = np.mean([_get_point(lm, i, w, h) for i in RIGHT_EYEBROW], axis=0)
    le = (_get_point(lm, LEFT_EYE_TOP, w, h) + _get_point(lm, LEFT_EYE_BOTTOM, w, h)) / 2.0
    re = (_get_point(lm, RIGHT_EYE_TOP, w, h) + _get_point(lm, RIGHT_EYE_BOTTOM, w, h)) / 2.0
    brow_ratio = float((_dist(lb, le) + _dist(rb, re)) / (2.0 * fw))

    flags["metrics"]["brow_ratio"] = round(brow_ratio, 4)

    if brow_ratio > cfg["brow_raise_thresh"]:
        flags["question"] = True
    elif brow_ratio < cfg["brow_furrow_thresh"]:
        flags["wh_question"] = True

    # Head Shake / Nod (temporal variance)
    nose = _get_point(lm, NOSE_TIP, w, h)
    _nose_x_history.append(nose[0] / fw)
    _nose_y_history.append(nose[1] / fw)

    shake_var = 0.0
    nod_var = 0.0
    if len(_nose_x_history) == WINDOW:
        shake_var = float(np.var(list(_nose_x_history)))
        flags["metrics"]["shake_var"] = round(shake_var, 6)
        if shake_var > cfg["head_shake_var_thresh"]:
            flags["negation"] = True

    if len(_nose_y_history) == WINDOW:
        nod_var = float(np.var(list(_nose_y_history)))
        flags["metrics"]["nod_var"] = round(nod_var, 6)
        if nod_var > cfg["head_nod_var_thresh"]:
            flags["affirmation"] = True

    # Mouth Open
    mouth_ratio = float(_dist(_get_point(lm, UPPER_LIP, w, h), _get_point(lm, LOWER_LIP, w, h)) / fw)
    flags["metrics"]["mouth_ratio"] = round(mouth_ratio, 4)
    if mouth_ratio > cfg["mouth_thresh"]:
        flags["emphasis"] = True

    # Run Emotion ViT on cropped face every 4th frame
    _frame_counter += 1
    if _frame_counter % 4 == 0 or _last_emotion.get("dominant") == "neutral":
        try:
            p_top = _get_point(lm, FACE_TOP, w, h)
            p_bottom = _get_point(lm, FACE_BOTTOM, w, h)
            min_x = max(0, int(min(p_left[0], p_right[0]) - 0.1 * fw))
            max_x = min(w, int(max(p_left[0], p_right[0]) + 0.1 * fw))
            min_y = max(0, int(p_top[1] - 0.15 * fw))
            max_y = min(h, int(p_bottom[1] + 0.1 * fw))

            if max_x > min_x and max_y > min_y:
                face_crop = frame_bgr[min_y:max_y, min_x:max_x]
                _last_emotion = predict_emotion(face_crop)
        except Exception:
            pass

    # Apply the master gates LAST, after every flag has been computed.
    #
    # This ordering is the point: the gates must not be able to change the
    # detection itself. Doing it earlier (skipping the brow measurement when
    # question is off, say) would also blank brow_ratio in metrics, and the
    # panel's live readout would go dead for a marker the operator had merely
    # switched off. Gating the output leaves the measurement intact and only
    # stops the flag reaching the LLM.
    for _marker, _enabled in MARKER_GATES.items():
        if not _enabled:
            flags[_marker] = False

    flags["emotion"] = _last_emotion
    return flags


def reset_nmm_state():
    """Clear temporal history."""
    global _last_emotion
    _nose_x_history.clear()
    _nose_y_history.clear()
    _last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}


def emotion_available() -> bool:
    """False when the local ViT model is not installed; the UI can then say
    affect is offline instead of showing a permanently neutral panel."""
    return _vit_session is not None
