"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { personal } from "@/lib/data";
import { TechSphere3D } from "@/components/ui/TechSphere3D";

/* ─── LIVE CLOCK ────────────────────────── */
function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const u = () => setTime(new Date().toLocaleTimeString("en-US", {
      timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false,
    }));
    u(); const id = setInterval(u, 1000); return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}

/* ─── INTERACTIVE NAME ───────────────────── */
const NAME_PARTS = ["SRI CHARAN", "VAGALAGANI"];

function InteractiveName() {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const rafRef  = useRef<number>(0);
  const [revealed, setRevealed] = useState(false);
  const [glitchMap, setGlitchMap] = useState<Record<string, string>>({});

  const allLetters = NAME_PARTS.flatMap((p, li) =>
    p.split("").map((ch, ci) => ({ ch, li, ci, key: li + "-" + ci }))
  );

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const GLITCH = "0123456789!@#$%^&*";
    const timers: ReturnType<typeof setTimeout>[] = [];
    allLetters.forEach(({ ch, key }, i) => {
      if (ch === " ") return;
      const delay = i * 38;
      const dur   = 240;
      const steps = 6;
      for (let s = 0; s < steps; s++) {
        timers.push(setTimeout(() => {
          setGlitchMap(m => ({ ...m, [key]: GLITCH[Math.floor(Math.random() * GLITCH.length)] }));
        }, delay + (s * dur) / steps));
      }
      timers.push(setTimeout(() => {
        setGlitchMap(m => { const n = { ...m }; delete n[key]; return n; });
      }, delay + dur));
    });
    return () => timers.forEach(clearTimeout);
  }, [revealed]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const anim = () => {
      letterRefs.current.forEach(el => {
        if (!el) return;
        const r  = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        const dx = mouseX.current - cx;
        const dy = mouseY.current - cy;
        const d  = Math.hypot(dx, dy);
        const s  = Math.max(0, 1 - d / 120);
        if (s > 0 && d > 0.1) {
          el.style.transform  = "translateX(" + (s * (dx / d) * 4).toFixed(1) + "px) translateY(" + (-s * 8).toFixed(1) + "px)";
          el.style.color      = "rgba(255,255,255," + (0.45 + s * 0.55) + ")";
          el.style.textShadow = "0 0 " + (s * 28).toFixed(0) + "px rgba(255,255,255," + (s * 0.35).toFixed(2) + ")";
        } else {
          el.style.transform  = "";
          el.style.color      = "";
          el.style.textShadow = "";
        }
      });
      rafRef.current = requestAnimationFrame(anim);
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  let gi = 0;
  return (
    <div className="mb-8 select-none" style={{ lineHeight: 1 }}>
      {NAME_PARTS.map((part, li) => (
        <div key={li} className="block overflow-visible"
          style={{ marginBottom: li === 0 ? "0.06em" : 0 }}>
          {part.split("").map((ch) => {
            const idx  = gi++;
            const p0   = NAME_PARTS[0].length;
            const key  = li + "-" + (li === 0 ? idx : idx - p0);
            return (
              <motion.span
                key={key}
                ref={el => { letterRefs.current[idx] = el; }}
                initial={{ opacity: 0, y: 24, rotateX: -40 }}
                animate={revealed ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: idx * 0.038 + 0.1 }}
                className="inline-block font-display font-light text-[#efefef] will-change-transform"
                style={{
                  fontSize: "clamp(36px,5.2vw,76px)",
                  letterSpacing: "-0.03em",
                  transformOrigin: "bottom center",
                  transition: "color .12s ease, text-shadow .12s ease, transform .18s cubic-bezier(.34,1.56,.64,1)",
                  width: ch === " " ? "0.28em" : undefined,
                }}
              >
                {glitchMap[key] !== undefined ? glitchMap[key] : ch}
              </motion.span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* --- PORTRAIT --- */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafPartRef   = useRef<number>(0);
  const partsRef     = useRef<Particle[]>([]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX  = useSpring(useTransform(rawY, [-1, 1], [7, -7]),  { stiffness: 180, damping: 28 });
  const rotY  = useSpring(useTransform(rawX, [-1, 1], [-7, 7]), { stiffness: 180, damping: 28 });
  const scaleV = useSpring(1, { stiffness: 260, damping: 30 });

  const [hovered,  setHovered]  = useState(false);
  const [glowPos,  setGlowPos]  = useState({ x: 50, y: 40 });
  const [brackets, setBrackets] = useState(false);

  const W_PHOTO = 260;
  const H_PHOTO = 340;
  const orbitR  = 188;

  // Corner brackets draw-in
  useEffect(() => {
    const t = setTimeout(() => setBrackets(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Particle canvas draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = W_PHOTO;
    canvas.height = H_PHOTO;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, W_PHOTO, H_PHOTO);
      partsRef.current = partsRef.current
        .map((p) => ({
          x:    p.x  + p.vx,
          y:    p.y  + p.vy,
          vx:   p.vx,
          vy:   p.vy + 0.06,
          life: p.life - 1,
          size: p.size,
        }))
        .filter((p) => p.life > 0);

      partsRef.current.forEach((p) => {
        const alpha = (p.life / 60) * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + alpha.toFixed(2) + ")";
        ctx.fill();
      });
      rafPartRef.current = requestAnimationFrame(draw);
    };
    rafPartRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafPartRef.current);
    };
  }, [W_PHOTO, H_PHOTO]);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top)  / r.height;
    rawX.set((px - 0.5) * 2);
    rawY.set((py - 0.5) * 2);
    setGlowPos({ x: px * 100, y: py * 100 });
  };

  const onMouseEnter = () => {
    setHovered(true);
    scaleV.set(1.025);
    // Burst particles
    const newParts: Particle[] = Array.from({ length: 28 }, () => ({
      x:    W_PHOTO * 0.5 + (Math.random() - 0.5) * 80,
      y:    H_PHOTO * 0.35 + (Math.random() - 0.5) * 60,
      vx:   (Math.random() - 0.5) * 2.8,
      vy:   (Math.random() - 1) * 2.4,
      life: 40 + Math.random() * 30,
      size: 0.8 + Math.random() * 1.8,
    }));
    partsRef.current = [...partsRef.current, ...newParts];
  };

  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
    scaleV.set(1);
  };

  const ORBIT_TEXT = "FULL STACK DEV - AI ENGINEER - CSU - CLEVELAND - ";

  const chipData = [
    { label: "-25% latency", sub: "Tech Mahindra", x: -130, y: -60,  delay: 1.4 },
    { label: "M.S. CS",      sub: "Cleveland State", x: 130, y: -80, delay: 1.6 },
    { label: "May 2026",     sub: "Available",       x: 138, y: 80,  delay: 1.8 },
    { label: "4+ projects",  sub: "Shipped",         x: -138, y: 70, delay: 2.0 },
  ];

  const cornerData: Array<{
    id: string;
    t?: number;
    b?: number;
    l?: number;
    r?: number;
    path: string;
  }> = [
    { id: "tl", t: -8, l: -8, path: "M18 2H2V18" },
    { id: "tr", t: -8, r: -8, path: "M0 2H16V18" },
    { id: "bl", b: -8, l: -8, path: "M18 16H2V0"  },
    { id: "br", b: -8, r: -8, path: "M0 16H16V0"  },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center justify-center h-full"
    >
      {/* Rotating orbit text ring */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ width: orbitR * 2 + 44, height: orbitR * 2 + 44 }}
      >
        <svg
          width={orbitR * 2 + 44}
          height={orbitR * 2 + 44}
          viewBox={"0 0 " + (orbitR * 2 + 44) + " " + (orbitR * 2 + 44)}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <path
              id="op2"
              d={"M " + (orbitR + 22) + ",22 a " + orbitR + "," + orbitR + " 0 1,1 -0.001,0"}
              fill="none"
            />
          </defs>
          <text
            style={{
              fontSize: "9px",
              letterSpacing: "0.2em",
              fontFamily: "'JetBrains Mono',monospace",
            }}
            fill="rgba(255,255,255,0.20)"
            fontWeight="600"
          >
            <textPath href="#op2">{ORBIT_TEXT + ORBIT_TEXT}</textPath>
          </text>
        </svg>
      </motion.div>

      {/* Counter-rotating dashed ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{
          width: orbitR * 2 + 12,
          height: orbitR * 2 + 12,
          border: "1px dashed rgba(255,255,255,0.07)",
          borderRadius: "50%",
        }}
      />

      {/* Static inner ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: orbitR * 2 - 14,
          height: orbitR * 2 - 14,
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "50%",
        }}
      />

      {/* Ambient glow behind photo */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        animate={{ opacity: hovered ? 0.9 : 0.5, scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6 }}
        style={{
          width: W_PHOTO + 80,
          height: H_PHOTO + 80,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(180,190,255,0.07) 0%, rgba(100,110,180,0.04) 40%, transparent 70%)",
          filter: "blur(18px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      {/* Floating stat chips */}
      {chipData.map((chip, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: chip.delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute pointer-events-none"
          style={{
            left: "calc(50% + " + chip.x + "px)",
            top:  "calc(50% + " + chip.y + "px)",
            transform: "translate(-50%,-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            className="px-2.5 py-1.5 rounded-xl"
            style={{
              background: "rgba(10,10,14,0.88)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            <div className="text-[11px] font-semibold text-[#efefef] font-mono">{chip.label}</div>
            <div className="text-[9px] text-[#555] mt-0.5 tracking-wide">{chip.sub}</div>
          </motion.div>
        </motion.div>
      ))}

      {/* Photo container with 3D tilt */}
      <motion.div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ perspective: 900, width: W_PHOTO, height: H_PHOTO }}
        className="relative z-10 cursor-default"
      >
        <motion.div
          style={{ rotateX: rotX, rotateY: rotY, scale: scaleV, transformStyle: "preserve-3d" }}
          className="relative w-full h-full"
        >
          {/* Photo wrapper */}
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden"
            style={{
              boxShadow:
                "0 32px 90px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* Base photo */}
            <img
              src="/sri-charan.jpg"
              alt="Sri Charan Vagalagani"
              className="w-full h-full object-cover object-top"
              style={{
                filter: "saturate(0.45) brightness(0.68) contrast(1.12)",
                transform: "scale(1.06)",
                transformOrigin: "top center",
              }}
              draggable={false}
            />

            {/* Radial vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 85% at 50% 38%, transparent 0%, rgba(5,5,8,0.55) 65%, rgba(5,5,8,0.88) 100%)",
              }}
            />

            {/* Bottom dissolve */}
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: "55%",
                background:
                  "linear-gradient(to top, #090909 0%, rgba(9,9,9,0.95) 18%, rgba(9,9,9,0.7) 40%, rgba(9,9,9,0.3) 65%, transparent 100%)",
              }}
            />

            {/* Top dissolve */}
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: "22%",
                background: "linear-gradient(to bottom, rgba(9,9,9,0.6) 0%, transparent 100%)",
              }}
            />

            {/* Side dissolve */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(9,9,9,0.55) 0%, transparent 22%, transparent 78%, rgba(9,9,9,0.55) 100%)",
              }}
            />

            {/* Duotone colour cast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(18,22,45,0.35) 0%, rgba(8,9,18,0.25) 50%, rgba(6,6,10,0.15) 100%)",
                mixBlendMode: "multiply",
              }}
            />

            {/* Data-arc scan effect — animated CSS only, no state */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {/* Vertical sweep beam */}
              <div className="sf26-sweep-beam absolute top-0 bottom-0 pointer-events-none"
                style={{ width: 1, background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.0) 15%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.0) 85%, transparent 100%)", animation: "sfSweep 3.8s cubic-bezier(0.4,0,0.6,1) infinite" }} />
              {/* Delayed second beam */}
              <div className="absolute top-0 bottom-0 pointer-events-none"
                style={{ width: 1, background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.0) 15%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.0) 85%, transparent 100%)", animation: "sfSweep 3.8s cubic-bezier(0.4,0,0.6,1) infinite", animationDelay: "1.9s" }} />
              {/* Horizontal data lines that flash briefly */}
              {[0.22, 0.45, 0.68, 0.88].map((yFrac, i) => (
                <div key={i} className="absolute inset-x-0 pointer-events-none"
                  style={{ top: yFrac * 100 + "%", height: 1, background: "rgba(255,255,255,0.12)", animation: "sfHLine 3.8s ease infinite", animationDelay: (i * 0.22) + "s" }} />
              ))}
            </div>

            {/* Specular highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 55% 45% at " +
                  glowPos.x +
                  "% " +
                  glowPos.y +
                  "%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.25s ease",
              }}
            />

            {/* Particle canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            />

            {/* Arc-scan CSS keyframes */}
            <style>{`
              @keyframes sfSweep {
                0%   { left: -2px;  opacity: 0; }
                5%   { opacity: 1; }
                95%  { opacity: 1; }
                100% { left: calc(100% + 2px); opacity: 0; }
              }
              @keyframes sfHLine {
                0%, 100% { opacity: 0; transform: scaleX(0); }
                48%, 52% { opacity: 1; transform: scaleX(1); }
              }
            `}</style>

            {/* Noise grain */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")",
              }}
            />
          </div>

          {/* Corner brackets */}
          {cornerData.map((c) => (
            <motion.svg
              key={c.id}
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="absolute pointer-events-none"
              style={{
                top:    c.t,
                bottom: c.b,
                left:   c.l,
                right:  c.r,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: brackets ? 0.45 : 0, scale: brackets ? 1 : 0.5 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            >
              <path d={c.path} stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            </motion.svg>
          ))}

          {/* Name badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap"
          >
            <div
              className="flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: "rgba(10,10,12,0.94)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.11)",
                boxShadow: "0 6px 28px rgba(0,0,0,0.75)",
              }}
            >
              <span className="relative flex h-[5px] w-[5px] flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-emerald-500" />
              </span>
              <span className="text-[11.5px] text-[#9a9a9a] font-medium tracking-[0.04em]">
                Sri Charan Vagalagani
              </span>
              <span className="text-[9px] text-[#303030] font-mono">CSU 2026</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── WORD CYCLE ─────────────────────────── */
const WORDS = [
  ["systems","that think."],["products","that scale."],
  ["code","that endures."],["things","that matter."],
];

/* ─── HERO SECTION ──────────────────────── */
export function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVis, setWordVis] = useState(true);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    let wi = 0;
    const id = setInterval(() => {
      setWordVis(false);
      setTimeout(() => { wi=(wi+1)%WORDS.length; setWordIdx(wi); setWordVis(true); }, 220);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.1, delayChildren:0.08 } } };
  const slideUp = { hidden:{opacity:0,y:28}, visible:{opacity:1,y:0, transition:{duration:0.72,ease:[0.16,1,0.3,1]}} };
  const fadeIn  = { hidden:{opacity:0}, visible:{opacity:1, transition:{duration:0.65,ease:"easeOut"}} };

  return (
    <section id="section-home" className="relative min-h-screen overflow-hidden">
      {/* Edge fades */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#090909] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#090909] to-transparent z-20 pointer-events-none" />
      {/* Ambient glow behind portrait */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 60%)" }} />

      {/* ── THREE COLUMN GRID ── */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

        {/* ── LEFT: Text ── */}
        <div className="flex flex-col justify-center px-14 pt-36 pb-20 lg:pt-40">
          <motion.div variants={stagger} initial="hidden" animate="visible">

            {/* Availability */}
            <motion.div variants={fadeIn} className="mb-9">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/[0.07] bg-[#1a1a1a]/80 backdrop-blur-md">
                <span className="relative flex h-[6px] w-[6px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-emerald-500" />
                </span>
                <span className="text-[11.5px] tracking-[0.03em] text-[#9a9a9a]">{personal.availability}</span>
              </div>
            </motion.div>

            {/* Interactive name */}
            <motion.div variants={fadeIn}>
              <InteractiveName />
            </motion.div>

            {/* Role */}
            <motion.div variants={slideUp} className="mb-7 -mt-2">
              <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#555]">
                Full Stack Developer &nbsp;-&nbsp; AI Engineer &nbsp;-&nbsp; CS @ CSU
              </span>
            </motion.div>

            {/* I build */}
            <motion.div variants={slideUp} className="mb-8">
              <p className="font-display font-light text-[#9a9a9a] leading-[1.1]"
                style={{ fontSize:"clamp(20px,2.6vw,36px)", letterSpacing:"-0.03em" }}>
                I build{" "}
                <span className="italic"
                  style={{
                    opacity: wordVis ? 1 : 0,
                    transform: wordVis ? "translateY(0)" : "translateY(7px)",
                    display: "inline-block",
                    transition: "opacity 200ms ease, transform 220ms cubic-bezier(0.16,1,0.3,1)",
                  }}>
                  {WORDS[wordIdx][0]} {WORDS[wordIdx][1]}
                </span>
              </p>
            </motion.div>

            {/* Bio */}
            <motion.p variants={slideUp}
              className="text-[14px] text-[#555] font-light leading-[1.82] max-w-[380px] mb-10">
              {personal.bio}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={slideUp} className="flex flex-wrap items-center gap-3 mb-12">
              <a href="#section-projects"
                className="group inline-flex items-center gap-2.5 px-6 py-[11px] rounded-xl bg-[#efefef] text-[#090909] text-[13px] font-semibold hover:bg-[#d0d0d0] transition-all duration-200 active:scale-[0.977]">
                View Projects <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#section-about"
                className="inline-flex items-center gap-2.5 px-6 py-[11px] rounded-xl bg-[#1a1a1a] border border-white/[0.07] text-[#9a9a9a] text-[13px] hover:border-white/[0.13] hover:text-[#efefef] hover:bg-[#202020] transition-all duration-200">
                About Me
              </a>
              <a href="#section-contact"
                className="inline-flex items-center gap-2 px-4 py-[11px] text-[13px] text-[#555] hover:text-[#9a9a9a] transition-colors">
                Contact <ArrowRight size={12} className="opacity-40" />
              </a>
            </motion.div>

            {/* Meta */}
            <motion.div variants={fadeIn}
              className="flex flex-wrap items-center gap-4 text-[11px] text-[#303030]">
              <div className="flex items-center gap-1.5"><MapPin size={10} /><span>{personal.location}</span></div>
              <div className="w-px h-3 bg-white/[0.07]" />
              <span><LiveTime /><span className="opacity-40 ml-1.5">EST</span></span>
              <div className="w-px h-3 bg-white/[0.07]" />
              <a href={`mailto:${personal.email}`}
                className="hover:text-[#555] transition-colors font-mono text-[10px]">
                {personal.email}
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* ── CENTRE: Portrait ── */}
        <div className="hidden lg:flex items-center justify-center px-8 relative"
          style={{ width: 440, minWidth: 420 }}>
          {/* Left divider */}
          <div className="absolute left-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
          {/* Right divider */}
          <div className="absolute right-0 top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
          <HeroPortrait />
        </div>

        {/* ── RIGHT: 3D Sphere ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.4, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0">
            <TechSphere3D />
          </div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8,duration:0.9}}
            className="absolute top-9 right-9 text-right pointer-events-none z-10">
            <div className="text-[9px] font-mono tracking-[0.18em] uppercase text-[#303030]">Tech Stack - 3D</div>
            <div className="mt-1 w-8 h-px bg-white/[0.07] ml-auto" />
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.1,duration:0.9}}
            className="absolute bottom-9 right-9 pointer-events-none z-10">
            <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-[#303030]/45"
              style={{ writingMode:"vertical-rl", transform:"rotate(180deg)" }}>
              Sri Charan Vagalagani - Portfolio
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:2.4,duration:0.8}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] tracking-[0.2em] uppercase text-[#303030]/50">Scroll</span>
        <motion.div animate={{y:[0,5,0]}} transition={{duration:1.8,repeat:Infinity,ease:"easeInOut"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
