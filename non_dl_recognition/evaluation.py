"""
evaluation.py — Unified Evaluation Pipeline for Non-DL Sign Recognition.

Capabilities:
  • Evaluation: Standard random or grouped splits
  • Leakage check: Union-find diagnostics for duplicate / near-duplicate isolation
  • Cross-Validation: N-fold grouped CV (stratified by class, whole groups preserved)
  • Parameter sweep: Grid-search DTW window / top_m / top_k_avg
  • Calibration: Distance-based rejection thresholds calibration (grid search over val + OOV)
  • Self-test: Built-in unit & equivalence tests (replaces tests/)

Usage:
  python -m non_dl_recognition.evaluation --selftest
  python -m non_dl_recognition.evaluation --split grouped --prefilter knn --workers 12
  python -m non_dl_recognition.evaluation --cv 5 --prefilter knn --workers 12
  python -m non_dl_recognition.evaluation --sweep
  python -m non_dl_recognition.evaluation --calibrate --split grouped
"""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import sys
import time
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from non_dl_recognition.recognition import (
    CLASSES_JSON, FEATURES_DIR, OOV_DIR, REPORT_JSON, REPORTS_DIR, THRESHOLDS_JSON,
    RANDOM_SEED, VAL_FRACTION, GROUP_EPS, CV_FOLDS,
    DTW_N_CONTENT, DTW_REPS_PER_GLOSS, DTW_TOP_M_CANDIDATES, DTW_TOP_K_AVG,
    KNN_K, KNN_CONTENT_ONLY,
    KNNRecognizer, TwoStageDTWRecognizer, dtw_distance, dtw_many, warmup,
)


def _save_report(key: str, value) -> None:
    """Merge `value` into reports/evaluation_report.json under `key`."""
    REPORT_JSON.parent.mkdir(parents=True, exist_ok=True)
    data = json.loads(REPORT_JSON.read_text(encoding="utf-8")) if REPORT_JSON.exists() else {}
    data[key] = value
    REPORT_JSON.write_text(
        json.dumps(data, indent=2, ensure_ascii=False,
                   default=lambda o: o.item() if hasattr(o, "item") else str(o)),
        encoding="utf-8")
    print(f"Saved '{key}' → {REPORT_JSON}")


# ── Splits & leakage ─────────────────────────────────────────────────────────

def _unit(X: np.ndarray) -> np.ndarray:
    """Flatten content features and unit-normalize (float32)."""
    F = X[:, :, :DTW_N_CONTENT].reshape(len(X), -1).astype(np.float32)
    return F / np.maximum(np.linalg.norm(F, axis=1, keepdims=True), 1e-9)


def leakage_report(X_train: np.ndarray, y_train: np.ndarray,
                   X_val: np.ndarray, y_val: np.ndarray,
                   top_n: int = 15) -> Dict:
    """Measure proximity of each validation clip to the training set."""
    Tn, Vn = _unit(X_train), _unit(X_val)
    D = 1.0 - Vn @ Tn.T                    # (val, train) cosine distances
    d_min  = D.min(axis=1)
    j_min  = D.argmin(axis=1)
    same   = y_val[:, None] == y_train[None, :]
    d_same  = np.where(same, D, np.inf).min(axis=1)
    d_other = np.where(~same, D, np.inf).min(axis=1)

    pct = [0, 1, 5, 25, 50, 75, 100]
    rep = {
        "n_val": int(len(X_val)),
        "min_dist_percentiles": {f"p{p}": float(np.percentile(d_min, p)) for p in pct},
        "frac_below": {f"{t:g}": float((d_min < t).mean()) for t in (1e-4, 1e-3, 1e-2, 5e-2)},
        "same_class_min_median": float(np.median(d_same)),
        "other_class_min_median": float(np.median(d_other)),
        "nn1_accuracy": float((y_train[j_min] == y_val).mean()),
    }

    print("\n── Leakage report (validation → train, cosine distance, content features) ──")
    print("  min-dist percentiles :", {k: round(v, 5) for k, v in rep["min_dist_percentiles"].items()})
    print("  fraction below       :", rep["frac_below"])
    print(f"  median same-class min {rep['same_class_min_median']:.4f}  "
          f"| other-class min {rep['other_class_min_median']:.4f}")
    print(f"  1-NN accuracy         {rep['nn1_accuracy']:.3f}")
    order = np.argsort(d_min)[:top_n]
    print(f"  {top_n} closest val→train pairs (val_idx, train_idx, class, dist):")
    for i in order:
        print(f"    {int(i):5d} {int(j_min[i]):5d}  class={int(y_val[i]):3d}  d={d_min[i]:.6f}")
    print("  READ: a visible cluster of distances ~1e-4..1e-3 (far below the median) means near-duplicates.\n"
          "        Re-run with --split grouped and compare accuracy.")
    return rep


