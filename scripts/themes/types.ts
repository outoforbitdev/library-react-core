export interface RampsInput {
  [colorFamily: string]: {
    "500": string;
  };
}

export type RampStep =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export type GeneratedRamps = Record<string, Record<RampStep, string>>;

export interface BackgroundComponent {
  text: string;
  background: string;
  shade: string;
  link: string;
  ["link-visited"]: string;
}

export interface AccentComponent {
  text: string;
}

export interface StatusBlockComponent {
  text: string;
  ["block-text"]: string;
  ["block-background"]: string;
  ["block-shade"]: string;
}

export type StockColorName =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "magenta"
  | "pink"
  | "gray";

export type StockColors = Record<StockColorName, string>;

export type AccessibilityLevel = "AAA" | "AA";

export interface Theme {
  ["accessibility-level"]: AccessibilityLevel;
  primary: BackgroundComponent;
  secondary: BackgroundComponent;
  accent: AccentComponent;
  ["accent-block"]: BackgroundComponent;
  error: StatusBlockComponent;
  warning: StatusBlockComponent;
  submission: StatusBlockComponent;
  stock: StockColors;
}

export interface Themes {
  [themeName: string]: Theme | string;
  ["default-light-theme"]?: string;
  ["default-dark-theme"]?: string;
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
  accessibilityLevel: AccessibilityLevel;
  status: "pass" | "fail";
  errors: (string | ContrastPair)[];
  contrastPairs: ContrastPair[];
}

export interface ValidationReport {
  timestamp: string;
  summary: {
    totalThemes: number;
    passedThemes: number;
    failedThemes: number;
    overallStatus: "pass" | "fail";
  };
  themes: Record<string, ThemeValidationReport>;
}
