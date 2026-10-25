// Post-build SEO step: renders every route in a real browser and writes the HTML into dist/, so crawlers
// and link previews see the content, title, meta description, canonical URL, Open Graph/Twitter tags and
// FAQ JSON-LD without running JavaScript. The app's script tags stay in place; React then takes over
// with createRoot (it replaces the static markup rather than hydrating it).
//
//   node scripts/prerender.mjs          (runs automatically as part of `npm run build`)
//
// Environment:
//   SITE_URL         public origin used for canonical/og URLs, sitemap.xml and robots.txt (default https://example.com)
//   BASE_PATH        sub-path the site is served under, e.g. /opening-gym/ (default /). Must match the vite build.
//   SKIP_PRERENDER=1 skip the browser rendering (sitemap.xml and robots.txt are still written)
//   OUT_DIR          build output directory, relative to web/ (default dist; must match the vite build)
//   PRERENDER_STRICT=1  fail the build if rendering is impossible (default: warn and ship the plain SPA). CI sets it.
//   PRERENDER_PORT   port for the temporary `vite preview` server (default 4179)
//   PRERENDER_CONCURRENCY  pages rendered in parallel (default 4)
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPlaywright } from "./lib/playwright.mjs";

const webRoot = fileURLToPath(new URL("..", import.meta.url));
const dist = path.resolve(webRoot, process.env.OUT_DIR || "dist");
const courses = JSON.parse(fs.readFileSync(path.join(webRoot, "src/data/courses.json"), "utf8"));

const siteUrl = (process.env.SITE_URL || "https://example.com").replace(/\/+$/, "");
const trimmedBase = (process.env.BASE_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
const base = trimmedBase ? `/${trimmedBase}/` : "/";
const port = Number(process.env.PRERENDER_PORT || 4179);
const concurrency = Math.max(1, Number(process.env.PRERENDER_CONCURRENCY || 4));
const APP_NAME = "Opening Gym";

const staticRoutes = ["/", "/openings", "/dojo", "/progress", "/about", "/analysis", "/check", "/create"];
const routes = [...staticRoutes, ...courses.map((c) => `/opening/${c.id}`)];
/** Personal or empty-until-used pages: prerendered (so the shell has real content) but kept out of the sitemap. */
const NOT_IN_SITEMAP = new Set(["/progress"]);

/** Fallback meta for tool pages that do not set their own (used only when the page kept the site default title). */
const FALLBACK_META = {
  "/analysis": {
    title: `Analysis board | ${APP_NAME}`,
    description: "Analyse any position or game with Stockfish running in your browser. Free, private, works offline.",
  },
  "/check": {
    title: `Check my games | ${APP_NAME}`,
    description: "Find where your real games left your opening preparation. Paste a PGN or import games from Lichess.",
  },
  "/create": {
    title: `Create your own course | ${APP_NAME}`,
    description: "Build a custom opening course from your own lines and train it with spaced repetition, all on your device.",
  },
};

const urlFor = (route) => new URL(route === "/" ? base : base + route.slice(1), siteUrl + "/").href;

function writeSeoFiles() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.filter((r) => !NOT_IN_SITEMAP.has(r));
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((r) => `  <url><loc>${urlFor(r)}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
  const sitemapUrl = new URL(base + "sitemap.xml", siteUrl + "/").href;
  fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`);
  console.log(`[prerender] wrote sitemap.xml (${urls.length} URLs) and robots.txt for ${siteUrl}${base}`);
  if (!process.env.SITE_URL) console.log("[prerender] note: SITE_URL is not set, using https://example.com. Set it for real deployments.");
}

async function waitForServer(url, child, ms = 30000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (child.exitCode !== null) throw new Error("vite preview exited early");
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("vite preview did not start in time");
}

/** Runs in the page: add/replace SEO tags in <head> and return the full document. */
function finalisePage({ canonical, ogImage, siteName, fallback, noindex, faqLd }) {
  const head = document.head;
  const defaultTitle = `${siteName}: free chess opening trainer`;
  if (fallback && document.title === defaultTitle) document.title = fallback.title;
  let desc = document.querySelector('meta[name="description"]');
  if (!desc) {
    desc = document.createElement("meta");
    desc.name = "description";
    head.appendChild(desc);
  }
  if (fallback && (!desc.content || document.title === fallback.title)) desc.content = fallback.description;
  const title = document.title;
  const description = desc.content;

  const setMeta = (attr, key, content) => {
    let el = head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  let link = head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    head.appendChild(link);
  }
  link.href = canonical;

  setMeta("property", "og:site_name", siteName);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:image", ogImage);
  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", ogImage);
  if (noindex) setMeta("name", "robots", "noindex, follow");

  if (faqLd && !head.querySelector('script[type="application/ld+json"]')) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.setAttribute("data-og", "jsonld");
    s.text = JSON.stringify(faqLd);
    head.appendChild(s);
  }
  return { html: "<!doctype html>\n" + document.documentElement.outerHTML, title, description };
}

