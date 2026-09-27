"""
backend/main.py
Complete FastAPI backend for WBSL Bridge.
Loads sign_mlp.onnx, serves predictions, NMM, TTS, NLG, reference media,
and REAL community ingestion (uploaded video -> landmarks -> .npy + manifest).

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8000
"""

import json
import re
import time
import uuid
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

# Local imports
from backend.extract import process_bgr_frame
from backend.nmm import detect_nmm, reset_nmm_state
from backend.llm_engine import (
    generate_bengali,
    generate_bengali_with_uncertainty,
    is_llm_available,
    get_ai_config,
    stream_bengali,
)

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "sign_mlp.onnx"
CLASSES_PATH = ROOT / "models" / "sign_classes.json"
TTS_DIR = ROOT / "backend" / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

GLOSS_MAP_PATH = ROOT / "backend" / "data" / "gloss_map.json"
if GLOSS_MAP_PATH.exists():
    with open(GLOSS_MAP_PATH, "r", encoding="utf-8") as f:
        WORD_MAP = json.load(f)
else:
    WORD_MAP = {}

# ─────────────────────────────────────────────
# REFERENCE MEDIA STORAGE (videos / images per sign)
# ─────────────────────────────────────────────
MEDIA_DIR = ROOT / "backend" / "media"
MEDIA_DIR.mkdir(exist_ok=True)
SIGN_MEDIA_PATH = ROOT / "backend" / "data" / "sign_media.json"
if SIGN_MEDIA_PATH.exists():
    with open(SIGN_MEDIA_PATH, "r", encoding="utf-8") as f:
        SIGN_MEDIA = json.load(f)
else:
    SIGN_MEDIA = {}


# ─────────────────────────────────────────────
# COMMUNITY DATASET STORAGE (manifest + npy)
# ─────────────────────────────────────────────
DATASET_DIR = ROOT / "dataset"
SAMPLES_DIR = DATASET_DIR / "samples"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST_PATH = DATASET_DIR / "manifest.jsonl"


def _load_manifest():
    items = []
    if MANIFEST_PATH.exists():
        for line in MANIFEST_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    items.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    return items


def _write_manifest(items):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        for r in items:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


def _persist_sign_media():
    with open(SIGN_MEDIA_PATH, "w", encoding="utf-8") as f:
        json.dump(SIGN_MEDIA, f, ensure_ascii=False, indent=2)

# ─────────────────────────────────────────────
# LOAD MODEL ONCE AT STARTUP
# ─────────────────────────────────────────────
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
if not CLASSES_PATH.exists():
    raise FileNotFoundError(f"Classes not found: {CLASSES_PATH}")

session = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
INPUT_NAME = session.get_inputs()[0].name
CLASSES = json.loads(CLASSES_PATH.read_text(encoding="utf-8"))

