import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Board } from "../components/board";
import type { BoardArrow, BoardMove } from "../components/board";
import { Icon } from "../components/ui/Icon";
import { useDocumentMeta } from "../components/ui/hooks";
import {
  START_FEN,
  coursesAt,
  engineSupported,
  favours,
  fenAt,
  formatPv,
  formatScore,
  formatScoreShort,
  gameOverText,
  getEngine,
  lastMoveAt,
  loadText,
  newGame,
  openingName,
  playMove,
  playUci,
  pvToMoves,
  splitUci,
  toPgn,
  whiteShare,
} from "../lib/engine";
import type { EngineLine, Game, Score } from "../lib/engine";
import { ToolIcon } from "./tool-icons";
import "./analysis.css";

const ENGINE_KEY = "opening-gym:analysis-engine";
const TARGET_DEPTH = 20;
const LINES = 3;
const PV_PLIES = 8;
const COURSE_CAP = 5;

// ---- small helpers -------------------------------------------------------------------------

function readEnginePref(): boolean {
  try {
    const v = localStorage.getItem(ENGINE_KEY);
    if (v === "1") return true;
    if (v === "0") return false;
  } catch {
    /* storage blocked: fall through to the default */
  }
  // Off by default on phones/tablets to save battery.
  return !(typeof window !== "undefined" && window.matchMedia?.("(max-width: 719px), (pointer: coarse)").matches);
}

