"use client";
import { useEffect, useRef } from "react";

/**
 * 🎙️ useCinematicVoice — Stage 1
 * Controls A.I.V.E.’s cinematic voice playback with queued audio cues.
 * Handles: preload, playback, cross-fade, and event-based triggers.
 */

interface VoiceCue {
  id: string;
  src: string;
  volume?: number;
  delay?: number;
}

export default function useCinematicVoice(cueList: VoiceCue[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<VoiceCue[]>([]);

  // Preload all cues
  useEffect(() => {
    cueList.forEach((cue) => {
      const a = new Audio(cue.src);
      a.preload = "auto";
    });
  }, [cueList]);

  // Core play function
  const playCue = (id: string) => {
    const cue = cueList.find((c) => c.id === id);
    if (!cue) return console.warn("🔇 Voice cue not found:", id);

    const audio = new Audio(cue.src);
    audio.volume = cue.volume ?? 0.6;
    audioRef.current = audio;
    setTimeout(() => audio.play().catch(() => {}), cue.delay ?? 0);
  };

  // Example: global event listener (intel received)
  useEffect(() => {
    const handleIntel = (e: any) => {
      if (e.detail?.mood === "positive") playCue("acknowledge");
      else if (e.detail?.mood === "alert") playCue("warning");
    };

    window.addEventListener("aive-intel-event", handleIntel);
    return () => window.removeEventListener("aive-intel-event", handleIntel);
  }, []);

  return { playCue };
}
