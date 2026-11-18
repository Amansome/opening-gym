import { describe, expect, it } from "vitest";
import type { Course, MoveNode } from "../types";
import { Chess } from "chess.js";
import { getCourse } from "../courses";
import { PlayEngine } from "../engine/play";
import type { WorkerLike } from "../engine/engine";
import {
  DEFAULT_LEVEL,
  LEVELS,
  START_FEN,
  bookMovesAt,
  bookName,
  buildBook,
  canTakeback,
  chooseBotMove,
  currentFen,
  fensOf,
  goCommand,
  inBook,
  judgeUserMove,
  levelById,
  levelOptions,
  makeMove,
  newPlay,
  outcomeOf,
  pgnOf,
  pickBookMove,
  resign,
  takeback,
  turnOf,
} from "./index";
import type { BotEngine, PlayState } from "./index";

// ---- a small course built by hand: Italian-ish, with a transposition ----------------------------------------------
function node(path: string[], opening?: string, over: Partial<MoveNode> = {}, kids: MoveNode[] = []): MoveNode {
  const c = new Chess();
  const ucis: string[] = [];
  for (const san of path) {
    const m = c.move(san);
    ucis.push(m.from + m.to + (m.promotion ?? ""));
  }
  return {
    id: path.join(" "),
    ply: path.length,
    san: path[path.length - 1],
    uci: ucis[ucis.length - 1],
    fen: c.fen(),
    trained: path.length % 2 === 1,
    opening,
    children: kids,
    ...over,
  };
}

const bc4 = node(["e4", "e5", "Nf3", "Nc6", "Bc4"], "C50 Italian Game", { fine: ["Bb5"] });
const d4node = node(["e4", "e5", "Nf3", "Nc6", "d4"], undefined, {}, []);
const nc6 = node(["e4", "e5", "Nf3", "Nc6"], undefined, {}, [bc4, d4node]);
const nf3 = node(["e4", "e5", "Nf3"], "C40 King's Knight Opening", {}, [nc6]);
const nc3 = node(["e4", "e5", "Nc3"], "C25 Vienna Game", {}, [node(["e4", "e5", "Nc3", "Nf6"], undefined, {}, [node(["e4", "e5", "Nc3", "Nf6", "Nf3"], undefined, {}, [node(["e4", "e5", "Nc3", "Nf6", "Nf3", "Nc6"], undefined, {}, [])])])]);
const e5 = node(["e4", "e5"], undefined, {}, [nf3, nc3]);
const e4 = node(["e4"], "B00 King's Pawn Game", {}, [e5]);

const course: Course = {
  id: "test",
  title: "Test Course",
  side: "white",
  level: "beginner",
  eco: "C50",
  summary: "",
  ideas: [],
  lines: [
    { id: "a", name: "Italian", kind: "main", sans: ["e4", "e5", "Nf3", "Nc6", "Bc4"], pgn: "", plies: 5, mate: false },
    { id: "b", name: "Scotch try", kind: "alternative", sans: ["e4", "e5", "Nf3", "Nc6", "d4"], pgn: "", plies: 5, mate: false },
    { id: "c", name: "Vienna", kind: "warning", sans: ["e4", "e5", "Nc3", "Nf6", "Nf3", "Nc6"], pgn: "", plies: 6, mate: false },
  ],
  tree: [e4],
};
const book = buildBook(course);

function play(state: PlayState, sans: string[], source: "user" | "book" | "engine" = "user"): PlayState {
  let s = state;
  for (const san of sans) {
    const c = new Chess(currentFen(s));
    const m = c.move(san);
    const next = makeMove(s, { from: m.from, to: m.to, promotion: m.promotion }, source);
    if (!next) throw new Error(`illegal ${san}`);
    s = next;
  }
  return s;
}

describe("levels", () => {
  it("has four levels, beginner first and by default", () => {
    expect(LEVELS.map((l) => l.id)).toEqual(["beginner", "casual", "club", "strong"]);
    expect(DEFAULT_LEVEL).toBe("beginner");
    expect(levelById("nonsense").id).toBe("beginner");
    expect(levelById(null).id).toBe("beginner");
  });
  it("gets stronger step by step", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].skill).toBeGreaterThan(LEVELS[i - 1].skill);
      expect(LEVELS[i].depth).toBeGreaterThan(LEVELS[i - 1].depth);
      expect(LEVELS[i].movetime).toBeGreaterThan(LEVELS[i - 1].movetime);
    }
    expect(LEVELS[0].skill).toBe(0);
    expect(LEVELS[3].skill).toBe(20);
  });
  it("maps to UCI options and a capped go command", () => {
    expect(levelOptions(levelById("beginner"))).toEqual(["setoption name Skill Level value 0"]);
    expect(levelOptions(levelById("club"))).toEqual(["setoption name Skill Level value 11"]);
    expect(goCommand(levelById("casual"))).toBe("go depth 4 movetime 300");
  });
  it("never claims Elo numbers", () => {
    for (const l of LEVELS) expect(l.blurb + l.label).not.toMatch(/\d{3,4}|elo/i);
  });
});

