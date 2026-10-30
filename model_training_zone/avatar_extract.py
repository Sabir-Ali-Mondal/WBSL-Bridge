#!/usr/bin/env python3
"""
avatar_extract.py - per-gloss avatar capture for the ISL avatar player.

    py avatar_extract.py [--model-id ID] [--no-cache]

Runs AFTER train.py. Writes into the NEWEST deployed model folder (the one
train.py created, i.e. the newest folder under models/onnx_models/ that holds
sign_daily_lstm.onnx), so one folder contains the model AND the avatar data:

    models/onnx_models/<id>/avatar/<GLOSS>/
        pose.npy     (F, 8, 4)   shoulders, elbows, wrists, hips: x, y, z, vis
        hands.npy    (F, 42, 3)  left 21 + right 21 points
        face.npy     (F, 19, 3)  outline 4, brows 6, eyes 4, nose 1, lips 4 (float16)
        t.npy        (F,)        time in seconds of each kept frame
        meta.json    source video, frame rate, span + selection info

Selection (per the training method doc):
  * one video per gloss - the kept video with the HIGHEST share of complete
    frames inside its sign span (ties go to the first in sorted path order)
  * every COMPLETE frame of that span is kept with its timestamp - no resampling
  * the share/span are read from the extract_report.json of the features run
    that trained this model, so avatar data matches the trained model exactly

Raw landmarks come from extract.py's cache via load_or_detect(), so videos are
never detected twice. A hand that is not in use (and therefore not detected)
inside a kept frame is filled from its nearest detected frame of the span; the
number of filled frames is recorded in meta.json.
"""
from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

import numpy as np

import extract as EX

MODELS_ROOT = EX.TRAIN_ZONE.parent / "models" / "onnx_models"

FACE_OUT = EX.AVATAR_FACE            # 19 indices, in avatar order
POSE_OUT = EX.POSE_IDX               # 11,12,13,14,15,16,23,24


# --------------------------------------------------------------------------- #
# locate the model folder + its training run
# --------------------------------------------------------------------------- #
def find_model_dir(model_id: str | None) -> Path:
    if not MODELS_ROOT.is_dir():
        sys.exit(f"ERROR: no model folder at {MODELS_ROOT} - run  py train.py  first.")
    if model_id:
        d = MODELS_ROOT / model_id
        if not d.is_dir():
            sys.exit(f"ERROR: model id {model_id} not found in {MODELS_ROOT}")
        return d
    deployed = [p for p in MODELS_ROOT.iterdir()
                if p.is_dir() and not p.name.startswith(".")
                and (p / "sign_daily_lstm.onnx").exists()]
    if not deployed:
        sys.exit(f"ERROR: no deployed model in {MODELS_ROOT} - run  py train.py  first.")
    return max(deployed, key=lambda p: p.stat().st_mtime_ns)


def run_paths(model_dir: Path):
    report_file = model_dir / "daily_report.json"
    if not report_file.exists():
        sys.exit(f"ERROR: {report_file} missing - model folder is incomplete.")
    report = json.loads(report_file.read_text(encoding="utf-8"))
    fid = str(report.get("features_id", ""))
    fdir = EX.FEATURES_ROOT / fid
    ext = fdir / "extract_report.json"
    if not ext.exists():
        sys.exit(f"ERROR: extract report of features id {fid} not found: {ext}")
    cls_file = model_dir / "sign_daily_classes.json"
    classes = (json.loads(cls_file.read_text(encoding="utf-8")) if cls_file.exists()
               else report.get("classes") or [p.stem for p in sorted(fdir.glob("*.npy"))])
    return classes, json.loads(ext.read_text(encoding="utf-8")), fid


# --------------------------------------------------------------------------- #
# selection: highest complete-frame share in the span, ties -> first sorted
# --------------------------------------------------------------------------- #
def select_video(ext_report: dict, gloss: str):
    cands = [v for v in ext_report.get("videos", [])
             if v.get("gloss") == gloss and v.get("status") == "kept"
             and "complete_share" in v and "span" in v]
    best = None
    for v in sorted(cands, key=lambda v: v["path"].casefold()):
        if best is None or v["complete_share"] > best["complete_share"]:
            best = v
    return best


