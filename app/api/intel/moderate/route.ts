import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { id, access_level, containment_reason } = await req.json();

    if (!id || !access_level) {
      return new NextResponse("Missing id or access_level", { status: 400 });
    }
    if (!["Public", "Restricted", "Containment"].includes(access_level)) {
      return new NextResponse("Invalid access_level", { status: 400 });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!SUPABASE_URL || !SERVICE_KEY) {
      return new NextResponse("Server keys not configured", { status: 500 });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { error } = await admin
      .from("intel_feed")
      .update({
        access_level,
        containment_reason: containment_reason ?? null,
      })
      .eq("id", id);

    if (error) {
      return new NextResponse("Supabase error: " + error.message, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return new NextResponse("Error: " + err.message, { status: 500 });
  }
}
