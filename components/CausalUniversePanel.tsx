"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import useAwarenessSync from "@/components/hive/useAwarenessSync";

export default function CausalUniversePanel() {
  const { setGlobalFocus, globalFocus, region, awarenessPulse } = usePredictionFilter();
  const softPulse = useAwarenessSync();

  /* 🌐 Generate mock causal nodes and edges (for stable visual depth) */
  const [nodes] = useState(() =>
    Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
    }))
  );

  const [edges] = useState(() =>
    Array.from({ length: 35 }).map(() => {
      const source = Math.floor(Math.random() * nodes.length);
      let target = Math.floor(Math.random() * nodes.length);
      if (target === source) target = (target + 1) % nodes.length;
      return { source, target };
    })
  );

  return (
    <div className="relative w-full h-[500px] rounded-xl border border-slate-800 overflow-hidden bg-slate-950/40 backdrop-blur-sm">
      {/* 🌌 Causal Universe Canvas */}
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        {/* 🔵 Placeholder 3D sphere for layout stability */}
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color={awarenessPulse ? "#38bdf8" : "#1e40af"}
            emissive={awarenessPulse ? "#60a5fa" : "#1e3a8a"}
            emissiveIntensity={0.45}
          />
        </mesh>
      </Canvas>

      {/* 🌊 Soft Unified Glow */}
      <AnimatePresence>
        {softPulse && (
          <motion.div
            key="soft-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.15, 0], scale: [1, 1.05, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 rounded-xl bg-blue-400/10 pointer-events-none blur-2xl"
          />
        )}
      </AnimatePresence>

      {/* 🔘 Exit Focus Button */}
      <button
        onClick={() => setGlobalFocus(false)}
        className="absolute top-3 right-3 text-xs bg-slate-800/60 px-3 py-1 rounded text-blue-300 hover:bg-slate-700/60"
      >
        Exit Focus
      </button>

      {/* 🌍 Region Indicator + Finance Focus */}
      <div className="absolute bottom-4 left-3 text-sm text-blue-300">
        {globalFocus ? (
          <>
            <div>Causal Focus: {region}</div>
            <div className="text-xs text-blue-400/70 italic">Finance Focus</div>
          </>
        ) : (
          <div className="text-blue-300">Global Finance View</div>
        )}
      </div>
    </div>
  );
}
