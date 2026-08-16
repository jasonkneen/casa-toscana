import type { OpeningKind } from "@/lib/building/geometry";
import type { HousePlan } from "@/lib/building/houseBuilder";

function panel(
  id: string,
  name: string,
  kind: OpeningKind | null,
  opts: Partial<HousePlan> = {},
): HousePlan {
  return {
    id,
    name,
    W: 3.6,
    D: 0.9,
    floors: 1,
    floorY: [0, 3.55],
    eaveY: 3.55,
    roofH: 0,
    overhang: 0,
    wallT: 0.3,
    brickSplit: -0.45,
    backBrickFrac: 0.01,
    stucco: "#e4d0b0",
    chimneys: [],
    catalog: true,
    openings: kind ? [{ face: "front", along: 0, floor: 0, kind }] : [],
    ...opts,
  };
}

const X = 46;
const GAP = 8.4;
const Z0 = 42;

function slot(i: number, depth = 0.9): [number, number, number] {
  return [X + (depth - 0.9) / 2, 0, Z0 - i * GAP];
}

export const CATALOG: { plan: HousePlan; position: [number, number, number]; yaw: number; label: string }[] = [
  { plan: panel("c-stucco", "Stucco + dado", null), position: slot(5), yaw: -Math.PI / 2, label: "Stucco + dado" },
  {
    plan: panel("c-brick", "Brick + split", null, {
      W: 3.4,
      D: 2.6,
      brickSplit: 0.15,
      backBrickFrac: 0.7,
      stucco: "#d8c4a0",
    }),
    position: slot(6, 2.6),
    yaw: -Math.PI / 2,
    label: "Brick / stucco joint",
  },
  { plan: panel("c-walnut", "Walnut androne", "arch-door"), position: slot(7), yaw: -Math.PI / 2, label: "Walnut androne" },
  { plan: panel("c-plank", "Green plank arch", "plank-arch"), position: slot(8), yaw: -Math.PI / 2, label: "Green plank arch" },
  { plan: panel("c-herr", "Herringbone", "herringbone", { W: 3.9 }), position: slot(9), yaw: -Math.PI / 2, label: "Herringbone" },
  { plan: panel("c-carr", "Carriage", "carriage", { W: 4.0 }), position: slot(10), yaw: -Math.PI / 2, label: "Carriage door" },
  { plan: panel("c-svc", "Service door", "rect-door"), position: slot(11), yaw: -Math.PI / 2, label: "Service door" },
  { plan: panel("c-bar", "Barred window", "barred"), position: slot(12), yaw: -Math.PI / 2, label: "Barred window" },
  { plan: panel("c-shut", "Shutter", "rect-shutter"), position: slot(13), yaw: -Math.PI / 2, label: "Casement + shutters" },
  { plan: panel("c-archb", "Arch balcony", "arch-balcony"), position: slot(14), yaw: -Math.PI / 2, label: "Arch balcony" },
  { plan: panel("c-louv", "Louver", "louver"), position: slot(15), yaw: -Math.PI / 2, label: "Louver / bagno" },
  { plan: panel("c-latt", "Lattice grille", "lattice"), position: slot(1), yaw: -Math.PI / 2, label: "Lattice grille" },
  { plan: panel("c-guard", "Guarded window", "rect-guard"), position: slot(2), yaw: -Math.PI / 2, label: "Casement + guard rail" },
  { plan: panel("c-lowl", "Low louver", "louver-low"), position: slot(3), yaw: -Math.PI / 2, label: "Low louver" },
  { plan: panel("c-blind", "Walled-up window", "blind"), position: slot(4), yaw: -Math.PI / 2, label: "Finestra tamponata" },
  {
    plan: panel("c-coppi", "Coppi roof", null, {
      W: 3.8,
      D: 2.8,
      eaveY: 3.1,
      floorY: [0, 3.1],
      roofH: 0.85,
      overhang: 0.34,
    }),
    position: slot(0, 2.8),
    yaw: -Math.PI / 2,
    label: "Coppi roof + caps",
  },
];
