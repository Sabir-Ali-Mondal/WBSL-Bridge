"""Per-session state for continuous sign detection."""

from collections import OrderedDict, deque

import numpy as np

from backend.extract import END_FRAMES, KEEP_TAIL, PRE_ROLL, TRIGGER_FRAMES

MAX_SESSIONS = 64
REFERENCE_FPS = 30.0


class StreamSession:
    """State and buffered frames for one client's sign stream."""

    def __init__(self):
        self.reset()

    def reset(self, mode: str = "auto"):
        self.mode = mode
        self.state = "IDLE"
        self.up_count = 0
        self.down_count = 0
        self.last_up_idx = 0
        self.up_started_at = None
        self.down_started_at = None
        self.frame_index = 0
        self.pre_roll = deque(maxlen=PRE_ROLL + TRIGGER_FRAMES)
        self.frames = []
        self.features = []
        self.timestamps = []
        self.miss = 0
        self.manual_recording = False


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


def update_span_state(
    sess: StreamSession,
    any_hand_up: bool,
    frame_data: dict | None,
    feature_vec: np.ndarray,
    is_complete: bool,
    timestamp: float,
) -> str:
    """Advance the span state machine and return its current state."""
    sess.frame_index += 1

    if sess.state == "IDLE":
        sess.pre_roll.append((frame_data, feature_vec, is_complete, timestamp))
        pre_roll_window = (PRE_ROLL + TRIGGER_FRAMES - 1) / REFERENCE_FPS
        while (
            len(sess.pre_roll) > 1
            and timestamp - sess.pre_roll[0][3] > pre_roll_window + 1e-6
        ):
            sess.pre_roll.popleft()
        if any_hand_up:
            if sess.up_started_at is None:
                sess.up_started_at = timestamp
            sess.up_count += 1
            if timestamp - sess.up_started_at + 1e-6 >= (
                TRIGGER_FRAMES - 1
            ) / REFERENCE_FPS:
                sess.state = "SIGN"
                sess.down_count = 0
                sess.frames = list(sess.pre_roll)
                sess.features = [
                    (i, features, complete)
                    for i, (_, features, complete, _) in enumerate(sess.frames)
                ]
                sess.timestamps = [time for _, _, _, time in sess.pre_roll]
                sess.last_up_idx = len(sess.frames) - 1
                sess.up_started_at = None
                return "SIGN"
        else:
            sess.up_count = 0
            sess.up_started_at = None
        return "IDLE"

    sess.frames.append(frame_data)
    rel_idx = len(sess.frames) - 1
    sess.features.append((rel_idx, feature_vec, is_complete))
    sess.timestamps.append(timestamp)

    if any_hand_up:
        sess.last_up_idx = rel_idx
        sess.down_count = 0
        sess.down_started_at = None
    else:
        if sess.down_started_at is None:
            sess.down_started_at = timestamp
        sess.down_count += 1
        if timestamp - sess.down_started_at + 1e-6 >= (
            END_FRAMES - 1
        ) / REFERENCE_FPS:
            tail_time = (
                sess.timestamps[sess.last_up_idx]
                + KEEP_TAIL / REFERENCE_FPS
                + 1e-6
            )
            end_idx = max(
                sess.last_up_idx,
                min(
                    int(np.searchsorted(sess.timestamps, tail_time, side="right")) - 1,
                    rel_idx,
                ),
            )
            sess.frames = sess.frames[:end_idx + 1]
            sess.features = sess.features[:end_idx + 1]
            sess.timestamps = sess.timestamps[:end_idx + 1]
            sess.state = "IDLE"
            sess.up_count = 0
            sess.down_count = 0
            sess.pre_roll.clear()
            return "SPAN_COMPLETE"
    return "SIGN"
