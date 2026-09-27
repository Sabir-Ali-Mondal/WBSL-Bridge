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
    # 1. Pose
    if results.pose_landmarks:
        mp_drawing.draw_landmarks(
            image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
        
    # 2. Hands (Left & Right)
    if results.left_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_hand_landmarks_style())
            
    if results.right_hand_landmarks:
        mp_drawing.draw_landmarks(
            image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles.get_default_hand_landmarks_style())

    # 3. Face Mesh
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
    
    # Console Output for Verification (Every 30 frames to avoid spam)
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