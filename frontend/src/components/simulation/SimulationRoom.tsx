"use client";

import "@/lib/threeSetup";
import { Component, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

export const SIMULATION_FOV = 38;

/**
 * World-space Y of your EXISTING floor / platform top (where the avatar's feet are).
 * If plants or the spotlight still float or sink, nudge this: lower = everything moves down.
 */
export const ROOM_FLOOR_Y = -4.2;

/**
 * Sconce placement. They are NOT attached to any wall I draw: put them on your original wall.
 *  - SCONCE_RADIUS: distance from the room centre to your original wall (smaller = closer to camera)
 *  - SCONCE_ANGLE:  how far left/right of centre (radians)
 *  - SCONCE_Y:      height above the floor
 */
const SCONCE_RADIUS = 7.65;
const SCONCE_ANGLE = 0.72;
const SCONCE_Y = 6.05;

/** Spotlight: height of the lamp above the floor, and cone radius where it meets the floor. */
const SPOT_HEIGHT = 8.0;
const SPOT_FLOOR_RADIUS = 3.2;

/** Plant size multiplier. */
const PLANT_SCALE = 1.7;

const WARM = "#ffcf94";
const GOLD = "#b8892f";

/* ---------- helpers ---------- */

function useGlowTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/** A curved, tapered leaf blade with a centre fold and a dark-base to light-tip gradient. */
function makeLeafGeometry(length: number, width: number, bend: number) {
  const g = new THREE.PlaneGeometry(1, 1, 6, 18);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const R = length / bend;
  const base = new THREE.Color("#1f7a33");
  const tip = new THREE.Color("#6fcf5f");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i);
    const t = Math.min(Math.max(pos.getY(i) + 0.5, 0), 1);
    const profile = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.7)), 0.85);
    const x = u * 2 * width * profile;
    const a = t * bend;
    const y = R * Math.sin(a);
    // tip arcs away (-z) so the +z face is the lit top side; edges lift for a V-shaped fold
    const z = -R * (1 - Math.cos(a)) + Math.abs(x) * 0.35;
    pos.setXYZ(i, x, y, z);
    c.copy(base).lerp(tip, t);
    // slightly lighter midrib
    c.offsetHSL(0, 0, Math.max(0, 0.05 - Math.abs(u) * 0.2));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

/* ---------- room pieces ---------- */

function Sconce({ side }: { side: -1 | 1 }) {
  const y = ROOM_FLOOR_Y + SCONCE_Y;
  const th = Math.PI + side * SCONCE_ANGLE;
  const x = Math.sin(th) * SCONCE_RADIUS;
  const z = Math.cos(th) * SCONCE_RADIUS;
  const glow = useGlowTexture();
  return (
    <group position={[x, y, z]} rotation={[0, th, 0]}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.5, 24]} />
        <meshStandardMaterial color="#1c2230" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* warm light slits top and bottom */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={WARM} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={WARM} toneMapped={false} />
      </mesh>
      {/* very subtle glow */}
      {glow && (
        <>
          <sprite position={[0, 0.7, 0.1]} scale={[1.0, 1.6, 1]}>
            <spriteMaterial map={glow} color={WARM} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
          <sprite position={[0, -0.7, 0.1]} scale={[1.0, 1.6, 1]}>
            <spriteMaterial map={glow} color={WARM} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        </>
      )}
      <pointLight position={[0, 0.4, 0.5]} color={WARM} intensity={1.2} distance={4} decay={2} />
      <pointLight position={[0, -0.4, 0.5]} color={WARM} intensity={0.6} distance={3} decay={2} />
    </group>
  );
}

