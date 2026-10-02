"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sliders, RotateCcw, X } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8200";

/**
 * The NMM thresholds are all "how much of this expression counts as that marker".
 * They are exposed because the correct value is genuinely user- and
 * camera-dependent: a raised eyebrow in a dim room with a low-res webcam
 * produces a very different landmark ratio than the same eyebrow on a well-lit
 * 1080p feed. One hardcoded constant cannot serve both, and the failure mode of
 * getting it wrong is loud -- every casual expression registers as a question
 * marker, and the gloss string fills with [negation] and [?].
 *
 * Each slider maps to a key in backend/nmm.py DEFAULT_CONFIG and is pushed live
 * to the server, so the effect is visible on the very next detection tick.
 */

export interface NmmThresholds {
  brow_raise_thresh: number;
  brow_furrow_thresh: number;
  mouth_thresh: number;
  head_shake_var_thresh: number;
  head_nod_var_thresh: number;
  emotion_min_confidence: number;
}

/**
 * Master on/off switches for the five non-manual markers.
 *
 * These are NOT thresholds. A slider decides how much of an expression counts as
 * a marker; a gate decides whether the marker exists at all. Turning the question
 * slider down still leaves it able to fire on a big enough brow raise, and it
 * loses the value the operator had tuned. A gate is the honest off switch.
 */
export interface MarkerGates {
  question: boolean;
  wh_question: boolean;
  negation: boolean;
  affirmation: boolean;
  emphasis: boolean;
}

/** The gate keys, in the order the panel lists them. */
export const MARKER_GATE_KEYS: (keyof MarkerGates)[] = [
  "question",
  "wh_question",
  "negation",
  "affirmation",
  "emphasis",
];

/**
 * Negation and the two question markers ship OFF.
 *
 * A head shake and a brow raise are things every speaker does while thinking or
 * mid-sentence, so leaving them armed fills the gloss string with [negation] and
 * [?] the signer never intended. Affirmation and emphasis are cheap to re-enable
 * and are on by default. These must match DEFAULT_MARKER_GATES in backend/nmm.py.
 */
export const DEFAULT_MARKER_GATES: MarkerGates = {
  question: false,
  wh_question: false,
  negation: false,
  affirmation: true,
  emphasis: true,
};

/**
 * Client-side acceptance thresholds. Unlike NMM these never reach the server:
 * the decision to accept a window and append a gloss is made in the page, from
 * the confidence and margin the stream endpoint already returns. They are
 * persisted to localStorage so an operator's tuning survives a reload.
 */
export interface CommitThresholds {
  min_confidence: number;
  min_margin: number;
  stable_windows: number;
  repeat_cooldown_ms: number;
}

/** Every slider the panel exposes: the 6 server-side NMM values + 4 client-side. */
export type AllThresholds = NmmThresholds & CommitThresholds;

/** The full panel state: sensitivity sliders plus the marker on/off gates. */
export interface PanelState {
  thresholds: AllThresholds;
  gates: MarkerGates;
}

/** localStorage key for the marker gates. */
export const GATE_STORAGE_KEY = "wbsl.markerGates.v1";

export const DEFAULT_THRESHOLDS: NmmThresholds = {
  brow_raise_thresh: 0.082,
  brow_furrow_thresh: 0.032,
  mouth_thresh: 0.055,
  head_shake_var_thresh: 0.0018,
  head_nod_var_thresh: 0.0018,
  emotion_min_confidence: 0.35,
};

export const DEFAULT_COMMIT_THRESHOLDS: CommitThresholds = {
  min_confidence: 0.55,
  min_margin: 0.25,
  stable_windows: 2,
  repeat_cooldown_ms: 1500,
};

export const DEFAULT_ALL: AllThresholds = {
  ...DEFAULT_THRESHOLDS,
  ...DEFAULT_COMMIT_THRESHOLDS,
};

/** localStorage key. Versioned so a future shape change cannot resurrect stale values. */
export const COMMIT_STORAGE_KEY = "wbsl.commitThresholds.v1";

interface SliderSpec {
  key: string;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  /** Rendered as a percentage multiplier rather than a raw ratio. */
  asPercent?: boolean;
  /** Rendered as a whole number with a unit suffix. */
  unit?: string;
  group: "commit" | "nmm" | "affect";
}

