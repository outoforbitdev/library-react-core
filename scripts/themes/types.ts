export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RampsInput {
  [colorFamily: string]: {
    "100": string;
    "900": string;
  };
}

export type InterpolatedRamps = Record<
  string,
  Record<"100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900", string>
>;

export interface PrimaryComponent {
  text: string;
  background: string;
  shade: string;
  link: string;
  linkHover: string;
  linkVisited: string;
  linkVisitedHover: string;
}

export interface SecondaryComponent {
  text: string;
  background: string;
  shade: string;
  link: string;
  linkHover: string;
  linkVisited: string;
  linkVisitedHover: string;
}

export interface AccentComponent {
  text: string;
  link?: string;
  linkHover?: string;
  linkVisited?: string;
  linkVisitedHover?: string;
}

export interface BlockComponent {
  text: string;
  blockText: string;
  blockBackground: string;
  blockHover: string;
}

export interface StockColors {
  [colorName: string]: string;
}

export interface Theme {
  accessibilityLevel: "AAA" | "AA";
  primary: PrimaryComponent;
  secondary: SecondaryComponent;
  accent: AccentComponent;
  error: BlockComponent;
  warning: BlockComponent;
  submission: BlockComponent;
  stock: StockColors;
}

export interface Themes {
  [themeName: string]: Theme;
}

export interface ContrastPair {
  label: string;
  foreground: string;
  background: string;
  fgHex: string;
  bgHex: string;
  contrastRatio: number;
  requiredRatio: number | null;
  passes: boolean | null;
}

export interface ThemeValidationReport {
  name: string;
  accessibilityLevel: "AAA" | "AA";
  status: "pass" | "fail";
  errors: (string | ContrastPair)[];
  contrastPairs: ContrastPair[];
}

export interface RampsValidationReport {
  status: "pass" | "fail";
  errors: string[];
}

export interface ValidationReport {
  timestamp: string;
  summary: {
    totalThemes: number;
    passedThemes: number;
    failedThemes: number;
    overallStatus: "pass" | "fail";
  };
  ramps: RampsValidationReport;
  themes: Record<string, ThemeValidationReport>;
}
