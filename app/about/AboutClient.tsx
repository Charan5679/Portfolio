"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail, Phone } from "lucide-react";
import { personal, education, techPhilosophy } from "@/lib/data";
import { Reveal, SectionLabel } from "@/components/ui/primitives";

const milestones = [
  { year: "2025", event: "Built Real-time Log Analytics system with ML anomaly detection using ELK stack and Python Isolation Forest." },
  { year: "2025", event: "Developed GAN-based image generator in PyTorch — 20% improvement in model convergence." },
  { year: "2024", event: "Enrolled in M.S. Computer Science at Cleveland State University, Cleveland, OH." },
  { year: "2024", event: "Completed Java Full Stack internship at Tech Mahindra — reduced system latency by 25%." },
  { year: "2023", event: "Graduated B.S. Information Technology from JNTU, India." },
  { year: "2023", event: "Began building full-stack projects with React, Node.js, Spring Boot, and cloud platforms." },
];

export function AboutClient() {
  return (
    <div className="page-enter pt-24">
      <div className="max-w-7xl mx-auto px-14 py-20 border-b border-white/[0.07]">
        <Reveal><SectionLabel>About</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display font-light mt-2 mb-5 leading-[1.02]" style={{ fontSize: "clamp(32px,5vw,58px)", letterSpacing: "-0.037em" }}>
            Developer, builder,{" "}
            <em className="italic text-[#9a9a9a]">problem solver.</em>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[15px] text-[#555] font-light leading-relaxed max-w-xl">
            CS graduate student at Cleveland State University with hands-on experience in full-stack development, AI/ML, and backend engineering.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-14 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
          {/* Left — narrative */}
          <div>
            <Reveal>
              <div className="space-y-5 mb-14">
                {[
                  "I'm a Computer Science graduate student at Cleveland State University (graduating May 2026) with a strong foundation in full-stack development, data structures, and system design. My practical experience spans Java, Python, JavaScript/TypeScript, React, Node.js, and Spring Boot.",
                  "During my internship at Tech Mahindra, I worked on real production systems — building dynamic web applications, implementing CI/CD pipelines with Docker and Jenkins, and optimizing database queries and APIs that reduced system latency by 25%. That experience taught me that the most impactful engineering work happens at the intersection of systems thinking and clean implementation.",
                  "My academic projects have pushed me into AI/ML territory: building a real-time log analytics system with anomaly detection using the ELK stack and Python's Isolation Forest algorithm, and training a GAN from scratch in PyTorch to generate realistic images. I'm drawn to projects where the technical challenge has a clear, measurable outcome.",
                  "I'm actively looking for full-time software engineering opportunities starting May 2026 — roles where I can build scalable systems, work with modern tech stacks, and grow alongside strong engineering teams.",
                ].map((para, i) => (
                  <Reveal key={i} delay={i * 0.04}>
                    <p className="text-[14.5px] text-[#9a9a9a] font-light leading-[1.85]">{para}</p>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* Philosophy */}
            <Reveal>
              <SectionLabel className="mb-6">Engineering Philosophy</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-14">
                {techPhilosophy.map((item, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07] hover:border-white/[0.13] transition-colors">
                      <div className="font-display text-[17px] text-[#efefef] mb-2">{item.title}</div>
                      <p className="text-[12.5px] text-[#555] leading-relaxed font-light">{item.body}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            {/* Education */}
            <Reveal>
              <SectionLabel className="mb-6">Education</SectionLabel>
              <div className="space-y-3 mb-14">
                {education.map((edu, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                      <div className="flex-1">
                        <div className="text-[14px] font-medium text-[#efefef] mb-0.5">{edu.degree}</div>
                        <div className="text-[13px] text-[#9a9a9a] mb-1.5">{edu.school} - {edu.location}</div>
                        <div className="text-[12px] text-[#555] font-light">{edu.notes}</div>
                      </div>
                      <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{edu.period}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/projects" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13px] hover:bg-[#d0d0d0] transition-all">
                  See My Work <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.07] text-[#9a9a9a] text-[13px] hover:border-white/[0.13] hover:text-[#efefef] transition-all">
                  Get In Touch
                </Link>
                <Link href="/resume" className="text-[13px] text-[#555] hover:text-[#9a9a9a] transition-colors flex items-center gap-1">
                  View Resume <ArrowRight size={12} />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <Reveal>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">Contact</div>
                <div className="space-y-2">
                  {[
                    { icon: Mail,   label: "Email",    val: personal.email,   href: `mailto:${personal.email}` },
                    { icon: Phone,  label: "Phone",    val: personal.phone,   href: `tel:${personal.phone}` },
                    { icon: Github, label: "GitHub",   val: "github.com/sricharan", href: personal.github },
                    { icon: Linkedin, label: "LinkedIn", val: "linkedin.com/in/sricharan", href: personal.linkedin },
                  ].map(({ icon: Icon, label, val, href }) => (
                    <a key={label} href={href} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#202020] transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-[#202020] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
                        <Icon size={13} className="text-[#555]" />
                      </div>
                      <div>
                        <div className="text-[12px] font-medium text-[#9a9a9a] group-hover:text-[#efefef] transition-colors">{label}</div>
                        <div className="text-[11px] text-[#303030] truncate max-w-[180px]">{val}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-4">Timeline</div>
                <div className="relative space-y-0">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.07]" />
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-4 pb-5 last:pb-0">
                      <div className="relative flex-shrink-0 w-[16px] flex justify-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-[#141414] border border-white/[0.12]" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-mono text-[#303030] mb-1">{m.year}</div>
                        <div className="text-[12px] text-[#9a9a9a] leading-snug font-light">{m.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
