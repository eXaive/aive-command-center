"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function NeuralAwarenessGauge({
  avgConfidence,
  reflectionPct,
  total,
}: {
  avgConfidence: number;
  reflectionPct: number;
  total: number;
}) {
  // Awareness score calculation (weights can evolve later)
  const awarenessScore = Math.min(
    Math.round(
      avgConfidence * 50 + // Confidence contributes 50%
      reflectionPct * 0.3 + // Reflections add 30%
      Math.min(total / 100, 1) * 20 // Learning volume adds up to 20
    ),
    100
  );

  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls]);

  // Determine color tone based on awareness
  const getColor = () => {
    if (awarenessScore >= 80) return "from-green-400 to-emerald-500";
    if (awarenessScore >= 60) return "from-yellow-400 to-orange-400";
    if (awarenessScore >= 40) return "from-cyan-400 to-blue-400";
    return "from-red-400 to-pink-500";
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-2">
      <motion.div
        animate={controls}
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${getColor()} shadow-lg shadow-blue-900/40`}
      >
        <div className="absolute inset-0 rounded-full blur-xl opacity-40 bg-gradient-to-br from-blue-400 to-cyan-400"></div>

        {/* Inner Circle */}
        <div className="relative z-10 bg-slate-950/80 rounded-full w-24 h-24 sm:w-28 sm:h-28 flex flex-col items-center justify-center border border-slate-700 shadow-inner">
          <p className="text-3xl sm:text-4xl font-bold text-blue-300">
            {awarenessScore}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wide">
            Awareness
          </p>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="mt-3 text-xs sm:text-sm text-slate-400 space-y-1">
        <p>
          🧠 Confidence:{" "}
          <span className="text-blue-300 font-semibold">
            {(avgConfidence * 100).toFixed(1)}%
          </span>
        </p>
        <p>
          💭 Reflections:{" "}
          <span className="text-blue-300 font-semibold">
            {reflectionPct.toFixed(1)}%
          </span>
        </p>
        <p>
          📚 Learned:{" "}
          <span className="text-blue-300 font-semibold">{total}</span>
        </p>
      </div>
    </div>
  );
}
