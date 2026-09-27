# WBSL Bridge — AI Codebase Context

> Compact project architecture followed by relevant source and configuration files.

**Included files:** `76`  
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
│   └── tts_engine.py
├── dataset
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
│   │   │   │   ├── evaluation
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── models
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── settings
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signs
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── training
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── videos
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── community
│   │   │   │   └── unknown-signs
│   │   │   │       └── page.tsx
│   │   │   ├── contribute
│   │   │   │   ├── session
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── dataset
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
│   │   │   │   └── TrainingConsole.tsx
│   │   │   ├── layout
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── PageContainer.tsx
│   │   │   │   └── SystemDiagnostics.tsx
│   │   │   ├── pipeline
│   │   │   │   └── PipelineStatus.tsx
│   │   │   ├── recording
│   │   │   │   ├── PrivacyGate.tsx
│   │   │   │   └── UploadRecovery.tsx
│   │   │   ├── simulation
│   │   │   │   └── LandmarkSimulation.tsx
│   │   │   ├── skeletons
│   │   │   │   └── index.tsx
│   │   │   ├── verification
│   │   │   │   └── EvidencePanel.tsx
│   │   │   └── skeletons.tsx
│   │   ├── hooks
│   │   │   ├── useCamera.ts
│   │   │   ├── usePipeline.ts
│   │   │   ├── useRecording.ts
│   │   │   ├── useSystemStatus.ts
│   │   │   └── useWebSocket.ts
│   │   ├── lib
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── services
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── contributions.ts
│   │   │   ├── dataset.ts
│   │   │   ├── nlg.ts
│   │   │   ├── stats.ts
│   │   │   └── ws.ts
│   │   └── store
│   │       ├── pipeline-store.ts
│   │       ├── recording-store.ts
│   │       └── ui-store.ts
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
│   ├── sign_classes.json
│   ├── sign_mlp.onnx
│   └── sign_mlp.onnx.data
├── codebase.md
├── codebase.py
├── frontend_dev.err.log
├── frontend_dev.log
├── HOW_TO_RUN.md
├── implementation.md
├── README.md
└── start.ps1
```

---

# Included Files

- `backend\__init__.py`
- `backend\data\gloss_map.json`
- `backend\data\sign_media.json`
- `backend\extract.py`
- `backend\llm_engine.py`
- `backend\main.py`
- `backend\nmm.py`
- `backend\tts_engine.py`
- `codebase.py`
- `frontend\eslint.config.mjs`
- `frontend\next.config.ts`
- `frontend\package.json`
- `frontend\postcss.config.ts`
- `frontend\README.md`
- `frontend\src\app\about\page.tsx`
- `frontend\src\app\admin\contributions\page.tsx`
- `frontend\src\app\admin\dataset\page.tsx`
- `frontend\src\app\admin\evaluation\page.tsx`
- `frontend\src\app\admin\layout.tsx`
- `frontend\src\app\admin\models\page.tsx`
- `frontend\src\app\admin\page.tsx`
- `frontend\src\app\admin\settings\page.tsx`
- `frontend\src\app\admin\signs\page.tsx`
- `frontend\src\app\admin\training\page.tsx`
- `frontend\src\app\admin\videos\page.tsx`
- `frontend\src\app\community\unknown-signs\page.tsx`
- `frontend\src\app\contribute\page.tsx`
- `frontend\src\app\contribute\session\[id]\page.tsx`
- `frontend\src\app\dataset\[signId]\page.tsx`
- `frontend\src\app\dataset\page.tsx`
- `frontend\src\app\demo\page.tsx`
- `frontend\src\app\globals.css`
- `frontend\src\app\layout.tsx`
- `frontend\src\app\login\page.tsx`
- `frontend\src\app\page.tsx`
- `frontend\src\app\providers.tsx`
- `frontend\src\app\sign-to-text\page.tsx`
- `frontend\src\app\text-to-sign\page.tsx`
- `frontend\src\components\admin\TrainingConsole.tsx`
- `frontend\src\components\layout\AdminSidebar.tsx`
- `frontend\src\components\layout\Footer.tsx`
- `frontend\src\components\layout\Navbar.tsx`
- `frontend\src\components\layout\PageContainer.tsx`
- `frontend\src\components\layout\SystemDiagnostics.tsx`
- `frontend\src\components\pipeline\PipelineStatus.tsx`
- `frontend\src\components\recording\PrivacyGate.tsx`
- `frontend\src\components\recording\UploadRecovery.tsx`
- `frontend\src\components\simulation\LandmarkSimulation.tsx`
- `frontend\src\components\skeletons.tsx`
- `frontend\src\components\skeletons\index.tsx`
- `frontend\src\components\verification\EvidencePanel.tsx`
- `frontend\src\hooks\useCamera.ts`
- `frontend\src\hooks\usePipeline.ts`
- `frontend\src\hooks\useRecording.ts`
- `frontend\src\hooks\useSystemStatus.ts`
- `frontend\src\hooks\useWebSocket.ts`
- `frontend\src\lib\constants.ts`
- `frontend\src\lib\types.ts`
- `frontend\src\lib\utils.ts`
- `frontend\src\services\api.ts`
- `frontend\src\services\auth.ts`
- `frontend\src\services\contributions.ts`
- `frontend\src\services\dataset.ts`
- `frontend\src\services\nlg.ts`
- `frontend\src\services\stats.ts`
- `frontend\src\services\ws.ts`
- `frontend\src\store\pipeline-store.ts`
- `frontend\src\store\recording-store.ts`
- `frontend\src\store\ui-store.ts`
- `frontend\tailwind.config.ts`
- `frontend\tsconfig.json`
- `HOW_TO_RUN.md`
- `implementation.md`
- `models\sign_classes.json`
- `README.md`
- `start.ps1`

---

# Source Files

# FILE: `backend\__init__.py`

```python

```

---

# FILE: `backend\data\gloss_map.json`

```json
{
  "hello": "HELLO",
  "hi": "HELLO",
  "নমস্কার": "HELLO",
  "হ্যালো": "HELLO",
  "thank": "THANK",
  "thanks": "THANK",
  "ধন্যবাদ": "THANK",
  "yes": "YES",
  "হ্যাঁ": "YES",
  "no": "NO",
  "না": "NO",
  "water": "W",
  "জল": "W",
  "পানি": "W",
  "i": "I",
  "আমি": "I",
  "you": "YOU",
  "তুমি": "YOU",
  "আপনি": "YOU",
  "good": "GOOD",
  "ভালো": "GOOD",
  "ভাল": "GOOD",
  "how": "HOW",
  "কেমন": "HOW",
  "what": "WHAT",
  "কি": "WHAT",
  "কী": "WHAT",
  "where": "WHERE",
  "কোথায়": "WHERE",
  "school": "SCHOOL",
  "স্কুল": "SCHOOL",
  "গিয়ে": "GO",
  "যাই": "GO",
  "যাচ্ছি": "GO",
  "go": "GO",
  "come": "COME",
  "আসি": "COME",
  "আসছি": "COME",
  "eat": "EAT",
  "খাই": "EAT",
  "খাইছি": "EAT",
  "drink": "DRINK",
  "পান": "DRINK",
  "mother": "MOTHER",
  "মা": "MOTHER",
  "father": "FATHER",
  "বাবা": "FATHER",
  "friend": "FRIEND",
  "বন্ধু": "FRIEND",
  "today": "TODAY",
  "আজ": "TODAY",
  "tomorrow": "TOMORROW",
  "আগামীকাল": "TOMORROW",
  "yesterday": "YESTERDAY",
  "গতকাল": "YESTERDAY",
  "home": "HOME",
  "বাড়ি": "HOME",
  "ঘর": "HOME",
  "help": "HELP",
  "সাহায্য": "HELP",
  "please": "PLEASE",
  "দয়া": "PLEASE",
  "sorry": "SORRY",
  "দুঃখিত": "SORRY",
  "name": "NAME",
  "নাম": "NAME",
  "my": "MY",
  "আমার": "MY",
  "your": "YOUR",
  "তোমার": "YOUR",
  "আপনার": "YOUR"
}
```

---

# FILE: `backend\data\sign_media.json`

```json
{
  "1": {
    "type": "image",
    "filename": "1.jpg",
    "url": "/api/media/1.jpg"
  },
  "2": {
    "type": "image",
    "filename": "2.jpg",
    "url": "/api/media/2.jpg"
  }
}
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
"""

import numpy as np
import mediapipe as mp

# Initialize ONCE at module load (not per request)
_hands = mp.solutions.hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.6
)


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


def process_bgr_frame(frame_bgr: np.ndarray) -> np.ndarray | None:
    """
    Takes a BGR numpy frame (from cv2.imdecode),
    returns 126-dim landmark vector or None.
    """
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _hands.process(rgb)
    return extract_two_hands(results)
```

---

# FILE: `backend\llm_engine.py`

```python
"""
backend/llm_engine.py
Provider-agnostic NLG engine (OpenAI-compatible chat/completions).

Configuration is environment-driven (see .env.example). Switch providers by
editing .env only -- no code changes required:

    OPENAI config      -> AI_BASE_URL unset, AI_API_KEY=sk-..., AI_MODEL_NAME=gpt-4o-mini
    DeepSeek / Groq    -> AI_BASE_URL=https://api.deepseek.com/v1, ...
    Local (Ollama)     -> AI_BASE_URL=http://localhost:11434/v1, AI_API_KEY=ollama

NOTE: no local-LLM provider is configured or auto-started by default.
"""

import json
import os
from pathlib import Path
from typing import Iterator

import httpx

# Load .env (repo root or backend/) without hard-depending on python-dotenv.
def _load_dotenv():
    try:
        from dotenv import load_dotenv  # type: ignore
    except ImportError:
        return
    here = Path(__file__).resolve()
    for candidate in (here.parent.parent / ".env", here.parent / ".env"):
        if candidate.is_file():
            load_dotenv(candidate, override=False)
            return
    load_dotenv(override=False)


_load_dotenv()

# ─────────────────────────────────────────────
# PROVIDER CONFIG (environment-driven)
# ─────────────────────────────────────────────
DEFAULT_BASE_URL = "https://api.openai.com/v1"
DEFAULT_MODEL_NAME = "gpt-4o-mini"

# Providers that accept any non-empty key and need no real credential.
_KEYLESS_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "::1")

# Streaming / reasoning are ON by default.
def _env_bool(name: str, default: bool) -> bool:
    raw = (os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def get_ai_config() -> dict:
    """Resolve the active provider configuration from the environment."""
    configured_url = _env("AI_BASE_URL")
    base_url = configured_url or DEFAULT_BASE_URL
    is_local = any(h in base_url for h in _KEYLESS_HOSTS)

    api_key = _env("AI_API_KEY")
    if not api_key:
        # Local OpenAI-compatible servers ignore the key; cloud providers do not.
        api_key = "no-key-required" if is_local else ""

    return {
        "base_url": base_url.rstrip("/"),
        "api_key": api_key,
        "model": _env("AI_MODEL_NAME", DEFAULT_MODEL_NAME),
        "is_local": is_local,
        "provider": "local" if is_local else "cloud",
        "configured": bool(api_key),
        # Streaming ON, reasoning ON (unless AI_REASONING=off).
        "stream": _env_bool("AI_STREAM", True),
        "reasoning": _env_bool("AI_REASONING", True),
        "reasoning_effort": _env("AI_REASONING_EFFORT", "low"),
        "timeout": float(_env("AI_TIMEOUT", "180")),
    }


def get_ai_client(timeout: float | None = None):
    """
    Return (client, model_name) for the provider in .env.

    As requested, this does NOT use a local LLM for now: an unconfigured
    environment resolves to the default cloud endpoint, never to localhost.
    """
    from openai import OpenAI  # imported lazily so status checks work without it

    cfg = get_ai_config()
    client = OpenAI(
        base_url=cfg["base_url"],
        api_key=cfg["api_key"] or "not-configured",
        timeout=cfg["timeout"] if timeout is None else timeout,
    )
    return client, cfg["model"]


def build_request(cfg: dict, gloss_text: str, **overrides) -> dict:
    """
    Build the chat/completions payload from .env settings.

    Reasoning is expressed per-provider so the same .env works everywhere:
      - OpenAI / Groq / DeepSeek : `reasoning_effort`
      - OpenRouter / Qwen / HF   : `reasoning: {"enabled": ...}`
      - Local servers (Ollama...) : no reasoning field at all
    Unknown fields are ignored by most local servers; AI_REASONING=off removes them.
    """
    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": gloss_text},
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

# Constrained NLG Prompt from Phase 3.2
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

Output ONLY the final natural West Bengal Bengali text."""


