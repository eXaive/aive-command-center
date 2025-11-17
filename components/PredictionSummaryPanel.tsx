"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SummaryRow {
  category: string;
  region: string;
  total_predictions: number;
  successful_predictions: number;
  failed_predictions: number;
  pending_predictions: number;
  avg_confidence: number;
  avg_rolling_accuracy_pct: number;
  verified_accuracy_pct: number;
  glow_color?: string;   // 🌈 NEW
  tone_level?: string;   // 🌈 NEW
}

export default function PredictionSummaryPanel() {
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);
  const { sentiment, reflectionEvent } = useNeuralState();

  /* ───────────────────────────────
     🧠 Fetch summary data
  ─────────────────────────────── */
  async function fetchSummary() {
    const { data, error } = await supabase
      .from("prediction_summary")
      .select("*")
      .order("avg_confidence", { ascending: false })
      .limit(50);

    if (!error && data) setSummary(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSummary();

    const channel = supabase
      .channel("summary-listener")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memory_reflections" },
        () => triggerPulse()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "predictions" },
        () => triggerPulse()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ───────────────────────────────
     💡 Pulse effect
  ─────────────────────────────── */
  const triggerPulse = () => {
    fetchSummary();
    setPulse(true);
    setTimeout(() => setPulse(false), 2500);
  };

  useEffect(() => {
    if (reflectionEvent) triggerPulse();
  }, [reflectionEvent]);

  /* ───────────────────────────────
     📊 Helpers
  ─────────────────────────────── */
  if (loading)
    return (
      <div className="text-gray-400 text-sm text-center mt-6">
        Loading performance summary...
      </div>
    );

  const totals = summary.reduce(
    (acc, row) => {
      acc.total += row.total_predictions;
      acc.successful += row.successful_predictions;
      acc.failed += row.failed_predictions;
      acc.pending += row.pending_predictions;
      acc.avg_conf.push(row.avg_confidence);
      acc.avg_acc.push(row.avg_rolling_accuracy_pct);
      acc.avg_ver.push(row.verified_accuracy_pct);

      // collect tone intensity + color hue
      acc.colors.push(row.glow_color || "#3b82f6");
      acc.tones.push(row.tone_level || "medium");
      return acc;
    },
    {
      total: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      avg_conf: [] as number[],
      avg_acc: [] as number[],
      avg_ver: [] as number[],
      colors: [] as string[],
      tones: [] as string[],
    }
  );

  const mean = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "0.0";

  // 🎨 Derive blended color + tone
  const toneMap: Record<string, number> = { low: 0.3, medium: 0.6, high: 1.0 };
  const avgTone =
    totals.tones.reduce((sum, t) => sum + (toneMap[t] ?? 0.6), 0) /
    (totals.tones.length || 1);

  const avgGlowColor =
    totals.colors.length > 0
      ? totals.colors[Math.floor(Math.random() * totals.colors.length)]
      : sentiment === "positive"
      ? "#22c55e"
      : sentiment === "negative"
      ? "#ef4444"
      : "#3b82f6";

  /* ───────────────────────────────
     🌠 Render
  ─────────────────────────────── */
  return (
    <motion.div
      className="w-full max-w-5xl mx-auto mt-10 p-6 bg-slate-900/60 rounded-2xl border border-slate-700/40 shadow-lg backdrop-blur-md relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: pulse
          ? `0 0 45px ${avgGlowColor}AA`
          : `0 0 18px ${avgGlowColor}44`,
      }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* 🌌 Ambient Glow Layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10 blur-3xl"
        animate={{
          opacity: [avgTone - 0.2, avgTone, avgTone - 0.2],
          scale: [1, 1.05, 1],
          background: `radial-gradient(circle, ${avgGlowColor}${Math.floor(
            avgTone * 180
          ).toString(16)} 0%, transparent 70%)`,
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.h2
        className="text-lg font-semibold text-blue-400 mb-6 text-center tracking-wide"
        animate={{
          textShadow: pulse
            ? `0 0 25px ${avgGlowColor}, 0 0 45px ${avgGlowColor}66`
            : `0 0 6px ${avgGlowColor}55`,
          scale: pulse ? 1.05 : 1,
        }}
        transition={{ duration: 0.8 }}
      >
        🧠 A.I.V.E. — Performance Summary
      </motion.h2>

      {/* 🔹 Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <StatCard label="Avg Confidence" value={`${mean(totals.avg_conf)}%`} glow={avgGlowColor} />
        <StatCard label="Accuracy (7d)" value={`${mean(totals.avg_acc)}%`} glow={avgGlowColor} />
        <StatCard label="Verified Accuracy" value={`${mean(totals.avg_ver)}%`} glow={avgGlowColor} />
        <StatCard label="✅ Correct" value={totals.successful.toString()} glow={avgGlowColor} />
        <StatCard label="❌ Failed" value={totals.failed.toString()} glow={avgGlowColor} />
        <StatCard label="⏳ Pending" value={totals.pending.toString()} glow={avgGlowColor} />
      </div>

      <div className="mt-8 text-gray-400 text-xs text-center italic">
        Tracking {totals.total} predictions across {summary.length} regions/categories.
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────
   🟢 Reusable Stat Card
────────────────────────────── */
function StatCard({
  label,
  value,
  glow,
}: {
  label: string;
  value: string;
  glow: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-slate-800/50
                 border border-slate-700/60 rounded-xl p-4 text-center
                 shadow-md backdrop-blur-md transition-all"
      style={{
        boxShadow: `0 0 18px ${glow}44`,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 28px ${glow}88`,
      }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </motion.div>
  );
}
