#!/usr/bin/env python3
"""
extract.py - ISL sign recognition: video -> (64, 98) feature sequences.

    py extract.py [--workers N] [--no-cache] [--width PX]

Reads every video in every gloss folder under ISL_VIDEO/, finds the sign span
(IDLE -> SIGN -> end state machine), selects 64 frames, computes 98 features per
frame and writes one  <GLOSS>.npy  (N, 64, 98)  per gloss into a NEW numeric id:

    model_training_zone/dataset_train/features/<id>/
        <GLOSS>.npy
        extract_report.json

Landmark cache (model_training_zone/dataset_train/cache/*.npz) holds the raw
per-frame landmarks (21-pt hands, 8 pose points, 21 face points, timestamps),
keyed by (path, size, mtime, cache-version). avatar_extract.py can reuse it via
load_or_detect() so videos are never detected twice. Feature building always
re-runs, so every id is a complete, independent extraction.

Performance / clean-console design:
  * MediaPipe + TFLite + absl + protobuf logging is silenced via env flags set
    BEFORE mediapipe is imported, and pool workers redirect fd 1/2 to devnull,
    so the progress line is the only terminal output (parent keeps console).
  * Each worker process creates Holistic/Hands ONCE (process initializer) and
    resets tracking between videos - no per-video model reload.
  * Workers default to min(16, cpu_count); override with --workers N or
    EXTRACT_WORKERS=N. Tune N until CPU sits near 90-100 %.
  * ETA uses a sliding window over the last finished videos (stable estimate).

Conventions (reuse the SAME helpers in test_model.py):
  * Frames are NOT mirrored. index 0 = person's left hand (Holistic left_hand,
    pose 15), index 1 = right hand.
  * Shoulder box: origin = shoulder midpoint; x-axis = pose-12 -> pose-11
    shoulder (image-right when the signer faces the camera); y-axis = up in the
    image; unit = shoulder width; z = -MediaPipe z (towards camera positive).
  * Rest line = hip line (both hips visible) else shoulder-mid + 1.3 x width.
    A hand is "in use" when its POSE wrist is above the rest line by more than
    0.05 shoulder widths.
"""
from __future__ import annotations

# --- silence C++/TF/absl logging BEFORE anything loads MediaPipe ------------ #
import os
os.environ.setdefault("GLOG_minloglevel", "2")        # glog: errors only
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")    # TF/TFLite: no INFO spam
os.environ.setdefault("MEDIAPIPE_DISABLE_LOGGING", "1")

import warnings
warnings.filterwarnings("ignore", category=UserWarning)          # protobuf SymbolDatabase
warnings.filterwarnings("ignore", category=DeprecationWarning)

import argparse
import atexit
import hashlib
import json
import math
import re
import sys
import time
import traceback
from collections import Counter, defaultdict, deque
from concurrent.futures import ProcessPoolExecutor, as_completed
from concurrent.futures.process import BrokenProcessPool
from datetime import datetime
from pathlib import Path

import numpy as np

# --------------------------------------------------------------------------- #
# Paths
# --------------------------------------------------------------------------- #
BASE_DIR = Path(__file__).resolve().parent


def _find_dataset_dir() -> Path:
    """Locate ISL_VIDEO whether this script sits in the project root or inside
    model_training_zone (searches this folder and every parent)."""
    tail = Path("dataset") / "Indian Sign Language_Dataset" / "ISL_VIDEO"
    for anchor in (BASE_DIR, *BASE_DIR.parents):
        for cand in (anchor / "model_training_zone" / tail, anchor / tail,
                     anchor / "Indian Sign Language_Dataset" / "ISL_VIDEO"):
            if cand.is_dir():
                return cand.resolve()
    return BASE_DIR / "model_training_zone" / tail  # default; discover() reports it missing


def _find_train_zone(dataset_dir: Path) -> Path:
    for p in (dataset_dir, *dataset_dir.parents):
        if p.name.lower() == "model_training_zone":
            return p
    return dataset_dir.parents[2] if len(dataset_dir.parents) > 2 else BASE_DIR


