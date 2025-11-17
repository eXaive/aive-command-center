import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Fetch most recent heartbeat(s)
    const { data, error } = await supabase
      .from("heartbeat_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    // 🔍 If multiple records, return them all in a proper object
    if (Array.isArray(data)) {
      return NextResponse.json({
        status: "✅ Heartbeat retrieved",
        record_count: data.length,
        records: data,
        created_at: data[0]?.created_at ?? null,
      });
    }

    // 🔹 Otherwise return a single entry
    return NextResponse.json({
      status: "✅ Heartbeat OK",
      record: data,
      created_at: data?.created_at ?? null,
    });
  } catch (err: any) {
    console.error("💔 Heartbeat API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch heartbeat" },
      { status: 500 }
    );
  }
}
