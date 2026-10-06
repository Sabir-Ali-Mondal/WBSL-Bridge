"use client";
import React, {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, Database, ZoomIn, ZoomOut } from "lucide-react";
import {
  POSE_BODY_PAIRS,
  POSE_FACE_MARKERS,
  POSE_FACE_PAIRS,
  POSE_POINTS,
  type PosePoint,
} from "@/lib/pose";

/* ==========================================================================
 * 1. EXISTING DATA / ALIGNMENT LOGIC (unchanged)
 * ========================================================================== */

const HAND_CONN: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10],
  [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18],
  [18, 19], [19, 20], [0, 17],
];

const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

type Point2 = { x: number; y: number };

const EMPTY_POSE: PosePoint[] = Array.from(
  { length: POSE_POINTS },
  () => [0, 0, 0, 0],
);

const BODY_GUIDE: PosePoint[] = EMPTY_POSE.map((point) => [...point] as PosePoint);
const setGuidePoint = (index: number, x: number, y: number) => {
  BODY_GUIDE[index] = [x, y, 0, 1];
};
setGuidePoint(0, 0, -2.2);
setGuidePoint(2, -0.2, -2.25);
setGuidePoint(5, 0.2, -2.25);
setGuidePoint(7, -0.4, -2.1);
setGuidePoint(8, 0.4, -2.1);
setGuidePoint(9, -0.18, -1.95);
setGuidePoint(10, 0.18, -1.95);
setGuidePoint(11, -0.7, -1.25);
setGuidePoint(12, 0.7, -1.25);
setGuidePoint(13, -1.1, -0.65);
setGuidePoint(14, 1.1, -0.65);
setGuidePoint(15, -1.35, 0);
setGuidePoint(16, 1.35, 0);
setGuidePoint(23, -0.45, 0.55);
setGuidePoint(24, 0.45, 0.55);
setGuidePoint(25, -0.48, 1.65);
setGuidePoint(26, 0.48, 1.65);
setGuidePoint(27, -0.5, 2.8);
setGuidePoint(28, 0.5, 2.8);

const GUIDE_BODY_PAIRS = POSE_BODY_PAIRS.filter(
  ([a, b]) => ![0, 2, 5, 7, 9, 10].includes(a) && ![0, 2, 5, 7, 9, 10].includes(b),
);
const POSE_SKELETON_PAIRS = POSE_BODY_PAIRS.filter(
  ([a, b]) => !(a <= 10 && b <= 10),
);

const POSE_DRAW_THRESHOLD = 0.01;

const isMissingHand = (frame: number[][], offset: number) =>
  frame
    .slice(offset, offset + 21)
    .every((point) => point[0] === 0 && point[1] === 0 && point[2] === 0);

function handAnchor(frame: number[][]): Point2 {
  return isMissingHand(frame, 21)
    ? { x: BODY_GUIDE[15][0], y: BODY_GUIDE[15][1] }
    : { x: BODY_GUIDE[16][0], y: BODY_GUIDE[16][1] };
}

function validPoint(point: number[] | undefined | null): point is number[] {
  return Boolean(
    point && Number.isFinite(point[0]) && Number.isFinite(point[1]),
  );
}

interface PoseAlignment {
  center: Point2;
  scale: number;
}

