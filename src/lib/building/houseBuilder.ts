import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import type { Face, MatId, Opening, OpeningKind, RoomId, WindowPort } from "@/lib/building/geometry";

export const BUILD_REV = 24;

export type HousePlan = {
  id: string;
  name: string;
  W: number;
  D: number;
  floors: 1 | 2 | 3 | 4;
  floorY: number[];
  eaveY: number;
  roofH: number;
  overhang: number;
  wallT: number;
  brickSplit: number;
  backBrickFrac: number;
  stucco: string;
  chimneys: [number, number, number][];
  openings: Opening[];
  number?: string;
  mailbox?: boolean;
  catalog?: boolean;
};

export type HouseBuild = {
  geos: Record<MatId, THREE.BufferGeometry>;
  roof: THREE.BufferGeometry[];
  ports: WindowPort[];
};

type Batches = Record<MatId, THREE.BufferGeometry[]>;

function empty(): Batches {
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

function specFor(kind: OpeningKind, floor: number) {
  switch (kind) {
    case "rect-shutter":
      return { w: 1.08, h: floor === 1 ? 1.88 : 1.64, yOff: 0.66, shutter: "open" as const, balcony: false, arch: false, door: false, bars: false };
    case "arch-balcony":
      return { w: 1.22, h: 2.2, yOff: 0.56, shutter: "none" as const, balcony: true, arch: true, door: false, bars: false };
    case "rect-balcony":
      return { w: 1.12, h: 1.76, yOff: 0.62, shutter: "none" as const, balcony: true, arch: false, door: false, bars: false };
    case "arch-door":
      return { w: 1.52, h: 2.82, yOff: 0.02, shutter: "none" as const, balcony: false, arch: true, door: true, bars: false };
    case "plank-arch":
      return { w: 1.18, h: 2.52, yOff: 0.02, shutter: "none" as const, balcony: false, arch: true, door: true, bars: false };
    case "herringbone":
      return { w: 1.72, h: 2.68, yOff: 0.02, shutter: "none" as const, balcony: false, arch: true, door: true, bars: false };
    case "carriage":
      return { w: 2.1, h: 2.3, yOff: 0.02, shutter: "none" as const, balcony: false, arch: false, door: true, bars: false };
    case "rect-door":
      return { w: 0.98, h: 2.2, yOff: 0.02, shutter: "none" as const, balcony: false, arch: false, door: true, bars: false };
    case "barred":
      return { w: 0.82, h: 0.92, yOff: 1.68, shutter: "none" as const, balcony: false, arch: false, door: false, bars: true };
    case "small":
      return { w: 0.74, h: 0.84, yOff: 1.66, shutter: "none" as const, balcony: false, arch: false, door: false, bars: true };
    case "louver":
      return { w: 1.08, h: 1.64, yOff: 0.66, shutter: "closed" as const, balcony: false, arch: false, door: false, bars: false };
    case "louver-low":
      return { w: 0.92, h: 1.14, yOff: 1.1, shutter: "closed" as const, balcony: false, arch: false, door: false, bars: false };
    case "blind":
      return { w: 0.92, h: 1.12, yOff: 1.1, shutter: "none" as const, balcony: false, arch: false, door: false, bars: false };
    case "rect-guard":
      return { w: 1.08, h: floor === 1 ? 1.88 : 1.64, yOff: 0.66, shutter: "open" as const, balcony: false, arch: false, door: false, bars: false };
    case "lattice":
      return { w: 1.05, h: 1.38, yOff: 1.0, shutter: "none" as const, balcony: false, arch: false, door: false, bars: true };
  }
}

function yaw(face: Face) {
  return face === "front" ? 0 : face === "back" ? Math.PI : face === "left" ? -Math.PI / 2 : Math.PI / 2;
}

function worldAt(p: HousePlan, face: Face, along: number, y: number, lx: number, lz: number) {
  const ry = yaw(face);
  const c = Math.cos(ry);
  const s = Math.sin(ry);
  const ox = face === "left" ? -p.W / 2 : face === "right" ? p.W / 2 : along;
  const oz = face === "front" ? p.D / 2 : face === "back" ? -p.D / 2 : along;
  return { x: ox + lx * c + lz * s, y, z: oz + -lx * s + lz * c, ry };
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
  uv = 0.7,
) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uvAttr = g.attributes.uv as THREE.BufferAttribute;
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
      uvAttr.setXY(idx, uvAttr.getX(idx) * fw * uv, uvAttr.getY(idx) * fh * uv);
    }
  }
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

function addCyl(batch: THREE.BufferGeometry[], r0: number, r1: number, h: number, x: number, y: number, z: number) {
  const g = new THREE.CylinderGeometry(r0, r1, h, 10);
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
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2), q, new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

