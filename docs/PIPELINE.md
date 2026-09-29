# WBSL Bridge — Pipeline Documentation

> **Status of this document:** written from a verified inspection of the repository on
> 2026-09-28. Every claim marked ✅ was checked by running a command or reading a file;
> claims marked ⚠️ are deductions that still need a runtime confirmation.
>
> **Scope:** how raw dataset files become a trained ONNX model, how that model is
> served, and how the reference-media library (Text → Sign) is populated — plus the
> exact bugs that make models `2` and `3` "detect nothing".

---

## 1. Executive summary — the three real bugs

| # | Bug | Evidence | Impact |
|:--|:----|:---------|:-------|
| **B1** | **Frame endpoint cannot feed a temporal model.** `POST /api/predict/frame` builds a single 126-vector and calls `session.run(None, {INPUT_NAME: vec.reshape(1, 126)})`. Models `2` and `3` declare input `[batch, 32, 126]`. | ✅ `backend/main.py` vs probed shapes below | The main "Predict" button silently fails for any LSTM model. Only the MLP (`1`) works. |
| **B2** | **The activation guard tested the wrong property.** It compared `shape[-1]` to `126`, but *both* a static `[N,126]` and a temporal `[N,32,126]` end in `126` — so the check could never distinguish them, and it waved through graphs the frame route then failed on. | ✅ `backend/main.py` | Model activation appeared to succeed while the app served an unusable contract. |
| **B3** | **The reference library was never built.** `sign_media.json` contained only `"1"` and `"2"`; `backend/media/` held only `1.jpg`, `2.jpg`. `tools/build_reference_samples.py` existed and was correct but had never run; `dataset/index.jsonl` did not exist either. | ✅ directory listing | Text → Sign showed 2 signs out of 97. Every other chip rendered an empty box. |

### Fix status — all three implemented and verified

| Bug | Fix applied | Verified by |
|:----|:------------|
| **B1** | `/api/predict/frame` now returns **409** with the required clip length when a temporal model is active; `/api/predict/clip` returns 409 for a static model and reads its frame count from the graph contract | Live HTTP test on both models |
| **B2** | Discovery probes **rank + frames + width**; `endpoint` is published per model; `_check_model_available()` validates the feature width; `/api/system/health` exposes a `contract` block | `admin/models` shows rank 2/frames 1 vs rank 3/frames 32 |
| **B3** | `build_reference_samples.py` rewritten data-driven and **run**; 97 references registered; `dataset/index.jsonl` built (291 records) | 97 files in `backend/media/`, 97 entries in `sign_media.json` |

**Bonus finds while implementing:**
- A **phantom duplicate class**: `ISL_VIDEO/` has 61 folders (one is `Fedup`) yet `unified_video/` held 62 `.npy` files, because `FEDUP.npy` (pre-override) and `FED_UP.npy` both survived. Run `3` trained 62 classes — two labels splitting the confidence mass for one physical sign. Stale file and stale media entry removed; retraining will yield 61. See §2.
- `/api/predict/clip` hard-coded `SEQ_T` instead of reading the graph's declared `frames`; it now uses the contract.
- `/api/text-to-sign` reported `available_signs` as the *model's* class count while only a fraction had playable media. `/api/coverage` now reports both numbers separately.

---

## 2. Verified ONNX input contracts

This is the single most important table in the project. It was produced by loading each
graph with `onnxruntime` and printing `get_inputs()` — ✅ verified:

```
models/onnx_models/1/sign_mlp.onnx        -> [('landmarks', ['batch', 126],      'tensor(float)')]
models/onnx_models/2/sign_unified_lstm.onnx -> [('sequence',  ['batch', 32, 126], 'tensor(float)')]
models/onnx_models/3/sign_video_lstm.onnx   -> [('sequence',  ['batch', 32, 126], 'tensor(float)')]
```

| Run | Graph | Kind | Input | Classes | Class file |
|:----|:------|:-----|:------|--------:|:-----------|
| `1` | `sign_mlp.onnx` | **static** (1 frame) | `[N, 126]` | 35 | `sign_classes.json` |
| `2` | `sign_unified_lstm.onnx` | **temporal** (32 frames) | `[N, 32, 126]` | 97 | `sign_unified_classes.json` |
| `3` | `sign_video_lstm.onnx` | **temporal** (32 frames) | `[N, 32, 126]` | 61 | `sign_video_classes.json` |

