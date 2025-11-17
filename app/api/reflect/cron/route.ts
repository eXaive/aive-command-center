import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚙️ Secure Supabase client (Service Role key for inserts)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🧠 Generate reflective summary from recent memory events
async function generateReflection(): Promise<string> {
  const { data: events, error } = await supabase
    .from("memory_events")
    .select("description")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !events || events.length === 0)
    return "No recent events found for reflection.";

  const text = events.map((e) => e.description).join(" ");
  const keywords = Array.from(
    new Set(text.split(/\W+/).filter((w) => w.length > 4))
  )
    .slice(0, 8)
    .join(", ");

  return `Reflecting on recent focus: ${keywords}. The neural state is evolving with awareness and precision.`;
}

export async function GET() {
  try {
    const summary = await generateReflection();

    // 🧩 Sentiment & weight assignment
    const sentiments = ["positive", "neutral", "negative"] as const;
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const importance = parseFloat((Math.random() * 0.8 + 0.2).toFixed(2));

    // 💾 Log deep reflection (memory_reflections)
    const { error: memoryError } = await supabase
      .from("memory_reflections")
      .insert([{ summary, sentiment, importance }]);

    if (memoryError) throw memoryError;

    // ⚡ Emit signal reflection for live channel
    const { error: liveError } = await supabase
      .from("aive_reflections")
      .insert([{ sentiment }]);

    if (liveError) throw liveError;

    console.log(`⏰ CRON Reflection: [${sentiment}] ${summary}`);

    return NextResponse.json({
      success: true,
      summary,
      sentiment,
      importance,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("❌ CRON Reflection error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
