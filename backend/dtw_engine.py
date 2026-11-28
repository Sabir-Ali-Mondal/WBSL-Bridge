"""
backend/dtw_engine.py
Hybrid Part-Robust DTW + DL recogniser for the WBSL web stream.

Ported from model_training_zone/dl_nondl_recognize.py (do NOT modify that
research copy). This module loads once at startup, caches the PartBank, and
exposes a single function:

    result = hybrid_recognize(clip, onnx_session, input_name, classes)

``clip`` is a (1, 64, 98) float32 numpy array — the same tensor the pure
ONNX session uses — so the caller (main.py) needs no changes to frame
capture / span detection.

Returns the same dict shape as the existing _recognize_stream_clip so the
frontend receives identical JSON regardless of which recogniser is active.

Requires:
    pip install numba  (already in requirements.txt)
"""

from __future__ import annotations

import json
import logging
import math
import threading
from pathlib import Path
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

# ── numba import (optional-hard: if missing, we fall back to pure ONNX) ───────
try:
    import numba as nb
    _NUMBA_OK = True
except ImportError:
    _NUMBA_OK = False
    logger.warning("[DTW] numba not installed — DTW engine disabled, using ONNX only.")

# ── constants mirrored from extract.py / dl_nondl_recognize.py ───────────────
N_FRAMES = 64
N_FEATURES = 98
# How many feature columns the DTW side uses (excludes hand flags [95,96] and duration [97])
DTW_N_CONTENT = 95
MIN_REAL_FRAMES = 8
BIG = 1e18

PART_ORDER = ["LH", "RH", "BOTH", "BODY", "FACE", "REST", "META"]

PART_W_DEFAULTS = {
    "LH":   1.00,
    "RH":   1.00,
    "BOTH": 0.85,
    "BODY": 0.55,
    "FACE": 0.35,
    "REST": 0.70,
    "META": 0.00,
    "ALL":  1.00,
}

# Hybrid hyper-parameters (matches PR dict in dl_nondl_recognize.py)
PR = dict(
    top_n=5,
    screen_refs=3,
    screen_top=8,
    w_dl=0.50,
    w_dtw=0.50,
    pow=3.0,
    mode="score",
    dl_temp=1.0,
    alpha=0.45,
    beta=0.45,
    band=10,
    k_avg=3,
    deep_band=16,
    deep_k=5,
    end_slack=4,
    close_gap=0.08,
    rescue_gap=0.12,
    p_hi=0.55,
    m_hi=0.30,
    r_good=1.15,
    r_ok=1.35,
    d_margin=0.10,
    chamfer_w=0.20,
    low_gap=0.08,
    tta=4,
    prune=3.0,
    scale_samples=4,
    scale_floor=0.10,
)


# ═══════════════════════════════════════════════════════════════════════════════
# NUMBA KERNELS
# ═══════════════════════════════════════════════════════════════════════════════

if _NUMBA_OK:
    @nb.njit(cache=True, nogil=True, fastmath=True)
    def _part_pair(q, r, sl, cw, qm, band, slack):
        n = q.shape[0]
        m = r.shape[0]
        P = sl.shape[0]

        prev = np.empty((P + 1, m + 1), np.float32)
        cur  = np.empty((P + 1, m + 1), np.float32)
        prev[:, :] = BIG

        s0 = min(slack, m)
        for p in range(P + 1):
            for j in range(s0 + 1):
                prev[p, j] = 0.0

        for i in range(1, n + 1):
            cur[:, :] = BIG
            lo = max(1, i - band)
            hi = min(m, i + band)

            for j in range(lo, hi + 1):
                jc = 0.0
                ws = 0.0

                for p in range(P):
                    wt = qm[p, i - 1]
                    if wt > 0.0:
                        s = 0.0
                        for f in range(sl[p, 0], sl[p, 1]):
                            d = q[i - 1, f] - r[j - 1, f]
                            s += d * d
                        c = math.sqrt(s) * wt
                    else:
                        c = 0.0

                    b = prev[p, j]
                    if cur[p, j - 1] < b:
                        b = cur[p, j - 1]
                    if prev[p, j - 1] < b:
                        b = prev[p, j - 1]
                    cur[p, j] = c + b

                    w = cw[p] * wt
                    ws += w
                    jc += w * c

                if ws > 0.0:
                    jc /= ws

                b = prev[P, j]
                if cur[P, j - 1] < b:
                    b = cur[P, j - 1]
                if prev[P, j - 1] < b:
                    b = prev[P, j - 1]
                cur[P, j] = jc + b

            prev, cur = cur, prev

        out = np.empty(P + 1, np.float64)
        for p in range(P + 1):
            b = BIG
            for j in range(max(1, m - slack), m + 1):
                if prev[p, j] < b:
                    b = prev[p, j]
            out[p] = b
        return out


    @nb.njit(cache=True, parallel=True, fastmath=True)
    def _part_many(q, refs, sl, cw, qm, band, slack):
        out = np.empty((refs.shape[0], sl.shape[0] + 1), np.float64)
        for k in nb.prange(refs.shape[0]):
            out[k] = _part_pair(q, refs[k], sl, cw, qm, band, slack)
        return out

    def _kernel_warmup():
        q  = np.zeros((8, 6), np.float32)
        r  = np.zeros((2, 8, 6), np.float32)
        sl = np.array([[0, 3], [3, 6]], np.int64)
        cw = np.ones(2, np.float32)
        qm = np.ones((2, 8), np.float32)
        _part_many(q, r, sl, cw, qm, 3, 1)
else:
    def _part_many(*_a, **_k):  # type: ignore[misc]
        raise RuntimeError("numba unavailable")

    def _kernel_warmup():
        pass


