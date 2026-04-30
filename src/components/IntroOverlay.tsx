"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAR_COUNT = 300;
const PHASE_1_END = 1000; // stars twinkle in
const PHASE_2_END = 2800; // hyperspace streaks
const PHASE_3_END = 3600; // flash + fade out

interface Star {
  x: number;
  y: number;
  z: number;
  baseSize: number;
}

export default function IntroOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);

  // Check if we should skip (already played or prefers-reduced-motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyPlayed = sessionStorage.getItem("intro-played") === "1";
    if (prefersReduced || alreadyPlayed) {
      setSkip(true);
      setDone(true);
    }
  }, []);

  useEffect(() => {
    if (skip || done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Generate stars
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * 1000 + 1,
        baseSize: Math.random() * 1.5 + 0.5,
      });
    }

    const cx = w / 2;
    const cy = h / 2;
    let animId: number;
    const startTime = performance.now();

    function draw() {
      const elapsed = performance.now() - startTime;

      if (elapsed >= PHASE_3_END) {
        sessionStorage.setItem("intro-played", "1");
        setDone(true);
        return;
      }

      ctx!.fillStyle = "#020617";
      ctx!.fillRect(0, 0, w, h);

      // Phase calculations
      let globalAlpha = 1;
      let speed = 0;
      let streakLength = 0;

      if (elapsed < PHASE_1_END) {
        // Phase 1: Stars fade in, gentle twinkle
        const t = elapsed / PHASE_1_END;
        globalAlpha = t;
        speed = 0.2;
        streakLength = 0;
      } else if (elapsed < PHASE_2_END) {
        // Phase 2: Hyperspace — stars streak outward
        const t = (elapsed - PHASE_1_END) / (PHASE_2_END - PHASE_1_END);
        const eased = t * t; // accelerate
        speed = 2 + eased * 25;
        streakLength = eased * 30;
        globalAlpha = 1;
      } else {
        // Phase 3: Flash and fade
        const t = (elapsed - PHASE_2_END) / (PHASE_3_END - PHASE_2_END);
        speed = 27 * (1 - t);
        streakLength = 30 * (1 - t);
        globalAlpha = 1 - t * t;

        // White flash at start of phase 3
        if (t < 0.3) {
          const flashAlpha = (1 - t / 0.3) * 0.5;
          ctx!.fillStyle = `rgba(140, 180, 255, ${flashAlpha})`;
          ctx!.fillRect(0, 0, w, h);
        }
      }

      // Draw stars
      for (const star of stars) {
        star.z -= speed;
        if (star.z <= 1) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
        }

        // Project to 2D
        const px = (star.x / star.z) * 300 + cx;
        const py = (star.y / star.z) * 300 + cy;
        const size = (star.baseSize * 300) / star.z;

        // Skip if off-screen
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue;

        const brightness = Math.min(1, (1000 - star.z) / 600);
        const alpha = brightness * globalAlpha;

        if (streakLength > 0 && speed > 1) {
          // Draw streak line
          const prevZ = star.z + speed;
          const ppx = (star.x / prevZ) * 300 + cx;
          const ppy = (star.y / prevZ) * 300 + cy;

          const gradient = ctx!.createLinearGradient(ppx, ppy, px, py);
          gradient.addColorStop(0, `rgba(100, 150, 255, 0)`);
          gradient.addColorStop(1, `rgba(180, 210, 255, ${alpha * 0.8})`);

          ctx!.beginPath();
          ctx!.moveTo(ppx, ppy);
          ctx!.lineTo(px, py);
          ctx!.strokeStyle = gradient;
          ctx!.lineWidth = Math.max(0.5, size * 0.8);
          ctx!.stroke();
        }

        // Draw star point
        ctx!.beginPath();
        ctx!.arc(px, py, Math.max(0.3, size), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 220, 255, ${alpha})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [skip, done]);

  if (skip) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro-overlay"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9998] bg-[#020617]"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
          <button
            onClick={() => {
              sessionStorage.setItem("intro-played", "1");
              setDone(true);
            }}
            className="absolute bottom-8 right-8 text-slate-500 hover:text-slate-300 text-sm font-mono transition-colors"
          >
            Skip ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
