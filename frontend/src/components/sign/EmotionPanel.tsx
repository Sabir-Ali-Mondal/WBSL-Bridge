"use client";
import React from "react";
import { Smile, Frown, Angry, Zap, HelpCircle, Meh, AlertCircle } from "lucide-react";

export interface EmotionResult {
  dominant: string;
  confidence: number;
  scores: Record<string, number>;
}

/**
 * Which emoji stands for which class, plus the accent colour used for the
 * active bar. Kept in one table so the grid and the readout cannot drift apart.
 */
const EMOTION_META: Record<
  string,
  { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; color: string }
> = {
  happy: { icon: Smile, label: "Happy", color: "text-status-success" },
  sad: { icon: Frown, label: "Sad", color: "text-accent-tertiary" },
  angry: { icon: Angry, label: "Angry", color: "text-status-error" },
  fear: { icon: AlertCircle, label: "Fear", color: "text-status-warning" },
  surprise: { icon: Zap, label: "Surprise", color: "text-accent-secondary" },
  disgust: { icon: Frown, label: "Disgust", color: "text-status-warning" },
  neutral: { icon: Meh, label: "Neutral", color: "text-text-muted" },
};

const ORDER = ["happy", "sad", "angry", "fear", "surprise", "disgust", "neutral"];

interface Props {
  emotion: EmotionResult | null | undefined;
  compact?: boolean;
}

export function EmotionPanel({ emotion, compact = false }: Props) {
  if (!emotion) {
    return (
      <div className="rounded-xl border border-border/80 bg-surface/60 p-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          <HelpCircle size={13} />
          Affect
        </div>
        <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
          Waiting for a face in frame. Emotions are read from the cropped face region
          using a ViT classifier.
        </p>
      </div>
    );
  }

  const dominant = emotion.dominant ?? "neutral";
  const meta = EMOTION_META[dominant] ?? EMOTION_META.neutral;
  const Icon = meta.icon;
  const scores = emotion.scores ?? {};
  // Negation is worth flagging explicitly: it is the one marker that changes the
  // meaning of the whole utterance rather than decorating a single sign.
  const isNeutral = dominant === "neutral";

  return (
    <div className="rounded-xl border border-border/80 bg-surface/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
        <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-text-secondary">
          <Sparkline />
          Affect
        </span>
        <span className="text-[10px] font-mono text-text-muted uppercase">ViT · 7-class</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Dominant emotion readout */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${isNeutral
                ? "border-border bg-surface-elevated"
                : "border-accent-primary/40 bg-accent-primary/10"
              }`}
          >
            <Icon size={22} className={meta.color} />
          </div>
          <div className="min-w-0">
            <div className={`text-lg font-bold font-mono leading-tight ${meta.color}`}>
              {meta.label.toUpperCase()}
            </div>
            <div className="text-[11px] font-mono text-text-muted tabular-nums">
              {Math.round((emotion.confidence ?? 0) * 100)}% confidence
            </div>
          </div>
        </div>

        {/* Distribution — all seven classes, so a near-miss is visible. */}
        <div className="space-y-1.5">
          {ORDER.map((key) => {
            const m = EMOTION_META[key];
            const score = scores[key] ?? 0;
            const active = key === dominant;
            return (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={`w-14 text-[10px] font-mono shrink-0 ${active ? "text-text-primary font-bold" : "text-text-muted"
                    }`}
                >
                  {m?.label ?? key}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${active ? "bg-accent-primary" : "bg-text-muted/40"
                      }`}
                    style={{ width: `${Math.max(score * 100, score > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span
                  className={`w-9 text-right text-[10px] font-mono tabular-nums shrink-0 ${active ? "text-accent-primary font-bold" : "text-text-muted"
                    }`}
                >
                  {Math.round(score * 100)}%
                </span>
              </div>
            );
          })}
        </div>

        {!compact && (
          <p className="text-[10px] text-text-muted leading-relaxed pt-1 border-t border-border/60">
            Emotions are read from the cropped face region using a ViT classifier.
          </p>
        )}
      </div>
    </div>
  );
}

/** Small inline activity glyph — avoids pulling a chart lib in for one sparkline. */
function Sparkline() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-accent-secondary">
      <path
        d="M3 12h4l3-7 4 14 3-7h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}