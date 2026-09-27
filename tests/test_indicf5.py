import os
import time
import numpy as np
import soundfile as sf
from transformers import AutoModel

MODEL_ID = "ai4bharat/IndicF5"
REFERENCE_AUDIO = "reference.wav"
REFERENCE_TEXT = "আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি।"

BENGALI_TEXTS = [
    "নমস্কার, কেমন আছেন?",
    "আমি আজ কলেজে যাচ্ছি।",
    "আপনার নাম কী?",
]

if not os.path.exists(REFERENCE_AUDIO):
    print("ERROR: reference.wav not found. Run record_reference.py first.")
    raise SystemExit

print("Loading IndicF5 (first run downloads ~2 GB)...")
t0 = time.time()
model = AutoModel.from_pretrained(MODEL_ID, trust_remote_code=True)
print(f"Model loaded in {time.time()-t0:.0f} sec")

for i, text in enumerate(BENGALI_TEXTS, 1):
    print(f"\n[{i}/{len(BENGALI_TEXTS)}] {text}")
    t0 = time.time()
    try:
        out = model(text, ref_audio_path=REFERENCE_AUDIO, ref_text=REFERENCE_TEXT)
    except TypeError:
        out = model.infer(text, ref_audio_path=REFERENCE_AUDIO, ref_text=REFERENCE_TEXT)

    sr = 24000
    if isinstance(out, tuple):
        out, sr = out[0], out[1]
    audio = out
    if hasattr(audio, "detach"):
        audio = audio.detach().cpu().numpy()
    audio = np.squeeze(np.asarray(audio, dtype=np.float32))

    path = f"indicf5_test_{i:02d}.wav"
    sf.write(path, audio, sr)
    print(f"Generated in {time.time()-t0:.1f} sec -> {path}")

print("\nDone. Play the wav files and compare with edge-tts.")