"use client";

import { useRef, useMemo, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { PLANET_DEFS, type PlanetDef } from "@/data/planets";
import ContentDrawer from "./ContentDrawer";

/* ── Shared geometries ── */
const SPHERE_GEO = new THREE.SphereGeometry(1, 24, 24);
const CLOUD_GEO = new THREE.SphereGeometry(1.015, 24, 24);
const ATMO_GEO = new THREE.SphereGeometry(1.06, 24, 24);
const SUN_GEO = new THREE.SphereGeometry(1.5, 24, 24);
const SUN_GLOW_GEO = new THREE.SphereGeometry(2.2, 16, 16);
const HIGHLIGHT_GEO = new THREE.SphereGeometry(1, 16, 16);

const RING_GEO = (() => {
  const inner = 1.4,
    outer = 2.2;
  const geo = new THREE.RingGeometry(inner, outer, 64);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i),
      y = pos.getY(i);
    uv.setXY(
      i,
      (Math.sqrt(x * x + y * y) - inner) / (outer - inner),
      0.5
    );
  }
  geo.rotateX(-Math.PI / 2);
  return geo;
})();

/* ── Shared materials ── */
const ORBIT_MAT = new THREE.LineBasicMaterial({
  color: "#334155",
  transparent: true,
  opacity: 0.25,
});
const SUN_MAT = new THREE.MeshBasicMaterial({ color: "#FDB813" });
const SUN_GLOW_MAT = new THREE.MeshBasicMaterial({
  color: "#FDB813",
  transparent: true,
  opacity: 0.06,
  side: THREE.BackSide,
});
const ATMO_MAT = new THREE.MeshBasicMaterial({
  color: "#4488ff",
  transparent: true,
  opacity: 0.1,
  side: THREE.BackSide,
});
const STAR_MAT = new THREE.PointsMaterial({
  color: "#ffffff",
  size: 0.8,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.7,
});
const MOON_GEO = new THREE.SphereGeometry(1, 12, 12);

/* ── Moon definitions per planet ── */
interface MoonDef {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  initialAngle: number;
  tilt?: number;
}

const PLANET_MOONS: Record<string, MoonDef[]> = {
  earth: [
    { name: "Luna", radius: 0.07, orbitRadius: 0.7, speed: 0.6, color: "#c8c8c8", initialAngle: 0 },
  ],
  mars: [
    { name: "Phobos", radius: 0.035, orbitRadius: 0.5, speed: 1.2, color: "#a08060", initialAngle: 0 },
    { name: "Deimos", radius: 0.025, orbitRadius: 0.7, speed: 0.7, color: "#b09070", initialAngle: Math.PI },
  ],
  jupiter: [
    { name: "Io", radius: 0.06, orbitRadius: 1.0, speed: 0.9, color: "#e8d050", initialAngle: 0 },
    { name: "Europa", radius: 0.055, orbitRadius: 1.3, speed: 0.7, color: "#d0ccc0", initialAngle: Math.PI * 0.5 },
    { name: "Ganymede", radius: 0.07, orbitRadius: 1.6, speed: 0.5, color: "#a09880", initialAngle: Math.PI },
    { name: "Callisto", radius: 0.065, orbitRadius: 1.9, speed: 0.35, color: "#706858", initialAngle: Math.PI * 1.5 },
  ],
  saturn: [
    { name: "Titan", radius: 0.08, orbitRadius: 1.8, speed: 0.4, color: "#d0a840", initialAngle: 0, tilt: 0.3 },
    { name: "Enceladus", radius: 0.035, orbitRadius: 1.3, speed: 0.8, color: "#f0f0ff", initialAngle: Math.PI * 0.7 },
    { name: "Mimas", radius: 0.03, orbitRadius: 1.1, speed: 1.0, color: "#c0c0c0", initialAngle: Math.PI * 1.3 },
  ],
  neptune: [
    { name: "Triton", radius: 0.06, orbitRadius: 0.7, speed: -0.5, color: "#8090b0", initialAngle: 0, tilt: 0.5 },
  ],
};

