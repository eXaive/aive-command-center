"use client";

import { motion } from "framer-motion";

export default function HologramParticles({
  mode = "vortex",
  color = "#38bdf8",
}: {
  mode?: "vortex" | "spiral-rise";
  color?: string;
}) {
  const particles = Array.from({ length: 34 });

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 overflow-visible pointer-events-none z-[999]">
      {particles.map((_, i) => {
        const delay = Math.random() * 0.12;
        const swirl = (Math.random() * 60 + 30) * (Math.random() > 0.5 ? 1 : -1);
        const upwardLift = Math.random() * -140 - 60;
        const downwardFall = Math.random() * 120 + 80;

        const style = {
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        };

        let animate;

        if (mode === "vortex") {
          animate = {
            opacity: [1, 1, 0],
            scale: [1, 0.8, 0.2],
            x: [0, swirl, 0],
            y: [0, 20, downwardFall],
          };
        }

        if (mode === "spiral-rise") {
          animate = {
            opacity: [0, 1, 0.3, 0],
            scale: [0.3, 1, 0.6],
            x: [0, swirl * 0.5, swirl * 1.2, swirl * 0.3],
            y: [0, upwardLift * 0.4, upwardLift],
          };
        }

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            animate={animate}
            transition={{
              duration: mode === "spiral-rise" ? 1.8 : 1.4,
              delay,
              ease: "easeInOut",
            }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={style}
          />
        );
      })}
    </div>
  );
}
