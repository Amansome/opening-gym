import type { CSSProperties } from "react";
import { START_EVAL_CP, describeEval, evalShare, formatEval } from "../../lib/trainer";

export interface EvalBarProps {
  /** centipawns from White's view; null/undefined = no precomputed eval for this position */
  cp: number | null | undefined;
  /** board orientation: the side shown at the bottom (vertical) / left (horizontal) is the side at the bottom of the board */
  orientation: "white" | "black";
}

/**
 * Slim eval bar: a maple strip filled from the side that is ahead, with a painted half-court line at "equal".
 * Vertical beside the board on desktop, horizontal above it on mobile (CSS decides).
 */
export function EvalBar({ cp, orientation }: EvalBarProps) {
  const known = typeof cp === "number";
  const value = known ? cp : START_EVAL_CP;
  const share = known ? evalShare(value) : 0.5;
  const whiteAhead = value >= 0;
  return (
    <div
      className="og-eval"
      data-testid="eval-bar"
      data-orient={orientation}
      data-eval={known ? value : ""}
      data-lead={whiteAhead ? "white" : "black"}
      style={{ "--og-eval-share": share } as CSSProperties}
      role="img"
      aria-label={known ? `Engine evaluation ${formatEval(value)}. ${describeEval(value)}.` : "Engine evaluation not available for this position"}
    >
      <div className="og-eval__fill" />
      <span className="og-eval__mid" aria-hidden="true" />
      <span className="og-eval__label" data-testid="eval-label">
        {known ? formatEval(value) : "–"}
      </span>
    </div>
  );
}
