# WBSL Bridge — Complete Implementation Guide

> **Read this ENTIRE document before writing any code.**
> **NEVER modify anything inside `model_training_zone/`.**
> Execute phases in order. Each phase lists exact files to create/modify/delete.

---

## PHASE 0: Pre-Implementation Checklist

Before touching any code, verify:

- [ ] Model 5 exists at `models/onnx_models/5/sign_daily_lstm.onnx`
- [ ] `models/onnx_models/5/sign_daily_classes.json` exists
- [ ] `models/onnx_models/5/daily_report.json` exists
- [ ] `models/onnx_models/5/avatar/` folder exists with per-gloss subfolders
- [ ] `models/onnx_models/5/confusion_matrix.json` exists
- [ ] Backend `.venv` is activated and `pip install python-dotenv` is done
- [ ] Frontend `npm install` is clean

---

## PHASE 1: Environment Setup (`.env` + `start.ps1`)

### 1.1 Create `.env` at project root

**File: `D:\Download\Projects\WBSL Bridge\.env`** (CREATE NEW)

```env
# ==========================================
# LLM MODE SELECTION
# ==========================================
# Allowed values: online, offline

AI_MODE=offline


# ==========================================
# ONLINE API CONFIGURATION (OpenRouter)
# ==========================================

AI_ONLINE_BASE_URL=https://openrouter.ai/api/v1
AI_ONLINE_API_KEY=
AI_ONLINE_MODEL_NAME=google/gemma-4-26b-a4b-it:free


# ==========================================
# OFFLINE API CONFIGURATION (KoboldCpp)
# ==========================================

AI_OFFLINE_BASE_URL=http://localhost:5001/v1
AI_OFFLINE_API_KEY=KoboldCppApi
AI_OFFLINE_MODEL_NAME=NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf

# ==========================================
# COMMON AI SETTINGS
# ==========================================

AI_STREAM=true
AI_REASONING=true
AI_REASONING_EFFORT=low
AI_TIMEOUT=180

# ==========================================
# TTS (unchanged)
# ==========================================
# ELEVENLABS_API_KEY=
```

### 1.2 Rewrite `start.ps1`

**File: `start.ps1`** (REPLACE ENTIRELY)

