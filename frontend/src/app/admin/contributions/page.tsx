"use client";

import React from "react";

export default function AdminContributionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">PLANNED FEATURE</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Community Contributions
        </h1>
      </div>
      <div className="p-8 bg-surface border border-border rounded-lg text-center space-y-3">
        <div className="text-4xl">🚧</div>
        <h2 className="text-lg font-semibold text-text-primary">Coming Soon</h2>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Community contribution functionality is planned for a future release.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded bg-surface-elevated border border-border text-text-muted text-xs font-mono cursor-not-allowed opacity-50"
        >
          Contributions (Unavailable)
        </button>
      </div>
    </div>
  );
}
