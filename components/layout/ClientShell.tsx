"use client";

import { useEffect, useState } from "react";
import { CSBackground }      from "@/components/ui/CSBackground";
import { CursorSpotlight }   from "@/components/ui/CursorSpotlight";
import { CursorTrail }       from "@/components/ui/CursorTrail";
import { ScrollDepthEffect } from "@/components/ui/ScrollDepthEffect";
import { CommandMenu }       from "@/components/ui/CommandMenu";
import { ThemeSwitcher }     from "@/components/ui/ThemeSwitcher";
import { GhostNav }          from "@/components/layout/Navbar";
import { SmoothScrollInit }  from "@/components/ui/SmoothScrollProvider";

export function ClientShell() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <>
      <CSBackground />
      <CursorSpotlight />
      <CursorTrail />
      <ScrollDepthEffect />
      <CommandMenu />
      <ThemeSwitcher />
      <GhostNav />
      <SmoothScrollInit />
    </>
  );
}
