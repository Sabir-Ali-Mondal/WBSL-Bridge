import React from "react";
export default function AdminModelsPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">MODEL REGISTRY</div>
      <h1 className="text-2xl font-bold text-text-primary">Models Registry</h1>
      <div className="p-6 bg-surface border border-border rounded-lg space-y-3">
        <div className="flex items-center justify-between p-4 rounded bg-surface-elevated border border-accent-primary/30">
          <div>
            <div className="text-sm font-mono font-bold text-text-primary">sign_mlp.onnx</div>
            <div className="text-xs text-text-muted">MLP 126→256→128→35 · 99.9% val accuracy</div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-approved/20 text-status-approved">ACTIVE</span>
        </div>
        <div className="flex items-center justify-between p-4 rounded bg-surface-elevated border border-border opacity-60">
          <div>
            <div className="text-sm font-mono font-bold text-text-primary">LSTM (temporal)</div>
            <div className="text-xs text-text-muted">Pending — requires community sequence data</div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-status-pending/20 text-status-pending">PLANNED</span>
        </div>
      </div>
    </div>
  );
}