// Small helpers for choosing lines.

export type Rng = () => number;

/** Pick a random element, avoiding `avoid` when there is more than one choice. */
export function pickRandom<T>(items: readonly T[], avoid?: (item: T) => boolean, rng: Rng = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  const pool = avoid && items.length > 1 ? items.filter((i) => !avoid(i)) : items;
  const from = pool.length > 0 ? pool : items;
  return from[Math.min(from.length - 1, Math.floor(rng() * from.length))];
}

/** Round-robin interleave: [[a1,a2],[b1],[c1,c2]] -> [a1,b1,c1,a2,c2]. */
export function interleave<T>(lists: readonly (readonly T[])[]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) {
    for (const l of lists) if (i < l.length) out.push(l[i]);
  }
  return out;
}
