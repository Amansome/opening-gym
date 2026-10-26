// Seed opening courses for a free Chessreps-style trainer.
// Each line is a SAN move list. Notes are keyed by move label ("5.c3" for White, "5...d6" for Black)
// and become the "Learn mode" blurbs. scripts/validate.js checks every move is legal, every note
// label exists, and that each course gives exactly one answer per position for the side it trains.
// Line kinds: "main" (default, the repertoire), "alternative" (a second option you may choose instead),
// "warning" (shows a mistake to avoid). Only main lines are held to the one-answer rule.
// Every course also has a `style` (Classical, Gambit, Attack, Trap-heavy, Solid, System or Counterattack) and an
// `article` (see CourseArticle in web/src/lib/types.ts). The first line of a course is a short "quick win" where the
// opponent makes a typical mistake, wherever a natural one exists. The article PGNs are checked by scripts/validate.js.

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
    style: "Classical",
    article: {
      whatIs:
        "The Italian Game begins 1.e4 e5 2.Nf3 Nc6 3.Bc4. White develops quickly, aims the bishop at f7 and gets ready to castle. This course teaches the calm version, the Giuoco Pianissimo (\"very quiet game\"), where White builds with c3 and d3 first and only then decides where to strike. It is a good way to learn how a classical opening works.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6 3.Bc4. If Black copies with 3...Bc5, continue 4.c3 Nf6 5.d3 for the Giuoco Pianissimo. After 3...Nf6 (the Two Knights Defence) the calm 4.d3 leads to the same kind of position.",
      pros: [
        "Very little forced theory: c3, d3, O-O, Re1 and Nbd2-f1 work against most Black set-ups.",
        "Natural development: bishop to c4, knight to f3, castle early.",
        "Flexible plans: you can later play d4, attack on the kingside with Nbd2-f1-g3, or gain space with a4 and h3.",
        "Used by strong players as a low-risk way to keep the tension and out-manoeuvre the opponent.",
        "You avoid the sharpest lines (Evans Gambit, Fried Liver) unless you decide to learn them.",
      ],
      cons: [
        "Black has solid ways to equalise, so White's edge is small and you have to win a long middlegame.",
        "The slow build-up can feel aimless if you don't know the plans (the d4 break and the knight reroute).",
        "Black can trade off the strong c4 bishop or free the position with ...d5.",
        "It rarely gives a quick attack, so it suits patient players better than fans of fast tactics.",
      ],
      variations: [
        {
          name: "Giuoco Pianissimo",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O a6 7.a4",
          text:
            "The core of the course. White keeps the centre solid and stops ...b5 with a4. Typical next steps are Re1, h3 and Nbd2-f1, followed by d4 or a kingside attack.",
        },
        {
          name: "Black breaks with ...d5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 O-O 6.O-O d5 7.exd5 Nxd5 8.Re1",
          text:
            "Black frees the position at once. After the exchange on d5, Re1 puts pressure on e5 and keeps the game balanced but playable for White.",
        },
        {
          name: "Two Knights Defence with 4.d3",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Be7 5.O-O O-O 6.Re1 d6 7.c3",
          text:
            "Playing 4.d3 instead of 4.Ng5 avoids the sharp theory and heads for a Pianissimo-style structure.",
        },
        {
          name: "Hungarian Defence",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Be7 4.d4 d6 5.d5 Nb8 6.Bd3",
          text:
            "A passive reply. White grabs space with d4-d5, pushes the knight back and keeps a comfortable edge.",
        },
      ],
      againstIt:
        "The most reliable way for Black to meet the slow Italian is to castle and play ...d5 at the right moment, trading pieces and reaching equality. Others chase the c4 bishop with ...Na5 or ...b5, or aim for ...Bg4 and ...Nd4 ideas. As White, don't drift: keep your pieces coordinated and strike with d4 when it is ready.",
      plans: {
        white:
          "Develop, castle, play c3 and d3, put the rook on e1 and meet ...a6 with Bb3 or a4. Then pick a plan: break with d4, reroute Nbd2-f1-g3 for a kingside attack, or expand with a4 and h3. There is no hurry because the structure is solid.",
        black:
          "Mirror the set-up with ...Bc5, ...d6 and ...O-O, tuck the bishop away on a7 when needed, and prepare the freeing ...d5. ...Re8, ...Nf8-g6 and ...Be6 are typical regrouping ideas.",
      },
      history:
        "The Italian Game is one of the oldest recorded openings. Players of the 16th and 17th centuries, including Gioachino Greco, analysed Bc4 ideas, and the names Giuoco Piano (\"quiet game\") and Giuoco Pianissimo (\"very quiet game\") come from Italian. After a long spell in which sharper gambits and the Ruy Lopez were more fashionable, the slow Italian has made a strong comeback at all levels, including top-level play.",
      faq: [
        {
          q: "Is the Italian Game good for beginners?",
          a:
            "Yes. The ideas are easy to understand (develop, castle, fight for the centre) and the slow c3/d3 set-up needs far less memorisation than the Ruy Lopez or the Sicilian. It teaches good habits.",
        },
        {
          q: "What is the best response to the Italian Game?",
          a:
            "Solid answers are 3...Bc5 (Giuoco Piano) followed by ...Nf6, ...d6 and ...O-O, or 3...Nf6 (Two Knights). Black usually aims for the freeing move ...d5 once the king is safe.",
        },
        {
          q: "What is the difference between the Giuoco Piano and the Giuoco Pianissimo?",
          a:
            "Giuoco Piano is the whole opening 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5. The Pianissimo is the quiet way White continues it: c3, d3, O-O, Re1 and slow manoeuvring instead of an early d4.",
        },
        {
          q: "Is the Italian Game still played by grandmasters?",
          a:
            "Yes. The slow Italian is a regular choice at the highest level because it keeps lots of play on the board with little risk.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: Black grabs e4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Nxe4 5.dxe4",
        notes: {
          "4...Nxe4": "A common beginner's error: the e4 pawn is defended by the d3 pawn, so taking it just gives away a piece.",
          "5.dxe4": "White wins a knight for a pawn. Recapture with the pawn to keep a solid centre.",
        },
      },
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
          "3.Nxe5": "Take the pawn. Black should now kick the knight with 3...d6; the greedy 3...Nxe4? loses to 4.Qe2.",
          "4.Nf3": "The knight retreats. Black can now take on e4 safely, and the game is a symmetrical Petrov.",
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
    style: "Attack",
    article: {
      whatIs:
        "After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6, the move 4.Ng5 attacks f7 a second time and forces Black to react immediately. The best reply is 4...d5 5.exd5, after which Black either calmly gives the pawn back with 5...Na5 or walks into the Fried Liver Attack with 5...Nxd5?!. It is a sharp, tactical way to meet the Two Knights Defence.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5. Black's main reply is 4...d5, and you capture 5.exd5.",
      pros: [
        "Instant pressure: Black has to find accurate moves from move four.",
        "Natural-looking replies such as 5...Nxd5?! can lead to a very dangerous attack for White.",
        "The tactics are easy to remember, which makes it very effective at club level.",
        "It teaches typical attacking themes: a double attack on f7, a king dragged into the centre, a pinned knight on d5.",
        "In the main line 5...Na5 White wins a pawn that Black has to fight to regain.",
      ],
      cons: [
        "After 5...Na5 Black gets fast development in return for the pawn, and White must play carefully to keep the extra pawn.",
        "Black can avoid it entirely with 3...Bc5 (Giuoco Piano), so you also need a second plan like the slow Italian course.",
        "The main line needs accurate follow-ups (Bb5+, Be2, answering ...e4 with Ne5).",
        "Well-prepared opponents can equalise, and the Traxler 4...Bc5 leads to wild play.",
      ],
      variations: [
        {
          name: "Main line with 5...Na5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 6.Bb5+ c6 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4 10.Ne5",
          text:
            "Black's best and most common reply. The knight on a5 attacks the bishop, but White gives it a good retreat on e2 and keeps the extra pawn.",
        },
        {
          name: "Fried Liver Attack",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7 Kxf7 7.Qf3+ Ke6 8.Nc3",
          text:
            "If Black takes on d5 with the knight, White sacrifices a piece on f7. The king is dragged to e6 and White piles up on the pinned knight. Strong defenders can survive, but it is very hard in practice.",
        },
        {
          name: "Traxler counter-attack",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bd5",
          text:
            "Black ignores the threat and counter-attacks f2. The safe practical reply is 5.Bxf7+, after which the king is stuck in the centre. 5.Nxf7 is much more complicated.",
        },
      ],
      againstIt:
        "Strong Black players answer 5.exd5 with 5...Na5, accept being a pawn down for a while and aim for quick development with ...c6, ...h6 and ...e4. Others avoid the whole line with 3...Bc5 or try the Traxler. The sharpest tries rely on White knowing the details.",
      plans: {
        white:
          "In the 5...Na5 line keep the extra pawn: retreat the bishop to e2, trade pieces when you can and meet ...e4 with Ne5. In the Fried Liver, bring the knight to c3, put the queen on f3 or e4 and keep attacking the exposed king and the pinned d5 knight.",
        black:
          "Give the pawn back only for development: ...Na5, ...c6 and ...h6 kick the white pieces, then ...e4 and ...Bd6 give you the initiative. Avoid 5...Nxd5 unless you know the defences.",
      },
      history:
        "The attack on f7 with 4.Ng5 has been known for centuries, and the Fried Liver Attack (also called the Fegatello) is one of the most famous beginner traps in chess. Modern analysis shows that 5...Na5 is Black's safest reply, which is why the Fried Liver mostly appears in games between inexperienced players.",
      faq: [
        {
          q: "Is the Fried Liver Attack good?",
          a:
            "Against 5...Nxd5?! it gives White a strong, dangerous attack, and in practice most opponents struggle. Accurate defence can hold, so strong players usually avoid it with 5...Na5.",
        },
        {
          q: "What is the best response to 4.Ng5?",
          a:
            "4...d5 5.exd5 Na5 is the main line, and it is considered the most reliable reply. The Traxler 4...Bc5 is the sharp alternative.",
        },
        {
          q: "Is 4.Ng5 better than 4.d3 against the Two Knights Defence?",
          a:
            "4.Ng5 is sharper and gives more chances to win quickly, but also more risk and more theory. 4.d3 is the safer, quieter option.",
        },
        {
          q: "What is the Traxler counter-attack?",
          a:
            "It is the sharp reply 4...Bc5 to 4.Ng5, when Black lets White take f7 and counters on f2. White's safest answer is 5.Bxf7+ Ke7 6.Bd5.",
        },
      ],
    },
    lines: [
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
        name: "Main line 5...Na5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Na5 6.Bb5+ c6 7.dxc6 bxc6 8.Be2 h6 9.Nf3 e4 10.Ne5",
        notes: {
          "4.Ng5": "Double attack on f7. Black has to give a pawn with ...d5.",
          "5...Na5": "Correct: hits the bishop rather than recapturing on d5.",
          "8.Be2": "White is a pawn up but Black gets fast development in return.",
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
    style: "System",
    article: {
      whatIs:
        "The London System is a set-up for White that starts with 1.d4 and develops the dark-squared bishop to f4 before playing e3. White then plays Nf3, c3, Nbd2 and Bd3 against almost anything Black does. The pawn triangle c3-d4-e3 is very hard to break, and the opening is popular because it needs far less memorisation than the main lines.",
      howToReach:
        "Play 1.d4 and meet most replies with 2.Bf4, for example 1.d4 d5 2.Bf4 Nf6 3.e3. Then add Nf3, c3, Nbd2 and Bd3. Putting the bishop out on move two keeps it outside the pawn chain.",
      pros: [
        "Very little theory: the same set-up works against 1...d5, 1...Nf6 and many other replies.",
        "A solid pawn structure that is difficult for Black to attack.",
        "Clear plans, such as Ne5 with f4, or Bd3 and Qe2/Qc2 aiming at h7.",
        "Works well in blitz and online play, where you don't want to prepare for every opponent.",
        "The f4 bishop is developed outside the pawn chain, so there is no \"bad bishop\" problem.",
      ],
      cons: [
        "Black can fight back with ...c5 and ...Qb6, hitting b2, and you must know the replies (Qb3, Qc1 or the Nc3 gambit).",
        "If you play too passively, Black gets comfortable equality, for example with a mirrored ...Bf5.",
        "It rarely gives White a real opening edge, so you have to outplay the opponent in the middlegame.",
        "Well-prepared opponents find it predictable.",
      ],
      variations: [
        {
          name: "Main structure vs ...d5, ...Nf6, ...e6, ...c5",
          pgn: "1.d4 d5 2.Bf4 Nf6 3.e3 e6 4.Nf3 c5 5.c3 Nc6 6.Nbd2 Bd6 7.Bg3 O-O 8.Bd3",
          text:
            "The model London set-up. Don't let Black trade your bishop on your terms; keep it with Bg3, castle and then look for Ne5, f4 or e4.",
        },
        {
          name: "Black plays ...c5 and ...Qb6",
          pgn: "1.d4 d5 2.Bf4 c5 3.e3 Nc6 4.c3 Qb6 5.Qb3 c4 6.Qc2 Bf5 7.Qc1",
          text:
            "Black hits b2. White offers to trade queens or keeps the queen guarding b2. After ...c4 White continues with Nd2 and e4.",
        },
        {
          name: "King's Indian set-up",
          pgn: "1.d4 Nf6 2.Bf4 g6 3.e3 Bg7 4.Nf3 O-O 5.Be2 d6 6.h3 c5 7.c3",
          text:
            "Against a fianchetto, the bishop is better on e2 than d3, and h3 gives the f4 bishop a retreat if ...Nh5 comes.",
        },
        {
          name: "Mirrored ...Bf5",
          pgn: "1.d4 d5 2.Bf4 Bf5 3.e3 e6 4.c4 Nf6 5.Nc3",
          text:
            "When Black copies the bishop move, c4 and Qb3 put pressure on b7, which the bishop no longer protects.",
        },
      ],
      againstIt:
        "Players who know the London usually attack b2 with ...c5 and ...Qb6, hit d4 with ...Nc6, trade your bishop with ...Bd6, or play ...Bf5 and ...Nh5 to win the bishop pair. Meet each plan calmly: guard b2, keep h3 ready, and don't let your bishop get exchanged for free.",
      plans: {
        white:
          "Complete the triangle c3-d4-e3, play Nf3, Nbd2 and Bd3, then castle. After that choose between Ne5 with f4, Qe2/Qc2 and a kingside attack, or a central e4 break. Keep h3 handy against ...Nh5 or ...Ng4.",
        black:
          "Strike at the centre with ...c5 and ...Nc6, develop ...Bd6 to challenge the f4 bishop, and use ...Qb6 against b2 when it is safe. A Colle-style ...e6 and ...Bd6 set-up is also fine.",
      },
      history:
        "The system takes its name from the London 1922 tournament, where several players used it, although the ideas were known earlier. It stayed a favourite of club players for decades and returned in the 2010s and 2020s as a regular guest in elite and online play because of how little theory it needs.",
      faq: [
        {
          q: "Is the London System good for beginners?",
          a:
            "Yes. You play the same moves in most games, so you can concentrate on plans and tactics instead of memorising lines. It is one of the easiest openings to learn.",
        },
        {
          q: "What is the best response to the London System?",
          a:
            "Black's most testing set-up is ...d5, ...Nf6, ...c5, ...Nc6 and ...Bd6, hitting d4 and challenging the bishop. Early ...Qb6 and ...Bf5 plans also cause White problems.",
        },
        {
          q: "Is the London System bad?",
          a:
            "No. It is a sound opening that is used even by strong players. It just doesn't try to win an early advantage, so you need to play the middlegame well.",
        },
        {
          q: "What is the difference between the London and the Jobava London?",
          a:
            "The Jobava London puts the knight on c3 instead of d2 and often skips the quiet e3, aiming for a much sharper game. The classical London is calmer and more solid.",
        },
      ],
    },
    lines: [
      {
        name: "Trap: ...Qb6 grabbing b2",
        moves: "1.d4 d5 2.Bf4 c5 3.e3 Qb6 4.Nc3 Qxb2 5.Nxd5 e6 6.Rb1 Qxa2 7.Nc7+ Kd8 8.Nxa8",
        notes: {
          "3...Qb6": "Black attacks b2 at once, the London's classic weak point.",
          "4.Nc3": "A gambit: White offers the b2 pawn and develops a piece. Taking it is risky for Black.",
          "4...Qxb2": "Greedy. The queen goes far from the defence of Black's position.",
          "5.Nxd5": "The strongest move: the knight takes a pawn and threatens both Rb1, trapping the queen, and Nc7+, forking king and rook. Black cannot meet both threats.",
          "5...e6": "Attacks the knight, but ignores the real dangers.",
          "6.Rb1": "Attacks the queen.",
          "6...Qxa2": "The queen grabs another pawn and runs.",
          "7.Nc7+": "A knight fork of the king and the rook on a8.",
          "7...Kd8": "Forced.",
          "8.Nxa8": "White wins the rook. Black's queen is far from the king and White is winning.",
        },
      },
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
          "7.Qc1": "The safe retreat: the queen covers b2 again (7.Qxf5 Qxb2 is a wild scramble). White follows with Nd2 and Be2, and the position is equal.",
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
    style: "Classical",
    article: {
      whatIs:
        "The Queen's Gambit starts 1.d4 d5 2.c4. White offers the c-pawn to deflect Black's d-pawn and take control of the centre. It isn't a real gambit, because White can win the pawn back if Black takes it. This course covers the Exchange Queen's Gambit Declined (the Carlsbad structure), the Queen's Gambit Accepted, the Slav and the gambits Black can try.",
      howToReach:
        "Play 1.d4 d5 2.c4. After 2...e6 3.Nc3 Nf6 the Exchange with 4.cxd5 exd5 5.Bg5 is a simple route to a clear plan.",
      pros: [
        "It fights for the centre without taking real risks.",
        "Clear strategic plans, such as the minority attack in the Exchange.",
        "A respected, well-tested opening that is played at every level.",
        "It teaches pawn-structure thinking that transfers to many other openings.",
        "White has easy ways to keep a small, lasting advantage.",
      ],
      cons: [
        "Black has many sound defences (QGD, Slav, Semi-Slav, QGA), so you need to know several systems.",
        "The Exchange gives a symmetrical structure that can feel dry or drawish.",
        "The minority attack is slow and requires patience.",
      ],
      variations: [
        {
          name: "QGD Exchange (Carlsbad structure)",
          pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 Be7 6.e3 O-O 7.Bd3 Nbd7 8.Qc2 c6 9.Nf3 Re8 10.O-O Nf8",
          text:
            "White pressures the c-file and plans the minority attack with b4-b5. Black normally aims for kingside play or a ...Ne4 break.",
        },
        {
          name: "Queen's Gambit Accepted",
          pgn: "1.d4 d5 2.c4 dxc4 3.e3 Nf6 4.Bxc4 e6 5.Nf3 c5 6.O-O a6 7.Bb3 Nc6 8.Qe2",
          text:
            "White regains the pawn with Bxc4, develops quickly and uses the lead in development against Black's centre.",
        },
        {
          name: "Slav Defence",
          pgn: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O O-O 9.Qe2",
          text:
            "With a4 White stops ...b5 from holding the extra pawn, then recaptures on c4 and aims for e4.",
        },
        {
          name: "Albin Countergambit",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.g3",
          text:
            "Black sacrifices a pawn for space. 4.Nf3 is the right move (4.e3? falls into the Lasker Trap), and a fianchetto gives White a pleasant edge.",
        },
        {
          name: "Chigorin Defence",
          pgn: "1.d4 d5 2.c4 Nc6 3.Nf3 Bg4 4.cxd5 Bxf3 5.gxf3 Qxd5 6.e3",
          text:
            "Black gives up the bishop pair for active pieces. White's two bishops and central pawns make up for the damaged structure.",
        },
      ],
      againstIt:
        "Black can take the pawn (QGA), support d5 solidly (QGD or Slav), or counter at once with the Albin Countergambit 2...e5 or the Chigorin 2...Nc6. The Semi-Slav (...c6 plus ...e6) is the most complex defence and is not covered here.",
      plans: {
        white:
          "In the Exchange QGD, play Bd3, Qc2 and Nf3, then the minority attack b4-b5 to create a weak c-pawn. In the QGA, regain the pawn with e3 and Bxc4 and take the centre. Against the Slav, use a4 to stop ...b5.",
        black:
          "In the Exchange, trade pieces and use ...Ne4, ...Bf5 or a kingside advance. In the QGA, play ...c5 and ...Nc6 to hit d4 and develop quickly. In the Slav, hold c4 with ...b5 only if it is safe.",
      },
      history:
        "The Queen's Gambit is one of the oldest known openings. It is mentioned in the Göttingen manuscript from around 1490 and has been played ever since by world champions from Steinitz and Lasker to Capablanca, Botvinnik, Karpov and Kasparov. The 2020 Netflix series The Queen's Gambit brought it fresh popularity.",
      faq: [
        {
          q: "Is the Queen's Gambit a real gambit?",
          a:
            "Not really. If Black takes on c4, White can regain the pawn almost by force, usually with e3 and Bxc4, so it is more of a central fight than a sacrifice.",
        },
        {
          q: "Should Black accept the Queen's Gambit?",
          a:
            "Accepting with 2...dxc4 is sound, but Black must hand the centre to White in return. Many players prefer to decline with 2...e6 or 2...c6.",
        },
        {
          q: "Is the Queen's Gambit good for beginners?",
          a:
            "It is a great opening to learn because the ideas are classical and clear, but there are several defences to prepare for. Starting with the Exchange line keeps it simple.",
        },
        {
          q: "What are the main defences to the Queen's Gambit?",
          a:
            "The Queen's Gambit Declined (2...e6), the Slav (2...c6), the Queen's Gambit Accepted (2...dxc4), and the Albin and Chigorin countergambits.",
        },
        {
          q: "What is the minority attack?",
          a:
            "It is the plan of pushing White's b-pawn (b4-b5) against Black's larger group of queenside pawns, to create a weak pawn on c6. It is the key idea of the Exchange Queen's Gambit.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: the QGA trap 3...b5?",
        moves: "1.d4 d5 2.c4 dxc4 3.e3 b5 4.a4 c6 5.axb5 cxb5 6.Qf3",
        notes: {
          "3...b5": "Greedy: Black tries to hold on to the pawn.",
          "4.a4": "Attacks the b5 pawn. Black cannot keep it.",
          "4...c6": "Natural but a mistake. It weakens the long diagonal (4...Bb7 was better).",
          "5.axb5": "Opens the a-file and the diagonal.",
          "5...cxb5": "Black recaptures, but the pawn that blocked the long diagonal has gone.",
          "6.Qf3": "Double attack on the rook on a8 and the pawn on f7. White wins material (for example 6...Bb7 7.Qxb7).",
        },
      },
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
        moves: "1.d4 d5 2.c4 dxc4 3.e3 Nf6 4.Bxc4 e6 5.Nf3 c5 6.O-O a6 7.Bb3 Nc6 8.Qe2",
        notes: {
          "3.e3": "Simple and flexible: you win the pawn back at once with Bxc4. It also sets a trap for the greedy 3...b5? (see the first line).",
          "4.Bxc4": "The pawn is back and the bishop eyes f7.",
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
    style: "Classical",
    article: {
      whatIs:
        "The Ruy Lopez, or Spanish Game, starts 1.e4 e5 2.Nf3 Nc6 3.Bb5. White attacks the knight that defends e5 and builds long-term pressure on Black's centre. It is the most respected reply to 1...e5, with a very deep theory and a rich variety of plans.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6 3.Bb5. After 3...a6 4.Ba4 Nf6 5.O-O you have reached the main line.",
      pros: [
        "It fights directly for e5 and the centre, with long-term pressure.",
        "Rich strategic play with many plans and a small but lasting edge.",
        "Lines are heavily studied, so there is a lot of learning material.",
        "The ideas you learn (the c3-d4 centre, manoeuvring knights) apply to many other openings.",
        "Most of the elite players of the past 150 years have used it.",
      ],
      cons: [
        "A large amount of theory, especially against the Marshall, Berlin and Open lines.",
        "Black has several very solid defences, and the Berlin Wall leads to a drawish endgame if White allows it.",
        "Closed middlegames can be slow and manoeuvring.",
        "Not an easy first opening for beginners.",
      ],
      variations: [
        {
          name: "Closed Ruy: Chigorin",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Na5 10.Bc2 c5 11.d4 Qc7 12.Nbd2",
          text:
            "The main battleground. White builds a centre with c3 and d4, and the bishop retreats to c2. A long manoeuvring fight follows.",
        },
        {
          name: "Marshall Attack",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5 9.exd5 Nxd5 10.Nxe5 Nxe5 11.Rxe5 c6 12.d4 Bd6 13.Re1 Qh4 14.g3 Qh3",
          text:
            "Black sacrifices a pawn for a dangerous attack. It is one of the most famous gambits in chess, and White must defend very accurately.",
        },
        {
          name: "Anti-Marshall 8.a4",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.a4 Bb7 9.d3 d6",
          text:
            "Avoids the Marshall by hitting b5 straight away. It is a popular choice for players who don't want to learn the gambit.",
        },
        {
          name: "Open Ruy",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6 9.c3",
          text:
            "Black takes the e4 pawn and gets active pieces. White opens the centre with d4 and plays for a long-term edge on the queenside; the position is balanced.",
        },
        {
          name: "Berlin avoided with 4.d3",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 Bc5 5.c3 O-O 6.O-O d6 7.h3",
          text:
            "Skips the queenless Berlin endgame (4.O-O Nxe4) and keeps pieces on the board.",
        },
      ],
      againstIt:
        "Black's main weapons are the Berlin Defence (3...Nf6 with an endgame after 4.O-O Nxe4), the Marshall gambit after 8.c3, the Open Spanish with 5...Nxe4, and sidelines such as the Schliemann 3...f5. This course sidesteps the first two with 4.d3 and 8.a4.",
      plans: {
        white:
          "Keep the pressure on c6 and e5, castle and play Re1, c3 and d4. The Nbd2-f1-g3 manoeuvre brings a knight to the kingside, and the bishop on c2 or b3 eyes the diagonal toward Black's king.",
        black:
          "Break in the centre with ...d5 or ...c5, use the ...Na5 and ...c5 plan in the Chigorin, or sacrifice a pawn for activity in the Marshall. The Berlin trades queens to reach a solid endgame.",
      },
      history:
        "The opening is named after the Spanish priest Ruy López de Segura, who discussed 3.Bb5 in his 1561 book on chess. Steinitz and Lasker made it a mainstay, and it has been played by almost every top player since, including Capablanca, Fischer, Karpov, Kasparov and Carlsen. The Berlin Defence became famous as a \"Berlin Wall\" after Kramnik used it against Kasparov in 2000.",
      faq: [
        {
          q: "What is the Ruy Lopez?",
          a:
            "It is the opening 1.e4 e5 2.Nf3 Nc6 3.Bb5, where White attacks the defender of the e5 pawn. It is also called the Spanish Game and is one of the oldest and most respected openings.",
        },
        {
          q: "Is the Ruy Lopez good for beginners?",
          a:
            "It is a great opening to learn the ideas of strategy, but it has a lot of theory. Beginners may do better with the Italian Game first and move to the Ruy later.",
        },
        {
          q: "What is the Marshall Attack?",
          a:
            "It is a pawn sacrifice by Black (8...d5) after 8.c3, giving Black a strong attack. White can avoid it with the Anti-Marshall 8.a4 or 8.h3.",
        },
        {
          q: "How can White avoid the Berlin endgame?",
          a:
            "Play 4.d3 instead of 4.O-O. After 4...Bc5 5.c3 White keeps all the pieces on the board and a flexible position.",
        },
        {
          q: "Why is it called the Spanish Game?",
          a:
            "It is named after Ruy López, a Spanish priest who described it in 1561. In English-speaking countries it is called the Ruy Lopez, and in many other languages the Spanish Game.",
        },
      ],
    },
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
    style: "Classical",
    article: {
      whatIs:
        "The Scotch Game begins 1.e4 e5 2.Nf3 Nc6 3.d4. White opens the centre immediately instead of building slow pressure like in the Ruy Lopez. After 3...exd4 4.Nxd4 White has a strong central knight, easy development and clear plans.",
      howToReach: "Play 1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4.",
      pros: [
        "Open, active play with fast development.",
        "Much less theory than the Ruy Lopez or the Italian main lines.",
        "Clear piece play, so it is easy to understand what to do.",
        "Used by world-class players to avoid the heavy Ruy Lopez theory.",
        "White's knight on d4 is well placed and the centre stays under control.",
      ],
      cons: [
        "Black can reach equality with accurate play, for example 4...Nf6 or 4...Bc5.",
        "There is less long-term pressure than in the Ruy Lopez.",
        "You must know the answers to several different Black systems (4...Bc5, 4...Nf6, 4...Qh4).",
      ],
      variations: [
        {
          name: "Classical 4...Bc5 5.Nxc6",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Nxc6 Qf6 6.Qd2 dxc6 7.Nc3",
          text:
            "White trades the c6 knight and defends f2 with the queen. Black has the bishop pair, White has the better structure and a lead in activity.",
        },
        {
          name: "Classical 4...Bc5 5.Be3",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4",
          text:
            "An alternative that keeps more tension: the knight is protected twice and White develops naturally.",
        },
        {
          name: "Mieses Variation 4...Nf6",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6",
          text:
            "White kicks the knight with e5, then chases it again with c4. Black gets the bishop pair and active play but White has a space edge.",
        },
        {
          name: "Steinitz Variation 4...Qh4",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Qh4 5.Nc3 Bb4 6.Be2",
          text:
            "Black's queen comes out early. White develops with tempo and gives the e4 pawn back if needed to open lines.",
        },
      ],
      againstIt:
        "Black's most reliable moves are 4...Bc5 (hitting the knight and f2) and 4...Nf6 (pressing e4). The Scotch Gambit 3...exd4 4.Bc4 gives White another route but is not covered here. A flexible Black will try to trade pieces and use the bishop pair.",
      plans: {
        white:
          "Develop quickly, trade the knight on c6 when it helps (it damages Black's pawns), use e5 against ...Nf6 and aim for Qd2/Be3 or O-O-O ideas. Often White castles short and plays on the centre.",
        black:
          "Use the bishop pair with ...Bc5 and ...Qf6, hit e4 with ...Nf6, and look for ...d5 to free the position. In the Mieses, Black aims for ...Ba6 and ...Nb6 to harass White's pieces.",
      },
      history:
        "The opening is named after a famous 1824 correspondence match between the London and Edinburgh chess clubs, in which the Scots used 3.d4. It fell out of fashion after the 19th century, but Garry Kasparov brought it back at the highest level when he used it in his 1990 World Championship match against Karpov.",
      faq: [
        {
          q: "Is the Scotch Game good?",
          a:
            "Yes. It is a sound opening that gives White easy development and open play. Black can equalise with best play, but the positions are rich and practical.",
        },
        {
          q: "Is the Scotch Game good for beginners?",
          a:
            "Yes. The ideas are simple (open the centre, develop pieces quickly, castle) and there is much less theory to learn than in the Ruy Lopez.",
        },
        {
          q: "What is the Scotch Gambit?",
          a:
            "It is 3.d4 exd4 4.Bc4, where White plays the bishop out instead of recapturing the pawn at once. It can lead to Italian-style positions or to sharp lines such as the Max Lange Attack.",
        },
        {
          q: "Why is it called the Scotch Game?",
          a:
            "It is named after the 1824 correspondence match between Edinburgh and London, in which the Edinburgh players used this opening.",
        },
      ],
    },
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
    style: "System",
    article: {
      whatIs:
        "This course completes a 1.e4 repertoire with low-theory, plan-based systems against the replies other than 1...e5: the Alapin against the Sicilian, the Advance variations against the Caro-Kann and the French, and simple set-ups against the Scandinavian, the Pirc and the Alekhine. Every system is built around a plan rather than a long chain of memorised moves.",
      howToReach:
        "Start with 1.e4 and choose the system by Black's first move: 1...c5 2.c3 (Alapin), 1...c6 2.d4 d5 3.e5 (Advance), 1...e6 2.d4 d5 3.e5 (Advance), 1...d5 2.exd5, 1...d6 2.d4 Nf6 3.Nc3 g6 4.Be3 (150 Attack), 1...Nf6 2.e5 Nd5 3.d4 d6 4.Nf3 (Modern Variation).",
      pros: [
        "One simple system per defence, so there is little to memorise.",
        "All lines lead to understandable pawn structures.",
        "Suits players who want to avoid the huge theory of the Open Sicilian or the Winawer.",
        "The Advance structures give White space and clear kingside attacking plans.",
        "The core ideas (c3 and d4, an e5 pawn chain) repeat across the different defences.",
      ],
      cons: [
        "White's advantage is usually small, so you must understand the plans to get anything.",
        "Black has well-known antidotes (for example ...Qb6 and ...c4 in the French Advance, or ...d5 in the Alapin).",
        "It isn't a complete repertoire, because it doesn't cover 1...e5.",
        "Some systems can be passive if you don't follow the plan.",
      ],
      variations: [
        {
          name: "Alapin Sicilian vs 2...Nf6",
          pgn: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.Nf3 Nc6 6.cxd4 d6 7.Bc4 Nb6 8.Bb5",
          text:
            "White gets a big centre by recapturing with the c-pawn. Black must challenge it quickly with ...d6 and ...Bg4.",
        },
        {
          name: "Caro-Kann Advance (Short System)",
          pgn: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 c5 6.Be3",
          text:
            "A calm approach: develop the knight and bishop, support d4 and keep the space advantage.",
        },
        {
          name: "French Advance",
          pgn: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2",
          text:
            "White supports the pawn chain with c3 and prepares b4 to gain queenside space after ...c4.",
        },
        {
          name: "Scandinavian 2...Qxd5",
          pgn: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2",
          text:
            "Develop with tempo against the queen, take the centre with d4, and watch for Nd5 ideas.",
        },
        {
          name: "Pirc: 150 Attack",
          pgn: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2",
          text:
            "The classical set-up: Be3, Qd2, f3 and Bh6 followed by long castling and a kingside pawn storm.",
        },
      ],
      againstIt:
        "Black's best chance is to strike at the base of the pawn chain: ...c5 against the French or Caro-Kann Advance, ...Qb6 to pressure b2 and d4, and ...d5 against the Alapin. Against the Pirc, ...c6 and ...b5 give counterplay, so avoid being too passive.",
      plans: {
        white:
          "Gain space with e5 or a solid c3 and d4 centre, develop the pieces naturally (Nf3, Be2 or Bd3, O-O) and then use your space for a kingside attack or a queenside expansion with b4.",
        black:
          "Attack the centre as early as possible (...c5, ...Qb6, ...Nc6) and don't let White enjoy a free space advantage. Bring the light-squared bishop out before locking it in with ...e6.",
      },
      history:
        "The Alapin Variation is named after Semyon Alapin (1856-1923), a Russian master who championed 2.c3 against the Sicilian in the late 19th century. The Advance variations of the French and Caro-Kann are also old ideas, and Aron Nimzowitsch did a lot to explain the strategy of the Advance French.",
      faq: [
        {
          q: "What is the best way to play against the Sicilian Defence?",
          a:
            "The Open Sicilian (2.Nf3 followed by 3.d4) is the most ambitious choice, but it requires a lot of theory. The Alapin 2.c3 is a simpler option that still gives White a good centre.",
        },
        {
          q: "What is the Alapin Sicilian?",
          a:
            "It is the line 1.e4 c5 2.c3, preparing d4 so that a pawn can recapture. It is popular because it avoids the heaviest Sicilian theory.",
        },
        {
          q: "Is the Advance variation good against the French and Caro-Kann?",
          a:
            "Yes. It gains space and gives White clear plans, though Black has counterplay with ...c5 and ...Qb6, so you need to know the main ideas.",
        },
        {
          q: "Do I need to learn the Open Sicilian to play 1.e4?",
          a:
            "No. You can play Alapin, Grand Prix or other anti-Sicilians and still enjoy good positions. The Open Sicilian just has more theory.",
        },
      ],
    },
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

  {
    id: "vienna-gambit",
    title: "Vienna Gambit",
    side: "white",
    level: "intermediate",
    eco: "C29",
    summary:
      "1.e4 e5 2.Nc3 Nf6 3.f4: an old-school attacking gambit. White builds a big centre, opens the f-file and castles early. Black has several good replies, so the course teaches the main ones plus the traps that punish natural-looking mistakes.",
    ideas: [
      "f4 fights for the centre and opens the f-file; if Black takes with ...exf4, White replies e5 or Nf3 and develops quickly.",
      "The e4 pawn is not free: after 3...Nxe4? Nxe4 d5 the knight simply retreats and White is a piece up.",
      "Against 3...d5 the plan is fxe5, Nf3, d4, Bd3 and O-O, keeping all the pieces working together.",
      "Develop with tempo and keep your own king safe: the gambit is a fight for the initiative, not a blind attack.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Vienna Gambit goes 1.e4 e5 2.Nc3 Nf6 3.f4. By putting the knight on c3 first, White prepares f4 with the e4 pawn well protected. The aim is to open the f-file, grab the centre and attack quickly. It is a classic gambit that suits attacking players and rewards knowing the tactics.",
      howToReach:
        "Play 1.e4 e5 2.Nc3 and, after 2...Nf6, 3.f4. If Black avoids 2...Nf6 you can still play f4 in many lines.",
      pros: [
        "Fast development and an open f-file give White an easy-to-understand initiative.",
        "Many natural Black moves go wrong, such as 3...Nxe4? or the passive 4...Qe7.",
        "The central pawn break d4 usually follows, and White's pieces are well coordinated.",
        "Less theory than the King's Gambit and much safer for White.",
        "A great surprise weapon at club level, because many players don't know the right answers.",
      ],
      cons: [
        "Against 3...d5 Black equalises with accurate play, so don't expect an advantage.",
        "White sometimes gives up a pawn, so the compensation has to come from activity.",
        "Black can avoid the main lines with 2...Nc6 or 3...Nc6 and aim for a quieter game.",
        "You must be careful not to overextend: a careless attack can leave your own king exposed.",
      ],
      variations: [
        {
          name: "Main line with 3...d5",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.f4 d5 4.fxe5 Nxe4 5.Nf3 Be7 6.d4 O-O 7.Bd3 f5 8.exf6 Bxf6 9.O-O",
          text:
            "The critical test. Both sides develop naturally and the position is equal, with chances for both. White's lead in activity is the main trump.",
        },
        {
          name: "Black takes: 3...exf4",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.f4 exf4 4.e5 Ng8 5.Nf3 d6 6.d4",
          text:
            "After 4.e5 the knight must retreat, and Black's best is 4...Ng8. White gets a big centre and an easy lead in development in return for the pawn.",
        },
        {
          name: "Greedy 3...Nxe4?",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.f4 Nxe4 4.Nxe4 d5 5.Nf2",
          text:
            "A typical beginner's mistake. Black hopes to win the knight back with ...d5, but the knight has a safe square and White is a piece up.",
        },
        {
          name: "Flexible 3...Nc6",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.f4 Nc6 4.fxe5 Nxe5 5.d4 Ng6 6.e5 Ng8 7.Nf3",
          text:
            "Black protects e5 and recaptures with the knight. White gains time by hitting the knight twice and gets a big centre.",
        },
      ],
      againstIt:
        "Players who know theory meet the Vienna Gambit with 3...d5, giving back the pawn and heading for an equal game. Others play the calm 3...Nc6 or take the pawn with 3...exf4 and retreat with 4...Ng8. The mistakes to avoid are 3...Nxe4? and 3...exf4 4.e5 Qe7?!.",
      plans: {
        white:
          "Develop quickly (Nf3, Bd3, O-O), take the centre with d4 and use the f-file. Don't hurry to attack: castle first and make sure your pieces are coordinated.",
        black:
          "Hit the centre with ...d5, develop the bishop to e7 and castle, and break with ...f5 or ...c5 when ready. Take the pawn only if you can return it at the right time.",
      },
      history:
        "The Vienna Game is named after the Austrian capital, where it was popular with players in the 19th century. The gambit 3.f4 is an old attacking idea that remains a surprise weapon at every level, because few players know all the details of the replies.",
      faq: [
        {
          q: "Is the Vienna Gambit good?",
          a:
            "Yes. It is a sound opening that gives White easy development and a real initiative. With best play Black can equalise, but there are plenty of ways to go wrong.",
        },
        {
          q: "What is the best response to the Vienna Gambit?",
          a:
            "The most solid reply is 3...d5, hitting the centre at once. The calmer 3...Nc6 is also fine. Taking the pawn with 3...exf4 4.e5 Ng8 is playable but dangerous for Black.",
        },
        {
          q: "What is the difference between the Vienna Game and the Vienna Gambit?",
          a:
            "The Vienna Game is 1.e4 e5 2.Nc3. The Vienna Gambit is the sharp follow-up 3.f4, which offers a pawn. White can also play quieter ideas like 3.Bc4 or 3.g3.",
        },
        {
          q: "Is the Vienna Gambit good for beginners?",
          a:
            "It is a fun, tactical opening that teaches development, the centre and attacking play. It needs less memorisation than the King's Gambit, so it suits improving players well.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 3...Nxe4?",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 Nxe4 4.Nxe4 d5 5.Nf2 exf4 6.d4 Bd6 7.Bd3",
        notes: {
          "2.Nc3": "The Vienna: the knight guards e4 and prepares f4 without blocking the c-pawn.",
          "3.f4": "The gambit. White fights for the centre and opens the f-file.",
          "3...Nxe4": "A greedy mistake. The e4 pawn is defended by the knight on c3.",
          "4.Nxe4": "White wins a knight for a pawn.",
          "4...d5": "Black attacks the knight and hopes to win the piece back.",
          "5.Nf2": "The knight retreats to a safe square. White stays a clean piece up for a pawn.",
          "6.d4": "Take the centre and develop. The extra piece will decide the game.",
          "7.Bd3": "Another developing move with a big advantage: White is a piece up for two pawns.",
        },
      },
      {
        name: "Main line: 3...d5",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 d5 4.fxe5 Nxe4 5.Nf3 Be7 6.d4 O-O 7.Bd3 f5 8.exf6 Bxf6 9.O-O",
        notes: {
          "3...d5": "Black strikes back in the centre at once. This is the most popular reply.",
          "4.fxe5": "Take the pawn. Taking with 4.exd5 lets Black equalise easily.",
          "4...Nxe4": "The knight lands in the centre and eyes the knight on c3.",
          "5.Nf3": "Develops and protects the e5 pawn.",
          "6.d4": "Take the centre; e5 is now well supported.",
          "7.Bd3": "Attacks the knight on e4 and points at the kingside.",
          "7...f5": "Supports the knight on e4 and hits the e5 pawn, though it weakens Black's own king.",
          "8.exf6": "En passant capture, opening lines for the pieces.",
          "9.O-O": "The king is safe and the position is roughly equal. White's pieces are easier to play, and Black must still find accurate moves.",
        },
      },
      {
        name: "3...exf4 4.e5 Qe7?!",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 exf4 4.e5 Qe7 5.Qe2 Ng8 6.Nf3 g5 7.Nd5",
        notes: {
          "3...exf4": "Black accepts the gambit.",
          "4.e5": "Gains time: the knight has to move.",
          "4...Qe7": "Natural, but it loses time because the knight must go all the way back to g8.",
          "5.Qe2": "Defends e5 and renews the threat of exf6.",
          "5...Ng8": "Practically forced: every other retreat loses material.",
          "6.Nf3": "Develops with a big lead and prepares to win the f4 pawn back.",
          "6...g5": "Black tries to hold on to the pawn.",
          "7.Nd5": "Attacks the queen and the c7 pawn at once. Black's queen has to move and White's lead in development is decisive: White is clearly winning.",
        },
      },
      {
        name: "3...exf4 4.e5 Ng8",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 exf4 4.e5 Ng8 5.Nf3 d6 6.d4",
        notes: {
          "4...Ng8": "Black's best: the knight goes back and Black keeps the extra pawn for now.",
          "5.Nf3": "Develop, and aim to win back the f4 pawn.",
          "5...d6": "Challenges the e5 pawn immediately.",
          "6.d4": "White supports e5 and takes the centre. White has a lead in development for the pawn and slightly the better chances.",
        },
      },
      {
        name: "3...Nc6 4.fxe5",
        moves: "1.e4 e5 2.Nc3 Nf6 3.f4 Nc6 4.fxe5 Nxe5 5.d4 Ng6 6.e5 Ng8 7.Nf3",
        notes: {
          "3...Nc6": "Protects the e5 pawn, but it lets White take the initiative: White comes out clearly better in this line.",
          "4.fxe5": "Take the pawn first.",
          "4...Nxe5": "The knight recaptures in the centre.",
          "5.d4": "Gains a tempo by attacking the knight.",
          "5...Ng6": "The knight must move, and g6 is a natural square.",
          "6.e5": "Another tempo: now the knight on f6 is attacked.",
          "6...Ng8": "Both knights are back on their starting squares and White has a big centre.",
          "7.Nf3": "White keeps a clear edge with easy development and Bd3 to come.",
        },
      },
    ],
  },
  {
    id: "danish-gambit",
    title: "Danish Gambit",
    side: "white",
    level: "intermediate",
    eco: "C21",
    summary:
      "1.e4 e5 2.d4 exd4 3.c3: White gives one or two pawns for rapid development and two bishops aiming at Black's kingside. It's an unsound gambit objectively, but the attack is easy to play and many natural replies lose quickly.",
    ideas: [
      "Give the pawns to open lines: after ...dxc3 and ...cxb2, the bishops on b2 and c4 point at g7 and f7.",
      "The g7 pawn is the key target: if Black forgets about it, Bxg7 wins material.",
      "In the main line 5...d5 White gets the pawns back with a lead in development and queens come off.",
      "Be honest: the gambit is risky. If Black declines with 3...d5, play for a healthy central position instead.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Danish Gambit begins 1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2. White sacrifices two pawns to bring the bishops to b2 and c4, where they bear down on Black's kingside. It is objectively risky, but it gives lively attacking chances and it is easy to play. Many natural replies lose quickly.",
      howToReach:
        "Play 1.e4 e5 2.d4 exd4 3.c3. If Black takes with 3...dxc3 continue 4.Bc4 cxb2 5.Bxb2.",
      pros: [
        "Fast development: both bishops and the queen come out with tempo.",
        "Black's g7 and f7 pawns become targets, and one careless move can lose material.",
        "Easy attacking plans, so it's a good way to practise tactics.",
        "Very effective against inexperienced opponents, especially in rapid and blitz.",
        "In the main line you win the pawns back and reach a safe position.",
      ],
      cons: [
        "With best play Black stands a little better, so the gambit is risky against well-prepared opponents.",
        "You're two pawns down if Black finds quiet, accurate moves.",
        "Black can avoid the whole thing by declining with 3...d5 or 3...Nf6.",
        "You must know the tactical lines well; a slip can turn the attack into a lost game.",
      ],
      variations: [
        {
          name: "Main line with 5...d5",
          pgn: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 d5 6.Bxd5 Nf6 7.Bxf7+ Kxf7 8.Qxd8 Bb4+ 9.Qd2 Bxd2+ 10.Nxd2",
          text:
            "A forcing sequence in which queens are traded and White regains all the pawns. Black's king is stuck in the centre and White is ahead in development.",
        },
        {
          name: "5...Nf6 or 5...Bb4+",
          pgn: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 Nf6 6.Nc3 Bb4 7.Qb3 Bxc3+ 8.Qxc3 d6 9.Nf3 Nc6 10.O-O",
          text:
            "A calmer defence. White stays two pawns down but has great piece activity. The bishops aim at the kingside.",
        },
        {
          name: "Careless 5...Bc5?",
          pgn: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 Bc5 6.Bxg7",
          text:
            "The bishop moves away from g7 and leaves the pawn undefended. The long diagonal does the rest.",
        },
        {
          name: "Declined with 3...d5",
          pgn: "1.e4 e5 2.d4 exd4 3.c3 d5 4.exd5 Qxd5 5.cxd4 Nc6 6.Nf3 Bg4 7.Be2",
          text:
            "Black refuses the second pawn. White gets a healthy centre and an equal position.",
        },
      ],
      againstIt:
        "The best way to meet the Danish is not to accept too much. Players decline with 3...d5 or 3...Nf6, or take the pawns and then give one back with ...d5 to catch up in development. The classic mistakes are leaving g7 undefended and getting the queen exposed on d8 or d5.",
      plans: {
        white:
          "Develop with tempo, aim the bishops at g7 and f7 and look for Bxf7+ or Bxg7. Don't try to keep the sacrificed material: your goal is activity and a safe king.",
        black:
          "Return a pawn at the right moment with ...d5, develop calmly with ...Nf6 and ...Bb4+, and keep the g7 pawn protected. Castle quickly and use the extra pawns in the endgame.",
      },
      history:
        "The Danish Gambit is an old attacking idea, known since the 19th century. Over the years it has been a favourite of attacking players, particularly in quick games, and it still appears as a surprise weapon.",
      faq: [
        {
          q: "Is the Danish Gambit good?",
          a:
            "Not objectively: with best play Black can keep a small edge. But it is a practical weapon because the attack is easy to play and the natural-looking defences often go wrong.",
        },
        {
          q: "What is the best response to the Danish Gambit?",
          a:
            "Decline with 3...d5 or take the pawns and then return one with ...d5. Keep the g7 pawn safe and develop your pieces before grabbing more material.",
        },
        {
          q: "Is the Danish Gambit good for beginners?",
          a:
            "It's a fun opening that teaches development and attacking ideas, but you shouldn't expect to win by force. Learn the tactical points well and play it in quick games.",
        },
        {
          q: "What happens if Black takes everything?",
          a:
            "If Black takes all the pawns and plays 5...Nf6 6.Nc3 Bb4 7.Qb3, White's pieces are active but Black remains two pawns up. That's why the line works best against inexperienced opponents.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 5...Bc5?",
        moves: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 Bc5 6.Bxg7",
        notes: {
          "2.d4": "Open the centre. White is willing to give pawns for activity.",
          "3.c3": "Offers a pawn so the pieces can come out with tempo.",
          "3...dxc3": "Black accepts the gambit.",
          "4.Bc4": "The Danish Gambit: a second pawn is offered and both bishops will aim at Black's kingside.",
          "4...cxb2": "Black takes the second pawn.",
          "5.Bxb2": "White is two pawns down, but the bishops on b2 and c4 point straight at g7 and f7.",
          "5...Bc5": "A natural developing move that forgets the long diagonal. The g7 pawn is now unprotected.",
          "6.Bxg7": "Wins a pawn and attacks the rook on h8. Black cannot save everything and White wins material.",
        },
      },
      {
        name: "Main line: 5...d5",
        moves: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 d5 6.Bxd5 Nf6 7.Bxf7+ Kxf7 8.Qxd8 Bb4+ 9.Qd2 Bxd2+ 10.Nxd2",
        notes: {
          "5...d5": "Black gives a pawn back to free the position. This is the critical reply.",
          "6.Bxd5": "Takes the pawn and hits f7 and b7.",
          "6...Nf6": "Attacks the bishop on d5.",
          "7.Bxf7+": "The key tactic. The bishop leaves with check and unmasks the white queen against the black queen.",
          "7...Kxf7": "Black takes the bishop. The queens now face each other.",
          "8.Qxd8": "White takes the queen.",
          "8...Bb4+": "A zwischenzug: Black can't recapture on d8, so checks first.",
          "9.Qd2": "The queen blocks the check and offers a trade.",
          "10.Nxd2": "Material is level. Black's king cannot castle and White is ahead in development, so the position is balanced with chances for White.",
        },
      },
      {
        name: "5...Nf6 (or 5...Bb4+)",
        moves: "1.e4 e5 2.d4 exd4 3.c3 dxc3 4.Bc4 cxb2 5.Bxb2 Nf6 6.Nc3 Bb4 7.Qb3 Bxc3+ 8.Qxc3 d6 9.Nf3 Nc6 10.O-O",
        notes: {
          "5...Nf6": "Black develops and hits e4. (5...Bb4+ 6.Nc3 Nf6 reaches the same position.)",
          "6.Nc3": "Develops and covers d5 so that ...d5 isn't free.",
          "6...Bb4": "Pins the knight and prepares ...Nxe4.",
          "7.Qb3": "The queen attacks the bishop on b4 and supports the bishop on c4.",
          "7...Bxc3+": "Black gives up the bishop pair to remove the pin.",
          "8.Qxc3": "Queen and bishop now line up against f6 and g7.",
          "8...d6": "Solid, but Black is still two pawns up.",
          "10.O-O": "White has a lead in development and both bishops aimed at the kingside. The engine thinks Black is slightly better, but the practical chances are good.",
        },
      },
      {
        name: "Declined: 3...d5",
        moves: "1.e4 e5 2.d4 exd4 3.c3 d5 4.exd5 Qxd5 5.cxd4 Nc6 6.Nf3 Bg4 7.Be2",
        notes: {
          "3...d5": "Black declines the second pawn and strikes at e4.",
          "4.exd5": "Take the pawn.",
          "4...Qxd5": "Natural, but the queen can be harassed.",
          "5.cxd4": "Recapture and open the c-file. The queen will soon be hit by Nc3.",
          "5...Nc6": "Hits d4 and prepares ...Bg4.",
          "6.Nf3": "Develops and defends d4.",
          "6...Bg4": "Pins the knight against the queen.",
          "7.Be2": "A solid developing move. White castles next and the position is equal.",
        },
      },
      {
        name: "Black ignores it: 3...Nf6",
        moves: "1.e4 e5 2.d4 exd4 3.c3 Nf6 4.e5 Nd5 5.cxd4 d6 6.Nf3 Nc6 7.Bc4",
        notes: {
          "3...Nf6": "Black attacks e4 instead of taking the pawn.",
          "4.e5": "Kicks the knight and gains space.",
          "4...Nd5": "The natural square, in the centre.",
          "5.cxd4": "Now White has a big centre and no pawn is missing.",
          "5...d6": "Challenges the e5 pawn.",
          "6.Nf3": "Develops and supports e5 and d4.",
          "7.Bc4": "Hits the knight on d5 and prepares to castle. White's centre gives a comfortable game.",
        },
      },
      {
        name: "Black ignores it: 3...Nc6",
        moves: "1.e4 e5 2.d4 exd4 3.c3 Nc6 4.cxd4 d5 5.e5 Bb4+ 6.Nc3 Nge7 7.Nf3",
        notes: {
          "3...Nc6": "Black doesn't take the pawn, so White simply recaptures.",
          "4.cxd4": "A normal centre with the c-file open.",
          "4...d5": "Black strikes back in the centre.",
          "5.e5": "Gains space and closes the centre.",
          "5...Bb4+": "A check to gain a tempo.",
          "6.Nc3": "Blocks with the knight. Bd2 is also fine.",
          "7.Nf3": "White has a pleasant space advantage and easy development.",
        },
      },
    ],
  },
  {
    id: "kings-gambit",
    title: "King's Gambit",
    side: "white",
    level: "intermediate",
    eco: "C30-C39",
    summary:
      "1.e4 e5 2.f4: the most romantic opening in chess. White offers a pawn for the centre and an open f-file. The course teaches the Muzio Gambit and the Kieseritzky, plus sound replies to the modern 3...d5, the Classical 2...Bc5 and the Falkbeer, along with a famous mating trap.",
    ideas: [
      "f4 fights for the centre and opens the f-file. After ...exf4, Nf3 stops ...Qh4+ and prepares Bc4.",
      "The bishop on c4 aims at f7. If Black tries to hold the pawn with ...g5 and ...f6, watch for Nxg5.",
      "Be ready to sacrifice for the attack in the Muzio Gambit, but know that it is objectively risky.",
      "Against calm Black replies (2...Bc5, 3...d5) aim for a healthy centre with Nf3, c3 and d4.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The King's Gambit starts 1.e4 e5 2.f4. White offers the f-pawn to deflect Black's e-pawn, take control of the centre and open the f-file for the rook. It is one of the oldest and most romantic openings in chess, full of tactics and sacrifices. It is objectively a bit risky, but it is enormously fun and effective in practical play.",
      howToReach:
        "Play 1.e4 e5 2.f4. After 2...exf4 continue 3.Nf3, and after 3...g5 play 4.Bc4.",
      pros: [
        "Fast development and an open f-file give White an early initiative.",
        "Fun, tactical and instructive: you learn a lot about attacking play.",
        "Many Black replies lose quickly to tactics (4...f6? 5.Nxg5! and mate).",
        "Surprising for opponents who prefer to play their usual defences.",
        "Rich history and a lot of classic games to learn from.",
      ],
      cons: [
        "Objectively it's risky: with best play Black has at least equality and sometimes more.",
        "Your own king is exposed, so a slip can be fatal.",
        "There are many different defences (2...d5, 2...Bc5, 3...d5, 3...Nf6), and the theory is large.",
        "Some lines (like the Muzio) require precise knowledge to remain playable.",
      ],
      variations: [
        {
          name: "Muzio Gambit",
          pgn: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 g4 5.O-O gxf3 6.Qxf3 Qf6 7.d3 Nc6 8.Bxf4",
          text:
            "White gives a knight for a long-term attack on the f-file and the exposed black king. It's dangerous for both sides, and a favourite for fans of sacrifices.",
        },
        {
          name: "Kieseritzky Gambit",
          pgn: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.h4 g4 5.Ne5 Nf6 6.d4 d6 7.Nd3 Nxe4 8.Bxf4",
          text:
            "A more positional choice: White undermines the g5 pawn and then recovers a pawn with active play. The name honours Lionel Kieseritzky, who lost the famous Immortal Game to Anderssen.",
        },
        {
          name: "Modern defence 3...d5",
          pgn: "1.e4 e5 2.f4 exf4 3.Nf3 d5 4.exd5 Nf6 5.Bb5+ c6 6.dxc6 Nxc6 7.d4 Bd6 8.O-O O-O 9.Nc3",
          text:
            "Black gives back the pawn and fights for the centre. White is a pawn up but must watch out for Black's initiative.",
        },
        {
          name: "Falkbeer Countergambit",
          pgn: "1.e4 e5 2.f4 d5 3.exd5 e4 4.d3 Nf6 5.dxe4 Nxe4 6.Nf3 Bc5 7.Qe2 Bf5 8.Nc3 Qe7 9.Be3",
          text:
            "Black sacrifices a pawn for rapid development. White must be careful, but can get a small edge with accurate play.",
        },
      ],
      againstIt:
        "Strong players meet the King's Gambit with solid replies: 3...d5 (the modern defence), 2...Bc5 (declining), 3...Be7 or 3...d6 (Fischer's Defence). The trick is to give back the pawn at the right time and to castle safely. The Falkbeer 2...d5 is also a dangerous reply.",
      plans: {
        white:
          "Develop quickly (Nf3, Bc4, O-O, d4), open the f-file and aim at f7. If Black keeps the pawn, break with d4 or sacrifice a piece to open the king. If Black gives it back, play for a healthy centre.",
        black:
          "Stop the tricks first: play ...d5 early, or hold the pawn only if you can do so without weakening f7. Keep your king safe and counter-attack in the centre.",
      },
      history:
        "The King's Gambit is one of the oldest openings in chess and has been analysed since the 16th century. It produced the famous Immortal Game between Adolf Anderssen and Lionel Kieseritzky in London in 1851. It was the main weapon of the romantic era, and Boris Spassky revived it at the highest level in the 1960s, famously beating Bobby Fischer with it in 1960. Fischer later published an article called \"A Bust to the King's Gambit\".",
      faq: [
        {
          q: "Is the King's Gambit good?",
          a:
            "It's a risky but playable opening. Engines prefer Black with best play, but in human games it can be very effective because Black has to find many accurate moves.",
        },
        {
          q: "What is the best response to the King's Gambit?",
          a:
            "The most solid replies are 3...d5 (the modern defence) or 2...Bc5. Taking the pawn and then returning it with ...d5 gives Black comfortable play.",
        },
        {
          q: "Is the King's Gambit good for beginners?",
          a:
            "It's excellent for learning tactics and attacking play, but your king is exposed and you need to be careful. Treat it as a way to train your tactical eye.",
        },
        {
          q: "What is the Muzio Gambit?",
          a:
            "It is the line 1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 g4 5.O-O, where White sacrifices a knight for a strong attack on the f-file. It's a classic, but it's risky if you don't know the details.",
        },
        {
          q: "Why was the King's Gambit so popular?",
          a:
            "In the 19th century, attacking chess was fashionable and players enjoyed bold sacrifices. Modern defensive technique has made it rarer at the top, but it's still an exciting weapon at club level.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 4...f6?",
        moves: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 f6 5.Nxg5 fxg5 6.Qh5+ Ke7 7.Qxg5+ Ke8 8.Qh5+ Ke7 9.Qe5#",
        notes: {
          "2.f4": "The King's Gambit: White offers a pawn for the centre and the f-file.",
          "2...exf4": "Black accepts.",
          "3.Nf3": "Stops ...Qh4+ and prepares to attack the f4 pawn.",
          "3...g5": "Black tries to hold the pawn on f4.",
          "4.Bc4": "Aims at f7. The bishop and knight will work together against Black's kingside.",
          "4...f6": "A natural-looking move to defend g5, but it is a blunder: it weakens the e8-h5 diagonal.",
          "5.Nxg5": "The knight sacrifice opens the diagonal.",
          "5...fxg5": "Black takes the knight.",
          "6.Qh5+": "Check on the diagonal. The king has only one square.",
          "6...Ke7": "Forced, since there is no way to block.",
          "7.Qxg5+": "Another check, and the black king is in a mating net.",
          "8.Qh5+": "A second check drives the king back to e7, where the mate is waiting.",
          "9.Qe5#": "Checkmate: the bishop on c4 covers f7, the queen covers d6 and f6, and the king has no squares.",
        },
      },
      {
        name: "Muzio Gambit: 4...g4 5.O-O",
        moves: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.Bc4 g4 5.O-O gxf3 6.Qxf3 Qf6 7.d3 Nc6 8.Bxf4",
        notes: {
          "4...g4": "Black attacks the knight on f3.",
          "5.O-O": "The Muzio Gambit: White gives a whole knight for a lasting attack.",
          "5...gxf3": "Black takes the knight.",
          "6.Qxf3": "The queen, bishop and rook all aim at f7 and the f-file.",
          "6...Qf6": "Black defends f7 and hits the b2 pawn.",
          "7.d3": "A calm, flexible move: it protects e4 and opens the c1 bishop to retake on f4. (7.e5 is the older, more adventurous line.)",
          "7...Nc6": "Black develops.",
          "8.Bxf4": "White regains a pawn and has a lasting initiative. Black is a piece up for a pawn but badly placed, and the engine thinks it's a bit better for Black. The practical chances are excellent.",
        },
      },
      {
        name: "Kieseritzky Gambit (4.h4 alternative)",
        kind: "alternative",
        moves: "1.e4 e5 2.f4 exf4 3.Nf3 g5 4.h4 g4 5.Ne5 Nf6 6.d4 d6 7.Nd3 Nxe4 8.Bxf4",
        notes: {
          "4.h4": "Attacks the g5 pawn at once. Choose this instead of 4.Bc4 if you prefer a more positional gambit.",
          "4...g4": "Black pushes the pawn forward.",
          "5.Ne5": "The knight jumps into the centre, attacking the g4 pawn and f7.",
          "5...Nf6": "Black attacks e4.",
          "6.d4": "Defends e4 and takes the centre.",
          "6...d6": "Kicks the knight away.",
          "7.Nd3": "The knight goes to d3, attacking f4.",
          "7...Nxe4": "Black grabs another pawn.",
          "8.Bxf4": "White recovers a pawn and develops with tempo. Black is slightly better in the engine's eyes, but White has good practical chances.",
        },
      },
      {
        name: "Modern defence: 3...d5",
        moves: "1.e4 e5 2.f4 exf4 3.Nf3 d5 4.exd5 Nf6 5.Bb5+ c6 6.dxc6 Nxc6 7.d4 Bd6 8.O-O O-O 9.Nc3",
        notes: {
          "3...d5": "The modern way to meet the gambit: return the pawn centre at once.",
          "4.exd5": "Take the pawn.",
          "4...Nf6": "Develops and attacks the d5 pawn.",
          "5.Bb5+": "Check, to gain time.",
          "5...c6": "Black sacrifices another pawn for quick development.",
          "6.dxc6": "Take the pawn. You are now a pawn up.",
          "6...Nxc6": "Black has a big lead in development.",
          "7.d4": "White takes the centre.",
          "8.O-O": "The king is safe.",
          "9.Nc3": "White is a pawn up, but Black's pieces are very active. The engine slightly prefers Black, but the position is rich for both sides.",
        },
      },
      {
        name: "Classical defence: 2...Bc5",
        moves: "1.e4 e5 2.f4 Bc5 3.Nf3 d6 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 O-O 9.Bd3",
        notes: {
          "2...Bc5": "Black declines the pawn and develops with an eye on g1 and f2.",
          "3.Nf3": "Develops and attacks the e5 pawn.",
          "3...d6": "Defends e5 solidly.",
          "4.c3": "Prepares d4 and takes the centre.",
          "5.d4": "Challenges the e5 pawn and builds a big centre.",
          "5...exd4": "Black opens the position.",
          "6.cxd4": "White recaptures with the c-pawn and keeps a strong centre.",
          "6...Bb4+": "A check to force a piece trade.",
          "7.Bd2": "Blocks the check.",
          "8.Nbxd2": "White develops the knight and keeps the centre.",
          "9.Bd3": "White has a strong pawn centre and a comfortable edge.",
        },
      },
      {
        name: "Falkbeer Countergambit: 2...d5",
        moves: "1.e4 e5 2.f4 d5 3.exd5 e4 4.d3 Nf6 5.dxe4 Nxe4 6.Nf3 Bc5 7.Qe2 Bf5 8.Nc3 Qe7 9.Be3",
        notes: {
          "2...d5": "The Falkbeer Countergambit: Black gives a pawn for active play.",
          "3.exd5": "Take the pawn.",
          "3...e4": "Black pushes the pawn, cramping White.",
          "4.d3": "Undermines the e4 pawn: the main line.",
          "4...Nf6": "Develops and prepares to defend e4.",
          "5.dxe4": "Take the pawn.",
          "5...Nxe4": "Black regains a pawn with a strong knight.",
          "6.Nf3": "Develops. Black's knight on e4 is strong, but White has the extra pawn.",
          "7.Qe2": "Attacks the knight on e4.",
          "8.Nc3": "Another developing move that increases the pressure on e4.",
          "9.Be3": "Challenges the dangerous bishop on c5. White is a pawn up and slightly better.",
        },
      },
    ],
  },
  {
    id: "jobava-london",
    title: "Jobava London",
    side: "white",
    level: "intermediate",
    eco: "D00",
    summary:
      "1.d4 d5 2.Nc3 Nf6 3.Bf4: a sharper cousin of the London System. The knight goes to c3 early, so Nb5 and the bishop on f4 can hit c7 and Black must be careful in the opening.",
    ideas: [
      "Nc3 and Bf4 both target c7: after Nb5 the pawn on c7 is attacked twice.",
      "Black's most natural-looking moves, such as ...Be7 in reply to c3, lose material to Nxc7+.",
      "Against passive set-ups, play e3, Nf3, Bd3 and h4 to build a kingside attack.",
      "Keep the bishop on f4 if you can; if Black trades it off, recapture with a plan.",
    ],
    style: "Attack",
    article: {
      whatIs:
        "The Jobava London is a sharper version of the London System that starts 1.d4 d5 2.Nc3 Nf6 3.Bf4. By putting the knight on c3 early, White threatens Nb5 and a double attack on c7. The result is a flexible, attacking set-up with a lot of traps for Black and very little theory.",
      howToReach:
        "Play 1.d4, and after 1...d5 2.Nc3 Nf6 continue 3.Bf4. Black has many options at this point, and the course covers the most common ones.",
      pros: [
        "Black must be careful about c7 from move three, which leads to many mistakes.",
        "Flexible: you can adapt your plan (e3 and Nf3, or h4 and Qd2) depending on Black's set-up.",
        "Much less theory than the main lines of the Queen's Gambit or King's Indian.",
        "Great for players who like attacking chess.",
        "Used by strong players to win games quickly.",
      ],
      cons: [
        "Black can equalise with solid play, such as ...e6, ...Na6 and ...Bd6.",
        "Without e3 or c3, the d4 pawn can come under pressure.",
        "The bishop on f4 can become a target for ...Nh5 or ...Bd6.",
        "You must remember the main tactical points; a careless Nb5 can backfire.",
      ],
      variations: [
        {
          name: "Main line with 3...e6",
          pgn: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6 4.Nb5 Bb4+ 5.c3 Ba5 6.e3 O-O 7.Nf3 Nh5 8.Bg5 f6 9.Bh4 c6 10.Na3",
          text:
            "White threatens Nxc7+ and gets a flexible position. Black must keep c7 covered: 5...Ba5 is correct, while the natural-looking 5...Be7? loses to 6.Nxc7+.",
        },
        {
          name: "Black hits d4 with 3...c5",
          pgn: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5 4.e3 cxd4 5.exd4 a6 6.Nf3 Nc6 7.Ne5 Bd7",
          text:
            "A direct reply. After e3 and exd4 White gets a good, simple position.",
        },
        {
          name: "Copycat 3...Bf5",
          pgn: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Bf5 4.e3 e6 5.Bd3 Bg6 6.h4 Bd6 7.h5 Bxd3 8.Qxd3",
          text:
            "Challenge the black bishop with Bd3, then gain time with h4-h5.",
        },
        {
          name: "Black fianchettoes with 3...g6",
          pgn: "1.d4 d5 2.Nc3 Nf6 3.Bf4 g6 4.Nb5 Na6 5.Nc3 Nh5 6.Be5 f6 7.Bg3",
          text:
            "The knight threat on c7 forces Black to put the knight on a6. Then White returns and keeps a pleasant game.",
        },
      ],
      againstIt:
        "Black's safest set-up is ...e6 with ...Bb4+ and ...Ba5, or ...Na6, to keep c7 covered. Others trade the dark-squared bishops with ...Bd6, push ...c5 to hit d4, or mirror White with ...Bf5. The key is never to forget c7.",
      plans: {
        white:
          "Use Nb5 and Bf4 to put pressure on c7, then complete development with e3, Nf3 and Bd3. If Black plays solidly, consider h4-h5 and a kingside attack.",
        black:
          "Keep c7 defended (...Na6, ...Bd6 or ...Qd7), develop with ...e6 and ...Be7, and hit the centre with ...c5. Trade White's f4 bishop when possible.",
      },
      history:
        "The set-up is associated with the Georgian grandmaster Baadur Jobava, who used 2.Nc3 and 3.Bf4 against 1...d5 so successfully that it became known as the Jobava London or Jobava Attack. It brought the London System to a new generation of attacking players.",
      faq: [
        {
          q: "What is the Jobava London?",
          a:
            "It's a version of the London System with an early Nc3 (1.d4 d5 2.Nc3 Nf6 3.Bf4), aiming for a sharp, attacking game rather than the quiet London structures.",
        },
        {
          q: "Is the Jobava London good for beginners?",
          a:
            "It's a fun attacking opening, but it requires you to know the tactics around c7 and the threats on the queenside. If you like to attack, it's a good choice for improving players.",
        },
        {
          q: "What is the best response to the Jobava London?",
          a:
            "A solid reply is 3...e6 followed by ...Bb4+ and ...Ba5 (or 4...Na6) to cover c7. 3...c5 is also popular, hitting d4 right away.",
        },
        {
          q: "What is the difference between the London and the Jobava London?",
          a:
            "The classical London keeps the knight on d2 and builds the c3-d4-e3 triangle. The Jobava London puts the knight on c3 and keeps the c-pawn flexible, leading to tactical play.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 5...Be7? 6.Nxc7+",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6 4.Nb5 Bb4+ 5.c3 Be7 6.Nxc7+ Kf8 7.Nxa8",
        notes: {
          "2.Nc3": "The Jobava set-up: the knight comes out before the c-pawn, so the c7 pawn becomes a target.",
          "3.Bf4": "The bishop eyes c7 and prepares the knight jump to b5.",
          "4.Nb5": "Attacks c7 twice (knight and bishop). Only the queen defends it.",
          "4...Bb4+": "Black gains a tempo with a check.",
          "5.c3": "Kicks the bishop away while keeping the knight on b5.",
          "5...Be7": "A natural retreat, but a blunder: the bishop no longer protects c7 (5...Ba5 was necessary).",
          "6.Nxc7+": "Forks the king and the rook on a8. Black can't take with the queen because Bxc7 wins it.",
          "6...Kf8": "The king has to move.",
          "7.Nxa8": "White wins the exchange and a pawn. The knight on a8 is a bit stuck, but White is clearly winning.",
        },
      },
      {
        name: "Main line vs 3...e6",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6 4.Nb5 Bb4+ 5.c3 Ba5 6.e3 O-O 7.Nf3 Nh5 8.Bg5 f6 9.Bh4 c6 10.Na3",
        notes: {
          "5...Ba5": "The right square: from a5 the bishop keeps guard over c7.",
          "6.e3": "Solid. White threatens nothing at once, but develops and prepares Nf3.",
          "6...O-O": "Castling is safe now that the bishop covers c7.",
          "7.Nf3": "Develops.",
          "7...Nh5": "Attacks the bishop on f4.",
          "8.Bg5": "Keeps the bishop on the board. (8.Bg3 Nxg3 hxg3 is also fine.)",
          "8...f6": "Kicks the bishop again.",
          "9.Bh4": "The bishop stays active.",
          "9...c6": "Attacks the knight on b5.",
          "10.Na3": "The knight retreats and heads for c2 or b1. The position is equal, and White keeps a flexible, easy-to-play structure.",
        },
      },
      {
        name: "Black covers c7 with 4...Na6",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6 4.Nb5 Na6 5.e3 Be7 6.Nf3 O-O 7.h4 c6 8.Nc3",
        notes: {
          "4...Na6": "Defends c7 at once. The knight is badly placed on the rim, but it is safe.",
          "5.e3": "Solid and flexible.",
          "5...Be7": "Develops.",
          "6.Nf3": "Develops.",
          "6...O-O": "Black castles. Because the Na6 covers c7, Nxc7 isn't a threat.",
          "7.h4": "A typical Jobava idea: advance the h-pawn to prepare h5, Ng5 and a kingside attack.",
          "7...c6": "Kicks the knight away from b5.",
          "8.Nc3": "The knight returns to c3. The position is balanced, and White has an easy attacking plan.",
        },
      },
      {
        name: "Black hits d4: 3...c5",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5 4.e3 cxd4 5.exd4 a6 6.Nf3 Nc6 7.Ne5 Bd7",
        notes: {
          "3...c5": "Black hits d4 immediately.",
          "4.e3": "Supports d4 and keeps the bishop on f4.",
          "4...cxd4": "Black opens the c-file.",
          "5.exd4": "A symmetrical structure; White's bishop is active on f4.",
          "5...a6": "Stops the knight from jumping to b5.",
          "6.Nf3": "Develops.",
          "7.Ne5": "The knight lands on a great central square. The position is equal, but White's pieces are well placed and the play is simple.",
        },
      },
      {
        name: "Black mirrors: 3...Bf5",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Bf5 4.e3 e6 5.Bd3 Bg6 6.h4 Bd6 7.h5 Bxd3 8.Qxd3",
        notes: {
          "3...Bf5": "Black copies White's set-up.",
          "4.e3": "Solid; White keeps all the options.",
          "5.Bd3": "Challenges Black's bishop and gains time.",
          "5...Bg6": "The bishop retreats.",
          "6.h4": "Threatens h5, winning more time and starting a kingside attack.",
          "7.h5": "Hits the bishop again.",
          "8.Qxd3": "White has gained space and enjoys a comfortable game with a small edge.",
        },
      },
      {
        name: "Black fianchettoes: 3...g6",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 g6 4.Nb5 Na6 5.Nc3 Nh5 6.Be5 f6 7.Bg3",
        notes: {
          "3...g6": "A flexible set-up.",
          "4.Nb5": "Again hits c7. Black must defend it with ...Na6.",
          "4...Na6": "Covers c7. The knight is misplaced on the edge.",
          "5.Nc3": "The knight returns, having forced the black knight to a poor square.",
          "5...Nh5": "Attacks the bishop on f4.",
          "6.Be5": "Keeps the bishop and eyes the long diagonal.",
          "6...f6": "Kicks the bishop.",
          "7.Bg3": "The bishop retreats to g3. If Black trades with ...Nxg3, White recaptures with the h-pawn and gets an open h-file. The position is balanced, with simple play for White.",
        },
      },
      {
        name: "Black develops: 3...Nc6",
        moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Nc6 4.Nb5 e5 5.Bxe5 Nxe5 6.dxe5 a6 7.Nc3",
        notes: {
          "3...Nc6": "Develops, but c7 is less protected than it looks.",
          "4.Nb5": "Threatens Nxc7+ forking king and rook.",
          "4...e5": "A counter-sacrifice that deflects the bishop.",
          "5.Bxe5": "White takes the pawn.",
          "5...Nxe5": "Black recaptures.",
          "6.dxe5": "White wins a pawn, and the e5 pawn attacks the knight on f6.",
          "6...a6": "Black gains a tempo against the knight on b5.",
          "7.Nc3": "The knight returns, keeping the extra pawn. Black has some activity, but White is better.",
        },
      },
    ],
  },
  {
    id: "english-opening",
    title: "English Opening (Fianchetto System)",
    side: "white",
    level: "intermediate",
    eco: "A10-A39",
    summary:
      "1.c4: a flexible flank opening. This course uses a single, simple system against everything: Nc3, g3, Bg2, Nf3, O-O, d3, then Rb1 and b4. It's a calm, strategic choice with very clear plans.",
    ideas: [
      "c4 and Nc3 take control of d5; the bishop on g2 adds pressure to the centre.",
      "Against 1...e5 you play a Sicilian with an extra tempo: the Reversed Sicilian.",
      "The typical plan is O-O, d3, Rb1 and a queenside pawn advance with a3 and b4.",
      "Be careful with the d5 knight trick: when Black plays ...Nxd5, the bishop on g2 and the knight on c3 attack it twice.",
    ],
    style: "System",
    article: {
      whatIs:
        "The English Opening begins 1.c4. Instead of occupying the centre with pawns, White controls it from the flank. This course teaches a single, simple system against nearly everything: Nc3, g3, Bg2, Nf3, O-O and d3, followed by Rb1 and a queenside pawn push. It is calm, strategic and easy to learn.",
      howToReach:
        "Play 1.c4. After 1...e5 continue 2.Nc3, and develop the kingside with g3, Bg2, Nf3 and O-O. Against 1...c5 or 1...Nf6 the plan is the same.",
      pros: [
        "One system for almost every reply: g3, Bg2, Nf3, O-O.",
        "A flexible pawn structure that can transpose into many popular openings.",
        "Against 1...e5 you get a Reversed Sicilian, with an extra tempo.",
        "Clear plans: Rb1 and b4, or d4 at the right moment.",
        "Used by world champions as a safe way to avoid heavy theory.",
      ],
      cons: [
        "White doesn't take the centre immediately, so Black has many options.",
        "The advantage is small, so you need good middlegame technique.",
        "Some Black set-ups can transpose to unfamiliar structures (Slav, KID, Queen's Gambit).",
        "The play can be slow, and some players prefer a more direct attack.",
      ],
      variations: [
        {
          name: "Reversed Sicilian with 1...e5",
          pgn: "1.c4 e5 2.Nc3 Nf6 3.g3 d5 4.cxd5 Nxd5 5.Bg2 Nb6 6.Nf3 Nc6 7.O-O Be7 8.a3 O-O 9.b4 Be6 10.Rb1",
          text:
            "The model line. White gets a Sicilian with an extra tempo and expands on the queenside with a3 and b4.",
        },
        {
          name: "Black pins with 3...Bb4",
          pgn: "1.c4 e5 2.Nc3 Nf6 3.g3 Bb4 4.Bg2 O-O 5.e4 d6 6.Nge2 Bg4",
          text:
            "White gets a strong centre with e4, backed by the knight on e2, and a comfortable position.",
        },
        {
          name: "Symmetrical English",
          pgn: "1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.Nf3 e6 6.O-O Nge7 7.d3 O-O 8.Rb1",
          text:
            "Both sides develop with fianchettoes. White's plan is Rb1, a3, b4 and Bd2.",
        },
        {
          name: "Black plays 1...Nf6",
          pgn: "1.c4 Nf6 2.Nc3 d5 3.cxd5 Nxd5 4.g3 e5 5.Nf3 Nc6 6.Bg2 Nb6 7.O-O",
          text:
            "Transposes to the Reversed Sicilian structure, with a flexible fianchetto set-up.",
        },
      ],
      againstIt:
        "Black's main options are 1...e5 (the Reversed Sicilian), 1...c5 (symmetrical), 1...Nf6 and the Slav/Queen's Gambit set-ups with ...c6 and ...e6. A good plan for Black is to take space in the centre with ...d5 early. Be careful to answer 1...e6 or 1...c6 by choosing a reasonable transposition.",
      plans: {
        white:
          "Develop with Nc3, g3, Bg2, Nf3 and O-O. Then play d3, Rb1, a3 and b4 to gain queenside space, or break with d4 when you're ready. Keep the bishop on g2 active.",
        black:
          "Challenge the centre with ...d5 or ...e5, develop naturally and try to keep your pieces flexible. Avoid being too passive.",
      },
      history:
        "The opening is named after the English master Howard Staunton, who used 1.c4 in his 1843 match against Pierre Saint-Amant. It became a mainstream choice in the 20th century, championed by Mikhail Botvinnik, and it is still widely used by grandmasters, including Garry Kasparov and Magnus Carlsen.",
      faq: [
        {
          q: "Is the English Opening good for beginners?",
          a:
            "Yes, as long as you follow a simple system. The ideas are strategic and easy to understand, and there is less memorisation than in the main lines of 1.e4.",
        },
        {
          q: "What is the best response to the English Opening?",
          a:
            "1...e5 and 1...c5 are the most common replies. 1...Nf6 and 1...e6 are flexible, and the Slav-style 1...c6 is solid.",
        },
        {
          q: "What is the Reversed Sicilian?",
          a:
            "It is the position arising after 1.c4 e5, where White is effectively playing the Sicilian Defence with an extra move. White's plan is to expand on the queenside with a3 and b4.",
        },
        {
          q: "Does the English Opening give White an advantage?",
          a:
            "A small one, as with most openings. The advantage is more about having a comfortable position with clear plans than a decisive edge.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 5...Nc6? 6.Nxd5",
        moves: "1.c4 e5 2.Nc3 Nf6 3.g3 d5 4.cxd5 Nxd5 5.Bg2 Nc6 6.Nxd5 Qxd5 7.Bxd5",
        notes: {
          "1.c4": "The English: White controls d5 from the flank.",
          "2.Nc3": "Puts another piece on d5.",
          "3.g3": "Prepares Bg2, putting the bishop on the long diagonal.",
          "3...d5": "Black strikes at the centre.",
          "4.cxd5": "Take the pawn.",
          "4...Nxd5": "Black recaptures, putting the knight in the centre.",
          "5.Bg2": "Attacks the knight a second time: it is attacked by Nc3 and Bg2.",
          "5...Nc6": "A natural developing move, but it forgets about the d5 knight, which is attacked twice and defended only once.",
          "6.Nxd5": "Wins a piece. Black can't recapture with the queen.",
          "6...Qxd5": "Natural, but it loses the queen.",
          "7.Bxd5": "The bishop wins the queen for a knight.",
        },
      },
      {
        name: "Main line: the Reversed Sicilian",
        moves: "1.c4 e5 2.Nc3 Nf6 3.g3 d5 4.cxd5 Nxd5 5.Bg2 Nb6 6.Nf3 Nc6 7.O-O Be7 8.a3 O-O 9.b4 Be6 10.Rb1",
        notes: {
          "5...Nb6": "The knight retreats to safety.",
          "6.Nf3": "Develops and hits e5.",
          "7.O-O": "The king is safe.",
          "8.a3": "Prepares b4 and takes b4 away from the black knight and bishop.",
          "9.b4": "The queenside expansion: this is a Sicilian with an extra tempo for White.",
          "10.Rb1": "Supports the b-pawn and prepares b5. White has a pleasant, risk-free small edge.",
        },
      },
      {
        name: "Black pins: 3...Bb4",
        moves: "1.c4 e5 2.Nc3 Nf6 3.g3 Bb4 4.Bg2 O-O 5.e4 d6 6.Nge2 Bg4",
        notes: {
          "3...Bb4": "Pins the knight on c3 and hits e4.",
          "4.Bg2": "Develops the bishop and prepares to castle.",
          "5.e4": "Takes the centre with e4 now that the bishop on b4 has been committed.",
          "6.Nge2": "Develops the second knight and covers the pinned knight on c3. The position is equal, and White has a flexible structure.",
        },
      },
      {
        name: "Black plays 2...Nc6",
        moves: "1.c4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nf3 Nge7 7.O-O O-O 8.Rb1 a5 9.a3",
        notes: {
          "2...Nc6": "A flexible move that heads for a Dragon-like set-up.",
          "5.d3": "Supports the centre and prepares Nf3 and O-O.",
          "7.O-O": "Castle and prepare Rb1.",
          "8.Rb1": "Prepares b4, the key plan in this structure.",
          "9.a3": "Supports b4. White has a safe, slightly better position with clear plans.",
        },
      },
      {
        name: "Symmetrical: 1...c5",
        moves: "1.c4 c5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.Nf3 e6 6.O-O Nge7 7.d3 O-O 8.Rb1 b6 9.Bd2 d5 10.a3 a5 11.Qc1",
        notes: {
          "1...c5": "The Symmetrical English: Black copies White.",
          "5.Nf3": "Develops.",
          "6.O-O": "Castle at once.",
          "7.d3": "Supports the centre and prepares Rb1.",
          "8.Rb1": "Prepares b4 and keeps the b-file for the rook.",
          "9.Bd2": "Develops the bishop. It can go to h6 later via c1.",
          "10.a3": "Prevents ...Nb4 and prepares b4.",
          "11.Qc1": "Eyes h6. The position is balanced, and White has a safe set-up.",
        },
      },
      {
        name: "Black plays 1...Nf6",
        moves: "1.c4 Nf6 2.Nc3 d5 3.cxd5 Nxd5 4.g3 e5 5.Bg2 Nb6 6.Nf3 Nc6 7.O-O",
        notes: {
          "1...Nf6": "Black waits and keeps options open.",
          "2.Nc3": "Develops and prepares g3.",
          "3.cxd5": "Take the pawn.",
          "3...Nxd5": "Black recaptures.",
          "4.g3": "Prepares Bg2, putting pressure on the knight on d5.",
          "5.Bg2": "Attacks the d5 knight a second time, so it has to move.",
          "6.Nf3": "After the knight retreats we have reached exactly the position of the main line.",
          "7.O-O": "White castles with a pleasant, flexible position.",
        },
      },
    ],
  },

  {
    id: "ponziani-opening",
    title: "Ponziani Opening",
    side: "white",
    level: "beginner",
    eco: "C44",
    summary:
      "1.e4 e5 2.Nf3 Nc6 3.c3: White prepares d4 to build a full pawn centre. It is an old, simple system with little theory and some neat traps (3...d5 4.Qa4! and the pinned knight), but objectively Black has several comfortable answers, so treat it as a practical weapon rather than an attempt to refute 1...e5.",
    ideas: [
      "3.c3 prepares d4, so that White gets the ideal pawn centre; Black must react at once with ...d5, ...Nf6 or ...f5.",
      "After 3...d5, 4.Qa4! pins the knight on c6 against the king; defending e5 with 4...Bd6? loses a piece to 5.exd5.",
      "Against 3...Nf6 4.d4 Nxe4 do not rush 5.d5 (5...Bc5! is awkward); 5.Bd3 keeps things equal and healthy.",
      "Do not expect an opening edge: the aim is a comfortable position with a clear plan and few lines to learn.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "The Ponziani Opening is 1.e4 e5 2.Nf3 Nc6 3.c3. White prepares to play d4 and take the full centre, and it avoids the heavy theory of the Ruy Lopez and the Italian. It is simple and flexible, but it also gives Black time, so with best play Black equalises comfortably.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6 and then 3.c3. If Black replies 3...Nf6, continue 4.d4. After 3...d5 use 4.Qa4, and after 3...f5 play 4.d4.",
      pros: [
        "Very little theory: c3 and d4 is the plan against nearly every reply.",
        "A flexible pawn centre with a safe king and natural development.",
        "Traps such as 3...d5 4.Qa4 Bd6? 5.exd5 catch careless opponents.",
        "Keeps the game balanced and gives you the initiative in the centre.",
        "It teaches the basics of the open centre: pawn tension, pins and piece activity.",
      ],
      cons: [
        "Objectively Black equalises or is slightly better with 3...d5 or 3...Nf6, so White has no advantage.",
        "3.c3 takes away the c3 square from the knight, which makes development less natural.",
        "Black can steer into Berlin-like or French-like positions where the extra tempo for Black is a real asset.",
        "The pawn thrust d4-d5 can overextend White if Black plays accurately.",
      ],
      variations: [
        {
          name: "3...d5 4.Qa4, the trap",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.c3 d5 4.Qa4 Bd6 5.exd5 Nf6 6.dxc6 bxc6 7.d3",
          text:
            "Black defends e5 the wrong way. The knight on c6 is pinned, so 5.exd5 wins it, and White emerges a piece up.",
        },
        {
          name: "3...d5 4.Qa4 Bd7",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.c3 d5 4.Qa4 Bd7 5.exd5 Nd4 6.Qd1 Nxf3+ 7.Qxf3 Nf6 8.Be2 Bd6 9.c4",
          text:
            "The correct defence. The queen has served its purpose, and the game is level, with plenty of play for both sides.",
        },
        {
          name: "3...Nf6 4.d4 Nxe4 5.Bd3",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 Nxe4 5.Bd3 d5 6.Nxe5 Nxe5 7.dxe5 Bc5 8.O-O O-O 9.Nd2 f5 10.c4",
          text:
            "The healthiest approach. Black has a strong central knight on e4, but White gets a good development and play for the pawn.",
        },
        {
          name: "3...Nf6 4.d4 exd4 5.e5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 exd4 5.e5 Ne4 6.Qe2 f5 7.exf6 d5 8.Nbd2 Qxf6 9.Nxe4 dxe4 10.Qxe4+ Be7",
          text:
            "A sharp line. White wins back material with a lead in development, but Black has the better pawn structure.",
        },
        {
          name: "3...d6 4.d4 Nf6 5.Bb5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.c3 d6 4.d4 Nf6 5.Bb5 a6 6.Bxc6+ bxc6 7.O-O exd4 8.cxd4 Be7 9.Qc2 Bd7 10.h3",
          text:
            "A Philidor-type position. White has the centre and the bishop pair, but Black's structure is solid.",
        },
      ],
      againstIt:
        "The soundest answers are 3...Nf6 4.d4 Nxe4 (trying to exploit the early d5 push), and 3...d5 4.Qa4 Bd7 5.exd5 Nd4. In both cases Black gets an equal game. Black should avoid 4...Bd6? or other moves that leave the c6 knight pinned.",
      plans: {
        white:
          "Build the centre with d4, develop with Bd3 or Bc4, and castle. Keep an eye on the pin on c6 when you play Qa4, and avoid pushing d5 too early, since it can leave pieces loose.",
        black:
          "Hit the centre immediately with ...d5 or ...Nf6, and recapture on d4 to get a free game. Be careful about the pin after Qa4, defend e5 with ...f6 or ...Bd7, and use the extra tempo for development.",
      },
      history:
        "The opening is named after Domenico Ponziani, an 18th-century Italian player and writer who analysed it. For a long time it was regarded as an inferior alternative to the Italian and Ruy Lopez because it gives Black time, and it is still not a top-level choice. It lives on as a straightforward system with few theoretical demands.",
      faq: [
        {
          q: "Is the Ponziani Opening good?",
          a:
            "It is playable and healthy, but it does not give White an opening advantage. Black has several comfortable ways to equalise, so it is best used as a low-theory system.",
        },
        {
          q: "What is the best response to the Ponziani?",
          a:
            "3...Nf6 4.d4 Nxe4 and 3...d5 4.Qa4 Bd7 are the most solid. Black must avoid 4...Bd6?, which loses a piece to the pin on c6.",
        },
        {
          q: "Why play 4.Qa4 against 3...d5?",
          a:
            "The queen pins the knight on c6 to the king along the diagonal and attacks the e5 pawn indirectly. Black has to play carefully, and 4...Bd7 or 4...f6 are the correct defences.",
        },
        {
          q: "Is the Ponziani better than the Italian?",
          a:
            "Not objectively: the Italian gives White more chances for an advantage. But the Ponziani needs less memorisation, which is why many club players enjoy it.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 3...d5 4.Qa4 Bd6? 5.exd5!",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 d5 4.Qa4 Bd6 5.exd5 Nf6 6.dxc6 bxc6 7.d3",
        notes: {
          "3.c3": "The Ponziani: White prepares d4 to take the full centre.",
          "3...d5": "Black hits the centre at once, and this is the most direct response.",
          "4.Qa4": "The queen pins the knight on c6 to the king, attacking the e5 pawn.",
          "4...Bd6": "A mistake: it defends e5 but leaves the pinned knight on c6 exposed.",
          "5.exd5": "The pawn attacks the pinned knight on c6, and Black cannot save it.",
          "5...Nf6": "Black develops, but the knight on c6 is lost.",
          "6.dxc6": "White wins a whole knight.",
          "6...bxc6": "Black recaptures a pawn.",
          "7.d3": "A solid move. White is a clean piece up.",
        },
      },
      {
        name: "3...d5 4.Qa4 Bd7: the main line",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 d5 4.Qa4 Bd7 5.exd5 Nd4 6.Qd1 Nxf3+ 7.Qxf3 Nf6 8.Be2 Bd6 9.c4",
        notes: {
          "4...Bd7": "The best defence: the bishop breaks the pin.",
          "5.exd5": "White takes a pawn, keeping the initiative.",
          "5...Nd4": "Black attacks the queen, a typical trick.",
          "6.Qd1": "The queen retreats to a safe square.",
          "6...Nxf3+": "Trades off the knight.",
          "7.Qxf3": "The queen is active again.",
          "7...Nf6": "Black develops and attacks the pawn on d5.",
          "8.Be2": "Develops and prepares to castle.",
          "8...Bd6": "Develops the bishop and eyes the kingside.",
          "9.c4": "Supports the pawn on d5 and gains space. The position is balanced.",
        },
      },
      {
        name: "3...Nf6 4.d4 Nxe4 5.Bd3",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 Nxe4 5.Bd3 d5 6.Nxe5 Nxe5 7.dxe5 Bc5 8.O-O O-O 9.Nd2 f5 10.c4",
        notes: {
          "3...Nf6": "Black attacks the e4 pawn at once.",
          "4.d4": "The point of c3: White takes the centre.",
          "4...Nxe4": "Black takes the pawn, giving White a choice.",
          "5.Bd3": "Attacks the knight on e4. This is safer than 5.d5, which runs into 5...Bc5!.",
          "5...d5": "Black protects the knight.",
          "6.Nxe5": "White takes the pawn and opens the position.",
          "6...Nxe5": "Black trades.",
          "7.dxe5": "White regains the centre.",
          "7...Bc5": "Develops with a threat on f2.",
          "8.O-O": "White castles to safety.",
          "8...O-O": "Black castles.",
          "9.Nd2": "Challenges the knight on e4.",
          "9...f5": "Black supports the knight on e4 and the e5 pawn is now fixed.",
          "10.c4": "White strikes at the centre. The position is roughly balanced.",
        },
      },
      {
        name: "3...Nf6 4.d4 exd4 5.e5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 exd4 5.e5 Ne4 6.Qe2 f5 7.exf6 d5 8.Nbd2 Qxf6 9.Nxe4 dxe4 10.Qxe4+ Be7",
        notes: {
          "4...exd4": "Black takes the pawn in the centre.",
          "5.e5": "White gains space and hits the knight on f6.",
          "5...Ne4": "The knight jumps to a strong centralised square.",
          "6.Qe2": "Attacks the knight on e4 and pins it against the queen's file.",
          "6...f5": "Black defends the knight.",
          "7.exf6": "White takes en passant.",
          "7...d5": "Black defends the knight and the centre.",
          "8.Nbd2": "Attacks the knight on e4 again.",
          "8...Qxf6": "Black recaptures and eyes the knight on f3.",
          "9.Nxe4": "White trades.",
          "9...dxe4": "Black recaptures.",
          "10.Qxe4+": "Check! White wins a pawn.",
          "10...Be7": "Black blocks the check. White is slightly better.",
        },
      },
      {
        name: "3...d6 4.d4 Nf6 5.Bb5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 d6 4.d4 Nf6 5.Bb5 a6 6.Bxc6+ bxc6 7.O-O exd4 8.cxd4 Be7 9.Qc2 Bd7 10.h3",
        notes: {
          "3...d6": "A solid Philidor-style reply.",
          "4.d4": "White takes the centre.",
          "4...Nf6": "Black attacks the e4 pawn.",
          "5.Bb5": "Pins the knight on c6 and prepares to castle.",
          "5...a6": "Black asks the bishop what it wants to do.",
          "6.Bxc6+": "White doubles Black's pawns.",
          "6...bxc6": "Black recaptures with the b-pawn.",
          "7.O-O": "White castles.",
          "7...exd4": "Black opens the centre.",
          "8.cxd4": "White recaptures with a good centre.",
          "8...Be7": "Black develops.",
          "9.Qc2": "Protects the e4 pawn.",
          "9...Bd7": "Black develops.",
          "10.h3": "White has a solid, slightly better position.",
        },
      },
      {
        name: "3...f5 4.d4 fxe4 5.Nxe5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 f5 4.d4 fxe4 5.Nxe5 Nf6 6.Nd2 Qe7 7.Nxc6 dxc6 8.Be2 Be6",
        notes: {
          "3...f5": "A sharp response that tries to play for an attack.",
          "4.d4": "White hits the centre.",
          "4...fxe4": "Black takes a pawn.",
          "5.Nxe5": "White takes the e5 pawn, with a powerful knight.",
          "5...Nf6": "Black develops and eyes the e4 pawn.",
          "6.Nd2": "Prepares to attack e4.",
          "6...Qe7": "Black pins the knight on e5 and defends the e4 pawn.",
          "7.Nxc6": "White trades off the strong knight.",
          "7...dxc6": "Black recaptures.",
          "8.Be2": "Develops with a solid position.",
          "8...Be6": "Black develops. White is slightly better.",
        },
      },
      {
        name: "3...Bc5 4.d4 exd4 5.cxd4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 Bc5 4.d4 exd4 5.cxd4 Bb4+ 6.Nc3 d5 7.exd5 Qxd5 8.Bd3 Qh5",
        notes: {
          "3...Bc5": "Black develops the bishop to attack f2.",
          "4.d4": "White hits the centre and forces the issue.",
          "4...exd4": "Black takes.",
          "5.cxd4": "White takes back and attacks the bishop.",
          "5...Bb4+": "A check that wins time.",
          "6.Nc3": "A good developing move.",
          "6...d5": "Black strikes at the centre.",
          "7.exd5": "White takes.",
          "7...Qxd5": "The queen is centralised, but White is ahead in development.",
          "8.Bd3": "Develops with a threat to castle.",
          "8...Qh5": "The queen avoids attack. White is slightly better.",
        },
      },
    ],
  },
  {
    id: "bishops-opening",
    title: "Bishop's Opening",
    side: "white",
    level: "beginner",
    eco: "C23-C24",
    summary:
      "1.e4 e5 2.Bc4: White develops the bishop first and keeps every option open. Against 2...Nf6 the calm 3.d3 gives a safe, flexible game, and Black's greedy 3...Nxe4? simply loses a piece. Against 2...Nc6 and 2...Bc5 White often transposes into quiet Italian-style set-ups.",
    ideas: [
      "2.Bc4 eyes f7 at once, and the bishop sits where it can't be harassed by ...d6 and ...Nf6 without a fight.",
      "3.d3 against 2...Nf6 is the safe move: it defends e4 and Black's 3...Nxe4? 4.dxe4 loses a piece.",
      "Delay Nf3 so that you can choose between f4, Nc3 and d4 depending on Black's setup.",
      "Many lines transpose to the Italian Game (Giuoco Pianissimo), so the plans you learn there apply here too.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "The Bishop's Opening starts 1.e4 e5 2.Bc4. White develops the bishop to its best diagonal and decides later how to place the knights and the f-pawn. It is flexible and has little forced theory, which makes it popular with players who want a healthy game without learning long lines.",
      howToReach:
        "Play 1.e4 e5 2.Bc4. Against 2...Nf6 continue 3.d3, against 2...Nc6 play 3.Nf3, and against 2...Bc5 play 3.Nf3 followed by c3.",
      pros: [
        "Very flexible: it can transpose into the Italian Game or become an independent system.",
        "Black's most natural replies, 2...Nf6 3.d3 Nxe4?, lose material.",
        "No long forced theory; mostly moves based on common sense (d3, Nf3, c3, O-O).",
        "It avoids the sharpest lines of the Two Knights and the Evans Gambit unless you want them.",
        "The move order gives you choices, so you can adapt to your opponent.",
      ],
      cons: [
        "White gets at most a tiny edge; Black has several equal systems.",
        "A slow d3-plan can look passive against ...d5, which Black can play early.",
        "Black can try 2...Nf6 3.d3 c6 4.Nf3 d5, reaching a comfortable Philidor-style structure.",
        "You do not get the instant attack of the Danish or the Vienna gambits.",
      ],
      variations: [
        {
          name: "Black grabs on e4",
          pgn: "1.e4 e5 2.Bc4 Nf6 3.d3 Nxe4 4.dxe4 Qh4 5.Qe2",
          text:
            "A typical greedy blunder. White simply recaptures and is a piece up, and the queen sortie on h4 is easily parried.",
        },
        {
          name: "3...c6 with ...d5",
          pgn: "1.e4 e5 2.Bc4 Nf6 3.d3 c6 4.Nf3 d5 5.Bb3 Bd6 6.Nc3 O-O 7.O-O dxe4 8.Nxe4 Nxe4 9.dxe4 Na6 10.Qe2 Nc5 11.Rd1",
          text:
            "Black builds a Philidor-style centre. White keeps the bishop pair and a healthy position, with a slight pull.",
        },
        {
          name: "2...Nc6 3.Nf3 Nf6 4.d3",
          pgn: "1.e4 e5 2.Bc4 Nc6 3.Nf3 Nf6 4.d3 Be7 5.Nc3 d6 6.a4 a5 7.O-O O-O 8.Re1 Nb4 9.h3",
          text:
            "A quiet Italian-style position. White's plan is to castle, play Re1 and then aim for a central break.",
        },
        {
          name: "2...Bc5 3.Nf3 d6 4.c3",
          pgn: "1.e4 e5 2.Bc4 Bc5 3.Nf3 d6 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5",
          text:
            "White builds a classical centre. After the bishops are traded, the pawn on d5 gives White a comfortable game.",
        },
      ],
      againstIt:
        "The most solid replies are 2...Nf6 3.d3 c6 4.Nf3 d5, or 2...Nc6 3.Nf3 Nf6 and 2...Bc5. Black must avoid 3...Nxe4? and play ...d5 or ...d6 at the right moment. If you play Black, aim for a Philidor-style or Italian-style setup and trade the bishop if needed.",
      plans: {
        white:
          "Develop with d3, Nf3, O-O and Re1, then decide: play c3 and d4, or push the f-pawn with f4 when the position allows. Keep an eye on a trade of your bishop and avoid weakening f2.",
        black:
          "Put a pawn on d5 or d6, develop the pieces naturally, and consider ...Bc5 or ...Be7 with ...O-O. Do not take on e4 without a clear reason, since the d-pawn recaptures.",
      },
      history:
        "The Bishop's Opening is one of the oldest ways of playing 1.e4 e5 and appears in some of the oldest chess books. It was popular in the 19th century and later often transposed to the Italian Game. Today it is mostly a flexible alternative used by players who like a low-theory system.",
      faq: [
        {
          q: "Is the Bishop's Opening good?",
          a:
            "Yes, it is a sound and flexible opening. It does not give White a big advantage, but it keeps lots of options and avoids heavy theory.",
        },
        {
          q: "What is the difference between the Bishop's Opening and the Italian?",
          a:
            "In the Italian Game the knight goes to f3 first; in the Bishop's Opening the bishop comes out first. Many lines transpose, but the Bishop's Opening gives White extra choices.",
        },
        {
          q: "Why does 2...Nf6 3.d3 Nxe4 lose a piece?",
          a:
            "After 4.dxe4 White has won a knight for a pawn. The queen sortie 4...Qh4 does not help because White can defend with 5.Qe2.",
        },
        {
          q: "Is the Bishop's Opening good for beginners?",
          a:
            "Yes. The ideas are simple (develop, castle, keep e4 safe), and the middlegame plans are easy to understand.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 3...Nxe4? 4.dxe4",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 Nxe4 4.dxe4 Qh4 5.Qe2",
        notes: {
          "2.Bc4": "The Bishop's Opening. The bishop eyes f7 and White keeps flexible.",
          "2...Nf6": "Black attacks the e4 pawn.",
          "3.d3": "Defends e4 solidly and opens the bishop on c1.",
          "3...Nxe4": "A common mistake: the d3 pawn protects e4, so this just loses a piece.",
          "4.dxe4": "White wins a knight for a pawn.",
          "4...Qh4": "Black hopes for a trap with ...Qxe4+ and ...Qxf2+.",
          "5.Qe2": "A calm defence: the queen covers e4 and f2, and White stays a piece up.",
        },
      },
      {
        name: "Main line: 3...c6 with ...d5",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 c6 4.Nf3 d5 5.Bb3 Bd6 6.Nc3 O-O 7.O-O dxe4 8.Nxe4 Nxe4 9.dxe4 Na6 10.Qe2 Nc5 11.Rd1",
        notes: {
          "3...c6": "Prepares ...d5 with a Philidor-style structure.",
          "4.Nf3": "Develops and attacks the e5 pawn.",
          "4...d5": "Black strikes at the centre.",
          "5.Bb3": "Keeps the bishop on the a2-g8 diagonal and avoids ...d4.",
          "5...Bd6": "Develops the bishop and defends e5.",
          "6.Nc3": "Develops and adds pressure to the centre.",
          "6...O-O": "Black castles.",
          "7.O-O": "White castles too.",
          "7...dxe4": "Black clarifies the centre.",
          "8.Nxe4": "White takes with the knight.",
          "8...Nxe4": "Black trades.",
          "9.dxe4": "White recaptures with the pawn and opens the d-file.",
          "9...Na6": "The knight heads for c5.",
          "10.Qe2": "Supports the e4 pawn and prepares Rd1.",
          "10...Nc5": "Black attacks the bishop on b3.",
          "11.Rd1": "White takes the open d-file. The position is balanced.",
        },
      },
      {
        name: "3...Be7 4.Nf3 c6",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 Be7 4.Nf3 c6 5.O-O Qc7 6.Re1 O-O 7.Bb3 d6 8.h3 Nbd7 9.Be3",
        notes: {
          "3...Be7": "A solid move that prepares castling.",
          "4.Nf3": "Develops.",
          "4...c6": "Prepares ...d5 or ...d6.",
          "5.O-O": "White castles.",
          "5...Qc7": "Supports the e5 pawn and the centre.",
          "6.Re1": "Defends e4 and supports a later d4.",
          "6...O-O": "Black castles.",
          "7.Bb3": "Keeps the bishop safe from ...d5.",
          "7...d6": "Black builds a solid structure.",
          "8.h3": "Stops ...Bg4 and ...Ng4.",
          "8...Nbd7": "Develops.",
          "9.Be3": "White develops. The game is balanced and quiet.",
        },
      },
      {
        name: "3...Nc6 4.Nf3 Bc5",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 Nc6 4.Nf3 Bc5 5.Nc3 a6 6.a3 d6 7.Ba2 h6 8.O-O",
        notes: {
          "3...Nc6": "Develops and defends e5.",
          "4.Nf3": "Develops and attacks the e5 pawn.",
          "4...Bc5": "Black develops the bishop.",
          "5.Nc3": "Develops and prepares a3.",
          "5...a6": "Prevents Nb5 and Bb5.",
          "6.a3": "Stops ...Bb4 and prepares b4.",
          "6...d6": "Supports e5.",
          "7.Ba2": "Keeps the bishop on the a2-g8 diagonal.",
          "7...h6": "Prevents Bg5.",
          "8.O-O": "White castles with a calm position.",
        },
      },
      {
        name: "3...Bc5 4.Nf3 d6",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 Bc5 4.Nf3 d6 5.c3 O-O 6.O-O Bb6 7.a4 c6 8.Re1",
        notes: {
          "3...Bc5": "A natural developing move.",
          "4.Nf3": "Develops and attacks e5.",
          "4...d6": "Supports e5.",
          "5.c3": "Prepares d4 and gives the bishop a retreat.",
          "5...O-O": "Black castles.",
          "6.O-O": "White castles.",
          "6...Bb6": "The bishop avoids d4.",
          "7.a4": "Threatens a5 to trap the bishop.",
          "7...c6": "Prepares ...a5 or ...d5.",
          "8.Re1": "Supports the centre. A pleasant Italian-style position.",
        },
      },
      {
        name: "3...d5 4.exd5 Nxd5",
        moves: "1.e4 e5 2.Bc4 Nf6 3.d3 d5 4.exd5 Nxd5 5.Nf3 Nc6 6.O-O Bc5 7.d4 exd4 8.Re1+ Nce7 9.Nbd2",
        notes: {
          "3...d5": "Black strikes at the centre immediately.",
          "4.exd5": "White takes a pawn and opens the e-file.",
          "4...Nxd5": "Black recaptures and attacks the bishop on c4.",
          "5.Nf3": "Develops.",
          "5...Nc6": "Develops and attacks the knight.",
          "6.O-O": "White castles.",
          "6...Bc5": "Black develops the bishop.",
          "7.d4": "White hits the centre at the right time.",
          "7...exd4": "Black takes the pawn.",
          "8.Re1+": "Check! White uses the open e-file.",
          "8...Nce7": "Black blocks the check.",
          "9.Nbd2": "Develops. White has a lead in development and a small edge.",
        },
      },
      {
        name: "2...Nc6 3.Nf3 Nf6 4.d3",
        moves: "1.e4 e5 2.Bc4 Nc6 3.Nf3 Nf6 4.d3 Be7 5.Nc3 d6 6.a4 a5 7.O-O O-O 8.Re1 Nb4 9.h3",
        notes: {
          "2...Nc6": "Black develops and defends e5.",
          "3.Nf3": "Develops and attacks e5.",
          "3...Nf6": "Black attacks the e4 pawn.",
          "4.d3": "A calm move that defends e4 and keeps the position closed.",
          "4...Be7": "Black prepares to castle.",
          "5.Nc3": "Develops.",
          "5...d6": "Supports e5.",
          "6.a4": "Stops ...b5 and gains space.",
          "6...a5": "Black stops the push.",
          "7.O-O": "White castles.",
          "7...O-O": "Black castles.",
          "8.Re1": "Supports the centre.",
          "8...Nb4": "The knight looks for activity.",
          "9.h3": "Stops ...Bg4 and keeps the position balanced.",
        },
      },
      {
        name: "2...Bc5 3.Nf3 d6 4.c3",
        moves: "1.e4 e5 2.Bc4 Bc5 3.Nf3 d6 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5",
        notes: {
          "2...Bc5": "Black mirrors White's development.",
          "3.Nf3": "Develops and attacks e5.",
          "3...d6": "Supports e5.",
          "4.c3": "Prepares d4 to take the centre.",
          "4...Nf6": "Develops and attacks e4.",
          "5.d4": "White strikes at the centre.",
          "5...exd4": "Black takes.",
          "6.cxd4": "White recaptures and attacks the bishop.",
          "6...Bb4+": "Black checks.",
          "7.Bd2": "Blocks the check.",
          "7...Bxd2+": "Black trades.",
          "8.Nbxd2": "White recaptures.",
          "8...d5": "Black strikes at the centre.",
          "9.exd5": "White has a slightly better position, with the more active pieces.",
        },
      },
      {
        name: "2...Bc5 3.Nf3 Nc6 4.c3",
        moves: "1.e4 e5 2.Bc4 Bc5 3.Nf3 Nc6 4.c3 Nf6 5.d4 exd4 6.O-O d6 7.cxd4 Bb6 8.d5 Ne5 9.Nxe5",
        notes: {
          "3...Nc6": "Develops and defends e5.",
          "4.c3": "Prepares d4, with a good centre.",
          "4...Nf6": "Attacks the e4 pawn.",
          "5.d4": "White strikes in the centre.",
          "5...exd4": "Black takes.",
          "6.O-O": "White castles and offers the pawn back in exchange for a lead in development.",
          "6...d6": "Black refuses the pawn and develops.",
          "7.cxd4": "White recaptures with a centre pawn.",
          "7...Bb6": "The bishop retreats from the attack.",
          "8.d5": "White gains space and attacks the knight.",
          "8...Ne5": "The knight goes to a strong square.",
          "9.Nxe5": "White trades. The position is balanced.",
        },
      },
    ],
  },
  {
    id: "smith-morra-gambit",
    title: "Smith-Morra Gambit",
    side: "white",
    level: "intermediate",
    eco: "B21",
    summary:
      "1.e4 c5 2.d4 cxd4 3.c3: White sacrifices a pawn for quick development, open lines and an easy attack. Objectively the gambit is roughly equal to slightly dubious (engines see Black fine with best play), but Black has many ways to go wrong, and the declines 3...Nf6 and 3...d3 are easy to handle.",
    ideas: [
      "After 3...dxc3 4.Nxc3 White has a lead in development: Bc4, Nf3, O-O, Qe2 and Rd1 put pieces on open lines against the Black king.",
      "Aim at the d-file and the e5/f7 squares; Nd5 and e5 are the typical tactical breaks.",
      "Decline wisely: 3...Nf6 4.e5! Nd5 5.cxd4 gets a free-flowing game, and 3...d3 4.Bxd3 gives a quick lead in development.",
      "Be honest: if Black keeps accurate, defends calmly and trades pieces, White is simply a pawn down, so play for pressure, not tricks.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Smith-Morra Gambit starts 1.e4 c5 2.d4 cxd4 3.c3. White offers a pawn, and after 3...dxc3 4.Nxc3 White trades it for rapid development, open lines and chances against the king. It avoids the vast Sicilian theory and sets practical problems, though objectively Black can defend.",
      howToReach:
        "Play 1.e4 c5 2.d4 cxd4 3.c3. If Black accepts with 3...dxc3, continue 4.Nxc3 Nc6 5.Nf3 and follow with Bc4, O-O and Qe2. If Black declines, use the lines below.",
      pros: [
        "Avoids the huge main-line Sicilian theory: one move order for nearly all Black replies.",
        "Fast development and open lines; natural plans with Bc4, O-O, Qe2 and Rd1.",
        "Black has many ways to go wrong, such as 3...Nf6 4.e5 Ne4? 5.Qxd4.",
        "Many Sicilian players have little experience against it, so the practical results are good.",
        "Teaches how to play with an initiative and how to use open files.",
      ],
      cons: [
        "Objectively Black is fine with careful play, so you have to prove the compensation.",
        "If Black consolidates with ...d6, ...e6 and ...Nf6, White has only a small initiative left.",
        "Some declines (3...d5, 3...e6) give a normal position where the gambit is just a Sicilian without an extra pawn.",
        "You must be willing to play without the pawn for a long time.",
      ],
      variations: [
        {
          name: "Main line: 5...d6 6.Bc4 e6",
          pgn: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 Nc6 5.Nf3 d6 6.Bc4 e6 7.O-O Nf6 8.Qe2 Be7 9.Rd1 Bd7 10.Bf4 e5 11.Bg5 Bg4 12.Bxf6 Bxf6 13.Qd3 O-O",
          text:
            "The classical set-up. White has an easy plan, but Black can reach a solid position, and engines see the game as nearly equal.",
        },
        {
          name: "3...Nf6 4.e5 Nd5",
          pgn: "1.e4 c5 2.d4 cxd4 3.c3 Nf6 4.e5 Nd5 5.cxd4 d6 6.Nf3 Nc6 7.Bc4 Nb6 8.Bb3 dxe5 9.Nxe5 Nxe5 10.dxe5 Qxd1+ 11.Bxd1 Bd7",
          text:
            "The standard way to meet the Nf6 decline. White has a lead in development and a good space advantage.",
        },
        {
          name: "3...Nf6 4.e5 Ne4? 5.Qxd4",
          pgn: "1.e4 c5 2.d4 cxd4 3.c3 Nf6 4.e5 Ne4 5.Qxd4 f5 6.f3 Nc6 7.Qe3 d5 8.fxe4 dxe4 9.Qg3",
          text:
            "The knight jumped to a dead-end square. The queen takes on d4, the knight is attacked twice, and White wins a piece.",
        },
        {
          name: "3...d5 4.exd5 Qxd5 5.cxd4",
          pgn: "1.e4 c5 2.d4 cxd4 3.c3 d5 4.exd5 Qxd5 5.cxd4 Nc6 6.Nf3 Bg4 7.Be2 e6 8.O-O Nf6 9.Nc3 Qa5 10.Be3 Be7 11.h3",
          text:
            "A normal, open position in which White is a tempo ahead in development. Nothing special, but fully playable.",
        },
        {
          name: "3...e6 4.cxd4 d5 5.e5",
          pgn: "1.e4 c5 2.d4 cxd4 3.c3 e6 4.cxd4 d5 5.e5 Nc6 6.Nf3 Nge7 7.Na3 Bd7 8.Nc2 f6 9.Bd3",
          text:
            "A French-style position that White plays without any gambit risks; the knight goes to c2 to support d4.",
        },
      ],
      againstIt:
        "Black's soundest reply is simply to accept with 3...dxc3 4.Nxc3 Nc6 5.Nf3 and then play ...d6 and ...e6 or ...a6, trade pieces and blunt the attack. Declining with 3...Nf6 4.e5 Nd5 or 3...d5 4.exd5 Qxd5 also works, but then White gets an easy game. The danger for Black is greed and passivity: ignoring development in the opening costs more than a pawn.",
      plans: {
        white:
          "Develop quickly: Nc3, Nf3, Bc4, O-O, Qe2 and Rd1, then aim for e5 or Nd5 at the right moment. Be happy to play for pressure and avoid committing pieces too early.",
        black:
          "Accept the pawn, develop the pieces naturally with ...Nc6, ...d6, ...e6 and ...Nf6, and trade the active white pieces. Close the lines near the king and stay a pawn up.",
      },
      history:
        "The gambit is named after Pierre Morra and Ben Smith, two players who championed 3.c3 in the 20th century. It has long been popular at club level because it avoids the heavy theory of the Open Sicilian. Strong players have also used it as a surprise weapon, though it is rarely seen in elite games.",
      faq: [
        {
          q: "Is the Smith-Morra Gambit good?",
          a:
            "Objectively Black can hold with good defence, so it is not a way to refute the Sicilian. But the gambit is playable, avoids vast theory, and gives White plenty of practical chances.",
        },
        {
          q: "Should Black accept the Smith-Morra Gambit?",
          a:
            "Yes, accepting with 3...dxc3 4.Nxc3 Nc6 5.Nf3 and then ...d6 or ...e6 is the most solid. Careful defence and piece trades are the best antidote.",
        },
        {
          q: "How do I play against 3...Nf6?",
          a:
            "Play 4.e5, which forces the knight to move. After 4...Nd5 recapture on d4 with 5.cxd4; 4...Ne4? is a blunder because of 5.Qxd4.",
        },
        {
          q: "What if Black declines with 3...d3?",
          a:
            "Take the pawn with 4.Bxd3 and develop with Nf3, Qe2 and O-O. White has an easy lead in development, though Black is still safe.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 3...Nf6 4.e5 Ne4? 5.Qxd4",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 Nf6 4.e5 Ne4 5.Qxd4 f5 6.f3 Nc6 7.Qe3 d5 8.fxe4 dxe4 9.Qg3",
        notes: {
          "3.c3": "The Smith-Morra Gambit: White offers a pawn for quick development.",
          "3...Nf6": "Black declines the pawn and attacks e4.",
          "4.e5": "Attacks the knight and gains space.",
          "4...Ne4": "A mistake: the knight steps into a trap.",
          "5.Qxd4": "White takes the pawn back with a double attack on the knight.",
          "5...f5": "Black defends the knight with a pawn, but weakens the king.",
          "6.f3": "Attacks the knight again; Black cannot hold it.",
          "6...Nc6": "Black counterattacks the queen.",
          "7.Qe3": "The queen retreats, keeping the pressure.",
          "7...d5": "Black adds a defender to the knight.",
          "8.fxe4": "White takes the knight.",
          "8...dxe4": "Black recaptures with the pawn.",
          "9.Qg3": "White is a piece up for a pawn.",
        },
      },
      {
        name: "Main line: 5...d6 6.Bc4 e6",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 Nc6 5.Nf3 d6 6.Bc4 e6 7.O-O Nf6 8.Qe2 Be7 9.Rd1 Bd7 10.Bf4 e5 11.Bg5 Bg4 12.Bxf6 Bxf6 13.Qd3 O-O",
        notes: {
          "3...dxc3": "Black accepts the gambit pawn.",
          "4.Nxc3": "White recaptures with development. The pawn is the price of a lead in development.",
          "4...Nc6": "Black develops.",
          "5.Nf3": "Develops with the idea of Bc4.",
          "5...d6": "Black prepares ...e6 and supports the centre.",
          "6.Bc4": "The bishop eyes f7 and the h1-a8 diagonal.",
          "6...e6": "Closes the diagonal for the bishop and prepares ...Nf6.",
          "7.O-O": "White castles to bring the rook into play.",
          "7...Nf6": "Develops and attacks the e4 pawn.",
          "8.Qe2": "Defends e4 and prepares Rd1.",
          "8...Be7": "Black prepares to castle.",
          "9.Rd1": "The rook takes the open file against the queen's side.",
          "9...Bd7": "Develops the last minor piece.",
          "10.Bf4": "The bishop eyes d6 and e5.",
          "10...e5": "Black attacks the bishop.",
          "11.Bg5": "Pins the knight on f6 against the bishop on e7.",
          "11...Bg4": "Black counter-pins the knight on f3.",
          "12.Bxf6": "White removes a defender of the centre.",
          "12...Bxf6": "Black recaptures.",
          "13.Qd3": "A good square for the queen. Black has a solid position, and the game is about level.",
        },
      },
      {
        name: "Accepted: 5...e6 6.Bc4 a6",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 Nc6 5.Nf3 e6 6.Bc4 a6 7.O-O Nge7 8.Bb3 b5 9.a4 b4 10.Nd5 Na5 11.Ba2",
        notes: {
          "5...e6": "A common alternative to ...d6.",
          "6.Bc4": "Develops and eyes f7.",
          "6...a6": "Prepares ...b5 to drive the bishop back.",
          "7.O-O": "White castles.",
          "7...Nge7": "Develops while keeping the pawn on f7 protected.",
          "8.Bb3": "Keeps the bishop on the diagonal.",
          "8...b5": "Black gains space on the queenside.",
          "9.a4": "Attacks the pawn chain.",
          "9...b4": "Black chases the knight.",
          "10.Nd5": "A typical Morra sacrifice-like jump: the knight takes a strong post.",
          "10...Na5": "Black attacks the bishop.",
          "11.Ba2": "The bishop keeps the long diagonal. The position is balanced.",
        },
      },
      {
        name: "3...Nf6 4.e5 Nd5",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 Nf6 4.e5 Nd5 5.cxd4 d6 6.Nf3 Nc6 7.Bc4 Nb6 8.Bb3 dxe5 9.Nxe5 Nxe5 10.dxe5 Qxd1+ 11.Bxd1 Bd7",
        notes: {
          "4...Nd5": "The best retreat.",
          "5.cxd4": "White recaptures and has a big centre.",
          "5...d6": "Black attacks the e5 pawn.",
          "6.Nf3": "Develops and defends e5.",
          "6...Nc6": "Adds pressure to the d4 and e5 pawns.",
          "7.Bc4": "Attacks the knight on d5.",
          "7...Nb6": "The knight retreats and attacks the bishop.",
          "8.Bb3": "The bishop retreats, staying on the diagonal.",
          "8...dxe5": "Black takes.",
          "9.Nxe5": "White recaptures with a strong knight.",
          "9...Nxe5": "Black trades.",
          "10.dxe5": "White recaptures with a pawn on e5.",
          "10...Qxd1+": "Black trades queens.",
          "11.Bxd1": "White recaptures. The position is roughly balanced.",
        },
      },
      {
        name: "3...d5 4.exd5 Qxd5",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 d5 4.exd5 Qxd5 5.cxd4 Nc6 6.Nf3 Bg4 7.Be2 e6 8.O-O Nf6 9.Nc3 Qa5 10.Be3 Be7 11.h3",
        notes: {
          "3...d5": "Black strikes at the centre, a standard decline.",
          "4.exd5": "White takes the pawn.",
          "4...Qxd5": "Black recaptures and the queen is active.",
          "5.cxd4": "White regains the pawn.",
          "5...Nc6": "Black develops and attacks the d4 pawn.",
          "6.Nf3": "Develops and defends d4.",
          "6...Bg4": "Pins the knight.",
          "7.Be2": "Develops and unpins.",
          "7...e6": "Black supports the centre.",
          "8.O-O": "White castles.",
          "8...Nf6": "Develops.",
          "9.Nc3": "Hits the queen.",
          "9...Qa5": "The queen moves.",
          "10.Be3": "Develops.",
          "10...Be7": "Black prepares to castle.",
          "11.h3": "White asks the bishop what it wants to do. The position is level.",
        },
      },
      {
        name: "3...d3 4.Bxd3",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 d3 4.Bxd3 Nc6 5.Nf3 e5 6.Qe2 Be7 7.O-O Nf6 8.Rd1 O-O 9.h3 Re8",
        notes: {
          "3...d3": "Black keeps the pawn for a moment by pushing it, a decline.",
          "4.Bxd3": "White takes the pawn and has an easy lead in development.",
          "4...Nc6": "Develops.",
          "5.Nf3": "Develops.",
          "5...e5": "Black takes space in the centre.",
          "6.Qe2": "Develops and supports e4.",
          "6...Be7": "Black prepares to castle.",
          "7.O-O": "White castles.",
          "7...Nf6": "Develops.",
          "8.Rd1": "Takes the open file.",
          "8...O-O": "Black castles.",
          "9.h3": "Stops ...Bg4.",
          "9...Re8": "Black defends. The game is balanced.",
        },
      },
      {
        name: "3...e6 4.cxd4 d5 5.e5",
        moves: "1.e4 c5 2.d4 cxd4 3.c3 e6 4.cxd4 d5 5.e5 Nc6 6.Nf3 Nge7 7.Na3 Bd7 8.Nc2 f6 9.Bd3",
        notes: {
          "3...e6": "Black declines quietly, heading for a French-style position.",
          "4.cxd4": "White takes back and has a strong centre.",
          "4...d5": "Black strikes at the centre.",
          "5.e5": "White gains space.",
          "5...Nc6": "Black attacks d4.",
          "6.Nf3": "Develops and defends d4.",
          "6...Nge7": "Develops.",
          "7.Na3": "Heads for c2 to support d4 and avoid blocking the c-pawn.",
          "7...Bd7": "Develops.",
          "8.Nc2": "The knight supports d4.",
          "8...f6": "Black attacks the e5 pawn.",
          "9.Bd3": "Develops. White has a pleasant space advantage.",
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
    style: "Solid",
    article: {
      whatIs:
        "The Caro-Kann Defence starts 1.e4 c6 and follows with ...d5. By preparing the central strike with ...c6, Black supports the d5 pawn and keeps the c8 bishop free to develop outside the pawn chain before playing ...e6. It is solid and reliable, with a healthy pawn structure and good endgames.",
      howToReach:
        "Play 1.e4 c6 2.d4 d5. Then 3.Nc3 dxe4 4.Nxe4 Bf5 is the Classical Variation, 3.e5 Bf5 the Advance, and 3.exd5 cxd5 the Exchange.",
      pros: [
        "A solid pawn structure with no real weaknesses.",
        "The c8 bishop gets out before ...e6, which solves the French Defence's main problem.",
        "Clear plans in all the main lines, and the theory is manageable.",
        "Very good endgames: Black's structure is healthy.",
        "Fewer early tactics than in sharper defences, so it suits players who like to stay safe.",
      ],
      cons: [
        "It can feel passive, and White often has more space.",
        "White has aggressive options, such as the Fantasy (3.f3), the Panov attack (4.c4) and the Advance with h4.",
        "Black has fewer winning attempts, and some positions are drawish.",
        "You must know a few traps (for example the smothered mate with Nd6#).",
      ],
      variations: [
        {
          name: "Classical Variation 4...Bf5",
          pgn: "1.e4 c6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5 5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3 e6",
          text:
            "The main line. Black develops the bishop actively, retreats it with ...Bg6 and ...Bh7, then trades off White's attacking bishop.",
        },
        {
          name: "Advance Variation",
          pgn: "1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nf3 e6 5.Be2 c5 6.Be3 cxd4 7.Nxd4 Ne7",
          text:
            "White gains space, but Black strikes at the base of the chain with ...c5 and develops the bishop first.",
        },
        {
          name: "Exchange Variation",
          pgn: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.Bd3 Nc6 5.c3 Nf6 6.Bf4 Bg4 7.Qb3 Qd7 8.Nd2 e6",
          text:
            "A symmetrical structure. Black develops actively and plans a minority attack with ...b5-b4.",
        },
        {
          name: "Panov-Botvinnik Attack",
          pgn: "1.e4 c6 2.d4 d5 3.exd5 cxd5 4.c4 Nf6 5.Nc3 e6 6.Nf3 Bb4 7.cxd5 Nxd5 8.Bd2 Nc6",
          text:
            "White accepts an isolated queen's pawn for activity. Black pins the knight and blockades d5.",
        },
      ],
      againstIt:
        "White's typical tries are the Advance (3.e5), the Panov-Botvinnik Attack (4.c4), the Exchange, the Two Knights (2.Nf3 and 2.Nc3) and the Fantasy (3.f3). Aggressive players also try Bd3 and h4 ideas. Watch out for tricks like Qe2 followed by Nd6# in the 4...Nd7 line.",
      plans: {
        white:
          "Use your space in the Advance with Nf3, Be2 and c3, support the pawn on d4 and prepare a kingside attack. In the Panov, play for activity against the isolated queen's pawn. Against the Classical, go for h4-h5 to chase the bishop.",
        black:
          "Bring the light-squared bishop out first (...Bf5 or ...Bg4), then play ...e6, ...Nd7 and ...Ngf6. Against the Advance use ...c5 and ...Nc6; against the Exchange expand with ...Bg4 and a queenside minority attack.",
      },
      history:
        "The opening is named after the English player Horatio Caro and the Austrian Marcus Kann, who analysed it together in 1886. It later became a favourite of strong players such as Capablanca, Petrosian and Karpov, who valued its solidity and strategic depth.",
      faq: [
        {
          q: "Is the Caro-Kann good for beginners?",
          a:
            "Yes. It has clear plans, a solid structure and relatively little forced theory. It's a good choice if you want a safe, dependable reply to 1.e4.",
        },
        {
          q: "What is the best response to the Caro-Kann Advance?",
          a:
            "Play 3...Bf5 followed by ...e6, ...c5 and ...Ne7-c6 to attack the pawn chain. The Short System with Nf3, Be2 and Be3 is the most popular White choice.",
        },
        {
          q: "Is the Caro-Kann better than the French?",
          a:
            "They are similar in spirit, but the Caro-Kann lets the light-squared bishop develop freely, which is why many players find it easier to play. The French gives Black more counterplay but a worse bishop.",
        },
        {
          q: "Is the Caro-Kann drawish?",
          a:
            "It can lead to quiet positions, but White has sharp options such as the Fantasy and the Panov, and Black can play for a win with the right choices.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: Fantasy 6.g3? Qxe4+",
        moves: "1.e4 c6 2.d4 d5 3.f3 dxe4 4.fxe4 e5 5.dxe5 Qh4+ 6.g3 Qxe4+ 7.Qe2 Qxh1",
        notes: {
          "3.f3": "The Fantasy Variation: White supports e4 but weakens the king's diagonal.",
          "5.dxe5": "A natural capture, but it opens the d-file and leaves the king short of cover.",
          "5...Qh4+": "Check! The queen also attacks the pawn on e4.",
          "6.g3": "A natural block that loses to a fork. 6.Kd2 or 6.Ke2 were safer, though Black is still better.",
          "6...Qxe4+": "Check, and the rook on h1 is attacked at the same time.",
          "7.Qe2": "Blocks the check. 7.Be2 and 7.Ne2 also lose the rook.",
          "7...Qxh1": "Black wins a rook. White has some compensation in development, but a whole rook is too much.",
        },
      },
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
    style: "Classical",
    article: {
      whatIs:
        "1...e5 meets 1.e4 by claiming the centre immediately. The result is an open game, with quick development, plenty of tactics and clear plans. This course gives a reliable reply to each of White's popular tries: the Italian Game, the Ruy Lopez (via the Berlin), the Scotch, the Vienna, the King's Gambit, the Centre Game and the Ponziani. It also shows how to stop Scholar's Mate.",
      howToReach:
        "Answer 1.e4 with 1...e5. After 2.Nf3 Nc6 choose 3...Bc5 against the Italian Bc4 and 3...Nf6 (the Berlin) against the Ruy Lopez.",
      pros: [
        "It fights for the centre directly, in line with the opening principles.",
        "Open positions teach you tactics and good piece play.",
        "Classical, well-studied structures with plenty of resources for Black.",
        "A wide choice of replies later on (Italian, Ruy Lopez, Scotch) so you can grow the repertoire.",
        "Good practical chances against inexperienced opponents who fall for early traps.",
      ],
      cons: [
        "White has many choices, so you must prepare answers to Ruy Lopez, Italian, Scotch and several gambits.",
        "The Berlin Defence can lead to queenless endgames that feel passive.",
        "Open positions punish mistakes quickly.",
        "Some White gambits (Evans, King's Gambit) require specific knowledge.",
      ],
      variations: [
        {
          name: "Italian: Giuoco Piano with 5.d4",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.e5 d5 7.Bb5 Ne4 8.cxd4 Bb6",
          text:
            "White opens the centre. The key reply is 6...d5, hitting the bishop and putting a knight on e4.",
        },
        {
          name: "Ruy Lopez: the Berlin Defence",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8 9.Nc3 Ke8",
          text:
            "Queens come off early, but Black has the bishop pair and a solid structure. This is the famous \"Berlin Wall\".",
        },
        {
          name: "Scotch Game",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Nb6",
          text:
            "Black pins the e5 pawn against the queen and gets active pieces for the doubled c-pawns.",
        },
        {
          name: "Vienna with 3.f4",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.f4 d5 4.fxe5 Nxe4 5.Nf3 Be7",
          text:
            "The standard antidote: a central counter with ...d5 and a strong knight on e4.",
        },
        {
          name: "King's Gambit Accepted with 3...d5",
          pgn: "1.e4 e5 2.f4 exf4 3.Nf3 d5 4.exd5 Nf6",
          text:
            "Take the pawn, then open the centre at once with ...d5 before White's attack gets going.",
        },
      ],
      againstIt:
        "White's main attempts are the Ruy Lopez, the Italian, the Scotch and the sharp gambits (Evans, King's Gambit, Vienna Gambit). Weaker players also try early queen moves like 2.Qh5. The best strategy is to develop your pieces, castle and answer each tactic calmly.",
      plans: {
        white:
          "Build a classical centre with d4 or c3 and d4, develop the minor pieces, castle and put the rooks on the e- and d-files. Against the Berlin, aim for a small endgame edge on the kingside.",
        black:
          "Develop quickly (...Nc6, ...Nf6, ...Bc5 or ...Be7), castle and prepare the freeing ...d5. In the Berlin, the bishop pair and the solid structure give Black good chances in the endgame.",
      },
      history:
        "Positions that begin 1.e4 e5 are traditionally called Open Games, and they were the main battleground of 19th-century chess. The Berlin Defence got its \"wall\" reputation in 2000, when Vladimir Kramnik used it to beat Garry Kasparov in their world championship match in London.",
      faq: [
        {
          q: "Is 1...e5 a good reply to 1.e4?",
          a:
            "Yes. It is the most classical answer. Black gets a solid centre, quick development and a wide choice of plans.",
        },
        {
          q: "What is the best response to the Italian Game?",
          a:
            "3...Bc5 (the Giuoco Piano) is a solid choice. After 4.c3 Nf6 5.d4 exd4 6.e5 d5 Black gets active play. Against the slow 5.d3, play ...d6, ...O-O and prepare ...d5.",
        },
        {
          q: "How do I stop Scholar's Mate?",
          a:
            "After 1.e4 e5 2.Qh5 defend with 2...Nc6, then answer 3.Bc4 with 3...g6 to hit the queen. Don't play ...Nf6 until f7 is safe.",
        },
        {
          q: "What is the Berlin Defence?",
          a:
            "It is 3...Nf6 against the Ruy Lopez. After 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8, Black has a solid endgame. It is very hard for White to break down.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 3.Qh5? Nxh5",
        moves: "1.e4 e5 2.Bc4 Nf6 3.Qh5 Nxh5",
        notes: {
          "2.Bc4": "The Bishop's Opening: White develops and eyes f7.",
          "2...Nf6": "Develops, attacks e4 and covers h5 against early queen raids.",
          "3.Qh5": "A blunder: a Scholar's Mate attempt where the queen steps onto a square the knight attacks.",
          "3...Nxh5": "Black wins the queen for free.",
        },
      },
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
        moves: "1.e4 e5 2.Nf3 Nc6 3.c3 Nf6 4.d4 Nxe4 5.d5 Bc5 6.dxc6 Bxf2+ 7.Ke2 Bb6",
        notes: {
          "3...Nf6": "c3 took the knight's natural square, so hit e4 right away.",
          "5...Bc5": "The best reply: counter-attack on f2 instead of retreating the knight.",
          "6...Bxf2+": "Check. The bishop is protected by the knight on e4, so the king cannot take it.",
          "7.Ke2": "The king has to step into the centre.",
          "7...Bb6": "The bishop retreats safely. Black has regained the pawn and White's king is exposed, so Black is the one playing for the advantage.",
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
    style: "Counterattack",
    article: {
      whatIs:
        "The Najdorf Sicilian arises after 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6. The little move 5...a6 stops Nb5 and Bb5, prepares ...b5 and keeps Black's options open for ...e5 or ...e6. It is the most respected, most complex and most fighting line in the Sicilian.",
      howToReach:
        "Play 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6.",
      pros: [
        "Rich counterplay: Black fights for the initiative from the very start.",
        "Very flexible: you can choose ...e5 or ...e6 depending on White's set-up.",
        "A long tradition of success at the highest level, with a huge body of ideas to learn from.",
        "Excellent winning chances for Black if White errs.",
        "...a6 neutralises many White tries (Nb5, Bb5).",
      ],
      cons: [
        "Very heavy theory, especially against 6.Be3 (English Attack) and 6.Bg5.",
        "White can attack Black's king with fast pawn storms; mistakes are punished quickly.",
        "You also need an answer to anti-Sicilians such as the Alapin, Moscow, Smith-Morra and Grand Prix.",
        "Not an easy opening for beginners.",
      ],
      variations: [
        {
          name: "English Attack (6.Be3)",
          pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be3 e5 7.Nb3 Be6 8.f3 Be7 9.Qd2 O-O 10.O-O-O Nbd7 11.g4 b5",
          text:
            "The main modern test. White castles long and storms with g4-g5, while Black castles short and counters on the queenside with ...b5-b4.",
        },
        {
          name: "6.Bg5 main line",
          pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Be7 8.Qf3 Qc7 9.O-O-O Nbd7",
          text:
            "A sharp classic. Black keeps a compact position and looks for counterplay with ...b5 and ...Nc5.",
        },
        {
          name: "Positional 6.Be2",
          pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O 9.Be3 Be6",
          text:
            "A slower plan. Black takes space with ...e5 and develops harmoniously.",
        },
        {
          name: "Fischer-Sozin 6.Bc4",
          pgn: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bc4 e6 7.Bb3 b5 8.O-O Be7 9.Qf3 Qc7",
          text:
            "White aims at f7. Black answers with ...e6 and ...b5 and plays for queenside expansion.",
        },
      ],
      againstIt:
        "White can attack with the English Attack (Be3, f3, Qd2, O-O-O, g4), the Bg5 lines or the Bc4 sacrifices, or avoid the Najdorf with anti-Sicilians such as 2.c3 (Alapin), 3.Bb5+ (Moscow), 2.d4 (Smith-Morra) or 2.Nc3 (Grand Prix).",
      plans: {
        white:
          "Castle queenside and storm with g4-g5 and h4, or use the Bc4 lines to attack f7. In slower lines aim for a space advantage with Be2, O-O and f4.",
        black:
          "Counterattack on the queenside with ...b5, ...Bb7 and ...Nbd7-c5, or fight in the centre with ...e5. Keep the king safe, and look for ...d5 when it is possible.",
      },
      history:
        "The variation is named after Miguel Najdorf (1910-1997), the Polish-born Argentine grandmaster who developed and popularised it in the 1940s. Bobby Fischer made it his main weapon against 1.e4, and Garry Kasparov used it throughout his career.",
      faq: [
        {
          q: "Is the Najdorf Sicilian good for beginners?",
          a:
            "It is rich and educational, but the theory is very heavy. Beginners may enjoy the tactics but are likely to struggle with all the memorisation. Intermediate and advanced players get more out of it.",
        },
        {
          q: "What is the best move against the Najdorf?",
          a:
            "At the top level, 6.Be3 (English Attack), 6.Bg5 and 6.Be2 are all popular. There is no single best move, and all can lead to a fight.",
        },
        {
          q: "Why does Black play 5...a6 in the Najdorf?",
          a:
            "It stops White's pieces from landing on b5, prepares the ...b5 advance and gives Black time for ...e5 or ...e6. It is a flexible waiting and preparing move.",
        },
        {
          q: "How do I avoid theory against anti-Sicilians?",
          a:
            "Learn one simple answer to each: Alapin 2.c3 Nf6, Moscow 3.Bb5+ Bd7, Smith-Morra 2.d4 cxd4 3.c3 dxc3 and Grand Prix 2.Nc3 Nc6 3.f4 g6.",
        },
      ],
    },
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
    style: "Solid",
    article: {
      whatIs:
        "The French Defence starts 1.e4 e6 2.d4 d5. Black builds a solid pawn centre and fights back later with ...c5 and ...f6. The French has a reputation for being resilient, and the classic strategic issue is the c8 bishop, hemmed in behind the e6 pawn.",
      howToReach:
        "Play 1.e4 e6 2.d4 d5. Meet 3.Nc3 or 3.Nd2 with 3...dxe4, and 3.e5 with 3...c5.",
      pros: [
        "A solid, compact pawn structure that is hard to break down.",
        "A clear counter-plan against White's centre: ...c5 and ...f6.",
        "The Rubinstein 3...dxe4 gives a simple, low-theory way to answer both 3.Nc3 and 3.Nd2.",
        "Great winning chances if White gets careless.",
        "The positions have recurring themes, so you quickly build a feel for them.",
      ],
      cons: [
        "The light-squared bishop on c8 can stay passive for a long time.",
        "In the Advance Variation Black has less space and must break with ...c5 quickly.",
        "The Exchange Variation can be dry and drawish.",
        "You must know how to meet the King's Indian Attack and other sidelines.",
      ],
      variations: [
        {
          name: "Advance Variation",
          pgn: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.a3 c4 7.Nbd2 Na5",
          text:
            "Black hits the base of the pawn chain on d4. After ...c4 the knight heads for b3 and Black gets queenside play.",
        },
        {
          name: "Advance: Milner-Barry gambit",
          pgn: "1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.Bd3 cxd4 7.cxd4 Bd7 8.O-O Nxd4 9.Nxd4 Qxd4 10.Nc3",
          text:
            "White sacrifices the d4 pawn for activity. Black must avoid the trap 7...Nxd4? and accept the pawn only after ...Bd7.",
        },
        {
          name: "Exchange Variation",
          pgn: "1.e4 e6 2.d4 d5 3.exd5 exd5 4.Bd3 Bd6 5.Nf3 Ne7 6.O-O O-O 7.Re1 Bg4",
          text:
            "A symmetrical structure. The bad bishop is freed, so Black develops actively and equalises easily.",
        },
        {
          name: "Rubinstein vs 3.Nc3",
          pgn: "1.e4 e6 2.d4 d5 3.Nc3 dxe4 4.Nxe4 Nd7 5.Nf3 Ngf6 6.Nxf6+ Nxf6 7.Bg5 h6 8.Bh4 c5",
          text:
            "Black gives up the centre in return for simple development and then breaks with ...c5.",
        },
        {
          name: "King's Indian Attack",
          pgn: "1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nc6 5.g3 Nf6 6.Bg2 Be7 7.O-O O-O",
          text:
            "White plays a slow set-up. Black takes space on the queenside and aims for counterplay with ...b5 or ...c4.",
        },
      ],
      againstIt:
        "White can gain space with the Advance (3.e5), simplify with the Exchange (3.exd5), use the King's Indian Attack, or play 3.Nc3 or 3.Nd2. Attacking players like the Bd3 and Qg4 ideas against a weakened kingside.",
      plans: {
        white:
          "In the Advance, support the pawn chain with c3 and Nf3, then use your space to attack the kingside. In other lines, play on the e-file and look for a Bd3 and Qg4 attack against the black king.",
        black:
          "Hit the centre with ...c5 and ...f6, and free the bad bishop with ...b6/...Ba6, or ...Bd7 and ...Bb5. After ...c4, play for the b3 and e5 squares.",
      },
      history:
        "The French Defence is said to be named after a famous correspondence match played between the cities of London and Paris in 1834, in which Paris used 1...e6. Viktor Korchnoi made it a lifelong weapon, and the French has been a staple of top-level chess ever since. The Rubinstein Variation is named after Akiba Rubinstein.",
      faq: [
        {
          q: "Is the French Defence good?",
          a:
            "Yes. It is a sound, strategic opening played by top players. It rewards patience and a good understanding of pawn structures.",
        },
        {
          q: "What is the best response to the French Advance?",
          a:
            "Attack the pawn chain at once: 3...c5 4.c3 Nc6 5.Nf3 Qb6. Black puts pressure on d4 and then gets queenside space with ...c4.",
        },
        {
          q: "How do I deal with the bad bishop in the French?",
          a:
            "Trade it off, or reroute it with ...b6 and ...Ba6, or play ...Bd7-b5. In the Exchange the bishop is free, so the problem goes away.",
        },
        {
          q: "What is the Rubinstein Variation of the French?",
          a:
            "It is 3.Nc3 dxe4 4.Nxe4 (or 3.Nd2 dxe4 4.Nxe4), when Black gives up the centre for easy development with ...Nd7 and ...Ngf6.",
        },
      ],
    },
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
        moves: "1.e4 e6 2.d4 d5 3.exd5 exd5 4.Bd3 Bd6 5.Nf3 Ne7 6.O-O O-O 7.Re1 Bf5",
        notes: {
          "3...exd5": "Symmetrical, but the c8 bishop is now free, so the French's main problem is gone.",
          "7...Bf5": "Challenges White's good bishop. Don't play 7...Bg4? here: 8.Bxh7+! Kxh7 9.Ng5+ Kg8 10.Qxg4 wins a piece.",
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
    style: "Solid",
    article: {
      whatIs:
        "The Scandinavian Defence starts 1.e4 d5. Black challenges the e4 pawn immediately. After 2.exd5 Qxd5 3.Nc3 the queen goes to a5 and Black aims for a Caro-Kann-like set-up with ...c6, ...Bf5 and ...e6. Because the early play is forced, the theory is small.",
      howToReach:
        "Play 1.e4 d5 2.exd5 Qxd5 (or 2...Nf6). After 3.Nc3 Qa5 you've reached the main line.",
      pros: [
        "Very little theory because White has few real options.",
        "Black decides the character of the game right from move one.",
        "A solid structure and an easy set-up to remember.",
        "Surprising for opponents who are not prepared.",
        "The queen is placed actively on a5, pinning the knight on c3.",
      ],
      cons: [
        "The queen comes out early and White gains tempi attacking it.",
        "White gets a lead in development and a bit more space.",
        "Few winning chances against a well-prepared opponent.",
        "Some lines (Nf3/d4) require care to avoid being pushed around.",
      ],
      variations: [
        {
          name: "Main line 3...Qa5",
          pgn: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6",
          text:
            "The queen on a5 pins the c3 knight. Black develops with ...Nf6, ...c6, ...Bf5 and ...e6, getting a solid position.",
        },
        {
          name: "3.Nf3 and 3.d4",
          pgn: "1.e4 d5 2.exd5 Qxd5 3.Nf3 Nf6 4.d4 Bg4 5.Be2 e6 6.O-O Nc6",
          text:
            "If White does not play Nc3 the queen is not harassed. Black develops quickly and pins the knight with ...Bg4.",
        },
        {
          name: "Advance 2.e5",
          pgn: "1.e4 d5 2.e5 Bf5 3.d4 e6 4.Nf3 c5",
          text:
            "A French-style structure, but with the bishop already outside the pawn chain, which is a real improvement.",
        },
        {
          name: "2.Nc3",
          pgn: "1.e4 d5 2.Nc3 d4 3.Nce2 e5 4.Ng3 Be6",
          text: "Black gains space with ...d4 and builds a solid centre.",
        },
      ],
      againstIt:
        "White develops with tempo (Nc3, d4, Bc4, Bd2, Nf3) to chase the queen and then castles, aiming to use the lead in development. The most annoying tries are the Advance and quick Nc3 plus Bc4 set-ups.",
      plans: {
        white:
          "Develop with gain of time, build the centre with d4, put the bishop on c4 and Bd2, and castle. Then play for the open lines in the centre.",
        black:
          "Develop your pieces calmly: ...Nf6, ...c6, ...Bf5 and ...e6, castle and break with ...c5 or ...e5 at the right time. Keep the queen safe from tempo-gaining moves.",
      },
      history:
        "The Scandinavian is one of the oldest recorded replies to 1.e4: it appears in a book by the Spanish writer Luis Ramírez de Lucena in 1497. It is also known as the Centre Counter Defence. Players at every level, including grandmasters in rapid and blitz, have used it for its simplicity.",
      faq: [
        {
          q: "Is the Scandinavian Defence good?",
          a:
            "Yes, it is sound and very easy to learn. It might give White a small edge in development, but Black reaches a solid structure.",
        },
        {
          q: "Is the Scandinavian good for beginners?",
          a:
            "Yes. The moves are easy to remember, the plans are clear, and there is little theory to learn.",
        },
        {
          q: "Which is better, 2...Qxd5 or 2...Nf6?",
          a:
            "2...Qxd5 is the classical choice and the simplest. 2...Nf6 is a gambit-like line that needs more theory, but it avoids the early queen moves.",
        },
        {
          q: "How do I handle 3.Nc3 in the Scandinavian?",
          a:
            "Move the queen to a5 (or d6) and continue with ...Nf6, ...c6 and ...Bf5. The queen on a5 stays active and pins the knight.",
        },
      ],
    },
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
    style: "Solid",
    article: {
      whatIs:
        "The Queen's Gambit Declined, for Black, starts 1.d4 d5 2.c4 e6. Black supports the d5 pawn instead of taking on c4. It is one of the most solid and respected defences to 1.d4, with a firm pawn centre and ideas based on ...Be7, ...O-O and the freeing moves ...c5 or ...dxc4 followed by ...e5.",
      howToReach:
        "Play 1.d4 d5 2.c4 e6 3.Nc3 Nf6. Against 4.Bg5 play 4...Be7; against 4.cxd5 recapture 4...exd5.",
      pros: [
        "Rock-solid, with a strong pawn centre.",
        "Rich in strategic ideas, so you learn a lot about structures.",
        "Used by almost every world champion at some point.",
        "The Tartakower and other systems solve the problem of the c8 bishop.",
        "Flexible, with many ways to reach a good position.",
      ],
      cons: [
        "The light-squared bishop on c8 is hemmed in and needs careful handling.",
        "White's minority attack in the Exchange can be unpleasant.",
        "White has several options (Exchange, Catalan, London), so you need a few set-ups.",
        "Black has less space and must be patient.",
      ],
      variations: [
        {
          name: "Exchange (Carlsbad structure)",
          pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.cxd5 exd5 5.Bg5 c6 6.e3 Be7 7.Bd3 Nbd7 8.Qc2 O-O 9.Nf3 Re8 10.O-O Nf8",
          text:
            "Black plays ...c6 and ...Nf8-g6 or e6, using kingside space or ...Ne4 to counter the minority attack.",
        },
        {
          name: "Tartakower vs 4.Bg5",
          pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1 Be6",
          text:
            "The Tartakower: after ...b6 the c8 bishop gets out, and exchanges ease Black's cramped position.",
        },
        {
          name: "Catalan with 6...dxc4",
          pgn: "1.d4 d5 2.Nf3 Nf6 3.c4 e6 4.g3 Be7 5.Bg2 O-O 6.O-O dxc4 7.Qc2 a6 8.Qxc4 b5 9.Qc2 Bb7",
          text:
            "Black takes the pawn and uses the free time to develop the queenside. The bishop on b7 will fight the g2 bishop.",
        },
        {
          name: "vs the London System",
          pgn: "1.d4 d5 2.Bf4 Nf6 3.e3 c5 4.c3 Nc6 5.Nd2 e6 6.Ngf3 Bd6 7.Bg3 O-O 8.Bd3 b6",
          text:
            "The most testing set-up: hit d4 with ...c5 and ...Nc6, and challenge the London bishop with ...Bd6.",
        },
      ],
      againstIt:
        "White can play the Exchange with the minority attack, the Catalan with a fianchetto, the pin 4.Bg5, or the London System. Aggressive players may try quick Bg5 and Qc2 or Bf4 ideas. A trap to know about for both sides is the Elephant Trap after 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5?.",
      plans: {
        white:
          "Exchange on d5 and attack with the minority plan (b4-b5), or build with Nf3, e3, Bd3 and O-O. In the Catalan use the long diagonal and the c4 pressure.",
        black:
          "Complete development with ...Be7, ...O-O and ...Nbd7, then free the position with ...c5 or ...dxc4 and ...e5. Solve the c8 bishop with ...b6 and ...Bb7 or ...c6 and ...Bf5.",
      },
      history:
        "The Carlsbad structure is named after the Karlsbad (Carlsbad) tournaments of the early 20th century, and the Tartakower Variation after Savielly Tartakower. The QGD has been a main weapon of players from Lasker and Capablanca through Karpov and Kasparov.",
      faq: [
        {
          q: "Is the Queen's Gambit Declined good for Black?",
          a:
            "Yes. It is one of the most reliable ways to meet 1.d4, and it has been used by almost every world champion.",
        },
        {
          q: "What is the Elephant Trap?",
          a:
            "It is 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5? Nxd5! 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8, when Black wins a piece. The d5 pawn looks loose, but it is poisoned.",
        },
        {
          q: "How do I deal with the bad bishop in the QGD?",
          a:
            "Use the Tartakower with ...b6 and ...Bb7, or play ...c6 and ...Bf5/...Bg4 before closing the position with ...e6. In the Exchange, ...Bf5 is also a good plan.",
        },
        {
          q: "What is the best response to the Exchange Variation?",
          a:
            "Keep the position flexible, play ...c6, ...Bd6 or ...Be7, castle and meet the minority attack with ...Ne4 or counterplay on the kingside.",
        },
      ],
    },
    lines: [
      {
        name: "Elephant Trap (quick win)",
        kind: "alternative",
        moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8",
        notes: {
          "4...Nbd7": "An alternative to 4...Be7 that sets the Elephant Trap. Against the correct 5.e3 you simply continue with ...Be7 and a normal QGD.",
          "5...exd5": "Now the d5 pawn looks loose, and the f6 knight seems pinned to the queen.",
          "6.Nxd5": "The mistake: White grabs the pawn, thinking the knight on f6 cannot recapture.",
          "6...Nxd5": "Black takes the knight. The 'pinned' knight is free to move because the queen is covered by a check.",
          "7.Bxd8": "White takes the queen.",
          "7...Bb4+": "The point of the trap: this check wins the queen back.",
          "8.Qd2": "Forced; any other block loses the bishop on d8 as well.",
          "8...Bxd2+": "Queens come off with check.",
          "9...Kxd8": "Black recaptures the bishop and is a clean piece up.",
        },
      },
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
    style: "Counterattack",
    article: {
      whatIs:
        "The King's Indian Defence starts 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6. Black lets White build a big pawn centre and then attacks it, usually with ...e5 or ...c5. The fianchettoed bishop on g7 becomes a monster on the long diagonal, and Black often launches a kingside pawn storm with ...f5-f4 and ...g5.",
      howToReach:
        "Play 1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6, then castle and break with ...e5.",
      pros: [
        "Dynamic and double-edged, with great winning chances for Black.",
        "A clear plan: ...e5, ...Nc6 and ...f5 in the main lines.",
        "The g7 bishop becomes a powerful attacking piece.",
        "A long tradition of success at the highest level.",
        "You can play it against 1.d4, 1.c4 and 1.Nf3.",
      ],
      cons: [
        "A large amount of theory, especially in the Classical and the Sämisch lines.",
        "Black is often cramped and under attack on the queenside, so mistakes are costly.",
        "You must know many different White set-ups (Four Pawns, Sämisch, Fianchetto, Averbakh).",
        "Not suitable for beginners.",
      ],
      variations: [
        {
          name: "Classical: Mar del Plata 9.Ne1",
          pgn: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.Ne1 Nd7 10.Nd3 f5 11.Bd2 Nf6 12.f3 f4",
          text:
            "The best-known race. White attacks on the queenside with c5, Black on the kingside with ...f5-f4 and ...g5.",
        },
        {
          name: "Classical: Bayonet 9.b4",
          pgn: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Nf3 O-O 6.Be2 e5 7.O-O Nc6 8.d5 Ne7 9.b4 Nh5 10.Re1 f5",
          text:
            "White starts the queenside play at once. Black moves the knight to h5 and breaks with ...f5.",
        },
        {
          name: "Sämisch Gambit",
          pgn: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 c5 7.dxc5 dxc5 8.Qxd8 Rxd8 9.Bxc5 Nc6",
          text:
            "Against f3 and Be3, Black breaks with ...c5. After the queens are traded Black is a pawn down, but has the open d-file and active pieces for it.",
        },
        {
          name: "Four Pawns Attack",
          pgn: "1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f4 O-O 6.Nf3 c5 7.d5 e6 8.Be2 exd5 9.cxd5 Re8",
          text:
            "White builds a huge centre. Black attacks it at once with ...c5 and ...exd5, putting pressure on e4.",
        },
        {
          name: "Fianchetto Variation",
          pgn: "1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.g3 O-O 5.Bg2 d6 6.O-O Nbd7 7.Nc3 e5 8.e4 c6 9.h3 Qb6",
          text:
            "A calmer line. Black keeps flexible and pressures d4 with ...Qb6.",
        },
      ],
      againstIt:
        "White can build a big centre (Four Pawns), play solidly (Sämisch, Averbakh, Fianchetto) or launch a queenside attack with c5. Time is critical: in the closed lines the side that attacks first often wins.",
      plans: {
        white:
          "When the centre is closed with d5, play on the queenside with c5, b4 and Nb5. Keep the kingside safe and don't be too slow, because Black's attack will be fast.",
        black:
          "Attack the centre with ...e5 or ...c5. In the closed positions, push ...f5, ...f4 and ...g5 and use the g7 bishop. In the Averbakh and Sämisch, ...c5 is the freeing break.",
      },
      history:
        "The King's Indian was developed by Soviet masters in the 1940s, with Isaac Boleslavsky and David Bronstein among its pioneers. It was later made famous by Bobby Fischer and, above all, Garry Kasparov. The Mar del Plata Variation is named after the Argentine resort city, where strong tournaments in the 1950s saw these lines played extensively.",
      faq: [
        {
          q: "Is the King's Indian Defence good?",
          a:
            "Yes. It is a strong and ambitious defence, but it takes a lot of study. If you like to attack and enjoy dynamic play, it's a good choice.",
        },
        {
          q: "Is the King's Indian good for beginners?",
          a:
            "Probably not. The theory is heavy and the positions are sharp and double-edged. A more solid opening usually suits beginners better.",
        },
        {
          q: "What is the best response to the Sämisch?",
          a:
            "Hit the centre quickly. The course uses ...O-O and ...c5 after 6.Be3, and ...e5 is the other main idea. The key is to strike before White consolidates with Qd2 and long castling.",
        },
        {
          q: "What is the Mar del Plata variation?",
          a:
            "It is the main line of the Classical King's Indian where White plays 8.d5 and 9.Ne1, and both sides attack on opposite wings.",
        },
      ],
    },
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
    id: "stafford-gambit",
    title: "Stafford Gambit",
    side: "black",
    level: "beginner",
    eco: "C42",
    summary:
      "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6!?: a pawn sacrifice with a lot of venom. Objectively it is dubious (engines give White a clear edge with best play), but the natural-looking moves for White, such as Bg5 and Nc3-Bc4, run into mating tricks.",
    ideas: [
      "After ...Nc6 and ...dxc6 the c8 bishop and the queen are free, and ...Bc5 plus ...Ng4 create threats against f2.",
      "Know the main traps: 6.Bg5? Nxe4! (7.Bxd8 Bxf2+ 8.Ke2 Bg4 is mate) and, after 5.Nc3, 6.Bc4? Ng4 followed by 7.O-O? Qh4!.",
      "The h-pawn push ...h5 and the knight jump ...Ng4 are typical ways to put pressure on White's kingside.",
      "Be honest with yourself: if White plays carefully (5.d3, 6.Be2, Nf3 and Qe1) Black is simply a pawn down.",
    ],
    style: "Trap-heavy",
    article: {
      whatIs:
        "The Stafford Gambit arises after 1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6!?. Black sacrifices a pawn and, after 4.Nxc6 dxc6, plays for quick development with ...Bc5, ...h5 and ...Ng4. It is objectively dubious, but White's natural replies often run into traps, which is why it is very popular online.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6. If White takes the knight, recapture with 4...dxc6 and aim to develop with ...Bc5.",
      pros: [
        "Many natural White moves lose quickly (6.Bg5?, 7.O-O? and others).",
        "Easy to learn: the plan is almost always ...Bc5, ...h5 and ...Ng4.",
        "Effective in blitz and bullet because the traps work against hasty opponents.",
        "Open lines for your pieces from the start.",
        "A great way to practise tactics and attacking ideas.",
      ],
      cons: [
        "Objectively unsound: with correct play White keeps the extra pawn and a clear edge.",
        "Strong opponents who know the theory can play 5.d3 and 6.Be2, and then you're simply a pawn down.",
        "White can decline with 3.Nc3 (Four Knights) and avoid the gambit entirely.",
        "If you rely on traps, you may neglect the basic principles of development.",
      ],
      variations: [
        {
          name: "Stafford mate trap",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Bg5 Nxe4 7.Bxd8 Bxf2+ 8.Ke2 Bg4#",
          text:
            "The most famous trap in the opening. After 6.Bg5? Black plays 6...Nxe4! and mates on move eight.",
        },
        {
          name: "Main line with 6.Be2",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Be2 h5 7.O-O Ng4 8.Bxg4 hxg4 9.Bf4 Be6",
          text:
            "The sensible line. Black gets active pieces and an open h-file in return for the pawn, but White is slightly better.",
        },
        {
          name: "The 5.Nc3 and 6.Bc4 trap",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.Nc3 Bc5 6.Bc4 Ng4 7.O-O Qh4 8.h3 Nxf2",
          text:
            "Castling into Black's pieces loses at once. The threat of Qxh2# is decisive.",
        },
        {
          name: "5.e5 Nd5",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.e5 Nd5 6.d4 c5 7.Be2 Bf5",
          text:
            "A critical test. White gets space and a small edge, and Black must play accurately to stay in the game.",
        },
      ],
      againstIt:
        "Well-prepared players meet the Stafford with 5.d3 and 6.Be2, or 5.e5, and just consolidate the extra pawn. Others avoid it entirely with 3.Nc3, the Four Knights or Three Knights. The important thing is not to fall for the traps.",
      plans: {
        white:
          "Take the knight on c6, play d3, Be2 and O-O, and avoid Bg5 and Bc4 until Black's threats are under control. Then trade off the dangerous bishop and use the extra pawn.",
        black:
          "Develop fast with ...Bc5, ...h5, ...Ng4 and ...Be6, and make threats every move. Look for ...Nxe4, ...Qh4 and ...Bxf2+ tricks, but don't overextend if White finds the right moves.",
      },
      history:
        "The Stafford Gambit is a relatively obscure old line that became a sensation when International Master Eric Rosen popularised it in online games and videos in recent years. Its reputation rests on traps rather than soundness, and it is now one of the most popular \"fun\" openings on the internet.",
      faq: [
        {
          q: "Is the Stafford Gambit good?",
          a:
            "Not objectively. With best play White keeps a clear edge, but it is a great practical weapon: many natural-looking moves lose quickly, and the positions are easy to play.",
        },
        {
          q: "What is the best response to the Stafford Gambit?",
          a:
            "The simplest is to take the knight, play 5.d3 and 6.Be2, castle and trade off the dangerous knight and bishop. Avoid 6.Bg5 and 6.Bc4 traps.",
        },
        {
          q: "Is the Stafford Gambit good for beginners?",
          a:
            "It's a fun, easy opening for beginners to learn, and it teaches tactics. Just remember that strong opponents can neutralise it, so also work on solid play.",
        },
        {
          q: "What is the Stafford mate?",
          a:
            "It's the sequence 5.d3 Bc5 6.Bg5? Nxe4! 7.Bxd8 Bxf2+ 8.Ke2 Bg4#, where White takes the queen but gets checkmated.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 6.Bg5? Nxe4!",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Bg5 Nxe4 7.Bxd8 Bxf2+ 8.Ke2 Bg4#",
        notes: {
          "2...Nf6": "The Petrov set-up, but Black has something different in mind.",
          "3...Nc6": "The Stafford Gambit: Black offers the e5 pawn for quick development and traps.",
          "4...dxc6": "Opens the diagonal for the c8 bishop and the d-file for the queen.",
          "5...Bc5": "Eyes f2. The bishop and knight will work together against that pawn.",
          "6.Bg5": "A natural move that pins the knight to the queen, but it is a mistake: it ignores the threat to f2.",
          "6...Nxe4": "Black ignores the attack on the queen and opens the diagonal to f2.",
          "7.Bxd8": "White takes the queen.",
          "7...Bxf2+": "Check! The king has only one move.",
          "8.Ke2": "Forced. The bishop on f2 is protected by the knight.",
          "8...Bg4#": "Checkmate. The king can't escape and nothing can block on f3.",
        },
      },
      {
        name: "Main line: 6.Be2 h5",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Be2 h5 7.O-O Ng4 8.Bxg4 hxg4 9.Bf4 Be6",
        notes: {
          "5.d3": "The most solid reply. It supports e4 and opens the bishop on c1.",
          "6.Be2": "A safe developing move that prepares castling and stays clear of the tricks based on ...Bxf2+.",
          "6...h5": "A typical Stafford move: it prepares ...Ng4 and supports ...h4 or ...Rh6 later.",
          "7.O-O": "White castles, but this is inaccurate: ...Ng4 now gives Black real counterplay. 7.c3! keeps a clearer edge.",
          "7...Ng4": "Attacks the bishop on e2 and eyes the f2 and h2 squares.",
          "8.Bxg4": "White trades off the dangerous knight.",
          "8...hxg4": "The h-file is open for Black's rook, and 9.Qxg4?? loses the queen to ...Bxg4.",
          "9.Bf4": "White develops and eyes c7. This is White's best.",
          "9...Be6": "Black develops and prepares ...Qd7 and queenside castling. The position is nearly level, and Black has good practical chances.",
        },
      },
      {
        name: "Trap: 7.O-O? Qh4!",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.Nc3 Bc5 6.Bc4 Ng4 7.O-O Qh4 8.h3 Nxf2",
        notes: {
          "5.Nc3": "A natural and perfectly reasonable developing move.",
          "6.Bc4": "Natural, as it attacks f7, but it is already a mistake: ...Ng4! comes with threats.",
          "6...Ng4": "Threatens ...Bxf2+ and ...Qh4. Black is already slightly better here.",
          "7.O-O": "A mistake: castling walks into a mating attack on h2.",
          "7...Qh4": "Threatens Qxh2 mate.",
          "8.h3": "Forced, but it weakens the king further. 8.Qe2? even loses to Qxh2#.",
          "8...Nxf2": "The knight takes a pawn and attacks the queen while White's king is exposed. Black has a large advantage.",
        },
      },
      {
        name: "5.e5 Nd5",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.e5 Nd5 6.d4 c5 7.Be2 Bf5",
        notes: {
          "5.e5": "White gains time by hitting the knight. This is one of the critical tests of the gambit.",
          "5...Nd5": "The best retreat. (5...Qd5? 6.exf6 would win a piece.)",
          "6.d4": "White takes the centre.",
          "6...c5": "Challenges the centre at once.",
          "7.Be2": "Develops. White has a small edge.",
          "7...Bf5": "Develops the bishop with a view to ...Qd7 and queenside play. White is slightly better, but Black has activity.",
        },
      },
      {
        name: "6.Nc3? Ng4!",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Nc3 Ng4 7.Be3 Nxe3 8.fxe3 Bxe3 9.Qf3 Bd4",
        notes: {
          "6.Nc3": "A natural developing move, but it allows Black to strike on f2.",
          "6...Ng4": "Threatens ...Nxf2 and ...Qd4. White must respond with care.",
          "7.Be3": "White offers a trade of bishop for knight.",
          "7...Nxe3": "The knight takes the bishop.",
          "8.fxe3": "White opens the f-file but has weak pawns.",
          "8...Bxe3": "Black regains the pawn with an active position.",
          "9.Qf3": "Hits f7 and c6.",
          "9...Bd4": "The bishop is very well placed on d4. Black is slightly better here.",
        },
      },
      {
        name: "6.Be3 Bxe3",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nc6 4.Nxc6 dxc6 5.d3 Bc5 6.Be3 Bxe3 7.fxe3 Qd6 8.Be2 h5 9.Nc3 Ng4",
        notes: {
          "6.Be3": "White offers a trade of the dark-squared bishops to remove the dangerous Bc5.",
          "6...Bxe3": "Black accepts, giving White doubled pawns.",
          "7.fxe3": "White gets a half-open f-file but weakened pawns.",
          "7...Qd6": "Eyes the e5 square and prepares ...h5 and ...Ng4.",
          "8.Be2": "Develops.",
          "8...h5": "Prepares ...Ng4 and the h-file attack.",
          "9.Nc3": "Develops.",
          "9...Ng4": "Black's attack continues: the e3 pawn is weak. White is a bit better, but Black has real play for the pawn.",
        },
      },
    ],
  },
  {
    id: "englund-gambit",
    title: "Englund Gambit",
    side: "black",
    level: "beginner",
    eco: "A40",
    summary:
      "1.d4 e5!?: a pawn sacrifice that is unsound against correct play, but famous for its traps. Learn it to spring the famous mating trap, to punish careless blocks, and to know when White has found the only good move.",
    ideas: [
      "After 2.dxe5 Nc6 3.Nf3 Qe7 the queen threatens Qb4+ and a fork on b2 and f4.",
      "Careless replies lose quickly: 5.Nbd2? Qxf4 wins a bishop and 6.Bc3? Bb4! leads to mate on c1.",
      "Be honest: if White plays 6.Nc3! (or avoids the traps with 3.Nc3 and 3.e4) Black is simply worse.",
      "Use it for fun and surprise, not as your only defence to 1.d4.",
    ],
    style: "Trap-heavy",
    article: {
      whatIs:
        "The Englund Gambit is 1.d4 e5!?. Black immediately sacrifices a pawn for quick development, typically with 2.dxe5 Nc6 3.Nf3 Qe7. It is unsound against best play, but it has several nasty traps that make it popular in blitz and online games.",
      howToReach:
        "Play 1.d4 e5. After 2.dxe5 continue 2...Nc6 3.Nf3 Qe7.",
      pros: [
        "Several traps, including the famous mating trap 6.Bc3? Bb4! and the Qxf4 trick.",
        "The plan is easy to remember: ...Nc6, ...Qe7, ...Qb4+ and ...Qxb2.",
        "Surprising for opponents who expect a normal 1.d4 game.",
        "Black's queen and bishops get active quickly.",
        "Good for practising tactics and for learning how to punish natural but careless moves.",
      ],
      cons: [
        "Objectively unsound: White can simply play a better move and keep the pawn.",
        "Strong players can decline with 3.Nc3 or 3.e4 and stay fine.",
        "The queen goes on an adventure, so one mistake can lose by force.",
        "It doesn't suit slow, positional play, and you need a separate sound defence against 1.d4.",
      ],
      variations: [
        {
          name: "The Englund mating trap",
          pgn: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1#",
          text:
            "A natural attack on the queen loses on the spot. The bishop on c3 is pinned and White's back rank collapses.",
        },
        {
          name: "5.Nbd2? Qxf4",
          pgn: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Nbd2 Qxf4 6.g3 Qb4",
          text:
            "Blocking with the knight loses a piece, because the bishop on f4 is undefended.",
        },
        {
          name: "4.Qd5 f6",
          pgn: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Qd5 f6 5.exf6 Nxf6 6.Qb3 d5",
          text:
            "White's queen sortie gets met by ...f6, and Black develops with tempo.",
        },
        {
          name: "3.Bf4 g5",
          pgn: "1.d4 e5 2.dxe5 Nc6 3.Bf4 g5 4.Bg3 Bg7",
          text:
            "Against 3.Bf4 the queen trick doesn't work, but ...g5 and ...Bg7 give Black easy play.",
        },
      ],
      againstIt:
        "The best way to meet the Englund is to avoid the traps and consolidate: 3.Nc3, 3.e4 or 3.Bf4 (without Nf3) all keep the pawn or just give it back harmlessly. If White plays 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2, then 6.Nc3! is strong. Never block with the knight or play Bc3.",
      plans: {
        white:
          "Keep the extra pawn: play 2.dxe5 Nc6 3.Nf3 Qe7 4.Qd5 or 3.Nc3, and develop calmly. After 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Nc3! is the only good move.",
        black:
          "Play ...Nc6, ...Qe7 and ...Qb4+, then take on b2 only if you've calculated the consequences. If White defends well, regain the e5 pawn and aim for an acceptable position.",
      },
      history:
        "The Englund Gambit is a fringe opening that goes by several names. Strong players rarely use it, but as a surprise weapon in blitz it has plenty of fans, thanks to its collection of quick traps.",
      faq: [
        {
          q: "Is the Englund Gambit good?",
          a:
            "Not objectively. With best play White is simply a pawn up and has the better game. It is a practical weapon only because it contains traps that catch inexperienced players.",
        },
        {
          q: "What is the famous mating trap in the Englund Gambit?",
          a:
            "It's the line 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3? Bb4! 7.Qd2?? Bxc3 8.Qxc3 Qc1#, where White falls into a back-rank mate.",
        },
        {
          q: "What is the best response to the Englund Gambit?",
          a:
            "Take the pawn, develop with 3.Nf3, and after 3...Qe7 4.Qd5 or 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Nc3! White stays a pawn up. 3.Nc3 and 3.e4 are also fine.",
        },
        {
          q: "Is the Englund Gambit good for beginners?",
          a:
            "It's a fun trap-filled opening, but it's not sound. Learn it for the tactics, but also build a solid defence against 1.d4.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 6.Bc3? Bb4!",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1#",
        notes: {
          "1...e5": "The Englund Gambit: Black sacrifices a pawn for rapid development and traps.",
          "2...Nc6": "Attacks the e5 pawn and prepares ...Qe7.",
          "3...Qe7": "Attacks e5 again and prepares the check on b4.",
          "4.Bf4": "A natural way to defend e5, but it walks into a queen check.",
          "4...Qb4+": "Check, and the queen also attacks the bishop on f4 and the pawn on b2.",
          "5.Bd2": "Blocks the check and attacks the queen.",
          "5...Qxb2": "Black takes the pawn and attacks the rook on a1.",
          "6.Bc3": "Natural, but it loses. White attacks the queen, but forgets about the pin.",
          "6...Bb4": "Pins the bishop on c3 to the king, so it can't take the queen.",
          "7.Qd2": "Defends the pinned bishop, but it loses on the back rank.",
          "7...Bxc3": "Takes the bishop. The queen has to recapture, leaving the first rank unprotected.",
          "8.Qxc3": "White recaptures, but now the first rank is weak.",
          "8...Qc1#": "Checkmate. The c2 pawn and the b1 knight block White's pieces, and the king has no escape.",
        },
      },
      {
        name: "Wrong block: 5.Nbd2? Qxf4",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Nbd2 Qxf4 6.g3 Qb4",
        notes: {
          "5.Nbd2": "A natural block, but it leaves the bishop on f4 undefended.",
          "5...Qxf4": "Wins a whole piece.",
          "6.g3": "Attacks the queen, but the queen simply retreats.",
          "6...Qb4": "Black is a bishop up, and keeps an eye on b2.",
        },
      },
      {
        name: "4.Qd5 f6",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Qd5 f6 5.exf6 Nxf6 6.Qb3 d5",
        notes: {
          "4.Qd5": "A sharp try to hold e5: the queen is exposed in the centre.",
          "4...f6": "The right reply. It undermines e5 and Black gets pieces out with tempo.",
          "5.exf6": "White takes the pawn.",
          "5...Nxf6": "Black has regained the pawn and attacks the queen.",
          "6.Qb3": "The queen retreats.",
          "6...d5": "Black has a big centre and quick development. White keeps a small edge, but Black has good practical chances.",
        },
      },
      {
        name: "3.Bf4 g5",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Bf4 g5 4.Bg3 Bg7",
        notes: {
          "3.Bf4": "White develops the bishop before the knight, so the queen trick doesn't work.",
          "3...g5": "Kicks the bishop with a view to regaining e5.",
          "4.Bg3": "The bishop retreats.",
          "4...Bg7": "Pressure on e5: Black will win the pawn back with ...Nxe5 or ...d6. Engines still prefer White slightly, but Black has easy play.",
        },
      },
      {
        name: "3.Nc3 Nxe5",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nc3 Nxe5 4.Nf3 d6 5.Bf4 Ng6 6.Bg3",
        notes: {
          "3.Nc3": "A quiet move that gives up the idea of holding the pawn.",
          "3...Nxe5": "Black simply regains the pawn.",
          "4.Nf3": "Challenges the knight.",
          "4...d6": "Defends the knight and keeps a solid position.",
          "5.Bf4": "Attacks the knight on e5 again.",
          "5...Ng6": "The knight moves to a safe square.",
          "6.Bg3": "White is slightly better, but Black is fine.",
        },
      },
      {
        name: "If White plays 6.Nc3!",
        kind: "warning",
        moves: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Nc3 Bb4 7.Rb1 Qa3 8.Nd5",
        notes: {
          "6.Nc3": "The correct reply. White threatens Rb1 and Nd5, and Black's queen is in trouble.",
          "6...Bb4": "Black's best try, but it doesn't solve the problem.",
          "7.Rb1": "Attacks the queen.",
          "7...Qa3": "The queen runs, but it is in danger.",
          "8.Nd5": "White is clearly better (about +2 by the engine). Don't count on 6.Bc3? happening against good players.",
        },
      },
    ],
  },
  {
    id: "traxler-counterattack",
    title: "Traxler Counterattack",
    side: "black",
    level: "intermediate",
    eco: "C57",
    summary:
      "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5!?: instead of defending f7, Black counterattacks f2. It is a wild gambit with many traps, and it is playable against the safe replies.",
    ideas: [
      "Ignore the threat to f7 and counterattack: after 5.Nxf7 Bxf2+ Black gets a strong initiative.",
      "If White takes with the bishop (5.Bxf7+ Ke7) the king is safe enough in the centre, and ...Rf8 and ...d6 follow.",
      "Quiet White replies (5.O-O, 5.d3, 5.Nc3) can be met by simple castling, so you don't need to sacrifice.",
      "Know the trap 7.Nxh7? Nxh7, which simply loses a knight for a pawn.",
    ],
    style: "Counterattack",
    article: {
      whatIs:
        "The Traxler Counterattack, also called the Wilkes-Barre Variation, arises after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5. Instead of defending f7, Black counterattacks f2. It is a very sharp, double-edged line with spectacular tactics, and it is riskier than the usual defences.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 and, after 4.Ng5, play 4...Bc5.",
      pros: [
        "Spectacular tactics and a lot of traps, making it a great practical weapon.",
        "Takes White out of familiar territory, because many players don't know how to respond to 4...Bc5.",
        "If White plays quietly (5.O-O, 5.d3, 5.Nc3), Black can just castle and have a comfortable game.",
        "The ideas (a counterattack on f2, the knight fork on e4) are fun and educational.",
        "It is the most aggressive way to meet the Fried Liver set-up.",
      ],
      cons: [
        "In the critical lines White keeps an edge, so it is risky against prepared opponents.",
        "The king often has to walk to e7, which may feel uncomfortable.",
        "The lines are very sharp, and one inaccurate move can lose quickly.",
        "White can avoid the most extreme lines by playing 4.d3 instead of 4.Ng5.",
      ],
      variations: [
        {
          name: "5.Bxf7+ main line",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bb3 Rf8 7.d3 Qe8 8.Nf3 d6 9.Be3 Bg4",
          text:
            "White grabs a pawn and Black gets a lead in development with the king on e7. It is dangerous for both sides.",
        },
        {
          name: "Quick win with 7.Nxh7?",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bb3 Rf8 7.Nxh7 Nxh7",
          text: "A greedy knight grab loses a whole piece for a pawn.",
        },
        {
          name: "Wilkes-Barre with 5.Nxf7",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Nxf7 Bxf2+ 6.Kf1 Qe7 7.Nxh8 d5 8.exd5 Nd4",
          text:
            "The wildest line. White grabs the rook, but Black's pieces and the bare king give Black a strong initiative.",
        },
        {
          name: "Quiet 5.O-O O-O",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.O-O O-O 6.Nc3 h6 7.Nf3 Re8 8.d3",
          text:
            "If White declines the gambit, Black castles and has a comfortable equal game.",
        },
      ],
      againstIt:
        "The most testing tries are 5.Bxf7+ followed by Bb3 and d3 (keeping an extra pawn), and the wild 5.Nxf7. Careful players can also play 4.d3 instead of 4.Ng5, avoiding it altogether. The key is to know the tricks, and to recognise when the position calls for castling.",
      plans: {
        white:
          "Take on f7 with the bishop, retreat it to b3 and play d3 and Nf3, keeping the extra pawn and trying to exploit the exposed king. Be careful with greedy knight moves.",
        black:
          "Use the f-file, castle if possible, develop with ...d6, ...Qe8 and ...Bg4, and look for tactics like ...Nxe4 and ...Bxf2+. If White plays quietly, simply castle.",
      },
      history:
        "The Traxler Counterattack is named after Karel Traxler, a Czech priest and chess player who analysed the line at the end of the 19th century. In the United States it is known as the Wilkes-Barre Variation, after the Pennsylvania city where it was popular.",
      faq: [
        {
          q: "Is the Traxler Counterattack good?",
          a:
            "It's very risky: with best play White keeps an edge in the sharp lines. But it's an excellent practical weapon, and it's safe if White plays quietly.",
        },
        {
          q: "What is the best response to the Traxler?",
          a:
            "5.Bxf7+ Ke7 6.Bb3 is the most accurate. Taking the knight on f7 leads to wild play, and quiet moves like 5.O-O allow Black to castle.",
        },
        {
          q: "Why is the Traxler also called the Wilkes-Barre Variation?",
          a:
            "In the United States it is named after Wilkes-Barre, a city in Pennsylvania, where the variation became popular.",
        },
        {
          q: "Is the Traxler good for beginners?",
          a:
            "It's a fun attacking weapon but needs concrete knowledge. Beginners may enjoy it, though the sharp lines require good calculation.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 7.Nxh7? Nxh7",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bb3 Rf8 7.Nxh7 Nxh7",
        notes: {
          "3...Nf6": "The Two Knights Defence.",
          "4.Ng5": "Threatens f7 and aims to win a pawn.",
          "4...Bc5": "The Traxler Counterattack: Black ignores the threat to f7 and strikes at f2.",
          "5.Bxf7+": "White's safest choice: take with the bishop. (5.Nxf7 is wild.)",
          "5...Ke7": "The king steps up. It is safe enough, because White's pieces aren't ready to attack it.",
          "6.Bb3": "The bishop retreats, keeping its extra pawn.",
          "6...Rf8": "The rook uses the open f-file and aims at f2.",
          "7.Nxh7": "A tempting pawn grab, but a mistake.",
          "7...Nxh7": "Black wins a knight for a pawn.",
        },
      },
      {
        name: "Main line: 6.Bb3",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bb3 Rf8 7.d3 Qe8 8.Nf3 d6 9.Be3 Bg4",
        notes: {
          "7.d3": "A solid move that protects e4 and opens the bishop on c1.",
          "7...Qe8": "The queen supports the king and aims for g6 or h5.",
          "8.Nf3": "The knight retreats to a safe square.",
          "8...d6": "Opens the c8 bishop and protects the e5 pawn.",
          "9.Be3": "Trades off the active bishop on c5.",
          "9...Bg4": "Pins the knight and completes development. White has a small edge, but Black's king is not in danger.",
        },
      },
      {
        name: "5.Nxf7",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Nxf7 Bxf2+ 6.Kf1 Qe7 7.Nxh8 d5 8.exd5 Nd4",
        notes: {
          "5.Nxf7": "The most ambitious reply: White grabs a pawn and forks the queen and rook.",
          "5...Bxf2+": "Black sacrifices a second piece.",
          "6.Kf1": "Declines the bishop. (6.Kxf2 Nxe4+ is the other way.)",
          "6...Qe7": "Attacks the knight on f7 and prepares to win the knight on h8.",
          "7.Nxh8": "White grabs the rook.",
          "7...d5": "Black opens lines, attacking the bishop on c4.",
          "8.exd5": "White takes the pawn.",
          "8...Nd4": "A powerful knight, aiming at c2 and f3. The position is wild: the engine slightly prefers White, but Black has a dangerous initiative.",
        },
      },
      {
        name: "5.O-O O-O",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.O-O O-O 6.Nc3 h6 7.Nf3 Re8 8.d3",
        notes: {
          "5.O-O": "White declines to take f7 and castles.",
          "5...O-O": "Black castles too. The threats on f7 and f2 cancel out.",
          "6.Nc3": "Develops.",
          "6...h6": "Kicks the knight back.",
          "7.Nf3": "The knight retreats; White has lost time.",
          "7...Re8": "Pressure on e4. Black is fine, even slightly more comfortable.",
          "8.d3": "A solid move: the position is equal.",
        },
      },
      {
        name: "5.d3 O-O",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.d3 O-O 6.Nc3 Na5 7.Nxf7 Rxf7 8.Bxf7+ Kxf7",
        notes: {
          "5.d3": "A quiet move that prevents ...Nxe4 and prepares Bg5.",
          "5...O-O": "Black castles instead of sacrificing.",
          "6.Nc3": "Develops.",
          "6...Na5": "Attacks the c4 bishop and keeps f7 under control.",
          "7.Nxf7": "White grabs a pawn and a rook is attacked.",
          "7...Rxf7": "Black takes the knight.",
          "8.Bxf7+": "White takes the rook with check.",
          "8...Kxf7": "Material is level: White gave two minor pieces for a rook and a pawn. Black's king is exposed, but White's pieces are not coordinated, and the position is roughly equal.",
        },
      },
      {
        name: "5.Bxf7+ Ke7 6.Bd5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Bc5 5.Bxf7+ Ke7 6.Bd5 Rf8 7.Nf3 d6 8.c3 Qe8 9.Bxc6 bxc6",
        notes: {
          "6.Bd5": "The other main retreat. The bishop pressures c6 and keeps an eye on f7 and the long diagonal.",
          "6...Rf8": "Again the rook takes the open f-file.",
          "7.Nf3": "Retreats the knight and develops.",
          "7...d6": "Opens the c8 bishop and protects e5.",
          "8.c3": "Prepares d4 and gives the bishop a retreat.",
          "8...Qe8": "The queen connects the king and rook and heads for g6 or h5.",
          "9.Bxc6": "White trades the bishop for the knight.",
          "9...bxc6": "Black gets the bishop pair and an open b-file. White keeps a small edge, but Black's king is reasonably safe.",
        },
      },
    ],
  },
  {
    id: "petrov-defence",
    title: "Petrov Defence",
    side: "black",
    level: "intermediate",
    eco: "C42",
    summary:
      "1.e4 e5 2.Nf3 Nf6: instead of defending e5, Black counterattacks e4. The Petrov (or Russian Game) is solid, symmetrical and respected at every level. Learn the key idea: kick the knight with ...d6 before taking on e4.",
    ideas: [
      "After 3.Nxe5, play 3...d6! first. 3...Nxe4? loses to Qe2 and Nc6+ if you play it carelessly.",
      "Only after 4.Nf3 take the pawn with 4...Nxe4. Then build a solid centre with ...d5, ...Be7 and ...Nc6.",
      "Know the early traps: 5.Qe2 Qe7 6.Qxe4?? Qxe4+ and the knight fork on c6.",
      "Against 3.d4 and 3.Nc3, the best plans are different, so learn each set-up.",
    ],
    style: "Solid",
    article: {
      whatIs:
        "The Petrov Defence, or Russian Game, starts 1.e4 e5 2.Nf3 Nf6. Instead of defending the e5 pawn, Black counterattacks White's e4 pawn. After 3.Nxe5 d6 4.Nf3 Nxe4, the position is symmetrical and solid. The Petrov is one of the most reliable defences against 1.e4, popular for its safety and simplicity.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nf6. After 3.Nxe5 play 3...d6 4.Nf3 Nxe4. Never take on e4 at move three.",
      pros: [
        "Very solid, with a good reputation at the highest level.",
        "Symmetrical structures where Black has no real weaknesses.",
        "Lots of drawing potential against stronger players.",
        "Clear plans: ...d5, ...Be7, ...O-O and ...Nc6.",
        "Learning the key idea (kicking the knight before taking e4) is easy.",
      ],
      cons: [
        "Can lead to symmetrical, drawish positions, so winning chances for Black are limited.",
        "White can play 3.Nc3 or 3.d4 and avoid the main theory.",
        "A single move-order mistake (3...Nxe4?) loses a queen.",
        "The main lines (5.d4 d5 6.Bd3) require precise knowledge of the typical plans for both sides.",
      ],
      variations: [
        {
          name: "Main line with 5.d4",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Be7 7.O-O Nc6 8.Re1 Bg4 9.c4 Nf6",
          text:
            "The classical mainline. Black builds a solid centre and plays against the White centre with ...Nc6 and ...Bg4.",
        },
        {
          name: "5.Nc3 Nxc3",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Nc3 Nxc3 6.dxc3 Be7 7.Bf4 O-O 8.Qd2 Nd7 9.O-O-O Nc5",
          text:
            "White gets more space and the bishop pair potential, but Black's position is rock solid.",
        },
        {
          name: "Queen trap 5.Qe2",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Qe2 Qe7 6.Qxe4 Qxe4+",
          text:
            "If White grabs the knight with the queen, Black recaptures and wins the queen for a knight. 6.d3 is the sensible move.",
        },
        {
          name: "3.d4 and 3.Nc3",
          pgn: "1.e4 e5 2.Nf3 Nf6 3.d4 Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7 7.O-O Be7 8.c4 Nf6 9.Nc3 dxc4 10.Bxc4",
          text:
            "Against 3.d4 you take the pawn and use the ...Nd7 idea to regain the e5 pawn. Against 3.Nc3 you transpose into a Four Knights game.",
        },
      ],
      againstIt:
        "White's best chances come from the main line 5.d4, the 5.Nc3 line and the 3.Nc3 or 3.d4 sidelines. The Cochrane Gambit (4.Nxf7) and the 5.Qe2 trap are rare. The key is to stay solid, develop quickly and avoid the early queen trap.",
      plans: {
        white:
          "Build a space advantage with d4, Bd3 and c4, castle, and try to use the pin on the e-file. Aim for a small but lasting initiative.",
        black:
          "Play ...d5, ...Be7 and ...O-O, then challenge the centre with ...Nc6 and ...Bg4. Keep the structure solid and look for equality, then seek small winning chances.",
      },
      history:
        "The Petrov Defence is named after Alexander Petrov, a Russian master who analysed it in the first half of the 19th century, and it is also called the Russian Game. It has been a regular choice of elite players for decades, because it is so reliable.",
      faq: [
        {
          q: "Is the Petrov Defence good?",
          a:
            "Yes. It is a very solid defence against 1.e4 and has been used by world champions. It rarely gets Black into trouble if you know the theory.",
        },
        {
          q: "Is the Petrov Defence drawish?",
          a:
            "It can be. Many games end in draws between strong players, but there are lines where Black can play for a win, and White has to avoid mistakes.",
        },
        {
          q: "Is the Petrov good for beginners?",
          a:
            "Yes, as long as you learn the key idea: kick the knight with ...d6 first. It is simple, solid and teaches good principles.",
        },
        {
          q: "What is the best response to the Petrov?",
          a:
            "The main line is 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3. White can also try 5.Nc3, 3.d4 or 3.Nc3. Each of these gives a small edge at best.",
        },
        {
          q: "What happens if Black plays 3...Nxe4?",
          a:
            "If White plays 4.Qe2, Black must find 4...Qe7. The natural 4...Nf6?? loses the queen to 5.Nc6+.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 5.Qe2 Qe7 6.Qxe4??",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Qe2 Qe7 6.Qxe4 Qxe4+",
        notes: {
          "2...Nf6": "The Petrov: Black counterattacks e4 instead of defending e5.",
          "3.Nxe5": "White takes the pawn. Black must not play 3...Nxe4? (see the warning line).",
          "3...d6": "Kicks the knight away first. This is the key to the Petrov.",
          "4.Nf3": "The knight retreats.",
          "4...Nxe4": "Now taking e4 is safe.",
          "5.Qe2": "Attacks the knight on e4, hoping to win it.",
          "5...Qe7": "Defends the knight and sets a trap. The queens line up on the e-file.",
          "6.Qxe4": "A blunder: White takes the knight with the queen, but the queen is lost to the recapture.",
          "6...Qxe4+": "Black wins the queen for a knight, with check.",
        },
      },
      {
        name: "Main line: 5.d4 d5",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d4 d5 6.Bd3 Be7 7.O-O Nc6 8.Re1 Bg4 9.c4 Nf6",
        notes: {
          "5.d4": "White claims the centre. This is the main line.",
          "5...d5": "Supports the knight on e4 and stakes a claim in the centre.",
          "6.Bd3": "Develops and eyes the knight on e4.",
          "6...Be7": "Develops and prepares to castle.",
          "7.O-O": "White castles.",
          "7...Nc6": "Develops with pressure on d4.",
          "8.Re1": "Attacks the knight on e4 along the e-file.",
          "8...Bg4": "Pins the knight on f3, so White can't use the e5 square.",
          "9.c4": "White attacks the d5 pawn.",
          "9...Nf6": "The knight retreats to a safe square. The position is balanced and solid for Black.",
        },
      },
      {
        name: "5.Nc3 Nxc3",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Nc3 Nxc3 6.dxc3 Be7 7.Bf4 O-O 8.Qd2 Nd7 9.O-O-O Nc5",
        notes: {
          "5.Nc3": "Attacks the knight on e4.",
          "5...Nxc3": "Trades off White's active knight.",
          "6.dxc3": "Opens the d-file and the bishop on c1. The pawn structure is a bit damaged.",
          "6...Be7": "Develops and prepares to castle.",
          "7.Bf4": "Develops with a view to long castling.",
          "7...O-O": "Black castles.",
          "8.Qd2": "Prepares long castling.",
          "8...Nd7": "The knight heads for c5 or b6.",
          "9.O-O-O": "Both sides have castled on opposite sides, and White can attack on the kingside.",
          "9...Nc5": "The knight lands on a strong square. The position is equal.",
        },
      },
      {
        name: "5.Qe2 Qe7 6.d3",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.Qe2 Qe7 6.d3 Nf6 7.Bg5 Qxe2+ 8.Bxe2 Be7",
        notes: {
          "6.d3": "Attacks the knight, which must retreat.",
          "6...Nf6": "The knight retreats to f6, where it protects the queen.",
          "7.Bg5": "Pins the knight and offers a trade of queens.",
          "7...Qxe2+": "Black trades queens.",
          "8.Bxe2": "White recaptures.",
          "8...Be7": "Black develops and unpins the knight. The position is equal and solid.",
        },
      },
      {
        name: "3.d4 Nxe4",
        moves: "1.e4 e5 2.Nf3 Nf6 3.d4 Nxe4 4.Bd3 d5 5.Nxe5 Nd7 6.Nxd7 Bxd7 7.O-O Be7 8.c4 Nf6 9.Nc3 dxc4 10.Bxc4",
        notes: {
          "3.d4": "White fights for the centre at once. Black can take the pawn.",
          "3...Nxe4": "Black takes the pawn. Black can defend the knight with ...d5.",
          "4.Bd3": "Attacks the knight and prepares to castle.",
          "4...d5": "Supports the knight on e4.",
          "5.Nxe5": "White takes the pawn.",
          "5...Nd7": "The key move: Black challenges the knight on e5 and will get the pawn back.",
          "6.Nxd7": "White trades knights.",
          "6...Bxd7": "Black recaptures with the bishop.",
          "7.O-O": "White castles.",
          "7...Be7": "Develops and prepares castling.",
          "8.c4": "White attacks the d5 pawn.",
          "8...Nf6": "The knight retreats and defends the centre.",
          "9.Nc3": "Develops.",
          "9...dxc4": "Black takes the pawn, but White regains it at once.",
          "10.Bxc4": "A balanced position with equal chances.",
        },
      },
      {
        name: "3.Nc3 Nc6 (Four Knights)",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nc3 Nc6 4.Bb5 Bb4 5.O-O O-O 6.d3 Bxc3 7.bxc3 d6 8.Bg5 Ne7 9.Ne1 Ng6",
        notes: {
          "3.Nc3": "White avoids the Petrov theory.",
          "3...Nc6": "Transposes to the Four Knights Game.",
          "4.Bb5": "The Spanish Four Knights.",
          "4...Bb4": "Pins the knight and mirrors White's play.",
          "5.O-O": "White castles.",
          "5...O-O": "Black castles.",
          "6.d3": "Prepares Bg5.",
          "6...Bxc3": "Black doubles White's pawns.",
          "7.bxc3": "White recaptures.",
          "7...d6": "Solid. Black unblocks the bishop and defends e5.",
          "8.Bg5": "Pins the knight.",
          "8...Ne7": "Black prepares to challenge the pin.",
          "9.Ne1": "Prepares f4.",
          "9...Ng6": "Black has a solid position. The game is balanced.",
        },
      },
      {
        name: "3.Bc4 Nxe4",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Bc4 Nxe4 4.Nc3 Nxc3 5.dxc3 f6 6.O-O Nc6 7.Nh4 g6",
        notes: {
          "3.Bc4": "White develops with a possible trick on f7.",
          "3...Nxe4": "Black takes the pawn. White's Bxf7+ ideas don't give enough for the piece.",
          "4.Nc3": "Attacks the knight.",
          "4...Nxc3": "Trades the knight.",
          "5.dxc3": "White opens the d-file.",
          "5...f6": "Defends e5 and stops Qh5+. A key move in this line.",
          "6.O-O": "White castles.",
          "6...Nc6": "Develops.",
          "7.Nh4": "Threatens Qh5+ and Nf5.",
          "7...g6": "Prevents Nf5 and Qh5+. Black is comfortable.",
        },
      },
      {
        name: "Trap to avoid: 3...Nxe4?",
        kind: "warning",
        moves: "1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nxe4 4.Qe2 Nf6 5.Nc6+",
        notes: {
          "3...Nxe4": "Premature. You must play 3...d6 first.",
          "4.Qe2": "Attacks the knight along the e-file. Black must reply 4...Qe7.",
          "4...Nf6": "A blunder that loses the queen.",
          "5.Nc6+": "A royal fork: the knight attacks the king and the queen. (Correct is 4...Qe7 5.Qxe4 d6 6.d4 dxe5 7.dxe5 with equality.)",
        },
      },
    ],
  },
  {
    id: "rousseau-gambit",
    title: "Rousseau Gambit",
    side: "black",
    level: "beginner",
    eco: "C50",
    summary:
      "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5!?: Black hits the centre at once and offers the e5 pawn for open lines. It is objectively dubious (engines give White a clear edge after 4.d3 or 4.d4), but the natural-looking replies 4.Nc3? and 4.Nxe5? lose material outright.",
    ideas: [
      "3...f5 attacks e4 immediately; if White ignores it, ...fxe4 opens the f-file and gives Black the centre.",
      "Know the two big traps: 4.Nc3? fxe4 5.Nxe4? d5! forks bishop and knight, and 4.Nxe5? Nxe5 5.d4? Nxc4 simply wins a piece.",
      "Against the sound 4.d3 do not rush ...fxe4: develop with ...Nf6 first and keep the tension.",
      "Be honest with yourself: if White declines the tricks and develops calmly, Black is the one fighting for equality.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Rousseau Gambit is the move 3...f5 after 1.e4 e5 2.Nf3 Nc6 3.Bc4. Black attacks e4 straight away and is ready to give up the e5 pawn or the shelter in front of the king in return for open lines and quick counterplay. It is objectively dubious, but several natural White moves run into tactics.",
      howToReach:
        "Play 1.e4 e5 2.Nf3 Nc6. If White plays the Italian 3.Bc4, answer 3...f5. After 3.Bb5, 3.d4 or any other third move you are outside this course.",
      pros: [
        "Natural White replies such as 4.Nc3?, 4.Nxe5? and 4.Ng5? lose material at once.",
        "Easy to learn: the plan is ...fxe4, ...Nf6, ...d5 or ...d6 and castle, with no long theory to memorise.",
        "Opponents rarely know it, so you get a fight from move three.",
        "The half-open f-file gives you play against f2 as soon as you have castled.",
        "A good school for tactics around e4, f2 and the e1-h4 diagonal.",
      ],
      cons: [
        "Objectively unsound: after 4.d3 or 4.d4 White keeps a clear edge.",
        "Moving the f-pawn weakens your king, and ideas like Ng5 and Qh5+ can become dangerous.",
        "White can decline with a quiet 4.d3 and Black has no forced route to compensation.",
        "Strong players who know the right moves leave you worse; the opening is a practical weapon, not a sound repertoire.",
      ],
      variations: [
        {
          name: "The 4.Nc3 trap",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Nc3 fxe4 5.Nxe4 d5 6.Bd3 dxe4 7.Bxe4 Nf6",
          text:
            "A natural developing move loses material. After 5.Nxe4 the pawn fork 5...d5 wins a piece, and Black stays clearly ahead after 7...Nf6.",
        },
        {
          name: "Greedy 4.Nxe5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Nxe5 Nxe5 5.d4 Nxc4",
          text:
            "White grabs the pawn and attacks the knight, but the knight takes the bishop on c4 and White is a full piece down.",
        },
        {
          name: "Solid 4.d3 with 5.Nc3",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d3 Nf6 5.Nc3 Bb4 6.O-O Bxc3 7.bxc3 fxe4 8.dxe4 d6 9.a4 Na5",
          text:
            "The sound way to meet the gambit. Black develops, pins and trades the knight, then takes on e4 with a playable but slightly worse position.",
        },
        {
          name: "4.d4 exd4",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d4 exd4 5.e5 d5 6.exd6 Qxd6 7.O-O Bd7 8.Re1+ Be7",
          text:
            "White opens the centre. Black has developed pieces and a lead in space on the kingside, but the extra pawn and the e-file give White the better game.",
        },
        {
          name: "Taking on f5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.exf5 e4 5.Nd4 Nf6 6.Nxc6 dxc6 7.d3 Bxf5 8.Nc3 exd3",
          text:
            "The greedy 4.exf5 is not a mistake but it hands Black time: ...e4 kicks the knight and the position is roughly level.",
        },
      ],
      againstIt:
        "The simplest plan is 4.d3 followed by Nc3, O-O and a slow build-up, answering ...fxe4 with dxe4. 4.d4 is also strong: the centre opens and the extra pawn tells. Avoid the pawn-grabs and the natural 4.Nc3 and 4.Nxe5, and avoid 4.Ng5? Qxg5, which drops a knight.",
      plans: {
        white:
          "Play d3 (or d4), develop the pieces, castle and only then look at the centre. If Black takes on e4, recapture with a pawn so that you keep the better structure, and use Ng5 only when it is a real threat.",
        black:
          "Hit e4, develop with ...Nf6, ...Bb4 or ...Bc5 and ...d6, and castle. Keep pieces active, avoid early queen moves, and be ready to use the f-file and the pins on White's knight.",
      },
      history:
        "The gambit is named after a 19th-century player called Rousseau and appears in old gambit literature. It has never been part of top-level theory and survives mainly as a surprise weapon for club and online games. Its reputation rests on traps rather than on soundness.",
      faq: [
        {
          q: "Is the Rousseau Gambit good?",
          a:
            "Not objectively. With best play White keeps a clear advantage, mostly because Black's king is weakened. As a practical weapon against players who do not know it, it can score well.",
        },
        {
          q: "How should White meet the Rousseau Gambit?",
          a:
            "Stay calm. 4.d3 and 4.d4 both give White the better game. Avoid 4.Nc3? fxe4 5.Nxe4? d5, and avoid 4.Nxe5? Nxe5 5.d4? Nxc4.",
        },
        {
          q: "What is the main trap in the Rousseau Gambit?",
          a:
            "After 4.Nc3 fxe4 5.Nxe4?, the move 5...d5 forks the bishop on c4 and the knight on e4. White cannot save both, and Black wins a piece.",
        },
        {
          q: "Should I take on e4 against 4.d3?",
          a:
            "No. 4.d3 fxe4?! 5.dxe4 Nf6 6.Ng5 gives White a strong initiative against f7. Develop with 4...Nf6 first and take on e4 later.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 4.Nc3? fxe4 5.Nxe4? d5!",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Nc3 fxe4 5.Nxe4 d5 6.Bd3 dxe4 7.Bxe4 Nf6",
        notes: {
          "3...f5": "The Rousseau Gambit. Black attacks e4 at once. It is objectively dubious, but the traps are real.",
          "4.Nc3": "A natural developing move that defends e4, but it is already a mistake.",
          "4...fxe4": "Black takes the pawn. White now needs the unnatural 5.Bxg8 to keep the balance.",
          "5.Nxe4": "The natural recapture, but it walks into a fork.",
          "5...d5": "The point of the gambit: the pawn attacks both the bishop on c4 and the knight on e4.",
          "6.Bd3": "White saves the bishop, but the knight on e4 is still attacked.",
          "6...dxe4": "Black wins a whole knight.",
          "7.Bxe4": "White regains a pawn but is a piece down.",
          "7...Nf6": "The knight attacks the bishop and develops with a big advantage.",
        },
      },
      {
        name: "Trap: 4.Nxe5? Nxe5 5.d4? Nxc4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Nxe5 Nxe5 5.d4 Nxc4",
        notes: {
          "4.Nxe5": "The greedy capture, but it removes the knight that guards the centre.",
          "4...Nxe5": "Black recaptures. The knight now attacks White's bishop on c4.",
          "5.d4": "White attacks the knight, hoping it will retreat.",
          "5...Nxc4": "Don't retreat: take the bishop. White has no compensation and is a piece down.",
        },
      },
      {
        name: "Main line: 4.d3 Nf6 5.Nc3 Bb4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d3 Nf6 5.Nc3 Bb4 6.O-O Bxc3 7.bxc3 fxe4 8.dxe4 d6 9.a4 Na5",
        notes: {
          "4.d3": "The sensible reply: it defends e4 and gives the bishop on c1 a diagonal.",
          "4...Nf6": "Develops and adds pressure to e4, without committing the f-pawn yet.",
          "5.Nc3": "Develops and defends e4 a second time.",
          "5...Bb4": "Pins the knight, so that the e4 pawn is held by only the d3 pawn after the trade.",
          "6.O-O": "White castles. Black's plan is to double White's pawns.",
          "6...Bxc3": "Gives up the bishop pair to damage White's structure.",
          "7.bxc3": "White has doubled c-pawns but a lead in development.",
          "7...fxe4": "Now the capture works: the f-file is open and the d3 pawn can be recaptured.",
          "8.dxe4": "White recaptures with a pawn and keeps a solid centre.",
          "8...d6": "Protects the e5 pawn and opens the c8 bishop.",
          "9.a4": "Stops ...b5, which would drive the bishop away.",
          "9...Na5": "Hits the bishop on c4. White keeps a small edge, but Black has a reasonable position.",
        },
      },
      {
        name: "Main line: 4.d3 Nf6 5.O-O Bc5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d3 Nf6 5.O-O Bc5 6.Nc3 d6 7.Bg5 Na5 8.Bxf6 Qxf6 9.Nd5 Qd8",
        notes: {
          "5.O-O": "White castles at once and waits for Black to commit.",
          "5...Bc5": "Develops the bishop to the c5 square and eyes f2.",
          "6.Nc3": "Develops and prepares Nd5 and Bg5.",
          "6...d6": "Keeps the e5 pawn safe and opens the diagonal for the c8 bishop.",
          "7.Bg5": "Pins the knight on f6 to the queen.",
          "7...Na5": "Attacks the bishop on c4. If White trades it, Black gets the pair of bishops.",
          "8.Bxf6": "White removes the defender of the centre.",
          "8...Qxf6": "Black's queen is active on f6.",
          "9.Nd5": "A strong outpost, hitting the queen.",
          "9...Qd8": "Black is slightly worse, but the bishop pair and the f-file give him real play.",
        },
      },
      {
        name: "4.d4 exd4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d4 exd4 5.e5 d5 6.exd6 Qxd6 7.O-O Bd7 8.Re1+ Be7",
        notes: {
          "4.d4": "The most direct reply, opening the centre.",
          "4...exd4": "Black takes the central pawn. 4...fxe4 5.Nxe5 is worse.",
          "5.e5": "White gains space and hits d6.",
          "5...d5": "Challenges the bishop and the pawn chain.",
          "6.exd6": "En passant: White takes the d-pawn with the e-pawn.",
          "6...Qxd6": "Black's queen is active and eyes d4 and the long diagonal.",
          "7.O-O": "White castles and prepares Re1 with check.",
          "7...Bd7": "Develops while preparing to block the check on e7.",
          "8.Re1+": "A check on the open e-file.",
          "8...Be7": "Blocks the check. White is somewhat better, but Black has a solid position and active pieces.",
        },
      },
      {
        name: "Taking on f5: 4.exf5 e4",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.exf5 e4 5.Nd4 Nf6 6.Nxc6 dxc6 7.d3 Bxf5 8.Nc3 exd3",
        notes: {
          "4.exf5": "White takes a pawn. This is playable, but it gives Black a free hand.",
          "4...e4": "Gains time against the knight and opens lines.",
          "5.Nd4": "The knight jumps to the centre and hits c6.",
          "5...Nf6": "Develops and attacks nothing yet, but guards e4.",
          "6.Nxc6": "White trades the strong knight for Black's one.",
          "6...dxc6": "Black recaptures and opens the diagonal for the c8 bishop.",
          "7.d3": "White attacks the pawn on e4.",
          "7...Bxf5": "Black regains the pawn and develops.",
          "8.Nc3": "Develops and eyes the e4 pawn.",
          "8...exd3": "Black captures. The position is about level.",
        },
      },
      {
        name: "Warning: don't take on e4 after 4.d3",
        kind: "warning",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.d3 fxe4 5.dxe4 Nf6 6.Ng5 d5 7.exd5 Na5 8.Bd3 Qxd5 9.O-O Bg4 10.Qe1 O-O-O",
        notes: {
          "4...fxe4": "Too hasty: after dxe4 White has an open d-file and a healthy centre.",
          "5.dxe4": "White recaptures with a pawn and gets the d-file for free.",
          "5...Nf6": "Attacks e4, but White's next move is awkward for Black.",
          "6.Ng5": "The knight and the bishop on c4 now both point at f7.",
          "6...d5": "The only move to stop the threat; the alternatives lose faster.",
          "7.exd5": "White opens the position further.",
          "7...Na5": "Attacks the bishop.",
          "8.Bd3": "The bishop retreats to a safe square.",
          "8...Qxd5": "Black regains the pawn but White keeps a lead in development.",
          "9.O-O": "White castles with a clear edge.",
          "10.Qe1": "White keeps a firm grip on the position.",
        },
      },
    ],
  },
  {
    id: "albin-countergambit",
    title: "Albin Countergambit",
    side: "black",
    level: "intermediate",
    eco: "D08",
    summary:
      "1.d4 d5 2.c4 e5!?: Black answers the Queen's Gambit with a counter-punch, sacrificing a pawn for a cramping pawn on d4 and quick piece play. It is objectively dubious (White keeps a modest edge with accurate play), but the Lasker Trap wins a queen after the tempting 4.e3? and the main lines with 4.Nf3 Nc6 5.g3 are rich in counterplay.",
    ideas: [
      "After 3.dxe5 d4 the pawn on d4 cramps White's pieces; Black gets space and targets c3 and e3 with ...Bb4+ and ...Nge7.",
      "Develop with ...Nc6, ...Nge7 and ...Ng6 to win back the e5 pawn, instead of the usual ...Nf6, which loses a tempo to e5-e6 ideas.",
      "Lasker Trap: 4.e3? Bb4+ 5.Bd2 dxe3! 6.Bxb4? exf2+ 7.Ke2 fxg1=N+! wins the white queen; promote to a knight, not a queen.",
      "Don't fear the pawn deficit: after ...Ngxe5 Black often regains it, and the d4 pawn is hard for White to remove.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Albin Countergambit arises after 1.d4 d5 2.c4 e5!? 3.dxe5 d4. Black gives up a pawn for a space-gaining pawn on d4, a lead in activity and the chance to recapture e5 with the knights. It is objectively dubious, but the d4 pawn is hard to challenge and the opening is full of traps.",
      howToReach:
        "Play 1.d4 d5 2.c4 e5. If White takes with 3.dxe5, push 3...d4. Against 3.e3 or 3.Nc3 you are out of the gambit lines, so keep a second reply ready.",
      pros: [
        "Black gets a cramping pawn on d4 and easy piece play.",
        "The Lasker Trap is one of the best-known queen traps, and it still catches players.",
        "The setup with ...Nc6, ...Nge7 and ...Ng6 is natural and easy to remember.",
        "Many White players have little experience against it and may drift into a bad position.",
        "A real gambit with long-term compensation, not just a trap.",
      ],
      cons: [
        "Objectively dubious: with correct play (4.Nf3 and 5.g3 or 5.a3) White keeps a small edge.",
        "White can refuse the gambit with 3.e3 or 3.Nc3 and get a normal game.",
        "The d4 pawn can become a target if Black loses the initiative.",
        "You are a pawn down for a long time, so passive play is punished.",
      ],
      variations: [
        {
          name: "The Lasker Trap",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+ 8.Rxg1 Bg4+ 9.Kf2 Qxd1",
          text:
            "White takes the bishop and is promptly punished. The pawn promotes to a knight with check, and the bishop on g4 then wins the queen.",
        },
        {
          name: "Main line with 4.Nf3 and 5.g3",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.g3 Nge7 6.Bg2 Ng6 7.O-O Ngxe5 8.Nxe5 Nxe5",
          text:
            "The standard fight. Black regains the pawn, and White must find a plan against the knight on e5 and the strong pawn on d4.",
        },
        {
          name: "4.Nf3 Nc6 5.Nbd2",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.Nbd2 Nge7 6.a3 Ng6 7.Nb3 Be7 8.Nbxd4 Ncxe5 9.Nxe5 Nxe5 10.e3",
          text:
            "White targets the d4 pawn directly. Black gets a lead in development and use of the e5 square, but White is a pawn up.",
        },
        {
          name: "4.e3, the sound way",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.fxe3 Qh4+ 7.g3 Qe4 8.Nf3 Bg4 9.Bg2 Qxe3+ 10.Qe2 Qxe2+ 11.Kxe2 Nc6",
          text:
            "After 6.fxe3 (and not 6.Bxb4?) White is fine, but Black's pieces are very active and the position is about level.",
        },
      ],
      againstIt:
        "The soundest approach is 4.Nf3 Nc6 5.g3 or 5.a3, followed by Bg2, castling and a slow plan against the d4 pawn. Don't walk into the Lasker Trap with 4.e3? Bb4+ 5.Bd2 dxe3 6.Bxb4?, and don't push the pawns on the queenside without a reason.",
      plans: {
        white:
          "Develop quickly, castle, and try to blockade or win the d4 pawn, for example with Nb3 or e3 at the right time. Meet ...Ngxe5 with Nxe5 and keep the extra pawn if you can.",
        black:
          "Develop the knights to c6, e7 and g6 to win back e5, keep the pawn on d4 supported, and use the bishop on b4 and g4 for pins. Seek counterplay with ...Bg4, ...Qd7 and queenside castling.",
      },
      history:
        "The Albin Countergambit is named after the Romanian-born master Adolf Albin, who took it up in the 1890s. The Lasker Trap carries the name of the future world champion Emanuel Lasker. Strong players have used the gambit as a surprise weapon, but today it is more often seen at club level.",
      faq: [
        {
          q: "Is the Albin Countergambit good?",
          a:
            "It is objectively dubious: with best play White keeps a modest edge. But it is a rich, tactical opening with a long-term space advantage, and it scores well against opponents who do not know the key ideas.",
        },
        {
          q: "What is the Lasker Trap?",
          a:
            "After 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4?, the sequence 6...exf2+ 7.Ke2 fxg1=N+! 8.Rxg1 Bg4+ wins the white queen. White should play 6.fxe3 instead.",
        },
        {
          q: "Why promote to a knight in the Lasker Trap?",
          a:
            "A new queen on g1 would only trade queens with check and let White escape. The knight gives check and keeps the bishop on g4 ready to win the queen on d1.",
        },
        {
          q: "How should White decline the Albin?",
          a:
            "3.e3 and 3.Nc3 are the quiet ways. After 3.dxe5 d4 White can play 4.Nf3 with 5.g3, or 5.a3, and keep a small edge.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: Lasker Trap (4.e3? Bb4+)",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+ 8.Rxg1 Bg4+ 9.Kf2 Qxd1",
        notes: {
          "2...e5": "The Albin Countergambit: Black counterattacks the centre instead of defending d5.",
          "3...d4": "The key move: the pawn cramps White and is hard to attack.",
          "4.e3": "A natural attempt to open the position, but it allows tactics.",
          "4...Bb4+": "Check! White's best reply is 5.Nd2 or 5.Bd2.",
          "5.Bd2": "Blocks the check but sets up the Lasker Trap.",
          "5...dxe3": "Opens the d-file and threatens ...exf2+.",
          "6.Bxb4": "The mistake. White grabs the bishop, but 6.fxe3 was needed.",
          "6...exf2+": "The pawn takes with check, hitting the knight on g1.",
          "7.Ke2": "7.Kxf2? is also bad: 7...Qxd1 wins the queen.",
          "7...fxg1=N+": "The key underpromotion: a knight, not a queen, gives check and keeps the queen trap alive.",
          "8.Rxg1": "White takes the knight, but the d1-queen is now exposed.",
          "8...Bg4+": "A discovered attack on the king and the queen on d1.",
          "9.Kf2": "White's king moves, and the queen on d1 falls.",
          "9...Qxd1": "Black wins the queen and is winning.",
        },
      },
      {
        name: "Main line: 4.Nf3 Nc6 5.g3",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.g3 Nge7 6.Bg2 Ng6 7.O-O Ngxe5 8.Nxe5 Nxe5 9.Na3 c6 10.b3 Bc5",
        notes: {
          "4.Nf3": "The main move: it defends e5's capture and develops.",
          "4...Nc6": "Develops and attacks e5, adding to the pressure on the pawn.",
          "5.g3": "White fianchettoes to challenge the long diagonal.",
          "5...Nge7": "The knight heads for g6 to win back the e5 pawn. Not ...Nf6, which would drop a tempo.",
          "6.Bg2": "Develops and eyes the long diagonal.",
          "6...Ng6": "The knight attacks e5, which White cannot hold.",
          "7.O-O": "White castles.",
          "7...Ngxe5": "Black recoups the pawn.",
          "8.Nxe5": "White trades a pair of knights.",
          "8...Nxe5": "The knight is strong on e5 and eyes c4 and d3.",
          "9.Na3": "The knight heads for c2 or b5 to attack the d4 pawn.",
          "9...c6": "Supports d5 and makes room for the queen on b6 or the bishop on c7.",
          "10.b3": "Gives the bishop a diagonal to b2 and challenges d4.",
          "10...Bc5": "The bishop defends d4. White is slightly better, but Black has solid counterplay.",
        },
      },
      {
        name: "4.Nf3 Nc6 5.Nbd2: Black regains the pawn",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.Nbd2 Nge7 6.a3 Ng6 7.Nb3 Be7 8.Nbxd4 Ncxe5 9.Nxe5 Nxe5 10.e3",
        notes: {
          "5.Nbd2": "Heads for b3 to attack the d4 pawn.",
          "5...Nge7": "Prepares ...Ng6 and ...Nxe5.",
          "6.a3": "Stops ...Bb4 and prepares Nb3.",
          "6...Ng6": "The knight goes to g6 and hits e5.",
          "7.Nb3": "Attacks the pawn on d4 twice.",
          "7...Be7": "A calm developing move; the d4 pawn is now loose.",
          "8.Nbxd4": "White takes the d4 pawn and now has two extra pawns.",
          "8...Ncxe5": "Black recaptures e5 with a strong centralised knight.",
          "9.Nxe5": "White trades pieces.",
          "9...Nxe5": "The knight lands on e5 and eyes c4 and d3.",
          "10.e3": "Opens the bishop on f1. White is a pawn up but Black is better developed and has compensation.",
        },
      },
      {
        name: "5.a3 a5 and a quiet 6.e3",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.Nf3 Nc6 5.a3 a5 6.e3 Bc5 7.exd4 Bxd4 8.Be2 Nge7 9.O-O O-O",
        notes: {
          "5.a3": "Prevents ...Bb4+ and prepares b4. A popular try.",
          "5...a5": "Stops b4, which would drive the knight away.",
          "6.e3": "White tries to open the position and destroy the d4 pawn.",
          "6...Bc5": "Puts pressure on e3 and d4.",
          "7.exd4": "White removes the d4 pawn.",
          "7...Bxd4": "Black regains the pawn with a nice centralised bishop.",
          "8.Be2": "Develops and prepares to castle.",
          "8...Nge7": "Develops with ideas of ...Ng6 and ...Ncxe5.",
          "9.O-O": "White castles.",
          "9...O-O": "Black has equalised; the bishop on d4 is a strong piece.",
        },
      },
      {
        name: "4.e3 Bb4+ 5.Bd2 dxe3 6.fxe3 Qh4+",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.fxe3 Qh4+ 7.g3 Qe4 8.Nf3 Bg4 9.Bg2 Qxe3+ 10.Qe2 Qxe2+ 11.Kxe2 Nc6",
        notes: {
          "6.fxe3": "The correct recapture, and 6...Qh4+ is Black's answer.",
          "6...Qh4+": "Check! The queen exploits the weakened kingside.",
          "7.g3": "Forced; 7.Ke2? Qxc4+ is bad for White.",
          "7...Qe4": "The queen centralises and attacks the pawn on e3 and the rook on h1.",
          "8.Nf3": "Develops and protects the e5 pawn.",
          "8...Bg4": "Pins the knight on f3 and adds to the pressure on e3.",
          "9.Bg2": "Attacks the queen on e4.",
          "9...Qxe3+": "The bishop on d2 is pinned, so the queen takes with check.",
          "10.Qe2": "White offers a queen trade.",
          "10...Qxe2+": "Black trades queens.",
          "11.Kxe2": "The king is exposed, but White's position holds.",
          "11...Nc6": "Black has slightly the better of it, thanks to the lead in development.",
        },
      },
      {
        name: "Warning: promote to a knight, not a queen",
        kind: "warning",
        moves: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=Q 8.Qxd8+ Kxd8 9.Rxg1",
        notes: {
          "7...fxg1=Q": "A natural-looking mistake. Black wins a rook and a queen but loses it all back.",
          "8.Qxd8+": "White trades queens with check.",
          "8...Kxd8": "Forced.",
          "9.Rxg1": "White has the extra piece and is at least equal. 7...fxg1=N+! was the only winning move.",
        },
      },
    ],
  },
  {
    id: "budapest-gambit",
    title: "Budapest Gambit",
    side: "black",
    level: "intermediate",
    eco: "A51-A52",
    summary:
      "1.d4 Nf6 2.c4 e5!?: Black offers a pawn at once, aiming to win it back with ...Ng4 and ...Nxe5 and to get quick, active piece play. Objectively White keeps a small edge (about half a pawn) with accurate play, but the gambit is sound enough for serious use and hides the Kieninger Trap: 7.a3? Ngxe5 8.axb4?? Nd3#.",
    ideas: [
      "After 3.dxe5 Ng4 the pawn on e5 is hard to hold: ...Nc6, ...Bb4+ and ...Qe7 pile up on it, and Black almost always regains it.",
      "Kieninger Trap: 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3? Ngxe5! 8.axb4?? Nd3# - a smothered mate with the king boxed in by its own pieces.",
      "Against 4.Bf4 and 4.Nf3 the setup is the same: ...Nc6, ...Bb4+ and ...Qe7; against 4.e4 recapture on e5 with the other knight and develop.",
      "Be honest: if White finds the best moves (the knight to d2, not c3, and the right pawn moves), Black is simply a little worse for a long time.",
    ],
    style: "Gambit",
    article: {
      whatIs:
        "The Budapest Gambit begins 1.d4 Nf6 2.c4 e5, offering a pawn immediately. After 3.dxe5 Ng4 Black attacks e5 and plans to win it back, so the real price is some tempi and a slightly worse position. It is a respectable surprise weapon against d4 players, with an unusually popular quick win in the Kieninger Trap.",
      howToReach:
        "Play 1.d4 Nf6 2.c4 e5. If White takes with 3.dxe5, play 3...Ng4. If White declines with 3.e3 or 3.d5, you are out of the gambit and have to play a normal game.",
      pros: [
        "Fast piece play: the knight, bishop and queen all come to the centre with tempo.",
        "A short, forcing opening with a clear plan, so there is little to memorise.",
        "The Kieninger Trap (a mate in the opening) catches careless opponents.",
        "Sound enough that Black rarely falls into a lost position by force.",
        "A change from the main defences to 1.d4; good for players who want a sharp but real opening.",
      ],
      cons: [
        "Objectively White keeps a small but lasting advantage.",
        "White can avoid the gambit with 3.d5 or 3.e3 (the latter is rare).",
        "Black is a pawn down for a while if White finds the best defence, such as Bf4 followed by Nd2.",
        "Some lines require precise play, and the early bishop check on b4 can lose time.",
      ],
      variations: [
        {
          name: "Kieninger Trap",
          pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3 Ngxe5 8.axb4 Nd3#",
          text:
            "White takes the bishop and walks into a smothered mate. The knight on d3 attacks e1 and the e2 pawn is pinned by the queen.",
        },
        {
          name: "Main line: 7.e3 Ngxe5",
          pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.e3 Ngxe5 8.Nxe5 Nxe5 9.Be2 b6 10.O-O Bxd2 11.Qxd2 d6 12.Rac1 O-O",
          text:
            "The usual way to avoid the trap. Black has regained the pawn and has a reasonable game, but White keeps a small edge.",
        },
        {
          name: "7.a3 Ngxe5 8.Nxe5",
          pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3 Ngxe5 8.Nxe5 Nxe5 9.e3 Bxd2+ 10.Qxd2 d6 11.Be2 O-O",
          text:
            "White sees the trap and recaptures on e5 first. The knight on e5 stays strong and Black is not worse in activity.",
        },
        {
          name: "6.Nc3 and 8.Qd5",
          pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nc3 Bxc3+ 7.bxc3 Qe7 8.Qd5 f6 9.exf6 Nxf6 10.Qd3 d6",
          text:
            "A more testing line. White gets the bishop pair and doubled pawns, but Black has a lead in development and plays ...f6 to open the position.",
        },
        {
          name: "4.e4 Nxe5",
          pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.e4 Nxe5 5.f4 Nec6 6.a3 g6 7.Nc3 Bg7 8.Nf3 Bxc3+ 9.bxc3",
          text:
            "White builds a big centre. Black attacks it with ...g6, ...Bg7 and ...d6, and the position is sharp but fine for Black.",
        },
      ],
      againstIt:
        "The most reliable plan is 4.Bf4 Nc6 5.Nf3, then Nbd2 (not Nc3) and e3 or a3 to meet ...Bb4+ and ...Qe7. White must avoid taking the bishop on b4 at the wrong moment: 7.a3?? Ngxe5 8.axb4?? Nd3# is mate. 3.d5 and 3.e3 avoid the gambit altogether.",
      plans: {
        white:
          "Develop with Bf4, Nf3 and Nbd2, meet ...Bb4+ with Nbd2 and keep the king safe. Try to keep the extra pawn on e5, or give it back for a lasting edge in space and development.",
        black:
          "Win the pawn back with ...Nc6, ...Ng4xe5 and develop with ...Bb4+, ...Qe7 and ...d6. Castle quickly, trade pieces if you are fine, and look for tactics on the e-file and e1-h4 diagonal.",
      },
      history:
        "The gambit takes its name from the city of Budapest, where it appeared in master games in the 1890s. It had its heyday in the 1920s, when several strong masters tried it. Since then 3.dxe5 Ng4 4.Bf4 has been seen as giving White a small edge, so the Budapest is mostly a surprise weapon. The Kieninger Trap is named after the master Georg Kieninger.",
      faq: [
        {
          q: "Is the Budapest Gambit good?",
          a:
            "It is a respectable, sound surprise weapon rather than a refuted gimmick. White can keep a small advantage with accurate play, but Black gets easy development and real counterplay.",
        },
        {
          q: "What is the Kieninger Trap?",
          a:
            "After 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3? Ngxe5 8.axb4?? the knight jumps to d3 and it is checkmate, because the pinned e2 pawn and the king's own pieces leave no escape.",
        },
        {
          q: "How should White decline the Budapest?",
          a:
            "3.d5 and 3.e3 are the main ways. The best is to accept the pawn with 3.dxe5 Ng4 4.Bf4 and play Nf3 and Nbd2 with care.",
        },
        {
          q: "Why not play 3...Ne4 instead of 3...Ng4?",
          a:
            "The knight on e4 can be kicked with Nd2 or Qc2, but 3...Ng4 attacks e5 more directly and prepares ...Nc6 and ...Nxe5 in one move.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: Kieninger Trap",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3 Ngxe5 8.axb4 Nd3#",
        notes: {
          "2...e5": "The Budapest Gambit. Black offers a pawn and will win it back by force.",
          "3.dxe5": "White takes the pawn, which is what the gambit wants.",
          "3...Ng4": "The knight attacks e5 and heads for the centre.",
          "4.Bf4": "The most testing move: it defends the extra pawn.",
          "4...Nc6": "Adds a second attacker on e5.",
          "5.Nf3": "Develops and defends the pawn on e5.",
          "5...Bb4+": "Check! It develops with tempo and sets the trap.",
          "6.Nbd2": "The usual, correct block (6.Nc3 is the alternative).",
          "6...Qe7": "A third attacker on e5, and it pins the pawn on e2 once the knight moves.",
          "7.a3": "This attacks the bishop, but it sets a deadly trap.",
          "7...Ngxe5": "The key move: the knight takes e5 and eyes d3.",
          "8.axb4": "The mistake: grabbing the bishop. 8.Nxe5 Nxe5 would have been fine.",
          "8...Nd3#": "Checkmate! The e2 pawn is pinned by the queen, and the king's own pieces block every escape.",
        },
      },
      {
        name: "Main line: 7.e3 Ngxe5",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.e3 Ngxe5 8.Nxe5 Nxe5 9.Be2 b6 10.O-O Bxd2 11.Qxd2 d6 12.Rac1 O-O",
        notes: {
          "7.e3": "The solid reply: it opens the bishop on f1 and avoids tricks.",
          "7...Ngxe5": "Black takes back the pawn. The knight on e5 has great scope.",
          "8.Nxe5": "White trades a pair of knights.",
          "8...Nxe5": "The knight is attacked by the bishop on f4 but is protected by the queen.",
          "9.Be2": "White develops, with an eye on castling.",
          "9...b6": "Prepares to develop the bishop to b7 and puts pressure on the long diagonal.",
          "10.O-O": "White castles.",
          "10...Bxd2": "Black gives up the bishop to remove a defender of the knight on e5.",
          "11.Qxd2": "White recaptures.",
          "11...d6": "Strengthens the knight on e5.",
          "12.Rac1": "White puts the rook on the open file.",
          "12...O-O": "Black has a solid position. White has a slight edge but Black is safe.",
        },
      },
      {
        name: "7.a3 Ngxe5 8.Nxe5 Nxe5",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7 7.a3 Ngxe5 8.Nxe5 Nxe5 9.e3 Bxd2+ 10.Qxd2 d6 11.Be2 O-O",
        notes: {
          "8.Nxe5": "White recaptures on e5 first, dodging the mate trap.",
          "8...Nxe5": "The knight still has f3 and d3 ideas, and the bishop on b4 is attacked.",
          "9.e3": "Protects the bishop on f4 and opens the bishop on f1.",
          "9...Bxd2+": "Black takes the knight, since the bishop on b4 is attacked by the a3 pawn.",
          "10.Qxd2": "White recaptures with the queen.",
          "10...d6": "Solid. Black is ready to castle and has a good position.",
          "11.Be2": "Develops with the idea of castling.",
          "11...O-O": "Black is fully developed and equal.",
        },
      },
      {
        name: "6.Nc3 Bxc3+ 7.bxc3 Qe7",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nc3 Bxc3+ 7.bxc3 Qe7 8.Qd5 f6 9.exf6 Nxf6 10.Qd3 d6",
        notes: {
          "6.Nc3": "A critical alternative: White accepts doubled pawns for the bishop pair.",
          "6...Bxc3+": "Black trades the bishop for the knight and wrecks White's pawns.",
          "7.bxc3": "White has doubled c-pawns but a big centre.",
          "7...Qe7": "Attacks the e5 pawn again and eyes the e-file.",
          "8.Qd5": "Attacks the knight on g4 and the pawn on b7 at the same time.",
          "8...f6": "Strikes at the e5 pawn and opens the f-file.",
          "9.exf6": "White takes.",
          "9...Nxf6": "Black recaptures with a developed knight.",
          "10.Qd3": "The queen retreats to a safe square.",
          "10...d6": "Black has good development for the pawn, and White's structure is damaged.",
        },
      },
      {
        name: "4.Nf3 Nc6 5.Nc3: the bishop on c5",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Nf3 Nc6 5.Nc3 Bc5 6.e3 O-O 7.a3 a5 8.Bd3 Ngxe5 9.Nxe5 Nxe5",
        notes: {
          "4.Nf3": "Develops quickly, but gives up the Bf4 plan.",
          "4...Nc6": "Piles up on e5.",
          "5.Nc3": "A natural developing move.",
          "5...Bc5": "Develops with an eye on f2 and a safe retreat from a3.",
          "6.e3": "Frees the bishop on f1 and defends the knight.",
          "6...O-O": "Black castles to complete the development.",
          "7.a3": "A useful waiting move.",
          "7...a5": "Stops b4 and keeps the bishop on c5.",
          "8.Bd3": "Develops and prepares to castle.",
          "8...Ngxe5": "Black regains the pawn.",
          "9.Nxe5": "White trades.",
          "9...Nxe5": "The knight attacks the bishop on d3. Black is fine and equal.",
        },
      },
      {
        name: "4.e4 Nxe5: White builds a centre",
        moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.e4 Nxe5 5.f4 Nec6 6.a3 g6 7.Nc3 Bg7 8.Nf3 Bxc3+ 9.bxc3",
        notes: {
          "4.e4": "White takes space in the centre and defends the extra pawn.",
          "4...Nxe5": "Black takes the pawn with the knight; the knight is attacked by f4 next.",
          "5.f4": "White kicks the knight and builds a big centre.",
          "5...Nec6": "Keeps the knights flexible; 5...Ng6 also works.",
          "6.a3": "Stops ...Bb4+ and prepares to build with b4.",
          "6...g6": "Black fianchettoes to hit the centre with ...Bg7 and ...d6.",
          "7.Nc3": "Develops and defends the e4 pawn.",
          "7...Bg7": "Puts pressure on the long diagonal and on c3.",
          "8.Nf3": "Develops.",
          "8...Bxc3+": "Black damages the white structure.",
          "9.bxc3": "White has the bishop pair and a big centre, but Black is solid.",
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
    style: "Trap-heavy",
    article: {
      whatIs:
        "A collection of short, famous opening traps: Scholar's Mate, Fool's Mate, Légal's Mate, the Blackburne Shilling, the Englund and Budapest traps, the Elephant and Lasker traps, Noah's Ark, the Fried Liver and the Milner-Barry queen trap. Each line shows the tempting blunder and the punishment, so you can spot them from either side of the board.",
      howToReach:
        "There is no single move order; each trap starts from a different opening, for example 1.e4 e5 (Légal, Blackburne, Scholar's), 1.d4 d5 2.c4 (Elephant, Lasker) or 1.e4 c6 (the Caro-Kann smothered mate).",
      pros: [
        "Quick, memorable puzzles that train your tactical eye.",
        "You learn what not to do as well as how to win.",
        "Many traps work at club level because players move too fast.",
        "Each line is short, so it is perfect for daily practice.",
        "The patterns (a smothered mate, a pinned knight, a fork) appear again and again in real games.",
      ],
      cons: [
        "Strong opponents won't fall for them, so you can't rely on traps alone.",
        "Some traps only work against one specific mistake.",
        "Traps aren't a full opening repertoire; you still need sound opening knowledge.",
      ],
      variations: [
        {
          name: "Légal's Mate",
          pgn: "1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#",
          text:
            "White sacrifices the queen: the pinned-looking knight on f3 is not really pinned. Three minor pieces deliver a mate.",
        },
        {
          name: "Blackburne Shilling Gambit",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#",
          text:
            "If White grabs the e5 pawn, Black gets a decisive attack and a smothered mate. White should play 4.Nxd4 or 4.O-O instead.",
        },
        {
          name: "Englund Gambit Trap",
          pgn: "1.d4 e5 2.dxe5 Nc6 3.Nf3 Qe7 4.Bf4 Qb4+ 5.Bd2 Qxb2 6.Bc3 Bb4 7.Qd2 Bxc3 8.Qxc3 Qc1#",
          text:
            "A natural-looking attack on the queen loses to a back-rank mate. White must avoid 6.Bc3 and 7.Qd2.",
        },
        {
          name: "Elephant Trap",
          pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8",
          text:
            "Taking the apparently loose pawn on d5 loses a piece: the pinned knight isn't really pinned and a check wins the queen back.",
        },
        {
          name: "Lasker Trap",
          pgn: "1.d4 d5 2.c4 e5 3.dxe5 d4 4.e3 Bb4+ 5.Bd2 dxe3 6.Bxb4 exf2+ 7.Ke2 fxg1=N+",
          text:
            "In the Albin Countergambit, a rare underpromotion to a knight wins material after the careless 4.e3.",
        },
      ],
      againstIt:
        "Traps rely on greed (grabbing a poisoned pawn), haste (ignoring a threat to f7 or f2) or unfamiliarity with a pin. Before you take any 'free' pawn or piece, ask what the opponent's last move threatened.",
      plans: {
        white:
          "Develop calmly and check each capture: if a pawn or piece seems to hang for free, look for forks, pins, discovered attacks and back-rank checks before you take it.",
        black:
          "Prepare simple traps (Blackburne, Englund, Légal) but never play a move you wouldn't be happy to play if the opponent doesn't fall for the trick.",
      },
      history:
        "Légal's Mate is named after the French player Sire de Légal (1702-1792), who was Philidor's teacher and is said to have played it in a game around 1750. The Blackburne Shilling Gambit is named for the English master Joseph Henry Blackburne, who reportedly won shillings from unsuspecting amateurs with it. Fool's Mate is the shortest possible checkmate in chess.",
      faq: [
        {
          q: "Are opening traps worth learning?",
          a:
            "Yes, as long as you also learn sound opening principles. Traps teach tactical patterns, and they work well in quick games against weaker opponents.",
        },
        {
          q: "What is the fastest checkmate in chess?",
          a:
            "Fool's Mate takes only two moves from each side: 1.f3 e5 2.g4 Qh4#. It only happens if White plays two very weak moves.",
        },
        {
          q: "What is the Scholar's Mate and how do I stop it?",
          a:
            "It is the four-move mate 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#. Defend f7, for example with ...g6 or ...Qe7, and develop your pieces.",
        },
        {
          q: "What is the Englund Gambit?",
          a:
            "It is the line 1.d4 e5, in which Black sacrifices a pawn for quick development. It is risky against good play but has several nasty traps for the unwary.",
        },
      ],
    },
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
