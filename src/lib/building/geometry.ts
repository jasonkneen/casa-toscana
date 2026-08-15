import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

/** World units = meters. Front facade faces +Z. */
export const W = 10.8;
export const D = 9.4;
export const WALL_T = 0.36;
export const EAVE_Y = 13.35;
export const ROOF_H = 3.2;
export const OVERHANG = 0.46;
export const ROOF_RIDGE = Math.max(0.4, (W - D) / 2 + 0.2);
export const FLOOR_Y = [0, 3.48, 6.72, 9.98, 13.35] as const;

export type Face = "front" | "back" | "left" | "right";
export type MatId =
  | "stucco"
  | "brick"
  | "stone"
  | "roof"
  | "wood"
  | "shutter"
  | "iron"
  | "glass"
  | "interior"
  | "terracotta";

export type Batches = Record<MatId, THREE.BufferGeometry[]>;

export type OpeningKind =
  | "rect-shutter"
  | "arch-balcony"
  | "rect-balcony"
  | "arch-door"
  | "rect-door"
  | "plank-arch"
  | "herringbone"
  | "carriage"
  | "barred"
  | "small"
  | "louver";

export type Opening = {
  face: Face;
  along: number;
  floor: 0 | 1 | 2 | 3;
  kind: OpeningKind;
};

const OPENINGS: Opening[] = [
  { face: "front", along: -3.18, floor: 0, kind: "barred" },
  { face: "front", along: 0, floor: 0, kind: "arch-door" },
  { face: "front", along: 3.18, floor: 0, kind: "small" },
  { face: "front", along: -3.18, floor: 1, kind: "rect-shutter" },
  { face: "front", along: 0, floor: 1, kind: "arch-balcony" },
  { face: "front", along: 3.18, floor: 1, kind: "rect-shutter" },
  { face: "front", along: -3.18, floor: 2, kind: "rect-shutter" },
  { face: "front", along: 0, floor: 2, kind: "rect-balcony" },
  { face: "front", along: 3.18, floor: 2, kind: "rect-shutter" },
  { face: "front", along: -3.18, floor: 3, kind: "rect-shutter" },
  { face: "front", along: 0, floor: 3, kind: "arch-balcony" },
  { face: "front", along: 3.18, floor: 3, kind: "rect-shutter" },

  { face: "left", along: 2.15, floor: 0, kind: "barred" },
  { face: "left", along: 2.15, floor: 1, kind: "rect-shutter" },
  { face: "left", along: 2.15, floor: 2, kind: "rect-shutter" },
  { face: "left", along: 2.15, floor: 3, kind: "rect-shutter" },
  { face: "left", along: -1.05, floor: 0, kind: "small" },
  { face: "left", along: -2.2, floor: 0, kind: "rect-door" },
  { face: "left", along: -2.2, floor: 1, kind: "rect-shutter" },
  { face: "left", along: -2.2, floor: 2, kind: "rect-balcony" },
  { face: "left", along: -2.2, floor: 3, kind: "rect-shutter" },

  { face: "right", along: 2.35, floor: 0, kind: "barred" },
  { face: "right", along: 2.35, floor: 1, kind: "rect-shutter" },
  { face: "right", along: 2.35, floor: 2, kind: "rect-shutter" },
  { face: "right", along: 2.35, floor: 3, kind: "rect-shutter" },
  { face: "right", along: -1.05, floor: 0, kind: "barred" },
  { face: "right", along: -2.35, floor: 0, kind: "barred" },
  { face: "right", along: -1.05, floor: 1, kind: "rect-shutter" },
  { face: "right", along: -2.35, floor: 1, kind: "rect-balcony" },
  { face: "right", along: -1.05, floor: 2, kind: "louver" },
  { face: "right", along: -2.35, floor: 2, kind: "rect-shutter" },
  { face: "right", along: -1.05, floor: 3, kind: "rect-shutter" },
  { face: "right", along: -2.35, floor: 3, kind: "rect-shutter" },

  { face: "back", along: -2.7, floor: 0, kind: "barred" },
  { face: "back", along: -0.15, floor: 0, kind: "small" },
  { face: "back", along: 2.55, floor: 0, kind: "rect-door" },
  { face: "back", along: -2.75, floor: 1, kind: "rect-shutter" },
  { face: "back", along: 0, floor: 1, kind: "rect-shutter" },
  { face: "back", along: 2.75, floor: 1, kind: "rect-shutter" },
  { face: "back", along: -2.75, floor: 2, kind: "rect-shutter" },
  { face: "back", along: 0, floor: 2, kind: "rect-shutter" },
  { face: "back", along: 2.75, floor: 2, kind: "rect-shutter" },
  { face: "back", along: -2.75, floor: 3, kind: "small" },
  { face: "back", along: 0, floor: 3, kind: "rect-shutter" },
  { face: "back", along: 2.75, floor: 3, kind: "rect-shutter" },
];

type Spec = {
  w: number;
  h: number;
  yOff: number;
  shutter: "open" | "closed" | "none";
  balcony: boolean;
  arch: boolean;
  door: boolean;
  bars: boolean;
  lintel: boolean;
};

