"use client";
import { useState, useEffect } from "react";

export function useNeuralRhythm() {
  const [rhythm, setRhythm] = useState(0.5);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      const t = Date.now() / 1200;
      const wave = Math.sin(t) * 0.5 + 0.5;
      setRhythm(wave);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return rhythm;
}
