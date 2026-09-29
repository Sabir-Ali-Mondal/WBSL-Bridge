"""
backend/extract.py
Reuses the exact extract_two_hands() from phase2a_all_in_one.py.
DO NOT change normalization logic — it is tested and verified.

Consistency rules (from MVT 2A Section 8):
1. Never flip the frame BEFORE MediaPipe processing.
2. Use identical extract_two_hands() in all stages.
3. Always use right-wrist-preferred reference and same scale normalization.
4. Keep handedness slotting identical (Left block first, Right block second).
"""

import numpy as np
import mediapipe as mp

# Initialize ONCE at module load (not per request)
_hands = mp.solutions.hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.6
)


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


def process_bgr_frame(frame_bgr: np.ndarray) -> np.ndarray | None:
    """
    Takes a BGR numpy frame (from cv2.imdecode),
    returns 126-dim landmark vector or None.
    """
    import cv2
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    results = _hands.process(rgb)
    return extract_two_hands(results)


def process_bgr_frames(frames_bgr: list) -> list:
    """Vectorised batch form of :func:`process_bgr_frame`.

    Live sign detection walks a sliding window of ~32 frames every tick, so
    calling ``process_bgr_frame`` in a loop would re-enter MediaPipe 32 times per
    request. The Hands graph is built with ``max_num_hands=2`` and no face or
    pose sub-model, so it is genuinely a single per-frame detection graph and
    MediaPipe fans a list of images out over the same graph -- one call for the
    whole window instead of 32.

    Frames are returned in order, one entry each, ``None`` where no hand was
    found. The caller decides how to fill those gaps; this function deliberately
    does not carry a previous vector forward, so that a gap is still visible as
    \"the signer's hands left the frame\" rather than being papered over.
    """
    import cv2

    if not frames_bgr:
        return []
    rgb_list = [cv2.cvtColor(f, cv2.COLOR_BGR2RGB) for f in frames_bgr]
    return [extract_two_hands(res) for res in _hands.process(rgb_list)]