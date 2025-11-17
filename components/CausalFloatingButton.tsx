"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CausalSubmitForm from "./CausalSubmitForm";

export default function CausalFloatingButton() {
  const [open, setOpen] = useState(false);
  const [glow, setGlow] = useState<null | "new" | "high" | "cas" | "pattern">(null);
  const [shake, setShake] = useState(false);

  /* ---------------------------------------------------
     Event Listeners (CAS, Prediction, Patterns)
  --------------------------------------------------- */
  useEffect(() => {
    function handleNewPrediction() {
      triggerGlow("new");
    }

    function handleHighConfidence() {
      triggerGlow("high");
    }

    function handleCasCreated() {
      triggerGlow("cas");
    }

    function handlePattern() {
      triggerGlow("pattern");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    window.addEventListener("AIVE_PREDICTION_NEW", handleNewPrediction);
    window.addEventListener("AIVE_HIGH_CONFIDENCE", handleHighConfidence);
    window.addEventListener("AIVE_CAUSAL_ENTRY_CREATED", handleCasCreated);
    window.addEventListener("AIVE_CAUSAL_PATTERN", handlePattern);

    return () => {
      window.removeEventListener("AIVE_PREDICTION_NEW", handleNewPrediction);
      window.removeEventListener("AIVE_HIGH_CONFIDENCE", handleHighConfidence);
      window.removeEventListener("AIVE_CAUSAL_ENTRY_CREATED", handleCasCreated);
      window.removeEventListener("AIVE_CAUSAL_PATTERN", handlePattern);
    };
  }, []);

  /* ---------------------------------------------------
     Glow Logic
  --------------------------------------------------- */
  function triggerGlow(type: "new" | "high" | "cas" | "pattern") {
    setGlow(type);
    setTimeout(() => setGlow(null), 2200);
  }

  /* ---------------------------------------------------
     Glow Colors
  --------------------------------------------------- */
  const glowColor =
    glow === "new"
      ? "from-blue-500 via-cyan-400 to-blue-500"
      : glow === "high"
      ? "from-amber-300 via-yellow-400 to-amber-300"
      : glow === "cas"
      ? "from-purple-500 via-pink-400 to-purple-500"
      : glow === "pattern"
      ? "from-emerald-400 via-blue-500 to-emerald-400"
      : null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        animate={shake ? { x: [-2, 2, -2, 2, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="
  fixed
  bottom-[144px] 
  right-[286px]      // ⬅ MOVE LEFT BY INCREASING THIS NUMBER
  z-[200]
  w-14 h-14
  rounded-full
  bg-gradient-to-br from-purple-600 to-fuchsia-500
  shadow-lg shadow-purple-900/40
  flex items-center justify-center
  text-white text-3xl
  select-none
  active:scale-95
"

      >
        +
        {/* Glow Aura */}
        {glowColor && (
          <motion.div
            className={`
              absolute inset-0 rounded-full 
              blur-xl opacity-70 pointer-events-none
              bg-gradient-to-r ${glowColor}
            `}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0] }}
            transition={{ duration: 1.8, repeat: 1 }}
          />
        )}
      </motion.button>

      {/* Slide-Up Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-sm flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 220 }}
              className="w-full max-w-lg bg-slate-900 rounded-t-2xl p-6 border-t border-blue-900/40"
            >
              <CausalSubmitForm onClose={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
