"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNeuralState } from "@/context/NeuralStateContext";

export default function NeuralRhythmHUD() {
  const { sentiment, reflectionEvent } = useNeuralState();
  const [pulse, setPulse] = useState(false);

  // 🩺 Pulse whenever reflection event updates
  useEffect(() => {
    if (reflectionEvent) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }
  }, [reflectionEvent]);

  // 🌈 Color logic
  const glowColor =
    sentiment === "positive"
      ? "rgba(34,197,94,0.8)" // green
      : sentiment === "negative"
      ? "rgba(239,68,68,0.8)" // red
      : "rgba(59,130,246,0.8)"; // blue

  const shadowColor =
    sentiment === "positive"
      ? "rgba(34,197,94,0.5)"
      : sentiment === "negative"
      ? "rgba(239,68,68,0.5)"
      : "rgba(59,130,246,0.5)";

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-[9999] flex flex-col items-center justify-center"
      animate={{
        opacity: [0.85, 1, 0.85],
        scale: pulse ? [1, 1.25, 1] : [1, 1.05, 1],
      }}
      transition={{
        duration: pulse ? 1.2 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* 💡 Outer halo */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 70,
          height: 70,
          background: glowColor,
          boxShadow: `0 0 60px 10px ${shadowColor}`,
        }}
        animate={{
          opacity: pulse ? [0.9, 0.4, 0.9] : [0.5, 0.75, 0.5],
          scale: pulse ? [1.2, 1.5, 1.2] : [1, 1.15, 1],
        }}
        transition={{
          duration: pulse ? 1.2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 🫀 Core orb */}
      <motion.div
        className="rounded-full border border-slate-500/30 flex items-center justify-center text-xs font-semibold text-white backdrop-blur-md"
        style={{
          width: 48,
          height: 48,
          background: `radial-gradient(circle at 30% 30%, ${glowColor}, rgba(15,23,42,0.9))`,
          boxShadow: `0 0 25px ${shadowColor}`,
        }}
      >
        {sentiment === "positive"
          ? "🙂"
          : sentiment === "negative"
          ? "☹️"
          : "😐"}
      </motion.div>

      {/* 🩸 Mood Label */}
      <div className="mt-2 text-[10px] text-slate-400 font-medium tracking-wide select-none">
        {sentiment === "positive"
          ? "POSITIVE"
          : sentiment === "negative"
          ? "NEGATIVE"
          : "NEUTRAL"}
      </div>
    </motion.div>
  );
}
