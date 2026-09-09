# Phase 5: Unknown Sign Detection & Semantic Interpretation
## The Honesty Layer — Revised Engineering Specification (v2)

> **Revision note:** This document corrects all issues identified in peer review. Thresholds are marked as placeholders pending calibration. Linguistic overclaiming has been removed. The three-outcome system replaces the binary KNOWN/UNKNOWN gate. The LLM's role is reframed from "linguist" to "constrained hypothesis generator."

---

## 1. Problem Statement

Many conventional closed-set sign recognition systems assume that test samples belong to the training vocabulary. When a user signs something outside that vocabulary — a regional variant, a compound sign, a fingerspelled word, a sign from a different dialect, or an entirely novel gesture — the model selects the closest known class and outputs it with unwarranted confidence.

For an assistive system serving the deaf community, this creates a specific harm: a confidently wrong translation erodes user trust faster than an honest admission of uncertainty. Phase 5 exists to handle the moment when the recognition model encounters a sign it cannot reliably classify.

**Phase 5 does not claim to understand unknown signs.** It claims to:
1. Detect when classification is unreliable.
2. Describe the physical characteristics of the sign using deterministic geometry.
3. Retrieve the closest known signs from the training vocabulary.
4. Generate explicitly unconfirmed candidate hypotheses using a constrained LLM.
5. Queue the data for future human verification and vocabulary expansion.

---

## 2. Explicit Rejections (What We Are NOT Building)

### 2.1 Rejected: Separate 3D Vision Model
MediaPipe Holistic already provides relative 3D landmark coordinates (`x, y, z`) for hands, face, and pose. Training a separate CNN or 3D convolutional network to re-extract spatial features is redundant. Note: MediaPipe's `z` coordinate is a **relative, non-metric depth estimate** — not camera-calibrated 3D reconstruction. All geometric calculations in this system use MediaPipe's relative 3D landmark representation, not metric 3D reconstruction.

### 2.2 Rejected: Vision-Language Models (VLMs)
VLMs require raw pixel data (violating Phase 6 privacy constraints), are prohibitively slow on CPU, and are unreliable at finger-level distinctions. They also hallucinate spatial descriptions, which would propagate errors into the downstream reasoning step.

### 2.3 Rejected: Raw Landmark Arrays Fed to LLM
A 60-frame × 126-dim sequence contains 7,560 numbers (~7,500–15,000 tokens). LLMs do not reliably perform spatial geometry or trigonometry over raw numerical arrays. The Movement Analyzer (Step 5.2) exists specifically to compress these numbers into approximately 50–100 tokens of structured, interpretable text.

### 2.4 Rejected: LLM as WBSL Linguist
The deployment LLM (`gemma-4-E4B`) does not possess verified WBSL-specific phonological knowledge. It has limited-to-no training exposure to West Bengal Sign Language. Any WBSL phonological claims in the prompt must come from a **curated, cited reference table** — not from the LLM's parametric memory. The LLM's role is to **rank, phrase, and connect retrieved evidence** — not to invent linguistic rules.

---

## 3. Data Contract: The 146-Dimensional Input Vector

**This section resolves the dimensional inconsistency identified in review.**

The Phase 2.4 recorder captures a fixed 146-dimensional feature vector per frame:

| Component | Dimensions | Source |
|:---|:---|:---|
| Two-hand landmarks | 126 | MediaPipe Holistic hands (21 points × 3 coords × 2 hands) |
| Upper-body pose | 18 | MediaPipe Holistic pose (6 selected points × 3 coords) |
| NMM flags | 2 | Pre-computed binary: [eyebrow_raise, mouth_open] |

**Critical distinction:** The 2 NMM values in the 146-dim vector are **pre-computed binary flags** for the LSTM model's input. They are NOT the full facial landmark data.

The **Movement Analyzer (Step 5.2)** operates on a SEPARATE, richer data source: it receives the full MediaPipe Holistic face mesh (468 landmarks) and pose (33 landmarks) from the live perception pipeline. It does NOT rely on the 2-dim NMM values. The 146-dim vector is the LSTM's training/inference format. The Movement Analyzer has access to the complete landmark stream.

**Implementation rule:** The Phase 2.4 recorder must save BOTH the 146-dim compressed vector (for LSTM training) AND the raw face mesh + full pose landmarks (for Movement Analyzer access). The recorder output format is therefore:

```
recording_output = {
    "lstm_features": np.array(shape=(T, 146)),      # For LSTM
    "full_face_mesh": np.array(shape=(T, 468, 3)),   # For Movement Analyzer
    "full_pose": np.array(shape=(T, 33, 3)),         # For Movement Analyzer
    "video_frame_count": T,
    "metadata": {...}
}
```

---

## 4. The Three-Outcome System

**This replaces the binary KNOWN/UNKNOWN gate.**

Every sign sequence produces one of three outcomes:

| Outcome | Meaning | Trigger |
|:---|:---|:---|
| **KNOWN** | The model confidently recognizes the sign. | All quality checks pass AND OOD gate returns high confidence. |
| **LOW QUALITY / UNCERTAIN** | The input cannot be reliably analyzed. | Quality gate fails (tracking loss, occlusion, insufficient frames). System asks user to re-sign. |
| **UNKNOWN / OOD** | The input is trackable but does not match the training vocabulary. | Quality checks pass BUT OOD gate flags the sequence as out-of-distribution. |

