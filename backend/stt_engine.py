"""
backend/stt_engine.py
Speech-to-text engine for WBSL Bridge.

Primary local engine : HIMA-ASR ONNX INT8 (CPU) with automatic Bengali/English
                       detection via the model's decision head. HIMA generates
                       native-script output directly (Bengali speech -> Bengali
                       script, English speech -> English script), so no
                       transliteration / script-conversion step is needed.
Optional cloud engine: ElevenLabs Scribe (unchanged, never auto-fallback).

Flow: audio -> 16 kHz mono WAV -> encoder (one pass) -> decision head
      (language) -> decoder (ONE transcript in detected language) ->
      boundary dedup -> response.

All public function signatures and return-field names are preserved, so every
existing WBSL caller (backend/main.py, frontend) works without modification.
"""
from dataclasses import dataclass
import json
import os
import re
import subprocess
import tempfile
from typing import Optional, Union
import unicodedata

from dotenv import load_dotenv
import numpy as np
import onnxruntime as ort

load_dotenv()

# ──────────────────────────────────────────────
# HIMA-ASR ONNX Runtime Implementation (Embedded)
# ──────────────────────────────────────────────
RATE, WINDOW, CHUNK = 16000, 50, 100
LANGUAGE_NAMES = {
    "as": "assamese", "bn": "bengali", "en": "english", "gu": "gujarati",
    "hi": "hindi", "kn": "kannada", "ml": "malayalam", "mr": "marathi",
    "or": "odia", "pa": "punjabi", "ta": "tamil", "te": "telugu"
}
_JOINERS = {"‌", "‍"}
_TAG = re.compile(r"<[^>]*>|\[[^\]]*\]")
_CHILLU_OF = {"ണ": "ൺ", "ന": "ൻ", "ര": "ർ", "ല": "ൽ", "ള": "ൾ", "ക": "ൿ"}
_CHILLU = re.compile("(?<!്)([ണനരലളക])്‍?(?![ഀ-ൿ])")


def clean_text(text):
    text = unicodedata.normalize("NFC", text or "")
    text = _CHILLU.sub(lambda m: _CHILLU_OF[m.group(1)], text)
    text = _TAG.sub(" ", text)
    out = []
    for i, ch in enumerate(text):
        kind = unicodedata.category(ch)[0]
        if ch in _JOINERS:
            out.append(ch)
        elif ch in "'’" and 0 < i < len(text) - 1 and text[i - 1].isalpha() and text[i + 1].isalpha():
            out.append("'")
        elif kind in "LMN":
            out.append(ch)
        else:
            out.append(" ")
    return " ".join("".join(out).lower().split())


def _loop_length(p):
    for size in range(1, 9):
        times = 6 if size == 1 else 4
        if len(p) >= size * times and p[-size * times:] == p[-size:] * times:
            return size
    for size in range(9, 81):
        if len(p) >= size * 3 and p[-size * 3:] == p[-size:] * 3:
            return size
    return 0


def _cut_loop(p):
    size = _loop_length(p)
    if size == 0:
        return p
    unit = p[-size:]
    while len(p) >= 2 * size and p[-2 * size:] == unit * 2:
        p = p[:-size]
    return p


