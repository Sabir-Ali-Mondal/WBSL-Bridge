"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Database, BookOpen, ArrowUpRight } from "lucide-react";
import { statsService, AdminStats } from "@/services/stats";

export default function AdminDashboardPage() {
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => statsService.getAdminStats(),
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">ADMINISTRATION CONSOLE</div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
            System Overview & Verification Status
          </h1>
        </div>
        <div className={`text-xs font-mono px-3 py-1.5 rounded ${stats?.llm_available ? "text-status-approved bg-status-approved/10 border border-status-approved/30" : "text-status-pending bg-status-pending/10 border border-status-pending/30"}`}>
          LLM: {stats?.llm_available ? "ONLINE" : "OFFLINE"} · {stats?.inference_mode?.toUpperCase() ?? "—"}
        </div>
      </div>

      {/* Metric Cards — fetched from backend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Total Signs</div>
          <div className="text-2xl font-bold text-text-primary">{stats?.total_signs ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">Classes in model: {stats?.model_classes ?? "—"}</div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Approved Samples</div>
          <div className="text-2xl font-bold text-accent-primary">{stats?.total_approved_samples ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">Dataset: {stats?.dataset_version ?? "—"}</div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">Active Model</div>
          <div className="text-lg font-bold text-text-primary truncate">{stats?.model_active ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">
            {stats?.contract?.feature_width ?? 126}-dim {stats?.contract?.kind ?? "model"} · {stats?.model_classes ?? "—"} classes
          </div>
        </div>
        <div className="p-5 rounded-lg bg-surface border border-border space-y-2">
          <div className="text-xs font-mono uppercase text-text-muted">LLM Engine</div>
          <div className="text-lg font-bold text-text-primary truncate">{stats?.llm_model ?? "—"}</div>
          <div className="text-[11px] font-mono text-text-secondary">{stats?.inference_mode?.toUpperCase() ?? "—"}</div>
        </div>
      </div>

      {/* Quick Launch Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/contributions"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-primary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-primary/10 text-accent-primary flex items-center justify-center mb-3">
              <CheckSquare size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Contribution Verification</h3>
            <p className="text-xs text-text-secondary mt-1">
              Inspect coordinate trajectories, validation scores, and reviewer reasoning layers.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-primary font-bold">
            <span>Review Queue</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/dataset"
          className="p-6 rounded-lg bg-surface border border-border hover:border-accent-secondary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-accent-secondary/10 text-accent-secondary flex items-center justify-center mb-3">
              <Database size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Dataset Explorer</h3>
            <p className="text-xs text-text-secondary mt-1">
              Browse the sign lexicon, filter by category and dialect, and inspect per-sign sample counts.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-accent-secondary font-bold">
            <span>Open Explorer</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/signs"
          className="p-6 rounded-lg bg-surface border border-border hover:border-text-primary transition-all flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-10 h-10 rounded bg-surface-elevated text-text-primary flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <h3 className="font-semibold text-text-primary">Signs & Reference Media</h3>
            <p className="text-xs text-text-secondary mt-1">
              Attach or replace the reference video and image for each catalog sign.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono text-text-primary font-bold">
            <span>Manage Media</span>
            <ArrowUpRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
}
