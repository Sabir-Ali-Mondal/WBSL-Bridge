"use client";

import React from "react";

export default function AdminContributionsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-[#263449]">
        <div className="text-xs font-mono uppercase text-[#64748B]">PLANNED FEATURE</div>
        <h1 className="text-2xl font-bold tracking-tight text-[#F1F5F9] mt-1">
          Community Contributions
        </h1>
      </div>
      <div className="p-8 bg-[#0D1726] border border-[#263449] rounded-lg text-center space-y-3">
        <div className="text-4xl">🚧</div>
        <h2 className="text-lg font-semibold text-[#F1F5F9]">Coming Soon</h2>
        <p className="text-sm text-[#94A3B8] max-w-md mx-auto">
          Community contribution verification and management functionality is planned for a future release.
        </p>
        <button
          disabled
          className="px-4 py-2 rounded-lg bg-[#111E30] border border-[#263449] text-[#64748B] text-xs font-mono cursor-not-allowed opacity-50"
        >
          Contributions (Unavailable)
        </button>
      </div>
    </div>
  );
}
