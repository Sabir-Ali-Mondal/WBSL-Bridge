
# WBSL Bridge — Privacy-Preserving Community Data Verification

**Document:** docs/research/community-data-verification.md
**Date:** 1 September 2026
**Parent:** docs/research/research-gap.md (G17 Privacy-Preserving Processing)
**Related:** docs/research/unknown-signs.md (Unknown Queue)
**MVT Phase:** Phase 6

---

## 1. Objective

WBSL Bridge follows a **privacy-first** approach while allowing the community to contribute new sign-language data.

The main problem is:

> Community-submitted data may contain incorrect labels, corrupted landmark data, accidental submissions, or intentionally false data.

The system should therefore **never automatically add community submissions to the training dataset**.

Instead, automated methods will analyse the submitted data and provide **evidence to a human reviewer**.

The final decision must always be made by a human.

---

## 2. Core Principle

> **Automated scores provide evidence, not approval.**

No matter how high the validation score is:

```text
Score = 99/100
```

the system must **not** automatically accept the sample.

The workflow is:

```text
Community Submission
        ↓
Automatic Analysis
        ↓
Simulation / Reconstruction
        ↓
Evidence
        ↓
Human Verification
        ↓
ACCEPT / REJECT / NEEDS REVIEW
```

Only a human-approved sample can enter the trusted dataset.

---

## 3. Privacy-First Submission

The preferred workflow is:

```text
User Device
     ↓
Camera
     ↓
MediaPipe
     ↓
Landmark Extraction
     ↓
540 Landmark Sequence
     ↓
Local Preprocessing
     ↓
Original Video Deleted
     ↓
Required Landmark / Feature Data
     ↓
Community Submission
```

The server does not need the original video for normal dataset submission. This reduces unnecessary collection of identifiable visual information.

### Important

Landmark data should not automatically be considered completely anonymous. Detailed landmark sequences can still contain information about the signer. Therefore, the system should submit only the information required for verification and research.

---

## 4. Community Submission

A submission may contain:

```text
Label:
DRINK

Landmark sequence:
Frame 1
Frame 2
Frame 3
...
Frame N
```

The system can additionally generate:

```text
Numerical features
Symbolic tags
Movement description
Movement trajectory
Model predictions
Validation measurements
```

### 4.1 Submission Metadata (Required)

Every submission must include:

```text
- Signer consent confirmation (opt-in checkbox)
- Data ownership declaration
- Timestamp and device type
- Reviewer decision history
- Provenance ID for audit trail
```

This is required for community data integrity and DPDP Act 2023 compliance.

---

## 5. Automatic Validation

Automatic validation is used only to create evidence for the reviewer. It can check:

### 5.1 Geometric validity

Check whether:

* joint positions are reasonable
* finger geometry is plausible
* bone/joint distances are reasonable
* coordinates contain abnormal values
* frame-to-frame movement is possible

Example:

$$
d_t=\|p_t-p_{t-1}\|
$$

where \(p_t\) is the position at frame \(t\).

### 5.2 Velocity and acceleration

Movement can be analysed using:

$$
v_t=\frac{\|p_t-p_{t-1}\|}{\Delta t}
$$

and:

$$
a_t=\frac{v_t-v_{t-1}}{\Delta t}
$$

Extremely abnormal values can be flagged for human attention.

### 5.3 Temporal consistency

Check whether the sequence contains normal frame progression, or suspicious patterns such as:

```text
Frame 1 → Frame 2 → huge jump → Frame 4
```

### 5.4 Model consistency

The submitted label can be compared with the existing recognition model.

Example:

```text
Submitted label:
DRINK

Model prediction:

DRINK     0.82
EAT       0.08
WATER     0.05
OTHER     0.05
```

This provides supporting evidence. However, "Model agrees" does **not** mean "Automatically accepted".

### 5.5 Synthetic-data detection

Flag unnaturally smooth or mathematically perfect trajectories that suggest generated or spoofed landmarks rather than real human signing. Real signing contains natural micro-jitter; synthetic data often does not.

---

## 6. Similarity Analysis

The submitted sample can be compared with existing trusted samples.

