"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
}

// Shared geometries to avoid re-creation
const PLANET_GEO = new THREE.SphereGeometry(1, 12, 12);
const SUN_GEO = new THREE.SphereGeometry(1.5, 20, 20);

function OrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: "#334155", transparent: true, opacity: 0.2 });
    return new THREE.Line(geo, mat);
  }, [radius]);

  return <primitive object={line} />;
}

function Planet({ radius, orbitRadius, speed, color }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <mesh ref={ref} geometry={PLANET_GEO} scale={radius}>
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
}

function StaticStars() {
  const geo = useMemo(() => {
    const positions = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={0.8} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function SolarSystemScene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + 0.3;
  });

  return (
    <group ref={groupRef} position={[0, -8, -5]}>
      {/* Sun — basic material, no light needed */}
      <mesh geometry={SUN_GEO}>
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <Planet radius={0.25} orbitRadius={3.5} speed={0.8} color="#61dafb" />
      <Planet radius={0.35} orbitRadius={5.5} speed={0.5} color="#0078d4" />
      <Planet radius={0.2} orbitRadius={7} speed={0.65} color="#10b981" />
      <Planet radius={0.3} orbitRadius={9} speed={0.35} color="#818cf8" />
      <Planet radius={0.18} orbitRadius={11} speed={0.45} color="#06b6d4" />
      <Planet radius={0.22} orbitRadius={13} speed={0.25} color="#f97316" />
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
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }}
      >
        <StaticStars />
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}
