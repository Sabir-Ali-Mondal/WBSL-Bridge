"""
backend/pose.py
The Pose half of the 258-dim holistic feature vector, defined ONCE.

``extract_holistic_frame`` (serving) and ``train_holistic.py`` (training) must
produce the same 132 numbers for the same frame, or the graph is trained on a
distribution it will never be served. Everything that is a property of the pose
block rather than of the caller therefore lives here:

    POSE_DIM         33 landmarks x (x, y, z, visibility) = 132 columns
    POSE_BODY_PAIRS  the BlazePose skeleton edges that are actually pOSE
                     geometry -- hands, feet and the face mesh are excluded
                     because the hand block carries the fingers and the mouth is
                     read separately by the NMM detector

Importing the skeleton from one place means a client cannot draw one thing while
the extractor means another.
"""

import numpy as np

POSE_POINTS = 33
POSE_DIM = POSE_POINTS * 4          # x, y, z, visibility

# BlazePose indices used by the skeleton: shoulders, elbows, wrists, hips,
# knees, ankles, ears and the mouth/nose cluster. The fingertip and foot
# landmarks are omitted on purpose -- they belong to the hand block (126 cols)
# and are invisible in the pose-only overlay.
POSE_BODY_PAIRS: list[tuple[int, int]] = [
    (11, 12),                                    # shoulders
    (11, 13), (13, 15),                          # left arm
    (12, 14), (14, 16),                          # right arm
    (11, 23), (12, 24), (23, 24),                # torso
    (23, 25), (25, 27),                          # left leg
    (24, 26), (26, 28),                          # right leg
    (0, 9), (0, 10), (9, 10),                    # nose <-> mouth corners
    (2, 5), (7, 8),                              # eyes and mouth midline
]

# Nose + mouth corners: the landmarks the NMM readout is computed from, so the
# replay marks exactly the points the detector actually looks at.
POSE_FACE_MARKERS: list[int] = [0, 9, 10]


def pose_from_landmarks(pose_landmarks) -> np.ndarray:
    """MediaPipe pose landmark list -> (33, 4) float32, un-normalised.

    Returns the raw (x, y, z, visibility) rows. Reference subtraction and
    scaling are the caller's job, because they depend on which hand is the
    reference -- and that decision belongs with the hand block.
    """
    return np.array(
        [[p.x, p.y, p.z, p.visibility] for p in pose_landmarks.landmark],
        np.float32,
    )
