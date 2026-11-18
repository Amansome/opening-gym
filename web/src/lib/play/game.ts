// Pure state of a game against the bot: moves from a start position, who the user is, takeback,
// resignation, result detection and PGN. No React, no engine.
import { Chess } from "chess.js";
import type { Level } from "./levels";

export type Color = "white" | "black";

export interface PlayMove {
  san: string;
  uci: string;
  from: string;
  to: string;
  /** FEN after the move */
  fen: string;
  by: Color;
  /** who chose it: the user, the course (book) or Stockfish */
  source: "user" | "book" | "engine";
}

export interface PlayState {
  startFen: string;
  user: Color;
  moves: PlayMove[];
  resigned: Color | null;
}

export type EndKind = "checkmate" | "stalemate" | "threefold" | "fifty" | "insufficient" | "resign";

export interface Outcome {
  kind: EndKind;
  winner: Color | null;
  /** PGN result token */
  result: "1-0" | "0-1" | "1/2-1/2";
}

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const other = (c: Color): Color => (c === "white" ? "black" : "white");
export const colorOfTurn = (fen: string): Color => (fen.split(" ")[1] === "b" ? "black" : "white");

export function isValidFen(fen: string): boolean {
  try {
    new Chess(fen);
    return true;
  } catch {
    return false;
  }
}

export function newPlay(startFen: string, user: Color): PlayState {
  return { startFen, user, moves: [], resigned: null };
}

export function currentFen(s: PlayState): string {
  return s.moves.length ? s.moves[s.moves.length - 1].fen : s.startFen;
}

export const turnOf = (s: PlayState): Color => colorOfTurn(currentFen(s));

/** Every position of the game, start first. */
export function fensOf(s: PlayState): string[] {
  return [s.startFen, ...s.moves.map((m) => m.fen)];
}

export function lastMoveOf(s: PlayState): { from: string; to: string } | null {
  const m = s.moves[s.moves.length - 1];
  return m ? { from: m.from, to: m.to } : null;
}

export function uciOf(m: { from: string; to: string; promotion?: string }): string {
  return m.from + m.to + (m.promotion ?? "");
}

/** Play a move. Returns null when it is illegal or the game is already over. */
export function makeMove(s: PlayState, move: { from: string; to: string; promotion?: string }, source: PlayMove["source"]): PlayState | null {
  if (outcomeOf(s)) return null;
  const fen = currentFen(s);
  try {
    const c = new Chess(fen);
    const made = c.move({ from: move.from, to: move.to, promotion: move.promotion });
    const entry: PlayMove = {
      san: made.san,
      uci: made.from + made.to + (made.promotion ?? ""),
      from: made.from,
      to: made.to,
      fen: c.fen(),
      by: made.color === "w" ? "white" : "black",
      source,
    };
    return { ...s, moves: [...s.moves, entry] };
  } catch {
    return null;
  }
}

/** Legal moves of the position, as UCI strings. */
export function legalUci(fen: string): string[] {
  try {
    return new Chess(fen).moves({ verbose: true }).map((m) => m.from + m.to + (m.promotion ?? ""));
  } catch {
    return [];
  }
}

/** Index of the user's last move, or -1. */
function lastUserIndex(s: PlayState): number {
  for (let i = s.moves.length - 1; i >= 0; i--) if (s.moves[i].by === s.user) return i;
  return -1;
}

export const canTakeback = (s: PlayState): boolean => lastUserIndex(s) >= 0;

/** Take back one full move: the user's last move and the bot's reply to it (if it has replied). */
export function takeback(s: PlayState): PlayState {
  const i = lastUserIndex(s);
  if (i < 0) return s;
  return { ...s, moves: s.moves.slice(0, i), resigned: null };
}

export function resign(s: PlayState): PlayState {
  return outcomeOf(s) ? s : { ...s, resigned: s.user };
}

/** The result of the game, or null while it is going on. */
export function outcomeOf(s: PlayState): Outcome | null {
  if (s.resigned) {
    const winner = other(s.resigned);
    return { kind: "resign", winner, result: winner === "white" ? "1-0" : "0-1" };
  }
  let c: Chess;
  try {
    c = new Chess(s.startFen);
    for (const m of s.moves) c.move({ from: m.from, to: m.to, promotion: m.uci[4] });
  } catch {
    return null;
  }
  if (c.isCheckmate()) {
    const winner: Color = c.turn() === "w" ? "black" : "white";
    return { kind: "checkmate", winner, result: winner === "white" ? "1-0" : "0-1" };
  }
  const draw = (kind: EndKind): Outcome => ({ kind, winner: null, result: "1/2-1/2" });
  if (c.isStalemate()) return draw("stalemate");
  if (c.isInsufficientMaterial()) return draw("insufficient");
  if (c.isThreefoldRepetition()) return draw("threefold");
  if (c.isDrawByFiftyMoves()) return draw("fifty");
  return null;
}

/** Plain-English headline for the result panel, from the user's point of view. */
export function outcomeHeadline(o: Outcome, user: Color): string {
  if (o.winner === null) return "Draw";
  return o.winner === user ? "You won" : "You lost";
}

export function outcomeDetail(o: Outcome, user: Color): string {
  switch (o.kind) {
    case "checkmate":
      return o.winner === user ? "You checkmated the bot." : "The bot checkmated you.";
    case "resign":
      return "You resigned.";
    case "stalemate":
      return "Stalemate: the side to move has no legal move but is not in check.";
    case "threefold":
      return "The same position appeared three times.";
    case "fifty":
      return "Fifty moves passed with no capture or pawn move.";
    case "insufficient":
      return "Neither side has enough pieces left to give checkmate.";
  }
}

/** PGN of the game, with the result. */
export function pgnOf(s: PlayState, level: Level, date: Date = new Date()): string {
  const c = new Chess(s.startFen);
  for (const m of s.moves) c.move({ from: m.from, to: m.to, promotion: m.uci[4] });
  const o = outcomeOf(s);
  const bot = `Opening Gym bot (${level.label})`;
  c.setHeader("Event", "Opening Gym practice game");
  c.setHeader("Site", "Opening Gym");
  c.setHeader("Date", `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`);
  c.setHeader("White", s.user === "white" ? "You" : bot);
  c.setHeader("Black", s.user === "black" ? "You" : bot);
  c.setHeader("Result", o ? o.result : "*");
  const pgn = c.pgn();
  return o && !pgn.trimEnd().endsWith(o.result) ? `${pgn}${pgn.endsWith("\n") ? "" : " "}${o.result}` : pgn;
}
