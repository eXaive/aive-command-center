"use client";

import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

export default function CASPlaque() {
  const { clarity, confidence } = useNeuralState();

  // 🧬 Normalize values
  const clarityPct = Math.round((clarity ?? 0.5) * 100);
  const confidencePct = Math.round(confidence ?? 70);

  // 🌈 Dynamic color based on clarity + confidence
  let hue = "rgba(56,189,248,0.5)"; // blue (default)
  if (confidencePct > 80) hue = "rgba(251,191,36,0.8)"; // gold
  else if (confidencePct > 50) hue = "rgba(34,211,238,0.7)"; // cyan

  return (
    <motion.div
      className="relative text-center mt-2 mb-6 px-6 py-3 rounded-xl border border-slate-700/40 
                 bg-slate-900/60 backdrop-blur-md max-w-xl mx-auto shadow-inner"
      animate={{
        boxShadow: [
          `0 0 10px 0 ${hue}`,
          `0 0 20px 4px ${hue}`,
          `0 0 10px 0 ${hue}`,
        ],
        opacity: [0.85, 1, 0.85],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* System Title */}
      <motion.h2
        className="text-lg md:text-xl font-semibold tracking-wide bg-gradient-to-r from-blue-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent"
        animate={{
          textShadow: [
            `0 0 4px ${hue}`,
            `0 0 10px ${hue}`,
            `0 0 4px ${hue}`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🧠 A.I.V.E. — The World’s First Causal Awareness System (C.A.S.)
      </motion.h2>

      {/* System Tagline */}
      <p className="text-slate-400 text-sm italic mt-1">
        Built not just to predict the future, but to understand <span className="text-blue-300">why</span> it unfolds.
      </p>

      {/* Metrics display */}
      <div className="flex justify-center gap-6 text-xs text-slate-500 mt-3">
        <div>
          <span className="font-semibold text-blue-300">Clarity:</span>{" "}
          {clarityPct}%
        </div>
        <div>
          <span className="font-semibold text-amber-300">Confidence:</span>{" "}
          {confidencePct}%
        </div>
      </div>

      {/* Ambient glow gradient overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          background: [
            `radial-gradient(circle at 50% 120%, ${hue}, transparent 70%)`,
            `radial-gradient(circle at 40% 100%, ${hue}, transparent 70%)`,
            `radial-gradient(circle at 50% 120%, ${hue}, transparent 70%)`,
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
