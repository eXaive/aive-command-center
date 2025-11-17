"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// 🪙 Purse Simulation Dashboard
export default function PurseSimDashboard() {
  const [simData, setSimData] = useState<any[]>([]);
  const [learning, setLearning] = useState<string>("Analyzing causal outcomes...");

  useEffect(() => {
    // Generate synthetic holdings data (for simulation only)
    const assets = [
      { name: "Gold", base: 2250 },
      { name: "BTC", base: 70000 },
      { name: "S&P 500", base: 5100 },
      { name: "Crude Oil", base: 80 },
      { name: "USD Index", base: 105 },
      { name: "Tech Growth Index", base: 3200 },
    ];

    const generated = assets.map((a) => {
      const change = (Math.random() * 2 - 1) * 2.5; // ±2.5%
      const confidence = Math.floor(60 + Math.random() * 40);
      const sentiment =
        change > 0.5 ? "bullish" : change < -0.5 ? "bearish" : "neutral";
      return {
        ...a,
        value: parseFloat((a.base * (1 + change / 100)).toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        confidence,
        sentiment,
      };
    });

    setSimData(generated);

    // Periodic learning messages
    const lessons = [
      "Rising commodity prices correlate with inflationary signals.",
      "AI adoption continues to offset labor shortages in simulation models.",
      "Market confidence increases after fiscal transparency cycles.",
      "Energy volatility drives defensive investment sentiment.",
      "Tech sectors outperform in causality models with positive innovation rates.",
    ];

    setLearning(lessons[Math.floor(Math.random() * lessons.length)]);
  }, []);

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "bullish")
      return <TrendingUp className="text-green-400" size={18} />;
    if (sentiment === "bearish")
      return <TrendingDown className="text-red-400" size={18} />;
    return <Minus className="text-slate-400" size={18} />;
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90
                 border border-amber-500/20 rounded-2xl shadow-xl shadow-amber-900/10
                 p-6 text-slate-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-400">
          💼 A.I.V.E. Purse — Simulation Mode
        </h2>
        <p className="text-sm text-slate-400">
          Simulated causal trading environment (educational only)
        </p>
      </div>

      {/* Portfolio Table */}
      <div className="overflow-x-auto rounded-xl border border-amber-500/10 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60 text-amber-300 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Asset</th>
              <th className="px-4 py-3 text-right">Simulated Value</th>
              <th className="px-4 py-3 text-right">Change</th>
              <th className="px-4 py-3 text-center">Confidence</th>
              <th className="px-4 py-3 text-center">Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {simData.map((item, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-slate-800/60 hover:bg-slate-800/40 transition"
              >
                <td className="px-4 py-3 font-medium text-slate-100">{item.name}</td>
                <td className="px-4 py-3 text-right">${item.value}</td>
                <td
                  className={`px-4 py-3 text-right ${
                    item.change > 0
                      ? "text-green-400"
                      : item.change < 0
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </td>
                <td className="px-4 py-3 text-center text-blue-300">
                  {item.confidence}%
                </td>
                <td className="px-4 py-3 text-center">{getSentimentIcon(item.sentiment)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Learning Summary */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-amber-900/10 to-amber-700/10 border border-amber-400/20 rounded-xl shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-amber-300 font-medium mb-1">🧠 Learning Summary</p>
        <p className="text-slate-300 text-sm leading-relaxed">{learning}</p>
      </motion.div>

      {/* Integrity Banner */}
      <div className="mt-8 text-center text-xs text-amber-400/80">
        ⚖️ Simulation Mode — No real trading or investment activity.  
        <br />
        Designed for research and educational use under ethical guidelines.
      </div>

      {/* Subtle Glow Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background:
            "radial-gradient(circle at 50% 120%, rgba(251,191,36,0.1), transparent 70%)",
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
      />
    </motion.div>
  );
}