DATASET_DIR = _find_dataset_dir()
TRAIN_ZONE = _find_train_zone(DATASET_DIR)
FEATURES_ROOT = TRAIN_ZONE / "dataset_train" / "features"
CACHE_DIR = TRAIN_ZONE / "dataset_train" / "cache"

VIDEO_EXTS = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v", ".mpg", ".mpeg", ".wmv"}

# --------------------------------------------------------------------------- #
# Parameters
# --------------------------------------------------------------------------- #
N_FRAMES = 64
N_FEATURES = 98
MAX_GAP = 5                 # reject if a position needs a frame > 5 frames later
VIS_MIN = 0.5               # shoulder / elbow / hip visibility
HAND_MARGIN_SW = 0.05       # wrist above rest line by > 0.05 shoulder widths
REST_SHOULDER_FACTOR = 1.3  # fallback rest line = shoulder-mid + 1.3 * width

TRIGGER_FRAMES = 3          # raised frames needed to start a sign
PRE_ROLL = 8                # frames kept before the first raised frame
END_FRAMES = 10             # hands-down frames needed to end a sign
KEEP_TAIL = 2               # hands-down frames kept after the last raised one

MAX_FRAME_WIDTH = 960       # wider frames are downscaled before detection (speed)
RESCUE_MAX_DIST = 0.30      # max normalised dist: 2nd-detector hand <-> pose wrist
DEFAULT_FPS = 30.0
DEFAULT_MAX_WORKERS = max(2, min(16, os.cpu_count() or 4))   # saturate the CPU;
                            # override with --workers N or env EXTRACT_WORKERS=N
MULTI_SPAN = "longest"      # video with several spans: "longest" = use the longest,
                            # "reject" = reject it (MULTIPLE_SIGN_SPANS)
REQUIRE_CLOSED_SPAN = False # True = reject videos that end while the hands are still up
                            # (default keeps them; they are flagged span_closed=false)
CACHE_VERSION_TEMPLATE = "v2-holistic-c1-w{w}-full21"   # width is part of the key


def cache_version() -> str:
    return CACHE_VERSION_TEMPLATE.format(w=MAX_FRAME_WIDTH)


# MediaPipe indices
HAND_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20]      # 11 training points / hand
POSE_IDX = [11, 12, 13, 14, 15, 16, 23, 24]            # stored pose subset
P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)
H_MID_BASE, H_INDEX_BASE, H_PINKY_BASE = 5, 3, 9       # positions inside HAND_IDX
AVATAR_FACE = [10, 152, 234, 454, 70, 105, 107, 300, 334, 336,
               159, 145, 386, 374, 1, 61, 291, 0, 17]
FACE_CACHE_IDX = AVATAR_FACE + [13, 14]                # + mouth pair for training
FI = {idx: k for k, idx in enumerate(FACE_CACHE_IDX)}  # mesh index -> cache column

LAYOUT = [
    ("handshape", 66),        # 2 hands x 11 pts x (x,y,z)
    ("palm_dir_normal", 12),  # 2 hands x (dir xyz, normal xyz)
    ("wrist_pos", 4),         # Lx, Ly, Rx, Ry
    ("elbows", 4),            # Lx, Ly, Rx, Ry
    ("wrist_face_dist", 6),   # L: forehead, mouth, chin | R: forehead, mouth, chin
    ("head", 3),              # mouth x, mouth y, forehead-chin angle from vertical (rad)
    ("hand_flags", 2),        # L, R
    ("duration", 1),          # seconds of the span
]
assert sum(n for _, n in LAYOUT) == N_FEATURES


def layout_offsets() -> dict:
    out, o = {}, 0
    for name, n in LAYOUT:
        out[name] = [o, o + n]
        o += n
    return out


