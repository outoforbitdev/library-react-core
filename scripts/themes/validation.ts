import { readFileSync } from "fs";
import {
  Themes,
  Theme,
  GeneratedRamps,
  ThemeValidationReport,
  ValidationReport,
  ContrastPair,
  BackgroundComponent,
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

function resolveSwatchRef(ref: string, ramps: GeneratedRamps): string {
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
  texts: TextColorPair[],
  ramps: GeneratedRamps,
  requiredRatio: number,
): void {
  for (const { text, label } of texts) {
    for (const background of [
      { value: component.background, suffix: "background" },
      { value: component.shade, suffix: "shade" },
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
    accessibilityLevel: theme["accessibility-level"] as string,
    status: "pass",
    errors: [],
    contrastPairs: [],
  };

  const primaryTexts: TextColorPair[] = [
    { text: theme.primary.text, label: "primary-text" },
    { text: theme.primary.link, label: "primary-link" },
    { text: theme.primary["link-visited"], label: "primary-link-visited" },
    { text: theme.accent.text, label: "accent-text" },
    { text: (theme as any).error.text, label: "error-text" },
    { text: (theme as any).warning.text, label: "warning-text" },
    { text: (theme as any).submission.text, label: "submission-text" },
  ].filter((p) => p.text);

  validateBackgroundComponent(
    report,
    "primary",
    theme.primary,
    primaryTexts,
    ramps,
    requiredRatio,
  );

  const secondaryTexts: TextColorPair[] = [
    { text: theme.secondary.text, label: "secondary-text" },
    { text: theme.secondary.link, label: "secondary-link" },
    { text: theme.secondary["link-visited"], label: "secondary-link-visited" },
    { text: theme.accent.text, label: "accent-text" },
    { text: (theme as any).error.text, label: "error-text" },
    { text: (theme as any).warning.text, label: "warning-text" },
    { text: (theme as any).submission.text, label: "submission-text" },
  ].filter((p) => p.text);

  validateBackgroundComponent(
    report,
    "secondary",
    theme.secondary,
    secondaryTexts,
    ramps,
    requiredRatio,
  );

  if (
    (theme as any)["accent-block"] &&
    (theme as any)["accent-block"].text &&
    (theme as any)["accent-block"].background
  ) {
    const accentBlock = (theme as any)["accent-block"];
    addValidationPair(
      report,
      accentBlock.text,
      accentBlock.background,
      ramps,
      requiredRatio,
      "accent-block-text vs accent-block-background",
    );

    if (accentBlock.shade) {
      addValidationPair(
        report,
        accentBlock.text,
        accentBlock.shade,
        ramps,
        requiredRatio,
        "accent-block-text vs accent-block-shade",
      );
    }

    if (accentBlock.link) {
      addValidationPair(
        report,
        accentBlock.link,
        accentBlock.background,
        ramps,
        requiredRatio,
        "accent-block-link vs accent-block-background",
      );
    }

    if (accentBlock["link-visited"]) {
      addValidationPair(
        report,
        accentBlock["link-visited"],
        accentBlock.background,
        ramps,
        requiredRatio,
        "accent-block-link-visited vs accent-block-background",
      );
    }
  }

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

    addValidationPair(
      report,
      block["block-text"],
      theme.primary.background,
      ramps,
      requiredRatio,
      `${blockType}-block-text vs primary-background`,
    );

    addValidationPair(
      report,
      block["block-text"],
      theme.secondary.background,
      ramps,
      requiredRatio,
      `${blockType}-block-text vs secondary-background`,
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
    result[themeName] = validateTheme(themeName, theme, ramps);
  }

  return result;
}
