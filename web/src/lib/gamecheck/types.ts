// Game-check: compare a user's real games with their opening courses. Pure logic, no React.

export type Site = "lichess" | "chesscom";

/** A finished game, reduced to what the matcher needs. */
export interface FetchedGame {
  id: string;
  site: Site;
  /** Link to the game on the site, already oriented for the user's colour where the site supports it. */
  url: string;
  white: string;
  black: string;
  /** Moves in SAN, from the starting position. */
  moves: string[];
  /** Milliseconds since epoch, when known. */
  playedAt?: number;
  speed?: string; // bullet / blitz / rapid / classical ...
  result: "1-0" | "0-1" | "1/2-1/2" | "*";
  /** Opening name given by the site, when it gives one. */
  openingName?: string;
}

export type FetchErrorCode = "not-found" | "rate-limit" | "network" | "bad-response" | "aborted";

export class GameFetchError extends Error {
  readonly code: FetchErrorCode;
  constructor(code: FetchErrorCode, message: string) {
    super(message);
    this.name = "GameFetchError";
    this.code = code;
  }
}

export interface FetchOptions {
  signal?: AbortSignal;
  /** Injected in tests; defaults to global fetch. */
  fetchImpl?: typeof fetch;
  /** Called with the number of games collected so far. */
  onProgress?: (count: number) => void;
}

export type CheckKind =
  | "followed" // the game stayed inside the course until the course (or the game) ended
  | "user-deviation" // the user played something other than the course move
  | "opponent-left" // the opponent played a move the course does not cover
  | "uncovered" // no course covers this opening at all (diverged at the first decision)
  | "no-course"; // there is no course for the user's colour

export interface GameCheck {
  game: FetchedGame;
  color: "white" | "black";
  kind: CheckKind;
  courseId?: string;
  courseTitle?: string;
  /** Plies played inside the course before the divergence (or in total when followed). */
  depth: number;
  /** 1-based ply of the divergent move (user-deviation / opponent-left / uncovered). */
  ply?: number;
  /** Label such as "4.Nc3" or "4...Nc6". */
  moveLabel?: string;
  played?: string;
  /** Moves the course has at this point (trained moves for a deviation, opponent replies for a surprise). */
  expected?: string[];
  /** For user-deviation: the course's main expected move label e.g. "4.d4". */
  expectedLabel?: string;
  /** Course line names that contain the (first) expected move. */
  expectedLines?: string[];
  note?: string;
  /** The user's move is only listed in a "trap to avoid" line of the course. */
  knownMistake?: boolean;
  /** The engine data says the played move is also fine. */
  engineFine?: boolean;
  /** Position before the divergent move. */
  fen?: string;
  /** Stable key for the position before the divergence: "{courseId}|{epd}". */
  positionKey?: string;
}

export interface DeviationGroup {
  key: string;
  courseId: string;
  courseTitle: string;
  fen: string;
  color: "white" | "black";
  ply: number;
  played: string;
  playedLabel: string;
  expected: string[];
  expectedLabel: string;
  expectedLines: string[];
  note?: string;
  knownMistake: boolean;
  engineFine: boolean;
  count: number;
  games: FetchedGame[];
}

export interface CheckSummary {
  checked: number;
  withCourse: number;
  userDeviations: number;
  opponentLeft: number;
  followed: number;
  uncovered: number;
  /** Mean plies inside the course over games that matched some course. */
  avgBookPlies: number;
  mostMissed?: DeviationGroup;
}

export interface CheckReport {
  summary: CheckSummary;
  mistakes: DeviationGroup[];
  surprises: DeviationGroup[];
  followed: GameCheck[];
  uncovered: GameCheck[];
  /** Games where the user's name did not match either player (should not happen). */
  skipped: number;
}
