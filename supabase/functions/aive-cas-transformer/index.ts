// aive-cas-transformer/index.ts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Main handler
Deno.serve(async (req) => {
  try {
    // Parse incoming JSON
    const wrapper = await req.json();
    const data = wrapper?.body;

    if (!data) {
      console.error("Missing payload body:", wrapper);
      return new Response(
        JSON.stringify({ error: "Missing body in payload" }),
        { status: 400 }
      );
    }

    console.log("CAS Transformer received payload:", data);

    // Extract expected fields
    const {
      id,
      country,
      category,
      headline,
      prediction,
      confidence,
      sentiment,
      impact_score
    } = data;

    // Required field checks (prevent DB errors)
    if (!id || !headline || !prediction) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: id, headline, prediction" }),
        { status: 400 }
      );
    }

    // Construct CAS fields
    const cause = headline;
    const effect = prediction;

    const reflection = `This event ("${headline}") influences ${country}'s ${category} outlook.`;

    const awareness_score = Math.min(1, (Number(confidence) + Number(impact_score)) / 200);

    // Create Supabase client (Service Role Key required)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert into CAS Memory Table
    const { error } = await supabase.from("cas_memory").insert({
      id,
      country,
      category,
      cause,
      effect,
      reflection,
      confidence: Number(confidence) / 100,
      sentiment,
      source_type: "prediction",
      awareness_score
    });

    if (error) {
      console.error("CAS insert error:", error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    console.log("CAS entry created successfully.");

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });

  } catch (err) {
    console.error("Transformer error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
