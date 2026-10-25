// The ProgressApi implementation. In-memory snapshot + write-through to a KvBackend.
// All operations are serialised through one promise queue, so concurrent calls never interleave.
import { getLine, lineNodes, trainableLines, userColor } from "../courses";
import type { Course, Grade, Line, LineResult, Mode } from "../types";
import type { CourseProgress, LineStats, ProgressApi, ScoreEntry, StreakInfo } from "./api";
import { emptyCourseState, emptySnapshot, type BackupFile, type CourseState, type Snapshot } from "./model";
import { avoidRepeat, practiceOrder, weightedShuffle, type Candidate } from "./picking";
import { createScheduler, type Scheduler } from "./scheduler";
import { addScore, listScores, removeCourseScores } from "./scores";
import { courseStorageKey, META_KEY, metaRecord, ProgressDataError, snapshotFromRecords, validateSnapshot } from "./snapshot";
import { memoryBackend, type KvBackend } from "./storage";
import { bumpActivity } from "./activity";
import { bumpStreak, streakInfo } from "./streak";
import { computeUnlocks } from "./unlocks";

export interface ProgressOptions {
  backend?: KvBackend;
  /** Clock, ms since epoch. Inject in tests to simulate days. */
  now?: () => number;
  /** Random source in [0,1). Inject in tests for deterministic Drill/Time mixes. */
  random?: () => number;
  /** FSRS interval fuzzing (default true; tests turn it off). */
  fuzz?: boolean;
  scheduler?: Scheduler;
}

const GRADE_ORDER: Grade[] = ["again", "hard", "good", "easy"];
const DEFAULT_TOP = 20;

const trainedIdsCache = new WeakMap<Line, string[]>();
/** nodeIds of the moves the user must find in this line, in order. */
function trainedNodeIds(course: Course, line: Line): string[] {
  let ids = trainedIdsCache.get(line);
  if (!ids) {
    try {
      // In "both"-side courses every node is flagged trained; the user only plays one colour per line.
      const parity = userColor(course, line) === "white" ? 1 : 0;
      ids = lineNodes(course, line)
        .filter((n) => n.trained && (course.side !== "both" || n.ply % 2 === parity))
        .map((n) => n.id);
    } catch {
      ids = [];
    }
    trainedIdsCache.set(line, ids);
  }
  return ids;
}

