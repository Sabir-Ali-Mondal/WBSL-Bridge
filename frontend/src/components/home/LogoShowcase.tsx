"use client";

import { Suspense, useMemo, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";

// ==========================================
// 0. CLOCK BRIDGE
// Bubbles/ripples are animated with the Canvas clock (starts at 0 when the
// Canvas mounts). Spawn times MUST come from that same clock — using
// performance.now() breaks after client-side navigation (e.g. from /about),
// because the page has been alive for a long time while the Canvas clock is new.
// ==========================================
function ClockBridge({ clockRef }: { clockRef: React.MutableRefObject<THREE.Clock | null> }) {
  useFrame((state) => {
    clockRef.current = state.clock;
  });
  return null;
}

// ==========================================
// 1. THE 3D LOGO WITH TACTILE TILT & CLICK INTERACTION
// ==========================================
function LogoModel({ onInteract }: { onInteract: (point: THREE.Vector3) => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/WBSL-Bridge-Logo.glb");
  const model = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (
          mesh.name.toLowerCase().includes("plane") ||
          mesh.name.toLowerCase().includes("circle") ||
          mesh.name.toLowerCase().includes("ground") ||
          mesh.name.toLowerCase().includes("shadow")
        ) {
          mesh.visible = false;
        }

        if (mesh.material instanceof THREE.MeshStandardMaterial) {
          mesh.material.roughness = 0.1;
          mesh.material.metalness = 0.4;
          mesh.material.envMapIntensity = 2.0;
        }
      }
    });
  }, [model]);

  // Smooth mouse tilt
  useFrame((state, delta) => {
    if (!group.current) return;
    const targetRotY = state.pointer.x * 0.32;
    const targetRotX = -state.pointer.y * 0.18;
    const targetPosX = state.pointer.x * 0.12;
    const targetPosY = state.pointer.y * 0.12;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 4, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetPosX, 3, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetPosY, 3, delta);
  });

  return (
    <group
      ref={group}
      scale={2.45}
      position={[0, -0.05, 0]}
      onPointerDown={(e) => {
        e.stopPropagation();
        onInteract(e.point);
      }}
      onPointerMove={(e) => {
        if (Math.random() < 0.12) {
          onInteract(e.point);
        }
      }}
    >
      <primitive object={model} />
    </group>
  );
}

