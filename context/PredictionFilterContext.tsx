"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { playAiveTone } from "@/lib/audio/aiveToneEngine";

/* ============================================================
   Types
============================================================ */
interface FiscalPolicyProfile {
  inflation_target: string;
  interest_rate: string;
  currency: string;
  central_bank: string;
  gdp_growth: string;
  notes: string;
}

interface ExchangeProfile {
  name: string;
  code: string;
}

interface PredictionFilterContextType {
  category: string;
  country: string;
  dayOffset: number;

  setCategory: (c: string) => void;
  setCountry: (c: string) => void;
  setDayOffset: (d: number) => void;

  globalFocus: boolean;
  setGlobalFocus: (v: boolean) => void;

  selectedCoords: [number, number] | null;
  setSelectedCoords: (coords: [number, number] | null) => void;

  fiscalProfile: FiscalPolicyProfile | null;
  exchange: ExchangeProfile | null;

  awarenessPulse: boolean;

  // ⭐ NEW: tells Agent Marketplace which agent should glow
  highlightedAgent: string | null;
}

/* ============================================================
   Normalize Country Input
============================================================ */
const normalizeCountry = (value: string) => {
  if (!value) return "United States";

  const c = value.toLowerCase().trim();
  if (["usa", "america", "united states"].includes(c)) return "United States";

  return value;
};

/* ============================================================
   Agent → Category Mapping
   (you can easily expand this later)
============================================================ */
const CATEGORY_AGENT_MAP: Record<string, string> = {
  Finance: "finance",
  Geopolitics: "geopolitics",
  Outbreaks: "outbreaks",
  Security: "security",
  Education: "education",
  Technology: "technology",
  Energy: "energy",
  Health: "health",
};

/* ============================================================
   Context Create
============================================================ */
const PredictionFilterContext = createContext<PredictionFilterContextType>(
  {} as PredictionFilterContextType
);

/* ============================================================
   Provider
============================================================ */
export function PredictionFilterProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState("Finance");
  const [country, setCountry] = useState("United States");
  const [dayOffset, setDayOffset] = useState(0);

  const [globalFocus, setGlobalFocus] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);

  const [fiscalProfile, setFiscalProfile] = useState<FiscalPolicyProfile | null>(null);
  const [exchange, setExchange] = useState<ExchangeProfile | null>(null);

  const [awarenessPulse, setAwarenessPulse] = useState(false);

  // ⭐ NEW STATE: which agent should glow in the marketplace
  const [highlightedAgent, setHighlightedAgent] = useState<string | null>("finance");

  /* ============================================================
     Minimal 9-Country Coordinate Map
============================================================ */
  const coordsMap: Record<string, [number, number]> = {
    "United States": [37.1, -95.7],
    China: [35.9, 104.2],
    Russia: [61.5, 105.3],
    Brazil: [-14.2, -51.9],
    Jamaica: [18.1, -77.3],
    Nigeria: [9.1, 8.7],
    Australia: [-25.3, 133.8],
    Singapore: [1.3, 103.8],
    "Saudi Arabia": [23.9, 45.1],
  };

  /* ============================================================
     Fiscal Policy Profiles
============================================================ */
  const fiscalData: Record<string, FiscalPolicyProfile> = {
    "United States": {
      inflation_target: "2%",
      interest_rate: "5.25%",
      currency: "USD",
      central_bank: "Federal Reserve",
      gdp_growth: "2.6%",
      notes: "Benchmark global monetary anchor.",
    },
    China: {
      inflation_target: "3%",
      interest_rate: "3.45%",
      currency: "CNY",
      central_bank: "People's Bank of China",
      gdp_growth: "4.8%",
      notes: "Manufacturing and export-led model.",
    },
    Russia: {
      inflation_target: "4%",
      interest_rate: "16%",
      currency: "RUB",
      central_bank: "Bank of Russia",
      gdp_growth: "1.5%",
      notes: "High-rate stabilization under sanctions.",
    },
    Brazil: {
      inflation_target: "3.25%",
      interest_rate: "12.75%",
      currency: "BRL",
      central_bank: "Banco Central",
      gdp_growth: "2.1%",
      notes: "Latin America's largest economy.",
    },
    Jamaica: {
      inflation_target: "4–6%",
      interest_rate: "7.0%",
      currency: "JMD",
      central_bank: "Bank of Jamaica",
      gdp_growth: "2.5%",
      notes: "Tourism and remittance-driven.",
    },
    Nigeria: {
      inflation_target: "9%",
      interest_rate: "18.75%",
      currency: "NGN",
      central_bank: "Central Bank of Nigeria",
      gdp_growth: "3.2%",
      notes: "Africa’s largest population & economy.",
    },
    Australia: {
      inflation_target: "2–3%",
      interest_rate: "4.35%",
      currency: "AUD",
      central_bank: "Reserve Bank of Australia",
      gdp_growth: "2.3%",
      notes: "Commodity and housing-driven cycles.",
    },
    Singapore: {
      inflation_target: "2%",
      interest_rate: "3.7%",
      currency: "SGD",
      central_bank: "Monetary Authority of Singapore",
      gdp_growth: "1.8%",
      notes: "FX-band monetary strategy.",
    },
    "Saudi Arabia": {
      inflation_target: "2%",
      interest_rate: "6%",
      currency: "SAR",
      central_bank: "Saudi Central Bank",
      gdp_growth: "3.5%",
      notes: "Oil-backed fiscal stability.",
    },
  };

  /* ============================================================
     Stock Exchange Map
============================================================ */
  const exchangeMap: Record<string, ExchangeProfile> = {
    "United States": { name: "New York Stock Exchange", code: "NYSE" },
    China: { name: "Shanghai Stock Exchange", code: "SSE" },
    Russia: { name: "Moscow Exchange", code: "MOEX" },
    Brazil: { name: "B3 São Paulo", code: "BVMF" },
    Jamaica: { name: "Jamaica Stock Exchange", code: "JSE" },
    Nigeria: { name: "Nigerian Exchange Group", code: "NGX" },
    Australia: { name: "Australian Securities Exchange", code: "ASX" },
    Singapore: { name: "Singapore Exchange", code: "SGX" },
    "Saudi Arabia": { name: "Tadawul", code: "TASI" },
  };

  /* ============================================================
     When Category Changes → Tell Agent Marketplace which agent to glow
============================================================ */
  useEffect(() => {
    const agent = CATEGORY_AGENT_MAP[category] || null;
    setHighlightedAgent(agent);

    // 🔵 Play soft neutral tone for awareness shift
    playAiveTone("neutral");
  }, [category]);

  /* ============================================================
     When Country Changes (same as before)
============================================================ */
  useEffect(() => {
    const final = normalizeCountry(country);

    setSelectedCoords(coordsMap[final] || [0, 0]);
    setFiscalProfile(fiscalData[final] || null);
    setExchange(exchangeMap[final] || null);

    playAiveTone("neutral");

    setAwarenessPulse(true);
    const t = setTimeout(() => setAwarenessPulse(false), 900);
    return () => clearTimeout(t);
  }, [country]);

  return (
    <PredictionFilterContext.Provider
      value={{
        category,
        country,
        dayOffset,
        setCategory,
        setCountry,
        setDayOffset,
        globalFocus,
        setGlobalFocus,
        selectedCoords,
        setSelectedCoords,
        fiscalProfile,
        exchange,
        awarenessPulse,
        highlightedAgent, // ⭐ NEW
      }}
    >
      {children}
    </PredictionFilterContext.Provider>
  );
}

export const usePredictionFilter = () =>
  useContext(PredictionFilterContext);

