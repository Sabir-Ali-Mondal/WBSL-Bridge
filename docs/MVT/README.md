# WBSL Bridge: Minimum Viable Tests (MVT)

## Phase 1: Vision & Intent (The Eyes)
*   **1.1 MediaPipe Stream:** Open webcam, draw 540 landmarks (hand/face/pose), verify 30 FPS. [Done]
*   **1.2 DeepFace Snapshot:** Capture static frame, run DeepFace.analyze(), verify emotion dict output. [Done - Replaced]
*   **1.3 ViT-ONNX Emotion:** Export HuggingFace ViT model to ONNX, run live inference via onnxruntime. Replaces DeepFace due to glasses failure and TensorFlow/MediaPipe dependency conflict. [Done]
*   **1.4 Geometry NMM:** 5 markers (eyebrow raise, eyebrow furrow, head shake, head nod, mouth open) via landmark geometry. Thresholds need community calibration. [Done]

## Phase 2: Static & Temporal Modeling (The Memory)
*   **2.1 Static ISL Recognition:** Convert ISL image dataset to two-hand 126-dim landmarks, train MLP (99.9% val acc), export sign_mlp.onnx, live webcam inference with majority vote. [Done]
*   **2.2 Robustness Retraining:** Landmark-space augmentation (mirror, rotate, jitter, hand-dropout) to fix mirror/angle/distance/occlusion confusions. [Pending]
*   **2.3 Continuous Recorder:** Record two-hands + upper-body + NMM sequences plus original video to .npy on keypress. Script written (phase2b_recorder.py). Terminal input issue identified; web UI replacement planned. [In Progress - Paused]
*   **2.4 Web-Based Data Collector:** FastAPI backend + HTML/CSS/JS frontend with label input, animated Start/Stop/Save buttons, live MJPEG video feed, real-time status display. Replaces terminal-based recorder. [Planned]
*   **2.5 Tiny LSTM:** Train PyTorch LSTM on recorded sequences; export to model.onnx. [Pending]
*   **2.6 ONNX Inference:** Load model.onnx via onnxruntime; verify prediction < 5ms on CPU. [Pending]

## Phase 3: LLM Integration (The Brain) [Done]
*   **3.1 Model Benchmarking:** Tested 6 local GGUF models for Bengali NLG quality. gemma-4-12b-it-Q4_0 selected as reference (best quality, ~13 GB RAM). gemma-4-E4B-it-Q4_K_M selected for deployment (good quality, lower RAM, faster CPU inference). gpt-oss-20b, Qwen3.6-35B, Qwen3.5-9B failed on Bengali quality. gemma-4-26B exceeded memory. [Done]
*   **3.2 NLG Prompt Engineering:** Finalized constrained prompt covering question scope, negation scope, WHETHER embedding, IF/THEN preservation, event segmentation, speaker binding, temporal consistency, emotion markers, honorifics, and anti-hallucination rules. [Done]
*   **3.3 Small Test:** Input `YOU + TOMORROW + SCHOOL + GO[negation][?]` produces correct Bengali `তুমি কি আগামীকাল স্কুলে যাবে না?`. Validates question + negation + subject preservation. [Done]
*   **3.4 Long Semantic Stress Test:** 450-token generation across 50 criteria (events, tense, time, numbers, percentages, direct questions, embedded WHETHER, local negation, CAN/CANNOT/MAY/MUST/SHOULD, IF/THEN/OTHERWISE, BEFORE/AFTER/UNTIL, reported speech, multiple speakers, 7 emotion types, Bengali punctuation, no hallucination). Result: good Bengali fluency, moderate semantic scope accuracy. [Done]
*   **3.5 Speed Benchmark:** Deployment model (gemma-4-E4B): prompt processing ~37.84 tok/s, generation ~5.76 tok/s, total ~132 sec for long test. [Done]
*   **3.6 Identified Weakness:** Semantic scope tracking (negation scope, speaker binding, WHETHER scope, IF/THEN scope, event segmentation, tense consistency) is the primary remaining weakness. Bengali fluency and speed are acceptable. Future improvement priority: scope accuracy, not fluency. [Documented]

## Phase 4: Reverse Path (The Voice) [In Progress]
*   **4.1 FastAPI Backend:** Create /generate-sign endpoint; input text, output gloss JSON. [Pending]
*   **4.2 React UI:** Simple input box + button; display returned gloss sequence on screen. [Pending]
*   **4.3 Bengali TTS (Dual Engine):** Windows SAPI and sherpa-onnx confirmed unusable (no Bengali voice/model). edge-tts selected as PRIMARY (online, bn-BD-NabanitaNeural, ~2.5 sec generation, handles punctuation correctly). BanglaTTS selected as OFFLINE FALLBACK (silero model, ~2.4 sec generation after cache, ignores punctuation; mitigated by text cleaning). Automatic fallback chain coded in tts_engine.py. Timing constants measured: edge-tts ~604 ms/word, BanglaTTS ~453 ms/word. [Done]

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
| Web UI for data collection | Terminal input conflicts with OpenCV window focus. FastAPI + HTML provides proper label input, buttons, and live video without Python GUI hacks |
| gemma-4-E4B for deployment | Best balance of Bengali quality, semantic understanding, RAM usage, and CPU inference speed among 6 tested models |
| gemma-4-12b as reference | Highest quality benchmark for evaluating future model or prompt improvements |
| Constrained NLG prompt | Explicit rules for question/negation/WHETHER/IF-THEN scope prevent the most common semantic errors in gloss-to-Bengali conversion |
| TTS dual engine (edge-tts + BanglaTTS) | Windows has no Bengali SAPI voice. edge-tts gives best quality online; BanglaTTS guarantees audio output offline. Punctuation limitation of BanglaTTS mitigated by text cleaning |
| Python 3.11 enforced | Python 3.14 unsupported by MediaPipe/TensorFlow; dummy package risk on PyPI |
| mediapipe==0.10.14 pinned | Unpinned pip install resolves to unrelated 1.0.1 package |