REASON_TEXT = {
    "CANNOT_OPEN": "video could not be opened",
    "NO_FRAMES": "no frames could be read",
    "NO_SPAN": "no sign span found (hands never raised long enough)",
    "NO_COMPLETE_FRAME": "no complete frame exists for a target position",
    "GAP_TOO_LARGE": f"a target position needed a frame > {MAX_GAP} frames later",
    "MULTIPLE_SIGN_SPANS": "more than one sign span found (MULTI_SPAN = 'reject')",
    "SIGN_NOT_CLOSED": "video ended before the hands went down (REQUIRE_CLOSED_SPAN)",
    "NON_FINITE": "feature vector contained NaN/inf",
    "EXCEPTION": "unexpected error while processing",
    "WORKER_CRASH": "worker process died (native crash) on this video",
}


class Reject(Exception):
    def __init__(self, code: str, detail: str = ""):
        super().__init__(code)
        self.code = code
        self.detail = detail


# --------------------------------------------------------------------------- #
# Hand-in-use / rest line
# --------------------------------------------------------------------------- #
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


# --------------------------------------------------------------------------- #
# Detection (MediaPipe) - detectors live once per process, reset per video
# --------------------------------------------------------------------------- #
_HOLISTIC = None
_HANDS_DET = None


def _make_detectors():
    import mediapipe as mp
    try:
        from absl import logging as _absl
        _absl.set_verbosity(_absl.ERROR)
    except Exception:
        pass
    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False, model_complexity=1, smooth_landmarks=True,
        refine_face_landmarks=False, min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    hands = mp.solutions.hands.Hands(
        static_image_mode=True, max_num_hands=2, min_detection_confidence=0.5)
    return holistic, hands


def _get_detectors():
    global _HOLISTIC, _HANDS_DET
    if _HOLISTIC is None:
        _HOLISTIC, _HANDS_DET = _make_detectors()
    return _HOLISTIC, _HANDS_DET


def _close_detectors():
    global _HOLISTIC, _HANDS_DET
    for d in (_HOLISTIC, _HANDS_DET):
        try:
            if d is not None:
                d.close()
        except Exception:
            pass
    _HOLISTIC = _HANDS_DET = None


def _worker_init():
    """Process-pool initializer: quiet fds, single-thread OpenCV, one model set."""
    try:
        import cv2
        cv2.setNumThreads(1)
    except Exception:
        pass
    # workers only: send stdout/stderr (C++ log spam) to devnull; the parent
    # process keeps its console for the progress line
    try:
        devnull = os.open(os.devnull, os.O_WRONLY)
        os.dup2(devnull, 1)
        os.dup2(devnull, 2)
        os.close(devnull)
    except Exception:
        pass
    _get_detectors()
    atexit.register(_close_detectors)


def _lm(landmarks, idx_list):
    return np.array([(landmarks[i].x, landmarks[i].y, landmarks[i].z) for i in idx_list], np.float32)


