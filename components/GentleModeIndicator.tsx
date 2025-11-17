"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GentleModeIndicator() {
  const [enabled, setEnabled] = useState(false);

  // 🧭 Listen for global gentle-mode event from AwarenessControlPanel
  useEffect(() => {
    const onMode = (e: any) => {
      setEnabled(e.detail.enabled);
      console.log("🕯️ Gentle Mode changed:", e.detail.enabled);
    };
    window.addEventListener("gentle-mode", onMode);
    return () => window.removeEventListener("gentle-mode", onMode);
  }, []);

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          key="gentle-indicator"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed top-5 right-5 z-[9998] bg-slate-900/80 border border-amber-400/40 text-amber-300 px-4 py-2 rounded-lg text-xs font-medium shadow-md backdrop-blur-md"
          style={{
            boxShadow: "0 0 10px rgba(250,204,21,0.25)",
          }}
        >
          🕯️ Gentle Mode Active
        </motion.div>
      )}
    </AnimatePresence>
  );
}
