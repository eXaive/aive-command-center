"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import { useLiveConfidence } from "@/components/hive/hooks/useLiveConfidence";
import useAwarenessSync from "@/components/hive/useAwarenessSync"; // 🌊 Unified Pulse Hook

export default function PurseSimDashboard() {
  const { region, exchange } = usePredictionFilter();
  const [simData, setSimData] = useState<any[]>([]);
  const [learning, setLearning] = useState("Analyzing causal outcomes...");
  const [curvePoints, setCurvePoints] = useState("");
  const avgConfidence = useLiveConfidence();
  const syncGlow = useAwarenessSync(); // 🟠 Soft unified pulse signal

  /* ─────────────── 🌍 Region-Adaptive Asset Pool ─────────────── */
  const getRegionalAssets = () => {
    const cluster = exchange?.regionCluster || "Global";
    switch (cluster) {
      case "Caribbean":
        return [
          { name: "JSE Index", base: 380000 },
          { name: "NCB Financial", base: 70 },
          { name: "GraceKennedy", base: 84 },
          { name: "US Dollar (JMD)", base: 157 },
          { name: "Caribbean Composite Fund", base: 100 },
        ];
      case "Americas":
        return [
          { name: "S&P 500", base: 5100 },
          { name: "Dow Jones", base: 38500 },
          { name: "NASDAQ", base: 16200 },
          { name: "Gold", base: 2250 },
          { name: "Crude Oil", base: 80 },
        ];
      case "Europe":
        return [
          { name: "FTSE 100", base: 8200 },
          { name: "DAX", base: 16200 },
          { name: "Euronext 100", base: 1200 },
          { name: "Euro/USD", base: 1.09 },
        ];
      case "Asia":
        return [
          { name: "Nifty 50", base: 22000 },
          { name: "Nikkei 225", base: 38500 },
          { name: "Hang Seng", base: 18200 },
          { name: "USD/JPY", base: 148 },
        ];
      case "Oceania":
        return [
          { name: "ASX 200", base: 7700 },
          { name: "BHP Group", base: 44 },
          { name: "AUD/USD", base: 0.66 },
        ];
      case "Africa":
        return [
          { name: "Johannesburg Top 40", base: 72000 },
          { name: "Nairobi All Share", base: 105 },
          { name: "USD/ZAR", base: 18.3 },
          { name: "Gold (ZAR)", base: 42700 },
        ];
      default:
        return [
          { name: "Global Composite Index", base: 1000 },
          { name: "Gold", base: 2250 },
          { name: "BTC/USD", base: 70000 },
          { name: "Crude Oil", base: 80 },
          { name: "USD Index", base: 105 },
        ];
    }
  };

  /* ─────────────── 📊 Generate Simulated Portfolio ─────────────── */
  useEffect(() => {
    const assets = getRegionalAssets();
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

    const lessons = [
      "Rising commodity prices signal fiscal expansion cycles.",
      "Central bank tightening impacts investment sentiment.",
      "Currency volatility alters portfolio risk exposure.",
      "Regional confidence metrics drive capital flows.",
      "Stable awareness curves predict synchronized growth.",
      "Tech indices mirror innovation policy momentum.",
    ];
    setLearning(lessons[Math.floor(Math.random() * lessons.length)]);
  }, [region, exchange]);

  /* ─────────────── 📈 Confidence-Based Curve ─────────────── */
  useEffect(() => {
    const generateCurve = () => {
      const amplitude = (avgConfidence - 50) / 4;
      const points = Array.from({ length: 24 }, (_, i) => {
        const x = i * 20;
        const y =
          80 -
          Math.sin(i / 2) * amplitude -
          Math.cos(i / 3) * amplitude * 0.6 +
          Math.random() * 5;
        return `${x},${y}`;
      }).join(" ");
      setCurvePoints(points);
    };
    generateCurve();
    const interval = setInterval(generateCurve, 4000);
    return () => clearInterval(interval);
  }, [avgConfidence]);

  /* ─────────────── 🎨 Visual Logic ─────────────── */
  const curveColor = useMemo(() => {
    if (avgConfidence > 85) return "#22d3ee";
    if (avgConfidence > 70) return "#fbbf24";
    return "#ef4444";
  }, [avgConfidence]);

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "bullish")
      return <TrendingUp className="text-green-400" size={18} />;
    if (sentiment === "bearish")
      return <TrendingDown className="text-red-400" size={18} />;
    return <Minus className="text-slate-400" size={18} />;
  };

  /* ─────────────── 🧭 Render ─────────────── */
  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90
                 border border-amber-500/20 rounded-2xl shadow-xl shadow-amber-900/10
                 p-6 text-slate-200 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: syncGlow
          ? "0 0 40px rgba(251,191,36,0.35)"
          : "0 0 10px rgba(251,191,36,0.1)",
      }}
      transition={{ duration: 1 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-400">
          💼 A.I.V.E. Purse — {exchange?.code || "GLOBAL"}
        </h2>
        <p className="text-sm text-slate-400 italic">
          {exchange?.name || "Simulated Global Financial System"}
        </p>
        {exchange?.regionCluster && (
          <p className="text-xs text-amber-300 mt-1">
            Region: {exchange.regionCluster}
            {exchange?.fallback && (
              <span className="text-slate-400 ml-1 italic">
                ↳ using {exchange.fallback} proxy
              </span>
            )}
          </p>
        )}
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
                <td className="px-4 py-3 font-medium text-slate-100">
                  {item.name}
                </td>
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
                <td className="px-4 py-3 text-center">
                  {getSentimentIcon(item.sentiment)}
                </td>
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

      {/* Causal Outcome Curve */}
      <div className="mt-8">
        <h3 className="text-amber-300 font-medium mb-2 text-center">
          📈 Causal Outcome Curve
        </h3>
        <motion.div
          className="relative w-full h-40 bg-slate-900/60 border border-amber-500/20 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-full h-full">
            <polyline
              points={curvePoints}
              fill="none"
              stroke={curveColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: `radial-gradient(circle at 50% 80%, ${curveColor}22, transparent 70%)`,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>
        <p className="text-center text-xs text-slate-400 mt-2 italic">
          Confidence index {avgConfidence}% — tracking {region}'s{" "}
          {exchange?.code || "GLOBAL"} market cluster
        </p>
      </div>

      {/* Integrity Banner */}
      <div className="mt-8 text-center text-xs text-amber-400/80">
        ⚖️ Simulation Mode — {exchange?.name || "Global Composite Feed"}
        <br />
        Designed for causal research & educational analysis.
      </div>
    </motion.div>
  );
}
