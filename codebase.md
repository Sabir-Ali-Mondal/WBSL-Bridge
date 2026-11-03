# WBSL Bridge — AI Codebase Context

> Compact project architecture followed by relevant source and configuration files.

**Included files:** `78`  
**Maximum source file size:** `2 MB`

---

# Project Structure

```text
WBSL Bridge
├── backend
│   ├── __init__.py
│   ├── extract.py
│   ├── llm_engine.py
│   ├── main.py
│   ├── nmm.py
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
│   │   │   │   ├── videos
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── contribute
│   │   │   │   ├── session
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
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
│   │   │   │   └── PipelineStatus.tsx
│   │   │   ├── recording
│   │   │   │   ├── PrivacyGate.tsx
│   │   │   │   └── UploadRecovery.tsx
│   │   │   ├── sign
│   │   │   │   ├── EmotionPanel.tsx
│   │   │   │   └── NmmThresholdPanel.tsx
│   │   │   ├── simulation
│   │   │   │   ├── AlpanaStage.tsx
│   │   │   │   ├── ContinuousSignSimulation.tsx
│   │   │   │   ├── DhutiRig.tsx
│   │   │   │   ├── LandmarkSimulation.tsx
│   │   │   │   └── simulationConstants.ts
│   │   │   ├── verification
│   │   │   │   └── EvidencePanel.tsx
│   │   │   └── skeletons.tsx
│   │   ├── hooks
│   │   │   ├── useCamera.ts
│   │   │   ├── useRecording.ts
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
│   │   │   ├── contributions.ts
│   │   │   ├── dataset.ts
│   │   │   ├── nlg.ts
│   │   │   └── stats.ts
│   │   └── store
│   │       └── recording-store.ts
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
├── Screenshot 2026-10-15 183557.png
└── start.ps1
```

---

# Included Files

- `backend\__init__.py`
- `backend\extract.py`
- `backend\llm_engine.py`
- `backend\main.py`
- `backend\nmm.py`
- `backend\pose.py`
- `backend\streaming.py`
- `backend\stt_engine.py`
- `backend\tts_engine.py`
- `frontend\AGENTS.md`
- `frontend\CLAUDE.md`
- `frontend\eslint.config.mjs`
- `frontend\next-env.d.ts`
- `frontend\next.config.ts`
- `frontend\package-lock.json`
- `frontend\package.json`
- `frontend\postcss.config.ts`
- `frontend\src\app\about\page.tsx`
- `frontend\src\app\admin\contributions\page.tsx`
- `frontend\src\app\admin\layout.tsx`
- `frontend\src\app\admin\models\page.tsx`
- `frontend\src\app\admin\page.tsx`
- `frontend\src\app\admin\settings\page.tsx`
- `frontend\src\app\admin\videos\page.tsx`
- `frontend\src\app\contribute\page.tsx`
- `frontend\src\app\contribute\session\[id]\page.tsx`
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
- `frontend\src\components\pipeline\PipelineStatus.tsx`
- `frontend\src\components\recording\PrivacyGate.tsx`
- `frontend\src\components\recording\UploadRecovery.tsx`
- `frontend\src\components\sign\EmotionPanel.tsx`
- `frontend\src\components\sign\NmmThresholdPanel.tsx`
- `frontend\src\components\simulation\AlpanaStage.tsx`
- `frontend\src\components\simulation\ContinuousSignSimulation.tsx`
- `frontend\src\components\simulation\DhutiRig.tsx`
- `frontend\src\components\simulation\LandmarkSimulation.tsx`
- `frontend\src\components\simulation\simulationConstants.ts`
- `frontend\src\components\skeletons.tsx`
- `frontend\src\components\verification\EvidencePanel.tsx`
- `frontend\src\hooks\useCamera.ts`
- `frontend\src\hooks\useRecording.ts`
- `frontend\src\hooks\useSystemStatus.ts`
- `frontend\src\lib\constants.ts`
- `frontend\src\lib\pose.ts`
- `frontend\src\lib\threeSetup.ts`
- `frontend\src\lib\types.ts`
- `frontend\src\lib\utils.ts`
- `frontend\src\services\api.ts`
- `frontend\src\services\auth.ts`
- `frontend\src\services\contributions.ts`
- `frontend\src\services\dataset.ts`
- `frontend\src\services\nlg.ts`
- `frontend\src\services\stats.ts`
- `frontend\src\store\recording-store.ts`
- `frontend\tailwind.config.ts`
- `frontend\tsconfig.json`
- `model_training_zone\avatar_extract.py`
- `model_training_zone\extract.py`
- `model_training_zone\guide.md`
- `model_training_zone\test_model.py`
- `model_training_zone\train.py`
- `model_training_zone\training-method\training_method.md`
- `models\active_model.json`
- `start.ps1`

---

# Source Files

# FILE: `backend\__init__.py`

```python

```

---

# FILE: `backend\extract.py`

```python
"""
backend/extract.py
Reuses the exact extract_two_hands() from phase2a_all_in_one.py.
DO NOT change normalization logic — it is tested and verified.

Consistency rules (from MVT 2A Section 8):
1. Never flip the frame BEFORE MediaPipe processing.
2. Use identical extract_two_hands() in all stages.
3. Always use right-wrist-preferred reference and same scale normalization.
4. Keep handedness slotting identical (Left block first, Right block second).

Two feature contracts are served here, and the layer that trains an artefact
must use the same one the serving layer will use:

    HANDS_DIM = 126   two hands (2 x 21 x 3), right-wrist reference
    HOLISTIC_DIM = 258  HANDS_DIM + pose (33 x 4 incl. visibility)

The 258-dim vector is what ``train_daily6.py`` learns for the daily-conversation
LSTM: it is never re-scaled on the way in, so the graph's declared input width
tells the registry which extractor to feed it. Running the MediaPipe Pose graph
costs real time per frame, so it is built lazily -- a project that only ever
serves 126-dim models never pays for it.
"""

import contextlib
import ctypes
import os
import sys
import time
import logging

os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
logging.getLogger("absl").setLevel(logging.ERROR)


@contextlib.contextmanager
def _suppress_c_stderr():
    """
    Temporarily redirect native C runtime stderr to NUL during MediaPipe graph initialization.
    Silences unpreventable C++ logs from TensorFlow Lite delegate creation and Abseil
    inference feedback manager without affecting Python loggers or normal terminal output.
    """
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


import numpy as np
import mediapipe as mp

from backend.pose import POSE_DIM, pose_from_landmarks

HANDS_DIM = 126
# 126 hands + 132 pose. The pose half is defined in backend/pose.py so the
# trainer and the server cannot drift apart on what the pose block contains.
HOLISTIC_DIM = HANDS_DIM + POSE_DIM

# Initialize ONCE at module load (not per request)
with _suppress_c_stderr():
    _hands = mp.solutions.hands.Hands(
        max_num_hands=2,
        min_detection_confidence=0.6,
    )

# Built on first use only (see module docstring).
_holistic = None


def _get_holistic():
    """Lazily build the Holistic graph that supplies the pose half of a 258-vector.

    ``static_image_mode=False`` and the same 0.5 detection confidence as
    ``train_daily6.py`` keep inference identical to training.
    """
    global _holistic
    if _holistic is None:
        with _suppress_c_stderr():
            _holistic = mp.solutions.holistic.Holistic(
                static_image_mode=False,
                min_detection_confidence=0.5,
            )
    return _holistic


def extract_two_hands(res) -> np.ndarray | None:
    """
    Identical logic to phase2a_all_in_one.py extract_two_hands().
    Right-wrist-preferred reference. Left block first, Right block second.
    Returns 126-dim float32 vector or None if no hands detected.
    """
    if not res.multi_hand_landmarks:
        return None

    left = None
    right = None

    for hlm, handedness in zip(res.multi_hand_landmarks, res.multi_handedness):
        label = handedness.classification[0].label
        pts = np.array(
            [[p.x, p.y, p.z] for p in hlm.landmark],
            dtype=np.float32
        )
        if label == "Left" and left is None:
            left = pts
        elif label == "Right" and right is None:
            right = pts

    ref_hand = right if right is not None else left
    if ref_hand is None:
        return None

    ref = ref_hand[0]
    scale = np.linalg.norm(ref_hand[9] - ref_hand[0]) + 1e-6

    out_left = (left - ref) / scale if left is not None else np.zeros((21, 3), np.float32)
    out_right = (right - ref) / scale if right is not None else np.zeros((21, 3), np.float32)

    return np.concatenate([out_left.flatten(), out_right.flatten()])


def extract_holistic_frame(frame_bgr: np.ndarray) -> np.ndarray | None:
    """Hands (2x21x3) + pose (33x4) in the right-wrist frame -> (258,) float32.

    Byte-for-byte the same geometry as ``train_daily6.extract_frame_vector``, so
the daily-conversation LSTM sees at serving time what it saw while training.

    Returns ``None`` unless BOTH hands and the pose are present: the pose block
    is 132 of the 258 columns, and a zero-filled half would shift every column
    the network learned. A miss is therefore reported as a miss and the caller
    carries the previous vector forward, exactly as extraction does.
    """
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    res = _get_holistic().process(rgb)
    if (not res.left_hand_landmarks or not res.right_hand_landmarks
            or res.pose_landmarks is None):
        return None
    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    pose = pose_from_landmarks(res.pose_landmarks)
    ref = rh[0]
    scale = np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh = (lh - ref) / scale
    rh = (rh - ref) / scale
    pose[:, :3] = (pose[:, :3] - ref) / scale
    return np.concatenate([lh.flatten(), rh.flatten(), pose.flatten()]).astype(np.float32)


def process_bgr_frame(
    frame_bgr: np.ndarray,
    width: int = HANDS_DIM,
) -> np.ndarray | None:
    """
    Takes a BGR numpy frame (from cv2.imdecode),
    returns a ``width``-dim landmark vector or None.

    ``width`` is the feature contract the target graph declares: 126 for the
two-hand vector, 258 for the holistic one. Any other value is a bug in the
caller, so it fails loudly rather than feeding a wrongly-shaped tensor.
    """
    import cv2
    if width == HOLISTIC_DIM:
        # Holistic already runs the hand sub-model internally; running Hands as
        # well would double the per-frame cost for the same answer.
        return extract_holistic_frame(frame_bgr)
    if width != HANDS_DIM:
        raise ValueError(
            f"No feature extractor emits {width}-dim vectors "
            f"(supported: {HANDS_DIM} two-hand landmarks, "
            f"{HOLISTIC_DIM} hands+pose holistic)."
        )
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _hands.process(rgb)
    return extract_two_hands(results)


def process_bgr_frames(frames_bgr: list) -> list:
    """Vectorised batch form of :func:`process_bgr_frame`.

    Live sign detection walks a sliding window of ~32 frames every tick, so
    this exists to keep the per-frame bookkeeping in one place and to state
    plainly what a window costs: one MediaPipe call per frame. The Hands graph
    is built with ``max_num_hands=2`` and no face or pose sub-model, so it is the
    cheapest graph available -- but it is still one call per frame.

    Only the 126-dim contract is served here: it is the cheaper graph (no pose
    sub-model). A 258-dim target goes through ``process_bgr_frame``, whose
    Holistic graph adds the pose half the daily LSTM was trained on.

    Neither path is genuinely batched. The graph rejects a list outright, and
    passing one as ``image`` raises ``'list' object has no attribute 'shape'``:
    the MediaPipe Python binding exposes no per-frame fan-out it will walk for us,
    so a window costs one call per frame whichever contract is in use.

    Frames are returned in order, one entry each, ``None`` where no hand was
    found. The caller decides how to fill those gaps; this function deliberately
    does not carry a previous vector forward, so that a gap is still visible as
    \"the signer's hands left the frame\" rather than being papered over.
    """
    import cv2

    if not frames_bgr:
        return []
    rgb_imgs = [cv2.cvtColor(f, cv2.COLOR_BGR2RGB) for f in frames_bgr]
    return [extract_two_hands(_hands.process(img)) for img in rgb_imgs]
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

DEFAULT_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL_NAME = "gpt-4o-mini"

_KEYLESS_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "::1")


def _env_bool(name: str, default: bool) -> bool:
    raw = (os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def get_ai_config() -> dict:
    configured_url = _env("AI_BASE_URL")
    base_url = configured_url or DEFAULT_BASE_URL
    is_local = any(h in base_url for h in _KEYLESS_HOSTS)

    api_key = _env("AI_API_KEY")
    if not api_key:
        api_key = "no-key-required" if is_local else ""

    return {
        "base_url": base_url.rstrip("/"),
        "api_key": api_key,
        "model": _env("AI_MODEL_NAME", DEFAULT_MODEL_NAME),
        "is_local": is_local,
        "provider": "local" if is_local else "cloud",
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

    nmm = meta.get("nmm") or {}
    if isinstance(nmm, dict):
        if nmm.get("negation"):
            lines.append("- NEGATION: head shake detected. The signer negated it.")
        if nmm.get("affirmation"):
            lines.append("- AFFIRMATION: deliberate head nod detected.")
        if nmm.get("wh_question"):
            lines.append("- WH-QUESTION: brow furrow detected. Marked tokens are WH-questions.")
        if nmm.get("question"):
            lines.append(
                "- POLAR QUESTION: eyebrow raise detected. Marked tokens are yes/no questions."
            )
        if nmm.get("emphasis"):
            lines.append("- EMPHASIS: mouth opening detected on the marked token(s).")

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

    if not lines and gloss_with_affect == gloss_text:
        return gloss_text

    return (
        "SIGN METADATA (detected non-manual markers and affect):\n"
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
        "endpoint": cfg["base_url"],
        "tokens_used": 0,
    }
    result.update(extra)
    return result


def _offline_result(status: str, error: str, tokens: int = 0) -> dict:
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
        yield _offline_result(
            "llm_not_configured",
            "No AI provider configured. Set AI_API_KEY (and AI_BASE_URL / "
            "AI_MODEL_NAME) in .env -- see .env.example.",
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
        yield _offline_result(
            "timeout", "LLM generation timed out. Try a shorter gloss."
        ) | {"type": "error"}
    except Exception as e:
        yield _offline_result("error", str(e)) | {"type": "error"}


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
        return _offline_result(
            "llm_not_configured",
            "No AI provider configured. Set AI_API_KEY (and AI_BASE_URL / "
            "AI_MODEL_NAME) in .env -- see .env.example.",
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
        final = dict(final or _offline_result("error", "Empty stream"))
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
        return _offline_result(
            "timeout", "LLM generation timed out. Try a shorter gloss."
        )
    except Exception as e:
        return _offline_result("error", str(e))


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
Loads the active run from models/onnx_models/ via the registry, serves predictions,
NMM, TTS, NLG, model-bundled landmark simulations, and community ingestion
(uploaded video -> landmarks -> .npy + manifest).

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & ".venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8200
"""

import os
import sys
import logging

# Suppress noisy C++/native logging from TensorFlow Lite, MediaPipe, and Abseil
os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
logging.getLogger("absl").setLevel(logging.ERROR)

import difflib
import json
import re
import tempfile
import time
import unicodedata
import uuid
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
from pydantic import BaseModel

# Local imports
from backend.extract import process_bgr_frame, HANDS_DIM, HOLISTIC_DIM
from backend.nmm import detect_nmm, reset_nmm_state, emotion_available
from backend.streaming import get_session, last_vector
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
# ONNX Runtime refuses any graph input tensor above ``session.max_graph_input_size``
# (1 GiB by default). ``/api/predict/clip`` packs a whole T-frame clip into ONE
# tensor: 32 frames x 126 features x 4 bytes is only ~16 KB, so the clip route
# itself is fine -- but the limit is the kind that only trips on the biggest
# uploads, producing a 500 that reads as "the model detected nothing". Raise it
# once, centrally, so no route has to think about it. Declared here because the
# model registry below loads graphs at import time.
_ORT_OPTIONS = ort.SessionOptions()
_ORT_OPTIONS.add_session_config_entry(
    "session.max_graph_input_size", "4294967296")  # 4 GiB

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
RUNS_DIR = MODELS_DIR / "onnx_models"
MODEL_PATH = MODELS_DIR / "sign_mlp.onnx"          # legacy default (may not exist)
CLASSES_PATH = MODELS_DIR / "sign_classes.json"    # legacy default (may not exist)
TTS_DIR = ROOT / "backend" / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────
# COMMUNITY DATASET STORAGE (manifest + npy)
# ─────────────────────────────────────────────
DATASET_DIR = ROOT / "backend" / "data" / "community_dataset"
SAMPLES_DIR = DATASET_DIR / "samples"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST_PATH = DATASET_DIR / "manifest.jsonl"
TRAINING_DATA_DIR = ROOT / "model_training_zone" / "dataset"


def _load_manifest():
    items = []
    if MANIFEST_PATH.exists():
        for line in MANIFEST_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    items.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return items


def _write_manifest(items):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        for r in items:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


# ─────────────────────────────────────────────
# MODEL REGISTRY (auto-discovery + admin selection)
# ─────────────────────────────────────────────
# Every training run writes its artefacts into  models/onnx_models/<run>/
#   * temporal : LSTM / unified / video runs  -> artefact name says so
#   * static   : frame classifier, input width probed from the graph
#   * classes  : <name>_classes.json (sibling), else sign_classes.json
# Non-.onnx files (e.g. the .gguf LLM) are ignored. The newest run wins at
# startup. The admin panel can override the choice; the override is stored in
# models/active_model.json and survives restarts.
#
# Each model bundle includes replay sequences for the classes it can emit.
SEQ_T = 32
NON_SIGN_CLASSES = {"NONE", "BACKGROUND"}
# Feature widths the serving layer can actually feed. Both are produced by
# backend/extract.py; the graph's declared input width picks between them.
SERVABLE_WIDTHS = (HANDS_DIM, HOLISTIC_DIM)
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
            missing_sequences = [
                label for label in classes
                if label not in NON_SIGN_CLASSES
                and not (folder / "npy" / f"{label}.npy").is_file()
            ]
            if missing_sequences:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: missing bundled "
                    f"sequences for {', '.join(missing_sequences[:5])}"
                )
                continue
            # A static classifier is only usable if it takes a frame vector this
            # layer can produce (126 hands, or 258 hands+pose); temporal runs
            # ingest a (T, width) sequence. Both are probed, so a run with no
            # classes or an unloadable graph is dropped rather than silently
            # winning the "newest" race.
            #
            # The probe reads BOTH the rank and the middle axis. Width alone is
            # ambiguous: a static [N,126] and a temporal [N,32,126] both end in
            # 126, so a width-only check can never tell them apart (this was the
            # root cause of a temporal model silently failing on a single frame).
            name = onnx_file.stem
            input_width = None
            input_rank = None
            frames = 1
            try:
                probe = ort.InferenceSession(
                    str(onnx_file), providers=["CPUExecutionProvider"])
                shape = probe.get_inputs()[0].shape
                input_rank = len(shape)
                input_width = shape[-1] if isinstance(shape[-1], int) else None
                if input_rank >= 3 and isinstance(shape[-2], int):
                    frames = shape[-2]          # the declared clip length
            except Exception as exc:                   # noqa: BLE001
                print(f"[WBSL Backend] Skipping unloadable graph {onnx_file}: {exc}")
                continue
            invalid_sequence = None
            bundled_width = None
            for label in classes:
                if label in NON_SIGN_CLASSES:
                    continue
                sequence_path = folder / "npy" / f"{label}.npy"
                try:
                    sequence = np.load(sequence_path, mmap_mode="r", allow_pickle=False)
                except (OSError, ValueError) as exc:
                    invalid_sequence = f"{label}: {exc}"
                    break
                sequence_width = sequence.shape[-1] if sequence.ndim in (2, 3) else None
                if (
                    sequence_width not in SERVABLE_WIDTHS
                    or (input_width is not None and sequence_width != input_width)
                    or (bundled_width is not None and sequence_width != bundled_width)
                ):
                    invalid_sequence = (
                        f"{label} has shape {sequence.shape}; expected "
                        f"a 126- or 258-wide landmark sequence matching the graph"
                    )
                    break
                bundled_width = sequence_width
            if invalid_sequence:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: invalid bundled "
                    f"landmark sequence ({invalid_sequence})"
                )
                continue
            if input_width is None:
                input_width = bundled_width
            # The graph's own shape is the authority. The filename heuristic is
            # kept only as a tie-breaker for graphs whose sequence axis is
            # dynamic (rare here, but a run named *_lstm with a symbolic T is
            # still temporal, just unpinnable to a frame count).
            name_says_temporal = any(k in name for k in ("lstm", "unified", "video"))
            is_temporal = input_rank >= 3 or (input_rank == 2 and name_says_temporal)
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
                "temporal": is_temporal,
                "input_width": input_width,
                "input_rank": input_rank,
                "frames": frames,
                # The endpoint a request must hit for this graph to be usable.
                "endpoint": "/api/predict/clip" if is_temporal else "/api/predict/frame",
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


def _preferred_model(registry):
    """Resolve which discovered model to activate."""
    wanted = None
    if ACTIVE_MODEL_PATH.exists():
        try:
            wanted = json.loads(ACTIVE_MODEL_PATH.read_text(encoding="utf-8")).get("path")
        except Exception:
            wanted = None
    if wanted:
        for d in registry:
            if d["path"] == wanted:
                return d
        print(f"[WBSL Backend] Configured model missing, falling back to newest: {wanted}")
    # prefer the newest temporal model, else the newest of anything
    for d in registry:
        if d["temporal"]:
            return d
    return registry[0]


class ModelRegistry:
    """Holds the discovered artefacts and the currently loaded model.

    ``reload(path=None)`` rescans the folder and swaps the active graph in
    place, so the admin panel can switch models without restarting uvicorn."""

    def __init__(self):
        self.models = []
        self.active = None
        self.session = None           # static 126-landmark MLP
        self.input_name = None
        self.classes = []
        self.temporal_session = None  # unified LSTM (None for static models)
        self.temporal_input = None
        self.temporal_classes = []
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


def _active_width() -> int:
    """Feature width the active graph declares, defaulting to the two-hand vector.

    Every prediction route needs this before it can call an extractor: 126 and
    258 are different tensors, not the same tensor padded. Routing on the
    graph's own shape keeps the 126-dim MLP runs working unchanged while letting
    a 258-dim run (train_daily6) be fed what it was trained on.
    """
    width = (REGISTRY.active or {}).get("input_width")
    return width if width in SERVABLE_WIDTHS else HANDS_DIM


def _active_run_dir():
    """Return the bundle directory for the currently selected ONNX model."""
    active = REGISTRY.active
    if not active:
        return None
    return Path(active["path"]).parent


def _model_sequence_path(label: str):
    """Resolve a sequence only from the active model's bundled training data."""
    normalized = label.upper().replace(" ", "_")
    if normalized == "NONE" or normalized not in REGISTRY.active_classes:
        return None
    run_dir = _active_run_dir()
    if run_dir is None:
        return None
    path = run_dir / "npy" / f"{normalized}.npy"
    return path if path.is_file() else None


def _available_model_classes():
    """Vocabulary that the active model can both recognize and replay."""
    return [
        label for label in REGISTRY.active_classes
        if label not in NON_SIGN_CLASSES and _model_sequence_path(label) is not None
    ]


def resample_feature_width(seq: np.ndarray, width: int) -> np.ndarray:
    """Re-widen a stored landmark clip to the width the active graph expects.

    Community recordings store the 126-dim two-hand vector, so a 258-dim graph
    cannot be fed one as-is. Only the pose
    block (columns 126:258) is missing; the hand block and its normalization are
    already shared, so the pose columns are zero-padded rather than recomputed
    from video that is no longer on hand. The model then sees a sign performed
    with the body out of frame -- lossy, and deliberately so: the alternative is
    refusing to serve every stored clip once a holistic model is active.
    """
    if seq.shape[-1] == width:
        return seq
    if width == HOLISTIC_DIM and seq.shape[-1] == HANDS_DIM:
        pad = np.zeros((*seq.shape[:-1], HOLISTIC_DIM - HANDS_DIM), np.float32)
        return np.concatenate([seq.astype(np.float32), pad], axis=-1)
    if width == HANDS_DIM and seq.shape[-1] == HOLISTIC_DIM:
        return seq[..., :HANDS_DIM].astype(np.float32)
    raise ValueError(
        f"Stored clip is {seq.shape[-1]}-wide and cannot be served to a "
        f"{width}-wide graph."
    )

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────

# ─────────────────────────────────────────────
# IN-MEMORY STATE
# ─────────────────────────────────────────────
def _sample_counts_by_label():
    counts = {}
    for record in _load_manifest():
        label = record.get("label")
        if not label:
            continue
        status = record.get("verification")
        count_key = {
            "accepted": "approved_samples",
            "pending": "pending_samples",
            "needs_review": "pending_samples",
            "rejected": "rejected_samples",
        }.get(status)
        if count_key:
            totals = counts.setdefault(label, {
                "approved_samples": 0,
                "pending_samples": 0,
                "rejected_samples": 0,
            })
            totals[count_key] += 1
    return counts


def _refresh_catalog_sample_counts():
    counts = _sample_counts_by_label()
    for sign in sign_catalog:
        sign.update(counts.get(sign["label"], {
            "approved_samples": 0,
            "pending_samples": 0,
            "rejected_samples": 0,
        }))


def _build_catalog():
    sample_counts = _sample_counts_by_label()
    classes = _available_model_classes()
    catalog = [
        {
            "id": str(i),
            "label": c,
            "bengali_meaning": c.replace("_", " ").title(),
            "category": "Alphabet" if len(c) == 1 and c.isalpha() else "Word",
            "type": "word",
            "has_landmarks": True,
            **sample_counts.get(c, {
                "approved_samples": 0,
                "pending_samples": 0,
                "rejected_samples": 0,
            }),
            "language": "ISL",
        }
        for i, c in enumerate(classes)
    ]
    return catalog


def _coverage_summary():
    """Report classes bundled with replayable sequences for the active model."""
    available = set(_available_model_classes())
    recognized = [c for c in REGISTRY.active_classes if c not in NON_SIGN_CLASSES]
    return {
        "total_classes": len(recognized),
        "with_landmark_sequences": len(available),
        "missing_sequences": [c for c in recognized if c not in available],
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

# ─────────────────────────────────────────────
# NMM / AFFECT SENSITIVITY CONFIGURATION
# ─────────────────────────────────────────────
from backend.nmm import get_nmm_config, update_marker_gates, update_nmm_thresholds


@app.get("/api/nmm/config")
def get_nmm_settings():
    return get_nmm_config()


@app.post("/api/nmm/config")
def set_nmm_settings(payload: dict):
    """Update sensitivity thresholds and/or the per-marker enable gates.

    One endpoint for both because the panel edits them together and a single
    POST is what keeps the two in step. ``marker_gates`` is nested rather than
    flattened because a marker name like ``negation`` is both a gate and a flag
    in the detection output, and keeping the gates in their own object means a
    future non-boolean threshold can never collide with one.
    """
    gates = payload.pop("marker_gates", None)
    if isinstance(gates, dict):
        update_marker_gates(gates)
    if payload:
        update_nmm_thresholds(payload)
    return get_nmm_config()


def _check_model_available(path):
    """Guards against activating a graph the serving layer cannot feed.

    There are two servable contracts, and they are distinguished by RANK, not
    by width:

      * static   ``[N, 126]`` / ``[N, 258]``  fed by ``/api/predict/frame`` (one frame)
      * temporal ``[N, T, 126]`` / ``[N, T, 258]``  fed by ``/api/predict/clip``

    The two widths are the two feature extractors in ``backend/extract.py``:
    126 is the two-hand landmark vector, 258 adds the 33x4 pose block that
    ``train_daily6.py`` learns. Rank is what separates a frame classifier from a
    clip classifier -- width alone cannot, because both end in the same number.

    Returns an error string, or None when the model is safe to activate."""
    desc = next((m for m in REGISTRY.models if m["path"] == path), None)
    if desc is None:
        return f"Model not in registry: {path}"
    try:
        classes = json.loads(Path(desc["classes_path"]).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return f"Cannot read the class list for '{desc['name']}': {exc}"
    run_dir = Path(desc["path"]).parent
    missing_sequences = [
        label for label in classes
        if label not in NON_SIGN_CLASSES
        and not (run_dir / "npy" / f"{label}.npy").is_file()
    ]
    if missing_sequences:
        preview = ", ".join(missing_sequences[:5])
        suffix = "..." if len(missing_sequences) > 5 else ""
        return (
            f"'{desc['name']}' is missing bundled landmark sequences for "
            f"{preview}{suffix}. Re-train it with the current training pipeline."
        )
    # Both contracts are servable: the frame route handles rank 2, the clip
    # route handles rank 3. What is NOT servable is a graph whose last axis is
    # not one of the feature vectors this layer emits -- feed it anything else
    # and the run() raises a shape error the user reads as "detected nothing".
    if desc.get("input_width") in SERVABLE_WIDTHS:
        return None
    if desc.get("input_width") is None:
        return (
            f"'{desc['name']}' declares an open-ended final input axis, so its "
            f"feature width cannot be verified against the extractors this "
            f"backend serves. Re-export the graph with a fixed feature "
            f"dimension."
        )
    return (
        f"'{desc['name']}' expects {desc['input_width']}-wide inputs, but the "
        f"feature extractors in this project emit either a "
        f"{HANDS_DIM}-dim two-hand landmark vector or a {HOLISTIC_DIM}-dim "
        f"hands+pose holistic vector."
    )


@app.get("/api/system/health")
def health(response: Response):
    ai = get_ai_config()
    active = REGISTRY.active or {}
    # This probes the LLM provider, which is a deliberate round trip that costs
    # real time when the provider is absent. Every page fetches it on mount just
    # to learn which prediction route is valid, so let the browser reuse the
    # answer for a few seconds instead of re-probing on every navigation.
    response.headers["Cache-Control"] = "public, max-age=5"
    return {
        "api": True,
        "model": True,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": "LSTM-unified" if REGISTRY.temporal_session else "MLP-static",
        "unified": REGISTRY.temporal_session is not None,
        "active_classes": len(REGISTRY.active_classes),
        "vocabulary_classes": len(_available_model_classes()),
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_run": REGISTRY.active["run"] if REGISTRY.active else None,
        "model_path": REGISTRY.active_id(),
        "model_error": REGISTRY.error,
        # The contract, published so the UI knows which button to enable BEFORE
        # the user clicks. A temporal model needs a 32-frame clip; a static one
        # needs a single frame. Getting this wrong is what made the LSTM runs
        # look like they "detected nothing".
        "contract": {
            "kind": "temporal" if active.get("temporal") else "static",
            "input_rank": active.get("input_rank"),
            "frames": active.get("frames", 1),
            "feature_width": active.get("input_width"),
            # The extractor this width selects. Published for the same reason as
            # the endpoint: a 258-dim graph needs hands AND pose in frame, and a
            # client that knows that can tell the user to step back.
            "feature_kind": ("two_hand" if active.get("input_width") == HANDS_DIM
                             else "hands_pose" if active.get("input_width") == HOLISTIC_DIM
                             else None),
            "endpoint": active.get("endpoint", "/api/predict/frame"),
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


# ─────────────────────────────────────────────
# DATASET / SIGNS
# ─────────────────────────────────────────────
@app.get("/api/dataset/signs")
def get_signs(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    category: str = "",
    language: str = "",
):
    filtered = sign_catalog
    if search:
        q = search.lower()
        filtered = [
            s for s in filtered
            if q in s["label"].lower() or q in s["bengali_meaning"]
        ]
    if category:
        filtered = [s for s in filtered if s["category"].lower() == category.lower()]
    if language:
        filtered = [s for s in filtered if s["language"] == language]

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    return {
        "items": filtered[start:end],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@app.get("/api/dataset/signs/{sign_id}")
def get_sign_by_id(sign_id: str):
    for s in sign_catalog:
        if s["id"] == sign_id:
            return s
    raise HTTPException(status_code=404, detail="Sign not found")


@app.get("/api/dataset/stats")
def dataset_stats():
    total_signs = len(sign_catalog)
    total_approved = sum(s["approved_samples"] for s in sign_catalog)
    total_pending = sum(s["pending_samples"] for s in sign_catalog)
    total_rejected = sum(s["rejected_samples"] for s in sign_catalog)
    languages = list(set(s["language"] for s in sign_catalog))
    categories = list(set(s["category"] for s in sign_catalog))
    return {
        "total_signs": total_signs,
        "total_approved_samples": total_approved,
        "total_pending_samples": total_pending,
        "total_rejected_samples": total_rejected,
        "languages": languages,
        "categories": categories,
        "dataset_version": "v0.1",
        "model_version": REGISTRY.active["name"] if REGISTRY.active else "none",
    }


# ─────────────────────────────────────────────
# PREDICTION: frame → landmark → MLP + NMM
# ─────────────────────────────────────────────
class PredictResponse(BaseModel):
    detected: bool
    label: str
    confidence: float
    top5: list
    hands_detected: int
    nmm: dict
    # Affect + raw NMM geometry. These MUST be declared here: FastAPI validates
    # the response against this model and silently DROPS undeclared keys, so
    # detect_nmm() computing an emotion the model does not list means the client
    # never receives it.
    emotion: dict | None = None
    metrics: dict | None = None


@app.post("/api/predict/frame", response_model=PredictResponse)
async def predict_frame(file: UploadFile = File(...)):
    # A temporal graph declares [N, T, 126]: it cannot be fed one frame. Without
    # this guard the run() below raises a shape error, the client sees a 500, and
    # the model looks like it "detects nothing". Fail loudly and name the
    # endpoint that CAN serve it instead.
    if REGISTRY.temporal_session is not None:
        frames = (REGISTRY.active or {}).get("frames", SEQ_T)
        raise HTTPException(
            status_code=409,
            detail=(
                f"The active model '{REGISTRY.active['name']}' is temporal and "
                f"expects a clip of {frames} frames, not a single frame. Use "
                f"POST /api/predict/clip, or activate a static model "
                f"(e.g. a 126-input MLP) in the admin panel."
            ),
        )
    try:
        raw = await file.read()
        nparr = np.frombuffer(raw, np.uint8)
        frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame_bgr is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        vec = process_bgr_frame(frame_bgr, _active_width())
        nmm_flags = detect_nmm(frame_bgr)

        if vec is None:
            return PredictResponse(
                detected=False,
                label="NO_HAND",
                confidence=0.0,
                top5=[],
                hands_detected=0,
                nmm=nmm_flags,
                emotion=nmm_flags.get("emotion"),
                metrics=nmm_flags.get("metrics"),
            )

        # The width is the graph's, not a constant: a 126-dim MLP wants the
        # two-hand vector, the 258-dim daily LSTM wants hands + pose. Hard-coding
        # 126 here is what made the LSTM runs fail with a shape error.
        width = _active_width()
        logits = session.run(None, {INPUT_NAME: vec.reshape(1, width)})[0][0]
        probs = np.exp(logits - logits.max())
        probs = probs / probs.sum()

        top_idx = np.argsort(probs)[::-1][:5]
        top5 = [
            {"label": CLASSES[i], "confidence": float(probs[i])}
            for i in top_idx
        ]

        best = int(top_idx[0])
        return PredictResponse(
            detected=True,
            label=CLASSES[best],
            confidence=float(probs[best]),
            top5=top5,
            hands_detected=1,
            nmm=nmm_flags,
            emotion=nmm_flags.get("emotion"),
            metrics=nmm_flags.get("metrics"),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# PREDICTION: T-frame clip → temporal model
# ─────────────────────────────────────────────
@app.post("/api/predict/clip")
async def predict_clip(files: list[UploadFile] = File(...)):
    if unified_session is None:
        raise HTTPException(
            status_code=409,
            detail=(
                "The active model is static and expects a single frame. Use "
                "POST /api/predict/frame, or activate a temporal (LSTM) model "
                "in the admin panel."
            ),
        )
    # Read the clip length from the graph's own contract rather than assuming
    # SEQ_T: a run may be exported with a different T, and silently resampling
    # to the wrong length produces confident nonsense instead of an error.
    want_t = (REGISTRY.active or {}).get("frames") or SEQ_T
    width = _active_width()
    vecs, last = [], None
    for f in files:
        raw = await f.read()
        fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
        if fr is None:
            continue
        v = process_bgr_frame(fr, width)
        if v is not None:
            last = v
        vecs.append(v if v is not None else last)
    vecs = [v for v in vecs if v is not None]
    if len(vecs) < 8:
        return {"ready": False, "detail": "No hands detected in clip"}
    arr = np.array(vecs, np.float32)
    if len(arr) != want_t:
        arr = arr[np.linspace(0, len(arr) - 1, want_t).astype(int)]
    logits = unified_session.run(None, {UNIFIED_INPUT: arr[None]})[0][0]
    probs = np.exp(logits - logits.max())
    probs /= probs.sum()
    order = np.argsort(probs)[::-1][:3]
    return {"ready": True, "label": ACTIVE_CLASSES[int(order[0])],
            "confidence": float(probs[order[0]]),
            "frames_used": int(want_t), "frames_supplied": int(len(vecs)),
            "top3": [{"label": ACTIVE_CLASSES[i], "confidence": float(probs[i])} for i in order]}


# ─────────────────────────────────────────────
# PREDICTION: streaming window → temporal model (live auto-detection)
# ─────────────────────────────────────────────
@app.post("/api/predict/stream")
async def predict_stream(files: list[UploadFile] = File(...)):
    """Recognise a sign from a rolling window of recent frames.

    This is what makes live signing work with a temporal model. The old design
    made the user press a button and hold still for exactly three seconds, which
    is both unnatural to perform and easy to get wrong: if the sign finished
    early, or the hand left the frame, the fixed window captured the wrong half
    of the movement.

    Instead the client keeps a ring buffer of the last ``frames`` frames and
    posts it whenever it sees motion. The server recognises the window, and
    reports ``margin`` -- the gap between the best and second-best class -- so
    the client can demand a *decisive* win before committing a gloss to the
    sequence. A hesitant window therefore produces no output rather than a
    confident-looking wrong one.
    """
    if unified_session is None:
        raise HTTPException(
            status_code=409,
            detail=(
                "The active model is static and expects a single frame. Use "
                "POST /api/predict/frame, or activate a temporal (LSTM) model "
                "in the admin panel."
            ),
        )
    want_t = (REGISTRY.active or {}).get("frames") or SEQ_T
    width = _active_width()
    vecs, last = [], None
    last_frame_bgr = None
    for f in files:
        raw = await f.read()
        fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
        if fr is None:
            continue
        last_frame_bgr = fr
        v = process_bgr_frame(fr, width)
        if v is not None:
            last = v
        vecs.append(v if v is not None else last)
    vecs = [v for v in vecs if v is not None]
    if len(vecs) < 8:
        return {"ready": False, "detail": "No hands detected in window"}

    nmm_data = detect_nmm(last_frame_bgr) if last_frame_bgr is not None else {
        "question": False, "wh_question": False, "negation": False, "affirmation": False, "emphasis": False,
        "emotion": {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}},
        "metrics": {"brow_ratio": 0.0, "mouth_ratio": 0.0, "shake_var": 0.0, "nod_var": 0.0}
    }
    arr = np.array(vecs, np.float32)
    if len(arr) != want_t:
        arr = arr[np.linspace(0, len(arr) - 1, want_t).astype(int)]

    # Same unconditional motion gate as /api/stream/frame (see the comment
    # there): the legacy batch path the page falls back to needs the identical
    # policy, and a NONE class in the label list is not evidence the model can
    # actually recognise idleness.
    if len(arr) > 1:
        motion = float(np.mean(np.abs(np.diff(arr, axis=0))))
        spread = float(np.mean(np.abs(arr - arr.mean(axis=0))))
        if motion < IDLE_MOTION_GATE or spread < IDLE_SPREAD_GATE:
            return {"ready": False, "detail": "idle"}

    logits = unified_session.run(None, {UNIFIED_INPUT: arr[None]})[0][0]
    probs = np.exp(logits - logits.max())
    probs /= probs.sum()
    order = np.argsort(probs)[::-1][:3]
    return {
        "ready": True,
        "label": ACTIVE_CLASSES[int(order[0])],
        "confidence": float(probs[order[0]]),
        # Best minus runner-up. A one-hot softmax and a coin-flip can both report
        # "99%", so confidence alone cannot tell a real sign from noise; margin can.
        "margin": float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0,
        "frames_used": int(want_t),
        "frames_supplied": int(len(vecs)),
        "nmm": nmm_data,
        "emotion": nmm_data.get("emotion"),
        "metrics": nmm_data.get("metrics"),
        "top3": [
            {"label": ACTIVE_CLASSES[i], "confidence": float(probs[i])}
            for i in order
        ],
    }


# ─────────────────────────────────────────────
# PREDICTION: single frame in → server-side ring buffer → temporal model
# ─────────────────────────────────────────────
# The windows the server cuts out of its own buffer. Two lengths, not one: a
# short window reads a fast sign, a long one reads a slow one, and the same
# signer produces both. Fusing them and keeping the most decisive answer is
# what stops a single unlucky window length from deciding the output.
STREAM_WINDOWS = (24, 32)
# Seconds between model runs per session. At 30 fps capture this is ~7 frames,
# i.e. an order of magnitude fewer inferences than frames -- the client can push
# frames as fast as the camera delivers them and the server does the throttling.
STREAM_INFER_EVERY = 0.25


# Below this mean frame-to-frame landmark motion a window is treated as idle.
# Coordinates are normalised by hand size, so an absolutely still signer's
# window sits around 1e-4 while even a slow sign clears 1e-2; the threshold is
# set an order of magnitude above jitter and two below any real sign so sensor
# noise alone can never cross it.
IDLE_MOTION_GATE = 0.004
# Mean per-column deviation from the window's own mean. This is the second,
# independent idle signal: tracking jitter OSCILLATES, so its frame-to-frame
# motion can sit above the gate while the hand never actually goes anywhere --
# the window's spread stays tiny. A held "HUG" pose reported forever by a
# signer who has stopped moving is exactly this signature; motion alone could
# not see it, spread can.
IDLE_SPREAD_GATE = 0.008


@app.post("/api/stream/frame")
async def stream_frame(session_id: str = "default", file: UploadFile = File(...)):
    """One JPEG in, buffered landmark out.

    Inference runs server-side on a sliding window every ``STREAM_INFER_EVERY``
    seconds -- the client no longer uploads 32 frames per tick.

    ``ready: false`` is a normal answer, not an error: it means the buffer is
    still filling or the throttle is holding. The client uses ``buffered`` to
    show how much history exists without inventing a count of its own.
    """
    if unified_session is None:
        raise HTTPException(409, "Active model is static; activate a temporal model first.")

    raw = await file.read()
    fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if fr is None:
        raise HTTPException(400, "Could not decode image")

    width = _active_width()
    sess = get_session(session_id)
    vec = process_bgr_frame(fr, width)
    # Bounded carry-forward: <= 8 consecutive misses (~0.8 s at 10 Hz client)
    # keep the window dense through a flicker; beyond that the signer's hands
    # are genuinely gone, and freezing the last vector would replay the ending
    # pose of the previous sign as if it were still being performed. Zeros are
    # what the hand-presence channels read as "no hands".
    if vec is None:
        sess.miss += 1
        vec = (sess.buf[-1] if sess.buf and sess.miss <= 8
               else np.zeros(width, np.float32))
    else:
        sess.miss = 0
    sess.buf.append(np.asarray(vec, np.float32))

    now = time.time()
    if len(sess.buf) < STREAM_WINDOWS[0]:
        return {"ready": False, "buffered": len(sess.buf), "detail": "filling"}
    if now - sess.last_infer < STREAM_INFER_EVERY:
        return {"ready": False, "buffered": len(sess.buf), "detail": "throttled"}
    sess.last_infer = now

    nmm = detect_nmm(fr)
    tail = np.array(list(sess.buf), np.float32)
    want_t = (REGISTRY.active or {}).get("frames") or SEQ_T

    # Motion gate -- per WINDOW, not per buffer. The buffer holds up to 18 s of
    # history; gating on its mean kept the gate open for ~15 s after a sign
    # ended, so idle windows decoded as the previous sign and repeated until
    # the camera stopped. Each candidate window is now gated on its own
    # geometry: a window the signer visibly stopped moving in is skipped, and
    # if EVERY window is idle the endpoint answers "idle" instead of guessing.
    best = None
    idle_stats = None
    for w in STREAM_WINDOWS:                       # multi-window fusion: max margin wins
        win = tail[-w:]
        if len(win) < 2:
            continue
        motion = float(np.mean(np.abs(np.diff(win, axis=0))))
        spread = float(np.mean(np.abs(win - win.mean(axis=0))))
        if idle_stats is None or motion > idle_stats[0]:
            idle_stats = (motion, spread)
        if motion < IDLE_MOTION_GATE or spread < IDLE_SPREAD_GATE:
            continue                               # this window is idle or frozen

        # The interpolation in resample_arr mixes the source rows with float
        # weights, which promotes the result to float64. ONNX Runtime rejects
        # that outright ("Unexpected input data type ... expected float"), so the
        # dtype is pinned here rather than left to the arithmetic.
        arr = resample_feature_width(resample_arr(win, want_t)[None], width).astype(np.float32)
        logits = unified_session.run(None, {UNIFIED_INPUT: arr})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:2]
        # Margin, not confidence: a hesitant window can still report 99% on one
        # class, but it cannot report a large gap to the runner-up as well.
        margin = float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0
        if best is None or margin > best["margin"]:
            best = {
                "label": ACTIVE_CLASSES[int(order[0])],
                "confidence": float(probs[order[0]]),
                "margin": margin,
                "window": int(w),
                "top3": [{"label": ACTIVE_CLASSES[i], "confidence": float(probs[i])}
                         for i in np.argsort(probs)[::-1][:3]],
            }

    if best is None:
        motion, spread = idle_stats if idle_stats else (0.0, 0.0)
        return {"ready": False, "buffered": len(sess.buf),
                "detail": "idle",
                "motion": round(motion, 5), "spread": round(spread, 5),
                "nmm": nmm, "emotion": nmm.get("emotion")}

    return {**best, "ready": True, "buffered": len(sess.buf),
            "frames_used": int(want_t),
            "nmm": nmm, "emotion": nmm.get("emotion"), "metrics": nmm.get("metrics")}


@app.get("/api/coverage")
def coverage():
    """Vocabulary and replay coverage for the currently selected model."""
    summary = _coverage_summary()
    return {
        **summary,
        "by_category": {
            cat: {
                "total": sum(1 for s in sign_catalog if s["category"] == cat),
                "with_landmark_sequences": sum(
                    1 for s in sign_catalog if s["category"] == cat
                ),
            }
            for cat in sorted({s["category"] for s in sign_catalog})
        },
        "items": [
            {
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "category": s["category"],
                "has_landmarks": True,
            }
            for s in sign_catalog
        ],
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "endpoint": (REGISTRY.active or {}).get("endpoint", "/api/predict/frame"),
    }


# ─────────────────────────────────────────────
# REAL LANDMARK REPLAY (no synthetic skeletons anywhere)
# ─────────────────────────────────────────────
@app.get("/api/simulation/frames")
def simulation_frames(label: str = "", sample_id: str = ""):
    """Replay a model-bundled class sequence or a specific community sample."""
    arr = None
    face_mesh = None
    source = ""
    if sample_id:
        rec = next((r for r in _load_manifest() if r["sample_id"] == sample_id), None)
        if rec:
            sample_path = (ROOT / rec["landmark_path"]).resolve()
            if sample_path.parent != SAMPLES_DIR.resolve() and SAMPLES_DIR.resolve() not in sample_path.parents:
                raise HTTPException(status_code=400, detail="Invalid community sample path")
            if sample_path.is_file():
                arr = np.load(sample_path, allow_pickle=False)
                source = f"community:{sample_id}"
    elif label:
        sequence_path = _model_sequence_path(label)
        if sequence_path:
            loaded = np.load(sequence_path, allow_pickle=False)
            arr = loaded[0] if loaded.ndim == 3 else loaded
            source = f"{REGISTRY.active['run']}:{sequence_path.stem}"
            face_mesh_path = sequence_path.with_name(
                f"{sequence_path.stem}.face.npy"
            )
            if face_mesh_path.is_file():
                try:
                    face_sequences = np.load(face_mesh_path, allow_pickle=False)
                except (OSError, ValueError) as exc:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Bundled face-mesh sequence cannot be loaded: {exc}",
                    ) from exc
                if (
                    face_sequences.ndim != 4
                    or face_sequences.shape[-2:] != (468, 3)
                    or (loaded.ndim == 3 and face_sequences.shape[:2] != loaded.shape[:2])
                    or (
                        loaded.ndim == 2
                        and (
                            face_sequences.shape[0] != 1
                            or face_sequences.shape[1] != loaded.shape[0]
                        )
                    )
                ):
                    raise HTTPException(
                        status_code=422,
                        detail="Bundled face mesh must align with model sequences "
                        "and have shape (samples, frames, 468, 3).",
                    )
                face_mesh = np.asarray(face_sequences[0], dtype=np.float32)
    if arr is None:
        raise HTTPException(
            status_code=404,
            detail="No landmark sequence is bundled for this active-model sign.",
        )

    arr = np.asarray(arr, dtype=np.float32)
    if arr.ndim == 1:                                   # a single frame was stored
        arr = arr[None]
    if arr.ndim != 2 or arr.shape[-1] not in (HANDS_DIM, HOLISTIC_DIM):
        raise HTTPException(status_code=422, detail="Bundled landmark sequence has an invalid shape")
    arr = arr[:64]

    if arr.shape[-1] == HOLISTIC_DIM:                   # 258 = hands 126 + pose 33x4
        hands = arr[:, :126].reshape(len(arr), 42, 3)
        pose = arr[:, 126:].reshape(len(arr), 33, 4)
        result = {"frames": hands.tolist(), "pose": pose.tolist(), "points": 42,
                  "count": int(len(arr)), "source": source, "width": HOLISTIC_DIM}
    else:
        result = {"frames": arr.reshape(len(arr), 42, 3).tolist(), "points": 42,
                  "count": int(len(arr)), "source": source, "width": HANDS_DIM}
    if face_mesh is not None:
        face_mesh = face_mesh[:len(arr)]
        result["face_mesh"] = [
            frame.tolist() if np.any(frame) else []
            for frame in face_mesh
        ]
    return result


@app.get("/api/dataset/index")
def dataset_index(label: str = "", kind: str = ""):
    idx = TRAINING_DATA_DIR / "index.jsonl"
    if not idx.exists():
        return {"items": []}
    items = []
    for line in idx.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        if label and r.get("label", "").upper() != label.upper():
            continue
        if kind and r.get("kind") != kind:
            continue
        items.append(r)
    return {"items": items}


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str
    # Detected NMM / affect context from the recognition layer. Optional so old
    # clients keep working; forwarded to the LLM when present.
    nmm: dict | None = None
    emotion: dict | None = None
    intensity: float | None = None
    hand: str | None = None

    def meta(self) -> dict:
        return {
            "nmm": self.nmm,
            "emotion": self.emotion,
            "intensity": self.intensity,
            "hand": self.hand,
        }


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


@app.get("/api/contributions/needs-data")
def needs_data():
    needs = sorted(sign_catalog, key=lambda s: s["approved_samples"])[:10]
    return {
        "items": [
            {
                "id": s["id"],
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "current": s["approved_samples"],
                "target": 50,
            }
            for s in needs
        ]
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



# ─────────────────────────────────────────────
# CONTRIBUTIONS: session + REAL ingestion
# ─────────────────────────────────────────────
@app.post("/api/contributions/session")
def create_session(payload: dict):
    return {
        "session_id": f"sess_{uuid.uuid4().hex[:8]}",
        "signer_id": payload.get("signer_id", "anonymous"),
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "status": "active",
    }


@app.post("/api/contributions/session/{session_id}/samples")
async def ingest_sample(
    session_id: str,
    label: str = Form(...),
    signer_id: str = Form(...),
    nmm_tags: str = Form("{}"),
    file: UploadFile = File(...),
):
    """Real upload: decode video server-side, extract 126-dim landmarks every
    3rd frame, save .npy + append manifest record. No simulation."""
    canonical_label = label.upper().replace(" ", "_")
    if canonical_label not in _available_model_classes():
        raise HTTPException(
            status_code=400,
            detail="Sign is not part of the active model vocabulary.",
        )

    import os
    import tempfile

    suffix = Path(file.filename or "rec.webm").suffix or ".webm"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        tmp.write(await file.read())
        tmp.close()

        width = _active_width()
        cap = cv2.VideoCapture(tmp.name)
        frames = []
        idx = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if idx % 3 == 0:
                vec = process_bgr_frame(frame, width)
                if vec is not None:
                    frames.append(vec)
            idx += 1
        cap.release()
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass

    if len(frames) < 5:
        raise HTTPException(
            status_code=400,
            detail="Not enough hand landmarks extracted. Keep both hands visible while recording.",
        )

    arr = np.array(frames, dtype=np.float32)
    safe_label = re.sub(r"[^A-Za-z0-9_-]", "_", canonical_label)
    safe_signer_id = re.sub(r"[^A-Za-z0-9_-]", "_", signer_id) or "anonymous"
    sample_id = f"v001_{safe_label}_{safe_signer_id}_{time.strftime('%Y%m%dT%H%M%S')}"
    label_dir = SAMPLES_DIR / safe_label / safe_signer_id
    label_dir.mkdir(parents=True, exist_ok=True)
    npy_path = label_dir / f"{sample_id}.npy"
    np.save(npy_path, arr)

    record = {
        "sample_id": sample_id,
        "session_id": session_id,
        "label": canonical_label,
        "signer_id": signer_id,
        "split": "unassigned",
        "source": "community",
        "verification": "pending",
        "verified_by": None,
        "captured_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "frames": int(arr.shape[0]),
        "width": int(arr.shape[-1]),
        "landmark_path": str(npy_path.relative_to(ROOT)),
        "nmm_tags": json.loads(nmm_tags or "{}"),
        "upload_status": "success",
    }
    with open(MANIFEST_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    _refresh_catalog_sample_counts()

    return {"sample_id": sample_id, "status": "pending_review", "frames": int(arr.shape[0])}


@app.get("/api/admin/contributions")
def get_contributions():
    return _load_manifest()


def resample_arr(arr, t):
    """Linear resample of a landmark sequence to a fixed frame count."""
    if len(arr) == t:
        return arr
    ix = np.linspace(0, len(arr) - 1, t)
    i0, i1 = ix.astype(int), np.minimum(ix.astype(int) + 1, len(arr) - 1)
    f = (ix - i0)[:, None]
    return arr[i0] * (1 - f) + arr[i1] * f


@app.get("/api/admin/contributions/{sample_id}/evidence")
def get_evidence(sample_id: str):
    rec = next((r for r in _load_manifest() if r["sample_id"] == sample_id), None)
    if rec is None:
        raise HTTPException(status_code=404, detail="Sample not found")

    preds = []
    top_conf = 0.0
    frames = rec.get("frames", 0)
    mean_vel = 0.0
    npy = ROOT / rec["landmark_path"]
    if npy.exists():
        arr = np.load(npy)
        frames = int(arr.shape[0])
        if frames > 1:
            mean_vel = float(np.linalg.norm(np.diff(arr[:, :63], axis=0), axis=1).mean())
        if unified_session is not None:
            seq = resample_arr(arr, SEQ_T)[None].astype(np.float32)
            # Same dispatch as the endpoints: the clip is assembled in the width
            # the active graph declares, not in whatever the upload happens to be.
            seq = resample_feature_width(seq, _active_width())
            logits = unified_session.run(None, {UNIFIED_INPUT: seq})[0][0]
        else:
            mid = arr[frames // 2]
            logits = session.run(
                None, {INPUT_NAME: mid.reshape(1, _active_width())})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]
        preds = [{"label": ACTIVE_CLASSES[i], "confidence": round(float(probs[i]), 3)} for i in order]
        top_conf = float(probs[order[0]])

    agree = round(top_conf * 100, 1) if preds and preds[0]["label"] == rec["label"] else round(top_conf * 60, 1)
    geom = round(min(100.0, 70 + frames * 0.5), 1)
    temp = round(min(100.0, 60 + frames * 0.8), 1) if mean_vel < 200 else 40.0
    tags = [t.upper() for t, v in (rec.get("nmm_tags") or {}).items() if v]

    return {
        "geometry_score": geom,
        "temporal_score": temp,
        "similarity_score": agree,
        "label_agreement": agree,
        "synthetic_score": round(min(100.0, mean_vel * 2), 1),
        "model_predictions": preds or [{"label": rec["label"], "confidence": 0.5}],
        "numerical_features": {"frames": frames, "mean_velocity": round(mean_vel, 3)},
        "symbolic_tags": tags or ["NO_NMM"],
        "movement_description": (
            f"Community recording of '{rec['label']}' by {rec['signer_id']}; "
            f"{frames} landmark frames extracted at stride 3."
        ),
        "reasoning": {
            "handshape_match": "Strong" if agree > 70 else "Moderate",
            "movement_match": "Strong" if temp > 70 else "Moderate",
            "temporal_match": f"{frames} frames captured",
            "nmm_detected": ", ".join(tags).lower() or "none",
            "top_candidate": f"{preds[0]['label']} · {preds[0]['confidence'] * 100:.1f}%" if preds else "—",
        },
    }


@app.post("/api/admin/contributions/{sample_id}/verify")
def verify_contribution(sample_id: str, payload: dict):
    action = payload.get("action", "needs_review")
    items = _load_manifest()
    changed = False
    for r in items:
        if r["sample_id"] == sample_id:
            r["verification"] = action
            r["verified_by"] = payload.get("reviewer", "admin")
            changed = True
    if changed:
        _write_manifest(items)
        _refresh_catalog_sample_counts()
    return {"success": changed}


@app.get("/api/admin/stats")
def admin_stats():
    ai = get_ai_config()
    return {
        "total_signs": len(sign_catalog),
        "total_approved_samples": sum(s["approved_samples"] for s in sign_catalog),
        "total_pending_samples": sum(s["pending_samples"] for s in sign_catalog),
        "total_rejected_samples": sum(s["rejected_samples"] for s in sign_catalog),
        "model_active": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_classes": len(REGISTRY.active_classes),
        "contract": (REGISTRY.active or {}).get("contract") or {
            "kind": "temporal" if (REGISTRY.active or {}).get("temporal") else "static",
            "feature_width": (REGISTRY.active or {}).get("input_width", 126),
        },
        "llm_available": is_llm_available(),
        "llm_model": ai["model"],
        "inference_mode": ai["provider"],
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

# FILE: `backend\nmm.py`

```python
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

from backend.extract import _suppress_c_stderr

# Initialize MediaPipe FaceMesh ONCE
with _suppress_c_stderr():
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
```

---

# FILE: `backend\pose.py`

```python
"""
backend/pose.py
The Pose half of the 258-dim holistic feature vector, defined ONCE.

``extract_holistic_frame`` (serving) and ``train_holistic.py`` (training) must
produce the same 132 numbers for the same frame, or the graph is trained on a
distribution it will never be served. Everything that is a property of the pose
block rather than of the caller therefore lives here:

    POSE_DIM         33 landmarks x (x, y, z, visibility) = 132 columns
    POSE_BODY_PAIRS  the BlazePose skeleton edges that are actually pOSE
                     geometry -- hands, feet and the face mesh are excluded
                     because the hand block carries the fingers and the mouth is
                     read separately by the NMM detector

Importing the skeleton from one place means a client cannot draw one thing while
the extractor means another.
"""

import numpy as np

POSE_POINTS = 33
POSE_DIM = POSE_POINTS * 4          # x, y, z, visibility

# BlazePose indices used by the skeleton: shoulders, elbows, wrists, hips,
# knees, ankles, ears and the mouth/nose cluster. The fingertip and foot
# landmarks are omitted on purpose -- they belong to the hand block (126 cols)
# and are invisible in the pose-only overlay.
POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (11, 12),                                    # shoulders
    (11, 13), (13, 15),                          # left arm
    (12, 14), (14, 16),                          # right arm
    (11, 23), (12, 24), (23, 24),                # torso
    (23, 25), (25, 27),                          # left leg
    (24, 26), (26, 28),                          # right leg
    (0, 9), (0, 10), (9, 10),                    # nose <-> mouth corners
    (2, 5), (7, 8),                              # eyes and mouth midline
]

# Nose + mouth corners: the landmarks the NMM readout is computed from, so the
# replay marks exactly the points the detector actually looks at.
POSE_FACE_MARKERS: list[int] = [0, 9, 10]


def pose_from_landmarks(pose_landmarks) -> np.ndarray:
    """MediaPipe pose landmark list -> (33, 4) float32, un-normalised.

    Returns the raw (x, y, z, visibility) rows. Reference subtraction and
    scaling are the caller's job, because they depend on which hand is the
    reference -- and that decision belongs with the hand block.
    """
    return np.array(
        [[p.x, p.y, p.z, p.visibility] for p in pose_landmarks.landmark],
        np.float32,
    )
```

---

# FILE: `backend\streaming.py`

```python
"""
backend/streaming.py
Per-session rolling landmark buffer for live continuous recognition.

Why the buffer lives here and not in the browser:

The client used to keep a ring buffer of 32 JPEGs and POST all of them every
tick. That is ~32 uploads and 32 MediaPipe passes for every single prediction,
and it makes the browser the owner of the recognition window -- so two tabs, or
a reload, silently reset the state the model depends on.

Here the client uploads ONE JPEG, the server appends ONE landmark vector, and the
model runs when the buffer is deep enough. Upload cost per tick drops by 32x, the
window survives a page reload, and the multi-scale windowing in
``/api/stream/frame`` can read any length of history it wants out of one deque.

Sessions are keyed by a client-generated id and never garbage collected: they are
tiny (a 180x258 float32 deque is ~186 KB) and eviction would have to guess at
liveness. A long-lived server with many visitors will accumulate them; the cap in
``MAX_SESSIONS`` bounds that, dropping the least recently used.
"""

from collections import OrderedDict, deque

import numpy as np

# ~6 s at 30 fps of client capture. Long enough that a 24- and a 32-frame window
# can both be cut from it with room to spare, short enough that a stale sign
# falls out of the buffer on its own.
DEFAULT_WINDOW = 180
MAX_SESSIONS = 64


class StreamSession:
    """One client's rolling landmark history.

    The whole point is that misses do not create gaps: a frame where a hand was
    not detected appends the previous vector, so the sequence the model sees is
    always dense and the same length as the wall-clock window. A truly empty
    buffer still appends a zero vector, which the network reads (via its
    hand-presence channels) as "no hands" rather than as a sign.
    """

    def __init__(self, maxlen: int = DEFAULT_WINDOW):
        self.buf: deque = deque(maxlen=maxlen)
        self.last_infer: float = 0.0
        # Consecutive frames with no landmarks. Bounded carry-forward (see
        # /api/stream/frame): a short occlusion keeps the window dense, a long
        # absence decays to zeros so a dropped hand cannot replay the last
        # sign pose forever.
        self.miss: int = 0


# Ordered so the oldest session is the one evicted when the cap is hit.
SESSIONS: "OrderedDict[str, StreamSession]" = OrderedDict()


def get_session(sid: str) -> StreamSession:
    """Fetch (and touch) the session for ``sid``, creating it on first use."""
    sess = SESSIONS.get(sid)
    if sess is None:
        sess = StreamSession()
        SESSIONS[sid] = sess
    else:
        SESSIONS.move_to_end(sid)
    while len(SESSIONS) > MAX_SESSIONS:
        SESSIONS.popitem(last=False)
    return sess


def last_vector(sess: StreamSession, width: int) -> np.ndarray:
    """The vector to carry forward when this frame yielded no landmarks."""
    if sess.buf:
        return sess.buf[-1]
    return np.zeros(width, np.float32)


def reset_session(sid: str) -> None:
    SESSIONS.pop(sid, None)
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
import "./.next/dev/types/routes.d.ts";
import "./.next/dev/types/root-params.d.ts";

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

# FILE: `frontend\package-lock.json`

```json
{
  "name": "wbsl-bridge-frontend",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "wbsl-bridge-frontend",
      "version": "0.1.0",
      "dependencies": {
        "@hookform/resolvers": "^5.9.1",
        "@react-three/drei": "^10.7.9",
        "@react-three/fiber": "^9.8.1",
        "@tanstack/react-query": "^5.103.2",
        "autoprefixer": "^10.6.1",
        "axios": "^1.20.0",
        "clsx": "^2.1.1",
        "framer-motion": "^13.4.1",
        "lucide-react": "^1.47.0",
        "next": "16.3.6",
        "postcss": "^8.5.28",
        "react": "19.2.8",
        "react-dom": "19.2.8",
        "react-hook-form": "^7.88.0",
        "recharts": "^3.10.1",
        "sonner": "^2.0.8",
        "tailwind-merge": "^3.7.0",
        "tailwindcss-animate": "^1.0.7",
        "three": "0.185.1",
        "zod": "^3.25.76",
        "zustand": "^5.0.15"
      },
      "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "@types/three": "0.185.0",
        "eslint": "^9",
        "eslint-config-next": "16.3.6",
        "tailwindcss": "^3.4.19",
        "typescript": "^5"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.3.0.tgz",
      "integrity": "sha512-U4+70Pc5ZS9osnCBCE5Jha/ciHM+Yp+CNMNC/7HvYbNRk1Ldd+f7qO65W5qfhu/TCv+/ozljlXXe9Nj8419DMA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.8.tgz",
      "integrity": "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.8",
        "@babel/types": "^7.29.8",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.9",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.9.tgz",
      "integrity": "sha512-CjXrNHTnvqBVqHgdBysY3vk2T8tpJHb5/RMeHJBTyVa9xgugCB0CJTx/3oO8RV2QRQP391RWpB7D6hLjm8V9uA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/runtime": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/runtime/-/runtime-7.29.7.tgz",
      "integrity": "sha512-Nq8OhGWiZIZGV6hLHoyAKLLcJihP/xFeBMGJoUrxTX2psI8dCifzLhZISFb+VWS3wFMRDmCGw5R+dOySCqPLhw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.8.tgz",
      "integrity": "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.8",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.8",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.8",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.8.tgz",
      "integrity": "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@dimforge/rapier3d-compat": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/@dimforge/rapier3d-compat/-/rapier3d-compat-0.12.0.tgz",
      "integrity": "sha512-uekIGetywIgopfD97oDL5PfeezkFpNhwlzlaEYNOA0N6ghdsOvh/HYjSMek5Q2O1PYvRSDFcqFVJl4r4ZBwOow==",
      "license": "Apache-2.0"
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.3.tgz",
      "integrity": "sha512-ELEBe8PsLvvJ6QMr0zLt8ffvOHW/dc1m3CEzNMg7aJUv3bMaoDtw2TXyDAwkYBuroxxuHEwhRTLJSe5sya547g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.10.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.10.1.tgz",
      "integrity": "sha512-cuadcxVFE8sDK6iWJbs8Sn0av2Nrh2QSGQhVlBW9AaAHqHwjWsZHT8LJ4hFGPh7ASBV2deFdM7H/DPjulmh8rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.5"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.7",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.7.tgz",
      "integrity": "sha512-F42g89Qd5oAWtp0k0nnSrjziAKza7w8SVT4mStc18LZMaRb4J1HQAHLCalEtDCxrTuksx7NU9qsmeLwpOfPqWw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.14.0",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.3.2",
        "minimatch": "^3.1.5",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/@eslint/eslintrc/node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@eslint/js": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.5.tgz",
      "integrity": "sha512-QywQuszQh77pIXCsq998c8hbhSTI/azTty1Z6N53dmAudKHhy573j3yvRLsX2BSp8YpLtoCEG8E9DJe+8zUh4A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@hookform/resolvers": {
      "version": "5.9.1",
      "resolved": "https://registry.npmjs.org/@hookform/resolvers/-/resolvers-5.9.1.tgz",
      "integrity": "sha512-7b7vsbraJxKgjVSA1Nur9tLwj539WGJUBLA7QNvXnFoT2pM5Z7G+6rlukk4B2/QrTZy6huRtH6wKeESPKuIr6w==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/utils": "^0.3.0"
      },
      "peerDependencies": {
        "@sinclair/typebox": ">=0.25.24",
        "@standard-schema/spec": "^1.0.0",
        "@typeschema/main": ">=0.13.7",
        "@vinejs/vine": "^2.0.0 || ^3.0.0 || ^4.0.0",
        "ajv": "^8.12.0",
        "ajv-errors": "^3.0.0",
        "ajv-formats": "^2.1.1",
        "arktype": "^2.0.0",
        "ata-validator": "^1.2.0",
        "class-transformer": ">=0.4.0",
        "class-validator": ">=0.12.0",
        "computed-types": "^1.0.0",
        "effect": "^3.10.3",
        "fluentvalidation-ts": "^3.0.0",
        "fp-ts": "^2.7.0",
        "io-ts": "^2.0.0",
        "joi": "^17.0.0 || ^18.0.0",
        "nope-validator": ">=0.12.0",
        "react-hook-form": "^7.55.0",
        "superstruct": ">=0.12.0",
        "typanion": "^3.3.2",
        "valibot": ">=0.31.0 || ^1.0.0-beta.4 || ^1.0.0-rc",
        "vest": ">=6.0.0",
        "yup": "^1.0.0",
        "zod": "^3.25.0 || ^4.0.0"
      },
      "peerDependenciesMeta": {
        "@sinclair/typebox": {
          "optional": true
        },
        "@standard-schema/spec": {
          "optional": true
        },
        "@typeschema/main": {
          "optional": true
        },
        "@vinejs/vine": {
          "optional": true
        },
        "ajv": {
          "optional": true
        },
        "ajv-errors": {
          "optional": true
        },
        "ajv-formats": {
          "optional": true
        },
        "arktype": {
          "optional": true
        },
        "ata-validator": {
          "optional": true
        },
        "class-transformer": {
          "optional": true
        },
        "class-validator": {
          "optional": true
        },
        "computed-types": {
          "optional": true
        },
        "effect": {
          "optional": true
        },
        "fluentvalidation-ts": {
          "optional": true
        },
        "fp-ts": {
          "optional": true
        },
        "io-ts": {
          "optional": true
        },
        "joi": {
          "optional": true
        },
        "nope-validator": {
          "optional": true
        },
        "superstruct": {
          "optional": true
        },
        "typanion": {
          "optional": true
        },
        "valibot": {
          "optional": true
        },
        "vest": {
          "optional": true
        },
        "yup": {
          "optional": true
        },
        "zod": {
          "optional": true
        }
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",
      "integrity": "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/types": "^0.15.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.8",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.8.tgz",
      "integrity": "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.2",
        "@humanfs/types": "^0.15.0",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/types": {
      "version": "0.15.0",
      "resolved": "https://registry.npmjs.org/@humanfs/types/-/types-0.15.0.tgz",
      "integrity": "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.35.4.tgz",
      "integrity": "sha512-Uhfl4V4lhP2nbUVF9+hyH1+luj86f1gUFeo8ALYxFoULoU+G87D43BfeMP8XHsk9boxAnCY/bf2EHwhA7MuGsA==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.35.4.tgz",
      "integrity": "sha512-hWniXY3bG5qKpkKrAwPe4y+VTPmf086YQAnkxWh7uA1YrlRouWGa0M0Mxj3ZjnXFkv7/TD1bTy9lGUK26vRvWw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-freebsd-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-freebsd-wasm32/-/sharp-freebsd-wasm32-0.35.4.tgz",
      "integrity": "sha512-lIsKw/BU+kjB4eZjxrYrZmwOJYi3Ajrv66iAlBmUPyKc3HpnloevB1g3wxGD9P/5BbQ1brBGl65VRRrCvQDEqA==",
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.3.3.tgz",
      "integrity": "sha512-suTBPTDGrI9WodccaDdwZItTSaBYASlBk1NSfElSHrUfzu3szG6lvIF58+WiFvnfzuK8ZBFS5zE00PxqxnRiPg==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.3.3.tgz",
      "integrity": "sha512-FVJZ5mITMobmXIz/hPDTw0EintTW5H3WfrxwLqEqjiIihlu+hVRyGrFQ60xl0Lxn7Bt3zdpevPaQi0HEzqz9fw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.3.3.tgz",
      "integrity": "sha512-3rbU4vqXXc3hY/OiXdl52xZvT0F1yEngWfvqudtPJg/KkyiaQw2DRsFrNzpmLvfavbwOq3qXn36GP8obHRULQA==",
      "cpu": [
        "arm"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.3.3.tgz",
      "integrity": "sha512-0DaL0A6Xu6sQSQFwe4iVCrKWU2cCTItnRsYsCdxAMm9NF6twAA9BKnoqy4hqz4+azQ0JHuA26qiUKsf1XJ/v5A==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.3.3.tgz",
      "integrity": "sha512-cdn1OvUBwsXhbC0zSzJnNzf5MZ/mTrobawDvNXBTxe8VtqKAm0sRuEY2Evzovb/w9JMk4TvRxqt1mekSuJz64w==",
      "cpu": [
        "ppc64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.3.3.tgz",
      "integrity": "sha512-HjPVx7yKz+0lqdhDlTw1tt90wamBoxhiXpvl1XZpJLiHH4RCJ5yDTqH+VlYPv2fwFs89JFw4c1IexYOcQUi4IQ==",
      "cpu": [
        "riscv64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.3.3.tgz",
      "integrity": "sha512-neWLh+3yCNThxnfy3c4BbVBeGgt9aftno+XbT56iK28RgeDs3UOFWviLWlUu0bArYVYJaFDK+RRohbicUNCm8Q==",
      "cpu": [
        "s390x"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.3.3.tgz",
      "integrity": "sha512-4vKmvAst9nrowcqquKFAyZJUDolUaIp8uRiN0mWFguJ1IplC9/pitXtlnnlU4aa/eJw3J7i67V+pwUL+wZGdsA==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.3.3.tgz",
      "integrity": "sha512-Y9kQaLMuNoB0bPYOOdcZMaseNrFpPodIWWMrx+CZyydf2xn68j9WYc6sWWRrDwNkzCQjKYfc68L7jKjGlHMibw==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.3.3.tgz",
      "integrity": "sha512-fj8Mv0HHfD1Rr+4I68+3agJynxDWtBFgicTbSOb9Bke6pIwzGcJ+RX/yHjmiEGFMCavY/dxvem7MyNaJF+wDiw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.35.4.tgz",
      "integrity": "sha512-7OAS8gI0EReKGVN2HssHlM6umJgxF5VI3xN0p9FA91p/YO+ou5hiNghLdZ5BEHztwaaK5+bLKRf8x/o2L2nk9A==",
      "cpu": [
        "arm"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.35.4.tgz",
      "integrity": "sha512-De4jpEnAU8Hd5oT0j1G3uL4ZvTuipVMn7YC6vPaJhy6/7EwEae0SVAoBrUMYQbkLGDm85taVWwuPc1a44LTzCQ==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.35.4.tgz",
      "integrity": "sha512-2oYZJeIl4kCcMGk4ouZVjnkCtFrpQFlNEtJ6GbxzhHQchwH0NH/qEb9ykmOl29dqwMq+JhFdZn+1ak2FKhI9fQ==",
      "cpu": [
        "ppc64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.35.4.tgz",
      "integrity": "sha512-cPbNChoRURAWdebDIHSenxRpgEdy7JkPydSnUxRm9VvKD7m0/xVaR/8Fzlu81pk5nHEvHH87UZUA7cTtwnbJSA==",
      "cpu": [
        "riscv64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.35.4.tgz",
      "integrity": "sha512-RY0JFY8Fd6RonCBtHz+DvadaPkXDSI1AUn6yWL9TipqkZ1vY8w8evqdgyDFnkm4/K1ve1TvZiaePP5oSd4+WVQ==",
      "cpu": [
        "s390x"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.35.4.tgz",
      "integrity": "sha512-9qvvEAuk8k89TfWUoX2htWjbAMX8p+NxCppjpcg5k6xMsjhBQPTsoIh36h9Qde4WRuGpJeYnOjdosDn/cnv+OA==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.35.4.tgz",
      "integrity": "sha512-KB5jxpfWQTr0nc3xdHtWChdbifHrBGsd2SM62Eyxrl8afikm+f5qGBU75SJIZBT/S1MC8XyacdlXBMSWq6OURA==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.35.4.tgz",
      "integrity": "sha512-f+eZJZIQNEEd26RPSW+76chwOf1XtA2Y/O+5ocVyLliHkeih3e+jhLVBdNTd2rS3IbNXK8+ug93Vf5ZXtF5Lxg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.35.4.tgz",
      "integrity": "sha512-zQnl4Kwp7Q6NHsENtU2T/00Zi+w3AQNwz3+UaTyVBy2FpXrzXzGjndpK61onhZjRtRpQXxCTeqw19bVyXOh7jA==",
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.11.3"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-webcontainers-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-webcontainers-wasm32/-/sharp-webcontainers-wasm32-0.35.4.tgz",
      "integrity": "sha512-ESfNkywmCfPNyaZjxooddJQiQ+l/nTpGEOGthxiLnIHXC/CmcBixnfwUleX9mCz9ovrUUvKMap/pm8RYbzfwaA==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.35.4.tgz",
      "integrity": "sha512-iNdlBX9gLVvqe2I3uIJSIKTq6wckP/DYxZtcqxm09x5Gi24DnFBmPAWZmr60ZyYMG0xlzo6goG3670ar+RXvRw==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.35.4.tgz",
      "integrity": "sha512-kqRsbaa5CS6KHlpxnN7WhE6vAAugXyZButpRdvDWetlv6Qv4N9WTcrWzF7tXfB9T7MsoadqdI8hmwLq6UlLvtw==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.35.4.tgz",
      "integrity": "sha512-XtmnYhBcrORsJ4XJngyzr/EWP0hRZLAZRFaApdKuviyqF78+ylxh2y06ZmtULAMOnObJ3ucpN0AcwSWnMowTRg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@mediapipe/tasks-vision": {
      "version": "0.10.17",
      "resolved": "https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.17.tgz",
      "integrity": "sha512-CZWV/q6TTe8ta61cZXjfnnHsfWIdFhms03M9T7Cnd5y2mdpylJM0rF1qRq+wsQVRMLz1OYPVEBU9ph2Bx8cxrg==",
      "license": "Apache-2.0"
    },
    "node_modules/@monogrid/gainmap-js": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/@monogrid/gainmap-js/-/gainmap-js-3.4.0.tgz",
      "integrity": "sha512-2Z0FATFHaoYJ8b+Y4y4Hgfn3FRFwuU5zRrk+9dFWp4uGAdHGqVEdP7HP+gLA3X469KXHmfupJaUbKo1b/aDKIg==",
      "license": "MIT",
      "dependencies": {
        "promise-worker-transferable": "^1.0.4"
      },
      "peerDependencies": {
        "three": ">= 0.159.0"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.4.tgz",
      "integrity": "sha512-AJxoUD2/15ESHbvpcyjU274nsAPLuOtPHCk0vKJM5pj//Fg/B1FXNWjPnXTT9PymCYYiHo4zPj0ZomXBKhoy7g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || ^2.0.0-alpha.4",
        "@emnapi/runtime": "^1.7.1 || ^2.0.0-alpha.4"
      }
    },
    "node_modules/@next/env": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.3.6.tgz",
      "integrity": "sha512-x9Vblze1EbtltQYnNH38xCPWU3TVfBd1eXqA3+w9+BTpedkkdNpAaltXlGQ/nsc1+E0mVTNrtcbX3GoO09zeLQ==",
      "license": "MIT"
    },
    "node_modules/@next/eslint-plugin-next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.3.6.tgz",
      "integrity": "sha512-jowwDX+7DOlDIjJLgTMxudw+k37QnWu1JkZLkSi9MaJBfDYcfhAPMKBhXL0idYzFN/AGg//axnOR4cLkHX/Rng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "4.9.1",
        "fast-glob": "3.3.1"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.3.6.tgz",
      "integrity": "sha512-E/7GEqaUkt8mk/T8v9lAnrhzR06kdq1ZBkC12F8tAMkdIadwNp3H1KqHynDHrpcTlGCUdq/qu6vUL2aYVyYBdw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.3.6.tgz",
      "integrity": "sha512-yBE893/nDWTlaiBD1p+qgt7NUen4U5R6FXyH0s67Npq1S3E0cVSef1WIXC2xBRgQvwAvJq6DnS6Y6PrY0cy4Ew==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.3.6.tgz",
      "integrity": "sha512-KJDpjBqBPYlvkivmyrp+Qys6k/7ksbqGQvRVc6ZEGfR+cjQxx+nUkJaWmNZJsmoOrqYNbaXByF8wa0lBwDhB3Q==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.3.6.tgz",
      "integrity": "sha512-mqNg2K+hvWskSRb/QM+Ix412DvBsuSF0XV+frTSw5vmoucNnIlynFwKYew8D01bfATErMOM7Bujrf0BA5DRKFA==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.3.6.tgz",
      "integrity": "sha512-nFncBNGAYouRHjRVaITs9beZRfhX4ssVwpnvPIAbkZVH6LtGoAVlH4bJ8Cnf9SOo9bsXgPFer/GdHtEE3JNOkw==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.3.6.tgz",
      "integrity": "sha512-5Mf3cHDGR/Iz0ng2Bj3zUR3p5QS9YK3Hn2QiAfavFmyF48zwThAjpFoiTKNIcOHLYS4zEk+gzyJ/9deQ2ZB8yQ==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.3.6.tgz",
      "integrity": "sha512-0jkJy0C2kbrJWTk4YLa3xk80pVBpx8FCHJym7CnUfDAXe/FWv5qT7SQJbR0KuemyxaEDlEx5WT4VQJoTW+/9Qw==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.3.6.tgz",
      "integrity": "sha512-/YXjI1e5OXcZ7YpxRwgP/1jAV/SBKTzeVKqN2mk7mLpcICsyn3Gl5+dIfDTJp70M0ccMhyMMRso4v6mPDCGepg==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nolyfill/is-core-module": {
      "version": "1.0.39",
      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.4.0"
      }
    },
    "node_modules/@react-three/drei": {
      "version": "10.7.9",
      "resolved": "https://registry.npmjs.org/@react-three/drei/-/drei-10.7.9.tgz",
      "integrity": "sha512-wP4Y6o58KFi+hT1zCfjJarRtPCT6WW/lo53WMiA/aCORuUvBzW916XsCtadnIB1KB+3IQNcDU5JeVh/gYb8MYw==",
      "license": "MIT",
      "dependencies": {
        "@babel/runtime": "^7.26.0",
        "@mediapipe/tasks-vision": "0.10.17",
        "@monogrid/gainmap-js": "^3.0.6",
        "@use-gesture/react": "^10.3.1",
        "camera-controls": "^3.1.0",
        "cross-env": "^7.0.3",
        "detect-gpu": "^5.0.56",
        "glsl-noise": "^0.0.0",
        "hls.js": "^1.5.17",
        "maath": "^0.10.8",
        "meshline": "^3.3.1",
        "stats-gl": "^2.2.8",
        "stats.js": "^0.17.0",
        "suspend-react": "^0.1.3",
        "three-mesh-bvh": "^0.8.3",
        "three-stdlib": "^2.35.6",
        "troika-three-text": "^0.52.4",
        "tunnel-rat": "^0.1.2",
        "use-sync-external-store": "^1.4.0",
        "utility-types": "^3.11.0",
        "zustand": "^5.0.1"
      },
      "peerDependencies": {
        "@react-three/fiber": "^9.0.0",
        "react": "^19",
        "react-dom": "^19",
        "three": ">=0.159"
      },
      "peerDependenciesMeta": {
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/@react-three/fiber": {
      "version": "9.8.1",
      "resolved": "https://registry.npmjs.org/@react-three/fiber/-/fiber-9.8.1.tgz",
      "integrity": "sha512-GbNP4r6F/gpclFKkLGHzXcuwFWAzLyKsmrQGcDuwK3wQnwLH6F1TfGtEYjHy8OQoGsajwT19B9jtVLLjjfH09w==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@babel/runtime": "^7.17.8",
        "@types/webxr": "*",
        "base64-js": "^1.5.1",
        "buffer": "^6.0.3",
        "its-fine": "^2.1.1",
        "react-use-measure": "^2.1.7",
        "scheduler": "^0.28.0",
        "suspend-react": "^0.1.3",
        "use-sync-external-store": "^1.4.0",
        "zustand": "^5.0.3"
      },
      "peerDependencies": {
        "expo": ">=43.0",
        "expo-asset": ">=8.4",
        "expo-file-system": ">=11.0",
        "expo-gl": ">=11.0",
        "react": ">=19 <19.4",
        "react-dom": ">=19 <19.4",
        "react-native": ">=0.78",
        "three": ">=0.156"
      },
      "peerDependenciesMeta": {
        "expo": {
          "optional": true
        },
        "expo-asset": {
          "optional": true
        },
        "expo-file-system": {
          "optional": true
        },
        "expo-gl": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        },
        "react-native": {
          "optional": true
        }
      }
    },
    "node_modules/@react-three/fiber/node_modules/scheduler": {
      "version": "0.28.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.28.0.tgz",
      "integrity": "sha512-juorfCmIkIw8tT+p5BXSm6PJjQF/ycEYmKyzURCIt/RaZIhL+PulbQ9Yu2z1HdOJDdqDTlxA1+xKBmHXJsczAw==",
      "license": "MIT"
    },
    "node_modules/@reduxjs/toolkit": {
      "version": "2.12.0",
      "resolved": "https://registry.npmjs.org/@reduxjs/toolkit/-/toolkit-2.12.0.tgz",
      "integrity": "sha512-KiT+RzZbp6mQET+Mg+h2c97+9j1sNflUxQkIHI7Yuzf6Peu+OYpmkn6nbHWmLLWj+1ZODUJFwGZ7gx3L9R9EOw==",
      "license": "MIT",
      "dependencies": {
        "@standard-schema/spec": "^1.0.0",
        "@standard-schema/utils": "^0.3.0",
        "immer": "^11.0.0",
        "redux": "^5.0.1",
        "redux-thunk": "^3.1.0",
        "reselect": "^5.1.0"
      },
      "peerDependencies": {
        "react": "^16.9.0 || ^17.0.0 || ^18 || ^19",
        "react-redux": "^7.2.1 || ^8.1.3 || ^9.0.0"
      },
      "peerDependenciesMeta": {
        "react": {
          "optional": true
        },
        "react-redux": {
          "optional": true
        }
      }
    },
    "node_modules/@rtsao/scc": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
      "integrity": "sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@standard-schema/spec": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/spec/-/spec-1.1.0.tgz",
      "integrity": "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/@standard-schema/utils": {
      "version": "0.3.0",
      "resolved": "https://registry.npmjs.org/@standard-schema/utils/-/utils-0.3.0.tgz",
      "integrity": "sha512-e7Mew686owMaPJVNNLs55PUvgz371nKgwsc4vxE49zsODpJEnxgxRo2y/OKrqueavXgZNMDVj3DdHFlaSAeU8g==",
      "license": "MIT"
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tailwindcss/node": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.3.3.tgz",
      "integrity": "sha512-/T8IKEsf9VTU6tLjgC7+sv2mOPtQxzE2jMw7u4Tt40Tx+QSZxpzh95/H6cMKoja9XuW7iMdLJYBB0o9G1CaAgg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/remapping": "^2.3.5",
        "enhanced-resolve": "^5.24.1",
        "jiti": "^2.7.0",
        "lightningcss": "1.32.0",
        "magic-string": "^0.30.21",
        "source-map-js": "^1.2.1",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/node/node_modules/tailwindcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.3.3.tgz",
      "integrity": "sha512-gOhV3P7ufE62QDGg1zVaTgCR+EtPv92k2nIhVcVKcLmxT1sUBsQGhnZj175j+MqRt4zLF7ic+sCYjfhxMxj7YQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tailwindcss/oxide": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.3.3.tgz",
      "integrity": "sha512-krXjAikiaFSPaK/FkAQT5UTx3VormQaiZ5hBFlJZ9UFQGB/rwg1MZIhHAG9smMQRTdyJxP6Qt5MwMtdyU5FWrA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "optionalDependencies": {
        "@tailwindcss/oxide-android-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-x64": "4.3.3",
        "@tailwindcss/oxide-freebsd-x64": "4.3.3",
        "@tailwindcss/oxide-linux-arm-gnueabihf": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-musl": "4.3.3",
        "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
        "@tailwindcss/oxide-wasm32-wasi": "4.3.3",
        "@tailwindcss/oxide-win32-arm64-msvc": "4.3.3",
        "@tailwindcss/oxide-win32-x64-msvc": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide-android-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.3.3.tgz",
      "integrity": "sha512-Y85A2gmPSkl5Ve5qR86GL4HT509cFqQh1aes9p3sSkyTPwt0Pppf3GkwGe4JPACcRYjgJIEhQgM6dBClnr0NYw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.3.3.tgz",
      "integrity": "sha512-BiaWatpBcERQFDlOjRDpIVXuFK5PJez5SA4JMg6VYZdBYU+qKfV/vqjcIs+IYmtitf1xYQZTwXvU/8y4lfZUGw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.3.3.tgz",
      "integrity": "sha512-fAeUqfV5ndhxRwai8cXGzdLvul9utWOmeTkv69unv4ZXixjn61Z+p9lCWdwOwA3TYboG3BwdVuN/RDjhBRl0mw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-freebsd-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.3.3.tgz",
      "integrity": "sha512-iyf5bV6+wnAlflVeEy7R25dupxTNECZN5QMI0qNT6eT+EgaGdZcKhGkr5SdoaWiLJ3spLqIY9VCeSGrwmtg4kw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.3.3.tgz",
      "integrity": "sha512-aAYUprJAJQWWbRrPvtjdroZ56Md+JM8pMiopS6xGEwDfLhqj+2ver2p4nU4Mb3CRqcMmNBjo8KkUgcxhkzVQGQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.3.3.tgz",
      "integrity": "sha512-nDxldcEENOxZRzC2uu9jrutZdAAQtb+8WWDCSnWL1zvBk1+FN+x6MtDViPB5AJMfttVCUhehGWus3XBPgatM/w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.3.3.tgz",
      "integrity": "sha512-Md44bD6veX/PC5iyF8cDVnw4HBIANZepRZZ7a8DQOvkfo5WUBwcp6iAuCUz23u+4SUkhJlD3eL7hNdW8ezd/kA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.3.3.tgz",
      "integrity": "sha512-tx7us1muwOKAKWao2v/GaafFeQboE6aj88vC6ziN2NCGcRm8gWUhwjzg+YdVB1e4boAtdtma4L43onunI6NS4w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.3.3.tgz",
      "integrity": "sha512-SJxX60smvHgasZoBy11dX6YRjXJFovwWBoedhbQPOBzgFWBHGB+TVPWB9BxzR7TTxU8FQZAI2AyiNCMzFm8Img==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-wasm32-wasi": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.3.3.tgz",
      "integrity": "sha512-jx1+rPhY/5Ympkktd656HBWEBLxP7dH06losBLjjf5vgCODXvi9KhtftWcMIwTFIDqBr7cRnQkdLnAG+IOlGvQ==",
      "bundleDependencies": [
        "@napi-rs/wasm-runtime",
        "@emnapi/core",
        "@emnapi/runtime",
        "@tybys/wasm-util",
        "@emnapi/wasi-threads",
        "tslib"
      ],
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.11.1",
        "@emnapi/runtime": "^1.11.1",
        "@emnapi/wasi-threads": "^1.2.2",
        "@napi-rs/wasm-runtime": "^1.1.4",
        "@tybys/wasm-util": "^0.10.2",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.3.3.tgz",
      "integrity": "sha512-3rc292Ca2ceK6Ulcc/bAVnTs/3nDtoPhyEKlgPv+yQJQi/JS/AMJlqzxvlDacL1nekbrcf6bTqp/jV4qgnPxNQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.3.3.tgz",
      "integrity": "sha512-yJ0pwIVc/nYeGoV02WtsN8KYyLQv7kyI2wDnkezyJlGGjkd4QLwDGAwl47YpPJeuI0M0ObaXGSPjvWDPeTPggw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/postcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.3.3.tgz",
      "integrity": "sha512-JTSZZGQi1AyKirbLN3azmjVzef92tcX7h+iSqPdaeStyFpGpDlKvvpxeOE8njhbUanbRwr3z8DyzhICWnMtQeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "@tailwindcss/node": "4.3.3",
        "@tailwindcss/oxide": "4.3.3",
        "postcss": "^8.5.16",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/postcss/node_modules/tailwindcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.3.3.tgz",
      "integrity": "sha512-gOhV3P7ufE62QDGg1zVaTgCR+EtPv92k2nIhVcVKcLmxT1sUBsQGhnZj175j+MqRt4zLF7ic+sCYjfhxMxj7YQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@tanstack/query-core": {
      "version": "5.103.2",
      "resolved": "https://registry.npmjs.org/@tanstack/query-core/-/query-core-5.103.2.tgz",
      "integrity": "sha512-I8DkFXls5jXLqtm8+QpOhEmG07hIblhSZFzafg9wHsMSEvMzULy9hK17wU1T/ahfhMbtITJhbxutwwCoihkR7A==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/tannerlinsley"
      }
    },
    "node_modules/@tanstack/react-query": {
      "version": "5.103.2",
      "resolved": "https://registry.npmjs.org/@tanstack/react-query/-/react-query-5.103.2.tgz",
      "integrity": "sha512-B+fWiYZBc+0uUD5zDZAeLw9dKj7XEsdnuu6zRZ+no6LNKpeE3P3bJ+N6HINjcIlWR6fW3vUoTneEaGa2V6ehqw==",
      "license": "MIT",
      "dependencies": {
        "@tanstack/query-core": "5.103.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/tannerlinsley"
      },
      "peerDependencies": {
        "react": "^18 || ^19"
      }
    },
    "node_modules/@tweenjs/tween.js": {
      "version": "23.1.3",
      "resolved": "https://registry.npmjs.org/@tweenjs/tween.js/-/tween.js-23.1.3.tgz",
      "integrity": "sha512-vJmvvwFxYuGnF2axRtPYocag6Clbb5YS7kLL+SO/TeVFzHqDIWrNKYtcsPMibjDx9O+bu+psAy9NKfWklassUA==",
      "license": "MIT"
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.4",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.4.tgz",
      "integrity": "sha512-W3c4gRigFS0T/Ma4qIYF3GDAc5AQdHb1yL5znJT1Zv1YaD9Kitx656wBjvr19qbiosmZT8lWDM5BEMynUqX65A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/d3-array": {
      "version": "3.2.2",
      "resolved": "https://registry.npmjs.org/@types/d3-array/-/d3-array-3.2.2.tgz",
      "integrity": "sha512-hOLWVbm7uRza0BYXpIIW5pxfrKe0W+D5lrFiAEYR+pb6w3N2SwSMaJbXdUfSEv+dT4MfHBLtn5js0LAWaO6otw==",
      "license": "MIT"
    },
    "node_modules/@types/d3-color": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/@types/d3-color/-/d3-color-3.1.3.tgz",
      "integrity": "sha512-iO90scth9WAbmgv7ogoq57O9YpKmFBbmoEoCHDB2xMBY0+/KVrqAaCDyCE16dUspeOvIxFFRI+0sEtqDqy2b4A==",
      "license": "MIT"
    },
    "node_modules/@types/d3-ease": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-ease/-/d3-ease-3.0.2.tgz",
      "integrity": "sha512-NcV1JjO5oDzoK26oMzbILE6HW7uVXOHLQvHshBUW4UMdZGfiY6v5BeQwh9a9tCzv+CeefZQHJt5SRgK154RtiA==",
      "license": "MIT"
    },
    "node_modules/@types/d3-interpolate": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-interpolate/-/d3-interpolate-3.0.4.tgz",
      "integrity": "sha512-mgLPETlrpVV1YRJIglr4Ez47g7Yxjl1lj7YKsiMCb27VJH9W8NVM6Bb9d8kkpG/uAQS5AmbA48q2IAolKKo1MA==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-color": "*"
      }
    },
    "node_modules/@types/d3-path": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/@types/d3-path/-/d3-path-3.1.1.tgz",
      "integrity": "sha512-VMZBYyQvbGmWyWVea0EHs/BwLgxc+MKi1zLDCONksozI4YJMcTt8ZEuIR4Sb1MMTE8MMW49v0IwI5+b7RmfWlg==",
      "license": "MIT"
    },
    "node_modules/@types/d3-scale": {
      "version": "4.0.9",
      "resolved": "https://registry.npmjs.org/@types/d3-scale/-/d3-scale-4.0.9.tgz",
      "integrity": "sha512-dLmtwB8zkAeO/juAMfnV+sItKjlsw2lKdZVVy6LRr0cBmegxSABiLEpGVmSJJ8O08i4+sGR6qQtb6WtuwJdvVw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-time": "*"
      }
    },
    "node_modules/@types/d3-shape": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/@types/d3-shape/-/d3-shape-3.2.0.tgz",
      "integrity": "sha512-kVd74ta9eof3eJOvbNd1vGKS/XERRyQbT26Og63hIsvDO84cjD5gEOhsXf26w3FSoNlPVz84DOFcKv/oou+fMw==",
      "license": "MIT",
      "dependencies": {
        "@types/d3-path": "*"
      }
    },
    "node_modules/@types/d3-time": {
      "version": "3.0.4",
      "resolved": "https://registry.npmjs.org/@types/d3-time/-/d3-time-3.0.4.tgz",
      "integrity": "sha512-yuzZug1nkAAaBlBBikKZTgzCeA+k1uy4ZFwWANOfKw5z5LRhV0gNA7gNkKm7HoK+HRN0wX3EkxGk0fpbWhmB7g==",
      "license": "MIT"
    },
    "node_modules/@types/d3-timer": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/@types/d3-timer/-/d3-timer-3.0.2.tgz",
      "integrity": "sha512-Ps3T8E8dZDam6fUyNiMkekK3XUsaUEik+idO9/YjPtfj2qruF8tFBXS7XhtE4iIXBLxhmLjP3SXpLhVf21I9Lw==",
      "license": "MIT"
    },
    "node_modules/@types/draco3d": {
      "version": "1.4.10",
      "resolved": "https://registry.npmjs.org/@types/draco3d/-/draco3d-1.4.10.tgz",
      "integrity": "sha512-AX22jp8Y7wwaBgAixaSvkoG4M/+PlAcm3Qs4OW8yT9DM4xUpWKeFhLueTAyZF39pviAdcDdeJoACapiAceqNcw==",
      "license": "MIT"
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json5": {
      "version": "0.0.29",
      "resolved": "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz",
      "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "20.19.43",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.43.tgz",
      "integrity": "sha512-6oYBAi5ikg4Pl+kGsoYtawUMBT2zZMCvPNF7pVLnHZfd1zf38DRiWn/gT01RYCdUqkv7Fhr+C9ot4/tb+2sVvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/offscreencanvas": {
      "version": "2019.7.3",
      "resolved": "https://registry.npmjs.org/@types/offscreencanvas/-/offscreencanvas-2019.7.3.tgz",
      "integrity": "sha512-ieXiYmgSRXUDeOntE1InxjWyvEelZGP63M+cGuquuRLuIKKT1osnkXjxev9B7d1nXSug5vpunx+gNlbVxMlC9A==",
      "license": "MIT"
    },
    "node_modules/@types/react": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.3.0.tgz",
      "integrity": "sha512-N0rFCuH9YoxG9/m61l9MfpJKfmLOVU0em7ipIz6TRgSSkvReLB9vL85GB+yr8Bs5leqpvg96JSwF4ZS1s4viQg==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.3.0.tgz",
      "integrity": "sha512-ZI7bU42mZXXKHn/qNLEw2IrbiINU7X5+vfgdixBHkCNpYWXjKgfQ/P+uyGb5CjOLB9UcnTeg3rylQtV2hym44Q==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.3.0"
      }
    },
    "node_modules/@types/react-reconciler": {
      "version": "0.28.9",
      "resolved": "https://registry.npmjs.org/@types/react-reconciler/-/react-reconciler-0.28.9.tgz",
      "integrity": "sha512-HHM3nxyUZ3zAylX8ZEyrDNd2XZOnQ0D5XfunJF5FLQnZbHHYq4UWvW1QfelQNXv1ICNkwYhfxjwfnqivYB6bFg==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "*"
      }
    },
    "node_modules/@types/stats.js": {
      "version": "0.17.4",
      "resolved": "https://registry.npmjs.org/@types/stats.js/-/stats.js-0.17.4.tgz",
      "integrity": "sha512-jIBvWWShCvlBqBNIZt0KAshWpvSjhkwkEu4ZUcASoAvhmrgAUI2t1dXrjSL4xXVLB4FznPrIsX3nKXFl/Dt4vA==",
      "license": "MIT"
    },
    "node_modules/@types/three": {
      "version": "0.185.0",
      "resolved": "https://registry.npmjs.org/@types/three/-/three-0.185.0.tgz",
      "integrity": "sha512-O2Uy8Cj4Nonr8dWUUbifMdPe8B0Mq7EdOHb89S4+kjUw/KhbjTZrUuYlrQ1bpUKG+EP9QJnN7qNxbHGlGoLHMA==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@dimforge/rapier3d-compat": "~0.12.0",
        "@tweenjs/tween.js": "~23.1.3",
        "@types/stats.js": "*",
        "@types/webxr": ">=0.5.17",
        "fflate": "~0.8.2",
        "meshoptimizer": "~1.1.1"
      }
    },
    "node_modules/@types/use-sync-external-store": {
      "version": "0.0.6",
      "resolved": "https://registry.npmjs.org/@types/use-sync-external-store/-/use-sync-external-store-0.0.6.tgz",
      "integrity": "sha512-zFDAD+tlpf2r4asuHEj0XH6pY6i0g5NeAHPn+15wk3BV6JA69eERFXC1gyGThDkVa1zCyKr5jox1+2LbV/AMLg==",
      "license": "MIT"
    },
    "node_modules/@types/webxr": {
      "version": "0.5.24",
      "resolved": "https://registry.npmjs.org/@types/webxr/-/webxr-0.5.24.tgz",
      "integrity": "sha512-h8fgEd/DpoS9CBrjEQXR+dIDraopAEfu4wYVNY2tEPwk60stPWhvZMf4Foo5FakuQ7HFZoa8WceaWFervK2Ovg==",
      "license": "MIT"
    },
    "node_modules/@typescript-eslint/eslint-plugin": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.70.1.tgz",
      "integrity": "sha512-nDNrUQ/4ruSNYbu749TRY7cfrzPtoLHEXSNBI8aaNY32LlZCajixqRf3FqcKC4p5Cam4VOHYx/t+i5+nKXvrqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/regexpp": "^4.12.2",
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/type-utils": "8.70.1",
        "@typescript-eslint/utils": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "ignore": "^7.0.5",
        "natural-compare": "^1.4.0",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "@typescript-eslint/parser": "^8.70.1",
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore": {
      "version": "7.0.10",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-7.0.10.tgz",
      "integrity": "sha512-HpbUakT7xp5miBUywCHf36ZEuAJNklBJDDsGpUIjMzOSmM8ELSfA9Sa/QDPeNeqeoN31u+UTCkL4klCOVvRm4Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/@typescript-eslint/parser": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-8.70.1.tgz",
      "integrity": "sha512-nO974WLllwhSFWQXnMLj6nDGa8f0khKEz1JzpPJ1u7Vm/4X1X6ZHajpoknU4bb41vJyMB0HHVyS2GqdhWfIXZw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/project-service": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/project-service/-/project-service-8.70.1.tgz",
      "integrity": "sha512-62xOgboPfwc3/IgPSX/W6oQR3ZbF04194FPGUGH8HL8iLFHbt/456/8Ph1wLNUgVF+s94FlHoipBsz+v7+LMnA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/tsconfig-utils": "^8.70.1",
        "@typescript-eslint/types": "^8.70.1",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/scope-manager": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.70.1.tgz",
      "integrity": "sha512-Pa0EeSeAusQc1WbjQMac+YfenewYTBu0KjgYvkUKwhXaHUKbFog23Dm/rp0DX/6tyYOQ3Xl1a+3EcFNZynGHCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/tsconfig-utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.70.1.tgz",
      "integrity": "sha512-jumze1fPI+sDOaM2TWGQdn39PDxTr7TZGeuyLkAbNyx2vtMT3uRnVKChN0hfht5V2TugphJzF6bYXvBcE09qqg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/type-utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.70.1.tgz",
      "integrity": "sha512-7zKTnyvaVWqzLZHPFQtX1hVHqgkMC+WebPWakNCSyrQVbIP1AM0L0TlBZtACldIRb6PptI8Odk+jyZ5kP3B1VA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/utils": "8.70.1",
        "debug": "^4.4.3",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/types": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.70.1.tgz",
      "integrity": "sha512-Dm1ypdhhrGCTyyehxElhgJ6kgk8MVCv5qXdoOVqPr1uqk42jX8KjrZqhROvdShczA8qrDoYiOWn1ykWlx2k81Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.70.1.tgz",
      "integrity": "sha512-TU8PwyGN0PQJUcE96mw8eCQ44SmxGdQlJmlWakHaHQ15eIuuvye5yNtmh/i6oS88jzXVQB71xdNkbkB/fMwL0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/project-service": "8.70.1",
        "@typescript-eslint/tsconfig-utils": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/visitor-keys": "8.70.1",
        "debug": "^4.4.3",
        "minimatch": "^10.2.2",
        "semver": "^7.7.3",
        "tinyglobby": "^0.2.15",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion": {
      "version": "5.0.12",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.12.tgz",
      "integrity": "sha512-YovQ3rzhaLMIrDjNDMkNS01tea93qhEhG5xy8f6+R0l+dw3Ki+5sCoIoI942iuLZTHWogWktgwVDhU09iNEimQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@typescript-eslint/utils": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.70.1.tgz",
      "integrity": "sha512-Esgul8MsnKnRLdYU2Eb2cRV9bS5HJYtKj1ByJnOzzG2M58DGdSUQ1jUuILxipqcpB2h9WLrbD5GijIWUjX/Tqw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.9.1",
        "@typescript-eslint/scope-manager": "8.70.1",
        "@typescript-eslint/types": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.70.1.tgz",
      "integrity": "sha512-Vwj9lUIW5Xq3wQ9w6gv3R86g1hMK8f2zNOdGTAgeXUMMXFK78G9ruCjjqutHMNJc0+CH7LYRnHeUB9IT8wFmcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.1",
        "eslint-visitor-keys": "^5.0.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-5.0.1.tgz",
      "integrity": "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=24"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@unrs/resolver-binding-android-arm-eabi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm-eabi/-/resolver-binding-android-arm-eabi-1.12.2.tgz",
      "integrity": "sha512-g5T90pqg1bo/7mytQx6F4iBNC0Wsh9cu+z9veDbFjc7HjpesJFWD7QMS0NGStXM075+7dJPPVvBbpZlnrdpi/w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-android-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm64/-/resolver-binding-android-arm64-1.12.2.tgz",
      "integrity": "sha512-YGCRZv/9GLhwmz6mYDeTsm/92BAyR28l6c2ReweVW5pWgfsitWLY8upvfRlGdoyD8HjeTHSYJWyZGD4KJA/nFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-arm64/-/resolver-binding-darwin-arm64-1.12.2.tgz",
      "integrity": "sha512-u9DiNT1auQMO20A9SyTuG3wUgQWB9Z7KjAg0uFuCDR1FsAY8A0CG2S6JpHS1xwm/w1G08bjXZDcyOCjv1WAm2w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-x64/-/resolver-binding-darwin-x64-1.12.2.tgz",
      "integrity": "sha512-f7rPLi/T1HVKZu/u6t87lroib16n8vrSzcyxI7lg4BGO9UF26KhQL44sd9eOUgrTYhvRXtWOIZT5PejdPyJfUA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-freebsd-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-freebsd-x64/-/resolver-binding-freebsd-x64-1.12.2.tgz",
      "integrity": "sha512-BpcOjWCJub6nRZUS2zA20pmLvjtqAtGejETaIyRLiZiQf++cbrjltLA5NN/xaXfqeOBOSlMFbemIl5/S5tljmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-gnueabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-gnueabihf/-/resolver-binding-linux-arm-gnueabihf-1.12.2.tgz",
      "integrity": "sha512-vZTDvdSISZjJx66OzJqtsOhzifbqRjbmI1Mnu49fQDwog5GtDI4QidRiEAYbZCRj9C8YZEW+3ZjqsyS9GR4k2A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-musleabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-musleabihf/-/resolver-binding-linux-arm-musleabihf-1.12.2.tgz",
      "integrity": "sha512-BiPI+IrIlwcW4nLLMM21+B1dFPzd55yAVgVGrdgDjNef+ch03GdxrcyaIz8X9SsQirh/kCQ7mviyWlMxdh2D7g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-gnu/-/resolver-binding-linux-arm64-gnu-1.12.2.tgz",
      "integrity": "sha512-zJc0H99FEPoFfSrNpa91HYfxzfAJCr502oxNK1cfdC9hlaFI43RT+JFCann9JUgZmLzzntChHyn13Sgn9ljHNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-musl/-/resolver-binding-linux-arm64-musl-1.12.2.tgz",
      "integrity": "sha512-KQ3Lki6l+Pz1k/eBipN41ES+YUK30beLGb9YqcB1O542cyLCNE6GaxrfcY3T6EezmGGk84wb5XyO9loTM9tkcA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-gnu/-/resolver-binding-linux-loong64-gnu-1.12.2.tgz",
      "integrity": "sha512-3SJGEh1DborhG6pyxvhPzCT4bbSIVihsvgJc13P1bHG7KLdNDaF9T3gsTwFc7Jw/5Y5/iWOjkEx7Zy0NvCGX3Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-musl/-/resolver-binding-linux-loong64-musl-1.12.2.tgz",
      "integrity": "sha512-jiuG/Obbel7uw1PwHNFfrkiKhLAF6mnyZ6aWlOAVN9WqKm8v0OFGnciJIHu8+CMvXLQ8AD51LPzAoUfT21D5Ew==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-ppc64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-ppc64-gnu/-/resolver-binding-linux-ppc64-gnu-1.12.2.tgz",
      "integrity": "sha512-q7xRvVpmcfeL+LlZg8Pbbo6QaTZwDU5BaGZbwfhkEsXJn3Was8xYfE0RBH266xZt0rM6B7i8xAYIvjthuUIWHg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-gnu/-/resolver-binding-linux-riscv64-gnu-1.12.2.tgz",
      "integrity": "sha512-0CVdx6lcnT3Q9inOH8tsMIOJ6ImndllMjqJHg8RLVdB7Vq4SfkEXl9mCSsVNuNA4MCYycRicCUxPCabVHJRr6A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-musl/-/resolver-binding-linux-riscv64-musl-1.12.2.tgz",
      "integrity": "sha512-iOwlRo9vnp6R6ohHQS11n0NnfdXx/omhkocmIfaPRpQhKZ+3BDMkkdRVh53qjkFkpPddf+FETA28NwGN7l5l+w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-s390x-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-s390x-gnu/-/resolver-binding-linux-s390x-gnu-1.12.2.tgz",
      "integrity": "sha512-HYJtLfXq94q8iZNFT1lknx258wlkkWhZeUXJRqzKBBUJ00CvZ+N33zgbCqimLjsyw5Va6uUxhVa12mI+kaveEw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-gnu/-/resolver-binding-linux-x64-gnu-1.12.2.tgz",
      "integrity": "sha512-mPsUhunKKDih5O96Y6enDQyHc1SqBPlY1E/SfMWDM3EdJ95Z9CArPeCVwCCqbP45ljvivdEk8Fxn+SIb1rDAJQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-musl/-/resolver-binding-linux-x64-musl-1.12.2.tgz",
      "integrity": "sha512-azrt6+5ydLd8Vt210AAFis/lZevSfPw93EJRIJG+xPu4WCJ8K0kppCTpMyLPcKT7H15M4Jnt2tMp5bOvCkRC6A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-openharmony-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-openharmony-arm64/-/resolver-binding-openharmony-arm64-1.12.2.tgz",
      "integrity": "sha512-YZ9hP4O0X9PQb8eO980qmLNGH4zT3I9+SZTdt0Pr0YyuGQhYKoOZkV02VzrzyOZJ5xIJ3UFIenKkUkGg8GjgWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-wasm32-wasi/-/resolver-binding-wasm32-wasi-1.12.2.tgz",
      "integrity": "sha512-tYFDIkMxSflfEc/h92ZWNsZlHSwgimbNHSO3PL2JWQHfCuC2q316jMyYU9TIWZsFK2bQwyK5VAdYgn8ygPj69A==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "1.10.0",
        "@emnapi/runtime": "1.10.0",
        "@napi-rs/wasm-runtime": "^1.1.4"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-win32-arm64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-arm64-msvc/-/resolver-binding-win32-arm64-msvc-1.12.2.tgz",
      "integrity": "sha512-qzNyg3xL0VPQmCaUh+N5jSitce6k+uCBfMDesWRnlULOZaqUkaJ0ybdT+UqlAWJoQjuqfIU/0Ptx9bteN4D82g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-ia32-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-ia32-msvc/-/resolver-binding-win32-ia32-msvc-1.12.2.tgz",
      "integrity": "sha512-WD9sY00OfpHVGfsnHZoA8jVT+esS/Bg8z8jzxp5BnDCjjwsuKsPQrzswwpFy4J1AUJbXPRfkpcX0mXrzeXW79g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-x64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-x64-msvc/-/resolver-binding-win32-x64-msvc-1.12.2.tgz",
      "integrity": "sha512-nAB74NfSNKknqQ1RrYj6uz8FcXEomu/MATJZxh/x+BArzN2U3JbOYC0APYzUIGhVY3m5hRxA8VPNdPBoG8txlA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@use-gesture/core": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/@use-gesture/core/-/core-10.3.1.tgz",
      "integrity": "sha512-WcINiDt8WjqBdUXye25anHiNxPc0VOrlT8F6LLkU6cycrOGUDyY/yyFmsg3k8i5OLvv25llc0QC45GhR/C8llw==",
      "license": "MIT"
    },
    "node_modules/@use-gesture/react": {
      "version": "10.3.1",
      "resolved": "https://registry.npmjs.org/@use-gesture/react/-/react-10.3.1.tgz",
      "integrity": "sha512-Yy19y6O2GJq8f7CHf7L0nxL8bf4PZCPaVOCgJrusOeFHY1LvHgYXnmnXg6N5iwAnbgbZCDjo60SiM6IPJi9C5g==",
      "license": "MIT",
      "dependencies": {
        "@use-gesture/core": "10.3.1"
      },
      "peerDependencies": {
        "react": ">= 16.8.0"
      }
    },
    "node_modules/acorn": {
      "version": "8.18.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.18.0.tgz",
      "integrity": "sha512-lGq+9yr1/GuAWaVYIHRjvvySG5/4VfKIvC8EWxStPdcDh/Ka7FG3twP6v4d5BkravUilhIAsG4Qj83t02LWUPQ==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/agent-base": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
      "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "4"
      },
      "engines": {
        "node": ">= 6.0.0"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/any-promise": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
      "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
      "license": "MIT"
    },
    "node_modules/anymatch": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
      "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
      "license": "ISC",
      "dependencies": {
        "normalize-path": "^3.0.0",
        "picomatch": "^2.0.4"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/arg": {
      "version": "5.0.2",
      "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
      "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
      "license": "MIT"
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true,
      "license": "Python-2.0"
    },
    "node_modules/aria-query": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz",
      "integrity": "sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/array-buffer-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
      "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "is-array-buffer": "^3.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array-includes": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.2.0.tgz",
      "integrity": "sha512-VXY5eFRarnXcYxwBjJzPmEhH55+rmP79/+ueDhi0F+TuqfHCItagIHqxeUZrmgrOPa31QTh9H85DjX3FfJ0FTg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "es-shim-unscopables": "^1.1.0",
        "is-string": "^1.1.1",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlast": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
      "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlastindex": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.6.tgz",
      "integrity": "sha512-F/TKATkzseUExPlfvmwQKGITM3DGTK+vkAsCZoDc5daVygbJBnjEUCbgkAvVFsgfXfX4YIqZ/27G3k3tdXrTxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-shim-unscopables": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flat": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
      "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flatmap": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
      "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.tosorted": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
      "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3",
        "es-errors": "^1.3.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/arraybuffer.prototype.slice": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
      "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.1",
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "is-array-buffer": "^3.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ast-types-flow": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
      "integrity": "sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/async-function": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
      "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
      "license": "MIT"
    },
    "node_modules/autoprefixer": {
      "version": "10.6.1",
      "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.6.1.tgz",
      "integrity": "sha512-cL1Qz6ADZhcEbny/8HPfe99J6HhNoYtpX2LFLIbhgGE7Q1hlQVkYFdetDN7Id3KiQxhDrHwzlHr/YQCnZ8+xSA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/autoprefixer"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "browserslist": "^4.28.9",
        "caniuse-lite": "^1.0.30001810",
        "fraction.js": "^5.3.4",
        "picocolors": "^1.1.1",
        "postcss-value-parser": "^4.2.0"
      },
      "bin": {
        "autoprefixer": "bin/autoprefixer"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      },
      "peerDependencies": {
        "postcss": "^8.1.0"
      }
    },
    "node_modules/available-typed-arrays": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
      "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "possible-typed-array-names": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/axe-core": {
      "version": "4.13.0",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.13.0.tgz",
      "integrity": "sha512-UzGt8zg7Ny8djbYMhxl2zuEevVa7r2gJjYY5Lwr1xM7+XU2nd6CkIWFTVcCIbAP63vSz71NaVyyuSk9lHKcy0A==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axios": {
      "version": "1.20.0",
      "resolved": "https://registry.npmjs.org/axios/-/axios-1.20.0.tgz",
      "integrity": "sha512-r8aOh8j9cGKpgQAqpzrUHnSIc6a59Y3Xf/cv8sy1DrHCkZHzQGEuoq1tARk6qSyDdtQGSDgpb9kFlruzPvrgwg==",
      "license": "MIT",
      "dependencies": {
        "follow-redirects": "^1.16.0",
        "form-data": "^4.0.6",
        "https-proxy-agent": "^5.0.1",
        "proxy-from-env": "^2.1.0"
      }
    },
    "node_modules/axobject-query": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz",
      "integrity": "sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/base64-js": {
      "version": "1.5.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.5.1.tgz",
      "integrity": "sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.25",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.25.tgz",
      "integrity": "sha512-gMmEShwwq7FJqMwvfRwvCl00v4kN+KOfJqXn+f4nrufak5gNHJOksd/60Dvjuz7sI8Y5WiSFBa8FEYr+zoyqCw==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/bidi-js": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/bidi-js/-/bidi-js-1.1.0.tgz",
      "integrity": "sha512-fX1Onk0tdVPC7obPWB5EbJ1z7NVhLq4m2xZLq2YXBkxzMXIGRpNMU88n0EPgWseKl12J7zXs7qrDxPK4sRs2fg==",
      "license": "MIT",
      "dependencies": {
        "require-from-string": "^2.0.2"
      }
    },
    "node_modules/binary-extensions": {
      "version": "2.3.0",
      "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
      "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.21",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.21.tgz",
      "integrity": "sha512-9zeA+KLZNNzglF2TPKRQEDyx6Yby7daAkuy8MiPzpXPsYDWi/DRM8jmwUDxokQjYqBpv5DgPiwD4h4ZZSy1Ujw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.29.0",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.29.0.tgz",
      "integrity": "sha512-3GSvyjvDI4Dur1Meg2BekJquu5uF+9R9a1+5M1Mde192eZoXbeXjzgOsgqPS2V8D5wrrip0gR5Hf/GhWQ9ZzaA==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "baseline-browser-mapping": "^2.11.23",
        "caniuse-lite": "^1.0.30001810",
        "electron-to-chromium": "^1.5.427",
        "node-releases": "^2.0.55",
        "update-browserslist-db": "^1.3.3"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/buffer": {
      "version": "6.0.3",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-6.0.3.tgz",
      "integrity": "sha512-FTiCpNxtwiZZHEZbcbTIcZjERVICn9yq/pDFkTl95/AxzD1naBctN7YO68riM/gLSDY7sdrMby8hofADYuuqOA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "base64-js": "^1.3.1",
        "ieee754": "^1.2.1"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
      "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "get-intrinsic": "^1.3.0",
        "set-function-length": "^1.2.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/camelcase-css": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
      "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/camera-controls": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/camera-controls/-/camera-controls-3.1.2.tgz",
      "integrity": "sha512-xkxfpG2ECZ6Ww5/9+kf4mfg1VEYAoe9aDSY+IwF0UEs7qEzwy0aVRfs2grImIECs/PoBtWFrh7RXsQkwG922JA==",
      "license": "MIT",
      "engines": {
        "node": ">=22.0.0",
        "npm": ">=10.5.1"
      },
      "peerDependencies": {
        "three": ">=0.126.1"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001810",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001810.tgz",
      "integrity": "sha512-TITQPUkaz+aVk5GL6NhOdwk1aEaNTSDPsGFWrTuhKGtjTF70jL/Oht2W4c6rXUe5fu7Ie19VIahAXHIIiWWNeg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/chokidar": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
      "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
      "license": "MIT",
      "dependencies": {
        "anymatch": "~3.1.2",
        "braces": "~3.0.2",
        "glob-parent": "~5.1.2",
        "is-binary-path": "~2.1.0",
        "is-glob": "~4.0.1",
        "normalize-path": "~3.0.0",
        "readdirp": "~3.6.0"
      },
      "engines": {
        "node": ">= 8.10.0"
      },
      "funding": {
        "url": "https://paulmillr.com/funding/"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      }
    },
    "node_modules/chokidar/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/clsx": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
      "integrity": "sha512-eYm0QWBtUrBWZWG0d386OGAw16Z995PiOVo2B7bjWSbHedGl5e0ZWaq65kOGgUSNesEIDkB9ISbTg/JK9dhCZA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "license": "MIT",
      "dependencies": {
        "delayed-stream": "~1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/commander": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
      "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-env": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/cross-env/-/cross-env-7.0.3.tgz",
      "integrity": "sha512-+/HKd6EgcQCJGh2PSjZuUitQBQynKor4wrFbRg4DtAgS1aWO+gU52xpH7M9ScGgXSYmAVS9bIJ8EzuaGw0oNAw==",
      "license": "MIT",
      "dependencies": {
        "cross-spawn": "^7.0.1"
      },
      "bin": {
        "cross-env": "src/bin/cross-env.js",
        "cross-env-shell": "src/bin/cross-env-shell.js"
      },
      "engines": {
        "node": ">=10.14",
        "npm": ">=6",
        "yarn": ">=1"
      }
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cssesc": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
      "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
      "license": "MIT",
      "bin": {
        "cssesc": "bin/cssesc"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "license": "MIT"
    },
    "node_modules/d3-array": {
      "version": "3.2.4",
      "resolved": "https://registry.npmjs.org/d3-array/-/d3-array-3.2.4.tgz",
      "integrity": "sha512-tdQAmyA18i4J7wprpYq8ClcxZy3SC31QMeByyCFyRt7BVHdREQZ5lpzoe5mFEYZUWe+oq8HBvk9JjpibyEV4Jg==",
      "license": "ISC",
      "dependencies": {
        "internmap": "1 - 2"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-color": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-color/-/d3-color-3.1.0.tgz",
      "integrity": "sha512-zg/chbXyeBtMQ1LbD/WSoW2DpC3I0mpmPdW+ynRTj/x2DAWYrIY7qeZIHidozwV24m4iavr15lNwIwLxRmOxhA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-ease": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-ease/-/d3-ease-3.0.1.tgz",
      "integrity": "sha512-wR/XK3D3XcLIZwpbvQwQ5fK+8Ykds1ip7A2Txe0yxncXSdq1L9skcG7blcedkOX+ZcgxGAmLX1FrRGbADwzi0w==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-format": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/d3-format/-/d3-format-3.1.2.tgz",
      "integrity": "sha512-AJDdYOdnyRDV5b6ArilzCPPwc1ejkHcoyFarqlPqT7zRYjhavcT3uSrqcMvsgh2CgoPbK3RCwyHaVyxYcP2Arg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-interpolate": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-interpolate/-/d3-interpolate-3.0.1.tgz",
      "integrity": "sha512-3bYs1rOD33uo8aqJfKP3JWPAibgw8Zm2+L9vBKEHJ2Rg+viTR7o5Mmv5mZcieN+FRYaAOWX5SJATX6k1PWz72g==",
      "license": "ISC",
      "dependencies": {
        "d3-color": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-path": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-path/-/d3-path-3.1.0.tgz",
      "integrity": "sha512-p3KP5HCf/bvjBSSKuXid6Zqijx7wIfNW+J/maPs+iwR35at5JCbLUT0LzF1cnjbCHWhqzQTIN2Jpe8pRebIEFQ==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-scale": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/d3-scale/-/d3-scale-4.0.2.tgz",
      "integrity": "sha512-GZW464g1SH7ag3Y7hXjf8RoUuAFIqklOAq3MRl4OaWabTFJY9PN/E1YklhXLh+OQ3fM9yS2nOkCoS+WLZ6kvxQ==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2.10.0 - 3",
        "d3-format": "1 - 3",
        "d3-interpolate": "1.2.0 - 3",
        "d3-time": "2.1.1 - 3",
        "d3-time-format": "2 - 4"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-shape": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/d3-shape/-/d3-shape-3.2.0.tgz",
      "integrity": "sha512-SaLBuwGm3MOViRq2ABk3eLoxwZELpH6zhl3FbAoJ7Vm1gofKx6El1Ib5z23NUEhF9AsGl7y+dzLe5Cw2AArGTA==",
      "license": "ISC",
      "dependencies": {
        "d3-path": "^3.1.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/d3-time/-/d3-time-3.1.0.tgz",
      "integrity": "sha512-VqKjzBLejbSMT4IgbmVgDjpkYrNWUYJnbCGo874u7MMKIWsILRX+OpX/gTk8MqjpT1A/c6HY2dCA77ZN0lkQ2Q==",
      "license": "ISC",
      "dependencies": {
        "d3-array": "2 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-time-format": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/d3-time-format/-/d3-time-format-4.1.0.tgz",
      "integrity": "sha512-dJxPBlzC7NugB2PDLwo9Q8JiTR3M3e4/XANkreKSUxF8vvXKqm1Yfq4Q5dl8budlunRVlUUaDUgFt7eA8D6NLg==",
      "license": "ISC",
      "dependencies": {
        "d3-time": "1 - 3"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/d3-timer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/d3-timer/-/d3-timer-3.0.1.tgz",
      "integrity": "sha512-ndfJ/JxxMd3nw31uyKoY2naivF+r29V+Lc0svZxe1JvvIRmi8hUsrMvdOwgS1o6uBHmiz91geQ0ylPP0aj1VUA==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/damerau-levenshtein": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz",
      "integrity": "sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/data-view-buffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
      "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/data-view-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
      "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/inspect-js"
      }
    },
    "node_modules/data-view-byte-offset": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
      "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/decimal.js-light": {
      "version": "2.5.1",
      "resolved": "https://registry.npmjs.org/decimal.js-light/-/decimal.js-light-2.5.1.tgz",
      "integrity": "sha512-qIMFpTMZmny+MMIitAB6D7iVPEorVw6YQRWkvarTkT4tBeSLLiHzcwj6q0MmYSFCiVpiqPJTJEYIrpcPzVEIvg==",
      "license": "MIT"
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/detect-gpu": {
      "version": "5.0.70",
      "resolved": "https://registry.npmjs.org/detect-gpu/-/detect-gpu-5.0.70.tgz",
      "integrity": "sha512-bqerEP1Ese6nt3rFkwPnGbsUF9a4q+gMmpTVVOEzoCyeCc+y7/RvJnQZJx1JwhgQI5Ntg0Kgat8Uu7XpBqnz1w==",
      "license": "MIT",
      "dependencies": {
        "webgl-constants": "^1.1.1"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "devOptional": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/didyoumean": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
      "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
      "license": "Apache-2.0"
    },
    "node_modules/dlv": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
      "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
      "license": "MIT"
    },
    "node_modules/doctrine": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
      "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/draco3d": {
      "version": "1.5.7",
      "resolved": "https://registry.npmjs.org/draco3d/-/draco3d-1.5.7.tgz",
      "integrity": "sha512-m6WCKt/erDXcw+70IJXnG7M3awwQPAsZvJGX5zY7beBqpELw6RDGkYVU0W43AFxye4pDZ5i2Lbyc/NNGqwjUVQ==",
      "license": "Apache-2.0"
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.436",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.436.tgz",
      "integrity": "sha512-iG79/xCF3iThADicbgbES2+liFYmTvelo7jWcEfg6lQ+Adrh7zShrXSg2ZdEDLbKjJ298kGAKMnnzVWobp0L+g==",
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/enhanced-resolve": {
      "version": "5.25.1",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.25.1.tgz",
      "integrity": "sha512-nGXts5znJzmWPu+mIE9izCOzdg63oJca2mDzGWWTth7sr4aCToKcoyFVBQwN75Ij5Pf6p510EwkTqViTRzDV+w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.3.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.24.2",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
      "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.2",
        "arraybuffer.prototype.slice": "^1.0.4",
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "data-view-buffer": "^1.0.2",
        "data-view-byte-length": "^1.0.2",
        "data-view-byte-offset": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-set-tostringtag": "^2.1.0",
        "es-to-primitive": "^1.3.0",
        "function.prototype.name": "^1.1.8",
        "get-intrinsic": "^1.3.0",
        "get-proto": "^1.0.1",
        "get-symbol-description": "^1.1.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "internal-slot": "^1.1.0",
        "is-array-buffer": "^3.0.5",
        "is-callable": "^1.2.7",
        "is-data-view": "^1.0.2",
        "is-negative-zero": "^2.0.3",
        "is-regex": "^1.2.1",
        "is-set": "^2.0.3",
        "is-shared-array-buffer": "^1.0.4",
        "is-string": "^1.1.1",
        "is-typed-array": "^1.1.15",
        "is-weakref": "^1.1.1",
        "math-intrinsics": "^1.1.0",
        "object-inspect": "^1.13.4",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.7",
        "own-keys": "^1.0.1",
        "regexp.prototype.flags": "^1.5.4",
        "safe-array-concat": "^1.1.3",
        "safe-push-apply": "^1.0.0",
        "safe-regex-test": "^1.1.0",
        "set-proto": "^1.0.0",
        "stop-iteration-iterator": "^1.1.0",
        "string.prototype.trim": "^1.2.10",
        "string.prototype.trimend": "^1.0.9",
        "string.prototype.trimstart": "^1.0.8",
        "typed-array-buffer": "^1.0.3",
        "typed-array-byte-length": "^1.0.3",
        "typed-array-byte-offset": "^1.0.4",
        "typed-array-length": "^1.0.7",
        "unbox-primitive": "^1.1.0",
        "which-typed-array": "^1.1.19"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-abstract-get": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/es-abstract-get/-/es-abstract-get-1.0.0.tgz",
      "integrity": "sha512-6PMWXpdhshVvFp+FoWYs1EvG1Nj0tvk0dZM+XcK0xMEM1czRVcP6ohqPWHy6qPagSpC8j4+p89WXlT+xXJs/fg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "is-callable": "^1.2.7",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-iterator-helpers": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.4.0.tgz",
      "integrity": "sha512-c/A0P0oxkACDc+cKWw8evLXK83oBKgn0qPOqCYT4x9uolpCIJAcYvJC9QYKNDRPsTeGyCrQ326jrvgZWdCdK5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-set-tostringtag": "^2.1.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "iterator.prototype": "^1.1.5",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-shim-unscopables": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
      "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.4.tgz",
      "integrity": "sha512-yPDz7wqpg1/mmHLmS3tcfTfbw5f1eryXvyghYBffGdERwe+mV7ZcWzTR8LR17Kvqt3qfPurjlonmnq3MKXIOXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-abstract-get": "^1.0.0",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "is-callable": "^1.2.7",
        "is-date-object": "^1.1.0",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-toolkit": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/es-toolkit/-/es-toolkit-1.52.0.tgz",
      "integrity": "sha512-XTNEJQh1tY1ZJVcf6ayP/2n4ZPyaHlW2FWs7xvw5ddPuhUVjLD3olQVQS7kf58JbAB48iL0uL/jerTrjtV3lDA==",
      "license": "MIT",
      "workspaces": [
        "docs",
        "benchmarks",
        "tests/types",
        "tests/browser-compat"
      ]
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.5.tgz",
      "integrity": "sha512-DgZS62aPLXKlnxILS/AYCoRvHaZeXceIzlXPkkGGzJWSow1aEk0lbTlxUSlyjC8jcaKxAdOnTDz+o1JFSBsyjw==",
      "deprecated": "This version is no longer supported. Please see https://eslint.org/version-support for other options.",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.2",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.6",
        "@eslint/js": "9.39.5",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.14.0",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.5",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.3.6.tgz",
      "integrity": "sha512-1Upt3U7BDwU+ilpe2byZjAfts9oNq4d4fv/zXEvs8/4yS+cwOQW/WCxUNy8gCDquX67SzeehDvKblVC6ZBMocQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@next/eslint-plugin-next": "16.3.6",
        "eslint-import-resolver-node": "^0.3.6",
        "eslint-import-resolver-typescript": "^3.5.2",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-jsx-a11y": "^6.10.0",
        "eslint-plugin-react": "^7.37.0",
        "eslint-plugin-react-hooks": "^7.0.0",
        "globals": "16.4.0",
        "typescript-eslint": "^8.46.0"
      },
      "peerDependencies": {
        "eslint": ">=9.0.0",
        "typescript": ">=3.3.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next/node_modules/globals": {
      "version": "16.4.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.4.0.tgz",
      "integrity": "sha512-ob/2LcVVaVGCYN+r14cnwnoDPUufjiYgSqRhiFD0Q1iI4Odora5RE8Iv1D24hAz5oMophRGkGz+yuvQmmUMnMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint-import-resolver-node": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.10.tgz",
      "integrity": "sha512-tRrKqFyCaKict5hOd244sL6EQFNycnMQnBe+j8uqGNXYzsImGbGUU4ibtoaBmv5FLwJwcFJNeg1GeVjQfbMrDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7",
        "is-core-module": "^2.16.1",
        "resolve": "^2.0.0-next.6"
      }
    },
    "node_modules/eslint-import-resolver-node/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-import-resolver-typescript": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.10.1.tgz",
      "integrity": "sha512-A1rHYb06zjMGAxdLSkN2fXPBwuSaQ0iO5M/hdyS0Ajj1VBaRp0sPD3dn1FhME3c/JluGFbwSxyCfqdSbtQLAHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@nolyfill/is-core-module": "1.0.39",
        "debug": "^4.4.0",
        "get-tsconfig": "^4.10.0",
        "is-bun-module": "^2.0.0",
        "stable-hash": "^0.0.5",
        "tinyglobby": "^0.2.13",
        "unrs-resolver": "^1.6.2"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint-import-resolver-typescript"
      },
      "peerDependencies": {
        "eslint": "*",
        "eslint-plugin-import": "*",
        "eslint-plugin-import-x": "*"
      },
      "peerDependenciesMeta": {
        "eslint-plugin-import": {
          "optional": true
        },
        "eslint-plugin-import-x": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils": {
      "version": "2.14.0",
      "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.14.0.tgz",
      "integrity": "sha512-W2WCRZ9Dqntd+2u8jJcVMV2PKulc6RdLgUUoh/yQr3uB6lo/ZOeGx11sv60/8S4QFFKNslAlWhr9u0Ef7ZW6Ig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependenciesMeta": {
        "eslint": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.32.0.tgz",
      "integrity": "sha512-whOE1HFo/qJDyX4SnXzP4N6zOWn79WhnCUY/iDR0mPfQZO8wcYE4JClzI2oZrhBnnMUCBCHZhO6VQyoBU95mZA==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@rtsao/scc": "^1.1.0",
        "array-includes": "^3.1.9",
        "array.prototype.findlastindex": "^1.2.6",
        "array.prototype.flat": "^1.3.3",
        "array.prototype.flatmap": "^1.3.3",
        "debug": "^3.2.7",
        "doctrine": "^2.1.0",
        "eslint-import-resolver-node": "^0.3.9",
        "eslint-module-utils": "^2.12.1",
        "hasown": "^2.0.2",
        "is-core-module": "^2.16.1",
        "is-glob": "^4.0.3",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "object.groupby": "^1.0.3",
        "object.values": "^1.2.1",
        "semver": "^6.3.1",
        "string.prototype.trimend": "^1.0.9",
        "tsconfig-paths": "^3.15.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-jsx-a11y": {
      "version": "6.10.2",
      "resolved": "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz",
      "integrity": "sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "aria-query": "^5.3.2",
        "array-includes": "^3.1.8",
        "array.prototype.flatmap": "^1.3.2",
        "ast-types-flow": "^0.0.8",
        "axe-core": "^4.10.0",
        "axobject-query": "^4.1.0",
        "damerau-levenshtein": "^1.0.8",
        "emoji-regex": "^9.2.2",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^3.3.5",
        "language-tags": "^1.0.9",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "safe-regex-test": "^1.0.3",
        "string.prototype.includes": "^2.0.1"
      },
      "engines": {
        "node": ">=4.0"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-react": {
      "version": "7.37.5",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
      "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.8",
        "array.prototype.findlast": "^1.2.5",
        "array.prototype.flatmap": "^1.3.3",
        "array.prototype.tosorted": "^1.1.4",
        "doctrine": "^2.1.0",
        "es-iterator-helpers": "^1.2.1",
        "estraverse": "^5.3.0",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^2.4.1 || ^3.0.0",
        "minimatch": "^3.1.2",
        "object.entries": "^1.1.9",
        "object.fromentries": "^2.0.8",
        "object.values": "^1.2.1",
        "prop-types": "^15.8.1",
        "resolve": "^2.0.0-next.5",
        "semver": "^6.3.1",
        "string.prototype.matchall": "^4.0.12",
        "string.prototype.repeat": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.1.1.tgz",
      "integrity": "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint/node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/eslint/node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/eventemitter3": {
      "version": "5.0.4",
      "resolved": "https://registry.npmjs.org/eventemitter3/-/eventemitter3-5.0.4.tgz",
      "integrity": "sha512-mlsTRyGaPBjPedk6Bvw+aqbsXDtoAyAzm5MO7JgU+yVRyMQ5O8bD4Kcci7BS85f93veegeCPkL8R4GLClnjLFw==",
      "license": "MIT"
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",
      "integrity": "sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.4"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fastq": {
      "version": "1.20.3",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.3.tgz",
      "integrity": "sha512-XKv5nnLs6nLF71NgiKJLIZFLkPyIEuOselLG7ujZnGrRfQK8HpvY+WqKhAJUAdLomwVHErVS4LfxFlPq0/FTAw==",
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/fflate": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.8.3.tgz",
      "integrity": "sha512-tbZNuJrLwGUp3zshBtdy4W+ORxZuIh8a5ilyIEQDC5rY1f3U20JMry0Ll3WBzU58EZKsEuJFXhb5gwv8CsPvgA==",
      "license": "MIT"
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.4",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.4.tgz",
      "integrity": "sha512-5+ybhBZANEJxaH3X5evAFatUxLfEHSr7n6kYJ+1Qd0mUqr4eu9gIf6GDbWHf8RJijHrjjO8G+la14SlL2SeS1Q==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/follow-redirects": {
      "version": "1.16.0",
      "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.0.tgz",
      "integrity": "sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw==",
      "funding": [
        {
          "type": "individual",
          "url": "https://github.com/sponsors/RubenVerborgh"
        }
      ],
      "license": "MIT",
      "engines": {
        "node": ">=4.0"
      },
      "peerDependenciesMeta": {
        "debug": {
          "optional": true
        }
      }
    },
    "node_modules/for-each": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
      "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/form-data": {
      "version": "4.0.6",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.6.tgz",
      "integrity": "sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ==",
      "license": "MIT",
      "dependencies": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.8",
        "es-set-tostringtag": "^2.1.0",
        "hasown": "^2.0.4",
        "mime-types": "^2.1.35"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fraction.js": {
      "version": "5.3.4",
      "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
      "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
      "license": "MIT",
      "engines": {
        "node": "*"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/rawify"
      }
    },
    "node_modules/framer-motion": {
      "version": "13.4.1",
      "resolved": "https://registry.npmjs.org/framer-motion/-/framer-motion-13.4.1.tgz",
      "integrity": "sha512-6DsbU4hsNsokXkwSp3ezdMWMiv5yWzCcdjFgakkeUC6FVIK01Py8ToSzsXvBw8cYA5hff/oXFvZFU7ltbVyUYA==",
      "license": "MIT",
      "dependencies": {
        "motion-dom": "^13.4.1",
        "motion-utils": "^13.3.0",
        "tslib": "^2.4.0"
      },
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
      },
      "peerDependenciesMeta": {
        "react": {
          "optional": true
        },
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function.prototype.name": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.2.0.tgz",
      "integrity": "sha512-jObKIik1P2QjPHP5nz5BaOtUlfgS0fWo8IUByNXkM+o+02sJOi94em77GwJKQSJ3gfPHdgzLNrHc1uokV4P/ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2",
        "hasown": "^2.0.4",
        "is-callable": "^1.2.7",
        "is-document.all": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functions-have-names": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
      "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/generator-function": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
      "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-symbol-description": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
      "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.14.3",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.14.3.tgz",
      "integrity": "sha512-++QEw4DIY7WGoukz+/+A/8dGYPT9l9yIadnmSgZ8Rjr3YVSVDipQSO9CdnJo9ePqFqUUqh+wk9uIaoiAwsiPkA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/glsl-noise": {
      "version": "0.0.0",
      "resolved": "https://registry.npmjs.org/glsl-noise/-/glsl-noise-0.0.0.tgz",
      "integrity": "sha512-b/ZCF6amfAUb7dJM/MxRs7AetQEahYzJ8PtgfrmEdtw6uyGOr+ZSGtgjFm6mfsBkxJ4d2W7kg+Nlqzqvn3Bc0w==",
      "license": "MIT"
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/has-bigints": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
      "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-proto": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
      "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/hls.js": {
      "version": "1.7.3",
      "resolved": "https://registry.npmjs.org/hls.js/-/hls.js-1.7.3.tgz",
      "integrity": "sha512-MsPlx6yVW4Qv4C7mEVou4/gk/5cN2dVxOTnrNjPSmyH2f0Ln+/UkG10Ax1PE6OvrmTVPKgQYozTtBaPOuCzq7A==",
      "license": "Apache-2.0"
    },
    "node_modules/https-proxy-agent": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
      "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
      "license": "MIT",
      "dependencies": {
        "agent-base": "6",
        "debug": "4"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/ieee754": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.2.1.tgz",
      "integrity": "sha512-dcyqhDvX1C46lXZcVqCpK+FtMRQVdIMN6/Df5js2zouUsqG7I6sFxitIC+7KYK29KdXOLHdu9zL4sFnoVQnqaA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "BSD-3-Clause"
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/immediate": {
      "version": "3.0.6",
      "resolved": "https://registry.npmjs.org/immediate/-/immediate-3.0.6.tgz",
      "integrity": "sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==",
      "license": "MIT"
    },
    "node_modules/immer": {
      "version": "11.1.18",
      "resolved": "https://registry.npmjs.org/immer/-/immer-11.1.18.tgz",
      "integrity": "sha512-EQyQtLiYW029lyoczMl/Hh4Xu7cDecSc58JRYpHyL4tIAu3eqd1yJzQX04d2BZHDkzFFvm6qJEJWOtfDSWAXbQ==",
      "license": "MIT",
      "peer": true,
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/immer"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/internal-slot": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
      "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "hasown": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/internmap": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/internmap/-/internmap-2.0.3.tgz",
      "integrity": "sha512-5Hh7Y1wQbvY5ooGgPbDaL5iYLAPzMTUrjMulskHLH6wnv/A+1q5rgEaiuqEjB+oxGXIVZs1FF+R/KPN3ZSQYYg==",
      "license": "ISC",
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/is-array-buffer": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
      "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-async-function": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
      "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "async-function": "^1.0.0",
        "call-bound": "^1.0.3",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
      "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-bigints": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-binary-path": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
      "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
      "license": "MIT",
      "dependencies": {
        "binary-extensions": "^2.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
      "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bun-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-bun-module/-/is-bun-module-2.0.0.tgz",
      "integrity": "sha512-gNCGbnnnnFAUGKeZ9PdbyeGYJqewpmc2aKHUEMO5nQPWU9lOmv7jcmQIv+qHD8fXW6W7qfuCwX4rY9LNRjXrkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.7.1"
      }
    },
    "node_modules/is-bun-module/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
      "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.17.0",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.17.0.tgz",
      "integrity": "sha512-J/vG0zBCbIKOQFfufSwyXdMrsohyJIUNkrnmo6WZGzoM7tr/lsbfW5b2BvisL6zsyMzK9UxV9L6c7AoFbyXHOA==",
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-view": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
      "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "get-intrinsic": "^1.2.6",
        "is-typed-array": "^1.1.13"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
      "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-document.all": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",
      "integrity": "sha512-+XSoyS05OdBbhFuELhgTCpFNHkpBOJqtsZfUFFpe5QTw+9Sjbh8zitxhQkYAo6wV7e1Vb8cAPvpCk9jGam/82g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-finalizationregistry": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
      "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-generator-function": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
      "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "generator-function": "^2.0.0",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-map": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
      "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
      "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
      "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-promise": {
      "version": "2.2.2",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-2.2.2.tgz",
      "integrity": "sha512-+lP4/6lKUBfQjZ2pdxThZvLUAafmZb8OAxFb8XXtiQmS35INgr85hdOGoEs124ez1FCnZJt6jau/T+alh58QFQ==",
      "license": "MIT"
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-set": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
      "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-shared-array-buffer": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
      "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-string": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
      "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
      "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-symbols": "^1.1.0",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-typed-array": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakmap": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
      "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakref": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
      "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakset": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
      "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isarray": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
      "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "license": "ISC"
    },
    "node_modules/iterator.prototype": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
      "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "get-proto": "^1.0.0",
        "has-symbols": "^1.1.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/its-fine": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/its-fine/-/its-fine-2.1.1.tgz",
      "integrity": "sha512-C5ZoVkeqSt0Aje0tzESO+iT/EQpNFNL39GkP7mCACtoZUFD6GcyerFCr6kp0ZtiII4W9HoYkY48Soy5xE/uHKw==",
      "license": "MIT",
      "dependencies": {
        "@types/react-reconciler": "^0.28.9"
      },
      "peerDependencies": {
        "react": "^19.0.0"
      }
    },
    "node_modules/jiti": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.7.0.tgz",
      "integrity": "sha512-AC/7JofJvZGrrneWNaEnJeOLUx+JlGt7tNa0wZiRPT4MY1wmfKjt2+6O2p2uz2+skll8OZZmJMNqeke7kKbNgQ==",
      "devOptional": true,
      "license": "MIT",
      "bin": {
        "jiti": "lib/jiti-cli.mjs"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.3.2.tgz",
      "integrity": "sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsx-ast-utils": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
      "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.6",
        "array.prototype.flat": "^1.3.1",
        "object.assign": "^4.1.4",
        "object.values": "^1.1.6"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/language-subtag-registry": {
      "version": "0.3.23",
      "resolved": "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz",
      "integrity": "sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/language-tags": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz",
      "integrity": "sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "language-subtag-registry": "^0.3.20"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/lie": {
      "version": "3.3.0",
      "resolved": "https://registry.npmjs.org/lie/-/lie-3.3.0.tgz",
      "integrity": "sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==",
      "license": "MIT",
      "dependencies": {
        "immediate": "~3.0.5"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lilconfig": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
      "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
      "license": "MIT",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/antonk52"
      }
    },
    "node_modules/lines-and-columns": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
      "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
      "license": "MIT"
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/lucide-react": {
      "version": "1.47.0",
      "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-1.47.0.tgz",
      "integrity": "sha512-o8C23aXpNQypRY73W7fW02EyvWJinEMXgKeGjFoKym0zj3Q73hD97A1IQps1g8C14HTGsOpZL0Am+xjfgFZAbg==",
      "license": "ISC",
      "peerDependencies": {
        "react": "^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/maath": {
      "version": "0.10.8",
      "resolved": "https://registry.npmjs.org/maath/-/maath-0.10.8.tgz",
      "integrity": "sha512-tRvbDF0Pgqz+9XUa4jjfgAQ8/aPKmQdWXilFu2tMy4GWj4NOsx99HlULO4IeREfbO3a0sA145DZYyvXPkybm0g==",
      "license": "MIT",
      "peerDependencies": {
        "@types/three": ">=0.134.0",
        "three": ">=0.134.0"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/meshline": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/meshline/-/meshline-3.3.1.tgz",
      "integrity": "sha512-/TQj+JdZkeSUOl5Mk2J7eLcYTLiQm2IDzmlSvYm7ov15anEcDJ92GHqqazxTSreeNgfnYu24kiEvvv0WlbCdFQ==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">=0.137"
      }
    },
    "node_modules/meshoptimizer": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/meshoptimizer/-/meshoptimizer-1.1.1.tgz",
      "integrity": "sha512-oRFNWJRDA/WTrVj7NWvqa5HqE1t9MYDj2VaWirQCzCCrAd2GHrqR/sQezCxiWATPNlKTcRaPRHPJwIRoPBAp5g==",
      "license": "MIT"
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/mime-db": {
      "version": "1.52.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
      "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "2.1.35",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
      "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "1.52.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/motion-dom": {
      "version": "13.4.1",
      "resolved": "https://registry.npmjs.org/motion-dom/-/motion-dom-13.4.1.tgz",
      "integrity": "sha512-qw6ILBFHrIPQd3k9Dd1fNlCLHTNzvMXW2zpeTlxn4wZXX02m0Dnsf8ycyvcjtAZtBiBnL4SfbyDIXWg+b1x/Ig==",
      "license": "MIT",
      "dependencies": {
        "motion-utils": "^13.3.0"
      }
    },
    "node_modules/motion-utils": {
      "version": "13.3.0",
      "resolved": "https://registry.npmjs.org/motion-utils/-/motion-utils-13.3.0.tgz",
      "integrity": "sha512-sgSschQp7EseHInIlR7hBbMuvet3RA0bs28KPZAXJcGKGdxHGvh1ogpYDilY3bOMtl73EqPNmp75sAKHYPU5sg==",
      "license": "MIT"
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/mz": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
      "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0",
        "object-assign": "^4.0.1",
        "thenify-all": "^1.0.0"
      }
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-postinstall": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/napi-postinstall/-/napi-postinstall-0.3.4.tgz",
      "integrity": "sha512-PHI5f1O0EP5xJ9gQmFGMS6IZcrVvTjpXjz7Na41gTE7eE2hK11lg04CECCYEEjdc17EV4DO+fkGEtt7TpTaTiQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "napi-postinstall": "lib/cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/napi-postinstall"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/next": {
      "version": "16.3.6",
      "resolved": "https://registry.npmjs.org/next/-/next-16.3.6.tgz",
      "integrity": "sha512-L+otWM/aQbYTx98aZhgEoMb4bZAXx1YVW4UMA/vuCyCoWG5HJyZUili8QAkqzrcC+5///tsz3s0M+SlyB5bLMw==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "16.3.6",
        "@swc/helpers": "0.5.23",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.5.23",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.3.6",
        "@next/swc-darwin-x64": "16.3.6",
        "@next/swc-linux-arm64-gnu": "16.3.6",
        "@next/swc-linux-arm64-musl": "16.3.6",
        "@next/swc-linux-x64-gnu": "16.3.6",
        "@next/swc-linux-x64-musl": "16.3.6",
        "@next/swc-win32-arm64-msvc": "16.3.6",
        "@next/swc-win32-x64-msvc": "16.3.6",
        "sharp": "^0.35.4"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.5.23",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.23.tgz",
      "integrity": "sha512-g50586zr4bZmwFiTlflMu8E0bDTb5I5gertgwAKmsdUlTQIhZtunzUlD1WSzwcVWPoAVpsrA6vlfCD7oXvRwgg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-exports-info": {
      "version": "1.6.2",
      "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.2.tgz",
      "integrity": "sha512-kXs9Go0cah0qHVV2v389IXQLdLCeE1xfFtjOAF+iobu0OIoG1pje8At2vMHyaPMiPMnG/LWP50twML21eMcAag==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array.prototype.flatmap": "^1.3.3",
        "es-errors": "^1.3.0",
        "object.entries": "^1.1.9",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.56",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.56.tgz",
      "integrity": "sha512-x0InOIyzgdk+eyaWaRJFH5snEtiImgBgblZ2CyPrLmqqcuMQkEvcDPHbzqbD8eDsSeJbVOjn+crzyzHaM4D+/A==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/normalize-path": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
      "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-hash": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
      "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.7",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
      "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0",
        "has-symbols": "^1.1.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.entries": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
      "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.fromentries": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
      "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.groupby": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz",
      "integrity": "sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.values": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
      "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/own-keys": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.2.tgz",
      "integrity": "sha512-19YVAg7T+WTrxggPukVq7DjTv6+PJ867TmhCvBsYwmbFCsZd344rq2Ld1p0wo8f8Qrrhgp82c6FJRqdXWtSEhg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "object-keys": "^1.1.1",
        "safe-push-apply": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/pirates": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
      "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
      "license": "MIT",
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/possible-typed-array-names": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
      "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/postcss-import": {
      "version": "15.1.0",
      "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
      "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
      "license": "MIT",
      "dependencies": {
        "postcss-value-parser": "^4.0.0",
        "read-cache": "^1.0.0",
        "resolve": "^1.1.7"
      },
      "engines": {
        "node": ">=14.0.0"
      },
      "peerDependencies": {
        "postcss": "^8.0.0"
      }
    },
    "node_modules/postcss-import/node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/postcss-js": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
      "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "camelcase-css": "^2.0.1"
      },
      "engines": {
        "node": "^12 || ^14 || >= 16"
      },
      "peerDependencies": {
        "postcss": "^8.4.21"
      }
    },
    "node_modules/postcss-load-config": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
      "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "lilconfig": "^3.1.1"
      },
      "engines": {
        "node": ">= 18"
      },
      "peerDependencies": {
        "jiti": ">=1.21.0",
        "postcss": ">=8.0.9",
        "tsx": "^4.8.1",
        "yaml": "^2.4.2"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        },
        "postcss": {
          "optional": true
        },
        "tsx": {
          "optional": true
        },
        "yaml": {
          "optional": true
        }
      }
    },
    "node_modules/postcss-nested": {
      "version": "6.2.0",
      "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
      "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "postcss-selector-parser": "^6.1.1"
      },
      "engines": {
        "node": ">=12.0"
      },
      "peerDependencies": {
        "postcss": "^8.2.14"
      }
    },
    "node_modules/postcss-selector-parser": {
      "version": "6.1.4",
      "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.4.tgz",
      "integrity": "sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==",
      "license": "MIT",
      "dependencies": {
        "cssesc": "^3.0.0",
        "util-deprecate": "^1.0.2"
      },
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/postcss-value-parser": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
      "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
      "license": "MIT"
    },
    "node_modules/potpack": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/potpack/-/potpack-1.0.2.tgz",
      "integrity": "sha512-choctRBIV9EMT9WGAZHn3V7t0Z2pMQyl0EZE6pFc/6ml3ssw7Dlf/oAOvFwjm1HVsqfQN8GfeFyJ+d8tRzqueQ==",
      "license": "ISC"
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/promise-worker-transferable": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/promise-worker-transferable/-/promise-worker-transferable-1.0.4.tgz",
      "integrity": "sha512-bN+0ehEnrXfxV2ZQvU2PetO0n4gqBD4ulq3MI1WOPLgr7/Mg9yRQkX5+0v1vagr74ZTsl7XtzlaYDo2EuCeYJw==",
      "license": "Apache-2.0",
      "dependencies": {
        "is-promise": "^2.1.0",
        "lie": "^3.0.2"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/proxy-from-env": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-2.1.0.tgz",
      "integrity": "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==",
      "license": "MIT",
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.8.tgz",
      "integrity": "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.8.tgz",
      "integrity": "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.8"
      }
    },
    "node_modules/react-hook-form": {
      "version": "7.88.0",
      "resolved": "https://registry.npmjs.org/react-hook-form/-/react-hook-form-7.88.0.tgz",
      "integrity": "sha512-QRaLOWhX93YCnMiRfnOFRSwWXZNt8qhm2JTZwypoDvKpSffTJHmpzMXt8U6PV5UThvL3IiiLDUWe2nHMtz6Mmw==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=18.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/react-hook-form"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17 || ^18 || ^19"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/react-redux": {
      "version": "9.3.0",
      "resolved": "https://registry.npmjs.org/react-redux/-/react-redux-9.3.0.tgz",
      "integrity": "sha512-KQopgqFo/p/fgmAs5qz6p5RWaNAzq40WAu7fJIXnQpYxFPbJYtsJPWvGeF2rOBaY/kEuV77AVsX8TsQzKm+A/g==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@types/use-sync-external-store": "^0.0.6",
        "use-sync-external-store": "^1.4.0"
      },
      "peerDependencies": {
        "@types/react": "^18.2.25 || ^19",
        "react": "^18.0 || ^19",
        "redux": "^5.0.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "redux": {
          "optional": true
        }
      }
    },
    "node_modules/react-use-measure": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/react-use-measure/-/react-use-measure-2.1.7.tgz",
      "integrity": "sha512-KrvcAo13I/60HpwGO5jpW7E9DfusKyLPLvuHlUyP5zqnmAPhNc6qTRjUQrdTADl0lpPpDVU2/Gg51UlOGHXbdg==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=16.13",
        "react-dom": ">=16.13"
      },
      "peerDependenciesMeta": {
        "react-dom": {
          "optional": true
        }
      }
    },
    "node_modules/read-cache": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.2.tgz",
      "integrity": "sha512-/peqiBB/n07gQGLsWaHho3WfvUyRscw0gYTsEFMhrIe/nWLkYaf5SbKYjGYqtRV3aPwykJgF2VEMo1ac4bnsGA==",
      "license": "MIT"
    },
    "node_modules/readdirp": {
      "version": "3.6.0",
      "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
      "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
      "license": "MIT",
      "dependencies": {
        "picomatch": "^2.2.1"
      },
      "engines": {
        "node": ">=8.10.0"
      }
    },
    "node_modules/recharts": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/recharts/-/recharts-3.10.1.tgz",
      "integrity": "sha512-QXFrvt6IVcw7eeZCoyXTwkIJAX3Dv1nyVhMicXJ47GsGDDpcN8z6o644DibE9XjpBTThtsomLKnTV6lc+cVFUA==",
      "license": "MIT",
      "workspaces": [
        "www"
      ],
      "dependencies": {
        "@reduxjs/toolkit": "^1.9.0 || 2.x.x",
        "clsx": "^2.1.1",
        "decimal.js-light": "^2.5.1",
        "es-toolkit": "^1.39.3",
        "eventemitter3": "^5.0.1",
        "immer": "^11.1.8",
        "react-redux": "8.x.x || 9.x.x",
        "reselect": "5.2.0",
        "tiny-invariant": "^1.3.3",
        "use-sync-external-store": "^1.2.2",
        "victory-vendor": "^37.0.2"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-dom": "^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
        "react-is": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/redux": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/redux/-/redux-5.0.1.tgz",
      "integrity": "sha512-M9/ELqF6fy8FwmkpnF0S3YKOqMyoWJ4+CS5Efg2ct3oY9daQvd/Pc71FpGZsVsbl3Cpb+IIcjBDUnnyBdQbq4w==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/redux-thunk": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/redux-thunk/-/redux-thunk-3.1.0.tgz",
      "integrity": "sha512-NW2r5T6ksUKXCabzhL9z+h206HQw/NJkcLm1GPImRQ8IzfXwRGqjVhKJGauHirT0DAuyy6hjdnMZaRoAcy0Klw==",
      "license": "MIT",
      "peerDependencies": {
        "redux": "^5.0.0"
      }
    },
    "node_modules/reflect.getprototypeof": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
      "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.7",
        "get-proto": "^1.0.1",
        "which-builtin-type": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
      "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-errors": "^1.3.0",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/require-from-string": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/require-from-string/-/require-from-string-2.0.2.tgz",
      "integrity": "sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/reselect": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/reselect/-/reselect-5.2.0.tgz",
      "integrity": "sha512-AgZ3UOZm3YndfrJ4OYjgrT7bmCm/1iqkjvEfH/oYjzh6PD2qw4QuT3jjnXIrpdt4MTpMXclMT3lXbmRY+XRakw==",
      "license": "MIT"
    },
    "node_modules/resolve": {
      "version": "2.0.0-next.7",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.7.tgz",
      "integrity": "sha512-tqt+NBWwyaMgw3zDsnygx4CByWjQEJHOPMdslYhppaQSJUtL/D4JO9CcBBlhPoI8lz9oJIDXkwXfhF4aWqP8xQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.2",
        "node-exports-info": "^1.6.0",
        "object-keys": "^1.1.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/safe-array-concat": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
      "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "has-symbols": "^1.1.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">=0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-push-apply": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
      "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/set-function-length": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
      "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.2.4",
        "gopd": "^1.0.1",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-function-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
      "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-proto": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
      "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/sharp": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.35.4.tgz",
      "integrity": "sha512-n++8XWcj+jCOr2IOl7h8LbKnGBDY4aPbmprMONBNFdn0ImXqpGVv5zliDs0V9HbmbCQLpbuo2ej9rAoOQTvMDA==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.1.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.8.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.35.4",
        "@img/sharp-darwin-x64": "0.35.4",
        "@img/sharp-freebsd-wasm32": "0.35.4",
        "@img/sharp-libvips-darwin-arm64": "1.3.3",
        "@img/sharp-libvips-darwin-x64": "1.3.3",
        "@img/sharp-libvips-linux-arm": "1.3.3",
        "@img/sharp-libvips-linux-arm64": "1.3.3",
        "@img/sharp-libvips-linux-ppc64": "1.3.3",
        "@img/sharp-libvips-linux-riscv64": "1.3.3",
        "@img/sharp-libvips-linux-s390x": "1.3.3",
        "@img/sharp-libvips-linux-x64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3",
        "@img/sharp-linux-arm": "0.35.4",
        "@img/sharp-linux-arm64": "0.35.4",
        "@img/sharp-linux-ppc64": "0.35.4",
        "@img/sharp-linux-riscv64": "0.35.4",
        "@img/sharp-linux-s390x": "0.35.4",
        "@img/sharp-linux-x64": "0.35.4",
        "@img/sharp-linuxmusl-arm64": "0.35.4",
        "@img/sharp-linuxmusl-x64": "0.35.4",
        "@img/sharp-webcontainers-wasm32": "0.35.4",
        "@img/sharp-win32-arm64": "0.35.4",
        "@img/sharp-win32-ia32": "0.35.4",
        "@img/sharp-win32-x64": "0.35.4"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/sharp/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/sonner": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/sonner/-/sonner-2.0.8.tgz",
      "integrity": "sha512-UM/ByIoFra8yzV75n1o0Puu0bw5U/9UNnDacrJNspekBewIfsQ3D6ez1nvlWpt7aTsO6rujQtifBpycwIivqlg==",
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^18.0.0 || ^19.0.0",
        "react": "^18.0.0 || ^19.0.0 || ^19.0.0-rc",
        "react-dom": "^18.0.0 || ^19.0.0 || ^19.0.0-rc"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        }
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stable-hash": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/stable-hash/-/stable-hash-0.0.5.tgz",
      "integrity": "sha512-+L3ccpzibovGXFK+Ap/f8LOS0ahMrHTf3xu7mMLSpEGU0EO9ucaysSylKo9eRDFNhWve/y275iPmIZ4z39a9iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/stats-gl": {
      "version": "2.4.2",
      "resolved": "https://registry.npmjs.org/stats-gl/-/stats-gl-2.4.2.tgz",
      "integrity": "sha512-g5O9B0hm9CvnM36+v7SFl39T7hmAlv541tU81ME8YeSb3i1CIP5/QdDeSB3A0la0bKNHpxpwxOVRo2wFTYEosQ==",
      "license": "MIT",
      "dependencies": {
        "@types/three": "*",
        "three": "^0.170.0"
      },
      "peerDependencies": {
        "@types/three": "*",
        "three": "*"
      }
    },
    "node_modules/stats-gl/node_modules/three": {
      "version": "0.170.0",
      "resolved": "https://registry.npmjs.org/three/-/three-0.170.0.tgz",
      "integrity": "sha512-FQK+LEpYc0fBD+J8g6oSEyyNzjp+Q7Ks1C568WWaoMRLW+TkNNWmenWeGgJjV105Gd+p/2ql1ZcjYvNiPZBhuQ==",
      "license": "MIT"
    },
    "node_modules/stats.js": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/stats.js/-/stats.js-0.17.0.tgz",
      "integrity": "sha512-hNKz8phvYLPEcRkeG1rsGmV5ChMjKDAWU7/OJJdDErPBNChQXxCo3WZurGpnWc6gZhAzEPFad1aVgyOANH1sMw==",
      "license": "MIT"
    },
    "node_modules/stop-iteration-iterator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
      "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "internal-slot": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.includes": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz",
      "integrity": "sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.matchall": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.1.0.tgz",
      "integrity": "sha512-tHNHTxInrYLCga9O9YGxWA3G9/nnzQw8UGAyqGx3Ar1pSTTzIuM4woFSq4SowkXCjJIwq5sIiQvEfRI9tCH1qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "regexp.prototype.flags": "^1.5.4",
        "set-function-name": "^2.0.2",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.repeat": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
      "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.1.3",
        "es-abstract": "^1.17.5"
      }
    },
    "node_modules/string.prototype.trim": {
      "version": "1.2.11",
      "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.11.tgz",
      "integrity": "sha512-PwvK7BU+CMTJGYQCTZb5RWXIML92lftJLhQz1tBzgKiqGxJaMlBAa48POXaNAC2s4y8jr3EFqrkF9+44neS46w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-data-property": "^1.1.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "has-property-descriptors": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.10.tgz",
      "integrity": "sha512-2+3aDAOmPTmuFwjDnmJG2ctEkQKVki7vOSqaxkv42Mowj1V6PnvuwFCRrR5lChUux1TBskPjfkeTOhqczDMxTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
      "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/sucrase": {
      "version": "3.35.1",
      "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
      "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.2",
        "commander": "^4.0.0",
        "lines-and-columns": "^1.1.6",
        "mz": "^2.7.0",
        "pirates": "^4.0.1",
        "tinyglobby": "^0.2.11",
        "ts-interface-checker": "^0.1.9"
      },
      "bin": {
        "sucrase": "bin/sucrase",
        "sucrase-node": "bin/sucrase-node"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/suspend-react": {
      "version": "0.1.3",
      "resolved": "https://registry.npmjs.org/suspend-react/-/suspend-react-0.1.3.tgz",
      "integrity": "sha512-aqldKgX9aZqpoDp3e8/BZ8Dm7x1pJl+qI3ZKxDN0i/IQTWUwBx/ManmlVJ3wowqbno6c2bmiIfs+Um6LbsjJyQ==",
      "license": "MIT",
      "peerDependencies": {
        "react": ">=17.0"
      }
    },
    "node_modules/tailwind-merge": {
      "version": "3.7.0",
      "resolved": "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-3.7.0.tgz",
      "integrity": "sha512-XPPUyAc+cvspz3lHTcR/QgPfW2A0lv/xQNIjX3HGhLR+Nq2lHaLq5MtTesHn8GUr3W3DguT2KT5x3NVgRtYwmA==",
      "license": "MIT",
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/dcastil"
      }
    },
    "node_modules/tailwindcss": {
      "version": "3.4.19",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
      "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "arg": "^5.0.2",
        "chokidar": "^3.6.0",
        "didyoumean": "^1.2.2",
        "dlv": "^1.1.3",
        "fast-glob": "^3.3.2",
        "glob-parent": "^6.0.2",
        "is-glob": "^4.0.3",
        "jiti": "^1.21.7",
        "lilconfig": "^3.1.3",
        "micromatch": "^4.0.8",
        "normalize-path": "^3.0.0",
        "object-hash": "^3.0.0",
        "picocolors": "^1.1.1",
        "postcss": "^8.4.47",
        "postcss-import": "^15.1.0",
        "postcss-js": "^4.0.1",
        "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
        "postcss-nested": "^6.2.0",
        "postcss-selector-parser": "^6.1.2",
        "resolve": "^1.22.8",
        "sucrase": "^3.35.0"
      },
      "bin": {
        "tailwind": "lib/cli.js",
        "tailwindcss": "lib/cli.js"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/tailwindcss-animate": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/tailwindcss-animate/-/tailwindcss-animate-1.0.7.tgz",
      "integrity": "sha512-bl6mpH3T7I3UFxuvDEXLxy/VuFxBk5bbzplh7tXI68mwMokNYd1t9qPBHlnyTwfa4JGC4zP516I1hYYtQ/vspA==",
      "license": "MIT",
      "peerDependencies": {
        "tailwindcss": ">=3.0.0 || insiders"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob": {
      "version": "3.3.3",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
      "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.8"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/tailwindcss/node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/tailwindcss/node_modules/jiti": {
      "version": "1.21.7",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
      "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
      "license": "MIT",
      "bin": {
        "jiti": "bin/jiti.js"
      }
    },
    "node_modules/tailwindcss/node_modules/resolve": {
      "version": "1.22.12",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
      "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tapable": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.3.3.tgz",
      "integrity": "sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/thenify": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
      "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
      "license": "MIT",
      "dependencies": {
        "any-promise": "^1.0.0"
      }
    },
    "node_modules/thenify-all": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
      "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
      "license": "MIT",
      "dependencies": {
        "thenify": ">= 3.1.0 < 4"
      },
      "engines": {
        "node": ">=0.8"
      }
    },
    "node_modules/three": {
      "version": "0.185.1",
      "resolved": "https://registry.npmjs.org/three/-/three-0.185.1.tgz",
      "integrity": "sha512-5aojFCXKwnjBRZvUnt3WFfEcvUJgkN5LlijRFN95hMy8WVkG4I0QNcJE+OuWvuJ0bOdStrbfXn0pkd6/QyiAlg==",
      "license": "MIT",
      "peer": true
    },
    "node_modules/three-mesh-bvh": {
      "version": "0.8.3",
      "resolved": "https://registry.npmjs.org/three-mesh-bvh/-/three-mesh-bvh-0.8.3.tgz",
      "integrity": "sha512-4G5lBaF+g2auKX3P0yqx+MJC6oVt6sB5k+CchS6Ob0qvH0YIhuUk1eYr7ktsIpY+albCqE80/FVQGV190PmiAg==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">= 0.159.0"
      }
    },
    "node_modules/three-stdlib": {
      "version": "2.36.1",
      "resolved": "https://registry.npmjs.org/three-stdlib/-/three-stdlib-2.36.1.tgz",
      "integrity": "sha512-XyGQrFmNQ5O/IoKm556ftwKsBg11TIb301MB5dWNicziQBEs2g3gtOYIf7pFiLa0zI2gUwhtCjv9fmjnxKZ1Cg==",
      "license": "MIT",
      "dependencies": {
        "@types/draco3d": "^1.4.0",
        "@types/offscreencanvas": "^2019.6.4",
        "@types/webxr": "^0.5.2",
        "draco3d": "^1.4.1",
        "fflate": "^0.6.9",
        "potpack": "^1.0.1"
      },
      "peerDependencies": {
        "three": ">=0.128.0"
      }
    },
    "node_modules/three-stdlib/node_modules/fflate": {
      "version": "0.6.11",
      "resolved": "https://registry.npmjs.org/fflate/-/fflate-0.6.11.tgz",
      "integrity": "sha512-3JyEFWGjFn7zHmoa9+zG1BmW7X2okcmAB+0Cnu9UFbVs/jCBnl2A8o065ZlXiw145K3eBM3uLuzrYXC0RK7eDg==",
      "license": "MIT"
    },
    "node_modules/tiny-invariant": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/tiny-invariant/-/tiny-invariant-1.3.3.tgz",
      "integrity": "sha512-+FbBPE1o9QAYvviau/qC5SE3caw21q3xkvWKBtja5vgqOWIHHJ3ioaq1VPfn/Szqctz2bU/oYeKd9/z5BL+PVg==",
      "license": "MIT"
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/troika-three-text": {
      "version": "0.52.5",
      "resolved": "https://registry.npmjs.org/troika-three-text/-/troika-three-text-0.52.5.tgz",
      "integrity": "sha512-Ry3jRhic9pzcY4JduSvRRyDmVOSqEW19gT4vtK+aCiPNVcDlmkxvGG0YbFd36RTDq1wExOupXnvNF/j1oiHHDA==",
      "license": "MIT",
      "dependencies": {
        "bidi-js": "^1.0.2",
        "troika-three-utils": "^0.52.5",
        "troika-worker-utils": "^0.52.0",
        "webgl-sdf-generator": "1.1.1"
      },
      "peerDependencies": {
        "three": ">=0.125.0"
      }
    },
    "node_modules/troika-three-utils": {
      "version": "0.52.5",
      "resolved": "https://registry.npmjs.org/troika-three-utils/-/troika-three-utils-0.52.5.tgz",
      "integrity": "sha512-WsePbcX8RtfidRfsxK1eCZCjF81ZDzAKHH/evLs0hdV2wpoCb0vArGZHdzdOJrSS3k4zfdtbKDaBh8+phkrYnw==",
      "license": "MIT",
      "peerDependencies": {
        "three": ">=0.125.0"
      }
    },
    "node_modules/troika-worker-utils": {
      "version": "0.52.0",
      "resolved": "https://registry.npmjs.org/troika-worker-utils/-/troika-worker-utils-0.52.0.tgz",
      "integrity": "sha512-W1CpvTHykaPH5brv5VHLfQo9D1OYuo0cSBEUQFFT/nBUzM8iD6Lq2/tgG/f1OelbAS1WtaTPQzE5uM49egnngw==",
      "license": "MIT"
    },
    "node_modules/ts-api-utils": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",
      "integrity": "sha512-OJ/ibxhPlqrMM0UiNHJ/0CKQkoKF243/AEmplt3qpRgkW8VG7IfOS41h7V8TjITqdByHzrjcS/2si+y4lIh8NA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4"
      }
    },
    "node_modules/ts-interface-checker": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
      "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
      "license": "Apache-2.0"
    },
    "node_modules/tsconfig-paths": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz",
      "integrity": "sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/json5": "^0.0.29",
        "json5": "^1.0.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      }
    },
    "node_modules/tsconfig-paths/node_modules/json5": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz",
      "integrity": "sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/tunnel-rat": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/tunnel-rat/-/tunnel-rat-0.1.2.tgz",
      "integrity": "sha512-lR5VHmkPhzdhrM092lI2nACsLO4QubF0/yoOhzX7c+wIpbN1GjHNzCc91QlpxBi+cnx8vVJ+Ur6vL5cEoQPFpQ==",
      "license": "MIT",
      "dependencies": {
        "zustand": "^4.3.2"
      }
    },
    "node_modules/tunnel-rat/node_modules/zustand": {
      "version": "4.5.7",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-4.5.7.tgz",
      "integrity": "sha512-CHOUy7mu3lbD6o6LJLfllpjkzhHXSBlX8B9+qPddUsIfeF5S/UZ5q0kmCsnRqT1UHFQZchNFDDzMbQsuesHWlw==",
      "license": "MIT",
      "dependencies": {
        "use-sync-external-store": "^1.2.2"
      },
      "engines": {
        "node": ">=12.7.0"
      },
      "peerDependencies": {
        "@types/react": ">=16.8",
        "immer": ">=9.0.6",
        "react": ">=16.8"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        }
      }
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/typed-array-buffer": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
      "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/typed-array-byte-length": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
      "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-byte-offset": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.5.tgz",
      "integrity": "sha512-0FHJvLPqZ7KJzp17O13jfsAjsqazgrxBu2zEK95PmUz8lv2+GjRuxUInCr2Rk9Dms3ihN21zJ929ZO43yJ95QQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-length": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.8.tgz",
      "integrity": "sha512-phPGCwqr2+Qo0fwniCE8e4pKnGu/yFb5nD5Y8bf0EEeiI5GklnACYA9GFy/DrAeRrKHXvHn+1SUsOWgJp6RO+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "possible-typed-array-names": "^1.1.0",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "peer": true,
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/typescript-eslint": {
      "version": "8.70.1",
      "resolved": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.70.1.tgz",
      "integrity": "sha512-AcWG7KDjZ2THNXsgwttMaGmzVi0VFRlFYfqFHYQRbDpF3owuYbuiL8c7UUrd2k8s3PoSfIQrWfrGXfcElrWLYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "8.70.1",
        "@typescript-eslint/parser": "8.70.1",
        "@typescript-eslint/typescript-estree": "8.70.1",
        "@typescript-eslint/utils": "8.70.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
      "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-bigints": "^1.0.2",
        "has-symbols": "^1.1.0",
        "which-boxed-primitive": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unrs-resolver": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/unrs-resolver/-/unrs-resolver-1.12.2.tgz",
      "integrity": "sha512-dmlRxBJJayXjqTwC+JtF1HhJmgf3ftQ3YejFcZrf4+KKtJv0qDsK1pjqaaVjG7wJ5NJ6UVP1OqRMQ71Z4C3rxQ==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "napi-postinstall": "^0.3.4"
      },
      "funding": {
        "url": "https://opencollective.com/unrs-resolver"
      },
      "optionalDependencies": {
        "@unrs/resolver-binding-android-arm-eabi": "1.12.2",
        "@unrs/resolver-binding-android-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-x64": "1.12.2",
        "@unrs/resolver-binding-freebsd-x64": "1.12.2",
        "@unrs/resolver-binding-linux-arm-gnueabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm-musleabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-ppc64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-s390x-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-musl": "1.12.2",
        "@unrs/resolver-binding-openharmony-arm64": "1.12.2",
        "@unrs/resolver-binding-wasm32-wasi": "1.12.2",
        "@unrs/resolver-binding-win32-arm64-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-ia32-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-x64-msvc": "1.12.2"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.3.3.tgz",
      "integrity": "sha512-pJ2sYawQS0R/WI928Gj5GlPhTGzbMelq0+4INtSYNDV9ErKJcX6xjGWkoG/VnB3dpUm00zALaqkrUD77pO5TDQ==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/use-sync-external-store": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.7.0.tgz",
      "integrity": "sha512-6L+EeigHMQhdaIPNIFUKwfWJSwWFQ8gJbJ2DLOs5sDIegTwR9fRxvnM3uciHKjIZhFz+KAv2emhWMRvDmMcY8A==",
      "license": "MIT",
      "peerDependencies": {
        "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
      }
    },
    "node_modules/util-deprecate": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
      "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
      "license": "MIT"
    },
    "node_modules/utility-types": {
      "version": "3.11.0",
      "resolved": "https://registry.npmjs.org/utility-types/-/utility-types-3.11.0.tgz",
      "integrity": "sha512-6Z7Ma2aVEWisaL6TvBCy7P8rm2LQoPv6dJ7ecIaIixHcwfbJ0x7mWdbcwlIM5IGQxPZSFYeqRCqlOOeKoJYMkw==",
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/victory-vendor": {
      "version": "37.3.6",
      "resolved": "https://registry.npmjs.org/victory-vendor/-/victory-vendor-37.3.6.tgz",
      "integrity": "sha512-SbPDPdDBYp+5MJHhBCAyI7wKM3d5ivekigc2Dk2s7pgbZ9wIgIBYGVw4zGHBml/qTFbexrofXW6Gu4noGxrOwQ==",
      "license": "MIT AND ISC",
      "dependencies": {
        "@types/d3-array": "^3.0.3",
        "@types/d3-ease": "^3.0.0",
        "@types/d3-interpolate": "^3.0.1",
        "@types/d3-scale": "^4.0.2",
        "@types/d3-shape": "^3.1.0",
        "@types/d3-time": "^3.0.0",
        "@types/d3-timer": "^3.0.0",
        "d3-array": "^3.1.6",
        "d3-ease": "^3.0.1",
        "d3-interpolate": "^3.0.1",
        "d3-scale": "^4.0.2",
        "d3-shape": "^3.1.0",
        "d3-time": "^3.0.0",
        "d3-timer": "^3.0.1"
      }
    },
    "node_modules/webgl-constants": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/webgl-constants/-/webgl-constants-1.1.1.tgz",
      "integrity": "sha512-LkBXKjU5r9vAW7Gcu3T5u+5cvSvh5WwINdr0C+9jpzVB41cjQAP5ePArDtk/WHYdVj0GefCgM73BA7FlIiNtdg=="
    },
    "node_modules/webgl-sdf-generator": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/webgl-sdf-generator/-/webgl-sdf-generator-1.1.1.tgz",
      "integrity": "sha512-9Z0JcMTFxeE+b2x1LJTdnaT8rT8aEp7MVxkNwoycNmJWwPdzoXzMh0BjJSh/AEFP+KPYZUli814h8bJZFIZ2jA==",
      "license": "MIT"
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
      "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-bigint": "^1.1.0",
        "is-boolean-object": "^1.2.1",
        "is-number-object": "^1.1.1",
        "is-string": "^1.1.1",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-builtin-type": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
      "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "function.prototype.name": "^1.1.6",
        "has-tostringtag": "^1.0.2",
        "is-async-function": "^2.0.0",
        "is-date-object": "^1.1.0",
        "is-finalizationregistry": "^1.1.0",
        "is-generator-function": "^1.0.10",
        "is-regex": "^1.2.1",
        "is-weakref": "^1.0.2",
        "isarray": "^2.0.5",
        "which-boxed-primitive": "^1.1.0",
        "which-collection": "^1.0.2",
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-collection": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
      "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-map": "^2.0.3",
        "is-set": "^2.0.3",
        "is-weakmap": "^2.0.2",
        "is-weakset": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-typed-array": {
      "version": "1.1.24",
      "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.24.tgz",
      "integrity": "sha512-wk4Mf4pR5mRP7eYuuTBCIQ9d0ud2Fv2jRLQpfgnRjbOxAFHmjKFValgTpitVKzJJS8ajnYQV2Du1SZ8j6b/EUQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "for-each": "^0.3.5",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "3.25.76",
      "resolved": "https://registry.npmjs.org/zod/-/zod-3.25.76.tgz",
      "integrity": "sha512-gzUt/qt81nXsFGKIFcC3YnfEAx5NkunCfnDlvuBSSFS02bcXu4Lmea0AFIUwbLWxWPx3d9p8S5QoaujKcNQxcQ==",
      "license": "MIT",
      "peer": true,
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    },
    "node_modules/zustand": {
      "version": "5.0.15",
      "resolved": "https://registry.npmjs.org/zustand/-/zustand-5.0.15.tgz",
      "integrity": "sha512-MpSEjRiBkA9crSYeOUH32rJC7SVqAbm0Fqcqge/bUi2PPoLcBWKOsG+C8mevmpr8TwXHBVkChbbJiyvkE+i/3A==",
      "license": "MIT",
      "engines": {
        "node": ">=12.20.0"
      },
      "peerDependencies": {
        "@types/react": ">=18.0.0",
        "immer": ">=9.0.6",
        "react": ">=18.0.0",
        "use-sync-external-store": ">=1.2.0"
      },
      "peerDependenciesMeta": {
        "@types/react": {
          "optional": true
        },
        "immer": {
          "optional": true
        },
        "react": {
          "optional": true
        },
        "use-sync-external-store": {
          "optional": true
        }
      }
    }
  }
}
```

---

# FILE: `frontend\package.json`

```json
{
  "name": "wbsl-bridge-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.9.1",
    "@react-three/drei": "^10.7.9",
    "@react-three/fiber": "^9.8.1",
    "@tanstack/react-query": "^5.103.2",
    "autoprefixer": "^10.6.1",
    "axios": "^1.20.0",
    "clsx": "^2.1.1",
    "framer-motion": "^13.4.1",
    "lucide-react": "^1.47.0",
    "next": "16.3.6",
    "postcss": "^8.5.28",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-hook-form": "^7.88.0",
    "recharts": "^3.10.1",
    "sonner": "^2.0.8",
    "tailwind-merge": "^3.7.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "0.185.1",
    "zod": "^3.25.76",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "0.185.0",
    "eslint": "^9",
    "eslint-config-next": "16.3.6",
    "tailwindcss": "^3.4.19",
    "typescript": "^5"
  }
}
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
  Eye,
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
  ScanFace,
  Hand,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  Lock,
  Globe,
  WifiOff,
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
      focus: "WBSL/ISL/BdSL sign recording coordination, dataset annotation, NMM tagging, landmark data quality review",
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
      desc: "30 FPS webcam capture, MediaPipe Holistic extracts 540 landmarks (42 hand + 468 face + 33 pose)",
    },
    {
      id: "recognition",
      icon: Hand,
      label: "RECOGNITION",
      color: "text-status-pending",
      desc: "Static MLP (99.9% acc) is LIVE. Continuous LSTM video training for dynamic signs is currently HALF-DONE and in active progress.",
    },
    {
      id: "nmm",
      icon: ScanFace,
      label: "NMM GATE",
      color: "text-accent-secondary",
      desc: "5 geometry-based markers: eyebrow raise/furrow, head shake/nod, mouth open. Deterministic, < 5ms",
    },
    {
      id: "emotion",
      icon: Sparkles,
      label: "EMOTION",
      color: "text-accent-secondary",
      desc: "ViT-ONNX 7-class classifier, robust to glasses, ~30–50ms. Supplementary affective context",
    },
    {
      id: "nlg",
      icon: Brain,
      label: "BENGALI NLG",
      color: "text-accent-primary",
      desc: "gemma-4-E4B, 50-criteria constrained prompt, preserves question/negation/WHETHER/IF-THEN scope",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      color: "text-accent-primary",
      desc: "edge-tts (online, ~604 ms/word) → BanglaTTS (offline, ~453 ms/word) automatic fallback",
    },
  ];

  const techStack = [
    { category: "Vision", items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX (trpakov/vit-face-expression)" },
    { category: "ML", items: "PyTorch · ONNX Runtime · MLP (static) · LSTM (temporal, in progress) · 258-dim holistic (hands+pose) active contract" },
    { category: "LLM", items: "gemma-4-E4B-it-Q4_K_M (deployment) · gemma-4-12b-it-Q4_0 (reference) · KoboldCpp" },
    { category: "TTS", items: "edge-tts (bn-BD-NabanitaNeural) · BanglaTTS (silero) · mutagen" },
    { category: "Frontend", items: "Next.js 14 · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts" },
    { category: "Backend", items: "FastAPI · WebSocket · Python 3.11 · Single venv deployment" },
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
    { label: "MediaPipe Stream", desc: "540 landmarks extracted at stable 30 FPS.", status: "DONE" },
    { label: "Emotion & NMM", desc: "ViT-ONNX (glasses-robust) and 5 geometric NMM markers live.", status: "DONE" },
    { label: "Static Recognition", desc: "126-dim MLP achieving 99.9% validation accuracy.", status: "DONE" },
    { label: "Bengali NLG & TTS", desc: "6 models benchmarked; gemma-4-E4B selected and stress-tested.", status: "DONE" },
    { label: "Continuous Action Recognition", desc: "Pipeline designed; LSTM video training is half-done.", status: "HALF-DONE" },
  ];

  const roadmap = [
    { num: 1, label: "Continuous Action Recognition", desc: "Finalizing LSTM training on continuous video sequences for dynamic signs (currently half-done).", active: false },
    { num: 2, label: "WB Region Data Creation", desc: "A dedicated data collector tool is being prepared to build the first continuous dataset for WBSL/ISL/BdSL.", active: true },
    { num: 3, label: "Field Survey", desc: "50+ field verification questions prepared and structured for real-world community data collection.", active: true },
    { num: 4, label: "Unknown Sign Handling", desc: "Fully implementing the “Honesty Layer” to detect unknown signs and prevent AI hallucination.", active: false },
    { num: 5, label: "Real-Time Workable UI", desc: "Conversation documenting, Sign-to-Voice and Voice-to-Sign on a single, high-speed interface.", active: false },
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
              <div key={item.label} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-md border ${item.status === "HALF-DONE" ? "bg-status-unknown/5 border-status-unknown" : "bg-surface border-border"}`}>
                <div className="flex items-center gap-3 sm:w-1/3">
                  {item.status === "DONE" ? (
                    <CheckCircle2 size={18} className="text-status-approved shrink-0" />
                  ) : (
                    <Clock3 size={18} className="text-status-unknown shrink-0" />
                  )}
                  <span className={`text-sm font-semibold ${item.status === "HALF-DONE" ? "text-status-unknown" : "text-text-primary"}`}>
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
                    <span className="text-[10px] font-mono text-text-muted">STAGE {i + 1}/6</span>
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
            { title: "Landmark-Based Signer Independence", desc: "126-dim normalized vector removes skin color, background, lighting bias. 99.9% val accuracy for static signs." },
            { title: "Open-Set Honesty Layer", desc: "OOD gate detects unknown signs BEFORE LLM reasoning. Output carries সম্ভবত (probably), never forced classification." },
            { title: "Fast/Slow Path Separation", desc: "Real-time recognition in fast path (<50ms). Heavy LLM reasoning runs asynchronously off critical path." },
            { title: "Privacy-First Verification", desc: "Landmarks only, never raw video. Human reviewers decide. DPDP Act 2023 compliant." },
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
          All modules run in a single Python 3.11 venv on CPU. No cloud dependency for core operation.
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
          ~15,000 pre-labelled sequences covering 460+ signs. Community collection via web platform
          targets 10–15 recordings per sign from 3–5 signers across WBSL, ISL, and BdSL varieties.
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
            Signer-disjoint splits enforced. Manifest-based indexing by provenance, signer, and verification status.
            Only human-accepted community data enters training. Embedding index rebuilt per dataset version.
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
          When the OOD gate detects a sign outside trained vocabulary, the system does not guess confidently.
          It generates a three-tier movement representation and produces ranked tentative candidates.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { tier: "LEVEL 1", label: "Numerical", desc: "finger_extension, velocity, repetition, duration, distance_to_mouth" },
            { tier: "LEVEL 2", label: "Symbolic", desc: "RIGHT_HAND INDEX_EXTENDED TOWARD_MOUTH REPEATED_3X NO_NMM" },
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

      {/* ─── COMMUNITY VERIFICATION ─── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} className="text-accent-primary" />
          <h2 className="text-2xl font-bold text-text-primary">Community Data Verification</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          Privacy-first submission. Only landmarks are collected; original video is discarded on-device
          before transmission. Automated validation produces evidence only. Human reviewers make all
          final decisions. Compliant with India&rsquo;s Digital Personal Data Protection Act 2023.
        </p>
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-md bg-surface border border-border">
          <Lock size={14} className="text-accent-primary" />
          <span className="text-xs font-mono text-text-secondary">
            AUTOMATION → ANALYSE → EXPLAIN → SIMULATE → SHOW EVIDENCE → HUMAN DECIDES
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
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
              Camera → MediaPipe → 126-dim landmarks → MLP/LSTM → OOD Gate → NMM + Emotion packet
              → Constrained LLM → Natural Bengali text → Dual-engine TTS audio
            </p>
          </div>
          <div className="p-4 rounded-md bg-surface border border-border space-y-2">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-accent-secondary" />
              <span className="text-xs font-mono font-bold text-text-primary">REVERSE: BENGALI → SIGN</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Bengali text/voice → LLM gloss generation → Sign sequence mapping →
              Admin-approved reference videos → Continuous sequential playback
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
            <span className="text-xs font-mono text-text-secondary">ONLINE: edge-tts + full features</span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff size={14} className="text-status-pending" />
            <span className="text-xs font-mono text-text-secondary">OFFLINE: BanglaTTS + local LLM (KoboldCpp)</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-accent-primary" />
            <span className="text-xs font-mono text-text-secondary">LLM: LOCAL (gemma-4-E4B)</span>
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
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { contributionService } from "@/services/contributions";
import { EvidencePanel } from "@/components/verification/EvidencePanel";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { TableRowSkeleton } from "@/components/skeletons";
import { Contribution } from "@/lib/types";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

export default function AdminContributionsPage() {
  const { data: contributions, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-contributions"],
    queryFn: () => contributionService.getContributions(),
  });

  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const { data: evidence, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", selectedContribution?.sample_id],
    queryFn: () => contributionService.getEvidence(selectedContribution!.sample_id),
    enabled: !!selectedContribution,
  });

  // Real extracted landmarks of the submitted sample (no synthetic fallback).
  const { data: sim } = useQuery({
    queryKey: ["sim-frames-sample", selectedContribution?.sample_id],
    queryFn: async () =>
      (await axios.get(`${API_BASE}/api/simulation/frames`, {
        params: { sample_id: selectedContribution!.sample_id },
      })).data,
    enabled: !!selectedContribution,
    retry: false,
  });

  const handleVerify = async (action: "accepted" | "rejected" | "needs_review", notes?: string) => {
    if (!selectedContribution) return;
    try {
      await contributionService.verifyContribution(selectedContribution.sample_id, action, notes);
      toast.success(`Submission marked as ${action.toUpperCase()}`);
      setSelectedContribution(null);
      refetch();
    } catch {
      toast.error("Failed to submit verification action");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">VERIFICATION PIPELINE</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Community Contributions & Evidence Review
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Contributions Queue Table (5 cols) */}
        <div className="xl:col-span-5 bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-surface-elevated flex justify-between items-center text-xs font-mono">
            <span className="font-semibold text-text-primary uppercase">INCOMING QUEUE</span>
            <span className="text-text-secondary">{contributions?.length || 0} SAMPLES</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2.5 px-3">Sign</th>
                  <th className="py-2.5 px-3">Signer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={4} />
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-status-error">
                      Could not load contributions. Check the backend connection and try again.
                    </td>
                  </tr>
                ) : contributions?.length ? contributions.map((item) => (
                  <tr
                    key={item.sample_id}
                    onClick={() => setSelectedContribution(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedContribution?.sample_id === item.sample_id
                        ? "bg-accent-primary/10 border-l-2 border-accent-primary"
                        : "hover:bg-surface-elevated/60"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-text-primary">{item.label}</td>
                    <td className="py-3 px-3 text-text-secondary">{item.signer_id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-status-pending/20 text-status-pending">
                        {item.verification}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-accent-primary hover:underline text-[11px]">Inspect</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No community contributions have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Inspection, Simulation & Evidence Panel (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {selectedContribution ? (
            <>
              {/* Landmark Canvas Player */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-text-muted">
                  Kinematic Skeleton Replay: {selectedContribution.label}
                </div>
                <LandmarkSimulation frames={sim?.frames} pose={sim?.pose} fps={15} title={sim?.source} />
              </div>

              {/* Evidence Panel with Reasoning Layer */}
              {evidenceLoading ? (
                <div className="p-8 bg-surface rounded border border-border text-center text-xs font-mono text-text-muted">
                  Loading kinematic telemetry...
                </div>
              ) : evidence ? (
                <EvidencePanel
                  evidence={evidence}
                  submittedLabel={selectedContribution.label}
                  signerId={selectedContribution.signer_id}
                  onAction={handleVerify}
                />
              ) : null}
            </>
          ) : (
            <div className="h-96 bg-surface border border-border rounded-lg flex items-center justify-center text-center p-6 text-xs font-mono text-text-muted">
              Select a contribution from the left queue to inspect MediaPipe coordinates and algorithmic evidence.
            </div>
          )}
        </div>
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
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden p-6 md:p-8">
        {children}
      </div>
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

/**
 * The two feature vectors the backend can actually produce (backend/extract.py):
 * 126 is the two-hand landmark block, 258 adds the 33x4 pose block that the
 * daily-conversation LSTM is trained on. Anything else cannot be fed, so the
 * backend refuses it -- this mirror only greys the button out first.
 */
const SERVABLE_WIDTHS = [126, 258];

/** A model is servable when the backend has an extractor for its input width. */
const canActivate = (m: ModelEntry) =>
  m.input_width !== null && SERVABLE_WIDTHS.includes(m.input_width);

/** Human name for the extractor an input width selects. */
const featureLabel = (m: ModelEntry) => {
  if (m.temporal) return "LSTM temporal";
  if (m.input_width === 258) return "MLP static \u00b7 hands+pose 258";
  return `MLP static \u00b7 input ${m.input_width ?? "?"}`;
};

export default function AdminModelsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () =>
      (await axios.get<RegistryResponse>(`${API_BASE}/api/admin/models`)).data,
    refetchInterval: 15000,
  });

  const rescan = useMutation({
    mutationFn: async () =>
      (await axios.post(`${API_BASE}/api/admin/models/rescan`)).data,
    onSuccess: () => {
      toast.success("Model folder re-scanned and reloaded");
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.detail || "Rescan failed"),
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
    onError: (e: any) => toast.error(e?.response?.data?.detail || "Activation failed"),
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
                    title="The backend has no extractor for this input width (it emits 126-dim two-hand or 258-dim hands+pose vectors)"
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
          <div className="text-xs font-mono uppercase text-text-muted">Approved Samples</div>
          <div className="text-2xl font-bold text-accent-primary">{stats?.total_approved_samples ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">Dataset: {stats?.dataset_version ?? "—"}</div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Active Model</div>
          <div className="text-lg font-bold text-text-primary truncate">{stats?.model_active ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">
            {stats?.contract?.feature_width ?? 126}-dim {stats?.contract?.kind ?? "model"} · {stats?.model_classes ?? "—"} classes
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
        <Link
          href="/admin/contributions"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-primary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-3">
              <CheckSquare size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Contribution Verification</h3>
            <p className="text-xs text-text-secondary mt-1">
              Inspect coordinate trajectories, validation scores, and reviewer reasoning layers.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-primary font-bold">
            <span>Review Queue</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/dataset"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-secondary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-3">
              <Database size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Dataset Explorer</h3>
            <p className="text-xs text-text-secondary mt-1">
              Browse the sign lexicon, filter by category and dialect, and inspect per-sign sample counts.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-secondary font-bold">
            <span>Open Explorer</span>
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
    ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? "—"}-dim · ${health?.contract?.frames ?? 1} frames`],
    ["SIGN VOCABULARY", String(health?.vocabulary_classes ?? 0)],
    ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
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
  face_mesh?: number[][][];
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
      <div className="text-xs font-mono uppercase text-text-muted">ACTIVE MODEL SIMULATION</div>
      <h1 className="text-2xl font-bold text-text-primary">Landmark Sequence Inspector</h1>
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
                faceMesh={replay.face_mesh}
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

# FILE: `frontend\src\app\contribute\page.tsx`

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { contributionService } from "@/services/contributions";
import { useRecordingStore } from "@/store/recording-store";
import { Search, ArrowRight, Video } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface NeedsDataSign {
  id: string;
  label: string;
  bengali: string;
  current: number;
  target: number;
}

export default function ContributePage() {
  const router = useRouter();
  const { setSession, selectSign } = useRecordingStore();
  const [search, setSearch] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [needsData, setNeedsData] = useState<NeedsDataSign[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/contributions/needs-data`)
      .then((res) => setNeedsData(res.data.items))
      .catch(() => setNeedsData([]));
  }, []);

  const filtered = search
    ? needsData.filter((s) =>
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.bengali.includes(search)
      )
    : needsData;

  const handleStartSession = async (signId: string, label: string) => {
    setIsStarting(true);
    try {
      const sess = await contributionService.createSession("signer_temp");
      setSession(sess.session_id);
      selectSign(signId, label);
      router.push(`/contribute/session/${sess.session_id}`);
    } catch {
      toast.error("Failed to initiate contribution session");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <PageContainer className="space-y-8 max-w-4xl">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-status-pending">
          <span className="w-2 h-2 rounded-full bg-status-pending" />
          <span>COMMUNITY KINEMATIC DATA INGESTION</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Contribute to WBSL
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Help improve AI recognition accuracy for West Bengal Sign Language.
          Record authentic gestures from your district to diversify the open research dataset.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a specific sign to contribute..."
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-primary"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
            PRIORITY: NEEDS MORE DATA (LOWEST SAMPLE COUNTS)
          </span>
          <span className="text-xs font-mono text-status-pending">
            TARGET: 50 SAMPLES / SIGN
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-text-muted">
            No signs found matching your search.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent-primary/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm font-bold text-text-primary">{item.label}</span>
                    <span className="font-bengali text-sm text-text-secondary">{item.bengali}</span>
                  </div>
                  <div className="text-xs font-mono text-text-muted">
                    Samples recorded: <strong className="text-accent-primary">{item.current}</strong> / {item.target} target
                  </div>
                </div>
                <button
                  disabled={isStarting}
                  onClick={() => handleStartSession(item.id, item.label)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded bg-accent-primary text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-primary/90 transition-colors shrink-0 disabled:opacity-50"
                >
                  <Video size={14} />
                  <span>Record This Sign</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\contribute\session\[id]\page.tsx`

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { PrivacyGate } from "@/components/recording/PrivacyGate";
import { UploadRecovery } from "@/components/recording/UploadRecovery";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { useCamera } from "@/hooks/useCamera";
import { useRecording } from "@/hooks/useRecording";
import { useRecordingStore } from "@/store/recording-store";
import { contributionService } from "@/services/contributions";
import { Video, Square, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface LandmarkReplay {
  label: string;
  frames: number[][][];
  pose?: [number, number, number, number][][];
  face_mesh?: number[][][];
  source: string;
}

export default function ContributeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const {
    state,
    consentGiven,
    currentSignLabel,
    signerId,
    nmmTags,
    setState,
    setConsent,
    toggleNMMTag,
    resetNMMTags,
    incrementSamples,
  } = useRecordingStore();

  const { stream, videoRef, isReady, startCamera } = useCamera();
  const { isRecording, startRecording, stopRecording, recordedBlob, recordedUrl, clearRecording } = useRecording(stream);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState(false);
  const [refMedia, setRefMedia] = useState<LandmarkReplay | null>(null);

  useEffect(() => {
    if (consentGiven && !isReady) {
      startCamera();
    }
  }, [consentGiven, isReady, startCamera]);

  // Show the same active-model sequence used by Text -> Sign and the dataset viewer.
  useEffect(() => {
    if (!currentSignLabel) {
      return;
    }
    let cancelled = false;
    axios.get<LandmarkReplay>(`${API_BASE}/api/simulation/frames`, {
      params: { label: currentSignLabel },
    })
      .then((r) => {
        if (!cancelled) setRefMedia({ ...r.data, label: currentSignLabel });
      })
      .catch(() => {
        if (!cancelled) setRefMedia(null);
      });
    return () => {
      cancelled = true;
    };
  }, [currentSignLabel]);

  // Handle countdown before recording starts
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Side effects belong in an effect, NOT inside a setState updater.
      // Calling them during the updater runs them mid-render, which is what
      // produced "Cannot update a component while rendering a different component".
      setCountdown(null);
      startRecording();
      setState("RECORDING");
      return;
    }

    const timer = setTimeout(() => setCountdown((prev) => (prev === null ? null : prev - 1)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, startRecording, setState]);

  const triggerRecording = () => {
    setCountdown(3);
  };

  const handleStopRecording = () => {
    stopRecording();
    setState("NMM_TAGGING");
  };

  // REAL upload: recorded video → backend extracts landmarks → npy + manifest
  const handleSubmitSample = async () => {
    if (!recordedBlob) {
      toast.error("No recording captured. Record a gesture first.");
      return;
    }
    setState("SUBMITTING_VIDEO");
    const fd = new FormData();
    fd.append("label", currentSignLabel || "UNKNOWN");
    fd.append("signer_id", signerId || "anonymous");
    fd.append("nmm_tags", JSON.stringify(nmmTags));
    fd.append("file", recordedBlob, `rec_${Date.now()}.webm`);
    try {
      const res = await contributionService.submitSample(sessionId, fd);
      incrementSamples();
      setState("SUBMITTED");
      toast.success(`Sample ${res.sample_id} uploaded (${res.frames} landmark frames)`);
    } catch {
      setUploadError(true);
      setState("NMM_TAGGING");
      toast.error("Upload failed — recording kept locally, retry when ready");
    }
  };

  if (!consentGiven) {
    return (
      <PageContainer className="py-8">
        <PrivacyGate
          onConsent={(sId, saveVideo) => {
            setConsent(sId, saveVideo);
            setState("REFERENCE_VIEW");
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SESSION ID: {sessionId}</div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary mt-0.5">
            Recording: <span className="text-accent-primary">{currentSignLabel || "HELLO"}</span>
          </h1>
        </div>
        <div className="text-xs font-mono text-text-secondary">
          SIGNER: <strong className="text-text-primary">{signerId}</strong>
        </div>
      </div>

      {uploadError && (
        <UploadRecovery onRetry={() => { setUploadError(false); handleSubmitSample(); }} />
      )}

      {/* Camera Preview */}
      <div className="relative aspect-video w-full bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
        {state === "PREVIEW" && recordedUrl ? (
          <video src={recordedUrl} controls className="w-full h-full object-contain" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="text-7xl font-extrabold font-mono text-accent-primary animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Recording active badge */}
        {isRecording && (
          <div className="absolute top-4 left-4 bg-status-error text-white px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>RECORDING GESTURE</span>
          </div>
        )}
      </div>

      {/* Watch and copy the active model's landmark sequence before recording */}
      {state === "REFERENCE_VIEW" && (
        <div className="p-4 bg-surface rounded-lg border border-border space-y-3">
          <div className="text-xs font-mono uppercase text-text-muted">
            ACTIVE MODEL SIGN — watch it, then copy the sign
          </div>
          {refMedia?.label === currentSignLabel && refMedia.frames.length ? (
            <LandmarkSimulation
              key={`${currentSignLabel}-${refMedia.source}`}
              frames={refMedia.frames}
              pose={refMedia.pose}
              faceMesh={refMedia.face_mesh}
              fps={15}
              title={refMedia.source}
            />
          ) : (
            <div className="aspect-video w-full bg-background border border-border rounded flex items-center justify-center text-xs font-mono text-text-muted">
              No landmark sequence is bundled for this sign in the active model.
            </div>
          )}
          <button
            onClick={() => setState("READY_TO_RECORD")}
            className="w-full py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
          >
            I have seen it — start recording
          </button>
        </div>
      )}

      {/* Workflow Controls based on State Machine */}
      {state === "READY_TO_RECORD" && (
        <div className="p-4 bg-surface rounded-lg border border-border flex justify-between items-center">
          <span className="text-xs font-mono text-text-secondary">Position yourself in frame and click Record</span>
          <button
            onClick={triggerRecording}
            className="flex items-center space-x-2 px-5 py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
          >
            <Video size={15} />
            <span>Start 3s Countdown</span>
          </button>
        </div>
      )}

      {state === "RECORDING" && (
        <div className="p-4 bg-surface rounded-lg border border-border flex justify-between items-center">
          <span className="text-xs font-mono text-status-error font-semibold">Gesture in progress...</span>
          <button
            onClick={handleStopRecording}
            className="flex items-center space-x-2 px-5 py-2.5 rounded bg-status-error text-white font-mono text-xs uppercase font-bold hover:bg-status-error/90 transition-colors"
          >
            <Square size={15} />
            <span>Finish Gesture</span>
          </button>
        </div>
      )}

      {/* NMM Tagging Step per Section 8 & 9.5 */}
      {state === "NMM_TAGGING" && (
        <div className="p-6 bg-surface rounded-lg border border-border space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Tag Non-Manual Markers (NMM)</h3>
              <p className="text-xs text-text-secondary">Did you perform facial grammatical markers during this sample?</p>
            </div>
            <button
              onClick={() => setState("READY_TO_RECORD")}
              className="flex items-center space-x-1 text-xs font-mono text-text-secondary hover:text-text-primary"
            >
              <RotateCcw size={13} />
              <span>Retake</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: "question", label: "Question (Raised Brows)" },
              { id: "wh_question", label: "WH-Question (Furrowed Brows)" },
              { id: "negation", label: "Negation (Head Shake)" },
              { id: "affirmation", label: "Affirmation (Head Nod)" },
              { id: "emphasis", label: "Emphasis (Intense Gaze)" },
              { id: "head_tilt", label: "Head Tilt" },
            ].map((tag) => (
              <label
                key={tag.id}
                onClick={() => toggleNMMTag(tag.id as any)}
                className={`p-3 rounded border text-xs font-mono cursor-pointer transition-colors ${
                  (nmmTags as any)[tag.id]
                    ? "bg-accent-primary/20 border-accent-primary text-text-primary font-semibold"
                    : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <span>{tag.label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmitSample}
            className="w-full py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors mt-2"
          >
            Confirm & Upload Sample
          </button>
        </div>
      )}

      {state === "SUBMITTING_VIDEO" && (
        <div className="p-6 bg-surface rounded-lg border border-border text-center text-xs font-mono text-text-secondary">
          Uploading recording & extracting landmarks on server...
        </div>
      )}

      {state === "SUBMITTED" && (
        <div className="p-8 bg-surface rounded-lg border border-border text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-status-approved/20 border border-status-approved flex items-center justify-center text-status-approved">
            <Check size={24} />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Gesture Successfully Ingested</h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto">
            Landmark sequence saved to the community dataset and queued for admin verification.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                resetNMMTags();
                clearRecording();
                setUploadError(false);
                setState("READY_TO_RECORD");
              }}
              className="px-4 py-2 rounded bg-accent-primary text-black text-xs font-mono font-semibold"
            >
              Record Another Sample
            </button>
            <button
              onClick={() => router.push("/contribute")}
              className="px-4 py-2 rounded bg-surface-elevated border border-border text-text-primary text-xs font-mono"
            >
              Choose Different Sign
            </button>
          </div>
        </div>
      )}
    </PageContainer>
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
import { PipelineStatus } from "@/components/pipeline/PipelineStatus";
import { Play, Volume2, Sparkles, AlertCircle } from "lucide-react";
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

      {/* Pipeline Status */}
      <PipelineStatus
        stages={{ camera: "idle", landmarks: "active", recognition: "active", nlg: "active", tts: "active" }}
        fps={30}
      />

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
import {
  NmmThresholdPanel,
  DEFAULT_ALL,
  DEFAULT_MARKER_GATES,
  COMMIT_STORAGE_KEY,
  type AllThresholds,
  type MarkerGates,
} from "@/components/sign/NmmThresholdPanel";
import { EmotionPanel } from "@/components/sign/EmotionPanel";
import { CameraFramingGuide } from "@/components/camera/CameraFramingGuide";
import { FramingWarningArea } from "@/components/camera/FramingWarningArea";
import {
  Camera,
  CameraOff,
  Volume2,
  Trash2,
  Loader2,
  Delete,
  Plus,
  Activity,
  Sparkles,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8200";

interface Prediction {
  detected: boolean;
  label: string;
  confidence: number;
  top5: { label: string; confidence: number }[];
  hands_detected: number;
  nmm: {
    question: boolean;
    wh_question: boolean;
    negation: boolean;
    affirmation: boolean;
    emphasis: boolean;
    emotion?: EmotionResult | null;
    metrics?: NmmMetrics | null;
  };
  emotion?: EmotionResult | null;
  metrics?: NmmMetrics | null;
}

interface EmotionResultShape {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

type EmotionResult = EmotionResultShape;

interface NmmMetrics {
  brow_ratio: number;
  mouth_ratio: number;
  shake_var: number;
  nod_var: number;
}

interface DetectedSign {
  gloss: string;
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
}

/**
 * [affirmation] and [emphasis] have no symbol in the LLM prompt's notation
 * guide, so they are never appended to the gloss string. They still travel in
 * the `nmm` metadata payload, where the model is told what they mean.
 *
 * Which markers can reach this point at all is decided server-side by the NMM
 * Controller's gates (backend/nmm.py MARKER_GATES), not here.
 */

interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: EmotionResult | null;
  detail?: string;
  buffered?: number;
  top3?: { label: string; confidence: number }[];
  /** The window's non-manual markers, captured on the frame being recognised. */
  nmm?: Prediction["nmm"] & { emotion?: EmotionResult | null; metrics?: NmmMetrics | null };
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

  // Set once the streaming endpoint answers 404/405. From then on the tick uses
  // the batch path, which posts a whole window to /api/predict/stream -- the
  // only route a backend older than this page understands. Without this the page
  // would spend every tick failing against an endpoint that is not there.
  const [streamUnavailable, setStreamUnavailable] = useState(false);
  const streamFallbackRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [detectedHistory, setDetectedHistory] = useState<DetectedSign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const [live, setLive] = useState<{
    label: string;
    confidence: number;
    margin: number;
  } | null>(null);

  const [autoDetect, setAutoDetect] = useState(true);
  const [catalog, setCatalog] = useState<CatalogSign[]>([]);
  const [pickSign, setPickSign] = useState("");
  const [emotion, setEmotion] = useState<EmotionResult | null>(null);
  const [emotionAvailable, setEmotionAvailable] = useState(true);

  // The thresholds the panel last saved, read once on mount. Declared as an
  // initialiser rather than a useEffect that calls setThresholds: restoring
  // saved state in an effect body is a second render for data that was already
  // available synchronously, and the lint rule against setState-in-effect is
  // pointing at a real cost here, not a stylistic one.
  const savedThresholds = React.useMemo<Partial<AllThresholds> | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = localStorage.getItem(COMMIT_STORAGE_KEY);

      return raw ? (JSON.parse(raw) as Partial<AllThresholds>) : null;
    } catch {
      return null;
    }
  }, []);

  const thresholdsRef = useRef<AllThresholds>(DEFAULT_ALL);

  const [thresholds, setThresholds] = useState<AllThresholds>({
    ...DEFAULT_ALL,
    ...(savedThresholds ?? {}),
  });
  // Marker on/off gates, mirrored from the NMM Controller panel. Held here
  // because the panel can be closed and the page still needs the current state
  // to know what the server was last told.
  const [markerGates, setMarkerGates] =
    useState<MarkerGates>(DEFAULT_MARKER_GATES);

  const [repeatBlocked, setRepeatBlocked] = useState(false);
  // How deep the SERVER's buffer is. The client does not track this itself: it
  // uploads one frame per tick and the server reports what it holds.
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    thresholdsRef.current = thresholds;
  }, [thresholds]);

  // The gates live on the server, so the page must not invent its own default.
  // Reading them back on mount is what stops the panel showing OFF while the
  // detector is still emitting [negation] from a previous session.
  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/nmm/config`)
      .then((res) => {
        if (cancelled) return;

        const serverGates = res.data?.marker_gates;

        if (serverGates && typeof serverGates === "object") {
          setMarkerGates((prev) => ({ ...prev, ...serverGates }));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const [nmmFlags, setNmmFlags] =
    useState<Prediction["nmm"] | null>(null);

  const [bengaliOutput, setBengaliOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<string>("1");
  const [ttsEngine, setTtsEngine] = useState<"free" | "elevenlabs">("free");
  const [showTtsPremiumModal, setShowTtsPremiumModal] = useState(false);
  const [unifiedActive, setUnifiedActive] = useState(false);

  const frameBufferRef = useRef<Blob[]>([]);
  const candidateRef = useRef<{
    label: string;
    count: number;
  } | null>(null);

  const lastAppendRef = useRef<{
    label: string;
    at: number;
  }>({
    label: "",
    at: 0,
  });
  const idleSinceRef = useRef<number | null>(null);

  const [activeClasses, setActiveClasses] = useState(35);

  const [contract, setContract] = useState<{
    kind: "static" | "temporal";
    frames: number;
    endpoint: string;
    // Which extractor the active graph needs: "two_hand" (126-dim) or
    // "hands_pose" (258-dim). Only used to tell the user why a 258-dim run
    // wants their full body in frame; recognition itself is unchanged.
    feature_width?: number | null;
    feature_kind?: "two_hand" | "hands_pose" | null;
  }>({
    kind: "static",
    frames: 1,
    endpoint: "/api/predict/frame",
  });

  const [coverage, setCoverage] = useState<{
    with_landmark_sequences: number;
    total_classes: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_BASE}/api/system/health`)
      .then((res) => {
        if (cancelled) return;

        setBackendOnline(true);
        setUnifiedActive(!!res.data.unified);
        setEmotionAvailable(!!res.data.emotion_available);

        if (typeof res.data.vocabulary_classes === "number") {
          setActiveClasses(res.data.vocabulary_classes);
        }

        if (res.data.contract) {
          setContract(res.data.contract);
        }

        if (res.data.sequence_coverage) {
          setCoverage(res.data.sequence_coverage);
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

  const isTemporal = contract.kind === "temporal";

  const startCamera = async () => {
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: 640,
          height: 480,
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraActive(true);

      frameBufferRef.current = [];
      candidateRef.current = null;
      idleSinceRef.current = null;

      if (!intervalRef.current) {
        // 100 ms = 10 uploads/s. The server throttles its own inference to every
        // 250 ms and only keeps the newest frame in the buffer, so a faster tick
        // costs bandwidth without buying resolution; anything slower than ~150 ms
        // starts dropping frames out of the 30 fps capture the window assumes.
        intervalRef.current = setInterval(
          // The tick choice is read on EVERY tick, not at setInterval creation:
          // the 404 fallback flag can only flip after the first failed request,
          // and a ternary evaluated here would freeze the wrong tick forever.
          () => {
            if (!isTemporal) return doCaptureAndPredict();
            return streamFallbackRef.current ? doAutoDetectTick() : doStreamTick();
          },
          isTemporal ? 100 : 1000
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

    // [?] belongs to the last sign of a question, BUT a question is only a
    // question if something is actually being asked about: a WH-word, or a
    // negated / affirmed clause. A bare head shake must not become "...?)".
    const last = history[history.length - 1];
    const questionAnchored = history.some(
      (h) => h.wh_question || h.negation || h.affirmation || h.emphasis
    );
    const asksQuestion =
      questionAnchored && (last.question || last.wh_question);

    return history
      .map((h, i) => {
        let tok = `[${h.gloss.toLowerCase()}]`;

        if (h.negation) {
          tok += "[negation]";
        }

        if (asksQuestion && i === history.length - 1) {
          tok += "[?]";
        }

        return tok;
      })
      .join(" + ");
  };

  const doCaptureAndPredict = async () => {
    if (isProcessingRef.current) return;
    if (isTemporal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.7)
      );

      if (!blob) return;

      const formData = new FormData();

      formData.append("file", blob, "frame.jpg");

      const res = await axios.post<Prediction>(
        `${API_BASE}/api/predict/frame`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrediction(res.data);
      setNmmFlags(res.data.nmm);
      setEmotion(res.data.emotion ?? res.data.nmm?.emotion ?? null);

      if (
        res.data.detected &&
        res.data.confidence > 0.5
      ) {
        const f = res.data.nmm;

        setDetectedHistory((prev) => {
          const last = prev[prev.length - 1];

          if (last && last.gloss === res.data.label) {
            const merged: DetectedSign = {
              ...last,
              question: last.question || f.question,
              wh_question:
                last.wh_question || f.wh_question,
              negation: last.negation || f.negation,
              affirmation:
                last.affirmation || f.affirmation,
              emphasis:
                last.emphasis || f.emphasis,
            };

            return [
              ...prev.slice(0, -1),
              merged,
            ];
          }

          return [
            ...prev,
            {
              gloss: res.data.label,
              question: f.question,
              wh_question: f.wh_question,
              negation: f.negation,
              affirmation: f.affirmation,
              emphasis: f.emphasis,
            },
          ];
        });
      }
    } catch {
      // Keep camera running.
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
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
          // NMM + affect travel alongside the gloss so the LLM is not left
          // guessing at the question / negation / emotion context.
          body: JSON.stringify({
            gloss,
            nmm,
            emotion,
          }),
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

  const appendGloss = (
    gloss: string,
    nmm?: DetectedSign
  ) => {
    // The markers are whatever the detector reported for the window this sign
    // came from. Nothing is merged in from the UI: the manual marker buttons
    // were removed, and inventing a marker the detector never saw is exactly
    // what made the old panel untrustworthy.
    const applied: DetectedSign = {
      gloss,
      question: !!nmm?.question,
      wh_question: !!nmm?.wh_question,
      negation: !!nmm?.negation,
      affirmation: !!nmm?.affirmation,
      emphasis: !!nmm?.emphasis,
    };

    setDetectedHistory((prev) => [...prev, applied]);
  };

  /**
   * Everything the recognition stage knows but the gloss string cannot show.
   * This is what makes the questions block an OPTION rather than a blind rule:
   * the LLM only marks a question when the detector actually reported one -- and
   * only for markers whose gate is open in the NMM Controller.
   */
  const nmm = {
    question: !!prediction?.nmm?.question,
    wh_question: !!prediction?.nmm?.wh_question,
    negation: !!prediction?.nmm?.negation,
    affirmation: !!prediction?.nmm?.affirmation,
    emphasis: !!prediction?.nmm?.emphasis,
  };

  const handleBackspace = () => {
    if (detectedHistory.length === 0) {
      return;
    }

    setDetectedHistory((prev) =>
      prev.slice(0, -1)
    );

    // The dropped sign's markers leave with it. Nothing is restored, because
    // markers are no longer something the UI holds on the user's behalf -- they
    // come from the detector on the frame that is being recognised, and a
    // marker that has passed is a marker that has passed.
    setBengaliOutput("");
  };

  const handleAddPick = () => {
    if (!pickSign) return;

    appendGloss(pickSign);
    setBengaliOutput("");
  };

  const handleClear = () => {
    setDetectedHistory([]);
    setPrediction(null);
    setNmmFlags(null);
    setBengaliOutput("");
    setLive(null);
    setRepeatBlocked(false);

    candidateRef.current = null;
    idleSinceRef.current = null;

    lastAppendRef.current = {
      label: "",
      at: 0,
    };

    frameBufferRef.current = [];

    // The recognition window lives on the server now, so clearing the sequence
    // has to clear it there too. A fresh session id is the cheapest correct
    // reset: the old buffer is abandoned rather than mutated, and the next tick
    // starts from an empty window instead of reading the sign the user just
    // deleted.
    sessionIdRef.current = newSessionId();

    setBuffered(0);
  };

  /**
   * Legacy batch tick: fills a 32-frame client buffer and posts it to
   * /api/predict/stream.
   *
   * Kept because it is the only path that works if the page is served against a
   * backend without /api/stream/frame, and because it is a useful reference for
   * what the server-side windowing replaced. All recognition policy now lives in
   * commitFromStream, so the two ticks cannot disagree about when a sign counts.
   */
  const doAutoDetectTick = async () => {
    if (
      isProcessingRef.current ||
      !isTemporal
    ) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      !video.videoWidth
    ) {
      return;
    }

    const nFrames =
      contract.frames || 32;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const blob =
      await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.7
          )
      );

    if (!blob) return;

    const buf =
      frameBufferRef.current;

    buf.push(blob);

    while (buf.length > nFrames) {
      buf.shift();
    }

    if (buf.length < nFrames) {
      setPrediction(null);
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const fd = new FormData();

      buf.forEach((frame, i) => {
        fd.append(
          "files",
          frame,
          `f${i}.jpg`
        );
      });

      const res =
        await axios.post<StreamResult>(
          `${API_BASE}/api/predict/stream`,
          fd,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
            timeout: 15000,
          }
        );

      commitFromStream(res.data);
    } catch (err) {
      // Keep camera and buffer alive.
      console.warn(
        "recognition tick failed:",
        err
      );
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  /**
   * Everything that happens once the server has recognised a window.
   *
   * Shared by the single-frame streaming tick and the legacy batch tick, so the
   * commit policy exists in exactly one place: confidence and margin must clear
   * the panel's thresholds, the same label must repeat ``stable_windows`` times,
   * and a repeat inside the cooldown is reported rather than swallowed.
   *
   * The window's NMM / affect belongs to the SIGN being recognised, not to the
   * previous one, so it is read here -- from the payload that carried the
   * prediction -- and not from whatever the last frame happened to report.
   */
  const commitFromStream = (data: StreamResult) => {
    const label = data.label;
    const incomingEmotion = data.emotion ?? data.nmm?.emotion ?? null;
    if (incomingEmotion) setEmotion(incomingEmotion);

    const markIdle = () => {
      candidateRef.current = null;
      if (!lastAppendRef.current.label) return;

      const now = Date.now();
      idleSinceRef.current ??= now;
      if (
        now - idleSinceRef.current >=
        thresholdsRef.current.repeat_cooldown_ms
      ) {
        lastAppendRef.current = { label: "", at: 0 };
        idleSinceRef.current = null;
        setRepeatBlocked(false);
      }
    };

    if (!data.ready || !label) {
      setLive(null);
      const detail = data.detail?.toLowerCase() ?? "";
      if (detail === "idle" || detail.includes("no hands")) {
        markIdle();
      } else if (detail !== "throttled" && detail !== "filling") {
        candidateRef.current = null;
      }
      return;
    }

    const confidence = data.confidence ?? 0;
    const margin = data.margin ?? 0;
    const top3 = data.top3 ?? [];

    const nn = data.nmm ?? {
      question: false,
      wh_question: false,
      negation: false,
      affirmation: false,
      emphasis: false,
    };

    const emo = (incomingEmotion ?? null) as EmotionResult | null;

    setPrediction({
      detected: true,
      label,
      confidence,
      top5: top3.map((t) => ({ label: t.label, confidence: t.confidence })),
      hands_detected: 1,
      nmm: nn,
      emotion: emo,
      metrics: (data.nmm?.metrics ?? null) as NmmMetrics | null,
    });

    const T = thresholdsRef.current;
    const decisive = confidence >= T.min_confidence && margin >= T.min_margin;
    // The background class is an answer, not a sign: showing it in the live
    // readout is useful, committing it to the gloss sequence is not. Without
    // this guard an idle signer accumulates [NONE] chips every cooldown.
    const isBackground = label === "NONE" || label === "BACKGROUND";
    setLive(isBackground ? null : { label, confidence, margin });

    if (isBackground) {
      markIdle();
      return;
    }

    idleSinceRef.current = null;

    if (!decisive) {
      candidateRef.current = null;
      return;
    }

    const cand = candidateRef.current;
    const count = cand && cand.label === label ? cand.count + 1 : 1;

    candidateRef.current = { label, count };

    if (count < Math.max(1, Math.round(T.stable_windows))) return;

    const now = Date.now();
    const last = lastAppendRef.current;

    if (last.label === label) {
      setRepeatBlocked(true);
      candidateRef.current = null;
      return;
    }

    candidateRef.current = null;
    setRepeatBlocked(false);

    // "Clear" is the one thing that resets the server's window: the model would
    // otherwise keep reading the previous signer state after the user wiped the
    // sequence and started over.
    if (autoDetect) {
      lastAppendRef.current = { label, at: now };
      appendGloss(label, { gloss: label, ...nn });
    }
  };

  /**
   * One JPEG in, one buffered landmark out.
   *
   * This replaces the old tick that pushed a JPEG into a client-side ring buffer
   * and uploaded all 32 of them every time. The browser never holds the window
   * now: it sends the newest frame and the server appends it to that session's
   * history and runs the model on its own schedule. Upload cost per tick drops
   * by the window length, and latency stops depending on how fast the client can
   * serialise 32 blobs.
   */
  const doStreamTick = async () => {
    if (isProcessingRef.current || !isTemporal) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", 0.7)
    );

    if (!blob) return;

    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const fd = new FormData();

      fd.append("file", blob, "f.jpg");

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

      if (!res.data.ready || !res.data.label) {
        setLive(null);
        if (res.data.emotion || res.data.nmm?.emotion) {
          commitFromStream(res.data);
        } else if (
          res.data.detail?.toLowerCase() === "idle" ||
          res.data.detail?.toLowerCase().includes("no hands")
        ) {
          commitFromStream(res.data);
        }
        return;
      }

      commitFromStream(res.data);
    } catch (err) {
      // A backend without /api/stream/frame 404s on every tick, which is not a
      // transient network blip -- falling back is the only way the page can work
      // against it. Any other failure keeps the single-frame path, because a
      // dropped frame is exactly what server-side buffering is designed to
      // absorb.
      const status = (err as { response?: { status?: number } })?.response?.status;

      if (status === 404 || status === 405) {
        streamFallbackRef.current = true;
        setStreamUnavailable(true);
        return;
      }
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  const anyQuestion = detectedHistory.some(
    (h) => h.question || h.wh_question
  );

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
              {cameraActive
                ? isTemporal
                  ? streamUnavailable
                    ? "BATCH MODE"
                    : `${buffered}/${contract.frames * 6} BUFFER`
                  : "POLLING 1S"
                : "STANDBY"}
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
            handsDetected={prediction?.hands_detected ?? (live ? 1 : 0)}
            hasFace={Boolean(prediction?.nmm?.metrics || prediction?.detected)}
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
                className="px-2.5 py-1 rounded-lg bg-status-error/15 border border-status-error/40 text-status-error text-[10px] font-mono font-bold hover:bg-status-error/25 transition-colors"
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

            <div className="flex items-center gap-2">
              {isTemporal && (
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

              <NmmThresholdPanel
                values={thresholds}
                onChange={setThresholds}
                gates={markerGates}
                onGatesChange={setMarkerGates}
                variant="header"
              />
            </div>
          </div>

          {/* Recognition Result Card */}
          <div className="rounded-xl bg-background/50 p-3 flex flex-col gap-2.5 min-w-0">
            {live && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-[9px] font-mono">
                <span className="uppercase text-text-muted">
                  {repeatBlocked ? "WAIT FOR RELEASE" : "HOLDING"}
                </span>
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

          {/* Facial Expression & Non-Manual Markers (NMM) Badge Group */}
          <div className="bg-background/50 rounded-xl p-3 flex flex-col gap-2">
            <div className="text-[9px] font-mono uppercase tracking-wider text-text-muted">
              Non-Manual Markers
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "wh_question", label: "WH-Question", active: nmm.wh_question },
                { key: "question", label: "Question", active: nmm.question },
                { key: "negation", label: "Negation", active: nmm.negation },
                { key: "affirmation", label: "Affirmation", active: nmm.affirmation },
                { key: "emphasis", label: "Emphasis", active: nmm.emphasis },
              ].map((m) => (
                <span
                  key={m.key}
                  className={`px-2 py-1 rounded-md border text-[9px] font-mono font-bold transition-all ${
                    m.active
                      ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary shadow-sm"
                      : "bg-surface-elevated border-border text-text-muted opacity-60"
                  }`}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline Specifications Info Box */}
          <div className="bg-background/50 rounded-xl p-2.5 flex flex-col gap-0.5 text-[9px] font-mono text-text-muted">
            <div className="flex justify-between">
              <span>Pipeline:</span>
              <span className="text-text-secondary font-medium">
                {isTemporal ? `${contract.frames}-frame temporal sequence` : "Static frame recognition"}
              </span>
            </div>
            {contract.feature_kind === "hands_pose" && (
              <div className="flex justify-between">
                <span>Features:</span>
                <span className="text-text-secondary font-medium">hands + body pose (258-dim)</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Affect Input:</span>
              <span className="text-accent-secondary font-medium">{emotion?.dominant ?? "—"}</span>
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
                        setBengaliOutput("");
                      }}
                      title="Click to remove signs from here"
                      className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-bold hover:brightness-110 transition-all ${
                        s.negation
                          ? "border-status-error/60 bg-status-error/10 text-status-error"
                          : idx === detectedHistory.length - 1 && anyQuestion
                          ? "border-status-pending/60 bg-status-pending/10 text-status-pending"
                          : "border-border bg-surface-elevated text-accent-primary"
                      }`}
                    >
                      {s.gloss}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Vocabulary Picker (for temporal testing) */}
            {isTemporal && (
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
            )}

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
  Check,
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
  const [useLlm, setUseLlm] = useState(true);

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
        <section className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/50 p-4 sm:p-5 backdrop-blur-sm gap-3.5 h-full">
          {/* Top row: Label + STT Engine Selector + VAD Mode + Language Switcher + Clear */}
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

                {/* Silero VAD Indicator & Configuration (for local capture) */}
                {sttEngine === "local" && (
                  <div
                    className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface/80 border border-border/80"
                    role="group"
                    aria-label="VAD Configuration"
                  >
                    <button
                      type="button"
                      onClick={() => setShowVadSettings((v) => !v)}
                      aria-label="VAD Configuration"
                      className={`p-1 rounded text-text-muted hover:text-text-primary transition-colors ${
                        showVadSettings ? "bg-surface-elevated text-accent-secondary" : ""
                      }`}
                      title="Configure Silero VAD thresholds & padding"
                    >
                      <Sliders size={11} />
                    </button>
                  </div>
                )}
              </div>
              <br/>
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div
                  className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface/80 border border-border/80 shrink-0"
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
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                        sttLanguage === opt.key
                          ? "bg-accent-secondary text-white shadow-sm"
                          : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText("");
                      setResult(null);
                    }}
                    className="text-[10px] font-mono text-text-muted hover:text-text-primary transition-colors ml-1"
                  >
                    Clear
                  </button>
                )}
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

            {/* Expandable VAD Settings Panel */}
            {showVadSettings && sttEngine === "local" && (
              <div className="p-3 rounded-xl bg-surface border border-border/80 flex flex-col gap-2.5 text-xs font-mono">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-text-secondary">
                      <span>Silence Threshold:</span>
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
                      <span>Min Silence (ms):</span>
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
                      <span>Speech Padding (ms):</span>
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
                      <span>Max Segment (s):</span>
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
          <div className="relative w-full flex-1 min-h-[340px] lg:min-h-[420px] rounded-xl bg-background/50 border border-border/80 focus-within:ring-1 focus-within:ring-accent-secondary/50 focus-within:border-accent-secondary/60 transition-all flex flex-col overflow-hidden">
            <div className="relative flex-1 w-full h-full min-h-[280px]">
              {/* Highlight backdrop overlay (mirrors textarea font, padding, word wrap) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 p-4 font-bengali text-base whitespace-pre-wrap break-words overflow-hidden select-none leading-relaxed text-transparent"
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
                className="relative z-10 w-full h-full p-4 bg-transparent text-text-primary font-bengali text-base placeholder:text-text-muted/50 focus:outline-none resize-none leading-relaxed"
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
            className={`w-full rounded-xl border p-2.5 sm:p-3 flex flex-col gap-2 transition-all ${
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  disabled={voiceStatus === "finalizing"}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  title={
                    voiceStatus === "finalizing"
                      ? "Finalizing transcription..."
                      : isRecording
                      ? "Stop recording"
                      : "Record voice (continuous stream)"
                  }
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isRecording
                      ? "bg-status-error text-white shadow-md animate-pulse"
                      : voiceStatus === "finalizing"
                      ? "bg-accent-secondary text-white shadow-sm"
                      : "bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30"
                  }`}
                >
                  {voiceStatus === "finalizing" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isRecording ? (
                    <Square size={13} fill="currentColor" />
                  ) : (
                    <Mic size={16} />
                  )}
                </button>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs font-mono font-bold tracking-wider leading-tight flex items-center gap-2 ${
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
                    {isRecording && "LISTENING"}
                    {voiceStatus === "finalizing" && (
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={12} className="animate-spin" />
                        FINALIZING TRANSCRIPTION
                      </span>
                    )}
                    {voiceStatus === "complete" && (
                      <span className="flex items-center gap-1 text-status-success">
                        <Check size={12} />
                        TRANSCRIPTION COMPLETE
                      </span>
                    )}
                    {voiceStatus === "warning" && (
                      <span className="flex items-center gap-1 text-status-warning">
                        <AlertTriangle size={12} />
                        PARTIAL SPEECH NOT DETECTED
                      </span>
                    )}
                    {voiceStatus === "idle" && "VOICE"}
                    {isRecording && inFlightCount > 0 && (
                      <span className="flex items-center gap-1 text-[9px] font-normal text-accent-secondary">
                        <Loader2 size={10} className="animate-spin" />
                        transcribing split...
                      </span>
                    )}
                  </span>
                  <span className="text-[8px] font-mono text-text-muted leading-tight mt-0.5">
                    {isRecording
                      ? sttEngine === "elevenlabs"
                        ? `Next slice in ${sliceRemainingSec.toFixed(1)}s`
                        : `Segmenting every ${recordingDuration}s`
                      : voiceStatus === "finalizing"
                      ? "Transcribing remaining audio..."
                      : sttEngine === "elevenlabs"
                      ? "ElevenLabs Scribe"
                      : "Silero VAD"}
                  </span>
                </div>
              </div>

              {/* VAD Status Indicator */}
              <div className="flex items-center gap-1.5 shrink-0 bg-surface rounded-lg p-0.5 border border-border">
                <span className="font-mono text-[10px] text-accent-secondary px-2 py-1 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                  Silero VAD
                </span>
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
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "Dataset Explorer", href: "/admin/dataset", icon: Database },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Model Simulation", href: "/admin/videos", icon: Activity },
  { label: "System Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-border flex items-center justify-between">
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

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <div className="p-4 border-t border-border text-[11px] font-mono text-text-muted">
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
  Heart,
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
  "/contribute": Heart,
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
            Bridging Deaf communication through landmark-based computer vision, NMM parsing, and native Bengali NLG.
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
            <li><Link href="/contribute" className="hover:text-text-primary transition-colors">Signer Contribution</Link></li>
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

# FILE: `frontend\src\components\pipeline\PipelineStatus.tsx`

```tsx
"use client";
import React from "react";
import { CircleCheck, Clock3, CircleX, PauseCircle, HelpCircle } from "lucide-react";
import { PipelineStage, PipelineStatus as StatusType } from "@/lib/types";
import { PIPELINE_STAGES } from "@/lib/constants";

interface PipelineStatusProps {
  stages: Record<PipelineStage, StatusType>;
  fps?: number;
}

export function PipelineStatus({ stages, fps = 0 }: PipelineStatusProps) {
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "active":
        return {
          icon: <CircleCheck size={14} className="text-status-approved" />,
          label: "ACTIVE",
          color: "text-status-approved",
        };
      case "waiting":
        return {
          icon: <Clock3 size={14} className="text-status-pending" />,
          label: "WAITING",
          color: "text-status-pending",
        };
      case "error":
        return {
          icon: <CircleX size={14} className="text-status-error" />,
          label: "ERROR",
          color: "text-status-error",
        };
      case "idle":
      default:
        return {
          icon: <PauseCircle size={14} className="text-text-muted" />,
          label: "IDLE",
          color: "text-text-muted",
        };
    }
  };

  return (
    <div className="w-full bg-surface border border-border p-4 rounded-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50 text-xs font-mono">
        <span className="text-text-secondary uppercase tracking-wider">
          LIVE AI PIPELINE FLOW
        </span>
        <span className="text-accent-primary">
          STREAM RATE: <strong className="text-text-primary">{fps} FPS</strong>
        </span>
      </div>

      {/* Connected Technical Diagram per Section 8.4 */}
      <div className="relative flex items-center justify-between">
        {/* Horizontal Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-border -translate-y-1/2 z-0" />

        {PIPELINE_STAGES.map((stage) => {
          const status = stages[stage.id as PipelineStage] || "idle";
          const badge = getStatusBadge(status);

          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center bg-surface px-3 py-1"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  status === "active"
                    ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                    : status === "waiting"
                    ? "border-status-pending bg-status-pending/10"
                    : "border-border bg-surface-elevated"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === "active"
                      ? "bg-accent-primary"
                      : status === "waiting"
                      ? "bg-status-pending"
                      : "bg-text-muted"
                  }`}
                />
              </div>

              <div className="mt-2 text-xs font-mono font-semibold text-text-primary">
                {stage.label}
              </div>

              <div className={`flex items-center space-x-1 mt-1 text-[11px] font-mono ${badge.color}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\recording\PrivacyGate.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { ShieldCheck, Info } from "lucide-react";

interface PrivacyGateProps {
  onConsent: (signerId: string, recordVideo: boolean) => void;
}

export function PrivacyGate({ onConsent }: PrivacyGateProps) {
  const [signerId, setSignerId] = useState("");
  const [recordVideo, setRecordVideo] = useState(false);
  const [checks, setChecks] = useState({
    consentRecord: false,
    consentUse: false,
    understandDeletion: false,
    declareOwnership: false,
  });

  const allChecked =
    checks.consentRecord &&
    checks.consentUse &&
    checks.understandDeletion &&
    checks.declareOwnership &&
    signerId.trim().length >= 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allChecked) {
      onConsent(signerId.trim(), recordVideo);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface border border-border p-6 sm:p-8 rounded-lg">
      <div className="flex items-center space-x-3 pb-4 border-b border-border">
        <ShieldCheck className="text-accent-primary" size={24} />
        <div>
          <h2 className="text-lg font-semibold text-text-primary tracking-tight">
            Signer Consent & Data Privacy Gate
          </h2>
          <div className="text-xs font-mono text-text-muted">
            COMPLIANCE: Digital Personal Data Protection (DPDP) Act 2023
          </div>
        </div>
      </div>

      <div className="my-5 p-4 rounded bg-surface-elevated border border-border/80 text-xs text-text-secondary leading-relaxed space-y-2">
        <div className="flex items-center space-x-2 text-text-primary font-medium">
          <Info size={14} className="text-accent-secondary" />
          <span>How WBSL Bridge processes your gesture data</span>
        </div>
        <p>
          By default, WBSL Bridge records <strong>coordinate landmarks only</strong> (21 hand joints, 33 body pose points, and facial mesh contours). No raw facial recordings are stored on public research servers unless you explicitly opt in below.
        </p>
        <p>
          You hold the perpetual right under DPDP guidelines to request deletion of any contributed sample associated with your unique Signer ID.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
            Signer ID / Pseudonym *
          </label>
          <input
            type="text"
            required
            value={signerId}
            onChange={(e) => setSignerId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
            placeholder="e.g. signer_kolkata_04"
            className="w-full px-3 py-2 bg-background border border-border rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
          />
          <div className="text-[11px] text-text-muted mt-1 font-mono">
            Alphanumeric identifier to retain deletion authority.
          </div>
        </div>

        {/* 4 Mandatory Checkboxes per Section 8.3 */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.consentRecord}
              onChange={(e) => setChecks({ ...checks, consentRecord: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I consent to recording my gestures using computer vision landmark tracking.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.consentUse}
              onChange={(e) => setChecks({ ...checks, consentUse: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I consent to using anonymized landmark coordinate vectors for training the WBSL AI model.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.understandDeletion}
              onChange={(e) => setChecks({ ...checks, understandDeletion: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I understand I can request sample deletion at any time using my Signer ID.</span>
          </label>

          <label className="flex items-start space-x-3 text-xs text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={checks.declareOwnership}
              onChange={(e) => setChecks({ ...checks, declareOwnership: e.target.checked })}
              className="mt-0.5 accent-accent-primary"
            />
            <span>I declare that I am demonstrating authentic West Bengal Sign Language (WBSL) gestures.</span>
          </label>
        </div>

        {/* Radio Option: Landmarks vs Video per Section 8.3 */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
            Data Storage Preference
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded border flex items-start space-x-2.5 cursor-pointer text-xs ${
                !recordVideo
                  ? "bg-accent-primary/10 border-accent-primary text-text-primary"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              <input
                type="radio"
                name="storageMode"
                checked={!recordVideo}
                onChange={() => setRecordVideo(false)}
                className="mt-0.5 accent-accent-primary"
              />
              <div>
                <strong className="block font-semibold">Landmarks Only</strong>
                <span className="text-[11px] text-text-muted">Recommended for privacy. Only coordinate data is transmitted.</span>
              </div>
            </label>

            <label
              className={`p-3 rounded border flex items-start space-x-2.5 cursor-pointer text-xs ${
                recordVideo
                  ? "bg-accent-secondary/10 border-accent-secondary text-text-primary"
                  : "bg-surface border-border text-text-secondary"
              }`}
            >
              <input
                type="radio"
                name="storageMode"
                checked={recordVideo}
                onChange={() => setRecordVideo(true)}
                className="mt-0.5 accent-accent-secondary"
              />
              <div>
                <strong className="block font-semibold">Save Video Also</strong>
                <span className="text-[11px] text-text-muted">Assists human researchers in verifying ambiguous handshapes.</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!allChecked}
          className={`w-full py-2.5 px-4 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
            allChecked
              ? "bg-accent-primary text-black hover:bg-accent-primary/90"
              : "bg-surface-elevated text-text-muted cursor-not-allowed border border-border"
          }`}
        >
          Authorize Session & Begin Recording
        </button>
      </form>
    </div>
  );
}
```

---

# FILE: `frontend\src\components\recording\UploadRecovery.tsx`

```tsx
"use client";
import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface UploadRecoveryProps {
  onRetry: () => void;
  pendingCount?: number;
}

export function UploadRecovery({ onRetry, pendingCount = 1 }: UploadRecoveryProps) {
  return (
    <div className="bg-surface border border-status-error/40 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded bg-status-error/10 text-status-error">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-status-error uppercase tracking-wider">
            UPLOAD INTERRUPTED
          </div>
          <div className="text-xs text-text-secondary mt-0.5">
            Your recording ({pendingCount} pending sample) is safely cached in browser memory. Network connection failed.
          </div>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center space-x-1.5 px-4 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono uppercase text-text-primary transition-colors shrink-0"
      >
        <RotateCw size={14} className="text-accent-primary" />
        <span>Retry Upload</span>
      </button>
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

# FILE: `frontend\src\components\sign\NmmThresholdPanel.tsx`

```tsx
"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sliders, RotateCcw, X } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8200";

/**
 * The NMM thresholds are all "how much of this expression counts as that marker".
 * They are exposed because the correct value is genuinely user- and
 * camera-dependent: a raised eyebrow in a dim room with a low-res webcam
 * produces a very different landmark ratio than the same eyebrow on a well-lit
 * 1080p feed. One hardcoded constant cannot serve both, and the failure mode of
 * getting it wrong is loud -- every casual expression registers as a question
 * marker, and the gloss string fills with [negation] and [?].
 *
 * Each slider maps to a key in backend/nmm.py DEFAULT_CONFIG and is pushed live
 * to the server, so the effect is visible on the very next detection tick.
 */

export interface NmmThresholds {
  brow_raise_thresh: number;
  brow_furrow_thresh: number;
  mouth_thresh: number;
  head_shake_var_thresh: number;
  head_nod_var_thresh: number;
  emotion_min_confidence: number;
}

/**
 * Master on/off switches for the five non-manual markers.
 *
 * These are NOT thresholds. A slider decides how much of an expression counts as
 * a marker; a gate decides whether the marker exists at all. Turning the question
 * slider down still leaves it able to fire on a big enough brow raise, and it
 * loses the value the operator had tuned. A gate is the honest off switch.
 */
export interface MarkerGates {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
}

/** The gate keys, in the order the panel lists them. */
export const MARKER_GATE_KEYS: (keyof MarkerGates)[] = [
  "question",
  "wh_question",
  "negation",
  "affirmation",
  "emphasis",
];

/**
 * Negation and the two question markers ship OFF.
 *
 * A head shake and a brow raise are things every speaker does while thinking or
 * mid-sentence, so leaving them armed fills the gloss string with [negation] and
 * [?] the signer never intended. Affirmation and emphasis are cheap to re-enable
 * and are on by default. These must match DEFAULT_MARKER_GATES in backend/nmm.py.
 */
export const DEFAULT_MARKER_GATES: MarkerGates = {
  question: false,
  wh_question: false,
  negation: false,
  affirmation: true,
  emphasis: true,
};

/**
 * Client-side acceptance thresholds. Unlike NMM these never reach the server:
 * the decision to accept a window and append a gloss is made in the page, from
 * the confidence and margin the stream endpoint already returns. They are
 * persisted to localStorage so an operator's tuning survives a reload.
 */
export interface CommitThresholds {
  min_confidence: number;
  min_margin: number;
  stable_windows: number;
  repeat_cooldown_ms: number;
}

/** Every slider the panel exposes: the 6 server-side NMM values + 4 client-side. */
export type AllThresholds = NmmThresholds & CommitThresholds;

/** The full panel state: sensitivity sliders plus the marker on/off gates. */
export interface PanelState {
  thresholds: AllThresholds;
  gates: MarkerGates;
}

/** localStorage key for the marker gates. */
export const GATE_STORAGE_KEY = "wbsl.markerGates.v1";

export const DEFAULT_THRESHOLDS: NmmThresholds = {
  brow_raise_thresh: 0.082,
  brow_furrow_thresh: 0.032,
  mouth_thresh: 0.055,
  head_shake_var_thresh: 0.0018,
  head_nod_var_thresh: 0.0018,
  emotion_min_confidence: 0.35,
};

export const DEFAULT_COMMIT_THRESHOLDS: CommitThresholds = {
  min_confidence: 0.55,
  min_margin: 0.25,
  stable_windows: 2,
  repeat_cooldown_ms: 1500,
};

export const DEFAULT_ALL: AllThresholds = {
  ...DEFAULT_THRESHOLDS,
  ...DEFAULT_COMMIT_THRESHOLDS,
};

/** localStorage key. Versioned so a future shape change cannot resurrect stale values. */
export const COMMIT_STORAGE_KEY = "wbsl.commitThresholds.v1";

interface SliderSpec {
  key: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  /** Rendered as a percentage multiplier rather than a raw ratio. */
  asPercent?: boolean;
  /** Rendered as a whole number with a unit suffix. */
  unit?: string;
  group: "commit" | "nmm" | "affect";
}

const SLIDERS: SliderSpec[] = [
  {
    key: "min_confidence",
    label: "Sign confidence floor",
    hint: "A recognised sign below this is ignored. Raise it if wrong signs appear.",
    min: 0.2,
    max: 0.95,
    step: 0.05,
    asPercent: true,
    group: "commit",
  },
  {
    key: "min_margin",
    label: "Decisiveness margin",
    hint: "How far the winning sign must beat the runner-up. This is the single most effective guard against confident-looking nonsense — raise it when similar signs get confused.",
    min: 0.0,
    max: 0.9,
    step: 0.05,
    asPercent: true,
    group: "commit",
  },
  {
    key: "stable_windows",
    label: "Agreeing windows before commit",
    hint: "How many consecutive windows must agree before a sign is added. 1 is fastest but jumps the gun; 3 is very strict.",
    min: 1,
    max: 6,
    step: 1,
    unit: "windows",
    group: "commit",
  },
  {
    key: "repeat_cooldown_ms",
    label: "Release before repeating",
    hint: "How long the camera must detect an idle/release state before the same sign can be added again.",
    min: 300,
    max: 5000,
    step: 100,
    unit: "ms",
    group: "commit",
  },
  {
    key: "brow_raise_thresh",
    label: "Brow raise → question [?]",
    hint: "How far the brows must lift above the eyes. Lower = easier to trigger.",
    min: 0.02,
    max: 0.18,
    step: 0.002,
    group: "nmm",
  },
  {
    key: "brow_furrow_thresh",
    label: "Brow furrow → wh-question",
    hint: "How close the brows must sit to the eyes to count as a furrow.",
    min: 0.01,
    max: 0.08,
    step: 0.001,
    group: "nmm",
  },
  {
    key: "mouth_thresh",
    label: "Mouth open → emphasis",
    hint: "Lip separation that counts as emphasis. Raise it to ignore casual speech.",
    min: 0.01,
    max: 0.14,
    step: 0.002,
    group: "nmm",
  },
  {
    key: "head_shake_var_thresh",
    label: "Head shake → negation",
    hint: "Lateral nose movement needed. Raise it to require a deliberate shake.",
    min: 0.0002,
    max: 0.008,
    step: 0.0001,
    group: "nmm",
  },
  {
    key: "head_nod_var_thresh",
    label: "Head nod → affirmation",
    hint: "Vertical nose movement needed. Raise it to require a deliberate nod.",
    min: 0.0002,
    max: 0.008,
    step: 0.0001,
    group: "nmm",
  },
  {
    key: "emotion_min_confidence",
    label: "Emotion confidence floor",
    hint: "Below this, affect falls back to neutral instead of guessing.",
    min: 0.1,
    max: 0.9,
    step: 0.05,
    asPercent: true,
    group: "affect",
  },
];

const GROUP_META: Record<string, { title: string; blurb: string }> = {
  commit: {
    title: "Recognition acceptance",
    blurb:
      "Decides whether a recognised sign is actually added to the sequence. Tighten these when the sequence accumulates wrong signs.",
  },
  nmm: {
    title: "Non-manual markers",
    blurb:
      "How much of each facial or head expression counts as a marker. Loosen a value if a deliberate expression never registers.",
  },
  affect: {
    title: "Affect",
    blurb: "How confident the emotion classifier must be before it reports a non-neutral emotion.",
  },
};

interface Props {
  values: AllThresholds;
  onChange: (next: AllThresholds) => void;
  /** Marker on/off gates. */
  gates: MarkerGates;
  onGatesChange: (next: MarkerGates) => void;
  /** Open the modal on mount. Defaults to closed. */
  defaultOpen?: boolean;
  /** Renders the trigger button inline instead of in the control bar. */
  variant?: "inline" | "header";
}

/** One-line description of each gate, shown next to its switch. */
const GATE_META: Record<keyof MarkerGates, { label: string; desc: string }> = {
  question: {
    label: "Question (yes/no)",
    desc: "Eyebrow raise. Adds [?] to the clause.",
  },
  wh_question: {
    label: "WH-question",
    desc: "Brow furrow. Frames what / why / how.",
  },
  negation: {
    label: "Negation",
    desc: "Head shake. Adds [negation] to the sign.",
  },
  affirmation: {
    label: "Affirmation",
    desc: "Head nod. Confirms the clause.",
  },
  emphasis: {
    label: "Emphasis",
    desc: "Mouth open. Stresses the clause.",
  },
};

export function NmmThresholdPanel({
  values,
  onChange,
  gates,
  onGatesChange,
  defaultOpen = false,
  variant = "inline",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  // Portals cannot run during SSR/prerender -- there is no document to portal
  // into -- so the overlay is only rendered after the first client mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Escape closes, and the page behind must not scroll while an overlay is up.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const update = (key: string, raw: number) => {
    const next = { ...values, [key]: raw } as AllThresholds;
    onChange(next);
    // Server-side NMM values are pushed so detection reflects them on the next
    // tick. The commit values are client-only, so they are written to
    // localStorage instead. Sending the commit keys to the NMM endpoint would be
    // silently ignored, which is worse than not sending them -- it would look
    // like the tuning took effect when nothing changed.
    const { min_confidence, min_margin, stable_windows, repeat_cooldown_ms } = next;
    axios
      .post(`${API_BASE}/api/nmm/config`, {
        brow_raise_thresh: next.brow_raise_thresh,
        brow_furrow_thresh: next.brow_furrow_thresh,
        mouth_thresh: next.mouth_thresh,
        head_shake_var_thresh: next.head_shake_var_thresh,
        head_nod_var_thresh: next.head_nod_var_thresh,
        emotion_min_confidence: next.emotion_min_confidence,
      })
      .catch(() => {});
    try {
      localStorage.setItem(
        COMMIT_STORAGE_KEY,
        JSON.stringify({ min_confidence, min_margin, stable_windows, repeat_cooldown_ms })
      );
    } catch {
      /* private mode / storage disabled -- tuning still applies for this session */
    }
  };

  const setGate = (key: keyof MarkerGates, enabled: boolean) => {
    const next = { ...gates, [key]: enabled };
    onGatesChange(next);
    // The gates live on the server, so they are pushed the same way thresholds
    // are. The local mirror is written too: without it a reload would show the
    // defaults while the server kept the operator's choice.
    axios
      .post(`${API_BASE}/api/nmm/config`, { marker_gates: { [key]: enabled } })
      .catch(() => {});
    try {
      localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    onChange(DEFAULT_ALL);
    onGatesChange(DEFAULT_MARKER_GATES);
    axios
      .post(`${API_BASE}/api/nmm/config`, {
        ...DEFAULT_THRESHOLDS,
        marker_gates: DEFAULT_MARKER_GATES,
      })
      .catch(() => {});
    try {
      localStorage.setItem(COMMIT_STORAGE_KEY, JSON.stringify(DEFAULT_COMMIT_THRESHOLDS));
      localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(DEFAULT_MARKER_GATES));
    } catch {
      /* ignore */
    }
  };

  const grouped = (group: SliderSpec["group"]) => SLIDERS.filter((s) => s.group === group);

  /**
   * How far the live values have drifted from the calibrated defaults.
   * Surfacing this on the trigger matters because the modal is invisible when
   * shut: without a count, an operator who tuned something last week has no way
   * to know the detector is still running on those values.
   *
   * A switched-off marker counts as a change, because it is the one setting that
   * silently deletes output the operator may later expect to see.
   */
  const changedCount =
    SLIDERS.filter(
      (s) =>
        (values as unknown as Record<string, number>)[s.key] !==
        (DEFAULT_ALL as unknown as Record<string, number>)[s.key]
    ).length +
    MARKER_GATE_KEYS.filter((k) => gates[k] !== DEFAULT_MARKER_GATES[k]).length;

  const disabledCount = MARKER_GATE_KEYS.filter((k) => !gates[k]).length;

  const trigger =
    variant === "header" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="NMM Controller"
        className="relative p-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-accent-secondary hover:border-accent-secondary/50 transition-colors"
      >
        <Sliders size={13} />

        {changedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-accent-secondary text-black text-[8px] font-bold flex items-center justify-center">
            {changedCount}
          </span>
        )}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/80 bg-surface/60 hover:bg-surface-elevated/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-text-secondary">
          <Sliders size={13} className="text-accent-secondary" />
          NMM Controller
        </span>

        <span className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          {/* Markers that are switched off are the most important thing to see
              from outside the modal, so they are named rather than folded into
              the tuned count. */}
          {disabledCount > 0 ? (
            <span className="text-status-pending">{disabledCount} off</span>
          ) : changedCount > 0 ? (
            <span className="text-accent-secondary">{changedCount} tuned</span>
          ) : (
            <span>defaults</span>
          )}
          <span>·</span>
          <span>{SLIDERS.length} controls</span>
        </span>
      </button>
    );

  if (!open) return <>{trigger}</>;

  const overlay = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="NMM Controller"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
      >
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border shrink-0">
            <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-text-secondary">
              <Sliders size={13} className="text-accent-secondary" />
              NMM Controller
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close NMM controller"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* BODY — scrolls independently so the header stays put */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
            <p className="text-[11px] text-text-muted leading-relaxed">
              Every control below is live — changes take effect immediately. Not sure what
              to change? Start with <strong className="text-text-secondary">Decisiveness margin</strong>{" "}
              and <strong className="text-text-secondary">Agreeing windows</strong>: they do the
              most to stop wrong signs without making detection sluggish.
            </p>

            {/* MARKER SWITCHES. First, because a switched-off marker explains
                far more about a wrong output than any slider value does: no
                amount of threshold tuning will produce a [negation] while the
                negation gate is closed. */}
            <div className="space-y-3">
              <div className="pb-1 border-b border-border/50">
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary">
                  Markers
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                  Which non-manual markers are allowed to reach the LLM at all. A marker
                  switched off is never reported, no matter how strongly it is performed —
                  this is different from the sliders below, which only set how much of an
                  expression is needed. Negation and questions are off by default because a
                  head shake or a brow raise happens constantly in ordinary signing.
                </p>
              </div>

              {MARKER_GATE_KEYS.map((key) => {
                const on = gates[key];
                const meta = GATE_META[key];
                const isDefault = on === DEFAULT_MARKER_GATES[key];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-text-secondary">
                        {meta.label}
                        {!isDefault && (
                          <span className="ml-1.5 text-[9px] text-accent-secondary">•</span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>

                    {/* A real switch, not a checkbox: the state has to read at a
                        glance from across a room while signing. */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={meta.label}
                      onClick={() => setGate(key, !on)}
                      className={`shrink-0 w-10 h-5 rounded-full border transition-colors relative ${
                        on
                          ? "bg-accent-primary/30 border-accent-primary/60"
                          : "bg-surface-elevated border-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                          on
                            ? "left-[22px] bg-accent-primary"
                            : "left-0.5 bg-text-muted"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {(["commit", "nmm", "affect"] as const).map((group) => (
              <div key={group} className="space-y-3">
                <div className="pb-1 border-b border-border/50">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary">
                    {GROUP_META[group].title}
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                    {GROUP_META[group].blurb}
                  </p>
                </div>

                {grouped(group).map((s) => {
                  const v = (values as unknown as Record<string, number>)[s.key] ?? 0;
                  const pct = ((v - s.min) / (s.max - s.min)) * 100;
                  const isDefault =
                    v === (DEFAULT_ALL as unknown as Record<string, number>)[s.key];
                  const display = s.asPercent
                    ? `${Math.round(v * 100)}%`
                    : s.unit === "windows"
                    ? `${Math.round(v)}`
                    : s.unit === "ms"
                    ? `${(v / 1000).toFixed(1)}s`
                    : v.toFixed(4);
                  return (
                    <div key={s.key} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-[11px] font-mono text-text-secondary">
                          {s.label}
                          {!isDefault && (
                            <span className="ml-1.5 text-[9px] text-accent-secondary">•</span>
                          )}
                        </label>
                        <span className="text-[11px] font-mono font-bold text-accent-primary tabular-nums shrink-0">
                          {display}
                          {s.unit === "windows" && (
                            <span className="text-text-muted font-normal"> win</span>
                          )}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={v}
                        onChange={(e) => update(s.key, parseFloat(e.target.value))}
                        aria-label={s.label}
                        className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[var(--accent-primary)]"
                        style={{
                          background: `linear-gradient(to right, var(--accent-primary) ${pct}%, rgba(255,255,255,0.12) ${pct}%)`,
                        }}
                      />
                      <p className="text-[10px] text-text-muted leading-relaxed">{s.hint}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-text-secondary hover:text-text-primary hover:border-accent-secondary transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset to calibrated defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-accent-primary text-black text-[11px] font-mono font-bold hover:bg-accent-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {trigger}

      {/* Portaled to <body>.
          This component is mounted deep inside the Recognition column, whose
          ancestors use overflow-hidden and own their own stacking contexts.
          Rendering the overlay inline meant `fixed inset-0` was clipped by
          those ancestors and z-[100] could not lift it above sibling columns,
          so the dialog appeared mid-page and cut off. A portal moves the node
          out of that subtree entirely, which is the only reliable way to escape
          a clipped ancestor for a full-viewport overlay. */}
      {mounted && createPortal(overlay, document.body)}
    </>
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
      if (pose[23 * 4 + 3] < THRESH || pose[24 * 4 + 3] < THRESH) continue;
      hipCenters.push({
        x: (pose[23 * 4] + pose[24 * 4]) / 2,
        y: (pose[23 * 4 + 1] + pose[24 * 4 + 1]) / 2,
        z: (pose[23 * 4 + 2] + pose[24 * 4 + 2]) / 2,
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
  face_mesh?: number[][][];
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
  faceMesh?: number[][][];
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
  const faceMesh: number[][][] = [];
  const segments: Segment[] = [];
  let allHavePose = true;
  let hasAnyFaceMesh = false;

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

    if (replay.face_mesh?.length === replay.frames.length) {
      faceMesh.push(...replay.face_mesh);
      hasAnyFaceMesh ||= replay.face_mesh.some((frame) => frame.length > 0);
    } else {
      faceMesh.push(...replay.frames.map(() => []));
    }
  }

  return {
    frames,
    pose: allHavePose ? poses : undefined,
    faceMesh: hasAnyFaceMesh ? faceMesh : undefined,
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
            {data ? `${data.segments.length} SIGNS` : `${normalizedGlosses.length} SIGNS`}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[10px] font-mono tabular-nums text-text-secondary">
            {data ? `${activeSegment + 1}/${data.segments.length}` : "—"}
          </span>
          <button
            type="button"
            onClick={onResetView}
            className="inline-flex items-center gap-1 rounded border border-border/80 bg-surface/80 px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-text-secondary transition-colors hover:border-border hover:text-text-primary"
            aria-label="Reset simulation view"
            title="Reset simulation view"
          >
            <RotateCcw size={11} />
            Reset view
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
              faceMesh={data.faceMesh}
              fps={15}
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
import type { SampleRef } from "./LandmarkSimulation";
import { DHUTI_DROP, THRESH } from "./simulationConstants";

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
    if (!(vis(23) && vis(24))) {
      group.visible = false;
      return;
    }
    group.visible = true;

    const hipY = (P[23 * 4 + 1] + P[24 * 4 + 1]) / 2;
    frame.cx = (P[23 * 4] + P[24 * 4]) / 2;
    frame.cz = (P[23 * 4 + 2] + P[24 * 4 + 2]) / 2;
    frame.hw = Math.max(Math.abs(P[24 * 4] - P[23 * 4]) / 2, 0.14) * 1.12;
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

# FILE: `frontend\src\components\simulation\LandmarkSimulation.tsx`

```tsx
"use client";
import "@/lib/threeSetup";
import React, {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { DhutiRig } from "./DhutiRig";
import { RoundAlpanaStage } from "./AlpanaStage";
import { DHUTI_DROP, THRESH, TORSO_WORLD } from "./simulationConstants";
import {
  POSE_BODY_PAIRS,
  POSE_FACE_MARKERS,
  POSE_FACE_PAIRS,
  POSE_POINTS,
  type PosePoint,
} from "@/lib/pose";

/* ==========================================================================
 * 1. EXISTING DATA / ALIGNMENT LOGIC (unchanged)
 * ========================================================================== */

const HAND_CONN: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10],
  [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18],
  [18, 19], [19, 20], [0, 17],
];

const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

type Point2 = { x: number; y: number };

const EMPTY_POSE: PosePoint[] = Array.from(
  { length: POSE_POINTS },
  () => [0, 0, 0, 0],
);

const BODY_GUIDE: PosePoint[] = EMPTY_POSE.map((point) => [...point] as PosePoint);
const setGuidePoint = (index: number, x: number, y: number) => {
  BODY_GUIDE[index] = [x, y, 0, 1];
};
setGuidePoint(0, 0, -2.2);
setGuidePoint(2, -0.2, -2.25);
setGuidePoint(5, 0.2, -2.25);
setGuidePoint(7, -0.4, -2.1);
setGuidePoint(8, 0.4, -2.1);
setGuidePoint(9, -0.18, -1.95);
setGuidePoint(10, 0.18, -1.95);
setGuidePoint(11, -0.7, -1.25);
setGuidePoint(12, 0.7, -1.25);
setGuidePoint(13, -1.1, -0.65);
setGuidePoint(14, 1.1, -0.65);
setGuidePoint(15, -1.35, 0);
setGuidePoint(16, 1.35, 0);
setGuidePoint(23, -0.45, 0.55);
setGuidePoint(24, 0.45, 0.55);
setGuidePoint(25, -0.48, 1.65);
setGuidePoint(26, 0.48, 1.65);
setGuidePoint(27, -0.5, 2.8);
setGuidePoint(28, 0.5, 2.8);

const GUIDE_BODY_PAIRS = POSE_BODY_PAIRS.filter(
  ([a, b]) => ![0, 2, 5, 7, 9, 10].includes(a) && ![0, 2, 5, 7, 9, 10].includes(b),
);
const POSE_SKELETON_PAIRS = POSE_BODY_PAIRS.filter(
  ([a, b]) => !(a <= 10 && b <= 10),
);

const POSE_DRAW_THRESHOLD = 0.01;

const isMissingHand = (frame: number[][], offset: number) =>
  frame
    .slice(offset, offset + 21)
    .every((point) => point[0] === 0 && point[1] === 0 && point[2] === 0);

function handAnchor(frame: number[][]): Point2 {
  return isMissingHand(frame, 21)
    ? { x: BODY_GUIDE[15][0], y: BODY_GUIDE[15][1] }
    : { x: BODY_GUIDE[16][0], y: BODY_GUIDE[16][1] };
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
    const shoulders = [frame[11], frame[12]];
    const hips = [frame[23], frame[24]];
    const visible = [...shoulders, ...hips].filter(
      (point) => point && point[3] >= POSE_DRAW_THRESHOLD && validPoint(point),
    );
    const centerPoints = visible.length ? visible : [frame[11], frame[12]].filter(Boolean);
    const center = centerPoints.reduce(
      (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
      { x: 0, y: 0 },
    );
    center.x /= centerPoints.length || 1;
    center.y /= centerPoints.length || 1;

    const shoulderCenter = {
      x: (frame[11]?.[0] + frame[12]?.[0]) / 2,
      y: (frame[11]?.[1] + frame[12]?.[1]) / 2,
    };
    const hipCenter = {
      x: (frame[23]?.[0] + frame[24]?.[0]) / 2,
      y: (frame[23]?.[1] + frame[24]?.[1]) / 2,
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

function averagePoints(points: number[][]): Point2 | null {
  const valid = points.filter(validPoint);
  if (valid.length === 0) return null;
  const total = valid.reduce(
    (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
    { x: 0, y: 0 },
  );
  return { x: total.x / valid.length, y: total.y / valid.length };
}

function sortedPair(points: Point2[]): Point2[] {
  return [...points].sort((a, b) => a.x - b.x);
}

function alignFaceMeshToPose(
  face: number[][],
  pose: PosePoint[],
): Point2[] {
  const sourceNose = face[4];
  const targetNose = pose[0];
  if (!validPoint(sourceNose) || !validPoint(targetNose)) return [];

  const faceEyes = [
    averagePoints([face[33], face[133]].filter(validPoint)),
    averagePoints([face[362], face[263]].filter(validPoint)),
  ].filter((point): point is Point2 => point !== null);
  const poseEyes = [
    averagePoints([pose[1], pose[2], pose[3]].filter(validPoint)),
    averagePoints([pose[4], pose[5], pose[6]].filter(validPoint)),
  ].filter((point): point is Point2 => point !== null);

  const anchors: [Point2, Point2][] = [[
    { x: sourceNose[0], y: sourceNose[1] },
    { x: targetNose[0], y: targetNose[1] },
  ]];
  const sourceEyes = sortedPair(faceEyes);
  const targetEyes = sortedPair(poseEyes);
  for (let index = 0; index < Math.min(sourceEyes.length, targetEyes.length); index++) {
    anchors.push([sourceEyes[index], targetEyes[index]]);
  }
  const sourceMouth = sortedPair(
    [face[61], face[291]].filter(validPoint).map(([x, y]) => ({ x, y })),
  );
  const targetMouth = sortedPair(
    [pose[9], pose[10]].filter(validPoint).map((point) => ({ x: point[0], y: point[1] })),
  );
  for (let index = 0; index < Math.min(sourceMouth.length, targetMouth.length); index++) {
    anchors.push([sourceMouth[index], targetMouth[index]]);
  }

  if (anchors.length < 2) return [];

  const sourceCenter = anchors.reduce(
    (sum, [source]) => ({ x: sum.x + source.x, y: sum.y + source.y }),
    { x: 0, y: 0 },
  );
  const targetCenter = anchors.reduce(
    (sum, [, target]) => ({ x: sum.x + target.x, y: sum.y + target.y }),
    { x: 0, y: 0 },
  );
  sourceCenter.x /= anchors.length;
  sourceCenter.y /= anchors.length;
  targetCenter.x /= anchors.length;
  targetCenter.y /= anchors.length;

  let denominator = 0;
  let coefficientA = 0;
  let coefficientB = 0;
  for (const [source, target] of anchors) {
    const x = source.x - sourceCenter.x;
    const y = source.y - sourceCenter.y;
    const targetX = target.x - targetCenter.x;
    const targetY = target.y - targetCenter.y;
    denominator += x * x + y * y;
    coefficientA += x * targetX + y * targetY;
    coefficientB += x * targetY - y * targetX;
  }
  if (denominator < 1e-8) return [];
  coefficientA /= denominator;
  coefficientB /= denominator;

  return face.map((point) => {
    if (!validPoint(point)) return { x: Number.NaN, y: Number.NaN };
    const [x, y] = point;
    const centeredX = x - sourceCenter.x;
    const centeredY = y - sourceCenter.y;
    return {
      x:
        targetCenter.x +
        coefficientA * centeredX -
        coefficientB * centeredY,
      y:
        targetCenter.y +
        coefficientB * centeredX +
        coefficientA * centeredY,
    };
  });
}

/* ==========================================================================
 * 2. 3D: CONSTANTS, TYPES, FACE TOPOLOGY
 * ========================================================================== */

type PairList = ReadonlyArray<readonly [number, number]>;

const Z_POSE = 0.15;
const Z_HAND = 0.5;
const Z_FACE = 0.5;
const Z_LIMIT = 0.4;
const SNAP_MAX_TORSOS = 1.0;
const FOV = 38;
const HEAD_LEN = 11;

/* Keep the dhuti knee-length and independent of leg landmarks so pose noise
 * cannot stretch or shorten the garment. */
const COLOR = {
  torso: "#243B73",
  arm: "#3E5A9A",
  leg: "#6870C9",
  other: "#3E5A9A",
  joint: "#6B85BD",
  volume: "#243B73",
  handLeft: "#5EEAD4",
  handRight: "#C4B5FD",
  face: "#38BDF8",
  faceKey: "#BAE6FD",
  dhuti: "#F1F0E8",
  dhutiBand: "#D4D5D0",
  gold: "#C79A32",
} as const;

const isHandStub = (i: number) => i >= 17 && i <= 22;
const isLowerBodyBone = ([a, b]: readonly [number, number]) =>
  a >= 23 || b >= 23;
const RIG_POSE_PAIRS: PairList = POSE_SKELETON_PAIRS.filter(
  ([a, b]) =>
    !isHandStub(a) &&
    !isHandStub(b) &&
    !isLowerBodyBone([a, b]),
);
const RIG_GUIDE_PAIRS: PairList = GUIDE_BODY_PAIRS.filter(
  ([a, b]) =>
    !isHandStub(a) &&
    !isHandStub(b) &&
    !isLowerBodyBone([a, b]),
);
const POSE_FACE_JOINTS: number[] = Array.from(
  new Set<number>([...POSE_FACE_MARKERS, ...POSE_FACE_PAIRS.flat()]),
);

const BODY_JOINT_RADIUS: Record<number, number> = {
  11: 0.105, 12: 0.105, 13: 0.06, 14: 0.06, 15: 0.046, 16: 0.046,
  23: 0.08, 24: 0.08, 25: 0.066, 26: 0.066, 27: 0.05, 28: 0.05,
};
const DEFAULT_BODY_JOINT_RADIUS = 0.034;
const bodyJointRadius = (i: number) => BODY_JOINT_RADIUS[i] ?? DEFAULT_BODY_JOINT_RADIUS;

const FINGER_TIPS = [4, 8, 12, 16, 20];
const HAND_JOINT_RADIUS: number[] = Array.from({ length: 21 }, (_, i) =>
  i === 0 ? 0.032 : FINGER_TIPS.includes(i) ? 0.019 : [1, 5, 9, 13, 17].includes(i) ? 0.024 : 0.02,
);
const HAND_BONE_RADIUS: number[] = HAND_CONN.map(
  ([a, b]) => Math.min(HAND_JOINT_RADIUS[a], HAND_JOINT_RADIUS[b]) * 0.62,
);
const PALM_FAN = [0, 1, 5, 9, 13, 17];
const PALM_INDICES = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5];

const FACE_LOOPS: { idx: number[]; closed: boolean }[] = [
  { idx: FACE_OVAL_INDICES, closed: true },
  { idx: [33, 160, 158, 133, 153, 144], closed: true },
  { idx: [362, 385, 387, 263, 373, 380], closed: true },
  { idx: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185], closed: true },
  { idx: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191], closed: true },
  { idx: [70, 63, 105, 66, 107], closed: false },
  { idx: [336, 296, 334, 293, 300], closed: false },
  { idx: [168, 6, 197, 195, 5, 4], closed: false },
  { idx: [98, 97, 2, 326, 327], closed: false },
];
const FACE_SLOTS: number[] = [];
const FACE_SLOT_OF = new Map<number, number>();
const slotOf = (landmark: number): number => {
  let slot = FACE_SLOT_OF.get(landmark);
  if (slot === undefined) {
    slot = FACE_SLOTS.length;
    FACE_SLOTS.push(landmark);
    FACE_SLOT_OF.set(landmark, slot);
  }
  return slot;
};
const FACE_SEGMENTS: number[] = [];
for (const { idx, closed } of FACE_LOOPS) {
  for (let k = 0; k < idx.length - 1; k++) FACE_SEGMENTS.push(slotOf(idx[k]), slotOf(idx[k + 1]));
  if (closed) FACE_SEGMENTS.push(slotOf(idx[idx.length - 1]), slotOf(idx[0]));
}
const FACE_OVAL_SLOTS = FACE_OVAL_INDICES.map(slotOf);
const FACE_KEY_SLOTS = [33, 133, 362, 263, 4, 61, 291, 13, 14, 105, 334, 152].map(slotOf);
const EYE_L = slotOf(33);
const EYE_R = slotOf(263);
const SLOT_NOSE = slotOf(4);
const SLOT_TEMPLE_A = slotOf(234);
const SLOT_TEMPLE_B = slotOf(454);

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
  dense: boolean;
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
    const ok = [11, 12, 23, 24].every(
      (k) => frame[k] && validPoint(frame[k]) && frame[k][3] >= THRESH,
    );
    if (!ok) return;
    const length =
      Math.hypot(
        (frame[11][0] + frame[12][0]) / 2 - (frame[23][0] + frame[24][0]) / 2,
        (frame[11][1] + frame[12][1]) / 2 - (frame[23][1] + frame[24][1]) / 2,
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
  hasDenseConnections: boolean;
}

function poseHeadFallback(pose: Float32Array, head: Float32Array): void {
  const vis = (i: number) => pose[i * 4 + 3] >= THRESH;
  let cx: number, cy: number, cz: number, w: number, roll = 0;
  if (vis(7) && vis(8)) {
    const dx = pose[8 * 4] - pose[7 * 4];
    const dy = pose[8 * 4 + 1] - pose[7 * 4 + 1];
    const dz = pose[8 * 4 + 2] - pose[7 * 4 + 2];
    w = Math.max(Math.hypot(dx, dy, dz) * 0.95, 0.2);
    cx = (pose[7 * 4] + pose[8 * 4]) / 2;
    cy = (pose[7 * 4 + 1] + pose[8 * 4 + 1]) / 2;
    cz = (pose[7 * 4 + 2] + pose[8 * 4 + 2]) / 2;
    roll = dx < 0 ? Math.atan2(-dy, -dx) : Math.atan2(dy, dx);
  } else if (vis(0)) {
    w = 0.54;
    cx = pose[0];
    cy = pose[1] + 0.04;
    cz = pose[2] - 0.4 * w * 1.1;
  } else {
    return;
  }
  w *= 0.85;
  const h = w * 1.2;
  const d = w * 0.8;
  head.set([1, cx, cy, cz, w, h, d, cx, cy - h * 0.5, 0, roll]);
}

const NECK_LENGTH = 0.2;
const NECK_RADIUS = 0.1;
const NECK_SEGMENTS = 5;

function seatHead(pose: Float32Array, face: Float32Array, head: Float32Array): void {
  if (head[0] === 0 || pose[11 * 4 + 3] < THRESH || pose[12 * 4 + 3] < THRESH) return;
  const shoulderX = (pose[11 * 4] + pose[12 * 4]) / 2;
  const shoulderY = (pose[11 * 4 + 1] + pose[12 * 4 + 1]) / 2;
  const dx = head[7] - shoulderX;
  const dy = head[8] - shoulderY - NECK_LENGTH;
  head[1] -= dx; head[7] -= dx;
  head[2] -= dy; head[8] -= dy;
  for (let k = 0; k < FACE_SLOTS.length; k++) {
    if (face[k * 4 + 3] !== 1) continue;
    face[k * 4] -= dx;
    face[k * 4 + 1] -= dy;
  }
  for (let i = 0; i <= 10; i++) {
    if (pose[i * 4 + 3] < THRESH) continue;
    pose[i * 4] -= dx;
    pose[i * 4 + 1] -= dy;
  }
}

function solveFrame(
  ctx: SolveContext,
  frame: number[][],
  poseFrame: PosePoint[] | undefined,
  alignment: PoseAlignment | undefined,
  alignedFace: Point2[] | undefined,
  rawFace: number[][] | undefined,
): SolvedFrame {
  const S = ctx.scale;
  const hasPose = Boolean(poseFrame);
  const pf = poseFrame ?? BODY_GUIDE;

  let zc = 0;
  if (hasPose) {
    const zs = [11, 12]
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
    const isArm = i >= 13 && i <= 22;
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
    const wristIdx = slot === 0 ? 15 : 16;
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

  const face = new Float32Array(FACE_SLOTS.length * 4);
  const head = new Float32Array(HEAD_LEN);
  let dense = ctx.hasDenseConnections;
  if (ctx.hasDenseConnections && alignedFace?.length && rawFace) {
    dense = true;
    let ratio = 1;
    const r1 = rawFace[234], r2 = rawFace[454], a1 = alignedFace[234], a2 = alignedFace[454];
    if (validPoint(r1) && validPoint(r2) && a1 && a2 && Number.isFinite(a1.x) && Number.isFinite(a2.x)) {
      const rawWidth = Math.hypot(r2[0] - r1[0], r2[1] - r1[1]);
      if (rawWidth > 1e-4) ratio = Math.hypot(a2.x - a1.x, a2.y - a1.y) / rawWidth;
    }
    const noseZ = Number.isFinite(rawFace[4]?.[2]) ? rawFace[4][2] : 0;
    const baseZ = pose[3] >= THRESH ? poseMpZ[0] : 0;
    for (let k = 0; k < FACE_SLOTS.length; k++) {
      const ap = alignedFace[FACE_SLOTS[k]];
      const rp = rawFace[FACE_SLOTS[k]];
      if (!ap || !Number.isFinite(ap.x) || !Number.isFinite(ap.y) || !rp) continue;
      const rz = Number.isFinite(rp[2]) ? rp[2] - noseZ : 0;
      writeWorld(face, k * 4, ap.x, ap.y, baseZ + rz * ratio * Z_FACE, S);
      face[k * 4 + 3] = 1;
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, sumZ = 0, n = 0;
    for (const slot of FACE_OVAL_SLOTS) {
      const o = slot * 4;
      if (face[o + 3] < 1) continue;
      minX = Math.min(minX, face[o]); maxX = Math.max(maxX, face[o]);
      minY = Math.min(minY, face[o + 1]); maxY = Math.max(maxY, face[o + 1]);
      sumZ += face[o + 2]; n++;
    }
    if (n >= 8) {
      const w = (maxX - minX) * 0.9, h = (maxY - minY) * 0.95, d = w * 0.8;
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = sumZ / n - 0.3 * d;
      let roll = 0;
      if (face[EYE_L * 4 + 3] === 1 && face[EYE_R * 4 + 3] === 1) {
        let dx = face[EYE_R * 4] - face[EYE_L * 4];
        let dy = face[EYE_R * 4 + 1] - face[EYE_L * 4 + 1];
        if (dx < 0) { dx = -dx; dy = -dy; }
        roll = Math.atan2(dy, dx);
      }
      head.set([1, cx, cy, cz, w, h, d, cx, minY, 0, roll]);
    }
  }
  if (head[0] === 0 && !ctx.hasDenseConnections) poseHeadFallback(pose, head);
  seatHead(pose, face, head);

  /* Reject stray landmarks while retaining the upper-body and hand range. */
  const b = ctx.bounds;
  let ccx = 0, ccy = 0, ccz = 0, ccn = 0;
  for (const i of [11, 12, 23, 24]) {
    if (pose[i * 4 + 3] < THRESH) continue;
    ccx += pose[i * 4]; ccy += pose[i * 4 + 1]; ccz += pose[i * 4 + 2]; ccn++;
  }
  if (ccn) { ccx /= ccn; ccy /= ccn; ccz /= ccn; }
  const inReach = (x: number, y: number, z: number, maxTorso: number) =>
    Math.hypot(x - ccx, y - ccy) <= maxTorso * TORSO_WORLD &&
    Math.abs(z - ccz) <= maxTorso * TORSO_WORLD;
  for (let i = 0; i < POSE_POINTS; i++) {
    if (
      i < 23 && pose[i * 4 + 3] >= THRESH && !isHandStub(i) &&
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
  void SLOT_NOSE; void SLOT_TEMPLE_A; void SLOT_TEMPLE_B;
  return { hasPose, pose, hands, handPresent, dense, face, head };
}

function solveSequence(
  frames: number[][][],
  pose: PosePoint[][] | undefined,
  alignments: PoseAlignment[] | undefined,
  alignedFaces: Point2[][] | undefined,
  faceMesh: number[][][] | undefined,
  hasDenseConnections: boolean,
): SolvedSequence {
  const ctx: SolveContext = {
    scale: TORSO_WORLD / medianTorso(pose, alignments),
    bounds: emptyBounds(),
    hasDenseConnections,
  };
  const solved = frames.map((frame, f) =>
    solveFrame(ctx, frame, pose?.[f], alignments?.[f], alignedFaces?.[f], faceMesh?.[f]),
  );

  const hemHeights = solved.flatMap(({ pose: framePose }) => {
    if (
      framePose[23 * 4 + 3] < THRESH ||
      framePose[24 * 4 + 3] < THRESH
    ) {
      return [];
    }
    return [(framePose[23 * 4 + 1] + framePose[24 * 4 + 1]) / 2 - DHUTI_DROP];
  });
  if (hemHeights.length) {
    ctx.bounds.minY = Math.min(
      ctx.bounds.minY,
      hemHeights.reduce((lowest, height) => Math.min(lowest, height), Infinity) - 0.44,
    );
    const hips = solved.flatMap(({ pose: framePose }) =>
      framePose[23 * 4 + 3] >= THRESH && framePose[24 * 4 + 3] >= THRESH
        ? [{
            x: (framePose[23 * 4] + framePose[24 * 4]) / 2,
            z: (framePose[23 * 4 + 2] + framePose[24 * 4 + 2]) / 2,
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

interface SampleState {
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
  dense: boolean;
  hasPose: boolean;
}
export type SampleRef = { current: SampleState };

function createSampleState(): SampleState {
  const faceCount = FACE_SLOTS.length;
  return {
    pose: new Float32Array(POSE_POINTS * 4),
    poseInit: new Uint8Array(POSE_POINTS),
    hands: [new Float32Array(63), new Float32Array(63)],
    handValid: [new Uint8Array(21), new Uint8Array(21)],
    handInit: new Uint8Array(2),
    handAlpha: new Float32Array(2),
    face: new Float32Array(faceCount * 3),
    faceValid: new Uint8Array(faceCount),
    faceInit: new Uint8Array(faceCount),
    head: new Float32Array(HEAD_LEN),
    headValid: false,
    headInit: false,
    dense: false,
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

  const selectedFrame = a < 0.5 ? f0 : f1;
  st.dense = selectedFrame.dense;
  if (st.dense) {
    for (let k = 0; k < FACE_SLOTS.length; k++) {
      if (!blendSource(f0.face, f1.face, k, a, 0.5)) {
        st.faceValid[k] = 0;
        st.faceInit[k] = 0;
        continue;
      }
      st.faceValid[k] = 1;
      easeInto(st.face, k * 3, st.faceInit[k] === 1, kxy, kz);
      st.faceInit[k] = 1;
    }
  }

  const v0 = f0.head[0] > 0;
  const v1 = f1.head[0] > 0;
  st.headValid = st.dense ? selectedFrame.head[0] > 0 : v0 || v1;
  if (st.headValid) {
    const kh = snap ? 1 : 1 - Math.exp(-delta * 25);
    for (let k = 1; k < HEAD_LEN; k++) {
      const t = st.dense
        ? selectedFrame.head[k]
        : v0 && v1
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

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _d = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _c = new THREE.Color();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);
const _sa = new Float32Array(3);
const _sb = new Float32Array(3);

let boneGeometry: THREE.CylinderGeometry | null = null;
let jointGeometry: THREE.SphereGeometry | null = null;
let headGeometry: THREE.SphereGeometry | null = null;
const getBoneGeometry = () => (boneGeometry ??= new THREE.CylinderGeometry(0.78, 1, 1, 14, 1, false));
const getJointGeometry = () => (jointGeometry ??= new THREE.SphereGeometry(1, 18, 14));
const getHeadGeometry = () => (headGeometry ??= new THREE.SphereGeometry(1, 36, 26));

function placeBone(
  mesh: THREE.InstancedMesh, index: number,
  A: ArrayLike<number>, ao: number, B: ArrayLike<number>, bo: number, radius: number,
): void {
  _d.set(B[bo] - A[ao], B[bo + 1] - A[ao + 1], B[bo + 2] - A[ao + 2]);
  const length = _d.length();
  if (length < 1e-5) {
    mesh.setMatrixAt(index, _zero);
    return;
  }
  _d.multiplyScalar(1 / length);
  _q.setFromUnitVectors(_up, _d);
  _p.set((A[ao] + B[bo]) / 2, (A[ao + 1] + B[bo + 1]) / 2, (A[ao + 2] + B[bo + 2]) / 2);
  _s.set(radius, length, radius);
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(index, _m);
}

function placeJoint(
  mesh: THREE.InstancedMesh, index: number, P: ArrayLike<number>, o: number, radius: number,
): void {
  _p.set(P[o], P[o + 1], P[o + 2]);
  _q.identity();
  _s.setScalar(radius);
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(index, _m);
}

function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  for (let i = 0; i < mesh.count; i++) mesh.setMatrixAt(i, _zero);
  mesh.instanceMatrix.needsUpdate = true;
}

function initTint(mesh: THREE.InstancedMesh | null, colors?: THREE.Color[]): void {
  if (!mesh) return;
  for (let i = 0; i < mesh.count; i++) mesh.setColorAt(i, colors?.[i] ?? _c.set("#ffffff"));
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

const visTint = (v: number) => 0.4 + 0.6 * Math.min(1, Math.max(0.2, v));

/* ==========================================================================
 * 6. 3D: RIG COMPONENTS
 * ========================================================================== */

function BodyRig({ sampleRef, pairs }: { sampleRef: SampleRef; pairs: PairList }) {
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const joints = useMemo(
    () => Array.from(new Set(pairs.flat())).filter(
      (index) =>
        index !== 23 &&
        index !== 24 &&
        index !== 25 &&
        index !== 26 &&
        index !== 27 &&
        index !== 28,
    ),
    [pairs],
  );
  const radii = useMemo(
    () => pairs.map(([a, b]) => ((bodyJointRadius(a) + bodyJointRadius(b)) / 2) * 0.58),
    [pairs],
  );
  const baseColors = useMemo(
    () =>
      pairs.map(([a, b]) => {
        const torso = [11, 12, 23, 24];
        if (torso.includes(a) && torso.includes(b)) return new THREE.Color(COLOR.torso);
        if (a >= 11 && a <= 16 && b >= 11 && b <= 16) return new THREE.Color(COLOR.arm);
        if (a >= 23 || b >= 23) return new THREE.Color(COLOR.leg);
        return new THREE.Color(COLOR.other);
      }),
    [pairs],
  );
  const boneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.38, roughness: 0.34 }),
    [],
  );
  const jointMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.3, roughness: 0.3 }),
    [],
  );
  useEffect(() => () => { boneMat.dispose(); jointMat.dispose(); }, [boneMat, jointMat]);
  useLayoutEffect(() => {
    hideAll(bonesRef.current);
    hideAll(jointsRef.current);
    initTint(bonesRef.current, baseColors);
    initTint(jointsRef.current);
  }, [baseColors, joints]);

  useFrame(() => {
    const bones = bonesRef.current;
    const jointMesh = jointsRef.current;
    if (!bones || !jointMesh) return;
    const P = sampleRef.current.pose;
    for (let i = 0; i < pairs.length; i++) {
      const a = pairs[i][0], b = pairs[i][1];
      const va = P[a * 4 + 3], vb = P[b * 4 + 3];
      if (!(va >= THRESH && vb >= THRESH)) {
        bones.setMatrixAt(i, _zero);
        continue;
      }
      placeBone(bones, i, P, a * 4, P, b * 4, radii[i]);
      _c.copy(baseColors[i]).multiplyScalar(visTint(Math.min(va, vb)));
      bones.setColorAt(i, _c);
    }
    bones.instanceMatrix.needsUpdate = true;
    if (bones.instanceColor) bones.instanceColor.needsUpdate = true;

    for (let i = 0; i < joints.length; i++) {
      const idx = joints[i];
      const v = P[idx * 4 + 3];
      if (!(v >= THRESH)) {
        jointMesh.setMatrixAt(i, _zero);
        continue;
      }
      placeJoint(jointMesh, i, P, idx * 4, bodyJointRadius(idx));
      _c.set(COLOR.joint).multiplyScalar(visTint(v));
      jointMesh.setColorAt(i, _c);
    }
    jointMesh.instanceMatrix.needsUpdate = true;
    if (jointMesh.instanceColor) jointMesh.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={bonesRef}
        args={[getBoneGeometry(), boneMat, pairs.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={jointsRef}
        args={[getJointGeometry(), jointMat, joints.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}

const TORSO_RING_PROFILE = [0.72, 0.9, 0.99, 1.04, 1.03, 0.96, 0.8];
const TORSO_RINGS = TORSO_RING_PROFILE.length;
const TORSO_SEGMENTS = 16;
const TORSO_CAPS = 2;
const TORSO_CAP_TOP = TORSO_RINGS * TORSO_SEGMENTS;
const TORSO_CAP_BOTTOM = TORSO_CAP_TOP + 1;
const TORSO_INDICES = (() => {
  const indices: number[] = [];
  for (let ring = 0; ring < TORSO_RINGS - 1; ring++) {
    const upper = ring * TORSO_SEGMENTS;
    const lower = (ring + 1) * TORSO_SEGMENTS;
    for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
      const next = (segment + 1) % TORSO_SEGMENTS;
      indices.push(
        upper + segment, lower + segment, lower + next,
        upper + segment, lower + next, upper + next,
      );
    }
  }
  for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
    const next = (segment + 1) % TORSO_SEGMENTS;
    indices.push(TORSO_CAP_TOP, next, segment);
    const bottom = (TORSO_RINGS - 1) * TORSO_SEGMENTS;
    indices.push(TORSO_CAP_BOTTOM, bottom + segment, bottom + next);
  }
  return indices;
})();

function TorsoRig({
  sampleRef,
  playbackRef,
}: {
  sampleRef: SampleRef;
  playbackRef: React.MutableRefObject<PlaybackState>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const idleTime = useRef(0);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array((TORSO_RINGS * TORSO_SEGMENTS + TORSO_CAPS) * 3),
        3,
      )
        .setUsage(THREE.DynamicDrawUsage),
    );
    g.setIndex(TORSO_INDICES);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR.volume,
        emissive: "#080f29",
        emissiveIntensity: 0.1,
        roughness: 0.38,
        metalness: 0.34,
        side: THREE.DoubleSide, flatShading: false,
      }),
    [],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (!playbackRef.current.playing) idleTime.current += Math.min(delta, 0.1);
    const P = sampleRef.current.pose;
    const ok = P[11 * 4 + 3] >= THRESH && P[12 * 4 + 3] >= THRESH && P[23 * 4 + 3] >= THRESH && P[24 * 4 + 3] >= THRESH;
    mesh.visible = ok;
    if (!ok) return;
    const shoulderCenterX = (P[11 * 4] + P[12 * 4]) / 2;
    const shoulderCenterY = (P[11 * 4 + 1] + P[12 * 4 + 1]) / 2;
    const shoulderCenterZ = (P[11 * 4 + 2] + P[12 * 4 + 2]) / 2;
    const hipCenterX = (P[23 * 4] + P[24 * 4]) / 2;
    const hipCenterY = (P[23 * 4 + 1] + P[24 * 4 + 1]) / 2 - 0.12;
    const hipCenterZ = (P[23 * 4 + 2] + P[24 * 4 + 2]) / 2;
    const shoulderHalfWidth = Math.max(
      Math.hypot(
        P[11 * 4] - P[12 * 4],
        P[11 * 4 + 1] - P[12 * 4 + 1],
        P[11 * 4 + 2] - P[12 * 4 + 2],
      ) * 0.52,
      0.12,
    );
    const hipHalfWidth = Math.max(Math.abs(P[23 * 4] - P[24 * 4]) * 0.52, 0.1);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let ring = 0; ring < TORSO_RINGS; ring++) {
      const t = ring / (TORSO_RINGS - 1);
      const profile = TORSO_RING_PROFILE[ring];
      const centerX = THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, t);
      const centerY = THREE.MathUtils.lerp(shoulderCenterY, hipCenterY, t);
      const centerZ = THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, t);
      const idleBreath = playbackRef.current.playing
        ? 1
        : 1 + Math.sin(idleTime.current * 1.35) * 0.003;
      const halfWidth =
        THREE.MathUtils.lerp(shoulderHalfWidth, hipHalfWidth, t) * profile * idleBreath;
      const depth = Math.max(halfWidth * 0.62, 0.08);
      for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
        const angle = (segment / TORSO_SEGMENTS) * Math.PI * 2;
        const index = ring * TORSO_SEGMENTS + segment;
        pos.setXYZ(
          index,
          centerX + Math.cos(angle) * halfWidth,
          centerY,
          centerZ + Math.sin(angle) * depth,
        );
      }
    }
    pos.setXYZ(TORSO_CAP_TOP, shoulderCenterX, shoulderCenterY, shoulderCenterZ);
    pos.setXYZ(TORSO_CAP_BOTTOM, hipCenterX, hipCenterY, hipCenterZ);
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-1}
      castShadow
      receiveShadow
    />
  );
}

function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const neckStart = useRef(new Float32Array(3));
  const neckEnd = useRef(new Float32Array(3));
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#172a47",
        transparent: true,
        opacity: 0.13,
        roughness: 0.55,
        metalness: 0.05,
        depthWrite: false,
      }),
    [],
  );
  const neckMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#5678bd",
      metalness: 0.34,
      roughness: 0.3,
      emissive: "#10213f",
      emissiveIntensity: 0.08,
    }),
    [],
  );
  useEffect(() => () => { headMat.dispose(); neckMat.dispose(); }, [headMat, neckMat]);
  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;
    head.visible = st.headValid;
    if (!st.headValid) {
      hideAll(neck);
      return;
    }
    const H = st.head;
    head.position.set(H[1], H[2], H[3]);
    head.scale.set(H[4] / 2, H[5] / 2, H[6] / 2);
    head.rotation.z = H[10];

    const P = st.pose;
    if (P[11 * 4 + 3] >= THRESH && P[12 * 4 + 3] >= THRESH) {
      _sa[0] = (P[11 * 4] + P[12 * 4]) / 2;
      _sa[1] = (P[11 * 4 + 1] + P[12 * 4 + 1]) / 2;
      _sa[2] = (P[11 * 4 + 2] + P[12 * 4 + 2]) / 2;
      _sb[0] = H[7]; _sb[1] = H[8]; _sb[2] = H[9];
      const dx = _sb[0] - _sa[0];
      const dy = _sb[1] - _sa[1];
      const dz = _sb[2] - _sa[2];
      for (let index = 0; index < NECK_SEGMENTS; index++) {
        const start = (index + 0.08) / NECK_SEGMENTS;
        const end = (index + 0.92) / NECK_SEGMENTS;
        neckStart.current[0] = _sa[0] + dx * start;
        neckStart.current[1] = _sa[1] + dy * start;
        neckStart.current[2] = _sa[2] + dz * start;
        neckEnd.current[0] = _sa[0] + dx * end;
        neckEnd.current[1] = _sa[1] + dy * end;
        neckEnd.current[2] = _sa[2] + dz * end;
        placeBone(
          neck,
          index,
          neckStart.current,
          0,
          neckEnd.current,
          0,
          NECK_RADIUS * (0.9 + 0.1 * Math.sin((index / (NECK_SEGMENTS - 1)) * Math.PI)),
        );
        neck.setColorAt(index, _c.set(index === 0 || index === NECK_SEGMENTS - 1 ? "#64cbd6" : "#274566"));
      }
    } else {
      hideAll(neck);
    }
    neck.instanceMatrix.needsUpdate = true;
    if (neck.instanceColor) neck.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <mesh
        ref={headRef}
        geometry={getHeadGeometry()}
        material={headMat}
        frustumCulled={false}
        renderOrder={-1}
        castShadow
      />
      <instancedMesh
        ref={neckRef}
        args={[getBoneGeometry(), neckMat, NECK_SEGMENTS]}
        frustumCulled={false}
        castShadow
      />
    </group>
  );
}

function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const keysRef = useRef<THREE.InstancedMesh>(null);
  const stubBonesRef = useRef<THREE.InstancedMesh>(null);
  const stubJointsRef = useRef<THREE.InstancedMesh>(null);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FACE_SEGMENTS.length * 3), 3).setUsage(THREE.DynamicDrawUsage),
    );
    return g;
  }, []);
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: COLOR.face, transparent: true, opacity: 0.8 }),
    [],
  );
  const keyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLOR.faceKey, roughness: 0.4, metalness: 0.1 }), []);
  const stubMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLOR.face, roughness: 0.45, metalness: 0.2 }), []);
  useEffect(
    () => () => { lineGeo.dispose(); lineMat.dispose(); keyMat.dispose(); stubMat.dispose(); },
    [lineGeo, lineMat, keyMat, stubMat],
  );
  useLayoutEffect(() => {
    hideAll(keysRef.current);
    hideAll(stubBonesRef.current);
    hideAll(stubJointsRef.current);
  }, []);

  useFrame(() => {
    const lines = linesRef.current, keys = keysRef.current;
    const stubBones = stubBonesRef.current, stubJoints = stubJointsRef.current;
    if (!lines || !keys || !stubBones || !stubJoints) return;
    const st = sampleRef.current;
    const dense = st.dense;
    lines.visible = dense;
    keys.visible = dense;
    stubBones.visible = !dense;
    stubJoints.visible = !dense;

    if (dense) {
      const pos = lineGeo.getAttribute("position") as THREE.BufferAttribute;
      const F = st.face;
      for (let s = 0; s < FACE_SEGMENTS.length; s += 2) {
        const a = FACE_SEGMENTS[s], b = FACE_SEGMENTS[s + 1];
        const i = s;
        if (st.faceValid[a] && st.faceValid[b]) {
          pos.setXYZ(i, F[a * 3], F[a * 3 + 1], F[a * 3 + 2]);
          pos.setXYZ(i + 1, F[b * 3], F[b * 3 + 1], F[b * 3 + 2]);
        } else {
          pos.setXYZ(i, 0, 0, 0);
          pos.setXYZ(i + 1, 0, 0, 0);
        }
      }
      pos.needsUpdate = true;
      for (let k = 0; k < FACE_KEY_SLOTS.length; k++) {
        const slot = FACE_KEY_SLOTS[k];
        if (st.faceValid[slot]) placeJoint(keys, k, F, slot * 3, slot === SLOT_NOSE ? 0.016 : 0.011);
        else keys.setMatrixAt(k, _zero);
      }
      keys.instanceMatrix.needsUpdate = true;
    } else {
      const P = st.pose;
      for (let i = 0; i < POSE_FACE_PAIRS.length; i++) {
        const a = POSE_FACE_PAIRS[i][0], b = POSE_FACE_PAIRS[i][1];
        if (P[a * 4 + 3] >= THRESH && P[b * 4 + 3] >= THRESH) placeBone(stubBones, i, P, a * 4, P, b * 4, 0.007);
        else stubBones.setMatrixAt(i, _zero);
      }
      for (let i = 0; i < POSE_FACE_JOINTS.length; i++) {
        const idx = POSE_FACE_JOINTS[i];
        if (P[idx * 4 + 3] >= THRESH) placeJoint(stubJoints, i, P, idx * 4, idx === 0 ? 0.02 : 0.013);
        else stubJoints.setMatrixAt(i, _zero);
      }
      stubBones.instanceMatrix.needsUpdate = true;
      stubJoints.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} frustumCulled={false} />
      <instancedMesh ref={keysRef} args={[getJointGeometry(), keyMat, FACE_KEY_SLOTS.length]} frustumCulled={false} />
      <instancedMesh ref={stubBonesRef} args={[getBoneGeometry(), stubMat, POSE_FACE_PAIRS.length]} frustumCulled={false} />
      <instancedMesh ref={stubJointsRef} args={[getJointGeometry(), stubMat, POSE_FACE_JOINTS.length]} frustumCulled={false} />
    </group>
  );
}

function HandRig({ slot, color, sampleRef }: { slot: 0 | 1; color: string; sampleRef: SampleRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const palmRef = useRef<THREE.Mesh>(null);
  const correction = useRef(new THREE.Vector3());

  const mats = useMemo(
    () => ({
      bone: new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.4, emissive: color, emissiveIntensity: 0.12 }),
      joint: new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35),
        metalness: 0.2, roughness: 0.32, emissive: color, emissiveIntensity: 0.1,
      }),
      palm: new THREE.MeshStandardMaterial({
        color, transparent: true, opacity: 0.2, roughness: 0.8, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
      }),
    }),
    [color],
  );
  const palmGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PALM_FAN.length * 3), 3).setUsage(THREE.DynamicDrawUsage),
    );
    g.setIndex(PALM_INDICES);
    return g;
  }, []);
  useEffect(
    () => () => { mats.bone.dispose(); mats.joint.dispose(); mats.palm.dispose(); palmGeo.dispose(); },
    [mats, palmGeo],
  );
  useLayoutEffect(() => {
    hideAll(bonesRef.current);
    hideAll(jointsRef.current);
  }, []);

  useFrame(() => {
    const group = groupRef.current, bones = bonesRef.current, joints = jointsRef.current, palm = palmRef.current;
    if (!group || !bones || !joints || !palm) return;
    const st = sampleRef.current;
    const alpha = st.handAlpha[slot];
    group.visible = alpha > 0.01;
    if (!group.visible) return;
    const pts = st.hands[slot];
    const valid = st.handValid[slot];
    const fading = alpha < 0.985;
    mats.bone.transparent = fading;
    mats.bone.opacity = alpha;
    mats.joint.transparent = fading;
    mats.joint.opacity = alpha;
    mats.palm.opacity = alpha * 0.22;

    correction.current.set(0, 0, 0);
    const P = st.pose;
    if (
      P[11 * 4 + 3] >= THRESH && P[12 * 4 + 3] >= THRESH &&
      P[23 * 4 + 3] >= THRESH && P[24 * 4 + 3] >= THRESH &&
      valid[0]
    ) {
      const shoulderY = (P[11 * 4 + 1] + P[12 * 4 + 1]) / 2;
      const hipY = (P[23 * 4 + 1] + P[24 * 4 + 1]) / 2;
      const shoulderCenterX = (P[11 * 4] + P[12 * 4]) / 2;
      const shoulderCenterZ = (P[11 * 4 + 2] + P[12 * 4 + 2]) / 2;
      const hipCenterX = (P[23 * 4] + P[24 * 4]) / 2;
      const hipCenterZ = (P[23 * 4 + 2] + P[24 * 4 + 2]) / 2;
      const wristT = THREE.MathUtils.clamp(
        (shoulderY - pts[1]) / Math.max(shoulderY - hipY, 1e-5),
        0,
        1,
      );
      const wristX = pts[0] - THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, wristT);
      const wristZ = pts[2] - THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, wristT);
      const directionLength = Math.hypot(wristX, wristZ);
      const directionX = directionLength > 1e-5 ? wristX / directionLength : (slot === 0 ? -1 : 1);
      const directionZ = directionLength > 1e-5 ? wristZ / directionLength : 0;
      let requiredOffset = 0;
      const shoulderWidth = Math.max(Math.hypot(
        P[11 * 4] - P[12 * 4],
        P[11 * 4 + 2] - P[12 * 4 + 2],
      ) * 0.52, 0.12);
      const hipWidth = Math.max(Math.abs(P[23 * 4] - P[24 * 4]) * 0.52, 0.1);

      for (let joint = 0; joint < 21; joint++) {
        if (!valid[joint]) continue;
        const offset = joint * 3;
        const t = THREE.MathUtils.clamp(
          (shoulderY - pts[offset + 1]) / Math.max(shoulderY - hipY, 1e-5),
          0,
          1,
        );
        if (pts[offset + 1] > shoulderY + 0.08 || pts[offset + 1] < hipY - 0.08) continue;
        const profile = t < 0.2
          ? THREE.MathUtils.lerp(0.72, 1.16, t / 0.2)
          : t < 0.6
            ? THREE.MathUtils.lerp(1.16, 1.14, (t - 0.2) / 0.4)
            : THREE.MathUtils.lerp(1.14, 1.04, (t - 0.6) / 0.4);
        const radiusX = Math.max(THREE.MathUtils.lerp(shoulderWidth, hipWidth, t) * profile, 0.09);
        const radiusZ = Math.max(radiusX * 0.62, 0.08);
        const relativeX = pts[offset] - THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, t);
        const relativeZ = pts[offset + 2] - THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, t);
        const a = directionX * directionX / (radiusX * radiusX) +
          directionZ * directionZ / (radiusZ * radiusZ);
        const b = 2 * (
          relativeX * directionX / (radiusX * radiusX) +
          relativeZ * directionZ / (radiusZ * radiusZ)
        );
        const c = relativeX * relativeX / (radiusX * radiusX) +
          relativeZ * relativeZ / (radiusZ * radiusZ) - 1;
        const discriminant = b * b - 4 * a * c;
        if (c < 0 && discriminant >= 0 && a > 0) {
          requiredOffset = Math.max(requiredOffset, (-b + Math.sqrt(discriminant)) / (2 * a));
        }
      }

      if (requiredOffset > 0) {
        const clearance = requiredOffset + 0.025;
        correction.current.set(directionX * clearance, 0, directionZ * clearance);
      }
    }
    group.position.copy(correction.current);

    for (let i = 0; i < HAND_CONN.length; i++) {
      const c = HAND_CONN[i];
      if (valid[c[0]] && valid[c[1]]) placeBone(bones, i, pts, c[0] * 3, pts, c[1] * 3, HAND_BONE_RADIUS[i]);
      else bones.setMatrixAt(i, _zero);
    }
    bones.instanceMatrix.needsUpdate = true;
    for (let j = 0; j < 21; j++) {
      if (valid[j]) placeJoint(joints, j, pts, j * 3, HAND_JOINT_RADIUS[j]);
      else joints.setMatrixAt(j, _zero);
    }
    joints.instanceMatrix.needsUpdate = true;

    palm.visible = valid[0] === 1;
    if (palm.visible) {
      const pos = palmGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < PALM_FAN.length; k++) {
        const j = valid[PALM_FAN[k]] ? PALM_FAN[k] : 0;
        pos.setXYZ(k, pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]);
      }
      pos.needsUpdate = true;
      palmGeo.computeVertexNormals();
    }
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      <instancedMesh ref={bonesRef} args={[getBoneGeometry(), mats.bone, HAND_CONN.length]} frustumCulled={false} renderOrder={2} />
      <instancedMesh ref={jointsRef} args={[getJointGeometry(), mats.joint, 21]} frustumCulled={false} renderOrder={2} />
      <mesh ref={palmRef} geometry={palmGeo} material={mats.palm} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

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
  const t = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
  const distance =
    Math.max((halfH * 1.08) / t, (halfW * 1.08) / (t * Math.max(aspect, 0.2))) + halfD + 0.15;
  return { center, distance };
}

type OrbitControlsHandle = React.ElementRef<typeof OrbitControls>;

function CameraRig({
  bounds, command, horizontalOnly, sampleRef, viewResetToken,
}: {
  bounds: Bounds;
  command: ViewCommand;
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

  const placeFront = useCallback(() => {
    const { center, distance } = framingRef.current;
    camera.position.copy(center).addScaledVector(VIEW_DIRS.front, distance);
    const ctl = controlsRef.current;
    if (ctl) {
      ctl.target.copy(center);
      ctl.update();
    } else {
      camera.lookAt(center);
    }
  }, [camera]);

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
    const { center, distance: base } = framingRef.current;
    const ctl = controlsRef.current;
    const target = ctl ? ctl.target.clone() : center.clone();
    const offset = camera.position.clone().sub(target);
    const current = offset.length() || base;
    switch (command.kind) {
      case "front":
      case "side":
      case "angle":
        focusRef.current = null;
        goal.current = {
          pos: center.clone().addScaledVector(VIEW_DIRS[command.kind], current),
          target: center.clone(),
        };
        break;
      case "reset":
        interacted.current = false;
        focusRef.current = null;
        focusInit.current = false;
        goal.current = null;
        camera.position.copy(center).addScaledVector(VIEW_DIRS.front, base);
        if (ctl) {
          ctl.target.copy(center);
          ctl.update();
        } else {
          camera.lookAt(center);
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
  }, [command, camera]);

  useEffect(() => {
    if (lastViewResetToken.current === viewResetToken) return;
    lastViewResetToken.current = viewResetToken;
    const { center, distance } = framingRef.current;
    interacted.current = false;
    focusRef.current = null;
    focusInit.current = false;
    goal.current = null;
    camera.position.copy(center).addScaledVector(VIEW_DIRS.front, distance);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(center);
      controls.update();
    } else {
      camera.lookAt(center);
    }
  }, [viewResetToken, camera]);

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

interface ViewerProps {
  seq: SolvedSequence;
  fps: number;
  hasPoseData: boolean;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  command: ViewCommand;
  onFrame: (frame: number) => void;
  onFail: () => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
  horizontalOnly: boolean;
  viewResetToken: number;
}

function SceneContent({
  seq, fps, hasPoseData, playheadRef, playbackRef, command, onFrame,
  loop, onComplete, restartToken, horizontalOnly, viewResetToken,
}: Omit<ViewerProps, "onFail">) {
  const sampleRef = useMemo<SampleRef>(() => ({ current: createSampleState() }), [seq]);
  return (
    <>
      <color attach="background" args={["#2B3D5B"]} />
      <hemisphereLight args={["#eaf0ff", "#182642", 0.82]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.45}
        color="#f5f4f1"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.72} color="#9cbcff" />
      <directionalLight position={[3, 2, -2]} intensity={0.26} color="#55DDE0" />
      <PlaybackDriver
        seq={seq} sampleRef={sampleRef} playheadRef={playheadRef}
        playbackRef={playbackRef} fps={fps} onFrame={onFrame} loop={loop}
        onComplete={onComplete} restartToken={restartToken}
      />
      <CameraRig
        bounds={seq.bounds}
        command={command}
        horizontalOnly={horizontalOnly}
        sampleRef={sampleRef}
        viewResetToken={viewResetToken}
      />
      <RoundAlpanaStage seq={seq} />
      <TorsoRig sampleRef={sampleRef} playbackRef={playbackRef} />
      <HeadRig sampleRef={sampleRef} />
      <BodyRig sampleRef={sampleRef} pairs={hasPoseData ? RIG_POSE_PAIRS : RIG_GUIDE_PAIRS} />
      <DhutiRig sampleRef={sampleRef} />
      <FaceRig sampleRef={sampleRef} />
      <HandRig slot={0} color={COLOR.handLeft} sampleRef={sampleRef} />
      <HandRig slot={1} color={COLOR.handRight} sampleRef={sampleRef} />
    </>
  );
}

class ViewerBoundary extends Component<
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

const Skeleton3DViewer = React.memo(function Skeleton3DViewer({ onFail, ...scene }: ViewerProps) {
  return (
    <div className="absolute inset-0">
      <ViewerBoundary onError={onFail}>
        <Canvas
          dpr={[1, 2]}
          shadows="percentage"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{ fov: FOV, near: 0.05, far: 200, position: [0, 0, 6] }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
          }}
        >
          <SceneContent {...scene} />
        </Canvas>
      </ViewerBoundary>
    </div>
  );
});

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
  faceMesh?: number[][][];
  faceMeshError?: string;
  fps?: number;
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
  faceMesh,
  faceMeshError,
  fps = 15,
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
  const alignedFaceFrames = useMemo(
    () =>
      faceMesh?.map((faceFrame, index) => {
        const targetPose = pose?.[index] ?? BODY_GUIDE;
        const aligned = alignFaceMeshToPose(faceFrame, targetPose);
        const alignment = poseAlignments?.[index];
        return alignment
          ? aligned.map((point) => stabilizePoint([point.x, point.y], alignment))
          : aligned;
      }),
    [faceMesh, pose, poseAlignments],
  );
  const seq = useMemo(
    () =>
      frames?.length
        ? solveSequence(
            frames,
            pose,
            poseAlignments,
            alignedFaceFrames,
            faceMesh,
            Boolean(faceMesh?.some((frame) => frame.length > 0)),
          )
        : null,
    [frames, pose, poseAlignments, alignedFaceFrames, faceMesh],
  );

  const mode: "pending" | "3d" | "unavailable" =
    webgl === null ? "pending" : webgl && !viewerFailed && seq ? "3d" : "unavailable";

  const currentFrameData = frames?.[currentFrame];
  const currentHandsCount = currentFrameData
    ? [0, 21].filter((offset) => !isMissingHand(currentFrameData, offset)).length
    : 0;
  const currentFaceMeshCount = alignedFaceFrames?.[currentFrame]?.length ?? 0;
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
        {currentFaceMeshCount > 0 ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-sky-300">Face: {currentFaceMeshCount}</span>
          </>
        ) : faceMesh ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-text-muted">No face</span>
          </>
        ) : faceMeshError ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-status-unknown" title={faceMeshError}>
              Face mesh unavailable
            </span>
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
          <Skeleton3DViewer
            seq={seq}
            fps={fps}
            hasPoseData={Boolean(pose?.length)}
            playheadRef={playheadRef}
            playbackRef={playbackRef}
            command={viewCommand}
            onFrame={handleFrame}
            onFail={handleFail}
            loop={loop}
            onComplete={onComplete}
            restartToken={restartToken}
            horizontalOnly={horizontalOnly}
            viewResetToken={viewResetToken}
          />
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

# FILE: `frontend\src\components\simulation\simulationConstants.ts`

```typescript
export const THRESH = 0.01;
export const TORSO_WORLD = 1.8;
export const DHUTI_DROP = TORSO_WORLD * 1.25;
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

# FILE: `frontend\src\components\verification\EvidencePanel.tsx`

```tsx
"use client";
import React from "react";
import { VerificationEvidence } from "@/lib/types";
import { AlertCircle, Check, X, HelpCircle, BarChart2 } from "lucide-react";

interface EvidencePanelProps {
  evidence: VerificationEvidence;
  submittedLabel: string;
  signerId: string;
  onAction?: (action: "accepted" | "rejected" | "needs_review", notes?: string) => void;
}

export function EvidencePanel({
  evidence,
  submittedLabel,
  signerId,
  onAction,
}: EvidencePanelProps) {
  const [notes, setNotes] = React.useState("");

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      {/* Permanent Warning Banner per Section 8.6 */}
      <div className="p-3.5 rounded bg-status-pending/10 border border-status-pending/30 flex items-start space-x-3 text-xs text-status-pending">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <span className="leading-relaxed font-mono">
          Validation scores are advisory evidence only. They do not automatically approve or reject this submission. Human review required.
        </span>
      </div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SUBMITTED GLOSS</div>
          <div className="text-xl font-bold font-sans text-text-primary mt-0.5">{submittedLabel}</div>
        </div>
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SIGNER ID</div>
          <div className="text-sm font-mono text-text-secondary mt-0.5">{signerId}</div>
        </div>
      </div>

      {/* Reasoning Layer per Section 8.6 */}
      <div className="bg-surface-elevated/70 border border-border p-4 rounded-md space-y-2.5">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2 flex items-center space-x-1.5">
          <BarChart2 size={13} className="text-accent-secondary" />
          <span>Automated Reasoning Analysis</span>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
          <span className="text-text-muted">HANDSHAPE MATCH</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.handshape_match}</span>

          <span className="text-text-muted">MOVEMENT MATCH</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.movement_match}</span>

          <span className="text-text-muted">TEMPORAL PATTERN</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.temporal_match}</span>

          <span className="text-text-muted">NMM DETECTED</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.nmm_detected}</span>

          <span className="text-text-muted">TOP CANDIDATE</span>
          <span className="text-accent-primary font-semibold text-right">{evidence.reasoning.top_candidate}</span>
        </div>
      </div>

      {/* Scores & Progress */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
          Algorithmic Confidence Metrics (/100)
        </div>
        {[
          { label: "Geometry Alignment", val: evidence.geometry_score },
          { label: "Temporal Cadence", val: evidence.temporal_score },
          { label: "Cluster Similarity", val: evidence.similarity_score },
          { label: "Signer Label Agreement", val: evidence.label_agreement },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-text-secondary">
              <span>{item.label}</span>
              <span className="text-text-primary font-semibold">{item.val}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full"
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Symbolic Tags */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">
          Extracted Kinematic Tags
        </div>
        <div className="flex flex-wrap gap-1.5">
          {evidence.symbolic_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-elevated border border-border text-text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Movement Description */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
          Trajectory Analysis
        </div>
        <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated/40 p-3 rounded border border-border">
          {evidence.movement_description}
        </p>
      </div>

      {/* Reviewer Notes */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
          Reviewer Evaluation Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document any spatial divergence or regional dialect variations..."
          className="w-full p-2.5 bg-background border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-accent-primary"
        />
      </div>

      {/* 3 Action Buttons per Section 8.6 */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onAction?.("accepted", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-approved/20 border border-status-approved text-status-approved hover:bg-status-approved hover:text-black font-mono text-xs font-semibold uppercase transition-colors"
        >
          <Check size={14} />
          <span>Accept</span>
        </button>

        <button
          onClick={() => onAction?.("rejected", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-error/20 border border-status-error text-status-error hover:bg-status-error hover:text-white font-mono text-xs font-semibold uppercase transition-colors"
        >
          <X size={14} />
          <span>Reject</span>
        </button>

        <button
          onClick={() => onAction?.("needs_review", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-unknown/20 border border-status-unknown text-status-unknown hover:bg-status-unknown hover:text-white font-mono text-xs font-semibold uppercase transition-colors"
        >
          <HelpCircle size={14} />
          <span>Needs Review</span>
        </button>
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

# FILE: `frontend\src\hooks\useRecording.ts`

```typescript
"use client";
import { useState, useRef, useCallback } from "react";

export function useRecording(stream: MediaStream | null) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (!stream) return;
    chunksRef.current = [];
    
    // Choose compatible mimeType
    const mimeTypes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
    const supportedType = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || "video/webm";

    try {
      const recorder = new MediaRecorder(stream, { mimeType: supportedType });
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: supportedType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(100);
      setIsRecording(true);
    } catch (e) {
      console.error("Failed to start MediaRecorder:", e);
    }
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
  }, [recordedUrl]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    recordedBlob,
    recordedUrl,
    clearRecording,
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
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
];

export const PIPELINE_STAGES = [
  { id: "camera", label: "CAMERA" },
  { id: "landmarks", label: "LANDMARKS" },
  { id: "recognition", label: "RECOGNITION" },
  { id: "nlg", label: "NLG" },
  { id: "tts", label: "TTS" },
] as const;
```

---

# FILE: `frontend\src\lib\pose.ts`

```typescript
/**
 * frontend/src/lib/pose.ts
 * Client-side mirror of backend/pose.py.
 *
 * The replay canvas and the extractor must agree on what the pose block IS --
 * which landmarks exist, which edges are body geometry -- or the overlay will
 * draw a skeleton the model never saw. The two files are kept deliberately
 * small and parallel; the authoritative copy is the Python one, because that is
 * the side that writes the numbers.
 */

/** BlazePose landmark count. Each point is (x, y, z, visibility). */
export const POSE_POINTS = 33;

/**
 * Body skeleton edges. Fingertips and feet are omitted: the fingers belong to
 * the 2x21 hand block and the toes are invisible in a signing distance shot.
 */
export const POSE_BODY_PAIRS: [number, number][] = [
  [11, 12],                                    // shoulders
  [11, 13], [13, 15],                          // left arm
  [12, 14], [14, 16],                          // right arm
  [11, 23], [12, 24], [23, 24],                // torso
  [23, 25], [25, 27],                          // left leg
  [24, 26], [26, 28],                          // right leg
  [0, 9], [0, 10], [9, 10],                    // nose <-> mouth corners
  [2, 5], [7, 8],                              // eyes and mouth midline
];

/** Nose + mouth corners: the landmarks the NMM detector reads. */
export const POSE_FACE_MARKERS: number[] = [0, 9, 10];

/** Landmark connections that make the available BlazePose face points legible. */
export const POSE_FACE_PAIRS: [number, number][] = [
  [7, 3], [3, 2], [2, 1], [1, 0], [0, 4], [4, 5], [5, 6], [6, 8],
  [0, 9], [0, 10], [9, 10],
];

/** A single pose landmark as delivered by /api/simulation/frames. */
export type PosePoint = [number, number, number, number];
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
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

// --- Pipeline & Recognition ---
export type PipelineStage = "camera" | "landmarks" | "recognition" | "nlg" | "tts";
export type PipelineStatus = "active" | "idle" | "error" | "waiting";

export interface NMMFlags {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
  head_tilt?: boolean;
}

// --- Dataset & Contributions ---
export interface Sign {
  id: string;
  label: string;
  bengali_meaning: string;
  category: string;
  type: "word" | "phrase" | "sentence";
  approved_samples: number;
  pending_samples: number;
  rejected_samples: number;
  has_landmarks: boolean;
  language: "WBSL" | "ISL" | "BdSL";
}

export interface ContributionSession {
  session_id: string;
  signer_id: string;
  created_at: string;
  status: "active" | "completed" | "interrupted";
}

export interface Contribution {
  sample_id: string;
  session_id: string;
  label: string;
  signer_id: string;
  split: "train" | "val" | "test";
  source: "original" | "community" | "unknown_queue_promoted";
  verification: "pending" | "accepted" | "rejected" | "needs_review";
  verified_by: string | null;
  captured_at: string;
  frames: number;
  landmark_path: string;
  video_url?: string;
  upload_status: "pending" | "uploading" | "success" | "failed";
}

export interface VerificationEvidence {
  geometry_score: number;
  temporal_score: number;
  similarity_score: number;
  label_agreement: number;
  synthetic_score: number;
  model_predictions: { label: string; confidence: number }[];
  numerical_features: Record<string, number>;
  symbolic_tags: string[];
  movement_description: string;
  reasoning: {
    handshape_match: string;
    movement_match: string;
    temporal_match: string;
    nmm_detected: string;
    top_candidate: string;
  };
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

# FILE: `frontend\src\services\contributions.ts`

```typescript
import apiClient from "./api";
import { Contribution, ContributionSession, VerificationEvidence } from "@/lib/types";

export const contributionService = {
  createSession: async (signerId: string): Promise<ContributionSession> => {
    const res = await apiClient.post<ContributionSession>("/contributions/session", { signer_id: signerId });
    return res.data;
  },

  submitSample: async (sessionId: string, formData: FormData): Promise<{ sample_id: string; status: string; frames: number }> => {
    const res = await apiClient.post(`/contributions/session/${sessionId}/samples`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    return res.data;
  },

  getContributions: async (): Promise<Contribution[]> => {
    const res = await apiClient.get<Contribution[]>("/admin/contributions");
    return res.data;
  },

  getEvidence: async (sampleId: string): Promise<VerificationEvidence> => {
    const res = await apiClient.get<VerificationEvidence>(`/admin/contributions/${sampleId}/evidence`);
    return res.data;
  },

  verifyContribution: async (sampleId: string, action: "accepted" | "rejected" | "needs_review", notes?: string): Promise<{ success: boolean }> => {
    const res = await apiClient.post(`/admin/contributions/${sampleId}/verify`, { action, notes });
    return res.data;
  },

};
```

---

# FILE: `frontend\src\services\dataset.ts`

```typescript
import apiClient from "./api";
import { Sign, PaginatedResponse } from "@/lib/types";

export const datasetService = {
  getSigns: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    language?: string;
  }): Promise<PaginatedResponse<Sign>> => {
    const response = await apiClient.get<PaginatedResponse<Sign>>("/dataset/signs", { params });
    return response.data;
  },

  getSignById: async (id: string): Promise<Sign> => {
    const res = await apiClient.get<Sign>(`/dataset/signs/${id}`);
    return res.data;
  },
};
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

export interface DatasetStats {
  total_signs: number;
  total_approved_samples: number;
  total_pending_samples: number;
  total_rejected_samples: number;
  languages: string[];
  categories: string[];
  dataset_version: string;
  model_version: string;
}

export interface AdminStats {
  total_signs: number;
  total_approved_samples: number;
  total_pending_samples: number;
  total_rejected_samples: number;
  model_active: string;
  model_classes: number;
  contract?: {
    kind?: string;
    feature_width?: number;
  };
  llm_available: boolean;
  llm_model: string;
  inference_mode: string;
  dataset_version: string;
}

export const statsService = {
  getDatasetStats: async (): Promise<DatasetStats> => {
    const res = await apiClient.get<DatasetStats>("/dataset/stats");
    return res.data;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await apiClient.get<AdminStats>("/admin/stats");
    return res.data;
  },
};
```

---

# FILE: `frontend\src\store\recording-store.ts`

```typescript
import { create } from "zustand";

export type RecordingState =
  | "CONSENT_GATE"
  | "SIGN_SELECTED"
  | "REFERENCE_VIEW"
  | "READY_TO_RECORD"
  | "COUNTDOWN"
  | "RECORDING"
  | "RECORDED"
  | "NMM_TAGGING"
  | "PREVIEW"
  | "SUBMITTING_LANDMARKS"
  | "SUBMITTING_VIDEO"
  | "SUBMITTED"
  | "UPLOAD_FAILED";

interface RecordingStore {
  state: RecordingState;
  sessionId: string | null;
  currentSignId: string | null;
  currentSignLabel: string | null;
  signerId: string | null;
  consentGiven: boolean;
  recordVideo: boolean;
  samplesRecorded: number;
  uploadQueue: { blob: Blob; metadata: any; status: "pending" | "uploading" | "failed" }[];
  nmmTags: {
    question: boolean;
    wh_question: boolean;
    negation: boolean;
    affirmation: boolean;
    emphasis: boolean;
    head_tilt: boolean;
  };

  setSession: (sessionId: string) => void;
  setState: (state: RecordingState) => void;
  setConsent: (signerId: string, recordVideo: boolean) => void;
  selectSign: (signId: string, label: string) => void;
  toggleNMMTag: (tag: keyof RecordingStore["nmmTags"]) => void;
  resetNMMTags: () => void;
  incrementSamples: () => void;
  addToUploadQueue: (blob: Blob, metadata: any) => void;
  updateUploadStatus: (index: number, status: "uploading" | "failed" | "pending") => void;
  resetSession: () => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  state: "CONSENT_GATE",
  sessionId: null,
  currentSignId: null,
  currentSignLabel: null,
  signerId: null,
  consentGiven: false,
  recordVideo: false,
  samplesRecorded: 0,
  uploadQueue: [],
  nmmTags: {
    question: false,
    wh_question: false,
    negation: false,
    affirmation: false,
    emphasis: false,
    head_tilt: false,
  },

  setSession: (sessionId) => set({ sessionId }),
  setState: (state) => set({ state }),
  setConsent: (signerId, recordVideo) =>
    set({ consentGiven: true, signerId, recordVideo, state: "SIGN_SELECTED" }),
  selectSign: (signId, label) =>
    set({ currentSignId: signId, currentSignLabel: label, state: "REFERENCE_VIEW" }),
  toggleNMMTag: (tag) =>
    set((s) => ({ nmmTags: { ...s.nmmTags, [tag]: !s.nmmTags[tag] } })),
  resetNMMTags: () =>
    set({
      nmmTags: {
        question: false,
        wh_question: false,
        negation: false,
        affirmation: false,
        emphasis: false,
        head_tilt: false,
      },
    }),
  incrementSamples: () => set((s) => ({ samplesRecorded: s.samplesRecorded + 1 })),
  addToUploadQueue: (blob, metadata) =>
    set((s) => ({ uploadQueue: [...s.uploadQueue, { blob, metadata, status: "pending" }] })),
  updateUploadStatus: (index, status) =>
    set((s) => {
      const q = [...s.uploadQueue];
      if (q[index]) q[index].status = status;
      return { uploadQueue: q };
    }),
  resetSession: () =>
    set({
      state: "CONSENT_GATE",
      currentSignId: null,
      currentSignLabel: null,
      samplesRecorded: 0,
      sessionId: null,
      uploadQueue: [],
    }),
}));
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

# FILE: `frontend\tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
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

# FILE: `models\active_model.json`

```json
{
  "path": "D:\\Download\\Projects\\WBSL Bridge\\models\\onnx_models\\3\\sign_daily_lstm.onnx",
  "name": "sign_daily_lstm",
  "run": "onnx_models/3"
}
```

---

# FILE: `start.ps1`

```powershell
$root = "D:\Download\Projects\WBSL Bridge"
$python = Join-Path $root ".venv\Scripts\python.exe"
$requirements = Join-Path $root "requirements.txt"

$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw "The project Python environment is missing. Run: py -3.11 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}

if (-not (Test-Path -LiteralPath $requirements -PathType Leaf)) {
    throw "Python dependency manifest not found: $requirements"
}

$backendListeners = @(
    Get-NetTCPConnection -State Listen -LocalPort $backendPort -ErrorAction SilentlyContinue
)
$backendAlreadyRunning = $false
foreach ($listener in $backendListeners) {
    $listenerProcess = Get-CimInstance Win32_Process `
        -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction Stop

    if ($listenerProcess.CommandLine -match 'backend\.main:app') {
        $backendAlreadyRunning = $true
        continue
    }

    throw "Port $backendPort is already in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId)). Close that process before starting WBSL Bridge."
}

# Backend
@"
Set-Location '$root'
& '$python' -m uvicorn backend.main:app --reload --port $backendPort
"@ | Set-Content -Path $backendScript -Encoding UTF8

# Frontend
@"
Set-Location '$root\frontend'
`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path
npm run dev
"@ | Set-Content -Path $frontendScript -Encoding UTF8

# AI Server
@"
Set-Location '$root'

`$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
`$model = Join-Path (Get-Location) 'models\llm\gemma-4-E4B-it-Q4_K_M.gguf'

`$args = @(
    '--model', `$model
    '--jinja'
    '--jinjathink', 'false'
    '--threads', '8'
)

& `$kobold @args
"@ | Set-Content -Path $aiScript -Encoding UTF8

# Windows Terminal
$wtArgs = @("-w", "0")
$tabs = [System.Collections.Generic.List[object]]::new()

if ($backendAlreadyRunning) {
    Write-Host "Backend is already listening on port $backendPort; reusing it."
} else {
    $tabs.Add(@{ Title = "Backend"; Directory = $root; Script = $backendScript })
}
$tabs.Add(@{ Title = "AI Server"; Directory = $root; Script = $aiScript })
$tabs.Add(@{ Title = "Frontend"; Directory = "$root\frontend"; Script = $frontendScript })

for ($i = 0; $i -lt $tabs.Count; $i++) {
    if ($i -gt 0) {
        $wtArgs += ";"
    }

    $tab = $tabs[$i]
    $wtArgs += @(
        "new-tab", "--title", $tab.Title,
        "-d", $tab.Directory,
        "powershell", "-NoExit", "-File", $tab.Script
    )
}

& wt.exe @wtArgs
```

---

