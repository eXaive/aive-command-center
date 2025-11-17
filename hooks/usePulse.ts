import { useState, useCallback } from "react";

export default function usePulse(duration = 1000) {
  const [isPulsing, setIsPulsing] = useState(false);

  const triggerPulse = useCallback(() => {
    setIsPulsing(true);

    // 💫 Play soft heartbeat or hum
    const audio = new Audio("/sounds/heartbeat.mp3");
    audio.volume = 0.3; // gentle volume
    audio.play().catch(() => {
      console.warn("Audio playback skipped (likely browser autoplay policy).");
    });

    // 🔄 Reset pulse state
    setTimeout(() => {
      setIsPulsing(false);
    }, duration);
  }, [duration]);

  return { isPulsing, triggerPulse };
}
