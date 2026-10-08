import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { SolvedSequence } from "./LandmarkSimulation";
import { DHUTI_DROP, THRESH } from "./simulationConstants";

function createAlpanaTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") return new THREE.CanvasTexture();
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const center = 1024;
  const radius = 960;
  context.fillStyle = "#887c6a";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineCap = "round";
  context.lineJoin = "round";

  const drawPetal = (distance: number, length: number, width: number, color: string) => {
    context.beginPath();
    context.moveTo(0, -distance);
    context.bezierCurveTo(width, -distance - length * 0.32, width, -distance - length * 0.78, 0, -distance - length);
    context.bezierCurveTo(-width, -distance - length * 0.78, -width, -distance - length * 0.32, 0, -distance);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.stroke();
  };
  const rotateMotif = (count: number, callback: (angle: number) => void) => {
    for (let index = 0; index < count; index++) {
      const angle = (index / count) * Math.PI * 2;
      context.save();
      context.translate(center, center);
      context.rotate(angle);
      callback(angle);
      context.restore();
    }
  };

  for (const ring of [0.12, 0.16, 0.31, 0.34, 0.37, 0.58, 0.61, 0.64, 0.88, 0.91, 0.95]) {
    context.beginPath();
    context.arc(center, center, radius * ring, 0, Math.PI * 2);
    context.strokeStyle = ring === 0.34 || ring === 0.61 || ring === 0.91 ? "#a74331" : "#f7f0dc";
    context.lineWidth = ring === 0.34 || ring === 0.61 || ring === 0.91 ? 5 : 7;
    context.stroke();
  }

  rotateMotif(16, () => {
    drawPetal(radius * 0.63, radius * 0.25, radius * 0.055, "#fff8e9");
    drawPetal(radius * 0.67, radius * 0.17, radius * 0.028, "#b44431");
    context.beginPath();
    context.arc(0, -radius * 0.57, 8, 0, Math.PI * 2);
    context.fillStyle = "#fff8e9";
    context.fill();
  });

  rotateMotif(32, () => {
    drawPetal(radius * 0.39, radius * 0.13, radius * 0.035, "#fff8e9");
    context.beginPath();
    context.arc(0, -radius * 0.36, 6, 0, Math.PI * 2);
    context.fillStyle = "#b44431";
    context.fill();
  });

  rotateMotif(48, () => {
    context.beginPath();
    context.moveTo(0, -radius * 0.83);
    context.lineTo(radius * 0.018, -radius * 0.79);
    context.lineTo(0, -radius * 0.75);
    context.lineTo(-radius * 0.018, -radius * 0.79);
    context.closePath();
    context.fillStyle = "#fff8e9";
    context.fill();
    context.beginPath();
    context.arc(0, -radius * 0.86, 5, 0, Math.PI * 2);
    context.fillStyle = "#b44431";
    context.fill();
  });

  rotateMotif(12, () => {
    drawPetal(0, radius * 0.32, radius * 0.09, "#fff8e9");
    drawPetal(radius * 0.05, radius * 0.23, radius * 0.045, "#b44431");
  });

  context.beginPath();
  context.arc(center, center, radius * 0.055, 0, Math.PI * 2);
  context.fillStyle = "#b44431";
  context.fill();
  context.beginPath();
  context.arc(center, center, radius * 0.036, 0, Math.PI * 2);
  context.strokeStyle = "#fff8e9";
  context.lineWidth = 6;
  context.stroke();
  context.beginPath();
  context.arc(center, center, radius * 0.012, 0, Math.PI * 2);
  context.fillStyle = "#fff8e9";
  context.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createHtmlAlpanaTexture(anisotropy: number): THREE.CanvasTexture {
  if (typeof document === "undefined") return createAlpanaTexture();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 2048;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.47;
  const white = "#f5f2ea";
  const red = "#7D2722";
  const baseLow = "#171b26";
  const gradient = context.createRadialGradient(
    center, center, radius * 0.15, center, center, size * 0.72,
  );
  gradient.addColorStop(0, "#252A38");
  gradient.addColorStop(1, baseLow);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  for (let index = 0; index < 2600; index++) {
    context.fillStyle = Math.random() > 0.5
      ? `rgba(255,255,255,${0.02 + Math.random() * 0.04})`
      : `rgba(0,0,0,${0.02 + Math.random() * 0.05})`;
    context.fillRect(
      Math.random() * size,
      Math.random() * size,
      1 + Math.random() * 1.6,
      1 + Math.random() * 1.6,
    );
  }

  const point = (angle: number, distance: number) => ({
    x: center + Math.cos(angle) * distance,
    y: center + Math.sin(angle) * distance,
  });
  const petalPath = (angle: number, startRadius: number, endRadius: number, width: number) => {
    const perpendicularX = -Math.sin(angle);
    const perpendicularY = Math.cos(angle);
    const start = point(angle, startRadius);
    const end = point(angle, endRadius);
    const middle = point(angle, (startRadius + endRadius) / 2);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.quadraticCurveTo(
      middle.x + perpendicularX * width,
      middle.y + perpendicularY * width,
      end.x,
      end.y,
    );
    context.quadraticCurveTo(
      middle.x - perpendicularX * width,
      middle.y - perpendicularY * width,
      start.x,
      start.y,
    );
    context.closePath();
  };
  const petal = (angle: number, startRadius: number, endRadius: number, width: number) => {
    petalPath(angle, startRadius, endRadius, width);
    context.fill();
  };
  const petalLine = (
    angle: number, startRadius: number, endRadius: number, width: number, lineWidth: number,
  ) => {
    context.save();
    context.strokeStyle = baseLow;
    context.lineWidth = lineWidth;
    petalPath(angle, startRadius, endRadius, width);
    context.stroke();
    context.restore();
  };
  const fan = (
    angle: number,
    baseRadius: number,
    length: number,
    halfAngle: number,
    spokeCount: number,
    spokeWidth: number,
    arcWidth: number,
  ) => {
    const origin = point(angle, baseRadius);
    context.save();
    context.strokeStyle = white;
    context.lineCap = "round";
    context.lineWidth = spokeWidth;
    for (let spoke = 0; spoke < spokeCount; spoke++) {
      const spokeAngle = angle - halfAngle + (2 * halfAngle) * (spoke / (spokeCount - 1));
      context.beginPath();
      context.moveTo(origin.x, origin.y);
      context.lineTo(
        origin.x + Math.cos(spokeAngle) * length,
        origin.y + Math.sin(spokeAngle) * length,
      );
      context.stroke();
    }
    context.lineWidth = arcWidth;
    context.beginPath();
    context.arc(origin.x, origin.y, length, angle - halfAngle, angle + halfAngle);
    context.stroke();
    context.restore();
  };
  const redDot = (angle: number, distance: number, radiusX: number, radiusY: number) => {
    const position = point(angle, distance);
    context.save();
    context.translate(position.x, position.y);
    context.rotate(angle);
    context.fillStyle = red;
    context.beginPath();
    context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  };
  const ring = (fraction: number, lineWidth: number) => {
    context.strokeStyle = white;
    context.lineWidth = lineWidth;
    context.beginPath();
    context.arc(center, center, radius * fraction, 0, Math.PI * 2);
    context.stroke();
  };

  context.fillStyle = red;
  context.beginPath();
  context.arc(center, center, radius * 0.035, 0, Math.PI * 2);
  context.fill();
  ring(0.052, radius * 0.01);

  const centralCount = 9;
  for (let index = 0; index < centralCount; index++) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / centralCount;
    context.fillStyle = white;
    petal(angle, radius * 0.055, radius * 0.3, radius * 0.085);
    petalLine(angle, radius * 0.095, radius * 0.255, radius * 0.042, size * 0.0042);
  }

  ring(0.335, radius * 0.016);
  ring(0.372, radius * 0.016);

  const middleCount = 12;
  const middleStep = (Math.PI * 2) / middleCount;
  for (let index = 0; index < middleCount; index++) {
    const angle = -Math.PI / 2 + index * middleStep;
    redDot(angle, radius * 0.415, radius * 0.042, radius * 0.034);
    fan(angle, radius * 0.455, radius * 0.15, 1.05, 9, radius * 0.009, radius * 0.012);
    const leafAngle = angle + middleStep / 2;
    context.fillStyle = white;
    petal(leafAngle, radius * 0.4, radius * 0.6, radius * 0.045);
    petalLine(leafAngle, radius * 0.44, radius * 0.56, radius * 0.02, size * 0.0038);
  }

  const outerCount = 24;
  const outerStep = (Math.PI * 2) / outerCount;
  for (let index = 0; index < outerCount; index++) {
    const angle = -Math.PI / 2 + index * outerStep;
    if (index % 2 === 0) {
      context.fillStyle = white;
      petal(angle, radius * 0.6, radius * 0.94, radius * 0.055);
      petalLine(angle, radius * 0.66, radius * 0.88, radius * 0.024, size * 0.004);
    } else {
      fan(angle, radius * 0.63, radius * 0.185, 0.85, 7, radius * 0.008, radius * 0.01);
      context.fillStyle = white;
      const position = point(angle, radius * 0.6);
      context.beginPath();
      context.arc(position.x, position.y, radius * 0.012, 0, Math.PI * 2);
      context.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  return texture;
}

function medianValue(values: number[]): number {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

export function RoundAlpanaStage({ seq }: { seq: SolvedSequence }) {
  const accentRingRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const { frames, bounds } = seq;
  const texture = useMemo(
    () => createHtmlAlpanaTexture(gl.capabilities.getMaxAnisotropy()),
    [gl],
  );
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: "#7D2722", roughness: 0.82, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({
        map: texture,
        bumpMap: texture,
        bumpScale: 0.6,
        roughness: 0.86,
        metalness: 0.02,
      }),
      new THREE.MeshStandardMaterial({ color: "#252A38", roughness: 0.9, metalness: 0.05 }),
    ],
    [texture],
  );
  const stage = useMemo(() => {
    const hipCenters: { x: number; y: number; z: number }[] = [];
    for (const { pose } of frames) {
      if (pose[23 * 4 + 3] < THRESH || pose[24 * 4 + 3] < THRESH) continue;
      hipCenters.push({
        x: (pose[23 * 4] + pose[24 * 4]) / 2,
        y: (pose[23 * 4 + 1] + pose[24 * 4 + 1]) / 2,
        z: (pose[23 * 4 + 2] + pose[24 * 4 + 2]) / 2,
      });
    }
    const radius = Math.max((bounds.maxX - bounds.minX) * 0.74, 1.55);
    const hipX = medianValue(hipCenters.map(({ x }) => x));
    const hipY = medianValue(hipCenters.map(({ y }) => y));
    const hipZ = medianValue(hipCenters.map(({ z }) => z));
    const topY = hipY - DHUTI_DROP - 0.08;
    const thickness = 0.18;
    return {
      radius,
      position: [hipX, topY - thickness / 2, hipZ] as [number, number, number],
      topY,
      thickness,
    };
  }, [bounds, frames]);
  const diskGeometry = useMemo(
    () => new THREE.CylinderGeometry(stage.radius, stage.radius * 1.03, stage.thickness, 96),
    [stage.radius, stage.thickness],
  );
  const plinthGeometry = useMemo(
    () => new THREE.CylinderGeometry(stage.radius * 1.14, stage.radius * 1.2, 0.18, 96),
    [stage.radius],
  );
  const rimGeometry = useMemo(
    () => new THREE.TorusGeometry(stage.radius * 0.99, 0.05, 20, 120),
    [stage.radius],
  );
  const accentRingGeometry = useMemo(
    () => new THREE.TorusGeometry(stage.radius * 1.065, 0.012, 8, 120),
    [stage.radius],
  );
  const groundGeometry = useMemo(
    () => new THREE.CircleGeometry(stage.radius * 2.4, 96),
    [stage.radius],
  );
  const plinthMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#252A38", roughness: 0.9, metalness: 0.05 }),
    [],
  );
  const rimMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#9E782B", roughness: 0.44, metalness: 0.56 }),
    [],
  );
  const accentRingMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#55DDE0",
      emissive: "#123c41",
      emissiveIntensity: 0.12,
      roughness: 0.55,
      metalness: 0.35,
    }),
    [],
  );
  const groundMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#182642",
      emissive: "#101A2F",
      emissiveIntensity: 0.06,
      roughness: 0.98,
      metalness: 0,
    }),
    [],
  );

  useEffect(
    () => () => {
      texture.dispose();
      materials.forEach((material) => material.dispose());
      diskGeometry.dispose();
      plinthGeometry.dispose();
      rimGeometry.dispose();
      accentRingGeometry.dispose();
      groundGeometry.dispose();
      plinthMaterial.dispose();
      rimMaterial.dispose();
      accentRingMaterial.dispose();
      groundMaterial.dispose();
    },
    [
      texture, materials, diskGeometry, plinthGeometry, rimGeometry, accentRingGeometry,
      groundGeometry, plinthMaterial, rimMaterial, accentRingMaterial, groundMaterial,
    ],
  );

  const [x, y, z] = stage.position;
  const groundY = stage.topY - stage.thickness - 0.18 - 0.012;
  useFrame(({ clock }) => {
    const ring = accentRingRef.current;
    if (!ring) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.7) * 0.003;
    ring.scale.set(pulse, pulse, pulse);
  });

  return (
    <group>
      <mesh
        geometry={groundGeometry}
        material={groundMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, groundY, z]}
        receiveShadow
      />
      <mesh
        geometry={diskGeometry}
        material={materials}
        position={[x, y, z]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={plinthGeometry}
        material={plinthMaterial}
        position={[x, y - stage.thickness / 2 - 0.08, z]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={rimGeometry}
        material={rimMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[x, stage.topY + 0.006, z]}
        castShadow
      />
      <mesh
        ref={accentRingRef}
        geometry={accentRingGeometry}
        material={accentRingMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[x, stage.topY - 0.025, z]}
      />
      <ContactShadows
        position={[x, stage.topY + 0.008, z]}
        scale={stage.radius * 1.65}
        far={1.6}
        blur={2.2}
        opacity={0.28}
        resolution={256}
        color="#111827"
      />
      <AmbientStageParticles
        center={[x, stage.topY, z]}
        radius={stage.radius}
      />
    </group>
  );
}

function AmbientStageParticles({
  center,
  radius,
}: {
  center: [number, number, number];
  radius: number;
}) {
  const group = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(48 * 3);
    for (let index = 0; index < 48; index++) {
      const angle = index * 2.399963229728653;
      const radial = radius * (0.76 + ((index * 17) % 23) / 100);
      positions[index * 3] = Math.cos(angle) * radial;
      positions[index * 3 + 1] = 0.18 + ((index * 13) % 61) / 42;
      positions[index * 3 + 2] = Math.sin(angle) * radial;
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return result;
  }, [radius]);
  const material = useMemo(
    () => new THREE.PointsMaterial({
      color: "#55DDE0",
      size: 0.022,
      transparent: true,
      opacity: 0.26,
      sizeAttenuation: true,
      depthWrite: false,
    }),
    [],
  );

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.018;
  });

  return (
    <points
      ref={group}
      geometry={geometry}
      material={material}
      position={center}
      frustumCulled={false}
    />
  );
}
