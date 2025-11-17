// /lib/tech.ts
// Professional-grade technical calculations for A.I.V.E.
// Includes: SMA, RSI (Wilder), and unified technical score model.

export type SeriesPoint = { date: string; close: number };

/* ============================================================
   SIMPLE MOVING AVERAGE (SMA)
============================================================ */
export function sma(values: number[], len: number): number[] {
  if (!values.length || len <= 0) return Array(values.length).fill(NaN);

  const out = Array(values.length).fill(NaN);
  let sum = 0;

  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= len) sum -= values[i - len];
    if (i >= len - 1) out[i] = sum / len;
  }

  return out;
}

/* ============================================================
   TRUE RSI (WILDER'S SMOOTHED RSI)
   Significantly more accurate than SMA-based RSI.
============================================================ */
export function rsi(values: number[], len = 14): number[] {
  const out = Array(values.length).fill(NaN);
  if (values.length <= len) return out;

  const gains: number[] = [];
  const losses: number[] = [];

  // Build change vectors
  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains.push(Math.max(diff, 0));
    losses.push(Math.max(-diff, 0));
  }

  // Initial average gain/loss (simple average)
  let avgGain = gains.slice(0, len).reduce((a, b) => a + b, 0) / len;
  let avgLoss = losses.slice(0, len).reduce((a, b) => a + b, 0) / len;

  // First actual RSI index
  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  out[len] = 100 - 100 / (1 + rs);

  // Wilder smoothing for the rest
  for (let i = len + 1; i < values.length; i++) {
    const gain = gains[i - 1];
    const loss = losses[i - 1];

    avgGain = (avgGain * (len - 1) + gain) / len;
    avgLoss = (avgLoss * (len - 1) + loss) / len;

    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    out[i] = 100 - 100 / (1 + rs);
  }

  return out;
}

/* ============================================================
   A.I.V.E. TECHNICAL SCORE (final score -3 .. +3)
   Based on:
   - MA20 vs MA50 (trend direction)
   - RSI14 position (momentum)
   - Short slope (10-day)
============================================================ */
export function technicalScore(
  series: SeriesPoint[]
): { score: number; fields: Record<string, number> } {
  if (!series.length) return { score: 0, fields: { ma: 0, rsiAdj: 0, slope: 0 } };

  const closes = series.map((p) => p.close);

  const ma20 = sma(closes, 20);
  const ma50 = sma(closes, 50);
  const rsi14 = rsi(closes, 14);

  const last = closes.length - 1;

  const s20 = ma20[last];
  const s50 = ma50[last];
  const rsiV = rsi14[last];

  /* -----------------------------
     MA Trend Score
  ----------------------------- */
  let ma = 0;
  if (isFinite(s20) && isFinite(s50)) {
    if (s20 > s50) ma = 1;
    else if (s20 < s50) ma = -1;
  }

  /* -----------------------------
     RSI Adjustment Score
     Maps 30 → -1, 50 → 0, 70 → +1
  ----------------------------- */
  let rsiAdj = 0;
  if (isFinite(rsiV)) {
    rsiAdj = Math.max(-1, Math.min(1, (rsiV - 50) / 20));
  }

  /* -----------------------------
     Slope Score (last 10 days)
     Positive = bullish, negative = bearish
  ----------------------------- */
  let slope = 0;
  const look = 10;
  if (closes.length > look) {
    const a = closes[last];
    const b = closes[last - look];
    slope = a > b ? 0.5 : a < b ? -0.5 : 0;
  }

  /* -----------------------------
     Final A.I.V.E. Technical Score
     Range: -3.0 to +3.0
  ----------------------------- */
  const score = ma * 1.5 + rsiAdj * 1.0 + slope * 1.0;

  return {
    score,
    fields: {
      ma,
      rsiAdj,
      slope,
    },
  };
}
