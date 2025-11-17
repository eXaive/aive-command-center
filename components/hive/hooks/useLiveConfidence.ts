"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🧠 Initialize Supabase Client (Public URL + Key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 🪶 useLiveConfidence()
 * Listens to the Supabase 'intel' table for real-time confidence signals
 * and returns the rolling average to power the A.I.V.E. Purse simulation.
 */
export function useLiveConfidence() {
  const [confidence, setConfidence] = useState<number>(70); // default baseline

  useEffect(() => {
    let active = true;

    // Initial fetch — grab latest intel confidence values
    const fetchInitial = async () => {
      const { data, error } = await supabase
        .from("intel")
        .select("confidence")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.warn("⚠️ Supabase confidence fetch error:", error.message);
        return;
      }
      if (!data || !active) return;

      const avg =
        data.reduce((sum, i) => sum + (i.confidence || 0), 0) / data.length;
      setConfidence(Math.round(avg || 70));
    };

    // Subscribe to live intel updates
    const channel = supabase
      .channel("intel_confidence_stream")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "intel" },
        (payload) => {
          const val = payload.new?.confidence;
          if (typeof val === "number" && active) {
            // smooth transitions using moving average
            setConfidence((prev) => Math.round(prev * 0.9 + val * 0.1));
          }
        }
      )
      .subscribe();

    fetchInitial();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return confidence;
}
