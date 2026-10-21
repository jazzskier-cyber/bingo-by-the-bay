export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function createCard(random = Math.random) {
  const columns = Array.from({ length: 5 }, (_, col) => shuffle(Array.from({ length: 15 }, (_, i) => col * 15 + i + 1), random).slice(0, 5));
  return Array.from({ length: 25 }, (_, i) => i === 12 ? 0 : columns[i % 5][Math.floor(i / 5)]);
}
export function winningLine(marked) {
  const lines = [];
  for (let i = 0; i < 5; i++) { lines.push(Array.from({ length: 5 }, (_, j) => i * 5 + j)); lines.push(Array.from({ length: 5 }, (_, j) => j * 5 + i)); }
  lines.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
  return lines.find(line => line.every(i => marked.has(i))) ?? null;
}
export const letter = n => 'BINGO'[Math.floor((n - 1) / 15)];

// Every offer is useful: choose which of two unmarked numbers advances your line.
export function offerNumbers(card, marked) {
  return shuffle(card.filter((n, i) => n && !marked.has(i))).slice(0, 2);
}
export function stampCharge(charge, wild) {
  if (wild) return { charge, earned: 0 };
  return charge === 2 ? { charge: 0, earned: 1 } : { charge: charge + 1, earned: 0 };
}

export const modeForRound = round => round % 2 === 1 ? 'classic' : 'choice';
export const createCallDeck = () => shuffle(Array.from({length:75}, (_,i)=>i+1));
export function roundReward(mode, turns) {
  return mode === 'classic' ? {label:'Classic bingo', bonus:20} : turns<=8 ? {label:'Gold tide',bonus:40} : turns<=12 ? {label:'Silver tide',bonus:30} : {label:'Bronze tide',bonus:20};
}

// Matching hints are onboarding assistance only; player stamps remain visible.
export const showNumberHint = (round, number, candidates, marked) => round <= 2 && !marked && candidates.includes(number);
