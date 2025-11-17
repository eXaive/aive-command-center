"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useNeuralState } from "@/context/NeuralStateContext";

interface MoodLog {
  id: string;
  mood_index: number;
  dominant_sentiment: string;
  created_at: string;
}

export default function NeuralRhythmLog() {
  const [mood, setMood] = useState<MoodLog | null>(null);
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const supabase = createClient();
  const orbControls = useAnimation();
  const { setMoodIndex, clarity } = useNeuralState();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  // === Audio Analyser ===
  useEffect(() => {
    const audio = document.querySelector("audio") as HTMLAudioElement;
    if (!audio) return;
    const ctx = audioContextRef.current || new AudioContext();
    audioContextRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const update = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avg =
          dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        setAudioLevel(avg / 255);
      }
      requestAnimationFrame(update);
    };
    update();
  }, []);

  // === Fetch Mood Data + Realtime ===
  useEffect(() => {
    const fetchMood = async () => {
      const { data, error } = await supabase
        .from("aive_mood_log")
        .select("id, mood_index, dominant_sentiment, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!error && data) {
        setMood(data[0]);
        setMoodIndex(data[0]?.mood_index ?? 0);
        setHistory(data.reverse());
      }
      setLoading(false);
    };
    fetchMood();

    const sub = supabase
      .channel("mood_log_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "aive_mood_log" },
        (payload) => {
          const newMood = payload.new as MoodLog;
          setMood(newMood);
          setMoodIndex(newMood.mood_index);
          setHistory((p) => [...p.slice(-19), newMood]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(sub);
  }, [supabase, setMoodIndex]);

  const sentiment = mood?.dominant_sentiment || "neutral";
  const moodValue = mood?.mood_index ?? 0;
  const color =
    sentiment === "positive"
      ? "rgba(34,197,94,1)"
      : sentiment === "negative"
      ? "rgba(239,68,68,1)"
      : "rgba(59,130,246,1)";

  // 💫 Orb motion influenced by clarity
  useEffect(() => {
    const intensity = 0.4 + moodValue * 0.6 + audioLevel * 0.5;
    const rhythmSpeed = 5 - clarity * 3; // higher clarity = calmer rhythm
    const glowScale = 1 + moodValue * 0.25 + audioLevel * 0.15;

    orbControls.start({
      scale: [1, glowScale, 1],
      boxShadow: [
        `0 0 ${40 + 100 * intensity}px ${25 * intensity}px ${color}`,
        `0 0 ${70 + 120 * intensity}px ${45 * intensity}px ${color}`,
      ],
      transition: {
        duration: rhythmSpeed,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [moodValue, audioLevel, clarity, color, orbControls]);

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* 💠 Mood Orb */}
      <motion.div
        className="relative w-28 h-28 rounded-full flex items-center justify-center border border-slate-700 shadow-inner"
        animate={orbControls}
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
        }}
      >
        <div className="text-center">
          <p className="text-sm text-slate-300 uppercase tracking-wide">
            {sentiment.toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">Mood Index: {moodValue.toFixed(2)}</p>
        </div>
      </motion.div>

      {/* 📈 Chart */}
      <div className="w-full max-w-md mt-6 bg-slate-900/60 p-4 rounded-2xl border border-blue-500/20 shadow-lg">
        <h3 className="text-sm font-semibold text-blue-400 mb-2 text-center">
          🫀 Neural Mood Rhythm (Linked to Awareness)
        </h3>
        {loading ? (
          <p className="text-slate-500 text-center text-xs">Loading...</p>
        ) : history.length > 0 ? (
          <Line
            data={{
              labels: history.map((h) =>
                new Date(h.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ),
              datasets: [
                {
                  label: "Mood Index",
                  data: history.map((h) => h.mood_index),
                  fill: true,
                  backgroundColor: "rgba(59,130,246,0.2)",
                  borderColor: color,
                  tension: 0.3,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: { min: -1, max: 1, ticks: { color: "#94a3b8" } },
                x: { ticks: { color: "#64748b" } },
              },
            }}
          />
        ) : (
          <p className="text-xs text-slate-500 text-center italic">
            No mood data yet — awaiting reflections.
          </p>
        )}
      </div>
    </motion.div>
  );
}