function faqJsonLd(course) {
  const faq = course?.article?.faq;
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

async function renderAll() {
  const viteBin = path.join(webRoot, "node_modules/vite/bin/vite.js");
  const server = spawn(process.execPath, [viteBin, "preview", "--port", String(port), "--strictPort", "--host", "127.0.0.1"], {
    cwd: webRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BASE_PATH: trimmedBase ? base : "/" },
  });
  let serverLog = "";
  server.stdout.on("data", (d) => (serverLog += d));
  server.stderr.on("data", (d) => (serverLog += d));
  const origin = `http://127.0.0.1:${port}`;
  const { chromium } = await loadPlaywright();
  let browser;
  try {
    await waitForServer(origin + base, server);
    browser = await chromium.launch();
    // No service worker while rendering: we want the network's HTML, not a cached shell.
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: "block" });
    const results = new Map();
    const problems = [];
    const queue = [...routes];

    async function worker() {
      const page = await context.newPage();
      page.on("pageerror", (e) => problems.push(`${page.url()}: ${e.message}`));
      for (let route = queue.shift(); route; route = queue.shift()) {
        const course = route.startsWith("/opening/") ? courses.find((c) => `/opening/${c.id}` === route) : undefined;
        await page.goto(origin + (route === "/" ? base : base + route.slice(1)), { waitUntil: "networkidle" });
        await page.waitForFunction(
          (want) => {
            const h1 = document.querySelector("#root h1");
            return !!h1 && (!want || document.title.includes(want));
          },
          course ? course.title : null,
          { timeout: 20000 },
        );
        const out = await page.evaluate(finalisePage, {
          canonical: urlFor(route),
          ogImage: new URL(base + "icons/icon-512.png", siteUrl + "/").href,
          siteName: APP_NAME,
          fallback: FALLBACK_META[route] ?? null,
          noindex: NOT_IN_SITEMAP.has(route),
          faqLd: faqJsonLd(course),
        });
        // Vite's preload helper added <link>s with absolute URLs of the temporary server; make them site-relative.
        out.html = out.html.replaceAll(origin, "");
        results.set(route, out);
      }
      await page.close();
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, routes.length) }, worker));
    await context.close();
    if (problems.length) console.warn("[prerender] page errors while rendering:\n  " + [...new Set(problems)].join("\n  "));
    return results;
  } catch (err) {
    console.error(serverLog.trim() ? `[prerender] vite preview output:\n${serverLog}` : "");
    throw err;
  } finally {
    await browser?.close().catch(() => {});
    server.kill("SIGTERM");
  }
}

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("[prerender] dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}

writeSeoFiles();

if (process.env.SKIP_PRERENDER === "1") {
  console.log("[prerender] SKIP_PRERENDER=1: not rendering pages");
  process.exit(0);
}

const started = Date.now();
let results;
try {
  results = await renderAll();
} catch (err) {
  // Hosts whose build image has no Playwright/Chromium (Netlify, Vercel) still get a working SPA, just without static HTML.
  if (process.env.PRERENDER_STRICT === "1") throw err;
  console.warn(`[prerender] WARNING: could not render pages (${err.message.split("\n")[0]}). The site still works as a SPA but has no static HTML for crawlers.`);
  console.warn("[prerender] Install Playwright + Chromium to enable it, or set PRERENDER_STRICT=1 to make this an error.");
  process.exit(0);
}
// Write only after every page rendered, so no render ever saw a previously prerendered page.
for (const [route, { html }] of results) {
  const file = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
// Sanity checks: fail the build if a page came out without what crawlers need.
const bad = [];
for (const [route, { html, title, description }] of results) {
  const course = route.startsWith("/opening/") ? courses.find((c) => `/opening/${c.id}` === route) : undefined;
  if (!title || !description) bad.push(`${route}: missing title or description`);
  if (!/<link rel="canonical"/.test(html) || !/property="og:title"/.test(html)) bad.push(`${route}: missing canonical or Open Graph tags`);
  if (!/<script type="module"/.test(html)) bad.push(`${route}: app script tag missing`);
  if (course?.article?.faq?.length && !html.includes("FAQPage")) bad.push(`${route}: FAQ JSON-LD missing`);
  if (!/<h1[ >]/.test(html)) bad.push(`${route}: no <h1>`);
}
if (bad.length) {
  console.error("[prerender] problems:\n  " + bad.join("\n  "));
  process.exit(1);
}
console.log(`[prerender] rendered ${results.size} pages in ${((Date.now() - started) / 1000).toFixed(1)}s`);
