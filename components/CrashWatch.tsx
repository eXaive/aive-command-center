"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

interface Country {
  id: number;
  name: string;
  risk_score: number;
  headline: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CrashWatch() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [prevCountries, setPrevCountries] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const [heartbeatSpeed, setHeartbeatSpeed] = useState(3);
  const [utcTime, setUtcTime] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [flashColor, setFlashColor] = useState<string>("");

  const prevAvgRisk = useRef<number>(0);
  const audioCtx = useRef<AudioContext | null>(null);

  // === smooth harmonic tone ===
  function playAlertSound(type: "warning" | "stable" = "warning") {
    if (!audioCtx.current)
      audioCtx.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

    const ctx = audioCtx.current;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    if (type === "warning") {
      osc1.frequency.value = 440;
      osc2.frequency.value = 660;
    } else {
      osc1.frequency.value = 240;
      osc2.frequency.value = 360;
    }

    const start = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.25, start + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 1.8);

    osc1.start();
    osc2.start();
    osc1.stop(start + 2);
    osc2.stop(start + 2);
  }

  // === Supabase fetch ===
  async function fetchCountries() {
    try {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("risk_score", { ascending: false });
      if (error) throw error;

      const map: Record<number, number> = {};
      data?.forEach((c) => (map[c.id] = c.risk_score));
      setPrevCountries((prev) => ({ ...prev, ...map }));
      setCountries(data || []);

      setLastUpdated(new Date().toLocaleTimeString());
      setFade(true);
      setTimeout(() => setFade(false), 400);
    } catch (err) {
      console.error("❌ Error loading countries", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCountries();
    const interval = setInterval(fetchCountries, 60_000);
    return () => clearInterval(interval);
  }, []);

  // === global average ===
  const avgRisk = useMemo(() => {
    if (!countries.length) return 0;
    return (
      countries.reduce((sum, c) => sum + (c.risk_score || 0), 0) /
      countries.length
    );
  }, [countries]);

  // === global alert trigger ===
  useEffect(() => {
    if (!countries.length) return;

    if (prevAvgRisk.current < 80 && avgRisk >= 80) {
      playAlertSound("warning");
      setFlashColor("red");
      setTimeout(() => setFlashColor(""), 1800);
    } else if (prevAvgRisk.current >= 80 && avgRisk < 80) {
      playAlertSound("stable");
      setFlashColor("blue");
      setTimeout(() => setFlashColor(""), 1800);
    }

    prevAvgRisk.current = avgRisk;
  }, [avgRisk, countries]);

  // === heartbeat / UTC clock ===
  useEffect(() => {
    const update = () => {
      const hour = new Date().getUTCHours();
      setHeartbeatSpeed(hour >= 0 && hour < 7 ? 2 : hour < 14 ? 2.5 : hour < 21 ? 2 : 4);
      setUtcTime(new Date().toUTCString().split(" ")[4]);
    };
    update();
    const i1 = setInterval(update, 1000);
    return () => clearInterval(i1);
  }, []);

  // === color logic ===
  const shimmerColor =
    avgRisk >= 80
      ? "from-red-500 via-rose-500 to-red-400"
      : avgRisk >= 50
      ? "from-amber-400 via-yellow-400 to-amber-300"
      : "from-blue-400 via-sky-500 to-blue-400";

  const shimmerLabel =
    avgRisk >= 80
      ? "⚠️ Global Stress High"
      : avgRisk >= 50
      ? "🟡 Moderate Risk"
      : "🟦 Stable Conditions";

  const clockGlow =
    avgRisk >= 80
      ? "text-red-600"
      : avgRisk >= 50
      ? "text-amber-500"
      : "text-blue-500";

  const flashClass =
    flashColor === "red"
      ? "animate-flashRed"
      : flashColor === "blue"
      ? "animate-flashBlue"
      : "";

  return (
    <div
      className={`bg-white border rounded-lg shadow-sm h-full flex flex-col transition-all relative overflow-hidden ${flashClass}`}
    >
      {/* Flash overlay */}
      {flashColor && (
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            flashColor === "red" ? "bg-red-500" : "bg-blue-500"
          }`}
        ></div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Crash Watch
        </h2>
        <div
          className={`w-3 h-3 rounded-full bg-gradient-to-r ${shimmerColor}`}
          style={{
            animation: `heartbeat ${heartbeatSpeed}s ease-in-out infinite`,
          }}
        ></div>
      </div>

      {/* UTC Clock */}
      <div
        className={`text-[11px] font-semibold mb-3 ${clockGlow} px-4`}
        style={{
          textShadow:
            avgRisk >= 80
              ? "0 0 8px rgba(220,38,38,0.8)"
              : avgRisk >= 50
              ? "0 0 8px rgba(245,158,11,0.7)"
              : "0 0 8px rgba(59,130,246,0.7)",
          animation: `glowPulse ${heartbeatSpeed}s ease-in-out infinite`,
        }}
      >
        🌐 UTC Time | {utcTime || "Loading..."}
      </div>

      {/* Risk label */}
      <div
        className={`text-xs font-medium mb-2 text-right px-4 ${
          avgRisk >= 80
            ? "text-red-600"
            : avgRisk >= 50
            ? "text-amber-500"
            : "text-blue-600"
        }`}
      >
        {shimmerLabel}
      </div>

      {/* Country List */}
      <div className="px-4 pb-4 flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-slate-500 text-sm">Loading countries…</div>
        ) : (
          <ul
            className={`space-y-2 transition-opacity duration-500 ${
              fade ? "opacity-50" : "opacity-100"
            }`}
          >
            {countries.map((c) => {
              const prev = prevCountries[c.id];
              const hasChanged = prev !== undefined && prev !== c.risk_score;
              const changeColor =
                c.risk_score >= 80
                  ? "bg-red-100"
                  : c.risk_score >= 50
                  ? "bg-amber-100"
                  : "bg-blue-100";

              return (
                <li
                  key={c.id}
                  className={`flex justify-between items-center border-b pb-1 text-sm px-1 rounded transition-all duration-[1500ms] ease-in-out ${
                    hasChanged ? changeColor : "bg-transparent"
                  }`}
                >
                  <span className="font-medium text-slate-700">{c.name}</span>
                  <span
                    className={`font-semibold ${
                      c.risk_score >= 80
                        ? "text-red-600"
                        : c.risk_score >= 50
                        ? "text-amber-500"
                        : "text-blue-600"
                    }`}
                  >
                    {c.risk_score}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-1 text-[11px] text-slate-400 text-right px-4 pb-2">
        Last updated {lastUpdated || "–"}
      </div>

      <style jsx global>{`
        @keyframes heartbeat {
          0%,100%{transform:scale(1);opacity:.85}
          30%{transform:scale(1.3);opacity:1}
          60%{transform:scale(1.1);opacity:.95}
        }
        @keyframes glowPulse {
          0%,100%{filter:brightness(1);opacity:.9}
          30%{filter:brightness(1.3);opacity:1}
          60%{filter:brightness(1.1);opacity:.95}
        }
        @keyframes flashRed {
          0%{box-shadow:0 0 0 rgba(220,38,38,0)}
          25%{box-shadow:0 0 25px rgba(220,38,38,0.6)}
          100%{box-shadow:0 0 0 rgba(220,38,38,0)}
        }
        @keyframes flashBlue {
          0%{box-shadow:0 0 0 rgba(59,130,246,0)}
          25%{box-shadow:0 0 25px rgba(59,130,246,0.6)}
          100%{box-shadow:0 0 0 rgba(59,130,246,0)}
        }
        .animate-flashRed{animation:flashRed 2s ease-out}
        .animate-flashBlue{animation:flashBlue 2s ease-out}
      `}</style>
    </div>
  );
}
