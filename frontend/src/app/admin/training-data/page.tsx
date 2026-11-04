"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft, ChevronRight, CircleCheck, CircleX, Search } from "lucide-react";

const API_BASE = "http://localhost:8200";
const GLOSS_LIST_LIMIT = 1000;

interface TrainingGloss {
  gloss: string;
  category: "Alphabet" | "Word";
  dialects: string[];
  clip_count: number;
}

interface TrainingGlossPage {
  items: TrainingGloss[];
  total: number;
  model_id: string | null;
  dialects: string[];
}

interface TrainingClip {
  gloss: string;
  clip_index: number;
  clip_count: number;
  frame_count: number;
  feature_width: number;
  frames: number[][];
  source_video: string | null;
  prediction: string;
  correct: boolean;
  confidence: number;
  top3: { label: string; confidence: number }[];
}

const HAND_COLORS = ["#5EEAD4", "#C4B5FD"];

function TrainingClipView({ clip }: { clip: TrainingClip }) {
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const frame = clip.frames[frameIndex] ?? [];
  const togglePlayback = () => setPlaying((value) => !value);

  React.useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % clip.frame_count);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, clip.frame_count]);

  const toScreen = (x: number, y: number) => ({
    x: 50 + x * 34,
    y: 44 - y * 28,
  });
  const elbows = [0, 1].map((side) =>
    toScreen(frame[82 + side * 2] ?? 0, frame[83 + side * 2] ?? 0),
  );
  const wrists = [0, 1].map((side) =>
    toScreen(frame[78 + side * 2] ?? 0, frame[79 + side * 2] ?? 0),
  );
  const handInUse = [0, 1].map((side) => (frame[95 + side] ?? 0) > 0.5);
  const shoulders = [toScreen(0.5, 0), toScreen(-0.5, 0)];
  const headMouth = toScreen(frame[92] ?? 0, frame[93] ?? 0);

  const renderHand = (handIndex: number) => {
    if (!handInUse[handIndex]) return null;
    const start = handIndex * 33;
    const wrist = { x: frame[78 + handIndex * 2] ?? 0, y: frame[79 + handIndex * 2] ?? 0 };
    const scale = 0.24;
    const points = Array.from({ length: 11 }, (_, pointIndex) => {
      const offset = start + pointIndex * 3;
      const x = frame[offset];
      const y = frame[offset + 1];
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return toScreen(
        wrist.x + scale * x,
        wrist.y + scale * y,
      );
    });
    const fingerSegments: [number, number][] = [
      [1, 2], [3, 4], [5, 6], [7, 8], [9, 10],
    ];
    const palmBaseIndices = [1, 3, 5, 7, 9];
    const palmBases = palmBaseIndices.map((index) => points[index]);
    const palmPath = palmBases.every(Boolean) && points[0]
      ? `M ${points[0].x} ${points[0].y} L ${palmBases[0]!.x} ${palmBases[0]!.y} Q ${palmBases[1]!.x} ${palmBases[1]!.y} ${palmBases[2]!.x} ${palmBases[2]!.y} Q ${palmBases[3]!.x} ${palmBases[3]!.y} ${palmBases[4]!.x} ${palmBases[4]!.y} Z`
      : "";

    return (
      <g
        key={handIndex}
        stroke={HAND_COLORS[handIndex]}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {palmPath && (
          <path
            d={palmPath}
            fill={HAND_COLORS[handIndex]}
            fillOpacity="0.12"
            stroke={HAND_COLORS[handIndex]}
            strokeWidth="0.65"
            strokeOpacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {fingerSegments.map(([from, to]) => {
          const first = points[from];
          const second = points[to];
          return first && second ? (
            <line
              key={`finger-${from}-${to}`}
              x1={first.x}
              y1={first.y}
              x2={second.x}
              y2={second.y}
              strokeWidth="1.05"
              vectorEffect="non-scaling-stroke"
            />
          ) : null;
        })}
        {points.map((point, index) =>
          point ? (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === 0 ? 1 : index % 2 === 1 ? 0.85 : 0.7}
              fill={HAND_COLORS[handIndex]}
              stroke="#0b0b0d"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
          ) : null,
        )}
      </g>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${playing ? "Pause" : "Play"} ${clip.gloss} skeleton animation`}
        onClick={togglePlayback}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            togglePlayback();
          }
        }}
        className="relative min-h-[220px] flex-1 cursor-pointer overflow-hidden rounded-lg border border-border bg-background/70 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        title="Click or press Space to play/pause"
      >
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={`${clip.gloss} skeleton, frame ${frameIndex + 1} of ${clip.frame_count}`}
          className="absolute inset-0 h-full w-full"
        >
          <line x1="50" y1="8" x2="50" y2="88" stroke="currentColor" opacity="0.08" />
          <line x1="19" y1="44" x2="81" y2="44" stroke="currentColor" opacity="0.08" />
          <g stroke="#818CF8" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <path d={`M ${shoulders[0].x} ${shoulders[0].y} L ${shoulders[1].x} ${shoulders[1].y}`} />
            <path d={`M ${shoulders[0].x} ${shoulders[0].y} L ${elbows[0].x} ${elbows[0].y}${handInUse[0] ? ` L ${wrists[0].x} ${wrists[0].y}` : ""}`} />
            <path d={`M ${shoulders[1].x} ${shoulders[1].y} L ${elbows[1].x} ${elbows[1].y}${handInUse[1] ? ` L ${wrists[1].x} ${wrists[1].y}` : ""}`} />
            <path d="M 40 70 L 60 70 M 50 32 L 50 70" opacity="0.6" />
          </g>
          <g fill="#818CF8">
            {[...shoulders, ...elbows, ...wrists].map((point, index) => (
              <circle key={index} cx={point.x} cy={point.y} r={index < 2 ? 2 : 1.5} />
            ))}
          </g>
          <ellipse
            cx={headMouth.x}
            cy={headMouth.y - 5}
            rx="4.3"
            ry="6.3"
            fill="#818CF8"
            fillOpacity="0.14"
            stroke="#818CF8"
            strokeWidth="1.2"
          />
          <circle cx={headMouth.x} cy={headMouth.y} r="0.7" fill="#818CF8" />
          {renderHand(0)}
          {renderHand(1)}
        </svg>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-background/70 px-2 py-1 text-[9px] font-mono text-text-muted">
          CLICK / SPACE {playing ? "TO PAUSE" : "TO PLAY"}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <input
          type="range"
          min={0}
          max={Math.max(0, clip.frame_count - 1)}
          value={frameIndex}
          onChange={(event) => {
            setPlaying(false);
            setFrameIndex(Number(event.target.value));
          }}
          aria-label="Training clip frame"
          className="m-0 min-w-0 flex-1 accent-[var(--accent-primary)]"
        />
        <span className="w-16 text-right text-[9px] font-mono text-text-muted">
          {frameIndex + 1} / {clip.frame_count}
        </span>
      </div>
    </div>
  );
}

export default function AdminTrainingDataPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [dialect, setDialect] = React.useState("");
  const [selectedGloss, setSelectedGloss] = React.useState("");
  const [clipIndex, setClipIndex] = React.useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["model-training-data", search, category, dialect],
    queryFn: async () =>
      (
        await axios.get<TrainingGlossPage>(
          `${API_BASE}/api/admin/model/training-data`,
          { params: { page: 1, limit: GLOSS_LIST_LIMIT, search, category, dialect } },
        )
      ).data,
    refetchInterval: 15000,
  });

  const currentGloss = data?.items.some((item) => item.gloss === selectedGloss)
    ? selectedGloss
    : data?.items[0]?.gloss ?? "";
  const currentClipIndex = currentGloss === selectedGloss ? clipIndex : 0;

  const {
    data: clip,
    isLoading: clipLoading,
    isError: clipError,
  } = useQuery({
    queryKey: ["model-training-clip", data?.model_id, currentGloss, currentClipIndex],
    queryFn: async () =>
      (
        await axios.get<TrainingClip>(
          `${API_BASE}/api/admin/model/training-data/${encodeURIComponent(currentGloss)}/clips/${currentClipIndex}`,
        )
      ).data,
    enabled: Boolean(currentGloss),
    retry: false,
  });

  const selectGloss = (gloss: string) => {
    setSelectedGloss(gloss);
    setClipIndex(0);
  };

  const handleNavigationKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const selectedItem = data?.items.find((item) => item.gloss === currentGloss);
      const maxClip = Math.max(0, (selectedItem?.clip_count ?? clip?.clip_count ?? 1) - 1);
      event.preventDefault();
      setClipIndex((index) =>
        event.key === "ArrowLeft" ? Math.max(0, index - 1) : Math.min(maxClip, index + 1),
      );
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const glosses = data?.items ?? [];
      if (glosses.length === 0) return;
      const currentIndex = glosses.findIndex((item) => item.gloss === currentGloss);
      const nextIndex = event.key === "ArrowUp"
        ? Math.max(0, currentIndex - 1)
        : Math.min(glosses.length - 1, currentIndex + 1);
      event.preventDefault();
      selectGloss(glosses[nextIndex].gloss);
    }
  };

  return (
    <div
      className="mx-auto flex h-full min-h-[480px] max-w-7xl flex-col gap-4"
      onKeyDown={handleNavigationKeys}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <h1 className="text-xl font-bold text-text-primary">Training Data</h1>
        <span className="rounded border border-border bg-surface px-2.5 py-1 text-[10px] font-mono text-text-muted">
          MODEL {data?.model_id ?? "—"}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search glosses"
            aria-label="Search glosses"
            className="w-full rounded border border-border bg-surface py-2 pl-9 pr-3 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
          />
        </label>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
          }}
          aria-label="Filter by category"
          className="rounded border border-border bg-surface px-3 py-2 text-[10px] font-mono text-text-secondary focus:border-accent-primary focus:outline-none"
        >
          <option value="">All categories</option>
          <option value="Alphabet">Alphabet</option>
          <option value="Word">Word</option>
        </select>
        <select
          value={dialect}
          onChange={(event) => {
            setDialect(event.target.value);
          }}
          aria-label="Filter by dialect"
          title="Filter using dialect/source labels saved in the model archive"
          className="rounded border border-border bg-surface px-3 py-2 text-[10px] font-mono text-text-secondary focus:border-accent-primary focus:outline-none"
        >
          <option value="">All dialects</option>
          {data?.dialects.map((availableDialect) => (
            <option key={availableDialect} value={availableDialect}>{availableDialect}</option>
          ))}
        </select>
        <span className="px-2 text-[10px] font-mono text-text-muted">{data?.total ?? 0} glosses</span>
      </div>

      {isError && (
        <div className="rounded border border-status-error/30 bg-status-error/10 p-3 text-xs text-status-error">
          Could not load the active model&apos;s archived training clips.
        </div>
      )}

      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between border-b border-border px-3 py-2 text-[10px] font-mono uppercase text-text-muted">
            <span>Glosses</span>
            <span className="flex items-center gap-2">
              <span>{data?.total ?? 0}</span>
              <span className="normal-case tracking-normal text-text-muted/70" title="Use Up and Down arrows to change gloss">↑ ↓</span>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isLoading ? (
              <div className="p-4 text-xs font-mono text-text-muted">Loading…</div>
            ) : data?.items.length ? (
              data.items.map((item) => (
                <button
                  key={item.gloss}
                  type="button"
                  onClick={() => selectGloss(item.gloss)}
                  className={`flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2.5 text-left text-xs font-mono last:border-0 ${
                    currentGloss === item.gloss
                      ? "bg-accent-primary/10 text-accent-primary"
                      : "text-text-secondary hover:bg-surface-elevated"
                  }`}
                >
                  <span className="truncate">{item.gloss}</span>
                  <span className="shrink-0 text-[9px] text-text-muted">{item.clip_count}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-xs font-mono leading-relaxed text-text-muted">
                {search
                  ? "No matching glosses."
                  : "No archived training data."}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-0 min-w-0 flex-col rounded-lg border border-border bg-surface p-3 sm:p-4">
          {clip ? (
            <>
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text-primary">{clip.gloss}</div>
                  </div>
                  <div className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-mono font-bold ${
                    clip.correct
                      ? "border-status-approved/30 bg-status-approved/10 text-status-approved"
                      : "border-status-error/30 bg-status-error/10 text-status-error"
                  }`}>
                    {clip.correct ? <CircleCheck size={11} /> : <CircleX size={11} />}
                    {clip.correct ? "MATCH" : "MISMATCH"} · {Math.round(clip.confidence * 100)}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setClipIndex((value) => Math.max(0, value - 1))}
                    disabled={clipIndex <= 0}
                    className="rounded border border-border p-1.5 text-text-secondary disabled:opacity-30"
                    aria-label="Previous training clip (left arrow)"
                    title="Previous clip (←)"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClipIndex((value) => Math.min(clip.clip_count - 1, value + 1))}
                    disabled={clipIndex >= clip.clip_count - 1}
                    className="rounded border border-border p-1.5 text-text-secondary disabled:opacity-30"
                    aria-label="Next training clip (right arrow)"
                    title="Next clip (→)"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <span className="whitespace-nowrap text-[9px] font-mono text-text-muted">
                    Clip {clip.clip_index + 1} / {clip.clip_count}
                  </span>
                </div>
              </div>
              <TrainingClipView key={`${clip.gloss}-${clip.clip_index}`} clip={clip} />
              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-2 text-[9px] font-mono text-text-muted">
                <span>Expected <strong className="text-text-secondary">{clip.gloss}</strong></span>
                <span>Predicted <strong className={clip.correct ? "text-status-approved" : "text-status-error"}>{clip.prediction}</strong></span>
                {clip.source_video && (
                  <span className="max-w-[220px] truncate" title={clip.source_video}>
                    Source {clip.source_video}
                  </span>
                )}
                <span className="ml-auto text-[8px]">Training clip · not validation accuracy</span>
                <div className="flex w-full flex-wrap gap-x-4 gap-y-1.5">
                  {clip.top3.map((item, index) => {
                    const confidence = Math.max(0, Math.min(100, item.confidence * 100));
                    return (
                      <div key={item.label} className="flex min-w-[120px] flex-1 items-center gap-2">
                        <span className="w-24 truncate text-text-secondary" title={item.label}>{item.label}</span>
                        <div
                          className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border"
                          role="meter"
                          aria-label={`${item.label} confidence`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(confidence)}
                        >
                          <div
                            className={`h-full rounded-full ${index === 0 ? "bg-accent-primary" : "bg-text-muted/60"}`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="w-8 text-right">{Math.round(confidence)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[220px] flex-1 items-center justify-center text-center text-xs font-mono text-text-muted">
              {clipLoading
                ? "Loading clip…"
                : clipError
                  ? "Could not load clip."
                  : "Select a gloss to view clips."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
