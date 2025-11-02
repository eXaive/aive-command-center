"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type NewsItem = {
  title: string;
  link?: string;
  pubDate?: string;
  sentiment: number;
  image?: string | null;
  summary?: string | null;
};

export default function BriefPage() {
  const { asset: raw } = useParams<{ asset: string }>();
  const asset = (raw || "GOLD").toUpperCase() as "GOLD" | "SPY" | "BTC" | "ETH";

  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/news?asset=${asset}`)
      .then((r) => r.json())
      .then((data) => { if (alive) setItems((data.items || []) as any[]); })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [asset]);

  const top = useMemo(() => items.slice(0, 8), [items]);

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const timeStr = today.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-white">
      {/* Print styles */}
      <style jsx global>{`
        @page { size: Letter; margin: 0.75in; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a { color: #0f172a; text-decoration: none; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-slate-600">One-Page Brief Preview</div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600"
            >
              Print to PDF
            </button>
            <a href="/focus" className="px-3 py-1 rounded-md border bg-white hover:bg-slate-50">Back</a>
          </div>
        </div>
      </div>

      {/* Letter Container */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Crowned X • Investor Brief</h1>
            <div className="text-slate-600">{dateStr} — {timeStr}</div>
            <div className="mt-2 text-lg font-semibold">{asset}</div>
          </div>
          <img
            src="/crowned_x.svg"
            alt="Crowned X"
            className="w-16 h-16 select-none"
            draggable={false}
          />
        </div>

        {/* Summary box */}
        <div className="mt-4 p-3 rounded-lg border bg-slate-50">
          <div className="text-sm text-slate-700">
            This brief summarizes today’s key developments surrounding <b>{asset}</b> based on curated headlines.  
            It’s designed to be a single page that an investor can share or archive.
          </div>
        </div>

        {/* Top headlines */}
        <div className="mt-5">
          <h2 className="text-lg font-semibold mb-2">Top Headlines</h2>
          {loading && <div className="text-sm text-slate-500">Loading…</div>}
          <ol className="list-decimal pl-5 space-y-2">
            {top.map((it, i) => (
              <li key={i}>
                <div className="font-medium text-slate-900">{it.title}</div>
                {it.summary && <div className="text-sm text-slate-700">{it.summary}</div>}
                <div className="text-xs text-slate-500">
                  {(it.pubDate && new Date(it.pubDate).toLocaleString()) || ""}
                  {it.link && (
                    <>
                      {" • "}
                      <a href={it.link} target="_blank" rel="noreferrer" className="underline">
                        Source
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer line */}
        <div className="mt-6 pt-2 border-t text-xs text-slate-500">
          © {new Date().getFullYear()} Crowned X — Market Heartbeat. For informational purposes only.
        </div>
      </div>
    </div>
  );
}
