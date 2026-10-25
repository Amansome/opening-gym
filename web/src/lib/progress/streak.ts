// Daily streak logic. Pure: takes the stored state and a timestamp (ms).
import type { StreakInfo } from "./api";
import { dayIndex, localDayKey } from "./dates";
import type { StreakState } from "./model";

/** What the UI shows at time `now`. A streak whose last day is before yesterday has lapsed (shows 0). */
export function streakInfo(s: StreakState, now: number): StreakInfo {
  const today = localDayKey(now);
  if (!s.lastDay) return { current: 0, best: s.best, todayDone: false };
  const gap = dayIndex(today) - dayIndex(s.lastDay);
  if (gap === 0) return { current: s.current, best: s.best, todayDone: true };
  // gap < 0: the clock moved backwards; keep what we have rather than punishing the user.
  if (gap < 0 || gap === 1) return { current: s.current, best: s.best, todayDone: false };
  return { current: 0, best: s.best, todayDone: false };
}

/** Returns the new state after a line was completed at `now`. */
export function bumpStreak(s: StreakState, now: number): StreakState {
  const today = localDayKey(now);
  if (!s.lastDay) return { current: 1, best: Math.max(s.best, 1), lastDay: today };
  const gap = dayIndex(today) - dayIndex(s.lastDay);
  if (gap === 0) return s;
  if (gap < 0) return s; // clock went backwards: ignore, do not double count
  const current = gap === 1 ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastDay: today };
}
