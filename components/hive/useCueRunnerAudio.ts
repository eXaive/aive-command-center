"use client";
import { useEffect, useRef } from "react";

/**
 * 🎧 useCueRunnerAudio (v2)
 * Reactive audio hook for A.I.V.E.
 * - Plays voice cues from /public/cues/voice
 * - Sentiment-aware selection (positive | neutral | negative)
 * - Smooth global fade via GainNode
 * - Exposes AudioContext globally for pulse sync + visualization
 */

export default function useCueRunnerAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const activeTrackRef = useRef<MediaElementAudioSourceNode | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentimentRef = useRef<string>("neutral");

  // 🎵 Cue library
  const cues = {
    positive: ["/cues/voice/positive_1.mp3", "/cues/voice/positive_2.mp3"],
    neutral: ["/cues/voice/neutral_1.mp3", "/cues/voice/neutral_2.mp3"],
    negative: ["/cues/voice/negative_1.mp3", "/cues/voice/negative_2.mp3"],
  };

  /* ──────────────────────────────
     🔊 Initialize AudioContext
  ────────────────────────────── */
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);

    ctxRef.current = ctx;
    gainRef.current = gain;
    (window as any).__AIVE_AUDIO_CTX = ctx; // for visualization

    // Unlock audio policy
    const unlock = async () => {
      await ctx.resume();
      console.log("🎧 Audio context unlocked and active.");
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      gain.disconnect();
      ctx.close();
    };
  }, []);

  /* ──────────────────────────────
     🎚 Smooth Fade Utility
  ────────────────────────────── */
  const fadeGain = (target: number, durationMs = 800) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.linearRampToValueAtTime(target, now + durationMs / 1000);
  };

  /* ──────────────────────────────
     ▶️ Play Sentiment Cue
  ────────────────────────────── */
  const playCue = (sentiment: string) => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    // stop previous track
    try {
      activeTrackRef.current?.disconnect();
    } catch {}

    const library = cues[sentiment as keyof typeof cues] || cues.neutral;
    const src = library[Math.floor(Math.random() * library.length)];

    const audio = new Audio(src);
    audio.crossOrigin = "anonymous";
    audio.volume = 1;

    const track = ctx.createMediaElementSource(audio);
    track.connect(gain);
    activeTrackRef.current = track;

    audio.play().catch(() => console.warn("⚠️ Audio playback requires interaction"));

    fadeGain(0.85, 1200); // fade in

    audio.onended = () => {
      fadeGain(0, 1000); // fade out
      track.disconnect();
    };
  };

  /* ──────────────────────────────
     💓 Heartbeat (repeats when sentiment stable)
  ────────────────────────────── */
  const playHeartbeat = () => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 220;
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    osc.connect(env).connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  /* ──────────────────────────────
     🧠 Event Listener
  ────────────────────────────── */
  useEffect(() => {
    const handlePulse = (e: CustomEvent) => {
      const sentiment = e.detail?.sentiment || "neutral";

      if (sentiment !== lastSentimentRef.current) {
        playCue(sentiment);
        lastSentimentRef.current = sentiment;
      } else {
        // if same sentiment persists, play heartbeat every 30s
        fadeTimeoutRef.current && clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(playHeartbeat, 30000);
      }
    };

    window.addEventListener("neural-pulse", handlePulse as EventListener);
    return () => {
      window.removeEventListener("neural-pulse", handlePulse as EventListener);
      fadeTimeoutRef.current && clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  return null; // passive background hook
}

