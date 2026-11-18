import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Chess } from "chess.js";
import { Board } from "../components/board";
import type { BoardMove } from "../components/board";
import { Button, LinkButton } from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";
import { useDocumentMeta } from "../components/ui/hooks";
import { courses as builtIn, getCourse } from "../lib/courses";
import { progress } from "../lib/progress";
import {
  countByCourse,
  countSet,
  filterPuzzles,
  hintSquare,
  loadPuzzles,
  pickNext,
  playMove,
  prompt,
  puzzleStore,
  solutionText,
  solverMoves,
  startState,
} from "../lib/puzzles";
import type { Puzzle, PuzzleLevelFilter, PuzzleProgress, PuzzleSide, PuzzleState } from "../lib/puzzles";
import "./puzzles.css";

const LEVEL_NAMES = { 1: "Easy", 2: "Medium", 3: "Hard" } as const;
const REPLY_MS = 520;
const SHOW_MS = 780;
const EMPTY_PROGRESS: PuzzleProgress = { records: {}, meta: { streak: 0, bestStreak: 0 } };

type Scope = "mine" | "all";

/** Graduate numerals; a zero is set in the display face (the Zero Numeral Rule). */
function Numeral({ value }: { value: number }) {
  return <span className="pz-num" data-zero={String(value).startsWith("0") || undefined}>{value}</span>;
}

function courseTitle(id: string): string {
  return getCourse(id)?.title ?? id;
}

// ---------------------------------------------------------------------------------------------------------------------
// One puzzle
// ---------------------------------------------------------------------------------------------------------------------

type Phase = "play" | "wrong" | "solved" | "shown";

interface PlayerProps {
  puzzle: Puzzle;
  streak: number;
  bestStreak: number;
  setSolved: number;
  setTotal: number;
  preferCourse: string | null;
  onResult: (id: string, r: "solved-clean" | "solved" | "failed") => void;
  onNext: () => void;
}

