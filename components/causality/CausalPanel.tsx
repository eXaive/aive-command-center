"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShuffle, FiZap } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
  categoryColor?: string;
}

export default function CausalPanel({ open, onClose, onSubmit, categoryColor }: Props) {
  const [cause, setCause] = useState("");
  const [effect, setEffect] = useState("");
  const [reflection, setReflection] = useState("");
  const [confidence, setConfidence] = useState(0.75);
  const [reverseMode, setReverseMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const firstInputRef = useRef<HTMLInputElement>(null);

  /** Auto-focus when panel opens */
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [open]);

  /** Confidence auto-adjustment */
  useEffect(() => {
    let score = 0;
    if (cause.length > 2) score += 0.25;
    if (effect.length > 2) score += 0.25;
    if (reflection.length > 5) score += 0.25;
    if (reverseMode) score += 0.15;
    setConfidence(score);
  }, [cause, effect, reflection, reverseMode]);

  const glow = categoryColor || "rgba(168,85,247,0.7)"; // purple default

  async function handleSubmit() {
    if (loading) return;
    setLoading(true);

    const payload = {
      cause,
      effect,
      reflection,
      confidence,
      reverse: reverseMode,
      created_at: new Date().toISOString(),
    };

    await onSubmit(payload);
    setLoading(false);

    // Reset
    setCause("");
    setEffect("");
    setReflection("");
    setReverseMode(false);

    onClose();

    // Ripple to all AIVE modules
    window.dispatchEvent(new Event("AIVE_CAS_RIPPLE"));
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* === DIM + BLUR CINEMATIC OVERLAY === */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55, backdropFilter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-lg z-[60]"
            onClick={onClose}
          />

          {/* === MAIN PANEL === */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-slate-900/90 
                       border-l border-slate-700/60 backdrop-blur-xl z-[70] 
                       flex flex-col shadow-2xl"
            style={{
              boxShadow: `0 0 35px ${glow}`,
            }}
          >
            {/* === HEADER === */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
              <h2 className="text-blue-300 font-semibold text-lg">Causal Entry</h2>
              <button onClick={onClose}>
                <FiX className="text-slate-300 hover:text-white" size={22} />
              </button>
            </div>

            {/* === AI Suggestion Bar === */}
            <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-700/30 text-xs text-sky-300">
              💡 A.I.V.E. Insight: Add both <span className="text-purple-300">cause</span> and  
              <span className="text-purple-300"> effect</span> for stronger clarity.
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              
              {/* === Reverse Mode === */}
              <button
                className={`w-full flex items-center justify-center gap-2 py-2 text-xs rounded-md 
                  ${reverseMode ? "bg-purple-600/40 border-purple-400" : "bg-slate-800/60"}
                  border border-slate-700/50`}
                onClick={() => setReverseMode(!reverseMode)}
              >
                <FiShuffle size={16} />
                Reverse Mode (Cause ↔ Effect)
              </button>

              {/* === Cause === */}
              <input
                ref={firstInputRef}
                type="text"
                placeholder={reverseMode ? "Effect…" : "Cause…"}
                value={reverseMode ? effect : cause}
                onChange={(e) =>
                  reverseMode ? setEffect(e.target.value) : setCause(e.target.value)
                }
                className="w-full bg-slate-800/60 rounded-md px-3 py-2 text-sm outline-none border border-slate-700/50 focus:ring-1 focus:ring-blue-500"
              />

              {/* === Effect === */}
              <input
                type="text"
                placeholder={reverseMode ? "Cause…" : "Effect…"}
                value={reverseMode ? cause : effect}
                onChange={(e) =>
                  reverseMode ? setCause(e.target.value) : setEffect(e.target.value)
                }
                className="w-full bg-slate-800/60 rounded-md px-3 py-2 text-sm outline-none border border-slate-700/50 focus:ring-1 focus:ring-blue-500"
              />

              {/* === Reflection === */}
              <textarea
                placeholder="Reflection (optional)…"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/60 rounded-md px-3 py-2 text-sm outline-none border border-slate-700/50 focus:ring-1 focus:ring-blue-500"
              />

              {/* === Confidence Meter === */}
              <div className="text-xs text-slate-400">Confidence Score</div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {(confidence * 100).toFixed(0)}%
              </p>
            </div>

            {/* === SUBMIT BUTTON === */}
            <div className="p-4 border-t border-slate-700/40">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.03 }}
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md 
                           text-sm font-medium shadow-md shadow-blue-900/20 disabled:opacity-50"
              >
                {loading ? "Transmitting…" : "Submit to A.I.V.E."}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
