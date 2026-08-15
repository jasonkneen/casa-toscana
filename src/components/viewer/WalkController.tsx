import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { W, D } from "@/lib/building/geometry";

const EYE = 1.68;
const SPEED = 4.4;
const HALF_W = W / 2 + 0.7;
const HALF_D = D / 2 + 0.7;

type Probe = {
  getYaw: () => number;
  getSpeed: () => number;
  setKeys: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: Probe;
  }
}

export function WalkController({ enabled }: { enabled: boolean }) {
  const { camera, gl } = useThree();
  const keys = useRef(new Set<string>());
  const yaw = useRef(0);
  const pitch = useRef(-0.08);
  const pos = useRef(new THREE.Vector3(0, EYE, 14));
  const speed = useRef(0);
  const locked = useRef(false);
  const tmpF = useRef(new THREE.Vector3());
  const tmpR = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
    };
    const up = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
    };
    const blur = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      locked.current = false;
      try {
        document.exitPointerLock();
      } catch {
        /* ignore */
      }
      return;
    }
    const el = gl.domElement;
    const onClick = () => {
      if (!enabled) return;
      el.requestPointerLock();
    };
    const onLock = () => {
      locked.current = document.pointerLockElement === el;
    };
    const onMove = (e: MouseEvent) => {
      if (!locked.current || !enabled) return;
      yaw.current -= e.movementX * 0.0022;
      pitch.current -= e.movementY * 0.0022;
      pitch.current = Math.max(-1.2, Math.min(1.2, pitch.current));
    };
    el.addEventListener("click", onClick);
    document.addEventListener("pointerlockchange", onLock);
    document.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("click", onClick);
      document.removeEventListener("pointerlockchange", onLock);
      document.removeEventListener("mousemove", onMove);
    };
  }, [enabled, gl]);

  useEffect(() => {
    window.__controlsTest = {
      getYaw: () => yaw.current,
      getSpeed: () => speed.current,
      setKeys: (codes) => {
        keys.current.clear();
        for (const c of codes) keys.current.add(c);
      },
    };
    return () => {
      delete window.__controlsTest;
    };
  }, []);

  useFrame((_, dtRaw) => {
    if (!enabled) return;
    const dt = Math.min(dtRaw, 0.1);
    const forward = tmpF.current;
    forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
    const right = tmpR.current;
    right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));

    let mx = 0;
    let mz = 0;
    if (keys.current.has("KeyW") || keys.current.has("ArrowUp")) mz += 1;
    if (keys.current.has("KeyS") || keys.current.has("ArrowDown")) mz -= 1;
    if (keys.current.has("KeyD") || keys.current.has("ArrowRight")) mx += 1;
    if (keys.current.has("KeyA") || keys.current.has("ArrowLeft")) mx -= 1;
    const len = Math.hypot(mx, mz);
    if (len > 0) {
      mx /= len;
      mz /= len;
    }
    const sprint = keys.current.has("ShiftLeft") || keys.current.has("ShiftRight") ? 1.55 : 1;
    pos.current.addScaledVector(forward, mz * SPEED * sprint * dt);
    pos.current.addScaledVector(right, mx * SPEED * sprint * dt);
    speed.current = Math.hypot(mx, mz) * SPEED * sprint;

    const x = pos.current.x;
    const z = pos.current.z;
    const insideX = Math.abs(x) < HALF_W;
    const insideZ = Math.abs(z) < HALF_D;
    if (insideX && insideZ) {
      const dx = HALF_W - Math.abs(x);
      const dz = HALF_D - Math.abs(z);
      if (dx < dz) pos.current.x = Math.sign(x) * HALF_W;
      else pos.current.z = Math.sign(z) * HALF_D;
    }

    pos.current.y = EYE;
    const radius = Math.hypot(pos.current.x, pos.current.z);
    if (radius > 28) {
      pos.current.multiplyScalar(28 / radius);
      pos.current.y = EYE;
    }

    camera.position.copy(pos.current);
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
  });

  return null;
}