def build_groups(X: np.ndarray, y: np.ndarray, eps: float = 1e-3) -> np.ndarray:
    """Union-find near-duplicate grouping within same-class clips."""
    U = _unit(X)
    parent = np.arange(len(X))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    for c in np.unique(y):
        idx = np.where(y == c)[0]
        D = 1.0 - U[idx] @ U[idx].T
        ii, jj = np.where(np.triu(D < eps, 1))
        for a, b in zip(ii, jj):
            ra, rb = find(idx[a]), find(idx[b])
            if ra != rb:
                parent[rb] = ra

    groups = np.array([find(i) for i in range(len(X))])
    print(f"  build_groups: {len(np.unique(groups))} groups for {len(X)} clips (eps={eps:g})")
    return groups


def grouped_split(y: np.ndarray, groups: np.ndarray,
                  val_fraction: float, seed: int) -> Tuple[np.ndarray, np.ndarray]:
    """Stratified by class; whole groups go to either train or val."""
    rng = np.random.default_rng(seed)
    tr, va = [], []
    for c in np.unique(y):
        idx = np.where(y == c)[0]
        g = groups[idx]
        ug = np.unique(g)
        rng.shuffle(ug)
        n_val = max(1, int(round(len(idx) * val_fraction)))
        got, val_g = 0, set()
        for gg in ug:
            if got >= n_val or len(val_g) == len(ug) - 1:   # always keep ≥1 group in train
                break
            val_g.add(gg)
            got += int((g == gg).sum())
        mask = np.array([x in val_g for x in g])
        va.extend(idx[mask].tolist())
        tr.extend(idx[~mask].tolist())
    return np.array(tr), np.array(va)


def grouped_folds(y: np.ndarray, groups: np.ndarray,
                  n_folds: int, seed: int) -> np.ndarray:
    """Stratified, group-aware fold assignment."""
    rng = np.random.default_rng(seed)
    fold = np.full(len(y), -1, dtype=np.int32)
    for c in np.unique(y):
        idx = np.where(y == c)[0]
        ug, counts = np.unique(groups[idx], return_counts=True)
        order = rng.permutation(len(ug))
        order = order[np.argsort(-counts[order], kind="stable")]   # big groups first
        load = np.zeros(n_folds)
        for o in order:
            f = int(np.argmin(load + rng.random(n_folds) * 1e-3))
            fold[idx[groups[idx] == ug[o]]] = f
            load[f] += counts[o]
    return fold


# ── Multiprocessing Worker Support for Two-Stage DTW ─────────────────────────
_G_DTW_RECOGNIZER: TwoStageDTWRecognizer = None


def _dtw_worker_init(rec: TwoStageDTWRecognizer):
    import numba
    global _G_DTW_RECOGNIZER
    _G_DTW_RECOGNIZER = rec
    numba.set_num_threads(1)   # process pool already parallelizes; avoid oversubscription
    warmup()


def _dtw_worker_eval(job):
    idx, query, true_cls, cands = job
    pred_cls, score, candidates = _G_DTW_RECOGNIZER.predict_sample(query, cands)
    return idx, pred_cls, (pred_cls == true_cls), (true_cls in candidates), candidates


# ── Dataset Loading & Split ───────────────────────────────────────────────────
def load_dataset(features_dir: Path, classes: list):
    X_parts, y_parts = [], []
    for i, cls in enumerate(classes):
        f = features_dir / f"{cls}.npy"
        if f.exists():
            X_parts.append(np.load(f))
            y_parts.append(np.full(len(X_parts[-1]), i, dtype=np.int32))
    if not X_parts:
        sys.exit(f"ERROR: No data loaded from {features_dir}")
    return np.concatenate(X_parts), np.concatenate(y_parts)


