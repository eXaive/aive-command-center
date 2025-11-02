// /lib/tech.ts
export type SeriesPoint = { date: string; close: number };

export function sma(values: number[], len: number): number[] {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= len) sum -= values[i - len];
    out.push(i >= len - 1 ? sum / len : NaN);
  }
  return out;
}

export function rsi(values: number[], len = 14): number[] {
  if (values.length < len + 1) return Array(values.length).fill(NaN);
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const ch = values[i] - values[i - 1];
    gains.push(Math.max(0, ch));
    losses.push(Math.max(0, -ch));
  }
  const avgG = sma(gains, len);
  const avgL = sma(losses, len);
  const rsiArr: number[] = Array(len).fill(NaN);
  for (let i = len - 1; i < avgG.length; i++) {
    const g = avgG[i];
    const l = avgL[i];
    const rs = !l ? 100 : g / l;
    const r = 100 - 100 / (1 + rs);
    rsiArr.push(r);
  }
  return rsiArr;
}

/** Return a simple -3 .. +3 technical score using MA cross, RSI, and short slope. */
export function technicalScore(series: SeriesPoint[]): { score: number; fields: Record<string, number> } {
  if (!series.length) return { score: 0, fields: {} };
  const closes = series.map((p) => p.close);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const rsi14 = rsi(closes, 14);

  const last = closes.length - 1;
  const s20 = sma20[last];
  const s50 = sma50[last];
  const rsiV = rsi14[last];

  // MA cross: +1 if uptrend, -1 if down
  const ma = isFinite(s20) && isFinite(s50) ? (s20 > s50 ? 1 : s20 < s50 ? -1 : 0) : 0;

  // RSI: map 30..70 to -1..+1, clamp
  let rsiAdj = 0;
  if (isFinite(rsiV)) {
    rsiAdj = Math.max(-1, Math.min(1, (rsiV - 50) / 25));
  }

  // Slope over last 10 days
  let slope = 0;
  const look = 10;
  if (closes.length > look) {
    const a = closes[closes.length - 1];
    const b = closes[closes.length - 1 - look];
    slope = a > b ? 0.5 : a < b ? -0.5 : 0;
  }

  // Combine to -3..+3
  const score = (ma * 1.5 + rsiAdj * 1.0 + slope * 1.0);
  return { score, fields: { ma, rsiAdj, slope } };
}
