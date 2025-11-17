// /lib/color.ts
// A.I.V.E. Neural Color Engine
// Converts polarity (-1..1) into a blended RGB color.

export function lerpColor(polarity: number): string {
  // Clamp polarity to -1..1
  const t = Math.max(-1, Math.min(1, polarity));

  // Normalize to 0..1 blend factor
  const blend = (t + 1) / 2;

  // Red (negative) → Blue (positive)
  const NEG = [229, 83, 83];   // 🔴 danger / negative polarity
  const POS = [53, 84, 244];   // 🔵 positive / clarity

  // Linear interpolation of RGB channels
  const mixed = NEG.map((n, i) =>
    Math.round(n + (POS[i] - n) * blend)
  );

  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}
