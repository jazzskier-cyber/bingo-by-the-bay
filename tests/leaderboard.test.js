import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyCard, dailyOffers } from '../src/challenge.js';
import { BingoLeaderboard, leaderboardConfig, rankedScore } from '../src/leaderboard.js';

test('ranked puzzle stays the same across dates and scores only completed-move counts', () => {
  const card = dailyCard(leaderboardConfig.challenge);
  assert.deepEqual(card, dailyCard(leaderboardConfig.challenge));
  assert.deepEqual(dailyOffers(leaderboardConfig.challenge, 0, card, new Set([12])),
    dailyOffers(leaderboardConfig.challenge, 0, card, new Set([12])));
  assert.equal(rankedScore(4), 4);
  assert.equal(rankedScore(24), 24);
  for (const invalid of [3, 25, -1, 5.5, NaN]) assert.throws(() => rankedScore(invalid));
});

test('a ranked run submits one final score with separate stable retry keys', async () => {
  const requests = [];
  let failScore = true;
  const fetcher = async (url, init) => {
    requests.push({ url, init });
    if (url.endsWith('/runs')) return { ok: true, json: async () => ({ runId: 'run-1' }) };
    if (failScore) { failScore = false; throw new Error('offline'); }
    return { ok: true, json: async () => ({ accepted: true, submittedScore: 8, rank: 2 }) };
  };
  const sessionProvider = async () => ({ token: 'game-token', expiresAt: '2999-01-01T00:00:00Z', gameId: leaderboardConfig.gameId, player: { displayName: 'Player', isGuest: true } });
  const board = new BingoLeaderboard({ fetcher, sessionProvider });
  const run = board.beginRun();
  await assert.rejects(board.submit(run, 8), /offline/);
  const receipt = await board.submit(run, 8);
  assert.equal(receipt.rank, 2);
  assert.equal((await board.submit(run, 8)).rank, 2);
  assert.equal(requests.length, 3);
  assert.notEqual(requests[0].init.headers['Idempotency-Key'], requests[1].init.headers['Idempotency-Key']);
  assert.equal(requests[1].init.headers['Idempotency-Key'], requests[2].init.headers['Idempotency-Key']);
  assert.deepEqual(JSON.parse(requests[2].init.body), { score: 8 });
  await assert.rejects(board.submit(run, 9), /different final score/);
});
