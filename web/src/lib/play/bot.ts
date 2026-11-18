// Choosing the bot's move: the course while the game is in book, Stockfish afterwards.
import type { Book } from "./book";
import { bookMovesAt, pickBookMove } from "./book";
import type { Level } from "./levels";
import { legalUci } from "./game";

/** What the bot needs from an engine. The real one is `PlayEngine` (lib/engine/play.ts); tests use a fake. */
export interface BotEngine {
  /** Start (or wait for) the engine. Rejects when it cannot start. */
  init(): Promise<void>;
  /** Best move in UCI for the position at the given level; null when the search was cancelled. */
  bestMove(fen: string, level: Level): Promise<string | null>;
  /** Cancel a search in flight. */
  stop(): void;
  dispose(): void;
}

export interface BotChoice {
  uci: string;
  source: "book" | "engine";
  /** the engine's move was not legal and a random legal move was played instead (should never happen) */
  fallback?: boolean;
}

export interface ChooseOptions {
  book?: Book;
  fen: string;
  level: Level;
  engine: BotEngine;
  rng?: () => number;
}

/** Returns null when the search was cancelled (the caller moved on). Rejects when the engine fails. */
export async function chooseBotMove({ book, fen, level, engine, rng = Math.random }: ChooseOptions): Promise<BotChoice | null> {
  const course = pickBookMove(bookMovesAt(book, fen), rng);
  if (course) return { uci: course.uci, source: "book" };
  const legal = legalUci(fen);
  if (legal.length === 0) return null;
  await engine.init();
  const uci = await engine.bestMove(fen, level);
  if (uci === null) return null;
  if (legal.includes(uci)) return { uci, source: "engine" };
  return { uci: legal[Math.floor(rng() * legal.length)], source: "engine", fallback: true };
}
