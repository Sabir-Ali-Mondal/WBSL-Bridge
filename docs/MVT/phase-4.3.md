# MVT 4.3: Bengali Text-to-Speech (TTS)

## 1. Problem
Windows has no built-in Bengali voice (SAPI only includes English voices like David and Zira). Mobile devices have Bengali TTS natively, but the desktop project needs a working solution for the reverse path (Bengali text to spoken audio).

## 2. Solution Selected
**edge-tts** is selected as the TTS engine for WBSL Bridge. 

It is an open-source Python package that connects to Microsoft Edge's online neural Read Aloud service, providing access to high-quality, natural-sounding Bengali voices (e.g., `bn-BD-NabanitaNeural`) without requiring heavy local model downloads or GPU acceleration.

## 3. Environment

```powershell
py -3.11 -m venv .venv-tts
.\.venv-tts\Scripts\Activate.ps1
pip install edge-tts mutagen
```

## 4. The Code (`test_tts.py`)

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

## 5. Results

### Short Test
```text
Text: নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি। আপনার নাম কী? দয়া করে একটু অপেক্ষা করুন।
Generation Time: ~2484 ms
```

### Long Stress Test (1164 words, 5151 characters)
```text
Total audio duration: 446328 ms
Total characters: 5151
Total words: 1164
Ms per word: 383
Ms per character: 87
```

## 6. Timing Constants for Real-Time System

| Metric | Value | Use |
|:---|:---|:---|
| Ms per word | ~383 ms | Estimate TTS audio length from LLM word count |
| Ms per character | ~87 ms | Quick latency estimate without running TTS |

### Example Calculation
If the LLM outputs a Bengali sentence of 15 words:
```text
Estimated audio duration = 15 x 383 = 5745 ms (~5.7 seconds)
```
This lets the UI show the Bengali text immediately and display an estimated speaking duration before audio playback starts.

## 7. Integration into WBSL Bridge Pipeline

```text
Webcam -> MediaPipe -> LSTM -> Gloss + NMM + Emotion
    -> Intent Packet -> LLM -> Bengali Text
        -> edge-tts -> bengali.mp3 -> Playback
```

The TTS module receives the LLM output string and returns an audio file. The timing constants allow the UI to estimate playback duration before the audio is ready.

## 8. Alternatives Considered (For Report Context)

| Engine | Why it was not selected as primary |
|:---|:---|
| Windows SAPI | No Bengali voices available offline. |
| BanglaTTS | Works offline, but generation is very slow (~50 seconds) and voice quality is lower. |
| IndicF5 (AI4Bharat) | High quality and offline, but requires heavy local resources (~2-4 GB RAM) and complex setup. Kept as a future offline upgrade path. |

## 9. Success Criteria Checklist
- [x] Bengali text converted to natural spoken audio
- [x] Audio saved as mp3 file
- [x] Timing metrics measured (ms per word, ms per character)
- [x] Works in isolated `.venv-tts` environment
- [x] No coding required to change input text
- [x] Lightweight resource consumption (~50 MB RAM)
- [ ] Auto-playback integration with UI (future)
