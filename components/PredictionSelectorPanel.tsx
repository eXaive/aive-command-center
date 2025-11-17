"use client";

import { useState } from "react";

export default function PredictionSelectorPanel({ onChange }: { onChange: (options: any) => void }) {
  const [selectedDate, setSelectedDate] = useState("tomorrow");
  const [selectedAsset, setSelectedAsset] = useState("gold");

  const dateOptions = [
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "+7 Days", value: "7d" },
    { label: "+30 Days", value: "30d" },
  ];

  const assetOptions = [
    { label: "Gold", value: "gold" },
    { label: "Silver", value: "silver" },
    { label: "Oil", value: "oil" },
    { label: "BTC", value: "btc" },
    { label: "USD", value: "usd" },
  ];

  const handleChange = (key: string, value: string) => {
    const next = { date: selectedDate, asset: selectedAsset, [key]: value };
    if (key === "date") setSelectedDate(value);
    if (key === "asset") setSelectedAsset(value);
    onChange(next);
  };

  return (
    <div className="flex justify-between items-center w-full bg-slate-900/70 backdrop-blur-md rounded-xl p-3 mb-4 border border-slate-700/40">
      {/* Date Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400 font-medium">⏳ FUTURE</span>
        <select
          value={selectedDate}
          onChange={(e) => handleChange("date", e.target.value)}
          className="bg-slate-800 text-white text-sm rounded-md px-3 py-1.5 border border-slate-700 hover:border-blue-500 outline-none"
        >
          {dateOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Asset Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400 font-medium">💹 ASSET</span>
        <select
          value={selectedAsset}
          onChange={(e) => handleChange("asset", e.target.value)}
          className="bg-slate-800 text-white text-sm rounded-md px-3 py-1.5 border border-slate-700 hover:border-blue-500 outline-none"
        >
          {assetOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
