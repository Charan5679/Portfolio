"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Star } from "lucide-react";
import { projects } from "@/lib/data";
import { Reveal, SectionLabel, TechTag } from "@/components/ui/primitives";

const ALL = "All";
const categories = [ALL, ...Array.from(new Set(projects.map((p) => p.category)))];

export function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCategory === ALL || p.category === activeCategory;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="page-enter pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-b border-border">
        <Reveal>
          <SectionLabel>Work</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display font-light text-display-lg text-text-primary mt-2 mb-5">
            Projects &amp;{" "}
            <em className="text-text-secondary italic">Case Studies</em>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[15px] text-text-muted font-light max-w-md leading-relaxed">
            A complete overview of my engineering work — from AI systems to developer tools to full-stack applications.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Controls */}
        <Reveal className="mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 border ${
                    activeCategory === cat
                      ? "bg-surface-4 border-border-strong text-text-primary"
                      : "border-border text-text-muted hover:border-border-strong hover:text-text-secondary bg-transparent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-8 pr-4 py-2 rounded-lg border border-border bg-surface-3 text-[13px] text-text-secondary placeholder:text-text-faint focus:outline-none focus:border-border-strong transition-colors w-[200px]"
              />
            </div>
          </div>
        </Reveal>

        {/* Featured label */}
        {activeCategory === ALL && !query && (
          <Reveal className="mb-4">
            <div className="flex items-center gap-2 mb-6">
              <Star size={12} className="text-text-faint" />
              <span className="text-[11px] text-text-faint tracking-[0.1em] uppercase font-semibold">Featured</span>
            </div>
          </Reveal>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              >
                <Link href={`/projects/${project.slug}`} className="block h-full group">
                  <div className="relative h-full flex flex-col bg-surface-2 border border-border rounded-2xl overflow-hidden hover:border-border-strong transition-all duration-300 hover:-translate-y-1 hover:shadow-elevation-2">
                    {/* Featured dot */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-10 w-1.5 h-1.5 rounded-full bg-text-faint/60" />
                    )}

                    {/* Thumbnail */}
                    <div className={`relative h-44 bg-gradient-to-br ${project.gradient} border-b border-border overflow-hidden flex items-center justify-center`}>
                      <span className="font-mono text-[56px] text-text-faint/30 select-none">{project.emoji}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-2/80 to-transparent" />
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span className="text-[10px] tracking-[0.08em] uppercase text-text-faint bg-background/50 backdrop-blur-sm border border-border/40 px-2 py-0.5 rounded">
                          {project.year}
                        </span>
                        <span className="text-[10px] tracking-[0.08em] uppercase text-text-faint bg-background/50 backdrop-blur-sm border border-border/40 px-2 py-0.5 rounded">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display text-[20px] font-light text-text-primary tracking-tight leading-tight">
                          {project.title}
                        </h3>
                        <ExternalLink
                          size={13}
                          className="text-text-faint opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0"
                        />
                      </div>
                      <p className="text-[13px] text-text-muted leading-relaxed mb-4 flex-1 font-light">
                        {project.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                          <TechTag key={tag}>{tag}</TechTag>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-[11px] text-text-faint">+{project.tags.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-faint text-[15px]">No projects match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
