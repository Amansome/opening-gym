import type { Puzzle } from "./types";

const base = { gain: 3, label: "Win a piece", level: 1 as const, side: "white" as const, mine: true, sources: [{ courseId: "italian-game", lineId: "l1", lineName: "Main line" }] };

/** Three-move sequence from the start position: solver e4, opponent e5, solver Nf3 (the moves need only be legal). */
export const longPuzzle: Puzzle = {
  ...base,
  id: "p-long",
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  turn: "white",
  moves: ["e2e4", "e7e5", "g1f3"],
  san: ["e4", "e5", "Nf3"],
  kind: "material",
};

/** Back-rank mate: Rd8# and Re8# both mate. */
export const matePuzzle: Puzzle = {
  ...base,
  id: "p-mate",
  fen: "6k1/5ppp/8/8/8/8/5PPP/3RR1K1 w - - 0 1",
  turn: "white",
  moves: ["d1d8"],
  san: ["Rd8#"],
  kind: "mate",
  mateIn: 1,
  label: "Mate in 1",
  gain: undefined,
};

export const blackPuzzle: Puzzle = {
  ...base,
  id: "p-black",
  fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
  turn: "black",
  moves: ["g8f6"],
  san: ["Nf6"],
  kind: "material",
  level: 3,
  side: "black",
  sources: [{ courseId: "petrov-defence", lineId: "x", lineName: "Line X" }],
};
