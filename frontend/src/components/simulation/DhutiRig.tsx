import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { SampleRef } from "./LandmarkSimulation";
import { DHUTI_DROP, THRESH } from "./simulationConstants";

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _sa = new Float32Array(3);

function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < mesh.count; i++) mesh.setMatrixAt(i, hidden);
  mesh.instanceMatrix.needsUpdate = true;
}

/* ==========================================================================
 * 6b. 3D: BENGALI DHUTI — knee-length draped wrap (fixed hem, no stretch)
 *
 * The hem is a FIXED drop below the hip line (at the knee):
 *   - it never reads knee/ankle landmarks, so leg motion cannot stretch it
 *   - the bottom stays WIDE (wrap-skirt silhouette), not a gathered tube
 *   - wrapped super-ellipse section + spiral twist + side/back drape folds
 *   - folded waistband, thin gold hem border, front anchal pleat panel with
 *     a column of gold buti motifs (like the reference drawing)
 * ========================================================================== */

const DHUTI_SEGMENTS = 22;
const DHUTI_ROWS = [0, 0.1, 0.22, 0.36, 0.52, 0.68, 0.84, 1];
const PANEL_T = 0.85;
const PANEL_ROWS = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.85, 1];
const PANEL_COLS = [-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6];
const MOTIF_ROWS = [1, 2, 3, 4, 5, 6];

type ProfRow = [number, number, number];

interface DhutiFrame {
  cx: number; cz: number; waistY: number; hemY: number; hw: number;
  twist: number; prof: ProfRow[];
}

/* Wide at the hip, still wide at the hem (thigh) — a wrap, not a cone. */
const DHUTI_PROFILE: ProfRow[] = [
  [0, 0.88, 0.68],
  [0.18, 1.16, 0.86],
  [0.6, 1.14, 0.83],
  [1, 1.04, 0.78],
];

function profileAt(prof: ProfRow[], t: number): [number, number] {
  const tt = Math.min(Math.max(t, 0), 1);
  for (let i = 0; i < prof.length - 1; i++) {
    const [t0, a0, b0] = prof[i];
    const [t1, a1, b1] = prof[i + 1];
    if (tt <= t1 || i === prof.length - 2) {
      const span = Math.max(t1 - t0, 1e-4);
      const k = Math.min(Math.max((tt - t0) / span, 0), 1);
      return [a0 + (a1 - a0) * k, b0 + (b1 - b0) * k];
    }
  }
  const last = prof[prof.length - 1];
  return [last[1], last[2]];
}

function dhotiPoint(f: DhutiFrame, t: number, k: number, mul: number, out: Float32Array, o: number): void {
  const th = (k / DHUTI_SEGMENTS) * Math.PI * 2;
  const tt = Math.max(t, 0);
  const [am, bm] = profileAt(f.prof, tt);
  const wrap = th + f.twist * tt;
  const front = (Math.cos(th) + 1) * 0.5;
  const fold = (0.026 + 0.045 * tt) * (0.5 + 0.5 * (1 - front));
  const pert = 1 + fold * Math.sin(wrap * 5 + tt * 2.2) + fold * 0.5 * Math.sin(wrap * 9 - tt * 1.4);
  const e = 0.78;
  const sx = Math.sign(Math.sin(wrap)) * Math.pow(Math.abs(Math.sin(wrap)), e);
  const sz = Math.sign(Math.cos(wrap)) * Math.pow(Math.abs(Math.cos(wrap)), e);
  const a = (f.hw * am + 0.02) * mul * pert;
  const b = (f.hw * bm + 0.02) * mul * pert;
  out[o] = f.cx + sx * a;
  out[o + 1] = f.waistY + (f.hemY - f.waistY) * t - 0.025 * (1 - front) * mul;
  out[o + 2] = f.cz + sz * b;
}

function panelPoint(f: DhutiFrame, v: number, u: number, lift: number, out: Float32Array, o: number): void {
  const t = v * PANEL_T;
  const [am, bm] = profileAt(f.prof, t);
  const pleat = 0.045 * Math.sin(u * 9.4) * (0.3 + 0.7 * v);
  const a = f.hw * am * 0.6;
  const b = f.hw * bm + 0.02;
  out[o] = f.cx + u * a;
  out[o + 1] = f.waistY + (f.hemY - f.waistY) * t - Math.abs(u) * 0.05 * v;
  out[o + 2] = f.cz + b * (1.05 - 0.16 * u * u) + 0.03 + pleat + lift;
}

