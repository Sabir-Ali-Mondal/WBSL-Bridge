"""
extract.py — Step 1:  py extract.py

Reads every gloss folder in the dataset and saves, per gloss:
  features.npy  (N, 32, 158)   training rows: left hand 63 + right hand 63 + body pose 32
  pose.npy      (N, 32, 8, 4)  shoulders, elbows, wrists, hips (x, y, z, visibility), for the avatar
  hands.npy     (N, 32, 42, 3) left 21 + right 21 hand points, for the avatar
  face.npy      (N, 32, 19, 3) 19 face points (float16), for the avatar

Inside features.npy:
  hands -> relative to each hand's own wrist, scaled by that hand's size
  body  -> relative to the middle of the shoulders, scaled by shoulder width

Sampling: each video becomes SEQ_T frames, spaced evenly across its FULL length.
The same sampling and gap-fill rules are used by test_model.py on live clips.

This file also holds the shared feature and sign-boundary code used by
train.py and test_model.py (and the app's runner).
"""

import shutil
import sys
import time
from pathlib import Path

import cv2
import mediapipe as mp
import numpy as np

# ───────────── settings (edit here) ─────────────
FORCE = False        # True = ignore the cache and re-extract every video
MODEL_ID = None      # None = create the next id (e.g. 4 if 3 exists)
# ────────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent.parent
TRAINING_ZONE = ROOT / "model_training_zone"
MODELS = ROOT / "models" / "onnx_models"
RAW = TRAINING_ZONE / "dataset_train" / "daily_video_body158"

SEQ_T = 32
HAND_DIM = 126                                  # 2 hands * 21 joints * xyz
BODY_IDX = [11, 12, 13, 14, 15, 16, 23, 24]     # shoulders, elbows, wrists, hips (left, right)
BODY_N = len(BODY_IDX)                          # 8
BODY_DIM = BODY_N * 4                           # xyz + visibility = 32
DIM = HAND_DIM + BODY_DIM                       # 158
# MediaPipe face-mesh indices: outline 4, brows 6, eyes 4, nose 1, lips 4
FACE_IDX = [10, 152, 234, 454,
            70, 105, 107, 300, 334, 336,
            159, 145, 386, 374,
            1,
            61, 291, 0, 17]
FACE_N = len(FACE_IDX)                          # 19


# ═════════════ shared: features ═════════════
def _hand_arr(h):
    return np.array([[p.x, p.y, p.z] for p in h.landmark], np.float32)


def extract_features(res, require_both_hands=True):
    """One MediaPipe Holistic result -> 158-dim vector, or None if the frame is unusable."""
    if res.pose_landmarks is None:
        return None
    has_lh = res.left_hand_landmarks is not None
    has_rh = res.right_hand_landmarks is not None
    if require_both_hands:
        if not (has_lh and has_rh):
            return None
    elif not (has_lh or has_rh):
        return None

    def hand_norm(h, present):
        if not present:
            return np.zeros((21, 3), np.float32)
        a = _hand_arr(h)
        return (a - a[0]) / (np.linalg.norm(a[9] - a[0]) + 1e-6)

    lh_n = hand_norm(res.left_hand_landmarks, has_lh)
    rh_n = hand_norm(res.right_hand_landmarks, has_rh)

    lm = res.pose_landmarks.landmark
    body = np.array([[lm[i].x, lm[i].y, lm[i].z, lm[i].visibility] for i in BODY_IDX], np.float32)
    center = (body[0, :3] + body[1, :3]) / 2                      # middle of the shoulders
    width = np.linalg.norm(body[0, :3] - body[1, :3]) + 1e-6      # shoulder width
    body[:, :3] = (body[:, :3] - center) / width

    return np.concatenate([lh_n.ravel(), rh_n.ravel(), body.ravel()]).astype(np.float32)


def frame_idxs(n):
    """SEQ_T evenly spaced frame indices across the FULL length (0%–100%) of n frames."""
    return np.linspace(0, max(0, n - 1), SEQ_T).astype(int)


def fill_sequence(feats):
    """List of feature rows (None = unusable frame) -> (SEQ_T, DIM) float32.

    One rule everywhere: a missing row holds the last good row;
    a gap before the first good row stays zeros.
    """
    last = None
    out = []
    for f in feats:
        if f is not None:
            last = f
        out.append(last if last is not None else np.zeros(DIM, np.float32))
    return np.array(out, np.float32)


# ═════════════ shared: sign boundary ═════════════
def any_hand_up(res, margin=0.05, vis_thresh=0.5):
    """True if at least one wrist is clearly above the rest line."""
    if res.pose_landmarks is None:
        return False
    lm = res.pose_landmarks.landmark
    if lm[23].visibility > vis_thresh and lm[24].visibility > vis_thresh:
        rest_y = (lm[23].y + lm[24].y) / 2
    else:  # desk webcam: estimate belly level from shoulder width
        rest_y = (lm[11].y + lm[12].y) / 2 + 1.3 * abs(lm[11].x - lm[12].x)
    return any(w.visibility > vis_thresh and w.y < rest_y - margin for w in (lm[15], lm[16]))


