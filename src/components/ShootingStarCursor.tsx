"use client";

import { useEffect, useRef } from "react";

interface Trail {
  x: number;
  y: number;
  age: number;
  vx: number;
  vy: number;
}

export default function ShootingStarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const prevMouse = useRef({ x: -100, y: -100 });
  const trails = useRef<Trail[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let lastMoveTime = performance.now();
    let idle = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      lastMoveTime = performance.now();
      idle = false;
    };
    window.addEventListener("mousemove", move);

    const tick = () => {
      if (!running) return;

      // Go idle if mouse hasn't moved for 2s and no trails left
      if (performance.now() - lastMoveTime > 2000 && trails.current.length === 0) {
        idle = true;
      }

      if (idle) {
        requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Spawn trail particles based on speed
      const count = Math.min(Math.floor(speed / 3), 5);
      for (let i = 0; i < count; i++) {
        trails.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 4,
          y: mouse.current.y + (Math.random() - 0.5) * 4,
          age: 0,
          vx: -dx * 0.08 + (Math.random() - 0.5) * 0.8,
          vy: -dy * 0.08 + (Math.random() - 0.5) * 0.8,
        });
      }

      // Ambient glow particles
      if (Math.random() < 0.3) {
        trails.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 8,
          y: mouse.current.y + (Math.random() - 0.5) * 8,
          age: 0,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 + 0.2,
        });
      }

      // Update & draw particles
      trails.current = trails.current.filter((p) => p.age < 1);
      for (const p of trails.current) {
        p.age += 0.025;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;

        const alpha = Math.max(0, 1 - p.age);
        const size = Math.max(0, (1 - p.age) * 2.5);
        if (size <= 0) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        glow.addColorStop(0, `rgba(96, 165, 250, ${alpha * 0.15})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 219, 254, ${alpha * 0.8})`;
        ctx.fill();
      }

      // Cursor core glow
      if (mouse.current.x > 0) {
        const coreGrad = ctx.createRadialGradient(
          mouse.current.x, mouse.current.y, 0,
          mouse.current.x, mouse.current.y, 18
        );
        coreGrad.addColorStop(0, "rgba(96, 165, 250, 0.25)");
        coreGrad.addColorStop(0.5, "rgba(96, 165, 250, 0.06)");
        coreGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.current.x, mouse.current.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(219, 234, 254, 0.9)";
        ctx.fill();
      }

      prevMouse.current = { ...mouse.current };
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block"
    />
  );
}
