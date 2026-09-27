import time
import os

TEXT = "নমস্কার, আমি সাবির। আজ আবহাওয়া খুব সুন্দর। আমি কলেজে যাচ্ছি।"

results = []

def finish(name, ok, ms=0, path="-", note=""):
    results.append((name, "OK" if ok else "FAIL", ms, path, note))

# ---------- 1. edge-tts (online reference) ----------
print("\n[1/4] Testing edge-tts (online)...")
try:
    import asyncio, edge_tts
    t0 = time.time()
    asyncio.run(edge_tts.Communicate(TEXT, "bn-BD-NabanitaNeural").save("tts_edge.mp3"))
    finish("edge-tts", True, (time.time() - t0) * 1000, "tts_edge.mp3")
    print("   OK -> tts_edge.mp3")
except Exception as e:
    finish("edge-tts", False, note=str(e)[:80])
    print("   FAILED:", e)

# ---------- 2. BanglaTTS (claimed offline) ----------
print("\n[2/4] Testing BanglaTTS...")
try:
    from banglatts import BanglaTTS
    t0 = time.time()
    tts = BanglaTTS()
    path = tts(TEXT, voice='female', filename='tts_banglatts.wav')
    finish("BanglaTTS", True, (time.time() - t0) * 1000, str(path))
    print("   OK ->", path)
except Exception as e:
    finish("BanglaTTS", False, note=str(e)[:80])
    print("   FAILED:", e)

# ---------- 3. Windows built-in voices (SAPI) ----------
print("\n[3/4] Testing Windows built-in voices (pyttsx3)...")
try:
    import pyttsx3
    eng = pyttsx3.init()
    voices = eng.getProperty('voices')
    print("   Installed voices:", [v.name for v in voices])
    bengali = [v for v in voices if 'beng' in (v.name + v.id).lower() or 'bn-' in v.id.lower()]
    if bengali:
        t0 = time.time()
        eng.save_to_file(TEXT, "tts_sapi.wav")
        eng.runAndWait()
        finish("SAPI", True, (time.time() - t0) * 1000, "tts_sapi.wav")
    else:
        finish("SAPI", False, note="No Bengali voice installed")
        print("   No Bengali voice found on Windows.")
except Exception as e:
    finish("SAPI", False, note=str(e)[:80])
    print("   FAILED:", e)

# ---------- 4. sherpa-onnx ----------
print("\n[4/4] Testing sherpa-onnx...")
try:
    import sherpa_onnx
    if os.path.exists(os.path.join("tts_models", "model.onnx")):
        finish("sherpa-onnx", False, note="Model present but script needs config")
    else:
        finish("sherpa-onnx", False, note="No Bengali ONNX model available")
        print("   Installed, but Piper/sherpa has NO official Bengali voice yet.")
except Exception as e:
    finish("sherpa-onnx", False, note=str(e)[:80])
    print("   FAILED:", e)

# ---------- Summary ----------
print("\n================= SUMMARY =================")
print(f"{'Engine':<12} {'Status':<6} {'Time(ms)':<10} Output")
print("-" * 60)
for name, st, ms, path, note in results:
    print(f"{name:<12} {st:<6} {ms:<10.0f} {path}  {note}")
print("============================================")
print("\nNow PLAY the generated files and compare quality.")