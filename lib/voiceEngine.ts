// lib/voiceEngine.ts

export async function generateSpeech(text: string, voiceId: string) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error("Missing ELEVENLABS_API_KEY");
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2", // BEST quality
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true
      }
    })
  });

  if (!res.ok) {
    throw new Error(`ElevenLabs Error: ${res.status}`);
  }

  const audioBuffer = await res.arrayBuffer();
  return Buffer.from(audioBuffer);
}