## Environment Map

| Venv | Status | Contents |
|:---|:---|:---|
| .venv | Active - Primary | mediapipe 0.10.14, torch, onnxruntime, onnxscript, transformers, opencv |
| .venv-deepface | Retired | tensorflow 2.13, deepface (superseded by ViT-ONNX) |
| .venv-tts | Active - TTS | edge-tts, BanglaTTS, mutagen |

## Noted for the future:
word/clause-level fusion of gloss, NMM, and affect streams is technically real but not cheap — it needs three separate models running in parallel (hand/gloss recognizer, facial-landmark/NMM classifier, affect classifier), each with its own training data and timestamps, plus a fusion layer to align their outputs and resolve conflicts when windows don't overlap cleanly. Building and maintaining that pipeline (data collection, model training, alignment tuning, confidence calibration) is a high-budget, multi-team effort — realistic for a well-funded research lab or product team, not a lightweight or solo project. For now, skipping this and treating NMM/emotion as simplified, manually-specified inputs to the NLG layer is the reasonable choice; the fusion architecture is worth revisiting only if/when there's budget for real multi-model video pipelines.

---
## Session Log: 1 September 2026 (TTS Session)
Session Log: 29 August 2026      -> Phase 2.1 static ISL pipeline
Session Log: 1 September 2026    -> Phase 4.3 TTS dual engine

### Completed This Session
- Phase 2.1 full pipeline: image-to-landmark conversion (two-hand, 126-dim), MLP training (99.9% val), ONNX export, live webcam inference with majority vote smoothing
- Identified and fixed one-hand detection failures on two-hand letters (Q: 137->full, P: 254->full)
- Documented residual confusions: mirror effect, hand position, far/close distance, angle
- Designed landmark-space augmentation plan (mirror, rotate, jitter, dropout)
- Built continuous recorder script (phase2b_recorder.py) with 146 features per frame (hands 126 + pose 18 + NMM 2)
- Identified terminal input vs OpenCV window focus conflict
- Decided on web UI (FastAPI + HTML) replacement for data collector

### Files Created This Session
| File | Purpose |
|:---|:---|
| phase2a_convert.py | Images to two-hand landmarks |
| phase2a_train_landmarks.py | MLP training + ONNX export |
| phase2a_live_infer.py | Live webcam ISL recognition |
| phase2a_all_in_one.py | Combined convert/train/live with menu |
| phase2b_recorder.py | Continuous sequence recorder (paused, web UI replacing) |
| sign_mlp.onnx | Trained static sign classifier |
| sign_classes.json | 35 class labels |
| dataset_landmarks/*.npy | 35 files, ~300 samples each, 126-dim |

---

## Session Log: TTS Session

### Completed This Session
- Confirmed Windows SAPI has no Bengali voice (only English David and Zira)
- Tested 4 engines in one script: edge-tts (OK), BanglaTTS (OK), SAPI (FAIL), sherpa-onnx (FAIL, no Bengali model)
- Selected edge-tts as primary TTS (best quality, handles punctuation, ~2.5 sec generation)
- Selected BanglaTTS as offline fallback (works without internet, ~2.4 sec generation after model cache)
- Discovered BanglaTTS ignores punctuation (comma, full stop, danda); mitigated with text cleaning in fallback path
- Measured timing constants on same example text for both engines
- Built automatic fallback chain (tts_engine.py): edge-tts first, BanglaTTS if no internet

### Files Created This Session
| File | Purpose |
|:---|:---|
| test_tts.py | edge-tts generation + timing metrics |
| test_banglatts.py | BanglaTTS offline generation + timing metrics |
| test_all_tts.py | 4-engine comparison test |
| tts_engine.py | Automatic fallback chain (edge-tts -> BanglaTTS) |
| bengali.mp3 / tts_edge.mp3 | edge-tts output samples |
| bengali_offline.wav / tts_banglatts.wav | BanglaTTS output samples |

### Resume Point
When resuming, start with **2.4 Web-Based Data Collector** (FastAPI + HTML). The backend reuses the exact extract_frame() logic from phase2b_recorder.py. After collecting 2-3 signs (~10 reps each), proceed to 2.5 LSTM training. TTS module (tts_engine.py) is ready to plug into the final pipeline after LLM Bengali output.

## Next Steps (Priority Order)

| Priority | Task | Status |
|:---|:---|:---|
| 1 | 2.4 Web-Based Data Collector (FastAPI + HTML) | Planned - start here |
| 2 | Collect 2-3 signs, ~10 reps each via web UI | Pending |
| 3 | 2.5 Tiny LSTM train + ONNX export | Pending |
| 4 | 2.6 Live LSTM ONNX inference | Pending |
| 5 | Integration: gloss + NMM + emotion packet -> LLM -> Bengali -> TTS playback | Pending |
| 6 | 4.1 FastAPI reverse endpoint + 4.2 React UI | Pending |
| 7 | 2.2 Augmentation retrain (10 min polish) | Pending - do last |
| 8 | 3.x Scope accuracy improvement | Documented - future work |
