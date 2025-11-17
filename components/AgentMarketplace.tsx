"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePredictionFilter } from "@/context/PredictionFilterContext";

interface Agent {
  id: string;
  name: string;
  color: string;
  active: boolean;
  voice: string;
}

/* -------------------------------------------------------------
   AGENT LIST (Recession Agent Added)
------------------------------------------------------------- */
const INITIAL_AGENTS: Agent[] = [
  { id: "Finance", name: "Finance", color: "#38bdf8", active: false, voice: "bill" },
  { id: "Geopolitics", name: "Geopolitics", color: "#34d399", active: false, voice: "alice" },
  { id: "Outbreaks", name: "Outbreaks", color: "#fb7185", active: false, voice: "lily" },
  { id: "Security", name: "Security", color: "#ef4444", active: false, voice: "callum" },
  { id: "Education", name: "Education", color: "#facc15", active: false, voice: "laura" },
  { id: "Technology", name: "Technology", color: "#818cf8", active: false, voice: "george" },
  { id: "Energy", name: "Energy", color: "#f97316", active: false, voice: "harry" },
  { id: "Health", name: "Health", color: "#4ade80", active: false, voice: "sarah" },

  /* ✅ NEW AGENT: Recession */
  {
    id: "Recession",
    name: "Recession",
    color: "#8b5cf6",           // Royal Purple
    active: false,
    voice: "kallixis",          // Uses your two mp3 files
  },
];

export default function AgentMarketplace() {
  const { category } = usePredictionFilter();

  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (filename: string) => {
    try {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(`/audio/${filename}`);
      audio.volume = 1.0;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {}
  };

  /* -------------------------------------------------------------
     BEGIN SCAN
  ------------------------------------------------------------- */
  const beginScan = () => {
    if (!keyword.trim() || !activeAgent) return;

    const agent = agents.find(a => a.id === activeAgent);
    if (!agent) return;

    // Sync Hologram Color During Scan
    window.dispatchEvent(
      new CustomEvent("aive-avatar-color", {
        detail: agent.color,
      })
    );

    // Burst Scan Event
    window.dispatchEvent(
      new CustomEvent("agent-scan", {
        detail: {
          keyword: keyword.trim().toLowerCase(),
          agent: activeAgent,
          color: agent.color,
          time: Date.now(),
        },
      })
    );
  };

  /* -------------------------------------------------------------
     POWER DOWN
  ------------------------------------------------------------- */
  const releaseAgent = (agent: Agent) => {
    playAudio(`agent_${agent.voice}_11labs_down_${agent.id.toLowerCase()}.mp3`);

    window.dispatchEvent(new CustomEvent("agent-scan-end"));
    window.dispatchEvent(new CustomEvent("aive-avatar-powerdown"));

    setAgents(prev =>
      prev.map(a => (a.id === agent.id ? { ...a, active: false } : a))
    );

    setActiveAgent(null);
    setKeyword("");
  };

  /* -------------------------------------------------------------
     ACTIVATE AGENT
  ------------------------------------------------------------- */
  const toggleAgent = (id: string) => {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    if (agent.active) {
      releaseAgent(agent);
      return;
    }

    // Play activation audio
    playAudio(`agent_${agent.voice}_11labs_activate_${agent.id.toLowerCase()}.mp3`);

    setAgents(prev =>
      prev.map(a => ({
        ...a,
        active: a.id === id,
      }))
    );

    setActiveAgent(id);

    // Apply hologram color
    window.dispatchEvent(
      new CustomEvent("aive-avatar-color", { detail: agent.color })
    );

    // Power up animation
    window.dispatchEvent(
      new CustomEvent("aive-avatar-powerup", {
        detail: { color: agent.color },
      })
    );

    // Glow + speaking
    window.dispatchEvent(
      new CustomEvent("aive-avatar-speaking", { detail: true })
    );

    // Open alert panel
    window.dispatchEvent(new CustomEvent("open-alert-panel"));
  };

  /* -------------------------------------------------------------
     UI
  ------------------------------------------------------------- */
  return (
    <>
      {!open && (
        <motion.button
          onClick={() => setOpen(true)}
          className="fixed top-[30%] left-3 px-3 py-2 rounded-r-lg bg-slate-800 text-white text-xs z-50 shadow-lg hover:bg-blue-700 transition-all"
          animate={{
            boxShadow: ["0 0 0px #38bdf8", "0 0 12px #38bdf8", "0 0 0px #38bdf8"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧠 Agents
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed top-[20%] left-0 bg-slate-900/90 backdrop-blur-md border-r border-slate-700 w-64 p-4 rounded-r-2xl shadow-2xl z-40"
          >
            <h2 className="text-sky-400 font-semibold text-sm mb-3 text-center">
              🧩 Agent Marketplace
            </h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {agents.map(agent => {
                const isCategoryMatch = category === agent.name;

                return (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.03 }}
                    className="flex flex-col gap-2 border border-slate-700 p-2 rounded-md bg-slate-800"
                  >
                    {/* Agent Row */}
                    <div className="flex justify-between items-center text-xs">
                      <div
                        className="flex items-center gap-2"
                        style={{ color: agent.color }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: agent.active ? agent.color : "transparent",
                            boxShadow: agent.active
                              ? `0 0 6px ${agent.color}`
                              : isCategoryMatch
                              ? `0 0 10px ${agent.color}`
                              : "none",
                          }}
                        />
                        {agent.name}
                      </div>

                      <button
                        onClick={() => toggleAgent(agent.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition
                          ${
                            agent.active
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                      >
                        {agent.active ? "Power Down" : "Activate"}
                      </button>
                    </div>

                    {/* Scan Panel */}
                    <AnimatePresence>
                      {activeAgent === agent.id && agent.active && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="p-2 rounded-md bg-slate-900 border border-slate-700"
                        >
                          <p className="text-[11px] text-sky-300 mb-2">
                            Converge Intel
                          </p>

                          <input
                            value={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            placeholder="keyword (e.g. Bond)"
                            className="w-full text-xs bg-slate-800 border border-slate-700 p-1 rounded mb-2"
                          />

                          <button
                            onClick={beginScan}
                            className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white p-1 rounded"
                          >
                            Begin Scan
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 text-xs text-center text-slate-500 hover:text-sky-400"
            >
              ← Hide Agents
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