function getPoseAlignments(pose: PosePoint[][]): PoseAlignment[] {
  const measurements = pose.map((frame) => {
    const shoulders = [frame[11], frame[12]];
    const hips = [frame[23], frame[24]];
    const visible = [...shoulders, ...hips].filter(
      (point) => point && point[3] >= POSE_DRAW_THRESHOLD && validPoint(point),
    );
    const centerPoints = visible.length ? visible : [frame[11], frame[12]].filter(Boolean);
    const center = centerPoints.reduce(
      (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
      { x: 0, y: 0 },
    );
    center.x /= centerPoints.length || 1;
    center.y /= centerPoints.length || 1;

    const shoulderCenter = {
      x: (frame[11]?.[0] + frame[12]?.[0]) / 2,
      y: (frame[11]?.[1] + frame[12]?.[1]) / 2,
    };
    const hipCenter = {
      x: (frame[23]?.[0] + frame[24]?.[0]) / 2,
      y: (frame[23]?.[1] + frame[24]?.[1]) / 2,
    };
    const torsoLength = Math.hypot(
      shoulderCenter.x - hipCenter.x,
      shoulderCenter.y - hipCenter.y,
    );
    return { center, torsoLength };
  });

  const validLengths = measurements
    .map(({ torsoLength }) => torsoLength)
    .filter((length) => Number.isFinite(length) && length > 0.1);
  const referenceLength =
    validLengths.reduce((sum, length) => sum + length, 0) /
      (validLengths.length || 1);

  return measurements.map(({ center, torsoLength }) => ({
    center,
    scale:
      Number.isFinite(torsoLength) && torsoLength > 0.1
        ? referenceLength / torsoLength
        : 1,
  }));
}

function stabilizePoint(point: number[], alignment: PoseAlignment): Point2 {
  return {
    x: (point[0] - alignment.center.x) * alignment.scale,
    y: (point[1] - alignment.center.y) * alignment.scale,
  };
}

function averagePoints(points: number[][]): Point2 | null {
  const valid = points.filter(validPoint);
  if (valid.length === 0) return null;
  const total = valid.reduce(
    (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
    { x: 0, y: 0 },
  );
  return { x: total.x / valid.length, y: total.y / valid.length };
}

function sortedPair(points: Point2[]): Point2[] {
  return [...points].sort((a, b) => a.x - b.x);
}

function alignFaceMeshToPose(
  face: number[][],
  pose: PosePoint[],
): Point2[] {
  const sourceNose = face[4];
  const targetNose = pose[0];
  if (!validPoint(sourceNose) || !validPoint(targetNose)) return [];

  const faceEyes = [
    averagePoints([face[33], face[133]].filter(validPoint)),
    averagePoints([face[362], face[263]].filter(validPoint)),
  ].filter((point): point is Point2 => point !== null);
  const poseEyes = [
    averagePoints([pose[1], pose[2], pose[3]].filter(validPoint)),
    averagePoints([pose[4], pose[5], pose[6]].filter(validPoint)),
  ].filter((point): point is Point2 => point !== null);

  const anchors: [Point2, Point2][] = [[
    { x: sourceNose[0], y: sourceNose[1] },
    { x: targetNose[0], y: targetNose[1] },
  ]];
  const sourceEyes = sortedPair(faceEyes);
  const targetEyes = sortedPair(poseEyes);
  for (let index = 0; index < Math.min(sourceEyes.length, targetEyes.length); index++) {
    anchors.push([sourceEyes[index], targetEyes[index]]);
  }
  const sourceMouth = sortedPair(
    [face[61], face[291]].filter(validPoint).map(([x, y]) => ({ x, y })),
  );
  const targetMouth = sortedPair(
    [pose[9], pose[10]].filter(validPoint).map((point) => ({ x: point[0], y: point[1] })),
  );
  for (let index = 0; index < Math.min(sourceMouth.length, targetMouth.length); index++) {
    anchors.push([sourceMouth[index], targetMouth[index]]);
  }

  if (anchors.length < 2) return [];

  const sourceCenter = anchors.reduce(
    (sum, [source]) => ({ x: sum.x + source.x, y: sum.y + source.y }),
    { x: 0, y: 0 },
  );
  const targetCenter = anchors.reduce(
    (sum, [, target]) => ({ x: sum.x + target.x, y: sum.y + target.y }),
    { x: 0, y: 0 },
  );
  sourceCenter.x /= anchors.length;
  sourceCenter.y /= anchors.length;
  targetCenter.x /= anchors.length;
  targetCenter.y /= anchors.length;

  let denominator = 0;
  let coefficientA = 0;
  let coefficientB = 0;
  for (const [source, target] of anchors) {
    const x = source.x - sourceCenter.x;
    const y = source.y - sourceCenter.y;
    const targetX = target.x - targetCenter.x;
    const targetY = target.y - targetCenter.y;
    denominator += x * x + y * y;
    coefficientA += x * targetX + y * targetY;
    coefficientB += x * targetY - y * targetX;
  }
  if (denominator < 1e-8) return [];
  coefficientA /= denominator;
  coefficientB /= denominator;

  return face.map((point) => {
    if (!validPoint(point)) return { x: Number.NaN, y: Number.NaN };
    const [x, y] = point;
    const centeredX = x - sourceCenter.x;
    const centeredY = y - sourceCenter.y;
    return {
      x:
        targetCenter.x +
        coefficientA * centeredX -
        coefficientB * centeredY,
      y:
        targetCenter.y +
        coefficientB * centeredX +
        coefficientA * centeredY,
    };
  });
}

/* ==========================================================================
 * 2. 3D: CONSTANTS, TYPES, FACE TOPOLOGY
 * ========================================================================== */

type PairList = ReadonlyArray<readonly [number, number]>;

const THRESH = POSE_DRAW_THRESHOLD;
const TORSO_WORLD = 1.8; // shoulder-centre -> hip-centre length in world units
const Z_POSE = 0.15; // MediaPipe z is relative and noisy: kept small so the body stays upright
const Z_HAND = 0.5;
const Z_FACE = 0.5;
const Z_LIMIT = 0.4; // world-unit clamp on body depth offset
const SNAP_MAX_TORSOS = 1.0; // max xy gap (in torsos) between hand wrist and pose wrist to snap
const FOV = 38;
const HEAD_LEN = 11; // [valid, cx, cy, cz, w, h, d, nx, ny, nz, roll]

const COLOR = {
  torso: "#7C83F5",
  arm: "#8B93FA",
  leg: "#6870C9",
  other: "#7A80D6",
  joint: "#B4B9FF",
  volume: "#8E96F2",
  handLeft: "#5EEAD4",
  handRight: "#C4B5FD",
  face: "#38BDF8",
  faceKey: "#BAE6FD",
} as const;

const isHandStub = (i: number) => i >= 17 && i <= 22; // pose-model hand stubs; real hands replace them
const RIG_POSE_PAIRS: PairList = POSE_SKELETON_PAIRS.filter(
  ([a, b]) => !isHandStub(a) && !isHandStub(b),
);
const RIG_GUIDE_PAIRS: PairList = GUIDE_BODY_PAIRS.filter(
  ([a, b]) => !isHandStub(a) && !isHandStub(b),
);
const POSE_FACE_JOINTS: number[] = Array.from(
  new Set<number>([...POSE_FACE_MARKERS, ...POSE_FACE_PAIRS.flat()]),
);

const BODY_JOINT_RADIUS: Record<number, number> = {
  11: 0.075, 12: 0.075, 13: 0.06, 14: 0.06, 15: 0.046, 16: 0.046,
  23: 0.08, 24: 0.08, 25: 0.066, 26: 0.066, 27: 0.05, 28: 0.05,
};
const DEFAULT_BODY_JOINT_RADIUS = 0.034;
const bodyJointRadius = (i: number) => BODY_JOINT_RADIUS[i] ?? DEFAULT_BODY_JOINT_RADIUS;

const FINGER_TIPS = [4, 8, 12, 16, 20];
const HAND_JOINT_RADIUS: number[] = Array.from({ length: 21 }, (_, i) =>
  i === 0 ? 0.032 : FINGER_TIPS.includes(i) ? 0.019 : [1, 5, 9, 13, 17].includes(i) ? 0.024 : 0.02,
);
const HAND_BONE_RADIUS: number[] = HAND_CONN.map(
  ([a, b]) => Math.min(HAND_JOINT_RADIUS[a], HAND_JOINT_RADIUS[b]) * 0.62,
);
const PALM_FAN = [0, 1, 5, 9, 13, 17];
const PALM_INDICES = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5];

/** Sparse, clean face topology (no 468-point spiderweb). */
const FACE_LOOPS: { idx: number[]; closed: boolean }[] = [
  { idx: FACE_OVAL_INDICES, closed: true },
  { idx: [33, 160, 158, 133, 153, 144], closed: true },
  { idx: [362, 385, 387, 263, 373, 380], closed: true },
  { idx: [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185], closed: true },
  { idx: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191], closed: true },
  { idx: [70, 63, 105, 66, 107], closed: false },
  { idx: [336, 296, 334, 293, 300], closed: false },
  { idx: [168, 6, 197, 195, 5, 4], closed: false },
  { idx: [98, 97, 2, 326, 327], closed: false },
];
const FACE_SLOTS: number[] = [];
const FACE_SLOT_OF = new Map<number, number>();
const slotOf = (landmark: number): number => {
  let slot = FACE_SLOT_OF.get(landmark);
  if (slot === undefined) {
    slot = FACE_SLOTS.length;
    FACE_SLOTS.push(landmark);
    FACE_SLOT_OF.set(landmark, slot);
  }
  return slot;
};
const FACE_SEGMENTS: number[] = []; // flat [slotA, slotB, ...]
for (const { idx, closed } of FACE_LOOPS) {
  for (let k = 0; k < idx.length - 1; k++) FACE_SEGMENTS.push(slotOf(idx[k]), slotOf(idx[k + 1]));
  if (closed) FACE_SEGMENTS.push(slotOf(idx[idx.length - 1]), slotOf(idx[0]));
}
const FACE_OVAL_SLOTS = FACE_OVAL_INDICES.map(slotOf);
const FACE_KEY_SLOTS = [33, 133, 362, 263, 4, 61, 291, 13, 14, 105, 334, 152].map(slotOf);
const EYE_L = slotOf(33);
const EYE_R = slotOf(263);
const SLOT_NOSE = slotOf(4);
const SLOT_TEMPLE_A = slotOf(234);
const SLOT_TEMPLE_B = slotOf(454);

interface Bounds {
  minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
}
const emptyBounds = (): Bounds => ({
  minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity,
});
function growBounds(b: Bounds, x: number, y: number, z: number): void {
  if (x < b.minX) b.minX = x;
  if (x > b.maxX) b.maxX = x;
  if (y < b.minY) b.minY = y;
  if (y > b.maxY) b.maxY = y;
  if (z < b.minZ) b.minZ = z;
  if (z > b.maxZ) b.maxZ = z;
}

/** One pre-solved frame in WORLD space (x right, y up, z toward the viewer). */
interface SolvedFrame {
  hasPose: boolean;
  pose: Float32Array; // POSE_POINTS * [x, y, z, visibility]  (visibility 0 = hidden)
  hands: Float32Array; // 2 * 21 * [x, y, z, valid]
  handPresent: [boolean, boolean];
  dense: boolean;
  face: Float32Array; // FACE_SLOTS.length * [x, y, z, valid]
  head: Float32Array; // see HEAD_LEN
}
interface SolvedSequence {
  frames: SolvedFrame[];
  bounds: Bounds;
}

/* ==========================================================================
 * 3. 3D: COORDINATE CONVERSION + SEQUENCE SOLVER (reuses existing alignment)
 * ========================================================================== */

/**
 * MediaPipe/2D-viewer convention: x right, y DOWN, z negative = toward camera.
 * World convention: x right, y UP, z positive = toward the viewer (camera sits on +z).
 * x is intentionally NOT mirrored, so left/right matches the existing 2D viewer exactly.
 */
function writeWorld(
  out: Float32Array, o: number, x: number, y: number, z: number, scale: number,
): void {
  out[o] = x * scale;
  out[o + 1] = -y * scale;
  out[o + 2] = -z * scale;
}

