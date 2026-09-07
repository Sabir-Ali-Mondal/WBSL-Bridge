# WBSL Bridge — Live Execution & Training Data Indexing

**Document:** docs/research/live-execution-data-indexing.md
**Date:** 1 September 2026
**Parent:** docs/research/unknown-signs.md (Phase 5)
**Related:** docs/research/community-data-verification.md (Phase 6)
**MVT Phase:** Phase 5 (runtime) + Phase 6 (data management)

This document captures two operational topics for the unknown-sign system:
1. How the system runs in real time, manages timing, and produces output.
2. How training data must be indexed to support signer independence, verification, and safe retraining.

---

# Part A — Live Execution of the Unknown-Sign System

## A.1 How It Works Live: Fast Path vs Slow Path

The key design rule: **split the pipeline into a FAST path and a SLOW path.** The LLM is slow, so it cannot run in the real-time loop.

```text
FAST PATH (real-time, every frame)          SLOW PATH (background, async)
─────────────────────────────────          ──────────────────────────────
Camera 30 FPS                               UNKNOWN signs only
   ↓                                            ↓
MediaPipe -> 540 landmarks                    Movement Analyzer
   ↓                                            ↓
Buffer window                                 Local LLM (2-10 sec)
   ↓                                            ↓
Temporal Encoder + OOD Gate                   Candidate meanings
   ↓                                            ↓
KNOWN -> emit immediately                     Insert back into timeline
UNKNOWN -> push to queue  ───────────────>    at correct timestamp
```

- Recognition and the OOD gate run **every window** (~1.5 seconds). Fast.
- Only when the gate says UNKNOWN does the slow LLM reasoning start, in the background.
- Known signs appear instantly. Unknown signs show "[UNCLASSIFIED - analyzing...]" first, then update to candidates when the LLM finishes.

This keeps the webcam feed smooth while the heavy reasoning happens off the critical path.

## A.2 How Timing Is Managed

### The core problem
Continuous signing has no spaces between signs. You must detect **when a sign starts and ends**.

### The solution: velocity-dip segmentation
Signs are separated by brief pauses or slowdowns. Detect them from wrist velocity.

```text
Wrist velocity over time:

    HIGH   ┌──┐    ┌──┐       ┌──┐
           │  │    │  │       │  │      <- movement = inside a sign
    LOW ───┘  └────┘  └───────┘  └──    <- dip = boundary between signs
           sign1  gap  sign2  gap  sign3
```

Rule: when wrist velocity stays below a threshold for K consecutive frames, mark a sign boundary. Each segment between boundaries becomes one window for the temporal encoder.

### Sliding window with overlap
To avoid cutting a sign in half, use overlapping windows:

```text
Window size:  45 frames  (~1.5 sec at 30 FPS)
Stride:       22 frames  (50% overlap)
```

### Stream alignment with timestamps
Gloss, NMM, and emotion are computed per frame. Every packet is tagged with a timestamp so all streams align:

```text
frame_time = frame_index / 30.0   (seconds)

packet = {
  window_id:  9,
  timestamp:  [15.1, 16.9],      <- start and end of the sign
  gloss:      ...,
  nmm:        nmm_at(timestamp),
  emotion:    emotion_at(timestamp)
}
```

Because every stream uses the same timestamp, you never have the overlap/conflict problem. Each window is one aligned unit.

### Timing table

| Component | Frequency | Latency budget |
|:---|:---|:---|
| MediaPipe landmark extraction | Every frame (30 FPS) | <35 ms |
| Buffer + segmentation | Every frame | <5 ms |
| Temporal encoder + OOD gate | Per window (~1.5 sec) | <50 ms |
| Movement analyzer | Per UNKNOWN sign | <20 ms |
| LLM candidate reasoning | Per UNKNOWN sign (async) | 2-10 sec |
| Bengali NLG | Per sentence | 3-130 sec |

## A.3 How It Outputs Like the Prompt We Created

### Output for a KNOWN sign

```json
{
  "window_id": 7,
  "timestamp": [12.4, 13.8],
  "type": "KNOWN",
  "gloss": "WATER",
  "confidence": 0.91,
  "nmm": {"question": false, "negation": false},
  "emotion": "neutral"
}
```

