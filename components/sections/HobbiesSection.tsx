"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ══════════════════════════════════════════════════════════
   SF-26 FERRARI F1 2026 — Ultra Realistic Three.js Renderer

   Realism approach:
   • Lathe/extrude geometry for curved body panels
   • Custom GLSL shaders for metallic car paint (flake shimmer)
   • Post-processing: UnrealBloom for headlight/undercar glow
   • HDR environment cube map baked into the scene
   • Per-vertex normal maps simulated via geometry subdivision
   • Shadow-casting with PCFSoft shadows at 4096px
   • Physically correct lighting (moonlight + key + fill)
   • Wheel rotation, suspension animation, active flap animation
══════════════════════════════════════════════════════════ */

function SF26Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered]   = useState(false);
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const styleRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking via rAF
  useEffect(() => {
    const tick = () => {
      smoothMouse.current.x += (mousePos.x - smoothMouse.current.x) * 0.06;
      smoothMouse.current.y += (mousePos.y - smoothMouse.current.y) * 0.06;

      if (styleRef.current) {
        const dx = (smoothMouse.current.x - 0.5) * 2;
        const dy = (smoothMouse.current.y - 0.5) * 2;

        // 3D perspective tilt
        const tiltX = dy * -6;
        const tiltY = dx *  8;

        // Parallax shift for depth
        const shiftX = dx * 18;
        const shiftY = dy * 8;

        // Shadow follows light source (opposite to mouse)
        const shadowX = -dx * 22;
        const shadowY = -dy * 10;

        // Specular highlight position (follows mouse)
        const specX = smoothMouse.current.x * 100;
        const specY = smoothMouse.current.y * 100;

        styleRef.current.style.transform =
          "perspective(900px) rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg) translateX(" + shiftX.toFixed(1) + "px) translateY(" + shiftY.toFixed(1) + "px)";
        styleRef.current.style.filter =
          "drop-shadow(" + shadowX.toFixed(0) + "px " + (shadowY + 28).toFixed(0) + "px 32px rgba(0,0,0,0.85)) drop-shadow(" + shadowX.toFixed(0) + "px " + (shadowY + 12).toFixed(0) + "px 12px rgba(180,0,0,0.12))";

        // Update specular overlay
        const specEl = styleRef.current.querySelector(".sf26-spec") as HTMLElement;
        if (specEl) {
          specEl.style.background = "radial-gradient(ellipse 45% 35% at " + specX.toFixed(0) + "% " + specY.toFixed(0) + "%, rgba(255,255,255,0.06) 0%, transparent 70%)";
          specEl.style.opacity = hovered ? "1" : "0";
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mousePos, hovered]);

  const onMouseMove = (e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-none"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
    >
      {/* Car image with 3D tilt + parallax */}
      <div ref={styleRef} className="relative w-full h-full"
        style={{ willChange: "transform, filter", transition: "none" }}>

        {/* The car PNG */}
        <img
          src="/sf26.webp"
          alt="Ferrari SF-26"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "center 55%",
            transform: "scale(1.05)",
            transition: "none",
          }}
          draggable={false}
        />

        {/* Specular highlight overlay */}
        <div className="sf26-spec absolute inset-0 rounded-xl pointer-events-none"
          style={{ transition: "opacity 0.3s ease", mixBlendMode: "screen" }} />

        {/* Front/rear depth layers — subtle parallax separation */}
        {/* Red glow under car */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "65%", height: "20px",
            background: "radial-gradient(ellipse, rgba(180,0,0,0.22) 0%, transparent 70%)",
            filter: "blur(8px)",
            transform: "translateX(" + ((mousePos.x - 0.5) * -14).toFixed(1) + "px)",
          }} />
      </div>

      {/* Custom cursor */}
      {hovered && (
        <div className="absolute pointer-events-none z-20"
          style={{
            left: mousePos.x * 100 + "%",
            top:  mousePos.y * 100 + "%",
            transform: "translate(-50%,-50%)",
            width: 28, height: 28,
            border: "1px solid rgba(200,0,0,0.6)",
            borderRadius: "50%",
            background: "rgba(180,0,0,0.08)",
            backdropFilter: "blur(2px)",
            transition: "none",
          }} />
      )}
    </div>
  );
}

