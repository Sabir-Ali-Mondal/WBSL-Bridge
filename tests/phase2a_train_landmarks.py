import json
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
from pathlib import Path

OUT_DIR = Path("dataset_landmarks")
EPOCHS = 50
LR = 0.001
BATCH_SIZE = 128

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
    nn.Linear(63, 256), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(128, len(classes))
)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)

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
dummy = torch.randn(1, 63)
torch.onnx.export(model, dummy, "sign_mlp.onnx", opset_version=18,
                  input_names=["landmarks"], output_names=["logits"],
                  dynamic_axes={"landmarks": {0: "batch"}, "logits": {0: "batch"}})
json.dump(classes, open("sign_classes.json", "w"))
print(f"Final Val Acc: {acc:.1f}%")
print("Exported sign_mlp.onnx and sign_classes.json")