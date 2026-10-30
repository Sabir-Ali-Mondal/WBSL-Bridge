# ISL Sign Recognition — Run Guide

Companion for the four scripts: `extract.py`, `train.py`, `avatar_extract.py`,
`test_model.py`. Keep all four in the **same folder**.

---

## 1. Install

Python 3.9–3.11 recommended (MediaPipe wheel availability).

```bash
py -m pip install numpy opencv-python mediapipe
py -m pip install torch onnx onnxruntime        # CPU torch wheel is fine
```

---

## 2. Folder setup

Put the four scripts inside `model_training_zone/` (or at the project root
beside it — both work; paths are auto-discovered):

```
project/
├── model_training_zone/
│   ├── dataset/Indian Sign Language_Dataset/ISL_VIDEO/
│   │   ├── hello/            ← one folder per gloss
│   │   │   ├── video1.mp4
│   │   │   └── video2.mp4
│   │   └── thanks/
│   │       └── video1.mp4
│   ├── dataset_train/        ← created automatically (features/, cache/)
│   ├── extract.py
│   ├── train.py
│   ├── avatar_extract.py
│   └── test_model.py
└── models/onnx_models/       ← created automatically by train.py
```

Dataset rules:
- Folder name = class name (uppercased, spaces → `_`).
- Any common video format/resolution/fps.
- Signer faces the camera; **hands start down**, raise for the sign, put them
  down again at the end (the span state machine relies on this).

---

## 3. Run order

### Step 1 — extract features
```bash
py extract.py [--workers N] [--no-cache]
```
- Progress line: `% done, vid/s, ETA, kept/rejected`.
- Writes `dataset_train/features/<id>/<GLOSS>.npy` (N, 64, 98) +
  `extract_report.json`; caches landmarks in `dataset_train/cache/`.
- **Check:** every gloss has `kept > 0`; read the rejection reasons printed
  at the end (`NO_SPAN`, `GAP_TOO_LARGE`, …).

### Step 2 — train + export ONNX
```bash
py train.py
```
- Uses the newest features id (pin one by editing `FEATURES_ID = 3` at the top).
- Prints per-epoch loss/acc, validation acc / top-3 / macro P-R-F1.
- Writes `models/onnx_models/<id>/`:
  `sign_daily_lstm.onnx`, `sign_daily_classes.json`, `daily_report.json`,
  `confusion_matrix.json`, empty `avatar/`.
- The ONNX is deployed **only** if PyTorch and ONNX Runtime agree
  (max |logit diff| < 1e-3). A failed check leaves a `.staging_<id>` folder
  and deploys nothing.

### Step 3 — avatar capture
```bash
py avatar_extract.py [--model-id ID] [--no-cache]
```
- Fills `models/onnx_models/<id>/avatar/<GLOSS>/` with
  `pose.npy (F,8,4)`, `hands.npy (F,42,3)`, `face.npy (F,19,3)`,
  `t.npy (F,)`, `meta.json`.
- Picks each gloss's best video (highest complete-frame share in its span).
- Instant when the extract cache exists (no re-detection).

### Step 4 — live detection
```bash
py test_model.py [--model-id ID] [--width 640] [--complexity 0|1]
```
- Auto mode: raise a hand → recording starts; both hands down → result.
- Shows top-3 probabilities; `Not sure` when top < 0.5 or gap < 0.15;
  `Hands not clear, try again` when frames were incomplete.

| Key | Action |
|-----|--------|
| SPACE | start / stop manual recording |
| M | toggle auto ↔ manual |
| Q / ESC | quit |

On-screen: mode + state, REC timer + frame count, webcam FPS, inference ms.

---

## 4. Everyday workflows

| Task | Commands |
|------|----------|
| Added new videos | `extract.py` → `train.py` → `avatar_extract.py` → `test_model.py` (cache makes old videos instant) |
| Retrain same features | `train.py` only (new model id) |
| Test an older model | `test_model.py --model-id <id>` |
| Force re-detection | delete `dataset_train/cache/`, rerun extract |
| Faster live on weak PC | `test_model.py --width 480 --complexity 0` |
| Faster extraction | `extract.py --workers 8` (or env `EXTRACT_WORKERS=8`) |

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `no features found` at train | extract never ran / failed | run `extract.py`, check its report |
| Many `NO_SPAN` rejections | hands never clearly raised, or video starts with hands up | re-record: start hands down, raise clearly |
| Many `GAP_TOO_LARGE` | face/hands flicker (lighting, distance) | better light; signer closer; check `rescued_hand_frames` |
| Gloss with 0 kept videos | all its videos rejected | read its reasons in `extract_report.json`, re-record |
| Train: `no validation videos` | every gloss has 1 video | record ≥ 2 videos per gloss |
| ONNX verification failed | torch/onnx version mismatch | upgrade both, rerun `train.py`; delete stale `.staging_*` |
| Live always `Not sure` | thresholds vs. weak model | train more data; or tune `MIN_TOP_PROB` / `MIN_PROB_GAP` in `test_model.py` |
| Live `Hands not clear` | face/shoulders out of frame or occluded | step back; keep face + both shoulders visible |
| `cannot open webcam 0` | camera used by another app / wrong index | close other apps; change `cv2.VideoCapture(0)` index |
| Live picks a bad model | leftover `.staging_*` with an onnx | delete `.staging_*` folders (or apply fix #1 above) |

---

## 6. Consistency rules (do not break)

1. `train.py`, `avatar_extract.py`, `test_model.py` **import** `extract.py`.
   Never edit feature math in one place only — change `extract.py` and rerun
   the whole chain.
2. Changing detection parameters or `CACHE_VERSION` → delete
   `dataset_train/cache/` and rerun `extract.py` + `avatar_extract.py`.
3. `daily_report.json` links model id ↔ features id ↔ avatar data. Keep the
   model folder intact; don't move `avatar/` out of it.
4. Features ids and model ids are append-only (new id per run) — old runs stay
   reproducible; delete old folders only when disk space demands it.
```