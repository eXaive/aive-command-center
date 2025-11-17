"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import usePulse from "@/hooks/usePulse";

interface IntelEntry {
  id: number;
  headline: string;
  summary: string;
  region: string;
  sentiment: string;
  confidence: number;
  created_at: string;
}

export default function FinancialIntelligenceFeed() {
  const { region, fiscalProfile, awarenessPulse } = usePredictionFilter();
  const [intel, setIntel] = useState<IntelEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPulsing, triggerPulse } = usePulse(1200);

  // 🔹 Fetch Finance-only Intel
  const loadIntel = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("intel_entries")
      .select("*")
      .ilike("category", "%Finance%")
      .ilike("region", `%${region}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) console.error("Error loading finance intel:", error);
    else setIntel(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadIntel();

    // 🧠 Realtime listener
    const channel = supabase
      .channel("finance_intel_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "intel_entries" },
        (payload) => {
          const entry = payload.new as IntelEntry;
          if (entry.region?.includes(region) && entry) {
            triggerPulse();
            setIntel((prev) => [entry, ...prev.slice(0, 19)]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [region]);

  // 🌍 Fiscal Header Animation
  const pulseActive = isPulsing || awarenessPulse;

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-6 bg-slate-900/60 backdrop-blur-md
                 border border-blue-500/30 rounded-2xl shadow-lg overflow-hidden"
      animate={{
        boxShadow: pulseActive
          ? "0 0 45px rgba(59,130,246,0.4)"
          : "0 0 10px rgba(59,130,246,0.1)",
      }}
      transition={{ duration: 1 }}
    >
      {/* === Fiscal Awareness Header === */}
      <div className="p-4 border-b border-slate-700/40 bg-slate-950/60 text-center">
        <motion.h2
          className="text-lg md:text-xl font-semibold text-blue-400"
          animate={{
            textShadow: pulseActive
              ? "0 0 25px rgba(59,130,246,0.8)"
              : "0 0 8px rgba(59,130,246,0.3)",
          }}
          transition={{ duration: 1 }}
        >
          💼 Financial Intelligence Feed
        </motion.h2>
        <p className="text-xs text-slate-400 mt-1">{region}</p>

        {fiscalProfile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] mt-3 text-slate-300">
            <div>
              <p className="font-medium text-blue-300">Interest Rate</p>
              <p>{fiscalProfile.interest_rate}</p>
            </div>
            <div>
              <p className="font-medium text-blue-300">Inflation Target</p>
              <p>{fiscalProfile.inflation_target}</p>
            </div>
            <div>
              <p className="font-medium text-blue-300">GDP Growth</p>
              <p>{fiscalProfile.gdp_growth}</p>
            </div>
            <div>
              <p className="font-medium text-blue-300">Central Bank</p>
              <p>{fiscalProfile.central_bank}</p>
            </div>
          </div>
        )}
      </div>

      {/* === Feed Body === */}
      <div className="p-4">
        {loading ? (
          <p className="text-slate-400 text-center">Loading financial intel…</p>
        ) : intel.length === 0 ? (
          <p className="text-slate-500 text-center">
            No finance intel for <strong>{region}</strong> yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {intel.map((entry) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-3 bg-slate-800/50 rounded-lg border border-slate-700
                           hover:border-blue-500/40 transition"
              >
                <p className="font-semibold text-slate-100">{entry.headline}</p>
                <p className="text-sm text-slate-300">{entry.summary}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {entry.sentiment} • {entry.confidence}% confidence
                </p>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* === Awareness Glow Layer === */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          background: pulseActive
            ? "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15), transparent 60%)"
            : "transparent",
        }}
        transition={{ duration: 1.2 }}
      />
    </motion.div>
  );
}
