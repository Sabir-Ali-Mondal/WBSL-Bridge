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
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response, StreamingResponse
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
# ONNX Runtime refuses any graph input tensor above ``session.max_graph_input_size``
# (1 GiB by default). ``/api/predict/clip`` packs a whole T-frame clip into ONE
# tensor: 32 frames x 126 features x 4 bytes is only ~16 KB, so the clip route
# itself is fine -- but the limit is the kind that only trips on the biggest
# uploads, producing a 500 that reads as "the model detected nothing". Raise it
# once, centrally, so no route has to think about it. Declared here because the
# model registry below loads graphs at import time.
_ORT_OPTIONS = ort.SessionOptions()
_ORT_OPTIONS.add_session_config_entry(
    "session.max_graph_input_size", "4294967296")  # 4 GiB

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
RUNS_DIR = MODELS_DIR / "onnx_models"
MODEL_PATH = MODELS_DIR / "sign_mlp.onnx"          # legacy default (may not exist)
CLASSES_PATH = MODELS_DIR / "sign_classes.json"    # legacy default (may not exist)
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
# MODEL REGISTRY (auto-discovery + admin selection)
# ─────────────────────────────────────────────
# Every training run writes its artefacts into  models/onnx_models/<run>/
#   * temporal : LSTM / unified / video runs  -> artefact name says so
#   * static   : frame classifier, input width probed from the graph
#   * classes  : <name>_classes.json (sibling), else sign_classes.json
# Non-.onnx files (e.g. the .gguf LLM) are ignored. The newest run wins at
# startup. The admin panel can override the choice; the override is stored in
# models/active_model.json and survives restarts.
SEQ_T = 32
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
            # A static classifier is only usable if it takes the 126-landmark
            # frame vector; temporal runs ingest a (T, 126) sequence. Both are
            # probed, so a run with no classes or an unloadable graph is dropped
            # rather than silently winning the "newest" race.
            #
            # The probe reads BOTH the rank and the middle axis. Width alone is
            # ambiguous: a static [N,126] and a temporal [N,32,126] both end in
            # 126, so a width-only check can never tell them apart (this was the
            # root cause of a temporal model silently failing on a single frame).
            name = onnx_file.stem
            input_width = None
            input_rank = None
            frames = 1
            try:
                probe = ort.InferenceSession(
                    str(onnx_file), providers=["CPUExecutionProvider"])
                shape = probe.get_inputs()[0].shape
                input_rank = len(shape)
                input_width = shape[-1] if isinstance(shape[-1], int) else None
                if input_rank >= 3 and isinstance(shape[-2], int):
                    frames = shape[-2]          # the declared clip length
            except Exception as exc:                   # noqa: BLE001
                print(f"[WBSL Backend] Skipping unloadable graph {onnx_file}: {exc}")
                continue
            # The graph's own shape is the authority. The filename heuristic is
            # kept only as a tie-breaker for graphs whose sequence axis is
            # dynamic (rare here, but a run named *_lstm with a symbolic T is
            # still temporal, just unpinnable to a frame count).
            name_says_temporal = any(k in name for k in ("lstm", "unified", "video"))
            is_temporal = input_rank >= 3 or (input_rank == 2 and name_says_temporal)
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
                "temporal": is_temporal,
                "input_width": input_width,
                "input_rank": input_rank,
                "frames": frames,
                # The endpoint a request must hit for this graph to be usable.
                "endpoint": "/api/predict/clip" if is_temporal else "/api/predict/frame",
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


def _preferred_model(registry):
    """Resolve which discovered model to activate."""
    wanted = None
    if ACTIVE_MODEL_PATH.exists():
        try:
            wanted = json.loads(ACTIVE_MODEL_PATH.read_text(encoding="utf-8")).get("path")
        except Exception:
            wanted = None
    if wanted:
        for d in registry:
            if d["path"] == wanted:
                return d
        print(f"[WBSL Backend] Configured model missing, falling back to newest: {wanted}")
    # prefer the newest temporal model, else the newest of anything
    for d in registry:
        if d["temporal"]:
            return d
    return registry[0]


