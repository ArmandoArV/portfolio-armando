"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────── Procedural Astronaut ─────────────────── */

const SUIT_COLOR = 0xeaeaea;
const JOINT_COLOR = 0x555555;
const VISOR_COLOR = 0x4fc3f7;
const ACCENT_COLOR = 0xc62828;

function Astronaut({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Fixed position — gentle idle bob only
    groupRef.current.position.x = 0;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.1;
    groupRef.current.position.z = 0;

    // Relaxed body sway
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.03;

    // Head tracks mouse subtly
    if (headRef.current && mouse.current) {
      const mx = mouse.current.x;
      const my = mouse.current.y;
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        mx * 0.4,
        0.05
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -my * 0.25,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} scale={0.5} rotation={[0.1, 0.2, -0.15]}>
      {/* ── Body (torso) ── */}
      <mesh>
        <capsuleGeometry args={[0.28, 0.5, 4, 12]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Chest stripe */}
      <mesh position={[0, 0.05, 0.27]}>
        <boxGeometry args={[0.35, 0.08, 0.02]} />
        <meshStandardMaterial color={ACCENT_COLOR} />
      </mesh>

      {/* ── Head / Helmet (tracks mouse) ── */}
      <group ref={headRef} position={[0, 0.62, 0]}>
        {/* Helmet shell */}
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={SUIT_COLOR} roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 0, 0.15]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.26, 24, 24, 0, Math.PI, 0, Math.PI]} />
          <meshStandardMaterial
            color={VISOR_COLOR}
            metalness={0.95}
            roughness={0.05}
            transparent
            opacity={0.85}
            envMapIntensity={2}
          />
        </mesh>
        {/* Visor rim */}
        <mesh position={[0, 0, 0.12]}>
          <torusGeometry args={[0.26, 0.025, 12, 24]} />
          <meshStandardMaterial color={JOINT_COLOR} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Backpack ── */}
      <group position={[0, 0.1, -0.35]}>
        <mesh>
          <boxGeometry args={[0.35, 0.45, 0.18]} />
          <meshStandardMaterial color={JOINT_COLOR} roughness={0.4} metalness={0.5} />
        </mesh>
        {/* Oxygen tanks */}
        <mesh position={[-0.1, 0, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={0x888888} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.1, 0, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={0x888888} metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* ── Left Arm ── */}
      <AstronautArm side={-1} />
      {/* ── Right Arm ── */}
      <AstronautArm side={1} />

      {/* ── Left Leg ── */}
      <AstronautLeg side={-1} />
      {/* ── Right Leg ── */}
      <AstronautLeg side={1} />
    </group>
  );
}

function AstronautArm({ side }: { side: number }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Gentle floating arm sway
    ref.current.rotation.x = Math.sin(t * 0.6 + side * 1.5) * 0.25;
    ref.current.rotation.z = side * 0.3 + Math.sin(t * 0.4 + side) * 0.1;
  });

  return (
    <group ref={ref} position={[side * 0.38, 0.15, 0]}>
      {/* Upper arm */}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Joint */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={JOINT_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Forearm */}
      <mesh position={[0, -0.45, 0]}>
        <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Glove */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={JOINT_COLOR} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

function AstronautLeg({ side }: { side: number }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    // Subtle floating leg drift (opposite phase per side)
    ref.current.rotation.x = Math.sin(t * 0.5 + side * Math.PI) * 0.15;
  });

  return (
    <group ref={ref} position={[side * 0.16, -0.55, 0]}>
      {/* Thigh */}
      <mesh position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Knee */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={JOINT_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Shin */}
      <mesh position={[0, -0.4, 0]}>
        <capsuleGeometry args={[0.09, 0.18, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Boot */}
      <mesh position={[0, -0.55, 0.04]}>
        <boxGeometry args={[0.16, 0.12, 0.22]} />
        <meshStandardMaterial color={JOINT_COLOR} roughness={0.4} metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ─────────────────── Scene (lights + astronaut) ─────────────────── */

function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color={0xffffff} />
      <pointLight position={[-4, 3, 2]} intensity={0.6} color={0x8080ff} />
      <Astronaut mouse={mouse} />
    </>
  );
}

/* ─────────────────── Overlay Canvas ─────────────────── */

export default function FloatingAstronaut() {
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  // Track cursor position normalised to [-1, 1]
  const handleMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, []);

  // On mobile, use device orientation or just idle float
  const handleTouch = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -((touch.clientY / window.innerHeight) * 2 - 1);
  }, []);

  useEffect(() => {
    // Small delay so it doesn't pop in during page load
    const timer = setTimeout(() => setVisible(true), 1500);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [handleMove, handleTouch]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-30 pointer-events-none w-40 h-40 md:w-52 md:h-52"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ background: "transparent", pointerEvents: "none" }}
        dpr={[1, 1.5]}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
