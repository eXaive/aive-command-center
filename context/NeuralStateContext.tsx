"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";

/* ----------------------------------------------------------------------
   🌐 Initialize Supabase
---------------------------------------------------------------------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ----------------------------------------------------------------------
   🧠 Neural State Shape
---------------------------------------------------------------------- */
interface ReflectionEntry {
  id: string;
  sentiment: "positive" | "neutral" | "negative";
  time: string;
}

interface NeuralState {
  sentiment: "positive" | "neutral" | "negative";
  reflectionEvent: number;
  log: ReflectionEntry[];
  currentGlowColor: string;
  toneLevel: "low" | "medium" | "high";

  clarity: number; // 0–1
  sentimentBalance: number; // 0–1
  focusCategory: string; // active thinking domain
  moodIndex: number; // -1..1

  setSentiment: (s: "positive" | "neutral" | "negative") => void;
  addReflection: (s: "positive" | "neutral" | "negative") => void;
  setClarity: (v: number) => void;
  setSentimentBalance: (v: number) => void;
  setFocusCategory: (v: string) => void;
  setMoodIndex: (v: number) => void;
}

/* ----------------------------------------------------------------------
   🧩 Default State
---------------------------------------------------------------------- */
const defaultState: NeuralState = {
  sentiment: "neutral",
  reflectionEvent: 0,
  log: [],
  currentGlowColor: "rgba(59,130,246,0.5)",
  toneLevel: "medium",
  clarity: 0.5,
  sentimentBalance: 0.5,
  focusCategory: "—",
  moodIndex: 0,

  setSentiment: () => {},
  addReflection: () => {},
  setClarity: () => {},
  setSentimentBalance: () => {},
  setFocusCategory: () => {},
  setMoodIndex: () => {},
};

/* ----------------------------------------------------------------------
   🧠 Global Reactive Neural Context
---------------------------------------------------------------------- */
export const NeuralStateContext = createContext<NeuralState>(defaultState);

export function NeuralStateProvider({ children }: { children: ReactNode }) {
  /* ------------------------------------------------------------------
     🧬 Emotional Layer
  ------------------------------------------------------------------ */
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative">(
    "neutral"
  );
  const [reflectionEvent, setReflectionEvent] = useState(0);
  const [log, setLog] = useState<ReflectionEntry[]>([]);

  /* Glow + tone */
  const [currentGlowColor, setCurrentGlowColor] = useState(
    "rgba(59,130,246,0.55)"
  );
  const [toneLevel, setToneLevel] = useState<"low" | "medium" | "high">(
    "medium"
  );

  /* ------------------------------------------------------------------
     🧭 Awareness Layer (Orb + Bar)
  ------------------------------------------------------------------ */
  const [clarity, setClarity] = useState(0.5);
  const [sentimentBalance, setSentimentBalance] = useState(0.5);
  const [focusCategory, setFocusCategory] = useState("Global");
  const [moodIndex, setMoodIndex] = useState(0);

  /* ------------------------------------------------------------------
     🧠 Add Reflection (Triggered by Supabase or Local)
  ------------------------------------------------------------------ */
  const addReflection = (s: "positive" | "neutral" | "negative") => {
    const entry: ReflectionEntry = {
      id: crypto.randomUUID(),
      sentiment: s,
      time: new Date().toLocaleTimeString(),
    };

    setSentiment(s);
    setReflectionEvent((n) => n + 1);
    setLog((p) => [...p.slice(-40), entry]); // keep last 40 entries

    // Fire ripple/shockwave → Orb
    window.dispatchEvent(new CustomEvent("aive-reflection-event"));
  };

  /* ------------------------------------------------------------------
     🔌 Supabase Real-Time Listener
  ------------------------------------------------------------------ */
  useEffect(() => {
    const channel = supabase
      .channel("aive_reflections_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "aive_reflections" },
        (payload) => {
          try {
            const s = payload.new?.sentiment;
            if (s === "positive" || s === "neutral" || s === "negative") {
              addReflection(s);
            }
          } catch (err) {
            console.warn("Reflection listener error:", err);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  /* ------------------------------------------------------------------
     🎨 Glow + Tone Dynamics
  ------------------------------------------------------------------ */
  useEffect(() => {
    if (log.length === 0) return;

    const last5 = log.slice(-5);
    const pos = last5.filter((r) => r.sentiment === "positive").length;
    const neg = last5.filter((r) => r.sentiment === "negative").length;
    const total = last5.length;

    const volatility = Math.abs(pos - neg);
    const intensity = (volatility + pos + neg) / total;

    // determine tone level
    const level =
      intensity < 0.3 ? "low" : intensity > 0.7 ? "high" : "medium";
    setToneLevel(level);

    // glow color
    const newColor =
      pos > neg
        ? "rgba(34,197,94,0.50)" // green glow (positive)
        : neg > pos
        ? "rgba(239,68,68,0.50)" // red glow (negative)
        : "rgba(59,130,246,0.50)"; // blue neutral
    setCurrentGlowColor(newColor);

    // signal to the Orb
    window.dispatchEvent(
      new CustomEvent("aive-neural-glow-update", {
        detail: { color: newColor, tone: level },
      })
    );
  }, [log]);

  /* ------------------------------------------------------------------
     🌡 Sentiment Balance Metric (0–1)
  ------------------------------------------------------------------ */
  useEffect(() => {
    const pos = log.filter((r) => r.sentiment === "positive").length;
    const neg = log.filter((r) => r.sentiment === "negative").length;
    const total = log.length || 1;

    const bal = (pos - neg + total) / (2 * total); // maps to 0–1
    setSentimentBalance(bal);
  }, [log]);

  /* ------------------------------------------------------------------
     Provide Global Neural State
  ------------------------------------------------------------------ */
  return (
    <NeuralStateContext.Provider
      value={{
        sentiment,
        reflectionEvent,
        log,
        currentGlowColor,
        toneLevel,
        clarity,
        sentimentBalance,
        focusCategory,
        moodIndex,

        setSentiment,
        addReflection,
        setClarity,
        setSentimentBalance,
        setFocusCategory,
        setMoodIndex,
      }}
    >
      {children}
    </NeuralStateContext.Provider>
  );
}

/* ----------------------------------------------------------------------
   Hook Accessor
---------------------------------------------------------------------- */
export const useNeuralState = () => useContext(NeuralStateContext);
