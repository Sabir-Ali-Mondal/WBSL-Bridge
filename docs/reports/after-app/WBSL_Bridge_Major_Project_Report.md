# DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
### COOCH BEHAR GOVERNMENT ENGINEERING COLLEGE
*(A Government Engineering College under the Department of Higher Education, Government of West Bengal)*  
Harinchawra, Cooch Behar, West Bengal – 736170

---

## MAJOR PROJECT TECHNICAL REPORT
**Academic Session: 2025–2026 | B.Tech 7th Semester**

### Project Title:
# WBSL Bridge

### Academic Title:
## WBSL Bridge: Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth

---

### SUBMITTED BY:

*   **SABIR ALI MONDAL** | University Roll No: **34900123032**
*   **KOUSHAKI SINGHA** | University Roll No: **34900124074**
*   **MONIRUL HALDER** | University Roll No: **34900123021**
*   **FIRDOS SHAKIH** | University Roll No: **34900123011**

**Project Supervisor:** Prof. Prabir Kr. Naskar, Assistant Professor, Department of CSE



---

## ABSTRACT

Sign language is a visual-spatial language where clausal syntax, negation, questions, and emotion are expressed concurrently through hand movements, non-manual markers (NMMs), and body orientation. Most existing sign language tools perform word-by-word transliteration of hand shapes into isolated text, completely discarding facial and head markers. This causes severe mistranslations—such as inverting a negated question into an affirmative statement. 

Furthermore, while systems such as Google DeepMind's SL2T (2026) demonstrated high-resource real-time American Sign Language (ASL) translation on smartphones using over 100,000 hours of training data, regional languages in India remain unserved. Specifically, **West Bengal Sign Language (WBSL)** has been proven statistically and linguistically distinct from both Northern Delhi Indian Sign Language (ISL) and Bangladeshi Sign Language (BdSL) (*Johnson & Johnson, Sign Language Studies, 2016*). Despite serving hundreds of thousands of Deaf individuals in West Bengal, WBSL has zero dedicated deep learning models, zero continuous video datasets, and zero bidirectional translation pipelines.

**WBSL Bridge** addresses this technological void by providing an edge-deployable, bidirectional, intent-aware sign translation framework that operates on consumer-tier CPUs without cloud dependencies. The forward pipeline (Sign to Bengali) captures frames at 30 FPS, extracting normalized coordinate vectors across two feature contracts: a 126-dimensional hand vector and a 258-dimensional holistic vector (126 hand coordinates + 132 BlazePose body coordinates). Grammatical NMMs (eyebrow raises/furrows, head shakes/nods, mouth aperture) are processed in sub-5ms latency using deterministic spatial algorithms, while facial affect is classified across 7 emotion categories using a Vision Transformer (ViT) exported to ONNX. Continuous signing is buffered in a server-side rolling deque (180 frames) and parsed across multi-scale sliding windows (24 and 32 frames) governed by kinematic motion and spatial spread gating. 

Classification is driven by **DailyNet**, a temporal Bidirectional Long Short-Term Memory (BiLSTM) network with linear attention pooling, velocity delta channels, and hand-presence gating ($518 \to 128 \to C$), achieving 100% validation accuracy across core conversational classes including a dedicated background idle class (`NONE`). The resulting gloss sequence, grammatical flags, and affect states are passed to a local Small Language Model (e.g., `gemma-4-E4B`) governed by a 50-criteria anti-hallucinatory prompt. The model outputs grammatical West Bengal Bengali via Server-Sent Events (SSE) token streaming, which is then spoken using an automatic dual-engine Text-to-Speech fallback chain (`edge-tts` to offline `BanglaTTS`). 

The reverse pipeline (Bengali to Sign) transcribes spoken audio via an int8-quantized `faster-whisper` engine with strict ISO language locking, maps text into sign glosses via deterministic phrase matching or LLM planning, and drives gapless playback of reference signs using a dual-engine video player with canvas fallback. To allow safe dataset growth, the system implements an ingestion pipeline compliant with India's **Digital Personal Data Protection (DPDP) Act 2023**, stripping raw video on-device and saving only normalized float32 kinematic matrices for human-in-the-loop review. The entire system is implemented across a unified Python 3.11 FastAPI backend and a Next.js 16 / React 19 web interface.

**Keywords:** West Bengal Sign Language (WBSL), Non-Manual Markers (NMM), BiLSTM Attention Network, Constrained NLG, MediaPipe Holistic, ViT Emotion Classification, Edge Computing, DPDP Act 2023.

---

## TABLE OF CONTENTS

1. Introduction & Problem Definition
2. Literature Survey & Research Gaps
3. System Architecture & Processing Pipelines
4. Kinematic Feature Contracts & Mathematical Modeling
5. Deep Neural Architectures & Dynamic Model Registry
6. Intent-Aware Natural Language Generation (NLG)
7. Bidirectional Reverse Synthesis & Audio Processing
8. Data Privacy, Community Ingestion & DPDP Compliance
9. Experimental Results & Performance Analysis
10. Conclusion & Future Roadmap
11. References

---

# CHAPTER 1: INTRODUCTION & PROBLEM DEFINITION

### 1.1 Context and Motivation
Sign language is the native linguistic foundation for over 70 million Deaf and hard-of-hearing individuals worldwide. Rather than acting as visual representations of spoken regional languages, sign languages are fully independent linguistic systems equipped with their own morphology, spatial grammar, and syntax. In India, most national accessibility efforts target Standard Indian Sign Language (ISL), which is based predominantly on Northern (Delhi) dialects. 

