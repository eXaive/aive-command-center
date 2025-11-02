"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import NewsFeed from "@/components/NewsFeed";
import CrashWatch from "@/components/CrashWatch";

// ✅ Supabase connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type IntelItem = {
  id: number;
  headline: string;
  summary: string;
  region: string;
  sentiment_level: string | null;
  impact_score: number;
  created_at: string;
};

export default function CountryIntelPage() {
  const { country } = useParams() as { country: string };
  const router = useRouter();

  const [intelFeed, setIntelFeed] = useState<IntelItem[]>([]);
  const [sentimentAvg, setSentimentAvg] = useState<number>(0);
  const [risk, setRisk] = useState<number>(0);
  const [glowColor, setGlowColor] = useState<string>("blue");

  // 🌍 Map slug → ISO code
  const slug = (country ?? "").toString().trim().toLowerCase();
  const COUNTRY_MAP: Record<string, string> = {
    "united-states": "us", "china": "cn", "india": "in", "russia": "ru", "brazil": "br",
    "germany": "de", "france": "fr", "mexico": "mx", "saudi-arabia": "sa", "canada": "ca",
    "australia": "au", "united-kingdom": "gb", "japan": "jp", "south-korea": "kr",
    "italy": "it", "argentina": "ar", "turkey": "tr", "south-africa": "za", "indonesia": "id",
    "european-union": "eu", "nigeria": "ng", "egypt": "eg", "israel": "il", "iran": "ir",
    "pakistan": "pk", "singapore": "sg", "thailand": "th", "vietnam": "vn", "philippines": "ph",
    "uae": "ae", "qatar": "qa",
  };
  const isoCode = COUNTRY_MAP[slug] || "us";
  const flagUrl = `https://flagcdn.com/h80/${isoCode}.png`;

  // 🧠 Fetch regional intel
  useEffect(() => {
    const fetchIntel = async () => {
      const { data, error } = await supabase
        .from("intel_feed")
        .select("*")
        .eq("region", slug)
        .order("created_at", { ascending: false });

      if (error) console.error("❌ Error fetching intel:", error);
      else setIntelFeed(data || []);
    };
    fetchIntel();
  }, [slug]);

  // 🔁 Real-time listener
  useEffect(() => {
    const channel = supabase
      .channel(`intel-${slug}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "intel_feed" },
        (payload) => {
          const newIntel = payload.new as IntelItem;
          if (newIntel.region.toLowerCase() === slug) {
            setIntelFeed((prev) => [newIntel, ...prev]);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [slug]);

  // 🎚️ Calculate sentiment & risk dynamically
  useEffect(() => {
    if (intelFeed.length === 0) return;

    const scores = intelFeed.map((i) => i.impact_score || 50);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    setRisk(Math.round(avg));

    const pos = intelFeed.filter((i) => i.sentiment_level?.toLowerCase().includes("positive")).length;
    const neg = intelFeed.filter((i) => i.sentiment_level?.toLowerCase().includes("negative")).length;
    const total = intelFeed.length;
    const score = Math.round(((pos - neg) / total) * 100);
    setSentimentAvg(score);

    if (score > 20) setGlowColor("emerald");
    else if (score < -20) setGlowColor("red");
    else setGlowColor("blue");
  }, [intelFeed]);

  // ✨ Display
  const sentimentText =
    sentimentAvg > 20
      ? "🟢 Positive — constructive sentiment"
      : sentimentAvg < -20
      ? "🔴 Negative — cautious outlook"
      : "🟡 Neutral tone";

  const formattedCountry =
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Unknown";

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-slate-100 px-6 py-10 overflow-hidden">
      {/* Background Flag */}
      <div
        className="absolute inset-0 opacity-[0.05] flex justify-center items-start pointer-events-none"
        style={{
          backgroundImage: `url(https://flagcdn.com/w320/${isoCode}.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 60px",
          backgroundSize: "60%",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* 🌌 Flag Glow */}
            <div className="relative flex items-center justify-center w-16 h-12">
              <div
                className={`absolute inset-0 rounded-full blur-xl animate-pulse bg-${glowColor}-400/30`}
              />
              <Image
                src={flagUrl}
                alt={formattedCountry}
                width={64}
                height={48}
                className="rounded-sm border border-slate-600 bg-slate-900 relative z-10"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-blue-300">
                {formattedCountry} — Intelligence Dashboard
              </h1>
              <p className="text-sm text-slate-400">
                Live financial and geopolitical signals by region
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1.5 rounded-md border border-slate-600 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            ← Back
          </button>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm">
            <h2 className="text-xs uppercase text-slate-400 mb-1">Risk Index</h2>
            <div className={`text-3xl font-bold text-${glowColor}-400`}>{risk || "--"}</div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4 shadow-sm">
            <h2 className="text-xs uppercase text-slate-400 mb-1">Sentiment Level</h2>
            <div className={`text-3xl font-bold text-${glowColor}-400`}>
              {sentimentAvg > 0 ? `+${sentimentAvg}` : sentimentAvg}
            </div>
            <p className="text-sm text-slate-400 mt-1">{sentimentText}</p>
          </div>
        </div>

        {/* Intel Feed */}
        <section>
          <h2 className="text-lg font-semibold text-blue-300 mb-3">
            🧠 Regional Intel Feed
          </h2>
          {intelFeed.length === 0 ? (
            <p className="text-slate-400">No intel available yet for this region.</p>
          ) : (
            <div className="space-y-3">
              {intelFeed.map((item) => (
                <div
                  key={item.id}
                  className="border border-slate-700 rounded-lg p-4 bg-slate-800/60 hover:bg-slate-700 transition"
                >
                  <div className="text-slate-200 font-medium">{item.headline}</div>
                  <div className="text-sm text-slate-400 mt-1">{item.summary}</div>
                  <div className="text-xs text-slate-500 mt-2">
                    💥 {item.impact_score} | 🧭 {item.sentiment_level}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Global Comparison */}
        <section className="mt-10">
          <h3 className="text-sm uppercase text-slate-400 mb-2">
            🌐 Global Crash Overview
          </h3>
          <CrashWatch />
        </section>
      </div>
    </main>
  );
}
