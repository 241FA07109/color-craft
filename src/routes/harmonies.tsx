import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Chrome";
import { CopyButton } from "../components/CopyButton";
import {
  hslToHex,
  readableText,
  shades,
  complementary,
  analogous,
  triadic,
  type HSL,
} from "../lib/color";
import { useColorState, setColor } from "../lib/colorStore";

export const Route = createFileRoute("/harmonies")({
  head: () => ({
    meta: [
      { title: "Harmonies — Chroma" },
      { name: "description", content: "Shades, tints, and colour harmonies built from your current colour." },
      { property: "og:title", content: "Harmonies — Chroma" },
      { property: "og:description", content: "Shades, tints, and colour harmonies built from your current colour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HarmoniesPage,
});

function Swatch({ hsl, large }: { hsl: HSL; large?: boolean | undefined }) {
  const hex = hslToHex(hsl);
  return (
    <button
      type="button"
      title={`Pick ${hex}`}
      onClick={() => setColor(hsl)}
      className={`group relative flex-1 rounded-lg ring-1 ring-white/10 transition-transform hover:scale-105 ${large ? "h-24" : "h-16"}`}
      style={{ backgroundColor: hex }}
    >
      <span
        className="absolute inset-x-0 bottom-1 text-center font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
        style={{ color: readableText(hex) }}
      >
        {hex}
      </span>
    </button>
  );
}

function HarmonyCard({ title, colors, large }: { title: string; colors: HSL[]; large?: boolean }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/50">{title}</p>
        <CopyButton value={colors.map(hslToHex).join(", ")} />
      </div>
      <div className="flex gap-2">
        {colors.map((c, i) => (
          <Swatch key={i} hsl={c} large={large} />
        ))}
      </div>
    </div>
  );
}

function HarmoniesPage() {
  const { color } = useColorState();
  const hex = hslToHex(color);

  return (
    <PageShell>
      <section className="relative z-10 mx-auto max-w-6xl px-8 pt-10 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">Harmonies</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
              Shades &amp;{" "}
              <span className="bg-gradient-to-r from-brand via-cyan-glow to-rose-glow bg-clip-text text-transparent">
                complements
              </span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-foreground/60">
              Everything below is derived from your current colour. Click any swatch
              to make it the new base.
            </p>
          </div>
          <div
            className="grid h-24 w-40 place-items-center rounded-2xl ring-1 ring-white/20 transition-colors duration-200"
            style={{ backgroundColor: hex }}
          >
            <span className="font-display text-xl font-bold" style={{ color: readableText(hex) }}>
              {hex}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HarmonyCard title="Shades & tints" colors={shades(color, 6)} large />
          <HarmonyCard title="Complementary" colors={[color, complementary(color)]} large />
          <HarmonyCard title="Analogous" colors={analogous(color)} />
          <HarmonyCard title="Triadic" colors={triadic(color)} />
        </div>
      </section>
    </PageShell>
  );
}
