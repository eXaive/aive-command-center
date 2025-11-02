import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use server key
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { headline, summary, region, sentiment_level, impact_score } = body;

  // 🧠 Ask AI for verification
  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an intelligence verification model assessing geopolitical and financial intel.",
      },
      {
        role: "user",
        content: `Intel:\nHeadline: ${headline}\nSummary: ${summary}\nRegion: ${region}\nSentiment: ${sentiment_level}\nImpact: ${impact_score}\n\nRate credibility (0-100) and classify risk level (Public, Restricted, or Containment).`,
      },
    ],
  });

  const aiText = aiResponse.choices[0].message?.content || "";
  const confidence = parseInt(aiText.match(/\d+/)?.[0] || "60", 10);

  let access: "Public" | "Restricted" | "Containment" = "Public";
  if (confidence < 40) access = "Containment";
  else if (confidence < 70) access = "Restricted";

  const reason = aiText.slice(0, 200);

  // 💾 Save to Supabase
  await supabase.from("intel_feed").insert([
    {
      headline,
      summary,
      region,
      sentiment_level,
      impact_score,
      confidence_score: confidence,
      access_level: access,
      containment_reason: reason,
    },
  ]);

  return NextResponse.json({ confidence, access, reason });
}
