"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Rocky the Eridian ───
   From Project Hail Mary: a rock-textured spider-like alien
   with 5 limbs, a round carapace body, and no visible eyes.
   Here he's waving a limb to salute visitors. */

const CARAPACE_COLOR = 0x8b7355;
const CARAPACE_DARK = 0x5c4a32;
const LIMB_COLOR = 0x6b5b45;
const JOINT_COLOR = 0x4a3c2a;
const EYE_GLOW = 0xffe082;

function RockyModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const waveLimbRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Gentle body bob
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.04;
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }

    // Wave limb animation (salute!)
    if (waveLimbRef.current) {
      waveLimbRef.current.rotation.z = -1.2 + Math.sin(t * 3) * 0.4;
      waveLimbRef.current.rotation.x = Math.sin(t * 2.5 + 0.5) * 0.15;
    }

    // Subtle body pulse (breathing)
    if (bodyRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.02;
      bodyRef.current.scale.set(s, s * 0.95, s);
    }
  });

  return (
    <group ref={groupRef} scale={0.85} position={[0, -0.1, 0]}>
      {/* ── Main body (rocky carapace) ── */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial
          color={CARAPACE_COLOR}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Body texture bumps */}
      {[
        [0.2, 0.3, 0.3],
        [-0.15, 0.35, 0.2],
        [0.1, -0.1, 0.45],
        [-0.25, 0.1, 0.35],
        [0.3, 0.15, 0.25],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z] as [number, number, number]}>
          <sphereGeometry args={[0.08 + i * 0.01, 8, 8]} />
          <meshStandardMaterial color={CARAPACE_DARK} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}

      {/* ── "Face" area - faint glowing spots (Eridians sense vibrations, not light) ── */}
      <mesh position={[0.12, 0.25, 0.42]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={EYE_GLOW} emissive={EYE_GLOW} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.12, 0.25, 0.42]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color={EYE_GLOW} emissive={EYE_GLOW} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.18, 0.46]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={EYE_GLOW} emissive={EYE_GLOW} emissiveIntensity={1} />
      </mesh>

      {/* ── Waving limb (top-right, saluting!) ── */}
      <group ref={waveLimbRef} position={[0.4, 0.2, 0.1]}>
        <mesh position={[0.15, 0.15, 0]}>
          <capsuleGeometry args={[0.05, 0.3, 4, 8]} />
          <meshStandardMaterial color={LIMB_COLOR} roughness={0.8} />
        </mesh>
        {/* Joint */}
        <mesh position={[0.25, 0.35, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color={JOINT_COLOR} roughness={0.7} metalness={0.2} />
        </mesh>
        {/* Forearm segment */}
        <group position={[0.25, 0.35, 0]} rotation={[0, 0, -0.5]}>
          <mesh position={[0.1, 0.12, 0]}>
            <capsuleGeometry args={[0.04, 0.25, 4, 8]} />
            <meshStandardMaterial color={LIMB_COLOR} roughness={0.8} />
          </mesh>
          {/* "Hand" claw */}
          <mesh position={[0.15, 0.28, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={CARAPACE_DARK} roughness={0.7} metalness={0.15} />
          </mesh>
        </group>
      </group>

      {/* ── Other 4 limbs (resting/supporting) ── */}
      {[
        { pos: [-0.4, 0.15, 0.1], rot: [0, 0, 0.6] },
        { pos: [0.35, -0.25, 0.15], rot: [0, 0, 0.3] },
        { pos: [-0.35, -0.25, 0.15], rot: [0, 0, -0.3] },
        { pos: [0, -0.4, 0.2], rot: [0.2, 0, 0] },
      ].map(({ pos, rot }, i) => (
        <group key={i} position={pos as [number, number, number]} rotation={rot as [number, number, number]}>
          <mesh position={[0, -0.15, 0]}>
            <capsuleGeometry args={[0.05, 0.28, 4, 8]} />
            <meshStandardMaterial color={LIMB_COLOR} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.33, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={JOINT_COLOR} roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <capsuleGeometry args={[0.04, 0.2, 4, 8]} />
            <meshStandardMaterial color={LIMB_COLOR} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Rocky() {
  return (
    <div className="w-20 h-20 md:w-24 md:h-24" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <pointLight position={[-2, 1, 2]} intensity={0.4} color={0xffcc88} />
        <RockyModel />
      </Canvas>
    </div>
  );
}
