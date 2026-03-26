"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { stats, projects, experience, skills } from "@/lib/data";
import { AnimatedCounter, Reveal, SectionLabel, TechTag } from "@/components/ui/primitives";

/* ── STATS ── */
export function StatsSection() {
  return (
    <section className="py-20 px-14">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-2xl overflow-hidden border border-white/[0.07]">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="bg-[#101010] px-8 py-10 hover:bg-[#1a1a1a] transition-colors duration-200">
              <div className="font-display font-light leading-none tracking-[-0.04em] text-[#efefef] mb-2"
                style={{ fontSize: "clamp(38px, 5vw, 62px)" }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[11.5px] text-[#555]">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── SKILLS MARQUEE ── */
export function SkillsMarquee() {
  const allSkills = Object.values(skills).flat();
  const doubled = [...allSkills, ...allSkills];
  return (
    <div className="border-y border-white/[0.07] py-4 overflow-hidden">
      <div className="marquee-inner items-center gap-8 whitespace-nowrap">
        {doubled.map((skill, i) => (
          <span key={i} className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#303030] flex-shrink-0">
            {skill}<span className="ml-8 text-[#303030]/30">-</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── FEATURED PROJECTS (bento) ── */
export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="py-12 px-14">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <Reveal><SectionLabel>Selected Work</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display font-light text-[#efefef]" style={{ fontSize: "clamp(22px, 2.8vw, 36px)", letterSpacing: "-0.03em" }}>
              Selected work
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="hidden md:block">
          <Link href="/projects" className="flex items-center gap-2 text-[12px] text-[#555] hover:text-[#9a9a9a] transition-colors group">
            All projects <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Reveal>
      </div>

      {/* Bento grid — asymmetric */}
      <div className="grid grid-cols-3 gap-[9px]">
        {/* Wide card */}
        <Reveal delay={0} className="col-span-2">
          <BentoCard project={featured[0]} />
        </Reveal>
        {/* Tall stack */}
        <div className="flex flex-col gap-[9px]">
          {featured.slice(1, 3).map((p, i) => (
            <Reveal key={p.slug} delay={0.06 * (i + 1)}>
              <BentoCard project={p} compact />
            </Reveal>
          ))}
        </div>
        {/* Bottom row */}
        {featured.slice(3).map((p, i) => (
          <Reveal key={p.slug} delay={0.12 + i * 0.06}>
            <BentoCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function BentoCard({ project, compact = false }: { project: any; compact?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="group bg-[#141414] border border-white/[0.07] rounded-[13px] overflow-hidden hover:border-white/[0.13] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_18px_52px_rgba(0,0,0,0.75)] cursor-pointer h-full">
        <div className={`px-5 pt-5 ${compact ? "pb-0" : "pb-0"} relative`}>
          <div className="font-mono text-[50px] text-white/[0.08] leading-none mb-4 select-none user-select-none">
            {project.emoji}
          </div>
          <div className="absolute top-5 right-5 text-[10px] tracking-[0.12em] uppercase text-[#303030]">{project.year}</div>
        </div>
        <div className="h-px bg-white/[0.07] mx-5" />
        <div className={`px-5 ${compact ? "py-3" : "py-4"}`}>
          <div className="text-[9.5px] tracking-[0.12em] uppercase text-[#303030] mb-1.5">{project.category}</div>
          <div className="font-display font-light text-[#efefef] mb-1.5 tracking-tight leading-tight" style={{ fontSize: compact ? "16px" : "18px", letterSpacing: "-0.02em" }}>
            {project.title}
          </div>
          {!compact && (
            <p className="text-[12px] text-[#555] line-height-[1.65] font-light mb-3">{project.subtitle}</p>
          )}
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, compact ? 3 : 4).map((t: string) => (
              <span key={t} className="text-[10px] font-mono text-[#555] bg-[#1a1a1a] border border-white/[0.04] px-1.5 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── EXPERIENCE STRIP ── */
export function ExperienceStrip() {
  return (
    <section className="py-12 px-14 border-t border-white/[0.07]">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <Reveal><SectionLabel>Career</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display font-light text-[#efefef]" style={{ fontSize: "clamp(18px, 2.4vw, 28px)", letterSpacing: "-0.03em" }}>
              Where I've worked
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="hidden md:block">
          <Link href="/experience" className="flex items-center gap-2 text-[12px] text-[#555] hover:text-[#9a9a9a] transition-colors group">
            Full history <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Reveal>
      </div>
      <div className="flex flex-col">
        {experience.slice(0, 3).map((exp, i) => (
          <Reveal key={exp.id} delay={i * 0.06}>
            <div className="group grid grid-cols-[80px_1fr_auto] gap-5 py-[13px] border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.02] px-3 rounded-lg -mx-3 transition-colors">
              <div className="font-mono text-[10.5px] text-[#303030] leading-snug pt-0.5">{exp.period.split("–")[0].trim()}<br />{exp.period.split("–")[1]?.trim()}</div>
              <div>
                <div className="font-display text-[19px] font-light text-[#9a9a9a] group-hover:text-[#efefef] transition-colors" style={{ letterSpacing: "-0.025em" }}>{exp.role}</div>
                <div className="text-[12px] text-[#555] mt-0.5">{exp.company}</div>
              </div>
              <span className="font-mono text-[10px] text-[#303030] bg-[#1a1a1a] border border-white/[0.07] px-2.5 py-1 rounded-[5px] self-center whitespace-nowrap">{exp.highlight}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ── */
export function CtaSection() {
  return (
    <section className="py-16 px-14 pb-24">
      <Reveal>
        <div className="relative rounded-[20px] border border-white/[0.07] bg-[#141414] overflow-hidden px-10 py-16 text-center">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 100%)" }} />
          <div className="grid-pattern absolute inset-0 opacity-20" />
          <div className="relative z-10">
            <SectionLabel className="justify-center">Let's work together</SectionLabel>
            <h2 className="font-display font-light text-[#efefef] mt-2 mb-4" style={{ fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-0.03em" }}>
              Have something to build?
            </h2>
            <p className="text-[14.5px] text-[#555] max-w-md mx-auto mb-10 font-light leading-relaxed">
              Open to senior engineering roles, AI consulting, and interesting collaborations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13.5px] hover:bg-[#d0d0d0] transition-all duration-200">
                Get in Touch <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/[0.07] text-[#9a9a9a] text-[13.5px] hover:border-white/[0.13] hover:text-[#efefef] hover:bg-[#202020] transition-all duration-200">
                View My Work
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
