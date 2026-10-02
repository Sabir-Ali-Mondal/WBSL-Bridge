# PROJECT REPORT

**COOCH BEHAR GOVERNMENT ENGINEERING COLLEGE**
**DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING**

---

## WBSL Bridge: Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth

---

### STUDENT DETAILS

| | STUDENT 1 | STUDENT 2 | STUDENT 3 | STUDENT 4 |
|:---|:---|:---|:---|:---|
| **NAME** | **Sabir Ali Mondal** | **Koushaki Singha** | **Monirul Halder** | **Firdos Shakih** |
| **ROLL** | **34900123032** | **34900124074** | **34900123021** | **34900123011** |
| **SEMESTER** | **7th** | **7th** | **7th** | **7th** |

**MENTOR:** Prof. Prabir Kr. Naskar
**DEPARTMENT:** Computer Science & Engineering

---

## TITLE BREAKDOWN

| Phrase | What It Covers |
|:---|:---|
| **Intent-Aware** | Three layers of meaning capture: **(1)** Geometric NMM detection (eyebrow raise/furrow, head shake/nod, mouth open) for grammatical intent, **(2)** ViT-ONNX emotion detection (7-class) for affective context, **(3)** Combined NMM + emotion packet fed to constrained LLM — translating the signer's full communicative meaning, not just word-by-word gloss |
| **Bidirectional** | Forward: Sign → Bengali Text/Speech. Reverse: Bengali Text/Voice → Sign |
| **Deaf Community of West Bengal** | WBSL-specific (linguistically distinct from Delhi ISL and Bangladesh BdSL) |
| **Unknown Sign Handling** | Phase 5: OOD gate → movement analyzer → hybrid reasoning → "সম্ভবত" honesty |
| **Community-Driven Growth** | Phase 6 + Web Platform: privacy-first contribution, human verification, continuous retraining |

### What "Intent-Aware" Means in the Pipeline

```
Camera (30 FPS)
    │
    ▼
MediaPipe Holistic (540 landmarks)
    │
    ├──► Geometry NMM Detector
    │      Eyebrow Raise  → Yes/No Question
    │      Eyebrow Furrow → WH-Question
    │      Head Shake     → Negation
    │      Head Nod       → Affirmation
    │      Mouth Open     → Emphasis
    │      (deterministic, < 5ms, no ML model)
    │
    ├──► ViT-ONNX Emotion Classifier
    │      7-class probability output
    │      Supplementary affective context
    │      (robust to glasses, ~30–50ms)
    │
    └──► Sign Recognition (MLP / LSTM → ONNX)
           126-dim two-hand landmark vector
           Gloss sequence with confidence
    │
    ▼
Window-Based Intent Packet
{
    gloss:   "YOU + DRINK + WATER",
    nmm:     { question: false, negation: true },
    emotion: { dominant: "neutral", confidence: 72.3 }
}
    │
    ▼
Constrained LLM (gemma-4-E4B)
    │
    ▼
Natural Bengali Output
```

**NMMs carry grammar. Emotion carries tone. Together they carry intent.**

---

## ABSTRACT

Sign language conveys meaning holistically through simultaneous hand movements, facial expressions, and body posture, yet most existing systems translate signs word-by-word, losing the signer's true intention. In August 2026, Google DeepMind deployed SL2T as a consumer product on Pixel 11, proving real-time ASL-to-English translation at consumer scale using over 100,000 hours of data, MediaPipe Holistic landmark extraction, and direct landmark-to-text Transformer translation. However, the Deaf community of West Bengal remains entirely unserved: West Bengal Sign Language (WBSL) is linguistically proven distinct from both Delhi ISL and Bangladesh BdSL (Johnson & Johnson, 2016, *Sign Language Studies*, 16(4)), yet possesses only a static 170-sign Wikisigns lexical resource and zero dedicated AI, ML, or DL systems. Every existing "Bengali Sign Language" technology project originates from Bangladesh and targets Bangladesh BdSL—a linguistically separate sign language—not the WBSL used by the Deaf community in West Bengal, India.

This project, **WBSL Bridge**, presents a working, intent-aware, bidirectional communication framework addressing this complete technological void. The system extracts 540 hand, face, and body landmarks per frame via MediaPipe Holistic at 30 FPS. Facial emotion is classified using a HuggingFace ViT model exported to ONNX (replacing DeepFace due to glasses-related misclassification and TensorFlow dependency conflicts). Five geometry-based Non-Manual Markers (NMMs) are detected deterministically at sub-5ms latency. A 126-dimensional two-hand landmark representation, normalized against the right-wrist reference for signer independence, feeds an MLP classifier achieving 99.9% validation accuracy on static ISL recognition, exported to ONNX for real-time webcam inference.

For Bengali Natural Language Generation, six local GGUF models were empirically benchmarked. **gemma-4-E4B-it-Q4_K_M** was selected for deployment and **gemma-4-12b-it-Q4_0** as quality reference. A constrained NLG prompt enforcing 50 semantic criteria was engineered and stress-tested on a 450-token generation task. Bengali Text-to-Speech uses a dual-engine fallback chain: edge-tts (online primary, ~604 ms/word) and BanglaTTS (offline fallback, ~453 ms/word).

The project further designs two novel contributions: (1) an **Open-Set "Honesty Layer"** combining softmax probability, Mahalanobis embedding distance, and temporal consistency to detect unknown signs before LLM reasoning, with a three-tier movement representation and hybrid evidence-based reasoning; and (2) a **privacy-preserving community data verification framework** where only landmarks are submitted, automated checks produce evidence only, and human reviewers make final decisions in compliance with the DPDP Act 2023. A comprehensive live execution architecture with fast/slow path separation, velocity-dip sign segmentation, and signer-disjoint data indexing supports continuous real-time operation. A web platform is designed for community data collection, admin review, and model versioning.

All vision and inference modules run in a single Python 3.11 virtual environment on CPU, demonstrating that a functional, privacy-aware, bidirectional WBSL translation system is achievable on consumer hardware without cloud dependency.

---

## TABLE OF CONTENTS

1. Introduction
2. Literature Survey and State of the Art
3. Research Gaps (18 Verified Gaps)
4. Proposed System Architecture
5. Implementation: Vision and Feature Extraction (Phase 1)
6. Implementation: Static Sign Recognition Pipeline (Phase 2A)
7. Implementation: Bengali Natural Language Generation (Phase 3)
8. Implementation: Bengali Text-to-Speech (Phase 4)
9. Unknown Sign Detection and Semantic Interpretation (Phase 5)
10. Privacy-Preserving Community Data Verification (Phase 6)
11. Live Execution Architecture
12. Training Data Indexing and Management
13. Data Strategy and Collection Plan
14. Web Platform for Continuous Dataset Growth
15. Key Architectural Decisions
16. Results and Current Status
17. Evaluation Framework
18. Conclusion and Future Work
19. References

---

## 1. INTRODUCTION

### 1.1 Background and Motivation

Sign language is the primary communication medium for over 70 million Deaf and hard-of-hearing individuals worldwide. Unlike spoken languages, sign languages are fully-fledged visual-spatial languages with their own distinct grammar, syntax, and morphology. In India, the Deaf community relies heavily on Indian Sign Language (ISL) and its regional variations. However, the technological infrastructure to bridge the communication gap remains severely underdeveloped for regional languages.

### 1.2 The West Bengal Context: A Verified Technological Void

West Bengal Sign Language (WBSL) has been linguistically proven to be statistically distinct from both the Delhi variety of ISL and the Bangla Sign Language (BdSL) used in Bangladesh (Johnson & Johnson, 2016). The iSign benchmark (ACL 2024) acknowledges that "eastern regions like West Bengal have higher degree of variation" compared to Delhi.

Despite this recognized linguistic distinctness, an exhaustive search confirmed:

| What Was Searched | Result |
|:---|:---|
| Any AI/ML/DL project specifically for WBSL | **NOT FOUND** |
| Any WBSL video dataset for AI training | **NOT FOUND** |
| Any WBSL recognition system (CNN, LSTM, Transformer) | **NOT FOUND** |
| Any WBSL continuous signing recognition | **NOT FOUND** |
| Any WBSL → Bengali text translation system | **NOT FOUND** |
| Any Bengali text → WBSL reverse system | **NOT FOUND** |
| Any WBSL signer-independent evaluation | **NOT FOUND** |
| Any WBSL non-manual marker study | **NOT FOUND** |
| Any project from IIT KGP, JU, CU, IIEST, NIT Durgapur on WBSL | **NOT FOUND** |

The only existing WBSL resource is a static Wikisigns dictionary of 170 signs (Hamburg Sign Language Compendium). This represents a complete technological void for a linguistically recognized sign language.

### 1.3 The Intention Problem

The fundamental flaw in current sign language translation systems is the "word-by-word" approach. Sign language is a holistic modality where meaning is conveyed simultaneously through manual signs and Non-Manual Markers (NMMs). A raised eyebrow indicates a yes/no question; a head shake indicates negation. Systems that ignore these facial and bodily cues can translate the exact opposite of what the signer intended.

### 1.4 WBSL-Specific Linguistic Observations

During the course of this project, several WBSL-specific linguistic features were documented:

1. **Bangla Mouthing Dominance:** WBSL signers heavily mouth Bangla syllables alongside manual signs. The sign for "fish" (মাছ) requires lips to form the phonetic shape of "Maach." This is distinct from Delhi ISL which mouths Hindi.
2. **Single Head Tilt as Question Marker:** A sharp single side-tilt often means "Is it?" or "Really?" in WBSL, unlike the standard raised-eyebrow question marker used in Delhi ISL.
3. **Respectful Gaze Lowering:** WBSL signers briefly lower eye gaze when addressing elders or teachers. This is cultural rather than grammatical but affects attention interpretation.
4. **High-Emotion Facial Density:** WBSL uses more casual, high-emotion facial expressions compared to the formal standardized NMMs of Delhi ISL.

### 1.5 Positioning Against Google SL2T

