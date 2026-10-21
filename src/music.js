// Original 16-bar seaside miniature. Scheduled Web Audio, no audio downloads.
export function createMusic() {
 let context, clock, nextBeat=0, step=0, active=false;
 const beat=60/88/2;
 const chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]];
 const melody=[76,null,79,76,74,null,72,null, 72,null,76,79,76,74,72,null, 69,null,72,76,74,null,72,69, 71,null,74,79,76,74,71,null];
 function tone(midi,time,length,volume,type='sine') {
   const frequency=440*2**((midi-69)/12);
   const osc=context.createOscillator(), gain=context.createGain();
   osc.type=type; osc.frequency.value=frequency;
   gain.gain.setValueAtTime(0,time); gain.gain.linearRampToValueAtTime(volume,time+.018);
   gain.gain.exponentialRampToValueAtTime(.0001,time+length);
   osc.connect(gain); gain.connect(context.destination); osc.start(time); osc.stop(time+length+.02);
 }
 function schedule() {
   if(!active || context.state!=='running') return;
   while(nextBeat<context.currentTime+.18) {
     const chord=chords[Math.floor(step/8)%4];
     // Warm broken chords, rounded bass, sparse bell melody.
     tone(chord[[0,2,1,3,0,2,1,2][step%8]],nextBeat,.65,.022,'triangle');
     if(step%8===0) tone(chord[0]-24,nextBeat,1.7,.045);
     const note=melody[step%32];
     if(note!==null && Math.floor(step/32)%2===0) { tone(note,nextBeat,.85,.035); tone(note+12,nextBeat,.35,.006); }
     if(step%4===2) tone(90,nextBeat,.045,.009,'triangle');
     step++; nextBeat+=beat;
   }
 }
 return {
   async start() { context??=new (window.AudioContext||window.webkitAudioContext)(); await context.resume(); active=true; nextBeat=context.currentTime+.05; clearInterval(clock); schedule(); clock=setInterval(schedule,80); },
   stop() { active=false; clearInterval(clock); if(context) context.suspend(); }
 };
}
