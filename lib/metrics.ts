// /lib/metrics.ts
// 🧠 A.I.V.E. — Influence Metrics Engine
// Computes the Net Influence Index (NII) for a given set of causal influences.

import { Influence } from "@/types";

/**
 * Influence:
 * {
 *   polarity: number;  // -1 to +1
 *   strength: number;  // 0..1
 * }
 */

/**
 * Compute A.I.V.E.'s unified Net Influence Index (NII)
 * --------------------------------------------------
 * Weighted by strength.
 * Returns:
 *   - nii: Influence score scaled -100 to +100
 *   - confidence: 0..1 expressing data density/quality
 */
export function netInfluenceIndex(infs: Influence[]) {
  if (!Array.isArray(infs) || infs.length === 0) {
    return { nii: 0, confidence: 0 };
  }

  const weighted = infs.map((i) => {
    const strength = i.strength ?? 0.5;
    const polarity = i.polarity ?? 0;

    return {
      num: polarity * strength,
      den: strength,
    };
  });

  const num = weighted.reduce((a, b) => a + b.num, 0);
  const den = weighted.reduce((a, b) => a + b.den, 0) || 1e-9;

  // -1..+1 → -100..+100
  const nii = 100 * (num / den);

  // Confidence rises with more data and stronger signals
  const confidence = Math.min(1, den / infs.length);

  return { nii, confidence };
}
