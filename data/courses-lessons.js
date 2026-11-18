// Beginner lessons (e.g. opening principles). Same format as data/courses.js; shown first in the catalogue.
// Validated and merged by scripts/validate.js.
//
// Opening principles teaches the habits behind every opening through real moves. Each trained line shows one
// principle at work; the warning lines show a principle broken and punished. All White moves share one answer
// per position (1.e4 and then the reply to Black's choice), so the lines can be drilled together.

module.exports = [
  {
    id: "opening-principles",
    title: "Opening Principles",
    side: "white",
    level: "beginner",
    eco: "B01-C54",
    summary:
      "Start here. Six short lines, each teaching one habit that every good opening is built on: take the centre, bring out your knights and bishops, castle, don't waste time, keep the queen home, and don't grab pawns while your pieces are asleep.",
    ideas: [
      "Fight for the centre with pawns (e4 and d4), then put your pieces where they can see it.",
      "Develop knights and bishops early, each one once, toward the middle of the board.",
      "Castle in the first ten moves, then connect your rooks by clearing the back rank.",
      "Keep the queen at home: she has more to lose than any other piece when she is chased.",
      "A pawn you grab with undeveloped pieces can cost you the game.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "Opening principles are the handful of habits that sit behind every sound opening: take space in the centre, bring your pieces out, castle your king to safety and keep your queen at home until she has a job. This course teaches them by playing real moves, so you can watch each habit work and see what happens to a player who ignores it. Learn these first and every named opening you meet later will make more sense.",
      howToReach:
        "There is nothing special to reach. You always start with 1.e4, and whatever Black replies you do the same few things: claim the centre, develop, castle. The lines here show the plan against the replies you will meet most often.",
      pros: [
        "Habits transfer: the same ideas work in the Italian, the London, the Queen's Gambit and every opening you learn after this.",
        "Almost no memorising. Each line is short and every move comes with the reason for it.",
        "You see the principles break: three warning lines show a player who ignores one and gets punished.",
        "It gives you a safe plan for the first ten moves even when your opponent plays something you have never seen.",
        "Every line uses 1.e4, so it also introduces the most common first move at club and school level.",
      ],
      cons: [
        "Principles are guidelines, not laws. Strong players break them for a concrete reason, and you will too once you know why.",
        "The lines are examples of habits, not a complete repertoire: you still need an opening for each job (see the next steps on the Start here page).",
        "Opponents who play the principles badly can still surprise you, so keep checking for threats on every move.",
      ],
      variations: [
        {
          name: "Centre pawns: e4 and d4",
          pgn: "1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Be7 6.Be2 O-O 7.O-O",
          text:
            "White plants pawns on e4 and d4, recaptures with a knight that lands on a central square, and develops with a purpose. Both sides castle and the game is level, but White has more space.",
        },
        {
          name: "Develop toward the centre",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Be7 5.Nc3 O-O 6.Bg5 d6 7.O-O",
          text:
            "Two knights and two bishops are out by move six, each one placed where it eyes the centre, and the king is castled by move seven.",
        },
        {
          name: "Black brings the queen out early",
          pgn: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6 8.O-O",
          text:
            "Black's queen spends two of her first three moves running from a knight. White develops with each of those moves and ends up with the more comfortable game.",
        },
        {
          name: "Don't grab with undeveloped pieces",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxd4 exd4 5.O-O d6 6.d3 Nf6 7.Nd2 Be7 8.Nf3",
          text:
            "Against the Blackburne Shilling trap you do not need to grab anything: trade the knight, castle and keep developing. You end up a little better with a safe king.",
        },
      ],
      againstIt:
        "The best answer to a principled player is to follow the principles too: take your share of the centre, develop and castle. Black can fight back with ...d5 at the right moment, as the Black companion course shows, but cannot easily punish a player who simply plays these moves with care.",
      plans: {
        white:
          "Play 1.e4, develop a knight to f3, then bring the bishop out and the second knight toward the centre. Castle by move seven or eight, connect your rooks by moving the queen off the back rank, and only then start to look for a plan.",
        black:
          "Mirror the same ideas: a centre pawn (...e5 or ...d5), knights and bishops out, castle, then break in the centre with ...d5 when your pieces are ready. The Black companion course walks through it.",
      },
      history:
        "Written rules for the opening go back to the 18th and 19th centuries. Writers such as Philidor, Staunton and later Steinitz and Nimzowitsch explained why central control and quick development win games. Modern engines have found many exceptions, but the basic advice still describes what most good opening play does.",
      faq: [
        {
          q: "What are the main opening principles?",
          a:
            "Fight for the centre with pawns, develop your knights and bishops, castle early, avoid moving the same piece twice without a reason, keep your queen at home, connect your rooks, and don't grab pawns while your pieces are undeveloped.",
        },
        {
          q: "Do I have to follow the principles in every game?",
          a:
            "No. They are the right default. You may break one when you can see a concrete reason, such as a tactic that wins material, or when an opponent's threat has to be answered.",
        },
        {
          q: "Is it ever right to bring the queen out early?",
          a:
            "Sometimes, when she attacks something that matters and cannot be chased away. For a beginner the safe habit is to develop your minor pieces first, because an early queen usually just loses time.",
        },
        {
          q: "What should I learn after the principles?",
          a:
            "Pick one opening as White and one answer to 1.e4 and to 1.d4 as Black. The Start here page lays out an order that goes from the principles to one opening for each job.",
        },
      ],
    },
    lines: [
      {
        name: "Fight for the centre with pawns",
        moves: "1.e4 e5 2.Nf3 d6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Be7 6.Be2 O-O 7.O-O",
        notes: {
          "1.e4": "Start by claiming the centre with a pawn. It takes space, frees your queen and bishop and controls d5 and f5.",
          "1...e5": "Black fights for the centre with the same idea.",
          "2.Nf3": "A knight comes out and attacks e5 at the same time. Developing with a threat is a good habit.",
          "2...d6": "Black defends e5 with a pawn. Solid, but it leaves Black a little cramped.",
          "3.d4": "A second centre pawn. With pawns on e4 and d4 you hold the middle and challenge e5.",
          "3...exd4": "Black trades off your d-pawn, which opens the centre.",
          "4.Nxd4": "Recapture with the knight so it lands on a strong central square. Pieces belong where they see the most of the board.",
          "4...Nf6": "Black develops and attacks the e4 pawn.",
          "5.Nc3": "Another developing move that also defends e4. Knight, central pawn, one move.",
          "5...Be7": "Black gets ready to castle.",
          "6.Be2": "The bishop steps out of the way so you can castle. Simple and sensible.",
          "6...O-O": "Black castles.",
          "7.O-O": "Your king is safe, every piece you moved had a job, and you kept more space in the centre.",
        },
      },
      {
        name: "Develop knights and bishops toward the centre",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 Be7 5.Nc3 O-O 6.Bg5 d6 7.O-O",
        notes: {
          "1.e4": "The centre pawn again.",
          "1...e5": "Black copies you.",
          "2.Nf3": "Knights first: a knight on f3 looks at the centre and attacks e5.",
          "2...Nc6": "Black defends e5 with a developing move.",
          "3.Bc4": "The bishop uses the open diagonal and points at f7, a square only Black's king guards.",
          "3...Nf6": "Black develops a second piece.",
          "4.d3": "A quiet pawn move that protects e4 and frees your c1 bishop to come out.",
          "4...Be7": "Black prepares to castle.",
          "5.Nc3": "The second knight comes out. From c3 it watches e4 and d5.",
          "5...O-O": "Black castles.",
          "6.Bg5": "The last minor piece is out. From g5 it pins the f6 knight against the bishop on e7.",
          "6...d6": "Black opens a path for the c8 bishop.",
          "7.O-O": "Four minor pieces developed, king castled. This is what a healthy opening looks like.",
        },
      },
      {
        name: "Castle early, then connect your rooks",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.d3 d6 5.O-O Be7 6.Nc3 O-O 7.Be3 Re8 8.Qd2 a6 9.Rad1",
        notes: {
          "1.e4": "Take space in the centre.",
          "1...e5": "Black does the same.",
          "2.Nf3": "Develop with a threat on e5.",
          "2...Nc6": "Black defends and develops.",
          "3.Bc4": "The bishop aims at f7.",
          "3...Nf6": "Black develops a second piece.",
          "4.d3": "Protects e4 and opens the c1 bishop.",
          "4...d6": "Black builds a solid pawn wall.",
          "5.O-O": "Castle as soon as you can. In one move the king goes behind its pawns and a rook leaves the corner.",
          "5...Be7": "Black gets ready to castle too.",
          "6.Nc3": "Knights and bishops come out before you start making plans.",
          "6...O-O": "Black castles.",
          "7.Be3": "The last minor piece joins in. Now b1 and c1 are empty, so only the queen is left in the way of your rooks.",
          "7...Re8": "Black puts a rook on e8, behind the e-pawn.",
          "8.Qd2": "The queen steps off d1. Now your two rooks can see each other along the back rank: they are connected.",
          "8...a6": "Black makes a spare move.",
          "9.Rad1": "Connected rooks can go to the best files and protect each other. This one takes the d-file.",
        },
      },
      {
        name: "Don't move the same piece twice without a reason",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O a6 7.Bb3 O-O 8.Nbd2 Ba7",
        notes: {
          "1.e4": "Centre pawn.",
          "1...e5": "Black answers in kind.",
          "2.Nf3": "Develop with a threat.",
          "2...Nc6": "Black develops and defends.",
          "3.Bc4": "Bishop to its best diagonal in one move. It does not need to move again yet.",
          "3...Bc5": "Black's bishop comes out to a matching square.",
          "4.c3": "A pawn move, but it has a plan: it prepares d4 and gives the bishop a retreat on b3 or c2.",
          "4...Nf6": "Black attacks e4.",
          "5.d3": "Defends e4 and keeps the centre solid.",
          "5...d6": "Black defends e5 and opens the c8 bishop.",
          "6.O-O": "King safe. Now the pieces can start manoeuvring.",
          "6...a6": "Black asks the bishop a question: ...b5 would kick it and gain time.",
          "7.Bb3": "This is the second bishop move, and it has a reason. It keeps the bishop on the diagonal and stops ...b5 from winning a tempo.",
          "7...O-O": "Black castles.",
          "8.Nbd2": "The last piece develops: a new piece joining in is worth more than moving an old one again.",
          "8...Ba7": "Black's bishop also makes a second move, tucking away on a7 where a future d4 cannot hit it. A second move is fine when it has a purpose; the habit is to ask 'why?' every time.",
        },
      },
      {
        name: "Don't bring the queen out early",
        moves: "1.e4 d5 2.exd5 Qxd5 3.Nc3 Qa5 4.d4 Nf6 5.Nf3 c6 6.Bc4 Bf5 7.Bd2 e6 8.O-O",
        notes: {
          "1.e4": "The usual centre pawn.",
          "1...d5": "Black challenges the e4 pawn at once.",
          "2.exd5": "Take the pawn. Black usually recaptures with the queen.",
          "2...Qxd5": "The queen comes out on move two. This is the thing to watch: a queen in the middle can be chased.",
          "3.Nc3": "You develop a knight and attack the queen in the same move. Black has to answer the attack, so you gain a tempo.",
          "3...Qa5": "The queen runs. She has moved twice and no other Black piece is developed.",
          "4.d4": "A second centre pawn while Black is busy with the queen.",
          "4...Nf6": "Black finally develops a piece.",
          "5.Nf3": "Develop and guard the centre.",
          "5...c6": "Black spends a move on a pawn to give the position some shape.",
          "6.Bc4": "The bishop comes out on an open diagonal.",
          "6...Bf5": "Black develops the bishop, which is a good move.",
          "7.Bd2": "Another piece developed, and it clears the way to castle.",
          "7...e6": "Black closes the bishop's diagonal and prepares to develop the rest.",
          "8.O-O": "Castled with all your pieces in play. White has a comfortable, slightly better game, mostly because Black's early queen cost time.",
        },
      },
      {
        name: "Don't grab pawns while your pieces are asleep",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxd4 exd4 5.O-O d6 6.d3 Nf6 7.Nd2 Be7 8.Nf3",
        notes: {
          "1.e4": "Centre pawn.",
          "1...e5": "Black answers with the same move.",
          "2.Nf3": "Develop and attack e5.",
          "2...Nc6": "Black defends.",
          "3.Bc4": "Develop the bishop toward f7.",
          "3...Nd4": "A trap. Black leaves e5 hanging on purpose, hoping you'll go grabbing pawns (this is the Blackburne Shilling).",
          "4.Nxd4": "Calm answer: trade the knight off. You do not have to take anything greedy, and your pieces stay active.",
          "4...exd4": "Black recaptures. The pawn on d4 is now a target.",
          "5.O-O": "Castle first. A safe king is worth more than any pawn.",
          "5...d6": "Black defends and opens the c8 bishop.",
          "6.d3": "Solid. It also gives the c1 bishop a diagonal.",
          "6...Nf6": "Black develops and attacks e4.",
          "7.Nd2": "A knight heads for f3, where it will attack the d4 pawn. One reroute with a purpose is fine.",
          "7...Be7": "Black prepares to castle.",
          "8.Nf3": "The knight lands on f3 and hits the d4 pawn. White is a little better with no risk.",
        },
      },
      {
        name: "Warning: the early queen (Qh5)",
        kind: "warning",
        moves: "1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6",
        notes: {
          "1.e4": "A fine start.",
          "1...e5": "Black takes a share of the centre.",
          "2.Qh5": "Mistake. The queen comes out on move two with no support. She attacks e5, but Black can defend it with a developing move and the queen will have to run.",
          "2...Nc6": "Black defends e5 and develops in one move.",
          "3.Bc4": "White develops a bishop and now threatens Qxf7#.",
          "3...g6": "Black attacks the queen with a pawn. She has to move again.",
          "4.Qf3": "The queen retreats. She has moved twice and Black has not had to give anything up.",
          "4...Nf6": "Black develops another piece. White's queen is out of play and Black is ahead in development. It is not lost, but it is a bad way to begin.",
        },
      },
      {
        name: "Warning: grabbing pawns, undeveloped (Blackburne Shilling)",
        kind: "warning",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Nd4 4.Nxe5 Qg5 5.Nxf7 Qxg2 6.Rf1 Qxe4+ 7.Be2 Nf3#",
        notes: {
          "1.e4": "A fine start.",
          "1...e5": "Black takes a share of the centre.",
          "2.Nf3": "Develop with a threat on e5.",
          "2...Nc6": "Black defends.",
          "3.Bc4": "The bishop eyes f7.",
          "3...Nd4": "Black offers the e5 pawn as bait.",
          "4.Nxe5": "Taking is not the problem here. White can still be fine.",
          "4...Qg5": "Black attacks the knight on e5 and the g2 pawn at once.",
          "5.Nxf7": "Mistake. It looks great: the knight forks the queen and the rook on h8. But White has grabbed two pawns and still has only one piece developed and the king in the middle.",
          "5...Qxg2": "The queen takes with a double attack on h1 and f1.",
          "6.Rf1": "The only way to keep the rook.",
          "6...Qxe4+": "Check on the open e-file.",
          "7.Be2": "Forced blocks, but the bishop is now pinned.",
          "7...Nf3#": "Checkmate. White won two pawns and then lost the game, because the king never got out of the centre.",
        },
      },
      {
        name: "Warning: the king stuck in the centre (Morphy's Opera Game)",
        kind: "warning",
        moves:
          "1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7 8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8 13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8#",
        notes: {
          "1.e4": "A fine start.",
          "1...e5": "Black takes a share of the centre.",
          "2.Nf3": "Develop with a threat on e5.",
          "2...d6": "Black defends e5 with a pawn.",
          "3.d4": "A second centre pawn, challenging e5.",
          "3...Bg4": "Black pins the f3 knight but has not castled or developed much.",
          "4.dxe5": "White opens the centre.",
          "4...Bxf3": "Black trades the bishop for the knight.",
          "5.Qxf3": "The queen recaptures and eyes f7.",
          "5...dxe5": "Black recaptures.",
          "6.Bc4": "The bishop joins the attack on f7.",
          "6...Nf6": "Black defends f7 by developing a piece, and attacks e4.",
          "7.Qb3": "A double attack on b7 and f7.",
          "7...Qe7": "Black defends f7 but the queen now blocks the f8 bishop. The king cannot castle.",
          "8.Nc3": "White develops another piece; Black's pieces are still at home.",
          "8...c6": "Black protects b7.",
          "9.Bg5": "Pins the f6 knight to the queen.",
          "9...b5": "Black attacks the bishop. It looks like a threat but it's a mistake that opens the position even more for White.",
          "10.Nxb5": "White sacrifices a knight to open lines against the king.",
          "10...cxb5": "Black takes.",
          "11.Bxb5+": "Check. White is giving up material because every move brings a piece closer to the king.",
          "11...Nbd7": "Black blocks the check, but the d7 knight is now pinned.",
          "12.O-O-O": "White castles with tempo: the rook lands on d1 and attacks the pinned knight.",
          "12...Rd8": "Black defends it.",
          "13.Rxd7": "The rook takes the pinned knight.",
          "13...Rxd7": "Black recaptures.",
          "14.Rd1": "The second rook joins in and adds another attacker to the d7 rook, which the bishop on b5 is already pinning.",
          "14...Qe6": "Black tries to break the pin.",
          "15.Bxd7+": "The bishop takes with check.",
          "15...Nxd7": "Black recaptures.",
          "16.Qb8+": "A queen sacrifice that forces the knight away.",
          "16...Nxb8": "Black has to take.",
          "17.Rd8#": "Checkmate. White gave up the queen and a pile of pieces, and won because every White piece was in the attack while most Black pieces never left home.",
        },
      },
    ],
  },
  {
    id: "opening-principles-black",
    title: "Opening Principles for Black",
    side: "black",
    level: "beginner",
    eco: "C40-C54",
    summary:
      "The same habits from Black's side: develop with tempo, castle, answer an early queen by hitting it, and break the centre with ...d5 when your pieces are ready.",
    ideas: [
      "Answer 1.e4 with 1...e5 and develop with every move you can.",
      "Castle early, then free your game with ...d5 once your pieces are out.",
      "Meet an early queen by developing pieces that attack it.",
      "Don't take material when your king is in the centre and your pieces are asleep.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "This is the companion to Opening Principles, played from the Black side. It shows how a player with the second move uses the same habits: claim a share of the centre, develop quickly, castle and challenge the centre with ...d5. One warning line shows what happens when Black grabs material instead.",
      howToReach:
        "Reply 1...e5 to 1.e4 and 2...Nc6 to 2.Nf3. After that you play the plan that suits White's choice, as shown in the lines.",
      pros: [
        "One simple reply to 1.e4, so you play the same first moves every game.",
        "You learn the ...d5 break, the move that frees Black's game in most e4-e5 openings.",
        "Every line develops pieces toward the centre and ends with the king safe.",
        "You see how to punish an early queen and how a king left in the centre can lose quickly.",
      ],
      cons: [
        "Black moves second, so equal is a good result and you rarely get an early attack.",
        "The lines show habits, not a full repertoire: against 1.d4 you need a different opening (the Start here page has one).",
        "White can choose sharper lines than the ones shown, so keep checking threats on every move.",
      ],
      variations: [
        {
          name: "Develop and castle against the Italian",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Nbd2 a6 8.Bb3 Ba7",
          text:
            "Black mirrors White's set-up: bishop to c5, knight to f6, a solid d6 and an early castle.",
        },
        {
          name: "The ...d5 break",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.Qb3 Nce7 11.O-O O-O",
          text:
            "When White opens the centre, Black answers with ...d5 once the pieces are ready. Black ends the opening level and castled.",
        },
        {
          name: "Meeting an early queen",
          pgn: "1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6 5.Ne2 d5",
          text:
            "Each Black move develops a piece or attacks the queen. White has lost time, and Black takes the centre with ...d5.",
        },
        {
          name: "Scotch: take the centre pawn, then ...d5",
          pgn: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Bb4 6.Nxc6 bxc6 7.Bd3 d5 8.exd5 cxd5 9.O-O O-O",
          text:
            "Black develops, pins the c3 knight, and breaks with ...d5 to equalise the centre.",
        },
      ],
      againstIt:
        "White's best plan against a player with good habits is the same as yours: develop, castle and take the centre. Gambits and early attacks can be dangerous, so always ask what the last move threatens before you play yours.",
      plans: {
        white:
          "Take the centre, develop quickly, castle and aim for a plan. Against a Black player who follows the principles you will often be fighting for a small edge.",
        black:
          "Reply ...e5, develop knights and bishops toward the centre, castle, and then play ...d5 once the pieces are out. If White brings the queen out early, hit it with developing moves.",
      },
      history:
        "The ...e5 reply was the main answer to 1.e4 for most of chess history, and for centuries players believed Black should copy White's centre. Over time players found that the ...d5 break is the standard way for Black to equalise and free the position.",
      faq: [
        {
          q: "Why answer 1.e4 with 1...e5?",
          a:
            "It claims the centre, opens lines for your bishop and queen, and keeps the position symmetrical and easy to understand. It is the classical way to learn.",
        },
        {
          q: "What does ...d5 do for Black?",
          a:
            "It challenges White's centre and opens the c8 bishop. It is often the move that takes Black from a slightly passive position to full equality.",
        },
        {
          q: "Can I capture the free queen in Legal's trap?",
          a:
            "No: the warning line shows why. A piece that seems pinned and free can be bait when your king is still in the centre, so check for checks and mates before grabbing anything.",
        },
      ],
    },
    lines: [
      {
        name: "Develop and castle",
        moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.O-O O-O 7.Nbd2 a6 8.Bb3 Ba7",
        notes: {
          "1.e4": "White takes the centre.",
          "1...e5": "You take a share of it too.",
          "2.Nf3": "White attacks e5.",
          "2...Nc6": "Defend e5 and develop, in one move.",
          "3.Bc4": "The bishop eyes f7.",
          "3...Bc5": "Mirror it. The bishop comes out to the best diagonal.",
          "4.c3": "White prepares d4.",
          "4...Nf6": "Develop and attack e4.",
          "5.d3": "White protects e4.",
          "5...d6": "A solid pawn on d6 defends e5 and frees your c8 bishop.",
          "6.O-O": "White castles.",
          "6...O-O": "You castle too. King safe, rook toward the centre.",
          "7.Nbd2": "White develops the last knight.",
          "7...a6": "A useful waiting move that also gives the bishop the a7 square.",
          "8.Bb3": "The bishop steps back.",
          "8...Ba7": "The bishop keeps its diagonal pointing at f2. Moving it a second time is fine here because it avoids a trade.",
        },
      },
      {
        name: "Break the centre with ...d5",
        moves:
          "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5 9.exd5 Nxd5 10.Qb3 Nce7 11.O-O O-O",
        notes: {
          "1.e4": "White takes the centre.",
          "1...e5": "You answer with the same move.",
          "2.Nf3": "White develops with a threat.",
          "2...Nc6": "You defend e5.",
          "3.Bc4": "The bishop eyes f7.",
          "3...Bc5": "Develop to the matching square.",
          "4.c3": "White prepares d4.",
          "4...Nf6": "Develop with an attack on e4.",
          "5.d4": "White opens the centre.",
          "5...exd4": "Take the pawn. Your e-pawn leaves, so the centre opens in a way you can use.",
          "6.cxd4": "White recaptures with a pawn.",
          "6...Bb4+": "Check, and your bishop comes to an active square.",
          "7.Bd2": "White blocks.",
          "7...Bxd2+": "Trade the bishop: it was getting hit anyway.",
          "8.Nbxd2": "White recaptures with the knight.",
          "8...d5": "The key move. It hits the e4 pawn and frees your game. It is the break Black plays in most e4-e5 positions.",
          "9.exd5": "White takes.",
          "9...Nxd5": "Recapture with a piece, so it lands on a strong central square.",
          "10.Qb3": "White attacks the d5 knight.",
          "10...Nce7": "Defend the knight and keep everything protected.",
          "11.O-O": "White castles.",
          "11...O-O": "You castle too. The game is level and your king is safe.",
        },
      },
      {
        name: "Hit the early queen with developing moves",
        moves: "1.e4 e5 2.Qh5 Nc6 3.Bc4 g6 4.Qf3 Nf6 5.Ne2 d5",
        notes: {
          "1.e4": "White takes the centre.",
          "1...e5": "You do the same.",
          "2.Qh5": "An early queen. It attacks e5, but it can be chased.",
          "2...Nc6": "Defend e5 and develop. Don't panic.",
          "3.Bc4": "White threatens Qxf7#.",
          "3...g6": "Attack the queen with a pawn. It also stops the mate.",
          "4.Qf3": "The queen runs, having moved twice.",
          "4...Nf6": "Develop another piece. You are ahead in development.",
          "5.Ne2": "White develops a knight.",
          "5...d5": "With the pieces out, take the centre. This pawn attacks White's bishop and e4 pawn.",
        },
      },
      {
        name: "Take the centre pawn, then play ...d5",
        moves: "1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nc3 Bb4 6.Nxc6 bxc6 7.Bd3 d5 8.exd5 cxd5 9.O-O O-O",
        notes: {
          "1.e4": "White takes the centre.",
          "1...e5": "You do the same.",
          "2.Nf3": "White attacks e5.",
          "2...Nc6": "Defend and develop.",
          "3.d4": "White offers to trade centre pawns.",
          "3...exd4": "Take it. The centre is open and your pieces can come out.",
          "4.Nxd4": "White recaptures.",
          "4...Nf6": "Develop with an attack on e4.",
          "5.Nc3": "White defends e4.",
          "5...Bb4": "Pin the knight that protects e4.",
          "6.Nxc6": "White trades off your knight.",
          "6...bxc6": "Recapture. Your pawns are doubled but your centre is solid.",
          "7.Bd3": "White develops.",
          "7...d5": "The central break again. It opens your bishops and takes space.",
          "8.exd5": "White takes.",
          "8...cxd5": "You have a healthy pawn centre.",
          "9.O-O": "White castles.",
          "9...O-O": "You castle as well. The game is level.",
        },
      },
      {
        name: "Warning: grabbing the queen (Legal's mate)",
        kind: "warning",
        moves: "1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#",
        notes: {
          "1.e4": "White takes the centre.",
          "1...e5": "Black takes a share of it.",
          "2.Nf3": "White attacks e5.",
          "2...d6": "A solid move, but it leaves Black's kingside undeveloped.",
          "3.Bc4": "White develops.",
          "3...Bg4": "Black pins the f3 knight to the queen.",
          "4.Nc3": "White develops another piece.",
          "4...g6": "A mistake. Black's king and f8 bishop are still at home.",
          "5.Nxe5": "The bait. The knight takes a pawn and moves out of the pin, offering the queen.",
          "5...Bxd1": "Mistake. Taking the queen looks like winning, but the king pays for it.",
          "6.Bxf7+": "Check! The bishop takes with check. The king cannot take it because the e5 knight guards f7.",
          "6...Ke7": "The king has to step to e7, the only square.",
          "7.Nd5#": "Checkmate. All White's pieces are out and the Black king is trapped by its own pieces. Black won a queen and lost the game.",
        },
      },
    ],
  },
];
