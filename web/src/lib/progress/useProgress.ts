// React bindings. Both hooks refetch whenever the progress module reports a write
// (and when the tab becomes visible again, so a streak rolls over at midnight).
import { useCallback, useEffect, useState } from "react";
import type { Course } from "../types";
import { progress, type CourseProgress, type ProgressApi, type StreakInfo } from "./index";

/** `key` names what is being loaded, so a stale value for another key is never returned. */
function useRefreshing<T>(load: () => Promise<T>, api: ProgressApi, key: string | undefined): T | undefined {
  const [state, setState] = useState<{ key: string | undefined; value: T }>();
  useEffect(() => {
    if (key === undefined) return;
    let alive = true;
    const refresh = () => {
      load().then(
        (value) => {
          if (alive) setState({ key, value });
        },
        (err) => console.error("[opening-gym] progress refresh failed", err),
      );
    };
    refresh();
    const unsubscribe = api.subscribe(refresh);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [api, load, key]);
  return state && state.key === key ? state.value : undefined;
}

/** Progress for one course; undefined until the first load completes (or when `course` is undefined). */
export function useCourseProgress(course: Course | undefined, api: ProgressApi = progress): CourseProgress | undefined {
  const load = useCallback(() => api.getCourseProgress(course as Course), [api, course]);
  return useRefreshing(load, api, course?.id);
}

/** Daily streak; undefined until the first load completes. */
export function useStreak(api: ProgressApi = progress): StreakInfo | undefined {
  const load = useCallback(() => api.getStreak(), [api]);
  return useRefreshing(load, api, "streak");
}
