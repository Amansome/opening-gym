// The generated puzzle set is a separate chunk: it loads on first use (and the service worker precaches it for offline).
import type { Puzzle, PuzzleFile } from "./types";

let cached: Promise<Puzzle[]> | null = null;

export function loadPuzzles(): Promise<Puzzle[]> {
  cached ??= import("../../data/puzzles.json").then(
    (m) => (m.default as unknown as PuzzleFile).puzzles,
    (e) => {
      cached = null; // allow a retry
      throw e;
    },
  );
  return cached;
}
