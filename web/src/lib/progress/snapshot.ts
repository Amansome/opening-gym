// Persisted-state helpers: sanitising/validation, schema migration, and assembling a Snapshot from stored records.
import type { ScoreEntry } from "./api";
import { isDayKey } from "./dates";
import { emptyCourseState, emptySnapshot, SCHEMA_VERSION, type CourseState, type ScoreBook, type Snapshot, type StoredCard, type StreakState } from "./model";
import { COURSE_SCORE_LIMIT, GLOBAL_SCORE_LIMIT } from "./scores";

/** Upgrade functions keyed by the version they upgrade FROM (v -> v+1). Add one when SCHEMA_VERSION is bumped. */
export type Migrations = Record<number, (data: Record<string, unknown>) => Record<string, unknown>>;
export const MIGRATIONS: Migrations = {
  // 1 -> 2: per-day activity history. Earlier versions did not record it, so it starts empty.
  1: (data) => ({ ...data, activity: {} }),
};

export class ProgressDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProgressDataError";
  }
}

/** Bring raw persisted/imported data up to `target`. Throws if it comes from a newer app version. */
export function migrate(raw: Record<string, unknown>, migrations: Migrations = MIGRATIONS, target = SCHEMA_VERSION): Record<string, unknown> {
  let version = raw.schemaVersion;
  if (typeof version !== "number" || !Number.isInteger(version) || version < 1) {
    throw new ProgressDataError("Missing or invalid schemaVersion");
  }
  if (version > target) throw new ProgressDataError(`Data was written by a newer version (schema ${version}); this app understands up to ${target}`);
  let data = raw;
  while (version < target) {
    const step = migrations[version];
    if (!step) throw new ProgressDataError(`No migration from schema ${version}`);
    data = { ...step(data), schemaVersion: version + 1 };
    version++;
  }
  return data;
}

// ---------- validation (strict: throws ProgressDataError) ----------

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const fail = (what: string): never => {
  throw new ProgressDataError(`Invalid progress data: ${what}`);
};
function num(v: unknown, what: string, min = -Infinity): number {
  if (typeof v !== "number" || !Number.isFinite(v) || v < min) fail(what);
  return v as number;
}
const count = (v: unknown, what: string) => Math.floor(num(v, what, 0));

function card(v: unknown, where: string): StoredCard {
  if (!isObj(v)) return fail(`${where} is not an object`);
  const out: StoredCard = {
    due: num(v.due, `${where}.due`),
    stability: num(v.stability, `${where}.stability`, 0),
    difficulty: num(v.difficulty, `${where}.difficulty`, 0),
    elapsed_days: num(v.elapsed_days ?? 0, `${where}.elapsed_days`),
    scheduled_days: num(v.scheduled_days ?? 0, `${where}.scheduled_days`, 0),
    learning_steps: num(v.learning_steps ?? 0, `${where}.learning_steps`, 0),
    reps: count(v.reps, `${where}.reps`),
    lapses: count(v.lapses, `${where}.lapses`),
    state: count(v.state, `${where}.state`),
  };
  if (out.state > 3) fail(`${where}.state`);
  if (v.last_review !== undefined && v.last_review !== null) out.last_review = num(v.last_review, `${where}.last_review`);
  return out;
}

export function validateCourseState(v: unknown, expectedId?: string): CourseState {
  if (!isObj(v)) return fail("course entry is not an object");
  const courseId = v.courseId;
  if (typeof courseId !== "string" || !courseId) return fail("course entry has no courseId");
  if (expectedId !== undefined && courseId !== expectedId) fail(`course key ${expectedId} does not match courseId ${courseId}`);
  const out = emptyCourseState(courseId as string);
  if (!isObj(v.learned) || !isObj(v.cards) || !isObj(v.lapses)) return fail(`course ${courseId} is missing learned/cards/lapses`);
  for (const [k, at] of Object.entries(v.learned)) out.learned[k] = num(at, `${courseId}.learned.${k}`);
  for (const [k, c] of Object.entries(v.cards)) out.cards[k] = card(c, `${courseId}.cards.${k}`);
  for (const [k, n] of Object.entries(v.lapses)) out.lapses[k] = count(n, `${courseId}.lapses.${k}`);
  out.lastPracticed = num(v.lastPracticed ?? 0, `${courseId}.lastPracticed`, 0);
  out.bestDrillStreak = count(v.bestDrillStreak ?? 0, `${courseId}.bestDrillStreak`);
  out.bestTime = count(v.bestTime ?? 0, `${courseId}.bestTime`);
  return out;
}

function validateStreak(v: unknown): StreakState {
  if (!isObj(v)) return fail("streak is not an object");
  const lastDay = v.lastDay === undefined || v.lastDay === null ? "" : v.lastDay;
  if (lastDay !== "" && !isDayKey(lastDay)) fail("streak.lastDay");
  const current = count(v.current, "streak.current");
  const best = Math.max(count(v.best, "streak.best"), current);
  return { current, best, lastDay: lastDay as string };
}