function specFor(kind: OpeningKind, floor: number): Spec {
  switch (kind) {
    case "rect-shutter":
      return {
        w: 1.12,
        h: floor === 1 ? 1.92 : 1.72,
        yOff: floor === 0 ? 0.7 : 0.68,
        shutter: "open",
        balcony: false,
        arch: false,
        door: false,
        bars: false,
        lintel: floor === 1,
      };
    case "arch-balcony":
      return {
        w: 1.28,
        h: 2.32,
        yOff: 0.58,
        shutter: "none",
        balcony: true,
        arch: true,
        door: false,
        bars: false,
        lintel: true,
      };
    case "rect-balcony":
      return {
        w: 1.18,
        h: 1.82,
        yOff: 0.64,
        shutter: "none",
        balcony: true,
        arch: false,
        door: false,
        bars: false,
        lintel: true,
      };
    case "arch-door":
      return {
        w: 1.58,
        h: 2.92,
        yOff: 0.04,
        shutter: "none",
        balcony: false,
        arch: true,
        door: true,
        bars: false,
        lintel: true,
      };
    case "rect-door":
      return {
        w: 1.02,
        h: 2.28,
        yOff: 0.04,
        shutter: "none",
        balcony: false,
        arch: false,
        door: true,
        bars: false,
        lintel: true,
      };
    case "plank-arch":
      return {
        w: 1.18,
        h: 2.55,
        yOff: 0.04,
        shutter: "none",
        balcony: false,
        arch: true,
        door: true,
        bars: false,
        lintel: true,
      };
    case "herringbone":
      return {
        w: 1.72,
        h: 2.7,
        yOff: 0.04,
        shutter: "none",
        balcony: false,
        arch: true,
        door: true,
        bars: false,
        lintel: true,
      };
    case "carriage":
      return {
        w: 2.15,
        h: 2.35,
        yOff: 0.04,
        shutter: "none",
        balcony: false,
        arch: false,
        door: true,
        bars: false,
        lintel: true,
      };
    case "barred":
      return {
        w: 0.86,
        h: 0.96,
        yOff: 1.72,
        shutter: "none",
        balcony: false,
        arch: false,
        door: false,
        bars: true,
        lintel: false,
      };
    case "small":
      return {
        w: 0.78,
        h: 0.88,
        yOff: 1.7,
        shutter: "none",
        balcony: false,
        arch: false,
        door: false,
        bars: true,
        lintel: false,
      };
    case "louver":
      return {
        w: 1.12,
        h: 1.72,
        yOff: 0.68,
        shutter: "closed",
        balcony: false,
        arch: false,
        door: false,
        bars: false,
        lintel: false,
      };
  }
}

function emptyBatches(): Batches {
  return {
    stucco: [],
    brick: [],
    stone: [],
    roof: [],
    wood: [],
    shutter: [],
    iron: [],
    glass: [],
    interior: [],
    terracotta: [],
  };
}

function scaleBoxUVs(
  g: THREE.BoxGeometry,
  w: number,
  h: number,
  d: number,
  uvPerMeter: number,
) {
  const uv = g.attributes.uv as THREE.BufferAttribute;
  const sizes: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    const [fw, fh] = sizes[f];
    for (let i = 0; i < 4; i++) {
      const idx = f * 4 + i;
      uv.setXY(idx, uv.getX(idx) * fw * uvPerMeter, uv.getY(idx) * fh * uvPerMeter);
    }
  }
}

function addBox(
  batch: THREE.BufferGeometry[],
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  ry = 0,
  uvPerMeter = 1,
  rx = 0,
  rz = 0,
) {
  const g = new THREE.BoxGeometry(w, h, d);
  scaleBoxUVs(g, w, h, d, uvPerMeter);
  const m = new THREE.Matrix4();
  m.compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(1, 1, 1),
  );
  g.applyMatrix4(m);
  batch.push(g);
}

function addCyl(
  batch: THREE.BufferGeometry[],
  rTop: number,
  rBot: number,
  h: number,
  x: number,
  y: number,
  z: number,
  radial = 10,
) {
  const g = new THREE.CylinderGeometry(rTop, rBot, h, radial);
  g.translate(x, y, z);
  batch.push(g);
}

function addSeg(
  batch: THREE.BufferGeometry[],
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  thick: number,
  deep: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const dz = bz - az;
  const len = Math.hypot(dx, dy, dz) || 0.01;
  const g = new THREE.BoxGeometry(thick, len, deep);
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(dx, dy, dz).normalize(),
  );
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2), q, new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

function faceYaw(face: Face) {
  switch (face) {
    case "front":
      return 0;
    case "back":
      return Math.PI;
    case "left":
      return -Math.PI / 2;
    case "right":
      return Math.PI / 2;
  }
}

function faceOrigin(face: Face, along: number, y: number, outset: number) {
  switch (face) {
    case "front":
      return { x: along, y, z: D / 2 + outset };
    case "back":
      return { x: along, y, z: -D / 2 - outset };
    case "left":
      return { x: -W / 2 - outset, y, z: along };
    case "right":
      return { x: W / 2 + outset, y, z: along };
  }
}

function offset(ry: number, lx: number, lz: number) {
  const c = Math.cos(ry);
  const s = Math.sin(ry);
  return { x: lx * c + lz * s, z: -lx * s + lz * c };
}

function worldAt(face: Face, along: number, y: number, lx: number, lz: number) {
  const o = faceOrigin(face, along, y, 0);
  const d = offset(faceYaw(face), lx, lz);
  return { x: o.x + d.x, y, z: o.z + d.z, ry: faceYaw(face) };
}

