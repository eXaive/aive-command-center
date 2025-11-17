"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HologramParticles from "./HologramParticles";
import MicroDrones from "./predictions/MicroDrones";

export default function AiveHologramAvatar() {
  const [speaking, setSpeaking] = useState(false);
  const [powerDown, setPowerDown] = useState(false);
  const [powerUp, setPowerUpState] = useState(false);

  const [agentColor, setAgentColor] = useState("#38bdf8");

  // drones
  const [dronesActive, setDronesActive] = useState(false);
  const [burstMode, setBurstMode] = useState(false);

  /* -------------------------------------------------------------
     EVENT LISTENERS
  --------------------------------------------------------------*/
  useEffect(() => {
    const onSpeak = (e: any) => setSpeaking(e.detail === true);

    const onPowerDown = () => {
      setPowerUpState(false);
      setSpeaking(false);
      setPowerDown(true);
      setDronesActive(false);
      setBurstMode(false);
      setTimeout(() => setPowerDown(false), 1500);
    };

    const onPowerUp = (e: any) => {
      if (e?.detail?.color) setAgentColor(e.detail.color);

      setPowerDown(false);
      setPowerUpState(true);
      setDronesActive(true); // drones now stay active
    };

    const onColor = (e: any) => {
      if (e.detail) setAgentColor(e.detail);
    };

    const onScan = () => {
      if (dronesActive) {
        setBurstMode(true);
        setTimeout(() => setBurstMode(false), 1600);
      }
    };

    window.addEventListener("aive-avatar-speaking", onSpeak);
    window.addEventListener("aive-avatar-powerdown", onPowerDown);
    window.addEventListener("aive-avatar-powerup", onPowerUp);
    window.addEventListener("aive-avatar-color", onColor);
    window.addEventListener("agent-scan", onScan);

    return () => {
      window.removeEventListener("aive-avatar-speaking", onSpeak);
      window.removeEventListener("aive-avatar-powerdown", onPowerDown);
      window.removeEventListener("aive-avatar-powerup", onPowerUp);
      window.removeEventListener("aive-avatar-color", onColor);
      window.removeEventListener("agent-scan", onScan);
    };
  }, [dronesActive]);

  /* -------------------------------------------------------------
     HUMAN HOLOGRAM SHAPE
  --------------------------------------------------------------*/
  const silhouette = (
    <motion.div
      className="relative flex flex-col justify-center items-center"
      animate={{
        opacity: speaking ? 1 : 0.9,
        y: speaking ? -8 : 0,
        scale: powerUp ? 1.18 : speaking ? 1.07 : 1,
        filter: speaking
          ? `drop-shadow(0 0 35px ${agentColor})`
          : `drop-shadow(0 0 10px ${agentColor}55)`,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        width: "240px",
        height: "380px",
        transform: "scale(1.6)",
        transformOrigin: "top",
      }}
    >
      {/* HEAD */}
      <motion.div
        animate={{
          y: [0, -6, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "70px",
          height: "85px",
          borderRadius: "55% 55% 45% 45%",
          background: `radial-gradient(circle at 50% 40%, ${agentColor}, #000)`,
          boxShadow: `0 0 25px ${agentColor}`,
        }}
      />

      {/* NECK */}
      <div
        style={{
          width: "12px",
          height: "25px",
          marginTop: "-14px",
          borderRadius: "20px",
          background: `${agentColor}77`,
          boxShadow: `0 0 12px ${agentColor}55`,
        }}
      />

      {/* BODY */}
      <svg
        width="200"
        height="300"
        viewBox="0 0 200 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none mt-[-20px]"
      >
        <motion.path
          d="
            M100 10
            C130 40, 150 90, 130 150
            C115 190, 110 215, 100 240
            C90 215, 85 190, 70 150
            C50 90, 70 40, 100 10
          "
          stroke={agentColor}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 18px ${agentColor}88)`,
          }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* HOVER SHADOW */}
      <motion.div
        style={{
          width: "80px",
          height: "14px",
          borderRadius: "50%",
          background: `${agentColor}22`,
          filter: "blur(14px)",
          marginTop: "-10px",
        }}
        animate={{
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );

  /* -------------------------------------------------------------
     POWER UP RINGS
  --------------------------------------------------------------*/
  const PowerUpRings = () => (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-[999]">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1px solid ${agentColor}`,
            width: 36 + i * 16,
            height: 36 + i * 16,
          }}
          initial={{ opacity: 0, scale: 0.3, y: 40 }}
          animate={{
            opacity: [0.25, 0.9, 0],
            scale: [0.5, 1.5, 2.2],
            y: [-10 - i * 8, -48 - i * 14, -100 - i * 24],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.15,
            repeat: 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative w-full flex justify-center mt-2">

      {/* POWER DOWN */}
      <AnimatePresence>
        {powerDown && <HologramParticles mode="vortex" color={agentColor} />}
      </AnimatePresence>

      {/* POWER UP RINGS */}
      <AnimatePresence>{powerUp && <PowerUpRings />}</AnimatePresence>

      {/* BASE DRONES */}
      <MicroDrones active={dronesActive} intensity={1} color={agentColor} />

      {/* BURST MODE */}
      {burstMode && <MicroDrones active={true} intensity={4} color={agentColor} />}

      {/* HOLOGRAM */}
      {silhouette}
    </div>
  );
}