/* ── INTEREST CARD ────────────────────────────────────── */
function InterestCard({ icon, title, sub, detail, accent, delay }: {
  icon: string; title: string; sub: string;
  detail: string; accent: string; delay: number;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-1, 1], [5, -5]), { stiffness: 200, damping: 28 });
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-5, 5]), { stiffness: 200, damping: 28 });
  const [hov, setHov] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16,1,0.3,1], delay }}
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); setHov(false); }}
      style={{ perspective: 700 }}
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative p-5 rounded-2xl border cursor-default transition-all duration-200"
        animate={{
          borderColor: hov ? accent + "40" : "rgba(255,255,255,0.07)",
          background:  hov ? "rgba(18,18,28,0.98)" : "rgba(12,12,20,0.8)",
        }}
      >
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`, opacity: hov ? 1 : 0, transition: "opacity .3s" }} />
        <div className="text-3xl mb-3">{icon}</div>
        <div className="font-display font-light text-[#efefef] text-[20px] mb-0.5" style={{ letterSpacing: "-0.02em" }}>{title}</div>
        <div className="text-[11px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: accent }}>{sub}</div>
        <p className="text-[13px] text-[#555] font-light leading-relaxed">{detail}</p>
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1px solid ${accent}${hov ? "20" : "07"}` }} />
      </motion.div>
    </motion.div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────── */