Google DeepMind's SL2T (August 2026) demonstrates that continuous, real-time, signer-independent sign language translation is achievable at scale. However, SL2T targets ASL → English using 100,000+ hours of data on flagship hardware. The research question for WBSL Bridge is not whether real-time sign-to-text translation is possible—Google has proven it is. The question is:

> Can the architectural principles demonstrated at high-resource scale be adapted to a severely low-resource, linguistically distinct, regionally specific sign language (WBSL) with Bengali-language output, constrained LLM-based faithful translation, multimodal recognition, budget-device deployment, and bidirectional communication?

---

## 2. LITERATURE SURVEY AND STATE OF THE ART

### 2.1 Early Sensor-Based and Isolated Sign Systems

Sarker and Hoque (2018) from CUET developed a Bangla Sign Language conversion system using smart gloves. While pioneering, it was hardware-dependent and blind to facial expressions. Islam and Mousumi introduced Ishara-Lipi (2018), the first open-access dataset of isolated Bangla sign characters, cited over 88 times. It is limited to 50×36 static characters and cannot process continuous signing.

### 2.2 Vision-Based Recognition and National ISL Tools

The shift toward computer vision brought datasets like BdSLW60 (2024, 9,307 trials / 60 words) and BdSLW401 (2025, 102,176 sequences / 401 words). Academic systems like Akash et al. (2023) achieved real-time sentence formation using action recognition at IEEE ICREST. Recently, national tools like SignISL (deployed in Indian Railways) and Signer.AI (by IIIT Bangalore) have emerged, translating Standard ISL to Hindi/English. However, all these projects target Standard ISL or Bangladesh BdSL, leaving WBSL and Bengali output completely unaddressed.

### 2.3 Continuous Translation and the State of the Art

For continuous translation, the ISLTranslate dataset (2024, 30,000 ISL-English pairs) and the iSign benchmark (ACL 2024) represent progress for pan-Indian ISL, but output English only. Google DeepMind's SL2T (August 2026) deployed real-time ASL-to-English translation using 100,000+ hours of data, achieving 70 BLEURT on FLEURS-ASL. It targets ASL exclusively.

### 2.4 Facial Emotion Detection and Local LLM Advances

Facial emotion classification has matured with transformer-based models. The HuggingFace ecosystem provides pre-trained ViT models exportable to ONNX for lightweight inference. Quantization techniques (GGUF, Q4_K_M) and inference engines (KoboldCpp, llama.cpp) enable powerful LLMs to run on consumer hardware, with MoE architectures activating only a fraction of parameters per forward pass.

### 2.5 Open-Set Recognition

Open-set recognition has been addressed through OpenMax (Bendale & Boult, 2016), which modifies the softmax layer to include an "unknown" class, and conformal prediction (Shafer & Vovk, 2008), which provides statistically valid confidence sets. These inform the design of our unknown-sign detection gate.

### 2.6 Complete Dataset Landscape (August 2026)

| Dataset | Year | Origin | Type | Size | Continuous? | Bengali Text? | WBSL? |
|:---|:---|:---|:---|:---|:---|:---|:---|
| Ishara-Lipi | 2018 | Dhaka, BD | Isolated chars | 50×36 | ❌ | ❌ | ❌ |
| Muntakim Rafi Kaggle | ~2019 | Bangladesh | Static alphabets | 12,581 files | ❌ | ❌ | ❌ |
| BdSLW-11 | 2022 | Bangladesh | Word images | 1,105 | ❌ | ❌ | ❌ |
| BdSL47 (Depth) | 2023 | Bangladesh | Depth alphabets | Varies | ❌ | ❌ | ❌ |
| BDSL_49 | 2023 | Bangladesh | Alphabets+digits | 29,490 imgs | ❌ | ❌ | ❌ |
| KU-BdSL | 2023 | Khulna, BD | Hand signs | 1,500 / 39 signers | ❌ | ❌ | ❌ |
| BdSLW60 | 2024 | Bangladesh | Word video | 9,307 / 60 words | ⚠️ Words | ❌ | ❌ |
| BdSLW401 | 2025 | Bangladesh | Word video | 102,176 / 401 words | ⚠️ Words | ❌ | ❌ |
| ISLTranslate | 2024 | Pan-India | Continuous ISL | 30,000 pairs | ✅ | English only | ❌ |
| iSign | 2024 | Pan-India | ISL benchmark | Large-scale | ✅ | English only | ⚠️ |
| Wikisigns WBSL | Varies | West Bengal | Static dictionary | **170 signs** | ❌ | ❌ | ✅ Only WBSL |
| Google SL2T Data | 2026 | Global | Multi-language | **100,000+ hours** | ✅ | English only | ❌ |

**No dataset exists with continuous WBSL signing sequences, corresponding Bengali-language transcripts, West Bengal signers, non-manual marker annotations, or real-world environmental diversity.**

### 2.7 Competition Positioning

| Capability | Google SL2T | Microsoft/ProDeaf | CUET 2023 | WBSL Bridge |
|:---|:---|:---|:---|:---|
| Sign → Text | ✅ Deployed | ⚠️ Partial | ⚠️ Basic | 🔬 Proposed |
| Real-time | ✅ Deployed | ⚠️ Partial | ⚠️ Claimed | 🔬 Proposed |
| Consumer deployment | ✅ Pixel 11 | ⚠️ App | ❌ Lab only | 🔬 Proposed |
| ASL | ✅ Primary | ⚠️ Supported | ❌ No | ❌ No |
| WBSL | ❌ Not supported | ❌ Not supported | ❌ Not supported | 🎯 **Target** |
| Bengali output | ❌ No | ❌ No | ⚠️ Template | 🎯 **Target** |
| Constrained LLM integration | ❌ Not reported | ❌ No | ❌ No | 🎯 **Proposed** |
| Bidirectional communication | ❌ Not primary | ⚠️ Basic avatar | ❌ No | 🎯 **Core objective** |
| Non-manual markers | ⚠️ Holistic tracking | ❌ No | ❌ No | 🎯 **Proposed** |
| Budget-device deployment | ❌ Flagship only | ⚠️ Varies | ❌ Lab | 🎯 **Target** |
| Privacy-preserving community data | ⚠️ Landmarks only | ❌ No | ❌ No | 🎯 **Proposed** |
| Unknown sign handling | ❌ Not reported | ❌ No | ❌ No | 🎯 **Proposed** |

---

## 3. RESEARCH GAPS (18 VERIFIED GAPS)

Through exhaustive literature review and verification, 18 research gaps were identified and consolidated.

### 3.1 Original Gaps (G1–G12)

| ID | Gap | Status | Priority |
|:---|:---|:---|:---|
| G1 | Continuous WBSL Recognition | 🟢 ASL solved → 🔴 WBSL open | **P0** |
| G2 | Real-World Generalisation | 🟡 PARTIAL | P1 |
| G3 | Signer Independence | 🟢 ASL solved → 🔴 WBSL open | **P0** |
| G4 | West Bengal Regional Focus (WBSL) | 🔴 OPEN ✅ VERIFIED | **P0** |
| G5 | Continuous WBSL Dataset | 🟢 ASL solved → 🔴 WBSL critical | **P0** |
| G6 | WBSL → Bengali Translation | 🟢 ASL→Eng solved → 🔴 WBSL→Bn open | **P0** |
| G7 | Constrained LLM Integration | 🔴 OPEN | **P0** |
| G8 | Low-Latency on Budget Devices | 🟢 Flagship solved → 🟡 Budget open | P1 |
| G9 | Multimodal / Non-Manual Markers | 🟡 Architecture exists → 🔴 WBSL open | P1 |
| G10 | Bidirectional Communication | 🔴 OPEN | **P0** |
| G11 | Text/Speech → WBSL Generation | 🔴 CRITICAL AND WIDE OPEN | **P0** |
| G12 | Main Research Opportunity (Convergence) | 🔴 OPEN | **P0** |

### 3.2 Newly Discovered Gaps (G13–G18)

| ID | Gap | Discovery Source | Priority |
|:---|:---|:---|:---|
| G13 | Low-Resource Transfer Learning | Google's 100,000-hour requirement vs WBSL's near-zero data | **P0** |
| G14 | Gloss vs. End-to-End Architecture | Google SL2T's explicit rejection of glosses | P1 |
| G15 | WBSL vs. BdSL Linguistic Divide ✅ VERIFIED | Johnson & Johnson (2016) + exhaustive dataset mapping | **P0** |
| G16 | Bengali NLP for Sign Language Translation | SOV order, agglutination, honorifics, conjunct characters | P1 |
| G17 | Privacy-Preserving Processing for South Asia | Google's landmark-only approach + DPDP Act 2023 | P2 |
| G18 | Evaluation Metrics and Benchmarks for WBSL | No standardized evaluation exists | P1 |

### 3.3 Key Gap Details

**G4 (WBSL Regional Focus) — The Strongest Verified Gap:**
WBSL is linguistically DISTINCT from Delhi ISL (Johnson & Johnson, 2016). WBSL is DISTINCT from Bangladesh BdSL. iSign (ACL 2024) acknowledges higher variation in eastern regions. ALL "Bengali Sign Language" tech projects originate from Bangladesh. ZERO AI/ML/DL projects exist for WBSL. ZERO projects from WB universities (IIT KGP, JU, CU, IIEST, NIT Durgapur). Only WBSL resource: 170 Wikisigns entries.

**G13 (Low-Resource Transfer):**
This is a methodology gap, not just a data gap. Google proved scale works with 100,000+ hours. The question is: what works when you don't have scale? Can ISL→WBSL transfer learning work? Can landmark augmentation simulate signer diversity? Can few-shot methods learn WBSL signs from very few examples?

**G14 (Architecture Decision):**
Google explicitly rejected glosses: *"Glosses fail to capture rich, non-linear aspects of sign languages such as non-manual markers and spatial constructions."* But for WBSL with near-zero data, end-to-end is infeasible. A hybrid approach (Landmarks → Compact Representation → Constrained LLM → Bengali) is proposed.

**G16 (Bengali NLP Challenges):**

