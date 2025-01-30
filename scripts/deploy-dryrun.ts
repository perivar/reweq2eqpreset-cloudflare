import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const DIST_DIR = path.resolve("dist");

try {
  // Step 1: Build the project
  console.log("Building project with Wrangler...");
  execSync(`npx wrangler pages functions build --outdir ${DIST_DIR}`, {
    stdio: "inherit",
  });

  // Step 2: Calculate gzipped size
  console.log("Calculating gzipped size...");
  execSync(`npx tsx ./scripts/calculateGzippedSize.ts ${DIST_DIR}`, {
    stdio: "inherit",
  });

  // Step 3: Clean up
  if (fs.existsSync(DIST_DIR)) {
    console.log("Deleting 'dist' directory...");
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }

  console.log("Done.");
} catch (error) {
  console.error("An error occurred:", error);
}
