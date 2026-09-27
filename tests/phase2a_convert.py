import cv2
import numpy as np
import mediapipe as mp
from pathlib import Path

DATA_DIR = Path("Indian Sign Language_Dataset/ISL/data")
OUT_DIR = Path("dataset_landmarks")
OUT_DIR.mkdir(exist_ok=True)
SAMPLES_PER_CLASS = 300

hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=1)

for cls_dir in sorted(DATA_DIR.iterdir()):
    if not cls_dir.is_dir():
        continue
    rows = []
    files = sorted(cls_dir.glob("*.jpg"))[:SAMPLES_PER_CLASS]
    for f in files:
        img = cv2.imread(str(f))
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)
        if res.multi_hand_landmarks:
            lm = res.multi_hand_landmarks[0].landmark
            pts = np.array([[p.x, p.y, p.z] for p in lm], dtype=np.float32)
            # Wrist-centering (position invariance)
            pts -= pts[0]
            # Scale normalization by hand size (size invariance)
            scale = np.linalg.norm(pts[9]) + 1e-6
            pts /= scale
            rows.append(pts.flatten())  # 63 values
    arr = np.array(rows, dtype=np.float32)
    np.save(OUT_DIR / f"{cls_dir.name}.npy", arr)
    print(f"{cls_dir.name}: {len(rows)}/{len(files)} hands detected")

hands.close()
print("Conversion complete.")