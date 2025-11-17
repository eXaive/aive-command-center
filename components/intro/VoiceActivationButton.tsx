"use client";

import { motion } from "framer-motion";

export default function VoiceActivationButton({
  listening,
  startListening,
}: {
  listening: boolean;
  startListening: () => void;
}) {
  return (
    <motion.button
      onClick={startListening}
      className="px-5 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg"
      animate={{
        scale: listening ? [1, 1.1, 1] : 1,
        boxShadow: listening
          ? "0px 0px 20px rgba(168,85,247,0.7)"
          : "0px 0px 10px rgba(168,85,247,0.4)",
      }}
      transition={{
        duration: listening ? 1 : 0.2,
        repeat: listening ? Infinity : 0,
      }}
    >
      {listening ? "Listening…" : "Activate Voice"}
    </motion.button>
  );
}
