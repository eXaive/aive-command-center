"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEconSimState } from "@/hooks/useEconSimState"; // 🧩 shared store

export default function EconSimPanel({ variant }: { variant: "baseline" | "proposed" }) {
  // 📊 Core economic variables
  const [interestRate, setInterestRate] = useState(5.0);
  const [inflation, setInflation] = useState(3.5);
  const [growth, setGrowth] = useState(2.0);

  // 🧠 Analysis + Policy intelligence
  const [confidence, setConfidence] = useState(75);
  const [forecast, setForecast] = useState("");
  const [policyGrade, setPolicyGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState("Neutral");
  const [policyText, setPolicyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([
    { month: "Jan", gdp: 2.1, inflation: 4.0 },
    { month: "Feb", gdp: 1.8, inflation: 3.7 },
    { month: "Mar", gdp: 1.9, inflation: 3.6 },
    { month: "Apr", gdp: 2.3, inflation: 3.4 },
    { month: "May", gdp: 2.5, inflation: 3.3 },
    { month: "Jun", gdp: 2.6, inflation: 3.1 },
  ]);

  // 🧩 shared store
  const { updateBaseline, updateProposed } = useEconSimState();

  /* ╔══════════════════════════════════════════════════╗
     ║  🧮 Core Simulation + Evaluation Logic           ║
     ╚══════════════════════════════════════════════════╝ */
  useEffect(() => {
    const conf = Math.max(0, Math.min(100, 100 - inflation * 5 + growth * 8 - interestRate * 2));
    setConfidence(conf);

    const grade = evaluatePolicyGrade(growth, inflation, interestRate);
    setPolicyGrade(grade);
    setForecast(generateForecast(conf));
    setFeedback(generateFeedback(grade));

    // 🧠 Sync current state with comparator
    const payload = { growth, inflation, confidence: conf };
    if (variant === "baseline") updateBaseline(payload);
    else updateProposed(payload);
  }, [interestRate, inflation, growth]);

  const evaluatePolicyGrade = (g: number, inf: number, rate: number) => {
    if (g >= 2.5 && inf <= 3 && rate <= 5) return "A";
    if (g >= 1.5 && inf <= 4) return "B";
    if (g >= 1.0 && inf <= 5) return "C";
    if (g >= 0 && inf <= 6) return "D";
    return "F";
  };

  const generateForecast = (conf: number) => {
    if (conf >= 80) return "🟢 Expanding cycle — investor confidence rising.";
    if (conf >= 60) return "🟡 Stable outlook — moderate optimism.";
    if (conf >= 40) return "🟠 Fragile equilibrium — volatility risk elevated.";
    return "🔴 Downturn risk — tightening outweighs growth momentum.";
  };

  const generateFeedback = (grade: string) => {
    switch (grade) {
      case "A":
        return "Strong macro stability achieved. Excellent balance between growth and inflation.";
      case "B":
        return "Solid footing with room for improvement. Inflation manageable; growth steady.";
      case "C":
        return "Mixed outcome. Inflation creeping higher — moderate tightening recommended.";
      case "D":
        return "Growth slowing while inflation persists. Coordination needed across fiscal fronts.";
      case "F":
        return "Systemic imbalance detected — risk of stagflation or capital flight.";
      default:
        return "";
    }
  };

  /* ╔══════════════════════════════════════════════════╗
     ║  🧩 Policy Text Upload Logic                     ║
     ╚══════════════════════════════════════════════════╝ */
  const analyzePolicyText = (text: string) => {
    const t = text.toLowerCase();
    let newInterest = interestRate;
    let newGrowth = growth;
    let newInflation = inflation;
    let tone = "Neutral";

    if (t.includes("raise") || t.includes("increase") || t.includes("tighten")) {
      newInterest += 0.5;
      newGrowth -= 0.3;
      tone = "Contractionary";
    }
    if (t.includes("cut") || t.includes("reduce") || t.includes("stimulate")) {
      newInterest -= 0.5;
      newGrowth += 0.4;
      tone = "Expansionary";
    }
    if (t.includes("inflation")) newInflation += 0.3;
    if (t.includes("recession") || t.includes("slowdown")) {
      newGrowth -= 0.2;
      newInflation -= 0.2;
    }

    setInterestRate(Math.max(0, newInterest));
    setGrowth(Math.min(6, Math.max(-2, newGrowth)));
    setInflation(Math.max(0, newInflation));
    setSentiment(tone);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      if (file.type === "text/plain") {
        const text = await file.text();
        setPolicyText(text);
        analyzePolicyText(text);
      } else {
        alert("Please upload a .txt file for now.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const previewText =
    policyText.length > 0
      ? policyText.slice(0, 400) + (policyText.length > 400 ? "..." : "")
      : "";

  /* ╔══════════════════════════════════════════════════╗
     ║  🎨 Visual Glow / Color Themes                  ║
     ╚══════════════════════════════════════════════════╝ */
  const gradeColor = {
    A: "from-green-400 to-emerald-500",
    B: "from-emerald-400 to-lime-400",
    C: "from-yellow-400 to-amber-400",
    D: "from-orange-400 to-red-400",
    F: "from-red-500 to-rose-600",
  }[policyGrade as keyof typeof gradeColor] || "from-slate-500 to-slate-600";

  const glow =
    confidence >= 70 ? "#22c55e" : confidence >= 50 ? "#facc15" : "#ef4444";

  /* ╔══════════════════════════════════════════════════╗
     ║  🧭 Render Interface                            ║
     ╚══════════════════════════════════════════════════╝ */
  return (
    <div className="relative w-full max-w-4xl mx-auto my-10">
      <motion.div
        className="absolute inset-0 rounded-3xl blur-3xl z-0"
        animate={{ backgroundColor: glow, opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 rounded-2xl bg-slate-900/70 border border-slate-700/40 backdrop-blur-md p-6">
        <h2 className="text-lg font-semibold text-blue-300 mb-4 text-center">
          A.I.V.E. Policy Lab — Unified Evaluator + Simulator
        </h2>

        {/* Upload Section */}
        <div className="mb-6 space-y-2 text-center">
          <label className="text-xs text-slate-400 block">
            Upload a policy document (.txt) or paste below:
          </label>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="text-slate-300 text-sm mx-auto"
          />
          {isLoading && (
            <p className="text-blue-400 text-xs animate-pulse mt-1">
              ⏳ Analyzing document...
            </p>
          )}
          <textarea
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            placeholder="Paste policy text here..."
            className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg text-slate-200 text-sm p-3 h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => analyzePolicyText(policyText)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
          >
            🧠 Re-Simulate Based on Text
          </button>
          {previewText && (
            <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3 text-xs text-slate-400 mt-2">
              <span className="text-blue-400 font-medium">Preview:</span>{" "}
              {previewText}
            </div>
          )}
        </div>

        {/* Grade Ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr ${gradeColor} blur-md opacity-70`}
            ></div>
            <div className="absolute inset-[4px] rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {policyGrade || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback + Forecast */}
        <motion.p
          key={feedback}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs text-center text-slate-400 max-w-md mx-auto mb-2 leading-relaxed"
        >
          {feedback}
        </motion.p>

        <motion.p
          key={forecast}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-blue-400 mb-4"
        >
          {forecast}
        </motion.p>

        {/* Chart */}
        <div className="h-56 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#f8fafc",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="gdp"
                stroke="#38bdf8"
                strokeWidth={2}
                name="GDP Growth"
              />
              <Line
                type="monotone"
                dataKey="inflation"
                stroke="#facc15"
                strokeWidth={2}
                name="Inflation Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sliders */}
        <div className="flex flex-col sm:flex-row justify-between gap-5">
          {[
            { label: "Interest Rate (%)", val: interestRate, set: setInterestRate, min: 0, max: 10 },
            { label: "Inflation (%)", val: inflation, set: setInflation, min: 0, max: 10 },
            { label: "GDP Growth (%)", val: growth, set: setGrowth, min: -2, max: 6 },
          ].map((s) => (
            <div key={s.label} className="flex-1">
              <label className="text-xs text-slate-400">{s.label}</label>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step="0.1"
                value={s.val}
                onChange={(e) => s.set(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <p className="text-sm text-slate-300 mt-1">{s.val.toFixed(1)}%</p>
            </div>
          ))}
        </div>

        {/* Confidence Summary */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Confidence Level:{" "}
            <span
              className={`font-semibold ${
                confidence >= 70
                  ? "text-green-400"
                  : confidence >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {confidence.toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