function archSolid(batch: THREE.BufferGeometry[], w: number, h: number, d: number, x: number, y: number, z: number, ry: number) {
  const hw = w / 2;
  const r = Math.min(hw, h * 0.44);
  const s = new THREE.Shape();
  s.moveTo(-hw, 0);
  s.lineTo(hw, 0);
  s.lineTo(hw, h - r);
  s.absarc(0, h - r, r, 0, Math.PI, false);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 18 });
  g.translate(0, 0, -d / 2);
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

function archFrame(batch: THREE.BufferGeometry[], w: number, h: number, d: number, thick: number, x: number, y: number, z: number, ry: number) {
  const hw = w / 2;
  const r = Math.min(hw, h * 0.44);
  const outer = new THREE.Shape();
  outer.moveTo(-hw, 0);
  outer.lineTo(hw, 0);
  outer.lineTo(hw, h - r);
  outer.absarc(0, h - r, r, 0, Math.PI, false);
  const ih = Math.max(0.08, hw - thick);
  const ir = Math.min(ih, (h - thick) * 0.44);
  const hole = new THREE.Path();
  hole.moveTo(-ih, 0.01);
  hole.lineTo(ih, 0.01);
  hole.lineTo(ih, h - thick - ir);
  hole.absarc(0, h - thick - ir, ir, 0, Math.PI, false);
  outer.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(outer, { depth: d, bevelEnabled: false, curveSegments: 18 });
  g.translate(0, 0, -d / 2);
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

function addLunette(batch: THREE.BufferGeometry[], r: number, d: number, x: number, y: number, z: number, ry: number) {
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 20 });
  g.translate(0, 0, -d / 2);
  const m = new THREE.Matrix4();
  m.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)), new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  batch.push(g);
}

const SPRING = 0.55;

function archTopAt(lx: number, w: number, h: number, yBottom: number) {
  const spring = h * SPRING;
  const r = w * 0.5;
  if (Math.abs(lx) >= r - 0.002) return yBottom + spring;
  return yBottom + spring + Math.sqrt(Math.max(0, r * r - lx * lx));
}

type At = (y: number, lx: number, lz: number) => { x: number; y: number; z: number; ry: number };

function addThreshold(b: Batches, at: At, yBottom: number, w: number, ry: number) {
  const q = at(yBottom - 0.03, 0, 0.16);
  addBox(b.stone, w + 0.46, 0.08, 0.32, q.x, q.y, q.z, ry, 0.6);
}

function frontDoorGaps(p: HousePlan) {
  return p.openings
    .filter((o) => o.face === "front" && o.floor === 0 && specFor(o.kind, 0).door)
    .map((o) => {
      const s = specFor(o.kind, 0);
      return { a0: o.along - s.w / 2 - 0.24, a1: o.along + s.w / 2 + 0.24 };
    })
    .sort((a, b) => a.a0 - b.a0);
}

function slabsAround(gaps: { a0: number; a1: number }[], left: number, right: number) {
  const out: { x0: number; x1: number }[] = [];
  let cursor = left;
  for (const g of gaps) {
    if (g.a0 > cursor + 0.06) out.push({ x0: cursor, x1: g.a0 });
    cursor = Math.max(cursor, g.a1);
  }
  if (right - cursor > 0.06) out.push({ x0: cursor, x1: right });
  return out;
}

function addDadoAndKit(b: Batches, p: HousePlan) {
  // Low stone base course broken around the doors — the tall ashlar dado
  // read as false against the elevation sheet.
  const h = 0.38;
  const t = 0.05;
  const hw = p.W / 2;
  const hd = p.D / 2;
  const gaps = frontDoorGaps(p);
  for (const s of slabsAround(gaps, -hw + 0.04, hw - 0.04)) {
    addBox(b.stone, s.x1 - s.x0, h, t, (s.x0 + s.x1) / 2, h / 2, hd + 0.012, 0, 0.5);
  }
  const streetLen = Math.max(0.2, hd - p.brickSplit);
  addBox(b.stone, t, h, streetLen, -hw - 0.01, h / 2, (hd + p.brickSplit) / 2, 0, 0.5);
  addBox(b.stone, t, h, streetLen, hw + 0.01, h / 2, (hd + p.brickSplit) / 2, 0, 0.5);
  if (p.catalog) return;
  const door = p.openings.find((o) => o.face === "front" && o.floor === 0 && specFor(o.kind, 0).door);
  const along = door?.along ?? 0;
  if (p.mailbox) {
    const m = worldAt(p, "front", along + 1.35, 0.72, 0, 0.18);
    addCyl(b.iron, 0.16, 0.16, 0.55, m.x, m.y, m.z);
    addBox(b.iron, 0.04, 0.72, 0.04, m.x, 0.36, m.z);
    addCyl(b.iron, 0.02, 0.18, 0.08, m.x, m.y + 0.32, m.z);
  }
  const bell = worldAt(p, "front", along + (door ? specFor(door.kind, 0).w / 2 + 0.22 : 0.9), 1.35, 0, 0.08);
  addBox(b.iron, 0.12, 0.16, 0.06, bell.x, bell.y, bell.z, bell.ry);
}

