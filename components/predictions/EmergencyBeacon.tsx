"use client";

import { motion } from "framer-motion";

export default function EmergencyBeacon({
  severity,
  size = 34,
}: {
  severity: "none" | "medium" | "high";
  size?: number;
}) {
  // -------------------------------------------------------------
  // COLORS BASED ON SEVERITY
  // -------------------------------------------------------------
  const colorMap = {
    none: "#93c5fd33", // faint blue
    medium: "#fbbf2433", // amber
    high: "#ef444433", // red
  };

  const glowColor = {
    none: "#60a5fa55",
    medium: "#fbbf2466",
    high: "#ef444466",
  };

  const isHigh = severity === "high";
  const isMedium = severity === "medium";

  return (
    <div className="relative flex items-center justify-center">
      {/* -------------------------------------------------------------
         ROTATING TOP LIGHT (Only for HIGH Severity)
      --------------------------------------------------------------*/}
      {isHigh && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: size * 1.6,
            height: size * 1.6,
            borderRadius: "50%",
            border: `3px solid #ef4444`,
            boxShadow: "0 0 18px #ef4444aa",
          }}
        />
      )}

      {/* -------------------------------------------------------------
         FLASH RING (High severity)
      --------------------------------------------------------------*/}
      {isHigh && (
        <motion.div
          initial={{ opacity: 0.25, scale: 0.7 }}
          animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.15, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: "50%",
            border: `2px solid #ef4444aa`,
            filter: "blur(3px)",
          }}
        />
      )}

      {/* -------------------------------------------------------------
         BEACON BASE (Static shape)
      --------------------------------------------------------------*/}
      <motion.div
        animate={{
          opacity: isHigh ? [0.8, 1, 0.8] : isMedium ? [0.5, 0.8, 0.5] : 0.6,
          scale: isHigh ? [1, 1.12, 1] : 1,
        }}
        transition={{
          repeat: Infinity,
          duration: isHigh ? 1.0 : isMedium ? 2.0 : 3.5,
          ease: "easeInOut",
        }}
        style={{
          width: size,
          height: size * 0.9,
          background: colorMap[severity],
          borderRadius: "6px",
          border: `2px solid ${glowColor[severity]}`,
          boxShadow: `0 0 12px ${glowColor[severity]}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* Inner glowing light */}
        <div
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: "50%",
            background: glowColor[severity],
            boxShadow: `0 0 12px ${glowColor[severity]}`,
          }}
        />
      </motion.div>
    </div>
  );
}
