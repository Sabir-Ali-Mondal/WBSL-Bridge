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
import socket
from urllib.parse import urlparse
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


def build_user_message(gloss_text: str, meta: dict | None = None) -> str:
    """
    Compose the user turn: the gloss itself, plus any NMM / affect context.

    The recognition layer already knows things the gloss string cannot express --
    head shake (negation), brow raise (polar question), brow furrow (WH question),
    mouth opening (emphasis) and the dominant facial emotion (ViT). Dropping them
    on the floor leaves the LLM guessing, so they are forwarded as an explicit
    metadata block. The model is told what each signal means; it is NOT told how
    to phrase the sentence, which stays the prompt's job.
    """
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


def _host_is_reachable(base_url: str, budget: float = 0.12) -> bool:
    """Cheap TCP pre-flight before spending a full HTTP round trip.

    A refused connection is NOT cheap on Windows when the host is a name like
    ``localhost``: it resolves to both ``::1`` and ``127.0.0.1``, and each
    address is attempted in turn, so a single failed request costs the connect
    timeout *twice*. Measured here that was ~0.3 s per address and ~2.4 s for the
    two-path probe -- paid on the mount of every page, purely to discover that
    the LLM server is not running.

    Opening a raw socket first turns "nothing is listening" into a sub-
    millisecond verdict, so the expensive path is only taken when there is
    genuinely something to talk to. The budget is deliberately tight: this is a
    liveness check, not a health check.
    """
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
    """True when the configured provider responds to a models/health probe.

    This is called by ``/api/system/health``, which every page polls on mount to
    learn the model contract. It therefore has to be *fast* when the provider is
    absent, and the naive version was not: when the configured host is a local
    server that is not running, each unreachable address burned the full 5 s
    timeout. Two things were wrong and both are fixed here.

    First, a reachable host answering ``401``/``403`` is the *normal* response
    from an OpenAI-compatible endpoint that wants a real key. A connect-and-see
    probe reports that as "not available" and then wrongly reports every other
    provider as missing too. Only 5xx and connection failures mean unavailable.

    Second, ``timeout=`` alone does not bound resolution: on Windows ``localhost``
    resolves to both ``::1`` and ``127.0.0.1``, and httpx tries them in turn, so a
    refused IPv6 attempt plus a refused IPv4 attempt can exceed it. Pinning an
    explicit ``ConnectTimeout`` separates "cannot connect" -- which is cheap and
    definitive -- from "connected but slow", and collapses the whole probe to
    tens of milliseconds when nothing is listening.
    """
    cfg = get_ai_config()
    if not cfg["api_key"]:
        return False  # nothing configured -> do not silently fall back to a local LLM

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
                # 2xx = healthy, 401/403 = server is up but wants a key. Either
                # way the provider is reachable.
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
    meta: dict | None = None,
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