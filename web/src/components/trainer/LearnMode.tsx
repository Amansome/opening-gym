import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getLine, lineNodes, userColor } from "../../lib/courses";
import type { Line, LineResult } from "../../lib/types";
import { progress } from "../../lib/progress";
import { START_FEN } from "../../lib/trainer";
import type { BoardColor } from "../board";
import { useLineRunner } from "./useLineRunner";
import type { BubbleState } from "./useLineRunner";
import { PlayerShell, ProgressBar, boardPropsFromRunner } from "./PlayerShell";
import type { ControlSpec } from "./ControlBar";
import { Overlay } from "./Celebration";
import { Icon } from "./icons";
import { gradeSummary, streakMessage } from "./hooks";
import type { ModeProps } from "./modeProps";
import type { StreakInfo } from "../../lib/progress";

interface Celebration {
  result: LineResult;
  streak: StreakInfo;
  increased: boolean;
  hasNext: boolean;
}

interface Current {
  line: Line | undefined;
  welcome: boolean;
}

function moveLabel(ply: number, san: string): string {
  return `${Math.ceil(ply / 2)}${ply % 2 === 1 ? "." : "..."}${san}`;
}

export function LearnMode({ course, cp, streak, refreshStreak, tiles, selectMode }: ModeProps) {
  const [current, setCurrent] = useState<Current | null>(null);
  const [runId, setRunId] = useState(0);
  const [cel, setCel] = useState<Celebration | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const demoSeen = useRef(new Set<string>());
  const streakRef = useRef(streak);
  streakRef.current = streak;
  const cpRef = useRef(cp);
  cpRef.current = cp;

  const loadNext = useCallback(async () => {
    const [id, prog] = await Promise.all([progress.nextLearnLine(course), progress.getCourseProgress(course)]);
    let line = id ? getLine(course, id) : undefined;
    if (line?.kind === "warning" && demoSeen.current.has(line.id)) line = undefined;
    setCel(null);
    setDemoStep(0);
    setCurrent({ line, welcome: !!line && prog.learnedCount === 0 && line.kind !== "warning" });
    setRunId((r) => r + 1);
  }, [course]);

  useEffect(() => {
    void loadNext();
  }, [loadNext]);

  const line = current?.line;
  const isDemo = line?.kind === "warning";

  const onFinish = useCallback(
    async (result: LineResult) => {
      const before = streakRef.current;
      await progress.recordLine(course, result);
      const after = await refreshStreak();
      const nextId = await progress.nextLearnLine(course);
      const next = nextId ? getLine(course, nextId) : undefined;
      const hasNext = !!next && !(next.kind === "warning" && demoSeen.current.has(next.id));
      setCel({
        result,
        streak: after,
        increased: after.current > before.current || (!before.todayDone && after.todayDone),
        hasNext,
      });
    },
    [course, refreshStreak],
  );

  const runner = useLineRunner({
    course,
    line: isDemo ? undefined : line,
    mode: "learn",
    runId,
    opponentDelayMs: 350,
    instructions: true,
    showNotes: true,
    intro: current?.welcome ? course.summary : line && !isDemo ? `Next up: ${line.name}` : undefined,
    waitForStart: current?.welcome,
    arrowOnMistake: false,
    failDelayMs: 0,
    onFinish,
  });

  // ---- warning-line demo ----
  const demoNodes = useMemo(() => (isDemo && line ? lineNodes(course, line) : []), [course, line, isDemo]);
  const demoLast = demoNodes.length > 0 && demoStep >= demoNodes.length;
  const finishDemo = useCallback(async () => {
    if (!line) return;
    demoSeen.current.add(line.id);
    await progress.recordLine(course, {
      courseId: course.id,
      lineId: line.id,
      mode: "learn",
      moves: [],
      completed: true,
      mistakes: 0,
    });
    await loadNext();
  }, [course, line, loadNext]);

  // ---- derived view ----
  const color: BoardColor = line ? userColor(course, line) : course.side === "black" ? "black" : "white";
  const orientation: BoardColor = flipped ? (color === "white" ? "black" : "white") : color;
  const lineIndex = line ? course.lines.indexOf(line) : -1;

  let bubble: BubbleState = runner.view.bubble;
  let bubbleActions: ReactNode;
  let bubbleBadge: ReactNode;
  let openingName = runner.view.openingName;
  let barValue = runner.view.progress;
  let board = boardPropsFromRunner(runner, orientation, runner.onUserMove);
  let evalCp: number | null | undefined = line && !isDemo ? runner.view.evalCp : undefined;
  const controls: ControlSpec[] = [];

  if (!current) {
    bubble = { tone: "neutral", text: "Loading...", notes: [] };
  } else if (!line) {
    bubble = {
      tone: "good",
      text: "You have learned every line in this course. Practice keeps them fresh, and Drill and Time test your speed.",
      notes: [],
    };
    bubbleActions = cp?.unlocked.practice ? (
      <button type="button" className="og-btn" onClick={() => selectMode("practice")}>
        Practice
      </button>
    ) : undefined;
    board = { fen: START_FEN, orientation, movable: null };
    controls.push({ id: "flip", label: "Flip board", icon: "flip", onClick: () => setFlipped((f) => !f) });
  } else if (isDemo) {
    const node = demoStep > 0 ? demoNodes[demoStep - 1] : undefined;
    bubbleBadge = (
      <span className="og-badge">
        <Icon name="warning" size={13} /> Trap to avoid
      </span>
    );
    bubble = {
      tone: "neutral",
      text:
        demoStep === 0
          ? `${line.name}. Step through this line to see what goes wrong, so you can spot it at the board.`
          : node && !node.note
            ? `${node.ply % 2 === 1 ? "White" : "Black"} plays ${node.san}.`
            : undefined,
      notes: node && node.note ? [{ san: moveLabel(node.ply, node.san), text: node.note }] : [],
    };
    if (demoLast) {
      bubble = { ...bubble, prompt: "That is how the trap works. Remember the idea." };
      bubbleActions = (
        <button type="button" className="og-btn" onClick={() => void finishDemo()} data-testid="demo-done">
          Got it
        </button>
      );
    }
    openingName = [...demoNodes.slice(0, demoStep)].reverse().find((n) => n.opening)?.opening;
    barValue = demoNodes.length ? demoStep / demoNodes.length : 0;
    evalCp = node ? (node.eval ?? null) : undefined;
    board = {
      fen: node ? node.fen : START_FEN,
      orientation,
      movable: null,
      animate: true,
      lastMove: node ? { from: node.uci.slice(0, 2), to: node.uci.slice(2, 4) } : null,
    };
    controls.push(
      { id: "back", label: "Back", icon: "back", onClick: () => setDemoStep((s) => Math.max(0, s - 1)), disabled: demoStep === 0 },
      { id: "next", label: "Next", icon: "next", onClick: () => setDemoStep((s) => Math.min(demoNodes.length, s + 1)), disabled: demoLast },
      { id: "restart", label: "Restart", icon: "restart", onClick: () => setDemoStep(0) },
      { id: "flip", label: "Flip board", icon: "flip", onClick: () => setFlipped((f) => !f) },
    );
  } else {
    const phase = runner.view.phase;
    if (phase === "wrong") {
      bubbleActions = (
        <button type="button" className="og-btn" onClick={runner.tryAgain} data-testid="try-again">
          Try again
        </button>
      );
    } else if (phase === "ready") {
      bubbleActions = (
        <button type="button" className="og-btn" onClick={runner.start} data-testid="start-line">
          Let&apos;s go
        </button>
      );
    }
    const playing = phase === "user" && !cel;
    controls.push(
      { id: "hint", label: "Hint", icon: "bulb", onClick: runner.hint, disabled: !playing, badge: runner.view.hintsUsed },
      { id: "undo", label: "Undo", icon: "undo", onClick: runner.undo, disabled: !runner.view.canUndo || !(phase === "user" || phase === "wrong") || !!cel },
      { id: "restart", label: "Restart line", icon: "restart", onClick: () => setRunId((r) => r + 1), disabled: !!cel },
      { id: "flip", label: "Flip board", icon: "flip", onClick: () => setFlipped((f) => !f) },
    );
  }

  let overlay: ReactNode;
  if (cel && line) {
    const g = gradeSummary(cel.result.moves);
    const hints = cel.result.moves.filter((m) => m.usedHint).length;
    overlay = (
      <Overlay
        tone="celebrate"
        title={cel.hasNext ? "Line learned!" : "Course complete!"}
        subtitle={line.name}
        streak={
          cel.increased
            ? { value: cel.streak.current, label: cel.streak.current === 1 ? "day streak" : "day streak", message: streakMessage(cel.streak.current) }
            : undefined
        }
        stats={[
          { label: "moves", value: String(cel.result.moves.length) },
          { label: "mistakes", value: String(cel.result.mistakes) },
          { label: "hints", value: String(hints) },
          ...(g.again + g.hard === 0 ? [{ label: "clean", value: "100%" }] : []),
        ]}
      >
        {cel.hasNext && (
          <button type="button" className="og-btn" onClick={() => void loadNext()} data-testid="next-line">
            Next line
          </button>
        )}
        <button
          type="button"
          className={cel.hasNext ? "og-btn og-btn--ghost" : "og-btn"}
          onClick={() => selectMode("practice")}
          disabled={cp ? !cp.unlocked.practice : false}
          data-testid="go-practice"
        >
          Practice
        </button>
      </Overlay>
    );
  }

  return (
    <PlayerShell
      mode="learn"
      lineKey={line ? { course: course.id, line: line.id } : undefined}
      title={course.title}
      counter={lineIndex >= 0 ? `Line ${lineIndex + 1}/${course.lines.length}` : undefined}
      streakDays={streak.current}
      bar={<ProgressBar value={barValue} />}
      bubble={bubble}
      bubbleActions={bubbleActions}
      bubbleBadge={bubbleBadge}
      openingName={openingName}
      board={board}
      evalCp={evalCp}
      overlay={overlay}
      controls={controls}
      tiles={tiles}
    />
  );
}
