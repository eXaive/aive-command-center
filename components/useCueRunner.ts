"use client";
import { useEffect, useRef } from "react";

interface CueMap {
  positive: string[];
  neutral: string[];
  negative: string[];
}

const cueLibrary: CueMap = {
  positive: [
    "/cues/positive_field_expanding.mp3",
    "/cues/stability_restored.mp3",
    "/cues/intelligence_glow.mp3",
  ],
  neutral: [
    "/cues/field_balanced.mp3",
    "/cues/standby_mode.mp3",
    "/cues/observation_continues.mp3",
  ],
  negative: [
    "/cues/containment_alert.mp3",
    "/cues/energy_fluctuation_detected.mp3",
    "/cues/critical_field_drop.mp3",
  ],
};

export default function useCueRunner() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playCue = (sentiment: "positive" | "neutral" | "negative") => {
    // Prevent overlapping cues
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const cues = cueLibrary[sentiment];
    const randomCue = cues[Math.floor(Math.random() * cues.length)];

    const audio = new Audio(randomCue);
    audio.volume = 0.35;
    audioRef.current = audio;

    // Smooth fade in
    audio.play().catch(() => {
      console.warn("🎧 CueRunner: Audio playback blocked until user interacts.");
    });
  };

  useEffect(() => {
    const onSentiment = (e: any) => {
      const s = e.detail?.sentiment as "positive" | "neutral" | "negative";
      if (s) playCue(s);
    };

    // listen to global awareness events
    window.addEventListener("neural-awareness", onSentiment);
    window.addEventListener("neural-pulse", onSentiment);

    return () => {
      window.removeEventListener("neural-awareness", onSentiment);
      window.removeEventListener("neural-pulse", onSentiment);
    };
  }, []);

  return null;
}
