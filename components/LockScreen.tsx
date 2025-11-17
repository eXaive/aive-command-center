"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ONLY ONE AUDIO */
const RESPONSE_AUDIO = "/audio/Wiseone.mp3";

/* -------------------------------------------------------------
   ORB
------------------------------------------------------------- */
function VoiceOrb({ listening }: { listening: boolean }) {
  return (
    <motion.div
      className="w-56 h-56 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 40% 40%, rgba(139,92,246,0.32), rgba(15,23,42,1))",
      }}
      animate={{
        scale: listening ? 1.13 : 1,
        boxShadow: listening
          ? "0 0 70px 28px rgba(139,92,246,0.55)"
          : "0 0 40px 16px rgba(139,92,246,0.32)",
      }}
      transition={{ duration: 0.6 }}
    />
  );
}

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const [activated, setActivated] = useState(false);
  const [revealed, setRevealed] = useState(false);

  let recognizer: any = null; // <-- persistent reference

  /* Play audio once */
  const playAudio = (path: string) => {
    const audio = new Audio(path);
    audio.volume = 1.0;
    audio.play();
  };

  /* -------------------------------------------------------------
     START LISTENING
  ------------------------------------------------------------- */
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not available.");
      return;
    }

    recognizer = new SpeechRecognition();
    recognizer.lang = "en-US";
    recognizer.interimResults = true;
    recognizer.continuous = true;

    recognizer.onstart = () => setListening(true);
    recognizer.onend = () => setListening(false);

    recognizer.onresult = (event: any) => {
      if (activated) return; // 🚫 STOP triggers once activated

      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();

      console.log("Heard:", transcript);

      if (
        transcript.includes("mirror") &&
        transcript.includes("prediction")
      ) {
        // 🔥 BEFORE ANYTHING ELSE — lock activation
        setActivated(true);

        // 🛑 STOP LISTENING COMPLETELY
        recognizer.stop();
        setListening(false);

        // 🎧 PLAY ONLY ONCE
        playAudio(RESPONSE_AUDIO);

        // 🎭 Reveal predictions
        setTimeout(() => {
          setRevealed(true);
        }, 1500);
      }
    };

    recognizer.start();
  };

  /* -------------------------------------------------------------
     UNLOCK CODE
  ------------------------------------------------------------- */
  const submitCode = () => {
    if (code.trim().toLowerCase() === "ex 2.8") {
      onUnlock();
    } else {
      setError("Incorrect Code");
      setTimeout(() => setError(""), 2000);
    }
  };

  /* -------------------------------------------------------------
     RENDER
  ------------------------------------------------------------- */
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-[9999] px-4">

      <div className="flex flex-col items-center gap-6 -mt-12">
        <VoiceOrb listening={listening} />

        <motion.div
          className="w-full max-w-md bg-slate-900/70 border border-slate-700/50 backdrop-blur-xl rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold text-purple-300 text-center mb-1">
            🪞 Mirror Access Protocol
          </h2>

          {!activated && (
            <p className="text-center text-blue-300 text-sm mb-4 leading-tight">
              Say:<br />
              <span className="text-purple-300">
                “Mirror mirror on the wall what’s the best prediction of them all”
              </span>
            </p>
          )}

          {revealed && (
            <motion.div
              className="mb-4 bg-slate-800/40 border border-slate-700 p-3 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-sm text-pink-300 font-semibold mb-2">
                👑 A.I.V.E.’s Best Predictions
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-800/60 rounded-md">
                  <span>Gold rises above $2,500</span>
                  <span className="text-emerald-400">✔</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-800/60 rounded-md">
                  <span>USD weakens as CPI cools</span>
                  <span className="text-emerald-400">✔</span>
                </div>

                <div className="flex justify-between p-2 bg-slate-800/60 rounded-md">
                  <span>AI sector outperforms S&P</span>
                  <span className="text-emerald-400">✔</span>
                </div>
              </div>
            </motion.div>
          )}

          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Code… (hint: eX 2.8)"
            className="w-full p-2 text-center bg-slate-800 border border-slate-700 rounded-md mb-3"
          />

          {error && (
            <p className="text-xs text-center text-red-400 mb-2">{error}</p>
          )}

          <button
            onClick={submitCode}
            className="w-full bg-purple-600 hover:bg-purple-500 transition p-2 rounded-md text-white"
          >
            Unlock
          </button>

          <div className="flex justify-center mt-4">
            <button
              onClick={startListening}
              className={`px-4 py-1 rounded-full text-xs font-medium border ${
                listening
                  ? "border-emerald-400 text-emerald-300"
                  : "border-slate-500 text-slate-400"
              }`}
            >
              🎙 {listening ? "Listening…" : "Voice Login"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
