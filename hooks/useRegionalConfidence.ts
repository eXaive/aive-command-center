"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";

/**
 * 🧭 useRegionalConfidence
 * Retrieves average confidence per country from Supabase → used to color flag orbs.
 */
export function useRegionalConfidence() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchScores() {
      try {
        const { data, error } = await supabase
          .from("cas_memory")
          .select("country, confidence");

        if (error) throw error;

        // Aggregate average confidence by country
        const map: Record<string, { sum: number; count: number }> = {};
        data?.forEach((row) => {
          const c = row.country;
          const conf = row.confidence || 0.7;
          if (!map[c]) map[c] = { sum: 0, count: 0 };
          map[c].sum += conf;
          map[c].count++;
        });

        const avg: Record<string, number> = {};
        Object.entries(map).forEach(([country, { sum, count }]) => {
          avg[country] = sum / count;
        });

        setScores(avg);
      } catch (err) {
        console.warn("⚠️ Confidence fetch skipped:", (err as any).message);
      }
    }

    fetchScores();

    // 🔁 Auto-refresh every 60s for live reflection
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  return scores;
}
