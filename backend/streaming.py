"""Per-session state for continuous sign detection."""

from collections import OrderedDict, deque

import numpy as np

from backend.extract import (
    HOLD_MAX_AGE,
    KEEP_TAIL,
    LOWER_CONFIRM_FRAMES,
    MAX_SPAN_S,
    PRE_ROLL,
    RAISE_CONFIRM_FRAMES,
    make_hand_holder,
)

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
        self.span_t0 = 0.0
        self.frame_index = 0
        self.pre_roll = deque(maxlen=PRE_ROLL + RAISE_CONFIRM_FRAMES)
        self.frames = []
        self.features = []
        self.timestamps = []
        self.miss = 0
        self.manual_recording = False
        self.hand_holder = make_hand_holder(HOLD_MAX_AGE)


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
    raised_now: bool,
    lowered_now: bool,
    frame_data: dict | None,
    feature_vec: np.ndarray,
    is_complete: bool,
    timestamp: float,
) -> str:
    """Advance the v2 span state machine (hysteresis + max span) and return its state."""
    sess.frame_index += 1

    if sess.state == "IDLE":
        sess.pre_roll.append((frame_data, feature_vec, is_complete, timestamp))
        pre_roll_window = (PRE_ROLL + RAISE_CONFIRM_FRAMES - 1) / REFERENCE_FPS
        while (
            len(sess.pre_roll) > 1
            and timestamp - sess.pre_roll[0][3] > pre_roll_window + 1e-6
        ):
            sess.pre_roll.popleft()
        if raised_now:
            if sess.up_started_at is None:
                sess.up_started_at = timestamp
            sess.up_count += 1
            if sess.up_count >= RAISE_CONFIRM_FRAMES or (
                timestamp - sess.up_started_at + 1e-6
                >= (RAISE_CONFIRM_FRAMES - 1) / REFERENCE_FPS
            ):
                sess.state = "SIGN"
                sess.down_count = 0
                sess.down_started_at = None
                sess.span_t0 = timestamp
                sess.frames = [fd for fd, _, _, _ in sess.pre_roll]
                sess.features = [
                    (i, feat, comp)
                    for i, (_, feat, comp, _) in enumerate(sess.pre_roll)
                ]
                sess.timestamps = [ts for _, _, _, ts in sess.pre_roll]
                sess.last_up_idx = len(sess.frames) - 1
                sess.up_started_at = None
                return "SIGN"
        elif lowered_now:
            sess.up_count = 0
            sess.up_started_at = None
        return "IDLE"

    sess.frames.append(frame_data)
    rel_idx = len(sess.frames) - 1
    sess.features.append((rel_idx, feature_vec, is_complete))
    sess.timestamps.append(timestamp)

    if raised_now:
        sess.last_up_idx = rel_idx
        sess.down_count = 0
        sess.down_started_at = None
    elif lowered_now:
        if sess.down_started_at is None:
            sess.down_started_at = timestamp
        sess.down_count += 1

    timed_out = (timestamp - sess.span_t0) >= MAX_SPAN_S
    lowered_done = sess.down_count >= LOWER_CONFIRM_FRAMES or (
        sess.down_started_at is not None
        and timestamp - sess.down_started_at + 1e-6
        >= (LOWER_CONFIRM_FRAMES - 1) / REFERENCE_FPS
    )
    if lowered_done or timed_out:
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
        sess.frames = sess.frames[: end_idx + 1]
        sess.features = sess.features[: end_idx + 1]
        sess.timestamps = sess.timestamps[: end_idx + 1]
        sess.state = "IDLE"
        sess.up_count = 0
        sess.down_count = 0
        sess.down_started_at = None
        sess.pre_roll.clear()
        return "SPAN_COMPLETE"
    return "SIGN"
