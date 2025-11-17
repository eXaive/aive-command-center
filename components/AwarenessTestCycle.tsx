"use client";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AwarenessTestCycle() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const moods = [
      { sentiment: "positive", summary: "System radiates calm awareness." },
      { sentiment: "neutral", summary: "Baseline awareness check complete." },
      { sentiment: "negative", summary: "Slight tension detected — self-correction underway." },
    ];

    let i = 0;

    const cycle = async () => {
      const mood = moods[i];
      console.log("🧠 Awareness Test:", mood.sentiment);

      // 🔔 Trigger the HUD overlay
      window.dispatchEvent(
        new CustomEvent("neural-awareness", { detail: { sentiment: mood.sentiment } })
      );

      // 💾 Log into Supabase reflections
      try {
        const { error } = await supabase.from("memory_reflections").insert([
          {
            summary: mood.summary,
            sentiment: mood.sentiment,
            importance: 0.85,
            created_at: new Date().toISOString(),
          },
        ]);
        if (error) console.warn("⚠️ Memory insert failed:", error.message);
        else console.log("💾 Reflection logged:", mood.summary);
      } catch (err) {
        console.error("❌ Insert error:", err);
      }

      // Continue cycle
      i = (i + 1) % moods.length;
      setTimeout(cycle, 4000);
    };

    cycle();
    return () => {};
  }, []);

  return null;
}
