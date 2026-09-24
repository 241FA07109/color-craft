import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "../components/Chrome";
import { CopyButton } from "../components/CopyButton";
import {
  hslToHex,
  hslToRgb,
  hexToHsl,
  readableText,
  type HSL,
} from "../lib/color";
import { useColorState, setColor } from "../lib/colorStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chroma — Color Picker Studio" },
      { name: "description", content: "A tactile colour studio for designers. Pick, refine, and export production-ready colours in seconds." },
      { property: "og:title", content: "Chroma — Color Picker Studio" },
      { property: "og:description", content: "Pick, refine, and export production-ready colours in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PickerPage,
});

function Slider({
  label,
  value,
  max,
  onChange,
  trackStyle,
  display,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
  trackStyle: React.CSSProperties;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-foreground/50">
        <span>{label}</span>
        <span className="font-mono">{display}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="chroma-slider mt-2 w-full"
        style={trackStyle}
        aria-label={label}
      />
    </div>
  );
}

function PickerPage() {
  const { color } = useColorState();
  const hex = hslToHex(color);
  const [r, g, b] = hslToRgb(color);
  const [hexInput, setHexInput] = useState(hex);

  useEffect(() => setHexInput(hex), [hex]);

  const update = (patch: Partial<HSL>) => setColor({ ...color, ...patch });

  const applyHex = (value: string) => {
    setHexInput(value);
    const parsed = hexToHsl(value);
    if (parsed) setColor(parsed);
  };

  const hueTrack = {
    background:
      "linear-gradient(90deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)",
  };
  const satTrack = {
    background: `linear-gradient(90deg, ${hslToHex({ ...color, s: 0 })}, ${hslToHex({ ...color, s: 100 })})`,
  };
  const lightTrack = {
    background: `linear-gradient(90deg, #000, ${hslToHex({ ...color, l: 50 })}, #fff)`,
  };

  return (
    <PageShell>
      <section className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-8 pt-10 pb-16 lg:grid-cols-2">
        <div>
          <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-foreground/70">
            <span className="size-1.5 rounded-full bg-cyan-glow" /> A colour studio for designers
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight">
            Find your exact{" "}
            <span className="bg-gradient-to-r from-brand via-cyan-glow to-rose-glow bg-clip-text text-transparent">
              hue
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/60">
            Drag the sliders, type a hex, watch the swatch breathe — then copy the
            exact value in one tap.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/palettes"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
            >
              Browse palettes
            </Link>
            <Link
              to="/harmonies"
              className="glass-soft rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
            >
              Explore harmonies
            </Link>
          </div>
        </div>

        {/* picker card */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-semibold">Picker</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-foreground/70">Live</span>
          </div>

          <div
            className="mt-4 grid h-44 place-items-center rounded-2xl ring-1 ring-white/20 transition-colors duration-200"
            style={{ backgroundColor: hex }}
          >
            <span
              className="font-display text-3xl font-bold"
              style={{ color: readableText(hex) }}
            >
              {hex}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/5 py-3 ring-1 ring-white/10">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">Hex</p>
              <p className="mt-1 font-mono text-sm">{hex}</p>
            </div>
            <div className="rounded-xl bg-white/5 py-3 ring-1 ring-white/10">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">RGB</p>
              <p className="mt-1 font-mono text-sm">{r} {g} {b}</p>
            </div>
            <div className="rounded-xl bg-white/5 py-3 ring-1 ring-white/10">
              <p className="text-[10px] uppercase tracking-widest text-foreground/40">HSL</p>
              <p className="mt-1 font-mono text-sm">{color.h} {color.s} {color.l}</p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <Slider label="Hue" value={color.h} max={360} onChange={(h) => update({ h })} trackStyle={hueTrack} display={`${color.h}°`} />
            <Slider label="Saturation" value={color.s} max={100} onChange={(s) => update({ s })} trackStyle={satTrack} display={`${color.s}%`} />
            <Slider label="Lightness" value={color.l} max={100} onChange={(l) => update({ l })} trackStyle={lightTrack} display={`${color.l}%`} />
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
            <span className="w-10 text-xs font-medium uppercase tracking-wider text-foreground/40">Hex</span>
            <input
              value={hexInput}
              onChange={(e) => applyHex(e.target.value)}
              className="w-full bg-transparent font-mono text-lg font-semibold outline-none"
              aria-label="Hex value"
              spellCheck={false}
            />
            <CopyButton value={hex} />
          </div>
          <div className="mt-3 flex gap-3">
            <CopyButton value={`rgb(${r}, ${g}, ${b})`} className="flex-1 rounded-xl bg-white/5 py-2.5 text-xs font-medium ring-1 ring-white/10 transition-colors hover:bg-white/15" />
            <CopyButton value={`hsl(${color.h}, ${color.s}%, ${color.l}%)`} className="flex-1 rounded-xl bg-white/5 py-2.5 text-xs font-medium ring-1 ring-white/10 transition-colors hover:bg-white/15" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
