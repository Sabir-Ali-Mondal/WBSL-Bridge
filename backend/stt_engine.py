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