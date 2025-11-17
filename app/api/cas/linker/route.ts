import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // needs RLS bypass for embeddings
);

export async function POST(req: Request) {
  try {
    const { cas_id } = await req.json();

    // 1. Load CAS entry
    const { data: cas, error: casErr } = await supabase
      .from("cas_memory")
      .select("*")
      .eq("id", cas_id)
      .single();

    if (casErr || !cas)
      return NextResponse.json({ error: "CAS entry not found." }, { status: 400 });

    // 2. Create embedding for cause text
    const embedResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: cas.cause
    });

    const embedding = embedResponse.data[0].embedding;

    // 3. Store embedding in cas_memory
    await supabase
      .from("cas_memory")
      .update({ cause_embedding: embedding })
      .eq("id", cas.id);

    // 4. Find similar past causes using vector cosine similarity
    const { data: matches } = await supabase.rpc("match_causal_memories", {
      query_embedding: embedding,
      match_threshold: 0.70,      // can adjust
      match_count: 5
    });

    if (!matches || matches.length === 0) {
      return NextResponse.json({ message: "No similar causes found." });
    }

    // 5. Insert link to strongest match
    const best = matches[0];

    await supabase.from("cas_links").insert({
      source_prediction_id: cas.prediction_id,
      country: cas.country,
      category: cas.category,
      cause: cas.cause,
      effect: cas.effect,
      similarity_score: best.similarity,
      matched_memory_id: best.id,
      matched_cause: best.cause,
      matched_effect: best.effect
    });

    return NextResponse.json({
      status: "ok",
      matched: best
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
