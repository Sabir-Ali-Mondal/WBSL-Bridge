"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { THRESH } from "./simulationConstants";
import {
  getBoneGeometry,
  getHeadGeometry,
  getJointGeometry,
  hideAll,
  placeBone,
  placeJoint,
  ZERO_MATRIX,
} from "./RigUtils";

export const FACE_POINTS = 19;
export const HEAD_LEN = 11;

export interface SampleState {
  pose: Float32Array;
  poseInit: Uint8Array;
  hands: [Float32Array, Float32Array];
  handValid: [Uint8Array, Uint8Array];
  handInit: Uint8Array;
  handAlpha: Float32Array;
  face: Float32Array;
  faceValid: Uint8Array;
  faceInit: Uint8Array;
  head: Float32Array;
  headValid: boolean;
  headInit: boolean;
  facePresent: boolean;
  hasPose: boolean;
}

export type SampleRef = { current: SampleState };

const FACE_CURVES: { points: number[]; closed: boolean; steps: number }[] = [
  { points: [0, 2, 1, 3], closed: true, steps: 8 },
  { points: [4, 5, 6], closed: false, steps: 6 },
  { points: [7, 8, 9], closed: false, steps: 6 },
  { points: [15, 17, 16, 18], closed: true, steps: 6 },
];
const EYE_CURVE_STEPS = 16;
const FACE_NOSE_SEGMENTS = 4;
const FACE_SEGMENT_COUNT =
  FACE_CURVES.reduce(
    (total, curve) =>
      total +
      (curve.closed ? curve.points.length : curve.points.length - 1) * curve.steps,
    0,
  ) + 2 * EYE_CURVE_STEPS + FACE_NOSE_SEGMENTS;

function catmullRomCoordinate(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
    (-p0 + 3 * p1 - 3 * p2 + p3) * t3
  );
}

function writeFaceCurve(
  positions: THREE.BufferAttribute,
  face: Float32Array,
  path: number[],
  closed: boolean,
  steps: number,
  segmentOffset: number,
): number {
  const count = path.length;
  const segmentCount = closed ? count : count - 1;
  for (let segment = 0; segment < segmentCount; segment++) {
    const p0 = path[closed ? (segment - 1 + count) % count : Math.max(segment - 1, 0)];
    const p1 = path[segment];
    const p2 = path[(segment + 1) % count];
    const p3 = path[closed ? (segment + 2) % count : Math.min(segment + 2, count - 1)];
    for (let step = 0; step < steps; step++) {
      const t0 = step / steps;
      const t1 = (step + 1) / steps;
      const vertex = (segmentOffset + segment * steps + step) * 2;
      for (let endpoint = 0; endpoint < 2; endpoint++) {
        const t = endpoint === 0 ? t0 : t1;
        const target = vertex + endpoint;
        positions.setXYZ(
          target,
          catmullRomCoordinate(face[p0 * 3], face[p1 * 3], face[p2 * 3], face[p3 * 3], t),
          catmullRomCoordinate(face[p0 * 3 + 1], face[p1 * 3 + 1], face[p2 * 3 + 1], face[p3 * 3 + 1], t),
          catmullRomCoordinate(face[p0 * 3 + 2], face[p1 * 3 + 2], face[p2 * 3 + 2], face[p3 * 3 + 2], t),
        );
      }
    }
  }
  return segmentOffset + segmentCount * steps;
}

function writeEyeCurve(
  positions: THREE.BufferAttribute,
  face: Float32Array,
  startSegment: number,
  upperIndex: number,
  lowerIndex: number,
  halfWidth: number,
): void {
  const centerX = (face[upperIndex * 3] + face[lowerIndex * 3]) / 2;
  const centerY = (face[upperIndex * 3 + 1] + face[lowerIndex * 3 + 1]) / 2;
  const centerZ = (face[upperIndex * 3 + 2] + face[lowerIndex * 3 + 2]) / 2 + 0.006;
  const halfHeight =
    Math.hypot(
      face[upperIndex * 3] - face[lowerIndex * 3],
      face[upperIndex * 3 + 1] - face[lowerIndex * 3 + 1],
    ) * 1.15;
  for (let segment = 0; segment < EYE_CURVE_STEPS; segment++) {
    for (let endpoint = 0; endpoint < 2; endpoint++) {
      const angle = ((segment + endpoint) / EYE_CURVE_STEPS) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      positions.setXYZ(
        (startSegment + segment) * 2 + endpoint,
        centerX + x * halfWidth,
        centerY + y * halfHeight * (0.68 + 0.32 * Math.abs(x)),
        centerZ,
      );
    }
  }
}

