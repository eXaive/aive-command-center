"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface QuizQuestion {
  id: number;
  question: string;
  answer: string;
  difficulty?: string;
  category?: string;
  created_at: string;
}

export default function QuizShow() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("id", { ascending: true });
      if (error) console.error(error);
      else setQuestions(data || []);
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleRandom = () => {
    if (questions.length > 0) {
      const random = questions[Math.floor(Math.random() * questions.length)];
      setSelected(random);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">🎯 The Financial Quiz Show</h2>

      {loading ? (
        <p>Loading questions...</p>
      ) : selected ? (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="font-semibold mb-2">{selected.question}</p>
          <p className="text-sm text-slate-400">
            💡 {selected.answer}
          </p>
          <button
            onClick={handleRandom}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
          >
            Next Question
          </button>
        </div>
      ) : (
        <button
          onClick={handleRandom}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
        >
          Start Quiz
        </button>
      )}
    </div>
  );
}
