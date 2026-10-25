// Public API of the progress module (spaced repetition, streaks, unlocks, scores).
// Implemented in ./index.ts by the progress agent. Pages and the Trainer import ONLY from "lib/progress".
import type { Course, LineResult, Mode } from "../types";

export interface LineStats {
  lineId: string;
  learned: boolean; // completed once in Learn mode
  due: number; // ms timestamp of the earliest-due card in this line (Infinity if not learned)
  lapses: number; // total wrong answers ever
  strength: number; // 0..1, mean FSRS retrievability of this line's cards right now
}

export interface CourseProgress {
  courseId: string;
  learnedCount: number;
  totalLines: number; // trainable lines
  dueCount: number; // learned lines with a card due now
  lines: LineStats[];
  unlocked: Record<Mode, boolean>;
  /** What unlocks the next locked mode, e.g. "Learn 2 more lines". Undefined when all are unlocked. */
  nextUnlockHint?: string;
  bestDrillStreak: number;
  bestTime: number; // most lines in one 60s Time run
}

export interface StreakInfo {
  current: number; // consecutive days with ≥1 completed line
  best: number;
  todayDone: boolean;
}

export interface ScoreEntry {
  mode: "drill" | "time";
  courseId: string;
  value: number;
  at: number;
}

export interface ProgressApi {
  getCourseProgress(course: Course): Promise<CourseProgress>;
  /** Persist a finished line: grades every card with FSRS, marks Learn completion, bumps the daily streak. */
  recordLine(course: Course, result: LineResult): Promise<void>;
  /** Line ids to train next in Practice/Dojo: due-first, then weakest. */
  pickLines(course: Course, mode: Mode, count: number): Promise<string[]>;
  /** Next unlearned line for Learn mode (respects line order; undefined when all learned). */
  nextLearnLine(course: Course): Promise<string | undefined>;
  recordScore(entry: Omit<ScoreEntry, "at">): Promise<void>;
  topScores(mode: "drill" | "time", courseId?: string, limit?: number): Promise<ScoreEntry[]>;
  getStreak(): Promise<StreakInfo>;
  /** Lines completed per local calendar day ("YYYY-MM-DD" -> count), for the activity heatmap. Days with no activity are absent. */
  getActivity(): Promise<Record<string, number>>;
  /** Course ids the user has started, for Dojo and the home page. */
  startedCourses(): Promise<string[]>;
  exportAll(): Promise<string>; // JSON backup
  importAll(json: string): Promise<void>;
  resetCourse(courseId: string): Promise<void>;
  /** Fires after any write so React hooks can refresh. Returns an unsubscribe fn. */
  subscribe(fn: () => void): () => void;
}
