import asyncio
import edge_tts
from mutagen.mp3 import MP3

TEXT ="""
নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি।
"""

VOICE = "bn-BD-NabanitaNeural"
# VOICE = "bn-BD-PradeepNeural"

OUTPUT = "bengali.mp3"

async def main():
    communicate = edge_tts.Communicate(TEXT, VOICE)
    await communicate.save(OUTPUT)

    audio = MP3(OUTPUT)
    total_ms = audio.info.length * 1000
    chars = len(TEXT.replace(" ", ""))
    words = len(TEXT.split())

    print(f"Total audio duration: {total_ms:.0f} ms")
    print(f"Total characters: {chars}")
    print(f"Total words: {words}")
    if words > 0:
        print(f"Ms per word: {total_ms / words:.0f}")
    if chars > 0:
        print(f"Ms per character: {total_ms / chars:.0f}")

asyncio.run(main())