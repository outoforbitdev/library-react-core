import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { InterpolatedRamps, Themes, Theme } from "./types.js";

function generateSwatchVariables(ramps: InterpolatedRamps): string {
  let css = ":root {\n";

  for (const [colorFamily, swatches] of Object.entries(ramps)) {
    for (const step of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      const hex = swatches[step.toString()];
      css += `  --ood-${colorFamily}-${step}: ${hex};\n`;
    }
  }

  css += "}\n\n";
  return css;
}

function flattenThemeTokens(theme: Theme, prefix = ""): Record<string, string> {
  const tokens: Record<string, string> = {};

  const processObj = (obj: any, currentPrefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        // Use "color" prefix for stock colors instead of "stock"
        const keyPrefix = currentPrefix === "stock" ? "color" : currentPrefix;
        const tokenName = keyPrefix ? `${keyPrefix}-${key}` : key;
        tokens[tokenName] = value;
      } else if (typeof value === "object" && value !== null) {
        const newPrefix = currentPrefix ? `${currentPrefix}-${key}` : key;
        processObj(value, newPrefix);
      }
    }
  };

  processObj(theme, prefix);
  return tokens;
}

function resolveSwatchRefForCSS(ref: string, ramps: InterpolatedRamps): string {
  const lastHyphenIdx = ref.lastIndexOf("-");
  const colorFamily = ref.substring(0, lastHyphenIdx);
  const step = ref.substring(lastHyphenIdx + 1);

  if (!ramps[colorFamily] || !ramps[colorFamily][step]) {
    throw new Error(`Invalid swatch reference: ${ref}`);
  }
  return ramps[colorFamily][step];
}

function generateDefaultThemeTokens(
  themes: Themes,
  ramps: InterpolatedRamps,
): string {
  const lightTheme = themes.light;
  if (!lightTheme) {
    throw new Error("Light theme not found in themes.json");
  }

  const tokens = flattenThemeTokens(lightTheme);
  let css = ":root {\n";

  for (const [name, swatchRef] of Object.entries(tokens)) {
    if (name === "accessibility-level") continue;
    try {
      resolveSwatchRefForCSS(swatchRef, ramps);
      css += `  --ood-${name}: var(--ood-${swatchRef});\n`;
    } catch {
      // Skip invalid references
    }
  }

  css += "}\n\n";
  return css;
}

function generateMediaQueryThemeTokens(
  themes: Themes,
  ramps: InterpolatedRamps,
): string {
  const darkTheme = themes.dark;
  if (!darkTheme) {
    return "";
  }

  const tokens = flattenThemeTokens(darkTheme);
  let css =
    "@media (prefers-color-scheme: dark) {\n  :root:not([data-theme]) {\n";

  for (const [name, swatchRef] of Object.entries(tokens)) {
    if (name === "accessibility-level") continue;
    try {
      resolveSwatchRefForCSS(swatchRef, ramps);
      css += `    --ood-${name}: var(--ood-${swatchRef});\n`;
    } catch {
      // Skip invalid references
    }
  }

  css += "  }\n}\n\n";
  return css;
}

function generateExplicitThemeTokens(
  themes: Themes,
  ramps: InterpolatedRamps,
): string {
  let css = "";

  for (const [themeName, theme] of Object.entries(themes)) {
    const tokens = flattenThemeTokens(theme);
    css += `:root[data-theme="${themeName}"] {\n`;

    for (const [name, swatchRef] of Object.entries(tokens)) {
      if (name === "accessibility-level") continue;
      try {
        resolveSwatchRefForCSS(swatchRef, ramps);
        css += `  --ood-${name}: var(--ood-${swatchRef});\n`;
      } catch {
        // Skip invalid references
      }
    }

    css += "}\n\n";
  }

  return css;
}

