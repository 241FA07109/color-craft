export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export function hslToHex({ h, s, l }: HSL): string {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

export function hslToRgb({ h, s, l }: HSL): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function hexToHsl(hex: string): HSL | null {
  const m = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(m) && !/^[0-9a-fA-F]{3}$/.test(m)) return null;
  const full =
    m.length === 3
      ? m.split("").map((c) => c + c).join("")
      : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function clampHsl({ h, s, l }: HSL): HSL {
  return {
    h: ((h % 360) + 360) % 360,
    s: Math.min(100, Math.max(0, s)),
    l: Math.min(100, Math.max(0, l)),
  };
}

export function shades(base: HSL, count = 6): HSL[] {
  // dark -> light ramp around base hue/sat
  return Array.from({ length: count }, (_, i) => {
    const l = 8 + (i * 84) / (count - 1);
    return clampHsl({ h: base.h, s: base.s, l });
  });
}

export function complementary(base: HSL): HSL {
  return clampHsl({ h: base.h + 180, s: base.s, l: base.l });
}

export function analogous(base: HSL): HSL[] {
  return [-30, 0, 30].map((d) => clampHsl({ h: base.h + d, s: base.s, l: base.l }));
}

export function triadic(base: HSL): HSL[] {
  return [0, 120, 240].map((d) => clampHsl({ h: base.h + d, s: base.s, l: base.l }));
}

export function randomHsl(): HSL {
  return {
    h: Math.floor(Math.random() * 360),
    s: 55 + Math.floor(Math.random() * 45),
    l: 40 + Math.floor(Math.random() * 30),
  };
}

export function readableText(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? "#0B0F1E" : "#FFFFFF";
}
