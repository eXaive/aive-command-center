"use client";
import { useEffect } from "react";

export default function AwarenessTester() {
  useEffect(() => {
    // Listen for the custom pulse event emitted by NeuralMind
    const handler = (e: CustomEvent) => {
      console.log("⚡ neural-pulse event detected:", e.detail);

      // Visual feedback — creates a quick overlay flash on the screen
      const pulse = document.createElement("div");
      pulse.style.position = "fixed";
      pulse.style.inset = "0";
      pulse.style.pointerEvents = "none";
      pulse.style.background =
        e.detail?.sentiment === "positive"
          ? "rgba(45,212,191,0.15)" // teal
          : e.detail?.sentiment === "negative"
          ? "rgba(248,113,113,0.15)" // red
          : "rgba(251,191,36,0.15)"; // amber (your gold/yellow pulse)
      pulse.style.transition = "opacity 1.2s ease-out";
      pulse.style.zIndex = "9999";
      document.body.appendChild(pulse);
      setTimeout(() => (pulse.style.opacity = "0"), 50);
      setTimeout(() => pulse.remove(), 1200);
    };

    window.addEventListener("neural-pulse", handler as EventListener);
    console.log("✅ AwarenessTester active — listening for neural-pulse events");

    return () => window.removeEventListener("neural-pulse", handler as EventListener);
  }, []);

  return null; // purely diagnostic
}
