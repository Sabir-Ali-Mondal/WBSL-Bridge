"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { THRESH } from "./simulationConstants";

// ============================================================
// DESIGN PALETTE & MATERIALS THEME
// ============================================================

const CERAMIC_WHITE = "#e8edf5";
const CERAMIC_SLEEVE = "#cbd5e1";
const TITANIUM_DARK = "#2a3447";
const TITANIUM_CORE = "#50637f";
const ACCENT_GOLD = "#d4a359";
const RING_CHROME = "#94a3b8";

// ============================================================
// ARM STRUCTURE & CONNECTIONS
// 0: left shoulder, 1: right shoulder
// 2: left elbow,    3: right elbow
// 4: left wrist,    5: right wrist
// ============================================================

const ARM_SEGMENTS: {
  conn: [number, number];
  radiusTop: number;
  radiusBottom: number;
}[] = [
  // Clavicle chest beam
  { conn: [0, 1], radiusTop: 0.088, radiusBottom: 0.088 },
  // Left Upper Arm (Shoulder -> Elbow)
  { conn: [0, 2], radiusTop: 0.098, radiusBottom: 0.078 },
  // Left Forearm (Elbow -> Wrist)
  { conn: [2, 4], radiusTop: 0.074, radiusBottom: 0.052 },
  // Right Upper Arm (Shoulder -> Elbow)
  { conn: [1, 3], radiusTop: 0.098, radiusBottom: 0.078 },
  // Right Forearm (Elbow -> Wrist)
  { conn: [3, 5], radiusTop: 0.074, radiusBottom: 0.052 },
];

const ARM_JOINTS = [
  { index: 0, radius: 0.125 }, // Left Shoulder
  { index: 1, radius: 0.125 }, // Right Shoulder
  { index: 2, radius: 0.084 }, // Left Elbow
  { index: 3, radius: 0.084 }, // Right Elbow
  { index: 4, radius: 0.056 }, // Left Wrist
  { index: 5, radius: 0.056 }, // Right Wrist
];

// Sleeve collars for elbow and wrist
const ARM_SOCKETS = [
  { boneIdx: 1, t: 0.94, radius: 0.086, height: 0.038 }, // L elbow top
  { boneIdx: 2, t: 0.06, radius: 0.082, height: 0.038 }, // L elbow bottom
  { boneIdx: 2, t: 0.94, radius: 0.058, height: 0.030 }, // L wrist
  { boneIdx: 3, t: 0.94, radius: 0.086, height: 0.038 }, // R elbow top
  { boneIdx: 4, t: 0.06, radius: 0.082, height: 0.038 }, // R elbow bottom
  { boneIdx: 4, t: 0.94, radius: 0.058, height: 0.030 }, // R wrist
];

// Elbow chrome accent rings
const ELBOW_JOINTS = [2, 3];

// ============================================================
// HAND CONNECTIONS & TOPOLOGY
// ============================================================

const PALM_METACARPALS: [number, number][] = [
  [0, 1],
  [0, 5],
  [0, 9],
  [0, 13],
  [0, 17],
];

