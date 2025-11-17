// app/api/predictions/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🌍 Normalize incoming country names for consistency
function normalizeCountry(name: string | null): string {
  if (!name) return "United States";
  const v = name.toLowerCase().trim();

  if (["usa", "us", "united states", "america"].includes(v))
    return "United States";

  if (["uk", "england", "britain", "united kingdom"].includes(v))
    return "United Kingdom";

  if (["uae", "emirates", "dubai"].includes(v))
    return "United Arab Emirates";

  return name;
}

export async function GET(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { searchParams } = new URL(req.url);

    // ⭐ COUNTRY-ONLY FILTER
    const countryParam = searchParams.get("country") || "United States";
    const country = normalizeCountry(countryParam);

    const { data, error } = await supabase
      .from("aive_predictions")
      .select("*")
      .eq("country", country) // ⭐ PRIMARY FILTER
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      country,
      count: data.length,
      data,
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
