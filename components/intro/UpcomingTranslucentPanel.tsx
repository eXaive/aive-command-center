"use client";

import { motion } from "framer-motion";

const mock = [
  "Oil supply shocks increasing…",
  "Eurozone inflation eases further…",
  "BTC miner accumulation rising…",
  "Asian indices show upward drift…",
  "Housing market stabilizing…",
  "Bond yields moderate slowly…",
];

export default function UpcomingTranslucentPanel() {
  return (
    <div className="w-full h-56 bg-slate-900/20 backdrop-blur-xl border-t border-slate-700/40 overflow-hidden relative">
      <div className="absolute inset-0 opacity-90 pointer-events-none">
        <motion.div
          animate={{ y: ["0%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex flex-col gap-3 text-slate-300 text-sm p-4"
        >
          {mock.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-red-400 text-lg">✘</span>
              {m}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-2 left-0 w-full text-center text-xs text-slate-400">
        🔒 Upcoming Predictions — Unlock to view details
      </div>
    </div>
  );
}
