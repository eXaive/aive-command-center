import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const { confidence_mean, sentiment_balance, uncertainty_spread, focus_category } = body;

  // Compute normalized clarity index (0–1)
  const clarity_index = Math.max(
    0,
    Math.min(1, (confidence_mean * sentiment_balance) - uncertainty_spread)
  );

  const { data, error } = await supabase
    .from("aive_awareness_state")
    .insert([{ clarity_index, confidence_mean, sentiment_balance, uncertainty_spread, focus_category }])
    .select();

  if (error)
    return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ message: "Awareness logged", data }), { status: 200 });
}
