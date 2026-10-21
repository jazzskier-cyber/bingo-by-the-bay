import test from 'node:test';
import assert from 'node:assert/strict';
import { createCard, shuffle, winningLine, letter } from '../src/game.js';
test('cards have unique numbers in their correct bingo columns and a free center', () => {
  for (let round = 0; round < 100; round++) {
    const card = createCard(); assert.equal(new Set(card).size, 25); assert.equal(card[12], 0);
    card.forEach((n, i) => { if (i !== 12) assert.ok(n > (i % 5) * 15 && n <= (i % 5 + 1) * 15); });
  }
});
test('detects horizontal, vertical and diagonal wins, but not incomplete lines', () => {
  for (const line of [[5,6,7,8,9], [2,7,12,17,22], [0,6,12,18,24], [4,8,12,16,20]]) assert.deepEqual(winningLine(new Set(line)), line);
  assert.equal(winningLine(new Set([0,6,12,18])), null);
});
test('a shuffled call deck contains every number once and correct letters', () => {
  const deck = shuffle(Array.from({ length: 75 }, (_, i) => i + 1)); assert.equal(new Set(deck).size, 75);
  assert.deepEqual([1,15,16,30,31,45,46,60,61,75].map(letter), ['B','B','I','I','N','N','G','G','O','O']);
});

test('number choices always offer two distinct unmarked card numbers', async () => {
 const { offerNumbers } = await import('../src/game.js');
 const card=createCard(); const marked=new Set([12,0,1,2]);
 for(let i=0;i<100;i++) { const offer=offerNumbers(card,marked); assert.equal(offer.length,2); assert.notEqual(offer[0],offer[1]); offer.forEach(n=>assert.ok(!marked.has(card.indexOf(n)))); }
 assert.equal(offerNumbers(card,new Set(Array.from({length:25},(_,i)=>i))).length,0);
});
test('three normal stamps earn a wild; wild stamps cannot charge themselves', async () => {
 const { stampCharge } = await import('../src/game.js');
 assert.deepEqual(stampCharge(0,false),{charge:1,earned:0});
 assert.deepEqual(stampCharge(1,false),{charge:2,earned:0});
 assert.deepEqual(stampCharge(2,false),{charge:0,earned:1});
 assert.deepEqual(stampCharge(2,true),{charge:2,earned:0});
});

test('sessions start Classic and alternate with Choice on every completed round', async () => {
 const {modeForRound}=await import('../src/game.js');
 assert.deepEqual([1,2,3,4,5,6].map(modeForRound),['classic','choice','classic','choice','classic','choice']);
});
test('Classic uses the full 75-number deck and fixed rewards independent of call count', async () => {
 const {createCallDeck,roundReward}=await import('../src/game.js');
 const deck=createCallDeck(); assert.equal(deck.length,75); assert.deepEqual([...deck].sort((a,b)=>a-b),Array.from({length:75},(_,i)=>i+1));
 for(const calls of [4,8,12,50,75]) assert.equal(roundReward('classic',calls).bonus,20);
 assert.deepEqual([8,9,12,13].map(n=>roundReward('choice',n).bonus),[40,30,30,20]);
});

test('matching hints stop at round 3 for both called and offered numbers, while excluding marked cells', async () => {
 const {showNumberHint}=await import('../src/game.js');
 for(const candidates of [[17],[17,23],[1,17,35,70]]) {
   for(const round of [1,2]) { assert.equal(showNumberHint(round,17,candidates,false),true); assert.equal(showNumberHint(round,17,candidates,true),false); assert.equal(showNumberHint(round,75,candidates,false),false); }
   for(const round of [3,4,5,6,99]) assert.equal(showNumberHint(round,17,candidates,false),false);
 }
});
