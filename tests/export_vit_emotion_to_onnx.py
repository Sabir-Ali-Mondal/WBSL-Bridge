import torch
from transformers import AutoModelForImageClassification, AutoImageProcessor
from pathlib import Path

MODEL_NAME = "trpakov/vit-face-expression"
ONNX_PATH = "vit_emotion.onnx"

print(f"Loading {MODEL_NAME}...")
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)

model.eval()

dummy_input = torch.randn(1, 3, 224, 224)

print(f"Exporting to {ONNX_PATH}...")
torch.onnx.export(
    model,
    dummy_input,
    ONNX_PATH,
    export_params=True,
    opset_version=18,
    do_constant_folding=True,
    input_names=["pixel_values"],
    output_names=["logits"],
    dynamic_axes={"pixel_values": {0: "batch_size"}, "logits": {0: "batch_size"}}
)

# Labels are in model.config, NOT processor
labels = model.config.id2label
Path("emotion_labels.txt").write_text("\n".join(f"{i}: {label}" for i, label in labels.items()))

print(f"✅ Exported successfully!")
print(f"Labels: {labels}")