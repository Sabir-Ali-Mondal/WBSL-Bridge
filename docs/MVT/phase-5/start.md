# Phase 5: Unknown Sign Detection & Semantic Interpretation

## The Honesty Layer — Full Engineering Plan

---

## 1. Problem Statement

Every sign language recognition system in published research shares the same fatal flaw: **closed-world assumption**. The model is trained on a fixed vocabulary (e.g., 35 ISL letters, 100 common signs). When a user signs something outside that vocabulary — a regional variant, a compound sign, a fingerspelled word, a sign from a different dialect, or a completely novel gesture — the model does not say "I don't know." It picks the closest known class and outputs it with high confidence.

For a real-world assistive system, this is dangerous. A confidently wrong translation is worse than silence. If a deaf user signs "MEDICINE" and the system outputs "WATER" because the handshape is similar, the consequence is not a minor inconvenience — it is a communication failure that erodes trust entirely.

**Phase 5 exists to solve one problem:** When the recognition model encounters a sign it has never seen, the system must (a) detect that it is unknown, (b) describe what it physically looks like using 3D geometry, (c) reason about what it might mean using linguistic knowledge, and (d) present the result as an honest, uncertainty-flagged candidate — never as a definitive translation.

---

## 2. Why Standard Approaches Fail

Before describing the solution, it is critical to document what we are explicitly rejecting and why.

### 2.1 Rejected: Training a Separate 3D Vision Model

**Idea:** Train a CNN or 3D convolutional network to classify handshape, movement, and location directly from video or depth maps.

**Why rejected:**
- MediaPipe Holistic already provides 3D coordinates (`x, y, z`) for 540 landmarks at 30 FPS. The 3D spatial information is already extracted. Training another model to re-extract it is computationally redundant.
- 3D CNNs require GPU training. This project runs on CPU.
- A separate vision model introduces a second training data requirement: you would need labeled data for handshape categories, movement categories, and location categories independently, which does not exist for WBSL.
- The output of such a model would still need to be interpreted semantically, meaning you would still need the LLM reasoning step anyway.

### 2.2 Rejected: Vision-Language Models (VLMs)

**Idea:** Feed raw video frames to a multimodal LLM like LLaVA, Video-LLaMA, or Qwen-VL and ask it to describe or translate the sign.

**Why rejected:**
- **Privacy violation:** VLMs require raw pixel data. Phase 6 mandates that raw video is discarded on-device before any data leaves the perception module. Sending frames to any model (even local) creates a privacy surface that contradicts the Trust Layer design.
- **Speed:** VLMs are extremely slow on CPU. Processing a 2-second sign clip (60 frames) through a VLM would take minutes, not milliseconds. The target inference budget is under 5 seconds total for the entire unknown-sign pipeline.
- **Fine-grained accuracy:** VLMs are notoriously unreliable at finger-level distinctions. They frequently confuse "index finger extended" with "middle finger extended" and cannot reliably distinguish subtle handshape variations that change meaning entirely in sign language (e.g., the difference between ISL letters "A" and "S" is thumb position — a detail VLMs miss).
- **Hallucination amplification:** VLMs generate fluent-sounding but fabricated descriptions. If the VLM hallucinates "the hand moves upward" when it actually moves downward, the downstream LLM will reason over false evidence and produce a confidently wrong candidate.

### 2.3 Rejected: Feeding Raw Landmark Arrays to the LLM

**Idea:** Pass the raw 126-dimensional numpy array (or sequence of arrays) directly into the LLM prompt as numbers.

**Why rejected:**
- LLMs are fundamentally text-reasoning engines. They do not perform spatial geometry or trigonometry reliably. Asking an LLM to interpret `[0.452, 0.312, -0.003, 0.478, ...]` as "index finger extended, palm facing inward" will produce inconsistent, hallucinated results.
- Token cost: A 60-frame sequence of 126-dim landmarks is 7,560 numbers. At roughly 1-2 tokens per number, this consumes 7,500-15,000 tokens of context just for the raw data, leaving little room for the reasoning prompt and output.
- The Movement Analyzer (Step 5.2) exists specifically to compress these 7,560 numbers into approximately 50-100 tokens of semantic text that the LLM can reason over effectively.

