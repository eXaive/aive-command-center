import { supabase } from "@/lib/supabaseClient";

/* -------------------------------------------------------------
   CORE FUNCTION — Update causal_strength entry for a cause
   Called every time a quiz finishes (auto or manual).
--------------------------------------------------------------*/
export async function updateCausalStrength({
  cause,
  category,
  country,
  clarity,
  sentiment,
}) {
  try {
    /* -------------------------------------------------------------
       1️⃣ — Fetch the last 20 learning logs for this cause
    --------------------------------------------------------------*/
    const { data: logs, error: logError } = await supabase
      .from("prediction_learning_log")
      .select("is_correct, clarity_level, sentiment, selected_answer")
      .eq("cas_cause", cause)
      .order("created_at", { ascending: false })
      .limit(20);

    if (logError) throw logError;

    const total = logs.length;
    const correct = logs.filter((x) => x.is_correct).length;

    /* -------------------------------------------------------------
       2️⃣ — Strength Score (accuracy ratio)
    --------------------------------------------------------------*/
    const strengthScore = total > 0 ? correct / total : 0;

    /* -------------------------------------------------------------
       3️⃣ — Drift Score
           (Recent accuracy - previous accuracy)
    --------------------------------------------------------------*/
    const recent = logs.slice(0, 5);
    const previous = logs.slice(5, 10);

    const recentCorrect =
      recent.length > 0
        ? recent.filter((x) => x.is_correct).length / recent.length
        : 0;

    const prevCorrect =
      previous.length > 0
        ? previous.filter((x) => x.is_correct).length / previous.length
        : 0;

    const driftScore = recentCorrect - prevCorrect;

    /* -------------------------------------------------------------
       4️⃣ — Awareness-Weighted Reliability
           Formula:   strength * (0.6 + clarity * 0.4)
    --------------------------------------------------------------*/
    const awarenessWeighted =
      strengthScore * (0.6 + (clarity || 0) * 0.4);

    /* -------------------------------------------------------------
       5️⃣ — UPSERT into causal_strength
    --------------------------------------------------------------*/
    const { data: existing } = await supabase
      .from("causal_strength")
      .select("id")
      .eq("cause", cause)
      .eq("category", category)
      .eq("country", country)
      .maybeSingle();

    let upsertPayload = {
      cause,
      category,
      country,
      strength_score: strengthScore,
      drift_score: driftScore,
      awareness_weighted: awarenessWeighted,
      updated_at: new Date().toISOString(),
    };

    let upsertResponse;

    if (existing?.id) {
      // update
      upsertResponse = await supabase
        .from("causal_strength")
        .update(upsertPayload)
        .eq("id", existing.id);
    } else {
      // insert new
      upsertResponse = await supabase
        .from("causal_strength")
        .insert([upsertPayload]);
    }

    if (upsertResponse.error) throw upsertResponse.error;

    /* -------------------------------------------------------------
       6️⃣ — Return new metrics for real-time usage
    --------------------------------------------------------------*/
    return {
      strength: strengthScore,
      drift: driftScore,
      awarenessWeighted,
    };
  } catch (err) {
    console.error("Causal Strength Engine Error:", err);
    return null;
  }
}
