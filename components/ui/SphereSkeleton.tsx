"use client";

export function SphereSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-[280px] h-[280px]">
        {/* Centre dot */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20"
          style={{ animation: "skPulse 2s ease-in-out infinite" }}
        />
        {/* Three orbit rings */}
        {[70, 105, 140].map((r, i) => (
          <div
            key={r}
            className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.06]"
            style={{
              width: r * 2,
              height: r * 2,
              marginLeft: -r,
              marginTop: -r,
              animation: `skSpin${i} ${8 + i * 4}s linear infinite`,
              borderTopColor: "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        {/* Dot cluster shimmer */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 90 + Math.sin(i * 1.3) * 30;
          const x = 140 + Math.cos(angle) * r;
          const y = 140 + Math.sin(angle) * r;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/10"
              style={{
                left: x, top: y,
                animation: `skPulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          );
        })}
      </div>
      <style>{`
        @keyframes skPulse { 0%,100%{opacity:.2} 50%{opacity:.6} }
        @keyframes skSpin0 { to{transform:rotate(360deg)} }
        @keyframes skSpin1 { to{transform:rotate(-360deg)} }
        @keyframes skSpin2 { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
