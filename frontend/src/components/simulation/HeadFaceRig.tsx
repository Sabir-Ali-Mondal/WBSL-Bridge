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

// The face outline curve (points 0, 2, 1, 3) is intentionally not drawn: the
// glass head's rim is the border now. Points 0-3 are still used to fit the head.
const FACE_CURVES: { points: number[]; closed: boolean; steps: number }[] = [
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

// ---------------------------------------------------------------------------
// Head shell tuning (all easy to tweak)
// Face outline landmarks: 0 = top (forehead), 1 = bottom (chin),
// 2 and 3 = the two sides of the face.
// ---------------------------------------------------------------------------
const HEAD_FIT_X = 1.1;        // shell width  vs face outline width
const HEAD_FIT_Y = 1.18;       // shell height vs face outline height
const HEAD_DEPTH = 0.95;       // shell depth  vs average of width/height
const HEAD_BACK = 0.6;         // how far the shell sits behind the face (0 = centered on face)
const HEAD_FOLLOW = 0.45;      // smoothing: 1 = snap to face, lower = smoother
const HEAD_SCALE_FOLLOW = 0.12; // size smoothing (slower than movement) -> no sudden resizing
const HEAD_MIN_ASPECT = 1.0;   // height/width limits so the head always stays a soft oval
const HEAD_MAX_ASPECT = 1.25;
const HEAD_BACK_ALPHA = 0.16;  // frosted haze seen on the back of the head
const BACK_FACE_MIN_OPACITY = 0.25; // face lines fade to this when seen from behind
const HEAD_FILL_ALPHA = 0.1;   // see-through amount in the middle of the head
const HEAD_RIM_ALPHA = 0.6;    // glow strength on the head border
const HEAD_RIM_POWER = 2.2;    // higher = thinner rim

// ---------------------------------------------------------------------------
// Cute head structure (procedural). Only the shape of the glass head changes;
// the face features, materials, colours and animation are untouched.
// Local axes: x = right, y = up, z = front. y runs -1 (chin) .. +1 (crown).
// ---------------------------------------------------------------------------
const CUTE_HEAD = {
  overallWidth: 0.97,
  heightScale: 1.04,

  // Soft, naturally full cheeks
  cheekCenter: -0.04,
  cheekSpread: 0.55,
  cheekWidth: 0.055,
  cheekForward: 0.025,

  // Smooth rounded forehead
  foreheadCenter: 0.38,
  foreheadSpread: 0.55,
  foreheadWidth: 0.025,

  // Gentle jaw narrowing
  jawNarrow: 0.15,
  jawCurve: 1.5,

  // Short, rounded chin
  chinShorten: 0.07,
};

// Shared between HeadRig (writes) and FaceRig (reads): which way the face
// points, so the face lines can soften when the head is seen from behind.
const HEAD_FACING = {
  center: new THREE.Vector3(),
  front: new THREE.Vector3(0, 0, 1),
  valid: false,
};
const _toCamera = new THREE.Vector3();
function faceVisibility(camera: THREE.Camera): number {
  if (!HEAD_FACING.valid) return 1;
  _toCamera.copy(camera.position).sub(HEAD_FACING.center).normalize();
  const facing = _toCamera.dot(HEAD_FACING.front);
  return THREE.MathUtils.lerp(
    BACK_FACE_MIN_OPACITY,
    1,
    THREE.MathUtils.smoothstep(facing, -0.2, 0.3),
  );
}

function createCuteHeadGeometry(): THREE.BufferGeometry {
  const c = CUTE_HEAD;
  const base = new THREE.SphereGeometry(1, 64, 48);
  base.deleteAttribute("normal");
  base.deleteAttribute("uv");
  const pos = base.getAttribute("position") as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const cheek = Math.exp(-(((y - c.cheekCenter) / c.cheekSpread) ** 2));
    const forehead = Math.exp(-(((y - c.foreheadCenter) / c.foreheadSpread) ** 2));
    // 0 at the widest point (y >= 0), rising smoothly to 1 at the chin.
    const jaw = Math.pow(THREE.MathUtils.smoothstep(-y, 0, 1), c.jawCurve);

    const widthScale =
      c.overallWidth *
      (1 + c.cheekWidth * cheek + c.foreheadWidth * forehead - c.jawNarrow * jaw);

    // Shorten the lower face smoothly (y <= 0 only), keeping the chin round.
    const chin = THREE.MathUtils.smoothstep(-y, 0.3, 1);
    const ny = y * (1 - c.chinShorten * chin) * c.heightScale;

    const nz = z * (1 + c.cheekForward * cheek);
    pos.setXYZ(i, x * widthScale, ny, nz);
  }
  // Merge the sphere seam so normals (used by the rim glow) stay smooth.
  const merged = mergeVertices(base, 1e-4);
  merged.computeVertexNormals();
  base.dispose();
  return merged;
}

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

