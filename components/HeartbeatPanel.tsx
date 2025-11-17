"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHeartbeat } from "@/context/HeartbeatContext"; // 🧠 Shared global pulse state

/**
 * 🫀 HeartbeatPanel — A.I.V.E. Self-Monitoring System
 * Displays the last recorded heartbeat from Supabase
 * and visually pulses when the system ingests data.
 */
export default function HeartbeatPanel() {
  const [lastPulse, setLastPulse] = useState<Date | null>(null);
  const [status, setStatus] = useState("Loading...");
  const [entries, setEntries] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextPulseIn, setNextPulseIn] = useState("...");
  const INTERVAL_MINUTES = 30;

  const { isPulsing, triggerPulse } = useHeartbeat(); // 💓 synced pulse control

  // 🔄 Fetch last heartbeat log
  useEffect(() => {
    const fetchHeartbeat = async () => {
      try {
        const res = await fetch("/api/heartbeat/latest", { cache: "no-store" });
        const text = await res.text();
        let json: any = null;

        try {
          json = JSON.parse(text);
        } catch {
          console.warn("⚠️ HeartbeatPanel: non-JSON response detected:", text);
          setStatus("⚠️ Received non-JSON or malformed response.");
          return;
        }

        if (!res.ok) {
          const msg =
            (typeof json === "object" && json?.error) ||
            `Failed to fetch heartbeat: ${res.status}`;
          throw new Error(msg);
        }

        // 🧠 Handle single or multi-record responses
        if (Array.isArray(json.records) && json.records.length > 0) {
          const latest = json.records[0];
          setLastPulse(new Date(latest?.created_at || Date.now()));
          setStatus(json.status || "✅ Data ingested successfully");
        } else {
          setLastPulse(new Date(json.created_at || Date.now()));
          setStatus(json.status || "✅ Heartbeat OK");
        }

        if (json?.entries_inserted) setEntries(json.entries_inserted);
        if (json?.error) setError(json.error);

        // 💓 Broadcast system-wide pulse event
        triggerPulse();
      } catch (err: any) {
        console.error("⚠️ HeartbeatPanel fetch error:", err);
        setStatus("Error retrieving heartbeat");
        setError(err.message || "Unknown error");
      }
    };

    fetchHeartbeat();
    const interval = setInterval(fetchHeartbeat, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [triggerPulse]);

  // ⏱️ Calculate “Next Pulse In”
  useEffect(() => {
    if (!lastPulse) return;
    const updateCountdown = () => {
      const diffMs = Date.now() - lastPulse.getTime();
      const mins = Math.floor(diffMs / 60000);
      const remaining = Math.max(0, INTERVAL_MINUTES - mins);
      setNextPulseIn(`${remaining}m`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 10000);
    return () => clearInterval(timer);
  }, [lastPulse]);

  // 🌈 Determine status color
  const getColor = () => {
    if (status.toLowerCase().includes("success")) return "text-green-400";
    if (status.toLowerCase().includes("error")) return "text-red-400";
    if (status.toLowerCase().includes("warning")) return "text-yellow-400";
    return "text-slate-300";
  };

  return (
    <motion.div
      className="relative w-full max-w-md mt-10 p-4 rounded-xl bg-slate-900/70 border border-slate-700/40 text-center shadow-lg backdrop-blur-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* 💡 Animated background glow */}
      <AnimatePresence>
        {isPulsing && (
          <motion.div
            key="pulse"
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 via-cyan-400/25 to-blue-800/15 blur-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.6, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <h2 className="text-lg font-semibold text-blue-400 mb-1 relative z-10">
        🫀 A.I.V.E. Heartbeat Monitor
      </h2>

      <p className={`text-sm font-medium ${getColor()} relative z-10`}>
        {status}
        {entries !== null && (
          <span className="text-slate-400 ml-1">({entries} entries)</span>
        )}
      </p>

      {lastPulse && (
        <p className="text-xs text-slate-400 mt-1 relative z-10">
          Last Pulse: {lastPulse.toLocaleTimeString()} • Next in {nextPulseIn}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-2 italic truncate relative z-10">
          ⚠ {error}
        </p>
      )}
    </motion.div>
  );
}
