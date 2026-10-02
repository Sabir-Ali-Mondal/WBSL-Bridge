"use client";
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { POSE_BODY_PAIRS, POSE_FACE_MARKERS, POSE_POINTS, type PosePoint } from "@/lib/pose";

const HAND_CONN: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10],
  [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18],
  [18, 19], [19, 20], [0, 17],
];

interface LandmarkSimulationProps {
  frames?: number[][][];              // F x 42 x 3
  // F x 33 x 4 (optional, 258-dim runs). Typed as a tuple rather than
  // number[][] because the visibility column is index 3 of every landmark and
  // the type is what keeps a plain (x, y, z) clip from being passed in and read
  // as though p[3] were a visibility score.
  pose?: PosePoint[][];
  fps?: number;
  title?: string;
}

export function LandmarkSimulation({
  frames,
  pose,
  fps = 15,
  title,
}: LandmarkSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const totalFrames = frames?.length ?? 0;

  useEffect(() => {
    if (!isPlaying || totalFrames === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, (1000 / fps) / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, fps, playbackSpeed, totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render ONLY real extracted landmarks. No synthetic fallback.
    const frame = frames?.[currentFrame];
    if (!frame) return;

    const S = width / 5;
    const cx = width / 2;
    const cy = height / 2;
    const px = (p: number[]) => cx + p[0] * S;
    const py = (p: number[]) => cy + p[1] * S;

    // Slot 0 = left hand (21 pts), slot 1 = right hand (21 pts)
    for (const off of [0, 21]) {
      const slot = frame.slice(off, off + 21);
      // A slot whose 21 points are all exactly zero is a MISSING hand, not a
      // hand at the origin: the extractor writes zeros when MediaPipe found no
      // signer hand in that slot. Drawing it would paint a real-looking
      // skeleton at the wrist, which is the one place a viewer would believe it.
      if (slot.every((p) => p[0] === 0 && p[1] === 0 && p[2] === 0)) continue;

      ctx.strokeStyle = off === 0 ? "#22c55e" : "#4ade80";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1.5;

      for (const [a, b] of HAND_CONN) {
        const p1 = frame[off + a];
        const p2 = frame[off + b];
        if (!p1 || !p2) continue;
        ctx.beginPath();
        ctx.moveTo(px(p1), py(p1));
        ctx.lineTo(px(p2), py(p2));
        ctx.stroke();
      }

      for (let i = 0; i < 21; i++) {
        const p = frame[off + i];
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(px(p), py(p), i === 0 ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Body layer, drawn after the hands so the torso reads as the backdrop.
    // Only 258-dim recordings have it; a 126-dim clip leaves `pose` undefined
    // and nothing is drawn -- a synthesised body would be a lie about the data.
    const pf = pose?.[currentFrame];
    if (pf) {
      ctx.strokeStyle = "#6366F1";
      ctx.fillStyle = "#818CF8";
      ctx.lineWidth = 2;

      for (const [a, b] of POSE_BODY_PAIRS) {
        const p1 = pf[a];
        const p2 = pf[b];
        // Visibility gate: BlazePose reports a low-confidence landmark for a
        // body part that is out of frame, and joining it to a confident one
        // draws a bone to nowhere.
        if (!p1 || !p2 || p1[3] < 0.5 || p2[3] < 0.5) continue;
        ctx.beginPath();
        ctx.moveTo(px(p1), py(p1));
        ctx.lineTo(px(p2), py(p2));
        ctx.stroke();
      }

      // Nose + mouth corners: the exact landmarks the NMM detector reads, so
      // the replay shows where the question/negation signal was measured.
      for (const i of POSE_FACE_MARKERS) {
        const p = pf[i];
        if (!p || p[3] < 0.5) continue;
        ctx.beginPath();
        ctx.arc(px(p), py(p), 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [currentFrame, frames, pose]);

  // Honest empty state: this sign simply has no extracted sequence yet.
  if (totalFrames === 0) {
    return (
      <div className="aspect-video w-full bg-background border border-border rounded-md flex flex-col items-center justify-center space-y-2">
        <Database size={28} className="text-text-muted" />
        <div className="text-xs font-mono text-text-secondary">NO LANDMARK DATA</div>
        <div className="text-[11px] text-text-muted max-w-xs text-center">
          No extracted sequence exists for this sign yet. Run training extraction or accept a community sample.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden flex flex-col">
      {/* Simulation Screen */}
      <div className="relative aspect-video w-full bg-background flex items-center justify-center canvas-grid-bg">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-contain"
        />

        {/* Overlay Metadata Panel */}
        <div className="absolute top-3 left-3 bg-surface/90 border border-border/80 px-2.5 py-1.5 rounded tech-mono text-[11px] text-text-secondary space-x-2">
          <span>Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong></span>
          <span>|</span>
          <span>FPS: <strong className="text-accent-primary">{fps}</strong></span>
          <span>|</span>
          <span>Hands: <strong className="text-status-approved">2 (21 pts each)</strong></span>
          {pose && (
            <>
              <span>|</span>
              <span>
                Pose: <strong className="text-[#818CF8]">{POSE_POINTS} pts</strong>
              </span>
            </>
          )}
          {title && (
            <>
              <span>|</span>
              <span className="text-accent-secondary">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="p-3 bg-surface-elevated/50 border-t border-border flex items-center justify-between tech-mono text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-surface hover:bg-surface-elevated border border-border text-text-primary"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => setCurrentFrame(0)}
            className="p-1.5 rounded bg-surface hover:bg-surface-elevated border border-border text-text-secondary hover:text-text-primary"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>

          <span className="text-text-muted text-[11px] ml-2">
            SPEED:
          </span>
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded text-[11px] border ${
                playbackSpeed === spd
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary font-bold"
                  : "bg-surface border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 mx-6 flex items-center">
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
            className="w-full accent-accent-primary bg-surface h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-[11px] text-text-secondary">
          {((currentFrame / fps)).toFixed(2)}s / {(totalFrames / fps).toFixed(2)}s
        </div>
      </div>
    </div>
  );
}
