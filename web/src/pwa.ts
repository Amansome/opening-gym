// Service worker registration and the "New version available" toast.
// Plain DOM on purpose: it must work even if the new build's React tree is not what is on screen.

/** Set when the person clicks Reload: only then does a controller change reload the page. */
let reloadRequested = false;

function showUpdateToast(worker: ServiceWorker) {
  if (document.getElementById("og-update-toast")) return;
  const box = document.createElement("div");
  box.id = "og-update-toast";
  box.setAttribute("role", "status");
  box.setAttribute("aria-live", "polite");
  Object.assign(box.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "calc(var(--bottom-nav-h, 0px) + 16px)",
    zIndex: "1000",
    display: "flex",
    gap: "12px",
    alignItems: "center",
    maxWidth: "calc(100vw - 32px)",
    padding: "10px 14px",
    background: "var(--surface-2)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    font: "inherit",
    fontSize: "0.95rem",
  } satisfies Partial<CSSStyleDeclaration>);

  const text = document.createElement("span");
  text.textContent = "New version available.";

  const reload = document.createElement("button");
  reload.type = "button";
  reload.textContent = "Reload";
  Object.assign(reload.style, {
    background: "var(--accent)",
    color: "var(--accent-text)",
    border: "0",
    borderRadius: "var(--radius-sm)",
    padding: "6px 12px",
    font: "inherit",
    fontWeight: "600",
    cursor: "pointer",
  } satisfies Partial<CSSStyleDeclaration>);
  reload.addEventListener("click", () => {
    reloadRequested = true;
    reload.disabled = true;
    reload.textContent = "Updating…";
    worker.postMessage({ type: "SKIP_WAITING" }); // controllerchange (below) reloads the page
  });

  const later = document.createElement("button");
  later.type = "button";
  later.textContent = "Later";
  later.setAttribute("aria-label", "Dismiss update notice");
  Object.assign(later.style, {
    background: "transparent",
    color: "var(--text-muted)",
    border: "0",
    padding: "6px",
    font: "inherit",
    cursor: "pointer",
  } satisfies Partial<CSSStyleDeclaration>);
  later.addEventListener("click", () => box.remove());

  box.append(text, reload, later);
  document.body.appendChild(box);
}

/** Production builds only. Safe to call once at startup. */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        const announce = (worker: ServiceWorker | null) => {
          // No controller means this is the very first install: nothing to update from.
          if (worker && navigator.serviceWorker.controller) showUpdateToast(worker);
        };
        announce(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed") announce(worker);
          });
        });
        // Long-lived tabs: look for a new deploy when the tab comes back to the foreground.
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        });
      })
      .catch(() => {});

    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // The very first install also fires this (clients.claim); only reload after the person asked for the update.
      if (!reloadRequested || reloading) return;
      reloading = true;
      window.location.reload();
    });
  });
}
