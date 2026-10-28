# WBSL Bridge: Minimal Viable Tests (MVT) Summary

> **DISCLAIMER: EXPERIMENTAL MINIMAL VIABLE TESTS (MVT) ONLY**  
> All phases, modules, scripts, and benchmarks documented here represent exploratory Proof-of-Concepts (PoCs) and feasibility testbeds developed during the Minimal Viable Test (MVT) phase of WBSL Bridge. **These are experimental prototypes, not the final production system.** Their purpose is to empirically validate architectural hypotheses, uncover hardware/CPU bottlenecks, test edge-case failure modes, establish cross-module data contracts, and establish baselines before production engineering.

---

## Executive Overview

WBSL Bridge is an assistive communication system bridging West Bengal Sign Language (WBSL) and written/spoken Bengali. The MVT phase decomposed the end-to-end pipeline into six discrete engineering investigations:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MVT ARCHITECTURE MAP                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

 [Input Video/Webcam]
        │
        ▼
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │  Phase 1.1   │ ──► │  Phase 1.2   │ ──► │  Phase 1.3   │
 │  MediaPipe   │     │   ViT-ONNX   │     │ Geometry NMM │
 │  Stream PoC  │     │ Emotion PoC  │     │  Rule Engine │
 └──────────────┘     └──────────────┘     └──────────────┘
        │
        ▼
 ┌────────────────────────────────────────────────────────┐
 │ Phase 2: Sign Modeling (Fingerspelling & Lexicon)      │
 │ - 2A: Two-Hand 126-Dim Landmark MLP (Static 35-Class)  │
 │ - Landmark Augmentation & Invariant Feature Extraction │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Phase 5: The Honesty Layer (Unknown Sign Pipeline)     │
 │ - Quality Gate: Tracking integrity & visibility        │
 │ - OOD Gate: MSP + Mahalanobis + Frame Agreement Ratio  │
 │ - 3D Movement Analyzer: Deterministic geometry to text │
 │ - Hybrid Reasoning: Vector similarity + Reference Table│
 └──────────────────────────┬─────────────────────────────┘
                            │ (Known Gloss / Candidate)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Phase 3: Natural Language Generation (The Brain)       │
 │ - Benchmarked 6 Local GGUF LLMs (CPU Inference)        │
 │ - Selected Gemma-4-E4B (Deployment) & Gemma-4-12B (Ref)│
 │ - Constrained WBSL Gloss-to-Bengali Prompt Architecture│
 └──────────────────────────┬─────────────────────────────┘
                            │ (Bengali Text)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Phase 4: Reverse Communication Path (The Voice)        │
 │ - 4.3 Dual-Engine TTS: edge-tts + BanglaTTS Fallback   │
 │ - 4.4 Local STT: faster-whisper CPU INT8 (bn + en)     │
 └────────────────────────────────────────────────────────┘

 ┌────────────────────────────────────────────────────────┐
 │ Phase 6: Sign-to-Avatar Movement Reproduction (PoC)    │
 │ - Pure Browser Monocular Video to 3D Skeletal Avatar   │
 │ - Next.js + Three.js + MediaPipe Tasks Vision WASM     │
 │ - Forward Kinematics (FK) Solvers & Motion Retargeting │
 └────────────────────────────────────────────────────────┘
