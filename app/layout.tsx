import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "@/components/layout/ClientShell";

export const metadata: Metadata = {
  title: "Sri Charan Vagalagani — Full Stack Developer & CS Student",
  description: "CS graduate student at Cleveland State University. Full-stack developer skilled in Java, React, Node.js, Spring Boot, and AI/ML. Available May 2026.",
  keywords: ["full stack developer","Java","React","Node.js","Spring Boot","computer science","Cleveland State University","AI/ML"],
  authors: [{ name: "Sri Charan Vagalagani" }],
  openGraph: {
    title: "Sri Charan Vagalagani — Full Stack Developer",
    description: "Building scalable systems and AI-driven applications.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* children go directly into body — NO client component wrappers */}
        <main className="relative z-10">{children}</main>
        {/* ClientShell mounts all client-only UI as siblings, not wrappers */}
        <ClientShell />
      </body>
    </html>
  );
}
