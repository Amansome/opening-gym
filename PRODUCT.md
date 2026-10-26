# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Beginners rated under about 1000 who are learning their first openings. They play online (Lichess, Chess.com) and sometimes in school or club events. They train about equally on a phone (short daily sessions) and on a laptop (longer study with the articles, analysis board and course creator).

## Product Purpose

Opening Gym teaches chess openings move by move, explains every move in plain English, then brings each line back with spaced repetition until the player plays it without thinking. Success means a beginner reaches move 10 of their games in a position they recognise and understand, and comes back the next day.

## Positioning

Free with no paywall, no account and no tracking. Progress lives on the device. Every move in every built-in course has an explanation, and the lines are engine-checked. It can check a player's real Lichess or Chess.com games against their courses and show where they left their prep. It works offline once loaded.

## Operating Context

- Modes: Learn (hints and notes), Practice (due and weak lines first), Drill (streak, one mistake ends the run), Time (60 seconds), Dojo (all started courses mixed).
- Other surfaces: course directory and course pages, each with a long explanatory article; progress with streak, activity heatmap and backups; analysis board (Stockfish); check-my-games; course creator (board, PGN, Lichess study import).
- Sessions are short and repeated, usually daily. Players move pieces by click/tap or drag.

## Capabilities and Constraints

- Static site, local-first (IndexedDB), offline-capable PWA, prerendered course pages for search.
- React 19 + TypeScript + Vite, cm-chessboard (MIT) board, chess.js, ts-fsrs, Stockfish lite WASM.
- No backend, accounts, analytics or external font requests.
- Must work at 360px wide with no horizontal scroll, by keyboard, and with reduced motion.

## Brand Commitments

- Name: Opening Gym (confirmed). Voice: friendly, plain, encouraging, honest about dubious gambits.
- Must not look like Chessreps (its dark UI, purple accent, white coach speech bubble beside the board and mode-tile grid). Confirmed by the user.

## Evidence on Hand

- 24+ built-in courses with articles in data/courses.js; engine audit in ENGINE-AUDIT.md.
- No testimonials, user counts, ratings or press exist. Never invent them.

## Product Principles

1. Explain, don't just drill: every move a beginner plays comes with the reason.
2. Short, winnable sessions: early quick wins and a clear next step every time.
3. Respect the player: free, private, no dark patterns, honest about weak openings.
4. Familiar controls first: a beginner should never wonder how to move a piece or what to tap next.
