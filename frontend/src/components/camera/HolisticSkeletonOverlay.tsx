"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HolisticLandmarker,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";

interface HolisticSkeletonOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
  visible: boolean;
}

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/holistic_landmarker/holistic_landmarker/float16/latest/holistic_landmarker.task";

// Exact 11 training hand landmarks from training_method.md / training_data.svg
const HAND_TRAIN_IDX = [0, 1, 4, 5, 8, 9, 12, 13, 16, 17, 20];
const HAND_TRAIN_CHAINS: [number, number][] = [
  [0, 1],
  [1, 4],
  [0, 5],
  [5, 8],
  [0, 9],
  [9, 12],
  [0, 13],
  [13, 16],
  [0, 17],
  [17, 20],
  [5, 9],
  [9, 13],
  [13, 17],
];

// Upper-body pose only: shoulders (11,12), elbows (13,14), wrists (15,16) — no lower body
const POSE_TRAIN_IDX = [11, 12, 13, 14, 15, 16];
const POSE_TRAIN_CONNECTIONS: [number, number][] = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
];

function drawLine(
  ctx: CanvasRenderingContext2D,
  a: NormalizedLandmark | undefined,
  b: NormalizedLandmark | undefined,
  w: number,
  h: number,
  color: string,
  lineWidth: number
) {
  if (!a || !b) return;
  if ((a.visibility !== undefined && a.visibility < 0.35) ||
      (b.visibility !== undefined && b.visibility < 0.35)) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(a.x * w, a.y * h);
  ctx.lineTo(b.x * w, b.y * h);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  pt: NormalizedLandmark | undefined,
  w: number,
  h: number,
  radius: number,
  fill: string,
  stroke?: string
) {
  if (!pt) return;
  if (pt.visibility !== undefined && pt.visibility < 0.35) return;
  ctx.beginPath();
  ctx.arc(pt.x * w, pt.y * h, radius, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

export function HolisticSkeletonOverlay({
  videoRef,
  cameraActive,
  visible,
}: HolisticSkeletonOverlayProps) {
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<HolisticLandmarker | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );

  useEffect(() => {
    if (!cameraActive || !visible) return;
    if (landmarkerRef.current) {
      setStatus("ready");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        let landmarker: HolisticLandmarker;
        try {
          landmarker = await HolisticLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
            runningMode: "VIDEO",
            minFaceDetectionConfidence: 0.5,
            minPoseDetectionConfidence: 0.5,
          });
        } catch {
          landmarker = await HolisticLandmarker.createFromOptions(vision, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
            runningMode: "VIDEO",
            minFaceDetectionConfidence: 0.5,
            minPoseDetectionConfidence: 0.5,
          });
        }
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setStatus("ready");
      } catch (err) {
        console.warn("HolisticLandmarker unavailable:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [cameraActive, visible]);

  useEffect(() => {
    return () => {
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch {
          // ignore
        }
        landmarkerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    if (!cameraActive || !visible || status !== "ready") {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let rafId = 0;
    let lastVideoTime = -1;

    const renderLoop = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      const cvs = overlayCanvasRef.current;

      if (
        video &&
        landmarker &&
        cvs &&
        video.readyState >= 2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        video.currentTime !== lastVideoTime
      ) {
        lastVideoTime = video.currentTime;
        if (cvs.width !== video.videoWidth || cvs.height !== video.videoHeight) {
          cvs.width = video.videoWidth;
          cvs.height = video.videoHeight;
        }
        const ctx = cvs.getContext("2d");
        if (ctx) {
          const w = cvs.width;
          const h = cvs.height;
          ctx.clearRect(0, 0, w, h);
          try {
            const result = landmarker.detectForVideo(video, performance.now());

            // 1. Face: ONLY the 3 training points (forehead 10, mouth mid 13/14, chin 152)
            for (const faceLms of result.faceLandmarks ?? []) {
              const forehead = faceLms[10];
              const upperLip = faceLms[13];
              const lowerLip = faceLms[14];
              const chin = faceLms[152];
              const mouth: NormalizedLandmark | undefined =
                upperLip && lowerLip
                  ? {
                      x: (upperLip.x + lowerLip.x) / 2,
                      y: (upperLip.y + lowerLip.y) / 2,
                      z: (upperLip.z + lowerLip.z) / 2,
                      visibility: 1,
                    }
                  : undefined;

              drawLine(ctx, forehead, chin, w, h, "rgba(34, 197, 94, 0.25)", 1.5);
              drawDot(ctx, forehead, w, h, 3.5, "#22c55e");
              drawDot(ctx, mouth, w, h, 3.5, "#22c55e");
              drawDot(ctx, chin, w, h, 3.5, "#22c55e");
            }

            // 2. Upper-body pose ONLY: shoulders (11,12), elbows (13,14), wrists (15,16)
            for (const poseLms of result.poseLandmarks ?? []) {
              for (const [i, j] of POSE_TRAIN_CONNECTIONS) {
                drawLine(
                  ctx,
                  poseLms[i],
                  poseLms[j],
                  w,
                  h,
                  "rgba(244, 244, 245, 0.5)",
                  2
                );
              }
              for (const idx of POSE_TRAIN_IDX) {
                drawDot(ctx, poseLms[idx], w, h, 4, "#0a0f17", "#22c55e");
              }
            }

            // 3. Hands: ONLY the 11 training keypoints per hand
            for (const handLms of result.leftHandLandmarks ?? []) {
              for (const [i, j] of HAND_TRAIN_CHAINS) {
                drawLine(
                  ctx,
                  handLms[i],
                  handLms[j],
                  w,
                  h,
                  "rgba(34, 197, 94, 0.85)",
                  2
                );
              }
              for (const idx of HAND_TRAIN_IDX) {
                drawDot(ctx, handLms[idx], w, h, 3.2, "#22c55e", "#ecfdf5");
              }
            }
            for (const handLms of result.rightHandLandmarks ?? []) {
              for (const [i, j] of HAND_TRAIN_CHAINS) {
                drawLine(
                  ctx,
                  handLms[i],
                  handLms[j],
                  w,
                  h,
                  "rgba(99, 102, 241, 0.9)",
                  2
                );
              }
              for (const idx of HAND_TRAIN_IDX) {
                drawDot(ctx, handLms[idx], w, h, 3.2, "#818cf8", "#eef2ff");
              }
            }
          } catch {
            // Skip transient frame errors
          }
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [cameraActive, visible, status, videoRef]);

  if (!cameraActive || !visible) return null;

  return (
    <canvas
      ref={overlayCanvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1] object-cover"
      aria-hidden="true"
    />
  );
}

