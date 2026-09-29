"""
tools/build_index.py

Writes ONE coordinated master index at dataset/index.jsonl covering every data
coordinate in the project: raw sources, extracted hold-sequences, video
sequences, reference media, community samples and trained models.

Every record carries sample_id / kind / label / source / path / split /
verification so downstream tooling can join on a single key.

Run:
    cd "d:\\Download\\Projects\\WBSL Bridge"
    & "tests\\.venv\\Scripts\\python.exe" tools\\build_index.py
"""
import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
DS = ROOT / "dataset" / "Indian Sign Language_Dataset"
DT = ROOT / "dataset_train"
OUT = ROOT / "dataset" / "index.jsonl"
recs = []


def rel(p):
    return str(Path(p).relative_to(ROOT))


# ── 1. Raw static images (ISL_STATIC1 + ISL_STATIC2) ──
for cd in sorted(d for d in (DS / "ISL_STATIC2").iterdir() if d.is_dir()):
    n = len(list(cd.glob("*.jpg")))
    if (DS / "ISL_STATIC1" / cd.name).exists():
        n += len(list((DS / "ISL_STATIC1" / cd.name).glob("*.jpg")))
    recs.append({"sample_id": f"RAW_STATIC_{cd.name}", "kind": "raw_static_images", "label": cd.name,
                 "source": "ISL_STATIC1+ISL_STATIC2", "path": rel(cd), "count": n,
                 "split": "unassigned", "verification": "n/a"})

# ── 2. Raw videos (ISL_VIDEO) ──
for vd in sorted(d for d in (DS / "ISL_VIDEO").iterdir() if d.is_dir()):
    g = vd.name.upper().replace(" ", "_")
    recs.append({"sample_id": f"RAW_VIDEO_{g}", "kind": "raw_videos", "label": g,
                 "source": "ISL_VIDEO", "path": rel(vd), "count": len(list(vd.glob("*.mp4"))),
                 "split": "unassigned", "verification": "n/a"})

# ── 3. Extracted static hold-sequences ──
for p in sorted((DT / "unified_static").glob("*.npy")):
    a = np.load(p)
    recs.append({"sample_id": f"HOLD_{p.stem}", "kind": "static_hold_sequences", "label": p.stem,
                 "source": "extracted", "path": rel(p), "sequences": int(a.shape[0]),
                 "frames": int(a.shape[1]), "split": "train+val", "verification": "n/a"})

# ── 4. Extracted video sequences ──
for p in sorted((DT / "unified_video").glob("*.npy")):
    a = np.load(p)
    recs.append({"sample_id": f"VSEQ_{p.stem}", "kind": "video_sequences", "label": p.stem,
                 "source": "extracted", "path": rel(p), "sequences": int(a.shape[0]),
                 "frames": int(a.shape[1]), "split": "train+val", "verification": "n/a"})

# ── 5. Reference media (one auto-copied sample per class) ──
sm = ROOT / "backend" / "data" / "sign_media.json"
if sm.exists():
    for label, m in json.loads(sm.read_text(encoding="utf-8")).items():
        recs.append({"sample_id": f"REF_{label}", "kind": "reference_media", "label": label,
                     "source": "auto-copied", "path": f"backend/media/{m['filename']}",
                     "media_type": m["type"], "url": m["url"],
                     "split": "n/a", "verification": "admin-approved"})

# ── 6. Community samples (real uploads: video -> landmarks -> npy) ──
man = ROOT / "dataset" / "manifest.jsonl"
if man.exists():
    for line in man.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        r = json.loads(line)
        recs.append({"sample_id": f"COM_{r['sample_id']}", "kind": "community_sample", "label": r["label"],
                     "source": f"community:{r['signer_id']}", "signer": r["signer_id"],
                     "path": r["landmark_path"], "frames": r["frames"],
                     "split": r.get("split", "unassigned"),
                     "verification": r.get("verification", "pending")})

# ── 7. Trained models ──
for mp_ in [("sign_mlp.onnx", "MLP-static"), ("sign_unified_lstm.onnx", "LSTM-unified")]:
    if (ROOT / "models" / mp_[0]).exists():
        recs.append({"sample_id": f"MODEL_{mp_[1]}", "kind": "model", "label": mp_[1],
                     "source": "trained", "path": f"models/{mp_[0]}",
                     "split": "n/a", "verification": "n/a"})

rep = DT / "unified_report.json"
if rep.exists():
    for r in recs:
        if r["kind"] == "model" and "unified" in r["label"]:
            r["metrics"] = json.loads(rep.read_text(encoding="utf-8"))

OUT.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in recs), encoding="utf-8")
kinds = {}
for r in recs:
    kinds[r["kind"]] = kinds.get(r["kind"], 0) + 1
print(f"index written: {len(recs)} records")
for k, v in kinds.items():
    print(f"  {k}: {v}")