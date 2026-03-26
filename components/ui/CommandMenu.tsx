"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, User, Briefcase, Code2, Star, FileText, Mail, Home } from "lucide-react";

const commands = [
  { label: "Home",       icon: Home,      id: "section-home",       description: "Back to top" },
  { label: "About",      icon: User,      id: "section-about",      description: "My story and philosophy" },
  { label: "Projects",   icon: Code2,     id: "section-projects",   description: "Featured work" },
  { label: "Experience", icon: Briefcase, id: "section-experience",  description: "Career history" },
  { label: "Skills",     icon: Star,      id: "section-skills",     description: "Technical capabilities" },
  { label: "Resume",     icon: FileText,  id: "section-resume",     description: "Download resume" },
  { label: "Contact",    icon: Mail,      id: "section-contact",    description: "Get in touch" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(o => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    const onCustom = () => setOpen(o => !o);
    window.addEventListener("keydown", onKey);
    document.addEventListener("open-command", onCustom);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("open-command", onCustom); };
  }, []);

  useEffect(() => { if (open) { setQuery(""); setSelected(0); } }, [open]);

  const select = (id: string) => { scrollTo(id); setOpen(false); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.15}}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={()=>setOpen(false)} />
          <motion.div initial={{opacity:0,scale:0.96,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.96,y:-8}}
            transition={{duration:0.2,ease:[0.16,1,0.3,1]}}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-md px-4">
            <div className="rounded-2xl border border-white/[0.1] bg-[#141414]/95 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
                <Search size={13} className="text-[#555] flex-shrink-0" />
                <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Navigate to..."
                  className="flex-1 bg-transparent text-[13.5px] text-[#efefef] placeholder:text-[#303030] outline-none"
                  onKeyDown={e=>{
                    if(e.key==="ArrowDown") setSelected(s=>Math.min(s+1,filtered.length-1));
                    if(e.key==="ArrowUp")   setSelected(s=>Math.max(s-1,0));
                    if(e.key==="Enter" && filtered[selected]) select(filtered[selected].id);
                  }} />
                <kbd className="text-[10px] text-[#303030] border border-white/[0.07] px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              </div>
              <div className="py-2 max-h-72 overflow-y-auto">
                {filtered.map((cmd,i)=>{
                  const Icon = cmd.icon;
                  return (
                    <button key={cmd.id} onClick={()=>select(cmd.id)} onMouseEnter={()=>setSelected(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${selected===i?"bg-[#202020]":"hover:bg-[#1a1a1a]"}`}>
                      <div className="w-7 h-7 rounded-lg border border-white/[0.07] bg-[#252525] flex items-center justify-center flex-shrink-0">
                        <Icon size={12} className="text-[#555]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[13px] text-[#efefef]">{cmd.label}</div>
                        <div className="text-[11px] text-[#555]">{cmd.description}</div>
                      </div>
                      {selected===i && <ArrowRight size={12} className="text-[#303030] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="px-4 py-2 border-t border-white/[0.07] flex items-center gap-4">
                <span className="text-[10.5px] text-[#303030] flex items-center gap-1"><kbd className="border border-white/[0.07] px-1 rounded font-mono text-[9px]">↑↓</kbd> navigate</span>
                <span className="text-[10.5px] text-[#303030] flex items-center gap-1"><kbd className="border border-white/[0.07] px-1 rounded font-mono text-[9px]">↵</kbd> scroll to</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
