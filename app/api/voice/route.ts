// app/api/voice/route.ts

import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/voiceEngine";

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text || !voiceId) {
      return NextResponse.json({ error: "Missing text or voiceId" }, { status: 400 });
    }

    const audio = await generateSpeech(text, voiceId);

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg"
      }
    });
  } catch (err: any) {
    console.error("VOICE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
