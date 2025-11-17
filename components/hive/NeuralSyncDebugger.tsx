"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext"; // 🧠 pull live sentiment + mode

/**
 * 🔍 NeuralSyncDebugger
 * Visual overlay showing synchronization, sentiment, and audio intensity.
 * Now dynamically mirrors Awareness Control sentiment in real-time.
 */

export default function NeuralSyncDebugger() {
  const [syncTime, setSyncTime] = useState(0);
  const [intensity, setIntensity] = useState(0);
  const [pulse, setPulse] = useState(false);

  // 🧠 Connect to shared global neural state
  const { sentiment } = useNeuralState();

  useEffect(() => {
    const onSync = () => {
      setPulse(true);
      setSyncTime(Date.now());
      setTimeout(() => setPulse(false), 300);
    };

    const onViz = (e: any) => setIntensity(e.detail.intensity || 0);

    window.addEventListener("neural-sync", onSync);
    window.addEventListener("audio-visualize", onViz);

    return () => {
      window.removeEventListener("neural-sync", onSync);
      window.removeEventListener("audio-visualize", onViz);
    };
  }, []);

  // 🎨 Live color palette synchronized with Awareness Control
  const colorMap = {
    positive: "#2dd4bf",
    neutral: "#fbbf24",
    negative: "#ef4444",
  };
  const color = colorMap[sentiment as keyof typeof colorMap] || "#38bdf8";

  return (
    <motion.div
      className="fixed bottom-4 right-[230px] text-xs z-[99999] bg-slate-900/80 border border-slate-700 rounded-xl p-3 font-mono shadow-lg backdrop-blur-md pointer-events-none"
      animate={{
        scale: pulse ? 1.05 : 1,
        borderColor: color,
        boxShadow: pulse
          ? `0 0 20px ${color}aa`
          : `0 0 ${8 + intensity * 20}px ${color}55`,
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
        Neural Sync Debugger
      </div>

      <div className="flex flex-col gap-1 text-gray-300">
        <div>
          <span className="text-gray-500">Last Sync:</span>{" "}
          <span>{new Date(syncTime).toLocaleTimeString()}</span>
        </div>
        <div>
          <span className="text-gray-500">Sentiment:</span>{" "}
          <span style={{ color, fontWeight: 600 }}>{sentiment}</span>
        </div>
        <div>
          <span className="text-gray-500">Audio Intensity:</span>{" "}
          <span>{intensity.toFixed(2)}</span>
        </div>
      </div>

      <motion.div
        className="mt-2 h-1 rounded-full"
        style={{ background: color }}
        animate={{ scaleX: 1 + intensity * 4 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
