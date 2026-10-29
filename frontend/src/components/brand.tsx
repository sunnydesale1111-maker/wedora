import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Mandala({ className }: { className?: string }) {
  const petals = Array.from({ length: 16 });
  return (
    <svg viewBox="0 0 200 200" className={cn("pointer-events-none", className)} fill="none" stroke="currentColor" strokeWidth="0.8" aria-hidden>
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="70" />
      <circle cx="100" cy="100" r="22" />
      {petals.map((_, i) => (
        <g key={i} transform={`rotate(${(360 / 16) * i} 100 100)`}>
          <path d="M100 30 C112 50 112 70 100 78 C88 70 88 50 100 30Z" />
          <path d="M100 4 C106 14 106 24 100 30 C94 24 94 14 100 4Z" />
          <circle cx="100" cy="86" r="2" />
        </g>
      ))}
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Mandala className={cn("size-8", light ? "text-gold" : "text-gold")} />
      <span className={cn("font-display text-2xl tracking-tight", light ? "text-primary-foreground" : "text-plum")}>Wedora</span>
    </Link>
  );
}
