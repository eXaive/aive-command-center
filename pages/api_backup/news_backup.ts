// /pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from "next";

/** Quick keyword-based sentiment analyzer tuned for finance */
function computeSentiment(text: string): number {
  if (!text) return 0;
  const lower = text.toLowerCase();

  const bullish = [
    "growth",
    "surge",
    "rally",
    "gain",
    "profit",
    "beat",
    "up",
    "bullish",
    "record high",
    "strong",
    "expands",
    "improves",
    "optimism",
  ];
  const bearish = [
    "loss",
    "fall",
    "drop",
    "decline",
    "selloff",
    "crash",
    "bearish",
    "weak",
    "down",
    "cut",
    "recession",
    "fear",
    "default",
  ];

  let score = 0;
  bullish.forEach((w) => {
    if (lower.includes(w)) score += 1;
  });
  bearish.forEach((w) => {
    if (lower.includes(w)) score -= 1;
  });

  return Math.max(-1, Math.min(1, score / 5)); // normalize −1..+1
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const asset = (req.query.asset as string)?.toUpperCase() || "GLOBAL";
  const limit = Number(req.query.limit) || 12;

  const keywordMap: Record<string, string[]> = {
    GOLD: ["gold", "XAUUSD", "precious metals", "gold price", "gold futures"],
    SILVER: ["silver", "metals", "silver price"],
    OIL: ["crude oil", "WTI", "energy markets", "Brent"],
    SPY: ["S&P 500", "SPX", "SPY ETF", "US equities"],
    NASDAQ: ["NASDAQ", "tech stocks", "NASDAQ Composite"],
    DXY: ["US Dollar", "DXY index", "forex", "USD strength"],
    BTC: ["Bitcoin", "BTC-USD", "crypto", "digital assets"],
    ETH: ["Ethereum", "ETH-USD", "blockchain", "DeFi"],
    SOL: ["Solana", "SOL-USD", "layer 1", "crypto"],
    AVAX: ["Avalanche", "AVAX-USD", "crypto"],
    TSLA: ["Tesla", "Elon Musk", "EV stocks"],
    NVDA: ["NVIDIA", "AI chips", "semiconductors"],
    AAPL: ["Apple", "AAPL", "iPhone sales"],
    DEFAULT: ["finance", "markets", "stocks", "economy"],
  };

  const keywords = keywordMap[asset] || keywordMap.DEFAULT;
  const query = encodeURIComponent(keywords.join(" OR "));
  const feedUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const rss = await fetch(feedUrl);
    const text = await rss.text();

    const items = Array.from(text.matchAll(/<item>([\s\S]*?)<\/item>/g)).map((m) => {
      const raw = m[1];
      const title = raw.match(/<title>(.*?)<\/title>/)?.[1] ?? "Untitled";
      const summary = raw.match(/<description>(.*?)<\/description>/)?.[1] ?? "";
      const combined = `${title} ${summary}`;
      return {
        title,
        link: raw.match(/<link>(.*?)<\/link>/)?.[1] ?? "#",
        pubDate: raw.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "",
        summary,
        image: raw.match(/<media:content.*?url="(.*?)"/)?.[1] ?? null,
        source: "Google News",
        sentiment: computeSentiment(combined),
      };
    });

    res.status(200).json({ asset, items: items.slice(0, limit) });
  } catch (err) {
    console.error("NEWS FETCH ERROR:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