function generateUtilityClasses(): string {
  return `.ood-primary,
.ood-secondary,
.ood-accent,
.ood-accent-block,
.ood-error,
.ood-error-block,
.ood-warning,
.ood-warning-block,
.ood-submission,
.ood-submission-block,
.ood-submit,
.ood-submit-block {
  color: var(--ood-text);
  background: var(--ood-background);
}

.ood-primary a,
.ood-secondary a,
.ood-accent a,
.ood-accent-block a,
.ood-error a,
.ood-error-block a,
.ood-warning a,
.ood-warning-block a,
.ood-submission a,
.ood-submission-block a,
.ood-submit a,
.ood-submit-block a {
  color: var(--ood-link);
  text-decoration: none;
}

.ood-primary a:visited,
.ood-secondary a:visited,
.ood-accent a:visited,
.ood-accent-block a:visited,
.ood-error a:visited,
.ood-error-block a:visited,
.ood-warning a:visited,
.ood-warning-block a:visited,
.ood-submission a:visited,
.ood-submission-block a:visited,
.ood-submit a:visited,
.ood-submit-block a:visited {
  color: var(--ood-link-visited);
}

.ood-primary a:hover,
.ood-secondary a:hover,
.ood-accent a:hover,
.ood-accent-block a:hover,
.ood-error a:hover,
.ood-error-block a:hover,
.ood-warning a:hover,
.ood-warning-block a:hover,
.ood-submission a:hover,
.ood-submission-block a:hover,
.ood-submit a:hover,
.ood-submit-block a:hover {
  text-decoration: underline;
}

.ood-primary .hoverable:hover,
.ood-secondary .hoverable:hover,
.ood-accent .hoverable:hover,
.ood-accent-block .hoverable:hover,
.ood-error .hoverable:hover,
.ood-error-block .hoverable:hover,
.ood-warning .hoverable:hover,
.ood-warning-block .hoverable:hover,
.ood-submission .hoverable:hover,
.ood-submission-block .hoverable:hover,
.ood-submit .hoverable:hover,
.ood-submit-block .hoverable:hover {
  background: var(--ood-shade);
}

.ood-primary {
  --ood-text: var(--ood-primary-text);
  --ood-background: var(--ood-primary-background);
  --ood-shade: var(--ood-primary-shade);
  --ood-link: var(--ood-primary-link);
  --ood-link-visited: var(--ood-primary-link-visited);
}

.ood-secondary {
  --ood-text: var(--ood-secondary-text);
  --ood-background: var(--ood-secondary-background);
  --ood-shade: var(--ood-secondary-shade);
  --ood-link: var(--ood-secondary-link);
  --ood-link-visited: var(--ood-secondary-link-visited);
}

.ood-accent {
  --ood-text: var(--ood-accent-text);
}

.ood-accent-block {
  --ood-text: var(--ood-accent-block-text);
  --ood-background: var(--ood-accent-block-background);
  --ood-shade: var(--ood-accent-block-shade);
  --ood-link: var(--ood-accent-block-link);
  --ood-link-visited: var(--ood-accent-block-link-visited);
}

.ood-error {
  --ood-text: var(--ood-error-text);
}

.ood-error-block {
  --ood-text: var(--ood-error-block-text);
  --ood-background: var(--ood-error-block-background);
  --ood-shade: var(--ood-error-block-shade);
}

.ood-warning {
  --ood-text: var(--ood-warning-text);
}

.ood-warning-block {
  --ood-text: var(--ood-warning-block-text);
  --ood-background: var(--ood-warning-block-background);
  --ood-shade: var(--ood-warning-block-shade);
}

.ood-submission {
  --ood-text: var(--ood-submission-text);
}

.ood-submission-block {
  --ood-text: var(--ood-submission-block-text);
  --ood-background: var(--ood-submission-block-background);
  --ood-shade: var(--ood-submission-block-shade);
}

.ood-submit {
  --ood-text: var(--ood-submission-text);
}

.ood-submit-block {
  --ood-text: var(--ood-submission-block-text);
  --ood-background: var(--ood-submission-block-background);
  --ood-shade: var(--ood-submission-block-shade);
}
`;
}

export function writeConsolidatedCSS(
  ramps: InterpolatedRamps,
  themes: Themes,
  outputPath: string,
): void {
  let css = "";

  css += "/* Swatch variables - all color ramps */\n";
  css += generateSwatchVariables(ramps);

  css += "/* Default theme (light) */\n";
  css += generateDefaultThemeTokens(themes, ramps);

  css +=
    "/* Dark theme via prefers-color-scheme (unless data-theme is set) */\n";
  css += generateMediaQueryThemeTokens(themes, ramps);

  css += "/* Explicit theme overrides via data-theme attribute */\n";
  css += generateExplicitThemeTokens(themes, ramps);

  css += "/* Utility classes */\n";
  css += generateUtilityClasses();

  const dir = dirname(outputPath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(outputPath, css, "utf-8");
}
