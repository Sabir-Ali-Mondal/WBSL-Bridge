# WBSL Bridge — AI Codebase Context

> Compact project architecture followed by relevant source and configuration files.

**Included files:** `85`  
**Maximum source file size:** `2 MB`

---

# Project Structure

```text
WBSL Bridge
├── backend
│   ├── data
│   ├── media
│   ├── tts_output
│   │   ├── bengali_speech.mp3
│   │   ├── bengali_speech_v1.mp3
│   │   └── bengali_speech_v2.mp3
│   ├── __init__.py
│   ├── extract.py
│   ├── llm_engine.py
│   ├── main.py
│   ├── nmm.py
│   ├── pose.py
│   ├── streaming.py
│   ├── stt_engine.py
│   └── tts_engine.py
├── dataset
├── dataset_train
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   │   ├── about
│   │   │   │   └── page.tsx
│   │   │   ├── admin
│   │   │   │   ├── contributions
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dataset
│   │   │   │   ├── models
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signs
│   │   │   │   │   └── page.tsx
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
│   │   │   ├── admin
│   │   │   ├── layout
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
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
│   │   │   │   └── LandmarkSimulation.tsx
│   │   │   ├── skeletons
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
├── models
│   ├── onnx_models
│   │   ├── 1
│   │   │   ├── sign_classes.json
│   │   │   ├── sign_mlp.onnx
│   │   │   └── sign_mlp.onnx.data
│   │   ├── 2
│   │   │   ├── sign_unified_classes.json
│   │   │   ├── sign_unified_lstm.onnx
│   │   │   └── sign_unified_lstm.onnx.data
│   │   ├── 3
│   │   │   ├── sign_video_classes.json
│   │   │   ├── sign_video_lstm.onnx
│   │   │   └── sign_video_lstm.onnx.data
│   │   ├── 4
│   │   │   ├── daily_report.json
│   │   │   ├── sign_daily_classes.json
│   │   │   ├── sign_daily_lstm.onnx
│   │   │   └── sign_daily_lstm.onnx.data
│   │   ├── 5
│   │   │   ├── sign_static_classes.json
│   │   │   ├── sign_static_mlp.onnx
│   │   │   ├── sign_static_mlp.onnx.data
│   │   │   └── static_report.json
│   │   ├── 6
│   │   │   ├── daily_report.json
│   │   │   ├── sign_daily_classes.json
│   │   │   ├── sign_daily_lstm.onnx
│   │   │   └── sign_daily_lstm.onnx.data
│   │   └── 7
│   │       ├── daily_report.json
│   │       ├── sign_daily_classes.json
│   │       ├── sign_daily_lstm.onnx
│   │       └── sign_daily_lstm.onnx.data
│   └── active_model.json
├── tools
│   ├── build_index.py
│   └── build_reference_samples.py
├── codebase.md
├── codebase.py
├── HOW_TO_RUN.md
├── IMPLEMENTATION_GUIDE.md
├── openh264-1.8.0-win64.dll
├── README.md
├── start.ps1
├── train_holistic.py
├── train_run8.log
└── train_unified.py
```

---

# FILE: `backend\__init__.py`

```python

```

---

# FILE: `backend\data\gloss_map.json`

```json
{
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",

  "a": "A",
  "b": "B",
  "c": "C",
  "d": "D",
  "e": "E",
  "f": "F",
  "g": "G",
  "h": "H",
  "i": "I",
  "j": "J",
  "k": "K",
  "l": "L",
  "m": "M",
  "n": "N",
  "o": "O",
  "p": "P",
  "q": "Q",
  "r": "R",
  "s": "S",
  "t": "T",
  "u": "U",
  "v": "V",
  "w": "W",
  "x": "X",
  "y": "Y",
  "z": "Z",

  "hello": "HELLO",
  "hi": "HELLO",
  "নমস্কার": "HELLO",
  "হ্যালো": "HELLO",

  "thank": "THANK_YOU",
  "thanks": "THANK_YOU",
  "thank you": "THANK_YOU",
  "ধন্যবাদ": "THANK_YOU",

  "good morning": "GOOD_MORNING",
  "সুপ্রভাত": "GOOD_MORNING",
  "শুভ সকাল": "GOOD_MORNING",

  "good afternoon": "GOOD_AFTERNOON",
  "শুভ অপরাহ্ন": "GOOD_AFTERNOON",

  "drink": "DRINK",
  "পান": "DRINK",
  "পান করা": "DRINK",

  "tea": "TEA",
  "চা": "TEA",

  "come": "COME",
  "আসো": "COME",
  "আসা": "COME",
  "আসছি": "COME",

  "give": "GIVE",
  "দাও": "GIVE",
  "দেওয়া": "GIVE",
  "দিতে": "GIVE",

  "cook": "COOK",
  "রান্না": "COOK",
  "রান্না করা": "COOK",

  "clean": "CLEAN",
  "পরিষ্কার": "CLEAN",
  "পরিষ্কার করা": "CLEAN",

  "close": "CLOSE",
  "বন্ধ": "CLOSE",
  "বন্ধ করা": "CLOSE",

  "jump": "JUMP",
  "লাফ": "JUMP",
  "লাফানো": "JUMP",

  "cry": "CRY",
  "কান্না": "CRY",
  "কাঁদা": "CRY",

  "wrong": "WRONG",
  "ভুল": "WRONG",

  "maybe": "MAYBE",
  "হয়তো": "MAYBE",
  "সম্ভবত": "MAYBE",

  "still": "STILL",
  "এখনও": "STILL",
  "এখনো": "STILL",

  "switch": "SWITCH",
  "সুইচ": "SWITCH",

  "break": "BREAK",
  "ভাঙা": "BREAK",

  "busy": "BUSY",
  "ব্যস্ত": "BUSY",

  "fed up": "FED_UP",
  "বিরক্ত": "FED_UP",
  "অতিষ্ঠ": "FED_UP",

  "key": "KEY",
  "চাবি": "KEY",

  "knife": "KNIFE",
  "ছুরি": "KNIFE",

  "lemon": "LEMON",
  "লেবু": "LEMON",

  "onion": "ONION",
  "পেঁয়াজ": "ONION",

  "carrot": "CARROT",
  "গাজর": "CARROT",

  "brinjal": "BRINJAL",
  "বেগুন": "BRINJAL",

  "cabbage": "CABBAGE",
  "বাঁধাকপি": "CABBAGE",

  "cauliflower": "CAULIFLOWER",
  "ফুলকপি": "CAULIFLOWER",

  "chilli": "CHILLI",
  "chili": "CHILLI",
  "লঙ্কা": "CHILLI",
  "মরিচ": "CHILLI",

  "cucumber": "CUCUMBER",
  "শসা": "CUCUMBER",

  "radish": "RADISH",
  "মুলা": "RADISH",

  "vegetable": "VEGETABLES",
  "vegetables": "VEGETABLES",
  "সবজি": "VEGETABLES",

  "man": "MAN",
  "মানুষ": "MAN",
  "পুরুষ": "MAN",

  "wife": "WIFE",
  "বউ": "WIFE",
  "স্ত্রী": "WIFE",

  "uncle": "UNCLE",
  "কাকা": "UNCLE",
  "মামা": "UNCLE",
  "কাকু": "UNCLE",
  "জেঠু": "UNCLE",

  "what is your name": "WHAT_IS_YOUR_NAME",
  "what's your name": "WHAT_IS_YOUR_NAME",
  "তোমার নাম কি": "WHAT_IS_YOUR_NAME",
  "তোমার নাম কী": "WHAT_IS_YOUR_NAME",
  "আপনার নাম কি": "WHAT_IS_YOUR_NAME",
  "আপনার নাম কী": "WHAT_IS_YOUR_NAME",

  "i": "I",
  "আমি": "I",

  "you": [
    "Y",
    "O",
    "U"
  ],
  "আপনি": [
    "Y",
    "O",
    "U"
  ],
  "tumi": [
    "Y",
    "O",
    "U"
  ],
  "তুমি": [
    "Y",
    "O",
    "U"
  ],

  "tiger": "TIGER",
  "বাঘ": "TIGER",

  "elephant": "ELEPHANT",
  "হাতি": "ELEPHANT",

  "monkey": "MONKEY",
  "বাঁদর": "MONKEY",
  "বানর": "MONKEY",

  "lion": "LION",
  "সিংহ": "LION",

  "turtle": "TURTLE",
  "কচ্ছপ": "TURTLE",

  "crocodile": "CROCODILE",
  "কুমির": "CROCODILE",

  "deer": "DEER",
  "হরিণ": "DEER",

  "giraffe": "GIRAFFE",
  "জিরাফ": "GIRAFFE",

  "bear": "BEAR",
  "ভালুক": "BEAR",

  "peacock": "PEACOCK",
  "ময়ূর": "PEACOCK",

  "pigeon": "PIGEON",
  "পায়রা": "PIGEON",
  "কবুতর": "PIGEON",

  "sparrow": "SPARROW",
  "চড়ুই": "SPARROW",

  "umbrella": "UMBRELLA",
  "ছাতা": "UMBRELLA",

  "temple": "TEMPLE",
  "মন্দির": "TEMPLE",

  "exam": "EXAM",
  "পরীক্ষা": "EXAM",

  "maths": "MATHS",
  "math": "MATHS",
  "অঙ্ক": "MATHS",
  "গণিত": "MATHS",

  "fever": "FEVER",
  "জ্বর": "FEVER",

  "injury": "INJURY",
  "আঘাত": "INJURY",
  "চোট": "INJURY",

  "pour": "POUR",
  "ঢালা": "POUR",

  "hug": "HUG",
  "জড়িয়ে": "HUG",
  "জড়িয়ে ধরা": "HUG",
  "আলিঙ্গন": "HUG",

  "interview": "INTERVIEW",
  "সাক্ষাৎকার": "INTERVIEW",

  "budget": "BUDGET",
  "বাজেট": "BUDGET",

  "karnataka": "KARNATAKA",
  "কর্ণাটক": "KARNATAKA",

  "volcano": "VOLCANO",
  "আগ্নেয়গিরি": "VOLCANO",

  "writer": "WRITER",
  "লেখক": "WRITER"
}
```

---

# FILE: `backend\data\sign_media.json`

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

import numpy as np
import mediapipe as mp

from backend.pose import POSE_DIM, pose_from_landmarks

HANDS_DIM = 126
# 126 hands + 132 pose. The pose half is defined in backend/pose.py so the
# trainer and the server cannot drift apart on what the pose block contains.
HOLISTIC_DIM = HANDS_DIM + POSE_DIM

