"use client";
import { useEffect, useState } from "react";

/**
 * 💓 NeuralHeartbeat
 * A subtle top-right LED indicator that flashes in rhythm with `neural-sync` events.
 * Reacts to sentiment colors and sync intensity in real-time.
 */

export default function NeuralHeartbeat() {
  const [intensity, setIntensity] = useState(0);
  const [sentiment, setSentiment] = useState("neutral");

  useEffect(() => {
    const handleSync = (e: any) => {
      const { intensity = 0, sentiment = "neutral" } = e.detail || {};
      setIntensity(intensity);
      setSentiment(sentiment);
    };
    window.addEventListener("neural-sync", handleSync);
    return () => window.removeEventListener("neural-sync", handleSync);
  }, []);

  // Pick color based on sentiment
  const color =
    sentiment === "positive"
      ? "#2dd4bf"
      : sentiment === "negative"
      ? "#ef4444"
      : "#fbbf24";

  const glowSize = 6 + intensity * 10;

  return (
    <div className="fixed top-3 right-3 z-[9999] pointer-events-none">
      <div
        className="rounded-full transition-all duration-100"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          background: color,
          boxShadow: `0 0 ${6 + intensity * 24}px ${color}80`,
          opacity: 0.8 + intensity * 0.2,
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
