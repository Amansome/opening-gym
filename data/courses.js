// Seed opening courses for a free Chessreps-style trainer.
// Each line is a SAN move list. Notes are keyed by move label ("5.c3" for White, "5...d6" for Black)
// and become the "Learn mode" blurbs. scripts/validate.js checks every move is legal, every note
// label exists, and that each course gives exactly one answer per position for the side it trains.
// Line kinds: "main" (default, the repertoire), "alternative" (a second option you may choose instead),
// "warning" (shows a mistake to avoid). Only main lines are held to the one-answer rule.

module.exports = [
  // ───────────────────────────── WHITE ─────────────────────────────
  {
    id: "italian-game",
    title: "Italian Game (Giuoco Piano, slow c3/d3 plan)",
    side: "white",
    level: "beginner",
    eco: "C50-C54",
    summary:
      "The easiest way for White to meet 1...e5. Quick development, castle, then a slow c3/d3 build-up before choosing between d3-d4 or a kingside attack with Nbd2-f1-g3.",
    ideas: [
      "Bc4 points at f7, Black's weakest square before castling.",
      "c3 + d3 keeps the centre solid and prepares d4 later; it also gives the bishop a retreat (Bb3/Bc2).",
      "Classic manoeuvre: Nbd2-f1-g3 (or e3) to bring a knight to the kingside.",
      "h3 stops ...Bg4 and ...Ng4; a4 grabs space against ...b5.",
    ],
    lines: [
      {
        name: "Giuoco Pianissimo: main plan",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O a6 7.a4 O-O 8.Re1 Ba7 9.h3 h6 10.Nbd2 Re8 11.Nf1",
        notes: {
          "3.Bc4": "The Italian bishop eyes f7, the square only Black's king defends.",
          "4.c3": "Prepares d4 one day and gives the bishop a retreat on c2/b3.",
          "5.d3": "The modern slow approach: solid centre, no early commitments.",
          "7.a4": "Stops ...b5 from kicking the bishop and gains queenside space.",
          "9.h3": "Takes g4 away from Black's bishop and knight.",
          "11.Nf1": "Typical Italian manoeuvre: the knight heads to g3 or e3.",
        },
      },
      {
        name: "Black breaks with ...d5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 O-O 6.O-O d5 7.exd5 Nxd5 8.Re1",
        notes: {
          "6...d5": "Black frees the position immediately.",
          "8.Re1": "Hits e5. Black must keep the pawn protected while the d5 knight can be harassed.",
        },
      },
      {
        name: "Two Knights Defence: calm 4.d3",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Be7 5.O-O O-O 6.Re1 d6 7.c3",
        notes: {
          "4.d3": "Protects e4 and avoids the sharp 4.Ng5 theory. Same plans as the Pianissimo.",
        },
      },
      {
        name: "Hungarian Defence 3...Be7",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Be7 4.d4 d6 5.d5 Nb8 6.Bd3",
        notes: {
          "3...Be7": "Passive. White takes the centre straight away.",
          "5.d5": "Gains space and pushes the knight back.",
        },
      },
      {
        name: "Petrov Defence 2...Nf6",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3",
        notes: {
          "3.Nxe5": "Take the pawn, but remember Black's next move is ...d6, not ...Nxe4.",
          "4.Nf3": "Retreat first. 4...Nxe4 is now safe for Black because the e-file is closed.",
        },
      },
      {
        name: "Philidor Defence 2...d6",
        moves: "1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Be7 6.Bf4 O-O 7.Qd2",
        notes: {
          "3.d4": "Against the passive Philidor, open the centre at once.",
          "7.Qd2": "Plan O-O-O and attack; White has a lot of space.",
        },
      },
    ],
  },
  {
    id: "italian-two-knights-ng5",
    title: "Italian: the aggressive 4.Ng5 vs the Two Knights",
    side: "white",
    level: "intermediate",
    eco: "C57-C59",
    summary:
      "If you'd rather attack f7 straight away: 4.Ng5 against 3...Nf6. Includes the Fried Liver and the main line with 5...Na5.",
    ideas: [
      "4.Ng5 + Bc4 doubles up on f7.",
      "After 5...Na5 White keeps the extra pawn but must handle Black's lead in development.",
    ],
    lines: [
      {
        name: "Main line 5...Na5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 6.Bb5+ c6 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4 10.Ne5",
        notes: {
          "4.Ng5": "Double attack on f7. Black has to give a pawn with ...d5.",
          "5...Na5": "Correct: hits the bishop rather than recapturing on d5.",
          "8.Be2": "White is a pawn up but Black gets fast development in return.",
        },
      },
      {
        name: "Fried Liver: 5...Nxd5?!",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7 Kxf7 7.Qf3+ Ke6 8.Nc3",
        notes: {
          "5...Nxd5": "Natural but risky. White can sacrifice on f7.",
          "6.Nxf7": "The Fried Liver sacrifice. The king is dragged into the centre.",
          "8.Nc3": "Piles up on the pinned d5 knight. Practically very strong at club level.",
        },
      },
      {
        name: "Traxler counter-attack 4...Bc5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bd5",
        notes: {
          "4...Bc5": "The Traxler: Black ignores f7 and counter-attacks f2.",
          "5.Bxf7+": "The safe practical choice. 5.Nxf7 leads to chaos after 5...Bxf2+.",
        },
      },
    ],
  },
  {
    id: "london-system",
    title: "London System",
    side: "white",
    level: "beginner",
    eco: "D02, A46-A48",
    summary:
      "One setup against almost everything: d4, Bf4, e3, Nf3, c3, Nbd2, Bd3. Low theory, solid, and easy to remember. The 2.Bf4 move order (before Nf3) is the modern choice.",
    ideas: [
      "Develop the dark-squared bishop to f4 BEFORE playing e3.",
      "The pawn triangle c3-d4-e3 is very hard to break.",
      "Keep h3 ready so the f4 bishop can retreat to h2 if Black plays ...Nh5.",
      "Typical attack: Ne5, f4 and a kingside pawn storm, or Qc2 + Bd3 aiming at h7.",
    ],
    lines: [
      {
        name: "vs ...d5, ...Nf6, ...e6, ...c5 (main structure)",
        moves: "1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O 8.Bd3",
        notes: {
          "2.Bf4": "Bishop out first, before e3 locks it in.",
          "5.c3": "Completes the pyramid c3-d4-e3.",
          "7.Bg3": "Don't allow ...Bxf4 exf4 on your terms. Keep the bishop.",
          "8.Bd3": "Eyes h7. Castle next, then Ne5 or e4.",
        },
      },
      {
        name: "vs early ...c5 and ...Qb6",
        moves: "1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Qb6 5.Qb3 c4 6.Qc2 Bf5 7.Qc1",
        notes: {
          "4...Qb6": "Black eyes b2, the London's standard weak point.",
          "5.Qb3": "Offer the queen trade. Black usually gains space with ...c4.",
          "7.Qc1": "Unusual but standard: the queen still covers b2 and White plays Nd2 and e4 next.",
        },
      },
      {
        name: "Trap: ...Qb6 grabbing b2",
        moves: "1.d4 d5 2.Bf4 c5 3.e3 Qb6 4.Nc3 Qxb2 5.Nb5",
        notes: {
          "4.Nc3": "A gambit. The b-pawn is poisoned.",
          "5.Nb5": "Threatens Nc7+ forking king and rook, and Rb1 trapping the queen.",
        },
      },
      {
        name: "vs King's Indian setup",
        moves: "1.d4 Nf6 2.Bf4 g6 3.e3 Bg7 4.Nf3 O-O 5.Be2 d6 6.h3 c5 7.c3",
        notes: {
          "5.Be2": "Against a ...g6 setup the bishop is better on e2: d3 would just be hit by ...e5-e4.",
          "6.h3": "Gives the f4 bishop the h2 retreat when Black plays ...Nh5.",
        },
      },
      {
        name: "vs ...b6 and ...Bb7",
        moves: "1.d4 Nf6 2.Bf4 e6 3.e3 b6 4.Nf3 Bb7 5.h3 Be7 6.Bd3 O-O 7.O-O c5 8.c3",
        notes: {
          "5.h3": "Prevents ...Nh5 and gives the bishop a home on h2.",
        },
      },
      {
        name: "vs mirrored ...Bf5",
        moves: "1.d4 d5 2.Bf4 Bf5 3.e3 e6 4.c4 Nf6 5.Nc3",
        notes: {
          "4.c4": "When Black copies with ...Bf5, c4 and Qb3 target b7, which Black's bishop no longer protects.",
        },
      },
    ],
  },
  {
    id: "queens-gambit",
    title: "Queen's Gambit",
    side: "white",
    level: "intermediate",
    eco: "D06-D69",
    summary:
      "The classical 1.d4 2.c4. White offers a wing pawn to win the centre. Covers the QGD Exchange (Carlsbad), the QGA, the Slav, and the gambits Black can throw back.",
    ideas: [
      "In the Exchange QGD White's main plan is the minority attack: b4-b5 to give Black a weak c-pawn.",
      "In the QGA White gets the pawn back easily. Don't try to keep b- and c-pawns.",
      "Against the Slav, a4 stops ...b5 from holding on to c4.",
    ],
    lines: [
      {
        name: "QGD Exchange (Carlsbad structure)",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 Be7 6.e3 O-O 7.Bd3 Nbd7 8.Qc2 c6 9.Nf3 Re8 10.O-O Nf8",
        notes: {
          "4.cxd5": "Fixes the pawn structure. White knows the plan: the minority attack.",
          "8.Qc2": "Stops ...Ne4 and ...Bf5. Rooks to b1 and c1 next, then b4-b5.",
        },
      },
      {
        name: "Queen's Gambit Accepted",
        moves: "1.d4 d5 2.c4 dxc4 3.Nf3 Nf6 4.e3 e6 5.Bxc4 c5 6.O-O a6 7.Bb3 Nc6 8.Qe2",
        notes: {
          "3.Nf3": "Stops ...e5 and develops. Win the pawn back with e3 and Bxc4.",
          "8.Qe2": "Prepares Rd1 and d4-d5, using White's lead in development.",
        },
      },
      {
        name: "Slav Defence main line",
        moves: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2",
        notes: {
          "5.a4": "Prevents ...b5, which would hold the c4 pawn.",
          "9.Qe2": "Prepares e4 to grab the centre.",
        },
      },
      {
        name: "Albin Countergambit",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.g3",
        notes: {
          "4.Nf3": "Correct. 4.e3? walks into the famous Lasker Trap.",
          "5.g3": "Fianchetto and give back the pawn at the right moment. White's position is better.",
        },
      },
      {
        name: "Chigorin Defence",
        moves: "1.d4 d5 2.c4 Nc6 3.Nf3 Bg4 4.cxd5 Bxf3 5.gxf3 Qxd5 6.e3",
        notes: {
          "5.gxf3": "The bishop pair and a strong centre make up for the broken pawns.",
        },
      },
      {
        name: "Trap to avoid: the Elephant Trap",
        kind: "warning",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8",
        notes: {
          "6.Nxd5": "A mistake. The d5 pawn looks loose, but the f6 knight is NOT really pinned.",
          "6...Nxd5": "Black gives the queen...",
          "7...Bb4+": "...and gets it back with a check, coming out a piece up.",
        },
      },
    ],
  },
  {
    id: "ruy-lopez",
    title: "Ruy Lopez (Spanish)",
    side: "white",
    level: "advanced",
    eco: "C60-C99",
    summary:
      "The most respected answer to 1...e5. White pressures the e5 pawn through its defender on c6. Covers the Closed main line, the Marshall, the Open, the Berlin (avoided with 4.d3), and Black's sidelines.",
    ideas: [
      "3.Bb5 doesn't threaten e5 yet: 4.Bxc6 dxc6 5.Nxe5 Qd4 gets the pawn back. It's long-term pressure.",
      "The classic setup: O-O, Re1, c3, h3, d4 and the knight route Nbd2-f1-g3.",
      "The Ba4-b3-c2 bishop can come back to aim at Black's king.",
    ],
    lines: [
      {
        name: "Closed Ruy: Chigorin",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Na5 10.Bc2 c5 11.d4 Qc7 12.Nbd2",
        notes: {
          "3.Bb5": "Attacks e5's defender.",
          "6.Re1": "Now e4 is protected, so Bxc6 followed by Nxe5 is a real threat.",
          "9.h3": "Stops ...Bg4 pinning the f3 knight before d4.",
          "12.Nbd2": "Heading for f1 and g3. A classic manoeuvring battle follows.",
        },
      },
      {
        name: "Marshall Attack (if you choose 8.c3)",
        kind: "alternative",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5 9.exd5 Nxd5 10.Nxe5 Nxe5 11.Rxe5 c6 12.d4 Bd6 13.Re1 Qh4 14.g3 Qh3",
        notes: {
          "8...d5": "Frank Marshall's famous gambit: a pawn for a dangerous kingside attack.",
          "14.g3": "Forced. White must defend accurately for a while.",
        },
      },
      {
        name: "Anti-Marshall 8.a4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.a4 Bb7 9.d3 d6",
        notes: {
          "8.a4": "Avoids the Marshall and puts pressure on b5. Good for club players who don't want to learn the Marshall.",
        },
      },
      {
        name: "Open Ruy 5...Nxe4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6 9.c3",
        notes: {
          "5...Nxe4": "Black grabs the pawn and gets active. White gets it back by opening the centre.",
        },
      },
      {
        name: "Berlin avoided with 4.d3",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 Bc5 5.c3 O-O 6.O-O d6 7.h3",
        notes: {
          "4.d3": "Skips the drawish Berlin endgame (4.O-O Nxe4) and keeps a game with pieces on.",
        },
      },
      {
        name: "Steinitz Deferred",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 d6 5.c3 Bd7 6.d4",
        notes: {
          "5.c3": "Gives the a4 bishop a retreat (c2) and prepares d4.",
        },
      },
      {
        name: "Classical / Cordel 3...Bc5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Bc5 4.c3 Nf6 5.O-O O-O 6.d4 Bb6",
        notes: {
          "4.c3": "Prepares d4 with tempo on the c5 bishop.",
        },
      },
      {
        name: "Bird Defence 3...Nd4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nd4 4.Nxd4 exd4 5.O-O c6 6.Ba4 Nf6 7.Re1",
        notes: {
          "4.Nxd4": "Trade off the active knight. Black's doubled d-pawn ends up a target.",
        },
      },
      {
        name: "Trap to avoid: Noah's Ark",
        kind: "warning",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 d6 5.d4 b5 6.Bb3 Nxd4 7.Nxd4 exd4 8.Qxd4 c5 9.Qd5 Be6 10.Qc6+ Bd7 11.Qd5 c4",
        notes: {
          "8.Qxd4": "A mistake! The a-, b- and c-pawns trap the b3 bishop.",
          "11...c4": "The bishop is trapped. That's why the Steinitz Deferred line above uses 5.c3 instead.",
        },
      },
    ],
  },
  {
    id: "scotch-game",
    title: "Scotch Game",
    side: "white",
    level: "intermediate",
    eco: "C44-C45",
    summary:
      "Open the centre at once with 3.d4. More forcing than the Ruy, with less theory to memorise. A Kasparov favourite.",
    ideas: [
      "After 4.Nxd4 White has a free hand in the centre and quick development.",
      "Against ...Nf6 lines, e5 kicks the knight and gains space.",
    ],
    lines: [
      {
        name: "Classical 4...Bc5 5.Nxc6",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Nxc6 Qf6 6.Qd2 dxc6 7.Nc3",
        notes: {
          "5...Qf6": "Threatens mate on f2. 6.Qd2 covers it and keeps the c3 square for the knight.",
        },
      },
      {
        name: "Classical 4...Bc5 5.Be3",
        kind: "alternative",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4",
        notes: {
          "6.c3": "Protects the d4 knight a second time.",
        },
      },
      {
        name: "Mieses 4...Nf6",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6",
        notes: {
          "6.e5": "Kick the knight. It has to go to d5, where c4 chases it again.",
          "7.Qe2": "Pins the e-file so the e5 pawn holds.",
        },
      },
      {
        name: "Steinitz 4...Qh4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Qh4 5.Nc3 Bb4 6.Be2",
        notes: {
          "5.Nc3": "Gives back e4 for rapid development. Don't defend the pawn passively.",
        },
      },
    ],
  },
  {
    id: "e4-vs-everything-else",
    title: "1.e4 vs Sicilian, Caro-Kann, French & more",
    side: "white",
    level: "intermediate",
    eco: "B01-B90, C02",
    summary:
      "Completes a 1.e4 repertoire with low-theory, plan-based systems: the Alapin vs the Sicilian, Advance lines vs the Caro-Kann and French, and simple answers to the Scandinavian, Pirc and Alekhine.",
    ideas: [
      "Alapin (2.c3) builds a classical d4 centre without the Open Sicilian's mountains of theory.",
      "The Advance (e5) systems gain space and give clear plans: c3, Nf3, Be2/Bd3.",
    ],
    lines: [
      {
        name: "Alapin vs 2...Nf6",
        moves: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6 7.Bc4 Nb6 8.Bb5",
        notes: {
          "2.c3": "Prepares d4 so a pawn can recapture: c3xd4 builds a big centre.",
          "7.Bc4": "Gains a tempo on the d5 knight.",
        },
      },
      {
        name: "Alapin vs 2...d5",
        moves: "1.e4 c5 2.c3 d5 3.exd5 Qxd5 4.d4 Nf6 5.Nf3 Bg4 6.Be2 e6 7.h3 Bh5 8.O-O Nc6",
        notes: {
          "3...Qxd5": "c3 has taken the c3 square from White's knight, so the queen can't easily be chased.",
          "7.h3": "Puts the question to the bishop before castling.",
        },
      },
      {
        name: "Alapin vs 2...e6",
        moves: "1.e4 c5 2.c3 e6 3.d4 d5 4.exd5 exd5 5.Nf3 Nc6 6.Bb5 Bd6",
        notes: {
          "4.exd5": "An isolated queen's pawn structure (IQP) usually follows.",
        },
      },
      {
        name: "Caro-Kann Advance (Short System)",
        moves: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 c5 6.Be3",
        notes: {
          "3.e5": "Gains space. Black's light-squared bishop is out, but White plays calmly.",
          "6.Be3": "Supports d4 and holds the centre.",
        },
      },
      {
        name: "French Advance",
        moves: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2",
        notes: {
          "4.c3": "The base of White's pawn chain. Black will attack d4.",
          "6.a3": "Prepares b4 to gain queenside space.",
        },
      },
      {
        name: "Scandinavian 2...Qxd5",
        moves: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2",
        notes: {
          "3.Nc3": "Develop with tempo on the queen.",
          "7.Bd2": "The discovered threat Nd5 is in the air now.",
        },
      },
      {
        name: "Scandinavian 2...Nf6",
        moves: "1.e4 d5 2.exd5 Nf6 3.d4 Nxd5 4.Nf3 g6 5.c4 Nb6 6.Nc3 Bg7",
        notes: {
          "5.c4": "Takes the centre with tempo.",
        },
      },
      {
        name: "Pirc: 150 Attack",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2",
        notes: {
          "5.Qd2": "Plan: Bh6 to trade the g7 bishop, O-O-O, then h4-h5.",
        },
      },
      {
        name: "Alekhine: Modern Variation",
        moves: "1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 Bg4 5.Be2 e6 6.O-O Be7 7.c4 Nb6",
        notes: {
          "4.Nf3": "Calm and strong. Keep a space advantage without overextending.",
        },
      },
    ],
  },

  // ───────────────────────────── BLACK ─────────────────────────────
  {
    id: "caro-kann",
    title: "Caro-Kann Defence",
    side: "black",
    level: "beginner",
    eco: "B10-B19",
    summary:
      "Solid and reliable. Black supports ...d5 with ...c6 so the light-squared bishop can develop outside the pawn chain (unlike the French). Covers the Classical, Advance, Exchange, Panov, Two Knights and Fantasy.",
    ideas: [
      "Get the c8 bishop to f5 or g4 BEFORE playing ...e6.",
      "In the Advance, strike at White's centre with ...c5 and ...Ne7-c6 or -f5.",
      "Typical endgames favour Black's healthy structure.",
    ],
    lines: [
      {
        name: "Classical 4...Bf5",
        moves: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6 11.Bd2 Ngf6 12.O-O-O Be7",
        notes: {
          "4...Bf5": "The point of the Caro-Kann: the bishop develops actively.",
          "6...h6": "Gives the bishop an escape on h7 when h5 comes.",
          "9...Bxd3": "Trade off White's best attacking bishop.",
        },
      },
      {
        name: "Advance: 4.Nf3 (Short System)",
        moves: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 c5 6.Be3 cxd4 7.Nxd4 Ne7",
        notes: {
          "3...Bf5": "Bishop out before ...e6.",
          "5...c5": "Typical break against White's pawn chain.",
          "7...Ne7": "Heading for c6 or f5, hitting d4.",
        },
      },
      {
        name: "Advance: 4.h4",
        moves: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.h4 h5 5.c4 e6 6.Nc3",
        notes: {
          "4...h5": "Stops g4 trapping the bishop. g5 becomes an outpost for White, but h4 is weak too.",
        },
      },
      {
        name: "Exchange Variation",
        moves: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Qd7 8.Nd2 e6",
        notes: {
          "6...Bg4": "Develop the bishop actively before ...e6.",
          "7...Qd7": "Calmly protects b7. Black plans a queenside minority attack with ...b5-b4.",
        },
      },
      {
        name: "Panov-Botvinnik Attack",
        moves: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2 Nc6",
        notes: {
          "4.c4": "White accepts an isolated queen's pawn for activity.",
          "6...Bb4": "Pins the knight and fights for d5, the square in front of the IQP.",
        },
      },
      {
        name: "Two Knights",
        moves: "1.e4 c6 2.Nf3 d5 3.Nc3 Bg4 4.h3 Bxf3 5.Qxf3 e6 6.d3 Nf6 7.Bd2 Nbd7",
        notes: {
          "4...Bxf3": "Giving up the bishop pair is fine: White's queen is awkward on f3 and Black's structure is rock solid.",
        },
      },
      {
        name: "Fantasy Variation",
        moves: "1.e4 c6 2.d4 d5 3.f3 dxe4 4.fxe4 e5 5.Nf3",
        notes: {
          "4...e5": "Hits the centre right away while White's king is a bit exposed.",
        },
      },
      {
        name: "Trap to avoid: smothered mate",
        kind: "warning",
        moves: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Qe2 Ngf6 6.Nd6#",
        notes: {
          "5...Ngf6": "Blunder! The e-pawn is pinned to the king (Qe2), so d6 is unguarded.",
          "6.Nd6#": "Smothered mate. In the 4...Nd7 line play ...Bf5 and ...e6 first, or simply use the Classical.",
        },
      },
    ],
  },
  {
    id: "black-vs-e4-e5",
    title: "1...e5 for Black (Open Games)",
    side: "black",
    level: "beginner",
    eco: "C20-C99",
    summary:
      "A complete, classical answer to 1.e4 with 1...e5. Uses 3...Bc5 against the Italian (avoids 4.Ng5 and the Fried Liver), the Berlin against the Ruy Lopez, and principled answers to the Scotch, Vienna, King's Gambit and other tries.",
    ideas: [
      "Fight for the centre with pieces: ...Nc6, ...Nf6, ...Bc5.",
      "The ...d5 break frees the position in many lines.",
      "Know the early traps: Scholar's Mate, Fried Liver, King's Gambit queen check.",
    ],
    lines: [
      {
        name: "Italian: Giuoco Piano 5.d4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.e5 d5 7.Bb5 Ne4 8.cxd4 Bb6",
        notes: {
          "3...Bc5": "Mirrors White's bishop and avoids 4.Ng5 lines.",
          "6...d5": "The key counter-strike. Black hits the c4 bishop.",
          "7...Ne4": "A great outpost for the knight.",
        },
      },
      {
        name: "Italian: Giuoco Pianissimo",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Re1 a6 8.Bb3 Ba7 9.h3 h6",
        notes: {
          "7...a6": "Gives the bishop a safe home on a7.",
          "9...h6": "Mirrors White: no pins on g5.",
        },
      },
      {
        name: "Evans Gambit declined",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bb6 5.a4 a6 6.Nc3 Nf6",
        notes: {
          "4...Bb6": "Turn down the gambit. Black stays solid.",
          "5...a6": "Gives the bishop a retreat so a5 doesn't trap it.",
        },
      },
      {
        name: "Ruy Lopez: Berlin endgame",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8 9.Nc3 Ke8",
        notes: {
          "3...Nf6": "The Berlin Wall. Kramnik used it to beat Kasparov in 2000.",
          "4...Nxe4": "Take the pawn. White wins it back, but queens come off.",
          "9...Ke8": "Black has the bishop pair and an excellent fortress. Long-term, the queenside majority matters.",
        },
      },
      {
        name: "Ruy Lopez: Berlin 5.Re1",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.Re1 Nd6 6.Nxe5 Be7 7.Bf1 Nxe5 8.Rxe5 O-O 9.d4 Bf6 10.Re1",
        notes: {
          "6...Be7": "Blocks the e-file and prepares to castle.",
        },
      },
      {
        name: "Ruy Lopez: Anti-Berlin 4.d3",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 Bc5 5.c3 O-O 6.O-O d6",
        notes: {
          "4...Bc5": "Active bishop. Black will play ...d6, ...Ne7-g6 or ...a6 and ...Ba7.",
        },
      },
      {
        name: "Scotch Game",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Nb6",
        notes: {
          "4...Nf6": "Attacks e4 straight away.",
          "6...Qe7": "Pins the e5 pawn against the queen.",
        },
      },
      {
        name: "Scotch Four Knights",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.d4 exd4 5.Nxd4 Bb4 6.Nxc6 bxc6 7.Bd3 d5 8.exd5 cxd5 9.O-O O-O 10.Bg5 c6",
        notes: {
          "5...Bb4": "Pins the knight and puts pressure on e4.",
          "10...c6": "Solid. Black has an easy game.",
        },
      },
      {
        name: "Vienna: 3.f4 d5",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 d5 4.fxe5 Nxe4 5.Nf3 Be7",
        notes: {
          "3...d5": "Counter in the centre. The standard antidote to an early f4.",
          "4...Nxe4": "The knight is superbly placed in the centre.",
        },
      },
      {
        name: "Vienna: 3.Bc4",
        moves: "1.e4 e5 2.Nc3 Nf6 3.Bc4 Bc5 4.d3 c6",
        notes: {
          "4...c6": "Prepares ...d5 to grab the centre.",
        },
      },
      {
        name: "King's Gambit accepted: modern 3...d5",
        moves: "1.e4 e5 2.f4 exf4 3.Nf3 d5 4.exd5 Nf6",
        notes: {
          "2...exf4": "Take it! Black hands back the pawn later for easy development.",
          "3...d5": "The modern antidote: open lines before White's attack builds.",
        },
      },
      {
        name: "Centre Game",
        moves: "1.e4 e5 2.d4 exd4 3.Qxd4 Nc6 4.Qe3 Nf6 5.Nc3 Bb4 6.Bd2 O-O 7.O-O-O Re8",
        notes: {
          "3...Nc6": "Develop with tempo on the early queen.",
          "7...Re8": "Pressure on e4. Black is comfortable.",
        },
      },
      {
        name: "Ponziani",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 Nxe4 5.d5 Ne7 6.Nxe5 Ng6",
        notes: {
          "3...Nf6": "c3 took the knight's natural square, so hit e4 right away.",
        },
      },
      {
        name: "Stopping Scholar's Mate",
        moves: "1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6 5.Ne2 Bg7 6.Nbc3 d6",
        notes: {
          "2...Nc6": "Protect e5 first.",
          "3...g6": "Blocks the queen's attack on f7, with tempo.",
          "4...Nf6": "Blocks the f-file. Black is ahead in development.",
        },
      },
    ],
  },
  {
    id: "sicilian-najdorf",
    title: "Sicilian Najdorf",
    side: "black",
    level: "advanced",
    eco: "B90-B99, B50-B52",
    summary:
      "The most fighting answer to 1.e4, played by Fischer and Kasparov. 5...a6 is a flexible move that controls b5 and prepares ...e5 or ...e6. Includes the main 6th-move systems and the anti-Sicilians Black must know.",
    ideas: [
      "...a6 stops Nb5 and Bb5 and prepares ...b5 queenside expansion.",
      "The ...e5 structure gives up d5 control in exchange for space and active pieces.",
      "Black's counterplay usually runs down the half-open c-file.",
    ],
    lines: [
      {
        name: "English Attack 6.Be3",
        moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O 10.O-O-O Nbd7 11.g4 b5",
        notes: {
          "5...a6": "The Najdorf move.",
          "6...e5": "Kicks the knight and grabs central space.",
          "11...b5": "A race! Both sides throw pawns at the enemy king.",
        },
      },
      {
        name: "6.Bg5 main line",
        moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7",
        notes: {
          "6...e6": "Breaks the pin threat. Black keeps a compact 'hedgehog-like' centre.",
        },
      },
      {
        name: "Positional 6.Be2",
        moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6",
        notes: {
          "6...e5": "Against quiet set-ups, take space.",
        },
      },
      {
        name: "Fischer-Sozin 6.Bc4",
        moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bc4 e6 7.Bb3 b5 8.O-O Be7 9.Qf3 Qc7",
        notes: {
          "6...e6": "Blunts the bishop on c4.",
          "7...b5": "Gains queenside space with tempo ideas (...b4).",
        },
      },
      {
        name: "Moscow 3.Bb5+",
        moves: "1.e4 c5 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Qxd7 5.O-O Nc6 6.c3 Nf6 7.Re1 e6 8.d4",
        notes: {
          "3...Bd7": "Simplest: trade the light-squared bishops.",
        },
      },
      {
        name: "Alapin 2.c3",
        moves: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6",
        notes: {
          "2...Nf6": "Attack e4 immediately, so White must decide.",
        },
      },
      {
        name: "Smith-Morra Gambit accepted",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 Nc6 5.Nf3 d6 6.Bc4 e6 7.O-O Nf6 8.Qe2 Be7 9.Rd1 e5",
        notes: {
          "3...dxc3": "Take the pawn. With careful play Black keeps it.",
          "9...e5": "Shuts the d-file before White's rook gets busy.",
        },
      },
      {
        name: "Grand Prix / Closed 2.Nc3",
        moves: "1.e4 c5 2.Nc3 Nc6 3.f4 g6 4.Nf3 Bg7 5.Bb5 Nd4",
        notes: {
          "5...Nd4": "Challenge the b5 bishop and take the central square.",
        },
      },
    ],
  },
  {
    id: "french-defence",
    title: "French Defence",
    side: "black",
    level: "intermediate",
    eco: "C00-C19",
    summary:
      "...e6 and ...d5 build a solid wall and counter-attack White's centre with ...c5 and ...f6. Uses the Rubinstein (...dxe4) against both 3.Nc3 and 3.Nd2 to keep the theory light.",
    ideas: [
      "The French has a problem bishop on c8. Play ...b6/...Ba6 or ...Bd7-e8-h5 to activate it, or trade it.",
      "Against e5 always hit the base of the chain with ...c5, then attack e5 with ...f6.",
    ],
    lines: [
      {
        name: "Advance Variation",
        moves: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2 Na5",
        notes: {
          "3...c5": "Hit the base of the pawn chain right away.",
          "5...Qb6": "Piles up on d4 and b2.",
          "7...Na5": "Heading for b3 and holding the c4 pawn.",
        },
      },
      {
        name: "Advance: Milner-Barry gambit",
        moves: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.Bd3 cxd4 7.cxd4 Bd7 8.O-O Nxd4 9.Nxd4 Qxd4 10.Nc3",
        notes: {
          "7...Bd7": "Careful! 7...Nxd4? 8.Nxd4 Qxd4?? 9.Bb5+ wins the queen.",
          "8...Nxd4": "Now it's safe to grab.",
        },
      },
      {
        name: "Exchange Variation",
        moves: "1.e4 e6 2.d4 d5 3.exd5 exd5 4.Bd3 Bd6 5.Nf3 Ne7 6.O-O O-O 7.Re1 Bg4",
        notes: {
          "3...exd5": "Symmetrical, but the c8 bishop is now free, so the French's main problem is gone.",
        },
      },
      {
        name: "Rubinstein vs 3.Nc3",
        moves: "1.e4 e6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Nf3 Ngf6 6.Nxf6+ Nxf6 7.Bg5 h6 8.Bh4 c5",
        notes: {
          "3...dxe4": "Give up the centre for solid, simple development.",
          "8...c5": "The key freeing break.",
        },
      },
      {
        name: "Rubinstein vs 3.Nd2 (Tarrasch)",
        moves: "1.e4 e6 2.d4 d5 3.Nd2 dxe4 4.Nxe4 Nd7 5.Nf3 Ngf6 6.Nxf6+ Nxf6 7.Bd3 c5",
        notes: {
          "3...dxe4": "One system against both 3.Nc3 and 3.Nd2 means less to learn.",
        },
      },
      {
        name: "King's Indian Attack",
        moves: "1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nc6 5.g3 Nf6 6.Bg2 Be7 7.O-O O-O",
        notes: {
          "3...c5": "Grab queenside space. Black's attack comes on that wing.",
        },
      },
    ],
  },
  {
    id: "scandinavian",
    title: "Scandinavian Defence",
    side: "black",
    level: "beginner",
    eco: "B01",
    summary:
      "1...d5 forces the play from move one. White's choices are limited, so it's very low theory. Black gets a Caro-Kann-like structure with ...c6, ...Bf5 and ...e6.",
    ideas: [
      "After 3.Nc3 the queen goes to a5 (or d6), out of the way of tempo-gaining moves.",
      "Develop the light bishop outside before ...e6 (same as the Caro-Kann).",
    ],
    lines: [
      {
        name: "Main line 3...Qa5",
        moves: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6",
        notes: {
          "3...Qa5": "Pins the c3 knight and stays active.",
          "5...c6": "Gives the queen a retreat to c7 and covers b5/d5.",
        },
      },
      {
        name: "3.Nf3",
        moves: "1.e4 d5 2.exd5 Qxd5 3.Nf3 Nf6 4.d4 Bg4 5.Be2 e6 6.O-O Nc6",
        notes: {
          "4...Bg4": "Pins the knight and develops.",
        },
      },
      {
        name: "3.d4",
        moves: "1.e4 d5 2.exd5 Qxd5 3.d4 Nf6 4.Nf3 Bg4 5.Be2 e6 6.O-O Nc6",
        notes: {
          "3...Nf6": "Develop. Don't let White's queen gain more tempi.",
        },
      },
      {
        name: "Advance 2.e5",
        moves: "1.e4 d5 2.e5 Bf5 3.d4 e6 4.Nf3 c5",
        notes: {
          "2...Bf5": "A good French structure where the bishop is already outside the chain.",
        },
      },
      {
        name: "2.Nc3",
        moves: "1.e4 d5 2.Nc3 d4 3.Nce2 e5 4.Ng3 Be6",
        notes: {
          "2...d4": "Gains space and kicks the knight.",
        },
      },
    ],
  },
  {
    id: "queens-gambit-declined-black",
    title: "Queen's Gambit Declined (for Black)",
    side: "black",
    level: "intermediate",
    eco: "D30-D69, E00-E09",
    summary:
      "The classical, rock-solid answer to 1.d4. ...d5 and ...e6 with ...Nf6 and ...Be7, the Tartakower system against 5.Bg5, and setups against the Exchange, the Catalan and the London.",
    ideas: [
      "Freeing breaks: ...c5 and ...dxc4 followed by ...e5.",
      "The c8 bishop is the problem piece. The Tartakower (...b6/...Bb7) solves it.",
      "Against the Exchange (Carlsbad), meet the minority attack with ...Ne4, ...Bf5 or kingside play.",
    ],
    lines: [
      {
        name: "Exchange (Carlsbad)",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 c6 6.e3 Be7 7.Bd3 Nbd7 8.Qc2 O-O 9.Nf3 Re8 10.O-O Nf8",
        notes: {
          "5...c6": "Prepares ...Bf5 and covers d5 and b5.",
          "10...Nf8": "The knight heads to g6 or e6. A classic regrouping.",
        },
      },
      {
        name: "Tartakower vs 4.Bg5",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1 Be6",
        notes: {
          "6...h6": "Ask the bishop first. ...Nd5 trades become possible later.",
          "7...b6": "The Tartakower: the c8 bishop goes to b7 (or e6).",
        },
      },
      {
        name: "vs 5.Bf4",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 Be7 5.Bf4 O-O 6.e3 c5 7.dxc5 Bxc5",
        notes: {
          "6...c5": "The standard antidote to the Bf4 lines.",
        },
      },
      {
        name: "vs Catalan: open 6...dxc4",
        moves: "1.d4 d5 2.Nf3 Nf6 3.c4 e6 4.g3 Be7 5.Bg2 O-O 6.O-O dxc4 7.Qc2 a6 8.Qxc4 b5 9.Qc2 Bb7",
        notes: {
          "6...dxc4": "Take the pawn and use the time to play ...a6, ...b5 and ...Bb7.",
          "9...Bb7": "Black's bishop now fights the g2 bishop for the long diagonal.",
        },
      },
      {
        name: "vs London System",
        moves: "1.d4 d5 2.Bf4 Nf6 3.e3 c5 4.c3 Nc6 5.Nd2 e6 6.Ngf3 Bd6 7.Bg3 O-O 8.Bd3 b6",
        notes: {
          "3...c5": "The most testing reply. Hit d4 right away.",
          "6...Bd6": "Challenge the London bishop.",
        },
      },
      {
        name: "Lasker Trap (Albin, for reference)",
        kind: "warning",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+",
        notes: {
          "6.Bxb4": "A blunder. White should play 6.fxe3.",
          "7...fxg1=N+": "Underpromotion with check! Black wins material. A great trap to know if you ever play the Albin.",
        },
      },
    ],
  },
  {
    id: "kings-indian",
    title: "King's Indian Defence",
    side: "black",
    level: "advanced",
    eco: "E60-E99",
    summary:
      "A hypermodern counter-attacking defence. Black lets White build a big centre, then hits it with ...e5 (or ...c5) and often launches a kingside pawn storm with ...f5-f4-g5.",
    ideas: [
      "The g7 bishop is Black's best piece. Don't trade it lightly.",
      "When White closes the centre with d5, Black attacks on the kingside (...f5) and White on the queenside (c5).",
    ],
    lines: [
      {
        name: "Classical: Mar del Plata 9.Ne1",
        moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.Nd3 f5 11.Bd2 Nf6 12.f3 f4",
        notes: {
          "6...e5": "The King's Indian break.",
          "8...Ne7": "The knight heads to the kingside to back up ...f5.",
          "12...f4": "Locks the kingside. Next comes ...g5-g4.",
        },
      },
      {
        name: "Classical: Bayonet 9.b4",
        moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.b4 Nh5 10.Re1 f5",
        notes: {
          "9...Nh5": "Clears the way for ...f5 straight away.",
        },
      },
      {
        name: "Sämisch Gambit",
        moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 c5 7.dxc5 dxc5 8.Qxd8 Rxd8 9.Bxc5 Nc6",
        notes: {
          "6...c5": "A pawn sacrifice. The g7 bishop and Black's lead in development give full compensation.",
        },
      },
      {
        name: "Four Pawns Attack",
        moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f4 O-O 6.Nf3 c5 7.d5 e6 8.Be2 exd5 9.cxd5 Re8",
        notes: {
          "6...c5": "Hit the over-extended centre at once.",
          "9...Re8": "Pressure on e4. White's centre is a target.",
        },
      },
      {
        name: "Fianchetto Variation",
        moves: "1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.g3 O-O 5.Bg2 d6 6.O-O Nbd7 7.Nc3 e5 8.e4 c6 9.h3 Qb6",
        notes: {
          "9...Qb6": "Hits d4 and b2.",
        },
      },
      {
        name: "Averbakh 6.Bg5",
        moves: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Be2 O-O 6.Bg5 c5 7.d5 e6",
        notes: {
          "6...c5": "Against the Averbakh, ...c5 is better than ...e5.",
        },
      },
    ],
  },
  {
    id: "opening-traps",
    title: "Opening Traps Every Player Should Know",
    side: "both",
    level: "beginner",
    eco: "various",
    summary:
      "Short, memorable traps. Learn them to spring them, and more importantly, to avoid falling into them. Good for daily 'puzzle-style' reps.",
    ideas: ["Most traps punish greed (taking a poisoned pawn) or neglect (ignoring f7/f2)."],
    lines: [
      {
        name: "Scholar's Mate",
        moves: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7#",
        notes: {
          "3...Nf6": "Blunder. 3...g6 or 3...Qe7 defends.",
          "4.Qxf7#": "f7 is only defended by the king.",
        },
      },
      {
        name: "Fool's Mate",
        moves: "1.f3 e5 2.g4 Qh4#",
        notes: { "2...Qh4#": "The fastest possible checkmate: two weakening pawn moves open the e1-h4 diagonal." },
      },
      {
        name: "Légal's Mate",
        moves: "1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#",
        notes: {
          "5.Nxe5": "Gives the queen. The g4 'pin' isn't real.",
          "5...Bxd1": "Greed. 5...dxe5 loses only a pawn.",
          "7.Nd5#": "Three minor pieces deliver mate.",
        },
      },
      {
        name: "Blackburne Shilling Gambit",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#",
        notes: {
          "4.Nxe5": "Greedy. 4.Nxd4 or 4.O-O is better.",
          "7...Nf3#": "Smothered mate.",
        },
      },
      {
        name: "King's Gambit: 3.fxe5?? Qh4+",
        moves: "1.e4 e5 2.f4 Bc5 3.fxe5 Qh4+ 4.g3 Qxe4+",
        notes: {
          "3.fxe5": "Blunder. The diagonal to the king opens.",
          "4...Qxe4+": "Forks king and h1 rook.",
        },
      },
      {
        name: "Englund Gambit Trap",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1#",
        notes: {
          "6.Bc3": "Natural but loses. 6.Nc3 is correct.",
          "8...Qc1#": "Nothing can take the queen: the c2 pawn blocks Qxc1 and the b1 knight blocks Rxc1.",
        },
      },
      {
        name: "Budapest: Kieninger Trap",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Nf3 Nc6 5.Bf4 Bb4+ 6.Nbd2 Qe7 7.a3 Ngxe5 8.axb4 Nd3#",
        notes: {
          "8.axb4": "Greedy. 8.Nxe5 is correct.",
          "8...Nd3#": "Smothered: the d2 knight blocks the king's escape.",
        },
      },
      {
        name: "Caro-Kann smothered mate",
        moves: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Qe2 Ngf6 6.Nd6#",
        notes: { "6.Nd6#": "The e7 pawn is pinned by the queen on e2." },
      },
      {
        name: "Elephant Trap",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8",
        notes: { "9...Kxd8": "Black is a piece up." },
      },
      {
        name: "Lasker Trap",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+",
        notes: { "7...fxg1=N+": "A rare underpromotion that wins material." },
      },
      {
        name: "Noah's Ark Trap",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 d6 5.d4 b5 6.Bb3 Nxd4 7.Nxd4 exd4 8.Qxd4 c5 9.Qd5 Be6 10.Qc6+ Bd7 11.Qd5 c4",
        notes: { "11...c4": "The b3 bishop is trapped by Black's pawns." },
      },
      {
        name: "Fried Liver Attack",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7 Kxf7 7.Qf3+ Ke6 8.Nc3",
        notes: { "6.Nxf7": "A knight sacrifice to drag the king out." },
      },
      {
        name: "French: Milner-Barry queen trap",
        moves: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.Bd3 cxd4 7.cxd4 Nxd4 8.Nxd4 Qxd4 9.Bb5+",
        notes: { "9.Bb5+": "Discovered attack: Qxd4 next. Black loses the queen." },
      },
    ],
  },
];
