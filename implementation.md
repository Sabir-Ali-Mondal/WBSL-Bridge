# Short Implementation — (A) Unlimited NLG Input + (B) Male/Female TTS Voice

---

## CHANGE A — Remove the 10-sign limit (frontend only)

**File:** `frontend/src/app/sign-to-text/page.tsx`

**Find** (inside `doCaptureAndPredict`, the detectedHistory update):

```tsx
        setDetectedHistory((prev) => {
          if (prev[prev.length - 1] === res.data.label) return prev;
          const updated = [...prev, res.data.label];
          return updated.slice(-10);
        });
```

**Replace with** (no cap — full session sequence kept and sent to NLG):

```tsx
        setDetectedHistory((prev) => {
          // Skip consecutive duplicates only. NO length limit —
          // the entire session sequence is kept and fed to the NLG input.
          if (prev[prev.length - 1] === res.data.label) return prev;
          return [...prev, res.data.label];
        });
```

> If your version stores objects (`{ gloss, negation, ... }`) instead of strings, do the same: **delete the `.slice(-10)`** line and keep everything else.

Also, if a `Clear` behavior or the chips row looks cramped with long sequences, the existing `flex-wrap` already handles it — no other change needed.

---

## CHANGE B — Male / Female voice selection

### B1. Replace `backend/tts_engine.py` (full file)

```python
"""
backend/tts_engine.py
Dual-engine Bengali TTS from MVT 4.3.
edge-tts (online primary) → BanglaTTS (offline fallback).
Supports male / female voice selection via voice_id.
"""
import asyncio
import re
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

        clean = re.sub(r'[,.|!?;:"\'()—-।]', ' ', text)
        clean = re.sub(r'\s+', ' ', clean).strip()

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
```

### B2. Edit `backend/main.py` (two small changes)

**Find:**

```python
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    if not text:
        return {"text": "", "audio_url": None, "engine": "none", "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text)
        result["text"] = text
        return result
```

**Replace with:**

```python
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    voice_id = str(payload.get("voice", "1"))
    if not text:
        return {"text": "", "audio_url": None, "engine": "none", "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text, voice_id=voice_id)
        result["text"] = text
        return result
```

**Then add** this endpoint right after `serve_tts_audio`:

```python
@app.get("/api/tts/voices")
def list_tts_voices():
    from backend.tts_engine import VOICES
    return {
        "voices": [
            {"id": k, "label": v[0], "engine_voice": v[1]}
            for k, v in VOICES.items()
        ]
    }
```

### B3. Edit `frontend/src/app/sign-to-text/page.tsx` (three small changes)

**(1) Add state** — next to the other `useState` lines:

```tsx
  const [voiceId, setVoiceId] = useState<"1" | "2">("1");
```

**(2) Add the voice selector UI** — place it directly above the Bengali output block (`{bengaliOutput && (...)}`):

```tsx
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-text-muted">TTS Voice:</span>
            <button
              onClick={() => setVoiceId("1")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "1"
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Female (Nabanita)
            </button>
            <button
              onClick={() => setVoiceId("2")}
              className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                voiceId === "2"
                  ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary font-bold"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              Male (Pradeep)
            </button>
          </div>
```

**(3) Send the voice with every TTS call** — find every line like:

```tsx
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text: bengaliOutput });
```

(and the same call inside `handleStreamAndSpeak` if you use the single-button version) — replace with:

```tsx
      const res = await axios.post(`${API_BASE}/api/tts/generate`, { text: bengaliOutput, voice: voiceId });
```

---

## Verify

```powershell
# 1. Voices list
(Invoke-WebRequest "http://127.0.0.1:8000/api/tts/voices" -UseBasicParsing).Content
# → {"voices":[{"id":"1","label":"Female","engine_voice":"bn-BD-NabanitaNeural"},{"id":"2","label":"Male","engine_voice":"bn-BD-PradeepNeural"}]}

# 2. Male voice generation
$body = @{ text = "আমি জল পান করি"; voice = "2" } | ConvertTo-Json
$r = Invoke-RestMethod "http://127.0.0.1:8000/api/tts/generate" -Method Post -Body $body -ContentType "application/json"
$r.voice; $r.audio_url
# → Male   /api/tts/audio/bengali_speech_v2.mp3

# 3. Unlimited sequence
# On /sign-to-text: show 12+ different signs → all 12+ chips appear and the
# NLG input / generated gloss contains every one of them (no truncation at 10).
```

**Restart the backend** after B1/B2 (`uvicorn backend.main:app --reload --port 8000`). Frontend hot-reloads automatically.

That's it — 2 files touched on backend, 3 small edits + 1 cap removal on frontend.