def train_val_split(
    X_all: np.ndarray, y_all: np.ndarray, classes: List[str],
    val_fraction: float = VAL_FRACTION, seed: int = RANDOM_SEED,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    rng = np.random.default_rng(seed)
    tr_idx, va_idx = [], []
    for c in range(len(classes)):
        idx = np.where(y_all == c)[0]
        if len(idx) == 0:
            continue
        rng.shuffle(idx)
        n_val = max(1, int(round(len(idx) * val_fraction)))
        va_idx.extend(idx[:n_val].tolist())
        tr_idx.extend(idx[n_val:].tolist())
    return X_all[tr_idx], y_all[tr_idx], X_all[va_idx], y_all[va_idx]


def _confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, n_cls: int) -> np.ndarray:
    cm = np.zeros((n_cls, n_cls), dtype=np.int32)
    for t, p in zip(y_true, y_pred):
        if 0 <= t < n_cls and 0 <= p < n_cls:
            cm[t, p] += 1
    return cm


def _per_class_metrics(cm: np.ndarray, classes: List[str]) -> List[Dict]:
    out = []
    for i, name in enumerate(classes):
        tp = int(cm[i, i])
        fp = int(cm[:, i].sum()) - tp
        fn = int(cm[i, :].sum()) - tp
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec  = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1   = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0.0
        out.append({"class": name, "precision": prec, "recall": rec, "f1": f1,
                    "support": int(cm[i].sum())})
    return out


def fmt_time(s: float) -> str:
    s = int(max(0, s))
    return (f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}"
            if s >= 3600 else f"{s // 60}:{s % 60:02d}")


# ── 1. KNN Cosine Evaluator ───────────────────────────────────────────────────
def evaluate_knn(
    X_train: np.ndarray, y_train: np.ndarray,
    X_val: np.ndarray, y_val: np.ndarray,
    classes: List[str],
    k: int = KNN_K,
    content_only: bool = KNN_CONTENT_ONLY,
) -> Dict:
    tag = "content[0:95]" if content_only else "full[0:98]"
    print(f"\nEvaluating KNN cosine, direct 1-stage, k={k}, features={tag} ...")

    rec = KNNRecognizer(k=k, content_only=content_only)
    t0 = time.perf_counter()
    rec.fit(X_train, y_train)
    fit_ms = (time.perf_counter() - t0) * 1000.0

    rec.predict_proba(X_val[:1])

    n = len(X_val)
    t1 = time.perf_counter()
    probas = rec.predict_proba(X_val)
    batch_ms = (time.perf_counter() - t1) * 1000.0 / n

    n_single = min(200, n)
    t2 = time.perf_counter()
    for i in range(n_single):
        rec.predict_proba(X_val[i:i + 1])
    single_ms = (time.perf_counter() - t2) * 1000.0 / n_single

    top5, _ = rec.rank_classes(X_val, 5)
    pred = np.array([max(p.items(), key=lambda kv: kv[1])[0] for p in probas], dtype=np.int32)
    correct = int((pred == np.asarray(y_val, np.int32)).sum())
    recall = float(np.mean([int(y) in row for y, row in zip(y_val, top5)]))

    cm = _confusion_matrix(np.asarray(y_val, np.int32), pred, len(classes))
    macro_f1 = float(np.mean([m["f1"] for m in _per_class_metrics(cm, classes)]))

    print(f"  Accuracy={correct / n:.1%}  Top-5 recall={recall:.1%}  "
          f"single={single_ms:.2f} ms  batch={batch_ms:.2f} ms/query")

    return {
        "algorithm": f"KNN Cosine (k={k}, {tag})",
        "accuracy_overall": round(correct / n, 4),
        "stage1_top5_recall": round(recall, 4),
        "macro_f1": round(macro_f1, 4),
        "n_total": n,
        "n_correct": correct,
        "comparisons_per_query": len(X_train),
        "fit_ms": round(fit_ms, 1),
        "ms_per_query": round(single_ms, 2),
        "ms_per_query_batch": round(batch_ms, 2),
    }


