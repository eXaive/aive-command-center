"use client";

import React, { useEffect, useMemo, useState } from "react";

type Pt = { date: string; close: number };

function pct(a?: number | null, b?: number | null) {
  if (a == null || b == null || !isFinite(a) || !isFinite(b) || b === 0) return null;
  return ((a - b) / b) * 100;
}

export default function Sparkline({
  symbol,
  title = "Recent Trend",
  range = "2mo",
  interval = "1d",
}: {
  symbol: string;
  title?: string;
  range?: string;
  interval?: string;
}) {
  const [series, setSeries] = useState<Pt[] | null>(null);
  const [last, setLast] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    setErr(null);
    fetch(`/api/series?symbol=${encodeURIComponent(symbol)}&range=${range}&interval=${interval}`, {
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.text()) || `HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!live) return;
        setSeries(Array.isArray(d.series) ? d.series : []);
        setLast(typeof d.lastClose === "number" ? d.lastClose : null);
      })
      .catch((e: any) => {
        if (!live) return;
        setErr(e?.message || "series error");
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [symbol, range, interval]);

  const chg7 = useMemo(() => {
    if (!series || series.length < 2) return null;
    const a = series[series.length - 1]?.close;
    const b = series[Math.max(0, series.length - 7)]?.close; // ~7 trading days fallback
    return pct(a, b);
  }, [series]);

  // SVG paths
  const { pathD, min, max } = useMemo(() => {
    if (!series || series.length < 2) return { pathD: "", min: 0, max: 0 };
    const closes = series.map((p) => p.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const w = 520,
      h = 80,
      pad = 8;
    const X = (i: number) => pad + (i * (w - 2 * pad)) / (series.length - 1);
    const Y = (v: number) => {
      if (!(max > min)) return h / 2;
      return h - pad - ((v - min) * (h - 2 * pad)) / (max - min);
    };
    const d = closes.map((v, i) => `${i ? "L" : "M"} ${X(i)} ${Y(v)}`).join(" ");
    return { pathD: d, min, max };
  }, [series]);

  const chgClass =
    chg7 == null
      ? "text-slate-500"
      : chg7 > 0
      ? "text-blue-700"
      : chg7 < 0
      ? "text-red-700"
      : "text-slate-700";

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-500">{symbol}</div>
      </div>

      {loading && <div className="text-sm text-slate-500">Loading…</div>}
      {err && !loading && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">Error: {err}</div>}

      {!loading && !err && (
        <>
          <div className="w-full overflow-hidden rounded border">
            <svg viewBox="0 0 520 80" className="w-full h-[80px] bg-white">
              <rect x="0" y="0" width="520" height="80" className="fill-white" />
              {/* light area under line */}
              {pathD && (
                <>
                  <path d={`${pathD} L 512 72 L 8 72 Z`} className="fill-blue-100"></path>
                  <path d={pathD} className="stroke-blue-600 fill-none" strokeWidth="2"></path>
                </>
              )}
              {/* zero data stub */}
              {!pathD && (
                <text x="12" y="48" className="fill-slate-500 text-[12px] font-sans">
                  no series
                </text>
              )}
            </svg>
          </div>
          <div className="mt-2 text-sm text-slate-700">
            Last close: <b>{last != null ? last.toFixed(2) : "—"}</b>{" "}
            <span className={`ml-2 text-xs ${chgClass}`}>
              {chg7 == null ? "—" : `${chg7 >= 0 ? "+" : ""}${chg7.toFixed(2)}% (≈7d)`}
            </span>
          </div>
          {series && series.length >= 2 && (
            <div className="mt-1 text-xs text-slate-500">
              Range: {min.toFixed(2)} – {max.toFixed(2)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
