"use client";
import "@/lib/threeSetup";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Play, Pause, RotateCcw, Database } from "lucide-react";
import { DhutiRig } from "./DhutiRig";
import { ArmRig, HandRig } from "./HandRig";
import { RoundAlpanaStage } from "./AlpanaStage";
import { TorsoRig } from "./TorsoRig";
import { SIMULATION_FOV, SimulationRoom } from "./SimulationRoom";
import {
  DHUTI_DROP,
  HEAD_WIDTH_RATIO,
  THRESH,
  TORSO_WORLD,
} from "./simulationConstants";
import { FaceRig, HeadRig, FACE_POINTS, HEAD_LEN, type SampleRef, type SampleState } from "./HeadFaceRig";
export type { SampleRef } from "./HeadFaceRig";
import {
  POSE_POINTS,
  type PosePoint,
} from "@/lib/pose";

/* ==========================================================================
 * 1. EXISTING DATA / ALIGNMENT LOGIC (unchanged)
 * ========================================================================== */

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

const Z_POSE = 0.15;
const Z_HAND = 0.5;
const Z_LIMIT = 0.4;
const SNAP_MAX_TORSOS = 1.0;

/* Keep the dhuti knee-length and independent of leg landmarks so pose noise
 * cannot stretch or shorten the garment. */
const COLOR = {
  handLeft: "#5EEAD4",
  handRight: "#C4B5FD",
} as const;

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
  const shoulderWidth = Math.hypot(
    pose[4] - pose[0],
    pose[5] - pose[1],
    pose[6] - pose[2],
  );
  const dx = pose[4] - pose[0];
  const dy = pose[5] - pose[1];
  const cx = (pose[0] + pose[4]) / 2;
  const shoulderY = (pose[1] + pose[5]) / 2;
  const torsoLength = vis(6) && vis(7)
    ? Math.hypot(
        cx - (pose[6 * 4] + pose[7 * 4]) / 2,
        shoulderY - (pose[6 * 4 + 1] + pose[7 * 4 + 1]) / 2,
        (pose[2] + pose[6]) / 2 - (pose[6 * 4 + 2] + pose[7 * 4 + 2]) / 2,
      )
    : 0;
  const width = Math.max(
    torsoLength > 0.1 ? torsoLength * HEAD_WIDTH_RATIO : shoulderWidth * 0.62,
    0.2,
  );
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
      const sourceHeight = Math.abs(forehead[1] - chin[1]);
      if (sourceWidth > 1e-5 && sourceHeight > 1e-5) {
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
        const faceHeightScale =
          head[5] /
          (sourceHeight * (alignment?.scale ?? 1) * S);
        const cos = Math.cos(head[10]);
        const sin = Math.sin(head[10]);
        const noseZ = Number.isFinite(faceAvatar[14]?.[2]) ? faceAvatar[14][2] : 0;
        const stabilizedChin = alignment ? stabilizePoint(chin, alignment) : {
          x: chin[0],
          y: chin[1],
        };
        const chinX = (stabilizedChin.x - faceCenter.x) * S * faceScale;
        const chinY = -(stabilizedChin.y - faceCenter.y) * S * faceHeightScale;
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
          const localY = -(stabilized.y - faceCenter.y) * S * faceHeightScale;
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
/* ==========================================================================
 * 6. 3D: RIG COMPONENTS
 * ========================================================================== */

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
  const t = Math.tan(THREE.MathUtils.degToRad(SIMULATION_FOV) / 2);
  const distance =
    Math.max((halfH * 1.08) / t, (halfW * 1.08) / (t * Math.max(aspect, 0.2))) + halfD + 0.15;
  return { center, distance };
}

type OrbitControlsHandle = React.ElementRef<typeof OrbitControls>;

