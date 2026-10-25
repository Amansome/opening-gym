// The editable model behind the creator: a move tree whose leaves are the course's lines.
// Pure and immutable (every update returns a new tree) so React state and tests stay simple.
import { Chess } from "chess.js";
import type { Course, LineKind, MoveNode } from "../types";
import type { PgnGame, PgnNode } from "./pgn";

export interface DraftNode {
  san: string;
  /** Explanation shown after this move is played in the trainer */
  note?: string;
  /** Only meaningful on leaves (the move that ends a line) */
  name?: string;
  kind?: LineKind;
  children: DraftNode[];
}
export type DraftTree = DraftNode[];
/** SAN moves from the start position */
export type Path = string[];

export interface DraftLine {
  name?: string;
  kind: LineKind;
  sans: string[];
  /** notes[i] explains move i (0-based ply) */
  notes: (string | undefined)[];
}

export const label = (ply: number, san: string) => `${Math.ceil(ply / 2)}${ply % 2 === 1 ? "." : "..."}${san}`;

export function getNode(tree: DraftTree, path: Path): DraftNode | undefined {
  let level = tree;
  let node: DraftNode | undefined;
  for (const san of path) {
    node = level.find((n) => n.san === san);
    if (!node) return undefined;
    level = node.children;
  }
  return node;
}

/** Applies `fn` to the node at `path` and returns the new tree (unchanged when the path does not exist). */
export function updateNode(tree: DraftTree, path: Path, fn: (n: DraftNode) => DraftNode): DraftTree {
  if (path.length === 0) return tree;
  const [head, ...rest] = path;
  let hit = false;
  const next = tree.map((n) => {
    if (n.san !== head) return n;
    hit = true;
    return rest.length === 0 ? fn(n) : { ...n, children: updateNode(n.children, rest, fn) };
  });
  return hit ? next : tree;
}

/** Adds `san` after `path` (no-op when it is already there). A leaf's line name/kind moves to the new move. */
export function addMove(tree: DraftTree, path: Path, san: string): DraftTree {
  const add = (children: DraftNode[]): DraftNode[] =>
    children.some((c) => c.san === san) ? children : [...children, { san, children: [] }];
  if (path.length === 0) return add(tree);
  return updateNode(tree, path, (n) => {
    if (n.children.some((c) => c.san === san)) return n;
    const child: DraftNode = { san, children: [] };
    let parent = n;
    if (n.children.length === 0) {
      if (n.name !== undefined) child.name = n.name;
      if (n.kind !== undefined) child.kind = n.kind;
      const { name: _name, kind: _kind, ...rest } = n;
      void _name;
      void _kind;
      parent = rest as DraftNode;
    }
    return { ...parent, children: [...parent.children, child] };
  });
}

export function setNote(tree: DraftTree, path: Path, note: string): DraftTree {
  return updateNode(tree, path, (n) => {
    const { note: _old, ...rest } = n;
    void _old;
    return note.trim() ? { ...rest, note } : (rest as DraftNode);
  });
}

/** Name and/or kind of the line that ends at the leaf at `path`. Empty name clears it. */
export function setLeafMeta(tree: DraftTree, path: Path, meta: { name?: string; kind?: LineKind }): DraftTree {
  return updateNode(tree, path, (n) => {
    const next = { ...n };
    if (meta.name !== undefined) {
      if (meta.name.trim()) next.name = meta.name;
      else delete next.name;
    }
    if (meta.kind !== undefined) next.kind = meta.kind;
    return next;
  });
}

/** Removes the move at `path` and everything after it. */
export function deleteNode(tree: DraftTree, path: Path): DraftTree {
  if (path.length === 0) return tree;
  if (path.length === 1) return tree.filter((n) => n.san !== path[0]);
  return updateNode(tree, path.slice(0, -1), (n) => ({ ...n, children: n.children.filter((c) => c.san !== path[path.length - 1]) }));
}

export interface Leaf {
  path: Path;
  node: DraftNode;
}

