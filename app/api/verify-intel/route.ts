import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// === Supabase + OpenAI setup ===
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role for write access
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// === POST /api/verify-intel ===
export async function POST(req: Request) {
  try {
    const { id, headline, summary, region } = await req.json();

    if (!headline || !summary || !id) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // === Prompt for A.I.V.E. ===
    const prompt = `
You are A.I.V.E. — the Artificial Intelligence Verification Engine.
Your task is to analyze intelligence reports for truth likelihood and consistency.

Provide:
1️⃣ Confidence score (0–100)
2️⃣ Risk flag: "Verified", "Unclear", or "Contradictory"
3️⃣ A one-sentence verdict.

Intel:
Headline: ${headline}
Summary: ${summary}
Region: ${region}
`;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const result = ai.choices[0].message?.content || "No response.";
    const matchScore = result.match(/\d{1,3}/);
    const score = matchScore ? Math.min(parseInt(matchScore[0]), 100) : 50;
    const flag = /Verified/i.test(result)
      ? "Verified"
      : /Contradictory/i.test(result)
      ? "Contradictory"
      : "Unclear";

    // === Write back to Supabase ===
    const { error: updateError } = await supabase
      .from("intel_feed")
      .update({
        ai_confidence_score: score,
        ai_verdict: result,
        ai_risk_flag: flag,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, score, flag, result });
  } catch (err: any) {
    console.error("A.I.V.E. error:", err);
    return NextResponse.json(
      { error: err.message || "Verification failed." },
      { status: 500 }
    );
  }
}
