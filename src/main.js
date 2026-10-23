import { dayKey, dailyCard, dailyOffers, readRecords, saveWin } from './challenge.js';
import { BingoLeaderboard, insidePlayer, leaderboardConfig, leaderboardUrl } from './leaderboard.js';
const params=new URLSearchParams(location.search);
const isRanked=params.get('ranked')==='1';
const isDaily=isRanked || params.get('daily')==='1';
const leaderboard=isRanked && insidePlayer()?new BingoLeaderboard():null;
let rankedRun;
let challengeDay;
import './style.css';
import { createMusic } from './music.js';
const music=createMusic();
import { createCard, shuffle, winningLine, letter, offerNumbers, stampCharge, modeForRound, createCallDeck, roundReward, showNumberHint } from './game.js';
const shell = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20C8 17 2 15 3 9a9 9 0 0 1 18 0c1 6-5 8-9 11Z" fill="currentColor"/><path d="m12 18-5-9m5 9V6m0 12 5-9" stroke="#fff8eb" stroke-width="1.3"/></svg>';
const scene = `<svg class="landscape" viewBox="0 0 440 205" role="img" aria-label="A little coral-roofed cottage beside the sea, with a winding garden path">
<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#94e8ed"/><stop offset="1" stop-color="#fff0ae"/></linearGradient><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#25bdca"/><stop offset="1" stop-color="#7ee1db"/></linearGradient><filter id="soft"><feTurbulence baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".045"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
<g filter="url(#soft)"><path fill="url(#sky)" d="M0 0h440v205H0z"/><circle cx="334" cy="44" r="23" fill="#ffda63"/><path d="M0 91q85-20 163 0t277-7v121H0" fill="url(#sea)"/><path d="M0 105q76-9 121 0m159 9 90-3m-44 23 80-2M15 130l68-2" stroke="#dffaff" stroke-width="2" stroke-linecap="round"/><path d="m350 77 0-32-16 32Z" fill="#fff5df"/><path d="m353 77 0-25 13 25Z" fill="#ff9470"/><path d="m333 81 35-1-7 7h-20Z" fill="#718d88"/><path d="M0 164q72-43 150-26t173 10q70-10 117 20v37H0" fill="#9dd8a1"/><path d="M0 184q109-37 204-16t236 17v20H0" fill="#64bfa3"/><path d="M214 151q-55 20 18 54h65q-98-23-63-54" fill="#ffe5ad"/>
<path d="M144 83h100v76H144z" fill="#fffaf0"/><path d="M244 84h29v75h-29" fill="#f4dbae"/><path d="m130 88 62-51 66 51Z" fill="#f68032"/><path d="m192 37 43 1 51 50h-28" fill="#ffb458"/><path d="m130 88 62-51 66 51" fill="none" stroke="#bd594b" stroke-width="5" stroke-linejoin="round"/><path d="M239 37h13v29l-13-12" fill="#efe3c9"/><path d="M236 36h19" stroke="#ca9c82" stroke-width="5"/><path d="M186 121a12 12 0 0 1 24 0v38h-24Z" fill="#308eae"/><circle cx="203" cy="139" r="2" fill="#f8e3ac"/><g fill="#d5bc83" stroke="#fff9e7" stroke-width="4"><path d="M153 106h21v24h-21zM220 106h17v24h-17z"/></g><path d="M163 106v24m-10-12h21m54-12v24" stroke="#fff9e7" stroke-width="2"/><path d="M148 135h31m36 0h27" stroke="#ad7963" stroke-width="5"/><g fill="#81996d"><ellipse cx="159" cy="132" rx="10" ry="5"/><ellipse cx="228" cy="132" rx="10" ry="5"/></g><g fill="#ffb960"><circle cx="155" cy="129" r="3"/><circle cx="166" cy="130" r="3"/><circle cx="226" cy="128" r="3"/><circle cx="232" cy="131" r="3"/></g><path d="M182 160h33" stroke="#c9b796" stroke-width="5"/>
<path d="M76 162V99m-12 28 12 10 15-18" stroke="#8c9772" stroke-width="6"/><g fill="#56b596"><ellipse cx="76" cy="94" rx="28" ry="35"/><ellipse cx="54" cy="116" rx="20" ry="24"/><ellipse cx="96" cy="113" rx="21" ry="26"/></g><g fill="#9ad7a6"><ellipse cx="68" cy="88" rx="18" ry="24"/><ellipse cx="48" cy="111" rx="12" ry="17"/></g><path d="M295 164v-25m18 27v-26m18 29v-27m-42 6 49 4m-49 7 49 4" stroke="#eee4c8" stroke-width="5" stroke-linecap="round"/>
<g id="garden-flowers"><g stroke="#688b66" stroke-width="2"><path d="m108 178 2-19m10 23 4-21m211 27 2-20m12 18 3-24"/></g><g fill="#ffbd42"><circle cx="110" cy="157" r="5"/><circle cx="124" cy="161" r="5"/><circle cx="337" cy="166" r="5"/><circle cx="352" cy="161" r="5"/></g><g fill="#f5e7bb"><circle cx="110" cy="157" r="2"/><circle cx="124" cy="161" r="2"/><circle cx="337" cy="166" r="2"/><circle cx="352" cy="161" r="2"/></g></g>
<path d="m276 36 6-3 5 3m-22 13 5-3 5 3" fill="none" stroke="#819f98" stroke-width="1.6" stroke-linecap="round"/></g></svg>`;
let saved = {};
try { saved = JSON.parse(localStorage.getItem('bingo-bay') || '{}') || {}; } catch {}
let shells = Number.isFinite(saved.shells) && saved.shells >= 0 ? saved.shells : 0;
let planted = saved.planted === true;
let card, calls, marked, won, muted = true, audio, offers=[], charge=0, wilds=0, wildMode=false, turns=0;
let round=0, mode='classic', deck=[], autoTimer;
const stopAuto=()=>{ clearInterval(autoTimer); autoTimer=undefined; if(document.getElementById('auto')) { document.getElementById('auto').textContent='Auto-call · off'; document.getElementById('auto').setAttribute('aria-pressed','false'); } };
const app = document.querySelector('#app');
app.innerHTML = `<main class="phone"><header><div class="brand">bingo <em>by the</em> bay<span>GOOD TIDES · GOOD TIMES</span></div><div class="wallet">${shell}<span id="shells">${shells}</span></div><button id="trophy" class="icon-button trophy" aria-label="Challenges, leaderboard and personal records" title="Challenges and leaderboard"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" aria-hidden="true"><path d="M7 3h10v6a5 5 0 0 1-10 0V3Z" fill="currentColor"/><path d="M7 5H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4m-4 2v6m-4 1h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button><button id="sound" class="icon-button" aria-label="Turn music and sound on" title="Turn music and sound on">♪<span class="sound-off">/</span></button></header><section class="scene">${scene}<div class="scene-caption"><span class="location-dot"></span> THE SEASIDE COTTAGE <span class="chapter">01</span></div><button class="garden-button" id="garden" aria-label="Decorate your cottage">✿</button></section><section class="play"><div class="round-heading"><div><span class="eyebrow" id="round-label"></span><h1>Catch a lucky tide.</h1></div><span class="round-tag" id="mode-label"></span></div><div class="caller"><div class="current-ball" id="ball"><span>READY</span><strong>☀</strong></div><div class="call-info"><span class="eyebrow" id="call-label">YOUR NEXT LITTLE MOMENT</span><p id="call-title">Let’s begin, shall we?</p><div class="history" id="history"><span>Call a number to start your card.</span></div></div><button id="history-button" class="icon-button history-button" aria-label="See all called numbers">≡</button></div><section class="bingo-card" aria-label="Your bingo card"><div class="letters" aria-hidden="true"><span>B</span><span>I</span><span>N</span><span>G</span><span>O</span></div><div id="grid" class="grid"></div><div class="card-footer"><span>✦</span> FIVE IN A ROW MAKES A LITTLE MAGIC <span>✦</span></div></section><p class="hint" id="hint" role="status">A row, a column, a diagonal. All lovely ways to win.</p><button class="primary" id="next"><span>Call the first number</span><span>→</span></button><button id="auto" class="auto-call" aria-pressed="false">Auto-call · off</button><div class="choices" id="choices" aria-label="Choose your next number"></div><button id="wild" class="wild-button" disabled>✦ Wild stamp <span>0 / 3 matches</span></button><footer><span>≈</span> Your tide. Your choice. Your bingo.</footer></section><dialog id="modal"><button id="close" class="close" aria-label="Close dialog">×</button><div id="modal-content"></div></dialog></main>`;
const $ = id => document.getElementById(id);
function persist() { try { localStorage.setItem('bingo-bay', JSON.stringify({shells, planted})); } catch {} $('shells').textContent = shells; }
function chime() { if (muted) return; try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); [523.25,659.25,783.99].forEach((frequency,i) => { const osc = audio.createOscillator(), gain = audio.createGain(), start = audio.currentTime + i * .08; osc.type = 'sine'; osc.frequency.value = frequency; gain.gain.setValueAtTime(0,start); gain.gain.linearRampToValueAtTime(.055,start+.015); gain.gain.exponentialRampToValueAtTime(.001,start+.7); osc.connect(gain); gain.connect(audio.destination); osc.start(start); osc.stop(start+.72); }); } catch {} }
function drawCard() { $('grid').innerHTML = card.map((n,i) => `<button class="cell ${marked.has(i)?'marked':''} ${i===12?'free':''}" data-index="${i}" aria-label="${n ? `${letter(n)} ${n}` : 'Free space'}" aria-pressed="${marked.has(i)}">${n || '<span>✿</span><small>FREE</small>'}</button>`).join(''); }
function updatePower() {
 $('wild').disabled=isRanked || !wilds || won;
 $('wild').classList.toggle('armed',wildMode);
 $('wild').innerHTML=`✦ ${wildMode?'Choose any square':'Wild stamp'} <span>${wilds ? `${wilds} ready` : `${charge} / 3 matches`}</span>`;
 $('grid').classList.toggle('wild-ready',wildMode && !isDaily && round<=2);
}
function showOffers() {
 offers=isDaily?dailyOffers(challengeDay,turns,card,marked):offerNumbers(card,marked);
 $('choices').innerHTML=offers.map(n=>`<button class="choice" data-number="${n}" aria-label="Choose ${letter(n)} ${n}"><span>${letter(n)}</span><strong>${n}</strong><small>CHOOSE</small></button>`).join('<span class="or">OR</span>');
 $('next').hidden=true;
 $('choices').hidden=false;
 [...$('grid').children].forEach((cell,i)=>cell.classList.toggle('offered',showNumberHint(isDaily?3:round,card[i],offers,marked.has(i))));
}
function newRound() {
 stopAuto(); round++; challengeDay=isRanked?leaderboardConfig.challenge:isDaily?dayKey():undefined; mode=isDaily?'choice':modeForRound(round); deck=createCallDeck(); offers=[];
 rankedRun=leaderboard?.beginRun();
 $('next').disabled=false;
 $('round-label').textContent=`ROUND ${round} · ${mode==='classic'?'LISTEN, SPOT, STAMP':'PICK YOUR NUMBER. MAKE YOUR MOVE.'}`;
 $('mode-label').textContent=isRanked?'RANKED':isDaily?'DAILY':mode==='classic'?'CLASSIC':'LUCKY CHOICE';
 if(isRanked) $('round-label').textContent='TIDE TRIAL · SAME PUZZLE FOR EVERYONE';
 else if(isDaily) $('round-label').textContent=`DAILY CHALLENGE · ${challengeDay} UTC`;
 $('wild').hidden=mode==='classic' || isRanked; $('auto').hidden=mode!=='classic';
 card=isDaily?dailyCard(challengeDay):createCard(); calls=[]; marked=new Set([12]); won=false; charge=0; wilds=0; wildMode=false; turns=0;
 drawCard(); updatePower();
 if(mode==='classic') {
   $('choices').hidden=true; $('next').hidden=false;
   $('next').innerHTML='<span>Call the first number</span><span>→</span>';
   $('ball').innerHTML='<span>GO</span><strong>✦</strong>';
   $('call-title').textContent='Classic bingo. Settle in.';
   $('history').innerHTML='<span>Call a number, then stamp any match.</span>';
   $('call-label').textContent='75 NUMBERS · ONE WINNING LINE';
   $('hint').textContent=round<=2?'Five in a row wins. Next round: Lucky Choice + wilds.':'Hints are off from round 3. Find the called numbers yourself.';
   return;
 }
 showOffers();
 $('ball').innerHTML='<span>GO</span><strong>✦</strong>';
 $('call-title').textContent='Two numbers. Your choice.';
 $('history').innerHTML='<span>Pick below → stamp its matching square.</span>';
 $('call-label').textContent='BUILD A LINE IN FEWER MOVES';
 $('hint').textContent=isRanked?'Same ranked puzzle for everyone. No hints. Fewer moves wins.':isDaily?'Same daily puzzle. No hints. Fewer moves is better.':'Every 3 matches earns a wild. Use it on any square.';
}
function showModal(html) { stopAuto(); $('modal-content').innerHTML=html; if (!$('modal').open) $('modal').showModal(); }
$('choices').onclick=e=>{
 const button=e.target.closest('[data-number]'); if(!button || won || mode!=='choice') return;
 const n=Number(button.dataset.number); if(!offers.includes(n)) return;
 calls.push(n); turns++; offers=[];
 $('choices').hidden=true; wildMode=false; updatePower();
 $('ball').innerHTML=`<span>${letter(n)}</span><strong>${n}</strong>`;
 $('ball').classList.remove('pop'); void $('ball').offsetWidth; $('ball').classList.add('pop');
 $('call-label').textContent=`MOVE ${turns} · ${turns<=8?'GOLD PACE':turns<=12?'SILVER PACE':'KEEP BUILDING'}`;
 $('call-title').textContent=`Stamp ${letter(n)} ${n} on your card.`;
 $('history').innerHTML=calls.slice(-4,-1).reverse().map(v=>`<span class="mini-ball">${letter(v)} <b>${v}</b></span>`).join('');
 [...$('grid').children].forEach((cell,i)=>cell.classList.toggle('offered',showNumberHint(isDaily?3:round,card[i],[n],marked.has(i))));
 $('hint').textContent=!isDaily && round<=2?'Stamp the glowing square to reveal your next choice.':'Find and stamp your chosen number to reveal the next choice.';
};
$('wild').onclick=()=>{ if(isRanked || !wilds || won || mode!=='choice') return; wildMode=!wildMode; updatePower(); $('hint').textContent=wildMode?'Pick any unmarked square. Where will it help most?':'Wild saved. Choose your next number.'; };
$('grid').addEventListener('click', e => {
 const cell=e.target.closest('[data-index]'); if(!cell || won) return;
 const i=Number(cell.dataset.index); if(marked.has(i)) return;
 const useWild=wildMode && !isRanked;
 if(!useWild && !calls.includes(card[i])) { $('hint').textContent=mode==='classic'?'Wait until this number is called. Earlier calls still count.':'Choose this number when it appears, or use a wild stamp.'; return; }
 if(useWild) { wilds--; wildMode=false; }
 const result=mode==='choice' && !isRanked?stampCharge(charge,useWild):{charge:0,earned:0}; charge=result.charge; wilds+=result.earned;
 marked.add(i); cell.classList.add('marked'); cell.classList.remove('offered'); cell.setAttribute('aria-pressed','true');
 shells++; persist(); chime(); updatePower();
 $('hint').textContent=isRanked?'Nice move. Build a winning line with as few choices as you can.':mode==='classic'?'+1 shell. Keep an eye on your next line.':result.earned?'WILD READY! Use it to fill a gap in your best line.':useWild?'Nice move. That square is yours.':`${3-charge} more matches to your next wild stamp.`;
 const line=winningLine(marked);
 if(line) {
   won=true; wildMode=false; stopAuto(); updatePower();
   const reward=roundReward(mode,turns); const nextMode=isRanked?'Tide Trial':isDaily?'Daily again':mode==='classic'?'Lucky Choice':'Classic';
   const recordSaved=saveWin(mode,turns,challengeDay);
   shells+=reward.bonus; persist(); line.forEach(j=>$('grid').children[j].classList.add('winner'));
   $('choices').hidden=true; $('next').hidden=false; $('next').disabled=false; $('auto').hidden=true;
   $('hint').textContent=`${reward.label}! +${reward.bonus} shells. Next: ${nextMode}.`;
   $('next').innerHTML=`<span>Play ${nextMode}</span><span>→</span>`;
   showModal(`<div class="modal-symbol">✦</div><span class="eyebrow">${reward.label.toUpperCase()} · ${turns} ${mode==='classic'?'CALLS':'MOVES'}</span><h2>That’s your bingo!</h2><p>+${reward.bonus} bonus shells.<br>${isRanked?'Tide Trial complete. Your fewest moves count toward your personal best.':isDaily?(recordSaved?'Daily result recorded on this device. Try again to improve your move count.':'Your result could not be saved on this device.'):mode==='classic'?'Next: choose between two numbers and earn wild stamps.':'Next: classic number calls. Spot your matches and make a line.'}</p>${isRanked?`<p id="online-status" class="record-note" role="status">${leaderboard?'Saving your result to the leaderboard…':'Play from AIWANNA to submit a score.'}</p><button id="retry-score" class="records-link" hidden>Retry saving score</button><a class="records-link" href="${leaderboardUrl}" target="_blank" rel="noopener">See the leaderboard ↗</a>`:''}<button class="primary" id="celebrate">Play ${nextMode} <span>→</span></button><button id="result-records" class="records-link">${recordSaved?'View personal records':'Record could not be saved · view records'}</button>`);
   if(isRanked && rankedRun) {
     const completedRun=rankedRun;
     const submit=async()=>{
       const status=$('online-status'), retry=$('retry-score');
       if(status) status.textContent='Saving your result to the leaderboard…';
       if(retry) retry.hidden=true;
       try {
         const receipt=await leaderboard.submit(completedRun,turns);
         if(status && $('online-status')===status) status.textContent=receipt.rank?`Saved! Rank #${receipt.rank} · ${turns} moves.`:`${turns} moves saved to the leaderboard.`;
       } catch(error) {
         if(status && $('online-status')===status) { status.textContent=`Could not save: ${error.message}`; if(retry) retry.hidden=false; }
       }
     };
     $('retry-score').onclick=submit;
     void submit();
   }
   $('result-records').onclick=showRecords;
   $('celebrate').onclick=()=>{ $('modal').close(); newRound(); };
 } else if(mode==='choice') { showOffers(); }
});
function classicCall() {
 if(mode!=='classic' || won || !deck.length) return;
 const n=deck.pop(); calls.push(n); turns++;
 $('ball').innerHTML=`<span>${letter(n)}</span><strong>${n}</strong>`;
 $('ball').classList.remove('pop'); void $('ball').offsetWidth; $('ball').classList.add('pop');
 $('call-label').textContent=`CALL ${turns} OF 75 · CLASSIC`;
 $('call-title').textContent=card.includes(n)?`Stamp ${letter(n)} ${n} on your card.`:'Another number washes ashore.';
 $('history').innerHTML=calls.slice(-5,-1).reverse().map(v=>`<span class="mini-ball">${letter(v)} <b>${v}</b></span>`).join('');
 [...$('grid').children].forEach((cell,i)=>cell.classList.toggle('offered',showNumberHint(isDaily?3:round,card[i],calls,marked.has(i))));
 $('next').innerHTML=`<span>${deck.length?'Call the next number':'All numbers called'}</span><span>→</span>`;
 if(!deck.length) { stopAuto(); $('next').disabled=true; $('hint').textContent='All numbers are called. Stamp your remaining matches to win.'; }
}
$('next').onclick=()=>{ if(won) newRound(); else classicCall(); };
$('auto').onclick=()=>{ if(autoTimer) { stopAuto(); return; } if(mode!=='classic' || won || !deck.length) return; classicCall(); if(deck.length) { autoTimer=setInterval(classicCall,8000); $('auto').textContent='Auto-call · on (8s)'; $('auto').setAttribute('aria-pressed','true'); } };
$('sound').onclick=async()=>{ muted=!muted; if(muted) music.stop(); else { try { await music.start(); } catch { muted=true; } } $('sound').classList.toggle('on',!muted); $('sound').setAttribute('aria-label',muted?'Turn music and sound on':'Turn music and sound off'); $('sound').title=muted?'Turn music and sound on':'Turn music and sound off'; chime(); };
$('close').onclick=()=>$('modal').close();
$('history-button').onclick=()=>showModal(`<span class="eyebrow">WASHED ASHORE</span><h2>Called numbers</h2><p>You can still stamp any number called earlier.</p><div class="all-calls">${calls.length?calls.map(n=>`<span>${letter(n)} <b>${n}</b></span>`).join(''):'Your first number is waiting for you.'}</div>`);
function gardenModal() { showModal(`<div class="modal-symbol">✿</div><span class="eyebrow">MAKE YOURSELF AT HOME</span><h2>A cottage in bloom.</h2><p>${planted?'Your seaside flowers are planted. A little lovelier, thanks to you.':'A few pink seaside flowers would look lovely along the path. Earn a shell with every matching stamp.'}</p><div class="garden-cost">${shell} ${shells} shells collected</div><button class="primary" id="plant" ${planted || shells<12?'disabled':''}>${planted?'Flowers planted ♡':'Plant seaside flowers · 12 shells'}</button>${!planted && shells<12?`<p class="small">${12-shells} more shells to your first little garden.</p>`:''}`); if($('plant')) $('plant').onclick=()=>{ if(planted || shells<12) return; shells-=12; planted=true; persist(); document.querySelector('.scene').classList.add('planted'); chime(); gardenModal(); }; }
$('garden').onclick=gardenModal;
document.querySelector('.scene').classList.toggle('planted',planted);

