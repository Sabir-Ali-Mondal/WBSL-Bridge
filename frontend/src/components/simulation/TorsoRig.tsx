
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { THRESH, TORSO_WORLD } from "./simulationConstants";

// ============================================================
// DESIGN CONTROLS
// ============================================================

export const DEFAULT_TOP_Y_OFFSET = 0.08;
export const DEFAULT_TOP_WIDTH_SCALE = 0.55;
export const DEFAULT_BOTTOM_WIDTH_SCALE = 0.68;

const RINGS = 32;
const SEGMENTS = 48;

// PREMIUM ROBOT COLOURS
const COLORS = {
  pearl: new THREE.Color("#E8F0F5"),
  pearlDark: new THREE.Color("#AEBFCC"),
  navy: new THREE.Color("#102344"),
  navyLight: new THREE.Color("#25466E"),
  cyan: new THREE.Color("#19EBD0"),
  black: new THREE.Color("#101D30"),
};

const TORSO_INDICES = (() => {
  const indices: number[] = [];

  for (let r = 0; r < RINGS - 1; r++) {
    const r0 = r * SEGMENTS;
    const r1 = (r + 1) * SEGMENTS;

    for (let s = 0; s < SEGMENTS; s++) {
      const next = (s + 1) % SEGMENTS;

      indices.push(r0 + s, r1 + s, r1 + next);
      indices.push(r0 + s, r1 + next, r0 + next);
    }
  }

  const bottomCenter = RINGS * SEGMENTS;
  const bottomRing = (RINGS - 1) * SEGMENTS;

  for (let s = 0; s < SEGMENTS; s++) {
    const next = (s + 1) % SEGMENTS;
    indices.push(bottomCenter, bottomRing + s, bottomRing + next);
  }

  return indices;
})();

interface PlaybackRef {
  current: { playing: boolean };
}

interface TorsoRigProps {
  sampleRef: SampleRef;
  playbackRef: PlaybackRef;
  topYOffset?: number;
  topWidth?: number;
  bottomWidth?: number;
}

