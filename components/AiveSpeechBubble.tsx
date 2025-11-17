"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function AiveSpeechBubble({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.35 }}
          className="
            absolute -top-6 left-1/2 -translate-x-1/2 
            bg-slate-800 border border-slate-600 text-xs 
            text-blue-300 px-3 py-1 rounded-lg shadow-xl
            backdrop-blur-md
          "
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
