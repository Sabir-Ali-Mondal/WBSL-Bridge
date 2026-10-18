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