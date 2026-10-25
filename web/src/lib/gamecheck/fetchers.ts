import { Chess } from "chess.js";
import { GameFetchError } from "./types";
import type { FetchOptions, FetchedGame } from "./types";

const LICHESS = "https://lichess.org";
const CHESSCOM = "https://api.chess.com/pub";

function getFetch(opts: FetchOptions): typeof fetch {
  return opts.fetchImpl ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
}

function normaliseUser(username: string): string {
  const u = username.trim();
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(u)) {
    throw new GameFetchError("not-found", "That doesn't look like a valid username. Use letters, numbers, - and _.");
  }
  return u;
}

async function request(url: string, init: RequestInit, opts: FetchOptions, site: string): Promise<Response> {
  let res: Response;
  try {
    res = await getFetch(opts)(url, { ...init, signal: opts.signal });
  } catch (e) {
    if (opts.signal?.aborted || (e instanceof DOMException && e.name === "AbortError")) {
      throw new GameFetchError("aborted", "Cancelled.");
    }
    throw new GameFetchError("network", `Couldn't reach ${site}. Check your connection and try again.`);
  }
  if (res.status === 404) throw new GameFetchError("not-found", `${site} has no user with that name.`);
  if (res.status === 429) {
    throw new GameFetchError("rate-limit", `${site} is rate limiting requests right now. Wait a minute, then try again.`);
  }
  if (!res.ok) throw new GameFetchError("bad-response", `${site} answered with an error (${res.status}). Try again later.`);
  return res;
}

function isAbort(e: unknown, opts: FetchOptions): boolean {
  return !!opts.signal?.aborted || (e instanceof DOMException && e.name === "AbortError");
}

/** Reads a response body as lines, handling chunks that end mid-line. Falls back to text() without streaming. */
async function* readLines(res: Response, opts: FetchOptions): AsyncGenerator<string> {
  try {
    if (!res.body) {
      for (const l of (await res.text()).split("\n")) yield l;
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          yield buf.slice(0, nl);
          buf = buf.slice(nl + 1);
        }
      }
      buf += decoder.decode();
      if (buf) yield buf;
    } finally {
      reader.cancel().catch(() => {});
    }
  } catch (e) {
    if (isAbort(e, opts)) throw new GameFetchError("aborted", "Cancelled.");
    if (e instanceof GameFetchError) throw e;
    throw new GameFetchError("network", "The connection dropped while loading games. Try again.");
  }
}

interface LichessGameJson {
  id?: string;
  rated?: boolean;
  variant?: string;
  speed?: string;
  createdAt?: number;
  status?: string;
  winner?: "white" | "black";
  moves?: string;
  players?: {
    white?: { user?: { name?: string }; aiLevel?: number };
    black?: { user?: { name?: string }; aiLevel?: number };
  };
  opening?: { name?: string };
}

export function parseLichessGame(j: LichessGameJson): FetchedGame | null {
  if (!j.id || typeof j.moves !== "string") return null;
  if (j.variant && j.variant !== "standard") return null;
  const white = j.players?.white?.user?.name ?? (j.players?.white?.aiLevel ? `Stockfish level ${j.players.white.aiLevel}` : "Anonymous");
  const black = j.players?.black?.user?.name ?? (j.players?.black?.aiLevel ? `Stockfish level ${j.players.black.aiLevel}` : "Anonymous");
  const moves = j.moves.split(/\s+/).filter(Boolean);
  if (moves.length === 0) return null;
  const result = j.winner === "white" ? "1-0" : j.winner === "black" ? "0-1" : j.status === "draw" || j.status === "stalemate" ? "1/2-1/2" : "*";
  return {
    id: j.id,
    site: "lichess",
    url: `${LICHESS}/${j.id}`,
    white,
    black,
    moves,
    playedAt: j.createdAt,
    speed: j.speed,
    result,
    openingName: j.opening?.name,
  };
}

/** Streams the user's most recent Lichess games (NDJSON). */
export async function fetchLichessGames(username: string, max: number, opts: FetchOptions = {}): Promise<FetchedGame[]> {
  const user = normaliseUser(username);
  const url =
    `${LICHESS}/api/games/user/${encodeURIComponent(user)}?max=${max}&moves=true&opening=true&clocks=false&evals=false&pgnInJson=false`;
  const res = await request(url, { headers: { Accept: "application/x-ndjson" } }, opts, "Lichess");
  const games: FetchedGame[] = [];
  for await (const line of readLines(res, opts)) {
    const t = line.trim();
    if (!t) continue;
    let json: LichessGameJson;
    try {
      json = JSON.parse(t) as LichessGameJson;
    } catch {
      continue; // a truncated final line; ignore
    }
    const g = parseLichessGame(json);
    if (g) {
      games.push(g);
      opts.onProgress?.(games.length);
    }
    if (games.length >= max) break;
  }
  return games;
}

