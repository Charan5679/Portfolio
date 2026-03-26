"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "section-home",       label: "Home",       num: "01" },
  { id: "section-about",      label: "About",      num: "02" },
  { id: "section-projects",   label: "Projects",   num: "03" },
  { id: "section-experience", label: "Experience", num: "04" },
  { id: "section-skills",     label: "Skills",     num: "05" },
  { id: "section-hobbies",   label: "Interests",  num: "06" },
  { id: "section-resume",     label: "Resume",     num: "07" },
  { id: "section-contact",    label: "Contact",    num: "08" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Use View Transitions API if available for cinematic crossfade
  if ("startViewTransition" in document) {
    (document as any).startViewTransition(() => {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function GhostNav() {
  const [hovered, setHovered] = useState(false);
  const [activeId, setActiveId] = useState("section-home");

  /* track which section is in view */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.25, rootMargin: "-80px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 w-5 h-full z-[490]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      <nav
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[500] flex flex-col gap-[5px] py-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {NAV_ITEMS.map((item, i) => {
          const isActive = activeId === item.id;
          return (
            <div key={item.id} className="relative flex items-center h-[34px]">
              {/* dot */}
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-sm transition-all duration-300",
                isActive ? "h-[26px] bg-[#9a9a9a]" : "h-[18px] bg-[#303030]"
              )} />

              {/* pill */}
              <motion.div
                initial={false}
                animate={{
                  x: hovered || isActive ? 0 : "calc(-100% - 1px)",
                  opacity: hovered || isActive ? 1 : 0,
                }}
                transition={{ duration: 0.46, ease: [0.16,1,0.3,1], delay: hovered ? i * 0.04 : 0 }}
                className={cn(
                  "pointer-events-auto flex items-center gap-[10px] px-4 h-[34px]",
                  "rounded-r-[10px] border border-l-0 border-white/[0.07] whitespace-nowrap cursor-pointer",
                  isActive ? "bg-[#202020] border-white/[0.13]" : "bg-[#1a1a1a] hover:bg-[#202020]"
                )}
                onClick={() => scrollTo(item.id)}
              >
                <span className={cn("font-mono text-[10px] min-w-[16px] transition-colors", isActive ? "text-[#555]" : "text-[#303030]")}>
                  {item.num}
                </span>
                <span className={cn("text-[12.5px] tracking-[0.01em] select-none transition-colors", isActive ? "text-[#efefef]" : "text-[#9a9a9a]")}>
                  {item.label}
                </span>
              </motion.div>
            </div>
          );
        })}
      </nav>

      {/* Hire me button */}
      <div className="fixed top-5 right-6 z-[500]">
        <button
          onClick={() => scrollTo("section-contact")}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-[10px] bg-[#efefef] text-[#090909] text-[12.5px] font-medium hover:bg-[#d0d0d0] transition-colors duration-200 active:scale-[0.98]"
        >
          Hire Me →
        </button>
      </div>
    </>
  );
}

export { GhostNav as Navbar };
