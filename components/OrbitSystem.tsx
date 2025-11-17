"use client";

/**
 * 🌌 OrbitSystem (Deactivated Mode)
 * --------------------------------------------------
 * Original purpose:
 * - Render orbit rings and rotating planetary nodes
 * - Sync visual orbiting with neural events
 *
 * Deactivated purpose:
 * - Removes rings, orbiting dots, and blur
 * - Leaves only an invisible placeholder to preserve layout
 */

export default function OrbitSystem() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "transparent",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* 🔕 Orbit visuals disabled for Calm Mode */}
    </div>
  );
}
