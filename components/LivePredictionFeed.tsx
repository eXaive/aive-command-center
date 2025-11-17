"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import { useNeuralState } from "@/context/NeuralStateContext";
import { playSentimentTone } from "@/lib/audio/triggerTone";
import useAwarenessSync from "@/components/hive/useAwarenessSync";

interface Prediction {
  id: string;
  region?: string;
  predicted_for_date: string;
  confidence: number;
  rolling_7d_accuracy?: number;
  trend_direction?: string;
  outcome_status?: string;
  created_at: string;
}

export default function LivePredictionFeed() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);

  const { dayOffset, region } = usePredictionFilter();
  const { reflectionEvent } = useNeuralState();
  const awarenessGlow = useAwarenessSync();
  const category = "Finance"; // 🔒 locked focus

  const triggerPulse = (sentiment?: "positive" | "neutral" | "negative") => {
    setPulse(true);
    setTimeout(() => setPulse(false), 1500);
    if (sentiment) playSentimentTone(sentiment);
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + dayOffset);
        const isoDate = targetDate.toISOString().split("T")[0];

        let query = supabase
          .from("predictions")
          .select(
            "id, region, predicted_for_date, confidence, rolling_7d_accuracy, trend_direction, outcome_status, created_at"
          )
          .eq("category", category)
          .lte("predicted_for_date", isoDate)
          .order("created_at", { ascending: false })
          .limit(20);

        if (region) query = query.eq("region", region);

        const { data, error } = await query;
        if (!error) setPredictions(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();

    const channel = supabase
      .channel("predictions_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "predictions" },
        (payload) => {
          const p = payload.new as Prediction;
          if (p.region === region && p) {
            setPredictions((prev) => [p, ...prev.slice(0, 19)]);
            const tone = ["positive", "neutral", "negative"][
              Math.floor(Math.random() * 3)
            ] as "positive" | "neutral" | "negative";
            triggerPulse(tone);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dayOffset, region]);

  useEffect(() => {
    if (reflectionEvent) triggerPulse(reflectionEvent.sentiment ?? "neutral");
  }, [reflectionEvent]);

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const getConfidenceColor = (value: number) =>
    value >= 85 ? "text-green-400" : value >= 70 ? "text-yellow-400" : "text-red-400";

  const getTrendIcon = (t?: string) =>
    t?.toLowerCase() === "up" ? "⬆️" : t?.toLowerCase() === "down" ? "⬇️" : "➖";

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto mt-8 bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-blue-500/30 shadow-lg overflow-hidden"
      animate={{
        boxShadow: awarenessGlow
          ? "0 0 40px rgba(59,130,246,0.35)"
          : "0 0 10px rgba(59,130,246,0.1)",
      }}
      transition={{ duration: 1 }}
    >
      <div className="text-center border-b border-slate-700/40 py-4">
        <motion.h2
          className="text-lg md:text-xl font-semibold text-blue-400 tracking-wide"
          animate={{
            textShadow: pulse
              ? "0 0 25px rgba(59,130,246,0.9)"
              : "0 0 10px rgba(59,130,246,0.4)",
          }}
          transition={{ duration: 0.6 }}
        >
          💹 A.I.V.E. Finance Predictions
        </motion.h2>
        <p className="text-xs text-slate-400 mt-1">
          {region} • {dayOffset === 0 ? "Today" : `+${dayOffset}d`}
        </p>
      </div>

      {loading ? (
        <p className="p-6 text-center text-slate-400 text-sm">Loading predictions…</p>
      ) : predictions.length === 0 ? (
        <p className="p-6 text-center text-slate-400 text-sm">
          No finance predictions found for {region}.
        </p>
      ) : (
        predictions.map((p) => (
          <motion.div
            key={p.id}
            layout
            onClick={() => toggleExpand(p.id)}
            className="border-b border-slate-800/30 cursor-pointer overflow-hidden hover:bg-slate-800/40 transition"
          >
            <div className="p-4 flex justify-between items-center">
              <div>
                <span className="font-semibold text-white uppercase">FINANCE</span>
                <span className="text-xs text-slate-400 ml-2">
                  {new Date(p.created_at).toLocaleTimeString()}
                </span>
                <p className="text-xs text-slate-400 mt-1">
                  {p.region} •{" "}
                  {new Date(p.predicted_for_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-xs ${getConfidenceColor(p.confidence)}`}>
                  Confidence: {p.confidence.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Trend: {getTrendIcon(p.trend_direction)}
                </p>
                <p className="text-xs text-slate-400">
                  Outcome: {p.outcome_status || "pending"}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === p.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="px-6 pb-4 text-sm text-slate-400 bg-slate-950/40 border-t border-slate-800/50"
                >
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-slate-300 font-medium mb-1">
                        Historical Accuracy
                      </p>
                      <p>7d avg: {Math.round((p.rolling_7d_accuracy || 0) * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium mb-1">Meta Info</p>
                      <p>Region: {p.region}</p>
                      <p>Date: {new Date(p.predicted_for_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-3 text-slate-500 italic text-center">
                    Tap to collapse
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
