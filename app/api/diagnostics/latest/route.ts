import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🔹 Returns the latest 20 diagnostic records
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("system_diagnostics")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ status: "✅ ok", records: data });
  } catch (err: any) {
    console.error("❌ Diagnostics/latest error:", err.message);
    return NextResponse.json(
      { status: "❌ error", error: err.message },
      { status: 500 }
    );
  }
}
