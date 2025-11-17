import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/* ------------------------- Region Normalizer ------------------------- */
function normalizeRegion(value?: string | null): string {
  if (!value) return "Global";

  const r = value.toLowerCase().trim();

  if (["usa", "u.s.", "united states", "america"].includes(r))
    return "United States";

  if (["uk", "england", "britain", "united kingdom"].includes(r))
    return "United Kingdom";

  return value;
}

export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
      { status: 500 }
    );
  }

  const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
  );

  const body = await req.json();

  const {
    country,     // incoming field name
    region,      // allow either
    category,
    cause,
    effect,
    reflection,
    confidence,
  } = body;

  // 🔥 Correct + safe region mapping
  const finalRegion = normalizeRegion(region || country || "Global");

  // 🛑 Required fields check
  if (!cause || !effect || !category) {
    return NextResponse.json(
      { error: "Missing required fields: cause, effect, or category" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("cas_memory").insert([
    {
      region: finalRegion,
      category,
      cause,
      effect,
      reflection: reflection || null,
      confidence: confidence ?? 0.75,
      learned_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("❌ CAS Memory insert failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log("✅ CAS Memory recorded:", finalRegion, cause, "→", effect);

  return NextResponse.json({ success: true });
}
