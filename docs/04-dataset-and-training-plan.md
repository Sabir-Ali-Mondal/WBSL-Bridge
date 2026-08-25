# WBSL Bridge: Data Strategy, Collection Plan, and Reference Resources

## Read note
https://www.researchgate.net/publication/305761433_Distinction_between_West_Bengal_Sign_Language_and_Indian_Sign_Language_Based_on_Statistical_Assessment

## 1. Data Pipeline Overview

```text
ISL Data + WBSL Data
        |
        v
Data Collection
        |
        v
Clean + Remove Duplicates
        |
        v
Language Label (ISL / WBSL)
        |
        v
Gloss + Bengali Text Annotation
        |
        v
Hand + Face + Body Feature Extraction (MediaPipe)
        |
        v
Train / Validation / Test Split
        |
        v
Sign Recognition / Translation
```

## 2. Minimum Initial Data Requirements

| Category | Requirement |
|:---|:---|
| WBSL signs | 100-200 |
| WBSL signers | 5+ |
| WBSL samples per sign | 10-20 |
| WBSL sentences | 100-300 |
| ISL supporting samples | 1,000+ |

## 3. Training Experiments

| Model | Training Data | Purpose |
|:---|:---|:---|
| Model A | WBSL only | Baseline - measures WBSL-only performance |
| Model B | ISL pre-train, WBSL fine-tune | Transfer learning effectiveness |
| Model C | ISL + WBSL mixed | Combined training performance |

Main target: WBSL. Supporting data: ISL. ISL and WBSL must remain separately labelled throughout.

## 4. Data Source Hierarchy

| Priority | Source | Signs | Samples | Action Required |
|:---|:---|:---|:---|:---|
| 1 | BdSLW401 + BdSLW60 | 461 | ~12,000 sequences | Download and preprocess directly |
| 2 | iSign + ISLTranslate | 200+ | ~5,000 sequences | Download and preprocess directly |
| 3 | Wikisigns WBSL (170 signs) | 170 | 1-3 videos each | Use as visual reference for re-recording |
| 4 | Community collection via interface | 170 | Target: 10-15 per sign | Record using custom tool |

### ISL datasets
```
https://huggingface.co/datasets/Exploration-Lab/iSign/tree/main
```
```
https://data.mendeley.com/datasets/kcmpdxky7p/1
```
```
https://cs.rkmvu.ac.in/~isl/
```
```
https://universe.roboflow.com/niladri-basu-roy-qnrm4/indian-sign-language-detection/dataset/2
```
### BdSL dataset
```
https://www.kaggle.com/datasets/hasanssl/bdslw401/data
```

## 5. Data Pipeline Logic

If ready-made ISL/BdSL datasets provide sufficient coverage for a sign, no re-recording is needed. Wikisigns videos serve as visual reference material. Community recording via the interface is only required when:

- A WBSL sign differs significantly from its ISL/BdSL counterpart.
- No ready-made dataset covers that specific sign.
- Signer-independent evaluation requires multiple recordings of the same sign.

## 6. Sign Language Reference Resources

### 6.1 WBSL Dictionary - Wikisigns

| Field | Detail |
|:---|:---|
| Language | West Bengal Sign Language (WBSL) |
| Type | Word/sign dictionary |
| Use | WBSL vocabulary, individual signs, regional signs |
| URL | http://www.wikisigns.org/list/bn/wbsl |

Contains entries such as: আম, জল, মা, বাবা, মাছ, ভাত, পরিবার, বাস, রিকশা, রেলগাড়ি, colours, days, numbers, etc.

### 6.2 Bangla Sign Language - Grammar Tutorial

| Field | Detail |
|:---|:---|
| Language | Bangla/Bengali Sign Language |
| Type | Video tutorial |
| Use | Grammar, sentence structure, actual signing |
| URL | https://youtu.be/XYb9Y2vbJ4w |

Title: "Bangla Sign Language Tutorial 45 Grammar / ইশারা ভাষার টিউটোরিয়াল ৪৫ ব্যাকরণ"

### 6.3 Online Basic Indian Sign Language Course

| Field | Detail |
|:---|:---|
| Language | Indian Sign Language (ISL) |
| Type | Complete self-learning course |
| Use | Basic ISL vocabulary, signs, communication |
| URL | https://youtube.com/playlist?list=PLFjydPMg4DapfRTBMokl09Ht-fhMOAYf6 |

Title: "Online Basic Indian Sign Language Course in Self Learning Mode"

### 6.4 Indian Sign Language 101

| Field | Detail |
|:---|:---|
| Language | Indian Sign Language (ISL) |
| Type | Introductory course |
| Use | Learning basic ISL signs, comparing with WBSL |
| URL | https://youtube.com/playlist?list=PLxYMaKXKMMcMgg4f47WkG7AM0bb3AyjTi |

Title: "Indian Sign Language 101"

### 6.5 Indian Sign Language for Children

| Field | Detail |
|:---|:---|
| Language | Indian Sign Language (ISL) |
| Type | Educational playlist |
| Use | Simple signs, good for baseline vocabulary |
| URL | https://youtube.com/playlist?list=PL7U3r2l3wmq3MEr558JZR825YYBOTAUvV |

## 7. Collection Interface Requirements

| Feature | Purpose |
|:---|:---|
| Webcam recording with countdown timer | Standardize recording start/end |
| Sign name/ID input field | Auto-label each recording |
| Signer ID and session tracking | Enable signer-independent evaluation |
| Real-time MediaPipe landmark overlay | Confirm hands/face are visible before saving |
| One-click save to structured folder | Eliminate manual file management |
| Playback and re-record option | Allow signers to self-correct |
| NMM flag checkboxes (Question/Negation/Emphasis) | Tag grammar markers during recording |
| Export to .npy landmark sequences | Direct compatibility with LSTM training |

## 8. Folder Structure (Auto-generated by Interface)

```
dataset/
  signer_01/
    HELLO/
      sample_001.npy
      sample_002.npy
    THANK_YOU/
      sample_001.npy
  signer_02/
    HELLO/
      sample_001.npy
  sentences/
    signer_01/
      sentence_001.npy
      sentence_001_meta.json
  metadata/
    gloss_map.json
    nmm_flags.json
    bengali_translations.json
```

### sentence_meta.json Structure

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

## 9. Summary

The project adopts a transfer-first data strategy. Ready-made datasets (BdSLW401, BdSLW60, iSign, ISLTranslate) provide approximately 10,000-15,000 pre-labelled landmark sequences covering 460+ signs, eliminating the need to record these from scratch. The 170-sign Wikisigns WBSL lexical resource serves as visual reference material for identifying which signs require WBSL-specific re-recording. A custom recording interface is developed to standardize community data collection, enabling any Deaf participant or future researcher to record, label, and export sign sequences with minimal training. This interface captures webcam video, extracts MediaPipe landmarks in real-time, displays a live overlay for quality confirmation, and saves structured .npy files directly compatible with the LSTM training pipeline. The target is 10-15 recordings per WBSL-specific sign from 3-5 signers, yielding approximately 1,700-2,550 additional sequences for fine-tuning and signer-independent evaluation. Three training experiments (WBSL-only, ISL-to-WBSL transfer, and mixed ISL+WBSL) will be conducted to determine the optimal training strategy for this low-resource setting.
