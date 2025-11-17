"use client";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import { motion } from "framer-motion";

export default function PredictiveIntelligenceConsole() {
  const {
    category,
    region,
    dayOffset,
    setCategory,
    setDayOffset,
    triggerFocusChange,
    awarenessPulse,
  } = usePredictionFilter();

  const categories = ["Finance", "Geopolitics", "Weather", "Health"];
  const countriesByRegion = {
    Americas: [
      { name: "United States", flag: "🇺🇸" },
      { name: "Brazil", flag: "🇧🇷" },
    ],
    Europe: [{ name: "Germany", flag: "🇩🇪" }],
    Asia: [
      { name: "India", flag: "🇮🇳" },
      { name: "Japan", flag: "🇯🇵" },
      { name: "China", flag: "🇨🇳" },
    ],
    Oceania: [{ name: "Australia", flag: "🇦🇺" }],
  };
  const days = [
    { label: "Today", value: 0 },
    { label: "Tomorrow", value: 1 },
    { label: "Next 7 Days", value: 7 },
  ];

  return (
    <motion.div
      className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 shadow-lg backdrop-blur-md mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: awarenessPulse
          ? "0 0 40px rgba(56,189,248,0.4)"
          : "0 0 0 rgba(56,189,248,0)",
      }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-center text-xl font-semibold text-blue-300 mb-2">
        🧭 Predictive Intelligence Console
      </h2>
      <p className="text-center text-slate-400 mb-6">
        Select category, country, and forecast range.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          onChange={(e) => triggerFocusChange(e.target.value)}
          className="px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {Object.entries(countriesByRegion).map(([group, countries]) => (
            <optgroup key={group} label={`🌍 ${group}`}>
              {countries.map(({ name, flag }) => (
                <option key={name} value={name}>
                  {flag} {name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={dayOffset}
          onChange={(e) => setDayOffset(Number(e.target.value))}
          className="px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          {days.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-center text-blue-400 text-sm">
        {category} • {region} • {dayOffset === 0 ? "Today" : `+${dayOffset}d`}
      </p>
    </motion.div>
  );
}
