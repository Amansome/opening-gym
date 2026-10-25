// A Lichess-study-shaped PGN (two chapters, variations, comments with drawing commands, an empty chapter).
export const STUDY_PGN = `[Event "Italian Repertoire: Giuoco Piano"]
[Site "https://lichess.org/study/AbCd1234/ChAp0001"]
[Result "*"]
[Variant "Standard"]
[ECO "C54"]
[Opening "Italian Game: Giuoco Piano"]
[StudyName "Italian Repertoire"]
[ChapterName "Giuoco Piano"]
[Orientation "white"]

{ The Italian Game fights for the centre and eyes f7. }
1. e4 e5 2. Nf3 { Develops with tempo, attacking e5. [%cal Gg1f3] } 2... Nc6 3. Bc4 { The Italian bishop eyes f7. } 3... Bc5 ( 3... Nf6 $5 { The Two Knights. } 4. Ng5 d5 5. exd5 ) 4. c3! { Prepares d4. [%clk 0:10:00] } 4... Nf6 5. d3 d6 *

[Event "Italian Repertoire: Evans Gambit"]
[Variant "Standard"]
[StudyName "Italian Repertoire"]
[ChapterName "Evans Gambit"]
[Orientation "white"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 { The Evans Gambit: a pawn for rapid development. } 4... Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O *

[Event "Italian Repertoire: Empty"]
[ChapterName "Empty chapter"]
[Variant "Standard"]

*
`;