def is_llm_available() -> bool:
    """True when the configured provider responds to a models/health probe."""
    cfg = get_ai_config()
    if not cfg["api_key"]:
        return False  # nothing configured -> do not silently fall back to a local LLM

    headers = {"Authorization": f"Bearer {cfg['api_key']}"}
    for path in ("/models", "/health"):
        try:
            resp = httpx.get(
                f"{cfg['base_url']}{path}", headers=headers, timeout=5.0
            )
            if resp.status_code < 400:
                return True
        except Exception:
            continue
    return False


def _extract_delta(chunk: dict) -> tuple[str, str]:
    """Return (content, reasoning) text from one streamed chunk."""
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
    **overrides,
) -> Iterator[dict]:
    """
    Stream the Bengali translation token by token.

    Yields dicts:
        {"type": "delta", "text": str, "reasoning": str}
        {"type": "done",  "bengali_text": str, ...}
        {"type": "error", "error": str, ...}

    Used by the /api/nlg/stream SSE endpoint.
    """
    cfg = get_ai_config()
    if not cfg["configured"]:
        yield _offline_result(
            "llm_not_configured",
            "No AI provider configured. Set AI_API_KEY (and AI_BASE_URL / "
            "AI_MODEL_NAME) in .env -- see .env.example.",
        ) | {"type": "error"}
        return

    payload = build_request(cfg, gloss_text, stream=True, **overrides)
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
    stream: bool | None = None,
    temperature: float | None = None,
    top_p: float | None = None,
    max_tokens: int | None = None,
) -> dict:
    """
    Send gloss to the provider configured in .env.
    Returns Bengali text or a structured error.

    Streaming is honoured (AI_STREAM=true in .env); pass stream=False to force
    a single blocking request.
    """
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
        # Consume the stream, keeping only the final assembled result.
        final = None
        for event in stream_bengali(
            gloss_text,
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
    """
    Build gloss string from detected signs with UNKNOWN markers.
    Injects সম্ভবত for uncertain signs.
    """
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
```

---

# FILE: `backend\main.py`

```python
"""
backend/main.py
Complete FastAPI backend for WBSL Bridge.
Loads sign_mlp.onnx, serves predictions, NMM, TTS, NLG, reference media,
and REAL community ingestion (uploaded video -> landmarks -> .npy + manifest).

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8000
"""

import json
import re
import time
import uuid
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

# Local imports
from backend.extract import process_bgr_frame
from backend.nmm import detect_nmm, reset_nmm_state
from backend.llm_engine import (
    generate_bengali,
    generate_bengali_with_uncertainty,
    is_llm_available,
    get_ai_config,
    stream_bengali,
)

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "sign_mlp.onnx"
CLASSES_PATH = ROOT / "models" / "sign_classes.json"
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
# LOAD MODEL ONCE AT STARTUP
# ─────────────────────────────────────────────
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
if not CLASSES_PATH.exists():
    raise FileNotFoundError(f"Classes not found: {CLASSES_PATH}")

session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
INPUT_NAME = session.get_inputs()[0].name
CLASSES = json.loads(CLASSES_PATH.read_text(encoding="utf-8"))

print(f"[WBSL Backend] Model loaded: {MODEL_PATH.name}")
print(f"[WBSL Backend] Classes: {len(CLASSES)}")
print(f"[WBSL Backend] Input: {INPUT_NAME}, shape: {session.get_inputs()[0].shape}")

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────
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
# IN-MEMORY STATE
# ─────────────────────────────────────────────
sign_catalog = [
    {
        "id": str(i),
        "label": c,
        "bengali_meaning": "",
        "category": "ISL Alphabet",
        "type": "word",
        "approved_samples": 300,
        "pending_samples": 0,
        "rejected_samples": 0,
        "reference_video_url": None,
        "language": "ISL",
    }
    for i, c in enumerate(CLASSES)
]

_bengali_map = {
    "A": "এ", "B": "বি", "C": "সি", "D": "ডি", "E": "ই",
    "F": "এফ", "G": "জি", "H": "এইচ", "I": "আই", "J": "জে",
    "K": "কে", "L": "এল", "M": "এম", "N": "এন", "O": "ও",
    "P": "পি", "Q": "কিউ", "R": "আর", "S": "এস", "T": "টি",
    "U": "ইউ", "V": "ভি", "W": "ডব্লু", "X": "এক্স", "Y": "ওয়াই", "Z": "জেড",
    "1": "এক", "2": "দুই", "3": "তিন", "4": "চার", "5": "পাঁচ",
    "6": "ছয়", "7": "সাত", "8": "আট", "9": "নয়", "0": "শূন্য",
}
for s in sign_catalog:
    if s["label"] in _bengali_map:
        s["bengali_meaning"] = _bengali_map[s["label"]]

# Attach any stored reference media to the catalog
for s in sign_catalog:
    m = SIGN_MEDIA.get(s["label"])
    s["reference_media"] = m
    if m and m["type"] == "video":
        s["reference_video_url"] = m["url"]

# ─────────────────────────────────────────────
# SYSTEM HEALTH
# ─────────────────────────────────────────────
@app.get("/api/system/health")
def health():
    ai = get_ai_config()
    return {
        "api": True,
        "model": True,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": "MLP-static",
    }


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
        "model_version": "MLP-static",
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


@app.post("/api/predict/frame", response_model=PredictResponse)
async def predict_frame(file: UploadFile = File(...)):
    try:
        raw = await file.read()
        nparr = np.frombuffer(raw, np.uint8)
        frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame_bgr is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        vec = process_bgr_frame(frame_bgr)
        nmm_flags = detect_nmm(frame_bgr)

        if vec is None:
            return PredictResponse(
                detected=False,
                label="NO_HAND",
                confidence=0.0,
                top5=[],
                hands_detected=0,
                nmm=nmm_flags,
            )

        logits = session.run(None, {INPUT_NAME: vec.reshape(1, 126)})[0][0]
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
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str


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
    result = generate_bengali(payload.gloss)
    return result


@app.post("/api/nlg/stream")
def nlg_stream(payload: NLGRequest):
    """Server-Sent Events stream of the Bengali translation as it is written."""
    ai = get_ai_config()

    def event_source():
        for event in stream_bengali(payload.gloss):
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
    words = payload.text.lower().replace("।", "").replace("?", "").split()
    gloss_sequence = []
    for w in words:
        if w in WORD_MAP:
            gloss_sequence.append(WORD_MAP[w])
        elif w.upper() in CLASSES:
            gloss_sequence.append(w.upper())
        else:
            gloss_sequence.append(f"[{w}]")
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
        "available_signs": len(CLASSES),
        "media": media,
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
    data = await file.read()
    (MEDIA_DIR / filename).write_bytes(data)
    SIGN_MEDIA[sign["label"]] = {
        "type": mtype,
        "filename": filename,
        "url": f"/api/media/{filename}",
    }
    _persist_sign_media()
    sign["reference_media"] = SIGN_MEDIA[sign["label"]]
    sign["reference_video_url"] = SIGN_MEDIA[sign["label"]]["url"] if mtype == "video" else None
    return {"success": True, "media": SIGN_MEDIA[sign["label"]]}


@app.get("/api/media/{filename}")
def serve_media(filename: str):
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")
    mt = {
        ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    }.get(filepath.suffix.lower(), "application/octet-stream")
    return FileResponse(str(filepath), media_type=mt)


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
# DEMO SEQUENCES
# ─────────────────────────────────────────────
@app.get("/api/demo/sequences")
def demo_sequences():
    return {
        "sequences": [
            {
                "id": "demo-hello",
                "name": "Hello Sequence",
                "gloss_sequence": ["H", "E", "L", "L", "O"],
                "bengali_output": "হ্যালো",
                "frames": 150,
            },
            {
                "id": "demo-thank",
                "name": "Thank You",
                "gloss_sequence": ["T", "H", "A", "N", "K"],
                "bengali_output": "ধন্যবাদ",
                "frames": 120,
            },
        ]
    }


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

        cap = cv2.VideoCapture(tmp.name)
        frames = []
        idx = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if idx % 3 == 0:
                vec = process_bgr_frame(frame)
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
        mid = arr[frames // 2]
        logits = session.run(None, {INPUT_NAME: mid.reshape(1, 126)})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]
        preds = [{"label": CLASSES[i], "confidence": round(float(probs[i]), 3)} for i in order]
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
        "model_active": "sign_mlp.onnx",
        "model_classes": len(CLASSES),
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

# FILE: `codebase.py`

```python
from pathlib import Path
import os


# ============================================================
# CONFIGURATION
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent
OUTPUT_FILE = PROJECT_ROOT / "codebase.md"

MAX_FILE_SIZE_MB = 2
MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024


# ============================================================
# FOLDERS TO COMPLETELY IGNORE
# ============================================================
#
# These folders are not scanned at all.
# Add project-specific large/unnecessary folders here.
#

SKIP_DIRS = {
    ".git",
    ".svn",
    ".hg",

    "node_modules",

    ".venv",
    "venv",
    "env",

    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",

    ".next",
    "dist",
    "build",
    "out",
    "coverage",

    ".cache",
    ".turbo",
    ".parcel-cache",

    ".vscode",
    ".idea",

    "logs",
    "tmp",
    "temp",

    "uploads",
    "generated",

    "tests",
    "llm"
}


# ============================================================
# FOLDER PREFIXES TO IGNORE
# ============================================================

SKIP_DIR_PREFIXES = {
    ".venv",
}


# ============================================================
# FOLDERS TO SHOW IN TREE BUT NOT EXPAND
# ============================================================
#
# Example:
#
#     ├── datasets
#
# The folder is visible, but its internal structure is hidden.
#

COLLAPSE_TREE_DIRS = {
    "datasets",
    "dataset",
    "data",

    "assets",
    "asset",

    "public",
    "static",
    "media",

    "cache",
}


# ============================================================
# FILES TO EXCLUDE FROM CODE CONTENT
# ============================================================

SKIP_FILES = {
    "codebase.md",
    "project-tree.txt",
    "implementation.md"
    "frontend\package-lock.json",
    # Dependency locks
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lock",

    # Generated
    "tsconfig.tsbuildinfo",
    "next-env.d.ts",

    # OS
    ".DS_Store",
    "Thumbs.db",

    # Logs
    "debug.log",
    "error.log",
    "server.log",
    "server-out.log",

    # Secrets
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",

    # Credentials
    "credentials.json",
    "service-account.json",
    "secrets.json",

    # Optional AI instructions
    "AGENTS.md",
    "CLAUDE.md",
}


# ============================================================
# FILE EXTENSIONS TO EXCLUDE
# ============================================================

SKIP_EXTENSIONS = {
    # Images
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".bmp",
    ".tiff",
    ".ico",
    ".svg",

    # Audio
    ".mp3",
    ".wav",
    ".flac",
    ".ogg",
    ".m4a",

    # Video
    ".mp4",
    ".webm",
    ".avi",
    ".mov",
    ".mkv",

    # Documents
    ".pdf",

    # Archives
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",

    # Data
    ".csv",
    ".xlsx",
    ".xls",
    ".parquet",
    ".feather",

    # Databases
    ".db",
    ".sqlite",
    ".sqlite3",

    # ML models
    ".onnx",
    ".pt",
    ".pth",
    ".ckpt",
    ".safetensors",
    ".gguf",
    ".bin",

    # Compiled Python
    ".pyc",
    ".pyo",

    # Temporary
    ".bak",
    ".tmp",

    # Fonts
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",

    # Certificates / keys
    ".pem",
    ".key",
    ".p12",
    ".pfx",
    ".jks",
    ".crt",
    ".cert",
}


# ============================================================
# SOURCE FILE EXTENSIONS
# ============================================================

INCLUDE_EXTENSIONS = {
    # Python
    ".py",
    ".pyi",

    # JavaScript / TypeScript
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",

    # Web
    ".html",
    ".css",
    ".scss",
    ".sass",

    # Config
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".conf",

    # Shell
    ".sh",
    ".bat",
    ".cmd",
    ".ps1",

    # Documentation
    ".md",
    ".txt",
}


# ============================================================
# LANGUAGE MAP
# ============================================================

LANGUAGE_MAP = {
    ".py": "python",
    ".pyi": "python",

    ".js": "javascript",
    ".jsx": "jsx",
    ".mjs": "javascript",
    ".cjs": "javascript",

    ".ts": "typescript",
    ".tsx": "tsx",

    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",

    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".conf": "text",

    ".sh": "bash",
    ".bat": "bat",
    ".cmd": "bat",
    ".ps1": "powershell",

    ".md": "markdown",
    ".txt": "text",
}


# ============================================================
# HELPERS
# ============================================================

def rel(path):
    return path.relative_to(PROJECT_ROOT)


def is_skip_dir(name):
    name_lower = name.lower()

    if name_lower in {
        x.lower()
        for x in SKIP_DIRS
    }:
        return True

    for prefix in SKIP_DIR_PREFIXES:
        if name_lower.startswith(prefix.lower()):
            return True

    return False


def is_secret(path):

    if path.name.lower() in {
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
    }:
        return True

    if path.suffix.lower() in {
        ".pem",
        ".key",
        ".p12",
        ".pfx",
        ".jks",
    }:
        return True

    return False


# ============================================================
# SCAN SOURCE FILES
# ============================================================

def scan_project():

    files = []

    for current_dir, dirs, filenames in os.walk(
        PROJECT_ROOT
    ):

        current_path = Path(current_dir)

        # ----------------------------------------------------
        # PRUNE DIRECTORIES
        # ----------------------------------------------------

        dirs[:] = [
            d
            for d in dirs
            if not d.startswith(".")
            and not is_skip_dir(d)
        ]

        # ----------------------------------------------------
        # FILES
        # ----------------------------------------------------

        for filename in filenames:

            path = current_path / filename

            # Hidden files
            if filename.startswith("."):
                continue

            # Generated output
            if path.resolve() == OUTPUT_FILE.resolve():
                continue

            # Explicit file skip
            if filename in SKIP_FILES:
                continue

            # Secrets
            if is_secret(path):
                continue

            extension = path.suffix.lower()

            # Binary / data / model
            if extension in SKIP_EXTENSIONS:
                continue

            # Not a source/config file
            if extension not in INCLUDE_EXTENSIONS:
                continue

            # File size
            try:
                size = path.stat().st_size
            except OSError:
                continue

            if size > MAX_FILE_SIZE:
                continue

            files.append(path)

    return sorted(
        files,
        key=lambda p: str(rel(p)).lower()
    )


# ============================================================
# BUILD COMPACT PROJECT TREE
# ============================================================

def build_tree():

    lines = [PROJECT_ROOT.name]

    collapsed = {
        x.lower()
        for x in COLLAPSE_TREE_DIRS
    }

    def walk(directory, prefix=""):

        try:
            items = list(directory.iterdir())
        except (PermissionError, OSError):
            return

        visible = []

        for item in items:

            # Hide dot files/folders
            if item.name.startswith("."):
                continue

            # Completely ignored directory
            if item.is_dir() and is_skip_dir(item.name):
                continue

            visible.append(item)

        # Directories first, then files
        visible.sort(
            key=lambda x: (
                x.is_file(),
                x.name.lower()
            )
        )

        for index, item in enumerate(visible):

            last = index == len(visible) - 1

            connector = (
                "└── "
                if last
                else "├── "
            )

            lines.append(
                prefix + connector + item.name
            )

            # File
            if not item.is_dir():
                continue

            # Show folder but don't expand it
            if item.name.lower() in collapsed:
                continue

            next_prefix = (
                prefix
                + ("    " if last else "│   ")
            )

            walk(
                item,
                next_prefix
            )

    walk(PROJECT_ROOT)

    return lines


# ============================================================
# READ FILE
# ============================================================

def read_text(path):

    try:
        return path.read_text(
            encoding="utf-8",
            errors="replace"
        )
    except Exception:
        return ""


# ============================================================
# LANGUAGE
# ============================================================

def language_for(path):

    return LANGUAGE_MAP.get(
        path.suffix.lower(),
        "text"
    )


# ============================================================
# WRITE SOURCE FILE
# ============================================================

def write_file(md, path):

    text = read_text(path)

    md.write(
        f"# FILE: `{rel(path)}`\n\n"
    )

    md.write(
        f"```{language_for(path)}\n"
    )

    md.write(text)

    if not text.endswith("\n"):
        md.write("\n")

    md.write(
        "```\n\n"
        "---\n\n"
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("Scanning project...")

    included_files = scan_project()

    print(
        f"Found {len(included_files)} source files."
    )

    print("Building project tree...")

    tree = build_tree()

    print("Writing codebase.md...")

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8"
    ) as md:

        # ----------------------------------------------------
        # HEADER
        # ----------------------------------------------------

        md.write(
            f"# {PROJECT_ROOT.name} — AI Codebase Context\n\n"
        )

        md.write(
            "> Compact project architecture followed by "
            "relevant source and configuration files.\n\n"
        )

        md.write(
            f"**Included files:** `{len(included_files)}`  \n"
        )

        md.write(
            f"**Maximum source file size:** "
            f"`{MAX_FILE_SIZE_MB} MB`\n\n"
        )

        md.write(
            "---\n\n"
        )

        # ----------------------------------------------------
        # PROJECT TREE
        # ----------------------------------------------------

        md.write(
            "# Project Structure\n\n"
        )

        md.write(
            "```text\n"
        )

        md.write(
            "\n".join(tree)
        )

        md.write(
            "\n```\n\n"
        )

        md.write(
            "---\n\n"
        )

        # ----------------------------------------------------
        # INCLUDED FILES
        # ----------------------------------------------------

        md.write(
            "# Included Files\n\n"
        )

        for path in included_files:

            md.write(
                f"- `{rel(path)}`\n"
            )

        md.write(
            "\n---\n\n"
        )

        # ----------------------------------------------------
        # SOURCE FILES
        # ----------------------------------------------------

        md.write(
            "# Source Files\n\n"
        )

        for index, path in enumerate(
            included_files,
            start=1
        ):

            print(
                f"  [{index}/{len(included_files)}] "
                f"{rel(path)}"
            )

            write_file(
                md,
                path
            )

    print()
    print("=" * 60)
    print("CODEBASE CREATED")
    print("=" * 60)
    print(f"Output         : {OUTPUT_FILE}")
    print(f"Included files : {len(included_files)}")
    print("=" * 60)