type DhutiKind = "cloth" | "band" | "gold" | "flap";
interface DhutiPart {
  rows: number; cols: number; closed: boolean; kind: DhutiKind;
  fill: (f: DhutiFrame, r: number, c: number, out: Float32Array, o: number) => void;
}

const DHUTI_PARTS: DhutiPart[] = [
  {
    rows: DHUTI_ROWS.length, cols: DHUTI_SEGMENTS, closed: true, kind: "cloth",
    fill: (f, r, c, out, o) => dhotiPoint(f, DHUTI_ROWS[r], c, 1, out, o),
  },
  {
    rows: 2, cols: DHUTI_SEGMENTS, closed: true, kind: "band",
    fill: (f, r, c, out, o) => dhotiPoint(f, r === 0 ? -0.07 : 0.035, c, 1.07, out, o),
  },
  {
    rows: 2, cols: DHUTI_SEGMENTS, closed: true, kind: "gold",
    fill: (f, r, c, out, o) => dhotiPoint(f, r === 0 ? 0.92 : 1, c, 1.02, out, o),
  },
  {
    rows: PANEL_ROWS.length, cols: PANEL_COLS.length, closed: false, kind: "cloth",
    fill: (f, r, c, out, o) => panelPoint(f, PANEL_ROWS[r], PANEL_COLS[c], 0, out, o),
  },
  {
    rows: PANEL_ROWS.length, cols: PANEL_COLS.length, closed: false, kind: "flap",
    fill: (f, r, c, out, o) => panelPoint(f, PANEL_ROWS[r], PANEL_COLS[c] * 0.52, 0.034, out, o),
  },
];

const PLEAT_COUNT = 6;
const PLEAT_STEPS = 12;
const PLEAT_COLUMNS = [-0.48, -0.3, -0.12, 0.12, 0.3, 0.48];

function buildDhotiGrid(def: DhutiPart): THREE.BufferGeometry {
  const { rows, cols, closed } = def;
  const g = new THREE.BufferGeometry();
  g.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(rows * cols * 3), 3).setUsage(THREE.DynamicDrawUsage),
  );
  const idx: number[] = [];
  const quadCols = closed ? cols : cols - 1;
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < quadCols; c++) {
      const c2 = (c + 1) % cols;
      const a = r * cols + c;
      const b = r * cols + c2;
      const d = (r + 1) * cols + c;
      const e = (r + 1) * cols + c2;
      idx.push(a, d, b, b, d, e);
    }
  }
  g.setIndex(idx);
  return g;
}

