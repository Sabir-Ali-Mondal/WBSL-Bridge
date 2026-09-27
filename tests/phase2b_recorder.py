
import cv2
import numpy as np
import mediapipe as mp
import os

mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

NPY_DIR = "dataset_continuous/npy"
VID_DIR = "dataset_continuous/videos"
os.makedirs(NPY_DIR, exist_ok=True)
os.makedirs(VID_DIR, exist_ok=True)

LEFT_EYEBROW = [70, 63, 105, 66, 107]
RIGHT_EYEBROW = [300, 293, 334, 296, 336]
LEFT_EYE_TOP, LEFT_EYE_BOTTOM = 159, 145
RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM = 386, 374
UPPER_LIP, LOWER_LIP = 13, 14
POSE_IDX = [11, 12, 13, 14, 15, 16]  # shoulders, elbows, wrists

def extract_frame(res):
    feats = []

    # Hands (126) - same normalization as 2A
    left = right = None
    if res.left_hand_landmarks:
        left = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    if res.right_hand_landmarks:
        right = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    ref = right if right is not None else left
    if ref is not None:
        r0 = ref[0]
        scale = np.linalg.norm(ref[9] - ref[0]) + 1e-6
        lh = ((left - r0) / scale).flatten() if left is not None else np.zeros(63, np.float32)
        rh = ((right - r0) / scale).flatten() if right is not None else np.zeros(63, np.float32)
    else:
        lh = np.zeros(63, np.float32)
        rh = np.zeros(63, np.float32)
    feats += [lh, rh]

    # Upper body pose (18) - shoulder-center normalized
    if res.pose_landmarks:
        pts = np.array([[res.pose_landmarks.landmark[i].x,
                         res.pose_landmarks.landmark[i].y,
                         res.pose_landmarks.landmark[i].z] for i in POSE_IDX], np.float32)
        center = (pts[0] + pts[1]) / 2
        width = np.linalg.norm(pts[0] - pts[1]) + 1e-6
        feats.append(((pts - center) / width).flatten())
    else:
        feats.append(np.zeros(18, np.float32))

    # NMM ratios (2) - brow and mouth
    if res.face_landmarks:
        lm = res.face_landmarks.landmark
        def P(i): return np.array([lm[i].x, lm[i].y])
        lb = np.mean([P(i) for i in LEFT_EYEBROW], 0)
        rb = np.mean([P(i) for i in RIGHT_EYEBROW], 0)
        le = (P(LEFT_EYE_TOP) + P(LEFT_EYE_BOTTOM)) / 2
        re = (P(RIGHT_EYE_TOP) + P(RIGHT_EYE_BOTTOM)) / 2
        fw = np.linalg.norm(P(234) - P(454)) + 1e-6
        brow = ((np.linalg.norm(lb - le) + np.linalg.norm(rb - re)) / 2) / fw
        mouth = np.linalg.norm(P(UPPER_LIP) - P(LOWER_LIP)) / fw
        feats.append(np.array([brow, mouth], np.float32))
    else:
        feats.append(np.zeros(2, np.float32))

    return np.concatenate(feats)  # 146

recording = False
sequence = []
label = "sign"
count = 0
writer = None

cap = cv2.VideoCapture(0)
print("=== Continuous Recorder ===")
print("n = set label | s = start | e = end+save | q = quit")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    res = holistic.process(rgb)

    if recording:
        sequence.append(extract_frame(res))
        if writer is not None:
            writer.write(frame)

    status = f"REC [{len(sequence)}]" if recording else "IDLE"
    cv2.putText(frame, f"Label: {label}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    cv2.putText(frame, status, (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255) if recording else (200, 200, 200), 2)
    cv2.putText(frame, f"Saved: {count}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
    cv2.imshow('WBSL Bridge - Continuous Recorder', frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('n'):
        recording = False
        label = input("New label: ").strip()
        print(f"Label set: {label}")
    elif key == ord('s'):
        recording = True
        sequence = []
        writer = cv2.VideoWriter(os.path.join(VID_DIR, f"{label}_{count:03d}.mp4"),
                                 cv2.VideoWriter_fourcc(*'mp4v'), 30, (w, h))
        print(f"[START] {label}")
    elif key == ord('e'):
        recording = False
        if writer is not None:
            writer.release()
            writer = None
        if len(sequence) > 10:
            arr = np.array(sequence, np.float32)
            np.save(os.path.join(NPY_DIR, f"{label}_{count:03d}.npy"), arr)
            print(f"[SAVED] {label}_{count:03d}.npy | Shape: {arr.shape}")
            count += 1
        else:
            print("[SKIP] Too short")
    elif key == ord('q'):
        break

if writer is not None:
    writer.release()
holistic.close()
cap.release()
cv2.destroyAllWindows()