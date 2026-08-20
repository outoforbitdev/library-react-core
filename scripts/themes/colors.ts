export function hexToRGB(hex: string): { r: number; g: number; b: number } {
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

const LIGHTEN_STEP_FACTOR = 0.6;
const DARKEN_STEP_FACTOR = 0.3;

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateRampFromSwatch(
  swatchHex: string,
): Record<string, string> {
  const swatch = hexToRGB(swatchHex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };

  const ramp: Record<string, string> = {
    "500": swatchHex,
  };

  let current = swatch;
  for (let step = 400; step >= 100; step -= 100) {
    const distance = {
      r: white.r - current.r,
      g: white.g - current.g,
      b: white.b - current.b,
    };
    current = {
      r: current.r + LIGHTEN_STEP_FACTOR * distance.r,
      g: current.g + LIGHTEN_STEP_FACTOR * distance.g,
      b: current.b + LIGHTEN_STEP_FACTOR * distance.b,
    };
    ramp[step.toString()] = rgbToHex(current.r, current.g, current.b);
  }

  current = swatch;
  for (let step = 600; step <= 900; step += 100) {
    const distance = {
      r: black.r - current.r,
      g: black.g - current.g,
      b: black.b - current.b,
    };
    current = {
      r: current.r + DARKEN_STEP_FACTOR * distance.r,
      g: current.g + DARKEN_STEP_FACTOR * distance.g,
      b: current.b + DARKEN_STEP_FACTOR * distance.b,
    };
    ramp[step.toString()] = rgbToHex(current.r, current.g, current.b);
  }

  return ramp;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRGB(hex);
  const channels = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const fgLum = relativeLuminance(fgHex);
  const bgLum = relativeLuminance(bgHex);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}
