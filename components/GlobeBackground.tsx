"use client";

/**
 * 🌍 GlobeBackground (Minimal Mode)
 * --------------------------------------------------
 * Removes all circular overlays, radial gradients, and globe outlines.
 * Keeps only the starfield-compatible dark background.
 */

export default function GlobeBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 bg-slate-950"
      style={{
        background:
          "radial-gradient(circle at center, rgba(15,23,42,0.98) 0%, rgba(2,6,23,1) 100%)",
      }}
    />
  );
}
