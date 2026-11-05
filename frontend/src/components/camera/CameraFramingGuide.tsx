"use client";

import React, { useEffect, useId, useState } from "react";

interface CameraFramingGuideProps {
  cameraActive: boolean;
}

/**
 * Framing guide drawn from the training skeleton.
 *
 * What the model needs in frame (see training_method.md):
 *  - face: forehead, mouth, chin
 *  - both shoulders and both elbows, clearly visible
 *  - every raised hand fully visible (all 21 points)
 *
 * A hand only counts as "in use" once it is above the rest line, which sits
 * 1.3 shoulder-widths below the shoulder midpoint. The figure below is built
 * on that same ratio: shoulder width 130, shoulder line y=160, rest line y=329.
 *
 * The figure is symmetric, so it is correct on the mirrored video as well.
 */

const INK = "rgba(255,255,255,0.82)";
const INK_SOFT = "rgba(255,255,255,0.45)";
const ACCENT = "var(--accent-primary, #22c55e)";

// Label text sits on moving video, so it gets a dark outline for legibility.
const labelProps = {
  fill: "rgba(255,255,255,0.95)",
  stroke: "rgba(0,0,0,0.65)",
  strokeWidth: 3,
  paintOrder: "stroke" as const,
  strokeLinejoin: "round" as const,
  fontSize: 15,
  fontWeight: 500,
};

function Hand() {
  // Simple open-hand line drawing, origin at the palm centre, ~56 units tall.
  return (
    <g
      fill="none"
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* palm */}
      <path d="M -13 12 C -17 5 -17 -2 -13 -8 L 13 -8 C 17 -2 17 5 13 12 C 8 21 -8 21 -13 12 Z" />
      {/* fingers */}
      <path d="M -9.5 -8 L -10.5 -29" />
      <path d="M -3 -8 L -3 -34" />
      <path d="M 3.5 -8 L 4.5 -31" />
      <path d="M 10 -6 L 13.5 -24" />
      {/* thumb */}
      <path d="M -13 2 C -19 -2 -23 -6 -26 -11" />
    </g>
  );
}

export function CameraFramingGuide({ cameraActive }: CameraFramingGuideProps) {
  const [visible, setVisible] = useState(false);
  const uid = useId().replace(/:/g, "");
  const maskId = `guide-mask-${uid}`;

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
      className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 640 400"
        className="h-full w-full [&_*]:[vector-effect:non-scaling-stroke]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
        fontFamily="inherit"
      >
        <defs>
          {/* Dims everything outside the safe area so the frame reads clearly. */}
          <mask id={maskId}>
            <rect width="640" height="400" fill="white" />
            <rect x="36" y="20" width="568" height="360" rx="18" fill="black" />
          </mask>
        </defs>

        <rect
          width="640"
          height="400"
          fill="rgba(0,0,0,0.38)"
          mask={`url(#${maskId})`}
        />

        {/* Safe-area corner brackets */}
        <g stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M36 50 V38 Q36 20 54 20 H66" />
          <path d="M574 20 H586 Q604 20 604 38 V50" />
          <path d="M36 350 V362 Q36 380 54 380 H66" />
          <path d="M604 350 V362 Q604 380 586 380 H574" />
        </g>

        {/* Torso: shoulder slopes and body sides, ending at the rest line */}
        <g stroke={INK_SOFT} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M308 148 C288 152 270 156 255 161" />
          <path d="M332 148 C352 152 370 156 385 161" />
          <path d="M255 161 C250 210 247 270 246 329" />
          <path d="M385 161 C390 210 393 270 394 329" />
        </g>

        {/* Head and neck */}
        <g stroke={INK} strokeWidth={1.75} strokeLinecap="round">
          <ellipse cx="320" cy="84" rx="32" ry="40" />
          <path d="M308 122 V148 M332 122 V148" stroke={INK_SOFT} />
        </g>

        {/* Face points used for training: forehead, mouth, chin */}
        <g fill={ACCENT}>
          <circle cx="320" cy="52" r="3" />
          <circle cx="320" cy="104" r="3" />
          <circle cx="320" cy="124" r="3" />
        </g>

        {/* Arms: shoulder to elbow to wrist */}
        <g stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M255 161 L226 250 L268 216" />
          <path d="M385 161 L414 250 L372 216" />
        </g>

        {/* Shoulder line */}
        <path d="M255 161 H385" stroke={INK} strokeWidth={2} strokeLinecap="round" />

        {/* Joints: shoulders and elbows */}
        <g fill="rgba(0,0,0,0.55)" stroke={INK} strokeWidth={2}>
          <circle cx="255" cy="161" r="4.5" />
          <circle cx="385" cy="161" r="4.5" />
          <circle cx="226" cy="250" r="4.5" />
          <circle cx="414" cy="250" r="4.5" />
        </g>

        {/* Hand zones */}
        <g stroke={ACCENT} strokeWidth={1.5} strokeDasharray="5 5" strokeLinecap="round">
          <circle cx="270" cy="196" r="40" />
          <circle cx="370" cy="196" r="40" />
        </g>
        <g transform="translate(270 200) scale(0.8)">
          <Hand />
        </g>
        <g transform="translate(370 200) scale(-0.8 0.8)">
          <Hand />
        </g>

        {/* Rest line: hands below this are treated as "not signing" */}
        <path
          d="M100 329 H540"
          stroke={INK_SOFT}
          strokeWidth={1.5}
          strokeDasharray="3 6"
          strokeLinecap="round"
        />
        <text x="100" y="321" {...labelProps} fontSize={13} fontWeight={400}>
          Rest line
        </text>

        {/* Labels with short leader lines */}
        <g stroke={INK_SOFT} strokeWidth={1} strokeLinecap="round">
          <path d="M354 84 H420" />
          <path d="M391 161 H452" />
          <path d="M420 250 H472" />
          <path d="M228 196 H180" />
        </g>
        <text x="426" y="89" {...labelProps}>Face</text>
        <text x="458" y="166" {...labelProps}>Shoulders</text>
        <text x="478" y="255" {...labelProps}>Elbows</text>
        <text x="174" y="201" textAnchor="end" {...labelProps}>Hands</text>

        {/* Instruction */}
        <text x="320" y="366" textAnchor="middle" {...labelProps}>
          Raise your hands above the line to sign
        </text>
      </svg>
    </div>
  );
}