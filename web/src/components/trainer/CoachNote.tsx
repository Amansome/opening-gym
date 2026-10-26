import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { BubbleState, NoteKind } from "./useLineRunner";
import { Icon } from "./icons";
import type { IconName } from "./icons";

export interface CoachNoteProps {
  note: BubbleState;
  /** buttons shown under the text ("Try again", "Let's go") */
  actions?: ReactNode;
  /** extra block above the notes (e.g. a "Trap to avoid" tag) */
  badge?: ReactNode;
  /** the opening this position belongs to, or a small caption when there is none */
  footer?: ReactNode;
}

const KIND_ICON: Record<NoteKind, IconName> = {
  correct: "check",
  wrong: "cross",
  fine: "checks",
  "other-line": "fork",
  hint: "bulb",
};

/** Pulls the lead-in out of the sentence so the status chip carries it once. */
const upFirst = (s: string | undefined) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function feedback(kind: NoteKind, text: string | undefined): { label: string; rest?: string } {
  switch (kind) {
    case "correct":
      return text && text.length <= 24 ? { label: text.replace(/[.!]$/, "") } : { label: "Correct", rest: text };
    case "wrong":
      return { label: "Not quite", rest: text?.replace(/^Not quite\.\s*/, "") };
    case "fine":
      return { label: "Good move too", rest: upFirst(text?.replace(/^Good move too!\s*/, "")) };
    case "other-line":
      return { label: "Another line", rest: text };
    case "hint":
      return { label: "Hint", rest: upFirst(text?.replace(/^Hint:\s*/, "")) };
  }
}

/**
 * The coach's note: a caption set under a painted court line (mode colour, or the feedback colour while a move is being
 * judged). The instruction is the largest thing in it.
 */
export function CoachNote({ note, actions, badge, footer }: CoachNoteProps) {
  const { text, notes, prompt, tone, kind } = note;
  const fb = kind ? feedback(kind, text) : undefined;
  const body = fb ? fb.rest : text;

  // On a phone the note sits below the fold: when a button appears ("Try again", "Let's go"), bring it above the action
  // bar, and put the page back where it was once the button is gone so the board is in view again.
  const actionsRef = useRef<HTMLDivElement>(null);
  const savedY = useRef<number | null>(null);
  const hasActions = !!actions;
  const mountedAt = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(max-width: 819px)").matches) return;
    // The first view is laid out to show the button where it is; only buttons that appear later need bringing into view.
    if (performance.now() - mountedAt.current < 800) return;
    const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (hasActions) {
      if (savedY.current === null) savedY.current = window.scrollY;
      actionsRef.current?.scrollIntoView({ block: "nearest", behavior });
    } else if (savedY.current !== null) {
      window.scrollTo({ top: savedY.current, behavior });
      savedY.current = null;
    }
  }, [hasActions, kind, text]);

  return (
    <section className={`og-note og-note--${tone}${kind ? ` og-note--${kind}` : ""}`} role="status" aria-live="polite" data-testid="coach-bubble">
      <div className="og-note__line" aria-hidden="true" />
      <div className="og-note__body">
        {badge}
        {fb && kind && (
          <p className="og-note__state" data-testid="note-state">
            <span className="og-note__stateicon" aria-hidden="true">
              <Icon name={KIND_ICON[kind]} size={15} />
            </span>
            {fb.label}
          </p>
        )}
        {body && <p className="og-note__text">{body}</p>}
        {notes.map((n, i) => (
          <p className="og-note__text og-note__move" key={i}>
            <span className="og-note__san">{n.san}</span> {n.text}
          </p>
        ))}
        {prompt && (
          <p className="og-note__prompt" data-testid="coach-prompt">
            {prompt}
          </p>
        )}
      </div>
      {actions && (
        <div className="og-note__actions" ref={actionsRef}>
          {actions}
        </div>
      )}
      {footer}
    </section>
  );
}
