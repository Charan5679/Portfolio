"use client";

import { useEffect } from "react";

export function ScrollDepthEffect() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-scroll-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const ratio = entry.intersectionRatio;

          if (ratio > 0.3) {
            el.style.filter = "blur(0px)";
            el.style.opacity = "1";
            el.style.transform = "translateY(0px)";
          } else if (ratio > 0) {
            const blur = (1 - ratio / 0.3) * 1.5;
            const op   = 0.4 + ratio / 0.3 * 0.6;
            el.style.filter = `blur(${blur.toFixed(1)}px)`;
            el.style.opacity = String(op.toFixed(2));
          }
        });
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
        rootMargin: "-80px 0px -80px 0px",
      }
    );

    sections.forEach((s) => {
      s.style.transition = "filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease";
      observer.observe(s);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