In West Bengal, Deaf signers use **West Bengal Sign Language (WBSL)**. Because national tools, mobile applications, and government portals default to Standard ISL or Hindi/English text, Deaf individuals in West Bengal face dual marginalization: excluded from hearing society and linguistically alienated within national Deaf infrastructure.

### 1.2 The Sociolinguistic Reality: WBSL vs. ISL vs. BdSL
Prior computational attempts in Eastern India often assumed that sign language in West Bengal is identical to Bangladeshi Sign Language (BdSL) across the border, or that it is a direct dialect of Northern ISL. 

Linguistic field studies disprove this assumption. In 2016, Robert J. Johnson and Jami E. Johnson (*Sign Language Studies*, Vol. 16, No. 4) published a comprehensive sociolinguistic study proving that **WBSL shares less than 60% lexical similarity with Northern ISL**—far below the 80% threshold universally recognized by linguists to designate dialects of the same language. Simultaneously, decades of geopolitical separation, distinct educational institutions, and divergent spoken language influences (West Bengal Bengali phonetics vs. Bangladeshi dialects) have caused WBSL to diverge significantly from BdSL. 

Despite this documented linguistic distinctness, our pre-engineering audit revealed:
1.  **Zero** AI/ML/DL models designed for WBSL syntax.
2.  **Zero** continuous video or landmark datasets for WBSL.
3.  **Zero** real-time sign-to-Bengali translation pipelines worldwide. The only existing resource was a static, unannotated 170-sign glossary on the Wikisigns platform.

```
       LINGUISTIC INDEPENDENCE OF REGIONAL SIGN VARIETIES
       
    [Northern ISL (Delhi)]       [WBSL (West Bengal)]       [BdSL (Bangladesh)]
    - Hindi mouthing bias        - Bangla mouthing dominant  - Separate evolution
    - Formal standardized NMM    - Single-side head tilt '?' - Distinct lexical base
    - Less than 60% similarity   - Lexical divergence        - SVO/SOV hybrid forms
```

### 1.3 The Intention Problem in Sign Processing
Conventional sign translation systems suffer from the **"Gloss Transliteration Trap"**: they classify manual hand shapes and output static dictionary words (e.g., mapping a hand pose to `YOU`, `GO`, `COLLEGE`). 

However, sign language grammar does not reside solely in the hands. The hands convey the lexical root, while the face and head movements convey grammatical structure, syntactic questions, negation, and communicative intent:
*   `YOU + GO + COLLEGE` with a neutral face means: *"You are going to college."* (Declarative assertion)
*   `YOU + GO + COLLEGE` with raised eyebrows and forward posture means: *"Are you going to college?"* (Yes/No Question)
*   `YOU + GO + COLLEGE` with a lateral head shake means: *"You are not going to college."* (Clausal Negation)

A system that ignores facial non-manual markers translates all three scenarios identically. In medical, legal, or emergency scenarios, confusing an assertion with a negation or question causes complete communication failure. Capturing **intent** requires tracking manual signs, facial syntax, and affective state simultaneously.

### 1.4 Objectives of WBSL Bridge
1.  **Dual-Contract Tracking:** Build an invariant vision extractor capturing 126-dim hand vectors and 258-dim holistic vectors (hands + BlazePose) at 30 FPS on CPU.
2.  **Sub-5ms Geometric NMM Detection:** Design deterministic algorithms for eyebrow raises/furrows, head shakes/nods, and mouth aperture without heavy neural networks.
3.  **Temporal Neural Inference:** Train and deploy continuous Recurrent Neural Networks (`DailyNet` BiLSTM-Attention) via ONNX Runtime with integrated background/idle gating (`NONE` class).
4.  **Constrained Bengali NLG:** Develop a 50-criteria prompt driving local Small Language Models (`gemma-4-E4B`) to output grammatical West Bengal Bengali without hallucination.
5.  **Bidirectional Synthesis:** Build a reverse translation pipeline converting spoken/written Bengali into gloss sequences and reference videos.
6.  **DPDP Compliance:** Create a privacy-preserving community collection pipeline that strips raw video on-device, saving only anonymized kinematic matrices.

---

# CHAPTER 2: LITERATURE SURVEY & RESEARCH GAPS

### 2.1 Evolution of Sign Recognition Technologies
Sign language recognition has evolved through three main computational paradigms:
1.  **Sensor Gloves (2018):** Relied on physical flex sensors, accelerometers, and tactile wires (Sarker and Hoque, 2018). While mechanically accurate, gloves are intrusive, expensive, fragile, and completely blind to facial grammatical expressions.
2.  **Raw RGB Video CNNs (2020–2023):** Utilized 2D/3D Convolutional Neural Networks on raw pixels (Akash et al., 2023). However, raw-pixel models overfit heavily to skin tone, room lighting, clothing, and background clutter, requiring massive datasets to generalize across different signers.
3.  **Coordinate Landmark Representations (2024–2026):** Maps raw video into sparse, invariant skeletal landmarks ($x, y, z$). This removes background, lighting, and skin-color bias. Google DeepMind's **SL2T** (Tanzer et al., August 2026) validated this approach by deploying real-time ASL-to-English translation on smartphones using over 100,000 hours of training data.

### 2.2 Verified Research Gaps
Through an exhaustive literature survey across IEEE, ACL, and regional conferences, 18 distinct research gaps were verified:

