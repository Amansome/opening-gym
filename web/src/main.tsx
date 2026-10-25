import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline support (production builds only): register the service worker, then warm the
// code-split page chunks while idle so the whole app is cached after the first visit.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
    const warm = () => {
      void import("./pages/Openings");
      void import("./pages/CoursePage");
      void import("./pages/DojoPage");
      void import("./pages/ProgressPage");
      void import("./pages/About");
      void import("./pages/NotFound");
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(warm, { timeout: 5000 });
    else setTimeout(warm, 3000);
  });
}