export function createProgress(opts: ProgressOptions = {}): ProgressApi {
  const backend = opts.backend ?? memoryBackend();
  const clock = opts.now ?? (() => Date.now());
  const random = opts.random ?? Math.random;
  const scheduler = opts.scheduler ?? createScheduler({ fuzz: opts.fuzz });

  let snap: Snapshot = emptySnapshot();
  let persistEnabled = true;
  const listeners = new Set<() => void>();
  const lastPicked = new Map<string, string>(); // courseId -> last line id handed out

  const ready = (async () => {
    try {
      const records = await backend.loadAll();
      const { snapshot, dirty } = snapshotFromRecords(records);
      snap = snapshot;
      if (dirty) await persistAll(new Set(Object.keys(records)));
    } catch (err) {
      // Unreadable or newer-than-us data: run empty and never overwrite what is on disk.
      console.error("[opening-gym] could not load progress; running without persistence", err);
      persistEnabled = false;
    }
  })();

  let queue: Promise<unknown> = Promise.resolve();
  function serial<T>(fn: () => T | Promise<T>): Promise<T> {
    const run = queue.then(() => ready).then(fn);
    queue = run.catch(() => undefined);
    return run;
  }

  async function persist(put: string[], remove: string[] = []): Promise<void> {
    if (!persistEnabled) return;
    try {
      for (const key of put) {
        if (key === META_KEY) await backend.set(META_KEY, metaRecord(snap));
        else await backend.set(key, snap.courses[key.slice("course:".length)]);
      }
      for (const key of remove) await backend.del(key);
    } catch (err) {
      console.warn("[opening-gym] failed to persist progress", err);
    }
  }

  async function persistAll(existingKeys: Set<string>): Promise<void> {
    const put = [META_KEY, ...Object.keys(snap.courses).map(courseStorageKey)];
    const remove = [...existingKeys].filter((k) => k !== META_KEY && !put.includes(k));
    await persist(put, remove);
  }

  function notify() {
    for (const fn of [...listeners]) {
      try {
        fn();
      } catch (err) {
        console.error(err);
      }
    }
  }

  const courseState = (courseId: string): CourseState => snap.courses[courseId] ?? emptyCourseState(courseId);

  function lineStats(course: Course, cs: CourseState, line: Line, now: number): LineStats {
    const lapses = cs.lapses[line.id] ?? 0;
    const learnedAt = cs.learned[line.id];
    if (learnedAt === undefined) return { lineId: line.id, learned: false, due: Infinity, lapses, strength: 0 };
    const ids = trainedNodeIds(course, line);
    if (ids.length === 0) return { lineId: line.id, learned: true, due: learnedAt, lapses, strength: 1 };
    let due = Infinity;
    let sum = 0;
    let missing = false;
    for (const id of ids) {
      const card = cs.cards[id];
      if (!card) {
        missing = true;
        continue;
      }
      due = Math.min(due, card.due);
      sum += scheduler.retrievability(card, now);
    }
    if (missing) due = Math.min(due, learnedAt); // a move with no card yet counts as due
    return { lineId: line.id, learned: true, due, lapses, strength: sum / ids.length };
  }

  const learnedTotal = (excludeCourseId?: string) =>
    Object.values(snap.courses).reduce((n, c) => (c.courseId === excludeCourseId ? n : n + Object.keys(c.learned).length), 0);

  const api: ProgressApi = {
    getCourseProgress: (course) =>
      serial(() => {
        const now = clock();
        const cs = courseState(course.id);
        const lines = trainableLines(course).map((l) => lineStats(course, cs, l, now));
        const learnedCount = lines.filter((l) => l.learned).length;
        const { unlocked, hint } = computeUnlocks(learnedCount, lines.length, learnedCount + learnedTotal(course.id));
        const result: CourseProgress = {
          courseId: course.id,
          learnedCount,
          totalLines: lines.length,
          dueCount: lines.filter((l) => l.learned && l.due <= now).length,
          lines,
          unlocked,
          bestDrillStreak: cs.bestDrillStreak,
          bestTime: cs.bestTime,
        };
        if (hint) result.nextUnlockHint = hint;
        return result;
      }),

    recordLine: (course, result: LineResult) =>
      serial(async () => {
        const line = getLine(course, result.lineId);
        if (!line) return;
        if (result.mode === "learn" && !result.completed) return; // abandoned Learn run: nothing is learned yet
        const now = clock();
        const cs = (snap.courses[course.id] ??= emptyCourseState(course.id));
        const valid = new Set(trainedNodeIds(course, line));

        if (line.kind !== "warning") {
          // One review per node per result; if a node was reported twice, the worst grade wins.
          const grades = new Map<string, Grade>();
          for (const m of result.moves) {
            if (!valid.has(m.nodeId)) continue;
            const prev = grades.get(m.nodeId);
            if (!prev || GRADE_ORDER.indexOf(m.grade) < GRADE_ORDER.indexOf(prev)) grades.set(m.nodeId, m.grade);
          }
          for (const [nodeId, grade] of grades) cs.cards[nodeId] = scheduler.review(cs.cards[nodeId], grade, now);
          const wrong = result.moves.filter((m) => m.grade === "again").length;
          const lapses = Math.max(wrong, Math.floor(result.mistakes) || 0);
          if (lapses > 0) cs.lapses[line.id] = (cs.lapses[line.id] ?? 0) + lapses;
        }
        if (result.mode === "learn" && result.completed) cs.learned[line.id] = now;
        cs.lastPracticed = now;

        const put = [courseStorageKey(course.id)];
        if (result.completed) {
          const next = bumpStreak(snap.streak, now);
          if (next !== snap.streak) snap.streak = next;
          snap.activity = bumpActivity(snap.activity, now);
          put.push(META_KEY);
        }
        await persist(put);
        notify();
      }),

    pickLines: (course, mode: Mode, count) =>
      serial(() => {
        const now = clock();
        const cs = courseState(course.id);
        const cands: Candidate[] = [];
        trainableLines(course).forEach((line, order) => {
          const s = lineStats(course, cs, line, now);
          if (s.learned) cands.push({ lineId: line.id, due: s.due, strength: s.strength, lapses: s.lapses, order });
        });
        if (cands.length === 0 || count <= 0) return [];
        const ordered = mode === "drill" || mode === "time" ? weightedShuffle(cands, now, random) : practiceOrder(cands, now);
        const list = avoidRepeat(ordered, lastPicked.get(course.id)).slice(0, Math.floor(count));
        lastPicked.set(course.id, list[list.length - 1].lineId);
        return list.map((c) => c.lineId);
      }),

    nextLearnLine: (course) =>
      serial(() => {
        const cs = courseState(course.id);
        const todo = (kinds: (l: Line) => boolean) => course.lines.find((l) => kinds(l) && cs.learned[l.id] === undefined)?.id;
        return todo((l) => l.kind !== "warning") ?? todo((l) => l.kind === "warning");
      }),

    recordScore: (entry) =>
      serial(async () => {
        if (!Number.isFinite(entry.value) || entry.value < 0 || !entry.courseId) return;
        const full: ScoreEntry = { ...entry, at: clock() };
        snap.scores = addScore(snap.scores, full);
        const cs = (snap.courses[entry.courseId] ??= emptyCourseState(entry.courseId));
        if (entry.mode === "drill") cs.bestDrillStreak = Math.max(cs.bestDrillStreak, Math.floor(entry.value));
        else cs.bestTime = Math.max(cs.bestTime, Math.floor(entry.value));
        await persist([META_KEY, courseStorageKey(entry.courseId)]);
        notify();
      }),

    topScores: (mode, courseId, limit = DEFAULT_TOP) => serial(() => listScores(snap.scores, mode, courseId, limit)),

    getStreak: () => serial((): StreakInfo => streakInfo(snap.streak, clock())),

    getActivity: () => serial(() => ({ ...snap.activity })),

    startedCourses: () =>
      serial(() =>
        Object.values(snap.courses)
          .filter((c) => Object.keys(c.learned).length > 0)
          .sort((a, b) => b.lastPracticed - a.lastPracticed || a.courseId.localeCompare(b.courseId))
          .map((c) => c.courseId),
      ),

    exportAll: () =>
      serial(() => {
        const file: BackupFile = { app: "opening-gym", exportedAt: clock(), ...snap };
        return JSON.stringify(file);
      }),

    importAll: (json) =>
      serial(async () => {
        let raw: unknown;
        try {
          raw = JSON.parse(json);
        } catch {
          throw new ProgressDataError("The file is not valid JSON");
        }
        if (typeof raw === "object" && raw !== null && "app" in raw && (raw as { app: unknown }).app !== "opening-gym") {
          throw new ProgressDataError("This is not an Opening Gym backup");
        }
        const next = validateSnapshot(raw); // throws before anything is touched
        const oldKeys = new Set(Object.keys(snap.courses).map(courseStorageKey));
        snap = next;
        // An explicit restore is deliberate: it also lifts the "do not overwrite unreadable/newer data" guard.
        persistEnabled = true;
        lastPicked.clear();
        await persistAll(oldKeys);
        notify();
      }),

    resetCourse: (courseId) =>
      serial(async () => {
        delete snap.courses[courseId];
        snap.scores = removeCourseScores(snap.scores, courseId);
        lastPicked.delete(courseId);
        await persist([META_KEY], [courseStorageKey(courseId)]);
        notify();
      }),

    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
  };
  return api;
}