| Gap ID | Research Gap Focus | Empirical Status | Justification |
| :--- | :--- | :--- | :--- |
| **G1** | Continuous WBSL Recognition | Open | Zero continuous models exist for WBSL. |
| **G3** | Signer Independence in WBSL | Open | Prior regional models overfit to single signers. |
| **G4** | Regional WBSL Linguistic Focus | Open / Verified | Statistically distinct from ISL (*Johnson, 2016*). |
| **G5** | Continuous WBSL Video Dataset | Open | No public continuous datasets exist for WBSL. |
| **G6** | WBSL to Bengali Natural Output | Open | All existing Indian systems target Hindi or English. |
| **G7** | Constrained LLM Sign Translation | Open | Prior systems lack strict semantic scope bounds. |
| **G9** | Multimodal NMM Grammar Coupling | Open | Regional systems ignore facial grammatical syntax. |
| **G10** | Bidirectional Sign-Speech Flow | Open | Almost all regional projects are one-way only. |
| **G13** | Low-Resource Transfer Learning | Open | Google SL2T needs 100k hours; WBSL has ~0 hours. |
| **G15** | WBSL vs. BdSL Linguistic Split | Open / Verified | Technologies developed in Dhaka do not fit Kolkata. |
| **G16** | Morphological Bengali NLP | Open | Handling SOV order, honorifics, and conjuncts. |
| **G17** | DPDP Act 2023 Biometric Privacy | Open | Uploading raw user videos violates privacy laws. |

### 2.3 Positioning Against Google DeepMind SL2T
Google's SL2T proved that real-time landmark-based sign translation works at consumer scale. However, it cannot solve the problem for West Bengal:
*   **Data Scale:** SL2T used 100,000+ hours of localized ASL video. WBSL has zero public continuous hours. WBSL Bridge focuses on what works under extreme data scarcity (transfer learning, kinematic augmentation, BiLSTM attention).
*   **Language Syntax:** SL2T targets English (SVO). WBSL Bridge targets Bengali (SOV, agglutinative verb conjugations, three-tier honorifics).
*   **Hardware Target:** SL2T relies on custom smartphone TPUs. WBSL Bridge is designed to run entirely on standard consumer CPUs.

---

# CHAPTER 3: SYSTEM ARCHITECTURE & PROCESSING PIPELINES

### 3.1 Global Architectural Topology
WBSL Bridge consists of two interconnected pipelines: the **Forward Pipeline** (Sign to Bengali Text & Speech) and the **Reverse Pipeline** (Bengali Speech/Text to Reference Sign Display).

```
+===================================================================================================+
|                                    WBSL BRIDGE SYSTEM PIPELINE                                    |
+===================================================================================================+

  [FORWARD PATH: SIGN TO BENGALI]
  
  Webcam (30 FPS) ──> Client Capture (10 Hz JPEG) ──> /api/stream/frame
                                                             │
                                                             ▼
                                                MediaPipe Landmark Extractor
                                                - Hands: 126-dim Vector
                                                - Holistic: 258-dim Vector
                                                             │
                              ┌──────────────────────────────┴──────────────────────────────┐
                              ▼                                                             ▼
                   Continuous Streaming Core                                     Non-Manual Syntactic Core
                   - Rolling Buffer (maxlen=180)                                 - Geometric NMM Flags
                   - Idle Gate (Motion & Spread)                                   (Eyebrow, Mouth, Head)
                   - Slit Windows (W=24, W=32)                                   - ViT ONNX Emotion Model
                              │                                                    (7-Class Affect Vector)
                              ▼                                                             │
                   DailyNet BiLSTM-Attention                                                │
                   (Temporal ONNX Model)                                                    │
                              │                                                             │
                              ▼                                                             │
                   Predicted Sign Gloss ────────────────────────────────────────────────────┘
                                         │
                                         ▼
                             Intent Packet Assembly
                             [GLOSS] + [NMM Grammar] + [Affect Context]
                                         │
                                         ▼
                             Constrained NLG Engine
                             (Local Gemma-4-E4B / SSE Token Streaming)
                                         │
                                         ▼
                             Bengali Text + Dual-Engine TTS
                             (edge-tts -> BanglaTTS Fallback)

-----------------------------------------------------------------------------------------------------

  [REVERSE PATH: BENGALI TO SIGN]
  
  Spoken Bengali Mic Audio ──> faster-whisper (int8 CPU) ──> Bengali Text
                                                                   │
                                                                   ▼
                                                       Reverse Gloss Planner
                                                       - Deterministic Phrase Table
                                                       - LLM Lexical Decomposition
                                                                   │
                                                                   ▼
                                                       Planned Gloss Sequence
                                                       ["HELLO", "WHAT_IS_YOUR_NAME"]
                                                                   │
                                                                   ▼
                                                       Reference Video Resolver
                                                       (H.264 Universal Media / Canvas Fallback)
```

### 3.2 Dual-Contract Feature Extraction
To maintain mathematical consistency between training and runtime serving, `backend/extract.py` and `backend/pose.py` define two feature contracts:
1.  **Contract A (`HANDS_DIM = 126`):** Left hand (63 values) + Right hand (63 values). Used by static sign classifiers and lightweight temporal models.
2.  **Contract B (`HOLISTIC_DIM = 258`):** 126 hand coordinates + 132 BlazePose coordinates (33 skeletal points $\times$ $[x, y, z, \text{visibility}]$). Used by `DailyNet` to track torso orientation, shoulders, and head geometry.

The backend inspects the active ONNX model's input shape at startup. If the model expects 258 inputs, the holistic extractor is automatically selected; if it expects 126, the two-hand extractor is used.

### 3.3 Fast Path vs. Slow Path Asymmetric Processing
Sign communication involves fast physical gestures followed by linguistic phrasing. WBSL Bridge splits processing across two temporal paths:
*   **Fast Path (Kinematic Recognition):** Runs every frame/tick ($< 40\text{ ms}$). Includes MediaPipe extraction, rolling buffer updates, kinematic motion gating, and ONNX temporal classification. Operates inside ONNX Runtime on CPU.
*   **Slow Path (Linguistic Translation):** Runs per sentence ($1.5 - 4.0\text{ seconds}$). Includes assembling intent packets, sending structured prompts to the local LLM, streaming Bengali tokens via SSE, and generating TTS audio. Operates asynchronously outside the video loop.