function medianTorso(pose: PosePoint[][] | undefined, alignments: PoseAlignment[] | undefined): number {
  if (!pose?.length || !alignments) return TORSO_WORLD;
  const values: number[] = [];
  pose.forEach((frame, i) => {
    const ok = [11, 12, 23, 24].every(
      (k) => frame[k] && validPoint(frame[k]) && frame[k][3] >= THRESH,
    );
    if (!ok) return;
    const length =
      Math.hypot(
        (frame[11][0] + frame[12][0]) / 2 - (frame[23][0] + frame[24][0]) / 2,
        (frame[11][1] + frame[12][1]) / 2 - (frame[23][1] + frame[24][1]) / 2,
      ) * (alignments[i]?.scale ?? 1);
    if (Number.isFinite(length) && length > 0.02) values.push(length);
  });
  if (!values.length) return 0.3;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

interface SolveContext {
  scale: number;
  bounds: Bounds;
  hasDenseConnections: boolean;
}

function poseHeadFallback(pose: Float32Array, head: Float32Array): void {
  const vis = (i: number) => pose[i * 4 + 3] >= THRESH;
  let cx: number, cy: number, cz: number, w: number, roll = 0;
  if (vis(7) && vis(8)) {
    const dx = pose[8 * 4] - pose[7 * 4];
    const dy = pose[8 * 4 + 1] - pose[7 * 4 + 1];
    const dz = pose[8 * 4 + 2] - pose[7 * 4 + 2];
    w = Math.max(Math.hypot(dx, dy, dz) * 0.95, 0.2);
    cx = (pose[7 * 4] + pose[8 * 4]) / 2;
    cy = (pose[7 * 4 + 1] + pose[8 * 4 + 1]) / 2;
    cz = (pose[7 * 4 + 2] + pose[8 * 4 + 2]) / 2;
    roll = dx < 0 ? Math.atan2(-dy, -dx) : Math.atan2(dy, dx);
  } else if (vis(0)) {
    w = 0.54;
    cx = pose[0];
    cy = pose[1] + 0.04;
    cz = pose[2] - 0.4 * w * 1.1;
  } else {
    return;
  }
  w *= 0.85;
  const h = w * 1.2;
  const d = w * 0.8;
  head.set([1, cx, cy, cz, w, h, d, cx, cy - h * 0.5, 0, roll]);
}

/* ---- Manual neck tuning (world units; the torso is 1.8 tall) -------------
 * NECK_LENGTH : visible neck height, from the shoulder line up to the chin.
 *               Smaller = shorter neck (head sits lower), larger = longer.
 * NECK_RADIUS : thickness of the neck bone at the shoulders.
 * ------------------------------------------------------------------------ */
const NECK_LENGTH = 0.2;
const NECK_RADIUS = 0.1;

/** Seats the head at exactly NECK_LENGTH above the shoulders, with a vertical neck (hands never move). */
function seatHead(pose: Float32Array, face: Float32Array, head: Float32Array): void {
  if (head[0] === 0 || pose[11 * 4 + 3] < THRESH || pose[12 * 4 + 3] < THRESH) return;
  const shoulderX = (pose[11 * 4] + pose[12 * 4]) / 2;
  const shoulderY = (pose[11 * 4 + 1] + pose[12 * 4 + 1]) / 2;
  const dx = head[7] - shoulderX;
  const dy = head[8] - shoulderY - NECK_LENGTH; // exact neck height, up or down
  head[1] -= dx; head[7] -= dx;
  head[2] -= dy; head[8] -= dy;
  for (let k = 0; k < FACE_SLOTS.length; k++) {
    if (face[k * 4 + 3] !== 1) continue;
    face[k * 4] -= dx;
    face[k * 4 + 1] -= dy;
  }
  for (let i = 0; i <= 10; i++) {
    if (pose[i * 4 + 3] < THRESH) continue;
    pose[i * 4] -= dx;
    pose[i * 4 + 1] -= dy;
  }
}

function solveFrame(
  ctx: SolveContext,
  frame: number[][],
  poseFrame: PosePoint[] | undefined,
  alignment: PoseAlignment | undefined,
  alignedFace: Point2[] | undefined,
  rawFace: number[][] | undefined,
): SolvedFrame {
  const S = ctx.scale;
  const hasPose = Boolean(poseFrame);
  const pf = poseFrame ?? BODY_GUIDE;

  /* ---- body (existing stabilization, plus conservative depth) ---- */
  let zc = 0;
  if (hasPose) {
    const zs = [11, 12]
      .map((i) => pf[i])
      .filter((p) => p && validPoint(p) && p[3] >= THRESH && Number.isFinite(p[2]));
    if (zs.length) zc = zs.reduce((s, p) => s + p[2], 0) / zs.length;
  }
  const zLimit = Z_LIMIT / S;
  const zScale = (alignment?.scale ?? 1) * Z_POSE;
  const pose = new Float32Array(POSE_POINTS * 4);
  const poseMpZ = new Float32Array(POSE_POINTS);
  for (let i = 0; i < POSE_POINTS; i++) {
    const p = pf[i];
    if (!p || !validPoint(p) || !(p[3] >= THRESH)) continue;
    const xy = alignment ? stabilizePoint(p, alignment) : { x: p[0], y: p[1] };
    // Head, torso and legs stay on one upright plane (their MediaPipe depth only
    // makes the body lean/bend); arms and hands keep depth relative to the shoulders.
    const isArm = i >= 13 && i <= 22;
    const rawZ = hasPose && isArm && Number.isFinite(p[2]) ? (p[2] - zc) * zScale : 0;
    const z = Math.max(-zLimit, Math.min(zLimit, rawZ));
    poseMpZ[i] = z;
    writeWorld(pose, i * 4, xy.x, xy.y, z, S);
    pose[i * 4 + 3] = p[3];
  }

  /* ---- hands (all 21 landmarks each, same space as the pose) ---- */
  const hands = new Float32Array(2 * 21 * 4);
  const handPresent: [boolean, boolean] = [false, false];
  const handOffset = hasPose ? { x: 0, y: 0 } : handAnchor(frame);
  const handScale = alignment?.scale ?? 1;
  ([0, 21] as const).forEach((off, slot) => {
    if (isMissingHand(frame, off)) return;
    handPresent[slot] = true;
    const wristIdx = slot === 0 ? 15 : 16; // left hand -> pose 15, right hand -> pose 16
    const ref = [wristIdx, wristIdx - 2].find((i) => pose[i * 4 + 3] >= THRESH);
    const baseZ = ref !== undefined ? poseMpZ[ref] : 0;
    for (let j = 0; j < 21; j++) {
      const p = frame[off + j];
      if (!validPoint(p)) continue;
      const tx = p[0] + handOffset.x;
      const ty = p[1] + handOffset.y;
      const sx = alignment ? (tx - alignment.center.x) * alignment.scale : tx;
      const sy = alignment ? (ty - alignment.center.y) * alignment.scale : ty;
      const rz = Number.isFinite(p[2]) ? p[2] : 0;
      const o = (slot * 21 + j) * 4;
      writeWorld(hands, o, sx, sy, baseZ + rz * handScale * Z_HAND, S);
      hands[o + 3] = 1;
    }
    // Attach: the pose wrist follows the real hand wrist, so the forearm always
    // reaches the hand and the captured sign itself is never moved or distorted.
    const w = slot * 21 * 4;
    if (hands[w + 3] === 1) {
      const pi = wristIdx * 4;
      const gap = Math.hypot(hands[w] - pose[pi], hands[w + 1] - pose[pi + 1]);
      if (pose[pi + 3] < THRESH || gap < SNAP_MAX_TORSOS * TORSO_WORLD) {
        pose[pi] = hands[w];
        pose[pi + 1] = hands[w + 1];
        pose[pi + 2] = hands[w + 2];
        pose[pi + 3] = Math.max(pose[pi + 3], 0.8);
      }
    }
  });

  /* ---- face + head ---- */
  const face = new Float32Array(FACE_SLOTS.length * 4);
  const head = new Float32Array(HEAD_LEN);
  let dense = false;
  if (ctx.hasDenseConnections && alignedFace?.length && rawFace) {
    dense = true;
    let ratio = 1;
    const r1 = rawFace[234], r2 = rawFace[454], a1 = alignedFace[234], a2 = alignedFace[454];
    if (validPoint(r1) && validPoint(r2) && a1 && a2 && Number.isFinite(a1.x) && Number.isFinite(a2.x)) {
      const rawWidth = Math.hypot(r2[0] - r1[0], r2[1] - r1[1]);
      if (rawWidth > 1e-4) ratio = Math.hypot(a2.x - a1.x, a2.y - a1.y) / rawWidth;
    }
    const noseZ = Number.isFinite(rawFace[4]?.[2]) ? rawFace[4][2] : 0;
    const baseZ = pose[3] >= THRESH ? poseMpZ[0] : 0;
    for (let k = 0; k < FACE_SLOTS.length; k++) {
      const ap = alignedFace[FACE_SLOTS[k]];
      const rp = rawFace[FACE_SLOTS[k]];
      if (!ap || !Number.isFinite(ap.x) || !Number.isFinite(ap.y) || !rp) continue;
      const rz = Number.isFinite(rp[2]) ? rp[2] - noseZ : 0;
      writeWorld(face, k * 4, ap.x, ap.y, baseZ + rz * ratio * Z_FACE, S);
      face[k * 4 + 3] = 1;
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, sumZ = 0, n = 0;
    for (const slot of FACE_OVAL_SLOTS) {
      const o = slot * 4;
      if (face[o + 3] < 1) continue;
      minX = Math.min(minX, face[o]); maxX = Math.max(maxX, face[o]);
      minY = Math.min(minY, face[o + 1]); maxY = Math.max(maxY, face[o + 1]);
      sumZ += face[o + 2]; n++;
    }
    if (n >= 8) {
      const w = (maxX - minX) * 0.9, h = (maxY - minY) * 0.95, d = w * 0.8;
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = sumZ / n - 0.3 * d;
      let roll = 0;
      if (face[EYE_L * 4 + 3] === 1 && face[EYE_R * 4 + 3] === 1) {
        let dx = face[EYE_R * 4] - face[EYE_L * 4];
        let dy = face[EYE_R * 4 + 1] - face[EYE_L * 4 + 1];
        if (dx < 0) { dx = -dx; dy = -dy; }
        roll = Math.atan2(dy, dx);
      }
      head.set([1, cx, cy, cz, w, h, d, cx, minY, 0, roll]); // neck ends at the chin, not inside the face
    }
  }
  if (head[0] === 0) poseHeadFallback(pose, head);
  seatHead(pose, face, head);

  /* ---- bounds for auto-framing (hands count) ---- */
  const b = ctx.bounds;
  for (let i = 0; i < POSE_POINTS; i++) {
    if (pose[i * 4 + 3] >= THRESH && !isHandStub(i)) growBounds(b, pose[i * 4], pose[i * 4 + 1], pose[i * 4 + 2]);
  }
  for (let i = 0; i < 42; i++) {
    if (hands[i * 4 + 3] === 1) growBounds(b, hands[i * 4], hands[i * 4 + 1], hands[i * 4 + 2]);
  }
  if (head[0] > 0) {
    growBounds(b, head[1] - head[4] / 2, head[2] - head[5] / 2, head[3]);
    growBounds(b, head[1] + head[4] / 2, head[2] + head[5] / 2, head[3] + head[6] / 2);
  }
  void SLOT_NOSE; void SLOT_TEMPLE_A; void SLOT_TEMPLE_B;
  return { hasPose, pose, hands, handPresent, dense, face, head };
}

function solveSequence(
  frames: number[][][],
  pose: PosePoint[][] | undefined,
  alignments: PoseAlignment[] | undefined,
  alignedFaces: Point2[][] | undefined,
  faceMesh: number[][][] | undefined,
  hasDenseConnections: boolean,
): SolvedSequence {
  const ctx: SolveContext = {
    scale: TORSO_WORLD / medianTorso(pose, alignments),
    bounds: emptyBounds(),
    hasDenseConnections,
  };
  const solved = frames.map((frame, f) =>
    solveFrame(ctx, frame, pose?.[f], alignments?.[f], alignedFaces?.[f], faceMesh?.[f]),
  );
  return { frames: solved, bounds: ctx.bounds };
}

/* ==========================================================================
 * 4. 3D: FRAME SAMPLING (interpolation + visual smoothing, no allocations)
 * ========================================================================== */

interface SampleState {
  pose: Float32Array; // POSE_POINTS * 4
  poseInit: Uint8Array;
  hands: [Float32Array, Float32Array]; // 21 * 3 each
  handValid: [Uint8Array, Uint8Array];
  handInit: Uint8Array;
  handAlpha: Float32Array;
  face: Float32Array; // FACE_SLOTS.length * 3
  faceValid: Uint8Array;
  faceInit: Uint8Array;
  head: Float32Array;
  headValid: boolean;
  headInit: boolean;
  dense: boolean;
  hasPose: boolean;
}
type SampleRef = { current: SampleState };

function createSampleState(): SampleState {
  const faceCount = FACE_SLOTS.length;
  return {
    pose: new Float32Array(POSE_POINTS * 4),
    poseInit: new Uint8Array(POSE_POINTS),
    hands: [new Float32Array(63), new Float32Array(63)],
    handValid: [new Uint8Array(21), new Uint8Array(21)],
    handInit: new Uint8Array(2),
    handAlpha: new Float32Array(2),
    face: new Float32Array(faceCount * 3),
    faceValid: new Uint8Array(faceCount),
    faceInit: new Uint8Array(faceCount),
    head: new Float32Array(HEAD_LEN),
    headValid: false,
    headInit: false,
    dense: false,
    hasPose: false,
  };
}

const _t = new Float32Array(4);

/** Blends landmark i of two solved frames into _t. Returns false if neither frame has it. */
function blendSource(A: Float32Array, B: Float32Array, i: number, a: number, minW: number): boolean {
  const o = i * 4;
  const okA = A[o + 3] >= minW;
  const okB = B[o + 3] >= minW;
  if (!okA && !okB) return false;
  if (okA && okB) {
    for (let k = 0; k < 4; k++) _t[k] = A[o + k] + (B[o + k] - A[o + k]) * a;
  } else {
    const src = okA ? A : B;
    for (let k = 0; k < 4; k++) _t[k] = src[o + k];
  }
  return true;
}

function easeInto(dst: Float32Array, o: number, init: boolean, kxy: number, kz: number): void {
  if (!init) {
    dst[o] = _t[0]; dst[o + 1] = _t[1]; dst[o + 2] = _t[2];
    return;
  }
  dst[o] += (_t[0] - dst[o]) * kxy;
  dst[o + 1] += (_t[1] - dst[o + 1]) * kxy;
  dst[o + 2] += (_t[2] - dst[o + 2]) * kz; // depth is smoothed harder: it is the noisy axis
}

function sampleFrame(
  seq: SolvedSequence, st: SampleState, playhead: number, delta: number, snap: boolean,
): void {
  const n = seq.frames.length;
  const i0 = Math.min(Math.max(Math.floor(playhead), 0), n - 1);
  const i1 = Math.min(i0 + 1, n - 1);
  const a = i1 === i0 ? 0 : playhead - i0;
  const f0 = seq.frames[i0];
  const f1 = seq.frames[i1];
  const kxy = snap ? 1 : 1 - Math.exp(-delta * 40);
  const kz = snap ? 1 : 1 - Math.exp(-delta * 14);

  for (let i = 0; i < POSE_POINTS; i++) {
    const o = i * 4;
    if (!blendSource(f0.pose, f1.pose, i, a, THRESH)) {
      st.pose[o + 3] = 0;
      st.poseInit[i] = 0;
      continue;
    }
    easeInto(st.pose, o, st.poseInit[i] === 1, kxy, kz);
    st.pose[o + 3] = _t[3];
    st.poseInit[i] = 1;
  }
  st.hasPose = (a < 0.5 ? f0 : f1).hasPose;

  for (let h = 0; h < 2; h++) {
    const present = f0.handPresent[h] || f1.handPresent[h];
    if (present && st.handAlpha[h] < 0.08) st.handInit[h] = 0;
    const target = present ? 1 : 0;
    st.handAlpha[h] = snap
      ? target
      : st.handAlpha[h] + (target - st.handAlpha[h]) * (1 - Math.exp(-delta * (present ? 16 : 5)));
    if (!present) continue; // missing hand: hold last valid landmarks while fading out
    const pts = st.hands[h];
    const valid = st.handValid[h];
    const init = st.handInit[h] === 1;
    for (let j = 0; j < 21; j++) {
      if (!blendSource(f0.hands, f1.hands, h * 21 + j, a, 0.5)) {
        valid[j] = 0;
        continue;
      }
      valid[j] = 1;
      easeInto(pts, j * 3, init, kxy, kz);
    }
    st.handInit[h] = 1;
  }

  st.dense = (a < 0.5 ? f0 : f1).dense;
  if (st.dense) {
    for (let k = 0; k < FACE_SLOTS.length; k++) {
      if (!blendSource(f0.face, f1.face, k, a, 0.5)) {
        st.faceValid[k] = 0;
        st.faceInit[k] = 0;
        continue;
      }
      st.faceValid[k] = 1;
      easeInto(st.face, k * 3, st.faceInit[k] === 1, kxy, kz);
      st.faceInit[k] = 1;
    }
  }

  const v0 = f0.head[0] > 0;
  const v1 = f1.head[0] > 0;
  st.headValid = v0 || v1;
  if (st.headValid) {
    const kh = snap ? 1 : 1 - Math.exp(-delta * 25);
    for (let k = 1; k < HEAD_LEN; k++) {
      const t = v0 && v1 ? f0.head[k] + (f1.head[k] - f0.head[k]) * a : v0 ? f0.head[k] : f1.head[k];
      st.head[k] = st.headInit ? st.head[k] + (t - st.head[k]) * kh : t;
    }
    st.headInit = true;
  } else {
    st.headInit = false;
  }
}

/* ==========================================================================
 * 5. 3D: SHARED THREE HELPERS (reused objects, zero per-frame allocation)
 * ========================================================================== */

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _d = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _c = new THREE.Color();
const _zero = new THREE.Matrix4().makeScale(0, 0, 0);
const _sa = new Float32Array(3);
const _sb = new Float32Array(3);

let boneGeometry: THREE.CylinderGeometry | null = null;
let jointGeometry: THREE.SphereGeometry | null = null;
let headGeometry: THREE.SphereGeometry | null = null;
// Unit-height, slightly tapered cylinder (thick end = start of the bone).
const getBoneGeometry = () => (boneGeometry ??= new THREE.CylinderGeometry(0.78, 1, 1, 14, 1, false));
const getJointGeometry = () => (jointGeometry ??= new THREE.SphereGeometry(1, 18, 14));
const getHeadGeometry = () => (headGeometry ??= new THREE.SphereGeometry(1, 36, 26));

/** Orients a unit cylinder from A to B: midpoint, direction, length -> quaternion/scale. */
function placeBone(
  mesh: THREE.InstancedMesh, index: number,
  A: ArrayLike<number>, ao: number, B: ArrayLike<number>, bo: number, radius: number,
): void {
  _d.set(B[bo] - A[ao], B[bo + 1] - A[ao + 1], B[bo + 2] - A[ao + 2]);
  const length = _d.length();
  if (length < 1e-5) {
    mesh.setMatrixAt(index, _zero);
    return;
  }
  _d.multiplyScalar(1 / length);
  _q.setFromUnitVectors(_up, _d);
  _p.set((A[ao] + B[bo]) / 2, (A[ao + 1] + B[bo + 1]) / 2, (A[ao + 2] + B[bo + 2]) / 2);
  _s.set(radius, length, radius);
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(index, _m);
}

function placeJoint(
  mesh: THREE.InstancedMesh, index: number, P: ArrayLike<number>, o: number, radius: number,
): void {
  _p.set(P[o], P[o + 1], P[o + 2]);
  _q.identity();
  _s.setScalar(radius);
  _m.compose(_p, _q, _s);
  mesh.setMatrixAt(index, _m);
}

function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  for (let i = 0; i < mesh.count; i++) mesh.setMatrixAt(i, _zero);
  mesh.instanceMatrix.needsUpdate = true;
}

function initTint(mesh: THREE.InstancedMesh | null, colors?: THREE.Color[]): void {
  if (!mesh) return;
  for (let i = 0; i < mesh.count; i++) mesh.setColorAt(i, colors?.[i] ?? _c.set("#ffffff"));
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

const visTint = (v: number) => 0.4 + 0.6 * Math.min(1, Math.max(0.2, v));

/* ==========================================================================
 * 6. 3D: RIG COMPONENTS
 * ========================================================================== */

function BodyRig({ sampleRef, pairs }: { sampleRef: SampleRef; pairs: PairList }) {
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const joints = useMemo(() => Array.from(new Set(pairs.flat())), [pairs]);
  const radii = useMemo(
    () => pairs.map(([a, b]) => ((bodyJointRadius(a) + bodyJointRadius(b)) / 2) * 0.58),
    [pairs],
  );
  const baseColors = useMemo(
    () =>
      pairs.map(([a, b]) => {
        const torso = [11, 12, 23, 24];
        if (torso.includes(a) && torso.includes(b)) return new THREE.Color(COLOR.torso);
        if (a >= 11 && a <= 16 && b >= 11 && b <= 16) return new THREE.Color(COLOR.arm);
        if (a >= 23 || b >= 23) return new THREE.Color(COLOR.leg);
        return new THREE.Color(COLOR.other);
      }),
    [pairs],
  );
  const boneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.3, roughness: 0.42 }),
    [],
  );
  const jointMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.35, roughness: 0.36 }),
    [],
  );
  useEffect(() => () => { boneMat.dispose(); jointMat.dispose(); }, [boneMat, jointMat]);
  useLayoutEffect(() => {
    hideAll(bonesRef.current);
    hideAll(jointsRef.current);
    initTint(bonesRef.current, baseColors);
    initTint(jointsRef.current);
  }, [baseColors, joints]);

  useFrame(() => {
    const bones = bonesRef.current;
    const jointMesh = jointsRef.current;
    if (!bones || !jointMesh) return;
    const P = sampleRef.current.pose;
    for (let i = 0; i < pairs.length; i++) {
      const a = pairs[i][0], b = pairs[i][1];
      const va = P[a * 4 + 3], vb = P[b * 4 + 3];
      if (!(va >= THRESH && vb >= THRESH)) {
        bones.setMatrixAt(i, _zero);
        continue;
      }
      placeBone(bones, i, P, a * 4, P, b * 4, radii[i]);
      _c.copy(baseColors[i]).multiplyScalar(visTint(Math.min(va, vb)));
      bones.setColorAt(i, _c);
    }
    bones.instanceMatrix.needsUpdate = true;
    if (bones.instanceColor) bones.instanceColor.needsUpdate = true;

    for (let i = 0; i < joints.length; i++) {
      const idx = joints[i];
      const v = P[idx * 4 + 3];
      if (!(v >= THRESH)) {
        jointMesh.setMatrixAt(i, _zero);
        continue;
      }
      placeJoint(jointMesh, i, P, idx * 4, bodyJointRadius(idx));
      _c.set(COLOR.joint).multiplyScalar(visTint(v));
      jointMesh.setColorAt(i, _c);
    }
    jointMesh.instanceMatrix.needsUpdate = true;
    if (jointMesh.instanceColor) jointMesh.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={bonesRef} args={[getBoneGeometry(), boneMat, pairs.length]} frustumCulled={false} />
      <instancedMesh ref={jointsRef} args={[getJointGeometry(), jointMat, joints.length]} frustumCulled={false} />
    </group>
  );
}

