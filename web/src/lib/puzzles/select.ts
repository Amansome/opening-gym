// Choosing a puzzle set and the next puzzle. Pure functions.
import type { Puzzle, PuzzleFilter, PuzzleRecord } from "./types";

export function filterPuzzles(all: Puzzle[], f: PuzzleFilter): Puzzle[] {
  const ids = f.courseIds ? new Set(f.courseIds) : null;
  return all.filter((p) => {
    if (ids && !p.sources.some((s) => ids.has(s.courseId))) return false;
    if (f.side && f.side !== "all" && p.turn !== f.side) return false;
    if (f.level && f.level !== "all" && p.level !== f.level) return false;
    return true;
  });
}

/** Lower weight is seen sooner: previously failed first, then never seen, then solved long ago. */
export function priority(r: PuzzleRecord | undefined): number {
  if (!r) return 1;
  if (r.last === "failed") return 0;
  return 2 + Math.min(r.solved, 5);
}

/**
 * Next puzzle: the lowest priority tier wins; inside a tier, random (rng injectable for tests).
 * Never repeats `excludeId` unless it is the only puzzle.
 */
export function pickNext(
  set: Puzzle[],
  records: Record<string, PuzzleRecord>,
  excludeId: string | null,
  rng: () => number = Math.random,
): Puzzle | null {
  if (set.length === 0) return null;
  const pool = set.length > 1 ? set.filter((p) => p.id !== excludeId) : set;
  let best = Infinity;
  for (const p of pool) best = Math.min(best, priority(records[p.id]));
  const tier = pool.filter((p) => priority(records[p.id]) === best);
  return tier[Math.min(tier.length - 1, Math.floor(rng() * tier.length))];
}

export interface SetCounts {
  total: number;
  solved: number;
  failed: number;
  fresh: number;
}

export function countSet(set: Puzzle[], records: Record<string, PuzzleRecord>): SetCounts {
  let solved = 0, failed = 0, fresh = 0;
  for (const p of set) {
    const r = records[p.id];
    if (!r) fresh++;
    else if (r.last === "failed") failed++;
    else solved++;
  }
  return { total: set.length, solved, failed, fresh };
}

/** Number of puzzles per course id (a puzzle that belongs to several courses counts for each). */
export function countByCourse(all: Puzzle[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of all) {
    const seen = new Set<string>();
    for (const s of p.sources) {
      if (seen.has(s.courseId)) continue;
      seen.add(s.courseId);
      out[s.courseId] = (out[s.courseId] ?? 0) + 1;
    }
  }
  return out;
}
