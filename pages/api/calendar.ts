// pages/api/calendar.ts
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Very small mock "calendar" endpoint.
 * - Returns the NEXT event per driver (slug) within 90 days.
 * - You can later replace DATA with real schedules (EconDB, FMP, your sheets, etc.).
 */

type CalEvent = {
  slug: string;          // driver id (e.g., "cpi", "payrolls", "rates")
  date: string;          // ISO yyyy-mm-dd
  headline: string;      // brief title
  est?: string;          // estimate if any (e.g., "3.3% YoY")
  unit?: string;         // optional unit
  region?: "ALL" | "US" | "EU" | "ASIA";
};

const todayISO = new Date().toISOString().slice(0, 10);

// --- SAMPLE DATA (edit freely) ---
const DATA: CalEvent[] = [
  { slug: "cpi",       date: addDaysISO(14), headline: "CPI (YoY)", est: "3.3%", region: "US" },
  { slug: "payrolls",  date: addDaysISO(21), headline: "Non-Farm Payrolls", est: "+175k", region: "US" },
  { slug: "rates",     date: addDaysISO(30), headline: "FOMC Decision", est: "Hold", region: "US" },
  { slug: "equities",  date: addDaysISO(35), headline: "Earnings Cluster (Mega-Caps)", region: "US" },
  { slug: "geopolitics", date: addDaysISO(10), headline: "EU Summit • Security & Trade", region: "EU" },
  { slug: "energy",    date: addDaysISO(18), headline: "OPEC+ Meeting", region: "ALL" },
  { slug: "btc-flows", date: addDaysISO(7),  headline: "ETF Net Flow Window", region: "US" },
  { slug: "volatility",date: addDaysISO(28), headline: "Op-Ex / Dealer Gamma Roll", region: "ALL" },
];

function addDaysISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const region = (String(req.query.region || "ALL").toUpperCase() as "ALL" | "US" | "EU" | "ASIA");
  // Filter by region loosely (ALL always eligible)
  const within90 = DATA.filter(ev => diffDays(todayISO, ev.date) <= 90)
    .filter(ev => ev.region === "ALL" || ev.region === region);

  // Reduce to a single "next event" per slug
  const map = new Map<string, CalEvent>();
  for (const ev of within90) {
    const prev = map.get(ev.slug);
    if (!prev || ev.date < prev.date) map.set(ev.slug, ev);
  }

  const bySlug: Record<string, CalEvent> = {};
  for (const [slug, ev] of map.entries()) bySlug[slug] = ev;

  res.status(200).json({ region, asOf: todayISO, events: bySlug });
}

function diffDays(aISO: string, bISO: string) {
  const a = new Date(aISO).getTime();
  const b = new Date(bISO).getTime();
  return Math.round((b - a) / 86400000);
}
