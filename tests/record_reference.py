import sounddevice as sd
from scipy.io import wavfile

fs = 24000
seconds = 8
print("Recording 8 seconds... speak this sentence clearly NOW:")
print("আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি।")
audio = sd.rec(int(seconds * fs), samplerate=fs, channels=1, dtype="float32")
sd.wait()
wavfile.write("reference.wav", fs, audio)
print("Saved reference.wav")