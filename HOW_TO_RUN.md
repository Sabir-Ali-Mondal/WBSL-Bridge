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

Create `backend/.env`:

```bash
AI_BASE_URL=https://openrouter.ai/api/v1
AI_API_KEY=<YOUR_OPENROUTER_API_KEY>
AI_MODEL_NAME=google/gemma-4-26b-a4b-it:free

AI_STREAM=true
AI_REASONING=false
AI_REASONING_EFFORT=low
AI_TIMEOUT=180
```

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

> **Note on AI tab in start.ps1:** The local KoboldCpp AI runner requires the `models/llm/` directory with local weights. If `models/llm/` is absent, the script will skip starting the local runner and you can rely directly on the cloud LLM configuration defined in `backend/.env`.
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.

## 4. Train a model

Training data and scripts are in `model_training_zone\`. From the repository
root, run the holistic trainer:

```powershell
.\.venv\Scripts\python.exe model_training_zone\train_holistic.py --epochs 60
```


Both trainers store the ONNX graph, class list, and report in
`models\onnx_models\<run_id>\`, with class landmark sequences grouped under
`models\onnx_models\<run_id>\npy\`; aligned face meshes are stored beside
them as `<GLOSS>.face.npy` when detected. Face sidecars are visualization-only
and do not affect ONNX inference. Rescan and activate the new model from **Admin
→ Models Registry**. Sign vocabulary and simulation previews follow the
currently active run.
