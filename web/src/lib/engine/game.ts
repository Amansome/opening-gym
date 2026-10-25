// Pure game-state helpers for the analysis board: a mainline of moves from a start position,
// loading FEN / PGN text, and exporting PGN. No React.
import { Chess } from "chess.js";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export interface GameMove {
  san: string;
  uci: string;
  from: string;
  to: string;
  /** FEN after this move */
  fen: string;
}

export interface Game {
  startFen: string;
  moves: GameMove[];
  /** PGN tags (White, Black, Event, ...) when the game came from a PGN */
  headers: Record<string, string>;
}

export function newGame(startFen: string = START_FEN): Game {
  return { startFen, moves: [], headers: {} };
}

/** FEN of the position after `ply` half-moves (0 = the start position). */
export function fenAt(game: Game, ply: number): string {
  if (ply <= 0) return game.startFen;
  return game.moves[Math.min(ply, game.moves.length) - 1].fen;
}

export function lastMoveAt(game: Game, ply: number): { from: string; to: string } | null {
  if (ply <= 0) return null;
  const m = game.moves[Math.min(ply, game.moves.length) - 1];
  return { from: m.from, to: m.to };
}

export interface PlayResult {
  game: Game;
  ply: number;
}

/**
 * Play a move at `ply`. If it equals the next mainline move we just step forward; otherwise the
 * rest of the line is replaced by the new move. Returns null for an illegal move.
 */
export function playMove(game: Game, ply: number, move: { from: string; to: string; promotion?: string }): PlayResult | null {
  let chess: Chess;
  try {
    chess = new Chess(fenAt(game, ply));
  } catch {
    return null;
  }
  let made;
  try {
    made = chess.move({ from: move.from, to: move.to, promotion: move.promotion });
  } catch {
    return null;
  }
  const uci = made.from + made.to + (made.promotion ?? "");
  const next = game.moves[ply];
  if (next && next.uci === uci) return { game, ply: ply + 1 };
  const entry: GameMove = { san: made.san, uci, from: made.from, to: made.to, fen: chess.fen() };
  return { game: { ...game, moves: [...game.moves.slice(0, ply), entry] }, ply: ply + 1 };
}

/** Play a UCI move string (engine output) at `ply`. */
export function playUci(game: Game, ply: number, uci: string): PlayResult | null {
  return playMove(game, ply, { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
}

const FEN_RE = /^\s*([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s+[wb]\s+(-|[KQkqA-Ha-h]+)\s+(-|[a-h][36])(\s+\d+\s+\d+)?\s*$/;

export function looksLikeFen(text: string): boolean {
  return FEN_RE.test(text);
}

/** The first game of a multi-game PGN file. */
function firstGame(pgn: string): string {
  const starts: number[] = [];
  const re = /^\[Event\s/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(pgn))) starts.push(m.index);
  if (starts.length < 2) return pgn;
  return pgn.slice(starts[0], starts[1]);
}

export type LoadResult = { ok: true; game: Game; kind: "fen" | "pgn"; extraGames: boolean } | { ok: false; error: string };

/** Accepts a FEN or a PGN (movetext only is fine). */
export function loadText(raw: string): LoadResult {
  const text = raw.trim();
  if (!text) return { ok: false, error: "Paste a FEN or a PGN first." };

  if (looksLikeFen(text)) {
    const fen = text.replace(/\s+/g, " ");
    try {
      const c = new Chess(fen.split(" ").length === 4 ? `${fen} 0 1` : fen);
      return { ok: true, kind: "fen", extraGames: false, game: newGame(c.fen()) };
    } catch (e) {
      return { ok: false, error: `That FEN is not a legal position${e instanceof Error ? ` (${e.message.replace(/^Invalid FEN:\s*/i, "")})` : ""}.` };
    }
  }

  const body = firstGame(text);
  const extraGames = body.length < text.length;
  const chess = new Chess();
  try {
    chess.loadPgn(body);
  } catch (e) {
    const why = e instanceof Error ? e.message.split("\n")[0] : "";
    return { ok: false, error: `Could not read that as a FEN or PGN${why ? `: ${why}` : ""}.` };
  }
  const history = chess.history({ verbose: true });
  const startFen = chess.getHeaders().FEN ?? START_FEN;
  if (history.length === 0 && !chess.getHeaders().FEN) {
    return { ok: false, error: "No moves found. Paste a FEN or a PGN such as 1. d4 d5 2. Bf4." };
  }
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(chess.getHeaders())) if (typeof v === "string" && v !== "?") headers[k] = v;
  const moves: GameMove[] = history.map((h) => ({
    san: h.san,
    uci: h.from + h.to + (h.promotion ?? ""),
    from: h.from,
    to: h.to,
    fen: h.after,
  }));
  return { ok: true, kind: "pgn", extraGames, game: { startFen, moves, headers } };
}

/** PGN for the whole mainline (adds SetUp/FEN tags when the game does not start from the initial position). */
export function toPgn(game: Game): string {
  const chess = new Chess(game.startFen);
  for (const m of game.moves) chess.move(m.san);
  for (const [k, v] of Object.entries(game.headers)) {
    if (k === "FEN" || k === "SetUp") continue;
    chess.setHeader(k, v);
  }
  return chess.pgn();
}

/** Game over text for the position, or null. */
export function gameOverText(fen: string): string | null {
  try {
    const c = new Chess(fen);
    if (c.isCheckmate()) return c.turn() === "w" ? "Checkmate. Black wins." : "Checkmate. White wins.";
    if (c.isStalemate()) return "Stalemate. Draw.";
    if (c.isInsufficientMaterial()) return "Draw by insufficient material.";
    if (c.isDraw()) return "Draw.";
  } catch {
    /* ignore */
  }
  return null;
}