function addWalls(b: Batches, p: HousePlan) {
  const t = p.wallT;
  const h = p.eaveY;
  const hw = p.W / 2;
  const hd = p.D / 2;
  const split = p.brickSplit;
  addBox(b.stucco, Math.max(0.2, p.W - 2 * t), h, t, 0, h / 2, hd - t / 2, 0, 0.55);
  const bw = Math.max(0.05, p.W * p.backBrickFrac);
  const clear = Math.max(0.2, p.W - 2 * t);
  const left = -hw + t;
  addBox(b.brick, Math.min(bw, clear), h, t, left + Math.min(bw, clear) / 2, h / 2, -hd + t / 2, 0, 0.7);
  const rest = clear - Math.min(bw, clear);
  if (rest > 0.05) addBox(b.stucco, rest, h, t, left + Math.min(bw, clear) + rest / 2, h / 2, -hd + t / 2, 0, 0.55);
  const streetD = Math.max(0.15, hd - split);
  const brickD = Math.max(0.15, split + hd);
  addBox(b.stucco, t, h, streetD, -hw + t / 2, h / 2, (hd + split) / 2, 0, 0.55);
  addBox(b.brick, t, h, brickD, -hw + t / 2, h / 2, (split - hd) / 2, 0, 0.7);
  addBox(b.stucco, t, h, streetD, hw - t / 2, h / 2, (hd + split) / 2, 0, 0.55);
  addBox(b.brick, t, h, brickD, hw - t / 2, h / 2, (split - hd) / 2, 0, 0.7);
  addBox(b.stone, p.W - 0.16, 0.12, p.D - 0.16, 0, 0.04, 0, 0, 0.4);
}

function addBands(b: Batches, p: HousePlan) {
  const hw = p.W / 2;
  const hd = p.D / 2;
  const gaps = frontDoorGaps(p);
  const wrap = (y: number, th: number, out: number, depth: number) => {
    for (const s of slabsAround(gaps, -hw - out, hw + out)) {
      addBox(b.stone, s.x1 - s.x0, th, depth, (s.x0 + s.x1) / 2, y, hd + out * 0.5 + 0.02, 0, 0.55);
    }
    addBox(b.stone, p.W + out * 2, th, depth, 0, y, -hd - out * 0.5 - 0.02, 0, 0.55);
    addBox(b.stone, depth, th, p.D + out * 2, -hw - out * 0.5 - 0.02, y, 0, 0, 0.55);
    addBox(b.stone, depth, th, p.D + out * 2, hw + out * 0.5 + 0.02, y, 0, 0, 0.55);
  };
  wrap(0.26, 0.48, 0.05, 0.12);
  for (let i = 1; i < p.floors; i++) wrap(p.floorY[i], 0.1, 0.05, 0.1);
  wrap(p.eaveY - 0.08, 0.16, 0.1, 0.18);
}

function addQuoins(b: Batches, p: HousePlan) {
  // Flat continuous pietra-serena corner chains on the two street corners
  // only — same treatment the hero earned from the elevation sheet.
  const hw = p.W / 2;
  const hd = p.D / 2;
  const thick = 0.035;
  const lift = thick / 2 + 0.008;
  const yTop = p.eaveY - 0.16;
  const corners: [number, number][] = [
    [-hw, 1],
    [hw, -1],
  ];
  for (const [cx, sx] of corners) {
    let y = 0.42;
    let i = 0;
    while (y < yTop) {
      const hh = Math.min(i % 2 === 0 ? 0.34 : 0.3, yTop - y);
      const ext = i % 2 === 0 ? 0.44 : 0.32;
      addBox(b.stone, ext, hh - 0.008, thick, cx + sx * (ext / 2), y + hh / 2, hd + lift, 0, 0.7);
      addBox(
        b.stone,
        thick,
        hh - 0.008,
        i % 2 === 0 ? 0.32 : 0.44,
        cx - sx * lift,
        y + hh / 2,
        hd - (i % 2 === 0 ? 0.32 : 0.44) / 2,
        0,
        0.7,
      );
      y += hh;
      i += 1;
    }
  }
}

