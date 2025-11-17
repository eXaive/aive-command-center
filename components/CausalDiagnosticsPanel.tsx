"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Activity, Zap } from "lucide-react";

export default function CausalDiagnosticsPanel() {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="
        fixed bottom-[220px] right-6 z-[200]
        w-[280px]
        bg-slate-900/70
        backdrop-blur-xl
        border border-green-500/40
        rounded-xl
        shadow-[0_0_25px_5px_rgba(168,85,247,0.25)]
        p-4
      "
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="text-green-300 w-4 h-4" />
          <h2 className="text-green-200 text-sm font-semibold">
            Causal Diagnostics
          </h2>
        </div>

        <button
          className="text-green-300 hover:text-green-400"
          onClick={() => setOpen(!open)}
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-3 text-xs text-green-200"
        >
          <div className="p-2 bg-slate-800/50 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-400" />
              <p className="font-semibold text-green-300">
                CAS Transformer Status
              </p>
            </div>
            <p className="mt-1 text-green-400/70">
              Monitoring prediction → cause mapping…
            </p>
          </div>

          <div className="p-2 bg-slate-800/50 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-green-400" />
              <p className="font-semibold text-green-300">
                Recent Trigger
              </p>
            </div>
            <p className="mt-1 text-green-400/70">
              Waiting for next CAS activation pulse…
            </p>
          </div>

          <div className="p-2 text-center bg-green-500/10 rounded-lg border border-green-600/20">
            <p className="text-green-300 text-xs">
              CAS Engine: <span className="font-semibold">Active</span>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
