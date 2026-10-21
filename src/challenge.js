import {createCard, shuffle} from './game.js';
export const dayKey = (date=new Date()) => date.toISOString().slice(0,10);
export function seededRandom(seed) {
 let h=2166136261;
 for(const c of seed) h=Math.imul(h^c.charCodeAt(0),16777619);
 return ()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};
}
export const dailyCard = day => createCard(seededRandom(`bay-v1-card-${day}`));
// A fixed priority per move, filtered by each player's marks; no reroll on wild use.
export const dailyOffers = (day,move,card,marked) => shuffle(card.filter(Boolean),seededRandom(`bay-v1-offers-${day}-${move}`)).filter(n=>!marked.has(card.indexOf(n))).slice(0,2);
export function recordWin(records,mode,moves,day) {
 const result={...records};
 const key=day?`daily:${day}`:mode;
 const old=records[key];
 result[key]={wins:(Number.isSafeInteger(old?.wins)?old.wins:0)+1,best:Math.min(Number.isSafeInteger(old?.best)?old.best:Infinity,moves)};
 return result;
}
export function readRecords() {
 try { const value=JSON.parse(localStorage.getItem('bingo-bay-records')||'{}'); return value && typeof value==='object' && !Array.isArray(value)?value:{}; } catch { return {}; }
}
export function saveWin(mode,moves,day) {
 const records=recordWin(readRecords(),mode,moves,day);
 try { localStorage.setItem('bingo-bay-records',JSON.stringify(records)); return true; } catch { return false; }
}