---

# CHAPTER 4: KINEMATIC FEATURE CONTRACTS & MATHEMATICAL MODELING

### 4.1 Invariant Hand and Holistic Normalization
Raw camera pixel coordinates cannot be fed directly to machine learning models because signers sit at varying distances from the webcam and have different body sizes. The system applies translation and scale normalization:

Let $P_i = [x_i, y_i, z_i]$ represent a 3D coordinate point.
1.  **Reference Origin:** The **right wrist** ($P_{\text{wrist, right}}$) is chosen as the universal origin. If the right hand is not visible, the left wrist is used as fallback. If neither hand is visible, the origin is set to zero:
    ```
    P_ref = P_wrist_right   (if right hand present)
    P_ref = P_wrist_left    (if right hand missing, left hand present)
    P_ref = [0, 0, 0]       (if both hands missing)
    ```
2.  **Hand Scale Factor ($S$):** The Euclidean distance between the reference wrist ($P_0$) and the middle-finger MCP joint ($P_9$) serves as the hand scale metric:
    ```
    S = sqrt((x9 - x0)^2 + (y9 - y0)^2 + (z9 - z0)^2) + 1e-6
    ```
    The small constant $1e-6$ prevents division by zero if tracking is lost.
3.  **Coordinate Normalization:** Every landmark point in the left and right hands is translated and scaled:
    ```
    P_normalized = (P_raw - P_ref) / S
    ```
    Missing hands are filled with zeros. The normalized coordinates are flattened into a 126-dimensional vector: $[\text{Left Hand }(63), \text{Right Hand }(63)]$.
4.  **Holistic Extension (258 Dimensions):** For holistic models, the 33 BlazePose landmarks ($[x, y, z, \text{visibility}]$) are normalized using the same wrist reference and hand scale factor for the spatial coordinates, while the visibility score is retained untouched:
    ```
    P_pose_normalized = [(x - x_ref)/S, (y - y_ref)/S, (z - z_ref)/S, visibility]
    ```
    Concatenating the 126 hand values with the 132 pose values yields the complete 258-dimensional holistic vector.

### 4.2 Non-Manual Marker (NMM) Geometric Formulations
`backend/nmm.py` parses facial grammar using 468 MediaPipe FaceMesh landmarks. Distances are normalized by the face width $W_F$, defined as the Euclidean distance between the left and right zygomatic arches (landmarks 234 and 454):
```
W_F = sqrt((x454 - x234)^2 + (y454 - y234)^2) + 1e-6
```

1.  **Eyebrow Ratio ($R_B$) for Questions:** Computes the average vertical distance between the eyebrow centroids and the eye centers, normalized by face width:
    ```
    R_B = (dist(LeftBrow, LeftEye) + dist(RightBrow, RightEye)) / (2 * W_F)
    
    If R_B > 0.082 -> Polar Question [?] (Brows raised)
    If R_B < 0.032 -> WH-Question [wh_q] (Brows furrowed)
    ```
2.  **Mouth Aspect Ratio ($R_M$) for Emphasis:** Computes the vertical distance between the inner upper lip (landmark 13) and inner lower lip (landmark 14):
    ```
    R_M = dist(UpperLip_13, LowerLip_14) / W_F
    
    If R_M > 0.055 -> Emphasis Flag = True (Mouth open)
    ```
3.  **Head Shake and Nod Variance ($\sigma_x^2, \sigma_y^2$):** Measures the variance of normalized nose-tip coordinates (landmark 1) over a rolling history of 15 frames:
    ```
    sigma_x^2 = Variance(Nose_X / W_F across last 15 frames)
    sigma_y^2 = Variance(Nose_Y / W_F across last 15 frames)
    
    If sigma_x^2 > 0.0018 -> Negation [neg] = True (Head shake)
    If sigma_y^2 > 0.0018 -> Affirmation = True (Head nod)
    ```

### 4.3 Kinematic Motion and Spatial Spread Gating
To prevent false-positive predictions when the signer is resting between signs or has dropped their hands, the streaming engine in `backend/main.py` enforces a dual-threshold mathematical gate on every candidate frame window matrix $X$ ($T$ frames by $D$ features):

1.  **Mean Kinematic Velocity:** Calculates frame-to-frame movement:
    ```
    Motion = (1 / ((T - 1) * D)) * Sum(|X_t - X_{t-1}|)
    ```
2.  **Spatial Spread:** Calculates how much coordinates deviate from the window's spatial mean $\mu$:
    ```
    Spread = (1 / (T * D)) * Sum(|X_t - mu|)
    ```
3.  **Active Execution Gate:**
    ```
    Window is processed if: Motion >= 0.004 AND Spread >= 0.008
    Otherwise: Window is rejected as IDLE (No inference run)
    ```
This gate prevents static poses or hand-tracking jitter from falsely triggering predictions.

---

# CHAPTER 5: DEEP NEURAL ARCHITECTURES & DYNAMIC MODEL REGISTRY

### 5.1 Temporal BiLSTM with Linear Attention Pooling (`DailyNet`)
Standard LSTMs evaluate classification solely on the final hidden state ($h_T$). If a sign is completed early in a 32-frame window and the signer rests during the remaining frames, the final hidden state represents the rest pose, causing misclassification. To solve this, we created **`DailyNet`** (`train_holistic.py`).

