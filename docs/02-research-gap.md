# SignSetu — Complete Research Gap Summary

## How to Read This Document

Each gap is tagged with a **status** reflecting the entire conversation:

| Tag | Meaning |
| :--- | :--- |
| 🔴 **OPEN** | No one has solved this. Core opportunity. |
| 🟡 **PARTIAL** | Partially addressed by others, but not for BdSL/Bengali. |
| 🟢 **SOLVED (ASL)** | Solved by Google SL2T or others for ASL. Not applicable to BdSL. |
| 🔵 **NEW** | Discovered during this project's analysis. Not in original list. |

---

## PART A: The Original 12 Gaps — Final Verdict

---

### GAP 1 — Continuous ISL Recognition
**Original Claim:** Existing research handles isolated signs well but continuous real-time ISL recognition remains challenging.

**Final Verdict:** 🟢 **SOLVED for ASL** → 🔴 **OPEN for BdSL**

- Google SL2T (2026) proved continuous, streaming sign language recognition is achievable using MediaPipe Holistic landmarks + massive Transformer, trained on 100,000+ hours of data.
- CUET (Akash et al., 2023) attempted real-time BdSL sentence formation but used a **fixed vocabulary** and **template-based concatenation**, not true open-vocabulary continuous recognition.
- Ishara-Lipi (2018) and all Kaggle BdSL notebooks work on **isolated static characters only**.
- **No BdSL system handles natural, flowing, continuous signing where a person signs multiple concepts in sequence without pauses.**

> **Remaining Gap:** Build continuous BdSL recognition with 3–4 orders of magnitude less data than Google used, adapted to Bengali linguistic structure.

---

### GAP 2 — Limited Real-World Generalisation
**Original Claim:** Systems trained in controlled environments fail with unseen backgrounds, lighting, cameras, and signing speeds.

**Final Verdict:** 🟢 **ADDRESSED for ASL** → 🟡 **PARTIAL for BdSL**

- Google solved this architecturally by using **pose landmarks instead of raw pixels**, making the system invariant to lighting, background, and camera angle.
- CUET's system was tested in **lab settings** with limited environmental variation.
- Kaggle datasets (Ishara-Lipi, Muntakim Rafi) contain **controlled, static images** with uniform backgrounds.
- No BdSL system has been validated across diverse real-world conditions (outdoor, noisy, variable lighting).

> **Remaining Gap:** Validate BdSL recognition across real-world conditions specific to West Bengal and Bangladesh (street, home, school, hospital).

---

### GAP 3 — Signer-Independent Recognition
**Original Claim:** Systems fail when encountering a person never seen during training.

**Final Verdict:** 🟢 **ADDRESSED for ASL** → 🔴 **OPEN for BdSL**

- Google trained on diverse signers across 50+ languages and explicitly addressed left-handed signers and one-handed signing.
- One study showed accuracy dropping from **99.86% to 26.7%** when tested on unseen users in real-world conditions.
- **No BdSL paper reports signer-independence testing.** CUET, Ishara-Lipi, and all Kaggle notebooks train and test on the same limited signer pool.
- Ishara-Lipi used "different deaf and general volunteers" but with only 50 sets of 36 characters.

> **Remaining Gap:** Build and validate a BdSL system that maintains ≥80% accuracy on completely unseen signers from West Bengal.

---

### GAP 4 — Regional Variation in ISL (Bengali Focus)
**Original Claim:** ISL has regional variations, and West Bengal/Bengali-focused ISL data is lacking.

**Final Verdict:** 🔴 **COMPLETELY OPEN**

- **Every single existing BdSL dataset and paper is Bangladesh-centric (Dhaka).**
  - Ishara-Lipi: Collected from institutes near Dhaka.
  - Muntakim Rafi: Bangladesh-based.
  - KU-BdSL, BAUST Lipi, BdSLW60, BdSLW401: All Bangladesh.
  - CUET: Chittagong, Bangladesh.
