# WBSL Bridge
## Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth

For complete route guides, production builds, and commands, refer to [`HOW_TO_RUN.md`](HOW_TO_RUN.md).

The backend uses one repository-root `.venv` environment. Create it with
Python 3.11 and install `requirements.txt` before launching with `start.ps1`.
Training dependencies can be added to that same environment with
`requirements-training.txt`.

## Tech Stack

1. **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS
2. **State & Data:** Zustand (UI state) + TanStack Query (server cache) + Axios · Recharts, Sonner, Lucide icons
3. **Backend:** FastAPI (Python 3.11) + ONNX Runtime + OpenCV
4. **Vision:** MediaPipe 0.10.14 (Hands + FaceMesh) → 126-dim two-hand landmark vectors, right-wrist normalized
5. **Recognition:** MLP (126→256→128→35) exported as `sign_mlp.onnx` · 99.9% val accuracy · 35 ISL classes
6. **Grammar:** 5 geometry-based NMMs (question, WH-question, negation, affirmation, emphasis) fed to NLG as `[negation]` / `[?]` gloss markers
7. **Bengali NLG:** provider-agnostic OpenAI-compatible LLM via `.env` · SSE token streaming · 50-criteria constrained anti-hallucination prompt
8. **Bengali TTS:** edge-tts (online) → BanglaTTS (offline fallback) · selectable Female (Nabanita) / Male (Pradeep) voice
9. **Reverse Path:** Bengali text → active-model gloss map → the selected model's bundled `.npy` landmark sequences → continuous landmark simulation
10. **Community Dataset:** real recording upload → server-side landmark extraction → `backend/data/community_dataset/` → human-in-the-loop verification (DPDP Act 2023 compliant)

Training corpora, extracted working data, and training scripts are grouped under
[`model_training_zone/`](model_training_zone/). Each trained run in
`models/onnx_models/<run_id>/` includes its ONNX model, class list, and replay
sequences under `npy/`, with aligned face-mesh sidecars where available. The
sidecars are used for visualization and do not alter model inputs, so the
training source folders can be removed after the run has been verified.