# PROJECT REPORT

**COOCH BEHAR GOVERNMENT ENGINEERING COLLEGE**  
**DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING**

## Real-Time Indian Sign Language Detection and Recognition Using Deep Learning and Computer Vision

### STUDENT DETAILS

| | STUDENT 1 | STUDENT 2 |
| :--- | :--- | :--- |
| **NAME** | **Sabir Ali Mondal** | **Koushaki Singha** |
| **ROLL** | **34900123032** | **34900124074** |
| **SEMESTER** | **7th** | **7th** |

**MENTOR:** Prof. Prabir Kr. Naskar  
**DEPARTMENT:** CSE

---

# WBSL Bridge: Intent-Aware Real-Time Bidirectional Sign Language Communication System for the Deaf Community of West Bengal Using Multimodal Deep Learning, Constrained LLMs, and Hybrid Cloud-Edge Inference

## Abstract

Sign language conveys meaning holistically through simultaneous hand movements, facial expressions, and body posture, yet most existing systems translate signs word-by-word, losing the signer's true intention. In August 2026, Google DeepMind deployed SL2T, proving real-time ASL-to-English translation at consumer scale using over 100,000 hours of data. However, the Deaf community of West Bengal remains entirely unserved: West Bengal Sign Language (WBSL) is linguistically proven distinct from Delhi ISL and Bangladesh BdSL (Johnson and Johnson, 2016), yet possesses only a static 170-sign lexical resource and zero dedicated AI systems. This project, WBSL Bridge, proposes an intent-aware, bidirectional communication framework for this severely low-resource environment. MediaPipe Holistic extracts 540 hand, face, and body landmarks; the open-source DeepFace library provides lightweight facial emotion classification; a temporal LSTM recognizes continuous sign sequences; and a user-selectable LLM architecture — allowing either OpenRouter API for cloud-based inference or a local KoboldCpp instance for offline and privacy-preserving inference — reconstructs grammatically correct Bengali respecting SOV order and honorifics. The reverse path utilizes a React UI and FastAPI backend for Bengali-to-Sign generation. Benchmarking on a Ryzen 7 U with 16GB RAM demonstrates practical real-time performance. The system preserves privacy via landmark-only processing and is evaluated on signer independence and intent preservation with the West Bengal Deaf community.

## 1. Introduction

### 1.1 Background and Motivation
Sign language is the primary communication medium for over 70 million Deaf and hard-of-hearing individuals worldwide. Unlike spoken languages, sign languages are fully-fledged visual-spatial languages with their own distinct grammar, syntax, and morphology. In India, the Deaf community relies heavily on Indian Sign Language (ISL) and its regional variations. However, the technological infrastructure to bridge the communication gap remains severely underdeveloped for regional languages.

### 1.2 The West Bengal Context
West Bengal Sign Language (WBSL) has been linguistically proven to be statistically distinct from the Delhi variety of ISL and the Bangla Sign Language (BdSL) used in Bangladesh (Johnson and Johnson, 2016). Despite this, the Deaf community in West Bengal is entirely underserved by modern AI. While commercial apps (like SignISL) and academic projects exist for standard ISL or Bangladesh BdSL, there is a complete technological void for WBSL. The only existing computational resource for WBSL is a static Wikisigns lexical resource containing merely 170 signs.

### 1.3 The Intention Problem
The fundamental flaw in current systems is the "word-by-word" approach. Sign language is a holistic modality where meaning is conveyed simultaneously through manual signs and non-manual markers (NMMs). A raised eyebrow indicates a yes/no question; a head shake indicates negation. Systems that ignore these facial cues translate the exact opposite of what the signer intended. WBSL Bridge solves this by integrating facial emotion and grammar detection directly into the translation pipeline.

### 1.4 The Real-Time Hardware Challenge
Recent advances in local LLM inference have made it possible to run powerful language models on consumer laptops. Our empirical benchmarking on a Ryzen 7 U with 16GB RAM shows that models like GPT-OSS-20B Q4_K_M achieve 7.35 to 8.05 tokens per second, while MoE architectures like Qwen 3.6-35B-A3B achieve 7.1 to 7.7 tokens per second. Combined with OpenRouter API (up to 24 tokens/second), true conversational real-time performance is achievable on budget hardware.

## 2. Literature Survey

