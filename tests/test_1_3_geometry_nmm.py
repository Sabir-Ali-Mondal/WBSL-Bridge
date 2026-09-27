import cv2
import numpy as np
import mediapipe as mp
from collections import deque

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Landmark indices
LEFT_EYEBROW = [70, 63, 105, 66, 107]
RIGHT_EYEBROW = [300, 293, 334, 296, 336]
LEFT_EYE_TOP = 159
LEFT_EYE_BOTTOM = 145
RIGHT_EYE_TOP = 386
RIGHT_EYE_BOTTOM = 374
UPPER_LIP = 13
LOWER_LIP = 14
NOSE_TIP = 1
FACE_LEFT = 234
FACE_RIGHT = 454

# Thresholds (tune by watching debug values)
BROW_RAISE_THRESHOLD = 0.060
BROW_FURROW_THRESHOLD = 0.040
MOUTH_THRESHOLD = 0.040
HEAD_SHAKE_VAR_THRESHOLD = 0.0008
HEAD_NOD_VAR_THRESHOLD = 0.0008
WINDOW = 15

# History buffers
nose_x_history = deque(maxlen=WINDOW)
nose_y_history = deque(maxlen=WINDOW)

def get_point(landmarks, idx, w, h):
    lm = landmarks.landmark[idx]
    return np.array([lm.x * w, lm.y * h])

def dist(p1, p2):
    return np.linalg.norm(p1 - p2)

cap = cv2.VideoCapture(0)
print("Geometry NMM Detection - 5 Markers")
print("1. Raise eyebrows    -> QUESTION (Yes/No)")
print("2. Furrow eyebrows   -> WH-QUESTION (Who/What/Where)")
print("3. Shake head L-R    -> NEGATION")
print("4. Nod head U-D      -> AFFIRMATION")
print("5. Open mouth wide   -> EMPHASIS")
print("Press 'q' to quit.\n")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        continue

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    flags = []

    if results.multi_face_landmarks:
        lm = results.multi_face_landmarks[0]

        # Normalize by face width
        fw = dist(get_point(lm, FACE_LEFT, w, h), get_point(lm, FACE_RIGHT, w, h))
        if fw == 0:
            fw = 1

        # --- 1 & 2: Eyebrow Raise / Furrow ---
        lb = np.mean([get_point(lm, i, w, h) for i in LEFT_EYEBROW], axis=0)
        rb = np.mean([get_point(lm, i, w, h) for i in RIGHT_EYEBROW], axis=0)
        le = (get_point(lm, LEFT_EYE_TOP, w, h) + get_point(lm, LEFT_EYE_BOTTOM, w, h)) / 2
        re = (get_point(lm, RIGHT_EYE_TOP, w, h) + get_point(lm, RIGHT_EYE_BOTTOM, w, h)) / 2
        brow_ratio = (dist(lb, le) + dist(rb, re)) / 2 / fw

        if brow_ratio > BROW_RAISE_THRESHOLD:
            flags.append(("QUESTION (Yes/No)", (0, 255, 255)))
        elif brow_ratio < BROW_FURROW_THRESHOLD:
            flags.append(("WH-QUESTION (Who/What)", (255, 0, 255)))

        # --- 3 & 4: Head Shake / Head Nod ---
        nose = get_point(lm, NOSE_TIP, w, h)
        nose_x_history.append(nose[0] / fw)
        nose_y_history.append(nose[1] / fw)

        x_var = 0.0
        y_var = 0.0
        if len(nose_x_history) == WINDOW:
            x_var = np.var(list(nose_x_history))
            y_var = np.var(list(nose_y_history))

            if x_var > HEAD_SHAKE_VAR_THRESHOLD:
                flags.append(("NEGATION (Head Shake)", (0, 0, 255)))
            if y_var > HEAD_NOD_VAR_THRESHOLD:
                flags.append(("AFFIRMATION (Head Nod)", (0, 255, 0)))

        # --- 5: Mouth Open ---
        mouth_ratio = dist(get_point(lm, UPPER_LIP, w, h), get_point(lm, LOWER_LIP, w, h)) / fw
        if mouth_ratio > MOUTH_THRESHOLD:
            flags.append(("EMPHASIS (Mouth Open)", (0, 165, 255)))

        # --- Draw debug values ---
        cv2.putText(frame, f"Brow: {brow_ratio:.4f}  Mouth: {mouth_ratio:.4f}  X-Var: {x_var:.5f}  Y-Var: {y_var:.5f}",
                    (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 200, 200), 1)

        # --- Draw flags ---
        y_pos = 55
        for label, color in flags:
            cv2.putText(frame, f"[{label}]", (10, y_pos),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
            y_pos += 35

        if not flags:
            cv2.putText(frame, "[NEUTRAL]", (10, 55),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (150, 150, 150), 2)

    cv2.imshow('WBSL Bridge - Geometry NMM (5 Markers)', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

face_mesh.close()
cap.release()
cv2.destroyAllWindows()