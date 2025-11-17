"use client";
import { motion } from "framer-motion";

export default function CountryAwarenessStream() {
  const flags = [
    "🇺🇸","🇨🇦","🇬🇧","🇯🇵","🇩🇪","🇫🇷","🇮🇳",
    "🇧🇷","🇨🇳","🇲🇽","🇮🇹","🇿🇦","🇰🇷",
    "🇸🇦","🇦🇺","🇹🇹","🇳🇬","🇪🇬","🇷🇺",
  ];

  return (
    <div className="overflow-hidden w-full select-none">
      <motion.div
        className="flex space-x-6 sm:space-x-8"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
      >
        {[...flags, ...flags].map((flag, i) => (
          <div
            key={i}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                       bg-slate-900/70 border border-slate-700/60 
                       flex items-center justify-center text-2xl sm:text-3xl 
                       shadow-md shadow-blue-900/30 hover:scale-110 
                       transition-transform duration-300"
          >
            <span className="drop-shadow-[0_0_4px_rgba(0,160,255,0.4)]">{flag}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