### 4.1 Quality Gate (Runs BEFORE OOD Detection)

This gate answers: **"Is the input even analyzable?"** It prevents the system from declaring "UNKNOWN SIGN" when the real problem is "MediaPipe lost the hand."

**Checks:**

| Check | Condition | Failure Outcome |
|:---|:---|:---|
| Hand detected | Both hands visible in ≥ 80% of frames | LOW QUALITY |
| Face detected | Face mesh visible in ≥ 70% of frames | LOW QUALITY (proceed without NMM) |
| Landmark confidence | MediaPipe visibility score > 0.5 for wrist landmarks | LOW QUALITY |
| Sequence length | T ≥ 10 frames (≥ 0.33 sec at 30 FPS) | LOW QUALITY |
| Motion present | Total wrist displacement > minimum threshold | LOW QUALITY (may be a hold/pause, not a sign) |
| Tracking stability | Landmark dropout rate < 20% across sequence | LOW QUALITY |

**If any critical check fails:** Output `"SIGN COULD NOT BE RELIABLY ANALYZED. Please sign again."` Do NOT proceed to OOD detection.

**If all checks pass:** Proceed to OOD Gate.

### 4.2 OOD Gate (Out-of-Distribution Detection)

**Purpose:** Determine whether a quality-verified sign sequence falls within or outside the training distribution.

**Three signals:**

#### Signal 1: Max Softmax Probability (MSP)
- The highest class probability from the LSTM's final softmax layer.
- **Initial threshold candidate:** < 0.60 flags as potentially unknown.
- **Status:** PLACEHOLDER. Final threshold selected via validation calibration (see Section 4.3).

#### Signal 2: Embedding Distance
- Distance between the LSTM's penultimate-layer embedding and the nearest class centroid.
- **Method:** Mahalanobis distance with **regularized covariance** (Ledoit-Wolf shrinkage or diagonal approximation). If training sample count per class is < 50, use **diagonal covariance approximation** to avoid ill-conditioned matrices. Do NOT call `np.cov` on small samples without regularization.
- **Initial threshold candidate:** Distance > 95th percentile of training-set distribution.
- **Status:** PLACEHOLDER. Calibrated on validation data.

#### Signal 3: Frame Agreement Ratio
- **This replaces the mathematically invalid "standard deviation of predicted class."** Class labels are categorical, not numeric. Assigning indices (A=0, B=1, C=2) and computing std is meaningless.
- **Correct metric:** For each frame, record the LSTM's predicted class. Count how many frames agree with the final majority-vote class.
  ```
  agreement_ratio = (frames agreeing with majority class) / (total frames)
  ```
- Example: 45 frames, 39 predict THINK, 6 predict KNOW → agreement = 39/45 = 0.867.
- **Initial threshold candidate:** agreement_ratio < 0.60 flags as temporally inconsistent.
- **Status:** PLACEHOLDER. Calibrated on validation data.
- **Supplementary metric (optional):** Average predictive entropy across frames. Higher entropy → more uncertain.

**Decision Logic:**
- If **any two of three** signals flag the sequence → route to **UNKNOWN pipeline**.
- If all three agree the sequence is within distribution → output **KNOWN** gloss.
- This 2-of-3 rule is an **interpretable baseline fusion rule**, not an optimal decision boundary. Future work may replace it with a weighted score: `OOD_score = w1*MSP + w2*embedding_dist + w3*(1-agreement)` with weights tuned on validation data.

### 4.3 Calibration Protocol

**Thresholds are NOT fixed constants.** They are design placeholders pending empirical calibration.

**Calibration data requirements:**

| Category | Description | Purpose |
|:---|:---|:---|
| Known (training vocab) | Signs from the trained vocabulary, including noisy/sloppy variants | Establish the "known" distribution |
| Near-miss unknown | Regional variants, compound signs, signs semantically/physically close to known classes | The hardest and most realistic OOD case |
| Held-out classes | Sign classes deliberately excluded from training | Test generalization boundary |
| Non-sign gestures | Random hand movements, fidgeting, pointing | Test rejection of non-linguistic input |
| Fingerspelling | Individual letter sequences (if not in vocabulary) | Test rejection of sequential inputs |

**Metrics to report:**

| Metric | What It Measures |
|:---|:---|
| AUROC | Overall separability of known vs. unknown distributions |
| AUPRC | Precision-recall for the unknown class (important if unknowns are rare) |
| FPR at 95% TPR | False alarm rate when catching 95% of true unknowns |
| False-unknown rate | How often known signs are misclassified as unknown |
| False-known rate | How often unknown signs are misclassified as known |
| Calibration error | Whether the MSP scores are well-calibrated probabilities |

**Critical note:** Random noise sequences are NOT a valid unknown test case. They are trivially separable and inflate performance metrics. Calibration MUST include near-miss unknowns (regional variants, compound signs) to be meaningful.

---

## 5. Step 5.2: The Movement Analyzer

**Purpose:** Convert raw MediaPipe landmark sequences into structured, interpretable text descriptions of the sign's physical characteristics. This is a **deterministic, rule-based Python module**. No machine learning involved.

