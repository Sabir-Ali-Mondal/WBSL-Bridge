# MVT 1.2: DeepFace Emotion Detection

## 1. Environment Setup (Separate Venv Required)
> **CRITICAL:** DeepFace/TensorFlow CANNOT coexist with MediaPipe/JAX in the same venv due to numpy version conflict. Use a dedicated environment.

```powershell
py -3.11 -m venv .venv-deepface
.\.venv-deepface\Scripts\Activate.ps1
pip install tensorflow==2.13.0 deepface opencv-python==4.10.0.84
```

## 2. The Dependency Conflict (Situation We Faced)
*   **MediaPipe 0.10.14** requires `jax` → requires `numpy >= 2.0`
*   **TensorFlow 2.13** requires `numpy <= 1.24.3`
*   These are fundamentally incompatible in one venv.

| Venv | Purpose | Key Libraries |
|:---|:---|:---|
| `.venv` | MediaPipe, PyTorch, ONNX | mediapipe 0.10.14, torch, onnxruntime |
| `.venv-deepface` | DeepFace emotion detection | tensorflow 2.13, deepface |

## 3. Test A: Static Snapshot (`test_1_2_deepface_snapshot.py`)

```python
import cv2, os, logging, tensorflow as tf
from deepface import DeepFace

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel('ERROR')

print("Initializing DeepFace...")
cap = cv2.VideoCapture(0)
ret, frame = cap.read()
cap.release()

if not ret:
    print("Failed to capture image."); exit()

img_path = "test_face.jpg"
cv2.imwrite(img_path, frame)

try:
    result = DeepFace.analyze(img_path=img_path, actions=['emotion'], enforce_detection=False)
    emotion_dict = result[0]['emotion'] if isinstance(result, list) else result['emotion']
    print("\n--- Emotion Analysis Result ---")
    for emotion, score in emotion_dict.items():
        print(f"{emotion.capitalize():<10}: {score:.2f}%")
except Exception as e:
    print(f"Error: {e}")

os.remove(img_path)
print("Done.")
```

## 4. Test B: Live Emotion (`test_1_2_live_emotion.py`)

```python
import cv2, os, logging, tensorflow as tf
from deepface import DeepFace

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel('ERROR')

cap = cv2.VideoCapture(0)
frame_count = 0
current_emotion = "Initializing..."
emotion_dict = {}

print("Starting Live Emotion Detection... Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: continue
    frame = cv2.flip(frame, 1)
    frame_count += 1

    # Analyze every 15 frames to maintain FPS
    if frame_count % 15 == 0:
        try:
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = DeepFace.analyze(rgb, actions=['emotion'], enforce_detection=False)
            emotion_dict = result[0]['emotion'] if isinstance(result, list) else result['emotion']
            current_emotion = max(emotion_dict, key=emotion_dict.get)
        except: pass

    cv2.putText(frame, f"Emotion: {current_emotion.capitalize()}",
                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    if emotion_dict:
        top3 = sorted(emotion_dict.items(), key=lambda x: x[1], reverse=True)[:3]
        for i, (emo, sc) in enumerate(top3):
            cv2.putText(frame, f"{emo}: {sc:.1f}%",
                        (10, 80 + i*30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

    cv2.imshow('WBSL Bridge - Live Emotion', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()
```

## 5. Why Every 15 Frames?
*   DeepFace inference: ~100ms per call.
*   Running every frame = ~5 FPS (unusable).
*   Every 15 frames = smooth video + emotion updates every ~0.5 seconds.

## 6. Success Criteria Checklist
- [x] Snapshot: Console outputs 7 emotion probabilities.
- [x] Live: Video feed shows dominant emotion + top 3 scores.
- [x] First run downloads model (~6MB). Subsequent runs are instant.
- [x] Press `q` cleanly exits.

## 7. Final Project Integration Note
In the full WBSL Bridge, DeepFace will integrate with MediaPipe via:
1. **Subprocess**: Main script calls DeepFace in `.venv-deepface` as a child process.
2. **ONNX Export**: Export DeepFace's emotion model to ONNX, run via `onnxruntime` (no TF needed).
3. **Microservice**: Run DeepFace behind a local FastAPI endpoint.
```

---

**Phase 1 status:**
- [x] 1.1 MediaPipe Stream
- [x] 1.2 DeepFace Snapshot + Live
- [ ] 1.3 Geometry NMM
