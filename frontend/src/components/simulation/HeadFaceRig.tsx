"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { THRESH } from "./simulationConstants";
import {
  getBoneGeometry,
  hideAll,
  placeBone,
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

// Curve segment counts
const BROW_STEPS = 10;
const EYE_STEPS = 28;
const PUPIL_STEPS = 16;
const SPARKLE_STEPS = 8;
const NOSE_SEGMENTS = 4;
const LIP_STEPS = 20;
const NECK_SEGMENTS = 4;

const FACE_SEGMENTS = 240;

// ---------------------------------------------------------------------------
// Head Shell Tuning
// ---------------------------------------------------------------------------
const HEAD_FIT_X = 1.26;
const HEAD_FIT_Y = 1.06;
const HEAD_DEPTH = 0.62;
const HEAD_BACK = 0.48;
const HEAD_FOLLOW = 0.45;
const HEAD_SCALE_FOLLOW = 0.12;

// Downward pitch correction (~5.5 degrees) so head looks straight forward
const PITCH_DOWN = 0.095;
const cosPitch = Math.cos(PITCH_DOWN);
const sinPitch = Math.sin(PITCH_DOWN);

export const HEAD_FACING = {
  center: new THREE.Vector3(),
  front: new THREE.Vector3(0, 0, 1),
  right: new THREE.Vector3(1, 0, 0),
  valid: false,
};

function createCleanCuteHeadGeometry(): THREE.BufferGeometry {
  const base = new THREE.SphereGeometry(1, 64, 48);
  base.deleteAttribute("normal");
  base.deleteAttribute("uv");
  const pos = base.getAttribute("position") as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Superellipsoid squircle rounding
    const n = 2.75;
    const sum = Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n);
    const r = Math.pow(sum, -1 / n);

    let nx = x * r;
    let ny = y * r;
    let nz = z * r;

    // Gentle bottom taper
    if (ny < 0) {
      const taper = 1.0 - 0.1 * Math.pow(-ny, 1.5);
      nx *= taper;
      nz *= taper;
    }

    pos.setXYZ(i, nx, ny, nz);
  }

  const merged = mergeVertices(base, 1e-4);
  merged.computeVertexNormals();
  base.dispose();
  return merged;
}

function createExteriorEarGeometry(): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(0.14, 0.18, 0.08, 32);
  geo.rotateZ(Math.PI / 2);
  geo.translate(0.04, 0, 0);
  return geo;
}

