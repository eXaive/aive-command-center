import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";
// @ts-ignore
import PDFDocument from "pdfkit";
// @ts-ignore
import SVGtoPDF from "svg-to-pdfkit";

const today = () =>
  new Date().toLocaleString(undefined, { year: "numeric", month: "long", day: "numeric" });

const num = (v: unknown, d = 0) => (typeof v === "number" && isFinite(v) ? v : d);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function getBaseUrl(req: NextApiRequest) {
  const proto = (req.headers["x-forwarded-proto"] as string) || "http";
  const host = (req.headers.host as string) || "localhost:3000";
  return `${proto}://${host}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const asset = (req.query.asset || "GOLD").toString().toUpperCase();
  const slug = (req.query.slug || "geopolitics").toString();
  const base = getBaseUrl(req);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="Topic_Brief_${slug}_${asset}.pdf"`);
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  // Pull heat (for this slug) + news filtered by slug keyword
  let polarity = 0, strength = 0, newsAvg = 0, newsCount = 0;
  try {
    const r = await fetch(`${base}/api/heat`, { cache: "no-store" });
    const j = await r.json();
    const metrics = (j?.metrics || j?.scores) as any;
    const h = metrics?.[slug];
    if (typeof h === "number") {
      polarity = Math.max(-1, Math.min(1, h));
      strength = Math.abs(h);
    } else if (h && typeof h === "object") {
      polarity = Math.max(-1, Math.min(1, num(h.polarity, 0)));
      strength = clamp01(Math.abs(num(h.weight, Math.abs(polarity))));
    }
  } catch {}

  try {
    // use ?q=slug as a simple news filter (works with your /api/news)
    const r = await fetch(`${base}/api/news?asset=${encodeURIComponent(asset)}&q=${encodeURIComponent(slug)}`, { cache: "no-store" });
    const j = await r.json();
    const vals = (Array.isArray(j?.items) ? j.items : []).map((it: any) => num(it?.sentiment, 0));
    newsCount = vals.length;
    newsAvg = newsCount ? vals.reduce((a, b) => a + b, 0) / newsCount : 0;
  } catch {}

  const tone =
    polarity > 0.4 ? "constructive" :
    polarity > 0.1 ? "modestly supportive" :
    polarity < -0.4 ? "adverse" :
    polarity < -0.1 ? "moderately adverse" :
    "balanced";

  const newsTone = newsAvg > 0.15 ? "positive" : newsAvg < -0.15 ? "negative" : "mixed";

  const doc = new PDFDocument({ size: "LETTER", margins: { top: 54, bottom: 54, left: 64, right: 54 } });
  doc.pipe(res);

  // logo top-right
  try {
    const svgPath = path.join(process.cwd(), "public", "crowned_x.svg");
    const svgData = fs.readFileSync(svgPath, "utf8");
    const { width } = doc.page;
    const w = 80, x = width - w - 60, y = 40;
    SVGtoPDF(doc, svgData, x, y, { width: w, preserveAspectRatio: "xMidYMid meet" });
  } catch {}

  // header
  const titleSlug = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  doc.fontSize(24).fillColor("#0f172a").text(`Topic Brief — ${titleSlug} (${asset})`, 64, 54);
  doc.moveDown(0.3).fontSize(10).fillColor("#475569").text(`Prepared by BigDataEtc × eX  •  ${today()}`);
  doc.moveDown(0.5).fontSize(11).fillColor("#1f2937").text("Monitor Everything that affects Finance.");
  doc.moveTo(64, doc.y + 8).lineTo(doc.page.width - 54, doc.y + 8).strokeColor("#e5e7eb").lineWidth(1).stroke();
  doc.moveDown(1.2);

  // Summary
  doc.fontSize(12).fillColor("#111827").text("Summary");
  doc.moveDown(0.4).fontSize(11).fillColor("#334155").text(
    `${titleSlug} shows a ${tone} impulse for ${asset}. ` +
    `Headline tone within this topic appears ${newsTone}. ` +
    `The values below are computed from live dashboard heat and filtered headlines.`
  );

  // Metrics
  doc.moveDown(0.9).fontSize(12).fillColor("#111827").text("Topic Metrics");
  doc.moveDown(0.3).fontSize(11).fillColor("#111827")
    .text(`• Polarity: ${(polarity >= 0 ? "+" : "") + polarity.toFixed(2)}`)
    .text(`• Strength: ${strength.toFixed(2)}`)
    .text(`• News Tone (avg): ${(newsAvg >= 0 ? "+" : "") + newsAvg.toFixed(2)} (${newsCount} headlines)`);

  // Narrative
  doc.moveDown(0.9).fontSize(12).fillColor("#111827").text("Narrative");
  doc.moveDown(0.3).fontSize(11).fillColor("#334155")
    .text(`The ${titleSlug.toLowerCase()} vector is currently ${tone}. ` +
          `We expect developments in this area to continue influencing ${asset} through sentiment and flows.`);

  // Disclaimer + footer
  doc.moveDown(1.0).fontSize(9).fillColor("#6b7280")
    .text("Disclaimer: This brief is for informational purposes only and does not constitute financial advice. Views reflect data available at time of publication and may change without notice.");
  doc.moveDown(0.8).fontSize(9).fillColor("#64748b")
    .text("A publication of BigDataEtc × eX — Monitor Everything that affects Finance.");

  doc.end();
}
