from faster_whisper import WhisperModel
import sounddevice as sd
import tempfile
import wave
import os
import time

MODEL = "medium"

SAMPLE_RATE = 16000
SECONDS = 8

print("Loading faster-whisper medium on CPU INT8...")
load_start = time.time()

model = WhisperModel(
    MODEL,
    device="cpu",
    compute_type="int8"
)

print(f"Model loaded in {time.time() - load_start:.2f} seconds")

print("\nSpeak Bengali for 8 seconds...")

audio = sd.rec(
    int(SECONDS * SAMPLE_RATE),
    samplerate=SAMPLE_RATE,
    channels=1,
    dtype="int16"
)

sd.wait()

with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
    wav_path = f.name

with wave.open(wav_path, "wb") as wav:
    wav.setnchannels(1)
    wav.setsampwidth(2)
    wav.setframerate(SAMPLE_RATE)
    wav.writeframes(audio.tobytes())

print("Transcribing...")

transcribe_start = time.time()

segments, info = model.transcribe(
    wav_path,
    language="bn",
    task="transcribe",
    beam_size=5,
    vad_filter=True
)

text = " ".join(
    segment.text.strip()
    for segment in segments
).strip()

transcribe_time = time.time() - transcribe_start

print("\n========== RESULT ==========")
print("Model:", MODEL)
print("Device: CPU")
print("Compute type: int8")
print("Forced language: Bengali (bn)")
print("Whisper language:", info.language)
print("Confidence:", round(float(info.language_probability), 3))
print("Transcription time:", round(transcribe_time, 2), "seconds")
print("Text:", text)
print("============================")

os.remove(wav_path)