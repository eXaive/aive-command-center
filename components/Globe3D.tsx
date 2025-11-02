"use client";

import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

interface Globe3DProps {
  width?: number;
  height?: number;
  onRegionSelect?: (region: string) => void;
}

const REGIONS = [
  { name: "ALL", lat: 0, lng: 0 },
  { name: "US", lat: 37.1, lng: -95.7 },
  { name: "EU", lat: 50.1, lng: 8.6 },
  { name: "ASIA", lat: 35.7, lng: 139.7 },
  { name: "AFRICA", lat: 1.3, lng: 32.3 },
  { name: "LATAM", lat: -14.2, lng: -51.9 },
];

export default function Globe3D({
  width = 260,
  height = 260,
  onRegionSelect,
}: Globe3DProps) {
  const globeRef = useRef<any>(null);
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  useEffect(() => {
    const globe = globeRef.current;
    if (globe) {
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.4;
      globe.pointOfView({ altitude: 2.4 });
    }
  }, []);

  const handleRegionClick = (label: any) => {
    const regionName = label?.name || "ALL";
    console.log("🌍 Region clicked:", regionName);
    setSelectedRegion(regionName);
    onRegionSelect?.(regionName);
  };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: "1rem",
        overflow: "hidden",
        background: "radial-gradient(circle at 30% 30%, #0f172a, #1e293b)",
      }}
      className="shadow-inner relative"
    >
      <Globe
        ref={globeRef}
        width={width}
        height={height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        labelsData={REGIONS}
        labelLat={(d) => d.lat}
        labelLng={(d) => d.lng}
        labelText={(d) => d.name}
        labelColor={(d) =>
          d.name === selectedRegion ? "gold" : "rgba(255,255,255,0.85)"
        }
        labelSize={(d) => (d.name === selectedRegion ? 1.8 : 1.3)}
        labelDotRadius={() => 0.4}
        labelResolution={2}
        onLabelClick={handleRegionClick}
      />

      {/* Floating tag */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 text-slate-800 text-xs px-3 py-1.5 rounded-full shadow-md transition-all">
        🌎 Region: <b>{selectedRegion}</b>
      </div>
    </div>
  );
}
