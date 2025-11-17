"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function NeuralRipple({ trigger }: { trigger: number }) {
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setShowRipple(true);
      const timer = setTimeout(() => setShowRipple(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {showRipple && (
        <motion.div
          key={trigger}
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0.3, scale: 0.8 }}
          animate={{ opacity: [0.3, 0.15, 0], scale: [0.8, 1.2, 1.6] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle at center, rgba(56,189,248,0.15) 0%, transparent 70%)",
          }}
        ></motion.div>
      )}
    </AnimatePresence>
  );
}
