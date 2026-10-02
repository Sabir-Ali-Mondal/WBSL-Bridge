# WBSL Bridge: Technical Architecture & System Documentation

---

## 1. System Overview & Problem Formulation

**WBSL Bridge** is a bidirectional, intent-aware communication and computational research framework engineered specifically for **West Bengal Sign Language (WBSL)**. Linguistic field studies (Johnson & Johnson, 2016, *Sign Language Studies*) demonstrate that WBSL is linguistically distinct from both Indian Sign Language (ISL, northern/Delhi dialect) and Bangladeshi Sign Language (BdSL). 

WBSL Bridge resolves the critical technological void in regional sign translation through:

1. **Sign-to-Bengali (Forward Pipeline):** Real-time computer vision extraction (126-dim hands or 258-dim holistic hands+pose), continuous temporal windowing, non-manual marker (NMM) parsing, facial affect classification, constrained Natural Language Generation (NLG) via Large Language Models (LLM), and dual-engine Bengali Text-to-Speech (TTS).
2. **Bengali-to-Sign (Reverse Pipeline):** Automatic Speech Recognition (ASR/STT) via int8-quantized Whisper, deterministic phrase mapping or zero-hallucination LLM-driven gloss decomposition, and gapless reference video playback.
3. **Privacy-Preserving Kinematic Ingestion:** DPDP Act 2023–compliant community data pipeline that strips raw video frames on client/edge, persisting only normalized float32 kinematic vectors for model retraining.

---

## 2. Unified System Architecture Diagram