export function DhutiRig({ sampleRef }: { sampleRef: SampleRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const motifsRef = useRef<THREE.InstancedMesh>(null);
  const pleatsRef = useRef<THREE.LineSegments>(null);
  const hemRef = useRef<number>(Number.NaN);
  const frame = useMemo<DhutiFrame>(
    () => ({ cx: 0, cz: 0, waistY: 0, hemY: -1.1, hw: 0.4, twist: 0.55, prof: DHUTI_PROFILE }),
    [],
  );
  const parts = useMemo(() => DHUTI_PARTS.map((def) => ({ def, geometry: buildDhotiGrid(def) })), []);
  const pleatGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(PLEAT_COUNT * PLEAT_STEPS * 2 * 3),
        3,
      ).setUsage(THREE.DynamicDrawUsage),
    );
    return geometry;
  }, []);
  const motifGeo = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const mats = useMemo(
    () => ({
      cloth: new THREE.MeshStandardMaterial({
        color: "#F4F1E7",
        side: THREE.DoubleSide,
        roughness: 0.78,
        metalness: 0.015,
      }),
      band: new THREE.MeshStandardMaterial({
        color: "#DAD9D2",
        side: THREE.DoubleSide,
        roughness: 0.76,
        metalness: 0.02,
      }),
      flap: new THREE.MeshStandardMaterial({
        color: "#F4F1E7",
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0,
      }),
      gold: new THREE.MeshStandardMaterial({
        color: "#C79A32",
        side: THREE.DoubleSide,
        roughness: 0.48,
        metalness: 0.3,
        emissive: "#2b1e08",
        emissiveIntensity: 0.04,
        polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
      }),
    }),
    [],
  );
  const pleatMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#D4D5D0", transparent: true, opacity: 0.55 }),
    [],
  );
  useEffect(
    () => () => {
      parts.forEach((p) => p.geometry.dispose());
      pleatGeometry.dispose();
      pleatMaterial.dispose();
      motifGeo.dispose();
      mats.cloth.dispose(); mats.band.dispose(); mats.flap.dispose(); mats.gold.dispose();
    },
    [parts, pleatGeometry, pleatMaterial, motifGeo, mats],
  );
  useLayoutEffect(() => hideAll(motifsRef.current), []);

  useFrame(() => {
    const group = groupRef.current;
    const motifs = motifsRef.current;
    if (!group || !motifs) return;
    const P = sampleRef.current.pose;
    const vis = (i: number) => P[i * 4 + 3] >= THRESH;
    if (!(vis(23) && vis(24))) {
      group.visible = false;
      return;
    }
    group.visible = true;

    const hipY = (P[23 * 4 + 1] + P[24 * 4 + 1]) / 2;
    frame.cx = (P[23 * 4] + P[24 * 4]) / 2;
    frame.cz = (P[23 * 4 + 2] + P[24 * 4 + 2]) / 2;
    frame.hw = Math.max(Math.abs(P[24 * 4] - P[23 * 4]) / 2, 0.14) * 1.12;
    frame.waistY = hipY + 0.08;

    /* Fixed knee-length hem; leg motion never stretches it. */
    const target = hipY - DHUTI_DROP;
    hemRef.current = Number.isFinite(hemRef.current)
      ? hemRef.current + (target - hemRef.current) * 0.2
      : target;
    frame.hemY = hemRef.current;

    for (const { def, geometry } of parts) {
      const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let r = 0; r < def.rows; r++) {
        for (let c = 0; c < def.cols; c++) def.fill(frame, r, c, arr, (r * def.cols + c) * 3);
      }
      attr.needsUpdate = true;
      geometry.computeVertexNormals();
    }

    const pleatPosition = pleatGeometry.getAttribute("position") as THREE.BufferAttribute;
    const pleatArray = pleatPosition.array as Float32Array;
    for (let pleat = 0; pleat < PLEAT_COUNT; pleat++) {
      const u = PLEAT_COLUMNS[pleat];
      for (let step = 0; step < PLEAT_STEPS; step++) {
        const v0 = 0.08 + (0.82 * step) / PLEAT_STEPS;
        const v1 = 0.08 + (0.82 * (step + 1)) / PLEAT_STEPS;
        const vertex = (pleat * PLEAT_STEPS + step) * 6;
        panelPoint(frame, v0, u * 0.52, 0.041, pleatArray, vertex);
        panelPoint(frame, v1, u * 0.52, 0.041, pleatArray, vertex + 3);
      }
    }
    pleatPosition.needsUpdate = true;
    pleatGeometry.computeBoundingSphere();

    for (let m = 0; m < MOTIF_ROWS.length; m++) {
      const v = PANEL_ROWS[MOTIF_ROWS[m]];
      panelPoint(frame, v, 0, 0.012, _sa, 0);
      _p.set(_sa[0], _sa[1], _sa[2]);
      _q.identity();
      _s.set(0.05, 0.07, 0.02);
      _m.compose(_p, _q, _s);
      motifs.setMatrixAt(m, _m);
    }
    motifs.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      {parts.map(({ def, geometry }, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={mats[def.kind]}
          frustumCulled={false}
          castShadow
          receiveShadow
        />
      ))}
      <lineSegments
        ref={pleatsRef}
        geometry={pleatGeometry}
        material={pleatMaterial}
        frustumCulled={false}
        renderOrder={1}
      />
      <instancedMesh
        ref={motifsRef}
        args={[motifGeo, mats.gold, MOTIF_ROWS.length]}
        frustumCulled={false}
        castShadow
      />
    </group>
  );
}