**Input:** Full MediaPipe Holistic output (hands, face mesh, pose) for the sign sequence. NOT the compressed 146-dim vector.

**Output:** A dictionary with keys: `handshape`, `location`, `movement`, `orientation`, `nmm`, `quality_flags`. Each value is a structured text string. Each entry includes an **observability flag**: if a feature cannot be reliably computed (due to occlusion, tracking noise, or insufficient data), the output is `"NOT OBSERVABLE"` rather than a forced guess.

### 5.2.1 Dominant Hand Detection

**This step was missing in v1 and is required before all subsequent analysis.**

**Algorithm:**
1. For each hand, compute total motion energy: sum of frame-to-frame wrist displacement across the sequence.
2. The hand with higher motion energy is the **active/dominant hand**.
3. If both hands have similar motion energy (ratio between 0.8 and 1.2), classify as **two-handed dynamic** (both hands move). Report features for BOTH hands.
4. If one hand has < 20% of the other's motion energy, classify it as **stationary/non-dominant**.
5. Do NOT assume right hand is dominant. A left-handed signer will have higher left-hand motion energy.

**Output example:**
```
"Dominant hand: LEFT (motion energy ratio 3.2:1). 
Non-dominant hand: RIGHT (stationary base)."
```
Or:
```
"Two-handed dynamic sign. Both hands move with similar energy 
(ratio 1.1:1). Reporting features for both hands."
```

### 5.2.2 Hand Configuration Descriptor

**Naming change:** This is a **rule-based hand configuration descriptor**, not a reliable handshape classifier. True handshape classification requires joint angle analysis, finger curvature modeling, and thumb configuration — far beyond fingertip-to-palm distance.

**Algorithm (baseline descriptor):**
1. Calculate palm center: mean of wrist, index MCP, middle MCP, ring MCP, pinky MCP.
2. Calculate hand size: distance from wrist to middle MCP (used for normalization).
3. For each finger, calculate 3D Euclidean distance between fingertip and palm center.
4. Normalize by hand size.
5. Classify:
   - Normalized distance > 1.8 → **Extended**
   - Normalized distance < 1.0 → **Closed/Curled**
   - 1.0 to 1.8 → **Partially curved**
6. Thumb-to-index tip distance < 0.5 × hand size → **Pinch/O-ring**

**Known limitations (documented for examiner/audit):**
- Two different hand configurations can produce similar fingertip-to-palm distances.
- Finger joint angles, curvature, and inter-finger spacing are not captured.
- This descriptor is a **first-order approximation** sufficient for coarse LLM reasoning, not a phonological handshape classifier.

**Observability check:** If hand visibility score < 0.5 for > 30% of frames → output `"Hand configuration NOT OBSERVABLE due to tracking loss."`

**Output example:**
```
"Left hand (dominant): Index finger extended, middle finger extended, 
ring finger closed, pinky closed, thumb extended. 
Right hand (non-dominant): All fingers closed, fist configuration.
Note: Baseline descriptor only. Joint-angle analysis not performed."
```

### 5.2.3 Location Descriptor

**Algorithm:**
1. **Body-relative coordinate system.** All positions are normalized by body dimensions to handle camera distance, angle, and subject size:
   ```
   body_center = midpoint(left_shoulder, right_shoulder)
   body_width = distance(left_shoulder, right_shoulder)
   relative_x = (wrist_x - body_center_x) / body_width
   relative_y = (wrist_y - nose_y) / body_width
   ```
2. Vertical zones (using normalized `relative_y`):
   - |relative_y| < 0.3 → **Head/Face level**
   - 0.3 ≤ relative_y < 1.0 → **Chest/Torso level**
   - relative_y ≥ 1.0 → **Waist/Lower level**
3. Horizontal zones (using normalized `relative_x`):
   - |relative_x| < 0.5 → **Center**
   - relative_x > 0.5 → **Right of center**
   - relative_x < -0.5 → **Left of center**
4. Report start location (average of first 5 frames) and end location (average of last 5 frames) separately.
5. **Z-axis caveat:** MediaPipe's `z` coordinate is a relative, non-metric estimate with higher noise than `x`/`y`. Do NOT use `z` for primary location classification. Use `z` only as a supplementary note (e.g., "hand appears closer to camera than body plane") with a confidence qualifier.

**Output example:**
```
"Dominant (left) hand: Starts at chest level, center of body. 
Ends at head level, slightly left of center. 
Non-dominant (right) hand: Static at waist level, right side.
Depth note: Hand appears to move slightly toward camera (low confidence)."
```

### 5.2.4 Movement Descriptor

**Algorithm:**
1. Calculate frame-to-frame displacement vectors for the dominant wrist.
2. **Total displacement:** Euclidean distance from first-frame wrist position to last-frame wrist position.
3. **Path length:** Sum of all frame-to-frame displacements.
4. **Straightness ratio:** Total displacement / Path length.
   - Ratio > 0.85 → **Straight line**
   - Ratio < 0.4 → **Circular or complex path**
   - 0.4 to 0.85 → **Curved or arc**
