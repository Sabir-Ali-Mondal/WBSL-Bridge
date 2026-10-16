import os
import tempfile
import subprocess

from elevenlabs.client import ElevenLabs

API_KEY = os.getenv("ElevenLabs_API_KEY")
VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"
MODEL_ID = "eleven_v3"

client = ElevenLabs(api_key=API_KEY)

tests = [
    ("Normal Bengali", "তোমার নাম কী?"),
    ("Angry", "তোমার নাম কী? [angry]"),
    ("Whispering", "তোমার নাম কী? [whispers]"),
    ("Excited", "তোমার নাম কী? [excited]"),
    ("Weak", "তোমার নাম কী? [weak]"),
    ("Laughing", "তোমার নাম কী? [laughs]"),
    ("Slow", "তোমার নাম কী? [slowly]"),
    ("Sighing", "তোমার নাম কী? [sighs]"),
]

for name, text in tests:
    filename = None

    try:
        print(f"\nTesting: {name}")
        print(f"Text: {text}")

        audio = client.text_to_speech.convert(
            text=text,
            voice_id=VOICE_ID,
            model_id=MODEL_ID,
            output_format="mp3_44100_128",
        )

        with tempfile.NamedTemporaryFile(
            suffix=".mp3", delete=False
        ) as temp:
            filename = temp.name
            for chunk in audio:
                temp.write(chunk)

        print("Playing audio...")
        subprocess.run(
            ["powershell", "-NoProfile", "-Command",
             "Add-Type -AssemblyName presentationCore; "
             "$p = New-Object System.Windows.Media.MediaPlayer; "
             f"$p.Open([uri]'{filename}'); "
             "$p.Play(); Start-Sleep -Seconds 5; $p.Stop(); $p.Close()"],
            check=True
        )

    except Exception as e:
        print(f"FAILED: {e}")

    finally:
        if filename and os.path.exists(filename):
            os.remove(filename)

print("\nAll tests completed.")
