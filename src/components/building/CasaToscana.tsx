import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import {
  ASSET_META,
  GEOM_REV,
  buildCasa,
  buildRoofFaces,
  type MatId,
} from "@/lib/building/geometry";
import { InteriorPortals } from "@/components/building/InteriorPortals";
import { TuscanHouse } from "@/components/building/TuscanHouse";
import { NumberPlate } from "@/components/building/NumberPlate";
import { STREET_PLANS } from "@/lib/building/plans";
import { CATALOG } from "@/lib/building/catalog";
import { BUILD_REV, buildHouse } from "@/lib/building/houseBuilder";
import { applyWeathering } from "@/lib/building/weathering";
import type { WindowPort } from "@/lib/building/geometry";

type Maps = {
  map: string;
  bump?: string;
  repeat: number;
  roughness: number;
  metalness: number;
  bumpScale: number;
  color?: string;
  transparent?: boolean;
  opacity?: number;
  envMapIntensity?: number;
};

const MATS: Record<MatId, Maps> = {
  stucco: {
    map: "/textures/stucco.jpg",
    bump: "/textures/stucco_bump.jpg",
    repeat: 1,
    roughness: 0.9,
    metalness: 0,
    bumpScale: 0.014,
    color: "#eedcae",
  },
  brick: {
    map: "/textures/brick.jpg",
    bump: "/textures/brick_bump.jpg",
    repeat: 1,
    roughness: 0.86,
    metalness: 0,
    bumpScale: 0.02,
    color: "#c39479",
  },
  stone: {
    map: "/textures/stone.jpg",
    bump: "/textures/stone_bump.jpg",
    repeat: 1,
    roughness: 0.78,
    metalness: 0.02,
    bumpScale: 0.012,
    color: "#e7e0cf",
  },
  roof: {
    map: "/textures/roof.jpg",
    bump: "/textures/roof_bump.jpg",
    repeat: 1,
    roughness: 0.7,
    metalness: 0,
    bumpScale: 0.05,
    color: "#dbc3a5",
  },
  wood: {
    map: "/textures/wood.jpg",
    bump: "/textures/wood_bump.jpg",
    repeat: 1,
    roughness: 0.7,
    metalness: 0,
    bumpScale: 0.01,
  },
  shutter: {
    map: "/textures/shutter.jpg",
    bump: "/textures/shutter_bump.jpg",
    repeat: 1,
    roughness: 0.74,
    metalness: 0,
    bumpScale: 0.008,
  },
  iron: {
    map: "/textures/iron.jpg",
    repeat: 1,
    roughness: 0.45,
    metalness: 0.72,
    bumpScale: 0,
    color: "#2a2a28",
  },
  glass: {
    map: "/textures/stucco.jpg",
    repeat: 1,
    roughness: 0.08,
    metalness: 0.15,
    bumpScale: 0,
    color: "#b7c9d4",
    transparent: true,
    opacity: 0.16,
    envMapIntensity: 1.4,
  },
  interior: {
    map: "/textures/wood.jpg",
    repeat: 1,
    roughness: 1,
    metalness: 0,
    bumpScale: 0,
    color: "#1a1410",
  },
  terracotta: {
    map: "/textures/roof.jpg",
    bump: "/textures/roof_bump.jpg",
    repeat: 1,
    roughness: 0.68,
    metalness: 0,
    bumpScale: 0.016,
    color: "#c56a3d",
  },
};

const ORDER: MatId[] = [
  "stucco",
  "brick",
  "stone",
  "roof",
  "wood",
  "shutter",
  "iron",
  "interior",
  "terracotta",
  "glass",
];

const TEXTURE_PATHS = [
  "/textures/stucco.jpg",
  "/textures/stucco_bump.jpg",
  "/textures/brick.jpg",
  "/textures/brick_bump.jpg",
  "/textures/stone.jpg",
  "/textures/stone_bump.jpg",
  "/textures/roof.jpg",
  "/textures/roof_bump.jpg",
  "/textures/wood.jpg",
  "/textures/wood_bump.jpg",
  "/textures/shutter.jpg",
  "/textures/shutter_bump.jpg",
  "/textures/iron.jpg",
] as const;

export function usePreparedTextures() {
  const maps = useTexture(TEXTURE_PATHS as unknown as string[]);
  useLayoutEffect(() => {
    maps.forEach((t, i) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.colorSpace = TEXTURE_PATHS[i].includes("_bump")
        ? THREE.NoColorSpace
        : THREE.SRGBColorSpace;
    });
  }, [maps]);
  const byPath = Object.fromEntries(TEXTURE_PATHS.map((p, i) => [p, maps[i]])) as Record<
    string,
    THREE.Texture
  >;
  return byPath;
}