**Consequence:** a model is not "better" or "worse" — it is a *different input contract*.
The serving layer must route a request to the right endpoint based on that contract,
which is exactly what B1 fails to do.

> **Note on class counts.** `1` has 35 classes (`1`–`9` + `A`–`Z` — no `0`).
> `2` has 97 (`0`–`9` + `A`–`Z` + 61 glosses). `3` has **62** (video glosses only).
> `dataset_train/unified_static/` currently holds **36** `.npy` files (it includes `0`),
> and `unified_video/` holds **62**. ✅ verified counts.

### The phantom class — root cause found

`ISL_VIDEO/` contains exactly **61** folders, and only one of them matches `*ed*`:
`Fedup`. Yet `dataset_train/unified_video/` holds **62** `.npy` files, because
both `FEDUP.npy` **and** `FED_UP.npy` exist on disk — and run `3` dutifully trained
62 classes, listing `FEDUP` and `FED_UP` as separate labels. ✅ verified

This is a stale-extraction artifact, not a data problem:

1. `GLOSS_OVERRIDE = {"Fedup": "FED_UP"}` (`train_unified.py:60`) was added
   **after** an earlier extraction run had already written `FEDUP.npy`.
2. `build_video()` skips any class whose output `.npy` already exists
   (`if not force and out_path.exists(): tracker.update(gloss, skipped=True)`),
   and the check is keyed on the **new** gloss name `FED_UP.npy` — which did not
   exist — so it extracted again and wrote a *second* file rather than replacing
   the first.
3. Stale files are never pruned, so both survived into training.

**Consequence:** the model wastes a class on a duplicate, the two labels split the
confidence mass for one physical sign, and `sign_media.json` keys them separately.
A single `Fedup` sign therefore has half its training signal pointed at each label.

**Fix:** delete the stale `dataset_train/unified_video/FEDUP.npy`, keep
`FED_UP.npy`, and re-train. The general lesson is that extraction must be keyed on
*dataset folder identity*, not on the derived output filename — otherwise any
future change to `GLOSS_OVERRIDE` silently orphans the old file the same way.
See `docs/ROADMAP.md` §6 for the structural fix.

---