function archShape(w: number, h: number): THREE.Shape {
  const hw = w / 2;
  const r = Math.min(hw, h * 0.45);
  const s = new THREE.Shape();
  s.moveTo(-hw, 0);
  s.lineTo(hw, 0);
  s.lineTo(hw, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  return s;
}

function archPath(w: number, h: number): THREE.Path {
  const hw = w / 2;
  const r = Math.min(hw, h * 0.45);
  const p = new THREE.Path();
  p.moveTo(-hw, 0);
  p.lineTo(hw, 0);
  p.lineTo(hw, h - r);
  p.absarc(0, h - r, r, 0, Math.PI, false);
  return p;
}

function addArchSolid(
  batch: THREE.BufferGeometry[],
  w: number,
  h: number,
  depth: number,
  x: number,
  yBottom: number,
  z: number,
  ry: number,
) {
  const shape = archShape(w, h);
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 10 });
  g.translate(0, 0, -depth / 2);
  const m = new THREE.Matrix4();
  m.compose(
    new THREE.Vector3(x, yBottom, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
    new THREE.Vector3(1, 1, 1),
  );
  g.applyMatrix4(m);
  batch.push(g);
}

function addLunette(
  batch: THREE.BufferGeometry[],
  r: number,
  depth: number,
  x: number,
  y: number,
  z: number,
  ry: number,
) {
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 20 });
  g.translate(0, 0, -depth / 2);
  const m = new THREE.Matrix4();
  m.compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
    new THREE.Vector3(1, 1, 1),
  );
  g.applyMatrix4(m);
  batch.push(g);
}

function addArchFrame(
  batch: THREE.BufferGeometry[],
  w: number,
  h: number,
  depth: number,
  thick: number,
  x: number,
  yBottom: number,
  z: number,
  ry: number,
) {
  const outer = archShape(w, h);
  outer.holes.push(archPath(w - thick * 2, h - thick));
  const g = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 10 });
  g.translate(0, 0, -depth / 2);
  const m = new THREE.Matrix4();
  m.compose(
    new THREE.Vector3(x, yBottom, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
    new THREE.Vector3(1, 1, 1),
  );
  g.applyMatrix4(m);
  batch.push(g);
}

export const GEOM_REV = 19;

export function roofHeightAt(x: number, z: number) {
  const hx = W / 2 + OVERHANG;
  const hz = D / 2 + OVERHANG;
  const nx = Math.max(0, Math.abs(x) - ROOF_RIDGE) / Math.max(0.01, hx - ROOF_RIDGE);
  const nz = Math.abs(z) / hz;
  const t = Math.min(1, Math.max(nx, nz));
  return EAVE_Y + ROOF_H * (1 - t);
}

function addWalls(b: Batches) {
  const t = WALL_T;
  const h = EAVE_Y;
  const hw = W / 2;
  const hd = D / 2;
  // Stucco toward the street (+Z), brick toward the garden (−Z).
  const split = 0.35;

  addBox(b.stucco, W - 2 * t, h, t, 0, h / 2, hd - t / 2, 0, 0.55);

  const backBrickW = W * 0.34;
  const backClear = W - 2 * t;
  const backLeft = -hw + t;
  addBox(b.brick, backBrickW, h, t, backLeft + backBrickW / 2, h / 2, -hd + t / 2, 0, 0.7);
  addBox(
    b.stucco,
    backClear - backBrickW,
    h,
    t,
    backLeft + backBrickW + (backClear - backBrickW) / 2,
    h / 2,
    -hd + t / 2,
    0,
    0.55,
  );

  addBox(b.stucco, t, h, hd - split, -hw + t / 2, h / 2, (hd + split) / 2, 0, 0.55);
  addBox(b.brick, t, h, split + hd, -hw + t / 2, h / 2, (split - hd) / 2, 0, 0.7);

  addBox(b.stucco, t, h, hd - split, hw - t / 2, h / 2, (hd + split) / 2, 0, 0.55);
  addBox(b.brick, t, h, split + hd, hw - t / 2, h / 2, (split - hd) / 2, 0, 0.7);

  addBox(b.stone, W - 0.2, 0.12, D - 0.2, 0, 0.04, 0, 0, 0.4);
  addBox(b.interior, W - t * 2, 0.08, D - t * 2, 0, h - 0.06, 0, 0, 0.2);

  const dadoH = 1.2;
  addBox(b.stone, W - 0.1, dadoH, 0.03, 0, dadoH / 2, hd + 0.012, 0, 0.45);
  addBox(b.stone, 0.03, dadoH, hd - split, -hw - 0.012, dadoH / 2, (hd + split) / 2, 0, 0.45);
  addBox(b.stone, 0.03, dadoH, hd - split, hw + 0.012, dadoH / 2, (hd + split) / 2, 0, 0.45);
}

function addPlinthAndCornices(b: Batches) {
  const hw = W / 2;
  const hd = D / 2;
  const band = (y: number, th: number, out: number, depth: number) => {
    addBox(b.stone, W + out * 2, th, depth, 0, y, hd + out * 0.5 + 0.02, 0, 0.55);
    addBox(b.stone, W + out * 2, th, depth, 0, y, -hd - out * 0.5 - 0.02, 0, 0.55);
    addBox(b.stone, depth, th, D + out * 2, -hw - out * 0.5 - 0.02, y, 0, 0, 0.55);
    addBox(b.stone, depth, th, D + out * 2, hw + out * 0.5 + 0.02, y, 0, 0, 0.55);
  };
  band(0.26, 0.52, 0.05, 0.12);
  for (const y of [3.48, 6.72, 9.98]) {
    band(y, 0.11, 0.05, 0.1);
  }
  band(EAVE_Y - 0.08, 0.2, 0.14, 0.22);
  addBox(b.stone, W + 0.3, 0.08, D + 0.3, 0, EAVE_Y + 0.02, 0, 0, 0.4);
}

