# Third-party notices

Opening Gym's own code is released under the [MIT licence](LICENSE). It is built on the free software and
open data below. Each component keeps its own licence; the text here is a summary, and the full licence
files ship inside each package (`web/node_modules/<package>/`) and, for the engine, in `web/public/engine/`.

## Shipped to users in the built app

| Component | Version | Licence | Copyright / source |
|---|---|---|---|
| [chess.js](https://github.com/jhlywa/chess.js) | 1.4.0 | BSD-2-Clause | Copyright (c) 2025, Jeff Hlywa |
| [cm-chessboard](https://github.com/shaack/cm-chessboard) | 8.15.4 | MIT | Copyright (c) 2017 Stefan Haack |
| cm-chessboard piece set `standard` (see below) | from cm-chessboard 8.15.4 | CC BY-SA 3.0 | Colin M.L. Burnett (Cburnett), Rfc1394, modified by Stefan Haack |
| [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 5.4.2 | MIT | Copyright (c) 2026 Open Spaced Repetition |
| [idb-keyval](https://github.com/jakearchibald/idb-keyval) | 6.3.0 | Apache-2.0 | Copyright 2016, Jake Archibald |
| [React](https://github.com/facebook/react) and react-dom | 19.3.1 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates |
| [React Router](https://github.com/remix-run/react-router) (react-router, react-router-dom) | 7.18.4 | MIT | Copyright (c) React Training LLC 2015-2019, Remix Software Inc. 2020-2021, Shopify Inc. 2022-2023 |
| [Stockfish.js](https://github.com/nmrugg/stockfish.js) (build `stockfish-19-lite-single`) | 19 | GPL-3.0 | Stockfish.js (c) 2026 Chess.com, LLC; based on [Stockfish](https://github.com/official-stockfish/Stockfish), (c) T. Romstad, M. Costalba, J. Kiiski, G. Linscott and other contributors; neural network by Chris Bao (sscg13) |
| [Lichess chess-openings](https://github.com/lichess-org/chess-openings) data (`data/*.tsv`) | snapshot | CC0 1.0 | Lichess contributors. Names and ECO codes only; no attribution is required, but we credit it |

Build tools (Vite, TypeScript, Vitest, Oxlint, Playwright and their dependencies) are used to build and test
the app and are not part of what users download. Vite, TypeScript and Playwright are MIT or Apache-2.0 licensed.

### Chess piece set (CC BY-SA 3.0)

The pieces drawn on the board come from cm-chessboard's `standard` sprite
(`cm-chessboard/assets/pieces/standard.svg`). The licence note at the top of that file reads:

> The chess pieces in this sprite are copies from Wikimedia Commons
> https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces/Standard
>
> License: Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
> https://creativecommons.org/licenses/by-sa/3.0/
>
> Authors:
> - https://en.wikipedia.org/wiki/User:Cburnett
> - https://en.wikipedia.org/wiki/User:Rfc1394
>
> modified by shaack (https://shaack.com) for the usage in cm-chessboard.
> https://github.com/shaack/cm-chessboard

We use the sprite unmodified. Attribution is shown in the app (About page credits and the footer). The
ShareAlike condition applies to the piece artwork and any adaptation of it, not to the rest of the code.
Do not switch to cm-chessboard's other bundled set (`staunty.svg`) without checking: its header says it is
CC BY-NC-SA 4.0, which does not allow commercial use.

### Stockfish.js (GPL-3.0)

The analysis board runs Stockfish.js in a Web Worker. It is shipped as a **separate program**, unmodified,
in `web/public/engine/` (`stockfish-19-lite-single.js` and `.wasm`), together with its licence in
`web/public/engine/Copying.txt` (GNU GPL version 3). The app talks to it only through the UCI text protocol
via `postMessage`.

Corresponding source for the exact engine build:
- Stockfish.js: https://github.com/nmrugg/stockfish.js (npm: https://www.npmjs.com/package/stockfish, version 19.0.1)
- Stockfish: https://github.com/official-stockfish/Stockfish

If you redistribute this app with the engine, keep `Copying.txt` next to the engine files and keep this
source link (or provide the source another way), as the GPL requires.

## Course content

The opening courses in `data/courses.js` (move lines, notes and articles) were written for this project.
Opening names come from the Lichess dataset above. The courses are original text and are not copied from
any commercial trainer.
