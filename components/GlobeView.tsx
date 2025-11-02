"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

// Load Globe only on the client side
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CountryData {
  id: number;
  name: string;
  region: string;
  risk_score: number;
  confidence_score?: number; // for future AI verification
}

interface GlobeViewProps {
  width?: number;
  height?: number;
  regionPing?: string;
}

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 37.0902, lng: -95.7129 },
  CN: { lat: 35.8617, lng: 104.1954 },
  IN: { lat: 20.5937, lng: 78.9629 },
  DE: { lat: 51.1657, lng: 10.4515 },
  JP: { lat: 36.2048, lng: 138.2529 },
  BR: { lat: -14.235, lng: -51.9253 },
  NG: { lat: 9.082, lng: 8.6753 },
  RU: { lat: 61.524, lng: 105.3188 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  AU: { lat: -25.2744, lng: 133.7751 },
};

export default function GlobeView({
  width = 320,
  height = 320,
  regionPing,
}: GlobeViewProps) {
  const globeRef = useRef<any>();
  const [data, setData] = useState<CountryData[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);

  // === Fetch from Supabase ===
  async function loadData() {
    const { data, error } = await supabase.from("countries").select("*");
    if (error) console.error("❌ Error loading Supabase data:", error);
    if (data) setData(data);
  }

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("countries-live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "countries" },
        (payload) => {
          const updated = payload.new as CountryData;
          setData((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // === Build globe labels ===
  const labels = Object.keys(COUNTRY_COORDS).map((code) => {
    const match = data.find(
      (c) => c.region?.toUpperCase() === code.toUpperCase()
    );
    const score = match?.risk_score ?? 0;
    const confidence = match?.confidence_score ?? 70; // AI tie-in point

    // === AI-inspired color logic ===
    let color = "rgba(147,197,253,0.9)"; // Stable
    if (confidence < 40) color = "rgba(239,68,68,0.9)"; // Red – Low confidence
    else if (confidence < 70) color = "rgba(251,191,36,0.9)"; // Yellow – Medium
    else if (score >= 80) color = "rgba(255,100,100,0.9)"; // Override: High risk
    else if (score >= 60) color = "rgba(255,200,100,0.9)";

    return {
      ...COUNTRY_COORDS[code],
      text: code,
      size: hovered === code ? 3.2 : 1.6,
      color: hovered === code ? "rgba(255,255,255,1)" : color,
      risk_score: score,
      confidence_score: confidence,
      name: match?.name || code,
    };
  });

  // === Auto-focus on selected region ===
  useEffect(() => {
    if (!globeRef.current) return;
    if (regionPing && COUNTRY_COORDS[regionPing]) {
      const coords = COUNTRY_COORDS[regionPing];
      globeRef.current.pointOfView(
        { lat: coords.lat, lng: coords.lng, altitude: 1.5 },
        1500
      );
    }
  }, [regionPing]);

  // === Subtle auto-rotation ===
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25; // gentle slow spin
    globe.pointOfView({ altitude: 2.4 });
  }, []);

  // === Radar sweep rotation ===
  useEffect(() => {
    const timer = setInterval(() => {
      setAngle((prev) => (prev + 2) % 360);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      {/* === Globe === */}
      <Globe
        ref={globeRef}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.2}
        labelsData={labels}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.text}
        labelSize={(d: any) => d.size}
        labelColor={(d: any) => d.color}
        labelDotRadius={0.6}
        labelResolution={2}
        animateIn
        onLabelHover={(label: any) => setHovered(label ? label.text : null)}
        onLabelClick={(label: any) => setHovered(label.text)}
        labelAltitude={(d: any) => (hovered === d.text ? 0.05 : 0.01)}
      />

      {/* === Tooltip on hover === */}
      {hovered && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-slate-100 text-xs rounded-md px-3 py-2 shadow-lg backdrop-blur-sm border border-slate-700 pointer-events-none animate-fade">
          {(() => {
            const country = labels.find((l) => l.text === hovered);
            const risk = country?.risk_score ?? 0;
            const conf = country?.confidence_score ?? 70;
            const status =
              risk >= 80
                ? "⚠️ High Risk"
                : risk >= 60
                ? "🟡 Moderate"
                : "🟦 Stable";
            return (
              <div>
                <div className="font-semibold text-sm">{country?.name}</div>
                <div className="text-amber-300">
                  Risk: {risk} | Confidence: {conf}%
                </div>
                <div className="text-slate-400">{status}</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* === Radar sweep overlay === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[160%] h-[160%] rounded-full bg-[conic-gradient(from_0deg,rgba(59,130,246,0.2)_0deg,rgba(250,204,21,0.25)_60deg,transparent_120deg)] animate-radar blur-xl opacity-40" />
        <div
          className="absolute w-4 h-4 rounded-full bg-amber-300 blur-md opacity-80 animate-pulse"
          style={{
            transform: `rotate(${angle}deg) translateX(120px)`,
          }}
        />
      </div>

      {/* === Legend Overlay === */}
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-md text-[11px] text-slate-700 p-2 shadow-md">
        <div className="font-semibold text-[12px] mb-1 text-slate-800">
          Legend
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-400" /> <span>Stable</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-400" /> <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500" /> <span>High Risk</span>
        </div>
      </div>

      {/* === Animations === */}
      <style jsx global>{`
        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade {
          animation: fade 0.3s ease-out forwards;
        }

        @keyframes radar {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-radar {
          animation: radar 6s linear infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
