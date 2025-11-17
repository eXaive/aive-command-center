// /lib/heartbeat.ts
// 💠 A.I.V.E. Heartbeat Engine
// Scheduled runtime loop for periodic ingestion + system diagnostics.
// Runs automatically every 30 minutes on the server.

import { marketIngest } from "@/lib/ingest/marketIngest";
import { createClient } from "@supabase/supabase-js";

// Heartbeat frequency (30 minutes)
const INTERVAL_MS = 30 * 60 * 1000;

// ────────────────────────────────────────────────
// 📡 Supabase Client (Anon Key OK for logging table)
// ────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  { auth: { persistSession: false } }
);

// ────────────────────────────────────────────────
// 🧠 Heartbeat Cycle
// ────────────────────────────────────────────────

async function runHeartbeat() {
  const started = Date.now();

  console.log("🩵 A.I.V.E. Heartbeat pulse — ingestion starting…");

  try {
    // Execute ingestion task (market data, intel, predictions, etc.)
    const result = await marketIngest();

    const duration = Date.now() - started;

    const statusText = result?.status ?? "OK";
    const entries = result?.inserted ?? 0;
    const errorText = result?.error ?? null;

    // Enhanced diagnostics for CAS / A.I.V.E.
    const diagnostics = {
      timestamp: new Date().toISOString(),
      uptime_sec: Math.round(process.uptime()),
      memory_rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heartbeat_duration_ms: duration,
    };

    console.log(
      `✅ Heartbeat success: ${statusText} — ${entries} entries (${duration}ms)`
    );

    // Log to Supabase
    const { error: logErr } = await supabase.from("heartbeat_logs").insert([
      {
        status: statusText,
        entries_inserted: entries,
        duration_ms: duration,
        system_message: "A.I.V.E. Heartbeat successful",
        error: errorText,
        data: diagnostics,
      },
    ]);

    if (logErr) {
      console.warn("⚠️ Could not write heartbeat log:", logErr.message);
    } else {
      console.log("📡 Heartbeat recorded in Supabase");
    }
  } catch (err: any) {
    console.error("❌ Unhandled Heartbeat error:", err);

    // Record failure in database
    await supabase.from("heartbeat_logs").insert([
      {
        status: "Error",
        entries_inserted: 0,
        duration_ms: 0,
        system_message: "A.I.V.E. Heartbeat exception",
        error: err?.message || String(err),
        data: {
          timestamp: new Date().toISOString(),
          uptime_sec: Math.round(process.uptime()),
        },
      },
    ]);
  }
}

// ────────────────────────────────────────────────
// 🫀 Start the repeating loop
// Prevent multiple intervals on HMR reload
// ────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __AIVE_HEARTBEAT_ACTIVE__: boolean | undefined;
}

function startHeartbeat() {
  console.log("💠 A.I.V.E. Heartbeat Engine initialized (30 min interval)");

  // Run immediately
  runHeartbeat();

  // Then repeat
  setInterval(runHeartbeat, INTERVAL_MS);
}

if (typeof global !== "undefined") {
  if (!global.__AIVE_HEARTBEAT_ACTIVE__) {
    global.__AIVE_HEARTBEAT_ACTIVE__ = true;
    startHeartbeat();
  } else {
    console.log("💤 Heartbeat already active — skipping duplicate instance");
  }
}

export {};
