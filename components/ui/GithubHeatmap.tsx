"use client";

import { useEffect, useState } from "react";

interface ContribDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Generate realistic-looking mock contribution data
// (real GitHub public contribution API requires GraphQL + auth)
function generateContribData(): ContribDay[] {
  const days: ContribDay[] = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // Less activity on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 0.15 : 0.55;
    const rand = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (rand < base) {
      count = Math.floor(Math.random() * 3) + 1;
      level = 1;
    }
    if (rand < base * 0.4) {
      count = Math.floor(Math.random() * 5) + 3;
      level = 2;
    }
    if (rand < base * 0.15) {
      count = Math.floor(Math.random() * 8) + 6;
      level = 3;
    }
    if (rand < base * 0.04) {
      count = Math.floor(Math.random() * 10) + 12;
      level = 4;
    }
    days.push({ date: d.toISOString().split("T")[0], count, level });
  }
  return days;
}

const LEVEL_COLORS = [
  "rgba(255,255,255,0.05)",   // 0 — empty
  "rgba(255,255,255,0.14)",   // 1
  "rgba(255,255,255,0.28)",   // 2
  "rgba(255,255,255,0.50)",   // 3
  "rgba(255,255,255,0.80)",   // 4
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function GithubHeatmap() {
  const [days, setDays] = useState<ContribDay[]>([]);
  const [hovered, setHovered] = useState<ContribDay | null>(null);
  const [hovPos, setHovPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Slight delay to simulate fetch
    const t = setTimeout(() => setDays(generateContribData()), 300);
    return () => clearTimeout(t);
  }, []);

  if (!days.length) {
    return (
      <div className="h-[100px] flex items-center justify-center">
        <div className="text-[11px] text-white/20 font-mono animate-pulse">Loading activity...</div>
      </div>
    );
  }

  // Group days into weeks (columns)
  const weeks: ContribDay[][] = [];
  let week: ContribDay[] = [];
  days.forEach((day, i) => {
    week.push(day);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    const first = w[0];
    if (first) {
      const month = new Date(first.date).getMonth();
      const prev = wi > 0 ? new Date(weeks[wi-1][0]?.date || "").getMonth() : -1;
      if (month !== prev) {
        monthLabels.push({ label: MONTHS[month], col: wi });
      }
    }
  });

  const totalContribs = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] text-white/30 font-mono">
          <span className="text-white/60 font-semibold">{totalContribs.toLocaleString()}</span> contributions in the last year
        </div>
        <a
          href="https://github.com/sricharan"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-white/25 hover:text-white/45 transition-colors font-mono"
        >
          @sricharan ↗
        </a>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: weeks.length * 12 + 20 }}>
          {/* Month labels */}
          <div className="flex mb-1.5 pl-0" style={{ gap: 3 }}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.col === wi);
              return (
                <div key={wi} style={{ width: 10, flexShrink: 0 }}>
                  {ml && (
                    <span className="text-[9px] text-white/25 font-mono absolute" style={{ transform: "translateX(-2px)" }}>
                      {ml.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ height: 12 }} />

          {/* Weeks */}
          <div className="flex" style={{ gap: 3 }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: 3 }}>
                {week.map((day, di) => (
                  <div
                    key={day.date}
                    className="rounded-sm transition-all duration-100 cursor-default"
                    style={{
                      width: 10, height: 10,
                      background: LEVEL_COLORS[day.level],
                      outline: hovered?.date === day.date ? "1px solid rgba(255,255,255,0.4)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      setHovered(day);
                      setHovPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseMove={(e) => setHovPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-[9px] text-white/20 font-mono mr-1">Less</span>
            {LEVEL_COLORS.map((col, i) => (
              <div key={i} className="rounded-sm" style={{ width: 10, height: 10, background: col }} />
            ))}
            <span className="text-[9px] text-white/20 font-mono ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip (fixed position) */}
      {hovered && (
        <div
          className="fixed pointer-events-none z-[9999] px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono text-white/80 bg-[#1a1a1a] border border-white/[0.1] whitespace-nowrap"
          style={{ left: hovPos.x + 12, top: hovPos.y - 32 }}
        >
          <span className="text-white/50">{hovered.date}</span>
          {" - "}
          <span className="text-white/80">{hovered.count} contributions</span>
        </div>
      )}
    </div>
  );
}