### Output for an UNKNOWN sign

```json
{
  "window_id": 9,
  "timestamp": [15.1, 16.9],
  "type": "UNKNOWN",
  "gloss": "[UNCLASSIFIED]",
  "confidence": 0.31,
  "movement": {
    "numerical": {
      "finger_extension": 0.92,
      "wrist_velocity": 0.42,
      "repetition": 3,
      "distance_to_mouth": 0.16,
      "duration_s": 0.81
    },
    "symbolic": ["RIGHT_HAND", "INDEX_EXTENDED", "TOWARD_MOUTH", "REPEATED_3X", "NO_NMM"],
    "natural_language": "The right hand starts near the chest, moves upward toward the mouth, pauses briefly, and returns. The movement is repeated three times."
  },
  "context": {"prev": "YOU", "next": "WATER"},
  "candidates": [
    {"meaning": "DRINK", "confidence": 0.45, "evidence": "Repeated movement toward mouth + context WATER"},
    {"meaning": "EAT", "confidence": 0.25, "evidence": "Mouth-directed movement"},
    {"meaning": "THIRSTY", "confidence": 0.15, "evidence": "Contextual relation to WATER"}
  ],
  "status": "TENTATIVE - HUMAN VERIFICATION REQUIRED"
}
```

### How it feeds the Bengali NLG prompt

The system collects packets into a sentence sequence. When the signer pauses (end of sentence), the sequence is converted into the gloss format the NLG prompt expects:

```text
YOU + DRINK[?tentative] + WATER
```

Because the UNKNOWN sign carries `status: TENTATIVE`, the NLG prompt adds the uncertainty marker. The Bengali output becomes:

```text
তুমি সম্ভবত পান করছ, জল।
```

The word **সম্ভবত** (probably) is injected automatically because the packet is marked UNKNOWN/TENTATIVE. That is how honesty flows from the OOD gate all the way into the final Bengali sentence.

### Summary flow

```text
Frames -> segment by velocity dip -> per-window encoder + OOD gate
   -> KNOWN: emit gloss instantly
   -> UNKNOWN: async LLM builds 3-tier representation + candidates
   -> both merged into a timestamped packet sequence
   -> at sentence end, packets become the gloss prompt
   -> Bengali NLG adds "সম্ভবত" wherever a sign was UNKNOWN
```

The three design pillars: **segment by movement dips, align streams by timestamps, and run the slow LLM off the real-time path.**

---

# Part B — Training Data Indexing

## B.1 Core Principle

> **Index training data by provenance and signer, not just by label.**

A label-only index (e.g. `DRINK.npy`, `EAT.npy`) is enough to train, but it cannot support signer-independent evaluation, verification filtering, similarity search, or safe retraining.

## B.2 The Manifest: The Index Itself

The index is a single **manifest file** — one record per sample. This is the source of truth. Everything else (splits, embeddings, training) is derived from it.

Use `manifest.jsonl` (one JSON object per line):

```json
{
  "sample_id": "v003_DRINK_S07_20260901T143205_r02",
  "label": "DRINK",
  "signer_id": "S07",
  "split": "train",
  "source": "community",
  "verification": "accepted",
  "verified_by": "R02",
  "captured_at": "2026-09-01T14:32:05Z",
  "frames": 45,
  "landmark_path": "samples/DRINK/S07/v003_DRINK_S07_20260901T143205_r02.npy",
  "embedding_row": 1234,
  "augmentation_of": null
}
```

| Field | Why It Exists |
|:---|:---|
| `sample_id` | Globally unique, human-readable. Encodes version + label + signer + time |
| `label` | The gloss |
| `signer_id` | Anonymized signer. Required for signer-disjoint splits |
| `split` | train / val / test. Assigned by signer, never randomly per sample |
| `source` | original / community / unknown_queue_promoted |
| `verification` | pending / accepted / rejected / needs_review. Train only on accepted |
| `embedding_row` | Row index into the embedding matrix for similarity search |
| `augmentation_of` | Links augmented copies to their source sample |

## B.3 The #1 Rule: Signer-Disjoint Splits

