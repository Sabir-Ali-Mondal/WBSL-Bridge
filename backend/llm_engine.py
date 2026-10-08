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

The input may end with one utterance-level affect tag such as {happy-face}.
This tag applies to the complete ordered gloss before it, not only its last
word. Preserve the emotion in the natural tone of the Bengali output; do not
translate the tag as a literal word or add words that are not in the gloss.

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