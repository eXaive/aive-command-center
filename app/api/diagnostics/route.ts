import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 🧠 A.I.V.E. Diagnostics API
// Receives memory/runtime stats from the DiagnosticsLogger and stores them.

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ service role for write access
    );

    const { memory_used_mb, memory_total_mb, usage_percent, uptime_min } = body;

    const { error } = await supabase.from("system_diagnostics").insert([
      {
        memory_used_mb,
        memory_total_mb,
        usage_percent,
        uptime_min,
        recorded_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ status: "✅ Diagnostics logged" });
  } catch (err: any) {
    console.error("❌ Diagnostics logging error:", err.message);
    return NextResponse.json(
      { status: "❌ Failed", error: err.message || "Unknown" },
      { status: 500 }
    );
  }
}
