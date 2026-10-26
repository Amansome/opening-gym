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
function feedback(kind: NoteKind, text: string | undefined): { label: string; rest?: string } {
  switch (kind) {
    case "correct":
      return text && text.length <= 24 ? { label: text.replace(/[.!]$/, "") } : { label: "Correct", rest: text };
    case "wrong":
      return { label: "Not quite", rest: text?.replace(/^Not quite\.\s*/, "") };
    case "fine":
      return { label: "Good move too", rest: text?.replace(/^Good move too!\s*/, "") };
    case "other-line":
      return { label: "Another line", rest: text };
    case "hint":
      return { label: "Hint", rest: text?.replace(/^Hint:\s*/, "") };
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
      {actions && <div className="og-note__actions">{actions}</div>}
      {footer}
    </section>
  );
}
