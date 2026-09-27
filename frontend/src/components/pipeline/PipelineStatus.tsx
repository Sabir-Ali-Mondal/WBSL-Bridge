"use client";
import React from "react";
import { CircleCheck, Clock3, CircleX, PauseCircle, HelpCircle } from "lucide-react";
import { PipelineStage, PipelineStatus as StatusType } from "@/lib/types";
import { PIPELINE_STAGES } from "@/lib/constants";

interface PipelineStatusProps {
  stages: Record<PipelineStage, StatusType>;
  fps?: number;
}

export function PipelineStatus({ stages, fps = 0 }: PipelineStatusProps) {
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "active":
        return {
          icon: <CircleCheck size={14} className="text-status-approved" />,
          label: "ACTIVE",
          color: "text-status-approved",
        };
      case "waiting":
        return {
          icon: <Clock3 size={14} className="text-status-pending" />,
          label: "WAITING",
          color: "text-status-pending",
        };
      case "error":
        return {
          icon: <CircleX size={14} className="text-status-error" />,
          label: "ERROR",
          color: "text-status-error",
        };
      case "idle":
      default:
        return {
          icon: <PauseCircle size={14} className="text-text-muted" />,
          label: "IDLE",
          color: "text-text-muted",
        };
    }
  };

  return (
    <div className="w-full bg-surface border border-border p-4 rounded-md">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50 text-xs font-mono">
        <span className="text-text-secondary uppercase tracking-wider">
          LIVE AI PIPELINE FLOW
        </span>
        <span className="text-accent-primary">
          STREAM RATE: <strong className="text-text-primary">{fps} FPS</strong>
        </span>
      </div>

      {/* Connected Technical Diagram per Section 8.4 */}
      <div className="relative flex items-center justify-between">
        {/* Horizontal Connecting Line */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-border -translate-y-1/2 z-0" />

        {PIPELINE_STAGES.map((stage) => {
          const status = stages[stage.id as PipelineStage] || "idle";
          const badge = getStatusBadge(status);

          return (
            <div
              key={stage.id}
              className="relative z-10 flex flex-col items-center bg-surface px-3 py-1"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                  status === "active"
                    ? "border-accent-primary bg-accent-primary/10 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                    : status === "waiting"
                    ? "border-status-pending bg-status-pending/10"
                    : "border-border bg-surface-elevated"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === "active"
                      ? "bg-accent-primary"
                      : status === "waiting"
                      ? "bg-status-pending"
                      : "bg-text-muted"
                  }`}
                />
              </div>

              <div className="mt-2 text-xs font-mono font-semibold text-text-primary">
                {stage.label}
              </div>

              <div className={`flex items-center space-x-1 mt-1 text-[11px] font-mono ${badge.color}`}>
                {badge.icon}
                <span>{badge.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