- **Zero studies** focus on BdSL as used in **West Bengal, India**.
- **Zero cross-border comparisons** between West Bengal and Bangladesh signing.
- Google SL2T does not mention any Indian or Bengali sign language support.
- The `iSign` benchmark acknowledges regional ISL variations but does not specifically study Bengali regional signing.

> **Remaining Gap:** This is the most uniquely novel gap. No one has studied, documented, or built a system for West Bengal BdSL. This is SignSetu's primary differentiator.

---

### GAP 5 — Insufficient Large and Diverse Continuous Datasets
**Original Claim:** Continuous ISL requires video data with complete sign sequences, timing, gloss labels, and natural-language sentences. Such datasets are limited.

**Final Verdict:** 🟢 **SOLVED for ASL** → 🔴 **CRITICAL for BdSL**

The complete BdSL dataset landscape reveals a devastating gap:

| Dataset | Year | Type | Size | Continuous? | Bengali Text? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Ishara-Lipi | 2018 | Isolated characters | 50×36 chars | ❌ | ❌ |
| Muntakim Rafi Kaggle | ~2019 | Static alphabets | 12,581 files / 197MB | ❌ | ❌ |
| BdSLW-11 | 2022 | Word images | 1,105 images | ❌ | ❌ |
| BdSL47 (Depth) | 2023 | Depth alphabets | Varies | ❌ | ❌ |
| BDSL_49 | 2023 | Alphabets + digits | 29,490 images | ❌ | ❌ |
| KU-BdSL | 2023 | Hand signs | 1,500 images | ❌ | ❌ |
| Bangla SL 40 | Varies | Letters/numbers | 1,200 images | ❌ | ❌ |
| BdSLW60 | 2024 | Word-level video | 9,307 trials | ⚠️ Words only | ❌ |
| BdSLW401 | 2025 | Word-level video | 102,176 samples | ⚠️ Words only | ❌ |
| IsharaKotha | 2025 | Avatar corpus | 3,823 signs | ❌ | ❌ |
| ISLTranslate | 2024 | Continuous ISL | 30,000 pairs | ✅ | English only |
| Google SL2T | 2026 | Multi-language | 100,000+ hours | ✅ | English only |

**No dataset exists with:**
- Continuous BdSL signing sequences
- Corresponding Bengali-language transcripts
- West Bengal signers
- Non-manual marker annotations
- Real-world environmental diversity

> **Remaining Gap:** Build or curate the first continuous BdSL sentence-level dataset with Bengali transcripts, ideally including West Bengal signers.

---

### GAP 6 — Sign-to-Natural-Language Gap
**Original Claim:** Many systems produce a sign/word label but struggle to convert continuous sign sequences into grammatically correct natural-language sentences.

**Final Verdict:** 🟢 **ADDRESSED for ASL→English** → 🔴 **OPEN for BdSL→Bengali**

- Google SL2T translates landmarks directly to fluent English, bypassing glosses entirely.
- CUET (2023) generates "Bangla sentences" but uses **template-based concatenation**, not true linguistic reconstruction.
- **No system produces grammatically correct Bengali from BdSL signs.**
- Bengali's SOV structure, agglutinative morphology, case markers, honorifics (তুমি/তুই/আপনি), and verb conjugation make this significantly harder than ASL→English.
- No BdSL system handles the non-linear mapping between sign space and Bengali syntax.

> **Remaining Gap:** Develop BdSL→Bengali translation that handles Bengali's complex grammar, not just word-by-word concatenation.

---

### GAP 7 — Context Understanding and LLM Integration
**Original Claim:** Using a constrained LLM after sign recognition to interpret sequences, correct structure, and produce meaningful sentences without hallucination is unexplored.

**Final Verdict:** 🟡 **PARTIALLY ADDRESSED conceptually** → 🔴 **OPEN for BdSL**

