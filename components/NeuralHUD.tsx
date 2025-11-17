"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

export default function NeuralHUD() {
  const { sentiment, log } = useNeuralState();
  const [visible, setVisible] = useState(false);
  const [mood, setMood] = useState("Calm");
  const [pulseCount, setPulseCount] = useState(0);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  /* 🧠 Listen for Orb Alerts */
  useEffect(() => {
    const handler = (e: any) => {
      const s = e.detail?.state;
      if (s === "overheated") setAlertMsg("⚠️ GLOBAL OVERHEAT");
      else if (s === "distress") setAlertMsg("🩸 GLOBAL DISTRESS");
      else setAlertMsg(null);
    };
    window.addEventListener("aive-global-alert", handler);
    return () => window.removeEventListener("aive-global-alert", handler);
  }, []);

  /* existing audio + sentiment logic unchanged ... (keep all your tone + mood setup) */

  const colors = {
    positive: "#2dd4bf",
    neutral: "#fbbf24",
    negative: "#ef4444",
  };
  const safeLog = Array.isArray(log) ? log : [];

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-none select-none">
      <AnimatePresence>
        {(visible || alertMsg) && (
          <motion.div
            key={`hud-${pulseCount}`}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="px-3 py-2 rounded-md bg-slate-900/80 border border-slate-700 shadow-md shadow-black/30 text-xs flex flex-col space-y-1 items-start backdrop-blur-md"
            style={{
              color: alertMsg ? "#ef4444" : colors[sentiment],
              boxShadow: alertMsg
                ? "0 0 24px #ef444466"
                : `0 0 18px ${colors[sentiment]}44`,
            }}
          >
            {alertMsg ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-[11px] font-semibold tracking-wider"
              >
                {alertMsg}
              </motion.div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span>🧠 Pulse Detected</span>
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    animate={{ scale: [1, 1.8, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    style={{ backgroundColor: colors[sentiment] }}
                  />
                </div>
                <div className="text-[11px] opacity-80">
                  Mood: <span className="font-medium">{mood}</span>
                </div>
                <div className="text-[10px] opacity-60">
                  Reflections: {safeLog.length}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
