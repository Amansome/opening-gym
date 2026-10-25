// End-to-end smoke test against a RUNNING production preview (default http://localhost:4173).
//   npm run build && npx vite preview --port 4173 &   then   npm run e2e      (or: node e2e/smoke.mjs)
//   BASE_URL=http://localhost:4178 npm run e2e          to point it at another port or a deployed site
// It needs a production build because it tests the service worker and the prerendered pages.
// Checks: plays the first Learn line of a few courses by clicking squares, progress persistence and the
// activity heatmap, /analysis /check /create render without console errors, sitemap.xml/robots.txt and the
// prerendered SEO tags, OFFLINE reloads of the main pages (plus playing a line offline), and mobile overflow.
import fs from "node:fs";
import { loadPlaywright } from "../scripts/lib/playwright.mjs";

const { chromium } = await loadPlaywright();

const BASE = process.env.BASE_URL ?? "http://localhost:4173";
const OUT = process.env.SHOTS ?? "e2e/shots";
const courses = JSON.parse(fs.readFileSync(new URL("../src/data/courses.json", import.meta.url)));
fs.mkdirSync(OUT, { recursive: true });

const errors = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
let page = await ctx.newPage();
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

// activity heatmap: today's cell must show the lines learned above
{
  const cells = await page.locator(".heatmap-cell[role=img]").count();
  const today = await page.locator('.heatmap-cell[data-today="true"]').first().getAttribute("aria-label").catch(() => null);
  results.push(cells === 84 && /[1-9]\d* lines? completed/.test(today ?? "")
    ? `PASS activity heatmap: 84 cells, today = "${today}"`
    : `FAIL activity heatmap (cells=${cells}, today=${today})`);
  await page.locator("#activity-h").scrollIntoViewIfNeeded();
  await page.locator("section[aria-labelledby=activity-h]").screenshot({ path: `${OUT}/heatmap.png` });
}

await page.goto(`${BASE}/dojo`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
results.push((await page.locator(".og-board").count()) ? "PASS dojo shows a board" : "FAIL dojo has no board");
await page.screenshot({ path: `${OUT}/dojo.png` });

// tool pages render without console errors
for (const route of ["/analysis", "/check", "/create"]) {
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForSelector("#root h1", { timeout: 10000 });
    await page.waitForTimeout(500);
    results.push(`PASS ${route} renders ("${(await page.locator("#root h1").first().innerText()).trim()}")`);
  } catch (e) { results.push(`FAIL ${route} did not render: ${e.message.split("\n")[0]}`); }
}

// sitemap, robots and prerendered SEO tags (served by the build; skipped checks are reported, not failed, when SKIP_PRERENDER was used)
{
  const sitemap = await ctx.request.get(BASE + "/sitemap.xml");
  const xml = sitemap.ok() ? await sitemap.text() : "";
  const missing = courses.filter((c) => !xml.includes(`/opening/${c.id}</loc>`));
  results.push(sitemap.ok() && xml.includes("<urlset") && !missing.length
    ? `PASS sitemap.xml lists ${(xml.match(/<loc>/g) ?? []).length} URLs incl. all ${courses.length} openings`
    : `FAIL sitemap.xml (status ${sitemap.status()}, missing ${missing.length} openings)`);
  const robots = await ctx.request.get(BASE + "/robots.txt");
  results.push(robots.ok() && /Sitemap: .+sitemap\.xml/.test(await robots.text()) ? "PASS robots.txt points at the sitemap" : "FAIL robots.txt");

  // raw HTML, no JavaScript: what a crawler sees
  for (const c of courses.filter((x) => x.article?.faq?.length).slice(0, 2)) {
    const raw = await (await ctx.request.get(`${BASE}/opening/${c.id}`)).text();
    const ok = /<title>[^<]*<\/title>/.test(raw) && /<link rel="canonical" href="[^"]+\/opening\//.test(raw) && raw.includes('property="og:title"')
      && raw.includes('name="twitter:card"') && raw.includes("FAQPage") && /<h1[ >]/.test(raw);
    results.push(ok ? `PASS prerendered HTML of /opening/${c.id} has title, canonical, og/twitter, FAQ JSON-LD, h1`
                    : `FAIL prerendered HTML of /opening/${c.id} lacks SEO tags (was the build run without prerender?)`);
  }
}