function reservedBays() {
  return OPENINGS.map((o) => {
    const spec = specFor(o.kind, o.floor);
    const shutter = spec.shutter !== "none" ? spec.w * 0.52 + 0.24 : 0.18;
    const pad = spec.w / 2 + shutter;
    return {
      face: o.face,
      a0: o.along - pad,
      a1: o.along + pad,
      y0: FLOOR_Y[o.floor] + spec.yOff - 0.22,
      y1: FLOOR_Y[o.floor] + spec.yOff + spec.h + 0.38,
    };
  });
}

function bayBlocked(
  bays: ReturnType<typeof reservedBays>,
  face: Face,
  a0: number,
  a1: number,
  y0: number,
  y1: number,
) {
  const lo = Math.min(a0, a1);
  const hi = Math.max(a0, a1);
  return bays.some((b) => b.face === face && lo < b.a1 && hi > b.a0 && y0 < b.y1 && y1 > b.y0);
}

function addQuoins(b: Batches) {
  const hw = W / 2;
  const hd = D / 2;
  const thick = 0.11;
  const lift = thick / 2 + 0.012;
  const flush = lift + thick / 2;
  const step = 0.34;
  const bays = reservedBays();
  let y = 0.55;
  let i = 0;
  while (y + 0.16 < EAVE_Y - 0.15) {
    const hh = i % 2 === 0 ? 0.3 : 0.26;
    const ext = i % 2 === 0 ? 0.4 : 0.28;
    const y0 = y;
    const y1 = y + hh;
    const corners: [number, number, number, number, Face, Face][] = [
      [-hw, hd, 1, 1, "front", "left"],
      [hw, hd, -1, 1, "front", "right"],
      [-hw, -hd, 1, -1, "back", "left"],
      [hw, -hd, -1, -1, "back", "right"],
    ];
    for (const [cx, cz, sx, sz, faceA, faceB] of corners) {
      const a0 = cx;
      const a1 = cx + sx * ext;
      if (!bayBlocked(bays, faceA, a0, a1, y0, y1)) {
        addBox(b.stone, ext, hh, thick, cx + sx * (ext / 2), y + hh / 2, cz + sz * lift, 0, 0.7);
      }
      const z0 = cz - sz * ext;
      const z1 = cz + sz * flush;
      if (!bayBlocked(bays, faceB, z0, z1, y0, y1)) {
        addBox(
          b.stone,
          thick,
          hh,
          ext + flush,
          cx - sx * lift,
          y + hh / 2,
          cz - sz * ((ext - flush) / 2),
          0,
          0.7,
        );
      }
    }
    y += step;
    i += 1;
  }
}

function addRoof(b: Batches) {
  addBox(b.stucco, W - 0.05, 0.22, D - 0.05, 0, EAVE_Y - 0.1, 0, 0, 0.5);
  addBox(b.wood, W + OVERHANG * 2, 0.05, OVERHANG * 0.95, 0, EAVE_Y - 0.02, D / 2 + OVERHANG * 0.48, 0, 0.7);
  addBox(b.wood, W + OVERHANG * 2, 0.05, OVERHANG * 0.95, 0, EAVE_Y - 0.02, -D / 2 - OVERHANG * 0.48, 0, 0.7);
  addBox(b.wood, OVERHANG * 0.95, 0.05, D + OVERHANG * 2, -W / 2 - OVERHANG * 0.48, EAVE_Y - 0.02, 0, 0, 0.7);
  addBox(b.wood, OVERHANG * 0.95, 0.05, D + OVERHANG * 2, W / 2 + OVERHANG * 0.48, EAVE_Y - 0.02, 0, 0, 0.7);
}

export function buildRoofFaces(): THREE.BufferGeometry[] {
  const hx = W / 2 + OVERHANG;
  const hz = D / 2 + OVERHANG;
  const y0 = EAVE_Y + 0.04;
  const y1 = EAVE_Y + ROOF_H;
  const fl = new THREE.Vector3(-hx, y0, hz);
  const fr = new THREE.Vector3(hx, y0, hz);
  const bl = new THREE.Vector3(-hx, y0, -hz);
  const br = new THREE.Vector3(hx, y0, -hz);
  const rl = new THREE.Vector3(-ROOF_RIDGE, y1, 0);
  const rr = new THREE.Vector3(ROOF_RIDGE, y1, 0);

  const faces: THREE.Vector3[][] = [
    [fl, fr, rr, rl],
    [br, bl, rl, rr],
    [bl, fl, rl],
    [fr, br, rr],
  ];

  return faces.map((pts) => faceGeometry(pts, 0.36));
}

