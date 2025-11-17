"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

/* ============================================================================
   FLAG MAP — Emoji flags
============================================================================ */
const FLAG_MAP: Record<string, string> = {
  "United States": "🇺🇸",
  Brazil: "🇧🇷",
  Jamaica: "🇯🇲",
  Russia: "🇷🇺",
  "Saudi Arabia": "🇸🇦",
  China: "🇨🇳",
  Singapore: "🇸🇬",
  Nigeria: "🇳🇬",
  Australia: "🇦🇺",
};

/* ============================================================================
   REGIONAL BLOCKS — 9-Country Universe
============================================================================ */
const REGIONS = [
  { name: "Americas", countries: ["United States", "Brazil"] },
  { name: "Caribbean", countries: ["Jamaica"] },
  { name: "Eurasia", countries: ["Russia"] },
  { name: "Middle East", countries: ["Saudi Arabia"] },
  { name: "Asia", countries: ["China", "Singapore"] },
  { name: "Africa", countries: ["Nigeria"] },
  { name: "Oceania", countries: ["Australia"] },
];

/* ============================================================================
   COMPONENT
============================================================================ */
export default function CountrySelector() {
  const { country, setCountry } = usePredictionFilter();
  const [selected, setSelected] = useState<string>(country);

  useEffect(() => setSelected(country), [country]);

  return (
    <div className="relative z-30 pointer-events-auto w-full flex justify-center mb-3">
      <motion.select
        value={selected}
        onChange={(e) => {
          const v = e.target.value;
          setSelected(v);
          setCountry(v);
          window.dispatchEvent(new CustomEvent("aive-pulse"));
        }}
        className="
          bg-slate-800/80 text-blue-200 rounded-xl px-4 py-2 text-sm
          border border-blue-500/30 shadow-md w-[14rem]
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {REGIONS.map((region) => (
          <optgroup
            key={region.name}
            label={`▸ ${region.name}`}
            className="text-slate-400 bg-slate-900"
          >
            {region.countries.map((c) => (
              <option key={c} value={c} className="text-white bg-slate-900">
                {FLAG_MAP[c]} {c}
              </option>
            ))}
          </optgroup>
        ))}
      </motion.select>
    </div>
  );
}
