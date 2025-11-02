// pages/api/topic/[slug].ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

/** Topic item returned to the client */
type Item = {
  title: string;
  link?: string;
  pubDate?: string;
  source?: string;
  image?: string | null;
};

const parser = new Parser({
  headers: { "user-agent": "Mozilla/5.0 (TopicFeed/1.0; +https://example.com)" },
});

/* ------------------------------------------------------------------ */
/* Curated feeds by topic (extendable)                                 */
/* ------------------------------------------------------------------ */
const TOPIC_FEEDS: Record<string, { name: string; urls: string[] }> = {
  energy: {
    name: "Energy",
    urls: [
      "https://www.oilprice.com/rss/main",
      "https://feeds.reuters.com/reuters/commoditiesNews",
      "https://www.eia.gov/rss/todayinenergy.xml",
    ],
  },
  geopolitics: {
    name: "Geopolitics",
    urls: [
      "https://feeds.reuters.com/Reuters/worldNews",
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://www.aljazeera.com/xml/rss/all.xml",
    ],
  },
  cpi: {
    name: "CPI",
    urls: [
      "https://www.bls.gov/feeds/news_release/cpi.rss",
      "https://feeds.reuters.com/reuters/businessNews",
    ],
  },
  inflation: {
    name: "Inflation",
    urls: [
      "https://feeds.reuters.com/reuters/businessNews",
      "https://www.imf.org/en/News/rss",
    ],
  },
  rates: {
    name: "Rates (CBs)",
    urls: [
      "https://www.federalreserve.gov/feeds/press_all.xml",
      "https://www.ecb.europa.eu/rss/press.html",
      "https://www.bankofengland.co.uk/news/news.xml",
      "https://www.bis.org/press_rss.xml",
    ],
  },
  dxy: {
    name: "DXY / FX",
    urls: [
      "https://feeds.reuters.com/news/forexNews",
      "https://feeds.bbci.co.uk/news/business/rss.xml",
    ],
  },
  "btc-flows": {
    name: "BTC Flows",
    urls: [
      "https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=xml",
      "https://cointelegraph.com/rss",
    ],
  },
  housing: {
    name: "Housing",
    urls: [
      "https://www.redfin.com/blog/feed/",
      "https://www.zillow.com/research/feed/",
      "https://www.realtor.com/research/feed/",
    ],
  },
  "tech-ai": {
    name: "Technology & AI",
    urls: [
      "https://techcrunch.com/feed/",
      "https://www.cnbc.com/id/19854910/device/rss/rss.html",
      "https://www.ft.com/technology?format=rss",
    ],
  },
  oil: {
    name: "Oil",
    urls: [
      "https://www.oilprice.com/rss/main",
      "https://feeds.reuters.com/reuters/commoditiesNews",
    ],
  },
  regulation: {
    name: "Regulation",
    urls: [
      "https://feeds.reuters.com/reuters/USdomesticNews",
      "https://www.sec.gov/news/pressreleases.rss",
    ],
  },
  "supply-chains": {
    name: "Supply Chains",
    urls: [
      "https://www.wsj.com/news/types/logistics-report?mod=rss",
      "https://www.reuters.com/subjects/supply-chain/rss",
    ],
  },
  credit: {
    name: "Credit",
    urls: [
      "https://www.reuters.com/finance/deals/rss",
      "https://www.bloomberg.com/politics/feeds/site.xml",
    ],
  },
  liquidity: {
    name: "Liquidity",
    urls: [
      "https://seekingalpha.com/market_currents.xml",
      "https://www.federalreserve.gov/feeds/press_all.xml",
    ],
  },
  gdp: {
    name: "Growth / GDP",
    urls: [
      "https://www.bea.gov/rss.xml",
      "https://www.oecd.org/rssfeeds/publicationsandproducts.xml",
    ],
  },
  demographics: {
    name: "Demographics",
    urls: [
      "https://www.census.gov/newsroom/census-rss.xml",
      "https://www.pewresearch.org/feed/",
    ],
  },
  elections: {
    name: "Elections",
    urls: [
      "https://feeds.reuters.com/Reuters/PoliticsNews",
      "https://feeds.bbci.co.uk/news/politics/rss.xml",
    ],
  },
  climate: {
    name: "Climate",
    urls: [
      "https://climate.nasa.gov/news/rss.xml",
      "https://www.noaa.gov/rss",
      "https://www.bloomberg.com/feeds/bgreen.xml",
    ],
  },
  sentiment: {
    name: "Sentiment",
    urls: [
      "https://finance.yahoo.com/news/rssindex",
      "https://www.aaii.com/sentimentsurvey/rss",
    ],
  },
  payrolls: {
    name: "Payrolls",
    urls: [
      "https://www.bls.gov/feeds/news_release/empsit.rss",
      "https://feeds.reuters.com/reuters/businessNews",
    ],
  },
  "news-tone": {
    name: "News Tone",
    urls: [
      "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
      "https://feeds.reuters.com/reuters/businessNews",
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Utilities                                                           */
/* ------------------------------------------------------------------ */

async function fetchWithTimeout(url: string, ms = 6000): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { "user-agent": "Mozilla/5.0 (TopicFeed/1.0; +https://example.com)" },
    });
  } finally {
    clearTimeout(id);
  }
}