export function TorsoRig({
  sampleRef,
  playbackRef,
  topYOffset = DEFAULT_TOP_Y_OFFSET,
  topWidth = DEFAULT_TOP_WIDTH_SCALE,
  bottomWidth = DEFAULT_BOTTOM_WIDTH_SCALE,
}: TorsoRigProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reactorRef = useRef<THREE.Group>(null);
  const idleTime = useRef(0);

  // ============================================================
  // DYNAMIC TORSO GEOMETRY
  // ============================================================

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const vertCount = RINGS * SEGMENTS + 1;

    const positions = new Float32Array(vertCount * 3);
    const colors = new Float32Array(vertCount * 3);
    const uvs = new Float32Array(vertCount * 2);

    g.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );

    g.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3).setUsage(
        THREE.DynamicDrawUsage,
      ),
    );

    for (let r = 0; r < RINGS; r++) {
      const t = r / (RINGS - 1);

      for (let s = 0; s < SEGMENTS; s++) {
        const idx = (r * SEGMENTS + s) * 2;
        uvs[idx] = s / SEGMENTS;
        uvs[idx + 1] = 1 - t;
      }
    }

    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(TORSO_INDICES);

    return g;
  }, []);

  // ============================================================
  // PREMIUM PEARL METALLIC MATERIAL
  // ============================================================

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.48,
        roughness: 0.27,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // ============================================================
  // CHEST REACTOR
  // ============================================================

  const reactor = useMemo(() => {
    const group = new THREE.Group();

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: "#183653",
      metalness: 0.85,
      roughness: 0.2,
    });

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: "#19EBD0",
      emissive: "#00BFA9",
      emissiveIntensity: 2.2,
      metalness: 0.5,
      roughness: 0.2,
    });

    const coreMaterial = new THREE.MeshStandardMaterial({
      color: "#BFFFF7",
      emissive: "#13EBD0",
      emissiveIntensity: 3.5,
      metalness: 0.25,
      roughness: 0.15,
    });

    // Dark mechanical outer housing
    const housing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.052, 0.052, 0.018, 48),
      bezelMaterial,
    );
    housing.rotation.x = Math.PI / 2;
    group.add(housing);

    // Cyan luminous outer ring
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.043, 0.005, 12, 48),
      ringMaterial,
    );
    outerRing.position.z = 0.014;
    group.add(outerRing);

    // Inner energy ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.029, 0.0025, 8, 48),
      ringMaterial,
    );
    innerRing.position.z = 0.018;
    group.add(innerRing);

    // Glowing central reactor
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 32, 24),
      coreMaterial,
    );
    orb.scale.set(1, 1, 0.38);
    orb.position.z = 0.018;
    group.add(orb);

    // Small mechanical screws
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;

      const screw = new THREE.Mesh(
        new THREE.SphereGeometry(0.003, 8, 8),
        bezelMaterial,
      );

      screw.position.set(
        Math.cos(angle) * 0.048,
        Math.sin(angle) * 0.048,
        0.014,
      );

      group.add(screw);
    }

    return group;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      reactor.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();

          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, [geometry, material, reactor]);

  // ============================================================
  // ANIMATION AND PROCEDURAL SCULPTING
  // ============================================================

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const reactorGroup = reactorRef.current;

    if (!mesh || !reactorGroup) return;

    if (!playbackRef.current.playing) {
      idleTime.current += Math.min(delta, 0.1);
    }

    const P = sampleRef.current.pose;

    const ok =
      P[0 * 4 + 3] >= THRESH &&
      P[1 * 4 + 3] >= THRESH &&
      P[6 * 4 + 3] >= THRESH &&
      P[7 * 4 + 3] >= THRESH;

    mesh.visible = ok;
    reactorGroup.visible = ok;

    if (!ok) return;

    // LANDMARKS

    const shoulderL = new THREE.Vector3(P[0], P[1], P[2]);
    const shoulderR = new THREE.Vector3(P[4], P[5], P[6]);

    const shoulderCenter = new THREE.Vector3(
      (P[0] + P[4]) / 2,
      (P[1] + P[5]) / 2,
      (P[2] + P[6]) / 2,
    );

    const hipL = new THREE.Vector3(
      P[24],
      P[25] - 0.18,
      P[26],
    );

    const hipR = new THREE.Vector3(
      P[28],
      P[29] - 0.18,
      P[30],
    );

    const hipCenter = new THREE.Vector3()
      .addVectors(hipL, hipR)
      .multiplyScalar(0.5);

    // ANATOMICAL AXES

    const up = new THREE.Vector3()
      .subVectors(shoulderCenter, hipCenter)
      .normalize();

    let right = new THREE.Vector3()
      .subVectors(shoulderR, shoulderL);

    right.addScaledVector(up, -right.dot(up)).normalize();

    if (right.lengthSq() < 0.001) {
      right.set(1, 0, 0);
    }

    const forward = new THREE.Vector3()
      .crossVectors(right, up)
      .normalize();

    if (forward.z < 0) {
      forward.negate();
      right.negate();
    }

    const refScale = TORSO_WORLD * 0.22;

    const breathing = playbackRef.current.playing
      ? 1
      : 1 + Math.sin(idleTime.current * 1.35) * 0.003;

    const pos = geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;

    const vertexColors = geometry.getAttribute(
      "color",
    ) as THREE.BufferAttribute;

    // ============================================================
    // VERTEX GENERATION
    // ============================================================

    for (let ring = 0; ring < RINGS; ring++) {
      const t = ring / (RINGS - 1);

      const center = new THREE.Vector3().lerpVectors(
        shoulderCenter,
        hipCenter,
        t,
      );

      let widthRatio = 1;
      let depthRatio = 1;

      if (t < 0.2) {
        const st = t / 0.2;

        widthRatio = THREE.MathUtils.lerp(
          topWidth,
          topWidth * 1.25,
          st,
        );

        depthRatio = THREE.MathUtils.lerp(0.42, 0.52, st);
      } else if (t < 0.70) {
        const mt = (t - 0.2) / 0.5;
        const peak = bottomWidth * 1.52;

        widthRatio = THREE.MathUtils.lerp(
          topWidth * 1.25,
          peak,
          mt,
        );

        depthRatio = THREE.MathUtils.lerp(0.52, 0.68, mt);
      } else {
        const wt = (t - 0.70) / 0.30;
        const peak = bottomWidth * 1.52;

        widthRatio = THREE.MathUtils.lerp(
          peak,
          bottomWidth,
          wt,
        );

        depthRatio = THREE.MathUtils.lerp(0.68, 0.46, wt);
      }

      const halfW = refScale * widthRatio * breathing;
      const baseDepth = Math.max(halfW * depthRatio, 0.07);

      for (let s = 0; s < SEGMENTS; s++) {
        const angle = (s / SEGMENTS) * Math.PI * 2;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        let yLift = 0;

        if (t < 0.25) {
          const fade = 1 - t / 0.25;
          const arch = Math.pow(Math.abs(cos), 1.2);

          yLift = (topYOffset + arch * 0.03) * fade;

          if (sin > 0 && Math.abs(cos) < 0.35) {
            yLift -=
              0.02 *
              (1 - Math.abs(cos) / 0.35) *
              fade;
          }
        }

        let depth = baseDepth;
        let effectiveWidth = halfW;

        // --------------------------------------------------------
        // CHEST ARMOUR
        // --------------------------------------------------------

        if (t >= 0.14 && t <= 0.42 && sin > 0.05) {
          const chestT = Math.sin(
            ((t - 0.14) / 0.28) * Math.PI,
          );

          const sternum =
            Math.abs(cos) < 0.16
              ? -0.012 * (1 - Math.abs(cos) / 0.16)
              : 0;

          const pec =
            Math.sin(
              Math.min(Math.PI, Math.abs(cos) * 2.8),
            ) *
            0.02 *
            chestT *
            sin;

          depth += pec + sternum;
        }

        // --------------------------------------------------------
        // FIVE SCULPTED ABDOMINAL ARMOUR LAYERS
        // --------------------------------------------------------

        if (t > 0.42 && t <= 0.82) {
          const progress = (t - 0.42) / 0.40;
          const phase = (progress * 5) % 1;

          const bevel = Math.sin(phase * Math.PI) * 0.014;

          depth += bevel * Math.max(0.2, sin);

          if (Math.abs(cos) > 0.65) {
            effectiveWidth +=
              Math.sin(phase * Math.PI * 2) * 0.007;
          }
        }

        // --------------------------------------------------------
        // 3D POSITION
        // --------------------------------------------------------

        const vert = new THREE.Vector3()
          .copy(center)
          .addScaledVector(right, cos * effectiveWidth)
          .addScaledVector(forward, sin * depth)
          .addScaledVector(up, yLift);

        const index = ring * SEGMENTS + s;

        pos.setXYZ(index, vert.x, vert.y, vert.z);

        // --------------------------------------------------------
        // PREMIUM COLOUR DESIGN
        // --------------------------------------------------------

        let colour = COLORS.pearl.clone();

        // Dark navy mechanical shoulders
        if (t < 0.12) {
          colour.copy(COLORS.navyLight);
        }

        // Navy side armour
        if (Math.abs(cos) > 0.88 && t < 0.78) {
          colour.copy(COLORS.navy);
        }

        // Darker chest sternum detail
        if (
          t >= 0.14 &&
          t <= 0.42 &&
          Math.abs(cos) < 0.055 &&
          sin > 0.2
        ) {
          colour.copy(COLORS.navyLight);
        }

        // Dark blue separation between abdominal plates
        if (t > 0.42 && t <= 0.82) {
          const phase = (((t - 0.42) / 0.40) * 5) % 1;

          if (phase < 0.075 && sin > 0.3) {
            colour.copy(COLORS.navyLight);
          }
        }

        // Dark mechanical bottom edge
        if (t > 0.94) {
          colour.copy(COLORS.pearlDark);
        }

        // Subtle lighting variation across curved surface
        const shade = 0.96 + Math.max(0, sin) * 0.06;
        colour.multiplyScalar(shade);

        vertexColors.setXYZ(
          index,
          colour.r,
          colour.g,
          colour.b,
        );
      }
    }

    // Bottom cap
    const bottomCap = RINGS * SEGMENTS;

    pos.setXYZ(
      bottomCap,
      hipCenter.x,
      hipCenter.y,
      hipCenter.z,
    );

    vertexColors.setXYZ(
      bottomCap,
      COLORS.navy.r,
      COLORS.navy.g,
      COLORS.navy.b,
    );

    pos.needsUpdate = true;
    vertexColors.needsUpdate = true;

    geometry.computeVertexNormals();

    // ============================================================
    // CHEST REACTOR POSITION AND ORIENTATION
    // ============================================================

    const reactorPosition = new THREE.Vector3().lerpVectors(
      shoulderCenter,
      hipCenter,
      0.255,
    );

    const reactorWidth = refScale * topWidth * 1.25;

    reactorPosition.addScaledVector(
      forward,
      reactorWidth * 0.52,
    );

    reactorPosition.addScaledVector(up, -0.005);

    reactorGroup.position.copy(reactorPosition);

    reactorGroup.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      forward,
    );

    reactorGroup.scale.setScalar(TORSO_WORLD * 0.38);
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        frustumCulled={false}
        renderOrder={-1}
        castShadow
        receiveShadow
      />

      <primitive
        ref={reactorRef}
        object={reactor}
      />
    </group>
  );
}
