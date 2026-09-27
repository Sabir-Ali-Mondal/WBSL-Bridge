"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import { ThumbsUp, ThumbsDown, CheckCircle2, HelpCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function UnknownSignsPage() {
  const [candidates, setCandidates] = useState([
    {
      id: "unk-01",
      proposedMeaning: "METRO STATION (কলকাতা মেট্রো)",
      district: "Kolkata (North)",
      votes: 14,
      consensusNeeded: 20,
      confidence: 84.2,
    },
    {
      id: "unk-02",
      proposedMeaning: "ROSHOGOLLA / SWEET (রসগোল্লা)",
      district: "Nadia",
      votes: 18,
      consensusNeeded: 20,
      confidence: 91.0,
    },
  ]);

  const handleVote = (id: string, agree: boolean) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, votes: c.votes + (agree ? 1 : -1) } : c
      )
    );
    toast.success(agree ? "Consensus vote recorded (+1)" : "Disagreement recorded (-1)");
  };

  return (
    <PageContainer className="space-y-6 max-w-5xl">
      <div className="pb-3 border-b border-border">
        <div className="text-xs font-mono uppercase text-status-unknown">COMMUNITY DELIBERATION</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary mt-1">
          Unknown Sign Candidates & Consensus Queue
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          When the AI encounters gestures not yet codified in the WBSL vocabulary, it enqueues them here for community consensus before dictionary promotion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((cand) => (
          <div key={cand.id} className="bg-surface border border-border rounded-lg p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-unknown/15 text-status-unknown font-bold">
                  {cand.id} • UNCODIFIED
                </span>
                <h3 className="text-base font-bold text-text-primary mt-2">{cand.proposedMeaning}</h3>
                <div className="text-xs font-mono text-text-muted">Origin: {cand.district}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-text-secondary">OOD Cluster Conf</div>
                <div className="text-base font-bold text-accent-primary">{cand.confidence}%</div>
              </div>
            </div>

            <LandmarkSimulation showHands showFace showPose fps={30} />

            {/* Voting Consensus Bar */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-xs font-mono text-text-secondary">
                <span>Community Consensus Progress</span>
                <span className="text-text-primary font-bold">{cand.votes} / {cand.consensusNeeded} votes</span>
              </div>
              <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-status-unknown transition-all"
                  style={{ width: `${Math.min(100, (cand.votes / cand.consensusNeeded) * 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleVote(cand.id, true)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded bg-status-approved/20 border border-status-approved/40 text-status-approved hover:bg-status-approved hover:text-black font-mono text-xs font-bold transition-colors"
              >
                <ThumbsUp size={14} />
                <span>Confirm Meaning</span>
              </button>

              <button
                onClick={() => handleVote(cand.id, false)}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded bg-surface-elevated border border-border text-text-secondary hover:text-status-error font-mono text-xs transition-colors"
              >
                <ThumbsDown size={14} />
                <span>Dispute</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
