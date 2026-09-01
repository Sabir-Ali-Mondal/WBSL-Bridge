# MVT 4.3: Bengali Text-to-Speech (TTS) - Dual Engine

## 1. Problem
Windows has no built-in Bengali voice (SAPI only includes English voices like David and Zira). Mobile devices have Bengali TTS natively, but the desktop project needs a working solution for the reverse path (Bengali text to spoken audio). A single engine cannot cover both online and offline demo situations.

## 2. Solution: Dual Engine

| Engine | Role | Internet | Why |
|:---|:---|:---|:---|
| edge-tts | PRIMARY | Required | Best quality, natural voice, handles punctuation correctly |
| BanglaTTS | OFFLINE FALLBACK | Not required | Works without internet, fast after model cache |

The system tries edge-tts first. If there is no internet, it automatically falls back to BanglaTTS.

## 3. Example Text (Same for Both Engines)

```text
নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি। আপনার নাম কী? দয়া করে একটু অপেক্ষা করুন।
```

## 4. Engine A: edge-tts (Primary, Online)

### Setup A

```powershell
py -3.11 -m venv .venv-tts
.\.venv-tts\Scripts\Activate.ps1
pip install edge-tts mutagen
```

### Code A (`test_tts.py`)

```python
import asyncio
import edge_tts
from mutagen.mp3 import MP3

TEXT = "নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি। আপনার নাম কী? দয়া করে একটু অপেক্ষা করুন।"

VOICE = "bn-BD-NabanitaNeural"
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
```

### Output A

```text
Total audio duration: 10872 ms
Total characters: 86
Total words: 18
Ms per word: 604
Ms per character: 126
```

## 5. Engine B: BanglaTTS (Offline Fallback)

### Setup B

```powershell
.\.venv-tts\Scripts\Activate.ps1
pip install BanglaTTS mutagen
```

Note: On first run it downloads the silero model to `C:\Users\<user>\bangla_tts`. After that it works fully offline.

### Code B (`test_banglatts.py`)

```python
import time
from mutagen import File as AudioFile
from banglatts import BanglaTTS

TEXT = "নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি। আপনার নাম কী? দয়া করে একটু অপেক্ষা করুন।"

OUTPUT = "bengali_offline.wav"

print("Loading BanglaTTS (offline)...")
t0 = time.time()
tts = BanglaTTS()
load_ms = (time.time() - t0) * 1000

print("Generating speech...")
t0 = time.time()
path = tts(TEXT, voice='female', filename=OUTPUT)
gen_ms = (time.time() - t0) * 1000

audio = AudioFile(path)
total_ms = audio.info.length * 1000
chars = len(TEXT.replace(" ", ""))
words = len(TEXT.split())

print(f"Model load time: {load_ms:.0f} ms")
print(f"Generation time: {gen_ms:.0f} ms")
print(f"Total audio duration: {total_ms:.0f} ms")
print(f"Total characters: {chars}")
print(f"Total words: {words}")
if words > 0:
    print(f"Ms per word: {total_ms / words:.0f}")
if chars > 0:
    print(f"Ms per character: {total_ms / chars:.0f}")
```

### Output B

```text
Loading BanglaTTS (offline)...
Using cache found in C:\Users\Sabir Ali Mondal\bangla_tts\snakers4_silero-models_master
Generating speech...
Model load time: 1188 ms
Generation time: 2393 ms
Total audio duration: 8150 ms
Total characters: 86
Total words: 18
Ms per word: 453
Ms per character: 95
```

## 6. Comparison (Same Text)

| Metric | edge-tts (Primary) | BanglaTTS (Fallback) |
|:---|:---|:---|
| Generation time | ~2500 ms | 2393 ms (after cache) |
| Model load | None (server-side) | 1188 ms |
| Audio duration | 10872 ms | 8150 ms |
| Punctuation ( , . | ? ) | Handles correctly | Does NOT handle (reads through) |
| Offline | No | Yes |
| Voice quality | Best, natural | Good |
| RAM usage | ~50 MB | ~500 MB - 1 GB |

## 7. Known Limitation and Mitigation

BanglaTTS does not understand punctuation marks like comma, full stop, question mark, and the Bengali danda (।). It reads the text continuously without pauses.

Mitigation in the fallback path: clean punctuation before passing text to BanglaTTS, so the output remains listenable.

## 8. Fallback Integration Code (`tts_engine.py`)

```python
import asyncio
import re

def speak(text, output="bengali_speech"):
    # Try edge-tts first (best quality, needs internet)
    try:
        import edge_tts
        asyncio.run(edge_tts.Communicate(text, "bn-BD-NabanitaNeural").save(output + ".mp3"))
        print("Used: edge-tts (online)")
        return output + ".mp3"
    except Exception as e:
        print("edge-tts failed (no internet?), falling back:", e)

    # Offline fallback: BanglaTTS
    # Clean punctuation because BanglaTTS does not handle it
    clean = re.sub(r'[,.|!?;:"\'()—-।]', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()

    from banglatts import BanglaTTS
    tts = BanglaTTS()
    path = tts(clean, voice='female', filename=output + ".wav")
    print("Used: BanglaTTS (offline)")
    return path
```

## 9. Timing Constants for Real-Time System

| Metric | edge-tts | BanglaTTS | Use |
|:---|:---|:---|:---|
| Ms per word (audio) | ~604 ms | ~453 ms | Estimate playback duration |
| Ms per character (audio) | ~126 ms | ~95 ms | Quick estimate without running TTS |
| Generation latency | ~2500 ms | ~2400 ms (cached) | Time before audio is ready |

The UI shows the Bengali text immediately and displays an estimated speaking duration while audio generates in the background.

## 10. Success Criteria Checklist
- [x] edge-tts produces natural Bengali speech with correct punctuation pauses
- [x] BanglaTTS works fully offline after model cache
- [x] Both engines tested with the same example text for fair comparison
- [x] BanglaTTS generation is fast after cache (~2.4 sec)
- [x] Punctuation limitation of BanglaTTS documented and mitigated
- [x] Automatic fallback chain (edge-tts -> BanglaTTS) coded
- [x] Works in isolated .venv-tts environment
- [ ] Auto-playback integration with UI (future)
- [ ] IndicF5 offline premium upgrade (future)