### 2.1 Early Sensor-Based and Isolated Sign Systems
Sarker and Hoque (2018) from CUET developed a Bangla Sign Language conversion system using smart gloves [9]. While pioneering, it was hardware-dependent and blind to facial expressions. Islam and Mousumi introduced Ishara-Lipi, the first open-access dataset of isolated Bangla sign characters, cited over 88 times [4]. It is limited to static characters and cannot process continuous signing.

### 2.2 Vision-Based Recognition and National ISL Tools
The shift toward computer vision brought datasets like BdSLW60 [6] and BdSLW401 [7]. Academic systems like Akash et al. (2023) achieved real-time sentence formation using action recognition [3]. Recently, national tools like SignISL (deployed in Indian Railways) and Signer.AI (by IIIT Bangalore) have emerged, translating Standard ISL to Hindi/English. However, all these projects target Standard ISL or Bangladesh BdSL, leaving WBSL and Bengali output completely unaddressed.

### 2.3 Continuous Translation and the State of the Art
For continuous translation, the ISLTranslate dataset [8] and the iSign benchmark (ACL 2024) [5] represent progress for pan-Indian ISL, but output English. Google DeepMind's SL2T (August 2026) deployed real-time ASL-to-English translation using 100,000+ hours of data [2]. It targets ASL, leaving low-resource regional languages behind.

### 2.4 Facial Emotion Detection and Local LLM Advances
The open-source DeepFace library provides a unified, CPU-friendly interface for facial emotion classification, integrating seamlessly with MediaPipe. Meanwhile, quantization (GGUF, MXFP4) and inference engines (KoboldCpp, Ollama) enable powerful LLMs to run on consumer hardware, with MoE architectures activating only a fraction of parameters per pass.

## 3. Problem Statement and Research Gaps

The core research problem is: How can modern, high-resource sign-language AI techniques be adapted to understand the holistic intention of continuous signing in a severely low-resource, linguistically distinct environment like West Bengal, and output grammatically correct Bengali in real-time on budget hardware?

**Identified Research Gaps:**

*   **G1: The Non-Manual Marker Gap:** Existing sign-language translation research often focuses heavily on manual hand information, while grammatical information expressed through facial expressions, head/body movements, and mouthing remains challenging to model. This is particularly critical for accurately distinguishing questions from statements and capturing negation.
*   **G2: The Regional Linguistic Gap:** West Bengal Sign Language (WBSL) has been documented as linguistically distinct from the Delhi variety of Indian Sign Language (ISL). However, major publicly available AI datasets and translation systems primarily target standard ISL or Bangladeshi Sign Language (BdSL), leaving WBSL-specific resources extremely limited.
*   **G3: The Data Gap:** Publicly documented WBSL resources remain extremely small. The primary WBSL lexical resource (Wikisigns) contains only 170 signs, and no comparable large-scale, continuous WBSL sentence-level video dataset was identified in the available literature and repositories.
*   **G4: The Grammar and Structure Gap:** Sign languages possess their own grammatical structures rather than functioning as word-by-word translations of spoken Bengali. ISL research documents Subject-Object-Verb (SOV) ordering and specific interrogative constructions, highlighting the need for grammar-aware translation models that go beyond simple gloss-to-word mapping.
*   **G5: The Resource-Constrained Deployment Gap:** Many modern multimodal sign-language translation systems rely on computationally intensive vision and language models, creating deployment challenges on low-resource or CPU-only devices. A lightweight WBSL system optimized for offline, low-memory, and CPU-based operation remains valuable for rural and resource-constrained environments in West Bengal.
*   **G6: The Real-Time Latency Gap:** Continuous sign-language translation requires low-latency processing across video understanding, temporal modeling, language generation, and sign rendering. Achieving conversational response times on CPU-only or low-resource local hardware remains a practical engineering challenge.
*   **G7: The WBSL Bidirectional Gap:** While bidirectional systems have been proposed for standard ISL and Bangladeshi Sign Language, a dedicated bidirectional communication system for WBSL—supporting both Bengali text/speech to WBSL and WBSL to Bengali text/speech—remains insufficiently explored.

## 4. Proposed System Architecture

### 4.1 Forward Path: Sign to Bengali (Text Flow Architecture)

