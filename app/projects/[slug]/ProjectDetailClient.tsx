"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/data";
import { Reveal, SectionLabel, TechTag } from "@/components/ui/primitives";
import { projects } from "@/lib/data";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "outcomes", label: "Outcomes" },
  { id: "lessons", label: "Lessons" },
];

interface Props { project: Project }

export function ProjectDetailClient({ project }: Props) {
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Adjacent projects
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <div className="page-enter pt-24">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[200] h-[2px] bg-border/30">
        <motion.div
          className="h-full bg-text-secondary"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-border">
        {/* Back */}
        <Reveal>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[13px] text-text-muted hover:text-text-secondary transition-colors mb-10 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            All Projects
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
          <div>
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] tracking-[0.1em] uppercase text-text-faint border border-border bg-surface-3 px-2.5 py-1 rounded-md">
                  {project.category}
                </span>
                <span className="text-[11px] tracking-[0.1em] uppercase text-text-faint border border-border bg-surface-3 px-2.5 py-1 rounded-md">
                  {project.year}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display font-light text-display-md text-text-primary mb-4">
                {project.title}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[16px] text-text-muted font-light leading-relaxed max-w-xl">
                {project.subtitle}
              </p>
            </Reveal>
          </div>

          {/* Quick meta card */}
          <Reveal delay={0.14} className="lg:sticky lg:top-24">
            <div className="p-5 rounded-2xl bg-surface-2 border border-border">
              <div className="text-[11px] text-text-faint font-semibold tracking-[0.1em] uppercase mb-3">Stack</div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.stack.map((s) => (
                  <TechTag key={s}>{s}</TechTag>
                ))}
              </div>
              {project.links.length > 0 && (
                <>
                  <div className="text-[11px] text-text-faint font-semibold tracking-[0.1em] uppercase mb-3">Links</div>
                  <div className="flex flex-col gap-2">
                    {project.links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors group"
                      >
                        <ExternalLink size={12} className="text-text-faint group-hover:text-text-muted transition-colors" />
                        {l.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Thumb */}
      <Reveal className="max-w-7xl mx-auto px-6 py-10">
        <div
          className={`w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br ${project.gradient} border border-border flex items-center justify-center overflow-hidden relative`}
        >
          <span className="font-mono text-[100px] text-text-faint/20 select-none">{project.emoji}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-2/50 to-transparent" />
        </div>
      </Reveal>

      {/* Body — sticky sidebar nav + content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-16 items-start">
          {/* Sticky sidebar nav */}
          <div className="hidden lg:block sticky top-24">
            <div className="text-[11px] text-text-faint font-semibold tracking-[0.1em] uppercase mb-4">On This Page</div>
            <nav className="space-y-1">
              {SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                    activeSection === id
                      ? "text-text-primary bg-surface-4 border border-border"
                      : "text-text-faint hover:text-text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="max-w-2xl space-y-16 pt-2">
            {/* Overview */}
            <div ref={(el) => { sectionRefs.current["overview"] = el; }}>
              <Reveal>
                <SectionLabel>Overview</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-4 tracking-tight">What this project is</h2>
                <p className="text-[15px] text-text-secondary font-light leading-[1.85]">{project.overview}</p>
              </Reveal>
            </div>

            {/* Challenge */}
            <div ref={(el) => { sectionRefs.current["challenge"] = el; }}>
              <Reveal>
                <SectionLabel>Challenge</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-4 tracking-tight">The problem to solve</h2>
                <p className="text-[15px] text-text-secondary font-light leading-[1.85]">{project.challenge}</p>
              </Reveal>
            </div>

            {/* Solution */}
            <div ref={(el) => { sectionRefs.current["solution"] = el; }}>
              <Reveal>
                <SectionLabel>Solution</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-4 tracking-tight">How I solved it</h2>
                <p className="text-[15px] text-text-secondary font-light leading-[1.85]">{project.solution}</p>
              </Reveal>
            </div>

            {/* Architecture */}
            <div ref={(el) => { sectionRefs.current["architecture"] = el; }}>
              <Reveal>
                <SectionLabel>Architecture</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-4 tracking-tight">System design</h2>
                <div className="p-5 rounded-xl bg-surface-2 border border-border mb-4">
                  <p className="text-[13px] text-text-secondary font-mono leading-relaxed">{project.architecture}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <TechTag key={s}>{s}</TechTag>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Outcomes */}
            <div ref={(el) => { sectionRefs.current["outcomes"] = el; }}>
              <Reveal>
                <SectionLabel>Outcomes</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-5 tracking-tight">Results &amp; impact</h2>
                <ul className="space-y-3">
                  {project.outcomes.map((o, i) => (
                    <Reveal key={i} delay={i * 0.06}>
                      <li className="flex items-start gap-3 p-4 rounded-xl bg-surface-2 border border-border">
                        <CheckCircle2 size={15} className="text-text-faint mt-0.5 flex-shrink-0" />
                        <span className="text-[14px] text-text-secondary font-light">{o}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Lessons */}
            <div ref={(el) => { sectionRefs.current["lessons"] = el; }}>
              <Reveal>
                <SectionLabel>Lessons Learned</SectionLabel>
                <h2 className="font-display font-light text-[28px] text-text-primary mb-4 tracking-tight">What I'd do differently</h2>
                <div className="p-5 rounded-xl border-l-2 border-border-strong bg-surface-2">
                  <p className="text-[15px] text-text-secondary font-light leading-[1.85] italic">&ldquo;{project.lessons}&rdquo;</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Adjacent project nav */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex items-center justify-between gap-6">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-border-strong hover:bg-surface-3 transition-all duration-200 flex-1"
            >
              <ArrowLeft size={14} className="text-text-faint group-hover:-translate-x-0.5 transition-transform" />
              <div>
                <div className="text-[11px] text-text-faint mb-0.5">Previous</div>
                <div className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">{prev.title}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}

          <Link href="/projects" className="text-[12px] text-text-faint hover:text-text-muted transition-colors flex-shrink-0">
            All Projects
          </Link>

          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-border-strong hover:bg-surface-3 transition-all duration-200 flex-1 justify-end text-right"
            >
              <div>
                <div className="text-[11px] text-text-faint mb-0.5">Next</div>
                <div className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">{next.title}</div>
              </div>
              <ArrowRight size={14} className="text-text-faint group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </div>
    </div>
  );
}
