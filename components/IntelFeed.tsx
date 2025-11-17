"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import usePulse from "@/hooks/usePulse";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

interface IntelEntry {
  id: number;
  category: string;
  headline: string;
  summary: string;
  country: string;
  sentiment: string;
  confidence: number;
  created_at: string;
}

export default function IntelFeed() {
  const { isPulsing, triggerPulse } = usePulse(1000);
  const { country, category } = usePredictionFilter();

  const [intel, setIntel] = useState<IntelEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // === Load intel entries (filtered by country + category) ===
  const loadIntel = async () => {
    setLoading(true);

    let query = supabase
      .from("intel_entries")
      .select("*")
      .order("created_at", { ascending: false });

    if (country && country !== "Global") {
      query = query.eq("country", country);
    }

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) console.error("Error loading intel:", error);
    else setIntel(data || []);

    setLoading(false);
  };

  // === Realtime listener for new intel inserts ===
  useEffect(() => {
    loadIntel();

    const channel = supabase
      .channel("intel_entries_live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "intel_entries",
        },
        (payload) => {
          console.log("🧠 New intel detected:", payload);
          triggerPulse();
          loadIntel(); // reload list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [country, category]); // reload when filters change

  // === Render ===================================================
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header with pulse glow */}
      <div
        className={`transition-all duration-700 mb-3 ${
          isPulsing
            ? "ring-4 ring-blue-500/50 shadow-[0_0_30px_10px_rgba(0,150,255,0.3)]"
            : "ring-0 shadow-none"
        } rounded-xl`}
      >
        <h2 className="text-xl font-semibold text-center text-blue-300 py-2">
          🧠 Live Intel Feed
          {country !== "Global" && (
            <span className="text-slate-400 text-sm ml-2">— {country}</span>
          )}
        </h2>
      </div>

      {/* Intel list */}
      {loading ? (
        <p className="text-slate-400 text-center">Loading intel...</p>
      ) : intel.length === 0 ? (
        <p className="text-slate-500 text-center">
          No intel for <strong>{country}</strong> in{" "}
          <strong>{category}</strong> yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {intel.map((entry) => (
            <li
              key={entry.id}
              className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/40 transition"
            >
              <p className="font-semibold text-slate-100">{entry.headline}</p>
              <p className="text-sm text-slate-300">{entry.summary}</p>

              <p className="text-xs text-slate-500 mt-1">
                {entry.country} • {entry.category} • {entry.sentiment} •{" "}
                {entry.confidence}% confidence
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
