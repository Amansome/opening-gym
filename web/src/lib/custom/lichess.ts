// Lichess study import: turns a study URL into the public PGN export and fetches it.
// https://lichess.org/api/study/{id}.pgn allows cross-origin requests (public studies only).

export interface StudyRef {
  studyId: string;
  chapterId?: string;
}

/** Accepts https://lichess.org/study/{id}[/{chapterId}] (with or without scheme, "www.", query or hash). */
export function parseLichessStudyUrl(input: string): StudyRef | null {
  const text = input.trim();
  const m = /^(?:https?:\/\/)?(?:www\.)?lichess\.org\/study\/([A-Za-z0-9]{8})(?:\/([A-Za-z0-9]{8}))?(?:[/?#].*)?$/.exec(text);
  if (!m) return null;
  return { studyId: m[1], chapterId: m[2] };
}

export function studyPgnUrl(ref: StudyRef): string {
  return `https://lichess.org/api/study/${ref.studyId}.pgn?clocks=false&comments=true&variations=true&orientation=true`;
}

export class LichessImportError extends Error {
  readonly kind: "bad-url" | "not-found" | "forbidden" | "rate-limit" | "network" | "http" | "empty";
  constructor(kind: LichessImportError["kind"], message: string) {
    super(message);
    this.name = "LichessImportError";
    this.kind = kind;
  }
}

type Fetch = (url: string, init?: { signal?: AbortSignal }) => Promise<Pick<Response, "ok" | "status" | "text">>;

export async function fetchLichessStudyPgn(input: string, fetchImpl: Fetch = (u, i) => fetch(u, i), timeoutMs = 20000): Promise<string> {
  const ref = parseLichessStudyUrl(input);
  if (!ref) {
    throw new LichessImportError("bad-url", "That does not look like a Lichess study link. It should read https://lichess.org/study/ followed by 8 letters or digits.");
  }
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : undefined;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : undefined;
  let res;
  try {
    res = await fetchImpl(studyPgnUrl(ref), ctrl ? { signal: ctrl.signal } : undefined);
  } catch {
    throw new LichessImportError("network", "Could not reach Lichess. Check your connection, or download the study as PGN on Lichess and paste it here instead.");
  } finally {
    if (timer) clearTimeout(timer);
  }
  if (res.status === 404) throw new LichessImportError("not-found", "Lichess has no study with that id. Check the link.");
  if (res.status === 401 || res.status === 403) {
    throw new LichessImportError("forbidden", "That study is private. Download it as PGN from Lichess (Share, then PGN) and paste it here instead.");
  }
  if (res.status === 429) throw new LichessImportError("rate-limit", "Lichess asks us to slow down. Wait a minute and try again.");
  if (!res.ok) throw new LichessImportError("http", `Lichess answered with an error (HTTP ${res.status}). Try again later.`);
  const text = await res.text();
  if (!text.trim()) throw new LichessImportError("empty", "The study came back empty.");
  return text;
}