---

## 3. The Five-Step Pipeline

### 3.1 Step 5.1: The OOD (Out-of-Distribution) Gate

**Purpose:** Decide whether a sign is KNOWN or UNKNOWN. This decision is made by the recognition model, not the LLM.

**Input:** The output of the temporal LSTM model (Phase 2.5) for a completed sign sequence.

**Three-Signal Fusion:**

| Signal | Calculation | What It Detects |
|:---|:---|:---|
| **Max Softmax Probability** | The highest class probability from the LSTM's final softmax layer. | If the model's best guess is only 35% confident, it has no strong match. Threshold: < 0.60 flags as unknown. |
| **Mahalanobis Distance** | Distance between the LSTM's penultimate-layer embedding vector and the nearest class centroid (pre-computed from training data). | Even if softmax says 70% for class "A", the embedding might be far from the "A" centroid in feature space, indicating the model is extrapolating. Threshold: distance > 95th percentile of training distribution flags as unknown. |
| **Temporal Consistency** | Standard deviation of the predicted class across the last N frames of the sliding window. | If the model oscillates between "A", "B", and "C" across frames, it is confused. High variance flags as unknown. Threshold: std > 0.4 flags as unknown. |

**Decision Logic:**
- If **any two of three** signals flag the sign as unknown → route to the Unknown Pipeline (Step 5.2).
- If all three signals agree the sign is known → output the recognized gloss normally.
- The 2-of-3 rule prevents a single noisy signal from triggering false unknown detections.

**Calibration:** Thresholds are selected on the validation set by plotting the distribution of each signal for known signs vs. artificially created unknown inputs (e.g., random noise sequences, signs from a held-out class). The thresholds are chosen to achieve < 5% false-unknown rate on known signs and > 90% true-unknown detection rate on held-out signs.

**Output:** A binary flag (`KNOWN` or `UNKNOWN`) plus the three signal values (logged for debugging and future threshold tuning).

---

### 3.2 Step 5.2: The Movement Analyzer (3D Landmark-to-Text Engine)

**Purpose:** Convert raw MediaPipe 3D landmark sequences into a structured, human-readable description of the sign's physical characteristics. This is a **deterministic, rule-based Python module** — no machine learning involved.

**Input:** A numpy array of shape `(T, 146)` where T is the number of frames and 146 = 126 (hands) + 18 (pose) + 2 (NMM). This is the same format produced by the Phase 2.4 recorder.

**Output:** A Python dictionary with five keys: `handshape`, `location`, `movement`, `orientation`, `nmm`. Each value is a structured text string.

#### 3.2.1 Handshape Extraction

**MediaPipe landmarks used:** 21 points per hand (wrist, thumb CMC/MCP/IP/TIP, index MCP/PIP/DIP/TIP, middle MCP/PIP/DIP/TIP, ring MCP/PIP/DIP/TIP, pinky MCP/PIP/DIP/TIP).

**Algorithm:**
1. Calculate the palm center as the mean of wrist, index MCP, middle MCP, ring MCP, and pinky MCP.
2. For each finger, calculate the Euclidean distance in 3D between the fingertip and the palm center.
3. Normalize by the hand size (distance from wrist to middle MCP) to make it scale-invariant.
4. Classify each finger:
   - Normalized distance > 1.8 → **Extended**
   - Normalized distance < 1.0 → **Closed/Curled**
   - 1.0 to 1.8 → **Partially curved**
5. Special case: Thumb-to-index distance < 0.5 × hand size → **Pinch/O-ring**

**Output example:**
```
"Right hand: Index finger extended, middle finger extended, ring finger 
closed, pinky finger closed, thumb extended outward. Left hand: All 
fingers closed into a fist."
```

#### 3.2.2 Location Extraction

**MediaPipe landmarks used:** Wrist (both hands), nose, left shoulder, right shoulder (from pose landmarks).