function faceGeometry(pts: THREE.Vector3[], uvPerMeter: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const a = pts[0];
  const uAxis = new THREE.Vector3().subVectors(pts[1], a).normalize();
  const tmp = new THREE.Vector3().subVectors(pts[pts.length - 1], a);
  const n = new THREE.Vector3().crossVectors(uAxis, tmp).normalize();
  if (n.lengthSq() < 0.01) {
    n.crossVectors(uAxis, new THREE.Vector3(0, 1, 0)).normalize();
  }
  const vAxis = new THREE.Vector3().crossVectors(n, uAxis).normalize();

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const push = (p: THREE.Vector3) => {
    positions.push(p.x, p.y, p.z);
    normals.push(n.x, n.y, n.z);
    const rel = new THREE.Vector3().subVectors(p, a);
    uvs.push(rel.dot(uAxis) * uvPerMeter, rel.dot(vAxis) * uvPerMeter);
  };

  if (pts.length === 4) {
    push(pts[0]);
    push(pts[1]);
    push(pts[2]);
    push(pts[0]);
    push(pts[2]);
    push(pts[3]);
  } else {
    push(pts[0]);
    push(pts[1]);
    push(pts[2]);
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return g;
}

function addChimneys(b: Batches) {
  const spots: [number, number, number][] = [
    [-3.7, 1.45, 1.15],
    [-0.95, 1.7, 1.05],
    [3.55, 1.35, 1.2],
    [-3.35, -1.55, 1.1],
    [0.75, -1.75, 1.05],
    [3.45, -1.4, 1.15],
  ];
  for (const [x, z, h] of spots) {
    const y0 = roofHeightAt(x, z) - 0.12;
    addBox(b.brick, 0.58, h, 0.46, x, y0 + h / 2, z, 0, 0.9);
    addBox(b.stone, 0.66, 0.07, 0.54, x, y0 + h + 0.04, z, 0, 0.6);
    addCyl(b.terracotta, 0.11, 0.13, 0.28, x - 0.12, y0 + h + 0.22, z, 8);
    addCyl(b.terracotta, 0.1, 0.12, 0.24, x + 0.13, y0 + h + 0.2, z + 0.02, 8);
  }
}

function addDownspouts(b: Batches) {
  const runs: { face: Face; along: number }[] = [
    { face: "left", along: 0.15 },
    { face: "right", along: 0.2 },
    { face: "front", along: -5.15 },
    { face: "front", along: 5.15 },
  ];
  for (const r of runs) {
    const p = worldAt(r.face, r.along, EAVE_Y / 2, 0, 0.06);
    addBox(b.iron, 0.055, EAVE_Y - 0.3, 0.055, p.x, (EAVE_Y - 0.15) / 2, p.z);
    const head = worldAt(r.face, r.along, EAVE_Y - 0.15, 0, 0.12);
    addBox(b.iron, 0.16, 0.08, 0.22, head.x, head.y, head.z, head.ry);
  }
}

function addBalcony(b: Batches, face: Face, along: number, ySlab: number, width: number) {
  const depth = 0.62;
  const p = worldAt(face, along, ySlab, 0, depth / 2);
  addBox(b.stone, width, 0.09, depth, p.x, ySlab, p.z, p.ry, 0.7);
  const railH = 0.9;
  const bars = Math.max(7, Math.round(width / 0.13));
  for (let i = 0; i < bars; i++) {
    const lx = (i / (bars - 1) - 0.5) * (width - 0.1);
    const q = worldAt(face, along, ySlab + railH / 2, lx, depth - 0.05);
    addBox(b.iron, 0.022, railH, 0.022, q.x, q.y, q.z);
  }
  const top = worldAt(face, along, ySlab + railH, 0, depth - 0.05);
  addBox(b.iron, width - 0.06, 0.03, 0.03, top.x, top.y, top.z, top.ry);
  const bot = worldAt(face, along, ySlab + 0.12, 0, depth - 0.05);
  addBox(b.iron, width - 0.06, 0.018, 0.018, bot.x, bot.y, bot.z, bot.ry);
  for (const side of [-1, 1]) {
    const postF = worldAt(face, along, ySlab + railH / 2, side * (width / 2 - 0.04), depth - 0.05);
    addBox(b.iron, 0.028, railH, 0.028, postF.x, postF.y, postF.z);
    const postB = worldAt(face, along, ySlab + railH / 2, side * (width / 2 - 0.04), 0.08);
    addBox(b.iron, 0.028, railH, 0.028, postB.x, postB.y, postB.z);
    const rail = worldAt(face, along, ySlab + railH, side * (width / 2 - 0.04), depth / 2);
    addBox(b.iron, 0.022, 0.022, depth - 0.12, rail.x, rail.y, rail.z, rail.ry);
    const railLow = worldAt(face, along, ySlab + 0.12, side * (width / 2 - 0.04), depth / 2);
    addBox(b.iron, 0.018, 0.018, depth - 0.12, railLow.x, railLow.y, railLow.z, railLow.ry);
  }
}

function xyz(p: { x: number; y: number; z: number }): [number, number, number] {
  return [p.x, p.y, p.z];
}

function addOpening(b: Batches, o: Opening) {
  const spec = specFor(o.kind, o.floor);
  const yBottom = FLOOR_Y[o.floor] + spec.yOff;
  const yCenter = yBottom + spec.h / 2;
  const ry = faceYaw(o.face);

  const well = worldAt(o.face, o.along, yCenter, 0, -0.16);
  if (spec.arch) {
    addArchSolid(b.interior, spec.w * 0.92, spec.h * 0.94, 0.34, well.x, yBottom + 0.02, well.z, ry);
  } else {
    addBox(b.interior, spec.w * 0.92, spec.h * 0.92, 0.34, well.x, yCenter, well.z, ry);
  }

  const glass = worldAt(o.face, o.along, yCenter, 0, 0.04);
  if (!spec.door) {
    const gw = spec.w * 0.7;
    const gh = spec.h * 0.76;
    if (spec.arch) {
      addArchSolid(b.glass, spec.w * 0.72, spec.h * 0.8, 0.02, glass.x, yBottom + 0.08, glass.z, ry);
    } else {
      addBox(b.glass, gw, gh, 0.018, glass.x, yCenter + 0.01, glass.z, ry);
    }
    const t = 0.05;
    const flz = 0.07;
    addBox(b.wood, t, gh, 0.045, ...xyz(worldAt(o.face, o.along, yCenter, -gw / 2 + t / 2, flz)), ry, 1.6);
    addBox(b.wood, t, gh, 0.045, ...xyz(worldAt(o.face, o.along, yCenter, gw / 2 - t / 2, flz)), ry, 1.6);
    addBox(b.wood, gw, t, 0.045, ...xyz(worldAt(o.face, o.along, yCenter - gh / 2 + t / 2, 0, flz)), ry, 1.6);
    addBox(b.wood, gw, t, 0.045, ...xyz(worldAt(o.face, o.along, yCenter + gh / 2 - t / 2, 0, flz)), ry, 1.6);
    addBox(b.wood, 0.038, gh - t * 1.6, 0.04, ...xyz(worldAt(o.face, o.along, yCenter, 0, flz + 0.01)), ry, 1.6);
    addBox(b.wood, gw - t * 1.6, 0.038, 0.04, ...xyz(worldAt(o.face, o.along, yCenter - gh * 0.04, 0, flz + 0.01)), ry, 1.6);
  }

  if (spec.arch) {
    const frame = worldAt(o.face, o.along, yBottom, 0, 0.05);
    addArchFrame(b.stone, spec.w + 0.28, spec.h + 0.16, 0.14, 0.13, frame.x, yBottom - 0.04, frame.z, ry);
  } else {
    const fw = spec.w + 0.26;
    const fh = spec.h + 0.22;
    const fc = worldAt(o.face, o.along, yCenter, 0, 0.06);
    addBox(b.stone, 0.12, fh, 0.13, ...xyz(worldAt(o.face, o.along, yCenter, -spec.w / 2 - 0.06, 0.06)), ry, 0.7);
    addBox(b.stone, 0.12, fh, 0.13, ...xyz(worldAt(o.face, o.along, yCenter, spec.w / 2 + 0.06, 0.06)), ry, 0.7);
    addBox(b.stone, fw, 0.12, 0.16, fc.x, yBottom - 0.02, fc.z, ry, 0.7);
    addBox(b.stone, fw, 0.14, 0.16, fc.x, yBottom + spec.h + 0.05, fc.z, ry, 0.7);
  }

  const sill = worldAt(o.face, o.along, yBottom - 0.04, 0, 0.13);
  addBox(b.stone, spec.w + 0.34, 0.08, 0.22, sill.x, sill.y, sill.z, ry, 0.65);

  if (spec.lintel && !spec.arch) {
    const lin = worldAt(o.face, o.along, yBottom + spec.h + 0.18, 0, 0.09);
    addBox(b.stone, spec.w + 0.5, 0.12, 0.18, lin.x, lin.y, lin.z, ry, 0.6);
    addBox(b.stone, spec.w + 0.38, 0.06, 0.14, lin.x, lin.y + 0.08, lin.z, ry, 0.6);
  }

  if (spec.door) {
    if (spec.arch) {
      const spring = spec.h * 0.55;
      const leafH = spring - 0.08;
      for (const side of [-1, 1]) {
        const cx = side * spec.w * 0.235;
        const leaf = worldAt(o.face, o.along, yBottom + 0.06 + leafH / 2, cx, 0.07);
        addBox(b.wood, spec.w * 0.45, leafH, 0.06, leaf.x, leaf.y, leaf.z, ry, 1.4);
        addBox(b.wood, spec.w * 0.3, leafH * 0.34, 0.022, ...xyz(worldAt(o.face, o.along, yBottom + leafH * 0.68, cx, 0.095)), ry, 1.25);
        addBox(b.wood, spec.w * 0.3, leafH * 0.28, 0.022, ...xyz(worldAt(o.face, o.along, yBottom + leafH * 0.28, cx, 0.095)), ry, 1.25);
      }
      addBox(b.wood, 0.04, leafH, 0.04, ...xyz(worldAt(o.face, o.along, yBottom + 0.06 + leafH / 2, 0, 0.1)), ry, 1.3);
      addBox(b.wood, spec.w * 0.88, 0.12, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + 0.1, 0, 0.1)), ry, 1.2);
      const cy = yBottom + spring;
      const rad = spec.w * 0.46;
      const origin = worldAt(o.face, o.along, cy, 0, 0.055);
      addLunette(b.glass, rad, 0.018, origin.x, origin.y, origin.z, ry);
      const barZ = 0.09;
      const hub = worldAt(o.face, o.along, cy, 0, barZ);
      for (let i = 0; i <= 11; i++) {
        const a = Math.PI * (i / 11);
        const tip = worldAt(o.face, o.along, cy + Math.sin(a) * rad, Math.cos(a) * rad, barZ);
        addSeg(b.iron, hub.x, hub.y, hub.z, tip.x, tip.y, tip.z, 0.012, 0.012);
      }
      for (let i = 0; i < 11; i++) {
        const a0 = Math.PI * (i / 11);
        const a1 = Math.PI * ((i + 1) / 11);
        const p0 = worldAt(o.face, o.along, cy + Math.sin(a0) * rad, Math.cos(a0) * rad, barZ);
        const p1 = worldAt(o.face, o.along, cy + Math.sin(a1) * rad, Math.cos(a1) * rad, barZ);
        addSeg(b.iron, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.014, 0.014);
      }
      const blocks = 6;
      const bh = spring / blocks;
      for (let i = 0; i < blocks; i++) {
        const extra = i % 2 === 0 ? 0.03 : 0;
        const yy = yBottom + i * bh;
        for (const side of [-1, 1]) {
          const q = worldAt(o.face, o.along, yy + bh / 2, side * (spec.w / 2 + (0.2 + extra) / 2), 0.09);
          addBox(b.stone, 0.2 + extra, bh - 0.012, 0.17 + extra, q.x, q.y, q.z, ry, 0.55);
        }
      }
      const vrad = spec.w / 2 + 0.1;
      const vcy = yBottom + spring;
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * ((i + 0.5) / 9);
        const span = Math.PI / 20;
        const p0 = worldAt(o.face, o.along, vcy + Math.sin(a - span) * vrad, Math.cos(a - span) * vrad, 0.1);
        const p1 = worldAt(o.face, o.along, vcy + Math.sin(a + span) * vrad, Math.cos(a + span) * vrad, 0.1);
        addSeg(b.stone, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.18, 0.16);
      }
    } else {
      const leaf = worldAt(o.face, o.along, yCenter + 0.02, 0, 0.05);
      addBox(b.wood, spec.w * 0.88, spec.h * 0.9, 0.07, leaf.x, leaf.y, leaf.z, ry, 1.3);
      for (let i = -2; i <= 2; i++) {
        const plank = worldAt(o.face, o.along, yCenter + 0.02, i * spec.w * 0.13, 0.09);
        addBox(b.wood, 0.025, spec.h * 0.84, 0.02, plank.x, plank.y, plank.z, ry, 1.2);
      }
      const mid = worldAt(o.face, o.along, yBottom + spec.h * 0.52, 0, 0.09);
      addBox(b.wood, spec.w * 0.82, 0.07, 0.03, mid.x, mid.y, mid.z, ry, 1.2);
    }
    const knob = worldAt(o.face, o.along, yBottom + spec.h * 0.48, spec.w * 0.18, 0.12);
    addCyl(b.iron, 0.035, 0.035, 0.04, knob.x, knob.y, knob.z, 8);
  }

  if (spec.bars) {
    const cols = 6;
    const rows = 5;
    for (let i = 0; i < cols; i++) {
      const lx = (i / (cols - 1) - 0.5) * spec.w * 0.78;
      const q = worldAt(o.face, o.along, yCenter, lx, 0.09);
      addBox(b.iron, 0.018, spec.h * 0.82, 0.018, q.x, q.y, q.z);
    }
    for (let i = 0; i < rows; i++) {
      const yy = yBottom + spec.h * (0.12 + i * 0.19);
      const q = worldAt(o.face, o.along, yy, 0, 0.09);
      addBox(b.iron, spec.w * 0.8, 0.016, 0.016, q.x, q.y, q.z, ry);
    }
  }

  if (spec.shutter !== "none") {
    const sw = spec.w * 0.48;
    const sh = spec.h * 0.98;
    if (spec.shutter === "open") {
      const hinge = spec.w / 2 + 0.18;
      for (const side of [-1, 1]) {
        const backing = worldAt(o.face, o.along, yCenter, side * (hinge + sw / 2), 0.03);
        addBox(b.stucco, sw + 0.1, sh + 0.12, 0.035, backing.x, backing.y, backing.z, ry, 0.5);
        const q = worldAt(o.face, o.along, yCenter, side * (hinge + sw / 2), 0.2);
        addBox(b.shutter, sw, sh, 0.05, q.x, q.y, q.z, ry, 1.2);
        addBox(b.wood, sw * 0.9, 0.045, 0.055, q.x, q.y + sh * 0.4, q.z, ry, 1.3);
        addBox(b.wood, sw * 0.9, 0.045, 0.055, q.x, q.y - sh * 0.4, q.z, ry, 1.3);
        addBox(b.wood, sw * 0.9, 0.045, 0.055, q.x, q.y, q.z, ry, 1.3);
        addBox(
          b.iron,
          0.03,
          0.03,
          0.05,
          ...xyz(worldAt(o.face, o.along, yCenter + sh * 0.28, side * (spec.w / 2 + 0.08), 0.22)),
        );
      }
    } else {
      for (const side of [-1, 1]) {
        const q = worldAt(o.face, o.along, yCenter, side * (sw / 2 + 0.015), 0.16);
        addBox(b.shutter, sw, sh, 0.05, q.x, q.y, q.z, ry, 1.2);
        addBox(b.wood, sw * 0.88, 0.04, 0.055, q.x, q.y + sh * 0.38, q.z, ry, 1.3);
        addBox(b.wood, sw * 0.88, 0.04, 0.055, q.x, q.y - sh * 0.38, q.z, ry, 1.3);
      }
    }
  }

  if (spec.balcony) {
    addBalcony(b, o.face, o.along, yBottom - 0.12, spec.w + 0.85);
  }
}

