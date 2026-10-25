import { Link } from "react-router-dom";
import { APP_NAME, REPO_URL, TAGLINE } from "../config";
import { LinkButton } from "../components/ui/Button";
import { useDocumentMeta } from "../components/ui/hooks";

const FAQ: { q: string; a: string }[] = [
  { q: "Is it really free?", a: `Yes. ${APP_NAME} has no paid tier, no trial and no ads. Every course and every training mode is available to everyone.` },
  { q: "Why is it free?", a: "It is a hobby project built on free tools and public data. It is a static website with no servers to pay for, so there is nothing to charge for." },
  { q: "Do I need an account?", a: "No. There is nothing to sign up for. Your progress is saved in your browser, on your device." },
  { q: "Will I lose my progress?", a: "Progress lives in your browser's storage, so clearing site data or switching browsers starts you fresh. Use Export backup on the Progress page to save a file you can restore later, on this or another device." },
  { q: "Does it work offline?", a: "Yes. After your first visit the app is cached by your browser, and training itself needs no network connection." },
  { q: "Can I trust the opening theory?", a: "The moves are checked by a program for legality, and opening names come from the Lichess dataset. The explanations are written to teach the ideas, but they are not engine-verified, so treat them as a starting point and report anything that looks wrong." },
  { q: "What do the colours mean?", a: "Each mode has its own colour: purple for Learn, green for Practice, red for Drill, blue for Time and amber for Dojo." },
];

const CREDITS: { name: string; what: string; licence: string }[] = [
  { name: "Lichess chess-openings", what: "Opening names and ECO codes for every position", licence: "CC0" },
  { name: "chess.js", what: "Move legality, SAN and PGN handling", licence: "BSD-2-Clause" },
  { name: "cm-chessboard", what: "The interactive chessboard and piece set", licence: "MIT (pieces: CC BY-SA 3.0, Colin M.L. Burnett)" },
  { name: "ts-fsrs", what: "FSRS spaced-repetition scheduling", licence: "MIT" },
  { name: "React, Vite and React Router", what: "The app itself", licence: "MIT" },
];

export default function About() {
  useDocumentMeta({
    title: "About and FAQ",
    description: `About ${APP_NAME}: a free, open-source chess opening trainer with no accounts and no tracking. How spaced repetition works, credits and FAQ.`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  });
  return (
    <div className="container prose-page">
      <header className="page-head">
        <h1>About {APP_NAME}</h1>
        <p className="page-lead">{TAGLINE}</p>
      </header>

      <section id="mission">
        <h2>Free, and staying that way</h2>
        <p>
          {APP_NAME} exists because learning openings should not cost a subscription. You pick a course, play through
          its lines against a coach that explains every move, and the app brings each line back right before you would
          forget it. Everything you see here is free, and there is no premium tier waiting behind it.
        </p>
        {REPO_URL ? (
          <p>The code is open source. <a href={REPO_URL} rel="noopener noreferrer">Read it, fork it or improve a course on GitHub</a>.</p>
        ) : (
          <p>The code and the course content are open source, so anyone can read them, fix a note or add a course.</p>
        )}
      </section>

      <section id="spaced-repetition">
        <h2>How spaced repetition works</h2>
        <p>
          You forget things on a curve: fast at first, then slowly. Spaced repetition schedules each review for just
          before the moment you would forget, so every review strengthens the memory for as long as possible.
        </p>
        <p>
          In {APP_NAME} every move you must find is its own card. When you answer, the app grades you: right first
          time and quickly is easy, right after a hint or a retry is hard, wrong means the card comes back soon. The
          schedule is computed with FSRS, a modern open algorithm that adapts to how quickly you forget each position.
          Shared moves such as 1.e4 e5 2.Nf3 are only tested once, instead of in every line.
        </p>
        <p>
          The modes build on this. <strong>Learn</strong> teaches a line with hints. <strong>Practice</strong> brings back
          what is due. <strong>Drill</strong> and <strong>Time</strong> turn recall into a game, and the{" "}
          <Link to="/dojo">Dojo</Link> mixes every course you have started.
        </p>
      </section>

      <section id="privacy">
        <h2>Privacy</h2>
        <p>
          There are no accounts, and {APP_NAME} adds no analytics, ad scripts or tracking. Your progress is saved in
          your browser's own storage and is never sent anywhere. The site is a static page, so there is no server
          that receives your data. Your host or network may still keep ordinary access logs, as with any website.
        </p>
      </section>

      <section id="credits">
        <h2>Credits</h2>
        <p>{APP_NAME} stands on free software and open data. Thank you to everyone behind these.</p>
        <ul className="credits">
          {CREDITS.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>
              <span>{c.what}</span>
              <span className="badge" data-tone="neutral">{c.licence}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="faq">
        <h2>FAQ</h2>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="about-cta">
        <LinkButton to="/openings" variant="primary" size="lg">Pick an opening</LinkButton>
      </div>
    </div>
  );
}
