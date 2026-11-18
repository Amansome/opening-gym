// More opening courses (wave 4). Same format as data/courses.js.
// Validated and merged by scripts/validate.js.
module.exports = [
  {
    id: "slav-defence",
    title: "Slav Defence",
    side: "black",
    level: "intermediate",
    eco: "D10-D19",
    summary:
      "A rock-solid answer to the Queen's Gambit: support d5 with ...c6, keep the light-squared bishop outside the pawn chain, and win the c4 pawn back at a good moment.",
    ideas: [
      "...c6 guards d5 without blocking the c8-bishop, so it can come out to f5 or g4 before ...e6.",
      "Black often takes ...dxc4 and holds the extra pawn briefly with ...b5 or ...Bf5, then hits back in the centre.",
      "Against the Exchange (3.cxd5 cxd5) simply develop with ...Nf6, ...Nc6 and ...Bf5, and watch out for Nxd5 tricks.",
      "When White plays e3 and Nf3, the Semi-Slav set-up with ...e6 and ...Nbd7 is a sturdy alternative.",
    ],
    style: "Solid",
    article: {
      whatIs:
        "The Slav Defence starts 1.d4 d5 2.c4 c6. Black protects the d5 pawn with a pawn rather than a piece or a bishop move, so the light-squared bishop is free to leave the centre. It is a sound, well-tested reply that leads to rich but safe middlegames, and it is a favourite of players who want solid and counterattacking chances at once.",
      howToReach:
        "After 1.d4 d5 2.c4 play 2...c6. Against 3.Nf3 continue 3...Nf6, against 3.Nc3 play 3...Nf6, against 3.cxd5 recapture 3...cxd5, and against the slow 3.e3 develop with 3...Nf6.",
      pros: [
        "The structure is very solid: the d5 pawn is protected and Black's pieces have natural squares.",
        "The c8-bishop can be developed outside the pawn chain, which avoids the typical bad bishop of the Queen's Gambit Declined.",
        "Many White tries (Exchange, Nf3 and Nc3 lines) are easy to meet once you know a few plans.",
        "You can choose between a quiet Slav and the more ambitious Semi-Slav and Meran set-ups later without changing the first moves.",
        "It is a standard weapon at every level, so there is plenty of model play to study.",
      ],
      cons: [
        "Black cannot easily play for a win: White often keeps a small pull, so you have to outplay the opponent in the middlegame.",
        "The Exchange Slav can become drawish if both sides trade pieces.",
        "In the main line with ...dxc4, Black must be careful with the pawn on c4 and the bishop on f5 (tricks with Ne5 and Qb3).",
        "The Semi-Slav and Meran are much more complicated; this course only covers their first steps.",
      ],
      variations: [
        {
          name: "Main line with 4.Nc3 dxc4 and 5.a4",
          pgn: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O Nbd7 9.Qe2 Bg6 10.e4 O-O 11.Bd3 Bh5",
          text:
            "White stops ...b5 with a4, and Black develops the bishop to f5 before playing ...e6. The pin on c3 is a useful idea. Black keeps the pieces active and accepts that White gets the centre.",
        },
        {
          name: "Meran-style set-up",
          pgn: "1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 Bb7 9.O-O a6",
          text:
            "Black plays ...e6 first and then expands with ...b5 and ...a6, aiming for ...c5. It is sharper than the main Slav but easy to understand: gain queenside space and hit the centre.",
        },
        {
          name: "Exchange Slav",
          pgn: "1.d4 d5 2.c4 c6 3.cxd5 cxd5 4.Nc3 Nf6 5.Bf4 Nc6 6.e3 Bf5 7.Nf3 e6",
          text:
            "White opens the c-file and keeps a symmetrical position. Black develops naturally and uses the same ideas: knights on c6 and f6, bishop on f5, then ...e6. Never allow a free Nxd5.",
        },
        {
          name: "Slow 3.e3 against the Semi-Slav",
          pgn: "1.d4 d5 2.c4 c6 3.e3 Nf6 4.Nc3 e6 5.Nf3 Nbd7 6.Qc2 Bd6 7.Bd3 O-O 8.O-O dxc4 9.Bxc4 b5 10.Be2 Bb7",
          text:
            "White builds a quiet centre and waits. Black develops with ...Bd6 and castles, then strikes with ...dxc4 and ...b5 to gain space on the queenside.",
        },
      ],
      againstIt:
        "White's main ways to fight the Slav are the sharp 4.Nc3 dxc4 5.a4 lines, the quiet Exchange and the slow e3 and Qc2 set-ups. The best way to play against it is to grab the centre with e4 once Black has taken on c4, use the extra space, and try Ne5 tricks against a bishop on f5. As White, do not rush: Black's position is hard to attack, so a long squeeze is the usual plan.",
      plans: {
        white:
          "Develop with Nf3 and Nc3, take the c4 pawn back with Bxc4 or e3-and-Bxc4, then occupy the centre with e4. Keep an eye on tactics against a bishop on f5 or g4, and remember a4 stops Black's queenside expansion.",
        black:
          "Develop the light-squared bishop early, keep the pawn on c6 for as long as it helps, and be ready to hit the centre with ...e5 or ...c5. When White grabs space, trade pieces; when White is slow, the ...b5 and ...c5 breaks give Black real winning chances.",
      },
      history:
        "The Slav Defence is a classical answer to the Queen's Gambit that has been studied for well over a century. Its main ideas were developed in the early twentieth century and it has stayed popular ever since, with several world champions using it as a main weapon. The related Semi-Slav and Meran systems grew out of it and have been analysed in great depth.",
      faq: [
        {
          q: "Is the Slav Defence good for beginners?",
          a:
            "Yes. The pawn structure is easy to understand and Black rarely gets into quick trouble. You learn how to defend the centre and then strike back, which are useful skills in every opening.",
        },
        {
          q: "What is the difference between the Slav and the Queen's Gambit Declined?",
          a:
            "In the Slav Black plays ...c6 and keeps the c8-bishop free, usually developing it before ...e6. In the Queen's Gambit Declined Black plays ...e6 at once, which is solid but leaves the bishop on c8 locked in.",
        },
        {
          q: "What should I do against the Exchange Slav?",
          a:
            "Recapture with the c-pawn, develop with ...Nf6, ...Nc6 and ...Bf5, and aim for a calm position. It is equal, but White has few ways to make progress if you avoid blunders.",
        },
        {
          q: "When should I take on c4 in the Slav?",
          a:
            "Take when White has already developed Nf3 and Nc3 and can no longer set up e4 for free. Then support the pawn with ...b5 or simply give it back while getting your bishop out.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: the hanging d5 pawn",
        moves: "1.d4 d5 2.c4 c6 3.cxd5 cxd5 4.Nc3 Nf6 5.Nxd5 Nxd5",
        notes: {
          "2...c6": "The Slav move: it protects d5 with a pawn and keeps the c8-bishop free.",
          "3...cxd5": "Recapture with the c-pawn to open the c-file and keep the centre intact.",
          "4...Nf6": "Develops with another defender of d5.",
          "5.Nxd5": "A typical beginner error: d5 is defended by the knight and the queen.",
          "5...Nxd5": "Black wins a clean piece; the d4 pawn blocks White's queen from recapturing.",
        },
      },
      {
        name: "Slav main line: 3.Nf3 Nf6 4.Nc3 dxc4",
        moves: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.Nc3 dxc4 5.a4 Bf5 6.e3 e6 7.Bxc4 Bb4 8.O-O Nbd7 9.Qe2 Bg6 10.e4 O-O 11.Bd3 Bh5",
        notes: {
          "3...Nf6": "Develops and adds a defender to d5.",
          "4...dxc4": "Now that White has developed both knights, Black takes the pawn. White regains it with Bxc4 or e3.",
          "5.a4": "Stops ...b5, so Black cannot hold the extra pawn.",
          "5...Bf5": "The point of the Slav: the bishop gets out before ...e6. It also controls e4.",
          "6...e6": "Closes the diagonal for Black's own bishop, but only after it has left. Opens the f8-bishop.",
          "7.Bxc4": "White regains the pawn and has a nice centre.",
          "7...Bb4": "Pins the c3 knight against the king and increases control over e4.",
          "8...Nbd7": "Develops the last minor piece and protects against Nd5 ideas.",
          "9...Bg6": "Keeps the bishop alive; Black must watch the e4 push.",
          "10...O-O": "Castling first is safe, and the bishop can retreat if White advances.",
          "11...Bh5": "Pins the f3 knight against the queen on e2 and keeps the bishop active.",
        },
      },
      {
        name: "Meran-style set-up: 3.Nc3 Nf6 4.e3 e6",
        moves: "1.d4 d5 2.c4 c6 3.Nc3 Nf6 4.e3 e6 5.Nf3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5 8.Bd3 Bb7 9.O-O a6",
        notes: {
          "4...e6": "Black supports d5 again and prepares ...Nbd7 and ...dxc4.",
          "5...Nbd7": "Keeps the knight flexible and guards against Ne5 and e4 pushes.",
          "6...dxc4": "A trade of tempo: White has to move the bishop again after taking the pawn.",
          "7...b5": "Gains queenside space and kicks the bishop away from c4.",
          "8...Bb7": "The bishop now eyes the long diagonal, ready for ...c5.",
          "9...a6": "Supports ...b5 and prepares ...c5. This is the Meran position.",
        },
      },
      {
        name: "Exchange Slav: develop and stay safe",
        moves: "1.d4 d5 2.c4 c6 3.cxd5 cxd5 4.Nc3 Nf6 5.Bf4 Nc6 6.e3 Bf5 7.Nf3 e6",
        notes: {
          "3.cxd5": "White opens the c-file and takes a symmetrical but slightly more active game.",
          "5...Nc6": "Brings out the knight and adds pressure to d4.",
          "6...Bf5": "The light-squared bishop develops outside the pawn chain.",
          "7...e6": "Solid and flexible; later Black can play ...Bb4 or ...Bd6.",
        },
      },
      {
        name: "Slow 3.e3: Semi-Slav with ...Bd6",
        moves: "1.d4 d5 2.c4 c6 3.e3 Nf6 4.Nc3 e6 5.Nf3 Nbd7 6.Qc2 Bd6 7.Bd3 O-O 8.O-O dxc4 9.Bxc4 b5 10.Be2 Bb7",
        notes: {
          "3...Nf6": "Develop first; Black has not committed to ...e6 or ...Bf5 yet.",
          "6...Bd6": "A good square: the bishop eyes the kingside and supports ...e5.",
          "8...dxc4": "Black waits until the bishop has moved to d3, then takes with tempo.",
          "9...b5": "Wins space and drives the bishop away.",
          "10...Bb7": "Fianchetto the bishop and prepare ...c5 or ...e5.",
        },
      },
      {
        name: "Active 4.e3: ...Bf5 and the knight on h4",
        moves: "1.d4 d5 2.c4 c6 3.Nf3 Nf6 4.e3 Bf5 5.Nc3 e6 6.Nh4 Bg6 7.Nxg6 hxg6",
        notes: {
          "4...Bf5": "With e3 played, the bishop can leave the c8-h3 diagonal in peace.",
          "6.Nh4": "White attacks the bishop and offers to trade it for the knight.",
          "6...Bg6": "The bishop retreats to a safe square. If White takes it, Black recaptures and gets the half-open h-file.",
          "7...hxg6": "Recapture with the h-pawn: Black has given up the bishop for a knight but gets the open h-file for the rook. ...Nbd7 and ...Bd6 come next.",
        },
      },
    ],
  },
  {
    id: "nimzo-indian",
    title: "Nimzo-Indian Defence",
    side: "black",
    level: "advanced",
    eco: "E20-E59",
    summary:
      "Pin the knight with ...Bb4 against 3.Nc3, fight for e4 and the centre, and be ready to double White's pawns on c3.",
    ideas: [
      "...Bb4 pins the c3 knight so White cannot easily play e4.",
      "Black often takes on c3 to double White's pawns, giving up the bishop pair in return.",
      "Fight for the centre with ...d5, or with ...c5 and ...d6 for a more flexible set-up.",
      "Against 4.Qc2 and 4.f3, strike in the centre before White finishes development.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "The Nimzo-Indian begins 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4. Black pins the c3 knight, stops White from playing e4 for free, and prepares to damage White's pawn structure with ...Bxc3. It is one of the most respected defences to 1.d4: flexible, active, and full of strategic ideas rather than long memorised lines.",
      howToReach:
        "Play 1.d4 Nf6 2.c4 e6. If White answers 3.Nc3, pin it with 3...Bb4. If White plays 3.Nf3 instead, a different course (the Queen's Gambit Declined or a Queen's Indian) is needed.",
      pros: [
        "The pin stops e4 and fights for the centre with pieces, not just pawns.",
        "Doubling White's c-pawns gives you a clear long-term target.",
        "The same ideas (...O-O, ...d5 or ...c5, ...Nc6) work against many different White tries.",
        "It is a respected, flexible defence with no single forced mainline, so you learn how to play positions.",
        "You can combine it with a Queen's Indian or Queen's Gambit Declined when White avoids 3.Nc3.",
      ],
      cons: [
        "White has many good ways to fight it (4.e3, 4.Qc2, 4.a3 and 4.f3), so you need a plan for each.",
        "The structure you aim for is sometimes unclear, and you must give up the bishop pair to double pawns.",
        "White can avoid the whole system with 3.Nf3, so you need another answer for that.",
        "Some lines require good understanding of long-term pawn structures.",
      ],
      variations: [
        {
          name: "Rubinstein with 4.e3",
          pgn: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4 10.Bxc4 Qc7 11.Bd3 e5",
          text:
            "White keeps a solid centre and can choose between a kingside attack and a strong e4 push. Black hits d4 with ...c5 and ...Nc6, trades on c3, and fights back with ...e5.",
        },
        {
          name: "Classical with 4.Qc2",
          pgn: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Bg5 Bb7 8.f3 h6 9.Bh4 d5",
          text:
            "White avoids doubled pawns by recapturing with the queen. Black pressures e4 with ...b6 and ...Bb7, then strikes in the centre with ...d5.",
        },
        {
          name: "Saemisch with 4.a3",
          pgn: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.a3 Bxc3+ 5.bxc3 c5 6.e3 Nc6 7.Bd3 O-O 8.Ne2 b6 9.e4 Ne8 10.O-O Ba6",
          text:
            "White takes the bishop pair and builds a big centre in return for the weakened pawns. Black attacks the c4 pawn with ...Ba6 and keeps the pawn on c5 as a target.",
        },
        {
          name: "Kmoch with 4.f3",
          pgn: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.f3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 Nxd5 8.dxc5 f5",
          text:
            "White supports e4 with f3. Black hits the centre at once with ...d5 and ...c5, and after dxc5 uses ...f5 to stop e4.",
        },
      ],
      againstIt:
        "White's most popular tries are 4.e3 (the Rubinstein, solid), 4.Qc2 (avoiding doubled pawns), 4.a3 (forcing Black to decide about the bishop) and 4.f3 (supporting e4). The best way to fight it is to keep the pawn centre flexible and avoid giving Black a free ...d5. As White, do not rush e4 before you are developed, because the pin on c3 will make it hard.",
      plans: {
        white:
          "Develop calmly with e3, Nf3, Bd3 and O-O if you want a solid game, or recapture on c3 with the queen if you want to avoid the doubled pawn. Try to play e4 only when it is fully supported, and keep the bishop pair if you can.",
        black:
          "Castle early, fight for e4, and decide whether to take on c3. If you do, aim for the weak pawns on c3 and c4 with pieces. ...d5 or ...c5 should come when White's pieces are still on their starting squares.",
      },
      history:
        "The Nimzo-Indian is named after Aron Nimzowitsch, who helped to popularise this style of flexible pawn-structure play in the early twentieth century. It became a main weapon at the highest level and has stayed that way ever since. Many different white systems have been tried against it, and the defence has held up well against all of them.",
      faq: [
        {
          q: "Is the Nimzo-Indian good for beginners?",
          a:
            "It is better suited to improving players: the ideas are logical, but you need to understand pawn structures and piece play. If you enjoy fighting for the centre with pieces, it is a great way to learn.",
        },
        {
          q: "Should I take on c3 or keep the bishop?",
          a:
            "When White has played a3 you have to decide at once, and taking is usually best. Otherwise, take when it wins a tempo or doubles the pawns.",
        },
        {
          q: "What if White does not play 3.Nc3?",
          a:
            "After 3.Nf3 you can play ...d5 (Queen's Gambit Declined) or ...b6 (Queen's Indian). The Nimzo-Indian works only against 3.Nc3.",
        },
        {
          q: "Why do Black players like ...c5 and ...d6 in the Nimzo?",
          a:
            "Because the combination attacks the d4 pawn, controls the centre and keeps the position flexible, especially if White has given up the bishop pair.",
        },
      ],
    },
    lines: [
      {
        name: "Rubinstein: 4.e3 with ...d5 and ...c5",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 d5 6.Nf3 c5 7.O-O Nc6 8.a3 Bxc3 9.bxc3 dxc4 10.Bxc4 Qc7 11.Bd3 e5",
        notes: {
          "3...Bb4": "The Nimzo-Indian pin: the c3 knight can no longer support e4 without a fight.",
          "4...O-O": "Castle early; the king is safe and the rook is ready for the centre.",
          "5...d5": "Fight for the centre at once. If White takes on d5, Black recaptures and has easy play.",
          "6...c5": "Attacks d4 and prepares to open lines for the queenside pieces.",
          "7...Nc6": "Adds more pressure on d4 and develops the knight.",
          "8...Bxc3": "Black gives up the bishop to double White's pawns. White now has the bishop pair, but weak pawns.",
          "9...dxc4": "Wins a tempo by forcing the bishop to move again, and the c3 pawn is then a target.",
          "10...Qc7": "Prepares ...e5 and protects c5 and e5.",
          "11...e5": "The central break. Black fights for the centre and keeps the pieces active.",
        },
      },
      {
        name: "Rubinstein alternative: ...c5 and ...d6",
        kind: "alternative",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 c5 6.Nf3 Nc6 7.O-O Bxc3 8.bxc3 d6 9.Nd2 e5",
        notes: {
          "5...c5": "A different set-up: hit d4 first and delay ...d5. This is a more flexible, slightly slower approach.",
          "7...Bxc3": "Take on c3 before White plays a3.",
          "8...d6": "Solid. Black avoids ...d5 and keeps the pawn centre compact.",
          "9...e5": "Fights for the centre. White's knight on d2 is a bit passive.",
        },
      },
      {
        name: "Classical: 4.Qc2 and ...b6",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 b6 7.Bg5 Bb7 8.f3 h6 9.Bh4 d5",
        notes: {
          "4...O-O": "Castle first; the queen on c2 does not change that.",
          "5.a3": "White asks the bishop what it wants to do.",
          "5...Bxc3+": "Black takes: it wins a tempo and forces the queen to recapture.",
          "6...b6": "Prepares ...Bb7 to hit e4 and the long diagonal.",
          "7...Bb7": "The bishop eyes e4, so White cannot easily develop with e3 and e4.",
          "8...h6": "Asks the bishop on g5 what it wants to do.",
          "9...d5": "Black strikes in the centre now that White's kingside is slow.",
        },
      },
      {
        name: "Saemisch: 4.a3 Bxc3+",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.a3 Bxc3+ 5.bxc3 c5 6.e3 Nc6 7.Bd3 O-O 8.Ne2 b6 9.e4 Ne8 10.O-O Ba6",
        notes: {
          "4...Bxc3+": "The bishop has to decide at once, and taking is the point: White has doubled c-pawns.",
          "5...c5": "Hits d4 and starts the attack on White's weak pawns.",
          "6...Nc6": "Another piece aims at d4.",
          "7...O-O": "Castle and keep the position flexible.",
          "8...b6": "Prepares ...Ba6 to pressure c4.",
          "9...Ne8": "The knight retreats because e4-e5 was coming. From e8 it heads for d6 or g7.",
          "10...Ba6": "The bishop hits c4 and keeps the doubled pawns under pressure.",
        },
      },
      {
        name: "Kmoch: 4.f3 and ...d5",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.f3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 Nxd5 8.dxc5 f5",
        notes: {
          "4...d5": "Take the centre while White's f3 has slowed development.",
          "5...Bxc3+": "Black gives up the bishop pair to damage White's structure.",
          "6...c5": "Hits d4 and the doubled c3 pawn.",
          "7...Nxd5": "The knight centralises with pressure on c3.",
          "8...f5": "Stops e4 and prepares to win the c5 pawn back. Black should not allow e4 for free.",
        },
      },
      {
        name: "4.Nf3 with ...c5 and ...Nc6",
        moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Nf3 c5 5.e3 Nc6 6.Bd3 Bxc3+ 7.bxc3 d6 8.e4 e5",
        notes: {
          "4...c5": "Counterpunch in the centre at once.",
          "5...Nc6": "Develops with pressure on d4.",
          "6...Bxc3+": "Take the knight before White can play a3.",
          "7...d6": "Solid, preparing ...e5.",
          "8...e5": "Black fights for the centre against the pawn mass, with a good game.",
        },
      },
    ],
  },
  {
    id: "accelerated-dragon",
    title: "Accelerated Dragon",
    side: "black",
    level: "intermediate",
    eco: "B35-B39",
    summary:
      "A Sicilian where Black fianchettoes the dark-squared bishop at once with ...g6, keeping the option of ...d5 and facing the Maroczy Bind with a clear plan.",
    ideas: [
      "...g6 and ...Bg7 put the bishop on its best diagonal right away, without spending a move on ...d6.",
      "Black often delays ...d6 so that ...d5 stays possible if White does not play c4.",
      "Against the Maroczy Bind (c2-c4) Black trades knights and fights with ...d6, ...Bd7-c6 and ...a5, not ...d5.",
      "In the open lines with Nc3 and Be3, the plan is ...Nf6, ...O-O, ...d6 and a quick ...Rc8.",
    ],
    style: "Counterattack",
    article: {
      whatIs:
        "The Accelerated Dragon arises after 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6. Black plays the Dragon-style fianchetto immediately instead of first playing ...d6 and ...Nf6. It is a fighting Sicilian that avoids some of the most theory-heavy lines but leaves White the option of the Maroczy Bind with c4.",
      howToReach:
        "Play 1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6. If White deviates earlier, you need small side answers: 3.c3 (the Alapin) and 3.Bb5 (the Rossolimo) are covered briefly here.",
      pros: [
        "The bishop on g7 is powerful and the structure is solid.",
        "It avoids the Najdorf-style ...a6 lines and the sharpest 6.Bg5 and 6.Be2 theory.",
        "Black has real winning chances: the Dragon structure and open c-file give Black active play.",
        "The ...d5 break is sometimes available and gives Black easy equality.",
        "The same ideas also work in other Sicilian lines, so it teaches useful patterns.",
      ],
      cons: [
        "White can play the Maroczy Bind with c4, giving a big space advantage that Black must handle with care.",
        "If White plays 5.Nc3 Bg7 6.Be3, the Dragon theory can be very sharp (the Yugoslav Attack with Qd2 and O-O-O).",
        "Against 3.c3 and 3.Bb5, the Dragon structure is less natural and you need a separate plan.",
        "Black has to avoid some tactical traps involving Nxc6 and e5.",
      ],
      variations: [
        {
          name: "Maroczy Bind with 6.Be3",
          pgn: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4 Bg7 6.Be3 Nf6 7.Nc3 O-O 8.Be2 d6 9.O-O Bd7 10.Qd2 Nxd4 11.Bxd4 Bc6",
          text:
            "White clamps down on d5 with c4 and a knight on c3. Black trades a pair of knights to relieve the space shortage and plays ...Bc6 to pressure the e4 pawn.",
        },
        {
          name: "Maroczy Bind with 6.Nc2",
          pgn: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4 Bg7 6.Nc2 d6 7.Be2 Nf6 8.Nc3 O-O 9.O-O",
          text:
            "White keeps the knights on the board by retreating to c2. Black plays a normal set-up with ...d6, ...Nf6 and ...O-O and later breaks with ...a5 or ...Bd7.",
        },
        {
          name: "Dragon-style main line with 6.Be3",
          pgn: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 d6 9.f3 Bd7 10.Qd2 Rc8 11.O-O-O Nxd4 12.Bxd4 b5",
          text:
            "The Yugoslav-style attack. White plans h4-h5, Black trades the d4 knight and counterattacks on the c-file with ...Rc8 and ...b5.",
        },
        {
          name: "Rossolimo with 3.Bb5",
          pgn: "1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 dxc6 5.d3 Bg7 6.h3 Nf6 7.Nc3 Nd7",
          text:
            "White takes on c6 and plays a slow game. Black has the bishop pair and plans ...Nd7, ...b6 and ...e5.",
        },
      ],
      againstIt:
        "White's most testing reply is the Maroczy Bind with 5.c4, which restricts the d5 square and gives White a lasting space edge. Black must then be patient: trade knights, play ...d6 and aim for ...a5 and ...Bd7-c6. Another way to fight it is the Yugoslav Attack, where White castles long and storms the kingside with the h-pawn.",
      plans: {
        white:
          "Against ...g6, either clamp down with c4 or develop quickly with Nc3, Be3, Bc4 and Qd2 for a kingside attack. If Black delays ...d6, you can sometimes exchange on c6 and push e5.",
        black:
          "Develop the kingside, castle, and then hit the centre. In the Maroczy, play ...d6, ...Bd7-c6, ...Nxd4 and ...a5. In the open lines, trade on d4 and attack on the c-file with ...Rc8, ...b5 and ...a5.",
      },
      history:
        "The Accelerated Dragon is a Sicilian Dragon move order that has been used for many decades. It became widely popular in the twentieth century as players looked for ways to reach Dragon positions while avoiding some of White's most dangerous attacking systems. Strong players of all levels still use it today.",
      faq: [
        {
          q: "Is the Accelerated Dragon good for beginners?",
          a:
            "It is a solid, logical way to start the Sicilian: the pawns are easy to understand and you know where the pieces go. You only need to learn a few plans for the main White tries.",
        },
        {
          q: "What is the difference between the Dragon and the Accelerated Dragon?",
          a:
            "In the Dragon Black plays ...d6 and ...Nf6 first. In the Accelerated Dragon Black plays ...Nc6 and ...g6 immediately, keeping the option of ...d5 and avoiding the sharpest Dragon lines with Be3 and Bc4.",
        },
        {
          q: "How do I play against the Maroczy Bind?",
          a:
            "Do not rush ...d5. Trade a pair of knights with ...Nxd4, play ...d6 and ...Bd7-c6, and prepare ...a5. The aim is to slowly neutralise White's extra space.",
        },
        {
          q: "What happens if White does not play 3.d4?",
          a:
            "After 3.c3 and 3.Bb5 you need different answers. This course gives short lines against both, but you can also treat them as separate mini-courses.",
        },
      ],
    },
    lines: [
      {
        name: "Maroczy Bind: 5.c4 Bg7 6.Be3 Nf6",
        moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4 Bg7 6.Be3 Nf6 7.Nc3 O-O 8.Be2 d6 9.O-O Bd7 10.Qd2 Nxd4 11.Bxd4 Bc6",
        notes: {
          "1...c5": "The Sicilian: Black fights for the centre from the side.",
          "2...Nc6": "The Accelerated Dragon move order starts with the knight developing to c6.",
          "3...cxd4": "Trade the c-pawn for White's central d-pawn.",
          "4...g6": "The Accelerated Dragon: the bishop goes to g7 at once.",
          "5.c4": "The Maroczy Bind: White takes d5 under control and stops ...d5.",
          "5...Bg7": "Develops the bishop and prepares castling.",
          "6...Nf6": "Develops with pressure on e4.",
          "7...O-O": "Castle early, as in the normal Dragon.",
          "8...d6": "Solid. Black delays this move because ...d5 is not available here.",
          "9...Bd7": "Prepares ...Nxd4 and ...Bc6. The queen's rook can then come to c8.",
          "10...Nxd4": "Trades a pair of knights to ease the cramped position.",
          "11...Bc6": "The bishop pressures e4 and the long diagonal.",
        },
      },
      {
        name: "Maroczy Bind: 6.Nc2",
        moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4 Bg7 6.Nc2 d6 7.Be2 Nf6 8.Nc3 O-O 9.O-O",
        notes: {
          "6.Nc2": "White keeps the knights on, avoiding ...Nxd4. It heads for e3.",
          "6...d6": "Solid, controls e5, prepares ...Nf6.",
          "7...Nf6": "Develops with pressure on e4.",
          "8...O-O": "Castle, then ...a5, ...Bd7 and ...Nd7 are typical ideas.",
        },
      },
      {
        name: "Dragon-style: 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4",
        moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Be3 Nf6 7.Bc4 O-O 8.Bb3 d6 9.f3 Bd7 10.Qd2 Rc8 11.O-O-O Nxd4 12.Bxd4 b5",
        notes: {
          "5.Nc3": "White develops naturally, keeping e4 solid.",
          "5...Bg7": "The bishop takes its place on the long diagonal.",
          "6...Nf6": "Attacks e4 and develops.",
          "7.Bc4": "Aims at f7 and prepares Bb3.",
          "7...O-O": "King safety first.",
          "8...d6": "Now that the bishop has gone to b3, ...d6 is safe.",
          "9...Bd7": "Prepares ...Rc8 and the exchange on d4.",
          "10...Rc8": "Puts the rook opposite White's king and sets up c-file counterplay.",
          "11...Nxd4": "Black removes White's most dangerous piece.",
          "12...b5": "Black attacks first: the queenside pawn storm is the main counter to the kingside attack.",
        },
      },
      {
        name: "6.Nxc6 bxc6: the Dragon with doubled pawns",
        moves: "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7 6.Nxc6 bxc6 7.Bc4 Nf6 8.O-O O-O",
        notes: {
          "6.Nxc6": "White trades a knight to give Black doubled c-pawns.",
          "6...bxc6": "Recapture with the b-pawn: it opens the b-file and keeps the pawn centre.",
          "7...Nf6": "Develops with a hit on e4.",
          "8...O-O": "Black castles and is happy to open the centre with ...d5 later.",
        },
      },
      {
        name: "Alapin: 3.c3 Nf6",
        moves: "1.e4 c5 2.Nf3 Nc6 3.c3 Nf6 4.e5 Nd5 5.d4 cxd4 6.cxd4 d6 7.Bc4 Nb6 8.Bb3 dxe5 9.Nxe5 Nxe5 10.dxe5 Qxd1+ 11.Kxd1",
        notes: {
          "3.c3": "The Alapin: White prepares d4 without allowing ...cxd4 and a Dragon.",
          "3...Nf6": "Hits e4 at once. If White pushes e5, the knight comes to d5.",
          "5...cxd4": "Open the position and trade the c-pawn.",
          "6...d6": "Challenge the e5 pawn immediately.",
          "7...Nb6": "Kicks the bishop and avoids tactics on d5.",
          "8...dxe5": "Black removes the pawn and aims for a safe, equal endgame.",
          "10...Qxd1+": "Black trades queens: White's king ends up in the centre with no castling rights.",
        },
      },
      {
        name: "Rossolimo: 3.Bb5 g6",
        moves: "1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 dxc6 5.d3 Bg7 6.h3 Nf6 7.Nc3 Nd7",
        notes: {
          "3.Bb5": "The Rossolimo: White pins the knight and aims for a quiet game.",
          "3...g6": "The Dragon fianchetto works well here too.",
          "4...dxc6": "Recapture with the d-pawn: Black gets open lines for the dark-squared bishop and the queen.",
          "5...Bg7": "The bishop eyes the long diagonal.",
          "6...Nf6": "Develops and presses on e4.",
          "7...Nd7": "Prepares ...b6, ...e5 and ...Bb7 to use the bishop pair.",
        },
      },
    ],
  },
  {
    id: "pirc-defence",
    title: "Pirc Defence",
    side: "black",
    level: "intermediate",
    eco: "B07-B09",
    summary:
      "A hypermodern reply to 1.e4: let White build a big centre, fianchetto the bishop, and then hit it with pieces and pawn breaks.",
    ideas: [
      "...d6, ...Nf6, ...g6 and ...Bg7 build a flexible position without taking the centre by force.",
      "Castle early, then strike the centre with ...c5 or ...e5 when White's pieces are committed.",
      "Against the Austrian Attack (f4), hit d4 with ...c5 and be ready to trade queens or kick the bishop.",
      "Against the 150 Attack (Be3, Qd2, f3), play ...c6 and ...b5 and keep the pieces flexible.",
    ],
    style: "Counterattack",
    article: {
      whatIs:
        "The Pirc Defence starts 1.e4 d6 2.d4 Nf6 3.Nc3 g6. Black does not fight for the centre at once, but waits, fianchettoes the dark-squared bishop and aims to attack White's pawn centre later. It is a flexible, hypermodern system that gives Black rich counterplay if White overextends.",
      howToReach:
        "Play 1.e4 d6 2.d4 Nf6 3.Nc3 g6. White can set up in several ways (150 Attack, Austrian Attack, Classical) and you reply with ...Bg7 and ...O-O in almost every line.",
      pros: [
        "The same set-up (...g6, ...Bg7, ...O-O) works against most White systems.",
        "Black gets a flexible position with plenty of counterplay if White overextends.",
        "It is less theoretical than the Najdorf or the Caro-Kann in many lines.",
        "You can transpose to the Modern Defence or the King's Indian structures if you like.",
        "It teaches how to attack a pawn centre with pieces and pawn breaks.",
      ],
      cons: [
        "White gets a lot of space and can attack on the kingside with f4, e5 or h4.",
        "Some lines (the Austrian Attack and the 150 Attack) are sharp, and a few careless moves can be fatal.",
        "Black is slightly behind in the centre, so the defence needs accurate play.",
        "Black has to avoid passive moves; if the centre stays closed, White keeps an edge.",
      ],
      variations: [
        {
          name: "Austrian Attack with 6.Be2",
          pgn: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Be2 c5 7.dxc5 Qa5 8.O-O Qxc5+ 9.Kh1 Nc6",
          text:
            "White builds a huge pawn centre. Black strikes straight away with ...c5, trades on c5 and gets a queen on an active square with a lead in development.",
        },
        {
          name: "Austrian Attack with 6.Bd3",
          pgn: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Na6 7.O-O c5 8.d5 Bg4",
          text:
            "White develops the bishop actively. Black puts the knight on a6, heading for c7, and hits the centre with ...c5.",
        },
        {
          name: "150 Attack",
          pgn: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2 Nbd7",
          text:
            "White plans O-O-O and h4-h5. Black plays ...c6 and ...b5 to start queenside counterplay, and keeps the king flexible.",
        },
        {
          name: "Classical with 5.Be2",
          pgn: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c6 7.a4 Nbd7 8.Re1 e5",
          text:
            "The quiet main line. White develops solidly and Black breaks in the centre with ...e5 when ready.",
        },
      ],
      againstIt:
        "Most White players grab space with f4 (the Austrian Attack) or Be3 and Qd2 (the 150 Attack). The best way to fight it is to develop the pieces fast, castle, and then use the extra space for a pawn storm or kingside attack. As White, remember that Black is not worse, so avoid overextending with e5 before you are developed.",
      plans: {
        white:
          "Take the centre with e4 and d4, develop naturally, and choose between attacking (f4, Be3, Qd2, h4-h5) or a solid Classical set-up with Be2 and O-O. If Black plays ...c5 or ...e5, open the position only when you are ready.",
        black:
          "Complete development with ...Bg7 and ...O-O. Then choose a break: ...c5 against the Austrian, ...c6 and ...b5 against the 150 Attack, ...e5 in the Classical. Do not lose time, and trade White's most dangerous pieces.",
      },
      history:
        "The Pirc Defence is named after the Slovenian grandmaster Vasja Pirc, who played and promoted the system in the middle of the twentieth century. It belongs to the hypermodern school, where Black lets White occupy the centre and attacks it later. It has been used by players at every level ever since.",
      faq: [
        {
          q: "Is the Pirc Defence good for beginners?",
          a:
            "It can be, as long as you know the basic plans: develop quickly, castle, and then hit the centre. Be careful against sharp attacking lines like the Austrian Attack.",
        },
        {
          q: "What is the difference between the Pirc and the Modern Defence?",
          a:
            "In the Pirc Black plays ...Nf6 and ...d6 first, while in the Modern Black plays ...g6 and ...Bg7 and may delay the knight. The Pirc is slightly more solid and the Modern more flexible.",
        },
        {
          q: "How do I beat the Austrian Attack?",
          a:
            "Hit the centre with ...c5 as soon as you can, and be ready to trade queens or pieces. If White overextends, the f4 and e4 pawns can become targets.",
        },
        {
          q: "Should I castle early in the Pirc?",
          a:
            "Yes. Castle kingside quickly, because the king is safe behind the g7 bishop and you can start the central counterplay.",
        },
      ],
    },
    lines: [
      {
        name: "Austrian Attack: 6.Be2 and ...c5",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Be2 c5 7.dxc5 Qa5 8.O-O Qxc5+ 9.Kh1 Nc6",
        notes: {
          "1...d6": "The Pirc: a flexible move that waits for White to commit.",
          "2...Nf6": "Hits e4 at once. White can defend with Nc3 or push e5.",
          "3...g6": "Prepares the fianchetto: the bishop will go to g7.",
          "4.f4": "The Austrian Attack: White builds a massive centre.",
          "4...Bg7": "Develops the bishop and prepares castling.",
          "5...O-O": "King safety first.",
          "6...c5": "Counterpunch against d4, aiming to trade and open the c-file.",
          "7...Qa5": "Attacks c5 and the knight on c3 (pinned in some lines).",
          "8...Qxc5+": "Wins the pawn back with check.",
          "9...Nc6": "Develops with pressure on the centre. Black has an active game.",
        },
      },
      {
        name: "Austrian Attack: 6.Bd3 and ...Na6",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.f4 Bg7 5.Nf3 O-O 6.Bd3 Na6 7.O-O c5 8.d5 Bg4",
        notes: {
          "6...Na6": "The knight goes to c7, from where it supports ...b5 and the c5 break.",
          "7...c5": "Hits the centre. If White pushes d5, Black gets a Benoni-like structure.",
          "8...Bg4": "Pins the f3 knight and takes the sting out of White's centre.",
        },
      },
      {
        name: "150 Attack: Be3 and Qd2",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Be3 Bg7 5.Qd2 c6 6.f3 b5 7.Nge2 Nbd7",
        notes: {
          "4.Be3": "The 150 Attack: White plans Qd2, f3 and O-O-O with h4-h5.",
          "5...c6": "Prepares ...b5 and gives the queen the c7 and a5 squares.",
          "6...b5": "Gains queenside space and starts counterplay.",
          "7...Nbd7": "Develops a piece and prepares ...e5 or ...Nb6.",
        },
      },
      {
        name: "Classical with 5.Be2",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O c6 7.a4 Nbd7 8.Re1 e5",
        notes: {
          "4.Nf3": "The Classical Pirc: a solid but less ambitious approach.",
          "5...O-O": "Castle at once; the king is safe behind the g7 bishop.",
          "6...c6": "A flexible move: it prepares ...Qc7 and ...e5.",
          "7...Nbd7": "Prepares the central break ...e5.",
          "8...e5": "Black breaks in the centre and equalises.",
        },
      },
      {
        name: "Classical with 5.Bc4",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Bc4 O-O 6.O-O c6 7.a4 d5",
        notes: {
          "5.Bc4": "The bishop aims at f7, but the Pirc handles it well.",
          "5...O-O": "Castle and keep an eye on the e4 pawn.",
          "6...c6": "Prevents tricks on b5 and prepares ...b5 or ...Qc7.",
          "7...d5": "The engine's choice: strike in the centre at once, before White's bishop and pawns settle. Black has a comfortable game.",
        },
      },
      {
        name: "Classical: the ...Bg4 pin",
        kind: "alternative",
        moves: "1.e4 d6 2.d4 Nf6 3.Nc3 g6 4.Nf3 Bg7 5.Be2 O-O 6.O-O Bg4 7.Be3 Nc6 8.Qd2 e5 9.d5 Bxf3 10.Bxf3 Ne7",
        notes: {
          "6...Bg4": "An active alternative to ...c6: pin the f3 knight and aim for ...e5.",
          "7...Nc6": "Puts pressure on d4.",
          "8...e5": "Fights for the centre.",
          "9...Bxf3": "Black gives up the bishop pair to shut out White's pieces and win time.",
          "10...Ne7": "The knight reroutes to g6 or c8 to keep the position flexible.",
        },
      },
    ],
  },
  {
    id: "dutch-leningrad",
    title: "Dutch Defence: Leningrad",
    side: "black",
    level: "intermediate",
    eco: "A80-A99",
    summary:
      "Fight for e4 with ...f5, fianchetto the bishop with ...g6 and ...Bg7, and play for a kingside attack against White's slower set-ups.",
    ideas: [
      "...f5 grabs e4 and gives Black a kingside space advantage, in exchange for some weaknesses on the e8-h5 diagonal.",
      "In the Leningrad set-up (...g6, ...Bg7, ...O-O, ...d6) the dark-squared bishop is strong and the king is well sheltered.",
      "...Qe8 and ...Na6 are standard regrouping moves, heading for ...e5 or ...c6.",
      "Against the Staunton Gambit 2.e4 take the pawn and give it back at the right moment.",
    ],
    style: "Counterattack",
    article: {
      whatIs:
        "The Dutch Defence begins 1.d4 f5. Black immediately fights for control of e4 and aims for an attack on the kingside. The Leningrad variation adds ...Nf6, ...g6 and ...Bg7, with the bishop on the long diagonal. It is an ambitious opening that gives Black an unbalanced game from the first moves.",
      howToReach:
        "Play 1.d4 f5. After 2.g3 continue 2...Nf6 3.Bg2 g6 and ...Bg7. Against 2.e4 and 2.Bg5 this course gives special answers.",
      pros: [
        "Black takes e4 at once and gets active kingside play.",
        "The fianchetto bishop on g7 is strong, and the position has plenty of fighting chances.",
        "The same plan works against many White systems (g3, Nf3 and c4, or Nc3).",
        "It avoids the huge amount of theory in the main lines of 1.e4 e5 and the Queen's Gambit.",
        "It is a good practical choice if you enjoy playing for a win with Black.",
      ],
      cons: [
        "...f5 weakens the king, and White has tactical tricks like Bg5 and the Staunton Gambit.",
        "Black's e6 square and e8-h5 diagonal can be weak, especially after an early e4 push.",
        "It is slightly riskier than solid defences like the Queen's Gambit Declined or the Slav.",
        "Some lines are very concrete, and a single careless move can be fatal.",
      ],
      variations: [
        {
          name: "Main Leningrad with d5",
          pgn: "1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.Nf3 Bg7 5.O-O O-O 6.c4 d6 7.Nc3 Qe8 8.d5 Na6",
          text:
            "White gains space, Black regroups with ...Qe8 and ...Na6, heading for ...c6 or ...e5. The kingside knight and bishop are ready for a later ...Ng4 or ...e5.",
        },
        {
          name: "Move-order with 4.c4",
          pgn: "1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.c4 Bg7 5.Nc3 O-O 6.Nf3 d6 7.O-O Qe8 8.d5 Na6",
          text:
            "White can play c4 first, but Black reaches the same set-up. The plan with ...Qe8 and ...Na6 is the same.",
        },
        {
          name: "Staunton Gambit",
          pgn: "1.d4 f5 2.e4 fxe4 3.Nc3 Nf6 4.Bg5 Nc6 5.d5 Ne5 6.Qd4 Nf7 7.Bxf6 exf6 8.Nxe4",
          text:
            "White gambits a pawn for rapid development. Black should accept, defend accurately and keep the extra pawn if possible. The pawn on e4 is quite exposed.",
        },
        {
          name: "Bg5 approach",
          pgn: "1.d4 f5 2.Bg5 Nf6 3.Bxf6 exf6 4.e3 d5",
          text:
            "White gives up the bishop pair to damage Black's structure. Black recaptures with the e-pawn and has solid central control.",
        },
      ],
      againstIt:
        "The most common ways to fight the Dutch are the quiet g3 set-ups, the sharp Staunton Gambit (2.e4) and the Bg5 lines. The best way to play against it is to develop quickly, aim for e4 and exploit the weak e8-h5 diagonal. As White, you can also try Nh3 and Nf4 to control the key squares, or use the pressure on the long diagonal.",
      plans: {
        white:
          "Develop the kingside with g3, Bg2, Nf3 and O-O, gain space with c4 and d5, and be ready to attack with e4 once Black runs out of useful moves. Look for Nh4 and Qd3 ideas against a weakened kingside.",
        black:
          "Castle early and make sure e4 is covered. Regroup the queen with ...Qe8 and bring the knight to a6, then break with ...e5, ...c6 or ...Ne4 depending on White's move.",
      },
      history:
        "The Dutch Defence is one of the oldest answers to 1.d4 and takes its name from early analysis by Dutch players. The Leningrad variation is named after the Soviet city where strong players helped to popularise it in the twentieth century, and it is still used by enterprising players at all levels. The Staunton Gambit takes its name from the nineteenth-century player Howard Staunton.",
      faq: [
        {
          q: "Is the Dutch Defence good for beginners?",
          a:
            "It is playable but not the safest choice. The attacking ideas are easy to understand, but you must know how to meet tricks like the Staunton Gambit and Bg5.",
        },
        {
          q: "What is the Leningrad Dutch?",
          a:
            "It is the Dutch Defence where Black plays ...g6 and ...Bg7, fianchettoing the dark-squared bishop. It is the most active version of the opening.",
        },
        {
          q: "How do I meet the Staunton Gambit?",
          a:
            "Take the pawn with ...fxe4 and develop with ...Nf6. Be careful with ...Nc6 and ...Ne5 ideas and keep the extra pawn if you can.",
        },
        {
          q: "Where does Black put the queen in the Leningrad?",
          a:
            "The standard regrouping is ...Qe8, followed by ...Qh5 or ...Qf7, depending on what White plays. It also supports ...e5.",
        },
      ],
    },
    lines: [
      {
        name: "Leningrad main line: 2.g3 and 7.Nc3 Qe8",
        moves: "1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.Nf3 Bg7 5.O-O O-O 6.c4 d6 7.Nc3 Qe8 8.d5 Na6",
        notes: {
          "1...f5": "The Dutch: grab control of e4 immediately.",
          "2...Nf6": "Develops, controls e4 and prepares ...g6.",
          "3...g6": "The Leningrad: the bishop is going to g7.",
          "4...Bg7": "Puts the bishop on the long diagonal.",
          "5...O-O": "King safety first.",
          "6...d6": "Controls e5 and gives the queen room.",
          "7...Qe8": "The standard regrouping: the queen supports ...e5 and eyes the kingside.",
          "8.d5": "White gains space and stops ...e5 for now.",
          "8...Na6": "The knight heads for c5 or c7 and prepares ...c6 or ...Nc5.",
        },
      },
      {
        name: "Move-order with 4.c4",
        moves: "1.d4 f5 2.g3 Nf6 3.Bg2 g6 4.c4 Bg7 5.Nc3 O-O 6.Nf3 d6 7.O-O Qe8 8.d5 Na6",
        notes: {
          "4...Bg7": "Same set-up as the main line; the order of White's moves does not matter much.",
          "6...d6": "Solid, preparing ...Qe8.",
          "7...Qe8": "Black reaches the main set-up by transposition.",
        },
      },
      {
        name: "Staunton Gambit: 4.Bg5 Nc6",
        moves: "1.d4 f5 2.e4 fxe4 3.Nc3 Nf6 4.Bg5 Nc6 5.d5 Ne5 6.Qd4 Nf7 7.Bxf6 exf6 8.Nxe4",
        notes: {
          "2.e4": "The Staunton Gambit: White offers a pawn for quick development.",
          "2...fxe4": "Take the pawn. The Dutch can hold it if you are careful.",
          "3...Nf6": "Defends against Qh5+ and prepares ...Nc6.",
          "4...Nc6": "Develops and attacks d4.",
          "5...Ne5": "The knight retreats from the d5 pawn to the strong e5 square, where it also eyes d3 and f3.",
          "6...Nf7": "The knight retreats safely and attacks the bishop on g5.",
          "7...exf6": "Black takes with the e-pawn to keep the structure solid.",
        },
      },
      {
        name: "Staunton: the ...g6 alternative",
        kind: "alternative",
        moves: "1.d4 f5 2.e4 fxe4 3.Nc3 Nf6 4.Bg5 g6 5.Bxf6 exf6 6.Nxe4 d5 7.Ng3 Bd6",
        notes: {
          "4...g6": "A different approach: prepare ...Bg7, but White can trade bishops first.",
          "5...exf6": "The pawn structure gets a bit loose but Black has the bishop pair.",
          "6...d5": "Kicks the knight from e4 and takes control of the centre.",
          "7...Bd6": "Develops and eyes the kingside.",
        },
      },
      {
        name: "2.Bg5 Nf6 3.Bxf6 exf6",
        moves: "1.d4 f5 2.Bg5 Nf6 3.Bxf6 exf6 4.e3 d5",
        notes: {
          "2.Bg5": "White pins the knight and may try to trade it.",
          "2...Nf6": "Develops and controls e4. White cannot win a pawn.",
          "3...exf6": "Black recaptures with the e-pawn: the pawn structure is awkward but Black has the open e-file and a solid centre.",
          "4...d5": "Fights for the centre and prepares ...Bd6.",
        },
      },
      {
        name: "Warning: do not grab the bishop with ...gxh4",
        kind: "warning",
        moves: "1.d4 f5 2.Bg5 h6 3.Bh4 g5 4.e4 gxh4 5.Qh5#",
        notes: {
          "2...h6": "A tempting move, but White has a famous trap.",
          "3...g5": "Black attacks the bishop on h4 and hopes to win it. This is the trap White has set.",
          "4.e4": "A wonderful shot: White ignores the threat and opens the diagonal to h5.",
          "4...gxh4": "A fatal mistake. Black must decline the bishop and defend, for example with ...fxe4. Taking it walks into mate.",
          "5.Qh5#": "Checkmate! The f7 and g6 squares are empty and the king has no escape.",
        },
      },
    ],
  },
  {
    id: "catalan-opening",
    title: "Catalan Opening",
    side: "white",
    level: "intermediate",
    eco: "E00-E09",
    summary:
      "A flexible Queen's Pawn system: fianchetto the king's bishop on g2 and keep long-term pressure on Black's queenside and centre.",
    ideas: [
      "Bg2 eyes the long diagonal and puts steady pressure on d5 and c6.",
      "Often White gets a pawn back after ...dxc4 and keeps a small, lasting initiative.",
      "Closed Catalan: Qc2, Nbd2 and e4 to expand in the centre; Open Catalan: take back c4 and use the pressure on the diagonal.",
      "The set-up is safe for White's king and low on theory compared with the Queen's Gambit main lines.",
    ],
    style: "System",
    article: {
      whatIs:
        "The Catalan Opening starts 1.d4 Nf6 2.c4 e6 3.g3. White fianchettoes the bishop and combines the Queen's Gambit pawn structure with long-range pressure on the diagonal. It is a classical but flexible system that gives White a risk-free, slightly better game in many positions.",
      howToReach:
        "Play 1.d4 Nf6 2.c4 e6 3.g3. If Black plays 3...d5, continue 4.Bg2. If Black plays 3...Bb4+, answer 4.Bd2.",
      pros: [
        "The bishop on g2 is very powerful, and White's king is safe after castling.",
        "You get a lasting pull without needing to learn a huge amount of theory.",
        "It works against several Black set-ups: ...d5, ...Bb4+ and ...c5.",
        "The same ideas work in the Reti and English, so it fits easily with other systems.",
        "Games are strategic and calm, which suits players who like to outplay opponents slowly.",
      ],
      cons: [
        "Black has solid ways to equalise, so you need patience to convert a small edge.",
        "The Open Catalan requires accuracy when Black grabs the pawn on c4.",
        "Black can transpose into more familiar lines with ...Bb4+ and ...d5, so you need a couple of ideas ready.",
        "If you like open attacking play, the Catalan may feel slow.",
      ],
      variations: [
        {
          name: "Open Catalan",
          pgn: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O dxc4 7.Qc2 a6 8.Qxc4 b5 9.Qc2 Bb7 10.Bd2",
          text:
            "Black takes the c4 pawn but must give it back. White regains the pawn with Qxc4 and keeps the pressure on the long diagonal, while Black tries to expand with ...b5.",
        },
        {
          name: "Closed Catalan",
          pgn: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O Nbd7 7.Qc2 c6 8.Nbd2 b6 9.e4 Bb7 10.Rd1",
          text:
            "Black keeps the centre closed. White builds with Qc2 and Nbd2, then strikes with e4 to gain space and activity.",
        },
        {
          name: "Early ...dxc4",
          pgn: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Qa4+ Nbd7 6.Qxc4 a6 7.Qc2",
          text:
            "Black grabs the pawn at once. White checks, takes the pawn back and keeps a safe game with a small lead in development.",
        },
        {
          name: "Black plays ...Bb4+",
          pgn: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Bb4+ 5.Bd2 Be7 6.Nf3 O-O 7.O-O",
          text:
            "Black pins and then retreats. White develops normally and has gained time for the c4 pawn push.",
        },
      ],
      againstIt:
        "Black usually answers the Catalan with ...d5 and ...Be7, then either the Closed set-up with ...c6 and ...Nbd7, or the Open Catalan with ...dxc4. The best way to fight it is to hit the centre with ...c5 or ...e5 at the right time, or give the pawn back safely. As White, avoid grabbing too much too soon: the pressure on the diagonal is your main asset.",
      plans: {
        white:
          "Develop with Bg2, Nf3 and O-O, then decide between a quiet Qc2 and Nbd2 build-up with e4 (Closed) or regaining the c4 pawn and keeping the bishop pair (Open). Rooks go to d1 and c1, and Bf4 or Bd2 can help pressure the queenside.",
        black:
          "Develop with ...Be7, ...O-O and ...Nbd7. Break with ...c5 or ...e5, or take on c4 and try to keep the pawn with ...b5. Remember to deal with the long diagonal as the position opens.",
      },
      history:
        "The Catalan Opening takes its name from Catalonia in Spain and became established in the 1920s, and it has been a regular choice of elite players ever since. It became fashionable at the top level in the later twentieth century and remains one of the most respected ways of playing 1.d4 without allowing the main Queen's Gambit lines. Its popularity has grown even more because it is low-risk for White.",
      faq: [
        {
          q: "Is the Catalan good for beginners?",
          a:
            "It is a strategic opening and is a bit harder to understand than the London System, but the ideas are clear: fianchetto the bishop, castle and use the long diagonal. It is a great choice for a patient player.",
        },
        {
          q: "What is the difference between the Open and the Closed Catalan?",
          a:
            "In the Open Catalan Black takes on c4, and White tries to win the pawn back. In the Closed Catalan Black keeps the pawn on d5 and the centre stays more closed.",
        },
        {
          q: "What if Black plays 3...Bb4+?",
          a:
            "Answer 4.Bd2 and then Bg2 or Qc2. You can also play 4.Nbd2, depending on your style.",
        },
        {
          q: "Does the Catalan give White a real advantage?",
          a:
            "Only a small edge, but it is enough to play for a win if you handle the long diagonal well. It is mainly a positional system, not a forced win.",
        },
      ],
    },
    lines: [
      {
        name: "Open Catalan: 6...dxc4 7.Qc2 a6",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O dxc4 7.Qc2 a6 8.Qxc4 b5 9.Qc2 Bb7 10.Bd2",
        notes: {
          "3.g3": "The Catalan: the king's bishop will go to g2 and press on the long diagonal.",
          "4.Bg2": "The bishop eyes d5 and the queen's rook, putting pressure on Black's centre.",
          "5.Nf3": "Develops and prepares castling.",
          "6.O-O": "The king is safe, and White is ready for Qc2.",
          "7.Qc2": "Prepares to win the c4 pawn back with the queen. It also keeps the bishop on c1 flexible.",
          "8.Qxc4": "White regains the pawn and keeps a nice position.",
          "9.Qc2": "The queen avoids ...Bb7 and ...b4 tricks and keeps the diagonal pressure.",
          "10.Bd2": "Develops the bishop with ideas like Bc3 or Bf4.",
        },
      },
      {
        name: "Closed Catalan: 6...Nbd7 7.Qc2 c6",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O Nbd7 7.Qc2 c6 8.Nbd2 b6 9.e4 Bb7 10.Rd1",
        notes: {
          "7.Qc2": "Supports the e4 break and keeps options open.",
          "8.Nbd2": "Supports e4 and prepares to push it.",
          "9.e4": "White strikes in the centre and gains space.",
          "10.Rd1": "Puts the rook on the d-file where the centre is about to open.",
        },
      },
      {
        name: "Black takes at once: 4...dxc4 5.Qa4+",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Qa4+ Nbd7 6.Qxc4 a6 7.Qc2",
        notes: {
          "5.Qa4+": "Check and regains the pawn. The queen is safe on a4.",
          "6.Qxc4": "White regains the pawn and keeps a nice lead in development.",
          "7.Qc2": "Retreats from ...b5 and keeps the bishop strong on g2.",
        },
      },
      {
        name: "Bogo-Catalan: 4...Bb4+ 5.Bd2",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Bb4+ 5.Bd2 Be7 6.Nf3 O-O 7.O-O",
        notes: {
          "5.Bd2": "Blocks the check and prepares to trade the bishops on d2.",
          "6.Nf3": "Develops with a normal position.",
          "7.O-O": "White castles, with a small lead in development.",
        },
      },
      {
        name: "Open Catalan: punishing 7...b5",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 Be7 5.Nf3 O-O 6.O-O dxc4 7.Qc2 b5 8.a4 c6 9.axb5 cxb5 10.Ng5",
        notes: {
          "8.a4": "Undermines the b5 pawn and Black's grip on c4.",
          "9.axb5": "Opens the a-file and tears down the pawn chain.",
          "10.Ng5": "The knight eyes e6 and b5 and threatens to win material. Black's b5 pawn grab is too ambitious, and White gets a clear edge.",
        },
      },
      {
        name: "Early ...dxc4: the 5.Nf3 option",
        kind: "alternative",
        moves: "1.d4 Nf6 2.c4 e6 3.g3 d5 4.Bg2 dxc4 5.Nf3 a6 6.O-O Nc6 7.e3 Rb8",
        notes: {
          "5.Nf3": "A quiet alternative to the queen check. White intends to win the pawn back slowly.",
          "6.O-O": "King safety and ready for Qe2 and Rd1.",
          "7.e3": "Prepares Qe2 and the retake on c4.",
        },
      },
    ],
  },
  {
    id: "trompowsky-attack",
    title: "Trompowsky Attack",
    side: "white",
    level: "beginner",
    eco: "A45",
    summary:
      "Pin or trade the knight at once with 1.d4 Nf6 2.Bg5. It sidesteps a lot of mainstream theory and gives the opponent unfamiliar problems from move two.",
    ideas: [
      "2.Bg5 attacks the knight on f6 and often doubles Black's pawns after Bxf6.",
      "Against 2...Ne4 retreat 3.Bf4 and play e3 or f3 to kick the knight and build a solid centre.",
      "Against 2...c5 and 2...d5 trade on f6 and use your lead in development.",
      "You usually get a flexible game without having to know a lot of theory.",
    ],
    style: "System",
    article: {
      whatIs:
        "The Trompowsky Attack is 1.d4 Nf6 2.Bg5. White develops the bishop outside the pawn chain and puts the question to Black's f6 knight straight away. Games are often unbalanced, and many opponents have little experience against it, which makes it a practical weapon.",
      howToReach:
        "Play 1.d4 and, after the reply 1...Nf6, play 2.Bg5. If Black plays something else on move one, you need a different plan.",
      pros: [
        "Little theory compared with mainstream 1.d4 openings, so you can learn it quickly.",
        "Opponents often misplay it because the ideas are unfamiliar.",
        "You can get an active position with a solid structure.",
        "White often wins the bishop pair or damages Black's pawns after Bxf6.",
        "It combines nicely with the London System and the Queen's Gambit.",
      ],
      cons: [
        "If Black plays accurately, White's bishop may lose time and Black can equalise easily.",
        "The line ...Ne4 followed by ...c5 or ...d5 needs careful handling.",
        "Black can sometimes punish early overextension, for example by gaining the bishop pair.",
        "It is less flexible than the London, because the bishop is committed early.",
      ],
      variations: [
        {
          name: "2...Ne4 with 3.Bf4",
          pgn: "1.d4 Nf6 2.Bg5 Ne4 3.Bf4 d5 4.e3 c5 5.c3 Nc6 6.Nd2",
          text:
            "Black attacks the bishop with the knight, so White retreats. After ...d5 and ...c5, White supports the centre with e3 and c3 and challenges the e4 knight with Nd2.",
        },
        {
          name: "2...e6 with 3.e4",
          pgn: "1.d4 Nf6 2.Bg5 e6 3.e4 h6 4.Bxf6 Qxf6 5.Nc3 Bb4 6.Qd3 d6 7.Nf3",
          text:
            "White takes the centre. If Black attacks the bishop with ...h6, White trades and gets a big centre with the lead in development.",
        },
        {
          name: "2...d5 with 3.Bxf6",
          pgn: "1.d4 Nf6 2.Bg5 d5 3.Bxf6 exf6 4.e3 Be6 5.Bd3 Bd6",
          text:
            "White trades the bishop for the knight and aims for a quiet game. Black has the bishop pair and open lines, but must avoid weakness on the kingside.",
        },
        {
          name: "2...c5 with 3.Bxf6",
          pgn: "1.d4 Nf6 2.Bg5 c5 3.Bxf6 gxf6 4.d5 d6 5.e4 Bg7 6.Nc3 Nd7 7.Qd2",
          text:
            "White doubles Black's pawns and gains space with d5 and e4. Black has the bishop pair but a weak pawn structure.",
        },
      ],
      againstIt:
        "The most testing replies are 2...Ne4, which challenges the bishop, and 2...c5 and 2...d5, which fight for the centre at once. The best way to fight it is to hit back in the centre, avoid weakening moves like ...g5 without a reason, and use the bishop pair if White trades. As White, remember that the bishop may need to retreat, so do not spend too many moves on it.",
      plans: {
        white:
          "Develop the pieces quickly and aim for e3, Nf3, Bd3 and c3 or c4. If Black recaptures with a pawn on f6, expand in the centre with d5 and e4. Keep the bishop on the best diagonal and avoid unnecessary pawn moves.",
        black:
          "Challenge the bishop with ...Ne4 or ...h6, grab the centre with ...d5 or ...c5, and aim to keep the bishop pair. Do not let White build a big centre for free.",
      },
      history:
        "The Trompowsky Attack is named after the Brazilian player Octavio Trompowsky, who played it in the 1930s and 1940s. It was later taken up by strong players as a way to avoid the heavily analysed main lines of the Queen's Pawn Game, and it has been used at all levels ever since.",
      faq: [
        {
          q: "Is the Trompowsky good for beginners?",
          a:
            "Yes. It has few lines to remember and teaches you to develop quickly. The ideas are easy to understand, but you must watch for tactics against the bishop and the knight.",
        },
        {
          q: "What do I do against 2...Ne4?",
          a:
            "Play 3.Bf4. Then kick the knight with e3 and Nd2, or f3 if Black plays ...c5. Do not play h4 or Bh4 without a plan.",
        },
        {
          q: "Should I always take on f6?",
          a:
            "Not always. Take when Black has no good way to recapture, or when the pawn structure gets damaged. If Black has ...h6 available, you can also keep the pin.",
        },
        {
          q: "What if Black plays ...g6?",
          a:
            "Play Nf3 and Nbd2, and build a solid centre with e4. The bishop on g5 does not need to take on f6 immediately.",
        },
      ],
    },
    lines: [
      {
        name: "vs 2...Ne4: 3.Bf4 d5 4.e3 c5",
        moves: "1.d4 Nf6 2.Bg5 Ne4 3.Bf4 d5 4.e3 c5 5.c3 Nc6 6.Nd2",
        notes: {
          "2.Bg5": "The Trompowsky: the bishop pins the knight to the queen and prepares Bxf6.",
          "3.Bf4": "The bishop retreats to a safe square, keeping the diagonal to b8.",
          "4.e3": "Opens the bishop on f1 and prepares Nd2 and Bd3.",
          "5.c3": "Supports d4 and keeps Black's queen out of a5 and b6 with check.",
          "6.Nd2": "Challenges the knight on e4. White trades it and keeps a good structure.",
        },
      },
      {
        name: "vs 2...Ne4: 3.Bf4 c5 4.f3",
        moves: "1.d4 Nf6 2.Bg5 Ne4 3.Bf4 c5 4.f3 Qa5+ 5.c3 Nf6 6.d5 Qb6",
        notes: {
          "4.f3": "Kicks the knight at once. The knight must go back, and White takes a space advantage.",
          "5.c3": "Blocks the check and prepares d5.",
          "6.d5": "Gains space and attacks nothing yet, but Black's queen on a5 is out of play.",
        },
      },
      {
        name: "vs 2...e6: 3.e4 and 4.Bxf6",
        moves: "1.d4 Nf6 2.Bg5 e6 3.e4 h6 4.Bxf6 Qxf6 5.Nc3 Bb4 6.Qd3 d6 7.Nf3",
        notes: {
          "3.e4": "Grabs the centre at once. If Black takes, White will have a big lead.",
          "4.Bxf6": "Black has asked the bishop to move, so trade it for the knight and remove a defender of e4.",
          "5.Nc3": "Develops and defends e4.",
          "6.Qd3": "Supports e4 and prepares to take on b4 or castle long if needed.",
          "7.Nf3": "Develops with a good game.",
        },
      },
      {
        name: "vs 2...d5: 3.Bxf6 exf6",
        moves: "1.d4 Nf6 2.Bg5 d5 3.Bxf6 exf6 4.e3 Be6 5.Bd3 Bd6",
        notes: {
          "3.Bxf6": "Trade the bishop for the knight. Black gets the bishop pair, but the pawn structure is simple.",
          "4.e3": "Solid. White opens the bishop and prepares Nf3.",
          "5.Bd3": "Develops with a nice diagonal toward h7.",
        },
      },
      {
        name: "vs 2...c5: 3.Bxf6 gxf6 4.d5",
        moves: "1.d4 Nf6 2.Bg5 c5 3.Bxf6 gxf6 4.d5 d6 5.e4 Bg7 6.Nc3 Nd7 7.Qd2",
        notes: {
          "3.Bxf6": "Doubles Black's pawns on the f-file.",
          "4.d5": "Gains space and keeps Black's pieces cramped.",
          "5.e4": "Builds a big centre.",
          "6.Nc3": "Develops with solid support for e4.",
          "7.Qd2": "Prepares O-O-O or a quiet Nf3 and keeps the queen active.",
        },
      },
      {
        name: "vs 2...g6: Nf3 and Nbd2",
        moves: "1.d4 Nf6 2.Bg5 g6 3.Nf3 Bg7 4.Nbd2 d6 5.e4 O-O 6.c3",
        notes: {
          "3.Nf3": "Develops and keeps options open; no need to trade the bishop.",
          "4.Nbd2": "Prepares e4 and supports the centre.",
          "5.e4": "Takes the centre. White has a safe, comfortable game.",
          "6.c3": "Supports d4 and gives the queen room to move.",
        },
      },
    ],
  },
  {
    id: "vienna-game",
    title: "Vienna Game (quiet 3.Bc4 and 3.g3 systems)",
    side: "white",
    level: "beginner",
    eco: "C25-C29",
    summary:
      "1.e4 e5 2.Nc3: develop the queen's knight first and decide later. A calm way to get a safe, active game without the sharp theory of the Vienna Gambit.",
    ideas: [
      "2.Nc3 supports e4 and keeps f4 and Bc4 available as later options.",
      "The quiet set-up with Bc4, d3 and Nge2 or Nf3 is easy to learn and hard to attack.",
      "The 3.g3 system fianchettoes the bishop and keeps the centre solid.",
      "Watch out for ...Nxe4 tricks and ...Qh4 ideas after a hasty Bc4.",
    ],
    style: "Classical",
    article: {
      whatIs:
        "The Vienna Game starts 1.e4 e5 2.Nc3. White develops a knight to c3 and keeps the choice between the sharp f4 (the Vienna Gambit, covered in a separate course) and quieter moves like Bc4 and g3. This course focuses on the quiet side: build a solid centre, develop calmly and use the extra tempo for a safe game.",
      howToReach:
        "After 1.e4 e5 play 2.Nc3. Against 2...Nf6 you can choose 3.Bc4 or 3.g3. Against 2...Nc6 and 2...Bc5 play 3.g3 or 3.Bc4 as shown here.",
      pros: [
        "It avoids the mountains of theory in the Ruy Lopez and the Italian.",
        "Natural development, with a solid centre and no early commitments.",
        "It can transpose to many other openings, so you can choose between quiet and sharp.",
        "The knight on c3 supports e4 and can go to d5 later.",
        "Opponents often misplay it, since 2.Nc3 is less familiar than 2.Nf3.",
      ],
      cons: [
        "White gets a small edge at best, and Black can equalise with accurate play.",
        "After 3.Bc4 Nxe4 the position becomes sharp and well known, and you need to know a few lines.",
        "The knight on c3 blocks the c-pawn, so c3 and d4 ideas are not available.",
        "Black can take the initiative with ...d5 if White is too slow.",
      ],
      variations: [
        {
          name: "3.Bc4 Nc6 and the quiet 4.d3",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.Bc4 Nc6 4.d3 Bb4 5.Ne2 d5 6.exd5 Nxd5 7.O-O",
          text:
            "White keeps the centre closed and builds with d3 and Nge2. Black's pin on c3 is not dangerous, and the exchange on d5 gives a comfortable game.",
        },
        {
          name: "Black plays 2...Bc5",
          pgn: "1.e4 e5 2.Nc3 Bc5 3.Bc4 Nf6 4.d3 d6 5.Nf3 Nc6 6.O-O O-O 7.Bg5 h6 8.Bh4",
          text:
            "Black develops the bishop to c5. White plays a calm Italian-style set-up with d3, Nf3 and Bg5.",
        },
        {
          name: "The 3.g3 system",
          pgn: "1.e4 e5 2.Nc3 Nf6 3.g3 d5 4.exd5 Nxd5 5.Bg2 Nxc3 6.bxc3 Bd6 7.Nf3 O-O 8.O-O Re8",
          text:
            "White fianchettoes the bishop, trades on c3 and has a solid centre. Black has a free game but White's bishop on g2 is strong.",
        },
        {
          name: "Fianchetto against 2...Nc6",
          pgn: "1.e4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nge2 Nf6 7.Be3 O-O",
          text:
            "White sets up a solid fianchetto and plays d3, Nge2 and Be3. The plan is f4 or h3 and Qd2, depending on Black's setup.",
        },
      ],
      againstIt:
        "The sharpest answer is 2...Nf6 followed by ...Nxe4 if White plays Bc4 too soon. Black can also grab the centre with ...d5 or pin the knight with ...Bb4. The best way to fight it is to strike in the centre early and not allow White to play f4 for free. As White, keep the pawn on e4 well supported and do not rush Qh5 or Bxf7.",
      plans: {
        white:
          "Develop the knights and bishops, castle, and play d3 to support e4. Then decide between a kingside advance with f4, a fianchetto with g3 and Bg2, or a queenside expansion with a4 and Nd5.",
        black:
          "Hit the centre with ...d5 or ...Nf6, develop the kingside, and aim for ...Bb4 or ...Bc5 to take control of the dark squares. If White is slow, a quick ...d5 gives Black a comfortable game.",
      },
      history:
        "The Vienna Game is named after the Austrian capital and was analysed and played in the nineteenth century. It was a favourite of several leading players of the time and was later revived by others at the top level. Today it is still a popular choice for players who want a flexible start without the heaviest theory.",
      faq: [
        {
          q: "Is the Vienna Game good for beginners?",
          a:
            "Yes. The ideas are simple: develop quickly, control the centre and castle. It is less demanding than the Ruy Lopez and has fewer traps than the Italian.",
        },
        {
          q: "What is the difference between the Vienna Game and the Vienna Gambit?",
          a:
            "In the Vienna Gambit White plays f4 early and offers a pawn. In the quiet Vienna White plays Bc4 or g3 and keeps a solid, flexible position.",
        },
        {
          q: "What do I do against 3...Nxe4 after 3.Bc4?",
          a:
            "The critical reply is 4.Qh5, but it is sharp and needs preparation. In this course you play 3.Bc4 against 2...Nc6 and 3.g3 as a calm alternative against 2...Nf6.",
        },
        {
          q: "Can I play f4 later in the Vienna?",
          a:
            "Yes. If Black plays passively, f4 is always an option. It is the main idea of the Vienna Gambit course.",
        },
      ],
    },
    lines: [
      {
        name: "Quick win: 4.d3 Nxe4? 5.dxe4",
        moves: "1.e4 e5 2.Nc3 Nf6 3.Bc4 Nc6 4.d3 Nxe4 5.dxe4",
        notes: {
          "2.Nc3": "The Vienna: develops a knight, supports e4 and keeps f4 in reserve.",
          "3.Bc4": "Aims at f7 and prepares to castle.",
          "4.d3": "Protects the e4 pawn a second time, so the knight cannot take it.",
          "5.dxe4": "White wins a knight for a pawn. The e4 pawn was protected twice and attacked only once.",
        },
      },
      {
        name: "Quiet Vienna: 3.Bc4 Nc6 4.d3 Bb4",
        moves: "1.e4 e5 2.Nc3 Nf6 3.Bc4 Nc6 4.d3 Bb4 5.Ne2 d5 6.exd5 Nxd5 7.O-O",
        notes: {
          "4.d3": "Solid. White protects e4 and opens the bishop on c1.",
          "5.Ne2": "Defends the knight on c3 and prepares to castle. It also keeps f3 free for the f-pawn.",
          "6.exd5": "Opens the position and clarifies the centre.",
          "7.O-O": "White castles, with a comfortable, balanced position.",
        },
      },
      {
        name: "Black plays 2...Bc5",
        moves: "1.e4 e5 2.Nc3 Bc5 3.Bc4 Nf6 4.d3 d6 5.Nf3 Nc6 6.O-O O-O 7.Bg5 h6 8.Bh4",
        notes: {
          "3.Bc4": "Mirrors Black's set-up and aims at f7.",
          "4.d3": "Protects e4 and keeps the position solid.",
          "5.Nf3": "Develops with a standard Italian-style plan.",
          "6.O-O": "King safety and ready to play Na4 or Bg5.",
          "7.Bg5": "Pins the knight and prepares Nd5.",
          "8.Bh4": "Keeps the pin and avoids exchanges.",
        },
      },
      {
        name: "The 3.g3 system against 2...Nf6",
        kind: "alternative",
        moves: "1.e4 e5 2.Nc3 Nf6 3.g3 d5 4.exd5 Nxd5 5.Bg2 Nxc3 6.bxc3 Bd6 7.Nf3 O-O 8.O-O Re8",
        notes: {
          "3.g3": "A calm alternative to 3.Bc4: the bishop heads for g2 and avoids ...Nxe4 tactics.",
          "4.exd5": "Takes the pawn and opens the centre. Black recaptures with the knight.",
          "5.Bg2": "The bishop eyes the centre and the long diagonal.",
          "6.bxc3": "White accepts doubled pawns in return for a strong centre and an open b-file.",
          "7.Nf3": "Develops and eyes e5.",
          "8.O-O": "King safety, with a solid position.",
        },
      },
      {
        name: "3.g3 with ...Nc6 and ...Bc5",
        kind: "alternative",
        moves: "1.e4 e5 2.Nc3 Nf6 3.g3 Nc6 4.Bg2 Bc5 5.Nge2 d6 6.d3 O-O 7.O-O",
        notes: {
          "3...Nc6": "Develops and attacks the centre.",
          "4.Bg2": "The fianchetto bishop supports the centre and is safe from attack.",
          "5.Nge2": "A quiet developing move that keeps the f-pawn free.",
          "6.d3": "Solid. White keeps the centre closed and avoids early tactics.",
          "7.O-O": "White castles and has a comfortable, flexible position.",
        },
      },
      {
        name: "Fianchetto against 2...Nc6",
        moves: "1.e4 e5 2.Nc3 Nc6 3.g3 g6 4.Bg2 Bg7 5.d3 d6 6.Nge2 Nf6 7.Be3 O-O",
        notes: {
          "3.g3": "A fianchetto set-up that avoids Black's quick ...Bb4 and ...Nf6 pressure on e4.",
          "4.Bg2": "The bishop eyes the long diagonal.",
          "5.d3": "Solid; protects e4 and opens the bishop on c1.",
          "6.Nge2": "Develops with a flexible position, keeping f4 available.",
          "7.Be3": "Prepares Qd2 and a kingside plan with f4.",
        },
      },
    ],
  },
];
