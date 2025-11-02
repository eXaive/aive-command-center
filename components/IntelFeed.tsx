'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function IntelFeed() {
  const [intel, setIntel] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});
  const [countdown, setCountdown] = useState<{ [key: number]: number }>({});
  const [filter, setFilter] = useState('The Financial Quiz Show');

  const beep = useRef<HTMLAudioElement | null>(null);
  const ding = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beep.current = new Audio('/sounds/beep.mp3');
    ding.current = new Audio('/sounds/ding.mp3');
  }, []);

  useEffect(() => {
    fetchIntel();
    const channel = supabase
      .channel('intel_feed_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'intel_feed_public' }, () => fetchIntel())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [filter]);

  async function fetchIntel() {
    let query = supabase
      .from('intel_feed_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);
    if (filter !== 'All') query = query.eq('category', filter);
    const { data, error } = await query;
    if (!error && data) setIntel(data);
  }

  const handleToggle = (id: number) => setExpandedId(expandedId === id ? null : id);

  const startCountdown = (id: number, seconds: number) => {
    setCountdown((prev) => ({ ...prev, [id]: seconds }));
    const timer = setInterval(() => {
      setCountdown((prev) => {
        const current = prev[id] ?? 0;
        if (current <= 1) {
          clearInterval(timer);
          ding.current?.play().catch(() => {});
          setRevealedAnswers((prev) => ({ ...prev, [id]: true }));
          return { ...prev, [id]: 0 };
        }
        beep.current?.play().catch(() => {});
        return { ...prev, [id]: current - 1 };
      });
    }, 1000);
  };

  const filters = [
    'The Financial Quiz Show',
    'Finance',
    'Politics',
    'Military Action',
    'Outbreaks',
    'Global Intel Agencies',
  ];

  const getSentimentColor = (s: string) =>
    s === 'Positive'
      ? 'border-emerald-500'
      : s === 'Negative'
      ? 'border-rose-500'
      : s === 'Neutral'
      ? 'border-amber-500'
      : 'border-slate-700';

  const getCategoryGradient = (category: string) => {
    if (category === 'The Financial Quiz Show')
      return 'from-yellow-500/40 via-amber-400/20 to-yellow-600/30';
    return 'from-sky-600/30 via-blue-500/20 to-indigo-600/30';
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 mt-4 w-full max-w-lg mx-auto shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sky-400 font-semibold flex items-center gap-2">
          🧠 Live Intel Feed
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 text-slate-200 text-xs rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          {filters.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {intel.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-lg bg-slate-800/70 border-l-4 ${getSentimentColor(
                item.sentiment_level
              )} hover:bg-slate-800/90 transition relative overflow-hidden`}
            >
              {/* Pulsing Gradient Strip */}
              <motion.div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getCategoryGradient(
                  item.category
                )}`}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  boxShadow: [
                    '0 0 4px rgba(255,255,255,0.2)',
                    '0 0 12px rgba(255,255,255,0.3)',
                    '0 0 4px rgba(255,255,255,0.2)',
                  ],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-300 text-sm font-semibold">
                    {item.region || item.category}
                  </p>
                  <p className="text-white font-bold text-base">{item.headline}</p>
                  <p className="text-slate-400 text-xs italic mt-1">{item.category}</p>
                </div>
                <p className="text-[10px] text-slate-500">
                  {new Date(item.created_at).toLocaleTimeString()}
                </p>
              </div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-sm text-slate-300 bg-slate-900/60 p-3 rounded-md border border-slate-800"
                  >
                    {item.content_type === 'quiz' ? (
                      <div>
                        <p className="text-sky-400 font-medium mb-2">
                          💡 Financial Quiz Question
                        </p>
                        {item.summary && (
                          <p className="text-slate-400 mb-2 italic">{item.summary}</p>
                        )}

                        <ul className="flex flex-col gap-2">
                          {item.quiz_answers?.map((ans: string, i: number) => {
                            const revealed = revealedAnswers[item.id];
                            const isCorrect = ans === item.correct_answer;
                            return (
                              <motion.li
                                key={i}
                                className={`px-3 py-2 rounded-md border transition ${
                                  revealed
                                    ? isCorrect
                                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_#10b98150]'
                                      : 'bg-slate-800 border-slate-700 text-slate-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-200'
                                }`}
                              >
                                {ans}
                              </motion.li>
                            );
                          })}
                        </ul>

                        <div className="mt-3 text-center">
                          {revealedAnswers[item.id] ? (
                            <p className="text-emerald-400 text-sm font-semibold">
                              ✅ Answer Revealed
                            </p>
                          ) : countdown[item.id] && countdown[item.id] > 0 ? (
                            <motion.p
                              key={countdown[item.id]}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="text-amber-400 font-bold text-lg"
                            >
                              ⏳ Revealing in {countdown[item.id]}s...
                            </motion.p>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startCountdown(item.id, 10);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1.5 px-4 text-sm transition"
                            >
                              Start Countdown ⏱
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300">{item.summary}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
