'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeBackground from './GlobeBackground';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const regions = [
  { name: 'USA', sentiment: 'Positive', impact: 78 },
  { name: 'India', sentiment: 'Neutral', impact: 74 },
  { name: 'Canada', sentiment: 'Positive', impact: 82 },
  { name: 'Russia', sentiment: 'Negative', impact: 65 },
  { name: 'Brazil', sentiment: 'Positive', impact: 80 },
  { name: 'China', sentiment: 'Neutral', impact: 71 },
];

const getGlowColor = (s: string) =>
  s === 'Positive'
    ? 'rgba(16,185,129,0.7)'
    : s === 'Negative'
    ? 'rgba(239,68,68,0.6)'
    : 'rgba(245,158,11,0.7)';

export default function TrendPanel() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [intel, setIntel] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchIntel(region: string) {
    setLoading(true);
    const { data } = await supabase
      .from('intel_feed_public')
      .select('*')
      .eq('region', region)
      .order('created_at', { ascending: false })
      .limit(10);
    setIntel(data || []);
    setLoading(false);
  }

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    fetchIntel(region);
  };

  return (
    <div className="relative bg-slate-900/80 border border-slate-800 rounded-xl p-4 mt-6 w-full max-w-3xl mx-auto shadow-lg overflow-hidden backdrop-blur-sm">
      {/* 🌐 Pulsing Globe Background */}
      <GlobeBackground activeCountry={selectedRegion || undefined} />

      <h2 className="text-lg font-semibold text-blue-400 mb-3 text-center relative z-10">
        🌍 Global Trend Panel
      </h2>
      <p className="text-xs text-slate-400 text-center mb-4 relative z-10">
        Click a region to view its live intelligence feed.
      </p>

      {/* === Grid of Pulsing Regions === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center relative z-10">
        {regions.map((r) => (
          <motion.div
            key={r.name}
            className="p-4 rounded-lg bg-slate-800/70 border border-slate-700 cursor-pointer hover:scale-[1.05] transition"
            animate={{
              boxShadow: [
                `0 0 0px ${getGlowColor(r.sentiment)}`,
                `0 0 15px ${getGlowColor(r.sentiment)}`,
                `0 0 0px ${getGlowColor(r.sentiment)}`,
              ],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
            onClick={() => handleRegionClick(r.name)}
          >
            <p className="font-semibold text-blue-300 text-sm">{r.name}</p>
            <p className="text-slate-400 text-xs mt-1">
              {r.sentiment} • Impact {r.impact}
            </p>
          </motion.div>
        ))}
      </div>

      {/* === Regional Intel Modal === */}
      <AnimatePresence>
        {selectedRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedRegion(null)}
                className="absolute top-2 right-3 text-slate-400 hover:text-slate-200 text-lg"
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold text-blue-400 text-center mb-3">
                🌐 {selectedRegion} — Intelligence Feed
              </h3>

              {loading ? (
                <p className="text-slate-400 text-sm text-center">Loading intel...</p>
              ) : intel.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {intel.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-800/60 border border-slate-700 rounded-lg"
                    >
                      <p className="text-slate-300 font-semibold text-sm">
                        {item.headline}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">{item.summary}</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">
                        {item.category} • {new Date(item.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center">
                  No intelligence available for this region yet.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
