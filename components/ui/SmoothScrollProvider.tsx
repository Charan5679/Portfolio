"use client";

import { useEffect } from "react";

// Standalone smooth scroll initialiser — does NOT wrap children
// Mounts into the DOM independently so it never touches the React Server Component tree
export function SmoothScrollInit() {
  useEffect(() => {
    let lenis: any;
    let rafId: number;

    (async () => {
      try {
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

        gsap.registerPlugin(ScrollTrigger);

        lenis = new Lenis({
          duration: 1.35,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.85,
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time: number) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.batch("[data-gsap-reveal]", {
          onEnter: (batch: Element[]) =>
            gsap.to(batch, { opacity: 1, y: 0, stagger: 0.07, duration: 0.72, ease: "power3.out" }),
          start: "top 88%",
        });

        document.querySelectorAll("[data-gsap-parallax]").forEach((el) => {
          const speed = el.getAttribute("data-gsap-parallax") || "0.15";
          gsap.to(el, {
            y: () => parseFloat(speed) * -200,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      } catch {
        // Graceful degradation
      }
    })();

    return () => {
      lenis?.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null; // renders nothing
}
