import Parser from "rss-parser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get("asset") || "";
  const topic = searchParams.get("topic") || "global";
  const region = searchParams.get("region") || "";
  const limit = Number(searchParams.get("limit") || 10);

  const parser = new Parser();
  let feeds: string[] = [];

  if (topic.includes("energy") || asset === "OIL") {
    feeds = [
      "https://oilprice.com/rss/main",
      "https://www.reutersagency.com/feed/?best-sectors=energy",
    ];
  } else if (topic.includes("crypto") || ["BTC","ETH","SOL"].includes(asset)) {
    feeds = [
      "https://cointelegraph.com/rss",
      "https://news.bitcoin.com/feed/",
      "https://decrypt.co/feed",
    ];
  } else if (topic.includes("politic") || topic.includes("geo")) {
    feeds = [
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://www.reutersagency.com/feed/?best-topics=politics",
    ];
  } else if (topic.includes("economy") || topic.includes("rates") || topic.includes("cpi")) {
    feeds = [
      "https://www.ft.com/rss/economy",
      "https://www.reutersagency.com/feed/?best-sectors=markets-economy",
    ];
  } else {
    feeds = [
      "https://www.reutersagency.com/feed/?best-sectors=markets",
      "https://www.cnbc.com/id/10001147/device/rss/rss.html",
    ];
  }

  try {
    const allItems: any[] = [];
    for (const url of feeds) {
      try {
        const feed = await parser.parseURL(url);
        if (feed.items?.length) allItems.push(...feed.items);
      } catch (err) {
        console.error("⚠️ RSS fetch failed:", url, err);
      }
    }

    const items = allItems
      .filter((i) => i.title && i.link)
      .slice(0, limit)
      .map((i) => ({
        title: i.title,
        link: i.link,
        pubDate: i.pubDate,
        source: new URL(i.link).hostname,
      }));

    return Response.json({ asset, topic, region, total: items.length, items });
  } catch (e) {
    console.error("❌ Failed to fetch news:", e);
    return Response.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}
