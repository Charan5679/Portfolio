import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-[120px] font-light text-text-faint/20 leading-none mb-4">404</div>
      <h1 className="font-display font-light text-[32px] text-text-primary mb-3">Page not found</h1>
      <p className="text-[15px] text-text-muted mb-8 max-w-sm font-light">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-4 border border-border text-text-secondary text-sm hover:border-border-strong hover:text-text-primary transition-all duration-200"
      >
        ← Back home
      </Link>
    </div>
  );
}
