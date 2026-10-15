"use client";

import React, { useEffect, useState } from "react";

interface CameraFramingGuideProps {
  cameraActive: boolean;
}

export function CameraFramingGuide({ cameraActive }: CameraFramingGuideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!cameraActive) {
      setVisible(false);
      return;
    }

    // Show guide as soon as camera turns on
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [cameraActive]);

  if (!cameraActive && !visible) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-between p-3 sm:p-4 transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* SVG Upper Body & Hand Zone Outline */}
      <svg
        viewBox="0 0 640 400"
        className="w-full h-full max-h-[90%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="guideGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer Signing Framing Boundary (Dashed) */}
        <rect
          x="70"
          y="25"
          width="500"
          height="340"
          rx="24"
          stroke="url(#guideGlow)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          className="opacity-70"
        />

        {/* Head Outline */}
        <ellipse
          cx="320"
          cy="92"
          rx="38"
          ry="48"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-80"
        />

        {/* Neck */}
        <path
          d="M 308 140 L 308 152 M 332 140 L 332 152"
          stroke="#22C55E"
          strokeWidth="1.5"
          className="opacity-60"
        />

        {/* Shoulders & Upper Body Outline */}
        <path
          d="M 308 152 C 275 158 220 180 195 200 C 190 205 198 260 215 315 L 425 315 C 442 260 450 205 445 200 C 420 180 365 158 332 152"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-75"
        />

        {/* Left Hand Articulation Zone */}
        <circle
          cx="175"
          cy="235"
          r="48"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="opacity-80"
        />
        <text
          x="175"
          y="240"
          fill="#A1A1AA"
          fontSize="11"
          fontFamily="monospace"
          textAnchor="middle"
          className="opacity-90"
        >
          HAND
        </text>

        {/* Right Hand Articulation Zone */}
        <circle
          cx="465"
          cy="235"
          r="48"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="opacity-80"
        />
        <text
          x="465"
          y="240"
          fill="#A1A1AA"
          fontSize="11"
          fontFamily="monospace"
          textAnchor="middle"
          className="opacity-90"
        >
          HAND
        </text>

        {/* Center Torso / Chest Signing Space */}
        <ellipse
          cx="320"
          cy="230"
          rx="52"
          ry="40"
          stroke="#6366F1"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="opacity-40"
        />
      </svg>

      {/* Instruction Badge */}
      <div className="bg-surface/90 border border-border/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
        <span className="text-[11px] font-mono text-text-primary tracking-wide">
          Keep your upper body and hands within this guide
        </span>
      </div>
    </div>
  );
}
