import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted display faces (OFL): no external font requests.
import "@fontsource/graduate/400.css";
import "@fontsource/saira-condensed/600.css";
import "@fontsource/saira-condensed/800.css";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./lib/custom/boot";
import App from "./App.tsx";
import { registerServiceWorker } from "./pwa";

// Prerendered pages ship their JSON-LD in <head>; the page's own hook adds it again on mount, so drop the static copy.
document.querySelectorAll('script[data-og="jsonld"]').forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline support: register the service worker (production builds only).
registerServiceWorker();