print(f"[WBSL Backend] Model loaded: {MODEL_PATH.name}")
print(f"[WBSL Backend] Classes: {len(CLASSES)}")
print(f"[WBSL Backend] Input: {INPUT_NAME}, shape: {session.get_inputs()[0].shape}")

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────
app = FastAPI(title="WBSL Bridge Backend", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# IN-MEMORY STATE
# ─────────────────────────────────────────────
sign_catalog = [
    {
        "id": str(i),
        "label": c,
        "bengali_meaning": "",
        "category": "ISL Alphabet",
        "type": "word",
        "approved_samples": 300,
        "pending_samples": 0,
        "rejected_samples": 0,
        "reference_video_url": None,
        "language": "ISL",
    }
    for i, c in enumerate(CLASSES)
]

_bengali_map = {
    "A": "এ", "B": "বি", "C": "সি", "D": "ডি", "E": "ই",
    "F": "এফ", "G": "জি", "H": "এইচ", "I": "আই", "J": "জে",
    "K": "কে", "L": "এল", "M": "এম", "N": "এন", "O": "ও",
    "P": "পি", "Q": "কিউ", "R": "আর", "S": "এস", "T": "টি",
    "U": "ইউ", "V": "ভি", "W": "ডব্লু", "X": "এক্স", "Y": "ওয়াই", "Z": "জেড",
    "1": "এক", "2": "দুই", "3": "তিন", "4": "চার", "5": "পাঁচ",
    "6": "ছয়", "7": "সাত", "8": "আট", "9": "নয়", "0": "শূন্য",
}
for s in sign_catalog:
    if s["label"] in _bengali_map:
        s["bengali_meaning"] = _bengali_map[s["label"]]

# Attach any stored reference media to the catalog
for s in sign_catalog:
    m = SIGN_MEDIA.get(s["label"])
    s["reference_media"] = m
    if m and m["type"] == "video":
        s["reference_video_url"] = m["url"]

# ─────────────────────────────────────────────
# SYSTEM HEALTH
# ─────────────────────────────────────────────
@app.get("/api/system/health")
def health():
    ai = get_ai_config()
    return {
        "api": True,
        "model": True,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": "MLP-static",
    }


# ─────────────────────────────────────────────
# DATASET / SIGNS
# ─────────────────────────────────────────────
@app.get("/api/dataset/signs")
def get_signs(
    page: int = 1,
    limit: int = 20,
    search: str = "",
    category: str = "",
    language: str = "",
):
    filtered = sign_catalog
    if search:
        q = search.lower()
        filtered = [
            s for s in filtered
            if q in s["label"].lower() or q in s["bengali_meaning"]
        ]
    if category:
        filtered = [s for s in filtered if s["category"].lower() == category.lower()]
    if language:
        filtered = [s for s in filtered if s["language"] == language]

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    return {
        "items": filtered[start:end],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@app.get("/api/dataset/signs/{sign_id}")
def get_sign_by_id(sign_id: str):
    for s in sign_catalog:
        if s["id"] == sign_id:
            return s
    raise HTTPException(status_code=404, detail="Sign not found")


@app.get("/api/dataset/stats")
def dataset_stats():
    total_signs = len(sign_catalog)
    total_approved = sum(s["approved_samples"] for s in sign_catalog)
    total_pending = sum(s["pending_samples"] for s in sign_catalog)
    total_rejected = sum(s["rejected_samples"] for s in sign_catalog)
    languages = list(set(s["language"] for s in sign_catalog))
    categories = list(set(s["category"] for s in sign_catalog))
    return {
        "total_signs": total_signs,
        "total_approved_samples": total_approved,
        "total_pending_samples": total_pending,
        "total_rejected_samples": total_rejected,
        "languages": languages,
        "categories": categories,
        "dataset_version": "v0.1",
        "model_version": "MLP-static",
    }


# ─────────────────────────────────────────────
# PREDICTION: frame → landmark → MLP + NMM
# ─────────────────────────────────────────────
class PredictResponse(BaseModel):
    detected: bool
    label: str
    confidence: float
    top5: list
    hands_detected: int
    nmm: dict


@app.post("/api/predict/frame", response_model=PredictResponse)
async def predict_frame(file: UploadFile = File(...)):
    try:
        raw = await file.read()
        nparr = np.frombuffer(raw, np.uint8)
        frame_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame_bgr is None:
            raise HTTPException(status_code=400, detail="Could not decode image")

        vec = process_bgr_frame(frame_bgr)
        nmm_flags = detect_nmm(frame_bgr)

        if vec is None:
            return PredictResponse(
                detected=False,
                label="NO_HAND",
                confidence=0.0,
                top5=[],
                hands_detected=0,
                nmm=nmm_flags,
            )

        logits = session.run(None, {INPUT_NAME: vec.reshape(1, 126)})[0][0]
        probs = np.exp(logits - logits.max())
        probs = probs / probs.sum()

        top_idx = np.argsort(probs)[::-1][:5]
        top5 = [
            {"label": CLASSES[i], "confidence": float(probs[i])}
            for i in top_idx
        ]

        best = int(top_idx[0])
        return PredictResponse(
            detected=True,
            label=CLASSES[best],
            confidence=float(probs[best]),
            top5=top5,
            hands_detected=1,
            nmm=nmm_flags,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str


class NLGSequenceRequest(BaseModel):
    sequence: list[dict]


@app.get("/api/nlg/status")
def nlg_status():
    ai = get_ai_config()
    return {
        "llm_available": is_llm_available(),
        "engine": ai["model"],
        "endpoint": ai["base_url"],
        "inference_mode": ai["provider"],
        "stream": ai["stream"],
        "reasoning": ai["reasoning"],
    }


@app.post("/api/nlg/generate")
def nlg_generate(payload: NLGRequest):
    result = generate_bengali(payload.gloss)
    return result


@app.post("/api/nlg/stream")
def nlg_stream(payload: NLGRequest):
    """Server-Sent Events stream of the Bengali translation as it is written."""
    ai = get_ai_config()

    def event_source():
        for event in stream_bengali(payload.gloss):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_source(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "X-Engine": ai["model"],
        },
    )


@app.post("/api/nlg/generate-sequence")
def nlg_generate_sequence(payload: NLGSequenceRequest):
    result = generate_bengali_with_uncertainty(payload.sequence)
    return result


# ─────────────────────────────────────────────
# TEXT TO SIGN (simple mapping for demo)
# ─────────────────────────────────────────────
class TextToSignRequest(BaseModel):
    text: str


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    words = payload.text.lower().replace("।", "").replace("?", "").split()
    gloss_sequence = []
    for w in words:
        if w in WORD_MAP:
            gloss_sequence.append(WORD_MAP[w])
        elif w.upper() in CLASSES:
            gloss_sequence.append(w.upper())
        else:
            gloss_sequence.append(f"[{w}]")
    media = []
    for g in gloss_sequence:
        m = SIGN_MEDIA.get(g)
        media.append({
            "gloss": g,
            "type": m["type"] if m else None,
            "url": m["url"] if m else None,
        })
    return {
        "input_text": payload.text,
        "gloss_sequence": gloss_sequence,
        "available_signs": len(CLASSES),
        "media": media,
    }


@app.get("/api/contributions/needs-data")
def needs_data():
    needs = sorted(sign_catalog, key=lambda s: s["approved_samples"])[:10]
    return {
        "items": [
            {
                "id": s["id"],
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "current": s["approved_samples"],
                "target": 50,
            }
            for s in needs
        ]
    }


# ─────────────────────────────────────────────
# MEDIA UPLOAD / SERVE / DELETE (admin)
# ─────────────────────────────────────────────
ALLOWED_VIDEO_EXT = {".mp4", ".webm", ".mov"}
ALLOWED_IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}


@app.post("/api/admin/signs/{sign_id}/media")
async def upload_sign_media(sign_id: str, file: UploadFile = File(...)):
    sign = next((s for s in sign_catalog if s["id"] == sign_id), None)
    if sign is None:
        raise HTTPException(status_code=404, detail="Sign not found")
    ext = Path(file.filename or "").suffix.lower()
    if ext in ALLOWED_VIDEO_EXT:
        mtype = "video"
    elif ext in ALLOWED_IMAGE_EXT:
        mtype = "image"
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported type {ext}. Use mp4/webm/mov or png/jpg/webp.",
        )
    old = SIGN_MEDIA.get(sign["label"])
    if old:
        oldp = MEDIA_DIR / old["filename"]
        if oldp.exists():
            oldp.unlink()
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", sign["label"])
    filename = f"{safe}{ext}"
    data = await file.read()
    (MEDIA_DIR / filename).write_bytes(data)
    SIGN_MEDIA[sign["label"]] = {
        "type": mtype,
        "filename": filename,
        "url": f"/api/media/{filename}",
    }
    _persist_sign_media()
    sign["reference_media"] = SIGN_MEDIA[sign["label"]]
    sign["reference_video_url"] = SIGN_MEDIA[sign["label"]]["url"] if mtype == "video" else None
    return {"success": True, "media": SIGN_MEDIA[sign["label"]]}


