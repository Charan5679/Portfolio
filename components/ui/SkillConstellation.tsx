"use client";

import { useEffect, useRef, useState } from "react";

const GROUPS: Record<string, { skills: string[]; color: string }> = {
  Languages:        { color: "#e0e0e0", skills: ["Java", "Python", "TypeScript", "JavaScript", "SQL", "Bash"] },
  Frameworks:       { color: "#7aadff", skills: ["React.js", "Node.js", "Next.js", "Spring Boot", "Angular"] },
  "AI / ML":        { color: "#ffb347", skills: ["PyTorch", "GANs", "Isolation Forest", "Scikit-learn", "OpenCV"] },
  Databases:        { color: "#50fa7b", skills: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Redis"] },
  "Cloud & DevOps": { color: "#bd93f9", skills: ["AWS", "Docker", "Jenkins", "CI/CD", "Git"] },
  Analytics:        { color: "#ff79c6", skills: ["ELK Stack", "Kibana", "Tableau", "Elasticsearch"] },
};

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex: string, a: number) {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

interface SkillNode {
  id: string;
  label: string;
  group: string;
  isHub: boolean;
  x: number;
  y: number;
  phase: number;
}

function layout(W: number, H: number) {
  const groups = Object.entries(GROUPS);
  const N = groups.length;

  // Keep everything inside a safe inner rect with generous padding
  const padX = 90;   // horizontal padding (room for labels)
  const padY = 60;   // vertical padding
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const cx = W / 2;
  const cy = H / 2;

  // Hub ring radius — must fit inside inner rect
  const hubR = Math.min(innerW, innerH) * 0.30;

  // Spoke length — hubs are at hubR, spokes go outward but must stay in inner rect
  // Worst case: hub at edge of hubR circle, spoke goes outward
  // Max spoke = distance from hub to nearest inner-rect edge - 20px
  const spokeR = Math.min(innerW, innerH) * 0.18;

  const nodes: SkillNode[] = [];
  const edges: [number, number][] = [];

  groups.forEach(([group, { skills }], gi) => {
    // Start at top (-PI/2), go clockwise
    const angle = (gi / N) * Math.PI * 2 - Math.PI / 2;

    // Hub position on the ring
    const hx = cx + Math.cos(angle) * hubR;
    const hy = cy + Math.sin(angle) * hubR;

    const hubIdx = nodes.length;
    nodes.push({
      id: "hub:" + group, label: group, group, isHub: true,
      x: hx, y: hy, phase: gi * 1.1,
    });

    // Fan skill nodes outward from hub, pointing away from centre
    const count = skills.length;
    const fanWidth = Math.min(1.1, 0.4 + count * 0.12); // radians total arc

    skills.forEach((skill, si) => {
      const frac = count > 1 ? (si / (count - 1)) - 0.5 : 0;
      const a = angle + frac * fanWidth;
      let sx = hx + Math.cos(a) * spokeR;
      let sy = hy + Math.sin(a) * spokeR;

      // Clamp hard to inner rect
      sx = Math.max(padX, Math.min(W - padX, sx));
      sy = Math.max(padY, Math.min(H - padY, sy));

      const nodeIdx = nodes.length;
      nodes.push({
        id: skill, label: skill, group, isHub: false,
        x: sx, y: sy, phase: si * 0.55 + gi * 1.4,
      });
      edges.push([hubIdx, nodeIdx]);
    });
  });

  // Hub ring connections
  const hubIdxs = nodes.map((n, i) => (n.isHub ? i : -1)).filter(i => i >= 0);
  hubIdxs.forEach((idx, i) => {
    edges.push([idx, hubIdxs[(i + 1) % hubIdxs.length]]);
  });

  return { nodes, edges };
}

export function SkillConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  // All mutable state in one ref — avoids stale closures completely
  const S = useRef({
    nodes:   [] as SkillNode[],
    edges:   [] as [number, number][],
    hov:     -1,
    active:  null as string | null,
    t:       0,
    W:       700,
    H:       480,
    raf:     0,
  });

  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [tooltip, setTooltip]         = useState<{ x: number; y: number; label: string; group: string } | null>(null);

  useEffect(() => { S.current.active = activeGroup; }, [activeGroup]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    const H   = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const applySize = () => {
      const W = wrap.clientWidth || 700;
      S.current.W = W;
      S.current.H = H;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const built = layout(W, H);
      S.current.nodes = built.nodes;
      S.current.edges = built.edges;
    };

    applySize();

    const draw = () => {
      const { nodes, edges, hov, active, t, W, H } = S.current;
      S.current.t += 0.012;

      ctx.clearRect(0, 0, W, H);

      // Draw edges first
      edges.forEach(([ai, bi]) => {
        const a = nodes[ai];
        const b = nodes[bi];
        if (!a || !b) return;
        const isRing   = a.isHub && b.isHub;
        const dimmed   = active ? (a.group !== active || b.group !== active) : false;
        const aHov     = hov >= 0 && !isRing && (
          nodes[hov].id === a.id || nodes[hov].id === b.id ||
          (nodes[hov].isHub && nodes[hov].group === a.group)
        );

        const col = GROUPS[a.group]?.color || "#fff";
        let opacity = isRing ? 0.07 : dimmed ? 0.018 : aHov ? 0.40 : 0.12;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = rgba(col, opacity);
        ctx.lineWidth   = isRing ? 0.5 : aHov ? 1.0 : 0.7;
        ctx.stroke();

        // Travelling pulse dot on spoke edges
        if (!isRing && !dimmed) {
          const p = ((S.current.t * 0.5 + a.phase * 0.4) % 1);
          const dotA = Math.sin(p * Math.PI) * (aHov ? 0.95 : 0.45);
          ctx.beginPath();
          ctx.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 1.3, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, dotA);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const col    = GROUPS[n.group]?.color || "#fff";
        const dimmed = active ? n.group !== active : false;
        const isHov  = i === hov;
        const inGrp  = hov >= 0 && nodes[hov]?.isHub && nodes[hov].group === n.group && !n.isHub;
        const pulse  = Math.sin(S.current.t * 1.3 + n.phase) * 0.5 + 0.5;

        // Glow
        if ((isHov || inGrp) && !dimmed) {
          const gr = ctx.createRadialGradient(n.x, n.y, n.isHub ? 7 : 3.5, n.x, n.y, isHov ? 32 : 18);
          gr.addColorStop(0, rgba(col, isHov ? 0.30 : 0.14));
          gr.addColorStop(1, rgba(col, 0));
          ctx.beginPath();
          ctx.arc(n.x, n.y, isHov ? 32 : 18, 0, Math.PI * 2);
          ctx.fillStyle = gr;
          ctx.fill();
        }

        // Hub rings
        if (n.isHub) {
          [13 + pulse * 2, 9].forEach((rr, ri) => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
            ctx.strokeStyle = rgba(col, dimmed ? 0.04 : ri === 0 ? 0.12 + pulse * 0.07 : 0.24);
            ctx.lineWidth = ri === 0 ? 0.7 : 1.0;
            ctx.stroke();
          });
        }

        // Dot
        const r = n.isHub ? (isHov ? 9 : 6.5 + pulse * 1.2) : (isHov ? 6 : inGrp ? 5 : 3.5);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, dimmed ? 0.10 : 1.0);
        ctx.fill();

        // White centre for hubs
        if (n.isHub && !dimmed) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.9)";
          ctx.fill();
        }

        // Labels
        if (n.isHub) {
          ctx.font = "600 11px 'DM Sans', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillStyle = rgba(col, dimmed ? 0.10 : 0.88);
          ctx.fillText(n.label, n.x, n.y - 16);
        } else if (isHov || inGrp || (!active && !dimmed)) {
          const showLabel = isHov || inGrp;
          ctx.font = isHov ? "500 11px 'JetBrains Mono',monospace" : "9.5px 'JetBrains Mono',monospace";
          ctx.textBaseline = "middle";
          const onRight = n.x >= W / 2;
          ctx.textAlign = onRight ? "left" : "right";
          const labelX = onRight ? n.x + 9 : n.x - 9;
          ctx.fillStyle = rgba(col, isHov ? 1 : inGrp ? 0.70 : 0.30);
          ctx.fillText(n.label, labelX, n.y);
        }
      });

      S.current.raf = requestAnimationFrame(draw);
    };

    S.current.raf = requestAnimationFrame(draw);

    // Mouse events
    const getNode = (ex: number, ey: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ex - rect.left;
      const my = ey - rect.top;
      let best = -1, bestD = 28;
      S.current.nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - mx, n.y - my);
        if (d < bestD) { bestD = d; best = i; }
      });
      return { idx: best, mx, my };
    };

    const onMove = (e: MouseEvent) => {
      const { idx, mx, my } = getNode(e.clientX, e.clientY);
      S.current.hov = idx;
      canvas.style.cursor = idx >= 0 ? "pointer" : "default";
      if (idx >= 0) {
        setTooltip({ x: mx, y: my - 30, label: S.current.nodes[idx].label, group: S.current.nodes[idx].group });
      } else {
        setTooltip(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const { idx } = getNode(e.clientX, e.clientY);
      if (idx < 0) { setActiveGroup(null); return; }
      const grp = S.current.nodes[idx].group;
      setActiveGroup(prev => prev === grp ? null : grp);
    };

    const onLeave = () => { S.current.hov = -1; setTooltip(null); };

    const onResize = () => applySize();

    canvas.addEventListener("mousemove",  onMove);
    canvas.addEventListener("click",      onClick);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     onResize);

    return () => {
      cancelAnimationFrame(S.current.raf);
      canvas.removeEventListener("mousemove",  onMove);
      canvas.removeEventListener("click",      onClick);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     onResize);
    };
  }, []);

  const total = Object.values(GROUPS).reduce((s, g) => s + g.skills.length, 0);

  return (
    <div className="relative w-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#303030] mb-1.5">
            Skill Constellation
          </div>
          <p className="text-[12.5px] text-[#555] font-light">
            {activeGroup
              ? `${activeGroup} — ${GROUPS[activeGroup]?.skills.length || 0} skills`
              : `Hover a cluster to explore — click to isolate — ${total} skills`}
          </p>
        </div>
        {activeGroup && (
          <button onClick={() => setActiveGroup(null)}
            className="text-[11px] text-[#555] hover:text-[#9a9a9a] transition-colors px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/[0.13] flex-shrink-0">
            Reset x
          </button>
        )}
      </div>

      <div ref={wrapRef} className="relative w-full rounded-xl overflow-hidden"
        style={{ height: 480, background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,10,24,0.98) 0%, rgba(3,3,8,0.99) 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <canvas ref={canvasRef} className="block" />

        {tooltip && (
          <div className="absolute pointer-events-none z-10 px-3 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap"
            style={{
              left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)",
              background: "rgba(5,5,12,0.95)",
              border: `1px solid ${GROUPS[tooltip.group]?.color || "#fff"}30`,
              color: GROUPS[tooltip.group]?.color || "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
            }}>
            {tooltip.label}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(GROUPS).map(([group, { color, skills }]) => {
          const isActive = activeGroup === group;
          const [r, g, b] = hexRgb(color);
          return (
            <button key={group}
              onClick={() => setActiveGroup(prev => prev === group ? null : group)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11.5px] font-medium transition-all duration-200"
              style={{
                border:     `1px solid ${isActive ? color + "50" : "rgba(255,255,255,0.07)"}`,
                background: isActive ? `rgba(${r},${g},${b},0.10)` : "transparent",
                color:      isActive ? color : "rgba(255,255,255,0.32)",
                transform:  isActive ? "translateY(-1px)" : "none",
                boxShadow:  isActive ? `0 4px 14px rgba(${r},${g},${b},0.15)` : "none",
              }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: isActive ? `0 0 5px ${color}` : "none" }} />
              {group}
              <span className="opacity-45 text-[9.5px]">{skills.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
