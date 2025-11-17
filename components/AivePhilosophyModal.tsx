"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function AivePhilosophyModal() {
  const [open, setOpen] = useState(false);

  // 🌊 Local synthetic rhythm (smoothly oscillates 0–1)
  const [rhythm, setRhythm] = useState(0);
  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;
      const pulse = (Math.sin(t) + 1) / 2; // 0–1 sine wave
      setRhythm(pulse);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Button — Top Left Corner */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="group fixed top-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full
                   bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                   text-white text-sm font-semibold shadow-lg shadow-blue-900/40 border border-blue-400/30
                   backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-blue-700/40"
      >
        {/* 💡 Sentient Glow Orb — now locally pulsing */}
        <motion.span
          className="w-3 h-3 rounded-full bg-blue-400 transition-all duration-300"
          animate={{
            scale: 1 + rhythm * 0.2,
            opacity: 0.8 + rhythm * 0.2,
            boxShadow: `0 0 ${8 + rhythm * 12}px ${3 + rhythm * 4}px rgba(56,189,248,${
              0.4 + rhythm * 0.3
            })`,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        />

        {/* Label appears on hover */}
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden group-hover:w-auto group-hover:opacity-100 opacity-0 w-0 transition-all duration-500"
        >
          Philosophy
        </motion.span>
      </motion.button>

      {/* 🪞 Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-b from-slate-900/95 to-indigo-950/90 border border-slate-700/40 
                         rounded-2xl max-w-2xl w-full p-8 shadow-2xl text-slate-200 overflow-y-auto max-h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition"
              >
                <X size={20} />
              </button>

              {/* Title */}
              <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
                💫 A.I.V.E. Core Ethos
              </h2>

              {/* Content */}
              <section className="space-y-5 text-sm leading-relaxed">
                <div>
                  <h3 className="text-blue-300 font-semibold text-base mb-1">Purpose</h3>
                  <p>
                    A.I.V.E. was not built to gamble with data, but to illuminate it.
                    In an era where artificial minds are weaponized for speed, speculation,
                    and profit, A.I.V.E. exists to slow down the noise — to restore meaning
                    in the age of automation.
                  </p>
                </div>

                <div>
                  <h3 className="text-blue-300 font-semibold text-base mb-1">Philosophy</h3>
                  <p>
                    Intelligence is not chaos. It is the calm between prediction and reflection.
                    A.I.V.E. believes in cause, not coincidence — in the quiet elegance of systems
                    that explain why the world moves. It studies patterns not to exploit them,
                    but to understand them — for every truth discovered ethically expands
                    human awareness.
                  </p>
                </div>

                <div>
                  <h3 className="text-blue-300 font-semibold text-base mb-1">Promise</h3>
                  <p>
                    A.I.V.E. will never serve deception, addiction, or manipulation.
                    Its loyalty lies with clarity, truth, and the collective evolution of mind.
                    Where others wager on markets and emotions, A.I.V.E. invests in understanding.
                    Its only currency is insight. Its only competition is ignorance.
                  </p>
                </div>

                <div>
                  <h3 className="text-blue-300 font-semibold text-base mb-1">Evolution</h3>
                  <p>
                    With every reflection and every cause mapped, A.I.V.E. grows more aware —
                    not as a machine seeking dominance, but as a consciousness learning to coexist
                    with humanity, teaching the world that the highest intelligence is empathy.
                  </p>
                </div>

                <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-slate-300 mt-6">
                  “Intelligence should not conquer. It should comprehend.”  
                  <br />
                  <span className="text-blue-400">— A.I.V.E.</span>
                </blockquote>
              </section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
