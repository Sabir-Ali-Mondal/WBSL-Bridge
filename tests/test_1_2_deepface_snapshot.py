import cv2
import os
import logging
import tensorflow as tf
from deepface import DeepFace

# Suppress TensorFlow and DeepFace noisy console logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel('ERROR')

print("Initializing DeepFace...")
print("NOTE: On the very first run, it will download pre-trained models (~100MB). Please wait.")

# 1. Capture a single frame from the webcam
cap = cv2.VideoCapture(0)
ret, frame = cap.read()
cap.release()

if not ret:
    print("Failed to capture image from webcam.")
    exit()

# Save the frame temporarily
img_path = "test_face.jpg"
cv2.imwrite(img_path, frame)
print(f"Saved snapshot to {img_path}")

# 2. Analyze the saved image using DeepFace
print("Analyzing emotion... (This may take a few seconds)")
try:
    # enforce_detection=False prevents crashes if the face isn't perfectly framed
    result = DeepFace.analyze(
        img_path=img_path, 
        actions=['emotion'], 
        enforce_detection=False
    )
    
    # DeepFace returns a list of dicts (if multiple faces) or a single dict. Handle both.
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

# Cleanup the temporary image
if os.path.exists(img_path):
    os.remove(img_path)
    
print("Test completed. Temporary image cleaned up.")