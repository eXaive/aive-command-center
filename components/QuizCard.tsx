"use client";

import React, { useMemo, useState } from "react";

type Q = {
  id: string;
  question: string;
  choices: string[];
  correct: number;      // index in choices
  explanation: string;
};

function goldQuestions(): Q[] {
  return [
    {
      id: "gold-why-dxy",
      question: "Why does a stronger U.S. Dollar (DXY) often pressure GOLD prices?",
      choices: [
        "Because gold supply increases when DXY rises",
        "Because gold is mostly priced in USD, making it more expensive for non-USD buyers",
        "Because central banks sell gold when DXY rises by mandate",
        "Because COMEX halts gold trading when DXY rises quickly",
      ],
      correct: 1,
      explanation:
        "Gold is globally priced in USD. When the dollar strengthens, gold becomes more expensive in other currencies, often reducing demand.",
    },
    {
      id: "gold-inflation-hedge",
      question: "In which environment does GOLD historically see tailwinds?",
      choices: [
        "Stable inflation, rising real yields",
        "Disinflation with strong risk appetite",
        "Rising inflation expectations and falling real yields",
        "Only when oil falls sharply",
      ],
      correct: 2,
      explanation:
        "Gold tends to do better when inflation expectations rise and real yields fall (opportunity cost of holding gold declines).",
    },
  ];
}

const BANK: Record<string, () => Q[]> = {
  GOLD: goldQuestions,
  // Add others later:
  // SPY: () => [...],
  // BTC: () => [...],
  // ETH: () => [...],
};

export default function QuizCard({ asset = "GOLD" }: { asset?: string }) {
  const questions = useMemo(() => {
    const fn = BANK[asset] || BANK["GOLD"];
    return fn();
  }, [asset]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showExp, setShowExp] = useState(false);

  const q = questions[idx];

  const pick = (i: number) => {
    setPicked(i);
    setShowExp(true);
  };

  const next = () => {
    setIdx((i) => (i + 1) % questions.length);
    setPicked(null);
    setShowExp(false);
  };

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-xs text-slate-500">Quick Quiz</div>
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
                  ? "bg-white hover:bg-slate-50"
                  : isCorrect
                  ? "bg-green-50 border-green-300"
                  : isWrong
                  ? "bg-red-50 border-red-300"
                  : "bg-white")
              }
              disabled={picked !== null}
            >
              {c}
            </button>
          );
        })}
      </div>

      {showExp && (
        <div className="mt-3 text-sm">
          <div className="font-medium">
            {picked === q.correct ? "✅ Correct" : "❌ Not quite"}
          </div>
          <p className="text-slate-600 mt-1">{q.explanation}</p>
          <button
            onClick={next}
            className="mt-3 px-3 py-2 rounded-md border bg-white hover:bg-slate-50"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}
