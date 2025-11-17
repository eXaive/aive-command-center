"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";
import { useHeartbeat } from "@/context/HeartbeatContext";
import { useRegionalConfidence } from "@/hooks/useRegionalConfidence";

/* -------------------------------------------------------------
   🎧 Simple Local Tone Generator
------------------------------------------------------------- */
function playTone(freq: number, duration = 0.4, volume = 0.04) {
  try {
    const ctx =
      new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

/* -------------------------------------------------------------
   🌐 Neural Awareness Orb Component + ORACLE DOUBLE TAP
------------------------------------------------------------- */
export default function NeuralAwarenessOrb() {
  const {
    clarity,
    focusCategory,
    awarenessLevel,
    lastCause,
  } = useNeuralState();

  const { isPulsing } = useHeartbeat();
  const confidence = useRegionalConfidence();

  const [shockwaves, setShockwaves] = useState<number[]>([]);
  const [localPulse, setLocalPulse] = useState(false);

  /* Orb dynamic color */
  const [orbColor, setOrbColor] = useState("#22D3EE");
  const [moodLabel, setMoodLabel] = useState("Stable Awareness");
  const [pulseSpeed, setPulseSpeed] = useState(1.8);
  const [freq, setFreq] = useState(220);

  /* Awareness shimmer */
  const [crackLevel, setCrackLevel] = useState<
    "none" | "shimmer" | "fracture"
  >("none");

  /* Double-tap detector for Oracle Mode */
  const [lastTap, setLastTap] = useState(0);

  const handleOrbTap = () => {
    const now = Date.now();
    if (now - lastTap < 350) {
      // 🚀 DOUBLE TAP → ORACLE MODE
      window.dispatchEvent(new CustomEvent("oracle-open"));
    }
    setLastTap(now);
  };

  /* Average regional confidence */
  const avgConfidence = useMemo(() => {
    const vals = Object.values(confidence);
    return vals.length
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : 0.7;
  }, [confidence]);

  /* -------------------------------------------------------------
     🔥 React to ORB PULSE events (CAS & Predictions)
------------------------------------------------------------- */
  useEffect(() => {
    const handler = () => {
      setLocalPulse(true);
      setShockwaves((p) => [...p, Date.now()]);
      playTone(freq, 0.4, 0.045);
      setTimeout(() => setLocalPulse(false), 1100);
    };

    window.addEventListener("aive-orb-pulse", handler);
    return () => window.removeEventListener("aive-orb-pulse", handler);
  }, [freq]);

  /* -------------------------------------------------------------
     🧠 Orb reacts to CAS-Awareness update
------------------------------------------------------------- */
  useEffect(() => {
    const handler = (e: any) => {
      const category = e.detail?.category;

      setShockwaves((p) => [...p, Date.now()]);
      playTone(440, 0.25, 0.05);

      setMoodLabel(`Learning: ${category}`);
      setTimeout(() => setMoodLabel("Stable Awareness"), 2000);
    };

    window.addEventListener("aive-awareness-update", handler);
    return () =>
      window.removeEventListener("aive-awareness-update", handler);
  }, []);

  /* -------------------------------------------------------------
     🎨 Orb Dynamic Color Logic (Confidence + Awareness)
------------------------------------------------------------- */
  useEffect(() => {
    if (awarenessLevel > 0.8) {
      setOrbColor("#A855F7");
      setMoodLabel("High Awareness");
      setPulseSpeed(1.1);
    } else if (awarenessLevel > 0.5) {
      setOrbColor("#0EA5E9");
      setMoodLabel("Growing Awareness");
      setPulseSpeed(1.5);
    }

    if (avgConfidence > 0.9) {
      setCrackLevel("shimmer");
    } else if (avgConfidence < 0.45) {
      setCrackLevel("fracture");
    } else {
      setCrackLevel("none");
    }
  }, [avgConfidence, awarenessLevel]);

  const clarityValue = Math.min(Math.max(clarity * 100, 0), 100);
  const isGlowing = localPulse || isPulsing;

  /* -------------------------------------------------------------
     🌐 Render
------------------------------------------------------------- */
  return (
    <motion.div
      onClick={handleOrbTap}   // <-- DOUBLE-TAP ORACLE TRIGGER
      className="relative flex flex-col items-center justify-center
                 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-inner
                 cursor-pointer"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${orbColor}22, #0f172a 80%)`,
      }}
      animate={{
        scale: isGlowing ? 1.1 : 1,
        boxShadow: isGlowing
          ? `0 0 80px 25px ${orbColor}aa`
          : `0 0 40px 12px ${orbColor}66`,
      }}
      transition={{
        duration: pulseSpeed,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {/* Shockwaves */}
      <AnimatePresence>
        {shockwaves.map((id) => (
          <motion.div
            key={id}
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 3.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.9, ease: "easeOut" }}
            className="absolute w-full h-full rounded-full border"
            style={{ borderColor: orbColor }}
          />
        ))}
      </AnimatePresence>

      {/* Crack Shimmers */}
      {crackLevel === "shimmer" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 6px)",
            mixBlendMode: "overlay",
          }}
          animate={{ opacity: [0.2, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {crackLevel === "fracture" && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"><path d=\"M10 10 L50 90 L90 20\" stroke=\"rgba(255,255,255,0.18)\" stroke-width=\"1.3\"/></svg>')",
            backgroundSize: "cover",
            mixBlendMode: "overlay",
          }}
          animate={{ opacity: [0.2, 0.65, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* Orb Text */}
      <div className="relative z-10 text-center select-none">
        <p className="font-semibold text-sm sm:text-base" style={{ color: orbColor }}>
          Clarity {clarityValue.toFixed(0)}%
        </p>
        <p className="text-slate-400 text-xs sm:text-sm">
          {focusCategory || "—"}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-500 italic mt-1">
          {moodLabel}
        </p>

        {lastCause && (
          <p className="text-[10px] text-purple-300 mt-1">
            Learned: {lastCause}
          </p>
        )}

        <p className="text-[10px] text-slate-600">
          Awareness {(awarenessLevel * 100).toFixed(1)}%
        </p>
      </div>
    </motion.div>
  );
}
