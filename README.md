# WBSL Bridge

**Real-Time Bidirectional Sign Language Communication for the Deaf Community of West Bengal**

---

## About the Project

WBSL Bridge is an AI-powered communication system designed specifically for the Deaf community in West Bengal. It translates **West Bengal Sign Language (WBSL)** into spoken and written Bengali in real-time, and allows hearing users to type or speak Bengali to generate sign language visuals.

Most existing sign language tools are built for American Sign Language (ASL) or standard Indian Sign Language (ISL). However, WBSL is linguistically distinct and currently has **zero dedicated AI tools**. WBSL Bridge fills this gap by bringing intent-aware, real-time translation to a severely under-resourced community.

---

## Key Features

*   **Sign to Bengali:** Translates continuous hand signs, facial expressions, and body movements into natural Bengali text and speech.
*   **Bengali to Sign (Reverse Path):** Converts Bengali text or speech into visual sign language animations.
*   **Intent-Aware:** Understands facial grammar (like raised eyebrows for questions or head shakes for "no") to translate meaning, not just words.
*   **User-Selectable AI:** Choose between fast Cloud AI (OpenRouter) for speed, or Local AI (KoboldCpp) for privacy and offline use.
*   **Hardware Friendly:** Optimized to run smoothly on standard laptops (like Ryzen 7 + 16GB RAM) without needing expensive GPUs.

---

## How It Works

### 1. Forward Path (Sign → Bengali)
```text
Webcam (30 FPS) 
  → MediaPipe (Extracts 540 Hand/Face/Body Landmarks)
  → DeepFace (Detects Emotion) & Geometry Module (Detects Grammar like Questions)
  → LSTM Model (Recognizes Sign Sequence)
  → LLM (Reconstructs grammatically correct Bengali)
  → Text-to-Speech (Speaks the Bengali sentence)
```

### 2. Reverse Path (Bengali → Sign)
```text
User Types/Speaks Bengali 
  → React UI (Frontend)
  → FastAPI Backend (Processes text via NLP/LLM)
  → Sign Gloss Sequence (Maps words to signs)
  → Sign Animation/Video Generation
  → React UI (Displays the visual signs)
```

---

## Tech Stack

*   **Computer Vision:** MediaPipe Holistic, OpenCV
*   **Emotion Detection:** DeepFace
*   **Deep Learning:** PyTorch (LSTM), ONNX Runtime
*   **Language Models (LLM):** OpenRouter API (Cloud), KoboldCpp (Local)
*   **Web Frameworks:** React (Frontend), FastAPI (Backend)
*   **Text-to-Speech:** Piper TTS (Offline), gTTS (Online)

---

## Project Status

🚧 **Active Development**
*   **Phase 1 (Done):** Literature review, dataset study, and baseline experiments.
*   **Phase 2 (Current):** Building the MediaPipe, DeepFace, and LSTM pipeline.
*   **Phase 3 (Next):** Integrating the LLM router and React/FastAPI reverse path.

---

## Team & Credits

**Students:**
*   **Sabir Ali Mondal** (Roll: 34900123032)
*   **Koushaki Singha** (Roll: 34900124074)

**Mentor:**
*   **Prof. Prabir Kr. Naskar**

**Department:** Computer Science & Engineering (CSE)
**College:** Cooch Behar Government Engineering College
