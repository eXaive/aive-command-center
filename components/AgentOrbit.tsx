"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  color: string;
}

const AGENTS: Agent[] = [
  { id: "finance", name: "Finance", color: "#38bdf8" },
  { id: "geopolitics", name: "Geopolitics", color: "#34d399" },
  { id: "outbreaks", name: "Outbreaks", color: "#fb7185" },
  { id: "security", name: "Security", color: "#ef4444" },
  { id: "education", name: "Education", color: "#facc15" },
  { id: "technology", name: "Technology", color: "#818cf8" },
  { id: "energy", name: "Energy", color: "#f97316" },
  { id: "health", name: "Health", color: "#4ade80" },
];

export default function AgentOrbit({
  radius = 180,
  rotationSpeed = 0.01,
}: {
  radius?: number;
  rotationSpeed?: number;
}) {
  const [activeAgents, setActiveAgents] = useState<string[]>(AGENTS.map((a) => a.id));
  const [angle, setAngle] = useState(0);
  const [gentleMode, setGentleMode] = useState(false);

  // 🎧 Listen for agent updates and Gentle Mode toggle
  useEffect(() => {
    const onUpdate = (e: any) => {
      setActiveAgents(e.detail.activeAgents);
    };
    const onGentle = (e: any) => {
      setGentleMode(e.detail.enabled);
    };
    window.addEventListener("agent-update", onUpdate);
    window.addEventListener("gentle-mode", onGentle);
    return () => {
      window.removeEventListener("agent-update", onUpdate);
      window.removeEventListener("gentle-mode", onGentle);
    };
  }, []);

  // 🌌 Continuous rotation loop
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setAngle((a) => (a + (gentleMode ? rotationSpeed * 0.25 : rotationSpeed)) % (Math.PI * 2));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [rotationSpeed, gentleMode]);

  const visibleAgents = AGENTS.filter((a) => activeAgents.includes(a.id));
  const total = visibleAgents.length;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {visibleAgents.map((agent, i) => {
        const theta = (i / total) * Math.PI * 2 + angle;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;

        return (
          <motion.div
            key={agent.id}
            className="absolute flex items-center justify-center w-8 h-8 rounded-full text-[10px] font-semibold shadow-md cursor-pointer pointer-events-auto"
            style={{
              backgroundColor: agent.color + "33",
              color: agent.color,
              border: `1px solid ${agent.color}`,
              transform: `translate(${x}px, ${y}px)`,
            }}
            whileHover={{
              scale: 1.3,
              backgroundColor: agent.color,
              color: "#fff",
              boxShadow: `0 0 12px ${agent.color}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(
                new CustomEvent("agent-select", { detail: { agentId: agent.id } })
              );
              // 💫 Pulse animation feedback
              const el = e.currentTarget as HTMLElement;
              el.animate(
                [
                  { transform: "scale(1.2)", boxShadow: `0 0 15px ${agent.color}` },
                  { transform: "scale(1)", boxShadow: `0 0 0 ${agent.color}00` },
                ],
                { duration: 600, easing: "ease-out" }
              );
            }}
          >
            {agent.name[0]}
          </motion.div>
        );
      })}
    </div>
  );
}
