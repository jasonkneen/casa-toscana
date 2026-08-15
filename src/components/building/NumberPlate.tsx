import { useMemo } from "react";
import * as THREE from "three";

export function NumberPlate({
  n,
  position,
  rotationY = 0,
  wide = false,
}: {
  n: string;
  position: [number, number, number];
  rotationY?: number;
  wide?: boolean;
}) {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = wide ? 512 : 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#e8e4dc";
    ctx.fillRect(0, 0, c.width, 128);
    ctx.strokeStyle = "#2a3344";
    ctx.lineWidth = 8;
    if (wide) {
      ctx.strokeRect(6, 6, c.width - 12, 116);
      ctx.fillStyle = "#1c2740";
      ctx.font = "bold 42px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n, c.width / 2, 68);
    } else {
      ctx.beginPath();
      ctx.arc(64, 64, 54, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#1c2740";
      ctx.font = "bold 72px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n, 64, 68);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [n, wide]);

  const w = wide ? Math.min(2.4, 0.18 * n.length + 0.4) : 0.22;
  const h = wide ? 0.22 : 0.22;

  return (
    <mesh position={position} rotation={[0, rotationY, 0]} castShadow>
      <boxGeometry args={[w, h, 0.03]} />
      <meshStandardMaterial map={map} roughness={0.55} />
    </mesh>
  );
}
