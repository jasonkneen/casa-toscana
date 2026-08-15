import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { listWindowPorts, ROOM_REV, type RoomId, type WindowPort } from "@/lib/building/geometry";

const ROOM_PATHS: Record<RoomId, string> = {
  kitchen: "/textures/interior-kitchen.jpg",
  dining: "/textures/interior-dining.jpg",
  reception: "/textures/interior-salon.jpg",
  living: "/textures/interior-living.jpg",
  livingB: "/textures/interior-sala.jpg",
  salon: "/textures/interior-salon.jpg",
  bedroomA: "/textures/interior-bedroom-a.jpg",
  bedroomB: "/textures/interior-bedroom-b.jpg",
  study: "/textures/interior-study.jpg",
  stair: "/textures/interior-stair.jpg",
};

const TEXTURE_LIST = [
  ROOM_PATHS.kitchen,
  ROOM_PATHS.dining,
  ROOM_PATHS.salon,
  ROOM_PATHS.living,
  ROOM_PATHS.livingB,
  ROOM_PATHS.bedroomA,
  ROOM_PATHS.bedroomB,
  ROOM_PATHS.study,
  ROOM_PATHS.stair,
] as const;

const VERT = /* glsl */ `
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform sampler2D interiorMap;
  uniform vec3 roomSize;
  uniform vec3 localCam;
  uniform float lamp;
  uniform float frost;
  varying vec3 vLocalPos;

  vec3 sampleRoom(vec2 uv) {
    vec2 u = clamp(uv, 0.0, 1.0);
    vec3 base = texture2D(interiorMap, u).rgb;
    if (frost < 0.04) return base;
    float s = 0.02 + frost * 0.06;
    vec3 acc = base;
    acc += texture2D(interiorMap, u + vec2(s, 0.0)).rgb;
    acc += texture2D(interiorMap, u + vec2(-s, 0.0)).rgb;
    acc += texture2D(interiorMap, u + vec2(0.0, s)).rgb;
    acc += texture2D(interiorMap, u + vec2(0.0, -s)).rgb;
    acc += texture2D(interiorMap, u + vec2(s, s) * 0.7).rgb;
    acc += texture2D(interiorMap, u + vec2(-s, s) * 0.7).rgb;
    acc += texture2D(interiorMap, u + vec2(s, -s) * 0.7).rgb;
    acc += texture2D(interiorMap, u + vec2(-s, -s) * 0.7).rgb;
    return acc / 9.0;
  }

  void main() {
    vec3 ro = localCam;
    vec3 rd = normalize(vLocalPos - localCam);

    vec3 boxMin = vec3(-roomSize.x * 0.5, -roomSize.y * 0.5, -roomSize.z);
    vec3 boxMax = vec3( roomSize.x * 0.5,  roomSize.y * 0.5, 0.02);

    vec3 invRd = 1.0 / max(abs(rd), vec3(0.0001)) * sign(rd);
    vec3 t0 = (boxMin - ro) * invRd;
    vec3 t1 = (boxMax - ro) * invRd;
    vec3 tmax = max(t0, t1);
    float tFar = min(min(tmax.x, tmax.y), tmax.z);
    vec3 hit = ro + rd * max(tFar, 0.0);

    vec2 uv = vec2(
      (hit.x - boxMin.x) / max(boxMax.x - boxMin.x, 0.001),
      (hit.y - boxMin.y) / max(boxMax.y - boxMin.y, 0.001)
    );
    vec3 tint = vec3(1.0);
    vec3 dMin = abs(hit - boxMin);
    vec3 dMax = abs(hit - boxMax);
    float eps = 0.04;

    if (dMin.x < eps || dMax.x < eps) {
      uv = vec2(
        clamp((hit.z - boxMin.z) / max(boxMax.z - boxMin.z, 0.001), 0.0, 0.25),
        (hit.y - boxMin.y) / max(boxMax.y - boxMin.y, 0.001)
      );
      tint = vec3(0.78, 0.74, 0.66);
    } else if (dMin.y < eps) {
      uv = vec2(
        (hit.x - boxMin.x) / max(boxMax.x - boxMin.x, 0.001),
        clamp((hit.z - boxMin.z) / max(boxMax.z - boxMin.z, 0.001), 0.0, 0.3)
      );
      tint = vec3(0.7, 0.5, 0.36);
    } else if (dMax.y < eps) {
      uv = vec2(
        (hit.x - boxMin.x) / max(boxMax.x - boxMin.x, 0.001),
        clamp(1.0 - (hit.z - boxMin.z) / max(boxMax.z - boxMin.z, 0.001), 0.7, 1.0)
      );
      tint = vec3(0.9, 0.86, 0.78);
    }

    vec3 tex = sampleRoom(uv) * tint;
    float fres = pow(1.0 - max(dot(normalize(-rd), vec3(0.0, 0.0, 1.0)), 0.0), 2.4);
    float lum = dot(tex, vec3(0.299, 0.587, 0.114));

    vec3 warm = vec3(1.0, 0.7, 0.36);
    float spot = exp(-dot(uv - vec2(0.5, 0.58), uv - vec2(0.5, 0.58)) * 5.0);
    vec3 dim = tex * mix(0.38, 0.14, smoothstep(0.5, 0.88, lum));
    vec3 night = dim * mix(vec3(0.5, 0.42, 0.32), warm, 0.4 + spot * 0.6) + warm * spot * 0.3;
    vec3 col = mix(tex, night, lamp);

    vec3 milk = vec3(0.8, 0.84, 0.88);
    float grey = dot(col, vec3(0.33));
    col = mix(col, vec3(grey), frost * 0.45);
    col = mix(col, mix(col, milk, 0.62), frost);
    col = mix(col, milk, frost * fres * 0.4);
    col = mix(col, vec3(0.74, 0.8, 0.84), fres * 0.18 * (1.0 - lamp));

    gl_FragColor = vec4(col, 1.0);
  }
`;