```text
Webcam Input (30 FPS)
    ↓
MediaPipe Holistic
    ↓
Extract 540 Landmarks
  - Hands: 21 × 2 
  - Face: 468 
  - Pose: 33 
    ↓
Three parallel modules:
  1. DeepFace
     → Detects emotion: Happy, Sad, Angry, Neutral 
  2. Geometry NMM
     → Detects grammatical markers
     → Eyebrow raise = Question
     → Head shake = Negation 
  3. Temporal LSTM (ONNX)
     → Processes continuous hand and body movements
     → Produces Sign Gloss Sequence 
    ↓
LLM Inference Mode Selection
  → User selects one inference mode
  → Cloud: OpenRouter API
  → OR
  → Local: KoboldCpp
    ↓
Bengali Text Output
  → Converts gloss into natural Bengali
  → Handles SOV word order
  → Handles agglutination
  → Handles honorifics
    ↓
Piper TTS / gTTS
    ↓
Spoken Bengali Audio
```

### 4.2 Reverse Path: Bengali to Sign (Text Flow Architecture)

```text
Bengali Text / Speech-to-Text Input
    ↓
React UI
  → User interface for input and output
    ↓
FastAPI Backend + NLP/LLM
  → Processes Bengali text
  → Converts text into semantic sign units
    ↓
Sign Gloss Sequence
  → Creates an ordered sequence of required signs
    ↓
Sign Mapping
  → Maps each gloss to a video clip or avatar keyframe
    ↓
Sign Animation / Video Generation
  → Generates the visual sign output
    ↓
React UI
  → Displays the final sign language video/animation to the user
```

### 4.3 Key Architectural Innovations

1.  **Multimodal Intent Capture:** Hands + face + body + emotion + grammar markers all feed the LLM.
2.  **User-Selectable LLM Architecture:** The user can choose between cloud-based OpenRouter inference and local KoboldCpp inference according to speed, privacy, and internet availability.
3.  **Privacy by Design:** Raw video discarded; only landmarks flow through the pipeline.
4.  **ONNX-Accelerated Inference:** LSTM runs at less than 5ms per sequence on CPU.
5.  **Modern Web Stack for Reverse Path:** React and FastAPI ensure a responsive, scalable, and decoupled frontend-backend architecture for the text-to-sign generation.

## 5. Multimodal Intent Detection

### 5.1 MediaPipe Holistic
Extracts 540 landmarks per frame at 30+ FPS on CPU. Raw video is immediately discarded, ensuring privacy by design.

### 5.2 DeepFace (Ready-Made Emotion Detection)
We integrate the open-source DeepFace library for facial emotion classification. It provides 7-class emotion output (angry, disgust, fear, happy, sad, surprise, neutral) and is lightweight enough to run alongside MediaPipe without crashing the CPU.

### 5.3 Geometry-Based Grammar NMMs
While DeepFace handles emotion, we use simple landmark geometry to detect grammatical Non-Manual Markers:
*   **Eyebrow Raise:** Distance between eyebrow and eye landmarks. Threshold crossing triggers "Question" flag.
*   **Head Shake:** X-coordinate variance of nose tip over 15 frames. High variance triggers "Negation" flag.
*   **Mouth Open:** Distance between upper/lower lip landmarks. Threshold crossing triggers "Emphasis" flag.

## 6. LLM Inference Strategy with Measured Benchmarks

### 6.1 User-Selectable LLM Architecture

The system provides two LLM inference modes, allowing the user to choose the preferred mode according to their requirements. The system does not automatically switch or fall back from one mode to another.

**Mode 1: Cloud LLM — OpenRouter API**
*   Uses the OpenRouter API for LLM inference.
*   Provides higher generation speed and access to powerful cloud-based models.
*   Suitable when internet connectivity is available.
*   Expected generation speed: approximately 20–30 tokens/second.
*   Requires the user's Bengali gloss sequence and intent information to be sent to the selected cloud model.

**Mode 2: Local LLM — KoboldCpp**
*   Runs the selected quantized GGUF model locally through KoboldCpp.
*   Does not require an internet connection after model setup.
*   Provides greater privacy because translation data remains on the user's device.
*   Suitable for offline environments and privacy-sensitive applications.
*   Expected generation speed: approximately 7–20 tokens/second on the tested Ryzen 7 U + 16GB RAM system.

**User Selection Flow**

```text
User
  ↓
Select LLM Mode
  ↓
  ├── Cloud Mode → OpenRouter API → Bengali Text
  │
  └── Local Mode → KoboldCpp → Bengali Text
```

The selected mode remains active until the user changes it. Therefore, the system does not perform automatic switching between cloud and local inference. This design gives the user direct control over the trade-off between speed, model capability, internet dependency, and privacy.

## 7. Methodology and Implementation