def detect_video(path: str) -> dict:
    import cv2

    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        raise Reject("CANNOT_OPEN")
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or not math.isfinite(fps) or fps <= 0 or fps > 240:
        fps = DEFAULT_FPS

    holistic, hands_det = _get_detectors()
    for d in (holistic, hands_det):                     # fresh tracking state
        try:                                            # per video (same result
            d.reset()                                   # as a fresh instance)
        except Exception:
            pass

    poses, hands_l, faces, face_ok, rescued = [], [], [], [], []
    W = H = 0
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            fh, fw = frame.shape[:2]
            if fw > MAX_FRAME_WIDTH:
                frame = cv2.resize(frame, (MAX_FRAME_WIDTH, int(round(fh * MAX_FRAME_WIDTH / fw))))
            H, W = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            res = holistic.process(rgb)

            pose = np.full((8, 4), np.nan, np.float32)
            pose[:, 3] = 0.0
            if res.pose_landmarks:
                lm = res.pose_landmarks.landmark
                for k, i in enumerate(POSE_IDX):
                    pose[k] = (lm[i].x, lm[i].y, lm[i].z, lm[i].visibility)

            hands = np.full((2, 21, 3), np.nan, np.float32)
            for h, hl in enumerate((res.left_hand_landmarks, res.right_hand_landmarks)):
                if hl:
                    hands[h] = _lm(hl.landmark, range(21))

            face = np.full((len(FACE_CACHE_IDX), 3), np.nan, np.float32)
            f_ok = bool(res.face_landmarks)
            if f_ok:
                face = _lm(res.face_landmarks.landmark, FACE_CACHE_IDX)

            resc = np.zeros(2, bool)
            in_use = frame_in_use(pose, W, H)
            missing = [h for h in (0, 1) if in_use[h] and np.isnan(hands[h, 0, 0])]
            if missing:
                r2 = hands_det.process(rgb)
                if r2.multi_hand_landmarks:
                    best = {}
                    for hl in r2.multi_hand_landmarks:
                        pts = _lm(hl.landmark, range(21))
                        dists = []
                        for wi in (P_LWR, P_RWR):  # nearest pose wrist decides the side
                            w = pose[wi, :2]
                            dists.append(float(np.hypot(*(pts[0, :2] - w))) if np.isfinite(w).all() else 9e9)
                        h = int(np.argmin(dists))
                        if h in missing and dists[h] < RESCUE_MAX_DIST and (h not in best or dists[h] < best[h][0]):
                            best[h] = (dists[h], pts)
                    for h, (_, pts) in best.items():
                        hands[h] = pts
                        resc[h] = True

            poses.append(pose)
            hands_l.append(hands)
            faces.append(face)
            face_ok.append(f_ok)
            rescued.append(resc)
    finally:
        cap.release()

    if not poses:
        raise Reject("NO_FRAMES")
    T = len(poses)
    return dict(
        pose=np.stack(poses), hands=np.stack(hands_l), face=np.stack(faces),
        face_ok=np.array(face_ok, bool), rescued=np.stack(rescued),
        t=(np.arange(T) / fps).astype(np.float32),
        fps=np.float32(fps), W=np.int32(W), H=np.int32(H),
    )


def cache_path(video: str, cache_dir: Path = CACHE_DIR) -> Path:
    st = os.stat(video)
    key = f"{cache_version()}|{os.path.abspath(video)}|{st.st_size}|{st.st_mtime_ns}"
    return cache_dir / (hashlib.sha1(key.encode("utf-8")).hexdigest() + ".npz")


def load_or_detect(video: str, use_cache: bool = True, cache_dir: Path = CACHE_DIR):
    """Returns (raw_landmarks_dict, cache_hit). Also used by avatar_extract.py."""
    cp = cache_path(video, cache_dir)
    if use_cache and cp.exists():
        try:
            with np.load(cp, allow_pickle=False) as z:
                return {k: z[k] for k in z.files}, True
        except Exception:
            pass  # corrupt cache -> re-detect
    raw = detect_video(video)
    try:
        cache_dir.mkdir(parents=True, exist_ok=True)
        tmp = cp.with_name(f"{cp.stem}.{os.getpid()}.tmp.npz")
        np.savez(tmp, **raw)
        os.replace(tmp, cp)  # atomic: parallel runs never see half-written files
    except Exception:
        pass  # caching is best-effort
    return raw, False


# --------------------------------------------------------------------------- #
# Sign span state machine (reuse logic in test_model.py)
# --------------------------------------------------------------------------- #
def find_spans(raised: np.ndarray) -> list:
    """raised: bool[T] (any hand in use).
    Returns inclusive (start, end, closed) spans; closed=False means the video
    ended while the sign was still running."""
    n = len(raised)
    spans = []
    sign = False
    up = down = 0
    run_start = start = last_up = 0
    lo = 0  # earliest allowed start (just after the previous span)
    for i in range(n):
        r = bool(raised[i])
        if not sign:  # IDLE
            if r:
                if up == 0:
                    run_start = i
                up += 1
                if up >= TRIGGER_FRAMES:
                    sign = True
                    start = max(lo, run_start - PRE_ROLL)
                    last_up = i
                    down = 0
            else:
                up = 0
        else:  # SIGN
            if r:
                last_up = i
                down = 0
            else:
                down += 1
                if down >= END_FRAMES:
                    end = min(last_up + KEEP_TAIL, n - 1)
                    spans.append((start, end, True))
                    lo = end + 1
                    sign = False
                    up = 0
    if sign:
        spans.append((start, min(last_up + KEEP_TAIL, n - 1), False))
    return spans