// ---------------------------------------------------------------------------
// Frosted Glass Shader: Reduced Inner Blue Core + Luminous Mint Rim
// ---------------------------------------------------------------------------
function createHeadMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: THREE.FrontSide,
    blending: THREE.NormalBlending,
    uniforms: {
      uInnerGlow: { value: new THREE.Color("#050f1a") },
      uCoreGlow: { value: new THREE.Color("#0b4e78") },
      uRimColor: { value: new THREE.Color("#5effdc") },
      uHazeColor: { value: new THREE.Color("#4effd3") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uInnerGlow;
      uniform vec3 uRimColor;
      uniform vec3 uCoreGlow;
      uniform vec3 uHazeColor;
      varying vec3 vNormal;
      varying vec3 vView;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vView);

        float grain = (hash(gl_FragCoord.xy * 0.75) - 0.5) * 0.035;
        float NdotV = clamp(abs(dot(N, V)) + grain, 0.0, 1.0);
        float fresnel = 1.0 - NdotV;

        float softMist = smoothstep(0.04, 0.88, fresnel);
        float blurredRim = pow(softMist, 1.45);
        float deepGlow = pow(fresnel, 0.9) * 0.35;

        vec3 color = mix(uInnerGlow, uCoreGlow, deepGlow);
        color = mix(color, uHazeColor, pow(fresnel, 2.5) * 0.25);
        color = mix(color, uRimColor, blurredRim);

        float alpha = clamp(0.60 + blurredRim * 0.40, 0.0, 1.0);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

// ---------------------------------------------------------------------------
// Head Rig Component
// ---------------------------------------------------------------------------
export function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const neckColor = useMemo(() => new THREE.Color(), []);

  const tmp = useMemo(
    () => ({
      top: new THREE.Vector3(),
      bottom: new THREE.Vector3(),
      sideA: new THREE.Vector3(),
      sideB: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      front: new THREE.Vector3(),
      center: new THREE.Vector3(),
      target: new THREE.Vector3(),
      basis: new THREE.Matrix4(),
      quat: new THREE.Quaternion(),
      scale: new THREE.Vector3(),
      wasFace: false,
      shoulderPt: new THREE.Vector3(),
      headBasePt: new THREE.Vector3(),
      tangent0: new THREE.Vector3(),
      tangent1: new THREE.Vector3(),
      pA: new THREE.Vector3(),
      pB: new THREE.Vector3(),
      arrA: new Float32Array(3),
      arrB: new Float32Array(3),
    }),
    [],
  );

  const headGeo = useMemo(() => createCleanCuteHeadGeometry(), []);
  const earGeo = useMemo(() => createExteriorEarGeometry(), []);
  const headMat = useMemo(() => createHeadMaterial(), []);

  const neckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c3863",
        emissive: "#091c36",
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.25,
      }),
    [],
  );

  useEffect(() => () => {
    headGeo.dispose(); earGeo.dispose(); headMat.dispose(); neckMat.dispose();
  }, [headGeo, earGeo, headMat, neckMat]);

  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;

    head.visible = st.headValid;
    if (!st.headValid) {
      HEAD_FACING.valid = false;
      hideAll(neck);
      return;
    }

    const F = st.face;
    const P = st.pose;
    const fv = st.faceValid;
    const faceFit = st.facePresent && !!fv[0] && !!fv[1] && !!fv[2] && !!fv[3];

    if (faceFit) {
      const { top, bottom, sideA, sideB, right, up, front, center, target, basis, quat, scale } = tmp;
      top.set(F[0], F[1], F[2]);
      bottom.set(F[3], F[4], F[5]);
      sideA.set(F[6], F[7], F[8]);
      sideB.set(F[9], F[10], F[11]);

      up.subVectors(top, bottom);
      right.subVectors(sideB, sideA);
      if (up.y < 0) up.negate();
      if (right.x < 0) right.negate();
      const height = up.length();
      const width = right.length();
      up.normalize();
      right.addScaledVector(up, -right.dot(up)).normalize();
      front.crossVectors(right, up).normalize();

      // Pitch adjustment: rotates front vector slightly down and up vector forward
      const pitchedUp = up.clone().multiplyScalar(cosPitch).addScaledVector(front, sinPitch).normalize();
      const pitchedFront = front.clone().multiplyScalar(cosPitch).addScaledVector(up, -sinPitch).normalize();
      up.copy(pitchedUp);
      front.copy(pitchedFront);

      basis.makeBasis(right, up, front);
      quat.setFromRotationMatrix(basis);

      center.copy(top).add(bottom).add(sideA).add(sideB).multiplyScalar(0.25);

      const radiusX = (width / 2) * HEAD_FIT_X;
      const radiusY = (height / 2) * HEAD_FIT_Y;
      const radiusZ = ((radiusX + radiusY) / 2) * HEAD_DEPTH;

      scale.set(radiusX, radiusY, radiusZ);
      target.copy(center).addScaledVector(front, -radiusZ * HEAD_BACK);

      if (!tmp.wasFace) {
        head.position.copy(target);
        head.quaternion.copy(quat);
        head.scale.copy(scale);
      } else {
        head.position.lerp(target, HEAD_FOLLOW);
        head.quaternion.slerp(quat, HEAD_FOLLOW);
        head.scale.lerp(scale, HEAD_SCALE_FOLLOW);
      }
      tmp.wasFace = true;
      HEAD_FACING.center.copy(center);
      HEAD_FACING.front.set(0, 0, 1).applyQuaternion(head.quaternion);
      HEAD_FACING.right.set(1, 0, 0).applyQuaternion(head.quaternion);
      HEAD_FACING.valid = true;
    }

    // -----------------------------------------------------------------------
    // Flexible Throat/Neck: Attached right to underside of chin (2/3 height)
    // -----------------------------------------------------------------------
    if (P[0 * 4 + 3] >= THRESH && P[1 * 4 + 3] >= THRESH) {
      const { shoulderPt, headBasePt, tangent0, tangent1, pA, pB, arrA, arrB } = tmp;

      shoulderPt.set((P[0] + P[4]) / 2, (P[1] + P[5]) / 2, (P[2] + P[6]) / 2);

      headBasePt.set(0, -head.scale.y * 0.95, -head.scale.z * 0.08)
        .applyQuaternion(head.quaternion)
        .add(head.position);

      const curveLength = shoulderPt.distanceTo(headBasePt);
      tangent0.set(0, 1, 0).multiplyScalar(curveLength * 0.65);
      tangent1.set(0, 1, 0).applyQuaternion(head.quaternion).multiplyScalar(curveLength * 0.65);

      const evalHermite = (t: number, out: THREE.Vector3) => {
        const t2 = t * t;
        const t3 = t2 * t;
        const h00 = 2 * t3 - 3 * t2 + 1;
        const h10 = t3 - 2 * t2 + t;
        const h01 = -2 * t3 + 3 * t2;
        const h11 = t3 - t2;
        out.set(0, 0, 0)
          .addScaledVector(shoulderPt, h00)
          .addScaledVector(tangent0, h10)
          .addScaledVector(headBasePt, h01)
          .addScaledVector(tangent1, h11);
      };

      for (let i = 0; i < NECK_SEGMENTS; i++) {
        const s = (i + 0.05) / NECK_SEGMENTS;
        const e = (i + 0.95) / NECK_SEGMENTS;

        evalHermite(s, pA);
        evalHermite(e, pB);

        arrA[0] = pA.x; arrA[1] = pA.y; arrA[2] = pA.z;
        arrB[0] = pB.x; arrB[1] = pB.y; arrB[2] = pB.z;

        const neckThickness = THREE.MathUtils.lerp(0.08, 0.07, i / NECK_SEGMENTS);
        placeBone(neck, i, arrA, 0, arrB, 0, neckThickness);
        neck.setColorAt(i, neckColor.set("#1c3863"));
      }
    } else {
      hideAll(neck);
    }
    neck.instanceMatrix.needsUpdate = true;
    if (neck.instanceColor) neck.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={headRef} geometry={headGeo} material={headMat} frustumCulled={false}>
        <mesh geometry={earGeo} material={headMat} position={[0.99, 0, -0.04]} />
        <mesh
          geometry={earGeo}
          material={headMat}
          position={[-0.99, 0, -0.04]}
          rotation={[0, 0, Math.PI]}
        />
      </mesh>
      <instancedMesh
        ref={neckRef}
        args={[getBoneGeometry(), neckMat, NECK_SEGMENTS]}
        frustumCulled={false}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Face Rig: Straight-Facing Eye Gaze & Natural Expression