export function leaves(tree: DraftTree): Leaf[] {
  const out: Leaf[] = [];
  const walk = (nodes: DraftNode[], prefix: Path) => {
    for (const n of nodes) {
      const path = [...prefix, n.san];
      if (n.children.length === 0) out.push({ path, node: n });
      else walk(n.children, path);
    }
  };
  walk(tree, []);
  return out;
}

export function draftToLines(tree: DraftTree): DraftLine[] {
  return leaves(tree).map(({ path, node }) => {
    const notes: (string | undefined)[] = [];
    let level = tree;
    for (const san of path) {
      const n = level.find((x) => x.san === san)!;
      notes.push(n.note);
      level = n.children;
    }
    return { name: node.name, kind: node.kind ?? "main", sans: path, notes };
  });
}

/** FEN after playing `path` from the start, or undefined if a move is illegal. */
export function fenAt(path: Path): string | undefined {
  const c = new Chess();
  try {
    for (const san of path) c.move(san);
  } catch {
    return undefined;
  }
  return c.fen();
}

export function countMoves(tree: DraftTree): number {
  return tree.reduce((n, c) => n + 1 + countMoves(c.children), 0);
}

/**
 * Merges the games of a parsed PGN into a draft tree. Identical move paths are shared; where a note
 * already exists, the existing one wins. Each leaf gets a name from the game (variations: "Game (3...Nf6)").
 */
export function mergeGames(tree: DraftTree, games: PgnGame[]): DraftTree {
  let out = tree;
  for (const g of games) out = mergeGame(out, g);
  return out;
}

export function mergeGame(tree: DraftTree, game: PgnGame): DraftTree {
  const base = game.name;
  const merge = (existing: DraftNode[], incoming: PgnNode[], ply: number, main: boolean, divergence?: string): DraftNode[] => {
    let out = existing;
    incoming.forEach((p, k) => {
      const childMain = main && k === 0;
      const pl = ply + 1;
      const div = divergence ?? (childMain ? undefined : label(pl, p.san));
      const idx = out.findIndex((d) => d.san === p.san);
      const prev: DraftNode = idx >= 0 ? out[idx] : { san: p.san, children: [] };
      const node: DraftNode = { ...prev };
      if (p.comment && !node.note) node.note = p.comment;
      node.children = merge(prev.children, p.children, pl, childMain, div);
      if (p.children.length === 0 && node.children.length === 0) {
        const nm = childMain ? base : `${base ?? "Variation"} (${div})`;
        if (nm && !node.name) node.name = nm;
      }
      // a node that now has children is no longer a line end
      if (node.children.length > 0) {
        delete node.name;
        delete node.kind;
      }
      out = idx >= 0 ? out.map((d, i) => (i === idx ? node : d)) : [...out, node];
    });
    return out;
  };
  return merge(tree, game.children, 0, true);
}

/** Rebuilds the editable tree of an existing (custom) course; line names and kinds go on the leaves. */
export function courseToDraft(course: Course): DraftTree {
  const byPath = new Map(course.lines.map((l) => [l.sans.join(" "), l]));
  const walk = (nodes: MoveNode[], prefix: string[]): DraftNode[] =>
    nodes.map((n) => {
      const path = [...prefix, n.san];
      const d: DraftNode = { san: n.san, children: walk(n.children, path) };
      if (n.note) d.note = n.note;
      if (n.children.length === 0) {
        const line = byPath.get(path.join(" "));
        if (line) {
          d.name = line.name;
          d.kind = line.kind;
        }
      }
      return d;
    });
  return walk(course.tree, []);
}

/** Removes the line that ends at the leaf `path`: its moves back to where it branches off another line. */
export function deleteLine(tree: DraftTree, path: Path): DraftTree {
  let m = path.length;
  while (m > 1 && (getNode(tree, path.slice(0, m - 1))?.children.length ?? 0) === 1) m--;
  return deleteNode(tree, path.slice(0, m));
}
