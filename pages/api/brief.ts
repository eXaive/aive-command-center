// /pages/api/brief.ts
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import SVGtoPDF from "svg-to-pdfkit";

/* ----------------- Config: assets, symbols, topics ----------------- */
type AssetCfg = {
  display: string;
  yfSymbol: string;         // for /api/series
  topics: string[];         // for factor bars & news blend
  tagline?: string;         // optional per-asset tagline
};

const ASSETS: Record<string, AssetCfg> = {
  GOLD:   { display: "Gold (XAU/USD)", yfSymbol: "GC=F",     topics: ["dxy","rates","energy","news-tone"] },
  SILVER: { display: "Silver (XAG/USD)", yfSymbol: "SI=F",    topics: ["dxy","rates","energy","news-tone"] },
  OIL:    { display: "WTI Crude (CL)",  yfSymbol: "CL=F",     topics: ["energy","geopolitics","rates","news-tone"] },
  SPY:    { display: "S&P 500 (SPY)",   yfSymbol: "SPY",      topics: ["rates","liquidity","credit","news-tone"] },
  QQQ:    { display: "NASDAQ 100 (QQQ)",yfSymbol: "QQQ",      topics: ["rates","tech-ai","liquidity","news-tone"] },
  DXY:    { display: "US Dollar Index", yfSymbol: "DX-Y.NYB", topics: ["rates","macro","news-tone"] },
  US10Y:  { display: "US 10Y Yield",    yfSymbol: "^TNX",     topics: ["inflation","macro","news-tone"] },
  BTC:    { display: "Bitcoin (BTC)",   yfSymbol: "BTC-USD",  topics: ["btc-flows","regulation","liquidity","news-tone"] },
  ETH:    { display: "Ethereum (ETH)",  yfSymbol: "ETH-USD",  topics: ["tech-ai","regulation","liquidity","news-tone"] },
  SOL:    { display: "Solana (SOL)",    yfSymbol: "SOL-USD",  topics: ["tech-ai","regulation","liquidity","news-tone"] },
  NVDA:   { display: "NVIDIA (NVDA)",   yfSymbol: "NVDA",     topics: ["tech-ai","rates","news-tone"] },
  AAPL:   { display: "Apple (AAPL)",    yfSymbol: "AAPL",     topics: ["tech-ai","supply-chains","news-tone"] },
  TSLA:   { display: "Tesla (TSLA)",    yfSymbol: "TSLA",     topics: ["energy","tech-ai","news-tone"] },
};

const DEFAULT_ASSET = "GOLD";

/* ----------------- Utilities ----------------- */

function baseUrlFromReq(req: NextApiRequest) {
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers["x-forwarded-protocol"] as string) ||
    "http";
  const host = req.headers.host || "localhost:3000";
  return `${proto}://${host}`;
}

// Simple keyword tone
const POS = ["beats","surge","soar","record","bull","expands","grow","rises","gain","optimism","cuts rates","stimulus","eases"];
const NEG = ["miss","falls","drop","slump","recession","bear","cuts","loss","default","war","hike","tighten","sanction"];
function scoreTitle(t: string) {
  const s = (t || "").toLowerCase();
  let sc = 0;
  POS.forEach((w) => (sc += s.includes(w) ? 1 : 0));
  NEG.forEach((w) => (sc -= s.includes(w) ? 1 : 0));
  return sc;
}

type NewsItem = { title: string; link?: string; pubDate?: string; source?: string };
type SeriesPoint = { date: string; close: number };

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store", headers: { "user-agent": "GMMF-PDF/1.2" } as any });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }
function asOf() { return new Date().toLocaleString(); }

function colorForScore(score: number) {
  if (score > 0.66) return "#2563eb";
  if (score > 0.15) return "#60a5fa";
  if (score < -0.66) return "#dc2626";
  if (score < -0.15) return "#f87171";
  return "#94a3b8";
}
function drawInfluenceBar(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, score: number) {
  const s = clamp(score, -1, 1);
  doc.save();
  doc.rect(x, y, w, h).fill("#e5e7eb");
  doc.fill("#ffffff").rect(x + w/2 - 0.75, y, 1.5, h).fill();
  doc.fill("#fecaca").rect(x, y, w/2, h).fill();
  doc.fill("#bfdbfe").rect(x + w/2, y, w/2, h).fill();
  const col = colorForScore(s);
  if (s >= 0) {
    const ww = (w/2) * s;
    doc.fill(col).rect(x + w/2, y, ww, h).fill();
  } else {
    const ww = (w/2) * -s;
    doc.fill(col).rect(x + w/2 - ww, y, ww, h).fill();
  }
  doc.restore();
}

