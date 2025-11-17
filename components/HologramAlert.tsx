"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveAlertPreference } from "@/lib/alerts/saveAlertPreference";
import AiveHologramAvatar from "@/components/AiveHologramAvatar";

export default function HologramAlert() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /* --------------------------------------------------------
     AUTO OPEN — from Agent Marketplace
  --------------------------------------------------------*/
  useEffect(() => {
    const openPanel = () => {
      setOpen(true);
      // 💬 Avatar speaks a greeting when opened
      speak("Awaiting your instructions.");
    };

    window.addEventListener("open-alert-panel", openPanel);
    return () => window.removeEventListener("open-alert-panel", openPanel);
  }, []);

  /* --------------------------------------------------------
     Avatar speaking helper
  --------------------------------------------------------*/
  const speak = (msg: string) => {
    setSpeaking(true);
    setMessage(msg);

    setTimeout(() => {
      setSpeaking(false);
      setMessage(null);
    }, 3000);
  };

  /* --------------------------------------------------------
     Email Saving Handler
  --------------------------------------------------------*/
  const submitEmail = async () => {
    if (!email.trim()) return;

    await saveAlertPreference(email.trim());

    speak("Alert preferences saved.");

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      {/* HOLOGRAM BEAM */}
      <motion.div
        onClick={() => {
          setOpen(true);
          speak("How can I assist?");
        }}
        className="fixed top-0 right-2 w-[6px] h-[70vh] z-[70] cursor-pointer"
        animate={{
          background: [
            "linear-gradient(to bottom, rgba(56,189,248,0.25), rgba(56,189,248,0.05))",
            "linear-gradient(to bottom, rgba(56,189,248,0.55), rgba(56,189,248,0.15))",
            "linear-gradient(to bottom, rgba(56,189,248,0.25), rgba(56,189,248,0.05))",
          ],
          boxShadow: [
            "0 0 10px rgba(56,189,248,0.4)",
            "0 0 20px rgba(56,189,248,0.7)",
            "0 0 10px rgba(56,189,248,0.4)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ borderRadius: "8px" }}
      />

      {/* SLIDE-OUT HOLOGRAM PANEL */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 250 }}
            animate={{ x: 0 }}
            exit={{ x: 250 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="fixed top-[10%] right-0 w-64 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 p-4 rounded-l-xl shadow-2xl text-white z-[80]"
          >
            <h2 className="text-sky-300 text-sm font-semibold mb-3 text-center">
              ✦ A.I.V.E. Hologram
            </h2>

            {/* AVATAR + Speech Bubble */}
            <AiveHologramAvatar speaking={speaking} message={message} />

            <p className="text-xs text-gray-400 mb-3 text-center mt-4">
              Get instant alerts when predictions match your interests.
            </p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email…"
              className="w-full p-2 text-xs rounded bg-slate-800 border border-slate-700 mb-2"
            />

            <button
              onClick={submitEmail}
              className="w-full text-xs p-2 rounded bg-blue-600 hover:bg-blue-500 transition"
            >
              Save Alerts
            </button>

            {saved && (
              <p className="text-emerald-400 text-xs mt-2 text-center">
                ✔ Alerts Activated
              </p>
            )}

            <button
              onClick={() => {
                speak("Standing by.");
                setTimeout(() => setOpen(false), 600);
              }}
              className="mt-4 text-[10px] text-slate-400 hover:text-blue-300 w-full text-center"
            >
              Close ✦
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
