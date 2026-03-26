"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      const ease = 0.08;
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * ease;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * ease;

      if (spotlightRef.current) {
        spotlightRef.current.style.left = `${smoothPos.current.x}px`;
        spotlightRef.current.style.top = `${smoothPos.current.y}px`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div
        ref={spotlightRef}
        className="spotlight hidden lg:block"
        style={{ position: "fixed", pointerEvents: "none", zIndex: 1 }}
      />
      <div
        ref={dotRef}
        className="cursor-dot hidden lg:block"
        style={{ position: "fixed", pointerEvents: "none" }}
      />
    </>
  );
}
