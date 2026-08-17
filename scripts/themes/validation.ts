import { readFileSync } from "fs";
import {
  Themes,
  Theme,
  GeneratedRamps,
  ThemeValidationReport,
  ValidationReport,
  ContrastPair,
  BackgroundComponent,
  AccessibilityLevel,
} from "./types.js";
import { contrastRatio } from "./colors.js";
import { resolveSwatchRef } from "./utils.js";

export function loadThemes(filePath: string): Themes {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load themes from ${filePath}: ${error}`);
  }
}

function validatePair(
  foreground: string,
  background: string,
  ramps: GeneratedRamps,
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

function addValidationPair(
  report: ThemeValidationReport,
  foreground: string,
  background: string,
  ramps: GeneratedRamps,
  requiredRatio: number,
  label: string,
): void {
  const pair = validatePair(
    foreground,
    background,
    ramps,
    requiredRatio,
    label,
  );
  report.contrastPairs.push(pair);
  if (!pair.passes) report.errors.push(pair);
}

interface TextColorPair {
  text: string;
  label: string;
}

function validateBackgroundComponent(
  report: ThemeValidationReport,
  componentName: string,
  component: BackgroundComponent,
  error: string,
  warning: string,
  submission: string,
  ramps: GeneratedRamps,
  requiredRatio: number,
): void {
  const texts: TextColorPair[] = [
    { text: component.text, label: `${componentName}-text` },
    { text: component.link, label: `${componentName}-link` },
    { text: component["link-visited"], label: `${componentName}-link-visited` },
    { text: error, label: "error-text" },
    { text: warning, label: "warning-text" },
    { text: submission, label: "submission-text" },
  ].filter((p) => p.text && p.text.trim() !== "");
  for (const { text, label } of texts) {
    for (const background of [
      { value: component.background, suffix: "background" },
      // { value: component.shade, suffix: "shade" },
    ]) {
      addValidationPair(
        report,
        text,
        background.value,
        ramps,
        requiredRatio,
        `${label} vs ${componentName}-${background.suffix}`,
      );
    }
  }
}

export function validateTheme(
  themeName: string,
  theme: Theme,
  ramps: GeneratedRamps,
): ThemeValidationReport {
  const requiredRatio =
    (theme["accessibility-level"] as string) === "AAA" ? 7.0 : 4.5;

  const report: ThemeValidationReport = {
    name: themeName,
    accessibilityLevel: theme["accessibility-level"] as AccessibilityLevel,
    status: "pass",
    errors: [],
    contrastPairs: [],
  };

  validateBackgroundComponent(
    report,
    "primary",
    theme.primary,
    theme.error.text,
    theme.warning.text,
    theme.submission.text,
    ramps,
    requiredRatio,
  );

  validateBackgroundComponent(
    report,
    "secondary",
    theme.secondary,
    theme.error.text,
    theme.warning.text,
    theme.submission.text,
    ramps,
    requiredRatio,
  );

  validateBackgroundComponent(
    report,
    "accent-block",
    theme["accent-block"],
    "",
    "",
    "",
    ramps,
    requiredRatio,
  );

  // Block components (error, warning, submission)
  for (const blockType of ["error", "warning", "submission"] as const) {
    const block = (theme as any)[blockType];

    addValidationPair(
      report,
      block["block-text"],
      block["block-background"],
      ramps,
      requiredRatio,
      `${blockType}-block-text vs ${blockType}-block-background`,
    );

    addValidationPair(
      report,
      block["block-text"],
      block["block-shade"],
      ramps,
      requiredRatio,
      `${blockType}-block-text vs ${blockType}-block-shade`,
    );
  }

  // Stock colors (informational only, no validation failure)
  const stock = (theme as any).stock;
  if (stock) {
    for (const [colorName, colorRef] of Object.entries(stock)) {
      addValidationPair(
        report,
        colorRef as string,
        theme.primary.background,
        ramps,
        null as any,
        `stock-${colorName} vs primary-background`,
      );
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
  ramps: GeneratedRamps,
): Record<string, ThemeValidationReport> {
  const result: Record<string, ThemeValidationReport> = {};

  for (const [themeName, theme] of Object.entries(themes)) {
    // Skip metadata properties
    if (
      themeName === "default-light-theme" ||
      themeName === "default-dark-theme"
    ) {
      continue;
    }
    result[themeName] = validateTheme(themeName, theme as Theme, ramps);
  }

  return result;
}
