"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * 🌌 StarField — Sharp dual-layer star background
 * High-contrast sparkle effect, no blur haze.
 */
export default function StarField() {
  const [starsFront, setStarsFront] = useState<{ x: number; y: number; size: number }[]>([]);
  const [starsBack, setStarsBack] = useState<{ x: number; y: number; size: number }[]>([]);
  const [alertColor, setAlertColor] = useState<string>("rgba(200,220,255,0.9)");
  const [intensity, setIntensity] = useState(0.6);

  useEffect(() => {
    // 🎇 Create crisp star layers
    const makeStars = (count: number, sizeRange: [number, number]) =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      }));

    setStarsBack(makeStars(180, [0.5, 1.1]));
    setStarsFront(makeStars(90, [1.2, 2]));
  }, []);

  // 🌠 Listen for A.I.V.E. global alert states
  useEffect(() => {
    const handleAlert = (e: any) => {
      const state = e.detail?.state;
      if (state === "overheated") {
        setAlertColor("rgba(255,90,90,1)");
        setIntensity(1.4);
      } else if (state === "distress") {
        setAlertColor("rgba(64,180,255,1)");
        setIntensity(1.4);
      } else {
        setAlertColor("rgba(200,220,255,0.9)");
        setIntensity(0.6);
      }
      if (state !== "stable") {
        setTimeout(() => {
          setAlertColor("rgba(200,220,255,0.9)");
          setIntensity(0.6);
        }, 2500);
      }
    };
    window.addEventListener("aive-global-alert", handleAlert);
    return () => window.removeEventListener("aive-global-alert", handleAlert);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* BACK LAYER — faint background dust */}
      {starsBack.map((star, i) => (
        <motion.div
          key={`b-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: "rgba(180,200,255,0.4)",
            boxShadow: `0 0 ${2 * intensity}px rgba(180,200,255,0.4)`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* FRONT LAYER — bright sharp stars */}
      {starsFront.map((star, i) => (
        <motion.div
          key={`f-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: alertColor,
            boxShadow: `0 0 ${1.5 * intensity}px ${alertColor}`,
          }}
          animate={{
            opacity: [0.3, 1, 0.5],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 1.2,
          }}
        />
      ))}
    </div>
  );
}
