// Shared contracts. Owned by the orchestrator: agents must not change these
// without asking. Data shapes mirror what scripts/validate.js writes to src/data/courses.json.

export type Side = "white" | "black" | "both";
export type Level = "beginner" | "intermediate" | "advanced";
export type LineKind = "main" | "alternative" | "warning";

/** One move in a course's move tree. `id` is the SAN path from the start ("e4 e5 Nf3"). */
export interface MoveNode {
  id: string;
  ply: number; // 1 = White's first move
  san: string;
  uci: string;
  fen: string; // position AFTER this move
  /** true when this move is played by the side the course trains (the user must find it) */
  trained: boolean;
  note?: string; // coach comment shown after the move is played
  opening?: string; // e.g. "C54 Italian Game: Classical Variation" when this position is named
  children: MoveNode[];
}

export interface Line {
  id: string; // slug, unique within a course
  name: string;
  kind: LineKind;
  sans: string[];
  pgn: string; // "1.e4 1...e5 2.Nf3" labels
  plies: number;
  opening?: string;
  mate: boolean;
}

/** Long-form SEO article shown under the trainer on the course page. Optional per course. */
export interface CourseArticle {
  whatIs: string;
  howToReach?: string;
  pros: string[];
  cons: string[];
  variations?: { name: string; pgn: string; text: string }[];
  againstIt?: string;
  plans: { white: string; black: string };
  history?: string;
  faq: { q: string; a: string }[];
}

export interface Course {
  id: string;
  title: string;
  side: Side;
  level: Level;
  eco: string;
  summary: string;
  ideas: string[];
  style?: string; // e.g. "Classical", "Gambit", "Trap-heavy", "Solid", "System"
  article?: CourseArticle;
  lines: Line[];
  tree: MoveNode[]; // children of the start position
}

/** Training modes. Learn/Practice/Drill/Time are per-course; Dojo spans every started course. */
export type Mode = "learn" | "practice" | "drill" | "time" | "dojo";

/** FSRS-style grade for one user move. */
export type Grade = "again" | "hard" | "good" | "easy";

/** What the Trainer reports when the user finishes (or fails) a line. */
export interface LineResult {
  courseId: string;
  lineId: string;
  mode: Mode;
  /** one entry per trained move the user had to find, in order */
  moves: { nodeId: string; grade: Grade; ms: number; usedHint: boolean }[];
  completed: boolean; // false if a Drill/Time run ended on a mistake mid-line
  mistakes: number;
}
