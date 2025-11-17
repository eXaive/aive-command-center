"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactCountryFlag from "react-country-flag";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import NeuralAwarenessGauge from "@/components/NeuralAwarenessGauge";

/*──────────────────────────────────────────────────────────────
  COUNTRY → ISO2 MAP
──────────────────────────────────────────────────────────────*/
const ISO_MAP: Record<string, string> = {
  "United States": "US",
  Canada: "CA",
  Mexico: "MX",
  Brazil: "BR",
  Jamaica: "JM",
  "Trinidad & Tobago": "TT",
  "Dominican Republic": "DO",
  Barbados: "BB",
  "United Kingdom": "GB",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Netherlands: "NL",
  Sweden: "SE",
  Norway: "NO",
  India: "IN",
  China: "CN",
  Japan: "JP",
  Singapore: "SG",
  Australia: "AU",
  Nigeria: "NG",
  Kenya: "KE",
  "South Africa": "ZA",
  Global: "UN",
};

type MemoryEntry = {
  id: string;
  country: string;
  category: string;
  cause: string;
  effect: string;
  reflection: string | null;
  confidence: number | null;
  source_type: string | null;
  learned_at: string;
};

/*──────────────────────────────────────────────────────────────
  MAIN COMPONENT
──────────────────────────────────────────────────────────────*/
export default function CasMemoryFeed() {
  const { country } = usePredictionFilter();
  const iso = ISO_MAP[country] || "UN";

  const supabase = createClientComponentClient<Database>();
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterReflection, setFilterReflection] = useState(false);

  /*──────────────────────────────
    Load Memory
  ──────────────────────────────*/
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("cas_memory")
        .select("*")
        .eq("country", country)
        .order("learned_at", { ascending: false })
        .limit(200);

      setEntries(data || []);
      setLoading(false);
    };

    load();
  }, [country]);

  /*──────────────────────────────
    Reflection Filter Logic
  ──────────────────────────────*/
  const filteredEntries = useMemo(
    () => (filterReflection ? entries.filter((e) => e.reflection) : entries),
    [filterReflection, entries]
  );

  /*──────────────────────────────
    Summary
  ──────────────────────────────*/
  const summary = useMemo(() => {
    if (!entries.length)
      return { total: 0, avg: 0, reflections: 0, top: "—" };

    const avg =
      entries.reduce((sum, e) => sum + (e.confidence || 0), 0) / entries.length;

    const reflections = entries.filter((e) => e.reflection).length;

    const catMap: Record<string, number> = {};
    for (const e of entries) {
      catMap[e.category] = (catMap[e.category] || 0) + 1;
    }
    const top = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0][0];

    return { total: entries.length, avg, reflections, top };
  }, [entries]);

  if (loading)
    return (
      <div className="text-blue-300 text-sm animate-pulse text-center mt-10">
        Loading causal awareness…
      </div>
    );

  if (!entries.length)
    return (
      <div className="text-slate-400 text-sm mt-10 text-center">
        No causal memory yet for {country}.
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto mt-10 p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-xl backdrop-blur-md"
    >
      {/*────────────────────────────────────────
        HEADER WITH FLAG + TITLE
      ────────────────────────────────────────*/}
      <h2 className="text-xl font-semibold text-blue-300 text-center mb-4 flex justify-center items-center gap-3">
        🧠  
        <ReactCountryFlag
          countryCode={iso}
          svg
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "6px",
            boxShadow: "0 0 10px rgba(59,130,246,0.35)",
          }}
        />
        {country} — Causal Memory
      </h2>

      {/*────────────────────────────────────────
        SUMMARY BAR
      ────────────────────────────────────────*/}
      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-xs text-slate-300 flex justify-between mb-5">
        <div>Total: <span className="text-blue-300">{summary.total}</span></div>
        <div>Avg Confidence: <span className="text-blue-300">{Math.round(summary.avg * 100)}%</span></div>
        <div>Reflections: <span className="text-blue-300">{summary.reflections}</span></div>
        <div>Top Category: <span className="text-blue-300">{summary.top}</span></div>
      </div>

      {/*────────────────────────────────────────
        FILTER CONTROL
      ────────────────────────────────────────*/}
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setFilterReflection(!filterReflection)}
          className={`px-3 py-1 text-xs rounded-full border ${
            filterReflection
              ? "bg-purple-700/40 border-purple-400 text-purple-200"
              : "bg-slate-800 border-slate-700 text-slate-400"
          }`}
        >
          Show Reflections Only
        </button>
      </div>

      {/*────────────────────────────────────────
        MAIN FEED
      ────────────────────────────────────────*/}
      <div className="space-y-4">
        {filteredEntries.map((entry) => {
          const isOpen = entry.id === expanded;

          const glow =
            entry.confidence && entry.confidence > 0.75
              ? "0 0 12px rgba(16,185,129,0.35)"
              : "0 0 12px rgba(59,130,246,0.35)";

          return (
            <motion.div
              key={entry.id}
              onClick={() => setExpanded(isOpen ? null : entry.id)}
              className="p-4 rounded-xl border border-slate-700 bg-slate-900/60 shadow-md cursor-pointer"
              animate={{
                boxShadow: isOpen ? glow : "none",
                scale: isOpen ? 1.02 : 1,
              }}
            >
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{entry.category}</span>
                <span className="font-bold text-blue-300">
                  {entry.confidence ? Math.round(entry.confidence * 100) : 0}%
                </span>
              </div>

              <p className="text-white text-sm font-medium">
                {entry.effect}
              </p>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 border-t border-slate-700/40 pt-3 space-y-4"
                  >
                    <div>
                      <p className="text-blue-300 text-sm font-semibold mb-1">Cause</p>
                      <p className="text-slate-300 text-sm">{entry.cause}</p>
                    </div>

                    {entry.reflection && (
                      <div>
                        <p className="text-purple-300 text-sm font-semibold mb-1">
                          Reflection
                        </p>
                        <p className="text-slate-400 text-xs italic">{entry.reflection}</p>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-500 italic">
                      {new Date(entry.learned_at).toLocaleString()}
                    </p>

                    <div className="mt-3">
                      <NeuralAwarenessGauge value={entry.confidence || 0.5} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