- Google SL2T uses a massive Transformer for end-to-end translation but does not explicitly use a separate LLM for post-processing.
- No BdSL system uses any LLM.
- The hallucination problem is well-documented in LLM literature but **no sign language system has implemented constrained generation** to prevent the LLM from inventing signs that were not performed.
- For BdSL, a constrained LLM is especially important because:
  - Limited training data means the recognition model will make errors.
  - The LLM must correct errors without inventing content.
  - Bengali grammar requires contextual understanding (honorifics, tense, aspect).

> **Remaining Gap:** Implement a constrained LLM pipeline for BdSL→Bengali that is faithful to the signed input, handles Bengali grammar, and prevents hallucination.

---

### GAP 8 — Real-Time and Low-Latency Processing
**Original Claim:** Practical systems must process continuous video with low latency on commonly available hardware.

**Final Verdict:** 🟢 **SOLVED on flagship devices** → 🟡 **OPEN for budget devices**

- Google SL2T runs on Pixel 11 with on-device MediaPipe and server-side translation.
- Reported latencies: <13.5ms on edge GPUs, <24ms on CPUs for landmark extraction.
- **However:** Target users in West Bengal and Bangladesh typically use **budget-to-mid-range Android devices** (₹8,000–₹20,000 range).
- **Unreliable internet** in rural West Bengal and Bangladesh makes cloud-dependent processing impractical.
- Bengali script rendering and TTS add additional latency not present in English systems.
- No BdSL paper reports actual latency measurements.

> **Remaining Gap:** Achieve real-time BdSL processing on budget hardware with unreliable connectivity, including Bengali TTS.

---

### GAP 9 — Multimodal Sign Recognition
**Original Claim:** Many approaches focus on hands only, while sign language involves body posture, head movement, facial expressions, mouth movement, and movement over time.

**Final Verdict:** 🟡 **ADDRESSED architecturally** → 🔴 **OPEN for BdSL**

- Google SL2T uses MediaPipe Holistic (hands + face + body), proving multimodal input is feasible.
- A project at Punjabi University aims to generate human-like facial expressions for ISL avatars.
- **No BdSL system captures or utilizes non-manual markers.**
  - CUET: Hand/action recognition only.
  - Ishara-Lipi: Static hand images.
  - All Kaggle notebooks: Hand-focused CNNs.
- Non-manual markers are critical for BdSL grammar:
  - Questions (eyebrow raise)
  - Negation (head shake)
  - Emphasis (mouth movement)
  - Topic marking (head tilt)

> **Remaining Gap:** Integrate facial expressions, head movements, and body posture into BdSL recognition, and document which non-manual markers are grammatically significant in BdSL.

---

### GAP 10 — Lack of Complete Bidirectional Communication
**Original Claim:** Most systems focus on ISL→Text. A complete system should support both directions.

**Final Verdict:** 🔴 **OPEN**

- Google SL2T: Forward only (Sign→Text). Reverse is "looking ahead."
- CUET: Forward only (Sign→Sentence).
- Microsoft/ProDeaf: Basic speech-to-sign avatar, but no BdSL support.
- Ishara-Lipi, Kaggle notebooks: Recognition only.
- **No system in existence provides bidirectional BdSL↔Bengali communication.**

> **Remaining Gap:** Build the first bidirectional BdSL communication system: Sign→Bengali AND Bengali→Sign.

---

### GAP 11 — Text/Speech-to-ISL Generation (Reverse Path)
**Original Claim:** Converting normal language into appropriate ISL signs and displaying it naturally is significantly less developed than recognition.

**Final Verdict:** 🔴 **CRITICAL AND WIDE OPEN**

Current approaches to sign generation globally:

| Method | Status | Limitation |
| :--- | :--- | :--- |
| Pre-recorded animation library | Exists | Jerky transitions; fixed vocabulary |
| SiGML-driven avatar | Exists | Requires manual mapping; robotic |
| Seq2Seq Transformer | Emerging | Needs large paired data |
| Diffusion-based 3D avatar | Nascent | Computationally intensive |
| SMPL-X generative model | Nascent | State-of-the-art; not deployed |

