"use client";
import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface LandmarkSimulationProps {
  landmarkFrames?: number[][][]; // frames x points x 3
  showHands?: boolean;
  showFace?: boolean;
  showPose?: boolean;
  fps?: number;
}

export function LandmarkSimulation({
  landmarkFrames,
  showHands = true,
  showFace = true,
  showPose = true,
  fps = 30,
}: LandmarkSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Generate synthetic MediaPipe skeleton landmarks if none provided
  const totalFrames = landmarkFrames?.length || 60;

  useEffect(() => {
    if (!isPlaying) return;

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

    const t = (currentFrame / totalFrames) * Math.PI * 2;

    // Draw Pose (33 points subset) - Color Gray #6b7280 per spec
    if (showPose) {
      ctx.strokeStyle = "#6b7280";
      ctx.fillStyle = "#6b7280";
      ctx.lineWidth = 2;

      const nose = { x: width * 0.5, y: height * 0.28 };
      const leftShoulder = { x: width * 0.38, y: height * 0.42 };
      const rightShoulder = { x: width * 0.62, y: height * 0.42 };
      const leftElbow = { x: width * 0.32, y: height * 0.56 + Math.sin(t) * 15 };
      const rightElbow = { x: width * 0.68, y: height * 0.56 + Math.cos(t) * 15 };
      const leftWrist = { x: width * 0.35 + Math.sin(t * 2) * 20, y: height * 0.72 - Math.abs(Math.sin(t)) * 40 };
      const rightWrist = { x: width * 0.65 - Math.cos(t * 2) * 20, y: height * 0.72 - Math.abs(Math.cos(t)) * 40 };

      // Bones
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.lineTo(rightElbow.x, rightElbow.y);
      ctx.lineTo(rightWrist.x, rightWrist.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(leftElbow.x, leftElbow.y);
      ctx.lineTo(leftWrist.x, leftWrist.y);
      ctx.stroke();

      [nose, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw Face Mesh Points (Blue #3b82f6 per spec)
    if (showFace) {
      ctx.fillStyle = "#3b82f6";
      const faceCenter = { x: width * 0.5, y: height * 0.26 };
      for (let i = 0; i < 28; i++) {
        const angle = (i / 28) * Math.PI * 2;
        const fx = faceCenter.x + Math.cos(angle) * 32;
        const fy = faceCenter.y + Math.sin(angle) * 40;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      // Eyes and Mouth
      ctx.fillRect(faceCenter.x - 14, faceCenter.y - 8, 4, 2);
      ctx.fillRect(faceCenter.x + 10, faceCenter.y - 8, 4, 2);
      ctx.fillRect(faceCenter.x - 8, faceCenter.y + 14, 16, 2);
    }

    // Draw Hands (All 21 points per hand - Green #22c55e per spec)
    if (showHands) {
      ctx.strokeStyle = "#22c55e";
      ctx.fillStyle = "#22c55e";
      ctx.lineWidth = 1.5;

      const drawHand = (wristX: number, wristY: number, flip: boolean) => {
        const sign = flip ? -1 : 1;
        ctx.beginPath();
        ctx.arc(wristX, wristY, 5, 0, Math.PI * 2);
        ctx.fill();

        // 5 fingers, 4 segments each = 20 points + 1 wrist = 21 points
        for (let f = 0; f < 5; f++) {
          const fingerAngle = ((-40 + f * 20) * Math.PI) / 180;
          let prevX = wristX;
          let prevY = wristY;

          for (let seg = 1; seg <= 4; seg++) {
            const segDist = seg * 9;
            const px = wristX + Math.cos(fingerAngle) * segDist * sign + Math.sin(t + f) * (seg * 1.2);
            const py = wristY - Math.sin(fingerAngle) * segDist * 0.5 - seg * 8;

            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();

            prevX = px;
            prevY = py;
          }
        }
      };

      const leftWrist = { x: width * 0.35 + Math.sin(t * 2) * 20, y: height * 0.72 - Math.abs(Math.sin(t)) * 40 };
      const rightWrist = { x: width * 0.65 - Math.cos(t * 2) * 20, y: height * 0.72 - Math.abs(Math.cos(t)) * 40 };

      drawHand(leftWrist.x, leftWrist.y, false);
      drawHand(rightWrist.x, rightWrist.y, true);
    }
  }, [currentFrame, showHands, showFace, showPose, totalFrames]);

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

        {/* Overlay Metadata Panel per Section 8.5 */}
        <div className="absolute top-3 left-3 bg-surface/90 border border-border/80 px-2.5 py-1.5 rounded tech-mono text-[11px] text-text-secondary space-x-2">
          <span>Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong></span>
          <span>|</span>
          <span>FPS: <strong className="text-accent-primary">{fps}</strong></span>
          <span>|</span>
          <span>Hands: <strong className="text-status-approved">{showHands ? "2 (21 pts)" : "0"}</strong></span>
          <span>|</span>
          <span>Face: <strong className="text-accent-secondary">{showFace ? "Mesh Active" : "Off"}</strong></span>
          <span>|</span>
          <span>Pose: <strong className="text-text-primary">{showPose ? "True" : "False"}</strong></span>
        </div>
      </div>

      {/* Video Editor Timeline Controls per Section 8.5 */}
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
