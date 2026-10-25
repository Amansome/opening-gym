// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { fetchChesscomGames, fetchLichessGames, orientedUrl, pgnToSans } from "./fetchers";
import { prepareGame } from "./matcher";
import { GameFetchError } from "./types";
import lichessNdjson from "./__fixtures__/lichess-games.ndjson?raw";
import archives from "./__fixtures__/chesscom-archives.json";
import aug from "./__fixtures__/chesscom-2026-08.json";
import sep from "./__fixtures__/chesscom-2026-09.json";

const unexpected = (): never => {
  throw new Error("expected a rejection");
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** A streaming response that splits `text` into chunks of `size` bytes (so lines break mid-way). */
function streamed(text: string, size: number, status = 200): Response {
  const bytes = new TextEncoder().encode(text);
  let pos = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(ctrl) {
      if (pos >= bytes.length) return ctrl.close();
      ctrl.enqueue(bytes.slice(pos, pos + size));
      pos += size;
    },
  });
  return new Response(body, { status, headers: { "Content-Type": "application/x-ndjson" } });
}

describe("fetchLichessGames", () => {
  it("requests the documented URL and headers and parses NDJSON split into awkward chunks", async () => {
    const fetchImpl = vi.fn(async () => streamed(lichessNdjson, 37));
    const progress: number[] = [];
    const games = await fetchLichessGames("GymFan", 50, { fetchImpl, onProgress: (n) => progress.push(n) });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(
      "https://lichess.org/api/games/user/GymFan?max=50&moves=true&opening=true&clocks=false&evals=false&pgnInJson=false",
    );
    expect((init.headers as Record<string, string>).Accept).toBe("application/x-ndjson");
    // 12 lines in the fixture, one is chess960 and is dropped
    expect(games).toHaveLength(11);
    expect(progress.at(-1)).toBe(11);
    const first = games[0];
    expect(first.id).toBe("q1Aw7Xe2");
    expect(first.url).toBe("https://lichess.org/q1Aw7Xe2");
    expect(first.white).toBe("gymfan");
    expect(first.result).toBe("1-0");
    expect(first.moves.slice(0, 3)).toEqual(["e4", "e5", "Nf3"]);
    expect(first.openingName).toContain("Giuoco Pianissimo");
    expect(games[1].result).toBe("0-1");
    expect(orientedUrl(games[1], "black")).toBe("https://lichess.org/r2Bx8Yf3/black");
    expect(orientedUrl(games[1], "white")).toBe("https://lichess.org/r2Bx8Yf3");
  });

  it("every fixture game is legal", async () => {
    const games = await fetchLichessGames("gymfan", 50, { fetchImpl: async () => streamed(lichessNdjson, 4096) });
    for (const g of games) expect(prepareGame(g).sans.length).toBe(g.moves.length);
  });

  it("stops at max and tolerates a truncated last line and an empty body", async () => {
    const two = await fetchLichessGames("gymfan", 2, { fetchImpl: async () => streamed(lichessNdjson, 64) });
    expect(two).toHaveLength(2);
    const cut = lichessNdjson.split("\n").slice(0, 2).join("\n") + '\n{"id":"broken","mov';
    expect(await fetchLichessGames("gymfan", 20, { fetchImpl: async () => streamed(cut, 50) })).toHaveLength(2);
    expect(await fetchLichessGames("gymfan", 20, { fetchImpl: async () => new Response("", { status: 200 }) })).toEqual([]);
  });

  it("maps HTTP errors to friendly codes", async () => {
    const code = async (status: number) =>
      fetchLichessGames("nobody", 20, { fetchImpl: async () => new Response("", { status }) }).then(unexpected, (e: GameFetchError) => e);
    const nf = await code(404);
    expect(nf).toBeInstanceOf(GameFetchError);
    expect(nf.code).toBe("not-found");
    expect(nf.message).toMatch(/no user/i);
    expect((await code(429)).code).toBe("rate-limit");
    expect((await code(429)).message).toMatch(/rate limiting/i);
    expect((await code(500)).code).toBe("bad-response");
  });

  it("reports network failures, bad usernames and cancellation", async () => {
    const net = await fetchLichessGames("x", 20, {
      fetchImpl: async () => {
        throw new TypeError("Failed to fetch");
      },
    }).then(unexpected, (e: GameFetchError) => e);
    expect(net.code).toBe("network");
    const bad = await fetchLichessGames("no/such user", 20, { fetchImpl: vi.fn() }).then(unexpected, (e: GameFetchError) => e);
    expect(bad.code).toBe("not-found");

    const ac = new AbortController();
    const fetchImpl = vi.fn(
      (_u: unknown, init?: RequestInit) =>
        new Promise<Response>((_res, rej) => {
          init?.signal?.addEventListener("abort", () => rej(new DOMException("Aborted", "AbortError")));
        }),
    ) as unknown as typeof fetch;
    const p = fetchLichessGames("x", 20, { fetchImpl, signal: ac.signal }).then(unexpected, (e: GameFetchError) => e);
    ac.abort();
    expect((await p).code).toBe("aborted");
  });
});

