"use client";

import { motion } from "framer-motion";

export default function ScanOverlay({
  keyword,
  active,
}: {
  keyword: string | null;
  active: boolean;
}) {
  if (!active || !keyword) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="
        absolute top-4 right-4 
        px-4 py-3 rounded-xl 
        bg-slate-950 
        border border-cyan-400/70 
        shadow-[0_0_20px_rgba(34,211,238,0.45)]
        text-sm text-cyan-200 
        font-medium 
        z-50
      "
    >
      <div className="flex items-center gap-2">
        <span className="text-cyan-300">🤖</span>
        <span>Scanning for:</span>
        <span className="text-white font-semibold tracking-wide">
          {keyword}
        </span>
      </div>

      <div className="mt-1 h-[2px] w-full bg-cyan-400/40 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-full w-1/3 bg-cyan-300"
        />
      </div>
    </motion.div>
  );
}
