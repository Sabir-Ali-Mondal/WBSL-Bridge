"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Database, ArrowUpRight } from "lucide-react";
import { statsService, AdminStats } from "@/services/stats";

export default function AdminDashboardPage() {
  const { data: stats, isError: statsError } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => statsService.getAdminStats(),
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center pb-4 border-b border-[#263449]">
        <div>
          <div className="text-xs font-mono uppercase text-[#64748B]">ADMINISTRATION CONSOLE</div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] mt-1">
            System Overview & Verification Status
          </h1>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded-md border ${
          stats?.llm_available 
            ? "text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30" 
            : "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30"
        }`}>
          LLM: {stats?.llm_available ? "ONLINE" : "OFFLINE"} · {stats?.inference_mode?.toUpperCase() ?? "—"}
        </div>
      </div>

      {statsError && (
        <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-3 text-sm text-[#EF4444]">
          Could not load admin statistics. Check that the backend is running at the configured API URL.
        </div>
      )}

      {/* Metric Cards — fetched from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#0D1726] border border-[#263449] space-y-2 transition-colors hover:border-[#334460]">
          <div className="text-xs font-mono uppercase text-[#64748B]">Total Signs</div>
          <div className="text-2xl font-bold text-[#F1F5F9]">{stats?.total_signs ?? "—"}</div>
          <div className="text-[11px] font-mono text-[#94A3B8]">Classes in model: {stats?.model_classes ?? "—"}</div>
        </div>
        <div className="p-5 rounded-lg bg-[#0D1726] border border-[#263449] space-y-2 transition-colors hover:border-[#334460]">
          <div className="text-xs font-mono uppercase text-[#64748B]">Signs With Avatar Data</div>
          <div className="text-2xl font-bold text-[#34D399]">{stats?.avatar_classes ?? "—"}</div>
          <div className="text-[11px] font-mono text-[#94A3B8]">Replay assets bundled with active model</div>
        </div>
        <div className="p-5 rounded-lg bg-[#0D1726] border border-[#263449] space-y-2 transition-colors hover:border-[#334460]">
          <div className="text-xs font-mono uppercase text-[#64748B]">Active Model</div>
          <div className="text-lg font-bold text-[#F1F5F9] truncate">{stats?.model_active ?? "—"}</div>
          <div className="text-[11px] font-mono text-[#94A3B8]">
            {stats?.contract?.feature_width ?? 98}-dim · {stats?.contract?.frames ?? 64} frames · {stats?.model_classes ?? "—"} classes
          </div>
        </div>
        <div className="p-5 rounded-lg bg-[#0D1726] border border-[#263449] space-y-2 transition-colors hover:border-[#334460]">
          <div className="text-xs font-mono uppercase text-[#64748B]">LLM Engine</div>
          <div className="text-lg font-bold text-[#F1F5F9] truncate">{stats?.llm_model ?? "—"}</div>
          <div className="text-[11px] font-mono text-[#94A3B8]">{stats?.inference_mode?.toUpperCase() ?? "—"}</div>
        </div>
      </div>

      {/* Quick Launch Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          aria-disabled="true"
          className="p-6 rounded-lg bg-[#0D1726] border border-[#263449] opacity-50 cursor-not-allowed flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#111E30] text-[#64748B] flex items-center justify-center mb-3 border border-[#263449]">
              <CheckSquare size={20} />
            </div>
            <h3 className="font-semibold text-[#F1F5F9]">Contribution Verification</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Planned future feature. Not currently active.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-[#64748B]">
            <span>Coming Soon</span>
          </div>
        </div>

        <Link
          href="/admin/training-data"
          className="group p-6 rounded-lg bg-[#0D1726] border border-[#263449] hover:border-[#22D3EE]/50 hover:bg-[#111E30] transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center mb-3 border border-[#22D3EE]/20 group-hover:border-[#22D3EE]/40 transition-colors">
              <Database size={20} />
            </div>
            <h3 className="font-semibold text-[#F1F5F9] group-hover:text-white transition-colors">Training Data Verification</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Review archived model clips, skeleton sequences, and recognition results.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-[#22D3EE] font-bold">
            <span>Open Training Data</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
