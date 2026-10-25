# Chessreps teardown and plan for a free opening trainer

*Research date: 25 Oct 2026. Live site explored the same day.*

> **How this was researched:** I explored the live site at www.chessreps.com with a headless Chromium browser and HTTP requests. I loaded every main page (`/`, `/openings`, `/opening/*`, `/plans`, `/about`, `/love`, `/community`, `/dojo`, `/leaderboards`, `/analysis`, `/course-creator/new`, `/player/*`, `/contact`, the sitemap and robots.txt) and the site's public, read-only agent API (`/api/openapi.json`, `/api/agent/*`, which robots.txt explicitly allows). I played a full Learn-mode line, including a deliberate wrong move, and took desktop and mobile screenshots (`screenshots/`). Store ratings and user complaints come from the App Store and Google Play listings and third-party reviews. **Section 2 reflects the live site.** Where the live site contradicted my earlier search-based findings, I corrected them (see 2.9).

---

## 1. Summary

- **What Chessreps is:** a "Duolingo for chess" opening trainer, built by one developer (Ethan, ethan@chessreps.com, Reddit u/thats_one). You pick a course and play its lines against a bot that comments on every move. Six modes unlock in sequence: Learn → Practice → Drill / Time → Puzzles / Arena. Lines come back by spaced repetition, and daily streaks and leaderboards add a game layer.
- **Scale it claims:** "500,000+ players", "900+ courses", "4.9★ app rating". The catalogue has three layers:
  - **28 house courses** (647 lines), written by the founder in a jokey voice;
  - **57 courses from 13 GMs and 40 titled coaches**, including GM Wei Yi (2758 FIDE), GM Boris Gelfand, GM Andrey Esipenko and GM Mitrabha Guha;
  - **hundreds of community courses**. The sitemap lists 396 course pages and 128 creator profiles, in 10 languages.
- **Business model:** a 7-day free trial, then **$34.99/year** on the web (one yearly plan, shown as "$2.92/month"). The apps charge more: $7.99/month, $49.99/year or $6.99/week. The pricing page runs a 15-minute "your free trial is reserved" countdown.
- **Weak spots you can exploit:**
  - Its own FAQ says *"Other courses may not include explanations"*: only the GM courses are guaranteed to have notes.
  - Everything beyond a first taste is behind the paywall, and there's no offline mode.
  - No check of your own games against your repertoire.
  - Heavy ad tracking: TikTok, Meta, Snap and Google tags, plus PostHog.
- **Your opening:** a fully free, open-source, offline-capable trainer with an explanation on every move. Add bring-your-own repertoire plus checks against the user's real games. The core stack is free and permissively licensed: chess.js, cm-chessboard (the same board Chessreps uses), ts-fsrs, and the Lichess opening data.
- **Included in this folder:** 15 starter courses with **109 lines** and teaching notes. A script checks every move is legal and names each line from the Lichess opening dataset. See §5.

---

## 2. Product teardown (live site)

