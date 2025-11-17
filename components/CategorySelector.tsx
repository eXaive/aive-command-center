"use client";

import { motion } from "framer-motion";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

const categories = [
  "All",
  "Finance",
  "Geopolitics",
  "Technology",
  "Energy",
  "Policy",
  "Security",
];

export default function CategorySelector() {
  const { category, setCategory } = usePredictionFilter();

  return (
    <motion.select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="
        bg-slate-800/70 text-blue-200 rounded-xl px-4 py-2 text-sm
        border border-blue-500/30 shadow-md w-[12rem] mx-auto
        block text-center focus:outline-none focus:ring-2 focus:ring-blue-500
      "
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat} className="text-white bg-slate-900">
          {cat}
        </option>
      ))}
    </motion.select>
  );
}
