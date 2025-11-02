import type { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

const UA = {
  "User-Agent": "Mozilla/5.0 (CrownedX/1.0)",
  "Accept-Language": "en-US,en;q=0.9",
};

function clean(text: string) {
  return text
    .replace(/Read more at:.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = String(req.query.url || "");
    if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: "Bad url" });

    const r = await fetch(url, { headers: UA, signal: (AbortSignal as any).timeout?.(8000) });
    if (!r.ok) throw new Error("fetch failed " + r.status);
    const html = await r.text();
    const $ = cheerio.load(html);

    // Prefer meta description, then first 3 paragraphs
    const meta =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "";

    const paras = $("p")
      .slice(0, 6)
      .map((_, el) => $(el).text())
      .get()
      .map(clean)
      .filter(Boolean);

    const body = clean(meta || paras.join(" ").slice(0, 1200));
    res.setHeader("Cache-Control", "public, max-age=240, s-maxage=240");
    return res.status(200).json({ summary: body || "No summary found." });
  } catch (e: any) {
    return res.status(200).json({ summary: "Summary unavailable." });
  }
}
