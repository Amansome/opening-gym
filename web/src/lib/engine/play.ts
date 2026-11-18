// Stockfish as an opponent. A separate worker from the analysis engine, so the weakened `Skill Level`
// set here never leaks into analysis. The worker is created lazily (the WASM is ~1.8 MB) and injected so
// tests can use a fake.
import { goCommand, levelOptions } from "../play/levels";
import type { Level } from "../play/levels";
import type { BotEngine } from "../play/bot";
import { defaultEngineUrl } from "./engine";
import type { EngineStatus, WorkerLike } from "./engine";
import { parseBestMove } from "./uci";

interface Search {
  done: Promise<void>;
  stopped: boolean;
  /** end the search without a move: null resolves the caller with null, an Error rejects it */
  abort: (reason: Error | null) => void;
}

export class PlayEngine implements BotEngine {
  private worker: WorkerLike | null = null;
  private status: EngineStatus = "idle";
  private errorMessage = "";
  private listeners = new Set<() => void>();
  private waiters: ((line: string) => void)[] = [];
  private initPromise: Promise<void> | null = null;
  private rejectBoot: ((e: Error) => void) | null = null;
  /** the search in flight: resolves with its bestmove once the engine reports it */
  private searching: Search | null = null;

  private createWorker: () => WorkerLike;

  constructor(createWorker: () => WorkerLike = () => new Worker(defaultEngineUrl()) as unknown as WorkerLike) {
    this.createWorker = createWorker;
  }

  getStatus(): { status: EngineStatus; error: string } {
    return { status: this.status, error: this.errorMessage };
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private setStatus(s: EngineStatus, error = ""): void {
    this.status = s;
    this.errorMessage = error;
    this.listeners.forEach((f) => f());
  }

  init(): Promise<void> {
    if (this.status === "ready") return Promise.resolve();
    if (this.status === "error") return Promise.reject(new Error(this.errorMessage));
    return (this.initPromise ??= this.boot());
  }

  /** Forget a failed start so the next init() tries again. */
  reset(): void {
    this.dispose();
  }

  private waitFor(token: string, send: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("The engine did not respond.")), 30000);
      this.rejectBoot = (e) => {
        clearTimeout(timer);
        reject(e);
      };
      const waiter = (line: string) => {
        if (line.trim() === token) {
          clearTimeout(timer);
          this.waiters = this.waiters.filter((f) => f !== waiter);
          resolve();
        }
      };
      this.waiters.push(waiter);
      send();
    });
  }

  private async boot(): Promise<void> {
    this.setStatus("loading");
    try {
      const w = this.createWorker();
      this.worker = w;
      w.onmessage = (e) => {
        const line = typeof e.data === "string" ? e.data : String((e.data as { data?: unknown })?.data ?? "");
        for (const f of [...this.waiters]) f(line);
      };
      w.onerror = (e) => {
        e.preventDefault?.();
        this.fail(e.message || "The engine could not start.");
      };
      await this.waitFor("uciok", () => w.postMessage("uci"));
      w.postMessage("setoption name Hash value 16");
      await this.waitFor("readyok", () => w.postMessage("isready"));
      this.setStatus("ready");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.fail(message);
      throw err instanceof Error ? err : new Error(message);
    }
  }

  private fail(message: string): void {
    this.worker?.terminate();
    this.worker = null;
    this.initPromise = null;
    this.waiters = [];
    const s = this.searching;
    this.searching = null;
    const rb = this.rejectBoot;
    this.rejectBoot = null;
    this.setStatus("error", message);
    rb?.(new Error(message));
    s?.abort(new Error(message));
  }

  async bestMove(fen: string, level: Level): Promise<string | null> {
    await this.init();
    // One search at a time: abandon a running one and wait for its bestmove before starting.
    if (this.searching) {
      this.stop();
      await this.searching.done;
    }
    const w = this.worker;
    if (!w) throw new Error(this.errorMessage || "The engine is not running.");
    return new Promise<string | null>((resolve, reject) => {
      let finish: () => void = () => {};
      const search: Search = {
        done: new Promise<void>((r) => (finish = r)),
        stopped: false,
        abort: (reason) => {
          this.waiters = this.waiters.filter((f) => f !== waiter);
          finish();
          if (reason) reject(reason);
          else resolve(null);
        },
      };
      const waiter = (line: string) => {
        const best = parseBestMove(line);
        if (best === undefined) return;
        this.waiters = this.waiters.filter((f) => f !== waiter);
        if (this.searching === search) this.searching = null;
        finish();
        resolve(search.stopped ? null : best);
      };
      this.searching = search;
      this.waiters.push(waiter);
      for (const opt of levelOptions(level)) w.postMessage(opt);
      w.postMessage(`position fen ${fen}`);
      w.postMessage(goCommand(level));
    });
  }

  stop(): void {
    if (this.searching && !this.searching.stopped) {
      this.searching.stopped = true;
      this.worker?.postMessage("stop");
    }
  }

  dispose(): void {
    const s = this.searching;
    this.searching = null;
    s?.abort(null);
    this.worker?.terminate();
    this.worker = null;
    this.initPromise = null;
    this.waiters = [];
    this.setStatus("idle");
  }
}