function merge(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (list.length === 0) {
    const g = new THREE.BoxGeometry(0.001, 0.001, 0.001);
    g.translate(0, -10, 0);
    return g;
  }
  const prepared = list.map((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    if (!n.getAttribute("uv")) {
      const count = n.getAttribute("position").count;
      n.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    }
    if (!n.getAttribute("normal")) n.computeVertexNormals();
    return n;
  });
  const m = BufferGeometryUtils.mergeGeometries(prepared, false);
  if (!m) {
    throw new Error("Failed to merge building geometries");
  }
  m.computeVertexNormals();
  return m;
}

export const ROOM_REV = 3;

export type RoomId =
  | "kitchen"
  | "dining"
  | "reception"
  | "living"
  | "livingB"
  | "salon"
  | "bedroomA"
  | "bedroomB"
  | "study"
  | "stair";

export type WindowPort = {
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  floor: number;
  room: RoomId;
};

/** True if this opening sits toward the street (+Z) half of a side wall. */
function towardStreet(face: Face, along: number) {
  if (face === "left" || face === "right") return along > 0.4;
  return false;
}

/** Street-front bay: left / center / right. */
function frontBay(along: number): "left" | "center" | "right" {
  if (along < -1.4) return "left";
  if (along > 1.4) return "right";
  return "center";
}

