"use client";

import { useRef, useState, ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function MagneticButton({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate(0px, 0px)");

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    setTransform(`translate(${dx}px, ${dy}px)`);
  };

  const handleLeave = () => setTransform("translate(0px, 0px)");

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
}
