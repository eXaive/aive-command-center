// Supabase Edge Function: gold_score (stable baseline)
// Purpose: Inserts mock data into gold_predictions for testing (no authorization needed)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Public anon key setup (safe for test mode)
const supabase = createClient(
  "https://jtvseavjssmprfqnwyoe.supabase.co",
  "your-anon-key-here"
);

serve(async (req) => {
  try {
    const { asset = "gold" } = await req.json();

    const predicted_price = +(2300 + Math.random() * 100).toFixed(2);
    const actual_price = +(2300 + Math.random() * 100).toFixed(2);
    const accuracy = +(100 - Math.abs(predicted_price - actual_price) / actual_price * 100).toFixed(2);
    const confidence = +(80 + Math.random() * 20).toFixed(2);
    const fitness = +(50 + Math.random() * 50).toFixed(2);
    const reflection = `Mock prediction test for ${asset}`;
    const created_at = new Date().toISOString();

    const { error } = await supabase.from("gold_predictions").insert([
      {
        asset,
        predicted_price,
        actual_price,
        accuracy,
        confidence,
        fitness,
        reflection,
        model_version: "mock_v1",
        created_at,
        updated_at: created_at,
      },
    ]);

    if (error) {
      console.error("Insert failed:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`✅ Inserted mock data for ${asset}`);
    return new Response(
      JSON.stringify({
        status: "success",
        asset,
        predicted_price,
        actual_price,
        accuracy,
        confidence,
        fitness,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
