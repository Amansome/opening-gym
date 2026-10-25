// Per-day activity history (lines completed per local calendar day), used by the progress heatmap.
import { dayIndex, localDayKey } from "./dates";

/** Keep roughly a year of days: plenty for any heatmap, and the record stays small. */
export const ACTIVITY_KEEP_DAYS = 400;

/** Returns a new map with one more completed line counted on the local day of `now`; very old days are dropped. */
export function bumpActivity(activity: Record<string, number>, now: number): Record<string, number> {
  const today = localDayKey(now);
  const cutoff = dayIndex(today) - ACTIVITY_KEEP_DAYS;
  const out: Record<string, number> = {};
  for (const [day, n] of Object.entries(activity)) if (dayIndex(day) >= cutoff) out[day] = n;
  out[today] = (out[today] ?? 0) + 1;
  return out;
}
