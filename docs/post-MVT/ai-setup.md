# Gemma 4 E4B + KoboldCpp Complete Guide

## 1. System

* CPU: AMD Ryzen 7 7730U — 8 Cores / 16 Threads
* RAM: 16 GB
* Backend: CPU
* Runner: KoboldCpp v1.121
* Main Model: `gemma-4-E4B-it-Q4_K_M.gguf`
* Vision Projector: `mmproj-F16.gguf`
* API: OpenAI Compatible
* Context: Start with the default/recommended value and benchmark before increasing it
* MTP: Optional, tested separately

---

# 2. Folder Structure

Recommended folder:

```text
D:\Download\Projects\gemma 4 e4b\
│
├── koboldcpp.exe
├── download_gemma.bat
├── run_gemma.bat
│
└── llm\
    ├── gemma-4-E4B-it-Q4_K_M.gguf
    └── mmproj-F16.gguf
```

The BAT files can also be kept inside the project root while the models remain inside `llm`.

---

# 3. Download

Create:

```text
download_gemma.bat
```

Use:

```bat
@echo off
setlocal EnableExtensions
cd /d "%~dp0"

if not exist "llm" mkdir "llm"

REM ============================================================
REM Gemma 4 E4B + KoboldCpp Download
REM ============================================================

set "KOBOLD_URL=https://github.com/LostRuins/koboldcpp/releases/download/v1.121/koboldcpp.exe"

set "MODEL_URL=https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/gemma-4-E4B-it-Q4_K_M.gguf?download=true"

set "MMPROJ_URL=https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/mmproj-F16.gguf"

call :get "koboldcpp.exe" "%KOBOLD_URL%" "~80 MB"
call :get "gemma-4-E4B-it-Q4_K_M.gguf" "%MODEL_URL%" "~4.98 GB"
call :get "mmproj-F16.gguf" "%MMPROJ_URL%" "~990 MB"

echo.
echo ============================================================
echo Download complete
echo ============================================================
echo.

dir /b llm

echo.
pause
exit /b 0

REM ============================================================
REM Download helper
REM ============================================================

:get
if exist "llm\%~1" (
    echo [SKIP] %~1 already exists (%~3)
    exit /b 0
)

echo [DOWNLOAD] %~1 (%~3) ...

curl.exe -L -C - --fail --retry 3 --retry-delay 5 --progress-bar ^
    -o "llm\%~1" "%~2"

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to download %~1
    echo Delete the partial file and run this BAT again.
    echo.
    exit /b 1
)

echo [OK] %~1
echo.
exit /b 0
```

Run:

```text
download_gemma.bat
```

The script supports:

* Resume
* Retry
* Existing-file detection
* Automatic `llm` folder creation

---

# 4. Final Files

After downloading:

```text
llm/
├── koboldcpp.exe
├── gemma-4-E4B-it-Q4_K_M.gguf
└── mmproj-F16.gguf
```

Approximate storage:

```text
KoboldCpp       ~80 MB
Gemma Q4_K_M    ~4.98 GB
mmproj-F16      ~990 MB
--------------------------------
Total           ~6.05 GB
```

---

# 5. What Each File Does

## Main Model

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

This is the main Gemma model.

Used for:

* Text generation
* Bengali generation
* Instruction following
* Reasoning
* WBSL gloss → Bengali conversion
* General local LLM tasks

---

## Vision Projector

```text
mmproj-F16.gguf
```

This enables image input together with the Gemma model.

Used for:

* Image understanding
* Hand-position analysis
* Finger configuration analysis
* Facial-expression analysis
* Mouth-position analysis
* Head-orientation analysis
* Visual verification

It does **not** replace MediaPipe or the LSTM.

---

# 6. Automatic Server Launch

Create:

```text
run_gemma.bat
```

Use:

```bat
@echo off
setlocal EnableExtensions
cd /d "%~dp0"

REM ============================================================
REM Gemma 4 E4B + KoboldCpp Server
REM ============================================================

set "KOBOLD=llm\koboldcpp.exe"
set "MODEL=llm\gemma-4-E4B-it-Q4_K_M.gguf"
set "MMPROJ=llm\mmproj-F16.gguf"

if not exist "%KOBOLD%" (
    echo [ERROR] KoboldCpp not found.
    echo Run download_gemma.bat first.
    pause
    exit /b 1
)

if not exist "%MODEL%" (
    echo [ERROR] Gemma model not found.
    echo Run download_gemma.bat first.
    pause
    exit /b 1
)

if not exist "%MMPROJ%" (
    echo [ERROR] Vision projector not found.
    echo Run download_gemma.bat first.
    pause
    exit /b 1
)

echo ============================================================
echo Starting Gemma 4 E4B
echo ============================================================
echo.

"%KOBOLD%" ^
--model "%MODEL%" ^
--mmproj "%MMPROJ%" ^
--jinja ^
--jinjathink false ^
--threads 8 ^
--launch

pause
```

