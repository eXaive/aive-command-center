// components/CausalSubmitForm.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function CausalSubmitForm({ close }: { close?: () => void }) {
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("Finance");
  const [cause, setCause] = useState("");
  const [effect, setEffect] = useState("");
  const [reflection, setReflection] = useState("");
  const [confidence, setConfidence] = useState(0.75);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const categories = [
    "Finance",
    "Geopolitics",
    "Technology",
    "Energy",
    "Policy",
    "Security",
    "Health",
    "Environment",
  ];

  useEffect(() => {
    let score = 0.6;
    if (cause.length > 12) score += 0.1;
    if (effect.length > 12) score += 0.1;
    if (reflection.length > 10) score += 0.1;
    setConfidence(Math.min(score, 0.98));
  }, [cause, effect, reflection]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSending(true);
    setMsg(null);

    try {
      const res = await fetch("/api/casMemory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          category,
          cause,
          effect,
          reflection,
          confidence,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setMsg("✅ Saved to Causal Awareness");
      setCountry("");
      setCause("");
      setEffect("");
      setReflection("");

      setTimeout(() => {
        if (close) close();
        setMsg(null);
      }, 1200);
    } catch (err: any) {
      setMsg("❌ Error: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-sm text-white"
      >
        <input
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="bg-slate-800 px-3 py-2 rounded-md"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-800 px-3 py-2 rounded-md"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <textarea
          required
          rows={2}
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          placeholder="Cause"
          className="bg-slate-800 px-3 py-2 rounded-md"
        />

        <textarea
          required
          rows={2}
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="Effect"
          className="bg-slate-800 px-3 py-2 rounded-md"
        />

        <textarea
          rows={2}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Reflection (optional)"
          className="bg-slate-800 px-3 py-2 rounded-md"
        />

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
        />

        <button
          disabled={sending}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-2"
        >
          {sending ? "Saving…" : "Save Cause → Effect"}
        </button>

        {msg && <p className="text-[11px] text-center mt-2">{msg}</p>}
      </form>
    </div>
  );
}