```
+=============================================================================================================================================+
|                                                      CLIENT LAYER (Next.js 16 / React 19)                                                    |
+=============================================================================================================================================+
|                                                                                                                                             |
|   +-------------------------------+    +--------------------------------+    +-------------------------------+   +----------------------+   |
|   |   Live Sign Monitor           |    |   Text/Voice-to-Sign           |    |   Community Ingestion         |   |   Admin Console      |   |
|   |   (/sign-to-text)             |    |   (/text-to-sign)              |    |   (/contribute)               |   |   (/admin/*)         |   |
|   |  - HTML5 Camera Capture       |    |  - Bengali Text Area           |    |  - DPDP Privacy Gate Consent  |   |  - Model Registry    |   |
|   |  - 10 Hz Rolling JPEG Stream  |    |  - Web Audio Mic Recording     |    |  - Countdown & Capture Hook   |   |  - Dynamic Rescan    |   |
|   |  - NMM Controller Modal       |    |  - Dual-Engine Video Player    |    |  - NMM Tagging Checkbox Matrix|   |  - Kinematic Replay  |   |
|   |  - Emotion Panel (7-class)    |    |  - Sequence Playback Engine    |    |  - IndexedDB Upload Recovery  |   |  - Media Uploader    |   |
|   |  - SSE Bengali Text Stream    |    |  - Speech Lang Switch (bn/en)  |    |  - Multi-part Form Uploader   |   |  - Evidence Review   |   |
|   +---------------+---------------+    +----------------+---------------+    +---------------+---------------+   +----------+-----------+   |
+===================|=====================================|====================================|==============================|===============+
                    | POST JPEG Frame                     | Audio WebM / Text                  | Multipart Video (.webm)      | Hot-Swap/Config
                    | /api/stream/frame                   | /api/stt, /api/text-to-sign        | /api/contributions/*         | /api/admin/*
+===================V=====================================V====================================V==============================V===============+
|                                                  FASTAPI SERVICE BACKEND (Python 3.11)                                                      |
+=============================================================================================================================================+
|                                                                                                                                             |
|  +---------------------------------------------------------------------------------------------------------------------------------------+  |
|  | [1] Extraction & Coordinate Standardization Layer (backend/extract.py, backend/pose.py)                                               |  |
|  |   - Input: cv2.imdecode(BGR Frame)                                                                                                    |  |
|  |   - Contract A (HANDS_DIM = 126): 2 Hands x 21 Landmarks x 3 Coordinates (X, Y, Z)                                                    |  |
|  |   - Contract B (HOLISTIC_DIM = 258): 126 Hand Channels + 132 Pose Channels (33 BlazePose Landmarks x [X, Y, Z, Visibility])          |  |
|  |   - Invariance Transform: Origin shifted to Right Wrist ref (fallback: Left Wrist); Normalization scale = ||Point_9 - Point_0|| + 1e-6   |  |
|  +---------------------------------------------------------------------------------------------------------------------------------------+  |
|                         |                                                |                                                                  |
|                         | 126/258-dim Vector                             | BGR Image Crop                                                   |
|                         V                                                V                                                                  |
|  +-----------------------------------------------+    +--------------------------------------------------+                                  |
|  | [2] Rolling Stream Buffer & Multi-Window      |    | [3] Non-Manual Marker (NMM) & Affect Engine      |                                  |
|  |     Fusion (backend/streaming.py)             |    |     (backend/nmm.py)                             |                                  |
|  |   - Per-Session Deque (maxlen=180, ~6 sec)    |    |   - MediaPipe FaceMesh (468 points)              |                                  |
|  |   - Bounded Carry-Forward: <= 8 miss frames   |    |   - Geometric Markers:                           |                                  |
|  |   - Idle Gating: Motion < 0.004, Spread<0.008 |    |       * Brow Ratio (Raise / Furrow)              |                                  |
|  |   - Multi-Scale Slit Windows: W in (24, 32)   |    |       * Mouth Aspect Ratio (Emphasis)            |                                  |
|  |   - Resampling: Temporal Interpolation to T=32|    |       * Head Shake & Nod Variance (15-fr window) |                                  |
|  +----------------------+------------------------+    |   - Master Gates: Negation, Question, etc.       |                                  |
|                         |                             |   - ViT ONNX Facial Expression Classifier:       |                                  |
|                         | Input Tensor [1, 32, D]     |     7-Class Probabilities (224x224x3 Face Crop)  |                                  |
|                         V                             +--------------------------+-----------------------+                                  |
|  +-----------------------------------------------------------------------+       |                                                          |
|  | [4] Model Inference & Registry Subsystem (backend/main.py)            |       | NMM & Emotion Packet                                     |
|  |   - ONNX Runtime Execution Provider (CPU, Graph Input Limit: 4 GiB)   |       | {question, negation, dominant: happy, ...}               |
|  |   - Static Dispatch: [1, D] -> MLP Classifier                         |       |                                                          |
|  |   - Temporal Dispatch: [1, 32, D] -> UniLSTM / DailyNet               |       |                                                          |
|  |   - Softmax with Temperature Scaling & Margin Thresholding:           |       |                                                          |
|  |       Decisive Margin = P(Winner) - P(Runner-Up)                      |       |                                                          |
|  +----------------------+------------------------------------------------+       |                                                          |
|                         | Predicted Gloss Token                                  |                                                          |
|                         V                                                        V                                                          |
|  +---------------------------------------------------------------------------------------------------------------------------------------+  |
|  | [5] Constrained Bengali Natural Language Generation (backend/llm_engine.py)                                                           |  |
|  |   - Input Payload: Ordered Gloss Sequence + NMM Context Flags + Affect Meta + Intensity Multipliers                                   |  |
|  |   - Engine: Local Gemma-4-E4B (KoboldCpp OpenAI-compatible endpoint) OR Cloud LLM (OpenRouter / OpenAI API)                           |  |
|  |   - System Constraints: Anti-hallucination prompt, grammatical order mapping, question anchor [?], uncertainty ("সম্ভবত")             |  |
|  |   - Response Delivery: Server-Sent Events (SSE) Delta Stream via `POST /api/nlg/stream`                                               |  |
|  +-------------------------------------------------------------------+-------------------------------------------------------------------+  |
|                                                                      | Synthesized Bengali String                                           |
|                                                                      V                                                                      |
|  +---------------------------------------------------------------------------------------------------------------------------------------+  |
|  | [6] Audio Synthesis & STT Processing Engines                                                                                          |  |
|  |   - TTS Dispatch (backend/tts_engine.py):                                                                                             |  |
|  |       * Primary: `edge-tts` (Online Microsoft Neural Voices: bn-BD-NabanitaNeural [F], bn-BD-PradeepNeural [M])                          |  |
|  |       * Fallback: `BanglaTTS` (Offline Silero-based acoustic synthesis)                                                               |  |
|  |   - STT Engine (backend/stt_engine.py):                                                                                               |  |
|  |       * `faster-whisper` (Small model, CPU execution, int8 quantized computation)                                                     |  |
|  |       * Language Routing: Explicit ISO-639-1 enforcement (Strict: 'bn', 'en', or Auto VAD)                                            |  |
|  +-------------------------------------------------------------------+-------------------------------------------------------------------+  |
+======================================================================|======================================================================+
                                                                       V Audio / JSON Payload
+=============================================================================================================================================+
|                                                  PERSISTENCE, ARTIFACTS & DATA STORAGE                                                      |
+=============================================================================================================================================+
|  /models/onnx_models/<id>/           /backend/media/                   /dataset/manifest.jsonl          /backend/data/                      |
|  - *.onnx (Graph)                    - *.mp4 (H.264 Universal AVC1)   - Review Queue Status             - gloss_map.json (Lexicon)          |
|  - *.onnx.data (Weights)             - *.webp / *.png (Keyframes)      - DPDP Pseudonym Signer IDs       - sign_media.json (Media Map)       |
|  - *_classes.json (Label list)       - Range Requests (206 Partial)    - Relative *.npy Landmark Paths   active_model.json (Pointer)         |
+=============================================================================================================================================+
```

