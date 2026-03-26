"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { experience, education } from "@/lib/data";
import { Reveal, SectionLabel, TechTag } from "@/components/ui/primitives";

export function ExperienceClient() {
  const [expanded, setExpanded] = useState<string>(experience[0].id);

  return (
    <div className="page-enter pt-24">
      <div className="max-w-7xl mx-auto px-14 py-20 border-b border-white/[0.07]">
        <Reveal><SectionLabel>Career</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display font-light mt-2 mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-0.037em", lineHeight: "1.03" }}>
            Work <em className="italic text-[#9a9a9a]">Experience</em>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[14px] text-[#555] font-light max-w-md leading-relaxed">Engineering roles and academic projects that define my technical foundation.</p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">
          {/* Timeline */}
          <div>
            <Reveal><SectionLabel className="mb-6">Roles</SectionLabel></Reveal>
            <div className="space-y-3">
              {experience.map((exp, i) => {
                const isOpen = expanded === exp.id;
                return (
                  <Reveal key={exp.id} delay={i * 0.06}>
                    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "bg-[#1a1a1a] border-white/[0.13]" : "bg-[#141414] border-white/[0.07] hover:border-white/[0.13] hover:bg-[#1a1a1a]"}`}>
                      <button onClick={() => setExpanded(isOpen ? "" : exp.id)} className="w-full text-left px-6 py-5 flex items-start gap-5 group">
                        <div className="flex flex-col items-center pt-1 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full border transition-colors ${isOpen ? "bg-[#9a9a9a] border-[#9a9a9a]" : "bg-transparent border-white/[0.2]"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[10.5px] font-mono text-[#303030] mb-1">{exp.period}</div>
                              <div className="font-display text-[22px] font-light text-[#9a9a9a] group-hover:text-[#efefef] transition-colors leading-tight mb-0.5" style={{ letterSpacing: "-0.025em" }}>{exp.role}</div>
                              <div className="text-[13px] text-[#555]">{exp.company} <span className="text-[#303030] ml-1.5">- {exp.companyType}</span></div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="hidden sm:block text-[10px] text-[#303030] font-mono bg-[#202020] border border-white/[0.07] px-2.5 py-1 rounded-md">{exp.highlight}</span>
                              <ChevronDown size={14} className={`text-[#303030] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }} className="overflow-hidden">
                            <div className="px-6 pb-6 ml-7 border-l border-white/[0.05]">
                              <p className="text-[13.5px] text-[#9a9a9a] font-light leading-relaxed mb-4">{exp.description}</p>
                              <ul className="space-y-2 mb-5">
                                {exp.bullets.map((b, j) => (
                                  <li key={j} className="flex items-start gap-2.5 text-[12.5px] text-[#555]">
                                    <span className="text-[#303030] mt-1.5 flex-shrink-0 text-[9px]">—</span>
                                    <span className="font-light leading-relaxed">{b}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.stack.map((t) => <TechTag key={t}>{t}</TechTag>)}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Education as second section */}
            <div className="mt-10">
              <Reveal><SectionLabel className="mb-6">Education</SectionLabel></Reveal>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="p-5 rounded-2xl bg-[#141414] border border-white/[0.07] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-medium text-[#efefef] mb-0.5">{edu.degree}</div>
                        <div className="text-[12.5px] text-[#9a9a9a] mb-1">{edu.school} - {edu.location}</div>
                        <div className="text-[12px] text-[#555] font-light">{edu.notes}</div>
                      </div>
                      <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{edu.period}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Reveal>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">By the numbers</div>
                <div className="grid grid-cols-2 gap-4">
                  {[{v:"25%",l:"Latency reduced"},{v:"5mo",l:"Internship"},{v:"2",l:"AI/ML projects"},{v:"2026",l:"Graduating"}].map(({v,l})=>(
                    <div key={l}><div className="font-display text-[26px] font-light text-[#efefef]" style={{letterSpacing:"-0.04em"}}>{v}</div><div className="text-[11px] text-[#555]">{l}</div></div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-3">Availability</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="relative flex h-[5px] w-[5px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-emerald-500" />
                  </span>
                  <span className="text-[12px] text-[#9a9a9a] font-medium">Open to work</span>
                </div>
                <p className="text-[11.5px] text-[#555] font-light leading-snug">Full-time roles - May 2026 - Cleveland, OH</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/resume" className="flex items-center justify-between p-4 rounded-xl border border-white/[0.07] bg-[#1a1a1a] hover:border-white/[0.13] hover:bg-[#202020] transition-all duration-200 group">
                <span className="text-[13px] text-[#9a9a9a] group-hover:text-[#efefef] transition-colors">Download full resume</span>
                <ArrowRight size={13} className="text-[#303030] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
