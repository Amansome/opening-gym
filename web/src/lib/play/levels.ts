// Bot strength levels. Described in words only: we do not claim Elo numbers for them.
// Each level maps to Stockfish's `Skill Level` (0 to 20: lower means more human-like slips) plus a cap on
// search depth and time, so the weak levels also think shallowly and make the kind of mistakes people make.

export type LevelId = "beginner" | "casual" | "club" | "strong";

export interface Level {
  id: LevelId;
  label: string;
  /** one plain-English sentence for the picker */
  blurb: string;
  /** Stockfish `Skill Level` option, 0 to 20 */
  skill: number;
  /** `go depth` cap */
  depth: number;
  /** `go movetime` cap in milliseconds */
  movetime: number;
}

export const LEVELS: readonly Level[] = [
  { id: "beginner", label: "Beginner", blurb: "Plays like someone new to chess. It hangs pieces now and then, so you can win by playing soundly.", skill: 0, depth: 1, movetime: 120 },
  { id: "casual", label: "Casual", blurb: "Sees simple tactics but still misses a lot. A fair game for a player who knows the basics.", skill: 4, depth: 4, movetime: 300 },
  { id: "club", label: "Club", blurb: "Plays sensibly and punishes loose moves. It slips only occasionally.", skill: 11, depth: 8, movetime: 700 },
  { id: "strong", label: "Strong", blurb: "Full strength for its search time. Expect to lose unless you play accurately.", skill: 20, depth: 14, movetime: 1500 },
] as const;

export const DEFAULT_LEVEL: LevelId = "beginner";
export const LEVEL_KEY = "opening-gym:play-level";

export function isLevelId(v: unknown): v is LevelId {
  return LEVELS.some((l) => l.id === v);
}

export function levelById(id: string | null | undefined): Level {
  return LEVELS.find((l) => l.id === id) ?? LEVELS.find((l) => l.id === DEFAULT_LEVEL)!;
}

/** UCI commands that set a level up (sent before each search so a changed level applies at once). */
export function levelOptions(level: Level): string[] {
  return [`setoption name Skill Level value ${level.skill}`];
}

/** The `go` command for a level: whichever of the depth and time caps is hit first ends the search. */
export function goCommand(level: Level): string {
  return `go depth ${level.depth} movetime ${level.movetime}`;
}

export function loadLevel(): LevelId {
  try {
    const v = localStorage.getItem(LEVEL_KEY);
    if (isLevelId(v)) return v;
  } catch {
    /* storage blocked: use the default */
  }
  return DEFAULT_LEVEL;
}

export function saveLevel(id: LevelId): void {
  try {
    localStorage.setItem(LEVEL_KEY, id);
  } catch {
    /* ignore */
  }
}
