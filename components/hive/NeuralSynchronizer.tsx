"use client";
import { useEffect, useRef } from "react";
import { useNeuralState } from "@/context/NeuralStateContext";

/**
 * 🧩 NeuralSynchronizer
 * The central rhythm conductor — listens to the audio layer and dispatches
 * "neural-sync" events with { intensity, sentiment, event } every frame.
 * 
 * All major components (NeuralHalo, OrbitSystem, etc.) now subscribe
 * to this event for perfect phase and brightness synchronization.
 */

export default function NeuralSynchronizer() {
  const { sentiment } = useNeuralState();
  const frameRef = useRef<number>();
  const lastSentimentRef = useRef<string>(sentiment);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  /* ───────────── 🎧 AudioContext Bridge ───────────── */
  useEffect(() => {
    // Reuse global AudioContext if available (from useAudioVisualizer / OrbitSystem)
    const ctx =
      (window as any).__AIVE_AUDIO_CTX ||
      new (window.AudioContext || (window as any).webkitAudioContext)();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    ctxRef.current = ctx;

    // Connect analyser to destination
    try {
      const destination = ctx.destination as any;
      if (destination) {
        const gainMirror = ctx.createGain();
        gainMirror.gain.value = 1;
        gainMirror.connect(analyser);
        gainMirror.connect(destination);
      }
    } catch (err) {
      console.warn("⚠️ NeuralSynchronizer audio bridge failed:", err);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  /* ───────────── 🧠 Main Synchronization Loop ───────────── */
  useEffect(() => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    if (!analyser || !dataArray) return;

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg =
        dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length / 255;

      // Dispatch neural-sync intensity every frame
      window.dispatchEvent(
        new CustomEvent("neural-sync", {
          detail: { intensity: avg, sentiment },
        })
      );

      // Detect sentiment changes (and broadcast stronger sync burst)
      if (lastSentimentRef.current !== sentiment) {
        window.dispatchEvent(
          new CustomEvent("neural-sync", {
            detail: { intensity: 1, sentiment, event: "sentiment-change" },
          })
        );
        lastSentimentRef.current = sentiment;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [sentiment]);

  return null; // Passive synchronization layer
}
