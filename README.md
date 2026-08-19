# SignSetu (সেতু)

> Real-Time Bidirectional Bengali Sign Language Communication System
> Bridging the Deaf and Hearing Worlds

## Problem
70 million Deaf and hard-of-hearing people worldwide lack
real-time communication tools. Bengali Sign Language (BdSL)
users in West Bengal and Bangladesh have virtually no
continuous, signer-independent, bidirectional translation system.

## What SignSetu Does

### Forward Path (Sign → Text/Speech)
Video → MediaPipe Holistic → Temporal Transformer → Constrained LLM → Bengali Text → TTS

### Reverse Path (Text/Speech → Sign)
Bengali Text/Speech → NLP Parser → Sign Sequence → 3D Avatar → Visual Sign Output

## Key Focus
- Indian Sign Language (ISL), especially Bengali users
- West Bengal and Bangladesh regional variations
- Real-time, low-latency, signer-independent
- LLM-based contextual sentence reconstruction
- Bidirectional communication

## Tech Stack
- Computer Vision: MediaPipe Holistic, OpenCV
- Deep Learning: PyTorch, Transformers
- LLM: Qwen (local, via Ollama)
- TTS: Bengali TTS engine
- Avatar: 3D sign language rendering ||| simple alternative

## Status
🚧 Active Development

## License
MIT