# --------------------------------------------------------------------------- #
# build one gloss's avatar arrays from cached landmarks
# --------------------------------------------------------------------------- #
def _fill_hand(seq: np.ndarray):
    """NaN frames (hand down / undetected) <- nearest detected frame in time."""
    det = np.isfinite(seq[:, 0, 0])
    if det.all():
        return seq, 0
    if not det.any():
        return np.zeros_like(seq), len(seq)
    di = np.flatnonzero(det)
    out = seq.copy()
    filled = 0
    for i in np.flatnonzero(~det):
        out[i] = seq[di[np.argmin(np.abs(di - i))]]
        filled += 1
    return out, filled


def build_avatar(video: Path, span, use_cache: bool):
    raw, hit = EX.load_or_detect(str(video), use_cache)
    pose, hands, face = raw["pose"], raw["hands"], raw["face"]
    W, H, T = int(raw["W"]), int(raw["H"]), len(pose)
    start, end = int(span[0]), int(span[1])
    end = min(end, T - 1)

    in_use = np.stack([EX.frame_in_use(pose[t], W, H) for t in range(T)])
    complete = EX.complete_mask(raw, in_use)
    sel = np.flatnonzero(complete[start:end + 1]) + start
    if sel.size == 0:
        return None, hit

    hl, fl = _fill_hand(hands[sel, 0])
    hr, fr = _fill_hand(hands[sel, 1])
    hands42 = np.concatenate([hl, hr], axis=1).astype(np.float32)   # (F, 42, 3)

    return dict(
        pose=pose[sel].astype(np.float32),                          # (F, 8, 4)
        hands=hands42,
        face=np.ascontiguousarray(face[sel, :len(FACE_OUT), :],
                                  dtype=np.float16),                # (F, 19, 3)
        t=raw["t"][sel].astype(np.float32),                         # (F,)
        filled=(int(fl), int(fr)),
        frames=int(sel.size),
        fps=float(raw["fps"]),
        W=W, H=H,
        span=[start, end],
        span_frames=end - start + 1,
    ), hit


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main():
    ap = argparse.ArgumentParser(description="Capture per-gloss avatar data.")
    ap.add_argument("--model-id", default=None, help="model folder name (default: newest)")
    ap.add_argument("--no-cache", action="store_true", help="ignore the landmark cache")
    args = ap.parse_args()

    model_dir = find_model_dir(args.model_id)
    classes, ext_report, fid = run_paths(model_dir)
    avatar_root = model_dir / "avatar"
    avatar_root.mkdir(parents=True, exist_ok=True)

    print(f"Model    : {model_dir.name}")
    print(f"Features : {fid}")
    print(f"Classes  : {len(classes)}")
    print(f"Avatar   : {avatar_root}\n")

    done = skipped = 0
    t0 = time.time()
    for gloss in classes:
        pick = select_video(ext_report, gloss)
        if pick is None:
            print(f"  {gloss:<24} SKIPPED (no kept video with span info)")
            skipped += 1
            continue
        video = EX.DATASET_DIR / pick["path"]
        if not video.exists():
            print(f"  {gloss:<24} SKIPPED (video missing: {pick['path']})")
            skipped += 1
            continue

        data, hit = build_avatar(video, pick["span"], not args.no_cache)
        if data is None:
            print(f"  {gloss:<24} SKIPPED (no complete frame in span)")
            skipped += 1
            continue

        out = avatar_root / gloss
        if out.exists():
            shutil.rmtree(out)
        out.mkdir(parents=True)
        np.save(out / "pose.npy", data["pose"])
        np.save(out / "hands.npy", data["hands"])
        np.save(out / "face.npy", data["face"])
        np.save(out / "t.npy", data["t"])
        meta = dict(
            gloss=gloss,
            source_video=pick["path"],
            source_video_abs=str(video),
            frame_rate=data["fps"],
            width=data["W"], height=data["H"],
            span=data["span"], span_frames=data["span_frames"],
            complete_frames=data["frames"],
            complete_share=pick["complete_share"],
            hand_filled_frames=list(data["filled"]),
            pose_indices=POSE_OUT,
            face_indices=FACE_OUT,
            hands_layout="left 21 + right 21",
            features_id=fid,
            model_id=model_dir.name,
            landmark_cache="hit" if hit else "miss",
            created=datetime.now().isoformat(timespec="seconds"),
        )
        (out / "meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
        print(f"  {gloss:<24} {Path(pick['path']).name}  "
              f"share {pick['complete_share']:.2f}  frames {data['frames']}  "
              f"({data['fps']:.1f} fps)")
        done += 1

    print(f"\nAvatar capture complete | {done} glosses written, {skipped} skipped | "
          f"{time.time() - t0:.1f}s")
    print(f"Next:  py test_model.py")


if __name__ == "__main__":
    main()