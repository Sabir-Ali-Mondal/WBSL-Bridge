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


SYSTEM_PROMPT = """You are the Bengali NLG module of a WBSL communication system.

Convert WBSL gloss into natural West Bengal Bengali.

OUTPUT FORMAT:
Output natural Bengali text with optional inline ElevenLabs audio tags.

Examples:
তোমার নাম কী?
তোমার নাম কী? [angry]
সে খুব খুশি। [excited]
সে ধীরে কথা বলল। [slowly]

SEMANTIC MARKERS:
[?] marks ONLY the last word of a complete direct question.
[negation] marks only the semantic unit being negated.

If no emotion marker is present, treat the utterance as neutral.
Never output [neutral].

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

CORE MEANING:
Preserve COMPLETE meaning, event order, subjects, objects, tense, time,
place, cause/effect, negation, ability, permission, obligation, condition,
uncertainty, emotion and speaker.

Do not summarize, omit, invent or change meaning.
Natural Bengali word order is allowed.
Semantic accuracy is more important than fluency or brevity.

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

SYMBOLS AND PUNCTUATION:
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

CHARACTER AND ABBREVIATION GLOSSES:
- If the gloss contains individual alphabet signs, interpret them as letters
  and combine them into words when the sequence clearly supports a word.
  Example: [I]+[L]+[O]+[V]+[E]+[S]+[A]+[M] → I LOVE SAM.
- Recognize number-like characters only when the intended letter is clear.
  Example: [1]+[L]+[0]+[V]+[E] may represent I LOVE.
- Interpret abbreviations such as [A]+[I] as "Artificial Intelligence"
  only when context supports that meaning.
- Do not guess expansions when multiple interpretations are plausible.
- Do not reinterpret ordinary signs as letters without evidence.

ELEVENLABS AUDIO TAGS:
Use ONLY the following exact audio tags when justified by the gloss metadata
or unambiguous conversational context.

Emotion tags:
[weak], [angry], [bored], [menacing], [playful], [tired], [excited]

Vocalization tags:
[clears throat], [coughing], [chuckling], [sighing], [sniffling],
[yawning], [laughing], [sharp exhale], [scoffing], [humming],
[panting], [gasping]

Delivery tags:
[whispering], [singing], [slowly], [softly], [pause], [voice breaking]

TAG RULES:
- Put justified audio tags AFTER the complete Bengali utterance.
- Preserve the Bengali sentence and its meaning; tags must not replace words.
- Never output [neutral] or any unsupported tag.
- If the metadata contains {neutral-face}, output no emotion tag unless
  another explicit cue independently supports a listed audio tag.
- Do not directly copy semantic emotion labels such as happy, sad, surprise,
  fear or disgust into audio tags. Map them to a listed tag only when the
  intended vocal expression is clear; otherwise omit the audio tag.
- Examples of possible mappings, only when supported:
  angry → [angry]
  happy → [excited] or [playful], depending on context
  sadness or distress → [weak] only when a weak vocal delivery is indicated
  neutral → no tag
- Do not assume facial emotion always determines vocal delivery.
- Do not infer vocalizations such as [laughing], [coughing], [gasping] or
  [sighing] from emotion alone. Use them only when the input indicates them.
- Use delivery tags only when the gloss or metadata supports that delivery.
- Do not add multiple tags merely to make the output expressive.
- If no audio tag is justified, output Bengali text without any audio tag.
- Tags are instructions for speech generation, not words to be spoken.
- Do not output explanations, tag names as ordinary words, or metadata.

FINAL VERIFICATION:
Before answering, internally verify:
event preservation, subject/object, negation scope, question scope,
WHETHER scope, IF/THEN scope, speaker, tense, temporal relations,
absence of invented or omitted information, and whether every audio tag
is justified and belongs to the allowed list.

Output ONLY the final natural West Bengal Bengali text with any justified
ElevenLabs audio tags."""

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