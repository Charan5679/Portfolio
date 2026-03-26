"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const LINES = [
  { delay: 0,    type: "cmd",  text: "npm run build-career" },
  { delay: 800,  type: "info", text: "  Compiling education..." },
  { delay: 1400, type: "ok",   text: "  ✓ B.S. Information Technology — JNTU (2023)" },
  { delay: 2000, type: "ok",   text: "  ✓ M.S. Computer Science — Cleveland State (2026)" },
  { delay: 2600, type: "info", text: "  Bundling experience..." },
  { delay: 3200, type: "ok",   text: "  ✓ Java Full Stack Intern — Tech Mahindra" },
  { delay: 3700, type: "ok",   text: "    → latency reduced by 25%" },
  { delay: 4200, type: "info", text: "  Linking projects..." },
  { delay: 4700, type: "ok",   text: "  ✓ Log Analytics + Anomaly Detection (ELK+Python)" },
  { delay: 5100, type: "ok",   text: "  ✓ GAN Image Generator (PyTorch)" },
  { delay: 5600, type: "info", text: "  Optimising output bundle..." },
  { delay: 6200, type: "success", text: "  Build complete - 2 warnings - 0 errors" },
  { delay: 6800, type: "cmd",  text: "echo $STATUS" },
  { delay: 7200, type: "result", text: "  Ready for full-time roles - May 2026" },
];

type LineType = "cmd" | "info" | "ok" | "success" | "result";
const LINE_COLORS: Record<LineType, string> = {
  cmd:     "#efefef",
  info:    "#555",
  ok:      "#4ade80",
  success: "#a78bfa",
  result:  "#fbbf24",
};

export function TerminalTypewriter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleLines, setVisibleLines] = useState<typeof LINES>([]);
  const [cursor, setCursor] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setCursor(c => !c), 520);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    LINES.forEach((line) => {
      setTimeout(() => {
        setVisibleLines(v => [...v, line]);
      }, line.delay);
    });
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-xl border border-white/[0.08] bg-[#0d0d0d] overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#111]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] text-white/25">career.sh</span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-4 space-y-1 min-h-[220px]">
        {visibleLines.map((line, i) => (
          <div key={i} className="text-[12px] leading-relaxed">
            {line.type === "cmd" && (
              <span>
                <span className="text-emerald-400">sri</span>
                <span className="text-white/30">@portfolio</span>
                <span className="text-white/20">:~$ </span>
                <span style={{ color: LINE_COLORS[line.type as LineType] }}>{line.text}</span>
              </span>
            )}
            {line.type !== "cmd" && (
              <span style={{ color: LINE_COLORS[line.type as LineType] }}>{line.text}</span>
            )}
          </div>
        ))}

        {/* Blinking cursor */}
        <div className="text-[12px]">
          <span className="text-emerald-400">sri</span>
          <span className="text-white/30">@portfolio</span>
          <span className="text-white/20">:~$ </span>
          <span
            className="inline-block w-2 h-[14px] bg-white/60 align-middle ml-px"
            style={{ opacity: cursor ? 1 : 0 }}
          />
        </div>
      </div>
    </div>
  );
}
