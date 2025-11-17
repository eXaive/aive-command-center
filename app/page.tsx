"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* Lock Screen */
import LockScreen from "@/components/LockScreen";

/* Environment */
import StarField from "@/components/StarField";
import GlobeBackground from "@/components/GlobeBackground";
import AiveCore from "@/components/AiveCore";

/* Context */
import { NeuralStateProvider } from "@/context/NeuralStateContext";
import { HeartbeatProvider } from "@/context/HeartbeatContext";
import { PredictionFilterProvider } from "@/context/PredictionFilterContext";

/* Panels */
import PredictionsFeed from "@/components/predictions/PredictionsFeed";
import PredictiveTimeline from "@/components/PredictiveTimeline";
import AgentMarketplace from "@/components/AgentMarketplace";
import HeartbeatPanel from "@/components/HeartbeatPanel";
import DiagnosticsPanel from "@/components/DiagnosticsPanel";
import NeuralAwarenessOrb from "@/components/NeuralAwarenessOrb";
import AwarenessBar from "@/components/AwarenessBar";

/* Selectors */
import CountrySelector from "@/components/CountrySelector";
import CategorySelector from "@/components/CategorySelector";

/* NEW — Right-Side Hologram Beam */
import HologramAlert from "@/components/HologramAlert";


/* -------------------------------------------------------------
   COMMAND CENTER INNER — Main UI (Blurred until unlock)
--------------------------------------------------------------*/
function CommandCenterInner() {
  return (
    <motion.main
      className="min-h-screen bg-slate-950 text-white flex flex-col items-center px-4 pt-4 relative overflow-x-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <StarField />
        <GlobeBackground />
        <AiveCore />
      </div>

      {/* Marketplace */}
      <AgentMarketplace />

      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-400 text-center mt-2">
        🧠 A.I.V.E. Financial Command Center
      </h1>
      <p className="text-gray-400 text-xs text-center mb-4">
        Awareness • Intelligence • Verification • Evolution
      </p>

      {/* Awareness Panel */}
      <div className="flex flex-col items-center w-full max-w-md mb-6">
        <CountrySelector />
        <AwarenessBar />
        <div className="mt-3 mb-3">
          <NeuralAwarenessOrb />
        </div>
        <CategorySelector />
      </div>

      {/* Feeds */}
      <div className="w-full max-w-5xl flex flex-col items-center space-y-8 mt-4">
        <PredictionsFeed />
        <div className="w-full max-w-2xl">
          <PredictiveTimeline asset="GOLD" />
        </div>
      </div>

      {/* Panels */}
      <HeartbeatPanel />
      <DiagnosticsPanel />

      <footer className="mt-8 text-[10px] text-gray-600 text-center">
        © {new Date().getFullYear()} eX Intelligence Systems • Powered by A.I.V.E.
      </footer>
    </motion.main>
  );
}


/* -------------------------------------------------------------
   PAGE WRAPPER — Lock Screen + Command Center + Hologram Beam
--------------------------------------------------------------*/
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <NeuralStateProvider>
      <HeartbeatProvider>
        <PredictionFilterProvider>
          <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

            {/* Always running environment */}
            <StarField />
            <GlobeBackground />
            <AiveCore />

            {/* Right-Side Floating Hologram Beam */}
            <HologramAlert />

            {/* Command Center (Blurred until login) */}
            <div className={unlocked ? "" : "blur-xl opacity-40 pointer-events-none"}>
              <CommandCenterInner />
            </div>

            {/* Lock Screen */}
            {!unlocked && <LockScreen onUnlock={() => setUnlocked(true)} />}
          </main>
        </PredictionFilterProvider>
      </HeartbeatProvider>
    </NeuralStateProvider>
  );
}
