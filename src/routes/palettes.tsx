import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Chrome";
import { CopyButton } from "../components/CopyButton";
import { hslToHex, randomHsl, readableText, clampHsl } from "../lib/color";
import { useColorState, addPalette, removePalette, setColor, hexToHslSafe } from "../lib/paletteActions";

export const Route = createFileRoute("/palettes")({
  head: () => ({
    meta: [
      { title: "Palettes — Chroma" },
      { name: "description", content: "Generate, save, and copy colour palettes built from your current hue." },
      { property: "og:title", content: "Palettes — Chroma" },
      { property: "og:description", content: "Generate, save, and copy colour palettes built from your current hue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PalettesPage,
});

function generatePalette(): string[] {
  const base = randomHsl();
  return [
    hslToHex(base),
    hslToHex(clampHsl({ h: base.h + 40, s: base.s, l: Math.min(base.l + 12, 80) })),
    hslToHex(clampHsl({ h: base.h + 180, s: base.s, l: base.l })),
    hslToHex({ h: base.h, s: 15, l: 12 }),
  ];
}

function PalettesPage() {
  const { palettes } = useColorState();

  const handleGenerate = () => {
    addPalette({
      id: `gen-${Date.now()}`,
      name: `Palette ${palettes.length + 1}`,
      colors: generatePalette(),
    });
  };

  return (
    <PageShell>
      <section className="relative z-10 mx-auto max-w-6xl px-8 pt-10 pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/50">Palettes</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
              Saved &amp;{" "}
              <span className="bg-gradient-to-r from-brand via-cyan-glow to-rose-glow bg-clip-text text-transparent">
                generated
              </span>
            </h1>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
          >
            + Generate palette
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {palettes.map((p) => (
            <div key={p.id} className="glass rounded-3xl p-4">
              <div className="grid grid-cols-4 gap-1.5">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    title={`Use ${c}`}
                    onClick={() => {
                      const hsl = hexToHslSafe(c);
                      if (hsl) setColor(hsl);
                    }}
                    className="group relative h-24 rounded-lg transition-transform hover:scale-105"
                    style={{ backgroundColor: c }}
                  >
                    <span
                      className="absolute inset-x-0 bottom-1 text-center font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100"
                      style={{ color: readableText(c) }}
                    >
                      {c}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold">{p.name}</p>
                  <p className="text-xs text-foreground/50">{p.colors.length} colours</p>
                </div>
                <div className="flex items-center gap-2">
                  <CopyButton value={p.colors.join(", ")} />
                  <button
                    type="button"
                    onClick={() => removePalette(p.id)}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-foreground/60 ring-1 ring-white/15 transition-colors hover:bg-white/20 hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
