"""Pose data for the 98-dim sign-recognition feature architecture."""

import numpy as np

POSE_INDICES = [11, 12, 13, 14, 15, 16, 23, 24]
POSE_POINTS = len(POSE_INDICES)
POSE_DIM = POSE_POINTS * 4

P_LSH, P_RSH, P_LEL, P_REL, P_LWR, P_RWR, P_LHIP, P_RHIP = range(8)

VIS_MIN = 0.5

POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (0, 1),
    (0, 2), (2, 4),
    (1, 3), (3, 5),
    (0, 6), (1, 7), (6, 7),
]

POSE_FACE_MARKERS: list[int] = []
POSE_FACE_PAIRS: list[tuple[int, int]] = []


def pose_from_landmarks(pose_landmarks) -> np.ndarray:
    """Return the eight selected MediaPipe pose points as float32 x/y/z/visibility rows."""
    return np.array(
        [[pose_landmarks.landmark[i].x, pose_landmarks.landmark[i].y,
          pose_landmarks.landmark[i].z, pose_landmarks.landmark[i].visibility]
         for i in POSE_INDICES],
        np.float32,
    )
