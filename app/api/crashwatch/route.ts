import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

// Temporary mock until real data exists
const mockCountries = [
  { code: "US", name: "United States", score: 82 },
  { code: "CN", name: "China", score: 65 },
  { code: "DE", name: "Germany", score: 58 },
  { code: "NG", name: "Nigeria", score: 92 },
  { code: "JP", name: "Japan", score: 40 },
  { code: "BR", name: "Brazil", score: 76 },
  { code: "IN", name: "India", score: 71 },
];

export async function GET() {
  try {
    // Example: if you later add a Supabase table
    // const { data, error } = await supabase.from("crash_watch").select("*");
    // if (error) throw error;
    // return NextResponse.json({ items: data });

    return NextResponse.json({ items: mockCountries });
  } catch (err: any) {
    console.error("CrashWatch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