| Bengali Challenge | Impact on Translation |
|:---|:---|
| SOV word order (vs. English SVO) | Sign sequence must be reordered |
| Agglutinative morphology | Verb conjugations, case markers, postpositions |
| Honorific system (তুই/তুমি/আপনি) | Three formality levels; LLM must infer |
| Conjunct characters (যুক্তাক্ষর) | Script rendering complexity for TTS |
| No capitalization | Cannot use case for emphasis |
| Classifier predicates in sign | May not map cleanly to Bengali verb morphology |

### 3.4 Consolidated Summary

- 🔴 OPEN: 14 gaps
- 🟡 PARTIAL: 3 gaps
- 🟢 SOLVED (ASL only): 1 gap (reframed)
- ✅ VERIFIED through exhaustive search: 2 gaps (G4, G15)
- P0 (Critical): 10 gaps
- P1 (High): 6 gaps
- P2 (Medium): 2 gaps

---

## 4. PROPOSED SYSTEM ARCHITECTURE

### 4.1 Forward Path: Sign to Bengali

```
Webcam Input (30 FPS)
    │
    ▼
MediaPipe Holistic
    │
    ▼
Extract 540 Landmarks
  ├─ Hands: 21 × 2 = 42 landmarks (126-dim normalized vector)
  ├─ Face: 468 landmarks
  └─ Pose: 33 landmarks
    │
    ▼
Three Parallel Processing Modules:
    │
    ├─ 1. ViT-ONNX Emotion Classifier
    │     → 7-class emotion probabilities
    │     → Supplementary context layer
    │
    ├─ 2. Geometry NMM Detector (5 markers)
    │     → Eyebrow raise = Yes/No question
    │     → Eyebrow furrow = WH-question
    │     → Head shake = Negation
    │     → Head nod = Affirmation
    │     → Mouth open = Emphasis
    │     → < 5ms latency, pure geometry, no ML
    │
    └─ 3. Sign Recognition (MLP / LSTM → ONNX)
          → 126-dim two-hand landmark vector
          → Right-wrist reference normalization
          → Sign gloss sequence with confidence
    │
    ▼
Open-Set Gate (Honesty Layer)
    │
    ├─ KNOWN → Sign gloss + NMM + emotion packet
    │
    └─ UNKNOWN → Movement Analyzer → Hybrid Reasoning
                  → Top-3 candidate interpretations
                  → Queued for community labeling
    │
    ▼
Window-Based Intent Packet Assembly
  → Gloss sequence + NMM flags + emotion markers
  → Time-aligned per semantic window
    │
    ▼
Constrained LLM (gemma-4-E4B via KoboldCpp)
  → 50-criteria constrained NLG prompt
  → Preserves question/negation/WHETHER/IF-THEN scope
  → Natural West Bengal Bengali output
    │
    ▼
Dual-Engine Bengali TTS
  ├─ Primary: edge-tts (online, ~604 ms/word)
  └─ Fallback: BanglaTTS (offline, ~453 ms/word)
    │
    ▼
Spoken Bengali Audio + Displayed Text
```

### 4.2 Reverse Path: Bengali to Sign

```
Bengali Text / Speech Input
    │
    ▼
React UI (Input Interface)
    │
    ▼
FastAPI Backend (/generate-sign endpoint)
  → LLM converts Bengali text to gloss JSON
    │
    ▼
Sign Gloss Sequence
  → Ordered sequence of required signs
    │
    ▼
Sign Video Mapping
  → Each gloss mapped to Admin-approved reference video
    │
    ▼
Continuous Video Playback
  → Videos play sequentially as single presentation
  → e.g., [I.mp4] → [Drink.mp4] → [Water.mp4]
    │
    ▼
React UI (Display Interface)
```

### 4.3 Key Architectural Innovations

1. **Landmark-Based Signer Independence:** Training on 126-dim normalized landmarks rather than raw images removes skin color, background, lighting, and scale bias.
2. **ViT-ONNX Emotion Detection:** Replaces DeepFace to eliminate TensorFlow dependency conflicts and glasses-related misclassification.
3. **Deterministic Geometry NMMs:** Five grammatical markers detected via pure landmark geometry at sub-5ms latency.
4. **Constrained NLG Prompt:** Explicit rules for question scope, negation scope, WHETHER embedding, IF/THEN preservation, and anti-hallucination.
5. **Dual-Engine TTS Fallback:** Automatic edge-tts → BanglaTTS chain guarantees Bengali speech in both online and offline environments.
6. **Open-Set Honesty Layer:** Recognition model decides KNOWN vs. UNKNOWN before LLM reasoning. LLM never sees raw landmarks.
7. **Privacy-First Community Verification:** Only landmarks submitted; raw video discarded on-device. DPDP Act 2023 compliant.
8. **Fast/Slow Path Separation:** Real-time recognition runs in the fast path; heavy LLM reasoning runs asynchronously in the slow path.
9. **Signer-Disjoint Data Indexing:** Training data indexed by provenance, signer, and verification status to prevent evaluation leakage.

### 4.4 Design Rationale: Simplified Fusion over Multi-Model Pipeline

Word/clause-level fusion of gloss, NMM, and affect streams would require three separate models running in parallel, each with its own training data and timestamps, plus a fusion layer to align outputs and resolve conflicts. Building and maintaining that pipeline is a high-budget, multi-team effort realistic for a well-funded research lab. For this project, NMM and emotion are treated as simplified, deterministically-extracted inputs to the NLG layer. The full fusion architecture is documented as future work.

---

## 5. IMPLEMENTATION: VISION AND FEATURE EXTRACTION (PHASE 1)

### 5.1 MediaPipe Holistic Stream (MVT 1.1)

MediaPipe Holistic extracts 540 landmarks per frame: 42 hand landmarks (21 per hand), 468 face mesh landmarks, and 33 pose landmarks. The system achieves stable 30 FPS on CPU.

**Critical Implementation Details:**
- MediaPipe package pinned to version 0.10.14 (unpinned install resolves to unrelated dummy package 1.0.1)
- Python 3.11 enforced (Python 3.12+ not fully supported by MediaPipe)
- All modules run in a single `.venv` virtual environment
- Internal C++ backend and Protobuf warnings are harmless and do not affect functionality

### 5.2 ViT-ONNX Emotion Detection (MVT 1.2b)

#### 5.2.1 Why DeepFace Was Replaced

During initial testing, the DeepFace library (FER2013 model) consistently misclassified emotions when the user wore glasses, locking onto "fear" due to shadow artifacts around the eyes. Furthermore, TensorFlow 2.13 created a hard dependency conflict with MediaPipe and JAX in the same virtual environment, requiring a separate `.venv-deepface`.

#### 5.2.2 Solution

The HuggingFace ViT-based emotion model (`trpakov/vit-face-expression`) was exported to ONNX format and runs via `onnxruntime` in the main virtual environment.

**Export Pipeline:**
1. Load pre-trained ViT model from HuggingFace
2. Export to ONNX with dynamic batch axis (opset 18)
3. Save label mapping (7 classes: angry, disgust, fear, happy, neutral, sad, surprise)

