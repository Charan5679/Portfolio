"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Phone, Copy, Check, ArrowRight, Send } from "lucide-react";
import { personal } from "@/lib/data";
import { Reveal, SectionLabel } from "@/components/ui/primitives";

type F = { name: string; email: string; subject: string; message: string };
type E = Partial<F>;

function validate(d: F): E {
  const e: E = {};
  if (!d.name.trim())    e.name    = "Required";
  if (!d.email.trim())   e.email   = "Required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Invalid email";
  if (!d.subject.trim()) e.subject = "Required";
  if (!d.message.trim()) e.message = "Required";
  return e;
}

export function ContactClient() {
  const [form, setForm]     = useState<F>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<E>({});
  const [touched, setTouched] = useState<Partial<Record<keyof F, boolean>>>({});
  const [status, setStatus] = useState<"idle"|"sending"|"success">("idle");
  const [copied, setCopied] = useState(false);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof F) => () => {
    setTouched(t => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name:true, email:true, subject:true, message:true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    await new Promise(r => setTimeout(r, 1400));
    setStatus("success");
  };

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(personal.email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const inp = (k: keyof F) =>
    `w-full bg-[#1a1a1a] border rounded-[9px] px-4 py-[9px] text-[13px] text-[#efefef] placeholder:text-[#303030] font-sans outline-none transition-all duration-150 ${
      touched[k] && errors[k] ? "border-red-500/40 focus:border-red-500/60" : "border-white/[0.07] focus:border-white/[0.13]"
    }`;

  return (
    <div className="page-enter pt-24">
      <div className="max-w-7xl mx-auto px-14 py-20 border-b border-white/[0.07]">
        <Reveal><SectionLabel>Contact</SectionLabel></Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display font-light mt-2 mb-4" style={{ fontSize: "clamp(30px,4.5vw,52px)", letterSpacing: "-0.04em", lineHeight: "1.03" }}>
            Let's build <em className="italic text-[#9a9a9a]">something great.</em>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[14px] text-[#555] font-light max-w-md leading-relaxed">
            Open to full-time software engineering roles starting May 2026. Happy to connect about projects, collaborations, or just a good technical conversation.
          </p>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-14 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-14">
          {/* Left */}
          <div className="space-y-4">
            <Reveal>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-3">Direct Email</div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11.5px] text-[#9a9a9a]">{personal.email}</span>
                  <button onClick={copyEmail} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.07] bg-[#202020] text-[11px] text-[#555] hover:text-[#9a9a9a] hover:border-white/[0.13] transition-all">
                    {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="p-5 rounded-xl bg-[#141414] border border-white/[0.07]">
                <div className="text-[10px] text-[#303030] font-semibold tracking-[0.12em] uppercase mb-3">Find Me</div>
                <div className="space-y-1">
                  {[
                    { icon: Mail,    label: "Email",    handle: personal.email,          href: `mailto:${personal.email}` },
                    { icon: Phone,   label: "Phone",    handle: personal.phone,          href: `tel:${personal.phone}` },
                    { icon: Github,  label: "GitHub",   handle: "github.com/sricharan",  href: personal.github },
                    { icon: Linkedin,label: "LinkedIn", handle: "linkedin.com/in/sricharan", href: personal.linkedin },
                  ].map(({ icon: Icon, label, handle, href }) => (
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
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.07] flex items-center gap-3">
                <span className="relative flex h-[6px] w-[6px] flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-emerald-500" />
                </span>
                <span className="text-[12px] text-[#9a9a9a]">Available May 2026</span>
                <span className="text-[11px] text-[#303030]">- Cleveland, OH</span>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={0.08}>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div key="suc" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
                  className="flex flex-col items-center justify-center text-center py-20 px-8 rounded-2xl border border-white/[0.07] bg-[#141414] min-h-[400px]">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.15, type:"spring", stiffness:400, damping:25 }}
                    className="w-12 h-12 rounded-2xl bg-[#202020] border border-white/[0.07] flex items-center justify-center mb-5">
                    <Check size={20} className="text-[#9a9a9a]" />
                  </motion.div>
                  <h3 className="font-display text-[28px] font-light text-[#efefef] mb-3" style={{ letterSpacing: "-0.02em" }}>Message sent</h3>
                  <p className="text-[13.5px] text-[#555] font-light max-w-sm">Thanks for reaching out. I'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4 p-7 rounded-2xl border border-white/[0.07] bg-[#141414]">
                  <div className="text-[17px] font-display font-light text-[#efefef] mb-5">Send a message</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Name</label>
                      <input value={form.name} onChange={set("name")} onBlur={blur("name")} placeholder="Your name" className={inp("name")} />
                      {touched.name && errors.name && <p className="text-[10.5px] text-red-400">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Email</label>
                      <input type="email" value={form.email} onChange={set("email")} onBlur={blur("email")} placeholder="you@example.com" className={inp("email")} />
                      {touched.email && errors.email && <p className="text-[10.5px] text-red-400">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Subject</label>
                    <input value={form.subject} onChange={set("subject")} onBlur={blur("subject")} placeholder="What's this about?" className={inp("subject")} />
                    {touched.subject && errors.subject && <p className="text-[10.5px] text-red-400">{errors.subject}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] font-medium text-[#303030] uppercase tracking-[0.1em]">Message</label>
                    <textarea value={form.message} onChange={set("message")} onBlur={blur("message")} placeholder="Tell me about the role or project..." className={`${inp("message")} h-[120px] resize-none`} />
                    {touched.message && errors.message && <p className="text-[10.5px] text-red-400">{errors.message}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-[#303030]">I respond within 24 hours</p>
                    <button type="submit" disabled={status==="sending"} className="inline-flex items-center gap-2 px-6 py-[10px] rounded-xl bg-[#efefef] text-[#090909] font-semibold text-[13px] hover:bg-[#d0d0d0] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                      {status === "sending" ? (
                        <><motion.div animate={{ rotate:360 }} transition={{ duration:0.8, repeat:Infinity, ease:"linear" }} className="w-3.5 h-3.5 border-2 border-[#090909]/30 border-t-[#090909] rounded-full" /> Sending...</>
                      ) : (<>Send Message <Send size={13} /></>)}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
