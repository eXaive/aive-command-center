import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ service key for secure writes
);

export async function POST() {
  try {
    // 🧠 1️⃣ Fetch recent reflections
    const { data: reflections, error } = await supabase
      .from("memory_reflections")
      .select("sentiment, importance")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    if (!reflections || reflections.length === 0)
      return NextResponse.json({ success: false, message: "No reflections yet." });

    // 🪄 2️⃣ Compute adaptive metrics
    const avgImportance =
      reflections.reduce((sum, r) => sum + (r.importance || 0), 0) / reflections.length;

    const sentimentScore =
      reflections.reduce((sum, r) => {
        const s = r.sentiment?.toLowerCase();
        if (s === "positive") return sum + 1;
        if (s === "negative") return sum - 1;
        return sum;
      }, 0) / reflections.length;

    const confidenceBias = 0.7 + avgImportance * 0.3;
    const sentimentStability = 0.5 + Math.abs(sentimentScore) * 0.5;
    const reflectionDepth = 0.6 + avgImportance * 0.4;

    // 💾 3️⃣ Update memory_weights
    const updates = [
      { metric: "confidence_bias", value: confidenceBias },
      { metric: "sentiment_stability", value: sentimentStability },
      { metric: "reflection_depth", value: reflectionDepth },
    ];

    for (const row of updates) {
      await supabase
        .from("memory_weights")
        .upsert({ metric: row.metric, value: row.value })
        .select();
    }

    // 📡 4️⃣ Broadcast adaptation event
    await supabase.channel("aive-adapt").send({
      type: "broadcast",
      event: "ADAPT_UPDATE",
      payload: { confidenceBias, sentimentStability, reflectionDepth },
    });

    return NextResponse.json({
      success: true,
      message: "A.I.V.E. adapted successfully.",
      metrics: { confidenceBias, sentimentStability, reflectionDepth },
    });
  } catch (err: any) {
    console.error("❌ Adaptation error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
