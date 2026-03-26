"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "@/lib/data";
import { Reveal, SectionLabel } from "@/components/ui/primitives";

const CATEGORY_ICONS: Record<string, string> = {
  "Languages": "{ }",
  "AI / ML": "∿",
  "Frontend": "◱",
  "Backend": "⟐",
  "Data & DBs": "◫",
  "Cloud & Infra": "◌",
  "Practices": "◈",
};

const ALL_SKILLS = Object.values(skills).flat();

export function SkillsClient() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const displayedSkills = activeCategory ? skills[activeCategory as keyof typeof skills] : ALL_SKILLS;

  return (
    <div className="page-enter pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-border">
        <Reveal>
          <SectionLabel>Capabilities</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display font-light text-display-lg text-text-primary mt-2 mb-5">
            Skills &amp;{" "}
            <em className="text-text-secondary italic">Technologies</em>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[15px] text-text-muted font-light max-w-md leading-relaxed">
            My full technical toolkit, refined through years of production use across AI, systems, and product engineering.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
          {Object.entries(skills).map(([category, items], i) => (
            <Reveal key={category} delay={i * 0.05}>
              <button
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-surface-4 border-border-strong"
                    : "bg-surface-2 border-border hover:bg-surface-3 hover:border-border-strong"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-surface-5 border border-border flex items-center justify-center font-mono text-text-faint text-sm">
                      {CATEGORY_ICONS[category] || "◌"}
                    </div>
                    <span className="text-[12px] font-semibold text-text-secondary tracking-[0.08em] uppercase">
                      {category}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-faint font-mono">{items.length}</span>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className="text-[12px] text-text-muted bg-surface-3 border border-border/60 px-2.5 py-1 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {items.length > 5 && (
                    <span className="text-[12px] text-text-faint px-2.5 py-1">
                      +{items.length - 5} more
                    </span>
                  )}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Full skills display */}
        <Reveal>
          <div className="border-t border-border pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-light text-[28px] text-text-primary">
                {activeCategory ? activeCategory : "All Skills"}
              </h2>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-[12px] text-text-faint hover:text-text-muted transition-colors"
                >
                  Show all
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory ?? "all"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap gap-3"
              >
                {displayedSkills.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    className={`px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-default ${
                      hoveredSkill === skill
                        ? "bg-surface-5 border-border-strong text-text-primary scale-[1.03]"
                        : "bg-surface-2 border-border text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    <span className="text-[13px] font-medium">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Core competencies narrative */}
        <Reveal className="mt-20">
          <div className="border-t border-border pt-12">
            <SectionLabel>Core Competencies</SectionLabel>
            <h2 className="font-display font-light text-[32px] text-text-primary mb-8 mt-2">What I'm strongest at</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "LLM Systems",
                  body: "Building production RAG pipelines, evaluation frameworks, and LLM-powered applications that actually work at scale — not just impressive demos.",
                  skills: ["RAG", "Evals", "Fine-tuning", "Agents", "Prompt Engineering"],
                },
                {
                  title: "Distributed Systems",
                  body: "High-throughput data pipelines, event-driven architectures, and services designed for the real constraints of production: consistency, fault tolerance, observability.",
                  skills: ["Kafka", "ClickHouse", "Kubernetes", "Go", "Distributed Tracing"],
                },
                {
                  title: "Full-Stack Engineering",
                  body: "End-to-end product delivery — from database schema to React UI. I can own an entire feature surface and make decisions that age well.",
                  skills: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Redis"],
                },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="p-6 rounded-2xl bg-surface-2 border border-border hover:border-border-strong hover:bg-surface-3 transition-all duration-200">
                    <div className="font-display text-[20px] text-text-primary mb-2">{item.title}</div>
                    <p className="text-[13px] text-text-muted leading-relaxed mb-4 font-light">{item.body}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((s) => (
                        <span key={s} className="text-[11px] text-text-faint bg-surface-4 border border-border/60 px-2 py-0.5 rounded font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
