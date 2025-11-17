"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

/**
 * 🎙️ VoiceReactiveHalo (Diaphragm Pulse)
 * Safely reuses the global A.I.V.E. AudioContext for halo motion.
 * Prevents 'MediaElementSource already connected' errors.
 */

let sharedAudioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
let sharedSource: MediaElementAudioSourceNode | null = null;

export default function VoiceReactiveHalo() {
  const { sentiment } = useNeuralState();
  const amplitude = useMotionValue(0);

  // 🎨 Sentiment → color mapping
  const colorMap = {
    positive: "#2dd4bf",
    neutral: "#fbbf24",
    negative: "#ef4444",
  };
  const color = colorMap[sentiment] || colorMap.neutral;

  // 🎧 Attach to shared A.I.V.E. voice analyser
  useEffect(() => {
    const audio = document.getElementById("test-voice") as HTMLAudioElement;
    if (!audio) return;

    try {
      // Reuse existing shared context
      if (!sharedAudioContext) {
        sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        sharedAnalyser = sharedAudioContext.createAnalyser();
        sharedAnalyser.fftSize = 256;
      }

      if (!sharedSource && sharedAudioContext && sharedAnalyser) {
        sharedSource = sharedAudioContext.createMediaElementSource(audio);
        sharedSource.connect(sharedAnalyser);
        sharedAnalyser.connect(sharedAudioContext.destination);
      }
    } catch {
      console.warn("⚠️ VoiceReactiveHalo: Using shared analyser (already connected).");
    }

    const dataArray = new Uint8Array(sharedAnalyser!.frequencyBinCount);

    const animate = () => {
      if (sharedAnalyser) {
        sharedAnalyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        amplitude.set(avg / 220); // normalize 0–1 range
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      // ⚠️ Do NOT disconnect or close shared context — used globally
    };
  }, [amplitude]);

  // 🔮 Animate amplitude → scale & opacity
  const scale = useTransform(amplitude, [0, 1], [1, 1.5]);
  const opacity = useTransform(amplitude, [0, 1], [0.08, 0.6]);

  return (
    <motion.div
      className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
      style={{ filter: "blur(80px)" }}
    >
      <motion.div
        className="rounded-full"
        style={{
          width: "28rem",
          height: "28rem",
          background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
          scale,
          opacity,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
      />
    </motion.div>
  );
}
