"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SummaryPage() {
  const params = useSearchParams();
  const url = params.get("url") || "";
  const title = params.get("title") || "Article Summary";

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetch(`/api/summarize?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setSummary(d.summary || "Summary unavailable."); })
      .catch(() => { if (alive) setSummary("Summary unavailable."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [url]);

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const timeStr = today.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @page { size: Letter; margin: 0.75in; }
        @media print { .no-print { display: none!important } }
      `}</style>

      <div className="no-print sticky top-0 z-10 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-slate-600">Article Summary</div>
          <button onClick={() => window.print()} className="px-3 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600">
            Print to PDF
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <div className="text-slate-600">{dateStr} — {timeStr}</div>
            {url && (
              <div className="text-sm mt-1">
                Source: <a href={url} target="_blank" className="underline" rel="noreferrer">{url}</a>
              </div>
            )}
          </div>
          <img src="/crowned_x.svg" alt="Crowned X" className="w-14 h-14" />
        </div>

        <div className="mt-4 p-3 rounded-lg border bg-slate-50 whitespace-pre-wrap">
          {loading ? "Summarizing…" : summary}
        </div>

        <div className="mt-6 pt-2 border-t text-xs text-slate-500">
          © {new Date().getFullYear()} Crowned X — Briefing. For informational purposes only.
        </div>
      </div>
    </div>
  );
}
