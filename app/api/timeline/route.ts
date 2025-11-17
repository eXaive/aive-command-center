import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ server-side only
);

/**
 * 🧠 A.I.V.E. Predictive Timeline API
 * -----------------------------------
 * Groups predictions by temporal state:
 * - past (before today)
 * - today (today)
 * - future (within X days)
 * - verified (correct predictions from past)
 *
 * Automatically updates as data evolves.
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days")) || 1; // default = tomorrow
    const now = new Date();
    const today = new Date(now.toISOString().split("T")[0]);
    const futureLimit = new Date(today);
    futureLimit.setDate(futureLimit.getDate() + days);

    // Fetch all predictions within relevant window
    const { data: predictions, error } = await supabase
      .from("predictions")
      .select(
        `
        id,
        category,
        region,
        predicted_for_date,
        confidence,
        rolling_7d_accuracy,
        trend_direction,
        outcome_status
      `
      )
      .order("predicted_for_date", { ascending: true });

    if (error) throw error;
    if (!predictions || predictions.length === 0) {
      return NextResponse.json({
        past: [],
        today: [],
        future: [],
        verified: [],
      });
    }

    // Separate into temporal groups
    const past: any[] = [];
    const todayList: any[] = [];
    const future: any[] = [];
    const verified: any[] = [];

    predictions.forEach((p) => {
      const date = new Date(p.predicted_for_date);
      const diff = date.getTime() - today.getTime();
      const daysAhead = diff / (1000 * 60 * 60 * 24);

      if (p.outcome_status === "correct") {
        verified.push(p);
      }

      if (date < today) past.push({ ...p, temporal_state: "past" });
      else if (date.toDateString() === today.toDateString())
        todayList.push({ ...p, temporal_state: "today" });
      else if (date <= futureLimit)
        future.push({ ...p, temporal_state: "future" });
    });

    // Response structure for TimelinePanel
    return NextResponse.json({
      past,
      today: todayList,
      future,
      verified,
    });
  } catch (err: any) {
    console.error("❌ Timeline API Error:", err.message);
    return NextResponse.json(
      { error: err.message, past: [], today: [], future: [], verified: [] },
      { status: 500 }
    );
  }
}