# --------------------------------------------------------------------------- #
# Completeness + features
# --------------------------------------------------------------------------- #
def complete_mask(raw: dict, in_use: np.ndarray) -> np.ndarray:
    pose, hands = raw["pose"], raw["hands"]
    W, H = int(raw["W"]), int(raw["H"])
    ok = raw["face_ok"].copy()
    vis = pose[:, :4, 3]  # shoulders + elbows
    ok &= np.isfinite(vis).all(1) & (vis >= VIS_MIN).all(1)
    sw = np.linalg.norm((pose[:, P_LSH, :2] - pose[:, P_RSH, :2]) * [W, H], axis=1)
    ok &= np.isfinite(sw) & (sw > 1.0)
    for h in (0, 1):
        has_all21 = np.isfinite(hands[:, h]).all(axis=(1, 2))
        palm = np.linalg.norm((hands[:, h, 9, :2] - hands[:, h, 0, :2]) * [W, H], axis=1)
        good = has_all21 & np.isfinite(palm) & (palm > 1.0)
        ok &= ~in_use[:, h] | good
    return ok


def frame_features(pose, hands21, face, in_use, W, H, duration) -> np.ndarray:
    sl = pose[P_LSH, :2].astype(np.float64) * [W, H]
    sr = pose[P_RSH, :2].astype(np.float64) * [W, H]
    origin = (sl + sr) / 2.0
    sw = float(np.linalg.norm(sl - sr))
    xax = (sl - sr) / sw
    yax = np.array([xax[1], -xax[0]])  # perpendicular, pointing up in the image

    def box_xy(xy_norm):
        d = np.asarray(xy_norm, np.float64) * [W, H] - origin
        return np.array([d @ xax, d @ yax]) / sw

    def box_pts(pts):  # (n,3) normalised -> (n,3) shoulder box
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
        box = box_pts(hands21[h][HAND_IDX])
        rel = box - box[0]
        m = rel[H_MID_BASE]
        palm = float(np.linalg.norm(m)) + 1e-9
        phi = math.atan2(m[0], m[1])  # in-plane rotation: wrist->middle-base points up
        c, s = math.cos(phi), math.sin(phi)
        r = rel / palm
        hs[h] = np.stack([r[:, 0] * c - r[:, 1] * s, r[:, 0] * s + r[:, 1] * c, r[:, 2]], 1)
        pd[h, :3] = m / palm
        n = np.cross(rel[H_INDEX_BASE], rel[H_PINKY_BASE])
        if h == 0:  # mirror so "palm normal" means the same for both hands
            n = -n
        pd[h, 3:] = n / (np.linalg.norm(n) + 1e-9)
        wp[h] = box[0, :2]
        for k in range(3):  # 2-D distances (hand z and face z are not comparable)
            wf[h, k] = np.linalg.norm(box[0, :2] - face_box[k])
        flags[h] = 1.0

    elbows = np.concatenate([box_xy(pose[P_LEL, :2]), box_xy(pose[P_REL, :2])])
    v = forehead - chin
    head = np.array([mouth[0], mouth[1], math.atan2(v[0], v[1])])  # 0 = upright

    f = np.concatenate([hs.ravel(), pd.ravel(), wp.ravel(), elbows, wf.ravel(), head, flags, [duration]])
    assert f.shape[0] == N_FEATURES
    return f.astype(np.float32)