# ── 2. Two-Stage DTW Evaluator ────────────────────────────────────────────────
def evaluate_two_stage_dtw(
    X_train: np.ndarray, y_train: np.ndarray,
    X_val: np.ndarray, y_val: np.ndarray,
    classes: List[str],
    workers: int = 12,
    k_reps: int = DTW_REPS_PER_GLOSS,
    top_m: int = DTW_TOP_M_CANDIDATES,
    prefilter: str = "knn",
) -> Dict:
    if prefilter == "knn":
        label = f"Two-Stage DTW (KNN top-{top_m} prefilter)"
    else:
        label = f"Two-Stage DTW ({k_reps} medoids + top {top_m})"
    print(f"\nEvaluating {label} ...")

    Xtr = X_train[:, :, :DTW_N_CONTENT].astype(np.float32)
    Xva = X_val[:,   :, :DTW_N_CONTENT].astype(np.float32)

    rec = TwoStageDTWRecognizer(k_reps=k_reps, top_m=top_m, top_k_avg=DTW_TOP_K_AVG)
    t0 = time.perf_counter()
    rec.fit(Xtr, y_train, len(classes))
    fit_ms = (time.perf_counter() - t0) * 1000.0

    cand_list = [None] * len(Xva)
    if prefilter == "knn":
        knn_pf = KNNRecognizer(content_only=True).fit(X_train, y_train)
        top, _ = knn_pf.rank_classes(X_val, top_m)
        cand_list = [row.tolist() for row in top]

    warmup()
    n_single = min(30, len(Xva))
    t_sq = time.perf_counter()
    for i in range(n_single):
        rec.predict_sample(Xva[i], cand_list[i])
    single_ms = (time.perf_counter() - t_sq) * 1000.0 / n_single

    total_val = len(Xva)
    jobs = [(i, Xva[i], int(y_val[i]), cand_list[i]) for i in range(total_val)]
    results = [None] * total_val
    done = 0
    t1 = time.perf_counter()

    with concurrent.futures.ProcessPoolExecutor(
        max_workers=workers,
        initializer=_dtw_worker_init,
        initargs=(rec,),
    ) as executor:
        futs = {executor.submit(_dtw_worker_eval, job): job[0] for job in jobs}
        for fut in concurrent.futures.as_completed(futs):
            results[futs[fut]] = fut.result()
            done += 1
            elapsed = time.perf_counter() - t1
            rate = done / max(elapsed, 1e-6)
            eta = (total_val - done) / rate if rate > 0 else 0.0
            sys.stdout.write(
                f"\r  Progress {100 * done / total_val:5.1f}% ({done}/{total_val}) "
                f"{rate:5.1f} q/s  ETA {fmt_time(eta)}\x1b[K"
            )
            sys.stdout.flush()
    print()

    thru_ms = (time.perf_counter() - t1) * 1000.0 / total_val
    correct = sum(1 for r in results if r[2])
    recall = sum(1 for r in results if r[3]) / total_val

    avg_per_cls = len(X_train) / len(classes)
    if prefilter == "knn":
        comps = int(top_m * avg_per_cls)
    else:
        comps = int(len(classes) * k_reps + top_m * avg_per_cls)

    pred = np.array([r[1] for r in results], dtype=np.int32)
    cm = _confusion_matrix(np.asarray(y_val, np.int32), pred, len(classes))
    macro_f1 = float(np.mean([m["f1"] for m in _per_class_metrics(cm, classes)]))

    print(f"  Accuracy={correct / total_val:.1%}  Top-{top_m} recall={recall:.1%}  "
          f"single-query={single_ms:.1f} ms  throughput={thru_ms:.1f} ms/query ({workers} workers)")

    return {
        "algorithm": label,
        "accuracy_overall": round(correct / total_val, 4),
        "stage1_top5_recall": round(recall, 4),
        "macro_f1": round(macro_f1, 4),
        "n_total": total_val,
        "n_correct": correct,
        "comparisons_per_query": comps,
        "fit_ms": round(fit_ms, 1),
        "ms_per_query": round(single_ms, 2),
        "ms_per_query_throughput": round(thru_ms, 2),
    }


# ── Calibration ──────────────────────────────────────────────────────────────