// Transparent "glass" head: almost see-through in the middle, with a glowing
// cyan border (fresnel rim) that matches the face lines.
function createHeadMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    uniforms: {
      uFill: { value: new THREE.Color("#1d3a63") },
      uRim: { value: new THREE.Color("#59F4FF") },
      uFillAlpha: { value: HEAD_FILL_ALPHA },
      uRimAlpha: { value: HEAD_RIM_ALPHA },
      uRimPower: { value: HEAD_RIM_POWER },
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
      uniform vec3 uFill;
      uniform vec3 uRim;
      uniform float uFillAlpha;
      uniform float uRimAlpha;
      uniform float uRimPower;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float facing = abs(dot(normalize(vNormal), normalize(vView)));
        float rim = pow(1.0 - facing, uRimPower);
        vec3 color = mix(uFill, uRim, rim);
        float alpha = uFillAlpha + rim * uRimAlpha;
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
      }
    `,
  });
}

// Frosted back of the head: the inside/back surface is drawn as a soft, hazy
// layer with no crisp edge, so from behind the head looks slightly blurred.
function createHeadBackMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    uniforms: {
      uFrost: { value: new THREE.Color("#2d5d92") },
      uGlow: { value: new THREE.Color("#59F4FF") },
      uAlpha: { value: HEAD_BACK_ALPHA },
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
      uniform vec3 uFrost;
      uniform vec3 uGlow;
      uniform float uAlpha;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float facing = abs(dot(normalize(vNormal), normalize(vView)));
        float soft = 1.0 - facing;               // broad, gentle falloff (no sharp rim)
        vec3 color = mix(uFrost, uGlow, soft * 0.35);
        float alpha = uAlpha * (0.55 + 0.45 * soft);
        gl_FragColor = vec4(color, alpha);
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

  // Scratch objects for fitting the head shell to the face (no per-frame allocation).
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

  const headGeo = useMemo(() => createCuteHeadGeometry(), []);
  useEffect(() => () => headGeo.dispose(), [headGeo]);
  const headMat = useMemo(() => createHeadMaterial(), []);
  const headBackMat = useMemo(() => createHeadBackMaterial(), []);
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
  useEffect(
    () => () => { headMat.dispose(); headBackMat.dispose(); neckMat.dispose(); },
    [headMat, headBackMat, neckMat],
  );
  useLayoutEffect(() => hideAll(neckRef.current), []);

  useFrame(() => {
    const head = headRef.current;
    const neck = neckRef.current;
    if (!head || !neck) return;
    const st = sampleRef.current;

    // Head shell stays visible whenever head data is valid.
    head.visible = st.headValid;
    if (!st.headValid) {
      HEAD_FACING.valid = false;
      hideAll(neck);
      return;
    }
    const H = st.head;

    const F = st.face;
    const fv = st.faceValid;
    const faceFit = st.facePresent && !!fv[0] && !!fv[1] && !!fv[2] && !!fv[3];

    if (faceFit) {
      const { top, bottom, sideA, sideB, right, up, front, center, target, basis, quat, scale } = tmp;
      top.set(F[0], F[1], F[2]);
      bottom.set(F[3], F[4], F[5]);
      sideA.set(F[6], F[7], F[8]);
      sideB.set(F[9], F[10], F[11]);

      // Face axes: up = chin -> forehead, right = side -> side.
      up.subVectors(top, bottom);
      right.subVectors(sideB, sideA);
      if (up.y < 0) up.negate();
      if (right.x < 0) right.negate();
      const height = up.length();
      const width = right.length();
      up.normalize();
      right.addScaledVector(up, -right.dot(up)).normalize();
      front.crossVectors(right, up).normalize(); // direction the face looks

      basis.makeBasis(right, up, front);
      quat.setFromRotationMatrix(basis);

      center
        .copy(top)
        .add(bottom)
        .add(sideA)
        .add(sideB)
        .multiplyScalar(0.25);

      let radiusX = (width / 2) * HEAD_FIT_X;
      let radiusY = (height / 2) * HEAD_FIT_Y;
      // Keep the oval proportions stable even if landmarks wobble:
      // same overall size, but height/width stays within a safe range.
      const size = Math.sqrt(radiusX * radiusY);
      const aspect = THREE.MathUtils.clamp(
        radiusY / Math.max(radiusX, 1e-6),
        HEAD_MIN_ASPECT,
        HEAD_MAX_ASPECT,
      );
      radiusX = size / Math.sqrt(aspect);
      radiusY = size * Math.sqrt(aspect);
      const radiusZ = ((radiusX + radiusY) / 2) * HEAD_DEPTH;
      scale.set(radiusX, radiusY, radiusZ);

      // Put the shell behind the face so the face sits on its front surface.
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
    } else {
      // No face landmarks: fall back to the tracked head box (roll only).
      head.position.set(H[1], H[2], H[3]);
      head.scale.set(H[4] / 2, H[5] / 2, H[6] / 2);
      head.rotation.set(0, 0, H[10]);
      tmp.wasFace = false;
      HEAD_FACING.valid = false;
    }

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
        geometry={headGeo}
        material={headMat}
        frustumCulled={false}
        renderOrder={-1}
      >
        {/* frosted back layer: shares the head's transform and shape */}
        <mesh
          geometry={headGeo}
          material={headBackMat}
          frustumCulled={false}
          renderOrder={-2}
        />
      </mesh>
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
  // depthTest: false -> face lines always draw over the transparent head.
  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({
      color: "#59F4FF",
      transparent: true,
      opacity: 0.96,
      depthTest: false,
    }),
    [],
  );
  const keyMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#BDFBFF",
      emissive: "#38DDF0",
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.05,
      depthTest: false,
      transparent: true,
    }),
    [],
  );
  useEffect(
    () => () => { lineGeo.dispose(); lineMat.dispose(); keyMat.dispose(); },
    [lineGeo, lineMat, keyMat],
  );
  useLayoutEffect(() => hideAll(keysRef.current), []);

  useFrame(({ camera }) => {
    const lines = linesRef.current;
    const keys = keysRef.current;
    if (!lines || !keys) return;
    const st = sampleRef.current;
    lines.visible = st.facePresent;
    keys.visible = st.facePresent;
    // Soften the face when the head is seen from behind (looks blurred through the frosted back).
    const fade = faceVisibility(camera);
    lineMat.opacity = 0.96 * fade;
    keyMat.opacity = fade;
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
        renderOrder={2}
      />
      <instancedMesh
        ref={keysRef}
        args={[getJointGeometry(), keyMat, 2]}
        frustumCulled={false}
        renderOrder={3}
      />
    </group>
  );
}