This directly serves signer independence (Gap G3) and the evaluation benchmark (Gap G18).

Never split randomly by sample. Split by signer, so a test signer never appears in training. Otherwise the model memorizes signer-specific features and your accuracy numbers are fake.

```python
import random
from collections import defaultdict

def signer_disjoint_splits(samples, train=0.7, val=0.15, seed=42):
    by_signer = defaultdict(list)
    for s in samples:
        by_signer[s["signer_id"]].append(s)

    signers = sorted(by_signer.keys())
    random.Random(seed).shuffle(signers)

    n = len(signers)
    n_train = int(n * train)
    n_val = int(n * val)

    split_of_signer = {}
    for i, sid in enumerate(signers):
        if i < n_train:            split_of_signer[sid] = "train"
        elif i < n_train + n_val:  split_of_signer[sid] = "val"
        else:                      split_of_signer[sid] = "test"

    for s in samples:
        s["split"] = split_of_signer[s["signer_id"]]
    return samples
```

Rule: every sample inherits its signer's split. Test signers must never appear in train.

## B.4 The Embedding Index (for similarity search and OOD)

Phase 5 (unknown-sign pipeline) and Phase 6 (community verification) both need a vector index over known signs.

After training the temporal encoder, extract an embedding for every **accepted** sample:

```text
embeddings.npy      N x D matrix
ids.json            row index -> sample_id
```

Then build two derived structures:

- **Per-class centroid + covariance** — for the Mahalanobis OOD gate (KNOWN vs UNKNOWN).
- **k-NN index** — for similarity search over unknown signs and community submissions. For small scale, brute-force numpy is fine; move to FAISS only if the dataset grows large.

Rebuild this index every time the dataset version changes.

## B.5 Dataset and Model Versioning

Every retraining snapshots a version so you can roll back:

```text
dataset/
├── manifest.jsonl                 <- the index (source of truth)
├── splits.json                    <- signer -> split assignment
├── embeddings/
│   ├── v003_embeddings.npy
│   └── v003_ids.json
├── samples/
│   └── {label}/{signer_id}/{sample_id}.npy
└── models/
    └── v003/
        ├── model.onnx
        └── training_config.json   <- dataset_version, hyperparams, accuracy
```

`training_config.json` records which `dataset_version` produced the model, so model and data are always traceable.

## B.6 Indexing Mistakes to Avoid

| Mistake | Consequence | Fix |
|:---|:---|:---|
| Random per-sample split | Test signer leaks into train; inflated accuracy | Signer-disjoint split |
| Training on unverified community data | Model poisoned by wrong labels | Filter `verification == accepted` |
| Augmented copies in wrong split | Train/test leakage | Augmented sample inherits source's split via `augmentation_of` |
| Label-only index | Cannot track signer, provenance, or verification | Full manifest with metadata |
| Rebuilding embeddings without versioning | Similarity search uses stale vectors | Version the embedding index |

## B.7 Building the Index in Practice

A small script that reads current `.npy` files and writes the manifest:

```python
import json
import numpy as np
from pathlib import Path

records = []
for npy in Path("dataset_continuous/npy").glob("*.npy"):
    label = npy.stem.rsplit("_", 1)[0]
    records.append({
        "sample_id": f"v001_{label}_{npy.stem.rsplit('_',1)[1]}",
        "label": label,
        "signer_id": "S01",          # TODO: capture per signer
        "source": "original",
        "verification": "accepted",
        "landmark_path": str(npy),
        "frames": int(np.load(npy).shape[0]),
        "augmentation_of": None
    })

with open("manifest.jsonl", "w", encoding="utf-8") as f:
    for r in records:
        f.write(json.dumps(r, ensure_ascii=False) + "\n")
```

## B.8 Summary

The index is a **manifest** keyed by a provenance-rich `sample_id`, with three mandatory dimensions beyond the label:

1. **Signer** — for signer-disjoint splits and signer-independent evaluation.
2. **Verification status** — so only human-accepted community data enters training.
3. **Embedding row** — for similarity search and the OOD gate.

Start by capturing `signer_id` in your recorder (MVT 2.4), because it is the one field you cannot add later.
