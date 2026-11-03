"""
backend/main.py
Complete FastAPI backend for WBSL Bridge.
Loads the active 98-dim temporal model and serves sign recognition, avatar
simulation, TTS, STT, and Bengali NLG.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & ".venv\\Scripts\\python.exe" -m uvicorn backend.main:app --reload --port 8200
"""

import os
import logging
import math
import time

# Suppress noisy C++/native logging from TensorFlow Lite, MediaPipe, and Abseil
os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
logging.getLogger("absl").setLevel(logging.ERROR)

import difflib
import json
import re
import unicodedata
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
from pydantic import BaseModel

# Local imports
from backend.extract import (
    N_FEATURES,
    N_FRAMES,
    complete_mask_single,
    frame_features,
    frame_in_use,
    process_holistic_frame,
    select_frames_from_span,
)
from backend.emotion_engine import detect_emotion_from_frame, emotion_available
from backend.streaming import (
    get_session,
    update_span_state,
)
from backend.llm_engine import (
    generate_bengali,
    generate_bengali_with_uncertainty,
    is_llm_available,
    get_ai_config,
    stream_bengali,
    break_into_glosses,
)

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
# Bound ONNX Runtime's graph input memory for the active temporal model.
_ORT_OPTIONS = ort.SessionOptions()
_ORT_OPTIONS.add_session_config_entry(
    "session.max_graph_input_size", "4294967296")  # 4 GiB

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
RUNS_DIR = MODELS_DIR / "onnx_models"
TTS_DIR = ROOT / "backend" / "tts_output"
TTS_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────
# MODEL REGISTRY (auto-discovery + admin selection)
# ─────────────────────────────────────────────
SEQ_T = N_FRAMES
FEATURE_WIDTH = N_FEATURES
NON_SIGN_CLASSES = {"NONE", "BACKGROUND"}
ACTIVE_MODEL_PATH = MODELS_DIR / "active_model.json"


def _find_classes_file(onnx_file, folder):
    """Locate the label list for a graph.

    Training names the two artefacts inconsistently — ``sign_mlp.onnx`` ships
    ``sign_classes.json`` while ``sign_video_lstm.onnx`` ships
    ``sign_video_classes.json`` (no ``lstm``), so a literal
    ``<stem>_classes.json`` lookup misses them. Try, in order:
    the exact stem, the folder's only ``*classes*.json``, then the stem with a
    trailing ``_lstm`` / ``_unified`` / ``_video`` stripped."""
    stem = onnx_file.stem
    candidates = [onnx_file.with_name(stem + "_classes.json")]

    globbed = sorted(folder.glob("*classes*.json"))
    if len(globbed) == 1:
        candidates.append(globbed[0])          # unambiguous: this run's labels
    for suffix in ("_lstm", "_unified", "_video"):
        if stem.endswith(suffix):
            candidates.append(onnx_file.with_name(stem[: -len(suffix)] + "_classes.json"))
    candidates.append(folder / "sign_classes.json")

    for cand in candidates:
        if cand.exists():
            return cand
    return None


