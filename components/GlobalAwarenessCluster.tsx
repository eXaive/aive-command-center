"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

interface RegionStats {
  country: string;
  average_confidence: number;
  memory_count?: number;
  reflection_count?: number;
  last_updated: string;
}

const REGIONS = ["United States", "India", "Germany", "Nigeria", "Jamaica"];

export default function GlobalAwarenessCluster() {
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const { region, setRegion } = usePredictionFilter(); // ⚙️ Access context setter

  // 🧭 Fetch CAS summaries
  useEffect(() => {
    const fetchClusterData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cas_memory_meta")
        .select("*")
        .in("country", REGIONS);

      if (!error && data) setRegions(data);
      setLoading(false);
    };

    fetchClusterData();
    const interval = setInterval(fetchClusterData, 30000);
    return () => clearInterval(interval);
  }, [supabase]);

  if (loading)
    return (
      <div className="text-blue-400 text-xs sm:text-sm animate-pulse text-center mt-4">
        🌍 Synchronizing global awareness...
      </div>
    );

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-4 mb-6">
      {regions.map((r) => {
        const conf = r.average_confidence || 0;
        const intensity = conf * 1.5;
        const color =
          conf > 0.85
            ? "from-green-400 to-emerald-500"
            : conf > 0.7
            ? "from-yellow-400 to-amber-500"
            : "from-red-400 to-pink-500";

        const isActive = region === r.country;

        return (
          <motion.div
            key={r.country}
            onClick={() => {
              setRegion(r.country);
              const chime = new Audio("/sounds/focus-chime.mp3");
              chime.volume = 0.25;
              chime.play().catch(() => {});
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${color} flex items-center justify-center cursor-pointer transition-all duration-500 ${
              isActive ? "ring-4 ring-blue-400 shadow-lg shadow-blue-500/40" : "ring-0"
            }`}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{
              scale: isActive ? [1.05, 1.1, 1.05] : [1, 1.04, 1],
              opacity: [0.8, 1, 0.8],
              boxShadow: [
                `0 0 ${8 + intensity * 8}px rgba(59,130,246,0.4)`,
                `0 0 ${16 + intensity * 12}px rgba(59,130,246,0.7)`,
                `0 0 ${8 + intensity * 8}px rgba(59,130,246,0.4)`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-slate-900/40 backdrop-blur-sm" />
            <div className="z-10 text-center">
              <p
                className={`text-sm sm:text-base font-semibold ${
                  isActive ? "text-blue-100" : "text-slate-200"
                } drop-shadow`}
              >
                {r.country.split(" ")[0]}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-300">
                {Math.round(conf * 100)}%
              </p>
            </div>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -bottom-14 w-40 bg-slate-800/90 text-slate-300 text-[11px] sm:text-xs p-2 rounded-md border border-slate-700 shadow-md text-center"
            >
              <p>🧠 {r.memory_count || 0} memories</p>
              <p>💭 {r.reflection_count || 0} reflections</p>
              <p className="text-blue-400 text-[10px] mt-1">
                Updated {new Date(r.last_updated).toLocaleTimeString()}
              </p>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