/**
 * Floor plan — rooms occupy real corners so adjacent windows share a space.
 *
 * Ground: street parlours + androne, kitchen on the garden-left (service door),
 *         dining on the garden-right (formal garden door).
 * Piano nobile: salon across the whole street front; dining behind left;
 *         sitting room behind right (balcony to the garden).
 * Second: master on the street-left (balcony), study street-right,
 *         second bedroom on the garden; bagno is the closed louver.
 * Attic: bedrooms + a quiet study; stair on the back-center landing.
 */
function roomFor(o: Opening): RoomId {
  const { face, along, floor } = o;
  const streetSide = towardStreet(face, along);
  const bay = face === "front" || face === "back" ? frontBay(along) : null;

  if (floor === 0) {
    if (face === "front") {
      if (bay === "left") return "living";
      if (bay === "right") return "livingB";
      return "reception";
    }
    if (face === "left") return streetSide ? "living" : "kitchen";
    if (face === "right") return streetSide ? "livingB" : "dining";
    if (bay === "left") return "kitchen";
    if (bay === "center") return "stair";
    return "dining";
  }

  if (floor === 1) {
    if (face === "front") return "salon";
    if (face === "left") return streetSide ? "salon" : "dining";
    if (face === "right") return streetSide ? "salon" : "living";
    if (bay === "center") return "stair";
    if (bay === "left") return "dining";
    return "living";
  }

  if (floor === 2) {
    if (face === "front") {
      if (bay === "right") return "study";
      return "bedroomA";
    }
    if (face === "left") return streetSide ? "bedroomA" : "bedroomB";
    if (face === "right") return streetSide ? "study" : "bedroomB";
    if (bay === "center") return "stair";
    return "bedroomB";
  }

  if (face === "front") {
    if (bay === "right") return "study";
    return "bedroomA";
  }
  if (face === "left") return "bedroomA";
  if (face === "right") return streetSide ? "study" : "bedroomB";
  if (bay === "center") return "stair";
  return "bedroomB";
}

