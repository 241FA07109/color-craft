import { useSyncExternalStore } from "react";
import type { HSL } from "./color";

export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

interface State {
  color: HSL;
  palettes: Palette[];
}

const DEFAULT_STATE: State = {
  color: { h: 248, s: 100, l: 71 },
  palettes: [
    { id: "aurora", name: "Aurora Dusk", colors: ["#7C6CFF", "#22D3EE", "#FB7185", "#0B0F1E"] },
    { id: "ember", name: "Ember Field", colors: ["#FBBF24", "#FB923C", "#E11D48", "#1E1B4B"] },
    { id: "tide", name: "Tideglass", colors: ["#34D399", "#22D3EE", "#60A5FA", "#0F172A"] },
  ],
};

const KEY = "chroma-state-v1";
let state: State = DEFAULT_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useColorState(): State {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => DEFAULT_STATE,
  );
}

export function setColor(color: HSL) {
  state = { ...state, color };
  emit();
}

export function addPalette(palette: Palette) {
  state = { ...state, palettes: [palette, ...state.palettes] };
  emit();
}

export function removePalette(id: string) {
  state = { ...state, palettes: state.palettes.filter((p) => p.id !== id) };
  emit();
}