const NECK_RADIUS = 0.1;
const NECK_SEGMENTS = 5;

export function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const neckStart = useRef(new Float32Array(3));
  const neckEnd = useRef(new Float32Array(3));
  const shoulderStart = useRef(new Float32Array(3));
  const headEnd = useRef(new Float32Array(3));
  const neckColor = useMemo(() => new THREE.Color(), []);
  const headMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#172a47",
        transparent: true,
        opacity: 0.13,
        roughness: 0.55,
        metalness: 0.05,
        depthWrite: false,
      }),
    [],
  );
  const neckMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#5678bd",
      metalness: 0.34,
      roughness: 0.3,
      emissive: "#10213f",
      emissiveIntensity: 0.08,
    }),
    [],
  );
  useEffect(() => () => { headMat.dispose(); neckMat.dispose(); }, [headMat, neckMat]);
  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;
    head.visible = st.headValid && !st.facePresent;
    if (!st.headValid) {
      hideAll(neck);
      return;
    }
    const H = st.head;
    head.position.set(H[1], H[2], H[3]);
    head.scale.set(H[4] / 2, H[5] / 2, H[6] / 2);
    head.rotation.z = H[10];

    const P = st.pose;
    if (P[0 * 4 + 3] >= THRESH && P[1 * 4 + 3] >= THRESH) {
      shoulderStart.current[0] = (P[0] + P[4]) / 2;
      shoulderStart.current[1] = (P[1] + P[5]) / 2;
      shoulderStart.current[2] = (P[2] + P[6]) / 2;
      headEnd.current[0] = H[7];
      headEnd.current[1] = H[8];
      headEnd.current[2] = H[9];
      const dx = headEnd.current[0] - shoulderStart.current[0];
      const dy = headEnd.current[1] - shoulderStart.current[1];
      const dz = headEnd.current[2] - shoulderStart.current[2];
      for (let index = 0; index < NECK_SEGMENTS; index++) {
        const start = (index + 0.08) / NECK_SEGMENTS;
        const end = (index + 0.92) / NECK_SEGMENTS;
        neckStart.current[0] = shoulderStart.current[0] + dx * start;
        neckStart.current[1] = shoulderStart.current[1] + dy * start;
        neckStart.current[2] = shoulderStart.current[2] + dz * start;
        neckEnd.current[0] = shoulderStart.current[0] + dx * end;
        neckEnd.current[1] = shoulderStart.current[1] + dy * end;
        neckEnd.current[2] = shoulderStart.current[2] + dz * end;
        placeBone(
          neck,
          index,
          neckStart.current,
          0,
          neckEnd.current,
          0,
          NECK_RADIUS * (0.9 + 0.1 * Math.sin((index / (NECK_SEGMENTS - 1)) * Math.PI)),
        );
        neck.setColorAt(
          index,
          neckColor.set(index === 0 || index === NECK_SEGMENTS - 1 ? "#64cbd6" : "#274566"),
        );
      }
    } else {
      hideAll(neck);
    }
    neck.instanceMatrix.needsUpdate = true;
    if (neck.instanceColor) neck.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <mesh
        ref={headRef}
        geometry={getHeadGeometry()}
        material={headMat}
        frustumCulled={false}
        renderOrder={-1}
        castShadow
      />
      <instancedMesh
        ref={neckRef}
        args={[getBoneGeometry(), neckMat, NECK_SEGMENTS]}
        frustumCulled={false}
        castShadow
      />
    </group>
  );
}

