import { useCallback, useEffect, useRef, useState } from "react";
import { progress } from "../../lib/progress";
import type { CourseProgress, StreakInfo } from "../../lib/progress";
import type { Course } from "../../lib/types";

const NO_STREAK: StreakInfo = { current: 0, best: 0, todayDone: false };

/** Course progress (tile counters, unlocks), refreshed after any progress write. */
export function useCourseProgress(course: Course): { cp: CourseProgress | null; refresh: () => Promise<CourseProgress | null> } {
  const [cp, setCp] = useState<CourseProgress | null>(null);
  const alive = useRef(true);
  const refresh = useCallback(async () => {
    try {
      const next = await progress.getCourseProgress(course);
      if (alive.current) setCp(next);
      return next;
    } catch {
      return null;
    }
  }, [course]);
  useEffect(() => {
    alive.current = true;
    void refresh();
    const off = progress.subscribe(() => void refresh());
    return () => {
      alive.current = false;
      off();
    };
  }, [refresh]);
  return { cp, refresh };
}

/** Daily streak info, refreshed after any progress write. */
export function useStreak(): { streak: StreakInfo; refresh: () => Promise<StreakInfo> } {
  const [streak, setStreak] = useState<StreakInfo>(NO_STREAK);
  const alive = useRef(true);
  const refresh = useCallback(async () => {
    try {
      const next = await progress.getStreak();
      if (alive.current) setStreak(next);
      return next;
    } catch {
      return NO_STREAK;
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    void refresh();
    const off = progress.subscribe(() => void refresh());
    return () => {
      alive.current = false;
      off();
    };
  }, [refresh]);
  return { streak, refresh };
}

/**
 * Graduate's zero is a plain oval that reads as an icon next to the other numerals, so a value that starts with 0
 * ("0", "0/8", "0.4") is set in the display face instead (CSS keys on data-zero).
 */
export function isZero(value: string | number | undefined | null): boolean {
  return /^0/.test(String(value ?? "").trim());
}

export function streakMessage(days: number): string {
  if (days <= 1) return "It begins";
  if (days < 7) return "Keep it going";
  if (days < 30) return "On a roll";
  return "Unstoppable";
}

export function gradeSummary(moves: { grade: string }[]): { good: number; hard: number; again: number } {
  let good = 0;
  let hard = 0;
  let again = 0;
  for (const m of moves) {
    if (m.grade === "again") again++;
    else if (m.grade === "hard") hard++;
    else good++;
  }
  return { good, hard, again };
}

const EVAL_BAR_KEY = "og:evalbar";

/** Whether the eval bar is shown. Remembered per browser; the app works without storage. */
export function useEvalBarPref(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(EVAL_BAR_KEY) !== "off";
    } catch {
      return true;
    }
  });
  const set = useCallback((next: boolean) => {
    setOn(next);
    try {
      window.localStorage.setItem(EVAL_BAR_KEY, next ? "on" : "off");
    } catch {
      /* storage blocked: the preference lasts for this visit only */
    }
  }, []);
  return [on, set];
}
