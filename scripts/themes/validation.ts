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
  const requiredRatio = theme.accessibilityLevel === "AAA" ? 7.0 : 4.5;

  const report: ThemeValidationReport = {
    name: themeName,
    accessibilityLevel: theme.accessibilityLevel,
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

  // Primary links
  if (theme.primary.link) {
    pair = validatePair(
      theme.primary.link,
      theme.primary.background,
      ramps,
      requiredRatio,
      "primary-link vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      theme.primary.link,
      theme.primary.linkHover,
      ramps,
      requiredRatio,
      "primary-link vs primary-linkHover",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  if (theme.primary.linkVisited) {
    pair = validatePair(
      theme.primary.linkVisited,
      theme.primary.background,
      ramps,
      requiredRatio,
      "primary-linkVisited vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      theme.primary.linkVisited,
      theme.primary.linkVisitedHover,
      ramps,
      requiredRatio,
      "primary-linkVisited vs primary-linkVisitedHover",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Secondary links
  if (theme.secondary.link) {
    pair = validatePair(
      theme.secondary.link,
      theme.primary.background,
      ramps,
      requiredRatio,
      "secondary-link vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      theme.secondary.link,
      theme.secondary.linkHover,
      ramps,
      requiredRatio,
      "secondary-link vs secondary-linkHover",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  if (theme.secondary.linkVisited) {
    pair = validatePair(
      theme.secondary.linkVisited,
      theme.primary.background,
      ramps,
      requiredRatio,
      "secondary-linkVisited vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      theme.secondary.linkVisited,
      theme.secondary.linkVisitedHover,
      ramps,
      requiredRatio,
      "secondary-linkVisited vs secondary-linkVisitedHover",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Accent links
  if (theme.accent.link) {
    pair = validatePair(
      theme.accent.link,
      theme.primary.background,
      ramps,
      requiredRatio,
      "accent-link vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    if (theme.accent.linkHover) {
      pair = validatePair(
        theme.accent.link,
        theme.accent.linkHover,
        ramps,
        requiredRatio,
        "accent-link vs accent-linkHover",
      );
      report.contrastPairs.push(pair);
      if (!pair.passes) report.errors.push(pair);
    }
  }

  if (theme.accent.linkVisited) {
    pair = validatePair(
      theme.accent.linkVisited,
      theme.primary.background,
      ramps,
      requiredRatio,
      "accent-linkVisited vs primary-background",
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    if (theme.accent.linkVisitedHover) {
      pair = validatePair(
        theme.accent.linkVisited,
        theme.accent.linkVisitedHover,
        ramps,
        requiredRatio,
        "accent-linkVisited vs accent-linkVisitedHover",
      );
      report.contrastPairs.push(pair);
      if (!pair.passes) report.errors.push(pair);
    }
  }

  // Block components (error, warning, submission)
  for (const blockType of ["error", "warning", "submission"] as const) {
    const block = theme[blockType];

    pair = validatePair(
      block.blockText,
      block.blockBackground,
      ramps,
      requiredRatio,
      `${blockType}-blockText vs ${blockType}-blockBackground`,
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);

    pair = validatePair(
      block.blockText,
      block.blockHover,
      ramps,
      requiredRatio,
      `${blockType}-blockText vs ${blockType}-blockHover`,
    );
    report.contrastPairs.push(pair);
    if (!pair.passes) report.errors.push(pair);
  }

  // Stock colors (informational only, no validation failure)
  for (const [colorName, colorRef] of Object.entries(theme.stock)) {
    pair = validatePair(
      colorRef,
      theme.primary.background,
      ramps,
      null,
      `stock-${colorName} vs primary-background`,
    );
    report.contrastPairs.push(pair);
  }

  // Classification check
  const requiredPairs = report.contrastPairs.filter(
    (p) => p.requiredRatio !== null,
  );
  const failedPairs = requiredPairs.filter((p) => !p.passes);

  if (failedPairs.length > 0) {
    report.errors.unshift(
      `Theme classified as ${theme.accessibilityLevel} but fails ${theme.accessibilityLevel} contrast requirements`,
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
