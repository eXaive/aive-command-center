"use client";

/**
 * 🧘 NeuralHalo (Deactivated Mode)
 * --------------------------------------------------
 * Original purpose:
 * - Render animated halo lines, ripples, and glows around the neural core
 * - React in real-time to sentiment and Supabase memory events
 *
 * Deactivated purpose:
 * - Keeps app imports valid but disables motion and rendering
 * - Provides a still, minimal placeholder layer
 * - Useful for calm UI phases or debug / performance testing
 */

export default function NeuralHalo({ status = "Stable" }: { status?: string }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      {/* 🔕 NeuralHalo visuals disabled for calm mode */}
      <div className="text-xs text-sky-400/40 font-light tracking-widest mt-2">
        Neural Core: {status}
      </div>
    </div>
  );
}

