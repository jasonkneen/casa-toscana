import { useMemo } from "react";
import * as THREE from "three";
import { EAVE_Y, OVERHANG, ROOF_H, ROOF_RIDGE, W, D, buildRoofFaces } from "@/lib/building/geometry";

/**
 * Real coppi: instanced barrel tiles laid in overlapping rows over the four
 * hip faces, with cap runs along the ridge and hips. One InstancedMesh for
 * the field tiles, one for the caps — two draw calls for the whole roof.
 */

const TILE_R = 0.085;
const TILE_LEN = 0.52;
const ROW_STEP = 0.4; // down-slope spacing (overlap = TILE_LEN - ROW_STEP)
const PITCH = 0.19; // across-slope spacing
const CAP_R = 0.115;
const CAP_LEN = 0.5;
const CAP_STEP = 0.42;

type FaceDef = {
  p0: THREE.Vector3; // eave left
  p1: THREE.Vector3; // eave right
  a0: THREE.Vector3; // apex left
  a1: THREE.Vector3; // apex right
};

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function faceDefs(): FaceDef[] {
  const hx = W / 2 + OVERHANG;
  const hz = D / 2 + OVERHANG;
  const y0 = EAVE_Y + 0.04;
  const y1 = EAVE_Y + ROOF_H;
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  return [
    // front
    { p0: v(-hx, y0, hz), p1: v(hx, y0, hz), a0: v(-ROOF_RIDGE, y1, 0), a1: v(ROOF_RIDGE, y1, 0) },
    // back
    { p0: v(hx, y0, -hz), p1: v(-hx, y0, -hz), a0: v(ROOF_RIDGE, y1, 0), a1: v(-ROOF_RIDGE, y1, 0) },
    // left
    { p0: v(-hx, y0, -hz), p1: v(-hx, y0, hz), a0: v(-ROOF_RIDGE, y1, 0), a1: v(-ROOF_RIDGE, y1, 0) },
    // right
    { p0: v(hx, y0, hz), p1: v(hx, y0, -hz), a0: v(ROOF_RIDGE, y1, 0), a1: v(ROOF_RIDGE, y1, 0) },
  ];
}

type Instance = { pos: THREE.Vector3; quat: THREE.Quaternion; color: THREE.Color };

function clayColor(rand: () => number): THREE.Color {
  const c = new THREE.Color();
  const roll = rand();
  if (roll > 0.96) {
    // the odd blackened or lichen-dusted tile
    c.setHSL(0.07 + rand() * 0.03, 0.22 + rand() * 0.1, 0.2 + rand() * 0.06);
  } else if (roll > 0.92) {
    // pale sun-baked tile
    c.setHSL(0.06 + rand() * 0.02, 0.42 + rand() * 0.08, 0.48 + rand() * 0.05);
  } else {
    c.setHSL(0.032 + rand() * 0.03, 0.5 + rand() * 0.12, 0.3 + rand() * 0.1);
  }
  return c;
}

