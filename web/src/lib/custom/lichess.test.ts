import { describe, expect, it, vi } from "vitest";
import { fetchLichessStudyPgn, LichessImportError, parseLichessStudyUrl, studyPgnUrl } from "./lichess";
import { parsePgn } from "./pgn";
import { STUDY_PGN } from "./fixtures/study";

const ok = (body: string, status = 200) => ({ ok: status >= 200 && status < 300, status, text: async () => body });

describe("parseLichessStudyUrl", () => {
  it("accepts study and chapter urls in several spellings", () => {
    expect(parseLichessStudyUrl("https://lichess.org/study/AbCd1234")).toEqual({ studyId: "AbCd1234", chapterId: undefined });
    expect(parseLichessStudyUrl("https://lichess.org/study/AbCd1234/ChAp0001")).toEqual({ studyId: "AbCd1234", chapterId: "ChAp0001" });
    expect(parseLichessStudyUrl("  lichess.org/study/AbCd1234?x=1#y ")?.studyId).toBe("AbCd1234");
    expect(parseLichessStudyUrl("http://www.lichess.org/study/AbCd1234/")?.studyId).toBe("AbCd1234");
  });
  it("rejects other links", () => {
    for (const bad of ["", "https://lichess.org/AbCd1234", "https://example.com/study/AbCd1234", "https://lichess.org/study/short", "https://lichess.org/study/AbCd1234extra1234x"]) {
      expect(parseLichessStudyUrl(bad)).toBeNull();
    }
  });
  it("builds the API url", () => {
    expect(studyPgnUrl({ studyId: "AbCd1234" })).toMatch(/^https:\/\/lichess\.org\/api\/study\/AbCd1234\.pgn/);
  });
});

describe("fetchLichessStudyPgn", () => {
  it("fetches the study PGN, also for a chapter url, and the result parses", async () => {
    const f = vi.fn(async (_url: string) => ok(STUDY_PGN));
    const text = await fetchLichessStudyPgn("https://lichess.org/study/AbCd1234/ChAp0001", f);
    expect(f.mock.calls[0][0]).toMatch(/^https:\/\/lichess\.org\/api\/study\/AbCd1234\.pgn/);
    expect(parsePgn(text).games).toHaveLength(2);
  });

  it("explains each kind of failure", async () => {
    const kind = async (fn: () => Promise<unknown>) => {
      try {
        await fn();
      } catch (e) {
        expect(e).toBeInstanceOf(LichessImportError);
        return (e as LichessImportError).kind;
      }
      return "none";
    };
    const url = "https://lichess.org/study/AbCd1234";
    expect(await kind(() => fetchLichessStudyPgn("nope", vi.fn()))).toBe("bad-url");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => ok("", 404)))).toBe("not-found");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => ok("", 403)))).toBe("forbidden");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => ok("", 429)))).toBe("rate-limit");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => ok("", 500)))).toBe("http");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => ok("  \n")))).toBe("empty");
    expect(await kind(() => fetchLichessStudyPgn(url, async () => { throw new TypeError("Failed to fetch"); }))).toBe("network");
  });
});
