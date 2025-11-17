"use client";

import { motion } from "framer-motion";
import { useEconSimState } from "@/hooks/useEconSimState";
import EconSimPanel from "@/components/EconSimPanel";
import { useState } from "react";

export default function EconSimComparator() {
  const { baseline, proposed } = useEconSimState();
  const [results, setResults] = useState<any | null>(null);

  const handleCompare = () => {
    const deltaGDP = proposed.growth - baseline.growth;
    const deltaInflation = proposed.inflation - baseline.inflation;
    const deltaConfidence = proposed.confidence - baseline.confidence;

    setResults({
      deltaGDP,
      deltaInflation,
      deltaConfidence,
    });
  };

  const getColor = (val: number, inverse = false) => {
    // inverse = true means lower is better (like inflation)
    if (val === 0) return "bg-slate-600";
    const good = inverse ? val < 0 : val > 0;
    return good ? "bg-green-500" : "bg-red-500";
  };

  const renderGlowBar = (label: string, value: number, inverse = false) => {
    const magnitude = Math.min(Math.abs(value) * 15, 100); // % fill
    const color = getColor(value, inverse);
    const sign = value > 0 ? "▲" : value < 0 ? "▼" : "–";
    return (
      <div className="text-left w-full mb-3">
        <div className="flex justify-between mb-1 text-xs text-slate-300">
          <span>{label}</span>
          <span
            className={
              value > 0
                ? "text-green-400"
                : value < 0
                ? "text-red-400"
                : "text-slate-400"
            }
          >
            {sign} {value.toFixed(2)}%
          </span>
        </div>
        <div className="relative h-2 w-full bg-slate-800/70 rounded-full overflow-hidden">
          <motion.div
            className={`absolute top-0 left-0 h-full ${color} rounded-full shadow-lg shadow-${color.replace(
              "bg-",
              ""
            )}/40`}
            animate={{ width: `${magnitude}%`, opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 mb-16">
      <h2 className="text-xl font-semibold text-blue-400 mb-6 text-center">
        ⚖️ A.I.V.E. Policy Comparator
      </h2>

      {/* Dual Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/70 p-4 backdrop-blur-md">
          <h3 className="text-blue-300 font-medium mb-2 text-sm text-center">
            Baseline Policy
          </h3>
          <EconSimPanel variant="baseline" />
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/70 p-4 backdrop-blur-md">
          <h3 className="text-blue-300 font-medium mb-2 text-sm text-center">
            Proposed Policy
          </h3>
          <EconSimPanel variant="proposed" />
        </div>
      </div>

      {/* Run Comparison */}
      <button
        onClick={handleCompare}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-md shadow-blue-900/30 transition"
      >
        Run Comparison
      </button>

      {/* Δ Glow Bars + Summary */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 p-6 rounded-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-md text-center shadow-inner shadow-blue-900/40 max-w-lg w-full"
        >
          <h3 className="text-blue-300 font-medium mb-3">
            🔆 Comparative Outcome
          </h3>

          <div className="flex flex-col w-full mb-4">
            {renderGlowBar("GDP Growth Δ", results.deltaGDP, false)}
            {renderGlowBar("Inflation Δ", results.deltaInflation, true)}
            {renderGlowBar("Confidence Δ", results.deltaConfidence, false)}
          </div>

          <p className="text-blue-400 text-xs mt-3">
            {results.deltaConfidence >= 0
              ? "🟢 Improvement detected — policy optimism rising."
              : "🔴 Confidence weakening — review macro signals."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
