"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { contributionService } from "@/services/contributions";
import { EvidencePanel } from "@/components/verification/EvidencePanel";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { TableRowSkeleton } from "@/components/skeletons";
import { Contribution } from "@/lib/types";
import { toast } from "sonner";

export default function AdminContributionsPage() {
  const { data: contributions, isLoading, refetch } = useQuery({
    queryKey: ["admin-contributions"],
    queryFn: () => contributionService.getContributions(),
  });

  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const { data: evidence, isLoading: evidenceLoading } = useQuery({
    queryKey: ["evidence", selectedContribution?.sample_id],
    queryFn: () => contributionService.getEvidence(selectedContribution!.sample_id),
    enabled: !!selectedContribution,
  });

  const handleVerify = async (action: "accepted" | "rejected" | "needs_review", notes?: string) => {
    if (!selectedContribution) return;
    try {
      await contributionService.verifyContribution(selectedContribution.sample_id, action, notes);
      toast.success(`Submission marked as ${action.toUpperCase()}`);
      setSelectedContribution(null);
      refetch();
    } catch {
      toast.error("Failed to submit verification action");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-text-muted">VERIFICATION PIPELINE</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Community Contributions & Evidence Review
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Contributions Queue Table (5 cols) */}
        <div className="xl:col-span-5 bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-surface-elevated flex justify-between items-center text-xs font-mono">
            <span className="font-semibold text-text-primary uppercase">INCOMING QUEUE</span>
            <span className="text-text-secondary">{contributions?.length || 0} SAMPLES</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-muted">
                  <th className="py-2.5 px-3">Sign</th>
                  <th className="py-2.5 px-3">Signer</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={4} />
                  ))
                ) : contributions?.map((item) => (
                  <tr
                    key={item.sample_id}
                    onClick={() => setSelectedContribution(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedContribution?.sample_id === item.sample_id
                        ? "bg-accent-primary/10 border-l-2 border-accent-primary"
                        : "hover:bg-surface-elevated/60"
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-text-primary">{item.label}</td>
                    <td className="py-3 px-3 text-text-secondary">{item.signer_id}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-status-pending/20 text-status-pending">
                        {item.verification}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-accent-primary hover:underline text-[11px]">Inspect</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Inspection, Simulation & Evidence Panel (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {selectedContribution ? (
            <>
              {/* Landmark Canvas Player */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-text-muted">
                  Kinematic Skeleton Replay: {selectedContribution.label}
                </div>
                <LandmarkSimulation showHands showFace showPose fps={30} />
              </div>

              {/* Evidence Panel with Reasoning Layer */}
              {evidenceLoading ? (
                <div className="p-8 bg-surface rounded border border-border text-center text-xs font-mono text-text-muted">
                  Loading kinematic telemetry...
                </div>
              ) : evidence ? (
                <EvidencePanel
                  evidence={evidence}
                  submittedLabel={selectedContribution.label}
                  signerId={selectedContribution.signer_id}
                  onAction={handleVerify}
                />
              ) : null}
            </>
          ) : (
            <div className="h-96 bg-surface border border-border rounded-lg flex items-center justify-center text-center p-6 text-xs font-mono text-text-muted">
              Select a contribution from the left queue to inspect MediaPipe coordinates and algorithmic evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
