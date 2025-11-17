"use client";

/**
 * 💠 AiveCore (Deactivated Mode)
 * --------------------------------------------------
 * Original purpose:
 * - Render the glowing central energy orb
 * - Pulse and scale with sentiment and voice amplitude
 *
 * Deactivated purpose:
 * - Keeps import and layout stable
 * - Removes animation, pulse, and glow dynamics
 * - Provides calm, static placeholder in center
 */

export default function AiveCore({ trigger = false }: { trigger?: boolean }) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: "5rem",
        height: "5rem",
        background:
          "radial-gradient(circle, rgba(100,150,255,0.15) 0%, transparent 70%)",
        filter: "blur(6px)",
        pointerEvents: "none",
      }}
    >
      {/* 🔕 AiveCore visual effects disabled for calm mode */}
      <div className="text-[10px] text-sky-400/50 tracking-widest uppercase">
        Core Offline
      </div>
    </div>
  );
}
