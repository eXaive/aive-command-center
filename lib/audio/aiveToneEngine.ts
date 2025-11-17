// /lib/audio/aiveToneEngine.ts
let audioCtx: AudioContext | null = null;
let lastMood: "positive" | "neutral" | "negative" | null = null;

function initCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export const playAiveTone = (mood: "positive" | "neutral" | "negative") => {
  if (lastMood === mood) return;
  lastMood = mood;

  const ctx = initCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // base tone characteristics
  const base = mood === "positive" ? 480 : mood === "neutral" ? 240 : 90;
  osc.frequency.value = base;
  osc.type = mood === "neutral" ? "triangle" : "sine";

  gain.gain.value = 0.0008; // initial subtle amplitude
  gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.3);
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 2.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 2.5);
};

export const resetAiveTone = () => {
  lastMood = null;
};
