// /pages/api/series.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { mapAssetToSymbol } from "@/lib/symbols";
import { readCache, writeCache } from "@/lib/cache";

type SeriesPoint = { date: string; close: number };
type SeriesPayload = {
  symbol: string;
  asset?: string;
  lastClose: number | null;
  series: SeriesPoint[];
  source: "yahoo-finance2" | "synthetic" | "cache";
};

const TTL_SECONDS = 15 * 60; // 15 min

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const asset = String(req.query.asset || "").toUpperCase();
  const qSym = String(req.query.symbol || "").toUpperCase();
  const symbol = qSym || mapAssetToSymbol(asset) || "SPY";

  const cacheKey = `yf:${symbol}`;
  const cached = await readCache<SeriesPayload>(cacheKey);
  if (cached) {
    res.status(200).json({ ...cached, source: "cache" as const });
    return;
  }

  // Try yahoo-finance2 (ESM)
  try {
    const mod = (await import("yahoo-finance2").catch(() => null)) as any;
    const yf = mod?.default;
    if (yf) {
      const to = new Date();
      const from = new Date(to.getTime() - 365 * 24 * 3600 * 1000);
      const rows = await yf.historical(symbol, {
        period1: from.toISOString().slice(0, 10),
        period2: to.toISOString().slice(0, 10),
      });

      const series: SeriesPoint[] = (rows || [])
        .filter((r: any) => r?.date && Number.isFinite(r?.close))
        .map((r: any) => ({
          date: new Date(r.date).toISOString().slice(0, 10),
          close: Number(r.close),
        }));

      const payload: SeriesPayload = {
        symbol,
        asset: asset || undefined,
        lastClose: series.length ? series[series.length - 1].close : null,
        series,
        source: "yahoo-finance2",
      };
      await writeCache(cacheKey, payload, TTL_SECONDS);
      res.status(200).json(payload);
      return;
    }
  } catch {
    // fall through
  }

  // Synthetic fallback
  const series: SeriesPoint[] = [];
  const today = new Date();
  let base = 100;
  for (let i = 180; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      base *= 1 + (Math.random() - 0.5) * 0.01 + Math.sin(i / 12) * 0.001;
      series.push({ date: d.toISOString().slice(0, 10), close: Number(base.toFixed(2)) });
    }
  }
  const payload: SeriesPayload = {
    symbol,
    asset: asset || undefined,
    lastClose: series.length ? series[series.length - 1].close : null,
    series,
    source: "synthetic",
  };
  await writeCache(cacheKey, payload, TTL_SECONDS);
  res.status(200).json(payload);
}