const TORSO_INDICES = [
  0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 3, 7, 0, 7, 4,
  1, 5, 6, 1, 6, 2, 0, 4, 5, 0, 5, 1, 3, 2, 6, 3, 6, 7,
];

/** Subtle translucent torso box between shoulders and hips; never occludes the hands. */
function TorsoRig({ sampleRef }: { sampleRef: SampleRef }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(8 * 3), 3).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(TORSO_INDICES);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR.volume, transparent: true, opacity: 0.15, roughness: 0.7, metalness: 0.1,
        side: THREE.DoubleSide, depthWrite: false,
      }),
    [],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const P = sampleRef.current.pose;
    const ok = P[11 * 4 + 3] >= THRESH && P[12 * 4 + 3] >= THRESH && P[23 * 4 + 3] >= THRESH && P[24 * 4 + 3] >= THRESH;
    mesh.visible = ok;
    if (!ok) return;
    const width = Math.hypot(P[11 * 4] - P[12 * 4], P[11 * 4 + 1] - P[12 * 4 + 1], P[11 * 4 + 2] - P[12 * 4 + 2]);
    const depth = Math.max(0.1, width * 0.17);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const order = [11, 12, 24, 23]; // LS, RS, RH, LH -> front vertices 0-3, back vertices 4-7
    for (let k = 0; k < 4; k++) {
      const o = order[k] * 4;
      pos.setXYZ(k, P[o], P[o + 1], P[o + 2] + depth);
      pos.setXYZ(k + 4, P[o], P[o + 1], P[o + 2] - depth);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} renderOrder={-1} />;
}