function addWalnutLeaves(b: Batches, at: At, yBottom: number, w: number, h: number, ry: number) {
  const spring = h * SPRING;
  const leafH = spring - 0.08;
  for (const side of [-1, 1] as const) {
    const cx = side * w * 0.235;
    const leaf = at(yBottom + 0.06 + leafH / 2, cx, 0.07);
    addBox(b.wood, w * 0.45, leafH, 0.06, leaf.x, leaf.y, leaf.z, ry, 1.4);
    addBox(b.wood, w * 0.3, leafH * 0.34, 0.022, at(yBottom + leafH * 0.68, cx, 0.095).x, at(yBottom + leafH * 0.68, cx, 0.095).y, at(yBottom + leafH * 0.68, cx, 0.095).z, ry, 1.25);
    addBox(b.wood, w * 0.3, leafH * 0.28, 0.022, at(yBottom + leafH * 0.28, cx, 0.095).x, at(yBottom + leafH * 0.28, cx, 0.095).y, at(yBottom + leafH * 0.28, cx, 0.095).z, ry, 1.25);
    const knob = at(yBottom + leafH * 0.52, side * w * 0.08, 0.13);
    addCyl(b.iron, 0.028, 0.028, 0.032, knob.x, knob.y, knob.z);
  }
  const stile = at(yBottom + 0.06 + leafH / 2, 0, 0.1);
  addBox(b.wood, 0.04, leafH, 0.04, stile.x, stile.y, stile.z, ry, 1.3);
  addBox(b.wood, w * 0.88, 0.12, 0.03, at(yBottom + 0.1, 0, 0.1).x, at(yBottom + 0.1, 0, 0.1).y, at(yBottom + 0.1, 0, 0.1).z, ry, 1.2);
  const cy = yBottom + spring;
  const rad = w * 0.46;
  const origin = at(cy, 0, 0.055);
  addLunette(b.glass, rad, 0.018, origin.x, origin.y, origin.z, ry);
  addLunette(b.interior, rad, 0.2, at(cy, 0, -0.12).x, cy, at(cy, 0, -0.12).z, ry);
  const barZ = 0.09;
  const hub = at(cy, 0, barZ);
  for (let i = 0; i <= 11; i++) {
    const a = Math.PI * (i / 11);
    const tip = at(cy + Math.sin(a) * rad, Math.cos(a) * rad, barZ);
    addSeg(b.iron, hub.x, hub.y, hub.z, tip.x, tip.y, tip.z, 0.012, 0.012);
  }
  for (let i = 0; i < 11; i++) {
    const a0 = Math.PI * (i / 11);
    const a1 = Math.PI * ((i + 1) / 11);
    const p0 = at(cy + Math.sin(a0) * rad, Math.cos(a0) * rad, barZ);
    const p1 = at(cy + Math.sin(a1) * rad, Math.cos(a1) * rad, barZ);
    addSeg(b.iron, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.014, 0.014);
  }
}

function addPlankArch(b: Batches, at: At, yBottom: number, w: number, h: number, ry: number) {
  const mat = b.shutter;
  const back = at(yBottom + 0.01, 0, 0.05);
  archSolid(mat, w * 0.97, h * 0.985, 0.05, back.x, yBottom + 0.015, back.z, ry);
  const n = 8;
  for (let i = 0; i < n; i++) {
    const lx = ((i + 0.5) / n - 0.5) * w * 0.9;
    const top = archTopAt(lx, w * 0.96, h, yBottom) - 0.03;
    const y0 = yBottom + 0.04;
    const hh = Math.max(0.2, top - y0);
    const q = at(y0 + hh / 2, lx, 0.085);
    addBox(mat, (w * 0.9) / n - 0.01, hh, 0.034, q.x, q.y, q.z, ry, 1.05);
  }
  const stile = at(yBottom + h * 0.46, 0, 0.1);
  addBox(mat, 0.045, h * 0.9, 0.04, stile.x, stile.y, stile.z, ry, 1.05);
  for (const t of [0.2, 0.46]) {
    const q = at(yBottom + h * t, 0, 0.1);
    addBox(mat, w * 0.88, 0.05, 0.03, q.x, q.y, q.z, ry, 1.08);
  }
  const ring = at(yBottom + h * 0.4, w * 0.14, 0.13);
  addCyl(b.iron, 0.032, 0.032, 0.02, ring.x, ring.y, ring.z);
}

