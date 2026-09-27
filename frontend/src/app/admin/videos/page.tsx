import React from "react";
export default function AdminVideosPage() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono uppercase text-text-muted">VIDEO INSPECTOR</div>
      <h1 className="text-2xl font-bold text-text-primary">Reference Video Review</h1>
      <div className="p-8 bg-surface border border-border rounded-lg text-center text-xs font-mono text-text-muted">
        Video comparison and reference selection will be available here
        once community contributors submit sign recordings.
      </div>
    </div>
  );
}