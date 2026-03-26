"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Download, Copy, Check, Send, Github, Linkedin, Mail, Phone } from "lucide-react";
import { personal, stats, projects, experience, education, skills, techPhilosophy } from "@/lib/data";
import { HeroSection }         from "@/components/sections/HeroSection";
import { TiltCard }            from "@/components/ui/TiltCard";
import { SkillConstellation }  from "@/components/ui/SkillConstellation";
import { HobbiesSection }      from "@/components/sections/HobbiesSection";
import { TerminalTypewriter }  from "@/components/ui/TerminalTypewriter";
import { TimelineScrubber }    from "@/components/ui/TimelineScrubber";
import { GithubHeatmap }       from "@/components/ui/GithubHeatmap";

/* ── shared helpers ── */
function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-px h-3 bg-[#303030]" />
      <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#303030]">{children}</span>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16,1,0.3,1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TechTag({ children }: { children: string }) {
  return (
    <span className="text-[10px] font-mono text-[#555] bg-[#1a1a1a] border border-white/[0.05] px-1.5 py-0.5 rounded">
      {children}
    </span>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 1800;
    const anim = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setCur(Math.round(e * value));
      if (p < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  }, [inView, value]);
  return <span ref={ref}>{cur}{suffix}</span>;
}

/* ── LIVE TIME ── */
function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const u = () => setTime(new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false }));
    u(); const id = setInterval(u, 1000); return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums">{time}</span>;
}