function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR.volume, transparent: true, opacity: 0.13, roughness: 0.55, metalness: 0.05, depthWrite: false,
      }),
    [],
  );
  const neckMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLOR.other, metalness: 0.3, roughness: 0.45 }),
    [],
  );
  useEffect(() => () => { headMat.dispose(); neckMat.dispose(); }, [headMat, neckMat]);
  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;
    head.visible = st.headValid;
    if (!st.headValid) {
      neck.setMatrixAt(0, _zero);
      neck.instanceMatrix.needsUpdate = true;
      return;
    }
    const H = st.head;
    head.position.set(H[1], H[2], H[3]);
    head.scale.set(H[4] / 2, H[5] / 2, H[6] / 2);
    head.rotation.z = H[10];

    const P = st.pose;
    if (P[11 * 4 + 3] >= THRESH && P[12 * 4 + 3] >= THRESH) {
      _sa[0] = (P[11 * 4] + P[12 * 4]) / 2;
      _sa[1] = (P[11 * 4 + 1] + P[12 * 4 + 1]) / 2;
      _sa[2] = (P[11 * 4 + 2] + P[12 * 4 + 2]) / 2;
      _sb[0] = H[7]; _sb[1] = H[8]; _sb[2] = H[9];
      placeBone(neck, 0, _sa, 0, _sb, 0, NECK_RADIUS);
    } else {
      neck.setMatrixAt(0, _zero);
    }
    neck.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={headRef} geometry={getHeadGeometry()} material={headMat} frustumCulled={false} renderOrder={-1} />
      <instancedMesh ref={neckRef} args={[getBoneGeometry(), neckMat, 1]} frustumCulled={false} />
    </group>
  );
}