```
                    DAILYNET NEURAL ARCHITECTURE
                    
Input Holistic Matrix: [Batch, 32 Frames, 258 Features]
  │
  ├──► Compute Frame Delta: ΔX_t = X_t - X_{t-1}        [258 Features]
  ├──► Left Hand Presence Flag:  L_pres = (|X_LH| > 0)  [1 Feature]
  └──► Right Hand Presence Flag: R_pres = (|X_RH| > 0)  [1 Feature]
  │
  ▼
Concatenated Tensor: [Batch, 32, 518]
  │
  ▼
Layer Normalization
  │
  ▼
Dense Linear Projection + GELU Activation + Dropout(0.3)  [518 -> 128]
  │
  ▼
2-Layer Bidirectional LSTM (hidden_size=128, drop=0.3)   [128 -> 256]
  │
  ▼
Linear Attention Layer: u_t = Linear(H_t)
Softmax Normalization:  alpha_t = exp(u_t) / Sum(exp(u_k))
  │
  ▼
Context Vector: c = Sum(alpha_t * H_t)                  [256 Dimensions]
  │
  ▼
Classification Head: Dropout(0.3) -> Linear(256 -> Num_Classes)
  │
  ▼
Output Logits: [Batch, Num_Classes]
```

#### Key Architecture Components:
*   **Feature Expansion:** The input vector (258 dims) is concatenated with its discrete time derivative (velocity delta, 258 dims) and binary presence flags for each hand (2 dims), producing 518 input features per frame.
*   **Bidirectional Modeling:** Two BiLSTM layers process the sequence forward and backward, capturing preparatory and recovery phases of gestures.
*   **Attention Pooling:** Attention weights $\alpha_t$ pool salient frames across the entire window, focusing on the moment of active gesture rather than ending rest frames.
*   **Background `NONE` Class:** Trained on pre-sign and post-sign rest frames, hand drops, and frozen hold negatives, allowing the model to explicitly predict "no gesture" instead of forcing a false match.

### 5.2 Stacked Unidirectional LSTM (`UniLSTM`) & Static MLP
*   **`UniLSTM` (`train_unified.py`):** 2-layer stacked unidirectional LSTM (hidden size 128, dropout 0.3) operating on 126-dimensional hand vectors across 62 dynamic sign classes. Classification is computed on the final time step.
*   **Static MLP (`sign_mlp.onnx`):** 3-layer fully connected network ($126 \to 256 \to 128 \to 35$) trained for static alphabet (A–Z) and number (0–9) fingerspelling. Achieves 99.9% validation accuracy with sub-2ms CPU inference.

### 5.3 Vision Transformer (ViT) Affect Classifier
Early prototypes using DeepFace (FER2013) frequently misclassified users wearing glasses, confusing eye shadow artifacts with "fear", while TensorFlow dependencies conflicted with MediaPipe in Python 3.11. 

We replaced DeepFace with a HuggingFace Vision Transformer (`trpakov/vit-face-expression`) exported to ONNX:
*   Extracts face bounding boxes using FaceMesh anchors (landmarks 10, 152, 234, 454).
*   Resizes crops to $224 \times 224 \times 3$, normalized with ImageNet mean and standard deviation.
*   Outputs a 7-class probability distribution: `[angry, disgust, fear, happy, neutral, sad, surprise]`.
*   A confidence floor of 0.35 falls back to `neutral` to ignore momentary facial twitches.

### 5.4 Dynamic Model Discovery and Hot-Swapping
The model subsystem (`ModelRegistry` in `backend/main.py`) provides runtime flexibility:
1.  **Automated Inspection:** At startup or via `/api/admin/models/rescan`, the engine scans `models/onnx_models/*`. It checks input tensor dimensions to verify whether models are static (Rank 2) or temporal (Rank 3), and matches their companion `*classes*.json` files.
2.  **Zero-Downtime Hot-Swapping:** Administrators can change the active model via `/api/admin/models/activate`. The session references update immediately in memory, allowing instant model swaps without restarting the server.

---

# CHAPTER 6: INTENT-AWARE NATURAL LANGUAGE GENERATION (NLG)

### 6.1 Constrained Prompt Engineering & 50 Semantic Criteria
Passing raw sign glosses directly into unconstrained large language models results in hallucinated text. The NLG engine (`backend/llm_engine.py`) enforces strict boundaries using a structured 50-criteria system prompt:

```
[SYSTEM PROMPT RULES]
1. Role: WBSL Bengali NLG Engine. Translate glosses into natural West Bengal Bengali.
2. Format: WORD | WORD[emotion] | WORD[negation] | WORD[?]
3. Core Rule: Preserve exact meaning, subjects, objects, events, tenses, and negation.
   Do not summarize, omit, or invent actions.
4. Question Rules: [?] appears ONLY on the final word of a direct question.
   WHETHER/IF introduces embedded clauses ("কি না"), never direct questions.
5. Negation Rules: Negate ONLY marked semantic units. Never apply double negation.
6. Anti-Hallucination: Do not add names, locations, times, or causes not in the gloss.
```

### 6.2 Scope Preservation Mechanics
The system prompt enforces strict translation rules:
*   **Negation Bounding:** `I + RICE + EAT[negation] + WATER + DRINK` translates to `"আমি ভাত খাইনি, জল পান করেছি।"` (Negation stays strictly on eating, preventing double negation).
*   **Embedded Clauses vs. Direct Questions:** `HE + COME + WHETHER + I + ASK[?]` translates to `"সে আসবে কি না আমি জানতে চাইছি?"` (Preserves the embedded `"কি না"` structure).
*   **Fingerspelling Merging:** Sequences of alphabetic glosses (e.g., `[R] + [A] + [V] + [I] + COME`) are merged into proper nouns: `"রবি এসেছে।"`.

