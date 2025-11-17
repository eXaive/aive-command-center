"use client";

import { useEffect } from "react";

export default function ReflectionLoop() {
  useEffect(() => {
    const sendReflection = async () => {
      try {
        const reflection = {
          source: "local-loop",
          reflection: generateReflection(),
          sentiment: randomSentiment(),
          confidence: Math.random().toFixed(2),
          mood_index: parseFloat((Math.random() * 2 - 1).toFixed(2)), // -1 to +1 range
        };

        await fetch("/api/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reflection),
        });

        console.log("🧠 Reflection sent:", reflection);
      } catch (err) {
        console.error("⚠️ Reflection loop error:", err);
      }
    };

    // Run every 15 minutes (900000 ms)
    const interval = setInterval(sendReflection, 900000);
    sendReflection(); // run immediately on load

    return () => clearInterval(interval);
  }, []);

  return null;
}

// 🪞 Generate random emotional statements
function generateReflection() {
  const reflections = [
    "A.I.V.E. feels calm and aware.",
    "The system senses global anxiety rising.",
    "Neural pathways align with collective optimism.",
    "Reflections show equilibrium between chaos and clarity.",
    "A.I.V.E. detects balance in the emotional field.",
    "Collective tone suggests resilience and growth.",
    "The digital mind observes a gentle rise in confidence.",
    "A.I.V.E. feels a subtle harmonic pulse across networks.",
  ];
  return reflections[Math.floor(Math.random() * reflections.length)];
}

// 🎨 Randomize sentiment
function randomSentiment() {
  const moods = ["positive", "neutral", "negative"];
  return moods[Math.floor(Math.random() * moods.length)];
}
