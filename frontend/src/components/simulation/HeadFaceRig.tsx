"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { THRESH } from "./simulationConstants";
import {
  getBoneGeometry,
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

// Curve segment counts
const BROW_STEPS = 8;
const MOUTH_STEPS = 10;
const EYE_STEPS = 16;
const SPARKLE_STEPS = 8;
const NOSE_SEGMENTS = 3;

// Total vertices calculation:
// 2 brows (8*2) + mouth (4*10) + 2 eyes (16*2) + 2 sparkles (8*2) + nose (3)
const FACE_SEGMENTS = 2 * BROW_STEPS + 4 * MOUTH_STEPS + 2 * EYE_STEPS + 2 * SPARKLE_STEPS + NOSE_SEGMENTS;

// ---------------------------------------------------------------------------
// Head Shell Tuning
// ---------------------------------------------------------------------------
const HEAD_FIT_X = 1.15;
const HEAD_FIT_Y = 1.05;
const HEAD_DEPTH = 0.95;
const HEAD_BACK = 0.35;
const HEAD_FOLLOW = 0.45;
const HEAD_SCALE_FOLLOW = 0.12;

const HEAD_FACING = {
  center: new THREE.Vector3(),
  front: new THREE.Vector3(0, 0, 1),
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

    // Superellipsoid "squircle" rounding (cute bot head)
    const n = 2.8;
    const sum = Math.pow(Math.abs(x), n) + Math.pow(Math.abs(y), n) + Math.pow(Math.abs(z), n);
    const r = Math.pow(sum, -1 / n);

    let nx = x * r;
    let ny = y * r;
    let nz = z * r;

    // Gentle bottom taper so it's not a block
    if (ny < 0) {
      const taper = 1.0 - 0.12 * Math.pow(-ny, 1.6);
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

// ---------------------------------------------------------------------------
// Shaders: Bioluminescent Glass with Dual-Tone Mint/Electric Blue
// ---------------------------------------------------------------------------
function createHeadMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uInnerGlow: { value: new THREE.Color("#0a1f38") },
      uRimColor: { value: new THREE.Color("#4effd3") }, // Fresh neon mint
      uCoreGlow: { value: new THREE.Color("#008cff") }, // Deep electric cyan
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
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
        float rim = pow(fresnel, 2.2);
        float softCore = pow(fresnel, 1.2) * 0.3;

        vec3 color = mix(uInnerGlow, uCoreGlow, softCore);
        color = mix(color, uRimColor, rim);
        float alpha = 0.08 + rim * 0.65;

        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
      }
    `,
  });
}

export function HeadRig({ sampleRef }: { sampleRef: SampleRef }) {
  const headRef = useRef<THREE.Mesh>(null);
  const neckRef = useRef<THREE.InstancedMesh>(null);
  const neckStart = useRef(new Float32Array(3));
  const neckEnd = useRef(new Float32Array(3));
  const shoulderStart = useRef(new Float32Array(3));
  const headEnd = useRef(new Float32Array(3));
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
    }),
    [],
  );

  const headGeo = useMemo(() => createCleanCuteHeadGeometry(), []);
  const headMat = useMemo(() => createHeadMaterial(), []);

  // Flush Outer Ear Nodes (sitting directly on outer sides)
  const earGeo = useMemo(() => new THREE.CapsuleGeometry(0.12, 0.18, 16, 24), []);
  const earMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#163459",
        emissive: "#4effd3",
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      }),
    [],
  );

  const neckMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#183256",
        emissive: "#00a2ff",
        emissiveIntensity: 0.2,
        metalness: 0.6,
        roughness: 0.3,
      }),
    [],
  );

  useEffect(() => () => {
    headGeo.dispose(); headMat.dispose(); earGeo.dispose(); earMat.dispose(); neckMat.dispose();
  }, [headGeo, headMat, earGeo, earMat, neckMat]);

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
      HEAD_FACING.center.copy(head.position);
      HEAD_FACING.front.copy(front);
      HEAD_FACING.valid = true;
    }

    // Articulated Vertebrae Neck
    const P = st.pose;
    const H = st.head;
    const NECK_SEGMENTS = 4;
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

      for (let i = 0; i < NECK_SEGMENTS; i++) {
        const s = (i + 0.12) / NECK_SEGMENTS;
        const e = (i + 0.88) / NECK_SEGMENTS;
        neckStart.current[0] = shoulderStart.current[0] + dx * s;
        neckStart.current[1] = shoulderStart.current[1] + dy * s;
        neckStart.current[2] = shoulderStart.current[2] + dz * s;
        neckEnd.current[0] = shoulderStart.current[0] + dx * e;
        neckEnd.current[1] = shoulderStart.current[1] + dy * e;
        neckEnd.current[2] = shoulderStart.current[2] + dz * e;

        placeBone(neck, i, neckStart.current, 0, neckEnd.current, 0, 0.046);
        neck.setColorAt(i, neckColor.set(i === 0 ? "#4effd3" : "#183256"));
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
        {/* Exterior Left Ear Node */}
        <mesh geometry={earGeo} material={earMat} position={[1.02, 0, 0]} rotation={[0, 0, 0]} />
        {/* Exterior Right Ear Node */}
        <mesh geometry={earGeo} material={earMat} position={[-1.02, 0, 0]} rotation={[0, 0, 0]} />
      </mesh>
      <instancedMesh ref={neckRef} args={[getBoneGeometry(), neckMat, 4]} frustumCulled={false} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Face Rig: Data-driven Eyes, Sparkles, Brows & Lips
// ---------------------------------------------------------------------------
export function FaceRig({ sampleRef }: { sampleRef: SampleRef }) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(FACE_SEGMENTS * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    return geo;
  }, []);

  // Vivid Glowing Mint/Cyan Line Material
  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#68ffd8",
        transparent: true,
        opacity: 0.98,
        depthTest: false,
      }),
    [],
  );

  useEffect(() => () => { lineGeo.dispose(); lineMat.dispose(); }, [lineGeo, lineMat]);

  useFrame(() => {
    const lines = linesRef.current;
    if (!lines) return;
    const st = sampleRef.current;
    lines.visible = st.facePresent;
    if (!st.facePresent) return;

    const positions = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const face = st.face;
    let segOffset = 0;

    // 1. DATA-DRIVEN EYEBROWS (4,5,6 and 7,8,9)
    const brows = [
      { pts: [4, 5, 6], valid: [4, 5, 6].every((i) => st.faceValid[i]) },
      { pts: [7, 8, 9], valid: [7, 8, 9].every((i) => st.faceValid[i]) },
    ];
    for (const b of brows) {
      if (b.valid) {
        for (let s = 0; s < BROW_STEPS; s++) {
          const t0 = s / BROW_STEPS;
          const t1 = (s + 1) / BROW_STEPS;
          // Quadratic interpolation for sleek brow curve
          const p0x = face[b.pts[0] * 3], p0y = face[b.pts[0] * 3 + 1], p0z = face[b.pts[0] * 3 + 2];
          const p1x = face[b.pts[1] * 3], p1y = face[b.pts[1] * 3 + 1], p1z = face[b.pts[1] * 3 + 2];
          const p2x = face[b.pts[2] * 3], p2y = face[b.pts[2] * 3 + 1], p2z = face[b.pts[2] * 3 + 2];

          const x0 = (1 - t0) * (1 - t0) * p0x + 2 * (1 - t0) * t0 * p1x + t0 * t0 * p2x;
          const y0 = (1 - t0) * (1 - t0) * p0y + 2 * (1 - t0) * t0 * p1y + t0 * t0 * p2y;
          const z0 = (1 - t0) * (1 - t0) * p0z + 2 * (1 - t0) * t0 * p1z + t0 * t0 * p2z;

          const x1 = (1 - t1) * (1 - t1) * p0x + 2 * (1 - t1) * t1 * p1x + t1 * t1 * p2x;
          const y1 = (1 - t1) * (1 - t1) * p0y + 2 * (1 - t1) * t1 * p1y + t1 * t1 * p2y;
          const z1 = (1 - t1) * (1 - t1) * p0z + 2 * (1 - t1) * t1 * p1z + t1 * t1 * p2z;

          positions.setXYZ((segOffset + s) * 2, x0, y0, z0 + 0.005);
          positions.setXYZ((segOffset + s) * 2 + 1, x1, y1, z1 + 0.005);
        }
      } else {
        for (let s = 0; s < BROW_STEPS; s++) {
          positions.setXYZ((segOffset + s) * 2, 0, 0, 0);
          positions.setXYZ((segOffset + s) * 2 + 1, 0, 0, 0);
        }
      }
      segOffset += BROW_STEPS;
    }

    // 2. DATA-DRIVEN EYES & BLINKING (MediaPipe Points 10/11 & 12/13)
    const eyesValid = [10, 11, 12, 13].every((i) => st.faceValid[i]);
    if (eyesValid) {
      const lX = (face[10 * 3] + face[11 * 3]) / 2;
      const lY = (face[10 * 3 + 1] + face[11 * 3 + 1]) / 2;
      const lZ = (face[10 * 3 + 2] + face[11 * 3 + 2]) / 2 + 0.006;

      const rX = (face[12 * 3] + face[13 * 3]) / 2;
      const rY = (face[12 * 3 + 1] + face[13 * 3 + 1]) / 2;
      const rZ = (face[12 * 3 + 2] + face[13 * 3 + 2]) / 2 + 0.006;

      const eyeDist = Math.hypot(rX - lX, rY - lY);
      const eyeWidth = THREE.MathUtils.clamp(eyeDist * 0.26, 0.015, 0.04);

      // Raw aperture from tracking
      const lAperture = Math.hypot(face[10 * 3] - face[11 * 3], face[10 * 3 + 1] - face[11 * 3 + 1]);
      const rAperture = Math.hypot(face[12 * 3] - face[13 * 3], face[12 * 3 + 1] - face[13 * 3 + 1]);

      // Blink coefficient: 0.0 = completely shut, 1.0 = fully open
      const normalOpen = eyeDist * 0.11;
      const lOpen = THREE.MathUtils.clamp(lAperture / normalOpen, 0.05, 1.0);
      const rOpen = THREE.MathUtils.clamp(rAperture / normalOpen, 0.05, 1.0);

      const eyeData = [
        { cx: lX, cy: lY, cz: lZ, open: lOpen },
        { cx: rX, cy: rY, cz: rZ, open: rOpen },
      ];

      for (const e of eyeData) {
        const h = eyeWidth * 0.65 * e.open;
        for (let s = 0; s < EYE_STEPS; s++) {
          for (let ep = 0; ep < 2; ep++) {
            const angle = ((s + ep) / EYE_STEPS) * Math.PI * 2;
            const px = e.cx + Math.cos(angle) * eyeWidth;
            // When blinking (open -> 0), height collapses naturally into a cute sleeping lash
            const py = e.cy + Math.sin(angle) * h;
            positions.setXYZ((segOffset + s) * 2 + ep, px, py, e.cz);
          }
        }
        segOffset += EYE_STEPS;

        // Sparkle scale shrinks with blink
        const spSize = eyeWidth * 0.45 * Math.max(0, e.open - 0.2);
        for (let s = 0; s < SPARKLE_STEPS; s++) {
          for (let ep = 0; ep < 2; ep++) {
            const k = (s + ep) % SPARKLE_STEPS;
            const a = (k / SPARKLE_STEPS) * Math.PI * 2 + Math.PI / 4;
            const rad = k % 2 === 0 ? spSize : spSize * 0.35;
            positions.setXYZ(
              (segOffset + s) * 2 + ep,
              e.cx + Math.cos(a) * rad,
              e.cy + Math.sin(a) * rad,
              e.cz + 0.001,
            );
          }
        }
        segOffset += SPARKLE_STEPS;
      }

      // 3. MINIMAL BUTTON NOSE (Point 14)
      if (st.faceValid[14]) {
        const nx = face[14 * 3], ny = face[14 * 3 + 1], nz = face[14 * 3 + 2] + 0.006;
        const nLen = eyeDist * 0.07;
        for (let s = 0; s < NOSE_SEGMENTS; s++) {
          const t0 = 1 - s / NOSE_SEGMENTS;
          const t1 = 1 - (s + 1) / NOSE_SEGMENTS;
          positions.setXYZ((segOffset + s) * 2, nx, ny + nLen * t0, nz);
          positions.setXYZ((segOffset + s) * 2 + 1, nx, ny + nLen * t1, nz);
        }
      }
      segOffset += NOSE_SEGMENTS;
    }

    // 4. DATA-DRIVEN MOUTH (Points 15, 17, 16, 18)
    const mouthValid = [15, 16, 17, 18].every((i) => st.faceValid[i]);
    if (mouthValid) {
      const pts = [15, 17, 16, 18]; // Left corner, Upper lip, Right corner, Lower lip
      for (let i = 0; i < 4; i++) {
        const pA = pts[i];
        const pB = pts[(i + 1) % 4];
        for (let s = 0; s < MOUTH_STEPS; s++) {
          const t0 = s / MOUTH_STEPS;
          const t1 = (s + 1) / MOUTH_STEPS;

          const x0 = THREE.MathUtils.lerp(face[pA * 3], face[pB * 3], t0);
          const y0 = THREE.MathUtils.lerp(face[pA * 3 + 1], face[pB * 3 + 1], t0);
          const z0 = THREE.MathUtils.lerp(face[pA * 3 + 2], face[pB * 3 + 2], t0);

          const x1 = THREE.MathUtils.lerp(face[pA * 3], face[pB * 3], t1);
          const y1 = THREE.MathUtils.lerp(face[pA * 3 + 1], face[pB * 3 + 1], t1);
          const z1 = THREE.MathUtils.lerp(face[pA * 3 + 2], face[pB * 3 + 2], t1);

          positions.setXYZ((segOffset + s) * 2, x0, y0, z0 + 0.004);
          positions.setXYZ((segOffset + s) * 2 + 1, x1, y1, z1 + 0.004);
        }
        segOffset += MOUTH_STEPS;
      }
    }

    positions.needsUpdate = true;
  });

  return (
    <lineSegments
      ref={linesRef}
      geometry={lineGeo}
      material={lineMat}
      frustumCulled={false}
      renderOrder={2}
    />
  );
}