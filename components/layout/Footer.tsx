import Link from "next/link";
import { personal } from "@/lib/data";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] py-10 px-14">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display text-[16px] text-[#9a9a9a] font-light mb-1">Sri Charan Vagalagani</div>
          <div className="text-[11px] text-[#303030]">CS student at Cleveland State - Full Stack & AI Engineer.</div>
        </div>
        <div className="flex items-center gap-5">
          {[["About","/about"],["Projects","/projects"],["Skills","/skills"],["Resume","/resume"],["Contact","/contact"]].map(([label,href])=>(
            <Link key={href} href={href} className="text-[11.5px] text-[#303030] hover:text-[#555] transition-colors">{label}</Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href={personal.github}   className="text-[#303030] hover:text-[#555] transition-colors" aria-label="GitHub"><Github size={14} /></a>
          <a href={personal.linkedin} className="text-[#303030] hover:text-[#555] transition-colors" aria-label="LinkedIn"><Linkedin size={14} /></a>
          <a href={personal.twitter}  className="text-[#303030] hover:text-[#555] transition-colors" aria-label="Twitter"><Twitter size={14} /></a>
          <a href={`mailto:${personal.email}`} className="text-[#303030] hover:text-[#555] transition-colors" aria-label="Email"><Mail size={14} /></a>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-white/[0.04] flex items-center justify-between">
        <p className="text-[11px] text-[#303030]">© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Sri Charan Vagalagani. All rights reserved.</p>
        <p className="text-[11px] text-[#303030]">SF, CA - Open to opportunities</p>
      </div>
    </footer>
  );
}