function buildInstances() {
  const rand = mulberry(20260816);
  const tiles: Instance[] = [];
  const caps: Instance[] = [];
  const faces = faceDefs();
  const normals: THREE.Vector3[] = [];

  const u = new THREE.Vector3();
  const slope = new THREE.Vector3();
  const n = new THREE.Vector3();
  const left = new THREE.Vector3();
  const right = new THREE.Vector3();
  const m = new THREE.Matrix4();

  for (const f of faces) {
    u.subVectors(f.p1, f.p0).normalize();
    const eaveMid = new THREE.Vector3().addVectors(f.p0, f.p1).multiplyScalar(0.5);
    const apexMid = new THREE.Vector3().addVectors(f.a0, f.a1).multiplyScalar(0.5);
    const slopeLen = apexMid.distanceTo(eaveMid);
    slope.subVectors(apexMid, eaveMid).normalize();
    n.crossVectors(u, slope).normalize();
    normals.push(n.clone());

    const rows = Math.ceil((slopeLen - 0.12) / ROW_STEP);
    for (let r = 0; r < rows; r++) {
      const sAlong = r * ROW_STEP + TILE_LEN * 0.5 - 0.08; // slight eave overhang
      const t = sAlong / slopeLen;
      if (t > 1 - 0.03 / slopeLen) continue;
      left.lerpVectors(f.p0, f.a0, t);
      right.lerpVectors(f.p1, f.a1, t);
      const width = left.distanceTo(right);
      const count = Math.floor((width - 0.05) / PITCH);
      if (count < 1) continue;
      const start = (width - count * PITCH) / 2 + PITCH / 2;
      for (let i = 0; i < count; i++) {
        const pos = left
          .clone()
          .addScaledVector(u, start + i * PITCH + (rand() - 0.5) * 0.012)
          .addScaledVector(n, TILE_R * 0.4)
          .addScaledVector(slope, (rand() - 0.5) * 0.02);
        m.makeBasis(u, slope, n);
        const quat = new THREE.Quaternion().setFromRotationMatrix(m);
        // slight random roll around the slope axis so rows do not read machined
        quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (rand() - 0.5) * 0.09));
        tiles.push({ pos, quat, color: clayColor(rand) });
      }
    }
  }

  // ridge caps
  const y1 = EAVE_Y + ROOF_H;
  {
    const axis = new THREE.Vector3(1, 0, 0);
    const out = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3(0, 0, 1);
    const len = ROOF_RIDGE * 2 + 0.3;
    const count = Math.ceil(len / CAP_STEP);
    for (let i = 0; i < count; i++) {
      const x = -ROOF_RIDGE - 0.15 + CAP_STEP * (i + 0.5);
      m.makeBasis(side, axis, out);
      const quat = new THREE.Quaternion().setFromRotationMatrix(m);
      caps.push({
        pos: new THREE.Vector3(x, y1 + 0.015, 0),
        quat,
        color: clayColor(rand),
      });
    }
  }

  // hip caps: eave corner -> nearest ridge end, tilted out between the faces
  const hx = W / 2 + OVERHANG;
  const hz = D / 2 + OVERHANG;
  const y0 = EAVE_Y + 0.04;
  const hips: [THREE.Vector3, THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(-hx, y0, hz), new THREE.Vector3(-ROOF_RIDGE, y1, 0), normals[0].clone().add(normals[2])],
    [new THREE.Vector3(hx, y0, hz), new THREE.Vector3(ROOF_RIDGE, y1, 0), normals[0].clone().add(normals[3])],
    [new THREE.Vector3(-hx, y0, -hz), new THREE.Vector3(-ROOF_RIDGE, y1, 0), normals[1].clone().add(normals[2])],
    [new THREE.Vector3(hx, y0, -hz), new THREE.Vector3(ROOF_RIDGE, y1, 0), normals[1].clone().add(normals[3])],
  ];
  for (const [from, to, outSum] of hips) {
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    dir.normalize();
    const out = outSum.normalize();
    const side = new THREE.Vector3().crossVectors(dir, out).normalize();
    const count = Math.ceil((len - 0.1) / CAP_STEP);
    for (let i = 0; i < count; i++) {
      const pos = from
        .clone()
        .addScaledVector(dir, 0.1 + CAP_STEP * (i + 0.5))
        .addScaledVector(out, 0.01);
      if (pos.distanceTo(from) > len - 0.05) continue;
      m.makeBasis(side, dir, out);
      const quat = new THREE.Quaternion().setFromRotationMatrix(m);
      caps.push({ pos, quat, color: clayColor(rand) });
    }
  }

  return { tiles, caps };
}

function useInstanced(list: Instance[], geo: THREE.BufferGeometry, mat: THREE.Material) {
  return useMemo(() => {
    const mesh = new THREE.InstancedMesh(geo, mat, list.length);
    const m = new THREE.Matrix4();
    list.forEach((it, i) => {
      m.compose(it.pos, it.quat, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, it.color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    return mesh;
  }, [list, geo, mat]);
}

export function CoppiRoof({ wireframe = false }: { wireframe?: boolean }) {
  const { tiles, caps } = useMemo(() => buildInstances(), []);
  const baseFaces = useMemo(() => buildRoofFaces(), []);

  const tileGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(TILE_R, TILE_R * 0.86, TILE_LEN, 7, 1, true, 0, Math.PI);
    g.rotateY(-Math.PI / 2); // bulge along +Z (outward)
    return g;
  }, []);
  const capGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(CAP_R, CAP_R * 0.9, CAP_LEN, 8, 1, true, 0, Math.PI);
    g.rotateY(-Math.PI / 2);
    return g;
  }, []);
  const tileMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.82,
        metalness: 0,
        side: THREE.DoubleSide,
        wireframe,
      }),
    [wireframe],
  );

  const tileMesh = useInstanced(tiles, tileGeo, tileMat);
  const capMesh = useInstanced(caps, capGeo, tileMat);

  return (
    <group name="CoppiRoof">
      {baseFaces.map((g, i) => (
        <mesh key={i} geometry={g} receiveShadow frustumCulled={false} dispose={null}>
          <meshStandardMaterial color="#6e4530" roughness={0.95} wireframe={wireframe} />
        </mesh>
      ))}
      <primitive object={tileMesh} />
      <primitive object={capMesh} />
    </group>
  );
}