**Algorithm:**
1. Define three vertical zones relative to the body:
   - **Head/Face zone:** Wrist Y is within ±0.1 of Nose Y.
   - **Chest/Torso zone:** Wrist Y is between Nose Y + 0.1 and Shoulder Y + 0.3.
   - **Waist/Lower zone:** Wrist Y is below Shoulder Y + 0.3.
2. Define three horizontal zones:
   - **Center:** Wrist X is between left shoulder X and right shoulder X.
   - **Ipsilateral:** Wrist X is outside the shoulder on the same side as the hand.
   - **Contralateral:** Wrist X crosses the body midline to the opposite side.
3. Define depth:
   - Compare Wrist Z to Nose Z. Negative Z (closer to camera) = **in front of body**. Positive Z = **at or behind body plane**.
4. Report start location (frame 0-5 average) and end location (last 5 frames average) separately.

**Output example:**
```
"Dominant (right) hand: Starts at chest level, center of body. Ends at 
chin level, slightly right of center. Non-dominant (left) hand: Static 
at waist level, left side."
```

#### 3.2.3 Movement Extraction

**MediaPipe landmarks used:** Wrist trajectory (both hands) across all T frames.

**Algorithm:**
1. Calculate frame-to-frame displacement vectors for the dominant wrist: `dx, dy, dz` for each consecutive frame pair.
2. Calculate total displacement: Euclidean distance from first frame wrist position to last frame wrist position.
3. Calculate path length: Sum of all frame-to-frame displacements.
4. **Straightness ratio:** Total displacement / Path length.
   - Ratio > 0.85 → **Straight line movement**
   - Ratio < 0.4 → **Circular or complex path**
   - Ratio 0.4-0.85 → **Curved or arc movement**
5. **Direction:** If straight, classify by dominant axis:
   - |dx| dominant → **Horizontal** (left/right based on sign)
   - |dy| dominant → **Vertical** (up/down based on sign)
   - |dz| dominant → **Forward/backward**
6. **Repetition detection:** Apply a simple peak-counting algorithm on the dominant axis displacement. If the wrist reverses direction more than twice → **Repeated/oscillating movement**.
7. **Speed:** Path length / duration in seconds. Classify as slow (< 0.3 m/s equivalent), medium, or fast (> 0.8 m/s).
8. **Static detection:** If path length < 0.05 × hand size → **Stationary/hold**.

**Output example:**
```
"Dominant hand movement: Repeated circular motion at medium speed. 
Path is closed (start and end positions are close). Non-dominant hand: 
Completely stationary."
```

#### 3.2.4 Orientation Extraction

**MediaPipe landmarks used:** Wrist, index MCP, pinky MCP (both hands).

**Algorithm:**
1. Construct two vectors on the palm surface:
   - `v1` = Index MCP - Wrist
   - `v2` = Pinky MCP - Wrist
2. Calculate the palm normal vector: `n = v1 × v2` (cross product).
3. Normalize `n` to unit length.
4. Classify by the dominant component of `n`:
   - `n.z` strongly negative → **Palm faces camera (outward)**
   - `n.z` strongly positive → **Palm faces away from camera (inward/back)**
   - `n.y` strongly negative → **Palm faces up**
   - `n.y` strongly positive → **Palm faces down**
   - `n.x` strongly negative/positive → **Palm faces left/right**
5. Report for both start and end frames (orientation may change during the sign).

**Output example:**
```
"Right palm orientation: Starts facing inward toward the body, rotates 
to face upward by the end of the sign."
```

#### 3.2.5 Non-Manual Marker (NMM) Extraction

**MediaPipe landmarks used:** Face mesh eyebrow points, lip points, nose tip, shoulder points (from pose).