function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const keysRef = useRef<THREE.InstancedMesh>(null);
  const stubBonesRef = useRef<THREE.InstancedMesh>(null);
  const stubJointsRef = useRef<THREE.InstancedMesh>(null);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FACE_SEGMENTS.length * 3), 3).setUsage(THREE.DynamicDrawUsage),
    );
    return g;
  }, []);
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: COLOR.face, transparent: true, opacity: 0.8 }),
    [],
  );
  const keyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLOR.faceKey, roughness: 0.4, metalness: 0.1 }), []);
  const stubMat = useMemo(() => new THREE.MeshStandardMaterial({ color: COLOR.face, roughness: 0.45, metalness: 0.2 }), []);
  useEffect(
    () => () => { lineGeo.dispose(); lineMat.dispose(); keyMat.dispose(); stubMat.dispose(); },
    [lineGeo, lineMat, keyMat, stubMat],
  );
  useLayoutEffect(() => {
    hideAll(keysRef.current);
    hideAll(stubBonesRef.current);
    hideAll(stubJointsRef.current);
  }, []);

  useFrame(() => {
    const lines = linesRef.current, keys = keysRef.current;
    const stubBones = stubBonesRef.current, stubJoints = stubJointsRef.current;
    if (!lines || !keys || !stubBones || !stubJoints) return;
    const st = sampleRef.current;
    const dense = st.dense;
    lines.visible = dense;
    keys.visible = dense;
    stubBones.visible = !dense;
    stubJoints.visible = !dense;

    if (dense) {
      const pos = lineGeo.getAttribute("position") as THREE.BufferAttribute;
      const F = st.face;
      for (let s = 0; s < FACE_SEGMENTS.length; s += 2) {
        const a = FACE_SEGMENTS[s], b = FACE_SEGMENTS[s + 1];
        const i = s; // vertex index of first endpoint (2 vertices per segment)
        if (st.faceValid[a] && st.faceValid[b]) {
          pos.setXYZ(i, F[a * 3], F[a * 3 + 1], F[a * 3 + 2]);
          pos.setXYZ(i + 1, F[b * 3], F[b * 3 + 1], F[b * 3 + 2]);
        } else {
          pos.setXYZ(i, 0, 0, 0);
          pos.setXYZ(i + 1, 0, 0, 0);
        }
      }
      pos.needsUpdate = true;
      for (let k = 0; k < FACE_KEY_SLOTS.length; k++) {
        const slot = FACE_KEY_SLOTS[k];
        if (st.faceValid[slot]) placeJoint(keys, k, F, slot * 3, slot === SLOT_NOSE ? 0.016 : 0.011);
        else keys.setMatrixAt(k, _zero);
      }
      keys.instanceMatrix.needsUpdate = true;
    } else {
      const P = st.pose;
      for (let i = 0; i < POSE_FACE_PAIRS.length; i++) {
        const a = POSE_FACE_PAIRS[i][0], b = POSE_FACE_PAIRS[i][1];
        if (P[a * 4 + 3] >= THRESH && P[b * 4 + 3] >= THRESH) placeBone(stubBones, i, P, a * 4, P, b * 4, 0.007);
        else stubBones.setMatrixAt(i, _zero);
      }
      for (let i = 0; i < POSE_FACE_JOINTS.length; i++) {
        const idx = POSE_FACE_JOINTS[i];
        if (P[idx * 4 + 3] >= THRESH) placeJoint(stubJoints, i, P, idx * 4, idx === 0 ? 0.02 : 0.013);
        else stubJoints.setMatrixAt(i, _zero);
      }
      stubBones.instanceMatrix.needsUpdate = true;
      stubJoints.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} frustumCulled={false} />
      <instancedMesh ref={keysRef} args={[getJointGeometry(), keyMat, FACE_KEY_SLOTS.length]} frustumCulled={false} />
      <instancedMesh ref={stubBonesRef} args={[getBoneGeometry(), stubMat, POSE_FACE_PAIRS.length]} frustumCulled={false} />
      <instancedMesh ref={stubJointsRef} args={[getJointGeometry(), stubMat, POSE_FACE_JOINTS.length]} frustumCulled={false} />
    </group>
  );
}

/** Full 21-landmark hand: thin bones, joints, optional palm fan. Fades when the hand drops out. */
function HandRig({ slot, color, sampleRef }: { slot: 0 | 1; color: string; sampleRef: SampleRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const palmRef = useRef<THREE.Mesh>(null);

  const mats = useMemo(
    () => ({
      bone: new THREE.MeshStandardMaterial({ color, metalness: 0.2, roughness: 0.4, emissive: color, emissiveIntensity: 0.12 }),
      joint: new THREE.MeshStandardMaterial({
        color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35),
        metalness: 0.2, roughness: 0.32, emissive: color, emissiveIntensity: 0.1,
      }),
      palm: new THREE.MeshStandardMaterial({
        color, transparent: true, opacity: 0.2, roughness: 0.8, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
      }),
    }),
    [color],
  );
  const palmGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(PALM_FAN.length * 3), 3).setUsage(THREE.DynamicDrawUsage),
    );
    g.setIndex(PALM_INDICES);
    return g;
  }, []);
  useEffect(
    () => () => { mats.bone.dispose(); mats.joint.dispose(); mats.palm.dispose(); palmGeo.dispose(); },
    [mats, palmGeo],
  );
  useLayoutEffect(() => {
    hideAll(bonesRef.current);
    hideAll(jointsRef.current);
  }, []);

  useFrame(() => {
    const group = groupRef.current, bones = bonesRef.current, joints = jointsRef.current, palm = palmRef.current;
    if (!group || !bones || !joints || !palm) return;
    const st = sampleRef.current;
    const alpha = st.handAlpha[slot];
    group.visible = alpha > 0.01;
    if (!group.visible) return;
    const pts = st.hands[slot];
    const valid = st.handValid[slot];
    const fading = alpha < 0.985;
    mats.bone.transparent = fading;
    mats.bone.opacity = alpha;
    mats.joint.transparent = fading;
    mats.joint.opacity = alpha;
    mats.palm.opacity = alpha * 0.22;

    for (let i = 0; i < HAND_CONN.length; i++) {
      const c = HAND_CONN[i];
      if (valid[c[0]] && valid[c[1]]) placeBone(bones, i, pts, c[0] * 3, pts, c[1] * 3, HAND_BONE_RADIUS[i]);
      else bones.setMatrixAt(i, _zero);
    }
    bones.instanceMatrix.needsUpdate = true;
    for (let j = 0; j < 21; j++) {
      if (valid[j]) placeJoint(joints, j, pts, j * 3, HAND_JOINT_RADIUS[j]);
      else joints.setMatrixAt(j, _zero);
    }
    joints.instanceMatrix.needsUpdate = true;

    palm.visible = valid[0] === 1;
    if (palm.visible) {
      const pos = palmGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < PALM_FAN.length; k++) {
        const j = valid[PALM_FAN[k]] ? PALM_FAN[k] : 0; // missing palm vertex collapses onto the wrist
        pos.setXYZ(k, pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]);
      }
      pos.needsUpdate = true;
      palmGeo.computeVertexNormals();
    }
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      <instancedMesh ref={bonesRef} args={[getBoneGeometry(), mats.bone, HAND_CONN.length]} frustumCulled={false} renderOrder={2} />
      <instancedMesh ref={jointsRef} args={[getJointGeometry(), mats.joint, 21]} frustumCulled={false} renderOrder={2} />
      <mesh ref={palmRef} geometry={palmGeo} material={mats.palm} frustumCulled={false} renderOrder={1} />
    </group>
  );
}