---

## 3. Core Subsystems & Execution Mechanics

### 3.1 Kinematic Landmark Extraction & Normalization Contracts
Feature extraction is centralized in `backend/extract.py` and `backend/pose.py` to prevent inference drift relative to training distributions.

```
Raw Frame (BGR) ──> Color Conversion (RGB) ──> MediaPipe Graph Pipeline
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼ (width = 126)                                                       ▼ (width = 258)
         Hands Graph Only                                                        Holistic Graph
   (Left/Right classification)                                           (LH, RH, and 33-point BlazePose)
                 │                                                                     │
                 ▼                                                                     ▼
      Right-Wrist Origin Shift                                              Right-Wrist Origin Shift
     Scale Normalization Denom:                                            Scale Normalization Denom:
  ||Point_9 - Point_0||_2 + 1e-6                                        ||RH_9 - RH_0||_2 + 1e-6
                 │                                                                     │
                 ▼                                                                     ▼
         [126-dim Vector]                                                      [258-dim Vector]
  (42 hand points * 3 coords)                                            (126 hand + 132 pose coords)
```

1. **Dual Hands Pipeline (`HANDS_DIM = 126`):**
   * Processes left and right hand landmarks (21 points each $\times$ $[x, y, z]$).
   * Identifies wrist landmark ($P_0$) and middle-finger MCP joint ($P_9$).
   * Scale factor $S = \|P_9 - P_0\|_2 + 10^{-6}$.
   * Canonical origin: Right wrist ($P_{0,\text{right}}$). If the right hand is absent, fallback to left wrist ($P_{0,\text{left}}$).
   * Normalization: $P_{\text{norm}} = \frac{P - P_{\text{origin}}}{S}$.
   * Left hand block precedes the right hand block in memory layout: $[\mathbf{L}_{0..62}, \mathbf{R}_{0..62}]$.

2. **Holistic Pipeline (`HOLISTIC_DIM = 258`):**
   * Ingests 42 hand coordinates (126 elements) and 33 BlazePose coordinates (132 elements: $[x, y, z, \text{visibility}]$).
   * Enforces joint presence: Requires both hands and pose tracking to return valid vectors; otherwise, returns `None` to trigger deterministic session carry-forward.
   * Hands and pose spatial coordinates are scaled relative to the right-wrist frame ($S = \|P_{9,\text{right}} - P_{0,\text{right}}\|_2 + 10^{-6}$).

