"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  depth: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  width: number;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const scrollY = useRef(0);
  const nextMeteor = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = document.documentElement.scrollHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Regenerate stars on resize
      stars.current = [];
      const count = Math.floor((w * window.innerHeight) / 4000);
      for (let i = 0; i < count; i++) {
        stars.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.6 + 0.15,
          depth: Math.random() * 0.8 + 0.1,
          twinkleSpeed: Math.random() * 2 + 1,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const spawnMeteor = () => {
      const side = Math.random();
      let x: number, y: number;
      if (side < 0.7) {
        // From top
        x = Math.random() * canvas.width * 1.2;
        y = -20;
      } else {
        // From right
        x = canvas.width + 20;
        y = Math.random() * canvas.height * 0.5;
      }

      const angle = Math.PI * 0.7 + Math.random() * 0.4; // downward-left-ish
      const speed = 6 + Math.random() * 8;

      meteors.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 40 + Math.random() * 80,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        width: 1 + Math.random() * 1.5,
      });
    };

    let time = 0;

    const tick = () => {
      if (!running) return;
      time += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sy = scrollY.current;

      // Draw stars with parallax + twinkle
      for (const s of stars.current) {
        const py = ((s.y - sy * s.depth * 0.15) % h + h) % h;
        // Only draw if in viewport
        if (py < -10 || py > canvas.height + 10) continue;

        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(s.x, py, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(191, 219, 254, ${alpha})`;
        ctx.fill();

        // Subtle glow for bigger stars
        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, py, s.size * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(s.x, py, 0, s.x, py, s.size * 3);
          g.addColorStop(0, `rgba(96, 165, 250, ${alpha * 0.1})`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      // Spawn meteors
      if (time > nextMeteor.current) {
        spawnMeteor();
        nextMeteor.current = time + 4 + Math.random() * 6;
      }

      // Draw meteors
      meteors.current = meteors.current.filter((m) => m.life < m.maxLife);
      for (const m of meteors.current) {
        m.life++;
        m.x += m.vx;
        m.y += m.vy;

        const progress = m.life / m.maxLife;
        const fadeIn = Math.min(m.life / 8, 1);
        const fadeOut = 1 - Math.pow(progress, 2);
        const alpha = fadeIn * fadeOut;

        if (alpha <= 0) continue;

        // Trail
        const tailX = m.x - (m.vx / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.length;
        const tailY = m.y - (m.vy / Math.sqrt(m.vx * m.vx + m.vy * m.vy)) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.6, `rgba(147, 197, 253, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(219, 234, 254, ${alpha * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright head
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width + 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.fill();

        // Head glow
        const hg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 8);
        hg.addColorStop(0, `rgba(147, 197, 253, ${alpha * 0.4})`);
        hg.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(m.x, m.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
    />
  );
}
