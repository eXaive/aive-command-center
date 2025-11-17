"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ReactCountryFlag from "react-country-flag";

import { supabase } from "@/lib/supabaseClient";
import { usePredictionFilter } from "@/context/PredictionFilterContext";
import { playSentimentTone } from "@/lib/audio/triggerTone";

import MicroDrones from "@/components/predictions/MicroDrones";
import ScanOverlay from "@/components/predictions/ScanOverlay";
import PredictionCard from "@/components/predictions/PredictionCard";
import EmergencyBeacon from "@/components/predictions/EmergencyBeacon";

const ISO_MAP: Record<string, string> = {
  "United States": "US",
  Brazil: "BR",
  Jamaica: "JM",
  Russia: "RU",
  "Saudi Arabia": "SA",
  China: "CN",
  Singapore: "SG",
  Nigeria: "NG",
  Australia: "AU",
  Global: "UN",
};

function normalizeCountry(v?: string | null): string {
  if (!v) return "Global";
  const s = v.trim().toLowerCase();
  if (["us", "usa", "united states"].includes(s)) return "United States";
  if (["russia", "ru"].includes(s)) return "Russia";
  if (["saudi arabia", "sa", "ksa"].includes(s)) return "Saudi Arabia";
  return v;
}

interface Prediction {
  id: string;
  country: string;
  category: string;
  headline: string;
  prediction?: string;
  confidence: number;
  sentiment?: string;
  created_at: string;
  verified_at?: string;
}

export default function PredictionsFeed() {
  const { country } = usePredictionFilter();

  const selectedCountry = normalizeCountry(country);
  const iso = ISO_MAP[selectedCountry] || "UN";

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  const [scanKeyword, setScanKeyword] = useState<string | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // ⭐ NEW: compute severity for the emergency beacon
  const severity = useMemo(() => {
    let high = 0;
    let medium = 0;

    for (const p of predictions) {
      const text = `${p.headline} ${p.prediction || ""}`.toLowerCase();

      const HIGH = ["crash", "default", "collapse", "war", "recession", "invasion"];
      const MED = ["volatility", "shortage", "tension"];

      if (HIGH.some(k => text.includes(k))) high++;
      else if (MED.some(k => text.includes(k))) medium++;
    }

    if (high > 0) return "high";
    if (medium > 0) return "medium";
    return "none";
  }, [predictions]);

  // SCAN SYSTEM
  useEffect(() => {
    const onScan = (e: any) => {
      const key = e.detail.keyword.toLowerCase();
      setScanKeyword(key);
      setScannerActive(true);

      const match = predictions.find(
        p =>
          p.headline.toLowerCase().includes(key) ||
          p.prediction?.toLowerCase().includes(key)
      );

      if (match) {
        setHighlightedId(match.id);

        setTimeout(() => {
          const el = document.getElementById(`prediction-${match.id}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);

        setTimeout(() => setHighlightedId(null), 1400);
      }
    };

    const onScanEnd = () => {
      setScannerActive(false);
      setScanKeyword(null);
    };

    window.addEventListener("agent-scan", onScan);
    window.addEventListener("agent-scan-end", onScanEnd);

    return () => {
      window.removeEventListener("agent-scan", onScan);
      window.removeEventListener("agent-scan-end", onScanEnd);
    };
  }, [predictions]);

  // Initial load
  useEffect(() => {
    supabase
      .from("predictions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(220)
      .then(({ data }) => {
        if (data) {
          setPredictions(
            data.map(p => ({
              ...p,
              country: normalizeCountry(p.country),
            }))
          );
        }
      });
  }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("predictions_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "predictions" },
        payload => {
          const p = payload.new as Prediction;
          p.country = normalizeCountry(p.country);

          playSentimentTone(
            p.sentiment === "positive"
              ? "positive"
              : p.sentiment === "negative"
              ? "negative"
              : "neutral"
          );

          setPulse(true);
          setTimeout(() => setPulse(false), 1200);

          setPredictions(prev => [p, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <motion.div
      animate={{
        boxShadow: pulse
          ? ["0 0 12px #38bdf8", "0 0 25px #0ea5e9", "0 0 12px #38bdf8"]
          : "0 0 0px transparent",
      }}
      transition={{ duration: 1.2 }}
      className="relative mt-10 w-full max-w-2xl 
                 rounded-xl p-4 
                 border border-slate-800 
                 bg-slate-900/70 
                 shadow-lg backdrop-blur-sm"
    >
      <MicroDrones active={scannerActive} />
      <ScanOverlay keyword={scanKeyword} active={scannerActive} />

      <h2 className="text-xl font-semibold text-blue-300 text-center mb-6 flex items-center justify-center gap-3">

        <EmergencyBeacon severity={severity} />

        <ReactCountryFlag
          countryCode={iso}
          svg
          style={{ width: "2rem", height: "2rem" }}
        />

        {selectedCountry} — Predictions
      </h2>

      <div className="space-y-4">
        {predictions
          .filter(p => p.country === selectedCountry || p.country === "Global")
          .map(p => (
            <PredictionCard
              key={p.id}
              prediction={p}
              expanded={expanded === p.id}
              onToggle={() =>
                setExpanded(prev => (prev === p.id ? null : p.id))
              }
              scannerActive={scannerActive}
              scanKeyword={scanKeyword}
              highlightedId={highlightedId}
            />
          ))}
      </div>
    </motion.div>
  );
}
