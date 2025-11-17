// /lib/audio/triggerTone.ts
export const playSentimentTone = (sentiment: "positive" | "neutral" | "negative") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 🎵 Frequency mapping
    const freqs = {
      positive: 440, // A4
      neutral: 330,  // E4
      negative: 220, // A3
    };

    // ✨ Smooth start and fade out
    osc.type = "sine";
    osc.frequency.setValueAtTime(freqs[sentiment], ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.warn("🎧 AudioContext unavailable or blocked by browser:", e);
  }
};
