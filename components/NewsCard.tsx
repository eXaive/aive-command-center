"use client";

import * as React from "react";

export type NewsItem = {
  title: string;
  link?: string;
  pubDate?: string;
  sentiment: number;
  text?: string;
  image?: string | null;
  summary?: string | null;
  isFavicon?: boolean;
};

function badgeClass(score: number) {
  if (score >= 0.1) return "bg-blue-100 text-blue-700 border-blue-200";
  if (score <= -0.1) return "bg-red-100 text-red-700 border-red-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function domainFromUrl(url?: string) {
  try {
    if (!url) return "";
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const img =
    item.image && !item.isFavicon
      ? item.image
      : "/crowned_x.svg"; // <- your brand fallback

  const date =
    item.pubDate ? new Date(item.pubDate).toLocaleString() : undefined;

  return (
    <a
      href={item.link || "#"}
      target="_blank"
      rel="noreferrer"
      className="group rounded-xl border bg-white overflow-hidden hover:shadow-sm transition"
      title={item.title}
    >
      <div className="flex gap-0">
        {/* image */}
        <div className="w-40 h-28 bg-slate-100 flex-shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.03] transition"
          />
        </div>

        {/* content */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={
                "inline-flex h-5 min-w-[38px] items-center justify-center rounded-full px-2 text-[11px] font-semibold border " +
                badgeClass(item.sentiment || 0)
              }
              title={`Sentiment ${item.sentiment?.toFixed?.(2) ?? "0.00"}`}
            >
              {(item.sentiment ?? 0).toFixed(1)}
            </span>
            <div className="text-[11px] text-slate-500">
              {domainFromUrl(item.link)}
            </div>
          </div>

          <h3 className="mt-1 font-semibold text-slate-900 line-clamp-2">
            {item.title}
          </h3>

          {item.summary && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {item.summary}
            </p>
          )}

          <div className="text-[11px] text-slate-500 mt-1">{date}</div>
        </div>
      </div>
    </a>
  );
}