function writeEnginePref(on: boolean): void {
  try {
    localStorage.setItem(ENGINE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function sideToMove(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

interface Loaded {
  game: Game;
  ply: number;
  note?: string;
  error?: string;
}

/** Start state from ?fen= / ?pgn= (pgn wins when both are present). */
function fromParams(params: URLSearchParams): Loaded {
  const pgn = params.get("pgn");
  const fen = params.get("fen");
  const text = pgn ?? fen;
  if (!text) return { game: newGame(), ply: 0 };
  const r = loadText(text);
  if (!r.ok) return { game: newGame(), ply: 0, error: r.error };
  return { game: r.game, ply: r.game.moves.length };
}

// ---- engine hook ---------------------------------------------------------------------------

interface EngineView {
  fen: string;
  lines: EngineLine[];
  done: boolean;
}

function useEngineStatus() {
  const [snap, setSnap] = useState(() => getEngine().getStatus());
  useEffect(() => {
    const engine = getEngine();
    const update = () => setSnap(engine.getStatus());
    update();
    return engine.subscribe(update);
  }, []);
  return snap;
}

function useEngineAnalysis(fen: string, enabled: boolean, retryKey: number): EngineView | null {
  const [view, setView] = useState<EngineView | null>(null);
  const cache = useRef(new Map<string, EngineLine[]>());

  useEffect(() => {
    if (!enabled) {
      if (engineSupported()) getEngine().stop();
      return;
    }
    if (!engineSupported()) return;
    const cached = cache.current.get(fen);
    if (cached) {
      getEngine().stop();
      setView({ fen, lines: cached, done: true });
      return;
    }
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let latest: EngineLine[] = [];
    const flush = () => {
      timer = undefined;
      if (alive) setView({ fen, lines: latest, done: false });
    };
    void getEngine()
      .analyse(fen, { multiPv: LINES, depth: TARGET_DEPTH }, (lines) => {
        latest = lines;
        if (timer === undefined) timer = setTimeout(flush, 90);
      })
      .then((r) => {
        if (timer !== undefined) clearTimeout(timer);
        timer = undefined;
        if (!alive || r.end !== "completed") return;
        if (latest.length) {
          if (cache.current.size > 300) cache.current.clear();
          cache.current.set(fen, latest);
        }
        setView({ fen, lines: latest, done: true });
      });
    return () => {
      alive = false;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [fen, enabled, retryKey]);

  useEffect(
    () => () => {
      if (engineSupported()) getEngine().stop();
    },
    [],
  );
  return view;
}

// ---- pieces of UI --------------------------------------------------------------------------

function EvalBar({ share, label, text, flipped, idle }: { share: number; label: string; text: string; flipped: boolean; idle: boolean }) {
  return (
    <div className="an-eval" data-flipped={flipped || undefined} data-idle={idle || undefined} role="img" aria-label={text}>
      <div className="an-eval-white" style={{ height: `${share}%` }} />
      {label && (
        <span className="an-eval-label" data-end={share >= 50 ? "white" : "black"}>
          {label}
        </span>
      )}
    </div>
  );
}

function ScoreChip({ score }: { score: Score }) {
  return (
    <span className="an-score" data-side={favours(score)}>
      {formatScore(score)}
    </span>
  );
}

// ---- page ----------------------------------------------------------------------------------

export default function Analysis() {
  useDocumentMeta({
    title: "Analysis board",
    description: "Free chess analysis board with Stockfish running in your browser. Paste a FEN or PGN, see the opening name and which of your courses cover the position.",
  });

  const [params] = useSearchParams();
  const paramKey = params.toString();
  const initial = useMemo(() => fromParams(params), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [game, setGame] = useState<Game>(initial.game);
  const [ply, setPly] = useState(initial.ply);
  const [flipped, setFlipped] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "ok" | "error" } | null>(
    initial.error ? { text: initial.error, tone: "error" } : null,
  );
  const [input, setInput] = useState("");
  const [engineOn, setEngineOn] = useState(readEnginePref);
  const [retryKey, setRetryKey] = useState(0);
  const [allCourses, setAllCourses] = useState(false);
  const handledParams = useRef(paramKey);
  const fileRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // The trainer can link here again while the page is open: load the new position.
  useEffect(() => {
    if (handledParams.current === paramKey) return;
    handledParams.current = paramKey;
    const next = fromParams(new URLSearchParams(paramKey));
    setGame(next.game);
    setPly(next.ply);
    setMessage(next.error ? { text: next.error, tone: "error" } : null);
  }, [paramKey]);

  const fen = fenAt(game, ply);
  const over = useMemo(() => gameOverText(fen), [fen]);
  const turn = sideToMove(fen);
  const supported = useMemo(() => engineSupported(), []);
  const engine = useEngineStatus();
  const active = engineOn && supported && !over && engine.status !== "error";
  const view = useEngineAnalysis(fen, active, retryKey);
  const fresh = !!view && view.fen === fen;
  const lines = fresh ? view.lines : [];
  const shownLines = view && !fresh ? view.lines : lines; // stale lines stay visible (dimmed) while the next search warms up
  const best = lines[0];
  const mated = over?.startsWith("Checkmate") ? turn : null; // the side that has been mated
  const evalScore: Score | null = over ? (mated ? null : { cp: 0, mate: null }) : active && best ? best.score : null;
  const barShare = mated ? (mated === "white" ? 0 : 100) : evalScore ? whiteShare(evalScore) : 50;
  const barLabel = mated ? (mated === "white" ? "0-1" : "1-0") : evalScore ? formatScoreShort(evalScore) : "";
  const barText = mated
    ? `Checkmate, ${mated === "white" ? "Black" : "White"} wins`
    : evalScore
      ? `Evaluation ${formatScore(evalScore)}, ${favours(evalScore) === "even" ? "equal" : favours(evalScore) + " is better"}`
      : "Evaluation bar (engine idle)";

  // ---- navigation
  const last = game.moves.length;
  const go = (n: number) => setPly(Math.max(0, Math.min(last, n)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.matches("input, textarea, select, [contenteditable='true']") || (t.closest("svg.cm-chessboard") && t.matches(":focus-visible")))) return;
      let to: number | null = null;
      if (e.key === "ArrowLeft") to = Math.max(0, ply - 1);
      else if (e.key === "ArrowRight") to = Math.min(last, ply + 1);
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = last;
      else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (to === null) return;
      e.preventDefault();
      e.stopPropagation();
      setPly(to);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [ply, last]);

  // keep the current move visible inside the scrolling list (without scrolling the page)
  useEffect(() => {
    const box = listRef.current;
    const cur = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!box || !cur) {
      if (box && ply === 0) box.scrollTop = 0;
      return;
    }
    const top = cur.offsetTop - box.offsetTop;
    if (top < box.scrollTop) box.scrollTop = top - 4;
    else if (top + cur.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + cur.offsetHeight - box.clientHeight + 4;
  }, [ply, game]);

  // ---- actions
  const onBoardMove = (m: BoardMove) => {
    const r = playMove(game, ply, m);
    if (!r) return;
    setGame(r.game);
    setPly(r.ply);
    setMessage(null);
    const a = document.activeElement as HTMLElement | null;
    if (a?.closest?.("svg.cm-chessboard")) a.blur(); // so ←/→ navigate the moves again
  };

  const playLine = (line: EngineLine) => {
    if (!fresh || !line.pv[0]) return;
    const r = playUci(game, ply, line.pv[0]);
    if (!r) return;
    setGame(r.game);
    setPly(r.ply);
  };

  const load = (text: string) => {
    const r = loadText(text);
    if (!r.ok) {
      setMessage({ text: r.error, tone: "error" });
      return;
    }
    setGame(r.game);
    setPly(r.game.moves.length);
    setInput("");
    const what = r.kind === "fen" ? "Position loaded." : `Loaded ${r.game.moves.length} move${r.game.moves.length === 1 ? "" : "s"}.`;
    setMessage({ text: r.extraGames ? `${what} The file had several games; showing the first.` : what, tone: "ok" });
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      load(await file.text());
    } catch {
      setMessage({ text: "Could not read that file.", tone: "error" });
    }
  };

  const copy = async (what: "FEN" | "PGN") => {
    const ok = await copyText(what === "FEN" ? fen : toPgn(game));
    setMessage(ok ? { text: `${what} copied.`, tone: "ok" } : { text: `Could not copy the ${what}. Select it manually from the box below.`, tone: "error" });
  };

  const reset = () => {
    setGame(newGame());
    setPly(0);
    setInput("");
    setMessage(null);
  };

  const toggleEngine = (on: boolean) => {
    setEngineOn(on);
    writeEnginePref(on);
  };

  const retryEngine = () => {
    getEngine().dispose();
    setRetryKey((k) => k + 1);
  };

  // ---- derived display data
  const arrows: BoardArrow[] = useMemo(() => {
    if (!active || !fresh || !best || best.depth < 6 || !best.pv[0]) return [];
    const { from, to } = splitUci(best.pv[0]);
    return [{ from, to, kind: "hint" }];
  }, [active, fresh, best]);

  const lineRows = useMemo(
    () =>
      shownLines.map((l) => {
        const base = view?.fen ?? fen;
        const moves = pvToMoves(base, l.pv, PV_PLIES);
        return { line: l, text: formatPv(base, moves) };
      }),
    [shownLines, view, fen],
  );

  // opening: the deepest named position on the way to here
  const named = useMemo(() => {
    for (let p = ply; p >= 0; p--) {
      const n = openingName(fenAt(game, p));
      if (n) return { name: n, ply: p };
    }
    return null;
  }, [game, ply]);
  const hits = useMemo(() => coursesAt(fen), [fen]);
  const eco = named ? /^([A-E]\d\d)\s+(.+)$/.exec(named.name) : null;

  const rows = useMemo(() => {
    const parts = game.startFen.split(" ");
    const blackFirst = parts[1] === "b";
    const firstNo = Number(parts[5]) || 1;
    const out: { no: number; white?: number; black?: number }[] = [];
    game.moves.forEach((_, i) => {
      const isBlack = (i % 2 === 1) !== blackFirst;
      const no = firstNo + Math.floor((i + (blackFirst ? 1 : 0)) / 2);
      const row = out[out.length - 1];
      if (isBlack && row && row.no === no && row.white !== undefined) row.black = i;
      else out.push(isBlack ? { no, black: i } : { no, white: i });
    });
    return out;
  }, [game]);

  const h = game.headers;
  const caption = [h.White && h.Black ? `${h.White} vs ${h.Black}` : "", h.Event ?? "", h.Result && h.Result !== "*" ? h.Result : ""].filter(Boolean).join(" · ");
  const depth = best?.depth ?? 0;
  const lastMove = lastMoveAt(game, ply);

  return (
    <div className="container an">
      <header className="an-head">
        <h1>Analysis board</h1>
        <p className="muted">Play both sides, load a game, and let Stockfish check it. Everything runs in your browser.</p>
      </header>

      <div className="an-layout">
        <section className="an-main" aria-label="Board">
          <div className="an-boardrow">
            <EvalBar share={barShare} label={barLabel} text={barText} flipped={flipped} idle={!evalScore && !mated} />
            <div className="an-board">
              <Board
                fen={fen}
                orientation={flipped ? "black" : "white"}
                movable={over ? null : turn}
                lastMove={lastMove}
                arrows={arrows}
                ariaLabel="Analysis board"
                onMove={onBoardMove}
              />
            </div>
          </div>

          <div className="an-controls" role="group" aria-label="Move navigation">
            <button type="button" className="an-ctl" onClick={() => go(0)} disabled={ply === 0} aria-label="First position" title="First (Home)">
              <ToolIcon name="first" />
            </button>
            <button type="button" className="an-ctl" onClick={() => go(ply - 1)} disabled={ply === 0} aria-label="Previous move" title="Previous (←)">
              <ToolIcon name="prev" />
            </button>
            <button type="button" className="an-ctl" onClick={() => go(ply + 1)} disabled={ply >= last} aria-label="Next move" title="Next (→)">
              <ToolIcon name="next" />
            </button>
            <button type="button" className="an-ctl" onClick={() => go(last)} disabled={ply >= last} aria-label="Last position" title="Last (End)">
              <ToolIcon name="last" />
            </button>
            <button type="button" className="an-ctl an-ctl-wide" onClick={() => setFlipped((f) => !f)} aria-label="Flip board" title="Flip board (F)">
              <Icon name="repeat" size={18} />
              <span>Flip</span>
            </button>
          </div>

          <div className="an-opening" data-named={named ? "yes" : "no"}>
            <span className="sr-only">Opening: </span>
            {eco && <span className="an-eco">{eco[1]}</span>}
            <strong className="an-opening-name">
              {named ? (eco ? eco[2] : named.name) : ply === 0 && fen === START_FEN ? "Starting position" : "Not a named opening (yet)"}
            </strong>
            {named && named.ply !== ply && <span className="muted an-opening-from">last named at move {Math.ceil(named.ply / 2)}</span>}
            {over && <span className="an-over">{over}</span>}
          </div>
        </section>

        <aside className="an-side">
          <section className="an-card an-engine" aria-label="Engine" data-lane="blue">
            <div className="an-card-head">
              <h2>Stockfish</h2>
              <label className="an-switch">
                <input type="checkbox" role="switch" checked={engineOn} onChange={(e) => toggleEngine(e.target.checked)} disabled={!supported} />
                <span className="an-switch-track" aria-hidden="true" />
                <span>{engineOn && supported ? "On" : "Off"}</span>
              </label>
            </div>

            <div className="an-engine-status" role="status" aria-live="polite">
              {!supported ? (
                <p className="an-warn">This browser can't run the engine (it needs Web Workers and WebAssembly). The board, move list and opening names still work.</p>
              ) : engine.status === "error" ? (
                <p className="an-warn">
                  The engine failed to start{engine.error ? `: ${engine.error}` : "."}{" "}
                  <button type="button" className="an-link" onClick={retryEngine}>Try again</button>
                </p>
              ) : !engineOn ? (
                <p className="muted">Engine is off. Turn it on to see the evaluation and the best lines.</p>
              ) : engine.status === "loading" || engine.status === "idle" ? (
                <>
                  <p className="muted">Loading the engine (about 1.8 MB, cached after the first time)…</p>
                  <div className="an-loading" aria-hidden="true"><span /></div>
                </>
              ) : over ? (
                <p className="muted">Game over, nothing to calculate.</p>
              ) : (
                <>
                  <p className="muted">
                    Depth <strong className="an-depth">{depth || "…"}</strong>
                    {depth ? ` / ${TARGET_DEPTH}` : ""}
                    {fresh && view?.done ? " · done" : fresh && depth ? " · thinking…" : ""}
                  </p>
                  <div className="an-depthbar" aria-hidden="true" data-done={(fresh && view?.done) || undefined}>
                    <span style={{ width: `${Math.min(100, Math.round((depth / TARGET_DEPTH) * 100))}%` }} />
                  </div>
                </>
              )}
            </div>

            <ol className="an-lines" data-stale={!fresh || undefined} aria-label="Engine lines">
              {Array.from({ length: LINES }, (_, i) => {
                const row = lineRows[i];
                if (!row || !active) return <li key={i} className="an-line-empty" aria-hidden="true" />;
                return (
                  <li key={i}>
                    <button type="button" className="an-line" onClick={() => playLine(row.line)} disabled={!fresh} title="Play the first move of this line">
                      <ScoreChip score={row.line.score} />
                      <span className="an-pv">{row.text}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="an-card an-courses" aria-label="Courses containing this position" data-lane="green">
            <div className="an-card-head">
              <h2>This position is in your courses:</h2>
            </div>
            {hits.length === 0 ? (
              <p className="muted">
                None of the courses cover it.{" "}
                {ply > 0 && (
                  <>
                    You can <Link to="/create">build your own course</Link> from it.
                  </>
                )}
              </p>
            ) : (
              <ul className="an-course-list">
                {(allCourses ? hits : hits.slice(0, COURSE_CAP)).map((c) => (
                  <li key={c.courseId}>
                    <Link to={`/opening/${c.courseId}`} className="an-course-link">
                      {c.courseTitle}
                      <Icon name="chevron" size={16} />
                    </Link>
                    {c.trained ? (
                      <p className="an-course-next">
                        Course move: <strong>{c.trained.san}</strong>
                        {c.trained.note ? <span className="muted"> {c.trained.note}</span> : null}
                      </p>
                    ) : c.next.length > 0 ? (
                      <p className="an-course-next muted">
                        Opponent usually plays: <strong>{c.next.map((n) => n.san).join(", ")}</strong>
                      </p>
                    ) : (
                      <p className="an-course-next muted">End of a line in this course.</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {hits.length > COURSE_CAP && (
              <button type="button" className="an-link an-more" onClick={() => setAllCourses((v) => !v)} aria-expanded={allCourses}>
                {allCourses ? "Show fewer" : `Show all ${hits.length} courses`}
              </button>
            )}
          </section>

          <section className="an-card" aria-label="Moves" data-lane="black">
            <div className="an-card-head">
              <h2>Moves</h2>
              <span className="an-kbd" aria-label="Keyboard: left and right arrows, Home, End">
                <kbd>←</kbd>
                <kbd>→</kbd>
                <kbd>Home</kbd>
                <kbd>End</kbd>
              </span>
            </div>
            {caption && <p className="muted an-caption">{caption}</p>}
            <div className="an-moves" ref={listRef} role="list" tabIndex={-1}>
              {game.moves.length === 0 ? (
                <p className="muted an-empty">No moves yet. Move a piece on the board, or load a game below.</p>
              ) : (
                rows.map((r) => (
                  <div className="an-move-row" role="listitem" key={`${r.no}-${r.white ?? "b"}`}>
                    <span className="an-move-no">{r.no}.</span>
                    {r.white !== undefined ? (
                      <button type="button" className="an-move" aria-current={ply === r.white + 1 || undefined} onClick={() => go(r.white! + 1)}>
                        {game.moves[r.white].san}
                      </button>
                    ) : (
                      <span className="an-move-gap">…</span>
                    )}
                    {r.black !== undefined ? (
                      <button type="button" className="an-move" aria-current={ply === r.black + 1 || undefined} onClick={() => go(r.black! + 1)}>
                        {game.moves[r.black].san}
                      </button>
                    ) : (
                      <span />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="an-card an-tools" aria-label="Load and export" data-lane="yellow">
            <div className="an-card-head">
              <h2>Load or share</h2>
            </div>
            <label className="an-label" htmlFor="an-input">Paste a FEN or PGN</label>
            <textarea
              id="an-input"
              className="an-textarea"
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"1. d4 d5 2. Bf4 Nf6\nor rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1"}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="an-btnrow">
              <button type="button" className="btn" data-variant="primary" data-size="sm" onClick={() => load(input)}>Load</button>
              <button type="button" className="btn" data-size="sm" onClick={() => fileRef.current?.click()}>
                <Icon name="upload" size={16} /> Upload .pgn
              </button>
              <input ref={fileRef} type="file" accept=".pgn,.txt,text/plain,application/x-chess-pgn" hidden onChange={onFile} />
            </div>
            <div className="an-btnrow">
              <button type="button" className="btn" data-size="sm" onClick={() => void copy("FEN")}>Copy FEN</button>
              <button type="button" className="btn" data-size="sm" onClick={() => void copy("PGN")} disabled={game.moves.length === 0}>Copy PGN</button>
              <button type="button" className="btn" data-variant="ghost" data-size="sm" onClick={reset}>
                <Icon name="reset" size={16} /> Reset
              </button>
            </div>
            <output className="an-message" data-tone={message?.tone} aria-live="polite">{message?.text ?? ""}</output>
            <p className="muted an-fen" aria-label="Current FEN">{fen}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
