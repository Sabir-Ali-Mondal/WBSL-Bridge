"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RotateCcw } from "lucide-react";
import { LandmarkSimulation } from "@/components/simulation/LandmarkSimulation";
import type { PosePoint } from "@/lib/pose";

const API_BASE = "http://localhost:8200";

interface LandmarkReplay {
  frames: number[][][];
  pose?: PosePoint[][];
  face_mesh?: number[][][];
  count: number;
  source: string;
}

interface Segment {
  gloss: string;
  start: number;
  end: number;
}

interface ReplaySequence {
  frames: number[][][];
  pose?: PosePoint[][];
  faceMesh?: number[][][];
  segments: Segment[];
}

interface Props {
  glosses: string[];
  playing: boolean;
  restartToken: number;
  onSegmentChange: (index: number) => void;
  onComplete: () => void;
  viewResetToken: number;
  onResetView: () => void;
}

async function fetchContinuousSequence(glosses: string[]): Promise<ReplaySequence> {
  const uniqueGlosses = [...new Set(glosses)];
  const entries = await Promise.all(
    uniqueGlosses.map(async (gloss) => {
      const { data } = await axios.get<LandmarkReplay>(
        `${API_BASE}/api/simulation/frames`,
        { params: { label: gloss } },
      );
      if (!data.frames?.length) {
        throw new Error(`The active model has no landmark sequence for ${gloss}.`);
      }
      return [gloss, data] as const;
    }),
  );
  const replayByGloss = new Map(entries);
  const frames: number[][][] = [];
  const poses: PosePoint[][] = [];
  const faceMesh: number[][][] = [];
  const segments: Segment[] = [];
  let allHavePose = true;
  let hasAnyFaceMesh = false;

  for (const gloss of glosses) {
    const replay = replayByGloss.get(gloss);
    if (!replay) throw new Error(`Could not load the ${gloss} landmark sequence.`);

    const start = frames.length;
    frames.push(...replay.frames);
    segments.push({ gloss, start, end: frames.length });

    if (replay.pose?.length === replay.frames.length) {
      poses.push(...replay.pose);
    } else {
      allHavePose = false;
    }

    if (replay.face_mesh?.length === replay.frames.length) {
      faceMesh.push(...replay.face_mesh);
      hasAnyFaceMesh ||= replay.face_mesh.some((frame) => frame.length > 0);
    } else {
      faceMesh.push(...replay.frames.map(() => []));
    }
  }

  return {
    frames,
    pose: allHavePose ? poses : undefined,
    faceMesh: hasAnyFaceMesh ? faceMesh : undefined,
    segments,
  };
}

export function ContinuousSignSimulation({
  glosses,
  playing,
  restartToken,
  onSegmentChange,
  onComplete,
  viewResetToken,
  onResetView,
}: Props) {
  const normalizedGlosses = useMemo(() => glosses.filter(Boolean), [glosses]);
  const [activeSegment, setActiveSegment] = useState(0);
  const reportedSegment = useRef(-1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["text-to-sign-continuous", normalizedGlosses],
    queryFn: () => fetchContinuousSequence(normalizedGlosses),
    enabled: normalizedGlosses.length > 0,
    retry: false,
    staleTime: Infinity,
  });

  const handleFrameChange = useCallback((frame: number) => {
    if (!data) return;
    const index = data.segments.findIndex(
      (segment) => frame >= segment.start && frame < segment.end,
    );
    if (index >= 0 && index !== reportedSegment.current) {
      reportedSegment.current = index;
      setActiveSegment(index);
      onSegmentChange(index);
    }
  }, [data, onSegmentChange]);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (!normalizedGlosses.length) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-text-muted">
          Model Landmark Sequence
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono tabular-nums text-text-secondary">
            {data ? `${activeSegment + 1}/${data.segments.length}` : "—"}
          </span>
          <button
            type="button"
            onClick={onResetView}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-primary/50 hover:text-text-primary"
            aria-label="Reset simulation view"
            title="Reset simulation view"
          >
            <RotateCcw size={11} />
            Reset view
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="aspect-[16/10] w-full rounded-xl border border-border bg-background flex items-center justify-center text-xs font-mono text-text-muted">
          Loading model sequences...
        </div>
      ) : isError || !data ? (
        <div className="aspect-[16/10] w-full rounded-xl border border-status-error/30 bg-background flex items-center justify-center px-6 text-center text-xs font-mono text-status-error">
          Could not load every active-model landmark sequence.
        </div>
      ) : (
        <>
          <LandmarkSimulation
            frames={data.frames}
            pose={data.pose}
            faceMesh={data.faceMesh}
            fps={15}
            minimal
            loop={false}
            autoPlay={playing}
            restartToken={restartToken}
            onFrameChange={handleFrameChange}
            onComplete={handleComplete}
            horizontalOnly
            viewResetToken={viewResetToken}
          />
          <div
            className="grid gap-1.5 pt-1"
            style={{ gridTemplateColumns: `repeat(${data.segments.length}, minmax(0, 1fr))` }}
            aria-label="Model landmark sequence progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={data.segments.length}
            aria-valuenow={activeSegment + 1}
          >
            {data.segments.map((segment, index) => (
              <div
                key={`${segment.gloss}-${index}`}
                className="min-w-0"
                title={segment.gloss}
              >
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    index === activeSegment
                      ? "bg-accent-secondary"
                      : index < activeSegment
                      ? "bg-accent-primary"
                      : "bg-accent-primary/25"
                  }`}
                />
                <div className={`mt-1 truncate text-center text-[9px] font-mono ${
                  index === activeSegment ? "text-text-primary" : "text-text-muted"
                }`}>
                  {segment.gloss}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}