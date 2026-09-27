# WBSL Bridge — Quick Start Guide

To run the frontend:

```powershell
# 1. Navigate to the frontend folder
cd "d:\Download\Projects\WBSL Bridge\frontend"

# 2. Run the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

For complete route guides, production builds, and commands, refer to [`frontend/HOW_TO_RUN.md`](frontend/HOW_TO_RUN.md).



**Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
**Backend:** FastAPI (Python 3.11) + ONNX Runtime + MediaPipe 0.10.14
**Sign Recognition:** MLP (126-dim two-hand landmarks, 99.9% val accuracy)
**Bengali NLG:** OpenAI-compatible API (any provider via `.env` config)
**Bengali TTS:** edge-tts (online primary) → BanglaTTS (offline fallback)
**State & Data:** Zustand (UI state) + TanStack Query (server data) + Axios