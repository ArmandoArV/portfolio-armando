"use client";

// Planet textures: Solar System Scope (solarsystemscope.com/textures) — CC BY 4.0

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// ── Shared geometries ──
const SPHERE_GEO = new THREE.SphereGeometry(1, 24, 24);
const MOON_GEO = new THREE.SphereGeometry(1, 10, 10);
const SUN_GEO = new THREE.SphereGeometry(1.5, 24, 24);
const SUN_GLOW_GEO = new THREE.SphereGeometry(2.2, 16, 16);
const CLOUD_GEO = new THREE.SphereGeometry(1.015, 24, 24);
const ATMO_GEO = new THREE.SphereGeometry(1.06, 24, 24);

// Saturn ring with UVs remapped for strip texture
const RING_GEO = (() => {
  const inner = 1.4, outer = 2.2;
  const geo = new THREE.RingGeometry(inner, outer, 64);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    uv.setXY(i, (Math.sqrt(x * x + y * y) - inner) / (outer - inner), 0.5);
  }
  geo.rotateX(-Math.PI / 2);
  return geo;
})();

// ── Shared materials ──
const ORBIT_MAT = new THREE.LineBasicMaterial({ color: "#334155", transparent: true, opacity: 0.2 });
const MOON_ORBIT_MAT = new THREE.LineBasicMaterial({ color: "#475569", transparent: true, opacity: 0.15 });
const STAR_MAT = new THREE.PointsMaterial({ color: "#ffffff", size: 0.8, sizeAttenuation: true, transparent: true, opacity: 0.7 });
const SUN_MAT = new THREE.MeshBasicMaterial({ color: "#FDB813" });
const SUN_GLOW_MAT = new THREE.MeshBasicMaterial({ color: "#FDB813", transparent: true, opacity: 0.06, side: THREE.BackSide });
const ATMO_MAT = new THREE.MeshBasicMaterial({ color: "#4488ff", transparent: true, opacity: 0.1, side: THREE.BackSide });

const moonMatCache = new Map<string, THREE.MeshStandardMaterial>();
function getMoonMat(color: string) {
  let m = moonMatCache.get(color);
  if (!m) { m = new THREE.MeshStandardMaterial({ color, roughness: 0.8 }); moonMatCache.set(color, m); }
  return m;
}

// ── Texture paths ──
const TX = {
  mercury: "/textures/2k_mercury.jpg",
  venus: "/textures/2k_venus_surface.jpg",
  earth: "/textures/2k_earth_daymap.jpg",
  earthClouds: "/textures/2k_earth_clouds.jpg",
  mars: "/textures/2k_mars.jpg",
  jupiter: "/textures/2k_jupiter.jpg",
  saturn: "/textures/2k_saturn.jpg",
  saturnRing: "/textures/2k_saturn_ring_alpha.png",
  neptune: "/textures/2k_neptune.jpg",
};

if (typeof window !== "undefined") {
  Object.values(TX).forEach((url) => useTexture.preload(url));
}

// ── Types ──
interface MoonDef { radius: number; orbitRadius: number; speed: number; color: string }

// ── Orbit rings (static, matrixAutoUpdate=false) ──
function OrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ORBIT_MAT);
    l.matrixAutoUpdate = false;
    l.updateMatrix();
    return l;
  }, [radius]);
  return <primitive object={line} />;
}

function MoonOrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), MOON_ORBIT_MAT);
    l.matrixAutoUpdate = false;
    l.updateMatrix();
    return l;
  }, [radius]);
  return <primitive object={line} />;
}

// ── Moon (tiny, no texture needed) ──
function Moon({ radius, orbitRadius, speed, color }: MoonDef) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.position.set(Math.cos(t) * orbitRadius, 0, Math.sin(t) * orbitRadius);
  });
  return (
    <>
      <MoonOrbitRing radius={orbitRadius} />
      <mesh ref={ref} geometry={MOON_GEO} material={getMoonMat(color)} scale={radius} />
    </>
  );
}

// ── Generic textured planet ──
function TexturedPlanet({
  texturePath, radius, orbitRadius, orbitalSpeed, rotationSpeed, moons,
}: {
  texturePath: string; radius: number; orbitRadius: number;
  orbitalSpeed: number; rotationSpeed: number; moons?: MoonDef[];
}) {
  const texture = useTexture(texturePath);
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.set(Math.cos(t * orbitalSpeed) * orbitRadius, 0, Math.sin(t * orbitalSpeed) * orbitRadius);
    meshRef.current.rotation.y = t * rotationSpeed;
  });

  return (
    <>
      <OrbitRing radius={orbitRadius} />
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={SPHERE_GEO} scale={radius}>
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
        </mesh>
        {moons?.map((moon, i) => <Moon key={i} {...moon} />)}
      </group>
    </>
  );
}