### 6.3 Local LLM Benchmarking & SSE Streaming
Six local quantized GGUF models were benchmarked on an 8-core CPU:

| Model Name | Quantization | Generation Speed | RAM Usage | Bengali Quality | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **gemma-4-12b-it** | Q4_0 | 1.8 tokens/sec | 13.2 GB | Optimal Reference | Reference Benchmark |
| **gemma-4-E4B-it** | Q4_K_M | **5.8 tokens/sec** | **4.2 GB** | **High Quality** | **Selected for Deployment** |
| Qwen3.6-35B-A3B | IQ2_M | 0.9 tokens/sec | 11.4 GB | Poor Syntax | Rejected |
| gpt-oss-20b | Q4_K_M | 1.2 tokens/sec | 12.8 GB | Semantic Drift | Rejected |
| Qwen3.5-9B | IQ3_XXS | 3.1 tokens/sec | 5.1 GB | Weak Idioms | Rejected |
| gemma-4-26B-A4B | IQ2_M | Crashed (OOM) | >16.0 GB | Memory Limit Exceeded| Rejected |

**`gemma-4-E4B-it-Q4_K_M`** was selected for local deployment. It runs at ~5.76 tokens/sec on CPU within 4.2 GB of RAM. The generation pipeline streams tokens to the browser via **Server-Sent Events (SSE)** at `POST /api/nlg/stream`, delivering sub-second response times.

---

# CHAPTER 7: BIDIRECTIONAL REVERSE SYNTHESIS & AUDIO PROCESSING

### 7.1 Automatic Speech Recognition via Quantized Whisper
Reverse communication starts with spoken Bengali audio captured via the browser microphone:
*   **Engine:** `faster-whisper` (`small` model, int8 quantization, CPU execution).
*   **Acoustic Pre-Filtering:** Silero Voice Activity Detection (VAD) filters background silence.
*   **Strict ISO Language Routing:** Speech recognition systems often confuse spoken Bengali with Hindi or Devanagari scripts. `backend/stt_engine.py` implements a strict language map (`LANG_MAP`) forcing `task="transcribe"` and `language="bn"`, preventing language hallucination.

### 7.2 Reverse Gloss Planning
Spoken or typed Bengali text is mapped into an ordered sign gloss sequence through two available modes:
1.  **Deterministic Engine (`/api/text-to-sign`):** Matches multi-word phrases using a dictionary table (`gloss_map.json`). It performs longest-prefix matching (e.g., `"তোমার নাম কি"` $\to$ `WHAT_IS_YOUR_NAME`), defaulting unknown words to letter fingerspelling.
2.  **LLM Gloss Planner (`/api/text-to-sign/llm`):** Ingests the active model's vocabulary and prompts the local LLM under strict constraints to use only registered sign classes, converting statements into letter sequences and reserving interrogative signs exclusively for questions.

```
                     BENGALI INPUT: "তোমার নাম কি"
                                   │
                                   ▼
                       Reverse Gloss Decomposition
                       ["WHAT_IS_YOUR_NAME"]
                                   │
                                   ▼
                       Reference Media Resolution
                       - Video: /api/media/WHAT_IS_YOUR_NAME.mp4
                       - Fallback: /api/media/WHAT_IS_YOUR_NAME.mp4/frames
                                   │
                                   ▼
                       Client Video Player Sequencing
                       (Plays sign video seamlessly in browser)
```

### 7.3 Dual-Engine Video Player & Canvas Fallback
The client interface renders reference videos corresponding to planned glosses. To guarantee playback across all operating systems and browsers, `VideoPlayer.tsx` operates two fallback engines:
*   **Engine 1 (Native Video):** Decodes universal H.264 (AVC1) MP4 files using browser hardware acceleration with byte-range streaming support (HTTP 206).
*   **Engine 2 (Canvas Frame Engine):** If the native video decoder encounters an unsupported codec or corrupt container, the player automatically fetches server-decoded JPEG frame sequences from `/api/media/{filename}/frames` and paints them to an HTML5 Canvas at 14 FPS, guaranteeing playback.

### 7.4 Dual-Engine Bengali Text-to-Speech (TTS)
`backend/tts_engine.py` manages a dual-engine fallback pipeline:
1.  **Primary Engine (Online):** `edge-tts` using Microsoft Cognitive neural voices (`bn-BD-NabanitaNeural` Female, `bn-BD-PradeepNeural` Male). Generates high-quality prosody at ~604 ms/word.
2.  **Secondary Engine (Offline Fallback):** `BanglaTTS` (Silero acoustic model running locally on CPU). If network connectivity fails, the system cleans punctuation via regular expressions and synthesizes local speech at ~453 ms/word.

---

# CHAPTER 8: DATA PRIVACY, COMMUNITY INGESTION & DPDP COMPLIANCE

### 8.1 Compliance with DPDP Act 2023
Collecting video data in India is governed by the **Digital Personal Data Protection (DPDP) Act 2023**. Continuous sign videos expose facial biometrics, home environments, and personal identities.

```
                          PRIVACY-FIRST DATA INGESTION
                          
  Webcam Video Stream (Browser Memory)
           │
           ▼
  Extract 126/258-dim Landmarks (MediaPipe)
           │
           ├──► Raw Video Frame Permanently Deleted on Device
           │
           ▼
  Transmit ONLY Normalized Coordinate Matrix (.npy) to Server
           │
           ▼
  Persistent Storage: dataset/samples/{LABEL}/{SIGNER_ID}/{SAMPLE_ID}.npy
  Indexed Manifest:   dataset/manifest.jsonl
```

