// /lib/audio/neuralHum.ts
let ctx: AudioContext | null = null;
let osc: OscillatorNode | null = null;
let gain: GainNode | null = null;

export const startNeuralHum = () => {
  if (ctx) return; // already running

  ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  osc = ctx.createOscillator();
  gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 280; // neutral baseline hum
  gain.gain.value = 0.015;   // very quiet — ambient

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  console.log("🌌 Neural hum started.");
};

// adjust mood dynamically
export const updateNeuralHum = (mood: "positive" | "neutral" | "negative") => {
  if (!osc || !gain || !ctx) return;

  const base = mood === "positive" ? 340 : mood === "negative" ? 180 : 280;
  const volume = mood === "positive" ? 0.025 : mood === "negative" ? 0.012 : 0.018;

  // smooth transition
  osc.frequency.exponentialRampToValueAtTime(base, ctx.currentTime + 1.5);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 1.5);
};

// graceful stop
export const stopNeuralHum = () => {
  if (osc) {
    osc.stop();
    osc.disconnect();
  }
  if (gain) gain.disconnect();
  ctx = null;
  osc = null;
  gain = null;
  console.log("🕯️ Neural hum stopped.");
};
