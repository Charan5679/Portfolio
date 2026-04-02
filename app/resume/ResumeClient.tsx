"use client";

import { Download } from "lucide-react";
import { personal, experience, education, skills, projects } from "@/lib/data";
import { Reveal, SectionLabel, TechTag } from "@/components/ui/primitives";

function ResumeSec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#303030] pb-3 mb-6 border-b border-white/[0.05]">
        {title}
      </div>
      {children}
    </div>
  );
}

export function ResumeClient() {
  return (
    <div className="page-enter pt-24">
      {/* Page header */}
      <div className="border-b border-white/[0.07] px-6 py-16">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <Reveal><SectionLabel>Resume</SectionLabel></Reveal>
            <Reveal delay={0.06}>
              <h1 className="font-display font-light mt-2" style={{ fontSize: "clamp(36px,5vw,56px)", letterSpacing: "-0.045em", lineHeight: "0.92" }}>
                Sri Charan{" "}
                <em className="italic text-[#9a9a9a]">Vagalagani</em>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[13px] text-[#555] mt-3">Full Stack Developer · Computer Science Graduate Student</p>
            </Reveal>
          </div>
          {/* No Reveal wrapper — button must always be visible and clickable */}
          <a
            href="/resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13px] hover:bg-[#d0d0d0] transition-all flex-shrink-0 relative z-10"
>
  <Download size={14} /> Download PDF
</a>
        </div>
      </div>

      {/* Resume body — centred column */}
      <div className="px-6 py-14">
        <div className="max-w-3xl mx-auto">

          {/* Contact info */}
          <Reveal>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mb-10 text-[12px] text-[#555] font-mono">
              <span>{personal.email}</span>
              <span className="text-[#303030]">-</span>
              <span>{personal.phone}</span>
              <span className="text-[#303030]">-</span>
              <span>{personal.location}</span>
              <span className="text-[#303030]">-</span>
              <span>linkedin.com/in/sricharanv</span>
              <span className="text-[#303030]">-</span>
              <span>github.com/Charan5679</span>
            </div>
          </Reveal>

          {/* Summary */}
          <Reveal>
            <ResumeSec title="Summary">
              <p className="text-[13.5px] text-[#9a9a9a] font-light leading-[1.85]">
                Cleveland State University graduate student studying Computer Science with a strong background in data structures and system design, and full-stack development skills in Java, React, Node.js, and Spring Boot. Expertise in creating RESTful APIs, scalable web applications, and backend performance optimisation — reducing system latency by 25% during an internship at Tech Mahindra. Practical experience building AI-driven projects including anomaly detection systems and generative models.
              </p>
            </ResumeSec>
          </Reveal>

          {/* Education */}
          <Reveal>
            <ResumeSec title="Education">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-5 last:mb-0">
                  <div>
                    <div className="text-[14px] font-medium text-[#efefef] mb-0.5">{edu.degree}</div>
                    <div className="text-[12.5px] text-[#9a9a9a]">{edu.school} - {edu.location}</div>
                    <div className="text-[12px] text-[#555] font-light mt-1">{edu.notes}</div>
                  </div>
                  <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{edu.period}</div>
                </div>
              ))}
            </ResumeSec>
          </Reveal>

          {/* Experience */}
          <Reveal>
            <ResumeSec title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-6 last:mb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <div>
                      <div className="text-[14px] font-medium text-[#efefef]">{exp.role}</div>
                      <div className="text-[12.5px] text-[#9a9a9a]">{exp.company} - {exp.location}</div>
                    </div>
                    <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{exp.period}</div>
                  </div>
                  <ul className="mt-2 space-y-1.5 mb-3">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px] text-[#9a9a9a] font-light">
                        <span className="text-[#303030] mt-1.5 flex-shrink-0 text-[9px]">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.stack.map((t) => (
                      <TechTag key={t}>{t}</TechTag>
                    ))}
                  </div>
                </div>
              ))}
            </ResumeSec>
          </Reveal>

          {/* Projects */}
          <Reveal>
            <ResumeSec title="Projects">
              {projects.map((p) => (
                <div key={p.slug} className="mb-5 last:mb-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1.5">
                    <div className="text-[14px] font-medium text-[#efefef]">{p.title}</div>
                    <div className="text-[11px] text-[#303030] font-mono flex-shrink-0">{p.year}</div>
                  </div>
                  <div className="text-[12.5px] text-[#9a9a9a] font-light mb-2">{p.subtitle}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.stack.slice(0, 5).map((t) => (
                      <TechTag key={t}>{t}</TechTag>
                    ))}
                  </div>
                </div>
              ))}
            </ResumeSec>
          </Reveal>

          {/* Skills */}
          <Reveal>
            <ResumeSec title="Skills">
              <div className="space-y-3">
                {Object.entries(skills).map(([cat, items]) => (
                  <div key={cat} className="flex flex-col sm:flex-row gap-3">
                    <div className="text-[10.5px] font-semibold tracking-[0.06em] uppercase text-[#303030] sm:w-36 flex-shrink-0 mt-0.5">{cat}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((s) => (
                        <TechTag key={s}>{s}</TechTag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSec>
          </Reveal>

          {/* Download button at bottom — NO Reveal wrapper */}
          <div className="flex items-center justify-center pt-6 border-t border-white/[0.05]">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.07] text-[#9a9a9a] text-[13px] hover:border-white/[0.13] hover:text-[#efefef] hover:bg-[#202020] transition-all"
            >
              <Download size={13} /> Download as PDF
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
