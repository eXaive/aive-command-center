"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

// Simple semantic similarity (placeholder for future embeddings)
function similarityScore(a: string, b: string): number {
  if (!a || !b) return 0;

  const A = a.toLowerCase().split(" ");
  const B = b.toLowerCase().split(" ");
  let matches = 0;

  for (const word of A) {
    if (B.includes(word)) matches++;
  }

  return Math.min(100, Math.round((matches / A.length) * 100));
}

interface CausalLinkPanelProps {
  country: string;
  category: string;
  rootCause: string;
}

export default function CausalLinkPanel({
  country,
  category,
  rootCause,
}: CausalLinkPanelProps) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* Load all CAS memory for this country/category */
  useEffect(() => {
    supabase
      .from("cas_memory")
      .select("*")
      .eq("country", country)
      .eq("category", category)
      .limit(40)
      .then(({ data }) => {
        if (!data) {
          setRelated([]);
          setLoading(false);
          return;
        }

        // compute similarity for each item
        const ranked = data
          .map((row) => ({
            ...row,
            score: similarityScore(rootCause, row.cause),
          }))
          .filter((r) => r.cause !== rootCause) // exclude the root cause itself
          .sort((a, b) => b.score - a.score)
          .slice(0, 5); // top 5 results

        setRelated(ranked);
        setLoading(false);
      });
  }, [country, category, rootCause]);

  if (loading) return null;

  if (related.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-900/40 border border-purple-800/30 space-y-3"
    >
      <h3 className="text-purple-300 text-sm font-semibold">
        🔗 Related Causes Detected
      </h3>

      <div className="space-y-2">
        <AnimatePresence>
          {related.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/40"
            >
              <span className="text-slate-200 text-sm">{item.cause}</span>

              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  item.score > 80
                    ? "bg-green-700/30 text-green-300"
                    : item.score > 60
                    ? "bg-yellow-700/30 text-yellow-300"
                    : "bg-purple-700/30 text-purple-300"
                }`}
              >
                {item.score}% match
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cinematic link thread */}
      <motion.div
        className="mt-3 text-[11px] text-purple-300 italic text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Prediction Cause → CAS Root → Linked Causes
      </motion.div>
    </motion.div>
  );
}