## 3. The pipeline, stage by stage

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ STAGE 0 — RAW DATASET            dataset/Indian Sign Language_Dataset/       │
│                                                                              │
│   ISL_STATIC1/   35 dirs   42,000 .jpg   (1–9, A–Z)      ← hand-focused      │
│   ISL_STATIC2/   36 dirs   36,000 .jpg   (0–9, A–Z)      ← hand-focused      │
│   ISL_VIDEO/     61 dirs    3,660 .mp4   (word/sentence) ← upper-body        │
│                                                                              │
│   Naming is the contract: folder name → gloss token.                         │
│   "Fedup" → FED_UP via GLOSS_OVERRIDE in train_unified.py:60                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1 — EXTRACTION             train_unified.py  (build_video / mode 1,4)  │
│                                                                              │
│   MediaPipe Hands (static_image_mode=True, max_num_hands=2)                  │
│   extract_two_hands()  →  126-dim float32 vector                             │
│        left  hand 21 pts × 3 coords  → 63 values   (block 1)                 │
│        right hand 21 pts × 3 coords  → 63 values   (block 2)                 │
│        reference = right wrist (fallback left)                               │
│        scale      = ‖landmark[9] − landmark[0]‖                              │
│        each hand translated by −ref, divided by scale; missing hand = zeros  │
│                                                                              │
│   Video: 32 frames sampled by linspace over the clip → (32, 126)             │
│   Output: dataset_train/unified_video/<GLOSS>.npy   →  array (n, 32, 126)    │
│                                                                              │
│   ⚠️ NOTE: train_unified.py is VIDEO-ONLY. It never writes unified_static/.   │
│      Those 36 static .npy files were produced by a different (older) script  │
│      that is no longer in the repo. This is why run `2` (97 classes) cannot  │
│      be reproduced by re-running train_unified.py today — see §6.            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2 — TRAINING               train_unified.py  train()  (mode 2,3)       │
│                                                                              │
│   UniLSTM(126 → 128, 2 layers, dropout 0.3) → Linear(128 → n_classes)        │
│   Loss CrossEntropy · Adam lr 1e-3 · 20 epochs · batch 64                    │
│   Split: per-class 15% to validation (seeded rng=42)                         │
│   Augmentation ×4 per sample: mirror L/R swap, ±0.35 rad rotation,           │
│     scale 0.85–1.15, ±0.12 translation, gaussian noise 0.006, time-warp 24–40│
│                                                                              │
│   Output folder: models/onnx_models/<next_id>/   (auto-incremented)          │
│     ├── sign_video_lstm.onnx        (opset 18, dynamic batch)                │
│     ├── sign_video_lstm.onnx.data   (external weights)                       │
│     ├── sign_video_classes.json     (labels in class-index order)            │
│     └── video_report.json           (best_val_acc, seq_len, feat)            │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STAGE 3 — DISCOVERY & SERVING    backend/main.py                             │
│                                                                              │
│   _discover_models()   scans models/ and models/onnx_models/*/ for *.onnx    │
│        · loads sibling *_classes.json (4 fallback name patterns)             │
│        · PROBES each graph to read its real input shape                      │
│        · marks temporal if name contains lstm | unified | video              │
│        · drops graphs with 0 classes or that fail to load                    │
│        · sorts by mtime (max of .onnx and .onnx.data)                        │
│                                                                              │
│   ModelRegistry.reload()  loads one graph + its classes, hot-swappable       │
│   Persists the choice to models/active_model.json                            │
│                                                                              │
│   Endpoints:                                                                 │
│     POST /api/predict/frame   ← 1 image   → needs [N,126]   (static only)    │
│     POST /api/predict/clip    ← 32 images → needs [N,32,126] (temporal only) │
│     GET  /api/admin/models            list + which is active                 │
│     POST /api/admin/models/activate   hot swap                               │
│     POST /api/admin/models/rescan     re-scan disk                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STAGE 4 — APPLICATION SURFACES                                               │
│                                                                              │
│   Sign → Text:  camera frame → /api/predict/frame → gloss history            │
│                 → /api/nlg/stream (SSE) → Bengali → /api/tts/generate        │
│                                                                              │
│   Text → Sign:  Bengali text → gloss_map.json lookup → gloss sequence        │
│                 → sign_media.json lookup → image/video playback              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. How a model gets selected (and why it drifts)

Startup order in `backend/main.py`:

1. `REGISTRY = ModelRegistry()` runs `_discover_models()` and picks a target.
2. Target resolution: if `models/active_model.json` names a path that still exists →
   use it. Otherwise prefer the **newest temporal** model, else the newest of anything.
3. `REGISTRY.reload()` **overwrites** `active_model.json` with whatever it settled on.
4. `_sync_model_globals()` copies the registry handles into module globals
   (`session`, `INPUT_NAME`, `CLASSES`, `unified_session`, `ACTIVE_CLASSES`, …).

**Why this is fragile (B2):** step 3 rewrites the persisted choice, and step 2 prefers
*newest temporal*, so simply re-running training on a static-only dataset will silently
flip the app back to an LSTM — and if that LSTM's classes don't overlap the UI's
expectations, the panel and the health endpoint disagree. The registry never records
*why* it chose a model, so the disagreement is invisible in logs.

**The activation guard is also inconsistent.** `_check_model_available()` (line 444)
rejects a model when `not temporal and input_width != 126`. For a temporal graph,
`shape[-1]` is `126`, so the check passes — but the check is testing *width*, while the
real incompatibility is *rank* (`2` vs `3` dimensions). This is B1's mirror image on
the admin side: the guard validates the wrong property.

---

## 5. The reference-media library (Text → Sign)

### What it is
`backend/data/sign_media.json` is a `label → {type, filename, url}` map.
`backend/main.py` loads it once at import (line 61) and attaches it to every catalog
entry in `_build_catalog()` (line 399). The file is served by `GET /api/media/{filename}`
from `backend/media/`. Admins can replace an entry via
`POST /api/admin/signs/{sign_id}/media`.

### Current state — ✅ verified
```
backend/data/sign_media.json   ->  2 entries: "1", "2"
backend/media/                 ->  2 files:   1.jpg, 2.jpg
```
So **2 of 97** signs have a reference. Everything else renders empty.

### The fix that already exists
`tools/build_reference_samples.py` does exactly the right thing:
- for each `ISL_STATIC2/<class>/`: pick the first of the first 15 images in which
  MediaPipe detects **two** hands; fall back to the first image; copy to
  `backend/media/<class>.jpg`; register as `{"type":"image"}`.
- for each `ISL_VIDEO/<class>/`: copy the first `.mp4` to `backend/media/<GLOSS>.mp4`;
  register as `{"type":"video"}`.

Two gaps to close:
1. **It has never been run.** Run it (§7 step 1).
2. **It skips `ISL_STATIC1`.** That folder has 35 classes of hand-focused imagery and is
   a valid fallback for any class missing from `ISL_STATIC2` (in practice only `0`
   differs, but the loop should be data-driven, not hard-coded to one folder).

### Why "one video/image per class" is the right design
It keeps the repo small (97 files instead of 3,660 videos), gives Text → Sign something
real to play immediately, and stays honest: these are *references*, not training data.
The full corpus stays in `dataset/` and is only ever read by the training scripts.

---

## 6. Reproducibility gap (important)

`train_unified.py` as it stands today can only produce a **61-class video-only** model —
the exact shape of run `3`. Run `2` (97 classes = 36 static + 61 video) was produced by a
script that read *both* `unified_static/` and `unified_video/`, and that script is not in
the repository. ✅ verified: `train_unified.py` only ever assigns `RAW_V = OUT /
"unified_video"` and its `train()` builds `classes` from `RAW_V.glob("*.npy")` alone.

**Implication:** if you delete `models/onnx_models/2/`, you cannot rebuild it. Either
(a) recover the unified training script, or (b) extend `train_unified.py` to optionally
merge static hold-sequences — see the roadmap in `docs/ROADMAP.md` §4.

---

## 7. Fix plan — implementation status

### ✅ Step 1 — populate the reference library (DONE)
```powershell
cd "D:\Download\Projects\WBSL Bridge"
& "tests\.venv\Scripts\python.exe" tools\build_reference_samples.py
& "tests\.venv\Scripts\python.exe" tools\build_index.py
```
Result: `entries: 97`, `index written: 291 records`. The builder is now
data-driven (`SOURCE_DIRS`), includes `ISL_STATIC1` as a fallback, is idempotent
without `--force`, supports `--only`, and cross-checks its keys against every
model's class list so a mismatch prints a warning instead of failing silently.

### ✅ Step 2 — make the frame endpoint contract-aware (DONE)
`predict_frame` now raises `409` when a temporal model is active, naming the
required clip length and the correct endpoint. `predict_clip` does the mirror:
`409` for a static model, and it reads the frame count from the graph contract
instead of a hard-coded `SEQ_T`. Verified live on both a static (`sign_mlp`) and
a temporal (`sign_video_lstm`) model.

> Still open (Phase 2 in the roadmap): **auto-routing**. A server-side 32-frame
> ring buffer would let the single Predict button work for both contracts. The
> 409 is the honest minimum; the buffer is the good UX.

### ✅ Step 3 — make the activation guard check the right property (DONE)
Discovery now records `input_rank`, `frames` and `input_width`, and `endpoint`.
`_check_model_available()` validates the **feature width** (the one thing every
route depends on, since both contracts end in the 126-landmark vector) instead
of comparing a width against a rank-shaped assumption.

### ✅ Step 4 — publish the contract so the UI can adapt (DONE)
`/api/system/health` now returns a `contract` block (`kind`, `input_rank`,
`frames`, `feature_width`, `endpoint`) and a `reference_coverage` summary. New
`GET /api/coverage` reports `total_classes` vs `with_media` vs `missing`, so the
UI can stop quoting the model's class count as "signs available".
Frontend: `sign-to-text` reads the contract, suppresses the frame poller when a
temporal model is active, captures `contract.frames` images for a clip, and shows
a banner explaining the switch.

### ✅ Step 5 — reconcile the class lists (DONE — root cause found)
`unified_video/` held 62 `.npy` files for 61 source folders. Cause: the
`GLOSS_OVERRIDE` entry for `Fedup` was added *after* an earlier extraction, so
`FEDUP.npy` was orphaned rather than replaced, and the skip-existing check (keyed
on the new output name) extracted a second file. Both survived into training.
Stale `FEDUP.npy`, `sign_media.json["FEDUP"]` and `backend/media/FEDUP.mp4`
removed; **run `3` must be retrained to drop the phantom class** (the existing
graph still declares 62 output classes).

> **Structural fix still needed:** key extraction on *dataset folder identity*,
> not on the derived output filename, and prune `.npy` files whose source folder
> no longer exists. Otherwise the next `GLOSS_OVERRIDE` change repeats this.

---

## 7b. Verified behaviour after the fixes

`GET /api/system/health` with the temporal model active:
```json
"active_model": "sign_video_lstm",
"active_classes": 62,
"contract": {
  "kind": "temporal", "input_rank": 3, "frames": 32,
  "feature_width": 126, "endpoint": "/api/predict/clip"
},
"reference_coverage": { "total_classes": 62, "with_media": 61, "missing": ["FEDUP"] }
```

Routing flips correctly with the active model:

| Active model | `POST /api/predict/frame` | `POST /api/predict/clip` | Coverage |
|:-------------|:--------------------------|:-------------------------|:---------|
| `sign_mlp` (static, run 1) | **200** — `NO_HAND` on a blank frame | 409 "active model is static" | **35/35** |
| `sign_video_lstm` (temporal, run 3) | 409 "expects a clip of 32 frames" | **200** — `ready: false` (no hands) | 61/62 |

Before the fix, the first row's `/api/predict/clip` call and the second row's
`/api/predict/frame` call both produced an opaque failure — the "detects nothing"
symptom. Both now return an actionable message.

---

## 8. How to run everything

```powershell
# ── one-time: rebuild the reference library ──
cd "D:\Download\Projects\WBSL Bridge"
& "tests\.venv\Scripts\python.exe" tools\build_reference_samples.py
& "tests\.venv\Scripts\python.exe" tools\build_index.py

# ── train (interactive menu) ──
& "tests\.venv\Scripts\python.exe" train_unified.py
#   1 = extract video sequences (skip existing)
#   2 = train + export ONNX   -> models/onnx_models/<next_id>/
#   3 = both
#   4 = force re-extract everything

# ── run the stack ──
.\start.ps1
#   Backend  http://localhost:8000
#   Frontend http://localhost:3000
#   AI server (koboldcpp) http://localhost:5001/v1/
```

**Choosing a model at runtime:** open `http://localhost:3000/admin/models`, hit
*Rescan*, then *Activate* the run you want. Remember: activate run `1` to use the
single-frame "Predict" button; activate `2` or `3` and you must use "Capture Clip".

### Health check
```
GET /api/system/health
```
Read `active_model`, `model_run`, `model_path`, `unified`, `active_classes`, and
`model_error`. If `model_path` disagrees with `models/active_model.json`, B2 is live.

---

## 9. File map (what owns what)

| Path | Owns |
|:-----|:-----|
| `dataset/Indian Sign Language_Dataset/` | raw corpus — the source of truth for classes |
| `dataset/samples/` | community uploads (`<label>/<signer>/<sample_id>.npy`) |
| `dataset/manifest.jsonl` | community upload records (append-only) |
| `dataset/index.jsonl` | master join index over every data coordinate |
| `dataset_train/unified_video/` | extracted `<GLOSS>.npy` arrays `(n, 32, 126)` |
| `dataset_train/unified_static/` | extracted `<CLASS>.npy` hold sequences (orphaned producer) |
| `models/onnx_models/<id>/` | one self-contained training run |
| `models/active_model.json` | persisted serving choice |
| `models/llm/` | koboldcpp + gemma gguf (NLG) |
| `backend/main.py` | registry, discovery, all HTTP endpoints |
| `backend/extract.py` | MediaPipe → 126-vector (must match training exactly) |
| `backend/data/gloss_map.json` | Bengali text → gloss tokens |
| `backend/data/sign_media.json` | gloss → reference image/video |
| `backend/media/` | the actual reference files |
| `tools/build_reference_samples.py` | auto-pick one sample per class |
| `tools/build_index.py` | write `dataset/index.jsonl` |
| `train_unified.py` | extraction + training + ONNX export |

### The one invariant that must never break
`backend/extract.py` and `train_unified.py`'s `extract_two_hands()` must stay
**byte-identical**. The comment at the top of `backend/extract.py` says so, and it is
correct: if inference normalisation drifts from training normalisation by even the
handedness slot order, every prediction degrades silently — no error, just wrong labels.
That is the most likely cause of a "model loads but detects nothing useful" symptom that
is *not* explained by B1.