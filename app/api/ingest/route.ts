import { NextResponse } from "next/server";
import { marketIngest } from "@/lib/ingest/marketIngest";

/**
 * 🧠 A.I.V.E. — Market Ingestion Route
 * Pulls live data from multiple financial APIs every 30 minutes
 * (or on manual trigger) and inserts it into Supabase.
 *
 * Sources:
 *  - MetalsAPI: Gold (XAU/USD)
 *  - API Ninjas: US CPI (YoY)
 *  - ExchangeRate.host: USD/EUR
 */

export async function GET() {
  try {
    const result = await marketIngest();

    // ✅ Success case
    if (result?.status) {
      console.log("✅ Market data ingested:", result.status);
      return NextResponse.json(result, { status: 200 });
    }

    // ⚠️ Controlled error (handled internally)
    if (result?.error) {
      console.warn("⚠️ Market ingest warning:", result.error);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    // 🚨 Unknown fallback
    return NextResponse.json(
      { error: "Unknown response from ingestion process" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("❌ Market ingestion fatal error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
