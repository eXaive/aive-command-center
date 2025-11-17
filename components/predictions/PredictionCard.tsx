"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ExchangeEconomicsBlock from "@/components/predictions/ExchangeEconomicsBlock";
import CausalInsightWithQuiz from "@/components/predictions/CausalInsightWithQuiz";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
interface Prediction {
  id: string;
  country: string;
  category: string;
  headline: string;
  prediction?: string;
  confidence: number;
  sentiment?: string;
  created_at: string;
  verified_at?: string;
}

// -------------------------------------------------------------
// IMPACT ENGINE
// -------------------------------------------------------------
function computeImpact(prediction: Prediction) {
  const { confidence, category, headline } = prediction;
  const text = `${headline} ${prediction.prediction || ""}`.toLowerCase();

  const HIGH_KEYWORDS = [
    "crash","recession","outbreak","war","default","collapse","spike",
    "explosion","riot","hurricane","flood","surge","sanctions","invasion"
  ];

  const MEDIUM_KEYWORDS = [
    "slowdown","shift","volatility","tension","shortage","instability"
  ];

  const highRiskCategories = ["Finance", "Health", "Geopolitics", "Weather"];

  if (
    confidence >= 0.85 ||
    highRiskCategories.includes(category) ||
    HIGH_KEYWORDS.some((k) => text.includes(k))
  ) {
    return { level: "high", label: "High Impact", color: "red", dot: "🔴" };
  }

  if (
    (confidence >= 0.65 && confidence < 0.85) ||
    MEDIUM_KEYWORDS.some((k) => text.includes(k))
  ) {
    return { level: "medium", label: "Medium Impact", color: "amber", dot: "🟡" };
  }

  return { level: "low", label: "Low Impact", color: "green", dot: "🟢" };
}

// -------------------------------------------------------------
// MICRO-DRONES INSIDE CARD
// -------------------------------------------------------------
function CardDrones({ count, color }: { count: number; color: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 260 - 130,
            y: Math.random() * 100 - 50,
            opacity: 0.15,
            scale: 0.4,
          }}
          animate={{
            x: Math.random() * 260 - 130,
            y: Math.random() * 100 - 50,
            opacity: [0.2, 0.7, 0.2],
            scale: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function PredictionCard({
  prediction,
  expanded,
  onToggle,
  scannerActive,
  scanKeyword,
  highlightedId,
}: {
  prediction: Prediction;
  expanded: boolean;
  onToggle: () => void;
  scannerActive: boolean;
  scanKeyword: string | null;
  highlightedId: string | null;
}) {
  const impact = computeImpact(prediction);

  // determine if this card contains keyword match
  const match =
    scanKeyword &&
    (prediction.headline.toLowerCase().includes(scanKeyword) ||
      prediction.prediction?.toLowerCase().includes(scanKeyword));

  const isHighlighted = highlightedId === prediction.id;

  // -------------------------------------------------------------
  // LISTEN FOR ACTIVE AGENT COLOR
  // -------------------------------------------------------------
  const [agentColor, setAgentColor] = useState("#38bdf8");

  useEffect(() => {
    const onColor = (e: any) => {
      if (e.detail) setAgentColor(e.detail);
    };

    window.addEventListener("aive-avatar-color", onColor);
    return () => window.removeEventListener("aive-avatar-color", onColor);
  }, []);

  // MORE DRONES IF MATCHING
  const droneCount = match ? 22 : 10;

  return (
    <motion.div
      id={`prediction-${prediction.id}`}
      onClick={onToggle}
      className={`
        relative p-4 rounded-xl border border-slate-700 bg-slate-900/60 cursor-pointer transition-all 
        ${scannerActive && !match ? "opacity-40" : ""}
      `}
      animate={{
        scale: expanded ? 1.03 : 1,
        boxShadow: isHighlighted
          ? `0 0 20px ${agentColor}`
          : match
          ? `0 0 14px ${agentColor}80`
          : "none",
      }}
    >
      {/* MICRO-DRONES LAYER */}
      <CardDrones count={droneCount} color={agentColor} />

      {/* CATEGORY + COUNTRY */}
      <div className="text-sm text-gray-400 mb-1">
        {prediction.category} • {prediction.country}
      </div>

      {/* IMPACT BADGE */}
      <div
        className={`
          text-xs mb-2 px-2 py-1 rounded-md inline-block
          ${
            impact.level === "high"
              ? "text-red-400 bg-red-900/30 border border-red-500/20"
              : ""
          }
          ${
            impact.level === "medium"
              ? "text-amber-400 bg-amber-900/30 border border-amber-500/20"
              : ""
          }
          ${
            impact.level === "low"
              ? "text-green-400 bg-green-900/30 border border-green-500/20"
              : ""
          }
        `}
      >
        {impact.label}
      </div>

      {/* CONFIDENCE (WITH DOT) */}
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span></span>
        <span className="font-bold flex items-center gap-1">
          {impact.dot}
          {(prediction.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {/* VERIFIED BADGE */}
      {prediction.verified_at && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-2 text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded-md border border-amber-500/20"
        >
          👑 Verified on{" "}
          {new Date(prediction.verified_at).toLocaleDateString()}
        </motion.div>
      )}

      {/* HEADLINE */}
      <p className="text-white font-medium">{prediction.headline}</p>

      {/* EXPANDED AREA */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-slate-700/50 pt-4 space-y-6"
          >
            {prediction.prediction && (
              <p className="text-slate-300 text-sm">{prediction.prediction}</p>
            )}

            <ExchangeEconomicsBlock />

            <CausalInsightWithQuiz prediction={prediction} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
