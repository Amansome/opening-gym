import { Link, NavLink, Outlet, ScrollRestoration } from "react-router-dom";
import { APP_NAME, REPO_URL, TAGLINE } from "../../config";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { useStreak, useTheme } from "../ui/hooks";

const NAV: { to: string; label: string; icon: IconName }[] = [
  { to: "/openings", label: "Openings", icon: "book" },
  { to: "/dojo", label: "Dojo", icon: "target" },
  { to: "/progress", label: "Progress", icon: "chart" },
  { to: "/about", label: "About", icon: "info" },
];

export function BrandMark() {
  // A court's centre circle and halfway line on a maple tile.
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="var(--mark-bg, var(--floor))" />
      <path d="M32 6v52" stroke="var(--mark-line, var(--court-blue))" strokeWidth="5" />
      <circle cx="32" cy="32" r="14" fill="var(--mark-bg, var(--floor))" stroke="var(--mark-line, var(--court-blue))" strokeWidth="5" />
      <circle cx="32" cy="32" r="5" fill="var(--court-yellow)" />
    </svg>
  );
}

function Header() {
  const streak = useStreak();
  const [theme, toggleTheme] = useTheme();
  const current = streak?.current ?? 0;
  const dark = theme === "dark";
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${APP_NAME} home`}>
          <BrandMark />
          <span>{APP_NAME}</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-spacer" />
        <div className="header-actions">
          <Link
            to="/progress"
            className="streak-badge"
            data-active={current > 0}
            aria-label={`Daily streak: ${current} ${current === 1 ? "day" : "days"}`}
          >
            <Icon name="flame" />
            <span className="streak-num">{current}</span>
            <span className="streak-unit" aria-hidden="true">{current === 1 ? "day" : "days"}</span>
          </Link>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          >
            <Icon name={dark ? "sun" : "moon"} />
            <span className="theme-label" aria-hidden="true">{dark ? "Day" : "After hours"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to}>
          <Icon name={n.icon} />
          <span>{n.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand footer-brand" aria-label={`${APP_NAME} home`}>
              <BrandMark />
              <span>{APP_NAME}</span>
            </Link>
            <p style={{ marginTop: 12, maxWidth: "36ch" }}>{TAGLINE}</p>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              <li><Link to="/openings">All openings</Link></li>
              <li><Link to="/dojo">Dojo</Link></li>
              <li><Link to="/progress">My progress</Link></li>
              <li><Link to="/about">About &amp; FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h2>Tools</h2>
            <ul>
              <li><Link to="/create">Create a course</Link></li>
              <li><Link to="/check">Check my games</Link></li>
              <li><Link to="/analysis">Analysis board</Link></li>
            </ul>
          </div>
          <div>
            <h2>Free &amp; open source</h2>
            <ul>
              {REPO_URL ? (
                <li><a href={REPO_URL} rel="noopener noreferrer">Source code</a></li>
              ) : null}
              <li><Link to="/about#credits">Credits</Link></li>
              <li><Link to="/about#privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <p className="footer-note">
          Free and open source. Opening names from the Lichess chess-openings dataset (CC0). Board by cm-chessboard
          with pieces by Cburnett (Wikimedia Commons, CC BY-SA 3.0), rules by chess.js, scheduling by ts-fsrs. No accounts, no tracking: your progress stays on your device.
        </p>
      </div>
    </footer>
  );
}

export function Layout() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <ScrollRestoration />
    </>
  );
}
