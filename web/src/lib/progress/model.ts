// Persisted data model for the progress module. Plain JSON only (no Date, no Infinity).
import type { ScoreEntry } from "./api";

export const SCHEMA_VERSION = 1;

/** One FSRS card (one trained move node), flattened to JSON-safe numbers. */
export interface StoredCard {
  due: number; // ms
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number; // FSRS lapses (Review -> Relearning transitions)
  state: number; // ts-fsrs State enum
  last_review?: number; // ms
}

/** All progress for one course. Card ids are `${courseId}::${nodeId}`; here they are keyed by nodeId. */
export interface CourseState {
  courseId: string;
  /** lineId -> ms timestamp of the Learn completion */
  learned: Record<string, number>;
  cards: Record<string, StoredCard>;
  /** lineId -> total wrong answers ever */
  lapses: Record<string, number>;
  lastPracticed: number; // ms, 0 = never
  bestDrillStreak: number;
  bestTime: number;
}

export interface StreakState {
  current: number;
  best: number;
  /** local calendar day ("YYYY-MM-DD") of the last completed line, "" when never */
  lastDay: string;
}

export interface ScoreBook {
  /** best scores over every course, per mode */
  global: { drill: ScoreEntry[]; time: ScoreEntry[] };
  /** key: `${mode}:${courseId}` */
  byCourse: Record<string, ScoreEntry[]>;
}

/** The whole persisted state. */
export interface Snapshot {
  schemaVersion: number;
  streak: StreakState;
  scores: ScoreBook;
  courses: Record<string, CourseState>;
}

export function emptyCourseState(courseId: string): CourseState {
  return { courseId, learned: {}, cards: {}, lapses: {}, lastPracticed: 0, bestDrillStreak: 0, bestTime: 0 };
}

export function emptySnapshot(): Snapshot {
  return {
    schemaVersion: SCHEMA_VERSION,
    streak: { current: 0, best: 0, lastDay: "" },
    scores: { global: { drill: [], time: [] }, byCourse: {} },
    courses: {},
  };
}

/** Shape of a JSON backup file. */
export interface BackupFile extends Snapshot {
  app: "opening-gym";
  exportedAt: number;
}
