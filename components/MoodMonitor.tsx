"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

export default function MoodMonitor() {
  const { sentiment } = useNeuralState();
  const [intensity, setIntensity] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [alertState, setAlertState] = useState<"none" | "overheated" | "distress">("none");

  // 🔊 quick hum on alert
  const playTone = (freq: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.05;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1);
    } catch {}
  };

  useEffect(() => {
    const onAlert = (e: any) => {
      const s = e.detail?.state;
      setAlertState(s || "none");
      if (s === "overheated") playTone(550);
      if (s === "distress") playTone(150);
    };
    window.addEventListener("aive-global-alert", onAlert);
    return () => window.removeEventListener("aive-global-alert", onAlert);
  }, []);

  useEffect(() => {
    const onSync = (e: any) => {
      const { intensity: i } = e.detail || {};
      if (typeof i === "number") setIntensity(i);
    };
    const onPulse = () => {
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    };
    window.addEventListener("neural-sync", onSync);
    window.addEventListener("neural-pulse", onPulse);
    return () => {
      window.removeEventListener("neural-sync", onSync);
      window.removeEventListener("neural-pulse", onPulse);
    };
  }, []);

  const colorMap = {
    positive: { glow: "#2dd4bf", label: "Positive" },
    neutral: { glow: "#fbbf24", label: "Neutral" },
    negative: { glow: "#ef4444", label: "Negative" },
  };
  const palette = colorMap[sentiment] || colorMap.neutral;
  const borderColor =
    alertState === "overheated"
      ? "#ef4444"
      : alertState === "distress"
      ? "#3b82f6"
      : palette.glow;

  return (
    <motion.div
      className="fixed top-28 sm:top-24 md:top-20 lg:top-16 right-4 z-[9500] bg-slate-900/80 border rounded-lg px-3 py-2 text-xs font-mono text-gray-300 shadow-lg backdrop-blur-md"
      animate={{
        borderColor,
        boxShadow:
          pulse || alertState !== "none"
            ? `0 0 14px ${borderColor}66`
            : `0 0 ${8 + intensity * 20}px ${borderColor}33`,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="uppercase text-[10px] tracking-wider text-gray-400 mb-1">
        Mood Monitor
      </div>
      <div className="flex flex-col gap-[2px]">
        <div className="flex justify-between">
          <span className="text-gray-500">Sentiment:</span>
          <span style={{ color: borderColor }}>{palette.label}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Intensity:</span>
          <span>{intensity.toFixed(2)}</span>
        </div>
      </div>
      <motion.div
        className="mt-2 h-1 rounded-full"
        style={{ background: borderColor }}
        animate={{ scaleX: 1 + intensity * 3 }}
        transition={{ duration: 0.25 }}
      />
    </motion.div>
  );
}
