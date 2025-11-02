"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type NewsItem = {
  title: string;
  link?: string;
  pubDate?: string;
  sentiment?: number;
  summary?: string | null;
  source?: string;
};

export default function NewsPanel({ asset }: { asset: string }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?asset=${asset}`);
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.error("⚠️ Failed to load RSS feed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [asset]);

  if (loading)
    return (
      <div className="p-3 text-sm text-slate-500">
        Loading {asset} headlines...
      </div>
    );

  if (!items.length)
    return (
      <div className="p-3 text-sm text-slate-500">
        No headlines found for {asset}.
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((n, i) => (
        <div
          key={i}
          className="rounded-lg border bg-white p-3 hover:shadow-md transition cursor-pointer"
          onClick={() => n.link && window.open(n.link, "_blank")}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Image
                src={`https://source.unsplash.com/600x400/?${asset},finance,market`}
                alt={n.title}
                width={100}
                height={70}
                className="rounded-md object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-[13px] text-slate-800 leading-tight">
                {n.title}
              </h3>

              {n.summary && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {n.summary}
                </p>
              )}

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded ${
                    n.sentiment && n.sentiment > 0.2
                      ? "bg-green-100 text-green-700"
                      : n.sentiment && n.sentiment < -0.2
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {n.sentiment && n.sentiment > 0.2
                    ? "Positive"
                    : n.sentiment && n.sentiment < -0.2
                    ? "Negative"
                    : "Neutral"}
                </span>
                {n.source && (
                  <span className="text-[11px] text-slate-500">{n.source}</span>
                )}
                {n.pubDate && (
                  <span className="text-[11px] text-slate-400">
                    {new Date(n.pubDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
