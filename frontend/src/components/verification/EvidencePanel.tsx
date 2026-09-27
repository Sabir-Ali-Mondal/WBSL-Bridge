"use client";
import React from "react";
import { VerificationEvidence } from "@/lib/types";
import { AlertCircle, Check, X, HelpCircle, BarChart2 } from "lucide-react";

interface EvidencePanelProps {
  evidence: VerificationEvidence;
  submittedLabel: string;
  signerId: string;
  onAction?: (action: "accepted" | "rejected" | "needs_review", notes?: string) => void;
}

export function EvidencePanel({
  evidence,
  submittedLabel,
  signerId,
  onAction,
}: EvidencePanelProps) {
  const [notes, setNotes] = React.useState("");

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-6">
      {/* Permanent Warning Banner per Section 8.6 */}
      <div className="p-3.5 rounded bg-status-pending/10 border border-status-pending/30 flex items-start space-x-3 text-xs text-status-pending">
        <AlertCircle size={16} className="shrink-0 mt-0.5" />
        <span className="leading-relaxed font-mono">
          Validation scores are advisory evidence only. They do not automatically approve or reject this submission. Human review required.
        </span>
      </div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SUBMITTED GLOSS</div>
          <div className="text-xl font-bold font-sans text-text-primary mt-0.5">{submittedLabel}</div>
        </div>
        <div>
          <div className="text-xs font-mono uppercase text-text-muted">SIGNER ID</div>
          <div className="text-sm font-mono text-text-secondary mt-0.5">{signerId}</div>
        </div>
      </div>

      {/* Reasoning Layer per Section 8.6 */}
      <div className="bg-surface-elevated/70 border border-border p-4 rounded-md space-y-2.5">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2 flex items-center space-x-1.5">
          <BarChart2 size={13} className="text-accent-secondary" />
          <span>Automated Reasoning Analysis</span>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-xs font-mono">
          <span className="text-text-muted">HANDSHAPE MATCH</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.handshape_match}</span>

          <span className="text-text-muted">MOVEMENT MATCH</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.movement_match}</span>

          <span className="text-text-muted">TEMPORAL PATTERN</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.temporal_match}</span>

          <span className="text-text-muted">NMM DETECTED</span>
          <span className="text-text-primary font-medium text-right">{evidence.reasoning.nmm_detected}</span>

          <span className="text-text-muted">TOP CANDIDATE</span>
          <span className="text-accent-primary font-semibold text-right">{evidence.reasoning.top_candidate}</span>
        </div>
      </div>

      {/* Scores & Progress */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">
          Algorithmic Confidence Metrics (/100)
        </div>
        {[
          { label: "Geometry Alignment", val: evidence.geometry_score },
          { label: "Temporal Cadence", val: evidence.temporal_score },
          { label: "Cluster Similarity", val: evidence.similarity_score },
          { label: "Signer Label Agreement", val: evidence.label_agreement },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-text-secondary">
              <span>{item.label}</span>
              <span className="text-text-primary font-semibold">{item.val}%</span>
            </div>
            <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full"
                style={{ width: `${item.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Symbolic Tags */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">
          Extracted Kinematic Tags
        </div>
        <div className="flex flex-wrap gap-1.5">
          {evidence.symbolic_tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-elevated border border-border text-text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Movement Description */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
          Trajectory Analysis
        </div>
        <p className="text-xs text-text-secondary leading-relaxed bg-surface-elevated/40 p-3 rounded border border-border">
          {evidence.movement_description}
        </p>
      </div>

      {/* Reviewer Notes */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1.5">
          Reviewer Evaluation Notes
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document any spatial divergence or regional dialect variations..."
          className="w-full p-2.5 bg-background border border-border rounded text-text-primary font-mono text-xs focus:outline-none focus:border-accent-primary"
        />
      </div>

      {/* 3 Action Buttons per Section 8.6 */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => onAction?.("accepted", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-approved/20 border border-status-approved text-status-approved hover:bg-status-approved hover:text-black font-mono text-xs font-semibold uppercase transition-colors"
        >
          <Check size={14} />
          <span>Accept</span>
        </button>

        <button
          onClick={() => onAction?.("rejected", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-error/20 border border-status-error text-status-error hover:bg-status-error hover:text-white font-mono text-xs font-semibold uppercase transition-colors"
        >
          <X size={14} />
          <span>Reject</span>
        </button>

        <button
          onClick={() => onAction?.("needs_review", notes)}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded bg-status-unknown/20 border border-status-unknown text-status-unknown hover:bg-status-unknown hover:text-white font-mono text-xs font-semibold uppercase transition-colors"
        >
          <HelpCircle size={14} />
          <span>Needs Review</span>
        </button>
      </div>
    </div>
  );
}
