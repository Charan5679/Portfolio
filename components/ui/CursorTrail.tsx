"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 10;

export function CursorTrail() {
  const positions = useRef<{ x: number; y: number }[]>(
    Array(TRAIL_LENGTH).fill({ x: -200, y: -200 })
  );
  const current = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>();
  const [dots, setDots] = useState<{ x: number; y: number }[]>(
    Array(TRAIL_LENGTH).fill({ x: -200, y: -200 })
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      current.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const ease = 0.28;
    const animate = () => {
      // head follows cursor with spring
      const prev = positions.current[0];
      const nx = prev.x + (current.current.x - prev.x) * ease;
      const ny = prev.y + (current.current.y - prev.y) * ease;

      // each subsequent dot follows the one before it
      const next = [{ x: nx, y: ny }];
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const p = positions.current[i];
        const target = next[i - 1];
        next.push({
          x: p.x + (target.x - p.x) * ease * 0.85,
          y: p.y + (target.y - p.y) * ease * 0.85,
        });
      }
      positions.current = next;
      setDots([...next]);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      {dots.map((pos, i) => {
        const progress = 1 - i / TRAIL_LENGTH;
        const size = 4 + progress * 4; // 4–8px
        const opacity = progress * 0.18;
        return (
          <div
            key={i}
            style={{
              position: "fixed",
              left: pos.x,
              top: pos.y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `rgba(255,255,255,${opacity})`,
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}