Now you only need to double-click:

```text
run_gemma.bat
```

It will automatically load:

```text
KoboldCpp
    ↓
Gemma Q4_K_M
    +
mmproj-F16
    ↓
Server
    ↓
Web UI + OpenAI API
```

---

# 7. GUI Setup

If launching KoboldCpp manually:

1. Open `koboldcpp.exe`
2. Load:

```text
gemma-4-E4B-it-Q4_K_M.gguf
```

3. Load:

```text
mmproj-F16.gguf
```

4. Enable Jinja/chat template support
5. Keep thinking disabled initially
6. Set CPU threads to 8 initially
7. Launch

Then benchmark 6, 8, 12 and 16 threads.

---

# 8. CLI — Text Only

For testing text generation without the vision projector:

```powershell
& "D:\Download\Projects\gemma 4 e4b\koboldcpp.exe" `
--model "D:\Download\Projects\gemma 4 e4b\llm\gemma-4-E4B-it-Q4_K_M.gguf" `
--cli `
--debugmode 1 `
--jinja `
--jinjathink false
```

---

# 9. CLI — Vision

For image analysis:

```powershell
& "D:\Download\Projects\gemma 4 e4b\koboldcpp.exe" `
--model "D:\Download\Projects\gemma 4 e4b\llm\gemma-4-E4B-it-Q4_K_M.gguf" `
--mmproj "D:\Download\Projects\gemma 4 e4b\llm\mmproj-F16.gguf" `
--cli `
--debugmode 1 `
--jinja `
--jinjathink false
```

---

# 10. Server

Recommended starting configuration:

```powershell
& "D:\Download\Projects\gemma 4 e4b\koboldcpp.exe" `
--model "D:\Download\Projects\gemma 4 e4b\llm\gemma-4-E4B-it-Q4_K_M.gguf" `
--mmproj "D:\Download\Projects\gemma 4 e4b\llm\mmproj-F16.gguf" `
--jinja `
--jinjathink false `
--threads 8
```

API:

```text
http://localhost:5001/v1
```

If using the `run_gemma.bat` above, KoboldCpp is launched automatically.

---

# 11. Install OpenAI Python SDK

```bash
pip install openai
```

---

# 12. Python — Text

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:5001/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="gemma-4-E4B",
    messages=[
        {
            "role": "user",
            "content": "Hello!"
        }
    ]
)

print(response.choices[0].message.content)
```

---

# 13. Python — Image

```python
from openai import OpenAI
import base64

client = OpenAI(
    base_url="http://localhost:5001/v1",
    api_key="dummy"
)

with open(r"D:\Download\1735754824506.jpg", "rb") as f:
    image = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gemma-4-E4B",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe this image."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image}"
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

---

# 14. WBSL Vision Test

For WBSL, test with a structured prompt:

```text
Analyze the person's signing posture.

Return only JSON:

{
  "left_hand": "",
  "right_hand": "",
  "finger_configuration": "",
  "hand_position": "",
  "mouth": "",
  "eyebrows": "",
  "head_orientation": "",
  "facial_expression": "",
  "confidence": 0.0
}
```

This allows Gemma Vision to act as a secondary visual analyzer.

---

# 15. WBSL Architecture

Gemma Vision should NOT process every camera frame.

Recommended architecture:

```text
                    Webcam
                      │
                 30 FPS stream
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
      MediaPipe Holistic   Selected Frames
             │                 │
             ▼                 ▼
       540 Landmarks       Gemma Vision
             │                 │
             ▼                 ▼
         LSTM ONNX       Visual Analysis
             │                 │
             └────────┬────────┘
                      ▼
                 NMM / Intent
                      │
                      ▼
              Gloss + Intent
                      │
                      ▼
               Gemma Text LLM
                      │
                      ▼
                Bengali Text
                      │
                      ▼
                  Piper TTS
```

MediaPipe + LSTM handles continuous recognition.

Gemma Vision is used only for selected/high-value visual analysis.

---

# 16. Vision Use Cases

Gemma Vision can be tested for:

```text
Hand position
Finger configuration
Hand orientation
Hand-to-face relationship
Mouth position
Eyebrow position
Head orientation
Facial expression
Visual context
Semantic verification
```

Example:

```text
MediaPipe:
Right hand detected near face

LSTM:
Predicted gloss = "QUESTION"

NMM:
Eyebrow raised

Gemma Vision:
Visual analysis supports interrogative facial configuration

Final:
QUESTION intent
```

---

# 17. CPU Thread Benchmark

Test:

```text
--threads 6
--threads 8
--threads 12
--threads 16
```

Record:

```text
Threads:
Prompt processing:
Generation:
Tokens/sec:
Total time:
RAM:
```

Example:

```text
Threads: 8
Generated: 6.20 T/s
```

Higher T/s generally means faster generation.

Do not assume 16 threads will always be faster. Test on the Ryzen 7 7730U.

---

# 18. Vision Benchmark

Use the same image for every test.

Record:

```text
Image:
Prompt:
Image processing time:
Generation time:
Total time:
Tokens/sec:
RAM usage:
```

Test:

```text
1. Simple image description
2. Hand analysis
3. Face/expression analysis
4. Structured JSON analysis
```

For WBSL, total image-analysis latency is more important than text-only T/s.

---

# 19. Useful Flags

| Flag                 | Purpose                     |
| -------------------- | --------------------------- |
| `--model`            | Load main GGUF model        |
| `--mmproj`           | Load vision projector       |
| `--cli`              | Terminal chat               |
| `--launch`           | Launch Web UI/API           |
| `--threads 8`        | CPU thread count            |
| `--debugmode 1`      | Debug information           |
| `--jinja`            | Enable chat template        |
| `--jinjathink false` | Disable thinking            |
| `--image-min-tokens` | Minimum image-token setting |
| `--image-max-tokens` | Maximum image-token setting |

---

# 20. API

Base URL:

```text
http://localhost:5001/v1
```

Example:

```text
POST /v1/chat/completions
```

The API can be used by:

* OpenAI Python SDK
* LangChain
* LlamaIndex
* CrewAI
* AutoGen
* WBSL Bridge FastAPI backend
* Agent Sam

---

# 21. MTP

The repository also contains:

```text
mtp-gemma-4-E4B-it.gguf
```

Size:

```text
~98.7 MB
```

MTP means Multi-Token Prediction.

It is an optional performance component intended to improve generation speed through multi-token/speculative prediction.

It is NOT:

* A vision projector
* A replacement for Gemma
* Required for image analysis
* Required for normal Gemma inference
* Required for MediaPipe
* Required for LSTM
* Required for NMM

Current setup:

```text
Gemma Q4_K_M
        +
mmproj-F16
        ↓
Text + Vision
```

MTP will be tested separately:

```text
Gemma Q4_K_M
        +
MTP
        ↓
Potentially faster text generation
```

Do not add MTP to the main setup until the normal Gemma + vision configuration is working correctly.

---

# 22. MTP Testing

When testing MTP separately, compare:

```text
Without MTP
-------------
Tokens/sec:
Latency:
RAM:

With MTP
-------------
Tokens/sec:
Latency:
RAM:
```

Keep whichever configuration works correctly and provides useful performance on the Ryzen 7 7730U.

---

# 23. Recommended Configuration

## Normal WBSL Text

```text
Model:
gemma-4-E4B-it-Q4_K_M.gguf

Jinja:
ON

Thinking:
OFF

Threads:
8 initially
```

## WBSL Image Analysis

```text
Model:
gemma-4-E4B-it-Q4_K_M.gguf

Projector:
mmproj-F16.gguf

Jinja:
ON

Thinking:
OFF initially

Threads:
8 initially
```

## Primary Sign Recognition

```text
Webcam
  ↓
MediaPipe Holistic
  ↓
540 landmarks
  ↓
LSTM ONNX
  ↓
NMM
```

## Optional Visual Verification

```text
Selected frame
  ↓
Gemma Vision
  ↓
Visual observations
  ↓
Compare with LSTM + NMM
```

---

# 24. Final Recommended Files

```text
gemma 4 e4b/
│
├── download_gemma.bat
├── run_gemma.bat
├── koboldcpp.exe
│
└── llm/
    ├── gemma-4-E4B-it-Q4_K_M.gguf
    └── mmproj-F16.gguf
```

Optional later:

```text
llm/
├── gemma-4-E4B-it-Q4_K_M.gguf
├── mmproj-F16.gguf
└── mtp-gemma-4-E4B-it.gguf
```

The recommended first working configuration is:

```text
KoboldCpp v1.121
        +
Gemma 4 E4B IT Q4_K_M
        +
mmproj-F16
        +
8 CPU threads
        +
Jinja
        +
Thinking OFF
        ↓
OpenAI-compatible API
        ↓
http://localhost:5001/v1
```