function addHerringbone(b: Batches, at: At, yBottom: number, w: number, h: number, ry: number) {
  const mat = b.shutter;
  const back = at(yBottom + 0.01, 0, 0.05);
  archSolid(mat, w * 0.97, h * 0.985, 0.05, back.x, yBottom + 0.015, back.z, ry);
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < 26; i++) {
      const yA = yBottom + 0.12 + i * 0.095;
      const xA = side * (w * 0.44);
      const top = archTopAt(xA, w * 0.96, h, yBottom);
      if (yA > top - 0.04) continue;
      const yB = yA - 0.2;
      if (yB < yBottom + 0.05) continue;
      const p0 = at(Math.min(yA, top - 0.03), xA, 0.09);
      const p1 = at(yB, side * 0.025, 0.09);
      addSeg(mat, p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, 0.085, 0.038);
    }
  }
  const stile = at(yBottom + h * 0.46, 0, 0.105);
  addBox(mat, 0.05, h * 0.9, 0.042, stile.x, stile.y, stile.z, ry, 1.05);
  addBox(mat, w * 0.9, 0.09, 0.04, at(yBottom + 0.1, 0, 0.1).x, at(yBottom + 0.1, 0, 0.1).y, at(yBottom + 0.1, 0, 0.1).z, ry, 1.05);
  const ring = at(yBottom + h * 0.4, w * 0.12, 0.13);
  addCyl(b.iron, 0.03, 0.03, 0.02, ring.x, ring.y, ring.z);
}

function addCarriage(b: Batches, at: At, yBottom: number, w: number, h: number, yCenter: number, ry: number) {
  const mat = b.shutter;
  addBox(mat, w * 0.94, h * 0.94, 0.05, at(yCenter, 0, 0.05).x, yCenter, at(yCenter, 0, 0.05).z, ry, 1.05);
  for (let i = 0; i < 7; i++) {
    const lx = ((i + 0.5) / 7 - 0.5) * w * 0.88;
    const q = at(yCenter + 0.02, lx, 0.08);
    addBox(mat, 0.12, h * 0.9, 0.035, q.x, q.y, q.z, ry, 1.05);
  }
  for (const t of [0.14, 0.5, 0.84]) {
    const q = at(yBottom + h * t, 0, 0.1);
    addBox(mat, w * 0.9, 0.055, 0.03, q.x, q.y, q.z, ry, 1.08);
  }
  addCyl(b.iron, 0.03, 0.03, 0.025, at(yBottom + h * 0.48, w * 0.16, 0.13).x, at(yBottom + h * 0.48, w * 0.16, 0.13).y, at(yBottom + h * 0.48, w * 0.16, 0.13).z);
}

function addServiceDoor(b: Batches, at: At, yBottom: number, w: number, h: number, yCenter: number, ry: number) {
  addBox(b.wood, w * 0.9, h * 0.92, 0.055, at(yCenter, 0, 0.06).x, yCenter, at(yCenter, 0, 0.06).z, ry, 1.3);
  for (let i = 0; i < 5; i++) {
    const lx = ((i + 0.5) / 5 - 0.5) * w * 0.72;
    const q = at(yCenter + 0.02, lx, 0.085);
    addBox(b.wood, 0.11, h * 0.86, 0.03, q.x, q.y, q.z, ry, 1.25);
  }
  addBox(b.wood, w * 0.82, 0.06, 0.03, at(yBottom + h * 0.52, 0, 0.1).x, at(yBottom + h * 0.52, 0, 0.1).y, at(yBottom + h * 0.52, 0, 0.1).z, ry, 1.2);
  addBox(b.wood, w * 0.82, 0.16, 0.03, at(yBottom + 0.14, 0, 0.1).x, at(yBottom + 0.14, 0, 0.1).y, at(yBottom + 0.14, 0, 0.1).z, ry, 1.2);
  addCyl(b.iron, 0.028, 0.028, 0.03, at(yBottom + h * 0.48, w * 0.18, 0.12).x, at(yBottom + h * 0.48, w * 0.18, 0.12).y, at(yBottom + h * 0.48, w * 0.18, 0.12).z);
}