function PuzzlePlayer({ puzzle, streak, bestStreak, setSolved, setTotal, preferCourse, onResult, onNext }: PlayerProps) {
  const [ps, setPs] = useState<PuzzleState>(() => startState(puzzle));
  const [phase, setPhase] = useState<Phase>("play");
  const [wrong, setWrong] = useState<{ fen: string; to: string } | null>(null);
  const [replying, setReplying] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const failed = useRef(false);
  const helped = useRef(false);
  const timers = useRef<number[]>([]);
  const nextRef = useRef<HTMLButtonElement>(null);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // keyboard users land on the next action once a puzzle is over
  useEffect(() => {
    if (phase === "solved" || phase === "shown") nextRef.current?.focus();
  }, [phase]);

  const markFailed = () => {
    if (failed.current) return;
    failed.current = true;
    onResult(puzzle.id, "failed");
  };

  const onMove = useCallback(
    (m: BoardMove) => {
      if (phase !== "play" || replying) return;
      const r = playMove(puzzle, ps, m);
      if (r.kind === "wrong") {
        let fen = ps.fen;
        try {
          const c = new Chess(ps.fen);
          c.move({ from: m.from, to: m.to, promotion: m.promotion });
          fen = c.fen();
        } catch {
          /* keep the position */
        }
        setWrong({ fen, to: m.to });
        setPhase("wrong");
        setHinted(false);
        markFailed();
        return;
      }
      setHinted(false);
      if (r.kind === "solved") {
        setPs(r.state);
        setPhase("solved");
        onResult(puzzle.id, failed.current || helped.current ? "solved" : "solved-clean");
        return;
      }
      // correct, and the opponent answers on its own
      setPs(r.afterUser);
      setReplying(true);
      later(() => {
        setPs(r.state);
        setReplying(false);
      }, REPLY_MS);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, replying, ps, puzzle],
  );

  const retry = () => {
    setWrong(null);
    setPhase("play");
    setResetKey((k) => k + 1);
  };

  const showSolution = () => {
    markFailed();
    helped.current = true;
    setWrong(null);
    setHinted(false);
    setPhase("shown");
    setResetKey((k) => k + 1);
    const play = (state: PuzzleState) => {
      const u = puzzle.moves[state.step];
      if (!u) return;
      try {
        const c = new Chess(state.fen);
        c.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || undefined });
        const next: PuzzleState = { fen: c.fen(), step: state.step + 1, solved: state.step + 1 >= puzzle.moves.length, last: { from: u.slice(0, 2), to: u.slice(2, 4) } };
        later(() => {
          setPs(next);
          play(next);
        }, SHOW_MS);
      } catch {
        /* stop */
      }
    };
    play(ps);
  };

  const hint = () => {
    helped.current = true;
    setHinted(true);
  };

  const over = phase === "solved" || phase === "shown";
  const fen = phase === "wrong" && wrong ? wrong.fen : ps.fen;
  const total = solverMoves(puzzle);
  const done = Math.ceil(ps.step / 2);
  const hSq = hinted && phase === "play" && !replying ? hintSquare(puzzle, ps) : null;
  const nextUci = phase === "shown" ? puzzle.moves[ps.step] : null;
  const mark =
    phase === "wrong" && wrong
      ? ({ square: wrong.to, kind: "wrong" } as const)
      : phase === "solved" && ps.last
        ? ({ square: ps.last.to, kind: "correct" } as const)
        : null;
  const source = puzzle.sources.find((s) => s.courseId === preferCourse) ?? puzzle.sources[0];
  const others = puzzle.sources.length - 1;

  const tone = phase === "wrong" ? "wrong" : phase === "solved" ? "solved" : phase === "shown" || hinted ? "hint" : "play";
  const noteText =
    phase === "wrong"
      ? "That move does not do the job. Try again, or look at the answer."
      : phase === "solved"
        ? `${puzzle.label}. ${solutionText(puzzle)}`
        : phase === "shown"
          ? ps.step >= puzzle.moves.length
            ? solutionText(puzzle)
            : "Watch the solution play out."
          : hinted
            ? "Move the highlighted piece."
            : total > 1
              ? `A forcing line: find ${total} moves in a row.`
              : "Find the one move that does it.";
  const noteLabel = phase === "wrong" ? "Not quite" : phase === "solved" ? "Solved" : phase === "shown" ? "Solution" : hinted ? "Hint" : replying ? "Good move" : `Move ${Math.min(done + 1, total)} of ${total}`;

  return (
    <div className="pz-stage" data-testid="puzzle" data-puzzle-id={puzzle.id} data-phase={phase}>
      <div className="pz-boardcol">
        <h2 className="pz-prompt" data-testid="puzzle-prompt">
          <span className="pz-sidedot" data-side={puzzle.turn} aria-hidden="true" />
          {prompt(puzzle)}
        </h2>
        <Board
          fen={fen}
          orientation={puzzle.turn}
          movable={phase === "play" && !replying ? puzzle.turn : null}
          lastMove={phase === "wrong" ? null : ps.last}
          mark={mark}
          hintSquare={hSq}
          arrows={nextUci ? [{ from: nextUci.slice(0, 2), to: nextUci.slice(2, 4), kind: "correct" }] : []}
          resetKey={resetKey}
          onMove={onMove}
          ariaLabel={`Puzzle board, ${puzzle.turn} to move`}
        />
      </div>

      <div className="pz-panel" data-tone={tone}>
        <div className="pz-score" aria-label="Puzzle scoreboard">
          <div className="pz-score__cell" data-testid="puzzle-streak">
            <span className="pz-score__label">Streak</span>
            <Numeral value={streak} />
          </div>
          <div className="pz-score__cell">
            <span className="pz-score__label">Best</span>
            <Numeral value={bestStreak} />
          </div>
          <div className="pz-score__cell pz-score__cell--end">
            <span className="pz-score__label">Solved</span>
            <span className="pz-score__ofrow">
              <Numeral value={setSolved} />
              <span className="pz-score__of">of {setTotal}</span>
            </span>
          </div>
        </div>

        <div className="pz-note" data-tone={tone}>
          <div className="pz-note__line" />
          <div className="pz-note__body">
            <p className="pz-note__state">
              <span className="pz-disc" aria-hidden="true">
                {phase === "wrong" ? <Icon name="x" size={14} /> : tone === "solved" ? <Icon name="check" size={14} /> : tone === "hint" ? <Icon name="eye" size={14} /> : <Icon name="target" size={14} />}
              </span>
              {noteLabel}
            </p>
            <p className="pz-note__text" data-testid="puzzle-note">{noteText}</p>
            <p className="pz-tags">
              <span className="pz-tag">{puzzle.label}</span>
              <span className="pz-tag pz-tag--level" data-level={puzzle.level}>{LEVEL_NAMES[puzzle.level]}</span>
            </p>
            {over && source ? (
              <p className="pz-source">
                {puzzle.via ? `If the opponent plays ${puzzle.via} in ` : "From "}
                <Link to={`/opening/${source.courseId}?line=${encodeURIComponent(source.lineId)}`} data-testid="puzzle-source">
                  {courseTitle(source.courseId)}: {source.lineName}
                </Link>
                {others > 0 ? <span className="muted"> and {others} more {others === 1 ? "line" : "lines"}</span> : null}
              </p>
            ) : null}
          </div>
        </div>

        <div className="pz-actions">
          {phase === "wrong" ? (
            <>
              <Button variant="primary" onClick={retry} data-testid="puzzle-retry">Retry</Button>
              <Button onClick={showSolution} data-testid="puzzle-show">Show solution</Button>
            </>
          ) : over ? (
            <>
              <button ref={nextRef} type="button" className="btn" data-variant="primary" onClick={onNext} data-testid="puzzle-next">
                Next puzzle <Icon name="arrow" size={18} />
              </button>
              {source ? (
                <LinkButton to={`/opening/${source.courseId}?line=${encodeURIComponent(source.lineId)}`}>Train this line</LinkButton>
              ) : null}
            </>
          ) : (
            <>
              <Button onClick={hint} disabled={replying || hinted} data-testid="puzzle-hint">
                <Icon name="eye" size={18} /> Hint
              </Button>
              <Button onClick={showSolution} disabled={replying} data-testid="puzzle-show">Show solution</Button>
              <Button variant="ghost" onClick={onNext} data-testid="puzzle-skip">Skip</Button>
            </>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {phase === "wrong" ? "Not quite. Retry or show the solution." : phase === "solved" ? `Solved. ${puzzle.label}.` : ""}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------
// The page: choose a set, then play
// ---------------------------------------------------------------------------------------------------------------------

export default function Puzzles() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [all, setAll] = useState<Puzzle[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [prog, setProg] = useState<PuzzleProgress>(EMPTY_PROGRESS);
  const [progLoaded, setProgLoaded] = useState(false);
  const [started, setStarted] = useState<string[] | null>(null);
  const [scope, setScope] = useState<Scope | null>(null);
  const [side, setSide] = useState<PuzzleSide>("all");
  const [level, setLevel] = useState<PuzzleLevelFilter>("all");
  const [currentId, setCurrentId] = useState<string | null>(null);

  const course = courseId ? getCourse(courseId) : undefined;
  useDocumentMeta({
    title: course ? `Puzzles from the ${course.title}` : "Opening puzzles",
    description: "Tactics found in the openings you study, mined with an engine. Free and offline.",
  });

  useEffect(() => {
    let alive = true;
    setError(false);
    loadPuzzles().then(
      (p) => alive && setAll(p),
      () => alive && setError(true),
    );
    return () => {
      alive = false;
    };
  }, [attempt]);

  useEffect(() => {
    let alive = true;
    puzzleStore.load().then((p) => {
      if (alive) {
        setProg(p);
        setProgLoaded(true);
      }
    });
    progress.startedCourses().then(
      (s) => alive && setStarted(s),
      () => alive && setStarted([]),
    );
    return () => {
      alive = false;
    };
  }, []);

  // default scope: my openings when there are any, else everything
  const effectiveScope: Scope = scope ?? (started && started.length > 0 ? "mine" : "all");
  const byCourse = useMemo(() => (all ? countByCourse(all) : {}), [all]);
  const courseOptions = useMemo(
    () => builtIn.filter((c) => (byCourse[c.id] ?? 0) > 0).map((c) => ({ id: c.id, title: c.title, n: byCourse[c.id] })),
    [byCourse],
  );

  const courseIds = courseId ? [courseId] : effectiveScope === "mine" ? (started ?? []) : null;
  const set = useMemo(
    () => (all && started !== null ? filterPuzzles(all, { courseIds, side, level }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [all, started, courseId, effectiveScope, side, level],
  );
  const counts = useMemo(() => countSet(set, prog.records), [set, prog.records]);

  // keep the current puzzle while it is still in the set; otherwise choose the next one
  const ready = all !== null && started !== null && progLoaded;
  const current = set.find((p) => p.id === currentId) ?? null;
  useEffect(() => {
    if (!ready) return;
    if (!current) setCurrentId(pickNext(set, prog.records, null)?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, set, current]);

  const next = useCallback(() => {
    setCurrentId(pickNext(set, prog.records, currentId)?.id ?? null);
  }, [set, prog.records, currentId]);

  const onResult = useCallback((id: string, r: "solved-clean" | "solved" | "failed") => {
    const done = r === "failed" ? puzzleStore.recordFailed(id) : puzzleStore.recordSolved(id, r === "solved-clean");
    done.then(setProg);
  }, []);

  const clearFilters = () => {
    setSide("all");
    setLevel("all");
    setScope("all");
    if (courseId) navigate("/puzzles");
  };

  const pickScope = (s: Scope) => {
    setScope(s);
    if (courseId) navigate("/puzzles");
  };

  const filtersActive = side !== "all" || level !== "all" || !!courseId || effectiveScope !== "all";
  const mineEmpty = !courseId && effectiveScope === "mine" && (started?.length ?? 0) === 0;

  return (
    <div className="container pz">
      <header className="page-head pz-head">
        <h1>Puzzles</h1>
        <p className="page-lead">
          Tactics from real lines in the openings you study: spring the trap in the position where it happens.
        </p>
      </header>

      <div className="pz-filters" role="group" aria-label="Choose puzzles">
        <div className="seg" role="group" aria-label="Which openings">
          <button type="button" aria-pressed={!courseId && effectiveScope === "mine"} onClick={() => pickScope("mine")}>My openings</button>
          <button type="button" aria-pressed={!courseId && effectiveScope === "all"} onClick={() => pickScope("all")}>All</button>
        </div>
        <label className="select-wrap">
          <span className="sr-only">Opening</span>
          <select
            value={courseId ?? ""}
            onChange={(e) => (e.target.value ? navigate(`/puzzles/${e.target.value}`) : navigate("/puzzles"))}
          >
            <option value="">Any opening</option>
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.title} ({c.n})</option>
            ))}
          </select>
        </label>
        <label className="select-wrap">
          <span className="sr-only">Side to move</span>
          <select value={side} onChange={(e) => setSide(e.target.value as PuzzleSide)}>
            <option value="all">Either side</option>
            <option value="white">White to move</option>
            <option value="black">Black to move</option>
          </select>
        </label>
        <label className="select-wrap">
          <span className="sr-only">Difficulty</span>
          <select value={String(level)} onChange={(e) => setLevel(e.target.value === "all" ? "all" : (Number(e.target.value) as 1 | 2 | 3))}>
            <option value="all">Any difficulty</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </label>
        {ready ? (
          <p className="pz-count" aria-live="polite">
            <Numeral value={set.length} /> <span>{set.length === 1 ? "puzzle" : "puzzles"}</span>
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="pz-state" role="alert">
          <h2>The puzzles did not load</h2>
          <p>The puzzle file could not be read. If you are offline, open this page once while connected so it can be saved, then try again.</p>
          <Button variant="primary" onClick={() => setAttempt((a) => a + 1)}>Try again</Button>
        </div>
      ) : !ready ? (
        <div className="pz-state" role="status" aria-live="polite" data-testid="puzzles-loading">
          <h2>Setting up the board</h2>
          <p>Loading puzzles…</p>
        </div>
      ) : mineEmpty ? (
        <div className="pz-state" data-testid="puzzles-empty">
          <h2>No openings started yet</h2>
          <p>My openings fills up once you train a line. Start one, or try the puzzles from every opening.</p>
          <div className="pz-state__actions">
            <LinkButton to="/openings" variant="primary">Pick an opening</LinkButton>
            <Button onClick={() => pickScope("all")}>Puzzle from all openings</Button>
          </div>
        </div>
      ) : set.length === 0 ? (
        <div className="pz-state" data-testid="puzzles-empty">
          <h2>No puzzles match</h2>
          <p>
            {courseId && !course
              ? "That opening does not exist."
              : "Nothing in this opening or filter has a clear winning tactic yet. Widen the filters or try another opening."}
          </p>
          <div className="pz-state__actions">
            {filtersActive ? <Button variant="primary" onClick={clearFilters}>Show all puzzles</Button> : null}
          </div>
        </div>
      ) : current ? (
        <PuzzlePlayer
          key={current.id}
          puzzle={current}
          streak={prog.meta.streak}
          bestStreak={prog.meta.bestStreak}
          setSolved={counts.solved}
          setTotal={counts.total}
          preferCourse={courseId ?? null}
          onResult={onResult}
          onNext={next}
        />
      ) : null}
    </div>
  );
}
