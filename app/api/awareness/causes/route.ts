import { createClient } from "@/lib/supabase/server";

// 🧠 A.I.V.E. Awareness Cause API
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("aive_reflection_causes")
      .select(
        "cause_category, cause_region, cause_summary, cause_sentiment, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("❌ Awareness API error:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          summary: "No recent cause reflections detected.",
          category: "General",
          region: "Global",
          sentiment: 0,
          created_at: new Date().toISOString(),
        }),
        { status: 200 }
      );
    }

    const cause = data[0];
    return new Response(
      JSON.stringify({
        category: cause.cause_category || "General",
        region: cause.cause_region || "Global",
        summary:
          cause.cause_summary ||
          "System operating within normal reflection bounds.",
        sentiment: cause.cause_sentiment || 0,
        created_at: cause.created_at,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("⚠️ Awareness API failed:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500 }
    );
  }
}


