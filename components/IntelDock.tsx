"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubmitIntel from "@/components/SubmitIntel";

export default function IntelDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="intel-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(true)}
            className="
              flex items-center gap-2 
              bg-blue-600 hover:bg-blue-700 
              text-white text-sm font-medium 
              px-4 py-2 rounded-full shadow-lg shadow-blue-700/30
              border border-blue-400/50
            "
          >
            🧠 Submit Intel
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="intel-form"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="
              fixed bottom-6 right-6 
              bg-slate-900/90 border border-slate-700/70 
              rounded-xl shadow-2xl backdrop-blur-md
              w-[360px] max-h-[85vh] overflow-y-auto
              p-4 z-[9999]
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-blue-400 text-sm font-semibold">
                🧠 A.I.V.E. Intel Uplink
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg"
              >
                ✖
              </button>
            </div>

            <SubmitIntel />

            {/* Subtle fade background */}
            <motion.div
              className="absolute inset-0 rounded-xl -z-10"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(59,130,246,0.1)",
                  "0 0 20px rgba(59,130,246,0.3)",
                  "0 0 0px rgba(59,130,246,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