def build_features(raw: dict):
    """raw landmarks -> ((64, 98) float32, details). Raises Reject."""
    pose, hands, face = raw["pose"], raw["hands"], raw["face"]
    W, H, fps = int(raw["W"]), int(raw["H"]), float(raw["fps"])
    T = len(pose)
    if T == 0:
        raise Reject("NO_FRAMES")

    in_use = np.stack([frame_in_use(pose[t], W, H) for t in range(T)])
    spans = find_spans(in_use.any(1))
    if not spans:
        raise Reject("NO_SPAN")
    if MULTI_SPAN == "reject" and len(spans) > 1:
        raise Reject("MULTIPLE_SIGN_SPANS", f"{len(spans)} spans")
    start, end, closed = max(spans, key=lambda s: s[1] - s[0])  # longest span
    if REQUIRE_CLOSED_SPAN and not closed:
        raise Reject("SIGN_NOT_CLOSED")
    F = end - start + 1

    complete = complete_mask(raw, in_use)[start:end + 1]
    nxt = np.empty(F, int)  # next complete frame at/after i (relative), -1 if none
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
            raise Reject("NO_COMPLETE_FRAME", f"position {p} of {F}")
        if n - p > MAX_GAP:
            raise Reject("GAP_TOO_LARGE", f"position {p} needs +{n - p} frames")
        chosen.append(start + n)

    duration = F / fps
    feats = np.stack([frame_features(pose[t], hands[t], face[t], in_use[t], W, H, duration) for t in chosen])
    if not np.isfinite(feats).all():
        raise Reject("NON_FINITE")
    return feats, dict(
        frames_decoded=int(T), fps=round(fps, 3), span=[int(start), int(end)], span_frames=int(F),
        span_count=len(spans), span_closed=bool(closed), duration_s=round(duration, 3),
        complete_share=round(float(complete.mean()), 4),
        rescued_hand_frames=int(np.asarray(raw["rescued"]).sum()),
    )


# --------------------------------------------------------------------------- #
# Worker
# --------------------------------------------------------------------------- #
def base_info(rel: str, gloss: str) -> dict:
    return dict(path=rel, gloss=gloss, status="rejected", reason_code=None, reason=None,
                detail="", landmark_cache="miss")


def crash_info(rel: str, gloss: str, exc) -> dict:
    info = base_info(rel, gloss)
    info.update(reason_code="WORKER_CRASH", reason=REASON_TEXT["WORKER_CRASH"],
                detail=f"{type(exc).__name__}: {exc}", landmark_cache="unknown")
    return info


def process_video(job):
    video, rel, gloss, use_cache = job
    t0 = time.time()
    info = base_info(rel, gloss)
    feats = None
    try:
        raw, hit = load_or_detect(video, use_cache)
        info["landmark_cache"] = "hit" if hit else "miss"
        feats, details = build_features(raw)
        info.update(details)
        info["status"] = "kept"
    except Reject as r:
        info.update(reason_code=r.code, reason=REASON_TEXT.get(r.code, r.code), detail=r.detail)
    except Exception as e:  # never kill the pool
        info.update(reason_code="EXCEPTION", reason=REASON_TEXT["EXCEPTION"],
                    detail=f"{type(e).__name__}: {e}",
                    debug_traceback=traceback.format_exc(limit=6))
    info["seconds"] = round(time.time() - t0, 2)
    return info, feats


def run_all(jobs, workers, handle):
    """Run jobs in a process pool; survive native crashes of single workers.

    A dead worker breaks the whole pool. Unfinished jobs are re-queued; a job
    that was in flight for two breaks is run alone, so a crash is blamed on the
    exact video (WORKER_CRASH) and every other video still gets processed.
    """
    if workers == 1:
        _worker_init()                      # quiet + single model set in parent
        for j in jobs:
            handle(process_video(j))
        return
    pending, suspects, strikes = list(jobs), [], Counter()
    while pending:
        done, broke = set(), False
        with ProcessPoolExecutor(max_workers=workers, initializer=_worker_init) as ex:
            futs = {ex.submit(process_video, j): j for j in pending}
            for fut in as_completed(futs):
                j = futs[fut]
                try:
                    res = fut.result()
                except BrokenProcessPool:
                    broke = True
                    continue
                except Exception as e:
                    res = (crash_info(j[1], j[2], e), None)
                done.add(j[0])
                handle(res)
        if not broke:
            break
        retry = [j for j in pending if j[0] not in done]
        pending = []
        for j in retry:
            strikes[j[0]] += 1
            (suspects if strikes[j[0]] >= 2 else pending).append(j)
    for j in suspects:
        try:
            with ProcessPoolExecutor(max_workers=1, initializer=_worker_init) as ex:
                res = ex.submit(process_video, j).result()
        except Exception as e:
            res = (crash_info(j[1], j[2], e), None)
        handle(res)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def class_name(folder: str) -> str:
    return re.sub(r'[<>:"/\\|?*]+', "_", folder.strip().upper().replace(" ", "_"))


