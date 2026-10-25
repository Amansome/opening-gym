// Opening Gym service worker: makes the whole app work offline after the first visit.
//
// Build-time: vite.config.ts replaces the two placeholders below with the build id and the list of
// every file the app needs (JS/CSS chunks, icons, manifest, shell.html). They are relative to the
// service worker's scope, so the app also works under a sub-path (BASE_PATH).
//
// Caches:
//   og-precache-<build id>  everything in the list, filled at install, deleted when a newer build activates
//   og-runtime-v1           files fetched on first use that are too big to precache (the Stockfish engine)
//
// Update flow: a new build installs in the background and waits. The page shows "New version
// available" and, when the person clicks Reload, tells the waiting worker to SKIP_WAITING. We never
// swap mid-session on our own, so a tab never loads half old and half new chunks.
const BUILD_ID = "__BUILD_ID__";
const PRECACHE = "__PRECACHE__";

const PRECACHE_NAME = `og-precache-${BUILD_ID}`;
const RUNTIME_NAME = "og-runtime-v1";
const SCOPE = self.registration.scope; // always ends with "/"
const SHELL_URL = new URL("shell.html", SCOPE).href;
const NAVIGATION_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE_NAME).then((cache) =>
      // cache: "reload" bypasses the HTTP cache so a half-stale CDN response never ends up pinned.
      cache.addAll(Array.isArray(PRECACHE) ? PRECACHE.map((p) => new Request(new URL(p, SCOPE).href, { cache: "reload" })) : []),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PRECACHE_NAME, RUNTIME_NAME]);
      for (const key of await caches.keys()) {
        // Only touch our own caches (and the wave-1 "opening-gym-v1" one).
        if ((key.startsWith("og-") || key.startsWith("opening-gym-")) && !keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => (clearTimeout(timer), resolve(v)),
      (e) => (clearTimeout(timer), reject(e)),
    );
  });
}

async function handleNavigation(request) {
  try {
    // Online: the server's (prerendered) page. A slow or hung connection falls back to the shell.
    const response = await withTimeout(fetch(request), NAVIGATION_TIMEOUT_MS);
    // 404s from the host's own error page should still boot the app (the router shows its Not Found page).
    if (response.status === 404) throw new Error("not found");
    return response;
  } catch {
    const cached = await caches.match(SHELL_URL, { cacheName: PRECACHE_NAME, ignoreVary: true });
    return cached || (await caches.match(SHELL_URL, { ignoreVary: true })) || Response.error();
  }
}

async function handleAsset(request, url) {
  // ignoreVary: dev servers and some CDNs send "Vary: Origin", which would never match the cors-mode
  // requests that <script crossorigin> makes against entries stored by the install fetch.
  const hit = await caches.match(request, { cacheName: PRECACHE_NAME, ignoreVary: true });
  if (hit) return hit;
  const runtime = await caches.open(RUNTIME_NAME);
  const cachedRuntime = await runtime.match(request, { ignoreVary: true });
  if (cachedRuntime) return cachedRuntime;
  const response = await fetch(request);
  // Cache the engine on first use (big, rarely changes). Everything else is not stored: hashed
  // chunks of a newer build would otherwise pile up in the runtime cache forever.
  if (response.ok && response.status === 200 && url.pathname.startsWith(new URL("engine/", SCOPE).pathname)) {
    runtime.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(SCOPE).pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }
  // Ranged requests (media) cannot be answered from a cache entry.
  if (request.headers.has("range")) return;
  event.respondWith(handleAsset(request, url));
});
