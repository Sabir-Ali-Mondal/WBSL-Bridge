"use client";
import React from "react";
import { useSystemStatus } from "@/hooks/useSystemStatus";

export function SystemDiagnostics() {
  const { health } = useSystemStatus();

  return (
    <div className="flex items-center space-x-3 px-3 py-1.5 bg-surface border border-border rounded-md tech-mono text-xs text-text-secondary select-none">
      <div className="flex items-center space-x-2">
        <span className="flex items-center space-x-1">
          <span>API</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.api ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>MODEL</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.model ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>TTS</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.tts ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
        <span className="flex items-center space-x-1">
          <span>LLM</span>
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              health.llm ? "bg-status-approved" : "bg-status-error"
            }`}
          />
        </span>
      </div>

      <div className="h-3 w-[1px] bg-border hidden sm:block" />

      <div className="hidden md:flex items-center space-x-2 text-[11px]">
        <span className="text-text-muted">MODE:</span>
        <span className="text-text-primary uppercase">{health.inference_mode}</span>
      </div>

      <div className="h-3 w-[1px] bg-border hidden lg:block" />

      <div className="hidden lg:flex items-center space-x-2 text-[11px] text-text-muted">
        <span>DATASET: <strong className="text-text-secondary">{health.dataset_version}</strong></span>
        <span>•</span>
        <span>MODEL: <strong className="text-text-secondary">{health.model_version}</strong></span>
      </div>
    </div>
  );
}
