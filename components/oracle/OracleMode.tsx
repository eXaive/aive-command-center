"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

/* ---------------------------------------------
   Types
--------------------------------------------- */
interface Prediction {
  id: string;
  country: string;
  category: string;
  headline: string;
  prediction?: string;
  confidence: number;
  sentiment?: string;
  created_at: string;
  // optional future fields like causal_strength etc.
  causal_strength?: number | null;
}

/* ---------------------------------------------
   Audio helper (deep AI voice clips)
   Put your audio files in /public/audio:
   - oracle_accessing_future.mp3
   - oracle_reveal.mp3   (optional)
--------------------------------------------- */
let currentAudio: HTMLAudioElement | null = null;

function playOracleVoice(filename: string) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(`/audio/${filename}`);
    audio.volume = 1.0;
    currentAudio = audio;
    audio.play().catch(() => {});
  } catch (err) {
    console.warn("Oracle audio error:", err);
  }
}

/* ---------------------------------------------
   Simple scoring for "best" prediction
   (You can extend this later with accuracy, learning logs, etc.)
--------------------------------------------- */
function scorePrediction(p: Prediction) {
  const conf = p.confidence ?? 0;
  const causal = p.causal_strength ?? 0;

  // recency bonus (newer = slightly higher)
  const created = new Date(p.created_at).getTime();
  const now = Date.now();
  const ageMs = Math.max(1, now - created);
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const recencyBoost = 1 / (1 + ageDays / 10); // between ~1 and ~0

  // weights: confidence heavy, then causal, then recency
  return conf * 0.7 + causal * 0.2 + recencyBoost * 0.1;
}