**Algorithm:**
1. **Eyebrow raise:** Calculate the vertical distance between the midpoint of each eyebrow and the midpoint of the corresponding eye. Compare to a baseline (neutral face from the first 10 frames or a calibrated default). If distance increases > 20% from baseline → **Eyebrows raised**. If decreases > 15% → **Eyebrows furrowed**.
2. **Mouth openness:** Calculate the vertical distance between upper lip and lower lip landmarks. Normalize by face height. If ratio > 0.15 → **Mouth open**. If ratio < 0.05 → **Mouth closed/pursed**.
3. **Head tilt:** Calculate the angle of the line connecting left shoulder to right shoulder relative to horizontal. If angle > 10° → **Head tilted left/right**.
4. **Head nod/shake:** Track the nose tip X (for shake) and Y (for nod) across frames. If oscillation amplitude exceeds threshold → **Head shaking** or **Head nodding**.

**Output example:**
```
"NMM: Eyebrows raised throughout the sign. Mouth slightly open. Head 
tilted 12 degrees to the right. No head shake or nod detected."
```

---

### 3.3 Step 5.3: Hybrid Reasoning (Evidence Grounding + LLM)

**Purpose:** Ground the LLM's reasoning in empirical data so it does not hallucinate freely. The LLM reasons over evidence, never over raw landmarks.

**Two-stage process:**

#### Stage A: Vector Similarity Search

1. Compute a fixed-length summary embedding for the unknown sign sequence. Options:
   - Mean-pool the LSTM's penultimate-layer activations across all frames.
   - Or compute a handcrafted feature vector: [mean hand distance, max velocity, dominant movement axis, final hand height, palm orientation code, NMM flags] → 20-30 dimensional vector.
2. Compare this embedding against the centroid embeddings of all known classes in `dataset_landmarks/` using Cosine Similarity and Mahalanobis Distance.
3. Retrieve the top 3 closest known signs with their similarity scores.

**Why this matters:** If the unknown sign is 72% similar to "THINK" and 65% similar to "KNOW", the LLM should know this. It anchors the LLM's reasoning in the nearest known phonological neighborhood. The LLM can then reason: "The sign is similar to THINK but has a circular motion instead of a tap — in WBSL, circular modification of a cognitive sign often indicates confusion or wondering."

#### Stage B: Prompt Construction

Combine all evidence into a single structured prompt:

```text
SYSTEM: You are a West Bengal Sign Language (WBSL) linguist. A sign has 
been flagged as UNKNOWN by the recognition model (confidence: 12%). 
Your task is to propose the top 3 most likely meanings based on the 
physical description and similarity to known signs. You must reason 
from sign language phonology (handshape, movement, location, 
orientation, NMM). Never guess randomly. If the evidence is 
insufficient, say so.

[CLOSEST KNOWN SIGNS (by embedding similarity)]
1. THINK — 72% similarity
2. KNOW — 65% similarity  
3. CONFUSED — 41% similarity

[3D PHYSICAL DESCRIPTION]
Handshape: Right hand — index finger extended, all other fingers 
closed. Left hand — stationary fist at waist.
Location: Right hand starts at right temple, moves downward to chin 
level.
Movement: Single downward arc, medium speed, no repetition.
Orientation: Palm faces left (inward toward face).
NMM: Eyebrows raised, mouth slightly open, head tilted 10° right.
Duration: 1.2 seconds.

[CONTEXT (previous signs in this sentence)]
"YOU", "TOMORROW", "EXAM"

[OUTPUT FORMAT — follow exactly]
1. Candidate: [MEANING] | Confidence: [High/Medium/Low] | 
   Reasoning: [2-3 sentences linking specific physical features to 
   the proposed meaning using WBSL/ISL phonological knowledge]
2. Candidate: ...
3. Candidate: ...

If you cannot propose any reasonable candidate, output:
"CANDIDATE: INSUFFICIENT EVIDENCE | The physical features do not 
match any known WBSL phonological pattern in my knowledge."
```

---

### 3.4 Step 5.4: Candidate Output & UI Presentation

**Purpose:** Present the LLM's output honestly to the user.

