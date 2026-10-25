import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * BASE_PATH: where the app is served from. "/" for a domain root (default), "/repo-name/" for a
 * GitHub Pages project site. Leading/trailing slashes are normalised.
 */
export function normaliseBase(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}/` : "/";
}

/** Files that never go into the offline precache (served on demand, or not part of the app). */
const NOT_PRECACHED = [/^engine\//, /^sw\.js$/, /^robots\.txt$/, /^sitemap\.xml$/, /^_redirects$/, /^_headers$/, /\.map$/, /^404\.html$/];

function walk(dir: string, root = dir): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, root));
    else out.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return out.sort();
}

/**
 * Offline support, build side. After the bundle is on disk:
 *  1. copies the clean (not prerendered) index.html to shell.html: the SPA fallback page that
 *     the service worker and the hosting rewrites serve for any route;
 *  2. lists every built file the app needs (JS/CSS chunks, icons, manifest, shell) and writes that
 *     list plus a build id (hash of the file names and contents) into dist/sw.js.
 * The stockfish files under engine/ are deliberately left out: the worker caches them on first use.
 */
function offlineManifest(): Plugin {
  let outDir = "dist";
  return {
    name: "og-offline-manifest",
    apply: "build",
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
    },
    closeBundle: {
      order: "post",
      handler() {
        const indexPath = path.join(outDir, "index.html");
        if (!fs.existsSync(indexPath)) return;
        fs.copyFileSync(indexPath, path.join(outDir, "shell.html"));

        const files = walk(outDir).filter((f) => f !== "index.html" && !NOT_PRECACHED.some((re) => re.test(f)));
        const hash = createHash("sha256");
        for (const f of files) {
          hash.update(f);
          hash.update(fs.readFileSync(path.join(outDir, f)));
        }
        const buildId = hash.digest("hex").slice(0, 12);

        const swPath = path.join(outDir, "sw.js");
        if (!fs.existsSync(swPath)) throw new Error("dist/sw.js missing: public/sw.js was not copied");
        let sw = fs.readFileSync(swPath, "utf8");
        if (!sw.includes('"__BUILD_ID__"') || !sw.includes('"__PRECACHE__"')) {
          throw new Error("public/sw.js lost its __BUILD_ID__ / __PRECACHE__ placeholders");
        }
        sw = sw.replace('"__BUILD_ID__"', JSON.stringify(buildId)).replace('"__PRECACHE__"', JSON.stringify(files));
        fs.writeFileSync(swPath, sw);
        console.log(`[offline] precache: ${files.length} files, build ${buildId}`);
      },
    },
  };
}

/**
 * `vite preview` only serves a folder's index.html for URLs that end in "/", while real static hosts also
 * answer "/opening/london-system". Mirror the hosts so previewing (and the e2e tests) see the prerendered pages.
 */
function previewPrerenderedPages(): Plugin {
  let outDir = "dist";
  let base = "/";
  return {
    name: "og-preview-prerendered-pages",
    apply: "serve",
    configResolved(cfg) {
      outDir = path.resolve(cfg.root, cfg.build.outDir);
      base = cfg.base;
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [pathname, query = ""] = (req.url ?? "").split("?");
        if (pathname.startsWith(base) && !pathname.endsWith("/") && !path.extname(pathname)) {
          const rel = pathname.slice(base.length);
          if (rel && fs.existsSync(path.join(outDir, rel, "index.html"))) req.url = `${pathname}/index.html${query ? "?" + query : ""}`;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: normaliseBase(process.env.BASE_PATH),
  // OUT_DIR lets CI or a second terminal build somewhere other than dist/ without clobbering it.
  build: { outDir: process.env.OUT_DIR || "dist" },
  plugins: [react(), offlineManifest(), previewPrerenderedPages()],
});
