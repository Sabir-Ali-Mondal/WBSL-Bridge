"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_BASE = "http://localhost:8200";

/**
 * Every row here is read from /api/system/health rather than written by hand.
 *
 * The previous version printed a literal "sign_mlp.onnx (35 classes)" while the
 * server was in fact serving whichever run won the registry scan -- a settings
 * page that lies about the active model is worse than no settings page.
 */
export default function AdminSettingsPage() {
  const { data: health } = useQuery({
    queryKey: ["health"],
    queryFn: async () => (await axios.get(`${API_BASE}/api/system/health`)).data,
    refetchInterval: 15000,
  });

  const rows: [string, string][] = [
    ["API PORT", "8200"],
    ["ACTIVE MODEL", `${health?.active_model ?? "—"} (${health?.model_run ?? "—"})`],
    ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? "—"}-dim · ${health?.contract?.frames ?? 1} frames`],
    ["CLASSES", String(health?.active_classes ?? 0)],
    ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
    ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
    ["REFERENCE COVERAGE", `${health?.reference_coverage?.with_media ?? 0}/${health?.reference_coverage?.total_classes ?? 0}`],
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">SYSTEM SETTINGS</div>
      <h1 className="text-2xl font-bold text-text-primary">System Settings</h1>

      {health?.model_error && (
        <div className="p-3 rounded-lg border border-status-error/40 bg-status-error/10 text-[10px] font-mono text-status-error">
          {health.model_error}
        </div>
      )}

      <div className="p-6 bg-surface border border-border rounded-lg space-y-3 font-mono text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
            <span className="text-text-muted">{k}</span>
            <span className="text-text-primary text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}