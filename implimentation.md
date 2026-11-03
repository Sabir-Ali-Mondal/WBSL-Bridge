# WBSL Bridge — Complete Implementation Guide v2

> **READ THIS ENTIRE DOCUMENT BEFORE WRITING ANY CODE.**
> **NEVER modify anything inside `model_training_zone/`.**
> Execute phases in strict order.

---

## EXECUTION PLAN

| Phase | Task | Risk |
|-------|------|------|
| 1 | Environment Setup (`.env`, `start.ps1`) | LOW |
| 2 | Backend Feature Extraction Rewrite | HIGH |
| 3 | NMM Removal → Emotion Engine | MEDIUM |
| 4 | LLM Engine Update (AI_MODE) | MEDIUM |
| 5 | Backend `main.py` Overhaul | HIGH |
| 6 | Frontend NMM UI Removal | MEDIUM |
| 7 | Frontend Contributions Removal | LOW |
| 8 | Frontend Simulation Update | HIGH |
| 9 | Admin Panels Update | LOW |
| 10 | Model Files Cleanup | LOW |
| 11 | Verification | — |

---

## PHASE 1: ENVIRONMENT SETUP

### 1.1 CREATE `D:\Download\Projects\WBSL Bridge\.env`

```env
# ==========================================
# LLM MODE SELECTION
# ==========================================
AI_MODE=offline

# ==========================================
# ONLINE API CONFIGURATION (OpenRouter)
# ==========================================
AI_ONLINE_BASE_URL=https://openrouter.ai/api/v1
AI_ONLINE_API_KEY=
AI_ONLINE_MODEL_NAME=google/gemma-4-26b-a4b-it:free

# ==========================================
# OFFLINE API CONFIGURATION (KoboldCpp)
# ==========================================
AI_OFFLINE_BASE_URL=http://localhost:5001/v1
AI_OFFLINE_API_KEY=KoboldCppApi
AI_OFFLINE_MODEL_NAME=NVIDIA-Nemotron-3.5-Bolt-E4B-UD-Q3_K_XL.gguf

# ==========================================
# COMMON AI SETTINGS
# ==========================================
AI_STREAM=true
AI_REASONING=true
AI_REASONING_EFFORT=low
AI_TIMEOUT=180

# ==========================================
# TTS (unchanged)
# ==========================================
# ELEVENLABS_API_KEY=
```

### 1.2 REPLACE `start.ps1`

