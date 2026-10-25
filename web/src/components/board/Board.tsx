import { useCallback, useEffect, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";
import { Chessboard, COLOR, INPUT_EVENT_TYPE } from "cm-chessboard/src/Chessboard.js";
import type { MarkerType, MoveInputEvent } from "cm-chessboard/src/Chessboard.js";
import { Markers } from "cm-chessboard/src/extensions/markers/Markers.js";
import { Arrows, ARROW_TYPE } from "cm-chessboard/src/extensions/arrows/Arrows.js";
import { PromotionDialog, PROMOTION_DIALOG_RESULT_TYPE } from "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js";
import { Accessibility } from "cm-chessboard/src/extensions/accessibility/Accessibility.js";
import piecesUrl from "cm-chessboard/assets/pieces/standard.svg?url";
import markersUrl from "cm-chessboard/assets/extensions/markers/markers.svg?url";
import arrowsUrl from "cm-chessboard/assets/extensions/arrows/arrows.svg?url";
import "./board.css";

export type BoardColor = "white" | "black";

export interface BoardMove {
  from: string;
  to: string;
  /** "q" | "r" | "b" | "n" when the move is a promotion */
  promotion?: string;
}

export interface BoardMark {
  square: string;
  kind: "correct" | "wrong";
}

export interface BoardArrow {
  from: string;
  to: string;
  kind?: "hint" | "correct" | "wrong";
}

export interface BoardProps {
  /** Position to show. The board animates to it whenever it changes. */
  fen: string;
  orientation?: BoardColor;
  /** Which side the user may move (click or drag). Omit / null to make the board read-only. */
  movable?: BoardColor | null;
  lastMove?: { from: string; to: string } | null;
  /** Red cross / green tick badge on a destination square. */
  mark?: BoardMark | null;
  /** Highlight a square (first hint level: "move this piece"). */
  hintSquare?: string | null;
  arrows?: BoardArrow[];
  /** Animate position changes (default true). */
  animate?: boolean;
  /** Change to force the board to re-sync to `fen` (e.g. after a rejected move). */
  resetKey?: number | string;
  /** Called with a legal move the user made. The parent decides what to show next. */
  onMove?: (move: BoardMove) => void;
  className?: string;
  ariaLabel?: string;
}

// Marker types are compared by reference: keep them module-level.
const LAST_MOVE: MarkerType = { class: "marker-lastmove", slice: "markerSquare" };
const SELECT: MarkerType = { class: "marker-select", slice: "markerSquare" };
const HINT: MarkerType = { class: "marker-hint", slice: "markerSquare" };
const ARROW_FOR = { hint: ARROW_TYPE.info, correct: ARROW_TYPE.success, wrong: ARROW_TYPE.danger };

function absolute(url: string): string {
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function squareBox(square: string, orientation: BoardColor): { left: number; top: number } {
  const file = square.charCodeAt(0) - 97;
  const rank = Number(square[1]);
  return orientation === "white"
    ? { left: file * 12.5, top: (8 - rank) * 12.5 }
    : { left: (7 - file) * 12.5, top: (rank - 1) * 12.5 };
}

function legalMovesFrom(fen: string, from: string): Move[] {
  try {
    return new Chess(fen).moves({ square: from as Square, verbose: true });
  } catch {
    return [];
  }
}

export function Board({
  fen,
  orientation = "white",
  movable = null,
  lastMove = null,
  mark = null,
  hintSquare = null,
  arrows,
  animate = true,
  resetKey = 0,
  onMove,
  className,
  ariaLabel = "Chessboard",
}: BoardProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<Chessboard | null>(null);

  // Latest props for the long-lived board callbacks.
  const live = useRef({ fen, onMove, animate });
  live.current = { fen, onMove, animate };

  const handler = useCallback((event: MoveInputEvent): boolean => {
    const board = boardRef.current;
    if (!board) return false;
    switch (event.type) {
      case INPUT_EVENT_TYPE.moveInputStarted: {
        const moves = event.squareFrom ? legalMovesFrom(live.current.fen, event.squareFrom) : [];
        board.removeLegalMovesMarkers();
        if (moves.length === 0) return false;
        board.addLegalMovesMarkers(moves);
        return true;
      }
      case INPUT_EVENT_TYPE.validateMoveInput: {
        board.removeLegalMovesMarkers();
        const from = event.squareFrom;
        const to = event.squareTo;
        if (!from || !to) return false;
        const candidates = legalMovesFrom(live.current.fen, from).filter((m) => m.to === to);
        if (candidates.length === 0) return false;
        if (candidates[0].promotion) {
          const color = candidates[0].color;
          board.showPromotionDialog(to, color, (result) => {
            if (result.type === PROMOTION_DIALOG_RESULT_TYPE.pieceSelected && result.piece) {
              live.current.onMove?.({ from, to, promotion: result.piece[1] });
            } else {
              void board.setPosition(live.current.fen, true);
            }
          });
          return true;
        }
        live.current.onMove?.({ from, to });
        return true;
      }
      case INPUT_EVENT_TYPE.moveInputCanceled:
      case INPUT_EVENT_TYPE.moveInputFinished:
        board.removeLegalMovesMarkers();
        return true;
      default:
        return true;
    }
  }, []);

  // Create / destroy the cm-chessboard instance.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const board = new Chessboard(host, {
      position: live.current.fen,
      orientation: orientation === "white" ? COLOR.white : COLOR.black,
      assetsUrl: "/",
      style: {
        cssClass: "og",
        borderType: "none",
        pieces: { file: absolute(piecesUrl) },
        animationDuration: prefersReducedMotion() ? 0 : 220,
      },
      extensions: [
        { class: Markers, props: { sprite: absolute(markersUrl), autoMarkers: SELECT } },
        { class: Arrows, props: { sprite: absolute(arrowsUrl) } },
        { class: PromotionDialog },
        {
          class: Accessibility,
          props: {
            brailleNotationInAlt: false,
            movePieceForm: false,
            boardAsTable: false,
            piecesAsList: false,
            keyboardMoveInput: true,
            visuallyHidden: true,
          },
        },
      ],
    });
    boardRef.current = board;
    const svg = host.querySelector("svg.cm-chessboard");
    svg?.setAttribute("aria-label", ariaLabel);
    return () => {
      boardRef.current = null;
      board.destroy();
    };
    // The board is created once; everything else is synced by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Position
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.removeLegalMovesMarkers();
    void board.setPosition(fen, animate && !prefersReducedMotion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, resetKey]);

  // Orientation
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const target = orientation === "white" ? COLOR.white : COLOR.black;
    if (board.getOrientation() !== target) void board.setOrientation(target, false);
  }, [orientation]);

  // Move input
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.disableMoveInput();
    if (movable) board.enableMoveInput(handler, movable === "white" ? COLOR.white : COLOR.black);
    return () => {
      boardRef.current?.disableMoveInput();
    };
  }, [movable, handler]);

  // Last move + hint square highlights
  const lastFrom = lastMove?.from;
  const lastTo = lastMove?.to;
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.removeMarkers(LAST_MOVE);
    if (lastFrom) board.addMarker(LAST_MOVE, lastFrom);
    if (lastTo) board.addMarker(LAST_MOVE, lastTo);
  }, [lastFrom, lastTo]);

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.removeMarkers(HINT);
    if (hintSquare) board.addMarker(HINT, hintSquare);
  }, [hintSquare]);

  // Arrows
  const arrowKey = useMemo(() => (arrows ?? []).map((a) => `${a.from}${a.to}${a.kind ?? "hint"}`).join(","), [arrows]);
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    board.removeArrows();
    for (const a of arrows ?? []) board.addArrow(ARROW_FOR[a.kind ?? "hint"], a.from, a.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrowKey]);

  const badge = mark ? squareBox(mark.square, orientation) : null;

  return (
    <div className={`og-board${className ? " " + className : ""}`} role="group" aria-label={ariaLabel} data-fen={fen} data-orientation={orientation}>
      <div className="og-board__host" ref={hostRef} />
      {mark && badge && (
        <div
          key={`${mark.square}-${mark.kind}-${fen}`}
          className={`og-board__badge og-board__badge--${mark.kind}`}
          style={{ left: `${badge.left}%`, top: `${badge.top}%` }}
          data-testid="board-mark"
          data-kind={mark.kind}
          data-square={mark.square}
          role="img"
          aria-label={mark.kind === "correct" ? "Correct move" : "Wrong move"}
        >
          <span>
            {mark.kind === "correct" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
