import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { allCourses } from "../lib/courses";
import { progress } from "../lib/progress";
import {
  GameFetchError,
  buildReport,
  checkGames,
  fetchGames,
  moveLabel,
  orientedUrl,
  userColorIn,
} from "../lib/gamecheck";
import type { CheckReport, DeviationGroup, FetchedGame, GameCheck, Site } from "../lib/gamecheck";
import { Button, LinkButton } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { MiniBoard } from "../components/ui/MiniBoard";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useDocumentMeta } from "../components/ui/hooks";
import "./check.css";

const STORE_KEY = "opening-gym:check-games";
const COUNTS = [20, 50, 100] as const;

interface Saved {
  username: string;
  site: Site;
  count: number;
  onlyStarted: boolean;
}
const DEFAULTS: Saved = { username: "", site: "lichess", count: 50, onlyStarted: true };

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return DEFAULTS;
    const p = JSON.parse(raw) as Partial<Saved>;
    return {
      username: typeof p.username === "string" ? p.username : "",
      site: p.site === "chesscom" ? "chesscom" : "lichess",
      count: COUNTS.includes(p.count as 20) ? (p.count as number) : 50,
      onlyStarted: p.onlyStarted !== false,
    };
  } catch {
    return DEFAULTS;
  }
}
function save(s: Saved) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* private mode or blocked storage: the page works without it */
  }
}

const SITE_NAME: Record<Site, string> = { lichess: "Lichess", chesscom: "Chess.com" };

type State =
  | { phase: "idle" }
  | { phase: "loading"; loaded: number }
  | { phase: "error"; message: string; retry: boolean }
  | { phase: "done"; report: CheckReport; site: Site; username: string; usedAll: boolean; courseCount: number; fetched: number };

