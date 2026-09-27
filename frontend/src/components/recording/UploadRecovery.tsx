"use client";
import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface UploadRecoveryProps {
  onRetry: () => void;
  pendingCount?: number;
}

export function UploadRecovery({ onRetry, pendingCount = 1 }: UploadRecoveryProps) {
  return (
    <div className="bg-surface border border-status-error/40 p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded bg-status-error/10 text-status-error">
          <AlertTriangle size={20} />
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-status-error uppercase tracking-wider">
            UPLOAD INTERRUPTED
          </div>
          <div className="text-xs text-text-secondary mt-0.5">
            Your recording ({pendingCount} pending sample) is safely cached in browser memory. Network connection failed.
          </div>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center space-x-1.5 px-4 py-2 rounded bg-surface-elevated hover:bg-surface border border-border text-xs font-mono uppercase text-text-primary transition-colors shrink-0"
      >
        <RotateCw size={14} className="text-accent-primary" />
        <span>Retry Upload</span>
      </button>
    </div>
  );
}
