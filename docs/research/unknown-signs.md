# WBSL Bridge — Unknown Sign Detection & Semantic Interpretation

**Document:** `docs/unknown-signs.md`
**Date:** 1 September 2026
**Parent document:** `docs/research-gap.md` (macro gaps)
**Scope:** Method-level contribution only. Defines how the system behaves when a sign is outside the trained WBSL vocabulary.

---

## 1. Objective

Two separate problems:

1. **Unknown-sign detection** — decide whether the sign belongs to the trained vocabulary. Done by the recognition model, NOT by the LLM.
2. **Unknown-sign semantic guessing** — if unfamiliar, convert the sign into structured movement information and generate ranked, tentative meanings using evidence + context.

---

## 2. Research Gap Statement

> Existing sign-language research covers continuous recognition, open-set/OOD detection, context-aware modelling, and LLM-assisted translation as separate topics. What is missing is a lightweight framework that, after an explicit open-set decision, converts an unfamiliar sign's landmark sequence into structured, human-interpretable movement representations (handshape transitions, trajectory, repetition counts, temporal features, NMM tags), combines them with linguistic context and retrieval evidence, and generates ranked tentative semantic hypotheses instead of a forced classification. This gap is acute for low-resource regional sign languages such as WBSL, where unknown and regional signs are the norm, not the exception.

---

## 3. What Already Exists (With Sources)

| Area | Status | Source |
|:---|:---|:---|
| Continuous sign language recognition | Exists | [1] |
| Out-of-distribution (OOD) detection | Established field | [2], [3] |
| Open-set sign detection + VLM reasoning | Exists (2025, cloud VLM on RGB) | [4] |
| LLM over sign gloss representations | Exists (SignLLM) | [5] |
| Gloss-free LLM-assisted sign translation | Exists | [6] |
| Pose/landmark-based translation | Exists | [7] |
| Handshape-aware boundary detection | Exists (2026) | [8] |
| Context-aware continuous recognition | Exists | [9] |

**Conclusion:** the individual technologies are not new. The novelty is the specific pipeline: open-set gate → interpretable movement representation → hybrid evidence-based reasoning → tentative interpretation → human verification loop, designed for offline, low-resource, regional WBSL.

---

## 4. Novelty Claim (Defensible)

> We propose an uncertainty-aware unknown-sign interpretation framework in which an open-set sign recognizer first detects vocabulary mismatch, after which the unfamiliar sign is converted into structured, human-interpretable movement representations and combined with linguistic context and similarity retrieval to generate and rank tentative semantic hypotheses.

Do NOT claim "LLM-based sign understanding" as the novelty — that already exists [4], [5], [6].

---

## 5. Architecture

```text
CAMERA -> MediaPipe -> landmarks
   -> Temporal Sign Encoder -> probabilities + embedding
   -> OOD GATE (max_prob + embedding distance + temporal consistency)
        |
        KNOWN ----------------------------> gloss stream
        |
        UNKNOWN -> Movement Analyzer (geometry only, no ML)
                     -> Level 1 numerical + Level 2 symbolic + Level 3 paragraph
                     -> Context Window (prev/next glosses)
                     -> Similarity Search (known-sign database)
                     -> Local LLM (JSON candidates, temp ~0.3)
                     -> Context Re-scorer (gloss n-gram prior)
                     -> tentative gloss + UNCERTAIN flag
                     -> Bengali NLG with "সম্ভবত" marker
                     -> Unknown Queue (video + landmarks)
                          -> community labeling -> retraining
```

---

## 6. Three-Level Movement Representation

Example: person shows one finger, then closes all fingers.

### Level 1 — Numerical
```text
finger_extension = 1 -> 0
finger_count = 1
velocity = 0.42
duration = 0.81 s
repetition = 2
distance_to_mouth = 0.16
```

### Level 2 — Symbolic
```text
RIGHT_HAND INDEX_EXTENDED -> ALL_CLOSED HAND_ROTATION REPEATED_2X NO_NMM
```

### Level 3 — Natural language
> The signer extends one finger with the right hand, rotates the hand, and then closes all fingers. The sequence is repeated twice.

All three levels are generated automatically from landmarks. The LLM receives all three plus context plus retrieved similar signs.

---

## 7. Why Hybrid Reasoning (Not LLM Alone)

```text
Similarity Search  +  Rule/Feature Reasoning  +  LLM Reasoning
        └──────────────────┬──────────────────┘
                     Candidate Pool
                           ↓
                    Context Ranking
                           ↓
                  Final Candidates (tentative)
```

- LLM alone can hallucinate.
- Similarity search alone is context-blind.
- Rules alone are brittle.
- Combined, the LLM reasons over evidence instead of inventing meaning.

---

## 8. Detection Enhancements

