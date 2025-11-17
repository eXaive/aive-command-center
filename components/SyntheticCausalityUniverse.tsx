"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

interface CausalLink {
  id: number;
  cause_event: string;
  effect_event: string;
  confidence: number;
  clarity?: number;
  category?: string;
  region?: string;
  insight?: string;
}

export default function SyntheticCausalityUniverse() {
  const [links, setLinks] = useState<CausalLink[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch causal links from Supabase
  const fetchLinks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("causal_links")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) console.error("Error fetching causal links:", error);
    else setLinks(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();

    // 🔹 Subscribe to live causal link inserts
    const channel = supabase
      .channel("causal_links_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "causal_links" },
        () => {
          fetchLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // === UI ===
  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700 shadow-inner">
        <h2 className="text-blue-300 font-semibold text-lg mb-3">
          ✳️ Synthetic Causality Universe
        </h2>

        {loading ? (
          <p className="text-slate-500 italic py-4">Analyzing causal fields...</p>
        ) : links.length === 0 ? (
          <p className="text-slate-500 italic py-4">
            Awaiting synthetic events...
          </p>
        ) : (
          <ul className="space-y-3">
            {links.map((link) => (
              <motion.li
                key={link.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  expanded === link.id
                    ? "bg-blue-900/40 border-blue-400/60 shadow-[0_0_25px_rgba(0,150,255,0.3)]"
                    : "bg-slate-800/40 border-slate-700 hover:border-blue-500/40"
                }`}
                onClick={() =>
                  setExpanded(expanded === link.id ? null : link.id)
                }
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-slate-100 font-medium">
                  {link.cause_event} → {link.effect_event}
                </p>

                <div className="text-xs text-slate-400 mt-1">
                  Confidence: {link.confidence?.toFixed(1) ?? "?"}% · Clarity:{" "}
                  {link.clarity?.toFixed(1) ?? "?"}%
                </div>

                <AnimatePresence>
                  {expanded === link.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 text-sm text-slate-300 bg-slate-900/70 rounded-lg p-3 border border-slate-700"
                    >
                      {link.insight ? (
                        <p>{link.insight}</p>
                      ) : (
                        <p className="italic text-slate-500">
                          A.I.V.E. is formulating a causal insight...
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