/* ---------------------------------------------
   OracleMode Component
   Listens for: window.dispatchEvent(new CustomEvent("oracle-open"));
--------------------------------------------- */
export default function OracleMode() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "scanning" | "reveal">("idle");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  /* Listen for "oracle-open" events */
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setPhase("scanning");
      setPrediction(null);
      setLines([
        "ACCESSING FUTURE STREAM...",
        "ALIGNING CAUSAL VECTORS...",
        "SCANNING PROBABILITY GRID...",
      ]);

      // 🔊 Deep AI voice, instant (F2 + V1)
      playOracleVoice("oracle_accessing_future.mp3");

      fetchBestPrediction();
    };

    const handleClose = () => {
      setOpen(false);
      setPhase("idle");
      setPrediction(null);
      setLines([]);
    };

    window.addEventListener("oracle-open", handleOpen);
    window.addEventListener("oracle-close", handleClose);

    return () => {
      window.removeEventListener("oracle-open", handleOpen);
      window.removeEventListener("oracle-close", handleClose);
    };
  }, []);

  /* Fetch + choose best prediction */
  const fetchBestPrediction = async () => {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      setLines([
        "ACCESSING FUTURE STREAM...",
        "NO PREDICTIONS FOUND.",
        "PLEASE LOG NEW PREDICTIONS.",
      ]);
      setTimeout(() => setPhase("reveal"), 1200);
      return;
    }

    // Choose best by score
    const scored = (data as Prediction[]).map((p) => ({
      ...p,
      _score: scorePrediction(p),
    }));

    scored.sort((a, b) => (b._score ?? 0) - (a._score ?? 0));
    const best = scored[0];

    setTimeout(() => {
      setPrediction(best);
      setPhase("reveal");

      // Optional: reveal voice line
      // playOracleVoice("oracle_reveal.mp3");
    }, 1400);
  };

  const handleCloseClick = () => {
    setOpen(false);
    setPhase("idle");
    setPrediction(null);
    setLines([]);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Gold/Blue hybrid halo behind panel */}
          <motion.div
            className="absolute w-[420px] h-[420px] rounded-full -z-10"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: 0.9,
              scale: [0.9, 1.05, 0.95, 1],
              rotate: [0, 8, -4, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(248,250,252,0.36), transparent 65%)",
              boxShadow:
                "0 0 40px rgba(56,189,248,0.8), 0 0 80px rgba(250,204,21,0.55)",
            }}
          />

          {/* Thin rotating sigil ring */}
          <motion.div
            className="absolute w-[360px] h-[360px] rounded-full border border-cyan-400/40 -z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow:
                "0 0 18px rgba(56,189,248,0.5), 0 0 26px rgba(250,204,21,0.35)",
            }}
          />

          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 3,
                height: 3,
                backgroundColor: i % 2 === 0 ? "#38bdf8" : "#facc15",
                opacity: 0.75,
              }}
              initial={{
                x: (Math.random() - 0.5) * 220,
                y: (Math.random() - 0.5) * 220,
              }}
              animate={{
                x: [
                  (Math.random() - 0.5) * 220,
                  (Math.random() - 0.5) * 220,
                  (Math.random() - 0.5) * 220,
                ],
                y: [
                  (Math.random() - 0.5) * 220,
                  (Math.random() - 0.5) * 220,
                  (Math.random() - 0.5) * 220,
                ],
                opacity: [0.3, 0.9, 0.4],
              }}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          ))}

          {/* ORACLE PANEL */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-cyan-400/40 bg-slate-950/90 px-6 py-5 shadow-[0_0_40px_rgba(56,189,248,0.7)]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] tracking-[0.22em] uppercase text-cyan-200">
                A.I.V.E. ORACLE
              </div>
              <div className="text-[10px] text-slate-400">
                MODE:{" "}
                <span className="text-cyan-300">
                  {phase === "scanning" ? "SCANNING" : "PROPHECY"}
                </span>
              </div>
            </div>

            {/* Divider line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent mb-3" />

            {/* SCANNING PHASE */}
            {phase === "scanning" && (
              <div className="space-y-3">
                <motion.p
                  className="text-xs font-mono text-cyan-100"
                  initial={{ opacity: 0.4 }}
                  animate={{
                    opacity: [0.4, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                  style={{
                    textShadow:
                      "0 0 6px rgba(59,130,246,0.8), 0 0 16px rgba(250,204,21,0.6)",
                  }}
                >
                  ACCESSING FUTURE… PLEASE STAND BY.
                </motion.p>

                <div className="space-y-1">
                  {lines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      className="text-[11px] font-mono text-slate-300"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.25 }}
                    >
                      {"» "} {line}
                    </motion.div>
                  ))}
                </div>

                {/* Scan bar */}
                <div className="mt-4 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full w-1/3 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #38bdf8, #facc15, #38bdf8)",
                    }}
                    animate={{ x: ["-30%", "120%"] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            )}

            {/* PROPHECY PHASE */}
            {phase === "reveal" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-[11px] font-mono uppercase tracking-[0.18em] text-cyan-100"
                    style={{
                      textShadow:
                        "0 0 6px rgba(59,130,246,0.9), 0 0 24px rgba(250,204,21,0.7)",
                    }}
                  >
                    ORACLE PROPHECY
                  </p>
                  {prediction ? (
                    <motion.p
                      className="text-sm font-mono text-cyan-50"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        textShadow:
                          "0 0 6px rgba(59,130,246,0.9), 0 0 26px rgba(250,204,21,0.7)",
                      }}
                    >
                      {prediction.headline}
                    </motion.p>
                  ) : (
                    <p className="text-sm font-mono text-slate-300">
                      No prophecy available.
                    </p>
                  )}
                </div>

                {prediction && (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-300">
                      <div>
                        <span className="text-slate-400">CONFIDENCE</span>
                        <div className="text-cyan-300 mt-0.5">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">CATEGORY</span>
                        <div className="text-cyan-200 mt-0.5">
                          {prediction.category}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">REGION</span>
                        <div className="text-cyan-200 mt-0.5">
                          {prediction.country}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">TIMESTAMP</span>
                        <div className="text-cyan-200 mt-0.5">
                          {new Date(
                            prediction.created_at
                          ).toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    {prediction.prediction && (
                      <div className="mt-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          VECTOR SUMMARY
                        </span>
                        <p className="mt-1 text-[12px] text-slate-200 font-mono leading-snug">
                          {prediction.prediction}
                        </p>
                      </div>
                    )}

                    <motion.p
                      className="text-[11px] font-mono text-cyan-100 mt-3"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.3, 1, 0.6],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                    >
                      PATHWAY VERIFIED — THIS FUTURE GLOWS THE BRIGHTEST.
                    </motion.p>
                  </>
                )}
              </div>
            )}

            {/* Footer / Close */}
            <div className="mt-5 flex justify-between items-center">
              <button
                onClick={handleCloseClick}
                className="text-[10px] font-mono text-slate-400 hover:text-cyan-200"
              >
                EXIT ORACLE MODE
              </button>

              <span className="text-[9px] font-mono text-slate-500">
                A.I.V.E. • PREDICTION ORACLE
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
