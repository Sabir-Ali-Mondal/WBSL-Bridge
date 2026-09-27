import time
from mutagen import File as AudioFile
from banglatts import BanglaTTS

TEXT = "নমস্কার, আমি সাবির।"

OUTPUT = "bengali_offline.wav"

print("Loading BanglaTTS (offline)...")
t0 = time.time()
tts = BanglaTTS()
load_ms = (time.time() - t0) * 1000

print("Generating speech...")
t0 = time.time()
path = tts(TEXT, voice='female', filename=OUTPUT)
gen_ms = (time.time() - t0) * 1000

audio = AudioFile(path)
total_ms = audio.info.length * 1000
chars = len(TEXT.replace(" ", ""))
words = len(TEXT.split())

print(f"Model load time: {load_ms:.0f} ms")
print(f"Generation time: {gen_ms:.0f} ms")
print(f"Total audio duration: {total_ms:.0f} ms")
print(f"Total characters: {chars}")
print(f"Total words: {words}")
if words > 0:
    print(f"Ms per word: {total_ms / words:.0f}")
if chars > 0:
    print(f"Ms per character: {total_ms / chars:.0f}")