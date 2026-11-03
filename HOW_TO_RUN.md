# WBSL Bridge — How to Run

## 1. One-Time Setup

Install Python 3.11 and Node.js, then create the single project Python
environment from the repository root:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The backend, speech recognition, and Bengali speech packages all use this
environment. The environment is stored in the ignored root `.venv\` directory;
the launcher no longer depends on anything inside `tests\`.

To train models, install the additional training dependencies into the same
environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-training.txt
```

Training corpora and extracted training sequences under
`model_training_zone\dataset\` and `model_training_zone\dataset_train\` are
local-only and ignored by Git.

## 2. Configure AI

Create a root-level `.env` from `.env.example`. Set `AI_MODE` to `offline` or
`online` and configure the matching provider settings:

```env
AI_MODE=offline

AI_ONLINE_BASE_URL=https://openrouter.ai/api/v1
AI_ONLINE_API_KEY=
AI_ONLINE_MODEL_NAME=google/gemma-4-26b-a4b-it:free

AI_OFFLINE_BASE_URL=http://localhost:5001/v1
AI_OFFLINE_API_KEY=KoboldCppApi
AI_OFFLINE_MODEL_NAME=NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf

AI_STREAM=true
AI_REASONING=true
AI_REASONING_EFFORT=low
AI_TIMEOUT=180
```

For online mode, set `AI_MODE=online` and provide an OpenRouter API key. The
offline mode starts KoboldCpp with the configured local model; online mode does
not start a local AI server.

## 3. Start WBSL Bridge

Open PowerShell:

```powershell
cd "D:\Download\Projects\WBSL Bridge"
.\start.ps1
```

This automatically starts:

```text
FastAPI Backend → http://localhost:8200
Next.js Frontend → http://localhost:3000
OpenAI Compatible API on port 5001 at http://localhost:5001/v1/ (if models/llm/ is present)
```

If the backend is already running on port 8200, the launcher reuses it instead of starting a duplicate. If another process owns that port, the launcher reports the process and stops.

> **Note on AI tab in start.ps1:** Offline mode expects the configured GGUF
> model under `models\llm\`. Online mode uses OpenRouter directly and does not
> require a local AI server.
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.
