import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadRamps, interpolateRamps } from "./ramps.js";
import { loadThemes, validateAllThemes } from "./validation.js";
import { writeConsolidatedCSS } from "./css.js";
import { ValidationReport } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  try {
    const rampsPath = resolve(__dirname, "ramps.json");
    const themesPath = resolve(__dirname, "themes.json");
    const cssOutputPath = resolve(__dirname, "../../src/themes/themes.css");
    const reportPath = resolve(__dirname, "../../validation-report.json");

    console.log("🎨 Theme Validation & CSS Generation");
    console.log("=====================================\n");

    // Load and interpolate ramps
    console.log("📦 Loading color ramps...");
    const rampsInput = loadRamps(rampsPath);
    const interpolatedRamps = interpolateRamps(rampsInput);

    console.log("✓ Ramps loaded and interpolated");

    // Load and validate themes
    console.log("📦 Loading themes...");
    const themes = loadThemes(themesPath);
    console.log(`✓ Loaded ${Object.keys(themes).length} theme(s)`);

    console.log("🔍 Validating themes...");
    const themesReport = validateAllThemes(themes, interpolatedRamps);

    let passedCount = 0;
    let failedCount = 0;

    for (const [themeName, report] of Object.entries(themesReport)) {
      if (report.status === "pass") {
        console.log(`  ✓ ${themeName}`);
        passedCount++;
      } else {
        console.log(`  ✗ ${themeName}`);
        failedCount++;
        if (report.errors.length > 0) {
          report.errors.slice(0, 3).forEach((error) => {
            const msg = typeof error === "string" ? error : error.label;
            console.log(`    - ${msg}`);
          });
          if (report.errors.length > 3) {
            console.log(
              `    ... and ${report.errors.length - 3} more error(s)`,
            );
          }
        }
      }
    }

    // Generate CSS for valid themes
    console.log("\n📝 Generating CSS...");
    writeConsolidatedCSS(interpolatedRamps, themes, cssOutputPath);
    console.log(`✓ Generated ${cssOutputPath}`);

    // Write validation report
    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalThemes: Object.keys(themes).length,
        passedThemes: passedCount,
        failedThemes: failedCount,
        overallStatus: failedCount === 0 ? "pass" : "fail",
      },
      themes: themesReport,
    };

    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
    console.log(`✓ Generated ${reportPath}`);

    // Summary
    console.log("\n" + "=".repeat(37));
    if (failedCount === 0) {
      console.log("✓ VALIDATION PASSED");
      console.log(`${passedCount} theme(s) validated and CSS generated`);
      process.exit(0);
    } else {
      console.error("✗ VALIDATION FAILED");
      console.error(
        `${passedCount} theme(s) passed, ${failedCount} theme(s) failed`,
      );
      console.error("\nSee validation-report.json for details");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n✗ ERROR");
    console.error((error as Error).message);
    process.exit(1);
  }
}

main();
