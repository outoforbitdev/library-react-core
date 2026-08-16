import { readFileSync } from "fs";
import { RampsInput, InterpolatedRamps } from "./types.js";
import { generateRampFromSwatch } from "./colors.js";

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

  for (const [colorFamily, swatch] of Object.entries(rampsInput)) {
    if (!swatch["500"]) {
      errors.push(`Ramp ${colorFamily}: missing required 500 swatch value`);
      continue;
    }

    result[colorFamily] = generateRampFromSwatch(swatch["500"]);
  }

  if (errors.length > 0) {
    throw new Error(`Ramp interpolation errors:\n${errors.join("\n")}`);
  }

  return result;
}
