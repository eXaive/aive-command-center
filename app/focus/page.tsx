"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mapAssetToSymbol } from "@/lib/symbols";
import NewsPanel, { NewsItem } from "@/components/NewsPanel";

/* ---------- Chart Component (inline price trend) ---------- */
type SeriesPoint = { date: string; close: number };

function LineChart({ rows }: { rows: SeriesPoint[] }) {
  if (!rows?.length) {
    return (
      <div className="w-full h-[160px] grid place-items-center text-xs text-slate-500 bg-white rounded border">
        No price data
      </div>
    );
  }

  const w = 520, h = 180, pad = 16;
  const values = rows.map((r) => r.close);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(rows.length - 1, 1);
  const y = (v: number) => (max > min ? h - pad - ((v - min) * (h - 2 * pad)) / (max - min) : h / 2);
  const path = rows.map((r, i) => `${i ? "L" : "M"} ${x(i)} ${y(r.close)}`).join(" ");

  return (
    <svg width={w} height={h} className="w-full h-[180px]">
      <rect x={0} y={0} width={w} height={h} fill="white" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth={2} />
      <circle cx={x(0)} cy={y(values[0])} r={2.5} fill="#94a3b8" />
      <circle cx={x(rows.length - 1)} cy={y(values[values.length - 1])} r={3} fill="#0f172a" />
    </svg>
  );
}

/* ---------- Sentiment Gauge ---------- */
function SentimentGauge({ avg }: { avg: number }) {
  const label = avg > 0.3 ? "Bullish" : avg < -0.3 ? "Bearish" : "Neutral";
  const color = avg > 0.3 ? "#22c55e" : avg < -0.3 ? "#ef4444" : "#9ca3af";
  const intensity = Math.abs(avg) * 100;

  return (
    <div className="w-full border rounded-lg p-4 bg-white flex flex-col items-center justify-center text-center shadow-sm">
      <div className="text-xs uppercase text-slate-500 mb-1">Current Market Sentiment</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {label}
      </div>
      <div className="w-full mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${intensity}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="text-[11px] text-slate-500 mt-1">
        Average Score: {avg.toFixed(2)}
      </div>
    </div>
  );
}

/* ---------- NEW: Sentiment Trend Chart ---------- */
function SentimentTrendChart({ data }: { data: { date: string; avg: number }[] }) {
  if (!data?.length) {
    return (
      <div className="w-full h-[160px] grid place-items-center text-xs text-slate-500 bg-white rounded border">
        No sentiment history
      </div>
    );
  }

  const w = 520, h = 180, pad = 20;
  const min = Math.min(...data.map((d) => d.avg));
  const max = Math.max(...data.map((d) => d.avg));
  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(data.length - 1, 1);
  const y = (v: number) => h / 2 - v * (h / 2 - pad); // center baseline

  const path = data.map((d, i) => `${i ? "L" : "M"} ${x(i)} ${y(d.avg)}`).join(" ");
  const fillColor = "url(#grad)";

  return (
    <svg width={w} height={h} className="w-full h-[180px]">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={w} height={h} fill="white" />
      <path d={path} fill="none" stroke={fillColor} strokeWidth={2.5} />
      <line x1={0} x2={w} y1={h / 2} y2={h / 2} stroke="#e2e8f0" strokeDasharray="4 2" />
      <text x={w - pad} y={pad + 10} fontSize="10" fill="#22c55e">Bullish</text>
      <text x={w - pad} y={h - pad} fontSize="10" fill="#ef4444">Bearish</text>
    </svg>
  );
}

/* ---------- Focus Page ---------- */
export default function FocusPage() {
  const params = useSearchParams();
  const asset = (params.get("asset") || "GOLD").toUpperCase();
  const symbol = mapAssetToSymbol(asset);

  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [avgSentiment, setAvgSentiment] = useState(0);
  const [sentimentHistory, setSentimentHistory] = useState<{ date: string; avg: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [seriesRes, newsRes] = await Promise.all([
          fetch(`/api/series?symbol=${symbol}`),
          fetch(`/api/news?asset=${asset}&limit=20`),
        ]);

        const sJson = await seriesRes.json();
        const nJson = await newsRes.json();

        setSeries(sJson.series || []);
        const items: NewsItem[] = nJson.items || [];
        setNews(items);

        // Calculate current average sentiment
        const scores = items.map((x) => x.sentiment || 0);
        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        setAvgSentiment(avg);

        // Build fake 7-day sentiment memory (simulated history)
        const hist: { date: string; avg: number }[] = [];
        for (let i = 6; i >= 0; i--) {
          const day = new Date();
          day.setDate(day.getDate() - i);
          // Small variance simulation (you can later replace with a real DB)
          const noise = (Math.random() - 0.5) * 0.3;
          hist.push({ date: day.toISOString().slice(0, 10), avg: Math.max(-1, Math.min(1, avg + noise)) });
        }
        setSentimentHistory(hist);
      } catch (err) {
        console.error("FOCUS PAGE ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [asset, symbol]);

  if (loading)
    return (
      <main className="min-h-screen grid place-items-center text-slate-500">
        Loading {asset} analysis...
      </main>
    );

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">{asset} Focus Analysis</h1>

        {/* Sentiment Gauge */}
        <SentimentGauge avg={avgSentiment} />

        {/* NEW: Sentiment Trend over last 7 days */}
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-700 mb-2">7-Day Sentiment Trend</div>
          <SentimentTrendChart data={sentimentHistory} />
        </div>

        {/* Price Chart */}
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-700 mb-2">Recent Price Trend ({symbol})</div>
          <LineChart rows={series} />
        </div>

        {/* News Panel */}
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-semibold text-slate-700 mb-3">News Sentiment Feed</div>
          <NewsPanel asset={asset} />
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-500 italic mt-4">
          This information is for educational purposes only and should not be construed as financial advice.
        </p>
      </div>
    </main>
  );
}
