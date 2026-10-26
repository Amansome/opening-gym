import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getLine, trainableLines, userColor } from "../../lib/courses";
import type { Line, LineResult } from "../../lib/types";
import { progress } from "../../lib/progress";
import { pickRandom } from "../../lib/trainer";
import type { BoardColor } from "../board";
import { useLineRunner } from "./useLineRunner";
import { PlayerShell, ProgressBar, boardPropsFromRunner } from "./PlayerShell";
import type { ControlSpec } from "./ControlBar";
import { Overlay } from "./Celebration";
import type { ModeProps } from "./modeProps";

interface RunOver {
  value: number;
  best: number;
  record: boolean;
}

export function DrillMode({ course, cp, streak, refreshStreak, tabs, selectMode }: ModeProps) {
  const [line, setLine] = useState<Line | undefined>();
  const [runId, setRunId] = useState(0);
  const [count, setCount] = useState(0);
  const [over, setOver] = useState<RunOver | null>(null);
  const [flipped, setFlipped] = useState(false);
  const countRef = useRef(0);
  const lastId = useRef<string | undefined>(undefined);
  const bestBefore = useRef(0);
  const started = useRef(false);
  const cpRef = useRef(cp);
  cpRef.current = cp;

  const pickNext = useCallback(() => {
    const learned = (cpRef.current?.lines ?? [])
      .filter((l) => l.learned)
      .map((l) => getLine(course, l.lineId))
      .filter((l): l is Line => !!l && l.kind !== "warning");
    const pool = learned.length > 0 ? learned : trainableLines(course);
    const next = pickRandom(pool, (l) => l.id === lastId.current);
    lastId.current = next?.id;
    setLine(next);
    setRunId((r) => r + 1);
  }, [course]);

  const startRun = useCallback(() => {
    bestBefore.current = cpRef.current?.bestDrillStreak ?? 0;
    countRef.current = 0;
    setCount(0);
    setOver(null);
    pickNext();
  }, [pickNext]);

  useEffect(() => {
    if (cp && !started.current) {
      started.current = true;
      startRun();
    }
  }, [cp, startRun]);

  const onFinish = useCallback(
    async (result: LineResult, outcome: "completed" | "failed") => {
      await progress.recordLine(course, result);
      void refreshStreak();
      if (outcome === "completed") {
        countRef.current += 1;
        setCount(countRef.current);
        window.setTimeout(pickNext, 450);
        return;
      }
      const value = countRef.current;
      if (value > 0) await progress.recordScore({ mode: "drill", courseId: course.id, value });
      setOver({ value, best: Math.max(bestBefore.current, value), record: value > bestBefore.current });
    },
    [course, pickNext, refreshStreak],
  );

  const runner = useLineRunner({
    course,
    line,
    mode: "drill",
    runId,
    opponentDelayMs: 350,
    instructions: false,
    showNotes: false,
    arrowOnMistake: true,
    failDelayMs: 1400,
    frozen: !!over,
    onFinish,
  });

  const color: BoardColor = line ? userColor(course, line) : course.side === "black" ? "black" : "white";
  const orientation: BoardColor = flipped ? (color === "white" ? "black" : "white") : color;
  const note = line ? runner.view.bubble : { tone: "neutral" as const, text: cp ? "No lines to drill yet." : "Loading...", notes: [] };

  const controls: ControlSpec[] = [{ id: "flip", label: "Flip board", short: "Flip", icon: "flip", onClick: () => setFlipped((f) => !f) }];

  let overlay: ReactNode;
  if (over) {
    overlay = (
      <Overlay
        tone="over"
        title={over.value === 0 ? "Run over" : over.record ? "New personal best!" : "Run over"}
        subtitle={over.record ? `${over.value} in a row. That is your best yet.` : `Personal best: ${over.best}`}
        score={{ value: over.value, label: "in a row" }}
        stats={[{ label: "best", value: String(over.best) }]}
      >
        <button type="button" className="og-btn" onClick={startRun} data-testid="play-again">
          Play again
        </button>
        <button type="button" className="og-btn og-btn--ghost" onClick={() => selectMode("practice")}>
          Practice
        </button>
      </Overlay>
    );
  }

  const best = Math.max(cp?.bestDrillStreak ?? 0, over?.best ?? 0, count);
  return (
    <PlayerShell
      mode="drill"
      lineKey={line ? { course: course.id, line: line.id } : undefined}
      title={course.title}
      streakDays={streak.current}
      stats={[
        { id: "run", label: "In a row", value: count, testId: "drill-streak" },
        { id: "best", label: "Best", value: best },
      ]}
      bar={<ProgressBar value={runner.view.progress} />}
      note={note}
      openingName={runner.view.openingName}
      board={boardPropsFromRunner(runner, orientation, runner.onUserMove)}
      evalCp={line ? runner.view.evalCp : undefined}
      overlay={overlay}
      controls={controls}
      tabs={tabs}
    />
  );
}
