import { Chess } from "chess.js";
import type { Course, MoveNode } from "../types";
import type { CheckKind, FetchedGame, GameCheck } from "./types";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Position key: piece placement, side to move and castling rights (en passant and clocks ignored). */
export function epd(fen: string): string {
  return fen.split(" ").slice(0, 3).join(" ");
}

/** SAN without check/annotation marks, for comparing moves. */
export function plain(san: string): string {
  return san.replace(/[+#!?]+$/, "");
}

export function moveLabel(ply: number, san: string): string {
  const n = Math.ceil(ply / 2);
  return ply % 2 === 1 ? `${n}.${san}` : `${n}...${san}`;
}

// ---- course index -------------------------------------------------------------------------------

interface CourseIndex {
  /** node ids that belong to at least one trained (main/alternative) line */
  trained: Set<string>;
  /** first (shallowest) trained node per position, for transpositions */
  byEpd: Map<string, MoveNode>;
  /** trained line names by the node id of the line's move at some depth: id -> names */
  linesAt: Map<string, string[]>;
}

const indexCache = new WeakMap<Course, CourseIndex>();

function indexCourse(course: Course): CourseIndex {
  const hit = indexCache.get(course);
  if (hit) return hit;
  const trained = new Set<string>();
  const linesAt = new Map<string, string[]>();
  for (const line of course.lines) {
    if (line.kind === "warning") continue;
    for (let k = 1; k <= line.sans.length; k++) {
      const id = line.sans.slice(0, k).join(" ");
      trained.add(id);
      const names = linesAt.get(id);
      if (names) {
        if (!names.includes(line.name)) names.push(line.name);
      } else linesAt.set(id, [line.name]);
    }
  }
  const byEpd = new Map<string, MoveNode>();
  const queue: MoveNode[] = [...course.tree];
  for (let i = 0; i < queue.length; i++) {
    const n = queue[i]; // breadth first, so the shallowest node wins
    if (!trained.has(n.id)) continue;
    const key = epd(n.fen);
    if (!byEpd.has(key)) byEpd.set(key, n);
    queue.push(...n.children);
  }
  const idx = { trained, byEpd, linesAt };
  indexCache.set(course, idx);
  return idx;
}

// ---- game preparation ---------------------------------------------------------------------------

export interface PreparedGame {
  game: FetchedGame;
  /** canonical SAN per ply (stops at an illegal move) */
  sans: string[];
  /** position key AFTER each ply */
  after: string[];
  /** FEN before ply i is `fens[i]`; fens has sans.length + 1 entries */
  fens: string[];
}

export function prepareGame(game: FetchedGame): PreparedGame {
  const chess = new Chess();
  const sans: string[] = [];
  const after: string[] = [];
  const fens = [START_FEN];
  for (const s of game.moves) {
    try {
      const m = chess.move(s);
      sans.push(m.san);
      const fen = chess.fen();
      fens.push(fen);
      after.push(epd(fen));
    } catch {
      break;
    }
  }
  return { game, sans, after, fens };
}

/** Which side the user played, matched by username (case-insensitive). */
export function userColorIn(game: FetchedGame, username: string): "white" | "black" | null {
  const u = username.trim().toLowerCase();
  if (game.white.toLowerCase() === u) return "white";
  if (game.black.toLowerCase() === u) return "black";
  return null;
}

// ---- matching -----------------------------------------------------------------------------------

type Outcome = Omit<GameCheck, "game" | "color">;

/** Walk one game through one course. */
export function walkCourse(course: Course, pg: PreparedGame, color: "white" | "black"): Outcome {
  const idx = indexCourse(course);
  let node: MoveNode | null = null;
  const userFirst = color === "white" ? 0 : 1;

  for (let i = 0; i < pg.sans.length; i++) {
    const siblings: MoveNode[] = node ? node.children : course.tree;
    const options = siblings.filter((c) => idx.trained.has(c.id));
    if (options.length === 0) {
      // The course ended (or this node is a dead end of the trained lines).
      return { kind: "followed", courseId: course.id, courseTitle: course.title, depth: i };
    }
    const played = plain(pg.sans[i]);
    const hit = options.find((c) => plain(c.san) === played);
    if (hit) {
      node = hit;
      continue;
    }
    const moved = idx.byEpd.get(pg.after[i]);
    if (moved && moved.ply === i + 1) {
      node = moved; // transposition into another branch
      continue;
    }

    // Divergence at ply i + 1.
    const ply = i + 1;
    const userMoved = (i % 2 === 0) === (color === "white");
    const base = {
      courseId: course.id,
      courseTitle: course.title,
      depth: i,
      ply,
      played: pg.sans[i],
      moveLabel: moveLabel(ply, pg.sans[i]),
      expected: options.map((o) => o.san),
      fen: pg.fens[i],
      positionKey: `${course.id}|${epd(pg.fens[i])}`,
    };
    let kind: CheckKind = userMoved ? "user-deviation" : "opponent-left";
    if (i <= userFirst && (userMoved || (i === 0 && color === "black"))) kind = "uncovered";
    if (kind === "opponent-left" || kind === "uncovered") return { ...base, kind };

    const main = options.find((o) => o.trained) ?? options[0];
    const warned = siblings.some((c) => !idx.trained.has(c.id) && plain(c.san) === played);
    return {
      ...base,
      kind,
      expectedLabel: moveLabel(ply, main.san),
      expectedLines: idx.linesAt.get(main.id) ?? [],
      note: main.note,
      knownMistake: warned,
      engineFine: options.some((o) => o.fine?.some((f) => plain(f) === played)),
    };
  }
  return { kind: "followed", courseId: course.id, courseTitle: course.title, depth: pg.sans.length };
}

export interface MatchOptions {
  /** Course ids to prefer when two courses match equally deep (the ones the user has started). */
  preferIds?: Set<string>;
}

/** Whether a course can be played by `color` (traps-style "both" courses are not checkable). */
export function courseFitsColor(course: Course, color: "white" | "black"): boolean {
  return course.side === color;
}

/** Check one prepared game against the given courses; returns the best (deepest) match. */
export function checkGame(pg: PreparedGame, color: "white" | "black", courses: Course[], opts: MatchOptions = {}): GameCheck {
  let best: Outcome | null = null;
  let bestRank = -1;
  for (const course of courses) {
    if (!courseFitsColor(course, color)) continue;
    const out = walkCourse(course, pg, color);
    // deeper wins; at equal depth prefer started courses, then courses the game followed through.
    const rank = out.depth * 10 + (opts.preferIds?.has(course.id) ? 2 : 0) + (out.kind === "followed" ? 1 : 0);
    if (rank > bestRank) {
      best = out;
      bestRank = rank;
    }
  }
  if (!best) return { game: pg.game, color, kind: "no-course", depth: 0 };
  return { game: pg.game, color, ...best };
}

/** Check many games for `username`. Games where the user isn't a player are returned in `skipped`. */
export function checkGames(
  games: FetchedGame[],
  username: string,
  courses: Course[],
  opts: MatchOptions = {},
): { checks: GameCheck[]; skipped: number } {
  const checks: GameCheck[] = [];
  let skipped = 0;
  for (const g of games) {
    const color = userColorIn(g, username);
    if (!color) {
      skipped++;
      continue;
    }
    checks.push(checkGame(prepareGame(g), color, courses, opts));
  }
  return { checks, skipped };
}
