'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// === Supabase Setup ===
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// === Grouped Country List ===
const COUNTRY_GROUPS = {
  Americas: [
    "United States", "Canada", "Mexico", "Brazil", "Argentina",
    "Chile", "Colombia", "Peru", "Venezuela"
  ],
  Caribbean: [
    "Jamaica", "Barbados", "Trinidad & Tobago", "The Bahamas",
    "Haiti", "Dominican Republic", "Puerto Rico", "Cuba"
  ],
  Europe: [
    "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands",
    "Switzerland", "Sweden", "Norway", "Poland", "Greece", "Ireland", "Portugal"
  ],
  "Middle East & Africa": [
    "Saudi Arabia", "United Arab Emirates", "Israel", "Nigeria", "South Africa",
    "Kenya", "Egypt", "Morocco"
  ],
  Asia: [
    "China", "Japan", "South Korea", "India", "Pakistan", "Bangladesh",
    "Indonesia", "Vietnam", "Thailand", "Philippines", "Malaysia",
    "Singapore", "Taiwan", "Hong Kong"
  ],
  Oceania: ["Australia", "New Zealand"]
};

export default function SubmitIntel({ selectedAgent }: { selectedAgent?: string | null }) {
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [country, setCountry] = useState('');
  const [sentiment, setSentiment] = useState('Neutral');
  const [impact, setImpact] = useState(50);
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [glowState, setGlowState] = useState<'thinking' | 'submitted' | 'error'>('thinking');
  const [confidence, setConfidence] = useState(0);
  const [highlighted, setHighlighted] = useState(false);

  const audioSubmit = useRef<HTMLAudioElement>(null);
  const audioError = useRef<HTMLAudioElement>(null);
  const audioAmbient = useRef<HTMLAudioElement>(null);
  const audioSelect = useRef<HTMLAudioElement>(null);

  const categories = [
    'General', 'Finance', 'Military Action', 'Outbreaks', 'Global Intel Agencies',
    'The Financial Quiz Show', 'The Financial Spelling Bee', 'Security',
    'Geopolitics', 'Energy', 'Health', 'Technology', 'Environment', 'Intelligence'
  ];

  /* ============================================================
     Confidence Auto-Score
  ============================================================ */
  useEffect(() => {
    let score = 0;
    if (headline.length > 3) score += 30;
    if (summary.length > 5) score += 30;
    if (country.length > 1) score += 20;
    if (impact > 10) score += 10;
    if (category) score += 10;
    setConfidence(score);
  }, [headline, summary, country, impact, category]);

  /* ============================================================
     Ambient Hum
  ============================================================ */
  useEffect(() => {
    const ambient = audioAmbient.current;
    if (ambient) {
      ambient.volume = 0.028;
      ambient.loop = true;
      ambient.play().catch(() => {});
    }
  }, []);

  /* ============================================================
     Agent auto-select category
  ============================================================ */
  useEffect(() => {
    if (!selectedAgent) return;
    const label = selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1);

    setCategory(label);
    setHighlighted(true);

    const ping = audioSelect.current;
    if (ping) {
      ping.volume = 0.25;
      ping.play().catch(() => {});
    }

    const timeout = setTimeout(() => setHighlighted(false), 1500);
    return () => clearTimeout(timeout);
  }, [selectedAgent]);

  /* ============================================================
     Submit Handler
  ============================================================ */
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const insertData = {
      headline,
      summary,
      country,
      sentiment,
      impact_score: impact,
      category,
      confidence,
      content_type: 'intel',
    };

    const { error } = await supabase.from('intel_entries').insert([insertData]);
    setSubmitting(false);

    if (error) {
      console.error('Error submitting intel:', error);
      setGlowState('error');
      audioError.current?.play();
      setMessage('❌ Submission failed.');
      setTimeout(() => setGlowState('thinking'), 2500);
    } else {
      setGlowState('submitted');
      audioSubmit.current?.play();
      setMessage('✅ Intel submitted successfully!');
      setHeadline('');
      setSummary('');
      setCountry('');
      setSentiment('Neutral');
      setImpact(50);
      setCategory('General');
      setConfidence(0);
      setTimeout(() => setGlowState('thinking'), 2500);
    }
  }

  /* ============================================================
     Glow State
  ============================================================ */
  const glowColor =
    glowState === 'submitted'
      ? 'from-yellow-400 via-amber-300 to-yellow-500'
      : glowState === 'error'
      ? 'from-red-500 via-rose-400 to-red-600'
      : 'from-blue-500 via-sky-400 to-blue-500';

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="bg-slate-900/70 rounded-xl p-5 border border-slate-800 shadow-md w-full max-w-md mb-6 relative overflow-hidden">

      {/* Sounds */}
      <audio ref={audioSubmit} src="/sounds/submit-chime.mp3" preload="auto" />
      <audio ref={audioError} src="/sounds/error-tone.mp3" preload="auto" />
      <audio ref={audioAmbient} src="/sounds/ambient-hum.mp3" preload="auto" />
      <audio ref={audioSelect} src="/sounds/agent-select.wav" preload="auto" />

      {/* Neural Glow Banner */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute top-0 left-0 w-full text-center py-1 text-[11px] font-semibold text-sky-100 backdrop-blur-md bg-gradient-to-r ${glowColor}`}
      >
        ⚙️ A.I.V.E. Neural Categorizer —{' '}
        {glowState === 'submitted'
          ? 'Upload Confirmed'
          : glowState === 'error'
          ? 'Transmission Error'
          : 'Active'}
      </motion.div>

      <h2 className="text-sky-400 font-semibold flex items-center gap-2 mb-2 mt-4">
        🧠 Submit Intel
      </h2>

      {/* Confidence Meter */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
        <motion.div
          className="h-2 bg-gradient-to-r from-blue-400 to-emerald-400"
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <p className="text-[10px] text-slate-400 mb-3">
        Intel Confidence: {confidence.toFixed(0)}%
      </p>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Headline */}
        <input
          type="text"
          placeholder="Headline / Event"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />

        {/* Summary */}
        <textarea
          placeholder="Summary / Description"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        />

        {/* COUNTRY DROPDOWN */}
        <label className="text-xs text-slate-400">Country</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Country</option>

          {Object.entries(COUNTRY_GROUPS).map(([group, list]) => (
            <optgroup key={group} label={group}>
              {list.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Category */}
        <label className="text-xs text-slate-400">Category</label>
        <motion.div
          animate={{
            boxShadow: highlighted
              ? '0 0 15px rgba(56,189,248,0.6)'
              : '0 0 0 rgba(0,0,0,0)',
            scale: highlighted ? 1.03 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white w-full focus:ring-1 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>

        {/* Sentiment */}
        <select
          value={sentiment}
          onChange={(e) => setSentiment(e.target.value)}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>

        {/* Impact */}
        <input
          type="number"
          placeholder="Impact Score"
          value={impact}
          onChange={(e) => setImpact(parseInt(e.target.value))}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        />

        {/* SUBMIT BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium disabled:opacity-50"
        >
          {submitting ? 'Transmitting...' : 'Submit to A.I.V.E.'}
        </motion.button>

        {message && (
          <p className="text-xs text-center text-slate-400 mt-2">{message}</p>
        )}
      </form>

      {/* Ripple overlay */}
      {glowState === 'submitted' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.5, 0, 0], scale: [1, 1.4, 1.6] }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-200/10 rounded-xl pointer-events-none"
        />
      )}
    </div>
  );
}