**Live Inference:**
- Preprocessing: Resize to 224×224, BGR→RGB, ImageNet normalization (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
- Inference: ONNX Runtime CPUExecutionProvider, every 10th frame
- Output: 7-class emotion probabilities with visual bars
- Robust to glasses and varying lighting conditions

#### 5.2.3 Architectural Insight

During live testing, generic emotional states do not reliably map to linguistic intent in sign language. Sign language relies on specific, deliberate facial movements (NMMs) rather than sustained emotional expressions. **Conclusion:** Emotion detection serves as a supplementary context layer. Core grammatical intent relies on geometric NMM detection.

### 5.3 Geometry-Based NMM Detection (MVT 1.3)

Five Non-Manual Markers are detected using pure landmark geometry:

| NMM | Grammatical Function | Detection Method | Threshold |
|:---|:---|:---|:---|
| Eyebrow Raise | Yes/No questions, topicalization | Mean brow-eye distance / face width | > 0.060 |
| Eyebrow Furrow | WH-questions (who, what, where) | Mean brow-eye distance / face width | < 0.040 |
| Head Shake (L-R) | Negation, denial | Nose X variance over 15 frames | > 0.0008 |
| Head Nod (U-D) | Affirmation, agreement | Nose Y variance over 15 frames | > 0.0008 |
| Mouth Open | Emphasis, size/quantity | Upper-lower lip distance / face width | > 0.040 |

**Landmark indices used:** Left eyebrow [70, 63, 105, 66, 107], Right eyebrow [300, 293, 334, 296, 336], Left eye [159, 145], Right eye [386, 374], Upper lip [13], Lower lip [14], Nose tip [1], Face width reference [234, 454].

All distances normalized by face width for scale invariance. Inference latency: < 5ms per frame (pure mathematical computation).

### 5.4 Full NMM Taxonomy

**Geometry-Based (Implementable Without ML):** Eyebrow raise, eyebrow furrow, head shake, head nod, mouth open, eye widening, lip press/tighten, cheek puff, head tilt (single side—WBSL-specific), shoulder raise, body lean.

**ML-Dependent (Requires Trained Classifier):** Mouthing (silent Bangla words—critical for WBSL due to Bangla influence), tongue protrusion, "আরে" expression (squint + parted lips—WBSL culturally specific). These require labeled training data from the WBSL community and are documented as future work.

### 5.5 Planned NMM Improvements

- Threshold calibration across multiple face distances, angles, and lighting conditions
- Hysteresis/debouncing to prevent flags from flickering on/off rapidly
- WBSL-specific head tilt detection
- Recording 50–100 sentences from Deaf participants with NMM annotations

---

## 6. IMPLEMENTATION: STATIC SIGN RECOGNITION PIPELINE (PHASE 2A)

### 6.1 Motivation

Before building the temporal LSTM for continuous signs, the landmark extraction pipeline was validated using static ISL alphabet and number recognition. This proves that the 126-dim representation is discriminative, signer-independent, and deployable via ONNX.

### 6.2 Feature Design: 126-Dimensional Two-Hand Vector

| Component | Dimensions | Description |
|:---|:---|:---|
| Left hand | 63 (21 × 3) | x, y, z per landmark |
| Right hand | 63 (21 × 3) | x, y, z per landmark |
| **Total** | **126** | Concatenated, normalized |

**Normalization Strategy:**
- **Reference:** Right wrist (preferred) or left wrist (fallback)
- **Translation:** Subtract reference wrist from all landmarks (removes global position)
- **Scale:** Divide by reference hand size (wrist to middle-finger MCP distance)
- **Missing hand:** Zero-padded
- **Handedness slotting:** Left block first, Right block second (by MediaPipe handedness label)

**Why Landmarks Instead of Raw Images:**

| Factor | Raw Image CNN | Landmark MLP |
|:---|:---|:---|
| Skin color / background / lighting | Model memorizes them | Removed |
| Hand size / camera distance | Domain gap | Normalized out |
| Matches production pipeline | No | Yes |
| Signer independence | Weak | Strong |

### 6.3 Pipeline

| Stage | Function | Output |
|:---|:---|:---|
| Convert | Images → 126-dim landmarks via MediaPipe Hands (max_num_hands=2, static_image_mode) | `dataset_landmarks/*.npy` |
| Train | MLP (126→256→128→35), ReLU, Dropout(0.3), 50 epochs, Adam(lr=0.001), batch=128 | `sign_mlp.onnx` + `sign_classes.json` |
| Live | Webcam → extract → ONNX inference → 10-frame majority vote | On-screen prediction |

### 6.4 Results

- **Validation Accuracy:** 99.9% on the landmark subset (85/15 train/val split)
- **Two-hand detection fix:** Letters Q improved from 137/300 to near-full detection; P improved from 254/300 to full detection
- **Live inference:** Recognizes most letters and numbers correctly with majority-vote smoothing
- **ONNX inference:** Sub-5ms per frame on CPU
- **35 classes**, ~300 samples each, 126-dim

### 6.5 Observed Limitations and Planned Augmentation

| Issue | Cause | Current Mitigation | Planned Fix |
|:---|:---|:---|:---|
| Mirror effect | Selfie view vs dataset handedness | Process unflipped frames | Mirror augmentation (swap hands + flip x) |
| In-plane angle | Hand tilt changes coordinates | None | Rotation augmentation (±0.3 rad) |
| Distance residual | Scale normalization imperfect | Scale normalization | Jitter augmentation (σ=0.01) |
| Occlusion | Detector fails, zero block | Zero-padding | Hand-dropout augmentation (10% prob) |

### 6.6 Consistency Rules (Enforced Across All Stages)

1. Never flip the frame before MediaPipe processing
2. Use identical `extract_two_hands()` in convert and live stages
3. Always use right-wrist-preferred reference with identical scale normalization
4. Keep handedness slotting identical (Left block first, Right block second)

### 6.7 Role in Final System

Static MLP handles fingerspelling, names, and numbers. Continuous LSTM (Phase 2B) handles dynamic signs and sentences. Both share the same normalized landmark representation and can be fused later.

---

## 7. IMPLEMENTATION: BENGALI NATURAL LANGUAGE GENERATION (PHASE 3)

### 7.1 Model Benchmarking

Six local GGUF models were evaluated for Bengali NLG quality:

| Model | Result | Observation |
|:---|:---|:---|
| gemma-4-12b-it-Q4_0 | **Best Quality / Reference** | Best Bengali and semantic consistency; ~97% manual accuracy; ~13 GB RAM |
| gemma-4-E4B-it-Q4_K_M | **Selected for Deployment** | Very good Bengali, lower RAM, faster CPU inference |
| gpt-oss-20b-Q4_K_M | Failed | Poor Bengali quality |
| Qwen3.6-35B-A3B-UD-IQ2_M | Failed | Poor Bengali for this task |
| Qwen3.5-9B-UD-IQ3_XXS | Failed | Poor Bengali quality |
| gemma-4-26B-A4B-it-UD-IQ2_M | Failed | Memory limit exceeded |

### 7.2 Constrained NLG Prompt Engineering

A comprehensive prompt was engineered with the following constraint categories:

| Category | Rules Enforced |
|:---|:---|
| Question scope | `[?]` marks ONE direct-question boundary only; no spurious question conversion |
| Negation scope | Local to marked semantic unit; no double negation; no general negative state |
| WHETHER embedding | Introduces embedded question ("কি না"); must not convert earlier statements |
| IF/THEN/OTHERWISE | Preserved as conditional structures |
| Event segmentation | Ordered semantic events; no merging when meaning changes |
| Speaker binding | Explicit subject controls speech event; multiple speakers tracked |
| Temporal consistency | Past time markers keep related events in past; BEFORE/AFTER/UNTIL scope |
| Emotion markers | 7 types (happy, sad, angry, neutral, surprise, fear, disgust) |
| Honorifics | Correct Bengali pronouns, case markers, postpositions |
| Anti-hallucination | No invented names, places, objects, causes, time, relationships |
| Symbol guide | Bengali punctuation, digit conversion (1→১, 56→৫৬) |

### 7.3 Validation Tests

**Small Test:**
- Input: `YOU + TOMORROW + SCHOOL + GO[negation][?]`
- Output: `তুমি কি আগামীকাল স্কুলে যাবে না?`
- Validates: question scope + negation scope + subject preservation

**Long Semantic Stress Test (450 tokens, 50 criteria):**
Covers: events, tense, time (8:30 AM, 10:35 AM, 5 PM, two-day-ago, tomorrow, next-week), numbers, percentages (60%, 85%, 100%), direct questions, embedded WHETHER, local negation, CAN/CANNOT/MAY/MUST/SHOULD, IF/THEN/OTHERWISE, BEFORE/AFTER/UNTIL, reported speech, multiple speakers, 7 emotion types, Bengali punctuation, no hallucination.

**Test Configuration:** max_context_length: 32768, max_length: 1536, temperature: 0.75, top_p: 0.92, top_k: 100, rep_pen: 1.05

### 7.4 Performance Metrics (Deployment Model)

| Metric | Value |
|:---|:---|
| Prompt processing | ~37.84 tokens/second |
| Generation | ~5.76 tokens/second |
| Total time (long test) | ~132 seconds |
| Generated tokens | ~450 |

### 7.5 Output Quality Assessment

| Aspect | Rating |
|:---|:---|
| Bengali fluency | Good |
| Question handling | Good / imperfect |
| Negation handling | Moderate |
| Speaker tracking | Moderate |
| IF/THEN preservation | Moderate |
| WHETHER scope | Moderate |
| Long-range semantics | Moderate |
| No hallucination | Fairly good |

### 7.6 Identified Weakness

Semantic scope tracking (negation scope, speaker binding, WHETHER scope, IF/THEN scope, event segmentation, tense consistency) is the primary remaining weakness. Bengali fluency and speed are acceptable. Future improvement priority is scope accuracy, not fluency.

---

## 8. IMPLEMENTATION: BENGALI TEXT-TO-SPEECH (PHASE 4)

### 8.1 Problem

Windows has no built-in Bengali voice (SAPI includes only English voices: David and Zira). sherpa-onnx confirmed unusable (no Bengali model available). Mobile devices have Bengali TTS natively, but the desktop project requires a working solution.

### 8.2 Dual-Engine Solution

| Engine | Role | Internet | Quality | Punctuation |
|:---|:---|:---|:---|:---|
| edge-tts (bn-BD-NabanitaNeural) | PRIMARY | Required | Best, natural | Handles correctly |
| BanglaTTS (silero model) | OFFLINE FALLBACK | Not required | Good | Does NOT handle |

### 8.3 Measured Timing (Same Example Text: 18 words, 86 characters)

| Metric | edge-tts | BanglaTTS |
|:---|:---|:---|
| Generation time | ~2500 ms | ~2393 ms (after cache) |
| Model load | None (server-side) | ~1188 ms |
| Audio duration | 10872 ms | 8150 ms |
| Ms per word | ~604 ms | ~453 ms |
| Ms per character | ~126 ms | ~95 ms |
| RAM usage | ~50 MB | ~500 MB – 1 GB |

### 8.4 Known Limitation and Mitigation

BanglaTTS ignores punctuation marks (comma, full stop, question mark, Bengali danda ।)। **Mitigation:** Punctuation is programmatically cleaned via regex before passing text to BanglaTTS in the fallback path.

### 8.5 Automatic Fallback Chain

The system attempts edge-tts first. If it fails (no internet), it automatically falls back to BanglaTTS with cleaned text. The caller receives the audio file path regardless of which engine succeeded.

### 8.6 Timing Constants for Real-Time System

The UI shows the Bengali text immediately and displays an estimated speaking duration while audio generates in the background.

---

## 9. UNKNOWN SIGN DETECTION AND SEMANTIC INTERPRETATION (PHASE 5)

### 9.1 Motivation

Current sign language translation systems suffer from a critical flaw: when encountering a sign not in their vocabulary, they confidently output an incorrect translation. This "confident hallucination" is particularly dangerous in communication-critical contexts. For low-resource WBSL, unknown and regional signs are the norm, not the exception.

### 9.2 Research Gap Statement

> Existing sign-language research covers continuous recognition, open-set/OOD detection, context-aware modelling, and LLM-assisted translation as separate topics. What is missing is a lightweight framework that, after an explicit open-set decision, converts an unfamiliar sign's landmark sequence into structured, human-interpretable movement representations, combines them with linguistic context and retrieval evidence, and generates ranked tentative semantic hypotheses instead of a forced classification.

### 9.3 Novelty Claim (Defensible)

> We propose an uncertainty-aware unknown-sign interpretation framework in which an open-set sign recognizer first detects vocabulary mismatch, after which the unfamiliar sign is converted into structured, human-interpretable movement representations and combined with linguistic context and similarity retrieval to generate and rank tentative semantic hypotheses.

The individual technologies are not new. The novelty is the specific pipeline: open-set gate → interpretable movement representation → hybrid evidence-based reasoning → tentative interpretation → human verification loop, designed for offline, low-resource, regional WBSL.

### 9.4 Architecture

```
CAMERA → MediaPipe → landmarks
    → Temporal Sign Encoder → probabilities + embedding
    → OOD GATE (max_prob + embedding distance + temporal consistency)
        │
        KNOWN → gloss stream
        │
        UNKNOWN → Movement Analyzer (geometry only, no ML)
            → Level 1: numerical features
            → Level 2: symbolic tags
            → Level 3: natural-language paragraph
            → Context Window (prev/next glosses)
            → Similarity Search (known-sign database)
            → Local LLM (JSON candidates, temp ~0.3)
            → Context Re-scorer (gloss n-gram prior)
            → tentative gloss + UNCERTAIN flag
            → Bengali NLG with "সম্ভবত" marker
            → Unknown Queue → community labeling → retraining
```

### 9.5 Three-Level Movement Representation

**Level 1 — Numerical:**
```
finger_extension = 1 → 0
finger_count = 1
velocity = 0.42
duration = 0.81 s
repetition = 2
distance_to_mouth = 0.16
```

**Level 2 — Symbolic:**
```
RIGHT_HAND INDEX_EXTENDED → ALL_CLOSED HAND_ROTATION REPEATED_2X NO_NMM
```

**Level 3 — Natural Language:**
> The signer extends one finger with the right hand, rotates the hand, and then closes all fingers. The sequence is repeated twice.

All three levels are generated automatically from landmarks. The LLM receives all three plus context plus retrieved similar signs.

### 9.6 Detection Enhancement Techniques

| Technique | Purpose | Source |
|:---|:---|:---|
| Confidence threshold on validation data | Baseline UNKNOWN gate | This project |
| Temperature scaling | Calibrate confidences | Guo et al., ICML 2017 |
| Embedding distance (Mahalanobis) to class centroids | Catch confidently-wrong predictions | Lee et al., NeurIPS 2018 |
| Energy-based OOD score | Stronger than softmax max | Liu et al., NeurIPS 2020 |
| Conformal prediction | Candidate set with statistical guarantee | Shafer & Vovk, JMLR 2008 |
| OpenMax-style open-set scoring | Class + unknown probability | Bendale & Boult, CVPR 2016 |
| Temporal consistency (prediction variance) | Known signs stabilize; unknown flicker | This project |

### 9.7 Why Hybrid Reasoning (Not LLM Alone)

```
Similarity Search + Rule/Feature Reasoning + LLM Reasoning
    └──────────────────┬──────────────────┘
              Candidate Pool
                  ↓
           Context Ranking
                  ↓
     Final Candidates (tentative)
```

- LLM alone can hallucinate
- Similarity search alone is context-blind
- Rules alone are brittle
- Combined, the LLM reasons over evidence instead of inventing meaning

### 9.8 Output Terminology and Honesty

- Output is called **candidate semantic interpretation** or **tentative semantic hypothesis**, never "predicted meaning"
- Every unknown output carries: `STATUS: TENTATIVE — HUMAN VERIFICATION REQUIRED`
- Iconic signs (repeated movement toward mouth → DRINK/EAT) can be guessed; arbitrary signs (community-specific TRAIN) cannot be inferred from movement alone
- The Bengali NLG automatically injects **সম্ভবত** (probably) wherever a sign was UNKNOWN

### 9.9 Ablation Study Plan

Test conditions: numerical only / symbolic only / natural language only / numerical+symbolic / symbolic+natural / all three. Metrics: top-1 accuracy, top-3 candidate recall, hallucination rate, confidence calibration, latency, RAM usage, offline capability.

### 9.10 Local LLM Constraint

- LLM never sees raw landmarks
- Guessing is text reasoning over symbolic descriptions
- Local gemma-4-E4B (KoboldCpp) is sufficient
- Constrained JSON output, temperature ~0.3, top-3 candidates with evidence

---

## 10. PRIVACY-PRESERVING COMMUNITY DATA VERIFICATION (PHASE 6)

### 10.1 Core Principle

> **Automated scores provide evidence, not approval.** No matter how high the validation score is (even 99/100), the system must not automatically accept the sample. Only a human-approved sample can enter the trusted dataset.

### 10.2 Privacy-First Submission

```
User Device → Camera → MediaPipe → Landmark Extraction
→ 540 Landmark Sequence → Local Preprocessing
→ Original Video Deleted → Required Data Submitted
```

The server does not need the original video. Landmark data should not automatically be considered completely anonymous—detailed landmark sequences can still contain signer information. The system submits only information required for verification.

### 10.3 Required Submission Metadata (DPDP Act 2023 Compliance)

Every submission must include:
- Signer consent confirmation (opt-in checkbox)
- Data ownership declaration
- Timestamp and device type
- Reviewer decision history
- Provenance ID for audit trail

### 10.4 Automatic Validation (Evidence Only)

| Check | Method |
|:---|:---|
| Geometric validity | Joint positions, finger geometry, bone distances, abnormal coordinates |
| Velocity and acceleration | v_t = ‖p_t - p_{t-1}‖ / Δt; flag extreme values |
| Temporal consistency | Frame progression, suspicious jumps |
| Model consistency | Compare submitted label with recognition model prediction |
| Synthetic-data detection | Flag unnaturally smooth trajectories lacking natural micro-jitter |

### 10.5 Similarity Analysis

Mahalanobis distance: D_M(x) = √((x-μ)^T Σ^{-1} (x-μ))

High distance means "Unusual sample — review carefully," never "Fake sample — automatically reject."

### 10.6 Simulation / Visual Reconstruction

Landmark sequences reconstructed as animated 2D/3D skeleton with full 21-point handshape fidelity. The reviewer can watch the frames as a simulated signing movement.

**Handshape fidelity requirement:** Semantic meaning depends heavily on handshape, not just arm motion. The skeleton replay must render all 21 landmarks per hand clearly so the reviewer can see finger configuration.

**Critical limitation:** Simulation can answer "What movement does this represent?" but cannot guarantee "This movement really means DRINK." Physical validity ≠ Semantic correctness. The semantic decision remains with the human reviewer.

### 10.7 Human Verification Interface

The reviewer receives a complete evidence panel:
- Simulated sign animation with play control
- Movement description (natural language)
- Symbolic tags (handshape, direction, repetition)
- Numerical features (duration, repetition count, movement distance)
- Model prediction with confidence scores
- Validation evidence scores (geometry, temporal, similarity, label agreement)
- Three decision buttons: ACCEPT / REJECT / NEEDS REVIEW

**Explicit rule displayed:** "Validation scores are advisory evidence only. They do not automatically approve or reject this submission."

### 10.8 Three Human Decisions

| Decision | Flow |
|:---|:---|
| ACCEPT | Submission → Human ACCEPT → Trusted Dataset → Future Training |
| REJECT | Submission → Human REJECT → Not used for training |
| NEEDS REVIEW | Submission → Second reviewer / WBSL expert → 2-of-3 consensus |

### 10.9 Legal Compliance (DPDP Act 2023)

- Collecting only landmarks, never raw video
- Requiring explicit signer consent before submission
- Allowing contributors to request data deletion
- Storing no personally identifiable visual information
- Using submitted data only for research and model improvement

### 10.10 Privacy vs Verification Tradeoff

Deleting the original video protects privacy but removes one source of truth. In rare cases where landmarks alone are ambiguous, the system flags the sample as NEEDS REVIEW rather than guessing. Privacy is preserved by default; clarity is resolved by humans, never by re-collecting video.

### 10.11 Research Questions

1. Can privacy-preserving landmark reconstruction provide sufficient visual and numerical evidence for human experts to verify community-contributed sign-language data without requiring the original video?
2. How effectively can automated validation scores assist human reviewers without replacing human decision-making?

---

## 11. LIVE EXECUTION ARCHITECTURE

### 11.1 Fast Path vs Slow Path

The key design rule: **split the pipeline into a FAST path and a SLOW path.** The LLM is slow, so it cannot run in the real-time loop.

| Path | Contents | Frequency |
|:---|:---|:---|
| FAST (real-time) | Camera → MediaPipe → Buffer → Temporal Encoder → OOD Gate → KNOWN emit | Every frame / every window |
| SLOW (background) | UNKNOWN signs → Movement Analyzer → LLM reasoning → Candidate meanings | Per UNKNOWN sign only |

Known signs appear instantly. Unknown signs show "[UNCLASSIFIED - analyzing...]" first, then update to candidates when the LLM finishes.

### 11.2 Velocity-Dip Sign Segmentation

Continuous signing has no spaces between signs. Signs are separated by brief pauses or slowdowns, detected from wrist velocity:

```
Wrist velocity over time:
HIGH   ┌──┐    ┌──┐       ┌──┐
       │  │    │  │       │  │      ← movement = inside a sign
LOW ───┘  └────┘  └───────┘  └──    ← dip = boundary between signs
      sign1  gap  sign2  gap  sign3
```

Rule: when wrist velocity stays below a threshold for K consecutive frames, mark a sign boundary.

### 11.3 Sliding Window with Overlap

- Window size: 45 frames (~1.5 sec at 30 FPS)
- Stride: 22 frames (50% overlap)
- Prevents cutting a sign in half

### 11.4 Stream Alignment with Timestamps

Every packet tagged with timestamp:
```json
{
    "window_id": 9,
    "timestamp": [15.1, 16.9],
    "gloss": "...",
    "nmm": "nmm_at(timestamp)",
    "emotion": "emotion_at(timestamp)"
}
```

### 11.5 Timing Budget

| Component | Frequency | Latency Budget |
|:---|:---|:---|
| MediaPipe landmark extraction | Every frame (30 FPS) | < 35 ms |
| Buffer + segmentation | Every frame | < 5 ms |
| Temporal encoder + OOD gate | Per window (~1.5 sec) | < 50 ms |
| Movement analyzer | Per UNKNOWN sign | < 20 ms |
| LLM candidate reasoning | Per UNKNOWN sign (async) | 2–10 sec |
| Bengali NLG | Per sentence | 3–130 sec |

### 11.6 Output Format

**KNOWN sign output:**
```json
{
    "window_id": 7,
    "timestamp": [12.4, 13.8],
    "type": "KNOWN",
    "gloss": "WATER",
    "confidence": 0.91,
    "nmm": {"question": false, "negation": false},
    "emotion": "neutral"
}
```

**UNKNOWN sign output:**
```json
{
    "window_id": 9,
    "timestamp": [15.1, 16.9],
    "type": "UNKNOWN",
    "gloss": "[UNCLASSIFIED]",
    "confidence": 0.31,
    "movement": {
        "numerical": {
            "finger_extension": 0.92,
            "wrist_velocity": 0.42,
            "repetition": 3,
            "distance_to_mouth": 0.16,
            "duration_s": 0.81
        },
        "symbolic": ["RIGHT_HAND", "INDEX_EXTENDED", "TOWARD_MOUTH", "REPEATED_3X", "NO_NMM"],
        "natural_language": "The right hand starts near the chest, moves upward toward the mouth, pauses briefly, and returns. The movement is repeated three times."
    },
    "context": {"prev": "YOU", "next": "WATER"},
    "candidates": [
        {"meaning": "DRINK", "confidence": 0.45, "evidence": "Repeated movement toward mouth + context WATER"},
        {"meaning": "EAT", "confidence": 0.25, "evidence": "Mouth-directed movement"},
        {"meaning": "THIRSTY", "confidence": 0.15, "evidence": "Contextual relation to WATER"}
    ],
    "status": "TENTATIVE - HUMAN VERIFICATION REQUIRED"
}
```

### 11.7 Honesty Flow into Bengali

Because the UNKNOWN sign carries `status: TENTATIVE`, the NLG prompt adds the uncertainty marker. The Bengali output becomes: `তুমি সম্ভবত পান করছ, জল।` The word **সম্ভবত** (probably) is injected automatically. Honesty flows from the OOD gate all the way into the final Bengali sentence.

---

## 12. TRAINING DATA INDEXING AND MANAGEMENT

### 12.1 Core Principle

> **Index training data by provenance and signer, not just by label.**

A label-only index (e.g., `DRINK.npy`) is enough to train, but cannot support signer-independent evaluation, verification filtering, similarity search, or safe retraining.

### 12.2 The Manifest (Source of Truth)

A single `manifest.jsonl` file—one JSON record per sample:

```json
{
    "sample_id": "v003_DRINK_S07_20260901T143205_r02",
    "label": "DRINK",
    "signer_id": "S07",
    "split": "train",
    "source": "community",
    "verification": "accepted",
    "verified_by": "R02",
    "captured_at": "2026-09-01T14:32:05Z",
    "frames": 45,
    "landmark_path": "samples/DRINK/S07/v003_DRINK_S07_20260901T143205_r02.npy",
    "embedding_row": 1234,
    "augmentation_of": null
}
```

| Field | Why It Exists |
|:---|:---|
| `sample_id` | Globally unique, human-readable. Encodes version + label + signer + time |
| `label` | The gloss |
| `signer_id` | Anonymized signer. Required for signer-disjoint splits |
| `split` | train / val / test. Assigned by signer, never randomly per sample |
| `source` | original / community / unknown_queue_promoted |
| `verification` | pending / accepted / rejected / needs_review. Train only on accepted |
| `embedding_row` | Row index into embedding matrix for similarity search |
| `augmentation_of` | Links augmented copies to their source sample |

### 12.3 Signer-Disjoint Splits (The #1 Rule)

Never split randomly by sample. Split by signer, so a test signer never appears in training. Otherwise the model memorizes signer-specific features and accuracy numbers are fake.

Every sample inherits its signer's split. Test signers must never appear in train.

### 12.4 Embedding Index

After training the temporal encoder, extract embeddings for every **accepted** sample:
- `embeddings.npy`: N × D matrix
- `ids.json`: row index → sample_id

Derived structures:
- **Per-class centroid + covariance:** For Mahalanobis OOD gate (KNOWN vs UNKNOWN)
- **k-NN index:** For similarity search over unknown signs and community submissions

Rebuild this index every time the dataset version changes.

### 12.5 Dataset and Model Versioning

```
dataset/
├── manifest.jsonl              ← the index (source of truth)
├── splits.json                 ← signer → split assignment
├── embeddings/
│   ├── v003_embeddings.npy
│   └── v003_ids.json
├── samples/
│   └── {label}/{signer_id}/{sample_id}.npy
└── models/
    └── v003/
        ├── model.onnx
        └── training_config.json
```

`training_config.json` records which `dataset_version` produced the model, ensuring traceability.

### 12.6 Indexing Mistakes to Avoid

| Mistake | Consequence | Fix |
|:---|:---|:---|
| Random per-sample split | Test signer leaks into train; inflated accuracy | Signer-disjoint split |
| Training on unverified community data | Model poisoned by wrong labels | Filter `verification == accepted` |
| Augmented copies in wrong split | Train/test leakage | Augmented sample inherits source's split |
| Label-only index | Cannot track signer, provenance, verification | Full manifest with metadata |
| Rebuilding embeddings without versioning | Similarity search uses stale vectors | Version the embedding index |

---

## 13. DATA STRATEGY AND COLLECTION PLAN

### 13.1 Data Pipeline Overview

```
ISL Data + WBSL Data → Data Collection → Clean + Remove Duplicates
→ Language Label (ISL / WBSL) → Gloss + Bengali Text Annotation
→ Hand + Face + Body Feature Extraction (MediaPipe)
→ Train / Validation / Test Split → Sign Recognition / Translation
```

### 13.2 Minimum Initial Data Requirements

| Category | Requirement |
|:---|:---|
| WBSL signs | 100–200 |
| WBSL signers | 5+ |
| WBSL samples per sign | 10–20 |
| WBSL sentences | 100–300 |
| ISL supporting samples | 1,000+ |

### 13.3 Training Experiments

| Model | Training Data | Purpose |
|:---|:---|:---|
| Model A | WBSL only | Baseline—measures WBSL-only performance |
| Model B | ISL pre-train, WBSL fine-tune | Transfer learning effectiveness |
| Model C | ISL + WBSL mixed | Combined training performance |

ISL and WBSL must remain separately labelled throughout. Main target: WBSL. Supporting data: ISL.

### 13.4 Data Source Hierarchy

| Priority | Source | Signs | Samples | Action |
|:---|:---|:---|:---|:---|
| 1 | BdSLW401 + BdSLW60 | 461 | ~12,000 sequences | Download and preprocess |
| 2 | iSign + ISLTranslate | 200+ | ~5,000 sequences | Download and preprocess |
| 3 | Wikisigns WBSL (170 signs) | 170 | 1–3 videos each | Visual reference for re-recording |
| 4 | Community collection via interface | 170 | Target: 10–15 per sign | Record using custom tool |

### 13.5 Data Pipeline Logic

If ready-made ISL/BdSL datasets provide sufficient coverage for a sign, no re-recording is needed. Community recording via the interface is only required when:
- A WBSL sign differs significantly from its ISL/BdSL counterpart
- No ready-made dataset covers that specific sign
- Signer-independent evaluation requires multiple recordings of the same sign

### 13.6 Collection Interface Requirements

| Feature | Purpose |
|:---|:---|
| Webcam recording with countdown timer | Standardize recording start/end |
| Sign name/ID input field | Auto-label each recording |
| Signer ID and session tracking | Enable signer-independent evaluation |
| Real-time MediaPipe landmark overlay | Confirm hands/face visible before saving |
| One-click save to structured folder | Eliminate manual file management |
| Playback and re-record option | Allow signers to self-correct |
| NMM flag checkboxes | Tag grammar markers during recording |
| Export to .npy landmark sequences | Direct compatibility with LSTM training |

### 13.7 Folder Structure

```
dataset/
├── signer_01/
│   ├── HELLO/
│   │   ├── sample_001.npy
│   │   └── sample_002.npy
│   └── THANK_YOU/
│       └── sample_001.npy
├── signer_02/
│   └── HELLO/
│       └── sample_001.npy
├── sentences/
│   └── signer_01/
│       ├── sentence_001.npy
│       └── sentence_001_meta.json
└── metadata/
    ├── gloss_map.json
    ├── nmm_flags.json
    └── bengali_translations.json
```

### 13.8 Sentence Metadata Structure

```json
{
    "sentence_id": "sentence_001",
    "signer_id": "signer_01",
    "gloss": ["MOTHER", "FISH", "COOK", "QUESTION"],
    "nmm_flags": {"eyebrow_raise": true, "head_shake": false},
    "bengali_text": "মা কি মাছ রান্না করছে?",
    "language": "WBSL",
    "duration_frames": 95,
    "fps": 30
}
```

### 13.9 Reference Resources

| Resource | Language | Type | Use |
|:---|:---|:---|:---|
| Wikisigns WBSL Dictionary | WBSL | Word/sign dictionary | WBSL vocabulary, individual signs |
| Bangla Sign Language Grammar Tutorial | Bangla SL | Video tutorial | Grammar, sentence structure |
| Online Basic ISL Course | ISL | Self-learning course | Basic ISL vocabulary |
| Indian Sign Language 101 | ISL | Introductory course | Comparing with WBSL |
| Indian Sign Language for Children | ISL | Educational playlist | Baseline vocabulary |

---

## 14. WEB PLATFORM FOR CONTINUOUS DATASET GROWTH

### 14.1 Design Philosophy

The web platform is designed for fast, repeated data collection. The Existing Sign and New Sign workflows share the same common recording system. The only difference: Existing Sign selects from the system; New Sign creates a new entry with metadata, then enters the same recording workflow.

### 14.2 Contribution Session Workflow

```
Select Sign → View Instructions/Reference → Record → Submit
→ Record Again → Submit → ... → Next Sign
```

Example: Sign "Drink" with 37 approved samples. Contributor records #38, #39, #40, #41 without leaving the sign page, then presses "Next Sign."

### 14.3 Key Features

| Feature | Description |
|:---|:---|
| Rapid repeated recording | Submit & Record Again, Submit & Next Sign, Skip, Retake |
| Sign progress tracking | `Sign 4 of 20 | Approved: 37 | Your Submitted: 4 | Pending: 6` |
| New sign creation | Dataset-aware metadata form → immediate recording |
| View JSON | Read-only modal showing exact training data structure |
| Reference video display | Admin-approved reference video shown during recording |
| Save video option | Submits to Saved Video Review Queue (not directly to reference dataset) |
| Mobile optimization | Responsive design for fast phone-based data collection |

### 14.4 Admin Panel

| Function | Capabilities |
|:---|:---|
| Sign management | Add signs, define Bengali meaning, categories, metadata, reference videos |
| Contribution review | View/play/simulate/approve/reject; batch review; filter by sign/contributor/status |
| Video review | Compare candidates side-by-side; select official reference video |
| Dataset statistics | Per-sign counts; identify signs needing more data |
| Model training | Select dataset version, start training, monitor, evaluate, save model version |
| Model versioning | v1 → v2 → v3; newest at top; only one published/active at a time |

### 14.5 Storage Structure

Separate structured storage for: Raw Contributions, Saved Video Review Queue, Approved Training Dataset, Final Reference Videos, Processed Training Data, Model Versions. Training dataset and reference-video dataset remain strictly separate.

### 14.6 Continuous Growth Cycle

```
Create/Select Sign → Collect Multiple Samples → Admin Review
→ Approved Dataset → Train/Fine-tune → Evaluate → Save New Model

Save Video → Video Review → Admin Selects Best → Reference Video Dataset
→ Text/Voice → Sign (reverse path)
```

The system operates without requiring code changes when new signs or samples are added.

### 14.7 Reverse Path Integration (Text/Voice → Sign)

The system uses Admin-approved reference videos. Input text is mapped to available signs, which play sequentially as a continuous presentation. As Admin approves more reference videos, the Text/Voice → Sign functionality automatically expands.

Display: `Available Signs: 250 Words + 40 Sentences`

---

## 15. KEY ARCHITECTURAL DECISIONS

| Decision | Reason |
|:---|:---|
| DeepFace replaced by ViT-ONNX | FER2013 model fails with glasses; TensorFlow conflicts with MediaPipe/JAX |
| Dual venv eliminated | ViT-ONNX runs in main .venv alongside MediaPipe, PyTorch, ONNX Runtime |
| Emotion detection is supplementary | Broad emotions have limited grammatical value; core grammar relies on geometric NMMs |
| Train on landmarks, not raw images | Signer independence: removes skin color, background, lighting, scale |
| Two-hand extraction, right-wrist reference | Supports two-hand letters; preserves inter-hand geometry |
| Window-based intent packets | Avoids expensive multi-model fusion; time-aligns gloss + NMM + emotion |
| Web UI for data collection | Terminal input conflicts with OpenCV window focus |
| gemma-4-E4B for deployment | Best balance of Bengali quality, RAM, and CPU speed among 6 tested models |
| gemma-4-12b as reference | Highest quality benchmark for future evaluation |
| Constrained NLG prompt | Explicit scope rules prevent most common semantic errors |
| TTS dual engine | Windows has no Bengali SAPI voice; dual engine covers online + offline |
| Open-set gate before LLM reasoning | Recognition model decides KNOWN/UNKNOWN; prevents confidently-wrong outputs |
| Three-tier movement representation | Mirrors sign phonology; enables LLM reasoning + human auditability |
| Hybrid reasoning, not LLM-only | Anchors LLM output in empirical evidence; LLM never sees raw landmarks |
| Automation provides evidence, not approval | Human reviewer always makes final decision |
| Privacy-first data submission | Landmarks only; DPDP Act 2023 compliant |
| Python 3.11 enforced | Python 3.14 unsupported by MediaPipe; dummy package risk |
| mediapipe==0.10.14 pinned | Unpinned install resolves to unrelated 1.0.1 package |
| Fast/Slow path separation | Keeps webcam feed smooth; heavy LLM reasoning off critical path |
| Velocity-dip segmentation | Detects sign boundaries in continuous signing without spaces |
| Signer-disjoint splits | Prevents test signer leakage into training; ensures valid evaluation |
| Manifest-based data indexing | Supports provenance tracking, verification filtering, similarity search |

---

## 16. RESULTS AND CURRENT STATUS

### 16.1 Completed Components

| Component | Status | Key Metrics |
|:---|:---|:---|
| MediaPipe Holistic Stream | ✅ Complete | 540 landmarks, stable 30 FPS on CPU |
| ViT-ONNX Emotion Detection | ✅ Complete | 7-class, robust to glasses, ~30–50ms inference |
| Geometry NMM Detection (5 markers) | ✅ Complete | < 5ms latency, pure geometry |
| Static ISL Recognition Pipeline | ✅ Complete | 126-dim MLP, 99.9% val accuracy, ONNX live inference |
| Bengali NLG Model Selection | ✅ Complete | 6 models benchmarked; gemma-4-E4B selected |
| Constrained NLG Prompt | ✅ Complete | 50-criteria stress test validated |
| Dual-Engine Bengali TTS | ✅ Complete | edge-tts + BanglaTTS automatic fallback |
| Unknown Sign Handling Design | ✅ Designed | Full architecture documented |
| Community Data Verification Design | ✅ Designed | Full architecture documented |
| Live Execution Architecture | ✅ Designed | Fast/slow path, segmentation, timing |
| Data Indexing Strategy | ✅ Designed | Manifest, signer-disjoint splits, versioning |
| Web Platform Design | ✅ Designed | Full workflow mapped |
| Research Gap Analysis | ✅ Complete | 18 gaps identified and verified |

### 16.2 Environment Map

| Virtual Environment | Status | Contents |
|:---|:---|:---|
| .venv | Active – Primary | mediapipe 0.10.14, torch, onnxruntime, onnxscript, transformers, opencv |
| .venv-deepface | Retired | tensorflow 2.13, deepface (superseded by ViT-ONNX) |
| .venv-tts | Active – TTS | edge-tts, BanglaTTS, mutagen |

### 16.3 Files Produced

| File | Purpose |
|:---|:---|
| `test_1_1_mediapipe_stream.py` | MediaPipe Holistic webcam stream |
| `export_vit_emotion_to_onnx.py` | ViT model export to ONNX |
| `test_vit_live_emotion.py` | Live 7-emotion webcam inference |
| `test_1_3_geometry_nmm.py` | Real-time 5-marker NMM detection |
| `phase2a_all_in_one.py` | Combined convert/train/live ISL recognition |
| `phase2b_recorder.py` | Continuous sequence recorder (paused) |
| `sign_mlp.onnx` | Trained static sign classifier |
| `sign_classes.json` | 35 class labels |
| `dataset_landmarks/*.npy` | 35 files, ~300 samples each, 126-dim |
| `tts_engine.py` | Automatic TTS fallback chain |
| `test_tts.py` | edge-tts generation + timing |
| `test_banglatts.py` | BanglaTTS offline generation + timing |
| `test_all_tts.py` | 4-engine comparison test |
| `docs/research/research-gap.md` | Macro research gap analysis (18 gaps) |
| `docs/research/unknown-signs.md` | Phase 5 spec: open-set detection |
| `docs/research/community-data-verification.md` | Phase 6 spec: privacy + trust |
| `docs/research/live-execution-data-indexing.md` | Runtime architecture + data indexing |

### 16.4 Pending Components (Priority Order)

| Priority | Task | Status |
|:---|:---|:---|
| 1 | Web-Based Data Collector (FastAPI + HTML) | Planned |
| 2 | Collect 2–3 signs, ~10 reps each via web UI | Pending |
| 3 | Tiny LSTM train + ONNX export | Pending |
| 4 | Live LSTM ONNX inference | Pending |
| 5 | Integration: gloss + NMM + emotion → LLM → Bengali → TTS | Pending |
| 6 | FastAPI reverse endpoint + React UI | Pending |
| 7 | Unknown sign handling implementation | Designed |
| 8 | Community data verification implementation | Designed |
| 9 | Landmark-space augmentation retraining | Designed |
| 10 | Semantic scope accuracy improvement | Documented |

---

## 17. EVALUATION FRAMEWORK

### 17.1 Recognition Metrics
- Accuracy, Precision, Recall, F1-score on held-out signers
- Signer independence: System trained on N signers, tested on held-out signers (target: ≥ 80% accuracy)
- Signer-disjoint splits enforced (never random per-sample)

### 17.2 Translation Metrics
- BLEU, BERTScore, chrF++ for Bengali output quality
- 50-criteria semantic stress test for scope preservation
- Manual accuracy assessment by Bengali speakers

### 17.3 Intent Preservation (Human Evaluation)
- Deaf participants sign 50 test sentences
- Hearing Bengali speakers rate: intended meaning, honorifics, question/negation markers

### 17.4 Unknown Sign Evaluation (Ablation Study)
- Conditions: numerical only / symbolic only / natural language only / combinations
- Metrics: top-1 accuracy, top-3 candidate recall, hallucination rate, confidence calibration

### 17.5 Latency Metrics

| Component | Target |
|:---|:---|
| MediaPipe FPS | ≥ 30 |
| NMM detection | < 5ms per frame |
| ONNX inference (MLP/LSTM) | < 5ms per sequence |
| LLM generation (local) | ~5.76 tokens/second |
| TTS generation | ~2.5 seconds per sentence |
| RAM usage (full system) | < 12 GB |

### 17.6 Training Experiment Protocol

Three experiments to determine optimal low-resource strategy:
- **Model A:** WBSL only (baseline)
- **Model B:** ISL pre-train → WBSL fine-tune (transfer learning)
- **Model C:** ISL + WBSL mixed (combined training)

---

## 18. CONCLUSION AND FUTURE WORK

### 18.1 Conclusion

WBSL Bridge does not attempt to replicate the massive scale of Google DeepMind's SL2T. Instead, it asks a fundamentally different question: **Can we build a system that understands the intention of a linguistically distinct, data-scarce Deaf community and speaks back to them in their own language, on their own hardware, without compromising their privacy?**

This project demonstrates that the answer is yes. By combining MediaPipe Holistic landmark tracking, ViT-ONNX emotion classification, deterministic geometric NMM detection, a 126-dim signer-independent landmark MLP (99.9% validation accuracy), constrained LLM-based Bengali NLG with 50-criteria semantic preservation, and a dual-engine Bengali TTS fallback chain, WBSL Bridge translates meaning rather than words.

The system runs entirely on CPU in a single Python environment, requires no cloud dependency for core operation, and preserves user privacy by processing only geometric landmarks. The design of the Open-Set Honesty Layer and the Privacy-Preserving Community Data Verification framework addresses two critical gaps that no existing sign language translation system adequately solves: preventing confident hallucination on unknown signs, and enabling ethical community-driven dataset growth under the DPDP Act 2023.

The live execution architecture with fast/slow path separation, velocity-dip sign segmentation, and signer-disjoint data indexing ensures the system is practical for real-time continuous signing while maintaining rigorous evaluation standards.

### 18.2 Future Work

1. **Temporal LSTM Pipeline:** Complete web-based data collection, train LSTM on continuous sign sequences, export to ONNX.
2. **WBSL Community Data Collection:** Record 50–100 sentences from Deaf participants in West Bengal with full NMM and gloss annotation. Target: 10–15 recordings per WBSL-specific sign from 3–5 signers.
3. **WBSL-Specific NMM Implementation:** Add head tilt detection, shoulder raise, eye widening, and mouthing detection.
4. **Unknown Sign Handling Implementation:** Build and validate the OOD gate, movement analyzer, and hybrid reasoning pipeline.
5. **Community Web Platform Deployment:** Implement the full contribution, admin review, and model versioning system.
6. **Semantic Scope Improvement:** Refine the NLG prompt and explore fine-tuning for negation scope, speaker binding, and WHETHER/IF-THEN preservation.
7. **Transfer Learning Experiments:** Conduct Model A/B/C experiments to determine optimal ISL→WBSL transfer strategy.
8. **Multi-Model Fusion:** Revisit word/clause-level fusion of gloss, NMM, and affect streams when resources permit.
9. **WBSL Evaluation Benchmark:** Establish the first standardized evaluation protocol for WBSL translation quality.
10. **3D Avatar-Based Reverse Sign Generation:** Explore SiGML-driven or diffusion-based avatar generation for the reverse path.

---

## 19. REFERENCES

[1] Johnson, R.J., Johnson, J.E., "Distinction between West Bengal Sign Language and Indian Sign Language Based on Statistical Assessment," *Sign Language Studies*, Vol. 16, No. 4, pp. 448–476, 2016.

[2] Tanzer, G., et al., "Putting Sign Language AI into Users' Hands: The SL2T Sign-Language-to-Text Model," *Google DeepMind Technical Report*, August 2026.

[3] Akash, S.K., Hoque, M.M., Sarker, S., "Action Recognition Based Real-time Bangla Sign Language Detection and Sentence Formation," *IEEE ICREST*, 2023.

[4] Islam, S., Mousumi, A.S., "Ishara-Lipi: The First Complete Multipurpose Open Access Dataset of Isolated Characters for Bangla Sign Language," 2018.

[5] Sengupta, S., et al., "iSign: A Benchmark for Indian Sign Language Processing," *Findings of ACL*, 2024.

[6] Islam, M.M., et al., "BdSLW60: A Word-level Bangla Sign Language Dataset," *Data in Brief*, 2024.

[7] "BdSLW401: A Large-scale Multi-view Bangla Sign Language Dataset," 2025.

[8] "ISLTranslate: A Continuous Indian Sign Language Translation Dataset," 2024.

[9] Sarker, S., Hoque, M.M., "An Intelligent System for Conversion of Bangla Sign Language into Speech," 2018.

[10] Pakov, T., "vit-face-expression: Vision Transformer for Facial Expression Recognition," *HuggingFace Model Hub*, 2023.

[11] Bendale, A., Boult, T.E., "Towards Open Set Deep Networks," *IEEE CVPR*, 2016. (arXiv:1511.06233)

[12] Shafer, G., Vovk, V., "A Tutorial on Conformal Prediction," *Journal of Machine Learning Research*, Vol. 9, pp. 371–421, 2008. (arXiv:0706.3188)

[13] Lugaresi, C., et al., "MediaPipe: A Framework for Building Perception Pipelines," *arXiv:1906.08172*, 2019.

[14] Serengil, S.I., "DeepFace: A Lightweight Face Recognition and Facial Attribute Analysis Framework," *GitHub Repository*, 2024.

[15] Guo, C., et al., "On Calibration of Modern Neural Networks," *ICML*, 2017. (arXiv:1706.04599)

[16] Lee, K., et al., "A Simple Unified Framework for Detecting Out-of-Distribution Samples and Adversarial Attacks," *NeurIPS*, 2018. (arXiv:1807.03888)

[17] Liu, W., et al., "Energy-based Out-of-distribution Detection," *NeurIPS*, 2020. (arXiv:2010.03759)

[18] Ming, Y., et al., "Delving into Out-of-Distribution Detection with Vision Transformers," *NeurIPS*, 2022.

[19] "Multi-scale Context-Aware Network for Continuous Sign Language Recognition," *ScienceDirect*, 2023.

[20] "Towards Sign Understanding for Robot Autonomy," *arXiv:2506.02556*, 2025.

[21] "SignLLM: Sign Language Production Large Language Models," *arXiv:2405.10718*, 2024.

[22] "Factorized Learning Assisted with LLM for Gloss-free Sign Language Translation," *ACL*, 2024.

[23] "Continuous SLR using Multimodal Input and Handshape-aware Boundary Detection," *sign-lang@LREC*, 2026.

[24] Talukder & Jahara, "Real-Time Bangla Sign Language Detection with Sentence and Speech Generation," 2021.

[25] Digital Personal Data Protection Act, 2023, Government of India.

---

## ACKNOWLEDGEMENTS

We express our sincere gratitude to our project mentor, **Prof. Prabir Kr. Naskar**, for his continuous guidance, valuable feedback, and encouragement throughout this project. We thank the **Department of Computer Science & Engineering** at **Cooch Behar Government Engineering College** for providing the necessary infrastructure and academic environment. We also acknowledge the Deaf community of West Bengal, whose linguistic heritage and communication needs inspire and motivate this work.

---

## APPENDIX A: PRESENTATION GUIDE FOR THE TEAM

**For the Professors' Evaluation:**

1. **Lead with the verified gap.** Start by stating: "WBSL has 170 documented signs and ZERO AI systems. Every existing Bengali sign language project is from Bangladesh and targets a different language." This immediately establishes novelty.

2. **Position against Google SL2T honestly.** Don't claim you're solving what Google solved. Say: "Google proved it's possible with 100,000 hours. We're asking: what works when you have near-zero data?"

3. **Demonstrate live.** Have these scripts ready:
   - `test_1_1_mediapipe_stream.py` — 540 landmarks at 30 FPS
   - `test_vit_live_emotion.py` — 7 emotions with probability bars (works with glasses)
   - `test_1_3_geometry_nmm.py` — raise eyebrows, shake head, open mouth → flags appear
   - `phase2a_all_in_one.py` (mode 3) — live ISL letter recognition

4. **Emphasize the Honesty Layer.** Say: "Most AI systems guess confidently when they don't know. Our system detects vocabulary mismatch, analyzes the movement, and says 'সম্ভবত' (probably) in the Bengali output."

5. **Show the 99.9% validation accuracy** on the static pipeline as proof the 126-dim representation works.

6. **If asked about ISL vs WBSL dataset:** "The ISL dataset validated our landmark pipeline. The actual WBSL dataset will be collected through our community web platform. Three training experiments (WBSL-only, ISL→WBSL transfer, mixed) will determine the optimal strategy."

7. **Explain the DeepFace → ViT-ONNX switch** as engineering rigor: identified failure mode (glasses), diagnosed root cause (shadow artifacts + TensorFlow conflicts), implemented better solution.

8. **Be honest about pending work.** The LSTM, web platform, and unknown sign handling are designed but not yet built. Frame this as a validated foundation with a clear roadmap.

9. **Show the Bengali output.** Run: `YOU + TOMORROW + SCHOOL + GO[negation][?]` → `তুমি কি আগামীকাল স্কুলে যাবে না?` and explain how the constrained prompt prevents scope errors.

10. **Highlight DPDP Act compliance.** This shows awareness of legal and ethical requirements—professors appreciate this.

---

## APPENDIX B: INTENT-AWARE PIPELINE — DETAILED FLOW

```
Camera (30 FPS)
    │
    ▼
MediaPipe Holistic (540 landmarks)
    │
    ├──► Geometry NMM Detector
    │      Eyebrow Raise  → Yes/No Question
    │      Eyebrow Furrow → WH-Question
    │      Head Shake     → Negation
    │      Head Nod       → Affirmation
    │      Mouth Open     → Emphasis
    │      (deterministic, < 5ms, no ML model)
    │
    ├──► ViT-ONNX Emotion Classifier
    │      7-class probability output
    │      Supplementary affective context
    │      (robust to glasses, ~30–50ms)
    │
    └──► Sign Recognition (MLP / LSTM → ONNX)
           126-dim two-hand landmark vector
           Gloss sequence with confidence
    │
    ▼
Window-Based Intent Packet
{
    gloss:   "YOU + DRINK + WATER",
    nmm:     { question: false, negation: true },
    emotion: { dominant: "neutral", confidence: 72.3 }
}
    │
    ▼
Constrained LLM (gemma-4-E4B)
    │
    ▼
Natural Bengali Output
```

**NMMs carry grammar. Emotion carries tone. Together they carry intent.**

The system does not just recognize what sign was performed. It captures **why** and **how** it was performed — question or statement, negated or affirmed, happy or angry — and passes all three streams to the LLM so the Bengali output reflects the signer's true communicative intention.

---

*End of Report*