---

### 3.2 Non-Manual Marker (NMM) & Affect Engine
Located in `backend/nmm.py`, this module analyzes syntactic facial expressions and affective signals concurrently with manual signs:

1. **Facial Morphology:** Utilizes MediaPipe FaceMesh (468 landmarks). Face scale normalization uses face width $W_F = \|P_{454} - P_{234}\|_2$ (inter-zygomatic distance).
2. **Grammatical Marker Equations:**
   * **Brow Height Ratio ($R_B$):** Distances from eyebrows to eye centers normalized by $W_F$:
     $$R_B = \frac{\|\mathbf{P}_{lb} - \mathbf{P}_{le}\|_2 + \|\mathbf{P}_{rb} - \mathbf{P}_{re}\|_2}{2 \cdot W_F}$$
     * $R_B > 0.082 \implies \text{question [?]}$ (Polar/Yes-No question).
     * $R_B < 0.032 \implies \text{wh\_question}$ (Furrowed brow).
   * **Mouth Aspect Ratio ($R_M$):** Vertical lip aperture normalized by $W_F$:
     $$R_M = \frac{\|\mathbf{P}_{13} - \mathbf{P}_{14}\|_2}{W_F}$$
     * $R_M > 0.055 \implies \text{emphasis}$ (Lexical/modal stress).
   * **Head Trajectory Variance ($\sigma^2_x, \sigma^2_y$):** Evaluated over a rolling temporal deque of $N = 15$ frames using nose tip landmark $P_1$:
     * $\sigma^2_x > 0.0018 \implies \text{negation}$ (Head shake).
     * $\sigma^2_y > 0.0018 \implies \text{affirmation}$ (Head nod).
3. **Master Marker Gates:** `MARKER_GATES` provides hard programmatic bypass switches (`True`/`False`) evaluated *after* geometric extraction, keeping telemetry visible in the UI while controlling whether tokens are emitted to the LLM.
4. **Vision Transformer (ViT) Affect Classifier:**
   * Model: `tests/vit_emotion.onnx` (`trpakov/vit-face-expression`).
   * Evaluated every 4 frames on face crops resized to $224 \times 224 \times 3$, normalized with ImageNet stats ($\mu=[0.485, 0.456, 0.406]$, $\sigma=[0.229, 0.224, 0.225]$).
   * Returns a 7-class probability vector: `[angry, disgust, fear, happy, neutral, sad, surprise]`.
   * Gated by an acceptance floor (`emotion_min_confidence = 0.35`), falling back to `neutral` to eliminate transient micro-expression noise.

---

### 3.3 Continuous Streaming & Multi-Window Decision Logic
Continuous sign language recognition cannot rely on fixed recording duration. The engine (`backend/streaming.py` and `main.py`) manages a rolling temporal window:

```
Camera Stream (30 FPS) ──> Client Throttled POST (10 Hz) ──> /api/stream/frame?session_id=...
                                                                        │
                                                                        ▼
                                                          StreamSession.buf (deque maxlen=180)
                                                          Bounded Carry-Forward (Miss <= 8 frames)
                                                                        │
                                                                        ▼
                                                          Throttle Check: delta_t >= 0.25s
                                                                        │
                                   ┌────────────────────────────────────┴────────────────────────────────────┐
                                   ▼                                                                         ▼
                         Sub-Window 1: W = 24 frames                                               Sub-Window 2: W = 32 frames
                                   │                                                                         │
                                   ├───────────────────────────── Kinematic Gating ──────────────────────────┤
                                   │  * Mean Inter-frame Motion: E[||x_t - x_{t-1}||] >= 0.004               │
                                   │  * Global Spread Variance:  E[||x_t - x_mean||]  >= 0.008               │
                                   │  (If motion/spread below threshold -> Reject Window as IDLE)            │
                                   │                                                                         │
                                   ▼                                                                         ▼
                       Resample to T=32 frames                                                   Resample to T=32 frames
                                   │                                                                         │
                                   ▼                                                                         ▼
                       ONNX Model Run (Logits)                                                   ONNX Model Run (Logits)
                                   │                                                                         │
                                   ▼                                                                         ▼
                       Softmax & Margin:                                                         Softmax & Margin:
                       margin = P_top1 - P_top2                                                  margin = P_top1 - P_top2
                                   │                                                                         │
                                   └────────────────────────────────────┬────────────────────────────────────┘
                                                                        │
                                                                        ▼
                                                          Select Max Margin Candidate:
                                                          Best Win = argmax_{W}(margin_W)
                                                                        │
                                                                        ▼
                                                         Client Confirmation (SignToTextPage):
                                                         - Confidence >= min_confidence (0.55)
                                                         - Margin >= min_margin (0.25)
                                                         - Sequential Consistency: Count >= stable_windows (2)
                                                         - Cooldown Enforcement: delta_ms >= repeat_cooldown_ms (1500ms)
                                                                        │
                                                                        ▼
                                                           Commit Gloss to Sequence
```

