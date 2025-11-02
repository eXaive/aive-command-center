'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SubmitIntel() {
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [region, setRegion] = useState('');
  const [sentiment, setSentiment] = useState('Neutral');
  const [impact, setImpact] = useState(50);
  const [category, setCategory] = useState('Countries');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // 🎯 Fields for Financial Quiz Show
  const [quizAnswers, setQuizAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  // 🐝 Fields for Financial Spelling Bee
  const [definition, setDefinition] = useState('');
  const [exampleUsage, setExampleUsage] = useState('');

  const categories = [
    'Countries',
    'Finance',
    'Military Action',
    'Outbreaks',
    'Global Intel Agencies',
    'The Financial Quiz Show',
    'The Financial Spelling Bee',
  ];

  const handleQuizAnswerChange = (index: number, value: string) => {
    const updated = [...quizAnswers];
    updated[index] = value;
    setQuizAnswers(updated);
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    let insertData: any = {
      headline,
      summary,
      region,
      sentiment_level: sentiment,
      impact_score: impact,
      category,
      content_type: 'intel',
    };

    if (category === 'The Financial Quiz Show') {
      insertData.quiz_answers = quizAnswers.filter((a) => a.trim() !== '');
      insertData.correct_answer = correctAnswer;
      insertData.content_type = 'quiz';
    }

    if (category === 'The Financial Spelling Bee') {
      insertData.definition = definition;
      insertData.example_usage = exampleUsage;
      insertData.content_type = 'spelling';
    }

    const { error } = await supabase.from('intel_feed').insert([insertData]);
    setSubmitting(false);

    if (error) {
      console.error('Error submitting intel:', error);
      setMessage('❌ Submission failed.');
    } else {
      setMessage('✅ Intel submitted successfully.');
      setHeadline('');
      setSummary('');
      setRegion('');
      setSentiment('Neutral');
      setImpact(50);
      setQuizAnswers(['', '', '', '']);
      setCorrectAnswer('');
      setDefinition('');
      setExampleUsage('');
    }
  }

  return (
    <div className="bg-slate-900/70 rounded-xl p-5 border border-slate-800 shadow-md w-full max-w-md mb-6">
      <h2 className="text-sky-400 font-semibold flex items-center gap-2 mb-3">
        🧠 Submit Intel
      </h2>

      {/* 🔹 Category Selector */}
      <div className="mb-3">
        <label className="block text-xs text-slate-400 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Headline */}
        <input
          type="text"
          placeholder={
            category === 'The Financial Quiz Show'
              ? 'Enter Quiz Question'
              : category === 'The Financial Spelling Bee'
              ? 'Enter Word'
              : 'Headline / Event'
          }
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />

        {/* Summary or Definition Field */}
        {category === 'The Financial Spelling Bee' ? (
          <>
            <textarea
              placeholder="Definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={2}
              className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
            <textarea
              placeholder="Example Usage"
              value={exampleUsage}
              onChange={(e) => setExampleUsage(e.target.value)}
              rows={2}
              className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </>
        ) : (
          <textarea
            placeholder={
              category === 'The Financial Quiz Show'
                ? 'Hint or brief context for the question'
                : 'Summary / Description'
            }
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
          />
        )}

        {/* Quiz Answers Section */}
        {category === 'The Financial Quiz Show' && (
          <div className="bg-slate-800/60 p-3 rounded-md border border-slate-700">
            <p className="text-xs text-slate-400 mb-2">
              💡 Enter up to 4 answer choices and mark the correct one
            </p>
            {quizAnswers.map((ans, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Answer ${i + 1}`}
                  value={ans}
                  onChange={(e) => handleQuizAnswerChange(i, e.target.value)}
                  className="flex-1 bg-slate-900 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <input
                  type="radio"
                  name="correct"
                  checked={correctAnswer === ans}
                  onChange={() => setCorrectAnswer(ans)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Region, Sentiment, Impact */}
        {category !== 'The Financial Quiz Show' && category !== 'The Financial Spelling Bee' && (
          <>
            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            />

            <select
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value)}
              className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>

            <input
              type="number"
              placeholder="Impact Score"
              value={impact}
              onChange={(e) => setImpact(parseInt(e.target.value))}
              className="bg-slate-800 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit to A.I.V.E.'}
        </button>

        {message && <p className="text-xs text-center text-slate-400 mt-2">{message}</p>}
      </form>
    </div>
  );
}

