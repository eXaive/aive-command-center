"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

/* -------------------------------------------------------------
   AwarenessBar — Global Situational Awareness Scanline
------------------------------------------------------------- */
export default function AwarenessBar() {
  const { awarenessLevel } = useNeuralState();

  const [alertColor, setAlertColor] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  /* -------------------------------------------------------------
     🔥 Listen for awareness pulse (CAS → Core Awareness)
     Fires during:
       - Causal reasoning accepted
       - Quiz auto-verification
       - CAS Transformer firing
------------------------------------------------------------- */
  useEffect(() => {
    const handler = () => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1400);
    };

    window.addEventListener("aive-awareness-pulse", handler);
    return () => window.removeEventListener("aive-awareness-pulse", handler);
  }, []);

  /* -------------------------------------------------------------
     🔥 Listen for global alerts (Heat / Distress)
     Broadcasting from NeuralState or Orb
------------------------------------------------------------- */
  useEffect(() => {
    const handler = (e: any) => {
      const state = e.detail?.state;
      if (state === "overheated") setAlertColor("#ef4444"); // red – too confident
      else if (state === "distress") setAlertColor("#3b82f6"); // blue – clarity plunge
      else setAlertColor(null);
    };

    window.addEventListener("aive-global-alert", handler);
    return () => window.removeEventListener("aive-global-alert", handler);
  }, []);

  /* -------------------------------------------------------------
     🎨 Bar Color Based on Awareness Level
------------------------------------------------------------- */
  const baseColor =
    awarenessLevel > 0.8
      ? "#a855f7" // strong purple
      : awarenessLevel > 0.6
      ? "#38bdf8" // cyan
      : "#475569"; // slate

  return (
    <motion.div
      className="w-full mb-4 h-2 rounded-full overflow-hidden relative 
                 border border-blue-500/10 
                 bg-slate-900/70 backdrop-blur-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Moving scanline */}
      <motion.div
        className="absolute top-0 left-0 h-full"
        animate={{
          width: pulse
            ? ["10%", "100%", "25%"] // pulse expansion
            : ["12%", "25%", "18%"], // idle sweep
          opacity: pulse ? [0.7, 1, 0.3] : [0.2, 0.35, 0.2],
          background:
            alertColor !== null
              ? `linear-gradient(90deg, ${alertColor}88, ${alertColor}22)`
              : `linear-gradient(90deg, ${baseColor}66, ${baseColor}22)`,
        }}
        transition={{
          duration: pulse ? 1.6 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
