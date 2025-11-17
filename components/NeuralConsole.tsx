"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Metrics {
  reflections: number;
  intel: number;
  avgSentiment: number;
  mood: string;
  lastReflection: string;
  topCategory: string;
}

export default function NeuralConsole() {
  const supabase = createClientComponentClient();
  const [metrics, setMetrics] = useState<Metrics>({
    reflections: 0,
    intel: 0,
    avgSentiment: 0,
    mood: "Calm",
    lastReflection: "No reflection yet.",
    topCategory: "General",
  });

  // 🧠 Pull awareness metrics every few seconds
  useEffect(() => {
    const fetchMetrics = async () => {
      // Get reflection summary
      const { data: reflections } = await supabase
        .from("memory_reflections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: intel } = await supabase
        .from("intel_feed")
        .select("sentiment, category")
        .order("created_at", { ascending: false })
        .limit(25);

      if (intel && reflections) {
        const pos = intel.filter((i) => i.sentiment === "Positive").length;
        const neg = intel.filter((i) => i.sentiment === "Negative").length;
        const mood =
          pos > neg
            ? "Optimistic"
            : neg > pos
            ? "Stressed"
            : "Calm";

        // Top category detection
        const categoryCounts: Record<string, number> = {};
        intel.forEach((i) => {
          categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
        });
        const topCategory =
          Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "General";

        setMetrics({
          reflections: reflections.length,
          intel: intel.length,
          avgSentiment: ((pos - neg) / intel.length) * 100 || 0,
          mood,
          lastReflection: reflections[0]?.summary || "Awaiting reflection...",
          topCategory,
        });
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [supabase]);

  return (
    <motion.div
      className="mt-8 p-4 bg-slate-900/70 rounded-lg border border-slate-800 text-slate-300 text-xs shadow-lg shadow-blue-900/20 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-amber-400 text-sm font-semibold mb-2">
        🧠 Neural Awareness Console
      </h2>

      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
        <div>Reflections: <span className="text-blue-400">{metrics.reflections}</span></div>
        <div>Intel Entries: <span className="text-emerald-400">{metrics.intel}</span></div>
        <div>Sentiment Balance: <span className={metrics.avgSentiment > 0 ? "text-emerald-400" : metrics.avgSentiment < 0 ? "text-rose-400" : "text-amber-400"}>
          {metrics.avgSentiment.toFixed(1)}%
        </span></div>
        <div>Dominant Category: <span className="text-cyan-400">{metrics.topCategory}</span></div>
      </div>

      <motion.div
        className="mt-3 py-2 px-3 bg-slate-800/50 rounded-md border border-slate-700 text-slate-200 text-[12px]"
        animate={{
          boxShadow:
            metrics.mood === "Optimistic"
              ? "0 0 15px rgba(16,185,129,0.4)"
              : metrics.mood === "Stressed"
              ? "0 0 15px rgba(239,68,68,0.4)"
              : "0 0 10px rgba(147,197,253,0.3)",
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        <strong className="text-blue-400">System Mood:</strong> {metrics.mood}
        <br />
        <strong className="text-slate-400">Last Reflection:</strong>{" "}
        <span className="italic">{metrics.lastReflection}</span>
      </motion.div>
    </motion.div>
  );
}