/* ── Orbit ring ── */
function OrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)
      );
    }
    const l = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      ORBIT_MAT
    );
    l.matrixAutoUpdate = false;
    l.updateMatrix();
    return l;
  }, [radius]);
  return <primitive object={line} />;
}

/* ── Background stars ── */
function Stars() {
  const geo = useMemo(() => {
    const positions = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return <points geometry={geo} material={STAR_MAT} />;
}

/* ── Sun ── */
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

/* ── Selection highlight shell ── */
function Highlight({
  scale,
  active,
}: {
  scale: number;
  active: boolean;
}) {
  return (
    <mesh geometry={HIGHLIGHT_GEO} scale={scale * 1.4}>
      <meshBasicMaterial
        color={active ? "#60a5fa" : "#94a3b8"}
        transparent
        opacity={active ? 0.2 : 0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

/* ── Moon ── */
function Moon({ moon }: { moon: MoonDef }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = moon.initialAngle + t * moon.speed;
    const y = moon.tilt ? Math.sin(angle) * moon.tilt * moon.orbitRadius * 0.3 : 0;
    ref.current.position.set(
      Math.cos(angle) * moon.orbitRadius,
      y,
      Math.sin(angle) * moon.orbitRadius
    );
  });
  return (
    <mesh ref={ref} geometry={MOON_GEO} scale={moon.radius}>
      <meshStandardMaterial color={moon.color} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

/* ── Moons group for a planet ── */
function PlanetMoons({ planetId }: { planetId: string }) {
  const moons = PLANET_MOONS[planetId];
  if (!moons) return null;
  return (
    <>
      {moons.map((m) => (
        <Moon key={m.name} moon={m} />
      ))}
    </>
  );
}

/* ── Generic interactive planet ── */
function InteractivePlanet({
  def,
  positionsRef,
  activePlanet,
  onPlanetClick,
}: {
  def: PlanetDef;
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
  activePlanet: string | null;
  onPlanetClick: (id: string) => void;
}) {
  const texture = useTexture(def.texturePath);
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const isActive = activePlanet === def.id;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = def.initialAngle + t * def.orbitalSpeed;
    groupRef.current.position.set(
      Math.cos(angle) * def.orbitRadius,
      0,
      Math.sin(angle) * def.orbitRadius
    );
    meshRef.current.rotation.y = t * def.rotationSpeed;
    const stored = positionsRef.current.get(def.id);
    if (stored) stored.copy(groupRef.current.position);
  });

  return (
    <>
      <OrbitRing radius={def.orbitRadius} />
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          geometry={SPHERE_GEO}
          scale={hovered ? def.radius * 1.1 : def.radius}
          onClick={(e) => {
            e.stopPropagation();
            onPlanetClick(def.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
        </mesh>
        {(isActive || hovered) && (
          <Highlight scale={def.radius} active={isActive} />
        )}
        <PlanetMoons planetId={def.id} />
      </group>
    </>
  );
}

/* ── Earth (day map + cloud layer + atmosphere) ── */
function InteractiveEarth({
  positionsRef,
  activePlanet,
  onPlanetClick,
}: {
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
  activePlanet: string | null;
  onPlanetClick: (id: string) => void;
}) {
  const [dayMap, cloudMap] = useTexture([
    "/textures/2k_earth_daymap.jpg",
    "/textures/2k_earth_clouds.jpg",
  ]);
  const groupRef = useRef<THREE.Group>(null!);
  const earthRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const isActive = activePlanet === "earth";
  const def = PLANET_DEFS.find((p) => p.id === "earth")!;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = def.initialAngle + t * def.orbitalSpeed;
    groupRef.current.position.set(
      Math.cos(angle) * def.orbitRadius,
      0,
      Math.sin(angle) * def.orbitRadius
    );
    earthRef.current.rotation.y = t * 0.1;
    cloudRef.current.rotation.y = t * 0.13;
    const stored = positionsRef.current.get("earth");
    if (stored) stored.copy(groupRef.current.position);
  });

  const scale = hovered ? def.radius * 1.1 : def.radius;

  return (
    <>
      <OrbitRing radius={def.orbitRadius} />
      <group ref={groupRef}>
        <mesh
          ref={earthRef}
          geometry={SPHERE_GEO}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            onPlanetClick("earth");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <meshStandardMaterial map={dayMap} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh ref={cloudRef} geometry={CLOUD_GEO} scale={scale}>
          <meshStandardMaterial
            map={cloudMap}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
        <mesh geometry={ATMO_GEO} material={ATMO_MAT} scale={scale} />
        {(isActive || hovered) && (
          <Highlight scale={def.radius} active={isActive} />
        )}
        <PlanetMoons planetId="earth" />
      </group>
    </>
  );
}

/* ── Saturn (body + ring) ── */
function InteractiveSaturn({
  positionsRef,
  activePlanet,
  onPlanetClick,
}: {
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
  activePlanet: string | null;
  onPlanetClick: (id: string) => void;
}) {
  const [saturnMap, ringMap] = useTexture([
    "/textures/2k_saturn.jpg",
    "/textures/2k_saturn_ring_alpha.png",
  ]);
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const isActive = activePlanet === "saturn";
  const def = PLANET_DEFS.find((p) => p.id === "saturn")!;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = def.initialAngle + t * def.orbitalSpeed;
    groupRef.current.position.set(
      Math.cos(angle) * def.orbitRadius,
      0,
      Math.sin(angle) * def.orbitRadius
    );
    meshRef.current.rotation.y = t * 0.06;
    const stored = positionsRef.current.get("saturn");
    if (stored) stored.copy(groupRef.current.position);
  });

  const scale = hovered ? def.radius * 1.1 : def.radius;

  return (
    <>
      <OrbitRing radius={def.orbitRadius} />
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          geometry={SPHERE_GEO}
          scale={scale}
          onClick={(e) => {
            e.stopPropagation();
            onPlanetClick("saturn");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <meshStandardMaterial
            map={saturnMap}
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
        <mesh geometry={RING_GEO} scale={scale}>
          <meshBasicMaterial
            map={ringMap}
            transparent
            side={THREE.DoubleSide}
            opacity={0.7}
          />
        </mesh>
        {(isActive || hovered) && (
          <Highlight scale={def.radius} active={isActive} />
        )}
        <PlanetMoons planetId="saturn" />
      </group>
    </>
  );
}

/* ── Easing function ── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── Warp speed lines ── */
const WARP_COUNT = 180;

function WarpTunnel({
  warpRef,
}: {
  warpRef: React.MutableRefObject<{ active: boolean; progress: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const matRef = useRef<THREE.LineBasicMaterial>(null!);
  const { camera } = useThree();

  const { geo, baseZ } = useMemo(() => {
    const positions = new Float32Array(WARP_COUNT * 6);
    const zArr = new Float32Array(WARP_COUNT);
    for (let i = 0; i < WARP_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 7;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const z = (Math.random() - 0.5) * 40;
      zArr[i] = z;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z + 0.05;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo: g, baseZ: zArr };
  }, []);

  useFrame(() => {
    if (!groupRef.current || !matRef.current) return;
    const { active, progress } = warpRef.current;

    if (!active) {
      matRef.current.opacity = 0;
      return;
    }

    const fade =
      progress < 0.15
        ? progress / 0.15
        : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;
    matRef.current.opacity = fade * 0.6;

    const stretch = Math.sin(progress * Math.PI) * 8;
    const posArr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < WARP_COUNT; i++) {
      posArr[i * 6 + 5] = baseZ[i] + 0.05 + stretch;
    }
    geo.attributes.position.needsUpdate = true;

    groupRef.current.position.copy(camera.position);
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial
          ref={matRef}
          color="#7cb3ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

/* ── Camera controller (warp-enabled) ── */
const OVERVIEW_POS = new THREE.Vector3(0, 10, 15);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);
const BASE_FOV = 70;
const WARP_FOV = 100;
const WARP_DURATION_MS = 900;

function CameraController({
  activePlanet,
  positionsRef,
  controlsRef,
  warpRef,
  onWarpPeak,
}: {
  activePlanet: string | null;
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
  controlsRef: React.MutableRefObject<any>;
  warpRef: React.MutableRefObject<{ active: boolean; progress: number }>;
  onWarpPeak: () => void;
}) {
  const { camera } = useThree();
  const targetPos = useRef(OVERVIEW_POS.clone());
  const targetLookAt = useRef(OVERVIEW_TARGET.clone());
  const currentLookAt = useRef(OVERVIEW_TARGET.clone());
  const lerpSpeed = 0.03;
  const isSettled = useRef(true);

  const prevPlanet = useRef<string | null>(null);
  const isInWarp = useRef(false);
  const warpStart = useRef(0);
  const warpPeakFired = useRef(false);
  const warpStartPos = useRef(new THREE.Vector3());
  const warpStartLookAt = useRef(new THREE.Vector3());
  const warpTargetPos = useRef(new THREE.Vector3());
  const warpTargetLookAt = useRef(new THREE.Vector3());

  const computePlanetCamera = useCallback(
    (planetId: string) => {
      const planetPos = positionsRef.current.get(planetId);
      if (!planetPos) return null;
      const dir = new THREE.Vector3(planetPos.x, 0, planetPos.z).normalize();
      if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
      const perp = new THREE.Vector3(-dir.z, 0, dir.x);
      return {
        camPos: new THREE.Vector3(
          planetPos.x + perp.x * 4,
          2.5,
          planetPos.z + perp.z * 4
        ),
        lookAt: planetPos.clone(),
      };
    },
    [positionsRef]
  );

  useEffect(() => {
    if (activePlanet && activePlanet !== prevPlanet.current) {
      warpStartPos.current.copy(camera.position);
      warpStartLookAt.current.copy(currentLookAt.current);
      isInWarp.current = true;
      warpStart.current = performance.now();
      warpPeakFired.current = false;
      warpRef.current.active = true;
      warpRef.current.progress = 0;
      isSettled.current = false;
      if (controlsRef.current) controlsRef.current.enabled = false;
    } else if (!activePlanet) {
      isInWarp.current = false;
      warpRef.current.active = false;
      warpRef.current.progress = 0;
    }
    prevPlanet.current = activePlanet;
  }, [activePlanet, controlsRef, warpRef, camera]);

  useFrame(() => {
    if (isInWarp.current && activePlanet) {
      const elapsed = performance.now() - warpStart.current;
      const t = Math.min(elapsed / WARP_DURATION_MS, 1);
      warpRef.current.progress = t;

      // Recompute target each frame (planet is orbiting)
      const target = computePlanetCamera(activePlanet);
      if (target) {
        warpTargetPos.current.copy(target.camPos);
        warpTargetLookAt.current.copy(target.lookAt);
      }

      // FOV: rises to peak at t=0.4, returns by t=1
      const fovT = t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6;
      const fov = BASE_FOV + (WARP_FOV - BASE_FOV) * Math.sin(fovT * Math.PI * 0.5);
      (camera as THREE.PerspectiveCamera).fov = fov;
      (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

      // Flash at peak
      if (t >= 0.35 && !warpPeakFired.current) {
        warpPeakFired.current = true;
        onWarpPeak();
      }

      // Camera position: easeInOutCubic interpolation
      const eased = easeInOutCubic(t);
      camera.position.lerpVectors(
        warpStartPos.current,
        warpTargetPos.current,
        eased
      );
      currentLookAt.current.lerpVectors(
        warpStartLookAt.current,
        warpTargetLookAt.current,
        eased
      );
      camera.lookAt(currentLookAt.current);

      if (t >= 1) {
        isInWarp.current = false;
        warpRef.current.active = false;
        warpRef.current.progress = 0;
        (camera as THREE.PerspectiveCamera).fov = BASE_FOV;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        targetPos.current.copy(warpTargetPos.current);
        targetLookAt.current.copy(warpTargetLookAt.current);
      }
    } else if (activePlanet) {
      const planetPos = positionsRef.current.get(activePlanet);
      if (planetPos) {
        const dir = new THREE.Vector3(planetPos.x, 0, planetPos.z).normalize();
        if (dir.lengthSq() < 0.001) dir.set(0, 0, 1);
        const perp = new THREE.Vector3(-dir.z, 0, dir.x);
        targetPos.current.set(
          planetPos.x + perp.x * 4,
          2.5,
          planetPos.z + perp.z * 4
        );
        targetLookAt.current.copy(planetPos);
      }
      camera.position.lerp(targetPos.current, lerpSpeed);
      currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
      camera.lookAt(currentLookAt.current);
    } else if (!isSettled.current) {
      targetPos.current.copy(OVERVIEW_POS);
      targetLookAt.current.copy(OVERVIEW_TARGET);
      camera.position.lerp(targetPos.current, lerpSpeed);
      currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
      camera.lookAt(currentLookAt.current);

      if (camera.position.distanceTo(OVERVIEW_POS) < 0.2) {
        isSettled.current = true;
        if (controlsRef.current) {
          controlsRef.current.target.copy(OVERVIEW_TARGET);
          controlsRef.current.enabled = true;
          controlsRef.current.update();
        }
      }
    }
  });

  return null;
}

/* ── Planet label (drei Html) ── */
function PlanetLabel({
  def,
  positionsRef,
  onPlanetClick,
  activePlanet,
}: {
  def: PlanetDef;
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
  onPlanetClick: (id: string) => void;
  activePlanet: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const isActive = activePlanet === def.id;

  useFrame(() => {
    const pos = positionsRef.current.get(def.id);
    if (pos && groupRef.current) {
      groupRef.current.position.set(
        pos.x,
        pos.y + def.radius * 2 + 0.4,
        pos.z
      );
    }
  });

  if (activePlanet) return null;

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={12} style={{ pointerEvents: "auto" }}>
        <button
          onClick={() => onPlanetClick(def.id)}
          className={`
            flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg
            transition-all duration-200 select-none whitespace-nowrap
            ${
              isActive
                ? "bg-blue-500/20 border border-blue-400/50 scale-110"
                : "bg-slate-900/60 border border-slate-700/30 hover:bg-slate-800/60 hover:border-blue-400/30"
            }
          `}
        >
          <span
            className={`text-xs font-bold ${
              isActive ? "text-blue-300" : "text-white/90"
            }`}
          >
            {def.sectionLabel}
          </span>
          <span className="text-[10px] text-slate-400">{def.name}</span>
        </button>
      </Html>
    </group>
  );
}

/* ── Full interactive scene ── */
const SPECIAL_PLANETS = new Set(["earth", "saturn"]);

function InteractiveScene({
  activePlanet,
  onPlanetClick,
  positionsRef,
}: {
  activePlanet: string | null;
  onPlanetClick: (id: string) => void;
  positionsRef: React.MutableRefObject<Map<string, THREE.Vector3>>;
}) {
  const genericPlanets = useMemo(
    () => PLANET_DEFS.filter((p) => !SPECIAL_PLANETS.has(p.id)),
    []
  );

  return (
    <>
      <ambientLight intensity={0.15} />
      <Sun />

      {genericPlanets.map((def) => (
        <InteractivePlanet
          key={def.id}
          def={def}
          positionsRef={positionsRef}
          activePlanet={activePlanet}
          onPlanetClick={onPlanetClick}
        />
      ))}

      <InteractiveEarth
        positionsRef={positionsRef}
        activePlanet={activePlanet}
        onPlanetClick={onPlanetClick}
      />

      <InteractiveSaturn
        positionsRef={positionsRef}
        activePlanet={activePlanet}
        onPlanetClick={onPlanetClick}
      />

      {PLANET_DEFS.map((def) => (
        <PlanetLabel
          key={`label-${def.id}`}
          def={def}
          positionsRef={positionsRef}
          onPlanetClick={onPlanetClick}
          activePlanet={activePlanet}
        />
      ))}
    </>
  );
}

/* ── Preload textures ── */
if (typeof window !== "undefined") {
  PLANET_DEFS.forEach((def) => useTexture.preload(def.texturePath));
  useTexture.preload("/textures/2k_earth_clouds.jpg");
  useTexture.preload("/textures/2k_saturn_ring_alpha.png");
}

/* ── Main export ── */
export default function GalaxyExplorer() {
  const [activePlanet, setActivePlanet] = useState<string | null>(null);
  const positionsRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const warpRef = useRef({ active: false, progress: 0 });

  // Initialize position vectors (avoid GC)
  useEffect(() => {
    PLANET_DEFS.forEach((def) => {
      if (!positionsRef.current.has(def.id)) {
        positionsRef.current.set(def.id, new THREE.Vector3());
      }
    });
  }, []);

  // IntersectionObserver — pause canvas when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listen for navbar planet navigation events
  useEffect(() => {
    const handler = (e: Event) => {
      setActivePlanet((e as CustomEvent<string>).detail);
    };
    window.addEventListener("navigate-planet", handler);
    return () => window.removeEventListener("navigate-planet", handler);
  }, []);

  // Escape key closes drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePlanet(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const controlsRef = useRef<any>(null);

  const handlePlanetClick = useCallback((id: string) => {
    setActivePlanet((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setActivePlanet(null);
  }, []);

  const handleWarpPeak = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 250);
  }, []);

  return (
    <section ref={containerRef} id="explore" className="relative h-screen w-full">
      <Canvas
        camera={{ position: [0, 10, 15], fov: 70 }}
        style={{ background: "#020617" }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
        }}
        frameloop={visible ? "always" : "never"}
      >
        <Stars />
        <Suspense fallback={null}>
          <InteractiveScene
            activePlanet={activePlanet}
            onPlanetClick={handlePlanetClick}
            positionsRef={positionsRef}
          />
          <WarpTunnel warpRef={warpRef} />
          <CameraController
            activePlanet={activePlanet}
            positionsRef={positionsRef}
            controlsRef={controlsRef}
            warpRef={warpRef}
            onWarpPeak={handleWarpPeak}
          />
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={28}
            minPolarAngle={Math.PI * 0.15}
            maxPolarAngle={Math.PI * 0.45}
            autoRotate={!activePlanet}
            autoRotateSpeed={0.3}
            mouseButtons={{ LEFT: undefined as any, MIDDLE: undefined as any, RIGHT: THREE.MOUSE.ROTATE }}
            touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
          />
        </Suspense>
      </Canvas>

      {/* Warp flash overlay */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            key="warp-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute inset-0 z-20 bg-blue-400/30 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Console-style intro hint */}
      <AnimatePresence>
        {!activePlanet && visible && (
          <motion.div
            key="explore-hint"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 4, duration: 1.5 }}
              className="text-center"
            >
              <p className="font-mono text-lg md:text-2xl text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                <span className="text-green-500/70">&gt; </span>
                Click on a planet to explore
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block ml-1 w-[2px] h-5 md:h-6 bg-green-400 align-middle"
                />
              </p>
              <p className="font-mono text-xs md:text-sm text-slate-500 mt-2">
                scroll to zoom • right-click to rotate
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content drawer */}
      <ContentDrawer activePlanet={activePlanet} onClose={handleClose} />
    </section>
  );
}
