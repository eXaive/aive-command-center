// 🚀 A.I.V.E. Stage 3 — Awareness + Insights Storage + Realtime Readiness
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Predefined tone hints
const sentimentHints: Record<string, string[]> = {
  Positive: [
    "Confidence levels are improving across regions.",
    "The overall tone is optimistic, suggesting recovery.",
    "Indicators align with upward trends in sentiment.",
  ],
  Negative: [
    "Conditions appear fragile with potential downside risk.",
    "Sentiment deteriorating — watch for short-term volatility.",
    "Unfavorable momentum noted; caution advised.",
  ],
  Neutral: [
    "Situation remains balanced; no major directional bias.",
    "Market signals stable within expected thresholds.",
    "Monitoring phase — minimal deviation from baseline.",
  ],
};

serve(async (req) => {
  try {
    const body = await req.json();
    console.log("📡 Incoming Intel:", body);

    const { headline, summary, region, sentiment, impact } = body;

    // Generate confidence + contextual insight
    const baseConfidence = Math.floor(Math.random() * 25) + 60;
    const adjust =
      sentiment === "Positive" ? 5 : sentiment === "Negative" ? -5 : 0;
    const confidence = Math.min(99, Math.max(50, baseConfidence + adjust));

    const pool = sentimentHints[sentiment] || sentimentHints["Neutral"];
    const insight = pool[Math.floor(Math.random() * pool.length)];

    const insights = `Intel received for ${region}: "${headline}". ${insight} Impact rating ${impact}/100. Summary: ${summary}`;

    // Match your column names
    const record = {
      region,
      headline,
      summary,
      impact_score: impact,
      sentiment_level: sentiment,
      confidence_score: confidence,
      category: "general",
      access_level: "Public",
      verified: false,
      created_at: new Date().toISOString(),
      insights, // ✅ new column
    };

    const { error } = await supabase.from("intel_feed").insert([record]);
    if (error) throw new Error(error.message);

    const response = {
      confidence,
      overallSentiment: sentiment,
      insights,
    };

    console.log("✅ A.I.V.E. Synced:", response);
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("🔥 A.I.V.E. Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Error", details: String(err) }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});