export function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const keysRef = useRef<THREE.InstancedMesh>(null);
  const eyeCenters = useMemo(() => new Float32Array(6), []);

  const lineGeo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(FACE_SEGMENT_COUNT * 6),
        3,
      ).setUsage(THREE.DynamicDrawUsage),
    );
    return geometry;
  }, []);
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#59F4FF", transparent: true, opacity: 0.96 }),
    [],
  );
  const keyMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#BDFBFF",
      emissive: "#38DDF0",
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.05,
    }),
    [],
  );
  useEffect(
    () => () => { lineGeo.dispose(); lineMat.dispose(); keyMat.dispose(); },
    [lineGeo, lineMat, keyMat],
  );
  useLayoutEffect(() => hideAll(keysRef.current), []);

  useFrame(() => {
    const lines = linesRef.current;
    const keys = keysRef.current;
    if (!lines || !keys) return;
    const st = sampleRef.current;
    lines.visible = st.facePresent;
    keys.visible = st.facePresent;
    const positions = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const face = st.face;
    let segmentOffset = 0;
    for (const curve of FACE_CURVES) {
      const segmentCount =
        (curve.closed ? curve.points.length : curve.points.length - 1) * curve.steps;
      if (curve.points.every((point) => st.faceValid[point])) {
        segmentOffset = writeFaceCurve(
          positions,
          face,
          curve.points,
          curve.closed,
          curve.steps,
          segmentOffset,
        );
      } else {
        for (let segment = 0; segment < segmentCount; segment++) {
          positions.setXYZ((segmentOffset + segment) * 2, 0, 0, 0);
          positions.setXYZ((segmentOffset + segment) * 2 + 1, 0, 0, 0);
        }
        segmentOffset += segmentCount;
      }
    }
    const eyesAvailable = [10, 11, 12, 13].every((index) => st.faceValid[index]);
    let eyeGap = 0;
    let leftAperture = 0;
    let rightAperture = 0;
    if (eyesAvailable) {
      const leftX = (face[10 * 3] + face[11 * 3]) / 2;
      const leftY = (face[10 * 3 + 1] + face[11 * 3 + 1]) / 2;
      const rightX = (face[12 * 3] + face[13 * 3]) / 2;
      const rightY = (face[12 * 3 + 1] + face[13 * 3 + 1]) / 2;
      eyeGap = Math.hypot(rightX - leftX, rightY - leftY);
      const halfWidth = THREE.MathUtils.clamp(eyeGap * 0.27, 0.008, 0.035);
      leftAperture = Math.hypot(
        face[10 * 3] - face[11 * 3],
        face[10 * 3 + 1] - face[11 * 3 + 1],
      );
      rightAperture = Math.hypot(
        face[12 * 3] - face[13 * 3],
        face[12 * 3 + 1] - face[13 * 3 + 1],
      );
      writeEyeCurve(positions, face, segmentOffset, 10, 11, halfWidth);
      writeEyeCurve(
        positions,
        face,
        segmentOffset + EYE_CURVE_STEPS,
        12,
        13,
        halfWidth,
      );
      segmentOffset += EYE_CURVE_STEPS * 2;

      eyeCenters.set([
        leftX,
        leftY,
        (face[10 * 3 + 2] + face[11 * 3 + 2]) / 2 + 0.012,
        rightX,
        rightY,
        (face[12 * 3 + 2] + face[13 * 3 + 2]) / 2 + 0.012,
      ]);
      if (st.faceValid[14]) {
        const noseX = face[14 * 3];
        const noseY = face[14 * 3 + 1];
        const noseZ = face[14 * 3 + 2] + 0.008;
        const length = eyeGap * 0.12;
        for (let segment = 0; segment < FACE_NOSE_SEGMENTS; segment++) {
          const top = 1 - segment / FACE_NOSE_SEGMENTS;
          const bottom = 1 - (segment + 1) / FACE_NOSE_SEGMENTS;
          positions.setXYZ((segmentOffset + segment) * 2, noseX, noseY + length * top, noseZ);
          positions.setXYZ(
            (segmentOffset + segment) * 2 + 1,
            noseX,
            noseY + length * bottom,
            noseZ,
          );
        }
      } else {
        for (let segment = 0; segment < FACE_NOSE_SEGMENTS; segment++) {
          positions.setXYZ((segmentOffset + segment) * 2, 0, 0, 0);
          positions.setXYZ((segmentOffset + segment) * 2 + 1, 0, 0, 0);
        }
      }
      segmentOffset += FACE_NOSE_SEGMENTS;
    } else {
      const emptySegments = EYE_CURVE_STEPS * 2 + FACE_NOSE_SEGMENTS;
      for (let segment = 0; segment < emptySegments; segment++) {
        positions.setXYZ((segmentOffset + segment) * 2, 0, 0, 0);
        positions.setXYZ((segmentOffset + segment) * 2 + 1, 0, 0, 0);
      }
      segmentOffset += emptySegments;
      eyeCenters.fill(0);
    }
    positions.needsUpdate = true;
    for (let index = 0; index < 2; index++) {
      if (eyesAvailable) {
        const aperture = index === 0 ? leftAperture : rightAperture;
        const eyeScale = eyeGap > 0
          ? THREE.MathUtils.clamp(aperture / (eyeGap * 0.12), 0, 1)
          : 0;
        placeJoint(keys, index, eyeCenters, index * 3, 0.008 * eyeScale);
      } else {
        keys.setMatrixAt(index, ZERO_MATRIX);
      }
    }
    keys.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments
        ref={linesRef}
        geometry={lineGeo}
        material={lineMat}
        frustumCulled={false}
      />
      <instancedMesh
        ref={keysRef}
        args={[getJointGeometry(), keyMat, 2]}
        frustumCulled={false}
      />
    </group>
  );
}