def synth_oov(X: np.ndarray, y: np.ndarray, rng: np.random.Generator, n: int = 300) -> np.ndarray:
    out = []
    for _ in range(n):
        i = int(rng.integers(len(X)))
        if rng.random() < 0.5:
            out.append(X[i][rng.permutation(X.shape[1])])
        else:
            j = int(rng.choice(np.where(y != y[i])[0]))
            cut = int(rng.integers(16, 48))
            out.append(np.concatenate([X[i][:cut], X[j][cut:]], axis=0))
    return np.stack(out).astype(np.float32)


def load_real_oov() -> np.ndarray | None:
    clips = []
    if OOV_DIR.exists():
        for f in sorted(OOV_DIR.glob("*.npy")):
            a = np.load(f)
            clips.append(a if a.ndim == 3 else a[None])
    return np.concatenate(clips) if clips else None


def grid_search(d1: np.ndarray, margin: np.ndarray, correct: np.ndarray,
                d1_oov: np.ndarray, m_oov: np.ndarray) -> dict:
    best = None
    all_d = np.concatenate([d1, d1_oov]) if len(d1_oov) else d1
    for td in np.quantile(all_d, np.linspace(0.05, 1.0, 60)):
        for tm in np.linspace(0.0, float(np.quantile(margin, 0.9)), 60):
            acc = (d1 <= td) & (margin >= tm)
            ac = float((acc & correct).sum()) / max(1, int(correct.sum()))
            aw = float((acc & ~correct).sum()) / max(1, int((~correct).sum()))
            ao = float(((d1_oov <= td) & (m_oov >= tm)).mean()) if len(d1_oov) else 0.0
            score = ac - 0.5 * aw - ao
            if best is None or score > best["score"]:
                best = dict(
                    score=float(score),
                    max_dist=float(td),
                    min_margin=float(tm),
                    accept_correct=float(ac),
                    accept_wrong=float(aw),
                    accept_oov=float(ao),
                )
    return best


def run_calibration(args) -> None:
    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    X_all, y_all = load_dataset(FEATURES_DIR, classes)

    if args.split == "grouped":
        g = build_groups(X_all, y_all, GROUP_EPS)
        tr_idx, va_idx = grouped_split(y_all, g, VAL_FRACTION, RANDOM_SEED)
        Xt, yt = X_all[tr_idx], y_all[tr_idx]
        Xv, yv = X_all[va_idx], y_all[va_idx]
    else:
        Xt, yt, Xv, yv = train_val_split(X_all, y_all, classes, VAL_FRACTION, RANDOM_SEED)

    rng = np.random.default_rng(RANDOM_SEED)
    oov_real = load_real_oov()
    print(f"OOV source: {'real clips (' + str(len(oov_real)) + ')' if oov_real is not None else 'synthetic only'}")
    synth = synth_oov(Xv, yv, rng)
    oov = synth if oov_real is None else np.concatenate([oov_real.astype(np.float32), synth])

    knn = KNNRecognizer(content_only=True).fit(Xt, yt)
    probas = knn.predict_proba(Xv)
    pred_knn = np.array([max(p.items(), key=lambda kv: kv[1])[0] for p in probas])

    _, dv = knn.rank_classes(Xv, 2)
    _, do = knn.rank_classes(oov, 2)
    knn_res = grid_search(
        dv[:, 0], dv[:, 1] - dv[:, 0], pred_knn == yv,
        do[:, 0], do[:, 1] - do[:, 0],
    )
    print("KNN thresholds:", knn_res)

    warmup()
    dtw = TwoStageDTWRecognizer(top_m=DTW_TOP_M_CANDIDATES).fit(
        Xt[:, :, :DTW_N_CONTENT].astype(np.float32), yt, len(classes)
    )

    def dtw_signals(X: np.ndarray):
        cands = None
        if args.prefilter == "knn":
            top, _ = knn.rank_classes(X, DTW_TOP_M_CANDIDATES)
            cands = [r.tolist() for r in top]
        preds, d1_list, mg_list = [], [], []
        for i in range(len(X)):
            ranked, _ = dtw.predict_detailed(
                X[i, :, :DTW_N_CONTENT].astype(np.float32),
                None if cands is None else cands[i],
            )
            preds.append(ranked[0][0])
            d1_list.append(ranked[0][1])
            mg_list.append(ranked[1][1] - ranked[0][1] if len(ranked) > 1 else np.inf)
        return np.array(preds), np.array(d1_list), np.array(mg_list)

    pv, d1v, mgv = dtw_signals(Xv)
    _,  d1o, mgo = dtw_signals(oov)
    dtw_res = grid_search(d1v, mgv, pv == yv, d1o, mgo)
    print("DTW thresholds:", dtw_res)

    out = {
        "knn": {"max_dist": knn_res["max_dist"], "min_margin": knn_res["min_margin"]},
        "dtw": {"max_dist": dtw_res["max_dist"], "min_margin": dtw_res["min_margin"]},
        "diagnostics": {
            "knn":       knn_res,
            "dtw":       dtw_res,
            "split":     args.split,
            "prefilter": args.prefilter,
            "oov_clips": int(len(oov)),
        },
    }
    THRESHOLDS_JSON.parent.mkdir(parents=True, exist_ok=True)
    THRESHOLDS_JSON.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Saved → {THRESHOLDS_JSON}")


