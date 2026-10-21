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

Portrait-first bright coastal palette: turquoise, tangerine, yellow, and white. Matching-number highlights assist rounds 1–2 only; from round 3 onward, locate numbers without board hints in both modes. Player stamps and completed winning lines remain visible. The call-ball letter is 23px and the number 33px. Short screens scroll. No timer, purchases, account, backend, or multiplayer.

Tap the music-note control to enable an original synthesized instrumental loop at 88 BPM with broken chords, bass, bell melody, and light percussion. Music pauses in background tabs. The same control mutes music and stamp chimes.

Validation: production build and ten core-rule tests pass. Chrome smoke checks verify choosing a number, stamping it, shell and wild-charge updates, active audio playback, and first-round Classic number calling. Automated tests cover mode alternation, the complete Classic deck, and separate mode rewards. Physical iOS/Android device testing and native packaging remain future work. Fonts use Google Fonts with system fallbacks.

## Daily challenge and records

The trophy opens the daily challenge and local personal records, also available after winning. Daily challenges open in a separate tab at `?daily=1`, preserving the casual round. UTC dates seed a fixed card and per-move candidate priorities; wild stamps filter those priorities without rerolling them. Challenges have no matching hints and use move count, never time. Replays are allowed; only the best move count is retained per date. A round crossing midnight remains assigned to its starting UTC date. Classic win counts and casual Choice bests are separate from daily records. Results are stored under `bingo-bay-records` on this device.

Online rankings are explicitly not connected: the existing 1GP integration belongs to Cloud Garden, not this game. A real cross-player leaderboard still requires a dedicated Bingo backend/board, player identity, authoritative UTC challenge seeds, replay validation of choices/wilds/winning lines, and equal ranking for equal move counts. No ranks or other-player scores are fabricated. Current local records are not cheat-resistant and must not be accepted as trusted ranked submissions.
