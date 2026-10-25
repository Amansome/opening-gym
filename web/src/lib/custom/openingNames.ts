// Opening names for custom courses, borrowed from the built-in catalogue: every built-in tree node
// that carries a name is indexed by its position (FEN without move counters), so transpositions match.
import { courses } from "../courses";
import type { MoveNode } from "../types";

export const epdOf = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

let index: Map<string, string> | undefined;

function build(): Map<string, string> {
  const map = new Map<string, string>();
  const walk = (nodes: MoveNode[]) => {
    for (const n of nodes) {
      if (n.opening) {
        const key = epdOf(n.fen);
        if (!map.has(key)) map.set(key, n.opening);
      }
      walk(n.children);
    }
  };
  for (const c of courses) walk(c.tree);
  return map;
}

/** "C54 Italian Game: Classical Variation" for a position the built-in courses name, else undefined. */
export function lookupOpeningName(fen: string): string | undefined {
  index ??= build();
  return index.get(epdOf(fen));
}

export type OpeningLookup = (fen: string) => string | undefined;