function addOpening(b: Batches, p: HousePlan, o: Opening) {
  const s = specFor(o.kind, o.floor);
  const yBottom = p.floorY[o.floor] + s.yOff;
  const yCenter = yBottom + s.h / 2;
  const ry = yaw(o.face);
  const at: At = (y, lx, lz) => worldAt(p, o.face, o.along, y, lx, lz);

  if (!s.door) {
    const well = at(yCenter, 0, -0.16);
    if (s.arch) archSolid(b.interior, s.w * 0.92, s.h * 0.94, 0.34, well.x, yBottom + 0.02, well.z, ry);
    else addBox(b.interior, s.w * 0.92, s.h * 0.92, 0.34, well.x, yCenter, well.z, ry);
    const glass = at(yCenter, 0, 0.04);
    const gw = s.w * 0.84;
    const gh = s.h * 0.86;
    if (s.arch) archSolid(b.glass, s.w * 0.85, s.h * 0.9, 0.02, glass.x, yBottom + 0.05, glass.z, ry);
    else addBox(b.glass, gw, gh, 0.018, glass.x, yCenter + 0.01, glass.z, ry);
    const t = 0.05;
    addBox(b.stone, t, gh, 0.045, at(yCenter, -gw / 2 + t / 2, 0.07).x, yCenter, at(yCenter, -gw / 2 + t / 2, 0.07).z, ry, 1.6);
    addBox(b.stone, t, gh, 0.045, at(yCenter, gw / 2 - t / 2, 0.07).x, yCenter, at(yCenter, gw / 2 - t / 2, 0.07).z, ry, 1.6);
    addBox(b.stone, gw, t, 0.045, glass.x, yCenter - gh / 2 + t / 2, glass.z, ry, 1.6);
    addBox(b.stone, gw, t, 0.045, glass.x, yCenter + gh / 2 - t / 2, glass.z, ry, 1.6);
    addBox(b.stone, 0.038, gh - t * 1.6, 0.04, glass.x, yCenter, at(yCenter, 0, 0.08).z, ry, 1.6);
    addBox(b.stone, gw - t * 1.6, 0.038, 0.04, glass.x, yCenter, at(yCenter, 0, 0.08).z, ry, 1.6);
  }

  if (s.arch && s.door) {
    {
      // Smooth pietra-serena band, per the hero door photo — the voussoir
      // ring read as overdone against the references.
      const q = at(yBottom - 0.02, 0, 0.07);
      const band = o.kind === "herringbone" ? 0.14 : 0.22;
      archFrame(b.stone, s.w + band * 2 + 0.02, s.h + band + 0.03, 0.16, band, q.x, yBottom - 0.03, q.z, ry);
    }
    addThreshold(b, at, yBottom, s.w, ry);
    if (o.kind === "arch-door") addWalnutLeaves(b, at, yBottom, s.w, s.h, ry);
    else if (o.kind === "plank-arch") addPlankArch(b, at, yBottom, s.w, s.h, ry);
    else addHerringbone(b, at, yBottom, s.w, s.h, ry);
  } else if (!s.arch) {
    const fw = s.w + 0.26;
    const fh = s.h + 0.22;
    addBox(b.stone, 0.13, fh, 0.15, at(yCenter, -s.w / 2 - 0.065, 0.07).x, yCenter, at(yCenter, -s.w / 2 - 0.065, 0.07).z, ry, 0.7);
    addBox(b.stone, 0.13, fh, 0.15, at(yCenter, s.w / 2 + 0.065, 0.07).x, yCenter, at(yCenter, s.w / 2 + 0.065, 0.07).z, ry, 0.7);
    addBox(b.stone, fw, 0.1, 0.17, at(yBottom - 0.02, 0, 0.07).x, yBottom - 0.02, at(yBottom - 0.02, 0, 0.07).z, ry, 0.7);
    addBox(b.stone, fw, 0.13, 0.17, at(yBottom + s.h + 0.05, 0, 0.07).x, yBottom + s.h + 0.05, at(yBottom + s.h + 0.05, 0, 0.07).z, ry, 0.7);
    addThreshold(b, at, yBottom, s.w, ry);
    if (o.kind === "carriage") addCarriage(b, at, yBottom, s.w, s.h, yCenter, ry);
    else if (o.kind === "rect-door") addServiceDoor(b, at, yBottom, s.w, s.h, yCenter, ry);
  } else {
    const q = at(yBottom - 0.02, 0, 0.06);
    archFrame(b.stone, s.w + 0.3, s.h + 0.16, 0.14, 0.13, q.x, yBottom - 0.03, q.z, ry);
    addThreshold(b, at, yBottom, s.w, ry);
  }

  if (s.bars) {
    const cols = 6;
    const rows = 5;
    for (let i = 0; i < cols; i++) {
      const q = at(yCenter, (i / (cols - 1) - 0.5) * s.w * 0.78, 0.09);
      addBox(b.iron, 0.018, s.h * 0.82, 0.018, q.x, q.y, q.z);
    }
    for (let i = 0; i < rows; i++) {
      const q = at(yBottom + s.h * (0.12 + i * 0.19), 0, 0.09);
      addBox(b.iron, s.w * 0.8, 0.016, 0.016, q.x, q.y, q.z, ry);
    }
  }
  if (s.shutter !== "none") {
    const sw = s.w * 0.48;
    const sh = s.h * 0.98;
    if (s.shutter === "open") {
      const hinge = s.w / 2 + 0.05;
      for (const side of [-1, 1]) {
        const q = at(yCenter, side * (hinge + sw / 2), 0.09);
        addBox(b.shutter, sw, sh, 0.05, q.x, q.y, q.z, ry, 1.2);
      }
    } else {
      for (const side of [-1, 1]) {
        const q = at(yCenter, side * (sw / 2 + 0.015), 0.16);
        addBox(b.shutter, sw, sh, 0.05, q.x, q.y, q.z, ry, 1.2);
      }
    }
  }
  if (s.balcony) {
    const depth = 0.58;
    const slab = at(yBottom - 0.12, 0, depth / 2);
    addBox(b.stone, s.w + 0.8, 0.09, depth, slab.x, yBottom - 0.12, slab.z, ry, 0.7);
    const railH = 0.9;
    for (let i = 0; i < 8; i++) {
      const lx = (i / 7 - 0.5) * (s.w + 0.7);
      const q = at(yBottom - 0.12 + railH / 2, lx, depth - 0.05);
      addBox(b.iron, 0.022, railH, 0.022, q.x, q.y, q.z);
    }
    const top = at(yBottom - 0.12 + railH, 0, depth - 0.05);
    addBox(b.iron, s.w + 0.72, 0.03, 0.03, top.x, top.y, top.z, ry);
    const bot = at(yBottom, 0, depth - 0.05);
    addBox(b.iron, s.w + 0.72, 0.018, 0.018, bot.x, bot.y, bot.z, ry);
    for (const side of [-1, 1]) {
      const post = at(yBottom - 0.12 + railH / 2, side * (s.w / 2 + 0.36), depth - 0.05);
      addBox(b.iron, 0.028, railH, 0.028, post.x, post.y, post.z);
      const sideR = at(yBottom - 0.12 + railH, side * (s.w / 2 + 0.36), depth / 2);
      addBox(b.iron, 0.022, 0.022, depth - 0.12, sideR.x, sideR.y, sideR.z, ry);
    }
  }
}

