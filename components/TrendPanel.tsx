"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeBackground from './GlobeBackground';
import CountryFlag from './CountryFlag';
import { createClient } from '@supabase/supabase-js';
import { usePredictionFilter } from "@/context/PredictionFilterContext";

// === Supabase Setup ===
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// === Unified Country List (replacing regions) ===
const COUNTRIES = [
  { name: 'United States', code: 'us', sentiment: 'Positive', impact: 78 },
  { name: 'Canada', code: 'ca', sentiment: 'Positive', impact: 82 },
  { name: 'Mexico', code: 'mx', sentiment: 'Neutral', impact: 64 },

  { name: 'Brazil', code: 'br', sentiment: 'Positive', impact: 80 },
  { name: 'Argentina', code: 'ar', sentiment: 'Neutral', impact: 68 },
  { name: 'Chile', code: 'cl', sentiment: 'Positive', impact: 74 },
  { name: 'Colombia', code: 'co', sentiment: 'Neutral', impact: 70 },

  { name: 'Jamaica', code: 'jm', sentiment: 'Neutral', impact: 65 },
  { name: 'Trinidad & Tobago', code: 'tt', sentiment: 'Positive', impact: 72 },
  { name: 'Barbados', code: 'bb', sentiment: 'Neutral', impact: 60 },

  { name: 'United Kingdom', code: 'gb', sentiment: 'Neutral', impact: 75 },
  { name: 'Germany', code: 'de', sentiment: 'Positive', impact: 79 },
  { name: 'France', code: 'fr', sentiment: 'Neutral', impact: 71 },
  { name: 'Spain', code: 'es', sentiment: 'Neutral', impact: 69 },
  { name: 'Italy', code: 'it', sentiment: 'Neutral', impact: 67 },
  { name: 'Netherlands', code: 'nl', sentiment: 'Positive', impact: 78 },
  { name: 'Sweden', code: 'se', sentiment: 'Neutral', impact: 70 },

  { name: 'China', code: 'cn', sentiment: 'Neutral', impact: 71 },
  { name: 'Japan', code: 'jp', sentiment: 'Positive', impact: 76 },
  { name: 'South Korea', code: 'kr', sentiment: 'Positive', impact: 77 },
  { name: 'India', code: 'in', sentiment: 'Neutral', impact: 74 },

  { name: 'Nigeria', code: 'ng', sentiment: 'Neutral', impact: 63 },
  { name: 'Kenya', code: 'ke', sentiment: 'Neutral', impact: 60 },
  { name: 'South Africa', code: 'za', sentiment: 'Neutral', impact: 66 },

  { name: 'Australia', code: 'au', sentiment: 'Positive', impact: 80 },
  { name: 'New Zealand', code: 'nz', sentiment: 'Positive', impact: 77 },
];

// === Sentiment → Glow Color ===
const getGlowColor = (s: string) =>
  s === 'Positive'
    ? 'rgba(16,185,129,0.7)'
    : s === 'Negative'
    ? 'rgba(239,68,68,0.6)'
    : 'rgba(245,158,11,0.7)';

