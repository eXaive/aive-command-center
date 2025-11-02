"use client";

import React, { useEffect, useState } from "react";

interface PredictionPoint {
  date: string;
  value: number;
  confidence: number;
}

export default function PredictiveTimeline({
  asset = "GOLD",
  region = "GLOBAL",
}: {
  asset?: string;
  region?: string;
}) {
  const [data, setData] = useState<PredictionPoint[]>([]);

  useEffect(() => {
    // --- placeholder: generate fake 90-day prediction data ---
    const today = new Date();
    const arr: PredictionPoint[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      arr.push({
        date: d.toISOString().split("T")[0],
        value: Math.round(50 + 30 * Math.sin(i / 9)), // sample pattern
        confidence: Math.random(),
      });
    }
    setData(arr);
  }, [asset, region]);

  return (
    <div className="rounded-xl border bg-white shadow-sm p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-700">
          📊 Predictive Timeline
        </h2>
        <span className="text-xs text-slate-500">{region}</span>
      </div>

      {/* Simple horizontal graph placeholder */}
      <div className="relative w-full h-24 border-t border-slate-200">
        {data.map((p, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${(i / 90) * 100}%`,
              width: "2px",
              height: `${p.value / 2}px`,
              backgroundColor:
                p.confidence > 0.75
                  ? "#2563eb" // blue high confidence
                  : p.confidence > 0.4
                  ? "#facc15" // yellow mid
                  : "#ef4444", // red low
            }}
            title={`${p.date} • ${p.value} • conf ${(p.confidence * 100).toFixed(
              0
            )}%`}
          />
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-3">
        Confidence bands visualize volatility over 90 days.  
        Blue = high confidence, Red = low.
      </p>
    </div>
  );
}
