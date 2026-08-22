# WBSL Bridge: Minimum Viable Tests (MVT)

## Phase 1: Vision & Intent (The Eyes)
*   **1.1 MediaPipe Stream:** Open webcam, draw 540 landmarks (hand/face/pose), verify 30 FPS. [ Done testing ]
*   **1.2 DeepFace Snapshot:** Capture static frame, run `DeepFace.analyze()`, verify emotion dict output.
*   **1.3 Geometry NMM:** Calculate eyebrow-eye distance and lip distance from landmarks; verify values change with facial expressions.

## Phase 2: Temporal Modeling (The Memory)
*   **2.1 Data Recorder:** Save hand landmark sequences (x,y,z) to `.npy` files on keypress.
*   **2.2 Tiny LSTM:** Train simple PyTorch LSTM on dummy data; export to `model.onnx`.
*   **2.3 ONNX Inference:** Load `model.onnx` via `onnxruntime`; verify prediction < 5ms on CPU.

## Phase 3: LLM Integration (The Brain) [ Done testing ]
*   **3.1 Cloud API:** Send hardcoded gloss to OpenRouter; verify Bengali text response.
*   **3.2 Local LLM:** Run KoboldCpp locally; send same gloss via API; verify offline Bengali response.
*   **3.3 Latency Check:** Compare tokens/sec between Cloud and Local modes.

## Phase 4: Reverse Path (The Voice) [ I am confident no need test ]
*   **4.1 FastAPI Backend:** Create `/generate-sign` endpoint; input text, output gloss JSON.
*   **4.2 React UI:** Simple input box + button; display returned gloss sequence on screen.
*   **4.3 TTS Test:** Convert Bengali string to audio ; verify playback.
