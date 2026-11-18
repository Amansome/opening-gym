// Pure solution checking and opponent auto-reply sequencing. No React, no engine: the solution is baked into the puzzle.
import { Chess } from "chess.js";
import type { Puzzle } from "./types";

export interface PuzzleMove {
  from: string;
  to: string;
  promotion?: string;
}

export const toUci = (m: PuzzleMove): string => `${m.from}${m.to}${m.promotion ?? ""}`;
const fromUci = (u: string): PuzzleMove => ({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || undefined });

export interface PuzzleState {
  fen: string;
  /** Index into puzzle.moves of the next solver move. */
  step: number;
  solved: boolean;
  /** The last move played on the board (for the highlight). */
  last: { from: string; to: string } | null;
}

export function startState(p: Puzzle): PuzzleState {
  return { fen: p.fen, step: 0, solved: false, last: null };
}

function apply(fen: string, m: PuzzleMove): { fen: string; san: string; mate: boolean } | null {
  try {
    const c = new Chess(fen);
    const mv = c.move({ from: m.from, to: m.to, promotion: m.promotion });
    return { fen: c.fen(), san: mv.san, mate: c.isCheckmate() };
  } catch {
    return null;
  }
}

export type MoveResult =
  /** Not the solution. `state` is unchanged. */
  | { kind: "wrong"; state: PuzzleState }
  /** Correct, and the puzzle goes on: `afterUser` is the board after the solver's move, `reply` the opponent's answer. */
  | { kind: "correct"; state: PuzzleState; afterUser: PuzzleState; reply: PuzzleMove; san: string }
  /** Correct and final. */
  | { kind: "solved"; state: PuzzleState; san: string };

/** Is `m` the expected solver move at this step? Any checkmate also counts in a mate puzzle (alternate mates are fine). */
export function isSolutionMove(p: Puzzle, state: PuzzleState, m: PuzzleMove): boolean {
  const want = p.moves[state.step];
  if (!want) return false;
  const got = toUci(m);
  if (got === want) return true;
  if (p.kind === "mate") {
    // a move that mates on the spot is accepted at any step, since nothing beats it
    const r = apply(state.fen, m);
    return !!r && r.mate;
  }
  // a promotion to a queen written without the suffix ("e7e8" vs "e7e8q") is the same move
  return want.length === 5 && want.slice(0, 4) === got && want[4] === "q";
}

/** Judge one solver move. The returned `reply` is the opponent's automatic answer (when the puzzle continues). */
export function playMove(p: Puzzle, state: PuzzleState, m: PuzzleMove): MoveResult {
  if (state.solved || !isSolutionMove(p, state, m)) return { kind: "wrong", state };
  const first = apply(state.fen, m);
  if (!first) return { kind: "wrong", state };
  const afterUser: PuzzleState = { fen: first.fen, step: state.step + 1, solved: false, last: { from: m.from, to: m.to } };
  const replyUci = p.moves[state.step + 1];
  if (first.mate || !replyUci) {
    const done: PuzzleState = { ...afterUser, solved: true };
    return { kind: "solved", state: done, san: first.san };
  }
  const reply = fromUci(replyUci);
  const second = apply(first.fen, reply);
  if (!second) return { kind: "solved", state: { ...afterUser, solved: true }, san: first.san };
  const next: PuzzleState = { fen: second.fen, step: state.step + 2, solved: false, last: { from: reply.from, to: reply.to } };
  return { kind: "correct", state: next, afterUser, reply, san: first.san };
}

/** The square of the piece the solver must move next (for the hint). */
export function hintSquare(p: Puzzle, state: PuzzleState): string | null {
  const u = p.moves[state.step];
  return u ? u.slice(0, 2) : null;
}

/** Solver moves left, for "n moves to go". */
export function solverMovesLeft(p: Puzzle, state: PuzzleState): number {
  return Math.max(0, Math.ceil((p.moves.length - state.step) / 2));
}

/** How many moves the solver plays in total. */
export const solverMoves = (p: Puzzle): number => Math.ceil(p.moves.length / 2);

/** "White to play and win material" */
export function prompt(p: Puzzle): string {
  const who = p.turn === "white" ? "White" : "Black";
  if (p.kind === "mate") return `${who} to play and mate in ${p.mateIn ?? Math.ceil(p.moves.length / 2)}`;
  const what = p.label === "Win the queen" ? "win the queen" : p.label === "Win a piece" ? "win a piece" : "win material";
  return `${who} to play and ${what}`;
}

/** The solution as numbered SAN text, e.g. "1. Qxf7+ Kxf7 2. Ng5+". */
export function solutionText(p: Puzzle): string {
  const startWhite = p.turn === "white";
  const out: string[] = [];
  let num = Number(p.fen.split(" ")[5]) || 1;
  p.san.forEach((s, i) => {
    const whiteMove = (i % 2 === 0) === startWhite;
    if (whiteMove) out.push(`${num}. ${s}`);
    else {
      out.push(i === 0 ? `${num}... ${s}` : s);
      num++;
    }
  });
  return out.join(" ");
}
