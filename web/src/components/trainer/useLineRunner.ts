// Drives one LineSession for the UI: opponent auto-play with a delay, feedback, hints, undo, marks and bubble content.
import { useCallback, useEffect, useRef, useState } from "react";
import type { Course, Line, LineResult, Mode, MoveNode } from "../../lib/types";
import { LineSession, START_EVAL_CP, START_FEN } from "../../lib/trainer";
import type { Color, Feedback, MoveAttempt } from "../../lib/trainer";
import type { BoardArrow, BoardMark } from "../board";

export type RunnerPhase =
  | "idle" // no line
  | "ready" // waiting for the player to press Start (welcome screen)
  | "opponent" // opponent about to move
  | "user" // waiting for the user's move
  | "wrong" // a mistake is on the board; waiting for "Try again"
  | "done" // line completed
  | "failed"; // run ended on a mistake (Drill / Time)

export interface BubbleNote {
  san: string;
  text: string;
}

/** Which feedback the note is giving, so the UI can colour and label it. */
export type NoteKind = "correct" | "wrong" | "fine" | "other-line" | "hint";

export interface BubbleState {
  tone: "neutral" | "good" | "bad";
  kind?: NoteKind;
  text?: string;
  notes: BubbleNote[];
  /** what the user should do now: a spoken instruction (Learn) or "Your move." */
  prompt?: string;
}

export interface RunnerView {
  phase: RunnerPhase;
  fen: string;
  animate: boolean;
  lastMove: { from: string; to: string } | null;
  mark: BoardMark | null;
  hintSquare: string | null;
  arrows: BoardArrow[];
  bubble: BubbleState;
  openingName?: string;
  /** precomputed engine eval of the position on the board (centipawns, White's view); null = not available */
  evalCp: number | null;
  /** 0..1 along the line */
  progress: number;
  hintsUsed: number;
  canUndo: boolean;
  color: Color;
  resetKey: number;
}

export interface RunnerConfig {
  course: Course | undefined;
  line: Line | undefined;
  mode: Mode;
  /** change to restart the same line */
  runId: number;
  opponentDelayMs: number;
  /** Learn: spoken instructions on every user turn. Other modes just say "Your move." */
  instructions: boolean;
  /** show coach notes after moves */
  showNotes: boolean;
  /** shown in the bubble before the first move (course welcome / line intro) */
  intro?: string;
  /** hold the line until start() is called (only matters when the opponent has the first move) */
  waitForStart?: boolean;
  /** show the expected move as an arrow after a mistake (Practice, Drill, Time) */
  arrowOnMistake: boolean;
  /** ms to wait after a run-ending mistake before reporting it */
  failDelayMs: number;
  /** the board is frozen (e.g. Time mode before Start or after time-up) */
  frozen?: boolean;
  onFinish: (result: LineResult, outcome: "completed" | "failed") => void;
}

const PRAISE = ["Correct.", "That's the move.", "Exactly.", "Good."];

function moveOf(node: MoveNode): { from: string; to: string } {
  return { from: node.uci.slice(0, 2), to: node.uci.slice(2, 4) };
}

/** Eval to show once `node` is on the board (undefined node = the start position). */
function evalAfter(node: MoveNode | undefined): number | null {
  return node ? (node.eval ?? null) : START_EVAL_CP;
}

function emptyView(): RunnerView {
  return {
    phase: "idle",
    fen: START_FEN,
    animate: false,
    lastMove: null,
    mark: null,
    hintSquare: null,
    arrows: [],
    bubble: { tone: "neutral", notes: [] },
    evalCp: START_EVAL_CP,
    progress: 0,
    hintsUsed: 0,
    canUndo: false,
    color: "white",
    resetKey: 0,
  };
}

export interface LineRunner {
  view: RunnerView;
  movable: Color | null;
  onUserMove: (m: MoveAttempt) => void;
  hint: () => void;
  undo: () => void;
  tryAgain: () => void;
  start: () => void;
}

