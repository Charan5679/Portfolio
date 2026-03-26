"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number; op: number;
}
interface Edge { a: number; b: number; op: number; }
interface Particle { edge: Edge; t: number; speed: number; rev: boolean; size: number; }
interface Frag { x: number; y: number; ch: string; op: number; }

const CHARS = ["0","1","f","a","e","b","c","d","→","λ","∑","∀","∃","∈","≡","⊕"];

export function CSBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -999, y: -999 });
  const frameRef = useRef(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let nodes: Node[] = [], edges: Edge[] = [], particles: Particle[] = [], frags: Frag[] = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildScene();
    }

    function buildScene() {
      const count = Math.min(28, Math.floor(W * H / 32000));
      nodes = Array.from({ length: count }, () => ({
        x:  60 + Math.random() * (W - 120),
        y:  60 + Math.random() * (H - 120),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r:  1.4 + Math.random() * 1.6,
        op: 0.16 + Math.random() * 0.22,
      }));

      edges = [];
      const maxDist = W * 0.19;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx*dx + dy*dy) < maxDist && Math.random() > 0.42) {
            edges.push({ a: i, b: j, op: 0.04 + Math.random() * 0.04 });
          }
        }
      }

      particles = [];
      for (let i = 0; i < 14; i++) spawnParticle();

      frags = [];
      const fc = Math.floor(W * H / 20000);
      for (let i = 0; i < fc; i++) {
        frags.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          ch: CHARS[Math.floor(Math.random() * CHARS.length)],
          op: 0.022 + Math.random() * 0.028,
        });
      }
    }

    function spawnParticle() {
      if (!edges.length) return;
      const e = edges[Math.floor(Math.random() * edges.length)];
      particles.push({ e, t: Math.random(), speed: 0.0007 + Math.random() * 0.0013, rev: Math.random() > 0.5, size: 0.8 + Math.random() });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      frameRef.current++;

      // grid
      const step = 54;
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = step; x < W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = step; y < H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      // fragments
      ctx.font = "10px 'JetBrains Mono', monospace";
      frags.forEach(f => {
        ctx.fillStyle = `rgba(255,255,255,${f.op})`;
        ctx.fillText(f.ch, f.x, f.y);
      });

      // move nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 40 || n.x > W - 40) n.vx *= -1;
        if (n.y < 40 || n.y > H - 40) n.vy *= -1;
        const dx = mouse.current.x - n.x, dy = mouse.current.y - n.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 170 && d > 1) { n.vx += (dx/d)*0.0045; n.vy += (dy/d)*0.0045; }
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > 0.45) { n.vx *= 0.45/spd; n.vy *= 0.45/spd; }
      });

      // edges
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        const dx = a.x-b.x, dy = a.y-b.y;
        const df = Math.max(0, 1 - Math.sqrt(dx*dx+dy*dy)/(W*0.19));
        const mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
        const md = Math.sqrt((mouse.current.x-mx)**2 + (mouse.current.y-my)**2);
        const mb = Math.max(0, 1 - md/200) * 0.09;
        ctx.strokeStyle = `rgba(255,255,255,${(e.op + mb) * df})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });

      // nodes
      nodes.forEach(n => {
        const md = Math.sqrt((mouse.current.x-n.x)**2 + (mouse.current.y-n.y)**2);
        const glow = Math.max(0, 1 - md/130);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow*0.9, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${n.op + glow*0.16})`;
        ctx.fill();
      });

      // particles
      particles.forEach(p => {
        p.t += p.rev ? -p.speed : p.speed;
        if (p.t > 1) { p.t = 1; p.rev = true; }
        if (p.t < 0) { p.t = 0; p.rev = false; }
        const fade = p.t < 0.12 ? p.t/0.12 : p.t > 0.88 ? (1-p.t)/0.12 : 1;
        const a = nodes[p.e.a], b = nodes[p.e.b];
        ctx.beginPath();
        ctx.arc(a.x+(b.x-a.x)*p.t, a.y+(b.y-a.y)*p.t, p.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${fade*0.5})`;
        ctx.fill();
      });
      if (frameRef.current % 90 === 0 && particles.length < 18) spawnParticle();

      rafRef.current = requestAnimationFrame(draw);
    }

    const onMouseMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", resize);

    resize();
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
