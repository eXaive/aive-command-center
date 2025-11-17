// app/layout.tsx
// ✅ Server Component (no "use client")

import "@/lib/heartbeat";
import "./globals.css";
import StarField from "@/components/StarField";
import GlobeBackground from "@/components/GlobeBackground";
import { NeuralStateProvider } from "@/context/NeuralStateContext";
import { PredictionFilterProvider } from "@/context/PredictionFilterContext";
import ClientFadeMount from "@/components/ClientFadeMount"; // 👈 NEW client wrapper

export const metadata = {
  title: "A.I.V.E. Command Center",
  description: "Awareness • Intelligence • Verification • Evolution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-white antialiased">
        <NeuralStateProvider>
          <PredictionFilterProvider>
            {/* 🌌 Persistent Background Layers */}
            <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
              <div className="absolute inset-0">
                <StarField />
              </div>
              <div className="absolute inset-0 z-10 opacity-90 scale-[1.05]">
                <GlobeBackground activeCountry="Global" />
              </div>
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-slate-950/10 to-slate-950/70" />
            </div>

            {/* 🌠 Foreground Layer (client fade wrapper) */}
            <ClientFadeMount>{children}</ClientFadeMount>
          </PredictionFilterProvider>
        </NeuralStateProvider>
      </body>
    </html>
  );
}
