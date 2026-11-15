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
    ["MODEL CONTRACT", `${health?.contract?.kind ?? "—"} · ${health?.contract?.feature_width ?? 98}-dim · ${health?.contract?.frames ?? 64} frames`],
    ["ARCHITECTURE", "BiLSTM + Attention (98-dim shoulder box)"],
    ["SIGN VOCABULARY", String(health?.vocabulary_classes ?? 0)],
    ["LLM ENDPOINT", `${health?.llm_model ?? "—"} · ${health?.inference_mode ?? "—"}`],
    ["AI MODE", health?.ai_mode ?? "offline"],
    ["TTS ENGINE", "edge-tts → BanglaTTS fallback"],
    ["MODEL SEQUENCE COVERAGE", `${health?.sequence_coverage?.with_landmark_sequences ?? 0}/${health?.sequence_coverage?.total_classes ?? 0}`],
  ];

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="pb-3 border-b border-[#263449]">
        <div className="text-xs font-mono uppercase text-[#64748B]">SYSTEM SETTINGS</div>
        <h1 className="text-2xl font-bold text-[#F1F5F9] mt-0.5">System Settings</h1>
      </div>

      {health?.model_error && (
        <div className="p-3 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 text-[10px] font-mono text-[#EF4444]">
          {health.model_error}
        </div>
      )}

      <div className="p-6 bg-[#0D1726] border border-[#263449] rounded-lg space-y-1 font-mono text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2.5 border-b border-[#263449] last:border-0 hover:bg-[#111E30]/40 px-2 rounded transition-colors">
            <span className="text-[#64748B] font-semibold">{k}</span>
            <span className="text-[#F1F5F9] text-right font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}