5. **Direction (if straight):** Classify by dominant normalized axis (dx, dy). Do NOT use a single dominant axis for compound or multi-directional movements. If multiple axes contribute significantly, report: "Compound movement: horizontal + vertical."
6. **Repetition:** Count direction reversals on the dominant axis. More than 2 reversals → **Repeated/oscillating**.
7. **Speed:** Calculate `normalized_path_length / duration_in_seconds`. Classify as slow/medium/fast based on **dataset percentiles** (computed from training data), NOT fixed m/s values. MediaPipe coordinates are normalized, not metric.
   - Percentile < 33rd → **Slow**
   - 33rd to 66th → **Medium**
   - > 66th → **Fast**
8. **Static detection:** If path length < 0.05 × hand size → **Stationary/hold**.
9. **Two-handed movement:** If both hands are classified as dynamic (Section 5.2.1), compute and report movement features for BOTH hands independently.

**Smoothing:** Apply a **5-frame rolling average** to wrist coordinates before computing displacement, to reduce MediaPipe jitter.

**Output example:**
```
"Dominant (left) hand: Single downward arc, medium speed 
(47th percentile of training distribution). Path is curved 
(straightness ratio: 0.62). No repetition detected.
Non-dominant (right) hand: Stationary."
```

### 5.2.5 Orientation Descriptor

**Algorithm:**
1. Construct two vectors on the palm surface:
   - `v1` = Index MCP − Wrist
   - `v2` = Pinky MCP − Wrist
2. Palm normal vector: `n = v1 × v2` (cross product).
3. Normalize `n` to unit length.
4. **Continuous representation:** Report the full normal vector `[x, y, z]`.
5. **Coarse classification:** Determine the dominant component(s). If two components are within 0.15 of each other, report BOTH (e.g., "mostly upward and slightly toward camera"). Do NOT force a single-axis label for diagonal orientations.
6. **Handedness/coordinate caveat:** The cross product direction depends on landmark ordering and the coordinate system's handedness. Verify with a known test case (e.g., palm flat facing camera → normal should point toward camera) before deployment.
7. Report for both start frame and end frame (orientation may change during the sign).

**Smoothing:** Apply a **3-frame rolling average** to the normal vector components before classification.

**Output example:**
```
"Left palm normal vector (start): [x=0.12, y=-0.21, z=-0.97] 
→ Mostly facing camera/outward.
Left palm normal vector (end): [x=0.55, y=-0.60, z=-0.58] 
→ Rotated: partially upward and partially toward camera.
Note: Orientation estimate subject to MediaPipe z-axis noise."
```

### 5.2.6 Non-Manual Marker (NMM) Descriptor

**Algorithm (using full face mesh, NOT the 2-dim NMM from the 146-dim vector):**

1. **Eyebrow raise/furrow:** Vertical distance between eyebrow midpoint and eye midpoint, normalized by face height. Compare to baseline (average of first 10 frames, assumed neutral). Change > 20% → **Raised**. Change < −15% → **Furrowed**.
2. **Mouth openness:** Vertical distance between upper lip and lower lip landmarks, normalized by face height. Ratio > 0.15 → **Open**. Ratio < 0.05 → **Closed/pursed**.
3. **Head tilt:** Calculate the angle of the line connecting **left eye to right eye** (or left ear to right ear from face mesh). This measures actual head tilt, NOT shoulder-line angle. Shoulder-line angle is a separate body-posture feature and should be reported independently.
   - Angle > 10° → **Head tilted [left/right]**
4. **Head shake/nod:** Track nose tip X (shake) and Y (nod) across frames. If oscillation amplitude exceeds threshold → **Head shaking** or **Head nodding**.
5. **All NMM features** use a **5-frame rolling average** before classification, matching the smoothing applied to other features.

**Observability check:** If face mesh visibility < 0.5 for > 30% of frames → output `"NMM features NOT OBSERVABLE due to face tracking loss."`

**Output example:**
```
"NMM: Eyebrows raised (28% above baseline). Mouth slightly open 
(ratio: 0.18). Head tilted 14° to the right (measured from eye line). 
No head shake or nod detected.
Body posture note: Shoulder line angle = 3° (within normal range)."
```

### 5.2.7 Quality Flags

Every Movement Analyzer output includes a `quality_flags` field:

```json
{
  "hand_visibility": 0.92,
  "face_visibility": 0.85,
  "z_axis_reliability": "low",
  "occlusion_frames": 3,
  "tracking_dropout_rate": 0.04,
  "features_not_observable": ["orientation_end_frame"]
}
```

These flags allow downstream consumers (LLM prompt, UI, Unknown Queue) to know which features are reliable and which are missing.

---

## 6. Step 5.3: Hybrid Reasoning

**Purpose:** Ground the LLM's hypothesis generation in retrieved evidence. The LLM does NOT invent linguistic rules. It ranks, phrases, and connects evidence from the retrieval step.

### 6.1 Stage A: Vector Similarity Search

1. **Primary embedding:** Mean-pooled LSTM penultimate-layer activations across the sequence. This is the primary method because the LSTM has already learned a temporal representation.
2. **Fallback/debugging embedding:** Handcrafted feature vector [mean hand distance, max normalized velocity, dominant movement axis, final relative hand height, palm orientation code, NMM flags] → ~20-30 dimensions. Used for debugging and sanity-checking the LSTM embedding.
3. **Retrieval metric:** Cosine similarity against known class centroids. Mahalanobis distance is used ONLY in the OOD Gate (Step 4.2), not in retrieval. This avoids conflating two different distance metrics.
4. **Output:** Top 3 closest known signs with similarity scores.