function Plant({ position, seed = 0 }: { position: [number, number, number]; seed?: number }) {
  const y = ROOM_FLOOR_Y;

  // Smooth egg-shaped ceramic tub (spline profile), with a short hidden skirt under the floor line.
  const potGeo = useMemo(() => {
    // taller, slightly tapered egg: height 1.0, widest ~0.4 radius
    const curve = new THREE.SplineCurve([
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.25, 0.0),
      new THREE.Vector2(0.31, 0.1),
      new THREE.Vector2(0.37, 0.35),
      new THREE.Vector2(0.4, 0.6),
      new THREE.Vector2(0.38, 0.85),
      new THREE.Vector2(0.34, 1.0),
    ]);
    const profile = curve.getPoints(40);
    // hidden skirt below the floor line so the tub always reaches the ground
    profile.unshift(new THREE.Vector2(0.25, -0.4), new THREE.Vector2(0.0, -0.4));
    // inner lip + soil level
    profile.push(new THREE.Vector2(0.31, 1.0), new THREE.Vector2(0.3, 0.94), new THREE.Vector2(0.0, 0.94));
    const geo = new THREE.LatheGeometry(profile, 64);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const leafSet = useMemo(() => {
    const rand = (n: number) => {
      const s = Math.sin((n + seed) * 127.1) * 43758.5453;
      return s - Math.floor(s);
    };
    const n = 13;
    return Array.from({ length: n }, (_, i) => {
      const length = 0.95 + rand(i + 40) * 0.5;
      return {
        yaw: (i / n) * Math.PI * 2 + rand(i) * 0.5,
        tilt: 0.12 + rand(i + 20) * 0.6,
        geo: makeLeafGeometry(length, 0.2 + rand(i + 60) * 0.06, 0.8 + rand(i + 80) * 0.7),
      };
    });
  }, [seed]);

  return (
    <group position={[position[0], y, position[2]]} scale={PLANT_SCALE}>
      <mesh geometry={potGeo} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f1eee7" roughness={0.42} metalness={0} clearcoat={0.35} clearcoatRoughness={0.5} />
      </mesh>
      {/* gold base band */}
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.255, 0.27, 0.07, 64]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.35} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.945, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.31, 48]} />
        <meshStandardMaterial color="#2a1f18" roughness={1} />
      </mesh>

      {/* leaves */}
      <group position={[0, 0.94, 0]}>
        {leafSet.map((l, i) => (
          <group key={i} rotation={[0, l.yaw, 0]}>
            <group rotation={[-l.tilt, 0, 0]}>
              <mesh geometry={l.geo} castShadow>
                <meshStandardMaterial
                  vertexColors
                  side={THREE.DoubleSide}
                  roughness={0.5}
                  metalness={0}
                  emissive="#1d6a2c"
                  emissiveIntensity={0.55}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Soft light beam: fades toward its edges and toward the floor, so it has no hard outline. */
function SpotBeam({ top, bottom, topRadius, bottomRadius }: { top: number; bottom: number; topRadius: number; bottomRadius: number }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#cfdcff") }, uStrength: { value: 0.4 } }),
    []
  );
  const height = top - bottom;
  return (
    <mesh position={[0, bottom + height / 2, 0]} renderOrder={1}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 64, 1, true]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        vertexShader={`
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vV = normalize(-mv.xyz);
            vH = uv.y; // 1 at the lamp, 0 at the floor
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uStrength;
          varying vec3 vN;
          varying vec3 vV;
          varying float vH;
          void main() {
            float facing = abs(dot(normalize(vN), normalize(vV)));
            float edge = pow(facing, 1.5);                 // soft sides
            float down = smoothstep(0.0, 0.3, vH);         // fades out just above the floor
            float up = 0.5 + 0.5 * smoothstep(0.3, 1.0, vH); // brighter near the lamp
            float a = edge * down * up * uStrength;
            gl_FragColor = vec4(uColor * a, a);
          }
        `}
      />
    </mesh>
  );
}

/** Spotlight above the avatar. */
function Spotlight() {
  const y = ROOM_FLOOR_Y;
  const top = y + SPOT_HEIGHT;
  return (
    <group>
      <spotLight
        position={[0, top, 1.2]}
        angle={0.4}
        penumbra={1}
        intensity={90}
        distance={16}
        decay={1.6}
        color="#dfe8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
      />
      <SpotBeam top={top} bottom={y - 0.2} topRadius={0.3} bottomRadius={SPOT_FLOOR_RADIUS} />
    </group>
  );
}

function Room() {
  return (
    <group>
      <Spotlight />
      <Sconce side={-1} />
      <Sconce side={1} />
      <Plant position={[-4.3, 0, -2.8]} seed={1} />
      <Plant position={[4.3, 0, -2.8]} seed={7} />
    </group>
  );
}

/* ---------- canvas wrapper ---------- */

interface SimulationRoomProps {
  children: ReactNode;
  onFail: () => void;
}

class RoomErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function SimulationRoom({ children, onFail }: SimulationRoomProps) {
  return (
    <div className="absolute inset-0">
      <RoomErrorBoundary onError={onFail}>
        <Canvas
          dpr={[1, 2]}
          shadows="percentage"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
          }}
          camera={{ fov: SIMULATION_FOV, near: 0.05, far: 200, position: [0, 0, 6] }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.05;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.domElement.addEventListener("webglcontextlost", onFail, { once: true });
          }}
        >
          <color attach="background" args={["#1b2740"]} />
          <fog attach="fog" args={["#1b2740", 12, 26]} />

          <hemisphereLight args={["#eaf0ff", "#182642", 0.7]} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={1.2}
            color="#f5f4f1"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0004}
            shadow-normalBias={0.025}
          />
          <directionalLight position={[-4, 3, -4]} intensity={0.6} color="#9cbcff" />
          <directionalLight position={[3, 2, -2]} intensity={0.26} color="#55DDE0" />

          <Room />
          {children}
        </Canvas>
      </RoomErrorBoundary>
    </div>
  );
}