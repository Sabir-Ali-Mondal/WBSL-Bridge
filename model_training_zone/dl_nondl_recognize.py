#!/usr/bin/env python3
"""
dl_nondl_recognize_v2.py - Part-Robust Multi-View DTW + DL hybrid recogniser.

Keep beside:
  extract.py
  dl_nondl_recognize.py

Run:
  py model_training_zone\dl_nondl_recognize_v2.py
  py model_training_zone\dl_nondl_recognize_v2.py --selftest
  py model_training_zone\dl_nondl_recognize_v2.py --replay --tune-parts

Keys:
  M       toggle AUTO / TIMED
  L       label last result
  V       toggle v1 / v2 decision rule
  B       toggle part-robust / joint-only DTW
  Q / ESC quit
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import sys
import time
from collections import deque
from pathlib import Path

import cv2
import numba as nb
import numpy as np

import extract as EX
import dl_nondl_recognize as V1


# --------------------------------------------------------------------------- #
# CONFIG
# --------------------------------------------------------------------------- #
HERE = Path(__file__).resolve().parent
PART_MAP_FILE = HERE / "part_map.json"
EVAL_CSV = HERE / "hybrid_v2_eval.csv"
TUNE_FILE = HERE / "hybrid_v2_tuned.json"
REC_DIR = V1.RECORDINGS_DIR

N_FRAMES = EX.N_FRAMES
N_CONTENT = V1.DTW_N_CONTENT
MIN_REAL = V1.MIN_REAL_FRAMES
MIN_SPAN_FRAMES = 12
BIG = 1e18

PART_ORDER = ["LH", "RH", "BOTH", "BODY", "FACE", "REST", "META"]

PART_W = {
    "LH": 1.00,
    "RH": 1.00,
    "BOTH": 0.85,
    "BODY": 0.55,
    "FACE": 0.35,
    "REST": 0.70,
    "META": 0.00,
    "ALL": 1.00,
}

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


# --------------------------------------------------------------------------- #
# NUMBA MULTI-VIEW DTW
# --------------------------------------------------------------------------- #
@nb.njit(cache=True, nogil=True, fastmath=True)
def _part_pair(q, r, sl, cw, qm, band, slack):
    n = q.shape[0]
    m = r.shape[0]
    P = sl.shape[0]

    prev = np.empty((P + 1, m + 1), np.float32)
    cur = np.empty((P + 1, m + 1), np.float32)
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


def kernel_warmup():
    q = np.zeros((8, 6), np.float32)
    r = np.zeros((2, 8, 6), np.float32)
    sl = np.array([[0, 3], [3, 6]], np.int64)
    cw = np.ones(2, np.float32)
    qm = np.ones((2, 8), np.float32)
    _part_many(q, r, sl, cw, qm, 3, 1)


# --------------------------------------------------------------------------- #
# PART MAP
# --------------------------------------------------------------------------- #
def single_map(n_content=N_CONTENT):
    return dict(
        names=["ALL"],
        slices=[[0, n_content]],
        perm=list(range(n_content)),
        groups={"ALL": list(range(n_content))},
        n_content=n_content,
        mode="single",
        dropped=[],
    )


def rebuild_from_groups(groups, n_content, mode="auto"):
    clean = {k: [] for k in PART_ORDER}
    seen = set()

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

    return dict(
        names=names,
        slices=slices,
        perm=perm,
        groups=clean,
        n_content=n_content,
        mode=mode,
        dropped=missing,
    )


def _synth_base():
    W, H = 480, 360

    pose = np.zeros((8, 4), np.float32)
    pose[:, 3] = 1.0
    pose[:, 2] = -0.05

    known = {
        EX.P_LSH: (0.40, 0.32),
        EX.P_RSH: (0.60, 0.32),
        EX.P_LHIP: (0.43, 0.74),
        EX.P_RHIP: (0.57, 0.74),
        EX.P_LWR: (0.33, 0.44),
        EX.P_RWR: (0.67, 0.44),
    }
    for i in range(8):
        pose[i, :2] = known.get(i, (0.45 + 0.10 * (i % 2), 0.52))

    hands = np.zeros((2, 21, 3), np.float32)
    for h, wi in ((0, EX.P_LWR), (1, EX.P_RWR)):
        wx, wy = pose[wi, :2]
        sgn = -1.0 if h == 0 else 1.0
        hands[h, 0] = (wx, wy, -0.05)
        for f in range(5):
            ang = -0.55 + 0.28 * f
            for j in range(4):
                rad = 0.018 + 0.016 * (j + 1)
                hands[h, 1 + 4 * f + j] = (
                    wx + sgn * rad * math.sin(ang),
                    wy - rad * math.cos(ang),
                    -0.05 - 0.004 * j,
                )

    K = len(EX.FACE_CACHE_IDX)
    face = np.zeros((K, 3), np.float32)
    if K:
        ang = np.linspace(0, 2 * np.pi, K, endpoint=False)
        rr = 0.6 + 0.4 * np.random.default_rng(3).random(K)
        face[:, 0] = 0.50 + 0.050 * rr * np.cos(ang)
        face[:, 1] = 0.19 + 0.060 * rr * np.sin(ang)
        face[:, 2] = -0.03

    try:
        iu = np.ones(np.asarray(EX.frame_in_use(pose, W, H)).shape, bool)
    except Exception:
        iu = np.ones(3, bool)

    return pose, hands, face, iu, W, H


def discover_parts(n_content=N_CONTENT, trials=6, amp=0.035, thr=0.02, verbose=True):
    base = _synth_base()
    pose0, hands0, face0, iu0, W, H = base

    def feats(pose, hands, face, iu):
        f = EX.frame_features(pose, hands, face, iu, W, H, 2.0)
        return np.nan_to_num(np.asarray(f, np.float64).ravel(), nan=0.0)

    f0 = feats(pose0, hands0, face0, iu0)
    D = min(len(f0), n_content)
    f0 = f0[:D]

    shoulder = {int(EX.P_LSH), int(EX.P_RSH)}
    rng = np.random.default_rng(11)
    sens = {k: np.zeros(D) for k in ("LH", "RH", "BODY", "FACE")}

    def record(key, f):
        d = np.abs(f[:D] - f0) / (0.05 + np.abs(f0))
        sens[key] = np.maximum(sens[key], d)

    for _ in range(trials):
        for key in sens:
            pose = pose0.copy()
            hands = hands0.copy()
            face = face0.copy()
            iu = iu0.copy()

            if key == "LH":
                hands[0] += rng.normal(0, amp, hands[0].shape).astype(np.float32)
            elif key == "RH":
                hands[1] += rng.normal(0, amp, hands[1].shape).astype(np.float32)
            elif key == "BODY":
                for i in range(8):
                    if i not in shoulder:
                        pose[i, :3] += rng.normal(0, amp, 3).astype(np.float32)
            else:
                face += rng.normal(0, amp * 0.6, face.shape).astype(np.float32)

            try:
                record(key, feats(pose, hands, face, iu))
            except Exception:
                pass

    for key, h, slot in (("LH", 0, 0), ("RH", 1, 1), ("FACE", -1, 2)):
        pose = pose0.copy()
        hands = hands0.copy()
        face = face0.copy()
        iu = iu0.copy()

        if h >= 0:
            hands[h] = np.nan
            if iu.size > slot:
                iu[slot] = False
        else:
            face[:] = np.nan
            if iu.size > 2:
                iu[2] = False

        try:
            record(key, feats(pose, hands, face, iu))
        except Exception:
            pass

    S = np.stack([sens["LH"], sens["RH"], sens["BODY"], sens["FACE"]], 1)
    names4 = ["LH", "RH", "BODY", "FACE"]
    groups = {k: [] for k in PART_ORDER}

    for j in range(D):
        s = S[j]
        if s.max() <= thr:
            groups["META"].append(j)
            continue

        order = np.argsort(-s)
        a, b = int(order[0]), int(order[1])

        if s[a] >= 2.0 * max(s[b], 1e-6):
            groups[names4[a]].append(j)
        elif s[0] > thr and s[1] > thr and s[2] <= thr and s[3] <= thr:
            groups["BOTH"].append(j)
        else:
            groups["REST"].append(j)

    if not groups["LH"] or not groups["RH"]:
        print(
            "WARN: part discovery could not isolate both hands. "
            "Falling back to single-channel DTW."
        )
        return single_map(n_content)

    pmap = rebuild_from_groups(groups, n_content, mode="auto")
    pmap["dropped"] = groups["META"]

    if verbose:
        print("Part map:")
        for k in PART_ORDER:
            cols = pmap["groups"].get(k, [])
            if cols:
                show = ",".join(map(str, cols[:14])) + (" ..." if len(cols) > 14 else "")
                print(f"  {k:<5} {len(cols):>3} cols : {show}")
        print(f"  META/constant columns kept: {len(groups['META'])}")

    return pmap


def get_part_map(args):
    if args.parts == "off":
        return single_map(args.n_content)

    if args.part_map:
        pmap = json.loads(Path(args.part_map).read_text(encoding="utf-8"))
        if pmap.get("mode") == "single" or pmap.get("names") == ["ALL"]:
            return single_map(args.n_content)
        pmap = rebuild_from_groups(pmap.get("groups", {}), args.n_content, "auto")
        print(f"Part map : loaded {args.part_map} ({pmap['names']})")
        return pmap

    if PART_MAP_FILE.exists() and not args.rediscover:
        try:
            old = json.loads(PART_MAP_FILE.read_text(encoding="utf-8"))
            if old.get("n_content") == args.n_content:
                if old.get("mode") == "single" or old.get("names") == ["ALL"]:
                    return single_map(args.n_content)

                old_perm = set(old.get("perm", []))
                pmap = rebuild_from_groups(old.get("groups", {}), args.n_content, "auto")
                added = [c for c in pmap["perm"] if c not in old_perm]
                if added:
                    print(f"Part map : added previously dropped columns to META: {added}")
                else:
                    print(f"Part map : cached {PART_MAP_FILE.name} ({pmap['names']})")

                PART_MAP_FILE.write_text(json.dumps(pmap, indent=1), encoding="utf-8")
                return pmap
        except Exception:
            pass

    pmap = discover_parts(args.n_content)
    try:
        PART_MAP_FILE.write_text(json.dumps(pmap, indent=1), encoding="utf-8")
        print(f"Part map : saved {PART_MAP_FILE.name}")
    except Exception as e:
        print(f"WARN: could not save part map: {e}")
    return pmap


def parse_part_w(text, names):
    w = np.array([PART_W.get(n, 0.6) for n in names], np.float64)
    if text:
        for tok in text.split(","):
            if "=" not in tok:
                continue
            k, v = tok.split("=", 1)
            k = k.strip().upper()
            if k in names:
                w[names.index(k)] = float(v)
    return np.maximum(w, 0.0)


# --------------------------------------------------------------------------- #
# ROBUST AGGREGATION
# --------------------------------------------------------------------------- #
def aggregate(rch, rj, W, alpha, beta):
    C, P = rch.shape
    valid = np.isfinite(rch) & (W > 0)
    has = valid.any(1)

    v = np.where(valid, rch, 0.0)
    w = np.where(valid, W, 0.0).copy()

    worst = np.where(valid, rch, -np.inf).argmax(1)
    rows = np.arange(C)
    w[rows[has], worst[has]] *= beta

    sw = w.sum(1)
    agg = np.where(sw > 1e-9, (w * v).sum(1) / np.maximum(sw, 1e-9), np.nan)

    jv = np.isfinite(rj)
    with np.errstate(invalid="ignore"):
        mix = alpha * rj + (1.0 - alpha) * agg

    return np.where(has & jv, mix, np.where(has, agg, np.where(jv, rj, np.nan)))


def make_r(rch, rj, W, alpha, beta):
    return aggregate(rch, rj, W, alpha, beta)


# --------------------------------------------------------------------------- #
# REFERENCE BANK
# --------------------------------------------------------------------------- #
class PartBank:
    def __init__(self, fdir: Path, classes, pmap, base_w, pr, preload=True):
        self.dir = fdir
        self.classes = classes
        self.pr = pr

        self.names = list(pmap["names"])
        self.P = len(self.names)
        self.sl = np.ascontiguousarray(pmap["slices"], np.int64)
        self.perm = np.ascontiguousarray(pmap["perm"], np.int64)
        self.base_w = np.ascontiguousarray(base_w, np.float32)

        self.cache = {}
        self.scales = {}
        self.cham_scales = {}
        self.energy = {}
        self.active = {}

        self.scr_stack = None
        self.scr_owner = None
        self.gscale = np.ones(self.P + 1, np.float64)
        self._ones = np.ones((self.P, N_FRAMES), np.float32)

        if preload:
            for g in classes:
                self.refs(g)
            n = sum(len(v) for v in self.cache.values() if v is not None)
            print(f"DTW refs : {n} samples, {self.P} channels {self.names}")
            self._global_scale()
            self.build_screen(pr["screen_refs"])
        else:
            print("DTW lazy mode: all-class screen disabled")

    def refs(self, g):
        if g in self.cache:
            return self.cache[g]

        arr = None
        p = self.dir / f"{g}.npy"
        if p.exists():
            try:
                a = np.load(p)
                if (
                    a.ndim == 3
                    and a.shape[1] == N_FRAMES
                    and a.shape[2] >= N_CONTENT
                    and len(a)
                ):
                    a = np.asarray(a[:, :, :N_CONTENT], np.float32)[:, :, self.perm]
                    a = self._prune(a)
                    arr = np.ascontiguousarray(a, np.float32)
                else:
                    print(f"WARN: {p.name} shape {a.shape} skipped")
            except Exception as e:
                print(f"WARN: cannot load {p.name}: {e}")
        else:
            print(f"WARN: no DTW reference for '{g}'")

        self.cache[g] = arr

        if arr is not None:
            e = np.array(
                [
                    np.sqrt(np.mean(arr[:, :, s:t] ** 2)) if t > s else 0.0
                    for s, t in self.sl
                ],
                np.float64,
            )
            self.energy[g] = e
            self.active[g] = e > 1e-3 * (e.max() + 1e-6)

        return arr

    def _prune(self, a):
        k = float(self.pr.get("prune", 0.0))
        R = len(a)
        if k <= 0 or R < 5:
            return a

        flat = a.reshape(R, -1).astype(np.float64)
        sd = flat.std(0) + 1e-6
        z = flat / sd
        c = np.median(z, 0)
        d = np.linalg.norm(z - c, axis=1)
        med = float(np.median(d))
        mad = float(np.median(np.abs(d - med))) * 1.4826 + 1e-9
        keep = np.flatnonzero(d <= med + k * mad)

        if len(keep) < max(3, R // 3):
            return a
        return a[keep]

    def _sample_idx(self, R, k):
        return np.unique(np.linspace(0, R - 1, min(max(k, 1), R)).astype(int))

    def _loo_scale(self, r):
        if r is None or len(r) < 2:
            return None

        idx = self._sample_idx(len(r), self.pr["scale_samples"])
        vals = []

        for i in idx:
            d = _part_many(
                np.ascontiguousarray(r[i]),
                r,
                self.sl,
                self.base_w,
                self._ones,
                self.pr["band"],
                self.pr["end_slack"],
            )
            d[i] = np.inf
            d = np.sort(d, axis=0)
            kk = min(self.pr["k_avg"], len(r) - 1)
            vals.append(d[:kk].mean(0))

        return np.median(np.asarray(vals), axis=0)

    def _global_scale(self):
        got = []
        usable = [g for g in self.classes if self.cache.get(g) is not None]

        for g in usable[:24]:
            s = self._loo_scale(self.cache[g])
            if s is not None:
                got.append(s)

        if got:
            self.gscale = np.maximum(np.median(np.asarray(got), 0), 1e-4)

        print(
            "DTW global channel scales: "
            + " ".join(
                f"{n}={v:.3f}"
                for n, v in zip(self.names + ["JOINT"], self.gscale)
            )
        )

        dead = (self.gscale[: self.P] <= 1.1e-4) & (self.base_w > 0)
        if dead.any():
            names = [n for n, d in zip(self.names, dead) if d]
            print("Zero-variance channels disabled: " + ", ".join(names))
            self.base_w[dead] = 0.0

    def scale(self, g):
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

    def build_screen(self, k):
        stack, owner = [], []

        for ci, g in enumerate(self.classes):
            r = self.cache.get(g)
            if r is None:
                continue
            idx = self._cover_refs(r, k)
            stack.append(r[idx])
            owner.extend([ci] * len(idx))

        if stack:
            self.scr_stack = np.ascontiguousarray(np.concatenate(stack, 0), np.float32)
            self.scr_owner = np.asarray(owner, np.int64)
            print(
                f"DTW screen: {len(self.scr_stack)} refs over {len(set(owner))} classes"
            )

    def _cover_refs(self, r, k):
        R = len(r)
        k = int(min(max(k, 1), R))
        if R <= k:
            return np.arange(R)

        flat = r.reshape(R, -1).astype(np.float64)
        flat = flat / (flat.std(0) + 1e-6)
        D = np.linalg.norm(flat[:, None, :] - flat[None, :, :], axis=-1)

        first = int(np.argmin(D.mean(1)))
        chosen = [first]

        while len(chosen) < k:
            mind = D[:, chosen].min(1)
            mind[chosen] = -1.0
            chosen.append(int(np.argmax(mind)))

        return np.asarray(chosen, int)

    def screen(self, q, qm, cw, alpha, beta):
        out = np.full((len(self.classes), self.P + 1), np.inf)
        if self.scr_stack is None:
            return np.full(len(self.classes), np.nan)

        d = _part_many(
            q,
            self.scr_stack,
            self.sl,
            cw,
            qm,
            self.pr["band"],
            self.pr["end_slack"],
        )
        d *= self._fix(qm)

        for p in range(self.P + 1):
            np.minimum.at(out[:, p], self.scr_owner, d[:, p])

        r = out / self.gscale[None, :]
        W = np.broadcast_to(cw.astype(np.float64), (len(self.classes), self.P))
        return aggregate(r[:, : self.P], r[:, self.P], W, alpha, beta)

    def _fix(self, qm):
        n = np.maximum(qm.sum(1), 1.0)
        fix = N_FRAMES / n
        nj = max(float((qm.max(0) > 0).sum()), 1.0)
        return np.concatenate([fix, [N_FRAMES / nj]])

    def distances(self, q, glosses, qm, cw, band=None, k=None):
        band = self.pr["band"] if band is None else band
        k = self.pr["k_avg"] if k is None else k

        out = np.full((len(glosses), self.P + 1), np.nan)
        fix = self._fix(qm)

        for i, g in enumerate(glosses):
            r = self.refs(g)
            if r is None:
                continue

            d = np.sort(
                _part_many(q, r, self.sl, cw, qm, band, self.pr["end_slack"]),
                axis=0,
            )
            out[i] = d[: min(k, len(d))].mean(0) * fix

        return out

    def normalise(self, draw, glosses):
        out = np.full_like(draw, np.nan)
        for i, g in enumerate(glosses):
            out[i] = draw[i] / self.scale(g)
        return out

    def weights(self, glosses, cw):
        W = np.tile(cw.astype(np.float64), (len(glosses), 1))
        for i, g in enumerate(glosses):
            act = self.active.get(g)
            if act is not None:
                W[i] *= np.where(act, 1.0, 0.35)
        return W

    def _cham(self, a, b, cw):
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

    def chamfer_scale(self, g):
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

    def chamfer_dist(self, q, g, cw):
        r = self.refs(g)
        if r is None:
            return np.full(self.P + 1, np.nan)

        d = np.sort(np.asarray([self._cham(q, x, cw) for x in r]), 0)
        return d[: min(3, len(d))].mean(0)


# --------------------------------------------------------------------------- #
# CLIP BUILDING
# --------------------------------------------------------------------------- #
def _variant_idx(chosen, kind):
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


def build_clip2(buf, W, H, fps_est, n_tta=4):
    F = len(buf)

    pose = np.stack([f.pose for f in buf])
    hands = np.stack([f.hands for f in buf])
    face = np.stack([f.face for f in buf])
    face_ok = np.array([f.face_ok for f in buf], bool)
    in_use = np.stack([f.in_use for f in buf]).copy()
    held = np.stack([f.held for f in buf])

    miss_l = in_use[:, 0].astype(bool) & np.isnan(hands[:, 0, 0, 0])
    miss_r = in_use[:, 1].astype(bool) & np.isnan(hands[:, 1, 0, 0])
    bad_l = miss_l | held[:, 0]
    bad_r = miss_r | held[:, 1]
    bad_body = ~np.isfinite(pose[:, :, 0]).all(1)
    bad_face = ~face_ok

    n_miss_raw = int((miss_l | miss_r).sum())
    n_held = int(held.any(1).sum())

    pose_f = V1._hold_valid(pose)
    hands_f = V1._hold_valid(hands)
    face_f = V1._hold_valid(face)

    vis_nan = np.isnan(pose[:, :, 0])
    pose_f[:, :, 3] = np.where(
        vis_nan, 0.9, np.nan_to_num(pose_f[:, :, 3], nan=0.0)
    )
    face_ok_f = face_ok | np.isfinite(face_f).all(axis=(1, 2))

    still = np.isnan(hands_f[:, :, 0, 0])
    iu = in_use.copy()
    iu[:, :2] &= ~still[:, :2]

    raw = dict(
        pose=pose_f,
        hands=hands_f,
        face=face_f,
        face_ok=face_ok_f,
        W=W,
        H=H,
    )
    complete = np.asarray(EX.complete_mask(raw, iu), bool)

    note = "ok"
    chosen = V1._select(complete)

    if chosen is None:
        chosen = V1._stretch(complete)
        if chosen is not None:
            note = f"stretched from {int(complete.sum())}/{F} frames"

    if chosen is None:
        iu3 = iu.copy()
        iu3[:, :2] = False
        c3 = np.asarray(EX.complete_mask(raw, iu3), bool)
        chosen = V1._select(c3) or V1._stretch(c3)
        if chosen is not None:
            iu, note = iu3, "hands absent; pose-only geometry"

    if chosen is None:
        # Last resort: no complete frame at all. Pick the frame with the most
        # usable landmarks. reshape(F, -1) is rank-agnostic: hands is 4-D,
        # pose is 3-D, so a fixed axis tuple cannot be shared between them.
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
    if int(real.sum()) < MIN_REAL:
        parts = {k: np.ones(N_FRAMES, bool) for k in parts}
        real = parts["ALL"]

    duration = F / max(fps_est, 1e-4)

    def make(idxs):
        with np.errstate(all="ignore"):
            f = np.stack(
                [
                    EX.frame_features(
                        pose_f[i], hands_f[i], face_f[i], iu[i], W, H, duration
                    )
                    for i in idxs
                ]
            )
        return np.nan_to_num(
            f.astype(np.float32), nan=0.0, posinf=0.0, neginf=0.0
        )[None]

    feats = make(chosen)
    variants = [feats]

    for kind in range(1, max(int(n_tta), 1)):
        vi = _variant_idx(chosen, kind)
        variants.append(make(vi))

    return dict(
        feats=feats,
        variants=variants,
        note=note,
        real=real,
        parts=parts,
    )


def channel_masks(parts, names, use_mask):
    P = len(names)

    if not use_mask:
        return np.ones((P, N_FRAMES), np.float32), np.ones(P), False

    qm = np.stack([parts.get(n, parts["ALL"]).astype(np.float32) for n in names])
    n = qm.sum(1)
    ok = n >= MIN_REAL
    fallback = False

    if not ok.any():
        qm = np.ones((P, N_FRAMES), np.float32)
        ok = np.ones(P, bool)
        n = qm.sum(1)
        fallback = True

    rel = np.where(ok, 0.35 + 0.65 * (n / N_FRAMES), 0.0)
    return np.ascontiguousarray(qm, np.float32), rel, fallback


# --------------------------------------------------------------------------- #
# DL
# --------------------------------------------------------------------------- #
def dl_probs(sess, in_name, out_name, variants):
    w = [0.40, 0.20, 0.20, 0.20][: len(variants)]
    w = np.asarray(w, np.float64)
    w /= w.sum()

    ps = []
    for v in variants:
        logits = sess.run([out_name], {in_name: v})[0]
        ps.append(V1.softmax(logits[0].astype(np.float64)))

    ps = np.asarray(ps)
    p = (w[:, None] * ps).sum(0)
    tops = ps.argmax(1)
    stability = float(np.mean(tops == tops[0]))
    return p, stability


# --------------------------------------------------------------------------- #
# FUSION + DECISION
# --------------------------------------------------------------------------- #
def fuse_scores(p, r, pr):
    dl_rel = (p / max(float(p.max()), 1e-9)) ** (
        1.0 / max(pr["dl_temp"], 1e-3)
    )

    fin = np.isfinite(r)
    dtw_rel = np.ones(len(r))

    if fin.any():
        rmin = max(float(r[fin].min()), 1e-6)
        dtw_rel[fin] = (rmin / np.maximum(r[fin], 1e-6)) ** pr["pow"]
        dtw_rel[~fin] = float(dtw_rel[fin].mean())

    score = pr["w_dl"] * dl_rel + pr["w_dtw"] * dtw_rel

    if pr["mode"] == "rank":
        n = len(p)
        dl_pts = V1._rank_points(np.argsort(-p, kind="stable"), n)
        dtw_pts = V1._rank_points(
            np.argsort(np.where(fin, r, np.inf), kind="stable"), n
        )
        score = pr["w_dl"] * dl_pts + pr["w_dtw"] * dtw_pts + 1e-3 * score

    return score, dl_rel, dtw_rel


def decide(ev, pr, deep_r=None, rule="v2"):
    p = ev["p"]
    r = ev["r"].copy()

    if deep_r:
        for i, v in deep_r.items():
            if np.isfinite(v):
                r[i] = v

    C, n_dl = len(p), ev["n_dl"]
    fused, dl_rel, dtw_rel = fuse_scores(p, r, pr)

    dl_order = [int(i) for i in np.argsort(-p, kind="stable")]
    dtw_order = [
        int(i)
        for i in np.argsort(np.where(np.isfinite(r), r, np.inf), kind="stable")
        if np.isfinite(r[i])
    ]

    dl_set = set(range(n_dl))
    dtw_set = set(dtw_order[: pr["top_n"]])
    by_fused = [int(i) for i in np.argsort(-fused, kind="stable")]
    inter = [i for i in by_fused if i in dl_set and i in dtw_set]
    gall = by_fused[0]

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
        d0 = dl_order[0]
        other = gall if gall != d0 else (dtw_order[0] if dtw_order else d0)
        finalists = [d0, other]

    finalists = list(dict.fromkeys(finalists))
    gap = (
        abs(float(fused[finalists[0]] - fused[finalists[1]]))
        if len(finalists) > 1
        else 1.0
    )
    want_deep = (gap < pr["close_gap"]) or (not inter) or (gall not in inter)

    deep_used = bool(deep_r)

    if rule == "v1":
        if inter:
            win, flag = inter[0], "consensus"
        else:
            win, flag = dl_order[0], "DL kept"
    else:
        if inter:
            win, flag = inter[0], "consensus"
            if (
                gall not in inter
                and (fused[gall] - fused[inter[0]]) > pr["rescue_gap"]
                and not dl_strong
                and np.isfinite(r[gall])
                and r[gall] <= pr["r_ok"]
            ):
                win, flag = gall, "rescued"
        else:
            if dl_strong or not dtw_strong:
                win, flag = dl_order[0], "DL kept"
            else:
                win, flag = gall, "DTW led"

    ranking = [win] + [i for i in by_fused if i != win]
    second = ranking[1] if len(ranking) > 1 else win
    gap = float(fused[win] - fused[second])
    gnorm = float(np.clip(gap / 0.25, 0.0, 1.0))

    conf = 100.0 * float(
        np.clip(
            0.45 * dl_rel[win] + 0.35 * dtw_rel[win] + 0.20 * gnorm,
            0,
            1,
        )
    )

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
        win=win,
        ranking=ranking,
        flag=flag,
        low=low,
        conf=conf,
        gap=gap,
        fused=fused,
        dl_rel=dl_rel,
        dtw_rel=dtw_rel,
        inter=inter,
        dl_order=dl_order,
        dtw_order=dtw_order,
        finalists=finalists,
        want_deep=want_deep,
        deep=deep_used,
        r=r,
        p1=p1,
        dl_margin=p1 - p2,
        r_best=rb,
        d_margin=dmargin,
    )


# --------------------------------------------------------------------------- #
# OVERLAY / LOGGING
# --------------------------------------------------------------------------- #
def draw2(
    img,
    mode,
    state,
    fps,
    lat,
    rec_s,
    rec_n,
    raised,
    res,
    cands,
    names,
    rch,
    note,
    stats,
    rule,
    part_on,
):
    put = V1.put
    tag = f"{rule.upper()} {'PART' if part_on else 'JOINT'}"

    put(img, f"mode {mode.upper()}  state {state}  [{tag}]", (12, 28), 0.65, (200, 220, 255))
    put(img, f"fps {fps:4.1f}   infer {lat:5.1f} ms", (12, 54), 0.6, (180, 180, 170))
    put(
        img,
        f"hand raise: {'YES' if raised else 'no'}",
        (12, 76),
        0.6,
        (90, 255, 120) if raised else (150, 150, 150),
    )
    put(
        img,
        "M mode  L label  V rule  B parts  Q quit",
        (12, img.shape[0] - 14),
        0.5,
        (140, 140, 130),
    )

    if stats:
        put(img, stats, (12, img.shape[0] - 36), 0.5, (170, 200, 170), 1)

    if state == "SIGN":
        put(img, f"REC {rec_s:4.1f}s  frames {rec_n:3d}", (12, 98), 0.7, (90, 90, 255))

    if res is None:
        return

    d = res["dec"]
    y = 130
    col = (90, 190, 255) if d["low"] else (110, 230, 140)
    head = cands[d["win"]] + (" (low)" if d["low"] else "")

    put(img, head, (12, y), 1.0, col, 2)
    put(img, f"conf {d['conf']:3.0f}  {d['flag']}", (12, y + 24), 0.55, (200, 210, 230), 1)
    y += 52

    top = max(float(max(d["fused"][i] for i in d["ranking"][:3])), 1e-9)

    for k, i in enumerate(d["ranking"][:3]):
        rr = d["r"][i]
        rtxt = f"{rr:.2f}x" if np.isfinite(rr) else "--"
        put(
            img,
            f"{k+1}. {cands[i]:<14} {100*d['fused'][i]/top:3.0f}  "
            f"DL {100*res['p'][i]:3.0f}%  r={rtxt}",
            (12, y),
            0.55,
            (230, 230, 225),
        )
        y += 24

    if rch is not None and np.isfinite(rch[d["win"]]).any():
        txt = "  ".join(
            f"{n} {v:.2f}" for n, v in zip(names, rch[d["win"]]) if np.isfinite(v)
        )
        put(img, "parts: " + txt, (12, y), 0.5, (255, 220, 120), 1)
        y += 22

    put(
        img,
        "DL : " + " ".join(cands[i] for i in d["dl_order"][:5]),
        (12, y),
        0.45,
        (190, 200, 210),
        1,
    )
    y += 20

    put(
        img,
        "DTW: " + " ".join(cands[i] for i in d["dtw_order"][:5]),
        (12, y),
        0.45,
        (190, 200, 210),
        1,
    )
    y += 20

    extra = f"tta {res['stab']*100:3.0f}%  p1 {d['p1']*100:3.0f}%  rbest {d['r_best']:.2f}"
    if d["deep"]:
        extra += "  [deep]"
    put(img, extra, (12, y), 0.45, (170, 190, 200), 1)
    y += 20

    if note and note != "ok":
        put(img, f"QUALITY: {note}", (12, y), 0.5, (0, 165, 255), 1)


EVAL_FIELDS = [
    "time",
    "true",
    "dl_top1",
    "dtw_top1",
    "hybrid",
    "dl_ok",
    "dtw_ok",
    "hybrid_ok",
    "true_in_union",
    "flag",
    "conf",
    "rule",
    "part_on",
    "p1",
    "dl_margin",
    "r_best",
    "d_margin",
    "tta_stab",
    "dl_top5",
    "dtw_top5",
    "candidates",
    "p_dl",
    "r_norm",
    "rch_win",
    "fused",
    "quality",
    "rec_file",
]


def log_eval(res, true_cls, rule, part_on):
    d = res["dec"]
    cands = res["cands"]

    dl = cands[d["dl_order"][0]]
    dtw = cands[d["dtw_order"][0]] if d["dtw_order"] else ""
    hyb = cands[d["win"]]

    rw = res["rch"][d["win"]] if res["rch"] is not None else np.array([])

    row = dict(
        time=time.strftime("%Y-%m-%d %H:%M:%S"),
        true=true_cls,
        dl_top1=dl,
        dtw_top1=dtw,
        hybrid=hyb,
        dl_ok=int(dl == true_cls),
        dtw_ok=int(dtw == true_cls),
        hybrid_ok=int(hyb == true_cls),
        true_in_union=int(true_cls in cands),
        flag=d["flag"],
        conf=f"{d['conf']:.1f}",
        rule=rule,
        part_on=int(part_on),
        p1=f"{d['p1']:.4f}",
        dl_margin=f"{d['dl_margin']:.4f}",
        r_best=f"{d['r_best']:.4f}",
        d_margin=f"{d['d_margin']:.4f}",
        tta_stab=f"{res['stab']:.2f}",
        dl_top5="|".join(cands[i] for i in d["dl_order"][:5]),
        dtw_top5="|".join(cands[i] for i in d["dtw_order"][:5]),
        candidates="|".join(cands),
        p_dl="|".join(f"{v:.4f}" for v in res["p"]),
        r_norm="|".join(f"{v:.4f}" for v in d["r"]),
        rch_win="|".join(f"{v:.4f}" for v in rw),
        fused="|".join(f"{v:.4f}" for v in d["fused"]),
        quality=res["note"],
        rec_file=res["rec_file"],
    )

    new = not EVAL_CSV.exists()
    try:
        with open(EVAL_CSV, "a", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=EVAL_FIELDS)
            if new:
                w.writeheader()
            w.writerow(row)
    except Exception as e:
        print(f"WARN: could not write {EVAL_CSV.name}: {e}")

    return row


# --------------------------------------------------------------------------- #
# EVIDENCE
# --------------------------------------------------------------------------- #
def evidence(
    sess,
    in_name,
    out_name,
    classes,
    bank,
    clip,
    pr,
    base_w,
    use_mask,
    part_on,
    deep_all=False,
):
    variants = clip["variants"][: max(int(pr["tta"]), 1)]
    p_all, stab = dl_probs(sess, in_name, out_name, variants)

    q = np.ascontiguousarray(
        clip["feats"][0][:, :N_CONTENT][:, bank.perm], np.float32
    )

    qm, rel, fb = channel_masks(clip["parts"], bank.names, use_mask)
    cw = np.ascontiguousarray(base_w * rel, np.float32)

    alpha = pr["alpha"] if part_on else 1.0
    beta = pr["beta"] if part_on else 1.0

    dl_idx = [int(i) for i in np.argsort(-p_all)[: pr["top_n"]]]
    scr = bank.screen(q, qm, cw, alpha, beta)

    scr_top = [
        int(i)
        for i in np.argsort(np.where(np.isfinite(scr), scr, np.inf))
        if np.isfinite(scr[i])
    ][: max(pr["screen_top"], 0)]

    U = dl_idx + [i for i in scr_top if i not in dl_idx]
    cands = [classes[i] for i in U]

    draw = bank.distances(q, cands, qm, cw)
    rn = bank.normalise(draw, cands)
    W = bank.weights(cands, cw)

    rch, rj = rn[:, : bank.P], rn[:, bank.P]
    r = make_r(rch, rj, W, alpha, beta)

    deep = {}
    if deep_all:
        dd = bank.distances(q, cands, qm, cw, pr["deep_band"], pr["deep_k"])
        dn = bank.normalise(dd, cands)
        deep = {
            i: make_r(
                dn[i : i + 1, : bank.P],
                dn[i : i + 1, bank.P],
                W[i : i + 1],
                alpha,
                beta,
            )[0]
            for i in range(len(cands))
        }

    ev = dict(
        p=p_all[U],
        r=r,
        n_dl=len(dl_idx),
        rch=rch,
        rj=rj,
        W=W,
        U=U,
        note=clip["note"],
    )

    return dict(
        ev=ev,
        cands=cands,
        p=p_all[U],
        p_all=p_all,
        stab=stab,
        q=q,
        qm=qm,
        cw=cw,
        alpha=alpha,
        beta=beta,
        note=clip["note"],
        fb=fb,
        deep_all=deep,
        classes=classes,
    )


def deep_pair(bank, res, pr, idxs):
    out = {}
    q, qm, cw = res["q"], res["qm"], res["cw"]
    a, b = res["alpha"], res["beta"]

    for i in idxs:
        g = res["cands"][i]

        dd = bank.distances(q, [g], qm, cw, pr["deep_band"], pr["deep_k"])
        dn = bank.normalise(dd, [g])
        W = bank.weights([g], cw)

        r_dtw = make_r(dn[:, : bank.P], dn[:, bank.P], W, a, b)[0]
        r_final = r_dtw
        wch = pr["chamfer_w"]

        if wch > 0:
            try:
                cd = bank.chamfer_dist(q, g, cw)[None, :]
                cs = bank.chamfer_scale(g)[None, :]
                rc = make_r(
                    cd[:, : bank.P] / cs[:, : bank.P],
                    cd[:, bank.P] / cs[:, bank.P],
                    W,
                    a,
                    b,
                )[0]
                if np.isfinite(rc) and np.isfinite(r_dtw):
                    r_final = (1.0 - wch) * r_dtw + wch * rc
            except Exception:
                pass

        out[i] = r_final

    return out


# --------------------------------------------------------------------------- #
# REPLAY / TUNING
# --------------------------------------------------------------------------- #
def load_truth():
    truth = {}

    for p in (V1.EVAL_CSV, EVAL_CSV):
        if not p.exists():
            continue
        try:
            with open(p, newline="", encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    rf = row.get("rec_file", "")
                    t = row.get("true", "")
                    if rf and t:
                        truth[rf] = t
        except Exception as e:
            print(f"WARN: cannot read {p.name}: {e}")

    return truth


def replay(args, sess, in_name, out_name, classes, bank, pr, base_w):
    d = Path(args.replay)
    files = sorted(d.glob("*.npz"))
    truth = load_truth()

    print(f"Replay: {len(files)} recordings in {d}, {len(truth)} labelled rows")

    evs, truths, names = [], [], []

    for f in files:
        t = truth.get(f.name)
        if not t:
            continue

        try:
            z = np.load(f, allow_pickle=False)
            feats = np.asarray(z["final_features"], np.float32)[None]

            if "part_masks" in z and "part_names" in z:
                pn = [str(s) for s in z["part_names"]]
                pm = {k: np.asarray(v, bool) for k, v in zip(pn, z["part_masks"])}
                pm.setdefault("ALL", np.ones(N_FRAMES, bool))
            else:
                real = (
                    np.asarray(z["real_mask"], bool)
                    if "real_mask" in z
                    else np.ones(N_FRAMES, bool)
                )
                pm = {k: real for k in PART_ORDER + ["ALL"]}

            note = str(z["quality"]) if "quality" in z else "ok"

            clip = dict(
                feats=feats,
                variants=[feats],
                note=note,
                real=pm["ALL"],
                parts=pm,
            )

            res = evidence(
                sess,
                in_name,
                out_name,
                classes,
                bank,
                clip,
                pr,
                base_w,
                True,
                True,
                deep_all=True,
            )

            evs.append(res)
            truths.append(t)
            names.append(f.name)

        except Exception as e:
            print(f"WARN: skip {f.name}: {e}")

    if not evs:
        print("Nothing to replay. Label some results first, then rerun --replay.")
        return

    n = len(evs)
    ceiling = sum(1 for r, t in zip(evs, truths) if t in r["cands"])

    print(
        f"Usable labelled clips: {n} | truth inside candidate union: "
        f"{ceiling}/{n} ({100*ceiling/n:.1f}% ceiling)"
    )

    def run(prm, wmul, rule):
        ok = top3 = 0

        for res, t in zip(evs, truths):
            e = res["ev"]
            W = e["W"] * wmul[None, :]
            r = make_r(e["rch"], e["rj"], W, prm["alpha"], prm["beta"])
            ev = dict(p=e["p"], r=r, n_dl=e["n_dl"], note=res["note"])

            dec0 = decide(ev, prm, None, rule=rule)
            dd = res["deep_all"]
            deep = None

            if dec0["want_deep"] and len(dec0["finalists"]) > 1 and dd:
                deep = {i: dd[i] for i in dec0["finalists"] if i in dd}

            dec = decide(ev, prm, deep, rule=rule)

            ok += int(res["cands"][dec["win"]] == t)
            top3 += int(t in [res["cands"][i] for i in dec["ranking"][:3]])

        return ok / n, top3 / n

    wmul0 = np.ones(bank.P)

    b1, b3 = run(pr, wmul0, "v1")
    a1, a3 = run(pr, wmul0, "v2")

    print(f"\nBASELINE  v1 rule : top1 {100*b1:5.1f}%  top3 {100*b3:5.1f}%")
    print(f"DEFAULT   v2 rule : top1 {100*a1:5.1f}%  top3 {100*a3:5.1f}%")

    best = (a1, dict(pr), wmul0.copy())
    grid = []

    for w_dl in (0.3, 0.4, 0.5, 0.6, 0.7):
        for pw in (2.0, 3.0, 4.0):
            for al in (0.25, 0.45, 0.70):
                for be in (0.30, 0.50, 1.00):
                    for rg in (0.08, 0.15, 9.9):
                        grid.append((w_dl, pw, al, be, rg))

    print(f"\nGrid search over {len(grid)} combinations ...")

    for w_dl, pw, al, be, rg in grid:
        prm = dict(
            pr,
            w_dl=w_dl,
            w_dtw=1.0 - w_dl,
            pow=pw,
            alpha=al,
            beta=be,
            rescue_gap=rg,
        )
        acc, _ = run(prm, wmul0, "v2")
        if acc > best[0] + 1e-9:
            best = (acc, prm, wmul0.copy())

    print(
        f"Grid best: top1 {100*best[0]:5.1f}%  "
        f"w_dl={best[1]['w_dl']:.2f} pow={best[1]['pow']:.1f} "
        f"alpha={best[1]['alpha']:.2f} beta={best[1]['beta']:.2f} "
        f"rescue_gap={best[1]['rescue_gap']:.2f}"
    )

    if args.tune_parts and bank.P > 1:
        print("Coordinate descent on channel weights ...")
        for _ in range(2):
            for p in range(bank.P):
                for m in (0.5, 0.75, 1.0, 1.3, 1.7):
                    w = best[2].copy()
                    w[p] = m
                    acc, _ = run(best[1], w, "v2")
                    if acc > best[0] + 1e-9:
                        best = (acc, best[1], w)

        print(
            "Channel multipliers: "
            + " ".join(f"{nm}={v:.2f}" for nm, v in zip(bank.names, best[2]))
        )

    acc, top3 = run(best[1], best[2], "v2")

    print(f"\nTUNED     v2 rule : top1 {100*acc:5.1f}%  top3 {100*top3:5.1f}%")
    print(f"Gain over v1 baseline: {100*(acc-b1):+.1f} points on {n} clips")

    out = dict(
        params=best[1],
        part_mult=dict(zip(bank.names, map(float, best[2]))),
        n=n,
        baseline_v1=b1,
        default_v2=a1,
        tuned_v2=acc,
        ceiling=ceiling / n,
    )

    TUNE_FILE.write_text(json.dumps(out, indent=1), encoding="utf-8")
    print(f"Saved {TUNE_FILE.name} - use live with  --params {TUNE_FILE.name}")

    if n < 60:
        print("NOTE: fewer than 60 labelled clips. Treat numbers as indicative.")


# --------------------------------------------------------------------------- #
# SELF TEST
# --------------------------------------------------------------------------- #
def selftest(bank, pr, base_w, classes):
    kernel_warmup()

    D = len(bank.perm)
    q = np.ascontiguousarray(
        np.random.default_rng(0).normal(0, 0.3, (N_FRAMES, D)), np.float32
    )
    qm = np.ones((bank.P, N_FRAMES), np.float32)
    cw = np.ascontiguousarray(base_w, np.float32)

    t0 = time.perf_counter()
    s = bank.screen(q, qm, cw, pr["alpha"], pr["beta"])
    t1 = time.perf_counter()

    top = [
        classes[i]
        for i in np.argsort(np.where(np.isfinite(s), s, np.inf))[:5]
    ]

    print(f"Kernel OK. Screen over {len(classes)} classes: {(t1-t0)*1000:.0f} ms")
    print(f"Random-query screen top-5, sanity only: {top}")

    g = next((g for g in classes if bank.refs(g) is not None), None)
    if g:
        r = bank.refs(g)
        d = bank.distances(np.ascontiguousarray(r[0]), [g], qm, cw)
        rn = bank.normalise(d, [g])
        print(f"Self-match '{g}' normalised distances, should be near/below 1.0:")
        print(
            "  "
            + " ".join(
                f"{n}={v:.2f}" for n, v in zip(bank.names + ["JOINT"], rn[0])
            )
        )


# --------------------------------------------------------------------------- #
# ARGS
# --------------------------------------------------------------------------- #
def parse_args():
    ap = argparse.ArgumentParser(
        description="Part-robust multi-view DTW + DL hybrid."
    )

    ap.add_argument("--model-id", default=None)
    ap.add_argument("--features-id", default="3")
    ap.add_argument("--params", default=None)

    ap.add_argument("--parts", choices=("auto", "off"), default="auto")
    ap.add_argument("--part-map", default=None)
    ap.add_argument("--rediscover", action="store_true")
    ap.add_argument("--part-w", default=None)
    ap.add_argument("--n-content", type=int, default=N_CONTENT)

    ap.add_argument("--top-n", type=int, default=None)
    ap.add_argument("--screen-refs", type=int, default=None)
    ap.add_argument("--screen-top", type=int, default=None)
    ap.add_argument("--fusion", choices=("score", "rank"), default=None)
    ap.add_argument("--w-dl", type=float, default=None)
    ap.add_argument("--w-dtw", type=float, default=None)
    ap.add_argument("--dtw-pow", type=float, default=None)
    ap.add_argument("--dl-temp", type=float, default=None)
    ap.add_argument("--alpha", type=float, default=None)
    ap.add_argument("--beta", type=float, default=None)
    ap.add_argument("--band", type=int, default=None)
    ap.add_argument("--deep-band", type=int, default=None)
    ap.add_argument("--end-slack", type=int, default=None)
    ap.add_argument("--close-gap", type=float, default=None)
    ap.add_argument("--rescue-gap", type=float, default=None)
    ap.add_argument("--chamfer-w", type=float, default=None)
    ap.add_argument("--tta", type=int, default=None, choices=(1, 2, 3, 4))
    ap.add_argument("--prune", type=float, default=None)
    ap.add_argument("--scale-floor", type=float, default=None)

    ap.add_argument("--no-mask", action="store_true")
    ap.add_argument("--joint-only", action="store_true")
    ap.add_argument("--rule", choices=("v1", "v2"), default="v2")
    ap.add_argument("--lazy", action="store_true")

    ap.add_argument("--rescue-skip", type=int, default=V1.RESCUE_SKIP)
    ap.add_argument("--width", type=int, default=V1.LIVE_WIDTH)
    ap.add_argument("--complexity", type=int, default=0, choices=(0, 1))
    ap.add_argument("--camera", type=int, default=0)
    ap.add_argument("--no-save", action="store_true")

    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--replay", nargs="?", const=str(REC_DIR), default=None)
    ap.add_argument("--tune-parts", action="store_true")

    return ap.parse_args()


def build_pr(args):
    pr = dict(PR)

    if args.params:
        blob = json.loads(Path(args.params).read_text(encoding="utf-8"))
        pr.update(blob.get("params", {}))

    def setv(key, value):
        if value is not None:
            pr[key] = value

    setv("top_n", args.top_n)
    setv("screen_refs", args.screen_refs)
    setv("screen_top", args.screen_top)
    setv("mode", args.fusion)
    setv("dl_temp", args.dl_temp)
    setv("alpha", args.alpha)
    setv("beta", args.beta)
    setv("band", args.band)
    setv("deep_band", args.deep_band)
    setv("end_slack", args.end_slack)
    setv("close_gap", args.close_gap)
    setv("rescue_gap", args.rescue_gap)
    setv("chamfer_w", args.chamfer_w)
    setv("tta", args.tta)
    setv("prune", args.prune)
    setv("scale_floor", args.scale_floor)
    setv("pow", args.dtw_pow)

    w_dl = args.w_dl if args.w_dl is not None else pr["w_dl"]
    w_dtw = args.w_dtw if args.w_dtw is not None else pr["w_dtw"]
    ws = max(w_dl, 0.0) + max(w_dtw, 0.0)
    if ws <= 0:
        sys.exit("ERROR: --w-dl and --w-dtw cannot both be 0")

    pr["w_dl"] = max(w_dl, 0.0) / ws
    pr["w_dtw"] = max(w_dtw, 0.0) / ws

    return pr


# --------------------------------------------------------------------------- #
# MAIN
# --------------------------------------------------------------------------- #
def main():
    args = parse_args()
    pr = build_pr(args)

    print("=" * 74)
    print(" WBSL Hybrid v2 - Part-Robust Multi-View DTW + DL")
    print("=" * 74)

    model_dir = V1.find_model_dir(args.model_id)
    sess, in_name, out_name, classes = V1.load_model(model_dir)

    pmap = get_part_map(args)
    base_w = parse_part_w(args.part_w, pmap["names"])

    if args.params:
        blob = json.loads(Path(args.params).read_text(encoding="utf-8"))
        mult = blob.get("part_mult", {})
        base_w *= np.array([mult.get(n, 1.0) for n in pmap["names"]])

    print(
        "Channel weights: "
        + " ".join(f"{n}={v:.2f}" for n, v in zip(pmap["names"], base_w))
    )

    bank = PartBank(
        V1.find_features_dir(args.features_id),
        classes,
        pmap,
        base_w,
        pr,
        preload=not args.lazy,
    )

    if not np.allclose(base_w, np.asarray(bank.base_w, np.float64)):
        base_w = np.asarray(bank.base_w, np.float64)
        print(
            "Effective weights: "
            + " ".join(f"{n}={v:.2f}" for n, v in zip(bank.names, base_w))
        )

    kernel_warmup()

    print(
        f"Fusion   : {pr['mode']}  DL {pr['w_dl']:.2f} / DTW {pr['w_dtw']:.2f}  "
        f"pow {pr['pow']:.1f}  alpha {pr['alpha']:.2f}  beta {pr['beta']:.2f}  "
        f"slack {pr['end_slack']}  tta {pr['tta']}  scale-floor {pr['scale_floor']:.2f}"
    )

    if args.selftest:
        selftest(bank, pr, base_w, classes)
        return

    if args.replay:
        replay(args, sess, in_name, out_name, classes, bank, pr, base_w)
        return

    import mediapipe as mp

    cap = cv2.VideoCapture(args.camera)
    if not cap.isOpened():
        sys.exit(f"ERROR: cannot open webcam {args.camera}")

    holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False,
        model_complexity=args.complexity,
        smooth_landmarks=True,
        refine_face_landmarks=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    hands_det = None
    hold = V1.make_hand_holder()

    mode, state, rule = "auto", "IDLE", args.rule
    part_on = not args.joint_only
    use_mask = not args.no_mask

    up = down = 0
    buf = []
    pre = deque(maxlen=EX.PRE_ROLL + V1.RAISE_CONFIRM_FRAMES)

    res, res_until = None, 0.0
    msg, msg_until = None, 0.0

    lat_ms, ema_dt = 0.0, 1.0 / 30.0
    prev_t = time.perf_counter()
    read_fails, span_t0, last_up_rel = 0, 0.0, 0
    timed_start, timed_raised, rec_count = time.perf_counter(), 0, 0
    rescue_wait, W_cur, H_cur = 0, 0, 0

    label_mode, label_text = False, ""
    ev_n = ev_dl = ev_dtw = ev_hyb = 0

    if not args.no_save:
        REC_DIR.mkdir(parents=True, exist_ok=True)

    def close_span(frames):
        nonlocal res, res_until, lat_ms, rec_count, msg, msg_until

        if not frames:
            return

        if len(frames) < MIN_SPAN_FRAMES:
            msg = f"span too short ({len(frames)} frames) - ignored"
            msg_until = time.perf_counter() + V1.MSG_HOLD_S
            print(f"[{time.strftime('%H:%M:%S')}] skipped short span "
                  f"({len(frames)} frames)")
            return

        t0 = time.perf_counter()

        clip = build_clip2(
            frames,
            W_cur,
            H_cur,
            1.0 / max(ema_dt, 1e-4),
            pr["tta"],
        )

        r0 = evidence(
            sess,
            in_name,
            out_name,
            classes,
            bank,
            clip,
            pr,
            base_w,
            use_mask,
            part_on,
        )

        dec = decide(r0["ev"], pr, rule=rule)

        if dec["want_deep"] and len(dec["finalists"]) > 1:
            dd = deep_pair(bank, r0, pr, dec["finalists"])
            dec = decide(r0["ev"], pr, dd, rule=rule)

        lat_ms = (time.perf_counter() - t0) * 1000.0

        r0["dec"] = dec
        r0["rch"] = r0["ev"]["rch"]
        r0["rec_file"] = ""
        r0["done"] = False

        if r0.get("fb", False):
            r0["note"] += " | masks fell back to all frames"

        if not args.no_save:
            rec_count += 1
            path = REC_DIR / f"rec_{int(time.time())}_{rec_count:04d}.npz"
            try:
                pn = list(clip["parts"].keys())
                np.savez(
                    path,
                    raw_hands=np.stack([f.hands for f in frames]),
                    raw_pose=np.stack([f.pose for f in frames]),
                    raw_in_use=np.stack([f.in_use for f in frames]),
                    held=np.stack([f.held for f in frames]),
                    final_features=clip["feats"][0],
                    real_mask=clip["real"],
                    part_names=np.array(pn),
                    part_masks=np.stack([clip["parts"][k] for k in pn]),
                    prediction=r0["cands"][dec["win"]],
                    candidates=np.array(r0["cands"]),
                    p_dl=r0["p"],
                    p_all=r0["p_all"],
                    r_norm=dec["r"],
                    r_ch=r0["ev"]["rch"],
                    r_joint=r0["ev"]["rj"],
                    fused=dec["fused"],
                    quality=r0["note"],
                    decision=dec["flag"],
                )
                r0["rec_file"] = path.name
            except Exception as e:
                print(f"WARN: could not save recording: {e}")

        res, res_until = r0, time.perf_counter() + V1.RESULT_HOLD_S

        print(
            f"[{time.strftime('%H:%M:%S')}] {r0['cands'][dec['win']]} "
            f"conf{dec['conf']:3.0f} | {dec['flag']} | "
            f"DL: {' '.join(r0['cands'][i] for i in dec['dl_order'][:5])} | "
            f"DTW: {' '.join(r0['cands'][i] for i in dec['dtw_order'][:5])} | "
            f"{lat_ms:.0f} ms | p1 {dec['p1']*100:.0f}% "
            f"rbest {dec['r_best']:.2f} | {r0['note']}"
        )

    print("\nLive. M=mode  L=label  V=v1/v2 rule  B=part/joint  Q=quit\n")

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                read_fails += 1
                if read_fails >= V1.MAX_READ_FAILS:
                    print("ERROR: webcam stopped delivering frames.")
                    break
                time.sleep(0.01)
                continue

            read_fails = 0
            now = time.perf_counter()
            dt = now - prev_t
            prev_t = now

            if 0.0 < dt < 1.0:
                ema_dt = 0.9 * ema_dt + 0.1 * dt
            fps = 1.0 / max(ema_dt, 1e-4)

            fh, fw = frame.shape[:2]
            small = (
                cv2.resize(
                    frame,
                    (args.width, int(round(fh * args.width / fw))),
                )
                if fw > args.width
                else frame
            )

            small_enh = V1.enhance_image(small)
            H_cur, W_cur = small_enh.shape[:2]

            rgb = cv2.cvtColor(small_enh, cv2.COLOR_BGR2RGB)
            rgb.flags.writeable = False
            mr = holistic.process(rgb)

            pose, hands, face, f_ok = V1.read_landmarks(mr)
            in_use = EX.frame_in_use(pose, W_cur, H_cur)

            if rescue_wait > 0:
                rescue_wait -= 1
            else:
                hands, hands_det = V1.rescue_hands(
                    rgb, pose, hands, in_use, hands_det
                )
                if any(
                    in_use[h] and np.isnan(hands[h, 0, 0]) for h in (0, 1)
                ):
                    rescue_wait = max(args.rescue_skip, 0)

            hands, held_flags = hold(pose, hands)
            fr = V1.Fr(pose, hands, face, f_ok, in_use, now, held_flags)
            raised_now, lowered_now = V1.raise_state(pose, W_cur, H_cur)

            if mode == "auto":
                if state == "IDLE":
                    pre.append(fr)
                    if raised_now:
                        up += 1
                    elif lowered_now:
                        up = 0

                    if up >= V1.RAISE_CONFIRM_FRAMES:
                        state, down = "SIGN", 0
                        buf = list(pre)
                        span_t0 = now
                        last_up_rel = len(buf) - 1
                else:
                    buf.append(fr)
                    rel = len(buf) - 1

                    if raised_now:
                        last_up_rel, down = rel, 0
                    elif lowered_now:
                        down += 1

                    if (
                        down >= V1.LOWER_CONFIRM_FRAMES
                        or (now - span_t0) >= V1.MAX_SPAN_S
                    ):
                        end_rel = min(last_up_rel + EX.KEEP_TAIL, rel)
                        close_span(buf[: end_rel + 1])
                        state, up, down, buf = "IDLE", 0, 0, []
                        pre.clear()

            else:
                buf.append(fr)
                if raised_now:
                    timed_raised += 1

                if now - timed_start >= V1.TIMED_DURATION:
                    if timed_raised >= V1.RAISE_CONFIRM_FRAMES:
                        close_span(buf)
                    else:
                        msg = "No raised hand in last 7s"
                        msg_until = time.perf_counter() + V1.MSG_HOLD_S

                    buf, timed_raised = [], 0
                    timed_start = now

            k = cv2.waitKey(1) & 0xFF

            if label_mode:
                if k == 13:
                    t = V1.match_class(label_text, classes)
                    if t and res is not None:
                        row = log_eval(res, t, rule, part_on)
                        res["done"] = True

                        ev_n += 1
                        ev_dl += row["dl_ok"]
                        ev_dtw += row["dtw_ok"]
                        ev_hyb += row["hybrid_ok"]

                        msg = (
                            f"saved {t}  hybrid "
                            f"{'OK' if row['hybrid_ok'] else 'WRONG'}"
                        )
                        msg_until = time.perf_counter() + V1.MSG_HOLD_S

                        print(
                            f"LABEL {t}: DL {'ok' if row['dl_ok'] else 'x'} | "
                            f"DTW {'ok' if row['dtw_ok'] else 'x'} | "
                            f"HYBRID {'ok' if row['hybrid_ok'] else 'x'}"
                        )
                    else:
                        msg = "unknown sign name"
                        msg_until = time.perf_counter() + V1.MSG_HOLD_S

                    label_mode, label_text = False, ""

                elif k == 27:
                    label_mode, label_text = False, ""

                elif k in (8, 127):
                    label_text = label_text[:-1]

                elif 32 <= k < 127:
                    label_text += chr(k).upper()

            else:
                if k in (27, ord("q"), ord("Q")):
                    break

                if k in (ord("m"), ord("M")):
                    mode = "timed" if mode == "auto" else "auto"
                    state, buf, up, down = "IDLE", [], 0, 0
                    pre.clear()
                    timed_start, timed_raised = time.perf_counter(), 0

                elif k in (ord("v"), ord("V")):
                    rule = "v1" if rule == "v2" else "v2"
                    msg = f"decision rule: {rule}"
                    msg_until = time.perf_counter() + V1.MSG_HOLD_S

                elif k in (ord("b"), ord("B")):
                    part_on = not part_on
                    msg = (
                        "part-robust DTW ON"
                        if part_on
                        else "joint-only DTW"
                    )
                    msg_until = time.perf_counter() + V1.MSG_HOLD_S

                elif k in (ord("l"), ord("L")):
                    if res is None:
                        msg = "no result to label yet"
                        msg_until = time.perf_counter() + V1.MSG_HOLD_S
                    elif res["done"]:
                        msg = "already labelled"
                        msg_until = time.perf_counter() + V1.MSG_HOLD_S
                    else:
                        label_mode, label_text = True, ""

            V1.draw_skeleton(frame, fr, fw, fh)
            frame = cv2.flip(frame, 1)

            rec_s = (now - buf[0].t) if buf else 0.0
            stats = (
                f"eval n={ev_n}  DL {ev_dl}  DTW {ev_dtw}  HYB {ev_hyb}"
                if ev_n
                else ""
            )

            show = res if (res is not None and now < res_until) else None

            draw2(
                frame,
                mode,
                state,
                fps,
                lat_ms,
                rec_s,
                len(buf),
                raised_now,
                show,
                show["cands"] if show else [],
                bank.names,
                show["rch"] if show else None,
                show["note"] if show else "",
                stats,
                rule,
                part_on,
            )

            if mode == "timed":
                left = max(0.0, V1.TIMED_DURATION - (now - timed_start))
                V1.put(
                    frame,
                    f"NEXT SCAN IN: {left:.1f}s",
                    (12, 120),
                    0.7,
                    (0, 165, 255),
                )

            if msg and now < msg_until:
                V1.draw_centred(frame, msg, 60, 0.85, (80, 120, 255))

            if label_mode:
                guess = V1.match_class(label_text, classes) if label_text else None
                V1.draw_centred(
                    frame,
                    f"TRUE SIGN: {label_text}_  -> {guess or '?'}",
                    frame.shape[0] - 64,
                    0.7,
                    (80, 255, 255),
                )
                V1.draw_centred(
                    frame,
                    "ENTER save   ESC cancel",
                    frame.shape[0] - 90,
                    0.5,
                    (200, 200, 200),
                    1,
                )

            cv2.imshow("WBSL Hybrid v2 - Part-Robust DTW + DL", frame)

    except KeyboardInterrupt:
        print("\nInterrupted.")

    finally:
        print("Shutting down cleanly...")
        try:
            holistic.close()
        except Exception:
            pass

        if hands_det is not None:
            try:
                hands_det.close()
            except Exception:
                pass

        cap.release()
        cv2.destroyAllWindows()

    print("Bye.")


if __name__ == "__main__":
    main()