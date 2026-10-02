# MVT 4.4: Speech-to-Text (STT) — Bengali + English

## 1. Problem

WBSL Bridge needed local **voice → text** input for the reverse communication path.

Requirements:

* Bengali + English
* Free
* Local/offline
* CPU compatible
* Automatic language detection
* Fast enough for the desktop demo

---

## 2. Solution

Selected **faster-whisper** with CPU INT8.

| Component | Selection                         |
| --------- | --------------------------------- |
| Engine    | faster-whisper                    |
| Model     | `small`                           |
| Device    | CPU                               |
| Precision | INT8                              |
| Language  | Automatic                         |
| VAD       | Enabled                           |
| Internet  | Not required after model download |

Pipeline:

```text
Microphone
→ MediaRecorder
→ FastAPI /api/stt
→ faster-whisper
→ Bengali/English text
→ Existing text input
→ Gloss Planner
```

---

## 3. Setup

```powershell
.\tests\.venv\Scripts\python.exe -m pip install faster-whisper sounddevice numpy
```

---

## 4. Test Code

```python
from faster_whisper import WhisperModel

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    "audio.wav",
    language=None,
    beam_size=5,
    vad_filter=True
)

text = " ".join(
    segment.text.strip()
    for segment in segments
).strip()

print("Language:", info.language)
print("Confidence:", info.language_probability)
print("Text:", text)
```

---

## 5. Problems Faced & Recovery

### Problem 1 — Broken Python/PIP environment

The activated environment was:

```text
tests\.venv
```

but `pip.exe` was pointing to:

```text
WBSL Bridge\.venv
```

which did not exist.

Error:

```text
Fatal error in launcher:
Unable to create process...
```

### Recovery

Instead of using `pip` directly, we used the correct environment's Python:

```powershell
.\tests\.venv\Scripts\python.exe -m pip install faster-whisper sounddevice numpy
```

This bypassed the broken `pip.exe` launcher.

---

### Problem 2 — Bengali and English support

A fixed language such as:

```python
language="bn"
```

would restrict English recognition.

### Recovery

Use automatic detection:

```python
language=None
```

This allows:

```text
Bengali → bn
English → en
```

and gives the model a chance to handle mixed speech.

---

### Problem 3 — CPU limitations

The project does not rely on a GPU.

### Recovery

Use:

```python
WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)
```

This provides a practical CPU configuration for the WBSL Bridge demo.

---

## 6. Current Status

* [x] Local Bengali STT
* [x] Local English STT
* [x] Automatic language detection
* [x] CPU INT8 inference
* [x] VAD enabled
* [x] FastAPI integration design
* [x] Existing VOICE button integration planned
* [x] Broken `.venv`/`pip` issue resolved
* [ ] Final real-time UI integration testing
