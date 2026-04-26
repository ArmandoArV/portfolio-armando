"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Line } from "@react-three/drei";
import * as THREE from "three";

interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  emissive?: string;
  size?: number;
}

function Planet({ radius, orbitRadius, speed, color, emissive, size = 1 }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null!);

  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
    }
    return points;
  }, [orbitRadius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
  });

  return (
    <>
      <Line points={orbitPoints} color="#334155" transparent opacity={0.3} lineWidth={0.5} />
      <mesh ref={ref}>
        <sphereGeometry args={[radius * size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive || color}
          emissiveIntensity={0.3}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
    </>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#f59e0b"
        emissive="#f59e0b"
        emissiveIntensity={2}
        roughness={0}
        metalness={0}
      />
      <pointLight color="#f59e0b" intensity={100} distance={100} />
    </mesh>
  );
}

function SolarSystemScene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + 0.3;
  });

  return (
    <group ref={groupRef} position={[0, -8, -5]}>
      <Sun />
      {/* React - Blue */}
      <Planet radius={0.25} orbitRadius={3.5} speed={0.8} color="#61dafb" />
      {/* Azure - Cyan */}
      <Planet radius={0.35} orbitRadius={5.5} speed={0.5} color="#0078d4" emissive="#0078d4" />
      {/* Python - Green */}
      <Planet radius={0.2} orbitRadius={7} speed={0.65} color="#10b981" />
      {/* TypeScript - Indigo */}
      <Planet radius={0.3} orbitRadius={9} speed={0.35} color="#818cf8" />
      {/* Go - Teal */}
      <Planet radius={0.18} orbitRadius={11} speed={0.45} color="#06b6d4" />
      {/* Rust - Orange */}
      <Planet radius={0.22} orbitRadius={13} speed={0.25} color="#f97316" />
      {/* C++ - Red */}
      <Planet radius={0.15} orbitRadius={15} speed={0.55} color="#ef4444" />
    </group>
  );
}

export default function SolarSystem() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 12, 20], fov: 60 }}
        style={{ background: "#020617" }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        <Stars radius={80} depth={60} count={3000} factor={4} saturation={0.5} fade speed={0.5} />
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}