```text
Submitted sample
       ↓
Embedding
       ↓
Nearest trusted samples
       ↓
Similarity
```

A statistical distance such as Mahalanobis distance may also be used:

$$
D_M(x)=
\sqrt{(x-\mu)^T\Sigma^{-1}(x-\mu)}
$$

where \(x\) = submitted feature vector, \(\mu\) = reference class mean, \(\Sigma\) = covariance matrix.

The result is shown to the reviewer as evidence. A high distance should mean "Unusual sample — review carefully", not "Fake sample — automatically reject".

---

## 7. Simulation / Visual Reconstruction

This is the most important part of the verification interface. The original video does not need to be stored. The landmark sequence can be reconstructed as an animated skeleton.

```text
Submitted landmark sequence
          ↓
     Reconstruction
          ↓
     2D / 3D Skeleton
          ↓
       Play Animation
```

The reviewer can watch the frames as a simulated signing movement. This converts difficult numerical data into something a human can visually inspect.

### 7.1 Handshape fidelity requirement

Semantic meaning depends heavily on handshape, not just arm motion. The skeleton replay must render all 21 landmarks per hand clearly so the reviewer can see finger configuration (open, closed, pointing, curved), not only wrist and arm paths. A replay that shows only body and arm movement is insufficient for verification.

---

## 8. Why Simulation Is Not Automatic Verification

Simulation can answer:

> "What movement does the submitted landmark sequence represent?"

It cannot guarantee:

> "This movement really means DRINK."

For example, a malicious user could submit perfectly realistic human movement but attach the wrong label. Therefore:

```text
Physical validity
       ≠
Semantic correctness
```

The semantic decision remains with the human reviewer.

---

## 9. Human Verification Interface

The reviewer should receive a complete evidence panel.

```text
┌──────────────────────────────────────┐
│       COMMUNITY DATA VERIFICATION    │
├──────────────────────────────────────┤
│ Submitted Label: DRINK               │
│                                      │
│        SIMULATED SIGN                │
│                                      │
│             [ PLAY ]                 │
│                                      │
│ Frame: 17 / 30                       │
├──────────────────────────────────────┤
│ Movement Description                 │
│ Right hand moves toward mouth...     │
├──────────────────────────────────────┤
│ Symbolic Tags                        │
│ RIGHT_HAND                           │
│ INDEX_EXTENDED                       │
│ TOWARD_MOUTH                         │
│ REPEATED_3X                          │
├──────────────────────────────────────┤
│ Numerical Features                   │
│ Duration: 0.81 s                     │
│ Repetition: 3                        │
│ Movement distance: 0.42             │
├──────────────────────────────────────┤
│ Model Prediction                     │
│ DRINK       0.82                     │
│ EAT         0.08                     │
│ WATER       0.05                     │
├──────────────────────────────────────┤
│ Validation Evidence                  │
│ Geometry:       94/100               │
│ Temporal:       91/100               │
│ Similarity:     87/100               │
│ Label agreement:82/100               │
├──────────────────────────────────────┤
│                                      │
│ [ ACCEPT ] [ REJECT ] [ REVIEW ]     │
│                                      │
└──────────────────────────────────────┘
```

---

## 10. Explicit Human-Control Rule

The interface must clearly state:

> **Validation scores are advisory evidence only. They do not automatically approve or reject this submission.**

The reviewer may ACCEPT even when the score is low. The reviewer may REJECT even when every score is high. The human decision always has priority.

---

## 11. Three Possible Human Decisions

### ACCEPT

The reviewer believes the reconstructed movement is valid, the submitted label is correct, and the data is useful.

```text
Submission → Human ACCEPT → Trusted Dataset
```

### REJECT

If the reviewer finds wrong label, corrupted movement, suspicious data, invalid sign, or insufficient quality:

```text
Submission → Human REJECT → Not used for training
```

### NEEDS REVIEW

If the reviewer cannot confidently decide:

```text
Submission → Needs More Review → Second reviewer / WBSL expert
```

### 11.1 Reviewer consensus rule