/** Extracts SAN moves from PGN movetext: drops headers, comments (incl. clocks), variations, NAGs, move numbers. */
export function pgnToSans(pgn: string): string[] {
  let text = pgn.replace(/^\s*\[[^\]]*\]\s*$/gm, " ");
  text = text.replace(/\{[^}]*\}/g, " ").replace(/;[^\n]*/g, " ");
  let prev: string;
  do {
    prev = text;
    text = text.replace(/\([^()]*\)/g, " ");
  } while (text !== prev);
  text = text.replace(/\$\d+/g, " ").replace(/\d+\.(\.\.)?/g, " ");
  const out: string[] = [];
  for (const tok of text.split(/\s+/)) {
    if (!tok || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(tok)) continue;
    out.push(tok.replace(/[!?]+$/, ""));
  }
  return out;
}

/** Replays SANs with chess.js and returns the canonical ones; stops at the first illegal move. */
export function canonicalSans(sans: string[]): string[] {
  const chess = new Chess();
  const out: string[] = [];
  for (const s of sans) {
    try {
      out.push(chess.move(s).san);
    } catch {
      break;
    }
  }
  return out;
}

interface ChesscomGameJson {
  url?: string;
  pgn?: string;
  end_time?: number;
  time_class?: string;
  rules?: string;
  white?: { username?: string; result?: string };
  black?: { username?: string; result?: string };
}

const CC_DRAWS = new Set(["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"]);

export function parseChesscomGame(j: ChesscomGameJson): FetchedGame | null {
  if (j.rules && j.rules !== "chess") return null;
  if (!j.pgn || !j.url || !j.white?.username || !j.black?.username) return null;
  if (/\[SetUp "1"\]|\[FEN /.test(j.pgn)) return null; // Chess960 or from-position
  const moves = canonicalSans(pgnToSans(j.pgn));
  if (moves.length === 0) return null;
  const w = j.white.result ?? "";
  const b = j.black.result ?? "";
  const result = w === "win" ? "1-0" : b === "win" ? "0-1" : CC_DRAWS.has(w) || CC_DRAWS.has(b) ? "1/2-1/2" : "*";
  const eco = /\[ECOUrl "[^"]*\/openings\/([^"]+)"\]/.exec(j.pgn)?.[1];
  return {
    id: j.url.split("/").pop() ?? j.url,
    site: "chesscom",
    url: j.url,
    white: j.white.username,
    black: j.black.username,
    moves,
    playedAt: j.end_time ? j.end_time * 1000 : undefined,
    speed: j.time_class,
    result,
    openingName: eco ? eco.replace(/-/g, " ").replace(/\s\d.*$/, "") : undefined,
  };
}

/** Fetches the newest Chess.com games, walking monthly archives from the most recent one. */
export async function fetchChesscomGames(username: string, max: number, opts: FetchOptions = {}): Promise<FetchedGame[]> {
  const user = normaliseUser(username).toLowerCase();
  const idx = await request(`${CHESSCOM}/player/${encodeURIComponent(user)}/games/archives`, {}, opts, "Chess.com");
  let archives: string[];
  try {
    archives = ((await idx.json()) as { archives?: string[] }).archives ?? [];
  } catch (e) {
    if (isAbort(e, opts)) throw new GameFetchError("aborted", "Cancelled.");
    throw new GameFetchError("bad-response", "Chess.com sent something unexpected. Try again later.");
  }
  const games: FetchedGame[] = [];
  const seen = new Set<string>();
  for (const archiveUrl of [...archives].reverse()) {
    if (games.length >= max) break;
    let res: Response;
    try {
      res = await request(archiveUrl, {}, opts, "Chess.com");
    } catch (e) {
      if (e instanceof GameFetchError && e.code === "not-found") continue; // an archive month that vanished
      throw e;
    }
    let month: { games?: ChesscomGameJson[] };
    try {
      month = (await res.json()) as { games?: ChesscomGameJson[] };
    } catch (e) {
      if (isAbort(e, opts)) throw new GameFetchError("aborted", "Cancelled.");
      throw new GameFetchError("bad-response", "Chess.com sent something unexpected. Try again later.");
    }
    for (const raw of [...(month.games ?? [])].reverse()) {
      const g = parseChesscomGame(raw);
      if (!g || seen.has(g.id)) continue;
      seen.add(g.id);
      games.push(g);
      opts.onProgress?.(games.length);
      if (games.length >= max) break;
    }
  }
  return games;
}

export function fetchGames(site: "lichess" | "chesscom", username: string, max: number, opts: FetchOptions = {}) {
  return site === "lichess" ? fetchLichessGames(username, max, opts) : fetchChesscomGames(username, max, opts);
}

/** Game URL oriented for the user's colour (Lichess shows the board from that side). */
export function orientedUrl(game: FetchedGame, color: "white" | "black"): string {
  return game.site === "lichess" && color === "black" ? `${game.url}/black` : game.url;
}