**Critical limitation:** Geometric similarity in embedding space does NOT imply semantic similarity. Two signs can be physically similar but lexically unrelated. The retrieval step provides **phonological neighborhood** information, not meaning.

### 6.2 Stage B: WBSL Phonological Reference Table

**This is the most critical addition in v2.**

The LLM does NOT have verified WBSL phonological knowledge. Before deployment, build a small structured reference table:

```json
{
  "location_rules": [
    {
      "location": "temple/forehead",
      "associated_concepts": ["cognition", "thinking", "memory"],
      "source": "ISL dictionary reference [citation]",
      "confidence": "documented"
    },
    {
      "location": "chest",
      "associated_concepts": ["emotion", "feeling", "self"],
      "source": "ISL dictionary reference [citation]",
      "confidence": "documented"
    }
  ],
  "movement_rules": [
    {
      "movement": "circular",
      "modification": "questioning, doubt, or intensification",
      "source": "ISL linguistics reference [citation]",
      "confidence": "documented"
    },
    {
      "movement": "abrupt_stop",
      "modification": "negation, finality, or emphasis",
      "source": "ISL linguistics reference [citation]",
      "confidence": "documented"
    }
  ]
}
```

**If no curated reference exists for a specific pattern:** The LLM must NOT invent one. The prompt must explicitly state: `"Do not claim WBSL/ISL phonological rules that are not present in the supplied reference table."`

**Initial state:** If no WBSL dictionary/linguistic reference is available at build time, the reference table is EMPTY. In this case, the LLM outputs: `"No curated WBSL phonological rules available for this feature combination. Returning physical description and nearest known signs only."` This is the **default and expected behavior** until community/linguist input populates the table.

### 6.3 Prompt Construction

```text
SYSTEM: You are generating candidate hypotheses for an unrecognized 
sign language sequence. You are NOT a linguist. You must NOT invent 
WBSL or ISL phonological rules. You may ONLY reference rules provided 
in the [WBSL PHONOLOGICAL RULES] section below. If no rule matches, 
say so explicitly.

[WBSL PHONOLOGICAL RULES]
{contents of the curated reference table, or "NO RULES AVAILABLE"}

[CLOSEST KNOWN SIGNS (by embedding similarity)]
1. THINK — 72% cosine similarity
2. KNOW — 65% cosine similarity
3. CONFUSED — 41% cosine similarity
Note: Similarity is geometric, not semantic. These signs are 
physically nearby in feature space, but may be unrelated in meaning.

[3D PHYSICAL DESCRIPTION]
Dominant hand: LEFT
Hand configuration: Index extended, others closed (baseline descriptor)
Location: Starts at chest level center, ends at head level
Movement: Single upward arc, medium speed
Orientation: Palm faces inward, rotates upward
NMM: Eyebrows raised, mouth slightly open, head tilted 12° right
Quality flags: z_axis_reliability=low, all other features observable

[CONTEXT (previous signs in this sentence)]
"YOU", "TOMORROW", "EXAM"

[OUTPUT FORMAT — follow exactly]
For each candidate:
- Candidate meaning
- Evidence strength: Strong / Moderate / Weak (NOT High/Medium/Low)
- Observed evidence: [list specific measured features that support this guess]
- Linguistic basis: [cite a specific rule from the reference table, 
  or write "NO CURATED RULE — geometric similarity only"]
- Evidence gaps: [what is missing or uncertain]

If insufficient evidence: output "INSUFFICIENT EVIDENCE" with 
explanation of what is missing.

Do NOT use the word "confident." Do NOT present hypotheses as facts.
```

---

## 7. Step 5.4: Candidate Output & UI Presentation

**Rules:**
- Output is labeled **"Candidate Hypothesis"** — never "Translation," "Prediction," or "Meaning."
- UI displays a persistent amber banner: **"⚠️ This sign is not in the recognized vocabulary. The following are unconfirmed hypotheses based on movement analysis. They may be incorrect."**
- Each candidate includes:
  - Candidate meaning
  - Evidence strength (Strong / Moderate / Weak)
  - Specific observed features supporting the guess
  - Linguistic basis (cited rule or "no rule available")
  - Evidence gaps
- If the LLM outputs "INSUFFICIENT EVIDENCE," the UI displays: **"This sign could not be interpreted with available evidence. Please try rephrasing, fingerspelling, or signing more slowly."**
- User feedback button: **"Was any candidate correct?"** with options: Select one / None correct / Tracking error / Not a sign.

**Failure-mode tagging:** User feedback must distinguish between:
- "Novel sign" (real unknown vocabulary item)
- "Tracking glitch" (MediaPipe failure)
- "User error" (incomplete or incorrect signing)
- "None correct" (sign exists but system failed)

These are different debugging signals and must not be conflated.

---

## 8. Step 5.5: The Unknown Queue

**What is saved:**
- Landmark sequence (126-dim hands + 18-dim pose)
- Full face mesh + pose (for Movement Analyzer re-analysis)
- Movement Analyzer output (structured text + quality flags)
- LSTM softmax distribution and embedding vector
- OOD Gate signal values (MSP, embedding distance, agreement ratio)
- LLM candidate hypotheses (if generated)
- User feedback with failure-mode tag
- Timestamp, session ID, pseudo-anonymous signer ID

