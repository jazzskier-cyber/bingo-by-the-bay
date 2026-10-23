# Bingo by the Bay

A portrait-first playable visual prototype for a cozy native bingo concept. This version runs in a browser; it is not yet an iOS or Android application.

Requires Node.js 22.12 or newer (Node.js 24 recommended). From this repository:

```sh
npm ci
npm run dev -- --port 5176
npm test
npm run build
```

Open http://127.0.0.1:5176/. Production files are in this game's `dist/`.

Each session starts with round 1 in **Classic**, then alternates **Lucky Choice → Classic → Lucky Choice** after each win. Reloading starts a new session at Classic while keeping earned shells and flowers. The win screen names and explains the upcoming mode.

**Classic:** draw from all 75 numbers without repeats, manually or with optional 8-second auto-call. Stamp called numbers; previous calls remain valid. There are no wilds or choices, and bingo earns 20 bonus shells. Auto-call stops for dialogs, hidden tabs, and wins.

**Lucky Choice:** choose one of two offered numbers, then stamp it on the card. Both offers are unmarked card numbers, so every turn advances the board. Complete a row, column, or diagonal; the center is free. Three normal stamps earn one wild stamp, usable on any unmarked square. Wild stamps do not charge another wild. Finish in 8 moves for gold (40 bonus shells), 12 for silver (30), or more for bronze (20). Every stamp also earns one shell. Plant cottage flowers for 12 shells. Shells and flowers save locally; unfinished rounds do not.

Portrait-first bright coastal palette: turquoise, tangerine, yellow, and white. Matching-number highlights assist rounds 1–2 only; from round 3 onward, locate numbers without board hints in both modes. Player stamps and completed winning lines remain visible. The call-ball letter is 23px and the number 33px. Short screens scroll. No timer, purchases, game-owned backend or multiplayer.

Tap the music-note control to enable an original synthesized instrumental loop at 88 BPM with broken chords, bass, bell melody, and light percussion. Music pauses in background tabs. The same control mutes music and stamp chimes.

Validation: production build and ten core-rule tests pass. Chrome smoke checks verify choosing a number, stamping it, shell and wild-charge updates, active audio playback, and first-round Classic number calling. Automated tests cover mode alternation, the complete Classic deck, and separate mode rewards. Physical iOS/Android device testing and native packaging remain future work. Fonts use Google Fonts with system fallbacks.

## Challenges and leaderboard

The trophy opens the daily challenge and local personal records, also available after winning. Daily challenges open in a separate tab at `?daily=1`, preserving the casual round. UTC dates seed a fixed card and per-move candidate priorities; wild stamps filter those priorities without rerolling them. Challenges have no matching hints and use move count, never time. Replays are allowed; only the best move count is retained per date. A round crossing midnight remains assigned to its starting UTC date. Classic win counts and casual Choice bests are separate from daily records. Results are stored under `bingo-bay-records` on this device.

The trophy also opens **Tide Trial** at `?ranked=1`. This is a separate fixed-seed Lucky Choice puzzle: every player gets the same card and deterministic offer priorities. There are no wild stamps, number hints, timer bonuses or shell-based points. A completed Bingo submits its integer choice count, 4–24, to the dedicated [AIWANNA Tide Trial board](https://www.ai-made.games/games/bingo-by-the-bay-f54722fb/leaderboard?board=dfc6f50a-2d1f-4117-b428-7cda0eb38966). Fewer choices rank higher; the platform keeps each player's best and gives ties the same rank. Daily puzzles are still local-only because this platform's boards do not divide entries by challenge date.

The game starts a leaderboard run at the beginning of each Tide Trial and submits only after a winning line. It obtains a game-scoped player token from the AIWANNA parent frame; standalone play stays playable but cannot submit. Start and settlement use separate idempotency keys, and a failed settlement can be retried without changing the score. The platform accepts client-reported scores for casual play and does not validate the move replay, so this is not a cheat-resistant competition.
