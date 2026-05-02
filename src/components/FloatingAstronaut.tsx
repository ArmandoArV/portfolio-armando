"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────── Constants ─────────────────── */

const SUIT_COLOR = 0xeaeaea;
const JOINT_COLOR = 0x555555;
const VISOR_COLOR = 0x4fc3f7;
const ACCENT_COLOR = 0xc62828;
const HULL_COLOR = 0xe8e4e0;
const HULL_DARK = 0x71717a;
const TETHER_COLOR = 0xffcc00;

const SHIP_ORBIT_RADIUS = 1.8;
const SHIP_ORBIT_CENTER = new THREE.Vector3(0, 1.5, 0);
const SHIP_ORBIT_SPEED = 0.15;
const REST_POS = new THREE.Vector3(0, -0.5, 0);
const SPRING_K = 3.5;
const DAMPING = 0.88;
const MAX_TETHER = 3.5;

/* ─────────────────── Hail Mary Spaceship ─────────────────── */

function Spaceship({ issPos }: { issPos: React.RefObject<THREE.Vector3> }) {
  const ref = useRef<THREE.Group>(null!);
  const glowRef1 = useRef<THREE.Mesh>(null!);
  const glowRef2 = useRef<THREE.Mesh>(null!);
  const glowRef3 = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    // Orbit in a circle
    const angle = t * SHIP_ORBIT_SPEED;
    const x = SHIP_ORBIT_CENTER.x + Math.cos(angle) * SHIP_ORBIT_RADIUS;
    const y = SHIP_ORBIT_CENTER.y + Math.sin(angle * 0.6) * 0.4;
    const z = Math.sin(angle) * 0.5;

    ref.current.position.set(x, y, z);
    issPos.current.set(x, y, z);

    // Face direction of travel
    ref.current.rotation.y = -angle + Math.PI / 2;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.02;

    // Pulse astrophage glow on fuel pods
    const pulse = 1.2 + Math.sin(t * 8) * 0.4;
    [glowRef1, glowRef2, glowRef3].forEach((r) => {
      if (r.current) {
        (r.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
      }
    });
  });

  // Three fuel pod positions (triangle arrangement)
  const podOffsets: [number, number][] = [
    [0, 0.35],       // top
    [-0.3, -0.18],   // bottom-left
    [0.3, -0.18],    // bottom-right
  ];
  const glowRefs = [glowRef1, glowRef2, glowRef3];

  return (
    <group ref={ref} position={[SHIP_ORBIT_CENTER.x + SHIP_ORBIT_RADIUS, SHIP_ORBIT_CENTER.y, 0]} scale={0.2}>
      {/* Ship lighting */}
      <pointLight position={[0, 1, 3]} intensity={2} color={0xffffff} distance={6} decay={2} />
      <pointLight position={[-3, 0, 0]} intensity={0.6} color={0xffdd44} distance={4} decay={2} />

      {/* ── Rear cone / spin drive section ── */}
      <mesh position={[-2.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.8, 1.8, 24]} />
        <meshStandardMaterial color={HULL_COLOR} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Ribbed texture on cone (rings) */}
      {[-1.6, -1.8, -2.0, -2.2, -2.5, -2.7].map((x, i) => (
        <mesh key={`ring-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35 + i * 0.06, 0.012, 8, 24]} />
          <meshStandardMaterial color={HULL_DARK} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Spin drive sail (flat panel behind ship) ── */}
      <mesh position={[-3.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.12, 3.2, 0.02]} />
        <meshStandardMaterial color={0x999999} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Sail ladder rungs */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`rung-${i}`} position={[-3.4, -1.4 + i * 0.25, 0]}>
          <boxGeometry args={[0.015, 0.015, 0.12]} />
          <meshStandardMaterial color={0x777777} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Three cylindrical fuel/crew pods ── */}
      {podOffsets.map(([py, pz], i) => (
        <group key={i} position={[0, py, pz]}>
          {/* Main pod body (long cylinder) */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 3.5, 16]} />
            <meshStandardMaterial color={HULL_COLOR} metalness={0.6} roughness={0.3} />
          </mesh>

          {/* Pod nose (rounded) */}
          <mesh position={[1.85, 0, 0]}>
            <sphereGeometry args={[0.16, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={HULL_COLOR} metalness={0.7} roughness={0.25} />
          </mesh>

          {/* Gold astrophage fuel bands */}
          <mesh ref={glowRefs[i]} position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.175, 0.175, 0.2, 16]} />
            <meshStandardMaterial color={0xdaa520} emissive={0xffaa00} emissiveIntensity={1.2} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.175, 0.175, 0.15, 16]} />
            <meshStandardMaterial color={0xdaa520} emissive={0xffaa00} emissiveIntensity={0.8} metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Panel segment rings */}
          {[-1.0, -0.1, 0.9, 1.4].map((x, j) => (
            <mesh key={j} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.165, 0.01, 8, 16]} />
              <meshStandardMaterial color={HULL_DARK} metalness={0.9} roughness={0.15} />
            </mesh>
          ))}

          {/* Pod end cap */}
          <mesh position={[-1.75, 0, 0]}>
            <sphereGeometry args={[0.165, 12, 8]} />
            <meshStandardMaterial color={HULL_DARK} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* ── Connecting struts between pods and cone ── */}
      {podOffsets.map(([py, pz], i) => (
        <mesh key={`strut-${i}`} position={[-1.2, py * 0.5, pz * 0.5]} rotation={[Math.atan2(pz, py), 0, 0.1]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
          <meshStandardMaterial color={HULL_DARK} metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Nav lights ── */}
      <mesh position={[1.9, 0.35, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={0xff3333} emissive={0xff3333} emissiveIntensity={3} />
      </mesh>
      <mesh position={[1.9, -0.18, -0.3]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={0x33ff33} emissive={0x33ff33} emissiveIntensity={3} />
      </mesh>
    </group>
  );
}

/* ─────────────────── Tether Cable ─────────────────── */

function Tether({ astronautPos, issPos }: { astronautPos: React.RefObject<THREE.Vector3>; issPos: React.RefObject<THREE.Vector3> }) {
  const lineRef = useRef<THREE.Line>(null!);
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  useEffect(() => {
    if (geoRef.current) {
      const positions = new Float32Array(20 * 3);
      geoRef.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    }
  }, []);

  useFrame(() => {
    if (!lineRef.current || !astronautPos.current || !geoRef.current || !issPos.current) return;

    const start = issPos.current.clone();
    start.y -= 0.15;
    const end = astronautPos.current.clone();
    end.y += 0.3;

    const mid = new THREE.Vector3(
      (start.x + end.x) / 2,
      Math.min(start.y, end.y) - start.distanceTo(end) * 0.15,
      (start.z + end.z) / 2
    );

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(19);

    const posAttr = geoRef.current.getAttribute("position") as THREE.BufferAttribute;
    if (posAttr) {
      for (let i = 0; i < points.length; i++) {
        posAttr.setXYZ(i, points[i].x, points[i].y, points[i].z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry ref={geoRef as any} />
      <lineBasicMaterial color={TETHER_COLOR} transparent opacity={0.8} />
    </line>
  );
}

/* ─────────────────── Draggable Astronaut ─────────────────── */

function Astronaut({
  mouse,
  posRef,
  isDragging,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  posRef: React.RefObject<THREE.Vector3>;
  isDragging: React.RefObject<boolean>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Group>(null!);
  const velocity = useRef(new THREE.Vector3());
  const wiggle = useRef(0);

  useFrame(({ clock }) => {
    if (!groupRef.current || !posRef.current) return;
    const t = clock.getElapsedTime();

    if (!isDragging.current) {
      // Spring physics: pull back toward rest position
      const dx = REST_POS.x - posRef.current.x;
      const dy = REST_POS.y - posRef.current.y;
      velocity.current.x += dx * SPRING_K * 0.016;
      velocity.current.y += dy * SPRING_K * 0.016;
      velocity.current.multiplyScalar(DAMPING);
      posRef.current.x += velocity.current.x * 0.016 * 60;
      posRef.current.y += velocity.current.y * 0.016 * 60;

      // Decay wiggle
      wiggle.current *= 0.95;
    } else {
      // While dragging, add wiggle intensity
      wiggle.current = Math.min(wiggle.current + 0.1, 2);
      velocity.current.set(0, 0, 0);
    }

    // Apply position with idle bob
    groupRef.current.position.x = posRef.current.x;
    groupRef.current.position.y = posRef.current.y + Math.sin(t * 0.8) * 0.05;
    groupRef.current.position.z = posRef.current.z;

    // Funny wiggle/tumble when being dragged or springing back
    const w = wiggle.current;
    groupRef.current.rotation.z = -0.2 + Math.sin(t * 8) * w * 0.15 + velocity.current.x * 0.3;
    groupRef.current.rotation.x = -0.3 + Math.sin(t * 6) * w * 0.1 + velocity.current.y * -0.2;
    groupRef.current.rotation.y = 0.2 + Math.sin(t * 0.3) * 0.1;

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
    <group ref={groupRef} scale={0.5}>
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
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={SUIT_COLOR} roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.15]}>
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
        <mesh position={[-0.1, 0, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={0x888888} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.1, 0, -0.06]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          <meshStandardMaterial color={0x888888} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Tether connection point */}
        <mesh position={[0, 0.25, -0.05]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={TETHER_COLOR} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ── Arms ── */}
      <AstronautArm side={-1} />
      <AstronautArm side={1} />

      {/* ── Legs ── */}
      <AstronautLeg side={-1} />
      <AstronautLeg side={1} />
    </group>
  );
}

/* ─────────────────── Arm / Leg Components ─────────────────── */

function AstronautArm({ side }: { side: number }) {
  const ref = useRef<THREE.Group>(null!);
  const forearmRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    if (side === -1) {
      ref.current.rotation.x = -0.8 + Math.sin(t * 0.4) * 0.08;
      ref.current.rotation.z = -0.6 + Math.sin(t * 0.5) * 0.05;
      if (forearmRef.current) {
        forearmRef.current.rotation.x = -0.5 + Math.sin(t * 0.6) * 0.06;
      }
    } else {
      ref.current.rotation.x = 0.3 + Math.sin(t * 0.35 + 1) * 0.06;
      ref.current.rotation.z = 0.5 + Math.sin(t * 0.45) * 0.04;
      if (forearmRef.current) {
        forearmRef.current.rotation.x = 0.6 + Math.sin(t * 0.5 + 0.5) * 0.05;
      }
    }
  });

  return (
    <group ref={ref} position={[side * 0.38, 0.15, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.08, 0.2, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={JOINT_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={forearmRef} position={[0, -0.3, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.07, 0.18, 4, 8]} />
          <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={JOINT_COLOR} roughness={0.5} metalness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function AstronautLeg({ side }: { side: number }) {
  const ref = useRef<THREE.Group>(null!);
  const shinRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();

    if (side === -1) {
      ref.current.rotation.x = 0.4 + Math.sin(t * 0.3) * 0.05;
      ref.current.rotation.z = -0.1;
      if (shinRef.current) {
        shinRef.current.rotation.x = -0.3 + Math.sin(t * 0.4 + 0.5) * 0.04;
      }
    } else {
      ref.current.rotation.x = 0.6 + Math.sin(t * 0.35 + 1) * 0.05;
      ref.current.rotation.z = 0.15;
      if (shinRef.current) {
        shinRef.current.rotation.x = -0.8 + Math.sin(t * 0.45 + 1) * 0.04;
      }
    }
  });

  return (
    <group ref={ref} position={[side * 0.16, -0.55, 0]}>
      <mesh position={[0, -0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.2, 4, 8]} />
        <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={JOINT_COLOR} metalness={0.8} roughness={0.2} />
      </mesh>
      <group ref={shinRef} position={[0, -0.25, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.09, 0.18, 4, 8]} />
          <meshStandardMaterial color={SUIT_COLOR} roughness={0.7} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.3, 0.04]}>
          <boxGeometry args={[0.16, 0.12, 0.22]} />
          <meshStandardMaterial color={JOINT_COLOR} roughness={0.4} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ─────────────────── Drag Handler ─────────────────── */

function DragPlane({
  posRef,
  isDragging,
  issPos,
}: {
  posRef: React.RefObject<THREE.Vector3>;
  isDragging: React.RefObject<boolean>;
  issPos: React.RefObject<THREE.Vector3>;
}) {
  const { camera } = useThree();
  const planeRef = useRef<THREE.Mesh>(null!);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
      isDragging.current = true;
    },
    [isDragging]
  );

  const handlePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!isDragging.current || !posRef.current || !issPos.current) return;
      const ndc = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);
      if (target) {
        // Clamp to max tether length from current ISS position
        const dist = target.distanceTo(issPos.current);
        if (dist > MAX_TETHER) {
          const dir = target.clone().sub(issPos.current).normalize();
          target.copy(issPos.current).add(dir.multiplyScalar(MAX_TETHER));
        }
        posRef.current.x = target.x;
        posRef.current.y = target.y;
      }
    },
    [camera, posRef, isDragging, issPos]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, [isDragging]);

  return (
    <mesh
      ref={planeRef}
      position={[REST_POS.x, REST_POS.y, 0.5]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* ─────────────────── Scene ─────────────────── */

function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const posRef = useRef(REST_POS.clone());
  const isDragging = useRef(false);
  const issPos = useRef(new THREE.Vector3(SHIP_ORBIT_CENTER.x + SHIP_ORBIT_RADIUS, SHIP_ORBIT_CENTER.y, 0));

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1} color={0xffffff} />
      <pointLight position={[-4, 3, 2]} intensity={0.4} color={0x6060cc} />
      <Spaceship issPos={issPos} />
      <Tether astronautPos={posRef} issPos={issPos} />
      <Astronaut mouse={mouse} posRef={posRef} isDragging={isDragging} />
      <DragPlane posRef={posRef} isDragging={isDragging} issPos={issPos} />
    </>
  );
}

/* ─────────────────── Overlay Canvas ─────────────────── */

export default function FloatingAstronaut() {
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, []);

  const handleTouch = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    mouse.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -((touch.clientY / window.innerHeight) * 2 - 1);
  }, []);

  useEffect(() => {
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
      className="fixed bottom-4 left-4 z-30 w-56 h-72 md:w-64 md:h-80"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        style={{ background: "transparent", cursor: "grab" }}
        dpr={[1, 1.5]}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
