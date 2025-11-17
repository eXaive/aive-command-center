"use client";
import { useEffect } from "react";

/**
 * 🎚️ useAudioVisualizer
 * Connects to the shared AudioContext (set in useCueRunnerAudio)
 * and emits "audio-visualize" events containing real-time amplitude data.
 * Used by NeuralHalo + OrbitSystem for synchronized visual glow.
 */

export default function useAudioVisualizer() {
  useEffect(() => {
    const ctx = (window as any).__AIVE_AUDIO_CTX as AudioContext | undefined;
    if (!ctx) {
      console.warn("⚠️ No AudioContext found for visualizer — waiting for A.I.V.E. audio layer.");
      return;
    }

    // 🎛 Analyzer setup
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 🎧 Try to monitor the master output
    try {
      const destination = (ctx as any).destination;
      if (destination) {
        const splitter = ctx.createChannelSplitter(2);
        const merger = ctx.createChannelMerger(2);
        splitter.connect(analyser, 0);
        merger.connect(ctx.destination);
      }
    } catch (err) {
      console.warn("Audio routing limited:", err);
    }

    // 🔁 Main loop: analyze → dispatch intensity
    let running = true;
    const tick = () => {
      if (!running) return;
      analyser.getByteFrequencyData(dataArray);
      const avg =
        dataArray.reduce((sum, v) => sum + v, 0) / bufferLength / 255;

      window.dispatchEvent(
        new CustomEvent("audio-visualize", {
          detail: { intensity: Math.min(avg * 2.5, 1) }, // slightly boosted
        })
      );

      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
    };
  }, []);

  return null; // passive background listener
}
