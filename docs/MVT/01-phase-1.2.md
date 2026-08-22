# MVT 1.2: DeepFace Snapshot

## 1. Environment Setup (Separate Venv)
> **CRITICAL:** DeepFace/TensorFlow CANNOT coexist with MediaPipe/JAX in the same venv. Use a separate environment.

```powershell
py -3.11 -m venv .venv-deepface
.\.venv-deepface\Scripts\Activate.ps1
pip install tensorflow==2.13.0 deepface opencv-python==4.10.0.84
```

## 2. The Dependency Conflict (Situation We Faced)
*   **MediaPipe 0.10.14** requires `jax` → requires `numpy >= 2.0`
*   **TensorFlow 2.13** requires `numpy <= 1.24.3`
*   These are fundamentally incompatible. Solution: separate venvs.

| Venv | Purpose | Key Libraries |
|:---|:---|:---|
| `.venv` | MediaPipe, PyTorch, ONNX | mediapipe, torch, onnxruntime |
| `.venv-deepface` | DeepFace emotion detection | tensorflow 2.13, deepface |

## 3. The Code (`test_1_2_deepface_snapshot.py`)
```python
import cv2
import os
import logging
import tensorflow as tf
from deepface import DeepFace

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel('ERROR')

print("Initializing DeepFace...")
print("NOTE: On the very first run, it will download pre-trained models (~100MB). Please wait.")

cap = cv2.VideoCapture(0)
ret, frame = cap.read()
cap.release()

if not ret:
    print("Failed to capture image from webcam.")
    exit()

img_path = "test_face.jpg"
cv2.imwrite(img_path, frame)
print(f"Saved snapshot to {img_path}")

print("Analyzing emotion... (This may take a few seconds)")
try:
    result = DeepFace.analyze(
        img_path=img_path, 
        actions=['emotion'], 
        enforce_detection=False
    )
    
    if isinstance(result, list):
        emotion_dict = result[0]['emotion']
    else:
        emotion_dict = result['emotion']
        
    print("\n--- Emotion Analysis Result ---")
    for emotion, score in emotion_dict.items():
        print(f"{emotion.capitalize():<10}: {score:.2f}%")
    print("-------------------------------\n")
    
except Exception as e:
    print(f"Error during analysis: {e}")

if os.path.exists(img_path):
    os.remove(img_path)
    
print("Test completed. Temporary image cleaned up.")
```

## 4. Success Criteria Checklist
- [x] Webcam captures one frame and closes.
- [x] DeepFace downloads model on first run (subsequent runs are instant).
- [x] Console outputs 7 emotion probabilities.
- [x] Temporary image file is automatically deleted.

## 5. Final Project Integration Note
For the full WBSL Bridge system, DeepFace will run as a **separate microservice** or be exported to **ONNX** to avoid the TensorFlow/MediaPipe conflict in production.
```

---

**Phase 1 status:**
- [x] 1.1 MediaPipe Stream
- [x] 1.2 DeepFace Snapshot
- [ ] 1.3 Geometry NMM

Ready for **MVT 1.3: Geometry NMM** (eyebrow raise + mouth open detection using landmark math)? This one runs in your **main `.venv`** since it only uses MediaPipe + NumPy. Let me know!
