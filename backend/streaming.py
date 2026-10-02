"""
backend/streaming.py
Per-session rolling landmark buffer for live continuous recognition.

Why the buffer lives here and not in the browser:

The client used to keep a ring buffer of 32 JPEGs and POST all of them every
tick. That is ~32 uploads and 32 MediaPipe passes for every single prediction,
and it makes the browser the owner of the recognition window -- so two tabs, or
a reload, silently reset the state the model depends on.

Here the client uploads ONE JPEG, the server appends ONE landmark vector, and the
model runs when the buffer is deep enough. Upload cost per tick drops by 32x, the
window survives a page reload, and the multi-scale windowing in
``/api/stream/frame`` can read any length of history it wants out of one deque.

Sessions are keyed by a client-generated id and never garbage collected: they are
tiny (a 180x258 float32 deque is ~186 KB) and eviction would have to guess at
liveness. A long-lived server with many visitors will accumulate them; the cap in
``MAX_SESSIONS`` bounds that, dropping the least recently used.
"""

from collections import OrderedDict, deque

import numpy as np

# ~6 s at 30 fps of client capture. Long enough that a 24- and a 32-frame window
# can both be cut from it with room to spare, short enough that a stale sign
# falls out of the buffer on its own.
DEFAULT_WINDOW = 180
MAX_SESSIONS = 64


class StreamSession:
    """One client's rolling landmark history.

    The whole point is that misses do not create gaps: a frame where a hand was
    not detected appends the previous vector, so the sequence the model sees is
    always dense and the same length as the wall-clock window. A truly empty
    buffer still appends a zero vector, which the network reads (via its
    hand-presence channels) as "no hands" rather than as a sign.
    """

    def __init__(self, maxlen: int = DEFAULT_WINDOW):
        self.buf: deque = deque(maxlen=maxlen)
        self.last_infer: float = 0.0
        # Consecutive frames with no landmarks. Bounded carry-forward (see
        # /api/stream/frame): a short occlusion keeps the window dense, a long
        # absence decays to zeros so a dropped hand cannot replay the last
        # sign pose forever.
        self.miss: int = 0


# Ordered so the oldest session is the one evicted when the cap is hit.
SESSIONS: "OrderedDict[str, StreamSession]" = OrderedDict()


def get_session(sid: str) -> StreamSession:
    """Fetch (and touch) the session for ``sid``, creating it on first use."""
    sess = SESSIONS.get(sid)
    if sess is None:
        sess = StreamSession()
        SESSIONS[sid] = sess
    else:
        SESSIONS.move_to_end(sid)
    while len(SESSIONS) > MAX_SESSIONS:
        SESSIONS.popitem(last=False)
    return sess


def last_vector(sess: StreamSession, width: int) -> np.ndarray:
    """The vector to carry forward when this frame yielded no landmarks."""
    if sess.buf:
        return sess.buf[-1]
    return np.zeros(width, np.float32)


def reset_session(sid: str) -> None:
    SESSIONS.pop(sid, None)
