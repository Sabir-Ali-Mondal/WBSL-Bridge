# WBSL Bridge

**Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth**

<p align="center">
  <img src="frontend/public/WBSL%20Bridge%20logo.png" alt="WBSL Bridge Logo" width="500" />
</p>

<p align="center">
  <strong>Academic Session: 2025–2026 | B.Tech 7th Semester</strong>
</p>

---

## Academic Details

**Submitted By**

| Name             | University Roll Number | Role        |
| ---------------- | ---------------------- | ----------- |
| Sabir Ali Mondal | 34900123032            | Team Leader |
| Koushaki Singha  | 34900124074            | Team Member |
| Monirul Halder   | 34900123021            | Team Member |
| Firdos Shakih    | 34900123011            | Team Member |

**Project Supervisor:** Prof. Prabir Kr. Naskar  
**Designation:** Assistant Professor  
**Department:** Computer Science and Engineering

---

## Abstract

WBSL Bridge is a bidirectional sign language communication system designed to connect the Deaf community of West Bengal with Bengali-speaking people. It translates sign language into Bengali text and speech, and converts Bengali text or voice into sign language.

The system uses computer vision and deep learning to recognize hand and body movements, while local and cloud language models help generate natural Bengali sentences. It also supports unknown sign handling, native-script speech recognition, neural voice activity detection (VAD), and 3D sign visualization.

Designed for consumer-grade computers, WBSL Bridge provides accessible communication with complete offline capability on CPU, while offering optional high-fidelity online services.

## Key Features

- **Sign to Bengali:** Recognizes signs and generates natural Bengali text and speech.
- **Bengali to Sign:** Converts Bengali text or voice into sign glosses and sign sequences.
- **Continuous Sign Recognition:** Processes continuous streams of signs using temporal deep learning (BiLSTM + Attention).
- **Facial Emotion Recognition:** 7-class ViT-ONNX model provides affective context for vocal tone and expressions.
- **Unknown Sign Handling (Open-Set):** Out-of-Distribution (OOD) gate detects unsupported signs to prevent forced classification.
- **Native Script Speech Recognition (STT):** Local **HIMA-ASR ONNX INT8** generates native Bengali/English text directly, paired with **Silero Neural VAD v6** for zero-hallucination speech segmentation.
- **Hybrid LLM Architecture:**
  - **Offline:** **NVIDIA Nemotron-3.5-Bolt-E4B-4GB** (Google Gemma 4 E4B-it base + GRPO Reinforcement Learning via NeMo Gym, quantized for CPU via KoboldCpp).
  - **Online:** **NVIDIA Nemotron-3 Ultra 550B** (OpenRouter) with a 50-criteria anti-hallucination Bengali NLG prompt.
- **Dual-Engine Text-to-Speech (TTS):** Online Edge-TTS with automatic offline fallback to BanglaTTS (Silero), plus optional ElevenLabs eleven_v3 support.
- **3D Visualization:** Real-time avatar-based sign playback using Three.js and MediaPipe 3D keypoints.

## System Architecture

1. **Input:** Webcam stream (30 FPS), microphone audio, or typed text.
2. **Feature Extraction:** Hand, pose, and face landmarks extracted via MediaPipe Holistic (98-dim normalized feature vectors).
3. **Sign & Emotion Recognition:** BiLSTM + Attention predicts sign glosses; ViT-ONNX extracts facial emotion context.
4. **Speech-to-Text (STT):** Audio is segmented using Silero VAD v6 and transcribed in native script via HIMA-ASR ONNX INT8.
5. **Language Processing (LLM):** Offline Nemotron-3.5-Bolt or online Nemotron-3 Ultra maps glosses into natural Bengali sentences with grammatical markers.
6. **Output:** Bengali speech synthesis via dual-engine TTS, or continuous 3D avatar landmark animation.

## Tech Stack

| Category | Technologies |
|---|---|
| AI & Machine Learning | PyTorch, ONNX Runtime, BiLSTM + Temporal Attention (98-dim, 64-frame) |
| Large Language Models (LLM) | **NVIDIA Nemotron-3.5-Bolt-E4B-4GB** (Gemma 4 Base + GRPO RL via NeMo / KoboldCpp offline), **NVIDIA Nemotron-3 Ultra 550B** (OpenRouter online) |
| Computer Vision & Emotion | OpenCV, MediaPipe Holistic 0.10.14, ViT-ONNX Facial Emotion Classifier |
| Speech Recognition (STT) | **HIMA-ASR ONNX INT8** (Direct Bengali & English script), **Silero VAD v6**, ElevenLabs Scribe (Optional) |
| Text-to-Speech (TTS) | Edge-TTS, BanglaTTS (Silero), ElevenLabs eleven_v3 |
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| 3D Visualization | Three.js, WebGL |
| Backend | Python 3.11, FastAPI, Uvicorn, httpx |
| Audio & Data Processing | NumPy, SoundFile, Librosa, Tokenizers |

## Project Objectives

- Improve communication between Deaf and hearing communities in West Bengal.
- Support natural Bengali translation instead of isolated word-by-word output.
- Build a practical sign recognition system runnable on CPU without cloud dependency.
- Prevent translation hallucinations through neural VAD and out-of-distribution sign detection.
- Provide a scalable foundation for regional sign language research and dataset expansion.

## Future Scope

- Expand the WBSL sign vocabulary and continuous signing dataset.
- Improve recognition accuracy across diverse signers, lighting, and recording conditions.
- Integrate grammatical non-manual marker recognition (mouth morphemes, eyebrow raises).
- Enhance 3D avatar physics, hand articulation, and smooth transitions.
- Reintroduce community-driven dataset contributions with validation pipelines.

---

<p align="center">
  <strong>WBSL Bridge — Bridging Communication Through Technology</strong>
</p>

<p align="center">
  <img src="docs/assets/model front view.png" alt="WBSL Bridge ROBOT" width="500" />
</p>
