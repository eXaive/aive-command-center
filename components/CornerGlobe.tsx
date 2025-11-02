"use client";

import React, { useState } from "react";

type Props = {
  region: "ALL" | "US" | "EU" | "ASIA";
  /** "overlay" = absolute corner overlay; "boxed" = static box (for side column) */
  mode?: "overlay" | "boxed";
};

export default function CornerGlobe({ region, mode = "overlay" }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (mode === "boxed") {
    // Static, non-absolute globe for the right column
    return (
      <div
        className="relative w-full h-full rounded-xl border bg-white/60 backdrop-blur overflow-hidden"
        style={{ boxShadow: "0 10px 30px rgba(2,6,23,0.08)" }}
      >
        <div className="absolute left-2 top-2 z-10 text-[11px] px-2 py-0.5 rounded bg-white/90 border text-slate-600">
          Global View
        </div>
        <GlobeSVG region={region} />
      </div>
    );
  }

  // Overlay/corner version (kept here if you ever want it inside a card again)
  const containerClass =
    "absolute z-30 transition-all duration-500" +
    (expanded
      ? " inset-0 m-4 rounded-xl border bg-white/10 backdrop-blur"
      : " right-4 top-4 w-[220px] h-[220px] rounded-xl border bg-white/50 backdrop-blur");

  return (
    <div
      className={`${containerClass} globe-wrap`}
      style={{ boxShadow: "0 10px 30px rgba(2,6,23,0.15)", overflow: "hidden" }}
    >
      <div className="absolute right-2 top-2 flex gap-2 z-10">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="px-2 py-1 rounded-md border text-xs bg-white/90 hover:bg-white"
          title={expanded ? "Close Globe" : "Expand Globe"}
        >
          {expanded ? "Close" : "Expand"}
        </button>
      </div>
      <GlobeSVG region={region} />
      <style jsx global>{`
        @keyframes ex-globe-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .globe-wrap .globe-spin { animation: ex-globe-spin 40s linear infinite; }
        .globe-wrap:hover .globe-spin { animation-play-state: paused; }
      `}</style>
    </div>
  );
}

function GlobeSVG({ region }: { region: Props["region"] }) {
  return (
    <div className="w-full h-full p-2 relative">
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-xl" role="img" aria-label="Global view">
        <defs>
          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="60%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
          <radialGradient id="sun" cx="35%" cy="35%" r="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="95" fill="url(#blueGlow)" stroke="#fff" strokeWidth="0.6" />
        <circle cx="80" cy="80" r="70" fill="url(#sun)" />

        <g className="globe-spin" transformOrigin="100px 100px">
          <g stroke="rgba(255,255,255,0.55)" strokeWidth="0.7" fill="none">
            {[-60, -30, 0, 30, 60].map((lat, i) => (
              <ellipse key={`lat-${i}`} cx="100" cy="100" rx="80" ry={80 * Math.cos((Math.PI / 180) * lat)} />
            ))}
            {[-60, -30, 0, 30, 60].map((lon, i) => {
              const s = Math.sin((Math.PI / 180) * lon);
              return (
                <path key={`lon-${i}`} d={`M100,20 C${100 + 60 * s},60 ${100 + 60 * s},140 100,180`} />
              );
            })}
          </g>
        </g>

        <text
          x="50%"
          y="95%"
          textAnchor="middle"
          fontSize="12"
          fill="white"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        >
          {region === "ALL" ? "Global View" : `Region: ${region}`}
        </text>
      </svg>
    </div>
  );
}