# ── Sweep ────────────────────────────────────────────────────────────────────
def run_sweep(X_all, y_all, classes, groups, n_folds=CV_FOLDS,
              windows=(6, 10, 15), ms=(5, 8), ks=(1, 3, 5)) -> None:
    folds = grouped_folds(y_all, groups, n_folds, RANDOM_SEED)
    hits = {(w, m, k): 0 for w in windows for m in ms for k in ks}
    warmup()
    for f in range(n_folds):
        print(f"\n[sweep] fold {f + 1}/{n_folds}")
        tr, va = np.where(folds != f)[0], np.where(folds == f)[0]
        knn = KNNRecognizer(content_only=True).fit(X_all[tr], y_all[tr])
        top, _ = knn.rank_classes(X_all[va], max(ms))
        Xt = X_all[tr][:, :, :DTW_N_CONTENT].astype(np.float32)
        Xv = X_all[va][:, :, :DTW_N_CONTENT].astype(np.float32)
        cls_idx = {int(c): np.where(y_all[tr] == c)[0] for c in np.unique(y_all[tr])}
        yv = y_all[va]
        for w in windows:
            for qi in range(len(va)):
                cands = [int(c) for c in top[qi]]
                idxs = [cls_idx[c] for c in cands]
                d = dtw_many(Xv[qi], Xt[np.concatenate(idxs)], w)
                parts, o = [], 0
                for ix in idxs:
                    parts.append(np.sort(d[o:o + len(ix)]))
                    o += len(ix)
                for m in ms:
                    for k in ks:
                        scores = [p[:min(k, len(p))].mean() for p in parts[:m]]
                        if cands[int(np.argmin(scores))] == yv[qi]:
                            hits[(w, m, k)] += 1
    n = len(y_all)
    table = sorted(({"window": w, "top_m": m, "top_k_avg": k, "accuracy": h / n}
                    for (w, m, k), h in hits.items()), key=lambda r: -r["accuracy"])
    print("\n" + "=" * 52 + f"\nSweep, {n_folds}-fold grouped CV (pooled accuracy)\n" + "-" * 52)
    for r in table:
        print(f"  window={r['window']:>2}  top_m={r['top_m']}  top_k_avg={r['top_k_avg']}  acc={r['accuracy']:.2%}")
    print("=" * 52)
    print("Pick the SIMPLEST setting within ~0.3% of the best (CV std is ~0.6%), then edit the constants in recognition.py.")
    _save_report("sweep", table)


# ── Self-test (replaces tests/) ──────────────────────────────────────────────
def dtw_distance_py(a, b, window=10):
    """Original pure-Python DTW; reference implementation for the self-test."""
    n, m = len(a), len(b)
    w = max(window, abs(n - m))
    dp = np.full((n + 1, m + 1), np.inf)
    dp[0, 0] = 0.0
    for i in range(1, n + 1):
        for j in range(max(1, i - w), min(m, i + w) + 1):
            cost = float(np.linalg.norm(a[i - 1] - b[j - 1]))
            dp[i, j] = cost + min(dp[i - 1, j], dp[i, j - 1], dp[i - 1, j - 1])
    return float(dp[n, m])


def test_dtw_matches_reference():
    rng = np.random.default_rng(0)
    warmup()
    for _ in range(10):
        a = rng.normal(size=(64, 95)).astype(np.float32)
        b = rng.normal(size=(64, 95)).astype(np.float32)
        ref, fast = dtw_distance_py(a, b, 10), dtw_distance(a, b, 10)
        assert np.isclose(ref, fast, rtol=1e-4), (ref, fast)


