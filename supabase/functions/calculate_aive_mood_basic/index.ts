import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: reflections, error: reflectError } = await supabase
      .from("aive_reflection_causes")
      .select("cause_sentiment")
      .order("created_at", { ascending: false })
      .limit(30);

    if (reflectError) {
      console.error("Reflection fetch error:", reflectError);
      return new Response(
        JSON.stringify({ error: reflectError.message }),
        { status: 500 }
      );
    }

    if (!reflections || reflections.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No reflection data available yet.",
          mood_index: 0,
          dominant_sentiment: "neutral",
        }),
        { status: 200 }
      );
    }

    const scores = reflections.map((r) => r.cause_sentiment || 0);
    const mood_index =
      scores.reduce((sum, s) => sum + s, 0) / (scores.length || 1);

    const dominant_sentiment =
      mood_index > 0.2
        ? "positive"
        : mood_index < -0.2
        ? "negative"
        : "neutral";

    const { error: insertError } = await supabase.from("aive_mood_log").insert({
      mood_index,
      dominant_sentiment,
      recorded_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        status: "ok",
        mood_index,
        dominant_sentiment,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500 }
    );
  }
});
