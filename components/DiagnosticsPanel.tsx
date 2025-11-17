"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeartbeat } from "@/context/HeartbeatContext";

/**
 * 🩵 System Diagnostics HUD (Stable)
 * - Updates visual stats every 15s
 * - Pulls from `/api/diagnostics/latest`
 * - Reacts to heartbeat pulses only for glow
 * - Never blocks A.I.V.E. wake cycle
 */

export default function DiagnosticsPanel() {
  const { pulse } = useHeartbeat(); // 💓 synchronized heartbeat pulse
  const [entry, setEntry] = useState<any | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const fetchTimer = useRef<NodeJS.Timeout | null>(null);

  // ⚙️ Fetch latest diagnostics (throttled to every 15s)
  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const res = await fetch("/api/diagnostics/latest", { cache: "no-store" });
        const json = await res.json();
        if (Array.isArray(json.records) && json.records.length > 0) {
          setEntry(json.records[0]);
        }
      } catch (err) {
        console.warn("⚠️ Diagnostics fetch error:", err);
      }
    };

    fetchDiagnostics(); // initial
    fetchTimer.current = setInterval(fetchDiagnostics, 15000);
    return () => {
      if (fetchTimer.current) clearInterval(fetchTimer.current);
    };
  }, []);

  // 💓 Gentle heartbeat pulse effect (1s animation)
  useEffect(() => {
    if (!pulse) return;
    setIsPulsing(true);
    const id = setTimeout(() => setIsPulsing(false), 1000);
    return () => clearTimeout(id);
  }, [pulse]);

  if (!entry) return null;

  const used = entry.memory_used_mb || 0;
  const total = entry.memory_total_mb || 1;
  const usage = (used / total) * 100;
  const uptime = entry.uptime_min?.toFixed?.(1) ?? "0.0";

  let color = "#3B82F6"; // blue
  if (usage >= 70 && usage < 90) color = "#22D3EE"; // cyan
  if (usage >= 90) color = "#EAB308"; // amber

  const glow = usage > 95 ? "0 0 80px 20px" : "0 0 50px 12px";
  const alpha = usage > 95 ? "A0" : "70";

  return (
    <motion.div
      className="relative w-full max-w-md mt-8 p-4 rounded-xl bg-slate-900/70 border border-slate-700/40 text-center shadow-lg backdrop-blur-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* 💓 Heartbeat Ripple */}
      <AnimatePresence>
        {isPulsing && (
          <motion.div
            key="pulse"
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${color}25, transparent 80%)`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* 🧩 Header */}
      <h2
        className="text-lg font-semibold mb-1 relative z-10 flex justify-center items-center gap-2"
        style={{ color }}
      >
        <span>🧩 System Diagnostics</span>
      </h2>

      {/* 💾 Stats */}
      <p className="text-sm text-slate-300 relative z-10">
        Memory{" "}
        <span className="font-semibold" style={{ color }}>
          {used.toFixed(1)} / {total.toFixed(1)} MB
        </span>{" "}
        ({usage.toFixed(1)}%)
      </p>

      <p className="text-xs text-slate-400 mt-1 relative z-10">
        Uptime ≈ {uptime} min
      </p>

      {/* 🔷 Animated bar */}
      <motion.div
        className="relative mt-3 h-[2px] w-full max-w-[200px] mx-auto overflow-hidden"
        animate={{
          background: [
            `linear-gradient(90deg, transparent, ${color}${alpha}, transparent)`,
            `linear-gradient(90deg, transparent, ${color}AA, transparent)`,
            `linear-gradient(90deg, transparent, ${color}${alpha}, transparent)`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <p className="text-xs text-slate-500 mt-2 relative z-10 italic">
        Updated every 15s
      </p>

      {/* ✨ Subtle Glow */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: `${glow} ${color}${alpha}`,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
