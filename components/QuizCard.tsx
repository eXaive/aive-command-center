"use client";

import React, { useMemo, useState } from "react";

export default function QuizCard({
  cause,
  effect,
}: {
  cause: string;
  effect: string;
}) {
  /* ------------------------------------------------------------
     1. Build dynamic question based on prediction
  ------------------------------------------------------------ */
  const dynamicQuestion = useMemo(() => {
    return {
      id: "dynamic-cause-effect",
      question: `What was the primary cause of the following outcome: "${effect}"?`,
      choices: [
        cause, // correct answer
        "A different unrelated economic policy",
        "Market rumors without supporting data",
        "A geopolitical event not linked to this case",
      ],
      correct: 0,
      explanation: `The event "${effect}" is primarily driven by: ${cause}.`,
    };
  }, [cause, effect]);

  const q = dynamicQuestion;

  /* ------------------------------------------------------------
     2. State logic (unchanged)
  ------------------------------------------------------------ */
  const [picked, setPicked] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);

  const pick = (i: number) => {
    setPicked(i);
    setShowExp(true);
  };

  const reset = () => {
    setPicked(null);
    setShowExp(false);
  };

  return (
    <div className="rounded-xl border bg-white/5 backdrop-blur-md p-4 text-white">
      <div className="text-xs text-slate-400">Quick Quiz</div>
      <h4 className="font-semibold mt-1">{q.question}</h4>

      <div className="mt-3 grid gap-2">
        {q.choices.map((c, i) => {
          const isCorrect = picked !== null && i === q.correct;
          const isWrong = picked !== null && i === picked && i !== q.correct;

          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={
                "text-left px-3 py-2 rounded-md border transition " +
                (picked === null
                  ? "bg-white/10 hover:bg-white/20"
                  : isCorrect
                  ? "bg-green-700/40 border-green-400"
                  : isWrong
                  ? "bg-red-700/40 border-red-400"
                  : "bg-white/10")
              }
              disabled={picked !== null}
            >
              {c}
            </button>
          );
        })}
      </div>

      {showExp && (
        <div className="mt-4 text-sm text-slate-300">
          <div className="font-medium">
            {picked === q.correct ? "✅ Correct" : "❌ Not correct"}
          </div>

          <p className="mt-2">{q.explanation}</p>

          <button
            onClick={reset}
            className="mt-3 px-3 py-2 rounded-md border bg-white/10 hover:bg-white/20"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
