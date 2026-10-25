// UCI output parsing and score helpers. Pure functions: no Worker, no DOM.
//
// Stockfish reports every score from the point of view of the side to move. The UI wants one fixed
// point of view (White), so `parseInfo` takes the side to move and normalises.

export type Turn = "w" | "b";

/** Score from White's point of view. Exactly one of `cp` / `mate` is set. */
export interface Score {
  /** centipawns, positive = good for White */
  cp: number | null;
  /** moves to mate; positive = White mates, negative = Black mates, 0 = already checkmated is reported via `matedSide` */
  mate: number | null;
}

export interface EngineLine {
  /** 1-based rank of this line (MultiPV index) */
  multipv: number;
  depth: number;
  seldepth?: number;
  score: Score;
  /** Set when Stockfish says the score is only a bound (during aspiration-window re-searches), White's view. */
  bound?: "lower" | "upper";
  /** Principal variation in UCI notation (e2e4, e7e8q, e1g1 for castling). */
  pv: string[];
  nodes?: number;
  nps?: number;
  time?: number;
}

function num(tokens: string[], key: string): number | undefined {
  const i = tokens.indexOf(key);
  if (i < 0 || i + 1 >= tokens.length) return undefined;
  const v = Number(tokens[i + 1]);
  return Number.isFinite(v) ? v : undefined;
}

const UCI_MOVE = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

/**
 * Parse one `info ...` line. Returns null for lines without a score (info string, currmove, ...),
 * which the UI does not need. `turn` is the side to move in the position that was searched.
 */
export function parseInfo(line: string, turn: Turn): EngineLine | null {
  const tokens = line.trim().split(/\s+/);
  if (tokens[0] !== "info") return null;
  const si = tokens.indexOf("score");
  if (si < 0) return null;
  const depth = num(tokens, "depth");
  if (depth === undefined) return null;
  const kind = tokens[si + 1];
  const raw = Number(tokens[si + 2]);
  if ((kind !== "cp" && kind !== "mate") || !Number.isFinite(raw)) return null;

  const sign = turn === "w" ? 1 : -1;
  const score: Score = kind === "cp" ? { cp: raw * sign, mate: null } : { cp: null, mate: raw * sign };

  let bound: EngineLine["bound"];
  const bi = si + 3;
  if (tokens[bi] === "lowerbound") bound = turn === "w" ? "lower" : "upper";
  else if (tokens[bi] === "upperbound") bound = turn === "w" ? "upper" : "lower";

  const pi = tokens.indexOf("pv");
  const pv = pi < 0 ? [] : tokens.slice(pi + 1).filter((t) => UCI_MOVE.test(t));

  const out: EngineLine = { multipv: num(tokens, "multipv") ?? 1, depth, score, pv };
  const seldepth = num(tokens, "seldepth");
  if (seldepth !== undefined) out.seldepth = seldepth;
  if (bound) out.bound = bound;
  const nodes = num(tokens, "nodes");
  if (nodes !== undefined) out.nodes = nodes;
  const nps = num(tokens, "nps");
  if (nps !== undefined) out.nps = nps;
  const time = num(tokens, "time");
  if (time !== undefined) out.time = time;
  return out;
}

/** `bestmove e2e4 ponder e7e5` -> "e2e4"; `bestmove (none)` -> null; other lines -> undefined. */
export function parseBestMove(line: string): string | null | undefined {
  const t = line.trim().split(/\s+/);
  if (t[0] !== "bestmove") return undefined;
  return t[1] && UCI_MOVE.test(t[1]) ? t[1] : null;
}

/** "e2e4" -> { from: "e2", to: "e4" }, promotion in `promotion`. */
export function splitUci(uci: string): { from: string; to: string; promotion?: string } {
  const r: { from: string; to: string; promotion?: string } = { from: uci.slice(0, 2), to: uci.slice(2, 4) };
  if (uci.length > 4) r.promotion = uci[4];
  return r;
}

/** Display string such as "+0.35", "-1.20", "M3", "-M5". */
export function formatScore(score: Score): string {
  if (score.mate !== null) {
    if (score.mate === 0) return "#";
    return score.mate > 0 ? `M${score.mate}` : `-M${Math.abs(score.mate)}`;
  }
  const cp = score.cp ?? 0;
  const pawns = Math.abs(cp) / 100;
  const s = pawns.toFixed(2);
  if (cp === 0) return "0.00";
  return cp > 0 ? `+${s}` : `-${s}`;
}

/** Compact label for the eval bar: "+0.3", "-1.2", "+12", "M3". */
export function formatScoreShort(score: Score): string {
  if (score.mate !== null) return formatScore(score);
  const cp = score.cp ?? 0;
  const p = Math.abs(cp) / 100;
  const body = p >= 10 ? String(Math.round(p)) : p.toFixed(1);
  return cp === 0 || body === "0.0" ? "0.0" : cp > 0 ? `+${body}` : `-${body}`;
}

/** Share of the eval bar that belongs to White, 0..100 (Lichess' win-probability curve; mate = full bar). */
export function whiteShare(score: Score): number {
  if (score.mate !== null) {
    if (score.mate === 0) return 50;
    return score.mate > 0 ? 100 : 0;
  }
  const cp = Math.max(-1000, Math.min(1000, score.cp ?? 0));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
}

/** Who the score favours: "white" | "black" | "even" (within 0.2 pawns). */
export function favours(score: Score): "white" | "black" | "even" {
  if (score.mate !== null) return score.mate > 0 ? "white" : score.mate < 0 ? "black" : "even";
  const cp = score.cp ?? 0;
  return cp > 20 ? "white" : cp < -20 ? "black" : "even";
}