**Rules:**
- The output is always labeled **"Candidate Semantic Interpretation"** — never "Translation", "Prediction", or "Meaning".
- The UI displays a persistent yellow/amber banner: **"⚠️ This sign is not in the recognized vocabulary. The following are unconfirmed guesses based on movement analysis."**
- Each candidate includes its confidence level and reasoning, so the user (or a hearing interlocutor) can evaluate plausibility.
- If the LLM outputs "INSUFFICIENT EVIDENCE", the UI displays: **"This sign could not be interpreted. Please try rephrasing or fingerspelling."**
- The user is offered a feedback button: **"Was any candidate correct?"** with options to select one or say "None". This feedback is saved to the Unknown Queue.

---

### 3.5 Step 5.5: The Unknown Queue

**Purpose:** Every unknown sign is a learning opportunity. The queue collects data for future vocabulary expansion.

**What is saved:**
- The raw landmark sequence (126-dim hands + 18-dim pose + 2-dim NMM, T frames).
- The Movement Analyzer output (structured text features).
- The LSTM's softmax distribution and embedding vector.
- The OOD Gate signal values.
- The LLM's candidate guesses.
- The user's feedback (if provided).
- Timestamp and session metadata.

**What is NOT saved:**
- Raw video frames (discarded on-device per Phase 6 privacy rule).
- Any personally identifiable information.

**Storage:** Local directory `unknown_signs_queue/` with one JSON file per unknown sign event.

**Future use:** When the queue accumulates enough samples (e.g., 20+ instances of the same unknown sign pattern), they can be:
- Submitted to the Phase 6 Community Verification pipeline for human labeling.
- Clustered automatically to discover new sign categories.
- Used to retrain the LSTM with expanded vocabulary.

---

## 4. End-to-End Example Walkthrough

**Scenario:** A user signs the WBSL sign for "DIFFICULT" (which is not in the 35-letter training vocabulary).

1. **MediaPipe** extracts 45 frames of 146-dim landmarks.
2. **LSTM** processes the sequence. Softmax output: THINK=38%, KNOW=22%, SLOW=15%, all others <5%. Max probability = 38%.
3. **OOD Gate:**
   - Max softmax = 0.38 → below 0.60 threshold → **FLAG UNKNOWN**
   - Mahalanobis distance = 4.2σ → above 95th percentile → **FLAG UNKNOWN**
   - Temporal consistency std = 0.31 → below 0.40 threshold → **FLAG KNOWN**
   - 2-of-3 signals say unknown → **ROUTE TO UNKNOWN PIPELINE**
4. **Movement Analyzer** processes the 45 frames:
   - Handshape: "Right hand: all fingers extended and spread, thumb extended. Left hand: flat palm facing up."
   - Location: "Right hand starts at chest level, moves upward to chin level."
   - Movement: "Upward straight-line movement with a sharp stop at the end. Medium speed."
   - Orientation: "Right palm faces left (inward)."
   - NMM: "Eyebrows furrowed, mouth pressed tight, slight head shake."
5. **Vector Search** finds closest known signs: THINK (52%), HARD/SOLID (48%), STOP (31%).
6. **LLM Prompt** is constructed with all the above evidence plus context (previous signs: "THIS", "WORK").
7. **LLM Output:**
   > 1. Candidate: **DIFFICULT / HARD** | Confidence: High | Reasoning: Upward movement with sharp stop + furrowed eyebrows + tight mouth is a common phonological pattern for difficulty/effort concepts in ISL-family languages. The two-hand configuration (active hand moving upward over passive flat palm) matches the known ISL sign for DIFFICULT.
   > 2. Candidate: **HEAVY / BURDEN** | Confidence: Medium | Reasoning: Upward effort movement with tense facial expression could indicate physical heaviness, but location (chest-to-chin rather than waist-to-chest) makes this less likely.
   > 3. Candidate: **PROBLEM / OBSTACLE** | Confidence: Low | Reasoning: Sharp stop + head shake could indicate encountering an obstacle, but the handshape (all fingers spread) is less typical for this concept.
8. **UI** displays the candidates with the amber warning banner.
9. **User** clicks "Candidate 1 was correct." This feedback is saved.
10. **Unknown Queue** saves the landmark sequence + features + feedback for future community verification (Phase 6).

---

## 5. Text-Based Architecture Diagram (Unknown Sign Pipeline Only)

