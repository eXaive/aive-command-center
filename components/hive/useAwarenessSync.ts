"use client";

import { useEffect, useState } from "react";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

/**
 * Shared low-intensity glow synchronization hook.
 * All modules can subscribe to awarenessPulse without extra wiring.
 */
export default function useAwarenessSync(duration: number = 1200) {
  const { awarenessPulse } = usePredictionFilter();
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (awarenessPulse) {
      setGlow(true);
      const t = setTimeout(() => setGlow(false), duration);
      return () => clearTimeout(t);
    }
  }, [awarenessPulse, duration]);

  return glow;
}
