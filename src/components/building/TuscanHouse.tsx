import { useMemo } from "react";
import * as THREE from "three";
import { BUILD_REV, buildHouse, type HousePlan } from "@/lib/building/houseBuilder";
import type { MatId } from "@/lib/building/geometry";
import { NumberPlate } from "@/components/building/NumberPlate";
import { applyWeathering } from "@/lib/building/weathering";
import { CoppiInstances, type CoppiParams } from "@/components/building/CoppiRoof";

const ORDER: MatId[] = [
  "stucco",
  "brick",
  "stone",
  "wood",
  "shutter",
  "iron",
  "interior",
  "terracotta",
  "glass",
];

export function TuscanHouse({
  plan,
  position,
  yaw,
  textures,
  wireframe,
  frost,
  label,
}: {
  plan: HousePlan;
  position: [number, number, number];
  yaw: number;
  textures: Record<string, THREE.Texture>;
  wireframe: boolean;
  frost: number;
  label?: string;
}) {
  const built = useMemo(() => buildHouse(plan), [plan, BUILD_REV]);
  const coppi = useMemo<CoppiParams>(() => {
    let seed = 7;
    for (const ch of plan.id) seed = (seed * 33 + ch.charCodeAt(0)) >>> 0;
    return {
      W: plan.W,
      D: plan.D,
      eaveY: plan.eaveY,
      roofH: plan.roofH,
      overhang: plan.overhang,
      ridge: Math.max(0.35, (plan.W - plan.D) / 2 + 0.15),
      seed,
      detail: "kin",
    };
  }, [plan]);

  return (
    <group position={position} rotation={[0, yaw, 0]} name={plan.id}>
      {ORDER.map((id) => {
        const geo = built.geos[id];
        if (!geo) return null;
        const isGlass = id === "glass";
        return (
          <mesh key={id} geometry={geo} castShadow receiveShadow frustumCulled={false} dispose={null}>
            <meshStandardMaterial
              onUpdate={(m: THREE.Material) => {
                if (!wireframe && (id === "stucco" || id === "brick")) applyWeathering(m, id);
              }}
              map={
                isGlass || id === "interior" || id === "iron"
                  ? undefined
                  : textures[
                      id === "stucco"
                        ? "/textures/stucco.jpg"
                        : id === "brick"
                          ? "/textures/brick.jpg"
                          : id === "stone"
                            ? "/textures/stone.jpg"
                            : id === "wood"
                              ? "/textures/wood.jpg"
                              : id === "shutter"
                                ? "/textures/shutter.jpg"
                                : id === "terracotta"
                                  ? "/textures/roof.jpg"
                                  : "/textures/iron.jpg"
                    ]
              }
              bumpMap={
                wireframe
                  ? undefined
                  : id === "stucco"
                    ? textures["/textures/stucco_bump.jpg"]
                    : id === "brick"
                      ? textures["/textures/brick_bump.jpg"]
                      : id === "stone"
                        ? textures["/textures/stone_bump.jpg"]
                        : id === "wood"
                          ? textures["/textures/wood_bump.jpg"]
                          : id === "shutter"
                            ? textures["/textures/shutter_bump.jpg"]
                            : id === "terracotta"
                              ? textures["/textures/roof_bump.jpg"]
                              : undefined
              }
              bumpScale={id === "brick" ? 0.02 : 0.012}
              color={
                isGlass
                  ? new THREE.Color("#b7c9d4").lerp(new THREE.Color("#d5dde3"), frost)
                  : id === "stucco"
                    ? plan.stucco
                    : id === "iron"
                      ? "#2a2a28"
                      : id === "interior"
                        ? "#1a1410"
                        : id === "terracotta"
                          ? "#c56a3d"
                          : "#ffffff"
              }
              roughness={isGlass ? 0.06 + frost * 0.86 : id === "iron" ? 0.45 : 0.82}
              metalness={isGlass ? 0.04 : id === "iron" ? 0.72 : 0}
              transparent={isGlass}
              opacity={isGlass ? 0.14 + frost * 0.62 : 1}
              wireframe={wireframe}
              depthWrite={!isGlass}
            />
          </mesh>
        );
      })}
      {built.roof.length > 0 ? (
        <CoppiInstances params={coppi} faces={built.roof} wireframe={wireframe} />
      ) : null}
      {plan.number ? (
        <NumberPlate n={plan.number} position={[plan.W * 0.22, 2.55, plan.D / 2 + 0.05]} />
      ) : null}
      {label ? <NumberPlate n={label} position={[0, plan.eaveY + 0.28, plan.D / 2 + 0.04]} wide /> : null}
    </group>
  );
}
