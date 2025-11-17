export async function playVoiceLine(text: string, voiceId: string) {
  const res = await fetch("/api/voice", {
    method: "POST",
    body: JSON.stringify({ text, voiceId })
  });

  const audioBlob = await res.blob();
  const url = URL.createObjectURL(audioBlob);

  const audio = new Audio(url);
  audio.volume = 1.0;
  audio.play();
}