export function CasaToscana({
  wireframe = false,
  lamp = 0,
  frost = 0,
  heroOnly = false,
}: {
  wireframe?: boolean;
  lamp?: number;
  frost?: number;
  heroOnly?: boolean;
}) {
  const textures = usePreparedTextures();
  const geos = useMemo(() => buildCasa(), [GEOM_REV]);
  const roofFaces = useMemo(() => buildRoofFaces(), [GEOM_REV]);

  const roofDef = MATS.roof;
  const roofMap = textures[roofDef.map];
  const roofBump = roofDef.bump ? textures[roofDef.bump] : undefined;

  const extraPorts = useMemo(() => {
    const all: WindowPort[] = [];
    for (const row of STREET_PLANS) {
      const built = buildHouse(row.plan);
      const c = Math.cos(row.yaw);
      const s = Math.sin(row.yaw);
      for (const p of built.ports) {
        const [x, y, z] = p.position;
        all.push({
          ...p,
          position: [row.position[0] + x * c + z * s, y, row.position[2] - x * s + z * c],
          rotationY: p.rotationY + row.yaw,
        });
      }
    }
    return all;
  }, [BUILD_REV]);

  return (
    <group name="CasaToscana" userData={ASSET_META}>
      {ORDER.filter((id) => id !== "roof").map((id) => (
        <Part
          key={id}
          id={id}
          geo={geos[id]}
          def={MATS[id]}
          textures={textures}
          wireframe={wireframe}
          frost={frost}
        />
      ))}
      {roofFaces.map((g, i) => (
        <mesh
          key={`roof-${i}`}
          name={`roof-face-${i}`}
          geometry={g}
          castShadow
          receiveShadow
          frustumCulled={false}
          dispose={null}
        >
          <meshStandardMaterial
            map={roofMap}
            bumpMap={wireframe ? undefined : roofBump}
            bumpScale={roofDef.bumpScale}
            color={roofDef.color ?? "#ffffff"}
            roughness={roofDef.roughness}
            metalness={0}
            wireframe={wireframe}
            side={THREE.DoubleSide}
            depthWrite
            depthTest
          />
        </mesh>
      ))}
      {heroOnly ? null : STREET_PLANS.map((row) => (
        <TuscanHouse
          key={row.plan.id}
          plan={row.plan}
          position={row.position}
          yaw={row.yaw}
          textures={textures}
          wireframe={wireframe}
          frost={frost}
        />
      ))}
      {heroOnly ? null : CATALOG.map((row) => (
        <TuscanHouse
          key={row.plan.id}
          plan={row.plan}
          position={row.position}
          yaw={row.yaw}
          textures={textures}
          wireframe={wireframe}
          frost={frost}
          label={row.label}
        />
      ))}
      <NumberPlate n="18" position={[2.4, 2.7, 4.78]} />
      <InteriorPortals lamp={lamp} frost={frost} extraPorts={heroOnly ? [] : extraPorts} />
    </group>
  );
}

function Part({
  id,
  geo,
  def,
  textures,
  wireframe,
  frost,
}: {
  id: MatId;
  geo: THREE.BufferGeometry;
  def: Maps;
  textures: Record<string, THREE.Texture>;
  wireframe: boolean;
  frost: number;
}) {
  const map = textures[def.map];
  const bump = def.bump ? textures[def.bump] : undefined;
  const isGlass = id === "glass";
  const frostColor = new THREE.Color().lerpColors(
    new THREE.Color(def.color ?? "#ffffff"),
    new THREE.Color("#d5dde3"),
    isGlass ? frost : 0,
  );
  return (
    <mesh
      name={id}
      geometry={geo}
      castShadow
      receiveShadow
      frustumCulled={false}
      dispose={null}
    >
      <meshStandardMaterial
        onUpdate={(m: THREE.Material) => {
          if (!wireframe && (id === "stucco" || id === "brick")) applyWeathering(m, id);
        }}
        map={isGlass || id === "interior" || id === "iron" ? undefined : map}
        bumpMap={wireframe ? undefined : bump}
        bumpScale={def.bumpScale}
        color={isGlass ? frostColor : (def.color ?? "#ffffff")}
        roughness={isGlass ? 0.06 + frost * 0.86 : def.roughness}
        metalness={isGlass ? 0.04 : def.metalness}
        wireframe={wireframe}
        transparent={def.transparent}
        opacity={isGlass ? 0.14 + frost * 0.62 : (def.opacity ?? 1)}
        envMapIntensity={def.envMapIntensity ?? 0.4}
        side={id === "roof" || id === "wood" ? THREE.DoubleSide : THREE.FrontSide}
        depthWrite={id !== "glass"}
        polygonOffset={id === "brick" || id === "stone" || id === "shutter" || id === "wood"}
        polygonOffsetFactor={id === "stone" || id === "shutter" || id === "wood" ? -1.5 : -1}
        polygonOffsetUnits={id === "stone" || id === "shutter" || id === "wood" ? -2 : -1}
      />
    </mesh>
  );
}

export function CasaCollision() {
  return (
    <mesh
      name="CasaToscana_collision"
      userData={{ collision: true }}
      position={[0, EAVE_FROM_ZERO / 2, 0]}
      visible={false}
    >
      <boxGeometry args={[ASSET_META.width, EAVE_FROM_ZERO, ASSET_META.depth]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

const EAVE_FROM_ZERO = 13.35;