function InteriorPane({
  position,
  rotationY,
  width,
  height,
  map,
  lamp,
  frost,
}: {
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
  map: THREE.Texture;
  lamp: number;
  frost: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();
  const localCam = useMemo(() => new THREE.Vector3(), []);
  const uniforms = useMemo(
    () => ({
      interiorMap: { value: map },
      roomSize: { value: new THREE.Vector3(width * 1.55, height * 1.4, 2.15) },
      localCam: { value: new THREE.Vector3(0, 0, 2) },
      lamp: { value: lamp },
      frost: { value: frost },
    }),
    [map, width, height],
  );

  useFrame(() => {
    if (!mesh.current) return;
    localCam.copy(camera.position);
    mesh.current.worldToLocal(localCam);
    const u = mat.current?.uniforms ?? uniforms;
    u.localCam.value.copy(localCam);
    u.lamp.value = lamp;
    u.frost.value = frost;
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={[0, rotationY, 0]}
      frustumCulled={false}
      dispose={null}
    >
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        toneMapped
      />
    </mesh>
  );
}

export function InteriorPortals({
  lamp = 0,
  frost = 0,
  extraPorts = [],
}: {
  lamp?: number;
  frost?: number;
  extraPorts?: WindowPort[];
}) {
  const maps = useTexture(TEXTURE_LIST as unknown as string[]);
  useLayoutEffect(() => {
    maps.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    });
  }, [maps]);

  const byPath = useMemo(() => {
    const rec: Record<string, THREE.Texture> = {};
    TEXTURE_LIST.forEach((p, i) => {
      rec[p] = maps[i];
    });
    return rec;
  }, [maps]);

  const ports = useMemo(() => [...listWindowPorts(), ...extraPorts], [ROOM_REV, extraPorts]);

  return (
    <group name="InteriorPortals">
      {ports.map((p, i) => (
        <InteriorPane
          key={i}
          position={p.position}
          rotationY={p.rotationY}
          width={p.width}
          height={p.height}
          map={byPath[ROOM_PATHS[p.room]]}
          lamp={lamp}
          frost={frost}
        />
      ))}
    </group>
  );
}