# ═══════════════════════════════════════════════════════════════════════════════
# PART MAP HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def _single_map(n_content: int = DTW_N_CONTENT) -> dict:
    return dict(
        names=["ALL"],
        slices=[[0, n_content]],
        perm=list(range(n_content)),
        groups={"ALL": list(range(n_content))},
        n_content=n_content,
        mode="single",
        dropped=[],
    )


def _rebuild_from_groups(groups: dict, n_content: int, mode: str = "auto") -> dict:
    clean = {k: [] for k in PART_ORDER}
    seen: set[int] = set()
    for k in PART_ORDER:
        for c in groups.get(k, []):
            c = int(c)
            if 0 <= c < n_content and c not in seen:
                clean[k].append(c)
                seen.add(c)
    missing = [c for c in range(n_content) if c not in seen]
    if missing:
        clean["META"].extend(missing)
    names, slices, perm = [], [], []
    for k in PART_ORDER:
        cols = clean[k]
        if cols:
            names.append(k)
            slices.append([len(perm), len(perm) + len(cols)])
            perm.extend(cols)
    return dict(names=names, slices=slices, perm=perm, groups=clean,
                n_content=n_content, mode=mode, dropped=missing)


# ═══════════════════════════════════════════════════════════════════════════════
# AGGREGATION
# ═══════════════════════════════════════════════════════════════════════════════

def _aggregate(rch: np.ndarray, rj: np.ndarray,
               W: np.ndarray, alpha: float, beta: float) -> np.ndarray:
    C, P = rch.shape
    valid = np.isfinite(rch) & (W > 0)
    has   = valid.any(1)

    v = np.where(valid, rch, 0.0)
    w = np.where(valid, W, 0.0).copy()

    worst = np.where(valid, rch, -np.inf).argmax(1)
    rows  = np.arange(C)
    w[rows[has], worst[has]] *= beta

    sw  = w.sum(1)
    agg = np.where(sw > 1e-9, (w * v).sum(1) / np.maximum(sw, 1e-9), np.nan)

    jv = np.isfinite(rj)
    with np.errstate(invalid="ignore"):
        mix = alpha * rj + (1.0 - alpha) * agg

    return np.where(has & jv, mix,
                    np.where(has, agg,
                             np.where(jv, rj, np.nan)))


def _make_r(rch, rj, W, alpha, beta):
    return _aggregate(rch, rj, W, alpha, beta)


# ═══════════════════════════════════════════════════════════════════════════════
# PART BANK
# ═══════════════════════════════════════════════════════════════════════════════

