import { Link } from "@tanstack/react-router";

export function BallastLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <circle cx="16" cy="6" r="3" className="fill-primary" />
        <path
          d="M16 9v14M8 23c2 4 14 4 16 0M6 18h20"
          className="stroke-primary"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">Ballast</span>
    </Link>
  );
}

export function HeroLine() {
  return (
    <svg
      viewBox="0 0 1200 300"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] w-full opacity-60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ballastFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 210 L100 190 L200 220 L300 150 L400 176 L500 120 L600 150 L700 90 L800 130 L900 70 L1000 108 L1100 54 L1200 84 L1200 300 L0 300 Z"
        fill="url(#ballastFade)"
      />
      <path
        d="M0 210 L100 190 L200 220 L300 150 L400 176 L500 120 L600 150 L700 90 L800 130 L900 70 L1000 108 L1100 54 L1200 84"
        fill="none"
        className="stroke-primary"
        strokeWidth="2"
        strokeDasharray="14 10"
        style={{ animation: "dash-flow 18s linear infinite" }}
      />
    </svg>
  );
}

export function RadialGauge({ value, label }: { value: number; label: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone =
    clamped > 75 ? "stroke-destructive" : clamped > 55 ? "stroke-warning" : "stroke-primary";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 130 130" className="h-36 w-36 -rotate-90">
        <circle cx="65" cy="65" r={r} className="stroke-border" strokeWidth="10" fill="none" />
        <circle
          cx="65"
          cy="65"
          r={r}
          className={tone}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (c * clamped) / 100}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="-mt-24 text-center">
        <div className="num text-2xl font-semibold">{clamped.toFixed(0)}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="h-16" />
    </div>
  );
}