const SLIDERS: SliderSpec[] = [
  {
    key: "min_confidence",
    label: "Sign confidence floor",
    hint: "A recognised sign below this is ignored. Raise it if wrong signs appear.",
    min: 0.2,
    max: 0.95,
    step: 0.05,
    asPercent: true,
    group: "commit",
  },
  {
    key: "min_margin",
    label: "Decisiveness margin",
    hint: "How far the winning sign must beat the runner-up. This is the single most effective guard against confident-looking nonsense — raise it when similar signs get confused.",
    min: 0.0,
    max: 0.9,
    step: 0.05,
    asPercent: true,
    group: "commit",
  },
  {
    key: "stable_windows",
    label: "Agreeing windows before commit",
    hint: "How many consecutive windows must agree before a sign is added. 1 is fastest but jumps the gun; 3 is very strict.",
    min: 1,
    max: 6,
    step: 1,
    unit: "windows",
    group: "commit",
  },
  {
    key: "repeat_cooldown_ms",
    label: "Repeat cooldown",
    hint: "How long the same sign is suppressed after being added, so holding one sign does not repeat it.",
    min: 300,
    max: 5000,
    step: 100,
    unit: "ms",
    group: "commit",
  },
  {
    key: "brow_raise_thresh",
    label: "Brow raise → question [?]",
    hint: "How far the brows must lift above the eyes. Lower = easier to trigger.",
    min: 0.02,
    max: 0.18,
    step: 0.002,
    group: "nmm",
  },
  {
    key: "brow_furrow_thresh",
    label: "Brow furrow → wh-question",
    hint: "How close the brows must sit to the eyes to count as a furrow.",
    min: 0.01,
    max: 0.08,
    step: 0.001,
    group: "nmm",
  },
  {
    key: "mouth_thresh",
    label: "Mouth open → emphasis",
    hint: "Lip separation that counts as emphasis. Raise it to ignore casual speech.",
    min: 0.01,
    max: 0.14,
    step: 0.002,
    group: "nmm",
  },
  {
    key: "head_shake_var_thresh",
    label: "Head shake → negation",
    hint: "Lateral nose movement needed. Raise it to require a deliberate shake.",
    min: 0.0002,
    max: 0.008,
    step: 0.0001,
    group: "nmm",
  },
  {
    key: "head_nod_var_thresh",
    label: "Head nod → affirmation",
    hint: "Vertical nose movement needed. Raise it to require a deliberate nod.",
    min: 0.0002,
    max: 0.008,
    step: 0.0001,
    group: "nmm",
  },
  {
    key: "emotion_min_confidence",
    label: "Emotion confidence floor",
    hint: "Below this, affect falls back to neutral instead of guessing.",
    min: 0.1,
    max: 0.9,
    step: 0.05,
    asPercent: true,
    group: "affect",
  },
];

const GROUP_META: Record<string, { title: string; blurb: string }> = {
  commit: {
    title: "Recognition acceptance",
    blurb:
      "Decides whether a recognised sign is actually added to the sequence. Tighten these when the sequence accumulates wrong signs.",
  },
  nmm: {
    title: "Non-manual markers",
    blurb:
      "How much of each facial or head expression counts as a marker. Loosen a value if a deliberate expression never registers.",
  },
  affect: {
    title: "Affect",
    blurb: "How confident the emotion classifier must be before it reports a non-neutral emotion.",
  },
};

interface Props {
  values: AllThresholds;
  onChange: (next: AllThresholds) => void;
  /** Marker on/off gates. */
  gates: MarkerGates;
  onGatesChange: (next: MarkerGates) => void;
  /** Open the modal on mount. Defaults to closed. */
  defaultOpen?: boolean;
  /** Renders the trigger button inline instead of in the control bar. */
  variant?: "inline" | "header";
}

/** One-line description of each gate, shown next to its switch. */
const GATE_META: Record<keyof MarkerGates, { label: string; desc: string }> = {
  question: {
    label: "Question (yes/no)",
    desc: "Eyebrow raise. Adds [?] to the clause.",
  },
  wh_question: {
    label: "WH-question",
    desc: "Brow furrow. Frames what / why / how.",
  },
  negation: {
    label: "Negation",
    desc: "Head shake. Adds [negation] to the sign.",
  },
  affirmation: {
    label: "Affirmation",
    desc: "Head nod. Confirms the clause.",
  },
  emphasis: {
    label: "Emphasis",
    desc: "Mouth open. Stresses the clause.",
  },
};

