// Shared helpers for the progress tests (not shipped: only imported from *.test.ts).
import { getCourse, lineNodes } from "../courses";
import type { Course, Grade, LineResult, Mode } from "../types";
import type { ProgressApi } from "./api";
import { createProgress, type ProgressOptions } from "./service";
import { memoryBackend, type KvBackend } from "./storage";

export const DAY = 86_400_000;
export const HOUR = 3_600_000;

export function course(id: string): Course {
  const c = getCourse(id);
  if (!c) throw new Error(`test course ${id} missing from courses.json`);
  return c;
}

export function makeClock(start: number) {
  let t = start;
  return {
    now: () => t,
    set(ms: number) {
      t = ms;
    },
    advance(ms: number) {
      t += ms;
    },
  };
}

/** Local noon on a calendar day: far from any midnight / DST edge. */
export const noon = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12, 0, 0).getTime();

export function setup(opts: ProgressOptions & { start?: number } = {}) {
  const clock = makeClock(opts.start ?? noon(2025, 6, 10));
  const backend = (opts.backend ?? memoryBackend()) as KvBackend & { data: Map<string, unknown> };
  const p: ProgressApi = createProgress({ fuzz: false, now: clock.now, ...opts, backend });
  return { p, clock, backend };
}

/** Build the LineResult the trainer would report for a flawless (or uniformly graded) run of a line. */
export function resultFor(
  c: Course,
  lineId: string,
  mode: Mode = "learn",
  grade: Grade | ((i: number) => Grade) = "good",
  completed = true,
): LineResult {
  const line = c.lines.find((l) => l.id === lineId);
  if (!line) throw new Error(`no line ${lineId} in ${c.id}`);
  const moves = lineNodes(c, line)
    .filter((n) => n.trained)
    .map((n, i) => ({ nodeId: n.id, grade: typeof grade === "function" ? grade(i) : grade, ms: 1500, usedHint: false }));
  const mistakes = moves.filter((m) => m.grade === "again").length;
  return { courseId: c.id, lineId, mode, moves, completed, mistakes };
}

export async function learnLines(p: ProgressApi, c: Course, n: number, grade: Grade = "good") {
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const id = await p.nextLearnLine(c);
    if (!id) break;
    await p.recordLine(c, resultFor(c, id, "learn", grade));
    ids.push(id);
  }
  return ids;
}

export const trainable = (c: Course) => c.lines.filter((l) => l.kind !== "warning");
