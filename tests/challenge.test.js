import test from 'node:test';
import assert from 'node:assert/strict';
import {dayKey,dailyCard,dailyOffers,recordWin} from '../src/challenge.js';
test('UTC daily challenges are deterministic and change with the date',()=>{
 assert.equal(dayKey(new Date('2026-10-21T23:30:00-05:00')),'2026-10-22');
 assert.deepEqual(dailyCard('2026-10-21'),dailyCard('2026-10-21'));
 assert.notDeepEqual(dailyCard('2026-10-21'),dailyCard('2026-10-22'));
 const card=dailyCard('2026-10-21'),marked=new Set([12]);
 const offer=dailyOffers('2026-10-21',0,card,marked);
 assert.deepEqual(offer,dailyOffers('2026-10-21',0,card,marked));
 marked.add(card.indexOf(offer[0]));
 const afterWild=dailyOffers('2026-10-21',0,card,marked);
 assert.equal(afterWild[0],offer[1]); assert.ok(!afterWild.includes(offer[0]));
});
test('records separate modes and dates, count wins, and keep fewer moves',()=>{
 let records=recordWin({},'classic',40);
 records=recordWin(records,'choice',8);
 records=recordWin(records,'choice',6);
 records=recordWin(records,'choice',10);
 records=recordWin(records,'choice',7,'2026-10-21');
 records=recordWin(records,'choice',9,'2026-10-22');
 assert.deepEqual(records.classic,{wins:1,best:40});
 assert.deepEqual(records.choice,{wins:3,best:6});
 assert.deepEqual(records['daily:2026-10-21'],{wins:1,best:7});
 assert.deepEqual(records['daily:2026-10-22'],{wins:1,best:9});
});
