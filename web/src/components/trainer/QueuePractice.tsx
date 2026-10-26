// Practice and Dojo: a queue of lines played without instructions. Mistakes show the right move and let you retry.
import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { userColor } from "../../lib/courses";
import type { Course, Line, LineResult } from "../../lib/types";
import { progress } from "../../lib/progress";
import type { StreakInfo } from "../../lib/progress";
import type { BoardColor } from "../board";
import { useLineRunner } from "./useLineRunner";
import { PlayerShell, ProgressBar, boardPropsFromRunner } from "./PlayerShell";
import type { ControlSpec } from "./ControlBar";
import { Overlay } from "./Celebration";
import { START_FEN } from "../../lib/trainer";

export interface QueueItem {
  course: Course;
  line: Line;
}

export interface QueuePracticeProps {
  mode: "practice" | "dojo";
  /** shown in the header when the queue is empty */
  fallbackTitle: string;
  /** `again` is true for "another round": the first round may start on a chosen line, later rounds follow the scheduler */
  loadItems: (again?: boolean) => Promise<QueueItem[]>;
  streak: StreakInfo;
  refreshStreak: () => Promise<StreakInfo>;
  tabs?: ReactNode;
  /** buttons for the "nothing to practise" note and the round-complete overlay */
  extraActions?: ReactNode;
  emptyText: string;
  /** the lane picker, given the line on the board */
  lanes?: (currentLineId?: string) => ReactNode;
}

export function QueuePractice({ mode, fallbackTitle, loadItems, streak, refreshStreak, tabs, extraActions, emptyText, lanes }: QueuePracticeProps) {
  const [items, setItems] = useState<QueueItem[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [runId, setRunId] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [tally, setTally] = useState({ good: 0, hard: 0, again: 0, lines: 0 });

  const load = useCallback(async (again = false) => {
    setItems(null);
    const next = await loadItems(again);
    setItems(next);
    setIdx(0);
    setFinished(false);
    setTally({ good: 0, hard: 0, again: 0, lines: 0 });
    setRunId((r) => r + 1);
  }, [loadItems]);

  useEffect(() => {
    void load(false);
  }, [load]);

  const item = items && !finished ? items[idx] : undefined;

  const itemRef = useRef(item);
  itemRef.current = item;
  const onFinish = useCallback(
    async (result: LineResult) => {
      const it = itemRef.current;
      if (!it) return;
      await progress.recordLine(it.course, result);
      void refreshStreak();
      setTally((t) => {
        const next = { ...t, lines: t.lines + 1 };
        for (const m of result.moves) {
          if (m.grade === "again") next.again++;
          else if (m.grade === "hard") next.hard++;
          else next.good++;
        }
        return next;
      });
    },
    [refreshStreak],
  );

  const runner = useLineRunner({
    course: item?.course,
    line: item?.line,
    mode,
    runId,
    opponentDelayMs: 350,
    instructions: false,
    showNotes: true,
    arrowOnMistake: true,
    failDelayMs: 0,
    onFinish,
  });

  const total = items?.length ?? 0;
  const lastOne = idx >= total - 1;
  const advance = useCallback(() => {
    if (lastOne) setFinished(true);
    else {
      setIdx((i) => i + 1);
      setRunId((r) => r + 1);
    }
  }, [lastOne]);

  const color: BoardColor = item ? userColor(item.course, item.line) : "white";
  const orientation: BoardColor = flipped ? (color === "white" ? "black" : "white") : color;
  const phase = runner.view.phase;

  let note = runner.view.bubble;
  let noteActions: ReactNode;
  let board = boardPropsFromRunner(runner, orientation, runner.onUserMove);
  const controls: ControlSpec[] = [];

  if (items === null) {
    note = { tone: "neutral", text: "Loading...", notes: [] };
    board = { fen: START_FEN, orientation, movable: null };
  } else if (!item) {
    board = { fen: START_FEN, orientation, movable: null };
    if (total === 0) {
      note = { tone: "neutral", text: emptyText, notes: [] };
      noteActions = extraActions;
    } else {
      note = { tone: "good", text: "Round complete. Nicely done.", notes: [] };
    }
  } else {
    if (phase === "wrong") {
      noteActions = (
        <button type="button" className="og-btn" onClick={runner.tryAgain} data-testid="try-again">
          Try again
        </button>
      );
    } else if (phase === "done") {
      note = { ...note, tone: "good", text: runner.view.bubble.notes.length ? undefined : "Line complete." };
      noteActions = (
        <button type="button" className="og-btn" onClick={advance} data-testid="next-line">
          {lastOne ? "See results" : "Next line"}
        </button>
      );
    }
    const playing = phase === "user";
    controls.push(
      { id: "hint", label: "Hint", icon: "bulb", onClick: runner.hint, disabled: !playing, badge: runner.view.hintsUsed },
      { id: "restart", label: "Restart line", short: "Restart", icon: "restart", onClick: () => setRunId((r) => r + 1) },
      { id: "flip", label: "Flip board", short: "Flip", icon: "flip", onClick: () => setFlipped((f) => !f) },
      { id: "next", label: "Next line", short: "Next", icon: "next", onClick: advance, disabled: phase === "done" },
    );
  }
  if (controls.length === 0) {
    controls.push({ id: "flip", label: "Flip board", short: "Flip", icon: "flip", onClick: () => setFlipped((f) => !f) });
  }

  let overlay: ReactNode;
  if (finished && total > 0) {
    overlay = (
      <Overlay
        tone="celebrate"
        title="Round complete"
        subtitle={`${tally.lines} ${tally.lines === 1 ? "line" : "lines"} practised`}
        stats={[
          { label: "solid", value: String(tally.good) },
          { label: "hesitant", value: String(tally.hard) },
          { label: "mistakes", value: String(tally.again) },
        ]}
      >
        <button type="button" className="og-btn" onClick={() => void load(true)} data-testid="another-round">
          Another round
        </button>
        {extraActions}
      </Overlay>
    );
  }

  return (
    <PlayerShell
      mode={mode}
      lineKey={item ? { course: item.course.id, line: item.line.id } : undefined}
      title={item ? item.course.title : fallbackTitle}
      stats={total > 0 ? [{ id: "line", label: "Line", value: Math.min(idx + 1, total), of: ` of ${total}`, testId: "line-counter" }] : []}
      streakDays={streak.current}
      bar={<ProgressBar value={finished ? 1 : total ? (idx + runner.view.progress) / total : 0} label="Round progress" />}
      note={note}
      noteActions={noteActions}
      openingName={item ? runner.view.openingName : undefined}
      board={board}
      evalCp={item ? runner.view.evalCp : undefined}
      overlay={overlay}
      controls={controls}
      tabs={tabs}
      lanes={lanes?.(item?.line.id)}
    />
  );
}
