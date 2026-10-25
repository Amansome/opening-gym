// Minimal ambient types for cm-chessboard v8 (plain ESM JS, ships without declarations).
declare module "cm-chessboard/src/Chessboard.js" {
  export const COLOR: { white: "w"; black: "b" };
  export const INPUT_EVENT_TYPE: {
    moveInputStarted: string;
    validateMoveInput: string;
    moveInputCanceled: string;
    moveInputFinished: string;
    movingOverSquare: string;
  };
  export interface MoveInputEvent {
    type: string;
    squareFrom?: string;
    squareTo?: string;
    piece?: string;
    [k: string]: unknown;
  }
  export interface MarkerType {
    class: string;
    slice: string;
    position?: string;
  }
  export interface ArrowType {
    class: string;
  }
  export interface ChessboardProps {
    position?: string;
    orientation?: "w" | "b";
    responsive?: boolean;
    assetsUrl?: string;
    assetsCache?: boolean;
    style?: {
      cssClass?: string;
      showCoordinates?: boolean;
      borderType?: string;
      aspectRatio?: number;
      pieces?: { type?: string; file?: string; tileSize?: number };
      animationDuration?: number;
    };
    extensions?: { class: unknown; props?: Record<string, unknown> }[];
  }
  export class Chessboard {
    constructor(context: HTMLElement, props?: ChessboardProps);
    setPosition(fen: string, animated?: boolean): Promise<void>;
    getPosition(): string;
    setOrientation(color: "w" | "b", animated?: boolean): Promise<void>;
    getOrientation(): "w" | "b";
    getPiece(square: string): string | null;
    enableMoveInput(handler: (event: MoveInputEvent) => boolean | void, color?: "w" | "b"): void;
    disableMoveInput(): void;
    cancelMoveInput(): void;
    isMoveInputEnabled(): boolean;
    destroy(): void;
    // Markers extension
    addMarker(type: MarkerType, square: string): void;
    removeMarkers(type?: MarkerType, square?: string): void;
    addLegalMovesMarkers(moves: { to: string; promotion?: string }[]): void;
    removeLegalMovesMarkers(): void;
    // Arrows extension
    addArrow(type: ArrowType, from: string, to: string): void;
    removeArrows(type?: ArrowType, from?: string, to?: string): void;
    // PromotionDialog extension
    showPromotionDialog(
      square: string,
      color: "w" | "b",
      callback: (result: { type: string; square?: string; piece?: string }) => void,
    ): void;
  }
}
declare module "cm-chessboard/src/extensions/markers/Markers.js" {
  import type { MarkerType } from "cm-chessboard/src/Chessboard.js";
  export const MARKER_TYPE: Record<string, MarkerType>;
  export class Markers {}
}
declare module "cm-chessboard/src/extensions/arrows/Arrows.js" {
  import type { ArrowType } from "cm-chessboard/src/Chessboard.js";
  export const ARROW_TYPE: Record<string, ArrowType>;
  export class Arrows {}
}
declare module "cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js" {
  export const PROMOTION_DIALOG_RESULT_TYPE: { pieceSelected: string; canceled: string };
  export class PromotionDialog {}
}
declare module "cm-chessboard/src/extensions/accessibility/Accessibility.js" {
  export class Accessibility {}
}