class PartBank:
    """Loads and caches DTW reference sequences from the active model's
    training_data/features/ folder."""

    def __init__(self, fdir: Path, classes: list[str], pmap: dict,
                 base_w: np.ndarray, pr: dict, preload: bool = True):
        self.dir     = fdir
        self.classes = classes
        self.pr      = pr

        self.names   = list(pmap["names"])
        self.P       = len(self.names)
        self.sl      = np.ascontiguousarray(pmap["slices"], np.int64)
        self.perm    = np.ascontiguousarray(pmap["perm"], np.int64)
        self.base_w  = np.ascontiguousarray(base_w, np.float32)

        self.cache:       dict[str, Optional[np.ndarray]] = {}
        self.scales:      dict[str, np.ndarray] = {}
        self.cham_scales: dict[str, np.ndarray] = {}
        self.energy:      dict[str, np.ndarray] = {}
        self.active:      dict[str, np.ndarray] = {}

        self.scr_stack: Optional[np.ndarray] = None
        self.scr_owner: Optional[np.ndarray] = None
        self.gscale = np.ones(self.P + 1, np.float64)
        self._ones  = np.ones((self.P, N_FRAMES), np.float32)

        if preload:
            for g in classes:
                self.refs(g)
            n = sum(len(v) for v in self.cache.values() if v is not None)
            logger.info(f"[DTW] refs: {n} samples, {self.P} channels {self.names}")
            self._global_scale()
            self.build_screen(pr["screen_refs"])
        else:
            logger.info("[DTW] lazy mode: screen disabled")

    # ── reference loading ──────────────────────────────────────────────────
    def refs(self, g: str) -> Optional[np.ndarray]:
        if g in self.cache:
            return self.cache[g]
        arr = None
        p = self.dir / f"{g}.npy"
        if p.exists():
            try:
                a = np.load(p)
                if (a.ndim == 3 and a.shape[1] == N_FRAMES
                        and a.shape[2] >= len(self.perm) and len(a)):
                    a = np.asarray(a[:, :, :DTW_N_CONTENT], np.float32)[:, :, self.perm]
                    a = self._prune(a)
                    arr = np.ascontiguousarray(a, np.float32)
                else:
                    logger.debug(f"[DTW] {p.name} shape {a.shape} skipped")
            except Exception as exc:
                logger.debug(f"[DTW] cannot load {p.name}: {exc}")
        self.cache[g] = arr
        if arr is not None:
            e = np.array(
                [np.sqrt(np.mean(arr[:, :, s:t] ** 2)) if t > s else 0.0
                 for s, t in self.sl],
                np.float64,
            )
            self.energy[g] = e
            self.active[g] = e > 1e-3 * (e.max() + 1e-6)
        return arr

    def _prune(self, a: np.ndarray) -> np.ndarray:
        k = float(self.pr.get("prune", 0.0))
        R = len(a)
        if k <= 0 or R < 5:
            return a
        flat = a.reshape(R, -1).astype(np.float64)
        sd   = flat.std(0) + 1e-6
        z    = flat / sd
        c    = np.median(z, 0)
        d    = np.linalg.norm(z - c, axis=1)
        med  = float(np.median(d))
        mad  = float(np.median(np.abs(d - med))) * 1.4826 + 1e-9
        keep = np.flatnonzero(d <= med + k * mad)
        if len(keep) < max(3, R // 3):
            return a
        return a[keep]

    def _sample_idx(self, R: int, k: int) -> np.ndarray:
        return np.unique(np.linspace(0, R - 1, min(max(k, 1), R)).astype(int))

    def _loo_scale(self, r: Optional[np.ndarray]) -> Optional[np.ndarray]:
        if r is None or len(r) < 2:
            return None
        idx  = self._sample_idx(len(r), self.pr["scale_samples"])
        vals = []
        for i in idx:
            d = _part_many(np.ascontiguousarray(r[i]), r,
                           self.sl, self.base_w, self._ones,
                           self.pr["band"], self.pr["end_slack"])
            d[i] = np.inf
            d = np.sort(d, axis=0)
            kk = min(self.pr["k_avg"], len(r) - 1)
            vals.append(d[:kk].mean(0))
        return np.median(np.asarray(vals), axis=0)

    def _global_scale(self) -> None:
        got = []
        usable = [g for g in self.classes if self.cache.get(g) is not None]
        for g in usable[:24]:
            s = self._loo_scale(self.cache[g])
            if s is not None:
                got.append(s)
        if got:
            self.gscale = np.maximum(np.median(np.asarray(got), 0), 1e-4)
        logger.info("[DTW] global scales: " +
                    " ".join(f"{n}={v:.3f}"
                             for n, v in zip(self.names + ["JOINT"], self.gscale)))
        dead = (self.gscale[:self.P] <= 1.1e-4) & (self.base_w > 0)
        if dead.any():
            names = [n for n, d in zip(self.names, dead) if d]
            logger.info("[DTW] zero-variance channels disabled: " + ", ".join(names))
            self.base_w[dead] = 0.0

    def scale(self, g: str) -> np.ndarray:
        if g in self.scales:
            return self.scales[g]
        s = self._loo_scale(self.refs(g))
        if s is None or not np.isfinite(s).all():
            s = self.gscale.copy()
        s = np.nan_to_num(s, nan=0.0, posinf=0.0, neginf=0.0)
        floor = float(self.pr.get("scale_floor", 0.10))
        s = np.maximum(s, floor * self.gscale)
        s = np.maximum(s, 1e-4)
        self.scales[g] = s
        return s

    # ── screening ─────────────────────────────────────────────────────────
    def build_screen(self, k: int) -> None:
        stack, owner = [], []
        for ci, g in enumerate(self.classes):
            r = self.cache.get(g)
            if r is None:
                continue
            idx = self._cover_refs(r, k)
            stack.append(r[idx])
            owner.extend([ci] * len(idx))
        if stack:
            self.scr_stack = np.ascontiguousarray(
                np.concatenate(stack, 0), np.float32)
            self.scr_owner = np.asarray(owner, np.int64)
            logger.info(
                f"[DTW] screen: {len(self.scr_stack)} refs "
                f"over {len(set(owner))} classes")

    def _cover_refs(self, r: np.ndarray, k: int) -> np.ndarray:
        R = len(r)
        k = int(min(max(k, 1), R))
        if R <= k:
            return np.arange(R)
        flat   = r.reshape(R, -1).astype(np.float64)
        flat   = flat / (flat.std(0) + 1e-6)
        D      = np.linalg.norm(flat[:, None, :] - flat[None, :, :], axis=-1)
        first  = int(np.argmin(D.mean(1)))
        chosen = [first]
        while len(chosen) < k:
            mind = D[:, chosen].min(1)
            mind[chosen] = -1.0
            chosen.append(int(np.argmax(mind)))
        return np.asarray(chosen, int)

    def screen(self, q, qm, cw, alpha, beta) -> np.ndarray:
        out = np.full((len(self.classes), self.P + 1), np.inf)
        if self.scr_stack is None:
            return np.full(len(self.classes), np.nan)
        d = _part_many(q, self.scr_stack, self.sl, cw, qm,
                       self.pr["band"], self.pr["end_slack"])
        d *= self._fix(qm)
        for p in range(self.P + 1):
            np.minimum.at(out[:, p], self.scr_owner, d[:, p])
        r = out / self.gscale[None, :]
        W = np.broadcast_to(cw.astype(np.float64),
                            (len(self.classes), self.P))
        return _aggregate(r[:, :self.P], r[:, self.P], W, alpha, beta)

    def _fix(self, qm: np.ndarray) -> np.ndarray:
        n   = np.maximum(qm.sum(1), 1.0)
        fix = N_FRAMES / n
        nj  = max(float((qm.max(0) > 0).sum()), 1.0)
        return np.concatenate([fix, [N_FRAMES / nj]])

    # ── full distances ─────────────────────────────────────────────────────
    def distances(self, q, glosses, qm, cw,
                  band=None, k=None) -> np.ndarray:
        band = self.pr["band"] if band is None else band
        k    = self.pr["k_avg"] if k is None else k
        out  = np.full((len(glosses), self.P + 1), np.nan)
        fix  = self._fix(qm)
        for i, g in enumerate(glosses):
            r = self.refs(g)
            if r is None:
                continue
            d = np.sort(
                _part_many(q, r, self.sl, cw, qm, band, self.pr["end_slack"]),
                axis=0)
            out[i] = d[:min(k, len(d))].mean(0) * fix
        return out

    def normalise(self, draw, glosses) -> np.ndarray:
        out = np.full_like(draw, np.nan)
        for i, g in enumerate(glosses):
            out[i] = draw[i] / self.scale(g)
        return out

    def weights(self, glosses, cw) -> np.ndarray:
        W = np.tile(cw.astype(np.float64), (len(glosses), 1))
        for i, g in enumerate(glosses):
            act = self.active.get(g)
            if act is not None:
                W[i] *= np.where(act, 1.0, 0.35)
        return W

    # ── chamfer distance (secondary tie-breaker) ───────────────────────────
    def _cham(self, a: np.ndarray, b: np.ndarray, cw: np.ndarray) -> np.ndarray:
        out = np.empty(self.P + 1)
        tot = 0.0
        for p, (s, t) in enumerate(self.sl):
            A = a[:, s:t]
            B = b[:, s:t]
            d = np.sqrt(
                np.maximum(((A[:, None, :] - B[None, :, :]) ** 2).sum(-1), 0.0)
            )
            out[p] = 0.5 * (d.min(1).mean() + d.min(0).mean())
            tot += float(cw[p]) * out[p]
        out[self.P] = tot / max(float(cw.sum()), 1e-6)
        return out

    def chamfer_scale(self, g: str) -> np.ndarray:
        if g in self.cham_scales:
            return self.cham_scales[g]
        r = self.refs(g)
        s = self.gscale.copy()
        if r is not None and len(r) >= 3:
            idx = self._sample_idx(len(r), 3)
            vals = []
            for i in idx:
                others = [j for j in range(len(r)) if j != i][:4]
                vals.append(
                    np.mean([self._cham(r[i], r[j], self.base_w) for j in others], 0)
                )
            s = np.maximum(np.median(np.asarray(vals), 0), 1e-4)
        self.cham_scales[g] = s
        return s

    def chamfer_dist(self, q: np.ndarray, g: str, cw: np.ndarray) -> np.ndarray:
        r = self.refs(g)
        if r is None:
            return np.full(self.P + 1, np.nan)
        d = np.sort(np.asarray([self._cham(q, x, cw) for x in r]), 0)
        return d[:min(3, len(d))].mean(0)


# ═══════════════════════════════════════════════════════════════════════════════
# FUSION + DECISION  (direct port from dl_nondl_recognize.py)
# ═══════════════════════════════════════════════════════════════════════════════

def _softmax(x: np.ndarray) -> np.ndarray:
    e = np.exp(x - x.max())
    return e / e.sum()


def _fuse_scores(p, r, pr):
    dl_rel = (p / max(float(p.max()), 1e-9)) ** (1.0 / max(pr["dl_temp"], 1e-3))
    fin    = np.isfinite(r)
    dtw_rel = np.ones(len(r))
    if fin.any():
        rmin = max(float(r[fin].min()), 1e-6)
        dtw_rel[fin]  = (rmin / np.maximum(r[fin], 1e-6)) ** pr["pow"]
        dtw_rel[~fin] = float(dtw_rel[fin].mean())
    score = pr["w_dl"] * dl_rel + pr["w_dtw"] * dtw_rel
    return score, dl_rel, dtw_rel


def _decide(ev: dict, pr: dict, deep_r: Optional[dict] = None,
            rule: str = "v2") -> dict:
    p = ev["p"]
    r = ev["r"].copy()
    if deep_r:
        for i, v in deep_r.items():
            if np.isfinite(v):
                r[i] = v

    C, n_dl   = len(p), ev["n_dl"]
    fused, dl_rel, dtw_rel = _fuse_scores(p, r, pr)

    dl_order  = [int(i) for i in np.argsort(-p, kind="stable")]
    dtw_order = [int(i)
                 for i in np.argsort(np.where(np.isfinite(r), r, np.inf),
                                     kind="stable")
                 if np.isfinite(r[i])]

    dl_set  = set(range(n_dl))
    dtw_set = set(dtw_order[:pr["top_n"]])
    by_fused = [int(i) for i in np.argsort(-fused, kind="stable")]
    inter    = [i for i in by_fused if i in dl_set and i in dtw_set]
    gall     = by_fused[0]

    p1 = float(p[dl_order[0]])
    p2 = float(p[dl_order[1]]) if C > 1 else 0.0
    dl_strong = (p1 >= pr["p_hi"]) or ((p1 - p2) >= pr["m_hi"])

    if dtw_order:
        rb = float(r[dtw_order[0]])
        rs = float(r[dtw_order[1]]) if len(dtw_order) > 1 else rb * 3.0
        dmargin = (rs - rb) / max(rb, 1e-6)
    else:
        rb, dmargin = float("inf"), 0.0

    dtw_strong = (rb <= pr["r_good"]) and (dmargin >= pr["d_margin"])

    if inter:
        finalists = [
            inter[0],
            inter[1] if len(inter) > 1 else by_fused[min(1, C - 1)],
        ]
        if gall not in inter:
            finalists = [inter[0], gall]
    else:
        d0    = dl_order[0]
        other = gall if gall != d0 else (dtw_order[0] if dtw_order else d0)
        finalists = [d0, other]

    finalists = list(dict.fromkeys(finalists))
    gap = (abs(float(fused[finalists[0]] - fused[finalists[1]]))
           if len(finalists) > 1 else 1.0)
    want_deep = (gap < pr["close_gap"]) or (not inter) or (gall not in inter)

    if rule == "v1":
        if inter:
            win, flag = inter[0], "consensus"
        else:
            win, flag = dl_order[0], "DL kept"
    else:
        if inter:
            win, flag = inter[0], "consensus"
            if (gall not in inter
                    and (fused[gall] - fused[inter[0]]) > pr["rescue_gap"]
                    and not dl_strong
                    and np.isfinite(r[gall])
                    and r[gall] <= pr["r_ok"]):
                win, flag = gall, "rescued"
        else:
            if dl_strong or not dtw_strong:
                win, flag = dl_order[0], "DL kept"
            else:
                win, flag = gall, "DTW led"

    ranking = [win] + [i for i in by_fused if i != win]
    second  = ranking[1] if len(ranking) > 1 else win
    gap     = float(fused[win] - fused[second])
    gnorm   = float(np.clip(gap / 0.25, 0.0, 1.0))

    conf = float(np.clip(
        0.45 * dl_rel[win] + 0.35 * dtw_rel[win] + 0.20 * gnorm, 0, 1))

    qual = str(ev.get("note", ""))
    low = (
        flag in ("DL kept", "DTW led", "rescued")
        or gap < pr["low_gap"]
        or rb > 1.60
        or (p1 < 0.25 and dmargin < 0.08)
        or qual.startswith("single frame")
        or qual.startswith("hands absent")
    )

    return dict(
        win=win, ranking=ranking, flag=flag, low=low,
        conf=conf, gap=gap, fused=fused, dl_rel=dl_rel, dtw_rel=dtw_rel,
        inter=inter, dl_order=dl_order, dtw_order=dtw_order,
        finalists=finalists, want_deep=want_deep, deep=bool(deep_r),
        r=r, p1=p1, dl_margin=p1 - p2, r_best=rb, d_margin=dmargin,
    )


# Singleton engine state
_lock  = threading.Lock()
_bank: Optional[PartBank] = None
_pmap: Optional[dict]     = None
_base_w: Optional[np.ndarray] = None
_classes: list[str] = []
_active_pr: dict = dict(PR)
_ready = False

RECOGNITION_SETTINGS = {
    "rule": "v2",
    "part_on": True,
    "use_mask": True,
    "n_frames": N_FRAMES,
    "n_features": N_FEATURES,
    "dtw_n_content": DTW_N_CONTENT,
    "min_real_frames": MIN_REAL_FRAMES,
    "pr": dict(PR),
    "part_w": dict(PART_W_DEFAULTS),
}


def get_recognition_config() -> dict:
    """Return the active centralized recognition configuration."""
    with _lock:
        return {
            "rule": "v2",
            "part_on": True,
            "use_mask": True,
            "n_frames": N_FRAMES,
            "n_features": N_FEATURES,
            "dtw_n_content": DTW_N_CONTENT,
            "min_real_frames": MIN_REAL_FRAMES,
            "dtw_ready": _ready,
            "pr": dict(_active_pr),
            "part_w": dict(PART_W_DEFAULTS),
        }


def _load_part_map(run_dir: Path, n_content: int) -> dict:
    """Load cached part_map.json from model run dir, or fall back to single."""
    pmap_file = run_dir / "part_map.json"
    if not pmap_file.exists():
        # Also try the model_training_zone copy
        pmap_file = Path(__file__).resolve().parent.parent / "model_training_zone" / "part_map.json"

    if pmap_file.exists():
        try:
            raw = json.loads(pmap_file.read_text(encoding="utf-8"))
            if raw.get("mode") == "single" or raw.get("names") == ["ALL"]:
                return _single_map(n_content)
            pmap = _rebuild_from_groups(raw.get("groups", {}), n_content, "auto")
            logger.info(f"[DTW] part map loaded from {pmap_file.name}: {pmap['names']}")
            return pmap
        except Exception as exc:
            logger.warning(f"[DTW] could not load part map ({exc}), using single-channel")

    return _single_map(n_content)


def init_engine(run_dir: Path, classes: list[str]) -> bool:
    """
    Load the PartBank for the given model run directory.
    ``classes`` must be the ONNX classes list (same order).
    Call this once from main.py after the ONNX session is loaded.

    Returns True if the DTW bank loaded successfully.
    """
    global _bank, _pmap, _base_w, _classes, _active_pr, _ready

    if not _NUMBA_OK:
        logger.warning("[DTW] engine not initialised (numba missing).")
        return False

    feature_dir = run_dir / "training_data" / "features"
    if not feature_dir.is_dir():
        logger.warning(f"[DTW] no features dir at {feature_dir} — engine disabled.")
        return False

    # Only load glosses that have .npy reference files
    available = {p.stem for p in feature_dir.glob("*.npy")}
    sign_classes = [c for c in classes if c in available]
    if not sign_classes:
        logger.warning("[DTW] no matching .npy reference files — engine disabled.")
        return False

    pr = dict(PR)
    part_mult: dict[str, float] = {}
    for cand_tune in (
        run_dir / "hybrid_v2_tuned.json",
        Path(__file__).resolve().parent.parent / "model_training_zone" / "hybrid_v2_tuned.json",
    ):
        if cand_tune.exists():
            try:
                blob = json.loads(cand_tune.read_text(encoding="utf-8"))
                pr.update(blob.get("params", {}))
                part_mult = blob.get("part_mult", {})
                logger.info(f"[DTW] loaded tuned params from {cand_tune.name}")
                break
            except Exception as exc:
                logger.warning(f"[DTW] could not load {cand_tune.name}: {exc}")

    pmap   = _load_part_map(run_dir, DTW_N_CONTENT)
    names  = pmap["names"]
    base_w = np.array(
        [PART_W_DEFAULTS.get(n, 0.6) * float(part_mult.get(n, 1.0)) for n in names],
        np.float32,
    )

    logger.info(f"[DTW] initialising PartBank for {len(sign_classes)} classes …")
    try:
        _kernel_warmup()   # JIT compile before we block on preload
        bank = PartBank(feature_dir, sign_classes, pmap, base_w, pr, preload=True)
    except Exception as exc:
        logger.error(f"[DTW] PartBank init failed: {exc}")
        return False

    with _lock:
        _bank      = bank
        _pmap      = pmap
        _base_w    = base_w
        _classes   = sign_classes
        _active_pr = pr
        _ready     = True

    logger.info("[DTW] engine ready.")
    return True


def is_ready() -> bool:
    return _ready


def _hold_valid(arr: np.ndarray) -> np.ndarray:
    """Forward-fill then backward-fill NaN frames along axis 0 (mirrors V1._hold_valid)."""
    out = arr.copy()
    F = len(out)
    if F == 0:
        return out
    flat = out.reshape(F, -1)
    valid = np.isfinite(flat).all(axis=1)
    if not valid.any():
        return out
    last = None
    for i in range(F):
        if valid[i]:
            last = out[i].copy()
        elif last is not None:
            out[i] = last
    first_idx = int(np.argmax(valid))
    for i in range(first_idx):
        out[i] = out[first_idx]
    return out


def _select_indices(complete: np.ndarray, max_gap: int = 5) -> list[int] | None:
    """Select N_FRAMES evenly spaced complete frames (mirrors V1._select)."""
    F = len(complete)
    if F == 0:
        return None
    nxt = np.empty(F, int)
    cur = -1
    for i in range(F - 1, -1, -1):
        if complete[i]:
            cur = i
        nxt[i] = cur
    positions = np.floor(np.arange(N_FRAMES) * (F - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    chosen = []
    for p in positions:
        ci = int(nxt[p])
        if ci < 0 or ci - p > max_gap:
            return None
        chosen.append(ci)
    return chosen


def _stretch_indices(complete: np.ndarray) -> list[int] | None:
    """Stretch available complete frames to N_FRAMES (mirrors V1._stretch)."""
    idx = np.flatnonzero(complete)
    if len(idx) == 0:
        return None
    pos = np.floor(np.arange(N_FRAMES) * (len(idx) - 1) / (N_FRAMES - 1) + 0.5).astype(int)
    return [int(idx[p]) for p in pos]


def _variant_idx(chosen: list[int], kind: int) -> list[int]:
    n = len(chosen)
    t = np.linspace(0.0, 1.0, n)
    if kind == 0:
        m = t
    elif kind == 1:
        m = t ** 0.88
    elif kind == 2:
        m = t ** 1.14
    else:
        m = 0.07 + 0.86 * t
    pos = np.clip(np.round(m * (n - 1)).astype(int), 0, n - 1)
    return [int(chosen[i]) for i in pos]


def build_clip2(frames: list[dict | None], duration: float, n_tta: int = 4) -> dict | None:
    """
    Exact port of build_clip2() from dl_nondl_recognize_v2.py.
    Returns dict(feats, variants, note, real, parts) or None if no valid frames.
    """
    from backend.extract import (
        complete_mask_single,
        frame_features,
        frame_in_use,
    )

    valid_frames = [f for f in frames if f is not None]
    if not valid_frames:
        return None

    W = int(valid_frames[0]["W"])
    H = int(valid_frames[0]["H"])
    F = len(frames)

    pose = np.full((F, 8, 4), np.nan, np.float32)
    pose[:, :, 3] = 0.0
    hands = np.full((F, 2, 21, 3), np.nan, np.float32)
    face = np.full((F, len(valid_frames[0]["face"]), 3), np.nan, np.float32)
    face_ok = np.zeros(F, bool)
    in_use = np.zeros((F, 2), bool)
    held = np.zeros((F, 2), bool)

    for i, fr in enumerate(frames):
        if fr is None:
            continue
        pose[i] = fr["pose"]
        hands[i] = fr["hands"]
        face[i] = fr["face"]
        face_ok[i] = bool(fr["face_ok"])
        in_use[i] = fr["in_use"] if "in_use" in fr else frame_in_use(fr["pose"], W, H)
        if "held" in fr:
            held[i] = fr["held"]

    miss_l = in_use[:, 0].astype(bool) & np.isnan(hands[:, 0, 0, 0])
    miss_r = in_use[:, 1].astype(bool) & np.isnan(hands[:, 1, 0, 0])
    bad_l = miss_l | held[:, 0]
    bad_r = miss_r | held[:, 1]
    bad_body = ~np.isfinite(pose[:, :, 0]).all(1)
    bad_face = ~face_ok
    n_miss_raw = int((miss_l | miss_r).sum())
    n_held = int(held.any(1).sum())

    pose_f = _hold_valid(pose)
    hands_f = _hold_valid(hands)
    face_f = _hold_valid(face)

    vis_nan = np.isnan(pose[:, :, 0])
    pose_f[:, :, 3] = np.where(
        vis_nan, 0.9, np.nan_to_num(pose_f[:, :, 3], nan=0.0)
    )
    face_ok_f = face_ok | np.isfinite(face_f).all(axis=(1, 2))

    still_nan = np.isnan(hands_f[:, :, 0, 0])
    iu = in_use.copy()
    iu[:, :2] &= ~still_nan[:, :2]

    complete = np.array(
        [complete_mask_single(pose_f[i], hands_f[i], bool(face_ok_f[i]), iu[i], W, H)
         for i in range(F)],
        dtype=bool,
    )

    note = "ok"
    chosen = _select_indices(complete)
    if chosen is None:
        chosen = _stretch_indices(complete)
        if chosen is not None:
            note = f"stretched from {int(complete.sum())}/{F} frames"
    if chosen is None:
        iu3 = iu.copy()
        iu3[:, :2] = False
        c3 = np.array(
            [complete_mask_single(pose_f[i], hands_f[i], bool(face_ok_f[i]), iu3[i], W, H)
             for i in range(F)],
            dtype=bool,
        )
        chosen = _select_indices(c3) or _stretch_indices(c3)
        if chosen is not None:
            iu, note = iu3, "hands absent; pose-only geometry"
    if chosen is None:
        def _frac_finite(a):
            flat = np.isfinite(a).reshape(F, -1)
            return flat.mean(axis=1) if flat.shape[1] else np.zeros(F)

        score = (
            2.0 * _frac_finite(hands_f)
            + 1.0 * _frac_finite(pose_f)
            + 0.3 * _frac_finite(face_f)
        )
        b = int(np.argmax(score))
        chosen = [b] * N_FRAMES
        note = f"single frame {b} held (very low quality)"

    if note == "ok" and (n_miss_raw or n_held):
        note = f"filled {n_miss_raw}/{F} missing-hand frames ({n_held} motion-held)"

    ch = np.asarray(chosen, int)
    parts = {
        "LH": ~bad_l[ch],
        "RH": ~bad_r[ch],
        "BOTH": (~bad_l & ~bad_r)[ch],
        "BODY": ~bad_body[ch],
        "FACE": ~bad_face[ch],
        "REST": (~bad_l & ~bad_r & ~bad_body)[ch],
        "META": ~(bad_l | bad_r)[ch],
        "ALL": ~(bad_l | bad_r)[ch],
    }
    real = parts["ALL"]
    if int(real.sum()) < MIN_REAL_FRAMES:
        parts = {k: np.ones(N_FRAMES, bool) for k in parts}
        real = parts["ALL"]

    def make(idxs):
        with np.errstate(all="ignore"):
            f = np.stack(
                [frame_features(pose_f[i], hands_f[i], face_f[i], iu[i], W, H, duration)
                 for i in idxs]
            )
        return np.nan_to_num(
            f.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0
        )[None]

    feats = make(chosen)
    variants = [feats]
    for kind in range(1, max(int(n_tta), 1)):
        variants.append(make(_variant_idx(chosen, kind)))

    return dict(
        feats=feats,
        variants=variants,
        note=note,
        real=real,
        parts=parts,
    )


def build_clip_from_frames(frames: list[dict | None], duration: float) -> np.ndarray | None:
    """Backwards-compatible wrapper returning (N_FRAMES, N_FEATURES) float32 array."""
    clip = build_clip2(frames, duration, n_tta=1)
    return clip["feats"][0] if clip is not None else None


def channel_masks(parts: dict, names: list[str], use_mask: bool = True):
    P = len(names)
    if not use_mask or not parts:
        return np.ones((P, N_FRAMES), np.float32), np.ones(P), False
    qm = np.stack([parts.get(n, parts["ALL"]).astype(np.float32) for n in names])
    n = qm.sum(1)
    ok = n >= MIN_REAL_FRAMES
    fallback = False
    if not ok.any():
        qm = np.ones((P, N_FRAMES), np.float32)
        ok = np.ones(P, bool)
        n = qm.sum(1)
        fallback = True
    rel = np.where(ok, 0.35 + 0.65 * (n / N_FRAMES), 0.0)
    return np.ascontiguousarray(qm, np.float32), rel, fallback


def _tta_variants(clip: np.ndarray, n_tta: int = 4) -> list[np.ndarray]:
    """Build temporal test-time augmentation variants from a (1, 64, 98) clip,
    matching _variant_idx() in dl_nondl_recognize.py."""
    base = clip[0] if clip.ndim == 3 else clip  # (64, 98)
    n = base.shape[0]
    t = np.linspace(0.0, 1.0, n)
    variants = [base[None].astype(np.float32)]
    for kind in range(1, max(int(n_tta), 1)):
        if kind == 1:
            m = t ** 0.88
        elif kind == 2:
            m = t ** 1.14
        else:
            m = 0.07 + 0.86 * t
        pos = np.clip(np.round(m * (n - 1)).astype(int), 0, n - 1)
        variants.append(base[pos][None].astype(np.float32))
    return variants


def _dl_probs(onnx_session, input_name: str, variants: list[np.ndarray]) -> tuple[np.ndarray, float]:
    """Average softmax probabilities over TTA variants with [0.40, 0.20, 0.20, 0.20]."""
    w = np.asarray([0.40, 0.20, 0.20, 0.20][:len(variants)], np.float64)
    w /= w.sum()
    ps = []
    for v in variants:
        logits = onnx_session.run(None, {input_name: v})[0][0]
        ps.append(_softmax(logits.astype(np.float64)))
    ps_arr = np.asarray(ps)
    p = (w[:, None] * ps_arr).sum(0)
    tops = ps_arr.argmax(1)
    stability = float(np.mean(tops == tops[0]))
    return p, stability


def _deep_pair(
    bank: PartBank,
    q: np.ndarray,
    qm: np.ndarray,
    cw: np.ndarray,
    alpha: float,
    beta: float,
    cands: list[str],
    pr: dict,
    idxs: list[int],
) -> dict[int, float]:
    """Deep DTW + Chamfer tie-breaker on close finalists, matching deep_pair()
    in dl_nondl_recognize.py."""
    out: dict[int, float] = {}
    wch = pr["chamfer_w"]
    for i in idxs:
        g = cands[i]
        dd = bank.distances(q, [g], qm, cw, pr["deep_band"], pr["deep_k"])
        dn = bank.normalise(dd, [g])
        W  = bank.weights([g], cw)

        r_dtw = float(_make_r(dn[:, :bank.P], dn[:, bank.P], W, alpha, beta)[0])
        r_final = r_dtw

        if wch > 0:
            try:
                cd = bank.chamfer_dist(q, g, cw)[None, :]
                cs = bank.chamfer_scale(g)[None, :]
                rc = float(_make_r(
                    cd[:, :bank.P] / cs[:, :bank.P],
                    cd[:, bank.P] / cs[:, bank.P],
                    W, alpha, beta,
                )[0])
                if np.isfinite(rc) and np.isfinite(r_dtw):
                    r_final = (1.0 - wch) * r_dtw + wch * rc
            except Exception:
                pass

        out[i] = r_final
    return out


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════════

def hybrid_recognize(
    clip,
    onnx_session,
    input_name: str,
    all_classes: list[str],
) -> dict:
    """
    Run the Part-Robust DTW + DL hybrid v2 recogniser on either a build_clip2()
    dict or a (1, 64, 98) clip array.

    Falls back to pure ONNX if the DTW bank is not ready.
    """
    if isinstance(clip, dict):
        clip_arr = clip["feats"]
        variants = clip["variants"]
        parts = clip.get("parts")
        note = clip.get("note", "ok")
    else:
        clip_arr = clip[None] if clip.ndim == 2 else clip
        variants = _tta_variants(clip_arr, PR["tta"])
        parts = None
        note = "ok"

    if not _ready:
        return _pure_onnx(clip_arr, onnx_session, input_name, all_classes)

    with _lock:
        bank     = _bank
        base_w   = _base_w.copy()
        pr       = dict(_active_pr)
        sign_cls = list(_classes)

    # ── DL probabilities over ALL classes (with 4x TTA) ──────────────────
    variants = variants[:max(int(pr["tta"]), 1)]
    p_all, stab = _dl_probs(onnx_session, input_name, variants)

    # Restrict to sign classes the bank knows about
    cls_index    = {c: i for i, c in enumerate(all_classes)}
    bank_indices = [cls_index[c] for c in sign_cls if c in cls_index]
    if not bank_indices:
        return _pure_onnx(clip_arr, onnx_session, input_name, all_classes)

    p_bank = p_all[bank_indices]   # probabilities for the DTW classes

    # ── query tensor & channel masks ─────────────────────────────────────
    q_full = clip_arr[0]                       # (64, 98)
    q = np.ascontiguousarray(
        q_full[:, :DTW_N_CONTENT][:, bank.perm], np.float32)

    qm, rel, fb = channel_masks(parts, bank.names, use_mask=bool(parts))
    if fb:
        note = f"{note} | masks fell back to all frames" if note != "ok" else "masks fell back to all frames"
    cw  = np.ascontiguousarray(base_w * rel, np.float32)
    alpha = pr["alpha"]
    beta  = pr["beta"]

    # ── DTW screen → candidate union ──────────────────────────────────────
    dl_top_idx = [int(i) for i in np.argsort(-p_bank)[:pr["top_n"]]]
    scr = bank.screen(q, qm, cw, alpha, beta)
    scr_top = [int(i)
               for i in np.argsort(np.where(np.isfinite(scr), scr, np.inf))
               if np.isfinite(scr[i])][:max(pr["screen_top"], 0)]

    U     = dl_top_idx + [i for i in scr_top if i not in dl_top_idx]
    cands = [sign_cls[i] for i in U]

    # ── full DTW on candidates ────────────────────────────────────────────
    draw = bank.distances(q, cands, qm, cw)
    rn   = bank.normalise(draw, cands)
    W    = bank.weights(cands, cw)
    rch, rj = rn[:, :bank.P], rn[:, bank.P]
    r       = _make_r(rch, rj, W, alpha, beta)

    # ── pass 1 decision → optional deep DTW + Chamfer tie-breaker ────────
    ev   = dict(p=p_bank[U], r=r, n_dl=len(dl_top_idx), note=note)
    dec0 = _decide(ev, pr, None, rule="v2")
    deep_r = None
    if dec0["want_deep"] and len(dec0["finalists"]) > 1:
        deep_r = _deep_pair(
            bank, q, qm, cw, alpha, beta, cands, pr, dec0["finalists"]
        )
    dec = _decide(ev, pr, deep_r, rule="v2")

    win_cand = cands[dec["win"]]
    win_conf = float(dec["conf"])

    ranking = dec["ranking"]
    top_fused = max(float(dec["fused"][ranking[0]]), 1e-9) if ranking else 1.0
    top3 = [
        {
            "label": cands[i],
            "confidence": float(np.clip(dec["fused"][i] / top_fused * win_conf if i != dec["win"] else win_conf, 0.0, 1.0)),
            "dl_prob": float(p_bank[U[i]]),
        }
        for i in ranking[:3]
    ]

    margin = float(
        p_bank[U[dec["ranking"][0]]] - p_bank[U[dec["ranking"][1]]]
        if len(ranking) > 1 else 1.0
    )

    return {
        "label":         win_cand,
        "confidence":    win_conf,
        "margin":        margin,
        "top3":          top3,
        "flag":          dec["flag"],
        "low":           bool(dec["low"]),
        "note":          note,
        "tta_stability": stab,
        "r_best":        float(dec["r_best"]) if np.isfinite(dec["r_best"]) else None,
        "dtw_active":    True,
    }


def _pure_onnx(clip, session, input_name, all_classes) -> dict:
    """Fallback: plain softmax over ONNX logits."""
    logits = session.run(None, {input_name: clip.astype(np.float32)})[0][0]
    probs  = _softmax(logits.astype(np.float64))
    order  = np.argsort(probs)[::-1][:3]
    top_p  = float(probs[order[0]])
    margin = float(probs[order[0]] - probs[order[1]]) if len(order) > 1 else 1.0
    return {
        "label":      all_classes[int(order[0])],
        "confidence": top_p,
        "margin":     margin,
        "top3":       [{"label": all_classes[int(i)], "confidence": float(probs[i])}
                       for i in order],
        "flag":       "ONNX only",
        "dtw_active": False,
    }