- **For BdSL specifically: NOTHING exists.**
- Sarkar et al. attempted Bangla text-to-sign using a dictionary of ~1,000 words, but this is a static lookup, not generative.
- No 3D avatar, no generative model, no natural animation exists for BdSL.

> **Remaining Gap:** Build the first BdSL sign generation system, whether through curated sign libraries, 3D avatars, or generative models.

---

### GAP 12 — Main Research Opportunity
**Original Claim:** Develop a real-time, continuous, signer-independent, region-aware ISL communication system for Bengali-speaking users.

**Final Verdict:** 🔴 **THIS IS THE PROJECT**

All 11 gaps above converge into this single opportunity. SignSetu is positioned at the intersection of:
- Proven architecture (Google SL2T approach)
- Unsolved language domain (BdSL / Bengali)
- Unsolved region (West Bengal)
- Unsolved direction (Bidirectional)
- Unsolved method (Constrained LLM for Bengali)
- Unsolved generation (Text→BdSL avatar)

---

## PART B: New Gaps Discovered During This Analysis

These gaps were **not in the original 12** but emerged from analyzing Google SL2T, CUET, Ishara-Lipi, and the broader BdSL landscape.

---

### 🔵 GAP 13 — The Low-Resource Transfer Problem
**Discovered from:** Google SL2T's 100,000-hour requirement vs. BdSL's <1,000 hours of available data.

Google proved that massive data scaling works. But BdSL has **3–4 orders of magnitude less data**. No research addresses:
- How to adapt SL2T-style architectures to extremely low-resource sign languages.
- Whether transfer learning from ASL→BdSL is viable given linguistic differences.
- Whether synthetic data generation (GANs, diffusion models) can bridge the gap.
- Few-shot or zero-shot sign language recognition for unseen BdSL signs.

> **This is a methodology gap, not just a data gap.**

---

### 🔵 GAP 14 — The Gloss vs. End-to-End Architecture Decision
**Discovered from:** Google SL2T's explicit rejection of glosses.

Google stated: *"Glosses fail to capture rich, non-linear aspects of sign languages such as non-manual markers and spatial constructions."*

But for BdSL:
- No comprehensive gloss dictionary exists.
- End-to-end landmark-to-text requires massive data (which BdSL lacks).
- A hybrid approach (landmarks → compact representation → constrained LLM → Bengali) may be necessary.
- No research has studied the optimal architecture for low-resource sign language translation.

> **This is an architectural research question specific to data-scarce sign languages.**

---

### 🔵 GAP 15 — The Bangladesh vs. West Bengal Linguistic Divide
**Discovered from:** Mapping all existing datasets — every single one is from Bangladesh.

- All BdSL datasets: Dhaka, Chittagong, KU, BAUST — all Bangladesh.
- West Bengal Deaf community may use different signs for the same concepts.
- No study has documented or compared signing variations across the India-Bangladesh border.
- Educational institutions for the Deaf in West Bengal may teach different sign conventions than those in Bangladesh.

> **This is a sociolinguistic gap with direct technical implications for dataset collection and model training.**

---

### 🔵 GAP 16 — Bengali NLP for Sign Language Translation
**Discovered from:** The absence of any Bengali-specific NLP in existing BdSL systems.

Bengali presents unique challenges absent in ASL→English:
- **SOV word order** (vs. English SVO)
- **Agglutinative morphology** (verb conjugations, case markers)
- **Honorific system** (তুই / তুমি / আপনি — three levels of formality)
- **Conjunct characters** in script rendering
- **No capitalization** (case cannot be used for emphasis)
- **Classifier predicates** in sign language may not map cleanly to Bengali verbs

No existing system handles any of these. The LLM must be specifically prompted or fine-tuned for Bengali grammatical reconstruction.

> **This is a linguistic gap at the intersection of NLP and sign language processing.**

---

### 🔵 GAP 17 — Privacy-Preserving Sign Language Processing for South Asia
**Discovered from:** Google's privacy-by-design approach (landmarks only, discard video).

