import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// 🌍 Regions and Subcategories
const regions = ["Asia", "Europe", "Americas", "Middle East", "Africa"];
const categories = {
  Finance: ["Gold", "Silver", "Oil", "BTC"],
  Geopolitics: ["Elections", "Sanctions", "Conflicts"],
  Weather: ["Rainfall", "Temperature", "Storms"],
  Health: ["Outbreak", "Immunity", "Hospitalizations"],
};

// 🎲 Random helpers
const rand = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);
const pick = <T>(arr: T[]) => arr[rand(0, arr.length - 1)];

serve(async () => {
  const now = new Date();
  const records: any[] = [];

  for (const cat of Object.keys(categories)) {
    for (const sub of categories[cat as keyof typeof categories]) {
      for (const region of regions) {
        const confidence = rand(60, 98) + Math.random();
        const accuracy = rand(55, 90) / 100;
        const trend = pick(["up", "down", "flat"]);
        const daysAhead = rand(1, 5);

        const predicted_for_date = new Date(now);
        predicted_for_date.setDate(now.getDate() + daysAhead);

        records.push({
          category: cat,
          subcategory: sub,
          region,
          predicted_for_date: predicted_for_date.toISOString(),
          confidence,
          rolling_7d_accuracy: accuracy,
          trend_direction: trend,
          outcome_status: "pending",
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  const { error } = await supabase.from("predictions").insert(records);
  if (error) {
    console.error("❌ Insert failed:", error.message);
    return new Response(JSON.stringify({ success: false, error }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`✅ Inserted ${records.length} mock predictions`);
  return new Response(
    JSON.stringify({ success: true, inserted: records.length }),
    { headers: { "Content-Type": "application/json" } }
  );
});
