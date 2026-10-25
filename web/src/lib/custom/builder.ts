// Turns draft lines into a Course (move tree, line list, opening names) and checks the
// "one answer per position" rule the trainer depends on.
import { Chess } from "chess.js";
import type { Course, Level, Line, LineKind, MoveNode, Side } from "../types";
import { draftToLines, label } from "./draft";
import type { DraftLine, DraftTree } from "./draft";
import { epdOf, lookupOpeningName } from "./openingNames";
import type { OpeningLookup } from "./openingNames";

export interface BuildWarning {
  code: "conflict" | "no-trained-move" | "empty-line";
  message: string;
  /** index into the input lines (for a conflict: into the lines as built, i.e. course.lines) */
  lineIndex: number;
  otherLineIndex?: number;
  /** moves of the line the warning is about (the later line for a conflict), to find it again in the draft tree */
  sans: string[];
}

export interface BuildInput {
  id?: string;
  title: string;
  summary?: string;
  side: Exclude<Side, "both"> | "both";
  level?: Level;
  createdAt?: number;
  lines: DraftLine[];
  /** "warn" (default) keeps conflicting lines as main lines and reports them; "alternative" marks the later ones as alternatives */
  conflicts?: "warn" | "alternative";
  lookup?: OpeningLookup;
}

export interface BuildResult {
  course?: Course;
  errors: string[];
  warnings: BuildWarning[];
  /** The lines the course was built from (after skipping unusable ones and resolving conflicts), same order as course.lines */
  lines: DraftLine[];
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40)
      .replace(/-$/, "") || "course"
  );
}

export function newCourseId(title: string, rnd: () => number = Math.random): string {
  let suffix = "";
  while (suffix.length < 5) suffix += Math.floor(rnd() * 36).toString(36);
  return `custom-${slugify(title)}-${suffix}`;
}

const trainedPly = (side: Side, ply: number) => side === "both" || (side === "white" ? ply % 2 === 1 : ply % 2 === 0);

interface Conflict {
  lineIndex: number;
  otherLineIndex: number;
  ply: number;
  san: string;
  otherSan: string;
}

/** Replays lines and returns the positions where a later main line gives a different answer than an earlier one. */
export function findConflicts(lines: DraftLine[], side: Side): Conflict[] {
  if (side === "both") return [];
  const answers = new Map<string, { san: string; line: number }>();
  const out: Conflict[] = [];
  lines.forEach((line, li) => {
    if (line.kind !== "main") return;
    const chess = new Chess();
    const mine: [string, string][] = [];
    let conflict: Conflict | undefined;
    for (let i = 0; i < line.sans.length; i++) {
      const ply = i + 1;
      const key = epdOf(chess.fen());
      const san = line.sans[i];
      if (trainedPly(side, ply)) {
        const seen = answers.get(key);
        if (seen && seen.san !== san && !conflict) conflict = { lineIndex: li, otherLineIndex: seen.line, ply, san, otherSan: seen.san };
        else if (!seen) mine.push([key, san]);
      }
      try {
        chess.move(san);
      } catch {
        break;
      }
    }
    if (conflict) out.push(conflict);
    else for (const [key, san] of mine) answers.set(key, { san, line: li });
  });
  return out;
}

/** Marks the later line of every conflict as an alternative (alternatives may differ from the main answer). */
export function resolveConflicts(lines: DraftLine[], side: Side): DraftLine[] {
  const later = new Set(findConflicts(lines, side).map((c) => c.lineIndex));
  return lines.map((l, i) => (later.has(i) ? { ...l, kind: "alternative" as LineKind } : l));
}

