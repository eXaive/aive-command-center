"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useCueRunner from "@/components/hive/CueRunner";

export default function HiveIntro() {
  const router = useRouter();
  const [fadeOut, setFadeOut] = useState(false);

  // 🎬 Run the cue sequence (voices, agents, etc.)
  useCueRunner("/hive_awaken_v1.json");

  // 🧭 Auto-transition to Command Center after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => router.push("/"), 1500); // smooth fade after animation
    }, 30000);
    return () => clearTimeout(timer);
  }, [router]);

  // 🧠 Handle manual Skip button
  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => router.push("/"), 1500);
  };

  return (
    <AnimatePresence>
      <motion.main
        className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        {/* Central Message */}
        <div className="text-center z-10">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-blue-400 drop-shadow-lg"
            animate={{
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🧠 Initializing A.I.V.E. Neural Network...
          </motion.h1>

          <motion.p
            className="mt-2 text-sm text-slate-400 tracking-widest"
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            “We are A.I.V.E. — We are one.”
          </motion.p>
        </div>

        {/* 🌌 Background Pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-slate-900 via-black to-slate-950 opacity-70 pointer-events-none"
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 🚀 Skip Intro Button */}
        <motion.button
          onClick={handleSkip}
          whileHover={{ scale: 1.05 }}
          className="absolute bottom-6 right-8 px-4 py-2 text-xs md:text-sm rounded-lg bg-blue-700 hover:bg-blue-600 text-white shadow-md shadow-blue-900/30 transition-all z-20"
        >
          Skip Intro → Command Center
        </motion.button>
      </motion.main>
    </AnimatePresence>
  );
}