newRound();

document.addEventListener('visibilitychange',()=>{ if(document.hidden) { music.stop(); stopAuto(); } else if(!muted) music.start().catch(()=>{}); });

function showRecords() {
 const records=readRecords(), today=dayKey();
 const safeEntry=key=>{ const v=records[key]; return v && Number.isSafeInteger(v.best) && v.best>0 && Number.isSafeInteger(v.wins) && v.wins>0?v:null; };
 const classic=safeEntry('classic'), choice=safeEntry('choice'), daily=safeEntry(`daily:${today}`), ranked=safeEntry(`daily:${leaderboardConfig.challenge}`);
 showModal(`<div class="modal-symbol">✦</div><span class="eyebrow">YOUR LITTLE HALL OF FAME</span><h2>Catch a winning tide.</h2><p>Tide Trial uses the same card and number offers for everyone. Fewest moves wins; ties share a rank. No speed bonus, wilds or number hints.</p><div class="record-list"><div><span>Ranked Tide Trial best</span><strong>${ranked?`${ranked.best} moves`:'Not played yet'}</strong></div><div><span>Today's daily best</span><strong>${daily?`${daily.best} moves`:'Not played yet'}</strong></div><div><span>Lucky Choice best</span><strong>${choice?`${choice.best} moves`:'—'}</strong></div><div><span>Classic bingos</span><strong>${classic?classic.wins:0}</strong></div></div><a class="primary daily-link" href="?ranked=1">${isRanked?'Restart Tide Trial':'Play ranked Tide Trial'} <span>→</span></a><a class="records-link" href="${leaderboardUrl}" target="_blank" rel="noopener">See the leaderboard ↗</a><a class="records-link" href="?daily=1" ${isDaily&&!isRanked?'':'target="_blank" rel="noopener"'}>${isDaily&&!isRanked?'Restart daily challenge':'Play daily challenge'}</a><p class="record-note">Personal records stay on this device. Online scores submit only when you play from AIWANNA. The leaderboard accepts client-reported results for casual play.</p>${isDaily?'<a class="records-link" href="./">Back to alternating rounds</a>':'<p class="small">Tide Trial replaces this round; the daily challenge opens separately.</p>'}`);
}
$('trophy').onclick=showRecords;

// Keep the cottage wallet in sync while the challenge is open in another tab.
window.addEventListener('storage',event=>{
 if(event.key!=='bingo-bay' || !event.newValue) return;
 try { const value=JSON.parse(event.newValue); if(Number.isFinite(value.shells) && value.shells>=0) { shells=value.shells; planted=value.planted===true; $('shells').textContent=shells; document.querySelector('.scene').classList.toggle('planted',planted); } } catch {}
});