/* ==========================================================================
 * 7. 3D: PLAYBACK, CAMERA, FLOOR, SCENE
 * ========================================================================== */

interface PlaybackState { playing: boolean; speed: number }

function PlaybackDriver({
  seq, sampleRef, playheadRef, playbackRef, fps, onFrame,
}: {
  seq: SolvedSequence;
  sampleRef: SampleRef;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  fps: number;
  onFrame: (frame: number) => void;
}) {
  const lastShown = useRef(-1);
  const lastPlayhead = useRef(-100);
  useFrame((_, delta) => {
    const n = seq.frames.length;
    if (n === 0) return;
    const dt = Math.min(delta, 0.1);
    const pb = playbackRef.current;
    let ph = playheadRef.current;
    if (pb.playing && n > 1) {
      ph += dt * fps * pb.speed;
      if (ph >= n) ph %= n;
      playheadRef.current = ph;
    }
    ph = Math.min(Math.max(ph, 0), n - 1 + 0.999);
    const snap = Math.abs(ph - lastPlayhead.current) > 2.5; // seek or loop wrap: no smoothing streaks
    lastPlayhead.current = ph;
    sampleFrame(seq, sampleRef.current, Math.min(ph, n - 1), dt, snap);
    const shown = Math.min(Math.floor(ph), n - 1);
    if (shown !== lastShown.current) {
      lastShown.current = shown;
      onFrame(shown);
    }
  }, -2);
  return null;
}

type ViewKind = "front" | "side" | "angle" | "reset" | "zoomIn" | "zoomOut" | "zoomReset";
interface ViewCommand { kind: ViewKind; nonce: number }

const VIEW_DIRS = {
  front: new THREE.Vector3(0, 0.04, 1).normalize(),
  side: new THREE.Vector3(1, 0.04, 0).normalize(),
  angle: new THREE.Vector3(0.62, 0.18, 0.76).normalize(),
};

function computeFraming(b: Bounds, aspect: number): { center: THREE.Vector3; distance: number } {
  if (!Number.isFinite(b.minX)) return { center: new THREE.Vector3(), distance: 6 };
  const center = new THREE.Vector3((b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2, (b.minZ + b.maxZ) / 2);
  const halfW = Math.max((b.maxX - b.minX) / 2, 0.3);
  const halfH = Math.max((b.maxY - b.minY) / 2, 0.3);
  const halfD = Math.max((b.maxZ - b.minZ) / 2, 0);
  const t = Math.tan(THREE.MathUtils.degToRad(FOV) / 2);
  const distance =
    Math.max((halfH * 1.12) / t, (halfW * 1.12) / (t * Math.max(aspect, 0.2))) + halfD + 0.3;
  return { center, distance };
}

type OrbitControlsHandle = React.ElementRef<typeof OrbitControls>;

function CameraRig({
  bounds, command, onZoom,
}: { bounds: Bounds; command: ViewCommand; onZoom: (zoom: number) => void }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const controlsRef = useRef<OrbitControlsHandle>(null);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const interacted = useRef(false);
  const lastPct = useRef(100);
  const aspect = size.width / Math.max(size.height, 1);
  const framing = useMemo(() => computeFraming(bounds, aspect), [bounds, aspect]);
  const framingRef = useRef(framing);
  framingRef.current = framing;

  const placeFront = useCallback(() => {
    const { center, distance } = framingRef.current;
    camera.position.copy(center).addScaledVector(VIEW_DIRS.front, distance);
    const ctl = controlsRef.current;
    if (ctl) {
      ctl.target.copy(center);
      ctl.update();
    } else {
      camera.lookAt(center);
    }
  }, [camera]);

  // New sequence: reset the view.
  useLayoutEffect(() => {
    interacted.current = false;
    goal.current = null;
    placeFront();
  }, [bounds, placeFront]);
  // Resize/aspect change: re-frame only if the user has not moved the camera.
  useEffect(() => {
    if (!interacted.current) placeFront();
  }, [framing.distance, placeFront]);

  useEffect(() => {
    if (command.nonce === 0) return;
    const { center, distance: base } = framingRef.current;
    const ctl = controlsRef.current;
    const target = ctl ? ctl.target.clone() : center.clone();
    const offset = camera.position.clone().sub(target);
    const current = offset.length() || base;
    const keepDir = offset.clone().normalize();
    const clamp = (d: number) => Math.min(Math.max(d, base / 4), base / 0.4);
    switch (command.kind) {
      case "front":
      case "side":
      case "angle":
        goal.current = { pos: center.clone().addScaledVector(VIEW_DIRS[command.kind], current), target: center.clone() };
        break;
      case "reset":
        interacted.current = false;
        goal.current = { pos: center.clone().addScaledVector(VIEW_DIRS.front, base), target: center.clone() };
        break;
      case "zoomIn":
        goal.current = { pos: target.clone().addScaledVector(keepDir, clamp(current / 1.25)), target };
        break;
      case "zoomOut":
        goal.current = { pos: target.clone().addScaledVector(keepDir, clamp(current * 1.25)), target };
        break;
      case "zoomReset":
        goal.current = { pos: target.clone().addScaledVector(keepDir, base), target };
        break;
    }
  }, [command, camera]);

  useFrame((_, delta) => {
    const ctl = controlsRef.current;
    if (!ctl) return;
    const g = goal.current;
    if (g) {
      const k = 1 - Math.exp(-delta * 9);
      camera.position.lerp(g.pos, k);
      ctl.target.lerp(g.target, k);
      ctl.update();
      const eps = framingRef.current.distance * 0.002;
      if (camera.position.distanceToSquared(g.pos) < eps * eps) {
        camera.position.copy(g.pos);
        ctl.target.copy(g.target);
        ctl.update();
        goal.current = null;
      }
    }
    const dist = camera.position.distanceTo(ctl.target);
    const pct = Math.max(5, Math.round((framingRef.current.distance / Math.max(dist, 1e-6)) * 20) * 5);
    if (pct !== lastPct.current) {
      lastPct.current = pct;
      onZoom(pct / 100);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      screenSpacePanning
      minDistance={framing.distance / 4}
      maxDistance={framing.distance / 0.4}
      onStart={() => {
        interacted.current = true;
        goal.current = null;
      }}
    />
  );
}

function Floor({ bounds }: { bounds: Bounds }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(1, 24, "#4a5090", "#2b3060");
    const m = g.material as THREE.LineBasicMaterial;
    m.transparent = true;
    m.opacity = 0.26;
    m.depthWrite = false;
    return g;
  }, []);
  useEffect(
    () => () => {
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
    },
    [grid],
  );
  if (!Number.isFinite(bounds.minY)) return null;
  const height = bounds.maxY - bounds.minY;
  const floorY = bounds.minY - Math.max(height * 0.06, 0.08);
  const gridSize = Math.max(bounds.maxX - bounds.minX, height) * 2.2;
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cz = (bounds.minZ + bounds.maxZ) / 2;
  return (
    <>
      <primitive object={grid} position={[cx, floorY, cz]} scale={gridSize} />
      <ContactShadows
        position={[cx, floorY + 0.002, cz]}
        scale={gridSize}
        far={height * 1.6}
        blur={2.4}
        opacity={0.45}
        resolution={256}
        color="#05060f"
      />
    </>
  );
}

interface ViewerProps {
  seq: SolvedSequence;
  fps: number;
  hasPoseData: boolean;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  command: ViewCommand;
  onFrame: (frame: number) => void;
  onZoom: (zoom: number) => void;
  onFail: () => void;
}

function SceneContent({
  seq, fps, hasPoseData, playheadRef, playbackRef, command, onFrame, onZoom,
}: Omit<ViewerProps, "onFail">) {
  const sampleRef = useMemo<SampleRef>(() => ({ current: createSampleState() }), [seq]);
  return (
    <>
      <hemisphereLight args={["#c7d2fe", "#1e1b4b", 0.55]} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <directionalLight position={[-4, 3, -4]} intensity={0.9} color="#818cf8" />
      <directionalLight position={[-3, 1, 3]} intensity={0.35} color="#38bdf8" />
      <PlaybackDriver
        seq={seq} sampleRef={sampleRef} playheadRef={playheadRef}
        playbackRef={playbackRef} fps={fps} onFrame={onFrame}
      />
      <CameraRig bounds={seq.bounds} command={command} onZoom={onZoom} />
      <Floor bounds={seq.bounds} />
      <TorsoRig sampleRef={sampleRef} />
      <HeadRig sampleRef={sampleRef} />
      <BodyRig sampleRef={sampleRef} pairs={hasPoseData ? RIG_POSE_PAIRS : RIG_GUIDE_PAIRS} />
      <FaceRig sampleRef={sampleRef} />
      <HandRig slot={0} color={COLOR.handLeft} sampleRef={sampleRef} />
      <HandRig slot={1} color={COLOR.handRight} sampleRef={sampleRef} />
    </>
  );
}

class ViewerBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const Skeleton3DViewer = React.memo(function Skeleton3DViewer({ onFail, ...scene }: ViewerProps) {
  return (
    <div className="absolute inset-0">
      <ViewerBoundary onError={onFail}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: FOV, near: 0.05, far: 200, position: [0, 0, 6] }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
          }}
        >
          <SceneContent {...scene} />
        </Canvas>
      </ViewerBoundary>
    </div>
  );
});

function detectWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") || probe.getContext("webgl")) as WebGLRenderingContext | null;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/* ==========================================================================
 * 9. PUBLIC COMPONENT (same props as before)
 * ========================================================================== */

interface LandmarkSimulationProps {
  frames?: number[][][];              // F x 42 x 3
  // F x 33 x 4 (optional, 258-dim runs). Typed as a tuple rather than
  // number[][] because the visibility column is index 3 of every landmark and
  // the type is what keeps a plain (x, y, z) clip from being passed in and read
  // as though p[3] were a visibility score.
  pose?: PosePoint[][];
  faceMesh?: number[][][];
  faceMeshConnections?: [number, number][];
  faceMeshError?: string;
  fps?: number;
  title?: string;
}

const VIEW_BUTTONS: { label: string; kind: ViewKind }[] = [
  { label: "FRONT", kind: "front" },
  { label: "SIDE", kind: "side" },
  { label: "3/4", kind: "angle" },
  { label: "RESET", kind: "reset" },
];

export function LandmarkSimulation({
  frames,
  pose,
  faceMesh,
  faceMeshConnections,
  faceMeshError,
  fps = 15,
  title,
}: LandmarkSimulationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [zoom, setZoom] = useState(1);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [viewerFailed, setViewerFailed] = useState(false);
  const [viewCommand, setViewCommand] = useState<ViewCommand>({ kind: "reset", nonce: 0 });

  // The 3D scene advances a fractional playhead itself; React state only
  // mirrors the integer frame for the UI.
  const playheadRef = useRef(0);
  const playbackRef = useRef<PlaybackState>({ playing: true, speed: 1 });
  playbackRef.current.playing = isPlaying;
  playbackRef.current.speed = playbackSpeed;

  const totalFrames = frames?.length ?? 0;
  const poseAlignments = useMemo(
    () => (pose?.length ? getPoseAlignments(pose) : undefined),
    [pose],
  );
  const alignedFaceFrames = useMemo(
    () =>
      faceMesh?.map((faceFrame, index) => {
        const targetPose = pose?.[index] ?? BODY_GUIDE;
        const aligned = alignFaceMeshToPose(faceFrame, targetPose);
        const alignment = poseAlignments?.[index];
        return alignment
          ? aligned.map((point) => stabilizePoint([point.x, point.y], alignment))
          : aligned;
      }),
    [faceMesh, pose, poseAlignments],
  );
  const seq = useMemo(
    () =>
      frames?.length
        ? solveSequence(
            frames, pose, poseAlignments, alignedFaceFrames, faceMesh,
            Boolean(faceMeshConnections?.length),
          )
        : null,
    [frames, pose, poseAlignments, alignedFaceFrames, faceMesh, faceMeshConnections],
  );

  const mode: "pending" | "3d" | "unavailable" =
    webgl === null ? "pending" : webgl && !viewerFailed && seq ? "3d" : "unavailable";

  const currentFrameData = frames?.[currentFrame];
  const currentHandsCount = currentFrameData
    ? [0, 21].filter((offset) => !isMissingHand(currentFrameData, offset)).length
    : 0;
  const currentFaceMeshCount = alignedFaceFrames?.[currentFrame]?.length ?? 0;

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  useEffect(() => {
    if (playheadRef.current >= totalFrames) {
      playheadRef.current = 0;
      setCurrentFrame(0);
    }
  }, [totalFrames]);

  const handleFrame = useCallback((frame: number) => setCurrentFrame(frame), []);
  const handleZoom = useCallback((value: number) => setZoom(value), []);
  const handleFail = useCallback(() => setViewerFailed(true), []);
  const sendView = (kind: ViewKind) =>
    setViewCommand((c) => ({ kind, nonce: c.nonce + 1 }));

  const zoomBy = (direction: 1 | -1) => sendView(direction > 0 ? "zoomIn" : "zoomOut");
  const resetZoom = () => sendView("zoomReset");
  const minZoom = 0.4;
  const maxZoom = 4;

  const seek = (value: number) => {
    playheadRef.current = value;
    setCurrentFrame(value);
  };

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

  const overlayButton =
    "px-2 py-0.5 rounded text-[10px] border border-border bg-surface/80 text-text-secondary backdrop-blur hover:text-text-primary";

  return (
    <div className="bg-surface border border-border rounded-md overflow-hidden flex flex-col">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border bg-surface-elevated/50 px-3 py-2 tech-mono text-[11px] text-text-secondary">
        <span>
          Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong>
        </span>
        <span aria-hidden="true">|</span>
        <span>FPS: <strong className="text-accent-primary">{fps}</strong></span>
        <span aria-hidden="true">|</span>
        <span>
          Hands: <strong className="text-status-approved">{currentHandsCount} (21 pts each)</strong>
        </span>
        <span aria-hidden="true">|</span>
        {pose?.length ? (
          <span>
            Pose: <strong className="text-[#818CF8]">{POSE_POINTS} pts</strong>
          </span>
        ) : (
          <span className="text-[#818CF8]">Body guide</span>
        )}
        {currentFaceMeshCount > 0 ? (
          <>
            <span aria-hidden="true">|</span>
            <span className="text-sky-300">Face mesh: {currentFaceMeshCount} pts</span>
          </>
        ) : faceMesh ? (
          <>
            <span aria-hidden="true">|</span>
            <span className="text-text-muted">Face not detected in this frame</span>
          </>
        ) : faceMeshError ? (
          <>
            <span aria-hidden="true">|</span>
            <span
              className="text-status-unknown"
              title={faceMeshError}
            >
              Dense face mesh unavailable
            </span>
          </>
        ) : null}
        {title && (
          <>
            <span aria-hidden="true">|</span>
            <span className="text-accent-secondary">{title}</span>
          </>
        )}
      </div>

      <div className="relative aspect-video w-full bg-background flex items-center justify-center canvas-grid-bg overflow-hidden">
        {mode === "3d" && seq && (
          <Skeleton3DViewer
            seq={seq}
            fps={fps}
            hasPoseData={Boolean(pose?.length)}
            playheadRef={playheadRef}
            playbackRef={playbackRef}
            command={viewCommand}
            onFrame={handleFrame}
            onZoom={handleZoom}
            onFail={handleFail}
          />
        )}
        {mode === "unavailable" && (
          <div className="px-6 text-center text-[11px] text-text-muted">
            The 3D viewer needs WebGL, which is not available in this browser.
          </div>
        )}

        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1 tech-mono">
          {mode === "3d" &&
            VIEW_BUTTONS.map(({ label, kind }) => (
              <button key={kind} type="button" onClick={() => sendView(kind)} className={overlayButton}>
                {label}
              </button>
            ))}
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
            onClick={() => seek(0)}
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
          <div className="ml-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => zoomBy(-1)}
              disabled={zoom <= minZoom}
              aria-label="Zoom out"
              title="Zoom out"
              className="rounded border border-border bg-surface p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-40"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label={`Reset zoom, currently ${Math.round(zoom * 100)}%`}
              title="Reset zoom"
              className="min-w-12 text-center text-[10px] text-text-secondary hover:text-text-primary"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1)}
              disabled={zoom >= maxZoom}
              aria-label="Zoom in"
              title="Zoom in"
              className="rounded border border-border bg-surface p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-40"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 mx-6 flex items-center">
          <input
            type="range"
            min={0}
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => seek(parseInt(e.target.value))}
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