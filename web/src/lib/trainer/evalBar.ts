// Pure helpers for the eval bar. Evals are centipawns from White's view; mates are +-(100000 - plies to mate).
export const MATE_CP = 100000;
/** The standard starting position is worth about +0.2 for White. */
export const START_EVAL_CP = 20;

export function isMateEval(cp: number): boolean {
  return Math.abs(cp) >= MATE_CP - 1000;
}

/** Moves until mate for a mate eval (3 for "mate in 3"). */
export function mateMoves(cp: number): number {
  return Math.ceil((MATE_CP - Math.abs(cp)) / 2);
}

/** Share of the bar that belongs to White, 0..1 (lichess-style logistic curve; mates fill the bar). */
export function evalShare(cp: number): number {
  if (isMateEval(cp)) return cp > 0 ? 1 : 0;
  const win = 2 / (1 + Math.exp(-0.00368208 * cp)) - 1; // -1..1
  return Math.min(1, Math.max(0, 0.5 + win / 2));
}

/** Label shown on the bar: "+0.4", "-1.3", "0.0", "M3", "-M2". */
export function formatEval(cp: number): string {
  if (isMateEval(cp)) return `${cp < 0 ? "-" : ""}M${mateMoves(cp)}`;
  const pawns = Math.round(Math.abs(cp) / 10) / 10;
  if (pawns === 0) return "0.0";
  return `${cp > 0 ? "+" : "-"}${pawns.toFixed(1)}`;
}

/** Plain-language reading for the aria-label. */
export function describeEval(cp: number): string {
  if (isMateEval(cp)) return `${cp > 0 ? "White" : "Black"} is winning, mate in ${mateMoves(cp)}`;
  const a = Math.abs(cp);
  if (a < 25) return "Equal position";
  const who = cp > 0 ? "White" : "Black";
  if (a < 100) return `${who} is slightly better`;
  if (a < 250) return `${who} is better`;
  return `${who} is winning`;
}
