import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getLine, trainableLines, userColor } from "../../lib/courses";
import type { Line, LineResult } from "../../lib/types";
import { progress } from "../../lib/progress";
import { TIME_MAX_SECONDS, TIME_START_SECONDS, pickRandom, timeBonusSeconds } from "../../lib/trainer";
import type { BoardColor } from "../board";
import { useLineRunner } from "./useLineRunner";
import { PlayerShell, ProgressBar, boardPropsFromRunner } from "./PlayerShell";
import type { ControlSpec } from "./ControlBar";
import { Overlay } from "./Celebration";
import type { ModeProps } from "./modeProps";

type Phase = "ready" | "playing" | "over";

export function TimeMode({ course, cp, streak, refreshStreak, tiles, selectMode }: ModeProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [line, setLine] = useState<Line | undefined>();
  const [runId, setRunId] = useState(0);
  const [remaining, setRemaining] = useState(TIME_START_SECONDS);
  const [done, setDone] = useState(0);
  const [bonus, setBonus] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<{ value: number; best: number; record: boolean } | null>(null);
  const phaseRef = useRef<Phase>("ready");
  const remainingRef = useRef(TIME_START_SECONDS * 1000);
  const doneRef = useRef(0);
  const lastId = useRef<string | undefined>(undefined);
  const bestBefore = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const cpRef = useRef(cp);
  cpRef.current = cp;

  const stopTimer = useCallback(() => {
    if (timer.current !== undefined) window.clearInterval(timer.current);
    timer.current = undefined;
  }, []);
  useEffect(() => stopTimer, [stopTimer]);

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

  const endRun = useCallback(async () => {
    if (phaseRef.current !== "playing") return;
    phaseRef.current = "over";
    stopTimer();
    setPhase("over");
    setRemaining(0);
    const value = doneRef.current;
    if (value > 0) await progress.recordScore({ mode: "time", courseId: course.id, value });
    setResult({ value, best: Math.max(bestBefore.current, value), record: value > bestBefore.current });
  }, [course.id, stopTimer]);

  const startRun = useCallback(() => {
    stopTimer();
    bestBefore.current = cpRef.current?.bestTime ?? 0;
    remainingRef.current = TIME_START_SECONDS * 1000;
    doneRef.current = 0;
    setRemaining(TIME_START_SECONDS);
    setDone(0);
    setResult(null);
    setBonus(null);
    phaseRef.current = "playing";
    setPhase("playing");
    pickNext();
    let last = performance.now();
    timer.current = window.setInterval(() => {
      const now = performance.now();
      remainingRef.current -= now - last;
      last = now;
      if (remainingRef.current <= 0) void endRun();
      else setRemaining(remainingRef.current / 1000);
    }, 100);
  }, [endRun, pickNext, stopTimer]);

  const onFinish = useCallback(
    async (res: LineResult, outcome: "completed" | "failed") => {
      if (phaseRef.current !== "playing") return; // time ran out mid-line: nothing to record
      if (outcome === "completed") {
        const add = timeBonusSeconds(doneRef.current);
        remainingRef.current = Math.min(TIME_MAX_SECONDS * 1000, remainingRef.current + add * 1000);
        doneRef.current += 1;
        setDone(doneRef.current);
        setBonus(`+${add % 1 === 0 ? add : add.toFixed(1)}s`);
        window.setTimeout(() => setBonus(null), 1200);
      }
      pickNext();
      await progress.recordLine(course, res);
      void refreshStreak();
    },
    [course, pickNext, refreshStreak],
  );

  const runner = useLineRunner({
    course,
    line: phase === "ready" ? undefined : line,
    mode: "time",
    runId,
    opponentDelayMs: 0,
    instructions: false,
    showNotes: false,
    arrowOnMistake: true,
    failDelayMs: 1200,
    frozen: phase !== "playing",
    onFinish,
  });

  const color: BoardColor = line ? userColor(course, line) : course.side === "black" ? "black" : "white";
  const orientation: BoardColor = flipped ? (color === "white" ? "black" : "white") : color;
  const controls: ControlSpec[] = [{ id: "flip", label: "Flip board", icon: "flip", onClick: () => setFlipped((f) => !f) }];

  let overlay: ReactNode;
  if (phase === "ready") {
    overlay = (
      <Overlay
        title="Beat the clock"
        subtitle={`${TIME_START_SECONDS} seconds. Finish lines to add time, but every line adds a little less than the one before. One slip shows the right move and skips the line.`}
      >
        <button type="button" className="og-btn" onClick={startRun} data-testid="start-time">
          Start
        </button>
      </Overlay>
    );
  } else if (phase === "over" && result) {
    overlay = (
      <Overlay
        tone={result.record ? "celebrate" : "over"}
        title={result.record ? "New personal best!" : "Time's up!"}
        subtitle={`${result.value} ${result.value === 1 ? "line" : "lines"} completed. Personal best: ${result.best}`}
        stats={[
          { label: "lines", value: String(result.value) },
          { label: "best", value: String(result.best) },
        ]}
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

  const bubble = phase === "playing" && line ? runner.view.bubble : { tone: "neutral" as const, text: phase === "over" ? "Time is up." : "Ready when you are.", notes: [] };

  return (
    <PlayerShell
      mode="time"
      lineKey={line && phase !== "ready" ? { course: course.id, line: line.id } : undefined}
      title={course.title}
      streakDays={streak.current}
      bar={
        <div className="og-clock">
          <div className="og-clock__row">
            <span className="og-clock__time" data-testid="clock">
              {remaining.toFixed(1)}s{bonus && <span style={{ color: "var(--success)", fontSize: "0.9rem", marginLeft: 8 }}>{bonus}</span>}
            </span>
            <span className="og-clock__score" data-testid="time-score">
              {done} {done === 1 ? "line" : "lines"}
            </span>
          </div>
          <ProgressBar value={remaining / TIME_START_SECONDS} danger={remaining < 10} label="Time left" />
        </div>
      }
      bubble={bubble}
      openingName={phase === "playing" ? runner.view.openingName : undefined}
      board={boardPropsFromRunner(runner, orientation, runner.onUserMove)}
      overlay={overlay}
      controls={controls}
      tiles={tiles}
    />
  );
}
