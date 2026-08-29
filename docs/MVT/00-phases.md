# WBSL Bridge: Minimum Viable Tests (MVT)

## Phase 1: Vision & Intent (The Eyes)
*   **1.1 MediaPipe Stream:** Open webcam, draw 540 landmarks (hand/face/pose), verify 30 FPS. [Done]
*   **1.2 DeepFace Snapshot:** Capture static frame, run DeepFace.analyze(), verify emotion dict output. [Done - Replaced]
*   **1.2b ViT-ONNX Emotion:** Export HuggingFace ViT model to ONNX, run live inference via onnxruntime. Replaces DeepFace due to glasses failure and TensorFlow/MediaPipe dependency conflict. [Done]
*   **1.3 Geometry NMM:** 5 markers (eyebrow raise, eyebrow furrow, head shake, head nod, mouth open) via landmark geometry. Thresholds need community calibration. [Done]

## Phase 2: Static & Temporal Modeling (The Memory)
*   **2A Static ISL Recognition:** Convert ISL image dataset to two-hand 126-dim landmarks, train MLP (99.9% val acc), export sign_mlp.onnx, live webcam inference with majority vote. [Done]
*   **2A+ Robustness Retraining:** Landmark-space augmentation (mirror, rotate, jitter, hand-dropout) to fix mirror/angle/distance/occlusion confusions. [Pending]
*   **2B.1 Continuous Recorder:** Record two-hands + upper-body + NMM sequences plus original video to .npy on keypress. [Pending]
*   **2B.2 Tiny LSTM:** Train PyTorch LSTM on recorded sequences; export to model.onnx. [Pending]
*   **2B.3 ONNX Inference:** Load model.onnx via onnxruntime; verify prediction < 5ms on CPU. [Pending]

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
| Emotion detection is supplementary | Broad emotions have limited grammatical value. Core grammar relies on geometric NMMs |
| Train on landmarks, not raw images | Signer independence: removes skin color, background, lighting, scale. Matches production pipeline representation |
| Two-hand extraction, right-wrist reference | Supports two-hand letters (Q, P, B, O). Preserves inter-hand geometry. Fixes one-hand detection failures |
| Window-based intent packets | Avoids expensive multi-model fusion. Time-aligns gloss + NMM + emotion for the LLM |
| Python 3.11 enforced | Python 3.14 unsupported by MediaPipe/TensorFlow; dummy package risk on PyPI |
| mediapipe==0.10.14 pinned | Unpinned pip install resolves to unrelated 1.0.1 package |

## Environment Map

| Venv | Status | Contents |
|:---|:---|:---|
| .venv | Active - Primary | mediapipe 0.10.14, torch, onnxruntime, onnxscript, transformers, opencv |
| .venv-deepface | Retired | tensorflow 2.13, deepface (superseded by ViT-ONNX) |

## Noted for the future:
word/clause-level fusion of gloss, NMM, and affect streams is technically real but not cheap — it needs three separate models running in parallel (hand/gloss recognizer, facial-landmark/NMM classifier, affect classifier), each with its own training data and timestamps, plus a fusion layer to align their outputs and resolve conflicts when windows don't overlap cleanly. Building and maintaining that pipeline (data collection, model training, alignment tuning, confidence calibration) is a high-budget, multi-team effort — realistic for a well-funded research lab or product team, not a lightweight or solo project. For now, skipping this and treating NMM/emotion as simplified, manually-specified inputs to the NLG layer is the reasonable choice; the fusion architecture is worth revisiting only if/when there's budget for real multi-model video pipelines.


## Next Steps

| Priority | Task | Reason |
|:---|:---|:---|
| **NOW** | 2B.1 Continuous Recorder | The temporal pipeline is the core of WBSL Bridge and the last unproven piece |
| Next | 2B.2 Tiny LSTM + 2B.3 ONNX | Proves sequence-to-gloss recognition |
| Then | Integration test | gloss + NMM + emotion packet -> LLM -> Bengali (the real demo) |
| Anytime | 2A+ augmentation retrain | Only 10 minutes. Polish for an already-working model. Do it last |
