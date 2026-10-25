// PGN reader for the course creator.
// Supports: several games per file, variations "( ... )" (nested), comments "{ ... }" and ";" comments,
// NAGs ($1) and "!"/"?" suffixes, move numbers in any spacing ("1.e4", "1. e4", "1...e5"), results,
// 0-0 castling, escape lines ("%"), Lichess study extras ([%cal ...] / [%clk ...] commands are stripped).
// Games that start from a custom FEN or are not standard chess are rejected with a clear message.
import { Chess } from "chess.js";

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export interface PgnNode {
  san: string; // normalised by chess.js
  fen: string; // position after the move
  comment?: string;
  /** "!", "?", "!!", "??", "!?" or "?!" when the PGN carried one (suffix or NAG 1-6) */
  annotation?: string;
  children: PgnNode[]; // children[0] is the main continuation, the rest are variations
}

export interface PgnGame {
  /** 1-based position in the file */
  index: number;
  headers: Record<string, string>;
  /** Readable name from [ChapterName] or [Event], when there is one */
  name?: string;
  /** Comment before the first move */
  comment?: string;
  children: PgnNode[];
}

export interface PgnIssue {
  game: number;
  name?: string;
  message: string;
}

export interface PgnParseResult {
  games: PgnGame[];
  /** Games that could not be read; they are not in `games` */
  errors: PgnIssue[];
  /** Things worth telling the user that did not stop a game from loading */
  warnings: PgnIssue[];
}

const NAG_GLYPH: Record<number, string> = { 1: "!", 2: "?", 3: "!!", 4: "??", 5: "!?", 6: "?!" };
const RESULTS = new Set(["1-0", "0-1", "1/2-1/2", "*"]);
const TAG_RE = /\[\s*([A-Za-z0-9_]+)\s+"((?:[^"\\]|\\.)*)"\s*\]/y;

const epd = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

