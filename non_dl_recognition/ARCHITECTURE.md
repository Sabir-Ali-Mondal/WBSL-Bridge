# Non-DL Sign Recognition (WBSL) — System Architecture

Real-time sign language recognition without deep learning. Runs entirely on CPU using pre-extracted MediaPipe landmark feature sequences (64 frames × 98 features per sign, 61 classes).

---

## 1. File Structure

The entire module is self-contained within `non_dl_recognition/` using 4 code files, 1 doc, and 2 JSON reports:

```text
non_dl_recognition/
├── __init__.py                # Package exports (KNNRecognizer, TwoStageDTWRecognizer, HybridRecognizer)
├── recognition.py             # Constants + Numba Sakoe-Chiba DTW + KNN + Two-Stage DTW + Hybrid Recognizer
├── evaluation.py              # Unified CLI: grouped splits, benchmark runner, 5-fold CV, sweep, calibrate, selftest
├── live_test.py               # Real-time webcam inference with instant KNN preview → DTW confirmation cascade
├── ARCHITECTURE.md            # System architecture, stage breakdown, and benchmark documentation (this file)
└── reports/
    ├── rejection_thresholds.json   # Distance & margin rejection thresholds loaded at live runtime
    └── evaluation_report.json      # Offline evaluation reports (grouped holdout, CV, hyperparameter sweep)
```


---

## 2. In-Depth Breakdown: Stage 1 vs Stage 2

The recognition pipeline is structured as an asymmetric two-stage cascade: Stage 1 prioritizes rapid candidate shortlisting across the whole corpus, while Stage 2 provides temporal dynamic time-warping verification over only the most likely classes.

```text
[Sign Input: 64 frames × 98 features]
   │
   ▼ Slice Content Features [0:95] (drops hand flags [95:97] & duration [97])
┌───────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: KNN Cosine Candidate Shortlisting (recognition.py: KNNRecognizer)     │
├───────────────────────────────────────────────────────────────────────────────┤
│ 1. Vectorize: Flatten (64, 95) → (6,080,) vector.                             │
│ 2. Normalize: L2 unit-normalization of query vector in float32.               │
│ 3. BLAS Dot-Product: D = 1.0 - (q_norm @ X_train_norm.T) against all 2,712    │
│    training samples in a single matrix multiply (O(1) memory allocation).     │
│ 4. Instant Preview: k=3 nearest neighbors vote with 1 / (dist + 1e-3) weights │
│    to generate instant preview probabilities.                                 │
│ 5. Shortlist Candidates: Group samples by class and calculate global per-class│
│    minimum distance using np.minimum.reduceat → sort to extract Top-5 classes.│
│                                                                               │
│ • Latency: ~3.6 ms (single-query) / ~0.12 ms (batch)                          │
│ • Top-5 Candidate Recall: 99.6% (true class is present in 99.6% of shortlists)│
│ • Accuracy (as standalone classifier): 94.4%                                  │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       │ Top-5 Candidate Classes (~222 samples)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: Sakoe-Chiba Numba DTW Verification (recognition.py: TwoStageDTWRecognizer) │
├───────────────────────────────────────────────────────────────────────────────┤
│ 1. Subset Selection: Instead of running DTW against all 2,712 training clips  │
│    or 183 medoids, extract only the clips belonging to the Stage 1 Top-5      │
│    classes (~222 clips total across 5 glosses).                               │
│ 2. Parallel Alignment: Execute _dtw_many() parallelized across CPU cores:      │
│    - Sakoe-Chiba window constraint w = 10 frames (~15% warping boundary).     │
│    - Euclidean frame-to-frame distance on 95 content dimensions.              │
│    - O(M) memory rolling buffer in Numba compiled C-speed kernel.             │
│ 3. Class Distance Scoring: For each candidate class, take the mean of the     │
│    top-3 lowest DTW sequence distances (robust against individual outlier     │
│    exemplars).                                                                │
│ 4. Verification: Class with minimum aggregated DTW distance wins.             │
│                                                                               │
│ • Comparisons: 222 DTW alignments (91.8% reduction from 2,712 full alignments)│
│ • Latency: ~3.9 ms (single-query)                                             │
│ • Combined Accuracy: 99.4% (+5.0% boost over Stage 1 alone)                  │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       │ Best Class + Distance d1 + Margin (d2 - d1)
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│ REJECTION GATE (reports/rejection_thresholds.json)                            │
├───────────────────────────────────────────────────────────────────────────────┤
│ Calibrated using validation clips + synthetic / real out-of-vocabulary clips: │
│ • Check 1: DTW Distance <= 116.50 (rejects clips dissimilar to all classes)   │
│ • Check 2: Margin (d2 - d1) >= 25.65 (rejects ambiguous / indecisive signs)   │
│ If either check fails → Outputs "Not sure / Out of Vocabulary"                │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │
                                       ▼
                 [Final Verified Gloss + Confidence Displayed]
```

