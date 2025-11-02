"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import NewsCard, { type NewsItem } from "@/components/NewsCard";

const TOPIC_META: Record<string, { title: string; q?: string }> = {
  geopolitics: { title: "Geopolitics", q: "geopolitics" },
  energy: { title: "Energy", q: "energy oil OPEC" },
  "tech-ai": { title: "Technology & AI", q: "technology AI chips" },
  climate: { title: "Climate", q: "climate emissions carbon" },
  elections: { title: "Elections", q: "election politics vote" },
  "btc-flows": { title: "BTC Flows", q: "bitcoin flow ETF" },
  "supply-chains": { title: "Supply Chains", q: "supply chain shipping" },
  deglobalization: { title: "Globalization/Deglobalization", q: "deglobalization trade" },
  demographics: { title: "Demographics", q: "population aging immigration" },
  housing: { title: "Housing", q: "housing mortgage" },
  regulation: { title: "Regulation", q: "regulation policy" },
  "fx-dollar": { title: "FX & Dollar", q: "DXY dollar FX" },
  rates: { title: "Central Bank Rates / FOMC", q: "FOMC interest rates yields" },
  liquidity: { title: "Liquidity", q: "liquidity market plumbing" },
  credit: { title: "Credit", q: "credit spreads HY IG" },
  gdp: { title: "GDP / Growth", q: "GDP growth PMI" },
  sentiment: { title: "Sentiment", q: "market sentiment fear greed" },
  dxy: { title: "DXY", q: "US dollar DXY" },
  cpi: { title: "CPI / Inflation", q: "CPI inflation PCE" },
  payrolls: { title: "Payrolls / Jobs", q: "payrolls nfp unemployment" },
  inflation: { title: "Inflation (General)", q: "inflation prices" },
  oil: { title: "Oil", q: "oil crude brent wti" },
  "news-tone": { title: "News Tone", q: "markets news" },
  equities: { title: "Equities", q: "stocks equities" },
  volatility: { title: "Volatility / Crash Watch", q: "volatility VIX crash" },
  positioning: { title: "Positioning", q: "CTAs hedge funds positioning" },
};

type SparkProps = { values: number[] };
function Sparkline({ values }: SparkProps) {
  if (!values.length) return null;
  const w = 220, h = 52, pad = 6;
  const min = Math.min(...values, 0), max = Math.max(...values, 0);
  const rng = max - min || 1;

  const d = values.map((v, i) => {
    const x = pad + (i * (w - 2 * pad)) / Math.max(values.length - 1, 1);
    const y = h - pad - ((v - min) * (h - 2 * pad)) / rng;
    return `${i ? "L" : "M"}${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="text-blue-600">
      <rect x={0} y={0} width={w} height={h} fill="white" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const search = useSearchParams();

  const slug = params.slug;
  const meta = TOPIC_META[slug] || { title: slug };
  const asset = (search.get("asset") || "GOLD").toUpperCase();
  const region = (search.get("region") || "ALL").toUpperCase();
  const dateISO = search.get("date") || new Date().toISOString().slice(0, 10);

  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>(meta.q || "");

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    const qs = new URLSearchParams();
    qs.set("asset", asset);
    if (filter) qs.set("q", filter);

    fetch(`/api/news?${qs.toString()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => { if (alive) setItems((data.items || []) as NewsItem[]); })
      .catch((e) => alive && setErr(e?.message || "Failed to load"))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [asset, filter]);

  const stats = React.useMemo(() => {
    if (!items.length) return { avg: 0, min: 0, max: 0, series: [] as number[] };
    const vals = items.map((i) => Number(i.sentiment || 0));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { avg, min: Math.min(...vals), max: Math.max(...vals), series: vals.slice(0, 30).reverse() };
  }, [items]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">
              <button onClick={() => router.push(`/?asset=${encodeURIComponent(asset)}`)}
                      className="underline underline-offset-2 hover:text-slate-700">
                ← Home
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{meta.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 rounded-md bg-slate-900 text-white text-sm font-semibold">{asset}</span>
              <span className="px-2 py-1 rounded-md border text-sm text-slate-700">Region: {region}</span>
              <span className="px-2 py-1 rounded-md border text-sm text-slate-700">Date: {dateISO}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                router.push(`/focus?asset=${encodeURIComponent(asset)}&topic=${encodeURIComponent(slug)}`)
              }
              className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 text-sm"
            >
              Breakdown
            </button>
            <a
              href={`/api/brief/topic?topic=${encodeURIComponent(slug)}&asset=${encodeURIComponent(asset)}&date=${encodeURIComponent(dateISO)}`}
              className="px-3 py-2 rounded-md border bg-white hover:bg-slate-50 text-sm"
              title="Download PDF summary"
            >
              Summary (PDF)
            </a>
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-white p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="text-sm text-slate-700">Filter:</div>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="keywords (e.g., inflation OPEC chip)"
                className="px-3 py-1.5 rounded-md border text-sm"
                style={{ minWidth: 260 }}
              />
              <button
                onClick={() => setFilter(meta.q || "")}
                className="px-2 py-1 rounded-md border text-sm hover:bg-slate-50"
                title="Reset to default"
              >
                Reset
              </button>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="text-xs text-slate-500">
                Avg: <b>{stats.avg.toFixed(2)}</b> • Min: {stats.min.toFixed(2)} • Max: {stats.max.toFixed(2)}
              </div>
              <Sparkline values={stats.series} />
            </div>
          </div>
        </div>

        <div className="mt-4">
          {loading && <div className="text-sm text-slate-600">Loading…</div>}
          {err && !loading && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">Error: {err}</div>
          )}
          {!loading && !err && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {items.map((it, i) => <NewsCard key={i} item={it} />)}
            </div>
          )}
          {!loading && !err && items.length === 0 && (
            <div className="text-sm text-slate-600">No results found for this filter.</div>
          )}
        </div>
      </div>
    </main>
  );
}
