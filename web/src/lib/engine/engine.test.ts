import { describe, expect, it } from "vitest";
import { StockfishEngine } from "./engine";
import type { WorkerLike } from "./engine";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const AFTER_E4 = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";

/** Minimal UCI engine double. Searches stay open until the test calls `finish()` or `stop` arrives. */
class FakeWorker implements WorkerLike {
  onmessage: WorkerLike["onmessage"] = null;
  onerror: WorkerLike["onerror"] = null;
  sent: string[] = [];
  terminated = false;
  searching = false;
  autoReady = true;
  postMessage(msg: string): void {
    this.sent.push(msg);
    if (!this.autoReady) return;
    if (msg === "uci") this.emit("uciok");
    else if (msg === "isready") this.emit("readyok");
    else if (msg.startsWith("go")) this.searching = true;
    else if (msg === "stop" && this.searching) {
      this.searching = false;
      setTimeout(() => this.emit("bestmove e2e4"), 0); // like the real engine: the answer comes later
    }
  }
  terminate(): void {
    this.terminated = true;
  }
  emit(line: string): void {
    this.onmessage?.({ data: line });
  }
  finish(best = "e2e4"): void {
    this.searching = false;
    this.emit(`bestmove ${best}`);
  }
  get goCommands(): string[] {
    return this.sent.filter((s) => s.startsWith("go") || s.startsWith("position"));
  }
}

function make() {
  const w = new FakeWorker();
  let created = 0;
  const engine = new StockfishEngine(() => {
    created++;
    return w;
  });
  return { w, engine, created: () => created };
}

const tick = () => new Promise((r) => setTimeout(r, 0));

describe("StockfishEngine", () => {
  it("creates the worker lazily, runs the UCI handshake and a search", async () => {
    const { w, engine, created } = make();
    expect(created()).toBe(0);
    expect(engine.getStatus().status).toBe("idle");
    const seen: number[][] = [];
    const p = engine.analyse(START, { multiPv: 2, depth: 12 }, (lines) => seen.push(lines.map((l) => l.depth)));
    await tick();
    expect(created()).toBe(1);
    expect(engine.getStatus().status).toBe("ready");
    expect(w.sent).toEqual([
      "uci",
      "setoption name Hash value 32",
      "isready",
      "ucinewgame",
      "setoption name MultiPV value 2",
      `position fen ${START}`,
      "go depth 12",
    ]);
    w.emit("info depth 5 multipv 1 score cp 20 pv e2e4 e7e5");
    w.emit("info depth 5 multipv 2 score cp 10 pv d2d4 d7d5");
    w.finish("e2e4");
    expect(await p).toEqual({ end: "completed", bestMove: "e2e4" });
    expect(seen).toEqual([[5], [5, 5]]);
  });

  it("normalises scores to White for a Black-to-move search", async () => {
    const { w, engine } = make();
    let got = 0;
    const p = engine.analyse(AFTER_E4, {}, (l) => (got = l[0].score.cp ?? NaN));
    await tick();
    w.emit("info depth 8 multipv 1 score cp 30 pv e7e5");
    w.finish("e7e5");
    await p;
    expect(got).toBe(-30);
  });

  it("stops the running search before starting a newer one and ignores its stale output", async () => {
    const { w, engine } = make();
    const first: number[] = [];
    const second: number[] = [];
    const p1 = engine.analyse(START, { depth: 10 }, (l) => first.push(l[0].depth));
    await tick();
    const p2 = engine.analyse(AFTER_E4, { depth: 10 }, (l) => second.push(l[0].depth));
    // `stop` was sent, the new search has not been started yet
    expect(w.sent.at(-1)).toBe("stop");
    expect(w.goCommands).toEqual([`position fen ${START}`, "go depth 10"]);
    // fake answers stop with a bestmove: p1 is cancelled and p2 starts
    await tick();
    expect((await p1).end).toBe("cancelled");
    expect(w.goCommands.slice(2)).toEqual([`position fen ${AFTER_E4}`, "go depth 10"]);
    w.emit("info depth 3 multipv 1 score cp 5 pv e7e5");
    w.finish("e7e5");
    expect((await p2).end).toBe("completed");
    expect(first).toEqual([]);
    expect(second).toEqual([3]);
  });

  it("keeps only the newest of several queued requests", async () => {
    const { w, engine } = make();
    const p1 = engine.analyse(START, { depth: 10 });
    await tick();
    const p2 = engine.analyse(START, { depth: 11 });
    const p3 = engine.analyse(AFTER_E4, { depth: 12 });
    expect(await p2).toEqual({ end: "cancelled", bestMove: null });
    await tick();
    expect((await p1).end).toBe("cancelled");
    expect(w.sent.filter((s) => s.startsWith("go"))).toEqual(["go depth 10", "go depth 12"]);
    w.finish();
    expect((await p3).end).toBe("completed");
  });

  it("queues requests made before the engine is ready", async () => {
    const { w, engine } = make();
    w.autoReady = false;
    const p1 = engine.analyse(START, { depth: 5 });
    const p2 = engine.analyse(AFTER_E4, { depth: 6 });
    expect(engine.getStatus().status).toBe("loading");
    expect((await p1).end).toBe("cancelled");
    w.autoReady = true;
    w.emit("uciok");
    await tick();
    w.emit("readyok");
    await tick();
    expect(w.sent.filter((s) => s.startsWith("go"))).toEqual(["go depth 6"]);
    w.finish();
    expect((await p2).end).toBe("completed");
  });

  it("stop() cancels the running search", async () => {
    const { w, engine } = make();
    const p = engine.analyse(START, { infinite: true });
    await tick();
    expect(w.sent.at(-1)).toBe("go infinite");
    engine.stop();
    expect((await p).end).toBe("cancelled");
  });

  it("reports worker errors and resolves waiting requests", async () => {
    const { w, engine } = make();
    w.autoReady = false;
    const p = engine.analyse(START);
    await tick();
    w.onerror?.({ message: "boom" });
    expect(await p).toMatchObject({ end: "error", error: "boom" });
    expect(engine.getStatus()).toEqual({ status: "error", error: "boom" });
    expect(w.terminated).toBe(true);
    expect((await engine.analyse(START)).end).toBe("error");
  });

  it("dispose() terminates the worker and a later analyse starts a new one", async () => {
    const { w, engine, created } = make();
    const p = engine.analyse(START);
    await tick();
    engine.dispose();
    expect((await p).end).toBe("cancelled");
    expect(w.terminated).toBe(true);
    expect(engine.getStatus().status).toBe("idle");
    void engine.analyse(START);
    await tick();
    expect(created()).toBe(2);
  });
});