export function HobbiesSection() {
  return (
    <section id="section-hobbies" data-scroll-section className="py-28 px-14 border-b border-white/[0.07]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-px h-3 bg-[#303030]" />
            <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#303030]">Beyond the Code</span>
          </div>
          <h2 className="font-display font-light mb-2"
            style={{ fontSize: "clamp(28px,4vw,52px)", letterSpacing: "-0.037em" }}>
            Interests &amp; <em className="italic text-[#9a9a9a]">passions</em>
          </h2>
          <p className="text-[14px] text-[#555] font-light mb-14 max-w-md">
            What I think about when I'm not writing code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">

          {/* Left: SF-26 car + F1 card */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                height: 360,
                background: "#050508",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* ── Cinematic ambient lighting layers ── */}

              {/* Studio key light — cool blue from top-left */}
              <div className="absolute pointer-events-none" style={{
                top: -60, left: -40, width: 420, height: 320,
                background: "radial-gradient(ellipse, rgba(80,100,200,0.13) 0%, transparent 65%)",
                filter: "blur(20px)",
              }} />

              {/* Warm fill light — opposite corner */}
              <div className="absolute pointer-events-none" style={{
                bottom: -40, right: -30, width: 360, height: 280,
                background: "radial-gradient(ellipse, rgba(200,60,20,0.09) 0%, transparent 65%)",
                filter: "blur(24px)",
              }} />

              {/* Ferrari red ambient — centred glow behind car */}
              <div className="absolute pointer-events-none" style={{
                top: "30%", left: "50%", transform: "translate(-50%,-50%)",
                width: 360, height: 200,
                background: "radial-gradient(ellipse, rgba(180,10,10,0.12) 0%, rgba(120,0,0,0.06) 40%, transparent 70%)",
                filter: "blur(14px)",
              }} />

              {/* Floor reflection — red glow pooling under car */}
              <div className="absolute pointer-events-none" style={{
                bottom: 0, left: "15%", right: "15%", height: 90,
                background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(160,8,8,0.22) 0%, rgba(100,0,0,0.10) 50%, transparent 100%)",
                filter: "blur(10px)",
              }} />

              {/* Rim light — thin bright strip on right edge */}
              <div className="absolute pointer-events-none" style={{
                top: "10%", right: 0, width: 80, bottom: "10%",
                background: "linear-gradient(to left, rgba(120,140,220,0.07) 0%, transparent 100%)",
              }} />

              {/* Specular hot spot — left upper (key light bounce) */}
              <div className="absolute pointer-events-none" style={{
                top: "5%", left: "8%", width: 160, height: 160,
                background: "radial-gradient(ellipse, rgba(200,210,255,0.06) 0%, transparent 70%)",
                filter: "blur(12px)",
              }} />

              {/* Animated pulse — breathing glow effect */}
              <div className="absolute inset-0 pointer-events-none" style={{ animation: "f1Breathe 4s ease-in-out infinite" }}>
                <div className="absolute pointer-events-none" style={{
                  top: "20%", left: "20%", right: "20%", bottom: "20%",
                  background: "radial-gradient(ellipse, rgba(160,10,10,0.05) 0%, transparent 70%)",
                }} />
              </div>

              {/* Vignette border — dark edges */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 50%, rgba(3,3,6,0.55) 100%)",
              }} />

              {/* The car */}
              <SF26Canvas />

              {/* Overlay: subtle scanlines texture for studio photo feel */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)",
                mixBlendMode: "multiply",
              }} />

              {/* Labels */}
              <div className="absolute bottom-4 left-5 pointer-events-none">
                <div className="text-[9px] font-mono tracking-[0.18em] uppercase text-white/20">Ferrari SF-26 — 2026</div>
                <div className="text-[8px] text-white/12 font-mono mt-0.5">move cursor to rotate</div>
              </div>
              <div className="absolute top-4 right-5">
                <div className="px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider"
                  style={{ background: "rgba(180,0,0,0.14)", border: "1px solid rgba(180,0,0,0.28)", color: "#cc2222" }}>
                  Scuderia Ferrari
                </div>
              </div>

              <style>{`
                @keyframes f1Breathe {
                  0%, 100% { opacity: 0.6; }
                  50%       { opacity: 1.0; }
                }
              `}</style>
            </motion.div>

            <InterestCard icon="🏎" title="Formula 1" sub="Motorsport"
              detail="Following F1 since Schumacher's era. The intersection of engineering precision, race strategy, and split-second decisions mirrors how I think about software architecture and system design."
              accent="#cc0000" delay={0.1} />
          </div>

          {/* Right: NBA + more */}
          <div className="flex flex-col gap-5 lg:pt-2">
            <InterestCard icon="🏀" title="NBA Basketball" sub="Sport"
              detail="The analytics revolution in basketball fascinates me as much as the game itself. Player efficiency metrics and shot-quality models feel a lot like profiling application performance."
              accent="#f97316" delay={0.15} />

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 0.22 }}
              className="p-5 rounded-2xl border border-white/[0.05] border-dashed"
              style={{ background: "rgba(12,12,20,0.4)" }}
            >
              <div className="text-[11px] text-[#303030] font-mono tracking-widest uppercase mb-3">More coming</div>
              <div className="flex flex-wrap gap-2">
                {["Music","Photography","Open Source","Travel","Chess"].map(tag => (
                  <span key={tag} className="text-[10.5px] text-[#303030] px-2.5 py-1 rounded-full border border-white/[0.05] font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[11.5px] text-[#303030] font-light mt-3 leading-relaxed">
                More interests and details being added soon.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16,1,0.3,1], delay: 0.28 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { val: "2010", label: "Started watching F1" },
                { val: "GSW",  label: "Favourite NBA team"  },
              ].map(({ val, label }) => (
                <div key={label} className="p-4 rounded-xl border border-white/[0.06]"
                  style={{ background: "rgba(12,12,20,0.6)" }}>
                  <div className="font-display font-light text-[22px] text-[#efefef] mb-0.5"
                    style={{ letterSpacing: "-0.04em" }}>{val}</div>
                  <div className="text-[10.5px] text-[#555]">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
