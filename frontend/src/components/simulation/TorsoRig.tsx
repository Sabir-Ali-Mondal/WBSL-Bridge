"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./HeadFaceRig";
import { THRESH, TORSO_WORLD } from "./simulationConstants";

// ============================================================
// DESIGN CONTROLS
// ============================================================

export const DEFAULT_TOP_Y_OFFSET = 0.12;
export const DEFAULT_TOP_WIDTH_SCALE = 0.68;
export const DEFAULT_BOTTOM_WIDTH_SCALE = 0.70;

const RINGS = 32;
const SEGMENTS = 48;
const MAX_TORSO_LEAN = THREE.MathUtils.degToRad(6);
const ABS_BANDS = 4;

// ORIGINAL PALETTE: warm ivory ceramic + charcoal + amber accents
const COLORS = {
  ivory: new THREE.Color("#EDE6DA"),
  ivoryDark: new THREE.Color("#BDB3A2"),
  charcoal: new THREE.Color("#2A2A2E"),
  graphite: new THREE.Color("#45454D"),
  amber: new THREE.Color("#FF9F1C"),
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
  // SOFT CERAMIC / MATTE MATERIAL
  // ============================================================

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.2,
        roughness: 0.55,
        side: THREE.DoubleSide,
      }),
    [],
  );

  // ============================================================
  // CHEST PIECE: vertical light bar in a charcoal housing
  // ============================================================

  const reactor = useMemo(() => {
    const group = new THREE.Group();

    const housingMaterial = new THREE.MeshStandardMaterial({
      color: "#2A2A2E",
      metalness: 0.6,
      roughness: 0.35,
    });

    const barMaterial = new THREE.MeshStandardMaterial({
      color: "#FFD08A",
      emissive: "#FF9F1C",
      emissiveIntensity: 2.6,
      metalness: 0.1,
      roughness: 0.3,
    });

    // Housing plate
    const housing = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.12, 0.016),
      housingMaterial,
    );
    group.add(housing);

    // Main light bar
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.012, 0.088, 0.006),
      barMaterial,
    );
    bar.position.z = 0.011;
    group.add(bar);

    // Three small indicator dots beside the bar
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.0038, 12, 12),
        barMaterial,
      );
      dot.position.set(0.017, 0.03 - i * 0.03, 0.01);
      group.add(dot);
    }

    // Corner rivets
    for (let sx = -1; sx <= 1; sx += 2) {
      for (let sy = -1; sy <= 1; sy += 2) {
        const rivet = new THREE.Mesh(
          new THREE.SphereGeometry(0.0025, 8, 8),
          housingMaterial,
        );
        rivet.position.set(sx * 0.021, sy * 0.053, 0.009);
        group.add(rivet);
      }
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

    const hipL = new THREE.Vector3(P[24], P[25] - 0.18, P[26]);
    const hipR = new THREE.Vector3(P[28], P[29] - 0.18, P[30]);

    const hipCenter = new THREE.Vector3()
      .addVectors(hipL, hipR)
      .multiplyScalar(0.5);

    const torsoAxis = new THREE.Vector3().subVectors(shoulderCenter, hipCenter);
    const horizontalLength = Math.hypot(torsoAxis.x, torsoAxis.z);
    const maxHorizontalOffset = Math.abs(torsoAxis.y) * Math.tan(MAX_TORSO_LEAN);
    if (horizontalLength > maxHorizontalOffset && horizontalLength > 0) {
      const correction = maxHorizontalOffset / horizontalLength;
      shoulderCenter.x = hipCenter.x + torsoAxis.x * correction;
      shoulderCenter.z = hipCenter.z + torsoAxis.z * correction;
    }

    // ANATOMICAL AXES

    const up = new THREE.Vector3()
      .subVectors(shoulderCenter, hipCenter)
      .normalize();

    let right = new THREE.Vector3().subVectors(shoulderR, shoulderL);

    right.addScaledVector(up, -right.dot(up)).normalize();

    if (right.lengthSq() < 0.001) {
      right.set(1, 0, 0);
    }

    const forward = new THREE.Vector3().crossVectors(right, up).normalize();

    if (forward.z < 0) {
      forward.negate();
      right.negate();
    }

    const refScale = TORSO_WORLD * 0.22;

    const breathing = playbackRef.current.playing
      ? 1
      : 1 + Math.sin(idleTime.current * 1.35) * 0.003;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const vertexColors = geometry.getAttribute("color") as THREE.BufferAttribute;

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
        widthRatio = THREE.MathUtils.lerp(topWidth, topWidth * 1.25, st);
        depthRatio = THREE.MathUtils.lerp(0.42, 0.52, st);
      } else if (t < 0.7) {
        const mt = (t - 0.2) / 0.5;
        const peak = bottomWidth * 1.52;
        widthRatio = THREE.MathUtils.lerp(topWidth * 1.25, peak, mt);
        depthRatio = THREE.MathUtils.lerp(0.52, 0.68, mt);
      } else {
        const wt = (t - 0.7) / 0.3;
        const peak = bottomWidth * 1.52;
        widthRatio = THREE.MathUtils.lerp(peak, bottomWidth, wt);
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
            yLift -= 0.02 * (1 - Math.abs(cos) / 0.35) * fade;
          }
        }

        let depth = baseDepth;
        let effectiveWidth = halfW;

        // --------------------------------------------------------
        // CHEST: broad, flat breastplate with a shallow center ridge
        // --------------------------------------------------------

        if (t >= 0.14 && t <= 0.42 && sin > 0.05) {
          const chestT = Math.sin(((t - 0.14) / 0.28) * Math.PI);

          const plate = 0.014 * chestT * sin;
          const ridge =
            Math.abs(cos) < 0.1
              ? 0.006 * (1 - Math.abs(cos) / 0.1) * chestT
              : 0;

          depth += plate + ridge;
        }

        // --------------------------------------------------------
        // ABDOMEN: four rounded bands separated by recessed grooves
        // --------------------------------------------------------

        if (t > 0.42 && t <= 0.82) {
          const progress = (t - 0.42) / 0.4;
          const phase = (progress * ABS_BANDS) % 1;

          const band = Math.sin(phase * Math.PI) * 0.01;
          const groove = phase < 0.1 ? -0.008 : 0;

          depth += (band + groove) * Math.max(0.2, sin);
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
        // COLOUR DESIGN
        // --------------------------------------------------------

        const colour = COLORS.ivory.clone();

        // Graphite shoulder caps
        if (t < 0.12) {
          colour.copy(COLORS.graphite);
        }

        // Amber collar line
        if (t < 0.03) {
          colour.copy(COLORS.amber);
        }

        // Charcoal side panels
        if (Math.abs(cos) > 0.88 && t < 0.78) {
          colour.copy(COLORS.charcoal);
        }

        // Thin amber seam where side panels meet the front
        if (Math.abs(cos) > 0.84 && Math.abs(cos) <= 0.88 && t > 0.14 && t < 0.78) {
          colour.copy(COLORS.amber);
        }

        // Dark grooves between abdominal bands
        if (t > 0.42 && t <= 0.82) {
          const phase = (((t - 0.42) / 0.4) * ABS_BANDS) % 1;

          if (phase < 0.1 && Math.abs(cos) <= 0.84) {
            colour.copy(COLORS.charcoal);
          }
        }

        // Worn lower edge
        if (t > 0.94) {
          colour.copy(COLORS.ivoryDark);
        }

        // Subtle shading across the curved surface
        const shade = 0.96 + Math.max(0, sin) * 0.06;
        colour.multiplyScalar(shade);

        vertexColors.setXYZ(index, colour.r, colour.g, colour.b);
      }
    }

    // Bottom cap
    const bottomCap = RINGS * SEGMENTS;

    pos.setXYZ(bottomCap, hipCenter.x, hipCenter.y, hipCenter.z);

    vertexColors.setXYZ(
      bottomCap,
      COLORS.charcoal.r,
      COLORS.charcoal.g,
      COLORS.charcoal.b,
    );

    pos.needsUpdate = true;
    vertexColors.needsUpdate = true;

    geometry.computeVertexNormals();

    // ============================================================
    // CHEST PIECE POSITION AND ORIENTATION
    // ============================================================

    const reactorPosition = new THREE.Vector3().lerpVectors(
      shoulderCenter,
      hipCenter,
      0.255,
    );

    const reactorWidth = refScale * topWidth * 1.25;

    reactorPosition.addScaledVector(forward, reactorWidth * 0.52);
    reactorPosition.addScaledVector(up, -0.005);

    reactorGroup.position.copy(reactorPosition);

    // Align the housing's long axis with the torso's up direction
    const basis = new THREE.Matrix4().makeBasis(
      new THREE.Vector3().crossVectors(up, forward).normalize(),
      up,
      forward,
    );
    reactorGroup.quaternion.setFromRotationMatrix(basis);

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

      <primitive ref={reactorRef} object={reactor} />
    </group>
  );
}