function CameraRig({
  bounds, command, defaultCameraDistanceScale, defaultCameraVerticalOffset,
  horizontalOnly, sampleRef, viewResetToken,
}: {
  bounds: Bounds;
  command: ViewCommand;
  defaultCameraDistanceScale: number;
  defaultCameraVerticalOffset: number;
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

  const getDefaultView = useCallback(() => {
    const { center, distance } = framingRef.current;
    const viewDistance = distance * defaultCameraDistanceScale;
    const target = center.clone();
    target.y +=
      defaultCameraVerticalOffset *
      2 *
      viewDistance *
      Math.tan(THREE.MathUtils.degToRad(SIMULATION_FOV) / 2);
    return { target, distance: viewDistance };
  }, [defaultCameraDistanceScale, defaultCameraVerticalOffset]);

  const placeFront = useCallback(() => {
    const { target, distance } = getDefaultView();
    camera.position.copy(target).addScaledVector(VIEW_DIRS.front, distance);
    const ctl = controlsRef.current;
    if (ctl) {
      ctl.target.copy(target);
      ctl.update();
    } else {
      camera.lookAt(target);
    }
  }, [camera, getDefaultView]);

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
    const { target, distance: base } = getDefaultView();
    const ctl = controlsRef.current;
    const currentTarget = ctl ? ctl.target.clone() : target.clone();
    const offset = camera.position.clone().sub(currentTarget);
    const current = offset.length() || base;
    switch (command.kind) {
      case "front":
      case "side":
      case "angle":
        focusRef.current = null;
        goal.current = {
          pos: target.clone().addScaledVector(VIEW_DIRS[command.kind], current),
          target: target.clone(),
        };
        break;
      case "reset":
        interacted.current = false;
        focusRef.current = null;
        focusInit.current = false;
        goal.current = null;
        camera.position.copy(target).addScaledVector(VIEW_DIRS.front, base);
        if (ctl) {
          ctl.target.copy(target);
          ctl.update();
        } else {
          camera.lookAt(target);
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
  }, [command, camera, getDefaultView]);

  useEffect(() => {
    if (lastViewResetToken.current === viewResetToken) return;
    lastViewResetToken.current = viewResetToken;
    const { target, distance } = getDefaultView();
    interacted.current = false;
    focusRef.current = null;
    focusInit.current = false;
    goal.current = null;
    camera.position.copy(target).addScaledVector(VIEW_DIRS.front, distance);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(target);
      controls.update();
    } else {
      camera.lookAt(target);
    }
  }, [viewResetToken, camera, getDefaultView]);

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

function SceneContent({
  seq, fps, playheadRef, playbackRef, command, onFrame,
  loop, onComplete, restartToken, defaultCameraDistanceScale, defaultCameraVerticalOffset,
  horizontalOnly, viewResetToken,
}: {
  seq: SolvedSequence;
  fps: number;
  playheadRef: React.MutableRefObject<number>;
  playbackRef: React.MutableRefObject<PlaybackState>;
  command: ViewCommand;
  onFrame: (frame: number) => void;
  loop: boolean;
  onComplete?: () => void;
  restartToken: number;
  defaultCameraDistanceScale: number;
  defaultCameraVerticalOffset: number;
  horizontalOnly: boolean;
  viewResetToken: number;
}) {
  const sampleRef = useMemo<SampleRef>(() => ({ current: createSampleState() }), [seq]);
  return (
    <>
      <PlaybackDriver
        seq={seq} sampleRef={sampleRef} playheadRef={playheadRef}
        playbackRef={playbackRef} fps={fps} onFrame={onFrame} loop={loop}
        onComplete={onComplete} restartToken={restartToken}
      />
      <CameraRig
        bounds={seq.bounds}
        command={command}
        defaultCameraDistanceScale={defaultCameraDistanceScale}
        defaultCameraVerticalOffset={defaultCameraVerticalOffset}
        horizontalOnly={horizontalOnly}
        sampleRef={sampleRef}
        viewResetToken={viewResetToken}
      />
      <RoundAlpanaStage seq={seq} />
      <TorsoRig sampleRef={sampleRef} playbackRef={playbackRef} />
      <HeadRig sampleRef={sampleRef} />
      <ArmRig sampleRef={sampleRef} />
      <DhutiRig sampleRef={sampleRef} />
      <FaceRig sampleRef={sampleRef} />
      <HandRig slot={0} color={COLOR.handLeft} sampleRef={sampleRef} />
      <HandRig slot={1} color={COLOR.handRight} sampleRef={sampleRef} />
    </>
  );
}

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
  defaultCameraDistanceScale?: number;
  defaultCameraVerticalOffset?: number;
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
  defaultCameraDistanceScale = 1,
  defaultCameraVerticalOffset = 0,
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
          <SimulationRoom onFail={handleFail}>
            <SceneContent
              seq={seq}
              fps={fps}
              defaultCameraDistanceScale={defaultCameraDistanceScale}
              defaultCameraVerticalOffset={defaultCameraVerticalOffset}
              playheadRef={playheadRef}
              playbackRef={playbackRef}
              command={viewCommand}
              onFrame={handleFrame}
              loop={loop}
              onComplete={onComplete}
              restartToken={restartToken}
              horizontalOnly={horizontalOnly}
              viewResetToken={viewResetToken}
            />
          </SimulationRoom>
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