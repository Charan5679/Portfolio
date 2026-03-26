"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [highlight, setHighlight] = useState({ x: 50, y: 50, opacity: 0 });
  const rafRef = useRef<number>();

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const px = mx / rect.width;
    const py = my / rect.height;

    // tilt ±8deg
    const tx = (py - 0.5) * -14;
    const ty = (px - 0.5) *  14;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: tx, y: ty });
      setHighlight({ x: px * 100, y: py * 100, opacity: 0.12 });
    });
  };

  const onMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHighlight({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ perspective: "900px" }}
      className={`relative ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {children}

        {/* Specular highlight */}
        <div
          className="absolute inset-0 rounded-[13px] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: highlight.opacity,
            background: `radial-gradient(circle at ${highlight.x}% ${highlight.y}%, rgba(255,255,255,0.22) 0%, transparent 55%)`,
          }}
        />
      </motion.div>
    </div>
  );
}