/** Strips engine/drawing commands such as [%cal Gd2d4] or [%clk 0:01:00] and tidies whitespace. */
export function cleanComment(raw: string): string {
  return raw.replace(/\[%[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
}

function joinComments(a: string | undefined, b: string): string {
  return a ? `${a} ${b}` : b;
}

/** "Chapter name" from the headers, ignoring PGN placeholders. */
export function gameName(headers: Record<string, string>): string | undefined {
  const bad = (v?: string) => !v || !v.trim() || v.trim() === "?" || v.trim() === "-";
  if (!bad(headers.ChapterName)) return headers.ChapterName.trim();
  if (!bad(headers.Event)) return headers.Event.trim();
  return undefined;
}

interface Frame {
  /** position node whose children the next move extends (null = before the first move of a variation start, i.e. unavailable) */
  parent: PgnNode | null; // node BEFORE the last move (root = ROOT sentinel)
  cur: PgnNode; // node after the last move
}

const ROOT_SENTINEL = (): PgnNode => ({ san: "", fen: START_FEN, children: [] });

function moveLabel(fen: string): string {
  const parts = fen.split(" ");
  return `${parts[1] === "w" ? parts[5] + "." : parts[5] + "..."}`;
}

/** Reads every game in `text`. Never throws: problems come back in `errors`. */
export function parsePgn(text: string): PgnParseResult {
  const s = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const n = s.length;
  const result: PgnParseResult = { games: [], errors: [], warnings: [] };
  let i = 0;
  let gameNo = 0;

  const skipWs = () => {
    while (i < n && /\s/.test(s[i])) i++;
  };
  const atLineStart = (pos: number) => pos === 0 || s[pos - 1] === "\n";

  while (true) {
    skipWs();
    // % escape lines and stray ';' comments between games
    while (i < n && ((s[i] === "%" && atLineStart(i)) || s[i] === ";")) {
      const nl = s.indexOf("\n", i);
      i = nl < 0 ? n : nl + 1;
      skipWs();
    }
    if (i >= n) break;

    // --- headers
    const headers: Record<string, string> = {};
    let sawHeader = false;
    while (i < n && s[i] === "[") {
      TAG_RE.lastIndex = i;
      const m = TAG_RE.exec(s);
      if (!m) break;
      headers[m[1]] = m[2].replace(/\\(["\\])/g, "$1");
      sawHeader = true;
      i = TAG_RE.lastIndex;
      skipWs();
    }
    if (i < n && s[i] === "[" && !sawHeader) {
      // not a tag pair and not inside a game: skip the stray bracket to avoid looping forever
      i++;
      continue;
    }

    gameNo++;
    const name = gameName(headers);
    let error: string | undefined;
    const fail = (msg: string) => {
      if (!error) error = msg;
    };

    // --- header checks
    const variant = (headers.Variant ?? "").trim().toLowerCase();
    if (variant && !["standard", "chess", "normal"].includes(variant)) {
      fail(`Only standard chess is supported (this game is "${headers.Variant}").`);
    }
    if (headers.FEN && epd(headers.FEN.trim()) !== epd(START_FEN)) {
      fail("This game starts from a custom position (FEN). Only games that start from the initial position are supported for now.");
    }

    // --- movetext
    const root = ROOT_SENTINEL();
    let frame: Frame = { parent: null, cur: root };
    const stack: Frame[] = [];
    let pending: string | undefined; // comment waiting for the next move
    let gameComment: string | undefined;
    let moves = 0;
    let ended = false;

    const attach = (text: string) => {
      const c = cleanComment(text);
      if (!c) return;
      if (frame.parent === null) {
        // before the first move of this line: belongs to the next move (or to the game at the very start)
        if (stack.length === 0 && moves === 0) gameComment = joinComments(gameComment, c);
        else pending = joinComments(pending, c);
      } else {
        frame.cur.comment = joinComments(frame.cur.comment, c);
      }
    };

    while (i < n && !ended) {
      skipWs();
      if (i >= n) break;
      const ch = s[i];
      if (ch === "{") {
        const end = s.indexOf("}", i + 1);
        const body = s.slice(i + 1, end < 0 ? n : end);
        i = end < 0 ? n : end + 1;
        if (end < 0) fail("A comment is never closed (missing \"}\").");
        if (!error) attach(body);
        continue;
      }
      if (ch === ";") {
        const nl = s.indexOf("\n", i);
        if (!error) attach(s.slice(i + 1, nl < 0 ? n : nl));
        i = nl < 0 ? n : nl + 1;
        continue;
      }
      if (ch === "%" && atLineStart(i)) {
        const nl = s.indexOf("\n", i);
        i = nl < 0 ? n : nl + 1;
        continue;
      }
      if (ch === "[") {
        TAG_RE.lastIndex = i;
        if (TAG_RE.test(s) && stack.length === 0) break; // next game starts here
        i++;
        continue;
      }
      if (ch === "(") {
        i++;
        if (error) {
          stack.push(frame);
          continue;
        }
        if (frame.parent === null) {
          fail("A variation starts before any move.");
          stack.push(frame);
          continue;
        }
        stack.push(frame);
        // the variation replaces the last move: continue from the position before it
        frame = { parent: null, cur: frame.parent };
        pending = undefined;
        continue;
      }
      if (ch === ")") {
        i++;
        const back = stack.pop();
        if (!back) {
          fail("A closing parenthesis \")\" has no matching \"(\".");
          continue;
        }
        frame = back;
        pending = undefined;
        continue;
      }
      if (ch === "$") {
        const m = /^\$(\d+)/.exec(s.slice(i, i + 8));
        i += m ? m[0].length : 1;
        if (m && !error && frame.parent !== null) {
          const g = NAG_GLYPH[Number(m[1])];
          if (g && !frame.cur.annotation) frame.cur.annotation = g;
        }
        continue;
      }

      // --- a token: move number, move or result
      const start = i;
      while (i < n && !/[\s{}();$]/.test(s[i]) && !(s[i] === "[" && i > start)) i++;
      let tok = s.slice(start, i);
      if (!tok) {
        i++;
        continue;
      }
      if (RESULTS.has(tok)) {
        if (stack.length === 0) ended = true;
        continue;
      }
      tok = tok.replace(/^\d+\.+/, "");
      if (!tok || /^\.+$/.test(tok) || /^\d+$/.test(tok)) continue;
      if (error) continue;

      let annotation = "";
      const sfx = /[!?]+$/.exec(tok);
      if (sfx) {
        annotation = sfx[0];
        tok = tok.slice(0, -sfx[0].length);
      }
      tok = tok.replace(/e\.p\.$/, "");
      if (tok === "--" || tok === "Z0" || tok === "@@@@") {
        fail("Null moves are not supported.");
        continue;
      }
      if (/^[0O]-[0O](-[0O])?[+#]?$/.test(tok)) tok = tok.replace(/0/g, "O");

      const fromFen = frame.cur.fen;
      let mv;
      try {
        mv = new Chess(fromFen).move(tok);
      } catch {
        mv = null;
      }
      if (!mv) {
        fail(`Illegal or unreadable move "${tok}" at move ${moveLabel(fromFen)} (after ${frame.cur.san || "the start"}).`);
        continue;
      }
      const c2 = new Chess(fromFen);
      c2.move(mv.san);
      const node: PgnNode = { san: mv.san, fen: c2.fen(), children: [] };
      if (pending) {
        node.comment = pending;
        pending = undefined;
      }
      if (annotation && ["!", "?", "!!", "??", "!?", "?!"].includes(annotation)) node.annotation = annotation;
      frame.cur.children.push(node);
      frame = { parent: frame.cur, cur: node };
      moves++;
    }
    if (stack.length > 0) fail("A variation is never closed (missing \")\").");

    if (moves === 0 && !error) {
      // a header-only chapter or stray text: nothing to import
      if (sawHeader) result.warnings.push({ game: gameNo, name, message: "Has no moves, skipped." });
      continue;
    }
    if (error) {
      result.errors.push({ game: gameNo, name, message: error });
    } else {
      result.games.push({
        index: gameNo,
        headers,
        name,
        comment: gameComment,
        children: root.children,
      });
    }
  }
  return result;
}

/** Number of plies in the main line of a game. */
export function mainlineLength(game: PgnGame): number {
  let len = 0;
  let level = game.children;
  while (level.length) {
    len++;
    level = level[0].children;
  }
  return len;
}