```

---

## Phase 1: Vision & Intent (The Eyes)

Phase 1 established real-time perception of the signer from RGB webcam frames, separating manual tracking, facial expressions, and linguistic Non-Manual Markers (NMMs).

### 1.1 MediaPipe Holistic Stream
- **Objective:** Validate real-time extraction of 540 skeletal landmarks (468 face mesh, 33 body pose, 21 per hand) at 30 FPS on CPU.
- **Environment & Setup:** Python 3.11 with strictly pinned `mediapipe==0.10.14` (unpinned installation resolves to an unrelated dummy 1.0.1 package on PyPI, breaking `.solutions`).
- **Outcome:** Validated consistent landmark extraction across hands, face, and upper body with minimal CPU overhead.

### 1.2 ViT-ONNX Emotion Detection (DeepFace Replacement)
- **Problem with DeepFace:** The initial FER2013-based DeepFace pipeline consistently misclassified signers wearing eyeglasses (shadow artifacts caused persistent "fear" classifications) and introduced severe dependency collisions between TensorFlow 2.13 and MediaPipe/JAX.
- **Solution:** Replaced DeepFace with a HuggingFace Vision Transformer (`trpakov/vit-face-expression`) exported to ONNX and executed via `onnxruntime` CPUExecutionProvider.
- **Performance:** Reduced per-frame latency to ~30–50 ms; fully robust to glasses and variable lighting.
- **Architectural Discovery:** Generic emotion classification (angry, happy, sad, etc.) has limited grammatical utility in sign language. Core sign syntax relies on deliberate, rapid facial movements (NMMs). Consequently, broad emotion detection was demoted to a supplementary contextual layer (tone/affect), prioritizing geometric NMMs for grammar.

### 1.3 Geometry-Based Non-Manual Marker (NMM) Engine
- **Objective:** Detect grammatical markers directly from facial landmark geometry in real time without training heavy neural networks.
- **Implementation:** Five deterministic geometric markers running in < 5 ms per frame:
  1. **Eyebrow Raise:** Distance between eyebrow midpoint and eye midpoint normalized by face width (indicates Yes/No questions and conditionals).
  2. **Eyebrow Furrow:** Brow-eye distance below neutral threshold (indicates WH-questions: who, what, where).
  3. **Head Shake:** Variance of nose-tip X coordinates over a 15-frame window (indicates negation/denial).
  4. **Head Nod:** Variance of nose-tip Y coordinates over a 15-frame window (indicates affirmation/agreement).
  5. **Mouth Open:** Upper-to-lower lip vertical distance normalized by face width (indicates emphasis or magnitude).
- **WBSL Sociolinguistic Observations:** WBSL signers exhibit distinct regional characteristics compared to standardized Northern ISL:
  - Strong Bengali mouthing dominance (phonetic lip patterns corresponding to spoken Bangla words, e.g., *Maach*).
  - Single side head-tilt functioning as a question/rhetorical marker.
  - Respectful downward gaze shift during elder/formal address.

---

## Phase 2: Static & Temporal Sign Modeling (The Memory)

Phase 2 evaluated feature representations for sign classification, testing signer independence, coordinate invariance, and model footprints.

### 2.1 Two-Hand Landmark Architecture
- **Raw Pixels vs. Landmarks:** Training classifiers directly on RGB video frames causes severe overfitting to background, skin tone, clothing, and camera distance. Landmarks isolate skeletal geometry, providing signer independence and cross-session robustness.
- **126-Dimensional Feature Vector:**
  - Up to 2 hands tracked via MediaPipe Hands (21 3D landmarks × 3 coordinates × 2 hands = 126 values).
  - Normalized relative to the **right wrist reference** applied to both hands simultaneously (zeroes global translation while strictly preserving inter-hand spatial geometry for two-handed signs).
  - Normalized for scale using reference hand size (wrist to middle MCP distance).
  - Solved one-hand dropout failures on complex two-handed ISL letters (e.g., "Q" detection rose from 137/300 to full capture).

### 2.2 Static Classifier MVT (sign_mlp.onnx)
- **Architecture:** PyTorch MLP (`126 → 256 (ReLU, Dropout 0.3) → 128 (ReLU, Dropout 0.3) → 35 classes`).
- **Validation Results:** Achieved 99.9% validation accuracy across 35 static ISL classes (letters A–Z and digits 1–9).
- **Deployment:** Exported to `sign_mlp.onnx` (opset 18); runs in < 2 ms on CPU with rolling majority-vote temporal smoothing.
- **Role in Final System:** Static MLP handles fingerspelling, personal names, acronyms, and numeric values; dynamic/continuous signs require temporal sequence modeling.

### 2.3 Landmark-Space Augmentation Plan
Identified four primary live-webcam confusions and designed exact landmark-space augmentations:
1. **Mirror Confusion (Selfie vs. Observer):** Swap left/right hand feature blocks and invert X coordinates.
2. **In-Plane Tilt (Head/Camera Angle):** Apply 2D rotation matrices ($\theta \in [-17^\circ, +17^\circ]$) to XY coordinates.
3. **Camera Distance / Depth Jitter:** Add Gaussian noise ($\sigma = 0.01$) to simulate landmark estimation jitter.
4. **Occlusion / Hand Dropout:** Randomly zero out 63-dimensional hand blocks (10% probability) to train graceful degradation during single-hand tracking dropouts.

---

## Phase 3: LLM Integration & Bengali NLG (The Brain)

Phase 3 validated local Large Language Models (LLMs) running on CPU to translate raw WBSL gloss sequences into fluent West Bengal Bengali without semantic loss or hallucinations.

### 3.1 Local GGUF Model Benchmarks (CPU Inference)

Six quantized GGUF models were evaluated on CPU (16 GB RAM environment):

| Model | Size / Quant | Bengali NLG Quality | Status | Key Observation |
|:---|:---|:---|:---|:---|
| `gemma-4-12b-it-Q4_0.gguf` | 12B / Q4_0 | **Exceptional (97% accuracy)** | **Reference Model** | Gold standard semantic fidelity; requires ~13 GB RAM. |
| `gemma-4-E4B-it-Q4_K_M.gguf` | ~4B / Q4_K_M | **Very Good** | **Deployment Model** | Balanced RAM footprint, natural phrasing, fast CPU inference. |
| `gpt-oss-20b-Q4_K_M.gguf` | 20B / Q4_K_M | Poor | Failed | Unnatural Bengali phrasing and grammatical errors. |
| `Qwen3.6-35B-A3B-UD-IQ2_M.gguf` | 35B / IQ2_M | Poor | Failed | Degraded Bengali syntax under extreme quantization. |
| `Qwen3.5-9B-UD-IQ3_XXS.gguf` | 9B / IQ3_XXS | Poor | Failed | Severe hallucination and dropped grammatical particles. |
| `gemma-4-26B-A4B-it-UD-IQ2_M.gguf` | 26B / IQ2_M | N/A | Failed | Exceeded available system RAM limits. |

- **Deployment Selection (`gemma-4-E4B`):** Prompt processing ~37.8 tok/s, generation ~5.8 tok/s on CPU; total response time for complex paragraphs ~130 s (sub-second for single conversational phrases).

### 3.2 Constrained Bengali NLG Prompt
Engineered a strict system prompt enforcing:
- **Marker Grammar:** Explicit parsing of `[?]` (question boundary), `[negation]` (local semantic negation), and `[emotion]` tags.
- **Clause Scope & Binding:** Strict preservation of `IF/THEN/OTHERWISE`, `BEFORE/AFTER/UNTIL`, and embedded `WHETHER` questions ("কি না") without turning preceding statements into questions.
- **Zero Hallucination:** Explicit prohibition against inventing names, locations, relationships, or symptoms not present in the gloss.

### 3.3 50-Criterion Semantic Stress Test
- Tested the model on a 450-token gloss sequence spanning 50 complex linguistic phenomena (past/present/future shifts, clock times, percentages, reported speech, multi-speaker binding, negation scoping, conditionals).
- **Core Linguistic Finding:** Surface fluency in Bengali is consistently high across modern compact models. However, **semantic scope tracking** (preventing a trailing negation from inverting an earlier clause, maintaining speaker-subject binding across conversational turns) is the primary vulnerability. Future improvements must focus on semantic scoping rather than vocabulary generation.

---

## Phase 4: Reverse Path — Audio & Speech (The Voice)

Phase 4 built and validated the reverse communication pathway: converting spoken Bengali/English into text, and converting translated Bengali text into spoken audio.

### 4.3 Bengali Text-to-Speech Dual Engine (`tts_engine.py`)
- **Problem:** Windows SAPI contains zero native Bengali voices (only English voices like David and Zira). Third-party offline libraries lack punctuation awareness, while cloud APIs fail when offline.
- **Dual-Engine Architecture:**
  1. **Primary (Online):** `edge-tts` using `bn-BD-NabanitaNeural`. Produces natural prosody, honors punctuation pauses (comma, danda `।`), generating audio at ~604 ms/word (~2.5 s latency).
  2. **Fallback (Offline):** `BanglaTTS` (Silero model). Generates fully offline at ~453 ms/word (~2.4 s latency after model caching).
  3. **Punctuation Mitigation:** Because `BanglaTTS` ignores punctuation marks (reading through continuously), the fallback path sanitizes text (`re.sub(r'[,.|!?;:"\'()—-।]', ' ', text)`) to prevent acoustic artifacts.
- **Fallback Chain:** Tries `edge-tts` first; automatically shifts to `BanglaTTS` if network connectivity is absent.

### 4.4 Dual-Language Local Speech-to-Text (`faster-whisper`)
- **Objective:** Provide free, private, offline voice-to-text input on CPU for hearing interlocutors speaking Bengali or English.
- **Configuration:** `faster-whisper` using the `small` model with CPU INT8 quantization and Voice Activity Detection (VAD) enabled.
- **Automatic Language Detection:** Initialized with `language=None`, allowing seamless transcription of pure Bengali, English, or mixed Bengali-English speech without manual toggling.
- **Architecture Integration:** Connects audio captured from the browser MediaRecorder to FastAPI `/api/stt`, passing transcribed text directly into the reverse gloss planner.

---

## Phase 5: Unknown Sign Handling (The Honesty Layer)

Phase 5 addresses the critical flaw of closed-world sign language models: when an unlearned sign or regional dialect variant is presented, standard models output a confident false classification. Phase 5 detects out-of-distribution inputs, analyzes their physical characteristics geometrically, and presents unconfirmed candidate interpretations honestly.

```
 [Sign Sequence (Landmarks)]
              │
              ▼
    ┌──────────────────┐
    │   Quality Gate   │ ──(Tracking Failure)──► "Low Quality: Please Re-Sign"
    └─────────┬────────┘
              │ (Valid Capture)
              ▼
    ┌──────────────────┐
    │     OOD Gate     │ ──(All Signals Agree)──► [Normal Known Recognition]
    │  (2-of-3 Rule)   │
    └─────────┬────────┘
              │ (Flagged Unknown)
              ▼
 ┌────────────────────────────────────────────────────────┐
 │ 3D Movement Analyzer (Deterministic Rule Engine)       │
 │ - Dominant hand detection (motion energy ratio)        │
 │ - Hand configuration descriptor (normalized extension) │
 │ - Body-relative location zones (head/torso/waist)      │
 │ - Wrist trajectory straightness & speed percentiles    │
 │ - Continuous palm normal orientation vector            │
 │ - Eye-line head tilt & NMM extraction                  │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Hybrid Reasoning Engine                                │
 │ - Cosine similarity retrieval against known centroids  │
 │ - Curated WBSL Phonological Reference Table lookup     │
 │ - Constrained LLM Hypothesis Generator                 │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Output Presentation & Unknown Queue                    │
 │ - UI Amber Warning: "⚠️ Unconfirmed Candidate"         │
 │ - Signer feedback: Novel sign / Tracking error / User  │
 │ - Landmark-only data queue (video discarded on-device) │
 └────────────────────────────────────────────────────────┘
