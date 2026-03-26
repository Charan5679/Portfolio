"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── REVEAL WRAPPER ───────────────────────────────────────────
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export function Reveal({ children, delay = 0, className, direction = "up" }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const variants = {
    up: { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } },
    none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────
interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, suffix = "", duration = 1.8, className }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - start) / (duration * 1000);
      const progress = Math.min(1, elapsed);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {current}
      {suffix}
    </span>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 mb-4", className)}>
      <div className="w-px h-3 bg-text-faint/60" />
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-faint">
        {children}
      </span>
    </div>
  );
}

// ─── BADGE ────────────────────────────────────────────────────
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium text-text-muted bg-surface-4 border border-border/70 transition-all duration-150 hover:border-border-strong hover:text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── TECH TAG ─────────────────────────────────────────────────
export function TechTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] text-text-faint bg-surface-3 border border-border/40 font-mono",
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── BUTTON PRIMARY ───────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export function Button({ children, variant = "primary", size = "md", className, ...props }: ButtonProps) {
  const base = "inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer";
  const variants = {
    primary: "bg-text-primary text-background hover:bg-text-secondary active:scale-[0.98]",
    secondary: "bg-surface-4 border border-border text-text-secondary hover:text-text-primary hover:border-border-strong hover:bg-surface-5 active:scale-[0.98]",
    ghost: "text-text-muted hover:text-text-secondary hover:bg-surface-3 active:scale-[0.98]",
  };
  const sizes = {
    sm: "px-3.5 py-2 text-[13px]",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-[15px]",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-[11px] font-semibold tracking-[0.12em] uppercase text-text-faint flex-shrink-0">
            {item}
            {i < doubled.length - 1 && <span className="ml-8 text-text-faint/30">-</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── GRID LINES ───────────────────────────────────────────────
export function GridLines({ className }: { className?: string }) {
  return (
    <div
      className={cn("absolute inset-0 grid-pattern opacity-40 pointer-events-none", className)}
    />
  );
}

// ─── CARD ─────────────────────────────────────────────────────
export function Card({ children, className, onClick }: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-surface-2 border border-border rounded-2xl hover-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn("border-t border-border", className)} />;
}
