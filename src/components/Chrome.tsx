import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="blob absolute -top-32 -left-24 size-[520px] rounded-full bg-brand/40 blur-[120px]" />
      <div className="blob-reverse absolute top-1/3 -right-24 size-[480px] rounded-full bg-cyan-glow/30 blur-[120px]" />
      <div className="blob absolute bottom-0 left-1/3 size-[420px] rounded-full bg-rose-glow/25 blur-[120px]" />
    </div>
  );
}

const links = [
  { to: "/", label: "Picker" },
  { to: "/palettes", label: "Palettes" },
  { to: "/harmonies", label: "Harmonies" },
] as const;

export function Header() {
  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
      <Link to="/" className="flex items-center gap-3">
        <div className="glass grid size-9 place-items-center rounded-xl">
          <span className="size-4 rounded-full bg-gradient-to-br from-brand to-cyan-glow" />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">Chroma</span>
      </Link>
      <nav className="glass-soft flex items-center gap-1 rounded-full p-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            activeProps={{ className: "rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-foreground" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body text-foreground">
      <AmbientBackground />
      <Header />
      {children}
    </div>
  );
}
