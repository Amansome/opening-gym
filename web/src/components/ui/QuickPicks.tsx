import { Link } from "react-router-dom";
import { getCourse } from "../../lib/courses";

const PICKS: { question: string; ids: string[] }[] = [
  { question: "First opening as White?", ids: ["london-system", "italian-game"] },
  { question: "Need an answer to 1.e4?", ids: ["caro-kann", "scandinavian"] },
  { question: "Need an answer to 1.d4?", ids: ["queens-gambit-declined-black", "kings-indian"] },
  { question: "Just here for the traps?", ids: ["opening-traps"] },
];

export function QuickPicks({ headingId }: { headingId: string }) {
  return (
    <section className="picks" aria-labelledby={headingId}>
      <h2 id={headingId} className="picks-title">No idea what to pick?</h2>
      <div className="picks-rows">
        {PICKS.map((p) => {
          const found = p.ids.map((id) => getCourse(id)).filter((c) => !!c);
          if (found.length === 0) return null;
          return (
            <div className="picks-row" key={p.question}>
              <span>{p.question}</span>
              <span className="picks-chips">
                {found.map((c) => (
                  <Link key={c.id} to={`/opening/${c.id}`} className="chip">
                    {c.title}
                  </Link>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
