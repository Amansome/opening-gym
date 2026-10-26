import type { ReactNode } from "react";
import { Board } from "../board";
import type { BoardColor, BoardMove, BoardProps } from "../board";
import type { Mode } from "../../lib/types";
import { START_EVAL_CP } from "../../lib/trainer";
import type { BubbleState, LineRunner } from "./useLineRunner";
import { CoachNote } from "./CoachNote";
import { ControlBar } from "./ControlBar";
import type { ControlSpec } from "./ControlBar";
import { PlayerLayout } from "./PlayerLayout";
import { EvalBar } from "./EvalBar";
import { Scoreboard } from "./Scoreboard";
import type { ScoreStat } from "./Scoreboard";
import { Icon } from "./icons";
import { useEvalBarPref } from "./hooks";
import type { IconName } from "./icons";
import "./trainer.css";

export const MODE_META: Record<Mode, { label: string; icon: IconName }> = {
  learn: { label: "Learn", icon: "book" },
  practice: { label: "Practice", icon: "target" },
  drill: { label: "Drill", icon: "flame" },
  time: { label: "Time", icon: "hourglass" },
  dojo: { label: "Dojo", icon: "target" },
};

/** A painted court line that fills as you play (or drains, for the Time clock). */
export function ProgressBar({ value, danger, label }: { value: number; danger?: boolean; label?: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={`og-bar${danger ? " og-bar--danger" : ""}`}
      role="progressbar"
      aria-label={label ?? "Line progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      data-testid="progress-bar"
    >
      <div className="og-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Map a runner's view onto Board props. */
export function boardPropsFromRunner(
  runner: LineRunner,
  orientation: BoardColor,
  onMove: (m: BoardMove) => void,
): BoardProps {
  const v = runner.view;
  return {
    fen: v.fen,
    orientation,
    movable: runner.movable,
    lastMove: v.lastMove,
    mark: v.mark,
    hintSquare: v.hintSquare,
    arrows: v.arrows,
    animate: v.animate,
    resetKey: v.resetKey,
    onMove,
  };
}

export interface PlayerShellProps {
  mode: Mode;
  lineKey?: { course: string; line: string };
  title: string;
  /** the mode's own numerals on the scoreboard: line counter, run streak, clock */
  stats?: ScoreStat[];
  streakDays?: number;
  /** the painted progress line */
  bar: ReactNode;
  note: BubbleState;
  noteActions?: ReactNode;
  noteBadge?: ReactNode;
  openingName?: string;
  /** small line under the note, e.g. "From Caro-Kann Defence" */
  caption?: ReactNode;
  board: BoardProps;
  /** Stockfish eval (centipawns, White's view) of the position on the board. undefined = the start position. */
  evalCp?: number | null;
  overlay?: ReactNode;
  controls: ControlSpec[];
  /** the mode tab strip */
  tabs?: ReactNode;
}

export function PlayerShell(p: PlayerShellProps) {
  const [evalOn, setEvalOn] = useEvalBarPref();
  // Time mode is all about speed: no eval bar and no leaving mid-run.
  const timed = p.mode === "time";
  const showEval = evalOn && !timed;
  const controls: ControlSpec[] = [...p.controls];
  if (!timed) {
    controls.push(
      { id: "eval", label: "Eval bar", short: "Eval", icon: "gauge", onClick: () => setEvalOn(!evalOn), pressed: evalOn },
      { id: "analyse", label: "Analyse", icon: "search", to: `/analysis?fen=${encodeURIComponent(p.board.fen)}` },
    );
  }
  const footer = (
    <div className="og-opening" data-testid="opening-name">
      {p.openingName ? (
        <>
          <Icon name="book" size={14} />
          <strong>{p.openingName}</strong>
        </>
      ) : (
        p.caption
      )}
    </div>
  );
  return (
    <PlayerLayout
      mode={p.mode}
      lineKey={p.lineKey}
      tabs={
        p.tabs ?? (
          <div className="og-modehead" data-testid="mode-head">
            <Icon name={MODE_META[p.mode].icon} size={18} />
            {MODE_META[p.mode].label}
            {p.mode === "dojo" && <small>Lines from every course you have started</small>}
          </div>
        )
      }
      scoreboard={<Scoreboard title={p.title} stats={p.stats ?? []} streakDays={p.streakDays} />}
      bar={p.bar}
      coach={<CoachNote note={p.note} actions={p.noteActions} badge={p.noteBadge} footer={footer} />}
      board={<Board {...p.board} />}
      evalBar={showEval ? <EvalBar cp={p.evalCp === undefined ? START_EVAL_CP : p.evalCp} orientation={p.board.orientation ?? "white"} /> : undefined}
      overlay={p.overlay}
      controls={<ControlBar controls={controls} />}
    />
  );
}
