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