export default function CheckGames() {
  useDocumentMeta({
    title: "Check my games against my repertoire",
    description:
      "Paste your Lichess or Chess.com username and see where your real games left your opening preparation. Runs in your browser; nothing is stored on a server.",
  });
  const [form, setForm] = useState<Saved>(loadSaved);
  const [started, setStarted] = useState<string[] | null>(null);
  const [state, setState] = useState<State>({ phase: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    progress.startedCourses().then(
      (ids) => alive && setStarted(ids),
      () => alive && setStarted([]),
    );
    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, []);

  const update = (patch: Partial<Saved>) => setForm((f) => ({ ...f, ...patch }));

  const run = useCallback(
    async (f: Saved) => {
      const username = f.username.trim();
      if (!username) return;
      save({ ...f, username });
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setState({ phase: "loading", loaded: 0 });
      try {
        const games = await fetchGames(f.site, username, f.count, {
          signal: ac.signal,
          onProgress: (n) => setState({ phase: "loading", loaded: n }),
        });
        if (ac.signal.aborted) return;
        const startedIds = new Set(started ?? (await progress.startedCourses().catch(() => [])));
        const everything = allCourses();
        const usedAll = !f.onlyStarted || startedIds.size === 0;
        const pool = usedAll ? everything : everything.filter((c) => startedIds.has(c.id));
        const { checks, skipped } = checkGames(games, username, pool, { preferIds: startedIds });
        setState({
          phase: "done",
          report: buildReport(checks, skipped),
          site: f.site,
          username,
          usedAll,
          courseCount: pool.length,
          fetched: games.length,
        });
      } catch (e) {
        if (e instanceof GameFetchError) {
          if (e.code === "aborted") return;
          setState({ phase: "error", message: e.message, retry: e.code === "network" || e.code === "rate-limit" || e.code === "bad-response" });
        } else {
          setState({ phase: "error", message: "Something went wrong while checking your games.", retry: true });
        }
      }
    },
    [started],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run(form);
  };
  const cancel = () => {
    abortRef.current?.abort();
    setState({ phase: "idle" });
  };

  const noneStarted = started !== null && started.length === 0;
  const loading = state.phase === "loading";

  return (
    <div className="container check-page">
      <header className="page-head">
        <p className="eyebrow">Game check</p>
        <h1>Did your games follow your prep?</h1>
        <p className="page-lead">
          Enter your Lichess or Chess.com name. We load your recent games and find the first move where each one left your
          courses: your own slips, and the surprises your opponents played.
        </p>
      </header>

      <form className="check-form panel" onSubmit={onSubmit} aria-busy={loading}>
        <div className="check-row">
          <label className="check-field check-field-grow">
            <span className="check-label">Username</span>
            <input
              className="check-input"
              value={form.username}
              onChange={(e) => update({ username: e.target.value })}
              placeholder="e.g. DrNykterstein"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={40}
              required
            />
          </label>
          <div className="check-field">
            <span className="check-label" id="site-label">Site</span>
            <div className="seg" role="group" aria-labelledby="site-label">
              {(["lichess", "chesscom"] as Site[]).map((s) => (
                <button key={s} type="button" aria-pressed={form.site === s} onClick={() => update({ site: s })}>
                  {SITE_NAME[s]}
                </button>
              ))}
            </div>
          </div>
          <div className="check-field">
            <span className="check-label" id="count-label">Games</span>
            <div className="seg" role="group" aria-labelledby="count-label">
              {COUNTS.map((n) => (
                <button key={n} type="button" aria-pressed={form.count === n} onClick={() => update({ count: n })}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="check-row check-row-end">
          <label className="check-toggle">
            <input
              type="checkbox"
              checked={form.onlyStarted}
              onChange={(e) => update({ onlyStarted: e.target.checked })}
            />
            <span>Only courses I've started</span>
            {noneStarted && form.onlyStarted && <span className="muted"> (none yet, so all courses are used)</span>}
          </label>
          <div className="check-actions">
            {loading && (
              <Button variant="ghost" onClick={cancel}>
                Cancel
              </Button>
            )}
            <Button variant="primary" size="lg" type="submit" disabled={loading || !form.username.trim()}>
              {loading ? "Checking…" : "Check my games"}
            </Button>
          </div>
        </div>
        <p className="check-privacy">
          <Icon name="shield" size={16} />
          <span>
            Requests go straight from your browser to {SITE_NAME[form.site]}. Nothing is stored on any server; only your username
            is remembered on this device.
          </span>
        </p>
      </form>

      <div aria-live="polite">
        {state.phase === "idle" && <Intro />}
        {state.phase === "loading" && (
          <div className="check-status" role="status">
            <span className="spinner" aria-hidden="true" />
            {state.loaded > 0 ? `Loaded ${state.loaded} games…` : `Contacting ${SITE_NAME[form.site]}…`}
          </div>
        )}
        {state.phase === "error" && (
          <div className="check-error" role="alert">
            <strong>Couldn't check your games.</strong>
            <p>{state.message}</p>
            {state.retry && (
              <Button size="sm" onClick={() => void run(form)}>
                Try again
              </Button>
            )}
          </div>
        )}
        {state.phase === "done" && <Results state={state} />}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <section className="check-intro">
      <h2>How it works</h2>
      <ol>
        <li>We fetch your latest games from the site you pick.</li>
        <li>Each game is walked through the courses you play with that colour, following transpositions.</li>
        <li>
          The first move that leaves the course is flagged: yours (time to review), or your opponent's (maybe a new line to add).
        </li>
      </ol>
    </section>
  );
}

// ---- results -------------------------------------------------------------------------------------

function Results({ state }: { state: Extract<State, { phase: "done" }> }) {
  const { report, site, username, usedAll, courseCount, fetched } = state;
  const s = report.summary;

  if (fetched === 0) {
    return (
      <div className="callout check-empty">
        <h2>No games found</h2>
        <p>
          {SITE_NAME[site]} returned no standard chess games for {username}. Try another site, or play a few games first.
        </p>
      </div>
    );
  }
  if (s.checked === 0) {
    return (
      <div className="callout check-empty">
        <h2>Couldn't match the games to {username}</h2>
        <p>The player names in the games didn't match that username. Check the spelling and the site.</p>
      </div>
    );
  }

  return (
    <div className="check-results">
      <p className="check-scope muted">
        Checked {s.checked} {SITE_NAME[site]} games for <strong>{username}</strong> against{" "}
        {usedAll ? `all ${courseCount} courses` : `${courseCount} started courses`}.
        {!usedAll && " Switch off “Only courses I've started” to include every course."}
      </p>

      <div className="stat-grid check-stats">
        <div className="stat">
          <Icon name="book" size={20} />
          <strong>{s.checked}</strong>
          <span>games checked</span>
        </div>
        <div className="stat">
          <Icon name="target" size={20} />
          <strong>{s.userDeviations}</strong>
          <span>games where you left your prep</span>
        </div>
        <div className="stat">
          <Icon name="chart" size={20} />
          <strong>{s.withCourse ? s.avgBookPlies.toFixed(1) : "–"}</strong>
          <span>average plies in book</span>
        </div>
        <div className="stat">
          <Icon name="flame" size={20} />
          <strong className="stat-move">{s.mostMissed ? s.mostMissed.expectedLabel : "–"}</strong>
          <span>
            {s.mostMissed
              ? `most-missed move (${s.mostMissed.count} ${s.mostMissed.count === 1 ? "game" : "games"})`
              : "no repeated slips"}
          </span>
        </div>
      </div>

      <ResultSection
        title="Your mistakes"
        hint="Where you played something other than your course move. Repeated slips come first."
        empty="No deviations of yours. Every game that matched a course stayed on your side of the book."
        count={report.mistakes.length}
      >
        {report.mistakes.map((g) => (
          <GroupCard key={g.key} g={g} kind="mistake" />
        ))}
      </ResultSection>

      <ResultSection
        title="Opponent surprises"
        hint="Moves your opponents played that your courses don't cover. Worth a look, and maybe a new line."
        empty="No opponent left your book before you did."
        count={report.surprises.length}
      >
        {report.surprises.map((g) => (
          <GroupCard key={g.key} g={g} kind="surprise" />
        ))}
      </ResultSection>

      <ResultSection
        title="Followed your prep"
        hint="Games that stayed inside a course until it ended (or the game did)."
        empty="No game stayed in book to the end of a course."
        count={report.followed.length}
      >
        {report.followed.map((c) => (
          <FollowedRow key={c.game.id} c={c} username={username} />
        ))}
      </ResultSection>

      {report.uncovered.length > 0 && <Uncovered items={report.uncovered} />}
    </div>
  );
}

function ResultSection(props: { title: string; hint: string; empty: string; count: number; children: React.ReactNode }) {
  return (
    <section className="check-section">
      <div className="section-head">
        <h2 className="check-section-title">
          {props.title} <span className="check-count">{props.count}</span>
        </h2>
      </div>
      <p className="muted check-hint">{props.hint}</p>
      {props.count === 0 ? <p className="check-none">{props.empty}</p> : <ul className="check-list">{props.children}</ul>}
    </section>
  );
}

function gameWhen(g: FetchedGame): string {
  return g.playedAt ? new Date(g.playedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
}

function GameLinks({ games, color }: { games: FetchedGame[]; color: "white" | "black" }) {
  const shown = games.slice(0, 6);
  return (
    <p className="check-games">
      {shown.map((g) => {
        const opp = color === "white" ? g.black : g.white;
        return (
          <a key={g.id} href={orientedUrl(g, color)} target="_blank" rel="noopener noreferrer" className="check-game-link">
            vs {opp}
            {gameWhen(g) && <span className="muted"> · {gameWhen(g)}</span>}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      })}
      {games.length > shown.length && <span className="muted">+{games.length - shown.length} more</span>}
    </p>
  );
}

function GroupCard({ g, kind }: { g: DeviationGroup; kind: "mistake" | "surprise" }) {
  const games = g.count === 1 ? "1 game" : `${g.count} games`;
  const expectedMoves = g.expected.map((san) => moveLabel(g.ply, san));
  return (
    <li className="check-item" data-kind={kind}>
      <MiniBoard
        fen={g.fen}
        orientation={g.color}
        className="check-board"
        label={`Position before ${g.playedLabel} in ${g.courseTitle}`}
      />
      <div className="check-body">
        <h3 className="check-headline">
          {kind === "mistake" ? (
            <>
              You played <span className="mv mv-bad">{g.playedLabel}</span> instead of{" "}
              <span className="mv mv-good">{g.expectedLabel}</span>
            </>
          ) : (
            <>
              Opponent played <span className="mv mv-bad">{g.playedLabel}</span>
              {expectedMoves.length > 0 && (
                <>
                  {" "}
                  where your course expects <span className="mv mv-good">{expectedMoves.join(" or ")}</span>
                </>
              )}
            </>
          )}
        </h3>
        <p className="check-sub">
          <Badge tone="neutral">{g.courseTitle}</Badge>
          <span className="check-times">in {games}</span>
          {g.knownMistake && <Badge tone="warning" title="This move appears in a trap-to-avoid line of your course">Trap to avoid</Badge>}
          {g.engineFine && <Badge tone="main" title="The engine rates your move within about half a pawn of the course move">Engine: also fine</Badge>}
        </p>
        {kind === "mistake" && g.expectedLines.length > 0 && (
          <p className="check-lines">
            <span className="muted">In your course:</span> {g.expectedLines.slice(0, 3).join(", ")}
            {g.expectedLines.length > 3 && ` +${g.expectedLines.length - 3} more`}
          </p>
        )}
        {kind === "mistake" && g.note && <p className="check-note">“{g.note}”</p>}
        {kind === "surprise" && (
          <p className="check-note">New territory for your course. If you meet this often, add a line for it.</p>
        )}
        <GameLinks games={g.games} color={g.color} />
        <div className="check-cta">
          <LinkButton to={`/opening/${g.courseId}?mode=practice`} variant={kind === "mistake" ? "primary" : "secondary"} size="sm">
            Practice this line
          </LinkButton>
          {kind === "surprise" && (
            <Link to="/create" className="check-link">
              Add a line
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

function FollowedRow({ c, username }: { c: GameCheck; username: string }) {
  const color = userColorIn(c.game, username) ?? c.color;
  const opp = color === "white" ? c.game.black : c.game.white;
  const won = (c.game.result === "1-0" && color === "white") || (c.game.result === "0-1" && color === "black");
  const draw = c.game.result === "1/2-1/2";
  return (
    <li className="check-followed">
      <div className="check-followed-main">
        <Link to={`/opening/${c.courseId}`} className="check-followed-course">
          {c.courseTitle}
        </Link>
        <a href={orientedUrl(c.game, color)} target="_blank" rel="noopener noreferrer" className="check-game-link">
          vs {opp}
          {gameWhen(c.game) && <span className="muted"> · {gameWhen(c.game)}</span>}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <div className="check-followed-meta">
        <Badge tone={won ? "main" : draw ? "neutral" : "warning"}>{won ? "Won" : draw ? "Draw" : c.game.result === "*" ? "Unfinished" : "Lost"}</Badge>
        <span className="check-plies">{c.depth} plies of prep</span>
        <div className="check-plies-bar">
          <ProgressBar value={Math.min(c.depth, 30)} max={30} label={`${c.depth} plies in book`} />
        </div>
      </div>
    </li>
  );
}

function Uncovered({ items }: { items: GameCheck[] }) {
  const byOpening = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of items) {
      const name = c.game.openingName ?? `${c.color === "white" ? "1." : "1..."}${c.game.moves[c.color === "white" ? 0 : 1] ?? "?"}`;
      m.set(name, (m.get(name) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [items]);
  return (
    <details className="check-uncovered">
      <summary>
        Outside your repertoire <span className="check-count">{items.length}</span>
      </summary>
      <p className="muted">
        These games left your courses on the very first decision, so there was nothing to compare. The openings you met most:
      </p>
      <ul className="check-open-list">
        {byOpening.map(([name, n]) => (
          <li key={name}>
            <span>{name}</span> <span className="muted">×{n}</span>
          </li>
        ))}
      </ul>
      <Link to="/openings" className="check-link">
        Browse courses
      </Link>
    </details>
  );
}
