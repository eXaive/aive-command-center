"use client";

import { useEffect, useState } from "react";

export default function SubmitCausality({ prefillCountry }: { prefillCountry?: string }) {
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [cause, setCause] = useState("");
  const [effect, setEffect] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Auto-fill country from region selector */
  useEffect(() => {
    if (prefillCountry && prefillCountry !== "Global") {
      setCountry(prefillCountry);
    }
  }, [prefillCountry]);

  async function submit() {
    setLoading(true);
    setDone(false);

    const res = await fetch("/api/cas/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, category, cause, effect }),
    });

    setLoading(false);
    if (res.ok) setDone(true);
  }

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-300">

      <input
        className="bg-slate-800 rounded px-3 py-2"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <input
        className="bg-slate-800 rounded px-3 py-2"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        className="bg-slate-800 rounded px-3 py-2"
        placeholder="Cause"
        value={cause}
        onChange={(e) => setCause(e.target.value)}
      />

      <textarea
        className="bg-slate-800 rounded px-3 py-2 h-20"
        placeholder="Effect"
        value={effect}
        onChange={(e) => setEffect(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2"
      >
        {loading ? "Saving…" : "Submit"}
      </button>

      {done && (
        <p className="text-emerald-400 text-xs text-center">Saved ✔</p>
      )}
    </div>
  );
}