```text
================================================================================
              PHASE 5: UNKNOWN SIGN DETECTION & INTERPRETATION
                         (The Honesty Layer)
================================================================================

  FROM PHASE 2.5 (LSTM INFERENCE)
  ┌─────────────────────────────────────────────────────────────────────┐
  │  Input: Completed sign sequence (T frames × 146-dim landmarks)     │
  │  LSTM Output: Softmax distribution + penultimate-layer embedding   │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │  STEP 5.1: OOD GATE (Out-of-Distribution Detection)               │
  │                                                                     │
  │  Signal 1: Max Softmax Probability ──── threshold < 0.60 ──┐      │
  │  Signal 2: Mahalanobis Distance ────── threshold > 95th % ──┤      │
  │  Signal 3: Temporal Consistency (std) ─ threshold > 0.40 ──┤      │
  │                                                             │      │
  │  Decision: 2-of-3 signals flag → UNKNOWN                    │      │
  └────────────────────────┬────────────────────────────────────┘      │
                           │                                            │
              ┌────────────┴────────────┐                               │
              │                         │                               │
         CONFIDENCE > 60%          CONFIDENCE < 60%                     │
         (KNOWN SIGN)              (UNKNOWN SIGN)                       │
              │                         │                               │
              ▼                         ▼                               │
     Output known gloss        ┌────────────────────────────────┐       │
     to Phase 3 (NLG)          │  STEP 5.2: MOVEMENT ANALYZER   │       │
     (normal path)             │  (Deterministic 3D Math)       │       │
                               │                                │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Handshape: fingertip-to- │  │       │
                               │  │ palm distances, finger   │  │       │
                               │  │ extension classification │  │       │
                               │  └──────────────────────────┘  │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Location: wrist vs nose/ │  │       │
                               │  │ shoulder Y/Z comparison  │  │       │
                               │  │ (head/chest/waist zones) │  │       │
                               │  └──────────────────────────┘  │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Movement: trajectory     │  │       │
                               │  │ variance, straightness   │  │       │
                               │  │ ratio, repetition count, │  │       │
                               │  │ speed classification     │  │       │
                               │  └──────────────────────────┘  │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Orientation: palm normal │  │       │
                               │  │ vector via cross-product │  │       │
                               │  │ of wrist-MCP vectors     │  │       │
                               │  └──────────────────────────┘  │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ NMM: eyebrow-eye dist,   │  │       │
                               │  │ lip aperture, shoulder   │  │       │
                               │  │ angle, nose oscillation  │  │       │
                               │  └──────────────────────────┘  │       │
                               └───────────────┬────────────────┘       │
                                               │                        │
                                               ▼                        │
                               ┌────────────────────────────────┐       │
                               │  STEP 5.3: HYBRID REASONING    │       │
                               │                                │       │
                               │  Stage A: Vector Search        │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Compare sequence embed-  │  │       │
                               │  │ ding against known class │  │       │
                               │  │ centroids (cosine +      │  │       │
                               │  │ Mahalanobis). Retrieve   │  │       │
                               │  │ top 3 closest signs.     │  │       │
                               │  └──────────────────────────┘  │       │
                               │                                │       │
                               │  Stage B: Prompt Construction  │       │
                               │  ┌──────────────────────────┐  │       │
                               │  │ Combine:                 │  │       │
                               │  │ - Top 3 similar signs    │  │       │
                               │  │ - 5 movement features    │  │       │
                               │  │ - Sentence context       │  │       │
                               │  │ - Constrained output fmt │  │       │
                               │  └──────────────────────────┘  │       │
                               └───────────────┬────────────────┘       │
                                               │                        │
                                               ▼                        │
                               ┌────────────────────────────────┐       │
                               │  LOCAL LLM: gemma-4-E4B        │       │
                               │  (Reasons over text evidence,  │       │
                               │   never over raw landmarks)     │       │
                               └───────────────┬────────────────┘       │
                                               │                        │
                                               ▼                        │
                               ┌────────────────────────────────┐       │
                               │  STEP 5.4: CANDIDATE OUTPUT    │       │
                               │                                │       │
                               │  Top 3 guesses with:           │       │
                               │  - Candidate meaning           │       │
                               │  - Confidence (High/Med/Low)   │       │
                               │  - Phonological reasoning      │       │
                               │                                │       │
                               │  UI: Amber warning banner      │       │
                               │  "⚠️ CANDIDATE INTERPRETATION  │       │
                               │   (UNCONFIRMED)"               │       │
                               │                                │       │
                               │  User feedback button:         │       │
                               │  "Was any candidate correct?"  │       │
                               └───────────────┬────────────────┘       │
                                               │                        │
                                               ▼                        │
                               ┌────────────────────────────────┐       │
                               │  STEP 5.5: UNKNOWN QUEUE       │       │
                               │                                │       │
                               │  Save to unknown_signs_queue/: │       │
                               │  - Landmark sequence (no video)│       │
                               │  - Movement Analyzer features  │       │
                               │  - OOD Gate signal values      │       │
                               │  - LLM candidate guesses       │       │
                               │  - User feedback (if any)      │       │
                               │  - Timestamp + session ID      │       │
                               │                                │       │
                               │  Future: Feed into Phase 6     │       │
                               │  community verification for    │       │
                               │  human labeling & retraining   │       │
                               └────────────────────────────────┘       │
================================================================================
```

