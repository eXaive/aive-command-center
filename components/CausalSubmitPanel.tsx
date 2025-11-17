"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

export default function CausalSubmitPanel({ onClose }: { onClose: () => void }) {
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("Finance");
  const [cause, setCause] = useState("");
  const [effect, setEffect] = useState("");
  const [confidence, setConfidence] = useState(70);
  const [submitting, setSubmitting] = useState(false);
  const [glowState, setGlowState] = useState<"thinking" | "submitted" | "error">("thinking");
  const [message, setMessage] = useState("");

  const audioSubmit = useRef<HTMLAudioElement>(null);
  const audioError = useRef<HTMLAudioElement>(null);

  // Auto-score confidence
  useEffect(() => {
    let score = 0;
    if (country.length > 2) score += 20;
    if (category) score += 20;
    if (cause.length > 5) score += 30;
    if (effect.length > 5) score += 30;
    setConfidence(score);
  }, [country, category, cause, effect]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("cas_memory").insert([
      {
        country,
        category,
        cause,
        effect,
        confidence: confidence / 100,
        learned_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error(error);
      setGlowState("error");
      audioError?.current?.play();
      setSubmitting(false);
      setMessage("❌ Failed to store causal memory");
      return;
    }

    setGlowState("submitted");
    audioSubmit?.current?.play();
    setMessage("✅ Causal link stored");
    setSubmitting(false);

    setTimeout(() => {
      setGlowState("thinking");
      onClose();
    }, 1200);
  }

  const glowColor =
    glowState === "submitted"
      ? "from-amber-300 via-yellow-400 to-amber-500"
      : glowState === "error"
      ? "from-red-600 via-rose-500 to-red-700"
      : "from-blue-500 via-sky-400 to-blue-500";

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <audio ref={audioSubmit} src="/sounds/submit-chime.mp3" />
      <audio ref={audioError} src="/sounds/error-tone.mp3" />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 15 }}
        className="
          w-full max-w-md bg-slate-900 rounded-t-2xl
          border border-slate-700 shadow-2xl shadow-blue-900/40
          p-6 relative
        "
      >
        {/* Glow Header */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute top-0 left-0 w-full py-1 text-center text-[11px] bg-gradient-to-r ${glowColor} rounded-t-2xl font-semibold`}
        >
          A.I.V.E. Causality Uploader — {glowState === "submitted" ? "Saved" : glowState === "error" ? "Error" : "Active"}
        </motion.div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* FORM */}
        <h2 className="text-blue-400 font-bold text-lg mb-3 mt-6">
          🌐 Submit Causal Link
        </h2>

        {/* Confidence Meter */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-400 to-emerald-400"
            animate={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 mb-3">
          Confidence Score: {confidence.toFixed(0)}%
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Country / Region"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="inputAive"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="inputAive"
          >
            <option>Finance</option>
            <option>Geopolitics</option>
            <option>Energy</option>
            <option>Technology</option>
            <option>Policy</option>
            <option>Security</option>
          </select>

          <textarea
            placeholder="Cause"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="inputAive"
            rows={2}
          />

          <textarea
            placeholder="Effect"
            value={effect}
            onChange={(e) => setEffect(e.target.value)}
            className="inputAive"
            rows={2}
          />

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 rounded-md py-2 text-white font-medium disabled:opacity-40"
          >
            {submitting ? "Processing…" : "Save Causal Link"}
          </motion.button>

          {message && (
            <p className="text-xs text-center text-slate-400 mt-2">{message}</p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