**What is NOT saved:**
- Raw video frames (discarded on-device per Phase 6 privacy rule)
- Directly identifying information

**Privacy note:** Landmark sequences are derived biometric-like data (they represent individual body/face geometry). While less identifiable than video, they are not zero-risk. The queue must include:
- Explicit consent for queue contribution
- Retention policy (e.g., auto-delete after 90 days if not reviewed)
- Deletion mechanism (signer can request removal)
- Access control (queue is not publicly accessible)

**Storage (MVP):** Local directory `unknown_signs_queue/` with one JSON file per event, atomic writes, and a schema version field.

**Storage (production):** Database with encryption, access controls, deduplication, and retention policies. Local JSON is acceptable only for single-user prototype.

**Future use:** When the queue accumulates sufficient samples of a recurring unknown pattern, they are submitted to Phase 6 (Community Verification) for human labeling. Only human-approved samples enter the training dataset.

---

## 9. End-to-End Example Walkthroughs

### 9.1 Example A: Successful Candidate Generation (Illustrative — NOT an evaluation result)

**Scenario:** User signs a gesture not in the 35-letter training vocabulary.

1. **Quality Gate:** Hands visible in 95% of frames. Face visible. 42 frames captured. Motion present. → PASS. Proceed to OOD Gate.
2. **OOD Gate:** MSP = 0.38 (< 0.60 placeholder). Embedding distance = 4.1σ (> 95th percentile placeholder). Frame agreement = 31/42 = 0.74 (> 0.60, passes). 2-of-3 signals flag → **UNKNOWN**.
3. **Movement Analyzer:** Extracts hand configuration, location, movement, orientation, NMM with quality flags.
4. **Similarity Search:** Top 3: THINK (72%), KNOW (65%), CONFUSED (41%).
5. **LLM Prompt:** Includes physical description + similarity results + context + curated reference table (if available).
6. **LLM Output:**
   > 1. Candidate: **DIFFICULT / HARD** | Evidence strength: Moderate | Observed evidence: Upward arc with sharp stop, two-handed configuration with active hand over passive base, furrowed eyebrows. | Linguistic basis: "Two-handed asymmetry with active hand over stationary base" matches rule in reference table for interaction/obstacle concepts. | Evidence gaps: Hand configuration is a baseline descriptor only; joint angles not analyzed.
   > 2. Candidate: **HEAVY** | Evidence strength: Weak | Observed evidence: Upward effort movement. | Linguistic basis: NO CURATED RULE — geometric similarity only. | Evidence gaps: Location (chest-to-chin) does not match typical weight-related signs.
   > 3. Candidate: **PROBLEM** | Evidence strength: Weak | Observed evidence: Sharp stop + head tilt. | Linguistic basis: NO CURATED RULE — geometric similarity only. | Evidence gaps: Hand configuration atypical for this concept.
7. **UI:** Displays candidates with amber banner. User selects "Candidate 1 correct."
8. **Queue:** Saves all data with feedback tag "novel sign."

### 9.2 Example B: Insufficient Evidence (Expected common case)

**Scenario:** User makes an ambiguous gesture. No WBSL reference table rules match.

1. Quality Gate: PASS.
2. OOD Gate: 2-of-3 → UNKNOWN.
3. Movement Analyzer: Extracts features, but z-axis reliability is low. Orientation end-frame not observable.
4. Similarity Search: Top 3 all below 50% similarity.
5. LLM Output:
   > INSUFFICIENT EVIDENCE. The physical features do not match any curated WBSL phonological rule. Geometric similarity to nearest known signs is below 50% for all candidates. The sign cannot be interpreted with available evidence.
6. **UI:** Displays: "This sign could not be interpreted. Please try rephrasing, fingerspelling, or signing more slowly."

### 9.3 Example C: Low Quality Input

**Scenario:** MediaPipe loses hand tracking due to occlusion.

1. Quality Gate: Hand visible in only 55% of frames. → **FAIL**.
2. **UI:** Displays: "SIGN COULD NOT BE RELIABLY ANALYZED. Please ensure both hands are visible and sign again."
3. OOD Gate is NOT invoked. No candidate generation occurs.

---

## 10. Text-Based Architecture Diagram (Revised)

