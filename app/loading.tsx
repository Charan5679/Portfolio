export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "#090909" }}
    >
      {/* Name skeleton */}
      <div className="mb-6 select-none">
        <div
          className="font-display font-light text-[#efefef]"
          style={{ fontSize: "clamp(36px,5.2vw,76px)", letterSpacing: "-0.03em", opacity: 0.12 }}
        >
          SRI CHARAN
        </div>
        <div
          className="font-display font-light text-[#efefef]"
          style={{ fontSize: "clamp(36px,5.2vw,76px)", letterSpacing: "-0.03em", opacity: 0.12 }}
        >
          VAGALAGANI
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            style={{
              animation: "ldpulse 1.1s ease-in-out infinite",
              animationDelay: i * 0.18 + "s",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ldpulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.7); }
          40%            { opacity: 1;   transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}
