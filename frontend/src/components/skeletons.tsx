import React from "react";

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-3 rounded bg-surface-elevated" />
        </td>
      ))}
    </tr>
  );
}

export function SignCardSkeleton() {
  return (
    <div className="bg-surface border border-border p-4 rounded-md space-y-3 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-4 w-20 rounded bg-surface-elevated" />
        <div className="h-3 w-10 rounded bg-surface-elevated" />
      </div>
      <div className="h-4 w-24 rounded bg-surface-elevated" />
      <div className="pt-2 border-t border-border flex justify-between">
        <div className="h-3 w-16 rounded bg-surface-elevated" />
        <div className="h-3 w-10 rounded bg-surface-elevated" />
      </div>
    </div>
  );
}