import chroma from "chroma-js";
import { HSL } from "./types.js";

export function hexToHSL(hex: string): HSL {
  const [h, s, l] = chroma(hex).hsl();
  return {
    h: h ?? 0,
    s: (s ?? 0) * 100,
    l: l * 100,
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  return chroma.hsl(h, s / 100, l / 100).hex();
}

export function validateRampEndpoints(hsl100: HSL, hsl900: HSL): string[] {
  const errors: string[] = [];

  const hDiff = Math.abs(hsl100.h - hsl900.h);

  if (hDiff > 15 && hDiff < 345) {
    errors.push(
      `Hue mismatch: 100=${hsl100.h.toFixed(1)}° vs 900=${hsl900.h.toFixed(1)}° (diff=${hDiff.toFixed(1)}°, max=15°)`
    );
  }

  return errors;
}

export function interpolateRamp(lightHex: string, darkHex: string): Record<string, string> {
  const hsl100 = hexToHSL(lightHex);
  const hsl900 = hexToHSL(darkHex);

  const ramp: Record<string, string> = {
    "100": lightHex,
    "900": darkHex,
  };

  for (let step = 200; step < 900; step += 100) {
    const t = (step - 100) / 800;
    const h = hsl100.h;
    const s = hsl100.s;
    const l = hsl100.l + (hsl900.l - hsl100.l) * t;

    ramp[step.toString()] = hslToHex(h, s, l);
  }

  return ramp;
}

export function relativeLuminance(hex: string): number {
  const rgb = chroma(hex).rgb();
  const [r, g, b] = rgb.map((c) => {
    const c2 = c / 255;
    return c2 <= 0.03928 ? c2 / 12.92 : Math.pow((c2 + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const fgLum = relativeLuminance(fgHex);
  const bgLum = relativeLuminance(bgHex);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}