def discover():
    if not DATASET_DIR.is_dir():
        sys.exit(f"ERROR: dataset folder not found:\n  {DATASET_DIR}")
    jobs, gloss_folders = [], defaultdict(list)
    for g in sorted(p for p in DATASET_DIR.iterdir() if p.is_dir()):
        gloss = class_name(g.name)
        gloss_folders[gloss].append(g.name)
        for v in sorted(g.rglob("*")):
            if v.is_file() and v.suffix.lower() in VIDEO_EXTS:
                jobs.append((str(v), v.relative_to(DATASET_DIR).as_posix(), gloss))
    if not jobs:
        sys.exit(f"ERROR: no videos found under {DATASET_DIR}")
    return jobs, dict(gloss_folders)


def next_run_id(root: Path) -> int:
    root.mkdir(parents=True, exist_ok=True)
    ids = [int(p.name) for p in root.iterdir() if p.is_dir() and p.name.isdigit()]
    return max(ids) + 1 if ids else 1


def fmt_time(s: float) -> str:
    s = int(max(0, s))
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def main():
    global MAX_FRAME_WIDTH
    ap = argparse.ArgumentParser(description="Extract (64, 98) sign features from ISL videos.")
    ap.add_argument("--workers", type=int, default=None,
                    help=f"worker processes (default {DEFAULT_MAX_WORKERS})")
    ap.add_argument("--no-cache", action="store_true", help="ignore the landmark cache")
    ap.add_argument("--width", type=int, default=MAX_FRAME_WIDTH,
                    help="max detection frame width in px (default 960)")
    args = ap.parse_args()
    MAX_FRAME_WIDTH = int(args.width)

    try:
        import cv2  # noqa: F401
        import mediapipe  # noqa: F401
    except ImportError as e:
        sys.exit(f"ERROR: missing package ({e}). Install:  py -m pip install opencv-python mediapipe numpy")

    videos, gloss_folders = discover()
    collisions = {g: f for g, f in gloss_folders.items() if len(f) > 1}
    env_workers = int(os.getenv("EXTRACT_WORKERS", "0") or 0)
    workers = args.workers or env_workers or DEFAULT_MAX_WORKERS
    workers = max(1, min(workers, len(videos)))

    run_id = next_run_id(FEATURES_ROOT)
    out_dir = FEATURES_ROOT / str(run_id)
    out_dir.mkdir(parents=True, exist_ok=False)

    print(f"Dataset : {DATASET_DIR}")
    print(f"Videos  : {len(videos)} in {len(gloss_folders)} glosses | workers: {workers} | "
          f"cache: {'off' if args.no_cache else 'on'} | width <= {MAX_FRAME_WIDTH}")
    for g, f in collisions.items():
        print(f"WARNING : folders {f} all map to class {g} (merged)")
    print(f"Output  : {out_dir}  (features id {run_id})\n")

    jobs = [(v, rel, g, not args.no_cache) for v, rel, g in videos]
    results = []
    counts = Counter()
    recent = deque(maxlen=60)          # completion times -> stable rate/ETA
    t0 = time.time()

    def handle(res):
        results.append(res)
        counts[res[0]["status"]] += 1
        done = len(jobs) and len(results)
        now = time.time()
        recent.append(now)
        if len(recent) > 1:
            rate = (len(recent) - 1) / (recent[-1] - recent[0])
        else:
            rate = done / max(now - t0, 1e-6)
        eta = (len(jobs) - done) / rate if rate > 0 else 0.0
        sys.stdout.write(
            f"\r[{100 * done / len(jobs):5.1f}%] {done}/{len(jobs)}  {rate:5.2f} vid/s  "
            f"ETA {fmt_time(eta)}  kept {counts['kept']}  rejected {counts['rejected']}  "
            f"elapsed {fmt_time(now - t0)}   \x1b[K")
        sys.stdout.flush()

    try:
        run_all(jobs, workers, handle)
    except KeyboardInterrupt:
        print("\nInterrupted - partial output left in", out_dir)
        sys.exit(130)
    print()

    # ---- aggregate per gloss (deterministic: sorted by relative path) ---- #
    results.sort(key=lambda r: (r[0]["gloss"], r[0]["path"].casefold()))
    per_gloss = defaultdict(list)
    for info, feats in results:
        if feats is not None:
            info["row"] = len(per_gloss[info["gloss"]])
            per_gloss[info["gloss"]].append(feats)

    class_summary = {}
    for gloss in sorted(gloss_folders):
        arrs = per_gloss.get(gloss, [])
        total = sum(1 for i, _ in results if i["gloss"] == gloss)
        shape = [len(arrs), N_FRAMES, N_FEATURES]
        if arrs:
            np.save(out_dir / f"{gloss}.npy", np.stack(arrs).astype(np.float32))
        class_summary[gloss] = dict(source_folders=gloss_folders[gloss], videos_total=total,
                                    kept=len(arrs), rejected=total - len(arrs),
                                    feature_file=f"{gloss}.npy" if arrs else None, feature_shape=shape)

    kept, rej = counts["kept"], counts["rejected"]
    reasons = Counter(i["reason_code"] for i, _ in results if i["status"] != "kept")
    report = dict(
        id=run_id,
        created=datetime.now().isoformat(timespec="seconds"),
        dataset=str(DATASET_DIR),
        elapsed_s=round(time.time() - t0, 1),
        summary=dict(videos_total=len(results), kept=kept, rejected=rej,
                     classes_total=len(gloss_folders),
                     classes_with_data=sum(1 for v in class_summary.values() if v["kept"]),
                     cache_hits=sum(1 for i, _ in results if i["landmark_cache"] == "hit"),
                     kept_unclosed_spans=sum(1 for i, _ in results
                                             if i["status"] == "kept" and not i.get("span_closed", True)),
                     kept_multi_span_videos=sum(1 for i, _ in results
                                                if i["status"] == "kept" and i.get("span_count", 1) > 1),
                     rejection_reason_counts=dict(sorted(reasons.items()))),
        gloss_collisions=collisions,
        configuration=dict(
            n_frames=N_FRAMES, n_features=N_FEATURES, workers=workers, max_gap=MAX_GAP,
            vis_min=VIS_MIN, hand_margin_shoulder_widths=HAND_MARGIN_SW,
            rest_shoulder_factor=REST_SHOULDER_FACTOR, trigger_frames=TRIGGER_FRAMES,
            pre_roll=PRE_ROLL, end_frames=END_FRAMES, keep_tail=KEEP_TAIL,
            multi_span=MULTI_SPAN, require_closed_span=REQUIRE_CLOSED_SPAN,
            max_frame_width=MAX_FRAME_WIDTH, cache_version=cache_version(),
        ),
        features_shape=["N", N_FRAMES, N_FEATURES],
        feature_layout=layout_offsets(),
        classes=class_summary,
        videos=[i for i, _ in results],
    )
    with open(out_dir / "extract_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Extraction complete | kept {kept} / {len(results)} | "
          f"{report['summary']['classes_with_data']}/{len(gloss_folders)} classes with data | "
          f"{report['elapsed_s']}s | cache hits {report['summary']['cache_hits']}")
    if reasons:
        print("Rejection reasons:")
        for k, v in reasons.most_common():
            print(f"  {k}: {v}  ({REASON_TEXT.get(k, '')})")
    empty = [g for g, v in class_summary.items() if v["kept"] == 0]
    if empty:
        print(f"WARNING: {len(empty)} glosses have no usable video: {', '.join(empty[:10])}"
              f"{' ...' if len(empty) > 10 else ''}")
    print(f"Features id : {run_id}\nReport      : {out_dir / 'extract_report.json'}")


if __name__ == "__main__":
    main()