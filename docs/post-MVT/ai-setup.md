# Gemma 4 E4B + KoboldCpp

## System

* CPU: Ryzen 7 7730U — 8C/16T
* RAM: 16 GB
* Backend: CPU
* KoboldCpp: v1.121
* Model: `gemma-4-E4B-it-Q4_K_M.gguf`
* Vision: `mmproj-F16.gguf`
* API: `http://localhost:5001/v1`

## Folder

```text
gemma-4-e4b/
├── download_gemma.bat
├── run_gemma.bat
└── llm/
```

## 1. Download

`download_gemma.bat`

```bat
@echo off
setlocal
cd /d "%~dp0"

if not exist "llm" mkdir "llm"

set "KOBOLD_URL=https://github.com/LostRuins/koboldcpp/releases/download/v1.121/koboldcpp.exe"
set "MODEL_URL=https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/gemma-4-E4B-it-Q4_K_M.gguf?download=true"
set "MMPROJ_URL=https://huggingface.co/unsloth/gemma-4-E4B-it-GGUF/resolve/main/mmproj-F16.gguf"

call :get "koboldcpp.exe" "%KOBOLD_URL%"
call :get "gemma-4-E4B-it-Q4_K_M.gguf" "%MODEL_URL%"
call :get "mmproj-F16.gguf" "%MMPROJ_URL%"

echo.
echo Download complete.
dir /b llm
pause
exit /b

:get
if exist "llm\%~1" (
    echo [SKIP] %~1
    exit /b 0
)

echo [DOWNLOAD] %~1
curl.exe -L -C - --fail --retry 3 --retry-delay 5 --progress-bar ^
-o "llm\%~1" "%~2"

if errorlevel 1 (
    echo [ERROR] %~1
    exit /b 1
)

echo [OK] %~1
exit /b
```

## 2. Automatic Launch

`run_gemma.bat`

```bat
@echo off
setlocal
cd /d "%~dp0"

set "KOBOLD=llm\koboldcpp.exe"
set "MODEL=llm\gemma-4-E4B-it-Q4_K_M.gguf"
set "MMPROJ=llm\mmproj-F16.gguf"

if not exist "%KOBOLD%" (
    echo KoboldCpp not found. Run download_gemma.bat first.
    pause
    exit /b 1
)

if not exist "%MODEL%" (
    echo Gemma model not found. Run download_gemma.bat first.
    pause
    exit /b 1
)

if not exist "%MMPROJ%" (
    echo Vision projector not found. Run download_gemma.bat first.
    pause
    exit /b 1
)

"%KOBOLD%" ^
--model "%MODEL%" ^
--mmproj "%MMPROJ%" ^
--jinja ^
--jinjathink false ^
--threads 8 ^
--launch

pause
```

Now:

```text
1. Run download_gemma.bat
2. Run run_gemma.bat
3. KoboldCpp starts automatically
```

## 3. Python API

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:5001/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="gemma-4-E4B",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content)
```

## 4. Image API

```python
from openai import OpenAI
import base64

client = OpenAI(
    base_url="http://localhost:5001/v1",
    api_key="dummy"
)

with open("test.jpg", "rb") as f:
    image = base64.b64encode(f.read()).decode()

response = client.chat.completions.create(
    model="gemma-4-E4B",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Analyze the hand position, fingers, mouth and facial expression."
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

## 5. Important

```text
Q4_K_M
→ Main Gemma model

mmproj-F16
→ Image/vision capability

MTP
→ Optional speed optimization
→ Test separately later
→ Not required for vision
```

For WBSL:

```text
MediaPipe + LSTM + NMM
        ↓
Primary sign recognition

Gemma Vision
        ↓
Optional high-quality visual analysis
```