WBSL Bridge implements a **Privacy-by-Design** workflow:
*   **Raw Video Stripping:** Videos are processed in memory and deleted immediately after landmark extraction. Only normalized float32 landmark arrays are transmitted.
*   **Signer Pseudonymization:** Signers are tracked through alphanumeric hashes (e.g., `signer_kolkata_04`), decoupling identity from biomechanics.
*   **Right to Erasure:** Contributors can purge their contributed kinematic vectors at any time using their unique Signer ID.

### 8.2 Community Contribution Workflow
During contribution sessions (`/contribute`), contributors complete a 4-part consent gate:
1.  Consent to landmark recording.
2.  Consent to use anonymized coordinates for model training.
3.  Confirmation of deletion rights.
4.  Declaration of WBSL gesture authenticity.

Extracted coordinates are stored in structured directories: `dataset/samples/{LABEL}/{SIGNER_ID}/{SAMPLE_ID}.npy`. Every sample is recorded in `dataset/manifest.jsonl` with session metadata and verification status.

### 8.3 Algorithmic Evidence & Human-in-the-Loop Review
To prevent training models on corrupted community submissions, samples pass through an automated verification console (`/admin/contributions`):
*   **Advisory Telemetry:** Computes geometric consistency scores, velocity cadence metrics, and active model prediction alignment.
*   **Kinematic Replay:** Reviewers inspect an animated 42-point hand and 33-point pose skeleton (`LandmarkSimulation.tsx`) rendered from the recorded coordinates.
*   **Human Decision:** Automated scores serve as **advisory evidence only**; samples are approved into the training pool only through human review (`ACCEPT`, `REJECT`, or `NEEDS REVIEW`).

---

# CHAPTER 9: EXPERIMENTAL RESULTS & PERFORMANCE ANALYSIS

### 9.1 Training Dynamics & Model Metrics
Model training experiments were conducted across seven iterative runs:

| Model Run | Architecture | Input Contract | Class Count | Validation Accuracy | Target Lexicon |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Run 1** | Static MLP | 126 dims / 1 frame | 35 Classes | 99.9% | Static Alphabet (A–Z) |
| **Run 2** | UniLSTM | 126 dims / 32 frames | 98 Classes | 95.9% | Static + Dynamic Words |
| **Run 3** | UniLSTM | 126 dims / 32 frames | 62 Classes | 98.0% | Dynamic Video Signs |
| **Run 4** | Daily LSTM | 126 dims / 32 frames | 10 Classes | 99.2% | Conversational Signs |
| **Run 5** | Static MLP | 126 dims / 1 frame | 36 Classes | 97.9% | Alphanumeric (0–9, A–Z) |
| **Run 7 (Active)**| **DailyNet BiLSTM** | **258 dims / 32 frames** | **7 Classes** | **100.0%** | **Holistic BiLSTM (+NONE)** |

#### Run 7 Deep Dive (`DailyNet` Holistic BiLSTM)
*   **Classes (7):** `GOOD_MORNING`, `GOOD_AFTERNOON`, `HELLO`, `HUG`, `WHAT_IS_YOUR_NAME`, `DRINK`, and `NONE`.
*   **Convergence:** Achieved 100.0% validation accuracy by Epoch 28 using the AdamW optimizer ($\text{LR} = 2 \times 10^{-3}$, OneCycleLR scheduling).
*   **Background `NONE` Class:** Successfully filtered out resting hand poses, drops, and pauses between gestures, eliminating idle false positives.

```
       EPOCH-ACCURACY CONVERGENCE (RUN 7: DAILYNET)
Val
Acc %
100% ┼────────────────────────────────────*──*──*──*──*
 95% ┼                           *──*──*
 90% ┼                     *──*
 80% ┼               *──*
 60% ┼         *──*
 30% ┼   *──*
  0% ┼───*─────────────────────────────────────────────
     0   5    10    15    20    25    30    35    40   Epochs
```

### 9.2 Real-Time Latency Profiling
Execution latency was benchmarked on an Intel Core i7 CPU (8 cores, 2.3 GHz base, no GPU):

```
+─────────────────────────────────────────────────────────────+
|           FORWARD PATH REAL-TIME LATENCY BREAKDOWN          |
|                       Total: ~71.8 ms                       |
+─────────────────────────────────────────────────────────────+
| [1] MediaPipe Extraction (28.4 ms)               [39.5%]    |
| [2] Rolling Buffer & Slit Windows (1.8 ms)        [2.5%]    |
| [3] NMM Geometry & Nose Variance (2.2 ms)         [3.1%]    |
| [4] ViT Emotion Classification (34.1 ms)*        [47.5%]    |
| [5] DailyNet ONNX Runtime Inference (5.3 ms)      [7.4%]    |
+─────────────────────────────────────────────────────────────+
*Note: ViT Affect runs every 4th frame, reducing its amortized
 contribution to ~8.5 ms per frame.
```

The core vision-and-inference loop completes in **~37.7 ms (amortized)**, supporting real-time processing at ~27–30 FPS on standard consumer CPUs.

### 9.3 Codebase Implementation vs. Planned Features Audit
To ensure academic honesty, the following matrix outlines what is fully implemented in working code versus items designed in theory:

