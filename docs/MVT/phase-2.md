# MVT 2A: Static ISL Alphabet/Number Recognition (Two-Hand Landmark MLP)

## 1. Goal
Prove that a ready-made ISL image dataset can be converted into person-independent
landmark data, trained as a classifier, exported to ONNX, and run live on webcam.

## 2. Why Landmarks Instead of Raw Images
| Factor | Raw Image CNN | Landmark MLP |
|:---|:---|:---|
| Skin color / background / lighting | Model memorizes them | Removed |
| Hand size / camera distance | Domain gap | Normalized out |
| Matches production pipeline | No | Yes (both sides are landmarks) |
| Signer independence | Weak | Strong |

## 3. Feature Design (126-dim vector)
- Detect up to 2 hands (MediaPipe Hands, max_num_hands=2).
- Slot landmarks into Left (63) + Right (63) by handedness label.
- Normalization reference: RIGHT wrist (preferred) applied to BOTH hands.
  - Removes global position.
  - Preserves hand-to-hand relative position (critical for two-hand letters).
- Scale normalization: divide by reference hand size (wrist to middle-finger MCP).
- Missing hand: zero-padded.

## 4. Pipeline (Single Script: phase2a_all_in_one.py)
| Mode | Function | Output |
|:---|:---|:---|
| 1 = Convert | Images -> 126-dim landmarks | dataset_landmarks/*.npy |
| 2 = Train | MLP (126-256-128-35), 50 epochs | sign_mlp.onnx + sign_classes.json |
| 3 = Live | Webcam -> extract -> ONNX -> majority vote | On-screen prediction |
| 4 = All | Runs 1 -> 2 -> 3 | Full pipeline |

```python
import cv2, json, sys
import numpy as np
import mediapipe as mp
import onnxruntime as ort
import torch, torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from collections import deque
from pathlib import Path

DATA_DIR = Path("Indian Sign Language_Dataset/ISL/data")
OUT_DIR = Path("dataset_landmarks")
SAMPLES_PER_CLASS = 300
EPOCHS = 50
LR = 0.001
BATCH_SIZE = 128
FEATURES = 126

def extract_two_hands(res):
    if not res.multi_hand_landmarks:
        return None
    left = right = None
    for hlm, hness in zip(res.multi_hand_landmarks, res.multi_handedness):
        label = hness.classification[0].label
        pts = np.array([[p.x, p.y, p.z] for p in hlm.landmark], dtype=np.float32)
        if label == "Left" and left is None: left = pts
        elif label == "Right" and right is None: right = pts
    ref_hand = right if right is not None else left
    if ref_hand is None: return None
    ref = ref_hand[0]
    scale = np.linalg.norm(ref_hand[9] - ref_hand[0]) + 1e-6
    out_left = (left - ref) / scale if left is not None else np.zeros((21,3), np.float32)
    out_right = (right - ref) / scale if right is not None else np.zeros((21,3), np.float32)
    return np.concatenate([out_left.flatten(), out_right.flatten()])

def convert():
    OUT_DIR.mkdir(exist_ok=True)
    hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)
    for cls_dir in sorted(DATA_DIR.iterdir()):
        if not cls_dir.is_dir(): continue
        rows = []
        files = sorted(cls_dir.glob("*.jpg"))[:SAMPLES_PER_CLASS]
        for f in files:
            img = cv2.imread(str(f))
            vec = extract_two_hands(hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)))
            if vec is not None: rows.append(vec)
        np.save(OUT_DIR / f"{cls_dir.name}.npy", np.array(rows, dtype=np.float32))
        print(f"{cls_dir.name}: {len(rows)}/{len(files)} samples")
    hands.close()

def train():
    classes = sorted([p.stem for p in OUT_DIR.glob("*.npy")])
    c2i = {c: i for i, c in enumerate(classes)}
    X, y = [], []
    for c in classes:
        arr = np.load(OUT_DIR / f"{c}.npy")
        X.append(arr); y.extend([c2i[c]] * len(arr))
    X, y = np.concatenate(X), np.array(y)
    idx = np.random.default_rng(42).permutation(len(X))
    X, y = X[idx], y[idx]
    s = int(0.85 * len(X))
    tr = DataLoader(TensorDataset(torch.tensor(X[:s]), torch.tensor(y[:s])), BATCH_SIZE, shuffle=True)
    va = DataLoader(TensorDataset(torch.tensor(X[s:]), torch.tensor(y[s:])), BATCH_SIZE)
    model = nn.Sequential(
        nn.Linear(FEATURES,256), nn.ReLU(), nn.Dropout(0.3),
        nn.Linear(256,128), nn.ReLU(), nn.Dropout(0.3),
        nn.Linear(128,len(classes)))
    crit = nn.CrossEntropyLoss()
    opt = torch.optim.Adam(model.parameters(), lr=LR)
    acc = 0
    for e in range(EPOCHS):
        model.train()
        for xb, yb in tr:
            opt.zero_grad(); loss = crit(model(xb), yb); loss.backward(); opt.step()
        model.eval(); c = t = 0
        with torch.no_grad():
            for xb, yb in va:
                c += (model(xb).argmax(1)==yb).sum().item(); t += len(yb)
        acc = c/t*100
        if (e+1) % 10 == 0: print(f"Epoch {e+1} | Val Acc: {acc:.1f}%")
    model.eval()
    torch.onnx.export(model, torch.randn(1,FEATURES), "sign_mlp.onnx", opset_version=18,
        input_names=["landmarks"], output_names=["logits"],
        dynamic_axes={"landmarks":{0:"batch"},"logits":{0:"batch"}})
    json.dump(classes, open("sign_classes.json","w"))
    print(f"Final Val Acc: {acc:.1f}%")

def live():
    sess = ort.InferenceSession("sign_mlp.onnx", providers=["CPUExecutionProvider"])
    in_name = sess.get_inputs()[0].name
    classes = json.load(open("sign_classes.json"))
    hands = mp.solutions.hands.Hands(max_num_hands=2, min_detection_confidence=0.6)
    hist = deque(maxlen=10)
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: continue
        res = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        txt, conf = "NO HAND", 0.0
        vec = extract_two_hands(res)
        if vec is not None:
            for hlm in res.multi_hand_landmarks:
                mp.solutions.drawing_utils.draw_landmarks(frame, hlm, mp.solutions.hands.HAND_CONNECTIONS)
            logits = sess.run(None, {in_name: vec.reshape(1,FEATURES)})[0][0]
            p = np.exp(logits - logits.max()); p /= p.sum()
            conf = p.max()*100
            hist.append(int(np.argmax(p)))
            txt = classes[int(np.argmax(np.bincount(list(hist), minlength=len(classes))))]
        else:
            hist.clear()
        col = (0,255,0) if conf > 80 else (0,165,255)
        cv2.putText(frame, f"{txt} ({conf:.0f}%)", (10,40), cv2.FONT_HERSHEY_SIMPLEX, 1.5, col, 3)
        cv2.imshow('WBSL Bridge - Live ISL', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'): break
    hands.close(); cap.release(); cv2.destroyAllWindows()

if __name__ == "__main__":
    print("1=Convert 2=Train 3=Live 4=All")
    ch = input("Choose: ").strip()
    if ch == "1": convert()
    elif ch == "2": train()
    elif ch == "3": live()
    elif ch == "4": convert(); train(); live()
```

## 5. Results
- Two-hand conversion fixed the detection failures on two-hand letters
  (Q improved from 137/300 to near-full detection).
- Validation accuracy: 99.9 percent on the landmark subset.
- Live webcam recognizes most letters and numbers correctly with majority-vote smoothing.

## 6. Observed Limitations (Residual Confusions)

| Issue | Cause | Current Mitigation | Planned Fix |
|:---|:---|:---|:---|
| Mirror effect | Selfie view vs dataset handedness convention; asymmetric letters (J, R, Z) confuse | Process unflipped frames in all stages | Mirror augmentation |
| Hand position in frame | Raw coords depend on location | Wrist-centering (right wrist reference) | Solved; add translation jitter |
| Far / close (scale) | Hand pixel size changes with distance | Scale normalization by hand size | Scale jitter augmentation |
| Angle (in-plane tilt) | Hand tilt changes coordinates | None | Rotation augmentation |
| Angle (out-of-plane) | Side view distorts projection | Partial via MediaPipe z | Record multi-angle samples |
| Missed hand (occlusion / blur) | Detector fails, zero block appears | Zero-padding | Hand-dropout augmentation + presence flags |

## 7. Robustness Plan: Landmark-Space Augmentation
The key advantage of landmarks: augmentation is cheap and exact. Apply during training.

```python
def augment(vec):
    v = vec.copy()
    # 1. Mirror: swap hands + flip x
    if np.random.rand() < 0.5:
        L, R = v[:63].reshape(21,3), v[63:].reshape(21,3)
        L[:,0] *= -1; R[:,0] *= -1
        v = np.concatenate([R.flatten(), L.flatten()])
    # 2. Rotate (in-plane angle)
    if np.random.rand() < 0.5:
        th = np.random.uniform(-0.3, 0.3)
        c, s = np.cos(th), np.sin(th)
        pts = v.reshape(42,3)
        pts[:,:2] = pts[:,:2] @ np.array([[c,-s],[s,c]]).T
        v = pts.flatten()
    # 3. Jitter (distance / estimation noise)
    v = v + np.random.normal(0, 0.01, v.shape).astype(np.float32)
    # 4. Hand dropout (occlusion)
    if np.random.rand() < 0.1: v[:63] = 0
    if np.random.rand() < 0.1: v[63:] = 0
    return v
```

| Augmentation | Fixes |
|:---|:---|
| Mirror | Mirror effect, selfie vs dataset |
| Rotate | In-plane angle |
| Jitter | Far/close residual, estimation noise |
| Dropout | Occlusion, missed detection |

## 8. Consistency Rules (Must Hold in Every Stage)
1. Never flip the frame BEFORE MediaPipe processing.
2. Use the identical extract_two_hands() in convert and live.
3. Always use right-wrist-preferred reference and same scale normalization.
4. Keep handedness slotting identical (Left block first, Right block second).

## 9. Success Criteria Checklist
- [x] Two-hand landmark conversion (Q/P fixed)
- [x] 126-feature MLP trained, 99.9 percent validation
- [x] ONNX export and live inference working
- [x] Majority-vote temporal smoothing
- [x] Recognizes most letters/numbers live
- [ ] Mirror augmentation retraining
- [ ] Rotation / jitter / dropout augmentation
- [ ] Multi-angle self-recorded samples
- [ ] Presence flags and confidence gating

## 10. Role in Final System
Static MLP handles fingerspelling, names, and numbers.
Continuous LSTM (Phase 2B) handles dynamic signs and sentences.
Both share the same normalized landmark representation, so they can be fused later.