describe("pgnToSans", () => {
  it("strips headers, clock comments, variations, NAGs and move numbers", () => {
    const pgn = '[White "a"]\n[Black "b"]\n\n1. e4 {[%clk 0:09:59.0]} 1... e5 {[%clk 0:09:58.1]} 2. Nf3 $1 (2. f4 exf4) 2... Nc6! 3. Bb5 1-0';
    expect(pgnToSans(pgn)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
  });
});

describe("fetchChesscomGames", () => {
  function router(overrides: Record<string, () => Response> = {}) {
    const calls: string[] = [];
    const fetchImpl = (async (url: string) => {
      calls.push(url);
      if (overrides[url]) return overrides[url]();
      if (url.endsWith("/games/archives")) return json(archives);
      if (url.endsWith("/2026/09")) return json(sep);
      if (url.endsWith("/2026/08")) return json(aug);
      return new Response("", { status: 404 });
    }) as unknown as typeof fetch;
    return { fetchImpl, calls };
  }

  it("walks archives newest first, skips non-chess rules and parses PGN with clocks", async () => {
    const { fetchImpl, calls } = router();
    const games = await fetchChesscomGames("GymFan", 20, { fetchImpl });
    expect(calls[0]).toBe("https://api.chess.com/pub/player/gymfan/games/archives");
    expect(calls.slice(1, 3)).toEqual([
      "https://api.chess.com/pub/player/gymfan/games/2026/09",
      "https://api.chess.com/pub/player/gymfan/games/2026/08",
    ]);
    // 4 in September (one bughouse skipped) + 2 in August; the July archive 404s and is skipped
    expect(games.map((g) => g.id)).toEqual(["200000004", "200000002", "200000001", "100000002", "100000001"]);
    const g = games[2];
    expect(g.white).toBe("bishop_bob");
    expect(g.black).toBe("GymFan");
    expect(g.result).toBe("0-1");
    expect(g.moves.slice(0, 4)).toEqual(["e4", "c6", "d4", "d5"]);
    expect(g.moves).toHaveLength(20);
    expect(g.playedAt).toBe(1789000000 * 1000);
    expect(g.url).toBe("https://www.chess.com/game/live/200000001");
    expect(games[0].result).toBe("1/2-1/2");
    expect(g.speed).toBe("blitz");
  });

  it("stops fetching archives once it has enough games", async () => {
    const { fetchImpl, calls } = router();
    const games = await fetchChesscomGames("gymfan", 2, { fetchImpl });
    expect(games).toHaveLength(2);
    expect(calls).toHaveLength(2); // archives + newest month only
  });

  it("maps errors", async () => {
    const e404 = await fetchChesscomGames("ghost", 20, { fetchImpl: async () => new Response("", { status: 404 }) }).then(unexpected, (e: GameFetchError) => e);
    expect(e404.code).toBe("not-found");
    const { fetchImpl } = router({ "https://api.chess.com/pub/player/gymfan/games/2026/09": () => new Response("", { status: 429 }) });
    const e429 = await fetchChesscomGames("gymfan", 20, { fetchImpl }).then(unexpected, (e: GameFetchError) => e);
    expect(e429.code).toBe("rate-limit");
  });
});
