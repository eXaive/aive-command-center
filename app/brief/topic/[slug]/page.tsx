"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type NewsItem = {
  title: string;
  link?: string;
  pubDate?: string;
  summary?: string | null;
};

const slugToQuery: Record<string, string> = {
  // structural
  "demographics":      "demographics aging population labor force participation dependency ratio",
  "tech-ai":           "technology AI chips compute automation productivity",
  "climate-disaster":  "climate disaster drought flood wildfire heat insurance",
  "deglobalization":   "deglobalization nearshoring reshoring trade fragmentation",
  "regulation":        "regulation financial regulation SEC Basel compliance",
  "elections-policy":  "election policy fiscal tax stimulus politics",
  // trade/real economy
  "energy":            "oil gas energy OPEC refinery power prices",
  "commodities":       "commodities metals agriculture prices supply demand",
  "supply-chains":     "supply chain backlog ports logistics freight delays",
  "shipping-fx":       "shipping Baltic Dry FX currency dollar DXY",
  "sanctions-trade":   "sanctions export controls tariffs trade war",
  "housing":           "housing mortgage affordability home sales permits",
  // macro plumbing
  "central-banks":     "central bank Federal Reserve ECB BOJ policy rates balance sheet",
  "fiscal-debt":       "fiscal deficit debt issuance treasury auctions",
  "liquidity-nbfis":   "liquidity money markets shadow banking nonbank financials",
  "credit":            "credit conditions lending standards spreads defaults",
  "inflation":         "inflation CPI PCE prices",
  "gdp-growth":        "GDP growth PMI ISM output",
  // inner finance drivers (also routable)
  "cpi":               "CPI inflation",
  "payrolls":          "nonfarm payrolls jobs unemployment",
  "aaii":              "AAII sentiment bulls bears",
  "btc-flows":         "bitcoin exchange inflows outflows BTC",
  "rate-hike":         "interest rate hikes FOMC Fed funds",
  "liquidity":         "liquidity Federal Reserve reverse repo ON RRP",
  // other labels from your wheel
  "current-affairs":   "market economy breaking",
  "geopolitics":       "geopolitics conflict sanctions war",
  "weather":           "weather disaster agriculture ports",
  "crime":             "ransomware cyberattack theft disruption",
  "fx-dollar":         "US dollar DXY currency forex",
  "intel":             "insider supply chain shortage shipment backlog",
};

export default function TopicBriefPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const asset = (sp.get("asset") || "GOLD").toUpperCase();
  const q = slugToQuery[slug] || slug.replace(/-/g, " ");

  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const newsUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("asset", asset);
    if (q) qs.set("q", q);
    return `/api/news?${qs.toString()}`;
  }, [asset, q]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(newsUrl)
      .then((r) => r.json())
      .then((d) => alive && setItems((d.items || []).slice(0, 10)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [newsUrl]);

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-white min-h-screen">
      <style jsx global>{`
        @page { size: Letter; margin: 0.75in; }
        @media print { .no-print { display: none !important; } }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-slate-600">Topic Briefing</div>
          <button onClick={() => window.print()} className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600">
            Print to PDF
          </button>
        </div>
      </div>

      {/* Letter body */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {slug.replace(/-/g, " ").toUpperCase()} — Briefing
            </h1>
            <div className="text-slate-600">{dateStr} — {timeStr}</div>
            <div className="text-sm mt-1">Asset in focus: <b>{asset}</b></div>
            <div className="text-xs text-slate-500">Query: <span className="font-mono">{q}</span></div>
          </div>
          <img src="/crowned_x.svg" alt="Crowned X" className="w-16 h-16" />
        </div>

        <p className="mt-4 text-slate-700">
          This briefing summarizes the most relevant developments for <b>{slug.replace(/-/g, " ")}</b> and how they may relate to <b>{asset}</b>.
          Links are provided for further reading.
        </p>

        <ol className="mt-4 space-y-3 list-decimal pl-5">
          {loading && <li className="text-slate-500">Loading headlines…</li>}
          {!loading && items.length === 0 && <li className="text-slate-500">No headlines found.</li>}
          {!loading && items.map((it, i) => (
            <li key={i} className="bg-slate-50 rounded-lg border p-3">
              <div className="font-semibold">
                <a href={it.link} target="_blank" rel="noreferrer" className="hover:underline">{it.title}</a>
              </div>
              {it.summary && <div className="text-sm text-slate-700 mt-1">{it.summary}</div>}
              <div className="text-xs text-slate-500 mt-1">
                {(it.pubDate && new Date(it.pubDate).toLocaleString()) || ""}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-2 border-t text-xs text-slate-500">
          © {new Date().getFullYear()} Crowned X — Topic Brief. Informational only; not investment advice.
        </div>
      </div>
    </div>
  );
}
