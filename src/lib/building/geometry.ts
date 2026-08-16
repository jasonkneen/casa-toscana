import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

/** World units = meters. Front facade faces +Z. */
export const W = 10.8;
export const D = 9.4;
export const WALL_T = 0.36;
export const EAVE_Y = 13.35;
export const ROOF_H = 2.1;
export const OVERHANG = 0.46;
export const ROOF_RIDGE = 1.6;
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
  | "louver"
  | "louver-low"
  | "blind"
  | "rect-guard"
  | "lattice";

export type Opening = {
  face: Face;
  along: number;
  floor: 0 | 1 | 2 | 3;
  kind: OpeningKind;
};

const OPENINGS: Opening[] = [
  { face: "front", along: -3.18, floor: 0, kind: "lattice" },
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

  { face: "left", along: 1.35, floor: 0, kind: "barred" },
  { face: "left", along: -0.55, floor: 0, kind: "blind" },
  { face: "left", along: 1.35, floor: 1, kind: "rect-shutter" },
  { face: "left", along: 1.35, floor: 2, kind: "louver" },
  { face: "left", along: 1.35, floor: 3, kind: "rect-shutter" },
  { face: "left", along: -3.55, floor: 0, kind: "plank-arch" },

  { face: "right", along: 3.5, floor: 0, kind: "barred" },
  { face: "right", along: 1.5, floor: 0, kind: "louver-low" },
  { face: "right", along: 1.5, floor: 1, kind: "louver" },
  { face: "right", along: 1.5, floor: 2, kind: "louver" },
  { face: "right", along: 1.5, floor: 3, kind: "louver" },

  { face: "back", along: -2.9, floor: 0, kind: "louver-low" },
  { face: "back", along: 0, floor: 0, kind: "barred" },
  { face: "back", along: 2.9, floor: 0, kind: "rect-door" },
  { face: "back", along: -2.75, floor: 1, kind: "rect-guard" },
  { face: "back", along: 0, floor: 1, kind: "rect-shutter" },
  { face: "back", along: -2.75, floor: 2, kind: "rect-guard" },
  { face: "back", along: 0, floor: 2, kind: "rect-shutter" },
  { face: "back", along: 2.75, floor: 2, kind: "rect-guard" },
  { face: "back", along: -2.75, floor: 3, kind: "rect-shutter" },
  { face: "back", along: 0, floor: 3, kind: "rect-shutter" },
  { face: "back", along: 2.9, floor: 3, kind: "small" },
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
  blind?: boolean;
  guard?: boolean;
  lattice?: boolean;
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
    case "rect-guard":
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
        guard: true,
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
    case "lattice":
      return {
        w: 1.08,
        h: 1.42,
        yOff: 1.0,
        shutter: "none",
        balcony: false,
        arch: false,
        door: false,
        bars: false,
        lintel: false,
        lattice: true,
      };
    case "barred":
      return {
        w: 1.0,
        h: 1.3,
        yOff: 1.05,
        shutter: "none",
        balcony: false,
        arch: false,
        door: false,
        bars: true,
        lintel: false,
      };
    case "small":
      return {
        w: 0.92,
        h: 1.1,
        yOff: 1.15,
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
    case "louver-low":
      return {
        w: 0.95,
        h: 1.18,
        yOff: 1.12,
        shutter: "closed",
        balcony: false,
        arch: false,
        door: false,
        bars: false,
        lintel: false,
      };
    case "blind":
      return {
        w: 0.95,
        h: 1.15,
        yOff: 1.12,
        shutter: "none",
        balcony: false,
        arch: false,
        door: false,
        bars: false,
        lintel: false,
        blind: true,
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

function addKnobZ(
  batch: THREE.BufferGeometry[],
  r: number,
  len: number,
  x: number,
  y: number,
  z: number,
  ry: number,
) {
  const g = new THREE.CylinderGeometry(r, r * 0.55, len, 10);
  g.rotateX(Math.PI / 2);
  const m = new THREE.Matrix4();
  m.compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
    new THREE.Vector3(1, 1, 1),
  );
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

export const GEOM_REV = 20;

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
  // Stucco toward the street (+Z), exposed brick toward the garden (−Z),
  // wrapping the rear corners: rear half of both flanks + the right span of
  // the back wall (per the elevation sheet).
  const splitL = -0.4;
  const splitR = 0.3;

  addBox(b.stucco, W - 2 * t, h, t, 0, h / 2, hd - t / 2, 0, 0.55);

  const backClear = W - 2 * t;
  const backBrickW = 3.3;
  const bx0 = hw - t - backBrickW;
  addBox(b.brick, backBrickW, h, t, bx0 + backBrickW / 2, h / 2, -hd + t / 2, 0, 0.7);
  addBox(b.stucco, backClear - backBrickW, h, t, (-hw + t + bx0) / 2, h / 2, -hd + t / 2, 0, 0.55);

  addBox(b.stucco, t, h, hd - splitL, -hw + t / 2, h / 2, (hd + splitL) / 2, 0, 0.55);
  addBox(b.brick, t, h, splitL + hd, -hw + t / 2, h / 2, (splitL - hd) / 2, 0, 0.7);

  addBox(b.stucco, t, h, hd - splitR, hw - t / 2, h / 2, (hd + splitR) / 2, 0, 0.55);
  addBox(b.brick, t, h, splitR + hd, hw - t / 2, h / 2, (splitR - hd) / 2, 0, 0.7);

  addBox(b.stone, W - 0.2, 0.12, D - 0.2, 0, 0.04, 0, 0, 0.4);
  addBox(b.interior, W - t * 2, 0.08, D - t * 2, 0, h - 0.06, 0, 0, 0.2);
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
  // Base course, broken around the ground-floor doors.
  const baseSegs = (face: Face, len: number) => {
    const gaps = OPENINGS.filter((o) => o.face === face && o.floor === 0 && specFor(o.kind, 0).door)
      .map((o) => {
        const s = specFor(o.kind, 0);
        return { a0: o.along - s.w / 2 - 0.4, a1: o.along + s.w / 2 + 0.4 };
      })
      .sort((p, q) => p.a0 - q.a0);
    const half = len / 2;
    const out: { c: number; w: number }[] = [];
    let cur = -half;
    for (const g of gaps) {
      if (g.a0 > cur + 0.05) out.push({ c: (cur + g.a0) / 2, w: g.a0 - cur });
      cur = Math.max(cur, g.a1);
    }
    if (half - cur > 0.05) out.push({ c: (cur + half) / 2, w: half - cur });
    return out;
  };
  for (const s of baseSegs("front", W + 0.07)) {
    addBox(b.stone, s.w, 0.4, 0.09, s.c, 0.2, hd + 0.037, 0, 0.55);
  }
  for (const s of baseSegs("back", W + 0.07)) {
    addBox(b.stone, s.w, 0.4, 0.09, s.c, 0.2, -hd - 0.037, 0, 0.55);
  }
  for (const s of baseSegs("left", D + 0.07)) {
    addBox(b.stone, 0.09, 0.4, s.w, -hw - 0.037, 0.2, s.c, 0, 0.55);
  }
  for (const s of baseSegs("right", D + 0.07)) {
    addBox(b.stone, 0.09, 0.4, s.w, hw + 0.037, 0.2, s.c, 0, 0.55);
  }
  for (const y of [3.48, 6.72, 9.98]) {
    band(y, 0.11, 0.05, 0.1);
  }
  band(EAVE_Y - 0.08, 0.2, 0.14, 0.22);
  addBox(b.stone, W + 0.3, 0.08, D + 0.3, 0, EAVE_Y + 0.02, 0, 0, 0.4);
}

function addQuoins(b: Batches) {
  // Flat pietra-serena corner chains on the two street corners only —
  // continuous stacked blocks with alternating long/short faces, barely
  // proud of the stucco (the rear corners stay plain brick).
  const hw = W / 2;
  const hd = D / 2;
  const thick = 0.035;
  const lift = thick / 2 + 0.008;
  const yTop = EAVE_Y - 0.16;
  const corners: [number, number][] = [
    [-hw, 1],
    [hw, -1],
  ];
  for (const [cx, sx] of corners) {
    let y = 0.42;
    let i = 0;
    while (y < yTop) {
      const hh = Math.min(i % 2 === 0 ? 0.34 : 0.3, yTop - y);
      const ext = i % 2 === 0 ? 0.46 : 0.34;
      addBox(b.stone, ext, hh - 0.008, thick, cx + sx * (ext / 2), y + hh / 2, hd + lift, 0, 0.7);
      addBox(
        b.stone,
        thick,
        hh - 0.008,
        i % 2 === 0 ? 0.34 : 0.46,
        cx - sx * lift,
        y + hh / 2,
        hd - (i % 2 === 0 ? 0.34 : 0.46) / 2,
        0,
        0.7,
      );
      y += hh;
      i += 1;
    }
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
  // Slim stacks clustered near the ridge, tops just clear of it.
  const ridgeY = EAVE_Y + ROOF_H;
  const spots: [number, number, number][] = [
    [-2.7, 0.7, ridgeY + 0.75],
    [-0.5, -0.7, ridgeY + 0.95],
    [1.4, 0.65, ridgeY + 0.7],
    [3.2, -0.6, ridgeY + 0.85],
  ];
  for (const [x, z, top] of spots) {
    const y0 = roofHeightAt(x, z) - 0.12;
    const h = top - y0;
    addBox(b.stucco, 0.52, h, 0.44, x, y0 + h / 2, z, 0, 0.9);
    addBox(b.stone, 0.6, 0.07, 0.52, x, y0 + h + 0.04, z, 0, 0.6);
    addCyl(b.terracotta, 0.1, 0.12, 0.26, x - 0.11, y0 + h + 0.2, z, 8);
    addCyl(b.terracotta, 0.09, 0.11, 0.22, x + 0.12, y0 + h + 0.18, z + 0.02, 8);
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
  const depth = 0.3;
  const p = worldAt(face, along, ySlab, 0, depth / 2);
  addBox(b.stone, width, 0.09, depth, p.x, ySlab, p.z, p.ry, 0.7);
  const railH = 0.9;
  const yMid = ySlab + railH * 0.52;
  const bars = Math.max(7, Math.round(width / 0.13));
  for (let i = 0; i < bars; i++) {
    const lx = (i / (bars - 1) - 0.5) * (width - 0.1);
    const q = worldAt(face, along, (yMid + ySlab + railH) / 2, lx, depth - 0.05);
    addBox(b.iron, 0.022, ySlab + railH - yMid, 0.022, q.x, q.y, q.z);
  }
  // ornamental ring band below the mid rail, like the lacework in the sheet
  const yBand = (yMid + ySlab + 0.12) / 2;
  const rRing = Math.min(0.16, (yMid - ySlab - 0.12) * 0.44);
  const rings = Math.max(3, Math.floor((width - 0.3) / 0.34));
  for (let r = 0; r < rings; r++) {
    const cx = (r - (rings - 1) / 2) * ((width - 0.3) / rings);
    let prev: { x: number; y: number; z: number } | null = null;
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const pt = worldAt(face, along, yBand + Math.sin(a) * rRing, cx + Math.cos(a) * rRing, depth - 0.05);
      if (prev) addSeg(b.iron, prev.x, prev.y, prev.z, pt.x, pt.y, pt.z, 0.014, 0.014);
      prev = pt;
    }
    const stem = worldAt(face, along, yBand, cx, depth - 0.05);
    addBox(b.iron, 0.016, rRing * 2, 0.016, stem.x, stem.y, stem.z);
  }
  const top = worldAt(face, along, ySlab + railH, 0, depth - 0.05);
  addBox(b.iron, width - 0.06, 0.03, 0.03, top.x, top.y, top.z, top.ry);
  const mid = worldAt(face, along, yMid, 0, depth - 0.05);
  addBox(b.iron, width - 0.06, 0.02, 0.02, mid.x, mid.y, mid.z, mid.ry);
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

  if (spec.blind) {
    // Finestra tamponata — a walled-up window: slim stone surround around a
    // recessed stucco infill, plus the sill that never left.
    const fc = worldAt(o.face, o.along, yCenter, 0, 0.018);
    addBox(b.stucco, spec.w, spec.h, 0.03, fc.x, fc.y, fc.z, ry, 0.55);
    addBox(b.stone, 0.1, spec.h + 0.2, 0.1, ...xyz(worldAt(o.face, o.along, yCenter, -spec.w / 2 - 0.05, 0.045)), ry, 0.7);
    addBox(b.stone, 0.1, spec.h + 0.2, 0.1, ...xyz(worldAt(o.face, o.along, yCenter, spec.w / 2 + 0.05, 0.045)), ry, 0.7);
    const ft = worldAt(o.face, o.along, yBottom + spec.h + 0.05, 0, 0.045);
    addBox(b.stone, spec.w + 0.2, 0.1, 0.1, ft.x, ft.y, ft.z, ry, 0.7);
    const sillB = worldAt(o.face, o.along, yBottom - 0.03, 0, 0.07);
    addBox(b.stone, spec.w + 0.26, 0.07, 0.14, sillB.x, sillB.y, sillB.z, ry, 0.65);
    return;
  }

  const well = worldAt(o.face, o.along, yCenter, 0, -0.16);
  if (spec.arch) {
    addArchSolid(b.interior, spec.w * 0.92, spec.h * 0.94, 0.34, well.x, yBottom + 0.02, well.z, ry);
  } else {
    addBox(b.interior, spec.w * 0.92, spec.h * 0.92, 0.34, well.x, yCenter, well.z, ry);
  }

  const glass = worldAt(o.face, o.along, yCenter, 0, 0.04);
  if (!spec.door) {
    const gw = spec.w * 0.84;
    const gh = spec.h * 0.86;
    if (spec.arch) {
      addArchSolid(b.glass, spec.w * 0.85, spec.h * 0.9, 0.02, glass.x, yBottom + 0.05, glass.z, ry);
    } else {
      addBox(b.glass, gw, gh, 0.018, glass.x, yCenter + 0.01, glass.z, ry);
    }
    const t = 0.05;
    const flz = 0.07;
    addBox(b.stone, t, gh, 0.045, ...xyz(worldAt(o.face, o.along, yCenter, -gw / 2 + t / 2, flz)), ry, 1.6);
    addBox(b.stone, t, gh, 0.045, ...xyz(worldAt(o.face, o.along, yCenter, gw / 2 - t / 2, flz)), ry, 1.6);
    addBox(b.stone, gw, t, 0.045, ...xyz(worldAt(o.face, o.along, yCenter - gh / 2 + t / 2, 0, flz)), ry, 1.6);
    addBox(b.stone, gw, t, 0.045, ...xyz(worldAt(o.face, o.along, yCenter + gh / 2 - t / 2, 0, flz)), ry, 1.6);
    addBox(b.stone, 0.038, gh - t * 1.6, 0.04, ...xyz(worldAt(o.face, o.along, yCenter, 0, flz + 0.01)), ry, 1.6);
    addBox(b.stone, gw - t * 1.6, 0.038, 0.04, ...xyz(worldAt(o.face, o.along, yCenter - gh * 0.04, 0, flz + 0.01)), ry, 1.6);
  }

  if (spec.arch) {
    const frame = worldAt(o.face, o.along, yBottom, 0, 0.05);
    const bandW = spec.door ? 0.24 : 0.13;
    addArchFrame(
      b.stone,
      spec.w + bandW * 2 + 0.02,
      spec.h + bandW + 0.03,
      spec.door ? 0.16 : 0.14,
      bandW,
      frame.x,
      yBottom - 0.04,
      frame.z,
      ry,
    );
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
    const lin = worldAt(o.face, o.along, yBottom + spec.h + 0.18, 0, 0.08);
    addBox(b.stone, spec.w + 0.44, 0.1, 0.16, lin.x, lin.y, lin.z, ry, 0.6);
  }

  if (spec.door) {
    const green = o.face !== "front";
    const leafMat = green ? b.shutter : b.wood;
    if (spec.arch) {
      // Leaves rise to the springing line; the lunette above carries
      // wrought-iron scrollwork (per the door photo), not radial spokes.
      const rad = spec.w * 0.46;
      const spring = spec.h - rad - 0.06;
      const leafH = spring - 0.1;
      for (const side of [-1, 1]) {
        const cx = side * spec.w * 0.235;
        const leaf = worldAt(o.face, o.along, yBottom + 0.06 + leafH / 2, cx, 0.07);
        addBox(leafMat, spec.w * 0.45, leafH, 0.06, leaf.x, leaf.y, leaf.z, ry, 1.4);
        // two raised panels per leaf, tall over short, like the photo
        addBox(leafMat, spec.w * 0.32, leafH * 0.36, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + leafH * 0.66, cx, 0.112)), ry, 1.25);
        addBox(leafMat, spec.w * 0.32, leafH * 0.3, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + leafH * 0.26, cx, 0.112)), ry, 1.25);
        if (!green) {
          const kb = worldAt(o.face, o.along, yBottom + leafH * 0.5, cx, 0.11);
          addKnobZ(b.iron, 0.042, 0.06, kb.x, kb.y, kb.z, ry);
        }
      }
      addBox(leafMat, 0.04, leafH, 0.04, ...xyz(worldAt(o.face, o.along, yBottom + 0.06 + leafH / 2, 0, 0.1)), ry, 1.3);
      addBox(leafMat, spec.w * 0.88, 0.12, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + 0.1, 0, 0.1)), ry, 1.2);
      // transom bar at the springing line
      addBox(b.stone, spec.w + 0.06, 0.09, 0.1, ...xyz(worldAt(o.face, o.along, yBottom + spring + 0.02, 0, 0.06)), ry, 0.6);
      const cy = yBottom + spring + 0.07;
      const origin = worldAt(o.face, o.along, cy, 0, 0.055);
      addLunette(b.glass, rad, 0.018, origin.x, origin.y, origin.z, ry);
      const barZ = 0.09;
      // border ring
      for (let i = 0; i < 12; i++) {
        const a0 = Math.PI * (i / 12);
        const a1 = Math.PI * ((i + 1) / 12);
        const r = rad * 0.94;
        const p0 = worldAt(o.face, o.along, cy + Math.sin(a0) * r, Math.cos(a0) * r, barZ);
        const p1 = worldAt(o.face, o.along, cy + Math.sin(a1) * r, Math.cos(a1) * r, barZ);
        addSeg(b.iron, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.014, 0.014);
      }
      // bottom rail + short centre stem
      const bl = worldAt(o.face, o.along, cy + 0.015, 0, barZ);
      addBox(b.iron, rad * 1.86, 0.024, 0.02, bl.x, bl.y, bl.z, ry);
      const stemTop = worldAt(o.face, o.along, cy + rad * 0.5, 0, barZ);
      addSeg(b.iron, bl.x, bl.y, bl.z, stemTop.x, stemTop.y, stemTop.z, 0.014, 0.014);
      // mirrored S-scrolls
      for (const side of [-1, 1]) {
        const scx = side * rad * 0.44;
        const scy = cy + rad * 0.34;
        const r0 = rad * 0.36;
        const turns = 1.65 * Math.PI;
        const steps = 12;
        let prev: { x: number; y: number; z: number } | null = null;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const a = Math.PI * 0.5 + side * t * turns;
          const r = r0 * (1 - 0.62 * t);
          const px = scx + Math.cos(a) * r;
          const py = scy + Math.sin(a) * r * 0.9;
          const p = worldAt(o.face, o.along, py, px, barZ);
          if (prev) addSeg(b.iron, prev.x, prev.y, prev.z, p.x, p.y, p.z, 0.013, 0.013);
          prev = p;
        }
      }
    } else {
      const leaf = worldAt(o.face, o.along, yCenter + 0.02, 0, 0.05);
      addBox(leafMat, spec.w * 0.88, spec.h * 0.9, 0.07, leaf.x, leaf.y, leaf.z, ry, 1.3);
      addBox(leafMat, spec.w * 0.6, spec.h * 0.34, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + spec.h * 0.66, 0, 0.105)), ry, 1.25);
      addBox(leafMat, spec.w * 0.6, spec.h * 0.28, 0.03, ...xyz(worldAt(o.face, o.along, yBottom + spec.h * 0.28, 0, 0.105)), ry, 1.25);
    }
    if (green || !spec.arch) {
      const knob = worldAt(o.face, o.along, yBottom + spec.h * 0.48, spec.w * 0.18, 0.1);
      addKnobZ(b.iron, 0.035, 0.05, knob.x, knob.y, knob.z, ry);
    }
  }

  if (spec.lattice) {
    // Dense painted-green lattice grille, like the parlour window in the sheet.
    const cols = 5;
    const rows = 8;
    for (let i = 0; i < cols; i++) {
      const lx = (i / (cols - 1) - 0.5) * spec.w * 0.84;
      const q = worldAt(o.face, o.along, yCenter, lx, 0.1);
      addBox(b.shutter, 0.035, spec.h * 0.9, 0.025, q.x, q.y, q.z, ry, 1.4);
    }
    for (let i = 0; i < rows; i++) {
      const yy = yBottom + spec.h * ((i + 0.5) / rows);
      const q = worldAt(o.face, o.along, yy, 0, 0.1);
      addBox(b.shutter, spec.w * 0.88, 0.035, 0.025, q.x, q.y, q.z, ry, 1.4);
    }
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
      const hinge = spec.w / 2 + 0.05;
      for (const side of [-1, 1]) {
        const q = worldAt(o.face, o.along, yCenter, side * (hinge + sw / 2), 0.09);
        addBox(b.shutter, sw, sh, 0.05, q.x, q.y, q.z, ry, 1.2);
        addBox(b.shutter, sw * 0.9, 0.045, 0.055, q.x, q.y + sh * 0.4, q.z, ry, 1.3);
        addBox(b.shutter, sw * 0.9, 0.045, 0.055, q.x, q.y - sh * 0.4, q.z, ry, 1.3);
        addBox(b.shutter, sw * 0.9, 0.045, 0.055, q.x, q.y, q.z, ry, 1.3);
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
        addBox(b.shutter, sw * 0.88, 0.04, 0.055, q.x, q.y + sh * 0.38, q.z, ry, 1.3);
        addBox(b.shutter, sw * 0.88, 0.04, 0.055, q.x, q.y - sh * 0.38, q.z, ry, 1.3);
      }
    }
  }

  if (spec.guard) {
    // Facade-flush window guard: a shallow iron rail across the lower half.
    const gw = spec.w + 0.12;
    const railH = 0.85;
    const out = 0.17;
    const bars = Math.max(5, Math.round(gw / 0.15));
    for (let i = 0; i < bars; i++) {
      const lx = (i / (bars - 1) - 0.5) * gw;
      const q = worldAt(o.face, o.along, yBottom + railH / 2, lx, out);
      addBox(b.iron, 0.02, railH, 0.02, q.x, q.y, q.z);
    }
    const top = worldAt(o.face, o.along, yBottom + railH, 0, out);
    addBox(b.iron, gw + 0.04, 0.028, 0.028, top.x, top.y, top.z, top.ry);
    const bot = worldAt(o.face, o.along, yBottom + 0.06, 0, out);
    addBox(b.iron, gw + 0.04, 0.02, 0.02, bot.x, bot.y, bot.z, bot.ry);
    for (const side of [-1, 1]) {
      const arm = worldAt(o.face, o.along, yBottom + railH, side * (gw / 2), out / 2);
      addBox(b.iron, 0.02, 0.02, out, arm.x, arm.y, arm.z, arm.ry);
    }
  }

  if (spec.balcony) {
    addBalcony(b, o.face, o.along, yBottom - 0.12, spec.w + 0.55);
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
    if (spec.blind) continue;
    const yBottom = FLOOR_Y[o.floor] + spec.yOff;
    const yCenter = yBottom + spec.h / 2;
    const p = worldAt(o.face, o.along, yCenter + (spec.arch ? -0.04 : 0.01), 0, 0.055);
    ports.push({
      position: [p.x, p.y, p.z],
      rotationY: faceYaw(o.face),
      width: spec.arch ? spec.w * 0.8 : spec.w * 0.78,
      height: spec.arch ? spec.h * 0.78 : spec.h * 0.8,
      floor: o.floor,
      room: roomFor(o),
    });
  }
  return ports;
}

export type CasaGeos = Record<MatId, THREE.BufferGeometry>;

function addStreetKit(b: Batches) {
  // Brass buzzer plate beside the door jamb, like the reference photo.
  const bell = worldAt("front", 1.18, 1.52, 0, 0.05);
  addBox(b.iron, 0.14, 0.2, 0.045, bell.x, bell.y, bell.z, bell.ry);
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
