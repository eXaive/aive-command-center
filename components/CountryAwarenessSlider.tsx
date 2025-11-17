"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRegionalConfidence } from "@/hooks/useRegionalConfidence";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

/* ============================================================
   Country List (identical, just cleaned)
============================================================ */
const countries = [
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "ca", name: "Canada" },
  { code: "br", name: "Brazil" },
  { code: "jm", name: "Jamaica" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "in", name: "India" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "cn", name: "China" },
  { code: "mx", name: "Mexico" },
  { code: "ng", name: "Nigeria" },
  { code: "za", name: "South Africa" },
  { code: "eg", name: "Egypt" },
  { code: "it", name: "Italy" },
  { code: "es", name: "Spain" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
  { code: "au", name: "Australia" },
  { code: "nz", name: "New Zealand" },
  { code: "ae", name: "UAE" },
  { code: "tr", name: "Turkey" },
  { code: "ar", name: "Argentina" },
  { code: "cl", name: "Chile" },
  { code: "co", name: "Colombia" },
  { code: "pk", name: "Pakistan" },
  { code: "id", name: "Indonesia" },
  { code: "th", name: "Thailand" },
  { code: "vn", name: "Vietnam" },
  { code: "bd", name: "Bangladesh" },
  { code: "ph", name: "Philippines" },
  { code: "my", name: "Malaysia" },
  { code: "sa", name: "Saudi Arabia" },
  { code: "ir", name: "Iran" },
  { code: "il", name: "Israel" },
  { code: "ke", name: "Kenya" },
  { code: "gh", name: "Ghana" },
  { code: "et", name: "Ethiopia" },
  { code: "pl", name: "Poland" },
  { code: "nl", name: "Netherlands" },
  { code: "ch", name: "Switzerland" },
  { code: "be", name: "Belgium" },
  { code: "fi", name: "Finland" },
  { code: "cz", name: "Czechia" },
  { code: "ua", name: "Ukraine" },
  { code: "ru", name: "Russia" },
  { code: "sg", name: "Singapore" },
  { code: "hk", name: "Hong Kong" },
  { code: "tw", name: "Taiwan" },
];

/* ============================================================
   Single Flag Row Component — now globally interactive
============================================================ */
function FlagRow({ reverse = false }: { reverse?: boolean }) {
  const confidence = useRegionalConfidence();
  const { setCountry } = usePredictionFilter();   // 🔥 global sync hook

  const doubled = [...countries, ...countries]; // smooth infinite loop
  const direction = reverse ? "50%" : "-50%";

  const glowColor = (name: string) => {
    const val = confidence[name] ?? 0.7;
    if (val > 0.8) return "from-blue-400 to-cyan-400";
    if (val > 0.6) return "from-yellow-400 to-amber-300";
    return "from-red-500 to-pink-400";
  };

  const pulseSpeed = (name: string) => {
    const val = confidence[name] ?? 0.7;
    return 3 - Math.abs(val - 0.7) * 4; // dynamic oscillation
  };

  return (
    <motion.div
      className={`flex gap-5 sm:gap-7 ${reverse ? "flex-row-reverse" : ""}`}
      animate={{ x: ["0%", direction] }}
      transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
    >
      {doubled.map((c, i) => {
        const aura = glowColor(c.name);
        const speed = pulseSpeed(c.name);

        return (
          <motion.div
            key={`${c.code}-${i}`}
            whileHover={{ scale: 1.15 }}
            className="min-w-[70px] sm:min-w-[80px] flex flex-col items-center cursor-pointer"
            onClick={() => setCountry(c.name)}   {/* 🔥 global sync */}
          >
            <motion.div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-r ${aura} shadow-lg shadow-blue-900/40`}
              animate={{ opacity: [1, 0.8, 1], scale: [1, 1.05, 1] }}
              transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="rounded-full overflow-hidden w-full h-full bg-slate-900">
                <Image
                  src={`https://flagcdn.com/w80/${c.code}.png`}
                  alt={c.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-1 text-center">
              {c.name}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */
export default function CountryAwarenessSlider() {
  return (
    <div className="relative w-full overflow-hidden py-6 select-none">
      <div className="space-y-6">
        <FlagRow reverse={false} />
        <FlagRow reverse={true} />
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent" />
    </div>
  );
}
