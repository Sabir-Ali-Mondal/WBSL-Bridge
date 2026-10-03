"""
backend/tts_engine.py
Dual-engine Bengali TTS from MVT 4.3.
edge-tts (online primary) → BanglaTTS (offline fallback).
Supports male / female voice selection via voice_id.
"""

import asyncio
import re
import unicodedata
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


def _clean_banglatts_text(text: str) -> str:
    clean = "".join(
        char if char.isspace() or unicodedata.category(char)[0] in {"L", "M", "N"} else " "
        for char in text
    )
    return re.sub(r"\s+", " ", clean).strip()


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

        clean = _clean_banglatts_text(text)

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