def _discover_models():
    """Scan models/ and models/onnx_models/* for .onnx artefacts.

    Returns a list of descriptors (newest run first)."""
    found = []
    search = []
    if RUNS_DIR.is_dir():
        search.extend(sorted([d for d in RUNS_DIR.iterdir() if d.is_dir()]))
    search.append(MODELS_DIR)

    for idx, folder in enumerate(search):
        run = RUNS_DIR.name + "/" + folder.name if folder is not RUNS_DIR else "flat"
        try:
            duration = float((folder / "duration.json").read_text(encoding="utf-8")) \
                if (folder / "duration.json").exists() else 0.0
        except Exception:
            duration = 0.0
        for onnx_file in sorted(folder.glob("*.onnx")):
            # a .onnx.data sibling means weights live outside the graph
            external = onnx_file.with_suffix(".onnx.data")
            classes_file = _find_classes_file(onnx_file, folder)
            classes = []
            if classes_file:
                try:
                    classes = json.loads(classes_file.read_text(encoding="utf-8"))
                except Exception:
                    classes = []
            name = onnx_file.stem
            input_width = None
            input_rank = None
            frames = None
            try:
                probe = ort.InferenceSession(
                    str(onnx_file), providers=["CPUExecutionProvider"])
                shape = probe.get_inputs()[0].shape
                input_rank = len(shape)
                input_width = shape[-1] if isinstance(shape[-1], int) else None
                if input_rank >= 3 and isinstance(shape[-2], int):
                    frames = shape[-2]
            except Exception as exc:                   # noqa: BLE001
                print(f"[WBSL Backend] Skipping unloadable graph {onnx_file}: {exc}")
                continue
            if input_rank != 3 or frames != SEQ_T:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: expected rank-3 "
                    f"input with {SEQ_T} frames, got rank={input_rank}, frames={frames}"
                )
                continue
            if input_width != FEATURE_WIDTH:
                print(
                    f"[WBSL Backend] Skipping {onnx_file}: input width "
                    f"{input_width} != {FEATURE_WIDTH}"
                )
                continue
            avatar_dir = folder / "avatar"
            has_avatar = avatar_dir.is_dir()
            if not classes:
                print(f"[WBSL Backend] Skipping {onnx_file}: no class list found")
                continue
            try:
                mtime = onnx_file.stat().st_mtime
            except OSError:
                mtime = 0.0
            found.append({
                "run": run,
                "order": idx,
                "name": name,
                "label": f"{name}  ·  {run}",
                "path": str(onnx_file),
                "classes_path": str(classes_file) if classes_file else None,
                "classes": len(classes),
                "temporal": True,
                "input_width": input_width,
                "input_rank": input_rank,
                "frames": frames,
                "endpoint": "/api/stream/frame",
                "has_avatar": has_avatar,
                "report": {},
                "confusion": {},
                "has_external_data": external.exists(),
                "size_mb": round(onnx_file.stat().st_size / (1024 * 1024), 2)
                if onnx_file.exists() else 0.0,
                "mtime": mtime,
                "duration_s": duration,
            })

    # Newest artefact first. The mtime is what decides: the training script
    # writes <base>.onnx and then <base>.onnx.data, so if the external-weights
    # file is newer it must win the race, otherwise a 9:01 run folder looks
    # older than a 8:28 one and the stale model is selected.
    for d in found:
        data_file = Path(d["path"]).with_suffix(".onnx.data")
        if data_file.exists():
            try:
                d["mtime"] = max(d["mtime"], data_file.stat().st_mtime)
            except OSError:
                pass
    found.sort(key=lambda d: d["mtime"], reverse=True)
    return [d for d in found if d["classes"] > 0]


class ModelRegistry:
    """Holds the discovered artefacts and the currently loaded model.

    ``reload(path=None)`` rescans the folder and swaps the active graph in
    place, so the admin panel can switch models without restarting uvicorn."""

    def __init__(self):
        self.models = []
        self.active = None
        self.session = None
        self.input_name = None
        self.classes = []
        self.temporal_session = None
        self.temporal_input = None
        self.temporal_classes = []
        self.report = {}
        self.confusion = {}
        self.error = None
        self.reload()

    # ── discovery ───────────────────────────────────────────
    def reload(self, path=None):
        self.models = _discover_models()
        self.error = None
        if not self.models:
            self.error = (
                f"No .onnx model with a matching *_classes.json was found under "
                f"{RUNS_DIR}. Train a model first."
            )
            print(f"[WBSL Backend] WARNING: {self.error}")
            return {"ok": False, "detail": self.error, "models": []}

        target = None
        if path:
            target = next((m for m in self.models if m["path"] == path), None)
            if target is None:
                return {"ok": False, "detail": f"Model not found: {path}"}
        else:
            wanted = None
            if ACTIVE_MODEL_PATH.exists():
                try:
                    wanted = json.loads(
                        ACTIVE_MODEL_PATH.read_text(encoding="utf-8")).get("path")
                except Exception:
                    wanted = None
            if wanted:
                target = next((m for m in self.models if m["path"] == wanted), None)
                if target is None:
                    print(f"[WBSL Backend] Configured model missing, using newest: {wanted}")
            if target is None:
                target = next((m for m in self.models if m["temporal"]), self.models[0])

        try:
            # Both graphs are (re)loaded in lock-step so the running rule index
            # and the temporal clip predictor always refer to the same run.
            self.session = ort.InferenceSession(
                target["path"], sess_options=_ORT_OPTIONS,
                providers=["CPUExecutionProvider"])
            self.input_name = self.session.get_inputs()[0].name
            self.classes = json.loads(
                Path(target["classes_path"]).read_text(encoding="utf-8"))
            report_file = Path(target["path"]).parent / "daily_report.json"
            confusion_file = Path(target["path"]).parent / "confusion_matrix.json"
            self.report = {}
            self.confusion = {}
            for path, key in ((report_file, "report"), (confusion_file, "confusion")):
                if path.exists():
                    try:
                        value = json.loads(path.read_text(encoding="utf-8"))
                    except (OSError, json.JSONDecodeError) as exc:
                        print(f"[WBSL Backend] Could not load {path.name}: {exc}")
                    else:
                        if key == "report":
                            self.report = value
                        else:
                            self.confusion = value
            self.temporal_session = None
            self.temporal_input = None
            self.temporal_classes = []
            if target["temporal"]:
                self.temporal_session = self.session
                self.temporal_input = self.input_name
                self.temporal_classes = self.classes
        except Exception as exc:                       # noqa: BLE001
            self.error = f"Failed to load {target['name']}: {exc}"
            print(f"[WBSL Backend] ERROR: {self.error}")
            return {"ok": False, "detail": self.error, "models": self.models}

        self.active = target
        try:
            ACTIVE_MODEL_PATH.write_text(
                json.dumps({"path": target["path"], "name": target["name"],
                            "run": target["run"]}, indent=2),
                encoding="utf-8")
        except OSError as exc:
            print(f"[WBSL Backend] Could not persist active model: {exc}")

        print(f"[WBSL Backend] Active model: {target['label']} "
              f"({'temporal' if target['temporal'] else 'static'}, "
              f"{len(self.classes)} classes)")
        return {"ok": True, "active": target, "models": self.models}

    # ── accessors used by the prediction routes ─────────────
    @property
    def active_classes(self):
        return self.temporal_classes if self.temporal_session else self.classes

    def active_id(self):
        return self.active["path"] if self.active else None

    def public_models(self):
        aid = self.active_id()
        return [{**m, "active": m["path"] == aid} for m in self.models]


