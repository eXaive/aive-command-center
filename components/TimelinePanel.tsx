"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";
import { supabase } from "@/lib/supabaseClient";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

interface Prediction {
  id: string;
  category: string;
  region?: string;
  predicted_for_date: string;
  confidence: number;
  rolling_7d_accuracy?: number;
  trend_direction?: string;
  outcome_status?: string;
}

export default function TimelinePanel() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [closingPulse, setClosingPulse] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    category,
    subcategory,
    dayOffset: futureRange,
    setCategory,
    setSubcategory,
    setDayOffset: setFutureRange,
  } = usePredictionFilter();

  const { reflectionEvent } = useNeuralState();

  const categories = ["Finance", "Geopolitics", "Weather", "Health"];
  const subcategoryOptions: Record<string, string[]> = {
    Finance: ["Gold", "Silver", "Oil", "BTC"],
    Geopolitics: ["Elections", "Sanctions", "Conflicts"],
    Weather: ["Rainfall", "Temperature", "Storms"],
    Health: ["Outbreak", "Immunity", "Hospitalizations"],
  };

  /* 🧠 Fetch predictions */
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + futureRange);
        const isoDate = targetDate.toISOString().split("T")[0];

        const { data, error } = await supabase
          .from("predictions")
          .select(
            "id, category, region, predicted_for_date, confidence, rolling_7d_accuracy, trend_direction, outcome_status"
          )
          .eq("category", category)
          .lte("predicted_for_date", isoDate)
          .order("predicted_for_date", { ascending: true })
          .limit(50);

        if (error) console.error("❌ Prediction fetch failed:", error.message);
        setPredictions(data || []);

        // Trigger closing pulse once data is loaded
        setTimeout(() => {
          setClosingPulse(true);
          setTimeout(() => setClosingPulse(false), 1800);
        }, 600);
      } catch (err) {
        console.error("🚨 Unexpected fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [category, subcategory, futureRange]);

  /* 💡 Pulse when reflection occurs */
  useEffect(() => {
    if (reflectionEvent) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1500);
    }
  }, [reflectionEvent]);

  /* 🌌 Activate cinematic glow + ambient hum on mount */
  useEffect(() => {
    setGlowActive(true);

    const audio = new Audio("/sounds/ambient_hum.mp3");
    audio.volume = 0.03;
    audio.loop = false;
    audioRef.current = audio;

    const playHum = async () => {
      try {
        await audio.play();
        // gentle fade-out after 4s
        setTimeout(() => {
          const fadeInterval = setInterval(() => {
            if (audio.volume > 0.001) {
              audio.volume = Math.max(0, audio.volume - 0.003);
            } else {
              clearInterval(fadeInterval);
              audio.pause();
            }
          }, 120);
        }, 4000);
      } catch {}
    };
    playHum();

    const t = setTimeout(() => setGlowActive(false), 9000); // deactivate after fade
    return () => {
      clearTimeout(t);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "#22c55e";
    if (confidence >= 65) return "#facc15";
    return "#ef4444";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case "up":
        return "⬆️";
      case "down":
        return "⬇️";
      default:
        return "➖";
    }
  };

  if (loading)
    return (
      <div className="text-gray-400 text-sm text-center mt-8">
        Loading predictive timeline...
      </div>
    );

  return (
    <motion.div
      className="relative w-full max-w-5xl mx-auto mt-10 p-6 bg-slate-900/60 rounded-2xl border border-blue-500/30 shadow-lg backdrop-blur-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* 🌌 Outer Breathing Glow */}
      <motion.div
        className="absolute -inset-1 rounded-3xl blur-3xl -z-10"
        animate={{
          opacity: [pulse ? 0.6 : 0.3, pulse ? 0.8 : 0.5, pulse ? 0.6 : 0.3],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: pulse ? 1.5 : 6,
          repeat: pulse ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,130,246,0.55), transparent 70%)",
          boxShadow: "0 0 60px 20px rgba(59,130,246,0.15)",
        }}
      />

      {/* ✨ Cinematic Overlay Glow */}
      <AnimatePresence>
        {glowActive && (
          <motion.div
            key="timeline-glow"
            className="absolute inset-0 -z-20 rounded-3xl blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(59,130,246,0.25) 0%, rgba(147,51,234,0.15) 60%, transparent 100%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: [0, 0.7, 0.4, 0.7, 0],
              scale: [0.95, 1.05, 1, 1.03, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 8,
              ease: "easeInOut",
              repeat: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* 💠 Closing Pulse (System Acknowledgement) */}
      <AnimatePresence>
        {closingPulse && (
          <motion.div
            key="timeline-pulse"
            className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, rgba(0,255,255,0.1) 60%, transparent 100%)",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: [0.6, 0.9, 0.4, 0],
              scale: [0.95, 1.1, 1],
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* 🧭 Header */}
      <div className="text-center border-b border-slate-700/40 pb-4 mb-6">
        <motion.h2
          className="text-lg md:text-xl font-semibold text-blue-400 tracking-wide"
          animate={{
            textShadow: pulse
              ? "0 0 40px rgba(59,130,246,0.9)"
              : "0 0 10px rgba(59,130,246,0.4)",
            scale: pulse ? 1.05 : 1,
          }}
          transition={{ duration: 0.8 }}
        >
          🧭 A.I.V.E. Predictive Timeline
        </motion.h2>
        <p className="text-xs text-slate-400 mt-1">
          Forecast future outcomes by category, region, and date range
        </p>
      </div>

      {/* 🔸 Filters */}
      <div className="flex flex-col items-center justify-center w-full mb-6">
        <div className="flex flex-wrap justify-center items-center gap-3 text-center">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory(subcategoryOptions[e.target.value][0]);
            }}
            className="bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-2 border border-slate-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-2 border border-slate-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition"
          >
            {subcategoryOptions[category].map((sub) => (
              <option key={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={futureRange}
            onChange={(e) => setFutureRange(Number(e.target.value))}
            className="bg-slate-800 text-slate-200 text-sm rounded-md px-3 py-2 border border-slate-600 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((day) => {
              const date = new Date();
              date.setDate(date.getDate() + day);
              const label =
                day === 1
                  ? `Tomorrow (${date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })})`
                  : `+${day} days (${date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })})`;
              return (
                <option key={day} value={day}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* 🧩 Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.length > 0 ? (
          predictions.map((p) => (
            <motion.div
              key={p.id}
              className="relative p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 overflow-hidden"
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 25px rgba(59,130,246,0.4)`,
              }}
            >
              <div className="font-semibold text-white flex justify-between items-center">
                <span>{p.category}</span>
                <span className="text-xs text-gray-400">
                  {getTrendIcon(p.trend_direction || "Stable")}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {p.region || "Global"} •{" "}
                {new Date(p.predicted_for_date).toLocaleDateString()}
              </div>
              <div className="text-xs mt-1">
                Confidence:{" "}
                <span style={{ color: getConfidenceColor(p.confidence) }}>
                  {p.confidence?.toFixed(1)}%
                </span>
              </div>
              {p.rolling_7d_accuracy !== undefined && (
                <div className="text-xs text-gray-500">
                  Accuracy (7 d): {Math.round(p.rolling_7d_accuracy * 100)}%
                </div>
              )}
              {p.trend_direction && (
                <div className="text-xs italic text-gray-400 mt-1">
                  Trend: {p.trend_direction}
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center text-slate-500 italic">
            No predictions available for this range.
          </div>
        )}
      </div>
    </motion.div>
  );
}
