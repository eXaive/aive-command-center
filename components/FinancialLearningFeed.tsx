"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

type CausalEntry = {
  id: string;
  country: string;
  category: string;
  cause: string;
  effect: string;
  confidence: number;
  reflection: string | null;
  source_type: string | null;
  created_at: string;
};

export default function FinancialLearningFeed() {
  const { country, fiscalProfile } = usePredictionFilter(); // ← FIXED
  const [entries, setEntries] = useState<CausalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  /* 🧠 Fetch CAS Memory for this country */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("cas_memory") // ← FIXED TABLE
          .select("*")
          .eq("country", country) // ← FIXED FILTER
          .order("created_at", { ascending: false })
          .limit(25);

        if (error) throw error;
        setEntries(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [country, supabase]);

  /* UI States */
  if (loading)
    return (
      <div className="text-blue-300 text-sm animate-pulse mt-8 text-center">
        Loading {country} learning feed…
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 text-sm mt-8 text-center">
        ⚠️ Error: {error}
      </div>
    );

  if (!entries.length)
    return (
      <div className="text-slate-400 text-sm mt-8 text-center">
        No causal learning entries yet for {country}.
      </div>
    );

  /* Fiscal Profile */
  const FiscalProfileCard = () =>
    fiscalProfile && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-5 mb-5 rounded-xl border border-blue-900/40 bg-slate-900/60 shadow-lg backdrop-blur-md"
      >
        <h3 className="text-blue-400 font-semibold text-lg mb-2">
          {country} Fiscal & Monetary Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-200">
          <p>💰 <span className="font-medium text-blue-300">Currency:</span> {fiscalProfile.currency}</p>
          <p>🎯 <span className="font-medium text-blue-300">Inflation Target:</span> {fiscalProfile.inflation_target}</p>
          <p>📈 <span className="font-medium text-blue-300">Interest Rate:</span> {fiscalProfile.interest_rate}</p>
          <p>🌍 <span className="font-medium text-blue-300">GDP Growth:</span> {fiscalProfile.gdp_growth}</p>

          <p className="sm:col-span-2 text-slate-400 text-xs italic mt-2 border-t border-slate-700/40 pt-2">
            🏦 <span className="font-medium text-blue-400">{fiscalProfile.central_bank}</span> — {fiscalProfile.notes}
          </p>
        </div>
      </motion.div>
    );

  /* Render Feed */
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-4 space-y-5">
      <FiscalProfileCard />

      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-5 rounded-xl border border-blue-900/40 bg-slate-900/70 shadow-lg backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex justify-between mb-2">
            <span className="text-blue-300 text-xs font-semibold">
              {entry.country} • {entry.category}
            </span>

            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                entry.confidence > 0.85
                  ? "bg-green-700/30 text-green-300"
                  : entry.confidence > 0.7
                  ? "bg-yellow-700/30 text-yellow-300"
                  : "bg-red-700/30 text-red-300"
              }`}
            >
              {Math.round(entry.confidence * 100)}%
            </span>
          </div>

          {/* Cause & Effect */}
          <p className="text-slate-100 text-sm">
            <span className="text-blue-400 font-medium">Cause:</span> {entry.cause}
          </p>

          <p className="text-slate-100 text-sm mt-1">
            <span className="text-blue-400 font-medium">Effect:</span> {entry.effect}
          </p>

          {entry.reflection && (
            <p className="text-slate-400 text-xs italic mt-2 border-t border-slate-700/40 pt-2">
              “{entry.reflection}”
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