const FINGER_SEGMENTS: [number, number][] = [
  // Thumb
  [1, 2], [2, 3], [3, 4],
  // Index
  [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [17, 18], [18, 19], [19, 20],
];

const ALL_HAND_SEGMENTS = [...PALM_METACARPALS, ...FINGER_SEGMENTS];
const FINGER_TIPS = [4, 8, 12, 16, 20];
const PALM_PERIMETER = [0, 1, 5, 9, 13, 17];

function buildPalmIndexBuffer(): number[] {
  const indices: number[] = [];
  indices.push(0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5);
  indices.push(6, 8, 7, 6, 9, 8, 6, 10, 9, 6, 11, 10);
  for (let i = 0; i < 6; i++) {
    const next = (i + 1) % 6;
    const fA = i;
    const fB = next;
    const bA = i + 6;
    const bB = next + 6;
    indices.push(fA, bA, fB);
    indices.push(fB, bA, bB);
  }
  return indices;
}

const PALM_INDICES = buildPalmIndexBuffer();

const HAND_JOINT_RADII = [
  0.038, // 0: Wrist
  0.024, 0.021, 0.019, 0.017, // Thumb
  0.025, 0.021, 0.018, 0.016, // Index
  0.025, 0.021, 0.018, 0.016, // Middle
  0.024, 0.020, 0.017, 0.015, // Ring
  0.022, 0.018, 0.016, 0.014, // Pinky
];

// ============================================================
// GEOMETRIES
// ============================================================

const armCylinderGeo = new THREE.CylinderGeometry(1, 1, 1, 24, 1, false);
const jointSphereGeo = new THREE.SphereGeometry(1, 24, 20);
const jointRingGeo = new THREE.TorusGeometry(1, 0.2, 16, 28);
const socketCuffGeo = new THREE.CylinderGeometry(1.05, 0.98, 1, 24, 1);

// Upper dome cap covering the top of the shoulder (thetaLength = Pi/2 = upper hemisphere dome)
const shoulderTopArmorGeo = new THREE.SphereGeometry(
  1,
  32,
  16,
  0,
  Math.PI * 2,
  0,
  Math.PI * 0.52,
);

const fingerBoneGeo = new THREE.CylinderGeometry(0.72, 0.96, 1, 16, 1);
const knuckleSphereGeo = new THREE.SphereGeometry(1, 16, 14);
const knuckleRingGeo = new THREE.TorusGeometry(1, 0.2, 12, 20);
const fingertipDomeGeo = new THREE.SphereGeometry(1, 16, 14);

// ============================================================
// MATH HELPERS
// ============================================================

const Y_AXIS = new THREE.Vector3(0, 1, 0);

function readPoint(target: THREE.Vector3, data: ArrayLike<number>, offset: number) {
  target.set(data[offset], data[offset + 1], data[offset + 2]);
}

function updateSegment(
  mesh: THREE.InstancedMesh,
  index: number,
  a: THREE.Vector3,
  b: THREE.Vector3,
  radiusTop: number,
  radiusBottom: number,
  dummy: THREE.Object3D,
  dir: THREE.Vector3,
) {
  dir.subVectors(b, a);
  const length = dir.length();

  if (length < 0.0001) {
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    mesh.setMatrixAt(index, dummy.matrix);
    return;
  }

  dummy.position.copy(a).add(b).multiplyScalar(0.5);
  dummy.quaternion.setFromUnitVectors(Y_AXIS, dir.normalize());

  const avgRadius = (radiusTop + radiusBottom) * 0.5;
  dummy.scale.set(avgRadius, length, avgRadius);
  dummy.updateMatrix();

  mesh.setMatrixAt(index, dummy.matrix);
}

function updateJoint(
  mesh: THREE.InstancedMesh,
  index: number,
  position: THREE.Vector3,
  radius: number,
  dummy: THREE.Object3D,
  quaternion?: THREE.Quaternion,
) {
  dummy.position.copy(position);
  if (quaternion) {
    dummy.quaternion.copy(quaternion);
  } else {
    dummy.quaternion.identity();
  }
  dummy.scale.setScalar(radius);
  dummy.updateMatrix();

  mesh.setMatrixAt(index, dummy.matrix);
}

// ============================================================
// ENHANCED SHOULDER & ARM RIG
// ============================================================

export function ArmRig({ sampleRef }: { sampleRef: SampleRef }) {
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const ringsRef = useRef<THREE.InstancedMesh>(null);
  const socketsRef = useRef<THREE.InstancedMesh>(null);
  const shoulderArmorRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const start = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  const materials = useMemo(
    () => ({
      armShell: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.24,
        roughness: 0.22,
      }),
      joints: new THREE.MeshStandardMaterial({
        color: TITANIUM_CORE,
        metalness: 0.88,
        roughness: 0.18,
      }),
      rings: new THREE.MeshStandardMaterial({
        color: RING_CHROME,
        metalness: 0.95,
        roughness: 0.12,
      }),
      sockets: new THREE.MeshStandardMaterial({
        color: TITANIUM_DARK,
        metalness: 0.82,
        roughness: 0.26,
      }),
      shoulderArmor: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.28,
        roughness: 0.18,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  );

  useEffect(
    () => () => {
      materials.armShell.dispose();
      materials.joints.dispose();
      materials.rings.dispose();
      materials.sockets.dispose();
      materials.shoulderArmor.dispose();
    },
    [materials],
  );

  useFrame(() => {
    const bones = bonesRef.current;
    const joints = jointsRef.current;
    const rings = ringsRef.current;
    const sockets = socketsRef.current;
    const shoulderArmor = shoulderArmorRef.current;
    if (!bones || !joints || !rings || !sockets || !shoulderArmor) return;

    const pose = sampleRef.current.pose;

    // 1. Arm Limbs & Clavicle
    for (let i = 0; i < ARM_SEGMENTS.length; i++) {
      const { conn, radiusTop, radiusBottom } = ARM_SEGMENTS[i];
      const [a, b] = conn;

      const conf = Math.min(pose[a * 4 + 3], pose[b * 4 + 3]);
      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        bones.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, pose, a * 4);
      readPoint(end, pose, b * 4);

      updateSegment(
        bones,
        i,
        start,
        end,
        radiusTop,
        radiusBottom,
        dummy,
        direction,
      );
    }
    bones.instanceMatrix.needsUpdate = true;

    // 2. Anatomical Spherical Joints
    for (let i = 0; i < ARM_JOINTS.length; i++) {
      const { index, radius } = ARM_JOINTS[i];
      const conf = pose[index * 4 + 3];

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        joints.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, pose, index * 4);
      updateJoint(joints, i, start, radius, dummy);
    }
    joints.instanceMatrix.needsUpdate = true;

    // 3. Elbow Chrome Rings
    for (let e = 0; e < ELBOW_JOINTS.length; e++) {
      const jointIndex = ELBOW_JOINTS[e];
      const conf = pose[jointIndex * 4 + 3];

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        rings.setMatrixAt(e, dummy.matrix);
        continue;
      }

      readPoint(start, pose, jointIndex * 4);
      const wristIndex = jointIndex === 2 ? 4 : 5;
      readPoint(end, pose, wristIndex * 4);

      direction.subVectors(end, start).normalize();
      tempQuat.setFromUnitVectors(Y_AXIS, direction);

      updateJoint(rings, e, start, 0.084 * 1.05, dummy, tempQuat);
    }
    rings.instanceMatrix.needsUpdate = true;

    // 4. Socket Sleeves (Elbow & Wrist)
    for (let s = 0; s < ARM_SOCKETS.length; s++) {
      const { boneIdx, t, radius, height } = ARM_SOCKETS[s];
      const [a, b] = ARM_SEGMENTS[boneIdx].conn;

      const conf = Math.min(pose[a * 4 + 3], pose[b * 4 + 3]);
      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        sockets.setMatrixAt(s, dummy.matrix);
        continue;
      }

      readPoint(start, pose, a * 4);
      readPoint(end, pose, b * 4);

      direction.subVectors(end, start);
      const pos = new THREE.Vector3().copy(start).addScaledVector(direction, t);
      tempQuat.setFromUnitVectors(Y_AXIS, direction.normalize());

      dummy.position.copy(pos);
      dummy.quaternion.copy(tempQuat);
      dummy.scale.set(radius, height, radius);
      dummy.updateMatrix();

      sockets.setMatrixAt(s, dummy.matrix);
    }
    sockets.instanceMatrix.needsUpdate = true;

    // 5. Shoulder Armor Cap - Positioned from the top over the shoulder joint
    for (let s = 0; s < 2; s++) {
      const shoulderIdx = s; // 0: Left, 1: Right
      const elbowIdx = s === 0 ? 2 : 3;

      const conf = Math.min(
        pose[shoulderIdx * 4 + 3],
        pose[elbowIdx * 4 + 3],
      );

      if (conf < THRESH) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        shoulderArmor.setMatrixAt(s, dummy.matrix);
        continue;
      }

      readPoint(start, pose, shoulderIdx * 4);
      readPoint(end, pose, elbowIdx * 4);

      // Vector pointing towards the arm so the cap slightly leans outward
      direction.subVectors(end, start).normalize();

      // Cap sits right on top of the shoulder joint and tilts slightly outward
      const capUp = new THREE.Vector3(0, 1, 0)
        .addScaledVector(direction, 0.35)
        .normalize();

      tempQuat.setFromUnitVectors(Y_AXIS, capUp);

      // Lift slightly upward so it rests cleanly on top of the shoulder sphere
      const capPos = new THREE.Vector3()
        .copy(start)
        .addScaledVector(new THREE.Vector3(0, 1, 0), 0.022);

      dummy.position.copy(capPos);
      dummy.quaternion.copy(tempQuat);
      dummy.scale.set(0.155, 0.165, 0.155);
      dummy.updateMatrix();

      shoulderArmor.setMatrixAt(s, dummy.matrix);
    }
    shoulderArmor.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Limb Shells & Clavicle */}
      <instancedMesh
        ref={bonesRef}
        args={[armCylinderGeo, materials.armShell, ARM_SEGMENTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Internal Ball Bearings */}
      <instancedMesh
        ref={jointsRef}
        args={[jointSphereGeo, materials.joints, ARM_JOINTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Elbow Pivot Rings */}
      <instancedMesh
        ref={ringsRef}
        args={[jointRingGeo, materials.rings, ELBOW_JOINTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Mechanical Socket Collars */}
      <instancedMesh
        ref={socketsRef}
        args={[socketCuffGeo, materials.sockets, ARM_SOCKETS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Top Shoulder Armor Dome Caps */}
      <instancedMesh
        ref={shoulderArmorRef}
        args={[shoulderTopArmorGeo, materials.shoulderArmor, 2]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// ============================================================
// ENHANCED RESIZABLE HAND RIG
// ============================================================

export function HandRig({
  slot,
  color,
  sampleRef,
  scale = 1.0,
}: {
  slot: 0 | 1;
  color: string;
  sampleRef: SampleRef;
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bonesRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);
  const knucklesRef = useRef<THREE.InstancedMesh>(null);
  const tipsRef = useRef<THREE.InstancedMesh>(null);
  const palmRef = useRef<THREE.Mesh>(null);

  const smoothPoints = useRef(new Float32Array(21 * 3));
  const scaledPoints = useRef(new Float32Array(21 * 3));
  const initialized = useRef(new Uint8Array(21));

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const start = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  const vWrist = useMemo(() => new THREE.Vector3(), []);
  const vIndex = useMemo(() => new THREE.Vector3(), []);
  const vPinky = useMemo(() => new THREE.Vector3(), []);
  const vPalmNormal = useMemo(() => new THREE.Vector3(), []);
  const vA = useMemo(() => new THREE.Vector3(), []);
  const vB = useMemo(() => new THREE.Vector3(), []);

  const materials = useMemo(
    () => ({
      fingers: new THREE.MeshStandardMaterial({
        color: CERAMIC_WHITE,
        metalness: 0.28,
        roughness: 0.22,
      }),
      joints: new THREE.MeshStandardMaterial({
        color: TITANIUM_DARK,
        metalness: 0.88,
        roughness: 0.2,
      }),
      knuckleRings: new THREE.MeshStandardMaterial({
        color: RING_CHROME,
        metalness: 0.94,
        roughness: 0.14,
      }),
      tips: new THREE.MeshStandardMaterial({
        color: color || ACCENT_GOLD,
        metalness: 0.45,
        roughness: 0.32,
        emissive: new THREE.Color(color || ACCENT_GOLD).multiplyScalar(0.2),
      }),
      palm: new THREE.MeshStandardMaterial({
        color: CERAMIC_SLEEVE,
        roughness: 0.32,
        metalness: 0.35,
        side: THREE.DoubleSide,
      }),
    }),
    [color],
  );

  const palmGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(12 * 3);
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setIndex(PALM_INDICES);
    return geo;
  }, []);

  useEffect(
    () => () => {
      materials.fingers.dispose();
      materials.joints.dispose();
      materials.knuckleRings.dispose();
      materials.tips.dispose();
      materials.palm.dispose();
      palmGeo.dispose();
    },
    [materials, palmGeo],
  );

  useEffect(() => {
    initialized.current.fill(0);
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const bones = bonesRef.current;
    const joints = jointsRef.current;
    const knuckles = knucklesRef.current;
    const tips = tipsRef.current;
    const palm = palmRef.current;

    if (!group || !bones || !joints || !knuckles || !tips || !palm) return;

    const state = sampleRef.current;
    const alpha = state.handAlpha[slot];

    group.visible = alpha > 0.01;
    if (!group.visible) {
      initialized.current.fill(0);
      return;
    }

    const points = state.hands[slot];
    const valid = state.handValid[slot];

    group.position.set(0, 0, 0);

    const smoothing = 1 - Math.exp(-28 * Math.min(delta, 0.05));

    for (let j = 0; j < 21; j++) {
      const o = j * 3;
      if (!valid[j]) {
        initialized.current[j] = 0;
        continue;
      }

      if (j === 0 || !initialized.current[j]) {
        smoothPoints.current[o] = points[o];
        smoothPoints.current[o + 1] = points[o + 1];
        smoothPoints.current[o + 2] = points[o + 2];
        initialized.current[j] = 1;
        continue;
      }

      smoothPoints.current[o] = THREE.MathUtils.lerp(
        smoothPoints.current[o],
        points[o],
        smoothing,
      );
      smoothPoints.current[o + 1] = THREE.MathUtils.lerp(
        smoothPoints.current[o + 1],
        points[o + 1],
        smoothing,
      );
      smoothPoints.current[o + 2] = THREE.MathUtils.lerp(
        smoothPoints.current[o + 2],
        points[o + 2],
        smoothing,
      );
    }

    // Dynamic scale centered on the wrist
    const wX = smoothPoints.current[0];
    const wY = smoothPoints.current[1];
    const wZ = smoothPoints.current[2];

    const p = scaledPoints.current;
    for (let j = 0; j < 21; j++) {
      const o = j * 3;
      p[o] = wX + (smoothPoints.current[o] - wX) * scale;
      p[o + 1] = wY + (smoothPoints.current[o + 1] - wY) * scale;
      p[o + 2] = wZ + (smoothPoints.current[o + 2] - wZ) * scale;
    }

    const fading = alpha < 0.985;
    materials.fingers.transparent = fading;
    materials.fingers.opacity = alpha;
    materials.joints.transparent = fading;
    materials.joints.opacity = alpha;
    materials.knuckleRings.transparent = fading;
    materials.knuckleRings.opacity = alpha;
    materials.tips.transparent = fading;
    materials.tips.opacity = alpha;
    materials.palm.transparent = fading;
    materials.palm.opacity = alpha;

    // 1. Finger & Metacarpal Segments
    for (let i = 0; i < ALL_HAND_SEGMENTS.length; i++) {
      const [a, b] = ALL_HAND_SEGMENTS[i];

      if (!valid[a] || !valid[b]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        bones.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, p, a * 3);
      readPoint(end, p, b * 3);

      const rA = HAND_JOINT_RADII[a] * 0.88 * scale;
      const rB = HAND_JOINT_RADII[b] * 0.82 * scale;

      updateSegment(bones, i, start, end, rA, rB, dummy, direction);
    }
    bones.instanceMatrix.needsUpdate = true;

    // 2. Knuckle Spheres and Articulation Rings
    for (let i = 0; i < 21; i++) {
      if (!valid[i]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        joints.setMatrixAt(i, dummy.matrix);
        knuckles.setMatrixAt(i, dummy.matrix);
        continue;
      }

      readPoint(start, p, i * 3);
      const rad = HAND_JOINT_RADII[i] * scale;
      updateJoint(joints, i, start, rad, dummy);

      if (i > 0 && !FINGER_TIPS.includes(i)) {
        const nextIdx = i + 1;
        readPoint(end, p, nextIdx * 3);
        direction.subVectors(end, start).normalize();
        tempQuat.setFromUnitVectors(Y_AXIS, direction);
        updateJoint(knuckles, i, start, rad * 1.08, dummy, tempQuat);
      } else {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        knuckles.setMatrixAt(i, dummy.matrix);
      }
    }
    joints.instanceMatrix.needsUpdate = true;
    knuckles.instanceMatrix.needsUpdate = true;

    // 3. Tactile Fingertips
    for (let t = 0; t < FINGER_TIPS.length; t++) {
      const tipIdx = FINGER_TIPS[t];
      if (!valid[tipIdx]) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        tips.setMatrixAt(t, dummy.matrix);
        continue;
      }

      readPoint(start, p, tipIdx * 3);
      updateJoint(tips, t, start, HAND_JOINT_RADII[tipIdx] * 1.1 * scale, dummy);
    }
    tips.instanceMatrix.needsUpdate = true;

    // 4. Contour Volumetric Palm Plate
    palm.visible = !!valid[0];
    if (palm.visible) {
      readPoint(vWrist, p, 0);
      readPoint(vIndex, p, 5 * 3);
      readPoint(vPinky, p, 17 * 3);

      vA.subVectors(vIndex, vWrist);
      vB.subVectors(vPinky, vWrist);
      vPalmNormal.crossVectors(vA, vB).normalize();

      const palmThickness = 0.013 * scale;
      const posAttr = palmGeo.getAttribute("position") as THREE.BufferAttribute;

      for (let k = 0; k < PALM_PERIMETER.length; k++) {
        const landmark = PALM_PERIMETER[k];
        const offset = landmark * 3;

        const lx = valid[landmark] ? p[offset] : p[0];
        const ly = valid[landmark] ? p[offset + 1] : p[1];
        const lz = valid[landmark] ? p[offset + 2] : p[2];

        // Front vertex
        posAttr.setXYZ(
          k,
          lx + vPalmNormal.x * palmThickness,
          ly + vPalmNormal.y * palmThickness,
          lz + vPalmNormal.z * palmThickness,
        );

        // Back vertex
        posAttr.setXYZ(
          k + 6,
          lx - vPalmNormal.x * palmThickness,
          ly - vPalmNormal.y * palmThickness,
          lz - vPalmNormal.z * palmThickness,
        );
      }

      posAttr.needsUpdate = true;
      palmGeo.computeVertexNormals();
    }
  });

  return (
    <group ref={groupRef} renderOrder={2}>
      {/* 3D Volumetric Palm Plate */}
      <mesh
        ref={palmRef}
        geometry={palmGeo}
        material={materials.palm}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Tapered Finger & Metacarpal Bones */}
      <instancedMesh
        ref={bonesRef}
        args={[fingerBoneGeo, materials.fingers, ALL_HAND_SEGMENTS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Internal Ball Knuckles */}
      <instancedMesh
        ref={jointsRef}
        args={[knuckleSphereGeo, materials.joints, 21]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Knuckle Articulation Rings */}
      <instancedMesh
        ref={knucklesRef}
        args={[knuckleRingGeo, materials.knuckleRings, 21]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />

      {/* Tactile Colored Fingertips */}
      <instancedMesh
        ref={tipsRef}
        args={[fingertipDomeGeo, materials.tips, FINGER_TIPS.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      />
    </group>
  );
}