def _log_mel(x, filters):
    """x: float32 mono 16 kHz. Returns (mel [128, T] padded to a multiple of 100, n_valid mel frames)."""
    if len(x) < 8000:
        x = np.pad(x, (0, 8000 - len(x)))
    n_fft, hop = 400, 160
    xp = np.pad(x, (n_fft // 2, n_fft // 2), mode="reflect")
    n_frames = 1 + (len(xp) - n_fft) // hop
    idx = np.arange(n_fft)[None, :] + hop * np.arange(n_frames)[:, None]
    win = (0.5 - 0.5 * np.cos(2 * np.pi * np.arange(n_fft) / n_fft)).astype(np.float32)
    spec = np.fft.rfft(xp[idx] * win, axis=1)
    mag = (spec.real ** 2 + spec.imag ** 2).astype(np.float32)[:-1].T
    log = np.log10(np.maximum(filters.T @ mag, 1e-10))
    log = np.maximum(log, log.max() - 8.0)
    log = ((log + 4.0) / 4.0).astype(np.float32)
    n_valid = log.shape[1]
    pad = (-n_valid) % CHUNK
    return np.pad(log, ((0, 0), (0, pad))), n_valid


def _post(n):
    for _ in range(3):
        n = (n - 1) // 2 + 1 if n > 0 else 0
    return n


def _find(path, name):
    """Look for a shared file in the variant folder, then its parents."""
    d = os.path.abspath(path)
    for _ in range(3):
        if os.path.exists(os.path.join(d, name)):
            return d
        d = os.path.dirname(d)
    raise FileNotFoundError(f"{name} not found near {path}")


FILES = {
    "fp32": ("encoder_model.onnx", "decoder_model.onnx"),
    "int8": ("encoder_model_int8.onnx", "decoder_model_int8.onnx"),
    "q4": ("encoder_model_q4.onnx", "decoder_model_int8.onnx")
}


def _local(path, precision):
    """A local folder is used as is; anything else is a Hub repo id."""
    if os.path.isdir(path):
        return path
    from huggingface_hub import snapshot_download, constants
    enc, dec = FILES[precision]
    want = ["*.py", "*.npy", "*.json", "decide/*"] + [f"onnx/{f}*" for f in (enc, dec)]
    local = os.path.join(constants.HF_HOME, "local", path.replace("/", "--"))
    return snapshot_download(path, allow_patterns=want, local_dir=local)


class HimaONNX:
    def __init__(self, path=".", precision="int8", threads=None):
        from tokenizers import Tokenizer
        if precision not in FILES:
            raise ValueError(f"precision must be one of {list(FILES)}")
        path = _local(path, precision)
        self.root, self._head = path, None
        encoder, decoder = (os.path.join("onnx", f) for f in FILES[precision])
        so = ort.SessionOptions()
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        if threads:
            so.intra_op_num_threads = threads
        self.enc = ort.InferenceSession(os.path.join(path, encoder), so, providers=["CPUExecutionProvider"])
        self.dec = ort.InferenceSession(os.path.join(path, decoder), so, providers=["CPUExecutionProvider"])
        shared = _find(path, "embed.npy")
        self.embed = np.load(os.path.join(shared, "embed.npy")).astype(np.float32)
        self.keep = np.array(json.load(open(os.path.join(shared, "keep_ids.json"))))
        self.row = {int(t): i for i, t in enumerate(self.keep)}
        self.sot = np.load(os.path.join(shared, "start_of_text.npy")).astype(np.float32)
        assets = _find(path, "tokenizer.json")
        self.filters = np.load(os.path.join(_find(path, "mel_filters.npy"), "mel_filters.npy"))
        self.tok = Tokenizer.from_file(os.path.join(assets, "tokenizer.json"))
        self.bos, self.eos = 2, 1

    @staticmethod
    def read_audio(a, sampling_rate=None):
        if isinstance(a, str):
            import soundfile as sf
            x, sr = sf.read(a, dtype="float32", always_2d=True)
            x = x.mean(1)
        else:
            x, sr = np.asarray(a, dtype=np.float32), (sampling_rate or RATE)
        if sr != RATE:
            import librosa
            x = librosa.resample(x, orig_sr=sr, target_sr=RATE)
        return np.ascontiguousarray(x, dtype=np.float32)

    def _listen(self, audio, sampling_rate=None):
        """sound [n, 640] for writer, and encoder layers [25, n, 1024] for decision head."""
        x = self.read_audio(audio, sampling_rate)
        mel, n_valid = _log_mel(x, self.filters)
        n = sum(_post(min(CHUNK, n_valid - i * CHUNK)) for i in range(mel.shape[1] // CHUNK))
        sound, layers = self.enc.run(None, {"mel": mel[None], "n_frames": np.array(n, dtype=np.int64)})
        return sound[:n], layers[:, :n]

    def listen(self, audio, sampling_rate=None):
        return self._listen(audio, sampling_rate)[0]

    def _step(self, x, pos, pk, pv):
        return self.dec.run(None, {"x": x, "pos0": np.array(pos, dtype=np.int64), "past_k": pk, "past_v": pv})

    def _write(self, sound, language=None, style="native", max_pieces=512):
        """Greedy transcript. Also returns the writer's states over the sound frames."""
        parts = [self.embed[[self.row[self.bos]]], sound, self.sot[None]]
        if language is not None:
            ids = self.tok.encode("<%s %s>" % (LANGUAGE_NAMES[language], style), add_special_tokens=False).ids
            parts.append(self.embed[[self.row[i] for i in ids]])
        x = np.concatenate(parts).astype(np.float32)
        pk = np.zeros((18, 1, 0, 256), np.float32)
        pv = pk
        pos, out, states = 0, [], None
        limit = min(max_pieces, int(1.5 * sound.shape[0]) + 8)
        for _ in range(limit + 1):
            logits, pk, pv, hidden = self._step(x, pos, pk, pv)
            if states is None:
                states = hidden[:, 1:sound.shape[0] + 2]
            pos += x.shape[0]
            j = int(np.argmax(logits))
            tok = int(self.keep[j])
            if tok == self.eos:
                break
            out.append(tok)
            if len(out) >= limit:
                break
            if _loop_length(out) > 0:
                out = _cut_loop(out)
                break
            x = self.embed[[j]]
        return clean_text(self.tok.decode(out, skip_special_tokens=False)), states

    def transcribe(self, audio, language=None, style="native", sampling_rate=None, max_pieces=512):
        return self._write(self.listen(audio, sampling_rate), language, style, max_pieces)[0]

    def _text_hidden(self, ids):
        x = self.embed[[self.row[self.bos]] + [self.row[i] for i in ids]].astype(np.float32)
        pk = np.zeros((18, 1, 0, 256), np.float32)
        return self._step(x, 0, pk, pk)[3][:, 1:]

    @property
    def head(self):
        if self._head is None:
            import importlib.util
            d = os.path.join(self.root, "decide")
            spec = importlib.util.spec_from_file_location("hima_head_np", os.path.join(d, "head_np.py"))
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            self._head = mod.Head(d, mod.LiveText(self.tok, clean_text, self.keep), self._text_hidden)
        return self._head

    @property
    def questions(self):
        return self.head.questions

    def run(self, audio, questions=None, language=None, style="native", sampling_rate=None):
        sound, layers = self._listen(audio, sampling_rate)
        text, states = self._write(sound, language, style)
        return {"text": text, "decisions": self.head.decide(self.head.sound(layers, states), questions)}

    def decide(self, audio, questions=None, sampling_rate=None):
        sound, layers = self._listen(audio, sampling_rate)
        x = np.concatenate([self.embed[[self.row[self.bos]]], sound, self.sot[None]]).astype(np.float32)
        pk = np.zeros((18, 1, 0, 256), np.float32)
        states = self._step(x, 0, pk, pk)[3][:, 1:]
        return self.head.decide(self.head.sound(layers, states), questions)

    ask = decide


# ──────────────────────────────────────────────
# Silero VAD (Neural Speech Segmentation)
# ──────────────────────────────────────────────
def get_vad_speech_chunks(
    audio: np.ndarray,
    vad_config: "VadConfig",
) -> list[np.ndarray]:
    """
    Use Silero VAD to extract only valid human speech chunks.
    Filters out background noise, computer fan humming, breaths, and silence.
    Returns a list of speech audio segments (or empty list if no speech found).
    """
    if len(audio) < 1600:
        return []

    try:
        from faster_whisper.vad import get_speech_timestamps, collect_chunks, VadOptions

        opts = VadOptions(
            threshold=float(vad_config.threshold),
            min_speech_duration_ms=int(vad_config.min_speech_duration_ms),
            max_speech_duration_s=float(vad_config.max_speech_duration_s),
            min_silence_duration_ms=int(vad_config.min_silence_duration_ms),
            speech_pad_ms=int(vad_config.speech_pad_ms),
        )
        timestamps = get_speech_timestamps(audio, vad_options=opts, sampling_rate=SAMPLE_RATE)
        if not timestamps:
            return []

        chunks, _ = collect_chunks(audio, timestamps, sampling_rate=SAMPLE_RATE)
        return [c for c in chunks if len(c) > 0]
    except Exception as exc:
        print(f"[WBSL Backend] Silero VAD segmentation fallback: {exc}")
        # Safe fallback: energy gate
        rms = float(np.sqrt(np.mean(audio ** 2)))
        return [audio] if rms > 0.008 else []


# ──────────────────────────────────────────────
# Module-level singleton (model loaded once, reused)
# ──────────────────────────────────────────────
_hima_model = None

SAMPLE_RATE = 16000


@dataclass
class VadConfig:
    """Configurable parameters kept for backward compatibility.

    HIMA does not use Silero VAD; these values are accepted from callers
    (frontend sliders, /api/stt form fields) and echoed back in responses
    so nothing upstream breaks.
    """
    threshold: float = 0.5
    min_silence_duration_ms: int = 500
    speech_pad_ms: int = 400
    max_speech_duration_s: float = 15.0
    min_speech_duration_ms: int = 250


# UI vocabulary -> ISO-639-1 language codes.
LANG_MAP = {
    "english": "en",
    "en": "en",
    "eng": "en",
    "bangla": "bn",
    "bengali": "bn",
    "bn": "bn",
    "auto": None,
    "": None,
}


def resolve_language(raw: str | None) -> str | None:
    """Resolve supported language choices; unknown values use auto-detection."""
    selected = (raw or "").strip().lower()
    return LANG_MAP.get(selected)


# ──────────────────────────────────────────────
# HIMA model loader (singleton)
# ──────────────────────────────────────────────
def _get_hima_model():
    """Lazily load HIMA-ASR ONNX INT8 once on CPU."""
    global _hima_model
    if _hima_model is None:
        from huggingface_hub import constants

        local_dir = os.path.join(
            constants.HF_HOME, "local", "Prahaladha--hima-asr-ONNX"
        )
        if not os.path.isdir(local_dir):
            raise FileNotFoundError(
                f"HIMA-ASR model not found at {local_dir}. "
                "Run the one-time download first."
            )
        print("[WBSL Backend] Initializing HIMA-ASR ONNX INT8 (CPU)...")
        _hima_model = HimaONNX(local_dir, precision="int8")
        print("[WBSL Backend] HIMA-ASR model ready.")
    return _hima_model


# ──────────────────────────────────────────────
# Audio format helper
# ──────────────────────────────────────────────
def _ensure_wav_16k(path: str) -> str:
    """
    Ensure the audio file is 16 kHz mono WAV (HIMA's expected input).
    Converts browser-recorded WebM, MP3, OGG, etc.
    Returns the path to a usable WAV file (may be a new temp file that the
    caller must delete).
    """
    import soundfile as sf

    # Fast path: already correct format
    try:
        info = sf.info(path)
        if info.samplerate == SAMPLE_RATE and info.channels == 1:
            return path
    except Exception:
        pass

    tmp_wav = path + "_converted_16k.wav"

    # Preferred: ffmpeg (handles WebM/Opus from MediaRecorder)
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", path,
                "-ar", str(SAMPLE_RATE),
                "-ac", "1",
                "-f", "wav",
                tmp_wav,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
        return tmp_wav
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # Fallback: librosa (pure-python decode via audioread/soundfile)
    try:
        import librosa
        import soundfile as sf_write

        audio, _sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)
        sf_write.write(tmp_wav, audio, SAMPLE_RATE, subtype="PCM_16")
        return tmp_wav
    except Exception:
        pass

    # Last resort: hand the original path to HIMA's own read_audio()
    return path


# ──────────────────────────────────────────────
# Language detection + single-pass transcription
# ──────────────────────────────────────────────
def _detect_language_and_transcribe(model, wav_path: str) -> tuple:
    """
    1. Run the audio encoder ONCE (shared by decision head and decoder).
    2. Query the decision head for the spoken language.
    3. Transcribe ONCE in the detected language with native-script output.

    Returns (text, detected_lang, lang_scores_dict).
    """
    sound, layers = model._listen(wav_path)

    # Build decoder prefix and grab the hidden states over the sound frames
    x = np.concatenate(
        [model.embed[[model.row[model.bos]]], sound, model.sot[None]]
    ).astype(np.float32)
    pk = np.zeros((18, 1, 0, 256), np.float32)
    states = model._step(x, 0, pk, pk)[3][:, 1:]

    dec_result = model.head.decide(
        model.head.sound(layers, states), questions=["language"]
    )
    lang_scores = dec_result.get("language", {})
    prob_bn = float(lang_scores.get("bn", 0.0))
    prob_en = float(lang_scores.get("en", 0.0))

    detected_lang = "bn" if prob_bn >= prob_en else "en"

    # ONE transcript, in the detected language, native script
    text, _ = model._write(sound, language=detected_lang, style="native")

    return text, detected_lang, {"bn": prob_bn, "en": prob_en}


# ──────────────────────────────────────────────
# Boundary deduplication (preserved)
# ──────────────────────────────────────────────
def deduplicate_boundary_words(previous_text: str, current_text: str) -> str:
    """
    Remove duplicate words/phrases at the boundary between two adjacent
    speech segments. Prevents words from being doubled when the frontend's
    rolling slices overlap slightly.
    """
    prev_words = previous_text.strip().split()
    curr_words = current_text.strip().split()

    if not prev_words or not curr_words:
        return current_text.strip()

    max_overlap = min(len(prev_words), len(curr_words), 5)
    for k in range(max_overlap, 0, -1):
        if prev_words[-k:] == curr_words[:k]:
            return " ".join(curr_words[k:]).strip()

    return current_text.strip()


# ──────────────────────────────────────────────
# ElevenLabs helpers (optional cloud engine)
# ──────────────────────────────────────────────
def get_elevenlabs_api_key() -> Optional[str]:
    """Retrieve ElevenLabs API key from environment variables."""
    return os.getenv("ELEVENLABS_API_KEY") or os.getenv("ElevenLabs_API_KEY")


def is_elevenlabs_configured() -> bool:
    """Check if ElevenLabs credentials are configured on backend."""
    key = get_elevenlabs_api_key()
    return bool(key and key.strip())


def get_audio_duration_seconds(path: str) -> float:
    """Return the duration in seconds of an audio file."""
    try:
        import soundfile as sf
        info = sf.info(path)
        return info.duration
    except Exception:
        pass
    try:
        import wave
        with wave.open(path, "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            if rate > 0:
                return frames / float(rate)
    except Exception:
        pass
    try:
        size = os.path.getsize(path)
        # Standard 16kHz 16-bit mono WAV: 32000 bytes/sec + 44-byte header
        return max(0.0, (size - 44) / 32000.0)
    except Exception:
        return 1.0


def transcribe_elevenlabs(
    path: str,
    language: str | None = None,
) -> dict:
    """
    Transcribe audio using ElevenLabs Scribe v1 API.
    Raises descriptive exceptions on error or missing credentials.
    CRITICAL: never automatically falls back to local or other providers.
    """
    api_key = get_elevenlabs_api_key()
    if not api_key:
        raise ValueError(
            "ElevenLabs API key is missing. Add ELEVENLABS_API_KEY to your .env file."
        )

    whisper_lang = resolve_language(language)
    lang_code = whisper_lang if whisper_lang in ("bn", "en") else None

    duration = get_audio_duration_seconds(path)
    if duration < 0.6:
        print(
            f"[STT ElevenLabs] Audio duration ({duration:.2f}s) < 0.6s; returning empty."
        )
        return {
            "text": "",
            "language": whisper_lang or "auto",
            "language_probability": 1.0,
            "selected_mode": whisper_lang or "auto",
            "engine": "elevenlabs",
        }

    from elevenlabs.client import ElevenLabs

    client = ElevenLabs(api_key=api_key)
    print(
        f"[STT ElevenLabs] Transcribing {path} (lang={lang_code}, duration={duration:.2f}s)..."
    )

    try:
        with open(path, "rb") as audio_file:
            res = client.speech_to_text.convert(
                file=audio_file,
                model_id="scribe_v1",
                language_code=lang_code,
            )
    except Exception as exc:
        err_str = str(exc).lower()
        if "audio_too_short" in err_str:
            print("[STT ElevenLabs] audio_too_short caught; returning empty.")
            return {
                "text": "",
                "language": whisper_lang or "auto",
                "language_probability": 1.0,
                "selected_mode": whisper_lang or "auto",
                "engine": "elevenlabs",
            }
        raise

    raw_text = (getattr(res, "text", "") or "").strip()
    detected_lang = getattr(res, "language_code", None) or whisper_lang or "auto"

    return {
        "text": raw_text,
        "language": detected_lang,
        "language_probability": 1.0,
        "selected_mode": whisper_lang or "auto",
        "engine": "elevenlabs",
    }


# ──────────────────────────────────────────────
# Local transcription — HIMA-ASR
# ──────────────────────────────────────────────
def transcribe_local_hima(
    path: str,
    language: str | None = None,
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Transcribe audio locally using HIMA-ASR ONNX INT8 with Silero VAD segmentation.

    - Silero VAD extracts only speech regions, cutting out leading/trailing
      silence, breath noises, clicks, and fan hums before feeding audio to HIMA.
    - If no speech is present, returns an empty transcript without invoking HIMA.
    - Transcribes only the segmented speech chunks and merges them cleanly.
    """
    whisper_lang = resolve_language(language)

    if isinstance(vad_config, dict):
        cfg = VadConfig(
            threshold=float(vad_config.get("threshold", 0.5)),
            min_silence_duration_ms=int(vad_config.get("min_silence_duration_ms", 500)),
            speech_pad_ms=int(vad_config.get("speech_pad_ms", 400)),
            max_speech_duration_s=float(vad_config.get("max_speech_duration_s", 15.0)),
            min_speech_duration_ms=int(vad_config.get("min_speech_duration_ms", 250)),
        )
    elif isinstance(vad_config, VadConfig):
        cfg = vad_config
    else:
        cfg = VadConfig()

    converted_path = _ensure_wav_16k(path)
    try:
        raw_samples = HimaONNX.read_audio(converted_path)

        if vad_mode == "silero_vad":
            speech_chunks = get_vad_speech_chunks(raw_samples, cfg)
            if not speech_chunks:
                return {
                    "text": "",
                    "language": whisper_lang or "bn",
                    "language_probability": 0.0,
                    "selected_mode": whisper_lang or "auto",
                    "engine": "local",
                    "vad_mode": vad_mode,
                    "is_final": is_final,
                }
        else:
            speech_chunks = [raw_samples]

        model = _get_hima_model()
        transcripts = []
        detected_lang = whisper_lang or "bn"
        top_prob = 0.0

        for chunk in speech_chunks:
            if len(chunk) < 1600:
                continue
            if whisper_lang is not None:
                sound = model.listen(chunk)
                t, _ = model._write(sound, language=whisper_lang, style="native")
                chunk_lang = whisper_lang
                prob = 1.0
            else:
                t, chunk_lang, lang_scores = _detect_language_and_transcribe(model, chunk)
                prob = lang_scores.get(chunk_lang, 0.0)

            t_clean = t.strip() if t else ""
            if t_clean:
                transcripts.append(t_clean)
                detected_lang = chunk_lang
                top_prob = max(top_prob, float(prob))

        text = " ".join(transcripts).strip()
    finally:
        if converted_path != path and os.path.exists(converted_path):
            try:
                os.remove(converted_path)
            except OSError:
                pass

    final_text = text.strip() if text else ""

    if previous_context:
        final_text = deduplicate_boundary_words(previous_context, final_text)

    return {
        "text": final_text,
        "language": detected_lang,
        "language_probability": round(float(top_prob), 4),
        "selected_mode": whisper_lang or "auto",
        "engine": "local",
        "vad_mode": vad_mode,
        "is_final": is_final,
    }


# Backward-compatible alias (old name kept so any direct import still works)
transcribe_local_whisper = transcribe_local_hima


# ──────────────────────────────────────────────
# Public entry points (signatures unchanged)
# ──────────────────────────────────────────────
def transcribe_file(
    path: str,
    language: str | None = None,
    engine: str = "local",
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Transcribe an audio file with independent mode selection.
    Existing callers using transcribe_file(path, language) remain 100% compatible.
    """
    clean_engine = (engine or "local").strip().lower()

    if clean_engine == "elevenlabs":
        return transcribe_elevenlabs(path, language)
    elif clean_engine == "local":
        return transcribe_local_hima(
            path,
            language=language,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )
    else:
        raise ValueError(
            f"Unsupported STT engine: {engine!r}. Must be 'local' or 'elevenlabs'."
        )


def transcribe_bytes(
    data: bytes,
    filename: str = "rec.webm",
    language: str | None = None,
    engine: str = "local",
    vad_mode: str = "silero_vad",
    vad_config: Optional[Union[dict, VadConfig]] = None,
    is_final: bool = False,
    previous_context: str = "",
) -> dict:
    """
    Write audio bytes to a temporary file, transcribe using the requested
    engine, and clean up. Maintains complete backwards compatibility with
    backend/main.py's /api/stt endpoint.
    """
    suffix = os.path.splitext(filename or "rec.webm")[1] or ".webm"
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp:
            temp.write(data)
            temp_path = temp.name

        return transcribe_file(
            temp_path,
            language=language,
            engine=engine,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass
