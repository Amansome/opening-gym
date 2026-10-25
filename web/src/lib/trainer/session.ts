// The line-stepping engine: pure TypeScript, no React. The UI owns timing (opponent delay, animation);
// this owns the rules: whose turn it is, whether a move is right, hints, undo and grading.
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import type { Course, Grade, Line, LineResult, Mode, MoveNode } from "../types";
import { lineNodes, userColor } from "../courses";
import { describeMove } from "./describe";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** A correct first-try move faster than this is graded "easy" (never in Learn mode). */
export const EASY_MS = 2500;

export type Color = "white" | "black";
export type SessionStatus = "opponent" | "user" | "done" | "failed";

export interface MoveAttempt {
  from: string;
  to: string;
  promotion?: string;
}

export interface HintInfo {
  /** 1 = highlight the piece to move; 2 = also show the arrow */
  level: 1 | 2;
  from: string;
  to?: string;
}

export type Feedback =
  /** Not the user's turn, or the run already ended. */
  | { kind: "ignored" }
  /** Not a legal move in this position. No penalty; the board should snap back. */
  | { kind: "illegal" }
  | {
      kind: "correct";
      node: MoveNode;
      grade: Grade;
      ms: number;
      usedHint: boolean;
      /** the line is finished (the user's move was the last one) */
      done: boolean;
    }
  | FineFeedback
  | WrongFeedback;

/**
 * The user played a move the engine rates about as well as the course move (`expected.fine`), just not the one
 * this course teaches. Not a mistake: it never ends a Drill / Time run. The first time per move it grades like a
 * hint ("hard"). The UI shows the message and puts the piece back so the user can play the course move.
 */
export interface FineFeedback {
  kind: "fine";
  expected: MoveNode;
  playedSan: string;
  attemptFen: string;
  from: string;
  to: string;
  expectedPhrase: string;
  /** e.g. "Good move too! The engine likes it, but this course plays Bf4. Try that." */
  message: string;
  failed: false;
}

export interface WrongFeedback {
  /** "other-line": a legal, trained move from a different line of this course. "wrong": anything else. */
  kind: "wrong" | "other-line";
  expected: MoveNode;
  /** The tree node the user's move corresponds to (only for "other-line"). */
  alternative?: MoveNode;
  playedSan: string;
  /** Position after the wrong move, so the UI can show it with a red mark. */
  attemptFen: string;
  from: string;
  to: string;
  /** spoken form of the expected move, e.g. "pawn to e3" */
  expectedPhrase: string;
  /** full coach sentence */
  message: string;
  /** true when this mistake ended the run (Drill / Time) */
  failed: boolean;
}

interface NodeStats {
  mistakes: number;
  hints: number;
  /** engine-approved alternatives tried at this move; grades like a hint */
  fines: number;
  startedAt: number;
  ms?: number;
  grade?: Grade;
  done: boolean;
}

export interface SessionOptions {
  course: Course;
  line: Line;
  mode: Mode;
  /** inject a clock for tests */
  now?: () => number;
  easyMs?: number;
}

export function nodeColor(node: MoveNode): Color {
  return node.ply % 2 === 1 ? "white" : "black";
}

function uciOf(from: string, to: string, promotion?: string): string {
  return from + to + (promotion ?? "");
}

function tryMove(chess: Chess, a: MoveAttempt) {
  const piece = chess.get(a.from as Square);
  try {
    return chess.move({ from: a.from, to: a.to, promotion: a.promotion });
  } catch {
    /* fall through to the forgiving paths below */
  }
  if (piece?.type === "p" && !a.promotion && (a.to[1] === "1" || a.to[1] === "8")) {
    try {
      return chess.move({ from: a.from, to: a.to, promotion: "q" });
    } catch {
      return null;
    }
  }
  // Chess960-style castling input: king dragged onto its own rook.
  const target = chess.get(a.to as Square);
  if (piece?.type === "k" && target?.type === "r" && target.color === piece.color) {
    const rank = a.from[1];
    const kingside = a.to.charCodeAt(0) > a.from.charCodeAt(0);
    try {
      return chess.move({ from: a.from, to: (kingside ? "g" : "c") + rank });
    } catch {
      return null;
    }
  }
  return null;
}

