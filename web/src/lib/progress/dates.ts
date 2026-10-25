// Local-calendar day helpers. A "day" is the user's local date, never UTC.

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" in the local time zone. */
export function localDayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Whole-day index of a "YYYY-MM-DD" key. Uses UTC arithmetic on the calendar fields, so DST (23h/25h days) cannot skew it. */
export function dayIndex(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function isDayKey(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