```text
================================================================================
           PHASE 5: UNKNOWN SIGN DETECTION & INTERPRETATION (v2)
                      (The Honesty Layer — Revised)
================================================================================

  FROM PHASE 2.5 (LSTM INFERENCE) + LIVE MEDIAPIPE STREAM
  ┌─────────────────────────────────────────────────────────────────────┐
  │  Input: Sign sequence                                              │
  │  - LSTM features: T frames × 146-dim (hands 126 + pose 18 + NMM 2)│
  │  - Full face mesh: T frames × 468 × 3 (for Movement Analyzer)     │
  │  - Full pose: T frames × 33 × 3 (for Movement Analyzer)           │
  │  - LSTM output: softmax distribution + penultimate embedding       │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │  QUALITY GATE (runs FIRST, before OOD)                             │
  │                                                                     │
  │  ✓ Hand detected in ≥ 80% of frames?                               │
  │  ✓ Face detected in ≥ 70% of frames?                               │
  │  ✓ MediaPipe visibility score > 0.5 for wrists?                    │
  │  ✓ Sequence length ≥ 10 frames?                                    │
  │  ✓ Motion present (displacement > minimum)?                        │
  │  ✓ Tracking dropout rate < 20%?                                    │
  │                                                                     │
  │  ANY CRITICAL FAIL ──► "LOW QUALITY" ──► "Please sign again."     │
  │  ALL PASS ──► Proceed to OOD Gate                                  │
  └──────────────────────────────┬──────────────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────────────┐
  │  OOD GATE (Out-of-Distribution Detection)                          │
  │                                                                     │
  │  Signal 1: Max Softmax Probability                                 │
  │    └─ Threshold: < 0.60 [PLACEHOLDER — pending calibration]        │
  │                                                                     │
  │  Signal 2: Embedding Distance (Mahalanobis)                        │
  │    └─ Regularized covariance (Ledoit-Wolf or diagonal approx.)     │
  │    └─ Threshold: > 95th percentile [PLACEHOLDER]                   │
  │                                                                     │
  │  Signal 3: Frame Agreement Ratio                                   │
  │    └─ agreement = (frames matching majority class) / total frames  │
  │    └─ Threshold: < 0.60 [PLACEHOLDER]                              │
  │    └─ NOT std of class IDs (categorical, not numeric)              │
  │                                                                     │
  │  Decision: 2-of-3 signals flag → UNKNOWN                           │
  │  (Interpretable baseline rule, not optimal boundary)               │
  └────────────────────────┬────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ALL AGREE:                2-of-3 FLAG:
         KNOWN SIGN                UNKNOWN / OOD
              │                         │
              ▼                         ▼
     Output known gloss        ┌────────────────────────────────┐
     to Phase 3 (NLG)          │  MOVEMENT ANALYZER             │
     (normal path)             │  (Deterministic 3D Math)       │
                               │                                │
                               │  Step 0: Dominant Hand Detect  │
                               │  └─ Motion energy comparison   │
                               │  └─ Left/Right/Two-handed      │
                               │                                │
                               │  Step 1: Hand Config Descriptor│
                               │  └─ Fingertip-palm distances   │
                               │  └─ Normalized by hand size    │
                               │  └─ Baseline only, not full    │
                               │     handshape classification   │
                               │                                │
                               │  Step 2: Location Descriptor   │
                               │  └─ Body-relative coords       │
                               │  └─ Normalized by body_width   │
                               │  └─ Z-axis: supplementary only │
                               │                                │
                               │  Step 3: Movement Descriptor   │
                               │  └─ Trajectory, straightness   │
                               │  └─ Speed via dataset percentiles│
                               │  └─ NOT fixed m/s values       │
                               │  └─ 5-frame rolling smoothing  │
                               │                                │
                               │  Step 4: Orientation Descriptor│
                               │  └─ Palm normal via cross-prod │
                               │  └─ Continuous + coarse label  │
                               │  └─ 3-frame rolling smoothing  │
                               │  └─ Handles diagonal orient.   │
                               │                                │
                               │  Step 5: NMM Descriptor        │
                               │  └─ Full face mesh (468 pts)   │
                               │  └─ Head tilt from EYE line    │
                               │  └─ NOT shoulder line          │
                               │  └─ 5-frame rolling smoothing  │
                               │                                │
                               │  Output: Text features +       │
                               │  quality_flags + observability │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  HYBRID REASONING              │
                               │                                │
                               │  Stage A: Vector Retrieval     │
                               │  └─ LSTM embedding (primary)   │
                               │  └─ Cosine similarity vs known │
                               │  └─ Top 3 nearest signs        │
                               │  └─ NOTE: geometric similarity │
                               │    ≠ semantic similarity       │
                               │                                │
                               │  Stage B: Phonological Rules   │
                               │  └─ Curated reference table    │
                               │  └─ If empty: "NO RULES"       │
                               │  └─ LLM must NOT invent rules  │
                               │                                │
                               │  Stage C: Prompt Construction  │
                               │  └─ Physical description       │
                               │  └─ Similarity results         │
                               │  └─ Reference table rules      │
                               │  └─ Context (previous signs)   │
                               │  └─ Quality flags              │
                               │  └─ Strict output format       │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  LOCAL LLM: gemma-4-E4B        │
                               │                                │
                               │  Role: Constrained hypothesis   │
                               │  generator. NOT a linguist.     │
                               │                                │
                               │  Prohibited:                    │
                               │  - Inventing WBSL rules        │
                               │  - Using "confident" language  │
                               │  - Presenting guesses as facts │
                               │                                │
                               │  Required:                      │
                               │  - Cite reference table rules  │
                               │  - Report evidence gaps        │
                               │  - Allow "INSUFFICIENT         │
                               │    EVIDENCE" as primary output │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  CANDIDATE OUTPUT              │
                               │                                │
                               │  Label: "Candidate Hypothesis" │
                               │  NOT "Translation" or          │
                               │  "Prediction"                  │
                               │                                │
                               │  Per candidate:                │
                               │  - Meaning                     │
                               │  - Evidence strength:          │
                               │    Strong / Moderate / Weak    │
                               │  - Observed evidence           │
                               │  - Linguistic basis (cited)    │
                               │  - Evidence gaps               │
                               │                                │
                               │  UI: Amber banner              │
                               │  "⚠️ UNCONFIRMED HYPOTHESIS"   │
                               │                                │
                               │  User feedback:                │
                               │  - Select candidate            │
                               │  - None correct                │
                               │  - Tracking error              │
                               │  - Not a sign                  │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                               ┌────────────────────────────────┐
                               │  UNKNOWN QUEUE                 │
                               │                                │
                               │  Save:                         │
                               │  - Landmarks (no video)        │
                               │  - Movement Analyzer features  │
                               │  - Quality flags               │
                               │  - OOD Gate signals            │
                               │  - LLM candidates              │
                               │  - User feedback + failure tag │
                               │  - Consent + retention policy  │
                               │                                │
                               │  Storage: JSON (MVP) /         │
                               │  Database (production)         │
                               │                                │
                               │  Future: Feed into Phase 6     │
                               │  community verification        │
                               └────────────────────────────────┘
================================================================================
```