---

### 3.4 Deep Neural Architectures

#### 1. `DailyNet` (Temporal BiLSTM with Attention Pooling)
Trained in `train_holistic.py` on the 258-dimensional holistic contract:
* **Feature Expansion:** Ingests input tensor $\mathbf{X} \in \mathbb{R}^{B \times 32 \times 258}$.
* **Velocity Delta:** Appends temporal difference $\Delta \mathbf{X}_t = \mathbf{X}_t - \mathbf{X}_{t-1}$, where $\Delta \mathbf{X}_0 = \mathbf{0}$.
* **Presence Flags:** Calculates Left Hand Presence $L_m = \mathbb{I}(\sum |\mathbf{X}_{\text{LH}}| > 0)$ and Right Hand Presence $R_m = \mathbb{I}(\sum |\mathbf{X}_{\text{RH}}| > 0)$.
* **Input Dimension:** $D_{\text{in}} = 258 \times 2 + 2 = 518$.
* **Projection & BiLSTM:**
  $$\mathbf{H} = \text{BiLSTM}(\text{GELU}(\text{LayerNorm}(\mathbf{X}_{\text{concat}}) \mathbf{W}_p + \mathbf{b}_p)) \quad \text{where } \mathbf{H} \in \mathbb{R}^{B \times 32 \times 256}$$
* **Attention Pooling:** Instead of returning the final hidden state (which biases predictions toward late-window idling), an attention score $\alpha_t$ pools salient motion across frames:
  $$u_t = \mathbf{w}_a^\top \mathbf{H}_t, \quad \alpha_t = \frac{\exp(u_t)}{\sum_{k=1}^{32} \exp(u_k)}, \quad \mathbf{c} = \sum_{t=1}^{32} \alpha_t \mathbf{H}_t$$
* **Classification Head:** Linear layer maps context $\mathbf{c} \in \mathbb{R}^{256}$ to classes (including `NONE`).

#### 2. `UniLSTM` (Temporal Stacked LSTM)
Trained in `train_unified.py` across 126-dimensional two-hand coordinates:
* Ingests $\mathbf{X} \in \mathbb{R}^{B \times 32 \times 126}$.
* 2-layer standard LSTM with hidden size $H=128$, dropout $=0.3$.
* Final step pooling: Evaluates logits via $\mathbf{y} = \mathbf{H}_{32} \mathbf{W}_c + \mathbf{b}_c$.

#### 3. Model Registry Dynamic Lifecycle
The `ModelRegistry` class in `backend/main.py`:
* Scans `models/` and `models/onnx_models/*` for `.onnx` and companion `*classes*.json` artifacts.
* Inspects graph topologies via ONNX Runtime session metadata, checking tensor rank ($N=2 \implies \text{Static MLP}$, $N=3 \implies \text{Temporal LSTM}$) and boundary dimension ($D \in \{126, 258\}$).
* Supports zero-downtime hot swapping via `/api/admin/models/activate`.

---

### 3.5 Natural Language Generation (NLG) Pipeline

