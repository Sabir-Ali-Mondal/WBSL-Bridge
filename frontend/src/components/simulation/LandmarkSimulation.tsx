"use client";
import "@/lib/threeSetup";
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
import { OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { DhutiRig } from "./DhutiRig";
import { RoundAlpanaStage } from "./AlpanaStage";
import { DHUTI_DROP, THRESH, TORSO_WORLD } from "./simulationConstants";
import { FaceRig, HeadRig, FACE_POINTS, HEAD_LEN, type SampleRef, type SampleState } from "./HeadFaceRig";
import {
  getBoneGeometry,
  getJointGeometry,
  hideAll,
  placeBone,
  placeJoint,
  ZERO_MATRIX,
} from "./RigUtils";
export type { SampleRef } from "./HeadFaceRig";
import {
  POSE_BODY_PAIRS,
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

type Point2 = { x: number; y: number };

const BODY_GUIDE: PosePoint[] = [
  [-0.7, -1.25, 0, 1],
  [0.7, -1.25, 0, 1],
  [-1.1, -0.65, 0, 1],
  [1.1, -0.65, 0, 1],
  [-1.35, 0, 0, 1],
  [1.35, 0, 0, 1],
  [-0.45, 0.55, 0, 1],
  [0.45, 0.55, 0, 1],
];
const GUIDE_BODY_PAIRS = POSE_BODY_PAIRS;
const POSE_SKELETON_PAIRS = POSE_BODY_PAIRS;

const POSE_DRAW_THRESHOLD = 0.01;

const isMissingHand = (frame: number[][], offset: number) =>
  frame
    .slice(offset, offset + 21)
    .every((point) => point[0] === 0 && point[1] === 0 && point[2] === 0);

function handAnchor(frame: number[][]): Point2 {
  return isMissingHand(frame, 21)
    ? { x: BODY_GUIDE[4][0], y: BODY_GUIDE[4][1] }
    : { x: BODY_GUIDE[5][0], y: BODY_GUIDE[5][1] };
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
    const shoulders = [frame[0], frame[1]];
    const hips = [frame[6], frame[7]];
    const visible = [...shoulders, ...hips].filter(
      (point) => point && point[3] >= POSE_DRAW_THRESHOLD && validPoint(point),
    );
    const centerPoints = visible.length ? visible : [frame[0], frame[1]].filter(Boolean);
    const center = centerPoints.reduce(
      (sum, point) => ({ x: sum.x + point[0], y: sum.y + point[1] }),
      { x: 0, y: 0 },
    );
    center.x /= centerPoints.length || 1;
    center.y /= centerPoints.length || 1;

    const shoulderCenter = {
      x: (frame[0]?.[0] + frame[1]?.[0]) / 2,
      y: (frame[0]?.[1] + frame[1]?.[1]) / 2,
    };
    const hipCenter = {
      x: (frame[6]?.[0] + frame[7]?.[0]) / 2,
      y: (frame[6]?.[1] + frame[7]?.[1]) / 2,
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

/* ==========================================================================
 * 2. 3D: CONSTANTS, TYPES, FACE TOPOLOGY
 * ========================================================================== */

type PairList = ReadonlyArray<readonly [number, number]>;

const Z_POSE = 0.15;
const Z_HAND = 0.5;
const Z_LIMIT = 0.4;
const SNAP_MAX_TORSOS = 1.0;
const FOV = 38;

/* Keep the dhuti knee-length and independent of leg landmarks so pose noise
 * cannot stretch or shorten the garment. */
const COLOR = {
  torso: "#243B73",
  arm: "#3E5A9A",
  leg: "#6870C9",
  other: "#3E5A9A",
  joint: "#6B85BD",
  volume: "#243B73",
  handLeft: "#5EEAD4",
  handRight: "#C4B5FD",
  face: "#38BDF8",
  faceKey: "#BAE6FD",
  dhuti: "#F1F0E8",
  dhutiBand: "#D4D5D0",
  gold: "#C79A32",
} as const;

const RIG_POSE_PAIRS: PairList = POSE_SKELETON_PAIRS.filter(
  ([a, b]) => a < 6 && b < 6,
);
const RIG_GUIDE_PAIRS: PairList = GUIDE_BODY_PAIRS.filter(
  ([a, b]) => a < 6 && b < 6,
);

const BODY_JOINT_RADIUS: Record<number, number> = {
  0: 0.105, 1: 0.105, 2: 0.06, 3: 0.06, 4: 0.046, 5: 0.046,
  6: 0.08, 7: 0.08,
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

interface Bounds {
  minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number;
}
const emptyBounds = (): Bounds => ({
  minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: Infinity, maxZ: -Infinity,
});
function medianValue(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

function growBounds(b: Bounds, x: number, y: number, z: number): void {
  if (x < b.minX) b.minX = x;
  if (x > b.maxX) b.maxX = x;
  if (y < b.minY) b.minY = y;
  if (y > b.maxY) b.maxY = y;
  if (z < b.minZ) b.minZ = z;
  if (z > b.maxZ) b.maxZ = z;
}

interface SolvedFrame {
  hasPose: boolean;
  pose: Float32Array;
  hands: Float32Array;
  handPresent: [boolean, boolean];
  facePresent: boolean;
  face: Float32Array;
  head: Float32Array;
}
export interface SolvedSequence {
  frames: SolvedFrame[];
  bounds: Bounds;
}

/* ==========================================================================
 * 3. 3D: COORDINATE CONVERSION + SEQUENCE SOLVER
 * ========================================================================== */

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
    const ok = [0, 1, 6, 7].every(
      (k) => frame[k] && validPoint(frame[k]) && frame[k][3] >= THRESH,
    );
    if (!ok) return;
    const length =
      Math.hypot(
        (frame[0][0] + frame[1][0]) / 2 - (frame[6][0] + frame[7][0]) / 2,
        (frame[0][1] + frame[1][1]) / 2 - (frame[6][1] + frame[7][1]) / 2,
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
}

function poseHeadFallback(pose: Float32Array, head: Float32Array): void {
  const vis = (i: number) => pose[i * 4 + 3] >= THRESH;
  if (!vis(0) || !vis(1)) return;
  const dx = pose[4] - pose[0];
  const dy = pose[5] - pose[1];
  const dz = pose[6] - pose[2];
  const width = Math.max(Math.hypot(dx, dy, dz) * 0.62, 0.2);
  const cx = (pose[0] + pose[4]) / 2;
  const shoulderY = (pose[1] + pose[5]) / 2;
  const cy = shoulderY + width * 0.58;
  const cz = (pose[2] + pose[6]) / 2;
  const roll = Math.atan2(dx < 0 ? -dy : dy, Math.abs(dx));
  const w = width;
  const h = w * 1.2;
  const d = w * 0.8;
  head.set([1, cx, cy, cz, w, h, d, cx, shoulderY + NECK_LENGTH, cz, roll]);
}

const NECK_LENGTH = 0.2;

function solveFrame(
  ctx: SolveContext,
  frame: number[][],
  poseFrame: PosePoint[] | undefined,
  alignment: PoseAlignment | undefined,
  faceAvatar: number[][] | undefined,
): SolvedFrame {
  const S = ctx.scale;
  const hasPose = Boolean(poseFrame);
  const pf = poseFrame ?? BODY_GUIDE;

  let zc = 0;
  if (hasPose) {
    const zs = [0, 1]
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
    const isArm = i >= 2 && i <= 5;
    const rawZ = hasPose && isArm && Number.isFinite(p[2]) ? (p[2] - zc) * zScale : 0;
    const z = Math.max(-zLimit, Math.min(zLimit, rawZ));
    poseMpZ[i] = z;
    writeWorld(pose, i * 4, xy.x, xy.y, z, S);
    pose[i * 4 + 3] = p[3];
  }

  const hands = new Float32Array(2 * 21 * 4);
  const handPresent: [boolean, boolean] = [false, false];
  const handOffset = hasPose ? { x: 0, y: 0 } : handAnchor(frame);
  const handScale = alignment?.scale ?? 1;
  ([0, 21] as const).forEach((off, slot) => {
    if (isMissingHand(frame, off)) return;
    handPresent[slot] = true;
    const wristIdx = slot === 0 ? 4 : 5;
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

  const face = new Float32Array(FACE_POINTS * 4);
  const head = new Float32Array(HEAD_LEN);
  poseHeadFallback(pose, head);
  let facePresent = false;
  if (faceAvatar?.length === FACE_POINTS && head[0] > 0) {
    const leftTemple = faceAvatar[2];
    const rightTemple = faceAvatar[3];
    const forehead = faceAvatar[0];
    const chin = faceAvatar[1];
    if (
      validPoint(leftTemple) &&
      validPoint(rightTemple) &&
      validPoint(forehead) &&
      validPoint(chin)
    ) {
      const sourceWidth = Math.hypot(
        rightTemple[0] - leftTemple[0],
        rightTemple[1] - leftTemple[1],
      );
      if (sourceWidth > 1e-5) {
        const faceCenter = alignment
          ? stabilizePoint([
              (leftTemple[0] + rightTemple[0]) / 2,
              (forehead[1] + chin[1]) / 2,
            ], alignment)
          : {
              x: (leftTemple[0] + rightTemple[0]) / 2,
              y: (forehead[1] + chin[1]) / 2,
            };
        const faceScale =
          head[4] /
          (sourceWidth * (alignment?.scale ?? 1) * S);
        const cos = Math.cos(head[10]);
        const sin = Math.sin(head[10]);
        const noseZ = Number.isFinite(faceAvatar[14]?.[2]) ? faceAvatar[14][2] : 0;
        const stabilizedChin = alignment ? stabilizePoint(chin, alignment) : {
          x: chin[0],
          y: chin[1],
        };
        const chinX = (stabilizedChin.x - faceCenter.x) * S * faceScale;
        const chinY = -(stabilizedChin.y - faceCenter.y) * S * faceScale;
        const faceOriginX = head[7] - (chinX * cos - chinY * sin);
        const faceOriginY = head[8] - (chinX * sin + chinY * cos);
        let validCount = 0;
        for (let index = 0; index < FACE_POINTS; index++) {
          const point = faceAvatar[index];
          if (!validPoint(point) || !Number.isFinite(point[2])) continue;
          const stabilized = alignment ? stabilizePoint(point, alignment) : {
            x: point[0],
            y: point[1],
          };
          const localX = (stabilized.x - faceCenter.x) * S * faceScale;
          const localY = -(stabilized.y - faceCenter.y) * S * faceScale;
          const offset = index * 4;
          face[offset] = faceOriginX + localX * cos - localY * sin;
          face[offset + 1] = faceOriginY + localX * sin + localY * cos;
          face[offset + 2] =
            head[3] +
            head[6] * 0.52 +
            (noseZ - point[2]) * S * faceScale * 0.25;
          face[offset + 3] = 1;
          validCount++;
        }
        facePresent = validCount >= Math.ceil(FACE_POINTS * 0.75);
      }
    }
  }

  /* Reject stray landmarks while retaining the upper-body and hand range. */
  const b = ctx.bounds;
  let ccx = 0, ccy = 0, ccz = 0, ccn = 0;
  for (const i of [0, 1, 6, 7]) {
    if (pose[i * 4 + 3] < THRESH) continue;
    ccx += pose[i * 4]; ccy += pose[i * 4 + 1]; ccz += pose[i * 4 + 2]; ccn++;
  }
  if (ccn) { ccx /= ccn; ccy /= ccn; ccz /= ccn; }
  const inReach = (x: number, y: number, z: number, maxTorso: number) =>
    Math.hypot(x - ccx, y - ccy) <= maxTorso * TORSO_WORLD &&
    Math.abs(z - ccz) <= maxTorso * TORSO_WORLD;
  for (let i = 0; i < POSE_POINTS; i++) {
    if (
      pose[i * 4 + 3] >= THRESH &&
      inReach(pose[i * 4], pose[i * 4 + 1], pose[i * 4 + 2], 3.4)
    ) {
      growBounds(b, pose[i * 4], pose[i * 4 + 1], pose[i * 4 + 2]);
    }
  }
  for (let i = 0; i < 42; i++) {
    if (
      hands[i * 4 + 3] === 1 &&
      inReach(hands[i * 4], hands[i * 4 + 1], hands[i * 4 + 2], 2.6)
    ) {
      growBounds(b, hands[i * 4], hands[i * 4 + 1], hands[i * 4 + 2]);
    }
  }
  if (head[0] > 0 && inReach(head[1], head[2], head[3], 2.4)) {
    growBounds(b, head[1] - head[4] / 2, head[2] - head[5] / 2, head[3]);
    growBounds(b, head[1] + head[4] / 2, head[2] + head[5] / 2, head[3] + head[6] / 2);
  }
  return { hasPose, pose, hands, handPresent, facePresent, face, head };
}

function solveSequence(
  frames: number[][][],
  pose: PosePoint[][] | undefined,
  alignments: PoseAlignment[] | undefined,
  faceAvatar: number[][][] | undefined,
): SolvedSequence {
  const ctx: SolveContext = {
    scale: TORSO_WORLD / medianTorso(pose, alignments),
    bounds: emptyBounds(),
  };
  const solved = frames.map((frame, f) =>
    solveFrame(ctx, frame, pose?.[f], alignments?.[f], faceAvatar?.[f]),
  );

  const hemHeights = solved.flatMap(({ pose: framePose }) => {
    if (
      framePose[6 * 4 + 3] < THRESH ||
      framePose[7 * 4 + 3] < THRESH
    ) {
      return [];
    }
    return [(framePose[6 * 4 + 1] + framePose[7 * 4 + 1]) / 2 - DHUTI_DROP];
  });
  if (hemHeights.length) {
    ctx.bounds.minY = Math.min(
      ctx.bounds.minY,
      hemHeights.reduce((lowest, height) => Math.min(lowest, height), Infinity) - 0.44,
    );
    const hips = solved.flatMap(({ pose: framePose }) =>
      framePose[6 * 4 + 3] >= THRESH && framePose[7 * 4 + 3] >= THRESH
        ? [{
            x: (framePose[6 * 4] + framePose[7 * 4]) / 2,
            z: (framePose[6 * 4 + 2] + framePose[7 * 4 + 2]) / 2,
          }]
        : [],
    );
    const stageRadius = Math.max((ctx.bounds.maxX - ctx.bounds.minX) * 0.74, 1.55);
    const stageCenterX = medianValue(hips.map(({ x }) => x));
    const stageCenterZ = medianValue(hips.map(({ z }) => z));
    ctx.bounds.minX = Math.min(ctx.bounds.minX, stageCenterX - stageRadius);
    ctx.bounds.maxX = Math.max(ctx.bounds.maxX, stageCenterX + stageRadius);
    ctx.bounds.minZ = Math.min(ctx.bounds.minZ, stageCenterZ - stageRadius);
    ctx.bounds.maxZ = Math.max(ctx.bounds.maxZ, stageCenterZ + stageRadius);
  }

  return { frames: solved, bounds: ctx.bounds };
}

/* ==========================================================================
 * 4. 3D: FRAME SAMPLING
 * ========================================================================== */

function createSampleState(): SampleState {
  return {
    pose: new Float32Array(POSE_POINTS * 4),
    poseInit: new Uint8Array(POSE_POINTS),
    hands: [new Float32Array(63), new Float32Array(63)],
    handValid: [new Uint8Array(21), new Uint8Array(21)],
    handInit: new Uint8Array(2),
    handAlpha: new Float32Array(2),
    face: new Float32Array(FACE_POINTS * 3),
    faceValid: new Uint8Array(FACE_POINTS),
    faceInit: new Uint8Array(FACE_POINTS),
    head: new Float32Array(HEAD_LEN),
    headValid: false,
    headInit: false,
    facePresent: false,
    hasPose: false,
  };
}

const _t = new Float32Array(4);

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
  dst[o + 2] += (_t[2] - dst[o + 2]) * kz;
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
    if (!present) continue;
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

  st.facePresent = f0.facePresent || f1.facePresent;
  for (let k = 0; k < FACE_POINTS; k++) {
    if (!blendSource(f0.face, f1.face, k, a, 0.5)) {
      st.faceValid[k] = 0;
      st.faceInit[k] = 0;
      continue;
    }
    st.faceValid[k] = 1;
    easeInto(st.face, k * 3, st.faceInit[k] === 1, kxy, kz);
    st.faceInit[k] = 1;
  }

  const v0 = f0.head[0] > 0;
  const v1 = f1.head[0] > 0;
  st.headValid = v0 || v1;
  if (st.headValid) {
    const kh = snap ? 1 : 1 - Math.exp(-delta * 25);
    for (let k = 1; k < HEAD_LEN; k++) {
      const t = v0 && v1
        ? f0.head[k] + (f1.head[k] - f0.head[k]) * a
        : v0
          ? f0.head[k]
          : f1.head[k];
      st.head[k] = st.headInit ? st.head[k] + (t - st.head[k]) * kh : t;
    }
    st.headInit = true;
  } else {
    st.headInit = false;
  }
}

/* ==========================================================================
 * 5. 3D: SHARED THREE HELPERS
 * ========================================================================== */

const _p = new THREE.Vector3();
const _d = new THREE.Vector3();
const _c = new THREE.Color();

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
        const torso = [0, 1, 6, 7];
        if (torso.includes(a) && torso.includes(b)) return new THREE.Color(COLOR.torso);
        if (a >= 2 && a <= 5 && b >= 2 && b <= 5) return new THREE.Color(COLOR.arm);
        if (a >= 6 || b >= 6) return new THREE.Color(COLOR.leg);
        return new THREE.Color(COLOR.other);
      }),
    [pairs],
  );
  const boneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.38, roughness: 0.34 }),
    [],
  );
  const jointMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ffffff", metalness: 0.3, roughness: 0.3 }),
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
        bones.setMatrixAt(i, ZERO_MATRIX);
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
        jointMesh.setMatrixAt(i, ZERO_MATRIX);
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
      <instancedMesh
        ref={bonesRef}
        args={[getBoneGeometry(), boneMat, pairs.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={jointsRef}
        args={[getJointGeometry(), jointMat, joints.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}

const TORSO_RING_PROFILE = [0.72, 0.9, 0.99, 1.04, 1.03, 0.96, 0.8];
const TORSO_RINGS = TORSO_RING_PROFILE.length;
const TORSO_SEGMENTS = 16;
const TORSO_CAPS = 2;
const TORSO_CAP_TOP = TORSO_RINGS * TORSO_SEGMENTS;
const TORSO_CAP_BOTTOM = TORSO_CAP_TOP + 1;
const TORSO_INDICES = (() => {
  const indices: number[] = [];
  for (let ring = 0; ring < TORSO_RINGS - 1; ring++) {
    const upper = ring * TORSO_SEGMENTS;
    const lower = (ring + 1) * TORSO_SEGMENTS;
    for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
      const next = (segment + 1) % TORSO_SEGMENTS;
      indices.push(
        upper + segment, lower + segment, lower + next,
        upper + segment, lower + next, upper + next,
      );
    }
  }
  for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
    const next = (segment + 1) % TORSO_SEGMENTS;
    indices.push(TORSO_CAP_TOP, next, segment);
    const bottom = (TORSO_RINGS - 1) * TORSO_SEGMENTS;
    indices.push(TORSO_CAP_BOTTOM, bottom + segment, bottom + next);
  }
  return indices;
})();

function TorsoRig({
  sampleRef,
  playbackRef,
}: {
  sampleRef: SampleRef;
  playbackRef: React.MutableRefObject<PlaybackState>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const idleTime = useRef(0);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array((TORSO_RINGS * TORSO_SEGMENTS + TORSO_CAPS) * 3),
        3,
      )
        .setUsage(THREE.DynamicDrawUsage),
    );
    g.setIndex(TORSO_INDICES);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLOR.volume,
        emissive: "#080f29",
        emissiveIntensity: 0.1,
        roughness: 0.38,
        metalness: 0.34,
        side: THREE.DoubleSide, flatShading: false,
      }),
    [],
  );
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (!playbackRef.current.playing) idleTime.current += Math.min(delta, 0.1);
    const P = sampleRef.current.pose;
    const ok = P[0 * 4 + 3] >= THRESH && P[1 * 4 + 3] >= THRESH && P[6 * 4 + 3] >= THRESH && P[7 * 4 + 3] >= THRESH;
    mesh.visible = ok;
    if (!ok) return;
    const shoulderCenterX = (P[0] + P[4]) / 2;
    const shoulderCenterY = (P[1] + P[5]) / 2;
    const shoulderCenterZ = (P[2] + P[6]) / 2;
    const hipCenterX = (P[6 * 4] + P[7 * 4]) / 2;
    const hipCenterY = (P[6 * 4 + 1] + P[7 * 4 + 1]) / 2 - 0.12;
    const hipCenterZ = (P[6 * 4 + 2] + P[7 * 4 + 2]) / 2;
    const shoulderHalfWidth = Math.max(
      Math.hypot(
        P[0] - P[4],
        P[1] - P[5],
        P[2] - P[6],
      ) * 0.52,
      0.12,
    );
    const hipHalfWidth = Math.max(Math.abs(P[6 * 4] - P[7 * 4]) * 0.52, 0.1);
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let ring = 0; ring < TORSO_RINGS; ring++) {
      const t = ring / (TORSO_RINGS - 1);
      const profile = TORSO_RING_PROFILE[ring];
      const centerX = THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, t);
      const centerY = THREE.MathUtils.lerp(shoulderCenterY, hipCenterY, t);
      const centerZ = THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, t);
      const idleBreath = playbackRef.current.playing
        ? 1
        : 1 + Math.sin(idleTime.current * 1.35) * 0.003;
      const halfWidth =
        THREE.MathUtils.lerp(shoulderHalfWidth, hipHalfWidth, t) * profile * idleBreath;
      const depth = Math.max(halfWidth * 0.62, 0.08);
      for (let segment = 0; segment < TORSO_SEGMENTS; segment++) {
        const angle = (segment / TORSO_SEGMENTS) * Math.PI * 2;
        const index = ring * TORSO_SEGMENTS + segment;
        pos.setXYZ(
          index,
          centerX + Math.cos(angle) * halfWidth,
          centerY,
          centerZ + Math.sin(angle) * depth,
        );
      }
    }
    pos.setXYZ(TORSO_CAP_TOP, shoulderCenterX, shoulderCenterY, shoulderCenterZ);
    pos.setXYZ(TORSO_CAP_BOTTOM, hipCenterX, hipCenterY, hipCenterZ);
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-1}
      castShadow
      receiveShadow
    />
  );
}

