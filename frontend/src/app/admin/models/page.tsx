"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Cpu, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8200";

type ModelEntry = {
  run: string;
  name: string;
  label: string;
  path: string;
  classes: number;
  temporal: boolean;
  input_width: number | null;
  size_mb: number;
  mtime: number;
  duration_s: number;
  active: boolean;
};

type RegistryResponse = {
  models: ModelEntry[];
  active: ModelEntry | null;
  active_path: string | null;
  scan_dir: string;
  error: string | null;
};

type ModelReport = {
  best_epoch?: number;
  best_val_acc?: number;
  best_val_loss?: number;
  val_top3_acc?: number;
  training_seconds?: number;
  macro_avg?: { precision?: number; recall?: number; f1?: number };
  per_class?: Record<string, {
    precision?: number;
    recall?: number;
    f1?: number;
    support?: number;
  }>;
  data?: { classes?: number; train_videos?: number; val_videos?: number };
};

type ConfusionReport = {
  classes?: string[];
  matrix?: number[][];
  rows?: string;
  columns?: string;
};

const SERVABLE_WIDTHS = [98];

const mutationErrorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ detail?: string }>(error)
    ? error.response?.data?.detail || fallback
    : fallback;

/** A model is servable when the backend has an extractor for its input width. */
const canActivate = (m: ModelEntry) =>
  m.input_width !== null && SERVABLE_WIDTHS.includes(m.input_width);

/** Human name for the extractor an input width selects. */
const featureLabel = (m: ModelEntry) => {
  if (m.temporal) return "BiLSTM temporal \u00b7 98-dim shoulder box";
  return `input ${m.input_width ?? "?"}-dim`;
};

