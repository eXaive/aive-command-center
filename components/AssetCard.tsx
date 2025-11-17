"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Row = {
  id: string;
  asset: string;
  predicted_price: number | null;
  actual_price: number | null;
  accuracy: number | null;
  confidence: number | null;
  reflection: string | null;
  model_version: string | null;
  created_at: string; // timestamptz
};

export default function AssetCard({ asset }: { asset: string }) {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  // 1) initial fetch (latest row by created_at)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("gold_predictions")
        .select("*")
        .eq("asset", asset)
        .order("created_at", { ascending: false })
        .limit(1)
        .returns<Row[]>();

      if (!cancelled) {
        if (error) console.error(error);
        setRow(data?.[0] ?? null);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [asset]);

  // 2) realtime subscribe only to this asset
  useEffect(() => {
    const channel = supabase
      .channel(`predictions:${asset}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "gold_predictions", filter: `asset=eq.${asset}` },
        (payload) => {
          const newRow = payload.new as Row;
          setRow((r) => (!r || new Date(newRow.created_at) > new Date(r.created_at) ? newRow : r));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [asset]);

  const priceDelta = useMemo(() => {
    if (!row?.predicted_price || !row?.actual_price) return null;
    const diff = row.predicted_price - row.actual_price;
    const pct = (diff / row.actual_price) * 100;
    return { diff, pct };
  }, [row]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">{asset.toUpperCase()}</div>
        <div className="text-xs text-slate-400">{row ? new Date(row.created_at).toLocaleString() : "—"}</div>
      </div>

      {loading ? (
        <div className="animate-pulse text-slate-400">loading…</div>
      ) : row ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Predicted" value={fmt(row.predicted_price)} />
            <Stat label="Actual" value={fmt(row.actual_price)} />
            <Stat label="Accuracy" value={pct(row.accuracy)} />
            <Stat label="Confidence" value={pct(row.confidence)} />
          </div>

          <div className="mt-4 text-sm text-slate-300">
            {row.reflection ?? "—"}
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Model: {row.model_version ?? "n/a"}
            {priceDelta && (
              <span className="ml-3">
                Δ {priceDelta.diff.toFixed(2)} ({priceDelta.pct.toFixed(2)}%)
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="text-slate-400">no data yet for {asset}</div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function fmt(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function pct(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(2)}%`;
}