@app.get("/api/media/{filename}")
def serve_media(filename: str):
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")
    mt = {
        ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    }.get(filepath.suffix.lower(), "application/octet-stream")
    return FileResponse(str(filepath), media_type=mt)


@app.delete("/api/admin/signs/{sign_id}/media")
def delete_sign_media(sign_id: str):
    sign = next((s for s in sign_catalog if s["id"] == sign_id), None)
    if sign is None:
        raise HTTPException(status_code=404, detail="Sign not found")
    old = SIGN_MEDIA.pop(sign["label"], None)
    if old:
        p = MEDIA_DIR / old["filename"]
        if p.exists():
            p.unlink()
    _persist_sign_media()
    sign["reference_media"] = None
    sign["reference_video_url"] = None
    return {"success": True}


# ─────────────────────────────────────────────
# TTS
# ─────────────────────────────────────────────
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    voice_id = str(payload.get("voice", "1"))
    if not text:
        return {"text": "", "audio_url": None, "engine": "none", "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text, voice_id=voice_id)
        result["text"] = text
        return result
    except Exception as e:
        return {
            "text": text,
            "audio_url": None,
            "engine": "none",
            "duration_ms": 0,
            "status": f"tts_error: {str(e)}",
        }


@app.get("/api/tts/audio/{filename}")
def serve_tts_audio(filename: str):
    filepath = TTS_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Audio file not found")
    media_type = "audio/mpeg" if filename.endswith(".mp3") else "audio/wav"
    return FileResponse(str(filepath), media_type=media_type)


@app.get("/api/tts/voices")
def list_tts_voices():
    from backend.tts_engine import VOICES
    return {
        "voices": [
            {"id": k, "label": v[0], "engine_voice": v[1]}
            for k, v in VOICES.items()
        ]
    }


# ─────────────────────────────────────────────
# DEMO SEQUENCES
# ─────────────────────────────────────────────
@app.get("/api/demo/sequences")
def demo_sequences():
    return {
        "sequences": [
            {
                "id": "demo-hello",
                "name": "Hello Sequence",
                "gloss_sequence": ["H", "E", "L", "L", "O"],
                "bengali_output": "হ্যালো",
                "frames": 150,
            },
            {
                "id": "demo-thank",
                "name": "Thank You",
                "gloss_sequence": ["T", "H", "A", "N", "K"],
                "bengali_output": "ধন্যবাদ",
                "frames": 120,
            },
        ]
    }


# ─────────────────────────────────────────────
# CONTRIBUTIONS: session + REAL ingestion
# ─────────────────────────────────────────────
@app.post("/api/contributions/session")
def create_session(payload: dict):
    return {
        "session_id": f"sess_{uuid.uuid4().hex[:8]}",
        "signer_id": payload.get("signer_id", "anonymous"),
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "status": "active",
    }


@app.post("/api/contributions/session/{session_id}/samples")
async def ingest_sample(
    session_id: str,
    label: str = Form(...),
    signer_id: str = Form(...),
    nmm_tags: str = Form("{}"),
    file: UploadFile = File(...),
):
    """Real upload: decode video server-side, extract 126-dim landmarks every
    3rd frame, save .npy + append manifest record. No simulation."""
    import os
    import tempfile

    suffix = Path(file.filename or "rec.webm").suffix or ".webm"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        tmp.write(await file.read())
        tmp.close()

        cap = cv2.VideoCapture(tmp.name)
        frames = []
        idx = 0
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if idx % 3 == 0:
                vec = process_bgr_frame(frame)
                if vec is not None:
                    frames.append(vec)
            idx += 1
        cap.release()
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass

    if len(frames) < 5:
        raise HTTPException(
            status_code=400,
            detail="Not enough hand landmarks extracted. Keep both hands visible while recording.",
        )

    arr = np.array(frames, dtype=np.float32)
    safe_label = re.sub(r"[^A-Za-z0-9_-]", "_", label)
    sample_id = f"v001_{safe_label}_{signer_id}_{time.strftime('%Y%m%dT%H%M%S')}"
    label_dir = SAMPLES_DIR / safe_label / signer_id
    label_dir.mkdir(parents=True, exist_ok=True)
    npy_path = label_dir / f"{sample_id}.npy"
    np.save(npy_path, arr)

    record = {
        "sample_id": sample_id,
        "session_id": session_id,
        "label": label,
        "signer_id": signer_id,
        "split": "unassigned",
        "source": "community",
        "verification": "pending",
        "verified_by": None,
        "captured_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "frames": int(arr.shape[0]),
        "landmark_path": str(npy_path.relative_to(ROOT)),
        "nmm_tags": json.loads(nmm_tags or "{}"),
        "upload_status": "success",
    }
    with open(MANIFEST_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

    return {"sample_id": sample_id, "status": "pending_review", "frames": int(arr.shape[0])}


@app.get("/api/admin/contributions")
def get_contributions():
    return _load_manifest()


@app.get("/api/admin/contributions/{sample_id}/evidence")
def get_evidence(sample_id: str):
    rec = next((r for r in _load_manifest() if r["sample_id"] == sample_id), None)
    if rec is None:
        raise HTTPException(status_code=404, detail="Sample not found")

    preds = []
    top_conf = 0.0
    frames = rec.get("frames", 0)
    mean_vel = 0.0
    npy = ROOT / rec["landmark_path"]
    if npy.exists():
        arr = np.load(npy)
        frames = int(arr.shape[0])
        if frames > 1:
            mean_vel = float(np.linalg.norm(np.diff(arr[:, :63], axis=0), axis=1).mean())
        mid = arr[frames // 2]
        logits = session.run(None, {INPUT_NAME: mid.reshape(1, 126)})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]
        preds = [{"label": CLASSES[i], "confidence": round(float(probs[i]), 3)} for i in order]
        top_conf = float(probs[order[0]])

    agree = round(top_conf * 100, 1) if preds and preds[0]["label"] == rec["label"] else round(top_conf * 60, 1)
    geom = round(min(100.0, 70 + frames * 0.5), 1)
    temp = round(min(100.0, 60 + frames * 0.8), 1) if mean_vel < 200 else 40.0
    tags = [t.upper() for t, v in (rec.get("nmm_tags") or {}).items() if v]

    return {
        "geometry_score": geom,
        "temporal_score": temp,
        "similarity_score": agree,
        "label_agreement": agree,
        "synthetic_score": round(min(100.0, mean_vel * 2), 1),
        "model_predictions": preds or [{"label": rec["label"], "confidence": 0.5}],
        "numerical_features": {"frames": frames, "mean_velocity": round(mean_vel, 3)},
        "symbolic_tags": tags or ["NO_NMM"],
        "movement_description": (
            f"Community recording of '{rec['label']}' by {rec['signer_id']}; "
            f"{frames} landmark frames extracted at stride 3."
        ),
        "reasoning": {
            "handshape_match": "Strong" if agree > 70 else "Moderate",
            "movement_match": "Strong" if temp > 70 else "Moderate",
            "temporal_match": f"{frames} frames captured",
            "nmm_detected": ", ".join(tags).lower() or "none",
            "top_candidate": f"{preds[0]['label']} · {preds[0]['confidence'] * 100:.1f}%" if preds else "—",
        },
    }


@app.post("/api/admin/contributions/{sample_id}/verify")
def verify_contribution(sample_id: str, payload: dict):
    action = payload.get("action", "needs_review")
    items = _load_manifest()
    changed = False
    for r in items:
        if r["sample_id"] == sample_id:
            r["verification"] = action
            r["verified_by"] = payload.get("reviewer", "admin")
            changed = True
    if changed:
        _write_manifest(items)
    return {"success": changed}


@app.get("/api/admin/stats")
def admin_stats():
    ai = get_ai_config()
    return {
        "total_signs": len(sign_catalog),
        "total_approved_samples": sum(s["approved_samples"] for s in sign_catalog),
        "total_pending_samples": sum(s["pending_samples"] for s in sign_catalog),
        "total_rejected_samples": sum(s["rejected_samples"] for s in sign_catalog),
        "model_active": "sign_mlp.onnx",
        "model_classes": len(CLASSES),
        "llm_available": is_llm_available(),
        "llm_model": ai["model"],
        "inference_mode": ai["provider"],
        "dataset_version": "v0.1",
    }


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)