function HandRig({ slot, color, sampleRef }: { slot: 0 | 1; color: string; sampleRef: SampleRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const palmRef = useRef<THREE.Mesh>(null);
  const correction = useRef(new THREE.Vector3());

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

    correction.current.set(0, 0, 0);
    const P = st.pose;
    if (
      P[0 * 4 + 3] >= THRESH && P[1 * 4 + 3] >= THRESH &&
      P[6 * 4 + 3] >= THRESH && P[7 * 4 + 3] >= THRESH &&
      valid[0]
    ) {
      const shoulderY = (P[1] + P[5]) / 2;
      const hipY = (P[6 * 4 + 1] + P[7 * 4 + 1]) / 2;
      const shoulderCenterX = (P[0] + P[4]) / 2;
      const shoulderCenterZ = (P[2] + P[6]) / 2;
      const hipCenterX = (P[6 * 4] + P[7 * 4]) / 2;
      const hipCenterZ = (P[6 * 4 + 2] + P[7 * 4 + 2]) / 2;
      const wristT = THREE.MathUtils.clamp(
        (shoulderY - pts[1]) / Math.max(shoulderY - hipY, 1e-5),
        0,
        1,
      );
      const wristX = pts[0] - THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, wristT);
      const wristZ = pts[2] - THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, wristT);
      const directionLength = Math.hypot(wristX, wristZ);
      const directionX = directionLength > 1e-5 ? wristX / directionLength : (slot === 0 ? -1 : 1);
      const directionZ = directionLength > 1e-5 ? wristZ / directionLength : 0;
      let requiredOffset = 0;
      const shoulderWidth = Math.max(Math.hypot(
        P[0] - P[4],
        P[2] - P[6],
      ) * 0.52, 0.12);
      const hipWidth = Math.max(Math.abs(P[6 * 4] - P[7 * 4]) * 0.52, 0.1);

      for (let joint = 0; joint < 21; joint++) {
        if (!valid[joint]) continue;
        const offset = joint * 3;
        const t = THREE.MathUtils.clamp(
          (shoulderY - pts[offset + 1]) / Math.max(shoulderY - hipY, 1e-5),
          0,
          1,
        );
        if (pts[offset + 1] > shoulderY + 0.08 || pts[offset + 1] < hipY - 0.08) continue;
        const profile = t < 0.2
          ? THREE.MathUtils.lerp(0.72, 1.16, t / 0.2)
          : t < 0.6
            ? THREE.MathUtils.lerp(1.16, 1.14, (t - 0.2) / 0.4)
            : THREE.MathUtils.lerp(1.14, 1.04, (t - 0.6) / 0.4);
        const radiusX = Math.max(THREE.MathUtils.lerp(shoulderWidth, hipWidth, t) * profile, 0.09);
        const radiusZ = Math.max(radiusX * 0.62, 0.08);
        const relativeX = pts[offset] - THREE.MathUtils.lerp(shoulderCenterX, hipCenterX, t);
        const relativeZ = pts[offset + 2] - THREE.MathUtils.lerp(shoulderCenterZ, hipCenterZ, t);
        const a = directionX * directionX / (radiusX * radiusX) +
          directionZ * directionZ / (radiusZ * radiusZ);
        const b = 2 * (
          relativeX * directionX / (radiusX * radiusX) +
          relativeZ * directionZ / (radiusZ * radiusZ)
        );
        const c = relativeX * relativeX / (radiusX * radiusX) +
          relativeZ * relativeZ / (radiusZ * radiusZ) - 1;
        const discriminant = b * b - 4 * a * c;
        if (c < 0 && discriminant >= 0 && a > 0) {
          requiredOffset = Math.max(requiredOffset, (-b + Math.sqrt(discriminant)) / (2 * a));
        }
      }

      if (requiredOffset > 0) {
        const clearance = requiredOffset + 0.025;
        correction.current.set(directionX * clearance, 0, directionZ * clearance);
      }
    }
    group.position.copy(correction.current);

    for (let i = 0; i < HAND_CONN.length; i++) {
      const c = HAND_CONN[i];
      if (valid[c[0]] && valid[c[1]]) placeBone(bones, i, pts, c[0] * 3, pts, c[1] * 3, HAND_BONE_RADIUS[i]);
      else bones.setMatrixAt(i, ZERO_MATRIX);
    }
    bones.instanceMatrix.needsUpdate = true;
    for (let j = 0; j < 21; j++) {
      if (valid[j]) placeJoint(joints, j, pts, j * 3, HAND_JOINT_RADIUS[j]);
      else joints.setMatrixAt(j, ZERO_MATRIX);
    }
    joints.instanceMatrix.needsUpdate = true;

    palm.visible = valid[0] === 1;
    if (palm.visible) {
      const pos = palmGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let k = 0; k < PALM_FAN.length; k++) {
        const j = valid[PALM_FAN[k]] ? PALM_FAN[k] : 0;
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
  seq, sampleRef, playheadRef, playbackRef, fps, onFrame, loop, onComplete, restartToken,
}: {
  seq: SolvedSequence;
  sampleRef: SampleRef;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  fps: number;
  onFrame: (frame: number) => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
}) {
  const lastShown = useRef(-1);
  const lastPlayhead = useRef(-100);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    completed.current = false;
  }, [restartToken]);

  useFrame((_, delta) => {
    const n = seq.frames.length;
    if (n === 0) return;
    const dt = Math.min(delta, 0.1);
    const pb = playbackRef.current;
    let ph = playheadRef.current;
    if (pb.playing && n > 1) {
      ph += dt * fps * pb.speed;
      if (ph >= n) {
        if (loop) {
          ph %= n;
        } else {
          ph = n - 1;
          pb.playing = false;
          if (!completed.current) {
            completed.current = true;
            onCompleteRef.current?.();
          }
        }
      }
      playheadRef.current = ph;
    }
    ph = Math.min(Math.max(ph, 0), n - 1 + 0.999);
    const snap = Math.abs(ph - lastPlayhead.current) > 2.5;
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

type ViewKind =
  | "front" | "side" | "angle" | "reset"
  | "focusHands" | "focusFace";
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
    Math.max((halfH * 1.08) / t, (halfW * 1.08) / (t * Math.max(aspect, 0.2))) + halfD + 0.15;
  return { center, distance };
}

type OrbitControlsHandle = React.ElementRef<typeof OrbitControls>;

function CameraRig({
  bounds, command, horizontalOnly, sampleRef, viewResetToken,
}: {
  bounds: Bounds;
  command: ViewCommand;
  horizontalOnly: boolean;
  sampleRef: SampleRef;
  viewResetToken: number;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const controlsRef = useRef<OrbitControlsHandle>(null);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const focusRef = useRef<{ kind: "hands" | "face"; dist: number } | null>(null);
  const focusPoint = useRef(new THREE.Vector3());
  const focusInit = useRef(false);
  const interacted = useRef(false);
  const lastViewResetToken = useRef(viewResetToken);
  const dragging = useRef(false);
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

  useLayoutEffect(() => {
    interacted.current = false;
    goal.current = null;
    focusRef.current = null;
    focusInit.current = false;
    placeFront();
  }, [bounds, placeFront]);

  useEffect(() => {
    if (!interacted.current) placeFront();
  }, [framing.distance, placeFront]);

  useEffect(() => {
    const el = gl.domElement;
    const down = () => { dragging.current = true; };
    const up = () => { dragging.current = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  useEffect(() => {
    if (command.nonce === 0) return;
    const { center, distance: base } = framingRef.current;
    const ctl = controlsRef.current;
    const target = ctl ? ctl.target.clone() : center.clone();
    const offset = camera.position.clone().sub(target);
    const current = offset.length() || base;
    switch (command.kind) {
      case "front":
      case "side":
      case "angle":
        focusRef.current = null;
        goal.current = {
          pos: center.clone().addScaledVector(VIEW_DIRS[command.kind], current),
          target: center.clone(),
        };
        break;
      case "reset":
        interacted.current = false;
        focusRef.current = null;
        focusInit.current = false;
        goal.current = null;
        camera.position.copy(center).addScaledVector(VIEW_DIRS.front, base);
        if (ctl) {
          ctl.target.copy(center);
          ctl.update();
        } else {
          camera.lookAt(center);
        }
        break;
      case "focusHands":
      case "focusFace":
        interacted.current = true;
        goal.current = null;
        focusRef.current = {
          kind: command.kind === "focusHands" ? "hands" : "face",
          dist: framingRef.current.distance * 0.34,
        };
        focusInit.current = false;
        break;
    }
  }, [command, camera]);

  useEffect(() => {
    if (lastViewResetToken.current === viewResetToken) return;
    lastViewResetToken.current = viewResetToken;
    const { center, distance } = framingRef.current;
    interacted.current = false;
    focusRef.current = null;
    focusInit.current = false;
    goal.current = null;
    camera.position.copy(center).addScaledVector(VIEW_DIRS.front, distance);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(center);
      controls.update();
    } else {
      camera.lookAt(center);
    }
  }, [viewResetToken, camera]);

  useFrame((_, delta) => {
    const ctl = controlsRef.current;
    if (!ctl) return;

    (ctl as unknown as { zoomToCursor?: boolean }).zoomToCursor = !focusRef.current;

    if (focusRef.current) {
      const st = sampleRef.current;
      if (focusRef.current.kind === "face" && st.headValid) {
        _p.set(st.head[1], st.head[2], st.head[3]);
      } else {
        let nx = 0, ny = 0, nz = 0, n = 0;
        for (let h = 0; h < 2; h++) {
          if (st.handAlpha[h] > 0.4 && st.handValid[h][0] === 1) {
            nx += st.hands[h][0]; ny += st.hands[h][1]; nz += st.hands[h][2]; n++;
          }
        }
        if (n === 0) {
          const P = st.pose;
          for (const i of [15, 16]) {
            if (P[i * 4 + 3] >= THRESH) {
              nx += P[i * 4]; ny += P[i * 4 + 1]; nz += P[i * 4 + 2]; n++;
            }
          }
        }
        if (n === 0 && st.headValid) { nx = st.head[1]; ny = st.head[2]; nz = st.head[3]; n = 1; }
        if (n > 0) _p.set(nx / n, ny / n, nz / n);
        else _p.set(0, 0, 0);
      }
      if (!focusInit.current) { focusPoint.current.copy(_p); focusInit.current = true; }
      else focusPoint.current.lerp(_p, 1 - Math.exp(-delta * 6));

      const k = 1 - Math.exp(-delta * 7);
      ctl.target.lerp(focusPoint.current, k);
      _d.copy(camera.position).sub(ctl.target);
      if (_d.lengthSq() < 1e-6) _d.set(0, 0, 1);
      _d.normalize();
      camera.position.copy(ctl.target).addScaledVector(_d, focusRef.current.dist);
      ctl.update();
    } else {
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
    }

  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom
      enableDamping
      dampingFactor={0.1}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      screenSpacePanning
      enablePan
      minPolarAngle={horizontalOnly ? Math.PI / 2 : 0}
      maxPolarAngle={horizontalOnly ? Math.PI / 2 : Math.PI}
      minDistance={framing.distance / 7}
      maxDistance={framing.distance}
      onStart={() => {
        interacted.current = true;
        if (dragging.current) {
          goal.current = null;
          focusRef.current = null;
        }
      }}
    />
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
  onFail: () => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
  horizontalOnly: boolean;
  viewResetToken: number;
}

function SceneContent({
  seq, fps, hasPoseData, playheadRef, playbackRef, command, onFrame,
  loop, onComplete, restartToken, horizontalOnly, viewResetToken,
}: Omit<ViewerProps, "onFail">) {
  const sampleRef = useMemo<SampleRef>(() => ({ current: createSampleState() }), [seq]);
  return (
    <>
      <color attach="background" args={["#2B3D5B"]} />
      <hemisphereLight args={["#eaf0ff", "#182642", 0.82]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.45}
        color="#f5f4f1"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-4, 3, -4]} intensity={0.72} color="#9cbcff" />
      <directionalLight position={[3, 2, -2]} intensity={0.26} color="#55DDE0" />
      <PlaybackDriver
        seq={seq} sampleRef={sampleRef} playheadRef={playheadRef}
        playbackRef={playbackRef} fps={fps} onFrame={onFrame} loop={loop}
        onComplete={onComplete} restartToken={restartToken}
      />
      <CameraRig
        bounds={seq.bounds}
        command={command}
        horizontalOnly={horizontalOnly}
        sampleRef={sampleRef}
        viewResetToken={viewResetToken}
      />
      <RoundAlpanaStage seq={seq} />
      <TorsoRig sampleRef={sampleRef} playbackRef={playbackRef} />
      <HeadRig sampleRef={sampleRef} />
      <BodyRig sampleRef={sampleRef} pairs={hasPoseData ? RIG_POSE_PAIRS : RIG_GUIDE_PAIRS} />
      <DhutiRig sampleRef={sampleRef} />
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
          shadows="percentage"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{ fov: FOV, near: 0.05, far: 200, position: [0, 0, 6] }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.type = THREE.PCFShadowMap;
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
 * 8. PUBLIC COMPONENT
 * ========================================================================== */

interface LandmarkSimulationProps {
  frames?: number[][][];
  pose?: PosePoint[][];
  faceAvatar?: number[][][];
  fps?: number;
  title?: string;
  minimal?: boolean;
  loop?: boolean;
  onFrameChange?: (frame: number) => void;
  onComplete?: () => void;
  restartToken?: number;
  horizontalOnly?: boolean;
  autoPlay?: boolean;
  viewResetToken?: number;
}

const VIEW_BUTTONS: { label: string; kind: ViewKind }[] = [
  { label: "FRONT", kind: "front" },
  { label: "SIDE", kind: "side" },
  { label: "3/4", kind: "angle" },
  { label: "HANDS", kind: "focusHands" },
  { label: "FACE", kind: "focusFace" },
  { label: "RESET", kind: "reset" },
];

export function LandmarkSimulation({
  frames,
  pose,
  faceAvatar,
  fps = 15,
  title,
  minimal = false,
  loop = true,
  onFrameChange,
  onComplete,
  restartToken = 0,
  horizontalOnly = true, // same stage angle everywhere => both viewers match
  autoPlay = true,
  viewResetToken = 0,
}: LandmarkSimulationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [viewerFailed, setViewerFailed] = useState(false);
  const [viewCommand, setViewCommand] = useState<ViewCommand>({ kind: "reset", nonce: 0 });

  const playheadRef = useRef(0);
  const playbackRef = useRef<PlaybackState>({ playing: autoPlay, speed: 1 });
  playbackRef.current.playing = minimal ? autoPlay : isPlaying;
  playbackRef.current.speed = playbackSpeed;
  const lastRestartTokenRef = useRef(restartToken);

  const totalFrames = frames?.length ?? 0;
  const poseAlignments = useMemo(
    () => (pose?.length ? getPoseAlignments(pose) : undefined),
    [pose],
  );
  const seq = useMemo(
    () =>
      frames?.length
        ? solveSequence(frames, pose, poseAlignments, faceAvatar)
        : null,
    [frames, pose, poseAlignments, faceAvatar],
  );

  const mode: "pending" | "3d" | "unavailable" =
    webgl === null ? "pending" : webgl && !viewerFailed && seq ? "3d" : "unavailable";

  const currentFrameData = frames?.[currentFrame];
  const currentHandsCount = currentFrameData
    ? [0, 21].filter((offset) => !isMissingHand(currentFrameData, offset)).length
    : 0;
  const currentFaceAvatarCount = faceAvatar?.[currentFrame]?.length ?? 0;
  const displayTitle = title?.replace(/^.*onnx_models[\\/]\d+[:/\\]?/i, "") ?? title;

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  useEffect(() => {
    if (playheadRef.current >= totalFrames) {
      playheadRef.current = 0;
      setCurrentFrame(0);
    }
  }, [totalFrames]);

  useEffect(() => {
    if (lastRestartTokenRef.current === restartToken) return;
    lastRestartTokenRef.current = restartToken;
    playheadRef.current = 0;
    playbackRef.current.playing = true;
    setIsPlaying(true);
    setCurrentFrame(0);
  }, [restartToken]);

  const handleFrame = useCallback((frame: number) => {
    setCurrentFrame(frame);
    onFrameChange?.(frame);
  }, [onFrameChange]);
  const handleFail = useCallback(() => setViewerFailed(true), []);
  const sendView = (kind: ViewKind) =>
    setViewCommand((c) => ({ kind, nonce: c.nonce + 1 }));

  const seek = (value: number) => {
    playheadRef.current = value;
    setCurrentFrame(value);
  };

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
    <div className={minimal
      ? "relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-background"
      : "bg-surface border border-border rounded-md overflow-hidden flex flex-col"}>
      {!minimal && <div className="flex min-w-0 flex-nowrap items-center gap-x-2 overflow-hidden whitespace-nowrap border-b border-border bg-surface-elevated/50 px-3 py-2 tech-mono text-[11px] text-text-secondary">
        <span className="shrink-0">
          Frame: <strong className="text-text-primary">{currentFrame + 1}/{totalFrames}</strong>
        </span>
        <span className="shrink-0" aria-hidden="true">|</span>
        <span className="shrink-0">FPS: <strong className="text-accent-primary">{fps}</strong></span>
        <span className="shrink-0" aria-hidden="true">|</span>
        <span className="shrink-0">
          Hands: <strong className="text-status-approved">{currentHandsCount}</strong>
        </span>
        <span className="shrink-0" aria-hidden="true">|</span>
        {pose?.length ? (
          <span className="shrink-0">
            Pose: <strong className="text-[#818CF8]">{POSE_POINTS}</strong>
          </span>
        ) : (
          <span className="shrink-0 text-[#818CF8]">Body guide</span>
        )}
        {currentFaceAvatarCount > 0 ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-sky-300">Face: {currentFaceAvatarCount}</span>
          </>
        ) : faceAvatar ? (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="shrink-0 text-text-muted">No face</span>
          </>
        ) : null}
        {displayTitle && (
          <>
            <span className="shrink-0" aria-hidden="true">|</span>
            <span className="min-w-0 truncate text-accent-secondary" title={title}>
              {displayTitle}
            </span>
          </>
        )}
      </div>}

      <div className={minimal
        ? "absolute inset-0 flex items-center justify-center canvas-grid-bg overflow-hidden"
        : "relative aspect-video w-full bg-background flex items-center justify-center canvas-grid-bg overflow-hidden"}>
        {mode === "3d" && seq && (
          <Skeleton3DViewer
            seq={seq}
            fps={fps}
            hasPoseData={Boolean(pose?.length)}
            playheadRef={playheadRef}
            playbackRef={playbackRef}
            command={viewCommand}
            onFrame={handleFrame}
            onFail={handleFail}
            loop={loop}
            onComplete={onComplete}
            restartToken={restartToken}
            horizontalOnly={horizontalOnly}
            viewResetToken={viewResetToken}
          />
        )}
        {mode === "unavailable" && (
          <div className="px-6 text-center text-[11px] text-text-muted">
            The 3D viewer needs WebGL, which is not available in this browser.
          </div>
        )}

        {!minimal && (
          <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1 tech-mono">
            {mode === "3d" &&
              VIEW_BUTTONS.map(({ label, kind }) => (
                <button key={kind} type="button" onClick={() => sendView(kind)} className={overlayButton}>
                  {label}
                </button>
              ))}
          </div>
        )}
      </div>

      {!minimal && <div className="p-3 bg-surface-elevated/50 border-t border-border flex items-center justify-between tech-mono text-xs">
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
        </div>

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
      </div>}
    </div>
  );
}