function drawSparkline(
  doc: PDFKit.PDFDocument,
  x: number, y: number, w: number, h: number,
  series: SeriesPoint[] | null
) {
  doc.save();
  doc.rect(x, y, w, h).strokeColor("#e5e7eb").lineWidth(1).stroke();
  if (!series || series.length < 2) {
    doc.font("Helvetica").fontSize(9).fillColor("#6b7280").text("No series", x + 6, y + h/2 - 5);
    doc.restore();
    return;
  }
  const closes = series.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const pad = 6;

  const X = (i: number) => x + pad + (i * (w - 2*pad)) / (series.length - 1);
  const Y = (v: number) => {
    if (!(max > min)) return y + h/2;
    return y + h - pad - ((v - min) * (h - 2*pad)) / (max - min);
  };

  // soft fill
  doc.save();
  doc.moveTo(X(0), Y(closes[0]));
  for (let i = 1; i < closes.length; i++) doc.lineTo(X(i), Y(closes[i]));
  doc.lineTo(X(closes.length - 1), y + h - pad).lineTo(X(0), y + h - pad).closePath();
  doc.fillColor("#dbeafe").fill();
  doc.restore();

  // main line
  doc.moveTo(X(0), Y(closes[0]));
  for (let i = 1; i < closes.length; i++) doc.lineTo(X(i), Y(closes[i]));
  doc.strokeColor("#2563eb").lineWidth(1.5).stroke();

  // last point
  doc.circle(X(closes.length - 1), Y(closes[closes.length - 1]), 1.8).fill("#1f2937");
  doc.restore();
}

function pct(a?: number|null, b?: number|null) {
  if (a == null || b == null || !isFinite(a) || !isFinite(b) || b === 0) return null;
  return ((a - b) / b) * 100;
}

function indicationsLine(asset: string, factors: Record<string, number>) {
  // generic, slightly asset-aware copy
  const dxy = factors["dxy"] ?? 0;
  const rates = factors["rates"] ?? 0;
  const energy = factors["energy"] ?? 0;
  const tone  = factors["news-tone"] ?? 0;

  const headwinds: string[] = [];
  const tailwinds: string[] = [];

  if (dxy < -0.2) tailwinds.push("a softer dollar tone");
  if (dxy > 0.2) headwinds.push("dollar strength");

  if (rates < -0.2) tailwinds.push("easing yields");
  if (rates > 0.2) headwinds.push("higher yields");

  if (energy > 0.2) tailwinds.push("a firm energy backdrop");
  if (energy < -0.2) headwinds.push("a weaker energy backdrop");

  const news =
    tone > 0.2 ? "constructive news flow"
    : tone < -0.2 ? "cautious news flow"
    : "mixed news flow";

  const tail = tailwinds.length ? `Tailwinds include ${tailwinds.join(" and ")}.` : "";
  const head = headwinds.length ? ` Headwinds include ${headwinds.join(" and ")}.` : "";
  const name = ASSETS[asset]?.display || asset;

  return `From all indications, ${name} shows a near-term bias shaped by ${news}. ${tail}${head}`;
}

