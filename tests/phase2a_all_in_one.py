import cv2
import json
import sys
import numpy as np
import mediapipe as mp
import onnxruntime as ort
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from collections import deque
from pathlib import Path

# ============ CONFIG ============
DATA_DIR = Path("Indian Sign Language_Dataset/ISL/data")
OUT_DIR = Path("dataset_landmarks")
SAMPLES_PER_CLASS = 300
EPOCHS = 50
LR = 0.001
BATCH_SIZE = 128
FEATURES = 126  # 2 hands x 21 landmarks x 3 coords

# ============ SHARED: Two-Hand Extraction ============
def extract_two_hands(res):
    if not res.multi_hand_landmarks:
        return None
    left = right = None
    for hlm, hness in zip(res.multi_hand_landmarks, res.multi_handedness):
        label = hness.classification[0].label
        pts = np.array([[p.x, p.y, p.z] for p in hlm.landmark], dtype=np.float32)
        if label == "Left" and left is None:
            left = pts
        elif label == "Right" and right is None:
            right = pts

    ref_hand = right if right is not None else left
    if ref_hand is None:
        return None
    ref = ref_hand[0]
    scale = np.linalg.norm(ref_hand[9] - ref_hand[0]) + 1e-6

    out_left = (left - ref) / scale if left is not None else np.zeros((21, 3), np.float32)
    out_right = (right - ref) / scale if right is not None else np.zeros((21, 3), np.float32)
    return np.concatenate([out_left.flatten(), out_right.flatten()])

# ============ STEP 1: CONVERT ============
def convert():
    OUT_DIR.mkdir(exist_ok=True)
    hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)
    print("\n=== CONVERTING IMAGES TO LANDMARKS ===")
    for cls_dir in sorted(DATA_DIR.iterdir()):
        if not cls_dir.is_dir():
            continue
        rows = []
        files = sorted(cls_dir.glob("*.jpg"))[:SAMPLES_PER_CLASS]
        for f in files:
            img = cv2.imread(str(f))
            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            vec = extract_two_hands(hands.process(rgb))
            if vec is not None:
                rows.append(vec)
        arr = np.array(rows, dtype=np.float32)
        np.save(OUT_DIR / f"{cls_dir.name}.npy", arr)
        print(f"{cls_dir.name}: {len(rows)}/{len(files)} samples")
    hands.close()
    print("Conversion complete.\n")

# ============ STEP 2: TRAIN ============
def train():
    print("\n=== TRAINING MLP ===")
    classes = sorted([p.stem for p in OUT_DIR.glob("*.npy")])
    class_to_idx = {c: i for i, c in enumerate(classes)}

    X, y = [], []
    for cls in classes:
        arr = np.load(OUT_DIR / f"{cls}.npy")
        X.append(arr)
        y.extend([class_to_idx[cls]] * len(arr))
    X = np.concatenate(X)
    y = np.array(y)
    print(f"Loaded {len(X)} samples, {len(classes)} classes")

    idx = np.random.default_rng(42).permutation(len(X))
    X, y = X[idx], y[idx]
    split = int(0.85 * len(X))

    train_ds = TensorDataset(torch.tensor(X[:split]), torch.tensor(y[:split], dtype=torch.long))
    val_ds = TensorDataset(torch.tensor(X[split:]), torch.tensor(y[split:], dtype=torch.long))
    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE)

    model = nn.Sequential(
        nn.Linear(FEATURES, 256), nn.ReLU(), nn.Dropout(0.3),
        nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.3),
        nn.Linear(128, len(classes))
    )
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LR)

    acc = 0.0
    for epoch in range(EPOCHS):
        model.train()
        for xb, yb in train_loader:
            optimizer.zero_grad()
            loss = criterion(model(xb), yb)
            loss.backward()
            optimizer.step()
        model.eval()
        correct, total = 0, 0
        with torch.no_grad():
            for xb, yb in val_loader:
                correct += (model(xb).argmax(1) == yb).sum().item()
                total += len(yb)
        acc = correct / total * 100
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{EPOCHS} | Val Acc: {acc:.1f}%")

    model.eval()
    dummy = torch.randn(1, FEATURES)
    torch.onnx.export(model, dummy, "sign_mlp.onnx", opset_version=18,
                      input_names=["landmarks"], output_names=["logits"],
                      dynamic_axes={"landmarks": {0: "batch"}, "logits": {0: "batch"}})
    json.dump(classes, open("sign_classes.json", "w"))
    print(f"Final Val Acc: {acc:.1f}%")
    print("Exported sign_mlp.onnx and sign_classes.json\n")

# ============ STEP 3: LIVE ============
def live():
    print("\n=== LIVE INFERENCE ===")
    session = ort.InferenceSession("sign_mlp.onnx", providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name
    classes = json.load(open("sign_classes.json"))

    hands = mp.solutions.hands.Hands(max_num_hands=2, min_detection_confidence=0.6)
    history = deque(maxlen=10)
    cap = cv2.VideoCapture(0)
    print("Show your hand(s). Press 'q' to quit.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            continue
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        pred_text = "NO HAND"
        confidence = 0.0

        vec = extract_two_hands(results)
        if vec is not None:
            for hlm in results.multi_hand_landmarks:
                mp.solutions.drawing_utils.draw_landmarks(
                    frame, hlm, mp.solutions.hands.HAND_CONNECTIONS)

            logits = session.run(None, {input_name: vec.reshape(1, FEATURES)})[0][0]
            exp = np.exp(logits - logits.max())
            probs = exp / exp.sum()
            idx = int(np.argmax(probs))
            confidence = probs[idx] * 100

            history.append(idx)
            counts = np.bincount(list(history), minlength=len(classes))
            pred_text = classes[int(np.argmax(counts))]
        else:
            history.clear()

        color = (0, 255, 0) if confidence > 80 else (0, 165, 255)
        cv2.putText(frame, f"{pred_text} ({confidence:.0f}%)",
                    (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.5, color, 3)
        cv2.imshow('WBSL Bridge - Live ISL Recognition', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    hands.close()
    cap.release()
    cv2.destroyAllWindows()

# ============ MENU ============
if __name__ == "__main__":
    print("=================================")
    print("  PHASE 2A - ALL IN ONE")
    print("=================================")
    print("  1 = Convert images to landmarks")
    print("  2 = Train MLP + export ONNX")
    print("  3 = Live webcam inference")
    print("  4 = Run ALL (1 -> 2 -> 3)")
    print("=================================")
    choice = input("Choose [1/2/3/4]: ").strip()

    if choice == "1":
        convert()
    elif choice == "2":
        train()
    elif choice == "3":
        live()
    elif choice == "4":
        convert()
        train()
        live()
    else:
        print("Invalid choice.")
        sys.exit(1)