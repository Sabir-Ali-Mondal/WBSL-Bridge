"""
backend/extract.py
Reuses the exact extract_two_hands() from phase2a_all_in_one.py.
DO NOT change normalization logic — it is tested and verified.

Consistency rules (from MVT 2A Section 8):
1. Never flip the frame BEFORE MediaPipe processing.
2. Use identical extract_two_hands() in all stages.
3. Always use right-wrist-preferred reference and same scale normalization.
4. Keep handedness slotting identical (Left block first, Right block second).

Two feature contracts are served here, and the layer that trains an artefact
must use the same one the serving layer will use:

    HANDS_DIM = 126   two hands (2 x 21 x 3), right-wrist reference
    HOLISTIC_DIM = 258  HANDS_DIM + pose (33 x 4 incl. visibility)

The 258-dim vector is what ``train_daily6.py`` learns for the daily-conversation
LSTM: it is never re-scaled on the way in, so the graph's declared input width
tells the registry which extractor to feed it. Running the MediaPipe Pose graph
costs real time per frame, so it is built lazily -- a project that only ever
serves 126-dim models never pays for it.
"""

import numpy as np
import mediapipe as mp

from backend.pose import POSE_DIM, pose_from_landmarks

HANDS_DIM = 126
# 126 hands + 132 pose. The pose half is defined in backend/pose.py so the
# trainer and the server cannot drift apart on what the pose block contains.
HOLISTIC_DIM = HANDS_DIM + POSE_DIM

# Initialize ONCE at module load (not per request)
_hands = mp.solutions.hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.6
)

# Built on first use only (see module docstring).
_holistic = None


def _get_holistic():
    """Lazily build the Holistic graph that supplies the pose half of a 258-vector.

    ``static_image_mode=False`` and the same 0.5 detection confidence as
    ``train_daily6.py`` keep inference identical to training.
    """
    global _holistic
    if _holistic is None:
        _holistic = mp.solutions.holistic.Holistic(
            static_image_mode=False,
            min_detection_confidence=0.5,
        )
    return _holistic


def extract_two_hands(res) -> np.ndarray | None:
    """
    Identical logic to phase2a_all_in_one.py extract_two_hands().
    Right-wrist-preferred reference. Left block first, Right block second.
    Returns 126-dim float32 vector or None if no hands detected.
    """
    if not res.multi_hand_landmarks:
        return None

    left = None
    right = None

    for hlm, handedness in zip(res.multi_hand_landmarks, res.multi_handedness):
        label = handedness.classification[0].label
        pts = np.array(
            [[p.x, p.y, p.z] for p in hlm.landmark],
            dtype=np.float32
        )
        if label == "Left" and left is None:
            left = pts
        elif label == "Right" and right is None:
            right = pts

    ref_hand = right if right is not None else left
    if ref_hand is None:
        return None

    ref = ref_hand[0]
    scale = np.linalg.norm(ref_hand[9] - ref_hand[0]) + 1e-6

    out_left = (left - ref) / scale if left is not None else np.zeros((21, 3), np.float32)
    out_right = (right - ref) / scale if right is not None else np.zeros((21, 3), np.float32)

    return np.concatenate([out_left.flatten(), out_right.flatten()])


def extract_holistic_frame(frame_bgr: np.ndarray) -> np.ndarray | None:
    """Hands (2x21x3) + pose (33x4) in the right-wrist frame -> (258,) float32.

    Byte-for-byte the same geometry as ``train_daily6.extract_frame_vector``, so
the daily-conversation LSTM sees at serving time what it saw while training.

    Returns ``None`` unless BOTH hands and the pose are present: the pose block
    is 132 of the 258 columns, and a zero-filled half would shift every column
    the network learned. A miss is therefore reported as a miss and the caller
    carries the previous vector forward, exactly as extraction does.
    """
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    res = _get_holistic().process(rgb)
    if (not res.left_hand_landmarks or not res.right_hand_landmarks
            or res.pose_landmarks is None):
        return None
    lh = np.array([[p.x, p.y, p.z] for p in res.left_hand_landmarks.landmark], np.float32)
    rh = np.array([[p.x, p.y, p.z] for p in res.right_hand_landmarks.landmark], np.float32)
    pose = pose_from_landmarks(res.pose_landmarks)
    ref = rh[0]
    scale = np.linalg.norm(rh[9] - rh[0]) + 1e-6
    lh = (lh - ref) / scale
    rh = (rh - ref) / scale
    pose[:, :3] = (pose[:, :3] - ref) / scale
    return np.concatenate([lh.flatten(), rh.flatten(), pose.flatten()]).astype(np.float32)


def process_bgr_frame(
    frame_bgr: np.ndarray,
    width: int = HANDS_DIM,
) -> np.ndarray | None:
    """
    Takes a BGR numpy frame (from cv2.imdecode),
    returns a ``width``-dim landmark vector or None.

    ``width`` is the feature contract the target graph declares: 126 for the
two-hand vector, 258 for the holistic one. Any other value is a bug in the
caller, so it fails loudly rather than feeding a wrongly-shaped tensor.
    """
    import cv2
    if width == HOLISTIC_DIM:
        # Holistic already runs the hand sub-model internally; running Hands as
        # well would double the per-frame cost for the same answer.
        return extract_holistic_frame(frame_bgr)
    if width != HANDS_DIM:
        raise ValueError(
            f"No feature extractor emits {width}-dim vectors "
            f"(supported: {HANDS_DIM} two-hand landmarks, "
            f"{HOLISTIC_DIM} hands+pose holistic)."
        )
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _hands.process(rgb)
    return extract_two_hands(results)


def process_bgr_frames(frames_bgr: list) -> list:
    """Vectorised batch form of :func:`process_bgr_frame`.

    Live sign detection walks a sliding window of ~32 frames every tick, so
    this exists to keep the per-frame bookkeeping in one place and to state
    plainly what a window costs: one MediaPipe call per frame. The Hands graph
    is built with ``max_num_hands=2`` and no face or pose sub-model, so it is the
    cheapest graph available -- but it is still one call per frame.

    Only the 126-dim contract is served here: it is the cheaper graph (no pose
    sub-model). A 258-dim target goes through ``process_bgr_frame``, whose
    Holistic graph adds the pose half the daily LSTM was trained on.

    Neither path is genuinely batched. The graph rejects a list outright, and
    passing one as ``image`` raises ``'list' object has no attribute 'shape'``:
    the MediaPipe Python binding exposes no per-frame fan-out it will walk for us,
    so a window costs one call per frame whichever contract is in use.

    Frames are returned in order, one entry each, ``None`` where no hand was
    found. The caller decides how to fill those gaps; this function deliberately
    does not carry a previous vector forward, so that a gap is still visible as
    \"the signer's hands left the frame\" rather than being papered over.
    """
    import cv2

    if not frames_bgr:
        return []
    rgb_imgs = [cv2.cvtColor(f, cv2.COLOR_BGR2RGB) for f in frames_bgr]
    return [extract_two_hands(_hands.process(img)) for img in rgb_imgs]