/** Try multiple meta patterns for images; prefer non-SVG, non-sprite-like URLs */
function extractBestImageFromHtml(html: string, baseUrl: string): string | null {
  const pick = (...regexes: RegExp[]) => {
    for (const re of regexes) {
      const m = html.match(re);
      if (m && m[1]) {
        const u = absolutize(m[1], baseUrl);
        if (!/sprite|logo|placeholder/i.test(u) && !u.endsWith(".svg")) return u;
      }
    }
    return null;
  };

  // Common OG/Twitter patterns
  const candidate =
    pick(
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i,
      /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i
    ) || null;

  return candidate;
}

function absolutize(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function toFavicon(baseUrl: string): string | null {
  try {
    const u = new URL(baseUrl);
    return `${u.origin}/favicon.ico`;
  } catch {
    return null;
  }
}

/** Normalize an RSS item into our Item shape; pick enclosure/media images if present */
function normalizeRssItem(it: any, source: string): Item {
  let img: string | null = null;

  // Check enclosure/media fields first
  if (it.enclosure?.url) img = it.enclosure.url;
  if (!img && Array.isArray(it.enclosure)) img = it.enclosure[0]?.url;
  if (!img && it["media:content"]?.url) img = it["media:content"].url as string;
  if (!img && it["media:thumbnail"]?.url) img = it["media:thumbnail"].url as string;

  return {
    title: String(it.title || ""),
    link: it.link,
    pubDate: it.pubDate,
    source,
    image: img || null,
  };
}

/** Build a merged, sorted list for the topic; fetch OG images when needed */
async function buildItemsForTopic(urls: string[]): Promise<Item[]> {
  const lists = await Promise.allSettled(
    urls.map(async (url) => {
      const feed = await parser.parseURL(url);
      const source =
        (feed.title || "")
          .replace(/RSS|Feed/gi, "")
          .trim() || new URL(url).host;

      const items: Item[] = (feed.items || []).map((it: any) => normalizeRssItem(it, source));
      return items;
    })
  );

  const merged = lists
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .filter((i) => i?.title)
    .sort((a, b) => {
      const da = a.pubDate ? Date.parse(a.pubDate) : 0;
      const db = b.pubDate ? Date.parse(b.pubDate) : 0;
      return db - da;
    });

  // Try to fill missing thumbnails (limit HTML fetches to keep snappy)
  const MAX_FETCH_THUMBS = 24;
  const toFill = merged.filter((i) => !i.image && i.link).slice(0, MAX_FETCH_THUMBS);

  await Promise.allSettled(
    toFill.map(async (it) => {
      if (!it.link) return;
      try {
        const resp = await fetchWithTimeout(it.link, 6500);
        if (!resp.ok) {
          it.image = toFavicon(it.link) || "/crowned_x.svg";
          return;
        }
        const html = await resp.text();
        const og = extractBestImageFromHtml(html, it.link);
        it.image = og || toFavicon(it.link) || "/crowned_x.svg";
      } catch {
        it.image = toFavicon(it.link) || "/crowned_x.svg";
      }
    })
  );

  // Final fallback for any still-missing images
  for (const it of merged) {
    if (!it.image) {
      it.image = it.link ? toFavicon(it.link) || "/crowned_x.svg" : "/crowned_x.svg";
    }
  }

  return merged.slice(0, 60);
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug || "").toLowerCase();
  const topic = TOPIC_FEEDS[slug];
  if (!topic) {
    res.status(404).json({ error: "Unknown topic", slug });
    return;
  }

  try {
    const items = await buildItemsForTopic(topic.urls);
    res.status(200).json({
      topic: topic.name,
      slug,
      count: items.length,
      items,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Failed to build topic feed", slug });
  }
}
