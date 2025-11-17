"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeuralAwarenessOrb from "@/components/NeuralAwarenessOrb";
import UpcomingTranslucentPanel from "./UpcomingTranslucentPanel";
import VoiceActivationButton from "./VoiceActivationButton";
import { useRouter } from "next/navigation";

/* AUDIO FILES (replace with your deep voice later)
   Save in: /public/audio/
   - activation.mp3
   - mirror-trigger.mp3
   - reveal.mp3
*/
const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

export default function IntroGate() {
  const router = useRouter();

  const [listening, setListening] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const [unlockCode, setUnlockCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const recognitionRef = useRef<any>(null);

  /* --------------------------------------------
     Initialize Speech Recognition
  -------------------------------------------- */
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript.toLowerCase();

      if (
        transcript.includes("mirror mirror") ||
        transcript.includes("mirror, mirror")
      ) {
        playSound("/audio/mirror-trigger.mp3");
        setTriggered(true);
      }

      setListening(false);
    };

    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const beginListening = () => {
    try {
      playSound("/audio/activation.mp3");
      setListening(true);
      recognitionRef.current?.start();
    } catch {}
  };

  /* --------------------------------------------
     Unlock Logic
  -------------------------------------------- */
  const handleUnlock = () => {
    if (unlockCode.trim().toLowerCase() === "ex 2.8") {
      playSound("/audio/reveal.mp3");
      setUnlocked(true);

      setTimeout(() => {
        router.push("/");
      }, 1400);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center pt-10 px-4 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Optional: Starfield, Globe, etc */}
      </div>

      {/* ------------------ ORB ------------------ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3 }}
        className="mt-6"
      >
        <NeuralAwarenessOrb />
      </motion.div>

      {/* Prompt to speak */}
      <AnimatePresence>
        {!triggered && (
          <motion.p
            className="text-slate-400 mt-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Tap below and say:
            <span className="text-purple-300"> “Mirror, mirror…”</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* ------------------ VOICE BUTTON ------------------ */}
      <div className="mt-4">
        <VoiceActivationButton listening={listening} startListening={beginListening} />
      </div>

      {/* ------------------ REVEAL TOP 3 ------------------ */}
      <AnimatePresence>
        {triggered && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="mt-10 w-full max-w-md space-y-4"
          >
            <h2 className="text-lg font-semibold text-blue-300 text-center">
              Top 3 Confirmed Predictions
            </h2>

            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 backdrop-blur-md">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✔</span>
                  Gold rises above $2,500
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✔</span>
                  USD weakens as CPI cools
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-lg">✔</span>
                  AI sector outperforms S&P
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------ TRANSLUCENT PANEL ------------------ */}
      <div className="fixed bottom-0 left-0 w-full">
        <UpcomingTranslucentPanel />
      </div>

      {/* ------------------ UNLOCK SECTION ------------------ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 flex flex-col items-center"
      >
        <p className="text-xs text-slate-500 mb-2">Enter key to unlock A.I.V.E.</p>

        <input
          type="text"
          value={unlockCode}
          onChange={(e) => setUnlockCode(e.target.value)}
          placeholder="Enter code…"
          className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none"
        />

        <button
          onClick={handleUnlock}
          className="mt-3 px-5 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Unlock
        </button>
      </motion.div>
    </div>
  );
}