export function listWindowPorts(): WindowPort[] {
  const ports: WindowPort[] = [];
  for (const o of OPENINGS) {
    const spec = specFor(o.kind, o.floor);
    if (spec.door) continue;
    if (spec.shutter === "closed") continue;
    const yBottom = FLOOR_Y[o.floor] + spec.yOff;
    const yCenter = yBottom + spec.h / 2;
    const p = worldAt(o.face, o.along, yCenter + (spec.arch ? -0.04 : 0.01), 0, 0.055);
    ports.push({
      position: [p.x, p.y, p.z],
      rotationY: faceYaw(o.face),
      width: spec.arch ? spec.w * 0.66 : spec.w * 0.64,
      height: spec.arch ? spec.h * 0.68 : spec.h * 0.7,
      floor: o.floor,
      room: roomFor(o),
    });
  }
  return ports;
}

export type CasaGeos = Record<MatId, THREE.BufferGeometry>;

function addStreetKit(b: Batches) {
  const box = worldAt("front", -1.35, 0.72, 0, 0.08);
  addBox(b.iron, 0.44, 0.56, 0.08, box.x, box.y, box.z, box.ry);
  const pipe = worldAt("front", -1.55, 2.2, 0, 0.07);
  addBox(b.iron, 0.045, 4.0, 0.045, pipe.x, pipe.y, pipe.z);
  const elbow = worldAt("front", -1.35, 0.48, 0, 0.1);
  addBox(b.iron, 0.38, 0.04, 0.04, elbow.x, elbow.y, elbow.z, elbow.ry);
  const mail = worldAt("front", 1.55, 0.74, 0, 0.2);
  addCyl(b.iron, 0.17, 0.17, 0.56, mail.x, mail.y, mail.z, 8);
  addBox(b.iron, 0.045, 0.74, 0.045, mail.x, 0.37, mail.z);
  const bell = worldAt("front", 0.95, 1.38, 0, 0.08);
  addBox(b.iron, 0.12, 0.16, 0.06, bell.x, bell.y, bell.z, bell.ry);
}

export function buildCasa(): CasaGeos {
  const b = emptyBatches();
  addWalls(b);
  addPlinthAndCornices(b);
  addQuoins(b);
  addRoof(b);
  addChimneys(b);
  addDownspouts(b);
  addStreetKit(b);
  for (const o of OPENINGS) addOpening(b, o);

  const out = {} as CasaGeos;
  (Object.keys(b) as MatId[]).forEach((k) => {
    out[k] = merge(b[k]);
  });
  return out;
}

export function disposeCasa(geos: CasaGeos) {
  for (const g of Object.values(geos)) g.dispose();
}

export const ASSET_META = {
  name: "Casa Toscana",
  units: "meters",
  width: W,
  depth: D,
  height: EAVE_Y + ROOF_H,
  floors: 4,
} as const;
