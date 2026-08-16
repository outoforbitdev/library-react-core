import { readFileSync } from "fs";
import { RampsInput, InterpolatedRamps } from "./types.js";
import { interpolateRamp } from "./colors.js";

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
      errors.push(
        `Ramp ${colorFamily}: missing required endpoints (100 and/or 900)`,
      );
      continue;
    }

    result[colorFamily] = interpolateRamp(endpoints["100"], endpoints["900"]);
  }

  if (errors.length > 0) {
    throw new Error(`Ramp interpolation errors:\n${errors.join("\n")}`);
  }

  return result;
}