export default function AdminModelsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () =>
      (await axios.get<RegistryResponse>(`${API_BASE}/api/admin/models`)).data,
    refetchInterval: 15000,
  });

  const { data: report } = useQuery({
    queryKey: ["active-model-report", data?.active_path],
    queryFn: async () =>
      (await axios.get<ModelReport>(`${API_BASE}/api/admin/model/report`)).data,
    enabled: Boolean(data?.active_path),
  });

  const { data: confusion } = useQuery({
    queryKey: ["active-model-confusion", data?.active_path],
    queryFn: async () =>
      (await axios.get<ConfusionReport>(`${API_BASE}/api/admin/model/confusion`)).data,
    enabled: Boolean(data?.active_path),
  });

  const rescan = useMutation({
    mutationFn: async () =>
      (await axios.post(`${API_BASE}/api/admin/models/rescan`)).data,
    onSuccess: () => {
      toast.success("Model folder re-scanned and reloaded");
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
    },
    onError: (error: unknown) => toast.error(mutationErrorMessage(error, "Rescan failed")),
  });

  const activate = useMutation({
    mutationFn: async (path: string) =>
      (await axios.post(`${API_BASE}/api/admin/models/activate`, { path })).data,
    onSuccess: (res) => {
      toast.success(
        `Serving ${res.active?.name ?? "model"} (${res.active?.classes ?? 0} classes)`
      );
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
      qc.invalidateQueries({ queryKey: ["health"] });
    },
    onError: (error: unknown) => toast.error(mutationErrorMessage(error, "Activation failed")),
  });

  const models = data?.models ?? [];
  const busy = rescan.isPending || activate.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">MODEL REGISTRY</div>
          <h1 className="text-2xl font-bold text-text-primary">Models Registry</h1>
          <p className="text-xs text-text-secondary mt-1 font-mono">
            Auto-discovered from{" "}
            <span className="text-text-primary">
              {data?.scan_dir ?? "models/onnx_models"}
            </span>{" "}
            · newest run wins on startup
          </p>
        </div>
        <button
          onClick={() => rescan.mutate()}
          disabled={busy}
          className="flex items-center gap-2 px-3 py-2 rounded border border-border bg-surface-elevated text-xs font-mono text-text-primary hover:border-accent-primary disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rescan.isPending ? "animate-spin" : ""}`} />
          RESCAN
        </button>
      </div>

      <div className="p-6 bg-surface border border-border rounded-lg space-y-3">
        {isLoading && (
          <div className="text-xs font-mono text-text-muted">Scanning model folder…</div>
        )}

        {!isLoading && data?.error && (
          <div className="p-4 rounded bg-status-rejected/10 border border-status-rejected/40 text-xs font-mono text-status-rejected">
            {data.error}
          </div>
        )}

        {!isLoading && models.length === 0 && !data?.error && (
          <div className="p-4 rounded bg-surface-elevated border border-border text-xs font-mono text-text-muted">
            No models found — train one from the Training Console.
          </div>
        )}

        {models.map((m) => {
          const servable = canActivate(m);
          return (
            <div
              key={m.path}
              className={`flex items-center justify-between gap-4 p-4 rounded bg-surface-elevated border ${
                m.active ? "border-accent-primary/60" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <Cpu
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    m.active ? "text-accent-primary" : "text-text-muted"
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-sm font-mono font-bold text-text-primary truncate">
                    {m.name}.onnx
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {featureLabel(m)}
                    {" · "}
                    {m.classes} classes · {m.size_mb} MB · {m.run}
                  </div>
                  <div className="text-[10px] text-text-muted font-mono truncate">
                    {m.path}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!servable && (
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-pending/20 text-status-pending"
                    title="The backend requires a temporal model with 64 frames of 98-dim shoulder-box features."
                  >
                    INCOMPATIBLE
                  </span>
                )}
                {m.active ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-status-approved/20 text-status-approved">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </span>
                ) : (
                  <button
                    onClick={() => activate.mutate(m.path)}
                    disabled={busy || !servable}
                    className="px-3 py-1.5 rounded text-[10px] font-mono border border-border text-text-primary hover:border-accent-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {activate.isPending && activate.variables === m.path
                      ? "LOADING…"
                      : "SET ACTIVE"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {data?.active && (
        <div className="text-xs font-mono text-text-muted">
          Serving now: <span className="text-text-primary">{data.active.name}</span> (
          {data.active.classes} classes, {data.active.temporal ? "temporal" : "static"})
        </div>
      )}

      <section className="space-y-3 rounded-lg border border-border bg-surface p-5">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">ACTIVE MODEL REPORT</div>
          <h2 className="mt-1 text-lg font-bold text-text-primary">
            Validation &amp; Confusion Matrix
          </h2>
        </div>

        {report?.best_val_acc === undefined ? (
          <p className="text-xs font-mono text-text-muted">
            No training report is available for the active model bundle.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["Validation accuracy", report.best_val_acc],
                ["Top-3 accuracy", report.val_top3_acc],
                ["Macro F1", report.macro_avg?.f1],
                ["Validation loss", report.best_val_loss],
              ].map(([label, value]) => (
                <div key={label} className="rounded border border-border bg-surface-elevated p-3">
                  <div className="text-[9px] font-mono uppercase text-text-muted">{label}</div>
                  <div className="mt-1 text-lg font-bold text-text-primary">
                    {typeof value === "number" ? `${(value * (label === "Validation loss" ? 1 : 100)).toFixed(1)}${label === "Validation loss" ? "" : "%"}` : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] font-mono text-text-muted">
              Epoch {report.best_epoch ?? "—"} · {report.data?.train_videos ?? "—"} training clips ·{" "}
              {report.data?.val_videos ?? "—"} validation clips · {report.training_seconds ?? "—"} s
            </div>

            {report.per_class && (
              <details className="rounded border border-border">
                <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono text-text-secondary">
                  Per-class precision, recall &amp; F1 ({Object.keys(report.per_class).length} classes)
                </summary>
                <div className="max-h-80 overflow-auto">
                  <table className="w-full text-left text-[10px] font-mono">
                    <thead className="sticky top-0 bg-surface-elevated text-text-muted">
                      <tr>
                        <th className="px-3 py-2">Gloss</th>
                        <th className="px-3 py-2">Precision</th>
                        <th className="px-3 py-2">Recall</th>
                        <th className="px-3 py-2">F1</th>
                        <th className="px-3 py-2">Support</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Object.entries(report.per_class).map(([gloss, metrics]) => (
                        <tr key={gloss}>
                          <td className="px-3 py-1.5 font-bold text-text-primary">{gloss}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.precision?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.recall?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.f1?.toFixed(3) ?? "—"}</td>
                          <td className="px-3 py-1.5 text-text-secondary">{metrics.support ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {confusion?.classes?.length && confusion.matrix?.length ? (
              <details className="rounded border border-border">
                <summary className="cursor-pointer px-3 py-2 text-[10px] font-mono text-text-secondary">
                  Confusion matrix · actual rows × predicted columns
                </summary>
                <div className="max-h-[440px] overflow-auto">
                  <table className="min-w-max border-collapse text-[9px] font-mono">
                    <thead className="sticky top-0 z-10 bg-surface-elevated text-text-muted">
                      <tr>
                        <th className="sticky left-0 z-20 border border-border bg-surface-elevated px-2 py-1">Actual</th>
                        {confusion.classes.map((gloss) => (
                          <th key={gloss} className="border border-border px-2 py-1" title={gloss}>
                            {gloss}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {confusion.matrix.map((row, rowIndex) => (
                        <tr key={confusion.classes?.[rowIndex] ?? rowIndex}>
                          <th className="sticky left-0 border border-border bg-surface-elevated px-2 py-1 text-left text-text-primary">
                            {confusion.classes?.[rowIndex] ?? rowIndex}
                          </th>
                          {row.map((count, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="border border-border px-2 py-1 text-center text-text-secondary"
                              style={{
                                backgroundColor: count
                                  ? `rgba(94, 234, 212, ${Math.min(0.7, 0.12 + count / Math.max(1, ...row) * 0.55)})`
                                  : undefined,
                              }}
                              title={`${confusion.classes?.[rowIndex]} → ${confusion.classes?.[columnIndex]}: ${count}`}
                            >
                              {count}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ) : (
              <p className="text-[10px] font-mono text-text-muted">
                No confusion matrix is available for the active model bundle.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}