| Technique | Purpose | Source |
|:---|:---|:---|
| Confidence threshold on validation data | Baseline UNKNOWN gate | this project |
| Temperature scaling | Calibrate confidences so threshold is meaningful | [10] |
| Embedding distance (Mahalanobis) to class centroids | Catch confidently-wrong predictions | [11] |
| Energy-based OOD score | Stronger than softmax max | [12] |
| Conformal prediction | Candidate set with statistical guarantee | [13] |
| OpenMax-style open-set scoring | Class + unknown probability | [14] |
| Temporal consistency (prediction variance) | Known signs stabilize; unknown flicker | this project |

---

## 9. Guessing Enhancements

- Repetition counting via peak detection on wrist trajectory
- Handshape tags via finger extension ratios
- Contact/proximity zones (mouth, chest, head, above head)
- Velocity and pause detection
- Iconicity prior lexicon (mouth → eat/drink/speak; head → think/know)
- Context re-scoring with gloss n-gram language model (YOU → ? → WATER boosts DRINK)
- Retrieval augmentation against ISL/ASL sign embedding database
- Unknown queue → community labeling → retraining (continuous learning)

---

## 10. Local LLM vs API

- Guessing is text reasoning over symbolic descriptions, not vision. Local gemma-4-E4B (KoboldCpp, Phase 3 endpoint) is sufficient.
- Use constrained JSON output, temperature ~0.3, top-3 candidates with evidence.
- API or 12b reference = optional enhanced mode when online.
- Rule: never send raw landmarks to the LLM.

---

## 11. Ablation Study Plan

Test conditions: numerical only / symbolic only / natural language only / numerical+symbolic / symbolic+natural / all three.

Metrics: top-1 accuracy, top-3 candidate recall, hallucination rate, confidence calibration, latency, RAM usage, offline capability.

This ablation is itself a proposed evaluation protocol for unknown-sign interpretation (links to macro gap G18).

---

## 12. Terminology and Limitation

- Output is called **candidate semantic interpretation** or **tentative semantic hypothesis**, never "predicted meaning".
- Iconic signs (repeated movement toward mouth → DRINK/EAT) can be guessed. Arbitrary signs (community-specific TRAIN) cannot be inferred from movement alone.
- Every unknown output carries: `STATUS: TENTATIVE — HUMAN VERIFICATION REQUIRED`.

---

## 13. Proposed Title

> WBSL Bridge: An Open-Set, Movement-Grounded Framework for Recognition and Semantic Interpretation of Unseen West Bengal Sign Language Signs

---
## 14. References

| # | Source | Link |
|:---|:---|:---|
| [1] | Multi-scale context-aware network for continuous sign language recognition, ScienceDirect 2023 | https://www.sciencedirect.com/science/article/pii/S2096579623000414 |
| [2] | Delving into out-of-distribution detection with vision transformers (Ming et al., NeurIPS 2022) | https://dl.acm.org/doi/10.5555/3600270.3602813 |
| [3] | Language-Enhanced Latent Representations for OOD Detection, arXiv 2024 | https://arxiv.org/abs/2405.01691 |
| [4] | Towards Sign Understanding for Robot Autonomy (open-set detector + VLM), arXiv 2025 | https://arxiv.org/abs/2506.02556 |
| [5] | SignLLM: Sign Language Production Large Language Models, arXiv 2024 | https://arxiv.org/abs/2405.10718 |
| [6] | Factorized Learning Assisted with LLM for Gloss-free Sign Language Translation, ACL 2024 | https://aclanthology.org/2024.lrec-main.620/ |
| [7] | Google DeepMind — Putting sign language AI into users' hands | https://deepmind.google/blog/putting-sign-language-ai-into-users-hands/ |
| [8] | Continuous SLR using Multimodal Input and Handshape-aware Boundary Detection, sign-lang@LREC | https://www.sign-lang.uni-hamburg.de/lrec/pub/26014.html |
| [9] | Continuous SLR through a Context-Aware Generative Adversarial Network | https://pmc.ncbi.nlm.nih.gov/articles/PMC8038055/ |
| [10] | Guo et al., On Calibration of Modern Neural Networks (temperature scaling), ICML 2017 | https://arxiv.org/abs/1706.04599 |
| [11] | Lee et al., Mahalanobis-distance OOD detection, NeurIPS 2018 | https://arxiv.org/abs/1807.03888 |
| [12] | Liu et al., Energy-based Out-of-distribution Detection, NeurIPS 2020 | https://arxiv.org/abs/2010.03759 |
| [13] | Shafer & Vovk, A Tutorial on Conformal Prediction, JMLR 2008 | https://arxiv.org/abs/0706.3188 |
| [14] | Bendale & Boult, Towards Open Set Deep Networks (OpenMax), CVPR 2016 | https://arxiv.org/abs/1511.06233 |
