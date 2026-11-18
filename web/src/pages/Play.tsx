import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Board } from "../components/board";
import type { BoardMove } from "../components/board";
import { Icon } from "../components/ui/Icon";
import { useDocumentMeta } from "../components/ui/hooks";
import { getCourse } from "../lib/courses";
import { engineSupported, openingName } from "../lib/engine";
import { PlayEngine } from "../lib/engine/play";
import {
  LEVELS,
  START_FEN,
  bookName,
  buildBook,
  canTakeback,
  chooseBotMove,
  colorOfTurn,
  currentFen,
  fensOf,
  inBook,
  isValidFen,
  judgeUserMove,
  lastMoveOf,
  levelById,
  loadLevel,
  makeMove,
  newPlay,
  other,
  outcomeDetail,
  outcomeHeadline,
  outcomeOf,
  pgnOf,
  resign,
  saveLevel,
  stripEco,
  takeback,
  turnOf,
  uciOf,
} from "../lib/play";
import type { Book, BookVerdict, Color, LevelId, Outcome, PlayState } from "../lib/play";
import { copyText } from "../lib/play/clipboard";
import "./play.css";

// ---- where the page starts, from the URL --------------------------------------------------------------------------

interface Start {
  /** the game begins at once; false shows the setup card (free game, or a course played from both sides) */
  auto: boolean;
  startFen: string;
  user: Color;
  courseId?: string;
  /** a problem with the link, shown gently above the board */
  warning?: string;
}

function readStart(params: URLSearchParams): Start {
  const courseId = params.get("course") ?? undefined;
  const course = courseId ? getCourse(courseId) : undefined;
  const fenParam = params.get("fen");
  const sideParam = params.get("side");
  const side: Color | null = sideParam === "white" || sideParam === "black" ? sideParam : null;
  let warning: string | undefined;
  if (courseId && !course) warning = "That course was not found, so this is a free game.";

  if (fenParam) {
    if (isValidFen(fenParam)) {
      // Without a side in the link you play whoever is to move; in a course, the course's side.
      const courseSide = course && course.side !== "both" ? course.side : null;
      return { auto: true, startFen: fenParam, user: side ?? courseSide ?? colorOfTurn(fenParam), courseId: course?.id, warning };
    }
    warning = "That position is not valid, so this is a fresh game.";
  }
  if (course) {
    const user: Color | null = side ?? (course.side === "both" ? null : course.side);
    return { auto: user !== null, startFen: START_FEN, user: user ?? "white", courseId: course.id, warning };
  }
  return { auto: false, startFen: START_FEN, user: side ?? "white", warning };
}

// ---- notices: gentle, never blocking ------------------------------------------------------------------------------

function noticeForUserMove(verdict: BookVerdict): string | null {
  if (verdict.kind === "off") {
    return `That is not the course move: the course plays ${verdict.expected[0]} here. Nothing is blocked. You are out of book now, so the bot plays on like a real opponent.`;
  }
  if (verdict.kind === "fine") {
    return `A fine move, though the course plays ${verdict.expected[0]} here. You are out of book now, so the bot plays on like a real opponent.`;
  }
  return null;
}

const LINE_DONE = "That is the end of the course line. From here the bot plays on like a real opponent.";

// ---- small pieces -------------------------------------------------------------------------------------------------

