"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Cpu, RefreshCw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const API_BASE = "http://localhost:8000";

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

/** A static model is only servable when it takes the 126-landmark frame vector. */
const canActivate = (m: ModelEntry) => m.temporal || m.input_width === 126;

export default function AdminModelsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-models"],
    queryFn: async () =>
      (await axios.get<RegistryResponse>(`${API_BASE}/api/admin/models`)).data,
    refetchInterval: 15000,
  });

  const rescan = useMutation({
    mutationFn: async () =>
      (await axios.post(`${API_BASE}/api/admin/models/rescan`)).data,
    onSuccess: () => {
      toast.success("Model folder re-scanned and reloaded");
      qc.invalidateQueries({ queryKey: ["admin-models"] });
      qc.invalidateQueries({ queryKey: ["admin-signs"] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.detail || "Rescan failed"),
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
    onError: (e: any) => toast.error(e?.response?.data?.detail || "Activation failed"),
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
                    {m.temporal ? "LSTM temporal" : `MLP static · input ${m.input_width ?? "?"}`}
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
                    title="This graph does not accept the 126-landmark frame vector"
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
    </div>
  );
}