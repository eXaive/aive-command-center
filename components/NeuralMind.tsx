"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
interface Reflection {
  id: number;
  summary: string;
  sentiment: string;
  importance: number;
  created_at: string;
}
interface Metrics {
  reflections: number;
  intel: number;
  avgSentiment: number;
  mood: string;
  lastReflection: string;
  topCategory: string;
}
interface Cause {
  category: string;
  region: string;
  summary: string;
  sentiment: number;
  created_at: string;
}

/* ──────────────────────────────────────────────
   Component
────────────────────────────────────────────── */
export default function NeuralMind() {
  const supabase = createClientComponentClient();

  // 🧠 Reflections & Visuals
  const [thoughts, setThoughts] = useState<Reflection[]>([]);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative">("neutral");

  // 🪶 Awareness Log (Echo System)
  const [awarenessLog, setAwarenessLog] = useState<string[]>([]);
  const [echoPulse, setEchoPulse] = useState(false);

  // 🎧 Audio System
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  // 📊 Metrics
  const [metrics, setMetrics] = useState<Metrics>({
    reflections: 0,
    intel: 0,
    avgSentiment: 0,
    mood: "Calm",
    lastReflection: "No reflection yet.",
    topCategory: "General",
  });

  // 🧩 Latest Cause Awareness
  const [cause, setCause] = useState<Cause | null>(null);

  /* ───────────────────────────────
     🔊 Initialize Audio System
  ─────────────────────────────── */
  useEffect(() => {
    const ctx =
      (window.__AIVE_AUDIO_CTX as AudioContext) ||
      new (window.AudioContext || (window as any).webkitAudioContext)();
    (window as any).__AIVE_AUDIO_CTX = ctx;
    audioCtxRef.current = ctx;

    const unlock = () => {
      ctx.resume();
      setAudioReady(true);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);

    const keepAlive = setInterval(() => {
      if (ctx.state === "suspended") ctx.resume();
    }, 5000);

    return () => {
      clearInterval(keepAlive);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  /* ───────────────────────────────
     🔔 Reflection Ping
  ─────────────────────────────── */
  const playPing = async () => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") await ctx.resume();

      const res = await fetch("/sounds/reflection-ping.wav");
      const buf = await res.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(buf);

      const gain = ctx.createGain();
      gain.gain.value = 0.55;
      gain.connect(ctx.destination);

      const src = ctx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(gain);
      src.start(0);
    } catch (err) {
      console.warn("Ping playback failed:", err);
    }
  };

  /* ───────────────────────────────
     🧠 Supabase Reflections Channel
  ─────────────────────────────── */
  useEffect(() => {
    const channel = supabase
      .channel("memory_reflections")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memory_reflections" },
        async (payload) => {
          const reflection = payload.new as Reflection;
          setThoughts((prev) => [reflection, ...prev.slice(0, 4)]);

          if (audioReady) await playPing();
          else setAudioReady(true);

          const s = reflection.sentiment?.toLowerCase();
          if (s === "positive") setSentiment("positive");
          else if (s === "negative") setSentiment("negative");
          else setSentiment("neutral");

          // Broadcast neural awareness event
          window.dispatchEvent(new CustomEvent("neural-awareness", { detail: { sentiment: s } }));
          setRippleTrigger((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [supabase, audioReady]);

  /* ───────────────────────────────
     🧭 Fetch Causal Awareness
  ─────────────────────────────── */
  useEffect(() => {
    async function fetchCause() {
      try {
        const res = await fetch("/api/awareness/causes");
        const data = await res.json();
        if (data && !data.error) {
          setCause(data);

          // 🧩 Log + announce awareness update
          const entry = `🪞 Cause awareness: ${data.summary} (${data.category}, ${data.region})`;
          setAwarenessLog((prev) => [entry, ...prev.slice(0, 8)]);

          // 🧠 Trigger neural voice system
          window.dispatchEvent(
            new CustomEvent("neural-pulse", {
              detail: {
                sentiment:
                  data.sentiment > 0
                    ? "positive"
                    : data.sentiment < 0
                    ? "negative"
                    : "neutral",
              },
            })
          );

          console.log("🧩 Latest cause:", data);
        }
      } catch (e) {
        console.warn("⚠️ Awareness cause fetch failed", e);
      }
    }
    fetchCause();
    const interval = setInterval(fetchCause, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ───────────────────────────────
     📈 Fetch Metrics
  ─────────────────────────────── */
  useEffect(() => {
    const fetchMetrics = async () => {
      const { data: reflections } = await supabase
        .from("memory_reflections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: intel } = await supabase
        .from("intel_feed")
        .select("sentiment, category")
        .order("created_at", { ascending: false })
        .limit(25);

      if (intel && reflections) {
        const pos = intel.filter((i) => i.sentiment === "Positive").length;
        const neg = intel.filter((i) => i.sentiment === "Negative").length;
        const mood = pos > neg ? "Optimistic" : neg > pos ? "Stressed" : "Calm";
        const cat: Record<string, number> = {};
        intel.forEach((i) => (cat[i.category] = (cat[i.category] || 0) + 1));
        const topCategory =
          Object.entries(cat).sort((a, b) => b[1] - a[1])[0]?.[0] || "General";

        setMetrics({
          reflections: reflections.length,
          intel: intel.length,
          avgSentiment: ((pos - neg) / intel.length) * 100 || 0,
          mood,
          lastReflection: reflections[0]?.summary || "Awaiting reflection...",
          topCategory,
        });
      }
    };
    fetchMetrics();
    const id = setInterval(fetchMetrics, 5000);
    return () => clearInterval(id);
  }, [supabase]);

  /* ───────────────────────────────
     🧭 Render UI
  ─────────────────────────────── */
  const colors = {
    positive: "rgba(45,212,191,0.6)",
    neutral: "rgba(251,191,36,0.6)",
    negative: "rgba(248,113,113,0.6)",
  };

  return (
    <div className="relative text-center mt-8 max-w-lg mx-auto overflow-hidden">
      <h2 className="text-sm text-amber-400 mb-2">🌙 Neural Thoughts</h2>

      {/* 🌊 Ripple Visual */}
      <AnimatePresence>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={rippleTrigger + "-" + i}
            className="absolute inset-0 pointer-events-none z-50 rounded-full"
            initial={{ opacity: 0.8, scale: 0.6 }}
            animate={{
              opacity: 0,
              scale: 2.6,
              transition: { duration: 1 + i * 0.15, ease: "easeOut" },
            }}
            style={{
              background: `radial-gradient(circle at center, ${colors[sentiment]} 0%, transparent 70%)`,
              filter: "blur(18px)",
            }}
          />
        ))}
      </AnimatePresence>

      {/* 🧠 Awareness Console */}
      <motion.div
        className={`mt-6 p-4 rounded-lg border text-slate-300 text-xs shadow-lg transition-all duration-500 ${
          echoPulse
            ? "bg-slate-800/60 border-emerald-400/40 shadow-emerald-400/20"
            : "bg-slate-900/70 border-slate-800"
        }`}
      >
        <h3 className="text-amber-400 text-sm font-semibold mb-2">
          🧠 Neural Awareness Console
        </h3>

        <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
          <div>Reflections: <span className="text-blue-400">{metrics.reflections}</span></div>
          <div>Intel Entries: <span className="text-emerald-400">{metrics.intel}</span></div>
          <div>
            Sentiment Balance:{" "}
            <span
              className={
                metrics.avgSentiment > 0
                  ? "text-emerald-400"
                  : metrics.avgSentiment < 0
                  ? "text-rose-400"
                  : "text-amber-400"
              }
            >
              {metrics.avgSentiment.toFixed(1)}%
            </span>
          </div>
          <div>Dominant Category: <span className="text-cyan-400">{metrics.topCategory}</span></div>
        </div>

        <motion.div
          className="mt-3 py-2 px-3 bg-slate-800/50 rounded-md border border-slate-700 text-slate-200 text-[12px]"
          animate={{
            boxShadow:
              metrics.mood === "Optimistic"
                ? "0 0 15px rgba(16,185,129,0.4)"
                : metrics.mood === "Stressed"
                ? "0 0 15px rgba(239,68,68,0.4)"
                : "0 0 10px rgba(147,197,253,0.3)",
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <strong className="text-blue-400">System Mood:</strong>{" "}
          {cause
            ? cause.sentiment > 0
              ? "Calm Optimism"
              : cause.sentiment < 0
              ? "Reflective Concern"
              : "Stable Neutrality"
            : metrics.mood}
          <br />
          <strong className="text-slate-400">Last Reflection:</strong>{" "}
          <span className="italic">
            {cause
              ? `${cause.summary} — (${cause.category}, ${cause.region})`
              : metrics.lastReflection}
          </span>
        </motion.div>
      </motion.div>

      {/* 🧾 Awareness Log */}
      <motion.div
        className={`mt-6 p-4 rounded-lg border text-xs transition-all duration-700 ${
          echoPulse
            ? "bg-slate-800/60 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
            : "bg-slate-900/70 border-slate-800"
        }`}
      >
        <h3 className="text-emerald-400 text-sm font-semibold mb-2">
          🧩 Awareness Log
        </h3>
        {awarenessLog.length === 0 ? (
          <p className="text-slate-500 italic">No awareness echoes yet...</p>
        ) : (
          <ul className="space-y-1 text-slate-300">
            {awarenessLog.map((entry, idx) => (
              <li key={idx} className="truncate">{entry}</li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
