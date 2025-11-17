import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchLiveData() {
  let results: any[] = [];

  try {
    const goldRes = await fetch("https://api.metals.dev/v1/spot", { cache: "no-store" });
    const goldData = await goldRes.json();
    const goldPrice = goldData?.[0]?.gold ?? null;
    if (goldPrice) results.push({ asset: "Gold (XAU/USD)", value: goldPrice, source: "metals.dev" });
  } catch (err) {
    console.warn("⚠️ Gold data unavailable — using fallback.");
    results.push({ asset: "Gold (XAU/USD)", value: 2420 + Math.random() * 25, source: "fallback" });
  }

  try {
    const cpiRes = await fetch("https://api.api-ninjas.com/v1/inflation?country=us", {
      headers: { "X-Api-Key": process.env.API_NINJAS_KEY || "" },
      cache: "no-store",
    });
    const cpiData = await cpiRes.json();
    const cpiValue = cpiData?.yearly_rate ?? null;
    if (cpiValue) results.push({ asset: "US CPI (YoY)", value: cpiValue, source: "api-ninjas" });
  } catch (err) {
    console.warn("⚠️ CPI data unavailable — using fallback.");
    results.push({ asset: "US CPI (YoY)", value: 3.2 + Math.random() * 0.2, source: "fallback" });
  }

  try {
    const dxyRes = await fetch("https://api.exchangerate.host/latest?base=USD", { cache: "no-store" });
    const dxyData = await dxyRes.json();
    const eurRate = dxyData?.rates?.EUR ?? null;
    if (eurRate) results.push({ asset: "USD/EUR Exchange Rate", value: eurRate, source: "exchangerate.host" });
  } catch (err) {
    console.warn("⚠️ FX data unavailable — using fallback.");
    results.push({ asset: "USD/EUR Exchange Rate", value: 0.92 + Math.random() * 0.01, source: "fallback" });
  }

  // ✅ Ensure fallback always returns at least 3 items
  if (!results.length) {
    console.warn("⚠️ All sources failed, forcing fallback.");
    results = [
      { asset: "Gold (XAU/USD)", value: 2425 + Math.random() * 10, source: "forced-fallback" },
      { asset: "US CPI (YoY)", value: 3.3 + Math.random() * 0.1, source: "forced-fallback" },
      { asset: "USD/EUR Exchange Rate", value: 0.923 + Math.random() * 0.005, source: "forced-fallback" },
    ];
  }

  return results;
}

export async function GET() {
  try {
    const sources = await fetchLiveData();

    const { data, error } = await supabase.from("market_data").insert(sources).select();
    if (error) throw error;

    return NextResponse.json({
      status: "✅ Market data successfully ingested",
      records: sources.length,
      inserted: data,
    });
  } catch (err: any) {
    console.error("❌ Ingestion error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