// OFFLINE: the service worker must now control the page and have the app cached.
{
  const online = await ctx.newPage();
  online.on("pageerror", (e) => errors.push(`offline-setup ${online.url()}: ${e.message}`));
  await online.goto(BASE + "/", { waitUntil: "networkidle" });
  const controlled = await online.waitForFunction(() => !!navigator.serviceWorker?.controller, null, { timeout: 15000 }).then(() => true, () => false);
  results.push(controlled ? "PASS service worker controls the page" : "FAIL service worker never took control (is this a production build?)");
  // pages the person visited online; the precache should make even unvisited ones work
  for (const r of ["/openings", "/opening/london-system"]) await online.goto(BASE + r, { waitUntil: "networkidle" });
  await online.close();

  if (controlled) {
    await ctx.setOffline(true);
    const off = await ctx.newPage();
    const offErrors = [];
    off.on("console", (m) => { if (m.type() === "error") offErrors.push(`${m.text()}`); });
    off.on("pageerror", (e) => offErrors.push(e.message));
    for (const r of ["/", "/openings", "/opening/london-system", "/dojo", "/about", "/progress", "/opening/caro-kann"]) {
      try {
        await off.goto(BASE + r, { waitUntil: "load" });
        await off.waitForSelector("#root h1", { timeout: 10000 });
        results.push(`PASS offline reload ${r}`);
      } catch (e) { results.push(`FAIL offline reload ${r}: ${e.message.split("\n")[0]}`); await off.screenshot({ path: `${OUT}/offline-fail${r.replace(/\//g, "-")}.png` }); }
    }
    // dojo trainer offline (courses were started above, so it has lines to train)
    await off.goto(BASE + "/dojo", { waitUntil: "load" });
    await off.waitForSelector(".og-board", { timeout: 10000 }).then(
      () => results.push("PASS offline dojo shows a board"),
      () => results.push("FAIL offline dojo has no board"),
    );
    await off.screenshot({ path: `${OUT}/offline-dojo.png` });
    await off.screenshot({ path: `${OUT}/offline-home.png` }).catch(() => {});
    // learn a line completely offline
    const keep = page; // playFirstLine uses the module-level `page`
    page = off;
    try { const l = await playFirstLine("london-system"); results.push(`PASS learn london-system OFFLINE / ${l.name}`); }
    catch (e) { results.push(`FAIL learn london-system offline: ${e.message.split("\n")[0]}`); await off.screenshot({ path: `${OUT}/offline-learn-fail.png` }); }
    page = keep;
    if (offErrors.length) results.push(`FAIL console errors while offline:\n  ${[...new Set(offErrors)].join("\n  ")}`);
    await off.close();
    await ctx.setOffline(false);
  }
}

// every route, mobile overflow
const mob = await browser.newContext({ viewport: { width: 360, height: 780 } });
const mp = await mob.newPage();
mp.on("pageerror", (e) => errors.push(`${mp.url()}: ${e.message}`));
for (const r of ["/", "/openings", "/dojo", "/progress", "/about", "/analysis", "/check", "/create", "/nope", ...courses.map((c) => `/opening/${c.id}`)]) {
  await mp.goto(BASE + r, { waitUntil: "networkidle" });
  const over = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (over > 0) results.push(`FAIL overflow ${r} by ${over}px`);
}
results.push("checked mobile overflow on " + (9 + courses.length) + " routes");
await browser.close();
console.log(results.join("\n"));
console.log(errors.length ? "CONSOLE ERRORS:\n" + [...new Set(errors)].join("\n") : "no console errors");
process.exit(results.some((r) => r.startsWith("FAIL")) || errors.length ? 1 : 0);
