/* -------------------------------------------------------------
   CAUSAL INSIGHT + QUIZ + COUNTDOWN + VERIFICATION CYCLE
   + LEARNING LOG + CAUSAL STRENGTH ENGINE (A.I.V.E. Evolution)
--------------------------------------------------------------*/

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { playSentimentTone } from "@/lib/audio/triggerTone";
import { useNeuralState } from "@/context/NeuralStateContext";

import { updateCausalStrength } from "@/lib/updateCausalStrength"; // <-- IMPORTANT
import CausalClusterGraph from "@/components/CausalClusterGraph";

interface Prediction {
  id: string;
  country: string;
  category: string;
  headline: string;
  prediction?: string;
  confidence: number;
}

/* -------------------------------------------------------------
   Helper → Write to prediction_learning_log
--------------------------------------------------------------*/
async function logLearning({
  prediction,
  cas,
  selectedAnswer,
  isCorrect,
  autoVerified,
  clarity,
  sentiment,
  focusCategory,
}: any) {
  return await supabase.from("prediction_learning_log").insert([
    {
      prediction_id: prediction.id,
      headline: prediction.headline,
      prediction_text: prediction.prediction,
      prediction_confidence: prediction.confidence,

      cas_id: cas?.id || null,
      cas_cause: cas?.cause || null,
      cas_effect: cas?.effect || null,
      cas_confidence: cas?.confidence || null,

      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      auto_verified: autoVerified,

      sentiment,
      clarity_level: clarity,
      awareness_state: focusCategory || prediction.category,

      country: prediction.country,
      category: prediction.category,
    },
  ]);
}

