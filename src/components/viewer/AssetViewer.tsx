import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { CasaToscana } from "@/components/building/CasaToscana";
import { Piazza } from "@/components/building/Piazza";
import { Overlay, VIEWS, type ViewId } from "@/components/viewer/Overlay";
import { WalkController } from "@/components/viewer/WalkController";

function sunFromHour(hour: number): [number, number, number] {
  const t = ((hour - 6) / 12) * Math.PI;
  const x = Math.cos(t) * 28;
  const y = Math.sin(t) * 22 + 4;
  const z = 12;
  return [x, Math.max(3, y), z];
}

function lampFromHour(hour: number) {
  if (hour <= 6.8) return 1;
  if (hour < 8.2) return 1 - (hour - 6.8) / 1.4;
  if (hour < 17) return 0;
  if (hour < 18.8) return (hour - 17) / 1.8;
  return 1;
}

function ViewJumper({
  target,
  look,
  walk,
}: {
  target: [number, number, number];
  look: [number, number, number];
  walk: boolean;
}) {
  const { camera } = useThree();
  const prev = useRef("");
  const key = target.join(",") + look.join(",");
  useLayoutEffect(() => {
    if (walk) return;
    if (prev.current === key) return;
    prev.current = key;
    camera.position.set(...target);
    camera.lookAt(...look);
  }, [key, walk, camera, target, look]);
  return null;
}

function StatsTap({
  onStats,
}: {
  onStats: (tris: number, calls: number) => void;
}) {
  const { gl } = useThree();
  const acc = useRef(0);
  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 0.4) return;
    acc.current = 0;
    onStats(gl.info.render.triangles, gl.info.render.calls);
  });
  return null;
}

function ExportAnchor({
  apiRef,
}: {
  apiRef: MutableRefObject<(() => void) | null>;
}) {
  const { scene } = useThree();
  apiRef.current = () => {
    const root = scene.getObjectByName("CasaToscana");
    if (!root) return;
    const exporter = new GLTFExporter();
    exporter.parse(
      root,
      (result) => {
        const blob = new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "casa-toscana.glb";
        a.click();
        URL.revokeObjectURL(a.href);
      },
      (err) => {
        console.error(err);
      },
      { binary: true },
    );
  };
  return null;
}

export default function AssetViewer() {
  const [view, setView] = useState<ViewId>("street");
  const [auto, setAuto] = useState(true);
  const [walk, setWalk] = useState(false);
  const [wire, setWire] = useState(false);
  const [hour, setHour] = useState(16.2);
  const [frost, setFrost] = useState(0);
  const [tris, setTris] = useState(0);
  const [calls, setCalls] = useState(0);
  const exportRef = useRef<(() => void) | null>(null);
  const viewDef = useMemo(() => VIEWS.find((v) => v.id === view) ?? VIEWS[0], [view]);
  const target = viewDef.pos;
  const look = viewDef.look;
  const sun = useMemo(() => sunFromHour(hour), [hour]);
  const lamp = useMemo(() => lampFromHour(hour), [hour]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: target, fov: 36, near: 0.2, far: 180 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        style={{ touchAction: "none" }}
      >
        <color attach="background" args={["#b7c2cb"]} />
        <Suspense fallback={null}>
          <Piazza sun={sun} lamp={lamp} />
          <CasaToscana wireframe={wire} lamp={lamp} frost={frost} />
        </Suspense>
        <ViewJumper target={target} look={look} walk={walk} />
        <WalkController enabled={walk} />
        <OrbitControls
          enabled={!walk}
          enableDamping
          dampingFactor={0.08}
          autoRotate={auto && !walk}
          autoRotateSpeed={0.45}
          minDistance={8}
          maxDistance={90}
          minPolarAngle={0.18}
          maxPolarAngle={Math.PI / 2 - 0.04}
          target={look}
          makeDefault
        />
        <StatsTap
          onStats={(t, c) => {
            setTris(t);
            setCalls(c);
          }}
        />
        <ExportAnchor apiRef={exportRef} />
      </Canvas>

      <Overlay
        view={view}
        onView={(id) => {
          setWalk(false);
          setAuto(false);
          setView(id);
        }}
        auto={auto && !walk}
        onAuto={setAuto}
        walk={walk}
        onWalk={(v) => {
          setWalk(v);
          if (v) setAuto(false);
        }}
        wire={wire}
        onWire={setWire}
        hour={hour}
        onHour={setHour}
        frost={frost}
        onFrost={setFrost}
        tris={tris}
        calls={calls}
        onExport={() => exportRef.current?.()}
      />
    </div>
  );
}
