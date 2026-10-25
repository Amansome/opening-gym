import type { CheckReport, CheckSummary, DeviationGroup, GameCheck } from "./types";

function groupBy(checks: GameCheck[], kind: "user-deviation" | "opponent-left"): DeviationGroup[] {
  const map = new Map<string, DeviationGroup>();
  for (const c of checks) {
    if (c.kind !== kind || !c.positionKey || !c.played || !c.fen || !c.ply || !c.courseId) continue;
    const key = `${c.positionKey}|${c.played}`;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        courseId: c.courseId,
        courseTitle: c.courseTitle ?? c.courseId,
        fen: c.fen,
        color: c.color,
        ply: c.ply,
        played: c.played,
        playedLabel: c.moveLabel ?? c.played,
        expected: c.expected ?? [],
        expectedLabel: c.expectedLabel ?? "",
        expectedLines: c.expectedLines ?? [],
        note: c.note,
        knownMistake: !!c.knownMistake,
        engineFine: !!c.engineFine,
        count: 0,
        games: [],
      };
      map.set(key, g);
    }
    g.count++;
    g.games.push(c.game);
  }
  return [...map.values()];
}

/** Most valuable first: playable alternatives sink, then repeated, then earlier in the game. */
function mistakeOrder(a: DeviationGroup, b: DeviationGroup): number {
  if (a.engineFine !== b.engineFine) return a.engineFine ? 1 : -1;
  return b.count - a.count || a.ply - b.ply;
}

export function buildReport(checks: GameCheck[], skipped = 0): CheckReport {
  const mistakes = groupBy(checks, "user-deviation").sort(mistakeOrder);
  const surprises = groupBy(checks, "opponent-left").sort((a, b) => b.count - a.count || a.ply - b.ply);
  const followed = checks.filter((c) => c.kind === "followed").sort((a, b) => b.depth - a.depth);
  const uncovered = checks.filter((c) => c.kind === "uncovered" || c.kind === "no-course");
  const matched = checks.filter((c) => c.kind !== "uncovered" && c.kind !== "no-course");
  const summary: CheckSummary = {
    checked: checks.length,
    withCourse: matched.length,
    userDeviations: checks.filter((c) => c.kind === "user-deviation").length,
    opponentLeft: checks.filter((c) => c.kind === "opponent-left").length,
    followed: followed.length,
    uncovered: uncovered.length,
    avgBookPlies: matched.length ? matched.reduce((s, c) => s + c.depth, 0) / matched.length : 0,
    mostMissed: mistakes.find((m) => !m.engineFine),
  };
  return { summary, mistakes, surprises, followed, uncovered, skipped };
}
