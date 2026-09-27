# MVT 1.1: MediaPipe Holistic Stream

## 1. Environment Setup & Installation

**Prerequisite:** Python 3.11 installed and added to PATH. (Python 3.12+ is not fully supported by MediaPipe/DeepFace yet).

```powershell
# 1. Create and activate virtual environment
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Upgrade pip
python -m pip install --upgrade pip

# 3. Install Vision & Math libraries 
# IMPORTANT: Specify version 0.10.14 to avoid the dummy 1.0.1 package
pip install mediapipe==0.10.14 opencv-python numpy

# 4. Install PyTorch (CPU version)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

## 2. Troubleshooting Guide (The Situation We Faced)

*   **The Problem:** Running `pip install mediapipe` without a version number installs `mediapipe 1.0.1`. This is an unrelated dummy package on PyPI, not Google's MediaPipe. It causes the error: `AttributeError: module 'mediapipe' has no attribute 'solutions'`.
*   **The Fix:** Always explicitly install Google's version using `pip install mediapipe==0.10.14`.
*   **Harmless Warnings:** You will see `WARNING: All log messages before absl::InitializeLog()...` and `UserWarning: SymbolDatabase.GetPrototype() is deprecated`. These are internal C++ backend and Protobuf warnings. They do not affect performance or functionality. Ignore them.

## 3. The Code (`test_1_1_mediapipe_stream.py`)

```python
import cv2
import mediapipe as mp
import time

# Initialize MediaPipe Holistic
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Initialize Drawing Utilities
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Open Webcam
cap = cv2.VideoCapture(0)

# Frame timing for FPS calculation
prev_time = 0

print("Starting MediaPipe Holistic Stream...")
print("Press 'q' to quit.")

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Flip image horizontally for a later selfie-view display
    image = cv2.flip(image, 1)
    
    # Convert BGR to RGB
    rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process the image with Holistic
    results = holistic.process(rgb_image)

    # Draw Landmarks
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
        
    if results.left_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_hand_landmarks_style())
            
    if results.right_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_hand_landmarks_style())

    if results.face_landmarks:
        mp_drawing.draw_landmarks(
            image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_tesselation_style())
        
    # Calculate FPS
    curr_time = time.time()
    fps = 1 / (curr_time - prev_time)
    prev_time = curr_time

    # Display Stats on Screen
    cv2.putText(image, f'FPS: {int(fps)}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    # Console Output for Verification
    if int(curr_time * 10) % 30 == 0:
        hand_count = 0
        if results.left_hand_landmarks: hand_count += 21
        if results.right_hand_landmarks: hand_count += 21
        face_count = len(results.face_landmarks.landmark) if results.face_landmarks else 0
        pose_count = len(results.pose_landmarks.landmark) if results.pose_landmarks else 0
        
        print(f"Landmarks Detected -> Hands: {hand_count}, Face: {face_count}, Pose: {pose_count}")

    # Show Image
    cv2.imshow('WBSL Bridge - MVT 1.1', image)

    # Break loop on 'q'
    if cv2.waitKey(5) & 0xFF == ord('q'):
        break

# Cleanup
holistic.close()
cap.release()
cv2.destroyAllWindows()
```

## 4. Success Criteria Checklist
- [x] Webcam opens and displays video feed.
- [x] Skeletal lines drawn on hands, body, and face mesh visible.
- [x] Console outputs `Face: 468` and `Pose: 33`.
- [x] Console outputs `Hands: 21` (one hand) or `Hands: 42` (both hands) when raised.
- [x] Pressing `q` successfully closes the window and stops the script.
