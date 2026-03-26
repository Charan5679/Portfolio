"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── DATA ─────────────────────────────────────────────── */
const GROUPS: Record<string, string[]> = {
  Languages:        ["Java", "Python", "TypeScript", "JavaScript", "SQL", "Bash"],
  Frameworks:       ["React.js", "Node.js", "Next.js", "Spring Boot", "Angular"],
  "AI / ML":        ["PyTorch", "GANs", "Isolation Forest", "Scikit-learn", "OpenCV"],
  Databases:        ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Redis"],
  "Cloud & DevOps": ["AWS", "Docker", "Jenkins", "CI/CD", "Git"],
  Analytics:        ["ELK Stack", "Kibana", "Tableau", "Elasticsearch"],
};

const GROUP_RGB: Record<string, [number, number, number]> = {
  Languages:        [239, 239, 239],
  Frameworks:       [160, 190, 255],
  "AI / ML":        [255, 195, 120],
  Databases:        [120, 230, 170],
  "Cloud & DevOps": [195, 170, 255],
  Analytics:        [255, 170, 170],
};

type SimNode = {
  id: string;
  group: string;
  isHub: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
};

type SimLink = { source: SimNode; target: SimNode };

/* ── PURE JS FORCE SIMULATION (no d3-force import needed) ── */
function buildSim(nodes: SimNode[], links: SimLink[], W: number, H: number) {
  const alpha = { val: 1.0 };
  const alphaDecay = 0.025;
  const alphaMin = 0.001;
  let running = true;

  const tick = () => {
    if (!running || alpha.val < alphaMin) return;
    alpha.val *= (1 - alphaDecay);
    const a = alpha.val;

    // Many-body repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ni = nodes[i], nj = nodes[j];
        const dx = ni.x - nj.x;
        const dy = ni.y - nj.y;
        const d2 = dx * dx + dy * dy + 0.01;
        const strength = (ni.isHub || nj.isHub) ? -3200 : -900;
        const f = strength / d2 * a;
        ni.vx += dx * f;
        ni.vy += dy * f;
        nj.vx -= dx * f;
        nj.vy -= dy * f;
      }
    }

    // Link attraction
    links.forEach(({ source: s, target: t }) => {
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const target_dist = s.isHub || t.isHub ? 90 : 70;
      const f = ((d - target_dist) / d) * 0.25 * a;
      const fx = dx * f;
      const fy = dy * f;
      if (s.fx === null) { s.vx += fx; s.vy += fy; }
      if (t.fx === null) { t.vx -= fx; t.vy -= fy; }
    });

    // Center gravity
    nodes.forEach(n => {
      n.vx += (W / 2 - n.x) * 0.012 * a;
      n.vy += (H / 2 - n.y) * 0.012 * a;
    });

    // Integrate + damping + bounds
    nodes.forEach(n => {
      if (n.fx !== null) { n.x = n.fx; n.y = n.fy as number; return; }
      n.vx *= 0.62;
      n.vy *= 0.62;
      n.x = Math.max(30, Math.min(W - 30, n.x + n.vx));
      n.y = Math.max(30, Math.min(H - 30, n.y + n.vy));
    });
  };

  return {
    tick,
    reheat: () => { alpha.val = 0.5; },
    stop:   () => { running = false; },
    isSettled: () => alpha.val < alphaMin,
  };
}

