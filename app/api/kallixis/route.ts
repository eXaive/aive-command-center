import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const message = searchParams.get("message") || "hello";

  const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/cPoqAvGWCPfCfyPMwe4z", {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: message,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.7,
      }
    }),
  });

  const audioBuffer = await res.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}