export default function TrendPanel() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [intel, setIntel] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [pulse, setPulse] = useState(false);

  // 🌐 GLOBAL FILTER CONTEXT
  const { setCountry: setGlobalCountry } = usePredictionFilter();

  // === Listen for global AIVE pulse ===
  useEffect(() => {
    const fn = () => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1600);
    };
    window.addEventListener('aive-pulse', fn);
    return () => window.removeEventListener('aive-pulse', fn);
  }, []);

  // === Auto-seed demo intel (country-based) ===
  useEffect(() => {
    async function autoSeedIntel() {
      const { count } = await supabase
        .from('intel_feed_public')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        console.log("🧠 Seeding A.I.V.E. intel with COUNTRY fields...");

        const DEMO = [
          {
            country: "India",
            category: "Outbreaks",
            headline: "Dengue cases rise in southern states",
            summary: "Kerala and Tamil Nadu report sharp increases.",
          },
          {
            country: "United States",
            category: "Finance",
            headline: "Federal Reserve holds rates steady",
            summary: "Markets react positively to dovish tone.",
          },
          {
            country: "China",
            category: "Technology",
            headline: "Quantum Computing Lab opens in Beijing",
            summary: "Focus on secure communications breakthroughs.",
          },
          {
            country: "Brazil",
            category: "Environment",
            headline: "Amazon reforestation expands 15%",
            summary: "Government-backed project showing progress.",
          },
          {
            country: "Canada",
            category: "Technology",
            headline: "Vancouver becomes AI startup hub",
            summary: "Research incentives attract top global talent.",
          }
        ];

        const { error } = await supabase.from('intel_feed_public').insert(DEMO);
        if (error) console.error("❌ Seed failed:", error);
        else console.log("✅ Country-based intel seeded.");
      }
    }
    autoSeedIntel();
  }, []);

  // === Fetch intel for selected country ===
  async function fetchIntel(country: string) {
    setLoading(true);
    const { data } = await supabase
      .from('intel_feed_public')
      .select('*')
      .eq('country', country)
      .order('created_at', { ascending: false })
      .limit(20);

    setIntel(data || []);
    setActiveCategory('All');
    setLoading(false);
  }

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country);
    fetchIntel(country);

    // 🔥 GLOBAL SYNC
    setGlobalCountry(country);
  };

  const categories = ['All', ...Array.from(new Set(intel.map((i) => i.category)))];

  const filteredIntel =
    activeCategory === 'All'
      ? intel
      : intel.filter((i) => i.category === activeCategory);

  // === Render ====================================================
  return (
    <motion.div
      animate={{
        boxShadow: pulse
          ? ['0 0 10px #38bdf8', '0 0 40px #0ea5e9', '0 0 10px #38bdf8']
          : '0 0 0 transparent',
      }}
      transition={{ duration: 1.3 }}
      className="relative bg-slate-900/80 border border-slate-800 rounded-xl p-4 mt-6 w-full max-w-3xl mx-auto shadow-lg backdrop-blur-sm"
    >
      <GlobeBackground activeCountry={selectedCountry || undefined} />

      <h2 className="text-lg font-semibold text-blue-400 mb-3 text-center">
        🌍 Global Trend Panel
      </h2>
      <p className="text-xs text-slate-400 text-center mb-4">
        Click a country to view its live intelligence feed.
      </p>

      {/* === Country Grid === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center relative z-10">
        {COUNTRIES.map((c) => (
          <motion.div
            key={c.name}
            className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 cursor-pointer hover:scale-[1.05] transition flex flex-col items-center"
            animate={{
              boxShadow: [
                `0 0 0px ${getGlowColor(c.sentiment)}`,
                `0 0 15px ${getGlowColor(c.sentiment)}`,
                `0 0 0px ${getGlowColor(c.sentiment)}`,
              ],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
            onClick={() => handleCountryClick(c.name)}
          >
            <div className="flex items-center gap-2">
              <CountryFlag code={c.code} />
              <p className="font-semibold text-blue-300 text-sm">{c.name}</p>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              {c.sentiment} • Impact {c.impact}
            </p>
          </motion.div>
        ))}
      </div>

      {/* === Modal Overlay === */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute top-3 right-4 text-slate-400 hover:text-slate-200 text-xl"
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold text-blue-400 text-center mb-3 flex justify-center items-center gap-2">
                <CountryFlag
                  code={COUNTRIES.find((x) => x.name === selectedCountry)?.code || ''}
                />
                🌐 {selectedCountry} — Intelligence Feed
              </h3>

              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Intel Cards */}
              {loading ? (
                <p className="text-slate-400 text-sm text-center">Loading intel...</p>
              ) : filteredIntel.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                  {filteredIntel.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg"
                    >
                      <p className="text-slate-300 font-semibold text-sm">
                        {item.headline}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{item.summary}</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">
                        {item.category} •{" "}
                        {item.created_at
                          ? new Date(item.created_at).toLocaleTimeString()
                          : "recently"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center">
                  No intelligence available for this country yet.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
