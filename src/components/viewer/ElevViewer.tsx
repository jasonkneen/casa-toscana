import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { CasaToscana } from "@/components/building/CasaToscana";
import { ASSET_META } from "@/lib/building/geometry";

const H = ASSET_META.height;

const CAMS: Record<string, { pos: [number, number, number]; up?: [number, number, number] }> = {
  front: { pos: [0, H / 2, 80] },
  rear: { pos: [0, H / 2, -80] },
  left: { pos: [-80, H / 2, 0] },
  right: { pos: [80, H / 2, 0] },
};

/** Flat orthographic elevation shots of the hero house for reference comparison. */
export default function ElevViewer({ view }: { view: string }) {
  const cam = CAMS[view] ?? CAMS.front;
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        preserveDrawingBuffer: true,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      shadows
    >
      <color attach="background" args={["#e2e2e0"]} />
      <OrthographicCamera
        makeDefault
        position={cam.pos}
        zoom={52}
        near={1}
        far={220}
        onUpdate={(c) => c.lookAt(0, H / 2 - 0.35, 0)}
      />
      <ambientLight intensity={1.15} />
      <directionalLight
        position={[cam.pos[0] * 0.5 + 14, 34, cam.pos[2] * 0.5 + 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 24, -4]} />
      </directionalLight>
      <Suspense fallback={null}>
        <CasaToscana heroOnly />
      </Suspense>
    </Canvas>
  );
}
