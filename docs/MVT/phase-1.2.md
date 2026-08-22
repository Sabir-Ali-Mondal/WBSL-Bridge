# MVT 1.2b: ViT-ONNX Emotion Detection (DeepFace Replacement)

## 1. Why We Upgraded from DeepFace
During initial testing, DeepFace (FER2013 model) consistently misclassified emotions when the user wore glasses, locking onto "fear" due to shadow artifacts around the eyes. Furthermore, TensorFlow 2.13 created a hard dependency conflict with MediaPipe/JAX in the main virtual environment. 

**Solution:** We replaced DeepFace with a HuggingFace ViT-based emotion model (`trpakov/vit-face-expression`), exported it to ONNX, and ran it via `onnxruntime`. 
- ✅ **Robust to glasses and lighting**
- ✅ **Runs in the main `.venv` alongside MediaPipe** (no dual-venv conflict)
- ✅ **Faster inference** (~30-50ms per frame)

## 2. Environment Setup (Main Venv)
```powershell
# Ensure main venv is active
.\.venv\Scripts\Activate.ps1

# Install required libraries
pip install transformers onnxruntime onnxscript pillow torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Fix dependency alignment
pip uninstall tensorflow-intel tensorflow-estimator tensorboard keras -y
pip install "numpy>=2.0" protobuf==4.25.9 "ml_dtypes>=0.5.0"
```

## 3. Step 1: Export Script (`export_vit_emotion_to_onnx.py`)
Downloads the ViT model from HuggingFace and converts it to a lightweight ONNX file. Run once.

```python
import torch
from transformers import AutoModelForImageClassification, AutoImageProcessor
from pathlib import Path

MODEL_NAME = "trpakov/vit-face-expression"
ONNX_PATH = "vit_emotion.onnx"

print(f"Loading {MODEL_NAME}...")
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model.eval()

dummy_input = torch.randn(1, 3, 224, 224)

print(f"Exporting to {ONNX_PATH}...")
torch.onnx.export(
    model, dummy_input, ONNX_PATH,
    export_params=True, opset_version=18, do_constant_folding=True,
    input_names=["pixel_values"], output_names=["logits"],
    dynamic_axes={"pixel_values": {0: "batch_size"}, "logits": {0: "batch_size"}}
)

labels = model.config.id2label
Path("emotion_labels.txt").write_text("\n".join(f"{i}: {label}" for i, label in labels.items()))
print(f"✅ Exported successfully!\nLabels: {labels}")
```

## 4. Step 2: Live Inference Script (`test_vit_live_emotion.py`)
Runs the ONNX model live on webcam feed, displaying all 7 emotion probabilities with visual bars.

```python
import cv2
import numpy as np
import onnxruntime as ort

session = ort.InferenceSession("vit_emotion.onnx", providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name

labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

def preprocess(frame):
    img = cv2.resize(frame, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    return np.expand_dims(np.transpose(img, (2, 0, 1)), axis=0)

def predict(frame):
    outputs = session.run(None, {input_name: preprocess(frame)})
    logits = outputs[0][0]
    probs = np.exp(logits - np.max(logits))
    probs /= probs.sum()
    idx = np.argmax(probs)
    return labels[idx], probs[idx] * 100, probs

cap = cv2.VideoCapture(0)
frame_count = 0
current_emotion, confidence = "Initializing...", 0.0
all_probs = np.zeros(7)

print("Starting ViT-ONNX Live Emotion Detection... Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: continue
    frame = cv2.flip(frame, 1)
    frame_count += 1

    if frame_count % 10 == 0:
        try:
            current_emotion, confidence, all_probs = predict(frame)
        except: pass

    # Draw dominant emotion
    color = (0, 255, 0) if confidence > 70 else (0, 165, 255)
    cv2.putText(frame, f"DOMINANT: {current_emotion.upper()} ({confidence:.1f}%)",
                (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    # Draw ALL 7 emotions with bars
    for i in range(7):
        score = all_probs[i] * 100
        bar_color = (0, 255, 0) if i == np.argmax(all_probs) else (255, 255, 255)
        cv2.putText(frame, f"{labels[i].capitalize():<10}", (10, 70 + i*30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, bar_color, 1)
        cv2.putText(frame, f"{score:.1f}%", (120, 70 + i*30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, bar_color, 1)
        cv2.rectangle(frame, (180, 70 + i*30 - 12), (180 + int(score*2), 70 + i*30), bar_color, -1)

    cv2.imshow('WBSL Bridge - All 7 Emotions', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()
```

## 5. Critical Architectural Insight (Practical Relevance to WBSL)
While the ViT-ONNX pipeline successfully proves real-time, high-accuracy facial data extraction without dependency conflicts, **broad emotion classification has limited direct utility for sign language grammar translation.** 

During live testing, it was observed that generic emotional states (e.g., "sad", "angry", "disgust") do not reliably map to linguistic intent in sign language. Sign language relies on specific, deliberate facial movements known as **Non-Manual Markers (NMMs)**—such as eyebrow raises for yes/no questions, head shakes for negation, or mouth opening for emphasis—rather than sustained emotional expressions. 

**Conclusion:** The emotion detection module will serve primarily as a supplementary context layer (e.g., detecting a "happy" greeting). The core grammatical intent of WBSL Bridge will rely heavily on geometric landmark tracking and NMM detection (MVT 1.3), which provides far more linguistically accurate signals than raw emotion classifiers.

## 6. Success Criteria Checklist
- [x] ViT model successfully exported to ONNX format.
- [x] Live webcam inference runs smoothly in main `.venv`.
- [x] All 7 emotions displayed with real-time probability bars.
- [x] Model remains robust and accurate even when wearing glasses.
- [x] Architectural limitation documented: Emotion detection is supplementary; Geometric NMMs are primary.