def test_dtw_many_matches_single():
    rng = np.random.default_rng(1)
    q = rng.normal(size=(64, 95)).astype(np.float32)
    refs = rng.normal(size=(7, 64, 95)).astype(np.float32)
    many = dtw_many(q, refs, 10)
    single = np.array([dtw_distance(q, r, 10) for r in refs])
    assert np.allclose(many, single, rtol=1e-5)


def test_knn_class_min_matches_bruteforce():
    rng = np.random.default_rng(2)
    X = rng.normal(size=(60, 64, 98)).astype(np.float32)
    y = rng.integers(0, 6, size=60)
    knn = KNNRecognizer(content_only=True).fit(X, y)
    Q = rng.normal(size=(5, 64, 98)).astype(np.float32)
    cls, dist = knn.rank_classes(Q, 6)
    D = knn.distances(Q)
    for i in range(5):
        for c, d in zip(cls[i], dist[i]):
            assert np.isclose(d, D[i][knn._y == c].min(), atol=1e-6)


def test_batch_equals_single_votes():
    rng = np.random.default_rng(3)
    X = rng.normal(size=(40, 64, 98)).astype(np.float32)
    y = rng.integers(0, 4, size=40)
    knn = KNNRecognizer().fit(X, y)
    Q = rng.normal(size=(6, 64, 98)).astype(np.float32)
    batch = knn.predict_proba(Q)
    for i in range(6):
        s = knn.predict_proba(Q[i:i + 1])[0]
        assert batch[i].keys() == s.keys()
        assert all(np.isclose(batch[i][c], s[c], rtol=1e-4, atol=1e-7) for c in s)


def test_knn_top5_true_class_minimum():
    rng = np.random.default_rng(4)
    X = rng.normal(size=(100, 64, 98)).astype(np.float32)
    y = (np.arange(100) % 10).astype(np.int32)
    knn = KNNRecognizer(content_only=False).fit(X, y)
    Q = rng.normal(size=(3, 64, 98)).astype(np.float32)
    cls, dist = knn.rank_classes(Q, 5)
    for i in range(3):
        assert len(set(cls[i])) == 5, "Top-5 must be 5 distinct classes"
        assert np.all(np.diff(dist[i]) >= -1e-9), "Distances must be non-decreasing"


def run_selftest() -> None:
    tests = [
        test_dtw_matches_reference,
        test_dtw_many_matches_single,
        test_knn_class_min_matches_bruteforce,
        test_batch_equals_single_votes,
        test_knn_top5_true_class_minimum,
    ]
    ok = True
    for t in tests:
        try:
            t()
            print(f"PASS  {t.__name__}")
        except Exception as e:
            ok = False
            print(f"FAIL  {t.__name__}: {e!r}")
    print("ALL PASS" if ok else "SOME FAILED")
    sys.exit(0 if ok else 1)


