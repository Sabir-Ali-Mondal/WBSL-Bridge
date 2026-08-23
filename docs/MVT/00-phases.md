# WBSL Bridge: Minimum Viable Tests (MVT)

## Phase 1: Vision & Intent (The Eyes)
*   **1.1 MediaPipe Stream:** Open webcam, draw 540 landmarks (hand/face/pose), verify 30 FPS. [Done]
*   **1.2 DeepFace Snapshot:** Capture static frame, run DeepFace.analyze(), verify emotion dict output. [Done - Replaced]
*   **1.2b ViT-ONNX Emotion:** Export HuggingFace ViT model to ONNX, run live inference via onnxruntime. Replaces DeepFace due to glasses failure and TensorFlow/MediaPipe dependency conflict. [Done]
*   **1.3 Geometry NMM:** Calculate eyebrow-eye distance and lip distance from landmarks; verify values change with facial expressions. [Pending]

## Phase 2: Temporal Modeling (The Memory)
*   **2.1 Data Recorder:** Save hand landmark sequences (x,y,z) to .npy files on keypress.
*   **2.2 Tiny LSTM:** Train simple PyTorch LSTM on dummy data; export to model.onnx.
*   **2.3 ONNX Inference:** Load model.onnx via onnxruntime; verify prediction < 5ms on CPU.

## Phase 3: LLM Integration (The Brain) [Done]
*   **3.1 Cloud API:** Send hardcoded gloss to OpenRouter; verify Bengali text response.
*   **3.2 Local LLM:** Run KoboldCpp locally; send same gloss via API; verify offline Bengali response.
*   **3.3 Latency Check:** Compare tokens/sec between Cloud and Local modes.

## Phase 4: Reverse Path (The Voice) [No test needed]
*   **4.1 FastAPI Backend:** Create /generate-sign endpoint; input text, output gloss JSON.
*   **4.2 React UI:** Simple input box + button; display returned gloss sequence on screen.
*   **4.3 TTS Test:** Convert Bengali string to audio; verify playback.

---

## Key Architectural Decisions

| Decision | Reason |
|:---|:---|
| DeepFace replaced by ViT-ONNX | FER2013 model fails with glasses; TensorFlow conflicts with MediaPipe/JAX in same venv |
| Dual venv eliminated | ViT-ONNX runs in main .venv alongside MediaPipe, PyTorch, ONNX Runtime |
| Emotion detection is supplementary | Broad emotions (happy/sad/angry) have limited grammatical value for sign language. Core grammar relies on geometric NMMs (eyebrow raise, head shake) in MVT 1.3 |
| Python 3.11 enforced | Python 3.14 unsupported by MediaPipe/TensorFlow; dummy package risk on PyPI |
| mediapipe==0.10.14 pinned | Unpinned pip install resolves to unrelated 1.0.1 package |

## Environment Map

| Venv | Status | Contents |
|:---|:---|:---|
| .venv | Active - Primary | mediapipe 0.10.14, torch, onnxruntime, transformers, opencv |
| .venv-deepface | Retired | tensorflow 2.13, deepface (superseded by ViT-ONNX) |

## Noted for the future: 
word/clause-level fusion of gloss, NMM, and affect streams is technically real but not cheap — it needs three separate models running in parallel (hand/gloss recognizer, facial-landmark/NMM classifier, affect classifier), each with its own training data and timestamps, plus a fusion layer to align their outputs and resolve conflicts when windows don't overlap cleanly. Building and maintaining that pipeline (data collection, model training, alignment tuning, confidence calibration) is a high-budget, multi-team effort — realistic for a well-funded research lab or product team, not a lightweight or solo project. For now, skipping this and treating NMM/emotion as simplified, manually-specified inputs to the NLG layer is the reasonable choice; the fusion architecture is worth revisiting only if/when there's budget for real multi-model video pipelines.