### Why this design wins:
1. **Zero Medoid Approximation Loss:** Traditional two-stage DTW uses 3 medoid exemplars per class in Stage 1, which misses subtle variations and drops Stage-1 recall to 95.7%. KNN exact matrix search evaluates *all 2,712 training vectors* in ~3.6 ms, boosting Top-5 recall to **99.6%**.
2. **Extreme DTW Pruning:** DTW alignment is mathematically rich and temporally flexible, but expensive. Limiting Stage 2 to only the 5 shortlisted classes slashes the alignment count from 2,712 to **222**, making DTW run in under 4 ms.
3. **True Real-time Cascadability:** In live webcam inference (`live_test.py`), the user sees the KNN preview instantly (~3.6 ms), and the DTW verification confirms the prediction seamlessly within the next video frame (~3.9 ms).

---

## 3. Benchmark Results

### Held-Out Test (Grouped Split, 679 Samples, Seed 42)
*Zero near-duplicate leakage (`build_groups` eps=0.001).*

| Pipeline Stage / Algorithm | Accuracy | Top-5 Recall | Macro F1 | Comparisons / Query | Single-Query Latency |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Stage 1: KNN Cosine (k=3, content[0:95])** | 94.4% | 99.6% | 0.9464 | 2,712 dot products | **3.64 ms** |
| **Stage 2: Two-Stage DTW (KNN prefilter)** | **99.4%** | **99.6%** | **0.9945** | **222 DTW aligns** | **3.90 ms** |

### 5-Fold Grouped Cross-Validation (Authoritative Full-Corpus Metric)
*Rotates across all 3,391 samples with group isolation to guarantee zero train/test leakage:*

| Algorithm | Mean Accuracy | Top-5 Recall | Macro F1 |
| :--- | :---: | :---: | :---: |
| **Stage 1: KNN Cosine (content[0:95])** | 93.42% ± 0.60% | 99.15% ± 0.30% | 0.9357 ± 0.0050 |
| **Stage 2: Two-Stage DTW (KNN prefilter)** | **98.76% ± 0.31%** | **99.15% ± 0.30%** | **0.9872 ± 0.0035** |

**Total Live Latency:** Under 8 ms per sign clip (KNN preview ~3.6 ms + DTW verification ~3.9 ms), operating comfortably within real-time 30 FPS camera loops.

---

## 4. How to Run

### Standard Daily Use

**1. Run Standard Evaluation (Default grouped split, KNN prefilter, 12 workers)**
```powershell
.venv\Scripts\python.exe -m non_dl_recognition.evaluation
```

**2. Run Real-Time Webcam Demo**
```powershell
.venv\Scripts\python.exe -m non_dl_recognition.live_test
```
*Live Controls:*
- `SPACE`: Manual trigger record toggle
- `M`: Toggle between Automatic sign-span detection and Manual mode
- `Q` or `ESC`: Quit

---

### Advanced CLI Commands

```powershell
# Run internal mathematical self-test suite (5 equivalence tests)
.venv\Scripts\python.exe -m non_dl_recognition.evaluation --selftest

# Run full 5-fold grouped cross-validation
.venv\Scripts\python.exe -m non_dl_recognition.evaluation --cv 5 --workers 12

# Check dataset for near-duplicate or augmentation leakage
.venv\Scripts\python.exe -m non_dl_recognition.evaluation --leakage-check --skip-dtw

# Run hyperparameter grid sweep over DTW window and candidate counts
.venv\Scripts\python.exe -m non_dl_recognition.evaluation --sweep

# Re-calibrate distance and margin rejection thresholds
.venv\Scripts\python.exe -m non_dl_recognition.evaluation --calibrate --split grouped

# Run live webcam in ultra-lightweight KNN-only mode (preview only)
.venv\Scripts\python.exe -m non_dl_recognition.live_test --no-dtw
```

---

## 5. Configuration & Hyperparameter Reference

All constants are defined at the top of [`recognition.py`](file:///d:/Download/Projects/WBSL%20Bridge/non_dl_recognition/recognition.py):

| Constant | Value | Purpose |
| :--- | :---: | :--- |
| `N_FRAMES` | `64` | Fixed sequence temporal length per sign clip |
| `N_FEATURES` | `98` | Full feature dimensionality from MediaPipe |
| `DTW_N_CONTENT` | `95` | Content features used (drops flags `[95:97]` and duration `[97]`) |
| `KNN_K` | `3` | Nearest neighbor vote count |
| `KNN_CONTENT_ONLY` | `True` | Strips metadata features to prevent offline/online capture drift |
| `KNN_EPS` | `1e-3` | Weight stabilizer for reciprocal distance calculation |
| `DTW_WINDOW` | `10` | Sakoe-Chiba band half-width (frames) |
| `DTW_TOP_M_CANDIDATES`| `5` | Number of candidate glosses passed from Stage 1 to Stage 2 |
| `DTW_TOP_K_AVG` | `3` | Number of best exemplar distances averaged per candidate gloss |
| `GROUP_EPS` | `1e-3` | Cosine distance threshold for grouping near-duplicate samples |
| `VAL_FRACTION` | `0.20` | Fraction for held-out validation split |
| `RANDOM_SEED` | `42` | Seed for deterministic, reproducible splits |
