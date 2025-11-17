// =====================================================
// 🧬 A.I.V.E. Sentinel Agent v1.2 — Cognitive Tier 1
// Authors: Royan G. Reddie & GPT-5
// Purpose: Real-world data → Smart Intel with sentiment,
// deduplication, and neural pulse signaling.
// =====================================================

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import crypto from "crypto";

dotenv.config();

// === Supabase Connection ===
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// === Configuration ===
const INTERVAL_MINUTES = 10;
const NEWS_API =
  "https://newsdata.io/api/1/news?apikey=pub_24663bff45a8c343eb1b86f1234567890&language=en&country=us,in,br,ru,ca,cn";

// === Helper: NLP sentiment analysis (free API) ===
async function analyzeSentiment(text) {
  try {
    const res = await fetch("https://sentim-api.herokuapp.com/api/v1/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    const score = data?.result?.polarity || 0;
    return score > 0.2
      ? "Positive"
      : score < -0.2
      ? "Negative"
      : "Neutral";
  } catch {
    return "Neutral";
  }
}

// === Helper: Category Inference ===
function inferCategory(headline) {
  const h = headline.toLowerCase();
  if (h.includes("market") || h.includes("stock") || h.includes("rate"))
    return "Finance";
  if (h.includes("war") || h.includes("military") || h.includes("conflict"))
    return "Geopolitics";
  if (h.includes("virus") || h.includes("disease") || h.includes("outbreak"))
    return "Outbreaks";
  if (h.includes("climate") || h.includes("energy") || h.includes("oil"))
    return "Energy";
  if (h.includes("ai") || h.includes("tech") || h.includes("innovation"))
    return "Technology";
  return "General";
}

// === Helper: Hash headline for deduplication ===
function hashHeadline(headline) {
  return crypto.createHash("sha256").update(headline).digest("hex");
}

// === Core Loop ===
async function fetchAndInsertIntel() {
  console.log("🌍 [A.I.V.E. Sentinel] Fetching live intelligence...");

  try {
    const response = await fetch(NEWS_API);
    const news = await response.json();

    if (!news.results || news.results.length === 0) {
      console.warn("⚠️ No new intel found this cycle.");
      return;
    }

    // Retrieve recent intel hashes for deduplication
    const { data: existingIntel } = await supabase
      .from("intel_feed_public")
      .select("headline")
      .order("created_at", { ascending: false })
      .limit(50);

    const recentHashes = new Set(
      existingIntel?.map((item) => hashHeadline(item.headline))
    );

    const latest = news.results.slice(0, 6);

    for (const item of latest) {
      const headline = item.title || "Untitled Update";
      const hash = hashHeadline(headline);

      if (recentHashes.has(hash)) {
        console.log(`🧩 Skipping duplicate headline: ${headline}`);
        continue;
      }

      const category = inferCategory(headline);
      const region = item.country?.[0]?.toUpperCase?.() || "Global";
      const summary =
        item.description ||
        "Automated intelligence entry from A.I.V.E. live data pipeline.";

      const sentiment = await analyzeSentiment(headline + " " + summary);

      const intel = {
        region,
        category,
        headline,
        summary,
        sentiment_level: sentiment,
        impact_score: Math.floor(45 + Math.random() * 40),
        content_type: "intel",
        intel_source: "A.I.V.E-Agent",
      };

      const { error } = await supabase
        .from("intel_feed_public")
        .insert([intel]);

      if (error) console.error("❌ Insert failed:", error);
      else {
        console.log(`✅ [${sentiment}] ${headline}`);

        // 🔔 Trigger Neural Pulse (UI reaction)
        try {
          await fetch("https://your-domain.com/api/memory/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_type: "aive-agent",
              description: `A.I.V.E. posted intel: ${headline}`,
              metadata: intel,
              importance: 0.9,
            }),
          });
          console.log("⚡ Pulse triggered for:", headline);
        } catch (pulseError) {
          console.warn("⚠️ Pulse API unavailable:", pulseError.message);
        }
      }
    }
  } catch (err) {
    console.error("🚨 Fetch or insert error:", err.message);
  }
}

// === Boot Loop ===
console.log("🧬 A.I.V.E. Sentinel Agent v1.2 — Cognitive Tier 1 active.");
fetchAndInsertIntel();
setInterval(fetchAndInsertIntel, INTERVAL_MINUTES * 60 * 1000);