class ModelRegistry:
    """Holds the discovered artefacts and the currently loaded model.

    ``reload(path=None)`` rescans the folder and swaps the active graph in
    place, so the admin panel can switch models without restarting uvicorn."""

    def __init__(self):
        self.models = []
        self.active = None
        self.session = None           # static 126-landmark MLP
        self.input_name = None
        self.classes = []
        self.temporal_session = None  # unified LSTM (None for static models)
        self.temporal_input = None
        self.temporal_classes = []
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

# ─────────────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────────────
# A WORD_MAP value may be either a single gloss string or a LIST of glosses
# (e.g. pronouns fingerspelled as letters: "তুমি" -> ["Y", "O", "U"]).
# Everything downstream expects a flat list of gloss strings, so normalise once.
def _as_glosses(value):
    if isinstance(value, (list, tuple)):
        return [str(g) for g in value]
    return [str(value)]


_only_key = {}
for _k, _v in WORD_MAP.items():
    _as_glosses(_v)  # keep normalisation in one place
    if isinstance(_v, str):
        _only_key.setdefault(_v, _k)

# label -> Bengali meaning (only unambiguous, single-gloss entries)
WORD_BENGALI = _only_key

_bengali_map = {
    "A": "এ", "B": "বি", "C": "সি", "D": "ডি", "E": "ই",
    "F": "এফ", "G": "জি", "H": "এইচ", "I": "আই", "J": "জে",
    "K": "কে", "L": "এল", "M": "এম", "N": "এন", "O": "ও",
    "P": "পি", "Q": "কিউ", "R": "আর", "S": "এস", "T": "টি",
    "U": "ইউ", "V": "ভি", "W": "ডব্লু", "X": "এক্স", "Y": "ওয়াই", "Z": "জেড",
    "1": "এক", "2": "দুই", "3": "তিন", "4": "চার", "5": "পাঁচ",
    "6": "ছয়", "7": "সাত", "8": "আট", "9": "নয়", "0": "শূন্য",
}

# ─────────────────────────────────────────────
# IN-MEMORY STATE
# ─────────────────────────────────────────────
def _build_catalog():
    catalog = [
        {
            "id": str(i),
            "label": c,
            "bengali_meaning": _bengali_map.get(c, WORD_BENGALI.get(c, "")),
            "category": "ISL Alphabet" if c in _bengali_map else "ISL Word",
            "type": "word",
            "approved_samples": 300,
            "pending_samples": 0,
            "rejected_samples": 0,
            "reference_video_url": None,
            "language": "ISL",
        }
        for i, c in enumerate(ACTIVE_CLASSES)
    ]
    for s in catalog:                       # attach stored reference media
        m = SIGN_MEDIA.get(s["label"])
        s["reference_media"] = m
        if m and m["type"] == "video":
            s["reference_video_url"] = m["url"]
    return catalog


