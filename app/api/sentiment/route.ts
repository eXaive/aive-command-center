// app/api/sentiment/route.ts
import { NextResponse } from "next/server";
import Sentiment from "sentiment";

// --- Configure your News API key ---
const NEWS_API_KEY = process.env.NEWS_API_KEY || "DEMO_KEY"; // Replace with real key

const COUNTRIES = [
  { name: "United States", code: "us" },
  { name: "China", code: "cn" },
  { name: "Japan", code: "jp" },
  { name: "Germany", code: "de" },
  { name: "India", code: "in" },
  { name: "Turkey", code: "tr" },
  { name: "Argentina", code: "ar" },
  { name: "Brazil", code: "br" },
  { name: "Canada", code: "ca" },
  { name: "United Kingdom", code: "gb" },
];

export async function GET() {
  const sentiment = new Sentiment();
  const results: any[] = [];

  for (const c of COUNTRIES) {
    try {
      // Pull top headlines from NewsAPI
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=${c.code}&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      const json = await res.json();

      if (!json.articles) continue;

      // Analyze sentiment of each headline
      const scores = json.articles.map((a: any) => {
        const text = a.title || "";
        const { score } = sentiment.analyze(text);
        return score;
      });

      const avgScore =
        scores.reduce((sum, s) => sum + s, 0) / (scores.length || 1);

      // Convert sentiment (-inf..+inf) to bounded risk 0–100
      const normalized = Math.max(-5, Math.min(5, avgScore));
      const risk = Math.round(60 - normalized * 8); // invert (more negative → higher risk)
      const history = Array.from({ length: 7 }, () =>
        Math.max(10, Math.min(100, risk + (Math.random() - 0.5) * 10))
      );

      results.push({
        name: c.name,
        code: c.code.toUpperCase(),
        sentiment: avgScore.toFixed(2),
        risk,
        history,
        trend: history[6] > history[0] ? "up" : "down",
      });
    } catch (err) {
      console.error(`Error fetching news for ${c.name}`, err);
    }
  }

  return NextResponse.json({ items: results });
}