The NLG subsystem (`backend/llm_engine.py`) maps discontinuous gloss sequences and non-manual grammatical modifiers into grammatically coherent, colloquial West Bengal Bengali.

#### System Prompt Enforcement
```
System Role: Bengali NLG module of a WBSL communication system.
Task: Convert WBSL gloss tokens into natural West Bengal Bengali.

Input Grammatical Markers:
  - WORD[?]                  -> Interrogative sentence boundary
  - WORD[negation]           -> Clausal negation (স্থানীয় না-সূচক ব্যাকরণ)
  - WORD[emotion]            -> Contextual emotion token
```

#### Deterministic Anti-Hallucination Guardrails
1. **Embedding Question Isolation:** The presence of `WHETHER`, `IF`, or `ASK` marks an embedded clause ("কিনা", "পারবে কিনা") and does not turn the outer sentence into an interrogative.
2. **Question Anchor Rule:** Only a literal `[?]` flag on the final token triggers a direct question format.
3. **Temporal Invariance:** Tense indicators (`BEFORE`, `PAST`, `YESTERDAY`) fix clause tense; downstream tokens cannot shift earlier clauses.
4. **Fingerspelling Reassembly:** Sequences of alphabetic/numeric characters (e.g., `[R] + [A] + [V] + [I]`) are merged into proper nouns.

#### Communication Interface: Server-Sent Events (SSE)
Delivered over `POST /api/nlg/stream` with real-time text chunks:
```http
POST /api/nlg/stream HTTP/1.1
Content-Type: application/json

{
  "gloss": "HELLO + WHAT_IS_YOUR_NAME[?]",
  "nmm": {"question": true, "negation": false},
  "emotion": {"dominant": "happy", "confidence": 0.88}
}
```
**SSE Stream Emission:**
```text
data: {"type": "delta", "text": "নমস্কার", "reasoning": ""}
data: {"type": "delta", "text": " আপনার", "reasoning": ""}
data: {"type": "delta", "text": " নাম কী?", "reasoning": ""}
data: {"type": "done", "bengali_text": "নমস্কার আপনার নাম কী?", "tokens_used": 14}
data: [DONE]
```

---

### 3.6 Speech-to-Text & Text-to-Speech Subsystems

#### Speech-to-Text (ASR)
* **Engine:** `faster-whisper` (`small` model, CPU inference, int8 quantization).
* **Language Routing (`backend/stt_engine.py`):**
  * Language choices are mapped via `LANG_MAP` strictly to ISO-639-1 (`"bn"`, `"en"`).
  * Auto-detection is explicitly gated to prevent cross-language misclassifications (e.g., Bengali transcribed into Devanagari/Hindi).
  * Audio is pre-filtered with Silero VAD (`vad_filter=True`) with beam size 5.

#### Text-to-Speech (TTS)
Managed by `backend/tts_engine.py` via a dual-engine fallback design:
1. **Primary (Online):** `edge-tts` streaming via Microsoft Azure cognitive neural endpoints. Voices: `bn-BD-NabanitaNeural` (Female, `voice_id=1`), `bn-BD-PradeepNeural` (Male, `voice_id=2`).
2. **Secondary (Offline Fallback):** `BanglaTTS` (Silero models). Strips complex punctuation and runs local CPU acoustic synthesis when internet access is disrupted.

---

### 3.7 Reverse Translation: Bengali to Sign Synthesis

The reverse path converts written Bengali or spoken audio into sign sequences:

```
Bengali String / Audio STT ──> Lexicon Matcher (backend/main.py: text_to_sign)
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼ (Deterministic Table Match)                         ▼ (useLlm = True)
   Tokenize & Multi-word Lookup                         LLM Gloss Planner (GLOSS_BREAK_SYSTEM)
   (e.g., "তোমার নাম কি" -> WHAT_IS_YOUR_NAME)          - Constrained vocabulary mapping
   Unmapped words -> Letter fingerspelling              - Strict question preservation
            │                                                     │
            └──────────────────────────┬──────────────────────────┘
                                       │
                                       ▼
                       Array of Validated Gloss Tokens
                       (e.g., ["HELLO", "WHAT_IS_YOUR_NAME"])
                                       │
                                       ▼
                       Media Resolver (sign_media.json)
                       Resolves each gloss to Reference Media:
                       - Video: H.264 (AVC1) in MP4 container
                       - Image: WebP / PNG
                                       │
                                       ▼
                       Client Media Sequencing (VideoPlayer.tsx)
                       - Seamless playback transitions
                       - Dual-Engine Playback:
                         * Engine 1: Native HTML5 Video Element
                         * Engine 2: Server-side frame extraction via Canvas
                           fallback (JPEG stream at 14 FPS) if codec fails
```

---

### 3.8 Community Ingestion, Privacy & Evidence Review

The `/contribute` and `/admin/contributions` modules adhere to India's **Digital Personal Data Protection (DPDP) Act 2023**:

```
Signer Recording Session (Browser)
      │
      ├──> Privacy Gate: Four mandatory declarations + Signer ID generation
      ├──> Landmark Vectorization: Raw video decoded on-device (or server memory)
      └──> Edge Stripping: Original video discarded; only .npy arrays uploaded
               │
               ▼
   Server Persistence: /dataset/samples/<LABEL>/<SIGNER_ID>/<SAMPLE_ID>.npy
   Manifest Record Added: /dataset/manifest.jsonl
               │
               ▼
   Automated Kinematic Evidence Engine (/api/admin/contributions/{id}/evidence)
   Evaluates 4 Quantitative Metrics without Auto-Approving:
   1. Geometry Score: Evaluates normalized spatial configuration against class priors
   2. Temporal Score: Evaluates execution velocity and frame count stability
   3. Similarity Score: Cluster proximity in embedding space
   4. Model Agreement: Cross-check against active ONNX classifier
               │
               ▼
   Human-in-the-Loop Decision Interface (EvidencePanel.tsx)
   Reviewer inspects Kinematic Replay (LandmarkSimulation.tsx) + Evidence Metrics
   Options: [ ACCEPT ] -> Promoted to Train Pool | [ REJECT ] | [ NEEDS REVIEW ]
```

---

## 4. Mathematical Formulations & Algorithms

### 4.1 Coordinate Normalization
Given 2D/3D raw hand points $P_i \in \mathbb{R}^3$, the transformation into scale- and translation-invariant space is:

$$S = \sqrt{\sum_{k \in \{x,y,z\}} (P_{9, k} - P_{0, k})^2} + \epsilon$$

$$P_{i, \text{norm}} = \frac{P_i - P_{\text{wrist}}}{S}, \quad \forall i \in \{0, \dots, 20\}$$

Where $\epsilon = 10^{-6}$ prevents zero-division singularity when hands exit the frame.

### 4.2 Stream Kinematic Motion & Spread Gates
To prevent static poses from continuously triggering false positives during inference:

$$\text{Motion} = \frac{1}{(T-1) \cdot D} \sum_{t=1}^{T-1} \sum_{d=0}^{D-1} |X_{t, d} - X_{t-1, d}|$$

$$\text{Spread} = \frac{1}{T \cdot D} \sum_{t=0}^{T-1} \sum_{d=0}^{D-1} |X_{t, d} - \mu_d|, \quad \text{where } \mu_d = \frac{1}{T} \sum_{k=0}^{T-1} X_{k, d}$$

$$\text{Active Inference} \iff (\text{Motion} \ge 0.004) \land (\text{Spread} \ge 0.008)$$

---

## 5. API Interface Specifications

