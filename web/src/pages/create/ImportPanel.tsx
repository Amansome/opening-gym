import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { fetchLichessStudyPgn, LichessImportError, parsePgn } from "../../lib/custom";
import type { PgnGame } from "../../lib/custom";

interface Props {
  onAdd: (games: PgnGame[]) => void;
}

const MAX_FILE_BYTES = 8 * 1024 * 1024;

function leafCount(games: PgnGame[]): number {
  const count = (nodes: PgnGame["children"]): number => nodes.reduce((n, c) => n + (c.children.length === 0 ? 1 : count(c.children)), 0);
  return games.reduce((n, g) => n + count(g.children), 0);
}

export function ImportPanel({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [source, setSource] = useState<{ tone: "ok" | "error"; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const deferred = useDeferredValue(text);
  const parsed = useMemo(() => (deferred.trim() ? parsePgn(deferred) : null), [deferred]);
  const lines = parsed ? leafCount(parsed.games) : 0;
  const stale = deferred !== text;

  async function readFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setSource({ tone: "error", message: `${file.name} is larger than 8 MB. Split it into smaller files.` });
      return;
    }
    try {
      const body = await file.text();
      setText(body);
      setSource({ tone: "ok", message: `Loaded ${file.name}.` });
    } catch {
      setSource({ tone: "error", message: `Could not read ${file.name}.` });
    }
  }

  async function fetchStudy() {
    setBusy(true);
    setSource(null);
    try {
      const body = await fetchLichessStudyPgn(url);
      setText(body);
      setSource({ tone: "ok", message: "Fetched the study from Lichess." });
    } catch (e) {
      setSource({ tone: "error", message: e instanceof LichessImportError ? e.message : "Something went wrong while fetching the study." });
    } finally {
      setBusy(false);
    }
  }

  function add() {
    if (!parsed || parsed.games.length === 0) return;
    onAdd(parsed.games);
    setText("");
    setSource(null);
  }

  return (
    <div className="cc-import">
      <div className="cc-import-grid">
        <div
          className="cc-drop"
          data-active={drag || undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void readFile(e.dataTransfer.files?.[0]);
          }}
        >
          <Icon name="upload" size={22} />
          <p>
            <strong>Drop a .pgn file here</strong>
          </p>
          <Button size="sm" onClick={() => fileRef.current?.click()}>Choose a file</Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pgn,.txt,text/plain,application/x-chess-pgn"
            className="sr-only"
            aria-label="Choose a PGN file"
            tabIndex={-1}
            onChange={(e) => {
              void readFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <form
          className="cc-url"
          onSubmit={(e) => {
            e.preventDefault();
            void fetchStudy();
          }}
        >
          <label htmlFor="cc-url-input" className="cc-label">Lichess study link</label>
          <div className="cc-url-row">
            <input
              id="cc-url-input"
              className="cc-input"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://lichess.org/study/…"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button type="submit" disabled={busy || !url.trim()}>{busy ? "Fetching…" : "Fetch"}</Button>
          </div>
          <p className="cc-hint muted">Public studies only. Every chapter becomes one or more lines.</p>
        </form>
      </div>

      <label htmlFor="cc-pgn" className="cc-label">Or paste PGN</label>
      <textarea
        id="cc-pgn"
        className="cc-input cc-pgn"
        rows={8}
        spellCheck={false}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSource(null);
        }}
        placeholder={'[Event "Italian: main line"]\n\n1. e4 e5 2. Nf3 { Attacks e5. } 2... Nc6 3. Bc4 Bc5 (3... Nf6 4. Ng5) 4. c3 *'}
      />

      <div className="cc-import-foot" aria-live="polite">
        {source ? <p className="cc-msg" data-tone={source.tone} role={source.tone === "error" ? "alert" : "status"}>{source.message}</p> : null}
        {parsed && !stale ? (
          <>
            {parsed.games.length > 0 ? (
              <p className="cc-msg" data-tone="ok">
                Found {parsed.games.length} {parsed.games.length === 1 ? "game" : "games"} making {lines} {lines === 1 ? "line" : "lines"}.
              </p>
            ) : null}
            {parsed.errors.length > 0 ? (
              <ul className="cc-issues" data-tone="error">
                {parsed.errors.map((e, i) => (
                  <li key={i}>
                    <strong>Game {e.game}{e.name ? ` (${e.name})` : ""} skipped:</strong> {e.message}
                  </li>
                ))}
              </ul>
            ) : null}
            {parsed.warnings.length > 0 ? (
              <ul className="cc-issues" data-tone="warn">
                {parsed.warnings.map((e, i) => (
                  <li key={i}>
                    Game {e.game}{e.name ? ` (${e.name})` : ""}: {e.message}
                  </li>
                ))}
              </ul>
            ) : null}
            {parsed.games.length === 0 && parsed.errors.length === 0 && parsed.warnings.length === 0 ? (
              <p className="cc-msg" data-tone="error">No moves found in that text.</p>
            ) : null}
          </>
        ) : null}
      </div>
      <Button variant="primary" onClick={add} disabled={!parsed || stale || parsed.games.length === 0}>
        {parsed && parsed.games.length > 0 ? `Add ${lines} ${lines === 1 ? "line" : "lines"} to the course` : "Add to the course"}
      </Button>
    </div>
  );
}