REGISTRY = ModelRegistry()

# Module-level names the prediction routes read. They mirror the registry at
# all times; _sync_model_globals() is called once here and again after every
# admin reload, so health/predict never disagree with the admin panel.
session = REGISTRY.session
INPUT_NAME = REGISTRY.input_name
CLASSES = REGISTRY.classes
unified_session = REGISTRY.temporal_session
UNIFIED_INPUT = REGISTRY.temporal_input
UNIFIED_CLASSES = REGISTRY.temporal_classes
ACTIVE_MODEL = REGISTRY.active
ACTIVE_CLASSES = REGISTRY.active_classes


def _active_run_dir():
    """Return the bundle directory for the currently selected ONNX model."""
    active = REGISTRY.active
    if not active:
        return None
    return Path(active["path"]).parent


def _available_model_classes():
    """Return sign labels in the active model vocabulary."""
    return [
        label for label in REGISTRY.active_classes
        if label not in NON_SIGN_CLASSES
    ]


# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────

def _build_catalog():
    classes = _available_model_classes()
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    catalog = [
        {
            "id": str(i),
            "label": c,
            "bengali_meaning": c.replace("_", " ").title(),
            "category": "Alphabet" if len(c) == 1 and c.isalpha() else "Word",
            "type": "word",
            "has_landmarks": bool(avatar_dir and (avatar_dir / c).is_dir()),
            "has_avatar": bool(avatar_dir and (avatar_dir / c).is_dir()),
            "language": "ISL",
        }
        for i, c in enumerate(classes)
    ]
    return catalog


def _coverage_summary():
    """Report avatar-data coverage for the active model vocabulary."""
    recognized = [c for c in REGISTRY.active_classes if c not in NON_SIGN_CLASSES]
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    available = (
        {folder.name.upper() for folder in avatar_dir.iterdir() if folder.is_dir()}
        if avatar_dir and avatar_dir.is_dir()
        else set()
    )
    covered = [label for label in recognized if label in available]
    missing = [label for label in recognized if label not in available]
    return {
        "total_classes": len(recognized),
        "with_avatar_data": len(covered),
        "missing_avatar_data": missing,
        "with_landmark_sequences": len(covered),
        "missing_sequences": missing,
    }


def _sync_model_globals():
    """Rebind module-level inference handles from the registry.

    Called at startup and after every admin reload, so the frame/clip routes,
    /api/system/health and the sign catalog never disagree with the panel."""
    global session, INPUT_NAME, CLASSES, unified_session, UNIFIED_INPUT
    global UNIFIED_CLASSES, ACTIVE_MODEL, ACTIVE_CLASSES, sign_catalog
    session = REGISTRY.session
    INPUT_NAME = REGISTRY.input_name
    CLASSES = REGISTRY.classes
    unified_session = REGISTRY.temporal_session
    UNIFIED_INPUT = REGISTRY.temporal_input
    UNIFIED_CLASSES = REGISTRY.temporal_classes
    ACTIVE_MODEL = REGISTRY.active
    ACTIVE_CLASSES = REGISTRY.active_classes
    sign_catalog = _build_catalog()     # catalog mirrors the running model


sign_catalog = _build_catalog()
_sync_model_globals()

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