For NEEDS REVIEW and ambiguous cases, a decision is finalized only when a defined number of reviewers agree (for example, 2-of-3). This prevents a single uncertain reviewer from blocking or wrongly accepting a sample, and it creates a clear escalation path for regional or unfamiliar signs.

---

## 12. No Automatic Training

The following workflow must **not** be used:

```text
Community Submission → High Score → Training Dataset
```

Instead:

```text
Community Submission
        ↓
Automatic Analysis
        ↓
Human Verification
        ↓
ACCEPT
        ↓
Trusted Dataset
        ↓
Future Training
```

This protects the model from incorrect or malicious community submissions.

---

## 13. Privacy + Data Integrity Architecture

```text
                    USER DEVICE
                         │
                         ▼
                      CAMERA
                         │
                         ▼
                 MediaPipe Holistic
                         │
                         ▼
                  Landmark Sequence
                         │
                  Local Processing
                         │
                         ▼
                 Original Video
                    Discarded
                         │
                         ▼
              Required Data Submitted
                         │
                         ▼
                ┌─────────────────┐
                │ Validation      │
                │ Engine          │
                └────────┬────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Geometry       Temporal        Model
       Analysis       Analysis      Analysis
          │              │              │
          └──────────────┼──────────────┘
                         ▼
               Simulation / Replay
                         │
                         ▼
              Human Verification UI
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           ACCEPT      REJECT     REVIEW
              │
              ▼
        Trusted Dataset
              │
              ▼
       Future Model Training
```

---

## 14. Role of Scores

Scores are useful, but their role is strictly limited. They help the reviewer answer:

> "Should I look more carefully at this submission?"

For example:

```text
Geometry score       96
Temporal score       93
Model agreement      91
Similarity score     89
```

This suggests the data appears consistent with the existing dataset. But the final question remains:

> **Does the reconstructed sign actually match the submitted meaning?**

Only the human reviewer decides that.

---

## 15. Role of Simulation

Simulation has three main purposes:

1. **Human understanding** — Convert `540 landmarks × N frames` into a visible animated skeleton.
2. **Data inspection** — Allow the reviewer to identify wrong movement, broken landmarks, incorrect handshape, or unexpected motion.
3. **Privacy preservation** — Allow verification of movement without requiring the original RGB video to be stored or shared.

---

## 16. Research Question

This creates an additional research direction for WBSL Bridge:

> **Can privacy-preserving landmark reconstruction provide sufficient visual and numerical evidence for human experts to verify community-contributed sign-language data without requiring the original video?**

A second question is:

> **How effectively can automated validation scores assist human reviewers without replacing human decision-making?**

---

## 17. Core Principle

The complete philosophy can be summarized as:

```text
AUTOMATION
     ↓
ANALYSE
     ↓
EXPLAIN
     ↓
SIMULATE
     ↓
SHOW EVIDENCE
     ↓
HUMAN DECIDES
```

Not:

```text
AUTOMATION
     ↓
SCORE
     ↓
AUTO ACCEPT
```

---

## 18. Privacy vs Verification Tradeoff

Deleting the original video protects privacy but removes one source of truth. In rare cases where landmarks alone are ambiguous, the system flags the sample as NEEDS REVIEW rather than guessing. Privacy is preserved by default; clarity is resolved by humans, never by re-collecting video.

---

## 19. Legal Compliance

Landmark sequences are biometric-adjacent data. WBSL Bridge complies with India's Digital Personal Data Protection Act 2023 by:

- Collecting only landmarks, never raw video
- Requiring explicit signer consent before submission
- Allowing contributors to request data deletion
- Storing no personally identifiable visual information
- Using submitted data only for research and model improvement

---

## 20. Final Design Principle

> **WBSL Bridge will use automated validation, statistical analysis, similarity measures and landmark-based simulation only as decision-support tools. No community-submitted sign will be automatically accepted into the trusted training dataset based on a score. The reconstructed movement, numerical evidence, model predictions and validation results will be presented to a human reviewer, who will make the final accept, reject or further-review decision.**

This preserves both sides of the project:

**Privacy-first:** original video does not need to be uploaded or retained.

**Trust-first:** no automated system gets the authority to declare community data correct.
