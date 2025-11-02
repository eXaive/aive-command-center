import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

const FEED_MAP: Record<string, string[]> = {
  politics: [
    "https://feeds.reuters.com/Reuters/PoliticsNews",
    "https://www.politico.com/rss/politics08.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
  ],
  economy: [
    "https://feeds.marketwatch.com/marketwatch/topstories/",
    "https://www.cnbc.com/id/10001147/device/rss/rss.html",
    "https://www.bloomberg.com/feed/podcast/etf_report.xml",
  ],
  military: [
    "https://www.defense.gov/Newsroom/News/rss/",
    "https://www.aljazeera.com/xml/rss/all.xml",
  ],
  crime: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.reutersagency.com/feed/?best-topics=crime",
  ],
  health: [
    "https://www.who.int/feeds/entity/csr/don/en/rss.xml",
    "https://www.cdc.gov/rss/rss.xml",
  ],
  disasters: [
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.atom",
    "https://www.nasa.gov/rss/dyn/earth.rss",
    "https://www.weather.gov/rss_page.php?site_name=nws",
  ],
  technology: [
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
    "https://techcrunch.com/feed/",
    "https://www.wired.com/feed/rss",
  ],
  environment: [
    "https://climate.nasa.gov/rss.xml",
    "https://www.unep.org/rss.xml",
    "https://www.nationalgeographic.com/environment/rss",
  ],
};

export async function GET(
  req: Request,
  { params }: { params: { category: string } }
) {
  const category = params.category.toLowerCase();
  const feeds = FEED_MAP[category];

  if (!feeds) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }

  try {
    const results = await Promise.all(
      feeds.map(async (url) => {
        const feed = await parser.parseURL(url);
        return feed.items.map((i) => ({
          title: i.title,
          link: i.link,
          source: feed.title,
          summary: i.contentSnippet || "",
          pubDate: i.pubDate,
          image:
            i.enclosure?.url ||
            `https://source.unsplash.com/600x400/?${category},news,world`,
        }));
      })
    );

    const merged = results.flat().slice(0, 20); // top 20 news items
    return NextResponse.json(merged);
  } catch (err) {
    console.error("RSS fetch error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