/* ── COMPONENT ──────────────────────────────────────────── */
export function ForceSkillsGraph() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef     = useRef<SimNode[]>([]);
  const linksRef     = useRef<SimLink[]>([]);
  const simRef       = useRef<ReturnType<typeof buildSim> | null>(null);
  const rafRef       = useRef<number>(0);
  const hovRef       = useRef<SimNode | null>(null);
  const dragRef      = useRef<SimNode | null>(null);
  const activeRef    = useRef<string | null>(null);
  const sizeRef      = useRef({ W: 700, H: 440 });

  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [tooltip,     setTooltip]     = useState<{ x: number; y: number; text: string } | null>(null);
  const [ready,       setReady]       = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  useEffect(() => { activeRef.current = activeGroup; }, [activeGroup]);

  const rgba = (group: string, a: number) => {
    const [r, g, b] = GROUP_RGB[group] || [200, 200, 200];
    return `rgba(${r},${g},${b},${a})`;
  };

  const initGraph = useCallback(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    const W   = container.clientWidth || 700;
    const H   = 440;
    sizeRef.current = { W, H };

    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(DPR, DPR);

    // Build nodes
    const nodes: SimNode[] = [];
    const links: SimLink[] = [];

    Object.keys(GROUPS).forEach((g) => {
      nodes.push({
        id: "hub:" + g, group: g, isHub: true,
        x: W / 2 + (Math.random() - 0.5) * 150,
        y: H / 2 + (Math.random() - 0.5) * 150,
        vx: 0, vy: 0, fx: null, fy: null,
      });
    });

    Object.entries(GROUPS).forEach(([g, skills]) => {
      const hub = nodes.find(n => n.id === "hub:" + g);
      skills.forEach((s) => {
        const node: SimNode = {
          id: s, group: g, isHub: false,
          x: W / 2 + (Math.random() - 0.5) * 260,
          y: H / 2 + (Math.random() - 0.5) * 260,
          vx: 0, vy: 0, fx: null, fy: null,
        };
        nodes.push(node);
        if (hub) links.push({ source: hub, target: node });
      });
    });

    nodesRef.current = nodes;
    linksRef.current = links;

    const sim = buildSim(nodes, links, W, H);
    simRef.current = sim;

    // Run sim to near-settled before showing
    for (let i = 0; i < 200; i++) sim.tick();
    setReady(true);

    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const ag = activeRef.current;

      // Background grid dots
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let gx = 40; gx < W; gx += 60) {
        for (let gy = 40; gy < H; gy += 60) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Links
      linksRef.current.forEach(({ source: s, target: t }) => {
        const dimmed = ag && s.group !== ag;
        const hov    = hovRef.current?.group === s.group;
        const alpha  = dimmed ? 0.02 : hov ? 0.18 : 0.07;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = dimmed ? "rgba(255,255,255," + alpha + ")" : rgba(s.group, alpha);
        ctx.lineWidth = hov ? 1.0 : 0.5;
        ctx.stroke();
      });

      // Nodes
      nodesRef.current.forEach((n) => {
        const isHov   = hovRef.current?.id === n.id;
        const isDrag  = dragRef.current?.id === n.id;
        const dimmed  = !!(ag && n.group !== ag);
        const hovGrp  = hovRef.current?.group === n.group;
        const dotA    = dimmed ? 0.08 : isHov ? 1.0 : n.isHub ? (hovGrp ? 1.0 : 0.9) : (hovGrp ? 0.85 : 0.55);
        const r       = n.isHub ? 7 : isDrag ? 8 : isHov ? 6 : 3.5;

        // Glow halo for hovered or active group
        if ((isHov || (hovGrp && !dimmed)) && !dimmed) {
          const gR = r + (isHov ? 12 : 6);
          const grad = ctx.createRadialGradient(n.x, n.y, r, n.x, n.y, gR);
          grad.addColorStop(0, rgba(n.group, isHov ? 0.25 : 0.12));
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(n.x, n.y, gR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(n.group, dotA);
        ctx.fill();

        // Hub outer ring
        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 13, 0, Math.PI * 2);
          ctx.strokeStyle = rgba(n.group, dimmed ? 0.05 : hovGrp ? 0.45 : 0.2);
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Labels
        const label  = n.id.startsWith("hub:") ? n.id.replace("hub:", "") : n.id;
        const lAlpha = dimmed ? 0.05 : isHov ? 1.0 : n.isHub ? (hovGrp ? 0.9 : 0.65) : (hovGrp ? 0.7 : 0.32);

        ctx.font = n.isHub
          ? "700 11px 'DM Sans', sans-serif"
          : isHov
          ? "500 11.5px 'JetBrains Mono', monospace"
          : "10px 'JetBrains Mono', monospace";

        ctx.fillStyle = rgba(n.group, lAlpha);
        ctx.textAlign    = n.isHub ? "center" : n.x > W / 2 ? "left" : "right";
        ctx.textBaseline = n.isHub ? "bottom" : "middle";
        const lx = n.isHub ? n.x : (n.x > W / 2 ? n.x + 9 : n.x - 9);
        const ly = n.isHub ? n.y - 15 : n.y;
        ctx.fillText(label, lx, ly);
      });

      // Continue simulation if not settled
      if (simRef.current && !simRef.current.isSettled()) {
        simRef.current.tick();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Mouse interactions
    const pick = (ex: number, ey: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = ex - rect.left;
      const my = ey - rect.top;
      let hit: SimNode | null = null;
      let minD = 22;
      nodesRef.current.forEach(n => {
        const d = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2);
        if (d < minD) { minD = d; hit = n; }
      });
      return { hit, mx, my };
    };

    const onMove = (e: MouseEvent) => {
      const { hit, mx, my } = pick(e.clientX, e.clientY);
      hovRef.current = hit;
      canvas.style.cursor = hit ? (dragRef.current ? "grabbing" : "grab") : "default";
      if (hit && !hit.isHub) {
        setTooltip({ x: mx, y: my - 24, text: hit.id });
      } else {
        setTooltip(null);
      }
      if (dragRef.current) {
        dragRef.current.fx = mx;
        dragRef.current.fy = my;
        simRef.current?.reheat();
      }
    };

    const onDown = (e: MouseEvent) => {
      const { hit, mx, my } = pick(e.clientX, e.clientY);
      if (hit) {
        dragRef.current = hit;
        hit.fx = mx;
        hit.fy = my;
        canvas.style.cursor = "grabbing";
        simRef.current?.reheat();
      }
    };

    const onUp = () => {
      if (dragRef.current) {
        dragRef.current.fx = null;
        dragRef.current.fy = null;
        dragRef.current = null;
      }
      canvas.style.cursor = "default";
    };

    const onClick = (e: MouseEvent) => {
      const { hit } = pick(e.clientX, e.clientY);
      if (hit?.isHub) {
        const g = hit.id.replace("hub:", "");
        setActiveGroup(cur => cur === g ? null : g);
        simRef.current?.reheat();
      }
    };

    const onLeave = () => {
      hovRef.current = null;
      dragRef.current = null;
      setTooltip(null);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup",   onUp);
    canvas.addEventListener("click",     onClick);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      simRef.current?.stop();
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup",   onUp);
      canvas.removeEventListener("click",     onClick);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const cleanup = initGraph();
    return () => { cleanup?.(); };
  }, [initGraph]);

  return (
    <div className="relative w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#303030] mb-1">
            Interactive Skills Graph
          </div>
          <div className="text-[12px] text-[#555] font-light">
            {activeGroup
              ? `Showing ${activeGroup} — ${GROUPS[activeGroup]?.length} skills`
              : "Click a category hub to filter - Drag nodes to rearrange"}
          </div>
        </div>
        {activeGroup && (
          <button
            onClick={() => setActiveGroup(null)}
            className="text-[11px] text-[#555] hover:text-[#9a9a9a] transition-colors px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/[0.13]"
          >
            Clear filter ×
          </button>
        )}
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl overflow-hidden border border-white/[0.07]"
        style={{ height: 440, background: "rgba(10,10,12,0.6)" }}
      >
        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/20"
                  style={{ animation: "bounce 1.2s ease-in-out infinite", animationDelay: i * 0.2 + "s" }}
                />
              ))}
            </div>
            <div className="text-[11px] text-white/25 font-mono">Building skill graph...</div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
        />

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none px-3 py-1.5 rounded-lg text-[11px] font-mono text-[#efefef] bg-[#1a1a1a] border border-white/[0.12] whitespace-nowrap z-10"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
          >
            {tooltip.text}
          </div>
        )}

        {/* Hint overlay — top left */}
        <div className="absolute top-3 left-3 text-[9px] font-mono text-white/15 pointer-events-none select-none">
          drag to reposition nodes
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(GROUP_RGB).map(([group, [r, g, b]]) => {
          const isActive = activeGroup === group;
          return (
            <button
              key={group}
              onClick={() => {
                setActiveGroup(cur => cur === group ? null : group);
                simRef.current?.reheat();
              }}
              onMouseEnter={() => setHoveredGroup(group)}
              onMouseLeave={() => setHoveredGroup(null)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11.5px] font-medium transition-all duration-200"
              style={{
                border: isActive
                  ? "1px solid rgba(" + r + "," + g + "," + b + ",0.55)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: isActive
                  ? "rgba(" + r + "," + g + "," + b + ",0.1)"
                  : hoveredGroup === group
                  ? "rgba(255,255,255,0.04)"
                  : "transparent",
                color: isActive
                  ? "rgb(" + r + "," + g + "," + b + ")"
                  : "rgba(255,255,255,0.35)",
                transform: isActive ? "translateY(-1px)" : "translateY(0)",
                boxShadow: isActive
                  ? "0 4px 16px rgba(" + r + "," + g + "," + b + ",0.15)"
                  : "none",
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: "rgb(" + r + "," + g + "," + b + ")",
                  boxShadow: isActive ? "0 0 6px rgb(" + r + "," + g + "," + b + ")" : "none",
                }}
              />
              {group}
              {isActive && (
                <span className="text-[10px] opacity-60">
                  {GROUPS[group]?.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1.0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