export function buildCourse(input: BuildInput): BuildResult {
  const { side } = input;
  const lookup = input.lookup ?? lookupOpeningName;
  const errors: string[] = [];
  const warnings: BuildWarning[] = [];
  const title = input.title.trim();
  if (!title) errors.push("Give the course a name.");

  // 1. validate and drop unusable lines
  let usable: DraftLine[] = [];
  input.lines.forEach((line, idx) => {
    if (line.sans.length === 0) {
      warnings.push({ code: "empty-line", message: "A line without moves was skipped.", lineIndex: idx, sans: [] });
      return;
    }
    const chess = new Chess();
    for (let i = 0; i < line.sans.length; i++) {
      try {
        chess.move(line.sans[i]);
      } catch {
        errors.push(`"${line.name ?? `Line ${idx + 1}`}": illegal move ${label(i + 1, line.sans[i])}.`);
        return;
      }
    }
    if (side !== "both" && !line.sans.some((_, i) => trainedPly(side, i + 1))) {
      warnings.push({
        code: "no-trained-move",
        message: `"${line.name ?? `Line ${idx + 1}`}" has no move for ${side === "white" ? "White" : "Black"}, so there is nothing to practise. It was skipped.`,
        lineIndex: idx,
        sans: line.sans,
      });
      return;
    }
    usable.push(line);
  });

  // warnings (mistakes to avoid) are shown after the trainable lines; the first line must be trainable
  usable = [...usable.filter((l) => l.kind !== "warning"), ...usable.filter((l) => l.kind === "warning")];
  if (usable.length === 0) errors.push("Add at least one line to the course.");
  else if (usable.every((l) => l.kind === "warning")) errors.push("At least one line must be a main line or an alternative, not a warning.");

  // 2. one answer per position
  const conflicts = findConflicts(usable, side);
  if (input.conflicts === "alternative") usable = resolveConflicts(usable, side);
  else {
    for (const c of conflicts) {
      const nm = (i: number) => `"${usable[i].name ?? `Line ${i + 1}`}"`;
      warnings.push({
        code: "conflict",
        lineIndex: c.lineIndex,
        otherLineIndex: c.otherLineIndex,
        sans: usable[c.lineIndex].sans,
        message: `${nm(c.lineIndex)} plays ${label(c.ply, c.san)} where ${nm(c.otherLineIndex)} plays ${c.otherSan} in the same position. A position should have one answer; mark the later line as an alternative.`,
      });
    }
  }

  if (errors.length) return { errors, warnings, lines: usable };

  // 3. the tree
  const tree: MoveNode[] = [];
  const lines: Line[] = [];
  const usedIds = new Set<string>();
  const usedNames = new Set<string>();
  usable.forEach((dl, li) => {
    const chess = new Chess();
    let level = tree;
    let node: MoveNode | undefined;
    let deepest: string | undefined;
    const labels: string[] = [];
    const sans: string[] = [];
    for (let i = 0; i < dl.sans.length; i++) {
      const ply = i + 1;
      const mv = chess.move(dl.sans[i]);
      let child = level.find((n) => n.san === mv.san);
      if (!child) {
        child = {
          id: (node ? node.id + " " : "") + mv.san,
          ply,
          san: mv.san,
          uci: mv.from + mv.to + (mv.promotion ?? ""),
          fen: chess.fen(),
          trained: trainedPly(side, ply),
          children: [],
        };
        const name = lookup(chess.fen());
        if (name) child.opening = name;
        level.push(child);
      }
      const note = dl.notes[i]?.trim();
      if (note && !child.note) child.note = note;
      if (child.opening) deepest = child.opening;
      sans.push(mv.san);
      labels.push(label(ply, mv.san));
      node = child;
      level = child.children;
    }
    let name = dl.name?.trim() || deepest?.replace(/^[A-E]\d\d\s+/, "") || `Line ${li + 1}`;
    if (usedNames.has(name.toLowerCase())) {
      let k = 2;
      while (usedNames.has(`${name} ${k}`.toLowerCase())) k++;
      name = `${name} ${k}`;
    }
    usedNames.add(name.toLowerCase());
    const base = slugify(name);
    let id = base;
    for (let k = 2; usedIds.has(id); k++) id = `${base}-${k}`;
    usedIds.add(id);
    lines.push({
      id,
      name,
      kind: dl.kind,
      sans,
      pgn: labels.join(" "),
      plies: sans.length,
      ...(deepest ? { opening: deepest } : {}),
      mate: chess.isCheckmate(),
    });
  });

  const firstOpening = lines.find((l) => l.kind !== "warning")?.opening ?? lines[0]?.opening;
  const eco = firstOpening?.match(/^[A-E]\d\d/)?.[0] ?? "";
  const summary = input.summary?.trim() || `My course · ${lines.length} ${lines.length === 1 ? "line" : "lines"}`;
  const course: Course = {
    id: input.id ?? newCourseId(title),
    title,
    side,
    level: input.level ?? "intermediate",
    eco,
    summary,
    ideas: [],
    custom: true,
    createdAt: input.createdAt ?? Date.now(),
    lines,
    tree,
  };
  return { course, errors, warnings, lines: usable };
}

/** Convenience: builds straight from the editable tree. */
export function buildFromTree(input: Omit<BuildInput, "lines"> & { tree: DraftTree }): BuildResult {
  const { tree, ...rest } = input;
  return buildCourse({ ...rest, lines: draftToLines(tree) });
}
