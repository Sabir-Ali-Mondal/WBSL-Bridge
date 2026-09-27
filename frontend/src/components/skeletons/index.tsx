import React from "react";

export function SignCardSkeleton() {
  return (
    <div className="border border-border bg-surface p-4 rounded-md animate-pulse">
      <div className="h-5 bg-surface-elevated rounded w-1/3 mb-2" />
      <div className="h-4 bg-surface-elevated rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="h-3 bg-surface-elevated rounded w-1/4" />
        <div className="h-3 bg-surface-elevated rounded w-1/5" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="border border-border bg-surface p-5 rounded-md animate-pulse">
      <div className="h-3 bg-surface-elevated rounded w-1/3 mb-3" />
      <div className="h-8 bg-surface-elevated rounded w-1/2 mb-2" />
      <div className="h-3 bg-surface-elevated rounded w-2/3" />
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="border border-border bg-surface p-4 rounded-md animate-pulse flex items-center justify-between">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-surface-elevated" />
          <div className="h-3 bg-surface-elevated rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function EvidenceSkeleton() {
  return (
    <div className="border border-border bg-surface p-6 rounded-md animate-pulse space-y-4">
      <div className="h-5 bg-surface-elevated rounded w-1/4" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-surface-elevated rounded" />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-surface-elevated rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function CameraSkeleton() {
  return (
    <div className="w-full aspect-video bg-surface border border-border rounded-md flex flex-col items-center justify-center animate-pulse">
      <div className="w-12 h-12 rounded-full bg-surface-elevated mb-3" />
      <div className="h-4 bg-surface-elevated rounded w-48" />
    </div>
  );
}
