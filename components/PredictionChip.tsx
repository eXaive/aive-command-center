// /components/PredictionChip.tsx
"use client";

import React from "react";

type Props = {
  bullishProb: number;
  bearishProb: number;
  signal: "BULLISH" | "BEARISH" | "NEUTRAL";
  dateLabel?: string; // optional text like "Nov 3"
};

function pillClasses(signal: Props["signal"]) {
  if (signal === "BULLISH") return "bg-blue-100 text-blue-700 border-blue-200";
  if (signal === "BEARISH") return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function PredictionChip({ bullishProb, bearishProb, signal, dateLabel }: Props) {
  return (
    <div
      className={
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-medium " +
        pillClasses(signal)
      }
      title={`Bull ${Math.round(bullishProb * 100)}% • Bear ${Math.round(bearishProb * 100)}%`}
    >
      <span>{signal}</span>
      <span className="text-[11px] text-slate-500">
        ({Math.round(bullishProb * 100)}% / {Math.round(bearishProb * 100)}%)
      </span>
      {dateLabel && <span className="text-[10px] text-slate-400">• {dateLabel}</span>}
    </div>
  );
}
