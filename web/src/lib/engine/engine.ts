// Stockfish in a Web Worker, behind a small typed API.
//
//   const engine = getEngine();
//   const done = engine.analyse(fen, { multiPv: 3, depth: 20 }, (lines) => render(lines));
//   engine.stop();
//
// Design:
// - One shared worker, created lazily on the first request (the WASM is ~1.8 MB).
// - One search runs at a time. A new request while another is running sends `stop` and waits for that
//   search's `bestmove` before starting, so a late `bestmove` can never be mistaken for the new search.
//   Only the newest waiting request is kept; superseded ones resolve as "cancelled" without running.
// - The worker is injected (`createWorker`) so tests can drive the engine with a fake.
import { parseBestMove, parseInfo } from "./uci";
import type { EngineLine, Turn } from "./uci";

/** The slice of the Worker API we use. */
export interface WorkerLike {
  postMessage(msg: string): void;
  terminate(): void;
  onmessage: ((e: { data: unknown }) => void) | null;
  onerror: ((e: { message?: string; preventDefault?: () => void }) => void) | null;
}

export type EngineStatus = "idle" | "loading" | "ready" | "error";

export interface AnalyseOptions {
  /** number of lines (default 3) */
  multiPv?: number;
  /** stop at this depth (default 20); ignored when `infinite` */
  depth?: number;
  /** analyse until stop() */
  infinite?: boolean;
}

export type AnalysisEnd = "completed" | "cancelled" | "error";

export interface AnalysisResult {
  end: AnalysisEnd;
  /** UCI best move when the search completed or was stopped after producing one */
  bestMove: string | null;
  error?: string;
}

/** Called with the current best lines (index = multipv - 1) each time one of them improves. */
export type InfoCallback = (lines: EngineLine[]) => void;

interface Request {
  fen: string;
  turn: Turn;
  multiPv: number;
  depth: number;
  infinite: boolean;
  onInfo: InfoCallback;
  resolve: (r: AnalysisResult) => void;
  lines: EngineLine[];
}

export function engineSupported(): boolean {
  return typeof Worker !== "undefined" && typeof WebAssembly !== "undefined";
}

export function defaultEngineUrl(): string {
  const base = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
  return `${base.endsWith("/") ? base : base + "/"}engine/stockfish-19-lite-single.js`;
}

export class StockfishEngine {
  private worker: WorkerLike | null = null;
  private status: EngineStatus = "idle";
  private errorMessage = "";
  private listeners = new Set<() => void>();
  private ready = false;
  private current: Request | null = null; // sent to the engine, waiting for bestmove
  private pending: Request | null = null; // newest request waiting its turn
  private stopping = false; // `stop` sent for `current`
  private multiPvSet = 0;
  private lineWaiters: ((line: string) => void)[] = [];

  private createWorker: () => WorkerLike;

  constructor(createWorker: () => WorkerLike) {
    this.createWorker = createWorker;
  }

  getStatus(): { status: EngineStatus; error: string } {
    return { status: this.status, error: this.errorMessage };
  }

  /** Subscribe to status changes. Returns an unsubscribe function. */
  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private setStatus(s: EngineStatus, error = ""): void {
    this.status = s;
    this.errorMessage = error;
    this.listeners.forEach((f) => f());
  }

  /** Start the worker if needed; resolves once the engine answered `isready`. */
  init(): Promise<void> {
    if (this.status === "ready") return Promise.resolve();
    if (this.status === "error") return Promise.reject(new Error(this.errorMessage));
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.boot();
    return this.initPromise;
  }
  private initPromise: Promise<void> | null = null;