---

## 6. File Plan & Implementation Order

| Order | File | Purpose | Dependencies |
|:---|:---|:---|:---|
| 1 | `movement_analyzer.py` | Deterministic 3D feature extraction (handshape, location, movement, orientation, NMM). Pure math, no ML. | MediaPipe landmark format (already defined in Phase 2) |
| 2 | `ood_gate.py` | Three-signal fusion (softmax, Mahalanobis, temporal consistency). Returns KNOWN/UNKNOWN flag. | Trained LSTM model (Phase 2.5), training set embeddings |
| 3 | `similarity_search.py` | Cosine + Mahalanobis distance against known class centroids. Returns top-3 closest signs. | `dataset_landmarks/*.npy`, trained LSTM embeddings |
| 4 | `unknown_prompt_builder.py` | Combines Movement Analyzer output + similarity results + context into the constrained LLM prompt. | Steps 1-3 outputs |
| 5 | `unknown_sign_pipeline.py` | Orchestrator: chains Steps 5.1→5.2→5.3→5.4. Single function call: `process_unknown(landmark_sequence) → candidates`. | Steps 1-4, existing LLM inference code from Phase 3 |
| 6 | `unknown_queue.py` | Saves unknown sign data to `unknown_signs_queue/` directory as JSON. | Step 5 outputs |
| 7 | `test_movement_analyzer.py` | Test script: run the analyzer on known signs from `dataset_landmarks/` and verify the text descriptions are accurate. | Step 1 |

**Estimated effort:** Steps 1-3 are pure Python math and can be built and tested independently before the LSTM (Phase 2.5) is even trained. Step 4-5 require the LLM integration but reuse the existing Phase 3 inference code. Step 6 is simple file I/O.

---

## 7. Key Design Principles (Summary)

| Principle | Implementation |
|:---|:---|
| **Deterministic before probabilistic** | Movement Analyzer uses pure math. LLM only sees text, never numbers. |
| **Evidence-grounded reasoning** | LLM receives similarity search results alongside physical descriptions. It reasons from evidence, not from nothing. |
| **Honesty over confidence** | Output is always "candidate", never "prediction". UI enforces amber warning. |
| **Privacy by architecture** | Only landmarks and derived text features enter the pipeline. Raw video is never stored or transmitted. |
| **No new training data required** | The Movement Analyzer is rule-based. The OOD Gate thresholds are calibrated on existing training data. No additional labeled data is needed to deploy Phase 5. |
| **Graceful degradation** | If the LLM cannot guess, it says "INSUFFICIENT EVIDENCE". If the OOD Gate is uncertain, the 2-of-3 rule prevents false alarms. Every failure mode has a defined fallback. |
