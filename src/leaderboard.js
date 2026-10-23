export const leaderboardConfig = Object.freeze({
  origin: 'https://www.ai-made.games',
  gameId: 'e9554391-e015-445e-ac91-0c94151ee73f',
  boardId: 'dfc6f50a-2d1f-4117-b428-7cda0eb38966',
  challenge: 'tide-trial-v1',
  minMoves: 4,
  maxMoves: 24,
});

export const leaderboardUrl = `${leaderboardConfig.origin}/games/bingo-by-the-bay-f54722fb/leaderboard?board=${leaderboardConfig.boardId}`;

export function rankedScore(moves) {
  if (!Number.isSafeInteger(moves) || moves < leaderboardConfig.minMoves || moves > leaderboardConfig.maxMoves) {
    throw new Error('A ranked Bingo needs 4–24 moves.');
  }
  return moves;
}

export function insidePlayer(win = window) { return win.parent !== win; }

export function requestPlayerSession(win = window) {
  if (!insidePlayer(win)) return Promise.reject(new Error('Open this challenge from AIWANNA to join the leaderboard.'));
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();
    const timeout = win.setTimeout(() => finish(new Error('Leaderboard connection timed out.')), 15000);
    function finish(error, session) {
      win.clearTimeout(timeout);
      win.removeEventListener('message', onMessage);
      if (error) reject(error); else resolve(session);
    }
    function onMessage(event) {
      const data = event.data;
      if (event.source !== win.parent || event.origin !== leaderboardConfig.origin ||
          data?.source !== 'aimadegames-platform' || data.type !== 'leaderboard-session' || data.requestId !== requestId) return;
      if (data.error) return finish(new Error(String(data.error)));
      const session = data.session;
      if (data.apiOrigin !== leaderboardConfig.origin || !session?.token ||
          session.gameId !== leaderboardConfig.gameId || !session.player?.displayName) {
        return finish(new Error('Invalid leaderboard session.'));
      }
      finish(null, session);
    }
    win.addEventListener('message', onMessage);
    win.parent.postMessage({ source: 'aimadegames', type: 'leaderboard-session', requestId }, leaderboardConfig.origin);
  });
}

export class BingoLeaderboard {
  constructor({ fetcher = fetch, sessionProvider = requestPlayerSession } = {}) {
    this.fetcher = fetcher;
    this.sessionProvider = sessionProvider;
    this.session = null;
  }

  beginRun() {
    const run = { startKey: crypto.randomUUID(), scoreKey: crypto.randomUUID(), runId: null, score: null, owner: null };
    run.startPromise = this.start(run).catch(error => { run.startPromise = null; throw error; });
    // An offline board must never interrupt the round or cause an unhandled rejection.
    run.startPromise.catch(() => {});
    return run;
  }

  async sessionFor(run, force = false) {
    if (!force && this.session && Date.parse(this.session.expiresAt) > Date.now() + 60000) return this.session;
    const session = await this.sessionProvider();
    if (session.gameId !== leaderboardConfig.gameId) throw new Error('Leaderboard session belongs to another game.');
    const owner = `${session.player.displayName}\0${session.player.isGuest}`;
    if (run?.owner && run.owner !== owner) throw new Error('The player changed during this challenge.');
    if (run) run.owner = owner;
    this.session = session;
    return session;
  }

  async request(run, path, { key, body } = {}) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const session = await this.sessionFor(run, attempt > 0);
      const response = await this.fetcher(`${leaderboardConfig.origin}/api/v1/${path}`, {
        method: key ? 'POST' : 'GET', credentials: 'omit',
        headers: { Authorization: `Bearer ${session.token}`, ...(key ? { 'Idempotency-Key': key } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) return data;
      if (response.status === 401 && attempt === 0) continue;
      throw new Error(data.error?.message || `Leaderboard request failed (${response.status}).`);
    }
  }

  async start(run) {
    if (run.runId) return run.runId;
    const data = await this.request(run, `leaderboards/${leaderboardConfig.boardId}/runs`, { key: run.startKey });
    if (typeof data.runId !== 'string') throw new Error('Leaderboard did not start a run.');
    run.runId = data.runId;
    return run.runId;
  }

  async submit(run, moves) {
    const score = rankedScore(moves);
    if (run.score !== null && run.score !== score) throw new Error('This run has a different final score.');
    run.score = score;
    if (run.receipt) return run.receipt;
    if (run.submission) return run.submission;
    const submission = (async () => {
      const runId = await (run.startPromise || this.start(run));
      const receipt = await this.request(run, `runs/${encodeURIComponent(runId)}/score`, { key: run.scoreKey, body: { score } });
      if (receipt.accepted !== true) throw new Error('Leaderboard did not accept the result.');
      run.receipt = receipt;
      return receipt;
    })();
    run.submission = submission;
    try { return await submission; }
    finally { run.submission = null; }
  }
}
