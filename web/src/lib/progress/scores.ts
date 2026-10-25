import type { ScoreEntry } from "./api";
import type { ScoreBook } from "./model";

export const COURSE_SCORE_LIMIT = 20;
export const GLOBAL_SCORE_LIMIT = 50;

const byValueThenAge = (a: ScoreEntry, b: ScoreEntry) => b.value - a.value || a.at - b.at;

function insertTop(list: ScoreEntry[], entry: ScoreEntry, limit: number): ScoreEntry[] {
  return [...list, entry].sort(byValueThenAge).slice(0, limit);
}

export const courseKey = (mode: "drill" | "time", courseId: string) => `${mode}:${courseId}`;

export function addScore(book: ScoreBook, entry: ScoreEntry): ScoreBook {
  const key = courseKey(entry.mode, entry.courseId);
  return {
    global: { ...book.global, [entry.mode]: insertTop(book.global[entry.mode], entry, GLOBAL_SCORE_LIMIT) },
    byCourse: { ...book.byCourse, [key]: insertTop(book.byCourse[key] ?? [], entry, COURSE_SCORE_LIMIT) },
  };
}

export function listScores(book: ScoreBook, mode: "drill" | "time", courseId: string | undefined, limit: number): ScoreEntry[] {
  const list = courseId ? (book.byCourse[courseKey(mode, courseId)] ?? []) : book.global[mode];
  return list.slice().sort(byValueThenAge).slice(0, Math.max(0, limit));
}

export function removeCourseScores(book: ScoreBook, courseId: string): ScoreBook {
  const byCourse = { ...book.byCourse };
  delete byCourse[courseKey("drill", courseId)];
  delete byCourse[courseKey("time", courseId)];
  return {
    global: {
      drill: book.global.drill.filter((s) => s.courseId !== courseId),
      time: book.global.time.filter((s) => s.courseId !== courseId),
    },
    byCourse,
  };
}
