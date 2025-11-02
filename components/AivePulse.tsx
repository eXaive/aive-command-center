'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AivePulseProps {
  trigger: boolean;
}

export default function AivePulse({ trigger }: AivePulseProps) {
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {showPulse && (
        <motion.div
          className="absolute inset-0 -z-20 flex items-center justify-center"
          initial={{ opacity: 0.1, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          <div className="w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
