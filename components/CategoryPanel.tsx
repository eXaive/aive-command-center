'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CategoryPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    headline: '',
    summary: '',
    sentiment_level: 'Neutral',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const { error } = await supabase.from('intel_feed').insert([
      {
        ...formData,
        category: 'finance',
        impact_score: Math.floor(Math.random() * 100),
        confidence_score: Math.floor(Math.random() * 100),
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error('Error inserting intel:', error);
      setMessage('❌ Submission failed.');
    } else {
      setMessage('✅ Finance intel submitted successfully.');
      setFormData({
        region: '',
        headline: '',
        summary: '',
        sentiment_level: 'Neutral',
      });
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 left-6 px-4 py-2 text-sm rounded-md z-50 transition-all shadow-md ${
          isOpen
            ? 'bg-rose-600 hover:bg-rose-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? 'Close Finance Panel' : 'Finance Intel'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 left-0 w-80 h-[80vh] bg-slate-900 border-r border-slate-700 p-4 shadow-2xl rounded-tr-2xl overflow-y-auto z-40"
          >
            <h2 className="text-blue-400 text-lg font-semibold mb-2">
              Finance Intelligence
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Submit key market insights, events, or signals relevant to finance.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="region"
                placeholder="Region / Country"
                value={formData.region}
                onChange={handleChange}
                className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <input
                type="text"
                name="headline"
                placeholder="Headline / Event"
                value={formData.headline}
                onChange={handleChange}
                className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <textarea
                name="summary"
                placeholder="Summary / Description"
                value={formData.summary}
                onChange={handleChange}
                rows={3}
                className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <select
                name="sentiment_level"
                value={formData.sentiment_level}
                onChange={handleChange}
                className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option>Positive</option>
                <option>Neutral</option>
                <option>Negative</option>
              </select>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 mt-2 font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Intel'}
              </button>

              {message && (
                <p className="text-xs mt-2 text-center text-slate-400">{message}</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
