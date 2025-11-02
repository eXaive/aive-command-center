'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import AiveCore from './AiveCore';

// ✅ Import the 3D globe dynamically (avoids window errors)
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface GlobeBackgroundProps {
  activeCountry?: string;
}

export default function GlobeBackground({ activeCountry }: GlobeBackgroundProps) {
  const globeRef = useRef<any>(null);
  const [pulseActive, setPulseActive] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  // Initialize voice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeech(new SpeechSynthesisUtterance());
    }
  }, []);

  // 🌍 Initialize the rotating globe
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.25;
    globe.controls().enableZoom = false;
    globe.controls().enablePan = false;
    globe.globeMaterial().color.set('#00111a');
    globe.globeMaterial().opacity = 0.35;
  }, []);

  // 🎯 Handle country focus (rotation, voice, hum)
  useEffect(() => {
    if (!activeCountry || !globeRef.current) return;
    const globe = globeRef.current;

    const latLng = getCountryCoords(activeCountry);
    if (latLng) {
      globe.pointOfView({ lat: latLng.lat, lng: latLng.lng, altitude: 2.2 }, 1500);
    }

    // Trigger the neural flare
    setPulseActive(true);
    const t = setTimeout(() => setPulseActive(false), 3000);

    // Play hum sound (soft activation tone)
    // 🎧 A.I.V.E. activation sound sequence
const hum = new Audio('/sounds/aive_hum_v2.mp3'); // current hum
const focusTone = new Audio('/sounds/aive_focus.mp3'); // new shimmer
hum.volume = 0.45;
focusTone.volume = 0.55;

// play hum first
hum.play().catch(() => {});

// then softly trigger the shimmer 2.6 s later (when rings peak)
setTimeout(() => {
  focusTone.play().catch(() => {});
}, 2600);


    // A.I.V.E. speaks
    if (speech) {
      // Reset any queued speech
      window.speechSynthesis.cancel();

      const utter = new SpeechSynthesisUtterance(`${activeCountry}. Focusing.`);
      utter.pitch = 1.1;
      utter.rate = 0.95;
      utter.volume = 0.8;
      window.speechSynthesis.speak(utter);
    }

    return () => clearTimeout(t);
  }, [activeCountry, speech]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden z-0">
      {/* === Background Globe === */}
      <div className="absolute w-full h-full opacity-30">
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          arcsData={[]}
          atmosphereColor="#00ffff"
          atmosphereAltitude={0.1}
        />
      </div>

      {/* === Neural Core + Concentric Flare Pulse === */}
      <div className="absolute inset-0 z-40 flex items-center justify-center">
        <AiveCore trigger={pulseActive} />

        {/* 🌐 Expanding Rings (Concentric pulse) */}
        {pulseActive && (
          <>
            {/* First expanding ring */}
            <motion.div
              key={`ring1-${Date.now()}`}
              className="absolute w-40 h-40 rounded-full border border-cyan-400/40"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
            />
            {/* Second expanding ring, slightly delayed */}
            <motion.div
              key={`ring2-${Date.now() + 1}`}
              className="absolute w-32 h-32 rounded-full border border-blue-400/40"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: [1, 2.8], opacity: [0.7, 0] }}
              transition={{ duration: 3, delay: 0.4, ease: 'easeOut' }}
            />
          </>
        )}
      </div>

      {/* === Status Label === */}
      <motion.div
        className="absolute bottom-10 text-center text-cyan-400 text-sm tracking-wide"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Neural Pulse: {pulseActive ? 'Active' : 'Listening'}
      </motion.div>
    </div>
  );
}

// 🔹 Simple coordinate lookup table for popular countries
function getCountryCoords(country: string): { lat: number; lng: number } | null {
  const lookup: Record<string, { lat: number; lng: number }> = {
    USA: { lat: 38, lng: -97 },
    India: { lat: 21, lng: 78 },
    China: { lat: 35, lng: 104 },
    Russia: { lat: 61, lng: 105 },
    Canada: { lat: 56, lng: -106 },
    Germany: { lat: 51, lng: 10 },
    Japan: { lat: 36, lng: 138 },
    Brazil: { lat: -14, lng: -51 },
    'United Kingdom': { lat: 55, lng: -3 },
    Global: { lat: 0, lng: 0 },
  };
  return lookup[country] || null;
}