export class LineSession {
  readonly course: Course;
  readonly line: Line;
  readonly mode: Mode;
  readonly color: Color;
  readonly nodes: MoveNode[];
  private readonly now: () => number;
  private readonly easyMs: number;
  private index = 0;
  private failed = false;
  private hintLevel = 0;
  private stats = new Map<number, NodeStats>();

  constructor(opts: SessionOptions) {
    this.course = opts.course;
    this.line = opts.line;
    this.mode = opts.mode;
    this.now = opts.now ?? (() => performance.now());
    this.easyMs = opts.easyMs ?? EASY_MS;
    this.color = userColor(opts.course, opts.line);
    this.nodes = lineNodes(opts.course, opts.line);
    this.beginTurnIfUser();
  }

  /** Drill and Time end the run on the first mistake. */
  get failOnMistake(): boolean {
    return this.mode === "drill" || this.mode === "time";
  }

  /** Number of plies already played. */
  get ply(): number {
    return this.index;
  }

  get totalPlies(): number {
    return this.nodes.length;
  }

  get status(): SessionStatus {
    if (this.failed) return "failed";
    if (this.index >= this.nodes.length) return "done";
    return nodeColor(this.nodes[this.index]) === this.color ? "user" : "opponent";
  }

  /** Position now (after `ply` plies). */
  get fen(): string {
    return this.fenAt(this.index);
  }

  fenAt(index: number): string {
    return index <= 0 ? START_FEN : this.nodes[index - 1].fen;
  }

  /** The node played last, if any. */
  get lastNode(): MoveNode | undefined {
    return this.index > 0 ? this.nodes[this.index - 1] : undefined;
  }

  /** The move that is due next (the opponent's reply or the user's answer). */
  get nextNode(): MoveNode | undefined {
    return this.nodes[this.index];
  }

  /** Nodes played so far, in order. */
  get played(): MoveNode[] {
    return this.nodes.slice(0, this.index);
  }

  /** Most recent named position along the line so far, e.g. "D02 Queen's Pawn Game: London System". */
  get openingName(): string | undefined {
    for (let i = this.index - 1; i >= 0; i--) {
      const o = this.nodes[i].opening;
      if (o) return o;
    }
    return undefined;
  }

  /** How many moves the user has to find in this line. */
  get trainedCount(): number {
    return this.nodes.filter((n) => nodeColor(n) === this.color).length;
  }

  /** Spoken instruction for the pending user move, e.g. "Play bishop to f4." */
  get instruction(): string | undefined {
    if (this.status !== "user") return undefined;
    return describeMove(this.fenAt(this.index), this.nodes[this.index].san).instruction;
  }

  /** Restart the clock of the current user turn (e.g. after a welcome screen). */
  resetClock(): void {
    const s = this.stats.get(this.index);
    if (s) s.startedAt = this.now();
  }

  /** Advance one opponent ply. Returns the node played, or undefined if it is not the opponent's turn. */
  playOpponent(): MoveNode | undefined {
    if (this.status !== "opponent") return undefined;
    const node = this.nodes[this.index];
    this.index++;
    this.hintLevel = 0;
    this.beginTurnIfUser();
    return node;
  }

  /** Validate the user's attempted move. */
  submit(attempt: MoveAttempt): Feedback {
    if (this.status !== "user") return { kind: "ignored" };
    const expected = this.nodes[this.index];
    const fenBefore = this.fenAt(this.index);
    const chess = new Chess(fenBefore);
    const mv = tryMove(chess, attempt);
    if (!mv) return { kind: "illegal" };

    const uci = uciOf(mv.from, mv.to, mv.promotion);
    const stats = this.statsFor(this.index);

    if (uci === expected.uci) {
      const ms = Math.max(0, Math.round(this.now() - stats.startedAt));
      stats.ms = ms;
      stats.done = true;
      stats.grade = this.gradeFor(stats, ms);
      this.index++;
      this.hintLevel = 0;
      this.beginTurnIfUser();
      return {
        kind: "correct",
        node: expected,
        grade: stats.grade,
        ms,
        usedHint: stats.hints > 0,
        done: this.index >= this.nodes.length,
      };
    }

    const siblings = this.index === 0 ? this.course.tree : this.nodes[this.index - 1].children;
    const alternative = siblings.find((n) => n.uci === uci && n.id !== expected.id);
    const expectedPhrase = describeMove(fenBefore, expected.san).phrase;

    // "Other line" wins over "fine": a move this course teaches elsewhere is more specific than an engine opinion.
    if (!alternative && expected.fine?.includes(mv.san)) {
      stats.fines++;
      return {
        kind: "fine",
        expected,
        playedSan: mv.san,
        attemptFen: chess.fen(),
        from: mv.from,
        to: mv.to,
        expectedPhrase,
        message: `Good move too! The engine likes it, but this course plays ${expected.san}. Try that.`,
        failed: false,
      };
    }

    stats.mistakes++;
    stats.ms = Math.max(0, Math.round(this.now() - stats.startedAt));
    if (this.failOnMistake) {
      stats.grade = "again";
      this.failed = true;
    }
    const message = alternative
      ? `That's from another line in this course. Here we play ${expected.san} (${expectedPhrase}).`
      : `Not quite. The move here is ${expected.san} (${expectedPhrase}).`;
    return {
      kind: alternative ? "other-line" : "wrong",
      expected,
      alternative,
      playedSan: mv.san,
      attemptFen: chess.fen(),
      from: mv.from,
      to: mv.to,
      expectedPhrase,
      message,
      failed: this.failed,
    };
  }

