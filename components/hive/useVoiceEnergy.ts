"use client";

import { useEffect, useRef } from "react";
import { motionValue } from "framer-motion";
import { getSharedAnalyser } from "./voiceAudioManager";

export default function useVoiceEnergy() {
  const voiceLevel = motionValue(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const analyser = getSharedAnalyser();
    if (!analyser) return;

    const buffer = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(buffer);
      const avg = buffer.reduce((a, b) => a + b, 0) / (buffer.length * 255);
      voiceLevel.set(avg * 4); // adjust sensitivity here
      frameRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(frameRef.current!);
  }, [voiceLevel]);

  return voiceLevel;
}
