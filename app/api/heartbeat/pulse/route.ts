import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false, // REQUIRED for service role in server routes
      },
    }
  );

  try {
    // ensure table exists
    const { error: tableError } = await supabase
      .from("heartbeat_logs")
      .select("id")
      .limit(1);

    if (tableError?.message?.includes("does not exist")) {
      return NextResponse.json(
        { error: "❌ Table 'heartbeat_logs' does not exist" },
        { status: 500 }
      );
    }

    // Insert heartbeat
    const { data, error } = await supabase
      .from("heartbeat_logs")
      .insert([
        {
          status: "✅ Pulse recorded",
          entries_inserted: Math.floor(Math.random() * 100),
          system_message: "A.I.V.E. self-heartbeat executed successfully",
          data: {
            source: "server-heartbeat",
            timestamp: new Date().toISOString(),
          },
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({
      status: "✅ Heartbeat pulse logged",
      created_at: data?.[0]?.created_at ?? new Date().toISOString(),
      record: data?.[0] ?? null,
    });
  } catch (err: any) {
    console.error("💔 Heartbeat pulse error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to log heartbeat" },
      { status: 500 }
    );
  }
}
