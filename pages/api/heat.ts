import type { NextApiRequest, NextApiResponse } from "next";

// Very light keyword-based tone (fast + deterministic)
const POS = /\b(rise|rises|gain|gains|surge|surges|record|boom|improve|easing|beat|beats|strong|expansion)\b/i;
const NEG = /\b(fall|falls|drop|drops|slump|slumps|plunge|plunges|miss|misses|weak|contraction|downturn|crisis|strike|shutdown)\b/i;

const SLUG_TO_QUERY: Record<string, string> = {
  // match your home rings
  "demographics":      "demographics aging population labor market",
  "tech-ai":           "technology AI chips compute economy",
  "climate-disaster":  "climate disaster flood wildfire insurance costs economy",
  "deglobalization":   "deglobalization nearshoring trade fragmentation supply chains",
  "regulation":        "financial regulation policy banks markets",
  "elections-policy":  "election fiscal policy markets",

  "energy":            "oil gas energy prices OPEC economy",
  "commodities":       "commodities metals agriculture prices economy",
  "supply-chains":     "supply chain ports logistics delays costs",
  "shipping-fx":       "shipping freight Baltic Dry FX dollar",
  "sanctions-trade":   "sanctions export controls tariffs trade",
  "housing":           "housing mortgage affordability sales permits",

  "central-banks":     "central bank Federal Reserve rates policy markets",
  "fiscal-debt":       "fiscal deficit debt issuance treasury auctions",
  "liquidity-nbfis":   "liquidity money markets nonbank financials",
  "credit":            "credit conditions lending standards spreads defaults",
  "inflation":         "inflation CPI prices markets",
  "gdp-growth":        "GDP growth PMI ISM economy",
};

function unwrapGoogleNewsLink(link: string): string {
  try {
    const u = new URL(link);
    if (u.hostname.endsWith("news.google.com")) {
      const orig = u.searchParams.get("url");
      if (orig) return orig;
    }
  } catch {}
  return link;
}

async function fetchTitles(q: string): Promise<string[]> {
  const feed = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  const r = await fetch(feed, { headers: { "User-Agent": "Mozilla/5.0 (CrownedX/1.0)" } });
  if (!r.ok) return [];
  const xml = await r.text();
  const titles: string[] = [];
  const items = xml.split("<item>").slice(1);
  for (const chunk of items.slice(0, 20)) {
    const t = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i.exec(chunk);
    const title = (t?.[1] || t?.[2] || "").replace(/&amp;/g, "&").trim();
    if (title) titles.push(title);
  }
  return titles;
}

function toneScore(titles: string[]): number {
  if (!titles.length) return 0;
  let s = 0;
  for (const t of titles) {
    if (POS.test(t)) s += 1;
    if (NEG.test(t)) s -= 1;
  }
  const avg = s / titles.length;
  // clamp
  return Math.max(-1, Math.min(1, avg));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const slugs = Object.keys(SLUG_TO_QUERY);
    const out: Record<string, number> = {};
    await Promise.all(
      slugs.map(async (slug) => {
        const titles = await fetchTitles(SLUG_TO_QUERY[slug]);
        out[slug] = toneScore(titles);
      })
    );
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=1800");
    res.status(200).json({ scores: out });
  } catch (e: any) {
    res.status(200).json({ scores: {} });
  }
}
