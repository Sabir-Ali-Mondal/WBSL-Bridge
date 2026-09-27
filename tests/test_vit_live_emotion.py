import cv2
import numpy as np
import onnxruntime as ort

# Load ONNX model
session = ort.InferenceSession("vit_emotion.onnx", providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name

labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

def preprocess(frame):
    img = cv2.resize(frame, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img.astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    img = np.transpose(img, (2, 0, 1))
    img = np.expand_dims(img, axis=0)
    return img

def predict(frame):
    input_data = preprocess(frame)
    outputs = session.run(None, {input_name: input_data})
    logits = outputs[0][0]
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / exp_logits.sum()
    idx = np.argmax(probs)
    return labels[idx], probs[idx] * 100, probs

cap = cv2.VideoCapture(0)
frame_count = 0
current_emotion = "Initializing..."
confidence = 0.0
all_probs = np.zeros(7)

print("Starting ViT-ONNX Live Emotion Detection (ALL 7)...")
print("Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)
    frame_count += 1

    if frame_count % 10 == 0:
        try:
            current_emotion, confidence, all_probs = predict(frame)
        except:
            pass

    # Draw dominant emotion (top)
    color = (0, 255, 0) if confidence > 70 else (0, 165, 255)
    cv2.putText(frame, f"DOMINANT: {current_emotion.upper()} ({confidence:.1f}%)",
                (10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    # Draw ALL 7 emotions with bars
    start_y = 70
    for i in range(7):
        label = labels[i]
        score = all_probs[i] * 100

        # Color: green if dominant, white otherwise
        bar_color = (0, 255, 0) if i == np.argmax(all_probs) else (255, 255, 255)

        # Label text
        cv2.putText(frame, f"{label.capitalize():<10}", (10, start_y + i * 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, bar_color, 1)

        # Percentage
        cv2.putText(frame, f"{score:.1f}%", (120, start_y + i * 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, bar_color, 1)

        # Bar (visual representation)
        bar_width = int(score * 2)  # scale for visibility
        cv2.rectangle(frame, (180, start_y + i * 30 - 12), (180 + bar_width, start_y + i * 30), bar_color, -1)

    cv2.imshow('WBSL Bridge - All 7 Emotions', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()