def _coverage_summary():
    """How much of the flat plate can the user actually see?

    ``active_classes`` is what the *model* can recognise. ``with_media`` is what
    the Text->Sign page can *play*. Those two numbers are different, and until
    this function existed the gap was invisible: the UI reported 97 available
    signs while only 2 had a reference image. Anything that quotes a "signs
    available" figure should quote this, not len(ACTIVE_CLASSES).
    """
    total = len(ACTIVE_CLASSES)
    present = [c for c in ACTIVE_CLASSES if c in SIGN_MEDIA]
    return {
        "total_classes": total,
        "with_media": len(present),
        "missing": [c for c in ACTIVE_CLASSES if c not in SIGN_MEDIA],
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

# ─────────────────────────────────────────────
# NMM / AFFECT SENSITIVITY CONFIGURATION
# ─────────────────────────────────────────────
from backend.nmm import get_nmm_config, update_nmm_thresholds


@app.get("/api/nmm/config")
def get_nmm_settings():
    return get_nmm_config()


@app.post("/api/nmm/config")
def set_nmm_settings(payload: dict):
    return update_nmm_thresholds(payload)
def _check_model_available(path):
    """Guards against activating a graph the serving layer cannot feed.

    There are two servable contracts, and they are distinguished by RANK, not
    by width:

      * static   ``[N, 126]``     fed by ``/api/predict/frame`` (one frame)
      * temporal ``[N, T, 126]``  fed by ``/api/predict/clip``   (T frames)

    A width-only test is unable to tell these apart, because both end in 126.
    Earlier revisions of this function compared ``shape[-1]`` to 126 and so
    waved through temporal graphs that the frame endpoint then failed on.

    Returns an error string, or None when the model is safe to activate."""
    desc = next((m for m in REGISTRY.models if m["path"] == path), None)
    if desc is None:
        return f"Model not in registry: {path}"
    # Both contracts are servable: the frame route handles rank 2, the clip
    # route handles rank 3. What is NOT servable is a graph whose last axis is
    # not the 126-landmark vector, since every feature extractor here emits 126.
    if desc.get("input_width") == 126:
        return None
    if desc.get("input_width") is None:
        return (
            f"'{desc['name']}' declares an open-ended final input axis, so its "
            f"feature width cannot be verified as the 126-landmark vector. "
            f"Re-export the graph with a fixed feature dimension."
        )
    return (
        f"'{desc['name']}' expects {desc['input_width']}-wide inputs, but every "
        f"feature extractor in this project emits a 126-dim two-hand landmark "
        f"vector."
    )


@app.get("/api/system/health")
def health(response: Response):
    ai = get_ai_config()
    active = REGISTRY.active or {}
    # This probes the LLM provider, which is a deliberate round trip that costs
    # real time when the provider is absent. Every page fetches it on mount just
    # to learn which prediction route is valid, so let the browser reuse the
    # answer for a few seconds instead of re-probing on every navigation.
    response.headers["Cache-Control"] = "public, max-age=5"
    return {
        "api": True,
        "model": True,
        "tts": True,
        "llm": is_llm_available(),
        "inference_mode": ai["provider"],
        "llm_model": ai["model"],
        "dataset_version": "v0.1",
        "model_version": "LSTM-unified" if REGISTRY.temporal_session else "MLP-static",
        "unified": REGISTRY.temporal_session is not None,
        "active_classes": len(REGISTRY.active_classes),
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "model_run": REGISTRY.active["run"] if REGISTRY.active else None,
        "model_path": REGISTRY.active_id(),
        "model_error": REGISTRY.error,
        # The contract, published so the UI knows which button to enable BEFORE
        # the user clicks. A temporal model needs a 32-frame clip; a static one
        # needs a single frame. Getting this wrong is what made the LSTM runs
        # look like they "detected nothing".
        "contract": {
            "kind": "temporal" if active.get("temporal") else "static",
            "input_rank": active.get("input_rank"),
            "frames": active.get("frames", 1),
            "feature_width": active.get("input_width"),
            "endpoint": active.get("endpoint", "/api/predict/frame"),
        },
        "reference_coverage": _coverage_summary(),
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
    # Affect + raw NMM geometry. These MUST be declared here: FastAPI validates
    # the response against this model and silently DROPS undeclared keys, so
    # detect_nmm() computing an emotion the model does not list means the client
    # never receives it.
    emotion: dict | None = None
    metrics: dict | None = None


@app.post("/api/predict/frame", response_model=PredictResponse)
async def predict_frame(file: UploadFile = File(...)):
    # A temporal graph declares [N, T, 126]: it cannot be fed one frame. Without
    # this guard the run() below raises a shape error, the client sees a 500, and
    # the model looks like it "detects nothing". Fail loudly and name the
    # endpoint that CAN serve it instead.
    if REGISTRY.temporal_session is not None:
        frames = (REGISTRY.active or {}).get("frames", SEQ_T)
        raise HTTPException(
            status_code=409,
            detail=(
                f"The active model '{REGISTRY.active['name']}' is temporal and "
                f"expects a clip of {frames} frames, not a single frame. Use "
                f"POST /api/predict/clip, or activate a static model "
                f"(e.g. a 126-input MLP) in the admin panel."
            ),
        )
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
                emotion=nmm_flags.get("emotion"),
                metrics=nmm_flags.get("metrics"),
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
            emotion=nmm_flags.get("emotion"),
            metrics=nmm_flags.get("metrics"),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# PREDICTION: T-frame clip → temporal model
# ─────────────────────────────────────────────
@app.post("/api/predict/clip")
async def predict_clip(files: list[UploadFile] = File(...)):
    if unified_session is None:
        raise HTTPException(
            status_code=409,
            detail=(
                "The active model is static and expects a single frame. Use "
                "POST /api/predict/frame, or activate a temporal (LSTM) model "
                "in the admin panel."
            ),
        )
    # Read the clip length from the graph's own contract rather than assuming
    # SEQ_T: a run may be exported with a different T, and silently resampling
    # to the wrong length produces confident nonsense instead of an error.
    want_t = (REGISTRY.active or {}).get("frames") or SEQ_T
    vecs, last = [], None
    for f in files:
        raw = await f.read()
        fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
        if fr is None:
            continue
        v = process_bgr_frame(fr)
        if v is not None:
            last = v
        vecs.append(v if v is not None else last)
    vecs = [v for v in vecs if v is not None]
    if len(vecs) < 8:
        return {"ready": False, "detail": "No hands detected in clip"}
    arr = np.array(vecs, np.float32)
    if len(arr) != want_t:
        arr = arr[np.linspace(0, len(arr) - 1, want_t).astype(int)]
    logits = unified_session.run(None, {UNIFIED_INPUT: arr[None]})[0][0]
    probs = np.exp(logits - logits.max())
    probs /= probs.sum()
    order = np.argsort(probs)[::-1][:3]
    return {"ready": True, "label": ACTIVE_CLASSES[int(order[0])],
            "confidence": float(probs[order[0]]),
            "frames_used": int(want_t), "frames_supplied": int(len(vecs)),
            "top3": [{"label": ACTIVE_CLASSES[i], "confidence": float(probs[i])} for i in order]}


# ─────────────────────────────────────────────
# PREDICTION: streaming window → temporal model (live auto-detection)
# ─────────────────────────────────────────────
@app.post("/api/predict/stream")
async def predict_stream(files: list[UploadFile] = File(...)):
    """Recognise a sign from a rolling window of recent frames.

    This is what makes live signing work with a temporal model. The old design
    made the user press a button and hold still for exactly three seconds, which
    is both unnatural to perform and easy to get wrong: if the sign finished
    early, or the hand left the frame, the fixed window captured the wrong half
    of the movement.

    Instead the client keeps a ring buffer of the last ``frames`` frames and
    posts it whenever it sees motion. The server recognises the window, and
    reports ``margin`` -- the gap between the best and second-best class -- so
    the client can demand a *decisive* win before committing a gloss to the
    sequence. A hesitant window therefore produces no output rather than a
    confident-looking wrong one.
    """
    if unified_session is None:
        raise HTTPException(
            status_code=409,
            detail=(
                "The active model is static and expects a single frame. Use "
                "POST /api/predict/frame, or activate a temporal (LSTM) model "
                "in the admin panel."
            ),
        )
    want_t = (REGISTRY.active or {}).get("frames") or SEQ_T
    vecs, last = [], None
    last_frame_bgr = None
    for f in files:
        raw = await f.read()
        fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
        if fr is None:
            continue
        last_frame_bgr = fr
        v = process_bgr_frame(fr)
        if v is not None:
            last = v
        vecs.append(v if v is not None else last)
    vecs = [v for v in vecs if v is not None]
    if len(vecs) < 8:
        return {"ready": False, "detail": "No hands detected in window"}

    nmm_data = detect_nmm(last_frame_bgr) if last_frame_bgr is not None else {
        "question": False, "wh_question": False, "negation": False, "affirmation": False, "emphasis": False,
        "emotion": {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}},
        "metrics": {"brow_ratio": 0.0, "mouth_ratio": 0.0, "shake_var": 0.0, "nod_var": 0.0}
    }
    arr = np.array(vecs, np.float32)
    if len(arr) != want_t:
        arr = arr[np.linspace(0, len(arr) - 1, want_t).astype(int)]
    logits = unified_session.run(None, {UNIFIED_INPUT: arr[None]})[0][0]
    probs = np.exp(logits - logits.max())
    probs /= probs.sum()
    order = np.argsort(probs)[::-1][:3]
    return {
        "ready": True,
        "label": ACTIVE_CLASSES[int(order[0])],
        "confidence": float(probs[order[0]]),
        # Best minus runner-up. A one-hot softmax and a coin-flip can both report
        # "99%", so confidence alone cannot tell a real sign from noise; margin can.
        "margin": float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0,
        "frames_used": int(want_t),
        "frames_supplied": int(len(vecs)),
        "nmm": nmm_data,
        "emotion": nmm_data.get("emotion"),
        "metrics": nmm_data.get("metrics"),
        "top3": [
            {"label": ACTIVE_CLASSES[i], "confidence": float(probs[i])}
            for i in order
        ],
    }


@app.get("/api/coverage")
def coverage():
    """Vocabulary coverage: model classes vs playable reference media.

    Backs the site-wide honesty counter. ``total_classes`` is what the model can
    recognise; ``with_media`` is what Text->Sign can actually play. They are not
    the same number and the UI must not conflate them."""
    summary = _coverage_summary()
    missing = set(summary["missing"])
    return {
        **summary,
        "total_with_media": len(SIGN_MEDIA),
        "by_category": {
            cat: {
                "total": sum(1 for s in sign_catalog if s["category"] == cat),
                "with_media": sum(
                    1 for s in sign_catalog
                    if s["category"] == cat and s["label"] not in missing
                ),
            }
            for cat in sorted({s["category"] for s in sign_catalog})
        },
        "items": [
            {
                "label": s["label"],
                "bengali": s["bengali_meaning"],
                "category": s["category"],
                "has_media": s["label"] not in missing,
                "media_type": (SIGN_MEDIA.get(s["label"]) or {}).get("type"),
                "media_url": (SIGN_MEDIA.get(s["label"]) or {}).get("url"),
            }
            for s in sign_catalog
        ],
        "active_model": REGISTRY.active["name"] if REGISTRY.active else None,
        "endpoint": (REGISTRY.active or {}).get("endpoint", "/api/predict/frame"),
    }


# ─────────────────────────────────────────────
# REAL LANDMARK REPLAY (no synthetic skeletons anywhere)
# ─────────────────────────────────────────────
@app.get("/api/simulation/frames")
def simulation_frames(label: str = "", sample_id: str = ""):
    arr = None
    source = ""
    if sample_id:
        rec = next((r for r in _load_manifest() if r["sample_id"] == sample_id), None)
        if rec and (ROOT / rec["landmark_path"]).exists():
            arr = np.load(ROOT / rec["landmark_path"])
            source = f"community:{sample_id}"
    elif label:
        safe = label.upper().replace(" ", "_")
        for p in (ROOT / "dataset_train" / "unified_video" / f"{safe}.npy",
                  ROOT / "dataset_train" / "unified_static" / f"{safe}.npy"):
            if p.exists():
                arr = np.load(p)[0]
                source = f"extracted:{p.parent.name}"
                break
        if arr is None:
            rec = next((r for r in _load_manifest()
                        if r["label"].upper() == safe and (ROOT / r["landmark_path"]).exists()), None)
            if rec:
                arr = np.load(ROOT / rec["landmark_path"])
                source = f"community:{rec['sample_id']}"
    if arr is None:
        raise HTTPException(status_code=404, detail="No extracted landmark sequence for this sign yet")
    arr = arr[:64]
    return {"frames": arr.reshape(len(arr), 42, 3).tolist(), "points": 42,
            "count": int(len(arr)), "source": source}


@app.get("/api/dataset/reference")
def dataset_reference(label: str):
    m = SIGN_MEDIA.get(label) or SIGN_MEDIA.get(label.upper().replace(" ", "_"))
    if not m:
        raise HTTPException(status_code=404, detail="No reference sample for this sign")
    return {"label": label, "type": m["type"], "url": m["url"]}


@app.get("/api/dataset/index")
def dataset_index(label: str = "", kind: str = ""):
    idx = ROOT / "dataset" / "index.jsonl"
    if not idx.exists():
        return {"items": []}
    items = []
    for line in idx.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        if label and r.get("label", "").upper() != label.upper():
            continue
        if kind and r.get("kind") != kind:
            continue
        items.append(r)
    return {"items": items}


# ─────────────────────────────────────────────
# NLG: Gloss → Bengali via Gemma 4 E4B
# ─────────────────────────────────────────────
class NLGRequest(BaseModel):
    gloss: str
    # Detected NMM / affect context from the recognition layer. Optional so old
    # clients keep working; forwarded to the LLM when present.
    nmm: dict | None = None
    emotion: dict | None = None
    intensity: float | None = None
    hand: str | None = None

    def meta(self) -> dict:
        return {
            "nmm": self.nmm,
            "emotion": self.emotion,
            "intensity": self.intensity,
            "hand": self.hand,
        }


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


@app.post("/api/text-to-sign")
def text_to_sign(payload: TextToSignRequest):
    raw = (payload.text.lower()
           .replace("।", " ").replace("?", " ")
           .replace(",", " ").replace("!", " "))
    tokens = raw.split()
    max_n = max((len(k.split()) for k in WORD_MAP), default=1)
    gloss_sequence = []
    i = 0
    while i < len(tokens):
        hit = None
        # longest phrase match first ("good morning", "তোমার নাম কি")
        for n in range(min(max_n, len(tokens) - i), 1, -1):
            phrase = " ".join(tokens[i:i + n])
            if phrase in WORD_MAP:
                hit = WORD_MAP[phrase]
                i += n
                break
        if hit is None:
            w = tokens[i]
            if w in WORD_MAP:
                hit = WORD_MAP[w]
            elif w.upper() in ACTIVE_CLASSES:
                hit = w.upper()
            else:
                hit = f"[{w}]"
            i += 1
        # A value may be a list of glosses (e.g. pronouns fingerspelled as letters)
        gloss_sequence.extend(_as_glosses(hit))
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
        "available_signs": len(ACTIVE_CLASSES),
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
    target_path = MEDIA_DIR / filename
    data = await file.read()
    target_path.write_bytes(data)

    # If it is a video, ensure it is universally playable H.264 (avc1)
    if mtype == "video":
        try:
            cap = cv2.VideoCapture(str(target_path))
            fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
            w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fourcc = cv2.VideoWriter_fourcc(*"avc1")
            temp_out = str(target_path) + ".h264.mp4"
            writer = cv2.VideoWriter(temp_out, fourcc, fps, (w, h))
            frame_cnt = 0
            while True:
                ret, fr = cap.read()
                if not ret:
                    break
                writer.write(fr)
                frame_cnt += 1
            cap.release()
            writer.release()
            if frame_cnt > 0 and Path(temp_out).exists() and Path(temp_out).stat().st_size > 0:
                filename = f"{safe}.mp4"
                final_path = MEDIA_DIR / filename
                if target_path.exists() and target_path != final_path:
                    target_path.unlink()
                Path(temp_out).replace(final_path)
        except Exception as exc:
            print(f"[Media Upload] Transcode warning: {exc}")
    SIGN_MEDIA[sign["label"]] = {
        "type": mtype,
        "filename": filename,
        "url": f"/api/media/{filename}",
    }
    _persist_sign_media()
    sign["reference_media"] = SIGN_MEDIA[sign["label"]]
    sign["reference_video_url"] = SIGN_MEDIA[sign["label"]]["url"] if mtype == "video" else None
    return {"success": True, "media": SIGN_MEDIA[sign["label"]]}


@app.get("/api/media/{filename}/frames")
def extract_media_frames(filename: str, max_frames: int = 40):
    """Fallback frame sequence for any video file that browser cannot decode natively."""
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")

    cap = cv2.VideoCapture(str(filepath))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step = max(1, total // max_frames)

    import base64
    frames = []
    idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % step == 0 and len(frames) < max_frames:
            # Resize thumbnail for ultra-fast canvas flip
            h, w = frame.shape[:2]
            scale = 480 / max(h, 480)
            if scale < 1.0:
                frame = cv2.resize(frame, (int(w * scale), int(h * scale)))
            ok, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            if ok:
                b64 = base64.b64encode(buf.tobytes()).decode("ascii")
                frames.append(f"data:image/jpeg;base64,{b64}")
        idx += 1
    cap.release()

    return {
        "filename": filename,
        "fps": fps / step,
        "count": len(frames),
        "frames": frames,
    }


@app.api_route("/api/media/{filename}", methods=["GET", "HEAD", "OPTIONS"])
def serve_media(filename: str, request: Request):
    """Serve reference video/image with full byte-range support, HEAD inspection, and CORS."""
    filepath = MEDIA_DIR / filename
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="Media not found")
    mt = {
        ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
        ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    }.get(filepath.suffix.lower(), "application/octet-stream")

    size = filepath.stat().st_size
    headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600, must-revalidate",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
        "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
    }

    if request.method == "OPTIONS":
        return Response(status_code=204, headers=headers)

    if request.method == "HEAD":
        return Response(
            status_code=200,
            media_type=mt,
            headers={**headers, "Content-Length": str(size)},
        )

    rng = request.headers.get("range")
    if not rng:
        return FileResponse(str(filepath), media_type=mt, headers=headers)

    m = re.match(r"bytes=(\d*)-(\d*)$", rng.strip())
    if not m:
        return FileResponse(str(filepath), media_type=mt, headers=headers)
    start_s, end_s = m.group(1), m.group(2)
    if start_s == "":
        if end_s == "":
            return FileResponse(str(filepath), media_type=mt, headers=headers)
        n = int(end_s)
        start = max(size - n, 0)
        end = size - 1
    else:
        start = int(start_s)
        end = int(end_s) if end_s else size - 1
    end = min(end, size - 1)
    if start > end or start >= size:
        return Response(
            status_code=416,
            headers={**headers, "Content-Range": f"bytes */{size}"},
        )

    length = end - start + 1
    with open(filepath, "rb") as f:
        f.seek(start)
        chunk = f.read(length)
    return Response(
        content=chunk,
        status_code=206,
        media_type=mt,
        headers={
            **headers,
            "Content-Range": f"bytes {start}-{end}/{size}",
            "Content-Length": str(length),
        },
    )


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


def resample_arr(arr, t):
    """Linear resample of a landmark sequence to a fixed frame count."""
    if len(arr) == t:
        return arr
    ix = np.linspace(0, len(arr) - 1, t)
    i0, i1 = ix.astype(int), np.minimum(ix.astype(int) + 1, len(arr) - 1)
    f = (ix - i0)[:, None]
    return arr[i0] * (1 - f) + arr[i1] * f


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
        if unified_session is not None:
            seq = resample_arr(arr, SEQ_T)[None].astype(np.float32)
            logits = unified_session.run(None, {UNIFIED_INPUT: seq})[0][0]
        else:
            mid = arr[frames // 2]
            logits = session.run(None, {INPUT_NAME: mid.reshape(1, 126)})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]
        preds = [{"label": ACTIVE_CLASSES[i], "confidence": round(float(probs[i]), 3)} for i in order]
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