function roofHeightAt(p: HousePlan, x: number, z: number) {
  const hz = p.D / 2 + p.overhang;
  const y0 = p.eaveY + 0.04;
  const y1 = p.eaveY + p.roofH;
  const tz = Math.min(1, Math.abs(z) / Math.max(0.2, hz));
  return y0 + (y1 - y0) * (1 - tz);
}

function addRoofBits(b: Batches, p: HousePlan) {
  const oh = p.overhang;
  addBox(b.stucco, p.W - 0.05, 0.2, p.D - 0.05, 0, p.eaveY - 0.1, 0, 0, 0.5);
  addBox(b.wood, p.W + oh * 2, 0.05, oh * 0.95, 0, p.eaveY - 0.02, p.D / 2 + oh * 0.48, 0, 0.7);
  addBox(b.wood, p.W + oh * 2, 0.05, oh * 0.95, 0, p.eaveY - 0.02, -p.D / 2 - oh * 0.48, 0, 0.7);
  addBox(b.wood, oh * 0.95, 0.05, p.D + oh * 2, -p.W / 2 - oh * 0.48, p.eaveY - 0.02, 0, 0, 0.7);
  addBox(b.wood, oh * 0.95, 0.05, p.D + oh * 2, p.W / 2 + oh * 0.48, p.eaveY - 0.02, 0, 0, 0.7);
  // Stacks pulled toward the ridge, pale stucco bodies, tops just past it.
  const ridgeY = p.eaveY + p.roofH;
  for (const [x, z, h] of p.chimneys) {
    const zr = Math.sign(z) * Math.min(Math.abs(z) * 0.35, 0.8);
    const y0 = roofHeightAt(p, x, zr) - 0.1;
    const top = ridgeY + 0.5 + Math.min(0.45, h * 0.25);
    const hh = top - y0;
    addBox(b.stucco, 0.5, hh, 0.42, x, y0 + hh / 2, zr, 0, 0.9);
    addBox(b.stone, 0.58, 0.07, 0.5, x, y0 + hh + 0.04, zr, 0, 0.6);
    addCyl(b.terracotta, 0.1, 0.12, 0.26, x - 0.11, y0 + hh + 0.2, zr);
    addCyl(b.terracotta, 0.09, 0.11, 0.22, x + 0.12, y0 + hh + 0.18, zr + 0.02);
  }
  for (const side of [-1, 1]) {
    addBox(b.iron, 0.05, p.eaveY - 0.3, 0.05, side * (p.W / 2 + 0.04), (p.eaveY - 0.15) / 2, p.D / 2 - 0.2);
  }
}

