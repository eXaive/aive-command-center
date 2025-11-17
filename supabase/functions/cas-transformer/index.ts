// supabase/functions/cas-transformer/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { createClient } = await import(
      "https://esm.sh/@supabase/supabase-js@2"
    );

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    // Incoming prediction payload from trigger
    const body = await req.json();

    const {
      region,
      category,
      headline,
      prediction,
      confidence,
      sentiment,
      impact_score,
      created_at
    } = body;

    /* --------------------------------------------------------
       STEP 1 — Generate CAUSE and EFFECT from prediction text
    ---------------------------------------------------------*/

    // Core transformation: Prediction → Cause → Effect
    const cause = `Predicted change in ${category.toLowerCase()} for ${region}: ${headline}`;
    const effect = `This is expected to result in: ${prediction}`;

    /* --------------------------------------------------------
       STEP 2 — Auto-generate AI reflection
    ---------------------------------------------------------*/

    const reflection = `This prediction suggests that ${region} may experience shifts in ${category.toLowerCase()}, leading to downstream effects aligned with market expectations.`;

    /* --------------------------------------------------------
       STEP 3 — Normalize confidence into [0–1]
    ---------------------------------------------------------*/
    const conf = confidence ? Number(confidence) : 0.7;

    /* --------------------------------------------------------
       STEP 4 — Insert into cas_memory
    ---------------------------------------------------------*/
    const { error } = await supabase.from("cas_memory").insert({
      country: region,
      category,
      cause,
      effect,
      reflection,
      confidence: conf,
      source_type: "Prediction Engine",
      learned_at: created_at ?? new Date().toISOString(),
    });

    if (error) {
      console.error("Insert error:", error);
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("cas-transformer ERROR:", err);
    return new Response(JSON.stringify({ error: err.toString() }), {
      status: 500
    });
  }
});