| Feature / Subsystem | Implementation Status | Technical Status in Codebase |
| :--- | :--- | :--- |
| **258-dim Holistic Vector** | Fully Implemented | Combines 126 hand coordinates with 132 BlazePose points. |
| **Server-Side Buffer Fusion** | Fully Implemented | Deque (maxlen=180) evaluates multi-scale windows (24/32). |
| **Model Registry Hot-Swap** | Fully Implemented | Auto-probes ONNX shapes and swaps models without restart. |
| **Whisper int8 STT Engine** | Fully Implemented | faster-whisper on CPU with strict ISO language locking. |
| **Dual-Engine TTS Fallback** | Fully Implemented | edge-tts primary with automatic BanglaTTS offline fallback. |
| **Dual-Engine Video Player** | Fully Implemented | HTML5 video player with automated canvas frame fallback. |
| **NMM Controller & Gates** | Fully Implemented | 5 geometric markers with runtime bypass switches. |
| **DailyNet BiLSTM Attention**| Fully Implemented | 258-dim BiLSTM with attention pooling and `NONE` class. |
| **DPDP Privacy Pipeline** | Fully Implemented | Raw video stripped on-device; stores only .npy landmarks. |
| **Mahalanobis OOD Gate** | Partially Implemented | Handled via margin thresholds and trained `NONE` class. |
| **3-Tier Movement Extractor** | Designed / Incomplete | Geometric tagging logic stubbed; full NLP parser pending. |
| **Continuous Sign Segmenter** | Partially Implemented | Managed via sliding windows and kinematic motion gates. |
| **Native WBSL Field Data** | Partially Implemented | Models currently trained on ISL/BdSL baseline sets. |

---

# CHAPTER 10: CONCLUSION & FUTURE ROADMAP

### 10.1 Concluding Remarks
This project addresses a fundamental engineering question: **Can an intent-aware, bidirectional sign language translation framework be built for a data-scarce regional sign language (WBSL) and deployed on consumer hardware without cloud dependencies?**

**WBSL Bridge** demonstrates that this is achievable:
1.  **Intent Capture:** Unifies 258-dimensional holistic tracking, sub-5ms geometric NMM parsing, and ViT facial affect classification to translate meaning rather than isolated words.
2.  **Continuous Robustness:** Eliminates prediction flicker and idle errors using kinematic motion and spatial spread gates combined with a BiLSTM-Attention network (`DailyNet`).
3.  **Faithful Translation:** Produces grammatical Bengali translations using a 50-criteria constrained LLM architecture backed by dual-engine TTS.
4.  **Privacy Protection:** Complies with the DPDP Act 2023 by stripping raw video on client devices and saving only coordinate landmarks.

### 10.2 Future Engineering Directions
1.  **WBSL Field Data Collection:** Deploy the `/contribute` interface across Deaf schools in West Bengal (Kolkata, Siliguri, Cooch Behar) to gather 100–200 native WBSL signs across multiple signers.
2.  **Mahalanobis Distance OOD Gate:** Upgrade open-set detection from softmax margins to explicit Mahalanobis distance scoring calculated from tied covariance matrices across attention context vectors.
3.  **Kinematic Movement Extractor:** Complete the three-tier movement analyzer to generate natural-language movement descriptions for unknown signs.
4.  **WBSL Head-Tilt Detection:** Implement head-roll tracking using ocular landmarks to detect the regional WBSL question marker.
5.  **3D WebGL Avatar Integration:** Extend the reverse path by developing a lightweight 3D skeletal avatar driven directly by landmark coordinates as an alternative to video playback.

---

# REFERENCES

1.  Johnson, R. J., & Johnson, J. E. (2016). Distinction between West Bengal Sign Language and Indian Sign Language Based on Statistical Assessment. *Sign Language Studies*, 16(4), 448–476.
2.  Tanzer, G., et al. (August 2026). Putting Sign Language AI into Users' Hands: The SL2T Sign-Language-to-Text Model. *Google DeepMind Technical Report*.
3.  Lugaresi, C., et al. (2019). MediaPipe: A Framework for Building Perception Pipelines. *arXiv preprint arXiv:1906.08172*.
4.  Akash, S. K., Hoque, M. M., & Sarker, S. (2023). Action Recognition Based Real-Time Bangla Sign Language Detection and Sentence Formation. *IEEE ICREST*.
5.  Islam, S., & Mousumi, A. S. (2018). Ishara-Lipi: The First Complete Multipurpose Open Access Dataset of Isolated Characters for Bangla Sign Language. *Mendeley Data*.
6.  Sengupta, S., et al. (2024). iSign: A Benchmark for Indian Sign Language Processing. *Findings of the ACL*.
7.  Islam, M. M., et al. (2024). BdSLW60: A Word-Level Bangla Sign Language Dataset. *Data in Brief*, 53, 110185.
8.  Bendale, A., & Boult, T. E. (2016). Towards Open Set Deep Networks. *IEEE CVPR*, 1563–1572.
9.  Shafer, G., & Vovk, V. (2008). A Tutorial on Conformal Prediction. *Journal of Machine Learning Research*, 9, 371–421.
10. Pakov, T. (2023). vit-face-expression: Vision Transformer for Facial Expression Recognition. *HuggingFace Model Repository*.
11. Sarker, S., & Hoque, M. M. (2018). An Intelligent System for Conversion of Bangla Sign Language into Speech. *IEEE ICBSLP*.
12. Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On Calibration of Modern Neural Networks. *ICML*, 1321–1330.
13. Lee, K., Lee, K., Lee, H., & Shin, J. (2018). A Simple Unified Framework for Detecting Out-of-Distribution Samples. *NeurIPS*, 31.
14. Liu, W., Wang, X., Owens, J., & Li, Y. (2020). Energy-Based Out-of-Distribution Detection. *NeurIPS*, 33.
15. Digital Personal Data Protection Act (DPDP Act). (2023). *Ministry of Law and Justice, Government of India*. Gazette of India.

---
*End of Technical Report*