export function NmmThresholdPanel({
  values,
  onChange,
  gates,
  onGatesChange,
  defaultOpen = false,
  variant = "inline",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  // Portals cannot run during SSR/prerender -- there is no document to portal
  // into -- so the overlay is only rendered after the first client mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Escape closes, and the page behind must not scroll while an overlay is up.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const update = (key: string, raw: number) => {
    const next = { ...values, [key]: raw } as AllThresholds;
    onChange(next);
    // Server-side NMM values are pushed so detection reflects them on the next
    // tick. The commit values are client-only, so they are written to
    // localStorage instead. Sending the commit keys to the NMM endpoint would be
    // silently ignored, which is worse than not sending them -- it would look
    // like the tuning took effect when nothing changed.
    const { min_confidence, min_margin, stable_windows, repeat_cooldown_ms } = next;
    axios
      .post(`${API_BASE}/api/nmm/config`, {
        brow_raise_thresh: next.brow_raise_thresh,
        brow_furrow_thresh: next.brow_furrow_thresh,
        mouth_thresh: next.mouth_thresh,
        head_shake_var_thresh: next.head_shake_var_thresh,
        head_nod_var_thresh: next.head_nod_var_thresh,
        emotion_min_confidence: next.emotion_min_confidence,
      })
      .catch(() => {});
    try {
      localStorage.setItem(
        COMMIT_STORAGE_KEY,
        JSON.stringify({ min_confidence, min_margin, stable_windows, repeat_cooldown_ms })
      );
    } catch {
      /* private mode / storage disabled -- tuning still applies for this session */
    }
  };

  const setGate = (key: keyof MarkerGates, enabled: boolean) => {
    const next = { ...gates, [key]: enabled };
    onGatesChange(next);
    // The gates live on the server, so they are pushed the same way thresholds
    // are. The local mirror is written too: without it a reload would show the
    // defaults while the server kept the operator's choice.
    axios
      .post(`${API_BASE}/api/nmm/config`, { marker_gates: { [key]: enabled } })
      .catch(() => {});
    try {
      localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    onChange(DEFAULT_ALL);
    onGatesChange(DEFAULT_MARKER_GATES);
    axios
      .post(`${API_BASE}/api/nmm/config`, {
        ...DEFAULT_THRESHOLDS,
        marker_gates: DEFAULT_MARKER_GATES,
      })
      .catch(() => {});
    try {
      localStorage.setItem(COMMIT_STORAGE_KEY, JSON.stringify(DEFAULT_COMMIT_THRESHOLDS));
      localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(DEFAULT_MARKER_GATES));
    } catch {
      /* ignore */
    }
  };

  const grouped = (group: SliderSpec["group"]) => SLIDERS.filter((s) => s.group === group);

  /**
   * How far the live values have drifted from the calibrated defaults.
   * Surfacing this on the trigger matters because the modal is invisible when
   * shut: without a count, an operator who tuned something last week has no way
   * to know the detector is still running on those values.
   *
   * A switched-off marker counts as a change, because it is the one setting that
   * silently deletes output the operator may later expect to see.
   */
  const changedCount =
    SLIDERS.filter(
      (s) =>
        (values as unknown as Record<string, number>)[s.key] !==
        (DEFAULT_ALL as unknown as Record<string, number>)[s.key]
    ).length +
    MARKER_GATE_KEYS.filter((k) => gates[k] !== DEFAULT_MARKER_GATES[k]).length;

  const disabledCount = MARKER_GATE_KEYS.filter((k) => !gates[k]).length;

  const trigger =
    variant === "header" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="NMM Controller"
        className="relative p-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-accent-secondary hover:border-accent-secondary/50 transition-colors"
      >
        <Sliders size={13} />

        {changedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-accent-secondary text-black text-[8px] font-bold flex items-center justify-center">
            {changedCount}
          </span>
        )}
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/80 bg-surface/60 hover:bg-surface-elevated/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-text-secondary">
          <Sliders size={13} className="text-accent-secondary" />
          NMM Controller
        </span>

        <span className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          {/* Markers that are switched off are the most important thing to see
              from outside the modal, so they are named rather than folded into
              the tuned count. */}
          {disabledCount > 0 ? (
            <span className="text-status-pending">{disabledCount} off</span>
          ) : changedCount > 0 ? (
            <span className="text-accent-secondary">{changedCount} tuned</span>
          ) : (
            <span>defaults</span>
          )}
          <span>·</span>
          <span>{SLIDERS.length} controls</span>
        </span>
      </button>
    );

  if (!open) return <>{trigger}</>;

  const overlay = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="NMM Controller"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-xl border border-border bg-surface shadow-2xl overflow-hidden"
      >
          {/* HEADER */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-border shrink-0">
            <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-text-secondary">
              <Sliders size={13} className="text-accent-secondary" />
              NMM Controller
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close NMM controller"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* BODY — scrolls independently so the header stays put */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
            <p className="text-[11px] text-text-muted leading-relaxed">
              Every control below is live — changes take effect immediately. Not sure what
              to change? Start with <strong className="text-text-secondary">Decisiveness margin</strong>{" "}
              and <strong className="text-text-secondary">Agreeing windows</strong>: they do the
              most to stop wrong signs without making detection sluggish.
            </p>

            {/* MARKER SWITCHES. First, because a switched-off marker explains
                far more about a wrong output than any slider value does: no
                amount of threshold tuning will produce a [negation] while the
                negation gate is closed. */}
            <div className="space-y-3">
              <div className="pb-1 border-b border-border/50">
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary">
                  Markers
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                  Which non-manual markers are allowed to reach the LLM at all. A marker
                  switched off is never reported, no matter how strongly it is performed —
                  this is different from the sliders below, which only set how much of an
                  expression is needed. Negation and questions are off by default because a
                  head shake or a brow raise happens constantly in ordinary signing.
                </p>
              </div>

              {MARKER_GATE_KEYS.map((key) => {
                const on = gates[key];
                const meta = GATE_META[key];
                const isDefault = on === DEFAULT_MARKER_GATES[key];

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono text-text-secondary">
                        {meta.label}
                        {!isDefault && (
                          <span className="ml-1.5 text-[9px] text-accent-secondary">•</span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>

                    {/* A real switch, not a checkbox: the state has to read at a
                        glance from across a room while signing. */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={meta.label}
                      onClick={() => setGate(key, !on)}
                      className={`shrink-0 w-10 h-5 rounded-full border transition-colors relative ${
                        on
                          ? "bg-accent-primary/30 border-accent-primary/60"
                          : "bg-surface-elevated border-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                          on
                            ? "left-[22px] bg-accent-primary"
                            : "left-0.5 bg-text-muted"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {(["commit", "nmm", "affect"] as const).map((group) => (
              <div key={group} className="space-y-3">
                <div className="pb-1 border-b border-border/50">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-accent-secondary">
                    {GROUP_META[group].title}
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
                    {GROUP_META[group].blurb}
                  </p>
                </div>

                {grouped(group).map((s) => {
                  const v = (values as unknown as Record<string, number>)[s.key] ?? 0;
                  const pct = ((v - s.min) / (s.max - s.min)) * 100;
                  const isDefault =
                    v === (DEFAULT_ALL as unknown as Record<string, number>)[s.key];
                  const display = s.asPercent
                    ? `${Math.round(v * 100)}%`
                    : s.unit === "windows"
                    ? `${Math.round(v)}`
                    : s.unit === "ms"
                    ? `${(v / 1000).toFixed(1)}s`
                    : v.toFixed(4);
                  return (
                    <div key={s.key} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-[11px] font-mono text-text-secondary">
                          {s.label}
                          {!isDefault && (
                            <span className="ml-1.5 text-[9px] text-accent-secondary">•</span>
                          )}
                        </label>
                        <span className="text-[11px] font-mono font-bold text-accent-primary tabular-nums shrink-0">
                          {display}
                          {s.unit === "windows" && (
                            <span className="text-text-muted font-normal"> win</span>
                          )}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={v}
                        onChange={(e) => update(s.key, parseFloat(e.target.value))}
                        aria-label={s.label}
                        className="w-full h-1 appearance-none rounded-full cursor-pointer accent-[var(--accent-primary)]"
                        style={{
                          background: `linear-gradient(to right, var(--accent-primary) ${pct}%, rgba(255,255,255,0.12) ${pct}%)`,
                        }}
                      />
                      <p className="text-[10px] text-text-muted leading-relaxed">{s.hint}</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-[11px] font-mono text-text-secondary hover:text-text-primary hover:border-accent-secondary transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset to calibrated defaults</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-accent-primary text-black text-[11px] font-mono font-bold hover:bg-accent-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <>
      {trigger}

      {/* Portaled to <body>.
          This component is mounted deep inside the Recognition column, whose
          ancestors use overflow-hidden and own their own stacking contexts.
          Rendering the overlay inline meant `fixed inset-0` was clipped by
          those ancestors and z-[100] could not lift it above sibling columns,
          so the dialog appeared mid-page and cut off. A portal moves the node
          out of that subtree entirely, which is the only reliable way to escape
          a clipped ancestor for a full-viewport overlay. */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}