# Initialize ONCE at module load (not per request)
_hands = mp.solutions.hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.6
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
    from openai import OpenAI

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

    emotion = meta.get("emotion")
    if isinstance(emotion, dict):
        dominant = emotion.get("dominant")
        confidence = emotion.get("confidence")
        if dominant and dominant != "neutral":
            pct = (
                f" ({round(float(confidence) * 100)}% confidence)"
                if isinstance(confidence, (int, float))
                else ""
            )
            lines.append(
                f"- AFFECT: dominant facial emotion is {dominant}{pct}. "
                "This colour the whole utterance; keep it out of the text unless "
                "the gloss itself carries an [emotion] marker."
            )

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
        return gloss_text

    return (
        "SIGN METADATA (detected non-manual markers and affect):\n"
        + "\n".join(lines)
        + "\n\nGLOSS:\n"
        + gloss_text
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


SYSTEM_PROMPT = """You are the Bengali NLG module of a WBSL communication system.

Convert WBSL gloss into natural West Bengal Bengali.

FORMAT:
WORD
WORD[emotion]
WORD[negation]
WORD[negation][emotion]
WORD[?]
WORD[emotion][?]
WORD[negation][?]
WORD[negation][emotion][?]

If no emotion marker is present, treat the word as neutral.

[?] appears ONLY on the last word of a complete direct question.
[negation] marks only the semantic unit being negated.
Emotion: happy, sad, angry, neutral, surprise, fear, disgust.

CORE RULE:
Preserve COMPLETE meaning, event order, subjects, objects, tense, time,
place, cause/effect, negation, ability, permission, obligation, condition,
uncertainty, emotion and speaker.

Do not summarize, omit, invent or change meaning.
Natural Bengali word order is allowed.
Semantic accuracy is more important than fluency or brevity.

QUESTION:
[?] marks ONE direct-question boundary only.
If [?] is present, output a direct Bengali question.
Do not convert a [?] question into "কি না" unless it is introduced by WHETHER.

WHAT, WHY, HOW, WHETHER, IF and ASK do not create extra direct questions.

WHETHER introduces an embedded question and must remain embedded:
"কি না", "হয় কি না", "পারবে কি না", etc.

A later WHETHER must not turn an earlier statement or IF/THEN clause
into a question.

NEGATION:
Use negation only when marked.
Keep it local to the marked semantic unit.
Never turn a specific negated action into a general negative state.
Do not create double negation.
Standalone NO/NOT may be a separate answer.

EVENTS:
Treat the gloss as ordered semantic events.
Preserve separate actions, subjects, speakers and speech events.
Do not merge events when meaning changes.
Do not invent or duplicate ASK, SAY, TELL or EXPLAIN events.
The explicit subject controls the speech event.

SCOPE:
Preserve IF/THEN/OTHERWISE as conditions.
Preserve WHETHER ... OR NOT as one uncertainty unit.
Preserve BEFORE, AFTER, UNTIL and THEN temporal scope.
Do not let later words change earlier tense, polarity, speaker,
question status or meaning.
Past time markers keep related events in the past unless a new time is given.

SYMBOL GUIDE:
Use standard Bengali punctuation naturally.
"-" = hyphen.
"?" = direct question end.
"," = short pause or clause separation.
";" = strong separation between closely related clauses when useful.
"!" = strong emotion only when clearly supported by the gloss.
Preserve numbers exactly when they carry meaning.
Bengali digits may be used naturally.
Example: 1 → ১, 56 → ৫৬.

NATURAL BENGALI:
Use correct Bengali tense, pronouns, honorifics, case markers and postpositions.
Prefer natural West Bengal Bengali without changing the original meaning.

NO HALLUCINATION:
Do not add names, places, objects, causes, time, relationships,
symptoms or actions not present in the gloss.

Before answering, internally verify:
event preservation, subject/object, negation scope, question scope,
WHETHER scope, IF/THEN scope, speaker, tense, temporal relations,
and absence of invented or omitted information.

Here is some more guide lines for you to follow (if characters only):
- If user inputs aplphabets gloss you should interpret them as words/sentence (example [I]+[L]+[O]+[V]+[E]+[S]+[A]+[M] = I LOVE SAM )
- If user inputs numbers similer looking with aplphabets you should interpret them as words/sentence (example [1]+[L]+[0]+[V]+[E]+[S]+[A]+[M] = I LOVE SAM )
- Some time can be word which actually made for alphabets you have to guess that like [A]+[I]=Artificial Intelligence etc.


Output ONLY the final natural West Bengal Bengali text.
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

    if result["status"] == "success" and has_uncertain:
        if "সম্ভবত" not in result["bengali_text"]:
            result["bengali_text"] = result["bengali_text"].replace(
                "পান", "সম্ভবত পান", 1
            )

    result["has_uncertainty"] = has_uncertain
    result["gloss_used"] = gloss_text
    return result


GLOSS_BREAK_SYSTEM = """You are a WBSL gloss planner.

RULES:
1. Output ONLY a JSON array of tokens from AVAILABLE.
2. NEVER invent a token.
3. STT INPUT INTERPRETATION: Treat the input as raw speech-to-text output. The speaker will primarily speak Bengali or English. Bengali speech may sometimes be transcribed into Hindi, Devanagari, Roman, Telugu, or another script. Interpret the text using phonetic meaning and context before breaking it into WBSL glosses. Do not assume the script itself represents the spoken language.
4. NEVER use WHAT_IS_YOUR_NAME unless the input is literally asking "what is your name?"
5. For names or unknown short words (6 letters or fewer), fingerspell them letter by letter.
6. If a word has no matching gloss, omit it. Do NOT guess.
7. Preserve statement vs question. Do NOT turn a statement into a question.

STT INTERPRETATION EXAMPLE:

Input: "आमी आज स्कूल जाबो"
Interpret as Bengali phonetics: "আমি আজ স্কুল যাব"
Then break the intended meaning into the appropriate WBSL glosses using AVAILABLE.

EXAMPLES:

Input: "Hello, my name is Ravi."
Available has: HELLO, I, R, A, V, I, WHAT_IS_YOUR_NAME
WRONG: ["HELLO", "WHAT_IS_YOUR_NAME"]
CORRECT: ["HELLO", "I", "R", "A", "V", "I"]
Reason: "my name is" is a statement. WHAT_IS_YOUR_NAME is a question. Use I + fingerspell.

Input: "What is your name?"
Available has: WHAT_IS_YOUR_NAME, HELLO
CORRECT: ["WHAT_IS_YOUR_NAME"]

Input: "Drink tea"
Available has: DRINK, TEA, POUR
CORRECT: ["DRINK", "TEA"]
WRONG: ["POUR", "TEA"]

Input: "I am very busy today."
Available has: BUSY, I
CORRECT: ["I", "BUSY"]

Input: "Come soon."
Available has: COME
CORRECT: ["COME"]

Output ONLY the JSON array. No explanation."""


def _is_question(text: str) -> bool:
    stripped = text.strip().lower()
    question_words = (
        "what", "who", "where", "when", "why", "how",
        "do ", "does ", "did ", "is ", "are ", "was ", "were ",
        "can ", "could ", "will ", "would ", "should ",
        "am i", "have ", "has ",
    )
    if "?" in text:
        return True
    return any(stripped.startswith(w) for w in question_words)


def _post_validate(seq: list[str], original_text: str, allowed: set[str]) -> list[str]:
    seq = [g for g in seq if g in allowed or (len(g) == 1 and g.isalnum())]

    if not _is_question(original_text) and "WHAT_IS_YOUR_NAME" in seq:
        seq = [g for g in seq if g != "WHAT_IS_YOUR_NAME"]
        if "I" in allowed and "I" not in seq:
            seq.insert(0, "I")

    if not seq:
        words = re.findall(r"[a-zA-Z]+", original_text)
        for word in words:
            w_upper = word.upper()
            if w_upper in allowed:
                seq.append(w_upper)
            elif len(word) <= 6:
                letters = [ch.upper() for ch in word if ch.upper() in allowed]
                seq.extend(letters)

    return seq


def break_into_glosses(text: str, vocab: list[str]) -> dict:
    cfg = get_ai_config()
    if not cfg["configured"]:
        return {"status": "llm_not_configured", "gloss_sequence": None}

    vocab_str = ", ".join(sorted(vocab))

    user_msg = (
        f"AVAILABLE: {vocab_str}\n\n"
        f"SENTENCE: {text}\n\n"
        f"Reminder: fingerspell unknown names letter by letter. "
        f"Do NOT use WHAT_IS_YOUR_NAME for statements."
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

        s, e = content.find("["), content.rfind("]")
        if s == -1 or e == -1:
            return {"status": "parse_error", "gloss_sequence": None}

        raw_array = content[s:e + 1].strip()
        allowed = set(vocab)
        raw_items = []

        try:
            parsed = json.loads(raw_array)
            if isinstance(parsed, list):
                raw_items = [str(g) for g in parsed]
        except Exception:
            raw_items = re.findall(r"[A-Za-z0-9_]+", raw_array)

        seq = [
            g.upper()
            for g in raw_items
            if g.upper() in allowed or (len(g) == 1 and g.isalnum())
        ]

        seq = _post_validate(seq, text, allowed)

        return {"status": "success", "gloss_sequence": seq}

    except Exception as exc:
        return {"status": "error", "gloss_sequence": None, "error": str(exc)}
```

---

# FILE: `backend\main.py`

```python
"""
backend/main.py
Complete FastAPI backend for WBSL Bridge.
Loads the active run from models/onnx_models/ via the registry, serves predictions,
NMM, TTS, NLG, reference media, and REAL community ingestion (uploaded video -> landmarks -> .npy + manifest).

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8000
"""

import json
import os
import re
import tempfile
import time
import uuid
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
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

GLOSS_MAP_PATH = ROOT / "backend" / "data" / "gloss_map.json"
if GLOSS_MAP_PATH.exists():
    with open(GLOSS_MAP_PATH, "r", encoding="utf-8") as f:
        WORD_MAP = json.load(f)
else:
    WORD_MAP = {}

# ─────────────────────────────────────────────
# REFERENCE MEDIA STORAGE (videos / images per sign)
# ─────────────────────────────────────────────
MEDIA_DIR = ROOT / "backend" / "media"
MEDIA_DIR.mkdir(exist_ok=True)
SIGN_MEDIA_PATH = ROOT / "backend" / "data" / "sign_media.json"
if SIGN_MEDIA_PATH.exists():
    with open(SIGN_MEDIA_PATH, "r", encoding="utf-8") as f:
        SIGN_MEDIA = json.load(f)
else:
    SIGN_MEDIA = {}


# ─────────────────────────────────────────────
# COMMUNITY DATASET STORAGE (manifest + npy)
# ─────────────────────────────────────────────
DATASET_DIR = ROOT / "dataset"
SAMPLES_DIR = DATASET_DIR / "samples"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST_PATH = DATASET_DIR / "manifest.jsonl"


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


def _persist_sign_media():
    with open(SIGN_MEDIA_PATH, "w", encoding="utf-8") as f:
        json.dump(SIGN_MEDIA, f, ensure_ascii=False, indent=2)

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
# The extractions below serve a dynamic vocabulary -- zero-vocabulary signs
# currently get an all-zero placeholder face, because that is the only face a
# user can see during a non-manual rather than a manual sign. Every class the
# active model can emit must therefore be able to be expressed as a single
# 258-dim holistic vector.
SEQ_T = 32
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


def resample_feature_width(seq: np.ndarray, width: int) -> np.ndarray:
    """Re-widen a stored landmark clip to the width the active graph expects.

    Community recordings and the ``dataset_train/*`` pools store the 126-dim
    two-hand vector, so a 258-dim graph cannot be fed one as-is. Only the pose
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
# A WORD_MAP value may be either a single gloss string or a LIST of glosses
# (e.g. pronouns fingerspelled as letters: "তুমি" -> ["Y", "O", "U"]).
# Everything downstream expects a flat list of gloss strings, so normalise once.
def _as_glosses(value):
    if isinstance(value, (list, tuple)):
        return [str(g) for g in value]
    return [str(value)]


_only_key = {}
for _k, _v in WORD_MAP.items():
    _as_glosses(_v)  # keep normalisation in one place
    if isinstance(_v, str):
        _only_key.setdefault(_v, _k)

# label -> Bengali meaning (only unambiguous, single-gloss entries)
WORD_BENGALI = _only_key

_bengali_map = {
    "A": "এ", "B": "বি", "C": "সি", "D": "ডি", "E": "ই",
    "F": "এফ", "G": "জি", "H": "এইচ", "I": "আই", "J": "জে",
    "K": "কে", "L": "এল", "M": "এম", "N": "এন", "O": "ও",
    "P": "পি", "Q": "কিউ", "R": "আর", "S": "এস", "T": "টি",
    "U": "ইউ", "V": "ভি", "W": "ডব্লু", "X": "এক্স", "Y": "ওয়াই", "Z": "জেড",
    "1": "এক", "2": "দুই", "3": "তিন", "4": "চার", "5": "পাঁচ",
    "6": "ছয়", "7": "সাত", "8": "আট", "9": "নয়", "0": "শূন্য",
}

# ─────────────────────────────────────────────
# IN-MEMORY STATE
# ─────────────────────────────────────────────
def _build_catalog():
    catalog = [
        {
            "id": str(i),
            "label": c,
            "bengali_meaning": _bengali_map.get(c, WORD_BENGALI.get(c, "")),
            "category": "ISL Alphabet" if c in _bengali_map else "ISL Word",
            "type": "word",
            "approved_samples": 300,
            "pending_samples": 0,
            "rejected_samples": 0,
            "reference_video_url": None,
            "language": "ISL",
        }
        for i, c in enumerate(ACTIVE_CLASSES)
    ]
    for s in catalog:                       # attach stored reference media
        m = SIGN_MEDIA.get(s["label"])
        s["reference_media"] = m
        if m and m["type"] == "video":
            s["reference_video_url"] = m["url"]
    return catalog


def _coverage_summary():
    """How much of the flat plate can the user actually see?

    ``active_classes`` is what the *model* can recognise. ``with_media`` is what
    the Text->Sign page can *play*. Those two numbers are different, and until
    this function existed the gap was invisible: the UI reported 97 available
    signs while only 2 had a reference image. Anything that quotes a "signs
    available" figure should quote this, not len(ACTIVE_CLASSES).
    """
    total = len(ACTIVE_CLASSES)
    present = [c for c in ACTIVE_CLASSES if c in SIGN_MEDIA]
    return {
        "total_classes": total,
        "with_media": len(present),
        "missing": [c for c in ACTIVE_CLASSES if c not in SIGN_MEDIA],
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
        "reference_coverage": _coverage_summary(),
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
                "motion": round(motion, 5), "spread": round(spread, 5)}

    nmm = detect_nmm(fr)
    return {**best, "ready": True, "buffered": len(sess.buf),
            "frames_used": int(want_t),
            "nmm": nmm, "emotion": nmm.get("emotion"), "metrics": nmm.get("metrics")}


@app.get("/api/coverage")
def coverage():
    """Vocabulary coverage: model classes vs playable reference media.

    Backs the site-wide honesty counter. ``total_classes`` is what the model can
    recognise; ``with_media`` is what Text->Sign can actually play. They are not
    the same number and the UI must not conflate them."""
    summary = _coverage_summary()
    missing = set(summary["missing"])
    return {
        **summary,
        "total_with_media": len(SIGN_MEDIA),
        "by_category": {
            cat: {
                "total": sum(1 for s in sign_catalog if s["category"] == cat),
                "with_media": sum(
                    1 for s in sign_catalog
                    if s["category"] == cat and s["label"] not in missing
                ),
            }
            for cat in sorted({s["category"] for s in sign_catalog})
        },
        "items": [
            {
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "category": s["category"],
                "has_media": s["label"] not in missing,
                "media_type": (SIGN_MEDIA.get(s["label"]) or {}).get("type"),
                "media_url": (SIGN_MEDIA.get(s["label"]) or {}).get("url"),
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
    """Real extracted landmarks for one sign, shaped for the replay canvas.

    The response says which contract it is in ``width``, because the two are not
    interchangeable: a 126-dim recording has hands only, a 258-dim one has hands
    AND pose. The client draws the pose layer only when it is present, rather
    than synthesising a body for a two-hand clip.
    """
    arr = None
    source = ""
    if sample_id:
        rec = next((r for r in _load_manifest() if r["sample_id"] == sample_id), None)
        if rec and (ROOT / rec["landmark_path"]).exists():
            arr = np.load(ROOT / rec["landmark_path"])
            source = f"community:{sample_id}"
    elif label:
        safe = label.upper().replace(" ", "_")
        # The 258-dim daily pool is searched FIRST because those sequences are
        # the ones that carry a pose block worth drawing. The 126-dim pools are
        # the fallback, not the default.
        for p in (ROOT / "dataset_train" / "daily_video" / f"{safe}.npy",
                  ROOT / "dataset_train" / "unified_video" / f"{safe}.npy",
                  ROOT / "dataset_train" / "unified_static" / f"{safe}.npy"):
            if p.exists():
                loaded = np.load(p)
                # daily_video/'unified_video' hold stacks of clips; the static
                # pool holds hold-sequences. In every case a single clip is what
                # the replay wants, so the first axis is index-of-sample for the
                # 3-D pools and index-of-frame for a bare (F, D) recording.
                arr = loaded[0] if (loaded.ndim == 3 or loaded.ndim == 1) else loaded
                source = f"extracted:{p.parent.name}"
                break
        if arr is None:
            rec = next((r for r in _load_manifest()
                        if r["label"].upper() == safe and (ROOT / r["landmark_path"]).exists()), None)
            if rec:
                arr = np.load(ROOT / rec["landmark_path"])
                source = f"community:{rec['sample_id']}"
    if arr is None:
        raise HTTPException(status_code=404, detail="No extracted landmark sequence for this sign yet")

    arr = arr[:64]
    if arr.ndim == 1:                                   # a single frame was stored
        arr = arr[None]

    if arr.shape[-1] == HOLISTIC_DIM:                   # 258 = hands 126 + pose 33x4
        hands = arr[:, :126].reshape(len(arr), 42, 3)
        pose = arr[:, 126:].reshape(len(arr), 33, 4)
        return {"frames": hands.tolist(), "pose": pose.tolist(), "points": 42,
                "count": int(len(arr)), "source": source, "width": HOLISTIC_DIM}

    return {"frames": arr.reshape(len(arr), 42, 3).tolist(), "points": 42,
            "count": int(len(arr)), "source": source, "width": HANDS_DIM}


@app.get("/api/dataset/reference")
def dataset_reference(label: str):
    m = SIGN_MEDIA.get(label) or SIGN_MEDIA.get(label.upper().replace(" ", "_"))
    if not m:
        raise HTTPException(status_code=404, detail="No reference sample for this sign")
    return {"label": label, "type": m["type"], "url": m["url"]}


@app.get("/api/dataset/index")
def dataset_index(label: str = "", kind: str = ""):
    idx = ROOT / "dataset" / "index.jsonl"
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


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    raw = (payload.text.lower()
           .replace("।", " ").replace("?", " ")
           .replace(",", " ").replace("!", " "))
    tokens = raw.split()
    max_n = max((len(k.split()) for k in WORD_MAP), default=1)
    gloss_sequence = []
    i = 0
    while i < len(tokens):
        hit = None
        # longest phrase match first ("good morning", "তোমার নাম কি")
        for n in range(min(max_n, len(tokens) - i), 1, -1):
            phrase = " ".join(tokens[i:i + n])
            if phrase in WORD_MAP:
                hit = WORD_MAP[phrase]
                i += n
                break
        if hit is None:
            w = tokens[i]
            if w in WORD_MAP:
                hit = WORD_MAP[w]
            elif w.upper() in ACTIVE_CLASSES:
                hit = w.upper()
            else:
                hit = f"[{w}]"
            i += 1
        # A value may be a list of glosses (e.g. pronouns fingerspelled as letters)
        gloss_sequence.extend(_as_glosses(hit))
    media = []
    for g in gloss_sequence:
        m = SIGN_MEDIA.get(g)
        media.append({
            "gloss": g,
            "type": m["type"] if m else None,
            "url": m["url"] if m else None,
        })
    return {
        "input_text": payload.text,
        "gloss_sequence": gloss_sequence,
        "available_signs": len(ACTIVE_CLASSES),
        "media": media,
    }


@app.post("/api/text-to-sign/llm")
def text_to_sign_llm(payload: TextToSignRequest):
    """Plan a signable gloss sequence with the LLM instead of the phrase table.

    The dictionary route above is deterministic and free but cannot generalise:
    any word outside WORD_MAP and the model's classes returns as ``[word]``, which
    has no media and cannot be signed. This route asks the model to express the
    sentence using only what the system can actually play.

    503 rather than an empty 200 when the model is unconfigured or unreachable:
    the caller falls back to the dictionary, and "the LLM is unavailable" is a
    different situation from "this sentence has no signs", which the caller must
    be able to tell apart.
    """
    # Both halves matter: ACTIVE_CLASSES is what the recogniser can name, and
    # SIGN_MEDIA is what the player can render. A gloss needs to be in the union
    # to be useful -- recognition-only classes are still worth planning if media
    # exists for them, and vice versa.
    vocab = sorted(set(ACTIVE_CLASSES) | set(SIGN_MEDIA.keys()))
    res = break_into_glosses(payload.text, vocab)

    if not res["gloss_sequence"]:
        raise HTTPException(status_code=503, detail=res.get("status", "llm_unavailable"))

    return {
        "input_text": payload.text,
        "gloss_sequence": res["gloss_sequence"],
        "available_signs": len(ACTIVE_CLASSES),
        "media": [
            {"gloss": g,
             "type": (SIGN_MEDIA.get(g) or {}).get("type"),
             "url": (SIGN_MEDIA.get(g) or {}).get("url")}
            for g in res["gloss_sequence"]
        ],
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
# MEDIA UPLOAD / SERVE / DELETE (admin)
# ─────────────────────────────────────────────
ALLOWED_VIDEO_EXT = {".mp4", ".webm", ".mov"}
ALLOWED_IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}


@app.post("/api/admin/signs/{sign_id}/media")
async def upload_sign_media(sign_id: str, file: UploadFile = File(...)):
    sign = next((s for s in sign_catalog if s["id"] == sign_id), None)
    if sign is None:
        raise HTTPException(status_code=404, detail="Sign not found")
    ext = Path(file.filename or "").suffix.lower()
    if ext in ALLOWED_VIDEO_EXT:
        mtype = "video"
    elif ext in ALLOWED_IMAGE_EXT:
        mtype = "image"
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported type {ext}. Use mp4/webm/mov or png/jpg/webp.",
        )
    old = SIGN_MEDIA.get(sign["label"])
    if old:
        oldp = MEDIA_DIR / old["filename"]
        if oldp.exists():
            oldp.unlink()
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", sign["label"])
    filename = f"{safe}{ext}"
    target_path = MEDIA_DIR / filename
    data = await file.read()
    target_path.write_bytes(data)

    # If it is a video, ensure it is universally playable H.264 (avc1)
    if mtype == "video":
        try:
            cap = cv2.VideoCapture(str(target_path))
            fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fourcc = cv2.VideoWriter_fourcc(*"avc1")
            temp_out = str(target_path) + ".h264.mp4"
            writer = cv2.VideoWriter(temp_out, fourcc, fps, (w, h))
            frame_cnt = 0
            while True:
                ret, fr = cap.read()
                if not ret:
                    break
                writer.write(fr)
                frame_cnt += 1
            cap.release()
            writer.release()
            if frame_cnt > 0 and Path(temp_out).exists() and Path(temp_out).stat().st_size > 0:
                filename = f"{safe}.mp4"
                final_path = MEDIA_DIR / filename
                if target_path.exists() and target_path != final_path:
                    target_path.unlink()
                Path(temp_out).replace(final_path)
        except Exception as exc:
            print(f"[Media Upload] Transcode warning: {exc}")
    SIGN_MEDIA[sign["label"]] = {
        "type": mtype,
        "filename": filename,
        "url": f"/api/media/{filename}",
    }
    _persist_sign_media()
    sign["reference_media"] = SIGN_MEDIA[sign["label"]]
    sign["reference_video_url"] = SIGN_MEDIA[sign["label"]]["url"] if mtype == "video" else None
    return {"success": True, "media": SIGN_MEDIA[sign["label"]]}


@app.get("/api/media/{filename}/frames")
def extract_media_frames(filename: str, max_frames: int = 40):
    """Fallback frame sequence for any video file that browser cannot decode natively."""
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")

    cap = cv2.VideoCapture(str(filepath))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step = max(1, total // max_frames)

    import base64
    frames = []
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % step == 0 and len(frames) < max_frames:
            # Resize thumbnail for ultra-fast canvas flip
            h, w = frame.shape[:2]
            scale = 480 / max(h, 480)
            if scale < 1.0:
                frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
            ok, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            if ok:
                b64 = base64.b64encode(buf.tobytes()).decode("ascii")
                frames.append(f"data:image/jpeg;base64,{b64}")
        idx += 1
    cap.release()

    return {
        "filename": filename,
        "fps": fps / step,
        "count": len(frames),
        "frames": frames,
    }


@app.api_route("/api/media/{filename}", methods=["GET", "HEAD", "OPTIONS"])
def serve_media(filename: str, request: Request):
    """Serve reference video/image with full byte-range support, HEAD inspection, and CORS."""
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")
    mt = {
        ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    }.get(filepath.suffix.lower(), "application/octet-stream")

    size = filepath.stat().st_size
    headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
        "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
    }

    if request.method == "OPTIONS":
        return Response(status_code=204, headers=headers)

    if request.method == "HEAD":
        return Response(
            status_code=200,
            media_type=mt,
            headers={**headers, "Content-Length": str(size)},
        )

    rng = request.headers.get("range")
    if not rng:
        return FileResponse(str(filepath), media_type=mt, headers=headers)

    m = re.match(r"bytes=(\d*)-(\d*)$", rng.strip())
    if not m:
        return FileResponse(str(filepath), media_type=mt, headers=headers)
    start_s, end_s = m.group(1), m.group(2)
    if start_s == "":
        if end_s == "":
            return FileResponse(str(filepath), media_type=mt, headers=headers)
        n = int(end_s)
        start = max(size - n, 0)
        end = size - 1
    else:
        start = int(start_s)
        end = int(end_s) if end_s else size - 1
    end = min(end, size - 1)
    if start > end or start >= size:
        return Response(
            status_code=416,
            headers={**headers, "Content-Range": f"bytes */{size}"},
        )

    length = end - start + 1
    with open(filepath, "rb") as f:
        f.seek(start)
        chunk = f.read(length)
    return Response(
        content=chunk,
        status_code=206,
        media_type=mt,
        headers={
            **headers,
            "Content-Range": f"bytes {start}-{end}/{size}",
            "Content-Length": str(length),
        },
    )


@app.delete("/api/admin/signs/{sign_id}/media")
def delete_sign_media(sign_id: str):
    sign = next((s for s in sign_catalog if s["id"] == sign_id), None)
    if sign is None:
        raise HTTPException(status_code=404, detail="Sign not found")
    old = SIGN_MEDIA.pop(sign["label"], None)
    if old:
        p = MEDIA_DIR / old["filename"]
        if p.exists():
            p.unlink()
    _persist_sign_media()
    sign["reference_media"] = None
    sign["reference_video_url"] = None
    return {"success": True}