```

### 5.1 Three-Outcome System
Replaces naive binary classification with three operational states:
1. **KNOWN:** Landmark sequence passes quality checks and matches training distribution with high confidence.
2. **LOW QUALITY / UNCERTAIN:** MediaPipe lost hand/face tracking, severe occlusion occurred, or sequence was too short (< 10 frames). The system requests the user to re-sign rather than guessing.
3. **UNKNOWN / OOD:** Tracking is clean, but the gesture falls outside the training distribution. Triggers the Unknown Pipeline.

### 5.2 Quality Gate & OOD Gate
- **Quality Gate:** Verifies hands visible in $\ge 80\%$ of frames, wrist visibility score $> 0.5$, motion displacement above threshold, and tracking dropout $< 20\%$.
- **OOD Gate (Three-Signal Fusion):**
  1. *Max Softmax Probability (MSP):* Lowest class confidence threshold (< 0.60 placeholder).
  2. *Embedding Distance:* Mahalanobis distance to nearest class centroid using regularized covariance (> 95th percentile placeholder).
  3. *Frame Agreement Ratio:* Proportion of individual frames agreeing with the final majority class (< 0.60 placeholder; replaces invalid standard deviations over categorical class indices).
  - *Decision Logic:* If **2 of 3 signals** flag out-of-distribution, route to Movement Analyzer.

### 5.3 Deterministic Movement Analyzer (3D Math)
Extracts structured linguistic descriptions using pure mathematics (zero ML):
- **Dominant Hand:** Automatically determined by comparing total motion energy (wrist displacement sum) between hands; supports left-dominant signers and two-handed dynamic signs.
- **Hand Configuration:** Measures 3D Euclidean distances from fingertips to palm center normalized by hand size (wrist to middle MCP); classifies extended, curved, closed, or pinch.
- **Location Zones:** Normalizes wrist coordinates by body width and distance between shoulders/nose; assigns head, chest, or waist zones.
- **Movement Trajectory:** Calculates path length vs. net displacement (straightness ratio), repetition count (axis direction reversals), and speed percentiles based on training distribution.
- **Palm Normal Orientation:** Cross product of wrist-to-index and wrist-to-pinky vectors; outputs continuous normal vector and coarse facing direction.
- **NMM Head Tilt:** Measures angular deflection of the **eye line** (not shoulder line) relative to horizontal.
- **Observability Flags:** Features compromised by occlusion or jitter output `"NOT OBSERVABLE"` rather than forced guesses.

### 5.4 Hybrid Reasoning & Constrained LLM
- **Phonological Neighborhood Retrieval:** Computes cosine similarity between sequence embedding and known class centroids to ground reasoning in known physical relatives.
- **Curated Reference Table:** The LLM is strictly prohibited from inventing sign language phonological rules. It may only cite rules provided in a curated reference table; if the table is empty, it reports physical descriptions and nearest geometric neighbors only.
- **Evidence Strength:** Candidates are tagged as *Strong*, *Moderate*, or *Weak* (the word "confident" is banned). If evidence is insufficient, the system outputs `"INSUFFICIENT EVIDENCE"`.

### 5.5 Privacy-Preserving Unknown Queue
- Captures 146-dim landmarks, movement analysis text, and user feedback.
- **Strict Privacy Rule:** Raw RGB video is discarded on-device. Only numerical landmarks and derived features enter the queue for community review (compliant with data protection principles).

---

## Phase 6: Sign-to-Avatar Movement Reproduction (The Embodiment Layer)

Phase 6 focuses on reproducing sign gestures through a custom-coded 3D avatar rendered directly in the browser. The current implementation uses Three.js with React Three Fiber (R3F), providing direct control over the avatar's geometry, body movements, and animation logic without server-side rendering.

The previously evaluated GLB-based avatar simulation model is not the current approach because it lacks sufficiently detailed finger movements and sign-specific actions. The custom-coded model provides a more flexible foundation for developing these capabilities.

### 6.1 Architectural Stack

- **Frontend / 3D Framework:** Next.js 14.2+ (App Router), TypeScript, Three.js (`0.169+`), `@react-three/fiber`, and `@react-three/drei`.
- **Client-Side Processing:** Browser-based processing and animation of hand and body-pose landmark data, without using facial landmarks for sign recognition.
- **Avatar Model:** A custom-coded 3D humanoid model controlled through application code rather than relying on the existing GLB avatar's rig and predefined animations.
- **Environment and Appearance:** Custom avatar components, Bengali dhuti styling, and an alpana-inspired stage, with direct control over the model's visual elements.

### 6.2 Custom Avatar Movement Architecture

1. **Landmark-to-Avatar Mapping:** Map hand, wrist, arm, elbow, and shoulder landmark positions to the corresponding avatar components to reproduce sign gestures.

2. **Coordinate Normalisation:** Normalise landmark coordinates against body proportions to reduce the effect of variations in signer distance and camera positioning.

3. **Procedural Body Movement:** Control the avatar's arms, shoulders, torso, and other supported body components through code-defined transformations rather than depending entirely on the GLB model's existing animations.

4. **Finger Articulation:** Develop explicit control over individual fingers, palms, and finger-joint movements to reproduce handshapes accurately. Fine-grained finger articulation remains an important implementation target.

5. **Sign-Specific Action Playback:** Map recognised signs or landmark sequences to corresponding avatar poses and movements. Individual signs must have appropriate hand configurations, movement trajectories, and start/end states.

6. **Motion Smoothing:** Apply suitable interpolation and temporal smoothing to reduce sudden movements and visual jitter while preserving the timing and accuracy of the sign.

### 6.3 Current Status and Remaining Work

- **Current Approach:** A custom-coded Three.js and React Three Fiber avatar simulation is used instead of the GLB-based avatar.
- **Architectural Advantage:** Direct control over the avatar's geometry and motion makes it easier to customise body components and develop sign-specific movement logic.
- **GLB Model Limitation:** The existing GLB-based simulation model does not provide the required level of detailed finger articulation and sign-specific actions for the intended application.
- **Remaining Work:** Improve individual finger movements, implement sign-specific action sequences, connect recognised signs to the corresponding avatar movements, and validate gesture accuracy during playback.
- **Performance Validation:** Measure rendering performance and animation responsiveness on the target laptop hardware before reporting final FPS or frame-time results.
- **Production Direction:** Continue developing the custom-coded avatar with controllable hands, fingers, arms, shoulders, and body movements. Use the GLB model only as a reference or alternative unless its limitations are adequately resolved.

---

## Cross-Phase Architectural Decisions

| Decision | Alternative Considered | Justification |
|:---|:---|:---|
| **Hand and Body-Pose Landmarks** | Raw-pixel recognition and facial landmarks | Focuses sign recognition on the hands and body movements while reducing dependence on backgrounds, lighting, and facial appearance. Signer independence must be validated through testing. |
| **NVIDIA Nemotron 3.5 Bolt E4B for Local Deployment** | Gemma-4-E4B and larger cloud-based models | Selected as the intended local LLM for Bengali language processing, with a focus on inference quality, memory usage, and CPU performance. Accuracy and latency should be measured against the same evaluation set. |
| **Dual-Engine Bengali TTS** | A single offline engine or Windows SAPI | `edge-tts` provides Bengali speech generation when online access is available, while BanglaTTS provides an offline alternative. |
| **faster-whisper CPU INT8** | Cloud speech APIs and browser-native speech recognition | Supports local speech recognition while reducing dependence on cloud processing and preserving audio privacy. |
| **Custom-Coded Three.js/R3F Avatar** | Existing GLB-based avatar simulation | Provides direct control over model geometry and movement logic, supporting the development of more detailed finger movements and sign-specific actions. |
| **Browser-Based Avatar Rendering** | Server-side Blender or Unity rendering | Avoids server-side rendering costs and supports local, interactive avatar playback within the browser. |
| **Modular Landmark Processing** | Feeding raw video directly into every downstream component | Separates landmark extraction from recognition and avatar animation, making the processing pipeline easier to test and maintain. |
| **Unknown Sign Handling** | Forcing every input into a known sign class | Allows uncertain or unsupported signs to be identified rather than automatically treating every prediction as correct. |

---

## Environment & Dependency Map

| Environment / Runtime | Primary Packages & Tools | Target Components |
|:---|:---|:---|
| **`.venv` (Main Python 3.11)** | `mediapipe==0.10.14`, `torch` (CPU), `onnxruntime`, `opencv-python`, `transformers`, `pillow` | Phase 1.1, 1.2, 1.3, Phase 2, Phase 5 |
| **`.venv-tts` (Audio Python 3.11)** | `edge-tts`, `BanglaTTS`, `mutagen`, `faster-whisper`, `sounddevice` | Phase 4.3 (TTS), Phase 4.4 (STT) |
| **LLM Execution Engine** | `koboldcpp.exe` / `llama.cpp` (GGUF CPU backend) | Phase 3 (Bengali NLG), Phase 5 (Hypothesis Generator) |
| **Web / Avatar Runtime** | Next.js 14.2+, React 18, Three.js, `@mediapipe/tasks-vision` (WASM) | Phase 6 (Sign-to-Avatar PoC) |

---

## MVT-to-Production Roadmap

The findings across these six MVTs define the transition to the production system:

1. **Temporal Continuous Sign Collection:** Replace the exploratory Python recorders with a unified web data collector combining MediaPipe Holistic and synchronized temporal annotation.
2. **BiLSTM / Transformer Sign Model:** Scale the verified 126-dim landmark representation into continuous temporal sequence recognition (expanding from the 35-class static alphabet to everyday WBSL vocabulary).
3. **Calibrated OOD Thresholds:** Replace placeholder thresholds in the Phase 5 OOD Gate with empirical calibrations derived from held-out regional sign variants.
4. **Community Phonology Knowledge Base:** Populate the Phase 5 phonology reference table in collaboration with Deaf community members in West Bengal.
5. **Production Avatar Mesh:** Replace the generic PoC avatar with an anatomically verified, non-gloved sign avatar utilizing multi-pass cropped hand tracking and inverse kinematics.
