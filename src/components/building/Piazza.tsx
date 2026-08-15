import { useLayoutEffect } from "react";
import * as THREE from "three";
import { ContactShadows, Sky, useTexture } from "@react-three/drei";

function Cypress({
  position,
  height = 7.4,
}: {
  position: [number, number, number];
  height?: number;
}) {
  const [x, y, z] = position;
  const layers = 6;
  return (
    <group position={[x, y, z]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 1.1, 8]} />
        <meshStandardMaterial color="#4a3424" roughness={0.92} />
      </mesh>
      {Array.from({ length: layers }, (_, i) => {
        const t = i / (layers - 1);
        const h = height * 0.22 * (1 - t * 0.25);
        const r = 0.95 * (1 - t * 0.72);
        const yy = 1.1 + t * (height - 1.4);
        return (
          <mesh key={i} castShadow position={[0, yy, 0]}>
            <coneGeometry args={[r, h, 9]} />
            <meshStandardMaterial color={i % 2 ? "#1d3a28" : "#234830"} roughness={0.88} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Piazza({ sun, lamp = 0 }: { sun: [number, number, number]; lamp?: number }) {
  const cobble = useTexture("/textures/cobble.jpg");
  useLayoutEffect(() => {
    cobble.wrapS = cobble.wrapT = THREE.RepeatWrapping;
    cobble.repeat.set(28, 28);
    cobble.anisotropy = 8;
    cobble.colorSpace = THREE.SRGBColorSpace;
  }, [cobble]);

  return (
    <>
      <Sky
        sunPosition={sun}
        turbidity={5.5 + lamp * 4}
        rayleigh={1.15 + lamp * 0.6}
        mieCoefficient={0.006}
        mieDirectionalG={0.82}
        inclination={0.47}
        azimuth={0.22}
      />
      <fog attach="fog" args={[lamp > 0.4 ? "#2a3038" : "#c5cdd4", 48, 130]} />
      <hemisphereLight args={[lamp > 0.5 ? "#3a4552" : "#dbe4ee", "#8a7a62", 0.55 - lamp * 0.22]} />
      <ambientLight intensity={0.22 + lamp * 0.06} color={lamp > 0.4 ? "#c4a070" : "#ffffff"} />
      <directionalLight
        castShadow
        position={sun}
        intensity={2.15 * (1 - lamp * 0.78)}
        color={lamp > 0.35 ? "#ffb070" : "#fff1d6"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.00025}
      />
      <directionalLight position={[-12, 8, -10]} intensity={0.28 + lamp * 0.08} color="#a8bdd0" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[72, 64]} />
        <meshStandardMaterial map={cobble} roughness={0.92} metalness={0} color="#d4cbb8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <ringGeometry args={[72, 96, 64]} />
        <meshStandardMaterial color="#6d7a62" roughness={1} />
      </mesh>

      <mesh receiveShadow position={[0, 0.04, 8.4]}>
        <boxGeometry args={[36, 0.08, 5.2]} />
        <meshStandardMaterial color="#cfc4ae" roughness={0.9} />
      </mesh>

      <group position={[0.4, 0, 11.2]}>
        <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
          <cylinderGeometry args={[1.15, 1.25, 0.44, 16]} />
          <meshStandardMaterial color="#a8a194" roughness={0.86} />
        </mesh>
        <mesh receiveShadow position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.16, 16]} />
          <meshStandardMaterial color="#6a8aa0" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>

      <Cypress position={[-9.2, 0, 6.4]} height={8.2} />
      <Cypress position={[9.4, 0, 6.1]} height={7.6} />
      <Cypress position={[-16.4, 0, 5.2]} height={7.1} />
      <Cypress position={[17.2, 0, 5.0]} height={6.8} />
      <Cypress position={[-10.4, 0, -4.8]} height={6.8} />
      <Cypress position={[10.6, 0, -5.6]} height={7.9} />
      <Cypress position={[-7.2, 0, -9.5]} height={6.2} />
      <Cypress position={[8.1, 0, -10.2]} height={6.5} />
      <Cypress position={[-14.8, 0, -12.2]} height={7.4} />
      <Cypress position={[6.4, 0, -16.8]} height={6.4} />

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.38}
        scale={56}
        blur={2.6}
        far={16}
        color="#2a241c"
      />
    </>
  );
}
