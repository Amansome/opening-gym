import { createBrowserRouter, RouterProvider } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";

// Heavy pages are code-split; Home is eager so the first paint needs one chunk.
const routes: RouteObject[] = [
  {
    element: <Layout />,
    HydrateFallback: () => <p className="container" style={{ padding: "48px 16px" }} role="status">Loading…</p>,
    children: [
      { index: true, element: <Home /> },
      { path: "openings", lazy: async () => ({ Component: (await import("./pages/Openings")).default }) },
      { path: "opening/:courseId", lazy: async () => ({ Component: (await import("./pages/CoursePage")).default }) },
      { path: "dojo", lazy: async () => ({ Component: (await import("./pages/DojoPage")).default }) },
      { path: "progress", lazy: async () => ({ Component: (await import("./pages/ProgressPage")).default }) },
      { path: "create", lazy: async () => ({ Component: (await import("./pages/CreateCourse")).default }) },
      { path: "create/:courseId", lazy: async () => ({ Component: (await import("./pages/CreateCourse")).default }) },
      { path: "check", lazy: async () => ({ Component: (await import("./pages/CheckGames")).default }) },
      { path: "analysis", lazy: async () => ({ Component: (await import("./pages/Analysis")).default }) },
      { path: "about", lazy: async () => ({ Component: (await import("./pages/About")).default }) },
      { path: "*", lazy: async () => ({ Component: (await import("./pages/NotFound")).default }) },
    ],
  },
];

// BASE_PATH (e.g. /opening-gym/ on GitHub Pages project sites) becomes Vite's base URL; the router must match it.
const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });

export default function App() {
  return <RouterProvider router={router} />;
}
