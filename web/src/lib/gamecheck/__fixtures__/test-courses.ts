// Tiny hand-built courses for matcher tests (same shape as the generated catalogue).
import { Chess } from "chess.js";
import type { Course, Line, LineKind, MoveNode, Side } from "../../types";

export interface LineSpec {
  name: string;
  sans: string[];
  kind?: LineKind;
  notes?: Record<number, string>; // ply -> note
  fine?: Record<number, string[]>; // ply -> fine alternatives
}

export function makeCourse(id: string, side: Side, specs: LineSpec[]): Course {
  const tree: MoveNode[] = [];
  const lines: Line[] = [];
  for (const spec of specs) {
    const chess = new Chess();
    let level = tree;
    const path: string[] = [];
    spec.sans.forEach((san, i) => {
      const m = chess.move(san);
      path.push(m.san);
      const nodeId = path.join(" ");
      let node = level.find((n) => n.id === nodeId);
      if (!node) {
        node = {
          id: nodeId,
          ply: i + 1,
          san: m.san,
          uci: m.from + m.to + (m.promotion ?? ""),
          fen: chess.fen(),
          trained: (i % 2 === 0) === (side === "white"),
          note: spec.notes?.[i + 1],
          fine: spec.fine?.[i + 1],
          children: [],
        };
        level.push(node);
      }
      level = node.children;
    });
    lines.push({
      id: spec.name.toLowerCase().replace(/\W+/g, "-"),
      name: spec.name,
      kind: spec.kind ?? "main",
      sans: path,
      pgn: "",
      plies: path.length,
      mate: false,
    });
  }
  return { id, title: id, side, level: "beginner", eco: "", summary: "", ideas: [], lines, tree };
}

/** White: Italian-ish course with a transposition target and a warning line. */
export const italian = makeCourse("italian", "white", [
  {
    name: "Giuoco Piano",
    sans: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "c3", "Nf6", "d4"],
    notes: { 5: "The bishop eyes f7." },
  },
  { name: "Two Knights", sans: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "d3", "Be7", "O-O"], fine: { 7: ["Ng5"] } },
  { name: "Do not hang the pawn", kind: "warning", sans: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "Nxe5"] },
  // reaches the same position as 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 via 3.Bc4 Nf6... no: via a different move order
  { name: "Move order", sans: ["Nf3", "Nc6", "e4", "e5", "Bc4", "Bc5", "c3", "Nf6", "d4"] },
]);

/** Black: Caro-Kann style. */
export const caro = makeCourse("caro", "black", [
  { name: "Advance", sans: ["e4", "c6", "d4", "d5", "e5", "Bf5", "Nf3", "e6"], notes: { 4: "Challenge the centre." } },
  { name: "Classical", sans: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5"] },
]);