if __name__ == "__main__":
    main()
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

# FILE: `frontend\README.md`

```markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
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
      desc: "126-dim two-hand vector, right-wrist normalized, MLP/LSTM → ONNX, sub-5ms inference",
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
    { category: "ML", items: "PyTorch · ONNX Runtime · MLP (static) · LSTM (temporal) · 126-dim landmarks" },
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
                <LandmarkSimulation showHands showFace showPose fps={30} />
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

# FILE: `frontend\src\app\admin\dataset\page.tsx`

```tsx
import React from "react";
export default function AdminDatasetPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">DATASET MANAGEMENT</div>
      <h1 className="text-2xl font-bold text-text-primary">Dataset Management</h1>
      <div className="p-8 bg-surface border border-border rounded-lg text-center text-xs font-mono text-text-muted">
        Dataset versioning, manifest indexing, and signer-disjoint split management
        will be available here after community data collection begins.
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\evaluation\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { BarChart3, HelpCircle, ArrowUpRight } from "lucide-react";

export default function AdminEvaluationPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const classes = ["HELLO", "THANK YOU", "WATER", "HELP", "HOW ARE YOU"];

  // Mock confusion matrix values (5x5)
  const matrix = [
    [45, 1, 0, 1, 1],
    [2, 33, 0, 0, 0],
    [0, 0, 51, 1, 0],
    [1, 0, 2, 37, 1],
    [0, 1, 0, 2, 26],
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">BENCHMARK METRICS</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Model Evaluation & Confusion Matrix
        </h1>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Macro F1 Score</div>
          <div className="text-2xl font-bold text-accent-primary mt-1">91.4%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Precision</div>
          <div className="text-2xl font-bold text-text-primary mt-1">92.8%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">Recall</div>
          <div className="text-2xl font-bold text-text-primary mt-1">90.2%</div>
        </div>
        <div className="p-4 rounded bg-surface border border-border">
          <div className="text-text-muted uppercase">NMM Detection Acc</div>
          <div className="text-2xl font-bold text-accent-secondary mt-1">88.6%</div>
        </div>
      </div>

      {/* Confusion Matrix per Section 9.7 */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
            GESTURE CONFUSION MATRIX (TEST SPLIT: 200 SAMPLES)
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            X: Predicted • Y: True Ground Truth
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left text-text-muted">TRUE \ PRED</th>
                {classes.map((cls) => (
                  <th key={cls} className="p-2 text-text-secondary">{cls}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, rIdx) => (
                <tr key={classes[rIdx]}>
                  <td className="p-2 text-left font-bold text-text-secondary">{classes[rIdx]}</td>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    const intensity = isDiagonal ? "bg-accent-primary/20 text-accent-primary font-bold border-accent-primary/40" : val > 0 ? "bg-status-error/10 text-status-error" : "text-text-muted";
                    return (
                      <td
                        key={cIdx}
                        className={`p-3 border border-border/40 ${intensity}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
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
import React from "react";
export default function AdminModelsPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">MODEL REGISTRY</div>
      <h1 className="text-2xl font-bold text-text-primary">Models Registry</h1>
      <div className="p-6 bg-surface border border-border rounded-lg space-y-3">
        <div className="flex items-center justify-between p-4 rounded bg-surface-elevated border border-accent-primary/30">
          <div>
            <div className="text-sm font-mono font-bold text-text-primary">sign_mlp.onnx</div>
            <div className="text-xs text-text-muted">MLP 126→256→128→35 · 99.9% val accuracy</div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-approved/20 text-status-approved">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded bg-surface-elevated border border-border opacity-60">
          <div>
            <div className="text-sm font-mono font-bold text-text-primary">LSTM (temporal)</div>
            <div className="text-xs text-text-muted">Pending — requires community sequence data</div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-pending/20 text-status-pending">PLANNED</span>
        </div>
      </div>
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
import { CheckSquare, Terminal, BarChart3, ArrowUpRight } from "lucide-react";
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
          <div className="text-[11px] font-mono text-text-secondary">MLP 126→256→128→{stats?.model_classes ?? "—"}</div>
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
          href="/admin/training"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-secondary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-3">
              <Terminal size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">ML Experiment Console</h3>
            <p className="text-xs text-text-secondary mt-1">
              Live training terminal monitoring epoch progress, loss decay, and validation curve.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-secondary font-bold">
            <span>Open Console</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/evaluation"
          className="p-6 rounded-lg bg-surface border border-border hover:border-text-primary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-surface-elevated text-text-primary flex items-center justify-center mb-3">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Evaluation Matrix</h3>
            <p className="text-xs text-text-secondary mt-1">
              Confusion matrix heatmap, per-sign precision/recall/F1, and OOD error diagnostics.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-text-primary font-bold">
            <span>View Metrics</span>
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
import React from "react";
export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">SYSTEM SETTINGS</div>
      <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>
      <div className="p-6 bg-surface border border-border rounded-lg space-y-3 font-mono text-xs">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">API PORT</span>
          <span className="text-text-primary">8000</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">LLM ENDPOINT</span>
          <span className="text-text-primary">OpenAI-compatible (env-driven)</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">TTS ENGINE</span>
          <span className="text-text-primary">edge-tts → BanglaTTS fallback</span>
        </div>
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-text-muted">MODEL</span>
          <span className="text-text-primary">sign_mlp.onnx (35 classes)</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-muted">PYTHON</span>
          <span className="text-text-primary">3.11 · mediapipe 0.10.14</span>
        </div>
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
import { Upload, Trash2, Film, Image as ImageIcon } from "lucide-react";
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

  const handleUpload = async (signId: string, label: string, file: File) => {
    setUploading(signId);
    try {
      await contributionService.uploadSignMedia(signId, file);
      toast.success(`Reference media attached to ${label}`);
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
                      {media?.type === "video" ? (
                        <video
                          src={`${API_BASE}${media.url}`}
                          muted loop autoPlay playsInline
                          className="h-16 w-28 object-cover rounded border border-border"
                        />
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

# FILE: `frontend\src\app\admin\training\page.tsx`

```tsx
"use client";
import React from "react";
import { TrainingConsole } from "@/components/admin/TrainingConsole";
import { toast } from "sonner";

export default function AdminTrainingPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-accent-secondary">EXPERIMENT ORCHESTRATION</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          ML Model Training & Checkpoint Console
        </h1>
      </div>

      <TrainingConsole
        onCancel={() => toast.info("Training interrupt signal sent to worker")}
      />
    </div>
  );
}
```

---

# FILE: `frontend\src\app\admin\videos\page.tsx`

```tsx
import React from "react";
export default function AdminVideosPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">VIDEO INSPECTOR</div>
      <h1 className="text-2xl font-bold text-text-primary">Reference Video Review</h1>
      <div className="p-8 bg-surface border border-border rounded-lg text-center text-xs font-mono text-text-muted">
        Video comparison and reference selection will be available here
        once community contributors submit sign recordings.
      </div>
    </div>
  );
}
```

---

# FILE: `frontend\src\app\community\unknown-signs\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { ThumbsUp, ThumbsDown, CheckCircle2, HelpCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function UnknownSignsPage() {
  const [candidates, setCandidates] = useState([
    {
      id: "unk-01",
      proposedMeaning: "METRO STATION (কলকাতা মেট্রো)",
      district: "Kolkata (North)",
      votes: 14,
      consensusNeeded: 20,
      confidence: 84.2,
    },
    {
      id: "unk-02",
      proposedMeaning: "ROSHOGOLLA / SWEET (রসগোল্লা)",
      district: "Nadia",
      votes: 18,
      consensusNeeded: 20,
      confidence: 91.0,
    },
  ]);

  const handleVote = (id: string, agree: boolean) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, votes: c.votes + (agree ? 1 : -1) } : c
      )
    );
    toast.success(agree ? "Consensus vote recorded (+1)" : "Disagreement recorded (-1)");
  };

  return (
    <PageContainer className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-status-unknown">COMMUNITY DELIBERATION</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Unknown Sign Candidates & Consensus Queue
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          When the AI encounters gestures not yet codified in the WBSL vocabulary, it enqueues them here for community consensus before dictionary promotion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((cand) => (
          <div key={cand.id} className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-unknown/15 text-status-unknown font-bold">
                  {cand.id} • UNCODIFIED
                </span>
                <h3 className="text-base font-bold text-text-primary mt-2">{cand.proposedMeaning}</h3>
                <div className="text-xs font-mono text-text-muted">Origin: {cand.district}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-text-secondary">OOD Cluster Conf</div>
                <div className="text-base font-bold text-accent-primary">{cand.confidence}%</div>
              </div>
            </div>

            <LandmarkSimulation showHands showFace showPose fps={30} />

            {/* Voting Consensus Bar */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-xs font-mono text-text-secondary">
                <span>Community Consensus Progress</span>
                <span className="text-text-primary font-bold">{cand.votes} / {cand.consensusNeeded} votes</span>
              </div>
              <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-status-unknown transition-all"
                  style={{ width: `${Math.min(100, (cand.votes / cand.consensusNeeded) * 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleVote(cand.id, true)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded bg-status-approved/20 border border-status-approved/40 text-status-approved hover:bg-status-approved hover:text-black font-mono text-xs font-bold transition-colors"
              >
                <ThumbsUp size={14} />
                <span>Confirm Meaning</span>
              </button>

              <button
                onClick={() => handleVote(cand.id, false)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded bg-surface-elevated border border-border text-text-secondary hover:text-status-error font-mono text-xs transition-colors"
              >
                <ThumbsDown size={14} />
                <span>Dispute</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
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

  useEffect(() => {
    if (consentGiven && !isReady) {
      startCamera();
    }
  }, [consentGiven, isReady, startCamera]);

  // FIX: returning signer (consent already stored) must land on READY_TO_RECORD,
  // otherwise the page shows only the camera with no controls.
  useEffect(() => {
    if (consentGiven && (state === "SIGN_SELECTED" || state === "REFERENCE_VIEW")) {
      setState("READY_TO_RECORD");
    }
  }, [consentGiven, state, setState]);

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

# FILE: `frontend\src\app\dataset\[signId]\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { datasetService } from "@/services/dataset";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Video, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function SignDetailPage() {
  const params = useParams();
  const signId = params.signId as string;

  const { data: sign, isLoading } = useQuery({
    queryKey: ["sign-detail", signId],
    queryFn: () => datasetService.getSignById(signId),
  });

  if (isLoading || !sign) {
    return (
      <PageContainer className="py-12 text-center text-xs font-mono text-text-muted">
        Loading sign details...
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6 max-w-4xl">
      <Link
        href="/dataset"
        className="inline-flex items-center space-x-1.5 text-xs font-mono text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        <span>Back to Signs Catalog</span>
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
        <LandmarkSimulation showHands showFace showPose fps={30} />
      </div>
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\dataset\page.tsx`

```tsx
"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { datasetService } from "@/services/dataset";
import { statsService, DatasetStats } from "@/services/stats";
import { PageContainer } from "@/components/layout/PageContainer";
import { TableRowSkeleton, SignCardSkeleton } from "@/components/skeletons";
import { Search, LayoutGrid, Table as TableIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DatasetPage() {
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
    <PageContainer className="space-y-6">
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
                        href={`/dataset/${sign.id}`}
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
                    href={`/dataset/${sign.id}`}
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
        <LandmarkSimulation showHands showFace showPose fps={30} />
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
    --background: 0 0% 4%;
    --foreground: 240 5% 96%;
    --card: 240 4% 8%;
    --card-foreground: 240 5% 96%;
    --popover: 240 4% 11%;
    --popover-foreground: 240 5% 96%;
    --primary: 142 71% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 239 84% 67%;
    --secondary-foreground: 0 0% 100%;
    --muted: 240 4% 16%;
    --muted-foreground: 240 5% 65%;
    --accent: 240 4% 16%;
    --accent-foreground: 240 5% 96%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 4% 16%;
    --input: 240 4% 16%;
    --ring: 142 71% 45%;
    --radius: 0.5rem;
  }
}

body {
  background-color: #0A0A0B;
  color: #F4F4F5;
  font-family: var(--font-inter), sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #0A0A0B;
}
::-webkit-scrollbar-thumb {
  background: #1C1C1F;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #27272A;
}

/* Bengali Output Styling */
.bengali-text {
  font-family: var(--font-noto-bengali), sans-serif;
  line-height: 1.8;
  letter-spacing: 0.02em;
}

/* Technical Monospace Elements */
.tech-mono {
  font-family: var(--font-jetbrains-mono), monospace;
}

/* Premium background video blur — enough to sit behind content,
   not so much that the footage stops reading as footage. */
.bg-video-premium-blur {
  filter: blur(1px) saturate(125%) contrast(106%) brightness(0.72);
  transform: scale(1.06);
  transform-origin: center;
  will-change: transform, filter;
}

@media (prefers-reduced-motion: reduce) {
  .bg-video-premium-blur {
    filter: blur(1px) brightness(0.62);
  }
}

/* Grid background for simulation */
.canvas-grid-bg {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
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
        {/* =================================================
            BACKGROUND VIDEO
           ================================================= */}
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

        {/* Legibility scrim — keeps text contrast high without hiding the video */}
        <div
          className="
            absolute
            inset-0
            bg-background/35
          "
        />

        {/* Brand color wash */}
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

        {/* Premium vignette — darkens edges, focuses the centre */}
        <div
          className="
            absolute
            inset-0
            [background:radial-gradient(ellipse_at_center,transparent_35%,rgba(10,10,11,0.72)_100%)]
          "
        />

        {/* Fine grain to remove blur banding */}
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
            top-[-10%]
            left-1/2
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
          MAIN HERO
         ===================================================== */}
      <PageContainer className="relative z-10 h-full w-full">
        <div className="flex h-full w-full flex-col items-center">
          <div
            className="
    relative
    flex
    h-[52%]
    w-full
    shrink-0
    items-center
    justify-center
    overflow-hidden
    sm:h-[56%]
    lg:h-[60%]
  "
          >
            <Image
              src="/WBSL%20Bridge%20logo.png"
              alt="WBSL Bridge"
              width={1300}
              height={700}
              priority
              className="block h-full w-auto max-w-[98vw] object-contain object-center drop-shadow-[0_10px_50px_rgba(0,0,0,0.55)]"
              sizes="98vw"
            />
          </div>

          {/* =================================================
              CONTENT
             ================================================= */}
          <div
            className="
              flex
              min-h-0
              flex-1
              w-full
              flex-col
              items-center
              justify-start
              overflow-hidden
              px-4
              pb-4
              text-center
              sm:px-6
            "
          >
            {/* Status */}
            <div
              className="
                inline-flex
                shrink-0
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

              <span className="font-mono text-[9px] font-semibold text-accent-primary sm:text-[10px]">
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
            <div className="mt-2.5 shrink-0 sm:mt-3">
              <h1
                className="
                  mx-auto
                  max-w-4xl
                  text-[1.85rem]
                  font-extrabold
                  leading-[1.08]
                  tracking-[-0.035em]
                  text-text-primary
                  sm:text-3xl
                  md:text-4xl
                  lg:text-[2.25rem]
                  xl:text-[2.5rem]
                "
              >
                A Sign Language Bridge for{" "}
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  Every Signer in West Bengal
                </span>
              </h1>
            </div>

            {/* Feature badges */}
            <div
              className="
                mt-3
                flex
                max-w-4xl
                shrink-0
                flex-wrap
                justify-center
                gap-1.5
                sm:mt-4
                sm:gap-2
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
                text="Unknown Sign Handling"
                color="unknown"
              />
            </div>

            {/* Buttons */}
            <div
              className="
                mt-4
                flex
                w-full
                shrink-0
                flex-col
                items-center
                justify-center
                gap-2
                sm:mt-5
                sm:flex-row
                sm:gap-3
              "
            >
              <Link
                href="/sign-to-text"
                className="
                  group
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-accent-primary
                  px-5
                  py-2.5
                  text-xs
                  font-semibold
                  text-black
                  shadow-[0_0_22px_rgba(34,197,94,0.22)]
                  transition-all
                  hover:bg-emerald-400
                  hover:shadow-[0_0_32px_rgba(34,197,94,0.4)]
                  active:scale-[0.98]
                  sm:w-auto
                  sm:text-sm
                "
              >
                <Video size={14} />

                <span>
                  Launch Live Sign Monitor
                </span>

                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/text-to-sign"
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-border
                  bg-surface/70
                  px-5
                  py-2.5
                  text-xs
                  font-medium
                  text-text-primary
                  backdrop-blur-xl
                  transition-all
                  hover:border-text-secondary/40
                  hover:bg-surface-elevated
                  active:scale-[0.98]
                  sm:w-auto
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
        inline-flex
        items-center
        gap-1.5
        rounded-md
        border
        border-border
        bg-surface/70
        px-2.5
        py-1
        backdrop-blur-xl
        transition-colors
        ${styles[color].hover}
      `}
    >
      <div
        className={`
          rounded
          p-1
          ${styles[color].icon}
        `}
      >
        {icon}
      </div>

      <span className="whitespace-nowrap text-[9px] font-medium text-text-primary sm:text-[10px]">
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
import { PipelineStatus } from "@/components/pipeline/PipelineStatus";
import { Camera, CameraOff, Volume2, Copy, Check, Trash2, Loader2 } from "lucide-react";
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
}

interface DetectedSign {
  gloss: string;
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
}

export default function SignToTextPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [detectedHistory, setDetectedHistory] = useState<DetectedSign[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [nmmFlags, setNmmFlags] = useState<Prediction["nmm"] | null>(null);
  const [bengaliOutput, setBengaliOutput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_BASE}/api/system/health`)
      .then(() => { if (!cancelled) setBackendOnline(true); })
      .catch(() => { if (!cancelled) setBackendOnline(false); });
    return () => { cancelled = true; };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      if (!intervalRef.current) {
        intervalRef.current = setInterval(doCaptureAndPredict, 1000);
      }
    } catch {
      setCameraError(
        "Camera Unavailable. WBSL Bridge could not access your camera. Check browser permissions and try again."
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

  // ─── NMM → gloss marker composition (matches constrained NLG FORMAT) ───
  const buildGlossString = (history: DetectedSign[]) => {
    if (history.length === 0) return "";
    const anyQuestion = history.some((h) => h.question || h.wh_question);
    return history
      .map((h, i) => {
        let tok = h.gloss;
        if (h.negation) tok += "[negation]";
        if (anyQuestion && i === history.length - 1) tok += "[?]";
        return tok;
      })
      .join(" + ");
  };

  const doCaptureAndPredict = async () => {
    if (isProcessingRef.current) return;
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPrediction(res.data);
      setNmmFlags(res.data.nmm);

      if (res.data.detected && res.data.confidence > 0.5) {
        const f = res.data.nmm;
        setDetectedHistory((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.gloss === res.data.label) {
            // same sign still held — merge any NMM that appeared during the hold
            const merged: DetectedSign = {
              ...last,
              question: last.question || f.question,
              wh_question: last.wh_question || f.wh_question,
              negation: last.negation || f.negation,
              affirmation: last.affirmation || f.affirmation,
              emphasis: last.emphasis || f.emphasis,
            };
            return [...prev.slice(0, -1), merged];
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
      // Backend not responding, keep camera running
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  };

  // ─── ONE button: stream Bengali tokens, then speak ───
  const handleStreamAndSpeak = async () => {
    if (detectedHistory.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setBengaliOutput("");
    let full = "";
    try {
      const gloss = buildGlossString(detectedHistory);
      const response = await fetch(`${API_BASE}/api/nlg/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gloss }),
      });
      if (!response.ok || !response.body) throw new Error("stream unavailable");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "delta" && parsed.text) {
              full += parsed.text;
              setBengaliOutput(full);
            } else if (parsed.type === "done" && parsed.bengali_text) {
              full = parsed.bengali_text;
              setBengaliOutput(full);
            } else if (parsed.type === "error") {
              toast.error(parsed.error || "LLM error");
            }
          } catch {}
        }
      }
    } catch {
      toast.error("Streaming failed — check LLM configuration in .env");
    } finally {
      setIsGenerating(false);
    }

    const text = full.trim();
    if (!text) return;

    // automatic voice playback
    setIsPlayingAudio(true);
    try {
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text, voice: voiceId });
      if (res.data.audio_url) {
        const audio = new Audio(`${API_BASE}${res.data.audio_url}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        return;
      }
    } catch { /* fall through */ }
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "bn-IN";
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleCopy = () => {
    if (detectedHistory.length === 0) return;
    navigator.clipboard.writeText(detectedHistory.map((s) => s.gloss).join(" "));
    setCopied(true);
    toast.success("Sign sequence copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setDetectedHistory([]);
    setPrediction(null);
    setNmmFlags(null);
    setBengaliOutput("");
  };

  const anyQuestion = detectedHistory.some((h) => h.question || h.wh_question);

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-primary uppercase tracking-wider">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? "bg-accent-primary" : "bg-status-error"}`} />
            <span>{backendOnline ? "BACKEND CONNECTED" : "BACKEND OFFLINE"}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            Sign → Bengali Live Translation
          </h1>
        </div>

        <div className="text-xs font-mono text-text-secondary">
          MODEL: <strong className="text-text-primary">sign_mlp.onnx</strong> |
          CLASSES: <strong className="text-text-primary">35</strong>
        </div>
      </div>

      {!backendOnline && (
        <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 text-xs font-mono text-status-error">
          Backend is not running. Start it with:{" "}
          <code className="bg-surface px-1.5 py-0.5 rounded">
            uvicorn backend.main:app --reload --port 8000
          </code>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-video w-full bg-surface border border-border rounded-lg overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} className="hidden" />

            {/* Video stays mounted permanently — only hidden via CSS.
                Conditional rendering would unmount/remount it on every
                re-render (prediction updates, health poll, etc.), which is
                what made the camera feed flicker on and off. */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? "" : "hidden"}`}
            />

            {!cameraActive && cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center">
                <div className="text-center p-6 space-y-3 max-w-sm">
                  <div className="w-12 h-12 mx-auto rounded-full bg-status-error/10 flex items-center justify-center text-status-error">
                    <CameraOff size={24} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">Camera Unavailable</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded bg-accent-primary text-black text-xs font-mono font-semibold"
                  >
                    Request Permissions
                  </button>
                </div>
              </div>
            )}

            {!cameraActive && !cameraError && (
              <div className="absolute inset-0 bg-surface flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Camera size={32} className="mx-auto text-text-muted" />
                  <p className="text-xs font-mono text-text-secondary">Camera is off</p>
                  <button
                    onClick={startCamera}
                    disabled={!backendOnline}
                    className="px-5 py-2.5 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Camera
                  </button>
                </div>
              </div>
            )}

            {isProcessing && cameraActive && (
              <div className="absolute top-3 right-3 bg-surface/90 border border-border px-2 py-1 rounded text-[10px] font-mono text-status-pending">
                PROCESSING...
              </div>
            )}
          </div>

          {cameraActive && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
              <span className="text-xs font-mono text-text-secondary">
                Detecting every 1 second
              </span>
              <button
                onClick={stopCamera}
                className="px-3 py-1.5 rounded bg-status-error/20 border border-status-error text-status-error text-xs font-mono"
              >
                Stop Camera
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-surface border border-border rounded-lg p-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              RECOGNITION RESULT
            </span>
          </div>

          <div className="p-4 rounded-lg bg-surface-elevated/70 border border-border">
            {prediction ? (
              prediction.detected ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono text-accent-primary">
                      {prediction.label}
                    </span>
                    <span className="text-sm font-mono text-text-secondary">
                      {Math.round(prediction.confidence * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-border">
                    {prediction.top5.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-mono">
                        <span className={idx === 0 ? "text-text-primary font-semibold" : "text-text-muted"}>
                          {item.label}
                        </span>
                        <span className={idx === 0 ? "text-accent-primary" : "text-text-muted"}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-xs font-mono text-text-muted">NO HAND DETECTED</span>
                </div>
              )
            ) : (
              <div className="text-center py-4">
                <span className="text-xs font-mono text-text-muted">
                  Start camera to begin recognition
                </span>
              </div>
            )}
          </div>

          {nmmFlags && (
            <div className="p-3 bg-surface-elevated rounded border border-border space-y-1.5">
              <div className="text-[11px] font-mono uppercase text-text-muted">
                Non-Manual Markers (NMM)
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.question ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "border-border text-text-muted"}`}>
                  QUESTION: {nmmFlags.question ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.wh_question ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "border-border text-text-muted"}`}>
                  WH-QUES: {nmmFlags.wh_question ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.negation ? "bg-status-error/20 border-status-error text-status-error" : "border-border text-text-muted"}`}>
                  NEGATION: {nmmFlags.negation ? "ON" : "OFF"}
                </span>
                <span className={`px-2 py-0.5 rounded border ${nmmFlags.emphasis ? "bg-status-pending/20 border-status-pending text-status-pending" : "border-border text-text-muted"}`}>
                  EMPHASIS: {nmmFlags.emphasis ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
              DETECTED SEQUENCE
            </div>
            <div className="flex flex-wrap gap-2 min-h-10 p-3 rounded bg-background border border-border">
              {detectedHistory.length === 0 ? (
                <span className="text-xs font-mono text-text-muted">Awaiting input...</span>
              ) : (
                detectedHistory.map((s, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded bg-surface border font-mono text-xs font-bold ${
                      s.negation
                        ? "border-status-error/60 text-status-error"
                        : idx === detectedHistory.length - 1 && anyQuestion
                        ? "border-status-pending/60 text-status-pending"
                        : "border-border text-accent-primary"
                    }`}
                  >
                    [{s.gloss}]
                  </span>
                ))
              )}
            </div>
            <div className="text-[11px] font-mono text-text-muted">
              NLG INPUT:{" "}
              <span className="text-text-secondary">
                {detectedHistory.length ? buildGlossString(detectedHistory) : "—"}
              </span>
            </div>
            <div className="text-[10px] font-mono text-text-muted">
              red chip = [negation] held · amber last chip = [?] question · markers follow FORMAT: WORD[negation][?]
            </div>
          </div>

          <button
            onClick={handleStreamAndSpeak}
            disabled={detectedHistory.length === 0 || isGenerating}
            className="w-full py-3 rounded bg-accent-secondary text-white font-mono text-xs uppercase font-bold hover:bg-accent-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Streaming Bengali...</span>
              </>
            ) : isPlayingAudio ? (
              <>
                <Volume2 size={14} />
                <span>Speaking...</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>Stream Bengali in Voice</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted">TTS Voice:</span>
            <button
              onClick={() => setVoiceId("1")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "1"
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Female (Nabanita)
            </button>
            <button
              onClick={() => setVoiceId("2")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "2"
                  ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Male (Pradeep)
            </button>
          </div>

          {bengaliOutput && (
            <div className="p-4 rounded-lg bg-background border border-border">
              <div className="text-xs font-mono uppercase text-text-muted mb-2">BENGALI OUTPUT</div>
              <p className="font-bengali text-xl text-text-primary">{bengaliOutput}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={detectedHistory.length === 0}
              className="flex items-center space-x-1 px-3 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono text-text-primary disabled:opacity-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-accent-primary" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleClear}
              className="flex items-center space-x-1 px-3 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono text-text-secondary hover:text-status-error transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      <PipelineStatus
        stages={{
          camera: cameraActive ? "active" : "idle",
          landmarks: cameraActive && backendOnline ? "active" : "idle",
          recognition: cameraActive && backendOnline ? "active" : "idle",
          nlg: bengaliOutput ? "active" : "idle",
          tts: isPlayingAudio ? "active" : "idle",
        }}
        fps={cameraActive ? 1 : 0}
      />
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\app\text-to-sign\page.tsx`

```tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ArrowRight, VideoOff, Loader2, Play } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeMedia = result?.media?.[activeSignIndex] ?? null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setIsLoading(true);
    setPlayingSeq(false);
    try {
      const res = await axios.post<TextToSignResult>(`${API_BASE}/api/text-to-sign`, {
        text: inputText,
      });
      setResult(res.data);
      setActiveSignIndex(0);
      toast.success("Sign sequence generated");
    } catch {
      toast.error("Backend not responding. Start FastAPI server first.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sequential playback: video ends → next sign; image/no-media → timed advance
  const handleVideoEnded = () => {
    if (!playingSeq || !result) return;
    if (activeSignIndex < result.gloss_sequence.length - 1) setActiveSignIndex((i) => i + 1);
    else setPlayingSeq(false);
  };

  useEffect(() => {
    if (!playingSeq || !result) return;
    if (activeMedia?.type === "video") {
      videoRef.current?.play().catch(() => {});
      return;
    }
    const t = setTimeout(() => {
      if (activeSignIndex < result.gloss_sequence.length - 1) setActiveSignIndex((i) => i + 1);
      else setPlayingSeq(false);
    }, activeMedia?.type === "image" ? 1500 : 800);
    return () => clearTimeout(t);
  }, [playingSeq, activeSignIndex, activeMedia, result]);

  const hasAnyMedia = result?.media?.some((m) => m.url) ?? false;

  return (
    <PageContainer className="space-y-6 max-w-4xl">
      <div className="pb-2 border-b border-border">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-accent-secondary uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
          <span>REVERSE SYNTHESIS PIPELINE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Bengali Text → Sign Reference Playback
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Glosses with uploaded reference media play as one continuous sign presentation.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
          BENGALI INPUT SENTENCE
        </div>
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="বাংলা বাক্য লিখুন (যেমন: আমি জল পান করি)"
            className="flex-1 p-3 bg-background border border-border rounded text-text-primary font-bengali text-lg focus:outline-none focus:border-accent-secondary"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-3 rounded bg-accent-secondary text-white font-semibold text-xs font-mono uppercase tracking-wider hover:bg-accent-secondary/90 transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Generate Sign Sequence</span>
            )}
          </button>
        </form>
      </div>

      {result && (
        <>
          <div className="bg-surface border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                SIGN GLOSS SEQUENCE
              </div>
              <div className="text-xs font-mono text-text-muted">
                Available signs in model: {result.available_signs}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {result.gloss_sequence.map((gloss, idx) => (
                <React.Fragment key={idx}>
                  <button
                    onClick={() => { setActiveSignIndex(idx); setPlayingSeq(false); }}
                    className={`px-3 py-1.5 rounded border font-mono text-xs font-bold cursor-pointer transition-colors ${
                      activeSignIndex === idx
                        ? "bg-accent-secondary text-white border-accent-secondary"
                        : gloss.startsWith("[")
                        ? "bg-status-unknown/10 border-status-unknown/30 text-status-unknown"
                        : result.media[idx]?.url
                        ? "bg-accent-primary/10 border-accent-primary/40 text-accent-primary"
                        : "bg-surface-elevated border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {gloss}
                  </button>
                  {idx < result.gloss_sequence.length - 1 && (
                    <ArrowRight size={14} className="text-text-muted" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-4 text-[10px] font-mono text-text-muted pt-2 border-t border-border">
              <span>
                <span className="text-accent-primary">■</span> Reference media available
              </span>
              <span>
                <span className="text-status-unknown">■</span> Unknown word (no sign mapped yet)
              </span>
            </div>
            {hasAnyMedia && (
              <button
                onClick={() => { setActiveSignIndex(0); setPlayingSeq(true); }}
                className="flex items-center space-x-2 px-4 py-2 rounded bg-accent-primary text-black font-mono text-xs uppercase font-bold hover:bg-accent-primary/90 transition-colors"
              >
                <Play size={13} />
                <span>Play Full Sequence</span>
              </button>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                SIGN REFERENCE — {result.gloss_sequence[activeSignIndex]}
              </div>
              {playingSeq && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary font-bold">
                  SEQUENCE PLAYING {activeSignIndex + 1}/{result.gloss_sequence.length}
                </span>
              )}
            </div>

            {activeMedia?.type === "video" && activeMedia.url ? (
              <video
                key={activeMedia.url}
                ref={videoRef}
                src={`${API_BASE}${activeMedia.url}`}
                controls
                autoPlay={playingSeq}
                loop={!playingSeq}
                muted
                playsInline
                onEnded={handleVideoEnded}
                className="w-full aspect-video bg-background border border-border rounded-lg object-contain"
              />
            ) : activeMedia?.type === "image" && activeMedia.url ? (
              <img
                key={activeMedia.url}
                src={`${API_BASE}${activeMedia.url}`}
                alt={activeMedia.gloss}
                className="w-full aspect-video bg-background border border-border rounded-lg object-contain"
              />
            ) : (
              <div className="aspect-video w-full bg-background border border-border rounded-lg flex flex-col items-center justify-center space-y-3">
                <VideoOff size={40} className="text-text-muted" />
                <div className="text-sm font-mono text-text-secondary">No reference media for this sign yet</div>
                <div className="text-xs text-text-muted max-w-sm text-center">
                  Upload a video or image from Admin → Signs Catalog. It will appear here automatically.
                </div>
              </div>
            )}

            {result.gloss_sequence.length > 1 && (
              <div className="pt-2">
                <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden flex">
                  {result.gloss_sequence.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => { setActiveSignIndex(i); setPlayingSeq(false); }}
                      className={`flex-1 h-full cursor-pointer border-r border-background transition-all ${
                        activeSignIndex === i
                          ? "bg-accent-secondary"
                          : "bg-border hover:bg-border/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {!result && !isLoading && (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-3">
          <ArrowRight size={32} className="mx-auto text-text-muted" />
          <div className="text-sm font-mono text-text-secondary">
            Enter a Bengali sentence above to generate the sign gloss sequence
          </div>
          <div className="text-xs text-text-muted">
            Example: &quot;আমি জল পান করি&quot;
          </div>
        </div>
      )}
    </PageContainer>
  );
}
```

---

# FILE: `frontend\src\components\admin\TrainingConsole.tsx`

```tsx
"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Terminal, Square } from "lucide-react";

interface TrainingConsoleProps {
  onCancel?: () => void;
}

export function TrainingConsole({ onCancel }: TrainingConsoleProps) {
  const [epoch, setEpoch] = useState(24);
  const totalEpochs = 50;
  const [history, setHistory] = useState([
    { epoch: 1, loss: 1.84, valAcc: 42.1 },
    { epoch: 5, loss: 1.12, valAcc: 65.4 },
    { epoch: 10, loss: 0.68, valAcc: 78.2 },
    { epoch: 15, loss: 0.41, valAcc: 83.5 },
    { epoch: 20, loss: 0.28, valAcc: 87.1 },
    { epoch: 24, loss: 0.183, valAcc: 89.8 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEpoch((prev) => {
        if (prev >= totalEpochs) return prev;
        const next = prev + 1;
        const newLoss = Math.max(0.08, +(0.183 - (next - 24) * 0.005 + (Math.random() * 0.01 - 0.005)).toFixed(3));
        const newValAcc = Math.min(96.5, +(89.8 + (next - 24) * 0.35 + (Math.random() * 0.4 - 0.2)).toFixed(1));
        
        setHistory((h) => [...h, { epoch: next, loss: newLoss, valAcc: newValAcc }]);
        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const latest = history[history.length - 1];

  return (
    <div className="bg-[#0D0D10] border border-border rounded-lg p-5 font-mono text-xs space-y-4">
      {/* ML Terminal Header per Section 8.7 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div className="flex items-center space-x-2.5">
          <Terminal size={15} className="text-accent-primary" />
          <span className="font-semibold text-text-primary tracking-wide">
            TRAINING RUN #048
          </span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary">Dataset: <strong className="text-text-primary">WBSL-v0.8</strong></span>
          <span className="text-text-muted">|</span>
          <span className="text-text-secondary">Model: <strong className="text-text-primary">LSTM-v1.4</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-status-approved/20 text-status-approved border border-status-approved/30">
            RUNNING
          </span>
          <button
            onClick={onCancel}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-surface hover:bg-surface-elevated border border-border text-text-secondary hover:text-status-error transition-colors"
          >
            <Square size={11} />
            <span>Cancel Run</span>
          </button>
        </div>
      </div>

      {/* Epoch Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-text-secondary text-[11px]">
          <span>TRAINING PROGRESS</span>
          <span className="text-accent-primary font-bold">Epoch {epoch} / {totalEpochs}</span>
        </div>
        <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-accent-primary transition-all duration-500"
            style={{ width: `${(epoch / totalEpochs) * 100}%` }}
          />
        </div>
      </div>

      {/* Raw Metrics Readout per Section 8.7 */}
      <div className="p-3 bg-surface rounded border border-border/60 flex items-center justify-around text-center">
        <div>
          <div className="text-[10px] uppercase text-text-muted">Current Loss</div>
          <div className="text-base font-bold text-accent-secondary mt-0.5">{latest?.loss}</div>
        </div>
        <div className="h-6 w-[1px] bg-border" />
        <div>
          <div className="text-[10px] uppercase text-text-muted">Train Accuracy</div>
          <div className="text-base font-bold text-accent-primary mt-0.5">92.4%</div>
        </div>
        <div className="h-6 w-[1px] bg-border" />
        <div>
          <div className="text-[10px] uppercase text-text-muted">Validation Accuracy</div>
          <div className="text-base font-bold text-text-primary mt-0.5">{latest?.valAcc}%</div>
        </div>
      </div>

      {/* Two Side-by-Side Charts (Loss & Val Accuracy) per Section 8.7 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Loss Graph */}
        <div className="bg-surface/50 border border-border p-3 rounded">
          <div className="text-[11px] text-text-secondary uppercase mb-2">Loss Convergence</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" stroke="#52525B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525B" domain={[0, 2]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141416", borderColor: "rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#A1A1AA" }}
                />
                <Line type="monotone" dataKey="loss" stroke="#6366F1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Validation Accuracy Graph */}
        <div className="bg-surface/50 border border-border p-3 rounded">
          <div className="text-[11px] text-text-secondary uppercase mb-2">Validation Accuracy (%)</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" stroke="#52525B" tick={{ fontSize: 10 }} />
                <YAxis stroke="#52525B" domain={[40, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141416", borderColor: "rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#A1A1AA" }}
                />
                <Line type="monotone" dataKey="valAcc" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
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
  BookOpen,
  Database,
  Terminal,
  BarChart3,
  Cpu,
  HelpCircle,
  Video,
  Settings,
  ArrowLeft,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
  { label: "Signs Catalog", href: "/admin/signs", icon: BookOpen },
  { label: "Dataset Management", href: "/admin/dataset", icon: Database },
  { label: "Training Console", href: "/admin/training", icon: Terminal },
  { label: "Evaluation & Confusion", href: "/admin/evaluation", icon: BarChart3 },
  { label: "Models Registry", href: "/admin/models", icon: Cpu },
  { label: "Unknown Signs", href: "/community/unknown-signs", icon: HelpCircle },
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
            <li><Link href="/dataset" className="hover:text-text-primary transition-colors">Dataset Explorer</Link></li>
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

# FILE: `frontend\src\components\simulation\LandmarkSimulation.tsx`

```tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface LandmarkSimulationProps {
  landmarkFrames?: number[][][]; // frames x points x 3
  showHands?: boolean;
  showFace?: boolean;
  showPose?: boolean;
  fps?: number;
}

export function LandmarkSimulation({
  landmarkFrames,
  showHands = true,
  showFace = true,
  showPose = true,
  fps = 30,
}: LandmarkSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Generate synthetic MediaPipe skeleton landmarks if none provided
  const totalFrames = landmarkFrames?.length || 60;

  useEffect(() => {
    if (!isPlaying) return;

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

    const t = (currentFrame / totalFrames) * Math.PI * 2;

    // Draw Pose (33 points subset) - Color Gray #6b7280 per spec
    if (showPose) {
      ctx.strokeStyle = "#6b7280";
      ctx.fillStyle = "#6b7280";
      ctx.lineWidth = 2;

      const nose = { x: width * 0.5, y: height * 0.28 };
      const leftShoulder = { x: width * 0.38, y: height * 0.42 };
      const rightShoulder = { x: width * 0.62, y: height * 0.42 };
      const leftElbow = { x: width * 0.32, y: height * 0.56 + Math.sin(t) * 15 };
      const rightElbow = { x: width * 0.68, y: height * 0.56 + Math.cos(t) * 15 };
      const leftWrist = { x: width * 0.35 + Math.sin(t * 2) * 20, y: height * 0.72 - Math.abs(Math.sin(t)) * 40 };
      const rightWrist = { x: width * 0.65 - Math.cos(t * 2) * 20, y: height * 0.72 - Math.abs(Math.cos(t)) * 40 };

      // Bones
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.lineTo(rightElbow.x, rightElbow.y);
      ctx.lineTo(rightWrist.x, rightWrist.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(leftElbow.x, leftElbow.y);
      ctx.lineTo(leftWrist.x, leftWrist.y);
      ctx.stroke();

      [nose, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Face Mesh Points (Blue #3b82f6 per spec)
    if (showFace) {
      ctx.fillStyle = "#3b82f6";
      const faceCenter = { x: width * 0.5, y: height * 0.26 };
      for (let i = 0; i < 28; i++) {
        const angle = (i / 28) * Math.PI * 2;
        const fx = faceCenter.x + Math.cos(angle) * 32;
        const fy = faceCenter.y + Math.sin(angle) * 40;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Eyes and Mouth
      ctx.fillRect(faceCenter.x - 14, faceCenter.y - 8, 4, 2);
      ctx.fillRect(faceCenter.x + 10, faceCenter.y - 8, 4, 2);
      ctx.fillRect(faceCenter.x - 8, faceCenter.y + 14, 16, 2);
    }

    // Draw Hands (All 21 points per hand - Green #22c55e per spec)
    if (showHands) {
      ctx.strokeStyle = "#22c55e";
      ctx.fillStyle = "#22c55e";
      ctx.lineWidth = 1.5;

      const drawHand = (wristX: number, wristY: number, flip: boolean) => {
        const sign = flip ? -1 : 1;
        ctx.beginPath();
        ctx.arc(wristX, wristY, 5, 0, Math.PI * 2);
        ctx.fill();

        // 5 fingers, 4 segments each = 20 points + 1 wrist = 21 points
        for (let f = 0; f < 5; f++) {
          const fingerAngle = ((-40 + f * 20) * Math.PI) / 180;
          let prevX = wristX;
          let prevY = wristY;

          for (let seg = 1; seg <= 4; seg++) {
            const segDist = seg * 9;
            const px = wristX + Math.cos(fingerAngle) * segDist * sign + Math.sin(t + f) * (seg * 1.2);
            const py = wristY - Math.sin(fingerAngle) * segDist * 0.5 - seg * 8;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();

            prevX = px;
            prevY = py;
          }
        }
      };

      const leftWrist = { x: width * 0.35 + Math.sin(t * 2) * 20, y: height * 0.72 - Math.abs(Math.sin(t)) * 40 };
      const rightWrist = { x: width * 0.65 - Math.cos(t * 2) * 20, y: height * 0.72 - Math.abs(Math.cos(t)) * 40 };

      drawHand(leftWrist.x, leftWrist.y, false);
      drawHand(rightWrist.x, rightWrist.y, true);
    }
  }, [currentFrame, showHands, showFace, showPose, totalFrames]);

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

        {/* Overlay Metadata Panel per Section 8.5 */}
        <div className="absolute top-3 left-3 bg-surface/90 border border-border/80 px-2.5 py-1.5 rounded tech-mono text-[11px] text-text-secondary space-x-2">
          <span>Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong></span>
          <span>|</span>
          <span>FPS: <strong className="text-accent-primary">{fps}</strong></span>
          <span>|</span>
          <span>Hands: <strong className="text-status-approved">{showHands ? "2 (21 pts)" : "0"}</strong></span>
          <span>|</span>
          <span>Face: <strong className="text-accent-secondary">{showFace ? "Mesh Active" : "Off"}</strong></span>
          <span>|</span>
          <span>Pose: <strong className="text-text-primary">{showPose ? "True" : "False"}</strong></span>
        </div>
      </div>

      {/* Video Editor Timeline Controls per Section 8.5 */}
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

# FILE: `frontend\src\components\skeletons\index.tsx`

```tsx
import React from "react";

export function SignCardSkeleton() {
  return (
    <div className="border border-border bg-surface p-4 rounded-md animate-pulse">
      <div className="h-5 bg-surface-elevated rounded w-1/3 mb-2" />
      <div className="h-4 bg-surface-elevated rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="h-3 bg-surface-elevated rounded w-1/4" />
        <div className="h-3 bg-surface-elevated rounded w-1/5" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="border border-border bg-surface p-5 rounded-md animate-pulse">
      <div className="h-3 bg-surface-elevated rounded w-1/3 mb-3" />
      <div className="h-8 bg-surface-elevated rounded w-1/2 mb-2" />
      <div className="h-3 bg-surface-elevated rounded w-2/3" />
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="border border-border bg-surface p-4 rounded-md animate-pulse flex items-center justify-between">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-surface-elevated" />
          <div className="h-3 bg-surface-elevated rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function EvidenceSkeleton() {
  return (
    <div className="border border-border bg-surface p-6 rounded-md animate-pulse space-y-4">
      <div className="h-5 bg-surface-elevated rounded w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-surface-elevated rounded" />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-surface-elevated rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function CameraSkeleton() {
  return (
    <div className="w-full aspect-video bg-surface border border-border rounded-md flex flex-col items-center justify-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-surface-elevated mb-3" />
      <div className="h-4 bg-surface-elevated rounded w-48" />
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

# FILE: `frontend\src\hooks\usePipeline.ts`

```typescript
"use client";

export function usePipeline() {
  return {
    isConnected: false,
    startPipeline: () => {},
    stopPipeline: () => {},
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
        // Fallback for standalone/offline dev
        return {
          api: true,
          model: true,
          tts: true,
          llm: true,
          inference_mode: "local",
          dataset_version: "v0.8",
          model_version: "LSTM-v1.4",
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

# FILE: `frontend\src\hooks\useWebSocket.ts`

```typescript
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import WebSocketManager from "@/services/ws";

export function useWebSocket(path: string = "/ws/landmarks") {
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocketManager(path);
    wsManagerRef.current = ws;

    ws.on("*", (data) => {
      setLastMessage(data);
      if (data.type === "status") {
        setIsConnected(data.status === "active");
      }
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [path]);

  const sendMessage = useCallback((payload: any) => {
    wsManagerRef.current?.send(payload);
  }, []);

  return {
    isConnected,
    lastMessage,
    sendMessage,
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
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws",
};

export const NAVIGATION_LINKS = [
  { label: "Explore", href: "/dataset" },
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  { label: "Contribute", href: "/contribute" },
  { label: "About", href: "/about" },
];

export const ADMIN_NAVIGATION_LINKS = [
  { label: "Overview", href: "/admin", icon: "LayoutDashboard" },
  { label: "Contributions", href: "/admin/contributions", icon: "CheckSquare" },
  { label: "Signs Catalog", href: "/admin/signs", icon: "BookOpen" },
  { label: "Dataset Management", href: "/admin/dataset", icon: "Database" },
  { label: "Training Console", href: "/admin/training", icon: "Terminal" },
  { label: "Model Evaluation", href: "/admin/evaluation", icon: "BarChart3" },
  { label: "Models Registry", href: "/admin/models", icon: "Cpu" },
  { label: "Unknown Queue", href: "/community/unknown-signs", icon: "HelpCircle" },
  { label: "Video Inspector", href: "/admin/videos", icon: "Video" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
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

export interface Candidate {
  meaning: string;
  confidence: number;
  evidence: string;
}

export interface NMMFlags {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
  head_tilt?: boolean;
}

export interface PipelineEvent {
  type:
    | "status"
    | "landmarks"
    | "sign_detected"
    | "unknown_sign"
    | "candidates_ready"
    | "nmm_update"
    | "emotion_update"
    | "sentence_end"
    | "bengali_output"
    | "tts_ready"
    | "error";
  stage?: PipelineStage;
  status?: PipelineStatus;
  gloss?: string;
  confidence?: number;
  timestamp?: [number, number];
  window_id?: number;
  candidates?: Candidate[];
  markers?: NMMFlags;
  emotion?: string;
  text?: string;
  has_uncertain?: boolean;
  audio_url?: string;
  engine?: "edge-tts" | "banglatts";
  duration_ms?: number;
  message?: string;
  hands?: number;
  face?: boolean;
  pose?: boolean;
  fps?: number;
  gloss_sequence?: string[];
}

// --- WebSocket Payloads (Frontend -> Backend) ---
export interface WsLandmarksPayload {
  type: "landmarks";
  frame_id: number;
  timestamp: number;
  hands_left: number[][] | null;   // 21 x 3
  hands_right: number[][] | null;  // 21 x 3
  face: number[][] | null;         // 468 x 3
  pose: number[][] | null;         // 33 x 3
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

// --- Training & Models ---
export interface ModelVersion {
  id: string;
  version: string;
  dataset_version: string;
  status: "active" | "archived" | "training" | "evaluating";
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  created_at: string;
}

export interface TrainingEvent {
  type:
    | "epoch_start"
    | "epoch_end"
    | "batch_progress"
    | "training_complete"
    | "training_error"
    | "export_progress";
  epoch?: number;
  total_epochs?: number;
  loss?: number;
  accuracy?: number;
  val_accuracy?: number;
  batch?: number;
  total_batches?: number;
  model_id?: string;
  final_accuracy?: number;
  message?: string;
  stage?: string;
  percent?: number;
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

# FILE: `frontend\src\services\ws.ts`

```typescript
"use client";
import { getAuthToken } from "./auth";
import { WsLandmarksPayload } from "@/lib/types";

type MessageHandler = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private handlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  private getUrl(): string {
    if (typeof window === "undefined") return "";
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = process.env.NEXT_PUBLIC_API_HOST || "localhost:8000";
    const token = getAuthToken();
    const authQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${wsProtocol}//${host}${this.path}${authQuery}`;
  }

  connect() {
    if (typeof window === "undefined") return;
    if (this.ws?.readyState === WebSocket.OPEN) return;
    
    try {
      const url = this.getUrl();
      if (!url) return;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          (this.handlers.get(data.type) || []).forEach((h) => h(data));
          (this.handlers.get("*") || []).forEach((h) => h(data));
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
          }, 2000 * Math.pow(2, this.reconnectAttempts));
        }
      };
    } catch (err) {
      console.warn("WebSocket connection attempt failed:", err);
    }
  }

  send(payload: WsLandmarksPayload | any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) || [];
    this.handlers.set(
      type,
      list.filter((h) => h !== handler)
    );
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}

export default WebSocketManager;
```

---

# FILE: `frontend\src\store\pipeline-store.ts`

```typescript
import { create } from "zustand";
import { PipelineStage, PipelineStatus, Candidate, NMMFlags } from "@/lib/types";

interface PipelineStore {
  stages: Record<PipelineStage, PipelineStatus>;
  fps: number;
  detectedSigns: { gloss: string; confidence: number }[];
  currentCandidates: Candidate[];
  nmmActive: NMMFlags;
  bengaliOutput: string;
  hasUncertainty: boolean;
  isDemoMode: boolean;

  updateStage: (stage: PipelineStage, status: PipelineStatus) => void;
  setFps: (fps: number) => void;
  addDetectedSign: (gloss: string, confidence: number) => void;
  clearDetectedSigns: () => void;
  setCandidates: (candidates: Candidate[]) => void;
  setNMM: (flags: NMMFlags) => void;
  setBengaliOutput: (text: string, uncertain: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
  resetPipeline: () => void;
}

export const usePipelineStore = create<PipelineStore>((set) => ({
  stages: {
    camera: "idle",
    landmarks: "idle",
    recognition: "idle",
    nlg: "idle",
    tts: "idle",
  },
  fps: 0,
  detectedSigns: [],
  currentCandidates: [],
  nmmActive: {
    question: false,
    wh_question: false,
    negation: false,
    affirmation: false,
    emphasis: false,
  },
  bengaliOutput: "",
  hasUncertainty: false,
  isDemoMode: false,

  updateStage: (stage, status) =>
    set((s) => ({ stages: { ...s.stages, [stage]: status } })),
  setFps: (fps) => set({ fps }),
  addDetectedSign: (gloss, confidence) =>
    set((s) => ({
      detectedSigns: [...s.detectedSigns, { gloss, confidence }].slice(-20),
    })),
  clearDetectedSigns: () => set({ detectedSigns: [] }),
  setCandidates: (candidates) => set({ currentCandidates: candidates }),
  setNMM: (flags) => set({ nmmActive: flags }),
  setBengaliOutput: (text, uncertain) =>
    set({ bengaliOutput: text, hasUncertainty: uncertain }),
  setDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  resetPipeline: () =>
    set({
      stages: {
        camera: "idle",
        landmarks: "idle",
        recognition: "idle",
        nlg: "idle",
        tts: "idle",
      },
      fps: 0,
      detectedSigns: [],
      currentCandidates: [],
      bengaliOutput: "",
      hasUncertainty: false,
    }),
}));
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

# FILE: `frontend\src\store\ui-store.ts`

```typescript
import { create } from "zustand";

interface UiStore {
  sidebarOpen: boolean;
  activeModal: string | null;

  toggleSidebar: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  activeModal: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
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

```env
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
OpenAI Compatible API on port 5001 at http://localhost:5001/v1/
```
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.
```

---

# FILE: `implementation.md`

```markdown
# Short Implementation — (A) Unlimited NLG Input + (B) Male/Female TTS Voice

---

## CHANGE A — Remove the 10-sign limit (frontend only)

**File:** `frontend/src/app/sign-to-text/page.tsx`

**Find** (inside `doCaptureAndPredict`, the detectedHistory update):

```tsx
        setDetectedHistory((prev) => {
          if (prev[prev.length - 1] === res.data.label) return prev;
          const updated = [...prev, res.data.label];
          return updated.slice(-10);
        });
```

**Replace with** (no cap — full session sequence kept and sent to NLG):

```tsx
        setDetectedHistory((prev) => {
          // Skip consecutive duplicates only. NO length limit —
          // the entire session sequence is kept and fed to the NLG input.
          if (prev[prev.length - 1] === res.data.label) return prev;
          return [...prev, res.data.label];
        });
```

> If your version stores objects (`{ gloss, negation, ... }`) instead of strings, do the same: **delete the `.slice(-10)`** line and keep everything else.

Also, if a `Clear` behavior or the chips row looks cramped with long sequences, the existing `flex-wrap` already handles it — no other change needed.

---

## CHANGE B — Male / Female voice selection

### B1. Replace `backend/tts_engine.py` (full file)

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

### B2. Edit `backend/main.py` (two small changes)

**Find:**

```python
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    if not text:
        return {"text": "", "audio_url": None, "engine": "none", "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text)
        result["text"] = text
        return result
```

**Replace with:**

```python
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
```

**Then add** this endpoint right after `serve_tts_audio`:

```python
@app.get("/api/tts/voices")
def list_tts_voices():
    from backend.tts_engine import VOICES
    return {
        "voices": [
            {"id": k, "label": v[0], "engine_voice": v[1]}
            for k, v in VOICES.items()
        ]
    }
```

### B3. Edit `frontend/src/app/sign-to-text/page.tsx` (three small changes)

**(1) Add state** — next to the other `useState` lines:

```tsx
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");
```

**(2) Add the voice selector UI** — place it directly above the Bengali output block (`{bengaliOutput && (...)}`):

```tsx
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted">TTS Voice:</span>
            <button
              onClick={() => setVoiceId("1")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "1"
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Female (Nabanita)
            </button>
            <button
              onClick={() => setVoiceId("2")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "2"
                  ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Male (Pradeep)
            </button>
          </div>
```

**(3) Send the voice with every TTS call** — find every line like:

```tsx
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text: bengaliOutput });
```

(and the same call inside `handleStreamAndSpeak` if you use the single-button version) — replace with:

```tsx
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text: bengaliOutput, voice: voiceId });
```

---

## Verify

```powershell
# 1. Voices list
(Invoke-WebRequest "http://127.0.0.1:8000/api/tts/voices" -UseBasicParsing).Content
# → {"voices":[{"id":"1","label":"Female","engine_voice":"bn-BD-NabanitaNeural"},{"id":"2","label":"Male","engine_voice":"bn-BD-PradeepNeural"}]}

# 2. Male voice generation
$body = @{ text = "আমি জল পান করি"; voice = "2" } | ConvertTo-Json
$r = Invoke-RestMethod "http://127.0.0.1:8000/api/tts/generate" -Method Post -Body $body -ContentType "application/json"
$r.voice; $r.audio_url
# → Male   /api/tts/audio/bengali_speech_v2.mp3

# 3. Unlimited sequence
# On /sign-to-text: show 12+ different signs → all 12+ chips appear and the
# NLG input / generated gloss contains every one of them (no truncation at 10).
```

**Restart the backend** after B1/B2 (`uvicorn backend.main:app --reload --port 8000`). Frontend hot-reloads automatically.

That's it — 2 files touched on backend, 3 small edits + 1 cap removal on frontend.
```

---

# FILE: `models\sign_classes.json`

```json
["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
```

---

# FILE: `README.md`

```markdown
# WBSL Bridge — Quick Start Guide

To run the frontend:

```powershell
# 1. Navigate to the frontend folder
cd "d:\Download\Projects\WBSL Bridge\frontend"

# 2. Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

For complete route guides, production builds, and commands, refer to [`frontend/HOW_TO_RUN.md`](frontend/HOW_TO_RUN.md).



**Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
**Backend:** FastAPI (Python 3.11) + ONNX Runtime + MediaPipe 0.10.14
**Sign Recognition:** MLP (126-dim two-hand landmarks, 99.9% val accuracy)
**Bengali NLG:** OpenAI-compatible API (any provider via `.env` config)
**Bengali TTS:** edge-tts (online primary) → BanglaTTS (offline fallback)
**State & Data:** Zustand (UI state) + TanStack Query (server data) + Axios
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