| Endpoint | Method | Input Contract | Output Contract | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/api/system/health` | `GET` | *None* | `SystemHealth` (JSON) | Telemetry status: backend, models, active contracts, and coverage. |
| `/api/predict/frame` | `POST` | `multipart/form-data` (`file`: JPEG) | `PredictResponse` (JSON) | Single-frame inference for static MLP classifiers (126/258-dim). |
| `/api/predict/clip` | `POST` | `multipart/form-data` (`files`: JPEGs) | `ClipResponse` (JSON) | Batch prediction across an uploaded array of video frames. |
| `/api/stream/frame` | `POST` | `session_id`, `file`: JPEG | `StreamResult` (JSON) | **Primary Live Route:** Server-side buffered sliding window inference. |
| `/api/nmm/config` | `GET/POST`| Threshold overrides, `marker_gates` | NMM Configuration (JSON) | Live runtime reconfiguration of NMM thresholds and master toggles. |
| `/api/nlg/stream` | `POST` | `NLGRequest` (Gloss, NMM, Affect) | `text/event-stream` (SSE) | Real-time token streaming of generated Bengali translations. |
| `/api/text-to-sign` | `POST` | `TextToSignRequest` (`text`: string) | `TextToSignResult` (JSON) | Maps Bengali text to sequenced gloss tokens and media paths. |
| `/api/text-to-sign/llm` | `POST` | `TextToSignRequest` (`text`: string) | `TextToSignResult` (JSON) | Uses an LLM planner to decompose sentences using known vocabulary. |
| `/api/stt` | `POST` | `file`: Audio WebM, `language`: string | `STTResponse` (JSON) | Converts spoken input to text via int8-quantized Whisper. |
| `/api/tts/generate` | `POST` | `text`: string, `voice`: "1" \| "2" | `TTSResponse` (JSON) | Synthesizes Bengali audio via edge-tts or BanglaTTS. |
| `/api/admin/models/activate`| `POST`| `ModelSelectRequest` (`path`: string) | Confirmation + Active metadata | Hot-swaps the active ONNX model at runtime without restarting. |
| `/api/contributions/session/{id}/samples` | `POST` | `label`, `signer_id`, `file`: Video | Ingestion receipt (JSON) | Extracts landmarks from community uploads and writes to the manifest. |

---

## 6. Directory Layout & Storage Structure

```text
WBSL Bridge/
├── backend/
│   ├── data/
│   │   ├── gloss_map.json            # Bengali-to-WBSL lexical lookup tables
│   │   └── sign_media.json           # Catalog mappings to reference videos and images
│   ├── media/                        # H.264/WebP reference media library
│   ├── tts_output/                   # Audio cache for generated TTS files
│   ├── extract.py                    # Hand & holistic MediaPipe extraction pipelines
│   ├── llm_engine.py                 # Anti-hallucination Bengali NLG logic & SSE streamer
│   ├── main.py                       # FastAPI application routers and session registry
│   ├── nmm.py                        # FaceMesh geometry & ViT ONNX affect detection
│   ├── pose.py                       # BlazePose 33-point topological skeleton definitions
│   ├── streaming.py                  # Rolling landmark buffer for continuous live signing
│   ├── stt_engine.py                 # faster-whisper int8 speech-to-text runner
│   └── tts_engine.py                 # edge-tts & BanglaTTS dual synthesis engines
├── dataset/
│   ├── manifest.jsonl                # Master database of community-contributed samples
│   ├── index.jsonl                   # Cross-referenced index of all project data assets
│   └── samples/                      # Structured .npy kinematic storage: [label]/[signer]/
├── dataset_train/                    # Extracted training pools: daily_video/, unified_video/
├── frontend/                         # Next.js 16 App Router interface
│   ├── src/
│   │   ├── app/                      # Routes: /sign-to-text, /text-to-sign, /contribute, /admin
│   │   ├── components/               # React UI modules (VideoPlayer, LandmarkSimulation, etc.)
│   │   ├── hooks/                    # useCamera, useRecording, useSystemStatus
│   │   ├── lib/                      # Type declarations, vector constants, utilities
│   │   └── store/                    # Zustand stores for client state management
├── models/
│   ├── onnx_models/                  # Discovered inference runs (<id>/*.onnx)
│   └── active_model.json             # Persistent pointer to the active serving graph
├── train_holistic.py                 # Training script for 258-dim holistic BiLSTM + Attention
└── train_unified.py                  # Training script for 126-dim temporal LSTM models
```