function validateActivity(v: unknown): Record<string, number> {
  if (v === undefined || v === null) return {};
  if (!isObj(v)) return fail("activity is not an object");
  const out: Record<string, number> = {};
  for (const [day, n] of Object.entries(v)) {
    if (!isDayKey(day)) fail(`activity key ${day}`);
    const c = count(n, `activity.${day}`);
    if (c > 0) out[day] = c;
  }
  return out;
}

function scoreList(v: unknown, mode: "drill" | "time", where: string, limit: number): ScoreEntry[] {
  if (!Array.isArray(v)) return fail(`${where} is not a list`);
  return v.slice(0, limit * 4).map((e, i) => {
    if (!isObj(e)) return fail(`${where}[${i}]`);
    if (typeof e.courseId !== "string" || !e.courseId) fail(`${where}[${i}].courseId`);
    if (e.mode !== mode) fail(`${where}[${i}].mode`);
    return { mode, courseId: e.courseId as string, value: num(e.value, `${where}[${i}].value`, 0), at: num(e.at, `${where}[${i}].at`, 0) };
  });
}

function validateScores(v: unknown): ScoreBook {
  if (!isObj(v) || !isObj(v.global) || !isObj(v.byCourse)) return fail("scores");
  const book: ScoreBook = {
    global: {
      drill: scoreList(v.global.drill, "drill", "scores.global.drill", GLOBAL_SCORE_LIMIT),
      time: scoreList(v.global.time, "time", "scores.global.time", GLOBAL_SCORE_LIMIT),
    },
    byCourse: {},
  };
  for (const [key, list] of Object.entries(v.byCourse)) {
    const m = /^(drill|time):(.+)$/.exec(key);
    if (!m) return fail(`scores.byCourse key ${key}`);
    const entries = scoreList(list, m![1] as "drill" | "time", `scores.byCourse.${key}`, COURSE_SCORE_LIMIT);
    if (entries.some((e) => e.courseId !== m![2])) fail(`scores.byCourse.${key} holds another course's score`);
    book.byCourse[key] = entries;
  }
  return book;
}

/** Strictly validate (and migrate) a whole backup/snapshot object. Unknown fields are dropped. */
export function validateSnapshot(raw: unknown): Snapshot {
  if (!isObj(raw)) return fail("not an object");
  const data = migrate(raw);
  if (!isObj(data.courses)) return fail("courses");
  const snap = emptySnapshot();
  snap.streak = validateStreak(data.streak);
  snap.scores = validateScores(data.scores);
  snap.activity = validateActivity(data.activity);
  for (const [id, c] of Object.entries(data.courses)) snap.courses[id] = validateCourseState(c, id);
  return snap;
}

// ---------- assembling from persisted records (lenient: corrupt records are skipped) ----------

export const META_KEY = "meta";
export const courseStorageKey = (courseId: string) => `course:${courseId}`;

export interface LoadResult {
  snapshot: Snapshot;
  /** true if migrations ran or records were dropped, so the caller should rewrite storage */
  dirty: boolean;
}

export function snapshotFromRecords(records: Record<string, unknown>): LoadResult {
  const snap = emptySnapshot();
  let dirty = false;
  const hasCourses = Object.keys(records).some((k) => k.startsWith("course:"));
  // Course records without a meta record (partial write / manual tampering): keep the courses, default the rest.
  const metaRaw = records[META_KEY] ?? (hasCourses ? metaRecord(emptySnapshot()) : undefined);
  if (metaRaw !== undefined) {
    try {
      if (!isObj(metaRaw)) throw new ProgressDataError("meta is not an object");
      const stored = typeof metaRaw.schemaVersion === "number" ? metaRaw.schemaVersion : 0;
      // Course records share the meta version; migrate them together as one document.
      const doc: Record<string, unknown> = { ...metaRaw, courses: {} };
      const courseDocs: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(records)) if (k.startsWith("course:")) courseDocs[k.slice(7)] = v;
      doc.courses = courseDocs;
      const migrated = migrate(doc);
      if (stored !== SCHEMA_VERSION) dirty = true;
      snap.streak = validateStreak(migrated.streak);
      snap.scores = validateScores(migrated.scores);
      snap.activity = validateActivity(migrated.activity);
      for (const [id, c] of Object.entries(migrated.courses as Record<string, unknown>)) {
        try {
          snap.courses[id] = validateCourseState(c, id);
        } catch (err) {
          console.warn(`[opening-gym] dropping unreadable progress for course ${id}`, err);
          dirty = true;
        }
      }
    } catch (err) {
      if (err instanceof ProgressDataError && /newer version/.test(err.message)) throw err;
      console.warn("[opening-gym] progress metadata unreadable, starting fresh", err);
      return { snapshot: emptySnapshot(), dirty: true };
    }
  }
  return { snapshot: snap, dirty };
}

export function metaRecord(snap: Snapshot): { schemaVersion: number; streak: StreakState; scores: ScoreBook; activity: Record<string, number> } {
  return { schemaVersion: SCHEMA_VERSION, streak: snap.streak, scores: snap.scores, activity: snap.activity };
}
