"""
tools/build_reference_samples.py

Copies ONE real sample per class into backend/media/ and registers it in
backend/data/sign_media.json, so Text->Sign playback and the Contribute
"watch & copy" panel both show real data instead of nothing.

Sources are data-driven (SOURCE_DIRS below) rather than hard-coded to a single
folder, so adding a dataset is one entry. Order matters: the first directory
that yields a usable sample for a class wins, which makes ISL_STATIC2 canonical
for the digits/letters (it includes "0"; ISL_STATIC1 does not).

Idempotent: an existing entry is only replaced when --force is passed, so
re-running never churns files or invalidates an admin's manual upload.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py --force
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_reference_samples.py --only HELLO,THANK_YOU
"""
import argparse
import json
import shutil
import sys
from pathlib import Path

import cv2
import mediapipe as mp

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "dataset" / "Indian Sign Language_Dataset"
MEDIA = ROOT / "backend" / "media"
MEDIA.mkdir(parents=True, exist_ok=True)
MP = ROOT / "backend" / "data" / "sign_media.json"
MP.parent.mkdir(parents=True, exist_ok=True)

# (root, kind, glob) in precedence order — first hit per class wins.
SOURCE_DIRS = [
    (DS / "ISL_STATIC2", "image", "*.jpg"),
    (DS / "ISL_STATIC1", "image", "*.jpg"),
    (DS / "ISL_VIDEO", "video", "*.mp4"),
]

# Folder name -> official gloss token. Must match train_unified.py:60, otherwise
# the reference library keys drift from the model's class list.
GLOSS_OVERRIDE = {"Fedup": "FED_UP"}


def gloss_of(folder_name: str) -> str:
    return GLOSS_OVERRIDE.get(folder_name, folder_name.upper().replace(" ", "_"))


_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)


def both_hands(img) -> bool:
    """True when MediaPipe finds exactly two hands — a better reference frame."""
    res = _hands.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    return bool(res.multi_hand_landmarks) and len(res.multi_hand_landmarks) == 2


def pick_image(class_dir: Path, candidates: list) -> Path:
    """Prefer the first of the first 15 images showing both hands."""
    for f in candidates[:15]:
        img = cv2.imread(str(f))
        if img is not None and both_hands(img):
            return f
    return candidates[0]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true",
                    help="replace entries that already exist")
    ap.add_argument("--only", default="",
                    help="comma-separated glosses to (re)build")
    args = ap.parse_args()
    only = {g.strip().upper() for g in args.only.split(",") if g.strip()}

    media = json.loads(MP.read_text(encoding="utf-8")) if MP.exists() else {}
    before = len(media)
    added = replaced = kept = 0
    seen = set()

    for root, kind, pattern in SOURCE_DIRS:
        if not root.is_dir():
            print(f"  (skipping missing source {root.name})")
            continue
        for class_dir in sorted(d for d in root.iterdir() if d.is_dir()):
            gloss = gloss_of(class_dir.name)
            # Precedence: an earlier source already claimed this class.
            if gloss in seen:
                continue
            if only and gloss not in only:
                continue

            files = sorted(class_dir.glob(pattern))
            if not files:
                continue

            seen.add(gloss)
            dest = MEDIA / f"{gloss}{files[0].suffix.lower()}"
            old = media.get(gloss)

            if gloss in media and not args.force:
                # Already registered and the file is still on disk: leave it
                # alone so an admin's hand-picked upload is never overwritten.
                if (MEDIA / media[gloss]["filename"]).exists():
                    kept += 1
                    continue

            src = pick_image(class_dir, files) if kind == "image" else files[0]

            # Drop a stale file if the extension changed between sources.
            if old and old["filename"] != dest.name:
                stale = MEDIA / old["filename"]
                if stale.exists():
                    stale.unlink()

            shutil.copy(src, dest)
            media[gloss] = {
                "type": kind,
                "filename": dest.name,
                "url": f"/api/media/{dest.name}",
            }
            if old:
                replaced += 1
            else:
                added += 1
            print(f"  REF {gloss:<22} <- {root.name}/{class_dir.name}/{src.name}")

    MP.write_text(json.dumps(media, ensure_ascii=False, indent=2), encoding="utf-8")
    print()
    print(f"  entries: {before} -> {len(media)}  "
          f"(added {added}, replaced {replaced}, kept {kept})")

    # Cross-check against the model class lists so a key mismatch is loud.
    for classes_file in sorted(ROOT.glob("models/onnx_models/*/*classes*.json")):
        try:
            classes = json.loads(classes_file.read_text(encoding="utf-8"))
        except Exception:
            continue
        missing = [c for c in classes if c not in media]
        if missing:
            print(f"  WARNING: run {classes_file.parent.name}: "
                  f"{len(missing)}/{len(classes)} classes have no reference media "
                  f"-> {missing[:8]}{' ...' if len(missing) > 8 else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())