/* ----------------- API Handler ----------------- */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = baseUrlFromReq(req);
  const asset = (req.query.asset?.toString() || DEFAULT_ASSET).toUpperCase();
  const cfg = ASSETS[asset] || ASSETS[DEFAULT_ASSET];

  // 1) Headlines for asset
  const newsResp = await fetchJSON<{ items: NewsItem[] }>(`${base}/api/news?asset=${encodeURIComponent(asset)}`);
  const news = Array.isArray(newsResp?.items) ? newsResp!.items.slice(0, 7) : [];
  const sentiments = news.map((n) => scoreTitle(n.title || ""));
  const avgSent = sentiments.length ? sentiments.reduce((a,b)=>a+b,0) / sentiments.length : 0;

  // 2) Topics → factor scores (normalize lightly)
  const topics = cfg.topics.length ? cfg.topics : ["news-tone"];
  const factorScores: Record<string, number> = {};
  await Promise.all(
    topics.map(async (slug) => {
      const d = await fetchJSON<{ items: { title: string }[] }>(`${base}/api/topic/${slug}`);
      const items = Array.isArray(d?.items) ? d!.items.slice(0, 20) : [];
      const vals = items.map((i) => scoreTitle(i.title || ""));
      const avg = vals.length ? vals.reduce((a,b)=>a+b,0) / vals.length : 0;
      factorScores[slug] = clamp(avg / 3, -1, 1);
    })
  );

  // 3) Price series for asset (sparkline data)
  const seriesResp = await fetchJSON<{ symbol: string; series: SeriesPoint[]; lastClose: number | null }>(
    `${base}/api/series?symbol=${encodeURIComponent(cfg.yfSymbol)}&range=2mo&interval=1d`
  );
  const series = seriesResp?.series || [];
  const lastClose = seriesResp?.lastClose ?? null;

  // compute approx 7-day change
  let chg7: number | null = null;
  if (series.length >= 7) {
    chg7 = pct(series[series.length - 1].close, series[series.length - 7].close);
  } else if (series.length >= 5) {
    chg7 = pct(series[series.length - 1].close, series[series.length - 5].close);
  }

  // 4) PDF build
  const doc = new PDFDocument({ margin: 50, size: "LETTER" });
  const chunks: Buffer[] = [];
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${asset}_Brief.pdf`);
  doc.on("data", (c) => chunks.push(c));
  doc.on("end", () => res.send(Buffer.concat(chunks)));

  // Header logo
  const svgPath = path.resolve("./public/crowned_x.svg");
  const pngPath = path.resolve("./public/logo.png");
  try {
    if (fs.existsSync(svgPath)) {
      const svgMarkup = fs.readFileSync(svgPath, "utf8");
      SVGtoPDF(doc, svgMarkup, 460, 36, { width: 110, height: 110 });
    } else if (fs.existsSync(pngPath)) {
      doc.image(pngPath, 460, 40, { width: 110 });
    }
  } catch {}

  // Title block
  doc.font("Helvetica-Bold").fontSize(18).fillColor("#111827").text(cfg.display, 50, 50);
  doc.font("Helvetica").fontSize(10).fillColor("#475569").text("Monitor Everything that affects Finance", 50, 72);
  doc.fontSize(9).fillColor("#6b7280").text(`As of ${asOf()}`, 50, 86);

  // Sparkline
  const sparkX = 50, sparkY = 105, sparkW = 520, sparkH = 64;
  drawSparkline(doc, sparkX, sparkY, sparkW, sparkH, series);
  let chgText = "—";
  if (chg7 != null && Number.isFinite(chg7)) chgText = `${chg7 >= 0 ? "+" : ""}${chg7.toFixed(2)}% (≈7d)`;
  doc.font("Helvetica").fontSize(9).fillColor("#111827")
    .text(`Last close: ${lastClose != null ? lastClose.toFixed(2) : "—"}   •   ${chgText}`, sparkX + 8, sparkY + sparkH + 6);
  doc.moveDown(1);

  // Executive Summary
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Executive Summary", { underline: true });
  doc.moveDown(0.5);
  const bias =
    avgSent > 0.2 ? "tilted moderately positive"
    : avgSent < -0.2 ? "tilted cautious"
    : "mixed";
  doc.font("Helvetica").fontSize(10).fillColor("#111827").text(
    `${cfg.display} remains sensitive to macro conditions. Over the recent period, headline tone is ${bias}.`,
    { align: "justify" }
  );

  // Market Factors (bars from topic scores)
  doc.moveDown(1.2);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Market Factors", { underline: true });
  doc.moveDown(0.5);

  const left = 50, bw = 520, bh = 10, gap = 26;
  topics.forEach((slug, i) => {
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
    const explain =
      slug === "dxy" ? "Stronger dollar is typically a headwind; softer dollar can support." :
      slug === "rates" ? "Higher real yields tend to weigh on risk and gold; easing supports." :
      slug === "energy" ? "Energy backdrop influences inflation and risk tone." :
      slug === "btc-flows" ? "Net inflows and liquidity often support digital assets." :
      slug === "tech-ai" ? "Innovation cycle & earnings momentum shape equity risk tone." :
      "Headline tone blended from sources.";
    const y = doc.y + (i === 0 ? 4 : gap);
    const score = factorScores[slug] ?? 0;

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(label, left, y - 2);
    drawInfluenceBar(doc, left + 150, y - 6, bw - 150, bh, score);
    doc.font("Helvetica").fontSize(8.5).fillColor("#475569").text(explain, left, y + 10, { width: bw });
  });

  // Top Headlines
  doc.moveDown(2);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("Top Headlines", { underline: true });
  doc.moveDown(0.5);
  if (!news.length) {
    doc.font("Helvetica").fontSize(10).fillColor("#475569").text("No headlines available at the moment.");
  } else {
    news.forEach((h) => {
      const sc = scoreTitle(h.title || "");
      const color = colorForScore(clamp(sc / 3, -1, 1));
      doc.rect(doc.x, doc.y + 3, 6, 6).fill(color).strokeColor(color).stroke().fillColor("#111827");
      doc.moveUp(0.35);
      doc.font("Helvetica-Bold").fontSize(10).text(`   ${h.title || ""}`, { width: 500 });
      const meta = [h.source, h.pubDate ? new Date(h.pubDate).toLocaleString() : ""].filter(Boolean).join(" • ");
      if (meta) {
        doc.font("Helvetica").fontSize(8.5).fillColor("#64748b").text(meta);
      }
      doc.moveDown(0.25);
    });
  }

  // From all indications
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text("From All Indications", { underline: true });
  doc.moveDown(0.4);
  const summaryLine = indicationsLine(asset, factorScores);
  doc.font("Helvetica").fontSize(10).fillColor("#111827").text(summaryLine, { align: "justify" });

  // Disclaimer
  doc.moveDown(1.2);
  doc.font("Helvetica").fontSize(9).fillColor("#475569").text(
    "This document is generated automatically for informational purposes only and does not constitute financial advice or an investment recommendation.",
    { align: "center" }
  );

  doc.end();
}