function buildRoofFaces(p: HousePlan): THREE.BufferGeometry[] {
  const hx = p.W / 2 + p.overhang;
  const hz = p.D / 2 + p.overhang;
  const y0 = p.eaveY + 0.04;
  const y1 = p.eaveY + p.roofH;
  const ridge = Math.max(0.35, (p.W - p.D) / 2 + 0.15);
  const fl = new THREE.Vector3(-hx, y0, hz);
  const fr = new THREE.Vector3(hx, y0, hz);
  const bl = new THREE.Vector3(-hx, y0, -hz);
  const br = new THREE.Vector3(hx, y0, -hz);
  const rl = new THREE.Vector3(-ridge, y1, 0);
  const rr = new THREE.Vector3(ridge, y1, 0);
  const faces: THREE.Vector3[][] = [
    [fl, fr, rr, rl],
    [br, bl, rl, rr],
    [bl, fl, rl],
    [fr, br, rr],
  ];
  return faces.map((pts) => {
    const g = new THREE.BufferGeometry();
    const a = pts[0];
    const uAxis = new THREE.Vector3().subVectors(pts[1], a).normalize();
    const tmp = new THREE.Vector3().subVectors(pts[pts.length - 1], a);
    const n = new THREE.Vector3().crossVectors(uAxis, tmp).normalize();
    const vAxis = new THREE.Vector3().crossVectors(n, uAxis).normalize();
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const push = (q: THREE.Vector3) => {
      pos.push(q.x, q.y, q.z);
      nor.push(n.x, n.y, n.z);
      const rel = new THREE.Vector3().subVectors(q, a);
      uv.push(rel.dot(uAxis) * 0.36, rel.dot(vAxis) * 0.36);
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
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    return g;
  });
}

function roomFor(o: Opening): RoomId {
  const street = (o.face === "left" || o.face === "right") && o.along > 0.3;
  const bay = o.face === "front" || o.face === "back" ? (o.along < -1.2 ? "left" : o.along > 1.2 ? "right" : "center") : null;
  if (o.floor === 0) {
    if (o.face === "front") return bay === "left" ? "living" : bay === "right" ? "livingB" : "reception";
    if (o.face === "left") return street ? "living" : "kitchen";
    if (o.face === "right") return street ? "livingB" : "dining";
    if (bay === "center") return "stair";
    return bay === "left" ? "kitchen" : "dining";
  }
  if (o.floor === 1) {
    if (o.face === "front" || street) return "salon";
    if (bay === "center") return "stair";
    return o.face === "left" || bay === "left" ? "dining" : "living";
  }
  if (o.floor === 2) {
    if (bay === "center" && o.face === "back") return "stair";
    if (o.face === "front") return bay === "right" ? "study" : "bedroomA";
    return o.face === "left" || bay === "left" ? "bedroomA" : "bedroomB";
  }
  if (bay === "center" && o.face === "back") return "stair";
  return o.face === "left" || bay === "left" ? "bedroomB" : "study";
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
  if (!m) throw new Error("Failed to merge house geometries");
  m.computeVertexNormals();
  return m;
}

export function buildHouse(p: HousePlan): HouseBuild {
  const b = empty();
  addWalls(b, p);
  addDadoAndKit(b, p);
  addBands(b, p);
  addQuoins(b, p);
  if (!p.catalog || p.roofH > 0) addRoofBits(b, p);
  for (const o of p.openings) addOpening(b, p, o);
  const geos = {} as Record<MatId, THREE.BufferGeometry>;
  (Object.keys(b) as MatId[]).forEach((k) => {
    geos[k] = merge(b[k]);
  });
  const ports: WindowPort[] = [];
  if (!p.catalog) {
    for (const o of p.openings) {
      const s = specFor(o.kind, o.floor);
      if (s.door || s.shutter === "closed") continue;
      const yBottom = p.floorY[o.floor] + s.yOff;
      const yCenter = yBottom + s.h / 2;
      const q = worldAt(p, o.face, o.along, yCenter + (s.arch ? -0.04 : 0.01), 0, 0.055);
      ports.push({
        position: [q.x, q.y, q.z],
        rotationY: yaw(o.face),
        width: s.arch ? s.w * 0.8 : s.w * 0.78,
        height: s.arch ? s.h * 0.78 : s.h * 0.8,
        floor: o.floor,
        room: roomFor(o),
      });
    }
  }
  return { geos, roof: p.catalog && p.roofH <= 0 ? [] : buildRoofFaces(p), ports };
}