def _check_model_available(path):
    """Ensure the selected graph matches the active 64x98 feature contract."""
    desc = next((m for m in REGISTRY.models if m["path"] == path), None)
    if desc is None:
        return f"Model not in registry: {path}"
    if (
        desc.get("input_rank") == 3
        and desc.get("frames") == SEQ_T
        and desc.get("input_width") == FEATURE_WIDTH
    ):
        return None
    return (
        f"'{desc['name']}' does not match the required "
        f"(batch, {SEQ_T}, {FEATURE_WIDTH}) model input."
    )


@app.get("/api/system/health")
def health(response: Response):
    ai = get_ai_config()
    active = REGISTRY.active or {}
    response.headers["Cache-Control"] = "public, max-age=5"
    return {
        "api": True,
        "model": REGISTRY.session is not None,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "ai_mode": ai["mode"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": active.get("name", "unavailable"),
        "unified": REGISTRY.temporal_session is not None,
        "active_classes": len(REGISTRY.active_classes),
        "vocabulary_classes": len(_available_model_classes()),
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_run": REGISTRY.active["run"] if REGISTRY.active else None,
        "model_path": REGISTRY.active_id(),
        "model_error": REGISTRY.error,
        # Publish the temporal model contract so clients can match their stream
        # buffers to the exact input expected by the active model.
        "contract": {
            "kind": "temporal",
            "input_rank": active.get("input_rank"),
            "frames": active.get("frames", SEQ_T),
            "feature_width": active.get("input_width"),
            "feature_kind": "shoulder_box_98",
            "endpoint": active.get("endpoint", "/api/stream/frame"),
        },
        "sequence_coverage": _coverage_summary(),
        "emotion_available": emotion_available(),
    }


# ─────────────────────────────────────────────
# MODEL REGISTRY (admin panel)
# ─────────────────────────────────────────────
class ModelSelectRequest(BaseModel):
    path: str


@app.get("/api/admin/models")
def admin_list_models():
    """Every discovered model plus which one is currently serving predictions."""
    return {
        "models": REGISTRY.public_models(),
        "active": REGISTRY.active,
        "active_path": REGISTRY.active_id(),
        "scan_dir": str(RUNS_DIR),
        "error": REGISTRY.error,
    }


@app.post("/api/admin/models/rescan")
def admin_rescan_models():
    """Re-scan models/onnx_models and hot-load the newest / configured model."""
    result = REGISTRY.reload()
    if not result["ok"]:
        raise HTTPException(status_code=404, detail=result["detail"])
    _sync_model_globals()
    return {"models": REGISTRY.public_models(), "active": REGISTRY.active}


@app.post("/api/admin/models/activate")
def admin_activate_model(payload: ModelSelectRequest):
    """Switch the serving model at runtime (no restart required)."""
    was_active = REGISTRY.active_id()
    availability = _check_model_available(payload.path)
    if availability:
        raise HTTPException(status_code=409, detail=availability)
    result = REGISTRY.reload(payload.path)
    if not result["ok"]:
        REGISTRY.reload(was_active)     # roll back to the model that was serving
        return {"ok": False, "detail": result["detail"],
                "models": REGISTRY.public_models()}
    _sync_model_globals()
    return {"ok": True, "active": REGISTRY.active,
            "models": REGISTRY.public_models()}


@app.get("/api/admin/model/report")
def admin_model_report():
    return REGISTRY.report or {}


@app.get("/api/admin/model/confusion")
def admin_model_confusion():
    return REGISTRY.confusion or {}


@app.get("/api/admin/model/avatar-list")
def admin_avatar_list():
    run_dir = _active_run_dir()
    avatar_dir = run_dir / "avatar" if run_dir else None
    if not avatar_dir or not avatar_dir.is_dir():
        return {"glosses": []}
    return {
        "glosses": sorted(folder.name for folder in avatar_dir.iterdir() if folder.is_dir())
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
    return {
        "total_signs": len(sign_catalog),
        "languages": sorted({s["language"] for s in sign_catalog}),
        "categories": sorted({s["category"] for s in sign_catalog}),
        "dataset_version": "v0.1",
        "model_version": REGISTRY.active["name"] if REGISTRY.active else "none",
    }


# ─────────────────────────────────────────────
# PREDICTION: frame stream → span state machine → temporal model
# ─────────────────────────────────────────────


def _span_duration(timestamps):
    if len(timestamps) < 2:
        return 1.0 / 30.0
    intervals = np.diff(np.asarray(timestamps, dtype=np.float64))
    intervals = intervals[np.isfinite(intervals) & (intervals > 0)]
    if not len(intervals):
        return len(timestamps) / 30.0
    return float(len(timestamps) * np.median(intervals))


def _recognize_stream_clip(clip, emotion, hands_detected):
    logits = REGISTRY.session.run(
        None, {REGISTRY.input_name: clip[np.newaxis].astype(np.float32)}
    )[0][0]
    probabilities = np.exp(logits - logits.max())
    probabilities /= probabilities.sum()
    order = np.argsort(probabilities)[::-1][:3]
    top_probability = float(probabilities[order[0]])
    margin = (
        float(probabilities[order[0]] - probabilities[order[1]])
        if len(order) > 1
        else 1.0
    )
    not_sure = top_probability < 0.5 or margin < 0.15
    return {
        "ready": True,
        "label": (
            REGISTRY.active_classes[int(order[0])] if not not_sure else "NOT_SURE"
        ),
        "confidence": top_probability,
        "margin": margin,
        "frames_used": N_FRAMES,
        "state": "IDLE",
        "emotion": emotion,
        "hands_detected": hands_detected,
        "top3": [
            {
                "label": REGISTRY.active_classes[int(index)],
                "confidence": float(probabilities[index]),
            }
            for index in order
        ],
    }


@app.post("/api/stream/frame")
async def stream_frame(
    session_id: str = "default",
    file: UploadFile = File(...),
    mode: str = Form(default="auto"),
    recording: bool = Form(default=False),
    capture_time: float | None = Form(default=None),
):
    if REGISTRY.session is None:
        raise HTTPException(409, "No model loaded.")
    if mode not in {"auto", "manual"}:
        raise HTTPException(422, "mode must be 'auto' or 'manual'")
    if capture_time is not None and not math.isfinite(capture_time):
        raise HTTPException(400, "capture_time must be finite")

    raw = await file.read()
    fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if fr is None:
        raise HTTPException(400, detail="Could not decode image")
    sess = get_session(session_id)
    if sess.mode != mode:
        sess.reset(mode)
    timestamp = capture_time if capture_time is not None else time.monotonic()
    height, width = fr.shape[:2]
    emotion = detect_emotion_from_frame(fr)
    frame_data = process_holistic_frame(fr)
    if frame_data is None:
        pose = hands = face = None
        in_use = np.zeros(2, dtype=bool)
        features = np.zeros(N_FEATURES, np.float32)
        complete = False
        hands_detected = 0
    else:
        pose = frame_data["pose"]
        hands = frame_data["hands"]
        face = frame_data["face"]
        in_use = frame_in_use(pose, width, height)
        features = frame_features(pose, hands, face, in_use, width, height, 0.0)
        complete = complete_mask_single(
            pose, hands, frame_data["face_ok"], in_use, width, height
        )
        hands_detected = int(in_use.sum())

    if mode == "manual":
        if recording:
            if not sess.manual_recording:
                sess.reset("manual")
                sess.manual_recording = True
            sess.frames.append(frame_data)
            sess.features.append((len(sess.features), features, complete))
            sess.timestamps.append(timestamp)
            return {
                "ready": False,
                "buffered": len(sess.frames),
                "state": "SIGN",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        if not sess.manual_recording:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        sess.manual_recording = False
        clip = select_frames_from_span(sess.features)
        duration = _span_duration(sess.timestamps)
        sess.frames = []
        sess.features = []
        sess.timestamps = []
        if clip is None:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "detail": "incomplete_span",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        clip[:, -1] = duration
        return _recognize_stream_clip(clip, emotion, hands_detected)

    if frame_data is None:
        state = update_span_state(
            sess, False, None, features, False, timestamp
        )
    else:
        state = update_span_state(
            sess, bool(in_use.any()), frame_data, features, complete, timestamp
        )

    if state == "SPAN_COMPLETE":
        clip = select_frames_from_span(sess.features)
        duration = _span_duration(sess.timestamps)
        sess.frames = []
        sess.features = []
        sess.timestamps = []
        sess.pre_roll.clear()
        if clip is None:
            return {
                "ready": False,
                "buffered": 0,
                "state": "IDLE",
                "detail": "incomplete_span",
                "emotion": emotion,
                "hands_detected": hands_detected,
            }
        clip[:, -1] = duration
        return _recognize_stream_clip(clip, emotion, hands_detected)

    return {
        "ready": False,
        "buffered": len(sess.frames),
        "state": state,
        "detail": "no_pose" if frame_data is None else None,
        "emotion": emotion,
        "hands_detected": hands_detected,
    }


@app.get("/api/coverage")
def coverage():
    """Vocabulary and avatar-data coverage for the active model."""
    summary = _coverage_summary()
    return {
        **summary,
        "by_category": {
            cat: {
                "total": sum(1 for s in sign_catalog if s["category"] == cat),
                "with_avatar_data": sum(
                    1 for s in sign_catalog
                    if s["category"] == cat and s["has_avatar"]
                ),
            }
            for cat in sorted({s["category"] for s in sign_catalog})
        },
        "items": [
            {
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "category": s["category"],
                "has_landmarks": s["has_avatar"],
                "has_avatar": s["has_avatar"],
            }
            for s in sign_catalog
        ],
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "endpoint": (REGISTRY.active or {}).get("endpoint", "/api/stream/frame"),
    }


@app.get("/api/simulation/frames")
def simulation_frames(label: str = ""):
    """Serve the active model's per-sign avatar arrays."""
    run_dir = _active_run_dir()
    if not run_dir:
        raise HTTPException(status_code=404, detail="No active model")

    normalized = label.upper().replace(" ", "_")
    if normalized not in _available_model_classes():
        raise HTTPException(status_code=404, detail=f"No avatar data for '{label}'")
    avatar_dir = run_dir / "avatar" / normalized
    if not avatar_dir.is_dir():
        raise HTTPException(status_code=404, detail=f"No avatar data for '{label}'")

    try:
        hands = np.load(avatar_dir / "hands.npy", allow_pickle=False)
        pose = np.load(avatar_dir / "pose.npy", allow_pickle=False)
        timestamps = np.load(avatar_dir / "t.npy", allow_pickle=False)
        face_path = avatar_dir / "face.npy"
        face = np.load(face_path, allow_pickle=False) if face_path.is_file() else None
    except (OSError, ValueError) as exc:
        raise HTTPException(
            status_code=500, detail=f"Could not load avatar data for '{normalized}': {exc}"
        ) from exc

    frame_count = hands.shape[0] if hands.ndim else 0
    if (
        hands.ndim != 3
        or hands.shape[1:] != (42, 3)
        or frame_count == 0
        or pose.shape != (frame_count, 8, 4)
        or timestamps.shape != (frame_count,)
        or (face is not None and face.shape != (frame_count, 19, 3))
    ):
        raise HTTPException(
            status_code=422, detail=f"Avatar data for '{normalized}' has invalid shapes"
        )

    result = {
        "frames": hands.tolist(),
        "pose": pose.tolist(),
        "times": timestamps.tolist(),
        "points": 42,
        "count": frame_count,
        "source": f"avatar:{normalized}",
        "width": FEATURE_WIDTH,
    }
    if face is not None:
        result["face_avatar"] = face.tolist()
    return result


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str
    emotion: dict | None = None

    def meta(self) -> dict:
        return {"emotion": self.emotion}


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
    result = generate_bengali(payload.gloss, meta=payload.meta())
    return result


@app.post("/api/nlg/stream")
def nlg_stream(payload: NLGRequest):
    """Server-Sent Events stream of the Bengali translation as it is written."""
    ai = get_ai_config()

    def event_source():
        for event in stream_bengali(payload.gloss, meta=payload.meta()):
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


@app.get("/api/text-to-sign/vocabulary")
def text_to_sign_vocabulary():
    glosses = _available_model_classes()
    return {"glosses": glosses, "available_signs": len(glosses)}


def _clean_token_boundary(t: str) -> str:
    """Strip leading and trailing punctuation (ASCII & Unicode) while keeping word content and marks."""
    s = t.strip()
    while s and unicodedata.category(s[0])[0] in ("P", "S"):
        s = s[1:].strip()
    while s and unicodedata.category(s[-1])[0] in ("P", "S"):
        s = s[:-1].strip()
    return s


def _normalize_label(s: str) -> str:
    """Normalize whitespace, underscores, and hyphens to single spaces."""
    return re.sub(r"[\s_-]+", " ", s).lower().strip()


def _match_offline_vocabulary(text: str, available_classes: list[str]) -> dict:
    """Matches input text against the active model's vocabulary without hardcoded maps.

    Applies exact matching, generic normalization, and ambiguity-checked fuzzy matching.
    Preserves token boundaries and handles surrounding punctuation.
    """
    if not available_classes:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [text.strip()] if text.strip() else [],
            "status": "unresolved",
        }

    # Build normalized lookups from active model labels
    norm_to_label = {}
    label_word_counts = {}
    for lbl in available_classes:
        norm = _normalize_label(lbl)
        if not norm:
            continue
        norm_to_label[norm] = lbl
        label_word_counts[norm] = len(norm.split())
        condensed = norm.replace(" ", "")
        if condensed not in norm_to_label:
            norm_to_label[condensed] = lbl

    raw_tokens = text.split()
    if not raw_tokens:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "status": "unresolved",
        }

    # Extract cleaned and normalized representation for each token
    tokens_info = []
    for raw_t in raw_tokens:
        clean_t = _clean_token_boundary(raw_t)
        norm_t = _normalize_label(clean_t) if clean_t else _normalize_label(raw_t)
        tokens_info.append({"raw": raw_t, "clean": clean_t, "norm": norm_t})

    meaningful_tokens = [t for t in tokens_info if t["norm"]]
    if not meaningful_tokens:
        return {
            "gloss_sequence": [],
            "unsupported_concepts": [],
            "status": "unresolved",
        }

    max_n = max(label_word_counts.values(), default=1)
    gloss_sequence = []
    unsupported_concepts = []
    i = 0

    while i < len(meaningful_tokens):
        matched_label = None
        consumed = 1

        # 1. Try exact multi-word phrase match first (longest phrase first)
        for n in range(min(max_n, len(meaningful_tokens) - i), 1, -1):
            phrase = " ".join(t["norm"] for t in meaningful_tokens[i : i + n])
            if phrase in norm_to_label:
                matched_label = norm_to_label[phrase]
                consumed = n
                break

        # 2. Try fuzzy multi-word phrase match with ambiguity checking
        if matched_label is None and (len(meaningful_tokens) - i) >= 2:
            multi_word_targets = [
                norm for norm, count in label_word_counts.items() if count > 1
            ]
            if multi_word_targets:
                for n in range(min(max_n, len(meaningful_tokens) - i), 1, -1):
                    phrase = " ".join(t["norm"] for t in meaningful_tokens[i : i + n])
                    scored = []
                    for target in multi_word_targets:
                        ratio = difflib.SequenceMatcher(None, phrase, target).ratio()
                        if ratio >= 0.88:
                            scored.append((ratio, target))
                    if scored:
                        scored.sort(key=lambda x: x[0], reverse=True)
                        best_ratio, best_target = scored[0]
                        # Ambiguity check: top score must be distinct from runner-up
                        if len(scored) == 1 or (best_ratio - scored[1][0] >= 0.08):
                            matched_label = norm_to_label[best_target]
                            consumed = n
                            break

        # 3. Try single-word exact match
        if matched_label is None:
            w_norm = meaningful_tokens[i]["norm"]
            if w_norm in norm_to_label:
                matched_label = norm_to_label[w_norm]
            # 4. Try single-word fuzzy match (for words with length >= 4)
            elif len(w_norm) >= 4:
                single_targets = [
                    norm for norm, count in label_word_counts.items() if count == 1
                ]
                scored = []
                for target in single_targets:
                    if len(target) >= 4:
                        ratio = difflib.SequenceMatcher(None, w_norm, target).ratio()
                        if ratio >= 0.85:
                            scored.append((ratio, target))
                if scored:
                    scored.sort(key=lambda x: x[0], reverse=True)
                    best_ratio, best_target = scored[0]
                    if len(scored) == 1 or (best_ratio - scored[1][0] >= 0.10):
                        matched_label = norm_to_label[best_target]

        if matched_label:
            gloss_sequence.append(matched_label)
        else:
            concept_name = meaningful_tokens[i]["clean"] or meaningful_tokens[i]["raw"]
            if concept_name:
                unsupported_concepts.append(concept_name)

        i += consumed

    status = (
        "success"
        if (gloss_sequence and not unsupported_concepts)
        else ("partial" if gloss_sequence else "unresolved")
    )

    return {
        "gloss_sequence": gloss_sequence,
        "unsupported_concepts": unsupported_concepts,
        "status": status,
    }


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    vocabulary = _available_model_classes()
    if not vocabulary:
        raise HTTPException(
            status_code=503,
            detail="The active model has no bundled landmark sequences.",
        )
    result = _match_offline_vocabulary(payload.text, vocabulary)
    return {
        "input_text": payload.text,
        "gloss_sequence": result["gloss_sequence"],
        "unsupported_concepts": result["unsupported_concepts"],
        "unmapped_words": result["unsupported_concepts"],
        "status": result["status"],
        "available_signs": len(vocabulary),
        "engine": "nlp",
    }


@app.post("/api/text-to-sign/llm")
def text_to_sign_llm(payload: TextToSignRequest):
    """Plan a signable gloss sequence with the LLM using the active model's vocabulary."""
    vocab = _available_model_classes()
    if not vocab:
        raise HTTPException(
            status_code=503,
            detail="The active model has no bundled landmark sequences.",
        )
    res = break_into_glosses(payload.text, vocab)

    if res.get("status") == "error":
        error_detail = res.get("error", "llm_error")
        raise HTTPException(status_code=503, detail=f"LLM error: {error_detail}")

    return {
        "input_text": payload.text,
        "gloss_sequence": res.get("gloss_sequence", []),
        "unsupported_concepts": res.get("unsupported_concepts", []),
        "unmapped_words": res.get("unsupported_concepts", []),
        "status": res.get("status", "unresolved"),
        "available_signs": len(vocab),
        "engine": "llm",
    }


# ─────────────────────────────────────────────
# TTS (Independent Free & ElevenLabs Premium)
# ─────────────────────────────────────────────
@app.post("/api/tts/generate")
def generate_tts(payload: dict):
    text = payload.get("text", "")
    voice_id = str(payload.get("voice", "1"))
    engine = str(payload.get("engine", "free")).strip().lower()
    if not text:
        return {"text": "", "audio_url": None, "engine": engine, "duration_ms": 0, "status": "no_text"}
    try:
        from backend.tts_engine import speak
        result = speak(text, voice_id=voice_id, engine=engine)
        result["text"] = text
        return result
    except Exception as e:
        return {
            "text": text,
            "audio_url": None,
            "engine": engine,
            "duration_ms": 0,
            "status": f"tts_error: {str(e)}",
            "error": str(e),
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
    from backend.tts_engine import VOICES_FREE, VOICES_ELEVENLABS, is_elevenlabs_configured
    voices_list = []
    for k, v in VOICES_FREE.items():
        voices_list.append({
            "id": k,
            "label": v[0],
            "engine": "free",
            "tier": "free",
            "engine_voice": v[1],
        })
    for k, v in VOICES_ELEVENLABS.items():
        voices_list.append({
            "id": k,
            "label": v[0],
            "engine": "elevenlabs",
            "tier": "premium",
            "engine_voice": v[1],
        })
    return {
        "voices": voices_list,
        "elevenlabs_configured": is_elevenlabs_configured(),
    }


# ─────────────────────────────────────────────
# SPEECH TO TEXT (Local faster-whisper + ElevenLabs Scribe)
# ─────────────────────────────────────────────
from backend.stt_engine import transcribe_bytes, is_elevenlabs_configured  # noqa: E402


@app.get("/api/stt/status")
def get_stt_status():
    return {
        "default_engine": "local",
        "engines": ["local", "elevenlabs"],
        "elevenlabs_configured": is_elevenlabs_configured(),
        "vad_modes": ["silero_vad"],
        "default_vad_mode": "silero_vad",
    }


@app.post("/api/stt")
async def speech_to_text(
    file: UploadFile = File(...),
    language: str = Form(default=""),
    engine: str = Form(default="local"),
    vad_mode: str = Form(default="silero_vad"),
    silence_threshold: float = Form(default=0.5),
    min_silence_ms: int = Form(default=500),
    speech_pad_ms: int = Form(default=400),
    max_segment_s: float = Form(default=15.0),
    is_final: bool = Form(default=False),
    previous_context: str = Form(default=""),
):
    try:
        data = await file.read()
        if not data:
            raise HTTPException(status_code=400, detail="Empty audio recording")

        vad_config = {
            "threshold": silence_threshold,
            "min_silence_duration_ms": min_silence_ms,
            "speech_pad_ms": speech_pad_ms,
            "max_speech_duration_s": max_segment_s,
        }

        return transcribe_bytes(
            data=data,
            filename=file.filename or "rec.webm",
            language=language,
            engine=engine,
            vad_mode=vad_mode,
            vad_config=vad_config,
            is_final=is_final,
            previous_context=previous_context,
        )
    except HTTPException:
        raise
    except ValueError as val_err:
        print(f"[STT Error] {val_err}")
        raise HTTPException(status_code=400, detail=str(val_err)) from val_err
    except Exception as exc:
        print(f"[STT Error] {exc}")
        raise HTTPException(
            status_code=500,
            detail=f"Speech-to-text transcription failed: {exc}",
        ) from exc



@app.get("/api/admin/stats")
def admin_stats():
    ai = get_ai_config()
    coverage = _coverage_summary()
    return {
        "total_signs": len(sign_catalog),
        "avatar_classes": coverage["with_avatar_data"],
        "model_active": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_classes": len(REGISTRY.active_classes),
        "contract": {
            "kind": "temporal",
            "feature_width": FEATURE_WIDTH,
            "frames": SEQ_T,
        },
        "llm_available": is_llm_available(),
        "llm_model": ai["model"],
        "inference_mode": ai["provider"],
        "ai_mode": ai["mode"],
        "dataset_version": "v0.1",
    }


# ─────────────────────────────────────────────
# RUN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)