// /pages/api/predict.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Simple price-only prediction:
 * - Pulls close series from your /api/series
 * - Computes EMA(5), EMA(20), recent slope, vol
 * - Projects a tiny drift to target dayOffset
 * - Maps to bullish probability via sigmoid
 *
 * Query:
 *   ?asset=GOLD&symbol=GC=F&dayOffset=14
 *
 * Response:
 *   {
 *     asset, symbol, asOf, dayOffset,
 *     bullishProb: 0.63,
 *     bearishProb: 0.37,
 *     signal: "BULLISH"|"BEARISH"|"NEUTRAL",
 *     features: {...}
 *   }
 */

type SeriesPoint = { date: string; close: number };
type SeriesPayload = {
  symbol: string;
  lastClose: number | null;
  series: SeriesPoint[];
  source: string;
};

function ema(values: number[], period: number) {
  if (values.length === 0) return 0;
  const k = 2 / (period + 1);
  let e = values[0];
  for (let i = 1; i < values.length; i++) e = values[i] * k + e * (1 - k);
  return e;
}

function stdev(arr: number[]) {
  if (arr.length < 2) return 1e-6;
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  const v = arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(v) || 1e-6;
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function linregSlope(y: number[]) {
  // simple slope of y against x = 0..n-1
  const n = y.length;
  if (n < 2) return 0;
  const meanX = (n - 1) / 2;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    const dx = i - meanX;
    num += dx * (y[i] - meanY);
    den += dx * dx;
  }
  return den ? num / den : 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const asset = String(req.query.asset || "GOLD").toUpperCase();
    const symbol = String(req.query.symbol || "");
    const dayOffset = Math.max(0, Math.min(90, Number(req.query.dayOffset ?? 0)));

    // Build origin for internal call (dev/prod safe)
    const host = req.headers.host || "localhost:3000";
    const origin = host.startsWith("http") ? host : `http://${host}`;

    // Pull recent series (close prices)
    const url = `${origin}/api/series?asset=${encodeURIComponent(asset)}${
      symbol ? `&symbol=${encodeURIComponent(symbol)}` : ""
    }`;
    const r = await fetch(url);
    if (!r.ok) {
      const t = await r.text();
      throw new Error(t || `series fetch failed ${r.status}`);
    }
    const data = (await r.json()) as SeriesPayload;
    const rows = data.series || [];
    if (!rows.length) {
      return res.status(200).json({
        asset,
        symbol: data.symbol || symbol || null,
        asOf: new Date().toISOString(),
        dayOffset,
        bullishProb: 0.5,
        bearishProb: 0.5,
        signal: "NEUTRAL",
        reason: "no series",
      });
    }

    // Use last up to 120 closes
    const closes = rows.map((p) => Number(p.close)).filter(Number.isFinite);
    const lastClose = closes[closes.length - 1];

    // Daily returns for vol
    const rets: number[] = [];
    for (let i = 1; i < closes.length; i++) {
      const r = (closes[i] - closes[i - 1]) / (closes[i - 1] || 1);
      rets.push(r);
    }
    const vol = stdev(rets.slice(-60)); // 60d realized vol approx

    // Momentum edge
    const fast = ema(closes.slice(-120), 5);
    const slow = ema(closes.slice(-120), 20);
    const edge = (fast - slow) / (Math.abs(slow) || 1e-6);

    // Recent slope (linear regression over last ~30 closes)
    const slope = linregSlope(closes.slice(-30));
    // Projected fractional drift to target date
    const drift = slope / Math.max(lastClose, 1e-6) * dayOffset;

    // Normalize by vol to get "signal strength"
    const strength = (edge + drift) / (vol * Math.sqrt(Math.max(dayOffset, 1)));
    // Map to probability with a tempered sigmoid (temperature 1.25)
    const temp = 1.25;
    const bullProb = sigmoid(strength / temp);
    const bullishProb = Math.max(0, Math.min(1, bullProb));
    const bearishProb = 1 - bullishProb;

    const signal =
      bullishProb > 0.6 ? "BULLISH" : bearishProb > 0.6 ? "BEARISH" : "NEUTRAL";

    res.status(200).json({
      asset,
      symbol: data.symbol || symbol || null,
      asOf: new Date().toISOString(),
      dayOffset,
      bullishProb: Number(bullishProb.toFixed(3)),
      bearishProb: Number(bearishProb.toFixed(3)),
      signal,
      features: {
        lastClose,
        fastEMA: fast,
        slowEMA: slow,
        edge,
        slope,
        vol,
        drift,
        strength,
      },
      note:
        "Prototype price-only model. Next: blend in news tone, macro calendar, and flows for better accuracy.",
    });
  } catch (e: any) {
    res.status(200).json({
      error: e?.message || "predict failed",
      asset: String(req.query.asset || "GOLD").toUpperCase(),
      asOf: new Date().toISOString(),
    });
  }
}
