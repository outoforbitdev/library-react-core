import { readFileSync } from "fs";
import {
  Themes,
  Theme,
  InterpolatedRamps,
  ThemeValidationReport,
  ValidationReport,
  ContrastPair,
} from "./types.js";
import { contrastRatio } from "./colors.js";

export function loadThemes(filePath: string): Themes {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load themes from ${filePath}: ${error}`);
  }
}

function resolveSwatchRef(ref: string, ramps: InterpolatedRamps): string {
  const lastHyphenIdx = ref.lastIndexOf("-");
  const colorFamily = ref.substring(0, lastHyphenIdx);
  const step = ref.substring(lastHyphenIdx + 1);

  if (!ramps[colorFamily] || !ramps[colorFamily][step]) {
    throw new Error(`Invalid swatch reference: ${ref}`);
  }
  return ramps[colorFamily][step];
}

function validatePair(
  foreground: string,
  background: string,
  ramps: InterpolatedRamps,
  requiredRatio: number | null,
  label: string,
): ContrastPair {
  const fgHex = resolveSwatchRef(foreground, ramps);
  const bgHex = resolveSwatchRef(background, ramps);
  const ratio = contrastRatio(fgHex, bgHex);
  const passes = requiredRatio === null || ratio >= requiredRatio;

  return {
    label,
    foreground,
    background,
    fgHex,
    bgHex,
    contrastRatio: ratio,
    requiredRatio,
    passes,
  };
}

export function validateTheme(
  themeName: string,
  theme: Theme,
  ramps: InterpolatedRamps,
): ThemeValidationReport {
  const requiredRatio =
    (theme["accessibility-level"] as any) === "AAA" ? 7.0 : 4.5;

  const report: ThemeValidationReport = {
    name: themeName,
    accessibilityLevel: theme["accessibility-level"] as any,
    status: "pass",
    errors: [],
    contrastPairs: [],
  };

  // Primary vs Primary
  let pair = validatePair(
    theme.primary.text,
    theme.primary.background,
    ramps,
    requiredRatio,
    "primary-text vs primary-background",
  );
  report.contrastPairs.push(pair);
  if (!pair.passes) report.errors.push(pair);

  // Secondary vs Secondary
  pair = validatePair(
    theme.secondary.text,
    theme.secondary.background,
    ramps,
    requiredRatio,
    "secondary-text vs secondary-background",
  );
  report.contrastPairs.push(pair);
  if (!pair.passes) report.errors.push(pair);

  // Accent text vs primary background
  pair = validatePair(
    theme.accent.text,
    theme.primary.background,
    ramps,
    requiredRatio,
    "accent-text vs primary-background",
  );
  report.contrastPairs.push(pair);
  if (!pair.passes) report.errors.push(pair);

  // Primary links (contrast with background only)
  if ((theme.primary as any)["link"]) {
    pair = validatePair(
      (theme.primary as any)["link"],
      theme.primary.background,
      ramps,
      requiredRatio,
      "primary-link vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  if ((theme.primary as any)["link-visited"]) {
    pair = validatePair(
      (theme.primary as any)["link-visited"],
      theme.primary.background,
      ramps,
      requiredRatio,
      "primary-link-visited vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Secondary links (contrast with background only)
  if ((theme.secondary as any)["link"]) {
    pair = validatePair(
      (theme.secondary as any)["link"],
      theme.secondary.background,
      ramps,
      requiredRatio,
      "secondary-link vs secondary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  if ((theme.secondary as any)["link-visited"]) {
    pair = validatePair(
      (theme.secondary as any)["link-visited"],
      theme.secondary.background,
      ramps,
      requiredRatio,
      "secondary-link-visited vs secondary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Accent links (contrast with background only)
  if ((theme.accent as any)["link"]) {
    pair = validatePair(
      (theme.accent as any)["link"],
      theme.primary.background,
      ramps,
      requiredRatio,
      "accent-link vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  if ((theme.accent as any)["link-visited"]) {
    pair = validatePair(
      (theme.accent as any)["link-visited"],
      theme.primary.background,
      ramps,
      requiredRatio,
      "accent-link-visited vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Accent block
  if (
    (theme as any)["accent-block"] &&
    (theme as any)["accent-block"].text &&
    (theme as any)["accent-block"].background
  ) {
    const accentBlock = (theme as any)["accent-block"];

    pair = validatePair(
      accentBlock.text,
      accentBlock.background,
      ramps,
      requiredRatio,
      "accent-block-text vs accent-block-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    if (accentBlock.shade) {
      pair = validatePair(
        accentBlock.text,
        accentBlock.shade,
        ramps,
        requiredRatio,
        "accent-block-text vs accent-block-shade",
      );
      report.contrastPairs.push(pair);
      if (!pair.passes) report.errors.push(pair);
    }

    if (accentBlock.link) {
      pair = validatePair(
        accentBlock.link,
        accentBlock.background,
        ramps,
        requiredRatio,
        "accent-block-link vs accent-block-background",
      );
      report.contrastPairs.push(pair);
      if (!pair.passes) report.errors.push(pair);
    }

    if (accentBlock["link-visited"]) {
      pair = validatePair(
        accentBlock["link-visited"],
        accentBlock.background,
        ramps,
        requiredRatio,
        "accent-block-link-visited vs accent-block-background",
      );
      report.contrastPairs.push(pair);
      if (!pair.passes) report.errors.push(pair);
    }
  }

  // Block components (error, warning, submission)
  for (const blockType of ["error", "warning", "submission"] as const) {
    const block = (theme as any)[blockType];

    pair = validatePair(
      block["block-text"],
      block["block-background"],
      ramps,
      requiredRatio,
      `${blockType}-block-text vs ${blockType}-block-background`,
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      block["block-text"],
      block["block-shade"],
      ramps,
      requiredRatio,
      `${blockType}-block-text vs ${blockType}-block-shade`,
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Stock colors (informational only, no validation failure)
  const stock = (theme as any).stock;
  if (stock) {
    for (const [colorName, colorRef] of Object.entries(stock)) {
      pair = validatePair(
        colorRef as string,
        theme.primary.background,
        ramps,
        null,
        `stock-${colorName} vs primary-background`,
      );
      report.contrastPairs.push(pair);
    }
  }

  // Classification check
  const requiredPairs = report.contrastPairs.filter(
    (p) => p.requiredRatio !== null,
  );
  const failedPairs = requiredPairs.filter((p) => !p.passes);

  if (failedPairs.length > 0) {
    report.errors.unshift(
      `Theme classified as ${theme["accessibility-level"]} but fails ${theme["accessibility-level"]} contrast requirements`,
    );
    report.status = "fail";
  }

  if (report.errors.length > 0) {
    report.status = "fail";
  }

  return report;
}

export function validateAllThemes(
  themes: Themes,
  ramps: InterpolatedRamps,
): Record<string, ThemeValidationReport> {
  const result: Record<string, ThemeValidationReport> = {};

  for (const [themeName, theme] of Object.entries(themes)) {
    result[themeName] = validateTheme(themeName, theme, ramps);
  }

  return result;
}