function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="pl-seg">
      <legend>{legend}</legend>
      <div className="pl-seg-row">
        {options.map((o) => (
          <label key={o.value} className="pl-seg-opt">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LevelPicker({ level, onChange, note }: { level: LevelId; onChange: (l: LevelId) => void; note?: string }) {
  const current = levelById(level);
  return (
    <div>
      <Segmented legend="Strength" name="pl-level" value={level} options={LEVELS.map((l) => ({ value: l.id, label: l.label }))} onChange={onChange} />
      <p className="pl-blurb">{current.blurb}</p>
      {note && <p className="pl-blurb pl-blurb-note">{note}</p>}
    </div>
  );
}

function Card({ title, lane, children, className }: { title: string; lane: "blue" | "green" | "red" | "chalk" | "yellow"; children: ReactNode; className?: string }) {
  return (
    <section className={`pl-card${className ? " " + className : ""}`} data-lane={lane} aria-label={title}>
      <div className="pl-card-head">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MoveList({ state }: { state: PlayState }) {
  const rows = useMemo(() => {
    const blackFirst = state.startFen.split(" ")[1] === "b";
    const firstNo = Number(state.startFen.split(" ")[5]) || 1;
    const out: { no: number; white?: string; black?: string }[] = [];
    state.moves.forEach((m, i) => {
      const isBlack = (i % 2 === 1) !== blackFirst;
      const no = firstNo + Math.floor((i + (blackFirst ? 1 : 0)) / 2);
      const row = out[out.length - 1];
      if (isBlack && row && row.no === no && row.white !== undefined) row.black = m.san;
      else out.push(isBlack ? { no, black: m.san } : { no, white: m.san });
    });
    return out;
  }, [state]);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.moves.length]);
  if (rows.length === 0) return <p className="pl-empty">No moves yet.</p>;
  return (
    <div className="pl-moves" ref={box} tabIndex={0} role="region" aria-label="Moves so far">
      <ol>
        {rows.map((r, i) => {
          const last = i === rows.length - 1;
          return (
            <li key={r.no + (r.white ? "w" : "b")}>
              <span className="pl-move-no">{r.no}.</span>
              <span className="pl-move" aria-current={last && r.black === undefined ? "true" : undefined}>
                {r.white ?? "…"}
              </span>
              <span className="pl-move" aria-current={last && r.black !== undefined ? "true" : undefined}>
                {r.black ?? ""}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ResultCard({
  outcome,
  state,
  pgn,
  courseId,
  onNew,
  newLabel,
}: {
  outcome: Outcome;
  state: PlayState;
  pgn: string;
  courseId?: string;
  onNew: () => void;
  newLabel: string;
}) {
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const ref = useRef<HTMLElement>(null);
  // On a phone the result sits below the board: bring it into view.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.scrollIntoView !== "function") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, []);
  const lane = outcome.winner === null ? "chalk" : outcome.winner === state.user ? "green" : "red";
  const copy = async () => {
    setCopied((await copyText(pgn)) ? "ok" : "fail");
  };
  return (
    <section ref={ref} className="pl-card pl-result" data-lane={lane} aria-label="Game result" data-testid="result">
      <h2 className="pl-result-title">{outcomeHeadline(outcome, state.user)}</h2>
      <p className="pl-result-detail">{outcomeDetail(outcome, state.user)}</p>
      <div className="pl-btnrow">
        <button type="button" className="btn" data-variant="primary" onClick={onNew} data-testid="new-game">
          {newLabel}
        </button>
        <Link className="btn" to={`/analysis?pgn=${encodeURIComponent(pgn)}`} data-testid="analyse-game">
          Analyse this game
        </Link>
        <button type="button" className="btn" onClick={() => void copy()}>
          Copy PGN
        </button>
        {courseId && (
          <Link className="btn" data-variant="ghost" to={`/opening/${courseId}`}>
            Back to course
          </Link>
        )}
      </div>
      <p className="pl-copy-status" role="status">
        {copied === "ok" ? "PGN copied." : copied === "fail" ? "Could not copy. Use Analyse this game instead." : ""}
      </p>
    </section>
  );
}

// ---- the game -----------------------------------------------------------------------------------------------------

function PlayGame() {
  const [params] = useSearchParams();
  const start = useMemo(() => readStart(params), [params]);
  const course = start.courseId ? getCourse(start.courseId) : undefined;
  const book: Book | undefined = useMemo(() => (course ? buildBook(course) : undefined), [course]);

  const [state, setState] = useState<PlayState | null>(() => (start.auto ? newPlay(start.startFen, start.user) : null));
  const [pickSide, setPickSide] = useState<Color | "random">(start.user);
  const [levelId, setLevelId] = useState<LevelId>(loadLevel);
  const [flipped, setFlipped] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [engineLoading, setEngineLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const [confirmResign, setConfirmResign] = useState(false);

  const level = levelById(levelId);
  const levelRef = useRef(level);
  levelRef.current = level;

  useDocumentMeta({
    title: "Play it out",
    description: "Play your opening against a free chess bot that follows the course, then plays on like a real opponent. Runs in your browser.",
  });

  // The engine: created on first use, one worker, thrown away when leaving the page.
  const botRef = useRef<PlayEngine | null>(null);
  const getBot = useCallback(() => {
    if (!botRef.current) {
      const e = new PlayEngine();
      e.subscribe(() => setEngineLoading(e.getStatus().status === "loading"));
      botRef.current = e;
    }
    return botRef.current;
  }, []);
  useEffect(
    () => () => {
      botRef.current?.dispose();
      botRef.current = null;
    },
    [],
  );

  // Warm the engine up shortly after the game starts, so the first out-of-book reply is quick.
  const playing = state !== null;
  useEffect(() => {
    if (!playing || !engineSupported()) return;
    const t = setTimeout(() => void getBot().init().catch(() => {}), 1500);
    return () => clearTimeout(t);
  }, [playing, getBot]);

  const fen = state ? currentFen(state) : start.startFen;
  const outcome = state ? outcomeOf(state) : null;
  const turn = state ? turnOf(state) : colorOfTurn(fen);
  const botToMove = !!state && !outcome && turn !== state.user;
  const ply = state?.moves.length ?? 0;
  const resigned = state?.resigned ?? null;

  // The bot's turn: the course while in book, Stockfish afterwards.
  useEffect(() => {
    if (!state || !botToMove) {
      setThinking(false);
      return;
    }
    let alive = true;
    const t0 = Date.now();
    setThinking(true);
    setEngineError(null);
    void (async () => {
      try {
        if (!inBook(book, fen) && !engineSupported()) throw new Error("This browser cannot run the engine (it needs Web Workers and WebAssembly).");
        const choice = await chooseBotMove({ book, fen, level: levelRef.current, engine: getBot() });
        if (!alive || !choice) return;
        // A short beat so the reply reads as a move, not a jump.
        const beat = Math.max(0, (choice.source === "book" ? 650 : 400) - (Date.now() - t0));
        await new Promise((r) => setTimeout(r, beat));
        if (!alive) return;
        setState((s) => {
          if (!s || currentFen(s) !== fen) return s;
          const next = makeMove(s, { from: choice.uci.slice(0, 2), to: choice.uci.slice(2, 4), promotion: choice.uci[4] }, choice.source);
          if (next && choice.source === "book" && !inBook(book, currentFen(next)) && !outcomeOf(next)) setNotice(LINE_DONE);
          return next ?? s;
        });
        setThinking(false);
      } catch (e) {
        if (!alive) return;
        setThinking(false);
        setEngineError(e instanceof Error ? e.message : "The engine stopped.");
      }
    })();
    return () => {
      alive = false;
      botRef.current?.stop();
    };
    // `state` itself changes on every move; the position, side and retry counter are what restart the bot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, botToMove, resigned, retry, book, getBot]);

  const onMove = useCallback(
    (m: BoardMove) => {
      if (!state || outcome || turn !== state.user) return;
      const next = makeMove(state, m, "user");
      if (!next) return;
      const verdict = judgeUserMove(book, fen, uciOf(m));
      let text = noticeForUserMove(verdict);
      if (!text && book && verdict.kind === "book" && !inBook(book, currentFen(next)) && !outcomeOf(next)) text = LINE_DONE;
      setNotice(text);
      setConfirmResign(false);
      setState(next);
    },
    [state, outcome, turn, book, fen],
  );

  const begin = (side: Color | "random") => {
    const user: Color = side === "random" ? (Math.random() < 0.5 ? "white" : "black") : side;
    setState(newPlay(start.startFen, user));
    setNotice(null);
    setFlipped(false);
    setEngineError(null);
    setConfirmResign(false);
  };

  const newGame = () => {
    if (state && !start.auto) {
      // A free game goes back to the setup card, where the side can be chosen again.
      botRef.current?.stop();
      setState(null);
      setNotice(null);
      setFlipped(false);
      setEngineError(null);
      setConfirmResign(false);
      return;
    }
    begin(state?.user ?? start.user);
  };

  const doTakeback = () => {
    if (!state) return;
    botRef.current?.stop();
    setState(takeback(state));
    setNotice(null);
    setEngineError(null);
    setConfirmResign(false);
  };

  const changeLevel = (id: LevelId) => {
    setLevelId(id);
    saveLevel(id);
  };

  // ---- derived display
  const user = state?.user ?? (pickSide === "random" ? "white" : pickSide);
  const orientation: Color = state ? (flipped ? other(state.user) : state.user) : pickSide === "random" ? "white" : pickSide;
  const userToMove = !!state && !outcome && turn === state.user && !engineError;
  const bookNow = !!book && !!state && inBook(book, fen);
  const named = useMemo(() => {
    const fens = state ? fensOf(state) : [start.startFen];
    for (let i = fens.length - 1; i >= 0; i--) {
      const n = openingName(fens[i]);
      if (n) return stripEco(n);
    }
    return undefined;
  }, [state, start.startFen]);
  const pgn = useMemo(() => (state && outcome ? pgnOf(state, level) : ""), [state, outcome, level]);

  let status: ReactNode;
  if (!state) status = "Pick a side to start.";
  else if (outcome) status = "Game over.";
  else if (engineError) status = "The bot cannot move right now.";
  else if (thinking) status = engineLoading ? "Loading the engine for the first time…" : "The bot is thinking…";
  else if (userToMove) status = `Your move (${state.user === "white" ? "White" : "Black"}).`;
  else status = "";

  const newLabel = start.auto ? "Play again" : "New game";

  return (
    <div className="container pl">
      <header className="pl-head">
        <h1>Play it out</h1>
        <p className="muted">
          {course
            ? `Play ${course.title} against a bot. It follows the course while you do, then plays on like a real opponent.`
            : "Play a game against a free bot. It runs in your browser, so it works offline."}
        </p>
        {start.warning && (
          <p className="pl-warn" role="status">
            {start.warning}
          </p>
        )}
      </header>

      <div className="pl-layout">
        <section className="pl-main" aria-label="Board">
          <div className="pl-book" data-state={bookNow ? "in" : book && state ? "out" : "none"} data-testid="book-state">
            {book && state ? (
              bookNow ? (
                <>
                  <Icon name="book" size={18} />
                  <span className="pl-book-label">In book:</span>
                  <strong className="pl-book-name">{bookName(book, fensOf(state), openingName)}</strong>
                </>
              ) : (
                <>
                  <Icon name="info" size={18} />
                  <strong className="pl-book-name">Out of book</strong>
                  <span className="pl-book-sub">You are on your own from here.</span>
                </>
              )
            ) : (
              <>
                <Icon name="book" size={18} />
                <strong className="pl-book-name">{named ?? (book ? `Course: ${book.title}` : "Free game")}</strong>
              </>
            )}
          </div>

          <p className="pl-status" role="status" data-busy={thinking || undefined}>
            <span className="pl-status-text">{status}</span>
            {thinking && (
              <span className="pl-thinking" aria-hidden="true">
                <i />
              </span>
            )}
          </p>

          <div className="pl-boardwrap">
            <Board
              fen={fen}
              orientation={orientation}
              movable={userToMove && state ? state.user : null}
              lastMove={state ? lastMoveOf(state) : null}
              ariaLabel="Game board"
              onMove={onMove}
            />
          </div>


          <div className="pl-notice pl-notice--main" role="status">
            {notice && <p>{notice}</p>}
          </div>

          {engineError && (
            <div className="pl-error" role="alert" data-testid="engine-error">
              <strong>The engine could not run.</strong>
              <span>{engineError}</span>
              <div className="pl-btnrow">
                <button
                  type="button"
                  className="btn"
                  data-variant="primary"
                  onClick={() => {
                    botRef.current?.reset();
                    setEngineError(null);
                    setRetry((r) => r + 1);
                  }}
                >
                  Try again
                </button>
                <Link className="btn" to={`/analysis?fen=${encodeURIComponent(fen)}`}>
                  Analyse this position
                </Link>
              </div>
            </div>
          )}

          <div className="pl-controls" role="group" aria-label="Game controls">
            <button type="button" className="pl-ctl" onClick={doTakeback} disabled={!state || !canTakeback(state)} title="Take back your last move" data-testid="takeback">
              <Icon name="back" size={18} />
              <span>Take back</span>
            </button>
            <button type="button" className="pl-ctl" onClick={() => setFlipped((f) => !f)} title="Flip board" aria-label="Flip board">
              <Icon name="repeat" size={18} />
              <span>Flip</span>
            </button>
            {confirmResign ? (
              <span className="pl-confirm" role="group" aria-label="Confirm resigning">
                <button
                  type="button"
                  className="pl-ctl pl-ctl-danger"
                  onClick={() => {
                    if (state) setState(resign(state));
                    setConfirmResign(false);
                  }}
                  data-testid="resign-confirm"
                >
                  Yes, resign
                </button>
                <button type="button" className="pl-ctl" onClick={() => setConfirmResign(false)}>
                  Keep playing
                </button>
              </span>
            ) : (
              <button type="button" className="pl-ctl" onClick={() => setConfirmResign(true)} disabled={!state || !!outcome} data-testid="resign">
                <Icon name="x" size={18} />
                <span>Resign</span>
              </button>
            )}
          </div>
        </section>

        <aside className="pl-side">
          <div className="pl-notice pl-notice--side" role="status">
            {notice && <p>{notice}</p>}
          </div>
          {!state && (
            <Card title="New game" lane="blue">
              <Segmented
                legend="You play"
                name="pl-side"
                value={pickSide}
                options={[
                  { value: "white", label: "White" },
                  { value: "black", label: "Black" },
                  { value: "random", label: "Random" },
                ]}
                onChange={setPickSide}
              />
              <LevelPicker level={levelId} onChange={changeLevel} />
              <div className="pl-btnrow">
                <button type="button" className="btn" data-variant="primary" data-size="lg" onClick={() => begin(pickSide)} data-testid="start-game">
                  Start game
                </button>
              </div>
            </Card>
          )}

          {state && outcome && (
            <ResultCard outcome={outcome} state={state} pgn={pgn} courseId={course?.id} onNew={newGame} newLabel={newLabel} />
          )}

          {state && !outcome && (
            <Card title="Opponent" lane="blue">
              <LevelPicker level={levelId} onChange={changeLevel} note={ply > 0 ? "A new strength applies from the bot's next move." : undefined} />
            </Card>
          )}

          {state && (
            <Card title="Moves" lane="chalk">
              <MoveList state={state} />
              <div className="pl-btnrow">
                <Link className="btn" data-size="sm" to={`/analysis?fen=${encodeURIComponent(fen)}`}>
                  Analyse position
                </Link>
                {!outcome && (
                  <button type="button" className="btn" data-size="sm" data-variant="ghost" onClick={newGame} data-testid="new-game-mid">
                    {start.auto ? "Restart game" : "New game"}
                  </button>
                )}
              </div>
            </Card>
          )}
          <p className="pl-fine">
            {user === "white" ? "You are White." : "You are Black."} The bot is Stockfish running in your browser; the lower strengths are made weaker on purpose.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default function Play() {
  const [params] = useSearchParams();
  // A new link (for example from the trainer) starts a fresh game.
  return <PlayGame key={params.toString()} />;
}
