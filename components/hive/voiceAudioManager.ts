// ✅ Shared Audio Manager (prevents InvalidStateError)
let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let src: MediaElementAudioSourceNode | null = null;

export function getSharedAnalyser(): AnalyserNode | null {
  if (typeof window === "undefined") return null;
  const audio = document.getElementById("aive-voice") as HTMLAudioElement;
  if (!audio) return null;

  try {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (!src) {
      src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyser.connect(ctx.destination);
    }

    return analyser!;
  } catch (err) {
    console.warn("⚠️ Using existing audio analyser (already connected).");
    return analyser;
  }
}
