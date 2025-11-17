"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MicroDrones({
  active,
  intensity = 1,
  color = "#38bdf8",
}: {
  active: boolean;
  intensity?: number;
  color?: string;
}) {
  // -------------------------------------------------------------
  // NEW: Listen for global agent color override (Recession agent)
  // -------------------------------------------------------------
  const [overrideColor, setOverrideColor] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      setOverrideColor(e.detail);
    };
    window.addEventListener("aive-avatar-color", handler);
    return () => window.removeEventListener("aive-avatar-color", handler);
  }, []);

  const finalColor = overrideColor || color;

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible z-50">
      {[...Array(8 * intensity)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 260 - 130,
            y: Math.random() * 330 - 165,
            opacity: 0.2,
            scale: 0.4,
          }}
          animate={{
            x: Math.random() * 260 - 130,
            y: Math.random() * 330 - 165,
            opacity: [0.3, 0.8, 0.3],
            scale: [0.4, 0.75, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: finalColor,
            boxShadow: `0 0 12px ${finalColor}`,
          }}
        />
      ))}
    </div>
  );
}
