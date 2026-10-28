# WBSL Bridge

**Intent-Aware Bidirectional Sign Language Communication for the Deaf Community of West Bengal with Unknown Sign Handling and Community-Driven Growth**

<p align="center">
  <img src="frontend/public/WBSL%20Bridge%20logo.png" alt="WBSL Bridge Logo" width="900" />
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

The system uses computer vision and deep learning to recognize hand and body movements, while local language models help generate natural Bengali sentences. It also supports unknown sign handling, speech recognition, and 3D sign visualization.

Designed for consumer-grade computers, WBSL Bridge aims to provide accessible communication with minimal cloud dependency while supporting future development of regional sign language datasets.

## Key Features

- **Sign to Bengali:** Recognizes signs and generates Bengali text and speech.
- **Bengali to Sign:** Converts Bengali text or voice into sign glosses and sign videos.
- **Continuous Sign Recognition:** Processes sequences of signs using temporal deep learning.
- **Unknown Sign Handling:** Identifies unsupported signs to help avoid incorrect translations.
- **Local AI Processing:** Supports CPU-based inference with reduced cloud dependency.
- **Speech Technologies:** Integrates speech recognition and Bengali text-to-speech.
- **3D Visualization:** Supports sign movement visualization using Three.js.
- **Dataset Support:** Provides a foundation for future regional sign language dataset development.

## System Architecture

1. **Input:** Webcam video, Bengali text, or voice.
2. **Feature Extraction:** Hand and body landmark processing using MediaPipe.
3. **Sign Recognition:** Temporal deep learning models predict sign glosses.
4. **Language Processing:** A local language model converts gloss sequences into natural Bengali.
5. **Output:** Bengali text and speech, or corresponding sign videos and animations.

## Tech Stack

| Category | Technologies |
|---|---|
| AI and Machine Learning | BiLSTM, MediaPipe, ONNX Runtime |
| Language Models | Gemma, Nemotron, KoboldCpp |
| Computer Vision | OpenCV, Hand and Body Landmark Detection |
| Speech Recognition | Faster-Whisper, Silero VAD |
| Text-to-Speech | Edge TTS, BanglaTTS, ElevenLabs |
| Frontend | Next.js, React, TypeScript |
| Backend | Python, FastAPI |
| 3D Visualization | Three.js |
| Data Processing | NumPy, NumPy `.npy` format |
| Model Optimization | ONNX, Quantized Inference |

## Project Objectives

- Improve communication between Deaf and hearing communities in West Bengal.
- Support natural Bengali translation instead of isolated word-by-word output.
- Build a practical sign recognition system for consumer-grade hardware.
- Support unknown sign handling and future dataset expansion.
- Provide a foundation for regional sign language research and development.

## Future Scope

- Expand the WBSL sign vocabulary and continuous signing dataset.
- Improve recognition accuracy across different signers and recording conditions.
- Introduce grammatical non-manual marker recognition.
- Enhance 3D avatar-based sign reproduction.
- Reintroduce community-driven dataset contributions after redesign.

---

<p align="center">
  <strong>WBSL Bridge — Bridging Communication Through Technology</strong>
</p>