class SignBoundary:
    """Hands down = no sign. Hands raised -> "start". Both hands down again -> "end"."""

    def __init__(self, start_frames=3, end_frames=10, margin=0.05):
        self.start_frames, self.end_frames, self.margin = start_frames, end_frames, margin
        self.reset()

    def reset(self):
        self.signing = False
        self.up = False
        self.up_count = 0
        self.down_count = 0

    def update(self, res):
        self.up = any_hand_up(res, self.margin)
        if not self.signing:
            self.up_count = self.up_count + 1 if self.up else 0
            if self.up_count >= self.start_frames:
                self.signing, self.up_count, self.down_count = True, 0, 0
                return "start"
            return None
        self.down_count = 0 if self.up else self.down_count + 1
        if self.down_count >= self.end_frames:
            self.signing = False
            return "end"
        return None


# ═════════════ shared: model folder helpers ═════════════
def model_ids():
    return sorted(int(p.name) for p in MODELS.iterdir() if p.name.isdigit()) if MODELS.exists() else []


def dataset_paths():
    vd = TRAINING_ZONE / "dataset" / "Indian Sign Language_Dataset" / "ISL_VIDEO"
    if not vd.exists():
        sys.exit("Dataset not found (ISL_VIDEO missing)")
    targets = sorted(p.name for p in vd.iterdir() if p.is_dir() and any(p.glob("*.mp4")))
    if not targets:
        sys.exit("No video gloss folders found in ISL_VIDEO")
    return vd, targets


def class_names(targets):
    return [t.upper().replace(" ", "_") for t in targets]


# ═════════════ extraction ═════════════
_hol = None


def extract_frame_data(bgr):
    global _hol
    if _hol is None:
        _hol = mp.solutions.holistic.Holistic(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )
    res = _hol.process(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))

    face = None
    if res.face_landmarks:
        fl = res.face_landmarks.landmark
        face = np.array([[fl[i].x, fl[i].y, fl[i].z] for i in FACE_IDX], np.float16)

    feat = extract_features(res, True)
    if feat is None:
        return None, face, None, None

    lh = _hand_arr(res.left_hand_landmarks)
    rh = _hand_arr(res.right_hand_landmarks)
    lm = res.pose_landmarks.landmark
    pose8 = np.array([[lm[i].x, lm[i].y, lm[i].z, lm[i].visibility] for i in BODY_IDX], np.float32)
    return feat, face, pose8, np.concatenate([lh, rh], 0)


def process_video(path):
    """One video -> (features, faces, poses, hands), 32 frames spaced over the full length."""
    cap = cv2.VideoCapture(str(path))
    F = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if F < 8:
        cap.release()
        return None, None, None, None
    idxs = frame_idxs(F)

    feats, faces, poses, hands = [], [], [], []
    last, good = None, 0
    for ix in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(ix))
        ok, fr = cap.read()
        if not ok:
            feats.append(last); faces.append(None); poses.append(None); hands.append(None)
            continue
        f, face, pose, hnd = extract_frame_data(fr)
        if f is not None:
            last, good = f, good + 1
        feats.append(f if f is not None else last)
        faces.append(face if face is not None else np.zeros((FACE_N, 3), np.float16))
        poses.append(pose if pose is not None else np.zeros((BODY_N, 4), np.float32))
        hands.append(hnd if hnd is not None else np.zeros((42, 3), np.float32))
    cap.release()

    if good < SEQ_T // 2:
        return None, None, None, None
    return fill_sequence(feats), np.stack(faces).astype(np.float16), np.stack(poses), np.stack(hands)


def pick_model_dir():
    if MODEL_ID is not None:
        return MODELS / str(MODEL_ID)
    ids = model_ids()
    return MODELS / str((ids[-1] if ids else 0) + 1)


def main():
    vd, targets = dataset_paths()
    RAW.mkdir(parents=True, exist_ok=True)
    model_dir = pick_model_dir()
    npy = model_dir / "npy"
    npy.mkdir(parents=True, exist_ok=True)

    print("=" * 70)
    print(f" EXTRACTING {len(targets)} GLOSSES ({DIM}-dim) -> {model_dir.name}".center(70))
    print("=" * 70)
    t0 = time.time()
    parts = ["features", "pose", "hands", "face"]

    for t in targets:
        g = t.upper().replace(" ", "_")
        vids = sorted((vd / t).glob("*.mp4"))
        cached = all((RAW / g / f"{p}.npy").exists() for p in parts)

        if FORCE or not cached:
            valid = [r for r in (process_video(v) for v in vids) if r[0] is not None]
            if not valid:
                print(f"  SKIP {g}: no valid videos")
                continue
            (RAW / g).mkdir(parents=True, exist_ok=True)
            for i, p in enumerate(parts):
                np.save(RAW / g / f"{p}.npy", np.stack([r[i] for r in valid]))
            n = len(valid)
        else:
            n = len(np.load(RAW / g / "features.npy", mmap_mode="r"))

        (npy / g).mkdir(parents=True, exist_ok=True)
        for p in parts:
            shutil.copyfile(RAW / g / f"{p}.npy", npy / g / f"{p}.npy")
        print(f"  DONE {g}: {n}/{len(vids)}")

    print(f"  finished in {time.time() - t0:.1f}s -> {npy}")
    print("  next: py train.py")


if __name__ == "__main__":
    main()