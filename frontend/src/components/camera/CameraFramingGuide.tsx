"use client";

import React, { useEffect, useId, useState } from "react";

interface CameraFramingGuideProps {
  cameraActive: boolean;
}

export function CameraFramingGuide({ cameraActive }: CameraFramingGuideProps) {
  const [visible, setVisible] = useState(false);
  const uid = useId().replace(/:/g, "");
  const gradId = `guide-line-grad-${uid}`;
  const bodyGradId = `guide-body-grad-${uid}`;

  useEffect(() => {
    if (!cameraActive) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, [cameraActive]);

  if (!cameraActive && !visible) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 640 400"
        className="h-full w-full max-h-[82%] max-w-[78%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="160" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
            <stop offset="25%" stopColor="#22C55E" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#22C55E" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#22C55E" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={bodyGradId} x1="320" y1="64" x2="320" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(244,244,245,0.45)" />
            <stop offset="75%" stopColor="rgba(244,244,245,0.22)" />
            <stop offset="100%" stopColor="rgba(244,244,245,0)" />
          </linearGradient>
        </defs>

        {/* Soft corner brackets */}
        <g stroke="rgba(255,255,255,0.24)" strokeWidth={1.5} strokeLinecap="round">
          <path d="M128 54 V40 Q128 30 138 30 H154" />
          <path d="M486 30 H502 Q512 30 512 40 V54" />
          <path d="M128 330 V344 Q128 354 138 354 H154" />
          <path d="M486 354 H502 Q512 354 512 344 V330" />
        </g>

        {/* Clean upper-body silhouette */}
        <ellipse
          cx="320"
          cy="104"
          rx="32"
          ry="40"
          stroke={`url(#${bodyGradId})`}
          strokeWidth={1.6}
        />
        <path
          d="M232 288 C234 218 258 176 296 168 C306 166 312 162 312 154 M408 288 C406 218 382 176 344 168 C334 166 328 162 328 154"
          stroke={`url(#${bodyGradId})`}
          strokeWidth={1.6}
          strokeLinecap="round"
        />

        {/* Subtle glowing rest line */}
        <path
          d="M160 296 H480"
          stroke={`url(#${gradId})`}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
      </svg>

      {/* Sleek floating pill hint */}
      <div className="absolute bottom-6 rounded-full bg-black/45 px-4 py-1.5 text-xs font-medium text-text-primary backdrop-blur-md">
        Keep upper body in frame &amp; raise hands above the line
      </div>
    </div>
  );
}