// ==========================================
// 2. INTERACTIVE & AUTO-PULSED BUBBLES
// Smooth fade-in, float upward, vanish before edges
// ==========================================
export interface InteractiveBubble {
  id: number;
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  maxRadius: number;
  bornAt: number;
  lifetime: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

function InteractiveBubblesField({ bubbles }: { bubbles: InteractiveBubble[] }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;

    bubbles.forEach((b, idx) => {
      const mesh = meshRefs.current[idx];
      if (!mesh) return;

      const age = now - b.bornAt;
      const progress = age / b.lifetime;

      if (progress >= 1 || progress < 0) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;

      // Soft vertical float with organic sway
      const currentY = b.origin.y + b.velocity.y * age;
      const currentX = b.origin.x + b.velocity.x * age + Math.sin(age * b.wobbleSpeed + b.wobblePhase) * 0.08;
      const currentZ = b.origin.z + b.velocity.z * age + Math.cos(age * b.wobbleSpeed + b.wobblePhase) * 0.05;

      mesh.position.set(currentX, currentY, currentZ);

      // Smooth Ease-In and Ease-Out scale
      const scaleCurve = Math.sin(progress * Math.PI);
      const scale = b.maxRadius * scaleCurve;
      mesh.scale.setScalar(scale);

      // Alpha Fade: completely dissolves long before reaching canvas borders
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = Math.sin(progress * Math.PI) * 0.75;
      }
    });
  });

  return (
    <group>
      {bubbles.map((b, idx) => (
        <mesh
          key={b.id}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
          position={b.origin}
          visible={false}
        >
          <sphereGeometry args={[1, 24, 24]} />
          <meshPhysicalMaterial
            color="#a5f3fc"
            transmission={0.92}
            roughness={0.05}
            ior={1.22}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 3. TOUCH SHOCKWAVE PULSES
// ==========================================
interface Ripple {
  id: number;
  pos: THREE.Vector3;
  bornAt: number;
}

function DynamicTouchRipples({ ripples }: { ripples: Ripple[] }) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const now = clock.elapsedTime;
    ripples.forEach((r, idx) => {
      const mesh = meshRefs.current[idx];
      if (!mesh) return;
      const age = Math.max(now - r.bornAt, 0);
      const progress = Math.min(age / 1.1, 1);
      const scale = 0.1 + progress * 1.3;
      mesh.scale.set(scale, scale, scale);
      (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (1 - progress) * 0.7);
    });
  });

  return (
    <group>
      {ripples.map((r, idx) => (
        <mesh
          key={r.id}
          position={r.pos}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
        >
          <ringGeometry args={[0.08, 0.11, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 4. MAIN EXPORT SHOWCASE
// ==========================================
export function LogoShowcase() {
  const [bubbles, setBubbles] = useState<InteractiveBubble[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const clockRef = useRef<THREE.Clock | null>(null);

  // Function to release a cluster of bubbles & ripple
  const triggerCluster = useCallback((hitPoint: THREE.Vector3, count = 3) => {
    // Use the Canvas clock; skip until the first frame has rendered
    const clock = clockRef.current;
    if (!clock) return;
    const now = clock.elapsedTime;

    // Trigger ripple
    setRipples((prev) => [
      ...prev.slice(-5),
      { id: Math.random(), pos: hitPoint.clone(), bornAt: now },
    ]);

    // Spawn bubbles
    const newBubbles: InteractiveBubble[] = Array.from({ length: count }, () => ({
      id: Math.random(),
      origin: hitPoint.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.22,
          (Math.random() - 0.5) * 0.18,
          (Math.random() - 0.5) * 0.18
        )
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        Math.random() * 0.45 + 0.35, // Smooth upward buoyancy
        (Math.random() - 0.5) * 0.15
      ),
      maxRadius: Math.random() * 0.05 + 0.025,
      bornAt: now,
      lifetime: Math.random() * 0.8 + 1.8, // Vanishes before touching bounds (~2s)
      wobbleSpeed: Math.random() * 3 + 2,
      wobblePhase: Math.random() * Math.PI * 2,
    }));

    setBubbles((prev) => [...prev.slice(-28), ...newBubbles]);
  }, []);

  // ⏰ AUTO-RELEASE: Automatically pulses every 3 seconds from key focal points
  useEffect(() => {
    const focalPoints = [
      new THREE.Vector3(-0.55, 0.08, 0.3),  // Signer's pinch gesture
      new THREE.Vector3(0.0, 0.35, 0.4),    // West Bengal Map Center
      new THREE.Vector3(1.15, -0.08, 0.3),  // Speaker's area
      new THREE.Vector3(0.0, -0.65, 0.35),  // Bridge baseline
    ];

    let step = 0;
    const interval = setInterval(() => {
      const target = focalPoints[step % focalPoints.length];
      triggerCluster(target, 3);
      step++;
    }, 3000);

    return () => clearInterval(interval);
  }, [triggerCluster]);

  return (
    <div
      role="img"
      aria-label="Interactive 3D WBSL Bridge Showcase"
      className="relative flex items-center justify-center h-[min(70vh,580px)] min-h-[380px] w-full select-none cursor-pointer"
    >
      {/* Ambient Radial Under-Bloom */}
      <div
        className="pointer-events-none absolute h-[460px] w-[540px] rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #06b6d4 0%, #10b981 45%, transparent 80%)",
        }}
      />

      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.7], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <ClockBridge clockRef={clockRef} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[-2.5, 4, 4]} intensity={2.2} color="#f0fdfa" />
        <directionalLight position={[3.8, 0, -2]} intensity={2.6} color="#06b6d4" />
        <pointLight position={[0, -2.4, 1.8]} intensity={1.6} color="#10b981" distance={5} />

        <Suspense fallback={null}>
          <Float speed={1.3} rotationIntensity={0.06} floatIntensity={0.16}>
            <LogoModel onInteract={(point) => triggerCluster(point, Math.floor(Math.random() * 2) + 2)} />
            <DynamicTouchRipples ripples={ripples} />
            <InteractiveBubblesField bubbles={bubbles} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/WBSL-Bridge-Logo.glb");