- Google extracts landmarks on-device and discards raw video.
- For South Asian users, data privacy awareness and infrastructure are different.
- No BdSL system addresses privacy.
- Cultural sensitivity around filming Deaf individuals in South Asian contexts.
- On-device processing is critical for regions with data sovereignty concerns.

> **This is an ethical/deployment gap.**

---

### 🔵 GAP 18 — Evaluation Metrics for Sign Language Translation
**Discovered from:** The absence of standardized evaluation in BdSL literature.

- CUET reports accuracy but not BLEU, BLEURT, WER, or latency.
- Kaggle notebooks report classification accuracy on static images.
- No BdSL paper uses sign-language-specific evaluation metrics.
- Google uses BLEURT (70 score on FLEURS-ASL).
- No FLEURS equivalent exists for BdSL.
- How do you evaluate Bengali sign language translation quality? Who are the judges?

> **This is a benchmarking gap.**

---

## PART C: The Final Consolidated Gap Matrix

| ID | Gap | Original? | Status | Priority for SignSetu |
| :--- | :--- | :--- | :--- | :--- |
| G1 | Continuous BdSL Recognition | Yes | 🔴 OPEN | **P0** |
| G2 | Real-World Generalisation | Yes | 🟡 PARTIAL | P1 |
| G3 | Signer Independence | Yes | 🔴 OPEN | **P0** |
| G4 | West Bengal Regional Focus | Yes | 🔴 OPEN | **P0** |
| G5 | Continuous BdSL Dataset | Yes | 🔴 OPEN | **P0** |
| G6 | BdSL → Bengali Translation | Yes | 🔴 OPEN | **P0** |
| G7 | Constrained LLM Integration | Yes | 🔴 OPEN | **P0** |
| G8 | Low-Latency on Budget Devices | Yes | 🟡 PARTIAL | P1 |
| G9 | Multimodal / Non-Manual Markers | Yes | 🔴 OPEN | P1 |
| G10 | Bidirectional Communication | Yes | 🔴 OPEN | **P0** |
| G11 | Text/Speech → BdSL Generation | Yes | 🔴 OPEN | **P0** |
| G12 | Main Research Opportunity | Yes | 🔴 OPEN | **P0** |
| G13 | Low-Resource Transfer Learning | 🔵 New | 🔴 OPEN | **P0** |
| G14 | Gloss vs. End-to-End Architecture | 🔵 New | 🔴 OPEN | P1 |
| G15 | Bangladesh vs. West Bengal Divide | 🔵 New | 🔴 OPEN | **P0** |
| G16 | Bengali NLP for SL Translation | 🔵 New | 🔴 OPEN | P1 |
| G17 | Privacy-Preserving Processing | 🔵 New | 🟡 PARTIAL | P2 |
| G18 | Evaluation Metrics / Benchmarks | 🔵 New | 🔴 OPEN | P1 |

---

## PART D: The One-Paragraph Summary

> Despite Google's SL2T proving that continuous, real-time, signer-independent sign language translation is architecturally achievable (trained on 100,000+ hours of ASL data), and despite CUET's 2023 work demonstrating basic BdSL sentence formation, **no system in existence addresses the specific needs of Bengali-speaking Deaf users in West Bengal.** Every existing BdSL dataset is isolated-character or word-level, Bangladesh-centric, and lacks continuous sentence data with Bengali transcripts. No system uses LLM-based contextual translation, handles Bengali grammar (SOV, honorifics, agglutination), captures non-manual markers, validates signer independence, or provides reverse Text-to-Sign generation. The fundamental research opportunity is to build **SignSetu**: a data-efficient, bidirectional, multimodal, constrained-LLM-powered communication system that adapts proven SL2T-style architectures to the severely resource-constrained Bengali ISL domain, with specific attention to West Bengal regional variations, Bengali linguistic fidelity, budget-device deployment, and 3D avatar-based reverse translation — none of which currently exists.
