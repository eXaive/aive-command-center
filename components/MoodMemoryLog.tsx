"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoodMemoryLog() {
  const [log, setLog] = useState<
    { id: string; sentiment: string; time: string }[]
  >([]);

  // 🧠 Simulated log updates (replace with Supabase listener if live)
  useEffect(() => {
    const interval = setInterval(() => {
      setLog((prev) => [
        ...prev.slice(-20), // keep last 20
        {
          id: crypto.randomUUID(),
          sentiment: ["positive", "neutral", "negative"][
            Math.floor(Math.random() * 3)
          ],
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const safeLog = Array.isArray(log) ? log : [];

  const sentimentColor = (s: string) => {
    switch (s) {
      case "positive":
        return "text-green-400";
      case "neutral":
        return "text-yellow-400";
      case "negative":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      // ⬇️ Spacing & stacking tuned to avoid overlap with other HUD elements
      className="
        fixed bottom-6 left-6 z-40
        w-64
        bg-slate-900/70 backdrop-blur-md
        border border-slate-700/60 rounded-xl
        shadow-lg shadow-black/30
        p-3
        pointer-events-auto
        select-none
      "
      // Optional: expose a data-hook if you want other components to auto-offset
      data-fixed-slot="bottom-left"
      aria-label="Mood Memory Log"
      role="region"
    >
      <div className="font-semibold text-slate-200 mb-2">🧠 Mood Memory Log</div>

      <div className="max-h-80 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-700/40">
        <AnimatePresence initial={false}>
          {safeLog.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className={`flex justify-between ${sentimentColor(entry.sentiment)}`}
            >
              <span className="truncate w-20 capitalize">{entry.sentiment}</span>
              <span className="text-[10px] text-gray-400">{entry.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {!safeLog.length && (
          <div className="text-center text-gray-500 italic mt-3">
            No entries yet
          </div>
        )}
      </div>
    </div>
  );
}
