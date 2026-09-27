import React from "react";
export default function AdminDatasetPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">DATASET MANAGEMENT</div>
      <h1 className="text-2xl font-bold text-text-primary">Dataset Management</h1>
      <div className="p-8 bg-surface border border-border rounded-lg text-center text-xs font-mono text-text-muted">
        Dataset versioning, manifest indexing, and signer-disjoint split management
        will be available here after community data collection begins.
      </div>
    </div>
  );
}