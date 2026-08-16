import { readFileSync } from "fs";
import { RampsInput, InterpolatedRamps, RampsValidationReport } from "./types.js";
import { interpolateRamp, validateRampEndpoints, hexToHSL } from "./colors.js";

export function loadRamps(filePath: string): RampsInput {
  try {
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load ramps from ${filePath}: ${error}`);
  }
}

export function interpolateRamps(rampsInput: RampsInput): InterpolatedRamps {
  const result: InterpolatedRamps = {};
  const errors: string[] = [];

  for (const [colorFamily, endpoints] of Object.entries(rampsInput)) {
    if (!endpoints["100"] || !endpoints["900"]) {
      errors.push(`Ramp ${colorFamily}: missing required endpoints (100 and/or 900)`);
      continue;
    }

    const hsl100 = hexToHSL(endpoints["100"]);
    const hsl900 = hexToHSL(endpoints["900"]);

    const endpointErrors = validateRampEndpoints(hsl100, hsl900);
    if (endpointErrors.length > 0) {
      errors.push(`Ramp ${colorFamily}: ${endpointErrors.join("; ")}`);
    }

    result[colorFamily] = interpolateRamp(endpoints["100"], endpoints["900"]);
  }

  if (errors.length > 0) {
    throw new Error(`Ramp interpolation errors:\n${errors.join("\n")}`);
  }

  return result;
}

export function validateRamps(interpolatedRamps: InterpolatedRamps): RampsValidationReport {
  const report: RampsValidationReport = {
    status: "pass",
    errors: [],
  };

  const requiredSteps = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  for (const [colorFamily, swatches] of Object.entries(interpolatedRamps)) {
    for (const step of requiredSteps) {
      if (!swatches[step.toString()]) {
        report.errors.push(`Ramp ${colorFamily}: missing swatch ${step}`);
        report.status = "fail";
      }
    }
  }

  return report;
}