### 7.1 Dataset Strategy
Given the absence of WBSL-specific continuous datasets, we adopt a multi-source transfer learning approach:
*   **Primary training:** ISLTranslate and iSign (ISL is formally taught in West Bengal schools).
*   **Baselines:** Ishara-Lipi and BdSLW60 for isolated sign recognition.
*   **Community collection:** 50–100 sentences recorded with Deaf participants from West Bengal (with consent), labeled with gloss, NMMs, and emotion.
*   **Video-Based Dataset Expansion:** Publicly available sign-language videos from platforms such as YouTube will be used as supplementary learning resources to study WBSL signing patterns and, where licensing and permissions allow, to create additional annotated training samples. Relevant videos will be manually reviewed and annotated with sign glosses, temporal boundaries, NMMs, and other useful linguistic information.

### 7.2 Technology Stack
*   **Computer Vision:** MediaPipe Holistic + OpenCV
*   **Emotion Detection:** DeepFace
*   **Temporal Model:** PyTorch LSTM + ONNX Runtime
*   **LLM (Cloud):** OpenRouter API
*   **LLM (Local):** KoboldCpp + GGUF
*   **Reverse Path Backend:** FastAPI + NLP/LLM
*   **Reverse Path Frontend:** React UI
*   **TTS:** Piper TTS (offline) / gTTS (online)

## 8. Evaluation Framework

*   **Recognition:** Accuracy, Precision, Recall, F1-score on held-out signers.
*   **Translation:** BLEU, BERTScore, chrF++ for Bengali output quality.
*   **Intent Preservation (Human Evaluation):** Deaf participants sign 50 test sentences. Hearing Bengali speakers rate whether the output conveyed the intended meaning, correct honorifics, and correct question/negation markers.
*   **Signer Independence:** System trained on N signers and tested on held-out signers. Target: >= 80% accuracy.

## 9. Expected Results

*   **MediaPipe FPS:** >= 30 FPS.
*   **Emotion detection latency:** < 50 ms.
*   **LSTM inference:** < 5 ms/sequence.
*   **LLM generation (cloud):** 20–25 tok/s.
*   **LLM generation (local):** 7–20 tok/s.
*   **End-to-end (cloud):** 1.5–2.5 s/sign.
*   **End-to-end (local):** 3–4 s/sign.
*   **RAM usage (full system):** < 12 GB.

## 10. Conclusion

WBSL Bridge does not attempt to replicate the massive scale of Google SL2T. Instead, it asks a fundamentally different question: Can we build a system that understands the intention of a linguistically distinct, data-scarce Deaf community and speaks back to them in their own language, on their own hardware? By combining MediaPipe Holistic tracking, DeepFace emotion detection, geometric NMM analysis, temporal LSTM recognition, and a user-selectable cloud/local LLM architecture capable of delivering up to 24 tokens per second in cloud inference, WBSL Bridge translates meaning rather than words. The system supports both connected cloud operation and offline local operation, with the user selecting the desired inference mode. It preserves user privacy and aims to finally give a voice to the silent technological void facing the Deaf community of West Bengal.

## References

[1] Johnson, R.J., Johnson, J.E., Distinction between West Bengal Sign Language and Indian Sign Language Based on Statistical Assessment, Sign Language Studies, Vol 16, No 4, pp. 448-476, 2016.
[2] Tanzer, G., et al., Putting Sign Language AI into Users' Hands: The SL2T Sign-Language-to-Text Model, Google DeepMind Technical Report, 2026.
[3] Akash, S.K., Hoque, M.M., Sarker, S., Action Recognition Based Real-time Bangla Sign Language Detection and Sentence Formation, IEEE ICREST, 2023.
[4] Islam, S., Mousumi, A.S., Ishara-Lipi: The First Complete Multipurpose Open Access Dataset of Isolated Characters for Bangla Sign Language, 2018.
[5] Sengupta, S., et al., iSign: A Benchmark for Indian Sign Language Processing, Findings of ACL, 2024.
[6] Islam, M.M., et al., BdSLW60: A Word-level Bangla Sign Language Dataset, Data in Brief, 2024.
[7] BdSLW401: A Large-scale Multi-view Bangla Sign Language Dataset, 2025.
[8] ISLTranslate: A Continuous Indian Sign Language Translation Dataset, 2024.
[9] Sarker, S., Hoque, M.M., An Intelligent System for Conversion of Bangla Sign Language into Speech, 2018.
[10] Serengil, S.I., DeepFace: A Lightweight Face Recognition and Facial Attribute Analysis Framework, GitHub Repository, 2024.