  private async boot(): Promise<void> {
    this.setStatus("loading");
    try {
      const w = this.createWorker();
      this.worker = w;
      w.onmessage = (e) => this.onLine(typeof e.data === "string" ? e.data : String((e.data as { data?: unknown })?.data ?? ""));
      w.onerror = (e) => {
        e.preventDefault?.();
        this.fail(e.message || "The engine could not start.");
      };
      await this.waitFor("uciok", () => w.postMessage("uci"));
      w.postMessage("setoption name Hash value 32");
      await this.waitFor("readyok", () => w.postMessage("isready"));
      w.postMessage("ucinewgame");
      this.ready = true;
      this.setStatus("ready");
      this.pump();
    } catch (err) {
      this.fail(err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  private waitFor(token: string, send: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("The engine did not respond.")), 30000);
      const waiter = (line: string) => {
        if (line.trim() === token) {
          clearTimeout(timer);
          this.lineWaiters = this.lineWaiters.filter((f) => f !== waiter);
          resolve();
        }
      };
      this.lineWaiters.push(waiter);
      send();
    });
  }

  private fail(message: string): void {
    const cur = this.current;
    const pend = this.pending;
    this.current = null;
    this.pending = null;
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.setStatus("error", message);
    cur?.resolve({ end: "error", bestMove: null, error: message });
    pend?.resolve({ end: "error", bestMove: null, error: message });
  }

  private onLine(line: string): void {
    for (const w of [...this.lineWaiters]) w(line);
    const cur = this.current;
    if (!cur) return;
    if (line.startsWith("info ")) {
      if (this.stopping) return; // stale output of a search we are abandoning
      const info = parseInfo(line, cur.turn);
      if (!info) return;
      const idx = info.multipv - 1;
      const prev = cur.lines[idx];
      // Bound lines (aspiration re-searches) are noisy; show them only if nothing better is known yet.
      if (info.bound && prev && prev.depth >= info.depth) return;
      if (info.bound && prev && !prev.bound) return;
      const next = cur.lines.slice();
      next[idx] = info;
      cur.lines = next;
      cur.onInfo(next.filter(Boolean));
      return;
    }
    const best = parseBestMove(line);
    if (best !== undefined) {
      const wasStopped = this.stopping;
      this.current = null;
      this.stopping = false;
      cur.resolve({ end: wasStopped ? "cancelled" : "completed", bestMove: best });
      this.pump();
    }
  }

  /** Send the pending request to the engine if the engine is free. */
  private pump(): void {
    if (!this.ready || !this.worker || this.current || !this.pending) return;
    const req = this.pending;
    this.pending = null;
    this.current = req;
    this.stopping = false;
    const w = this.worker;
    if (this.multiPvSet !== req.multiPv) {
      w.postMessage(`setoption name MultiPV value ${req.multiPv}`);
      this.multiPvSet = req.multiPv;
    }
    w.postMessage(`position fen ${req.fen}`);
    w.postMessage(req.infinite ? "go infinite" : `go depth ${req.depth}`);
  }

  /**
   * Analyse a position. A newer call (or stop()) cancels this one. The promise resolves when the search
   * ends; it never rejects.
   */
  analyse(fen: string, opts: AnalyseOptions = {}, onInfo: InfoCallback = () => {}): Promise<AnalysisResult> {
    const turn: Turn = fen.split(" ")[1] === "b" ? "b" : "w";
    return new Promise<AnalysisResult>((resolve) => {
      if (this.status === "error") {
        resolve({ end: "error", bestMove: null, error: this.errorMessage });
        return;
      }
      const req: Request = {
        fen,
        turn,
        multiPv: Math.max(1, Math.min(5, opts.multiPv ?? 3)),
        depth: Math.max(1, Math.min(60, opts.depth ?? 20)),
        infinite: !!opts.infinite,
        onInfo,
        resolve,
        lines: [],
      };
      // A request that never started is cancelled silently.
      this.pending?.resolve({ end: "cancelled", bestMove: null });
      this.pending = req;
      this.haltCurrent();
      if (!this.initPromise) void this.init().catch(() => {});
      else this.pump();
    });
  }

  private haltCurrent(): void {
    if (this.current && !this.stopping && this.worker) {
      this.stopping = true;
      this.worker.postMessage("stop");
    }
  }

  /** Cancel the running and any waiting analysis. */
  stop(): void {
    if (this.pending) {
      this.pending.resolve({ end: "cancelled", bestMove: null });
      this.pending = null;
    }
    this.haltCurrent();
  }

  /** Kill the worker (frees memory). A later analyse() starts a fresh one. */
  dispose(): void {
    this.stop();
    this.current?.resolve({ end: "cancelled", bestMove: null });
    this.current = null;
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.initPromise = null;
    this.multiPvSet = 0;
    this.lineWaiters = [];
    this.setStatus("idle");
  }
}

let shared: StockfishEngine | null = null;

/** The app-wide engine (single worker). */
export function getEngine(): StockfishEngine {
  if (!shared) {
    shared = new StockfishEngine(() => new Worker(defaultEngineUrl()) as unknown as WorkerLike);
  }
  return shared;
}
