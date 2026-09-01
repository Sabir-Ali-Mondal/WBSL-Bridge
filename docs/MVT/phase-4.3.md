# MVT 4.3: Bengali Text-to-Speech (TTS)

## 1. Problem
Windows has no built-in Bengali voice. Mobile devices have Bengali TTS natively, but the desktop project needs a working solution for the reverse path (Bengali text to spoken audio).

## 2. Engines Tested (test_all_tts.py)

| Engine | Status | Generation Time | Offline | Quality | Verdict |
|:---|:---|:---|:---|:---|:---|
| edge-tts | OK | 2484 ms | No (internet) | Best, natural | **SELECTED - PRIMARY** |
| BanglaTTS | OK | 50314 ms | Yes (after first download) | Lower | Offline fallback |
| Windows SAPI | FAIL | - | Yes | No Bengali voice (only David, Zira English) | Not usable |
| sherpa-onnx | FAIL | - | Yes | No Bengali ONNX model exists | Not usable |
| IndicF5 (AI4Bharat) | Not tested | Estimated 10-30 sec on CPU | Yes | High, voice cloning | Future premium offline option |

## 3. Final Decision

**edge-tts will be used as the TTS engine for WBSL Bridge.**

Voice: `bn-BD-NabanitaNeural`

Fallback chain built into the system:

```text
Try edge-tts (best quality, fast, needs internet)
    If no internet -> BanglaTTS (offline, slow but works)
        Future upgrade -> IndicF5 (offline, voice cloning, heavy)
```

This gives best quality when internet is available and guaranteed audio output when it is not.

## 4. Why edge-tts Works When Windows Has No Bengali TTS

- edge-tts is NOT pre-installed. It is a third-party open-source pip package installed by us in `.venv-tts`.
- It connects to Microsoft Edge's online neural Read Aloud service, which hosts modern neural voices for 100+ languages including Bengali.
- Windows offline SAPI voices are old English-only voices (confirmed: David, Zira). The Bengali voices live on Microsoft's servers, and edge-tts exposes them for free.
- Internet is required every time. No offline cache.

## 5. Environment

```powershell
py -3.11 -m venv .venv-tts
.\.venv-tts\Scripts\Activate.ps1
pip install edge-tts mutagen BanglaTTS
```

## 6. The Code (`test_tts.py`)

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

## 7. Results

### All-Engine Speed Test (same short sentence)
```text
edge-tts     OK     2484 ms     tts_edge.mp3
BanglaTTS    OK     50314 ms    tts_banglatts.wav
SAPI         FAIL   No Bengali voice
sherpa-onnx  FAIL   No Bengali model
```

### Long Stress Test with edge-tts (1164 words, 5151 characters)
```text
Total audio duration: 446328 ms
Total characters: 5151
Total words: 1164
Ms per word: 383
Ms per character: 87
```

## 8. Timing Constants for Real-Time System

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

## 9. Resource Comparison

| Factor | edge-tts | BanglaTTS | IndicF5 |
|:---|:---|:---|:---|
| RAM usage | ~50 MB | ~500 MB - 1 GB | ~2-4 GB |
| Disk space | ~5 MB | ~200 MB | ~1-2 GB |
| CPU load | Near zero (server does the work) | Medium | Heavy |
| Speed (short text) | ~2.5 sec | ~50 sec | ~10-30 sec |
| Weight class | Lightest | Medium | Heaviest |

## 10. Integration into WBSL Bridge Pipeline

```text
Webcam -> MediaPipe -> LSTM -> Gloss + NMM + Emotion
    -> Intent Packet -> LLM -> Bengali Text
        -> edge-tts (primary) / BanglaTTS (offline fallback)
            -> bengali.mp3 -> Playback
```

The TTS module receives the LLM output string and returns an audio file. The timing constants allow the UI to estimate playback duration before the audio is ready.

## 11. Production Note

edge-tts is an unofficial open-source client for Microsoft's online speech service. It is free and high quality but requires internet and has no license or SLA. This is acceptable for an academic project and demo. For mass production deployment, the documented replacements are Microsoft Azure Neural TTS (official, licensed, low latency) for online use, or IndicF5 (AI4Bharat) for fully offline use. The architecture supports swapping the TTS backend without changing any other component.

## 12. Future Upgrade Path

- IndicF5 (AI4Bharat): fully offline, voice cloning from reference audio, higher quality than BanglaTTS, but heavy (~2-4 GB RAM, 10-30 sec per generation on CPU).
- Azure Neural TTS: official licensed online option for production.
- The fallback chain (edge-tts -> BanglaTTS -> IndicF5) remains the same regardless of which backend is swapped in.

## 13. Success Criteria Checklist
- [x] Bengali text converted to natural spoken audio
- [x] Audio saved as mp3 file
- [x] All 4 engines tested and compared in one script
- [x] edge-tts selected as primary engine
- [x] BanglaTTS confirmed as working offline fallback
- [x] Windows SAPI and sherpa-onnx confirmed unusable for Bengali
- [x] Timing metrics measured (ms per word, ms per character)
- [x] Resource and weight comparison documented
- [x] Works in isolated .venv-tts environment
- [ ] IndicF5 offline test (future)
- [ ] Auto-playback integration with UI (future)
