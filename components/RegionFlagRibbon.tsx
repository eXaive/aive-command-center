"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

/* ============================================================
   Country Groups (same visuals, improved logic)
============================================================ */
const countriesByRegion: Record<string, { name: string; flag: string }[]> = {
  Americas: [
    { name: "United States", flag: "🇺🇸" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Chile", flag: "🇨🇱" },
    { name: "Colombia", flag: "🇨🇴" },
    { name: "Peru", flag: "🇵🇪" },
  ],

  Caribbean: [
    { name: "Jamaica", flag: "🇯🇲" },
    { name: "Barbados", flag: "🇧🇧" },
    { name: "Trinidad & Tobago", flag: "🇹🇹" },
    { name: "The Bahamas", flag: "🇧🇸" },
    { name: "Haiti", flag: "🇭🇹" },
    { name: "Dominican Republic", flag: "🇩🇴" },
    { name: "Puerto Rico", flag: "🇵🇷" },
    { name: "Cuba", flag: "🇨🇺" },
  ],

  Europe: [
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Norway", flag: "🇳🇴" },
  ],

  "Middle East & Africa": [
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "United Arab Emirates", flag: "🇦🇪" },
    { name: "Israel", flag: "🇮🇱" },
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Egypt", flag: "🇪🇬" },
  ],

  Asia: [
    { name: "China", flag: "🇨🇳" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "India", flag: "🇮🇳" },
    { name: "Pakistan", flag: "🇵🇰" },
    { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Vietnam", flag: "🇻🇳" },
    { name: "Philippines", flag: "🇵🇭" },
    { name: "Thailand", flag: "🇹🇭" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Taiwan", flag: "🇹🇼" },
  ],

  Oceania: [
    { name: "Australia", flag: "🇦🇺" },
    { name: "New Zealand", flag: "🇳🇿" },
  ],
};

/* ============================================================
   COMPONENT
============================================================ */
export default function CountryFlagRibbon() {
  const { country, setCountry } = usePredictionFilter();

  // Determine which group the selected country is in
  const matchedRegion =
    Object.keys(countriesByRegion).find((group) =>
      countriesByRegion[group].some((c) => c.name === country)
    ) || "Americas";

  const flags = countriesByRegion[matchedRegion];

  return (
    <div className="w-full overflow-hidden border-b border-slate-800/50 py-2 bg-slate-950/40 backdrop-blur-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={matchedRegion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-center gap-4 text-blue-300"
        >
          {/* Flag Row */}
          <div className="flex gap-2 text-xl">
            {flags.map((c, i) => (
              <motion.span
                key={c.name}
                onClick={() => setCountry(c.name)}
                className="cursor-pointer"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  textShadow:
                    c.name === country
                      ? "0 0 12px rgba(56,189,248,0.8), 0 0 24px rgba(56,189,248,0.4)"
                      : "none",
                  color: c.name === country ? "#93c5fd" : undefined,
                }}
                transition={{ delay: i * 0.08 }}
              >
                {c.flag}
              </motion.span>
            ))}
          </div>

          {/* Label */}
          <motion.span
            className="text-sm font-medium tracking-wide text-slate-300"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {matchedRegion} Focus
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
