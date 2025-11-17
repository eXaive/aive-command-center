"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientFadeMount({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted)
    return (
      <div className="fixed inset-0 flex items-center justify-center text-slate-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm tracking-wider"
        >
          Initializing awareness...
        </motion.div>
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="main"
        className="relative z-40 min-h-screen overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
