// /lib/casMemoryEngine.ts
// A.I.V.E. – Causal Awareness System (CAS)
// Core engine for causal memory, reflection cycles, and confidence learning.

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

/* ────────────────────────────────────────────────
   🔐 SECURE SERVER CLIENT (Service Role)
   - ONLY used in server-side functions or API routes
   - Never shipped to the client bundle
────────────────────────────────────────────────── */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "❌ A.I.V.E. CAS Engine missing environment vars. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

// Server-only Supabase instance (service role = full write power)
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

/* ────────────────────────────────────────────────
   🧠 recordCausalMemory()
   Writes a single causal observation into CAS memory.
────────────────────────────────────────────────── */

export async function recordCausalMemory({
  country,
  category,
  cause,
  effect,
  reflection,
  confidence,
  source_type = "LearningFeed",
  source_id,
}: {
  country: string;
  category: string;
  cause: string;
  effect: string;
  reflection?: string;
  confidence?: number;
  source_type?: string;
  source_id?: string;
}) {
  try {
    if (!country || !cause || !effect) {
      console.warn("⚠️ CAS Memory skipped: missing essential fields.");
      return;
    }

    const payload = {
      country,
      category,
      cause,
      effect,
      reflection: reflection || null,
      confidence: confidence ?? 0.75,
      source_type,
      source_id: source_id || null,
      learned_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("cas_memory").insert([payload]);

    if (error) throw error;

    console.log(
      `🧠 CAS Updated: [${country}] ${cause} → ${effect} (conf=${payload.confidence})`
    );
  } catch (err) {
    console.error("❌ CAS Memory Insert Error:", err);
  }
}

/* ────────────────────────────────────────────────
   📊 updateCountryConfidence()
   Computes average confidence for a SINGLE COUNTRY.
────────────────────────────────────────────────── */

export async function updateCountryConfidence(country: string) {
  try {
    const { data, error } = await supabase
      .from("cas_memory")
      .select("confidence")
      .eq("country", country);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log(`ℹ️ No CAS data for ${country} — skipping.`);
      return;
    }

    const avg =
      data.reduce((sum, r) => sum + (r.confidence ?? 0), 0) / data.length;

    const { error: metaError } = await supabase
      .from("cas_memory_meta")
      .upsert([
        {
          country,
          average_confidence: avg,
          last_updated: new Date().toISOString(),
        },
      ]);

    if (metaError) throw metaError;

    console.log(
      `📈 A.I.V.E. Confidence Updated → ${country}: ${avg.toFixed(2)}`
    );
  } catch (err) {
    console.error(`❌ updateCountryConfidence(${country}) Error:`, err);
  }
}

/* ────────────────────────────────────────────────
   🔁 syncCausalEntriesToMemory()
   Takes raw causal_entries → stores them into CAS memory.
────────────────────────────────────────────────── */

export async function syncCausalEntriesToMemory(limit = 50) {
  try {
    const { data, error } = await supabase
      .from("causal_entries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("ℹ️ No causal_entries found — nothing to sync.");
      return;
    }

    console.log(`🔄 Syncing ${data.length} entries into CAS memory…`);

    for (const entry of data) {
      await recordCausalMemory({
        country: entry.country,
        category: entry.category,
        cause: entry.cause,
        effect: entry.effect,
        reflection: entry.reflection || undefined,
        confidence: entry.confidence,
        source_type: "LearningFeed",
        source_id: entry.id,
      });
    }

    console.log("✅ CAS sync completed.");
  } catch (err) {
    console.error("❌ CAS Sync Error:", err);
  }
}

/* ────────────────────────────────────────────────
   🌍 A.I.V.E. Reflection Cycle (Full System Update)
   - Sync causal entries
   - Recompute confidence scores
   - Future: Trigger neural pulse animations
────────────────────────────────────────────────── */

export async function runAiveReflectionCycle() {
  console.log("🧠 Starting A.I.V.E. Reflection Cycle…");

  try {
    await syncCausalEntriesToMemory(30);

    // Full COUNTRY-ONLY list
    const countries = [
      "United States",
      "Germany",
      "India",
      "China",
      "Jamaica",
      "Japan",
      "Brazil",
      "Canada",
      "Nigeria",
      "South Africa",
    ];

    for (const c of countries) {
      await updateCountryConfidence(c);
    }

    console.log("🌐 Reflection Cycle Complete — System Memory Updated.");
  } catch (err) {
    console.error("❌ A.I.V.E. Reflection Cycle Error:", err);
  }
}
