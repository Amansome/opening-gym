import { useCallback, useEffect, useState } from "react";
import { progress } from "../../lib/progress";
import type { CourseProgress, StreakInfo } from "../../lib/progress";
import type { Course } from "../../lib/types";
import { APP_NAME, STORAGE_THEME_KEY } from "../../config";

/** Re-runs `load` on mount and after every progress write. */
function useProgressValue<T>(load: () => Promise<T>, deps: unknown[]): T | undefined {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    let alive = true;
    const run = () => {
      load().then(
        (v) => alive && setValue(v),
        () => {},
      );
    };
    run();
    const off = progress.subscribe(run);
    return () => {
      alive = false;
      off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}

export function useStreak(): StreakInfo | undefined {
  return useProgressValue(() => progress.getStreak(), []);
}

export function useStartedCourses(): string[] | undefined {
  return useProgressValue(() => progress.startedCourses(), []);
}

/** Progress for many courses at once, keyed by course id. */
export function useCourseProgressMap(courses: Course[]): Record<string, CourseProgress> {
  const key = courses.map((c) => c.id).join("|");
  const value = useProgressValue(async () => {
    const entries = await Promise.all(courses.map(async (c) => [c.id, await progress.getCourseProgress(c)] as const));
    return Object.fromEntries(entries) as Record<string, CourseProgress>;
  }, [key]);
  return value ?? {};
}

export function useCourseProgress(course: Course | undefined): CourseProgress | undefined {
  return useProgressValue(
    async () => (course ? progress.getCourseProgress(course) : undefined),
    [course?.id],
  );
}

/** Sets <title>, <meta name=description> and optional JSON-LD for the current page. */
export function useDocumentMeta(opts: { title?: string; description?: string; jsonLd?: object | null }) {
  const { title, description, jsonLd } = opts;
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME}: free chess opening trainer`;
  }, [title]);
  useEffect(() => {
    if (!description) return;
    let el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.name = "description";
      document.head.appendChild(el);
    }
    el.content = description;
  }, [description]);
  useEffect(() => {
    if (!ld) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.og = "jsonld";
    script.text = ld;
    document.head.appendChild(script);
    return () => script.remove();
  }, [ld]);
}

export type Theme = "dark" | "light";

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_THEME_KEY, next);
      } catch {
        /* storage may be unavailable (private mode) */
      }
      return next;
    });
  }, []);
  return [theme, toggle];
}