// ── Earth: day map + cloud layer + atmosphere glow ──
function Earth() {
  const [dayMap, cloudMap] = useTexture([TX.earth, TX.earthClouds]);
  const groupRef = useRef<THREE.Group>(null!);
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.set(Math.cos(t * 0.5) * 7, 0, Math.sin(t * 0.5) * 7);
    earthRef.current.rotation.y = t * 0.1;
    cloudRef.current.rotation.y = t * 0.13;
  });

  return (
    <>
      <OrbitRing radius={7} />
      <group ref={groupRef}>
        <mesh ref={earthRef} geometry={SPHERE_GEO} scale={0.3}>
          <meshStandardMaterial map={dayMap} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh ref={cloudRef} geometry={CLOUD_GEO} scale={0.3}>
          <meshStandardMaterial map={cloudMap} transparent opacity={0.35} depthWrite={false} />
        </mesh>
        <mesh geometry={ATMO_GEO} material={ATMO_MAT} scale={0.3} />
        <Moon radius={0.08} orbitRadius={0.7} speed={2.5} color="#d1d5db" />
      </group>
    </>
  );
}

// ── Saturn: textured body + ring with alpha strip ──
function Saturn() {
  const [saturnMap, ringMap] = useTexture([TX.saturn, TX.saturnRing]);
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.set(Math.cos(t * 0.18) * 14, 0, Math.sin(t * 0.18) * 14);
    meshRef.current.rotation.y = t * 0.06;
  });

  return (
    <>
      <OrbitRing radius={14} />
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={SPHERE_GEO} scale={0.45}>
          <meshStandardMaterial map={saturnMap} roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh geometry={RING_GEO} scale={0.45}>
          <meshBasicMaterial map={ringMap} transparent side={THREE.DoubleSide} opacity={0.7} />
        </mesh>
        <Moon radius={0.07} orbitRadius={1.6} speed={1.5} color="#fbbf24" />
      </group>
    </>
  );
}

// ── Sun: emissive body + pulsing glow halo + point light ──
function Sun() {
  const sunRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    sunRef.current.rotation.y = t * 0.02;
    glowRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.04);
  });

  return (
    <>
      <mesh ref={sunRef} geometry={SUN_GEO} material={SUN_MAT} />
      <mesh ref={glowRef} geometry={SUN_GLOW_GEO} material={SUN_GLOW_MAT} />
      <pointLight position={[0, 0, 0]} intensity={2} decay={0} color="#fff5e0" />
    </>
  );
}

// ── Background stars ──
function StaticStars() {
  const geo = useMemo(() => {
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return <points geometry={geo} material={STAR_MAT} />;
}

// ── Full textured scene ──
function TexturedScene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1 + 0.3;
  });

  return (
    <group ref={groupRef} position={[0, -8, -5]}>
      <ambientLight intensity={0.15} />
      <Sun />

      <TexturedPlanet texturePath={TX.mercury}
        radius={0.2} orbitRadius={3.5} orbitalSpeed={0.8} rotationSpeed={0.05} />

      <TexturedPlanet texturePath={TX.venus}
        radius={0.3} orbitRadius={5} orbitalSpeed={0.6} rotationSpeed={-0.03} />

      <Earth />

      <TexturedPlanet texturePath={TX.mars}
        radius={0.22} orbitRadius={9} orbitalSpeed={0.4} rotationSpeed={0.09}
        moons={[
          { radius: 0.05, orbitRadius: 0.5, speed: 3.0, color: "#a8a29e" },
          { radius: 0.04, orbitRadius: 0.75, speed: 2.0, color: "#d6d3d1" },
        ]} />

      <TexturedPlanet texturePath={TX.jupiter}
        radius={0.5} orbitRadius={11} orbitalSpeed={0.25} rotationSpeed={0.15}
        moons={[
          { radius: 0.06, orbitRadius: 0.9, speed: 3.5, color: "#fcd34d" },
          { radius: 0.07, orbitRadius: 1.2, speed: 2.5, color: "#e2e8f0" },
          { radius: 0.08, orbitRadius: 1.5, speed: 1.8, color: "#94a3b8" },
          { radius: 0.06, orbitRadius: 1.85, speed: 1.3, color: "#67e8f9" },
        ]} />

      <Saturn />

      <TexturedPlanet texturePath={TX.neptune}
        radius={0.28} orbitRadius={17} orbitalSpeed={0.12} rotationSpeed={0.12}
        moons={[{ radius: 0.06, orbitRadius: 0.7, speed: 2.0, color: "#a5b4fc" }]} />
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
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 12, 20], fov: 60 }}
        style={{ background: "#020617", pointerEvents: "none" }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false, depth: true }}
        frameloop={visible ? "always" : "never"}
      >
        <StaticStars />
        <Suspense fallback={null}>
          <TexturedScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