### 2.1 Platforms and traction
| | |
|---|---|
| Web | www.chessreps.com: SvelteKit on Vercel. Backend storage at `api.chessreps.com/storage/v1/...` (that URL pattern is Supabase's) |
| iOS | "Chessreps – Master Openings", App Store id `6744000612` |
| Android | `com.chessreps.app`. About 4.8★ from about 2.5K reviews, 10K+ downloads |
| Claims on the sign-up screen | "500+ courses · 4.9 star app rating · 500K+ players improving" |
| Tagline | "Train your openings against the moves real humans actually play, until the right move is automatic." |
| Languages | English plus es, fr, de, tr, it, pl, el, pt, id (each page has 9 translated URLs in the sitemap) |
| Founder and contact | Ethan, ethan@chessreps.com. Reddit u/thats_one; Discord, Instagram, TikTok, Chess.com club |
| Payments and tracking | Stripe (privacy policy). PostHog, Google Tag Manager, TikTok, Meta and Snap pixels |

Don't confuse it with **"Chess Reps"** by Jonas Mayer (`com.jonasmayer.openingmanager`), an older, unrelated Android app.

### 2.2 Site map (from the live sitemap, 5,370 URLs)
| URL | What's there |
|---|---|
| `/` | "Chess Opening Courses From Top Grandmasters". Search, filters, about 50 featured GM/IM/FM course cards (board thumbnail, coach, line count, "Try the first line") |
| `/openings` | The 28 house courses: "28 courses · 647 lines · free to start". "No idea what to pick?" picker (first White opening / answer to 1.e4 / "here for chaos") |
| `/openings/best-for-beginners` | SEO guide: one White opening plus one answer each to 1.e4 and 1.d4, linking to courses |
| `/opening/{slug}` | Course page **and** trainer in one (396 courses). See 2.4 |
| `/community` | Community courses sorted by "Hot", with upvotes, line count and "coverage score" |
| `/player/{username}` | Creator profile. Titled coaches get a bio, country, FIDE rating, peak and FIDE profile link |
| `/course-creator/new` | Course builder: name, description, play as White/Black, **"Paste a PGN or a Lichess study link, or drag & drop a .pgn"**, or build on the board |
| `/dojo` | Drills your whole repertoire at random |
| `/analysis` | Analysis board with a Stockfish eval and 3 engine lines, PGN upload, "Game Review" |
| `/leaderboards` | Drill Mode and Time Trial; weekly, monthly and all-time; plus "Your courses" rankings |
| `/plans`, `/signup`, `/signin` | Paywall and onboarding |
| `/about`, `/love`, `/contact`, legal pages | Story, dated testimonials, contact |
| `/api/agent/openings`, `/api/agent/community-courses`, `/.well-known/agent-skills/` | A public read-only API **built for AI agents** (OpenAPI spec plus SKILL.md files). robots.txt sets `Content-Signal: ai-train=yes, search=yes, ai-input=yes`. They're optimising to be recommended by AI assistants |

### 2.3 The trainer, as experienced (London course by GM Guha)
*Screenshots: `screenshots/course.png`, `learn_wrong.png`, `london_end.png`, `m_course.png`*

- **Layout:** board on the left with a **vertical engine eval bar** (e.g. "0.3"). On the right, a chat-bubble panel where the coach "speaks", with the six mode tiles below it. A purple progress bar runs across the top. On mobile the comment sits on top, then a horizontal eval bar, a full-width board, and a bottom bar with Hint and Mode.
- **Learn mode:** the first bubble is a long welcome from the GM. After each correct move the bubble explains it, then gives the next instruction in plain English: *"Play bishop to f4."*, *"Queen takes knight on b4."* The bot picks Black's replies, so different runs explore different branches. Hint and Undo buttons are available.
- **Wrong move:** a red ✕ on the piece and the bubble *"While fine, this course recommends playing pawn to e3. [Try again]"*. The wording separates a playable alternative ("While fine…") from a mistake, which suggests an engine check.
- **First line is a trap.** In Learn, Black blundered (…Nc6, …Bb4+?, Qa4+, Qxb4, Qxb7) and the line ended with *"Black is totally lost here."* and material "+4". New users win straight away. This is a deliberate onboarding hook.
- **End of line:** confetti stars, a big **"1 — IT BEGINS — 1 DAY STREAK"** animation, a streak counter in the header (flame icon), and **Practice** unlocks ("0/1 perfected").
- **Unlock gating:** Learn "0/64 discovered" → Practice ("1 line away") → Drill "0/3 lines", Time "0/3", Puzzles "0/2", Arena "0/2". Advanced modes need a few lines learned first.

### 2.4 Course pages are SEO articles too
Each `/opening/{slug}` page puts the trainer on top and a long article underneath:
**What is X → How to reach it → Pros and cons → Main variations (each with a PGN and a paragraph) → How to play against it → Plans for both sides → History → Move-by-move study guide (the coach's full commentary as text) → FAQ** ("Is X good for beginners?", "Do grandmasters play X?", "How many moves of theory do I need?").
This is how they rank for "london system", "caro kann" and similar searches, multiplied across 396 courses and 10 languages.

### 2.5 Modes (from the live `/about` and `/plans` copy)
| Mode | Behaviour | Colour |
|---|---|---|
| **Learn** | Play against the bot with hints and "tweet-sized blurbs". *"The smart system figures out which lines you need the most help on and creates a practice cohort. As you improve, this cohort grows from a few lines to ALL the lines in the course."* | violet |
| **Practice** | Repeat learned lines without hints. "Practice brings your shakiest lines back first." | – |
| **Drill** | Lines back to back. One mistake resets the streak. Feeds the leaderboards | red |
| **Time** | 60 seconds. *"Correct answers add precious seconds, but the clock speeds up."* | blue |
| **Puzzles** | Tactics "taken from real games where the opening you're learning was played" | green |
| **Arena** *(new)* | *"A bot near your rating. It plays the course line, then chooses replies real players made at your level."* Effectively, play out the opening against human-like moves | – |
| **Dojo** | Random drilling across your whole repertoire | – |
| Spaced repetition | "Lines come back before you forget" | – |
| Daily streak | Header counter, celebration screens | – |
| Leaderboards | Drill and Time, weekly, monthly, all-time, per course | – |

### 2.6 Content catalogue
**28 house courses** (full list in `data/chessreps-house-courses.json`), each tagged with a style: Classical, Gambit, Attack, Trap-heavy, Solid, Counterattack or System.
- *White (16):* London (28 lines), QGA (16), Ruy Lopez (55), Fried Liver (15), Vienna Gambit (14), Danish Gambit (15), King's Gambit (22), Jobava London (26), Italian (22), Scotch (27), Vienna Game (19), Ponziani (19), QGD (20), Alapin Sicilian (21), Bishop's Opening (19), English (17).
- *Black (12):* Sicilian (38), Caro-Kann (28), Traxler (26), Rousseau Gambit (24), King's Indian (35), Scandinavian (25), Stafford Gambit (20), Englund Gambit (15), French (26), Petrov (24), Albin (17), Counter the Vienna Gambit (14).
- **The voice is part of the product:** "This isa one-a spicy-a meatball-a! 🍝", "Destroy kids who took the vienna gambit course on chessreps.com", "PLEASE don't click this unless you know what you're doing".
- **The house catalogue leans heavily on gambits and traps** (Fried Liver, Danish, Stafford, Englund, Rousseau, Traxler). That's what beginners and TikTok audiences click on.

**Titled-coach courses** (57; home page sample): Italian (GM Wei Yi, 103 lines), Ruy Lopez (GM Esipenko, 124), London (GM Guha, 64), Fried Liver (GM Fidel Corrales, 46), Vienna Gambit (GM Nikita Meshkovs, 52), Petroff (GM Boris Gelfand, 73), Sicilian Kan (GM Luka Budisavljevic, 52), Trompowsky (GM Sasa Martinovic, 32), Centre Game (GM Jacek Stopa, 32), Réti (GM Łukasz Jarmuła, 26), Vienna (GM Pouya Idani, 52), KID (GM Krisztian Szabo, 30), French and Traxler (NM Dan Heisman, 64 and 116), plus many IM, FM and CM courses (Catalan, Grünfeld, Benoni, Alekhine, Smith-Morra, English Botvinnik, "Counter the X" anti-repertoires…).

**Community courses:** about 37 lines on average among the top 50, with at most 12 upvotes. Quality varies a lot (e.g. "QID MACHINE ELO 3900+", "Grek gift game… please give this course like's🥺"). Each card shows a **"coverage score"** (e.g. 2345). It's probably a measure of how much real-game traffic the lines cover.

### 2.7 Pricing (live `/plans`)
- **Web:** "Start 7 days free" → **$34.99/year**, shown as "$2.92/month". There is *no* monthly plan on the web any more. "No payment today. Cancel anytime. We'll remind you before it ends." A **"Your free trial is reserved for: 15:00"** countdown is an urgency dark pattern.
- **What's included:** every GM course, every line of 900+ courses, Drill, Time, Puzzles, Arena, Dojo, spaced repetition, publishing your own courses, sync across web, iPhone and Android.
- **App Store (US):** $7.99/month, $49.99/year, $6.99/week.
- **Free without signing up:** the first line(s) of any course in Learn mode, the analysis board, and browsing.

### 2.8 What users say
- 👍 Testimonials on `/love` are dated and attributed by first name: "cancelled my Chessly and Chessable accounts", "gained 200 ELO in one month", "nothing has helped me drill opening theory like your site".
- 👎 From store reviews and forums: missing explanations in non-GM courses (now acknowledged in the site's own FAQ); paywall and price ("waste of money" thread on Chess.com); no offline mode; charged without a trial; confetti and visual bugs; no check of your own games.

### 2.9 Corrections to my first, search-based version
- **The course creator *does* import:** you can paste a PGN, paste a Lichess study link, or drop a .pgn file. A competitor's comparison page had claimed otherwise.
- **The web price is now yearly only** ($34.99). The $4.99/month figure on `/about` is out of date.
- **The `/changelog` page is gone** (404). The "Dojo launched Mar 2025" and "Smart Line Selection" items came from an old snapshot.
- **New things the snapshots didn't show:** **Arena** mode, the **analysis board with Game Review**, daily streaks, **coverage score**, 10 languages, the AI-agent API, and the long SEO article on every course page.

---

## 3. Competitor landscape

| Product | Model | Notes |
|---|---|---|
| **Chessable** | Paid courses | The original "MoveTrainer" spaced-repetition course store. Huge GM catalogue, expensive |
| **Chessbook** | Freemium | Build a repertoire from Lichess data, with SRS |
| **ChessAtlas** | Free core | Personal repertoire, FSRS scheduling, game import with **deviation detection**; free core of 200 variations |
| **ChessFlare** | Freemium | Repertoire, game connection, SM-2 scheduling |
| **Chessdriller** | Free, open source | Drills a repertoire stored as Lichess studies (github.com/gtim/chessdriller) |
| **Listudy** | Free, open source | Opening trainer built from Lichess studies (from my own knowledge; not re-checked in this pass) |
| **ChessTempo** | Freemium | Opening training plus an opening database |
| **Lichess** | Free | Studies, opening explorer, practice. No dedicated SRS trainer |

**Gap in the market:** nobody combines **(a) free**, **(b) curated courses with an explanation on every move**, **(c) Chessreps-style gamified modes** (streak, time trial, leaderboards, Dojo), and **(d) bring-your-own repertoire plus game-deviation checks**.

---

## 4. How to build the free version

### 4.1 Recommended stack (licences checked on npm, 25 Oct 2026)
| Need | Pick | Licence | Notes |
|---|---|---|---|
| Move legality, SAN, PGN | **chess.js** 1.4.0 | BSD-2 | Used by the validator in this folder |
| Board UI | **chessground** 9.x / `@lichess-org/chessground` 10.x | GPL-3.0+ | The Lichess board. Fine **if you open-source the whole site**, which suits a free project |
| Board UI (permissive) | **cm-chessboard** 8.x or **react-chessboard** 5.x | MIT | **Chessreps itself uses cm-chessboard.** Pick one of these if you want to keep the code closed |
| Spaced repetition | **ts-fsrs** 5.x | MIT | FSRS beats SM-2 at review scheduling. ChessAtlas markets it as a differentiator |
| Engine (optional analysis) | **stockfish** (WASM) 19 | GPL-3.0 | Runs in a Web Worker. Use it for the "why is this bad?" eval bar |
| Opening names | **lichess-org/chess-openings** | CC0 | 3,865 named positions, 150 families. Already in `data/*.tsv` |
| "Real opponent" move frequencies | **Lichess open database** (database.lichess.org) | CC0 per Lichess (check the page) | Precompute a popularity tree offline, per rating band |
| Puzzles from your opening | **Lichess puzzle DB** (~6M puzzles, `OpeningTags` column) | Same as above | Filter by opening tag. Rebuilds Chessreps' "green puzzles" for free |
| Live explorer (optional) | Lichess Opening Explorer API | – | **Since Mar 2026 it requires a logged-in token.** Use Lichess OAuth (PKCE) per user, or rely on the precomputed tree |
| App shell | Vite + React (or SvelteKit) as a **PWA** | – | Offline works out of the box, which fixes a top Chessreps complaint |
| Storage | IndexedDB, local-first. Optional sync with Supabase or Firebase free tier | – | No account needed to start training |
| Hosting | Cloudflare Pages, Vercel or GitHub Pages | – | Static site, about $0 a month |

### 4.2 Data model
```
Course { id, title, side: white|black, level, eco, summary, ideas[], author }
Node   { id, fen/epd, san, uci, note?, trained: bool, children[] }   // tree; key by EPD so transpositions merge
Line   { courseId, name, kind: main|alternative|warning, nodeIds[] }
Card   { userId, courseId, nodeId, fsrs: {due, stability, difficulty, reps, lapses, state} }
Review { cardId, rating: again|hard|good|easy, ms, mode, ts }
Score  { userId, mode: drill|trial, value, day, week }               // leaderboards
```
A **card is one "your move" node** (a position where you must find the move). That's finer-grained than per-line cards, and it means a shared trunk like `1.e4 e5 2.Nf3` doesn't get re-tested in every line.

### 4.3 Training logic
- **Grading:** right on the first try and fast → *Easy*. Right on the first try → *Good*. Right after a hint or a retry → *Hard*. Wrong → *Again*, then show the arrow and the note, and replay the line.
- **Choosing the opponent's move** (where Chessreps' "Smart Line Selection" matters): at a branch, weight each child by the number of **due or weak cards in its subtree**, multiplied by **Lichess popularity** at the user's rating. Popular lines get drilled most, and weak ones come back soon.
- **Learn:** show the move and its note, ask the user to play it, give hints freely. Each move only gets an FSRS card once it has been learned.
- **Practice / Review:** due cards first, no hints.
- **Drill (streak):** play random lines; one mistake ends the run; record the best streak.
- **Time Trial:** 60 seconds, starting on the first move; +1 per correct move. A mistake shows the right move and then resets the line, as Chessreps does.
- **Dojo:** random drilling across all of the user's courses, due cards first.
- **Deviation checker (beats Chessreps):** import the user's last N Lichess or Chess.com games (both have free public game APIs) and flag the first move where they or their opponent left the repertoire. One click turns that into a card.

### 4.4 Roadmap
1. **MVP (2–4 weeks):** board, course tree player, Learn/Practice/Drill modes, FSRS, local storage, the 15 seed courses, PWA.
2. **v1:** Time Trial, Dojo, accounts with sync, leaderboards, streaks, course pages for SEO (`/opening/{slug}` with an interactive board and explanation text, which is Chessreps' SEO strategy).
3. **v2:** course creator plus PGN and Lichess-study import, community courses, popularity-weighted lines, puzzles filtered by opening, game import and deviation detection.
4. **v3:** engine eval in Learn mode, rating-band trees ("what 1200s actually play"), translations, mobile wrappers (Capacitor).

### 4.5 Legal and brand notes
- **Opening moves are facts and not copyrightable.** Chessreps' course **texts, GM course content, descriptions, branding and the "Chessreps"/"Reps" names are theirs.** Write your own notes (as I did) and pick your own name. Don't scrape their courses.
- If you use chessground or Stockfish (GPL), publish your source code.
- Credit Lichess for the openings dataset and database exports.

### 4.6 Patterns worth copying from the live product
- **Win in the first minute:** make line #1 of every course a short trap where the opponent blunders, then show a streak celebration.
- **Unlock modes in sequence** (Learn → Practice → Drill/Time → Puzzles/Arena), so new users aren't overwhelmed and there's always a "next" thing.
- **Grade wrong moves:** "While fine, this course recommends X" for playable moves (check with Stockfish within about 0.5) versus "Mistake: here's why" for bad ones.
- **Spoken-style instructions** ("Play bishop to f4") plus an eval bar. Good for beginners and accessibility.
- **The SEO article template** for every course page (2.4), with schema.org FAQ markup. Pre-render board thumbnails per FEN for cards and social previews.
- **A public read-only API plus robots.txt signals** so AI assistants and search engines can discover and recommend your courses.
- **Your edge:** keep all of the above, but free, offline, with notes on every move, and with checks against the user's real games.

---

## 5. Opening curriculum (included in this folder)

Every line is in `data/courses.js`. `npm run validate` replays each move with chess.js and:
1. rejects illegal or misspelt SAN moves;
2. checks that every note is attached to a real move label (e.g. `5.c3`, `5...d6`);
3. checks **repertoire consistency**: a course must give one answer per position for the side it trains. Lines marked `alternative` (a second option) or `warning` (a mistake to avoid) are exempt;
4. names every position using the Lichess CC0 dataset, so transpositions are recognised;
5. writes `dist/courses.json` with a merged move tree per course (FEN, UCI, note and opening name on each node), ready for a frontend.

Current result: **15 courses, 109 lines, 0 errors.**

### White
| Course | Level | Lines | What's covered |
|---|---|---|---|
| Italian Game (slow c3/d3) | Beginner | 6 | Giuoco Pianissimo main plan, the ...d5 break, Two Knights with 4.d3, Hungarian, Petrov, Philidor |
| Italian: aggressive 4.Ng5 | Intermediate | 3 | 5...Na5 main line, Fried Liver, Traxler |
| London System | Beginner | 6 | Main structure, ...c5/...Qb6 (including the Nc3 gambit trap), KID setup, ...b6, mirrored ...Bf5 |
| Queen's Gambit | Intermediate | 6 | QGD Exchange (minority attack), QGA, Slav main line, Albin, Chigorin, Elephant Trap (warning) |
| Ruy Lopez | Advanced | 9 | Closed Chigorin, Marshall (alternative), Anti-Marshall 8.a4, Open, Anti-Berlin 4.d3, Steinitz Deferred, Classical, Bird, Noah's Ark (warning) |
| Scotch Game | Intermediate | 4 | Classical 5.Nxc6 (5.Be3 as alternative), Mieses, Steinitz |
| 1.e4 vs everything else | Intermediate | 9 | Alapin vs 2...Nf6, 2...d5, 2...e6. Caro-Kann Advance, French Advance, Scandinavian (both), Pirc 150 Attack, Alekhine Modern |

### Black
| Course | Level | Lines | What's covered |
|---|---|---|---|
| Caro-Kann | Beginner | 8 | Classical, Advance (4.Nf3 and 4.h4), Exchange, Panov, Two Knights, Fantasy, smothered-mate trap (warning) |
| 1...e5 (Open Games) | Beginner | 14 | Italian (5.d4 and Pianissimo), Evans declined, Berlin (endgame and 5.Re1), Anti-Berlin, Scotch, Scotch Four Knights, Vienna (3.f4 and 3.Bc4), King's Gambit, Centre Game, Ponziani, anti-Scholar's Mate |
| Sicilian Najdorf | Advanced | 8 | English Attack, 6.Bg5, 6.Be2, 6.Bc4, Moscow 3.Bb5+, Alapin, Smith-Morra, Grand Prix |
| French Defence | Intermediate | 6 | Advance (including Milner-Barry), Exchange, Rubinstein against both 3.Nc3 and 3.Nd2, King's Indian Attack |
| Scandinavian | Beginner | 5 | 3...Qa5 main line, 3.Nf3, 3.d4, 2.e5, 2.Nc3 |
| QGD for Black | Intermediate | 6 | Exchange, Tartakower, 5.Bf4, Catalan, vs London, Lasker Trap (warning) |
| King's Indian | Advanced | 6 | Mar del Plata, Bayonet, Sämisch Gambit, Four Pawns, Fianchetto, Averbakh |

### Both sides
| Course | Level | Lines | What's covered |
|---|---|---|---|
| Opening Traps | Beginner | 13 | Scholar's, Fool's, Légal's, Blackburne Shilling, King's Gambit ...Qh4+, Englund, Kieninger, Caro-Kann smothered mate, Elephant, Lasker, Noah's Ark, Fried Liver, Milner-Barry queen trap |

### Suggested starter repertoires
- **New players (under 1200):** White: London **or** Italian (slow plan). Black vs 1.e4: Scandinavian or 1...e5. Black vs 1.d4: QGD. Then the Traps course.
- **Club players (1200–1800):** White: Italian + the "1.e4 vs everything else" course, or Queen's Gambit. Black: Caro-Kann + QGD.
- **Ambitious players:** Ruy Lopez or Scotch. Najdorf + King's Indian.

### Content still to write (to cover what Chessreps has)
- **Gambit and trap courses** (the most-clicked part of Chessreps' house catalogue). For White: Vienna Gambit, Danish, King's Gambit, Fried Liver as its own course, Bishop's Opening, Ponziani. For Black: Stafford, Englund, Rousseau, Traxler, Albin, Petrov.
- **White systems:** English, Réti, Jobava London, Vienna Game, Trompowsky.
- **Black vs 1.d4:** Nimzo-Indian/Queen's Indian, Slav, Grünfeld, Dutch, Benoni. **Black vs 1.c4 / 1.Nf3.** **Black vs 1.e4:** Pirc, Modern, Alekhine, Petrov.

The data format and validator handle all of them.

### Accuracy caveat
Legality, note placement, consistency and opening names are machine-checked. **The evaluations and teaching notes come from standard theory as I know it and have not been engine-verified.** Before launch: (1) run each line's final position through Stockfish to catch anything dubious, and (2) have a titled player review the notes, as Chessreps does with its GM courses. Opening theory changes over time, so add a "reviewed on" date to each course.

---

## 6. Files in this folder
| Path | What it is |
|---|---|
| `REPORT.md` | This report |
| `data/courses.js` | The 15 seed courses (moves, notes, ideas, summaries) |
| `data/a.tsv` … `e.tsv` | Lichess chess-openings dataset (CC0), 3,865 named openings |
| `scripts/validate.js` | Validator and tree builder (`npm install && npm run validate`) |
| `dist/courses.json` | Built output: course trees with FEN, UCI, notes and opening names on every node |
| `data/chessreps-house-courses.json` | Chessreps' 28 house courses (name, slug, colour, description) from their public agent API. **For reference only. Don't reuse their text** |
| `screenshots/` | Desktop and mobile screenshots of the live Chessreps UI: home, course/trainer, wrong-move feedback, end-of-line streak, creator, analysis, pricing, community, player profile |

---

## Sources
- Chessreps pages (via search snapshots): [Home](https://www.chessreps.com/) · [About](https://www.chessreps.com/about) · [Openings](https://www.chessreps.com/openings) · [Pricing](https://www.chessreps.com/plans) · [Dojo](https://www.chessreps.com/dojo) · [Leaderboards](https://www.chessreps.com/leaderboards) · [Changelog](https://www.chessreps.com/changelog) · [Community](https://www.chessreps.com/community) · [Love](https://www.chessreps.com/love) · [London course](https://www.chessreps.com/opening/london) · [Ruy Lopez course](https://www.chessreps.com/opening/ruy-lopez) · [Creator profile example](https://www.chessreps.com/player/furreto)
- App listings: [App Store](https://apps.apple.com/us/app/chessreps-master-openings/id6744000612) · [Google Play](https://play.google.com/store/apps/details?id=com.chessreps.app&hl=en) · [AppBrain](https://www.appbrain.com/app/chessreps-master-openings/com.chessreps.app) · [mwm.ai](https://mwm.ai/apps/chessreps-master-openings/6744000612) · [APKPure](https://apkpure.net/chessreps/com.chessreps.app)
- Reviews and comparisons (several are written by competitors): [ChessAtlas vs ChessReps](https://chessatlas.net/features/vs-chessreps) · [ChessFlare vs Chessreps](https://chessflare.com/resources/chessflare-vs-chessreps) · [Chessmate: best opening trainers 2026](https://www.trychessmate.com/blog/best-chess-opening-trainer-apps-2026) · [ChessAtlas: 7 tools compared](https://chessatlas.net/blog/tool-comparisons/best-chess-opening-trainers-2026-honest-comparison-of-7-tools) · [Chess.com forum thread](https://www.chess.com/forum/view/chess-openings/chessreps-was-a-waste-of-money-yes) · [Discord listing](https://discordhunt.com/es/servers/1332888678522949713)
- Open-source and data: [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings) · [Lichess database](https://database.lichess.org/) · [Lichess changelog (explorer now requires login)](https://lichess.org/changelog) · [lila-openingexplorer](https://github.com/lichess-org/lila-openingexplorer) · [Chessdriller](https://github.com/gtim/chessdriller) · [ts-fsrs](https://www.jsdelivr.com/package/npm/ts-fsrs) · [chessground](https://www.npmjs.com/package/chessground)