/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export function ScrollPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);

  // contact form
  type F = { name:string; email:string; subject:string; message:string };
  const [form, setForm] = useState<F>({ name:"", email:"", subject:"", message:"" });
  const [formStatus, setFormStatus] = useState<"idle"|"sending"|"success">("idle");
  const [copied, setCopied] = useState(false);

  const setField = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setFormStatus("sending");
    await new Promise(r => setTimeout(r, 1300));
    setFormStatus("success");
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(personal.email); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  // experience expand
  const [expandedExp, setExpandedExp] = useState<string>(experience[0]?.id ?? "");

  const inputCls = "w-full bg-[#1a1a1a] border border-white/[0.07] rounded-[9px] px-4 py-[9px] text-[13px] text-[#efefef] placeholder:text-[#303030] outline-none focus:border-white/[0.14] transition-colors";

  return (
    <div ref={containerRef} className="relative">

      {/* ══ SECTION 1: HERO ══ */}
      <HeroSection />

      {/* section divider */}
      <div className="h-px bg-white/[0.07]" />

      {/* ══ SECTION 2: STATS MARQUEE ══ */}
      <section data-scroll-section className="py-16 overflow-hidden border-b border-white/[0.07]">
        {/* marquee */}
        <div className="overflow-hidden border-b border-white/[0.05] pb-4 mb-10">
          <div className="marquee-inner items-center gap-8 whitespace-nowrap">
            {[...Object.values(skills).flat(),...Object.values(skills).flat()].map((s,i)=>(
              <span key={i} className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#303030] flex-shrink-0">
                {s}<span className="ml-8 text-[#303030]/30">-</span>
              </span>
            ))}
          </div>
        </div>
        {/* stats */}
        <div data-gsap-reveal className="max-w-7xl mx-auto px-14 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-2xl overflow-hidden border border-white/[0.07]">
          {stats.map((s,i)=>(
            <Reveal key={i} delay={i*0.08}>
              <div className="bg-[#101010] px-8 py-10 hover:bg-[#1a1a1a] transition-colors">
                <div className="font-display font-light leading-none tracking-[-0.04em] text-[#efefef] mb-2"
                  style={{fontSize:"clamp(38px,5vw,62px)"}}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[11.5px] text-[#555]">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ SECTION 3: ABOUT ══ */}
      <section id="section-about" data-scroll-section className="py-28 px-14 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <Reveal><SectionLabel>About</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-light mb-14 mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.037em",lineHeight:"1.03"}}>
              Developer, builder, <em className="italic text-[#9a9a9a]">problem solver.</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
            <div>
              {["I'm a Computer Science graduate student at Cleveland State University (graduating May 2026) with a strong foundation in full-stack development, data structures, and system design.",
                "During my internship at Tech Mahindra, I built real production systems — dynamic web applications, CI/CD pipelines with Docker and Jenkins, and optimized APIs that reduced system latency by 25%.",
                "My academic projects push into AI/ML: a real-time log analytics system with ELK stack and Python Isolation Forest anomaly detection, and a GAN trained from scratch in PyTorch with 20% convergence improvement.",
                "Looking for full-time software engineering roles starting May 2026 — where I can build scalable systems and grow alongside strong engineering teams."
              ].map((p,i)=>(
                <Reveal key={i} delay={i*0.05}>
                  <p className="text-[14.5px] text-[#9a9a9a] font-light leading-[1.85] mb-5">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={0.18}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10">
                  {techPhilosophy.map((item,i)=>(
                    <div key={i} className="p-5 rounded-xl bg-[#141414] border border-white/[0.07] hover:border-white/[0.12] transition-colors">
                      <div className="font-display text-[17px] text-[#efefef] mb-2">{item.title}</div>
                      <p className="text-[12.5px] text-[#555] leading-relaxed font-light">{item.body}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                  <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">Education</div>
                  {education.map((edu,i)=>(
                    <div key={i} className={i>0?"pt-4 mt-4 border-t border-white/[0.05]":""}>
                      <div className="text-[13px] font-medium text-[#efefef] mb-0.5">{edu.degree}</div>
                      <div className="text-[12px] text-[#9a9a9a] mb-0.5">{edu.school} - {edu.location}</div>
                      <div className="text-[11px] text-[#303030] font-mono">{edu.period}</div>
                    </div>
                  ))}
                </div>
                <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                  <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">Timeline</div>
                  {[
                    {year:"2025",ev:"Built Real-time Log Analytics with ELK + Python Isolation Forest."},
                    {year:"2025",ev:"GAN image generator in PyTorch — 20% convergence improvement."},
                    {year:"2024",ev:"Enrolled M.S. CS at Cleveland State University."},
                    {year:"2024",ev:"Java Full Stack internship at Tech Mahindra — −25% latency."},
                    {year:"2023",ev:"Graduated B.S. IT from JNTU, India."},
                  ].map((m,i)=>(
                    <div key={i} className="flex gap-3 pb-4 last:pb-0">
                      <div className="text-[10px] font-mono text-[#303030] pt-0.5 min-w-[36px]">{m.year}</div>
                      <div className="text-[12px] text-[#9a9a9a] font-light leading-snug">{m.ev}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Terminal typewriter */}
            <Reveal delay={0.2} className="mt-8">
              <TerminalTypewriter />
            </Reveal>

            {/* GitHub heatmap */}
            <Reveal delay={0.25} className="mt-6">
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[#303030] mb-4">GitHub Activity</div>
                <GithubHeatmap />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SECTION 4: PROJECTS ══ */}
      <section id="section-projects" data-scroll-section className="py-28 px-14 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <Reveal><SectionLabel>Work</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-light mb-14 mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.037em"}}>
              Projects &amp; <em className="italic text-[#9a9a9a]">case studies</em>
            </h2>
          </Reveal>

          {/* bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[9px] mb-12">
            {projects.map((p,i)=>(
              <Reveal key={p.slug} delay={i*0.06} className={i===0?"md:col-span-2 xl:col-span-2":""}>
                <TiltCard className="h-full">
                <div className="group bg-[#141414] border border-white/[0.07] rounded-[13px] overflow-hidden hover:border-white/[0.13] transition-all duration-300 h-full flex flex-col cursor-default">
                  <div className="px-6 pt-6 pb-0 relative">
                    <div className="font-mono text-[48px] text-white/[0.07] leading-none mb-4 select-none">{p.emoji}</div>
                    <div className="absolute top-6 right-6 text-[10px] tracking-[0.12em] uppercase text-[#303030]">{p.year}</div>
                  </div>
                  <div className="h-px bg-white/[0.07] mx-6" />
                  <div className="px-6 py-4 flex flex-col flex-1">
                    <div className="text-[9.5px] tracking-[0.12em] uppercase text-[#303030] mb-1.5">{p.category}</div>
                    <div className="font-display font-light text-[18px] text-[#efefef] mb-2 tracking-tight leading-tight" style={{letterSpacing:"-0.02em"}}>{p.title}</div>
                    <p className="text-[12.5px] text-[#555] font-light leading-relaxed mb-4 flex-1">{p.subtitle}</p>
                    <div className="flex flex-wrap gap-1">{p.tags.slice(0,5).map(t=><span key={t} className="text-[10px] font-mono text-[#555] bg-[#1a1a1a] border border-white/[0.04] px-1.5 py-0.5 rounded">{t}</span>)}</div>
                  </div>
                </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 5: EXPERIENCE ══ */}
      <section id="section-experience" data-scroll-section className="py-28 px-14 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <Reveal><SectionLabel>Career</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-light mb-14 mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.037em"}}>
              Work <em className="italic text-[#9a9a9a]">experience</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-14">
            <div className="space-y-3">
              {experience.map((exp,i)=>{
                const isOpen = expandedExp === exp.id;
                return (
                  <Reveal key={exp.id} delay={i*0.06}>
                    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${isOpen?"bg-[#1a1a1a] border-white/[0.13]":"bg-[#141414] border-white/[0.07] hover:border-white/[0.12]"}`}>
                      <button onClick={()=>setExpandedExp(isOpen?"":exp.id)} className="w-full text-left px-6 py-5 flex items-start gap-5">
                        <div className={`mt-1 w-2 h-2 rounded-full border flex-shrink-0 transition-colors ${isOpen?"bg-[#9a9a9a] border-[#9a9a9a]":"bg-transparent border-white/[0.2]"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-[10.5px] font-mono text-[#303030] mb-1">{exp.period}</div>
                              <div className="font-display text-[22px] font-light text-[#9a9a9a] hover:text-[#efefef] transition-colors leading-tight mb-0.5" style={{letterSpacing:"-0.025em"}}>{exp.role}</div>
                              <div className="text-[13px] text-[#555]">{exp.company}</div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="hidden sm:block text-[10px] text-[#303030] font-mono bg-[#202020] border border-white/[0.07] px-2.5 py-1 rounded-md">{exp.highlight}</span>
                              <ChevronDown size={14} className={`text-[#303030] transition-transform duration-300 ${isOpen?"rotate-180":""}`} />
                            </div>
                          </div>
                        </div>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.35,ease:[0.16,1,0.3,1]}} className="overflow-hidden">
                            <div className="px-6 pb-6 ml-7 border-l border-white/[0.05]">
                              <p className="text-[13.5px] text-[#9a9a9a] font-light leading-relaxed mb-4">{exp.description}</p>
                              <ul className="space-y-2 mb-5">
                                {exp.bullets.map((b,j)=>(
                                  <li key={j} className="flex items-start gap-2.5 text-[12.5px] text-[#555]">
                                    <span className="text-[#303030] mt-1.5 flex-shrink-0 text-[9px]">—</span>
                                    <span className="font-light leading-relaxed">{b}</span>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-1.5">{exp.stack.map(t=><TechTag key={t}>{t}</TechTag>)}</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
              {/* education as cards below */}
              <div className="pt-8">
                <Reveal><SectionLabel>Education</SectionLabel></Reveal>
                <div className="space-y-3 mt-4">
                  {education.map((edu,i)=>(
                    <Reveal key={i} delay={i*0.06}>
                      <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="text-[14px] font-medium text-[#efefef] mb-0.5">{edu.degree}</div>
                          <div className="text-[12.5px] text-[#9a9a9a]">{edu.school} - {edu.location}</div>
                        </div>
                        <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{edu.period}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
            <Reveal delay={0.1}>
              <div className="space-y-4 lg:sticky lg:top-24">
                <TimelineScrubber />
                <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                  <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">Numbers</div>
                  {[{v:"25%",l:"Latency reduced"},{v:"5mo",l:"Internship"},{v:"2",l:"AI/ML projects"},{v:"2026",l:"Graduating"}].map(({v,l})=>(
                    <div key={l} className="mb-4 last:mb-0">
                      <div className="font-display text-[26px] font-light text-[#efefef]" style={{letterSpacing:"-0.04em"}}>{v}</div>
                      <div className="text-[11px] text-[#555]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SECTION 6: SKILLS ══ */}
      <section id="section-skills" data-scroll-section className="py-28 px-14 border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto">
          <Reveal><SectionLabel>Skills</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 data-gsap-parallax="0.08" className="font-display font-light mb-14 mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.037em"}}>
              Skills &amp; <em className="italic text-[#9a9a9a]">technologies</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <SkillConstellation />
          </Reveal>
        </div>
      </section>

      {/* ══ SECTION 7: HOBBIES ══ */}
      <HobbiesSection />

      {/* ══ SECTION 8: RESUME ══ */}
      <section id="section-resume" data-scroll-section className="py-28 border-b border-white/[0.07]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Reveal><SectionLabel>Resume</SectionLabel></Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display font-light mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.04em",lineHeight:"0.92"}}>
                  Sri Charan <em className="italic text-[#9a9a9a]">Vagalagani</em>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13px] hover:bg-[#d0d0d0] transition-all flex-shrink-0">
                <Download size={13} /> Download PDF
              </button>
            </Reveal>
          </div>
          <Reveal>
            <div className="font-mono text-[11.5px] text-[#555] flex flex-wrap gap-x-4 gap-y-1 mb-10">
              <span>{personal.email}</span><span className="text-[#303030]">-</span>
              <span>{personal.phone}</span><span className="text-[#303030]">-</span>
              <span>{personal.location}</span><span className="text-[#303030]">-</span>
              <span>linkedin.com/in/sricharan</span>
            </div>
          </Reveal>
          {/* summary */}
          <Reveal>
            <div className="mb-8 pb-8 border-b border-white/[0.05]">
              <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#303030] mb-4">Summary</div>
              <p className="text-[13.5px] text-[#9a9a9a] font-light leading-[1.82]">
                Cleveland State University graduate student studying Computer Science with expertise in full-stack development (Java, React, Node.js, Spring Boot) and AI/ML. Reduced system latency by 25% at Tech Mahindra. Building AI-driven projects in anomaly detection and generative models.
              </p>
            </div>
          </Reveal>
          {/* experience */}
          <Reveal>
            <div className="mb-8 pb-8 border-b border-white/[0.05]">
              <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#303030] mb-5">Experience</div>
              {experience.map(exp=>(
                <div key={exp.id} className="mb-5 last:mb-0">
                  <div className="flex justify-between gap-4 mb-1">
                    <div><div className="text-[14px] font-medium text-[#efefef]">{exp.role}</div><div className="text-[12.5px] text-[#9a9a9a]">{exp.company} - {exp.location}</div></div>
                    <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{exp.period}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">{exp.stack.map(t=><TechTag key={t}>{t}</TechTag>)}</div>
                </div>
              ))}
            </div>
          </Reveal>
          {/* education */}
          <Reveal>
            <div className="mb-8 pb-8 border-b border-white/[0.05]">
              <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#303030] mb-5">Education</div>
              {education.map((edu,i)=>(
                <div key={i} className="flex justify-between gap-4 mb-3 last:mb-0">
                  <div><div className="text-[14px] font-medium text-[#efefef]">{edu.degree}</div><div className="text-[12.5px] text-[#9a9a9a]">{edu.school}</div></div>
                  <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{edu.period}</div>
                </div>
              ))}
            </div>
          </Reveal>
          {/* skills */}
          <Reveal>
            <div className="mb-8">
              <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#303030] mb-5">Skills</div>
              <div className="space-y-3">
                {Object.entries(skills).map(([cat,items])=>(
                  <div key={cat} className="flex gap-4">
                    <div className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[#303030] w-28 flex-shrink-0 mt-0.5">{cat}</div>
                    <div className="flex flex-wrap gap-1.5">{items.map(s=><TechTag key={s}>{s}</TechTag>)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SECTION 8: CONTACT ══ */}
      <section id="section-contact" data-scroll-section className="py-28 px-14">
        <div className="max-w-7xl mx-auto">
          <Reveal><SectionLabel>Contact</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-light mb-14 mt-1" style={{fontSize:"clamp(28px,4vw,52px)",letterSpacing:"-0.04em",lineHeight:"1.03"}}>
              Let's build <em className="italic text-[#9a9a9a]">something great.</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
            {/* left info */}
            <Reveal className="space-y-4">
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-3">Direct email</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11.5px] text-[#9a9a9a]">{personal.email}</span>
                  <button onClick={copyEmail} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] bg-[#202020] text-[11px] text-[#555] hover:text-[#9a9a9a] hover:border-white/[0.13] transition-all">
                    {copied?<Check size={11} className="text-emerald-500"/>:<Copy size={11}/>}
                    {copied?"Copied!":"Copy"}
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-3">Find me</div>
                {[{icon:Mail,label:"Email",handle:personal.email,href:`mailto:${personal.email}`},
                  {icon:Phone,label:"Phone",handle:personal.phone,href:`tel:${personal.phone}`},
                  {icon:Github,label:"GitHub",handle:"github.com/sricharan",href:personal.github},
                  {icon:Linkedin,label:"LinkedIn",handle:"linkedin.com/in/sricharan",href:personal.linkedin},
                ].map(({icon:Icon,label,handle,href})=>(
                  <a key={label} href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#202020] transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-[#202020] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-[#555]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-medium text-[#9a9a9a] group-hover:text-[#efefef] transition-colors">{label}</div>
                      <div className="text-[10.5px] text-[#303030] truncate max-w-[160px]">{handle}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.07] flex items-center gap-3">
                <span className="relative flex h-[5px] w-[5px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-[5px] w-[5px] bg-emerald-500" />
                </span>
                <span className="text-[12px] text-[#9a9a9a] font-medium">Available May 2026</span>
                <span className="text-[11px] text-[#303030]">- Cleveland, OH</span>
              </div>
            </Reveal>

            {/* form */}
            <Reveal delay={0.08}>
              <AnimatePresence mode="wait">
                {formStatus==="success"?(
                  <motion.div key="suc" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} transition={{duration:0.4,ease:[0.16,1,0.3,1]}}
                    className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-2xl border border-white/[0.07] bg-[#141414] min-h-[380px]">
                    <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.15,type:"spring",stiffness:400,damping:25}}
                      className="w-12 h-12 rounded-2xl bg-[#202020] border border-white/[0.07] flex items-center justify-center mb-5">
                      <Check size={20} className="text-[#9a9a9a]" />
                    </motion.div>
                    <h3 className="font-display text-[26px] font-light text-[#efefef] mb-3" style={{letterSpacing:"-0.02em"}}>Message sent</h3>
                    <p className="text-[13.5px] text-[#555] font-light max-w-xs">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                  </motion.div>
                ):(
                  <motion.form key="form" onSubmit={submitForm} className="p-7 rounded-2xl border border-white/[0.07] bg-[#141414] space-y-4">
                    <div className="text-[17px] font-display font-light text-[#efefef] mb-5">Send a message</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Name</label>
                        <input value={form.name} onChange={setField("name")} placeholder="Your name" className={inputCls} required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Email</label>
                        <input type="email" value={form.email} onChange={setField("email")} placeholder="you@example.com" className={inputCls} required />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Subject</label>
                      <input value={form.subject} onChange={setField("subject")} placeholder="What's this about?" className={inputCls} required />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Message</label>
                      <textarea value={form.message} onChange={setField("message")} placeholder="Tell me about the role or project..." className={`${inputCls} h-[110px] resize-none`} required />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#303030]">Response within 24 h</span>
                      <button type="submit" disabled={formStatus==="sending"}
                        className="inline-flex items-center gap-2 px-6 py-[10px] rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13px] hover:bg-[#d0d0d0] transition-all disabled:opacity-60">
                        {formStatus==="sending"?(
                          <><motion.div animate={{rotate:360}} transition={{duration:0.8,repeat:Infinity,ease:"linear"}}
                            className="w-3.5 h-3.5 border-2 border-[#090909]/30 border-t-[#090909] rounded-full"/>Sending...</>
                        ):<>Send Message <Send size={13}/></>}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  );
}