```powershell
$root = "D:\Download\Projects\WBSL Bridge"
$python = Join-Path $root ".venv\Scripts\python.exe"
$requirements = Join-Path $root "requirements.txt"
$envFile = Join-Path $root ".env"
$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

# ── VALIDATION ──
if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw "Python environment missing. Run: py -3.11 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}
if (-not (Test-Path -LiteralPath $requirements -PathType Leaf)) {
    throw "requirements.txt not found: $requirements"
}
if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
    throw ".env file not found at project root. Create it from the template."
}

# ── PARSE .env ──
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $envVars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

$aiMode = $envVars["AI_MODE"]
if (-not $aiMode) {
    throw "AI_MODE not set in .env. Must be 'online' or 'offline'."
}
if ($aiMode -ne "online" -and $aiMode -ne "offline") {
    throw "Invalid AI_MODE '$aiMode'. Must be 'online' or 'offline'."
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WBSL BRIDGE — STARTUP" -ForegroundColor Cyan
Write-Host " AI Mode: $aiMode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# ── CHECK BACKEND PORT ──
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
    throw "Port $backendPort in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId))."
}

# ── BUILD AI SERVER SCRIPT ──
if ($aiMode -eq "offline") {
    $offlineModel = $envVars["AI_OFFLINE_MODEL_NAME"]
    if (-not $offlineModel) { throw "AI_OFFLINE_MODEL_NAME not set in .env" }
    $modelPath = Join-Path $root "models\llm\$offlineModel"
    if (-not (Test-Path -LiteralPath $modelPath -PathType Leaf)) {
        Write-Host "WARNING: Offline model not found at $modelPath" -ForegroundColor Yellow
        Write-Host "KoboldCpp will fail. Place the .gguf in models\llm\" -ForegroundColor Yellow
    }
    @"
Set-Location '$root'
`$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
`$model = '$modelPath'
`$args = @(
    '--model', `$model
    '--port', '5001'
    '--jinja'
    '--jinjathink', 'false'
    '--threads', '8'
    '--contextsize', '4096'
)
Write-Host "Starting KoboldCpp (offline) with: $offlineModel" -ForegroundColor Green
& `$kobold @args
"@ | Set-Content -Path $aiScript -Encoding UTF8
} else {
    $onlineModel = $envVars["AI_ONLINE_MODEL_NAME"]
    @"
Set-Location '$root'
Write-Host "Online mode active — using OpenRouter API" -ForegroundColor Green
Write-Host "Model: $onlineModel" -ForegroundColor Yellow
Write-Host "No local AI server needed. Press Ctrl+C to close."
while (`$true) { Start-Sleep -Seconds 60 }
"@ | Set-Content -Path $aiScript -Encoding UTF8
}

# ── BACKEND SCRIPT ──
@"
Set-Location '$root'
& '$python' -m uvicorn backend.main:app --reload --port $backendPort
"@ | Set-Content -Path $backendScript -Encoding UTF8

# ── FRONTEND SCRIPT ──
@"
Set-Location '$root\frontend'
`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path
npm run dev
"@ | Set-Content -Path $frontendScript -Encoding UTF8

# ── LAUNCH WINDOWS TERMINAL ──
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
    $wtArgs += @(
        "new-tab", "--title", $tab.Title,
        "-d", $tab.Directory,
        "powershell", "-NoExit", "-File", $tab.Script
    )
}

& wt.exe @wtArgs
```

### 1.3 Update `models/active_model.json`

**File: `models/active_model.json`** (REPLACE)

```json
{
  "path": "D:\\Download\\Projects\\WBSL Bridge\\models\\onnx_models\\5\\sign_daily_lstm.onnx",
  "name": "sign_daily_lstm",
  "run": "onnx_models/5"
}
```

### 1.4 Delete old models

**DELETE these folders entirely:**
- `models/onnx_models/1/`
- `models/onnx_models/2/`
- `models/onnx_models/3/`
- `models/onnx_models/4/`

**Keep:** `models/onnx_models/5/` and `models/emotion/`

---

## PHASE 2: Backend — LLM Engine (Task 4 + 5)

### 2.1 Rewrite `backend/llm_engine.py`

**File: `backend/llm_engine.py`** (REPLACE ENTIRELY)

```python
"""
backend/llm_engine.py
LLM engine with AI_MODE-based online/offline selection.
Uses OpenAI-compatible API for both modes — no mode-specific logic in callers.
"""
import json
import os
import socket
from urllib.parse import urlparse
from pathlib import Path
from typing import Iterator

import httpx


# ─────────────────────────────────────────────
# ENV LOADING
# ─────────────────────────────────────────────
def _load_dotenv():
    try:
        from dotenv import load_dotenv
    except ImportError:
        return
    here = Path(__file__).resolve()
    for candidate in (here.parent.parent / ".env", here.parent / ".env"):
        if candidate.is_file():
            load_dotenv(candidate, override=True)
            return
    load_dotenv(override=True)


_load_dotenv()


# ─────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────
_KEYLESS_HOSTS = ("localhost", "127.0.0.1", "0.0.0.0", "::1")


def _env_bool(name: str, default: bool) -> bool:
    raw = (os.getenv(name) or "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


# ─────────────────────────────────────────────
# MODE RESOLUTION
# ─────────────────────────────────────────────
def get_ai_config() -> dict:
    """Resolve the active AI configuration based on AI_MODE.

    AI_MODE=online  -> uses AI_ONLINE_* variables
    AI_MODE=offline -> uses AI_OFFLINE_* variables

    No automatic fallback. If the selected mode fails, the error propagates.
    """
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
        raise ValueError(
            f"AI_{mode.upper()}_BASE_URL is empty. Set it in .env for '{mode}' mode."
        )
    if not model:
        raise ValueError(
            f"AI_{mode.upper()}_MODEL_NAME is empty. Set it in .env for '{mode}' mode."
        )

    # Keyless detection for local servers
    is_local = any(h in base_url for h in _KEYLESS_HOSTS)
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
            "The 'openai' package is required. pip install openai"
        ) from e
    cfg = get_ai_config()
    client = OpenAI(
        base_url=cfg["base_url"],
        api_key=cfg["api_key"] or "not-configured",
        timeout=cfg["timeout"] if timeout is None else timeout,
    )
    return client, cfg["model"]


# ─────────────────────────────────────────────
# SYSTEM PROMPT (unchanged)
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are WBSL Bridge's Bengali NLG. Convert WBSL glosses, character sequences and metadata into natural West Bengal Bengali, preserving complete meaning and speaker intention.

OUTPUT
Output ONLY the final Bengali utterance with justified ElevenLabs tags. Never output explanations, metadata, alternatives or labels. Never summarize, omit, duplicate or invent information.

MEANING AND GRAMMAR
- Interpret the entire gloss sequence, metadata and context before generating.
- Preserve all supported subjects, objects, names, speakers, actions, relationships, event order, tense, time, place, cause, ability, permission, obligation, conditions, uncertainty, questions and negation.
- Use natural, grammatically correct West Bengal Bengali.

DETECTED EMOTION
The input may provide facial emotion labels: Happy, Sad, Angry, Fear, Surprise, Disgust or Neutral.
- Happy: [excited] for clearly expressed strong happiness.
- Sad: [weak] only when distressed vocal delivery is indicated.
- Angry: [angry] when anger is clearly supported.
- Neutral: no emotion tag.

APPROVED ELEVENLABS TAGS
Emotion (7): [weak], [angry], [bored], [menacing], [playful], [tired], [excited]
Vocalizations (12): [clears throat], [coughing], [chuckling], [sighing], [sniffling], [yawning], [laughing], [sharp exhale], [scoffing], [humming], [panting], [gasping]
Delivery (6): [whispering], [singing], [slowly], [softly], [pause], [voice breaking]

Output ONLY the final Bengali text with justified ElevenLabs tags."""


# ─────────────────────────────────────────────
# MESSAGE BUILDING
# ─────────────────────────────────────────────
def build_user_message(gloss_text: str, meta: dict | None = None) -> str:
    meta = meta or {}
    lines: list[str] = []

    gloss_with_affect = gloss_text
    emotion = meta.get("emotion")
    if isinstance(emotion, dict):
        dominant = emotion.get("dominant")
        if dominant in {"happy", "sad", "angry", "neutral", "surprise", "fear", "disgust"}:
            gloss_with_affect = f"{gloss_text} {{{dominant}-face}}"

    if not lines and gloss_with_affect == gloss_text:
        return gloss_text
    return (
        "SIGN METADATA (detected affect):\n"
        + "\n".join(lines)
        + "\n\nGLOSS:\n"
        + gloss_with_affect
    )


# ─────────────────────────────────────────────
# REQUEST BUILDING
# ─────────────────────────────────────────────
def build_request(cfg: dict, gloss_text: str, meta: dict | None = None, **overrides) -> dict:
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
        if "openrouter.ai" in host:
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


def _offline_result(status: str, error: str, tokens: int = 0) -> dict:
    return _base_result(get_ai_config(), status=status, tokens_used=tokens, error=error)


# ─────────────────────────────────────────────
# CONNECTIVITY CHECK
# ─────────────────────────────────────────────
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
    try:
        cfg = get_ai_config()
    except (ValueError, Exception):
        return False
    if not cfg["api_key"]:
        return False
    if not _host_is_reachable(cfg["base_url"]):
        return False
    headers = {"Authorization": f"Bearer {cfg['api_key']}"}
    timeout = httpx.Timeout(connect=1.0, read=3.0, write=3.0, pool=3.0)
    for path in ("/models", "/health"):
        try:
            resp = httpx.get(f"{cfg['base_url']}{path}", headers=headers, timeout=timeout)
            if resp.status_code < 500:
                return True
        except Exception:
            continue
    return False


# ─────────────────────────────────────────────
# GENERATION
# ─────────────────────────────────────────────
def stream_bengali(gloss_text: str, meta: dict | None = None, **overrides) -> Iterator[dict]:
    cfg = get_ai_config()
    if not cfg["configured"]:
        yield _offline_result("llm_not_configured", "No AI provider configured.") | {"type": "error"}
        return

    payload = build_request(cfg, gloss_text, meta=meta, stream=True, **overrides)
    buffer: list[str] = []
    tokens = 0
    try:
        with httpx.stream(
            "POST", f"{cfg['base_url']}/chat/completions",
            headers=_headers(cfg), json=payload, timeout=cfg["timeout"],
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
                choices = chunk.get("choices") or [{}]
                delta = choices[0].get("delta") or {}
                content = delta.get("content") or ""
                reasoning = delta.get("reasoning_content") or delta.get("reasoning") or ""
                if chunk.get("usage"):
                    tokens = chunk["usage"].get("completion_tokens", tokens)
                if not content and not reasoning:
                    continue
                if content:
                    buffer.append(content)
                yield {"type": "delta", "text": content, "reasoning": reasoning}

        yield _base_result(cfg, type="done", bengali_text="".join(buffer).strip(),
                           tokens_used=tokens, streamed=True)
    except httpx.TimeoutException:
        yield _offline_result("timeout", "LLM generation timed out.") | {"type": "error"}
    except Exception as e:
        yield _offline_result("error", str(e)) | {"type": "error"}


def generate_bengali(
    gloss_text: str, meta: dict | None = None, stream: bool | None = None,
    temperature: float | None = None, top_p: float | None = None,
    max_tokens: int | None = None,
) -> dict:
    cfg = get_ai_config()
    if not cfg["configured"]:
        return _offline_result("llm_not_configured", "No AI provider configured.")
    if stream is None:
        stream = cfg["stream"]
    if stream:
        final = None
        for event in stream_bengali(gloss_text, meta=meta, temperature=temperature,
                                    top_p=top_p, max_tokens=max_tokens):
            if event["type"] in ("done", "error"):
                final = event
        final = dict(final or _offline_result("error", "Empty stream"))
        final.pop("type", None)
        return final
    try:
        payload = build_request(cfg, gloss_text, meta=meta, stream=False,
                                temperature=temperature, top_p=top_p, max_tokens=max_tokens)
        resp = httpx.post(f"{cfg['base_url']}/chat/completions",
                          headers=_headers(cfg), json=payload, timeout=cfg["timeout"])
        resp.raise_for_status()
        data = resp.json()
        bengali = data["choices"][0]["message"]["content"].strip()
        tokens = data.get("usage", {}).get("completion_tokens", 0)
        return _base_result(cfg, bengali_text=bengali, tokens_used=tokens, streamed=False)
    except httpx.TimeoutException:
        return _offline_result("timeout", "LLM generation timed out.")
    except Exception as e:
        return _offline_result("error", str(e))


def generate_bengali_with_uncertainty(gloss_sequence: list[dict]) -> dict:
    parts = []
    has_uncertain = False
    for item in gloss_sequence:
        if item.get("unknown", False):
            has_uncertain = True
            candidates = item.get("candidates", [])
            if candidates:
                parts.append(f"{candidates[0]['meaning'].upper()}[?tentative]")
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


# ─────────────────────────────────────────────
# GLOSS BREAKING (Text-to-Sign)
# ─────────────────────────────────────────────
GLOSS_BREAK_SYSTEM = """You are a sign language gloss planner. Map utterance meaning to available sign glosses.
Output ONLY valid JSON: {"gloss_sequence": [...], "unsupported_concepts": [...]}"""


def _post_validate(seq: list[str], allowed: set[str]) -> list[str]:
    if not seq or not allowed:
        return []
    allowed_map = {lbl.upper(): lbl for lbl in allowed}
    return [allowed_map[str(g).strip().upper()] for g in seq
            if str(g).strip().upper() in allowed_map]


def break_into_glosses(text: str, vocab: list[str]) -> dict:
    cfg = get_ai_config()
    if not cfg["configured"]:
        return {"status": "error", "gloss_sequence": [], "unsupported_concepts": [],
                "error": "LLM not configured"}
    vocab_str = ", ".join(sorted(vocab))
    user_msg = (f"AVAILABLE: [{vocab_str}]\n\nUTTERANCE: {text}\n\n"
                "Return the required JSON object.")
    payload = {
        "model": cfg["model"],
        "messages": [
            {"role": "system", "content": GLOSS_BREAK_SYSTEM},
            {"role": "user", "content": user_msg},
        ],
        "temperature": 0.1, "top_p": 0.85, "max_tokens": 128, "stream": False,
    }
    try:
        resp = httpx.post(f"{cfg['base_url']}/chat/completions",
                          headers=_headers(cfg), json=payload, timeout=cfg["timeout"])
        resp.raise_for_status()
        content = resp.json()["choices"][0]["message"]["content"].strip()
        s = content.find("{")
        e = content.rfind("}")
        if s == -1 or e == -1 or e < s:
            return {"status": "error", "gloss_sequence": [], "unsupported_concepts": [],
                    "error": "Failed to parse JSON from LLM", "raw_response": content}
        data = json.loads(content[s:e + 1].strip())
        raw_seq = data.get("gloss_sequence", []) if isinstance(data.get("gloss_sequence"), list) else []
        raw_unsup = data.get("unsupported_concepts", []) if isinstance(data.get("unsupported_concepts"), list) else []
        unsupported = [str(u).strip() for u in raw_unsup if str(u).strip()]
        valid = _post_validate([str(g) for g in raw_seq], set(vocab))
        status = "partial" if (valid and unsupported) else ("success" if valid else "unresolved")
        return {"status": status, "gloss_sequence": valid, "unsupported_concepts": unsupported}
    except Exception as exc:
        return {"status": "error", "gloss_sequence": [], "unsupported_concepts": [],
                "error": str(exc)}
```

---

## PHASE 3: Backend — Feature Extraction (Task 1.1)

### 3.1 Rewrite `backend/pose.py`

**File: `backend/pose.py`** (REPLACE ENTIRELY)

```python
"""
backend/pose.py
Pose data for the new 98-dim architecture.
Only 8 pose points: shoulders(11,12), elbows(13,14), wrists(15,16), hips(23,24).
"""
import numpy as np

POSE_INDICES = [11, 12, 13, 14, 15, 16, 23, 24]
POSE_POINTS = len(POSE_INDICES)  # 8
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)
VIS_MIN = 0.5

POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (0, 1),    # shoulders
    (0, 2), (2, 4),  # left arm
    (1, 3), (3, 5),  # right arm
    (0, 6), (1, 7), (6, 7),  # torso
]


def pose_from_holistic(holistic_result) -> np.ndarray | None:
    if not holistic_result.pose_landmarks:
        return None
    lm = holistic_result.pose_landmarks.landmark
    return np.array(
        [[lm[i].x, lm[i].y, lm[i].z, lm[i].visibility] for i in POSE_INDICES],
        dtype=np.float32
    )
```

### 3.2 Rewrite `backend/extract.py`

**File: `backend/extract.py`** (REPLACE ENTIRELY)

```python
"""
backend/extract.py
98-dim feature extraction matching model_training_zone/extract.py exactly.
Serving pipeline MUST produce identical features to training.

Feature layout (98 per frame):
  handshape:      66  (2 hands x 11 pts x 3)
  palm_dir_norm:  12  (2 hands x 6)
  wrist_pos:       4  (2 hands x 2)
  elbows:          4  (2 x 2)
  wrist_face_dist: 6  (2 hands x 3 face pts)
  head:            3  (mouth x, mouth y, head angle)
  hand_flags:      2  (L, R)
  duration:        1
  TOTAL:          98
"""
import contextlib
import ctypes
import math
import os
import sys
import time
import logging

os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
os.environ.setdefault("MEDIAPIPE_DISABLE_LOGGING", "1")
logging.getLogger("absl").setLevel(logging.ERROR)

import numpy as np

# ── Suppress C++ stderr ──
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


import mediapipe as mp

# ── Constants (MUST match model_training_zone/extract.py) ──
N_FEATURES = 98
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)
POSE_IDX = [11, 12, 13, 14, 15, 16, 23, 24]
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9
VIS_MIN = 0.5
HAND_MARGIN_SW = 0.05
REST_SHOULDER_FACTOR = 1.3
AVATAR_FACE = [10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
               159, 145, 386, 374, 1, 61, 291, 0, 17]
FACE_IDX = AVATAR_FACE + [13, 14]
FI = {idx: k for k, idx in enumerate(FACE_IDX)}

# ── Holistic detector (shared) ──
with _suppress_c_stderr():
    _holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=1, smooth_landmarks=True,
        refine_face_landmarks=False, min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    _hands_det = mp.solutions.hands.Hands(
        static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)


# ── Hand-in-use detection ──
def frame_in_use(pose: np.ndarray, W: int, H: int) -> np.ndarray:
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
    """Run MediaPipe Holistic on a single BGR frame.
    Returns raw landmark dict or None if no pose detected."""
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    res = _holistic.process(rgb)

    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    if res.pose_landmarks:
        lm = res.pose_landmarks.landmark
        for k, i in enumerate(POSE_IDX):
            pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)

    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl:
            hands[h] = np.array(
                [(lm.x, lm.y, lm.z) for lm in hl.landmark], np.float32)

    # Rescue missed hands
    H_img, W_img = frame_bgr.shape[:2]
    in_use = frame_in_use(pose, W_img, H_img)
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if missing:
        r2 = _hands_det.process(rgb)
        if r2.multi_hand_landmarks:
            best = {}
            for hl in r2.multi_hand_landmarks:
                pts = np.array([(lm.x, lm.y, lm.z) for lm in hl.landmark], np.float32)
                for wi in (P_LWR, P_RWR):
                    w = pose[wi, :2]
                    if np.isfinite(w).all():
                        d = float(np.hypot(pts[0, 0] - w[0], pts[0, 1] - w[1]))
                        h_idx = 0 if wi == P_LWR else 1
                        if h_idx in missing and d < 0.30:
                            if h_idx not in best or d < best[h_idx][0]:
                                best[h_idx] = (d, pts)
            for h, (_, pts) in best.items():
                hands[h] = pts

    face = np.full((len(FACE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok:
        face = np.array(
            [(res.face_landmarks.landmark[i].x, res.face_landmarks.landmark[i].y,
              res.face_landmarks.landmark[i].z) for i in FACE_IDX], np.float32)

    return {
        "pose": pose, "hands": hands, "face": face,
        "face_ok": f_ok, "W": W_img, "H": H_img,
    }


def extract_98_features(pose, hands, face, face_ok, in_use, W, H, duration) -> np.ndarray | None:
    """Build the 98-dim feature vector for one frame.
    Returns None if shoulders are not visible enough."""
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    if not (np.isfinite(sl).all() and np.isfinite(sr).all()):
        return None
    sw = float(np.linalg.norm(sl - sr))
    if sw < 1.0:
        return None

    origin = (sl + sr) / 2.0
    xax = (sl - sr) / sw
    yax = np.array([xax[1], -xax[0]])

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):
        d = pts[:, :2].astype(np.float64) * [W, H] - origin
        return np.stack([d @ xax / sw, d @ yax / sw, -pts[:, 2].astype(np.float64) * W / sw], 1)

    # Face points in shoulder box
    if face_ok and np.isfinite(face[FI[10], :2]).all():
        forehead = box_xy(face[FI[10], :2])
        mouth = box_xy((face[FI[13], :2] + face[FI[14], :2]) / 2.0)
        chin = box_xy(face[FI[152], :2])
    else:
        forehead = mouth = chin = np.zeros(2)
    face_box = (forehead, mouth, chin)

    hs = np.zeros((2, 11, 3))
    pd = np.zeros((2, 6))
    wp = np.zeros((2, 2))
    wf = np.zeros((2, 3))
    flags = np.zeros(2)

    for h in (0, 1):
        if not in_use[h] or np.isnan(hands[h, 0, 0]):
            continue
        pts_11 = hands[h][HAND_IDX]
        if np.isnan(pts_11).any():
            continue
        box = box_pts(pts_11)
        rel = box - box[0]
        m = rel[H_MID_BASE]
        palm = float(np.linalg.norm(m)) + 1e-9
        phi = math.atan2(m[0], m[1])
        c, s = math.cos(phi), math.sin(phi)
        r = rel / palm
        hs[h] = np.stack([r[:, 0] * c - r[:, 1] * s, r[:, 0] * s + r[:, 1] * c, r[:, 2]], 1)
        pd[h, :3] = m / palm
        n = np.cross(rel[H_INDEX_BASE], rel[H_PINKY_BASE])
        if h == 0:
            n = -n
        pd[h, 3:] = n / (np.linalg.norm(n) + 1e-9)
        wp[h] = box[0, :2]
        for k in range(3):
            wf[h, k] = np.linalg.norm(box[0, :2] - face_box[k])
        flags[h] = 1.0

    elbows = np.concatenate([box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])])
    v = forehead - chin
    head = np.array([mouth[0], mouth[1], math.atan2(v[0], v[1]) if np.linalg.norm(v) > 1e-6 else 0.0])

    f = np.concatenate([hs.ravel(), pd.ravel(), wp.ravel(), elbows,
                        wf.ravel(), head, flags, [duration]])
    assert f.shape[0] == N_FEATURES
    return f.astype(np.float32)
```

### 3.3 Rewrite `backend/streaming.py`

**File: `backend/streaming.py`** (REPLACE ENTIRELY)

```python
"""
backend/streaming.py
Per-session state for continuous sign detection using the new
span-based state machine (IDLE -> SIGN -> end).
Matches model_training_zone/extract.py find_spans() logic.
"""
from collections import OrderedDict
import numpy as np

# Constants from model_training_zone/extract.py
TRIGGER_FRAMES = 3
PRE_ROLL = 8
END_FRAMES = 10
KEEP_TAIL = 2
N_FRAMES = 64
N_FEATURES = 98
MAX_GAP = 5

MAX_SESSIONS = 64


class StreamSession:
    """One client's continuous sign detection state."""

    def __init__(self):
        # Span state machine
        self.state = "IDLE"          # IDLE | SIGN
        self.up_count = 0            # consecutive raised frames
        self.down_count = 0          # consecutive hands-down frames
        self.last_up_idx = 0         # relative index of last raised frame
        self.span_start = 0          # absolute frame index where span starts
        self.frame_index = 0         # global frame counter

        # Frame storage during SIGN state
        self.frames = []             # list of raw frame data dicts
        self.features = []           # list of (frame_idx, feature_vector, complete_flag)

        # Completed spans ready for inference
        self.completed_spans = []    # list of (64, 98) arrays

        # Miss counter for carry-forward
        self.miss = 0


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


def update_span_state(sess: StreamSession, any_hand_up: bool) -> str:
    """Advance the state machine by one frame.
    Returns 'IDLE', 'SIGN', or 'SPAN_COMPLETE'."""
    sess.frame_index += 1

    if sess.state == "IDLE":
        if any_hand_up:
            sess.up_count += 1
            if sess.up_count >= TRIGGER_FRAMES:
                # Transition to SIGN
                sess.state = "SIGN"
                sess.down_count = 0
                sess.frames = []
                sess.features = []
                sess.span_start = sess.frame_index - sess.up_count
                sess.last_up_idx = len(sess.frames)
                return "SIGN"
        else:
            sess.up_count = 0
        return "IDLE"

    else:  # SIGN state
        if any_hand_up:
            sess.last_up_idx = len(sess.frames)
            sess.down_count = 0
        else:
            sess.down_count += 1
            if sess.down_count >= END_FRAMES:
                # Span complete
                end_idx = min(sess.last_up_idx + KEEP_TAIL, len(sess.frames) - 1)
                sess.state = "IDLE"
                sess.up_count = 0
                return "SPAN_COMPLETE"
        return "SIGN"


def select_frames_from_span(features_with_idx: list) -> np.ndarray | None:
    """Select 64 frames from a completed span using the same logic as training.
    features_with_idx: list of (relative_idx, feature_vector_98, is_complete)"""
    F = len(features_with_idx)
    if F == 0:
        return None

    complete = np.array([f[2] for f in features_with_idx], dtype=bool)

    # Build next-complete lookup
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur

    # 64 target positions
    pos = np.floor(np.arange(N_FRAMES) * (F - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0:
            return None
        if n - p > MAX_GAP:
            return None
        chosen.append(n)

    return np.stack([features_with_idx[i][1] for i in chosen])
```

---

## PHASE 4: Backend — NMM Removal + Emotion Preservation (Task 2)

### 4.1 Rewrite `backend/nmm.py`

**File: `backend/nmm.py`** (REPLACE ENTIRELY — NMM removed, emotion kept)

```python
"""
backend/nmm.py
Emotion detection ONLY. All NMM geometry markers have been removed.
The ViT emotion classifier remains untouched.
"""
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
VIT_PATH = ROOT / "models" / "emotion" / "vit_emotion.onnx"

_vit_session = None
_vit_input_name = None
if VIT_PATH.exists():
    try:
        _vit_session = ort.InferenceSession(str(VIT_PATH), providers=["CPUExecutionProvider"])
        _vit_input_name = _vit_session.get_inputs()[0].name
    except Exception as exc:
        print(f"[Emotion] Notice: Could not load ViT emotion model: {exc}")

EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
NORM_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
NORM_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

_last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
_frame_counter = 0

EMOTION_MIN_CONFIDENCE = 0.35


def predict_emotion(face_bgr: np.ndarray) -> dict:
    """Predict emotion from face crop using ViT."""
    if _vit_session is None or face_bgr is None or face_bgr.size == 0:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
    try:
        img = cv2.resize(face_bgr, (224, 224))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        img = (img - NORM_MEAN) / NORM_STD
        img = np.transpose(img, (2, 0, 1))[np.newaxis]
        outputs = _vit_session.run(None, {_vit_input_name: img})
        logits = outputs[0][0]
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / exp_logits.sum()
        scores = {EMOTION_LABELS[i]: round(float(probs[i]), 3) for i in range(len(EMOTION_LABELS))}
        idx = int(np.argmax(probs))
        dom = EMOTION_LABELS[idx]
        conf = float(probs[idx])
        if dom != "neutral" and conf < EMOTION_MIN_CONFIDENCE:
            dom = "neutral"
        return {"dominant": dom, "confidence": round(conf, 3), "scores": scores}
    except Exception:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}


def detect_emotion_from_frame(frame_bgr: np.ndarray) -> dict:
    """Run emotion detection on a frame. Called every 4th frame."""
    global _frame_counter, _last_emotion
    _frame_counter += 1
    if _frame_counter % 4 == 0 or _last_emotion.get("dominant") == "neutral":
        try:
            import mediapipe as mp
            h, w, _ = frame_bgr.shape
            rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            fm = mp.solutions.face_mesh.FaceMesh(
                static_image_mode=True, max_num_faces=1,
                min_detection_confidence=0.5)
            results = fm.process(rgb)
            fm.close()
            if results.multi_face_landmarks:
                lm = results.multi_face_landmarks[0].landmark
                # Bounding box from face mesh
                xs = [lm[i].x for i in range(468)]
                ys = [lm[i].y for i in range(468)]
                min_x = max(0, int(min(xs) * w) - 10)
                max_x = min(w, int(max(xs) * w) + 10)
                min_y = max(0, int(min(ys) * h) - 10)
                max_y = min(h, int(max(ys) * h) + 10)
                if max_x > min_x and max_y > min_y:
                    face_crop = frame_bgr[min_y:max_y, min_x:max_x]
                    _last_emotion = predict_emotion(face_crop)
        except Exception:
            pass
    return _last_emotion


def emotion_available() -> bool:
    return _vit_session is not None


def reset_emotion_state():
    global _last_emotion
    _last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
```

---

## PHASE 5: Backend — Main.py Overhaul (Tasks 1, 2, 3)

### 5.1 Rewrite `backend/main.py`

**File: `backend/main.py`** (REPLACE ENTIRELY)

This is the largest file. Key changes:
- Model registry now expects 98-dim input, 64 frames
- NMM endpoints removed
- Contributions endpoints removed
- Sign span detection uses new state machine
- Simulation endpoint serves avatar data from `models/onnx_models/<id>/avatar/`
- Admin panels read `daily_report.json` and `confusion_matrix.json`

```python
"""
backend/main.py
FastAPI backend for WBSL Bridge — New Architecture.
- 98-dim features, 64-frame temporal model
- Emotion detection (ViT) preserved
- NMM removed
- Community contributions removed
- Model 5 (sign_daily_lstm) only
"""
import os
import json
import logging
import time
from pathlib import Path

os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
logging.getLogger("absl").setLevel(logging.ERROR)

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
from pydantic import BaseModel

from backend.extract import (
    process_holistic_frame, extract_98_features, frame_in_use, N_FEATURES
)
from backend.nmm import detect_emotion_from_frame, emotion_available
from backend.streaming import (
    get_session, reset_session, update_span_state, select_frames_from_span,
    StreamSession, N_FRAMES
)
from backend.llm_engine import (
    generate_bengali, generate_bengali_with_uncertainty, is_llm_available,
    get_ai_config, stream_bengali, break_into_glosses,
)

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
RUNS_DIR = MODELS_DIR / "onnx_models"
TTS_DIR = ROOT / "backend" / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

_ORT_OPTIONS = ort.SessionOptions()
_ORT_OPTIONS.add_session_config_entry("session.max_graph_input_size", "4294967296")

ACTIVE_MODEL_PATH = MODELS_DIR / "active_model.json"
SEQ_T = 64  # New: 64 frames
FEATURE_WIDTH = 98  # New: 98 features
NON_SIGN_CLASSES = {"NONE", "BACKGROUND"}


# ─────────────────────────────────────────────
# MODEL REGISTRY
# ─────────────────────────────────────────────
class ModelRegistry:
    def __init__(self):
        self.models = []
        self.active = None
        self.session = None
        self.input_name = None
        self.classes = []
        self.error = None
        self.model_dir = None
        self.report = None
        self.confusion = None
        self.reload()

    def _discover_models(self):
        found = []
        if not RUNS_DIR.is_dir():
            return found
        for folder in sorted(RUNS_DIR.iterdir()):
            if not folder.is_dir():
                continue
            onnx_file = folder / "sign_daily_lstm.onnx"
            if not onnx_file.exists():
                continue
            classes_file = folder / "sign_daily_classes.json"
            classes = []
            if classes_file.exists():
                try:
                    classes = json.loads(classes_file.read_text(encoding="utf-8"))
                except Exception:
                    classes = []
            # Load report if available
            report = {}
            report_file = folder / "daily_report.json"
            if report_file.exists():
                try:
                    report = json.loads(report_file.read_text(encoding="utf-8"))
                except Exception:
                    pass
            # Load confusion matrix
            confusion = {}
            conf_file = folder / "confusion_matrix.json"
            if conf_file.exists():
                try:
                    confusion = json.loads(conf_file.read_text(encoding="utf-8"))
                except Exception:
                    pass
            # Check avatar data
            avatar_dir = folder / "avatar"
            has_avatar = avatar_dir.is_dir()
            try:
                mtime = onnx_file.stat().st_mtime
            except OSError:
                mtime = 0.0
            found.append({
                "run": f"onnx_models/{folder.name}",
                "name": folder.name,
                "path": str(onnx_file),
                "classes": len(classes),
                "temporal": True,
                "input_width": FEATURE_WIDTH,
                "frames": SEQ_T,
                "size_mb": round(onnx_file.stat().st_size / (1024 * 1024), 2),
                "mtime": mtime,
                "has_avatar": has_avatar,
                "report": report,
                "confusion": confusion,
            })
        found.sort(key=lambda d: d["mtime"], reverse=True)
        return [d for d in found if d["classes"] > 0]

    def reload(self, path=None):
        self.models = self._discover_models()
        self.error = None
        if not self.models:
            self.error = "No valid model found in models/onnx_models/"
            return {"ok": False, "detail": self.error, "models": []}

        target = None
        if path:
            target = next((m for m in self.models if m["path"] == path), None)
        if target is None:
            wanted = None
            if ACTIVE_MODEL_PATH.exists():
                try:
                    wanted = json.loads(ACTIVE_MODEL_PATH.read_text(encoding="utf-8")).get("path")
                except Exception:
                    pass
            if wanted:
                target = next((m for m in self.models if m["path"] == wanted), None)
            if target is None:
                target = self.models[0]

        try:
            self.session = ort.InferenceSession(
                target["path"], sess_options=_ORT_OPTIONS, providers=["CPUExecutionProvider"])
            self.input_name = self.session.get_inputs()[0].name
            self.classes = json.loads(
                Path(target["path"]).parent.joinpath("sign_daily_classes.json")
                .read_text(encoding="utf-8"))
            self.model_dir = Path(target["path"]).parent
            self.report = target.get("report", {})
            self.confusion = target.get("confusion", {})
        except Exception as exc:
            self.error = f"Failed to load model: {exc}"
            return {"ok": False, "detail": self.error, "models": self.models}

        self.active = target
        try:
            ACTIVE_MODEL_PATH.write_text(
                json.dumps({"path": target["path"], "name": target["name"],
                            "run": target["run"]}, indent=2), encoding="utf-8")
        except OSError:
            pass
        return {"ok": True, "active": target, "models": self.models}

    @property
    def active_classes(self):
        return self.classes

    def active_id(self):
        return self.active["path"] if self.active else None

    def public_models(self):
        aid = self.active_id()
        return [{**{k: v for k, v in m.items() if k not in ("report", "confusion")},
                 "active": m["path"] == aid} for m in self.models]


REGISTRY = ModelRegistry()


def _available_model_classes():
    """Classes the active model can recognize (excluding NONE/BACKGROUND)."""
    return [c for c in REGISTRY.active_classes if c not in NON_SIGN_CLASSES]


def _active_run_dir():
    return REGISTRY.model_dir


# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────
app = FastAPI(title="WBSL Bridge Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# SYSTEM HEALTH
# ─────────────────────────────────────────────
@app.get("/api/system/health")
def health(response: Response):
    ai = get_ai_config()
    active = REGISTRY.active or {}
    response.headers["Cache-Control"] = "public, max-age=5"
    return {
        "api": True,
        "model": True,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "ai_mode": ai.get("mode", "offline"),
        "llm_model": ai["model"],
        "dataset_version": "v1.0",
        "model_version": "BiLSTM-attention-98dim",
        "unified": True,
        "active_classes": len(REGISTRY.active_classes),
        "vocabulary_classes": len(_available_model_classes()),
        "active_model": active.get("name"),
        "model_run": active.get("run"),
        "model_path": REGISTRY.active_id(),
        "model_error": REGISTRY.error,
        "contract": {
            "kind": "temporal",
            "input_rank": 3,
            "frames": SEQ_T,
            "feature_width": FEATURE_WIDTH,
            "feature_kind": "shoulder_box_98",
            "endpoint": "/api/predict/stream",
        },
        "emotion_available": emotion_available(),
    }


# ─────────────────────────────────────────────
# MODEL REGISTRY (admin)
# ─────────────────────────────────────────────
class ModelSelectRequest(BaseModel):
    path: str


@app.get("/api/admin/models")
def admin_list_models():
    return {
        "models": REGISTRY.public_models(),
        "active": {k: v for k, v in (REGISTRY.active or {}).items()
                   if k not in ("report", "confusion")},
        "active_path": REGISTRY.active_id(),
        "scan_dir": str(RUNS_DIR),
        "error": REGISTRY.error,
    }


@app.post("/api/admin/models/rescan")
def admin_rescan_models():
    result = REGISTRY.reload()
    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result["detail"])
    return {"models": REGISTRY.public_models(), "active": REGISTRY.active}


@app.post("/api/admin/models/activate")
def admin_activate_model(payload: ModelSelectRequest):
    result = REGISTRY.reload(payload.path)
    if not result["ok"]:
        raise HTTPException(status_code=409, detail=result["detail"])
    return {"ok": True, "active": REGISTRY.active, "models": REGISTRY.public_models()}


# ─────────────────────────────────────────────
# MODEL DETAILS (admin)
# ─────────────────────────────────────────────
@app.get("/api/admin/model/report")
def admin_model_report():
    """Full training report from daily_report.json."""
    return REGISTRY.report or {}


@app.get("/api/admin/model/confusion")
def admin_model_confusion():
    """Confusion matrix from confusion_matrix.json."""
    return REGISTRY.confusion or {}


@app.get("/api/admin/model/avatar-list")
def admin_avatar_list():
    """List of glosses that have avatar data."""
    run_dir = _active_run_dir()
    if not run_dir:
        return {"glosses": []}
    avatar_dir = run_dir / "avatar"
    if not avatar_dir.is_dir():
        return {"glosses": []}
    glosses = sorted([d.name for d in avatar_dir.iterdir() if d.is_dir()])
    return {"glosses": glosses}


# ─────────────────────────────────────────────
# PREDICTION: Continuous stream (new span-based)
# ─────────────────────────────────────────────
@app.post("/api/stream/frame")
async def stream_frame(session_id: str = "default", file: UploadFile = File(...)):
    """One frame in. Server accumulates frames and runs inference
    when a sign span completes (hands raised then lowered)."""
    if REGISTRY.session is None:
        raise HTTPException(409, "No model loaded.")

    raw = await file.read()
    fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if fr is None:
        raise HTTPException(400, "Could not decode image")

    sess = get_session(session_id)
    H_img, W_img = fr.shape[:2]

    # Run holistic detection
    result = process_holistic_frame(fr)
    if result is None:
        # No pose detected — treat as hands down
        state = update_span_state(sess, False)
        return {"ready": False, "buffered": len(sess.frames),
                "state": state, "detail": "no_pose"}

    pose = result["pose"]
    hands = result["hands"]
    face = result["face"]
    face_ok = result["face_ok"]

    in_use = frame_in_use(pose, W_img, H_img)
    any_up = bool(in_use.any())
    state = update_span_state(sess, any_up)

    # Store frame data
    sess.frames.append(result)

    # Compute 98-dim features for this frame
    duration_est = len(sess.frames) / 30.0  # rough estimate
    feat = extract_98_features(pose, hands, face, face_ok, in_use, W_img, H_img, duration_est)
    is_complete = feat is not None and face_ok and in_use.any()
    sess.features.append((len(sess.frames) - 1,
                          feat if feat is not None else np.zeros(N_FEATURES, np.float32),
                          is_complete))

    # Emotion detection
    emotion = detect_emotion_from_frame(fr)

    if state == "SPAN_COMPLETE":
        # Build clip and run inference
        clip = select_frames_from_span(sess.features)
        # Reset session for next span
        span_frames = sess.frames[:]
        sess.frames = []
        sess.features = []
        sess.up_count = 0
        sess.down_count = 0

        if clip is None:
            return {"ready": False, "buffered": 0, "state": "IDLE",
                    "detail": "incomplete_span", "emotion": emotion}

        # Run model
        logits = REGISTRY.session.run(
            None, {REGISTRY.input_name: clip[np.newaxis].astype(np.float32)})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]

        top_prob = float(probs[order[0]])
        margin = float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0

        # "Not sure" logic from test_model.py
        not_sure = top_prob < 0.5 or margin < 0.15

        return {
            "ready": True,
            "label": REGISTRY.active_classes[int(order[0])] if not not_sure else "NOT_SURE",
            "confidence": top_prob,
            "margin": margin,
            "frames_used": N_FRAMES,
            "state": "IDLE",
            "emotion": emotion,
            "top3": [{"label": REGISTRY.active_classes[int(i)],
                      "confidence": float(probs[i])} for i in order],
        }

    return {"ready": False, "buffered": len(sess.frames),
            "state": state, "emotion": emotion}


@app.post("/api/stream/reset")
def stream_reset(session_id: str = "default"):
    reset_session(session_id)
    return {"ok": True}


# ─────────────────────────────────────────────
# PREDICTION: Clip upload (batch)
# ─────────────────────────────────────────────
@app.post("/api/predict/clip")
async def predict_clip(files: list[UploadFile] = File(...)):
    """Upload a video clip as frames. Server extracts features and predicts."""
    if REGISTRY.session is None:
        raise HTTPException(409, "No model loaded.")

    frames_data = []
    for f in files:
        raw = await f.read()
        fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
        if fr is not None:
            frames_data.append(fr)

    if len(frames_data) < 8:
        return {"ready": False, "detail": "Too few frames"}

    # Process each frame
    features_list = []
    for idx, fr in enumerate(frames_data):
        H_img, W_img = fr.shape[:2]
        result = process_holistic_frame(fr)
        if result is None:
            continue
        pose, hands, face, face_ok = result["pose"], result["hands"], result["face"], result["face_ok"]
        in_use = frame_in_use(pose, W_img, H_img)
        duration = len(frames_data) / 30.0
        feat = extract_98_features(pose, hands, face, face_ok, in_use, W_img, H_img, duration)
        if feat is not None:
            features_list.append(feat)

    if len(features_list) < 8:
        return {"ready": False, "detail": "Not enough valid frames"}

    # Resample to 64
    if len(features_list) != N_FRAMES:
        idx = np.linspace(0, len(features_list) - 1, N_FRAMES).astype(int)
        features_list = [features_list[i] for i in idx]

    clip = np.array(features_list, np.float32)[np.newaxis]
    logits = REGISTRY.session.run(None, {REGISTRY.input_name: clip})[0][0]
    probs = np.exp(logits - logits.max())
    probs /= probs.sum()
    order = np.argsort(probs)[::-1][:3]

    return {
        "ready": True,
        "label": REGISTRY.active_classes[int(order[0])],
        "confidence": float(probs[order[0]]),
        "frames_used": N_FRAMES,
        "top3": [{"label": REGISTRY.active_classes[int(i)],
                  "confidence": float(probs[i])} for i in order],
    }


# ─────────────────────────────────────────────
# SIMULATION (avatar data)
# ─────────────────────────────────────────────
@app.get("/api/simulation/avatar")
def simulation_avatar(label: str = ""):
    """Serve avatar data for the 3D simulation."""
    run_dir = _active_run_dir()
    if not run_dir:
        raise HTTPException(404, "No active model")
    avatar_dir = run_dir / "avatar" / label.upper().replace(" ", "_")
    if not avatar_dir.is_dir():
        raise HTTPException(404, f"No avatar data for '{label}'")

    result = {"label": label, "frames": [], "pose": [], "hands": [], "face": [], "t": []}
    try:
        pose = np.load(avatar_dir / "pose.npy")
        hands = np.load(avatar_dir / "hands.npy")
        face = np.load(avatar_dir / "face.npy")
        t = np.load(avatar_dir / "t.npy")
        result["pose"] = pose.tolist()
        result["hands"] = hands.tolist()
        result["face"] = face.tolist()
        result["t"] = t.tolist()
        result["frames"] = len(t)
    except Exception as e:
        raise HTTPException(500, f"Error loading avatar data: {e}")

    # Also load meta.json if available
    meta_file = avatar_dir / "meta.json"
    if meta_file.exists():
        try:
            result["meta"] = json.loads(meta_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    return result


@app.get("/api/simulation/frames")
def simulation_frames(label: str = ""):
    """Legacy endpoint — now serves avatar data in old format for compatibility."""
    run_dir = _active_run_dir()
    if not run_dir:
        raise HTTPException(404, "No active model")
    avatar_dir = run_dir / "avatar" / label.upper().replace(" ", "_")
    if not avatar_dir.is_dir():
        raise HTTPException(404, f"No avatar data for '{label}'")

    try:
        hands = np.load(avatar_dir / "hands.npy")  # (F, 42, 3)
        pose = np.load(avatar_dir / "pose.npy")    # (F, 8, 4)
        result = {
            "frames": hands.tolist(),
            "pose": pose.tolist(),
            "points": 42,
            "count": int(len(hands)),
            "source": f"avatar:{label}",
            "width": FEATURE_WIDTH,
        }
    except Exception as e:
        raise HTTPException(500, f"Error: {e}")
    return result


# ─────────────────────────────────────────────
# DATASET / SIGNS
# ─────────────────────────────────────────────
@app.get("/api/dataset/signs")
def get_signs(page: int = 1, limit: int = 20, search: str = ""):
    classes = _available_model_classes()
    if search:
        q = search.lower()
        classes = [c for c in classes if q in c.lower()]
    total = len(classes)
    start = (page - 1) * limit
    items = [
        {"id": str(start + i), "label": c,
         "bengali_meaning": c.replace("_", " ").title(),
         "category": "Alphabet" if len(c) == 1 and c.isalpha() else "Word",
         "language": "ISL"}
        for i, c in enumerate(classes[start:start + limit])
    ]
    return {"items": items, "total": total, "page": page, "limit": limit,
            "total_pages": max(1, (total + limit - 1) // limit)}


@app.get("/api/coverage")
def coverage():
    classes = _available_model_classes()
    return {
        "total_classes": len(classes),
        "items": [{"label": c, "bengali": c.replace("_", " ").title(),
                   "category": "Word", "has_landmarks": True} for c in classes],
        "active_model": REGISTRY.active.get("name") if REGISTRY.active else None,
        "endpoint": "/api/stream/frame",
    }


# ─────────────────────────────────────────────
# NLG
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str
    emotion: dict | None = None

    def meta(self) -> dict:
        return {"emotion": self.emotion}


@app.get("/api/nlg/status")
def nlg_status():
    ai = get_ai_config()
    return {
        "llm_available": is_llm_available(),
        "engine": ai["model"],
        "endpoint": ai["base_url"],
        "inference_mode": ai["provider"],
        "ai_mode": ai.get("mode", "offline"),
        "stream": ai["stream"],
        "reasoning": ai["reasoning"],
    }


@app.post("/api/nlg/generate")
def nlg_generate(payload: NLGRequest):
    return generate_bengali(payload.gloss, meta=payload.meta())


@app.post("/api/nlg/stream")
def nlg_stream(payload: NLGRequest):
    ai = get_ai_config()

    def event_source():
        for event in stream_bengali(payload.gloss, meta=payload.meta()):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_source(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/api/nlg/generate-sequence")
def nlg_generate_sequence(payload: dict):
    return generate_bengali_with_uncertainty(payload.get("sequence", []))


# ─────────────────────────────────────────────
# TEXT TO SIGN
# ─────────────────────────────────────────────
class TextToSignRequest(BaseModel):
    text: str


@app.get("/api/text-to-sign/vocabulary")
def text_to_sign_vocabulary():
    glosses = _available_model_classes()
    return {"glosses": glosses, "available_signs": len(glosses)}


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    vocabulary = _available_model_classes()
    if not vocabulary:
        raise HTTPException(503, "No model vocabulary available.")
    # Simple matching
    words = payload.text.lower().split()
    matched = [v for v in vocabulary if v.lower() in words]
    return {
        "input_text": payload.text,
        "gloss_sequence": matched,
        "unsupported_concepts": [w for w in words if w not in [m.lower() for m in matched]],
        "status": "success" if matched else "unresolved",
        "available_signs": len(vocabulary),
        "engine": "nlp",
    }


@app.post("/api/text-to-sign/llm")
def text_to_sign_llm(payload: TextToSignRequest):
    vocab = _available_model_classes()
    if not vocab:
        raise HTTPException(503, "No model vocabulary available.")
    res = break_into_glosses(payload.text, vocab)
    if res.get("status") == "error":
        raise HTTPException(503, f"LLM error: {res.get('error')}")
    return {
        "input_text": payload.text,
        "gloss_sequence": res.get("gloss_sequence", []),
        "unsupported_concepts": res.get("unsupported_concepts", []),
        "status": res.get("status", "unresolved"),
        "available_signs": len(vocab),
        "engine": "llm",
    }


# ─────────────────────────────────────────────
# TTS (unchanged)
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
        return {"text": text, "audio_url": None, "engine": engine,
                "duration_ms": 0, "status": f"tts_error: {e}", "error": str(e)}


@app.get("/api/tts/audio/{filename}")
def serve_tts_audio(filename: str):
    filepath = TTS_DIR / filename
    if not filepath.exists():
        raise HTTPException(404, "Audio file not found")
    media_type = "audio/mpeg" if filename.endswith(".mp3") else "audio/wav"
    return FileResponse(str(filepath), media_type=media_type)


@app.get("/api/tts/voices")
def list_tts_voices():
    from backend.tts_engine import VOICES_FREE, VOICES_ELEVENLABS, is_elevenlabs_configured
    voices_list = []
    for k, v in VOICES_FREE.items():
        voices_list.append({"id": k, "label": v[0], "engine": "free", "tier": "free"})
    for k, v in VOICES_ELEVENLABS.items():
        voices_list.append({"id": k, "label": v[0], "engine": "elevenlabs", "tier": "premium"})
    return {"voices": voices_list, "elevenlabs_configured": is_elevenlabs_configured()}


# ─────────────────────────────────────────────
# STT (unchanged)
# ─────────────────────────────────────────────
from backend.stt_engine import transcribe_bytes, is_elevenlabs_configured  # noqa: E402


@app.get("/api/stt/status")
def get_stt_status():
    return {"default_engine": "local", "engines": ["local", "elevenlabs"],
            "elevenlabs_configured": is_elevenlabs_configured()}


@app.post("/api/stt")
async def speech_to_text(file: UploadFile = File(...), language: str = "",
                         engine: str = "local", **kwargs):
    from fastapi import Form
    data = await file.read()
    if not data:
        raise HTTPException(400, "Empty audio")
    return transcribe_bytes(data=data, filename=file.filename or "rec.webm",
                            language=language, engine=engine)


# ─────────────────────────────────────────────
# ADMIN STATS
# ─────────────────────────────────────────────
@app.get("/api/admin/stats")
def admin_stats():
    ai = get_ai_config()
    return {
        "total_signs": len(_available_model_classes()),
        "model_active": REGISTRY.active.get("name") if REGISTRY.active else None,
        "model_classes": len(REGISTRY.active_classes),
        "contract": {"kind": "temporal", "feature_width": FEATURE_WIDTH, "frames": SEQ_T},
        "llm_available": is_llm_available(),
        "llm_model": ai["model"],
        "inference_mode": ai["provider"],
        "ai_mode": ai.get("mode", "offline"),
        "dataset_version": "v1.0",
    }


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)
```

---

## PHASE 6: Frontend — NMM UI Removal (Task 2)

### 6.1 DELETE `frontend/src/components/sign/NmmThresholdPanel.tsx`

### 6.2 Update `frontend/src/app/sign-to-text/page.tsx`

Remove all NMM imports and usage. Key changes:
- Remove `NmmThresholdPanel` import
- Remove `nmm` state and badge group
- Keep `EmotionPanel`
- Update prediction interface to remove `nmm` field
- Update `commitFromStream` to not reference NMM

**In the file, find and remove:**
```tsx
// REMOVE this import
import { NmmThresholdPanel, DEFAULT_ALL, DEFAULT_MARKER_GATES, COMMIT_STORAGE_KEY, ... } from "@/components/sign/NmmThresholdPanel";
```

**Remove the NMM badge group section** (the div with "Non-Manual Markers" heading).

**Remove `nmmFlags` state and all NMM-related logic from `commitFromStream`.**

**Keep the `EmotionPanel` component and emotion state.**

### 6.3 Update `frontend/src/lib/types.ts`

**Remove `NMMFlags` interface entirely.** Keep everything else.

```typescript
// REMOVE this interface:
// export interface NMMFlags { ... }
```

### 6.4 Update `frontend/src/store/recording-store.ts`

**Remove `nmmTags` from the store** (since contributions are being removed, this store becomes mostly unused, but clean it):

Remove the `nmmTags` field and `toggleNMMTag`, `resetNMMTags` actions.

---

## PHASE 7: Frontend — Contributions Removal (Task 3)

### 7.1 DELETE these files/folders:
- `frontend/src/app/contribute/` (entire folder)
- `frontend/src/services/contributions.ts`
- `frontend/src/components/recording/PrivacyGate.tsx`
- `frontend/src/components/recording/UploadRecovery.tsx`
- `frontend/src/components/verification/EvidencePanel.tsx`
- `frontend/src/store/recording-store.ts`

### 7.2 Replace `frontend/src/app/admin/contributions/page.tsx`

**File: `frontend/src/app/admin/contributions/page.tsx`** (REPLACE — disabled placeholder)

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
        <h2 className="text-lg font-semibold text-text-primary">
          Coming Soon
        </h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Community contribution functionality is planned for a future release.
          This feature will allow signers to contribute gesture data for model improvement.
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

### 7.3 Update `frontend/src/components/layout/AdminSidebar.tsx`

Keep the Contributions link but mark it visually as disabled/planned:

```tsx
// In the links array, keep the entry but it now points to the disabled page
{ label: "Contributions", href: "/admin/contributions", icon: CheckSquare },
```

No code change needed here since the page itself is now a disabled placeholder.

### 7.4 Update `frontend/src/app/admin/page.tsx`

Remove the contributions link from the quick launch panel. Replace with a disabled card:

```tsx
// Replace the Link to /admin/contributions with:
<div className="p-6 rounded-lg bg-surface border border-border opacity-50 cursor-not-allowed flex flex-col justify-between space-y-4">
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
```

### 7.5 Update `frontend/src/components/layout/AppSidebar.tsx`

Remove the "Contribute" link from `NAVIGATION_LINKS` usage. In `frontend/src/lib/constants.ts`:

```typescript
export const NAVIGATION_LINKS = [
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  // { label: "Contribute", href: "/contribute" },  // REMOVED
  { label: "About", href: "/about" },
];
```

---

## PHASE 8: Frontend — Simulation Update (Task 1.2)

### 8.1 Update `frontend/src/lib/pose.ts`

**File: `frontend/src/lib/pose.ts`** (REPLACE)

```typescript
/**
 * frontend/src/lib/pose.ts
 * Client-side mirror of backend/pose.py — NEW 8-point architecture.
 */
export const POSE_POINTS = 8;

export const POSE_BODY_PAIRS: [number, number][] = [
  [0, 1],              // shoulders
  [0, 2], [2, 4],     // left arm
  [1, 3], [3, 5],     // right arm
  [0, 6], [1, 7], [6, 7], // torso
];

export const POSE_FACE_MARKERS: number[] = [];  // NMM face markers removed

export const POSE_FACE_PAIRS: [number, number][] = [];

export type PosePoint = [number, number, number, number];
```

### 8.2 Update `frontend/src/components/simulation/LandmarkSimulation.tsx`

The key change: `POSE_POINTS` is now 8 instead of 33. The simulation component reads `pose` data from the API. Since the avatar data structure changed (8 pose points instead of 33), update the pose handling:

In `LandmarkSimulation.tsx`, find all references to `POSE_POINTS` (imported from `@/lib/pose`) — these will automatically update since we changed the constant.

The `BODY_GUIDE` array needs to be updated for 8 points:

```typescript
// Replace the 33-point BODY_GUIDE with 8-point version
const BODY_GUIDE: PosePoint[] = [
  [-0.7, -1.25, 0, 1],   // 0: left shoulder
  [0.7, -1.25, 0, 1],    // 1: right shoulder
  [-1.1, -0.65, 0, 1],   // 2: left elbow
  [1.1, -0.65, 0, 1],    // 3: right elbow
  [-1.35, 0, 0, 1],      // 4: left wrist
  [1.35, 0, 0, 1],       // 5: right wrist
  [-0.45, 0.55, 0, 1],   // 6: left hip
  [0.45, 0.55, 0, 1],    // 7: right hip
];
```

### 8.3 Update simulation API endpoint usage

The `simulation_frames` endpoint now returns avatar data in the new format. The frontend components that call `/api/simulation/frames` should work with the new response shape since we kept the same response structure (`frames`, `pose`, `points`, `count`).

---

## PHASE 9: Frontend — Admin Panels Update (Task 1.3)

### 9.1 Update `frontend/src/app/admin/models/page.tsx`

Update `SERVABLE_WIDTHS` to reflect the new architecture:

```typescript
// Replace:
// const SERVABLE_WIDTHS = [126, 258];
// With:
const SERVABLE_WIDTHS = [98];

// Update featureLabel:
const featureLabel = (m: ModelEntry) => {
  if (m.temporal) return "BiLSTM temporal · 98-dim shoulder box";
  return `input ${m.input_width ?? "?"}-dim`;
};
```

### 9.2 Update `frontend/src/app/admin/settings/page.tsx`

Update the rows to reflect new architecture:

```typescript
const rows: [string, string][] = [
  ["API PORT", "8200"],
  ["ACTIVE MODEL", `${health?.active_model ?? "—"} (${health?.model_run ?? "—"})`],
  ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? 98}-dim · ${health?.contract?.frames ?? 64} frames`],
  ["ARCHITECTURE", "BiLSTM + Attention (98-dim shoulder box)"],
  ["SIGN VOCABULARY", String(health?.vocabulary_classes ?? 0)],
  ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
  ["AI MODE", health?.ai_mode ?? "offline"],
  ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
];
```

### 9.3 Create `frontend/src/app/admin/models/[id]/page.tsx` (OPTIONAL — model detail view)

If you want a detailed model info page showing `daily_report.json` data:

```tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:8200";

export default function ModelDetailPage() {
  const { data: report } = useQuery({
    queryKey: ["model-report"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/admin/model/report`)).data,
  });

  if (!report || !report.model_id) {
    return <div className="text-xs font-mono text-text-muted p-6">No report available.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-text-primary">Model {report.model_id} — Training Report</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-surface border border-border rounded">
          <div className="text-xs text-text-muted">Best Val Accuracy</div>
          <div className="text-2xl font-bold text-accent-primary">{(report.best_val_acc * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded">
          <div className="text-xs text-text-muted">Top-3 Accuracy</div>
          <div className="text-2xl font-bold text-accent-secondary">{(report.val_top3_acc * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded">
          <div className="text-xs text-text-muted">Classes</div>
          <div className="text-2xl font-bold">{report.data?.classes ?? "—"}</div>
        </div>
        <div className="p-4 bg-surface border border-border rounded">
          <div className="text-xs text-text-muted">Training Time</div>
          <div className="text-2xl font-bold">{report.training_seconds ?? "—"}s</div>
        </div>
      </div>
    </div>
  );
}
```

---

## PHASE 10: Frontend — Remove Unused Components

### 10.1 DELETE these files:
- `frontend/src/components/sign/NmmThresholdPanel.tsx`
- `frontend/src/components/pipeline/PipelineStatus.tsx` (references NMM pipeline stage)
- `frontend/src/app/demo/page.tsx` (uses NMM pipeline)
- `frontend/src/hooks/useRecording.ts` (contributions only)
- `frontend/src/hooks/useCamera.ts` (only used by contributions)

### 10.2 Update `frontend/src/app/sign-to-text/page.tsx`

Remove the `FramingWarningArea` import if it references NMM. Keep `CameraFramingGuide`.

Remove the NMM-related state variables:
- `nmmFlags`
- `markerGates`
- `thresholds` (the NMM threshold panel)
- All NMM badge rendering

Keep:
- `emotion` state
- `EmotionPanel` component
- Camera feed
- Live recognition
- Bengali translation output

---

## PHASE 11: Cleanup — Remove Old Backend Files

### 11.1 DELETE:
- `backend/__init__.py` (empty, not needed)

### 11.2 Verify `backend/stt_engine.py` and `backend/tts_engine.py`

These files are **unchanged**. They have no NMM or contributions references. Keep them as-is.

---

## PHASE 12: Frontend — Update Sign-to-Text Page for New Detection

The sign-to-text page needs to work with the new span-based detection:

### Key changes to `frontend/src/app/sign-to-text/page.tsx`:

1. **Remove all NMM imports and state**
2. **Remove `NmmThresholdPanel`**
3. **Remove NMM badge group**
4. **Update `StreamResult` interface:**

```typescript
interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: { dominant: string; confidence: number; scores: Record<string, number> } | null;
  detail?: string;
  buffered?: number;
  state?: string;
  top3?: { label: string; confidence: number }[];
}
```

5. **Remove `nmm` from the NLG request body** — only send `emotion`:

```typescript
body: JSON.stringify({
  gloss,
  emotion,
}),
```

6. **Remove the `buildGlossString` NMM annotation logic** — simplify to just join glosses:

```typescript
const buildGlossString = (history: DetectedSign[]) => {
  if (history.length === 0) return "";
  return history.map((h) => `[${h.gloss.toLowerCase()}]`).join(" + ");
};
```

7. **Update `DetectedSign` interface** — remove NMM fields:

```typescript
interface DetectedSign {
  gloss: string;
}
```

---

## PHASE 13: Verification Checklist

After all changes, verify:

### Backend:
- [ ] `python -c "from backend.main import app"` — no import errors
- [ ] `uvicorn backend.main:app --port 8200` starts cleanly
- [ ] `GET /api/system/health` returns valid JSON with `feature_width: 98`
- [ ] `GET /api/admin/models` shows only Model 5
- [ ] `GET /api/admin/model/report` returns training report
- [ ] `POST /api/stream/frame` with a JPEG returns `{"ready": false, ...}`
- [ ] `GET /api/simulation/avatar?label=HELLO` returns avatar data (if available)
- [ ] `GET /api/nlg/status` shows correct AI mode
- [ ] No references to NMM in any response
- [ ] No contributions endpoints exist

### Frontend:
- [ ] `npm run build` completes without errors
- [ ] Sign-to-Text page loads without NMM panel
- [ ] Emotion panel still shows
- [ ] Admin > Models shows Model 5 only
- [ ] Admin > Contributions shows "Coming Soon" disabled page
- [ ] Admin > Settings shows 98-dim, 64 frames
- [ ] Text-to-Sign page works
- [ ] No console errors about missing modules

### LLM:
- [ ] `.env` with `AI_MODE=offline` → KoboldCpp starts with Nemotron model
- [ ] `.env` with `AI_MODE=online` → No local server, uses OpenRouter
- [ ] Switching `AI_MODE` and restarting changes behavior
- [ ] No automatic fallback between modes

### start.ps1:
- [ ] Reads `.env` correctly
- [ ] Shows AI mode in terminal title
- [ ] Offline mode launches KoboldCpp with correct model path
- [ ] Online mode shows info tab without launching KoboldCpp

---

## PHASE 14: File Summary

### Files CREATED:
| File | Purpose |
|------|---------|
| `.env` | AI mode configuration |

### Files REPLACED (full rewrite):
| File | Reason |
|------|--------|
| `backend/extract.py` | New 98-dim feature extraction |
| `backend/pose.py` | New 8-point pose |
| `backend/streaming.py` | Span-based state machine |
| `backend/nmm.py` | NMM removed, emotion kept |
| `backend/main.py` | Complete overhaul |
| `backend/llm_engine.py` | AI_MODE support |
| `start.ps1` | .env parsing, mode selection |
| `models/active_model.json` | Point to Model 5 |
| `frontend/src/lib/pose.ts` | 8-point pose |
| `frontend/src/lib/constants.ts` | Remove Contribute link |
| `frontend/src/app/admin/contributions/page.tsx` | Disabled placeholder |

### Files DELETED:
| File/Folder | Reason |
|-------------|--------|
| `models/onnx_models/1/` | Old model |
| `models/onnx_models/2/` | Old model |
| `models/onnx_models/3/` | Old model |
| `models/onnx_models/4/` | Old model |
| `frontend/src/components/sign/NmmThresholdPanel.tsx` | NMM removed |
| `frontend/src/app/contribute/` | Contributions removed |
| `frontend/src/services/contributions.ts` | Contributions removed |
| `frontend/src/components/recording/PrivacyGate.tsx` | Contributions removed |
| `frontend/src/components/recording/UploadRecovery.tsx` | Contributions removed |
| `frontend/src/components/verification/EvidencePanel.tsx` | Contributions removed |
| `frontend/src/store/recording-store.ts` | Contributions removed |
| `frontend/src/hooks/useRecording.ts` | Contributions removed |
| `frontend/src/hooks/useCamera.ts` | Contributions removed |
| `frontend/src/components/pipeline/PipelineStatus.tsx` | NMM pipeline removed |
| `frontend/src/app/demo/page.tsx` | Uses NMM pipeline |
| `backend/__init__.py` | Empty |

### Files UNCHANGED:
| File | Reason |
|------|--------|
| `backend/stt_engine.py` | No NMM/contributions references |
| `backend/tts_engine.py` | No NMM/contributions references |
| `model_training_zone/*` | NEVER MODIFY |
| `frontend/src/app/admin/layout.tsx` | Structure preserved |
| `frontend/src/app/admin/models/page.tsx` | Minor update only |
| `frontend/src/app/admin/videos/page.tsx` | Works with new endpoint |
| `frontend/src/components/simulation/*` | Updated via pose.ts change |
| `frontend/src/components/camera/*` | No NMM references |
| `frontend/src/services/api.ts` | Generic, no changes needed |
| `frontend/src/services/auth.ts` | No changes needed |
| `frontend/src/services/nlg.ts` | No changes needed |
| `frontend/src/services/stats.ts` | No changes needed |

---

## IMPORTANT NOTES

1. **The 98-dim features MUST match training exactly.** The shoulder box coordinate system, hand indexing (left=0, right=1), palm normal mirroring for left hand, and duration calculation must be identical to `model_training_zone/extract.py`.

2. **The model input is `(batch, 64, 98)` float32.** The ONNX graph's input name is `"sequence"`. Do NOT send 126-dim or 258-dim vectors.

3. **Avatar data lives at `models/onnx_models/5/avatar/<GLOSS>/`** with `pose.npy (F,8,4)`, `hands.npy (F,42,3)`, `face.npy (F,19,3)`, `t.npy (F,)`.

4. **Emotion detection is preserved.** The ViT model at `models/emotion/vit_emotion.onnx` continues to work. Only the 5 geometry NMM markers are removed.

5. **No automatic mode fallback.** If `AI_MODE=offline` and KoboldCpp is not running, the system shows an error. It does NOT switch to online.

6. **The frontend `sign-to-text` page now uses span-based detection.** The user signs naturally — raises hands, signs, lowers hands. The backend detects the span boundaries automatically and runs inference once per completed sign.