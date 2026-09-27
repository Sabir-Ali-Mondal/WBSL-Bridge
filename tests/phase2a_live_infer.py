import cv2
import json
import numpy as np
import mediapipe as mp
import onnxruntime as ort
from collections import deque

session = ort.InferenceSession("sign_mlp.onnx", providers=["CPUExecutionProvider"])
input_name = session.get_inputs()[0].name
classes = json.load(open("sign_classes.json"))

mp_hands = mp.solutions.hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5
)

history = deque(maxlen=10)

cap = cv2.VideoCapture(0)
print("Live ISL Alphabet Recognition (Landmark MLP)")
print("Show your hand to the camera. Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = mp_hands.process(rgb)

    pred_text = "NO HAND"
    confidence = 0.0

    if results.multi_hand_landmarks:
        hlm = results.multi_hand_landmarks[0]

        # Draw hand landmarks
        mp.solutions.drawing_utils.draw_landmarks(
            frame, hlm, mp.solutions.hands.HAND_CONNECTIONS
        )

        # Extract and normalize landmarks (same as training)
        pts = np.array([[lm.x, lm.y, lm.z] for lm in hlm.landmark], dtype=np.float32)
        pts -= pts[0]  # wrist-centering
        scale = np.linalg.norm(pts[9]) + 1e-6
        pts /= scale  # scale normalization
        inp = pts.flatten().reshape(1, 63)

        # Run ONNX inference
        logits = session.run(None, {input_name: inp})[0][0]
        exp = np.exp(logits - logits.max())
        probs = exp / exp.sum()
        idx = int(np.argmax(probs))
        confidence = probs[idx] * 100

        # Temporal smoothing (majority vote over last 10 frames)
        history.append(idx)
        counts = np.bincount(list(history), minlength=len(classes))
        final_idx = int(np.argmax(counts))
        pred_text = classes[final_idx]

        # Bounding box around hand
        xs = [lm.x * w for lm in hlm.landmark]
        ys = [lm.y * h for lm in hlm.landmark]
        pad = 20
        x1, y1 = int(min(xs)) - pad, int(min(ys)) - pad
        x2, y2 = int(max(xs)) + pad, int(max(ys)) + pad
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    else:
        history.clear()

    # Display prediction
    color = (0, 255, 0) if confidence > 80 else (0, 165, 255)
    cv2.putText(frame, f"{pred_text} ({confidence:.0f}%)",
                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)

    cv2.imshow('WBSL Bridge - Live ISL Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

mp_hands.close()
cap.release()
cv2.destroyAllWindows()