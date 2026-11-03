import * as THREE from "three";

const matrix = new THREE.Matrix4();
const quaternion = new THREE.Quaternion();
const position = new THREE.Vector3();
const scale = new THREE.Vector3();
const direction = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

export const ZERO_MATRIX = new THREE.Matrix4().makeScale(0, 0, 0);

let boneGeometry: THREE.CylinderGeometry | null = null;
let jointGeometry: THREE.SphereGeometry | null = null;
let headGeometry: THREE.SphereGeometry | null = null;

export const getBoneGeometry = () =>
  (boneGeometry ??= new THREE.CylinderGeometry(0.78, 1, 1, 14, 1, false));
export const getJointGeometry = () =>
  (jointGeometry ??= new THREE.SphereGeometry(1, 18, 14));
export const getHeadGeometry = () =>
  (headGeometry ??= new THREE.SphereGeometry(1, 36, 26));

export function placeBone(
  mesh: THREE.InstancedMesh,
  index: number,
  start: ArrayLike<number>,
  startOffset: number,
  end: ArrayLike<number>,
  endOffset: number,
  radius: number,
): void {
  direction.set(
    end[endOffset] - start[startOffset],
    end[endOffset + 1] - start[startOffset + 1],
    end[endOffset + 2] - start[startOffset + 2],
  );
  const length = direction.length();
  if (length < 1e-5) {
    mesh.setMatrixAt(index, ZERO_MATRIX);
    return;
  }
  direction.multiplyScalar(1 / length);
  quaternion.setFromUnitVectors(up, direction);
  position.set(
    (start[startOffset] + end[endOffset]) / 2,
    (start[startOffset + 1] + end[endOffset + 1]) / 2,
    (start[startOffset + 2] + end[endOffset + 2]) / 2,
  );
  scale.set(radius, length, radius);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(index, matrix);
}

export function placeJoint(
  mesh: THREE.InstancedMesh,
  index: number,
  points: ArrayLike<number>,
  offset: number,
  radius: number,
): void {
  position.set(points[offset], points[offset + 1], points[offset + 2]);
  quaternion.identity();
  scale.setScalar(radius);
  matrix.compose(position, quaternion, scale);
  mesh.setMatrixAt(index, matrix);
}

export function hideAll(mesh: THREE.InstancedMesh | null): void {
  if (!mesh) return;
  for (let index = 0; index < mesh.count; index++) {
    mesh.setMatrixAt(index, ZERO_MATRIX);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
