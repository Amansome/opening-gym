// Renders public/favicon.svg into the PNG icons the web manifest needs, using Playwright screenshots.
//   node scripts/make-icons.mjs
// Output (committed): public/icons/icon-192.png, icon-512.png, maskable-192.png, maskable-512.png, apple-touch-icon.png
// "Maskable" icons are full-bleed and keep the glyph inside the central 80% safe zone.
import fs from "node:fs";
import { loadPlaywright } from "./lib/playwright.mjs";

const root = new URL("..", import.meta.url);
const svg = fs.readFileSync(new URL("public/favicon.svg", root), "utf8");
const outDir = new URL("public/icons/", root);
fs.mkdirSync(outDir, { recursive: true });

// The favicon is a rounded square (64 viewBox) filled with the brand colour and a white pawn.
const brand = /<rect[^>]*fill="(#[0-9a-fA-F]{3,8})"/.exec(svg)?.[1] ?? "#6f4cff";
const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const glyph = inner.replace(/<rect[^>]*rx="14"[^>]*\/>/, ""); // everything except the rounded background

const variants = [
  // "any": the favicon as is, rounded corners on a transparent background.
  { file: "icon-192.png", size: 192, html: (s) => `<div style="width:${s}px;height:${s}px">${svg.replace("<svg ", `<svg width="${s}" height="${s}" `)}</div>`, transparent: true },
  { file: "icon-512.png", size: 512, html: (s) => `<div style="width:${s}px;height:${s}px">${svg.replace("<svg ", `<svg width="${s}" height="${s}" `)}</div>`, transparent: true },
  // maskable: square, full bleed, glyph at ~62% so any mask shape keeps it
  ...[192, 512].map((size) => ({
    file: `maskable-${size}.png`,
    size,
    transparent: false,
    html: (s) =>
      `<div style="width:${s}px;height:${s}px;background:${brand};display:grid;place-items:center"><svg width="${s * 0.64}" height="${s * 0.64}" viewBox="0 0 64 64">${glyph}</svg></div>`,
  })),
  // iOS ignores transparency and applies its own mask: full-bleed square at 180
  {
    file: "apple-touch-icon.png",
    size: 180,
    transparent: false,
    html: (s) =>
      `<div style="width:${s}px;height:${s}px;background:${brand};display:grid;place-items:center"><svg width="${s * 0.74}" height="${s * 0.74}" viewBox="0 0 64 64">${glyph}</svg></div>`,
  },
];

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const v of variants) {
  await page.setViewportSize({ width: v.size, height: v.size });
  await page.setContent(`<!doctype html><style>html,body{margin:0;padding:0;background:transparent}</style>${v.html(v.size)}`);
  await page.screenshot({ path: new URL(v.file, outDir).pathname, omitBackground: v.transparent, clip: { x: 0, y: 0, width: v.size, height: v.size } });
  console.log("wrote public/icons/" + v.file);
}
await browser.close();
