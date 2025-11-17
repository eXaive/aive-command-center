"use client";
import { motion } from "framer-motion";

export default function CountryAwarenessPanel() {
  const flags = [
    "🇺🇸","🇨🇦","🇬🇧","🇯🇵","🇩🇪","🇫🇷","🇮🇳",
    "🇧🇷","🇨🇳","🇲🇽","🇮🇹","🇿🇦","🇰🇷",
    "🇸🇦","🇦🇺","🇹🇹","🇳🇬","🇪🇬","🇷🇺",
  ];

  return (
    <div className="flex flex-col items-center justify-center w-14 h-[360px] 
                    bg-slate-950/50 border border-slate-800/30 rounded-2xl 
                    backdrop-blur-md overflow-y-auto shadow-inner shadow-blue-900/20 
                    no-scrollbar">
      <motion.div
        className="flex flex-col items-center space-y-3 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {flags.map((flag, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-slate-900/70 border border-slate-700/50 
                       flex items-center justify-center text-2xl cursor-pointer 
                       shadow-md shadow-blue-900/30 hover:border-blue-500/70 
                       transition-all duration-300"
          >
            {flag}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