---

## 11. File Plan & Implementation Order

| Order | File | Purpose | Status |
|:---|:---|:---|:---|
| 1 | `quality_gate.py` | Input quality checks (hand/face visibility, sequence length, motion, dropout) | Not started |
| 2 | `movement_analyzer.py` | Deterministic 3D feature extraction with observability flags | Not started |
| 3 | `ood_gate.py` | Three-signal fusion (MSP, Mahalanobis with regularized covariance, frame agreement ratio) | Not started |
| 4 | `similarity_search.py` | Cosine similarity retrieval against known class centroids using LSTM embeddings | Not started |
| 5 | `phonology_reference.json` | Curated WBSL/ISL phonological rules table (initially empty or minimal) | Not started |
| 6 | `unknown_prompt_builder.py` | Combines Movement Analyzer + similarity + reference table + context into constrained prompt | Not started |
| 7 | `unknown_sign_pipeline.py` | Orchestrator: chains Quality Gate → OOD Gate → Analyzer → Retrieval → LLM → Output | Not started |
| 8 | `unknown_queue.py` | Saves unknown sign data with consent, retention, schema versioning | Not started |
| 9 | `test_movement_analyzer.py` | Validate analyzer output on known signs; verify geometric correctness | Not started |
| 10 | `calibrate_ood.py` | Run calibration protocol on validation data; select final thresholds | Not started |

**Dependency note:** Steps 1-3 can be built and tested independently before the LSTM (Phase 2.5) is trained. Steps 4-7 require the trained LSTM. Step 5 (phonology reference) requires community/linguist input and may remain empty at initial deployment.

---

## 12. Summary of Changes from v1

| Issue in v1 | Fix in v2 |
|:---|:---|
| 146-dim vector includes only 2 NMM values, but Movement Analyzer requires full face mesh | Explicit data contract: LSTM uses 146-dim; Movement Analyzer uses full face mesh + pose. Recorder saves both. |
| Temporal consistency = std of class IDs (categorical, invalid) | Replaced with Frame Agreement Ratio + optional predictive entropy |
| Head tilt measured from shoulder line | Corrected to eye-line / ear-line angle. Shoulder angle reported separately as body posture. |
| Speed in m/s (MediaPipe is normalized, not metric) | Speed classified by dataset percentiles. No m/s values. |
| "3D geometry" implies metric 3D reconstruction | Reframed as "relative 3D landmark geometry." Explicit note that z is non-metric. |
| LLM asked to be a WBSL linguist | LLM reframed as "constrained hypothesis generator." Must cite curated reference table. Cannot invent rules. |
| Confidence: High/Medium/Low (uncalibrated) | Replaced with Evidence Strength: Strong/Moderate/Weak. LLM prohibited from using "confident." |
| Binary KNOWN/UNKNOWN | Three-outcome system: KNOWN / LOW QUALITY / UNKNOWN |
| No quality gate before OOD | Quality Gate added as first step. Prevents "UNKNOWN" when the real problem is tracking failure. |
| No dominant hand detection | Motion-energy-based dominant hand detection added. Handles left-handed signers and two-handed dynamic signs. |
| Orientation forced to single dominant axis | Continuous normal vector reported + coarse label handles diagonals. |
| Handshape called a "classifier" | Renamed to "Rule-based Hand Configuration Descriptor." Limitations documented. |
| Thresholds presented as facts | All thresholds marked as PLACEHOLDERS pending calibration. Calibration protocol defined. |
| Calibration against random noise only | Calibration requires near-miss unknowns, regional variants, non-sign gestures, fingerspelling. |
| "No new data required" | Corrected: No new training data required for baseline, but evaluation and calibration require held-out validation/unknown samples. |
| Example shows only success case | Three examples added: successful candidate, insufficient evidence, low quality input. |
| Unknown Queue: local JSON only | MVP allows JSON with atomic writes + schema version. Production requires database with encryption, access control, retention. |
| Vocabulary: letters vs. words ambiguous | Must be pinned down before building `similarity_search.py`. Current base: 35 static letters (Phase 2.1). Words come after LSTM (Phase 2.5). |
| Cosine + Mahalanobis used interchangeably | Cosine for retrieval. Mahalanobis for OOD Gate only. Different purposes, different stages. |
| Example labeled as result | All examples labeled "Illustrative — NOT an evaluation result." |