export function useLineRunner(cfg: RunnerConfig): LineRunner {
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
  const sessionRef = useRef<LineSession | null>(null);
  const timers = useRef<number[]>([]);
  const finished = useRef(false);
  const [view, setView] = useState<RunnerView>(emptyView);
  const viewRef = useRef(view);
  viewRef.current = view;

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const complete = useCallback((outcome: "completed" | "failed") => {
    const s = sessionRef.current;
    if (!s || finished.current) return;
    finished.current = true;
    cfgRef.current.onFinish(s.result(), outcome);
  }, []);

  const promptFor = useCallback((s: LineSession): string | undefined => {
    if (s.status !== "user") return undefined;
    return cfgRef.current.instructions ? s.instruction : "Your move.";
  }, []);

  const stepOpponent = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.status !== "opponent") return;
    const node = s.playOpponent();
    if (!node) return;
    const done = s.ply >= s.totalPlies;
    const showNotes = cfgRef.current.showNotes;
    setView((v) => {
      let notes = v.bubble.notes;
      let text = v.bubble.text;
      if (node.note && showNotes) {
        notes = [...notes.slice(-1), { san: node.san, text: node.note }];
        text = undefined;
      } else if (s.ply === 1) {
        // the welcome / line intro goes away once the first move is on the board
        notes = [];
        text = undefined;
      }
      return {
        ...v,
        phase: done ? "done" : "user",
        fen: node.fen,
        animate: true,
        lastMove: moveOf(node),
        evalCp: evalAfter(node),
        mark: null,
        hintSquare: null,
        arrows: [],
        openingName: s.openingName,
        progress: s.ply / s.totalPlies,
        canUndo: s.canUndo,
        bubble: { tone: "neutral", text, notes, prompt: promptFor(s) },
      };
    });
    if (done) complete("completed");
  }, [complete, promptFor]);

  const scheduleOpponent = useCallback(() => {
    later(stepOpponent, cfgRef.current.opponentDelayMs);
  }, [later, stepOpponent]);

  // (Re)start whenever the line, mode or runId changes.
  useEffect(() => {
    clearTimers();
    finished.current = false;
    const { course, line, mode } = cfg;
    if (!line || !course) {
      sessionRef.current = null;
      setView(emptyView());
      return;
    }
    const s = new LineSession({ course, line, mode });
    sessionRef.current = s;
    const waiting = !!cfg.waitForStart && s.status === "opponent";
    setView({
      ...emptyView(),
      phase: waiting ? "ready" : s.status === "user" ? "user" : "opponent",
      color: s.color,
      animate: false,
      bubble: {
        tone: "neutral",
        text: cfg.intro,
        notes: [],
        prompt: s.status === "user" ? (cfg.instructions ? s.instruction : "Your move.") : undefined,
      },
    });
    if (!waiting && s.status === "opponent") {
      later(stepOpponent, cfg.intro ? Math.max(cfg.opponentDelayMs, 700) : cfg.opponentDelayMs);
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.course, cfg.line, cfg.mode, cfg.runId]);

  const start = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    setView((v) => (v.phase === "ready" ? { ...v, phase: "opponent" } : v));
    scheduleOpponent();
  }, [scheduleOpponent]);

  const onUserMove = useCallback(
    (m: MoveAttempt) => {
      const s = sessionRef.current;
      if (!s || s.status !== "user" || viewRef.current.phase !== "user") return;
      const fb: Feedback = s.submit(m);
      switch (fb.kind) {
        case "ignored":
          return;
        case "illegal":
          setView((v) => ({ ...v, resetKey: v.resetKey + 1 }));
          return;
        case "correct": {
          const showNotes = cfgRef.current.showNotes;
          const notes = fb.node.note && showNotes ? [{ san: fb.node.san, text: fb.node.note }] : [];
          const text = notes.length === 0 && cfgRef.current.instructions ? PRAISE[s.ply % PRAISE.length] : undefined;
          setView((v) => ({
            ...v,
            phase: fb.done ? "done" : "opponent",
            fen: fb.node.fen,
            animate: true,
            lastMove: moveOf(fb.node),
            evalCp: evalAfter(fb.node),
            mark: { square: fb.node.uci.slice(2, 4), kind: "correct" },
            hintSquare: null,
            arrows: [],
            openingName: s.openingName,
            progress: s.ply / s.totalPlies,
            canUndo: s.canUndo,
            bubble: { tone: "good", kind: "correct", text, notes, prompt: undefined },
          }));
          if (fb.done) complete("completed");
          else scheduleOpponent();
          return;
        }
        case "fine": {
          // Not a mistake in any mode: the piece goes back, the coach says what the course plays, the run goes on.
          setView((v) => ({
            ...v,
            phase: "user",
            animate: false,
            mark: null,
            hintSquare: null,
            arrows: [],
            resetKey: v.resetKey + 1,
            bubble: { tone: "good", kind: "fine", text: fb.message, notes: [], prompt: promptFor(s) },
          }));
          return;
        }
        default: {
          const arrows: BoardArrow[] =
            cfgRef.current.arrowOnMistake || fb.failed
              ? [{ from: fb.expected.uci.slice(0, 2), to: fb.expected.uci.slice(2, 4), kind: "correct" }]
              : [];
          const notes = fb.expected.note ? [{ san: fb.expected.san, text: fb.expected.note }] : [];
          setView((v) => ({
            ...v,
            phase: fb.failed ? "failed" : "wrong",
            fen: fb.attemptFen,
            animate: false,
            lastMove: { from: fb.from, to: fb.to },
            mark: { square: fb.to, kind: "wrong" },
            hintSquare: null,
            arrows,
            bubble: { tone: "bad", kind: fb.kind === "other-line" ? "other-line" : "wrong", text: fb.message, notes: cfgRef.current.mode === "time" ? [] : notes },
          }));
          if (fb.failed) later(() => complete("failed"), cfgRef.current.failDelayMs);
        }
      }
    },
    [complete, later, promptFor, scheduleOpponent],
  );

  const tryAgain = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.status !== "user") return;
    s.resetClock();
    const last = s.lastNode;
    setView((v) => ({
      ...v,
      phase: "user",
      fen: s.fen,
      animate: true,
      lastMove: last ? moveOf(last) : null,
      evalCp: evalAfter(last),
      mark: null,
      hintSquare: null,
      arrows: [],
      bubble: { tone: "neutral", text: "Try again.", notes: [], prompt: promptFor(s) },
    }));
  }, [promptFor]);

  const hint = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.status !== "user" || viewRef.current.phase !== "user") return;
    const info = s.hint();
    if (!info) return;
    setView((v) => ({
      ...v,
      phase: "user",
      hintSquare: info.from,
      arrows: info.to ? [{ from: info.from, to: info.to, kind: "hint" }] : [],
      hintsUsed: v.hintsUsed + 1,
      bubble: {
        ...v.bubble,
        tone: "neutral",
        kind: "hint",
        text: info.level === 1 ? "Hint: this is the piece to move." : "Hint: here is where it goes.",
        prompt: promptFor(s),
      },
    }));
  }, [promptFor]);

  const undo = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    clearTimers();
    const u = s.undo();
    if (!u) return;
    finished.current = false;
    const last = s.lastNode;
    setView((v) => ({
      ...v,
      phase: "user",
      fen: u.fen,
      animate: false,
      lastMove: last ? moveOf(last) : null,
      evalCp: evalAfter(last),
      mark: null,
      hintSquare: null,
      arrows: [],
      openingName: s.openingName,
      progress: s.ply / s.totalPlies,
      canUndo: s.canUndo,
      resetKey: v.resetKey + 1,
      bubble: { tone: "neutral", text: "Taken back. Have another go.", notes: [], prompt: promptFor(s) },
    }));
  }, [clearTimers, promptFor]);

  const movable: Color | null = view.phase === "user" && !cfg.frozen ? view.color : null;
  return { view, movable, onUserMove, hint, undo, tryAgain, start };
}
