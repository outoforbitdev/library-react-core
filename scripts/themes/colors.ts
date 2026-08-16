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

export function hexToRGB(
  hex: string,
): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function interpolateRamp(
  lightHex: string,
  darkHex: string,
): Record<string, string> {
  const rgb100 = hexToRGB(lightHex);
  const rgb900 = hexToRGB(darkHex);

  const ramp: Record<string, string> = {
    "100": lightHex,
    "900": darkHex,
  };

  for (let step = 200; step < 900; step += 100) {
    const t = (step - 100) / 800;
    const r = rgb100.r + (rgb900.r - rgb100.r) * t;
    const g = rgb100.g + (rgb900.g - rgb100.g) * t;
    const b = rgb100.b + (rgb900.b - rgb100.b) * t;

    ramp[step.toString()] = rgbToHex(r, g, b);
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
