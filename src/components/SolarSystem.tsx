"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MoonDef {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
}

interface PlanetProps {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  moons?: MoonDef[];
  hasRings?: boolean;
  ringColor?: string;
}

const PLANET_GEO = new THREE.SphereGeometry(1, 12, 12);
const MOON_GEO = new THREE.SphereGeometry(1, 8, 8);
const SUN_GEO = new THREE.SphereGeometry(1.5, 20, 20);
const RING_GEO = new THREE.RingGeometry(1.4, 2.2, 32);
RING_GEO.rotateX(-Math.PI / 2);

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

function MoonOrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: "#475569", transparent: true, opacity: 0.15 });
    return new THREE.Line(geo, mat);
  }, [radius]);

  return <primitive object={line} />;
}

function Moon({ radius, orbitRadius, speed, color }: MoonDef) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.x = Math.cos(t) * orbitRadius;
    ref.current.position.z = Math.sin(t) * orbitRadius;
  });

  return (
    <>
      <MoonOrbitRing radius={orbitRadius} />
      <mesh ref={ref} geometry={MOON_GEO} scale={radius}>
        <meshBasicMaterial color={color} />
      </mesh>
    </>
  );
}

function Planet({ radius, orbitRadius, speed, color, moons, hasRings, ringColor }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    groupRef.current.position.x = Math.cos(t) * orbitRadius;
    groupRef.current.position.z = Math.sin(t) * orbitRadius;
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <group ref={groupRef}>
        <mesh geometry={PLANET_GEO} scale={radius}>
          <meshBasicMaterial color={color} />
        </mesh>
        {hasRings && (
          <mesh geometry={RING_GEO} scale={radius}>
            <meshBasicMaterial
              color={ringColor || "#d4a574"}
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>
        )}
        {moons?.map((moon, i) => (
          <Moon key={i} {...moon} />
        ))}
      </group>
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
      <mesh geometry={SUN_GEO}>
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Mercury */}
      <Planet radius={0.2} orbitRadius={3.5} speed={0.8} color="#94a3b8" />

      {/* Venus */}
      <Planet radius={0.3} orbitRadius={5} speed={0.6} color="#fbbf24" />

      {/* Earth + Moon */}
      <Planet
        radius={0.3}
        orbitRadius={7}
        speed={0.5}
        color="#3b82f6"
        moons={[
          { radius: 0.08, orbitRadius: 0.7, speed: 2.5, color: "#d1d5db" },
        ]}
      />

      {/* Mars + Phobos & Deimos */}
      <Planet
        radius={0.22}
        orbitRadius={9}
        speed={0.4}
        color="#ef4444"
        moons={[
          { radius: 0.05, orbitRadius: 0.5, speed: 3.0, color: "#a8a29e" },
          { radius: 0.04, orbitRadius: 0.75, speed: 2.0, color: "#d6d3d1" },
        ]}
      />

      {/* Jupiter + 4 Galilean moons */}
      <Planet
        radius={0.5}
        orbitRadius={11}
        speed={0.25}
        color="#c084fc"
        moons={[
          { radius: 0.06, orbitRadius: 0.9, speed: 3.5, color: "#fcd34d" },
          { radius: 0.07, orbitRadius: 1.2, speed: 2.5, color: "#e2e8f0" },
          { radius: 0.08, orbitRadius: 1.5, speed: 1.8, color: "#94a3b8" },
          { radius: 0.06, orbitRadius: 1.85, speed: 1.3, color: "#67e8f9" },
        ]}
      />

      {/* Saturn + rings + Titan */}
      <Planet
        radius={0.45}
        orbitRadius={14}
        speed={0.18}
        color="#f97316"
        hasRings
        ringColor="#d4a574"
        moons={[
          { radius: 0.07, orbitRadius: 1.6, speed: 1.5, color: "#fbbf24" },
        ]}
      />

      {/* Neptune + Triton */}
      <Planet
        radius={0.28}
        orbitRadius={17}
        speed={0.12}
        color="#06b6d4"
        moons={[
          { radius: 0.06, orbitRadius: 0.7, speed: 2.0, color: "#a5b4fc" },
        ]}
      />
    </group>
  );
}

export default function SolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 12, 20], fov: 60 }}
        style={{ background: "#020617" }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <StaticStars />
        <SolarSystemScene />
      </Canvas>
    </div>
  );
}