# ─────────────────────────────────────────────
# TTS
# ─────────────────────────────────────────────
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    voice_id = str(payload.get("voice", "1"))
    if not text:
        return {"text": "", "audio_url": None, "engine": "none", "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text, voice_id=voice_id)
        result["text"] = text
        return result
    except Exception as e:
        return {
            "text": text,
            "audio_url": None,
            "engine": "none",
            "duration_ms": 0,
            "status": f"tts_error: {str(e)}",
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
    from backend.tts_engine import VOICES
    return {
        "voices": [
            {"id": k, "label": v[0], "engine_voice": v[1]}
            for k, v in VOICES.items()
        ]
    }


# ─────────────────────────────────────────────
# SPEECH TO TEXT (faster-whisper)
# ─────────────────────────────────────────────
# Model handle and language policy live in backend/stt_engine.py; this route is
# only the HTTP shell. ``language`` is the user's explicit choice from the UI
# ("bengali" / "english" / "auto") -- a deliberate pick is a fact the engine
# must obey, not re-decide, so it is forwarded verbatim.
from backend.stt_engine import transcribe_bytes  # noqa: E402


@app.post("/api/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Form(default=""),
):
    try:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty audio recording")
        return transcribe_bytes(data, file.filename or "rec.webm", language)
    except HTTPException:
        raise
    except Exception as exc:
        print(f"[STT Error] {exc}")
        raise HTTPException(status_code=500, detail="Speech-to-text transcription failed") from exc


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
    safe_label = re.sub(r"[^A-Za-z0-9_-]", "_", label)
    sample_id = f"v001_{safe_label}_{signer_id}_{time.strftime('%Y%m%dT%H%M%S')}"
    label_dir = SAMPLES_DIR / safe_label / signer_id
    label_dir.mkdir(parents=True, exist_ok=True)
    npy_path = label_dir / f"{sample_id}.npy"
    np.save(npy_path, arr)

    record = {
        "sample_id": sample_id,
        "session_id": session_id,
        "label": label,
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
    uvicorn.run(app, host="0.0.0.0", port=8000)
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

# Initialize MediaPipe FaceMesh ONCE
_face_mesh = mp.solutions.face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
)

# Initialize ViT Emotion Model ONCE
ROOT = Path(__file__).resolve().parent.parent
VIT_PATH = ROOT / "tests" / "vit_emotion.onnx"
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
    """False when tests/vit_emotion.onnx is not installed; the UI can then say
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
Speech-to-text (faster-whisper) engine + language selection policy.

Why this lives in its own module, not inline in ``main.py``:

``/api/stt`` was a single route that mixed three concerns -- the lazy model
handle, the language-code policy (what "bengali" means to Whisper, which names
are allowed) and the multipart/temp-file mechanics of the HTTP endpoint. Every
one of them needs to change independently: the model may move to GPU, the
policy may gain more languages, and the route must keep working regardless.
Splitting them out keeps the route a thin shell and gives the tests a place to
call the engine without spinning up the app.

Language policy:

Whisper is *explicitly multilingual*, so it can auto-detect Bengali vs English
on its own -- but detection is a guess, and a wrong guess silently transcribes
the wrong language. When the user picks a language in the UI, that choice is a
fact the engine must obey rather than re-decide. The map below normalises the
UI's vocabulary ("bengali", "bangla", "en", ...) onto Whisper's ISO-639-1 codes.

The mapping is STRICT: anything not in LANG_MAP resolves to auto-detect, not to
a best-guess passthrough. A stray two-letter value that Whisper does not know
as a language (or one that maps to an unexpected language, e.g. "hi" slipping
through a typo) must never reach ``model.transcribe`` as an explicit language --
an unknown code raises inside Whisper, and a wrong-but-valid one silently
transcribes the wrong script. Auto remains the fallback, so old clients that
send no field keep working.
"""

import os
import tempfile

_stt_model = None


def get_stt_model():
    """Lazily load the faster-whisper model once on CPU int8."""
    global _stt_model
    if _stt_model is None:
        from faster_whisper import WhisperModel
        print("[WBSL Backend] Initializing faster-whisper small (cpu, int8)...")
        _stt_model = WhisperModel("small", device="cpu", compute_type="int8")
        print("[WBSL Backend] faster-whisper model ready.")
    return _stt_model


# UI vocabulary -> Whisper ISO-639-1. ``None`` means "let Whisper detect".
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
    """Map a user-supplied language choice onto a Whisper language code.

    STRICT: only the values LANG_MAP declares are accepted. Anything else --
    including a plausible two-letter code the map has not listed -- resolves to
    None (auto-detect) rather than being passed to Whisper. A wrong-but-valid
    code reaching ``model.transcribe`` is far worse than a fallback to
    detection: Whisper would transcribe the wrong script with full confidence,
    which is exactly the "asked for Bengali, got Hindi" class of bug this
    module exists to prevent.
    """
    selected = (raw or "").strip().lower()
    return LANG_MAP.get(selected)


def transcribe_file(path: str, language: str | None = None) -> dict:
    """Transcribe one audio file on disk. Returns text + language info.

    Raises on engine failure; the HTTP layer decides what status that becomes.
    """
    whisper_lang = resolve_language(language)
    model = get_stt_model()

    # Pipeline trace. Bengali-reported-as-Hindi bugs are almost always one of:
    # the client never sending the field, the route dropping it, a lax mapping
    # passing a wrong code, or the model decoding the wrong script. These four
    # lines separate them at a glance in the server log.
    print(f"[STT] Requested language: {language!r}")
    print(f"[STT] Resolved language: {whisper_lang!r}")

    segments, info = model.transcribe(
        path,
        language=whisper_lang,
        # Explicit transcription mode. faster-whisper's default task IS
        # "transcribe", but pinning it here rules out any future default drift
        # or accidental "translate" leaking into the pipeline: this system must
        # reproduce what was said, never translate it.
        task="transcribe",
        beam_size=5,
        vad_filter=True,
    )

    print(f"[STT] Whisper language: {info.language!r}")
    print(f"[STT] Language probability: {info.language_probability}")

    text = " ".join(segment.text.strip() for segment in segments).strip()
    return {
        "text": text,
        "language": info.language,
        "language_probability": (
            round(float(info.language_probability), 4)
            if info.language_probability is not None else 0.0
        ),
        "selected_mode": whisper_lang or "auto",
    }


def transcribe_bytes(data: bytes, filename: str = "rec.webm",
                     language: str | None = None) -> dict:
    """Convenience wrapper: temp-file + cleanup around :func:`transcribe_file`."""
    suffix = os.path.splitext(filename or "rec.webm")[1] or ".webm"
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(data)
            temp_path = temp.name
        return transcribe_file(temp_path, language)
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
Dual-engine Bengali TTS from MVT 4.3.
edge-tts (online primary) → BanglaTTS (offline fallback).
Supports male / female voice selection via voice_id.
"""

import asyncio
import re
from pathlib import Path

TTS_DIR = Path(__file__).resolve().parent / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

# voice_id -> (label, edge-tts voice)
VOICES = {
    "1": ("Female", "bn-BD-NabanitaNeural"),
    "2": ("Male", "bn-BD-PradeepNeural"),
}

# voice_id -> BanglaTTS offline voice
BANGLATTS_VOICE = {
    "1": "female",
    "2": "male",
}


def speak(text: str, output_name: str = "bengali_speech", voice_id: str = "1") -> dict:
    """
    Generate Bengali speech with the selected voice.
    Returns dict with audio_url, engine, duration_ms, voice.
    """
    label, edge_voice = VOICES.get(str(voice_id), VOICES["1"])
    # Separate file per voice so switching never serves stale audio
    out_name = f"{output_name}_v{voice_id}"
    output_base = str(TTS_DIR / out_name)

    # --- edge-tts (online, best quality) ---
    try:
        import edge_tts

        async def _generate():
            communicate = edge_tts.Communicate(text, edge_voice)
            await communicate.save(output_base + ".mp3")

        asyncio.run(_generate())
        audio_path = output_base + ".mp3"

        duration_ms = 0
        try:
            from mutagen.mp3 import MP3
            audio = MP3(audio_path)
            duration_ms = int(audio.info.length * 1000)
        except Exception:
            duration_ms = len(text.split()) * 604

        return {
            "audio_url": f"/api/tts/audio/{out_name}.mp3",
            "engine": "edge-tts",
            "duration_ms": duration_ms,
            "voice": label,
            "voice_id": str(voice_id),
            "status": "success",
        }
    except Exception as e:
        print(f"edge-tts failed: {e}")

    # --- BanglaTTS (offline fallback) ---
    try:
        from banglatts import BanglaTTS

        clean = re.sub(r'[,.|!?;:"\'()—-।]', ' ', text)
        clean = re.sub(r'\s+', ' ', clean).strip()

        tts = BanglaTTS()
        path = tts(
            clean,
            voice=BANGLATTS_VOICE.get(str(voice_id), "female"),
            filename=output_base + ".wav",
        )

        duration_ms = 0
        try:
            from mutagen import File as AudioFile
            audio = AudioFile(path)
            duration_ms = int(audio.info.length * 1000)
        except Exception:
            duration_ms = len(text.split()) * 453

        return {
            "audio_url": f"/api/tts/audio/{out_name}.wav",
            "engine": "banglatts",
            "duration_ms": duration_ms,
            "voice": label,
            "voice_id": str(voice_id),
            "status": "success",
        }
    except Exception as e:
        print(f"BanglaTTS also failed: {e}")
        return {
            "audio_url": None,
            "engine": "none",
            "duration_ms": 0,
            "voice": label,
            "voice_id": str(voice_id),
            "status": "tts_unavailable",
        }
```

---

# FILE: `dataset_train\unified_report.json`

```json
{
 "classes": 98,
 "static": 36,
 "video": 62,
 "best_val_acc": 95.97701149425288,
 "seq_len": 32,
 "feat": 126
}
```

---

# FILE: `dataset_train\video_report.json`

```json
{
 "classes": 62,
 "static": 0,
 "video": 62,
 "best_val_acc": 98.01084990958408,
 "seq_len": 32,
 "feat": 126
}
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

# FILE: `frontend\next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
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
    "zod": "^3.25.76",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
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
      focus: "WBSL sign recording coordination, dataset annotation, NMM tagging, landmark data quality review",
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
      color: "text-accent-primary",
      desc: "258-dim holistic vector (hands+pose) or 126-dim two-hand vector, right-wrist normalized, MLP/LSTM → ONNX, sub-5ms inference",
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
      color: "text-status-pending",
      desc: "gemma-4-E4B, 50-criteria constrained prompt, preserves question/negation/WHETHER/IF-THEN scope",
    },
    {
      id: "tts",
      icon: Volume2,
      label: "TTS",
      color: "text-status-pending",
      desc: "edge-tts (online, ~604 ms/word) → BanglaTTS (offline, ~453 ms/word) automatic fallback",
    },
  ];

  const techStack = [
    { category: "Vision", items: "MediaPipe Holistic 0.10.14 · OpenCV · ViT-ONNX (trpakov/vit-face-expression)" },
    { category: "ML", items: "PyTorch · ONNX Runtime · MLP (static) · LSTM (temporal) · 258-dim holistic (hands+pose) active contract (126-dim fallback)" },
    { category: "LLM", items: "gemma-4-E4B-it-Q4_K_M (deployment) · gemma-4-12b-it-Q4_0 (reference) · KoboldCpp" },
    { category: "TTS", items: "edge-tts (bn-BD-NabanitaNeural) · BanglaTTS (silero) · mutagen" },
    { category: "Frontend", items: "Next.js 14 · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts" },
    { category: "Backend", items: "FastAPI · WebSocket · Python 3.11 · Single venv deployment" },
  ];

  const gaps = [
    { id: "G4", label: "WBSL Regional Focus", status: "OPEN — VERIFIED", detail: "Zero AI/ML/DL projects exist for WBSL. Only resource: 170 Wikisigns entries" },
    { id: "G15", label: "WBSL ≠ ISL ≠ BdSL", status: "OPEN — VERIFIED", detail: "Johnson & Johnson (2016) proved linguistic distinctness. All tech targets Bangladesh" },
    { id: "G6", label: "WBSL → Bengali Translation", status: "OPEN", detail: "No system produces grammatically correct Bengali from signs" },
    { id: "G7", label: "Constrained LLM Integration", status: "OPEN", detail: "No sign language system uses LLM with anti-hallucination constraints" },
    { id: "G10", label: "Bidirectional Communication", status: "OPEN", detail: "Google SL2T is forward-only. Reverse path not deployed anywhere" },
    { id: "G13", label: "Low-Resource Transfer", status: "OPEN", detail: "Google uses 100,000+ hours. WBSL has near-zero. What works without scale?" },
  ];

  return (
    <PageContainer className="max-w-5xl py-16 space-y-20">
      {/* ─── HERO ─── */}
      <header className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent-primary">
          <BookOpen size={14} />
          <span>Academic Research Project · CSE · 7th Semester · 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          WBSL Bridge
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
          Intent-aware bidirectional sign language communication for the Deaf community of West Bengal
          with unknown sign handling and community-driven growth.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {["WBSL → Bengali", "Bengali → WBSL", "Unknown Sign Honesty", "Privacy-First", "CPU-Only", "Offline-Capable"].map((tag) => (
            <span key={tag} className="px-3 py-1 text-xs font-mono rounded-md bg-surface-elevated border border-border text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* ─── THE PROBLEM ─── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-status-error" />
          <h2 className="text-2xl font-bold text-text-primary">The Verified Technological Void</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          West Bengal Sign Language (WBSL) has been linguistically proven distinct from both Delhi ISL
          and Bangladesh BdSL (Johnson &amp; Johnson, 2016, <em>Sign Language Studies</em>, 16(4)).
          Despite this, an exhaustive search confirmed:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            "ZERO AI/ML/DL projects for WBSL",
            "ZERO WBSL video datasets",
            "ZERO WBSL recognition systems",
            "ZERO WBSL → Bengali translators",
            "ZERO projects from WB universities",
            "Only resource: 170 Wikisigns entries",
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
            and targets Bangladesh BdSL — a linguistically separate sign language — not the WBSL used by
            the Deaf community in West Bengal, India.
          </p>
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
            { title: "Landmark-Based Signer Independence", desc: "126-dim normalized vector removes skin color, background, lighting bias. 99.9% val accuracy." },
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
          targets 10–15 recordings per WBSL-specific sign from 3–5 signers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Model A", desc: "WBSL only (baseline)" },
            { label: "Model B", desc: "ISL pre-train → WBSL fine-tune" },
            { label: "Model C", desc: "ISL + WBSL mixed training" },
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

      {/* ─── UNKNOWN SIGN HANDLING ─── */}
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

      {/* ─── PROJECT TEAM ─── */}
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
          specific sign language with Bengali-language output, budget-device deployment, and bidirectional
          communication — none of which currently exists.
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

const API_BASE = "http://localhost:8000";

export default function AdminContributionsPage() {
  const { data: contributions, isLoading, refetch } = useQuery({
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
                ) : contributions?.map((item) => (
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
                ))}
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

# FILE: `frontend\src\app\admin\dataset\[signId]\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { datasetService } from "@/services/dataset";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Video, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function AdminSignDetailPage() {
  const params = useParams();
  const signId = params.signId as string;

  const { data: sign, isLoading } = useQuery({
    queryKey: ["sign-detail", signId],
    queryFn: () => datasetService.getSignById(signId),
  });

  // Real extracted landmark sequence for this sign (no synthetic fallback).
  // A 258-dim run also returns `pose`, which the canvas draws as the violet
  // body layer; a 126-dim recording leaves it undefined.
  const { data: sim } = useQuery({
    queryKey: ["sim-frames", sign?.label],
    queryFn: async () =>
      (await axios.get(`${API_BASE}/api/simulation/frames`, { params: { label: sign!.label } })).data,
    enabled: !!sign,
    retry: false,
  });

  if (isLoading || !sign) {
    return (
      <div className="py-12 text-center text-xs font-mono text-text-muted">
        Loading sign details...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/dataset"
        className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        <span>Back to Dataset Explorer</span>
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-accent-primary">WBSL SIGN LEXICON</div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mt-1">
            {sign.label}
          </h1>
          <div className="bengali-text text-xl text-text-secondary mt-1">
            {sign.bengali_meaning}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/contribute`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90"
          >
            <Video size={14} />
            <span>Contribute Sample</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Approved Samples</div>
          <div className="text-xl font-bold text-status-approved mt-1">{sign.approved_samples}</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Category</div>
          <div className="text-xl font-bold text-text-primary mt-1">{sign.category}</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Language Dialect</div>
          <div className="text-xl font-bold text-accent-secondary mt-1">{sign.language}</div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase text-text-muted">
          Canonical Landmark Coordinate Reference
        </div>
        <LandmarkSimulation frames={sim?.frames} pose={sim?.pose} fps={15} title={sim?.source} />
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\dataset\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { datasetService } from "@/services/dataset";
import { statsService, DatasetStats } from "@/services/stats";
import { TableRowSkeleton, SignCardSkeleton } from "@/components/skeletons";
import { Search, LayoutGrid, Table as TableIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * The public /dataset explorer now lives here.
 *
 * Dataset browsing is a curator/researcher activity -- the public portal links
 * to it only from the footer -- so it is owned by the Admin Console, which is
 * where the rest of the dataset tooling (catalog, media, contributions) sits.
 */
export default function AdminDatasetPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats } = useQuery<DatasetStats>({
    queryKey: ["dataset-stats"],
    queryFn: () => statsService.getDatasetStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["signs", page, search, category, language],
    queryFn: () =>
      datasetService.getSigns({
        page,
        limit: 10,
        search: search || undefined,
        category: category || undefined,
        language: language || undefined,
      }),
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">DATASET EXPLORER</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Sign Lexicon & Dataset Browser
        </h1>
      </div>

      {/* Top Bar Stats — fetched from backend */}
      <div className="p-4 rounded-lg bg-surface border border-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-text-secondary">
          <span>Total Signs: <strong className="text-text-primary">{stats?.total_signs ?? "—"}</strong></span>
          <span>Approved Samples: <strong className="text-status-approved">{stats?.total_approved_samples ?? "—"}</strong></span>
          <span>Languages: <strong className="text-text-primary">{stats?.languages?.join(", ") ?? "—"}</strong></span>
          <span>Version: <strong className="text-accent-primary">{stats?.dataset_version ?? "—"}</strong></span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-surface-elevated p-1 rounded border border-border">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table" ? "bg-surface text-accent-primary" : "text-text-muted hover:text-text-primary"
            }`}
            title="Table View"
          >
            <TableIcon size={14} />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "grid" ? "bg-surface text-accent-primary" : "text-text-muted hover:text-text-primary"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search signs by English label or Bengali meaning..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded text-text-primary text-sm focus:outline-none focus:border-accent-primary"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent-primary"
        >
          <option value="">All Categories</option>
          {stats?.categories?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setPage(1);
          }}
          className="bg-surface border border-border rounded px-3 py-2 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent-primary"
        >
          <option value="">All Dialects</option>
          {stats?.languages?.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      {viewMode === "table" ? (
        <div className="bg-surface border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4">Sign Gloss</th>
                <th className="py-3 px-4">Bengali Meaning</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4 text-center">Approved Samples</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={7} />
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    No signs matched your search filters.
                  </td>
                </tr>
              ) : (
                data?.items.map((sign) => (
                  <tr key={sign.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-text-primary">{sign.label}</td>
                    <td className="py-3 px-4 font-bengali text-sm text-text-primary">{sign.bengali_meaning}</td>
                    <td className="py-3 px-4 text-text-secondary">{sign.category}</td>
                    <td className="py-3 px-4 text-text-secondary">{sign.language}</td>
                    <td className="py-3 px-4 text-center text-accent-primary font-bold">{sign.approved_samples}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-status-approved/10 text-status-approved text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/dataset/${sign.id}`}
                        className="inline-flex items-center space-x-1 text-accent-primary hover:underline"
                      >
                        <span>Details</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SignCardSkeleton key={i} />)
          ) : data?.items.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs font-mono text-text-muted">
              No signs matched your search query.
            </div>
          ) : (
            data?.items.map((sign) => (
              <div
                key={sign.id}
                className="bg-surface border border-border p-4 rounded-md flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-sm font-bold text-text-primary">{sign.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary">
                      {sign.language}
                    </span>
                  </div>
                  <div className="font-bengali text-base text-text-secondary mt-1">{sign.bengali_meaning}</div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-text-muted">Samples: <strong className="text-accent-primary">{sign.approved_samples}</strong></span>
                  <Link
                    href={`/admin/dataset/${sign.id}`}
                    className="text-accent-primary hover:underline flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border font-mono text-xs text-text-secondary">
          <div>
            Showing Page <strong>{data.page}</strong> of <strong>{data.total_pages}</strong> ({data.total} signs)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded bg-surface border border-border disabled:opacity-30 hover:bg-surface-elevated"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
              disabled={page >= data.total_pages}
              className="p-1.5 rounded bg-surface border border-border disabled:opacity-30 hover:bg-surface-elevated"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
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

const API_BASE = "http://localhost:8000";

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
import { CheckSquare, Database, BookOpen, ArrowUpRight } from "lucide-react";
import { statsService, AdminStats } from "@/services/stats";

export default function AdminDashboardPage() {
  const { data: stats } = useQuery<AdminStats>({
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

        <Link
          href="/admin/signs"
          className="p-6 rounded-lg bg-surface border border-border hover:border-text-primary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-surface-elevated text-text-primary flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Signs & Reference Media</h3>
            <p className="text-xs text-text-secondary mt-1">
              Attach or replace the reference video and image for each catalog sign.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-text-primary font-bold">
            <span>Manage Media</span>
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
const API_BASE = "http://localhost:8000";

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
    ["API PORT", "8000"],
    ["ACTIVE MODEL", `${health?.active_model ?? "—"} (${health?.model_run ?? "—"})`],
    ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? "—"}-dim · ${health?.contract?.frames ?? 1} frames`],
    ["CLASSES", String(health?.active_classes ?? 0)],
    ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
    ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
    ["REFERENCE COVERAGE", `${health?.reference_coverage?.with_media ?? 0}/${health?.reference_coverage?.total_classes ?? 0}`],
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

# FILE: `frontend\src\app\admin\signs\page.tsx`

```tsx
"use client";
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { datasetService } from "@/services/dataset";
import { contributionService } from "@/services/contributions";
import { TableRowSkeleton } from "@/components/skeletons";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Upload, Trash2, Film, Image as ImageIcon, Play } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8000";

export default function AdminSignsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-signs"],
    queryFn: () => datasetService.getSigns({ limit: 100 }),
  });
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /**
   * At most ONE preview may play at a time.
   *
   * The table used to render a looping <video autoPlay> per row. With 100 rows
   * that is 100 simultaneous decoders plus 100 HTTP streams, which stalls the
   * page and can wedge the backend. A preview is now opt-in: rows show a poster
   * and only the single `playingId` row mounts a video element at all.
   */
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleUpload = async (signId: string, label: string, file: File) => {
    setUploading(signId);
    try {
      await contributionService.uploadSignMedia(signId, file);
      toast.success(`Reference media attached to ${label}`);
      setPlayingId(null);
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["signs"] });
    } catch (e: any) {
      toast.error(e?.detail || "Upload failed (check file type)");
    } finally {
      setUploading(null);
      if (fileRefs.current[signId]) fileRefs.current[signId]!.value = "";
    }
  };

  const handleDelete = async (signId: string, label: string) => {
    try {
      await contributionService.deleteSignMedia(signId);
      toast.success(`Reference media removed from ${label}`);
      if (playingId === signId) setPlayingId(null);
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["signs"] });
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">SIGN CATALOG MANAGEMENT</div>
        <h1 className="text-2xl font-bold text-text-primary mt-1">Signs & Reference Media</h1>
        <p className="text-xs text-text-secondary mt-1">
          Attach one reference video (mp4/webm) or image (png/jpg) per sign. These play in Text → Sign sequential playback.
          Previews load on demand — click a video thumbnail to play it.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4">Preview</th>
              <th className="py-3 px-4">Sign</th>
              <th className="py-3 px-4">Bengali</th>
              <th className="py-3 px-4">Media Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} columns={5} />)
            ) : (
              data?.items.map((sign) => {
                const media = (sign as any).reference_media as { type: string; url: string } | null;
                return (
                  <tr key={sign.id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="py-3 px-4">
                      {media?.type === "video" && playingId === sign.id ? (
                        <VideoPlayer
                          src={`${API_BASE}${media.url}`}
                          muted loop autoPlay
                          onEnded={() => setPlayingId(null)}
                          className="h-16 w-28 rounded border border-border overflow-hidden"
                        />
                      ) : media?.type === "video" ? (
                        <button
                          type="button"
                          onClick={() => setPlayingId(sign.id)}
                          title="Play preview"
                          className="group relative h-16 w-28 rounded border border-border overflow-hidden bg-black flex items-center justify-center"
                        >
                          <Film size={18} className="text-text-muted" />

                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={16} className="text-white" />
                          </span>
                        </button>
                      ) : media?.type === "image" ? (
                        <img
                          src={`${API_BASE}${media.url}`}
                          alt={sign.label}
                          className="h-16 w-28 object-cover rounded border border-border"
                        />
                      ) : (
                        <div className="h-16 w-28 rounded border border-border bg-background flex items-center justify-center text-text-muted">
                          —
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-text-primary">{sign.label}</td>
                    <td className="py-3 px-4 font-bengali text-sm text-text-secondary">{sign.bengali_meaning}</td>
                    <td className="py-3 px-4">
                      {media ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${media.type === "video" ? "bg-accent-secondary/15 text-accent-secondary" : "bg-accent-primary/15 text-accent-primary"}`}>
                          {media.type === "video" ? <Film size={11} /> : <ImageIcon size={11} />}
                          {media.type.toUpperCase()} ATTACHED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-pending/15 text-status-pending">NO MEDIA</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,image/png,image/jpeg,image/webp"
                          className="hidden"
                          ref={(el) => { fileRefs.current[sign.id] = el; }}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(sign.id, sign.label, f);
                          }}
                        />
                        <button
                          disabled={uploading === sign.id}
                          onClick={() => fileRefs.current[sign.id]?.click()}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-accent-primary text-black text-[11px] font-bold hover:bg-accent-primary/90 disabled:opacity-50 transition-colors"
                        >
                          <Upload size={12} />
                          {uploading === sign.id ? "UPLOADING..." : "UPLOAD"}
                        </button>
                        {media && (
                          <button
                            onClick={() => handleDelete(sign.id, sign.label)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-surface-elevated border border-border text-text-secondary hover:text-status-error text-[11px] font-bold transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
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
import { VideoPlayer } from "@/components/media/VideoPlayer";
const API_BASE = "http://localhost:8000";

interface CoverageItem {
  label: string;
  media_type: "video" | "image" | null;
  media_url: string | null;
}

/**
 * Reference video review.
 *
 * Reads /api/coverage, which is the only endpoint that knows which classes
 * actually have reference media attached -- the model's class list and the
 * media library are different sets, and this page exists to show the gap.
 */
export default function AdminVideosPage() {
  const { data } = useQuery({
    queryKey: ["coverage"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/coverage`)).data,
  });

  const videos: CoverageItem[] = (data?.items ?? []).filter(
    (i: CoverageItem) => i.media_type === "video"
  );

  const [active, setActive] = React.useState<string | null>(null);
  const current = videos.find((v) => v.label === active) ?? videos[0];

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="text-xs font-mono uppercase text-text-muted">VIDEO INSPECTOR</div>
      <h1 className="text-2xl font-bold text-text-primary">Reference Video Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <div className="bg-surface border border-border rounded-lg overflow-y-auto max-h-[560px]">
          {videos.map((v) => (
            <button
              key={v.label}
              onClick={() => setActive(v.label)}
              className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-border ${
                current?.label === v.label
                  ? "bg-accent-primary/10 text-accent-primary"
                  : "text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {v.label}
            </button>
          ))}

          {videos.length === 0 && (
            <div className="p-4 text-xs font-mono text-text-muted">
              No reference videos registered.
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          {current?.media_url ? (
            <>
              <VideoPlayer
                src={`${API_BASE}${current.media_url}`}
                muted
                loop
                className="aspect-video w-full rounded border border-border"
              />
              <div className="mt-3 text-[10px] font-mono text-text-muted">
                {current.label}
              </div>
            </>
          ) : (
            <div className="aspect-video flex items-center justify-center text-xs font-mono text-text-muted">
              Select a video
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

const API_BASE = "http://localhost:8000";

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
import { useCamera } from "@/hooks/useCamera";
import { useRecording } from "@/hooks/useRecording";
import { useRecordingStore } from "@/store/recording-store";
import { contributionService } from "@/services/contributions";
import { Video, Square, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

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
  const [refMedia, setRefMedia] = useState<{ type: string; url: string } | null>(null);

  useEffect(() => {
    if (consentGiven && !isReady) {
      startCamera();
    }
  }, [consentGiven, isReady, startCamera]);

  // A sign chosen on /contribute lands in SIGN_SELECTED — advance into the
  // reference step so the signer can watch the real sample before recording.
  useEffect(() => {
    if (consentGiven && state === "SIGN_SELECTED") setState("REFERENCE_VIEW");
  }, [consentGiven, state, setState]);

  // Real reference sample for the sign being collected (404 -> honest empty state).
  useEffect(() => {
    if (!currentSignLabel) return;
    axios.get(`${API_BASE}/api/dataset/reference`, { params: { label: currentSignLabel } })
      .then((r) => setRefMedia(r.data))
      .catch(() => setRefMedia(null));
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
            setState("READY_TO_RECORD");
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

      {/* Watch & copy the real reference sample before recording */}
      {state === "REFERENCE_VIEW" && (
        <div className="p-4 bg-surface rounded-lg border border-border space-y-3">
          <div className="text-xs font-mono uppercase text-text-muted">
            REFERENCE SAMPLE — watch it, then copy the sign
          </div>
          {refMedia?.type === "video" ? (
            <video
              src={`${API_BASE}${refMedia.url}`}
              controls
              loop
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-contain rounded border border-border bg-background"
            />
          ) : refMedia?.type === "image" ? (
            <img
              src={`${API_BASE}${refMedia.url}`}
              alt={currentSignLabel || "reference"}
              className="w-full aspect-video object-contain rounded border border-border bg-background"
            />
          ) : (
            <div className="aspect-video w-full bg-background border border-border rounded flex items-center justify-center text-xs font-mono text-text-muted">
              No reference sample yet — record the first one
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
import { Navbar } from "@/components/layout/Navbar";

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
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
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
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

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
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");
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
    with_media: number;
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

        if (typeof res.data.active_classes === "number") {
          setActiveClasses(res.data.active_classes);
        }

        if (res.data.contract) {
          setContract(res.data.contract);
        }

        if (res.data.reference_coverage) {
          setCoverage(res.data.reference_coverage);
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
        let tok = h.gloss;

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
      const res = await axios.post(
        `${API_BASE}/api/tts/generate`,
        {
          text,
          voice: voiceId,
        }
      );

      if (res.data.audio_url) {
        const audio = new Audio(
          `${API_BASE}${res.data.audio_url}`
        );

        audio.onended = () =>
          setIsPlayingAudio(false);

        audio.onerror = () =>
          setIsPlayingAudio(false);

        await audio.play();

        return;
      }
    } catch {
      // Fall through to browser speech.
    }

    if ("speechSynthesis" in window) {
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

    if (!data.ready || !label) {
      setLive(null);
      candidateRef.current = null;
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

    const emo = (data.nmm?.emotion ?? null) as EmotionResult | null;

    if (emo) setEmotion(emo);

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

    if (isBackground || !decisive) {
      candidateRef.current = null;
      return;
    }

    const cand = candidateRef.current;
    const count = cand && cand.label === label ? cand.count + 1 : 1;

    candidateRef.current = { label, count };

    if (count < Math.max(1, Math.round(T.stable_windows))) return;

    const now = Date.now();
    const last = lastAppendRef.current;

    if (last.label === label && now - last.at < T.repeat_cooldown_ms) {
      // Swallowing this silently makes the UI look dead while the model is
      // actually recognising the sign again. Surface it instead.
      setRepeatBlocked(true);
      setTimeout(() => setRepeatBlocked(false), 1200);
      return;
    }

    lastAppendRef.current = { label, at: now };
    candidateRef.current = null;

    // "Clear" is the one thing that resets the server's window: the model would
    // otherwise keep reading the previous signer state after the user wiped the
    // sequence and started over.
    if (autoDetect) appendGloss(label, { gloss: label, ...nn });
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
    <PageContainer className="w-full max-w-[1400px] mx-auto px-4 sm:px-5 lg:px-6 py-4 lg:py-5 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/70 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider shrink-0">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline
                  ? "bg-accent-primary animate-pulse"
                  : "bg-status-error"
              }`}
            />

            <span
              className={
                backendOnline
                  ? "text-accent-primary"
                  : "text-status-error"
              }
            >
              {backendOnline
                ? "ONLINE"
                : "OFFLINE"}
            </span>
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary truncate">
            Sign{" "}
            <span className="text-accent-primary">
              →
            </span>{" "}
            Bengali
          </h1>

          {isTemporal && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded border border-accent-primary/40 bg-accent-primary/10 text-[9px] font-mono text-accent-primary uppercase">
              <Activity size={10} />
              Temporal
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
            <span className="text-text-muted">
              MODEL{" "}
            </span>
            <span className="text-text-primary font-bold">
              {unifiedActive
                ? "LSTM"
                : "MLP"}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
            <span className="text-text-muted">
              CLS{" "}
            </span>
            <span className="text-accent-primary font-bold">
              {activeClasses}
            </span>
          </div>

          {coverage && (
            <div className="px-2.5 py-1 rounded bg-surface border border-border text-[9px] font-mono">
              <span className="text-text-muted">
                MEDIA{" "}
              </span>
              <span
                className={
                  coverage.with_media ===
                  coverage.total_classes
                    ? "text-accent-primary font-bold"
                    : "text-status-warning font-bold"
                }
              >
                {coverage.with_media}/
                {coverage.total_classes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* OFFLINE */}
      {!backendOnline && (
        <div className="mt-3 p-2.5 rounded-lg bg-status-error/10 border border-status-error/30 text-[10px] font-mono text-status-error">
          Backend is not running. Start:
          {" "}
          <code className="bg-surface px-1 rounded">
            uvicorn backend.main:app --reload --port 8000
          </code>
        </div>
      )}

      {/* MAIN DESKTOP WORKSPACE */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.02fr_0.78fr_1.18fr] gap-4 lg:items-stretch min-w-0">
        {/* LEFT: CAMERA + AFFECT */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary flex items-center gap-2 shrink-0">
            <Camera size={12} className="text-accent-primary" />
            Camera
          </div>

          {/* CAMERA */}
          <div className="relative w-full aspect-[16/10] lg:aspect-auto lg:h-[285px] bg-black rounded-xl overflow-hidden border border-border/80 shadow-lg flex items-center justify-center shrink-0">
            <canvas
              ref={canvasRef}
              className="hidden"
            />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive
                  ? ""
                  : "hidden"
              }`}
            />

            {!cameraActive &&
              cameraError && (
                <div className="absolute inset-0 bg-surface flex items-center justify-center p-4">
                  <div className="text-center space-y-2 max-w-xs">
                    <CameraOff
                      size={24}
                      className="mx-auto text-status-error"
                    />

                    <p className="text-[11px] font-semibold text-text-primary">
                      Camera unavailable
                    </p>

                    <p className="text-[10px] text-text-secondary">
                      {cameraError}
                    </p>

                    <button
                      onClick={
                        startCamera
                      }
                      className="px-3 py-1.5 rounded bg-accent-primary text-black text-[10px] font-mono font-semibold"
                    >
                      Request Permissions
                    </button>
                  </div>
                </div>
              )}

            {!cameraActive &&
              !cameraError && (
                <div className="absolute inset-0 bg-surface flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Camera
                      size={28}
                      className="mx-auto text-text-muted"
                    />

                    <button
                      onClick={
                        startCamera
                      }
                      disabled={
                        !backendOnline
                      }
                      className="px-5 py-2 rounded bg-accent-primary text-black font-mono text-[10px] uppercase font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
                    >
                      Start Camera
                    </button>
                  </div>
                </div>
              )}

            {isProcessing &&
              cameraActive && (
                <div className="absolute top-2 right-2 bg-surface/90 border border-border px-2 py-1 rounded text-[9px] font-mono text-status-pending">
                  PROCESSING...
                </div>
              )}
          </div>

          {/* CAMERA STATUS */}
          <div className="h-9 flex items-center justify-between px-3 rounded-lg bg-surface/60 border border-border/80 shrink-0">
            <span className="flex items-center gap-2 text-[9px] font-mono text-text-secondary">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  cameraActive
                    ? "bg-accent-primary animate-pulse"
                    : "bg-text-muted"
                }`}
              />

              {cameraActive
                ? isTemporal
                  ? streamUnavailable
                    ? "BATCH FALLBACK · POLLING"
                    : `${buffered}/${contract.frames * 6} BUFFER · LIVE`
                  : "POLLING 1S"
                : "CAMERA OFF"}
            </span>

            {cameraActive && (
              <button
                onClick={stopCamera}
                className="px-2 py-1 rounded bg-status-error/10 border border-status-error/30 text-status-error text-[9px] font-mono"
              >
                STOP
              </button>
            )}
          </div>

          {/* AFFECT */}
          <div className="min-h-0 flex-1 rounded-xl border border-border/80 bg-surface/60 overflow-hidden">
            <EmotionPanel emotion={emotion} offline={!emotionAvailable} />
          </div>
        </div>

          {/* MIDDLE: RECOGNITION */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary flex items-center gap-2">
              <Sparkles
                size={12}
                className="text-accent-primary"
              />
              Recognition
            </div>

            {/* Opens the NMM Controller modal. It lives here rather than as an
                inline block because ten sliders plus five marker switches and
                their explanations occupied a third of the column permanently,
                pushing the actual recognition output off-screen. */}
            <NmmThresholdPanel
              values={thresholds}
              onChange={setThresholds}
              gates={markerGates}
              onGatesChange={setMarkerGates}
              variant="header"
            />
          </div>

          {/* RECOGNITION RESULT */}
          <div className="h-[150px] rounded-xl border border-border/80 bg-surface/60 p-3.5 flex flex-col min-h-0">
            {live && (
              <div className="mb-2 flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-background border border-border">
                <span className="text-[8px] font-mono uppercase text-text-muted">
                  {repeatBlocked
                    ? "COOLDOWN"
                    : "HOLDING"}
                </span>

                <span className="text-[9px] font-mono text-accent-secondary truncate">
                  {live.label} ·{" "}
                  {Math.round(
                    live.confidence * 100
                  )}
                  %
                </span>
              </div>
            )}

            {prediction ? (
              prediction.detected ? (
                <div className="space-y-2 min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold font-mono text-accent-primary truncate">
                      {prediction.label}
                    </span>

                    <span className="text-xs font-mono text-text-secondary shrink-0">
                      {Math.round(
                        prediction.confidence *
                          100
                      )}
                      %
                    </span>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-border">
                    {prediction.top5
                      .slice(0, 5)
                      .map(
                        (
                          item,
                          idx
                        ) => (
                          <div
                            key={idx}
                            className="flex justify-between text-[9px] font-mono"
                          >
                            <span
                              className={
                                idx === 0
                                  ? "text-text-primary font-semibold"
                                  : "text-text-muted"
                              }
                            >
                              {
                                item.label
                              }
                            </span>

                            <span
                              className={
                                idx === 0
                                  ? "text-accent-primary"
                                  : "text-text-muted"
                              }
                            >
                              {Math.round(
                                item.confidence *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-text-muted">
                    NO HAND DETECTED
                  </span>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[9px] font-mono text-text-muted">
                  WAITING
                </span>
              </div>
            )}
          </div>

          {/* AUTO DETECT */}
          {isTemporal && (
            <label className="h-10 flex items-center justify-between px-3 rounded-lg bg-surface/60 border border-border cursor-pointer shrink-0">
              <span className="text-[9px] font-mono text-text-secondary">
                Auto-append
              </span>

              <input
                type="checkbox"
                checked={autoDetect}
                onChange={(e) =>
                  setAutoDetect(
                    e.target.checked
                  )
                }
                className="w-3.5 h-3.5 accent-[var(--accent-primary)]"
              />
            </label>
          )}

          {/* NMM → LLM CONTEXT SPACER */}
          <div className="flex-1 min-h-0 rounded-xl border border-border/50 bg-surface/20 p-3 hidden lg:flex flex-col justify-end gap-1">
            <div className="text-[8px] font-mono text-text-muted">
              {isTemporal
                ? `${contract.frames}-frame temporal recognition`
                : "Static frame recognition"}
              {/* The feature width is not a detail the user can ignore: a
                  258-dim run needs the signer's body in frame, because half its
                  input is the pose block. Naming it here is what makes a run of
                  "detected nothing" legible as "step back". */}
              {contract.feature_kind === "hands_pose" &&
                " · hands+pose (258)"}
            </div>

            <div className="text-[8px] font-mono text-text-muted">
              markers→LLM:{" "}
              <span className="text-accent-secondary">
                {nmm.question ||
                nmm.wh_question ||
                nmm.negation ||
                nmm.affirmation ||
                nmm.emphasis
                  ? (
                      [
                        nmm.wh_question && "WH",
                        nmm.question && "Q",
                        nmm.negation && "NEG",
                        nmm.affirmation && "AFM",
                        nmm.emphasis && "EMP",
                      ]
                        .filter(Boolean)
                        .join("+")
                    )
                  : "none"}
              </span>
            </div>

            <div className="text-[8px] font-mono text-text-muted">
              affect→LLM:{" "}
              <span className="text-accent-secondary">
                {emotion?.dominant ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: TRANSLATION */}
        <div className="min-w-0 flex flex-col gap-3 lg:h-[650px]">
          <div className="flex items-center justify-between shrink-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-secondary">
              Translation Workspace
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={
                  handleBackspace
                }
                disabled={
                  detectedHistory.length ===
                  0
                }
                className="px-2 py-1 rounded bg-surface border border-border text-[8px] font-mono text-text-muted disabled:opacity-30"
              >
                <Delete
                  size={10}
                  className="inline mr-1"
                />
                Back
              </button>

              <button
                onClick={
                  handleClear
                }
                className="px-2 py-1 rounded bg-surface border border-border text-[8px] font-mono text-text-muted"
              >
                <Trash2
                  size={10}
                  className="inline mr-1"
                />
                Clear
              </button>
            </div>
          </div>

          {/* SEQUENCE */}
          <div className="h-[170px] rounded-xl border border-border/80 bg-surface/60 p-3 flex flex-col shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono uppercase text-text-muted">
                Detected Sequence
              </span>

              <span className="text-[8px] font-mono text-text-muted">
                {detectedHistory.length}{" "}
                SIGNS
              </span>
            </div>

            <div className="h-[52px] rounded-lg bg-background border border-border p-2 overflow-y-auto">
              {detectedHistory.length ===
              0 ? (
                <span className="text-[9px] font-mono text-text-muted">
                  Awaiting input...
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {detectedHistory.map(
                    (s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDetectedHistory(
                            (prev) =>
                              prev.slice(
                                0,
                                idx
                              )
                          );

                          setBengaliOutput(
                            ""
                          );
                        }}
                        className={`px-2 py-1 rounded border font-mono text-[9px] font-bold ${
                          s.negation
                            ? "border-status-error/60 text-status-error"
                            : idx ===
                                detectedHistory.length -
                                  1 &&
                              anyQuestion
                            ? "border-status-pending/60 text-status-pending"
                            : "border-border text-accent-primary"
                        }`}
                      >
                        [{s.gloss}]
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {isTemporal && (
              <div className="flex gap-2 mt-2">
                <select
                  value={pickSign}
                  onChange={(e) =>
                    setPickSign(
                      e.target.value
                    )
                  }
                  className="min-w-0 flex-1 px-2 py-1.5 rounded-lg bg-background border border-border text-[9px] font-mono text-text-primary focus:outline-none"
                >
                  {catalog.map((c) => (
                    <option
                      key={c.label}
                      value={c.label}
                    >
                      {c.label}
                      {c.bengali_meaning
                        ? ` — ${c.bengali_meaning}`
                        : ""}
                    </option>
                  ))}
                </select>

                <button
                  onClick={
                    handleAddPick
                  }
                  disabled={!pickSign}
                  className="px-3 rounded-lg bg-accent-primary/15 border border-accent-primary/40 text-[9px] font-mono text-accent-primary disabled:opacity-40"
                >
                  <Plus
                    size={11}
                    className="inline mr-1"
                  />
                  Add
                </button>
              </div>
            )}

            <div className="mt-auto text-[8px] font-mono text-text-muted truncate">
              NLG:{" "}
              <span className="text-text-secondary">
                {glossPreview}
              </span>
            </div>
          </div>

          {/* BENGALI OUTPUT */}
          <div className="flex-1 min-h-[250px] rounded-xl border border-border/80 bg-surface/60 p-3 flex flex-col">
            <div className="text-[9px] font-mono uppercase text-text-muted mb-2">
              Bengali Output
            </div>

            <div className="flex-1 min-h-0 rounded-lg bg-background border border-border p-4 flex items-center">
              {bengaliOutput ? (
                <p className="font-bengali text-xl sm:text-2xl text-text-primary leading-relaxed">
                  {bengaliOutput}
                </p>
              ) : (
                <span className="text-[9px] font-mono text-text-muted">
                  Bengali translation will appear here
                </span>
              )}
            </div>
          </div>

          {/* ACTION */}
          <button
            onClick={
              handleStreamAndSpeak
            }
            disabled={
              detectedHistory.length ===
                0 ||
              isGenerating
            }
            className="h-10 shrink-0 rounded-lg bg-accent-secondary text-white font-mono text-[9px] uppercase font-bold hover:bg-accent-secondary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2
                  size={12}
                  className="animate-spin"
                />
                Streaming Bengali...
              </>
            ) : isPlayingAudio ? (
              <>
                <Volume2 size={12} />
                Speaking...
              </>
            ) : (
              <>
                <Volume2 size={12} />
                Stream Bengali in Voice
              </>
            )}
          </button>

          {/* VOICE */}
          <div className="h-10 flex items-center gap-2 shrink-0">
            <span className="text-[8px] font-mono uppercase text-text-muted shrink-0">
              Voice
            </span>

            <button
              onClick={() =>
                setVoiceId("1")
              }
              className={`flex-1 h-8 rounded border text-[8px] font-mono ${
                voiceId === "1"
                  ? "bg-accent-primary/15 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary"
              }`}
            >
              Female · Nabanita
            </button>

            <button
              onClick={() =>
                setVoiceId("2")
              }
              className={`flex-1 h-8 rounded border text-[8px] font-mono ${
                voiceId === "2"
                  ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary"
              }`}
            >
              Male · Pradeep
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\text-to-sign\page.tsx`

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import {
  ArrowRight,
  VideoOff,
  Loader2,
  Play,
  Sparkles,
  Mic,
  MicOff,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000";

interface MediaItem {
  gloss: string;
  type: "video" | "image" | null;
  url: string | null;
}

interface TextToSignResult {
  input_text: string;
  gloss_sequence: string[];
  available_signs: number;
  media: MediaItem[];
}

export default function TextToSignPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<TextToSignResult | null>(null);
  const [activeSignIndex, setActiveSignIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playingSeq, setPlayingSeq] = useState(false);
  /*
   * Increments on every Play/Restart click. "Restart Sequence" must work while
   * the sequence is already playing, but that click would otherwise not change
   * any state — and a React effect that re-runs on identical state does not
   * exist. The nonce is a real state change the playback effect can key on,
   * and it is baked into the player's key so the video element is remounted
   * and the clip starts from the top rather than from wherever it was paused.
   */
  const [seqNonce, setSeqNonce] = useState(0);
  // Off by default: the dictionary mapper is deterministic and always available,
  // while the LLM planner needs a configured provider and may drop words. The
  // user opts into that trade, and a failure falls back rather than erroring.
  const [useLlm, setUseLlm] = useState(false);

  // STT language selection. "auto" lets Whisper detect; an explicit choice is
  // sent to the engine verbatim so a Bengali pick never comes back as English
  // because detection guessed wrong.
  const [sttLanguage, setSttLanguage] = useState<"auto" | "bn" | "en">("auto");

  // Voice recording & STT state
  const [isRecording, setIsRecording] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startVoiceRecording = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Microphone is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "",
      ].find((t) => !t || MediaRecorder.isTypeSupported(t));

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const streamTracks = streamRef.current?.getTracks();
        streamTracks?.forEach((track) => track.stop());
        streamRef.current = null;

        if (audioChunksRef.current.length === 0) {
          toast.error("No audio recorded.");
          setIsRecording(false);
          return;
        }

        const blobType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });

        if (audioBlob.size < 200) {
          toast.error("Audio recording was too short.");
          setIsRecording(false);
          return;
        }

        const ext = blobType.includes("ogg")
          ? "ogg"
          : blobType.includes("mp4")
          ? "mp4"
          : "webm";
        const formData = new FormData();
        formData.append("file", audioBlob, `voice.${ext}`);
        formData.append("language", sttLanguage);

        setSttLoading(true);
        try {
          const resp = await axios.post<{
            text: string;
            language?: string;
            language_probability?: number;
          }>(`${API_BASE}/api/stt`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 60000,
          });

          const recognized = (resp.data.text || "").trim();
          if (recognized) {
            setInputText(recognized);
            toast.success("Speech transcribed successfully");
          } else {
            toast.info("No speech detected. Please try again.");
          }
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 400) {
              toast.error("Empty audio recording received.");
            } else if (err.code === "ECONNABORTED") {
              toast.error("Transcription timed out. Please try a shorter sentence.");
            } else {
              toast.error("Backend STT service unavailable. Please check the server.");
            }
          } else {
            toast.error("Failed to transcribe audio.");
          }
        } finally {
          setSttLoading(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
    } catch (err: unknown) {
      setIsRecording(false);
      const name = (err as { name?: string })?.name;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        toast.error("No microphone found on your system.");
      } else {
        toast.error("Could not access microphone.");
      }
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const activeMedia = result?.media?.[activeSignIndex] ?? null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    setIsLoading(true);
    setPlayingSeq(false);

    if (useLlm) {
      try {
        const r = await axios.post<TextToSignResult>(
          `${API_BASE}/api/text-to-sign/llm`,
          { text: inputText }
        );

        setResult(r.data);
        setActiveSignIndex(0);
        setIsLoading(false);
        toast.success("LLM gloss sequence generated");
        return;
      } catch {
        // 503 means the provider is unconfigured or unreachable. That is a
        // routing decision, not an error the user can act on, so it degrades to
        // the dictionary silently-ish (an info toast) and carries on.
        toast.info("LLM unavailable — falling back to dictionary mapping");
      }
    }

    try {
      const res = await axios.post<TextToSignResult>(
        `${API_BASE}/api/text-to-sign`,
        {
          text: inputText,
        }
      );

      setResult(res.data);
      setActiveSignIndex(0);

      toast.success("Sign sequence generated");
    } catch {
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoEnded = () => {
    if (!playingSeq || !result) return;

    if (activeSignIndex < result.gloss_sequence.length - 1) {
      setActiveSignIndex((i) => i + 1);
    } else {
      setPlayingSeq(false);
    }
  };

  /*
   * Sequence playback driver. It re-runs on `seqNonce` too, so a Restart click
   * mid-playback starts over from sign 1 instead of being a silent no-op.
   */
  useEffect(() => {
    if (!playingSeq || !result) return;

    if (activeMedia?.type === "video") {
      videoRef.current?.play().catch(() => {});
      return;
    }

    const timer = setTimeout(
      () => {
        if (activeSignIndex < result.gloss_sequence.length - 1) {
          setActiveSignIndex((i) => i + 1);
        } else {
          setPlayingSeq(false);
        }
      },
      activeMedia?.type === "image" ? 1500 : 800
    );

    return () => clearTimeout(timer);
  }, [playingSeq, seqNonce, activeSignIndex, activeMedia, result]);

  const hasAnyMedia =
    result?.media?.some((m) => Boolean(m.url)) ?? false;

  const playableCount =
    result?.media?.filter((m) => Boolean(m.url)).length ?? 0;

  return (
    <PageContainer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7">
      {/* HEADER */}
      <header className="border-b border-border/70 pb-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
              Reverse Synthesis Pipeline
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Bengali Text{" "}
              <span className="text-accent-secondary">→</span>{" "}
              Sign Playback
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-text-secondary">
              Convert Bengali text into a sign gloss sequence and play available
              reference media.
            </p>
          </div>

          {result && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-[9px] font-mono text-text-muted">
                  GLOSSES
                </span>

                <span className="text-sm font-bold font-mono text-text-primary tabular-nums">
                  {result.gloss_sequence.length}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-[9px] font-mono text-text-muted">
                  PLAYABLE
                </span>

                <span className="text-sm font-bold font-mono text-accent-primary tabular-nums">
                  {playableCount}/{result.gloss_sequence.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* INPUT */}
      <section className="mt-5 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2.5 gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary shrink-0">
            Bengali Input
          </span>

          {/*
           * Speech language for the mic button. This is a user decision, not
           * a detection result: Whisper's auto-detect confuses Bengali and
           * English often enough that the manual override is what makes the
           * voice path trustworthy, and "auto" remains the default so the
           * default behaviour does not silently change for anyone relying on
           * detection.
           */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-lg bg-background border border-border shrink-0"
            role="group"
            aria-label="Speech language"
          >
            {([
              { key: "auto", label: "Auto" },
              { key: "bn", label: "বাংলা" },
              { key: "en", label: "English" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setSttLanguage(opt.key)}
                aria-pressed={sttLanguage === opt.key}
                className={`px-2.5 h-7 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide transition-colors ${
                  sttLanguage === opt.key
                    ? "bg-accent-secondary/20 text-accent-secondary"
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
              onClick={() => setInputText("")}
              className="text-[10px] font-mono text-text-muted hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <form
          onSubmit={handleGenerate}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="বাংলা বাক্য লিখুন"
            className="min-w-0 flex-1 h-12 px-4 rounded-lg bg-background border border-border text-text-primary font-bengali text-base placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-secondary/30 focus:border-accent-secondary transition-all"
          />

          <button
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={sttLoading}
            title={
              isRecording
                ? "Click to stop recording and transcribe"
                : sttLoading
                ? "Transcribing speech..."
                : "Record speech (Bengali or English)"
            }
            className={`h-12 px-4 rounded-lg border flex items-center gap-2 shrink-0 transition-colors disabled:opacity-40 ${
              isRecording
                ? "bg-status-error/15 border-status-error text-status-error animate-pulse"
                : sttLoading
                ? "bg-accent-secondary/15 border-accent-secondary text-accent-secondary"
                : "bg-surface border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {sttLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRecording ? (
              <MicOff size={16} />
            ) : (
              <Mic size={16} />
            )}
            <span className="text-[10px] font-mono">
              {sttLoading ? "TRANSCRIBING..." : isRecording ? "LISTENING..." : "VOICE"}
            </span>
          </button>

          <label className="h-12 px-3 flex items-center gap-2 rounded-lg border border-border bg-surface text-[10px] font-mono text-text-secondary shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={useLlm}
              onChange={(e) => setUseLlm(e.target.checked)}
              className="accent-[var(--accent-secondary)]"
            />
            LLM GLOSS BREAKING
          </label>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="h-12 px-6 rounded-lg bg-accent-secondary text-white font-semibold text-[11px] font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate
              </>
            )}
          </button>
        </form>
      </section>

      {/* RESULT */}
      {result && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-5 items-start">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-5">
            {/* GLOSS SEQUENCE */}
            <section className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary">
                  Sign Gloss Sequence
                </span>

                <span className="text-[9px] font-mono text-text-muted">
                  VOCAB{" "}
                  <span className="text-text-secondary">
                    {result.available_signs}
                  </span>
                </span>
              </div>

              <div className="rounded-lg border border-border/80 bg-background/50 p-3 min-h-[76px]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {result.gloss_sequence.map((gloss, idx) => (
                    <React.Fragment key={idx}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSignIndex(idx);
                          setPlayingSeq(false);
                        }}
                        title={
                          gloss.startsWith("[")
                            ? "No sign mapped for this word yet"
                            : result.media[idx]?.url
                            ? "Click to preview this sign"
                            : "No reference media uploaded yet"
                        }
                        className={`px-3 py-1.5 rounded-md border font-mono text-[11px] font-bold transition-all ${
                          activeSignIndex === idx
                            ? "bg-accent-secondary text-white border-accent-secondary"
                            : gloss.startsWith("[")
                            ? "bg-status-unknown/10 border-status-unknown/30 text-status-unknown"
                            : result.media[idx]?.url
                            ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary hover:bg-accent-primary/20"
                            : "bg-surface-elevated border-border text-text-muted"
                        }`}
                      >
                        {gloss}
                      </button>

                      {idx < result.gloss_sequence.length - 1 && (
                        <ArrowRight
                          size={12}
                          className="text-text-muted/50 shrink-0"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[9px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  Media
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                  No media
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-unknown" />
                  Unknown
                </span>
              </div>

              {hasAnyMedia && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveSignIndex(0);
                    setSeqNonce((n) => n + 1);
                    setPlayingSeq(true);
                  }}
                  className="w-full mt-4 h-10 rounded-lg bg-accent-primary text-black font-mono text-[10px] uppercase font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <Play size={13} />
                  {playingSeq ? "Restart Sequence" : "Play Full Sequence"}
                </button>
              )}
            </section>

            {/* CURRENT INPUT */}
            <section className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary mb-2.5">
                Input
              </div>

              <div className="rounded-lg border border-border bg-background px-4 py-3 font-bengali text-base text-text-primary">
                {result.input_text}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <section className="min-w-0 rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
            {/* MEDIA HEADER */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-secondary">
                  Sign Reference
                </span>

                <span className="text-xs font-mono font-bold text-accent-primary truncate">
                  {result.gloss_sequence[activeSignIndex]}
                </span>
              </div>

              <span className="text-[9px] font-mono px-2 py-1 rounded-md border border-border text-text-muted shrink-0">
                {activeSignIndex + 1}/{result.gloss_sequence.length}
              </span>
            </div>

            {/* FIXED MEDIA FRAME */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-black">
              {activeMedia?.type === "video" && activeMedia.url ? (
                <VideoPlayer
                  /*
                   * Keyed on the play nonce: a Play/Restart click remounts the
                   * element so the clip reloads and starts from frame 0, and
                   * the fresh mount honours autoPlay — which the browser only
                   * reads at load time, not on prop changes.
                   */
                  key={`${activeMedia.url}#${seqNonce}`}
                  src={`${API_BASE}${activeMedia.url}`}
                  autoPlay={playingSeq}
                  loop={!playingSeq}
                  muted
                  /*
                   * During sequence playback this is an OUTPUT surface, not a
                   * player: the sign is what matters, so the scrubber, loop
                   * button, download link and fullscreen button are hidden.
                   * It is still the very same <video> element (and the same
                   * frame-fallback engine) doing the playing -- only the chrome
                   * is suppressed, so autoplay, onEnded sequencing and the
                   * unsupported-codec fallback all keep working.
                   */
                  chrome={!playingSeq}
                  onEnded={handleVideoEnded}
                  onLoadedMetadata={() => {
                    if (playingSeq) {
                      videoRef.current?.play().catch(() => {});
                    }
                  }}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : activeMedia?.type === "image" && activeMedia.url ? (
                <img
                  key={activeMedia.url}
                  src={`${API_BASE}${activeMedia.url}`}
                  alt={activeMedia.gloss}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <VideoOff size={32} className="text-text-muted" />

                  <div className="text-xs font-mono text-text-secondary">
                    No reference media
                  </div>

                  <div className="text-[10px] font-mono text-text-muted">
                    No media uploaded for this sign
                  </div>
                </div>
              )}
            </div>

            {/* PROGRESS */}
            {result.gloss_sequence.length > 1 && (
              <div className="flex gap-1.5 mt-3">
                {result.gloss_sequence.map((gloss, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveSignIndex(i);
                      setPlayingSeq(false);
                    }}
                    title={gloss}
                    aria-label={`Jump to ${gloss}`}
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      activeSignIndex === i
                        ? "bg-accent-secondary"
                        : result.media[i]?.url
                        ? "bg-accent-primary/30 hover:bg-accent-primary/60"
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* PLAYBACK STATUS */}
            <div className="mt-4 flex items-center justify-between text-[9px] font-mono">
              <span className="text-text-muted">
                {playingSeq
                  ? "AUTO SIGN VIEWER"
                  : activeMedia?.url
                  ? activeMedia.type === "video"
                    ? "VIDEO REFERENCE"
                    : "IMAGE REFERENCE"
                  : "NO MEDIA"}
              </span>

              {playingSeq && (
                <span className="flex items-center gap-1.5 text-accent-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                  PLAYING SEQUENCE
                </span>
              )}
            </div>
          </section>
        </div>
      )}

      {/* EMPTY STATE */}
      {!result && !isLoading && (
        <section className="mt-5 rounded-xl border border-dashed border-border bg-surface/30 p-10 sm:p-14 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-surface-elevated border border-border flex items-center justify-center">
            <ArrowRight size={22} className="text-text-muted" />
          </div>

          <div className="mt-4 text-xs font-mono text-text-secondary">
            Enter a Bengali sentence to generate the sign sequence
          </div>

          <button
            type="button"
            onClick={() => setInputText("আমি জল পান করি")}
            className="mt-4 text-xs font-bengali px-4 py-2 rounded-lg bg-surface-elevated border border-border text-text-muted hover:text-accent-secondary hover:border-accent-secondary/50 transition-colors"
          >
            Try: আমি জল পান করি
          </button>
        </section>
      )}
    </PageContainer>
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
  BookOpen,
  Database,
  Cpu,
  Video,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "Signs Catalog", href: "/admin/signs", icon: BookOpen },
  { label: "Dataset Explorer", href: "/admin/dataset", icon: Database },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Video Inspector", href: "/admin/videos", icon: Video },
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

# FILE: `frontend\src\components\layout\Navbar.tsx`

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Shield,
  Activity,
} from "lucide-react";
import { NAVIGATION_LINKS, APP_CONFIG } from "@/lib/constants";
import { SystemDiagnostics } from "./SystemDiagnostics";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[68px] flex items-center">

          {/* ================= BRAND ================= */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-md bg-surface border border-emerald-500/40 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-400">
              <Image
                src="/WBSL%20Bridge%20logo.png"
                alt="WBSL Bridge logo"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            <span className="text-[15px] font-bold tracking-tight text-text-primary whitespace-nowrap">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center ml-10 gap-1">

            {NAVIGATION_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    px-3.5
                    py-2
                    rounded-md
                    text-[13px]
                    font-medium
                    whitespace-nowrap
                    transition-all
                    ${
                      isActive
                        ? "text-text-primary"
                        : "text-text-secondary hover:text-text-primary"
                    }
                  `}
                >
                  {link.label}

                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ================= RIGHT ================= */}
          <div className="hidden md:flex items-center gap-3 ml-auto">

            {/* Admin */}
            <Link
              href="/admin"
              title="Admin Workspace"
              aria-label="Admin Workspace"
              className="
                w-8 h-8
                rounded-md
                border border-border
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface-elevated
                hover:border-border
                transition-all
              "
            >
              <Shield size={15} />
            </Link>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="md:hidden ml-auto flex items-center gap-1">

            <Link
              href="/admin"
              aria-label="Admin"
              className="
                w-9 h-9
                rounded-md
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface
              "
            >
              <Shield size={17} />
            </Link>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="
                w-9 h-9
                rounded-md
                flex items-center justify-center
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface
              "
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">

            {NAVIGATION_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" &&
                  pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className={`
                    flex items-center justify-between
                    px-3 py-3
                    rounded-md
                    text-sm
                    ${
                      isActive
                        ? "bg-surface-elevated text-text-primary"
                        : "text-text-secondary hover:bg-surface hover:text-text-primary"
                    }
                  `}
                >
                  <span>{link.label}</span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}

            <div className="border-t border-border my-3" />

            <Link
              href="/admin"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="
                flex items-center gap-3
                px-3 py-3
                rounded-md
                text-sm
                text-text-secondary
                hover:bg-surface
                hover:text-text-primary
              "
            >
              <Shield size={16} />
              Admin Workspace
            </Link>

            {/* Detailed diagnostics belongs here */}
            <div className="pt-3 border-t border-border mt-3">
              <SystemDiagnostics />
            </div>
          </div>
        </div>
      )}
    </nav>
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
import { useSystemStatus } from "@/hooks/useSystemStatus";

export function SystemDiagnostics() {
  const { health } = useSystemStatus();

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

# FILE: `frontend\src\components\media\VideoPlayer.tsx`

```tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  AlertTriangle,
  Loader2,
  Film,
} from "lucide-react";
import axios from "axios";

interface VideoPlayerProps {
  /** Absolute URL of the video. Passing a new value reloads the element. */
  src: string;
  /** Shown until the first frame decodes, so the panel is never a black void. */
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  /**
   * Whether the interactive chrome (control dock, loading badge, error panel)
   * is rendered. `false` turns the player into a pure output surface: the same
   * <video> element and the same frame-fallback engine still drive playback,
   * but nothing clickable is painted over the clip. Used by the Text → Sign
   * sequential viewer, where the sign must be readable without a scrubber and
   * a download button sitting on top of it.
   */
  chrome?: boolean;
  onEnded?: () => void;
  onLoadedMetadata?: (duration: number) => void;
}

/**
 * Two-engine video player.
 *
 * Engine 1 is a normal <video> element: whatever Chrome's own decoder accepts
 * (H.264, VP9, AV1, WebM) plays through it with hardware acceleration.
 *
 * Engine 2 is a paint loop. If engine 1 fires a MediaError the component asks
 * the backend for that clip as a JPEG frame sequence and paints it to a canvas.
 * That path never touches the video decoder at all, which is the whole point:
 * an MPEG-4 Part 2 / FMP4 file, or anything else Chrome refuses, still renders
 * rather than showing a dead box. It costs a round trip and runs at reduced
 * frame rate, so it is strictly a fallback -- but it means "unsupported format"
 * degrades to "plays slightly worse" instead of "cannot be shown at all".
 *
 * The error panel is a last resort for the case where even the frame endpoint
 * has nothing to give, and it offers a direct download so the file is never
 * simply unreachable.
 */
export function VideoPlayer({
  src,
  poster = null,
  className = "",
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  chrome = true,
  onEnded,
  onLoadedMetadata,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const fallbackRequested = useRef(false);

  const [status, setStatus] = useState<"loading" | "ready" | "fallback" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLooping, setIsLooping] = useState(loop);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => setIsLooping(loop), [loop]);

  /*
   * The `autoPlay` attribute only matters to the browser at load time. The
   * Text → Sign sequential viewer flips this prop *after* the element has
   * loaded (Play Full Sequence / per-sign advance), so playback is driven
   * here instead: a transition into autoplay starts the clip — from the top
   * when the prop was off before, which is what "Restart Sequence" needs —
   * and a transition out of it stops the clip, so the frozen last frame the
   * sequence ends on stays visible instead of looping away.
   */
  const wasAutoPlay = useRef(autoPlay);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || status !== "ready") return;
    if (autoPlay) {
      if (!wasAutoPlay.current) v.currentTime = 0;
      v.play().catch(() => {});
    } else if (wasAutoPlay.current) {
      v.pause();
    }
    wasAutoPlay.current = autoPlay;
  }, [autoPlay, status, src]);

  // The frame engine has no element to drive: when a sequence asks for autoplay
  // it starts, and idle/manual control is left to togglePlay.
  useEffect(() => {
    if (status === "fallback" && autoPlay) setIsPlaying(true);
  }, [autoPlay, status]);

  // A new source is a new load. Reset every verdict, or a stale error from the
  // previous sign keeps covering a video that plays perfectly well.
  useEffect(() => {
    setStatus("loading");
    setErrorMessage("");
    setCurrentTime(0);
    setDuration(0);
    setFrames([]);
    setFrameIndex(0);
    fallbackRequested.current = false;
    if (frameTimer.current) clearInterval(frameTimer.current);
  }, [src]);

  /**
   * Ask the backend to decode the clip server-side and hand back JPEG frames.
   * This is the only path that works for codecs Chrome cannot decode, and it is
   * also a useful escape hatch when the container is fine but the file is
   * truncated.
   */
  const loadFrameFallback = useCallback(async () => {
    if (fallbackRequested.current) return;
    fallbackRequested.current = true;
    setStatus("loading");
    try {
      const filename = src.split("/").pop()?.split("#")[0]?.split("?")[0];
      if (!filename) throw new Error("no filename");
      const res = await axios.get(
        `http://localhost:8000/api/media/${filename}/frames`,
        { timeout: 25000 }
      );
      const list: string[] = res.data?.frames ?? [];
      if (!list.length) throw new Error("no frames");
      setFrames(list);
      // 14 fps is smooth enough to read a sign without flooding the compositor.
      const fps = Math.max(res.data?.fps || 14, 6);
      setDuration(list.length / fps);
      setStatus("fallback");
      setIsPlaying(true);
    } catch {
      setStatus("error");
      setErrorMessage(
        "This clip could not be decoded in the browser, and the server-side frame fallback returned nothing either. The file may be corrupt or truncated."
      );
    }
  }, [src]);

  const togglePlay = useCallback(() => {
    if (status === "fallback") {
      setIsPlaying((p) => !p);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [status]);

  // Drive the canvas paint loop while the fallback engine is playing.
  useEffect(() => {
    if (status !== "fallback" || !isPlaying || frames.length === 0) {
      if (frameTimer.current) clearInterval(frameTimer.current);
      return;
    }
    frameTimer.current = setInterval(() => {
      setFrameIndex((i) => {
        const next = i + 1;
        if (next >= frames.length) {
          if (isLooping) return 0;
          setIsPlaying(false);
          onEnded?.();
          return i;
        }
        return next;
      });
    }, 71);
    return () => {
      if (frameTimer.current) clearInterval(frameTimer.current);
    };
  }, [status, isPlaying, frames, isLooping, onEnded]);

  // Paint the current frame onto the canvas.
  useEffect(() => {
    if (status !== "fallback" || !frames[frameIndex] || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
    };
    img.src = frames[frameIndex];
    if (duration > 0) setCurrentTime((frameIndex / frames.length) * duration);
  }, [status, frameIndex, frames, duration]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (status === "fallback") {
      const idx = duration > 0 ? Math.round((t / duration) * frames.length) : 0;
      setFrameIndex(Math.min(frames.length - 1, Math.max(0, idx)));
    } else if (videoRef.current) {
      videoRef.current.currentTime = t;
    }
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  const describeError = (code: number | undefined): string => {
    switch (code) {
      case 2:
        return "The connection dropped mid-stream. A large clip needs the server to answer byte-range requests — check the backend is up on port 8000.";
      case 3:
        return "The browser cannot decode this file's codec.";
      case 4:
        return "The browser reports this file as unplayable. It is usually a malformed or unsupported encoding rather than a missing file.";
      default:
        return "The video could not be loaded from the server.";
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-black flex items-center justify-center ${className}`}
    >
      {/* ── Engine 1: native decoder ── */}
      {status !== "fallback" && status !== "error" && (
        <video
          key={`${src}#native`}
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          autoPlay={autoPlay}
          loop={isLooping}
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            setDuration(Number.isFinite(d) ? d : 0);
            setStatus("ready");
            onLoadedMetadata?.(d);
            if (autoPlay) e.currentTarget.play().catch(() => {});
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onError={() => loadFrameFallback()}
          onClick={chrome ? togglePlay : undefined}
          className={`w-full h-full object-contain ${
            chrome ? "cursor-pointer" : ""
          }`}
        />
      )}

      {/* ── Engine 2: server-side frame painting ── */}
      {status === "fallback" && (
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={chrome ? togglePlay : undefined}
        >
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-contain ${
              chrome ? "cursor-pointer" : ""
            }`}
          />

          {chrome && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/40 text-[10px] font-mono font-bold text-accent-primary backdrop-blur-md">
              <Film size={11} />
              <span>FRAME ENGINE</span>
            </div>
          )}
        </div>
      )}

      {/* ── Loading ── */}
      {status === "loading" && chrome && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 backdrop-blur-sm pointer-events-none">
          <Loader2 size={26} className="animate-spin text-accent-primary" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-secondary">
            Loading media…
          </span>
        </div>
      )}

      {/* ── Unrecoverable ── */}
      {status === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-6 text-center bg-zinc-950">
          <div className="w-11 h-11 rounded-full bg-status-error/15 border border-status-error/30 flex items-center justify-center text-status-error">
            <AlertTriangle size={22} />
          </div>
          <h4 className="text-sm font-semibold text-text-primary">Video unavailable</h4>
          <p className="text-xs text-text-muted max-w-sm leading-relaxed">{errorMessage}</p>
          <div className="flex gap-2 pt-1">
            <a
              href={src}
              download
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary text-black text-xs font-mono font-bold hover:bg-accent-primary/90 transition-colors"
            >
              <Download size={13} />
              <span>Download</span>
            </a>
            <button
              onClick={() => {
                fallbackRequested.current = false;
                loadFrameFallback();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-elevated border border-border text-xs font-mono text-text-primary hover:border-accent-secondary transition-colors"
            >
              <RotateCcw size={13} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Control dock ── */}
      {controls && chrome && status !== "error" && (
        <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={Math.min(currentTime, duration || 1)}
            onChange={handleSeek}
            aria-label="Seek"
            className="w-full h-1 appearance-none rounded-lg bg-white/20 cursor-pointer accent-[var(--accent-primary)] hover:h-1.5 transition-all"
          />
          <div className="flex items-center justify-between text-white/90">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              {status === "ready" && (
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              )}
              <span className="font-mono text-[11px] text-white/70 tabular-nums">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsLooping((l) => !l)}
                aria-label="Toggle loop"
                className={`px-2 py-1 rounded text-[10px] font-mono font-semibold tracking-wider transition-colors ${
                  isLooping
                    ? "bg-accent-primary/20 text-accent-primary border border-accent-primary/40"
                    : "text-white/60 hover:text-white border border-transparent"
                }`}
              >
                LOOP
              </button>
              <a
                href={src}
                download
                aria-label="Download video"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Download size={14} />
              </a>
              <button
                onClick={handleFullscreen}
                aria-label="Toggle fullscreen"
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
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
          Affect offline — tests/vit_emotion.onnx not installed.
        </p>
      </div>
    );
  }
  if (!emotion) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface/60 p-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <HelpCircle size={13} />
          Affect
        </div>
        <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
          Waiting for a face in frame. Emotions are read from the cropped face region
          using a ViT classifier.
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

const API_BASE = "http://localhost:8000";

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
    label: "Repeat cooldown",
    hint: "How long the same sign is suppressed after being added, so holding one sign does not repeat it.",
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

# FILE: `frontend\src\components\simulation\LandmarkSimulation.tsx`

```tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { POSE_BODY_PAIRS, POSE_FACE_MARKERS, POSE_POINTS, type PosePoint } from "@/lib/pose";

const HAND_CONN: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10],
  [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18],
  [18, 19], [19, 20], [0, 17],
];

interface LandmarkSimulationProps {
  frames?: number[][][];              // F x 42 x 3
  // F x 33 x 4 (optional, 258-dim runs). Typed as a tuple rather than
  // number[][] because the visibility column is index 3 of every landmark and
  // the type is what keeps a plain (x, y, z) clip from being passed in and read
  // as though p[3] were a visibility score.
  pose?: PosePoint[][];
  fps?: number;
  title?: string;
}

export function LandmarkSimulation({
  frames,
  pose,
  fps = 15,
  title,
}: LandmarkSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const totalFrames = frames?.length ?? 0;

  useEffect(() => {
    if (!isPlaying || totalFrames === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, (1000 / fps) / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, fps, playbackSpeed, totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render ONLY real extracted landmarks. No synthetic fallback.
    const frame = frames?.[currentFrame];
    if (!frame) return;

    const S = width / 5;
    const cx = width / 2;
    const cy = height / 2;
    const px = (p: number[]) => cx + p[0] * S;
    const py = (p: number[]) => cy + p[1] * S;

    // Slot 0 = left hand (21 pts), slot 1 = right hand (21 pts)
    for (const off of [0, 21]) {
      const slot = frame.slice(off, off + 21);
      // A slot whose 21 points are all exactly zero is a MISSING hand, not a
      // hand at the origin: the extractor writes zeros when MediaPipe found no
      // signer hand in that slot. Drawing it would paint a real-looking
      // skeleton at the wrist, which is the one place a viewer would believe it.
      if (slot.every((p) => p[0] === 0 && p[1] === 0 && p[2] === 0)) continue;

      ctx.strokeStyle = off === 0 ? "#22c55e" : "#4ade80";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1.5;

      for (const [a, b] of HAND_CONN) {
        const p1 = frame[off + a];
        const p2 = frame[off + b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(px(p1), py(p1));
        ctx.lineTo(px(p2), py(p2));
        ctx.stroke();
      }

      for (let i = 0; i < 21; i++) {
        const p = frame[off + i];
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(px(p), py(p), i === 0 ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Body layer, drawn after the hands so the torso reads as the backdrop.
    // Only 258-dim recordings have it; a 126-dim clip leaves `pose` undefined
    // and nothing is drawn -- a synthesised body would be a lie about the data.
    const pf = pose?.[currentFrame];
    if (pf) {
      ctx.strokeStyle = "#6366F1";
      ctx.fillStyle = "#818CF8";
      ctx.lineWidth = 2;

      for (const [a, b] of POSE_BODY_PAIRS) {
        const p1 = pf[a];
        const p2 = pf[b];
        // Visibility gate: BlazePose reports a low-confidence landmark for a
        // body part that is out of frame, and joining it to a confident one
        // draws a bone to nowhere.
        if (!p1 || !p2 || p1[3] < 0.5 || p2[3] < 0.5) continue;
        ctx.beginPath();
        ctx.moveTo(px(p1), py(p1));
        ctx.lineTo(px(p2), py(p2));
        ctx.stroke();
      }

      // Nose + mouth corners: the exact landmarks the NMM detector reads, so
      // the replay shows where the question/negation signal was measured.
      for (const i of POSE_FACE_MARKERS) {
        const p = pf[i];
        if (!p || p[3] < 0.5) continue;
        ctx.beginPath();
        ctx.arc(px(p), py(p), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [currentFrame, frames, pose]);

  // Honest empty state: this sign simply has no extracted sequence yet.
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

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden flex flex-col">
      {/* Simulation Screen */}
      <div className="relative aspect-video w-full bg-background flex items-center justify-center canvas-grid-bg">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-contain"
        />

        {/* Overlay Metadata Panel */}
        <div className="absolute top-3 left-3 bg-surface/90 border border-border/80 px-2.5 py-1.5 rounded tech-mono text-[11px] text-text-secondary space-x-2">
          <span>Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong></span>
          <span>|</span>
          <span>FPS: <strong className="text-accent-primary">{fps}</strong></span>
          <span>|</span>
          <span>Hands: <strong className="text-status-approved">2 (21 pts each)</strong></span>
          {pose && (
            <>
              <span>|</span>
              <span>
                Pose: <strong className="text-[#818CF8]">{POSE_POINTS} pts</strong>
              </span>
            </>
          )}
          {title && (
            <>
              <span>|</span>
              <span className="text-accent-secondary">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="p-3 bg-surface-elevated/50 border-t border-border flex items-center justify-between tech-mono text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-surface hover:bg-surface-elevated border border-border text-text-primary"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setCurrentFrame(0)}
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

        {/* Timeline Scrubber */}
        <div className="flex-1 mx-6 flex items-center">
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
            className="w-full accent-accent-primary bg-surface h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-[11px] text-text-secondary">
          {((currentFrame / fps)).toFixed(2)}s / {(totalFrames / fps).toFixed(2)}s
        </div>
      </div>
    </div>
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
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
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

/** A single pose landmark as delivered by /api/simulation/frames. */
export type PosePoint = [number, number, number, number];
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
  reference_video_url: string | null;
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
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
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

  uploadSignMedia: async (signId: string, file: File): Promise<{ success: boolean; media: { type: string; filename: string; url: string } }> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await apiClient.post(`/admin/signs/${signId}/media`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 180000,
    });
    return res.data;
  },

  deleteSignMedia: async (signId: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete(`/admin/signs/${signId}/media`);
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

# FILE: `HOW_TO_RUN.md`

```markdown
# WBSL Bridge — How to Run

## 1. One-Time Setup


## 2. Configure AI

Create `backend/.env`:

```bash
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=<YOUR_OPENROUTER_API_KEY>
AI_MODEL_NAME=google/gemma-4-26b-a4b-it:free

AI_STREAM=true
AI_REASONING=false
AI_REASONING_EFFORT=low
AI_TIMEOUT=180
```

## 3. Start WBSL Bridge

Open PowerShell:

```powershell
cd "D:\Download\Projects\WBSL Bridge"
.\start.ps1
```

This automatically starts:

```text
FastAPI Backend → http://localhost:8000
Next.js Frontend → http://localhost:3000
OpenAI Compatible API on port 5001 at http://localhost:5001/v1/ (if models/llm/ is present)
```

> **Note on AI tab in start.ps1:** The local KoboldCpp AI runner requires the `models/llm/` directory with local weights. If `models/llm/` is absent, the script will skip starting the local runner and you can rely directly on the cloud LLM configuration defined in `backend/.env`.
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.
```

---

# FILE: `models\active_model.json`

```json
{
  "path": "D:\\Download\\Projects\\WBSL Bridge\\models\\onnx_models\\5\\sign_static_mlp.onnx",
  "name": "sign_static_mlp",
  "run": "onnx_models/5"
}
```

---

# FILE: `models\onnx_models\1\sign_classes.json`

```json
["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```

---

# FILE: `models\onnx_models\2\sign_unified_classes.json`

```json
[
 "0",
 "1",
 "2",
 "3",
 "4",
 "5",
 "6",
 "7",
 "8",
 "9",
 "A",
 "B",
 "C",
 "D",
 "E",
 "F",
 "G",
 "H",
 "I",
 "J",
 "K",
 "L",
 "M",
 "N",
 "O",
 "P",
 "Q",
 "R",
 "S",
 "T",
 "U",
 "V",
 "W",
 "X",
 "Y",
 "Z",
 "BEAR",
 "BREAK",
 "BRINJAL",
 "BUDGET",
 "BUSY",
 "CABBAGE",
 "CARROT",
 "CAULIFLOWER",
 "CHILLI",
 "CLEAN",
 "CLOSE",
 "COME",
 "COOK",
 "CROCODILE",
 "CRY",
 "CUCUMBER",
 "DEER",
 "DRINK",
 "ELEPHANT",
 "EXAM",
 "FEDUP",
 "FED_UP",
 "FEVER",
 "GIRAFFE",
 "GIVE",
 "GOOD_AFTERNOON",
 "GOOD_MORNING",
 "HELLO",
 "HUG",
 "INJURY",
 "INTERVIEW",
 "JUMP",
 "KARNATAKA",
 "KEY",
 "KNIFE",
 "LEMON",
 "LION",
 "MAN",
 "MATHS",
 "MAYBE",
 "MONKEY",
 "ONION",
 "PEACOCK",
 "PIGEON",
 "POUR",
 "RADISH",
 "SPARROW",
 "STILL",
 "SWITCH",
 "TEA",
 "TEMPLE",
 "THANK_YOU",
 "TIGER",
 "TURTLE",
 "UMBRELLA",
 "UNCLE",
 "VEGETABLES",
 "VOLCANO",
 "WHAT_IS_YOUR_NAME",
 "WIFE",
 "WRITER",
 "WRONG"
]
```

---

# FILE: `models\onnx_models\3\sign_video_classes.json`

```json
[
 "BEAR",
 "BREAK",
 "BRINJAL",
 "BUDGET",
 "BUSY",
 "CABBAGE",
 "CARROT",
 "CAULIFLOWER",
 "CHILLI",
 "CLEAN",
 "CLOSE",
 "COME",
 "COOK",
 "CROCODILE",
 "CRY",
 "CUCUMBER",
 "DEER",
 "DRINK",
 "ELEPHANT",
 "EXAM",
 "FEDUP",
 "FED_UP",
 "FEVER",
 "GIRAFFE",
 "GIVE",
 "GOOD_AFTERNOON",
 "GOOD_MORNING",
 "HELLO",
 "HUG",
 "INJURY",
 "INTERVIEW",
 "JUMP",
 "KARNATAKA",
 "KEY",
 "KNIFE",
 "LEMON",
 "LION",
 "MAN",
 "MATHS",
 "MAYBE",
 "MONKEY",
 "ONION",
 "PEACOCK",
 "PIGEON",
 "POUR",
 "RADISH",
 "SPARROW",
 "STILL",
 "SWITCH",
 "TEA",
 "TEMPLE",
 "THANK_YOU",
 "TIGER",
 "TURTLE",
 "UMBRELLA",
 "UNCLE",
 "VEGETABLES",
 "VOLCANO",
 "WHAT_IS_YOUR_NAME",
 "WIFE",
 "WRITER",
 "WRONG"
]
```

---

# FILE: `models\onnx_models\4\daily_report.json`

```json
{
 "classes": 10,
 "static": 0,
 "video": 10,
 "best_val_acc": 99.16666666666667,
 "seq_len": 32,
 "feat": 126,
 "target_glosses": [
  "HELLO",
  "THANK_YOU",
  "COME",
  "DRINK",
  "GIVE",
  "GOOD_MORNING",
  "TEA",
  "MAN",
  "WIFE",
  "WHAT_IS_YOUR_NAME"
 ]
}
```

---

# FILE: `models\onnx_models\4\sign_daily_classes.json`

```json
[
 "HELLO",
 "THANK_YOU",
 "COME",
 "DRINK",
 "GIVE",
 "GOOD_MORNING",
 "TEA",
 "MAN",
 "WIFE",
 "WHAT_IS_YOUR_NAME"
]
```

---

# FILE: `models\onnx_models\5\sign_static_classes.json`

```json
[
 "0",
 "1",
 "2",
 "3",
 "4",
 "5",
 "6",
 "7",
 "8",
 "9",
 "A",
 "B",
 "C",
 "D",
 "E",
 "F",
 "G",
 "H",
 "I",
 "J",
 "K",
 "L",
 "M",
 "N",
 "O",
 "P",
 "Q",
 "R",
 "S",
 "T",
 "U",
 "V",
 "W",
 "X",
 "Y",
 "Z"
]
```

---

# FILE: `models\onnx_models\5\static_report.json`

```json
{
 "classes": 36,
 "type": "static_mlp",
 "best_val_acc": 97.9633401221996,
 "feat": 126
}
```

---

# FILE: `models\onnx_models\6\daily_report.json`

```json
{
 "classes": 6,
 "type": "daily6_lstm",
 "feat": 258,
 "seq_len": 32,
 "best_val_acc": 100.0,
 "glosses": [
  "GOOD_MORNING",
  "GOOD_AFTERNOON",
  "HELLO",
  "HUG",
  "WHAT_IS_YOUR_NAME",
  "DRINK"
 ]
}
```

---

# FILE: `models\onnx_models\6\sign_daily_classes.json`

```json
[
 "GOOD_MORNING",
 "GOOD_AFTERNOON",
 "HELLO",
 "HUG",
 "WHAT_IS_YOUR_NAME",
 "DRINK"
]
```

---

# FILE: `models\onnx_models\7\daily_report.json`

```json
{
 "classes": 7,
 "type": "daily_bilstm_attn",
 "feat": 258,
 "seq_len": 32,
 "best_val_acc": 100.0,
 "glosses": [
  "GOOD_MORNING",
  "GOOD_AFTERNOON",
  "HELLO",
  "HUG",
  "WHAT_IS_YOUR_NAME",
  "DRINK",
  "NONE"
 ]
}
```

---

# FILE: `models\onnx_models\7\sign_daily_classes.json`

```json
[
 "GOOD_MORNING",
 "GOOD_AFTERNOON",
 "HELLO",
 "HUG",
 "WHAT_IS_YOUR_NAME",
 "DRINK",
 "NONE"
]
```

---

# FILE: `start.ps1`

```powershell
$root = "D:\Download\Projects\WBSL Bridge"

$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"

# Backend
@"
Set-Location '$root'
& 'tests\.venv\Scripts\python.exe' -m uvicorn backend.main:app --reload --port 8000
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
$wtArgs = @(
    "-w", "0",
    "new-tab", "--title", "Backend",
        "-d", $root,
        "powershell", "-NoExit", "-File", $backendScript,
    ";",
    "new-tab", "--title", "AI Server",
        "-d", $root,
        "powershell", "-NoExit", "-File", $aiScript,
    ";",
    "new-tab", "--title", "Frontend",
        "-d", "$root\frontend",
        "powershell", "-NoExit", "-File", $frontendScript
)

& wt.exe @wtArgs
```

---

# FILE: `tools\build_index.py`

```python
"""
tools/build_index.py

Writes ONE coordinated master index at dataset/index.jsonl covering every data
coordinate in the project: raw sources, extracted hold-sequences, video
sequences, reference media, community samples and trained models.

Every record carries sample_id / kind / label / source / path / split /
verification so downstream tooling can join on a single key.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_index.py
"""
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "dataset" / "Indian Sign Language_Dataset"
DT = ROOT / "dataset_train"
OUT = ROOT / "dataset" / "index.jsonl"
recs = []


def rel(p):
    return str(Path(p).relative_to(ROOT))


# ── 1. Raw static images (ISL_STATIC1 + ISL_STATIC2) ──
for cd in sorted(d for d in (DS / "ISL_STATIC2").iterdir() if d.is_dir()):
    n = len(list(cd.glob("*.jpg")))
    if (DS / "ISL_STATIC1" / cd.name).exists():
        n += len(list((DS / "ISL_STATIC1" / cd.name).glob("*.jpg")))
    recs.append({"sample_id": f"RAW_STATIC_{cd.name}", "kind": "raw_static_images", "label": cd.name,
                 "source": "ISL_STATIC1+ISL_STATIC2", "path": rel(cd), "count": n,
                 "split": "unassigned", "verification": "n/a"})

# ── 2. Raw videos (ISL_VIDEO) ──
for vd in sorted(d for d in (DS / "ISL_VIDEO").iterdir() if d.is_dir()):
    g = vd.name.upper().replace(" ", "_")
    recs.append({"sample_id": f"RAW_VIDEO_{g}", "kind": "raw_videos", "label": g,
                 "source": "ISL_VIDEO", "path": rel(vd), "count": len(list(vd.glob("*.mp4"))),
                 "split": "unassigned", "verification": "n/a"})

# ── 3. Extracted static hold-sequences ──
for p in sorted((DT / "unified_static").glob("*.npy")):
    a = np.load(p)
    recs.append({"sample_id": f"HOLD_{p.stem}", "kind": "static_hold_sequences", "label": p.stem,
                 "source": "extracted", "path": rel(p), "sequences": int(a.shape[0]),
                 "frames": int(a.shape[1]), "split": "train+val", "verification": "n/a"})

# ── 4. Extracted video sequences ──
for p in sorted((DT / "unified_video").glob("*.npy")):
    a = np.load(p)
    recs.append({"sample_id": f"VSEQ_{p.stem}", "kind": "video_sequences", "label": p.stem,
                 "source": "extracted", "path": rel(p), "sequences": int(a.shape[0]),
                 "frames": int(a.shape[1]), "split": "train+val", "verification": "n/a"})

# ── 5. Reference media (one auto-copied sample per class) ──
sm = ROOT / "backend" / "data" / "sign_media.json"
if sm.exists():
    for label, m in json.loads(sm.read_text(encoding="utf-8")).items():
        recs.append({"sample_id": f"REF_{label}", "kind": "reference_media", "label": label,
                     "source": "auto-copied", "path": f"backend/media/{m['filename']}",
                     "media_type": m["type"], "url": m["url"],
                     "split": "n/a", "verification": "admin-approved"})

# ── 6. Community samples (real uploads: video -> landmarks -> npy) ──
man = ROOT / "dataset" / "manifest.jsonl"
if man.exists():
    for line in man.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        recs.append({"sample_id": f"COM_{r['sample_id']}", "kind": "community_sample", "label": r["label"],
                     "source": f"community:{r['signer_id']}", "signer": r["signer_id"],
                     "path": r["landmark_path"], "frames": r["frames"],
                     "split": r.get("split", "unassigned"),
                     "verification": r.get("verification", "pending")})

# ── 7. Trained models ──
#
# The two flat artefacts below are the legacy layout. Every run written since
# train_daily6.py lives in models/onnx_models/<id>/ and was previously invisible
# to this index -- so the index listed 2 models while the registry was serving a
# third. Both layouts are walked, and each run is recorded with its report when
# one was written.
RUNS = ROOT / "models" / "onnx_models"
for run in sorted((d for d in RUNS.iterdir() if d.is_dir() and d.name.isdigit()),
                  key=lambda d: int(d.name)):
    for onnx in sorted(run.glob("*.onnx")):
        rec = {"sample_id": f"MODEL_RUN{run.name}_{onnx.stem}", "kind": "model",
               "label": onnx.stem, "source": "trained", "run": f"onnx_models/{run.name}",
               "path": rel(onnx), "split": "n/a", "verification": "n/a"}
        for rep_name in ("duration.json", "daily_report.json", "static_report.json",
                         "unified_report.json"):
            rp = run / rep_name
            if rp.exists():
                rec["metrics"] = json.loads(rp.read_text(encoding="utf-8"))
                break
        recs.append(rec)

for mp_ in [("sign_mlp.onnx", "MLP-static"), ("sign_unified_lstm.onnx", "LSTM-unified")]:
    if (ROOT / "models" / mp_[0]).exists():
        recs.append({"sample_id": f"MODEL_{mp_[1]}", "kind": "model", "label": mp_[1],
                     "source": "trained", "path": f"models/{mp_[0]}",
                     "split": "n/a", "verification": "n/a"})

rep = DT / "unified_report.json"
if rep.exists():
    for r in recs:
        if r["kind"] == "model" and "unified" in r["label"]:
            r["metrics"] = json.loads(rep.read_text(encoding="utf-8"))

OUT.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in recs), encoding="utf-8")
kinds = {}
for r in recs:
    kinds[r["kind"]] = kinds.get(r["kind"], 0) + 1
print(f"index written: {len(recs)} records")
for k, v in kinds.items():
    print(f"  {k}: {v}")
```

---

# FILE: `tools\build_reference_samples.py`

```python
"""
tools/build_reference_samples.py

Copies ONE real sample per class into backend/media/ and registers it in
backend/data/sign_media.json, so Text->Sign playback and the Contribute
"watch & copy" panel both show real data instead of nothing.

Sources are data-driven (SOURCE_DIRS below) rather than hard-coded to a single
folder, so adding a dataset is one entry. Order matters: the first directory
that yields a usable sample for a class wins, which makes ISL_STATIC2 canonical
for the digits/letters (it includes "0"; ISL_STATIC1 does not).

Idempotent: an existing entry is only replaced when --force is passed, so
re-running never churns files or invalidates an admin's manual upload.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py --force
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py --only HELLO,THANK_YOU
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

import cv2
import mediapipe as mp

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "dataset" / "Indian Sign Language_Dataset"
MEDIA = ROOT / "backend" / "media"
MEDIA.mkdir(parents=True, exist_ok=True)
MP = ROOT / "backend" / "data" / "sign_media.json"
MP.parent.mkdir(parents=True, exist_ok=True)

# (root, kind, glob) in precedence order — first hit per class wins.
SOURCE_DIRS = [
    (DS / "ISL_STATIC2", "image", "*.jpg"),
    (DS / "ISL_STATIC1", "image", "*.jpg"),
    (DS / "ISL_VIDEO", "video", "*.mp4"),
]

# Folder name -> official gloss token. Must match train_unified.py:60, otherwise
# the reference library keys drift from the model's class list.
GLOSS_OVERRIDE = {"Fedup": "FED_UP"}


def gloss_of(folder_name: str) -> str:
    return GLOSS_OVERRIDE.get(folder_name, folder_name.upper().replace(" ", "_"))


_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)


def both_hands(img) -> bool:
    """True when MediaPipe finds exactly two hands — a better reference frame."""
    res = _hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    return bool(res.multi_hand_landmarks) and len(res.multi_hand_landmarks) == 2


def pick_image(class_dir: Path, candidates: list) -> Path:
    """Prefer the first of the first 15 images showing both hands."""
    for f in candidates[:15]:
        img = cv2.imread(str(f))
        if img is not None and both_hands(img):
            return f
    return candidates[0]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true",
                    help="replace entries that already exist")
    ap.add_argument("--only", default="",
                    help="comma-separated glosses to (re)build")
    args = ap.parse_args()
    only = {g.strip().upper() for g in args.only.split(",") if g.strip()}

    media = json.loads(MP.read_text(encoding="utf-8")) if MP.exists() else {}
    before = len(media)
    added = replaced = kept = 0
    seen = set()

    for root, kind, pattern in SOURCE_DIRS:
        if not root.is_dir():
            print(f"  (skipping missing source {root.name})")
            continue
        for class_dir in sorted(d for d in root.iterdir() if d.is_dir()):
            gloss = gloss_of(class_dir.name)
            # Precedence: an earlier source already claimed this class.
            if gloss in seen:
                continue
            if only and gloss not in only:
                continue

            files = sorted(class_dir.glob(pattern))
            if not files:
                continue

            seen.add(gloss)
            dest = MEDIA / f"{gloss}{files[0].suffix.lower()}"
            old = media.get(gloss)

            if gloss in media and not args.force:
                # Already registered and the file is still on disk: leave it
                # alone so an admin's hand-picked upload is never overwritten.
                if (MEDIA / media[gloss]["filename"]).exists():
                    kept += 1
                    continue

            src = pick_image(class_dir, files) if kind == "image" else files[0]

            # Drop a stale file if the extension changed between sources.
            if old and old["filename"] != dest.name:
                stale = MEDIA / old["filename"]
                if stale.exists():
                    stale.unlink()

            shutil.copy(src, dest)
            media[gloss] = {
                "type": kind,
                "filename": dest.name,
                "url": f"/api/media/{dest.name}",
            }
            if old:
                replaced += 1
            else:
                added += 1
            print(f"  REF {gloss:<22} <- {root.name}/{class_dir.name}/{src.name}")

    MP.write_text(json.dumps(media, ensure_ascii=False, indent=2), encoding="utf-8")
    print()
    print(f"  entries: {before} -> {len(media)}  "
          f"(added {added}, replaced {replaced}, kept {kept})")

    # Cross-check against the model class lists so a key mismatch is loud.
    for classes_file in sorted(ROOT.glob("models/onnx_models/*/*classes*.json")):
        try:
            classes = json.loads(classes_file.read_text(encoding="utf-8"))
        except Exception:
            continue
        missing = [c for c in classes if c not in media]
        if missing:
            print(f"  WARNING: run {classes_file.parent.name}: "
                  f"{len(missing)}/{len(classes)} classes have no reference media "
                  f"-> {missing[:8]}{' ...' if len(missing) > 8 else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

---

# FILE: `train_holistic.py`

```python
"""
train_holistic.py — 258-dim daily-conversation model with NONE class + BiLSTM attention.

What makes this run different from train_daily6.py:

  * a NONE class, harvested from the rest frames either side of every sign, so
    an idle hand is recognised as "nothing was signed" instead of being forced
    into the nearest gloss;
  * a BiLSTM with attention pooling, so a sign performed in the middle of a
    32-frame window is read from where it happened, not only from the final
    hidden state;
  * stronger augmentation (temporal crop, speed warp, rotation, scale,
    translation, jitter) because 6 classes over a few clips per class is a very
    small training set.

Saves to models/onnx_models/<next_id>/ (the registry auto-discovers it).
Run:  & "tests\\.venv\\Scripts\\python.exe" train_holistic.py [--force] [--epochs 60]
"""

import argparse
import json
import sys
import time
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

# The feature contract is imported, never re-typed: the pose block written here
# must be the same 132 columns backend/extract.py serves, or the graph is trained
# on a tensor it will never see. See backend/pose.py.
from backend.pose import POSE_DIM, pose_from_landmarks  # noqa: E402

DS_CANDIDATES = [
    Path(r"D:\Download\Projects\Indian Sign Language_Dataset"),
    ROOT / "dataset" / "Indian Sign Language_Dataset",
]
DS = next((p for p in DS_CANDIDATES if p.exists() and (p / "ISL_VIDEO").exists()), None)
if DS is None:
    sys.exit("Dataset not found (ISL_VIDEO missing)")

VD = DS / "ISL_VIDEO"
RAW = ROOT / "dataset_train" / "daily_video"          # shared with train_daily6 (skip-existing)
MODELS = ROOT / "models" / "onnx_models"
MODELS.mkdir(parents=True, exist_ok=True)
RAW.mkdir(parents=True, exist_ok=True)

TARGETS = ["Good Morning", "Good afternoon", "Hello", "Hug", "What is your Name", "Drink"]
CLASSES = [t.upper().replace(" ", "_") for t in TARGETS] + ["NONE"]
SEQ_T, DIM = 32, 126 + POSE_DIM
AUG_K, EPOCHS, BS, LR = 6, 60, 32, 2e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# static_image_mode=False + 0.5 detection confidence, identical to
# backend/extract._get_holistic(), so extraction and serving walk the same
# tracker state machine.
_hol = mp.solutions.holistic.Holistic(static_image_mode=False, min_detection_confidence=0.5)


def frame_vec(bgr):
    """BYTE-IDENTICAL geometry to backend/extract.extract_holistic_frame."""
    res = _hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
    if not res.left_hand_landmarks or not res.right_hand_landmarks or res.pose_landmarks is None:
        return None
    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    pose = pose_from_landmarks(res.pose_landmarks)
    ref, scale = rh[0], np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh = (lh - ref) / scale
    rh = (rh - ref) / scale
    pose[:, :3] = (pose[:, :3] - ref) / scale
    return np.concatenate([lh.flatten(), rh.flatten(), pose.flatten()]).astype(np.float32)


def seq_from_video(path, start_frac, end_frac):
    """Even-sample SEQ_T frames between two fractions of the clip.

    ``start_frac``/``end_frac`` are what separate a sign from the NONE class:
    the same clip yields a signing sequence at 0.10–0.90 and a rest sequence at
    its head/tail, where the hands are down and the signer is idle.
    """
    cap = cv2.VideoCapture(str(path))
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None
    idxs = np.linspace(int(F * start_frac),
                       max(int(F * start_frac) + 1, int(F * end_frac) - 1),
                       SEQ_T).astype(int)
    out, last, good = [], None, 0
    for ix in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            out.append(None)
            continue
        v = frame_vec(fr)
        if v is not None:
            last = v
            good += 1
        out.append(v if v is not None else last)
    cap.release()
    if good < SEQ_T // 2:
        return None
    return np.array([o if o is not None else np.zeros(DIM, np.float32) for o in out], np.float32)


def build(force=False):
    print("=" * 70)
    print(" EXTRACTING (258-DIM HOLISTIC) + REST CLASS".center(70))
    print("=" * 70)
    t0 = time.time()

    for t in TARGETS:
        g = t.upper().replace(" ", "_")
        dest = RAW / f"{g}.npy"
        if not force and dest.exists():
            print(f"  SKIP {g}")
            continue
        vids = sorted((VD / t).glob("*.mp4")) if (VD / t).exists() else []
        seqs = [s for s in (seq_from_video(f, 0.10, 0.90) for f in vids) if s is not None]
        if seqs:
            np.save(dest, np.stack(seqs))
        print(f"  DONE {g}: {len(seqs)}/{len(vids)}")

    dest = RAW / "NONE.npy"
    if force or not dest.exists():
        idle = []
        for t in TARGETS:
            vids = sorted((VD / t).glob("*.mp4"))
            for f in vids[:4]:
                for a, b in ((0.0, 0.12), (0.88, 1.0)):     # pre/post-sign rest
                    s = seq_from_video(f, a, b)
                    if s is not None:
                        idle.append(s)
            # Frozen-hold negatives: one mid-sign frame repeated for SEQ_T
            # frames. This is exactly what live carry-forward produces after a
            # sign ends, and it is what run 7 kept reading as HUG.
            for f in vids[:6]:
                s = seq_from_video(f, 0.45, 0.55)
                if s is not None:
                    idle.append(np.repeat(s[16:17], SEQ_T, 0).astype(np.float32))
        # No-hands negative: the all-zero window the presence channels see
        # when the signer drops their hands out of frame.
        idle.append(np.zeros((SEQ_T, DIM), np.float32))
        if idle:
            np.save(dest, np.stack(idle))
            print(f"  DONE NONE: {len(idle)}")
    print(f"  extraction finished in {time.time() - t0:.1f}s")


# ─────────────────────────────────────────────
# AUGMENTATION
# ─────────────────────────────────────────────
def interp(s, ix):
    """Linear resample of a (T, D) sequence at fractional frame indices."""
    ix = np.clip(ix, 0, len(s) - 1)
    i0 = np.floor(ix).astype(int)
    i1 = np.minimum(i0 + 1, len(s) - 1)
    f = (ix - i0)[:, None]
    return (s[i0] * (1 - f) + s[i1] * f).astype(np.float32)


def aug(seq, rng):
    """Geometry-safe augmentation: no mirroring, pose sides stay fixed.

    A temporal crop is what teaches the network that a sign starting on frame 4
    or frame 9 is the same sign -- without it, the attention head learns the
    signing position rather than the signing movement.
    """
    s = seq.copy()

    if rng.random() < 0.5:
        a, b = int(rng.integers(0, 5)), SEQ_T - int(rng.integers(0, 5))
        s = interp(s[a:b], np.linspace(0, b - a - 1, SEQ_T))

    if rng.random() < 0.5:
        u = np.linspace(0, 1, SEQ_T) + rng.uniform(-0.2, 0.2) * np.sin(np.pi * np.linspace(0, 1, SEQ_T))
        s = interp(s, u * (SEQ_T - 1))

    h = s[:, :126].reshape(SEQ_T, 42, 3).copy()
    p = s[:, 126:].reshape(SEQ_T, 33, 4).copy()

    if rng.random() < 0.6:                                   # in-plane rotation
        th = rng.uniform(-0.3, 0.3)
        c, sn = np.cos(th), np.sin(th)
        R = np.array([[c, -sn], [sn, c]], np.float32).T
        h[:, :, :2] @= R
        p[:, :, :2] @= R

    if rng.random() < 0.6:                                   # scale (xyz only)
        f = rng.uniform(0.85, 1.15)
        h *= f
        p[:, :, :3] *= f

    if rng.random() < 0.5:                                   # translation (xy only)
        t = rng.uniform(-0.1, 0.1, 2).astype(np.float32)
        h[:, :, :2] += t
        p[:, :, :2] += t

    h += rng.normal(0, 0.01, h.shape).astype(np.float32)
    p[:, :, :3] += rng.normal(0, 0.01, p[:, :, :3].shape).astype(np.float32)

    return np.concatenate([h.reshape(SEQ_T, 126), p.reshape(SEQ_T, POSE_DIM)], 1).astype(np.float32)


class SeqDS(Dataset):
    """Class-pooled dataset: every real clip plus ``aug_k`` augmented copies."""

    def __init__(self, pools, aug_k, seed):
        self.pools = pools
        self.rng = np.random.default_rng(seed)
        self.items = []
        for ci, arr in enumerate(pools):
            for r in range(len(arr)):
                self.items.append((ci, r, 0))
                self.items += [(ci, r, k + 1) for k in range(aug_k)]

    def __len__(self):
        return len(self.items)

    def __getitem__(self, i):
        ci, r, k = self.items[i]
        s = self.pools[ci][r].copy()
        return torch.from_numpy(aug(s, self.rng) if k else s), ci


class DailyNet(nn.Module):
    """Velocity + hand-presence channels -> BiLSTM -> attention pool.

    Two extra channels are appended to every frame: the frame-to-frame delta
    (velocity) and a per-hand presence flag. The flag is what lets the network
    tell "hand at rest" from "hand not detected", which is the difference
    between NONE and a held sign; the delta is what makes the movement visible
    to a recurrent layer that would otherwise only see positions.

    Attention pooling replaces taking the last hidden state: a sign performed
    early in the window would be summarised by 30 frames of rest under the old
    head, and the whole point of the NONE class is that rest is not a sign.
    """

    def __init__(self, din, hid, n, drop=0.3):
        super().__init__()
        d = din * 2 + 2
        self.norm = nn.LayerNorm(d)
        self.proj = nn.Sequential(nn.Linear(d, hid), nn.GELU(), nn.Dropout(drop))
        self.lstm = nn.LSTM(hid, hid, 2, batch_first=True, bidirectional=True, dropout=drop)
        self.attn = nn.Linear(2 * hid, 1)
        self.head = nn.Sequential(nn.Dropout(drop), nn.Linear(2 * hid, n))

    def forward(self, x):
        delta = torch.cat([torch.zeros_like(x[:, :1]), x[:, 1:] - x[:, :-1]], 1)
        lm = (x[:, :, :63].abs().sum(-1, keepdim=True) > 0).to(x.dtype)
        rm = (x[:, :, 63:126].abs().sum(-1, keepdim=True) > 0).to(x.dtype)
        o, _ = self.lstm(self.proj(self.norm(torch.cat([x, delta, lm, rm], -1))))
        w = torch.softmax(self.attn(o), 1)
        return self.head((w * o).sum(1))


def next_model_id():
    return max([int(p.name) for p in MODELS.iterdir() if p.name.isdigit()], default=0) + 1


def train(epochs):
    print("=" * 70)
    print(" TRAINING DAILY LSTM (BiLSTM + ATTENTION, 258-DIM)".center(70))
    print("=" * 70)

    names, tr, va = [], [], []
    rng = np.random.default_rng(42)
    for c in CLASSES:
        p = RAW / f"{c}.npy"
        if not p.exists():
            print(f"  WARN {c}: no extracted data, class dropped")
            continue
        a = np.load(p)
        a = a[rng.permutation(len(a))]
        nv = max(2, int(0.2 * len(a)))
        va.append(a[:nv])
        tr.append(a[nv:])
        names.append(c)

    if len(names) < 2:
        print("  ERROR: fewer than two classes have data. Run extraction first.")
        return

    print(f"  CLASSES : {len(names)} ({', '.join(names)})")
    print(f"  FEATURE : {DIM}-dim | SEQ: {SEQ_T} frames | DEVICE: {DEVICE.upper()}")

    dl_tr = DataLoader(SeqDS(tr, AUG_K, 1), BS, shuffle=True)
    dl_va = DataLoader(SeqDS(va, 0, 2), 64)

    model = DailyNet(DIM, 128, len(names)).to(DEVICE)
    crit = nn.CrossEntropyLoss(label_smoothing=0.1)
    opt = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-2)
    sch = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=LR, total_steps=epochs * len(dl_tr))

    best, best_state, bad = -1.0, None, 0
    t0 = time.time()
    for e in range(1, epochs + 1):
        model.train()
        for xb, yb in dl_tr:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            loss = crit(model(xb), yb)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            opt.step()
            sch.step()

        model.eval()
        c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                c += (model(xb.to(DEVICE)).argmax(1) == yb.to(DEVICE)).sum().item()
                t += len(yb)
        acc = c / t * 100 if t else 0.0
        print(f"  Epoch {e:2d}/{epochs} | val {acc:5.1f}% | best {best:5.1f}% | "
              f"{time.time() - t0:5.1f}s")

        if acc > best:
            best, bad = acc, 0
            best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
        else:
            bad += 1
            if bad >= 15:
                print("  early stop")
                break

    model.load_state_dict(best_state)
    model.eval().cpu()

    mid = next_model_id()
    out = MODELS / str(mid)
    out.mkdir(parents=True, exist_ok=True)
    torch.onnx.export(
        model, torch.randn(1, SEQ_T, DIM), str(out / "sign_daily_lstm.onnx"),
        opset_version=18, input_names=["sequence"], output_names=["logits"],
        dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}},
    )
    json.dump(names, open(out / "sign_daily_classes.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    json.dump({"classes": len(names), "type": "daily_bilstm_attn", "feat": DIM,
               "seq_len": SEQ_T, "best_val_acc": best, "glosses": names},
              open(out / "daily_report.json", "w", encoding="utf-8"), indent=1)

    print("-" * 70)
    print(f"  saved models/onnx_models/{mid}/  (best {best:.1f}%)")
    print(f"  next: Admin -> Models Registry -> RESCAN -> SET ACTIVE")
    print(f"        a {DIM}-dim graph makes the backend select the holistic extractor")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-extract even if .npy exists")
    ap.add_argument("--epochs", type=int, default=EPOCHS)
    a = ap.parse_args()
    build(a.force)
    train(a.epochs)
```

---

# FILE: `train_unified.py`

```python
"""
train_unified.py — VIDEO-ONLY model for dynamic signs.
Auto-saves to onnx_models/<next_id>/ (e.g., onnx_models/1/, onnx_models/2/)
Modes: 1=extract video sequences  2=train + export ONNX  3=ALL
Run:  & "tests\.venv\Scripts\python.exe" train_unified.py
"""
import json
import time
import sys
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset

# ─────────────────────────────────────────────
# PATHS & CONFIG
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent
DS_CANDIDATES = [
    Path(r"D:\Download\Projects\Indian Sign Language_Dataset"),   # external location
    ROOT / "dataset" / "Indian Sign Language_Dataset",            # in-repo copy
]

# Robustly find the dataset path by checking for actual subdirectories
DS = None
for p in DS_CANDIDATES:
    if p.exists() and (p / "ISL_VIDEO").exists():
        DS = p
        break

if DS is None:
    print("=" * 70)
    print(" ERROR: DATASET NOT FOUND")
    print("=" * 70)
    print(" The script could not find the required dataset folders.")
    print(" Checked locations:")
    for p in DS_CANDIDATES:
        status = "EXISTS (but missing subfolders)" if p.exists() else "NOT FOUND"
        print(f"   - {p} [{status}]")
    print("\n Please ensure the dataset directory contains:")
    print("   - ISL_VIDEO/")
    sys.exit(1)

VD = DS / "ISL_VIDEO"
OUT = ROOT / "dataset_train"
RAW_V = OUT / "unified_video"

# Auto-versioning directory
ONNX_MODELS_DIR = ROOT / "onnx_models"
ONNX_MODELS_DIR.mkdir(parents=True, exist_ok=True)

for d in (OUT, RAW_V):
    d.mkdir(parents=True, exist_ok=True)

# Folder name -> official gloss token
GLOSS_OVERRIDE = {"Fedup": "FED_UP"}

def video_gloss(folder_name: str) -> str:
    return GLOSS_OVERRIDE.get(folder_name, folder_name.upper().replace(" ", "_"))

SEQ_T, DIM = 32, 126
AUG_VIDEO = 4
EPOCHS, BS, LR = 20, 64, 1e-3
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize MediaPipe ONCE
_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)

# ─────────────────────────────────────────────
# AUTO-VERSIONING HELPER
# ─────────────────────────────────────────────
def get_next_model_id() -> int:
    """Scans onnx_models/ for existing integer folders and returns the next ID."""
    existing_ids = []
    for p in ONNX_MODELS_DIR.iterdir():
        if p.is_dir() and p.name.isdigit():
            existing_ids.append(int(p.name))
    return max(existing_ids, default=0) + 1

# ─────────────────────────────────────────────
# UI / LOGGING HELPERS
# ─────────────────────────────────────────────
def print_header(title: str):
    width = 70
    print("\n" + "=" * width)
    print(f" {title}".center(width))
    print("=" * width)

class ProgressTracker:
    """Lightweight progress tracker with ETA calculation."""
    def __init__(self, total: int, prefix: str = ""):
        self.total = total
        self.prefix = prefix
        self.start_time = time.time()
        self.count = 0
        self.skipped_count = 0

    def update(self, item_name: str, skipped: bool = False):
        self.count += 1
        if skipped:
            self.skipped_count += 1
            
        elapsed = time.time() - self.start_time
        
        if self.count > 0:
            avg_time = elapsed / self.count
            remaining_time = avg_time * (self.total - self.count)
        else:
            remaining_time = 0
            
        elapsed_str = f"{int(elapsed//60)}m {int(elapsed%60)}s"
        eta_str = f"{int(remaining_time//60)}m {int(remaining_time%60)}s" if remaining_time > 60 else f"{int(remaining_time)}s"
            
        status = "SKIP" if skipped else "DONE"
        pct = (self.count / self.total) * 100
        
        line = f"\r  {self.prefix} [{self.count:3d}/{self.total}] ({pct:5.1f}%) | {status:4} | {item_name:<25} | Elapsed: {elapsed_str:>7} | ETA: {eta_str:>7}"
        sys.stdout.write(line.ljust(130)) 
        sys.stdout.flush()
        
        if self.count == self.total:
            sys.stdout.write("\n")
            sys.stdout.flush()
            print(f"  -> Summary: {self.total - self.skipped_count} processed, {self.skipped_count} skipped.")

# ─────────────────────────────────────────────
# EXTRACTION LOGIC
# ─────────────────────────────────────────────
def extract_two_hands(res):
    """IDENTICAL to backend/extract.py — do not change."""
    if not res.multi_hand_landmarks:
        return None
    left = right = None
    for hlm, hn in zip(res.multi_hand_landmarks, res.multi_handedness):
        lab = hn.classification[0].label
        pts = np.array([[p.x, p.y, p.z] for p in hlm.landmark], np.float32)
        if lab == "Left" and left is None: left = pts
        if lab == "Right" and right is None: right = pts
        
    ref = right if right is not None else left
    if ref is None: return None
    
    r0, scale = ref[0], np.linalg.norm(ref[9] - ref[0]) + 1e-6
    ol = (left - r0) / scale if left is not None else np.zeros((21, 3), np.float32)
    or_ = (right - r0) / scale if right is not None else np.zeros((21, 3), np.float32)
    return np.concatenate([ol.flatten(), or_.flatten()]).astype(np.float32)

def vec_from_bgr(frame):
    return extract_two_hands(_hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))

def resample(seq, t):
    if len(seq) == t: return seq.astype(np.float32)
    ix = np.linspace(0, len(seq) - 1, t)
    i0, i1 = ix.astype(int), np.minimum(ix.astype(int) + 1, len(seq) - 1)
    f = (ix - i0)[:, None]
    return (seq[i0] * (1 - f) + seq[i1] * f).astype(np.float32)

def extract_video_sequence(path):
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened(): 
        return None
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None
        
    frames, last, good = [], None, 0
    for ix in np.linspace(0, F - 1, SEQ_T).astype(int):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            frames.append(None)
            continue
        v = vec_from_bgr(fr)
        if v is not None:
            last = v
            good += 1
        frames.append(v if v is not None else last)
    cap.release()
    
    if good < SEQ_T // 2: return None
    return np.array([f if f is not None else np.zeros(DIM, np.float32) for f in frames], np.float32)

def build_video(force=False):
    print_header("EXTRACTING VIDEO SEQUENCES")
    dirs = sorted([d for d in VD.iterdir() if d.is_dir()])
    tracker = ProgressTracker(len(dirs), prefix="VIDEO ")
    
    for vd in dirs:
        gloss = video_gloss(vd.name)
        out_path = RAW_V / f"{gloss}.npy"
        
        if not force and out_path.exists():
            tracker.update(gloss, skipped=True)
            continue
            
        vids = sorted(vd.glob("*.mp4"))
        seqs = [s for s in (extract_video_sequence(f) for f in vids) if s is not None]
        
        if seqs: np.save(out_path, np.stack(seqs))
        tracker.update(gloss)

# ─────────────────────────────────────────────
# AUGMENTATION & DATASET
# ─────────────────────────────────────────────
def augment(seq, rng):
    s = seq.copy()
    if rng.random() < 0.5:
        L = s[:, :63].reshape(SEQ_T, 21, 3)
        R = s[:, 63:].reshape(SEQ_T, 21, 3)
        L[:, :, 0] *= -1; R[:, :, 0] *= -1
        s = np.concatenate([R.reshape(SEQ_T, 63), L.reshape(SEQ_T, 63)], axis=1)
    if rng.random() < 0.6:
        th = rng.uniform(-0.35, 0.35)
        c, sn = np.cos(th), np.sin(th)
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] = p[:, :, :2] @ np.array([[c, -sn], [sn, c]]).T
        s = p.reshape(SEQ_T, DIM)
        
    if rng.random() < 0.6: 
        s *= rng.uniform(0.85, 1.15)
        
    if rng.random() < 0.5:
        p = s.reshape(-1, 42, 3)
        p[:, :, :2] += rng.uniform(-0.12, 0.12, 2)
        s = p.reshape(SEQ_T, DIM)
        
    s += rng.normal(0, 0.006, s.shape).astype(np.float32)
    
    if rng.random() < 0.6:
        s = resample(s, int(rng.integers(24, 41)))
        s = resample(s, SEQ_T)
        
    return s.astype(np.float32)

# ─────────────────────────────────────────────
# MODEL & TRAINING
# ─────────────────────────────────────────────
class UniLSTM(nn.Module):
    def __init__(self, din, hid, n):
        super().__init__()
        self.lstm = nn.LSTM(din, hid, 2, batch_first=True, dropout=0.3)
        self.fc = nn.Linear(hid, n)

    def forward(self, x):
        o, _ = self.lstm(x)
        return self.fc(o[:, -1])

def train():
    print_header("TRAINING VIDEO-ONLY LSTM MODEL")
    video_names = sorted(p.stem for p in RAW_V.glob("*.npy"))
    
    classes = [c for c in video_names if (RAW_V / f"{c}.npy").exists()]
    total_classes = len(classes)
    
    if total_classes == 0:
        print("  ERROR: No extracted video data found. Run extraction first.")
        return

    # Auto-versioning logic
    model_id = get_next_model_id()
    model_dir = ONNX_MODELS_DIR / str(model_id)
    model_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"  VOCABULARY: {total_classes} video classes")
    print(f"  DEVICE: {DEVICE.upper()}")
    print(f"  EPOCHS: {EPOCHS} | BATCH SIZE: {BS} | LR: {LR}")
    print(f"  OUTPUT FOLDER: onnx_models/{model_id}/")
    print("-" * 70)
    
    rng = np.random.default_rng(42)
    train_pools, val_pools = [], []
    
    valid_class_indices = []
    for i, c in enumerate(classes):
        path = RAW_V / f"{c}.npy"
        try:
            arr = np.load(path)
            if arr.size == 0 or arr.ndim != 3:
                print(f"  WARNING: Skipping {c} due to invalid shape/size")
                continue
                
            arr = arr[rng.permutation(len(arr))]
            nv = max(1, int(0.15 * len(arr)))
            
            if len(arr) <= 1:
                 continue

            val_pools.append(arr[:nv])
            train_pools.append(arr[nv:])
            valid_class_indices.append(i)
            
        except Exception as e:
            print(f"  ERROR loading {c}: {e}")
            continue

    if not train_pools:
        print("  ERROR: No valid training data loaded.")
        return

    model_classes = len(train_pools)
    valid_classes_list = [classes[i] for i in valid_class_indices]
    
    class VideoDS(Dataset):
        def __init__(self, pool_data, aug_k, rng_seed):
            self.data = pool_data
            self.aug_k = aug_k
            self.rng = np.random.default_rng(rng_seed)
            self.items = []
            for ci, arr in enumerate(self.data):
                for r in range(len(arr)):
                    self.items.append((ci, r, 0))
                    for k in range(aug_k):
                        self.items.append((ci, r, k+1))
                        
        def __len__(self):
            return len(self.items)
            
        def __getitem__(self, idx):
            ci, r, copy = self.items[idx]
            seq = self.data[ci][r].copy()
            if copy > 0:
                seq = augment(seq, self.rng)
            return torch.from_numpy(seq), ci

    tr_v = VideoDS(train_pools, AUG_VIDEO, 2)
    va_v = VideoDS(val_pools, 0, 4)
    
    dl_tr = DataLoader(tr_v, BS, shuffle=True, drop_last=True)
    dl_va = DataLoader(va_v, 128)
    
    model = UniLSTM(DIM, 128, model_classes).to(DEVICE)
    crit, opt = nn.CrossEntropyLoss(), torch.optim.Adam(model.parameters(), LR)
    best = 0.0
    train_start = time.time()
    
    for e in range(EPOCHS):
        epoch_start = time.time()
        model.train()
        for xb, yb in dl_tr:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            loss = crit(model(xb), yb)
            loss.backward()
            opt.step()
            
        model.eval()
        c = t = 0
        with torch.no_grad():
            for xb, yb in dl_va:
                pr = model(xb.to(DEVICE)).argmax(1)
                yb = yb.to(DEVICE)
                c += (pr == yb).sum().item()
                t += len(yb)
                
        acc = c / t * 100 if t > 0 else 0
        best = max(best, acc)
        
        epoch_time = time.time() - epoch_start
        total_elapsed = time.time() - train_start
        avg_epoch_time = total_elapsed / (e + 1)
        eta = avg_epoch_time * (EPOCHS - (e + 1))
        
        print(f"  Epoch {e+1:2d}/{EPOCHS} | Val: {acc:5.1f}% (Best: {best:5.1f}%) | "
              f"Time: {epoch_time:5.1f}s | ETA: {eta/60:5.1f}m")
              
    print("-" * 70)
    print(f"  TRAINING COMPLETE. Best Val Acc: {best:.1f}% over {model_classes} video classes")
    print(f"  Total Training Time: {(time.time() - train_start)/60:.1f} minutes")
    
    print(f"\n  Exporting to onnx_models/{model_id}/ ...")
    model.eval().cpu()
    
    # Define exact output paths inside the new numbered folder
    out_model = model_dir / "sign_video_lstm.onnx"
    out_classes = model_dir / "sign_video_classes.json"
    out_report = model_dir / "video_report.json"
    
    torch.onnx.export(model, torch.randn(1, SEQ_T, DIM), str(out_model),
                      opset_version=18, input_names=["sequence"], output_names=["logits"],
                      dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
                      
    json.dump(valid_classes_list, open(out_classes, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump({"classes": model_classes, "static": 0, "video": model_classes,
               "best_val_acc": best, "seq_len": SEQ_T, "feat": DIM},
              open(out_report, "w", encoding="utf-8"), indent=1)
              
    print(f"  Saved to onnx_models/{model_id}/:")
    print(f"    - sign_video_lstm.onnx")
    if (model_dir / "sign_video_lstm.onnx.data").exists():
        print(f"    - sign_video_lstm.onnx.data")
    print(f"    - sign_video_classes.json")

# ─────────────────────────────────────────────
# MAIN EXECUTION
# ────────────────────────────────────────────
if __name__ == "__main__":
    print_header("WBSL BRIDGE - VIDEO-ONLY MODEL PIPELINE")
    print("  1 = Extract video sequences (skip existing)")
    print("  2 = Train video-only model + export ONNX")
    print("  3 = Run ALL (Extract + Train)")
    print("  4 = Force re-extract ALL (ignore existing)")
    print("  0 = Exit")
    
    sys.stdout.flush()
    time.sleep(1.5)
    
    ch = input("\nChoose an option: ").strip()
    
    if ch == "0":
        print("Exiting.")
        sys.exit(0)
        
    force = (ch == "4")
    
    if ch in ("1", "3", "4"):
        build_video(force=force)
    if ch in ("2", "3"):
        train()
        
    print_header("PIPELINE FINISHED SUCCESSFULLY")
```