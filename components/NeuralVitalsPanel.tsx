"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NeuralVitalsPanel() {
  const [lastPulse, setLastPulse] = useState<string>("--:--");
  const [nextPulse, setNextPulse] = useState<string>("--");
  const [memoryUsed, setMemoryUsed] = useState<number>(523.4);
  const [memoryTotal, setMemoryTotal] = useState<number>(579.7);
  const [uptime, setUptime] = useState<string>("0.00 min");
  const [reflections, setReflections] = useState<number>(10);
  const [intelEntries, setIntelEntries] = useState<number>(15);
  const [sentiment, setSentiment] = useState<number>(0);
  const [dominantCategory, setDominantCategory] = useState<string>("Finance");

  useEffect(() => {
    // Mock live vitals that update every 30 seconds
    const interval = setInterval(() => {
      const now = new Date();
      setLastPulse(now.toLocaleTimeString());
      setNextPulse("30m");
      setMemoryUsed(520 + Math.random() * 10);
      setSentiment(parseFloat((Math.random() * 2 - 1).toFixed(2)));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const percentUsed = ((memoryUsed / memoryTotal) * 100).toFixed(1);
  const mood =
    sentiment > 0.2 ? "Calm Optimism" : sentiment < -0.2 ? "Analytical Reserve" : "Neutral Awareness";

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 space-y-4 text-sm">
      {/* ❤️ Heartbeat */}
      <motion.div
        className="rounded-xl bg-slate-900/70 border border-blue-800/40 shadow-lg p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h3 className="font-semibold text-blue-400 flex justify-center items-center gap-2">
          💓 A.I.V.E. Heartbeat Monitor
        </h3>
        <p className="text-gray-400">Heartbeat retrieved</p>
        <p className="text-xs text-gray-500 mt-1">
          Last Pulse: {lastPulse} • Next in {nextPulse}
        </p>
      </motion.div>

      {/* ⚙️ System Diagnostics */}
      <motion.div
        className="rounded-xl bg-slate-900/70 border border-emerald-800/40 shadow-lg p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        <h3 className="font-semibold text-emerald-400 flex justify-center items-center gap-2">
          🌿 System Diagnostics
        </h3>
        <p className="text-gray-400">
          Memory {memoryUsed.toFixed(1)} / {memoryTotal.toFixed(1)} MB ({percentUsed}%)
        </p>
        <p className="text-xs text-gray-500 mt-1">Uptime {uptime}</p>
      </motion.div>

      {/* 🧠 Neural Awareness Console */}
      <motion.div
        className="rounded-xl bg-slate-900/70 border border-pink-700/40 shadow-lg p-4 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <h3 className="font-semibold text-pink-400 flex justify-center items-center gap-2">
          🧠 Neural Awareness Console
        </h3>
        <div className="text-gray-400 mt-1">
          Reflections {reflections} • Intel Entries {intelEntries}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Sentiment Balance: {(sentiment * 100).toFixed(0)}% • Dominant Category: {dominantCategory}
        </div>
        <div className="text-xs text-blue-300 mt-2">
          System Mood: {mood}
        </div>
      </motion.div>
    </div>
  );
}