// ---------------------------------------------------------------------------
export function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const toCamVec = useMemo(() => new THREE.Vector3(), []);
  const ptA = useMemo(() => new THREE.Vector3(), []);
  const ptB = useMemo(() => new THREE.Vector3(), []);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FACE_SEGMENTS * 6), 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );
    return geo;
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#6effe0",
        transparent: true,
        opacity: 0.98,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => () => { lineGeo.dispose(); lineMat.dispose(); }, [lineGeo, lineMat]);

  useFrame((state) => {
    const lines = linesRef.current;
    if (!lines) return;
    const st = sampleRef.current;

    if (HEAD_FACING.valid) {
      toCamVec.subVectors(state.camera.position, HEAD_FACING.center).normalize();
      const facing = HEAD_FACING.front.dot(toCamVec);
      if (facing <= 0.0) {
        lines.visible = false;
        return;
      }
      lines.visible = true;
      lineMat.opacity = THREE.MathUtils.clamp(facing * 2.2, 0.0, 0.98);
    } else {
      lines.visible = st.facePresent;
    }

    if (!st.facePresent) return;

    const time = state.clock.getElapsedTime();
    const positions = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const face = st.face;
    let segOffset = 0;

    // Rotates face point down slightly to match head orientation
    const rotatePoint = (x: number, y: number, z: number, out: THREE.Vector3) => {
      if (!HEAD_FACING.valid) {
        out.set(x, y, z);
        return;
      }
      const cx = HEAD_FACING.center.x;
      const cy = HEAD_FACING.center.y;
      const cz = HEAD_FACING.center.z;
      const dx = x - cx;
      const dy = y - cy;
      const dz = z - cz;

      // Downward pitch rotation
      const rY = dy * cosPitch - dz * sinPitch;
      const rZ = dy * sinPitch + dz * cosPitch;
      out.set(cx + dx, cy + rY, cz + rZ);
    };

    const addSegment = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) => {
      if (segOffset >= FACE_SEGMENTS) return;
      rotatePoint(x0, y0, z0, ptA);
      rotatePoint(x1, y1, z1, ptB);
      positions.setXYZ(segOffset * 2, ptA.x, ptA.y, ptA.z);
      positions.setXYZ(segOffset * 2 + 1, ptB.x, ptB.y, ptB.z);
      segOffset++;
    };

    // 1. DATA-DRIVEN EYEBROWS
    const brows = [
      { pts: [4, 5, 6], valid: [4, 5, 6].every((i) => st.faceValid[i]) },
      { pts: [7, 8, 9], valid: [7, 8, 9].every((i) => st.faceValid[i]) },
    ];
    for (const b of brows) {
      if (b.valid) {
        for (let s = 0; s < BROW_STEPS; s++) {
          const t0 = s / BROW_STEPS;
          const t1 = (s + 1) / BROW_STEPS;
          const p0x = face[b.pts[0] * 3], p0y = face[b.pts[0] * 3 + 1], p0z = face[b.pts[0] * 3 + 2];
          const p1x = face[b.pts[1] * 3], p1y = face[b.pts[1] * 3 + 1], p1z = face[b.pts[1] * 3 + 2];
          const p2x = face[b.pts[2] * 3], p2y = face[b.pts[2] * 3 + 1], p2z = face[b.pts[2] * 3 + 2];

          const x0 = (1 - t0) * (1 - t0) * p0x + 2 * (1 - t0) * t0 * p1x + t0 * t0 * p2x;
          const y0 = (1 - t0) * (1 - t0) * p0y + 2 * (1 - t0) * t0 * p1y + t0 * t0 * p2y;
          const z0 = (1 - t0) * (1 - t0) * p0z + 2 * (1 - t0) * t0 * p1z + t0 * t0 * p2z;

          const x1 = (1 - t1) * (1 - t1) * p0x + 2 * (1 - t1) * t1 * p1x + t1 * t1 * p2x;
          const y1 = (1 - t1) * (1 - t1) * p0y + 2 * (1 - t1) * t1 * p1y + t1 * t1 * p2y;
          const z1 = (1 - t1) * (1 - t1) * p0z + 2 * (1 - t1) * t1 * p1z + t1 * t1 * p2z;

          addSegment(x0, y0, z0 + 0.006, x1, y1, z1 + 0.006);
        }
      }
    }

    // 2. BIG ADORABLE EYES (Straight-Forward Gaze)
    const eyesValid = [10, 11, 12, 13].every((i) => st.faceValid[i]);
    if (eyesValid) {
      const lX = (face[10 * 3] + face[11 * 3]) / 2;
      const lY = (face[10 * 3 + 1] + face[11 * 3 + 1]) / 2;
      const lZ = (face[10 * 3 + 2] + face[11 * 3 + 2]) / 2 + 0.008;

      const rX = (face[12 * 3] + face[13 * 3]) / 2;
      const rY = (face[12 * 3 + 1] + face[13 * 3 + 1]) / 2;
      const rZ = (face[12 * 3 + 2] + face[13 * 3 + 2]) / 2 + 0.008;

      const eyeDist = Math.hypot(rX - lX, rY - lY);
      const eyeRadius = THREE.MathUtils.clamp(eyeDist * 0.44, 0.032, 0.07);

      const lAperture = Math.hypot(face[10 * 3] - face[11 * 3], face[10 * 3 + 1] - face[11 * 3 + 1]);
      const rAperture = Math.hypot(face[12 * 3] - face[13 * 3], face[12 * 3 + 1] - face[13 * 3 + 1]);

      const normalOpen = eyeDist * 0.11;
      let lOpen = THREE.MathUtils.clamp(lAperture / normalOpen, 0.03, 1.0);
      let rOpen = THREE.MathUtils.clamp(rAperture / normalOpen, 0.03, 1.0);

      const blinkCycle = Math.sin(time * 1.8);
      if (blinkCycle > 0.96) {
        const blinkAmount = (1 - (blinkCycle - 0.96) / 0.04);
        lOpen *= blinkAmount;
        rOpen *= blinkAmount;
      }

      const eyeData = [
        { cx: lX, cy: lY, cz: lZ, open: lOpen, isLeft: true },
        { cx: rX, cy: rY, cz: rZ, open: rOpen, isLeft: false },
      ];

      for (const e of eyeData) {
        const h = eyeRadius * 0.9 * e.open;

        for (let s = 0; s < EYE_STEPS; s++) {
          const a0 = (s / EYE_STEPS) * Math.PI * 2;
          const a1 = ((s + 1) / EYE_STEPS) * Math.PI * 2;
          const x0 = e.cx + Math.cos(a0) * eyeRadius;
          const y0 = e.cy + Math.sin(a0) * h;
          const x1 = e.cx + Math.cos(a1) * eyeRadius;
          const y1 = e.cy + Math.sin(a1) * h;
          addSegment(x0, y0, e.cz, x1, y1, e.cz);
        }

        if (e.open > 0.25) {
          const pupilRad = eyeRadius * 0.54 * e.open;
          for (let s = 0; s < PUPIL_STEPS; s++) {
            const a0 = (s / PUPIL_STEPS) * Math.PI * 2;
            const a1 = ((s + 1) / PUPIL_STEPS) * Math.PI * 2;
            addSegment(
              e.cx + Math.cos(a0) * pupilRad,
              e.cy + Math.sin(a0) * pupilRad,
              e.cz + 0.001,
              e.cx + Math.cos(a1) * pupilRad,
              e.cy + Math.sin(a1) * pupilRad,
              e.cz + 0.001,
            );
          }

          // Center-leveled sparkle so gaze looks straight ahead
          const spSize = eyeRadius * 0.28;
          const spOx = e.cx + (e.isLeft ? -spSize * 0.5 : spSize * 0.5);
          const spOy = e.cy + spSize * 0.25;
          for (let s = 0; s < SPARKLE_STEPS; s++) {
            const a0 = (s / SPARKLE_STEPS) * Math.PI * 2 + Math.PI / 4;
            const a1 = ((s + 1) / SPARKLE_STEPS) * Math.PI * 2 + Math.PI / 4;
            const r0 = s % 2 === 0 ? spSize : spSize * 0.35;
            const r1 = (s + 1) % 2 === 0 ? spSize : spSize * 0.35;
            addSegment(
              spOx + Math.cos(a0) * r0,
              spOy + Math.sin(a0) * r0,
              e.cz + 0.002,
              spOx + Math.cos(a1) * r1,
              spOy + Math.sin(a1) * r1,
              e.cz + 0.002,
            );
          }
        }
      }

      // 3. MINIMAL BUTTON NOSE
      if (st.faceValid[14]) {
        const nx = face[14 * 3], ny = face[14 * 3 + 1], nz = face[14 * 3 + 2] + 0.008;
        const nLen = eyeDist * 0.06;
        for (let s = 0; s < NOSE_SEGMENTS; s++) {
          const t0 = 1 - s / NOSE_SEGMENTS;
          const t1 = 1 - (s + 1) / NOSE_SEGMENTS;
          addSegment(nx, ny + nLen * t0, nz, nx, ny + nLen * t1, nz);
        }
      }
    }

    // 4. CLEAN DATA-DRIVEN LIPS
    const mouthValid = [15, 16, 17, 18].every((i) => st.faceValid[i]);
    if (mouthValid) {
      const cL = { x: face[15 * 3], y: face[15 * 3 + 1], z: face[15 * 3 + 2] + 0.008 };
      const cR = { x: face[16 * 3], y: face[16 * 3 + 1], z: face[16 * 3 + 2] + 0.008 };
      const upLip = { x: face[17 * 3], y: face[17 * 3 + 1], z: face[17 * 3 + 2] + 0.008 };
      const loLip = { x: face[18 * 3], y: face[18 * 3 + 1], z: face[18 * 3 + 2] + 0.008 };

      for (let s = 0; s < LIP_STEPS; s++) {
        const t0 = s / LIP_STEPS;
        const t1 = (s + 1) / LIP_STEPS;

        const evalQuad = (p0: typeof cL, p1: typeof upLip, p2: typeof cR, t: number) => {
          const inv = 1 - t;
          return {
            x: inv * inv * p0.x + 2 * inv * t * p1.x + t * t * p2.x,
            y: inv * inv * p0.y + 2 * inv * t * p1.y + t * t * p2.y,
            z: inv * inv * p0.z + 2 * inv * t * p1.z + t * t * p2.z,
          };
        };

        const u0 = evalQuad(cL, upLip, cR, t0);
        const u1 = evalQuad(cL, upLip, cR, t1);
        addSegment(u0.x, u0.y, u0.z, u1.x, u1.y, u1.z);

        const l0 = evalQuad(cL, loLip, cR, t0);
        const l1 = evalQuad(cL, loLip, cR, t1);
        addSegment(l0.x, l0.y, l0.z, l1.x, l1.y, l1.z);
      }

      const mouthWidth = Math.hypot(cR.x - cL.x, cR.y - cL.y);
      const tick = mouthWidth * 0.06;
      addSegment(cL.x, cL.y, cL.z, cL.x - tick * 0.7, cL.y + tick * 0.7, cL.z);
      addSegment(cR.x, cR.y, cR.z, cR.x + tick * 0.7, cR.y + tick * 0.7, cR.z);
    }

    for (let i = segOffset; i < FACE_SEGMENTS; i++) {
      positions.setXYZ(i * 2, 0, 0, 0);
      positions.setXYZ(i * 2 + 1, 0, 0, 0);
    }

    positions.needsUpdate = true;
  });

  return (
    <lineSegments
      ref={linesRef}
      geometry={lineGeo}
      material={lineMat}
      frustumCulled={false}
      renderOrder={10}
    />
  );
}