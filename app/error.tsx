"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "#090909" }}>
      <div className="font-display text-[80px] font-light text-white/10 leading-none mb-4">!</div>
      <h2 className="font-display font-light text-[28px] text-[#efefef] mb-3">Something went wrong</h2>
      <p className="text-[14px] text-[#555] mb-8 font-light">An unexpected error occurred.</p>
      <button onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-[#1a1a1a] border border-white/[0.07] text-[#9a9a9a] text-sm hover:border-white/[0.13] hover:text-[#efefef] transition-all duration-200">
        Try again
      </button>
    </div>
  );
}
