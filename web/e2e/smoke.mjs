// End-to-end smoke test against a running server (default http://localhost:4173).
//   npx vite build && npx vite preview --port 4173 &  node e2e/smoke.mjs
// Plays the first Learn line of a few courses by clicking squares, checks the celebration,
// reloads to verify progress persisted in IndexedDB, and visits every route checking for console errors.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import fs from "node:fs";

let pw;
try { pw = await import("playwright"); } catch { pw = createRequire(execSync("npm root -g").toString().trim() + "/")("playwright"); }
const { chromium } = pw;

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const OUT = process.env.SHOTS ?? "e2e/shots";
const courses = JSON.parse(fs.readFileSync(new URL("../src/data/courses.json", import.meta.url)));
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(`${page.url()}: ${m.text()}`); });
page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));

function lineNodes(course, line) {
  const out = []; let level = course.tree;
  for (const san of line.sans) { const n = level.find((x) => x.san === san); out.push(n); level = n.children; }
  return out;
}
const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

async function clickSquare(sq) {
  const board = page.locator(".og-board").first();
  const box = await board.boundingBox();
  const orient = await board.getAttribute("data-orientation");
  let f = sq.charCodeAt(0) - 97, r = Number(sq[1]);
  if (orient === "black") { f = 7 - f; r = 9 - r; }
  await page.mouse.click(box.x + (f + 0.5) * box.width / 8, box.y + (8 - r + 0.5) * box.height / 8);
}

async function playFirstLine(courseId) {
  const course = courses.find((c) => c.id === courseId);
  const line = course.lines[0];
  await page.goto(`${BASE}/opening/${courseId}`, { waitUntil: "networkidle" });
  const go = page.getByRole("button", { name: /let's go/i });
  if (await go.count()) await go.first().click();
  const nodes = lineNodes(course, line);
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].trained) continue;
    const before = i === 0 ? START : nodes[i - 1].fen;
    await page.waitForFunction((fen) => document.querySelector(".og-board")?.getAttribute("data-fen")?.split(" ")[0] === fen.split(" ")[0], before, { timeout: 10000 });
    await page.waitForTimeout(150);
    const u = nodes[i].uci;
    await clickSquare(u.slice(0, 2)); await page.waitForTimeout(120); await clickSquare(u.slice(2, 4));
    if (u.length === 5) { await page.waitForTimeout(400); /* promotion dialog: pick piece */ await page.locator(`[data-piece="${(i % 2 ? "b" : "w") + u[4]}"]`).last().click().catch(() => {}); }
  }
  await page.getByText(/line learned/i).first().waitFor({ timeout: 10000 });
  await page.screenshot({ path: `${OUT}/${courseId}-done.png` });
  return line;
}

const results = [];
for (const id of ["vienna-gambit", "caro-kann", "opening-traps", "stafford-gambit"]) {
  try { const l = await playFirstLine(id); results.push(`PASS learn ${id} / ${l.name}`); }
  catch (e) { results.push(`FAIL learn ${id}: ${e.message.split("\n")[0]}`); await page.screenshot({ path: `${OUT}/${id}-fail.png` }); }
}

// persistence
await page.goto(`${BASE}/progress`, { waitUntil: "networkidle" });
await page.reload({ waitUntil: "networkidle" });
const progressText = await page.locator("main").innerText();
results.push(/1\s*\/\s*\d+|learned/i.test(progressText) ? "PASS progress page renders after reload" : "FAIL progress page");
await page.screenshot({ path: `${OUT}/progress.png`, fullPage: true });

await page.goto(`${BASE}/dojo`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
results.push((await page.locator(".og-board").count()) ? "PASS dojo shows a board" : "FAIL dojo has no board");
await page.screenshot({ path: `${OUT}/dojo.png` });

// every route, mobile overflow
const mob = await browser.newContext({ viewport: { width: 360, height: 780 } });
const mp = await mob.newPage();
mp.on("pageerror", (e) => errors.push(`${mp.url()}: ${e.message}`));
for (const r of ["/", "/openings", "/dojo", "/progress", "/about", "/nope", ...courses.map((c) => `/opening/${c.id}`)]) {
  await mp.goto(BASE + r, { waitUntil: "networkidle" });
  const over = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 0) results.push(`FAIL overflow ${r} by ${over}px`);
}
results.push("checked mobile overflow on " + (6 + courses.length) + " routes");
await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? "CONSOLE ERRORS:\n" + [...new Set(errors)].join("\n") : "no console errors");
process.exit(results.some((r) => r.startsWith("FAIL")) || errors.length ? 1 : 0);