describe("book following", () => {
  it("is in book along the course and offers the course moves", () => {
    expect(inBook(book, START_FEN)).toBe(true);
    const after = play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3", "Nc6"]);
    expect(bookMovesAt(book, currentFen(after)).map((m) => m.san)).toEqual(["Bc4", "d4"]); // main line first
    expect(bookName(book, fensOf(after))).toBe("King's Knight Opening");
  });
  it("is out of book after an unknown move and at the end of a line", () => {
    const off = play(newPlay(START_FEN, "white"), ["e4", "c5"]);
    expect(inBook(book, currentFen(off))).toBe(false);
    const end = play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3", "Nc6", "Bc4"]);
    expect(inBook(book, currentFen(end))).toBe(false); // the line ended: nothing left to play
  });
  it("counts a transposition by EPD", () => {
    // 1.Nf3 Nc6 2.e4 e5 is not a path in the tree, but it reaches the position after 1.e4 e5 2.Nf3 Nc6.
    const t = play(newPlay(START_FEN, "white"), ["Nf3", "Nc6", "e4", "e5"]);
    expect(inBook(book, currentFen(t))).toBe(true);
    expect(bookMovesAt(book, currentFen(t)).map((m) => m.san)).toEqual(["Bc4", "d4"]);
    expect(bookName(book, fensOf(t))).toBe("Test Course"); // no position on this path is named in the course
  });
  it("judges the user's move: book, fine, off, or nothing when out of book", () => {
    const fen = currentFen(play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3", "Nc6"]));
    expect(judgeUserMove(book, fen, "f1c4")).toEqual({ kind: "book", san: "Bc4" });
    expect(judgeUserMove(book, fen, "f1b5")).toEqual({ kind: "fine", san: "Bb5", expected: ["Bc4", "d4"] });
    expect(judgeUserMove(book, fen, "h2h3")).toEqual({ kind: "off", san: "h3", expected: ["Bc4", "d4"] });
    const outFen = currentFen(play(newPlay(START_FEN, "white"), ["d4"]));
    expect(judgeUserMove(book, outFen, "d7d5")).toEqual({ kind: "none" });
  });
  it("treats a move that transposes into the course as a book move", () => {
    // after 1.e4 e5 2.Nc3 Nf6 the course has 3.Nf3; 3.Nf3 here is a course move
    const fen = currentFen(play(newPlay(START_FEN, "white"), ["e4", "e5", "Nc3", "Nf6"]));
    expect(judgeUserMove(book, fen, "g1f3").kind).toBe("book");
  });
  it("picks main lines most of the time, alternatives sometimes, never nothing", () => {
    const moves = bookMovesAt(book, currentFen(play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3", "Nc6"])));
    expect(pickBookMove(moves, () => 0)?.san).toBe("Bc4");
    expect(pickBookMove(moves, () => 0.99)?.san).toBe("d4");
    let main = 0;
    for (let i = 0; i < 1000; i++) if (pickBookMove(moves)?.san === "Bc4") main++;
    expect(main).toBeGreaterThan(650);
    expect(main).toBeLessThan(950);
    expect(pickBookMove([])).toBeNull();
  });
  it("indexes a real course", () => {
    const real = getCourse("italian-game");
    expect(real).toBeTruthy();
    const b = buildBook(real!);
    expect(bookMovesAt(b, START_FEN).map((m) => m.san)).toEqual(["e4"]);
  });
});

describe("bot", () => {
  const level = levelById("beginner");
  const fake = (move: string | null): BotEngine & { calls: string[] } => ({
    calls: [],
    async init() {},
    async bestMove(fen) {
      this.calls.push(fen);
      return move;
    },
    stop() {},
    dispose() {},
  });
  it("plays the course while in book without asking the engine", async () => {
    const e = fake("a7a6");
    const fen = currentFen(play(newPlay(START_FEN, "black"), ["e4"]));
    const r = await chooseBotMove({ book, fen, level, engine: e, rng: () => 0 });
    expect(r).toEqual({ uci: "e7e5", source: "book" });
    expect(e.calls).toHaveLength(0);
  });
  it("hands over to the engine out of book", async () => {
    const e = fake("g8f6");
    const fen = currentFen(play(newPlay(START_FEN, "black"), ["d4"]));
    expect(await chooseBotMove({ book, fen, level, engine: e })).toEqual({ uci: "g8f6", source: "engine" });
    expect(e.calls).toEqual([fen]);
  });
  it("returns null when cancelled and replaces an illegal engine move", async () => {
    const fen = currentFen(play(newPlay(START_FEN, "black"), ["d4"]));
    expect(await chooseBotMove({ fen, level, engine: fake(null) })).toBeNull();
    const r = await chooseBotMove({ fen, level, engine: fake("e2e4"), rng: () => 0 });
    expect(r?.fallback).toBe(true);
    expect(r?.source).toBe("engine");
  });
});

describe("game state", () => {
  it("detects checkmate", () => {
    const s = play(newPlay(START_FEN, "white"), ["f3", "e5", "g4", "Qh4#"]);
    expect(outcomeOf(s)).toEqual({ kind: "checkmate", winner: "black", result: "0-1" });
    expect(makeMove(s, { from: "a2", to: "a3" }, "user")).toBeNull();
  });
  it("detects stalemate", () => {
    const s = newPlay("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1", "black");
    expect(outcomeOf(s)).toEqual({ kind: "stalemate", winner: null, result: "1/2-1/2" });
  });
  it("detects insufficient material", () => {
    expect(outcomeOf(newPlay("8/8/4k3/8/8/3K4/8/8 w - - 0 1", "white"))?.kind).toBe("insufficient");
    expect(outcomeOf(newPlay("8/8/4k3/8/8/3KB3/8/8 w - - 0 1", "white"))?.kind).toBe("insufficient");
    expect(outcomeOf(newPlay("8/8/4k3/8/8/3KR3/8/8 w - - 0 1", "white"))).toBeNull();
  });
  it("detects threefold repetition", () => {
    const shuffle = ["Nf3", "Nf6", "Ng1", "Ng8"];
    let s = play(newPlay(START_FEN, "white"), shuffle);
    expect(outcomeOf(s)).toBeNull();
    s = play(s, shuffle);
    expect(outcomeOf(s)).toEqual({ kind: "threefold", winner: null, result: "1/2-1/2" });
  });
  it("detects the fifty-move rule", () => {
    expect(outcomeOf(newPlay("4k3/8/8/8/8/8/4R3/4K3 w - - 100 80", "white"))?.kind).toBe("fifty");
    expect(outcomeOf(newPlay("4k3/8/8/8/8/8/4R3/4K3 w - - 99 80", "white"))).toBeNull();
  });
  it("resigning ends the game in the bot's favour", () => {
    const s = resign(play(newPlay(START_FEN, "black"), ["e4"]));
    expect(outcomeOf(s)).toEqual({ kind: "resign", winner: "white", result: "1-0" });
  });
  it("takes back one full move (the bot's reply and the user's move)", () => {
    const s = play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3", "Nc6"]);
    const t = takeback(s);
    expect(t.moves.map((m) => m.san)).toEqual(["e4", "e5"]);
    expect(turnOf(t)).toBe("white");
  });
  it("takes back just the user's move when the bot has not replied", () => {
    const s = play(newPlay(START_FEN, "white"), ["e4", "e5", "Nf3"]);
    expect(takeback(s).moves.map((m) => m.san)).toEqual(["e4", "e5"]);
  });
  it("keeps the bot's opening move when the user plays black", () => {
    const start = play(newPlay(START_FEN, "black"), ["e4"], "book");
    expect(canTakeback(start)).toBe(false);
    expect(takeback(start)).toBe(start);
    const s = play(start, ["c5", "Nf3"]);
    expect(takeback(s).moves.map((m) => m.san)).toEqual(["e4"]);
  });
  it("takeback after a finished game reopens it", () => {
    const s = play(newPlay(START_FEN, "black"), ["f3", "e5", "g4", "Qh4#"]);
    expect(outcomeOf(s)).not.toBeNull();
    const t = takeback(resign(takeback(s)));
    expect(outcomeOf(t)).toBeNull();
  });
  it("writes a PGN with the result and a bot name", () => {
    const s = resign(play(newPlay(START_FEN, "white"), ["e4", "e5"]));
    const pgn = pgnOf(s, levelById("casual"), new Date(2026, 0, 5));
    expect(pgn).toContain('[White "You"]');
    expect(pgn).toContain('[Black "Opening Gym bot (Casual)"]');
    expect(pgn).toContain('[Date "2026.01.05"]');
    expect(pgn).toContain("1. e4 e5");
    expect(pgn.trim().endsWith("0-1")).toBe(true); // White (the user) resigned
  });
});

describe("PlayEngine", () => {
  class Fake implements WorkerLike {
    onmessage: WorkerLike["onmessage"] = null;
    onerror: WorkerLike["onerror"] = null;
    sent: string[] = [];
    postMessage(msg: string) {
      this.sent.push(msg);
      if (msg === "uci") queueMicrotask(() => this.onmessage?.({ data: "uciok" }));
      if (msg === "isready") queueMicrotask(() => this.onmessage?.({ data: "readyok" }));
      if (msg.startsWith("go")) queueMicrotask(() => this.onmessage?.({ data: "bestmove e7e5 ponder g1f3" }));
    }
    terminate() {}
  }
  it("sets the level and a capped search, then returns the best move", async () => {
    const w = new Fake();
    const engine = new PlayEngine(() => w);
    const best = await engine.bestMove("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", levelById("casual"));
    expect(best).toBe("e7e5");
    expect(w.sent).toContain("setoption name Skill Level value 4");
    expect(w.sent).toContain("go depth 4 movetime 300");
    expect(engine.getStatus().status).toBe("ready");
  });
  it("reports an error when the worker fails to start", async () => {
    const w = new Fake();
    w.postMessage = () => {}; // never answers
    const engine = new PlayEngine(() => w);
    const p = engine.init();
    w.onerror?.({ message: "boom" });
    await expect(p).rejects.toThrow();
    expect(engine.getStatus().status).toBe("error");
  });
});
