"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CausalUniversePanel from "@/components/CausalUniversePanel";
import CausalFlowField_Optimized from "@/components/CausalFlowField_Optimized";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import useAwarenessSync from "@/components/hive/useAwarenessSync";

export default function CausalIntelligenceLayer() {
  const [activeTab, setActiveTab] = useState<"universe" | "flow">("universe");
  const { region, awarenessPulse } = usePredictionFilter();
  const softPulse = useAwarenessSync();

  // 🧠 Tooltip state + lifecycle
  const [showTooltip, setShowTooltip] = useState(true);

  // ⏳ Hide tooltip after 5s
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(t);
  }, [activeTab, region]); // re-show when region or tab changes

  const getTooltipText = () =>
    activeTab === "universe"
      ? "🧠 Awareness Mode — Learn how causes connect across finance and the global system."
      : "💹 Flow Mode — Observe real-time financial energy and data interactions.";

  return (
    <motion.div
      className="relative w-full max-w-6xl mx-auto rounded-2xl border border-blue-500/20 bg-slate-950/50 backdrop-blur-md overflow-hidden shadow-lg"
      animate={{
        boxShadow: softPulse
          ? "0 0 40px rgba(59,130,246,0.35)"
          : "0 0 10px rgba(59,130,246,0.1)",
      }}
      transition={{ duration: 1 }}
    >
      {/* 🔹 Header / Tabs */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-sm">
        <div>
          <h2 className="text-blue-400 text-lg font-semibold tracking-wide">
            A.I.V.E. Causal Intelligence System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Region: <span className="text-blue-300">{region}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("universe");
              setShowTooltip(true);
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              activeTab === "universe"
                ? "bg-blue-600 text-white shadow-md shadow-blue-400/40"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🌌 Awareness
          </button>
          <button
            onClick={() => {
              setActiveTab("flow");
              setShowTooltip(true);
            }}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
              activeTab === "flow"
                ? "bg-blue-600 text-white shadow-md shadow-blue-400/40"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            💹 Flow
          </button>
        </div>
      </div>

      {/* 🪶 Tooltip (auto-hides + reappears on change) */}
      <AnimatePresence mode="wait">
        {showTooltip && (
          <motion.div
            key={`${activeTab}-${region}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center z-20"
          >
            <div className="bg-blue-900/30 border border-blue-500/20 text-blue-200 text-xs px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              {getTooltipText()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌊 Main Visualization Switch */}
      <div className="relative w-full h-[80vh]">
        <AnimatePresence mode="wait">
          {activeTab === "universe" ? (
            <motion.div
              key="universe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <CausalUniversePanel />
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <CausalFlowField_Optimized />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💫 Awareness Glow Overlay */}
      <AnimatePresence>
        {awarenessPulse && (
          <motion.div
            key="awareness-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 0.15, 0], scale: [1, 1.02, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-blue-500/10 pointer-events-none blur-3xl"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
