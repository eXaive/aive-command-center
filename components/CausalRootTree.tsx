"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNeuralState } from "@/context/NeuralStateContext";

/* 🧩 Data Interface */
interface CausalEvent {
  id: string;
  chain: string[];
  confidence: number;
  clarity: number;
}

/* ⚙️ Synapse Memory Node */
interface SynapseNode {
  label: string;
  x: number;
  y: number;
  color: string;
  strength: number;
  timestamp: number;
  clarity: number;
  confidence: number;
  trail?: string[]; // stores faint historical hues
}

/* 🌈 Color Palette */
const palette = {
  high: "rgba(56,189,248,0.8)", // blue
  mid: "rgba(234,179,8,0.8)", // amber
  low: "rgba(239,68,68,0.7)", // red
  ghost: "rgba(148,163,184,0.08)", // faint gray-blue trail
};

/* 🧠 Causal Root Tree with Heat Trails */
export default function CausalRootTree() {
  const [events, setEvents] = useState<CausalEvent[]>([]);
  const [nodes, setNodes] = useState<Record<string, SynapseNode>>({});
  const [heatMap, setHeatMap] = useState<{ x: number; y: number; color: string; fade: number }[]>([]);
  const { clarity } = useNeuralState();

  /* 📡 Listen to synthetic causality feed */
  useEffect(() => {
    const channel = new BroadcastChannel("synthetic-causality-feed");
    const handleEvent = (event: MessageEvent) => {
      const e = event.data as CausalEvent;
      setEvents((prev) => [e, ...prev.slice(0, 19)]);
    };
    channel.addEventListener("message", handleEvent);
    return () => channel.close();
  }, []);

  /* 🧬 Synaptic network update + heat trail memory */
  useEffect(() => {
    if (!events.length) return;

    setNodes((prev) => {
      const updated = { ...prev };
      const now = Date.now();

      // Decay existing strengths & generate trails
      Object.values(updated).forEach((n) => {
        n.strength *= 0.98;
        if (n.strength < 0.08) {
          // create a fading ghost trail point
          setHeatMap((prevTrail) => [
            ...prevTrail,
            { x: n.x, y: n.y, color: n.color, fade: 1 },
          ].slice(-200)); // keep last 200 trails
          delete updated[n.label];
        }
      });

      // Add new nodes from latest event
      events.slice(0, 1).forEach((e, eIndex) => {
        e.chain.forEach((cause, i) => {
          const angle = ((i / e.chain.length) * Math.PI * 2) + eIndex * 0.25;
          const radius = 100 + i * 40 + Math.random() * 15;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const color =
            e.clarity > 0.7
              ? palette.high
              : e.clarity < 0.5
              ? palette.low
              : palette.mid;

          if (updated[cause]) {
            updated[cause].strength = Math.min(1.5, updated[cause].strength + 0.15);
            updated[cause].timestamp = now;
          } else {
            updated[cause] = {
              label: cause,
              x,
              y,
              color,
              strength: 0.4 + e.confidence * 0.6,
              timestamp: now,
              clarity: e.clarity,
              confidence: e.confidence,
            };
          }
        });
      });

      return updated;
    });
  }, [events]);

  /* 🌫️ Fade out heat trails */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeatMap((prev) =>
        prev
          .map((t) => ({ ...t, fade: t.fade * 0.96 }))
          .filter((t) => t.fade > 0.05)
      );
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const nodeArray = Object.values(nodes);

  return (
    <motion.div
      className="relative w-full h-[340px] flex items-center justify-center overflow-hidden"
      animate={{
        scale: [1, 1.02 + clarity * 0.05, 1],
        opacity: [0.9, 1, 0.9],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="-250 -250 500 500" className="absolute w-full h-full">
        {/* 🔥 Heat memory trail */}
        {heatMap.map((t, i) => (
          <circle
            key={`heat-${i}`}
            cx={t.x}
            cy={t.y}
            r={1.5}
            fill={t.color.replace("0.8", (0.2 * t.fade).toFixed(2))}
            opacity={t.fade * 0.4}
          />
        ))}

        {/* ⚡ Synaptic connections */}
        {nodeArray.map((n1, i) =>
          nodeArray.map((n2, j) => {
            if (i >= j) return null;
            const distance = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            if (distance < 130) {
              const opacity = Math.min(0.6, (n1.strength + n2.strength) / 2);
              const width = 0.5 + (n1.strength + n2.strength) * 0.35;
              return (
                <motion.line
                  key={`link-${n1.label}-${n2.label}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke={n1.color}
                  strokeWidth={width}
                  strokeOpacity={opacity}
                  animate={{
                    opacity: [opacity * 0.7, opacity, opacity * 0.7],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              );
            }
            return null;
          })
        )}

        {/* 🌐 Active synapse nodes */}
        {nodeArray.map((n) => (
          <motion.circle
            key={n.label}
            cx={n.x}
            cy={n.y}
            r={2.5 + n.strength * 2.5}
            fill={n.color}
            animate={{
              scale: [1, 1.15 + n.strength * 0.15, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>

      {/* 🧾 Node Labels */}
      {nodeArray.map(
        (n) =>
          n.strength > 0.25 && (
            <motion.div
              key={n.label}
              className="absolute text-[9px] text-slate-300 select-none"
              style={{ transform: `translate(${n.x}px, ${n.y}px)` }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 2,
                repeat: Infinity,
              }}
            >
              {n.label}
            </motion.div>
          )
      )}
    </motion.div>
  );
}
