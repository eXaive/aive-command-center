"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

/* ─────────────────────────
   Types
────────────────────────── */
interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d?: string | null;
  correct_answer: string;
  category: string;
  difficulty: string;
  country: string;   // ← FIXED
  explanation?: string | null;
}

/* ─────────────────────────
   Component
────────────────────────── */
export default function QuizEverythingPanel() {
  const { country, fiscalProfile, awarenessPulse } = usePredictionFilter();  // ← FIXED

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  /* Audio */
  const correctTone = typeof Audio !== "undefined" ? new Audio("/sounds/correct-tone.mp3") : null;
  const wrongTone = typeof Audio !== "undefined" ? new Audio("/sounds/wrong-tone.mp3") : null;
  if (correctTone) correctTone.volume = 0.4;
  if (wrongTone) wrongTone.volume = 0.4;

  /* ─────────────────────────
     Load questions by COUNTRY
  ─────────────────────────── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .ilike("country", `%${country}%`)  // ← FIXED FILTER
        .limit(15);

      if (!error) setQuestions((data || []) as Question[]);
      setLoading(false);
    };

    load();
  }, [country]);

  /* Helper: Letter → text */
  const letterToText = (letter: string, q: Question) => {
    if (letter === "A") return q.option_a;
    if (letter === "B") return q.option_b;
    if (letter === "C") return q.option_c;
    if (letter === "D") return q.option_d;
    return null;
  };

  /* Helper: correct letter */
  const getCorrect = (q: Question) => {
    if (q.correct_answer === q.option_a) return { letter: "A", text: q.option_a };
    if (q.correct_answer === q.option_b) return { letter: "B", text: q.option_b };
    if (q.correct_answer === q.option_c) return { letter: "C", text: q.option_c };
    if (q.option_d && q.correct_answer === q.option_d)
      return { letter: "D", text: q.option_d };
    return null;
  };

  /* Next */
  const goToNext = () => {
    setSelected(null);
    setFeedback(null);
    setShowExplanation(false);
    setCurrentIndex((i) => (i + 1) % questions.length);
    setSubmitting(false);
  };

  /* ─────────────────────────
     Submit Answer
  ─────────────────────────── */
  const handleSubmit = async () => {
    if (!selected || submitting) return;

    setSubmitting(true);
    const q = questions[currentIndex];
    const chosenText = letterToText(selected, q);
    const correct = getCorrect(q);

    const isCorrect =
      chosenText?.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();

    const message = isCorrect
      ? "✅ Correct! Logged into awareness metrics."
      : `❌ Not quite — Correct answer is ${correct?.letter}. ${correct?.text}`;

    /* Save Response */
    const { error } = await supabase.from("quiz_responses").insert({
      question_id: q.id,
      selected_answer: selected,
      is_correct: isCorrect,
      country: q.country,        // ← FIXED
      sentiment: isCorrect ? "Positive" : "Neutral",
      confidence: Math.random().toFixed(2),
    });

    /* Play Tone */
    if (isCorrect) correctTone?.play();
    else wrongTone?.play();

    /* Trigger CAS + Pulse */
    window.dispatchEvent(new CustomEvent("CAS_PULSE"));
    window.dispatchEvent(new CustomEvent("aive-pulse"));

    setFeedback(message);
    setSubmitting(false);
  };

  /* ─────────────────────────
     RENDER
  ─────────────────────────── */
  if (loading) return <p className="text-center text-slate-400">Loading {country} quiz…</p>;
  if (questions.length === 0)
    return <p className="text-center text-slate-500">No questions for {country}.</p>;

  const q = questions[currentIndex];
  const options = ["option_a", "option_b", "option_c", "option_d"].filter(
    (o) => (q as any)[o]?.trim()
  ) as ("option_a" | "option_b" | "option_c" | "option_d")[];

  const correct = getCorrect(q);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-2xl p-6 mt-10 rounded-2xl bg-slate-900/60 border border-slate-700 shadow-lg ${
        awarenessPulse ? "shadow-[0_0_40px_rgba(59,130,246,0.4)]" : ""
      }`}
    >
      <h2 className="text-xl text-blue-300 font-semibold text-center mb-3">
        🧩 Quiz Everything — {country}
      </h2>

      <p className="text-center text-lg font-medium mb-6 text-slate-100">
        {q.question_text}
      </p>

      {/* Options */}
      <div className="space-y-3">
        {options.map((key, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return (
            <motion.button
              key={key}
              onClick={() => setSelected(letter)}
              disabled={!!feedback}
              whileTap={{ scale: 0.96 }}
              className={`w-full px-4 py-3 border rounded-lg text-left 
                ${
                  selected === letter
                    ? "bg-blue-600/30 border-blue-400"
                    : "bg-slate-800/60 border-slate-700 hover:bg-slate-700/60"
                }`}
            >
              <span className="mr-2 text-blue-400 font-semibold">{letter}.</span>
              {(q as any)[key]}
            </motion.button>
          );
        })}
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!selected || submitting}
          className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? "Submitting…" : "Submit"}
        </motion.button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 text-center text-slate-300"
          >
            {feedback}

            {/* Explanation */}
            {correct && (
              <div className="mt-4">
                <motion.button
                  onClick={() => setShowExplanation((v) => !v)}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-slate-700 text-white rounded-full"
                >
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </motion.button>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 p-3 text-sm bg-slate-800/50 border border-slate-700 rounded-xl text-left text-slate-400"
                    >
                      {q.explanation || `Because ${correct.text} best explains the relationship.`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-full"
            >
              Next Question →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

