// /lib/ingest/marketIngest.ts
// 🌍 A.I.V.E. — Market Ingestion Engine
// Fetches finance data (gold, CPI, FX) and stores to Supabase for analysis.

import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function marketIngest() {
  const supabase = createServerSupabase();   // ✔ uses Service Role securely
  const now = new Date().toISOString();

  try {
    // 1️⃣ Fetch live sources in parallel (with safe rejections)
    const responses = await Promise.allSettled([
      fetch("https://metals-api.com/api/latest?base=XAU&symbols=USD")
        .then((r) => (r.ok ? r.json() : Promise.reject("Metals API failed"))),

      fetch("https://api.api-ninjas.com/v1/inflation", {
        headers: { "X-Api-Key": process.env.API_NINJAS_KEY! },
      }).then((r) =>
        r.ok ? r.json() : Promise.reject("Inflation API failed")
      ),

      fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=EUR"
      ).then((r) =>
        r.ok ? r.json() : Promise.reject("FX API failed")
      ),
    ]);

    // 2️⃣ Parse all values safely with intelligent fallbacks
    const gold =
      responses[0].status === "fulfilled"
        ? responses[0].value?.rates?.USD ?? null
        : null;

    const cpi =
      responses[1].status === "fulfilled"
        ? responses[1].value?.yearly_inflation_rate ?? null
        : null;

    const fx =
      responses[2].status === "fulfilled"
        ? responses[2].value?.rates?.EUR ?? null
        : null;

    // 3️⃣ Build standardized ingest rows (A.I.V.E. unified ingestion contract)
    const dataset = [
      {
        asset: "Gold (XAU/USD)",
        value: gold ?? 2432.7,
        source: gold ? "live" : "fallback",
        ingested_at: now,
      },
      {
        asset: "US CPI (YoY)",
        value: cpi ?? 3.3,
        source: cpi ? "live" : "fallback",
        ingested_at: now,
      },
      {
        asset: "USD/EUR Exchange Rate",
        value: fx ?? 0.9263,
        source: fx ? "live" : "fallback",
        ingested_at: now,
      },
    ];

    // 4️⃣ Insert into Supabase
    const { error } = await supabase.from("market_data").insert(dataset);

    if (error) {
      console.error("⚠️ Supabase insert error:", error.message);
      throw new Error(error.message);
    }

    console.log(
      `✅ Market ingestion complete: ${dataset.length} entries stored`
    );

    return {
      status: "ok",
      inserted: dataset.length,
      data: dataset,
    };
  } catch (err: any) {
    console.error("❌ Market ingestion failed:", err);

    return {
      status: "error",
      inserted: 0,
      error: err?.message || String(err),
      data: [],
    };
  }
}
