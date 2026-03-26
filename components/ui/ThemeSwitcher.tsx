"use client";

import { useEffect, useState } from "react";

export type Theme = "black" | "obsidian" | "slate";

const THEMES: { id: Theme; label: string; bg: string }[] = [
  { id: "black",    label: "Black",    bg: "#090909" },
  { id: "obsidian", label: "Obsidian", bg: "#0a0d14" },
  { id: "slate",    label: "Slate",    bg: "#0d0f0e" },
];

const THEME_VARS: Record<Theme, Record<string, string>> = {
  black: {
    "--ink":  "#090909", "--s1": "#101010", "--s2": "#141414",
    "--s3":   "#1a1a1a", "--s4": "#202020", "--s5": "#282828",
    "--s6":   "#303030",
  },
  obsidian: {
    "--ink":  "#080c14", "--s1": "#0e1220", "--s2": "#121828",
    "--s3":   "#171e30", "--s4": "#1c2438", "--s5": "#232c44",
    "--s6":   "#2a3450",
  },
  slate: {
    "--ink":  "#0b0f0d", "--s1": "#101512", "--s2": "#141a16",
    "--s3":   "#192019", "--s4": "#1e261f", "--s5": "#252e26",
    "--s6":   "#2c362d",
  },
};

function applyTheme(theme: Theme) {
  const vars = THEME_VARS[theme];
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("black");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("portfolio-theme") as Theme) || "black";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const select = (t: Theme) => {
    setTheme(t);
    setOpen(false);
    localStorage.setItem("portfolio-theme", t);
    applyTheme(t);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[800]">
      <div className="relative">
        {open && (
          <div className="absolute bottom-10 right-0 flex flex-col gap-1.5 p-2 rounded-xl border border-white/[0.09] bg-[#141414]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => select(t.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors group"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/[0.15] flex-shrink-0"
                  style={{ background: t.bg }}
                />
                <span className={`text-[12px] font-medium transition-colors ${theme === t.id ? "text-[#efefef]" : "text-[#555] group-hover:text-[#9a9a9a]"}`}>
                  {t.label}
                </span>
                {theme === t.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          title="Switch theme"
          className="w-8 h-8 rounded-full border border-white/[0.1] flex items-center justify-center hover:border-white/[0.2] transition-all"
          style={{ background: THEMES.find((t) => t.id === theme)?.bg }}
        >
          <div className="w-3 h-3 rounded-full border border-white/[0.3]" />
        </button>
      </div>
    </div>
  );
}