```powershell
$root = $PSScriptRoot
$python = Join-Path $root ".venv\Scripts\python.exe"
$requirements = Join-Path $root "requirements.txt"
$envFile = Join-Path $root ".env"
$backendScript  = Join-Path $env:TEMP "wbsl-backend.ps1"
$frontendScript = Join-Path $env:TEMP "wbsl-frontend.ps1"
$aiScript       = Join-Path $env:TEMP "wbsl-ai.ps1"
$backendPort    = 8200

if (-not (Test-Path -LiteralPath $python -PathType Leaf)) {
    throw "Python environment missing. Run: py -3.11 -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}
if (-not (Test-Path -LiteralPath $requirements -PathType Leaf)) {
    throw "requirements.txt not found: $requirements"
}
if (-not (Test-Path -LiteralPath $envFile -PathType Leaf)) {
    throw ".env file not found at project root. Create it from the template."
}

# ── PARSE .env ──
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) { $envVars[$parts[0].Trim()] = $parts[1].Trim() }
    }
}

$aiMode = $envVars["AI_MODE"]
if (-not $aiMode) { throw "AI_MODE not set in .env." }
if ($aiMode -ne "online" -and $aiMode -ne "offline") { throw "Invalid AI_MODE '$aiMode'." }

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " WBSL BRIDGE — STARTUP" -ForegroundColor Cyan
Write-Host " AI Mode: $aiMode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# ── CHECK BACKEND PORT ──
$backendListeners = @(Get-NetTCPConnection -State Listen -LocalPort $backendPort -ErrorAction SilentlyContinue)
$backendAlreadyRunning = $false
foreach ($listener in $backendListeners) {
    $listenerProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener.OwningProcess)" -ErrorAction Stop
    if ($listenerProcess.CommandLine -match 'backend\.main:app') { $backendAlreadyRunning = $true; continue }
    throw "Port $backendPort in use by $($listenerProcess.Name) (PID $($listenerProcess.ProcessId))."
}

# ── BUILD AI SERVER SCRIPT ──
if ($aiMode -eq "offline") {
    $offlineModel = $envVars["AI_OFFLINE_MODEL_NAME"]
    if (-not $offlineModel) { throw "AI_OFFLINE_MODEL_NAME not set in .env" }
    $modelPath = Join-Path $root "models\llm\$offlineModel"
    if (-not (Test-Path -LiteralPath $modelPath -PathType Leaf)) {
        Write-Host "WARNING: Offline model not found at $modelPath" -ForegroundColor Yellow
    }
    @"
Set-Location '$root'
`$kobold = Join-Path (Get-Location) 'models\llm\koboldcpp.exe'
`$model = '$modelPath'
`$args = @('--model', `$model, '--port', '5001', '--jinja', '--jinjathink', 'false', '--threads', '8', '--contextsize', '4096')
Write-Host "Starting KoboldCpp (offline) with: $offlineModel" -ForegroundColor Green
& `$kobold @args
"@ | Set-Content -Path $aiScript -Encoding UTF8
} else {
    $onlineModel = $envVars["AI_ONLINE_MODEL_NAME"]
    @"
Set-Location '$root'
Write-Host "Online mode — using OpenRouter API" -ForegroundColor Green
Write-Host "Model: $onlineModel" -ForegroundColor Yellow
Write-Host "No local AI server needed. Press Ctrl+C to close."
while (`$true) { Start-Sleep -Seconds 60 }
"@ | Set-Content -Path $aiScript -Encoding UTF8
}

# ── BACKEND SCRIPT ──
@"
Set-Location '$root'
& '$python' -m uvicorn backend.main:app --reload --port $backendPort
"@ | Set-Content -Path $backendScript -Encoding UTF8

# ── FRONTEND SCRIPT ──
@"
Set-Location '$root\frontend'
`$env:Path = 'C:\Program Files\nodejs;' + `$env:Path
npm run dev
"@ | Set-Content -Path $frontendScript -Encoding UTF8

# ── LAUNCH WINDOWS TERMINAL ──
$wtArgs = @("-w", "0")
$tabs = [System.Collections.Generic.List[object]]::new()

if ($backendAlreadyRunning) {
    Write-Host "Backend already listening on port $backendPort; reusing it." -ForegroundColor Green
} else {
    $tabs.Add(@{ Title = "Backend"; Directory = $root; Script = $backendScript })
}
$tabs.Add(@{ Title = "AI Server ($aiMode)"; Directory = $root; Script = $aiScript })
$tabs.Add(@{ Title = "Frontend"; Directory = "$root\frontend"; Script = $frontendScript })

for ($i = 0; $i -lt $tabs.Count; $i++) {
    if ($i -gt 0) { $wtArgs += ";" }
    $tab = $tabs[$i]
    $wtArgs += @("new-tab", "--title", $tab.Title, "-d", $tab.Directory, "powershell", "-NoExit", "-File", $tab.Script)
}
& wt.exe @wtArgs
```

### 1.3 REPLACE `models/active_model.json`

```json
{
  "path": "D:\\Download\\Projects\\WBSL Bridge\\models\\onnx_models\\5\\sign_daily_lstm.onnx",
  "name": "sign_daily_lstm",
  "run": "onnx_models/5"
}
```

### 1.4 Install python-dotenv

```bash
cd "D:\Download\Projects\WBSL Bridge"
.venv\Scripts\python.exe -m pip install python-dotenv
```

---

## PHASE 2: BACKEND FEATURE EXTRACTION REWRITE

### 2.1 REPLACE `backend/pose.py`

```python
"""
backend/pose.py
Pose data for the new 98-dim architecture.
Only 8 pose points: shoulders(11,12), elbows(13,14), wrists(15,16), hips(23,24).
"""
import numpy as np

POSE_INDICES = [11, 12, 13, 14, 15, 16, 23, 24]
POSE_POINTS = len(POSE_INDICES)  # 8
POSE_DIM = POSE_POINTS * 4       # x, y, z, visibility = 32

# Compact indices into the 8-point array
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)

VIS_MIN = 0.5

# Skeleton edges for the 8-point body
POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (0, 1),              # shoulders
    (0, 2), (2, 4),     # left arm
    (1, 3), (3, 5),     # right arm
    (0, 6), (1, 7),     # torso sides
    (6, 7),             # hip line
]

# No face markers in the new architecture (NMM removed)
POSE_FACE_MARKERS: list[int] = []
POSE_FACE_PAIRS: list[tuple[int, int]] = []


def pose_from_landmarks(pose_landmarks) -> np.ndarray:
    """MediaPipe pose landmark list -> (8, 4) float32, un-normalised."""
    return np.array(
        [[pose_landmarks.landmark[i].x, pose_landmarks.landmark[i].y,
          pose_landmarks.landmark[i].z, pose_landmarks.landmark[i].visibility]
         for i in POSE_INDICES],
        np.float32,
    )
```

### 2.2 REPLACE `backend/extract.py`

This is the most critical file. It must produce **identical** 98-dim features to `model_training_zone/extract.py`. The ONNX model expects **RAW** features (standardization is baked into the network).

```python
"""
backend/extract.py
98-dim feature extraction for the new BiLSTM architecture.
Direct port of model_training_zone/extract.py feature math for real-time serving.

Feature layout (98 per frame):
  handshape:      66  (2 hands x 11 pts x 3)
  palm_dir_norm:  12  (2 hands x 6)
  wrist_pos:       4  (2 hands x 2)
  elbows:          4  (2 x 2)
  wrist_face_dist: 6  (2 hands x 3 face pts)
  head:            3  (mouth x, mouth y, head angle)
  hand_flags:      2  (L, R)
  duration:        1
  TOTAL:          98

Model input: (batch, 64, 98) float32 — RAW values, no external normalization.
"""
import contextlib
import ctypes
import math
import os
import sys
import time
import logging

os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["ABSL_MIN_LOG_LEVEL"] = "2"
os.environ.setdefault("MEDIAPIPE_DISABLE_LOGGING", "1")
logging.getLogger("absl").setLevel(logging.ERROR)

import numpy as np

# ── Suppress C++ stderr ──
@contextlib.contextmanager
def _suppress_c_stderr():
    old_fd = None
    stderr_file = None
    ucrt = None
    try:
        if sys.platform == "win32":
            ucrt = ctypes.CDLL("ucrtbase.dll")
            iob_func = getattr(ucrt, "__acrt_iob_func")
            iob_func.restype = ctypes.c_void_p
            iob_func.argtypes = [ctypes.c_uint]
            stderr_file = iob_func(2)
            old_fd = os.dup(2)
            ucrt.freopen.restype = ctypes.c_void_p
            ucrt.freopen.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_void_p]
            ucrt.freopen(b"NUL", b"w", stderr_file)
        else:
            old_fd = os.dup(2)
            devnull = os.open(os.devnull, os.O_WRONLY)
            os.dup2(devnull, 2)
            os.close(devnull)
    except Exception:
        pass
    try:
        yield
    finally:
        try:
            if sys.platform == "win32" and ucrt and stderr_file and old_fd is not None:
                ucrt.fflush.argtypes = [ctypes.c_void_p]
                ucrt.fflush(stderr_file)
                time.sleep(0.15)
                ucrt.fflush(stderr_file)
                os.dup2(old_fd, 2)
                os.close(old_fd)
            elif old_fd is not None:
                os.dup2(old_fd, 2)
                os.close(old_fd)
        except Exception:
            pass


import mediapipe as mp
from backend.pose import POSE_INDICES, P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP

# ── Constants (MUST match model_training_zone/extract.py) ──
N_FEATURES = 98
N_FRAMES = 64
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9
VIS_MIN = 0.5
HAND_MARGIN_SW = 0.05
REST_SHOULDER_FACTOR = 1.3
RESCUE_MAX_DIST = 0.30

AVATAR_FACE = [10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
               159, 145, 386, 374, 1, 61, 291, 0, 17]
FACE_CACHE_IDX = AVATAR_FACE + [13, 14]
FI = {idx: k for k, idx in enumerate(FACE_CACHE_IDX)}

# Span state machine constants
TRIGGER_FRAMES = 3
PRE_ROLL = 8
END_FRAMES = 10
KEEP_TAIL = 2
MAX_GAP = 5

# ── Initialize detectors ONCE ──
with _suppress_c_stderr():
    _holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=1, smooth_landmarks=True,
        refine_face_landmarks=False, min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    _hands_det = mp.solutions.hands.Hands(
        static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)


def _lm(landmarks, idx_list):
    return np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in idx_list], np.float32)


def frame_in_use(pose: np.ndarray, W: int, H: int) -> np.ndarray:
    """pose: (8,4) normalised x,y,z,vis -> bool[2] (left, right) hand in use."""
    out = np.zeros(2, bool)
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    if not (np.isfinite(sl).all() and np.isfinite(sr).all()):
        return out
    sw = float(np.linalg.norm(sl - sr))
    if sw < 1e-6:
        return out
    if pose[P_LHIP, 3] >= VIS_MIN and pose[P_RHIP, 3] >= VIS_MIN:
        rest_y = (pose[P_LHIP, 1] + pose[P_RHIP, 1]) / 2.0 * H
    else:
        rest_y = (sl[1] + sr[1]) / 2.0 + REST_SHOULDER_FACTOR * sw
    for h, wi in enumerate((P_LWR, P_RWR)):
        y = pose[wi, 1]
        if np.isfinite(y):
            out[h] = (rest_y - y * H) > HAND_MARGIN_SW * sw
    return out


def process_holistic_frame(frame_bgr: np.ndarray) -> dict | None:
    """Run MediaPipe Holistic on a single BGR frame.
    Returns raw landmark dict or None if no pose detected."""
    import cv2
    H_img, W_img = frame_bgr.shape[:2]
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    rgb.flags.writeable = False
    res = _holistic.process(rgb)

    pose = np.full((8, 4), np.nan, np.float32)
    pose[:, 3] = 0.0
    if res.pose_landmarks:
        lm = res.pose_landmarks.landmark
        for k, i in enumerate(POSE_INDICES):
            pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)

    hands = np.full((2, 21, 3), np.nan, np.float32)
    for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
        if hl:
            hands[h] = _lm(hl.landmark, range(21))

    # Rescue missed hands
    in_use = frame_in_use(pose, W_img, H_img)
    missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
    if missing:
        r2 = _hands_det.process(rgb)
        if r2.multi_hand_landmarks:
            best = {}
            for hl in r2.multi_hand_landmarks:
                pts = _lm(hl.landmark, range(21))
                for wi in (P_LWR, P_RWR):
                    w = pose[wi, :2]
                    if np.isfinite(w).all():
                        d = float(np.hypot(pts[0, 0] - w[0], pts[0, 1] - w[1]))
                        h_idx = 0 if wi == P_LWR else 1
                        if h_idx in missing and d < RESCUE_MAX_DIST:
                            if h_idx not in best or d < best[h_idx][0]:
                                best[h_idx] = (d, pts)
            for h, (_, pts) in best.items():
                hands[h] = pts

    face = np.full((len(FACE_CACHE_IDX), 3), np.nan, np.float32)
    f_ok = bool(res.face_landmarks)
    if f_ok:
        face = _lm(res.face_landmarks.landmark, FACE_CACHE_IDX)

    return {
        "pose": pose, "hands": hands, "face": face,
        "face_ok": f_ok, "W": W_img, "H": H_img,
    }


def frame_features(pose, hands21, face, in_use, W, H, duration) -> np.ndarray:
    """Build the 98-dim feature vector for one frame.
    Identical to model_training_zone/extract.py frame_features()."""
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    origin = (sl + sr) / 2.0
    sw = float(np.linalg.norm(sl - sr))
    if sw < 1.0:
        return np.zeros(N_FEATURES, np.float32)
    xax = (sl - sr) / sw
    yax = np.array([xax[1], -xax[0]])

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):
        d = pts[:, :2].astype(np.float64) * [W, H] - origin
        return np.stack([d @ xax / sw, d @ yax / sw, -pts[:, 2].astype(np.float64) * W / sw], 1)

    forehead = box_xy(face[FI[10], :2])
    mouth = box_xy((face[FI[13], :2] + face[FI[14], :2]) / 2.0)
    chin = box_xy(face[FI[152], :2])
    face_box = (forehead, mouth, chin)

    hs = np.zeros((2, 11, 3))
    pd = np.zeros((2, 6))
    wp = np.zeros((2, 2))
    wf = np.zeros((2, 3))
    flags = np.zeros(2)

    for h in (0, 1):
        if not in_use[h]:
            continue
        pts = hands21[h][HAND_IDX]
        if np.isnan(pts).any():
            continue
        box = box_pts(pts)
        rel = box - box[0]
        m = rel[H_MID_BASE]
        palm = float(np.linalg.norm(m)) + 1e-9
        phi = math.atan2(m[0], m[1])
        c, s = math.cos(phi), math.sin(phi)
        r = rel / palm
        hs[h] = np.stack([r[:, 0] * c - r[:, 1] * s, r[:, 0] * s + r[:, 1] * c, r[:, 2]], 1)
        pd[h, :3] = m / palm
        n = np.cross(rel[H_INDEX_BASE], rel[H_PINKY_BASE])
        if h == 0:
            n = -n
        pd[h, 3:] = n / (np.linalg.norm(n) + 1e-9)
        wp[h] = box[0, :2]
        for k in range(3):
            wf[h, k] = np.linalg.norm(box[0, :2] - face_box[k])
        flags[h] = 1.0

    elbows = np.concatenate([box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])])
    v = forehead - chin
    head = np.array([mouth[0], mouth[1], math.atan2(v[0], v[1]) if np.linalg.norm(v) > 1e-6 else 0.0])

    f = np.concatenate([hs.ravel(), pd.ravel(), wp.ravel(), elbows,
                        wf.ravel(), head, flags, [duration]])
    assert f.shape[0] == N_FEATURES
    return f.astype(np.float32)


def complete_mask_single(pose, hands, face_ok, in_use, W, H) -> bool:
    """Check if a single frame is complete (all requirements met)."""
    if not face_ok:
        return False
    vis = pose[:4, 3]  # shoulders + elbows
    if not (np.isfinite(vis).all() and (vis >= VIS_MIN).all()):
        return False
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    sw = float(np.linalg.norm(sl - sr))
    if not np.isfinite(sw) or sw <= 1.0:
        return False
    for h in (0, 1):
        if in_use[h]:
            if not np.isfinite(hands[h]).all():
                return False
            palm = np.linalg.norm((hands[h, 9, :2] - hands[h, 0, :2]) * [W, H])
            if not np.isfinite(palm) or palm <= 1.0:
                return False
    return True


def select_frames_from_span(features_with_idx: list) -> np.ndarray | None:
    """Select 64 frames from a completed span.
    features_with_idx: list of (relative_idx, feature_vector_98, is_complete)"""
    F = len(features_with_idx)
    if F == 0:
        return None

    complete = np.array([f[2] for f in features_with_idx], dtype=bool)
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur

    pos = np.floor(np.arange(N_FRAMES) * (F - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in pos:
        n = nxt[p]
        if n < 0:
            return None
        if n - p > MAX_GAP:
            return None
        chosen.append(n)

    return np.stack([features_with_idx[i][1] for i in chosen])
```

### 2.3 REPLACE `backend/streaming.py`

```python
"""
backend/streaming.py
Per-session state for continuous sign detection using the span-based state machine.
Matches model_training_zone/extract.py find_spans() logic.
"""
from collections import OrderedDict, deque
import numpy as np

from backend.extract import (
    N_FRAMES, N_FEATURES, TRIGGER_FRAMES, PRE_ROLL, END_FRAMES, KEEP_TAIL
)

MAX_SESSIONS = 64


class StreamSession:
    """One client's continuous sign detection state."""

    def __init__(self):
        self.state = "IDLE"
        self.up_count = 0
        self.down_count = 0
        self.last_up_idx = 0
        self.frame_index = 0

        # Pre-roll buffer (keeps frames before sign starts)
        self.pre_roll = deque(maxlen=PRE_ROLL + TRIGGER_FRAMES)

        # Frame storage during SIGN state
        self.frames = []       # list of raw frame data dicts
        self.features = []     # list of (relative_idx, feature_vector, is_complete)

        self.miss = 0


SESSIONS: "OrderedDict[str, StreamSession]" = OrderedDict()


def get_session(sid: str) -> StreamSession:
    sess = SESSIONS.get(sid)
    if sess is None:
        sess = StreamSession()
        SESSIONS[sid] = sess
    else:
        SESSIONS.move_to_end(sid)
    while len(SESSIONS) > MAX_SESSIONS:
        SESSIONS.popitem(last=False)
    return sess


def reset_session(sid: str) -> None:
    SESSIONS.pop(sid, None)


def update_span_state(sess: StreamSession, any_hand_up: bool, frame_data: dict,
                      feature_vec: np.ndarray, is_complete: bool) -> str:
    """Advance the state machine by one frame.
    Returns 'IDLE', 'SIGN', or 'SPAN_COMPLETE'."""
    sess.frame_index += 1

    if sess.state == "IDLE":
        sess.pre_roll.append((frame_data, feature_vec, is_complete))
        if any_hand_up:
            sess.up_count += 1
            if sess.up_count >= TRIGGER_FRAMES:
                sess.state = "SIGN"
                sess.down_count = 0
                sess.frames = list(sess.pre_roll)
                sess.features = [(i, f, c) for i, (_, f, c) in enumerate(sess.frames)]
                sess.last_up_idx = len(sess.frames) - 1
                return "SIGN"
        else:
            sess.up_count = 0
        return "IDLE"

    else:  # SIGN state
        sess.frames.append(frame_data)
        rel_idx = len(sess.frames) - 1
        sess.features.append((rel_idx, feature_vec, is_complete))

        if any_hand_up:
            sess.last_up_idx = rel_idx
            sess.down_count = 0
        else:
            sess.down_count += 1
            if sess.down_count >= END_FRAMES:
                end_idx = min(sess.last_up_idx + KEEP_TAIL, rel_idx)
                sess.frames = sess.frames[:end_idx + 1]
                sess.features = sess.features[:end_idx + 1]
                sess.state = "IDLE"
                sess.up_count = 0
                sess.down_count = 0
                sess.pre_roll.clear()
                return "SPAN_COMPLETE"
        return "SIGN"
```

---

## PHASE 3: NMM REMOVAL → EMOTION ENGINE

### 3.1 CREATE `backend/emotion_engine.py`

Extract ONLY the emotion detection code from `backend/nmm.py`. Remove all NMM geometry logic.

```python
"""
backend/emotion_engine.py
Emotion detection ONLY. All NMM geometry markers have been removed.
The ViT emotion classifier remains untouched.
"""
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ROOT = Path(__file__).resolve().parent.parent
VIT_PATH = ROOT / "models" / "emotion" / "vit_emotion.onnx"

_vit_session = None
_vit_input_name = None
if VIT_PATH.exists():
    try:
        _vit_session = ort.InferenceSession(str(VIT_PATH), providers=["CPUExecutionProvider"])
        _vit_input_name = _vit_session.get_inputs()[0].name
    except Exception as exc:
        print(f"[Emotion] Could not load ViT emotion model: {exc}")

EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
NORM_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
NORM_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

_last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
_frame_counter = 0
EMOTION_MIN_CONFIDENCE = 0.35


def predict_emotion(face_bgr: np.ndarray) -> dict:
    if _vit_session is None or face_bgr is None or face_bgr.size == 0:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
    try:
        img = cv2.resize(face_bgr, (224, 224))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
        img = (img - NORM_MEAN) / NORM_STD
        img = np.transpose(img, (2, 0, 1))[np.newaxis]
        outputs = _vit_session.run(None, {_vit_input_name: img})
        logits = outputs[0][0]
        exp_logits = np.exp(logits - np.max(logits))
        probs = exp_logits / exp_logits.sum()
        scores = {EMOTION_LABELS[i]: round(float(probs[i]), 3) for i in range(len(EMOTION_LABELS))}
        idx = int(np.argmax(probs))
        dom = EMOTION_LABELS[idx]
        conf = float(probs[idx])
        if dom != "neutral" and conf < EMOTION_MIN_CONFIDENCE:
            dom = "neutral"
        return {"dominant": dom, "confidence": round(conf, 3), "scores": scores}
    except Exception:
        return {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}


def detect_emotion_from_frame(frame_bgr: np.ndarray) -> dict:
    """Run emotion detection on a frame. Called every 4th frame."""
    global _frame_counter, _last_emotion
    _frame_counter += 1
    if _frame_counter % 4 == 0 or _last_emotion.get("dominant") == "neutral":
        try:
            import mediapipe as mp
            from backend.extract import _suppress_c_stderr
            h, w, _ = frame_bgr.shape
            rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            with _suppress_c_stderr():
                fm = mp.solutions.face_mesh.FaceMesh(
                    static_image_mode=True, max_num_faces=1, min_detection_confidence=0.5)
            results = fm.process(rgb)
            fm.close()
            if results.multi_face_landmarks:
                lm = results.multi_face_landmarks[0].landmark
                xs = [lm[i].x for i in range(468)]
                ys = [lm[i].y for i in range(468)]
                min_x = max(0, int(min(xs) * w) - 10)
                max_x = min(w, int(max(xs) * w) + 10)
                min_y = max(0, int(min(ys) * h) - 10)
                max_y = min(h, int(max(ys) * h) + 10)
                if max_x > min_x and max_y > min_y:
                    face_crop = frame_bgr[min_y:max_y, min_x:max_x]
                    _last_emotion = predict_emotion(face_crop)
        except Exception:
            pass
    return _last_emotion


def emotion_available() -> bool:
    return _vit_session is not None


def reset_emotion_state():
    global _last_emotion
    _last_emotion = {"dominant": "neutral", "confidence": 1.0, "scores": {"neutral": 1.0}}
```

### 3.2 DELETE `backend/nmm.py`

### 3.3 Update `backend/llm_engine.py`

In `build_user_message()`, **remove the entire `nmm` block**. Replace with emotion-only:

**Find this block and DELETE it:**
```python
    nmm = meta.get("nmm") or {}
    if isinstance(nmm, dict):
        if nmm.get("negation"):
            lines.append("- NEGATION: head shake detected. The signer negated it.")
        # ... all NMM lines ...
```

**Keep only the emotion block:**
```python
    gloss_with_affect = gloss_text
    emotion = meta.get("emotion")
    if isinstance(emotion, dict):
        dominant = emotion.get("dominant")
        if dominant in {"happy", "sad", "angry", "neutral", "surprise", "fear", "disgust"}:
            gloss_with_affect = f"{gloss_text} {{{dominant}-face}}"
```

### 3.4 Update `get_ai_config()` in `backend/llm_engine.py`

Replace the entire `get_ai_config()` function:

```python
def get_ai_config() -> dict:
    mode = _env("AI_MODE", "offline").lower()
    if mode not in ("online", "offline"):
        raise ValueError(f"AI_MODE must be 'online' or 'offline', got '{mode}'")

    if mode == "online":
        base_url = _env("AI_ONLINE_BASE_URL")
        api_key = _env("AI_ONLINE_API_KEY")
        model = _env("AI_ONLINE_MODEL_NAME")
    else:
        base_url = _env("AI_OFFLINE_BASE_URL")
        api_key = _env("AI_OFFLINE_API_KEY")
        model = _env("AI_OFFLINE_MODEL_NAME")

    if not base_url:
        raise ValueError(f"AI_{mode.upper()}_BASE_URL is empty. Set it in .env.")
    if not model:
        raise ValueError(f"AI_{mode.upper()}_MODEL_NAME is empty. Set it in .env.")

    is_local = any(h in base_url for h in _KEYLESS_HOSTS)
    if not api_key:
        api_key = "no-key-required" if is_local else ""

    return {
        "base_url": base_url.rstrip("/"),
        "api_key": api_key,
        "model": model,
        "is_local": is_local,
        "provider": "local" if is_local else "cloud",
        "mode": mode,
        "configured": bool(api_key),
        "stream": _env_bool("AI_STREAM", True),
        "reasoning": _env_bool("AI_REASONING", True),
        "reasoning_effort": _env("AI_REASONING_EFFORT", "low"),
        "timeout": float(_env("AI_TIMEOUT", "180")),
    }
```

Also add `"mode"` to `_base_result()`:
```python
def _base_result(cfg: dict, **extra) -> dict:
    result = {
        "bengali_text": None,
        "status": "success",
        "engine": cfg["model"],
        "provider": cfg["provider"],
        "mode": cfg.get("mode", "offline"),
        "endpoint": cfg["base_url"],
        "tokens_used": 0,
    }
    result.update(extra)
    return result
```

---

## PHASE 5: BACKEND `main.py` OVERHAUL

This is the largest file. **REPLACE `backend/main.py` entirely.** Key changes:
- Model registry expects 98-dim input, 64 frames
- NMM endpoints removed
- Contributions endpoints removed
- Sign span detection uses new state machine
- Simulation endpoint serves avatar data
- Admin panels read `daily_report.json` and `confusion_matrix.json`

Due to the extreme length, here are the **critical sections** that differ from the old code. The rest (TTS, STT, NLG endpoints) stays structurally the same but with NMM references removed.

### 5.1 Top-level imports (replace old imports)

```python
from backend.extract import (
    process_holistic_frame, frame_features, frame_in_use,
    complete_mask_single, select_frames_from_span,
    N_FEATURES, N_FRAMES,
)
from backend.emotion_engine import detect_emotion_from_frame, emotion_available
from backend.streaming import get_session, reset_session, update_span_state, StreamSession
from backend.llm_engine import (
    generate_bengali, generate_bengali_with_uncertainty, is_llm_available,
    get_ai_config, stream_bengali, break_into_glosses,
)
```

### 5.2 Constants (replace old SERVABLE_WIDTHS, SEQ_T)

```python
SEQ_T = 64
FEATURE_WIDTH = 98
NON_SIGN_CLASSES = {"NONE", "BACKGROUND"}
```

### 5.3 Model Registry `_discover_models()` — replace the bundled sequence check

Remove the old `npy` sequence validation. The new model uses `avatar/` folder instead:

```python
# In _discover_models(), replace the missing_sequences check with:
avatar_dir = folder / "avatar"
has_avatar = avatar_dir.is_dir()

# Remove the old SERVABLE_WIDTHS check. Replace with:
if input_width is not None and input_width != FEATURE_WIDTH:
    print(f"[WBSL Backend] Skipping {onnx_file}: input width {input_width} != {FEATURE_WIDTH}")
    continue

# Add to the found.append dict:
"has_avatar": has_avatar,
"report": {},  # loaded lazily
"confusion": {},
```

### 5.4 Load report/confusion in registry

After loading the model, add:

```python
# In ModelRegistry.reload(), after loading classes:
report_file = Path(target["path"]).parent / "daily_report.json"
conf_file = Path(target["path"]).parent / "confusion_matrix.json"
self.report = {}
self.confusion = {}
if report_file.exists():
    try:
        self.report = json.loads(report_file.read_text(encoding="utf-8"))
    except Exception:
        pass
if conf_file.exists():
    try:
        self.confusion = json.loads(conf_file.read_text(encoding="utf-8"))
    except Exception:
        pass
```

### 5.5 `_available_model_classes()` — remove npy check

```python
def _available_model_classes():
    """Vocabulary that the active model can recognize."""
    return [
        label for label in REGISTRY.active_classes
        if label not in NON_SIGN_CLASSES
    ]
```

### 5.6 `/api/stream/frame` — complete replacement

```python
@app.post("/api/stream/frame")
async def stream_frame(session_id: str = "default", file: UploadFile = File(...)):
    if REGISTRY.session is None:
        raise HTTPException(409, "No model loaded.")

    raw = await file.read()
    fr = cv2.imdecode(np.frombuffer(raw, np.uint8), cv2.IMREAD_COLOR)
    if fr is None:
        raise HTTPException(400, "Could not decode image")

    sess = get_session(session_id)
    H_img, W_img = fr.shape[:2]

    result = process_holistic_frame(fr)
    if result is None:
        state = update_span_state(sess, False, None,
                                  np.zeros(N_FEATURES, np.float32), False)
        return {"ready": False, "buffered": len(sess.frames),
                "state": state, "detail": "no_pose"}

    pose = result["pose"]
    hands = result["hands"]
    face = result["face"]
    face_ok = result["face_ok"]

    in_use = frame_in_use(pose, W_img, H_img)
    any_up = bool(in_use.any())

    duration_est = len(sess.frames) / 30.0 if sess.frames else 1.0
    feat = frame_features(pose, hands, face, in_use, W_img, H_img, duration_est)
    is_complete = complete_mask_single(pose, hands, face_ok, in_use, W_img, H_img)

    state = update_span_state(sess, any_up, result, feat, is_complete)

    emotion = detect_emotion_from_frame(fr)

    if state == "SPAN_COMPLETE":
        clip = select_frames_from_span(sess.features)
        sess.frames = []
        sess.features = []
        sess.pre_roll.clear()

        if clip is None:
            return {"ready": False, "buffered": 0, "state": "IDLE",
                    "detail": "incomplete_span", "emotion": emotion}

        logits = REGISTRY.session.run(
            None, {REGISTRY.input_name: clip[np.newaxis].astype(np.float32)})[0][0]
        probs = np.exp(logits - logits.max())
        probs /= probs.sum()
        order = np.argsort(probs)[::-1][:3]

        top_prob = float(probs[order[0]])
        margin = float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0
        not_sure = top_prob < 0.5 or margin < 0.15

        return {
            "ready": True,
            "label": REGISTRY.active_classes[int(order[0])] if not not_sure else "NOT_SURE",
            "confidence": top_prob,
            "margin": margin,
            "frames_used": N_FRAMES,
            "state": "IDLE",
            "emotion": emotion,
            "top3": [{"label": REGISTRY.active_classes[int(i)],
                      "confidence": float(probs[i])} for i in order],
        }

    return {"ready": False, "buffered": len(sess.frames),
            "state": state, "emotion": emotion}
```

### 5.7 `/api/simulation/frames` — serve avatar data

```python
@app.get("/api/simulation/frames")
def simulation_frames(label: str = ""):
    """Serve avatar data for the 3D simulation."""
    run_dir = _active_run_dir()
    if not run_dir:
        raise HTTPException(404, "No active model")

    normalized = label.upper().replace(" ", "_")
    avatar_dir = run_dir / "avatar" / normalized
    if not avatar_dir.is_dir():
        raise HTTPException(404, f"No avatar data for '{label}'")

    try:
        hands = np.load(avatar_dir / "hands.npy")   # (F, 42, 3)
        pose = np.load(avatar_dir / "pose.npy")      # (F, 8, 4)
        t = np.load(avatar_dir / "t.npy")            # (F,)

        result = {
            "frames": hands.tolist(),
            "pose": pose.tolist(),
            "points": 42,
            "count": int(len(hands)),
            "source": f"avatar:{normalized}",
            "width": FEATURE_WIDTH,
        }

        # Load face if available
        face_path = avatar_dir / "face.npy"
        if face_path.exists():
            face = np.load(face_path)  # (F, 19, 3)
            result["face_avatar"] = face.tolist()

        return result
    except Exception as e:
        raise HTTPException(500, f"Error loading avatar data: {e}")
```

### 5.8 Admin model metadata endpoints

```python
@app.get("/api/admin/model/report")
def admin_model_report():
    return REGISTRY.report or {}

@app.get("/api/admin/model/confusion")
def admin_model_confusion():
    return REGISTRY.confusion or {}

@app.get("/api/admin/model/avatar-list")
def admin_avatar_list():
    run_dir = _active_run_dir()
    if not run_dir:
        return {"glosses": []}
    avatar_dir = run_dir / "avatar"
    if not avatar_dir.is_dir():
        return {"glosses": []}
    glosses = sorted([d.name for d in avatar_dir.iterdir() if d.is_dir()])
    return {"glosses": glosses}
```

### 5.9 `/api/system/health` — update contract

```python
"contract": {
    "kind": "temporal",
    "input_rank": 3,
    "frames": SEQ_T,
    "feature_width": FEATURE_WIDTH,
    "feature_kind": "shoulder_box_98",
    "endpoint": "/api/stream/frame",
},
"emotion_available": emotion_available(),
"ai_mode": ai.get("mode", "offline"),
```

### 5.10 NLG endpoint — remove `nmm` from request model

```python
class NLGRequest(BaseModel):
    gloss: str
    emotion: dict | None = None

    def meta(self) -> dict:
        return {"emotion": self.emotion}
```

### 5.11 REMOVE entirely from `main.py`:
- All `/api/nmm/config` endpoints
- All `/api/contributions/*` endpoints
- All `/api/admin/contributions/*` endpoints
- `_load_manifest()`, `_write_manifest()`, `_sample_counts_by_label()`, `_refresh_catalog_sample_counts()`
- `DATASET_DIR`, `SAMPLES_DIR`, `MANIFEST_PATH` constants
- `resample_feature_width()` function
- `resample_arr()` function
- `STREAM_WINDOWS`, `STREAM_INFER_EVERY`, `IDLE_MOTION_GATE`, `IDLE_SPREAD_GATE` constants
- `/api/predict/frame` endpoint (static frame prediction)
- `/api/predict/clip` endpoint (old clip prediction)
- `/api/predict/stream` endpoint (old batch stream)
- `/api/contributions/needs-data` endpoint
- `/api/dataset/index` endpoint
- All `HANDS_DIM`, `HOLISTIC_DIM` references
- All `SERVABLE_WIDTHS` references

---

## PHASE 6: FRONTEND NMM UI REMOVAL

### 6.1 DELETE `frontend/src/components/sign/NmmThresholdPanel.tsx`

### 6.2 DELETE `frontend/src/components/pipeline/PipelineStatus.tsx`

### 6.3 UPDATE `frontend/src/app/sign-to-text/page.tsx`

**Remove these imports:**
```tsx
// DELETE this import
import { NmmThresholdPanel, DEFAULT_ALL, DEFAULT_MARKER_GATES, COMMIT_STORAGE_KEY, ... } from "...";
```

**Remove these state variables:**
```tsx
// DELETE: nmmFlags, markerGates, thresholds, savedThresholds, thresholdsRef
// DELETE: repeatBlocked, candidateRef, lastAppendRef, idleSinceRef
// DELETE: streamFallbackRef, streamUnavailable
```

**Update `StreamResult` interface:**
```tsx
interface StreamResult {
  ready: boolean;
  label?: string;
  confidence?: number;
  margin?: number;
  emotion?: EmotionResult | null;
  detail?: string;
  buffered?: number;
  state?: string;
  top3?: { label: string; confidence: number }[];
}
```

**Update `DetectedSign` interface:**
```tsx
interface DetectedSign {
  gloss: string;
}
```

**Remove the NMM badge group section** (the div with "Non-Manual Markers" heading).

**Remove `NmmThresholdPanel` from the recognition column header.**

**Update `buildGlossString` to remove NMM annotations:**
```tsx
const buildGlossString = (history: DetectedSign[]) => {
  if (history.length === 0) return "";
  return history.map((h) => `[${h.gloss.toLowerCase()}]`).join(" + ");
};
```

**Update `commitFromStream` to remove NMM logic.** Keep only confidence/margin threshold and emotion.

**Update NLG request body:**
```tsx
body: JSON.stringify({ gloss, emotion }),
```

### 6.4 UPDATE `frontend/src/lib/types.ts`

**DELETE the `NMMFlags` interface entirely.**

### 6.5 UPDATE `frontend/src/store/recording-store.ts`

**DELETE this file entirely** (contributions only).

---

## PHASE 7: FRONTEND CONTRIBUTIONS REMOVAL

### 7.1 DELETE these files/folders:
- `frontend/src/app/contribute/` (entire folder)
- `frontend/src/services/contributions.ts`
- `frontend/src/components/recording/PrivacyGate.tsx`
- `frontend/src/components/recording/UploadRecovery.tsx`
- `frontend/src/components/verification/EvidencePanel.tsx`
- `frontend/src/store/recording-store.ts`
- `frontend/src/hooks/useRecording.ts`

### 7.2 REPLACE `frontend/src/app/admin/contributions/page.tsx`

```tsx
"use client";
import React from "react";

export default function AdminContributionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">PLANNED FEATURE</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Community Contributions
        </h1>
      </div>
      <div className="p-8 bg-surface border border-border rounded-lg text-center space-y-3">
        <div className="text-4xl">🚧</div>
        <h2 className="text-lg font-semibold text-text-primary">Coming Soon</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Community contribution functionality is planned for a future release.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded bg-surface-elevated border border-border text-text-muted text-xs font-mono cursor-not-allowed opacity-50"
        >
          Contributions (Unavailable)
        </button>
      </div>
    </div>
  );
}
```

### 7.3 UPDATE `frontend/src/lib/constants.ts`

Remove the Contribute link:

```tsx
export const NAVIGATION_LINKS = [
  { label: "Text → Sign", href: "/text-to-sign" },
  { label: "Sign → Text", href: "/sign-to-text" },
  { label: "About", href: "/about" },
];
```

### 7.4 UPDATE `frontend/src/components/layout/AppSidebar.tsx`

Remove the `/contribute` entry from `navigationIcons`:

```tsx
const navigationIcons: Record<string, LucideIcon> = {
  "/text-to-sign": Languages,
  "/sign-to-text": Video,
  "/about": Info,
};
```

### 7.5 UPDATE `frontend/src/app/admin/page.tsx`

Replace the contributions Link with a disabled div:

```tsx
<div className="p-6 rounded-lg bg-surface border border-border opacity-50 cursor-not-allowed flex flex-col justify-between space-y-4">
  <div>
    <div className="w-10 h-10 rounded bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-3">
      <CheckSquare size={20} />
    </div>
    <h3 className="font-semibold text-text-primary">Contribution Verification</h3>
    <p className="text-xs text-text-secondary mt-1">Planned future feature. Not currently active.</p>
  </div>
  <div className="flex items-center space-x-1 text-xs font-mono text-text-muted">
    <span>Coming Soon</span>
  </div>
</div>
```

---

## PHASE 8: FRONTEND SIMULATION UPDATE

### 8.1 UPDATE `frontend/src/lib/pose.ts`

```typescript
/**
 * frontend/src/lib/pose.ts
 * Client-side mirror of backend/pose.py — NEW 8-point architecture.
 */
export const POSE_POINTS = 8;

export const POSE_BODY_PAIRS: [number, number][] = [
  [0, 1],              // shoulders
  [0, 2], [2, 4],     // left arm
  [1, 3], [3, 5],     // right arm
  [0, 6], [1, 7], [6, 7], // torso
];

export const POSE_FACE_MARKERS: number[] = [];
export const POSE_FACE_PAIRS: [number, number][] = [];

export type PosePoint = [number, number, number, number];
```

### 8.2 UPDATE `frontend/src/components/simulation/LandmarkSimulation.tsx`

**Update `BODY_GUIDE` to 8 points:**

```typescript
const BODY_GUIDE: PosePoint[] = EMPTY_POSE.map((point) => [...point] as PosePoint);
const setGuidePoint = (index: number, x: number, y: number) => {
  BODY_GUIDE[index] = [x, y, 0, 1];
};
// 8-point body guide
setGuidePoint(0, -0.7, -1.25);  // left shoulder
setGuidePoint(1, 0.7, -1.25);   // right shoulder
setGuidePoint(2, -1.1, -0.65);  // left elbow
setGuidePoint(3, 1.1, -0.65);   // right elbow
setGuidePoint(4, -1.35, 0);     // left wrist
setGuidePoint(5, 1.35, 0);      // right wrist
setGuidePoint(6, -0.45, 0.55);  // left hip
setGuidePoint(7, 0.45, 0.55);   // right hip
```

**Update `GUIDE_BODY_PAIRS` and `POSE_SKELETON_PAIRS`:**

```typescript
const GUIDE_BODY_PAIRS = POSE_BODY_PAIRS;
const POSE_SKELETON_PAIRS = POSE_BODY_PAIRS;
```

**Update `RIG_POSE_PAIRS` and `RIG_GUIDE_PAIRS`:**

```typescript
const RIG_POSE_PAIRS: PairList = POSE_SKELETON_PAIRS;
const RIG_GUIDE_PAIRS: PairList = GUIDE_BODY_PAIRS;
```

**Update `isHandStub` and `isLowerBodyBone`:**

```typescript
// Remove these functions — no hand stubs or lower body filtering needed for 8 points
const RIG_POSE_PAIRS: PairList = POSE_BODY_PAIRS;
const RIG_GUIDE_PAIRS: PairList = POSE_BODY_PAIRS;
```

**Update pose index references throughout the file:**
- All `pose[11 * 4 + ...]` → `pose[0 * 4 + ...]` (left shoulder)
- All `pose[12 * 4 + ...]` → `pose[1 * 4 + ...]` (right shoulder)
- All `pose[23 * 4 + ...]` → `pose[6 * 4 + ...]` (left hip)
- All `pose[24 * 4 + ...]` → `pose[7 * 4 + ...]` (right hip)

**Update `DhutiRig.tsx`:**
- `vis(23)` → `vis(6)`, `vis(24)` → `vis(7)`
- `P[23 * 4]` → `P[6 * 4]`, etc.

**Update `AlpanaStage.tsx`:**
- `pose[23 * 4 + 3]` → `pose[6 * 4 + 3]`
- `pose[24 * 4 + 3]` → `pose[7 * 4 + 3]`

**Update `TorsoRig` in `LandmarkSimulation.tsx`:**
- `P[11 * 4 + 3]` → `P[0 * 4 + 3]`
- `P[12 * 4 + 3]` → `P[1 * 4 + 3]`
- `P[23 * 4 + 3]` → `P[6 * 4 + 3]`
- `P[24 * 4 + 3]` → `P[7 * 4 + 3]`

### 8.3 UPDATE `frontend/src/components/simulation/DhutiRig.tsx`

Replace all pose index references:
```typescript
// OLD: vis(23) && vis(24)
// NEW: vis(6) && vis(7)

// OLD: P[23 * 4], P[24 * 4]
// NEW: P[6 * 4], P[7 * 4]
```

### 8.4 UPDATE `frontend/src/components/simulation/AlpanaStage.tsx`

Replace all pose index references:
```typescript
// OLD: pose[23 * 4 + 3], pose[24 * 4 + 3]
// NEW: pose[6 * 4 + 3], pose[7 * 4 + 3]
```

---

## PHASE 9: ADMIN PANELS UPDATE

### 9.1 UPDATE `frontend/src/app/admin/models/page.tsx`

```typescript
// REPLACE:
// const SERVABLE_WIDTHS = [126, 258];
// WITH:
const SERVABLE_WIDTHS = [98];

// UPDATE featureLabel:
const featureLabel = (m: ModelEntry) => {
  if (m.temporal) return "BiLSTM temporal · 98-dim shoulder box";
  return `input ${m.input_width ?? "?"}-dim`;
};
```

### 9.2 UPDATE `frontend/src/app/admin/settings/page.tsx`

```typescript
const rows: [string, string][] = [
  ["API PORT", "8200"],
  ["ACTIVE MODEL", `${health?.active_model ?? "—"} (${health?.model_run ?? "—"})`],
  ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? 98}-dim · ${health?.contract?.frames ?? 64} frames`],
  ["ARCHITECTURE", "BiLSTM + Attention (98-dim shoulder box)"],
  ["SIGN VOCABULARY", String(health?.vocabulary_classes ?? 0)],
  ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
  ["AI MODE", health?.ai_mode ?? "offline"],
  ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
];
```

---

## PHASE 10: MODEL FILES CLEANUP

### 10.1 DELETE these folders:
- `models/onnx_models/1/`
- `models/onnx_models/2/`
- `models/onnx_models/3/`
- `models/onnx_models/4/`

### 10.2 KEEP:
- `models/onnx_models/5/` (the new model)
- `models/emotion/` (ViT emotion model)

### 10.3 DELETE `backend/__init__.py` — **NO, KEEP IT.** It is needed for Python package imports.

---

## PHASE 11: FILES TO DELETE (COMPLETE LIST)

| File/Folder | Reason |
|-------------|--------|
| `backend/nmm.py` | Replaced by `emotion_engine.py` |
| `frontend/src/components/sign/NmmThresholdPanel.tsx` | NMM removed |
| `frontend/src/components/pipeline/PipelineStatus.tsx` | NMM pipeline removed |
| `frontend/src/app/contribute/` | Contributions removed |
| `frontend/src/services/contributions.ts` | Contributions removed |
| `frontend/src/components/recording/PrivacyGate.tsx` | Contributions removed |
| `frontend/src/components/recording/UploadRecovery.tsx` | Contributions removed |
| `frontend/src/components/verification/EvidencePanel.tsx` | Contributions removed |
| `frontend/src/store/recording-store.ts` | Contributions removed |
| `frontend/src/hooks/useRecording.ts` | Contributions removed |
| `models/onnx_models/1/` | Old model |
| `models/onnx_models/2/` | Old model |
| `models/onnx_models/3/` | Old model |
| `models/onnx_models/4/` | Old model |

---

## PHASE 12: VERIFICATION CHECKLIST

### Backend:
- [ ] `python -c "from backend.main import app"` — no import errors
- [ ] `uvicorn backend.main:app --port 8200` starts cleanly
- [ ] `GET /api/system/health` returns `feature_width: 98`, `frames: 64`
- [ ] `GET /api/admin/models` shows only Model 5
- [ ] `GET /api/admin/model/report` returns training report
- [ ] `POST /api/stream/frame` with a JPEG returns `{"ready": false, ...}`
- [ ] `GET /api/simulation/frames?label=HELLO` returns avatar data
- [ ] `GET /api/nlg/status` shows correct AI mode
- [ ] No references to NMM in any response
- [ ] No contributions endpoints exist
- [ ] `grep -r "nmm" backend/` returns only `emotion_engine.py` (no NMM)
- [ ] `grep -r "126\|258\|HOLISTIC_DIM\|HANDS_DIM" backend/` returns nothing

### Frontend:
- [ ] `npm run build` completes without errors
- [ ] Sign-to-Text page loads without NMM panel
- [ ] Emotion panel still shows
- [ ] Admin > Models shows Model 5 only
- [ ] Admin > Contributions shows "Coming Soon" disabled page
- [ ] Admin > Settings shows 98-dim, 64 frames
- [ ] Text-to-Sign page works
- [ ] No console errors about missing modules
- [ ] `grep -r "NmmThresholdPanel\|nmm\|NMM" frontend/src/` returns nothing
- [ ] `grep -r "contribution\|contribute" frontend/src/` returns only disabled placeholder

### LLM:
- [ ] `.env` with `AI_MODE=offline` → KoboldCpp starts with Nemotron model
- [ ] `.env` with `AI_MODE=online` → No local server, uses OpenRouter
- [ ] Switching `AI_MODE` and restarting changes behavior
- [ ] No automatic fallback between modes

### model_training_zone:
- [ ] `git diff model_training_zone/` shows NO changes (or verify file hashes)

---

## CRITICAL INVARIANTS

1. **Feature vector is 98-dim.** Not 126, not 258.
2. **Model input is `(batch, 64, 98)` float32.** Feed RAW features. Standardization is inside the ONNX graph.
3. **Shoulder box coordinate system.** Origin at shoulder midpoint, y-axis up, unit = shoulder width.
4. **Sign span state machine.** IDLE → SIGN → end, with TRIGGER=3, PRE_ROLL=8, END=10, KEEP_TAIL=2.
5. **`model_training_zone/` is read-only.** Never modify.
6. **Emotion detection survives.** ViT model stays. Only NMM geometry markers removed.
7. **OpenAI-compatible API.** Both online and offline use the same client interface.
8. **No automatic mode fallback.** If selected AI mode fails, show error. Do NOT switch.