"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { experience, education } from "@/lib/data";

const TIMELINE_EVENTS = [
  { year: 2014, label: "Started B.S. IT at JNTU", type: "edu" as const },
  { year: 2019, label: "Graduated B.S. IT", type: "edu" as const },
  { year: 2019, label: "First full-stack projects with React & Node.js", type: "work" as const },
  { year: 2023, label: "Graduated B.S. IT - Java internship at Tech Mahindra", type: "work" as const },
  { year: 2024, label: "Enrolled M.S. CS at Cleveland State University", type: "edu" as const },
  { year: 2024, label: "Built Log Analytics + Anomaly Detection (ELK+Python)", type: "project" as const },
  { year: 2025, label: "Built GAN Image Generator in PyTorch", type: "project" as const },
  { year: 2026, label: "Graduating M.S. CS - Available for full-time roles", type: "goal" as const },
];

const TYPE_COLORS = {
  edu:     "#a78bfa",
  work:    "#4ade80",
  project: "#fbbf24",
  goal:    "#60a5fa",
};

const TYPE_LABELS = {
  edu:     "Education",
  work:    "Experience",
  project: "Project",
  goal:    "Goal",
};

export function TimelineScrubber() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0-1
  const [dragging, setDragging] = useState(false);
  const isDragging = useRef(false);

  const activeIdx = Math.round(progress * (TIMELINE_EVENTS.length - 1));
  const activeEvent = TIMELINE_EVENTS[activeIdx];

  const updateProgress = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProgress(p);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateProgress(x);
    };
    const onUp = () => { isDragging.current = false; setDragging(false); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove as any);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setDragging(true);
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    updateProgress(x);
  };

  return (
    <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#303030] mb-5">
        Career scrubber — drag to explore
      </div>

      {/* Active event card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
          className="mb-5 p-4 rounded-xl border border-white/[0.07] bg-[#1a1a1a]"
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wider"
              style={{
                color: TYPE_COLORS[activeEvent.type],
                background: TYPE_COLORS[activeEvent.type] + "18",
                border: `1px solid ${TYPE_COLORS[activeEvent.type]}30`,
              }}
            >
              {TYPE_LABELS[activeEvent.type]}
            </span>
            <span className="font-mono text-[13px] text-white/50">{activeEvent.year}</span>
          </div>
          <div className="text-[13.5px] font-light text-[#efefef] leading-snug">
            {activeEvent.label}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-8 flex items-center cursor-pointer"
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onClick={(e) => updateProgress(e.clientX)}
      >
        {/* Track line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/[0.1]" />

        {/* Filled portion */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-white/30 transition-all duration-75"
          style={{ width: `${progress * 100}%` }}
        />

        {/* Event dots */}
        {TIMELINE_EVENTS.map((ev, i) => {
          const pos = i / (TIMELINE_EVENTS.length - 1);
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
              style={{ left: `${pos * 100}%` }}
            >
              <div
                className="rounded-full border transition-all duration-150"
                style={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  background: isActive ? TYPE_COLORS[ev.type] : "rgba(255,255,255,0.15)",
                  borderColor: isActive ? TYPE_COLORS[ev.type] : "transparent",
                  boxShadow: isActive ? `0 0 8px ${TYPE_COLORS[ev.type]}60` : "none",
                }}
              />
            </div>
          );
        })}

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${progress * 100}%` }}
          animate={{ scale: dragging ? 1.3 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="w-4 h-4 rounded-full bg-white/80 border border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        </motion.div>
      </div>

      {/* Year labels */}
      <div className="flex justify-between mt-1">
        {[2014, 2018, 2022, 2026].map(y => (
          <span key={y} className="text-[9px] font-mono text-white/20">{y}</span>
        ))}
      </div>
    </div>
  );
}
