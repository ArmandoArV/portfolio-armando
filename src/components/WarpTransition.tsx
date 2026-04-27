"use client";

import { useEffect, useRef } from "react";

export default function WarpTransition() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animating = false;

    const handler = () => {
      if (animating) return;
      animating = true;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.opacity = "1";

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const stars: { angle: number; dist: number; speed: number; size: number }[] = [];

      for (let i = 0; i < 120; i++) {
        stars.push({
          angle: Math.random() * Math.PI * 2,
          dist: Math.random() * 30 + 10,
          speed: Math.random() * 12 + 8,
          size: Math.random() * 1.5 + 0.5,
        });
      }

      let frame = 0;
      const maxFrames = 25;

      const tick = () => {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const progress = frame / maxFrames;
        const alpha = progress < 0.4 ? progress * 2.5 : (1 - progress) * 1.67;

        for (const s of stars) {
          s.dist += s.speed * (1 + progress * 4);

          const x = cx + Math.cos(s.angle) * s.dist;
          const y = cy + Math.sin(s.angle) * s.dist;
          const trailLen = s.speed * 3 * (1 + progress * 2);
          const prevX = cx + Math.cos(s.angle) * (s.dist - trailLen);
          const prevY = cy + Math.sin(s.angle) * (s.dist - trailLen);

          const grad = ctx.createLinearGradient(prevX, prevY, x, y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, `rgba(147, 197, 253, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(219, 234, 254, ${alpha * 0.9})`);

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Center flash
        const flashAlpha = alpha * 0.15;
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
        flashGrad.addColorStop(0, `rgba(191, 219, 254, ${flashAlpha})`);
        flashGrad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.fillStyle = flashGrad;
        ctx.fill();

        if (frame < maxFrames) {
          requestAnimationFrame(tick);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.style.opacity = "0";
          animating = false;
        }
      };

      requestAnimationFrame(tick);
    };

    window.addEventListener("warp-navigate", handler);
    return () => window.removeEventListener("warp-navigate", handler);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998] transition-opacity duration-150"
      style={{ opacity: 0 }}
    />
  );
}