  /** Hint for the pending user move: 1st call marks the piece, 2nd shows the arrow. Counts as "hard". */
  hint(): HintInfo | undefined {
    if (this.status !== "user") return undefined;
    const node = this.nodes[this.index];
    const stats = this.statsFor(this.index);
    stats.hints++;
    this.hintLevel = Math.min(2, this.hintLevel + 1);
    const from = node.uci.slice(0, 2);
    const to = node.uci.slice(2, 4);
    return this.hintLevel === 1 ? { level: 1, from } : { level: 2, from, to };
  }

  /** The ply index of the user's previous turn, or undefined if there is nothing to undo. */
  private undoTarget(): number | undefined {
    if (this.failed) return undefined;
    for (let i = this.index - 1; i >= 0; i--) {
      if (nodeColor(this.nodes[i]) === this.color) return i;
    }
    return undefined;
  }

  get canUndo(): boolean {
    return this.undoTarget() !== undefined;
  }

  /**
   * Take back to the user's previous turn (their last move and the opponent's reply are undone).
   * Mistakes and hints already recorded for those moves stay on the record.
   */
  undo(): { ply: number; fen: string } | undefined {
    const target = this.undoTarget();
    if (target === undefined) return undefined;
    for (const [i, s] of this.stats) {
      if (i >= target) {
        s.done = false;
        s.grade = undefined;
        s.ms = undefined;
      }
    }
    this.index = target;
    this.hintLevel = 0;
    this.beginTurnIfUser();
    return { ply: this.index, fen: this.fen };
  }

  /** Build the LineResult for what has happened so far. */
  result(): LineResult {
    const moves: LineResult["moves"] = [];
    let mistakes = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      const s = this.stats.get(i);
      if (!s) continue;
      mistakes += s.mistakes;
      if (s.done && s.grade) {
        moves.push({ nodeId: this.nodes[i].id, grade: s.grade, ms: s.ms ?? 0, usedHint: s.hints > 0 });
      } else if (this.failed && i === this.index) {
        moves.push({ nodeId: this.nodes[i].id, grade: "again", ms: s.ms ?? 0, usedHint: s.hints > 0 });
      }
    }
    return {
      courseId: this.course.id,
      lineId: this.line.id,
      mode: this.mode,
      moves,
      completed: this.status === "done",
      mistakes,
    };
  }

  private gradeFor(s: NodeStats, ms: number): Grade {
    if (s.mistakes > 0) return "again";
    if (s.hints > 0 || s.fines > 0) return "hard";
    if (this.mode !== "learn" && ms < this.easyMs) return "easy";
    return "good";
  }

  private statsFor(index: number): NodeStats {
    let s = this.stats.get(index);
    if (!s) {
      s = { mistakes: 0, hints: 0, fines: 0, startedAt: this.now(), done: false };
      this.stats.set(index, s);
    }
    return s;
  }

  private beginTurnIfUser(): void {
    if (this.status === "user") {
      const s = this.statsFor(this.index);
      s.startedAt = this.now();
    }
  }
}

/** All user moves of a line in order (handy for tests and tools). */
export function userNodes(course: Course, line: Line): MoveNode[] {
  const color = userColor(course, line);
  return lineNodes(course, line).filter((n) => nodeColor(n) === color);
}
