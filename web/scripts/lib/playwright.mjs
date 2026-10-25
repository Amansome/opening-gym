// Loads Playwright from the project, or from the global install as a fallback (no dependency is added).
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

export async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return createRequire(execSync("npm root -g").toString().trim() + "/")("playwright");
  }
}