/* -------------------------------------------------------------
   COMPONENT
--------------------------------------------------------------*/
function CausalInsightWithQuiz({ prediction }: { prediction: Prediction }) {
  const [cas, setCas] = useState<any>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const [timeLeft, setTimeLeft] = useState(8);
  const [countdownActive, setCountdownActive] = useState(true);

  const [related, setRelated] = useState<string[]>([]);

  // Awareness from A.I.V.E. brain
  const { clarity, sentiment, focusCategory } = useNeuralState();

  /* -------------------------------------------------------------
     Load CAS for this prediction
  --------------------------------------------------------------*/
  useEffect(() => {
    supabase
      .from("cas_memory")
      .select("*")
      .eq("country", prediction.country)
      .eq("category", prediction.category)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.length > 0) {
          setCas(data[0]);
        } else {
          setCas({
            cause: "Underlying macroeconomic forces",
            effect: prediction.headline,
            reflection: "A.I.V.E.'s fallback causal reasoning.",
            confidence: prediction.confidence,
          });
        }
      });
  }, [prediction]);

  /* -------------------------------------------------------------
     Load related causes for graph
  --------------------------------------------------------------*/
  useEffect(() => {
    if (!cas) return;

    supabase
      .from("cas_memory")
      .select("cause")
      .eq("category", prediction.category)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data?.length) {
          const unique = [...new Set(data.map((d) => d.cause))].filter(
            (c) => c !== cas.cause
          );
          setRelated(unique.slice(0, 6));
        } else {
          setRelated([
            "Sentiment Pressure",
            "Liquidity Drift",
            "Policy Signals",
            "Macro Pulse",
          ]);
        }
      });
  }, [cas]);

  /* -------------------------------------------------------------
     Reset panel when CAS changes
  --------------------------------------------------------------*/
  useEffect(() => {
    if (!cas) return;

    setSelected(null);
    setResult(null);
    setTimeLeft(8);
    setCountdownActive(true);
  }, [cas]);

  /* -------------------------------------------------------------
     Countdown
  --------------------------------------------------------------*/
  useEffect(() => {
    if (!countdownActive || result) return;

    if (timeLeft === 0) {
      autoVerify();
      return;
    }

    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, countdownActive, result]);

  /* -------------------------------------------------------------
     AUTO VERIFY (A.I.V.E. verified)
  --------------------------------------------------------------*/
  const autoVerify = async () => {
    if (!cas) return;

    setCountdownActive(false);
    setSelected("A");

    playSentimentTone("positive");

    const isCorrect = true;

    // ⭐ Log full learning snapshot
    await logLearning({
      prediction,
      cas,
      selectedAnswer: "A",
      isCorrect,
      autoVerified: true,
      clarity,
      sentiment,
      focusCategory,
    });

    // ⭐ Update causal_strength table
    await updateCausalStrength({
      cause: cas.cause,
      category: prediction.category,
      country: prediction.country,
      clarity,
      sentiment,
    });

    setResult({ message: cas.cause, done: false });

    setTimeout(() => setResult({ message: cas.cause, done: true }), 2000);
    setTimeout(() => setResult(null), 3200);
  };

  /* -------------------------------------------------------------
     MANUAL SUBMIT
  --------------------------------------------------------------*/
  const handleSubmit = async () => {
    if (!selected) return;

    setCountdownActive(false);

    const idx = ["A", "B", "C", "D"].indexOf(selected);
    const chosen = [
      cas.cause,
      "Short-term volatility",
      "Policy intervention",
      "Insufficient market data",
    ][idx];

    const isCorrect = chosen === cas.cause;

    playSentimentTone(isCorrect ? "positive" : "negative");

    // ⭐ Log learning snapshot
    await logLearning({
      prediction,
      cas,
      selectedAnswer: selected,
      isCorrect,
      autoVerified: false,
      clarity,
      sentiment,
      focusCategory,
    });

    // ⭐ Update causal strength
    await updateCausalStrength({
      cause: cas.cause,
      category: prediction.category,
      country: prediction.country,
      clarity,
      sentiment,
    });

    setResult({ message: cas.cause, done: false });

    setTimeout(() => setResult({ message: cas.cause, done: true }), 2000);
    setTimeout(() => setResult(null), 3200);
  };

  if (!cas) return null;

  const options = [
    cas.cause,
    "Short-term volatility",
    "Policy intervention",
    "Insufficient market data",
  ];
  const letters = ["A", "B", "C", "D"];

  /* -------------------------------------------------------------
     RENDER UI
  --------------------------------------------------------------*/
  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-blue-800/30 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-blue-300 text-sm font-semibold">🧠 Causal Insight</h3>

        {!result && countdownActive && (
          <p className="text-xs text-slate-400">
            Auto-verify in <span className="text-purple-300">{timeLeft}s</span>
          </p>
        )}
      </div>

      {/* Cause & Effect */}
      <p className="text-slate-200 text-sm">
        <span className="text-blue-400 font-semibold">Cause:</span> {cas.cause}
      </p>

      <p className="text-slate-200 text-sm">
        <span className="text-blue-400 font-semibold">Effect:</span> {cas.effect}
      </p>

      {cas.reflection && (
        <p className="text-slate-400 text-xs italic">“{cas.reflection}”</p>
      )}

      {/* Confidence Label */}
      <span
        className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
          cas.confidence > 0.85
            ? "bg-green-700/30 text-green-300"
            : cas.confidence > 0.7
            ? "bg-yellow-700/30 text-yellow-300"
            : "bg-red-700/30 text-red-300"
        }`}
      >
        {Math.round(cas.confidence * 100)}% confidence
      </span>

      {/* Cluster Graph */}
      <div className="pt-4 border-t border-slate-700/40">
        <CausalClusterGraph cause={cas.cause} related={related} />
      </div>

      {/* QUIZ */}
      <div className="pt-4 border-t border-slate-700/40">

        <p className="text-slate-200 text-sm mb-3">
          What is the most likely cause of this prediction?
        </p>

        <div className="space-y-2">
          {letters.map((l, idx) => {
            const correct = l === "A" && result;
            const selectedState = selected === l;

            return (
              <button
                key={l}
                onClick={() => {
                  if (!result) {
                    setSelected(l);
                    setCountdownActive(false);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border transition 
                  ${
                    selectedState
                      ? "bg-purple-700/30 border-purple-400"
                      : "bg-slate-800/40 border-slate-700 hover:bg-slate-700/40"
                  }
                  ${correct ? "border-green-400 bg-green-700/20" : ""}`}
              >
                <span className="text-purple-300 mr-2">{l}.</span>
                {options[idx]}
              </button>
            );
          })}
        </div>

        {!result && (
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700"
          >
            Submit
          </button>
        )}

        {/* Result pulse animation */}
        {result && (
          <motion.div
            className="relative mt-4"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(168,85,247,0.0)",
                  "0 0 18px rgba(168,85,247,0.55)",
                  "0 0 10px rgba(168,85,247,0.35)",
                  "0 0 0px rgba(168,85,247,0.0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
            />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {!result.done && (
                  <motion.p
                    key="verified"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-purple-300 text-sm font-medium"
                  >
                    A.I.V.E. verified: {result.message}
                  </motion.p>
                )}

                {result.done && (
                  <motion.p
                    key="complete"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-purple-200 text-sm italic"
                  >
                    Systems log complete.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CausalInsightWithQuiz;

