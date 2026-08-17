import { GeneratedRamps, RampStep } from "./types.js";

export function resolveSwatchRef(
  ref: string,
  ramps: GeneratedRamps,
): string {
  const lastHyphenIdx = ref.lastIndexOf("-");
  const colorFamily = ref.substring(0, lastHyphenIdx);
  const step = ref.substring(lastHyphenIdx + 1) as RampStep;

  if (!ramps[colorFamily] || !ramps[colorFamily][step]) {
    throw new Error(`Invalid swatch reference: ${ref}`);
  }
  return ramps[colorFamily][step];
}
