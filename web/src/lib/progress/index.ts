// TEMPORARY in-memory stub so the app compiles while the progress agent builds the real module.
// Replace entirely; keep the exported name `progress` and the ProgressApi contract.
import type { ProgressApi } from "./api";
export * from "./api";

const listeners = new Set<() => void>();
const learned = new Map<string, Set<string>>();

export const progress: ProgressApi = {
  async getCourseProgress(course) {
    const l = learned.get(course.id) ?? new Set();
    const lines = course.lines.filter((x) => x.kind !== "warning");
    return {
      courseId: course.id, learnedCount: l.size, totalLines: lines.length, dueCount: 0,
      lines: lines.map((x) => ({ lineId: x.id, learned: l.has(x.id), due: Infinity, lapses: 0, strength: l.has(x.id) ? 1 : 0 })),
      unlocked: { learn: true, practice: l.size >= 1, drill: l.size >= 3, time: l.size >= 3, dojo: l.size >= 1 },
      bestDrillStreak: 0, bestTime: 0,
    };
  },
  async recordLine(course, r) {
    if (r.mode === "learn" && r.completed) { const s = learned.get(course.id) ?? new Set(); s.add(r.lineId); learned.set(course.id, s); }
    listeners.forEach((f) => f());
  },
  async pickLines(course, _mode, count) { return course.lines.filter((x) => x.kind !== "warning").slice(0, count).map((x) => x.id); },
  async nextLearnLine(course) { const l = learned.get(course.id) ?? new Set(); return course.lines.find((x) => !l.has(x.id))?.id; },
  async recordScore() {},
  async topScores() { return []; },
  async getStreak() { return { current: 0, best: 0, todayDone: false }; },
  async startedCourses() { return [...learned.keys()]; },
  async exportAll() { return "{}"; },
  async importAll() {},
  async resetCourse(id) { learned.delete(id); listeners.forEach((f) => f()); },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
