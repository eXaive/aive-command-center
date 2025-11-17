export function speakKallixis(text: string, mode: "calm" | "crisis" = "calm") {
  // Two styles, same 11Labs voice
  const styledText =
    mode === "calm"
      ? `(${text})` // smoother, slower prompts
      : `[!!!] ${text.toUpperCase()}`; // strong, urgent prompts

  const audio = new Audio(
    `/api/kallixis?message=${encodeURIComponent(styledText)}`
  );
  audio.volume = mode === "crisis" ? 1.0 : 0.75;
  audio.play().catch(() => {});
}
