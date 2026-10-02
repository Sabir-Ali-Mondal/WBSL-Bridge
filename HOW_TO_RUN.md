# WBSL Bridge — How to Run

## 1. One-Time Setup


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

> **Note on AI tab in start.ps1:** The local KoboldCpp AI runner requires the `models/llm/` directory with local weights. If `models/llm/` is absent, the script will skip starting the local runner and you can rely directly on the cloud LLM configuration defined in `backend/.env`.
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.
