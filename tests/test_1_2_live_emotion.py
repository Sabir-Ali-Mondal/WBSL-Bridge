import cv2
import os
import logging
import tensorflow as tf
from deepface import DeepFace

# Suppress noisy logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel('ERROR')

cap = cv2.VideoCapture(0)
frame_count = 0
current_emotion = "Initializing..."
emotion_dict = {}

print("Starting Live Emotion Detection...")
print("Press 'q' to quit.")
print("NOTE: First few seconds may be slow while model loads.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)
    frame_count += 1

    # Run DeepFace every 15 frames to maintain reasonable FPS
    if frame_count % 15 == 0:
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = DeepFace.analyze(
                rgb_frame, 
                actions=['emotion'], 
                enforce_detection=False
            )
            if isinstance(result, list):
                emotion_dict = result[0]['emotion']
            else:
                emotion_dict = result['emotion']

            # Get dominant emotion
            current_emotion = max(emotion_dict, key=emotion_dict.get)
        except Exception:
            pass

    # Draw dominant emotion (big text)
    cv2.putText(
        frame, f"Emotion: {current_emotion.capitalize()}",
        (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2
    )

    # Draw top 3 emotions with scores
    if emotion_dict:
        sorted_emotions = sorted(emotion_dict.items(), key=lambda x: x[1], reverse=True)[:3]
        for i, (emotion, score) in enumerate(sorted_emotions):
            cv2.putText(
                frame, f"{emotion}: {score:.1f}%",
                (10, 80 + i * 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1
            )

    cv2.imshow('WBSL Bridge - Live Emotion', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()