"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import { supabase } from "@/lib/supabaseClient"; // assumes you already have this

type Props = {
  open: boolean;
  onClose: () => void;
  featureLabel?: string; // e.g. "Predictions" | "Causality" | "Purse Simulation"
};

export default function RequestAccessModal({ open, onClose, featureLabel }: Props) {
  const { region } = usePredictionFilter();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | "ok" | "err">(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setDone(null);

    try {
      const { error } = await supabase
        .from("access_requests") // ← create this table with columns: email, region, feature, note
        .insert([{ email, region, feature: featureLabel || "Unknown", note }]);

      if (error) throw error;
      setDone("ok");
      setEmail("");
      setNote("");
    } catch (err) {
      console.error(err);
      setDone("err");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative w-[92vw] max-w-lg rounded-2xl border border-blue-500/30 bg-slate-900/90 shadow-xl p-5"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-semibold text-blue-300">
              Request Awareness Access
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Feature: <span className="text-blue-200">{featureLabel}</span> • Region:{" "}
              <span className="text-blue-200">{region}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-slate-700 focus:ring-blue-500"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional: how you plan to use this feature."
                rows={3}
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white outline-none ring-1 ring-slate-700 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Request Access"}
              </button>

              {done === "ok" && (
                <p className="text-xs text-emerald-300">
                  ✅ Thanks! We’ll email you as soon as access opens up.
                </p>
              )}
              {done === "err" && (
                <p className="text-xs text-rose-300">
                  ❌ Something went wrong. Please try again.
                </p>
              )}
              <p className="text-[11px] text-slate-500">
                By submitting, you agree to be contacted about early access and research updates.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
