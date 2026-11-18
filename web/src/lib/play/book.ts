// Following a course while playing. A course tree is indexed by EPD (placement, side to move, castling,
// en passant), so a position reached by a different move order still counts as "in book".
import { Chess } from "chess.js";
import type { Course, MoveNode } from "../types";
import { epd } from "../engine/positions";

/** 0 = on a main line, 1 = only on an alternative line, 2 = only on a warning line. */
export type BookRank = 0 | 1 | 2;

export interface BookMove {
  san: string;
  uci: string;
  /** position after the move */
  fen: string;
  rank: BookRank;
  /** a move the user is meant to find (as opposed to an opponent reply) */
  trained: boolean;
  /** other SANs the engine rates about as good as the course move */
  fine: string[];
}

export interface Book {
  courseId: string;
  title: string;
  /** EPD of a position -> the course moves played from it (merged over transpositions) */
  moves: Map<string, BookMove[]>;
  /** EPD -> opening name from the course data (ECO code removed) */
  names: Map<string, string>;
}

export function stripEco(name: string): string {
  return name.replace(/^[A-E]\d\d\s+/, "");
}

const START_EPD = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -";

export function buildBook(course: Course): Book {
  const rankOf = new Map<string, BookRank>();
  for (const line of course.lines) {
    const r: BookRank = line.kind === "main" ? 0 : line.kind === "alternative" ? 1 : 2;
    for (let k = 1; k <= line.sans.length; k++) {
      const id = line.sans.slice(0, k).join(" ");
      const prev = rankOf.get(id);
      if (prev === undefined || r < prev) rankOf.set(id, r);
    }
  }
  const moves = new Map<string, BookMove[]>();
  const names = new Map<string, string>();
  const add = (key: string, node: MoveNode) => {
    let list = moves.get(key);
    if (!list) moves.set(key, (list = []));
    const rank = rankOf.get(node.id) ?? 1;
    const existing = list.find((m) => m.uci === node.uci);
    if (existing) {
      if (rank < existing.rank) existing.rank = rank;
      return;
    }
    list.push({ san: node.san, uci: node.uci, fen: node.fen, rank, trained: node.trained, fine: node.fine ?? [] });
  };
  const walk = (key: string, nodes: MoveNode[]) => {
    for (const node of nodes) {
      add(key, node);
      const next = epd(node.fen);
      if (node.opening && !names.has(next)) names.set(next, stripEco(node.opening));
      walk(next, node.children);
    }
  };
  walk(START_EPD, course.tree);
  return { courseId: course.id, title: course.title, moves, names };
}

/** The course moves from this position, best (main line) first. Empty when out of book or the line has ended. */
export function bookMovesAt(book: Book | undefined, fen: string): BookMove[] {
  if (!book) return [];
  const list = book.moves.get(epd(fen));
  return list ? [...list].sort((a, b) => a.rank - b.rank) : [];
}

export function inBook(book: Book | undefined, fen: string): boolean {
  return bookMovesAt(book, fen).length > 0;
}

const WEIGHT: Record<BookRank, number> = { 0: 10, 1: 3, 2: 1 };

/** Pick one of the course moves: main lines most often, alternatives sometimes, warning lines rarely. */
export function pickBookMove(moves: BookMove[], rng: () => number = Math.random): BookMove | null {
  if (moves.length === 0) return null;
  const total = moves.reduce((n, m) => n + WEIGHT[m.rank], 0);
  let r = rng() * total;
  for (const m of moves) {
    r -= WEIGHT[m.rank];
    if (r < 0) return m;
  }
  return moves[moves.length - 1];
}

export type BookVerdict =
  | { kind: "none" } // the position before the move was not in book, so nothing to judge
  | { kind: "book"; san: string }
  | { kind: "fine"; san: string; expected: string[] }
  | { kind: "off"; san: string; expected: string[] };

const plain = (san: string) => san.replace(/[+#?!]/g, "");

/** Judge a move the user played from `fenBefore` against the course. A transposition into a course position counts. */
export function judgeUserMove(book: Book | undefined, fenBefore: string, uci: string): BookVerdict {
  const options = bookMovesAt(book, fenBefore);
  if (options.length === 0) return { kind: "none" };
  let san = "";
  let after = "";
  try {
    const c = new Chess(fenBefore);
    const made = c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    san = made.san;
    after = c.fen();
  } catch {
    return { kind: "none" };
  }
  const afterKey = epd(after);
  if (options.some((m) => m.uci === uci || epd(m.fen) === afterKey)) return { kind: "book", san };
  const expected = options.map((m) => m.san);
  const fine = new Set(options.flatMap((m) => m.fine).map(plain));
  if (fine.has(plain(san))) return { kind: "fine", san, expected };
  return { kind: "off", san, expected };
}

/** Name for the "In book" strip: the deepest position on the way to here that the course names, else the course title. */
export function bookName(book: Book, fens: string[], fallbackName?: (fen: string) => string | undefined): string {
  for (let i = fens.length - 1; i >= 0; i--) {
    const n = book.names.get(epd(fens[i])) ?? fallbackName?.(fens[i]);
    if (n) return stripEco(n);
  }
  return book.title;
}
