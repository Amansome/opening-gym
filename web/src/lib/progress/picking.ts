// Line selection for Practice / Drill / Time / Dojo. Pure and deterministic given the rng.

export interface Candidate {
  lineId: string;
  due: number; // ms, earliest due card
  strength: number; // 0..1
  lapses: number;
  order: number; // position in the course, final tie-breaker
}

/** Practice order: overdue first (most overdue first), then weakest, then most lapses, then course order. */
export function practiceOrder(cands: Candidate[], now: number): Candidate[] {
  const overdue = (c: Candidate) => c.due <= now;
  return cands.slice().sort((a, b) => {
    const ao = overdue(a);
    const bo = overdue(b);
    if (ao !== bo) return ao ? -1 : 1;
    if (ao && bo && a.due !== b.due) return a.due - b.due;
    return a.strength - b.strength || b.lapses - a.lapses || a.order - b.order;
  });
}

/** How much a line should be favoured in a random mix. Always > 0, so every line can show up. */
export function weight(c: Candidate, now: number): number {
  return 0.15 + (1 - c.strength) + (c.due <= now ? 0.75 : 0) + Math.min(c.lapses, 5) * 0.1;
}

/** Weighted random order without replacement (Efraimidis-Spirakis keys). */
export function weightedShuffle(cands: Candidate[], now: number, rng: () => number): Candidate[] {
  return cands
    .map((c) => ({ c, key: Math.pow(Math.max(rng(), 1e-12), 1 / weight(c, now)) }))
    .sort((a, b) => b.key - a.key || a.c.order - b.c.order)
    .map((x) => x.c);
}

/** If the list would start with the line the previous call ended on, put the runner-up first. */
export function avoidRepeat<T extends { lineId: string }>(list: T[], previousLast: string | undefined): T[] {
  if (previousLast === undefined || list.length < 2 || list[0].lineId !== previousLast) return list;
  return [list[1], list[0], ...list.slice(2)];
}
