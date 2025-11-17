"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function WatchlistPanel() {
  const [items, setItems] = useState([]);
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    supabase
      .from("watchlist")
      .select("*")
      .then(({ data }) => data && setItems(data));
  }, []);

  const addToWatchlist = async () => {
    const { data } = await supabase.from("watchlist").insert({
      user_id: "GLOBAL_USER", // placeholder
      country,
      category,
      keyword,
    }).select("*");

    if (data) setItems((prev) => [...prev, data[0]]);
  };

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-700 rounded-xl mt-4">
      <h2 className="text-lg text-blue-300 font-semibold mb-3">
        🔔 Watchlist
      </h2>

      <div className="flex flex-col gap-2 mb-4">
        <input
          className="p-2 bg-slate-800 border border-slate-700 rounded"
          placeholder="Country (optional)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          className="p-2 bg-slate-800 border border-slate-700 rounded"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="p-2 bg-slate-800 border border-slate-700 rounded"
          placeholder="Keyword (optional)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          onClick={addToWatchlist}
          className="bg-blue-600 hover:bg-blue-500 p-2 rounded text-white"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-slate-800/40 border border-slate-700 rounded"
          >
            <p className="text-slate-300 text-sm">
              🌍 {item.country || "Any"} — 📊 {item.category || "Any"} — 🔍{" "}
              {item.keyword || "Any"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