# ── Cross-Validation Helper ───────────────────────────────────────────────────
def run_cv(X_all, y_all, classes, groups, n_folds, args):
    folds = grouped_folds(y_all, groups, n_folds, RANDOM_SEED)
    rows = {"knn": [], "dtw": []}
    for f in range(n_folds):
        print(f"\n════ Fold {f + 1}/{n_folds} ════")
        tr = np.where(folds != f)[0]
        va = np.where(folds == f)[0]
        rows["knn"].append(evaluate_knn(X_all[tr], y_all[tr], X_all[va], y_all[va], classes))
        if not args.skip_dtw:
            rows["dtw"].append(
                evaluate_two_stage_dtw(X_all[tr], y_all[tr], X_all[va], y_all[va],
                                       classes, args.workers, prefilter=args.prefilter)
            )

    summary = {}
    print("\n" + "=" * 70 + f"\n{n_folds}-fold grouped CV (mean ± std)\n" + "-" * 70)
    for name, rs in rows.items():
        if not rs:
            continue
        s = {m: (float(np.mean([r[m] for r in rs])), float(np.std([r[m] for r in rs])))
             for m in ("accuracy_overall", "stage1_top5_recall", "macro_f1")}
        summary[name] = s
        print(f"{name.upper():4s} acc {s['accuracy_overall'][0]:.3%} ± {s['accuracy_overall'][1]:.3%} | "
              f"top5 {s['stage1_top5_recall'][0]:.3%} ± {s['stage1_top5_recall'][1]:.3%} | "
              f"F1 {s['macro_f1'][0]:.4f} ± {s['macro_f1'][1]:.4f}")

    _save_report("cv", {"prefilter": args.prefilter, "folds": rows, "summary": summary})


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(
        description="Non-DL sign recognition: evaluate, cross-validate, sweep, calibrate, self-test.")
    ap.add_argument("--workers", type=int, default=12)
    ap.add_argument("--eval-samples", type=int, default=0, help="0 = all validation samples")
    ap.add_argument("--split", choices=("random", "grouped"), default="grouped")
    ap.add_argument("--group-eps", type=float, default=GROUP_EPS)
    ap.add_argument("--prefilter", choices=("medoid", "knn"), default="knn")
    ap.add_argument("--cv", type=int, default=0, help="N-fold grouped CV (0 = off)")
    ap.add_argument("--sweep", action="store_true", help="grid-search DTW window/top_m/top_k_avg with grouped CV")
    ap.add_argument("--calibrate", action="store_true", help="write reports/rejection_thresholds.json")
    ap.add_argument("--selftest", action="store_true", help="run built-in equivalence tests")
    ap.add_argument("--leakage-check", action="store_true")
    ap.add_argument("--knn-full", action="store_true", help="also run KNN on all 98 features (ablation)")
    ap.add_argument("--skip-dtw", action="store_true")
    args = ap.parse_args()

    if args.selftest:
        return run_selftest()
    if args.calibrate:
        return run_calibration(args)

    classes = json.loads(CLASSES_JSON.read_text(encoding="utf-8"))
    print("=" * 85 + "\nNon-DL Sign Recognition: Unified Evaluation\n" + "=" * 85)
    print(f"Classes: {len(classes)} | Split: {args.split} | Prefilter: {args.prefilter} | Workers: {args.workers}")
    X_all, y_all = load_dataset(FEATURES_DIR, classes)

    groups = None
    if args.cv or args.sweep or args.split == "grouped":
        groups = build_groups(X_all, y_all, args.group_eps)
    if args.cv:
        return run_cv(X_all, y_all, classes, groups, args.cv, args)
    if args.sweep:
        return run_sweep(X_all, y_all, classes, groups)

    if args.split == "grouped":
        tr, va = grouped_split(y_all, groups, VAL_FRACTION, RANDOM_SEED)
        X_train, y_train, X_val, y_val = X_all[tr], y_all[tr], X_all[va], y_all[va]
    else:
        X_train, y_train, X_val, y_val = train_val_split(X_all, y_all, classes, VAL_FRACTION, RANDOM_SEED)
    if args.eval_samples and 0 < args.eval_samples < len(X_val):
        X_val, y_val = X_val[:args.eval_samples], y_val[:args.eval_samples]
    print(f"Train {len(X_train)} | Val {len(X_val)}")

    if args.leakage_check:
        _save_report(f"leakage_{args.split}", leakage_report(X_train, y_train, X_val, y_val))

    reports = [evaluate_knn(X_train, y_train, X_val, y_val, classes, content_only=True)]
    if args.knn_full:
        reports.append(evaluate_knn(X_train, y_train, X_val, y_val, classes, content_only=False))
    if not args.skip_dtw:
        reports.append(evaluate_two_stage_dtw(X_train, y_train, X_val, y_val, classes,
                                              args.workers, prefilter=args.prefilter))

    print("\n" + "=" * 112)
    print(f"{'Algorithm':<52} {'Top-5':>8} {'Acc':>8} {'F1':>8} {'Comps':>7} {'ms/q (single)':>14}")
    print("-" * 112)
    for r in reports:
        print(f"{r['algorithm']:<52} {r['stage1_top5_recall']:>8.1%} {r['accuracy_overall']:>8.1%} "
              f"{r['macro_f1']:>8.4f} {r['comparisons_per_query']:>7,d} {r['ms_per_query']:>14.2f}")
    print("=" * 112)
    _save_report(f"split_{args.split}", reports)


if __name__ == "__main__":
    main()
