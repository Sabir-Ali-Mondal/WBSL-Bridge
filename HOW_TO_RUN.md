# WBSL Bridge — How to Run

## 1. One-Time Setup


## 2. Configure AI

Create `backend/.env`:

```env
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
FastAPI Backend → http://localhost:8000
Next.js Frontend → http://localhost:3000
OpenAI Compatible API on port 5001 at http://localhost:5001/v1/
```
Enabled APIs: KoboldCppApi OpenAiApi OllamaApi AnthropicApi


Open:

```text
http://localhost:3000
```

That's it.
