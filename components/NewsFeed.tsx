"use client";

import React, { useEffect, useState } from "react";

interface NewsFeedProps {
  asset?: string;
  topic?: string;
  region?: string;
  date?: string;
}

interface NewsItem {
  title: string;
  link: string;
  pubDate?: string;
  source?: string;
}

export default function NewsFeed({ asset, topic, region }: NewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/news?asset=${asset || ""}&topic=${topic || ""}&region=${region || ""}`
        );
        const data = await res.json();
        if (active) setNews(data.items || []);
      } catch (err) {
        console.error("❌ News fetch failed", err);
        if (active) setNews([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    const timer = setInterval(load, 10 * 60 * 1000); // auto-refresh every 10 minutes

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [asset, topic, region]);

  if (loading)
    return <div className="text-sm text-slate-500">Loading news...</div>;

  if (!news.length)
    return <div className="text-sm text-slate-500">No recent articles found.</div>;

  return (
    <div className="space-y-3 animate-fadeIn">
      {news.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded-md p-3 hover:bg-slate-50 transition"
        >
          <div className="text-sm font-medium text-slate-900">{item.title}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {item.source && <span>{item.source}</span>}{" "}
            {item.pubDate && (
              <span>• {new Date(item.pubDate).toLocaleDateString()}</span>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
